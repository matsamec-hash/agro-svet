#!/usr/bin/env node
// Scrape Manitou product hierarchy from sitemap + page titles.
//
// Strategy (Lemken pattern, adapted for Manitou):
//   1. Fetch sitemap index from https://www.manitou.com/robots.txt sitemap entry.
//   2. Filter URLs under /en/products/ (Manitou EN locale).
//   3. AGRICULTURAL FILTER — Manitou makes thousands of non-agricultural
//      products (industrial forklifts MI/MSI, aerial work platforms,
//      construction). Keep only URLs whose slug matches AG model patterns:
//        - mlt-* (MLT + MLT NewAg telescopic loaders for agriculture)
//        - mt-x-* (MT-X compact telescopic, AG-positioned)
//        - mac-* (MAC compact loaders, often farm-positioned)
//        - newag (Manitou's heavy-AG branding)
//      Drop anything else (mi-*, msi-*, m-*, mt-*-platform, etc.).
//   4. Leaf detection — keep only URLs that aren't a prefix of another URL.
//   5. Fetch <title> for each leaf; parse "ModelName | Manitou".
//   6. Filter by slug-token match (e.g. "mlt-961" → title contains "MLT 961").
//   7. Build tree: category → series → models.
//
// Usage: node scripts/manitou-api-scrape.mjs > scripts/manitou-api-data.json

const ROBOTS_URL = 'https://www.manitou.com/robots.txt';
const FALLBACK_SITEMAP = 'https://www.manitou.com/sitemap.xml';
const URL_LOCALE_RE = /\/en\/products?\//;
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0.0.0';
const CONCURRENCY = 6;
const BRAND_NAME = 'Manitou';

// Agricultural product slug patterns. Manitou positions these for farms;
// everything else (industrial MI/MSI forklifts, aerial platforms,
// construction MT non-NewAg) gets filtered out.
const AG_SLUG_PATTERNS = [
  /^mlt[-\d]/i,           // MLT 625, MLT 730, MLT 840 NewAg, MLT 1041 NewAg etc.
  /^mlt-/i,               // mlt-625-low-energy, mlt-941-newag
  /^mt-x-/i,              // MT-X 420, MT-X 625, compact AG telescopic
  /^mac-/i,               // MAC compact loaders (farm)
  /^newag/i,              // /newag landing
  /-newag/i,              // anything with newag suffix
  /^mla-?t/i,             // MLA-T articulated loaders for agriculture
];

// Hard skip patterns — non-AG even if URL contains "mlt" coincidentally.
const SKIP_PATTERNS = [
  /aerial-work/i,
  /forklift/i,
  /industrial/i,
  /warehous/i,
  /^mi-/i,                // MI industrial forklifts
  /^msi-/i,               // MSI industrial
  /^me-/i,                // ME electric warehouse
  /platform/i,
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
  return s
    .replace(/&#124;/g, '|')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

function extractTitle(html) {
  const m = html.match(/<title>([^<]+)<\/title>/);
  return m ? decodeEntities(m[1]).trim() : null;
}

function parseTitle(title) {
  // Common Manitou title patterns:
  //   "MLT 961 NewAg | Manitou"
  //   "MLT 625-75 H | Telescopic loader | Manitou"
  //   "MT-X 420 | Manitou"
  if (!title) return null;
  let noBrand = title.replace(/\s*\|\s*Manitou(?:\s*Group)?\s*$/i, '').trim();
  // Some titles have an extra " | category" segment — keep first part as name.
  const parts = noBrand.split('|').map((s) => s.trim()).filter(Boolean);
  if (parts.length === 0) return null;
  const name = parts[0];
  const tagline = parts.slice(1).join(' — ');
  return { name, tagline };
}

function slugTokens(slug) {
  return slug.split('-').filter(Boolean);
}

function nameContainsSlugTokens(name, slug) {
  const tokens = slugTokens(slug);
  if (tokens.length === 0) return false;
  const lname = name.toLowerCase();
  // Permissive: at least one alphabetic 2+ char slug token must appear.
  return tokens.some((t) => /^[a-z]{2,}$/.test(t) && lname.includes(t));
}

function isAgSlug(slug) {
  if (SKIP_PATTERNS.some((re) => re.test(slug))) return false;
  return AG_SLUG_PATTERNS.some((re) => re.test(slug));
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

async function discoverSitemaps() {
  // Robots.txt may list one or more sitemap files.
  try {
    const robots = await fetchText(ROBOTS_URL);
    const matches = [...robots.matchAll(/Sitemap:\s*(\S+)/gi)].map((m) => m[1].trim());
    if (matches.length) return matches;
  } catch (e) {
    console.error(`  robots.txt fetch failed: ${e.message}`);
  }
  return [FALLBACK_SITEMAP];
}

async function main() {
  console.error('Discovering sitemaps via robots.txt…');
  const seedSitemaps = await discoverSitemaps();
  console.error(`  → ${seedSitemaps.length} sitemap(s)`);

  const allUrls = new Set();
  const queue = [...seedSitemaps];
  const seen = new Set();
  while (queue.length) {
    const sm = queue.shift();
    if (seen.has(sm)) continue;
    seen.add(sm);
    let xml;
    try {
      xml = await fetchText(sm);
    } catch (e) {
      console.error(`  failed: ${sm} (${e.message})`);
      continue;
    }
    const locs = extractLocs(xml);
    // If sub-locations look like sitemaps (.xml), recurse; else treat as page URLs.
    for (const loc of locs) {
      if (loc.endsWith('.xml')) queue.push(loc);
      else allUrls.add(loc);
    }
  }
  console.error(`  → ${allUrls.size} total URLs`);

  // Keep only EN product URLs.
  const productUrls = [...allUrls].filter((u) => URL_LOCALE_RE.test(u));
  console.error(`  → ${productUrls.length} under /en/products/`);

  // Build path set + leaf detection.
  const pathSet = new Set();
  for (const url of productUrls) {
    const m = url.match(/\/en\/products?\/(.+?)\/?$/);
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

  // AG filter on slug (last segment).
  const agLeaves = leaves.filter((p) => {
    const slug = p.split('/').pop();
    return isAgSlug(slug);
  });
  console.error(`  → ${agLeaves.length} AG-filtered leaves`);

  // Fetch <title> for each AG leaf in parallel.
  console.error(`\nFetching titles (concurrency ${CONCURRENCY})…`);
  const titleData = await pool(
    agLeaves,
    async (path, i) => {
      const url = `https://www.manitou.com/en/products/${path}`;
      const title = await fetchLeafTitle(url);
      if ((i + 1) % 10 === 0) console.error(`  ${i + 1}/${agLeaves.length}`);
      return { path, url, title };
    },
    CONCURRENCY,
  );
  console.error(`  done`);

  // Build tree (category → subcategory → family → models).
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
      category = 'agricultural';
      subcategory = '_root';
      family = modelSlug;
    } else if (segments.length === 2) {
      [category] = segments;
      subcategory = '_root';
      family = modelSlug;
    } else if (segments.length === 3) {
      [category, subcategory] = segments;
      family = modelSlug;
    } else if (segments.length >= 4) {
      [category, subcategory, family] = segments;
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
    const modCount = subs.reduce(
      (acc, s) => acc + Object.values(tree[cat][s]).reduce((mm, f) => mm + f.models.length, 0),
      0,
    );
    console.error(`  ${cat}: ${famCount} families, ${modCount} models`);
  }

  console.log(JSON.stringify(tree, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
