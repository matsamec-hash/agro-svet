// src/lib/agro-derived.ts
import type { CommodityPrice, FertilizerPrice, FuelPrice, CommodityStat } from './czso';

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
