// src/lib/agro-derived.ts
import type { CommodityPrice, FertilizerPrice, FuelPrice, CommodityStat, LivestockStat } from './czso';

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
    if (key < targetKey && key >= targetKey - 60) {
      window.push(p.price);
    }
  }
  if (window.length < 60) return null;
  return window.reduce((a, b) => a + b, 0) / window.length;
}

// Vrátí komoditu s největší absolutní hodnotou meziroční změny (`change`).
export function biggestYoyChange(stats: CommodityStat[]): CommodityStat | null {
  let best: CommodityStat | null = null;
  for (const s of stats) {
    if (s.change === null) continue;
    if (!best || Math.abs(s.change) > Math.abs(best.change!)) best = s;
  }
  return best;
}

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

// ── Locale-aware prose helpers ───────────────────────────────────────────────

export type Locale = 'cs' | 'sk';

export interface ScissorsPoint {
  year: number;
  x: number; // index vstupů / inputs index
  y: number; // index výstupů / outputs index
}

export interface Takeaway {
  category: 'trh' | 'vstupy' | 'zvirata';
  title: string;
  insight: string;
  anchor: string;
}

interface LocaleStrings {
  noData: string;
  positive: (year: number, y: number, x: number, margin: number) => string;
  negative: (year: number, x: number, y: number, margin: number) => string;
  neutral: (year: number, x: number, y: number) => string;
  livestockFallback: string;
  livestockTrend: (first: number, last: number, drop: number, numLocale: string) => string;
  wheatName: string;
  wheatFallback: (price: number, unit: string, month: string, numLocale: string) => string;
  fertName: string;
  fertInsight: (inflPct: number) => string;
  fertFallback: string;
  fertFallbackTitle: string;
  cattleDisplayName: string;
  cattleMilestone: (threshold: number, latestCount: number) => string;
  cattleFallback: (count: number, date: string, numLocale: string) => string;
  cattleNoData: string;
}

const CS_STRINGS: LocaleStrings = {
  noData: 'Nedostatek dat pro výpočet cenových nůžek.',
  positive: (year, y, x, margin) =>
    `V ${year} výstupy ${y.toFixed(0)} vs. vstupy ${x.toFixed(0)} → marže pozitivní (+${margin.toFixed(0)} bodů).`,
  negative: (year, x, y, margin) =>
    `V ${year} vstupy ${x.toFixed(0)} > výstupy ${y.toFixed(0)} → marže negativní (${margin.toFixed(0)} bodů).`,
  neutral: (year, x, y) =>
    `V ${year} vstupy ${x.toFixed(0)}, výstupy ${y.toFixed(0)} → marže neutrální.`,
  livestockFallback: 'Pololetní data ČSÚ — viz graf níže.',
  livestockTrend: (first, last, drop, numLocale) =>
    `Stav skotu: ${first.toLocaleString(numLocale)} → ${last.toLocaleString(numLocale)} ks (${drop.toFixed(0)} %).`,
  wheatName: 'Pšenice',
  wheatFallback: (price, unit, month, numLocale) =>
    `Aktuální cena ${price.toLocaleString(numLocale)} Kč/t (${month}).`,
  fertName: 'NPK 15-15-15',
  fertInsight: (inflPct) =>
    `Stále ${inflPct >= 0 ? '+' : ''}${inflPct.toFixed(0)} % proti roku 2019. Cenové nůžky se ${inflPct > 30 ? 'zužují' : 'stabilizují'}.`,
  fertFallback: 'Aktuální data v sekci Vstupy.',
  fertFallbackTitle: 'Hnojiva',
  cattleDisplayName: 'Skot',
  cattleMilestone: (threshold, latestCount) =>
    `Stav pod ${(threshold / 1e6).toFixed(1)} M kusů (aktuálně ${(latestCount / 1e6).toFixed(2)} M).`,
  cattleFallback: (count, date, numLocale) =>
    `Aktuálně ${count.toLocaleString(numLocale)} ks (${date}).`,
  cattleNoData: 'Pololetní data ČSÚ.',
};

