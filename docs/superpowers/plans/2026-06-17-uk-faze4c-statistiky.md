# UK fáze 4c — `/uk/statistiky` (ukrajinská obilnice) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Spustit `/uk/statistiky` jako izolovanou, autoritativně grounded podmnožinu statistik (UA jako světová obilnice: produkce + plochy + světový export podíl velké čtyřky plodin), bez dotčení cs/sk.

**Architecture:** Přístup „plná izolace jako /puda". Cs route `src/pages/statistiky/index.astro` (SSR, `prerender=false`) dostane jedinou aditivní větev `{locale === 'uk' ? <StatistikyUk /> : (…cs/sk beze změny…)}`. Veškerý uk render je v izolované `StatistikyUk.astro`, čerpá z typovaného `agro-stats-uk.json` přes čistý helper `statistiky-uk.ts`. Sdílená SVG chart-math se extrahuje do `chart-line.ts` (DRY s /puda). Launch prefix `/statistiky` se přidá do `LAUNCHED_PREFIXES.uk` jako poslední krok → auto sitemap + hreflang.

**Tech Stack:** Astro 6 (`output:'server'`, `@astrojs/node`), TypeScript, vitest. Node 22.

**Prostředí:** Worktree `~/agro-svet-uk-faze4c-statistiky`, větev `feat/uk-faze4c-statistiky` (z `master` `61e4703`). `.env` zkopírován. Před každým build/test `source ~/.nvm/nvm.sh && nvm use 22`. Před smoke `pkill -f 'dist/server/entry'`.

**⚠️ Baseline:** `npx vitest run` má **3 pre-existing fail** v `tests/i18n/nav.test.ts` (bazar). Cíl = 3 fail + zbytek (vč. nových) pass.

**Ověřená fakta z codebase:**
- `src/lib/puda-uk.ts` exportuje `buildLineChart(data: PudaUkSeriesPoint[], opts: {max, ticks, min?}): LineChart` — čistá SVG math (w=1200, h=360, pad l50/r20/t20/b30), `PudaUkSeriesPoint = {year, value}`, `LineChart = {points, path, area, pad, w, h, plotW, plotH}`. Používá ji `PudaUk.astro`. Test `tests/lib/puda-uk-lib.test.ts` importuje `buildLineChart` z `../../src/lib/puda-uk`.
- `PudaUk.astro` (vzor): `const d = raw as unknown as PudaUkData; const t = useTranslations('uk');` + `Astro.response.headers.set('Cache-Control', 'public, max-age=600, s-maxage=86400, stale-while-revalidate=604800');`. Renderuje `{d.warCaveat && <p class="war-caveat">…}`, `{d.bigNumbers.length > 0 && <section class="big-numbers">…}` s `<a class="bn-source" href={b.url} target="_blank" rel="noopener noreferrer">`.
- `src/pages/statistiky/index.astro`: `export const prerender = false` (ř. 7); `const locale = Astro.locals.locale ?? 'cs'` (ř. 32); `<Layout` začíná ř. 135; soubor 652 ř. Frontmatter počítá cs/sk hodnoty bez ohledu na locale (pro uk neškodné — počítá nad `statsCs`).
- `LAUNCHED_PREFIXES.uk` v `src/i18n/utils.ts` (ř. ~35): aktuálně `['/stroje', '/srovnani', '/znacky', '/encyklopedie', '/jak-na-to', '/slovnik', '/puda']`.
- `src/i18n/ui/uk.ts`: puda klíče jako `'puda.uk.h.cena': 'Ціна…'` (plochá mapa řetězců).
- Pro `/statistiky` NEEXISTUJE žádná uk článková kolekce (na rozdíl od `puda-uk`) → žádný parity test slugů.

---

## File Structure

**Nové:**
- `src/lib/chart-line.ts` — sdílená čistá SVG line-chart math (extrahováno z puda-uk.ts).
- `src/lib/statistiky-uk.ts` — typy `StatistikyUkData` ad. + helper `cropGrowthPct`.
- `src/data/agro-stats-uk.json` — grounded data velké čtyřky + bigNumbers + exportShare + warCaveat + sources.
- `src/components/statistiky/StatistikyUk.astro` — izolovaný uk render.
- `tests/lib/chart-line.test.ts`, `tests/lib/statistiky-uk-lib.test.ts`, `tests/lib/statistiky-uk-data.test.ts`.

**Editované:**
- `src/lib/puda-uk.ts` — `buildLineChart`/`LineChart`/`LineChartPoint`/`PudaUkSeriesPoint` → re-export z `chart-line.ts` (API beze změny).
- `src/pages/statistiky/index.astro` — `+ import StatistikyUk` + aditivní `{locale === 'uk' ? … }` gate.
- `src/i18n/ui/uk.ts` — klíče `stat.uk.*`.
- `src/i18n/utils.ts` — `/statistiky` do `LAUNCHED_PREFIXES.uk` (POSLEDNÍ task).

---

## Task 1: Extrahovat sdílenou chart-math do `chart-line.ts` (DRY, TDD)

**Files:**
- Create: `src/lib/chart-line.ts`
- Create test: `tests/lib/chart-line.test.ts`
- Modify: `src/lib/puda-uk.ts`

