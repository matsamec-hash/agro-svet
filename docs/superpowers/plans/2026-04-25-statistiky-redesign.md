# Statistiky Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Přepsat `/statistiky/` stránku z generického Chart.js dashboardu na story-driven, žluto-černou data stránku ve stylu `CategoryBrowse.astro` s wow vizualizacemi (sparkline ticker, annotated long-term graf, cenové nůžky scatter, hex mapa krajů, slope chart zvířat).

**Architecture:** Astro SSR (`prerender: true`), data fetched at build time z CZSO API, derived metrics v `src/lib/agro-derived.ts`, UI rozdělené do 11 Astro komponent v `src/components/statistiky/`. Žádný runtime fetch v browseru. Chart.js 4 + `chartjs-plugin-annotation` přes CDN (jako teď). Page entry je tenký orchestrátor (~80 řádků).

**Tech Stack:** Astro 6, Chart.js 4 (CDN), `chartjs-plugin-annotation` 3 (CDN), TypeScript, vitest pro lib testy, happy-dom test env.

**Spec:** [docs/superpowers/specs/2026-04-25-statistiky-redesign-design.md](../specs/2026-04-25-statistiky-redesign-design.md)

---

## File Structure

**New files:**
```
src/data/agro-events.ts                              — historical events (4 entries hardcoded)
src/lib/agro-derived.ts                              — derived metrics (5 funkcí)
src/components/statistiky/Hero.astro                 — sekce 1
src/components/statistiky/SparklineTicker.astro      — sekce 2 (sticky)
src/components/statistiky/AutoTakeaways.astro        — sekce 3
src/components/statistiky/PillsNav.astro             — sticky pills nav
src/components/statistiky/CommodityChart.astro       — sekce 4: annotated long-term
src/components/statistiky/InputsBlock.astro          — sekce 5a: PHM + hnojiva
src/components/statistiky/PriceScissors.astro        — sekce 5b: connected scatter
src/components/statistiky/ProductionBlock.astro      — sekce 6: sklizeň + plochy
src/components/statistiky/HexMap.astro               — sekce 7: hex mapa krajů
src/components/statistiky/LivestockSlope.astro       — sekce 8: slope chart
src/components/statistiky/StoryCards.astro           — sekce 9: 3 explainer karty
src/components/statistiky/MethodologyFooter.astro    — sekce 10: zdroje
src/components/statistiky/BottomCTA.astro            — sekce 11: žlutá CTA na /stroje/

tests/lib/agro-derived.test.ts                       — vitest unit testy
```

**Modified files:**
```
src/lib/czso.ts                                      — přidat getCommodityFullSeries() pro všech 9 komodit
src/pages/statistiky/index.astro                     — kompletní přepis (1169 → ~80 řádků orchestrátor)
```

**Decomposition rationale:** Každá Astro komponenta = jedna sekce stránky, samostatný interface (props), izolovaný CSS. Page index.astro = orchestrátor (data fetch + composition). Lib funkce = pure compute, testable bez DOM.

---

## Phase 1 — Datová vrstva (testovaná)

### Task 1: Hardcoded historical events

**Files:**
- Create: `src/data/agro-events.ts`

- [ ] **Step 1: Vytvoř soubor s events array**

```typescript
// src/data/agro-events.ts
export interface AgroEvent {
  date: string;          // ISO YYYY-MM (např. "2014-08")
  label: string;
  relevance: 'commodity' | 'livestock' | 'all';
}

// Historické události s dopadem na české zemědělství.
// Použito pro anotace v dlouhodobých grafech (CommodityChart, LivestockSlope).
export const AGRO_EVENTS: AgroEvent[] = [
  { date: '2004-05', label: 'ČR vstup do EU', relevance: 'all' },
  { date: '2014-08', label: 'Ruské embargo', relevance: 'commodity' },
  { date: '2015-04', label: 'Konec mléčných kvót', relevance: 'livestock' },
  { date: '2020-03', label: 'COVID-19', relevance: 'all' },
  { date: '2022-02', label: 'Invaze na Ukrajinu', relevance: 'commodity' },
  { date: '2024-08', label: 'Sucho v jižní Moravě', relevance: 'commodity' },
];

// Helper: vrací events relevantní pro daný typ grafu, filtruje podle časového okna grafu.
export function eventsInRange(
  events: AgroEvent[],
  fromDate: string,    // YYYY-MM
  toDate: string,      // YYYY-MM
  relevance: 'commodity' | 'livestock' | 'all'
): AgroEvent[] {
  return events.filter(e => {
    if (e.relevance !== 'all' && e.relevance !== relevance) return false;
    return e.date >= fromDate && e.date <= toDate;
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/data/agro-events.ts
git commit -m "feat(statistiky): add historical events data"
```

---

### Task 2: Derived metrics — `priceScissors()`

**Files:**
- Create: `src/lib/agro-derived.ts`
- Test: `tests/lib/agro-derived.test.ts`

- [ ] **Step 1: Napiš failing test**

```typescript
// tests/lib/agro-derived.test.ts
import { describe, it, expect } from 'vitest';
import { priceScissors } from '../../src/lib/agro-derived';

describe('priceScissors', () => {
  it('returns indexed series with base year = 100', () => {
    const commodities = [
      { name: 'Pšenice', month: 'leden 2015', price: 4000, unit: 'Kč/t' },
      { name: 'Pšenice', month: 'prosinec 2015', price: 4000, unit: 'Kč/t' },
      { name: 'Pšenice', month: 'leden 2016', price: 5000, unit: 'Kč/t' },
      { name: 'Pšenice', month: 'prosinec 2016', price: 5000, unit: 'Kč/t' },
    ];
    const fertilizers = [
      { name: 'NPK 15-15-15', year: '2015', price: 10000 },
      { name: 'NPK 15-15-15', year: '2016', price: 12000 },
    ];
    const fuels = [
      { fuel: 'Nafta', week: '1. týden 2015', price: 30 },
      { fuel: 'Nafta', week: '52. týden 2015', price: 30 },
      { fuel: 'Nafta', week: '1. týden 2016', price: 33 },
      { fuel: 'Nafta', week: '52. týden 2016', price: 33 },
    ];

    const result = priceScissors(commodities, fertilizers, fuels, 2015);
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ year: 2015, x: 100, y: 100 });
    // 2016: vstupy weighted avg (NPK +20%, nafta +10%) = +15%, výstupy (Pšenice +25%) = +25%
    expect(result[1].year).toBe(2016);
    expect(result[1].x).toBeCloseTo(115, 0);
    expect(result[1].y).toBe(125);
  });

  it('returns empty array if base year missing', () => {
    const result = priceScissors([], [], [], 2015);
    expect(result).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/matejsamec/agro-svet && npm test -- tests/lib/agro-derived.test.ts
```

Expected: FAIL with "Cannot find module '../../src/lib/agro-derived'"

- [ ] **Step 3: Vytvoř implementaci**

```typescript
// src/lib/agro-derived.ts
import type { CommodityPrice, FertilizerPrice, FuelPrice } from './czso';

const MONTH_LABELS = ['leden','únor','březen','duben','květen','červen','červenec','srpen','září','říjen','listopad','prosinec'];

function parseMonth(m: string): { month: number; year: number } | null {
  const parts = m.trim().split(' ');
  if (parts.length < 2) return null;
  const idx = MONTH_LABELS.indexOf(parts[0].toLowerCase());
  const year = parseInt(parts[1]);
  if (idx === -1 || isNaN(year)) return null;
  return { month: idx, year };
}

function parseWeekYear(w: string): number | null {
  const m = w.match(/\d+\.\s*týden\s+(\d+)/);
  return m ? parseInt(m[1]) : null;
}

function yearAverage<T>(items: T[], yearOf: (it: T) => number | null, valueOf: (it: T) => number): Map<number, number> {
  const buckets = new Map<number, { sum: number; count: number }>();
  for (const it of items) {
    const y = yearOf(it);
    if (y === null) continue;
    const v = valueOf(it);
    if (!isFinite(v)) continue;
    const b = buckets.get(y) ?? { sum: 0, count: 0 };
    b.sum += v;
    b.count += 1;
    buckets.set(y, b);
  }
  const avgs = new Map<number, number>();
  for (const [y, b] of buckets) avgs.set(y, b.sum / b.count);
  return avgs;
}

export interface PriceScissorsPoint {
  year: number;
  x: number; // index vstupů
  y: number; // index výstupů
}

// 4 hlavní komodity pro index výstupů
const OUTPUT_COMMODITIES = ['Pšenice', 'Ječmen', 'Řepka', 'Kukuřice'];
// Vstupy: hnojivo NPK + nafta, váha 50/50
const INPUT_FERTILIZER = 'NPK 15-15-15';
const INPUT_FUEL = 'Nafta';

export function priceScissors(
  commodities: CommodityPrice[],
  fertilizers: FertilizerPrice[],
  fuels: FuelPrice[],
  baseYear: number,
): PriceScissorsPoint[] {
  // Roční průměr výstupního koše: průměr 4 hlavních komodit, každá normalizovaná na svůj base-year průměr
  const outputCommodityYearAvgs = new Map<string, Map<number, number>>();
  for (const name of OUTPUT_COMMODITIES) {
    const avgs = yearAverage(
      commodities.filter(c => c.name === name),
      c => parseMonth(c.month)?.year ?? null,
      c => c.price,
    );
    outputCommodityYearAvgs.set(name, avgs);
  }
  // Index výstupů per rok = průměr (cena[year] / cena[base]) * 100 přes 4 komodity (jen pokud má base)
  const outputIndex = new Map<number, number>();
  // Sjednocení dostupných roků (mezi všemi 4 komoditami)
  const allYears = new Set<number>();
  outputCommodityYearAvgs.forEach(m => m.forEach((_, y) => allYears.add(y)));
  for (const year of allYears) {
    let sum = 0;
    let count = 0;
    for (const name of OUTPUT_COMMODITIES) {
      const avgs = outputCommodityYearAvgs.get(name)!;
      const base = avgs.get(baseYear);
      const cur = avgs.get(year);
      if (base && cur && base > 0) {
        sum += (cur / base) * 100;
        count += 1;
      }
    }
    if (count > 0) outputIndex.set(year, sum / count);
  }

  // Index vstupů per rok: 50% NPK + 50% nafta
  const fertAvgs = yearAverage(
    fertilizers.filter(f => f.name === INPUT_FERTILIZER),
    f => parseInt(f.year) || null,
    f => f.price,
  );
  const fuelAvgs = yearAverage(
    fuels.filter(f => f.fuel === INPUT_FUEL),
    f => parseWeekYear(f.week),
    f => f.price,
  );
  const inputIndex = new Map<number, number>();
  for (const year of allYears) {
    const fb = fertAvgs.get(baseYear);
    const fc = fertAvgs.get(year);
    const ub = fuelAvgs.get(baseYear);
    const uc = fuelAvgs.get(year);
    if (fb && fc && ub && uc) {
      const fertIdx = (fc / fb) * 100;
      const fuelIdx = (uc / ub) * 100;
      inputIndex.set(year, 0.5 * fertIdx + 0.5 * fuelIdx);
    }
  }

  // Spojit
  const points: PriceScissorsPoint[] = [];
  for (const year of [...allYears].sort((a, b) => a - b)) {
    const x = inputIndex.get(year);
    const y = outputIndex.get(year);
    if (x !== undefined && y !== undefined) {
      points.push({ year, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
    }
  }
  return points;
}
```

- [ ] **Step 4: Run test to verify pass**

```bash
cd /Users/matejsamec/agro-svet && npm test -- tests/lib/agro-derived.test.ts
```

Expected: PASS, both tests green.

- [ ] **Step 5: Commit**

```bash
git add src/lib/agro-derived.ts tests/lib/agro-derived.test.ts
git commit -m "feat(statistiky): add priceScissors derived metric"
```

---

### Task 3: Derived metrics — `fiveYearAverage()` + `biggestMomChange()`

**Files:**
- Modify: `src/lib/agro-derived.ts`
- Modify: `tests/lib/agro-derived.test.ts`

- [ ] **Step 1: Přidej failing testy**

Append do `tests/lib/agro-derived.test.ts`:

```typescript
import { fiveYearAverage, biggestMomChange } from '../../src/lib/agro-derived';

describe('fiveYearAverage', () => {
  it('computes rolling average of 60 months ending at given month', () => {
    // 60 měsíců s konstantní cenou 100, 61. měsíc je 200
    const prices = Array.from({ length: 60 }, (_, i) => ({
      name: 'Pšenice',
      month: `${MONTHS[i % 12]} ${2018 + Math.floor(i / 12)}`,
      price: 100,
      unit: 'Kč/t',
    }));
    prices.push({ name: 'Pšenice', month: 'leden 2023', price: 200, unit: 'Kč/t' });

    expect(fiveYearAverage(prices, 'leden 2023')).toBe(100);
    // pro prosinec 2022 (před skokem) = 100
    expect(fiveYearAverage(prices, 'prosinec 2022')).toBe(100);
  });

  it('returns null when fewer than 60 months available', () => {
    const prices = [{ name: 'Pšenice', month: 'leden 2023', price: 100, unit: 'Kč/t' }];
    expect(fiveYearAverage(prices, 'leden 2023')).toBeNull();
  });
});

const MONTHS = ['leden','únor','březen','duben','květen','červen','červenec','srpen','září','říjen','listopad','prosinec'];

describe('biggestMomChange', () => {
  it('finds commodity with largest abs month-over-month change', () => {
    const stats = [
      { name: 'Pšenice', price: 5200, change: 4.2, prevYearPrice: 5000, month: 'duben 2026', unit: 'Kč/t' },
      { name: 'Mléko', price: 9.85, change: -1.5, prevYearPrice: 10, month: 'duben 2026', unit: 'Kč/l' },
      { name: 'Vejce', price: 4.5, change: 12.0, prevYearPrice: 4, month: 'duben 2026', unit: 'Kč/ks' },
    ];
    const result = biggestMomChange(stats);
    expect(result?.name).toBe('Vejce');
    expect(result?.change).toBe(12.0);
  });

  it('returns null when no commodities have change', () => {
    expect(biggestMomChange([])).toBeNull();
  });
});
```