const SK_STRINGS: LocaleStrings = {
  noData: 'Nedostatok dát pre výpočet cenových nožníc.',
  positive: (year, y, x, margin) =>
    `V ${year} výstupy ${y.toFixed(0)} vs. vstupy ${x.toFixed(0)} → marža pozitívna (+${margin.toFixed(0)} bodov).`,
  negative: (year, x, y, margin) =>
    `V ${year} vstupy ${x.toFixed(0)} > výstupy ${y.toFixed(0)} → marža negatívna (${margin.toFixed(0)} bodov).`,
  neutral: (year, x, y) =>
    `V ${year} vstupy ${x.toFixed(0)}, výstupy ${y.toFixed(0)} → marža neutrálna.`,
  livestockFallback: 'Ročné údaje Eurostat — pozri graf nižšie.',
  livestockTrend: (first, last, drop, numLocale) =>
    `Stav HD: ${first.toLocaleString(numLocale)} → ${last.toLocaleString(numLocale)} ks (${drop.toFixed(0)} %).`,
  wheatName: 'Pšenica',
  wheatFallback: (price, _unit, month, numLocale) =>
    `Aktuálna cena ${price.toLocaleString(numLocale)} EUR/t (${month}).`,
  fertName: 'NPK 15-15-15',
  fertInsight: (inflPct) =>
    `Stále ${inflPct >= 0 ? '+' : ''}${inflPct.toFixed(0)} % oproti roku 2019. Cenové nožnice sa ${inflPct > 30 ? 'zužujú' : 'stabilizujú'}.`,
  fertFallback: 'Aktuálne dáta v sekcii Vstupy.',
  fertFallbackTitle: 'Hnojivá',
  cattleDisplayName: 'Hovädzí dobytok',
  cattleMilestone: (threshold, latestCount) =>
    `Stav pod ${(threshold / 1e6).toFixed(1)} M kusov (aktuálne ${(latestCount / 1e6).toFixed(2)} M).`,
  cattleFallback: (count, date, numLocale) =>
    `Aktuálne ${count.toLocaleString(numLocale)} ks (${date}).`,
  cattleNoData: 'Ročné údaje Eurostat.',
};

function getStrings(locale: Locale): LocaleStrings {
  return locale === 'sk' ? SK_STRINGS : CS_STRINGS;
}

/** Human-readable price scissors insight for the given series. */
export function scissorsInsightText(scissorsPoints: ScissorsPoint[], locale: Locale): string {
  const s = getStrings(locale);
  if (scissorsPoints.length === 0) return s.noData;
  const last = scissorsPoints[scissorsPoints.length - 1];
  const margin = last.y - last.x;
  if (margin > 5) return s.positive(last.year, last.y, last.x, margin);
  if (margin < -5) return s.negative(last.year, last.x, last.y, margin);
  return s.neutral(last.year, last.x, last.y);
}

/** Human-readable livestock (cattle) trend insight across full historical series. */
export function livestockInsightText(livestockHistorical: LivestockStat[], locale: Locale): string {
  const s = getStrings(locale);
  const numLocale = locale === 'sk' ? 'sk-SK' : 'cs-CZ';
  const skot = livestockHistorical
    .filter(l => l.animal === 'Skot')
    .sort((a, b) => a.date.localeCompare(b.date));
  if (skot.length < 2) return s.livestockFallback;
  const first = skot[0];
  const last = skot[skot.length - 1];
  const drop = ((last.count / first.count) - 1) * 100;
  return s.livestockTrend(first.count, last.count, drop, numLocale);
}

interface StatTakeawaysInput {
  commodityStats: CommodityStat[];
  fertilizers: FertilizerPrice[];
  livestock: LivestockStat[];
}

/** Produces the 3 auto-takeaway cards (trh / vstupy / zvirata) for the statistics page. */
export function statTakeaways(
  { commodityStats, fertilizers, livestock }: StatTakeawaysInput,
  locale: Locale,
): Takeaway[] {
  const s = getStrings(locale);
  const numLocale = locale === 'sk' ? 'sk-SK' : 'cs-CZ';
  const FERT_BASE_YEAR = 2019;
  const SKOT_THRESHOLD = 1300000;

  const big = biggestYoyChange(commodityStats);
  const inflPct = inputCostInflation(fertilizers, 'NPK 15-15-15', FERT_BASE_YEAR);
  const skotMile = livestockMilestone(livestock, 'Skot', SKOT_THRESHOLD);
  const wheat = commodityStats.find(c => c.name === s.wheatName);

  const result: Takeaway[] = [];

  // ── trh ──
  if (big && big.change !== null && Math.abs(big.change) >= 1) {
    const dir = big.change >= 0 ? '+' : '';
    result.push({
      category: 'trh',
      title: big.name,
      insight: `${dir}${big.change.toFixed(1)} % r/r. Aktuální cena ${big.price.toLocaleString(numLocale)} ${big.unit}.`,
      anchor: '#trh',
    });
  } else if (wheat) {
    result.push({
      category: 'trh',
      title: s.wheatName,
      insight: s.wheatFallback(wheat.price, wheat.unit, wheat.month, numLocale),
      anchor: '#trh',
    });
  }

  // ── vstupy ──
  if (inflPct !== null) {
    result.push({
      category: 'vstupy',
      title: 'NPK 15-15-15',
      insight: s.fertInsight(inflPct),
      anchor: '#vstupy',
    });
  } else {
    result.push({
      category: 'vstupy',
      title: s.fertFallbackTitle,
      insight: s.fertFallback,
      anchor: '#vstupy',
    });
  }

  // ── zvirata ──
  if (skotMile) {
    result.push({
      category: 'zvirata',
      title: s.cattleDisplayName,
      insight: s.cattleMilestone(skotMile.threshold, skotMile.latestCount),
      anchor: '#zvirata',
    });
  } else {
    const skot = livestock.filter(l => l.animal === 'Skot').pop();
    result.push({
      category: 'zvirata',
      title: s.cattleDisplayName,
      insight: skot
        ? s.cattleFallback(skot.count, skot.date, numLocale)
        : s.cattleNoData,
      anchor: '#zvirata',
    });
  }

  return result;
}
