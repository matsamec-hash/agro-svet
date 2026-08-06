# Mapa zemědělských podmínek Evropy — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Interaktivní choropleth mapa Evropy na `/svet/mapa/` s přepínačem metrik, CZK/EUR, zoom/pan, panelem (pořadí + srovnání s EU Ø + sparkline), proklikem na existující `/svet/<země>`.

**Architecture:** Inline SVG (žádné MapLibre/tiles). Geometrie se jednorázově vygeneruje z `army-svet/public/borders/ad2010.json` do commitnutého `src/data/svet/geo/europe.json`. Data metrik se agregují build skriptem do `src/data/svet/map-metrics.json`. Renderuje Svelte island `AgriMap.svelte`. Legislativa/próza = mimo scope (F2).

**Tech Stack:** Astro (SSR node adapter), Svelte island, TypeScript, vitest. Build JEN Node 22.

**Reference:** Schválený mockup `.superpowers/brainstorm/*/content/map-geo-v6.html` obsahuje kompletní funkční logiku (color scale, zoom/pan, currency, panel, insight) — porti se do Svelte. Spec: `docs/superpowers/specs/2026-08-06-agro-svet-svet-mapa-zemedelskych-podminek-design.md`.

**⚠️ YMYL:** `cap-payments.json` a číselné hodnoty musí být human-verified se zdrojem. Do ověření drží stránka `noindex` (Task 7). NEPUBLIKOVAT ilustrativní čísla jako finální.

---

## ⚠️ REVIZE 2026-08-06 (objeven existující mapový systém /svet)

Úvodní průzkum minul, že `/svet` **už má SSR choropleth systém**. Plán níže se tím koriguje:
- **`src/components/svet/RegionMap.astro`** = etalon patternu: **inline SVG server-rendered, near-zero JS** (SSR vybarví výchozí metriku, klient jen přepíná metriku + tooltip). Geo tvar `{ viewBox:string, regions:[{code,name,path}] }`, data `{ year, source, sourceUrl, metrics:[{key,label,unit}], regions: Record<code, Record<key, number>> }`.
- **`src/lib/svet/mapcolor.ts`** = `rampColor(t)` / `extent(values)` / `colorFor(value,min,max)` (zelená brand škála, chybí data = `#e7e9e1`). **REUSE — neduplikuj** (Task 1 už `colorScale` odstranil).
- **`scripts/build-svet-geo.mjs`** = EXISTUJE, staví NUTS regiony z **Eurostat GISCO** (EPSG:3035) → `src/data/svet/regions/<slug>-geo.json`. **NEPŘEPISOVAT.**
- `/svet/[slug].astro` už `RegionMap` renderuje (`hasMap`).

**Korekce návrhu:**
1. Komponenta = **`EuropeMap.astro` (Astro SSR, model dle RegionMap)** — NE Svelte island. Interakce (přepínač, měna, zoom/pan, panel, sparkline) = progresivní enhancement JS v `src/scripts/europe-map.ts` (jako RegionMap má klientský skript).
2. Geometrie = **GISCO country-level (NUTS-0)** pro konzistenci s existující pipeline. Rozšířit `build-svet-geo.mjs` o country-pass **nebo** sibling `scripts/build-svet-europe-geo.mjs` → `src/data/svet/geo/europe.json` (stejná EPSG:3035 projekce, ne army-svet ad2010). Task 2 níže tím nahradit.
3. Data = mirror `RegionData` tvaru (metrics[] + regions/countries map). Task 3 sladit.
4. Barvy = `mapcolor.colorFor` všude. `map.ts` drží jen `METRIC_DEFS/metricStat/rankOf/convert/unitOf`.

Tasky 3–7 níže platí koncepčně, ale komponenta je Astro SSR + mapcolor + GISCO (ne Svelte/ad2010).

---

## File Structure
- `scripts/build-svet-geo.mjs` — generuje `europe.json` z ad2010.json (jednorázově; commitne se výstup).
- `src/data/svet/geo/europe.json` — geometrie (paths + centroidy per country code). Commitnuto.
- `src/data/svet/cap-payments.json` — kurátorská CAP data (human-verified). Commitnuto.
- `scripts/build-map-metrics.mjs` — agreguje `src/data/svet/<slug>.json` + `cap-payments.json` → `map-metrics.json`.
- `src/data/svet/map-metrics.json` — kompaktní data pro komponentu (generovaný).
- `src/lib/svet/map.ts` — čisté helpery (colorScale, stat, rank, currency convert) + typy. **Testovatelné.**
- `src/components/AgriMap.svelte` — island (UI + interakce).
- `src/pages/svet/mapa/index.astro` — stránka.
- `src/pages/svet/[slug].astro` — přidat sekci „Podmínky a podpory".
- `src/lib/svet/map.test.ts` — unit testy helperů.

