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

/** Per-locale launchnuté (přeložené → indexovatelné) prefixy. cs je default bez
 *  prefixu, gating se na něj neaplikuje. Zbytek dané /<locale> sekce zůstává
 *  noindex (servíruje cs tělo) dokud není lokalizován. */
export const LAUNCHED_PREFIXES: Record<Locale, string[]> = {
  cs: [],
  sk: ['/stroje', '/znacky', '/srovnani', '/novinky', '/kalkulacka', '/dotace', '/statistiky', '/puda', '/encyklopedie', '/jak-na-to', '/podminky-pouziti', '/zpracovani-osobnich-udaju', '/dsa-kontakt', '/redakce'],
  uk: ['/stroje', '/srovnani', '/znacky', '/encyklopedie', '/jak-na-to', '/puda'],
};

/** True, pokud cs-root cesta patří do launchnuté sekce daného locale. */
export function isLaunchedPath(locale: Locale, csRootPath: string): boolean {
  return (LAUNCHED_PREFIXES[locale] ?? []).some((p) => csRootPath === p || csRootPath.startsWith(`${p}/`));
}

/** Zpětně kompatibilní SK alias (volá ho Layout/sitemap; ponecháno kvůli minimal-diff). */
export const SK_LAUNCHED_PREFIXES = LAUNCHED_PREFIXES.sk;
export function isSkLaunchedPath(csRootPath: string): boolean {
  return isLaunchedPath('sk', csRootPath);
}

/** Cesty uvnitř launchnutých sekcí, které ALE pod /sk 404-ují (jsou prerendered,
 *  nemají SSR routu pokrytou middleware-rewritem). V navigaci je drž na cs, ať
 *  /sk odkaz nevede na 404. Ověřeno živě. (Hub /stroje/ SSR funguje, kategorie ne.) */
const SK_PRERENDERED_NAV_PATHS: string[] = [];

/** Lokalizuje navigační/footer href pro daný locale. Pro cs vrací href beze změny.
 *  Pro non-cs přidá `/sk` (resp. `/uk`) prefix POUZE u cest, které pod daným locale
 *  reálně fungují — tj. launchnuté sekce + home; nelaunchnuté a prerendered-pod-/sk
 *  cesty nechá na cs, aby menu nevedlo na 404 ani neservírovalo míchaný obsah. */
export function navHref(locale: Locale, href: string): string {
  if (locale === defaultLocale) return href;
  const root = href.replace(/\/+$/, '') || '/';
  if (root === '/') return localizePath(locale, href);
  if (isLaunchedPath(locale, root) && !SK_PRERENDERED_NAV_PATHS.includes(root)) return localizePath(locale, href);
  return href;
}

/** Cílová cesta přepínače jazyka. Když cílový locale danou cs-cestu nemá
 *  (skrytá novinková kategorie, nelaunchnutá sekce nebo prerendered-pod-/sk
 *  cesta), spadne na lokalizovaný hub místo 404 — uživatel reálně přepne jazyk
 *  místo přistání na chybě. cs je kanonické → vrací cestu beze změny.
 *  `hiddenNewsCats` = skryté novinkové kategorie cílového locale. */
export function langSwitchHref(target: Locale, path: string, hiddenNewsCats: string[]): string {
  if (target === defaultLocale) return localizePath(target, path);
  const catMatch = path.match(/^\/novinky\/kategorie\/([^/]+)\/?$/);
  if (catMatch && hiddenNewsCats.includes(catMatch[1])) return localizePath(target, '/novinky/');
  const root = path.replace(/\/+$/, '') || '/';
  if (root !== '/' && (!isLaunchedPath(target, root) || SK_PRERENDERED_NAV_PATHS.includes(root))) {
    return localizePath(target, '/');
  }
  return localizePath(target, path);
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

/** Pluralizace.
 *  cs/sk: 1 / 2–4 / 5+.
 *  uk (východoslovanská): one = n%10==1 & n%100!=11; few = n%10∈2..4 & n%100∉12..14;
 *  many = zbytek (0, 5–20, x5–x9, 11–14). Tři tvary se mapují na stejné `forms`
 *  (one = nominativ sg, few = tvar 2–4, many = genitiv pl). */
export function plural(
  locale: Locale,
  n: number,
  forms: { one: string; few: string; many: string },
): string {
  const abs = Math.abs(n);
  if (locale === 'uk') {
    const mod10 = abs % 10;
    const mod100 = abs % 100;
    if (mod10 === 1 && mod100 !== 11) return forms.one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms.few;
    return forms.many;
  }
  if (abs === 1) return forms.one;
  if (abs >= 2 && abs <= 4) return forms.few;
  return forms.many;
}
