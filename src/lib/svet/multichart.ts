// Geometrie víceřadého trendového grafu pro /svet/srovnani (čára per zemi v čase).
// Čistá funkce sdílená serverem (SSR výchozí stav) i klientem (překreslení při
// změně ukazatele / přepočtu / výběru zemí). Barvy zemí stabilní přes colorMap.

export const CZ_COLOR = '#2f6b2f';
// Kvalitativní paleta pro ostatní země (dost odlišná, tlumená). Přiřazení stabilní
// dle abecedního indexu slugu → země má stejnou barvu bez ohledu na výběr.
export const CMP_PALETTE = [
  '#3b82c4', '#d98a1e', '#7b5ea7', '#c0523b', '#4f9d69', '#c94f8a', '#2aa9a0', '#8a6d3b',
  '#5566d0', '#b0872a', '#9d4f4f', '#3f7d54', '#a85fb0', '#c77d3a', '#4a7d9d', '#7a9d3a',
];

/** Stabilní mapa slug → barva. `cesko` (reference) = zelená; ostatní z palety dle indexu. */
export function buildColorMap(slugs: string[]): Record<string, string> {
  const others = slugs.filter((s) => s !== 'cesko').sort();
  const map: Record<string, string> = { cesko: CZ_COLOR };
  others.forEach((s, i) => { map[s] = CMP_PALETTE[i % CMP_PALETTE.length]; });
  return map;
}

export interface SeriesInput {
  slug: string;
  name: string;
  color: string;
  isRef?: boolean;
  points: { year: number; value: number }[];
}
export interface MultiOpts { w: number; h: number; ml: number; mr: number; mt: number; mb: number; }
export const MULTI_OPTS: MultiOpts = { w: 640, h: 300, ml: 34, mr: 14, mt: 14, mb: 26 };

export interface MultiLine { slug: string; name: string; color: string; isRef: boolean; path: string; lastX: number; lastY: number; }
export interface MultiModel {
  w: number; h: number; ml: number; mr: number; mt: number; mb: number;
  xMin: number; xMax: number; lo: number; hi: number;
  lines: MultiLine[];
  yTicks: { value: number; y: number }[];
  xLabels: { year: number; x: number }[];
  empty: boolean;
}

function niceYearTicks(xMin: number, xMax: number, maxTicks = 6): number[] {
  if (xMin === xMax) return [xMin];
  const span = xMax - xMin;
  const step = Math.max(1, Math.ceil(span / (maxTicks - 1)));
  const out: number[] = [];
  for (let y = xMin; y <= xMax; y += step) out.push(y);
  if (out[out.length - 1] !== xMax) out.push(xMax);
  return out;
}

export function buildMultiSeriesModel(list: SeriesInput[], opts: MultiOpts = MULTI_OPTS): MultiModel {
  const { w, h, ml, mr, mt, mb } = opts;
  const iw = w - ml - mr, ih = h - mt - mb;
  const clean = list.map((s) => ({ ...s, points: s.points.filter((p) => Number.isFinite(p.value)) })).filter((s) => s.points.length);

  const allYears = clean.flatMap((s) => s.points.map((p) => p.year));
  const allVals = clean.flatMap((s) => s.points.map((p) => p.value));
  const empty = clean.length === 0;

  const xMin = empty ? 0 : Math.min(...allYears);
  const xMax = empty ? 0 : Math.max(...allYears);
  let lo = empty ? 0 : Math.floor(Math.min(...allVals));
  let hi = empty ? 1 : Math.ceil(Math.max(...allVals));
  if (hi === lo) hi = lo + 1;

  const xSpan = xMax - xMin;
  const x = (year: number) => (xSpan === 0 ? ml + iw / 2 : ml + ((year - xMin) / xSpan) * iw);
  const y = (v: number) => mt + ih * (1 - (v - lo) / (hi - lo));
  const r1 = (n: number) => Math.round(n * 10) / 10;

  // reference (cesko) kreslíme naposledy → navrch
  const ordered = [...clean].sort((a, b) => (a.isRef ? 1 : 0) - (b.isRef ? 1 : 0));
  const lines: MultiLine[] = ordered.map((s) => {
    const pts = [...s.points].sort((a, b) => a.year - b.year).map((p) => ({ x: r1(x(p.year)), y: r1(y(p.value)) }));
    return {
      slug: s.slug, name: s.name, color: s.color, isRef: !!s.isRef,
      path: 'M' + pts.map((p) => `${p.x} ${p.y}`).join('L'),
      lastX: pts[pts.length - 1].x, lastY: pts[pts.length - 1].y,
    };
  });

  const yTicks = [hi, (lo + hi) / 2, lo].map((v) => ({ value: v, y: r1(y(v)) }));
  const xLabels = empty ? [] : niceYearTicks(xMin, xMax).map((yr) => ({ year: yr, x: r1(x(yr)) }));

  return { w, h, ml, mr, mt, mb, xMin, xMax, lo, hi, lines, yTicks, xLabels, empty };
}
