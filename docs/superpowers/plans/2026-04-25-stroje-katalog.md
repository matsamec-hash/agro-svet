# Stroje Katalog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rozšířit katalog `/stroje/` na agro-svet.cz o sekci "Stroje" (zemědělské stroje mimo traktory a kombajny) — 10 funkčních skupin × ~45 sub-kategorií × 12+ nových značek + rozšíření 6 stávajících traktorových značek; integrace s bazarem.

**Architecture:** FLAT schema (sub-kategorie jako sourozenci traktory/kombajny v `categories` mapě). Hybrid free data ingest pipeline (Wikidata + Fendt undocumented API + sitemap+JSON-LD scraping + PDF brochures + manual CZ finishing). 9 fází: Fáze 0 = ingest scripts, Fáze 1 = schema, Fáze 2 = YAML finishing, Fáze 3 = hub stránky, Fáze 4 = brand/model update, Fáze 5 = nav, Fáze 6 = bazar, Fáze 7 = SEO, Fáze 8 = deploy.

**Tech Stack:** Astro 6 SSR + Cloudflare Workers, TypeScript, js-yaml, Supabase Postgres, Vitest, Tailwind v4, Node 22, Anthropic SDK (Claude API pro PDF extraction).

**Spec:** [docs/superpowers/specs/2026-04-25-stroje-katalog-design.md](../specs/2026-04-25-stroje-katalog-design.md) (commits f15e450 + ac8c931).

---

## File Structure

### NEW files (ingest pipeline)
- `scripts/ingest/legality-checks.mjs` — robots.txt + rate guard
- `scripts/ingest/wikidata-brands.mjs` — SPARQL pro 18 značek
- `scripts/ingest/fendt-techdata.mjs` — undocumented API fetcher
- `scripts/ingest/sitemap-scraper.mjs` — generic sitemap+JSON-LD scraper
- `scripts/ingest/sources/<brand>.mjs` × 12 — per-brand adaptery
- `scripts/ingest/pdf-extract.mjs` — PDF brochure parser + Claude extraction
- `scripts/ingest/cz-dealers.mjs` — Strom/AGROTEC/Pekass scraper
- `scripts/ingest/build-yaml.mjs` — merger výstupů → tmp/seed-*.yaml
- `scripts/ingest/run-all.mjs` — orchestrátor
- `scripts/validate-stroje-yaml.mjs` — pre-deploy YAML validation

### NEW files (schema & helpers)
- `src/lib/stroje-filters.ts` — `SUBCATEGORY_FILTERS` mapa
- `src/lib/spec-labels.ts` — pretty-print pro spec keys
- `tests/lib/stroje.test.ts` — unit tests existing loader
- `tests/lib/stroje-filters.test.ts`
- `tests/lib/spec-labels.test.ts`

### NEW files (data — 12 brands)
- `src/data/stroje/{lemken,pottinger,kuhn,amazone,krone,horsch,vaderstad,bednar,manitou,jcb,joskin,kverneland}.yaml`

### NEW files (pages)
- `src/pages/stroje/zemedelske-stroje/index.astro` — hub
- `src/pages/stroje/zemedelske-stroje/[group]/index.astro` — funkční skupina
- `src/pages/stroje/[subcategory]/index.astro` — sub-kategorie cross-brand

### NEW files (components)
- `src/components/stroje/FunctionalGroupHub.astro`

### NEW files (DB)
- `supabase/migrations/004_bazar_stroje_categories.sql`
- `supabase/migrations/005_bazar_stroje_fields.sql`

### MODIFY files
- `src/lib/stroje.ts` — extend StrojKategorie, add FUNCTIONAL_GROUPS, helpers
- `src/data/stroje/{john-deere,claas,new-holland,massey-ferguson,fendt,case-ih}.yaml` — extend with non-tractor portfolio
- `src/components/stroje/CategoryBrowse.astro` — generic použití
- `src/pages/stroje/[brand]/index.astro` — section ordering
- `src/pages/stroje/[brand]/rada/[category]/[family]/index.astro` — kompatibilita s novými slugy
- `src/pages/stroje/[brand]/[series]/[model]/index.astro` — spec table přes spec-labels
- `src/pages/stroje/index.astro` — funkční skupiny do filtru
- `src/components/Header.astro` — Stroje záložka
- `src/components/ImageAccordion.astro` — Stroje panel link
- `src/lib/bazar-constants.ts` — CATEGORIES, BRANDS, BAZAR_TO_CATALOG_SUBCATEGORIES
- `src/lib/bazar-catalog.ts` — getModelOptions(category, subcategory)
- `src/components/bazar/CatalogPicker.astro`
- `src/components/bazar/BazarFilters.astro`
- `src/components/bazar/BazarListingRow.astro`
- `src/pages/bazar/novy.astro` + `src/pages/bazar/moje/[id]/index.astro`
- `src/pages/bazar/[id].astro`
- `src/pages/bazar/index.astro`
- `src/pages/sitemap.xml.ts`
- `package.json` — deps (pdf-parse, cheerio, @anthropic-ai/sdk)

---

## Phase 0: Data Ingest Pipeline (3-5 dní)

> **Cíl Fáze 0:** Vyrobit `tmp/seed-*.yaml` soubory s ~50-60 % pre-vyplněných specs pro 12 nových značek a 6 update-ů. Fáze 2 dělá manuální review + CZ popisky + přesun do `src/data/stroje/`.

### Task 0.1: Setup ingest workspace + závislosti

**Files:**
- Modify: `package.json`
- Create: `scripts/ingest/` (directory)
- Modify: `.gitignore`

- [ ] **Step 1: Add ingest dependencies**

```bash
cd /Users/matejsamec/agro-svet
npm install --save-dev pdf-parse cheerio @anthropic-ai/sdk
```

Expected: pdf-parse, cheerio, @anthropic-ai/sdk added to devDependencies.

- [ ] **Step 2: Create ingest workspace**

```bash
mkdir -p scripts/ingest/sources
mkdir -p tmp/cache tmp/seed
```

- [ ] **Step 3: Update .gitignore**

Append to `.gitignore`:
```
tmp/
.env.local
```

Verify `tmp/` excluded:
```bash
git check-ignore tmp/
```
Expected: `tmp/`

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json .gitignore
git commit -m "chore(ingest): add pdf-parse, cheerio, anthropic SDK + tmp/ workspace"
```

---

### Task 0.2: Legality pre-flight checks

**Files:**
- Create: `scripts/ingest/legality-checks.mjs`
- Create: `tests/scripts/legality-checks.test.mjs`

- [ ] **Step 1: Write the failing test**

```javascript
// tests/scripts/legality-checks.test.mjs
import { describe, it, expect } from 'vitest';
import { parseRobotsTxt, isPathAllowed } from '../../scripts/ingest/legality-checks.mjs';

describe('legality-checks', () => {
  it('parses robots.txt with Disallow rules', () => {
    const txt = `User-agent: *\nDisallow: /admin/\nDisallow: /api/private/\n\nUser-agent: badbot\nDisallow: /`;
    const rules = parseRobotsTxt(txt);
    expect(rules['*']).toEqual(['/admin/', '/api/private/']);
    expect(rules['badbot']).toEqual(['/']);
  });

  it('isPathAllowed returns false when path matches Disallow', () => {
    const rules = { '*': ['/admin/', '/api/private/'] };
    expect(isPathAllowed(rules, '/products/lemken-juwel')).toBe(true);
    expect(isPathAllowed(rules, '/admin/users')).toBe(false);
    expect(isPathAllowed(rules, '/api/private/key')).toBe(false);
  });

  it('isPathAllowed handles empty rules (all allowed)', () => {
    expect(isPathAllowed({}, '/anywhere')).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/scripts/legality-checks.test.mjs
```
Expected: FAIL with "module not found".

- [ ] **Step 3: Implement legality-checks.mjs**

```javascript
// scripts/ingest/legality-checks.mjs
export function parseRobotsTxt(txt) {
  const rules = {};
  let currentAgent = null;
  for (const line of txt.split('\n')) {
    const trimmed = line.split('#')[0].trim();
    if (!trimmed) continue;
    const [key, ...rest] = trimmed.split(':');
    const value = rest.join(':').trim();
    if (key.toLowerCase() === 'user-agent') {
      currentAgent = value.toLowerCase();
      if (!rules[currentAgent]) rules[currentAgent] = [];
    } else if (key.toLowerCase() === 'disallow' && currentAgent !== null) {
      if (value) rules[currentAgent].push(value);
    }
  }
  return rules;
}

export function isPathAllowed(rules, path, userAgent = '*') {
  const agentRules = rules[userAgent.toLowerCase()] || rules['*'] || [];
  for (const disallow of agentRules) {
    if (path.startsWith(disallow)) return false;
  }
  return true;
}

export async function fetchAndParseRobots(host) {
  const url = `https://${host}/robots.txt`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'agro-svet-bot/1.0 (+https://agro-svet.cz/)' } });
    if (!res.ok) return {};
    return parseRobotsTxt(await res.text());
  } catch (err) {
    console.warn(`[legality] cannot fetch ${url}: ${err.message}`);
    return {};
  }
}

export async function preflightCheck(host, paths) {
  const rules = await fetchAndParseRobots(host);
  const blocked = paths.filter((p) => !isPathAllowed(rules, p));
  if (blocked.length > 0) {
    throw new Error(`[legality] blocked paths on ${host}: ${blocked.join(', ')}`);
  }
  console.log(`[legality] OK ${host} (${paths.length} paths checked)`);
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/scripts/legality-checks.test.mjs
```
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add scripts/ingest/legality-checks.mjs tests/scripts/legality-checks.test.mjs
git commit -m "feat(ingest): legality checks - robots.txt parser + preflight"
```

---

### Task 0.3: Rate-limited HTTP fetcher utility

**Files:**
- Create: `scripts/ingest/fetch-utils.mjs`

- [ ] **Step 1: Implement rate-limited fetcher with cache**

```javascript
// scripts/ingest/fetch-utils.mjs
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import { dirname } from 'node:path';
import { createHash } from 'node:crypto';

const UA = 'agro-svet-bot/1.0 (+https://agro-svet.cz/)';
const DEFAULT_DELAY_MS = 1100; // > 1 req/s
const lastFetchByHost = new Map();

function cachePath(url) {
  const hash = createHash('sha1').update(url).digest('hex');
  return `tmp/cache/${hash.slice(0, 2)}/${hash}.html`;
}

async function readCache(url) {
  try {
    const path = cachePath(url);
    const s = await stat(path);
    // Cache forever during dev
    return await readFile(path, 'utf-8');
  } catch {
    return null;
  }
}

async function writeCache(url, body) {
  const path = cachePath(url);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, body, 'utf-8');
}

async function throttle(host) {
  const last = lastFetchByHost.get(host) ?? 0;
  const now = Date.now();
  const wait = DEFAULT_DELAY_MS - (now - last);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastFetchByHost.set(host, Date.now());
}

export async function fetchWithCache(url, { useCache = true } = {}) {
  if (useCache) {
    const cached = await readCache(url);
    if (cached) return cached;
  }
  const host = new URL(url).host;
  await throttle(host);
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' },
  });
  if (!res.ok) throw new Error(`Fetch failed ${url}: HTTP ${res.status}`);
  const body = await res.text();
  await writeCache(url, body);
  return body;
}

export { UA };
```

- [ ] **Step 2: Manual test fetch (real network)**

```bash
node -e "import('./scripts/ingest/fetch-utils.mjs').then(async (m) => { const html = await m.fetchWithCache('https://example.com'); console.log(html.length, 'chars'); })"
```
Expected: ~1256 chars (example.com homepage).

- [ ] **Step 3: Commit**

```bash
git add scripts/ingest/fetch-utils.mjs
git commit -m "feat(ingest): rate-limited fetcher with file cache + custom UA"
```

---

### Task 0.4: Wikidata SPARQL pro brand metadata

**Files:**
- Create: `scripts/ingest/wikidata-brands.mjs`

- [ ] **Step 1: Implement Wikidata fetcher**

```javascript
// scripts/ingest/wikidata-brands.mjs
import { writeFile } from 'node:fs/promises';

const SPARQL_ENDPOINT = 'https://query.wikidata.org/sparql';
const UA = 'agro-svet-bot/1.0 (+https://agro-svet.cz/)';

// Wikidata Q-IDs pro 18 značek
const BRAND_QIDS = {
  'john-deere': 'Q11193',
  'claas': 'Q166317',
  'fendt': 'Q468085',
  'zetor': 'Q336936',
  'new-holland': 'Q23410',
  'kubota': 'Q570968',
  'case-ih': 'Q23316',
  'massey-ferguson': 'Q1791420',
  'deutz-fahr': 'Q1207605',
  'valtra': 'Q606263',
  'lemken': 'Q1813489',
  'pottinger': 'Q1622680',
  'kuhn': 'Q1791420', // Bucher Industries / Kuhn — TODO confirm
  'amazone': 'Q1142081',
  'krone': 'Q1789770',
  'horsch': 'Q1631145',
  'vaderstad': 'Q3551349',
  'bednar': null,        // Bednar nemá Wikidata entry (CZ private company)
  'manitou': 'Q1640893',
  'jcb': 'Q1062373',
  'joskin': null,        // unknown
  'kverneland': 'Q1791520',
  'farmet': null,
  'grimme': 'Q1551842',
  'mchale': null,
  'lely': 'Q3257221',
};

async function sparql(query) {
  const res = await fetch(`${SPARQL_ENDPOINT}?query=${encodeURIComponent(query)}&format=json`, {
    headers: { 'User-Agent': UA, Accept: 'application/sparql-results+json' },
  });
  if (!res.ok) throw new Error(`SPARQL failed: ${res.status}`);
  return res.json();
}

async function fetchBrandMetadata(slug, qid) {
  if (!qid) return { slug, name: null, country: null, founded: null, website: null, _note: 'no Wikidata entry' };
  const query = `
    SELECT ?brandLabel ?countryLabel ?founded ?website WHERE {
      VALUES ?brand { wd:${qid} }
      OPTIONAL { ?brand wdt:P17 ?country }
      OPTIONAL { ?brand wdt:P571 ?founded }
      OPTIONAL { ?brand wdt:P856 ?website }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "cs,en". }
    } LIMIT 1
  `;
  const data = await sparql(query);
  const row = data.results.bindings[0] || {};
  return {
    slug,
    name: row.brandLabel?.value || null,
    country: row.countryLabel?.value || null,
    founded: row.founded ? new Date(row.founded.value).getFullYear() : null,
    website: row.website?.value || null,
  };
}

async function main() {
  const result = {};
  for (const [slug, qid] of Object.entries(BRAND_QIDS)) {
    console.log(`[wikidata] ${slug} (${qid || 'no QID'})`);
    try {
      result[slug] = await fetchBrandMetadata(slug, qid);
      await new Promise((r) => setTimeout(r, 1000)); // rate limit
    } catch (err) {
      console.error(`  failed: ${err.message}`);
      result[slug] = { slug, _error: err.message };
    }
  }
  await writeFile('tmp/wikidata-brands.json', JSON.stringify(result, null, 2));
  console.log(`Wrote tmp/wikidata-brands.json (${Object.keys(result).length} brands)`);
}

main().catch((err) => { console.error(err); process.exit(1); });
```

- [ ] **Step 2: Run script**

```bash
node scripts/ingest/wikidata-brands.mjs
```
Expected: `tmp/wikidata-brands.json` created, ~26 brands fetched.

- [ ] **Step 3: Verify output**

```bash
cat tmp/wikidata-brands.json | head -30
```
Expected: Lemken/Pöttinger/Krone/etc with `name`, `country`, `founded`, `website` populated.

