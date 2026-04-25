#!/usr/bin/env node
// Scrape Horsch product hierarchy from sitemap + page titles.
//
// Strategy (Lemken pattern):
//   1. Fetch sitemap index from https://www.horsch.com/sitemap.xml.
//   2. Filter URLs under /en/products/ (Horsch uses path /en/products/<category>/<series>).
//   3. Leaf detection — keep only URLs that aren't a prefix of another URL.
//   4. Fetch <title> for each leaf; parse "ModelName | HORSCH".
//   5. Filter: title must contain a slug-derived alphabetic token (e.g. "pronto"
//      for slug "pronto-3-6-dc"). Marketing pages get filtered out.
//   6. Build tree: cat → sub → family → models.
//
// Usage: node scripts/horsch-api-scrape.mjs > scripts/horsch-api-data.json

const SITEMAP_INDEX = 'https://www.horsch.com/sitemap.xml';
const URL_PREFIX_RE = /\/en\/products\//;
const URL_PREFIX_STR = '/en/products/';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0.0.0';
const CONCURRENCY = 6;
const BRAND_NAME = 'HORSCH';

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
  // "Pronto 3 DC | HORSCH"
  // "Maestro 12 SX | HORSCH"
  // "Tiger MT | HORSCH"
  if (!title) return null;
  const noBrand = title.replace(new RegExp(`\\s*[|–-]\\s*${BRAND_NAME}\\s*$`, 'i'), '').trim();
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

async function gatherSitemapUrls() {
  const all = new Set();
  let queue = [SITEMAP_INDEX];
  const seen = new Set();

  while (queue.length) {
    const next = [];
    for (const url of queue) {
      if (seen.has(url)) continue;
      seen.add(url);
      let xml;
      try {
        xml = await fetchText(url);
      } catch (e) {
        console.error(`  ! failed ${url}: ${e.message}`);
        continue;
      }
      const locs = extractLocs(xml);
      const isIndex = /<sitemapindex/i.test(xml);
      if (isIndex) {
        next.push(...locs);
      } else {
        locs.forEach((u) => all.add(u));
      }
    }
    queue = next;
  }

  return [...all];
}

async function main() {
  console.error('Fetching sitemap…');
  const allUrls = await gatherSitemapUrls();
  console.error(`  → ${allUrls.length} total URLs`);

  const productUrls = allUrls.filter((u) => URL_PREFIX_RE.test(u));
  console.error(`  → ${productUrls.length} under ${URL_PREFIX_STR}`);

  // Build path set + leaf detection
  const pathSet = new Set();
  for (const url of productUrls) {
    const m = url.match(new RegExp(`${URL_PREFIX_STR}(.+?)/?$`));
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
      const url = `https://www.horsch.com${URL_PREFIX_STR}${path}`;
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
