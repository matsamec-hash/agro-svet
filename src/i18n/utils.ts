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

/** Sekce, jejichž /sk verze jsou v Fázi 1c-obsah přeložené a tedy indexovatelné.
 *  Zbytek /sk zůstává noindex (servíruje cs tělo) dokud nebude lokalizován. */
export const SK_LAUNCHED_PREFIXES = ['/stroje', '/znacky', '/srovnani', '/novinky', '/kalkulacka'];

/** True, pokud cs-root cesta patří do launchnuté (přeložené) SK sekce. */
export function isSkLaunchedPath(csRootPath: string): boolean {
  return SK_LAUNCHED_PREFIXES.some((p) => csRootPath === p || csRootPath.startsWith(`${p}/`));
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

/** Lokalizovaný název kategorie novinek s fallbackem na surovou hodnotu.
 *  Reprodukuje původní `categoryLabels[category] ?? category`: pro známé
 *  kategorie vrátí překlad, pro neznámé surovou kategorii (ne klíč). */
export function localizedCategory(locale: Locale, category: string): string {
  const key = `nov.cat.${category}`;
  const val = t(locale, key);
  return val === key ? category : val;
}

/** Překlad s interpolací {token} → params[token]. Fallback locale→cs→klíč. */
export function tf(locale: Locale, key: string, params: Record<string, string | number>): string {
  const tmpl = ui[locale]?.[key] ?? ui[defaultLocale][key] ?? key;
  return tmpl.replace(/\{(\w+)\}/g, (_, k) => (k in params ? String(params[k]) : `{${k}}`));
}

/** Pluralizace pro cs/sk (1 / 2–4 / 5+). uk dostane vlastní pravidla ve Fázi 3. */
export function plural(
  _locale: Locale,
  n: number,
  forms: { one: string; few: string; many: string },
): string {
  const abs = Math.abs(n);
  if (abs === 1) return forms.one;
  if (abs >= 2 && abs <= 4) return forms.few;
  return forms.many;
}