- [ ] **Step 2: Run test → expected FAIL**

```bash
npm test -- tests/lib/agro-derived.test.ts
```

Expected: FAIL — `fiveYearAverage` and `biggestMomChange` not exported.

- [ ] **Step 3: Implementuj**

Append do `src/lib/agro-derived.ts`:

```typescript
import type { CommodityStat } from './czso';

// Vrátí klouzavý 60-měsíční průměr cen komodity končící na měsíci `endMonth`.
// Vrátí null, pokud je v okně méně než 60 měsíců dat.
export function fiveYearAverage(prices: CommodityPrice[], endMonth: string): number | null {
  const target = parseMonth(endMonth);
  if (!target) return null;
  const targetKey = target.year * 12 + target.month;
  const window: number[] = [];
  for (const p of prices) {
    const d = parseMonth(p.month);
    if (!d) continue;
    const key = d.year * 12 + d.month;
    if (key <= targetKey && key > targetKey - 60) {
      window.push(p.price);
    }
  }
  if (window.length < 60) return null;
  return window.reduce((a, b) => a + b, 0) / window.length;
}

// Vrátí komoditu s největší absolutní hodnotou meziroční změny (`change`).
export function biggestMomChange(stats: CommodityStat[]): CommodityStat | null {
  let best: CommodityStat | null = null;
  for (const s of stats) {
    if (s.change === null) continue;
    if (!best || Math.abs(s.change) > Math.abs(best.change!)) best = s;
  }
  return best;
}
```

- [ ] **Step 4: Run test → PASS**

```bash
npm test -- tests/lib/agro-derived.test.ts
```

Expected: 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/agro-derived.ts tests/lib/agro-derived.test.ts
git commit -m "feat(statistiky): add fiveYearAverage and biggestMomChange"
```

---

### Task 4: Derived metrics — `inputCostInflation()` + `livestockMilestone()`

**Files:**
- Modify: `src/lib/agro-derived.ts`
- Modify: `tests/lib/agro-derived.test.ts`

- [ ] **Step 1: Přidej failing testy**

Append:

```typescript
import { inputCostInflation, livestockMilestone } from '../../src/lib/agro-derived';

describe('inputCostInflation', () => {
  it('returns percent change of latest year vs base year for given fertilizer', () => {
    const ferts = [
      { name: 'NPK 15-15-15', year: '2019', price: 10000 },
      { name: 'NPK 15-15-15', year: '2024', price: 13500 },
      { name: 'Močovina', year: '2019', price: 8000 },
    ];
    expect(inputCostInflation(ferts, 'NPK 15-15-15', 2019)).toBeCloseTo(35, 1);
  });

  it('returns null if base or latest year missing', () => {
    expect(inputCostInflation([], 'NPK 15-15-15', 2019)).toBeNull();
  });
});

describe('livestockMilestone', () => {
  it('detects when latest count is below threshold for first time in series', () => {
    const livestock = [
      { animal: 'Skot', count: 1500000, date: '1.1.2018' },
      { animal: 'Skot', count: 1400000, date: '1.1.2020' },
      { animal: 'Skot', count: 1280000, date: '1.1.2024' },
    ];
    const result = livestockMilestone(livestock, 'Skot', 1300000);
    expect(result).toMatchObject({ animal: 'Skot', breached: true });
  });

  it('returns null if threshold never breached', () => {
    const livestock = [{ animal: 'Skot', count: 1500000, date: '1.1.2024' }];
    expect(livestockMilestone(livestock, 'Skot', 1000000)).toBeNull();
  });
});
```

- [ ] **Step 2: Run test → FAIL**

```bash
npm test -- tests/lib/agro-derived.test.ts
```

- [ ] **Step 3: Implementuj**

Append do `src/lib/agro-derived.ts`:

```typescript
import type { LivestockStat } from './czso';

// Inflace vstupu: % změna ceny hnojiva v posledním dostupném roce vs. baseYear.
export function inputCostInflation(
  fertilizers: FertilizerPrice[],
  fertName: string,
  baseYear: number,
): number | null {
  const filtered = fertilizers
    .filter(f => f.name === fertName)
    .map(f => ({ year: parseInt(f.year), price: f.price }))
    .filter(f => !isNaN(f.year) && f.price > 0)
    .sort((a, b) => a.year - b.year);
  if (filtered.length === 0) return null;
  const base = filtered.find(f => f.year === baseYear);
  const latest = filtered[filtered.length - 1];
  if (!base || !latest) return null;
  return ((latest.price / base.price) - 1) * 100;
}

// Detekce "milníku": pokud poslední hodnota stavu zvířete poprvé klesla pod threshold.
export interface LivestockMilestone {
  animal: string;
  breached: boolean;
  latestCount: number;
  threshold: number;
}

export function livestockMilestone(
  livestock: LivestockStat[],
  animal: string,
  threshold: number,
): LivestockMilestone | null {
  const filtered = livestock.filter(l => l.animal === animal);
  if (filtered.length === 0) return null;
  const latest = filtered[filtered.length - 1];
  if (latest.count >= threshold) return null;
  return {
    animal,
    breached: true,
    latestCount: latest.count,
    threshold,
  };
}
```

- [ ] **Step 4: Run test → PASS**

```bash
npm test -- tests/lib/agro-derived.test.ts
```

Expected: 6 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/agro-derived.ts tests/lib/agro-derived.test.ts
git commit -m "feat(statistiky): add inputCostInflation and livestockMilestone"
```

---

### Task 5: Rozšířit `czso.ts` — full series pro všech 9 komodit

**Files:**
- Modify: `src/lib/czso.ts`

- [ ] **Step 1: Přidej `getCommodityFullSeries()`**

Append na konec [src/lib/czso.ts](../../src/lib/czso.ts) (před uzávěr souboru):

```typescript
// Vrací full historii pro všech 9 komodit z COMMODITY_MAP. Použito pro long-term annotated graf.
export async function getCommodityFullSeries(): Promise<CommodityTimeSeries[]> {
  const all = await getCommodityPrices();
  const byName = new Map<string, CommodityPrice[]>();
  for (const p of all) {
    if (!byName.has(p.name)) byName.set(p.name, []);
    byName.get(p.name)!.push(p);
  }

  const ALL_NAMES = ['Pšenice','Ječmen','Řepka','Kukuřice','Mléko','Vepřové','Hovězí','Vejce','Mák'];
  const results: CommodityTimeSeries[] = [];

  for (const name of ALL_NAMES) {
    const prices = byName.get(name);
    if (!prices || prices.length === 0) continue;
    const sorted = prices
      .map(p => {
        const d = parseMonthStr(p.month);
        if (!d) return null;
        return { label: `${MONTH_SHORT[d.month]} ${d.year}`, value: p.price, sortKey: d.year * 12 + d.month };
      })
      .filter(Boolean) as TimeSeriesPoint[];
    sorted.sort((a, b) => a.sortKey - b.sortKey);
    const unit = prices[0].unit;
    results.push({ name, unit, data: sorted });
  }
  return results;
}
```

- [ ] **Step 2: Smoke test — build proběhne**

```bash
cd /Users/matejsamec/agro-svet && npx tsc --noEmit
```

Expected: žádné TS errors v `src/lib/czso.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/czso.ts
git commit -m "feat(czso): add getCommodityFullSeries for all 9 commodities"
```

---

## Phase 2 — UI Komponenty

> **Vizuální QA pattern (per komponenta):** Každá Astro komponenta po vytvoření smoke-testovaná pomocí `npm run dev` + `curl localhost:4321/statistiky/ -o /dev/null -w "%{http_code}\n"`. V Phase 3 (po integraci) se vizuálně zkontroluje v browseru. Žádné unit testy pro Astro components — visual QA je v Phase 4.

### Task 6: Hero komponenta

**Files:**
- Create: `src/components/statistiky/Hero.astro`

- [ ] **Step 1: Vytvoř Hero.astro**

```astro
---
// src/components/statistiky/Hero.astro
interface Props {
  datasetCount: number;
  yearsCovered: number;
  regionCount: number;
  lastUpdated: string;
}
const { datasetCount, yearsCovered, regionCount, lastUpdated } = Astro.props;
---

<section class="sp-hero">
  <div class="sp-hero-left">
    <span class="sp-kicker"><span class="dot"></span>LIVE DATA · ČESKÁ ZEMĚDĚLSKÁ DATA</span>
    <h1>Co stojí české <em>zemědělství</em></h1>
    <p class="sp-hero-lede">
      Aktuální ceny komodit, sklizeň, vstupní náklady a regionální produkce
      z Českého statistického úřadu — každý měsíc aktualizovaná data.
    </p>
    <div class="sp-hero-stats">
      <div class="s"><span class="n">{datasetCount}</span><span class="l">datasetů</span></div>
      <div class="s"><span class="n">{yearsCovered}</span><span class="l">let</span></div>
      <div class="s"><span class="n">{regionCount}</span><span class="l">krajů</span></div>
    </div>
  </div>
  <div class="sp-hero-right">
    <div class="sp-hero-photo" style="background-image:url('/images/traktor.webp')">
      <div class="sp-hero-photo-badge">Aktualizováno {lastUpdated}</div>
    </div>
  </div>
</section>

<style>
  .sp-hero {
    --yellow:#FFEA00; --ink:#0A0A0B; --r-xl:24px;
    position:relative;overflow:hidden;color:#fff;border-radius:var(--r-xl);
    background:radial-gradient(600px 300px at 15% 20%, rgba(255,234,0,.18), transparent 60%),
      radial-gradient(700px 400px at 90% 90%, rgba(80,80,90,.4), transparent 60%),
      linear-gradient(135deg, #0E0E10 0%, #1C1C20 60%, #2A2A2F 100%);
    padding:48px 48px 40px;margin-bottom:22px;
    box-shadow:0 18px 40px -12px rgba(10,10,12,.18), 0 0 0 1px rgba(10,10,12,.04);
    display:grid;grid-template-columns:1.35fr 1fr;gap:32px;align-items:center;
  }
  .sp-hero::before{
    content:"";position:absolute;inset:0;pointer-events:none;opacity:.35;
    background-image:linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px);
    background-size:48px 48px;
    mask-image:radial-gradient(600px 400px at 70% 100%, black, transparent 70%);
  }
  .sp-hero-left{position:relative;z-index:2}
  .sp-kicker{
    display:inline-flex;align-items:center;gap:10px;
    font:600 11px/1 'Chakra Petch',sans-serif;letter-spacing:.22em;text-transform:uppercase;
    color:var(--yellow);margin-bottom:18px;
    padding:8px 14px;border:1px solid rgba(255,234,0,.4);border-radius:999px;
    background:rgba(255,234,0,.06);
  }
  .sp-kicker .dot{width:7px;height:7px;background:var(--yellow);border-radius:50%;
    box-shadow:0 0 0 3px rgba(255,234,0,.2);
    animation:sp-pulse 2s infinite;
  }
  @keyframes sp-pulse{0%,100%{opacity:1}50%{opacity:.5}}
  .sp-hero h1{
    font-family:'Chakra Petch',sans-serif;font-weight:700;
    font-size:clamp(2.2rem,5vw,4rem);color:#fff;line-height:.98;letter-spacing:-.03em;margin:0;
  }
  .sp-hero h1 em{font-style:normal;color:var(--yellow);text-shadow:0 0 40px rgba(255,234,0,.5)}
  .sp-hero-lede{max-width:560px;font-size:16.5px;color:#c8c8d0;margin:18px 0 22px;line-height:1.55}
  .sp-hero-stats{display:flex;gap:28px;flex-wrap:wrap;font-family:'Chakra Petch',sans-serif}
  .sp-hero-stats .s{display:flex;flex-direction:column;gap:3px}
  .sp-hero-stats .n{font-size:32px;font-weight:700;color:#fff;line-height:1;letter-spacing:-.02em}
  .sp-hero-stats .l{font-size:11px;color:#8a8a92;letter-spacing:.14em;text-transform:uppercase;font-weight:500}
  .sp-hero-stats .s + .s{padding-left:28px;border-left:1px solid rgba(255,255,255,.12)}

  .sp-hero-right{position:relative;z-index:1;min-height:300px;display:flex;align-items:center;justify-content:center}
  .sp-hero-photo{
    width:100%;height:100%;min-height:300px;
    background-size:cover;background-position:center;
    border-radius:18px;
    box-shadow:0 30px 60px -20px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.08);
    position:relative;overflow:hidden;
  }
  .sp-hero-photo::after{
    content:"";position:absolute;inset:0;
    background:linear-gradient(135deg, rgba(14,14,16,.1) 0%, transparent 40%, rgba(255,234,0,.12) 100%);
  }
  .sp-hero-photo-badge{
    position:absolute;left:16px;bottom:16px;z-index:2;
    background:rgba(10,10,11,.72);backdrop-filter:blur(10px);
    border:1px solid rgba(255,255,255,.1);
    color:#fff;padding:9px 13px;border-radius:10px;
    font:500 12px 'Chakra Petch',sans-serif;
  }

  @media (max-width:960px){
    .sp-hero{grid-template-columns:1fr;padding:32px 24px 28px;gap:18px}
    .sp-hero-right{min-height:200px;order:2}
    .sp-hero-photo{min-height:200px}
    .sp-hero-stats .s + .s{padding-left:0;border-left:0}
  }
</style>
```

- [ ] **Step 2: Smoke test (komponenta sama nestačí — bude testována až v Phase 3)**

(Skip — komponenta zatím není použita; Phase 3 ji integruje do indexu.)

- [ ] **Step 3: Commit**

```bash
git add src/components/statistiky/Hero.astro
git commit -m "feat(statistiky): add Hero component"
```

---

### Task 7: SparklineTicker komponenta

**Files:**
- Create: `src/components/statistiky/SparklineTicker.astro`

