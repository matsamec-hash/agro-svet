// Geometrie obohaceného grafu ukazatele pro /svet/[slug]/ (karta IndicatorRow).
// Čistá funkce: ze série země (+ volitelně série ČR) spočítá SVG dráhy, osy,
// body a data pro hover. Server i klient (hover) sdílí stejný model.
import type { SeriesPoint } from './types';
import { fmtNum } from './render';

export interface ChartOpts { w: number; h: number; ml: number; mr: number; mt: number; mb: number; }
export const DEFAULT_OPTS: ChartOpts = { w: 320, h: 150, ml: 34, mr: 10, mt: 12, mb: 22 };

export interface ChartPoint { year: number; value: number; x: number; y: number; }
export interface HoverPoint { year: number; x: number; value: number; refValue: number | null; diffPct: number | null; }
export interface YTick { value: number; y: number; }

export interface ChartModel {
  w: number; h: number;
  lo: number; hi: number;
  line: string;        // dráha čáry země
  area: string;        // výplň pod čárou země
  refLine: string;     // dráha čáry ČR ('' když není)
  hasRef: boolean;
  points: ChartPoint[];
  refPoints: ChartPoint[];
  hover: HoverPoint[];
  yTicks: YTick[];
  xLabels: { year: number; x: number }[];
  lastDot: { x: number; y: number } | null;
}

const yr = (p: SeriesPoint) => Number(p.period);

function refMapInRange(ref: SeriesPoint[], minY: number, maxY: number): Map<number, number> {
  const m = new Map<number, number>();
  for (const p of ref) {
    const y = yr(p);
    if (Number.isFinite(y) && y >= minY && y <= maxY && Number.isFinite(p.value)) m.set(y, p.value);
  }
  return m;
}

export function buildChartModel(
  series: SeriesPoint[],
  refSeries: SeriesPoint[] | null | undefined,
  opts: ChartOpts = DEFAULT_OPTS,
): ChartModel {
  const { w, h, ml, mr, mt, mb } = opts;
  const iw = w - ml - mr;
  const ih = h - mt - mb;
  const pts = series.filter((p) => Number.isFinite(p.value));
  const years = pts.map(yr);
  const minY = Math.min(...years);
  const maxY = Math.max(...years);
  const yearSpan = maxY - minY;

  const refMap = refSeries && refSeries.length ? refMapInRange(refSeries, minY, maxY) : new Map<number, number>();
  const refVals = [...refMap.values()];

  const all = pts.map((p) => p.value).concat(refVals);
  let lo = Math.min(...all);
  let hi = Math.max(...all);
  if (hi === lo) { hi = lo + 1; lo = lo - 1; } // plochá série → umělý rozsah

  const x = (year: number) => (yearSpan === 0 ? ml + iw / 2 : ml + ((year - minY) / yearSpan) * iw);
  const y = (v: number) => mt + ih * (1 - (v - lo) / (hi - lo));
  const r1 = (n: number) => Math.round(n * 10) / 10;

  const points: ChartPoint[] = pts.map((p) => ({ year: yr(p), value: p.value, x: r1(x(yr(p))), y: r1(y(p.value)) }));
  const toPath = (ps: { x: number; y: number }[]) =>
    ps.length ? 'M' + ps.map((p) => `${p.x} ${p.y}`).join('L') : '';
  const line = toPath(points);
  const area = points.length
    ? `${line}L${points[points.length - 1].x} ${r1(mt + ih)}L${points[0].x} ${r1(mt + ih)}Z`
    : '';

  const refPoints: ChartPoint[] = [...refMap.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([year, value]) => ({ year, value, x: r1(x(year)), y: r1(y(value)) }));
  const refLine = toPath(refPoints);

  const hover: HoverPoint[] = points.map((p) => {
    const rv = refMap.has(p.year) ? refMap.get(p.year)! : null;
    return { year: p.year, x: p.x, value: p.value, refValue: rv, diffPct: rv ? Math.round((p.value / rv - 1) * 100) : null };
  });

  const yTicks: YTick[] = [hi, (lo + hi) / 2, lo].map((v) => ({ value: v, y: r1(y(v)) }));
  const xLabels = points.length
    ? [{ year: minY, x: points[0].x }, ...(yearSpan > 0 ? [{ year: maxY, x: points[points.length - 1].x }] : [])]
    : [];

  return {
    w, h, lo, hi, line, area, refLine, hasRef: refPoints.length >= 2,
    points, refPoints, hover, yTicks, xLabels,
    lastDot: points.length ? { x: points[points.length - 1].x, y: points[points.length - 1].y } : null,
  };
}

/** Faktická (ne květnatá) věta pod grafem: rozsah + roky + srovnání s referencí. */
export function chartCaption(
  series: SeriesPoint[],
  refSeries: SeriesPoint[] | null | undefined,
  unit: string,
  refName = 'ČR',
): string {
  const pts = series.filter((p) => Number.isFinite(p.value));
  if (!pts.length) return '';
  const years = pts.map(yr);
  const minY = Math.min(...years), maxY = Math.max(...years);
  const vals = pts.map((p) => p.value);
  const minV = Math.min(...vals), maxV = Math.max(...vals);
  const rangePart =
    minV === maxV
      ? `Hodnota ${fmtNum(minV)} ${unit} (${minY}).`
      : `Za sledované období ${minY}–${maxY} se pohybuje mezi ${fmtNum(minV)} a ${fmtNum(maxV)} ${unit}.`;

  if (!refSeries || !refSeries.length) return rangePart;
  const refMap = refMapInRange(refSeries, minY, maxY);
  // srovnání ve stejném roce: nejnovější rok, kde mají data země i reference
  const common = years.filter((yy) => refMap.has(yy)).sort((a, b) => b - a);
  if (!common.length) return rangePart;
  const yStar = common[0];
  const cVal = pts.find((p) => yr(p) === yStar)!.value;
  const rVal = refMap.get(yStar)!;
  const pct = Math.round((cVal / rVal - 1) * 100);
  const cmp =
    pct === 0
      ? `V roce ${yStar} srovnatelné s ${refName}.`
      : `V roce ${yStar} o ${Math.abs(pct)} % ${pct < 0 ? 'pod' : 'nad'} úrovní ${refName} (${fmtNum(rVal)} ${unit}).`;
  return `${rangePart} ${cmp}`;
}
