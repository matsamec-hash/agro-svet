// src/lib/statistiky-uk.ts
// Typy + derivace pro UK /statistiky hub. Kurátovaný (evergreen-first) tvar,
// odlišný od cs/sk (agro-derived.ts). Každé volatilní pole nese source+asOf.
// buildLineChart je generická čistá funkce — re-export z puda-uk, ať komponenta
// importuje vše sekčně-lokálně.
export { buildLineChart } from './puda-uk';
export type { StatistikyUkSeriesPoint } from './statistiky-uk-types';
