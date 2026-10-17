export const locales = ['cs', 'sk', 'uk', 'pl', 'de'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'cs';

/** Jazykové mutace STAŽENÉ z provozu.
 *
 *  `de` bylo stažené 2026-09-14 až 2026-10-14 na přání vlastníka a vrátilo se
 *  po auditu práv k fotkám (všechny /de stránky), textů a právních stránek.
 *  Mechanismus zůstává pro případ, že by bylo potřeba jazyk znovu stáhnout.
 *  Stažená mutace se NEsmaže z kódu —
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
export const RETIRED_LOCALES = [] as const satisfies readonly Locale[];

export function isRetiredLocale(value: string): boolean {
  return (RETIRED_LOCALES as readonly string[]).includes(value);
}

/** Sekce stažené z jedné jazykové mutace kvůli licenci dat → 410 (middleware).
 *  Samotné vyřazení z LAUNCHED_PREFIXES nestačí: nelaunchnutá cesta se dál
 *  vykreslí (noindex), takže data by byla pořád veřejně vidět.
 *  Historie (audit licencí, ~/agro-svet/foto-audit/de/rizika/B-licence-dat.md):
 *  - /akcie 2026-10-15 až 16 — kurzy z Yahoo/Finnhubu; pryč ve všech jazycích, vráceno.
 *  - /svet 2026-10-15 až 17 — hranice NUTS z GISCO („not for commercial purposes“)
 *    a mapa Evropy z historical-basemaps (GPL-3.0). Geometrie přestavěné z Natural
 *    Earth (public domain), atribuce Eurostatu a World Bank doplněné → vráceno.
 *  Mechanismus (middleware 410) zůstává pro příští případ. */
export const WITHDRAWN_SECTIONS: Partial<Record<Locale, readonly string[]>> = {
  de: [],
};

export function isWithdrawnPath(locale: Locale, csPath: string): boolean {
  return (WITHDRAWN_SECTIONS[locale] ?? []).some((p) => csPath === p || csPath === `${p}/` || csPath.startsWith(`${p}/`));
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