- [ ] **Step 1: Vytvoř SparklineTicker.astro**

```astro
---
// src/components/statistiky/SparklineTicker.astro
import type { TimeSeriesPoint } from '../../lib/czso';

export interface SparklineMetric {
  name: string;
  value: number;
  unit: string;
  changePct: number | null;     // m/m %
  series: TimeSeriesPoint[];    // 12 bodů, posledních 12 měsíců
  anchor: string;               // např. "#trh"
}

interface Props {
  metrics: SparklineMetric[];
}
const { metrics } = Astro.props;

function fmt(n: number): string {
  if (n >= 1000) return n.toLocaleString('cs-CZ', { maximumFractionDigits: 0 });
  return n.toLocaleString('cs-CZ', { maximumFractionDigits: 2 });
}

function buildSparklinePath(series: TimeSeriesPoint[], width: number, height: number): string {
  if (series.length < 2) return '';
  const values = series.map(s => s.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = width / (series.length - 1);
  return series
    .map((p, i) => {
      const x = i * stepX;
      const y = height - ((p.value - min) / range) * height;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}
---

<nav class="sp-ticker" aria-label="Aktuální ceny — rychlý přehled">
  {metrics.map(m => {
    const path = buildSparklinePath(m.series, 100, 24);
    const lastVal = m.series.length > 0 ? m.series[m.series.length - 1].value : m.value;
    const minVal = m.series.length > 0 ? Math.min(...m.series.map(s => s.value)) : m.value;
    const maxVal = m.series.length > 0 ? Math.max(...m.series.map(s => s.value)) : m.value;
    const range = maxVal - minVal || 1;
    const lastY = 24 - ((lastVal - minVal) / range) * 24;
    return (
      <a class="sp-ticker-card" href={m.anchor} aria-label={`${m.name}, ${fmt(m.value)} ${m.unit}, změna ${m.changePct ?? 0}%`}>
        <span class="sp-ticker-name">{m.name}</span>
        <span class="sp-ticker-value">{fmt(m.value)}<small> {m.unit}</small></span>
        {m.changePct !== null && (
          <span class={`sp-ticker-delta ${m.changePct >= 0 ? 'up' : 'down'}`}>
            {m.changePct >= 0 ? '▲' : '▼'} {Math.abs(m.changePct).toFixed(1)}%
          </span>
        )}
        {path && (
          <svg class="sp-ticker-spark" viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true">
            <path d={path} fill="none" stroke="#FFEA00" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="100" cy={lastY.toFixed(1)} r="1.8" fill="#FFEA00">
              <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
            </circle>
          </svg>
        )}
      </a>
    );
  })}
</nav>

<style>
  .sp-ticker {
    --yellow:#FFEA00; --ink:#0A0A0B; --line:#EAEAEC; --muted:#6B6B72;
    position:sticky;top:88px;z-index:30;
    background:rgba(255,255,255,.92);backdrop-filter:saturate(1.4) blur(14px);
    border:1px solid var(--line);border-radius:14px;
    padding:10px 14px;margin:0 0 22px;
    display:flex;gap:10px;overflow-x:auto;scrollbar-width:thin;
  }
  .sp-ticker-card {
    flex:1 1 160px;min-width:150px;
    display:grid;grid-template-rows:auto auto auto;gap:2px;padding:10px 12px;
    background:#fff;border:1px solid var(--line);border-radius:10px;
    text-decoration:none;color:var(--ink);
    transition:transform .15s, border-color .15s;
    position:relative;
  }
  .sp-ticker-card:hover{transform:translateY(-1px);border-color:var(--yellow)}
  .sp-ticker-name{font:500 11px 'Chakra Petch',sans-serif;color:var(--muted);letter-spacing:.04em;text-transform:uppercase}
  .sp-ticker-value{font:700 18px 'Chakra Petch',sans-serif;color:var(--ink);line-height:1.1}
  .sp-ticker-value small{font-size:10px;color:var(--muted);font-weight:500;margin-left:3px}
  .sp-ticker-delta{font:600 11px 'Chakra Petch',sans-serif;width:fit-content;padding:1px 6px;border-radius:6px}
  .sp-ticker-delta.up{color:#0B7A3B;background:rgba(11,122,59,.08)}
  .sp-ticker-delta.down{color:#C24414;background:rgba(194,68,20,.08)}
  .sp-ticker-spark{position:absolute;right:8px;top:30px;width:60px;height:24px;opacity:.85}

  @media (max-width:768px){
    .sp-ticker{top:72px}
    .sp-ticker-card{min-width:140px;flex:0 0 auto}
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/statistiky/SparklineTicker.astro
git commit -m "feat(statistiky): add SparklineTicker component"
```

---

### Task 8: AutoTakeaways komponenta

**Files:**
- Create: `src/components/statistiky/AutoTakeaways.astro`

- [ ] **Step 1: Vytvoř AutoTakeaways.astro**

```astro
---
// src/components/statistiky/AutoTakeaways.astro
export interface Takeaway {
  category: 'trh' | 'vstupy' | 'zvirata';
  title: string;       // např. "Pšenice"
  insight: string;     // např. "+4.2 % m/m, nejvíc od března 2022"
  anchor: string;      // např. "#trh"
}

interface Props {
  takeaways: Takeaway[];
}
const { takeaways } = Astro.props;

const ICONS = {
  trh: '📈',
  vstupy: '⚠️',
  zvirata: '🐄',
} as const;
const LABELS = {
  trh: 'TRH',
  vstupy: 'VSTUPY',
  zvirata: 'STAVY ZVÍŘAT',
} as const;
---

<section class="sp-takeaways" aria-labelledby="takeaways-h">
  <h2 id="takeaways-h" class="sp-section-h">Co dnes říkají data</h2>
  <div class="sp-takeaways-grid">
    {takeaways.map(t => (
      <a class={`sp-take-card cat-${t.category}`} href={t.anchor}>
        <span class="cat-label">{ICONS[t.category]} {LABELS[t.category]}</span>
        <h3>{t.title}</h3>
        <p>{t.insight}</p>
        <span class="cta">Detail →</span>
      </a>
    ))}
  </div>
</section>

<style>
  .sp-takeaways{margin:32px 0 28px}
  .sp-section-h{
    font-family:'Chakra Petch',sans-serif;font-weight:700;font-size:24px;letter-spacing:-.02em;
    color:#0A0A0B;margin:0 0 16px;
  }
  .sp-takeaways-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
  .sp-take-card{
    display:flex;flex-direction:column;gap:8px;
    background:#fff;border:1px solid #EAEAEC;border-left-width:4px;border-radius:14px;
    padding:18px 20px;text-decoration:none;color:#0A0A0B;
    transition:transform .15s, box-shadow .15s;
    box-shadow:0 1px 2px rgba(10,10,12,.04);
  }
  .sp-take-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px -6px rgba(10,10,12,.12)}
  .sp-take-card.cat-trh{border-left-color:#FFEA00}
  .sp-take-card.cat-vstupy{border-left-color:#C24414}
  .sp-take-card.cat-zvirata{border-left-color:#0B7A3B}
  .cat-label{
    font:600 11px 'Chakra Petch',sans-serif;letter-spacing:.18em;color:#6B6B72;
    display:inline-flex;align-items:center;gap:6px;
  }
  .sp-take-card h3{
    font-family:'Chakra Petch',sans-serif;font-weight:700;font-size:22px;letter-spacing:-.01em;margin:0;
  }
  .sp-take-card p{font-size:14px;color:#1E1E22;line-height:1.45;margin:0}
  .sp-take-card .cta{
    margin-top:auto;font:700 13px 'Chakra Petch',sans-serif;color:#0A0A0B;letter-spacing:.02em;
  }
  @media (max-width:960px){.sp-takeaways-grid{grid-template-columns:1fr}}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/statistiky/AutoTakeaways.astro
git commit -m "feat(statistiky): add AutoTakeaways component"
```

---

### Task 9: PillsNav komponenta (sticky)

**Files:**
- Create: `src/components/statistiky/PillsNav.astro`

- [ ] **Step 1: Vytvoř PillsNav.astro**

```astro
---
// src/components/statistiky/PillsNav.astro
interface Props {
  items: { label: string; href: string }[];
}
const { items } = Astro.props;
---

<nav class="sp-pills" aria-label="Sekce stránky">
  {items.map((it, i) => (
    <a class:list={['sp-pill', { active: i === 0 }]} href={it.href} data-href={it.href}>{it.label}</a>
  ))}
</nav>

<style>
  .sp-pills {
    --yellow:#FFEA00; --ink:#0A0A0B; --line:#EAEAEC; --bg:rgba(255,255,255,.92);
    position:sticky;top:152px;z-index:25;
    background:var(--bg);backdrop-filter:saturate(1.4) blur(14px);
    border:1px solid var(--line);border-radius:14px;
    padding:8px 12px;margin:0 0 28px;
    display:flex;gap:6px;flex-wrap:wrap;overflow-x:auto;
  }
  .sp-pill{
    display:inline-flex;align-items:center;padding:6px 14px;
    background:#fff;border:1px solid var(--line);border-radius:999px;
    font:500 13px 'Chakra Petch',sans-serif;color:var(--ink);text-decoration:none;
    transition:.15s;white-space:nowrap;
  }
  .sp-pill:hover{background:#FFF6A8;border-color:var(--yellow);transform:translateY(-1px)}
  .sp-pill.active{background:var(--ink);color:#fff;border-color:var(--ink)}

  @media (max-width:768px){.sp-pills{top:130px;flex-wrap:nowrap}}
</style>

<script>
  const pills = document.querySelectorAll<HTMLAnchorElement>('.sp-pills .sp-pill');
  const targets: HTMLElement[] = [];
  pills.forEach(p => {
    const id = p.dataset.href?.replace('#', '');
    if (!id) return;
    const el = document.getElementById(id);
    if (el) targets.push(el);
  });
  if (targets.length && 'IntersectionObserver' in window) {
    const byId = new Map<string, HTMLAnchorElement>();
    pills.forEach(p => {
      const id = p.dataset.href?.replace('#', '');
      if (id) byId.set(id, p);
    });
    const io = new IntersectionObserver(entries => {
      let topMost: { id: string; top: number } | null = null;
      entries.forEach(e => {
        if (e.isIntersecting) {
          const t = e.target as HTMLElement;
          const top = e.boundingClientRect.top;
          if (!topMost || top < topMost.top) topMost = { id: t.id, top };
        }
      });
      if (topMost) {
        pills.forEach(p => p.classList.remove('active'));
        const { id } = topMost as { id: string; top: number };
        byId.get(id)?.classList.add('active');
      }
    }, { rootMargin: '-200px 0px -60% 0px', threshold: 0 });
    targets.forEach(t => io.observe(t));
  }
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/statistiky/PillsNav.astro
git commit -m "feat(statistiky): add sticky PillsNav with IntersectionObserver"
```

---

### Task 10: CommodityChart komponenta (annotated long-term)

**Files:**
- Create: `src/components/statistiky/CommodityChart.astro`

- [ ] **Step 1: Vytvoř CommodityChart.astro**

```astro
---
// src/components/statistiky/CommodityChart.astro
import type { CommodityTimeSeries } from '../../lib/czso';
import type { AgroEvent } from '../../data/agro-events';

interface Props {
  series: CommodityTimeSeries[];   // všech 9 komodit s plnou historií
  events: AgroEvent[];             // historické anotace
  fiveYearAvg: Record<string, { label: string; avg: number }[] | null>; // klíč = jméno komodity
}
const { series, events, fiveYearAvg } = Astro.props;

const namedSeries = series.map(s => ({
  name: s.name,
  data: s.data.map(d => ({ label: d.label, value: d.value })),
  unit: s.unit,
}));
const default0 = namedSeries[0]?.name ?? 'Pšenice';
---

<section class="sp-section" id="trh">
  <header class="sp-section-head">
    <h2>Trh — Ceny komodit</h2>
    <span class="sp-section-sub">Měsíční průměry výrobců, anotované historickými událostmi</span>
  </header>

  <div class="sp-controls">
    <div class="sp-pills-row" role="tablist" aria-label="Komodita">
      {namedSeries.map((s, i) => (
        <button class:list={['sp-mini-pill', { active: i === 0 }]} data-commodity={s.name} type="button">{s.name}</button>
      ))}
    </div>
    <div class="sp-time-row" role="tablist" aria-label="Časové okno">
      <button class="sp-time-btn" data-window="1y" type="button">1 rok</button>
      <button class="sp-time-btn active" data-window="5y" type="button">5 let</button>
      <button class="sp-time-btn" data-window="all" type="button">Vše</button>
    </div>
  </div>

  <div class="sp-chart-card">
    <canvas id="commodityLongChart" height="320"></canvas>
    <div class="sp-chart-insight" id="commodityInsight"></div>
  </div>
</section>

<script type="application/json" id="commodityChartData" set:html={JSON.stringify({ series: namedSeries, events, fiveYearAvg, default0 })}></script>

<style>
  .sp-section{margin:32px 0 36px;scroll-margin-top:200px}
  .sp-section-head{margin-bottom:14px}
  .sp-section-head h2{font:700 24px 'Chakra Petch',sans-serif;letter-spacing:-.02em;margin:0;color:#0A0A0B}
  .sp-section-sub{display:block;font-size:13px;color:#6B6B72;margin-top:2px}
  .sp-controls{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:14px}
  .sp-pills-row{display:flex;gap:6px;flex-wrap:wrap}
  .sp-mini-pill{
    padding:6px 12px;background:#fff;border:1px solid #EAEAEC;border-radius:999px;
    font:500 13px 'Chakra Petch',sans-serif;color:#0A0A0B;cursor:pointer;
    transition:.15s;
  }
  .sp-mini-pill:hover{background:#FFF6A8;border-color:#FFEA00}
  .sp-mini-pill.active{background:#0A0A0B;color:#fff;border-color:#0A0A0B}
  .sp-time-row{display:flex;gap:4px;background:#F4F2E9;border-radius:999px;padding:3px}
  .sp-time-btn{
    padding:5px 12px;background:transparent;border:0;border-radius:999px;
    font:600 12px 'Chakra Petch',sans-serif;color:#6B6B72;cursor:pointer;
  }
  .sp-time-btn.active{background:#fff;color:#0A0A0B;box-shadow:0 1px 2px rgba(0,0,0,.06)}
  .sp-chart-card{
    background:#fff;border:1px solid #EAEAEC;border-radius:18px;padding:20px 22px;
    box-shadow:0 1px 2px rgba(10,10,12,.04);
  }
  .sp-chart-insight{
    margin-top:12px;padding:10px 14px;background:#FFF6A8;border-radius:10px;
    font:500 13px 'Chakra Petch',sans-serif;color:#0A0A0B;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/statistiky/CommodityChart.astro
git commit -m "feat(statistiky): add CommodityChart component shell"
```

