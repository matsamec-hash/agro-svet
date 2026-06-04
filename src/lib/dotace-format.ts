import type { Locale } from '../i18n/config';

/** '' for cs, '/sk' etc. for prefixed locales. Use as `${linkBase(locale)}/dotace/...`. */
export function linkBase(locale: Locale): string {
  return locale === 'cs' ? '' : `/${locale}`;
}

/** cs → Kč (byte-identical to old fmtCZK), sk → EUR. */
export function fmtMoney(n: number, locale: Locale): string {
  if (locale === 'sk') {
    return new Intl.NumberFormat('sk-SK', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
  }
  return new Intl.NumberFormat('cs-CZ').format(n) + ' Kč';
}

/** Locale-aware date; empty/invalid ISO → '—'. */
export function fmtDate(iso: string, locale: Locale, opts?: { month?: 'numeric' | 'long' }): string {
  if (!iso) return '—';
  return new Intl.DateTimeFormat(locale === 'sk' ? 'sk-SK' : 'cs-CZ', {
    day: 'numeric', month: opts?.month ?? 'numeric', year: 'numeric',
  }).format(new Date(iso));
}
