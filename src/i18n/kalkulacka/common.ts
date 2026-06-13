// Sdílené breadcrumb labely kalkulaček (Domů / Kalkulačky) per locale.
import type { Locale } from '../config';

export interface CalcCrumbs {
  home: string;
  hub: string;
}

export const crumbs: Record<Locale, CalcCrumbs> = {
  cs: { home: 'Domů', hub: 'Kalkulačky' },
  sk: { home: 'Domov', hub: 'Kalkulačky' },
  uk: { home: 'Домів', hub: 'Калькулятори' },
};
