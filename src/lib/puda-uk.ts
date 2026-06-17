// src/lib/puda-uk.ts
// Typy + derivace pro UK /puda hub. UK má vlastní (evergreen-first) datový tvar
// odlišný od cs/sk (puda-derived.ts). Každé volatilní pole nese source+asOf.

import type { ChartSeriesPoint } from './chart-line';
export type PudaUkSeriesPoint = ChartSeriesPoint;

/** Volatilní blok řady (cena / nájem) s povinnou atribucí. */
export interface PudaUkSeries {
  unit: string;
  asOf: string;
  source: string;
  url: string;
  max: number;
  ticks: number[];
  series: PudaUkSeriesPoint[];
}

export interface PudaUkBigNumber {
  val: string; unit: string; lbl: string; trend: string;
  source: string; url: string;
}

export interface PudaUkTimelineStep {
  year: string; title: string; text: string; source: string; url: string;
}

export interface PudaUkFact {
  val: string; unit: string; lbl: string; note: string;
  source: string; url: string;
}

export interface PudaUkCrop {
  crop: string; hectares: number; source: string; url: string;
}

export interface PudaUkThreat { lbl: string; pct: number; detail: string; }

export interface PudaUkSourceLink { label: string; url: string; }

export interface PudaUkData {
  generated: string;
  warCaveat: string;
  bigNumbers: PudaUkBigNumber[];
  reformTimeline: PudaUkTimelineStep[];
  cena: PudaUkSeries;
  najem: PudaUkSeries;
  plodiny: PudaUkCrop[];
  facts: PudaUkFact[];
  threats: PudaUkThreat[];
  sources: PudaUkSourceLink[];
}

export { buildLineChart } from './chart-line';
export type { LineChart, LineChartPoint } from './chart-line';

export interface PudaUkBigNumbersDerived { priceRustPct: number | null; }

/** Pomocná derivace (růst ceny v %), pokud řada ceny obsahuje ≥2 body. */
export function pudaUkPriceGrowthPct(d: PudaUkData): number | null {
  const s = d.cena.series;
  if (s.length < 2 || s[0].value === 0) return null;
  return Math.round((s.at(-1)!.value / s[0].value - 1) * 100);
}