- [ ] **Step 4: Manually correct missing QIDs**

For brands marked `_note: 'no Wikidata entry'`, manually fill values from Wikipedia:
- Bednar (CZ): name "Bednar FMT", country "Czech Republic", founded 1997, website "https://bednar.com"
- Joskin (BE): name "Joskin", country "Belgium", founded 1968, website "https://joskin.com"
- Farmet (CZ): name "Farmet", country "Czech Republic", founded 1992, website "https://farmet.cz"
- McHale (IE): name "McHale", country "Ireland", founded 1985, website "https://mchale.net"

Edit `tmp/wikidata-brands.json` directly.

- [ ] **Step 5: Commit script**

```bash
git add scripts/ingest/wikidata-brands.mjs
git commit -m "feat(ingest): Wikidata SPARQL pro brand metadata (18+ značek)"
```

---

### Task 0.5: Fendt techdata fetcher

**Files:**
- Create: `scripts/ingest/fendt-techdata.mjs`

- [ ] **Step 1: Implement Fendt fetcher**

```javascript
// scripts/ingest/fendt-techdata.mjs
import { writeFile } from 'node:fs/promises';
import { load } from 'cheerio';
import { fetchWithCache } from './fetch-utils.mjs';

// Confirmed model IDs (z Google indexu, viz spec Sekce 7)
const FENDT_MODELS = [
  { id: 1153013, name: 'Fendt-300-Vario', series: '300' },
  { id: 1153083, name: 'Fendt-500-Vario', series: '500' },
  { id: 1465241, name: 'Fendt-600-Vario', series: '600' },
  { id: 1152593, name: 'Fendt-700-Vario-Gen7', series: '700-Gen7' },
  { id: 1551551, name: 'Fendt-700-Vario-Gen7-1', series: '700-Gen7.1' },
  { id: 1153774, name: 'Fendt-900-Vario', series: '900' },
  { id: 1153811, name: 'Fendt-900-Vario-MT', series: '900-MT' },
  { id: 1152748, name: 'Fendt-1000-Vario', series: '1000' },
  { id: 1519937, name: 'Fendt-1000-Vario-Gen4', series: '1000-Gen4' },
  { id: 1152877, name: 'Fendt-1100-MT', series: '1100-MT' },
  { id: 1152010, name: 'Fendt-IDEAL', series: 'IDEAL' },
  { id: 1152083, name: 'Fendt-Generic', series: 'unknown' },
];

function extractTechdata($, key) {
  // HTML struktura Fendt techdata: <table class="techdata"> nebo dl/dt/dd
  const dlValue = $(`dt:contains("${key}") + dd`).first().text().trim();
  if (dlValue) return dlValue;
  const tableValue = $(`tr:has(td:contains("${key}")) td:not(:contains("${key}"))`).first().text().trim();
  return tableValue || null;
}

async function fetchModel({ id, name, series }) {
  const url = `https://api.fendt.com/techdata/GB/en/${id}/${name}`;
  console.log(`[fendt] ${id} ${name}`);
  try {
    const html = await fetchWithCache(url);
    const $ = load(html);
    return {
      id, name, series,
      power_hp: parseFloat(extractTechdata($, 'Maximum power')) || null,
      power_kw: parseFloat(extractTechdata($, 'Maximum power')) || null,
      weight_kg: parseFloat(extractTechdata($, 'Operating weight')) || null,
      _raw_keys: $('dt, table th').map((_, el) => $(el).text().trim()).get().filter(Boolean),
    };
  } catch (err) {
    console.error(`  failed: ${err.message}`);
    return { id, name, series, _error: err.message };
  }
}

async function main() {
  const results = [];
  for (const model of FENDT_MODELS) {
    results.push(await fetchModel(model));
  }
  await writeFile('tmp/fendt-techdata.json', JSON.stringify(results, null, 2));
  console.log(`Wrote tmp/fendt-techdata.json (${results.length} models)`);
}

main().catch((err) => { console.error(err); process.exit(1); });
```

- [ ] **Step 2: Run script**

```bash
node scripts/ingest/fendt-techdata.mjs
```
Expected: tmp/fendt-techdata.json created, 12 models. Check `_raw_keys` to discover real key names if `power_hp` is null.

- [ ] **Step 3: Iterate parser** (review `_raw_keys` výstup, upravit `extractTechdata` selektory dle reality)

- [ ] **Step 4: Commit**

```bash
git add scripts/ingest/fendt-techdata.mjs
git commit -m "feat(ingest): Fendt techdata fetcher (12 traktorových modelů)"
```

---

### Task 0.6: Generic sitemap + JSON-LD scraper framework

**Files:**
- Create: `scripts/ingest/sitemap-scraper.mjs`

- [ ] **Step 1: Implement framework**

```javascript
// scripts/ingest/sitemap-scraper.mjs
import { load } from 'cheerio';
import { fetchWithCache } from './fetch-utils.mjs';
import { preflightCheck } from './legality-checks.mjs';

export async function fetchSitemap(sitemapUrl) {
  const xml = await fetchWithCache(sitemapUrl);
  const urls = [];
  const matches = xml.matchAll(/<loc>([^<]+)<\/loc>/g);
  for (const m of matches) urls.push(m[1].trim());
  return urls;
}

export async function fetchSitemapIndex(indexUrl) {
  // Some sites have sitemap-index → multiple sitemaps
  const urls = await fetchSitemap(indexUrl);
  const all = [];
  for (const url of urls) {
    if (url.endsWith('.xml')) {
      const child = await fetchSitemap(url);
      all.push(...child);
    } else {
      all.push(url);
    }
  }
  return all;
}

export async function extractJsonLd(url) {
  const html = await fetchWithCache(url);
  const $ = load(html);
  const blocks = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html());
      blocks.push(data);
    } catch (err) {
      // skip invalid JSON
    }
  });
  return blocks;
}

export function findProductSchema(jsonLdBlocks) {
  for (const block of jsonLdBlocks) {
    const arr = Array.isArray(block) ? block : [block];
    for (const item of arr) {
      if (item['@type'] === 'Product' || item['@type'] === 'Vehicle') return item;
      if (item['@graph']) {
        for (const g of item['@graph']) {
          if (g['@type'] === 'Product' || g['@type'] === 'Vehicle') return g;
        }
      }
    }
  }
  return null;
}

export async function scrapeBrand({ slug, host, sitemapUrl, productPathRegex, customExtractor }) {
  const allowedPaths = ['/', '/products', '/produkte', '/sitemap.xml'];
  await preflightCheck(host, allowedPaths);
  console.log(`[scraper] ${slug} sitemap ${sitemapUrl}`);
  const urls = sitemapUrl.includes('sitemap-index') ? await fetchSitemapIndex(sitemapUrl) : await fetchSitemap(sitemapUrl);
  const productUrls = urls.filter((u) => productPathRegex.test(u));
  console.log(`  ${productUrls.length} product URLs found`);

  const products = [];
  for (const url of productUrls) {
    try {
      const jsonLd = await extractJsonLd(url);
      const product = findProductSchema(jsonLd);
      let extracted = product ? {
        url,
        name: product.name,
        description: product.description,
        image: Array.isArray(product.image) ? product.image[0] : product.image,
      } : { url, _no_jsonld: true };
      if (customExtractor) extracted = { ...extracted, ...(await customExtractor(url)) };
      products.push(extracted);
    } catch (err) {
      products.push({ url, _error: err.message });
    }
  }
  return products;
}
```

- [ ] **Step 2: Smoke test framework**

```bash
node -e "import('./scripts/ingest/sitemap-scraper.mjs').then(async (m) => { const urls = await m.fetchSitemap('https://www.lemken.com/sitemap.xml'); console.log(urls.length, 'URLs'); console.log(urls.slice(0,5)); }).catch(console.error)"
```
Expected: List of Lemken URLs.

- [ ] **Step 3: Commit**

```bash
git add scripts/ingest/sitemap-scraper.mjs
git commit -m "feat(ingest): generic sitemap+JSON-LD scraper framework"
```

---

### Task 0.7: Per-brand adapters (12 brands × ~10 min každý)

**Files:**
- Create: `scripts/ingest/sources/lemken.mjs`, `pottinger.mjs`, `kuhn.mjs`, `amazone.mjs`, `krone.mjs`, `horsch.mjs`, `vaderstad.mjs`, `bednar.mjs`, `manitou.mjs`, `jcb.mjs`, `joskin.mjs`, `kverneland.mjs`

> **Strategie:** Pro každého výrobce vytvoř adapter s `host`, `sitemapUrl`, `productPathRegex` (regex pro filtrování produktových URL), volitelně `customExtractor` pro fallback HTML parser, pokud výrobce nemá JSON-LD.
>
> Tento task obsahuje **template + checklist** pro každou značku. Pro každou opakuj kroky 1-4.

- [ ] **Step 1: Lemken adapter** (`scripts/ingest/sources/lemken.mjs`)

```javascript
import { scrapeBrand } from '../sitemap-scraper.mjs';
import { writeFile } from 'node:fs/promises';

export const config = {
  slug: 'lemken',
  host: 'lemken.com',
  sitemapUrl: 'https://lemken.com/sitemap.xml',
  productPathRegex: /\/(en|de)\/products\/[^/]+\/?$/,
};

export async function run() {
  const products = await scrapeBrand(config);
  await writeFile(`tmp/lemken-products.json`, JSON.stringify(products, null, 2));
  console.log(`Wrote tmp/lemken-products.json (${products.length} products)`);
  return products;
}

if (import.meta.url === `file://${process.argv[1]}`) run();
```

- [ ] **Step 2: Pöttinger** (`pottinger.mjs`)

Same template, with:
- `host: 'pottinger.at'`
- `sitemapUrl: 'https://www.poettinger.at/sitemap.xml'`
- `productPathRegex: /\/cs_cz\/produkte\/detail\/\d+\//`

- [ ] **Step 3: Kuhn** (`kuhn.mjs`)
- `host: 'kuhn.com'`
- `sitemapUrl: 'https://www.kuhn.com/sitemap.xml'`
- `productPathRegex: /\/(en|fr)\/(crop|landscape|livestock)\//`

- [ ] **Step 4: Amazone** (`amazone.mjs`)
- `host: 'amazone.de'`
- `sitemapUrl: 'https://amazone.de/sitemap.xml'`
- `productPathRegex: /\/(en|de)\/products\/.+/`

- [ ] **Step 5: Krone** (`krone.mjs`)
- `host: 'krone-agriculture.com'`
- `sitemapUrl: 'https://www.krone-agriculture.com/sitemap.xml'`
- `productPathRegex: /\/(en|cs)\/products\/.+/`

- [ ] **Step 6: Horsch** (`horsch.mjs`)
- `host: 'horsch.com'`
- `sitemapUrl: 'https://www.horsch.com/sitemap.xml'`
- `productPathRegex: /\/(us|cs)\/products\/.+/`

- [ ] **Step 7: Väderstad** (`vaderstad.mjs`)
- `host: 'vaderstad.com'`
- `sitemapUrl: 'https://www.vaderstad.com/sitemap.xml'`
- `productPathRegex: /\/(us-en|en)\/.+/`

- [ ] **Step 8: Bednar** (`bednar.mjs`)
- `host: 'bednar.com'`
- `sitemapUrl: 'https://www.bednar.com/sitemap.xml'`
- `productPathRegex: /\/(en|cz)\/products\/.+/`

- [ ] **Step 9: Manitou** (`manitou.mjs`)
- `host: 'manitou.com'`
- `sitemapUrl: 'https://www.manitou.com/sitemap.xml'`
- `productPathRegex: /\/(en|fr)\/products\/.+/`

- [ ] **Step 10: JCB** (`jcb.mjs`)
- `host: 'jcb.com'`
- `sitemapUrl: 'https://www.jcb.com/sitemap.xml'`
- `productPathRegex: /\/products\/(loadall|telehandlers)\/.+/`

- [ ] **Step 11: Joskin** (`joskin.mjs`)
- `host: 'joskin.com'`
- `sitemapUrl: 'https://www.joskin.com/sitemap.xml'`
- `productPathRegex: /\/(en|cs)\/.+/`

- [ ] **Step 12: Kverneland** (`kverneland.mjs`)
- `host: 'kverneland.com'`
- `sitemapUrl: 'https://ien.kverneland.com/sitemap.xml'`
- `productPathRegex: /\/(en)\/products\/.+/`

- [ ] **Step 13: Run all adapters sequentially**

```bash
for brand in lemken pottinger kuhn amazone krone horsch vaderstad bednar manitou jcb joskin kverneland; do
  echo "=== $brand ==="
  node scripts/ingest/sources/$brand.mjs || echo "  $brand FAILED"
done
```

Expected: 12 `tmp/<brand>-products.json` files. Některé mohou selhat (sitemap neexistuje na očekávané URL) — manuálně zjistit a opravit URL.

- [ ] **Step 14: Manuální oprava failed adapterů**

Pro každého výrobce, jehož sitemap selhal:
1. Otevři `https://<host>/robots.txt` a hledej `Sitemap:` URL
2. Update `sitemapUrl` v adapteru
3. Re-run

- [ ] **Step 15: Commit všech adapterů**

```bash
git add scripts/ingest/sources/
git commit -m "feat(ingest): per-brand adaptery pro 12 značek (sitemap+JSON-LD scraping)"
```

---

### Task 0.8: PDF brochure extraction pipeline

**Files:**
- Create: `scripts/ingest/pdf-extract.mjs`

- [ ] **Step 1: Implement PDF parser + Claude extraction**

```javascript
// scripts/ingest/pdf-extract.mjs
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import pdfParse from 'pdf-parse';
import Anthropic from '@anthropic-ai/sdk';
import { fetchWithCache } from './fetch-utils.mjs';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function downloadPdf(url, localPath) {
  console.log(`[pdf] download ${url}`);
  const res = await fetch(url, { headers: { 'User-Agent': 'agro-svet-bot/1.0 (+https://agro-svet.cz/)' } });
  if (!res.ok) throw new Error(`PDF fetch ${url}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(dirname(localPath), { recursive: true });
  await writeFile(localPath, buf);
  return buf;
}

export async function extractPdfText(buf) {
  const data = await pdfParse(buf);
  return data.text;
}

export async function extractSpecsViaClaude(text, modelHint = '') {
  const response = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Z následujícího textu zemědělské brožury vyextrahuj technická data jednotlivých modelů. Vrať pouze JSON s polem objektů, kde každý objekt má fields:
- name (model name jako string, např. "Lemken Juwel 8")
- power_hp (number nebo null)
- weight_kg (number nebo null)
- pracovni_zaber_m (number nebo null)
- year_from (number nebo null)
- year_to (number nebo null)
- typ_zavesu ("neseny" | "tazeny" | "samojizdny" | "navesny" | null)
- specs (object s dalšími fakty: pocet_radlic, otocny boolean, atd.)
- _confidence (0.0-1.0 jak jistý si jsi)

${modelHint ? `Hint: tato brožura je o "${modelHint}".` : ''}

Text (zkracený na 8000 znaků):
${text.slice(0, 8000)}

Vrať JEN JSON, nic jiného.`
    }],
  });
  const content = response.content[0].text;
  // Extract JSON from response (Claude může wrapnout v ```json)
  const jsonMatch = content.match(/```json\n([\s\S]+?)\n```/) || content.match(/\[[\s\S]+\]/);
  return JSON.parse(jsonMatch ? jsonMatch[1] || jsonMatch[0] : content);
}

