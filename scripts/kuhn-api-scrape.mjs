#!/usr/bin/env node
// Scrape Kuhn product hierarchy from sitemap + page titles.
//
// Strategy (mirror of lemken-api-scrape.mjs):
//   1. Fetch root sitemap (sitemap_index.xml or sitemap.xml).
//   2. Recursively expand sub-sitemaps; collect all <loc> URLs.
//   3. Filter URLs under /en/products/ (or /en-int/products/, depending on
//      what Kuhn currently serves). Falls back to multiple URL prefixes.
//   4. Leaf detection — keep only URLs that aren't a prefix of another URL.
//   5. Fetch <title> for each leaf in parallel; parse "Model | Kuhn".
//   6. Filter: real product titles must include the URL-derived model token
//      (e.g. "axis-h-emc-w" → title contains "AXIS"). Marketing pages
//      like "News | KUHN" get filtered out.
//   7. Build tree: cat → sub → family → models with parsed display names.
//
// Usage: node scripts/kuhn-api-scrape.mjs > scripts/kuhn-api-data.json
//
// Note: Kuhn's site has multiple language editions. We try `en-int` first
// (international English) which has the broadest catalog, then fall back
// to `en` (UK) and `fr` (France HQ).

const SITEMAP_CANDIDATES = [
  'https://www.kuhn.com/sitemap_index.xml',
  'https://www.kuhn.com/sitemap.xml',
  'https://www.kuhn.com/en-int/sitemap.xml',
  'https://www.kuhn.com/en/sitemap.xml',
];
const PRODUCT_PATH_PATTERNS = [
  '/en-int/products/',
  '/en/products/',
  '/en-int/range/',
  '/en/range/',
];
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0.0.0';
const CONCURRENCY = 6;

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
  const m = html.match(/<title>([^<]+)<\/title>/);
  return m ? decodeEntities(m[1]).trim() : null;
}

function parseTitle(title) {
  // "AXIS H EMC W | KUHN"
  // "MERGE MAXX 950 - Pick-up windrower | KUHN"
  // "News | KUHN" — generic page
  if (!title) return null;
  const noBrand = title.replace(/\s*\|\s*KUHN\s*$/i, '').trim();
  const dashIdx = noBrand.indexOf(' - ');
  const colonIdx = noBrand.indexOf(':');
  const sep = (dashIdx > 0 && (colonIdx < 0 || dashIdx < colonIdx)) ? dashIdx : colonIdx;
  if (sep > 0) {
    return {
      name: noBrand.slice(0, sep).trim(),
      tagline: noBrand.slice(sep + (sep === dashIdx ? 3 : 1)).trim(),
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

async function expandSitemap(rootUrl, allUrls, depth = 0) {
  if (depth > 4) return;
  let xml;
  try {
    xml = await fetchText(rootUrl);
  } catch (e) {
    console.error(`  ! failed: ${rootUrl} (${e.message})`);
    return;
  }
  const isIndex = /<sitemapindex/i.test(xml);
  const locs = extractLocs(xml);
  if (isIndex) {
    for (const sub of locs) {
      await expandSitemap(sub, allUrls, depth + 1);
    }
  } else {
    locs.forEach((u) => allUrls.add(u));
  }
}

function pickProductPrefix(urls) {
  // Auto-detect which prefix has the most URLs.
  const counts = {};
  for (const p of PRODUCT_PATH_PATTERNS) counts[p] = 0;
  for (const u of urls) {
    for (const p of PRODUCT_PATH_PATTERNS) {
      if (u.includes(p)) counts[p]++;
    }
  }
  let best = null, bestN = 0;
  for (const [p, n] of Object.entries(counts)) {
    console.error(`  prefix ${p}: ${n} URLs`);
    if (n > bestN) { best = p; bestN = n; }
  }
  return best;
}

async function main() {
  console.error('Trying Kuhn sitemap candidates…');
  const allUrls = new Set();
  for (const root of SITEMAP_CANDIDATES) {
    console.error(`  → ${root}`);
    const before = allUrls.size;
    await expandSitemap(root, allUrls);
    if (allUrls.size > before) {
      console.error(`    +${allUrls.size - before} URLs`);
      // First successful sitemap is usually enough.
      break;
    }
  }
  console.error(`  → ${allUrls.size} total URLs`);

  if (allUrls.size === 0) {
    console.error('No URLs found. Output empty tree.');
    console.log('{}');
    return;
  }

  const productPrefix = pickProductPrefix([...allUrls]);
  if (!productPrefix) {
    console.error('No product prefix matched. Output empty tree.');
    console.log('{}');
    return;
  }
  console.error(`  using prefix: ${productPrefix}`);

  const productUrls = [...allUrls].filter((u) => u.includes(productPrefix));
  console.error(`  → ${productUrls.length} under ${productPrefix}`);

  // Build path set + leaf detection
  const pathSet = new Set();
  const escapedPrefix = productPrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pathRe = new RegExp(`${escapedPrefix}(.+?)/?$`);
  for (const url of productUrls) {
    const m = url.match(pathRe);
    if (m && m[1]) pathSet.add(m[1]);
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
      const url = `https://www.kuhn.com${productPrefix}${path}`;
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
