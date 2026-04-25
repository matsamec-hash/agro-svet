#!/usr/bin/env node
// Scrape JCB product hierarchy from sitemap + page titles.
//
// Strategy (Lemken pattern, adapted for JCB's UK multi-language site):
//   1. Fetch sitemap index from https://www.jcb.com/sitemap.xml.
//   2. Filter URLs under /en-gb/products/.
//   3. STRICT AG FILTER — only keep agricultural product subtrees:
//        - /loadall/                 (telescopic handlers)
//        - /telescopic-handlers/     (alt path)
//        - /agricultural-loaders/    (alt path)
//        - /fastrac/                 (high-speed tractors)
//        - /agriculture/             (top-level agri hub)
//      Skip: backhoe loaders, excavators, dumpsters, aerial platforms,
//      compaction, generators, military, industrial.
//   4. Leaf detection — keep URLs that aren't a prefix of another URL.
//   5. Fetch <title> for each leaf; parse "ModelName | JCB" / "ModelName - JCB".
//   6. Filter: title must include alphabetic slug-derived token (e.g. "loadall"
//      or numeric series like "525-60") OR a digit-pair model code.
//   7. Build tree: cat → sub → family → models.
//
// Usage: node scripts/jcb-api-scrape.mjs > scripts/jcb-api-data.json

const SITEMAP_INDEX = 'https://www.jcb.com/sitemap.xml';
const URL_PREFIX_RE = /\/en-gb\/products\//;
const URL_PREFIX_STR = '/en-gb/products/';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0.0.0';
const CONCURRENCY = 6;
const BRAND_NAME = 'JCB';

// Strict ag-only path tokens. URL path (after /en-gb/products/) must contain
// one of these as a segment to be considered.
const AG_PATH_TOKENS = [
  'loadall',
  'telescopic-handler',
  'telescopic-handlers',
  'agricultural-loaders',
  'agricultural-loader',
  'fastrac',
  'agriculture',
  'agri',
  // Compact wheel loaders (relevant for ag yards)
  'compact-wheel-loader',
  'compact-wheel-loaders',
];

// Hard exclude tokens — even if AG token matches, drop these.
const NON_AG_EXCLUDE = [
  'backhoe-loader', 'backhoe-loaders',
  'excavator', 'excavators',
  'site-dumper', 'site-dumpers',
  'access-platform', 'access-platforms',
  'access-equipment',
  'generator', 'generators',
  'military', 'defence', 'defense',
  'compaction',
  'industrial-forklift', 'industrial-forklifts',
  'rough-terrain-forklift',
  'skid-steer', // JCB skid steers marketed industrial
  'tracked-loader',
  'wheeled-shovel',
];

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/xml,text/html' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.text();
}

function extractLocs(xml) {
  const re = /<loc>([^<]+)<\/loc>/g;
  const urls = [];
  let m;
  while ((m = re.exec(xml)) !== null) urls.push(m[1].replace(/&amp;/g, '&'));
  return urls;
}

