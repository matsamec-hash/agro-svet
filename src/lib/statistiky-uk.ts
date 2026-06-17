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