---

## Task 1: Čisté helpery + typy (`src/lib/svet/map.ts`)

**Files:**
- Create: `src/lib/svet/map.ts`
- Test: `src/lib/svet/map.test.ts`

- [ ] **Step 1: Napiš failing testy**

```ts
import { describe, it, expect } from 'vitest';
import { metricStat, rankOf, convert, METRIC_DEFS } from './map';

const rows = [{ code: 'CZ', cap: 260 }, { code: 'NL', cap: 430 }, { code: 'UA', cap: null }] as any[];

describe('metricStat', () => {
  it('ignoruje null a počítá min/max/avg', () => {
    const s = metricStat(rows, 'cap');
    expect(s.min).toBe(260); expect(s.max).toBe(430); expect(Math.round(s.avg)).toBe(345);
  });
});
describe('rankOf', () => {
  it('řadí sestupně, přeskakuje null', () => {
    expect(rankOf(rows, 'cap', 'NL')).toEqual([1, 2]);
    expect(rankOf(rows, 'cap', 'UA')).toBeNull();
  });
});
describe('convert', () => {
  it('CZK násobí kurzem u currency metrik, jinak beze změny', () => {
    expect(convert(100, METRIC_DEFS.find(m => m.key==='cap')!, 'czk', 25)).toBe(2500);
    expect(convert(100, METRIC_DEFS.find(m => m.key==='size')!, 'czk', 25)).toBe(100);
    expect(convert(100, METRIC_DEFS.find(m => m.key==='cap')!, 'eur', 25)).toBe(100);
  });
});
```

- [ ] **Step 2: Spusť test → FAIL** — Run: `npx vitest run src/lib/svet/map.test.ts` — Expected: FAIL (modul neexistuje).

- [ ] **Step 3: Implementuj `src/lib/svet/map.ts`**

```ts
export type MetricKey = 'cap' | 'land' | 'rent' | 'wage' | 'size' | 'age';
export interface MetricDef { key: MetricKey; label: string; unit: string; group: string; currency?: boolean; }
export const METRIC_DEFS: MetricDef[] = [
  { key: 'cap',  label: 'CAP platby',     unit: '€/ha',  group: 'Podpory',   currency: true },
  { key: 'land', label: 'Cena půdy',      unit: '€/ha',  group: 'Ekonomika', currency: true },
  { key: 'rent', label: 'Pachtovné',      unit: '€/ha',  group: 'Ekonomika', currency: true },
  { key: 'wage', label: 'Zeměd. mzda',    unit: '€/měs', group: 'Ekonomika', currency: true },
  { key: 'size', label: 'Velikost farmy', unit: 'ha',    group: 'Struktura' },
  { key: 'age',  label: 'Mladí <35',      unit: '%',     group: 'Struktura' },
];
export interface Row { code: string; [k: string]: number | string | null; }
export function metricStat(rows: Row[], k: MetricKey) {
  const vs = rows.map(r => r[k]).filter((v): v is number => typeof v === 'number');
  const min = Math.min(...vs), max = Math.max(...vs);
  return { min, max, avg: vs.reduce((a, b) => a + b, 0) / vs.length };
}
export function rankOf(rows: Row[], k: MetricKey, code: string): [number, number] | null {
  const arr = rows.filter(r => typeof r[k] === 'number').sort((a, b) => (b[k] as number) - (a[k] as number));
  const i = arr.findIndex(r => r.code === code);
  return i < 0 ? null : [i + 1, arr.length];
}
export function convert(v: number, m: MetricDef, cur: 'czk' | 'eur', rate: number): number {
  return m.currency && cur === 'czk' ? Math.round(v * rate) : v;
}
export function colorScale(t: number): string {
  const s = [[240,249,236],[173,221,142],[65,171,93],[0,68,27]];
  const g = Math.min(2, Math.floor(t * 3)), lt = t * 3 - g, a = s[g], b = s[g + 1];
  const c = (i: number) => Math.round(a[i] + (b[i] - a[i]) * lt);
  return `rgb(${c(0)},${c(1)},${c(2)})`;
}
```

