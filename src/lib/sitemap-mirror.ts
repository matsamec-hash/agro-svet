// Brány pro locale mirrory sitemapy.
//
// PROČ VLASTNÍ MODUL: mirrory pro sk/uk/pl/de byly čtyři nezávislé `.filter()`
// bloky v sitemap.xml.ts, každý s vlastní sadou bran. Postupným přidáváním
// jazyků se rozešly — `de` přibylo jako poslední a nedostalo ANI JEDNU ze čtyř
// bran, které měly ostatní. Do produkční sitemapy tak šlo 2 710 detailů odrůd
// + 2 cs-only kvízy (302 na cs) a ~45 novinkových a howto URL, které 404-ují.
// Typy `'sk' | 'uk' | 'pl'` navíc `de` do bran nepustily ani omylem.
//
// Gate je proto JEDEN a je per-locale datový, ne větvený: nový jazyk dostane
// všechny brány automaticky a rozdíly se deklarují daty, ne kopií filtru.
import { isLaunchedPath, isPrerenderedOnlyPath } from '../i18n/utils';
import { isLockedSectionPath, HIDDEN_NEWS_CATEGORIES } from '../i18n/nav';

export type MirrorLocale = 'sk' | 'uk' | 'pl' | 'de';

/** Pořadí je závazné: každý mirror vylučuje už zrcadlené cesty těch před ním,
 *  aby se mirror nezrcadlil sám do sebe. */
export const MIRROR_LOCALES: readonly MirrorLocale[] = ['sk', 'uk', 'pl', 'de'];

export interface ArticleMeta {
  id: string;
  category: string | null;
}

export interface MirrorContext {
  /** cs slug → metadata publikovaného článku. */
  articleMeta: Map<string, ArticleMeta>;
  /** locale → id článků, které v daném jazyce REÁLNĚ mají překlad. */
  translatedIds: Map<MirrorLocale, Set<string>>;
  /** locale → slugy návodů v overlay kolekci. Chybí-li locale, /jak-na-to
   *  pro něj není launchnuté a bránu není co aplikovat. */
  howtoSlugs: Map<MirrorLocale, Set<string>>;
}

const ARTICLE_SLUG = /^\/novinky\/([^/]+)\/$/;
const CATEGORY_SLUG = /^\/novinky\/kategorie\/([^/]+)\//;
const HOWTO_SLUG = /^\/jak-na-to\/([^/]+)\/$/;

/** Detail dotace: sk má pro ně VLASTNÍ slugy (výzvy PPA SR z kolekce dotaceSk),
 *  takže cs slug zrcadlit nelze — přidávají se explicitně. Hub a kalendář kol
 *  cestu sdílejí. */
export function isDotaceDetailPath(p: string): boolean {
  return p.startsWith('/dotace/') && p !== '/dotace/' && p !== '/dotace/kalendar-kol/';
}

/** Jurisdikčně skrytá novinková kategorie (dotace, legislativa) pod locale 404-uje. */
export function isHiddenCategoryPath(p: string, locale: MirrorLocale): boolean {
  const m = p.match(CATEGORY_SLUG);
  return !!m && HIDDEN_NEWS_CATEGORIES[locale].includes(m[1]);
}

/** True, když /<locale>/novinky/<slug>/ na produkci 404-uje: buď je kategorie
 *  jurisdikčně skrytá, nebo článek v daném jazyce nemá překlad. */
export function isDeadArticleForLocale(p: string, locale: MirrorLocale, ctx: MirrorContext): boolean {
  const m = p.match(ARTICLE_SLUG);
  if (!m) return false;
  const meta = ctx.articleMeta.get(m[1]);
  if (!meta) return false; // není článek (např. /novinky/kategorie/) → řeší jiná brána
  if (meta.category && HIDDEN_NEWS_CATEGORIES[locale].includes(meta.category)) return true;
  return !(ctx.translatedIds.get(locale)?.has(meta.id) ?? false);
}

/** True, když cs návod nemá v daném jazyce overlay → /<locale>/jak-na-to/<slug>/
 *  vrací 404 (záměrně, u jurisdikčních návodů), takže do sitemapy nepatří. */
export function isMissingHowto(p: string, locale: MirrorLocale, ctx: MirrorContext): boolean {
  const m = p.match(HOWTO_SLUG);
  if (!m) return false;
  const slugs = ctx.howtoSlugs.get(locale);
  return !!slugs && !slugs.has(m[1]);
}

/** Cesty, které daný locale zrcadlí nad rámec společných bran NEZRCADLÍ.
 *  Deklarované daty, ať se nový jazyk nemusí ptát na výjimky cizích jazyků. */
const EXTRA_EXCLUDES: Partial<Record<MirrorLocale, readonly string[]>> = {
  // uk: /uk/dotace/kalendar-kol/ 302-uje na /uk/dotace/ (sk ho naopak má).
  uk: ['/dotace/kalendar-kol/'],
};

/** Jediná brána mirroru. `p` je cs-root cesta (bez locale prefixu). */
export function allowInMirror(p: string, locale: MirrorLocale, ctx: MirrorContext): boolean {
  if (EXTRA_EXCLUDES[locale]?.includes(p)) return false;
  if (isDotaceDetailPath(p)) return false;
  if (isHiddenCategoryPath(p, locale)) return false;
  if (isDeadArticleForLocale(p, locale, ctx)) return false;
  if (isMissingHowto(p, locale, ctx)) return false;
  // Lock přebíjí launch: zamčené pod-cesty (/kalkulacka/dotace-cap) 307-ují na cs.
  // isPrerenderedOnlyPath drží mimo detaily odrůd a nelokalizované kvízy.
  return isLaunchedPath(locale, p) && !isLockedSectionPath(p) && !isPrerenderedOnlyPath(p);
}