- [ ] **Step 1: Vytvořit `src/lib/chart-line.ts`** (přesun těla z puda-uk.ts, generická jména):

```ts
// src/lib/chart-line.ts
// Sdílená čistá SVG matematika liniového grafu (UK data-huby /puda, /statistiky).
export interface ChartSeriesPoint { year: number; value: number; }

export interface LineChartPoint extends ChartSeriesPoint { x: number; y: number; }
export interface LineChart {
  points: LineChartPoint[];
  path: string;
  area: string;
  pad: { l: number; r: number; t: number; b: number };
  w: number; h: number; plotW: number; plotH: number;
}

/** Čistá matematika liniového grafu (w=1200×h=360). */
export function buildLineChart(
  data: ChartSeriesPoint[],
  opts: { max: number; ticks: number[]; min?: number },
): LineChart {
  const min = opts.min ?? 0;
  const w = 1200, h = 360;
  const pad = { l: 50, r: 20, t: 20, b: 30 };
  const plotW = w - pad.l - pad.r;
  const plotH = h - pad.t - pad.b;
  const yearMin = data[0].year;
  const yearSpan = (data.at(-1)!.year - yearMin) || 1;
  const points: LineChartPoint[] = data.map((d) => {
    const x = pad.l + ((d.year - yearMin) / yearSpan) * plotW;
    const y = pad.t + plotH - ((d.value - min) / (opts.max - min)) * plotH;
    return { ...d, x, y };
  });
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const last = points[points.length - 1];
  const first = points[0];
  const area = `${path} L${last.x.toFixed(1)},${(pad.t + plotH).toFixed(1)} L${first.x.toFixed(1)},${(pad.t + plotH).toFixed(1)} Z`;
  return { points, path, area, pad, w, h, plotW, plotH };
}
```

- [ ] **Step 2: Přepsat `src/lib/puda-uk.ts`** — nahradit původní `PudaUkSeriesPoint`, `LineChartPoint`, `LineChart` a celé tělo `buildLineChart` (řádky 5, 53–84) re-exportem; zachovat veřejné API (aliasy). Konkrétně:
  - Smazat `export interface PudaUkSeriesPoint { year: number; value: number; }` (ř. 5) a nahradit:
    ```ts
    import type { ChartSeriesPoint } from './chart-line';
    export type PudaUkSeriesPoint = ChartSeriesPoint;
    ```
  - Smazat lokální `LineChartPoint`/`LineChart`/`buildLineChart` (ř. 53–84) a nahradit:
    ```ts
    export { buildLineChart } from './chart-line';
    export type { LineChart, LineChartPoint } from './chart-line';
    ```
  - `pudaUkPriceGrowthPct` a ostatní typy (`PudaUkSeries`, `PudaUkData`…) zůstávají beze změny.

- [ ] **Step 3: Vytvořit `tests/lib/chart-line.test.ts`** (přesun assertů z puda-uk-lib semantiky):

```ts
import { describe, it, expect } from 'vitest';
import { buildLineChart, type ChartSeriesPoint } from '../../src/lib/chart-line';

describe('chart-line buildLineChart', () => {
  const series: ChartSeriesPoint[] = [
    { year: 2021, value: 1000 },
    { year: 2024, value: 2000 },
  ];

  it('mapuje první/poslední bod na extrémy plochy', () => {
    const c = buildLineChart(series, { max: 2000, ticks: [0, 1000, 2000] });
    expect(c.points).toHaveLength(2);
    expect(c.points[0].x).toBeCloseTo(50, 1);
    expect(c.points[1].x).toBeCloseTo(1180, 1);
    expect(c.points[1].y).toBeCloseTo(20, 1);
  });

  it('path začíná M a area končí Z', () => {
    const c = buildLineChart(series, { max: 2000, ticks: [0, 2000] });
    expect(c.path.startsWith('M')).toBe(true);
    expect(c.area.trim().endsWith('Z')).toBe(true);
  });
});
```

- [ ] **Step 4: Spustit testy** — `source ~/.nvm/nvm.sh && nvm use 22 && npx vitest run tests/lib/chart-line.test.ts tests/lib/puda-uk-lib.test.ts`. Expected: PASS oba soubory (puda-uk-lib stále importuje `buildLineChart` z `puda-uk`, který teď re-exportuje → funguje beze změny).

- [ ] **Step 5: Commit:**
```bash
git add src/lib/chart-line.ts src/lib/puda-uk.ts tests/lib/chart-line.test.ts
git commit -m "refactor(uk): extrahovat buildLineChart do sdíleného chart-line.ts (DRY pro statistiky)"
```

---

## Task 2: `statistiky-uk.ts` — typy + helper (TDD)

**Files:**
- Create: `src/lib/statistiky-uk.ts`
- Create test: `tests/lib/statistiky-uk-lib.test.ts`

