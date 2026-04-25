#!/usr/bin/env node
// Scrape Väderstad product hierarchy from sitemap + page titles.
//
// Strategy (mirrors Lemken pattern):
//   1. Fetch sitemap index from /robots.txt or known location.
//   2. Filter URLs under /uk/products/ (English UK locale).
//   3. Leaf detection — keep only URLs that aren't a prefix of another URL.
//   4. Fetch <title> for each leaf; parse "ModelName | Väderstad".
//   5. Filter: title must include URL-derived model token (e.g. "tempo-v" → title contains "Tempo").
//   6. Build tree: cat → sub → family → models.
//
// Usage: node scripts/vaderstad-api-scrape.mjs > scripts/vaderstad-api-data.json

const SITEMAP_CANDIDATES = [
  'https://www.vaderstad.com/sitemap.xml',
  'https://www.vaderstad.com/uk/sitemap.xml',
];
const ROBOTS_URL = 'https://www.vaderstad.com/robots.txt';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0.0.0';
const CONCURRENCY = 6;
const PRODUCT_PREFIX = '/uk/products/';

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

function extractSitemapsFromRobots(text) {
  const re = /^Sitemap:\s*(\S+)/gim;
  const out = [];
  let m;
  while ((m = re.exec(text)) !== null) out.push(m[1].trim());
  return out;
}

function decodeEntities(s) {
  return s.replace(/&#124;/g, '|').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#039;/g, "'");
}

function extractTitle(html) {
  const m = html.match(/<title>([^<]+)<\/title>/i);
  return m ? decodeEntities(m[1]).trim() : null;
}

function parseTitle(title) {
  // "Tempo V | Väderstad"
  // "Carrier XL 425-625 | Väderstad"
  // "Rapid A 400-800S | Väderstad"
  // Marketing pages without recognizable product token get filtered later.
  if (!title) return null;
  const noBrand = title
    .replace(/\s*[|–-]\s*Väderstad.*$/i, '')
    .replace(/\s*[|–-]\s*Vaderstad.*$/i, '')
    .trim();
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

async function gatherSitemaps() {
  // Try robots.txt first
  const sitemaps = new Set();
  try {
    const robots = await fetchText(ROBOTS_URL);
    extractSitemapsFromRobots(robots).forEach((u) => sitemaps.add(u));
    console.error(`  robots.txt: ${sitemaps.size} sitemap(s)`);
  } catch (e) {
    console.error(`  robots.txt failed: ${e.message}`);
  }
  // Add fallbacks
  for (const c of SITEMAP_CANDIDATES) sitemaps.add(c);
  return [...sitemaps];
}

async function expandSitemaps(initial) {
  // Recursively expand sitemap indexes into leaf XML files.
  const visited = new Set();
  const leaves = new Set();
  const queue = [...initial];
  while (queue.length) {
    const url = queue.shift();
    if (visited.has(url)) continue;
    visited.add(url);
    let xml;
    try {
      xml = await fetchText(url);
    } catch (e) {
      console.error(`  skip ${url}: ${e.message}`);
      continue;
    }
    if (xml.includes('<sitemapindex')) {
      extractLocs(xml).forEach((u) => queue.push(u));
    } else {
      leaves.add(url);
    }
  }
  return [...leaves];
}

async function main() {
  console.error('Discovering sitemaps…');
  const initial = await gatherSitemaps();
  console.error(`  initial: ${initial.length}`);
  const sitemapLeaves = await expandSitemaps(initial);
  console.error(`  expanded leaf sitemaps: ${sitemapLeaves.length}`);

  const allUrls = new Set();
  for (const sub of sitemapLeaves) {
    try {
      const xml = await fetchText(sub);
      extractLocs(xml).forEach((u) => allUrls.add(u));
    } catch (e) {
      console.error(`  skip ${sub}: ${e.message}`);
    }
  }
  console.error(`  → ${allUrls.size} total URLs from sitemaps`);

  const productUrls = [...allUrls].filter((u) => u.includes(PRODUCT_PREFIX));
  console.error(`  → ${productUrls.length} under ${PRODUCT_PREFIX}`);

  // Build path set + leaf detection
  const pathSet = new Set();
  for (const url of productUrls) {
    const m = url.match(new RegExp(`${PRODUCT_PREFIX}(.+?)/?$`));
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

  console.error(`\nFetching titles (concurrency ${CONCURRENCY})…`);
  const titleData = await pool(
    leaves,
    async (path, i) => {
      const url = `https://www.vaderstad.com${PRODUCT_PREFIX}${path}`;
      const title = await fetchLeafTitle(url);
      if ((i + 1) % 10 === 0) console.error(`  ${i + 1}/${leaves.length}`);
      return { path, url, title };
    },
    CONCURRENCY,
  );
  console.error(`  done`);

  // Build tree
  const tree = {};
  let kept = 0, dropped = 0;
  const droppedSamples = [];
  for (const { path, url, title } of titleData) {
    const segments = path.split('/');
    if (segments.length < 2) {
      // Single-segment: treat as family directly under category root.
      // We need at least cat/family for tree shape; promote to "_root" sub.
      if (segments.length === 1) {
        // Skip — likely category landing page, not a model
        dropped++;
        continue;
      }
      continue;
    }

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
    for (const sub of subs) {
      const fams = Object.keys(tree[cat][sub]);
      console.error(`    ${sub}: ${fams.join(', ')}`);
    }
  }

  console.log(JSON.stringify(tree, null, 2));
}

main().catch((err) => { console.error(err); process.exit(1); });
