/**
 * Pomocníci pro <head> v Layout.astro — čistá logika, aby šla otestovat mimo
 * Astro. Řeší dvě konkrétní vady nalezené auditem produkce:
 *  1) brand se v <title> zdvojoval („… | agro-svět | agro-svět.cz"),
 *  2) stránky /historie/* předávaly canonical relativně, což se propisovalo
 *     i do og:url, kde absolutní URL je povinná.
 */

import { truncateAtBoundary } from './structured-data';

export const SITE_ORIGIN = 'https://agro-svet.cz';
const BRAND = 'agro-svět.cz';

/** Koncový brand oddělený svislítkem/pomlčkou — „| agro-svět", „— agro-svět.cz". */
const TRAILING_BRAND = /\s*[|–—-]\s*agro-svět(\.cz)?\s*$/i;

/**
 * Sjednotí <title> na tvar „Titulek | agro-svět.cz" s brandem právě jednou.
 * Titulky, které mají brand uvnitř věty (homepage, /redakce/), nechá být.
 */
export function pageTitle(title: string): string {
  let t = (title ?? '').trim();
  for (let prev = ''; t !== prev; ) {
    prev = t;
    t = t.replace(TRAILING_BRAND, '').trim();
  }
  if (!t) return BRAND;
  return /agro-sv[ěe]t/i.test(t) ? t : `${t} | ${BRAND}`;
}

/** Absolutní URL z cesty i z už absolutní URL; doplní koncové lomítko u adresářů. */
export function absoluteUrl(pathOrUrl: string, origin: string = SITE_ORIGIN): string {
  const u = new URL(pathOrUrl, origin);
  const last = u.pathname.split('/').pop() ?? '';
  if (!u.pathname.endsWith('/') && !last.includes('.')) u.pathname = `${u.pathname}/`;
  return u.toString();
}

/**
 * Meta description delší než ~165 znaků Google v SERPu stejně ořízne — a to
 * natvrdo uprostřed slova. Nad hranicí zkracujeme sami na hranici věty (nebo
 * slova + výpustka), aby snippet dával smysl. Popisy generují šablony napříč
 * sekcemi i locale, takže je to jediné rozumné místo, kde to řešit.
 */
export function metaDescription(description: string, max = 160, limit = 165): string {
  const d = (description ?? '').replace(/\s+/g, ' ').trim();
  // Konec věty bereme jen když je blízko limitu (0,85) — jinak by se u popisu
  // se dvěma větami zahodila skoro polovina snippetu a v SERPu zůstalo místo ladem.
  return d.length > limit ? truncateAtBoundary(d, max, 0.85) : d;
}
