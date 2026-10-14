// Trvalé (301) přesměrování URL, které Google našel přes dřív rozbité interní
// odkazy. Volá middleware s cs cestou (bez locale prefixu) a výsledek si
// lokalizuje sám, takže pravidlo platí pro cs/sk/uk/pl najednou. Statické
// jednorázové redirecty dál patří do astro.config.mjs → `redirects`.
import { FUNCTIONAL_GROUPS, LEGACY_CATEGORY_ALIASES, getFunctionalGroupForCategory } from './stroje-skupiny';
import type { StrojKategorie } from './stroje';

/** Klíč kategorie → slug subkategorie s vlastním výpisem /stroje/<sub>/, jinak null. */
function listedSubcategory(key: string): string | null {
  if (key in FUNCTIONAL_GROUPS) return null;
  const sub = LEGACY_CATEGORY_ALIASES[key] ?? key;
  return getFunctionalGroupForCategory(sub as StrojKategorie) ? sub : null;
}

/**
 * Cílová cs cesta pro legacy URL, nebo null.
 *
 * 1. /stroje/zemedelske-stroje/<subkategorie>/ → /stroje/<subkategorie>/
 *    Drobečková navigace řad nářadí skládala skupinu ze subkategorie (Krone,
 *    John Deere ve všech jazycích). Pod /stroje/zemedelske-stroje/ žijí jen
 *    funkční skupiny (seti, sklizen-picnin…), ty se nepřesměrovávají.
 * 2. /stroje/rezacky/, /stroje/postrikovace/ → /stroje/rezacky-samojizdne/ …
 *    Legacy klíče kategorií John Deere, na které odkazovala stránka značky.
 * 3. /slovnik/<heslo>/<xx>.wikipedia.org/… → /slovnik/<heslo>/
 *    Odkaz na Wikipedii bez https:// se v prohlížeči složil jako relativní.
 */
export function legacyRedirectTarget(csPath: string): string | null {
  const zem = csPath.match(/^\/stroje\/zemedelske-stroje\/([^/]+)\/?$/);
  if (zem) {
    const sub = listedSubcategory(zem[1]);
    return sub ? `/stroje/${sub}/` : null;
  }
  const cat = csPath.match(/^\/stroje\/([^/]+)\/?$/);
  if (cat && cat[1] in LEGACY_CATEGORY_ALIASES) return `/stroje/${LEGACY_CATEGORY_ALIASES[cat[1]]}/`;
  const wiki = csPath.match(/^\/slovnik\/([^/]+)\/[a-z]{2,3}\.wikipedia\.org(?:\/|$)/);
  if (wiki) return `/slovnik/${wiki[1]}/`;
  return null;
}
