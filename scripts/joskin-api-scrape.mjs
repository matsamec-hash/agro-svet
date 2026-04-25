#!/usr/bin/env node
// Scrape Joskin product hierarchy from sitemap + page titles.
//
// Strategy (mirrors Lemken):
//   1. Fetch /robots.txt to discover sitemap index URL.
//   2. Recursively walk sitemap index → sub-sitemaps → URL set.
//   3. Filter URLs under /en/range/ (Joskin "range" = product range page).
//   4. Leaf detection — keep only URLs that aren't a prefix of another URL.
//   5. Fetch <title> for each leaf in parallel.
//   6. Parse "MODEL : tagline | JOSKIN" → { name, tagline }.
//   7. Filter: title must contain at least one alphabetic slug token (drops
//      generic marketing pages).
//   8. Build tree: cat → sub → family → models with parsed display names.
//
// Joskin URL structure (observed):
//   https://www.joskin.com/en/range/<category>/<sub>/<family>/<model>
//   e.g. /en/range/slurry-tanks/modulo2 → family page (no model leaf)
//        /en/range/transport/trans-cap → family page
//   Categories observed:
//     - slurry-tanks (Modulo2, Quadra, Komfort, Volumetra, X-Trem, Cargo)
//     - slurry-injectors (Pendislide, Pendiwing, Solodisc, Multi-Action)
//     - transport (Trans-CAP, Trans-SPACE, Trans-KTP, Drakkar, Cargo)
//     - manure-spreaders (Tornado3, Ferti-CAP, Siroko)
//     - silage-trailers, vacuum-tankers, etc.
//
// Usage: node scripts/joskin-api-scrape.mjs > scripts/joskin-api-data.json

const ROBOTS = 'https://www.joskin.com/robots.txt';
const FALLBACK_SITEMAP = 'https://www.joskin.com/sitemap.xml';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0.0.0';
const CONCURRENCY = 6;
// Joskin EN product range path prefix
const PATH_PREFIX = '/en/range/';

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
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function extractTitle(html) {
  const m = html.match(/<title>([^<]+)<\/title>/i);
  return m ? decodeEntities(m[1]).trim() : null;
}

function parseTitle(title) {
  // Joskin patterns observed:
  //   "MODULO2 - Slurry tanker | JOSKIN"
  //   "Trans-CAP : tipping trailer | JOSKIN"
  //   "Pendislide PRO | JOSKIN"
  if (!title) return null;
  const noBrand = title.replace(/\s*\|\s*JOSKIN\s*$/i, '').trim();
  // Try " : " then " - " separators
  for (const sep of [' : ', ' - ', ': ', ' – ']) {
    const idx = noBrand.indexOf(sep);
    if (idx > 0) {
      return {
        name: noBrand.slice(0, idx).trim(),
        tagline: noBrand.slice(idx + sep.length).trim(),
      };
    }
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

async function discoverSitemaps() {
  // Try robots.txt first
  try {
    const robots = await fetchText(ROBOTS);
    const re = /^Sitemap:\s*(\S+)/gim;
    const found = [];
    let m;
    while ((m = re.exec(robots)) !== null) found.push(m[1]);
    if (found.length) {
      console.error(`Found ${found.length} sitemap(s) in robots.txt`);
      return found;
    }
  } catch (e) {
    console.error(`robots.txt failed: ${e.message}`);
  }
  console.error(`Falling back to ${FALLBACK_SITEMAP}`);
  return [FALLBACK_SITEMAP];
}

async function walkSitemap(url, allUrls, depth = 0) {
  if (depth > 4) return;
  let xml;
  try {
    xml = await fetchText(url);
  } catch (e) {
    console.error(`  skip ${url}: ${e.message}`);
    return;
  }
  const locs = extractLocs(xml);
  // Heuristic: if root contains <sitemapindex>, recurse; else treat as URL set.
  const isIndex = /<sitemapindex/i.test(xml);
  if (isIndex) {
    for (const sub of locs) await walkSitemap(sub, allUrls, depth + 1);
  } else {
    for (const u of locs) allUrls.add(u);
  }
}

async function main() {
  console.error('Discovering sitemaps…');
  const roots = await discoverSitemaps();

  const allUrls = new Set();
  for (const root of roots) {
    console.error(`Walking ${root}…`);
    await walkSitemap(root, allUrls);
  }
  console.error(`  → ${allUrls.size} total URLs`);

  const productUrls = [...allUrls].filter((u) => u.includes(PATH_PREFIX));
  console.error(`  → ${productUrls.length} under ${PATH_PREFIX}`);

  // Build path set + leaf detection
  const pathSet = new Set();
  for (const url of productUrls) {
    const idx = url.indexOf(PATH_PREFIX);
    if (idx < 0) continue;
    const path = url.slice(idx + PATH_PREFIX.length).replace(/\/+$/, '');
    if (path) pathSet.add(path);
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

  console.error(`\nFetching titles (concurrency ${CONCURRENCY})…`);
  const titleData = await pool(
    leaves,
    async (path, i) => {
      const url = `https://www.joskin.com${PATH_PREFIX}${path}`;
      const title = await fetchLeafTitle(url);
      if ((i + 1) % 10 === 0) console.error(`  ${i + 1}/${leaves.length}`);
      return { path, url, title };
    },
    CONCURRENCY,
  );
  console.error(`  done`);

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
    const modCount = subs.reduce(
      (acc, s) => acc + Object.values(tree[cat][s]).reduce((mm, f) => mm + f.models.length, 0),
      0,
    );
    console.error(`  ${cat}: ${famCount} families, ${modCount} models`);
  }

  console.log(JSON.stringify(tree, null, 2));
}

main().catch((err) => { console.error(err); process.exit(1); });
