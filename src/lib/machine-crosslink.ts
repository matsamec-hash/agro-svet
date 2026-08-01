// Cross-link mezi dvěma stránkami téhož stroje:
//   /encyklopedie/<slug>/          = redakční recenze + video + verdikt (E-E-A-T)
//   /stroje/<brand>/<series>/<m>/  = technická data + živé bazarové ceny
// Obě dřív self-canonical a bez vzájemného odkazu → keyword kanibalizace.
// Tento helper páruje entity, aby stránky mohly na sebe odkazovat (obousměrně)
// a emitovat sameAs (Google spojí do jedné entity, každá URL jiný search intent).

import { getCollection } from 'astro:content';
import { getModelBySlug } from './stroje';

const ENC_COLLECTIONS = { cs: 'encyklopedie', sk: 'encyklopedieSk', uk: 'encyklopedieUk', pl: 'encyklopediePl' } as const;

// Encyklopedie URL slug → stroje model slug pro hrstku záznamů, jejichž enc slug
// se liší od katalogového (varianty pojmenování). Zbytek (39/42) mapuje 1:1 dle slug.
const ENC_TO_STROJE_SLUG: Record<string, string> = {
  'case-ih-axial-flow-9250': 'case-ih-9250',
  'john-deere-6r-250': 'john-deere-6r-250-gen3',
  'zetor-proxima-120': 'zetor-proxima-power-120',
};
const STROJE_TO_ENC_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(ENC_TO_STROJE_SLUG).map(([enc, stroje]) => [stroje, enc]),
);

/** cs-root /stroje/ URL (data + ceny) pro encyklopedický záznam dle jeho URL slug, nebo null. */
export function strojeUrlForEncSlug(encSlug: string): string | null {
  const strojeSlug = ENC_TO_STROJE_SLUG[encSlug] ?? encSlug;
  const m = getModelBySlug(strojeSlug);
  if (!m) return null;
  const short = m.slug.startsWith(m.brand_slug + '-') ? m.slug.slice(m.brand_slug.length + 1) : m.slug;
  return `/stroje/${m.brand_slug}/${m.series_slug}/${short}/`;
}

const encSlugCache = new Map<string, Set<string>>();
async function encSlugSet(locale: string): Promise<Set<string>> {
  const coll = ENC_COLLECTIONS[locale as keyof typeof ENC_COLLECTIONS] ?? 'encyklopedie';
  let set = encSlugCache.get(coll);
  if (!set) {
    try {
      const items = await getCollection(coll as 'encyklopedie');
      set = new Set(items.map((i) => i.id));
    } catch {
      set = new Set();
    }
    encSlugCache.set(coll, set);
  }
  return set;
}

/** cs-root /encyklopedie/ URL (recenze) pro stroje model slug, JEN pokud recenze v daném
 *  locale existuje (overlay kolekce 404uje bez cs fallbacku → nesmíme linkovat naslepo). */
export async function encUrlForStrojeSlug(strojeSlug: string, locale: string): Promise<string | null> {
  const encSlug = STROJE_TO_ENC_SLUG[strojeSlug] ?? strojeSlug;
  const set = await encSlugSet(locale);
  return set.has(encSlug) ? `/encyklopedie/${encSlug}/` : null;
}