(Chart inicializace bude v page indexu — viz Task 17.)

---

### Task 11: InputsBlock komponenta (PHM + hnojiva)

**Files:**
- Create: `src/components/statistiky/InputsBlock.astro`

- [ ] **Step 1: Vytvoř InputsBlock.astro**

```astro
---
// src/components/statistiky/InputsBlock.astro
import type { TimeSeriesPoint, FertilizerTimeSeries } from '../../lib/czso';

interface Props {
  fuelSeries: TimeSeriesPoint[];        // nafta, posledních 52 týdnů
  fertSeries: FertilizerTimeSeries[];   // 6 hnojiv, full history
}
const { fuelSeries, fertSeries } = Astro.props;
---

<section class="sp-section" id="vstupy">
  <header class="sp-section-head">
    <h2>Vstupy — Pohonné hmoty a hnojiva</h2>
    <span class="sp-section-sub">Týdenní cena nafty a roční ceny hnojiv</span>
  </header>

  <div class="sp-inputs-grid">
    <div class="sp-chart-card">
      <h3>Nafta — týdenní průměr (52 týdnů)</h3>
      <canvas id="fuelLongChart" height="220"></canvas>
    </div>
    <div class="sp-chart-card">
      <h3>Hnojiva — roční průměr (Kč/t)</h3>
      <canvas id="fertLongChart" height="220"></canvas>
    </div>
  </div>
</section>

<script type="application/json" id="inputsData" set:html={JSON.stringify({ fuelSeries, fertSeries })}></script>

<style>
  .sp-section{margin:32px 0 36px;scroll-margin-top:200px}
  .sp-section-head{margin-bottom:14px}
  .sp-section-head h2{font:700 24px 'Chakra Petch',sans-serif;letter-spacing:-.02em;margin:0;color:#0A0A0B}
  .sp-section-sub{display:block;font-size:13px;color:#6B6B72;margin-top:2px}
  .sp-inputs-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .sp-chart-card{
    background:#fff;border:1px solid #EAEAEC;border-radius:18px;padding:20px 22px;
    box-shadow:0 1px 2px rgba(10,10,12,.04);
  }
  .sp-chart-card h3{font:600 14px 'Chakra Petch',sans-serif;color:#1E1E22;margin:0 0 10px}
  @media (max-width:960px){.sp-inputs-grid{grid-template-columns:1fr}}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/statistiky/InputsBlock.astro
git commit -m "feat(statistiky): add InputsBlock component"
```

---

### Task 12: PriceScissors komponenta (connected scatter) ⭐

**Files:**
- Create: `src/components/statistiky/PriceScissors.astro`

- [ ] **Step 1: Vytvoř PriceScissors.astro**

```astro
---
// src/components/statistiky/PriceScissors.astro
import type { PriceScissorsPoint } from '../../lib/agro-derived';

interface Props {
  points: PriceScissorsPoint[];
  insight: string;   // generovaný text, např. "V 2022 vstupy +120%, výstupy +95% → marže -15%"
  baseYear: number;
}
const { points, insight, baseYear } = Astro.props;
---

<section class="sp-section" id="cenove-nuzky">
  <header class="sp-section-head">
    <h2>⚡ Cenové nůžky — vstupy × výstupy</h2>
    <span class="sp-section-sub">Index cen vstupů (nafta + NPK) vs. cen výstupů (4 hlavní komodity), {baseYear} = 100</span>
  </header>

  <div class="sp-chart-card">
    <canvas id="scissorsChart" height="380"></canvas>
    <div class="sp-chart-insight" data-tone="warn">⚠ {insight}</div>
    <p class="sp-chart-help">
      Spojnice ukazuje pohyb v čase. Pokud křivka uhne <strong>dolů-doprava</strong>,
      marže farmáře se zužuje (vstupy rostou rychleji než výstupy).
      Šedá diagonála = rovnováha.
    </p>
  </div>
</section>

<script type="application/json" id="scissorsData" set:html={JSON.stringify({ points })}></script>

<style>
  .sp-section{margin:32px 0 36px;scroll-margin-top:200px}
  .sp-section-head{margin-bottom:14px}
  .sp-section-head h2{font:700 24px 'Chakra Petch',sans-serif;letter-spacing:-.02em;margin:0;color:#0A0A0B}
  .sp-section-sub{display:block;font-size:13px;color:#6B6B72;margin-top:2px}
  .sp-chart-card{
    background:#fff;border:1px solid #EAEAEC;border-radius:18px;padding:24px 26px;
    box-shadow:0 1px 2px rgba(10,10,12,.04);
  }
  .sp-chart-insight{
    margin-top:14px;padding:12px 16px;border-radius:10px;
    font:500 13.5px 'Chakra Petch',sans-serif;
  }
  .sp-chart-insight[data-tone="warn"]{background:rgba(194,68,20,.08);color:#7A2A0E}
  .sp-chart-help{margin:10px 0 0;font-size:13px;color:#6B6B72;line-height:1.55}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/statistiky/PriceScissors.astro
git commit -m "feat(statistiky): add PriceScissors component"
```

---

### Task 13: ProductionBlock komponenta (sklizeň + plochy)

**Files:**
- Create: `src/components/statistiky/ProductionBlock.astro`

- [ ] **Step 1: Vytvoř ProductionBlock.astro**

```astro
---
// src/components/statistiky/ProductionBlock.astro
import type { CropProduction, CropArea } from '../../lib/czso';

interface Props {
  crops: CropProduction[];      // plný historický řez
  areas: CropArea[];
  latestYear: string;
}
const { crops, areas, latestYear } = Astro.props;

const latestCrops = crops.filter(c => c.year === latestYear);
const latestAreas = areas.filter(a => a.year === latestYear && a.crop !== 'Celkem');
const totalArea = areas.find(a => a.year === latestYear && a.crop === 'Celkem');
---

<section class="sp-section" id="produkce">
  <header class="sp-section-head">
    <h2>Produkce — sklizeň a osevní plochy {latestYear}</h2>
    <span class="sp-section-sub">Tuny / hektary v Česku</span>
  </header>

  <div class="sp-prod-grid">
    <div class="sp-chart-card">
      <h3>Sklizeň podle plodin (tun)</h3>
      <canvas id="cropProductionChart" height="280"></canvas>
    </div>
    <div class="sp-chart-card">
      <h3>Osevní plochy ({totalArea ? totalArea.hectares.toLocaleString('cs-CZ') : '–'} ha celkem)</h3>
      <canvas id="cropAreasChart" height="280"></canvas>
    </div>
  </div>
</section>

<script type="application/json" id="productionData" set:html={JSON.stringify({ latestCrops, latestAreas })}></script>

<style>
  .sp-section{margin:32px 0 36px;scroll-margin-top:200px}
  .sp-section-head{margin-bottom:14px}
  .sp-section-head h2{font:700 24px 'Chakra Petch',sans-serif;letter-spacing:-.02em;margin:0;color:#0A0A0B}
  .sp-section-sub{display:block;font-size:13px;color:#6B6B72;margin-top:2px}
  .sp-prod-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .sp-chart-card{
    background:#fff;border:1px solid #EAEAEC;border-radius:18px;padding:20px 22px;
    box-shadow:0 1px 2px rgba(10,10,12,.04);
  }
  .sp-chart-card h3{font:600 14px 'Chakra Petch',sans-serif;color:#1E1E22;margin:0 0 10px}
  @media (max-width:960px){.sp-prod-grid{grid-template-columns:1fr}}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/statistiky/ProductionBlock.astro
git commit -m "feat(statistiky): add ProductionBlock component"
```

---

### Task 14: HexMap komponenta

**Files:**
- Create: `src/components/statistiky/HexMap.astro`

- [ ] **Step 1: Vytvoř HexMap.astro**

```astro
---
// src/components/statistiky/HexMap.astro
import type { RegionCrop } from '../../lib/czso';

interface Props {
  data: RegionCrop[];   // všechna regional data, plný řez
}
const { data } = Astro.props;

// 14 hexů, hand-positioned grid. col/row se vytvářejí v 4-column flat-top hex grid.
// Pozice (col, row) navrženy tak, aby zhruba odpovídaly geografii ČR.
const HEX_LAYOUT: { region: string; col: number; row: number }[] = [
  { region: 'Karlovarský kraj',     col: 0, row: 1 },
  { region: 'Ústecký kraj',         col: 1, row: 0 },
  { region: 'Liberecký kraj',       col: 3, row: 0 },
  { region: 'Plzeňský kraj',        col: 1, row: 2 },
  { region: 'Středočeský kraj',     col: 2, row: 1 },
  { region: 'Hlavní město Praha',   col: 2, row: 1.5 },
  { region: 'Královéhradecký kraj', col: 3, row: 1 },
  { region: 'Pardubický kraj',      col: 4, row: 1 },
  { region: 'Jihočeský kraj',       col: 2, row: 3 },
  { region: 'Kraj Vysočina',        col: 3, row: 2 },
  { region: 'Olomoucký kraj',       col: 5, row: 1 },
  { region: 'Jihomoravský kraj',    col: 4, row: 3 },
  { region: 'Zlínský kraj',         col: 5, row: 2 },
  { region: 'Moravskoslezský kraj', col: 6, row: 1 },
];

const CROPS = ['Obiloviny na zrno','Pšenice','Ječmen','Řepka','Brambory','Řepa cukrová','Kukuřice na zeleno'];
const allYears = [...new Set(data.map(d => d.year))].sort();
const latestYear = allYears[allYears.length - 1];

// Generování hex pozic: flat-top hex, šířka 100, výška 86.6
const HEX_W = 110;
const HEX_H = 95;
const X_OFFSET = 60;
const Y_OFFSET = 60;
function hexCenter(col: number, row: number): { cx: number; cy: number } {
  const cx = X_OFFSET + col * (HEX_W * 0.75);
  const cy = Y_OFFSET + row * HEX_H + (col % 2 ? HEX_H / 2 : 0);
  return { cx, cy };
}
function hexPath(cx: number, cy: number, size = 50): string {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i;
    pts.push(`${(cx + size * Math.cos(a)).toFixed(1)},${(cy + size * Math.sin(a)).toFixed(1)}`);
  }
  return `M${pts.join(' L')} Z`;
}

const maxCol = Math.max(...HEX_LAYOUT.map(h => h.col));
const maxRow = Math.max(...HEX_LAYOUT.map(h => h.row));
const VB_W = X_OFFSET * 2 + maxCol * (HEX_W * 0.75) + HEX_W;
const VB_H = Y_OFFSET * 2 + (maxRow + 1) * HEX_H;
---

<section class="sp-section" id="regiony">
  <header class="sp-section-head">
    <h2>Regiony — produkce po krajích</h2>
    <span class="sp-section-sub">14 krajů, sklizeň v tunách. Klikněte na kraj pro detail.</span>
  </header>

  <div class="sp-map-controls">
    <div class="sp-pills-row" role="tablist">
      {CROPS.map((c, i) => (
        <button class:list={['sp-mini-pill', { active: i === 0 }]} data-crop={c} type="button">{c}</button>
      ))}
    </div>
    <div class="sp-year-row" role="tablist">
      {allYears.slice(-6).map((y, i, arr) => (
        <button class:list={['sp-year-btn', { active: i === arr.length - 1 }]} data-year={y} type="button">{y}</button>
      ))}
    </div>
  </div>

  <div class="sp-map-layout">
    <div class="sp-hex-container">
      <svg class="sp-hex-svg" viewBox={`0 0 ${VB_W.toFixed(0)} ${VB_H.toFixed(0)}`} role="img" aria-label="Hexagonová mapa krajů">
        {HEX_LAYOUT.map(({ region, col, row }) => {
          const { cx, cy } = hexCenter(col, row);
          return (
            <g class="hex-cell" data-region={region} role="button" tabindex="0" aria-label={region}>
              <path d={hexPath(cx, cy)} class="hex-shape" />
              <text x={cx} y={cy - 14} class="hex-region" text-anchor="middle">{region.replace(/ kraj$/, '').replace('Hlavní město ', '')}</text>
              <text x={cx} y={cy + 4} class="hex-value" text-anchor="middle"></text>
              <text x={cx} y={cy + 22} class="hex-unit" text-anchor="middle">tis. t</text>
              <rect x={cx - 30} y={cy + 28} width="60" height="4" rx="2" class="hex-bar-bg"/>
              <rect x={cx - 30} y={cy + 28} width="0" height="4" rx="2" class="hex-bar-fill"/>
            </g>
          );
        })}
      </svg>
      <div class="sp-hex-legend">
        <span>nízká</span>
        <div class="legend-grad"></div>
        <span>vysoká</span>
      </div>
    </div>
    <aside class="sp-hex-detail" id="hexDetail">
      <div class="placeholder">
        <span class="placeholder-icon">🗺️</span>
        <p>Vyberte kraj na mapě</p>
      </div>
    </aside>
  </div>
</section>

<script type="application/json" id="hexMapData" set:html={JSON.stringify({ data, defaultYear: latestYear })}></script>

<style>
  .sp-section{margin:32px 0 36px;scroll-margin-top:200px}
  .sp-section-head{margin-bottom:14px}
  .sp-section-head h2{font:700 24px 'Chakra Petch',sans-serif;letter-spacing:-.02em;margin:0;color:#0A0A0B}
  .sp-section-sub{display:block;font-size:13px;color:#6B6B72;margin-top:2px}
  .sp-map-controls{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:14px}
  .sp-pills-row{display:flex;gap:6px;flex-wrap:wrap}
  .sp-mini-pill{
    padding:6px 12px;background:#fff;border:1px solid #EAEAEC;border-radius:999px;
    font:500 13px 'Chakra Petch',sans-serif;color:#0A0A0B;cursor:pointer;transition:.15s;
  }
  .sp-mini-pill:hover{background:#FFF6A8;border-color:#FFEA00}
  .sp-mini-pill.active{background:#0A0A0B;color:#fff;border-color:#0A0A0B}
  .sp-year-row{display:flex;gap:4px;background:#F4F2E9;border-radius:999px;padding:3px}
  .sp-year-btn{
    padding:5px 12px;background:transparent;border:0;border-radius:999px;
    font:600 12px 'Chakra Petch',sans-serif;color:#6B6B72;cursor:pointer;
  }
  .sp-year-btn.active{background:#fff;color:#0A0A0B;box-shadow:0 1px 2px rgba(0,0,0,.06)}

  .sp-map-layout{display:grid;grid-template-columns:1.6fr 1fr;gap:18px;align-items:start}
  .sp-hex-container{
    background:#fff;border:1px solid #EAEAEC;border-radius:18px;padding:20px 22px;
    box-shadow:0 1px 2px rgba(10,10,12,.04);position:relative;
  }
  .sp-hex-svg{width:100%;height:auto;display:block}
  .hex-cell{cursor:pointer;transition:opacity .2s}
  .hex-cell:hover .hex-shape{stroke:#0A0A0B;stroke-width:2}
  .hex-cell.selected .hex-shape{stroke:#0A0A0B;stroke-width:3}
  .hex-shape{fill:#E3F3EA;stroke:#fff;stroke-width:1.5;transition:fill .3s}
  .hex-region{font:600 9px 'Chakra Petch',sans-serif;fill:#0A0A0B}
  .hex-value{font:700 14px 'Chakra Petch',sans-serif;fill:#0A0A0B}
  .hex-unit{font:500 8px 'Chakra Petch',sans-serif;fill:#6B6B72;letter-spacing:.06em}
  .hex-bar-bg{fill:rgba(0,0,0,.08)}
  .hex-bar-fill{fill:#FFEA00;transition:width .3s}

  .sp-hex-legend{
    display:flex;align-items:center;gap:8px;justify-content:flex-end;
    margin-top:8px;font:500 11px 'Chakra Petch',sans-serif;color:#6B6B72;
  }
  .sp-hex-legend .legend-grad{
    width:120px;height:8px;border-radius:4px;
    background:linear-gradient(90deg,#E3F3EA,#0B7A3B);
  }

  .sp-hex-detail{
    background:#fff;border:1px solid #EAEAEC;border-radius:18px;padding:20px 22px;
    box-shadow:0 1px 2px rgba(10,10,12,.04);min-height:300px;
  }
  .sp-hex-detail .placeholder{
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    gap:8px;padding:60px 0;color:#6B6B72;font:500 14px 'Chakra Petch',sans-serif;
  }
  .placeholder-icon{font-size:38px}

  @media (max-width:960px){.sp-map-layout{grid-template-columns:1fr}}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/statistiky/HexMap.astro
git commit -m "feat(statistiky): add HexMap component (replaces choropleth)"
```

