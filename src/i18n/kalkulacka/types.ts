// Sdílené typy pro per-kalkulačka i18n moduly (Fáze 2b).
import type { Locale } from '../config';

export interface CalcFaq {
  q: string;
  a: string;
}

/** Společný základ každé kalkulačky: meta + breadcrumb + FAQ. Konkrétní
 *  kalkulačky rozšiřují o vlastní `labels`/`js`/`currency` pole. */
export interface CalcMeta {
  /** <title> v <Layout title>. */
  title: string;
  /** meta description. */
  metaDescription: string;
  /** H1 nad widgetem. */
  h1: string;
  /** Krátký label v breadcrumbu/heru ("Převody jednotek"). */
  crumb: string;
  /** Kicker nad H1. */
  kicker: string;
  /** Úvodní lede pod H1 (plain text). */
  lede: string;
  faq: CalcFaq[];
}

/** Měnové/číselné nastavení pro finanční kalkulačky. */
export interface CalcCurrency {
  /** ISO kód pro Intl.NumberFormat (style:'currency'). */
  currency: 'CZK' | 'EUR';
  /** BCP-47 locale pro formátování čísel. */
  numberLocale: 'cs-CZ' | 'sk-SK';
}

export type LocaleContent<T> = Record<Locale, T>;

/** Vrátí rekurzivní set "tečkových" cest klíčů objektu — pro parity test.
 *  Pole se porovnávají podle délky (index → klíč). */
export function keyPaths(obj: unknown, prefix = ''): string[] {
  if (Array.isArray(obj)) {
    return obj.flatMap((v, i) => keyPaths(v, `${prefix}[${i}]`));
  }
  if (obj && typeof obj === 'object') {
    return Object.keys(obj)
      .sort()
      .flatMap((k) => keyPaths((obj as Record<string, unknown>)[k], prefix ? `${prefix}.${k}` : k));
  }
  return [prefix];
}
