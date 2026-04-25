#!/usr/bin/env node
// Scrape Kverneland product hierarchy from sitemap + page titles.
//
// Strategy (mirrors scripts/lemken-api-scrape.mjs):
//   1. Fetch sitemap index from www.kverneland.com (EN locale).
//   2. Filter URLs under /en/products/ (or /en-int/products/).
//   3. Leaf detection — keep only URLs that aren't a prefix of another URL.
//   4. Fetch <title> for each leaf; parse "Model | Kverneland".
//   5. Filter: real product titles must contain the URL-derived model token
//      (e.g. "ed-100-200" → title contains "ED" or "100"). Marketing pages
//      get filtered out.
//   6. Filter out Vicon-branded products (Kverneland Group sells Vicon as
//      separate brand). Keep only Kverneland-branded.
//   7. Build tree: cat → sub → family → models with parsed display names.
//
// Usage: node scripts/kverneland-api-scrape.mjs > scripts/kverneland-api-data.json
//
// Sitemap URL discovered via robots.txt:
//   https://www.kverneland.com/robots.txt → Sitemap: https://www.kverneland.com/sitemap.xml
// If the sitemap structure differs (e.g. Kverneland uses Sitecore which often
// has /sitemap.xml at root), adjust SITEMAP_INDEX and PRODUCT_PATH.

const SITEMAP_INDEX = 'https://www.kverneland.com/sitemap.xml';
const PRODUCT_PATHS = ['/int/products/', '/en/products/', '/products/'];
const BRAND_TOKEN = 'kverneland';
const SKIP_BRAND_TOKENS = ['vicon']; // co-owned brand, scraped separately
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
    .replace(/&#039;/g, "'");
}

function extractTitle(html) {
  const m = html.match(/<title>([^<]+)<\/title>/);
  return m ? decodeEntities(m[1]).trim() : null;
}

function parseTitle(title) {
  // Kverneland title patterns observed (Sitecore default):
  //   "ED 100/200 | Kverneland"
  //   "Optima TFprofi SX - Precision drill | Kverneland"
  //   "iXdrive | Kverneland"
  if (!title) return null;
  const noBrand = title
    .replace(/\s*[|·-]\s*Kverneland(\s+Group)?\s*$/i, '')
    .trim();
  const colonIdx = noBrand.indexOf(':');
  if (colonIdx > 0) {
    return {
      name: noBrand.slice(0, colonIdx).trim(),
      tagline: noBrand.slice(colonIdx + 1).trim(),
    };
  }
  // Try " - " as tagline separator
  const dashIdx = noBrand.indexOf(' - ');
  if (dashIdx > 0) {
    return {
      name: noBrand.slice(0, dashIdx).trim(),
      tagline: noBrand.slice(dashIdx + 3).trim(),
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
  // Permissive: any 3+ char alphabetic token from slug present in title.
  return tokens.some((t) => /^[a-z]{3,}$/.test(t) && lname.includes(t));
}

function isVicon(url, title) {
  const u = url.toLowerCase();
  const t = (title || '').toLowerCase();
  return SKIP_BRAND_TOKENS.some((b) => u.includes(`/${b}/`) || u.includes(`/${b}-`) || t.includes(`| ${b}`) || t.includes(`vicon `));
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
  // Try robots.txt for definitive Sitemap line, fall back to defaults.
  const candidates = new Set([SITEMAP_INDEX]);
  try {
    const robots = await fetchText('https://www.kverneland.com/robots.txt');
    for (const line of robots.split('\n')) {
      const m = line.match(/^Sitemap:\s*(\S+)/i);
      if (m) candidates.add(m[1].trim());
    }
  } catch (e) {
    console.error(`  robots.txt unreachable: ${e.message}`);
  }
  return [...candidates];
}

async function main() {
  console.error('Discovering sitemaps…');
  const sitemaps = await discoverSitemaps();
  console.error(`  → ${sitemaps.length} sitemap(s):`);
  sitemaps.forEach((s) => console.error(`     ${s}`));

  const allUrls = new Set();
  for (const sm of sitemaps) {
    try {
      const xml = await fetchText(sm);
      const locs = extractLocs(xml);
      // If this is a sitemap index, recurse one level.
      if (locs.some((l) => l.endsWith('.xml'))) {
        for (const sub of locs) {
          try {
            const subXml = await fetchText(sub);
            extractLocs(subXml).forEach((u) => allUrls.add(u));
          } catch (e) { /* ignore */ }
        }
      } else {
        locs.forEach((u) => allUrls.add(u));
      }
    } catch (e) {
      console.error(`  sitemap ${sm} failed: ${e.message}`);
    }
  }
  console.error(`  → ${allUrls.size} total URLs`);

  // Filter to product paths
  const productUrls = [...allUrls].filter((u) => PRODUCT_PATHS.some((p) => u.includes(p)));
  console.error(`  → ${productUrls.length} under product paths`);

  // Build path set + leaf detection (path = portion after the product prefix)
  const pathSet = new Set();
  const urlByPath = new Map();
  for (const url of productUrls) {
    for (const prefix of PRODUCT_PATHS) {
      const idx = url.indexOf(prefix);
      if (idx !== -1) {
        const tail = url.slice(idx + prefix.length).replace(/\/$/, '');
        if (tail) {
          pathSet.add(tail);
          urlByPath.set(tail, url);
        }
        break;
      }
    }
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
      const url = urlByPath.get(path);
      const title = await fetchLeafTitle(url);
      if ((i + 1) % 10 === 0) console.error(`  ${i + 1}/${leaves.length}`);
      return { path, url, title };
    },
    CONCURRENCY,
  );
  console.error(`  done`);

  // Build tree, filtering by name-token match + Vicon exclusion
  const tree = {};
  let kept = 0, dropped = 0, viconDropped = 0;
  const droppedSamples = [];
  for (const { path, url, title } of titleData) {
    if (isVicon(url, title)) {
      viconDropped++;
      continue;
    }
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

  console.error(`\nKept: ${kept} models, Dropped (no token): ${dropped}, Dropped (Vicon): ${viconDropped}`);
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
