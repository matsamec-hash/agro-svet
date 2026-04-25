#!/usr/bin/env node
// Scrape Amazone product hierarchy from sitemap + page titles.
// Adapted from scripts/lemken-api-scrape.mjs.
//
// Strategy:
//   1. Fetch sitemap index from https://amazone.de/sitemap.xml
//      (path may vary — see robots.txt; common alternates listed in
//      SITEMAP_CANDIDATES below).
//   2. Filter URLs under product paths (/de/produkte/ for German site,
//      /en/products/ if EN locale present).
//   3. Leaf detection — keep only URLs that aren't a prefix of another URL.
//   4. Fetch <title> for each leaf; parse "ModelName | Amazone" or
//      "ModelName: Type | Amazone".
//   5. Filter: real product titles must include the URL-derived model token
//      so marketing/landing pages get filtered out.
//   6. Build tree: cat → sub → family → models with parsed display names.
//
// Usage: node scripts/amazone-api-scrape.mjs > scripts/amazone-api-data.json

const SITEMAP_CANDIDATES = [
  'https://amazone.de/sitemap.xml',
  'https://amazone.de/sitemap_index.xml',
  'https://amazone.de/de/sitemap.xml',
  'https://amazone.de/en/sitemap.xml',
];
const PRODUCT_PATH_PATTERNS = [
  '/de/produkte/',
  '/en/products/',
  '/de-de/produkte/',
  '/en-en/products/',
];
const BRAND_TOKEN_REGEX = /\|\s*AMAZONE\s*$/i;
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0.0.0';
const CONCURRENCY = 6;

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/xml,text/html' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.text();
}

async function tryFetchText(url) {
  try { return await fetchText(url); } catch { return null; }
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
  const m = html.match(/<title>([^<]+)<\/title>/);
  return m ? decodeEntities(m[1]).trim() : null;
}

function parseTitle(title) {
  // "Cirrus 6003-2 | AMAZONE"
  // "ZA-V Fertiliser Spreader | AMAZONE"
  // "Cataya 3000 Super: Mechanical seed drill | AMAZONE"
  if (!title) return null;
  const noBrand = title.replace(BRAND_TOKEN_REGEX, '').trim();
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
  const tokens = slugTokens(slug);
  if (tokens.length === 0) return false;
  const lname = name.toLowerCase();
  // At least one alphabetic 3+ char slug token must appear in the title.
  return tokens.some((t) => /^[a-z]{3,}$/.test(t) && lname.includes(t));
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

async function loadSitemapIndex() {
  for (const candidate of SITEMAP_CANDIDATES) {
    console.error(`Trying ${candidate}…`);
    const xml = await tryFetchText(candidate);
    if (xml) {
      console.error(`  → success`);
      return { url: candidate, xml };
    }
  }
  // Last resort: parse robots.txt for a Sitemap: line.
  console.error(`Trying robots.txt…`);
  const robots = await tryFetchText('https://amazone.de/robots.txt');
  if (robots) {
    const m = robots.match(/^Sitemap:\s*(\S+)/im);
    if (m) {
      console.error(`  → robots Sitemap: ${m[1]}`);
      const xml = await tryFetchText(m[1]);
      if (xml) return { url: m[1], xml };
    }
  }
  throw new Error('No sitemap could be fetched');
}

function pickProductPath(url) {
  for (const p of PRODUCT_PATH_PATTERNS) {
    if (url.includes(p)) return p;
  }
  return null;
}

async function main() {
  console.error('Locating sitemap…');
  const { xml: indexXml } = await loadSitemapIndex();

  // The first sitemap could be an index of sub-sitemaps OR a flat URL sitemap.
  let initialLocs = extractLocs(indexXml);
  console.error(`  → ${initialLocs.length} entries in initial sitemap`);

  // If entries point to .xml files, treat as index and recurse.
  const subSitemaps = initialLocs.filter((u) => u.endsWith('.xml') || u.includes('sitemap'));
  const allUrls = new Set();

  if (subSitemaps.length > 0 && subSitemaps.length === initialLocs.length) {
    console.error(`  → looks like sitemap index, fetching ${subSitemaps.length} sub-sitemaps`);
    for (const sub of subSitemaps) {
      const sx = await tryFetchText(sub);
      if (!sx) continue;
      extractLocs(sx).forEach((u) => allUrls.add(u));
    }
  } else {
    initialLocs.forEach((u) => allUrls.add(u));
  }
  console.error(`  → ${allUrls.size} total URLs`);

  // Detect dominant product path
  const pathCounts = new Map();
  for (const u of allUrls) {
    const p = pickProductPath(u);
    if (p) pathCounts.set(p, (pathCounts.get(p) || 0) + 1);
  }
  if (pathCounts.size === 0) {
    throw new Error('No product paths detected. Inspect sitemap manually.');
  }
  const [productPath] = [...pathCounts.entries()].sort((a, b) => b[1] - a[1])[0];
  console.error(`  → using product path "${productPath}" (${pathCounts.get(productPath)} URLs)`);

  const productUrls = [...allUrls].filter((u) => u.includes(productPath));

  // Build path set + leaf detection
  const pathSet = new Set();
  const productRe = new RegExp(`${productPath.replace(/\//g, '\\/')}(.+?)\\/?$`);
  for (const url of productUrls) {
    const m = url.match(productRe);
    if (m) pathSet.add(m[1]);
  }
  function isLeaf(path) {
    for (const other of pathSet) {
      if (other === path) continue;
      if (other.startsWith(path + '/')) return false;
    }
    return true;
  }
  const leaves = [...pathSet].filter(isLeaf);
  console.error(`  → ${leaves.length} leaves`);

  // Fetch <title> for each leaf in parallel
  console.error(`\nFetching titles (concurrency ${CONCURRENCY})…`);
  const titleData = await pool(
    leaves,
    async (path, i) => {
      const url = `https://amazone.de${productPath}${path}`;
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
    if (segments.length < 2) continue;

    const modelSlug = segments[segments.length - 1];
    const parsed = parseTitle(title);
    if (!parsed || !nameContainsSlugTokens(parsed.name, modelSlug)) {
      dropped++;
      if (droppedSamples.length < 8) droppedSamples.push(`${title || '(no title)'}  ←  ${path}`);
      continue;
    }
    kept++;

    let category, subcategory, family;
    if (segments.length === 2) {
      [category] = segments;
      subcategory = '_root';
      family = modelSlug;
    } else if (segments.length === 3) {
      [category, subcategory] = segments;
      family = modelSlug;
    } else if (segments.length === 4) {
      [category, subcategory, family] = segments;
    } else if (segments.length >= 5) {
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