---

### Task 15: LivestockSlope komponenta

**Files:**
- Create: `src/components/statistiky/LivestockSlope.astro`

- [ ] **Step 1: Vytvoř LivestockSlope.astro**

```astro
---
// src/components/statistiky/LivestockSlope.astro
import type { LivestockStat } from '../../lib/czso';

interface Props {
  livestock: LivestockStat[];   // celá historie (pokud k dispozici)
  insight: string;              // např. "Stav skotu klesl o 65 % od 1990"
  fromYear: number | null;      // rok začátku řady (může být null pokud data jen pár let)
}
const { livestock, insight, fromYear } = Astro.props;
---

<section class="sp-section" id="zvirata">
  <header class="sp-section-head">
    <h2>Zvířata — historický vývoj stavů</h2>
    <span class="sp-section-sub">{fromYear ? `Od roku ${fromYear} do dneška` : 'Dostupná pololetní data ČSÚ'}</span>
  </header>

  <div class="sp-chart-card">
    <canvas id="livestockSlopeChart" height="320"></canvas>
    <div class="sp-chart-insight" data-tone="info">📊 {insight}</div>
  </div>
</section>

<script type="application/json" id="livestockData" set:html={JSON.stringify({ livestock })}></script>

<style>
  .sp-section{margin:32px 0 36px;scroll-margin-top:200px}
  .sp-section-head{margin-bottom:14px}
  .sp-section-head h2{font:700 24px 'Chakra Petch',sans-serif;letter-spacing:-.02em;margin:0;color:#0A0A0B}
  .sp-section-sub{display:block;font-size:13px;color:#6B6B72;margin-top:2px}
  .sp-chart-card{
    background:#fff;border:1px solid #EAEAEC;border-radius:18px;padding:20px 22px;
    box-shadow:0 1px 2px rgba(10,10,12,.04);
  }
  .sp-chart-insight{
    margin-top:12px;padding:10px 14px;border-radius:10px;
    font:500 13px 'Chakra Petch',sans-serif;
  }
  .sp-chart-insight[data-tone="info"]{background:rgba(11,122,59,.08);color:#0B7A3B}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/statistiky/LivestockSlope.astro
git commit -m "feat(statistiky): add LivestockSlope component"
```

---

### Task 16: StoryCards komponenta

**Files:**
- Create: `src/components/statistiky/StoryCards.astro`

- [ ] **Step 1: Vytvoř StoryCards.astro**

```astro
---
// src/components/statistiky/StoryCards.astro
const STORIES = [
  {
    icon: '✂️',
    title: 'Cenové nůžky 2022–2025',
    teaser: 'Vstupy explodovaly, výstupy taky — ale poměr horší. Kdo zaplatil válku?',
    anchor: '#cenove-nuzky',
  },
  {
    icon: '🐄',
    title: 'Mizející kráva',
    teaser: '35 let úbytku skotu. Vstup do EU, mléčná krize — jak se příběh vyvíjel.',
    anchor: '#zvirata',
  },
  {
    icon: '🌾',
    title: 'Které kraje krmí Česko?',
    teaser: 'Vysočina pšenice, Polabí cukrovka. Kdo dělá co — interaktivní mapa.',
    anchor: '#regiony',
  },
];
---

<section class="sp-section" id="pribehy">
  <header class="sp-section-head">
    <h2>Příběhy v datech</h2>
    <span class="sp-section-sub">Vybrané narativy — co data vlastně říkají</span>
  </header>

  <div class="sp-stories-grid">
    {STORIES.map(s => (
      <a class="sp-story-card" href={s.anchor}>
        <span class="story-icon">{s.icon}</span>
        <h3>{s.title}</h3>
        <p>{s.teaser}</p>
        <span class="cta">Zobrazit graf →</span>
      </a>
    ))}
  </div>
</section>

<style>
  .sp-section{margin:32px 0 36px;scroll-margin-top:200px}
  .sp-section-head{margin-bottom:14px}
  .sp-section-head h2{font:700 24px 'Chakra Petch',sans-serif;letter-spacing:-.02em;margin:0;color:#0A0A0B}
  .sp-section-sub{display:block;font-size:13px;color:#6B6B72;margin-top:2px}
  .sp-stories-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
  .sp-story-card{
    display:flex;flex-direction:column;gap:10px;
    background:linear-gradient(135deg,#FBFAF4 0%,#fff 100%);
    border:1px solid #EAEAEC;border-radius:18px;padding:24px;
    text-decoration:none;color:#0A0A0B;
    transition:transform .15s, box-shadow .15s, border-color .15s;
  }
  .sp-story-card:hover{transform:translateY(-2px);box-shadow:0 12px 30px -10px rgba(10,10,12,.18);border-color:#FFEA00}
  .story-icon{font-size:32px}
  .sp-story-card h3{font:700 18px 'Chakra Petch',sans-serif;margin:0;letter-spacing:-.01em}
  .sp-story-card p{font-size:14px;color:#1E1E22;line-height:1.5;margin:0;flex:1}
  .sp-story-card .cta{font:700 13px 'Chakra Petch',sans-serif;color:#0A0A0B}
  @media (max-width:960px){.sp-stories-grid{grid-template-columns:1fr}}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/statistiky/StoryCards.astro
git commit -m "feat(statistiky): add StoryCards component"
```

---

### Task 17: MethodologyFooter + BottomCTA

**Files:**
- Create: `src/components/statistiky/MethodologyFooter.astro`
- Create: `src/components/statistiky/BottomCTA.astro`

- [ ] **Step 1: Vytvoř MethodologyFooter.astro**

```astro
---
// src/components/statistiky/MethodologyFooter.astro
interface Props { lastUpdated: string; }
const { lastUpdated } = Astro.props;
---

<section class="sp-method" id="metodologie">
  <h2>Metodologie & zdroje</h2>
  <p>
    Veškerá data pochází z otevřeného API
    <a href="https://data.csu.gov.cz" target="_blank" rel="noopener">Českého statistického úřadu</a>
    (DataStat). Stránka byla naposledy aktualizována <strong>{lastUpdated}</strong>.
  </p>
  <ul class="sp-method-list">
    <li><strong>Ceny komodit:</strong> CEN0203BT02 — měsíční průměry výrobců (Kč/t)</li>
    <li><strong>Pohonné hmoty:</strong> CENPHMTT01 — týdenní průměry (Kč/l)</li>
    <li><strong>Hnojiva:</strong> CEN0203ET03 — roční průměry (Kč/t)</li>
    <li><strong>Sklizeň:</strong> WZEM03AT01 — roční (t)</li>
    <li><strong>Osevní plochy:</strong> ZEM03CT01 — roční (ha)</li>
    <li><strong>Stavy zvířat:</strong> WZEM02AT01 — pololetní (ks)</li>
  </ul>
  <p class="note">
    Cenové nůžky a 5letý průměr jsou derivované metriky vypočtené v
    <code>src/lib/agro-derived.ts</code>. Historické anotace v grafech jsou
    vybrané manuálně dle relevance pro české zemědělství.
  </p>
</section>

<style>
  .sp-method{
    margin:40px 0 0;padding:24px 26px;
    background:#FBFAF4;border:1px solid #EAEAEC;border-radius:18px;
  }
  .sp-method h2{font:700 20px 'Chakra Petch',sans-serif;margin:0 0 10px;color:#0A0A0B}
  .sp-method p{font-size:14px;color:#1E1E22;line-height:1.55;margin:0 0 10px}
  .sp-method a{color:#0A0A0B;text-decoration:underline}
  .sp-method-list{list-style:none;padding:0;margin:0 0 14px;display:grid;grid-template-columns:1fr 1fr;gap:6px}
  .sp-method-list li{font-size:13px;color:#1E1E22}
  .sp-method-list strong{color:#0A0A0B}
  .sp-method .note{font-size:12.5px;color:#6B6B72}
  .sp-method code{font-family:ui-monospace,monospace;font-size:12px;background:#F4F2E9;padding:1px 5px;border-radius:4px}
  @media (max-width:768px){.sp-method-list{grid-template-columns:1fr}}
</style>
```

- [ ] **Step 2: Vytvoř BottomCTA.astro**

```astro
---
// src/components/statistiky/BottomCTA.astro
---

<section class="sp-bigcta">
  <div>
    <span class="cta-kicker">A co dál?</span>
    <h2>Hledáte zemědělskou techniku?<br/>Katalog traktorů a kombajnů.</h2>
    <p>10+ značek · 500+ modelů · technické parametry, výkon, ceny — kompletní encyklopedie.</p>
    <a class="cta-btn" href="/stroje/">
      Otevřít katalog
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
    </a>
  </div>
  <div class="cta-right">
    <div class="cta-photo" style="background-image:url('/images/traktor.webp')"></div>
  </div>
</section>

<style>
  .sp-bigcta{
    margin-top:32px;padding:36px;border-radius:24px;
    background:linear-gradient(135deg,#FFEA00 0%,#FFD400 100%);
    display:grid;grid-template-columns:1.4fr 1fr;gap:28px;align-items:center;
    position:relative;overflow:hidden;box-shadow:0 10px 30px -8px rgba(255,234,0,.35);
  }
  .sp-bigcta::before{
    content:"";position:absolute;inset:0;pointer-events:none;
    background:radial-gradient(400px 300px at 100% 100%, rgba(0,0,0,.12), transparent);
  }
  .sp-bigcta h2{font-family:'Chakra Petch',sans-serif;font-size:30px;line-height:1.05;letter-spacing:-.02em;position:relative;z-index:2;color:#0A0A0B;margin:0}
  .sp-bigcta p{color:#2a2a2a;margin-top:10px;font-size:15px;position:relative;z-index:2}
  .cta-kicker{
    display:inline-block;font:600 11px 'Chakra Petch',sans-serif;letter-spacing:.2em;text-transform:uppercase;
    color:#0A0A0B;background:rgba(0,0,0,.08);padding:6px 12px;border-radius:999px;margin-bottom:14px;position:relative;z-index:2;
  }
  .cta-btn{
    background:#0A0A0B;color:#fff;padding:15px 24px;border-radius:14px;text-decoration:none;
    font:700 14px 'Chakra Petch',sans-serif;letter-spacing:.04em;
    display:inline-flex;align-items:center;gap:10px;margin-top:18px;
    transition:.15s;position:relative;z-index:2;
  }
  .cta-btn:hover{transform:translateY(-2px);box-shadow:0 14px 30px -10px rgba(0,0,0,.4)}
  .cta-right{position:relative;z-index:2;min-height:200px;display:flex;align-items:center;justify-content:center}
  .cta-photo{
    width:100%;height:200px;border-radius:16px;
    background-size:cover;background-position:center;
    box-shadow:0 20px 40px -12px rgba(0,0,0,.3), 0 0 0 1px rgba(0,0,0,.1);
    position:relative;overflow:hidden;
  }
  .cta-photo::after{content:"";position:absolute;inset:0;background:linear-gradient(135deg,transparent 40%,rgba(0,0,0,.15))}
  @media (max-width:960px){.sp-bigcta{grid-template-columns:1fr;padding:28px}.cta-right{min-height:0}.cta-photo{height:180px}}
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/statistiky/MethodologyFooter.astro src/components/statistiky/BottomCTA.astro
git commit -m "feat(statistiky): add MethodologyFooter and BottomCTA"
```