- [ ] **Step 4: Spusť test → PASS** — Run: `npx vitest run src/lib/svet/map.test.ts` — Expected: PASS.
- [ ] **Step 5: Commit** — `git add src/lib/svet/map.ts src/lib/svet/map.test.ts && git commit -m "feat(svet/mapa): čisté helpery metrik + testy"`

---

## Task 2: Build geometrie (`scripts/build-svet-geo.mjs` → `europe.json`)

**Files:**
- Create: `scripts/build-svet-geo.mjs` (port z `.superpowers/brainstorm/*/scratchpad/gen_geo_v2.mjs`, ale bez UI — jen paths+cent)
- Create (výstup): `src/data/svet/geo/europe.json`

- [ ] **Step 1:** Zkopíruj z mockup generátoru část s `merc`, `FLON/FLAT=[-11,41]/[35,69.5]`, `ringPath`, `area`, mapu EN→`{code,slug}` (viz spec) a smyčku, co plní `paths`/`cent`. Vstup: `../army-svet/army-svet/public/borders/ad2010.json` (parametrizuj cestu přes env `BORDERS_JSON`, default relativní). Výstup zapiš jako `{ viewBox:[W,H], countries:{ [code]:{ slug, d, centroid:[x,y,r] } } }` do `src/data/svet/geo/europe.json`.
- [ ] **Step 2:** Spusť: `node scripts/build-svet-geo.mjs`. Expected: `europe.json` s ~31 zeměmi, kB < 120.
- [ ] **Step 3:** Ověř JSON: `node -e "const g=require('./src/data/svet/geo/europe.json'); console.log(Object.keys(g.countries).length, g.viewBox)"` — Expected: `31 [ <W>, <H> ]`.
- [ ] **Step 4: Commit** — `git add scripts/build-svet-geo.mjs src/data/svet/geo/europe.json && git commit -m "feat(svet/mapa): geometrie Evropy z ad2010 borders"`

---

## Task 3: Kurátorská CAP data + build map-metrics

**Files:**
- Create: `src/data/svet/cap-payments.json` — `{ [code]: { value:number|null, year:number, source:string, sourceUrl:string } }`. **Human-verified z DG AGRI.** Do ověření hodnoty `null`.
- Create: `scripts/build-map-metrics.mjs`
- Create (výstup): `src/data/svet/map-metrics.json`
- Test: `src/lib/svet/map-metrics.test.ts`

- [ ] **Step 1:** `cap-payments.json` — založ se všemi 31 kódy, `value:null` (placeholder) + pole `source`. (Reálné hodnoty doplní člověk; build je unese jako null → šedá.)
- [ ] **Step 2:** `build-map-metrics.mjs`: pro každou zemi z `europe.json` načti `src/data/svet/<slug>.json` (existující engine výstup), vytáhni indikátory odpovídající `land/rent/wage/size/age` (mapování klíčů ověř proti reálnému JSONu — pokud chybí, hodnota `null`), CAP z `cap-payments.json`. Pro sparkline vezmi `series` z engine JSONu (nebo `null`). Zapiš `{ [code]:{ slug, name, region, metrics:{ [key]:{ latest:number|null, series:number[]|null } } } }` do `map-metrics.json`.
- [ ] **Step 3:** Napiš test `map-metrics.test.ts`: načti `map-metrics.json`, ověř že má klíč `CZ`, 6 metrik, `metrics.cap` má tvar `{latest, series}`. Run `npx vitest run src/lib/svet/map-metrics.test.ts` → nejdřív FAIL (soubor/klíče), doplň build, → PASS.
- [ ] **Step 4:** Přidej npm skript `"build:map": "node scripts/build-svet-geo.mjs && node scripts/build-map-metrics.mjs"` do `package.json` a zavěs ho do `prebuild`.
- [ ] **Step 5: Commit** — `git add src/data/svet/cap-payments.json scripts/build-map-metrics.mjs src/data/svet/map-metrics.json src/lib/svet/map-metrics.test.ts package.json && git commit -m "feat(svet/mapa): agregace map-metrics + kurátorská CAP kostra"`

---

## Task 4: Komponenta `AgriMap.svelte`

**Files:**
- Create: `src/components/AgriMap.svelte`

