#!/usr/bin/env node
// Scrape Lemken product hierarchy from sitemap.
// Lemken (TYPO3 CMS) doesn't expose JSON-LD on product pages, but the sitemap
// reveals the full /agricultural-machines/{cat}/{sub?}/{family}/{model} tree.
//
// Strategy:
//   1. Fetch en-en pages sitemap (only "sitemap=pages" sub-sitemap).
//   2. Filter URLs under /agricultural-machines/.
//   3. For each URL, check if it has children — if yes, it's a hub (cat/sub/family);
//      if no, it's a leaf = model.
//   4. Build tree: models point back through their path to category/subcategory/family.
//   5. Output JSON tree. Apply script handles category mapping → CZ subcategory enum.
//
// Tech specs (year, hp, etc.) are NOT extracted — Lemken pages have no
// structured data; specs vary by model and need manual entry. Goal here
// is to populate the catalog SHELL so encyclopedia/bazar wireup works.
//
// Usage: node scripts/lemken-api-scrape.mjs > scripts/lemken-api-data.json

const SITEMAP_INDEX = 'https://lemken.com/en-en/sitemap.xml';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0.0.0';

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/xml,text/html' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.text();
}

function extractLocs(xml) {
  const re = /<loc>([^<]+)<\/loc>/g;
  const urls = [];
  let m;
  while ((m = re.exec(xml)) !== null) {
    urls.push(m[1].replace(/&amp;/g, '&'));
  }
  return urls;
}

function humanize(slug) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

async function main() {
  console.error('Fetching sitemap index…');
  const indexXml = await fetchText(SITEMAP_INDEX);
  const subSitemaps = extractLocs(indexXml).filter((u) => u.includes('sitemap=pages'));

  const allUrls = new Set();
  for (const sub of subSitemaps) {
    console.error(`Fetching pages sitemap…`);
    const xml = await fetchText(sub);
    extractLocs(xml).forEach((u) => allUrls.add(u));
  }
  console.error(`  → ${allUrls.size} URLs`);

  // Keep only paths under /agricultural-machines/
  const productUrls = [...allUrls].filter((u) => u.includes('/en-en/agricultural-machines/'));
  console.error(`  → ${productUrls.length} under /agricultural-machines/`);

  // Build path set for parent detection
  const pathSet = new Set();
  for (const url of productUrls) {
    const m = url.match(/\/en-en\/agricultural-machines\/(.+?)\/?$/);
    if (m) pathSet.add(m[1]);
  }

  // A leaf = path that no other path uses as a prefix.
  function isLeaf(path) {
    for (const other of pathSet) {
      if (other === path) continue;
      if (other.startsWith(path + '/')) return false;
    }
    return true;
  }

  // Build tree: leaves become models; their parent path becomes family;
  // grandparent becomes subcategory; great-grandparent becomes category.
  const tree = {};
  let leafCount = 0;
  for (const path of pathSet) {
    if (!isLeaf(path)) continue;
    leafCount++;
    const segments = path.split('/');
    if (segments.length < 2) continue; // category-level leaf — skip

    let category, subcategory, family, model;
    if (segments.length === 2) {
      // /AM/{cat}/{model} — flat (rare but possible)
      [category, model] = segments;
      subcategory = '_root';
      family = model; // single-model "family"
    } else if (segments.length === 3) {
      // /AM/{cat}/{sub}/{model} — common for sowing/cropcare
      [category, subcategory, model] = segments;
      family = model;
    } else if (segments.length === 4) {
      // /AM/{cat}/{sub}/{family}/{model} — common for soil-cultivation
      [category, subcategory, family, model] = segments;
    } else if (segments.length >= 5) {
      // /AM/{cat}/{sub}/{subsub}/{family}/{model} — rare deep nesting
      category = segments[0];
      subcategory = segments[1];
      family = segments.slice(2, -1).join('/');
      model = segments[segments.length - 1];
    }

    if (!tree[category]) tree[category] = {};
    if (!tree[category][subcategory]) tree[category][subcategory] = {};
    if (!tree[category][subcategory][family]) {
      tree[category][subcategory][family] = {
        name: humanize(family.split('/').pop()),
        models: [],
      };
    }
    // Skip duplicates
    if (!tree[category][subcategory][family].models.find((x) => x.slug === model)) {
      tree[category][subcategory][family].models.push({
        slug: model,
        name: humanize(model),
        url: `https://lemken.com/en-en/agricultural-machines/${path}`,
      });
    }
  }

  // Stats
  let totalFamilies = 0, totalModels = 0;
  for (const cat of Object.keys(tree)) {
    for (const sub of Object.keys(tree[cat])) {
      for (const fam of Object.keys(tree[cat][sub])) {
        totalFamilies++;
        totalModels += tree[cat][sub][fam].models.length;
      }
    }
  }
  console.error(`\nLeafs: ${leafCount}`);
  console.error(`Result: ${Object.keys(tree).length} categories, ${totalFamilies} families, ${totalModels} models\n`);
  for (const cat of Object.keys(tree).sort()) {
    const subs = Object.keys(tree[cat]);
    const famCount = subs.reduce((acc, s) => acc + Object.keys(tree[cat][s]).length, 0);
    const modCount = subs.reduce((acc, s) => acc + Object.values(tree[cat][s]).reduce((mm, f) => mm + f.models.length, 0), 0);
    console.error(`  ${cat}: ${subs.length} sub-cats, ${famCount} families, ${modCount} models`);
    for (const sub of subs.sort()) {
      const fams = Object.keys(tree[cat][sub]);
      console.error(`    ${sub}: ${fams.length} families [${fams.slice(0, 6).join(', ')}${fams.length > 6 ? '…' : ''}]`);
    }
  }

  console.log(JSON.stringify(tree, null, 2));
}

main().catch((err) => { console.error(err); process.exit(1); });