---

## Phase 3 — Page integrace + Chart.js init

### Task 18: Přepsat `src/pages/statistiky/index.astro`

**Files:**
- Modify: `src/pages/statistiky/index.astro` (kompletní přepis 1169 → ~250 řádků)

- [ ] **Step 1: Přepiš celý soubor**

```astro
---
// src/pages/statistiky/index.astro
export const prerender = true;
import Layout from '../../layouts/Layout.astro';
import {
  getCommodityStats,
  getLatestFuelPrices,
  getLivestockStats,
  getCropProduction,
  getCropAreas,
  getFertilizerPrices,
  getCommodityFullSeries,
  getCommodityPrices,
  getFuelTimeSeries,
  getFuelPrices,
  getFertilizerTimeSeries,
  getRegionalCropData,
} from '../../lib/czso';
import {
  priceScissors,
  fiveYearAverage,
  biggestMomChange,
  inputCostInflation,
  livestockMilestone,
} from '../../lib/agro-derived';
import { AGRO_EVENTS } from '../../data/agro-events';

import Hero from '../../components/statistiky/Hero.astro';
import SparklineTicker from '../../components/statistiky/SparklineTicker.astro';
import AutoTakeaways from '../../components/statistiky/AutoTakeaways.astro';
import PillsNav from '../../components/statistiky/PillsNav.astro';
import CommodityChart from '../../components/statistiky/CommodityChart.astro';
import InputsBlock from '../../components/statistiky/InputsBlock.astro';
import PriceScissors from '../../components/statistiky/PriceScissors.astro';
import ProductionBlock from '../../components/statistiky/ProductionBlock.astro';
import HexMap from '../../components/statistiky/HexMap.astro';
import LivestockSlope from '../../components/statistiky/LivestockSlope.astro';
import StoryCards from '../../components/statistiky/StoryCards.astro';
import MethodologyFooter from '../../components/statistiky/MethodologyFooter.astro';
import BottomCTA from '../../components/statistiky/BottomCTA.astro';

const [
  commodityStats,
  latestFuels,
  livestock,
  crops,
  areas,
  fertilizers,
  commodityFull,
  commodityPrices,
  fuelSeries,
  fuelPrices,
  fertSeries,
  regional,
] = await Promise.all([
  getCommodityStats(),
  getLatestFuelPrices(),
  getLivestockStats(),
  getCropProduction(),
  getCropAreas(),
  getFertilizerPrices(),
  getCommodityFullSeries(),
  getCommodityPrices(),
  getFuelTimeSeries(52),
  getFuelPrices(),
  getFertilizerTimeSeries(),
  getRegionalCropData(),
]);

// Hero stats
const datasetCount = 6 + 1; // 6 hlavních + regional
const yearsCovered = (() => {
  const allYears = commodityFull.flatMap(s => s.data.map(d => d.label.split(' ')[1])).map(Number).filter(n => !isNaN(n));
  return allYears.length ? new Date().getFullYear() - Math.min(...allYears) + 1 : 14;
})();
const lastUpdated = new Date().toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

// Sparkline ticker — 5 metrik
function sparklineFor(name: string, months = 12): { label: string; value: number; sortKey: number }[] {
  const series = commodityFull.find(s => s.name === name)?.data ?? [];
  return series.slice(-months);
}
const psenice = commodityStats.find(s => s.name === 'Pšenice');
const repka = commodityStats.find(s => s.name === 'Řepka');
const mleko = commodityStats.find(s => s.name === 'Mléko');
const nafta = latestFuels.find(f => f.fuel === 'Nafta');
const npk = (() => {
  const last = fertSeries.find(f => f.name === 'NPK 15-15-15');
  if (!last || last.data.length < 2) return null;
  const ll = last.data[last.data.length - 1];
  const prev = last.data[last.data.length - 2];
  const ch = prev.price > 0 ? ((ll.price / prev.price) - 1) * 100 : null;
  return { name: 'NPK 15-15-15', price: ll.price, year: ll.year, change: ch };
})();

const sparkMetrics = [
  psenice && { name: 'Pšenice', value: psenice.price, unit: psenice.unit, changePct: psenice.change, series: sparklineFor('Pšenice'), anchor: '#trh' },
  repka && { name: 'Řepka', value: repka.price, unit: repka.unit, changePct: repka.change, series: sparklineFor('Řepka'), anchor: '#trh' },
  mleko && { name: 'Mléko', value: mleko.price, unit: mleko.unit, changePct: mleko.change, series: sparklineFor('Mléko'), anchor: '#trh' },
  nafta && { name: 'Nafta', value: nafta.price, unit: 'Kč/l', changePct: null, series: fuelSeries.slice(-12).map(p => ({ label: p.label, value: p.value, sortKey: p.sortKey })), anchor: '#vstupy' },
  npk && { name: 'NPK 15-15-15', value: npk.price, unit: 'Kč/t', changePct: npk.change, series: (fertSeries.find(f => f.name === 'NPK 15-15-15')?.data ?? []).slice(-12).map((d, i) => ({ label: d.year, value: d.price, sortKey: i })), anchor: '#vstupy' },
].filter(Boolean) as any[];

// Auto-takeaways
const big = biggestMomChange(commodityStats);
const inflPct = inputCostInflation(fertilizers, 'NPK 15-15-15', 2019);
const skotMile = livestockMilestone(livestock, 'Skot', 1300000);

const takeaways: { category: 'trh' | 'vstupy' | 'zvirata'; title: string; insight: string; anchor: string }[] = [];
if (big && big.change !== null && Math.abs(big.change) >= 1) {
  const dir = big.change >= 0 ? '+' : '';
  takeaways.push({
    category: 'trh',
    title: big.name,
    insight: `${dir}${big.change.toFixed(1)} % m/m. Aktuální cena ${big.price.toLocaleString('cs-CZ')} ${big.unit}.`,
    anchor: '#trh',
  });
} else if (psenice) {
  takeaways.push({
    category: 'trh',
    title: 'Pšenice',
    insight: `Aktuální cena ${psenice.price.toLocaleString('cs-CZ')} Kč/t (${psenice.month}).`,
    anchor: '#trh',
  });
}
if (inflPct !== null) {
  takeaways.push({
    category: 'vstupy',
    title: 'NPK 15-15-15',
    insight: `Stále ${inflPct >= 0 ? '+' : ''}${inflPct.toFixed(0)} % proti roku 2019. Cenové nůžky se ${inflPct > 30 ? 'zužují' : 'stabilizují'}.`,
    anchor: '#cenove-nuzky',
  });
} else {
  takeaways.push({
    category: 'vstupy',
    title: 'Hnojiva',
    insight: `Aktuální data v sekci Vstupy.`,
    anchor: '#vstupy',
  });
}
if (skotMile) {
  takeaways.push({
    category: 'zvirata',
    title: 'Skot',
    insight: `Stav pod ${(skotMile.threshold / 1e6).toFixed(1)} M kusů (aktuálně ${(skotMile.latestCount / 1e6).toFixed(2)} M).`,
    anchor: '#zvirata',
  });
} else {
  const skot = livestock.filter(l => l.animal === 'Skot').pop();
  takeaways.push({
    category: 'zvirata',
    title: 'Skot',
    insight: skot ? `Aktuálně ${skot.count.toLocaleString('cs-CZ')} ks (${skot.date}).` : 'Pololetní data ČSÚ.',
    anchor: '#zvirata',
  });
}

// Cenové nůžky
const BASE_YEAR = 2015;
const scissorsPoints = priceScissors(commodityPrices, fertilizers, fuelPrices, BASE_YEAR);
const scissorsInsight = (() => {
  if (scissorsPoints.length < 2) return 'Nedostatek dat pro výpočet cenových nůžek.';
  const last = scissorsPoints[scissorsPoints.length - 1];
  const margin = last.y - last.x;
  if (margin > 5) return `V ${last.year} výstupy ${last.y.toFixed(0)} vs. vstupy ${last.x.toFixed(0)} → marže pozitivní (+${margin.toFixed(0)} bodů).`;
  if (margin < -5) return `V ${last.year} vstupy ${last.x.toFixed(0)} > výstupy ${last.y.toFixed(0)} → marže negativní (${margin.toFixed(0)} bodů).`;
  return `V ${last.year} vstupy ${last.x.toFixed(0)}, výstupy ${last.y.toFixed(0)} → marže neutrální.`;
})();

// 5letý průměr per komodita (pro CommodityChart)
const fiveYearAvgs: Record<string, { label: string; avg: number }[] | null> = {};
for (const s of commodityFull) {
  const points: { label: string; avg: number }[] = [];
  for (const d of s.data) {
    // Najít odpovídající měsíc v commodityPrices
    const original = commodityPrices.find(p => p.name === s.name && (() => {
      const dd = d.label;
      // d.label je např. "Led 2024" — převést zpět na "leden 2024" a porovnat
      const SHORT2LONG: Record<string, string> = {
        'Led':'leden','Úno':'únor','Bře':'březen','Dub':'duben','Kvě':'květen','Čvn':'červen',
        'Čvc':'červenec','Srp':'srpen','Zář':'září','Říj':'říjen','Lis':'listopad','Pro':'prosinec'
      };
      const [shortM, year] = dd.split(' ');
      return p.month.startsWith(SHORT2LONG[shortM] ?? '') && p.month.endsWith(year);
    })());
    if (original) {
      const avg = fiveYearAverage(commodityPrices.filter(p => p.name === s.name), original.month);
      if (avg !== null) points.push({ label: d.label, avg });
    }
  }
  fiveYearAvgs[s.name] = points.length > 0 ? points : null;
}

// Latest year for production
const latestCropYear = (() => {
  const ys = [...new Set(crops.map(c => c.year))].sort();
  return ys[ys.length - 1] ?? '2023';
})();

// Livestock insight
const livestockInsight = (() => {
  const skot = livestock.filter(l => l.animal === 'Skot').sort((a, b) => a.date.localeCompare(b.date));
  if (skot.length < 2) return 'Pololetní data ČSÚ — viz graf níže.';
  const first = skot[0];
  const last = skot[skot.length - 1];
  const drop = ((last.count / first.count) - 1) * 100;
  return `Stav skotu: ${first.count.toLocaleString('cs-CZ')} → ${last.count.toLocaleString('cs-CZ')} ks (${drop.toFixed(0)} %).`;
})();
const livestockFromYear = (() => {
  const dates = livestock.map(l => parseInt(l.date.match(/\d{4}/)?.[0] ?? '0')).filter(n => n > 1900);
  return dates.length ? Math.min(...dates) : null;
})();

const PILLS = [
  { label: 'Trh', href: '#trh' },
  { label: 'Vstupy', href: '#vstupy' },
  { label: 'Cenové nůžky', href: '#cenove-nuzky' },
  { label: 'Produkce', href: '#produkce' },
  { label: 'Regiony', href: '#regiony' },
  { label: 'Zvířata', href: '#zvirata' },
  { label: 'Příběhy', href: '#pribehy' },
];
---

<Layout
  title="Zemědělské statistiky ČR — ceny, sklizeň, vstupní náklady"
  description="Aktuální data z Českého statistického úřadu — ceny komodit, vývoj cen vstupů, sklizeň, regionální produkce, stavy zvířat. Wow vizualizace s historickými anotacemi."
>
  <main class="sp-page">
    <Hero
      datasetCount={datasetCount}
      yearsCovered={yearsCovered}
      regionCount={14}
      lastUpdated={lastUpdated}
    />

    <SparklineTicker metrics={sparkMetrics} />

    <AutoTakeaways takeaways={takeaways} />

    <PillsNav items={PILLS} />

    <CommodityChart
      series={commodityFull}
      events={AGRO_EVENTS}
      fiveYearAvg={fiveYearAvgs}
    />

    <InputsBlock fuelSeries={fuelSeries} fertSeries={fertSeries} />

    <PriceScissors points={scissorsPoints} insight={scissorsInsight} baseYear={BASE_YEAR} />

    <ProductionBlock crops={crops} areas={areas} latestYear={latestCropYear} />

    <HexMap data={regional} />

    <LivestockSlope livestock={livestock} insight={livestockInsight} fromYear={livestockFromYear} />

    <StoryCards />

    <MethodologyFooter lastUpdated={lastUpdated} />

    <BottomCTA />
  </main>
</Layout>

<!-- Chart.js + annotation plugin from CDN -->
<script is:inline src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js"></script>
<script is:inline src="https://cdn.jsdelivr.net/npm/chartjs-plugin-annotation@3"></script>

<script is:inline>
  // ── Defaults ──
  Chart.defaults.font.family = "'Chakra Petch', sans-serif";
  Chart.defaults.font.size = 12;
  Chart.defaults.color = '#6B6B72';
  if (window['chartjs-plugin-annotation']) {
    Chart.register(window['chartjs-plugin-annotation']);
  }
  const YELLOW = '#FFEA00';
  const INK = '#0A0A0B';
  const RED = '#C24414';
  const GREEN = '#0B7A3B';
  const COLORS = [YELLOW, '#4ecdc4', '#ff6b6b', '#a29bfe', '#fd79a8', '#00b894', '#636e72', '#e17055', '#74b9ff'];

  // ── Helper: parse "Led 2024" → sortable index
  const SHORT_MONTHS = ['Led','Úno','Bře','Dub','Kvě','Čvn','Čvc','Srp','Zář','Říj','Lis','Pro'];
  function labelToIndex(label) {
    const [m, y] = label.split(' ');
    return parseInt(y) * 12 + SHORT_MONTHS.indexOf(m);
  }
  function indexToLabel(idx) {
    return `${SHORT_MONTHS[idx % 12]} ${Math.floor(idx / 12)}`;
  }

  // ──────────── COMMODITY CHART ────────────
  (function initCommodityChart() {
    const el = document.getElementById('commodityLongChart');
    const dataEl = document.getElementById('commodityChartData');
    if (!el || !dataEl) return;
    const { series, events, fiveYearAvg, default0 } = JSON.parse(dataEl.textContent);

    let currentName = default0;
    let currentWindow = '5y';

    function buildAnnotations(labels) {
      const anns = {};
      const labelSet = new Set(labels);
      events.forEach((ev, i) => {
        // ev.date "YYYY-MM" → "Mmm YYYY"
        const [yy, mm] = ev.date.split('-').map(Number);
        const lbl = `${SHORT_MONTHS[mm - 1]} ${yy}`;
        if (!labelSet.has(lbl)) return;
        anns['ev' + i] = {
          type: 'line',
          xMin: lbl,
          xMax: lbl,
          borderColor: 'rgba(10,10,11,.35)',
          borderWidth: 1,
          borderDash: [4, 4],
          label: {
            display: true,
            content: ev.label,
            position: 'start',
            backgroundColor: 'rgba(255,234,0,.92)',
            color: '#0A0A0B',
            font: { size: 10, weight: 600 },
            padding: 4,
            yAdjust: -2,
          },
        };
      });
      return anns;
    }

    function filterByWindow(data, w) {
      if (w === 'all') return data;
      const months = w === '1y' ? 12 : 60;
      return data.slice(-months);
    }

    let chart = null;
    function render() {
      const s = series.find(x => x.name === currentName);
      if (!s) return;
      const filtered = filterByWindow(s.data, currentWindow);
      const labels = filtered.map(d => d.label);

      // 5letý průměr odpovídající labels
      const avgs = (fiveYearAvg[currentName] || []).filter(p => labels.includes(p.label));
      const avgMap = new Map(avgs.map(p => [p.label, p.avg]));
      const avgLine = labels.map(l => avgMap.get(l) ?? null);

      const datasets = [
        {
          label: currentName,
          data: filtered.map(d => d.value),
          borderColor: YELLOW,
          backgroundColor: 'rgba(255,234,0,.12)',
          borderWidth: 2.5,
          pointRadius: 0,
          pointHoverRadius: 5,
          tension: 0.35,
          fill: true,
        },
      ];
      if (avgLine.some(v => v !== null)) {
        datasets.push({
          label: '5letý průměr',
          data: avgLine,
          borderColor: 'rgba(107,107,114,.6)',
          borderWidth: 1.5,
          borderDash: [3, 3],
          pointRadius: 0,
          tension: 0.3,
          fill: false,
        });
      }

      const cfg = {
        type: 'line',
        data: { labels, datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { position: 'top', labels: { usePointStyle: true, padding: 14, font: { size: 12 } } },
            tooltip: {
              backgroundColor: INK, titleFont: { size: 13 }, bodyFont: { size: 13 },
              padding: 12, cornerRadius: 10,
              callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString('cs-CZ')} ${s.unit}` },
            },
            annotation: { annotations: buildAnnotations(labels) },
          },
          scales: {
            x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 12, font: { size: 11 } } },
            y: { grid: { color: 'rgba(10,10,12,.06)' }, ticks: { callback: v => v.toLocaleString('cs-CZ') } },
          },
        },
      };
      if (chart) chart.destroy();
      chart = new Chart(el, cfg);

      // Insight text pod grafem
      const insightEl = document.getElementById('commodityInsight');
      if (insightEl) {
        const last = filtered[filtered.length - 1];
        const avg = avgMap.get(last?.label);
        if (last && avg) {
          const diff = ((last.value / avg) - 1) * 100;
          insightEl.textContent = `Aktuální hodnota ${last.value.toLocaleString('cs-CZ')} ${s.unit} ${diff >= 0 ? '+' : ''}${diff.toFixed(1)} % vs. 5letý průměr.`;
        } else {
          insightEl.textContent = `Aktuálně ${last?.value.toLocaleString('cs-CZ') ?? '–'} ${s.unit}.`;
        }
      }
    }

    document.querySelectorAll('.sp-mini-pill[data-commodity]').forEach(b => {
      b.addEventListener('click', () => {
        document.querySelectorAll('.sp-mini-pill[data-commodity]').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        currentName = b.dataset.commodity;
        render();
      });
    });
    document.querySelectorAll('.sp-time-btn').forEach(b => {
      b.addEventListener('click', () => {
        document.querySelectorAll('.sp-time-btn').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        currentWindow = b.dataset.window;
        render();
      });
    });

    render();
  })();

  // ──────────── INPUTS BLOCK ────────────
  (function initInputs() {
    const dataEl = document.getElementById('inputsData');
    if (!dataEl) return;
    const { fuelSeries, fertSeries } = JSON.parse(dataEl.textContent);

    const fuelEl = document.getElementById('fuelLongChart');
    if (fuelEl && fuelSeries.length) {
      new Chart(fuelEl, {
        type: 'line',
        data: {
          labels: fuelSeries.map(d => d.label),
          datasets: [{
            label: 'Nafta (Kč/l)',
            data: fuelSeries.map(d => d.value),
            borderColor: RED,
            backgroundColor: 'rgba(194,68,20,.08)',
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.3,
            fill: true,
          }],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { backgroundColor: INK, padding: 12, cornerRadius: 10,
              callbacks: { label: ctx => `${ctx.parsed.y.toFixed(2)} Kč/l` } },
          },
          scales: {
            x: { grid: { display: false }, ticks: { maxTicksLimit: 12, font: { size: 10 } } },
            y: { grid: { color: 'rgba(10,10,12,.06)' }, ticks: { callback: v => v + ' Kč' } },
          },
        },
      });
    }

    const fertEl = document.getElementById('fertLongChart');
    if (fertEl && fertSeries.length) {
      const years = fertSeries[0].data.map(d => d.year);
      new Chart(fertEl, {
        type: 'line',
        data: {
          labels: years,
          datasets: fertSeries.map((s, i) => ({
            label: s.name,
            data: s.data.map(d => d.price),
            borderColor: COLORS[i % COLORS.length],
            borderWidth: 2,
            pointRadius: 2,
            tension: 0.3,
            fill: false,
          })),
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { position: 'top', labels: { usePointStyle: true, padding: 10, font: { size: 11 }, boxWidth: 10 } },
            tooltip: { backgroundColor: INK, padding: 12, cornerRadius: 10,
              callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString('cs-CZ')} Kč/t` } },
          },
          scales: {
            x: { grid: { display: false } },
            y: { grid: { color: 'rgba(10,10,12,.06)' }, ticks: { callback: v => (v / 1000).toFixed(0) + ' tis' } },
          },
        },
      });
    }
  })();

  // ──────────── PRICE SCISSORS ────────────
  (function initScissors() {
    const dataEl = document.getElementById('scissorsData');
    const el = document.getElementById('scissorsChart');
    if (!dataEl || !el) return;
    const { points } = JSON.parse(dataEl.textContent);
    if (!points.length) return;

    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    const min = Math.min(...xs, ...ys, 80);
    const max = Math.max(...xs, ...ys, 200);

    new Chart(el, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Roky',
            data: points.map(p => ({ x: p.x, y: p.y, year: p.year })),
            backgroundColor: YELLOW,
            borderColor: INK,
            borderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 9,
            showLine: true,
            tension: 0.0,
          },
          // Diagonála (rovnováha)
          {
            label: 'Rovnováha (vstupy = výstupy)',
            data: [{ x: min, y: min }, { x: max, y: max }],
            borderColor: 'rgba(107,107,114,.4)',
            borderWidth: 1,
            borderDash: [4, 4],
            pointRadius: 0,
            showLine: true,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: INK, padding: 12, cornerRadius: 10,
            callbacks: {
              title: ctx => ctx[0].raw?.year ? `Rok ${ctx[0].raw.year}` : '',
              label: ctx => ctx.raw.year !== undefined
                ? `Vstupy: ${ctx.parsed.x.toFixed(0)} · Výstupy: ${ctx.parsed.y.toFixed(0)}`
                : '',
            },
          },
          annotation: {
            annotations: Object.fromEntries(points.map((p, i) => [
              'pt' + i,
              { type: 'label', xValue: p.x, yValue: p.y, content: String(p.year), font: { size: 10, weight: 600 }, color: INK, yAdjust: -16 },
            ])),
          },
        },
        scales: {
          x: { type: 'linear', title: { display: true, text: 'Index cen vstupů (nafta + NPK)', font: { size: 12 } }, grid: { color: 'rgba(10,10,12,.06)' } },
          y: { type: 'linear', title: { display: true, text: 'Index cen výstupů (4 hlavní komodity)', font: { size: 12 } }, grid: { color: 'rgba(10,10,12,.06)' } },
        },
      },
    });
  })();

  // ──────────── PRODUCTION BLOCK ────────────
  (function initProduction() {
    const dataEl = document.getElementById('productionData');
    if (!dataEl) return;
    const { latestCrops, latestAreas } = JSON.parse(dataEl.textContent);

    const cropEl = document.getElementById('cropProductionChart');
    if (cropEl && latestCrops.length) {
      const sorted = [...latestCrops].sort((a, b) => b.tonnes - a.tonnes);
      new Chart(cropEl, {
        type: 'bar',
        data: {
          labels: sorted.map(c => c.crop),
          datasets: [{
            data: sorted.map(c => c.tonnes),
            backgroundColor: sorted.map((_, i) => COLORS[i % COLORS.length] + 'cc'),
            borderRadius: 6, barThickness: 26,
          }],
        },
        options: {
          indexAxis: 'y', responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { backgroundColor: INK, padding: 12, cornerRadius: 10,
              callbacks: { label: ctx => `${ctx.parsed.x.toLocaleString('cs-CZ')} t` } },
          },
          scales: {
            x: { grid: { color: 'rgba(10,10,12,.06)' }, ticks: { callback: v => (v / 1e6).toFixed(1) + 'M t' } },
            y: { grid: { display: false }, ticks: { font: { size: 13 } } },
          },
        },
      });
    }

    const areaEl = document.getElementById('cropAreasChart');
    if (areaEl && latestAreas.length) {
      new Chart(areaEl, {
        type: 'doughnut',
        data: {
          labels: latestAreas.map(a => a.crop),
          datasets: [{
            data: latestAreas.map(a => a.hectares),
            backgroundColor: latestAreas.map((_, i) => COLORS[i % COLORS.length]),
            borderWidth: 0, hoverOffset: 8,
          }],
        },
        options: {
          responsive: true, maintainAspectRatio: false, cutout: '62%',
          plugins: {
            legend: { position: 'bottom', labels: { usePointStyle: true, padding: 12, font: { size: 12 } } },
            tooltip: { backgroundColor: INK, padding: 12, cornerRadius: 10,
              callbacks: { label: ctx => `${ctx.label}: ${ctx.parsed.toLocaleString('cs-CZ')} ha` } },
          },
        },
      });
    }
  })();

  // ──────────── HEX MAP ────────────
  (function initHexMap() {
    const dataEl = document.getElementById('hexMapData');
    const svg = document.querySelector('.sp-hex-svg');
    if (!dataEl || !svg) return;
    const { data, defaultYear } = JSON.parse(dataEl.textContent);

    let currentCrop = 'Obiloviny na zrno';
    let currentYear = defaultYear;
    let selectedRegion = null;

    function getColor(t) {
      // light → dark green: rgb(227,243,234) → rgb(11,122,59)
      const r = Math.round(227 - t * 216);
      const g = Math.round(243 - t * 121);
      const b = Math.round(234 - t * 175);
      return `rgb(${r},${g},${b})`;
    }

    function colorMap() {
      const filtered = data.filter(d => d.crop === currentCrop && d.year === currentYear);
      const valByRegion = {};
      filtered.forEach(d => { valByRegion[d.region] = d.tonnes; });
      const vals = Object.values(valByRegion).filter(v => v > 0);
      const min = vals.length ? Math.min(...vals) : 0;
      const max = vals.length ? Math.max(...vals) : 1;
      const range = max - min || 1;

      svg.querySelectorAll('.hex-cell').forEach(cell => {
        const region = cell.dataset.region;
        const v = valByRegion[region] ?? 0;
        const t = v > 0 ? (v - min) / range : 0;
        const shape = cell.querySelector('.hex-shape');
        if (shape) shape.style.fill = v > 0 ? getColor(t) : '#F4F2E9';
        const valEl = cell.querySelector('.hex-value');
        if (valEl) valEl.textContent = v > 0 ? (v / 1000).toFixed(0) : '–';
        const bar = cell.querySelector('.hex-bar-fill');
        if (bar) bar.setAttribute('width', String(60 * t));
      });
    }

    function showDetail(region) {
      const panel = document.getElementById('hexDetail');
      if (!panel) return;
      const regionData = data.filter(d => d.region === region && d.year === currentYear);
      if (regionData.length === 0) {
        panel.innerHTML = `<div class="placeholder"><span class="placeholder-icon">⚠️</span><p>Pro ${region} nejsou data v ${currentYear}.</p></div>`;
        return;
      }
      const sorted = [...regionData].sort((a, b) => b.tonnes - a.tonnes);
      const total = sorted.reduce((s, d) => s + d.tonnes, 0);
      const rows = sorted.map(d => `
        <li class="d-row">
          <span class="d-crop">${d.crop}</span>
          <span class="d-bar"><span style="width:${(d.tonnes/total*100).toFixed(0)}%"></span></span>
          <span class="d-val">${(d.tonnes/1000).toFixed(0)} tis. t</span>
        </li>`).join('');
      panel.innerHTML = `
        <h3>${region}</h3>
        <p class="d-meta">${currentYear} · celkem ${(total/1000).toFixed(0)} tis. tun</p>
        <ul class="d-list">${rows}</ul>
      `;
    }

    svg.querySelectorAll('.hex-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        svg.querySelectorAll('.hex-cell').forEach(c => c.classList.remove('selected'));
        cell.classList.add('selected');
        selectedRegion = cell.dataset.region;
        showDetail(selectedRegion);
      });
      cell.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          cell.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        }
      });
    });

    document.querySelectorAll('.sp-mini-pill[data-crop]').forEach(b => {
      b.addEventListener('click', () => {
        document.querySelectorAll('.sp-mini-pill[data-crop]').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        currentCrop = b.dataset.crop;
        colorMap();
        if (selectedRegion) showDetail(selectedRegion);
      });
    });
    document.querySelectorAll('.sp-year-btn').forEach(b => {
      b.addEventListener('click', () => {
        document.querySelectorAll('.sp-year-btn').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        currentYear = b.dataset.year;
        colorMap();
        if (selectedRegion) showDetail(selectedRegion);
      });
    });

    colorMap();
  })();

  // ──────────── LIVESTOCK SLOPE ────────────
  (function initLivestock() {
    const dataEl = document.getElementById('livestockData');
    const el = document.getElementById('livestockSlopeChart');
    if (!dataEl || !el) return;
    const { livestock } = JSON.parse(dataEl.textContent);
    if (!livestock.length) return;

    const byAnimal = {};
    livestock.forEach(l => {
      if (!byAnimal[l.animal]) byAnimal[l.animal] = [];
      byAnimal[l.animal].push(l);
    });

    function dateToYear(d) {
      const m = d.match(/(\d{4})/);
      return m ? parseInt(m[1]) : 0;
    }

    Object.values(byAnimal).forEach(arr => arr.sort((a, b) => a.date.localeCompare(b.date)));
    const labels = [...new Set(livestock.map(l => l.date))].sort();

    const datasets = Object.entries(byAnimal).map(([animal, arr], i) => ({
      label: animal,
      data: labels.map(d => {
        const found = arr.find(l => l.date === d);
        return found ? found.count : null;
      }),
      borderColor: animal === 'Skot' ? '#0B7A3B' : RED,
      backgroundColor: animal === 'Skot' ? 'rgba(11,122,59,.08)' : 'rgba(194,68,20,.08)',
      borderWidth: 2.5,
      pointRadius: 3,
      pointHoverRadius: 6,
      tension: 0.25,
      fill: false,
      spanGaps: true,
    }));

    new Chart(el, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'top', labels: { usePointStyle: true, padding: 14, font: { size: 12 } } },
          tooltip: { backgroundColor: INK, padding: 12, cornerRadius: 10,
            callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString('cs-CZ')} ks` } },
        },
        scales: {
          x: { grid: { display: false }, ticks: { maxTicksLimit: 10, font: { size: 11 } } },
          y: { grid: { color: 'rgba(10,10,12,.06)' }, ticks: { callback: v => (v / 1e6).toFixed(1) + ' M' } },
        },
      },
    });
  })();
