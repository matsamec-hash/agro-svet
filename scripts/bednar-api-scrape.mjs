#!/usr/bin/env node
// Scrape Bednar product hierarchy from sitemap + page titles.
//
// Adapted from lemken-api-scrape.mjs (commit f90f88f).
//
// Strategy:
//   1. Fetch root sitemap index (try several known URLs).
//   2. Filter URLs under /en/products/ (Bednar uses /en/ locale prefix).
//   3. Leaf detection — keep only URLs that aren't a prefix of another URL.
//   4. Fetch <title> for each leaf; parse "ModelName | Bednar".
//   5. Filter: real product titles must include the URL-derived model token.
//   6. Build tree: cat → sub → family → models with parsed display names.
//
// Usage: node scripts/bednar-api-scrape.mjs > scripts/bednar-api-data.json

const SITEMAP_CANDIDATES = [
  'https://www.bednar-machinery.com/sitemap.xml',
  'https://www.bednar-machinery.com/en/sitemap.xml',
  'https://bednar.com/sitemap.xml',
  'https://bednar.com/en/sitemap.xml',
];
const URL_FILTERS = [
  '/en/products/',
  '/en/product/',
  '/products/',
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
  // Bednar titles tend to be e.g. "Atlas AO | Disc cultivator | BEDNAR"
  // or "TERRALAND TN | Deep cultivator | BEDNAR FMT".
  if (!title) return null;
  // Strip trailing brand suffix
  let cleaned = title
    .replace(/\s*[\|\-–]\s*BEDNAR(\s+FMT)?\s*$/i, '')
    .replace(/\s*[\|\-–]\s*Bednar(\s+FMT)?\s*$/i, '')
    .trim();
  // If still pipes remain, take first segment as name + rest as tagline
  const parts = cleaned.split(/\s*\|\s*/);
  if (parts.length >= 2) {
    return { name: parts[0].trim(), tagline: parts.slice(1).join(' | ').trim() };
  }
  // Fall back to colon
  const colonIdx = cleaned.indexOf(':');
  if (colonIdx > 0) {
    return { name: cleaned.slice(0, colonIdx).trim(), tagline: cleaned.slice(colonIdx + 1).trim() };
  }
  return { name: cleaned, tagline: '' };
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

async function fetchSitemapTree(rootUrl) {
  const seen = new Set();
  const queue = [rootUrl];
  const allUrls = new Set();
  while (queue.length) {
    const url = queue.shift();
    if (seen.has(url)) continue;
    seen.add(url);
    try {
      const xml = await fetchText(url);
      const locs = extractLocs(xml);
      for (const loc of locs) {
        if (loc.endsWith('.xml') || loc.includes('sitemap')) {
          if (!seen.has(loc)) queue.push(loc);
        } else {
          allUrls.add(loc);
        }
      }
    } catch (e) {
      console.error(`  failed: ${url} (${e.message})`);
    }
  }
  return allUrls;
}

function detectProductPrefix(urls) {
  // Try each filter, pick the one yielding most URLs
  let best = { filter: null, count: 0, sample: [] };
  for (const f of URL_FILTERS) {
    const matches = [...urls].filter((u) => u.includes(f));
    if (matches.length > best.count) best = { filter: f, count: matches.length, sample: matches.slice(0, 3) };
  }
  return best;
}

async function main() {
  console.error('Trying sitemap candidates…');
  let allUrls = null;
  for (const cand of SITEMAP_CANDIDATES) {
    try {
      console.error(`  trying ${cand}…`);
      const set = await fetchSitemapTree(cand);
      if (set.size > 0) {
        allUrls = set;
        console.error(`  → ${set.size} URLs from ${cand}`);
        break;
      }
    } catch (e) {
      console.error(`  failed: ${cand} (${e.message})`);
    }
  }
  if (!allUrls || allUrls.size === 0) {
    throw new Error('No sitemap could be fetched');
  }

  const detected = detectProductPrefix(allUrls);
  if (!detected.filter) {
    console.error('No /products/ URLs found. Sample URLs:');
    [...allUrls].slice(0, 10).forEach((u) => console.error(`  ${u}`));
    throw new Error('Could not detect product URL prefix');
  }
  console.error(`\nUsing filter "${detected.filter}" → ${detected.count} URLs`);
  console.error(`  sample: ${detected.sample.join(', ')}`);

  const productUrls = [...allUrls].filter((u) => u.includes(detected.filter));

  // Build path set + leaf detection (paths relative to detected.filter)
  const pathSet = new Set();
  const filterRe = new RegExp(detected.filter.replace(/\//g, '\\/') + '(.+?)\\/?$');
  for (const url of productUrls) {
    const m = url.match(filterRe);
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
  // Re-derive base URL by stripping path
  const sampleUrl = productUrls[0];
  const baseMatch = sampleUrl.match(/^(https?:\/\/[^\/]+)/);
  const origin = baseMatch ? baseMatch[1] : 'https://www.bednar-machinery.com';

  const titleData = await pool(
    leaves,
    async (path, i) => {
      const url = `${origin}${detected.filter}${path}`;
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
