import { locales, defaultLocale, isLocale, type Locale } from './config';
import { ui } from './ui';

const SITE_ORIGIN = 'https://agro-svet.cz';

/** Odvodí locale z prefixu cesty. cs (default) nemá prefix. */
export function getLocaleFromUrl(url: URL): Locale {
  const seg = url.pathname.split('/')[1] ?? '';
  return isLocale(seg) && seg !== defaultLocale ? seg : defaultLocale;
}

/** Rozdělí pathname na locale + cs-root path (bez prefixu). */
export function stripLocale(pathname: string): { locale: Locale; path: string } {
  const seg = pathname.split('/')[1] ?? '';
  if (isLocale(seg) && seg !== defaultLocale) {
    const rest = pathname.slice(seg.length + 1) || '/';
    return { locale: seg, path: rest };
  }
  return { locale: defaultLocale, path: pathname };
}

/** Z cs-root path udělá lokalizovanou cestu. cs = beze změny. */
export function localizePath(locale: Locale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return `/${locale}${clean}`;
}

/** Hreflang alternates pro daný pathname (přijímá i lokalizovaný). */
export function getAlternates(pathname: string): { hreflang: string; href: string }[] {
  const { path } = stripLocale(pathname);
  const list = locales.map((loc) => ({
    hreflang: loc as string,
    href: new URL(localizePath(loc, path), SITE_ORIGIN).toString(),
  }));
  list.push({ hreflang: 'x-default', href: new URL(localizePath(defaultLocale, path), SITE_ORIGIN).toString() });
  return list;
}

/** Překlad klíče s fallbackem locale → cs → klíč. */
export function t(locale: Locale, key: string): string {
  return ui[locale]?.[key] ?? ui[defaultLocale][key] ?? key;
}

export function useTranslations(locale: Locale) {
  return (key: string) => t(locale, key);
}