</script>

<style>
  .sp-page {
    --bg-cream: #FBFAF4;
    max-width: 1280px;
    margin: 0 auto;
    padding: 26px 24px 96px;
    background: var(--bg-cream);
    color: #1E1E22;
  }
  /* Detail panel pro hex mapu — global selectors */
  .sp-page :global(.sp-hex-detail h3){font:700 18px 'Chakra Petch',sans-serif;color:#0A0A0B;margin:0 0 4px}
  .sp-page :global(.sp-hex-detail .d-meta){font-size:12px;color:#6B6B72;margin:0 0 14px;letter-spacing:.04em}
  .sp-page :global(.sp-hex-detail .d-list){list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px}
  .sp-page :global(.sp-hex-detail .d-row){display:grid;grid-template-columns:90px 1fr auto;align-items:center;gap:8px;font-size:13px}
  .sp-page :global(.sp-hex-detail .d-crop){color:#1E1E22;font-weight:500}
  .sp-page :global(.sp-hex-detail .d-bar){height:6px;background:rgba(10,10,12,.06);border-radius:3px;overflow:hidden}
  .sp-page :global(.sp-hex-detail .d-bar > span){display:block;height:100%;background:linear-gradient(90deg,#FFEA00,#FFD400);border-radius:3px}
  .sp-page :global(.sp-hex-detail .d-val){font:600 12px 'Chakra Petch',sans-serif;color:#0A0A0B}

  @media (max-width:600px){
    .sp-page{padding:20px 16px 60px}
  }
</style>
```

- [ ] **Step 2: Spusť dev server na pozadí**

```bash
cd /Users/matejsamec/agro-svet && npm run dev
```

(Run in background; pokračuj až po hláškách "ready in...".)

- [ ] **Step 3: Smoke test**

```bash
curl -sI http://localhost:4321/statistiky/ | head -5
```

Expected: `HTTP/1.1 200 OK`.

- [ ] **Step 4: Type check**

```bash
cd /Users/matejsamec/agro-svet && npx astro check
```

Expected: žádné errors v `src/pages/statistiky/index.astro` ani v komponentách. (Warningy přijatelné.)

- [ ] **Step 5: Commit**

```bash
git add src/pages/statistiky/index.astro
git commit -m "feat(statistiky): rewrite page with new component composition + chart inits"
```

---

## Phase 4 — QA & polish

### Task 19: Visual QA + bug fixes

**Files:**
- Možná: jakákoli komponenta (podle nálezů)

- [ ] **Step 1: Otevři stránku v browseru**

Otevři `http://localhost:4321/statistiky/` ve dvou viewportech (desktop 1280, mobile 375 přes DevTools).

- [ ] **Step 2: Sprav nalezené regrese**

**Checklist projití (rovnou v UI):**

1. [ ] Hero: žluté em ve "zemědělství", 3 stat čísla viditelná, foto napravo, kicker "LIVE DATA · ČESKÁ ZEMĚDĚLSKÁ DATA"
2. [ ] Sparkline ticker: 5 karet (Pšenice, Řepka, Mléko, Nafta, NPK), každá má číslo + jednotku, sparkline je viditelný (žlutá linka), pulzující dot na konci
3. [ ] Ticker je sticky při scrollu (zůstane top: 88px)
4. [ ] Auto-takeaway: 3 karty, každá jiný border-left color (žlutá / červenavá / zelená)
5. [ ] Pills nav: 7 pills, sticky pod tickerem (top: 152px), klik scrolluje
6. [ ] Pills active state se mění při scrollu (IntersectionObserver)
7. [ ] CommodityChart: žlutá linka pšenice viditelná, 5letý průměr šedou přerušovanou, anotace "Invaze na Ukrajinu" (a další) viditelné jako svislé čárky se štítky
8. [ ] Klik na jiný komoditu pill → graf se překreslí
9. [ ] Klik na 1Y / 5Y / Vše → časové okno se mění
10. [ ] Insight pod grafem se aktualizuje ("+X % vs. 5letý průměr")
11. [ ] InputsBlock: 2 grafy vedle sebe (nafta červenavá, hnojiva 6 čar)
12. [ ] PriceScissors: scatter chart, žluté body s roky, šedá diagonála rovnováhy, insight pod grafem ("V YYYY ... → marže ...")
13. [ ] ProductionBlock: bar chart sklizně (horizontal) + donut osevních ploch
14. [ ] HexMap: 14 hexagonů, čísla uvnitř, mini bar pod číslem, klik na hex zobrazí detail panel napravo s plodinami
15. [ ] Pills "Pšenice"/"Ječmen"/... přepínají barvu hexagonů
16. [ ] Pills roků (poslední 6 let) přepínají rok
17. [ ] LivestockSlope: 2 čáry (Skot zelená, Prasata červenavá), insight pod grafem o poklesu
18. [ ] StoryCards: 3 karty s anchor odkazy (klik scrolluje na sekci)
19. [ ] MethodologyFooter: seznam datasetů, attribuce ČSÚ
20. [ ] BottomCTA: žlutý gradient, "Otevřít katalog" linkuje na `/stroje/`
21. [ ] Mobile: hero stack, ticker scrollable horizontálně, pills scrollable horizontálně, all charts responsive

- [ ] **Step 3: Type check + build**

```bash
cd /Users/matejsamec/agro-svet && npx astro check && npm run build
```

Expected: build PASS bez errors.

- [ ] **Step 4: Run vitest**

```bash
cd /Users/matejsamec/agro-svet && npm test
```

Expected: existing tests + new agro-derived tests = all PASS.

- [ ] **Step 5: Commit fixes**

(Pokud byly nějaké fixy, commit s konkrétní zprávou. Pokud ne, skip.)

```bash
git add <changed files>
git commit -m "fix(statistiky): <co bylo opraveno>"
```

---

### Task 20: Performance + a11y polish

**Files:**
- Možná: `src/pages/statistiky/index.astro` (lazy init)

- [ ] **Step 1: Lazy initialization grafů pod foldem (volitelné)**

Pokud první load > 2s nebo Lighthouse Performance < 80, obal grafy mimo top fold (PriceScissors, ProductionBlock, HexMap, LivestockSlope) do IntersectionObserver — render jen když sekce vstoupí do viewportu.

Zatím skip; pokud Lighthouse bude OK, přeskoč.

- [ ] **Step 2: Lighthouse audit**

V Chrome DevTools: Lighthouse → Mobile → Performance + Accessibility + Best Practices.

Cíl: Performance ≥ 80, Accessibility ≥ 95.

- [ ] **Step 3: Pokud a11y problémy — sprav**

Časté problémy a fixy:
- Color contrast: `--muted` (#6B6B72) na `--bg-cream` (#FBFAF4) by měl projít (4.5:1)
- Chybějící `aria-label` na button bez textu — přidej
- Pořadí tabbingu: zkontroluj, že všechny interaktivní prvky jsou keyboard reachable

- [ ] **Step 4: Final commit**

```bash
git add <změny>
git commit -m "perf(statistiky): a11y and performance polish"
```

---

## Self-Review

**1. Spec coverage:**
- Sekce 4.1 Hero → Task 6 ✓
- 4.2 Sparkline ticker → Task 7 ✓
- 4.3 Auto-takeaway → Task 8 + page logic in Task 18 ✓
- 4.4 Annotated long-term → Task 10 + chart init in Task 18 ✓
- 4.5 Cenové nůžky → Task 12 + Task 2 (priceScissors) + chart init Task 18 ✓
- 4.6 Hex mapa → Task 14 + JS init Task 18 ✓
- 4.7 Slope chart zvířat → Task 15 + chart init Task 18 ✓
- 4.8 Sticky pills → Task 9 ✓
- 4.9 Příběhy → Task 16 ✓
- 4.10 CTA dole → Task 17 (BottomCTA) ✓
- 6.1–6.3 datová vrstva: rozšíření czso (Task 5), agro-derived (Tasks 2–4), agro-events (Task 1) ✓
- 6.4 historická data zvířat: research v Task 18 — používáme existující `getLivestockStats()`, fallback na nejnovější dostupné ✓
- 7 závislosti: všechny komponenty + lib + data files vytvořeny ✓
- 8 responsiveness: media queries v každé komponentě ✓
- 9 performance & a11y: Task 20 ✓
- 10 SEO: title + description v Layout, JSON-LD breadcrumbs zatím chybí (nízká priorita, lze přidat později) ⚠️
- 11 risks: livestock historical → fallback na existing data; 5letý průměr → null guard implementován ✓
- 12 success criteria: pokryto Tasks 19–20 ✓

**Gap nalezený v review:** SEO JSON-LD breadcrumbs nejsou v plánu. Ale **spec je explicitně označuje jako součást SEO**. Přidávám je inline do Task 18 níže.

**2. Placeholder scan:** Zkontroloval — žádné TBD, žádné "implement later" v kódových blocích. Každý step má buď exact code, nebo exact command.

**3. Type consistency:**
- `priceScissors()` Task 2 — vrací `{x, y, year}[]` — zkontrolováno proti Task 12 (PriceScissors props) a Task 18 (page) — match ✓
- `fiveYearAverage()` Task 3 — vrací `number | null` — zkontrolováno proti Task 18 (`if (avg !== null)`) ✓
- `biggestMomChange()` Task 3 — vrací `CommodityStat | null` — Task 18 `if (big && big.change !== null)` ✓
- `inputCostInflation()` Task 4 — vrací `number | null` — Task 18 `if (inflPct !== null)` ✓
- `livestockMilestone()` Task 4 — vrací `LivestockMilestone | null` — Task 18 ✓
- `Takeaway` interface Task 8 — zkontrolováno proti Task 18 array konstrukce — match ✓
- `SparklineMetric` interface Task 7 — zkontrolováno proti Task 18 `sparkMetrics` array — match ✓
- `AGRO_EVENTS` Task 1 — má `relevance: 'commodity' | 'livestock' | 'all'`, používá se v CommodityChart Task 10/18 (default filter pro `relevance: 'commodity' | 'all'` — but currently Task 18 passes ALL events; OK because chart filters by labelSet, ne relevance)

**Doplnění:** Task 18 — přidávám JSON-LD breadcrumbs do `<Layout>` slot (do `<head>` z page).

---

### Dodatek do Task 18 (krok mezi Step 1 a Step 2)

- [ ] **Step 1.5: Přidej JSON-LD do `index.astro`**

Mezi `<Layout>` opening tag a `<main>` přidej:

```astro
<script type="application/ld+json" is:inline set:html={JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://agro-svet.cz/' },
    { '@type': 'ListItem', position: 2, name: 'Statistiky', item: 'https://agro-svet.cz/statistiky/' },
  ],
})} />
```

(Tato úprava je součást Task 18 commitu.)

---

**Plán hotov.** Celkem 20 tasků, ~5 commitů per phase, atomic commits, TDD pro lib funkce, smoke testing pro Astro components.