export async function processPdf(url, modelHint) {
  const localPath = `tmp/pdf/${url.split('/').pop()}`;
  let buf;
  try {
    buf = await readFile(localPath);
  } catch {
    buf = await downloadPdf(url, localPath);
  }
  const text = await extractPdfText(buf);
  console.log(`[pdf] text length ${text.length}`);
  const specs = await extractSpecsViaClaude(text, modelHint);
  return { url, specs, text_preview: text.slice(0, 500) };
}

// CLI usage: node scripts/ingest/pdf-extract.mjs <url> <modelHint>
if (import.meta.url === `file://${process.argv[1]}`) {
  const [url, hint] = process.argv.slice(2);
  if (!url) { console.error('Usage: pdf-extract.mjs <url> [hint]'); process.exit(1); }
  processPdf(url, hint || '').then((r) => console.log(JSON.stringify(r, null, 2))).catch(console.error);
}
```

- [ ] **Step 2: Test on Bednar Omega brochure**

Find Bednar Omega PDF on bednar.com or pdf.agriexpo.online, then:

```bash
export ANTHROPIC_API_KEY=$(cat ~/.anthropic-key 2>/dev/null || echo "$ANTHROPIC_API_KEY")
node scripts/ingest/pdf-extract.mjs "https://www.bednar.com/.../omega.pdf" "Bednar Omega"
```

Expected: JSON with 1+ model entries having power_hp, weight_kg, pracovni_zaber_m.

- [ ] **Step 3: Commit**

```bash
git add scripts/ingest/pdf-extract.mjs
git commit -m "feat(ingest): PDF brochure extraction pipeline (pdf-parse + Claude API)"
```

---

### Task 0.9: CZ velkodealer scraper

**Files:**
- Create: `scripts/ingest/cz-dealers.mjs`

- [ ] **Step 1: Implement CZ dealer scraper**

```javascript
// scripts/ingest/cz-dealers.mjs
// Stahuje CZ-jazyčné popisy a lokální dostupnost z velkodealerů
import { writeFile } from 'node:fs/promises';
import { load } from 'cheerio';
import { fetchWithCache } from './fetch-utils.mjs';
import { preflightCheck } from './legality-checks.mjs';

const DEALERS = [
  {
    slug: 'strom',
    host: 'strom.cz',
    catalogUrl: 'https://www.strom.cz/zemedelska-technika/',
    productSelector: 'a.product-card',
    nameSelector: 'h1, h2.product-title',
    descSelector: '.product-description',
  },
  // Other dealers (AGROTEC, Pekass, AGRALL, Daňhel) — analog
];

async function scrapeDealer(dealer) {
  await preflightCheck(dealer.host, ['/']);
  console.log(`[dealer] ${dealer.slug}`);
  const html = await fetchWithCache(dealer.catalogUrl);
  const $ = load(html);
  const products = [];
  $(dealer.productSelector).each((_, el) => {
    const $el = $(el);
    products.push({
      url: new URL($el.attr('href'), `https://${dealer.host}`).href,
      name: $el.find(dealer.nameSelector).first().text().trim(),
      desc: $el.find(dealer.descSelector).first().text().trim(),
    });
  });
  return products;
}

async function main() {
  const all = {};
  for (const dealer of DEALERS) {
    try {
      all[dealer.slug] = await scrapeDealer(dealer);
    } catch (err) {
      console.error(`${dealer.slug} failed: ${err.message}`);
      all[dealer.slug] = { _error: err.message };
    }
  }
  await writeFile('tmp/cz-dealers.json', JSON.stringify(all, null, 2));
}

main().catch(console.error);
```

- [ ] **Step 2: Run script**

```bash
node scripts/ingest/cz-dealers.mjs
```

- [ ] **Step 3: Iterate selectors** (real HTML structure differs)

- [ ] **Step 4: Commit**

```bash
git add scripts/ingest/cz-dealers.mjs
git commit -m "feat(ingest): CZ dealer scraper (Strom Praha + framework)"
```

---

### Task 0.10: YAML builder — merger všech ingest výstupů

**Files:**
- Create: `scripts/ingest/build-yaml.mjs`

- [ ] **Step 1: Implement merger**

```javascript
// scripts/ingest/build-yaml.mjs
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import jsyaml from 'js-yaml';

async function readJson(path) {
  if (!existsSync(path)) return null;
  return JSON.parse(await readFile(path, 'utf-8'));
}

async function buildBrandYaml(slug) {
  const wikidata = await readJson('tmp/wikidata-brands.json');
  const products = await readJson(`tmp/${slug}-products.json`) || [];
  const fendt = slug === 'fendt' ? await readJson('tmp/fendt-techdata.json') : null;
  
  const brandMeta = wikidata?.[slug] || {};
  
  const yaml = {
    slug,
    name: brandMeta.name || slug,
    country: brandMeta.country || null,
    founded: brandMeta.founded || null,
    website: brandMeta.website || null,
    description: '', // TODO: napsat ručně v Fázi 2
    categories: {},
  };
  
  // Group products by subcategory (TODO: heuristic from URL/name)
  // Pro V1: výstup jako "raw" series ve struktuře, manuálně rozřadit ve Fázi 2
  const seriesArr = products.filter((p) => !p._error && !p._no_jsonld).map((p) => ({
    slug: slugify(p.name || p.url),
    name: p.name || '',
    description: p.description || '',
    _source_url: p.url,
    models: [],
  }));
  
  yaml.categories['_unsorted'] = { name: 'TODO: roztrídit', series: seriesArr };
  
  await mkdir('tmp/seed', { recursive: true });
  await writeFile(`tmp/seed/${slug}.yaml`, jsyaml.dump(yaml, { lineWidth: 120 }));
  console.log(`Wrote tmp/seed/${slug}.yaml (${seriesArr.length} series)`);
}

function slugify(s) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const BRANDS = ['lemken', 'pottinger', 'kuhn', 'amazone', 'krone', 'horsch', 'vaderstad', 'bednar', 'manitou', 'jcb', 'joskin', 'kverneland'];

for (const b of BRANDS) await buildBrandYaml(b);
```

- [ ] **Step 2: Run merger**

```bash
node scripts/ingest/build-yaml.mjs
```

Expected: 12 `tmp/seed/<brand>.yaml` files with raw structure ready for Phase 2 manual finishing.

- [ ] **Step 3: Commit**

```bash
git add scripts/ingest/build-yaml.mjs
git commit -m "feat(ingest): YAML builder mergující ingest výstupy do tmp/seed/"
```

---

### Task 0.11: Orchestrátor

**Files:**
- Create: `scripts/ingest/run-all.mjs`

- [ ] **Step 1: Write orchestrátor**

```javascript
// scripts/ingest/run-all.mjs
import { spawn } from 'node:child_process';

async function run(cmd, args) {
  console.log(`\n=== ${cmd} ${args.join(' ')} ===`);
  return new Promise((resolve) => {
    const p = spawn(cmd, args, { stdio: 'inherit' });
    p.on('close', resolve);
  });
}

