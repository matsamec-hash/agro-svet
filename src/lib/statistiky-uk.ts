// src/lib/statistiky-uk.ts
// Typy + derivace pro UK /statistiky hub. Kurátovaný (evergreen-first) tvar,
// odlišný od cs/sk (agro-derived.ts). Každé volatilní pole nese source+asOf.
// buildLineChart je generická čistá funkce — re-export z puda-uk, ať komponenta
// importuje vše sekčně-lokálně.
export { buildLineChart } from './puda-uk';
export type { StatistikyUkSeriesPoint } from './statistiky-uk-types';

import type { StatistikyUkSeriesPoint as SP } from './statistiky-uk-types';

/** Procentní změna prvního→posledního bodu řady (např. propad produkce). null pokud <2 body / nulový základ. */
export function cropDropPct(series: SP[]): number | null {
  if (series.length < 2 || series[0].value === 0) return null;
  return Math.round((series.at(-1)!.value / series[0].value - 1) * 100);
}