- [ ] **Step 1: Napsat failing test** — `tests/lib/statistiky-uk-lib.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { cropGrowthPct, type StatUkSeries } from '../../src/lib/statistiky-uk';

function mkSeries(values: number[]): StatUkSeries {
  return {
    unit: 'млн т', asOf: '2024', source: 'USDA PSD', url: 'https://apps.fas.usda.gov/psdonline/',
    max: 100, ticks: [0, 50, 100],
    series: values.map((v, i) => ({ year: 2015 + i, value: v })),
  };
}

describe('statistiky-uk cropGrowthPct', () => {
  it('spočítá růst v % z prvního na poslední bod', () => {
    expect(cropGrowthPct(mkSeries([20, 25, 30]))).toBe(50);
  });
  it('vrátí null pro <2 body', () => {
    expect(cropGrowthPct(mkSeries([20]))).toBeNull();
  });
  it('vrátí null když první hodnota je 0 (dělení nulou)', () => {
    expect(cropGrowthPct(mkSeries([0, 30]))).toBeNull();
  });
});
```

- [ ] **Step 2: Spustit → fail** — `source ~/.nvm/nvm.sh && nvm use 22 && npx vitest run tests/lib/statistiky-uk-lib.test.ts`. Expected: FAIL (`statistiky-uk` neexistuje).

- [ ] **Step 3: Vytvořit `src/lib/statistiky-uk.ts`:**

```ts
// src/lib/statistiky-uk.ts
// Typy + derivace pro UK /statistiky hub (obilnice: produkce + plochy + export podíl).
// Evergreen-first; každé volatilní pole nese source+asOf+url. Chart-math sdílená (chart-line.ts).
import type { ChartSeriesPoint } from './chart-line';
export { buildLineChart } from './chart-line';
export type { LineChart } from './chart-line';

export type StatUkSeriesPoint = ChartSeriesPoint;

/** Volatilní řada (produkce / plocha) s povinnou atribucí. */
export interface StatUkSeries {
  unit: string;
  asOf: string;
  source: string;
  url: string;
  max: number;
  ticks: number[];
  series: StatUkSeriesPoint[];
}

export interface StatUkBigNumber {
  val: string; unit: string; lbl: string; sub: string;
  source: string; asOf: string; url: string;
}

export interface StatUkCrop {
  slug: 'psenice' | 'kukurice' | 'slunecnice' | 'jecmen';
  name: string;
  production: StatUkSeries;
  area: StatUkSeries;
  note: string;
}

export interface StatUkExportShareItem { crop: string; label: string; pct: number; }
export interface StatUkExportShare {
  unit: string; asOf: string; source: string; url: string;
  items: StatUkExportShareItem[];
}

export interface StatUkFact { text: string; source: string; asOf: string; url: string; }
export interface StatUkSourceLink { label: string; url: string; }

export interface StatistikyUkData {
  generated: string;
  warCaveat: string;
  bigNumbers: StatUkBigNumber[];
  crops: StatUkCrop[];
  exportShare: StatUkExportShare;
  facts: StatUkFact[];
  sources: StatUkSourceLink[];
}

/** Růst řady v % (první → poslední); null pokud <2 body nebo první = 0. */
export function cropGrowthPct(s: StatUkSeries): number | null {
  const pts = s.series;
  if (pts.length < 2 || pts[0].value === 0) return null;
  return Math.round((pts.at(-1)!.value / pts[0].value - 1) * 100);
}
```

- [ ] **Step 4: Spustit → pass** — `source ~/.nvm/nvm.sh && nvm use 22 && npx vitest run tests/lib/statistiky-uk-lib.test.ts`. Expected: PASS (3 testy).

- [ ] **Step 5: Commit:**
```bash
git add src/lib/statistiky-uk.ts tests/lib/statistiky-uk-lib.test.ts
git commit -m "feat(uk-statistiky): typy StatistikyUkData + cropGrowthPct helper"
```

---

## Task 3: `agro-stats-uk.json` — grounded data velké čtyřky

**Files:**
- Create: `src/data/agro-stats-uk.json`
- Create test: `tests/lib/statistiky-uk-data.test.ts`