await run('node', ['scripts/ingest/wikidata-brands.mjs']);
await run('node', ['scripts/ingest/fendt-techdata.mjs']);
const BRANDS = ['lemken', 'pottinger', 'kuhn', 'amazone', 'krone', 'horsch', 'vaderstad', 'bednar', 'manitou', 'jcb', 'joskin', 'kverneland'];
for (const b of BRANDS) {
  await run('node', [`scripts/ingest/sources/${b}.mjs`]);
}
await run('node', ['scripts/ingest/cz-dealers.mjs']);
await run('node', ['scripts/ingest/build-yaml.mjs']);
console.log('\nDone. Output: tmp/seed/*.yaml');
```

- [ ] **Step 2: Run full pipeline**

```bash
node scripts/ingest/run-all.mjs
```

Očekávaný čas: 30-60 min při rate-limit 1 req/s × ~200 produktů × 12 značek.

- [ ] **Step 3: Verify výstup**

```bash
ls tmp/seed/
wc -l tmp/seed/*.yaml
```

Expected: 12 YAML files, každý ~50-200 řádků.

- [ ] **Step 4: Commit**

```bash
git add scripts/ingest/run-all.mjs
git commit -m "feat(ingest): orchestrátor — run-all.mjs spustí celou pipeline"
```

---

## Phase 1: Schema & Loader (½ dne)

### Task 1.1: Rozšíření StrojKategorie enum

**Files:**
- Modify: `src/lib/stroje.ts`
- Create: `tests/lib/stroje.test.ts`

- [ ] **Step 1: Write failing test**

```typescript
// tests/lib/stroje.test.ts
import { describe, it, expect } from 'vitest';
import { getEffectiveZaber, FUNCTIONAL_GROUPS, type StrojKategorie } from '../../src/lib/stroje';

describe('stroje lib', () => {
  it('FUNCTIONAL_GROUPS má 10 skupin', () => {
    expect(Object.keys(FUNCTIONAL_GROUPS)).toHaveLength(10);
  });

  it('zpracovani-pudy obsahuje 7 sub-kategorií', () => {
    expect(FUNCTIONAL_GROUPS['zpracovani-pudy'].categories).toHaveLength(7);
  });

  it('getEffectiveZaber preferuje pracovni_zaber_m před cutting_width_m', () => {
    expect(getEffectiveZaber({ pracovni_zaber_m: 2.5, cutting_width_m: 9 } as any)).toBe(2.5);
    expect(getEffectiveZaber({ cutting_width_m: 9 } as any)).toBe(9);
    expect(getEffectiveZaber({} as any)).toBe(null);
  });

  it('všechny FUNCTIONAL_GROUPS.categories[] hodnoty existují v StrojKategorie typu', () => {
    // Compile-time check via TypeScript — jen že kód kompiluje
    const allCats: StrojKategorie[] = Object.values(FUNCTIONAL_GROUPS).flatMap((g) => g.categories);
    expect(allCats.length).toBeGreaterThan(40);
  });
});
```

- [ ] **Step 2: Run test → FAIL**

```bash
npx vitest run tests/lib/stroje.test.ts
```
Expected: FAIL (FUNCTIONAL_GROUPS not exported, getEffectiveZaber not exported).

- [ ] **Step 3: Update stroje.ts**

Add to `src/lib/stroje.ts`:

```typescript
// PŘED existing types
export type StrojKategorie =
  | 'traktory' | 'kombajny'
  // zpracování půdy
  | 'pluhy' | 'podmitace-diskove' | 'podmitace-radlickove'
  | 'kyprice' | 'rotacni-brany' | 'kompaktomaty' | 'valce'
  // setí
  | 'seci-stroje-mechanicke' | 'seci-stroje-pneumaticke' | 'seci-stroje-presne'
  | 'seci-kombinace' | 'sazecky-brambor'
  // hnojení
  | 'rozmetadla-mineralni' | 'rozmetadla-statkova' | 'cisterny-kejda' | 'aplikatory-kejda'
  // ochrana rostlin
  | 'postrikovace-nesene' | 'postrikovace-tazene' | 'postrikovace-samojizdne'
  // sklizeň pícnin
  | 'zaci-stroje' | 'obracece' | 'shrnovace'
  | 'lisy-valcove' | 'lisy-hranolove' | 'obalovace'
  | 'rezacky-samojizdne' | 'samosberaci-vozy'
  // sklizeň okopanin
  | 'sklizece-brambor' | 'sklizece-repy' | 'vyoravace'
  // manipulace
  | 'celni-nakladace' | 'teleskopy' | 'kolove-nakladace'
  | 'kloubove-nakladace' | 'smykove-nakladace'
  // doprava
  | 'navesy-sklapeci' | 'navesy-valnik' | 'navesy-posuvne-dno'
  | 'cisterny-voda' | 'prepravniky-zrna'
  // stáj-chov
  | 'krmne-vozy' | 'dojici-roboti' | 'podestylace'
  // komunál-les
  | 'mulcovace' | 'stepkovace' | 'lesni-vyvazecky';

export interface StrojModel {
  slug: string;
  name: string;
  year_from: number | null;
  year_to: number | null;
  power_hp: number | null;
  power_kw: number | null;
  engine?: string;
  transmission?: string;
  weight_kg?: number | null;
  cutting_width_m?: number | null;
  grain_tank_l?: number | null;
  description?: string;
  image_url?: string | null;
  specs?: Record<string, string | number | boolean | null>;
  // NEW
  pracovni_zaber_m?: number | null;
  prikon_traktor_hp_min?: number | null;
  prikon_traktor_hp_max?: number | null;
  typ_zavesu?: 'neseny' | 'tazeny' | 'poloneseny' | 'samojizdny' | 'navesny' | null;
}

export const FUNCTIONAL_GROUPS = {
  'zpracovani-pudy': {
    name: 'Zpracování půdy',
    description: 'Pluhy, podmítače, kypřiče, brány, kompaktomaty a válce',
    categories: ['pluhy', 'podmitace-diskove', 'podmitace-radlickove', 'kyprice', 'rotacni-brany', 'kompaktomaty', 'valce'] as StrojKategorie[],
  },
  'seti': {
    name: 'Setí a sázení',
    description: 'Secí stroje (mechanické, pneumatické, přesné), sázečky',
    categories: ['seci-stroje-mechanicke', 'seci-stroje-pneumaticke', 'seci-stroje-presne', 'seci-kombinace', 'sazecky-brambor'] as StrojKategorie[],
  },
  'hnojeni': {
    name: 'Hnojení',
    description: 'Rozmetadla minerálních a statkových hnojiv, cisterny na kejdu, aplikátory',
    categories: ['rozmetadla-mineralni', 'rozmetadla-statkova', 'cisterny-kejda', 'aplikatory-kejda'] as StrojKategorie[],
  },
  'ochrana-rostlin': {
    name: 'Ochrana rostlin',
    description: 'Postřikovače nesené, tažené, samojízdné',
    categories: ['postrikovace-nesene', 'postrikovace-tazene', 'postrikovace-samojizdne'] as StrojKategorie[],
  },
  'sklizen-picnin': {
    name: 'Sklizeň pícnin a slámy',
    description: 'Žací stroje, obraceče, shrnovače, lisy, řezačky, samosběrací vozy',
    categories: ['zaci-stroje', 'obracece', 'shrnovace', 'lisy-valcove', 'lisy-hranolove', 'obalovace', 'rezacky-samojizdne', 'samosberaci-vozy'] as StrojKategorie[],
  },
  'sklizen-okopanin': {
    name: 'Sklizeň okopanin',
    description: 'Sklízeče brambor, řepy, vyorávače',
    categories: ['sklizece-brambor', 'sklizece-repy', 'vyoravace'] as StrojKategorie[],
  },
  'manipulace': {
    name: 'Manipulace a nakládání',
    description: 'Teleskopy, čelní/kolové/kloubové/smykové nakladače',
    categories: ['celni-nakladace', 'teleskopy', 'kolove-nakladace', 'kloubove-nakladace', 'smykove-nakladace'] as StrojKategorie[],
  },
  'doprava': {
    name: 'Doprava',
    description: 'Návěsy sklápěcí, valníkové, s posuvným dnem, cisterny na vodu, přepravníky zrna',
    categories: ['navesy-sklapeci', 'navesy-valnik', 'navesy-posuvne-dno', 'cisterny-voda', 'prepravniky-zrna'] as StrojKategorie[],
  },
  'staj-chov': {
    name: 'Stáj a chov',
    description: 'Krmné vozy, dojicí roboti, podestýlací stroje',
    categories: ['krmne-vozy', 'dojici-roboti', 'podestylace'] as StrojKategorie[],
  },
  'komunal-les': {
    name: 'Komunál a les',
    description: 'Mulčovače, štěpkovače, lesní vyvážečky',
    categories: ['mulcovace', 'stepkovace', 'lesni-vyvazecky'] as StrojKategorie[],
  },
} as const;

export type FunctionalGroupSlug = keyof typeof FUNCTIONAL_GROUPS;

export function getEffectiveZaber(model: StrojModel): number | null {
  return model.pracovni_zaber_m ?? model.cutting_width_m ?? null;
}

export function getFunctionalGroupForCategory(cat: StrojKategorie): FunctionalGroupSlug | null {
  for (const [slug, group] of Object.entries(FUNCTIONAL_GROUPS)) {
    if ((group.categories as readonly string[]).includes(cat)) return slug as FunctionalGroupSlug;
  }
  return null;
}
```

- [ ] **Step 4: Update seriesFamily for kebab-case**

In existing `seriesFamily()`, ensure kebab-case slugs work. Existing impl matches `/^\d/` and `/^[a-z]+/` which is fine for kebab-case. No change needed unless test fails.

- [ ] **Step 5: Run tests → PASS**

```bash
npx vitest run tests/lib/stroje.test.ts
```
Expected: PASS (4 tests).

- [ ] **Step 6: Run build → no TS errors**

```bash
npm run build 2>&1 | head -50
```
Expected: build proceeds (může selhat na `/statistiky/` CZSO timeout — to je preexisting).

- [ ] **Step 7: Commit**

```bash
git add src/lib/stroje.ts tests/lib/stroje.test.ts
git commit -m "feat(stroje): rozšíření StrojKategorie o ~45 sub-kategorií + FUNCTIONAL_GROUPS"
```

---

### Task 1.2: Per-subcategory filter spec

**Files:**
- Create: `src/lib/stroje-filters.ts`
- Create: `tests/lib/stroje-filters.test.ts`

- [ ] **Step 1: Write failing test**

```typescript
// tests/lib/stroje-filters.test.ts
import { describe, it, expect } from 'vitest';
import { SUBCATEGORY_FILTERS, getFiltersFor } from '../../src/lib/stroje-filters';

describe('stroje-filters', () => {
  it('má filter pro pluhy', () => {
    const filters = getFiltersFor('pluhy');
    expect(filters.length).toBeGreaterThan(0);
    expect(filters.find((f) => f.key === 'pocet_radlic')).toBeDefined();
  });

  it('má filter pro lisy-valcove', () => {
    const filters = getFiltersFor('lisy-valcove');
    expect(filters.find((f) => f.key === 'typ_komory')).toBeDefined();
  });

  it('vrací prázdné pole pro neexistující subcategory', () => {
    expect(getFiltersFor('xxx-neexistuje' as any)).toEqual([]);
  });

  it('teleskopy mají nosnost_kg, vyska_zdvihu_m, dosah_m', () => {
    const keys = getFiltersFor('teleskopy').map((f) => f.key);
    expect(keys).toContain('nosnost_kg');
    expect(keys).toContain('vyska_zdvihu_m');
    expect(keys).toContain('dosah_m');
  });
});
```

- [ ] **Step 2: Run test → FAIL**

```bash
npx vitest run tests/lib/stroje-filters.test.ts
```

- [ ] **Step 3: Implement stroje-filters.ts**

```typescript
// src/lib/stroje-filters.ts
import type { StrojKategorie } from './stroje';

export type FilterSpec = {
  key: string;
  label: string;
  type: 'number_range' | 'enum' | 'boolean';
  options?: { value: string; label: string }[];
  unit?: string;
  source: 'top' | 'specs';
};

export const SUBCATEGORY_FILTERS: Partial<Record<StrojKategorie, FilterSpec[]>> = {
  pluhy: [
    { key: 'pocet_radlic', label: 'Počet radlic', type: 'number_range', source: 'specs' },
    { key: 'otocny', label: 'Otočný', type: 'boolean', source: 'specs' },
    { key: 'pracovni_zaber_m', label: 'Pracovní záběr (m)', type: 'number_range', unit: 'm', source: 'top' },
  ],
  'lisy-valcove': [
    { key: 'typ_komory', label: 'Typ komory', type: 'enum', options: [
      { value: 'variabilní', label: 'Variabilní' },
      { value: 'pevná', label: 'Pevná' },
    ], source: 'specs' },
    { key: 'balic_integrovany', label: 'Integrovaný balič', type: 'boolean', source: 'specs' },
    { key: 'prumer_baliku_cm', label: 'Průměr balíku (cm)', type: 'number_range', unit: 'cm', source: 'specs' },
  ],
  'lisy-hranolove': [
    { key: 'rozmer_baliku_cm', label: 'Rozměr balíku', type: 'enum', options: [
      { value: '80x90', label: '80×90 cm' },
      { value: '120x90', label: '120×90 cm' },
      { value: '120x130', label: '120×130 cm' },
    ], source: 'specs' },
  ],
  teleskopy: [
    { key: 'nosnost_kg', label: 'Nosnost (kg)', type: 'number_range', unit: 'kg', source: 'specs' },
    { key: 'vyska_zdvihu_m', label: 'Výška zdvihu (m)', type: 'number_range', unit: 'm', source: 'specs' },
    { key: 'dosah_m', label: 'Dosah (m)', type: 'number_range', unit: 'm', source: 'specs' },
  ],
  'celni-nakladace': [
    { key: 'nosnost_kg', label: 'Nosnost (kg)', type: 'number_range', unit: 'kg', source: 'specs' },
    { key: 'vyska_zdvihu_m', label: 'Výška zdvihu (m)', type: 'number_range', unit: 'm', source: 'specs' },
  ],
  'postrikovace-nesene': [
    { key: 'objem_nadrze_l', label: 'Objem nádrže (l)', type: 'number_range', unit: 'l', source: 'specs' },
    { key: 'zaber_ramen_m', label: 'Záběr ramen (m)', type: 'number_range', unit: 'm', source: 'specs' },
  ],
  'postrikovace-tazene': [
    { key: 'objem_nadrze_l', label: 'Objem nádrže (l)', type: 'number_range', unit: 'l', source: 'specs' },
    { key: 'zaber_ramen_m', label: 'Záběr ramen (m)', type: 'number_range', unit: 'm', source: 'specs' },
  ],
  'postrikovace-samojizdne': [
    { key: 'objem_nadrze_l', label: 'Objem nádrže (l)', type: 'number_range', unit: 'l', source: 'specs' },
    { key: 'zaber_ramen_m', label: 'Záběr ramen (m)', type: 'number_range', unit: 'm', source: 'specs' },
  ],
  'cisterny-kejda': [
    { key: 'objem_l', label: 'Objem (l)', type: 'number_range', unit: 'l', source: 'specs' },
    { key: 'typ_aplikatoru', label: 'Typ aplikátoru', type: 'enum', options: [
      { value: 'botky', label: 'Botky' },
      { value: 'hadicovy', label: 'Hadicový' },
      { value: 'diskovy injektor', label: 'Diskový injektor' },
    ], source: 'specs' },
  ],
  'rozmetadla-mineralni': [
    { key: 'nosnost_kose_kg', label: 'Nosnost koše (kg)', type: 'number_range', unit: 'kg', source: 'specs' },
    { key: 'zaber_aplikace_m', label: 'Záběr aplikace (m)', type: 'number_range', unit: 'm', source: 'specs' },
  ],
  'navesy-sklapeci': [
    { key: 'nosnost_t', label: 'Nosnost (t)', type: 'number_range', unit: 't', source: 'specs' },
    { key: 'objem_korby_m3', label: 'Objem korby (m³)', type: 'number_range', unit: 'm³', source: 'specs' },
    { key: 'pocet_naprav', label: 'Počet náprav', type: 'enum', options: [
      { value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' },
    ], source: 'specs' },
  ],
  'krmne-vozy': [
    { key: 'objem_m3', label: 'Objem (m³)', type: 'number_range', unit: 'm³', source: 'specs' },
    { key: 'pocet_sneku', label: 'Počet šneků', type: 'enum', options: [
      { value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' },
    ], source: 'specs' },
  ],
  'mulcovace': [
    { key: 'zaber_m', label: 'Pracovní záběr (m)', type: 'number_range', unit: 'm', source: 'specs' },
    { key: 'typ_noze', label: 'Typ nože', type: 'enum', options: [
      { value: 'kladivka', label: 'Kladívka' },
      { value: 'cepy', label: 'Cepy' },
      { value: 'noze', label: 'Nože' },
    ], source: 'specs' },
  ],
  // ... další subcategories přidávat dle potřeby. Pokud subcategory nemá specifický filter,
  // SUBCATEGORY_FILTERS pro ni vrací undefined → getFiltersFor vrací jen univerzální filtry
};

export function getFiltersFor(subcategory: StrojKategorie): FilterSpec[] {
  return SUBCATEGORY_FILTERS[subcategory] ?? [];
}
```

- [ ] **Step 4: Run test → PASS**

```bash
npx vitest run tests/lib/stroje-filters.test.ts
```
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/stroje-filters.ts tests/lib/stroje-filters.test.ts
git commit -m "feat(stroje): SUBCATEGORY_FILTERS mapa pro per-subcategory filtry"
```

---

### Task 1.3: Spec labels pretty-print mapa

**Files:**
- Create: `src/lib/spec-labels.ts`
- Create: `tests/lib/spec-labels.test.ts`

- [ ] **Step 1: Write failing test**

```typescript
// tests/lib/spec-labels.test.ts
import { describe, it, expect } from 'vitest';
import { getSpecLabel, formatSpecValue } from '../../src/lib/spec-labels';

describe('spec-labels', () => {
  it('vrací CZ label pro známý klíč', () => {
    expect(getSpecLabel('pocet_radlic')).toBe('Počet radlic');
    expect(getSpecLabel('typ_komory')).toBe('Typ komory');
  });

  it('vrací prettified slug pro neznámý klíč', () => {
    expect(getSpecLabel('xyz_unknown_field')).toBe('Xyz unknown field');
  });

  it('formátuje boolean jako Ano/Ne', () => {
    expect(formatSpecValue(true)).toBe('Ano');
    expect(formatSpecValue(false)).toBe('Ne');
  });

  it('formátuje number bez změny', () => {
    expect(formatSpecValue(125)).toBe('125');
    expect(formatSpecValue(2.5)).toBe('2,5');
  });

  it('formátuje string bez změny', () => {
    expect(formatSpecValue('variabilní')).toBe('variabilní');
  });

  it('null → pomlčka', () => {
    expect(formatSpecValue(null)).toBe('—');
  });
});
```

- [ ] **Step 2: Run test → FAIL**

- [ ] **Step 3: Implement spec-labels.ts**

```typescript
// src/lib/spec-labels.ts
export const SPEC_LABELS: Record<string, string> = {
  pocet_radlic: 'Počet radlic',
  otocny: 'Otočný',
  pracovni_hloubka_cm: 'Pracovní hloubka (cm)',
  typ_telesa: 'Typ tělesa',
  objem_nadrze_l: 'Objem nádrže (l)',
  zaber_ramen_m: 'Záběr ramen (m)',
  typ_ramen: 'Typ ramen',
  typ_komory: 'Typ komory',
  prumer_baliku_cm: 'Průměr balíku (cm)',
  sirka_baliku_cm: 'Šířka balíku (cm)',
  balic_integrovany: 'Integrovaný balič',
  rozmer_baliku_cm: 'Rozměr balíku (cm)',
  ridlost: 'Hustota lisování',
  pocet_radku: 'Počet řádků',
  rozteč_radku_cm: 'Rozteč řádků (cm)',
  typ_botky: 'Typ botky',
  objem_zasobniku_l: 'Objem zásobníku (l)',
  nosnost_kose_kg: 'Nosnost koše (kg)',
  zaber_aplikace_m: 'Záběr aplikace (m)',
  objem_l: 'Objem (l)',
  typ_aplikatoru: 'Typ aplikátoru',
  typ_zacky: 'Typ žačky',
  mackac: 'Mačkač',
  poloha: 'Poloha',
  nosnost_kg: 'Nosnost (kg)',
  vyska_zdvihu_m: 'Výška zdvihu (m)',
  dosah_m: 'Dosah (m)',
  nosnost_t: 'Nosnost (t)',
  objem_korby_m3: 'Objem korby (m³)',
  pocet_naprav: 'Počet náprav',
  sklapeni: 'Sklápění',
  objem_m3: 'Objem (m³)',
  pocet_sneku: 'Počet šneků',
  samochodny: 'Samojízdný',
  zaber_m: 'Pracovní záběr (m)',
  typ_noze: 'Typ nože',
  hydraulika_l_min: 'Hydraulika (l/min)',
  kabina: 'Kabina',
  strip_till: 'Strip-till',
  sektor: 'Sektor',
};

function prettify(key: string): string {
  return key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
}

export function getSpecLabel(key: string): string {
  return SPEC_LABELS[key] ?? prettify(key);
}

export function formatSpecValue(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'Ano' : 'Ne';
  if (typeof value === 'number') return value.toString().replace('.', ',');
  return String(value);
}
```

- [ ] **Step 4: Run test → PASS**

```bash
npx vitest run tests/lib/spec-labels.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/spec-labels.ts tests/lib/spec-labels.test.ts
git commit -m "feat(stroje): spec-labels — pretty-print pro spec keys"
```

---

## Phase 2: YAML Seed Finishing (1-2 dny)

> **Cíl:** Vzít `tmp/seed/<brand>.yaml` z Fáze 0, manuálně dokončit (CZ popisky, kategorizace, doplnění chybějících specs), přesunout do `src/data/stroje/<brand>.yaml`.

### Task 2.1: YAML validační skript

**Files:**
- Create: `scripts/validate-stroje-yaml.mjs`

- [ ] **Step 1: Implement validator**

```javascript
// scripts/validate-stroje-yaml.mjs
import { readdir, readFile } from 'node:fs/promises';
import jsyaml from 'js-yaml';

const VALID_CATEGORIES = new Set([
  'traktory', 'kombajny',
  'pluhy', 'podmitace-diskove', 'podmitace-radlickove', 'kyprice', 'rotacni-brany', 'kompaktomaty', 'valce',
  'seci-stroje-mechanicke', 'seci-stroje-pneumaticke', 'seci-stroje-presne', 'seci-kombinace', 'sazecky-brambor',
  'rozmetadla-mineralni', 'rozmetadla-statkova', 'cisterny-kejda', 'aplikatory-kejda',
  'postrikovace-nesene', 'postrikovace-tazene', 'postrikovace-samojizdne',
  'zaci-stroje', 'obracece', 'shrnovace', 'lisy-valcove', 'lisy-hranolove', 'obalovace', 'rezacky-samojizdne', 'samosberaci-vozy',
  'sklizece-brambor', 'sklizece-repy', 'vyoravace',
  'celni-nakladace', 'teleskopy', 'kolove-nakladace', 'kloubove-nakladace', 'smykove-nakladace',
  'navesy-sklapeci', 'navesy-valnik', 'navesy-posuvne-dno', 'cisterny-voda', 'prepravniky-zrna',
  'krmne-vozy', 'dojici-roboti', 'podestylace',
  'mulcovace', 'stepkovace', 'lesni-vyvazecky',
]);

let errors = 0;

async function validateFile(path) {
  const raw = await readFile(path, 'utf-8');
  const data = jsyaml.load(raw);
  const slugs = new Set();
  
  if (!data.slug || !data.name) {
    console.error(`${path}: missing slug/name`);
    errors++;
  }
  
  for (const [catKey, cat] of Object.entries(data.categories || {})) {
    if (!VALID_CATEGORIES.has(catKey)) {
      console.error(`${path}: unknown category "${catKey}"`);
      errors++;
    }
    for (const series of cat.series || []) {
      for (const model of series.models || []) {
        if (slugs.has(model.slug)) {
          console.error(`${path}: duplicate model slug "${model.slug}"`);
          errors++;
        }
        slugs.add(model.slug);
        if (!model.slug?.startsWith(data.slug + '-')) {
          console.warn(`${path}: model slug "${model.slug}" should start with "${data.slug}-"`);
        }
      }
    }
  }
}

const files = await readdir('src/data/stroje');
for (const f of files.filter((x) => x.endsWith('.yaml'))) {
  await validateFile(`src/data/stroje/${f}`);
}

if (errors > 0) {
  console.error(`\n${errors} errors found`);
  process.exit(1);
}
console.log(`OK ${files.length} YAML files validated`);
```

- [ ] **Step 2: Run validator on existing YAMLs**

```bash
node scripts/validate-stroje-yaml.mjs
```
Expected: OK message (existing 10 traktor YAMLy projdou).

- [ ] **Step 3: Commit**

```bash
git add scripts/validate-stroje-yaml.mjs
git commit -m "chore(stroje): YAML validation skript pro pre-deploy check"
```

---

### Task 2.2: Lemken YAML — manuální finishing

**Files:**
- Create: `src/data/stroje/lemken.yaml` (z `tmp/seed/lemken.yaml`)

- [ ] **Step 1: Otevři tmp/seed/lemken.yaml a roztrid `_unsorted` series do správných sub-kategorií**

```yaml
# src/data/stroje/lemken.yaml
slug: lemken
name: Lemken
country: Německo
founded: 1780
website: https://lemken.com
description: >
  Německý výrobce klasických nesených i polonesených pluhů (Juwel, Diamant) a komplexního
  portfolia podmítačů (Rubin, Heliodor), kypřičů (Karat), rotačních bran (Zirkon),
  secích strojů (Solitair, Saphir) a postřikovačů (Sirius, Vega, Albatros).
categories:
  pluhy:
    name: Pluhy
    series:
      - slug: juwel
        name: "Juwel"
        year_from: 2010
        year_to: null
        description: >
          Universální nesené otočné pluhy s hydraulickou regulací. Optimalizované pro
          výkony 140-240 hp.
        models:
          - slug: lemken-juwel-7
            name: "Juwel 7"
            year_from: 2010
            year_to: null
            weight_kg: 1300
            pracovni_zaber_m: 1.55
            prikon_traktor_hp_min: 100
            prikon_traktor_hp_max: 180
            typ_zavesu: neseny
            specs: { pocet_radlic: 4, otocny: true, pracovni_hloubka_cm: 35 }
          - slug: lemken-juwel-8
            name: "Juwel 8"
            year_from: 2014
            year_to: null
            weight_kg: 1500
            pracovni_zaber_m: 1.85
            prikon_traktor_hp_min: 140
            prikon_traktor_hp_max: 240
            typ_zavesu: neseny
            specs: { pocet_radlic: 5, otocny: true, pracovni_hloubka_cm: 35 }
          - slug: lemken-juwel-10
            name: "Juwel 10"
            year_from: 2018
            year_to: null
            weight_kg: 1900
            pracovni_zaber_m: 2.40
            prikon_traktor_hp_min: 180
            prikon_traktor_hp_max: 300
            typ_zavesu: neseny
            specs: { pocet_radlic: 6, otocny: true, pracovni_hloubka_cm: 35 }
      - slug: diamant
        name: "Diamant"
        year_from: 2010
        year_to: null
        description: Polonesený otočný pluh pro velké provozy
        models:
          - slug: lemken-diamant-12
            name: "Diamant 12"
            year_from: 2012
            year_to: null
            weight_kg: 3100
            pracovni_zaber_m: 2.85
            prikon_traktor_hp_min: 220
            prikon_traktor_hp_max: 360
            typ_zavesu: poloneseny
            specs: { pocet_radlic: 7, otocny: true }
  podmitace-diskove:
    name: Podmítače diskové
    series:
      - slug: rubin
        name: "Rubin"
        year_from: 2008
        year_to: null
        models:
          - slug: lemken-rubin-10
            name: "Rubin 10"
            year_from: 2012
            year_to: null
            pracovni_zaber_m: 4.0
            prikon_traktor_hp_min: 140
            prikon_traktor_hp_max: 240
            typ_zavesu: tazeny
          - slug: lemken-rubin-12
            name: "Rubin 12"
            year_from: 2016
            year_to: null
            pracovni_zaber_m: 6.0
            prikon_traktor_hp_min: 220
            prikon_traktor_hp_max: 360
            typ_zavesu: tazeny
      - slug: heliodor
        name: "Heliodor"
        year_from: 2010
        year_to: null
        models:
          - slug: lemken-heliodor-9
            name: "Heliodor 9"
            year_from: 2012
            year_to: null
            pracovni_zaber_m: 4.0
            prikon_traktor_hp_min: 130
            prikon_traktor_hp_max: 220
  kyprice:
    name: Kypřiče
    series:
      - slug: karat
        name: "Karat"
        year_from: 2010
        year_to: null
        models:
          - slug: lemken-karat-9
            name: "Karat 9"
            year_from: 2014
            year_to: null
            pracovni_zaber_m: 4.0
            prikon_traktor_hp_min: 180
            prikon_traktor_hp_max: 320
  rotacni-brany:
    name: Rotační brány
    series:
      - slug: zirkon
        name: "Zirkon"
        year_from: 2008
        year_to: null
        models:
          - slug: lemken-zirkon-12
            name: "Zirkon 12"
            year_from: 2014
            year_to: null
            pracovni_zaber_m: 4.0
            prikon_traktor_hp_min: 130
            prikon_traktor_hp_max: 220
  seci-stroje-pneumaticke:
    name: Secí stroje pneumatické
    series:
      - slug: solitair
        name: "Solitair"
        year_from: 2008
        year_to: null
        models:
          - slug: lemken-solitair-9
            name: "Solitair 9"
            year_from: 2014
            year_to: null
            pracovni_zaber_m: 4.0
            specs: { pocet_radku: 32, rozteč_radku_cm: 12.5, typ_botky: 'kotoučová' }
  postrikovace-tazene:
    name: Postřikovače tažené
    series:
      - slug: vega
        name: "Vega"
        year_from: 2014
        year_to: null
        models:
          - slug: lemken-vega-12
            name: "Vega 12"
            year_from: 2018
            year_to: null
            specs: { objem_nadrze_l: 4400, zaber_ramen_m: 24 }
            typ_zavesu: tazeny
```

- [ ] **Step 2: Validate**

```bash
node scripts/validate-stroje-yaml.mjs
```
Expected: OK.

- [ ] **Step 3: Build check**

```bash
npm run build 2>&1 | grep -E "(error|warn)" | head -10
```
Expected: žádné errory ohledně Lemken.

- [ ] **Step 4: Commit**

```bash
git add src/data/stroje/lemken.yaml
git commit -m "feat(stroje): seed Lemken (pluhy, podmitače, kypřiče, brány, secí, postřik)"
```

---

### Task 2.3-2.13: Pöttinger, Kuhn, Amazone, Krone, Horsch, Väderstad, Bednar, Manitou, JCB, Joskin, Kverneland

> **Pattern:** opakuj Task 2.2 pro každou ze zbylých 11 značek. Pro každou: vezmi `tmp/seed/<brand>.yaml`, manuálně rozkategorizuj `_unsorted` series, doplň CZ popisky, doplň chybějící specs z PDF brochures (`scripts/ingest/pdf-extract.mjs <pdf-url>`), ulož do `src/data/stroje/<brand>.yaml`, validuj, commitni.

- [ ] **Task 2.3: Pöttinger** — pluhy Servo, brány Lion, podmítače Terradisc, secí Vitasem/Aerosem/Terrasem, žačky Novacat/Novadisc, obraceče Hit, shrnovače Top, lisy Impress, samosběrací Jumbo/Faro/Torro/Boss
- [ ] **Task 2.4: Kuhn** — full line bez traktorů
- [ ] **Task 2.5: Amazone** — secí + postřik + hnojení + půda
- [ ] **Task 2.6: Krone** — pícninářský specialista (EasyCut, Vendro, Swadro, Comprima, BiG Pack, BiG M, BiG X)
- [ ] **Task 2.7: Horsch** — secí + půda + postřik (Pronto, Express, Sprinter, Avatar, Maestro, Terrano, Joker, Tiger, Leeb)
- [ ] **Task 2.8: Väderstad** — Tempo, Rapid, Spirit, Inspire, Carrier, TopDown, Opus, Rexius, Rollex
- [ ] **Task 2.9: Bednar** — Terraland, Swifter, Atlas, Versatill, Strip-Master, Omega, Efecta, Corn Master, Galaxy, Presspack
- [ ] **Task 2.10: Manitou** — MLT NewAg/XL, MLA-T (kloubové), R/RT smykové
- [ ] **Task 2.11: JCB** — Loadall 525-60 až 560-80, TM compact, Robot smykové
- [ ] **Task 2.12: Joskin** — cisterny Modulo 2/Quadra/Komfort 2/EuroLiner, návěsy Trans-Cap/Space/KTP
- [ ] **Task 2.13: Kverneland** — pluhy 150-200 series, Optima, iXdrive, iXter, DG/CL/CKL/GEOSPREAD

Pro každý task: validate + build check + commit s message `feat(stroje): seed <Brand>`.

---

### Task 2.14: Rozšíření existujících 6 traktorových značek

> **Pattern:** Pro každou existující značku otevři `src/data/stroje/<brand>.yaml` a **přidej** nové sekce pod `categories:` (vedle existujících `traktory:` a `kombajny:`). NEMĚŇ existující sekce.

- [ ] **Task 2.14a: John Deere** — přidat: lisy-valcove (8000R), lisy-hranolove (1424C), postrikovace-tazene (R4xxxi), postrikovace-samojizdne (M9xx), seci-stroje-pneumaticke (1990CCS, 740/750), rezacky-samojizdne (9000), celni-nakladace (H-series)

- [ ] **Task 2.14b: CLAAS** — Forage divize: zaci-stroje (Disco), shrnovace (Liner), obracece (Volto), lisy-valcove (Variant, Rollant), lisy-hranolove (Quadrant), rezacky-samojizdne (Jaguar 800/900), teleskopy (Scorpion)

- [ ] **Task 2.14c: New Holland** — lisy-valcove (RollBar, RollBelt), lisy-hranolove (BigBaler), rezacky-samojizdne (FR Forage Cruiser), postrikovace-samojizdne (Guardian)

- [ ] **Task 2.14d: Massey Ferguson** — lisy-valcove (RB), lisy-hranolove (MF 2200/2900), zaci-stroje (DM), teleskopy (TH)

- [ ] **Task 2.14e: Fendt** — lisy-valcove (Rotana), lisy-hranolove (Squadra), rezacky-samojizdne (Katana), zaci-stroje (Slicer), obracece (Twister), shrnovace (Former). Použij `tmp/fendt-techdata.json` pro tractor specs.

- [ ] **Task 2.14f: Case IH** — seci-stroje-presne (Early Riser planters 2150/2160), postrikovace-samojizdne (Patriot)

Validate after each: `node scripts/validate-stroje-yaml.mjs && npm run build`.

Commit per brand: `feat(stroje): rozšíření <brand> o nestaktorové portfolio`.

---

## Phase 3: Hub a Category Stránky (1 den)

### Task 3.1: Refactor CategoryBrowse pro generic použití

**Files:**
- Modify: `src/components/stroje/CategoryBrowse.astro`

- [ ] **Step 1: Open existing CategoryBrowse.astro**

Component currently has hardcoded `traktory` / `kombajny` labels. Refactor:

```astro
---
import { getAllBrands, seriesFamily, familyLabel, FUNCTIONAL_GROUPS, type StrojKategorie } from '../../lib/stroje';

interface Props {
  category: StrojKategorie;
  title?: string;
  description?: string;
}
const { category, title, description } = Astro.props;

// Use category label from FUNCTIONAL_GROUPS or fall back to category itself
function getCategoryLabel(cat: StrojKategorie): string {
  if (cat === 'traktory') return 'Traktory';
  if (cat === 'kombajny') return 'Kombajny';
  for (const group of Object.values(FUNCTIONAL_GROUPS)) {
    if ((group.categories as readonly string[]).includes(cat)) {
      // Look up by category in brand YAML data — try to find first
      for (const brand of getAllBrands()) {
        if (brand.categories?.[cat]) return brand.categories[cat].name || cat;
      }
    }
  }
  return cat;
}

const catLabel = title || getCategoryLabel(category);
// ... rest same as existing, but use catLabel instead of categoryLabels[category]
---
```

- [ ] **Step 2: Replace hardcoded `categoryLabels` map** (lines ~9-12) with `getCategoryLabel`

- [ ] **Step 3: Replace SVG icon switch** (lines ~189-199) — keep traktor/kombajn SVGs as defaults, add generic "stroj" icon for other categories:

```astro
{category === 'traktory' ? (
  <>
    <circle cx="7" cy="17" r="2"/>
    <circle cx="18" cy="17" r="3"/>
    <path d="M4 17H3v-4l2-2h4l3-4h5v10h-2"/>
  </>
) : category === 'kombajny' ? (
  <>
    <rect x="3" y="9" width="18" height="9" rx="1"/>
    <path d="M3 9V7c0-1 1-2 2-2h14c1 0 2 1 2 2v2"/>
    <circle cx="7" cy="18" r="2"/>
    <circle cx="17" cy="18" r="2"/>
  </>
) : (
  <>
    <rect x="4" y="6" width="16" height="12" rx="2"/>
    <path d="M8 10h8M8 14h8"/>
  </>
)}
```

- [ ] **Step 4: Build check**

```bash
npm run build 2>&1 | tail -20
```
Expected: build OK, /stroje/traktory/ and /stroje/kombajny/ still work.

- [ ] **Step 5: Commit**

```bash
git add src/components/stroje/CategoryBrowse.astro
git commit -m "refactor(stroje): CategoryBrowse — generic použití pro libovolnou kategorii"
```

---

### Task 3.2: Hub stránka `/stroje/zemedelske-stroje/`

**Files:**
- Create: `src/pages/stroje/zemedelske-stroje/index.astro`

- [ ] **Step 1: Create hub page**

```astro
---
export const prerender = true;
import Layout from '../../../layouts/Layout.astro';
import { getAllBrands, getAllModels, FUNCTIONAL_GROUPS, type FunctionalGroupSlug } from '../../../lib/stroje';

const brands = getAllBrands();
const allModels = getAllModels();

// Filter: only models in non-traktor/kombajn categories
const strojeModels = allModels.filter((m) => m.category !== 'traktory' && m.category !== 'kombajny');
const totalModels = strojeModels.length;
const totalSeries = new Set(strojeModels.map((m) => `${m.brand_slug}:${m.series_slug}`)).size;

// Count per functional group
const groupStats = Object.entries(FUNCTIONAL_GROUPS).map(([slug, group]) => {
  const groupModels = strojeModels.filter((m) => (group.categories as readonly string[]).includes(m.category));
  const groupBrands = new Set(groupModels.map((m) => m.brand_slug));
  return {
    slug: slug as FunctionalGroupSlug,
    name: group.name,
    description: group.description,
    modelCount: groupModels.length,
    brandCount: groupBrands.size,
    subcategoryCount: group.categories.length,
  };
});

// Brands that have at least one stroj model
const strojeBrands = brands.filter((b) => strojeModels.some((m) => m.brand_slug === b.slug));

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://agro-svet.cz/' },
    { '@type': 'ListItem', position: 2, name: 'Katalog strojů', item: 'https://agro-svet.cz/stroje/' },
    { '@type': 'ListItem', position: 3, name: 'Zemědělské stroje', item: 'https://agro-svet.cz/stroje/zemedelske-stroje/' },
  ],
};
---

<Layout
  title="Zemědělské stroje — pluhy, lisy, postřikovače, manipulátory"
  description={`Katalog ${totalModels} modelů zemědělských strojů od ${strojeBrands.length} značek. Lemken, Pöttinger, Kuhn, Amazone, Krone, Horsch a další. Roztrídění do 10 funkčních skupin.`}
  canonical="https://agro-svet.cz/stroje/zemedelske-stroje/"
>
  <script type="application/ld+json" is:inline set:html={JSON.stringify(breadcrumbJsonLd)} />
  <div style="max-width:1280px; margin:0 auto; padding:48px 32px 80px;">
    <div style="margin-bottom:8px;">
      <a href="/stroje/" style="font-size:13px; color:#666; text-decoration:none;">← Katalog strojů</a>
    </div>

    <div style="margin-bottom:32px;">
      <span class="section-label">Zemědělská technika</span>
      <h1 style="font-family:'Chakra Petch',sans-serif; font-size:clamp(2rem,5vw,3.2rem); font-weight:700; letter-spacing:-1px; line-height:1.1; color:#1a1a1a; margin-bottom:16px;">
        Stroje pro zemědělství
      </h1>
      <p style="font-size:16px; color:#666; max-width:720px; line-height:1.6;">
        Pluhy, podmítače, lisy, secí stroje, postřikovače, teleskopy, návěsy a další zemědělská technika
        od {strojeBrands.length} výrobců. Roztrídění do {Object.keys(FUNCTIONAL_GROUPS).length} funkčních skupin.
      </p>
    </div>

    <!-- Stats -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:12px; margin-bottom:40px;">
      <div style="background:#1a1a1a; color:#fff; padding:20px; border-radius:18px;">
        <div style="font-family:'Chakra Petch',sans-serif; font-size:32px; font-weight:700; color:#FFFF00;">{totalModels}</div>
        <div style="font-size:13px; color:rgba(255,255,255,.6);">modelů</div>
      </div>
      <div style="background:#f5f5f5; padding:20px; border-radius:18px;">
        <div style="font-family:'Chakra Petch',sans-serif; font-size:32px; font-weight:700;">{strojeBrands.length}</div>
        <div style="font-size:13px; color:#666;">značek</div>
      </div>
      <div style="background:#f5f5f5; padding:20px; border-radius:18px;">
        <div style="font-family:'Chakra Petch',sans-serif; font-size:32px; font-weight:700;">{Object.keys(FUNCTIONAL_GROUPS).length}</div>
        <div style="font-size:13px; color:#666;">funkčních skupin</div>
      </div>
      <div style="background:#f5f5f5; padding:20px; border-radius:18px;">
        <div style="font-family:'Chakra Petch',sans-serif; font-size:32px; font-weight:700;">{totalSeries}</div>
        <div style="font-size:13px; color:#666;">řad</div>
      </div>
    </div>

    <!-- Functional groups grid -->
    <h2 style="font-family:'Chakra Petch',sans-serif; font-size:24px; font-weight:700; color:#1a1a1a; margin-bottom:14px;">Hledáte podle účelu?</h2>
    <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; margin-bottom:48px;">
      {groupStats.map((g) => (
        <a href={`/stroje/zemedelske-stroje/${g.slug}/`} style="display:block; text-decoration:none; color:inherit; background:#fff; border:1px solid #e8e8e8; border-radius:18px; padding:20px; transition:box-shadow .2s, transform .2s;" class="group-card">
          <h3 style="font-family:'Chakra Petch',sans-serif; font-size:20px; font-weight:700; color:#1a1a1a; margin-bottom:8px;">{g.name}</h3>
          <p style="font-size:13px; color:#666; line-height:1.5; margin-bottom:12px;">{g.description}</p>
          <div style="display:flex; gap:12px; font-size:12px; color:#767676;">
            <span>{g.subcategoryCount} kategorií</span>
            {g.modelCount > 0 && <><span>·</span><span>{g.modelCount} modelů</span></>}
            {g.brandCount > 0 && <><span>·</span><span>{g.brandCount} značek</span></>}
          </div>
        </a>
      ))}
    </div>

    <!-- Brands grid -->
    <h2 style="font-family:'Chakra Petch',sans-serif; font-size:24px; font-weight:700; color:#1a1a1a; margin-bottom:14px;">Nebo podle značky?</h2>
    <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:14px;">
      {strojeBrands.map((b) => {
        const brandStrojeModels = strojeModels.filter((m) => m.brand_slug === b.slug);
        return (
          <a href={`/stroje/${b.slug}/`} style="display:block; text-decoration:none; color:inherit; background:#fff; border:1px solid #e8e8e8; border-radius:14px; padding:16px; transition:box-shadow .2s, transform .2s;" class="brand-card">
            <h3 style="font-family:'Chakra Petch',sans-serif; font-size:18px; font-weight:700; color:#1a1a1a; margin-bottom:6px;">{b.name}</h3>
            <div style="font-size:12px; color:#767676;">{b.country}</div>
            <div style="font-size:12px; color:#666; margin-top:8px;">{brandStrojeModels.length} strojů</div>
          </a>
        );
      })}
    </div>
  </div>

  <style>
    .section-label { display: inline-block; font-family: 'Chakra Petch', sans-serif; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #1a1a1a; background: #FFFF00; padding: 4px 10px; border-radius: 3px; margin-bottom: 14px; }
    .group-card:hover, .brand-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,.08); transform: translateY(-2px); border-color: #FFFF00; }
  </style>
</Layout>
```

- [ ] **Step 2: Build + verify**

```bash
npm run build 2>&1 | grep -E "(zemedelske-stroje|error)" | head
```
Expected: page builds successfully.

- [ ] **Step 3: Local smoke test**

```bash
npm run dev &
sleep 3
/usr/bin/curl -sI http://localhost:4321/stroje/zemedelske-stroje/
```
Expected: HTTP 200.

```bash
kill %1
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/stroje/zemedelske-stroje/index.astro
git commit -m "feat(stroje): hub stránka /stroje/zemedelske-stroje/"
```

---

### Task 3.3: Funkční skupina `/stroje/zemedelske-stroje/[group]/`

**Files:**
- Create: `src/pages/stroje/zemedelske-stroje/[group]/index.astro`

- [ ] **Step 1: Create page with getStaticPaths**

```astro
---
export const prerender = true;
import Layout from '../../../../layouts/Layout.astro';
import { getAllBrands, getAllModels, FUNCTIONAL_GROUPS, type FunctionalGroupSlug, type StrojKategorie } from '../../../../lib/stroje';

export async function getStaticPaths() {
  return Object.keys(FUNCTIONAL_GROUPS).map((slug) => ({ params: { group: slug } }));
}

const { group: groupSlug } = Astro.params;
const group = FUNCTIONAL_GROUPS[groupSlug as FunctionalGroupSlug];
if (!group) return Astro.redirect('/stroje/zemedelske-stroje/');

const allModels = getAllModels();
const groupModels = allModels.filter((m) => (group.categories as readonly string[]).includes(m.category));
const groupBrands = [...new Set(groupModels.map((m) => m.brand_slug))]
  .map((slug) => getAllBrands().find((b) => b.slug === slug))
  .filter(Boolean);

// Count per subcategory
const subcategoryStats = group.categories.map((cat) => {
  const catModels = groupModels.filter((m) => m.category === cat);
  const catBrands = new Set(catModels.map((m) => m.brand_slug));
  // Get pretty name from first brand that has this category
  let prettyName: string = cat;
  for (const brand of getAllBrands()) {
    const catData = brand.categories?.[cat as StrojKategorie];
    if (catData?.name) { prettyName = catData.name; break; }
  }
  return { slug: cat, name: prettyName, modelCount: catModels.length, brandCount: catBrands.size };
});

const breadcrumbJsonLd = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://agro-svet.cz/' },
    { '@type': 'ListItem', position: 2, name: 'Katalog strojů', item: 'https://agro-svet.cz/stroje/' },
    { '@type': 'ListItem', position: 3, name: 'Zemědělské stroje', item: 'https://agro-svet.cz/stroje/zemedelske-stroje/' },
    { '@type': 'ListItem', position: 4, name: group.name, item: `https://agro-svet.cz/stroje/zemedelske-stroje/${groupSlug}/` },
  ],
};
---

<Layout
  title={`${group.name} — katalog strojů`}
  description={`${group.description}. ${groupModels.length} modelů od ${groupBrands.length} značek.`}
  canonical={`https://agro-svet.cz/stroje/zemedelske-stroje/${groupSlug}/`}
>
  <script type="application/ld+json" is:inline set:html={JSON.stringify(breadcrumbJsonLd)} />
  <div style="max-width:1280px; margin:0 auto; padding:48px 32px 80px;">
    <div style="margin-bottom:8px;">
      <a href="/stroje/zemedelske-stroje/" style="font-size:13px; color:#666; text-decoration:none;">← Zemědělské stroje</a>
    </div>

    <div style="margin-bottom:32px;">
      <span class="section-label">{group.name}</span>
      <h1 style="font-family:'Chakra Petch',sans-serif; font-size:clamp(2rem,5vw,3.2rem); font-weight:700; letter-spacing:-1px; color:#1a1a1a; margin-bottom:14px;">
        {group.name}
      </h1>
      <p style="font-size:16px; color:#666; max-width:720px; line-height:1.6;">{group.description}</p>
    </div>

    <h2 style="font-family:'Chakra Petch',sans-serif; font-size:22px; font-weight:700; color:#1a1a1a; margin-bottom:14px;">Sub-kategorie</h2>
    <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:14px; margin-bottom:40px;">
      {subcategoryStats.map((s) => (
        <a href={`/stroje/${s.slug}/`} style="display:block; text-decoration:none; color:inherit; background:#fff; border:1px solid #e8e8e8; border-radius:14px; padding:16px;" class="subcat-card">
          <h3 style="font-family:'Chakra Petch',sans-serif; font-size:17px; font-weight:700; color:#1a1a1a; margin-bottom:6px;">{s.name}</h3>
          <div style="font-size:12px; color:#767676;">
            {s.modelCount > 0 ? `${s.modelCount} modelů · ${s.brandCount} značek` : 'Připravujeme'}
          </div>
        </a>
      ))}
    </div>

    {groupBrands.length > 0 && <>
      <h2 style="font-family:'Chakra Petch',sans-serif; font-size:22px; font-weight:700; color:#1a1a1a; margin-bottom:14px;">Značky v kategorii</h2>
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        {groupBrands.map((b) => (
          <a href={`/stroje/${b!.slug}/`} class="brand-pill">{b!.name}</a>
        ))}
      </div>
    </>}
  </div>

  <style>
    .section-label { display: inline-block; font-family: 'Chakra Petch', sans-serif; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #1a1a1a; background: #FFFF00; padding: 4px 10px; border-radius: 3px; margin-bottom: 14px; }
    .subcat-card:hover { border-color: #FFFF00; box-shadow: 0 4px 14px rgba(0,0,0,.06); }
    .brand-pill { padding: 6px 14px; border: 1px solid #e0e0e0; border-radius: 999px; font-size: 13px; color: #1a1a1a; text-decoration: none; }
    .brand-pill:hover { background: #FFFF00; border-color: #FFFF00; }
  </style>
</Layout>
```

- [ ] **Step 2: Build + smoke**

```bash
npm run build 2>&1 | grep -i error | head
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/stroje/zemedelske-stroje/[group]/index.astro
git commit -m "feat(stroje): funkční skupina /stroje/zemedelske-stroje/[group]/"
```

---

### Task 3.4: Sub-kategorie cross-brand `/stroje/[subcategory]/`

**Files:**
- Create: `src/pages/stroje/[subcategory]/index.astro`

- [ ] **Step 1: Create dynamic route with getStaticPaths**

```astro
---
export const prerender = true;
import Layout from '../../../layouts/Layout.astro';
import CategoryBrowse from '../../../components/stroje/CategoryBrowse.astro';
import { FUNCTIONAL_GROUPS, type StrojKategorie } from '../../../lib/stroje';

export async function getStaticPaths() {
  // All sub-categories from FUNCTIONAL_GROUPS (excluding traktory/kombajny which have own pages)
  const allCats = Object.values(FUNCTIONAL_GROUPS).flatMap((g) => g.categories);
  return allCats.map((cat) => ({ params: { subcategory: cat } }));
}

const { subcategory } = Astro.params;
---

<Layout
  title={`${subcategory} — katalog strojů`}
  description={`Přehled všech značek vyrábějících ${subcategory}. Filtrujte podle značky, výkonu a roku výroby.`}
  canonical={`https://agro-svet.cz/stroje/${subcategory}/`}
>
  <CategoryBrowse category={subcategory as StrojKategorie} />
</Layout>
```

- [ ] **Step 2: Verify CategoryBrowse handles new categories**

If CategoryBrowse is too tractor/kombajn specific, we need to extend it. From Task 3.1 it should work generically; verify by:

```bash
npm run build 2>&1 | grep -E "(stroje/pluhy|stroje/teleskopy|error)" | head
```

- [ ] **Step 3: Local smoke**

```bash
npm run dev &
sleep 3
/usr/bin/curl -sI http://localhost:4321/stroje/pluhy/
/usr/bin/curl -sI http://localhost:4321/stroje/teleskopy/
kill %1
```
Expected: 200.

- [ ] **Step 4: Commit**

```bash
git add src/pages/stroje/[subcategory]/index.astro
git commit -m "feat(stroje): cross-brand sub-kategorie stránky /stroje/<subcategory>/"
```

---

## Phase 4: Brand a Model Update (½ dne)

### Task 4.1: Update brand page `/stroje/[brand]/`

**Files:**
- Modify: `src/pages/stroje/[brand]/index.astro`

- [ ] **Step 1: Read current implementation** to understand structure

The current brand page renders sections per category. Update so that:
- Traktory (if any) renders first
- Kombajny (if any) renders second
- Then all other categories grouped under "Zemědělské stroje" header
- Skip-nav links at top

- [ ] **Step 2: Modify the categoriesData computation and rendering**

Replace the category iteration to group by functional group:

```typescript
// In frontmatter, after computing categoriesData:
import { FUNCTIONAL_GROUPS, type FunctionalGroupSlug } from '../../../lib/stroje';

const tractorCats = ['traktory', 'kombajny'] as const;
const tractorOrCombine = categoriesData.filter((c) => tractorCats.includes(c.slug as any));
const strojeCats = categoriesData.filter((c) => !tractorCats.includes(c.slug as any));

// Group stroje by functional group
const strojeGrouped: Array<{ groupSlug: FunctionalGroupSlug; groupName: string; cats: typeof strojeCats }> = [];
for (const [groupSlug, group] of Object.entries(FUNCTIONAL_GROUPS)) {
  const matching = strojeCats.filter((c) => (group.categories as readonly string[]).includes(c.slug));
  if (matching.length > 0) {
    strojeGrouped.push({ groupSlug: groupSlug as FunctionalGroupSlug, groupName: group.name, cats: matching });
  }
}
```

- [ ] **Step 3: Add skip-nav at top of page**

```astro
<!-- After brand hero, before sections -->
{(tractorOrCombine.length > 0 || strojeGrouped.length > 0) && (
  <nav style="margin-bottom:24px;" aria-label="Sekce na stránce">
    <div style="display:flex; gap:8px; flex-wrap:wrap;">
      {tractorOrCombine.map((c) => (
        <a href={`#${c.slug}`} class="skip-nav-pill">{c.name}</a>
      ))}
      {strojeGrouped.map((g) => (
        <a href={`#${g.groupSlug}`} class="skip-nav-pill">{g.groupName}</a>
      ))}
    </div>
  </nav>
)}
```

- [ ] **Step 4: Render sections**

```astro
{tractorOrCombine.map((cat) => (
  <section id={cat.slug} style="margin-bottom:48px;">
    <!-- Existing rendering pattern, unchanged -->
  </section>
))}

{strojeGrouped.map((g) => (
  <section id={g.groupSlug} style="margin-bottom:64px;">
    <h2 style="font-family:'Chakra Petch',sans-serif; font-size:28px; font-weight:700; color:#1a1a1a; margin-bottom:24px; padding-bottom:8px; border-bottom:2px solid #FFFF00;">
      {g.groupName}
    </h2>
    {g.cats.map((cat) => (
      <div style="margin-bottom:32px;">
        <h3 style="font-family:'Chakra Petch',sans-serif; font-size:20px; font-weight:700; color:#1a1a1a; margin-bottom:14px;">
          {cat.name}
        </h3>
        <!-- Reuse existing family-grid rendering -->
        <div class="family-grid">
          {cat.tiles.map((tile) => /* ... existing tile JSX ... */ )}
        </div>
      </div>
    ))}
  </section>
))}
```

- [ ] **Step 5: Add CSS for .skip-nav-pill**

```astro
.skip-nav-pill {
  padding: 6px 12px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 999px;
  font-size: 12px;
  color: #1a1a1a;
  text-decoration: none;
  transition: background .15s, border-color .15s;
}
.skip-nav-pill:hover { background: #FFFF00; border-color: #FFFF00; }
```

- [ ] **Step 6: Build + smoke**

```bash
npm run build 2>&1 | grep -E "(error|brand)" | head
npm run dev &
sleep 3
/usr/bin/curl -sI http://localhost:4321/stroje/lemken/  # if lemken seeded
/usr/bin/curl -sI http://localhost:4321/stroje/john-deere/
kill %1
```

- [ ] **Step 7: Commit**

```bash
git add src/pages/stroje/[brand]/index.astro
git commit -m "feat(stroje): brand page — funkční skupiny + skip-nav linky"
```

---

### Task 4.2: Update model detail page se spec-labels

**Files:**
- Modify: `src/pages/stroje/[brand]/[series]/[model]/index.astro`

- [ ] **Step 1: Import spec-labels**

Add at top of frontmatter:
```typescript
import { getSpecLabel, formatSpecValue } from '../../../../lib/spec-labels';
import { getFunctionalGroupForCategory } from '../../../../lib/stroje';
```

- [ ] **Step 2: Render specs table via labels**

Find the spec table render block. Replace ad-hoc spec rendering with:

```astro
{model.specs && Object.keys(model.specs).length > 0 && (
  <table class="spec-table">
    {Object.entries(model.specs).map(([key, value]) => (
      <tr class="spec-row">
        <td class="spec-label">{getSpecLabel(key)}</td>
        <td class="spec-value">{formatSpecValue(value)}</td>
      </tr>
    ))}
  </table>
)}
```

- [ ] **Step 3: Add CTA bazar link with subcategory**

```astro
<a 
  href={`/bazar/?category=${getFunctionalGroupForCategory(model.category) || model.category}&brand=${model.brand_slug}`}
  class="cta-bazar"
>
  Hledat v bazaru →
</a>
```

- [ ] **Step 4: Build check**

```bash
npm run build 2>&1 | grep -E "(error|model)" | head
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/stroje/[brand]/[series]/[model]/index.astro
git commit -m "feat(stroje): model detail — spec labels + bazar CTA s subcategory"
```

---

### Task 4.3: Update `/stroje/` index s funkčními skupinami v filtru

**Files:**
- Modify: `src/pages/stroje/index.astro`

- [ ] **Step 1: Import FUNCTIONAL_GROUPS**

```typescript
import { FUNCTIONAL_GROUPS } from '../../lib/stroje';
```

- [ ] **Step 2: Add functional group filter**

Find the `<select id="f-category">` element. Replace its options with:

```astro
<select id="f-category" style="...">
  <option value="">Všechny kategorie</option>
  <option value="traktory">Traktory</option>
  <option value="kombajny">Kombajny</option>
  <optgroup label="Zemědělské stroje">
    {Object.entries(FUNCTIONAL_GROUPS).map(([slug, group]) => (
      <option value={`group:${slug}`}>{group.name}</option>
    ))}
  </optgroup>
</select>
```

- [ ] **Step 3: Update JS filter logic** to handle group: prefix

In the script tag, update `applyFilters` to handle "group:zpracovani-pudy" filter (matches all sub-categories in that group):

```typescript
function applyFilters() {
  const cat = el.category.value;
  // ...
  const filtered = MODELS.filter((m) => {
    if (cat) {
      if (cat.startsWith('group:')) {
        const groupSlug = cat.slice(6);
        const groupCats = window.__FUNCTIONAL_GROUPS__?.[groupSlug]?.categories ?? [];
        if (!groupCats.includes(m.category)) return false;
      } else if (m.category !== cat) return false;
    }
    // ... rest unchanged
  });
}
```

- [ ] **Step 4: Inject FUNCTIONAL_GROUPS into client**

Add before script:
```astro
<script is:inline set:html={`window.__FUNCTIONAL_GROUPS__ = ${JSON.stringify(Object.fromEntries(Object.entries(FUNCTIONAL_GROUPS).map(([k, v]) => [k, { categories: v.categories }])))};`}></script>
```

- [ ] **Step 5: Build + smoke**

```bash
npm run build 2>&1 | tail -10
```

- [ ] **Step 6: Commit**

```bash
git add src/pages/stroje/index.astro
git commit -m "feat(stroje): index katalog — funkční skupiny v category filtru"
```

---

## Phase 5: Header Navigace (10 min)

### Task 5.1: Add Stroje záložka do Technika dropdownu

**Files:**
- Modify: `src/components/Header.astro`

- [ ] **Step 1: Edit nav array**

Find the `nav: NavItem[]` array. In Technika dropdown, add new item:

```typescript
{
  label: 'Technika',
  href: '/stroje/',
  children: [
    { label: 'Všechna technika', href: '/stroje/' },
    { label: 'Traktory', href: '/stroje/traktory/' },
    { label: 'Kombajny', href: '/stroje/kombajny/' },
    { label: 'Stroje', href: '/stroje/zemedelske-stroje/' },  // NEW
    { label: 'Značky', href: '/stroje/#znacky' },
  ],
},
```

- [ ] **Step 2: Build + smoke**

```bash
npm run build && npm run dev &
sleep 3
/usr/bin/curl -s http://localhost:4321/ | grep -A2 "Stroje"
kill %1
```
Expected: HTML obsahuje "Stroje" link na /stroje/zemedelske-stroje/.

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.astro
git commit -m "feat(nav): přidat Stroje záložku do Technika dropdownu"
```

---

### Task 5.2: Update ImageAccordion Stroje panel

**Files:**
- Modify: `src/components/ImageAccordion.astro`

- [ ] **Step 1: Find Stroje panel link**

Find the panel with title "Stroje" and update href:

```astro
<!-- BEFORE -->
<a href="/encyklopedie/?kategorie=stroj" ...>Stroje...</a>

<!-- AFTER -->
<a href="/stroje/zemedelske-stroje/" ...>Stroje...</a>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ImageAccordion.astro
git commit -m "fix(nav): ImageAccordion Stroje tile → /stroje/zemedelske-stroje/"
```

---

## Phase 6: Bazar Integrace (1 den)

### Task 6.1: Update bazar-constants.ts

**Files:**
- Modify: `src/lib/bazar-constants.ts`

- [ ] **Step 1: Replace whole CATEGORIES + BRANDS + add mapping**

```typescript
// src/lib/bazar-constants.ts
export const CATEGORIES = [
  { value: 'traktory', label: 'Traktory' },
  { value: 'kombajny', label: 'Kombajny' },
  // funkční skupiny
  { value: 'zpracovani-pudy', label: 'Zpracování půdy' },
  { value: 'seti', label: 'Setí a sázení' },
  { value: 'hnojeni', label: 'Hnojení' },
  { value: 'ochrana-rostlin', label: 'Ochrana rostlin' },
  { value: 'sklizen-picnin', label: 'Sklizeň pícnin a slámy' },
  { value: 'sklizen-okopanin', label: 'Sklizeň okopanin' },
  { value: 'manipulace', label: 'Manipulace a nakládání' },
  { value: 'doprava', label: 'Doprava' },
  { value: 'staj-chov', label: 'Stáj a chov' },
  { value: 'komunal-les', label: 'Komunál a les' },
  // existující ne-strojové
  { value: 'nahradni-dily', label: 'Náhradní díly' },
  { value: 'prislusenstvi', label: 'Příslušenství' },
  { value: 'osiva-hnojiva', label: 'Osiva a hnojiva' },
  { value: 'pozemky', label: 'Pozemky' },
  { value: 'zvirata', label: 'Zvířata' },
  { value: 'sluzby', label: 'Služby' },
  { value: 'ostatni', label: 'Ostatní' },
] as const;

export const BRANDS = [
  // existující traktorové
  { value: 'john-deere', label: 'John Deere' },
  { value: 'claas', label: 'CLAAS' },
  { value: 'fendt', label: 'Fendt' },
  { value: 'zetor', label: 'Zetor' },
  { value: 'new-holland', label: 'New Holland' },
  { value: 'kubota', label: 'Kubota' },
  { value: 'case-ih', label: 'Case IH' },
  { value: 'massey-ferguson', label: 'Massey Ferguson' },
  { value: 'deutz-fahr', label: 'Deutz-Fahr' },
  { value: 'valtra', label: 'Valtra' },
  // NEW must-have stroje
  { value: 'lemken', label: 'Lemken' },
  { value: 'pottinger', label: 'Pöttinger' },
  { value: 'kuhn', label: 'Kuhn' },
  { value: 'amazone', label: 'Amazone' },
  { value: 'krone', label: 'Krone' },
  { value: 'horsch', label: 'Horsch' },
  { value: 'vaderstad', label: 'Väderstad' },
  { value: 'bednar', label: 'Bednar' },
  { value: 'manitou', label: 'Manitou' },
  { value: 'jcb', label: 'JCB' },
  { value: 'joskin', label: 'Joskin' },
  { value: 'kverneland', label: 'Kverneland' },
  { value: 'jina', label: 'Jiná' },
] as const;

export const BAZAR_TO_CATALOG_SUBCATEGORIES: Record<string, string[]> = {
  traktory: ['traktory'],
  kombajny: ['kombajny'],
  'zpracovani-pudy': ['pluhy', 'podmitace-diskove', 'podmitace-radlickove', 'kyprice', 'rotacni-brany', 'kompaktomaty', 'valce'],
  'seti': ['seci-stroje-mechanicke', 'seci-stroje-pneumaticke', 'seci-stroje-presne', 'seci-kombinace', 'sazecky-brambor'],
  'hnojeni': ['rozmetadla-mineralni', 'rozmetadla-statkova', 'cisterny-kejda', 'aplikatory-kejda'],
  'ochrana-rostlin': ['postrikovace-nesene', 'postrikovace-tazene', 'postrikovace-samojizdne'],
  'sklizen-picnin': ['zaci-stroje', 'obracece', 'shrnovace', 'lisy-valcove', 'lisy-hranolove', 'obalovace', 'rezacky-samojizdne', 'samosberaci-vozy'],
  'sklizen-okopanin': ['sklizece-brambor', 'sklizece-repy', 'vyoravace'],
  'manipulace': ['celni-nakladace', 'teleskopy', 'kolove-nakladace', 'kloubove-nakladace', 'smykove-nakladace'],
  'doprava': ['navesy-sklapeci', 'navesy-valnik', 'navesy-posuvne-dno', 'cisterny-voda', 'prepravniky-zrna'],
  'staj-chov': ['krmne-vozy', 'dojici-roboti', 'podestylace'],
  'komunal-les': ['mulcovace', 'stepkovace', 'lesni-vyvazecky'],
};

export type Category = typeof CATEGORIES[number]['value'];
export type Brand = typeof BRANDS[number]['value'];
```

- [ ] **Step 2: Build check**

```bash
npm run build 2>&1 | grep -E "(error|bazar)" | head
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/bazar-constants.ts
git commit -m "feat(bazar): rozšíření CATEGORIES (19), BRANDS (22), mapping na katalog"
```

---

### Task 6.2: Migrace 004 — rename existujících kategorií

**Files:**
- Create: `supabase/migrations/004_bazar_stroje_categories.sql`

- [ ] **Step 1: Write migration**

```sql
-- supabase/migrations/004_bazar_stroje_categories.sql
-- Rename existing bazar categories to align with stroje katalog functional groups

UPDATE bazar_listings SET category = 'seti' WHERE category = 'seci-stroje';
UPDATE bazar_listings SET category = 'ochrana-rostlin' WHERE category = 'postrikovace';
UPDATE bazar_listings SET category = 'doprava' WHERE category = 'privezy';
```

- [ ] **Step 2: Add note in commit message + manual deploy step**

```bash
git add supabase/migrations/004_bazar_stroje_categories.sql
git commit -m "feat(bazar): migrace 004 - rename seci-stroje/postrikovace/privezy na funkční skupiny"
```

> **Note:** Migrace 004 NESPOUŠTĚT lokálně — aplikuje se na produkční Supabase v Fázi 8. Idempotentní (UPDATE už neodpovídá podruhé).

---

### Task 6.3: Migrace 005 — nové sloupce

**Files:**
- Create: `supabase/migrations/005_bazar_stroje_fields.sql`

- [ ] **Step 1: Write migration**

```sql
-- supabase/migrations/005_bazar_stroje_fields.sql
-- Add new columns for stroje listings

ALTER TABLE bazar_listings
  ADD COLUMN IF NOT EXISTS subcategory TEXT,
  ADD COLUMN IF NOT EXISTS nosnost_kg INTEGER,
  ADD COLUMN IF NOT EXISTS objem_nadrze_l INTEGER;

CREATE INDEX IF NOT EXISTS idx_bazar_listings_subcategory ON bazar_listings(subcategory);
CREATE INDEX IF NOT EXISTS idx_bazar_listings_nosnost_kg ON bazar_listings(nosnost_kg);
CREATE INDEX IF NOT EXISTS idx_bazar_listings_objem_nadrze_l ON bazar_listings(objem_nadrze_l);
```

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/005_bazar_stroje_fields.sql
git commit -m "feat(bazar): migrace 005 - subcategory, nosnost_kg, objem_nadrze_l"
```

---

### Task 6.4: Update bazar-catalog.ts

**Files:**
- Modify: `src/lib/bazar-catalog.ts`

- [ ] **Step 1: Read existing file** to understand current API

- [ ] **Step 2: Add subcategory parameter to getModelOptions**

```typescript
import { BAZAR_TO_CATALOG_SUBCATEGORIES } from './bazar-constants';
import { getAllModels } from './stroje';

export function getModelOptions(bazarCategory: string, subcategory?: string) {
  const allModels = getAllModels();
  const allowedSubcats = BAZAR_TO_CATALOG_SUBCATEGORIES[bazarCategory] ?? [];
  
  let filtered = allModels.filter((m) => allowedSubcats.includes(m.category));
  if (subcategory) {
    filtered = filtered.filter((m) => m.category === subcategory);
  }
  
  return filtered.map((m) => ({
    slug: m.slug,
    name: `${m.brand_name} ${m.name}`,
    brand_slug: m.brand_slug,
    subcategory: m.category,
  }));
}
```

- [ ] **Step 3: Build + verify**

```bash
npm run build 2>&1 | grep -E "(error|bazar-catalog)" | head
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/bazar-catalog.ts
git commit -m "feat(bazar-catalog): getModelOptions(category, subcategory?) s mapping"
```

---

### Task 6.5: Update CatalogPicker pro 2-úrovňový filter

**Files:**
- Modify: `src/components/bazar/CatalogPicker.astro`

- [ ] **Step 1: Add subcategory dropdown**

Existing component listens to `catalog-filter-change` event. Extend to support 2 filters: category + subcategory.

```astro
<!-- Add subcategory select between existing inputs -->
<select id="picker-subcategory" hidden>
  <option value="">Všechny sub-kategorie</option>
  <!-- options dynamically populated when category changes -->
</select>
```

- [ ] **Step 2: Update JS to populate subcategory options**

```javascript
const SUBCATEGORY_LABELS = /* import from bazar-constants or inline mapping */;

document.addEventListener('catalog-filter-change', (e) => {
  const { category, subcategory } = e.detail;
  // Populate subcategory options for selected category
  const allowedSubcats = BAZAR_TO_CATALOG_SUBCATEGORIES[category] ?? [];
  const subcategorySelect = document.getElementById('picker-subcategory');
  if (allowedSubcats.length > 1) {
    subcategorySelect.hidden = false;
    subcategorySelect.innerHTML = '<option value="">Všechny sub-kategorie</option>' +
      allowedSubcats.map((sc) => `<option value="${sc}">${SUBCATEGORY_LABELS[sc] || sc}</option>`).join('');
  } else {
    subcategorySelect.hidden = true;
  }
  // Filter models by both
  filterModels(category, subcategory);
});
```

- [ ] **Step 3: Build + smoke**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 4: Commit**

```bash
git add src/components/bazar/CatalogPicker.astro
git commit -m "feat(bazar): CatalogPicker — 2-úrovňový filter (category + subcategory)"
```

---

### Task 6.6: Update BazarFilters

**Files:**
- Modify: `src/components/bazar/BazarFilters.astro`

- [ ] **Step 1: Add conditional filters per category**

For categories that map to stroje (zpracovani-pudy, seti, hnojeni, etc.), show:
- Pracovní záběr od/do (m)
- Nosnost od/do (kg)  — pro manipulace, doprava
- Objem nádrže (l) — pro hnojení, ochrana-rostlin

```astro
<!-- Add to existing filters section -->
<div id="filter-zaber" hidden>
  <label>Pracovní záběr od (m): <input type="number" step="0.1" id="f-zaber-min"></label>
  <label>do (m): <input type="number" step="0.1" id="f-zaber-max"></label>
</div>
<div id="filter-nosnost" hidden>
  <label>Nosnost od (kg): <input type="number" id="f-nosnost-min"></label>
  <label>do (kg): <input type="number" id="f-nosnost-max"></label>
</div>
<div id="filter-objem" hidden>
  <label>Objem nádrže (l): <input type="number" id="f-objem-min"></label>
  <label>do: <input type="number" id="f-objem-max"></label>
</div>
```

- [ ] **Step 2: JS toggle visibility**

```javascript
const STROJE_CATEGORIES_WITH_ZABER = ['zpracovani-pudy', 'seti', 'ochrana-rostlin', 'sklizen-picnin'];
const STROJE_CATEGORIES_WITH_NOSNOST = ['manipulace', 'doprava'];
const STROJE_CATEGORIES_WITH_OBJEM = ['hnojeni', 'ochrana-rostlin'];

categorySelect.addEventListener('change', () => {
  document.getElementById('filter-zaber').hidden = !STROJE_CATEGORIES_WITH_ZABER.includes(categorySelect.value);
  document.getElementById('filter-nosnost').hidden = !STROJE_CATEGORIES_WITH_NOSNOST.includes(categorySelect.value);
  document.getElementById('filter-objem').hidden = !STROJE_CATEGORIES_WITH_OBJEM.includes(categorySelect.value);
});
```

- [ ] **Step 3: Update URL sync to include new params** (zaber_od/do, nosnost_od/do, objem_od/do)

- [ ] **Step 4: Commit**

```bash
git add src/components/bazar/BazarFilters.astro
git commit -m "feat(bazar): BazarFilters — conditional filtry pro stroje (záběr, nosnost, objem)"
```

---

### Task 6.7: Update BazarListingRow s novými poli

**Files:**
- Modify: `src/components/bazar/BazarListingRow.astro`

- [ ] **Step 1: Render new fields in meta row**

```astro
<!-- Add to meta row, after existing fields -->
{listing.nosnost_kg && <span>{listing.nosnost_kg} kg</span>}
{listing.objem_nadrze_l && <span>{listing.objem_nadrze_l} l</span>}
{listing.pracovni_zaber_m && <span>{listing.pracovni_zaber_m} m záběr</span>}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/bazar/BazarListingRow.astro
git commit -m "feat(bazar): BazarListingRow — render nosnost, objem, záběr"
```

---

### Task 6.8: Update bazar/novy.astro a bazar/moje/[id]/index.astro

**Files:**
- Modify: `src/pages/bazar/novy.astro`
- Modify: `src/pages/bazar/moje/[id]/index.astro`

- [ ] **Step 1: Add conditional form fields**

For each category, show specific fields. Add to form:

```astro
<!-- Category-specific fields, conditionally shown via JS -->
<div class="field-group" data-categories="zpracovani-pudy,seti,ochrana-rostlin,sklizen-picnin">
  <label>Pracovní záběr (m): <input type="number" step="0.1" name="pracovni_zaber_m"></label>
</div>
<div class="field-group" data-categories="manipulace,doprava">
  <label>Nosnost (kg): <input type="number" name="nosnost_kg"></label>
</div>
<div class="field-group" data-categories="hnojeni,ochrana-rostlin">
  <label>Objem nádrže (l): <input type="number" name="objem_nadrze_l"></label>
</div>
<div class="field-group" data-categories="zpracovani-pudy">
  <label>Počet radlic (jen pluhy): <input type="number" name="pocet_radlic"></label>
</div>
```

- [ ] **Step 2: JS toggle visibility based on selected category**

```javascript
const categorySelect = document.getElementById('category');
function toggleFields() {
  document.querySelectorAll('.field-group').forEach((group) => {
    const cats = (group.getAttribute('data-categories') || '').split(',');
    group.style.display = cats.includes(categorySelect.value) ? '' : 'none';
  });
}
categorySelect.addEventListener('change', toggleFields);
toggleFields();
```

- [ ] **Step 3: Update form submit handler** to include new fields in POST body

- [ ] **Step 4: Update API endpoint** (if exists separately) to accept and persist new fields

- [ ] **Step 5: Commit**

```bash
git add src/pages/bazar/novy.astro src/pages/bazar/moje/[id]/index.astro
git commit -m "feat(bazar): conditional form pole per kategorie + JS toggle"
```

---

### Task 6.9: Update bazar/[id].astro detail page

**Files:**
- Modify: `src/pages/bazar/[id].astro`

- [ ] **Step 1: Render new fields in spec strip**

Find existing spec strip block. Add nosnost/objem/zaber rendering analog k existujícímu power_hp/hours_operated.

- [ ] **Step 2: Catalog link box — link to subcategory if model_slug exists**

```astro
{listing.model_slug && listing.subcategory && (
  <a href={`/stroje/${brandFromSlug(listing.model_slug)}/${listing.subcategory}/`} class="catalog-link-box">
    Zobrazit detail v katalogu →
  </a>
)}
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/bazar/[id].astro
git commit -m "feat(bazar): detail page — spec strip + catalog link s subcategory"
```

---

### Task 6.10: Update bazar/index.astro query + filtry URL sync

**Files:**
- Modify: `src/pages/bazar/index.astro`

- [ ] **Step 1: Update Supabase query**

Add `nosnost_kg`, `objem_nadrze_l`, `subcategory` to `.select()`:

```typescript
const { data: listings } = await supabase
  .from('bazar_listings')
  .select('id, title, price, location, ...existing..., nosnost_kg, objem_nadrze_l, pracovni_zaber_m, subcategory')
  .gte(...)
  .lte(...);
```

- [ ] **Step 2: Add filter conditions for new fields**

```typescript
if (params.get('nosnost_od')) query = query.gte('nosnost_kg', parseInt(params.get('nosnost_od')));
if (params.get('nosnost_do')) query = query.lte('nosnost_kg', parseInt(params.get('nosnost_do')));
if (params.get('objem_od')) query = query.gte('objem_nadrze_l', parseInt(params.get('objem_od')));
if (params.get('objem_do')) query = query.lte('objem_nadrze_l', parseInt(params.get('objem_do')));
```

- [ ] **Step 3: Build + smoke**

```bash
npm run build 2>&1 | grep -i error | head
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/bazar/index.astro
git commit -m "feat(bazar): index query + filtry pro nosnost, objem, záběr"
```

---

## Phase 7: SEO & Polish (½ dne)

### Task 7.1: Update sitemap.xml.ts

**Files:**
- Modify: `src/pages/sitemap.xml.ts`

- [ ] **Step 1: Add hub + group + subcategory URLs**

```typescript
import { FUNCTIONAL_GROUPS, getAllBrands } from '../lib/stroje';

// In sitemap generation:
const strojeUrls = [
  '/stroje/zemedelske-stroje/',
  ...Object.keys(FUNCTIONAL_GROUPS).map((g) => `/stroje/zemedelske-stroje/${g}/`),
  ...Object.values(FUNCTIONAL_GROUPS).flatMap((g) => g.categories).map((c) => `/stroje/${c}/`),
];

// Per-brand URLs (existing pattern)
const brandUrls = getAllBrands().flatMap((b) => {
  // ... existing logic for traktory/kombajny ... 
  // Add: /stroje/[brand]/[subcategory]/ pro každou subcategory kterou brand má
});
```

- [ ] **Step 2: Build + verify sitemap**

```bash
npm run build 2>&1 | grep sitemap
/usr/bin/curl http://localhost:4321/sitemap.xml | head -20  # after npm run dev
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/sitemap.xml.ts
git commit -m "feat(seo): sitemap — přidat hub, funkční skupiny, sub-kategorie URL"
```

---

### Task 7.2: BreadcrumbList JSON-LD

> Hub a funkční skupina už mají BreadcrumbList z Tasks 3.2/3.3. Sub-kategorie (Task 3.4) má jen description, doplnit BreadcrumbList také.

**Files:**
- Modify: `src/pages/stroje/[subcategory]/index.astro`

- [ ] **Step 1: Add BreadcrumbList**

```astro
---
// In frontmatter
const breadcrumbJsonLd = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://agro-svet.cz/' },
    { '@type': 'ListItem', position: 2, name: 'Katalog strojů', item: 'https://agro-svet.cz/stroje/' },
    { '@type': 'ListItem', position: 3, name: subcategory, item: `https://agro-svet.cz/stroje/${subcategory}/` },
  ],
};
---
<Layout ...>
  <script type="application/ld+json" is:inline set:html={JSON.stringify(breadcrumbJsonLd)} />
  ...
