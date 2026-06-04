# SK `/statistiky` (balík B) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Odemknout SK `/statistiky` reálnými agrárními statistikami (Eurostat `geo=SK` primárně, ŠÚSR best-effort), indexovatelnou pro slovenský trh — bez změny CZ obsahu.

**Architecture:** `/statistiky/index.astro` se převede z `prerender=true` na `prerender=false` (SSR; middleware-rewrite vzor pro launchnuté SK sekce) s edge-cache hlavičkou (CZ výkon). Data se i nadále čtou z importovaného JSON na úrovni modulu (žádný runtime fetch): cs z `agro-stats.json`, sk z nového `agro-stats-sk.json` (build-time fetcher `scripts/fetch-stats-sk.mjs`). Bloky bez SK dat se na /sk podmíněně vynechají. UI stringy + odvozené texty se lokalizují přes `t()` / locale param (cs verbatim → identita).

**Tech Stack:** Astro 6 (`output: server`, CF Worker), Eurostat JSON-stat API, vitest, Node 22.

**Klíčová pravidla (z paměti + spec):**
- Gate = `npx astro build` + `npx vitest run` (Node 22: `nvm use 22`). agro-svet **nemá** tsc/astro check.
- Worker 3 MiB gzip limit — `wrangler deploy --dry-run` size NEZACHYTÍ; ověřit reálným deployem. Žádný shiki/markdown na téhle routě.
- Cizí WIP **nikdy** necommitovat (`public/og/howto-*.png`, `Footer.astro`, `.env`, `node_modules`). Žádný `git add -A`. Per-task `git show --stat HEAD` scope verify.
- Branch `feat/i18n-sk-statistiky` z `origin/master` `ebc55bb` (worktree `~/agro-svet-i18n-statistiky`).
- Deploy je manuální (`npm run deploy`) — **user ho potvrdí**, není součástí tasků.

---

## Datové tvary (reference pro celý plán)

`agro-stats.json` / `agro-stats-sk.json` (identický tvar; sk = prázdná pole pro vynechané bloky):

```jsonc
{
  "generated": "ISO string",
  "scissorsBaseYear": 2020,                                  // sk: 2020 (Eurostat index báze)
  "commodityStats": [{ "name","unit","price","month","prevYearPrice","change" }],
  "commodityFull":  [{ "name","unit","data":[{ "label","value","sortKey" }] }],
  "fiveYearAvgs":   { "<name>": [{ "label","avg" }] | null },  // sk: {} (annual → bez 5y avg)
  "latestFuels":    [{ "fuel","price","week" }],               // sk: [] (ŠÚSR best-effort)
  "fuelSeries":     [{ "label","value","sortKey" }],           // sk: []
  "livestock":      [{ "animal","count","date" }],
  "livestockHistorical": [{ "animal","count","date":"YYYY-MM-DD" }],
  "crops":  [{ "crop","year","tonnes" }],
  "areas":  [{ "crop","year","hectares" }],
  "fertilizers": [{ "name","year","price" }],                 // sk: []
  "fertSeries":  [{ "name","data":[{ "year","price" }] }],     // sk: []
  "regional":    [{ "region","crop","year","tonnes" }],        // sk: [] (HexMap odložen)
  "scissorsPoints": [{ "year","x","y" }]
}
```

## Eurostat SK kódy (ověřeno živě 2026-06-04)

