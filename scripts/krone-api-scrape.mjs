#!/usr/bin/env node
// Scrape Krone product hierarchy from sitemap + page titles.
//
// Strategy (mirrors Lemken pattern):
//   1. Fetch sitemap index for landmaschinen.krone.de.
//   2. Filter URLs under /en/products/ (English locale).
//   3. Leaf detection — keep only URLs that aren't a prefix of another URL.
//   4. Fetch <title> for each leaf; parse "ModelName | KRONE" / "ModelName - tagline".
//   5. Filter: real product titles must include the URL-derived model token
//      (e.g. "easycut-b-1000" → title contains "EasyCut" or "B 1000"). Marketing
//      pages without a slug-token match get filtered out.
//   6. Build tree: cat → sub → family → models with parsed display names.
//
// Krone sitemap layout (as of 2026-04):
//   - https://landmaschinen.krone.de/sitemap.xml — index
//   - sub-sitemaps include locale segments; we filter for /en/products/
//   - product URL pattern: /en/products/<category>/<series>/<model>
//
// Usage: node scripts/krone-api-scrape.mjs > scripts/krone-api-data.json

const SITEMAP_INDEX = 'https://landmaschinen.krone.de/sitemap.xml';
const ROOT = 'https://landmaschinen.krone.de';
const LOCALE = '/en/';
const PRODUCT_SEGMENT = 'products'; // fallback also tries 'product'
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
  return s
    .replace(/&#124;/g, '|')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m ? decodeEntities(m[1]).trim() : null;
}

function parseTitle(title) {
  // "EasyCut B 1000 CV Collect | KRONE"
  // "BiG X 1180 - Forage harvester | KRONE"
  // "Comprima V 150 XC | KRONE Agriculture"
  // "Krone | Practical demonstration" — marketing, no slug-token match
  if (!title) return null;
  const noBrand = title
    .replace(/\s*\|\s*KRONE(\s+Agriculture)?\s*$/i, '')
    .replace(/\s*-\s*KRONE(\s+Agriculture)?\s*$/i, '')
    .trim();
  const dashIdx = noBrand.search(/\s[-–|]\s/);
  if (dashIdx > 0) {
    return {
      name: noBrand.slice(0, dashIdx).trim(),
      tagline: noBrand.slice(dashIdx + 3).trim(),
    };
  }
  return { name: noBrand, tagline: '' };
}

function slugTokens(slug) {
  // "easycut-b-1000" → ["easycut", "b", "1000"]
  return slug.split('-').filter(Boolean);
}

function nameContainsSlugTokens(name, slug) {
  // Permissive match: at least one alphabetic slug token (>=3 chars) must appear
  // in the title. Single-letter / number tokens are not required.
  const tokens = slugTokens(slug);
  if (tokens.length === 0) return false;
  const lname = name.toLowerCase().replace(/\s+/g, '');
  return tokens.some((t) => /^[a-z]{3,}$/.test(t) && lname.includes(t));
}

async function fetchLeafTitle(url) {
  try {
    const html = await fetchText(url);
    return extractTitle(html);
  } catch {
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

async function collectAllUrls() {
  const all = new Set();
  try {
    console.error('Fetching sitemap index…');
    const indexXml = await fetchText(SITEMAP_INDEX);
    const subs = extractLocs(indexXml);
    if (subs.length === 0) {
      // Index was actually a flat sitemap
      indexXml && extractLocs(indexXml).forEach((u) => all.add(u));
    } else {
      for (const sub of subs) {
        try {
          const xml = await fetchText(sub);
          extractLocs(xml).forEach((u) => all.add(u));
        } catch (e) {
          console.error(`  ! sub-sitemap failed: ${sub} (${e.message})`);
        }
      }
    }
  } catch (e) {
    console.error(`Sitemap fetch failed: ${e.message}`);
  }
  return all;
}

function detectProductSegment(urls) {
  // Krone may use /en/products/, /en/product/, or /en/agricultural-machines/.
  const candidates = ['products', 'product', 'agricultural-machines', 'machines'];
  let best = null;
  let bestCount = 0;
  for (const seg of candidates) {
    const needle = `${LOCALE}${seg}/`;
    const count = [...urls].filter((u) => u.includes(needle)).length;
    if (count > bestCount) {
      bestCount = count;
      best = seg;
    }
  }
  return { segment: best, count: bestCount };
}

async function main() {
  const allUrls = await collectAllUrls();
  console.error(`  → ${allUrls.size} total URLs`);

  let segment = PRODUCT_SEGMENT;
  let productUrls = [...allUrls].filter((u) => u.includes(`${LOCALE}${segment}/`));
  if (productUrls.length === 0) {
    const det = detectProductSegment(allUrls);
    if (det.segment) {
      segment = det.segment;
      productUrls = [...allUrls].filter((u) => u.includes(`${LOCALE}${segment}/`));
      console.error(`  → switched to /${LOCALE}${segment}/`);
    }
  }
  console.error(`  → ${productUrls.length} under ${LOCALE}${segment}/`);

  if (productUrls.length === 0) {
    console.error('No product URLs found via sitemap. Emitting empty tree — apply script will fall back to scaffold.');
    console.log(JSON.stringify({}, null, 2));
    return;
  }

  // Build path set + leaf detection
  const pathSet = new Set();
  const prefix = `${LOCALE}${segment}/`;
  for (const url of productUrls) {
    const m = url.match(new RegExp(`${prefix.replace(/\//g, '\\/')}(.+?)\\/?$`));
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
      const url = `${ROOT}${prefix}${path}`;
      const title = await fetchLeafTitle(url);
      if ((i + 1) % 10 === 0) console.error(`  ${i + 1}/${leaves.length}`);
      return { path, url, title };
    },
    CONCURRENCY,
  );
  console.error('  done');

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
    console.error('\nDropped sample:');
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
