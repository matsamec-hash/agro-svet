// Sekvenční barevná škála pro choropleth mapy /svet/. Jednohue (zelená = agro brand),
// vhodná pro veličiny „málo → hodně". Používá se SSR (Astro) i klientsky (přepínač metrik).

const STOPS: [number, number, number][] = [
  [240, 247, 234], // #f0f7ea světle zelená
  [162, 201, 130], // #a2c982
  [90, 150, 74],   // #5a964a
  [31, 92, 31],    // #1f5c1f tmavě zelená
];

function lerp(a: number, b: number, t: number) { return Math.round(a + (b - a) * t); }

/** t ∈ [0,1] → hex barva na sekvenční zelené škále. */
export function rampColor(t: number): string {
  const x = Math.max(0, Math.min(1, Number.isFinite(t) ? t : 0));
  const seg = x * (STOPS.length - 1);
  const i = Math.min(STOPS.length - 2, Math.floor(seg));
  const f = seg - i;
  const [r, g, b] = [0, 1, 2].map((c) => lerp(STOPS[i][c], STOPS[i + 1][c], f));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/** min/max z hodnot (ignoruje null/undefined). */
export function extent(values: (number | null | undefined)[]): { min: number; max: number } {
  const nums = values.filter((v): v is number => v != null && Number.isFinite(v));
  if (!nums.length) return { min: 0, max: 1 };
  return { min: Math.min(...nums), max: Math.max(...nums) };
}

/** Barva pro hodnotu v rozsahu min–max. */
export function colorFor(value: number | null | undefined, min: number, max: number): string {
  if (value == null || !Number.isFinite(value)) return '#e7e9e1'; // neutrální (chybí data)
  const t = max > min ? (value - min) / (max - min) : 0.5;
  return rampColor(t);
}