| Účel | dataset | dimenze → kód |
|---|---|---|
| Stavy skotu | `apro_mt_lscatl` | `animals=A2000`, měsíc `M11_M12` (fallback `M05_M06`), ×1000 = ks |
| Stavy prasat | `apro_mt_lspig` | `animals=A3100` |
| Ceny plodin (roční, EUR/100kg) | `apri_ap_crpouta` | `currency=EUR`, `prod_veg`: Pšenice `01110000`, Ječmen `01300000`, Kukuřice `01500000`, Řepka `02110000` |
| Ceny živočišné (roční, EUR/100kg) | `apri_ap_anouta` | `currency=EUR`, `prod_ani`: Hovězí `11114000` (Bullocks), Vepřové `11220000` (Pigs carcasses gr.II), Mléko `12111000` (Raw cows' milk 3.7%) |
| Index výstupních cen (báze 2020) | `apri_pi20_outa` | filtr `p_adj=NI` (nominal), `product=040000` (Total output) — ověřit v Tasku |
| Index vstupních cen (báze 2020) | `apri_pi20_ina` | filtr `p_adj=NI`, `product=000000` (Total input) — ověřit v Tasku |
| Produkce plodin (tis. t / tis. ha) | `apro_cpshr` | `crops`, `strucpro`: produkce `HPRD_HUMD_EU_THS_T`, plocha `AR_THS_HA` |

**JSON-stat parsing:** hodnota na souřadnici je na flat indexu `Σ (dimIndex_i × strideProduct_i)`, kde stride je součin velikostí *následujících* dimenzí (řád = `data.id`). Pattern viz `scripts/fetch-stats.mjs:fetchEurostatAnimal`.

---

## Task 1: Pure JSON-stat parser pro Eurostat (testovatelné jádro)

**Files:**
- Create: `scripts/lib/eurostat-sk.mjs` (čisté funkce, žádné side-effecty)
- Test: `tests/scripts/eurostat-sk.test.ts`

- [ ] **Step 1: Napsat failing test** — `tests/scripts/eurostat-sk.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { pickSeries } from '../../scripts/lib/eurostat-sk.mjs';

// Minimální JSON-stat: 1 dim "currency"(EUR,NAC) × 1 dim "prod"(A,B) × 1 dim "time"(2023,2024)
// id pořadí = [currency, prod, time]; size = [2,2,2]
// flat index = c*4 + p*2 + t
const FIXTURE = {
  id: ['currency', 'prod', 'time'],
  size: [2, 2, 2],
  dimension: {
    currency: { category: { index: { EUR: 0, NAC: 1 } } },
    prod: { category: { index: { A: 0, B: 1 } } },
    time: { category: { index: { '2023': 0, '2024': 1 }, label: { '2023': '2023', '2024': '2024' } } },
  },
  // EUR(0)/A(0): 2023=10 (idx0), 2024=11 (idx1); EUR(0)/B(1): 2023=20 (idx2), 2024=21 (idx3)
  value: { 0: 10, 1: 11, 2: 20, 3: 21, 4: 99, 5: 99, 6: 99, 7: 99 },
};

describe('pickSeries', () => {
  it('extrahuje časovou řadu pro dané fixní souřadnice', () => {
    const out = pickSeries(FIXTURE, { currency: 'EUR', prod: 'A' });
    expect(out).toEqual([
      { time: '2023', value: 10 },
      { time: '2024', value: 11 },
    ]);
  });
  it('vrátí prázdné pole když souřadnice nemá hodnoty', () => {
    const sparse = { ...FIXTURE, value: { 0: 10 } }; // jen EUR/A/2023
    const out = pickSeries(sparse, { currency: 'EUR', prod: 'B' });
    expect(out).toEqual([]);
  });
});
```

- [ ] **Step 2: Run → fail**

Run: `nvm use 22 && npx vitest run tests/scripts/eurostat-sk.test.ts`
Expected: FAIL (`pickSeries` not exported / module missing).

- [ ] **Step 3: Implementovat** — `scripts/lib/eurostat-sk.mjs`

```js
// Pure JSON-stat helpers pro Eurostat SK fetcher. Žádné side-effecty (testovatelné).

/** Stride dimenze = součin velikostí všech NÁSLEDUJÍCÍCH dimenzí (řád dle data.id). */
export function strides(size) {
  const s = new Array(size.length).fill(1);
  for (let i = size.length - 2; i >= 0; i--) s[i] = s[i + 1] * size[i + 1];
  return s;
}

/**
 * Vytáhne časovou řadu z JSON-stat odpovědi pro fixní souřadnice ostatních dimenzí.
 * @param json Eurostat JSON-stat objekt (.id, .size, .dimension, .value)
 * @param fixed { dimId: categoryCode } pro všechny dimenze KROMĚ 'time'
 * @returns [{ time, value }] seřazené dle time labelu (chronologicky), jen body s hodnotou
 */
export function pickSeries(json, fixed) {
  const { id, size, dimension, value } = json;
  const st = strides(size);
  const timePos = id.indexOf('time');
  if (timePos === -1) return [];
  const timeCat = dimension.time.category;
  const timeIndex = timeCat.index;
  const timeLabel = timeCat.label ?? {};

  // Bázový offset z fixních dimenzí
  let base = 0;
  for (let i = 0; i < id.length; i++) {
    const dim = id[i];
    if (dim === 'time') continue;
    const code = fixed[dim];
    const ci = dimension[dim]?.category?.index?.[code];
    if (ci === undefined) return []; // požadovaný kód v datasetu chybí
    base += ci * st[i];
  }

  const out = [];
  for (const [code, ti] of Object.entries(timeIndex)) {
    const flat = base + ti * st[timePos];
    const v = value?.[String(flat)];
    if (v === undefined || v === null) continue;
    out.push({ time: timeLabel[code] ?? code, value: v });
  }
  out.sort((a, b) => a.time.localeCompare(b.time));
  return out;
}

/** Vrátí % meziroční změnu posledních dvou bodů řady, nebo null. */
export function yoyChange(series) {
  if (series.length < 2) return null;
  const last = series[series.length - 1];
  const prev = series[series.length - 2];
  if (!prev.value) return null;
  return Math.round((last.value / prev.value - 1) * 1000) / 10;
}
```

- [ ] **Step 4: Run → pass**

Run: `npx vitest run tests/scripts/eurostat-sk.test.ts`
Expected: PASS (2 testy).

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/eurostat-sk.mjs tests/scripts/eurostat-sk.test.ts
git commit -m "feat(stats-sk): pure JSON-stat parser pro Eurostat SK fetcher"
```

---

## Task 2: Fetcher kostra + stavy zvířat (livestock)

**Files:**
- Create: `scripts/fetch-stats-sk.mjs`
- Modify: `package.json` (scripts)

- [ ] **Step 1: Implementovat kostru fetcheru** — `scripts/fetch-stats-sk.mjs`

```js
#!/usr/bin/env node
// Build-time fetcher pro SK /statistiky/. Zdroj = Eurostat geo=SK (primární),
// ŠÚSR DATAcube best-effort (PHM/hnojiva). Výstup src/data/agro-stats-sk.json
// (stejný tvar jako agro-stats.json; prázdná pole = blok se na /sk vynechá).
// Refresh: `npm run stats:refresh:sk`.

import { writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pickSeries, yoyChange } from './lib/eurostat-sk.mjs';

const OUT = fileURLToPath(new URL('../src/data/agro-stats-sk.json', import.meta.url));
const ES = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data';
const SCISSORS_BASE_YEAR = 2020;

async function esFetch(dataset, params) {
  const qs = new URLSearchParams({ format: 'JSON', geo: 'SK', ...params });
  const url = `${ES}/${dataset}?${qs}`;
  console.log(`→ Eurostat ${dataset} ${JSON.stringify(params)}`);
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) { console.warn(`  ${dataset} ${res.status} — skip`); return null; }
  return res.json();
}

// — Livestock (historická řada, ks) —
async function fetchLivestock() {
  const out = [];
  const specs = [
    { dataset: 'apro_mt_lscatl', animalCode: 'A2000', label: 'Skot' },
    { dataset: 'apro_mt_lspig', animalCode: 'A3100', label: 'Prasata' },
  ];
  for (const s of specs) {
    const json = await esFetch(s.dataset, { animals: s.animalCode });
    if (!json) continue;
    // měsíc M11_M12 (Nov/Dec sčítání), fallback M05_M06
    const months = json.dimension?.month?.category?.index ?? {};
    const monthCode = months['M11_M12'] !== undefined ? 'M11_M12' : 'M05_M06';
    const series = pickSeries(json, { animals: s.animalCode, month: monthCode, unit: 'THS_HD' });
    for (const p of series) out.push({ animal: s.label, count: Math.round(p.value * 1000), date: `${p.time}-12-31` });
  }
  out.sort((a, b) => a.date.localeCompare(b.date));
  return out;
}

