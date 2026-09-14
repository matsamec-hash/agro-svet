export const locales = ['cs', 'sk', 'uk', 'pl', 'de'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'cs';

/** Jazykové mutace STAŽENÉ z provozu.
 *
 *  `de` staženo 2026-09-14 na přání vlastníka. Mutace se NEsmaže z kódu —
 *  překlady (i18n/ui/de.ts, slovnik.de, sezona.de, kviz.de, HomeDe.astro,
 *  overlaye) a LAUNCHED_PREFIXES.de zůstávají nedotčené, aby šla kdykoli
 *  vrátit jediným smazáním řádku z tohohle pole. Odstraněný jazyk je gatnutý
 *  na dvou místech a jinde NIKDE:
 *    1) middleware.ts → /de/* vrací 410 Gone (Google ji vyhodí z indexu),
 *    2) isLaunchedPath() → false, což samo shodí hreflang (Layout.astro),
 *       sitemapu (lib/sitemap-mirror), nav i footer (i18n/nav) a /hledat.
 *
 *  ‼️ NEPŘIDÁVAT `Disallow: /de/` do robots.txt. Zakázaná cesta se nescrawluje,
 *  takže by Googlebot to 410 nikdy neviděl a URL by v indexu zůstaly viset. */
export const RETIRED_LOCALES = ['de'] as const satisfies readonly Locale[];

export function isRetiredLocale(value: string): boolean {
  return (RETIRED_LOCALES as readonly string[]).includes(value);
}

/** Locale, které web reálně servíruje (= `locales` bez stažených). */
export const activeLocales: readonly Locale[] = locales.filter((l) => !isRetiredLocale(l));

export const localeNames: Record<Locale, string> = {
  cs: 'Čeština',
  sk: 'Slovenčina',
  uk: 'Українська',
  pl: 'Polski',
  de: 'Deutsch',
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