- [ ] **Step 1:** Port z mockupu `map-geo-v6.html` (skript sekce + CSS). Props: `geo` (europe.json), `data` (map-metrics.json), `rate:number`. Použij `METRIC_DEFS`, `metricStat`, `rankOf`, `convert`, `colorScale` z `src/lib/svet/map.ts` (import, neduplikuj). Stav: `active`, `sel`, `cur` (default `'czk'`), zoom `T={k,x,y}`. Prvky: currency toggle, group chips, insight, SVG `<g>` s `<path data-c>` + `<text>` popisky, legenda se značkami EU Ø + sel, panel (rank, řádky s % vs Ø + poziční proužek + sparkline), CTA `→ /svet/<slug>`.
- [ ] **Step 2:** Interakce: wheel zoom k kurzoru, pointer drag pan, ＋/−/reset, klik na zemi = zoom+panel (drag threshold 3px brání omylu). Layout: dashboard fit (`height:100%` sloupce), skoro plná šířka. (Přesné vzorce viz mockup — zoomAround fixed-point.)
- [ ] **Step 3:** Ověř lokálně render: `npm run build` (Node 22) proběhne bez chyby.
- [ ] **Step 4: Commit** — `git add src/components/AgriMap.svelte && git commit -m "feat(svet/mapa): AgriMap Svelte island (choropleth + zoom + currency)"`

---

## Task 5: Stránka `/svet/mapa/`

**Files:**
- Create: `src/pages/svet/mapa/index.astro`

- [ ] **Step 1:** Načti `europe.json` + `map-metrics.json` (import JSON), předej do `<AgriMap client:load geo={...} data={...} rate={25.3} />`. Přidej `<Layout>` s title/description/canonical dle patternu ostatních `/svet` stránek, sekci „Zdroje a metodika" (zdroje Eurostat + DG AGRI + datum) a breadcrumbs.
- [ ] **Step 2:** Ověř build + že stránka existuje: `npm run build && ls dist | grep -i mapa` (nebo dev preview curl `/svet/mapa/`). Expected: 200.
- [ ] **Step 3: Commit** — `git add src/pages/svet/mapa/index.astro && git commit -m "feat(svet/mapa): stránka /svet/mapa/ s AgriMap"`

---

## Task 6: Sekce „Podmínky a podpory" v `/svet/[slug]`

**Files:**
- Modify: `src/pages/svet/[slug].astro`

- [ ] **Step 1:** Načti `map-metrics.json`, pro danou zemi vyrenderuj novou `<section>` „Podmínky a podpory" s 6 metrikami přes existující `IndicatorRow` (srovnání s ČR/EU Ø) + blok zdrojů. Umísti nad „Zdroje a metodika".
- [ ] **Step 2:** Ověř: `npm run build`, curl `/svet/cesko/` obsahuje „Podmínky a podpory".
- [ ] **Step 3: Commit** — `git add src/pages/svet/[slug].astro && git commit -m "feat(svet): sekce Podmínky a podpory v detailu země"`

---

## Task 7: Wiring + noindex gate + prolinky

**Files:**
- Modify: `src/pages/svet/index.astro` (odkaz na `/svet/mapa/`), `src/pages/data/index.astro` (dlaždice), `src/pages/sitemap.xml.ts`, `src/pages/svet/mapa/index.astro` (noindex meta dokud data neověřena).

- [ ] **Step 1:** V `mapa/index.astro` přidej `<meta name="robots" content="noindex">` dokud `cap-payments.json` a metriky nejsou human-verified (flag komentářem — člověk odebere po verifikaci). Prolink z `/svet/` a `/data/`. Přidej do sitemapy až po odebrání noindexu.
- [ ] **Step 2:** Ověř build; `curl` `/svet/mapa/` má `noindex`, `/svet/` odkazuje na mapu.
- [ ] **Step 3: Commit** — `git add -A && git commit -m "chore(svet/mapa): prolinky + noindex gate do human-verifikace dat"`

---

## Self-Review
- **Spec coverage:** mapa (T3,4,5) ✅ · metriky+měna (T1,3,4) ✅ · geometrie (T2) ✅ · /svet integrace (T6) ✅ · fázování jen-čísla + YMYL noindex (T3,7) ✅ · testy (T1,3) ✅. Legislativa = F2 (mimo scope) ✅.
- **Placeholders:** CAP hodnoty `null` jsou záměrný placeholder s noindex gate (ne skrytý TODO) — human doplní ověřená čísla.
- **Type consistency:** `MetricKey`, `MetricDef.currency`, `metricStat/rankOf/convert/colorScale` konzistentní napříč T1→T4.
- **Riziko:** mapování klíčů engine JSON → `land/rent/wage/size/age` (T3 Step 2) nutno ověřit proti reálnému `src/data/svet/<slug>.json`; pokud engine dané indikátory nemá, je to samostatný pod-úkol rozšíření `scripts/lib/svet/indicators.mjs` (spec §Data) — přidat před T3 pokud chybí.