async function main() {
  const livestockHistorical = await fetchLivestock();

  const payload = {
    generated: new Date().toISOString(),
    scissorsBaseYear: SCISSORS_BASE_YEAR,
    commodityStats: [],
    commodityFull: [],
    fiveYearAvgs: {},
    latestFuels: [],
    fuelSeries: [],
    livestock: livestockHistorical.slice(-4),
    livestockHistorical,
    crops: [],
    areas: [],
    fertilizers: [],
    fertSeries: [],
    regional: [],
    scissorsPoints: [],
  };

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(payload, null, 2) + '\n');
  console.log(`✓ wrote ${OUT}`);
  console.log(`  livestockHistorical: ${livestockHistorical.length}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 2: Přidat npm script** — `package.json`, do `"scripts"`:

```json
"stats:refresh:sk": "node scripts/fetch-stats-sk.mjs",
```

- [ ] **Step 3: Spustit a ověřit reálná data**

Run: `nvm use 22 && npm run stats:refresh:sk`
Expected: `✓ wrote .../agro-stats-sk.json`, `livestockHistorical: > 20`.
Verify: `node -e "const d=require('./src/data/agro-stats-sk.json'); const yrs=d.livestockHistorical.map(x=>x.date.slice(0,4)); console.log('skot/prasata datapoints:', d.livestockHistorical.length, 'roky:', yrs[0], '→', yrs[yrs.length-1])"`
Expected: roky cca 2000 → 2025, žádný NaN.

> **Pokud `unit: 'THS_HD'` v `pickSeries` vrátí prázdno:** dataset má dimenzi `unit` s jiným kódem. Spusť `node -e "fetch('${ES}/apro_mt_lscatl?format=JSON&geo=SK&animals=A2000').then(r=>r.json()).then(d=>console.log(d.id, JSON.stringify(d.dimension.unit?.category?.index)))"` a oprav kód jednotky. Stejně pro `month` (některé verze mají jen `M12`).

- [ ] **Step 4: Commit** (data JSON commitnout — je build artefakt verzovaný jako `agro-stats.json`)

```bash
git add scripts/fetch-stats-sk.mjs package.json src/data/agro-stats-sk.json
git commit -m "feat(stats-sk): fetcher kostra + stavy zvířat (Eurostat geo=SK)"
git show --stat HEAD   # ověř scope: jen tyto 3 soubory
```

---

## Task 3: SK ceny komodit (roční, Eurostat absolutní ceny)

**Files:**
- Modify: `scripts/fetch-stats-sk.mjs`

- [ ] **Step 1: Přidat fetch cen komodit** — do `scripts/fetch-stats-sk.mjs` před `main()`:

```js
// — Ceny komodit (roční, EUR/100kg → přepočet na EUR/t pro konzistenci jednotky) —
const CROP_PRICES = [
  { name: 'Pšenice', code: '01110000' },
  { name: 'Ječmen', code: '01300000' },
  { name: 'Kukuřice', code: '01500000' },
  { name: 'Řepka', code: '02110000' },
];
const ANIMAL_PRICES = [
  { name: 'Hovězí', code: '11114000' },
  { name: 'Vepřové', code: '11220000' },
  { name: 'Mléko', code: '12111000' },
];

function buildCommodity(name, series) {
  // series: [{ time:'2020', value: EUR/100kg }]; přepočet ×10 = EUR/t
  const data = series.map((p) => ({ label: p.time, value: Math.round(p.value * 10), sortKey: parseInt(p.time) * 12 }));
  return { name, unit: 'EUR/t', data };
}

async function fetchCommodities() {
  const full = [];
  const cropJson = await esFetch('apri_ap_crpouta', { currency: 'EUR' });
  if (cropJson) {
    for (const c of CROP_PRICES) {
      const s = pickSeries(cropJson, { freq: 'A', currency: 'EUR', prod_veg: c.code });
      if (s.length) full.push(buildCommodity(c.name, s));
    }
  }
  const aniJson = await esFetch('apri_ap_anouta', { currency: 'EUR' });
  if (aniJson) {
    for (const a of ANIMAL_PRICES) {
      const s = pickSeries(aniJson, { freq: 'A', currency: 'EUR', prod_ani: a.code });
      if (s.length) full.push(buildCommodity(a.name, s));
    }
  }
  return full;
}

function buildCommodityStats(full) {
  // Poslední rok + meziroční změna z roční řady.
  return full.map((s) => {
    const data = s.data;
    const last = data[data.length - 1];
    const prev = data[data.length - 2];
    return {
      name: s.name, unit: s.unit, price: last?.value ?? 0,
      month: last?.label ?? '',           // u SK = rok ("2024")
      prevYearPrice: prev?.value ?? null,
      change: prev && prev.value ? Math.round((last.value / prev.value - 1) * 1000) / 10 : null,
    };
  });
}
```

- [ ] **Step 2: Zapojit do `main()`** — nahradit prázdné `commodityFull`/`commodityStats`:

```js
  const commodityFull = await fetchCommodities();
  const commodityStats = buildCommodityStats(commodityFull);
  // ... v payload:
  //   commodityStats,
  //   commodityFull,
```

(Změň `commodityStats: []` → `commodityStats,` a `commodityFull: []` → `commodityFull,` v payload objektu; přidej obě `const` před `payload`.)

- [ ] **Step 3: Spustit + ověřit**

Run: `npm run stats:refresh:sk`
Verify: `node -e "const d=require('./src/data/agro-stats-sk.json'); console.log('komodity:', d.commodityFull.map(s=>s.name+'('+s.data.length+'r)')); console.log('stats:', d.commodityStats.map(s=>s.name+'='+s.price+s.unit+' '+s.change+'%'))"`
Expected: ≥3 komodity s ročními řadami; ceny v EUR/t; žádný NaN.

> Pokud některá komodita prázdná (SK ji Eurostat neeviduje), prostě se vynechá — to je OK (Eurostat-first scope).

- [ ] **Step 4: Commit**

```bash
git add scripts/fetch-stats-sk.mjs src/data/agro-stats-sk.json
git commit -m "feat(stats-sk): roční ceny komodit (Eurostat apri_ap_crpouta/anouta)"
git show --stat HEAD
```

---

## Task 4: SK produkce plodin + osevní plochy

**Files:**
- Modify: `scripts/fetch-stats-sk.mjs`

- [ ] **Step 1: Přidat fetch produkce + ploch** — do `scripts/fetch-stats-sk.mjs`:

```js
// — Produkce plodin (tis. t) + plochy (tis. ha) z apro_cpshr —
const PROD_CROPS = [
  { crop: 'Pšenice', code: 'C1100' },
  { crop: 'Ječmen', code: 'C1300' },
  { crop: 'Kukuřice', code: 'C1500' },
  { crop: 'Řepka', code: 'R1000' },
  { crop: 'Obiloviny', code: 'C1000' },
  { crop: 'Brambory', code: 'R2000' },
];

async function fetchProduction() {
  const json = await esFetch('apro_cpshr', {});
  if (!json) return { crops: [], areas: [] };
  const crops = [], areas = [];
  for (const c of PROD_CROPS) {
    const prod = pickSeries(json, { freq: 'A', crops: c.code, strucpro: 'HPRD_HUMD_EU_THS_T' });
    for (const p of prod) crops.push({ crop: c.crop, year: p.time, tonnes: Math.round(p.value * 1000) });
    const area = pickSeries(json, { freq: 'A', crops: c.code, strucpro: 'AR_THS_HA' });
    for (const p of area) areas.push({ crop: c.crop, year: p.time, hectares: Math.round(p.value * 1000) });
  }
  return { crops, areas };
}
```

- [ ] **Step 2: Zapojit do `main()`** — nahradit prázdné `crops`/`areas`:

```js
  const { crops, areas } = await fetchProduction();
  // v payload: crops, areas  (místo crops: [], areas: [])
```

- [ ] **Step 3: Spustit + ověřit + doladit kódy**

Run: `npm run stats:refresh:sk`
Verify: `node -e "const d=require('./src/data/agro-stats-sk.json'); console.log('crops:', d.crops.length, 'areas:', d.areas.length); console.log([...new Set(d.crops.map(c=>c.crop))])"`
Expected: ≥3 plodiny s produkcí i plochou.

> **Pokud plodina prázdná:** kód v `crops` dimenzi se liší. Spusť `node -e "fetch('${ES}/apro_cpshr?format=JSON&geo=SK').then(r=>r.json()).then(d=>{const c=d.dimension.crops.category.label; for(const[k,v]of Object.entries(c)) if(/wheat|barley|maize|rape|cereal|potato/i.test(v)) console.log(k,'=',v)})"` a oprav `PROD_CROPS` kódy. (Ječmen/Kukuřice/Řepka/Brambory kódy ověř — výše uvedené jsou odhad dle Eurostat konvence.)

- [ ] **Step 4: Commit**

```bash
git add scripts/fetch-stats-sk.mjs src/data/agro-stats-sk.json
git commit -m "feat(stats-sk): produkce plodin + osevní plochy (Eurostat apro_cpshr)"
git show --stat HEAD
```

---

## Task 5: SK cenové nůžky (z Eurostat cenových indexů)

**Files:**
- Modify: `scripts/fetch-stats-sk.mjs`

- [ ] **Step 1: Přidat fetch cenových nůžek** — do `scripts/fetch-stats-sk.mjs`:

```js
// — Cenové nůžky: index výstupů (apri_pi20_outa) vs vstupů (apri_pi20_ina), báze 2020 —
// Eurostat indexy mají dimenzi 'product' (kód Total) + 'p_adj' (NI=nominal). Kódy ověřit
// v Step 3 (struktura se mezi verzemi liší); fallback = první dostupný 'product' kód.
async function fetchScissors() {
  const out = await esFetch('apri_pi20_outa', { unit: 'I20', p_adj: 'NI' });
  const inp = await esFetch('apri_pi20_ina', { unit: 'I20', p_adj: 'NI' });
  if (!out || !inp) return [];

  const firstProduct = (json) => Object.keys(json.dimension.product?.category?.index ?? { '': 0 })[0];
  const outProd = json => (json.dimension.product?.category?.index?.['040000'] !== undefined ? '040000' : firstProduct(json));
  const inProd = json => (json.dimension.product?.category?.index?.['000000'] !== undefined ? '000000' : firstProduct(json));

  const outSeries = pickSeries(out, { freq: 'A', unit: 'I20', p_adj: 'NI', product: outProd(out) });
  const inSeries = pickSeries(inp, { freq: 'A', unit: 'I20', p_adj: 'NI', product: inProd(inp) });

  const inByYear = new Map(inSeries.map((p) => [p.time, p.value]));
  const points = [];
  for (const o of outSeries) {
    const x = inByYear.get(o.time);
    if (x === undefined) continue;
    points.push({ year: parseInt(o.time), x: Math.round(x * 10) / 10, y: Math.round(o.value * 10) / 10 });
  }
  return points.sort((a, b) => a.year - b.year);
}
```

- [ ] **Step 2: Zapojit do `main()`** — nahradit prázdné `scissorsPoints`:

```js
  const scissorsPoints = await fetchScissors();
  // v payload: scissorsPoints  (místo scissorsPoints: [])
```

- [ ] **Step 3: Spustit + ověřit dimenze**

Run: `npm run stats:refresh:sk`
Verify: `node -e "const d=require('./src/data/agro-stats-sk.json'); console.log('scissors:', d.scissorsPoints.length, JSON.stringify(d.scissorsPoints.slice(-3)))"`
Expected: ≥5 bodů, rok 2020 má ~x=100/y=100 (báze).

> **Pokud prázdné:** vypiš dimenze `node -e "fetch('${ES}/apri_pi20_outa?format=JSON&geo=SK').then(r=>r.json()).then(d=>{console.log('id:',d.id); for(const k of d.id) if(k!=='time'&&k!=='geo') console.log(k, JSON.stringify(d.dimension[k].category.index))})"` a oprav `unit`/`p_adj`/`product` filtry. Báze 2020 = hodnoty kolem 100 v roce 2020.

- [ ] **Step 4: Commit**

```bash
git add scripts/fetch-stats-sk.mjs src/data/agro-stats-sk.json
git commit -m "feat(stats-sk): cenové nůžky z Eurostat indexů (báze 2020)"
git show --stat HEAD
```

---

## Task 6: ŠÚSR PHM/hnojiva — best-effort průzkum (může zůstat prázdné)

**Files:**
- Modify: `scripts/fetch-stats-sk.mjs` (komentář o stavu ŠÚSR)

**Cíl:** Zjistit, zda ŠÚSR DATAcube (px-web JSON-stat na `https://datacube.statistics.sk`) má fetchovatelné měsíční/roční ceny PHM a hnojiv pro SK. **Pokud ANO** → naplnit `latestFuels`/`fuelSeries`/`fertilizers`/`fertSeries`. **Pokud NE / nejisté** → ponechat prázdné (InputsBlock se na /sk vynechá — to je v rámci Eurostat-first scope OK) a zdokumentovat proč.

- [ ] **Step 1: Průzkum DATAcube** (ruční, ne kód)

Vyzkoušej DATAcube API katalog: `https://data.statistics.sk/api/v2/` (PX-Web 2.0 JSON-stat) — hledej tabulky cen energií / priemyselných hnojív v poľnohospodárstve. Příklady cest k otestování přes WebFetch/curl:
- Katalog: `https://data.statistics.sk/api/v2/collection?lang=en`
- Ceny vstupov poľnohospodárstva (pokud existuje px-tabulka) → JSON-stat dotaz POST.

Kritérium úspěchu: existuje tabulka s časovou řadou ceny nafty (€/l) a/nebo ceny hnojiva (€/t) pro SK, dotazovatelná bez auth.

- [ ] **Step 2a: POKUD data nalezena** — přidat `fetchSkUsrFuelsFert()` analogicky k Eurostat fetcherům (DATAcube JSON-stat lze parsovat stejným `pickSeries` po normalizaci na `{id,size,dimension,value}` tvar), naplnit pole, commit:

```bash
git add scripts/fetch-stats-sk.mjs src/data/agro-stats-sk.json
git commit -m "feat(stats-sk): ceny PHM/hnojiv ze ŠÚSR DATAcube"
```

- [ ] **Step 2b: POKUD data nenalezena / nejistá** — přidat komentář do `fetch-stats-sk.mjs` (nad `main`):

```js
// ŠÚSR DATAcube: měsíční ceny PHM/hnojiv pro SK se nepodařilo dohledat jako veřejné
// JSON-stat (stav 2026-06-04). latestFuels/fuelSeries/fertilizers/fertSeries zůstávají
// prázdné → InputsBlock se na /sk vynechá. Doplnit v pozdější iteraci, až ověříme zdroj.
```

```bash
git add scripts/fetch-stats-sk.mjs
git commit -m "docs(stats-sk): ŠÚSR PHM/hnojiva odloženo — InputsBlock vynechán z /sk"
```

> **Časová pojistka:** na tomto tasku nestrávit > ~30 min průzkumu. Eurostat jádro (Tasky 2–5) je dostatečné pro launch; InputsBlock je doplněk.

---

## Task 7: `agro-derived.ts` — locale param u odvozených textů

**Files:**
- Modify: `src/lib/agro-derived.ts`
- Test: `tests/lib/agro-derived-i18n.test.ts`

**Kontext:** Funkce `biggestYoyChange`, `inputCostInflation`, `livestockMilestone` vrací **data**, ne text — ty locale nepotřebují. Lokalizovat se musí jen místa v `index.astro`, kde se z nich skládá **próza** (takeaways/insights). Vzor: `src/lib/comparison-insights.ts` (balík 2a) — cs větve doslovné originály → identita.

- [ ] **Step 1: Zjistit, kde se skládá próza** — v `index.astro` najít funkce typu `takeaways`, `scissorsInsight`, `livestockInsight`, `sparkMetrics` labely. Tyto string-konstrukce přesunout do nové čisté funkce v `agro-derived.ts` s `locale` parametrem.

Run: `grep -n "takeaway\|Insight\|insight\|const PILLS\|label:" src/pages/statistiky/index.astro`

- [ ] **Step 2: Napsat failing test** — `tests/lib/agro-derived-i18n.test.ts` (zachytit cs originály z aktuálního HEAD jako snapshoty + sk sanity). Příklad pro insight cenových nůžek:

```ts
import { describe, it, expect } from 'vitest';
import { scissorsInsightText } from '../../src/lib/agro-derived';

describe('scissorsInsightText', () => {
  it('cs = doslovný originál (identita)', () => {
    // ZACHYTIT z aktuálního renderu před refaktorem (zkopírovat přesný řetězec z index.astro)
    const cs = scissorsInsightText({ firstYear: 2017, lastYear: 2025, outputDelta: 12, inputDelta: 34 }, 'cs');
    expect(cs).toBe('<PŘESNÝ CS ŘETĚZEC ZACHYCENÝ Z index.astro>');
  });
  it('sk = slovenská varianta, žádné CZ ř/ě/ů', () => {
    const sk = scissorsInsightText({ firstYear: 2020, lastYear: 2025, outputDelta: 12, inputDelta: 34 }, 'sk');
    expect(sk).not.toMatch(/[řěů]/);
    expect(sk.length).toBeGreaterThan(10);
  });
});
```

> Implementer: počet a tvar insight funkcí odvoď z reálného `index.astro` (Step 1). Pro KAŽDOU prózu vázanou na číslo vytvoř `<name>Text(args, locale)` s cs větví = přesný originál. Test zachytí cs originál (zkopíruj řetězec z git HEAD verze `index.astro` PŘED úpravou).

- [ ] **Step 3: Run → fail** — `npx vitest run tests/lib/agro-derived-i18n.test.ts` → FAIL (funkce neexistuje).

- [ ] **Step 4: Implementovat** funkce v `agro-derived.ts` (cs = originál, sk = překlad dle glosáře). Žádné HTML-bearing newline triky nejsou potřeba (próza je plain text).

- [ ] **Step 5: Run → pass** — `npx vitest run tests/lib/agro-derived-i18n.test.ts` → PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/agro-derived.ts tests/lib/agro-derived-i18n.test.ts
git commit -m "feat(stats-sk): locale param u odvozených textů statistik (cs identita + sk)"
git show --stat HEAD
```

---

## Task 8: UI stringy `stat.*` (cs verbatim + sk)

**Files:**
- Modify: `src/i18n/ui/cs.ts`, `src/i18n/ui/sk.ts`
- Test: `tests/i18n/statistiky.test.ts`

- [ ] **Step 1: Vytěžit hardcoded CZ stringy** z `index.astro` + komponent `src/components/statistiky/*.astro` (Hero, SparklineTicker, AutoTakeaways, PillsNav, CommodityChart, InputsBlock, PriceScissors, ProductionBlock, LivestockSlope, StoryCards, MethodologyFooter, BottomCTA). Pro každý viditelný CZ řetězec zaveď klíč `stat.<oblast>.<co>`.

Run (mapování stringů): `grep -rn ">[A-ZĚŠČŘŽÁÍÉa-z]" src/components/statistiky/*.astro | head -80`

- [ ] **Step 2: Napsat failing parity test** — `tests/i18n/statistiky.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import cs from '../../src/i18n/ui/cs';
import sk from '../../src/i18n/ui/sk';

const statKeys = (dict: Record<string, string>) => Object.keys(dict).filter((k) => k.startsWith('stat.'));

describe('stat.* i18n parity', () => {
  it('každý stat.* klíč v cs má protějšek v sk', () => {
    for (const k of statKeys(cs)) expect(sk[k], `chybí sk klíč ${k}`).toBeTruthy();
  });
  it('žádný sk stat.* string neobsahuje CZ-only ř/ě/ů', () => {
    for (const k of statKeys(sk)) expect(sk[k], `CZ kontaminace v ${k}: ${sk[k]}`).not.toMatch(/[řěů]/);
  });
  it('má aspoň očekávané jádro klíčů', () => {
    expect(statKeys(cs).length).toBeGreaterThan(20);
  });
});
```

> Pozn.: `cs.ts`/`sk.ts` exportují `const cs/sk` default — ověř způsob importu dle existujícího `tests/i18n/ui.test.ts` a sjednoť.

- [ ] **Step 3: Run → fail** — `npx vitest run tests/i18n/statistiky.test.ts` → FAIL.

- [ ] **Step 4: Doplnit klíče** do `cs.ts` (verbatim z dnešních stringů) + `sk.ts` (SK glosář). Glosář: štatistika, ceny komodít, hnojivá, pohonné hmoty, stavy zvierat, osevné plochy, úroda, cenové nožnice, zdroj: Eurostat/ŠÚSR.

- [ ] **Step 5: Run → pass** — `npx vitest run tests/i18n/statistiky.test.ts` → PASS.

- [ ] **Step 6: Commit**

```bash
git add src/i18n/ui/cs.ts src/i18n/ui/sk.ts tests/i18n/statistiky.test.ts
git commit -m "feat(stats-sk): UI stringy stat.* (cs verbatim + SK glosář) + parity test"
git show --stat HEAD
```

---

## Task 9: Komponenty statistik — `t()` + locale-aware (cs identita)

**Files:**
- Modify: `src/components/statistiky/*.astro` (mimo HexMap)

**Vzor:** každá komponenta čte `const locale = Astro.locals.locale ?? 'cs'` a `const t = useTranslations(locale)` (jako launchnuté stránky); hardcoded CZ stringy → `t('stat.…')`. cs větev rendruje identické texty (klíče jsou verbatim). HTML-bearing stringy nech inline (paměť: `set:html` strip scoped `data-astro-cid`). Číselné formáty `locale==='sk'?'sk-SK':'cs-CZ'`.

- [ ] **Step 1: Postupně po komponentách** — pro každou: nahraď CZ string `t('stat.…')`, ověř že klíč existuje v Tasku 8 (jinak doplň). Komponenty se SK-specifickou logikou:
  - **MethodologyFooter** — zdroje: cs „ČSÚ + Eurostat", sk „Eurostat" (+ ŠÚSR pokud Task 6a naplnil). PriceScissors metodika sk: „index báze 2020 (Eurostat)".
  - **PriceScissors** — `baseYear` přichází z dat (sk=2020); popisek osy locale-aware.
  - **CommodityChart** — viz Task 10 (annual + sk data URL).

- [ ] **Step 2: Build ověří, že nic nechybí**

Run: `nvm use 22 && npx astro build 2>&1 | tail -20`
Expected: build projde bez chyby (žádný `t is not defined` apod.).

- [ ] **Step 3: Spustit testy**

Run: `npx vitest run`
Expected: vše zelené.

- [ ] **Step 4: Commit**

```bash
git add src/components/statistiky/
git commit -m "feat(stats-sk): statistiky komponenty t()+locale-aware (cs identita)"
git show --stat HEAD
```

---

## Task 10: JSON endpointy SK + CommodityChart locale-aware (annual)

**Files:**
- Create: `src/pages/statistiky/commodity-data-sk.json.ts`, `src/pages/statistiky/commodity-data-recent-sk.json.ts`
- Modify: `src/components/statistiky/CommodityChart.astro`

**Kontext:** CommodityChart fetchuje klientsky `/statistiky/commodity-data-recent.json`. SK varianty (prerendered, cs-path — middleware /sk nepokrývá prerendered, ale tyhle se servírují jako statický asset na cs cestě) čtou `agro-stats-sk.json`. SK je **roční** → bez `fiveYearAvg` (prázdné), `RECENT_MONTHS` filtr irelevantní (roční řada je krátká, pošli celou).

- [ ] **Step 1: Vytvořit `commodity-data-sk.json.ts`** — kopie `commodity-data.json.ts`, ale `import statsData from '../../data/agro-stats-sk.json'` a `fiveYearAvg: {}` (roční data nemají měsíční 5y avg), `events: []` (AGRO_EVENTS jsou CZ-specifické). Stejné cache hlavičky.

```ts
import type { APIRoute } from 'astro';
import statsData from '../../data/agro-stats-sk.json';

export const prerender = true;

export const GET: APIRoute = () => {
  const { commodityFull } = statsData as any;
  const series = (commodityFull as Array<{ name: string; unit: string; data: Array<{ label: string; value: number }> }>).map(
    (s) => ({ name: s.name, unit: s.unit, data: s.data.map((d) => ({ label: d.label, value: d.value })) }),
  );
  const payload = { series, events: [], fiveYearAvg: {}, default0: series[0]?.name ?? 'Pšenice' };
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
};
```

- [ ] **Step 2: Vytvořit `commodity-data-recent-sk.json.ts`** — pro roční data = stejný obsah jako full (krátká řada), `partial: false`:

```ts
import type { APIRoute } from 'astro';
import statsData from '../../data/agro-stats-sk.json';

export const prerender = true;

export const GET: APIRoute = () => {
  const { commodityFull } = statsData as any;
  const series = (commodityFull as Array<{ name: string; unit: string; data: Array<{ label: string; value: number }> }>).map(
    (s) => ({ name: s.name, unit: s.unit, data: s.data.map((d) => ({ label: d.label, value: d.value })) }),
  );
  const payload = { series, events: [], fiveYearAvg: {}, default0: series[0]?.name ?? 'Pšenice', partial: false };
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
};
```

- [ ] **Step 3: CommodityChart — locale-aware fetch URL** — přidat prop `dataBase` (default `''`); v klientském skriptu fetch `\`/statistiky/commodity-data-recent${dataBase}.json\`` a full `…-data${dataBase}.json`. Stránka předá `dataBase={locale==='sk'?'-sk':''}`. Ověř, že chart tolerује **roční label** ("2024") — pokud osa předpokládá měsíční parsing, doplň větev: roční label nech jak je. `partial:false` → chart nefetchuje "full" zvlášť.

- [ ] **Step 4: Build + test**

Run: `npx astro build 2>&1 | tail -5 && npx vitest run`
Expected: build vyrobí `commodity-data-sk.json` + `…-recent-sk.json`; testy zelené.
Verify: `ls dist/client/statistiky/*.json 2>/dev/null || ls dist/statistiky/*.json`

- [ ] **Step 5: Commit**

```bash
git add src/pages/statistiky/commodity-data-sk.json.ts src/pages/statistiky/commodity-data-recent-sk.json.ts src/components/statistiky/CommodityChart.astro
git commit -m "feat(stats-sk): SK JSON endpointy + CommodityChart locale-aware (roční řada)"
git show --stat HEAD
```

---

## Task 11: `index.astro` → SSR + locale data + podmíněné bloky + edge cache

**Files:**
- Modify: `src/pages/statistiky/index.astro`

- [ ] **Step 1: Převést na SSR + locale data selection** — nahoře v `index.astro`:

```ts
export const prerender = false;
import statsCs from '../../data/agro-stats.json';
import statsSk from '../../data/agro-stats-sk.json';

const locale = Astro.locals.locale ?? 'cs';
const statsData = locale === 'sk' ? statsSk : statsCs;

// Edge cache — žádný runtime fetch, čistý render → bezpečně cachovatelné.
Astro.response.headers.set('Cache-Control', 'public, max-age=600, s-maxage=86400, stale-while-revalidate=604800');
```

(Zbytek destrukturalizace `const { commodityStats, … } = statsData;` zůstává.)

- [ ] **Step 2: Podmíněné bloky** — obal bloky bez SK dat do `{cond && (...)}`:
  - `<HomeWeather/>` → `{locale === 'cs' && <HomeWeather mode="commodity" />}` (na /sk skryto).
  - `<InputsBlock/>` → `{fuelSeries.length > 0 && fertSeries.length > 0 && <InputsBlock … />}`.
  - `<HexMap/>` → `{regional.length > 0 && <HexMap data={regional} />}`.
  - `<CommodityChart/>` → `{commodityFull.length > 0 && <CommodityChart commodityNames={…} dataBase={locale==='sk'?'-sk':''} />}`.
  - `<ProductionBlock/>` → `{crops.length > 0 && <ProductionBlock … />}`.
  - `<PriceScissors/>` → `{scissorsPoints.length > 0 && <PriceScissors … />}`.
  - `<LivestockSlope/>` → `{livestockHistorical.length > 0 && <LivestockSlope … />}`.
  - `PillsNav` items: filtrovat na sekce, které mají data (jinak kotva míří na neexistující blok).

- [ ] **Step 3: Hero/datum/derived locale-aware** — `lastUpdated` přes `locale==='sk'?'sk-SK':'cs-CZ'`; `datasetCount`/`regionCount` odvozené z reálných dat (sk bez regionů → `regionCount=0` nebo skryté); insight prózy přes funkce z Tasku 7.

- [ ] **Step 4: Build + ověřit oba locale (dev)**

Run: `nvm use 22 && npx astro build 2>&1 | tail -10`
Expected: build projde.
Run (dev smoke): `npx astro dev` v pozadí → `curl -s localhost:4321/statistiky/ | grep -o 'lang="[a-z]*"'` = `lang="cs"`; `curl -s localhost:4321/sk/statistiky/ | grep -c 'Eurostat'` > 0 a `grep -o 'lang="[a-z]*"'` = `lang="sk"`. (Pozn.: dev server respektuje middleware rewrite.)

- [ ] **Step 5: Commit**

```bash
git add src/pages/statistiky/index.astro
git commit -m "feat(stats-sk): /statistiky SSR + locale data + podmíněné bloky + edge cache"
git show --stat HEAD
```

---

## Task 12: Gating — odemčení + launch + sitemap

**Files:**
- Modify: `src/i18n/nav.ts`, `src/i18n/utils.ts`, `src/pages/sitemap.xml.ts`
- Test: `tests/i18n/utils.test.ts` (nebo existující gating test)

- [ ] **Step 1: Failing test** — rozšířit gating test:

```ts
import { describe, it, expect } from 'vitest';
import { SK_LAUNCHED_PREFIXES, isSkLaunchedPath } from '../../src/i18n/utils';
import { LOCKED_SECTION_PREFIXES, isLockedSectionPath } from '../../src/i18n/nav';

describe('/statistiky launch (balík B)', () => {
  it('/statistiky je launchnutá SK sekce', () => {
    expect(SK_LAUNCHED_PREFIXES).toContain('/statistiky');
    expect(isSkLaunchedPath('/statistiky')).toBe(true);
  });
  it('/statistiky NENÍ locked', () => {
    expect(LOCKED_SECTION_PREFIXES).not.toContain('/statistiky');
    expect(isLockedSectionPath('/statistiky')).toBe(false);
  });
  it('/puda zůstává locked', () => {
    expect(isLockedSectionPath('/puda')).toBe(true);
  });
});
```

- [ ] **Step 2: Run → fail** — `npx vitest run tests/i18n/utils.test.ts` → FAIL.

- [ ] **Step 3: Provést změny:**
  - `src/i18n/utils.ts:31` — `SK_LAUNCHED_PREFIXES` přidat `'/statistiky'`.
  - `src/i18n/nav.ts:35` — `LOCKED_SECTION_PREFIXES` = `['/puda']` (odebrat `'/statistiky'`).
  - `src/i18n/nav.ts` — ověřit, že `data` sekce header (`href:'/statistiky/'`) je teď pro sk validní (odemčená) — `getNav` repoint logika ho ponechá. Žádná další změna nutná (statistiky child už není filtrován jako locked).
  - `src/pages/sitemap.xml.ts` — `/statistiky` je single page bez slugů → SK-mirror příbude automaticky přes `SK_LAUNCHED_PREFIXES` logiku (ověřit, že mirror generuje `/sk/statistiky`; pokud sitemap iteruje cs cesty a přidává sk mirror pro launchnuté prefixy, `/statistiky` se zahrne sám). Žádná per-slug výjimka (na rozdíl od `/dotace`).

- [ ] **Step 4: Run → pass + build**

Run: `npx vitest run && npx astro build 2>&1 | tail -5`
Expected: testy zelené, build projde.
Verify sitemap: `grep -c 'sk/statistiky' dist/**/sitemap*.xml 2>/dev/null || npx astro dev & sleep 4 && curl -s localhost:4321/sitemap.xml | grep -c 'sk/statistiky'`
Expected: ≥1 výskyt `/sk/statistiky`.

- [ ] **Step 5: Commit**

```bash
git add src/i18n/utils.ts src/i18n/nav.ts src/pages/sitemap.xml.ts tests/i18n/utils.test.ts
git commit -m "feat(stats-sk): launch /statistiky pro SK (odemčení + sitemap + hreflang)"
git show --stat HEAD
```

---

## Task 13: Finální build + Worker-size check + QA grep

**Files:** žádné nové (verifikace)

- [ ] **Step 1: Plný build + testy**

Run: `nvm use 22 && npx astro build 2>&1 | tail -15 && npx vitest run 2>&1 | tail -5`
Expected: build OK, všechny testy zelené.

- [ ] **Step 2: Worker-size kontrola** (lekce #61)

Run: `npx wrangler deploy --dry-run 2>&1 | grep -i "total upload\|gzip\|kib\|mib"`
Expected: `Total Upload` gzip pod 3 MiB s rezervou. Dva ~300 KB JSONy bundlované do workeru = +~120–150 KB gzip; rezerva po #61 ~750 KB → mělo by projít.
> **Pozor:** dry-run size limit NEZACHYTÍ skutečný overflow — finální verdikt až reálný deploy (Task 14, user-gated) / „Workers Builds" check. Pokud `Total Upload` přesáhne ~2.8 MiB gzip, zvažit lazy-load stats JSON přes klientský fetch (CommodityChart už to dělá; ostatní bloky by potřebovaly přesun do JSON endpointu) — eskalovat na uživatele.

- [ ] **Step 3: QA grep CZ kontaminace v SK datech/textech**

Run: `node -e "const d=require('./src/data/agro-stats-sk.json'); const s=JSON.stringify(d); const m=s.match(/[a-zěščřžýáíé]*[řěů][a-zěščřžýáíé]*/gi)||[]; console.log('CZ-only ř/ě/ů tokeny v SK datech:', [...new Set(m)].slice(0,20))"`
Expected: jediné přípustné = názvy komodit/plodin, které jsou společné (Pšenice, Ječmen, Řepka, Kukuřice, Mléko, Vepřové, Hovězí — ty jsou v `commodity-names` SK-mapě; pokud chart/komponenty zobrazují názvy, ověř SK formy přes `t()`). Skutečné CZ věty = chyba.

> Pozn.: názvy komodit v datech jsou interní klíče (mapují se na zobrazení přes `t('stat.commodity.*')` v komponentách). Ověř, že /sk graf ukazuje SK názvy (Pšenica/Jačmeň/Repka/Kukurica/Mlieko/Bravčové/Hovädzie), ne CZ.

- [ ] **Step 4: Commit (pokud QA vyžádal opravy)** — jinak žádný commit.

---

## Task 14: Deploy + live smoke (USER-GATED)

> **NESPOUŠTĚT bez explicitního potvrzení uživatele** (živá produkce; navíc souběžný deployer z `~/agro-svet` může přepsat — paměť [[feedback-concurrent-repo-use-worktree]]).

- [ ] **Step 1: Deploy** — `nvm use 22 && npm run deploy` (wrangler + cf-purge; `.env` ve worktree má `CF_PURGE_TOKEN`/`CF_ZONE_ID`).
- [ ] **Step 2: Hlídat souběžný deploy** — `npx wrangler deployments list | head` → aktivní musí být tato verze.
- [ ] **Step 3: Live smoke:**
  - `curl -sI https://agro-svet.cz/sk/statistiky/ | head -1` → 200.
  - `curl -s https://agro-svet.cz/sk/statistiky/ | grep -o 'lang="[a-z]*"'` → `lang="sk"`.
  - `grep robots` → `index, follow`; self-canonical `/sk/statistiky/`; reciproční hreflang cs+sk+x-default.
  - SK data přítomna (Eurostat zdroj, EUR jednotky, SK názvy komodit); InputsBlock/HexMap/počasí NEPŘÍTOMNY (pokud vynechány).
  - `curl -s https://agro-svet.cz/statistiky/ | grep -o 'lang="[a-z]*"'` → `lang="cs"`, identické CZ bloky, +reciproční sk hreflang.
  - `curl -s https://agro-svet.cz/sk/statistiky/commodity-data-recent-sk.json | head -c 200` → SK série.
  - sitemap: `curl -s https://agro-svet.cz/sitemap.xml | grep -c 'sk/statistiky'` ≥ 1.
- [ ] **Step 4: Workers Build check** — ověřit, že reálný deploy prošel pod 3 MiB (žádný `code:10027`). Pokud selže → eskalace (lazy-load JSON).

---

## Self-review (autor plánu)

**Spec coverage:**
- Architektura SSR + edge cache → Task 11. ✓
- `agro-stats-sk.json` + fetcher + npm script → Tasky 1–6. ✓
- Bloky Eurostat-first (livestock/scissors/commodity/production) → Tasky 2–5; InputsBlock best-effort → Task 6; HexMap/HomeWeather vynechány → Task 11. ✓
- i18n stringy + derived locale + JSON endpointy → Tasky 7–10. ✓
- Odemčení/launch/sitemap/hreflang → Task 12. ✓
- Worker-size + gate + QA → Task 13; deploy user-gated → Task 14. ✓

**Placeholder scan:** Eurostat dimension kódy (Tasky 2–5) mají ověřovací krok s konkrétním fallback příkazem — ne placeholder, ale guard proti driftu kódů mezi verzemi API. Task 6 je vědomě podmíněný (best-effort) s časovou pojistkou. Task 7/8 string-extrakce odkazuje na proven balík-A pattern + konkrétní grep příkazy.

**Type consistency:** `pickSeries(json, fixed)` signatura konzistentní napříč Tasky 1–5. `agro-stats-sk.json` tvar identický s `agro-stats.json` (ověřeno proti reálnému souboru). `dataBase` prop (Task 10) ↔ `commodity-data{-sk}.json` názvy souborů konzistentní.

**Známá rizika přenesená do tasků:** roční granularita commodity (CommodityChart musí unést roční label — Task 10 Step 3); Worker-size (Task 13); CZ názvy komodit v SK grafu (Task 13 Step 3).
