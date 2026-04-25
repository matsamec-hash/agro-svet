#!/usr/bin/env node
// Scrape Pöttinger product hierarchy from sitemap + page titles.
//
// Strategy (mirrors scripts/lemken-api-scrape.mjs):
//   1. Fetch CZ sitemap index.
//   2. Filter URLs under /cs_cz/produkty/.
//   3. Leaf detection — keep only URLs that aren't a prefix of another URL.
//   4. Fetch <title> for each leaf; parse "Model · Pöttinger" / "Model | Pöttinger".
//   5. Filter: real product titles must contain the URL-derived model token
//      (e.g. "novacat-302" → title contains "Novacat 302"). Marketing pages
//      get filtered out.
//   6. Build tree: cat → sub → family → models with parsed display names.
//
// Usage: node scripts/pottinger-api-scrape.mjs > scripts/pottinger-api-data.json
//
// Note: Pöttinger's CZ sitemap URL discovered via robots.txt:
//   https://www.poettinger.at/robots.txt → Sitemap: https://www.poettinger.at/sitemap.xml
// If the sitemap structure differs, adjust SITEMAP_INDEX and PRODUCT_PATH.

const SITEMAP_INDEX = 'https://www.poettinger.at/sitemap.xml';
const PRODUCT_PATH = '/cs_cz/produkty/';
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
    .replace(/&middot;/g, '·');
}

function extractTitle(html) {
  const m = html.match(/<title>([^<]+)<\/title>/);
  return m ? decodeEntities(m[1]).trim() : null;
}

function parseTitle(title) {
  // Pöttinger title patterns observed:
  //   "NOVACAT 302 | Pöttinger"
  //   "NOVACAT 302 - Diskové žací stroje | Pöttinger"
  //   "NOVACAT 302: tagline | Pöttinger"
  if (!title) return null;
  const noBrand = title
    .replace(/\s*[|·-]\s*P[öo]ettinger\s*$/i, '')
    .replace(/\s*[|·-]\s*POETTINGER\s*$/i, '')
    .trim();
  const sepIdx = (() => {
    const candidates = [noBrand.indexOf(':'), noBrand.indexOf(' - '), noBrand.indexOf(' | ')];
    const positive = candidates.filter((i) => i > 0);
    return positive.length ? Math.min(...positive) : -1;
  })();
  if (sepIdx > 0) {
    return {
      name: noBrand.slice(0, sepIdx).trim(),
      tagline: noBrand.slice(sepIdx + 1).replace(/^[-|]\s*/, '').trim(),
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

async function main() {
  console.error('Fetching sitemap index…');
  const indexXml = await fetchText(SITEMAP_INDEX);

  // Sitemap may be index-of-sitemaps OR flat sitemap. Handle both.
  const directLocs = extractLocs(indexXml);
  let allUrls;
  if (directLocs.some((u) => u.endsWith('.xml'))) {
    allUrls = new Set();
    for (const sub of directLocs.filter((u) => u.endsWith('.xml'))) {
      try {
        const xml = await fetchText(sub);
        extractLocs(xml).forEach((u) => allUrls.add(u));
      } catch (e) {
        console.error(`  WARN sub-sitemap fail: ${sub} (${e.message})`);
      }
    }
  } else {
    allUrls = new Set(directLocs);
  }
  console.error(`  → ${allUrls.size} total URLs`);

  const productUrls = [...allUrls].filter((u) => u.includes(PRODUCT_PATH));
  console.error(`  → ${productUrls.length} under ${PRODUCT_PATH}`);

  const pathSet = new Set();
  for (const url of productUrls) {
    const re = new RegExp(`${PRODUCT_PATH.replace(/\//g, '\\/')}(.+?)\\/?$`);
    const m = url.match(re);
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
      const url = `https://www.poettinger.at${PRODUCT_PATH}${path}`;
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