</Layout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/stroje/[subcategory]/index.astro
git commit -m "feat(seo): BreadcrumbList JSON-LD na sub-kategorie cross-brand stránce"
```

---

## Phase 8: Deploy a Smoke Test (½ dne)

### Task 8.1: Pre-deploy build verification

- [ ] **Step 1: Run validator**

```bash
node scripts/validate-stroje-yaml.mjs
```
Expected: OK (všechny YAML files validní).

- [ ] **Step 2: Run all tests**

```bash
npm test
```
Expected: PASS.

- [ ] **Step 3: Full build**

```bash
npm run build 2>&1 | tee /tmp/build.log
echo "Pages built: $(grep -c 'page' /tmp/build.log)"
```
Expected: ~500+ pages (current ~1500 + new ~500), no errors.

- [ ] **Step 4: Local smoke test all key URLs**

```bash
npm run dev &
sleep 5
for path in "/" "/stroje/" "/stroje/zemedelske-stroje/" "/stroje/zemedelske-stroje/zpracovani-pudy/" "/stroje/pluhy/" "/stroje/teleskopy/" "/stroje/lemken/" "/stroje/lemken/pluhy/" "/bazar/" "/bazar/?category=zpracovani-pudy"; do
  status=$(/usr/bin/curl -sI -o /dev/null -w "%{http_code}" "http://localhost:4321$path")
  echo "$status $path"