function decodeEntities(s) {
  return s.replace(/&#124;/g, '|').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#039;/g, "'");
}

function extractTitle(html) {
  const m = html.match(/<title>([^<]+)<\/title>/i);
  return m ? decodeEntities(m[1]).trim() : null;
}

function parseTitle(title) {
  // "JCB Loadall 525-60 Agri | JCB"
  // "Loadall 525-60 | JCB.com"
  // "Fastrac 4220 | JCB"
  if (!title) return null;
  let noBrand = title.replace(/\s*[|–-]\s*JCB(\.com)?\s*$/i, '').trim();
  noBrand = noBrand.replace(/^JCB\s+/i, '').trim();
  const colonIdx = noBrand.indexOf(':');
  if (colonIdx > 0) {
    return {
      name: noBrand.slice(0, colonIdx).trim(),
      tagline: noBrand.slice(colonIdx + 1).trim(),
    };
  }
  return { name: noBrand, tagline: '' };
}

function slugTokens(slug) {
  return slug.split('-').filter(Boolean);
}

function nameContainsSlugTokens(name, slug) {
  // Match if alpha token (>=3 chars) appears in title, OR if slug contains
  // a digit-pair model code (e.g. "525-60") and that code appears in title.
  const tokens = slugTokens(slug);
  if (tokens.length === 0) return false;
  const lname = name.toLowerCase();
  for (const t of tokens) {
    if (/^[a-z]{3,}$/.test(t) && lname.includes(t)) return true;
  }
  // Numeric model code like "525-60" or "542-70"
  const codeMatch = slug.match(/\d{3}-?\d{2,3}/);
  if (codeMatch && lname.includes(codeMatch[0].toLowerCase())) return true;
  // Fastrac numeric like "4220", "8330"
  const num4 = slug.match(/\d{4}/);
  if (num4 && lname.includes(num4[0])) return true;
  return false;
}

function pathHasAgToken(path) {
  const segs = path.toLowerCase().split('/');
  return segs.some((s) => AG_PATH_TOKENS.includes(s));
}

function pathHasExcludeToken(path) {
  const lp = path.toLowerCase();
  return NON_AG_EXCLUDE.some((t) => lp.includes(t));
}

async function fetchLeafTitle(url) {
  try {
    const html = await fetchText(url);
    return extractTitle(html);
  } catch (e) {
    return null;
  }
}

async function pool(items, fn, concurrency) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (true) {
      const i = next++;
      if (i >= items.length) return;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

async function main() {
  console.error('Fetching sitemap index…');
  let indexXml;
  try {
    indexXml = await fetchText(SITEMAP_INDEX);
  } catch (e) {
    console.error('Failed to fetch sitemap, trying fallback /sitemap_index.xml');
    indexXml = await fetchText('https://www.jcb.com/sitemap_index.xml');
  }
  const subSitemaps = extractLocs(indexXml);
  console.error(`  → ${subSitemaps.length} sub-sitemaps`);

  const allUrls = new Set();
  for (const sub of subSitemaps) {
    try {
      const xml = await fetchText(sub);
      const locs = extractLocs(xml);
      // If this is a nested index (locs contain .xml), skip — they’ll be in subSitemaps already
      // Otherwise add them as URLs.
      locs.forEach((u) => {
        if (!u.endsWith('.xml')) allUrls.add(u);
      });
    } catch (e) {
      console.error(`  ! ${sub} failed: ${e.message}`);
    }
  }
  console.error(`  → ${allUrls.size} total URLs`);

  const productUrls = [...allUrls].filter((u) => URL_PREFIX_RE.test(u));
  console.error(`  → ${productUrls.length} under ${URL_PREFIX_STR}`);

  // Build path set (relative to /en-gb/products/) + ag filter + leaf detection
  const pathSet = new Set();
  for (const url of productUrls) {
    const m = url.match(new RegExp(`${URL_PREFIX_STR.replace(/[/\-]/g, '\\$&')}(.+?)/?$`));
    if (!m) continue;
    const path = m[1];
    if (pathHasExcludeToken(path)) continue;
    if (!pathHasAgToken(path)) continue;
    pathSet.add(path);
  }
  console.error(`  → ${pathSet.size} ag-filtered paths`);

  function isLeaf(path) {
    for (const other of pathSet) {
      if (other === path) continue;
      if (other.startsWith(path + '/')) return false;
    }
    return true;
  }
  const leaves = [...pathSet].filter(isLeaf);
  console.error(`  → ${leaves.length} leaves`);

  console.error(`\nFetching titles (concurrency ${CONCURRENCY})…`);
  const titleData = await pool(
    leaves,
    async (path, i) => {
      const url = `https://www.jcb.com${URL_PREFIX_STR}${path}`;
      const title = await fetchLeafTitle(url);
      if ((i + 1) % 10 === 0) console.error(`  ${i + 1}/${leaves.length}`);
      return { path, url, title };
    },
    CONCURRENCY,
  );
  console.error(`  done`);

  // Build tree, filtering by name-token match
  const tree = {};
  let kept = 0, dropped = 0;
  const droppedSamples = [];
  for (const { path, url, title } of titleData) {
    const segments = path.split('/');
    if (segments.length < 1) continue;

    const modelSlug = segments[segments.length - 1];
    const parsed = parseTitle(title);
    if (!parsed || !nameContainsSlugTokens(parsed.name, modelSlug)) {
      dropped++;
      if (droppedSamples.length < 8) droppedSamples.push(`${title || '(no title)'}  ←  ${path}`);
      continue;
    }
    kept++;

    let category, subcategory, family;
    if (segments.length === 1) {
      category = '_root';
      subcategory = '_root';
      family = modelSlug;
    } else if (segments.length === 2) {
      [category] = segments;
      subcategory = '_root';
      family = modelSlug;
    } else if (segments.length === 3) {
      [category, subcategory] = segments;
      family = modelSlug;
    } else if (segments.length === 4) {
      [category, subcategory, family] = segments;
    } else {
      category = segments[0];
      subcategory = segments[1];
      family = segments.slice(2, -1).join('/');
    }

    if (!tree[category]) tree[category] = {};
    if (!tree[category][subcategory]) tree[category][subcategory] = {};
    if (!tree[category][subcategory][family]) {
      tree[category][subcategory][family] = {
        slug: family.split('/').pop(),
        models: [],
      };
    }
    tree[category][subcategory][family].models.push({
      slug: modelSlug,
      name: parsed.name,
      tagline: parsed.tagline,
      url,
    });
  }

  console.error(`\nKept: ${kept} models, Dropped: ${dropped} non-product pages`);
  if (droppedSamples.length) {
    console.error(`\nDropped sample:`);
    droppedSamples.forEach((s) => console.error(`  - ${s}`));
  }

  let totalFamilies = 0;
  for (const cat of Object.keys(tree)) {
    for (const sub of Object.keys(tree[cat])) totalFamilies += Object.keys(tree[cat][sub]).length;
  }
  console.error(`\nResult: ${Object.keys(tree).length} categories, ${totalFamilies} families, ${kept} models\n`);
  for (const cat of Object.keys(tree).sort()) {
    const subs = Object.keys(tree[cat]);
    const famCount = subs.reduce((acc, s) => acc + Object.keys(tree[cat][s]).length, 0);
    const modCount = subs.reduce((acc, s) => acc + Object.values(tree[cat][s]).reduce((mm, f) => mm + f.models.length, 0), 0);
    console.error(`  ${cat}: ${famCount} families, ${modCount} models`);
  }

  console.log(JSON.stringify(tree, null, 2));
}

main().catch((err) => { console.error(err); process.exit(1); });
