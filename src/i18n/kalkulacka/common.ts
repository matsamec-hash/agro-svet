// Sdílené texty kalkulaček (breadcrumb labely, nadpis FAQ) per locale.
import type { Locale } from '../config';

export interface CalcCrumbs {
  home: string;
  hub: string;
}

/** Nadpis FAQ bloku. Byl ve dvou kalkulačkách natvrdo česky, takže se na /sk
 *  zobrazoval česky uprostřed jinak slovenské stránky. */
export const faqTitle: Record<Locale, string> = {
  cs: 'Časté otázky',
  sk: 'Časté otázky',
  uk: 'Часті запитання',
  pl: 'Często zadawane pytania',
};

export const crumbs: Record<Locale, CalcCrumbs> = {
  cs: { home: 'Domů', hub: 'Kalkulačky' },
  sk: { home: 'Domov', hub: 'Kalkulačky' },
  uk: { home: 'Домів', hub: 'Калькулятори' },
  pl: { home: 'Strona główna', hub: 'Kalkulatory' },
  de: { home: 'Startseite', hub: 'Rechner' },
};