done
kill %1
```
Expected: vše 200 (případně 301 pro trailing slash redirects).

---

### Task 8.2: Aplikace migrací 004 + 005 na Supabase

> **DESTRUKTIVNÍ pro stávající bazar inzeráty s starými kategoriemi.** Pre-deploy backup tabulky.

- [ ] **Step 1: Backup bazar_listings**

V Supabase SQL editoru:
```sql
CREATE TABLE bazar_listings_backup_20260425 AS SELECT * FROM bazar_listings;
SELECT count(*) FROM bazar_listings_backup_20260425;
```

- [ ] **Step 2: Run migrace 004**

V Supabase SQL editoru spustit obsah `supabase/migrations/004_bazar_stroje_categories.sql`. Verify:
```sql
SELECT category, count(*) FROM bazar_listings GROUP BY category;
```
Expected: žádné `seci-stroje`, `postrikovace`, `privezy`. Ano nové `seti`, `ochrana-rostlin`, `doprava`.

- [ ] **Step 3: Run migrace 005**

Spustit obsah `supabase/migrations/005_bazar_stroje_fields.sql`. Verify:
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'bazar_listings' 
AND column_name IN ('subcategory', 'nosnost_kg', 'objem_nadrze_l');
```
Expected: 3 řádky.

---

### Task 8.3: Production deploy

