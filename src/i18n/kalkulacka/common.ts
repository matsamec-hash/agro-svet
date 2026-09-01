// Sdílené texty kalkulaček (breadcrumb labely, nadpis FAQ) per locale.
import type { Locale } from '../config';

export interface CalcCrumbs {
  home: string;
  hub: string;
  /** aria-label drobečkové navigace. Bylo natvrdo „Cesta" na všech mutacích. */
  nav: string;
  /** Jednotné číslo pro JSON-LD `applicationSubCategory`. Bylo natvrdo
   *  „Kalkulačka", takže strukturovaná data hlásila český řetězec i pod /de
   *  a /uk — a to je únik, kterého si při čtení stránky nikdo nevšimne. */
  calcWord: string;
}

/** Nadpis FAQ bloku. Byl ve dvou kalkulačkách natvrdo česky, takže se na /sk
 *  zobrazoval česky uprostřed jinak slovenské stránky. */
export const faqTitle: Record<Locale, string> = {
  cs: 'Časté otázky',
  sk: 'Časté otázky',
  uk: 'Часті запитання',
  pl: 'Często zadawane pytania',
  de: 'Häufige Fragen',
};

export const crumbs: Record<Locale, CalcCrumbs> = {
  cs: { home: 'Domů', hub: 'Kalkulačky', nav: 'Cesta', calcWord: 'Kalkulačka' },
  sk: { home: 'Domov', hub: 'Kalkulačky', nav: 'Cesta', calcWord: 'Kalkulačka' },
  uk: { home: 'Домів', hub: 'Калькулятори', nav: 'Навігація', calcWord: 'Калькулятор' },
  pl: { home: 'Strona główna', hub: 'Kalkulatory', nav: 'Ścieżka', calcWord: 'Kalkulator' },
  de: { home: 'Startseite', hub: 'Rechner', nav: 'Pfad', calcWord: 'Rechner' },
};
