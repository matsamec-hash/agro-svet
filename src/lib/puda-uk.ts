// src/lib/puda-uk.ts
// Typy + derivace pro UK /puda hub. UK má vlastní (evergreen-first) datový tvar
// odlišný od cs/sk (puda-derived.ts). Každé volatilní pole nese source+asOf.

export interface PudaUkSeriesPoint { year: number; value: number; }

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

export interface LineChartPoint extends PudaUkSeriesPoint { x: number; y: number; }
export interface LineChart {
  points: LineChartPoint[];
  path: string;
  area: string;
  pad: { l: number; r: number; t: number; b: number };
  w: number; h: number; plotW: number; plotH: number;
}

/** Čistá matematika liniového grafu — portováno z puda/index.astro (cs/sk graf). */
export function buildLineChart(
  data: PudaUkSeriesPoint[],
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

export interface PudaUkBigNumbersDerived { priceRustPct: number | null; }

/** Pomocná derivace (růst ceny v %), pokud řada ceny obsahuje ≥2 body. */
export function pudaUkPriceGrowthPct(d: PudaUkData): number | null {
  const s = d.cena.series;
  if (s.length < 2 || s[0].value === 0) return null;
  return Math.round((s.at(-1)!.value / s[0].value - 1) * 100);
}