> **⚠️ GROUNDING (kritické):** Data NEVYMÝŠLET. Každé číslo dohledat v primárním zdroji a uvést `source` + `asOf` + plné `url`. Primární zdroje: **USDA FAS PSD Online** (https://apps.fas.usda.gov/psdonline/ — produkce/plochy/export po marketing years), **FAOSTAT** (https://www.fao.org/faostat/), **World Bank**. Doplňkově Держстат, KSE Institute. Roky série = ~10 (cca 2015–2024 / poslední dostupný marketing year). Při neshodě USDA vs FAO preferovat USDA PSD a označit `asOf`. Pokud číslo nelze ozdrojovat → vynechat, NE hádat. Jednotky: produkce „млн т", plocha „млн га", export podíl „%". Texty ukrajinsky. **Tento task vyžaduje webový výzkum — implementer musí použít WebSearch/WebFetch a u každé hodnoty doložit zdroj v JSON.** Faktická správnost se navíc ověří samostatnou DATA verifikační bránou (adversariální review) po tomto tasku.

- [ ] **Step 1: Napsat strukturální test** — `tests/lib/statistiky-uk-data.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import data from '../../src/data/agro-stats-uk.json';
import type { StatistikyUkData } from '../../src/lib/statistiky-uk';

const d = data as unknown as StatistikyUkData;
const CROP_SLUGS = ['psenice', 'kukurice', 'slunecnice', 'jecmen'];

function assertAttrib(s: { asOf: string; source: string; url: string }) {
  expect(s.asOf.length).toBeGreaterThan(0);
  expect(s.source.length).toBeGreaterThan(0);
  expect(s.url.startsWith('http')).toBe(true);
}

describe('agro-stats-uk.json', () => {
  it('má všechny top-level klíče StatistikyUkData', () => {
    for (const k of ['generated', 'warCaveat', 'bigNumbers', 'crops', 'exportShare', 'facts', 'sources']) {
      expect(d).toHaveProperty(k);
    }
  });

  it('obsahuje přesně velkou čtyřku (správné slugy)', () => {
    expect(d.crops.map((c) => c.slug).sort()).toEqual([...CROP_SLUGS].sort());
  });

  it('každá plodina má grounded produkci i plochu s ≥2 body, roky vzestupně', () => {
    for (const c of d.crops) {
      for (const blk of [c.production, c.area]) {
        expect(blk.series.length).toBeGreaterThanOrEqual(2);
        assertAttrib(blk);
        const years = blk.series.map((p) => p.year);
        expect(years).toEqual([...years].sort((a, b) => a - b));
        for (const p of blk.series) expect(typeof p.value).toBe('number');
      }
      expect(c.name.length).toBeGreaterThan(0);
    }
  });

  it('bigNumbers a facts mají atribuci', () => {
    expect(d.bigNumbers.length).toBeGreaterThan(0);
    for (const b of d.bigNumbers) assertAttrib(b);
    for (const f of d.facts) assertAttrib(f);
  });

  it('exportShare má atribuci a neprázdné items s % v rozsahu 0–100', () => {
    assertAttrib(d.exportShare);
    expect(d.exportShare.items.length).toBeGreaterThan(0);
    for (const it of d.exportShare.items) {
      expect(it.pct).toBeGreaterThanOrEqual(0);
      expect(it.pct).toBeLessThanOrEqual(100);
    }
  });

  it('sources jsou neprázdné odkazy', () => {
    expect(d.sources.length).toBeGreaterThan(0);
    for (const s of d.sources) expect(s.url.startsWith('http')).toBe(true);
  });
});
```

- [ ] **Step 2: Vytvořit `src/data/agro-stats-uk.json`** — naplnit grounded daty dle tvaru níže (hodnoty = REÁLNÁ dohledaná čísla, ne tyto vzorové). Struktura (musí validovat typy z Tasku 2):

```jsonc
{
  "generated": "2026-06-17",
  "warCaveat": "<UA: чи включають дані тимчасово окуповані території; вплив війни з 2022 на врожай та експорт>",
  "bigNumbers": [
    { "val": "<#>", "unit": "<%>", "lbl": "<UA: напр. частка світового експорту соняшникової олії>",
      "sub": "<UA контекст>", "source": "USDA FAS PSD", "asOf": "<MY рік>", "url": "https://apps.fas.usda.gov/psdonline/" }
  ],
  "crops": [
    { "slug": "psenice", "name": "Пшениця",
      "production": { "unit": "млн т", "asOf": "<…>", "source": "USDA FAS PSD", "url": "https://apps.fas.usda.gov/psdonline/",
                      "max": 0, "ticks": [0], "series": [{ "year": 2015, "value": 0 }] },
      "area":       { "unit": "млн га", "asOf": "<…>", "source": "USDA FAS PSD", "url": "https://apps.fas.usda.gov/psdonline/",
                      "max": 0, "ticks": [0], "series": [{ "year": 2015, "value": 0 }] },
      "note": "<UA: 1–2 věty grounded>" },
    { "slug": "kukurice", "name": "Кукурудза", "production": { "...": "" }, "area": { "...": "" }, "note": "" },
    { "slug": "slunecnice", "name": "Соняшник", "production": { "...": "" }, "area": { "...": "" }, "note": "" },
    { "slug": "jecmen", "name": "Ячмінь", "production": { "...": "" }, "area": { "...": "" }, "note": "" }
  ],
  "exportShare": {
    "unit": "% світового експорту", "asOf": "<…>", "source": "USDA FAS PSD", "url": "https://apps.fas.usda.gov/psdonline/",
    "items": [ { "crop": "slunecnice", "label": "Соняшникова олія", "pct": 0 } ]
  },
  "facts": [ { "text": "<UA>", "source": "<…>", "asOf": "<…>", "url": "https://…" } ],
  "sources": [
    { "label": "USDA FAS PSD Online", "url": "https://apps.fas.usda.gov/psdonline/" },
    { "label": "FAOSTAT", "url": "https://www.fao.org/faostat/" }
  ]
}
```
Pozn.: `max` = vhodný strop osy (zaokrouhli nad maximum série), `ticks` = 3–5 dělení 0…max. `series` má ~10 ročních bodů. `…`/placeholdery v ukázce NAHRADIT reálnými daty; v JSON nesmí zůstat žádný `<…>` ani prázdný `"...": ""`.

- [ ] **Step 3: Validovat JSON + strukturu** — `source ~/.nvm/nvm.sh && nvm use 22 && node -e "JSON.parse(require('fs').readFileSync('src/data/agro-stats-uk.json','utf8')); console.log('JSON OK')"` poté `npx vitest run tests/lib/statistiky-uk-data.test.ts`. Expected: JSON OK + všechny testy PASS.

- [ ] **Step 4: Commit:**
```bash
git add src/data/agro-stats-uk.json tests/lib/statistiky-uk-data.test.ts
git commit -m "feat(uk-statistiky): grounded agro-stats-uk.json (velká čtyřka) + strukturální test"
```

---

## Task 4: i18n klíče `stat.uk.*`

**Files:**
- Modify: `src/i18n/ui/uk.ts`

- [ ] **Step 1: Přidat klíče** — do `src/i18n/ui/uk.ts` (vedle existujících `puda.uk.*`, plochá mapa řetězců). Vlož blok:

```ts
  'stat.uk.crumbHome': 'Головна',
  'stat.uk.crumbSelf': 'Аграрна статистика',
  'stat.uk.title': 'Аграрна статистика України — зерно та олійні',
  'stat.uk.desc': 'Виробництво, посівні площі та частка світового експорту ключових культур України: пшениця, кукурудза, соняшник, ячмінь.',
  'stat.uk.hero.kicker': 'СТАТИСТИКА · ДАТА-ОГЛЯД',
  'stat.uk.hero.h': 'Україна — світова <em>житниця</em>',
  'stat.uk.hero.lede': 'Виробництво, посівні площі та експортна вага головних культур України на основі даних USDA та FAO.',
  'stat.uk.h.plodiny': 'Культури: виробництво та площі',
  'stat.uk.h.export': 'Частка світового експорту',
  'stat.uk.h.fakta': 'Ключові факти',
  'stat.uk.production': 'Виробництво',
  'stat.uk.area': 'Посівна площа',
  'stat.uk.sourcePrefix': 'Джерело:',
  'stat.uk.asOfPrefix': 'Станом на:',
  'stat.uk.sources.h': 'Джерела даних',
  'stat.uk.cta.puda': 'Ринок землі в Україні →',
  'stat.uk.cta.slovnik': 'Аграрний словник →',
```

- [ ] **Step 2: Ověřit typecheck** — `source ~/.nvm/nvm.sh && nvm use 22 && npx astro check 2>&1 | grep -E "uk.ts|error" | head` (nebo `npm run build` — viz Task 6). Expected: žádná TS chyba na `uk.ts`. (Pokud projekt nemá `astro check` skript, přeskoč na build v Tasku 6.)

- [ ] **Step 3: Commit:**
```bash
git add src/i18n/ui/uk.ts
git commit -m "feat(uk-statistiky): i18n klíče stat.uk.*"
```

---

## Task 5: `StatistikyUk.astro` — izolovaný uk render

**Files:**
- Create: `src/components/statistiky/StatistikyUk.astro`

- [ ] **Step 1: Vytvořit komponentu** — `src/components/statistiky/StatistikyUk.astro`. Mirror PudaUk.astro vzoru (Layout, useTranslations('uk'), cache header, war-caveat, big-numbers se `bn-source`). Renderuje: hero → big-numbers → war-caveat → bloky velké čtyřky (produkce+plocha graf) → export podíl → fakta → zdroje → CTA. Obsah:

```astro
---
import Layout from '../../layouts/Layout.astro';
import DataSegmentNav from '../../components/DataSegmentNav.astro';
import { useTranslations, localizePath } from '../../i18n/utils';
import { buildLineChart, cropGrowthPct, type StatistikyUkData } from '../../lib/statistiky-uk';
import raw from '../../data/agro-stats-uk.json';

const d = raw as unknown as StatistikyUkData;
const t = useTranslations('uk');
Astro.response.headers.set('Cache-Control', 'public, max-age=600, s-maxage=86400, stale-while-revalidate=604800');

const charts = d.crops.map((c) => ({
  crop: c,
  production: buildLineChart(c.production.series, { max: c.production.max, ticks: c.production.ticks }),
  area: buildLineChart(c.area.series, { max: c.area.max, ticks: c.area.ticks }),
  growth: cropGrowthPct(c.production),
}));
const exportMax = d.exportShare.items.length ? Math.max(...d.exportShare.items.map((i) => i.pct)) : 100;
---

<Layout title={t('stat.uk.title')} description={t('stat.uk.desc')}>
  <div class="stat-uk-root">
    <DataSegmentNav active="statistiky" />

    <section class="su-hero">
      <span class="su-kicker">{t('stat.uk.hero.kicker')}</span>
      <h1 set:html={t('stat.uk.hero.h')}></h1>
      <p class="su-lede">{t('stat.uk.hero.lede')}</p>
    </section>

    {d.bigNumbers.length > 0 && (
      <section class="big-numbers">
        {d.bigNumbers.map((b) => (
          <div class="bn">
            <span class="bn-val">{b.val}{b.unit && <span class="bn-unit">{b.unit}</span>}</span>
            <span class="bn-lbl">{b.lbl}</span>
            <span class="bn-sub">{b.sub}</span>
            <a class="bn-source" href={b.url} target="_blank" rel="noopener noreferrer">{t('stat.uk.sourcePrefix')} {b.source} ({b.asOf})</a>
          </div>
        ))}
      </section>
    )}

    {d.warCaveat && <p class="war-caveat">⚠️ {d.warCaveat}</p>}

    <section id="plodiny" class="su-block">
      <h2>{t('stat.uk.h.plodiny')}</h2>
      {charts.map(({ crop, production, area, growth }) => (
        <div class="crop-card">
          <h3>{crop.name}{growth !== null && <span class="crop-growth"> ({growth > 0 ? '+' : ''}{growth} %)</span>}</h3>
          <p class="crop-note">{crop.note}</p>
          <div class="crop-charts">
            <figure>
              <figcaption>{t('stat.uk.production')} ({crop.production.unit})</figcaption>
              <svg viewBox={`0 0 ${production.w} ${production.h}`} class="line-chart" role="img" aria-label={`${crop.name} — ${t('stat.uk.production')}`}>
                <path d={production.area} class="lc-area" />
                <path d={production.path} class="lc-line" fill="none" />
              </svg>
              <a class="src" href={crop.production.url} target="_blank" rel="noopener noreferrer">{t('stat.uk.sourcePrefix')} {crop.production.source} ({crop.production.asOf})</a>
            </figure>
            <figure>
              <figcaption>{t('stat.uk.area')} ({crop.area.unit})</figcaption>
              <svg viewBox={`0 0 ${area.w} ${area.h}`} class="line-chart" role="img" aria-label={`${crop.name} — ${t('stat.uk.area')}`}>
                <path d={area.area} class="lc-area" />
                <path d={area.path} class="lc-line" fill="none" />
              </svg>
              <a class="src" href={crop.area.url} target="_blank" rel="noopener noreferrer">{t('stat.uk.sourcePrefix')} {crop.area.source} ({crop.area.asOf})</a>
            </figure>
          </div>
        </div>
      ))}
    </section>

    {d.exportShare.items.length > 0 && (
      <section id="export" class="su-block">
        <h2>{t('stat.uk.h.export')}</h2>
        <ul class="export-bars">
          {d.exportShare.items.map((i) => (
            <li>
              <span class="eb-label">{i.label}</span>
              <span class="eb-track"><span class="eb-fill" style={`width:${(i.pct / exportMax) * 100}%`}></span></span>
              <span class="eb-pct">{i.pct} {d.exportShare.unit}</span>
            </li>
          ))}
        </ul>
        <a class="src" href={d.exportShare.url} target="_blank" rel="noopener noreferrer">{t('stat.uk.sourcePrefix')} {d.exportShare.source} ({d.exportShare.asOf})</a>
      </section>
    )}

    {d.facts.length > 0 && (
      <section id="fakta" class="su-block">
        <h2>{t('stat.uk.h.fakta')}</h2>
        <ul class="facts">
          {d.facts.map((f) => (
            <li>{f.text} <a class="src" href={f.url} target="_blank" rel="noopener noreferrer">({f.source}, {f.asOf})</a></li>
          ))}
        </ul>
      </section>
    )}

    <section class="su-block sources">
      <h2>{t('stat.uk.sources.h')}</h2>
      <ul>
        {d.sources.map((s) => (<li><a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a></li>))}
      </ul>
    </section>

    <p class="su-cta">
      <a href={localizePath('uk', '/puda/')}>{t('stat.uk.cta.puda')}</a> ·
      <a href={localizePath('uk', '/slovnik/')}>{t('stat.uk.cta.slovnik')}</a>
    </p>
  </div>

  <style>
    .stat-uk-root { max-width: 980px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }
    .su-hero { margin: 1rem 0 1.6rem; }
    .su-kicker { display: inline-block; font-size: .8rem; letter-spacing: .08em; color: #15803d; font-weight: 700; }
    .su-hero h1 { font-size: 2rem; margin: .3rem 0 .6rem; }
    .su-hero h1 em { color: #15803d; font-style: normal; }
    .su-lede { color: #374151; font-size: 1.05rem; }
    .big-numbers { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1.4rem 0; }
    .bn { display: flex; flex-direction: column; gap: .15rem; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 10px; }
    .bn-val { font-size: 1.8rem; font-weight: 800; color: #166534; }
    .bn-unit { font-size: 1rem; font-weight: 600; margin-left: .15rem; }
    .bn-lbl { font-weight: 600; }
    .bn-sub { color: #6b7280; font-size: .85rem; }
    .bn-source, .src { color: #15803d; font-size: .75rem; text-decoration: none; }
    .war-caveat { background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: .7rem .9rem; color: #78350f; font-size: .9rem; }
    .su-block { margin: 2rem 0; }
    .su-block h2 { font-size: 1.35rem; margin-bottom: 1rem; }
    .crop-card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 1rem; margin-bottom: 1.2rem; }
    .crop-card h3 { font-size: 1.15rem; margin: 0 0 .3rem; }
    .crop-growth { color: #6b7280; font-size: .9rem; font-weight: 400; }
    .crop-note { color: #374151; font-size: .9rem; margin: 0 0 .8rem; }
    .crop-charts { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    @media (max-width: 640px) { .crop-charts { grid-template-columns: 1fr; } }
    .line-chart { width: 100%; height: auto; background: #f9fafb; border-radius: 6px; }
    .lc-area { fill: #bbf7d0; opacity: .5; }
    .lc-line { stroke: #15803d; stroke-width: 3; }
    figcaption { font-size: .85rem; font-weight: 600; color: #374151; margin-bottom: .3rem; }
    figure { margin: 0; }
    .export-bars { list-style: none; padding: 0; margin: 0; display: grid; gap: .6rem; }
    .export-bars li { display: grid; grid-template-columns: 160px 1fr auto; align-items: center; gap: .6rem; }
    .eb-track { background: #e5e7eb; border-radius: 999px; height: 14px; overflow: hidden; }
    .eb-fill { display: block; height: 100%; background: #15803d; border-radius: 999px; }
    .eb-pct { font-variant-numeric: tabular-nums; font-weight: 600; font-size: .85rem; }
    .facts { color: #374151; display: grid; gap: .5rem; padding-left: 1.1rem; }
    .sources ul { padding-left: 1.1rem; }
    .sources a { color: #15803d; }
    .su-cta { margin-top: 2rem; font-size: .95rem; }
    .su-cta a { color: #15803d; text-decoration: none; font-weight: 600; }
  </style>
</Layout>
```

Pozn.: `DataSegmentNav active="statistiky"` — ověř, že komponenta přijímá `active` prop s touto hodnotou (PudaUk používá `active="puda"`); pokud ne, vynech prop nebo použij existující hodnotu. `set:html` jen na i18n řetězec `stat.uk.hero.h` (vlastní `<em>`, ne uživatelská data). Ostatní data Astro auto-escapuje.

- [ ] **Step 2: Ověřit build** — `source ~/.nvm/nvm.sh && nvm use 22 && npm run build 2>&1 | grep -iE "StatistikyUk|error|Error" | head`. Expected: žádná chyba. (Komponenta se zatím nikde nepoužívá → zabuduje se až přes Task 6 gate; build musí projít i tak, protože je validní.)

- [ ] **Step 3: Commit:**
```bash
git add "src/components/statistiky/StatistikyUk.astro"
git commit -m "feat(uk-statistiky): izolovaná komponenta StatistikyUk.astro"
```

---

## Task 6: Route gate v `statistiky/index.astro` (aditivní) + build

**Files:**
- Modify: `src/pages/statistiky/index.astro`

- [ ] **Step 1: Přidat import** — k ostatním importům v `src/pages/statistiky/index.astro` (za poslední `import … from '../../components/statistiky/…'`):
```ts
import StatistikyUk from '../../components/statistiky/StatistikyUk.astro';
```

- [ ] **Step 2: Obalit existující `<Layout>…</Layout>` aditivní větví.** Najdi začátek renderu (`<Layout` na ř. ~135) a konec (`</Layout>` poblíž konce souboru). Bez jakékoli změny vnitřku obal celý `<Layout>…</Layout>` blok takto:
```astro
{locale === 'uk' ? <StatistikyUk /> : (
<Layout
  ... (PŮVODNÍ obsah beze změny) ...
</Layout>
)}
```
Tj. před původní `<Layout` vlož `{locale === 'uk' ? <StatistikyUk /> : (` a za původní `</Layout>` vlož `)}`. Vnitřní cs/sk JSX se NESMÍ nijak měnit (jen případné odsazení; rendered cs/sk HTML zůstává identické). `prerender = false` a celý frontmatter zůstávají beze změny.

- [ ] **Step 3: Ověřit build** — `source ~/.nvm/nvm.sh && nvm use 22 && npm run build 2>&1 | tail -4`. Expected: `[build] Complete!`, žádná chyba.

- [ ] **Step 4: Smoke — uk renderuje, cs/sk beze změny** (POZN.: `/uk/statistiky/` ještě NENÍ launchnuté → middleware ho zatím 302-uje na cs; uk render přes gate ověříme až po Tasku 7. Zde jen že build/cs/sk drží):
```bash
pkill -f 'dist/server/entry' 2>/dev/null; sleep 1
PORT=4403 HOST=127.0.0.1 node --env-file=.env dist/server/entry.mjs > /tmp/stat-gate.log 2>&1 &
sleep 4
echo "cs /statistiky/ 200 + má hexmap (čekáno >=1):"
curl -s -o /dev/null -w "%{http_code}\n" --max-time 15 "http://127.0.0.1:4403/statistiky/"
curl -s --max-time 15 "http://127.0.0.1:4403/statistiky/" | grep -c -iE "hexmap|kraj"
echo "sk /sk/statistiky/ 200:"
curl -s -o /dev/null -w "%{http_code}\n" --max-time 15 "http://127.0.0.1:4403/sk/statistiky/"
pkill -f 'dist/server/entry' 2>/dev/null
```
Expected: cs 200 + hexmap marker ≥1 (cs render nedotčen); sk 200.

- [ ] **Step 5: Commit:**
```bash
git add src/pages/statistiky/index.astro
git commit -m "feat(uk-statistiky): aditivní route gate locale==='uk' → StatistikyUk"
```

---

## Task 7: Launch prefix + finální verifikace (POSLEDNÍ)

**Files:**
- Modify: `src/i18n/utils.ts`

- [ ] **Step 1: Přidat `/statistiky` do `LAUNCHED_PREFIXES.uk`** — v `src/i18n/utils.ts` najdi `uk: [...]` a přidej `'/statistiky'`:
```ts
  uk: ['/stroje', '/srovnani', '/znacky', '/encyklopedie', '/jak-na-to', '/slovnik', '/puda', '/statistiky'],
```

- [ ] **Step 2: Build** — `source ~/.nvm/nvm.sh && nvm use 22 && npm run build 2>&1 | tail -3`. Expected: `[build] Complete!`.

- [ ] **Step 3: Plné testy** — `source ~/.nvm/nvm.sh && nvm use 22 && npx vitest run 2>&1 | tail -6`. Expected: nové testy (chart-line, statistiky-uk-lib, statistiky-uk-data) PASS; celkem **3 fail** (pre-existing bazar) + zbytek pass.

- [ ] **Step 4: Integrační smoke** — uk živě, cs/sk beze změny, sitemap, hreflang:
```bash
pkill -f 'dist/server/entry' 2>/dev/null; sleep 1
PORT=4403 HOST=127.0.0.1 node --env-file=.env dist/server/entry.mjs > /tmp/stat-final.log 2>&1 &
sleep 4
echo "uk /uk/statistiky/ 200:"; curl -s -o /dev/null -w "%{http_code}\n" --max-time 15 "http://127.0.0.1:4403/uk/statistiky/"
echo "uk má hero + plodiny (čekáno >=1):"; curl -s --max-time 15 "http://127.0.0.1:4403/uk/statistiky/" | grep -c -E "stat-uk-root|su-hero"
echo "uk NEobsahuje hexmap (čekáno 0):"; curl -s --max-time 15 "http://127.0.0.1:4403/uk/statistiky/" | grep -c -iE "hexmap|Karlovarský"
echo "uk self-canonical + hreflang uk:"; curl -s --max-time 15 "http://127.0.0.1:4403/uk/statistiky/" | grep -oE 'hreflang="uk"[^>]*|rel="canonical"[^>]*' | head
echo "cs /statistiky/ stále hexmap (čekáno >=1):"; curl -s --max-time 15 "http://127.0.0.1:4403/statistiky/" | grep -c -iE "hexmap|kraj"
echo "sk /sk/statistiky/ 200:"; curl -s -o /dev/null -w "%{http_code}\n" --max-time 15 "http://127.0.0.1:4403/sk/statistiky/"
echo "sitemap má /uk/statistiky:"; curl -s --max-time 15 "http://127.0.0.1:4403/sitemap.xml" | grep -c "/uk/statistiky"
pkill -f 'dist/server/entry' 2>/dev/null
```
Expected: uk 200, hero/plodiny marker ≥1, hexmap 0, hreflang uk + self-canonical přítomné, cs hexmap ≥1 (nedotčeno), sk 200, sitemap `/uk/statistiky` ≥1.

- [ ] **Step 5: Commit:**
```bash
git add src/i18n/utils.ts
git commit -m "feat(uk-statistiky): launch /statistiky pro uk (LAUNCHED_PREFIXES.uk) + sitemap/hreflang"
```

- [ ] **Step 6: (žádný další commit — hotovo, připraveno k DATA verifikační bráně + reconcile + PR via finishing-a-development-branch).**

---

## DATA verifikační brána (samostatný review po Tasku 3, před mergem)

Po naplnění `agro-stats-uk.json` (Task 3) spustit **adversariální DATA review** (opus + web), oddělený od code review:
- Každé číslo cross-checknout proti uvedenému `url` (USDA PSD / FAO / World Bank).
- USDA PSD vs FAOSTAT neshody: vyřešit nebo explicitně označit v `asOf`/`note`.
- `bigNumbers` (světové pozice/podíly) ověřit zvlášť — nejvyšší riziko nepravdivého tvrzení.
- Roky 2022+ (válka) ověřit, že čísla a `warCaveat` nejsou zavádějící.
- Výstup: seznam potvrzeno/oprav → implementer opraví → re-verify.

---

## Self-Review (provedeno při psaní plánu)

- **Spec coverage:** architektura izolace (T5+T6), `statistiky-uk.ts` typy+helper (T2), sdílená chart-math DRY (T1), `agro-stats-uk.json` grounded + struktura (T3), i18n (T4), launch+sitemap/hreflang (T7), cs/sk byte-identita (T6 smoke + T7 smoke: cs hexmap drží), velká čtyřka (T3 test), žádný hexmap pro uk (T7 smoke = 0), grounding source+asOf+url (T3 test + DATA brána). ✔
- **Placeholdery:** v plánu žádné; jediné `<…>` jsou v JSON UKÁZCE Tasku 3 s explicitní instrukcí nahradit reálnými grounded daty (a strukturální test + DATA brána to vynutí). ✔
- **Type consistency:** `StatistikyUkData`/`StatUkSeries`/`StatUkCrop`/`StatUkExportShare`/`cropGrowthPct`/`buildLineChart` konzistentní T2↔T3↔T5; `ChartSeriesPoint` z `chart-line.ts` (T1) = základ `StatUkSeriesPoint` (T2) i `PudaUkSeriesPoint` (re-export); i18n klíče `stat.uk.*` (T4) = ty konzumované v `StatistikyUk.astro` (T5). ✔