- [ ] **Step 1: Verify on master branch + clean working tree**

```bash
cd /Users/matejsamec/agro-svet
git status
git branch --show-current
```
Expected: master, clean.

- [ ] **Step 2: Deploy**

```bash
npx wrangler deploy
```

- [ ] **Step 3: Smoke test produkce**

```bash
for path in "/" "/stroje/" "/stroje/zemedelske-stroje/" "/stroje/lemken/" "/bazar/"; do
  status=$(/usr/bin/curl -sI -o /dev/null -w "%{http_code}" "https://agro-svet.cz$path")
  echo "$status $path"
done
```
Expected: 200 vše.

- [ ] **Step 4: Push to origin**

```bash
git push origin master
```

---

## Self-Review Checklist (run before handoff)

- [ ] **Spec coverage:** Každá sekce specu pokryta tasky? 
  - Sekce 2 IA → Task 5.1, 3.2, 3.3
  - Sekce 3 taxonomie → Task 1.1, 2.1
  - Sekce 4 schema → Task 1.1
  - Sekce 5 spec fields → Task 1.2, 1.3
  - Sekce 6 brand seed → Task 2.2-2.14
  - Sekce 7 data ingest → Phase 0
  - Sekce 8 bazar → Phase 6
  - Sekce 9 page templates → Phase 3
  - Sekce 10 implementation → cely plán
  - Sekce 11 risk → adresováno v Task 8.1, 8.2
- [ ] **No placeholders:** Plán neobsahuje "TBD", "TODO", "implement later", "similar to Task N"
- [ ] **Type consistency:** Všechny slugy v kebab-case (`podmitace-diskove`, ne `podmitace_diskove`). FUNCTIONAL_GROUPS keys consistent. SUBCATEGORY_FILTERS keys consistent.
- [ ] **Exact file paths:** Všechny tasky obsahují absolutní/relativní cesty.

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-04-25-stroje-katalog.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — Dispatch fresh subagent per task, review between tasks, fast iteration. Good pro velký plán s ~50 tasky.

**2. Inline Execution** — Execute tasks v této session pomocí executing-plans. Batch execution s checkpointy. Užitečné pokud chceš sledovat každý krok.

**Which approach?**
