// Funkční skupiny strojů a cesty k jejich výpisům. Samostatný modul bez YAML
// importů — používá ho i middleware (legacy redirecty) a import lib/stroje by
// při startu serveru parsoval katalog všech značek. lib/stroje vše re-exportuje.
import type { StrojKategorie } from './stroje';

export const FUNCTIONAL_GROUPS = {
  'zpracovani-pudy': {
    name: 'Zpracování půdy',
    description: 'Pluhy, podmítače, kypřiče, brány, kompaktomaty a válce',
    categories: ['pluhy', 'podmitace-diskove', 'podmitace-radlickove', 'kyprice', 'rotacni-brany', 'kompaktomaty', 'valce'] as StrojKategorie[],
  },
  'seti': {
    name: 'Setí a sázení',
    description: 'Secí stroje (mechanické, pneumatické, přesné), sázečky',
    categories: ['seci-stroje-mechanicke', 'seci-stroje-pneumaticke', 'seci-stroje-presne', 'seci-kombinace', 'sazecky-brambor'] as StrojKategorie[],
  },
  'hnojeni': {
    name: 'Hnojení',
    description: 'Rozmetadla minerálních a statkových hnojiv, cisterny na kejdu, aplikátory',
    categories: ['rozmetadla-mineralni', 'rozmetadla-statkova', 'cisterny-kejda', 'aplikatory-kejda'] as StrojKategorie[],
  },
  'ochrana-rostlin': {
    name: 'Ochrana rostlin',
    description: 'Postřikovače nesené, tažené, samojízdné',
    categories: ['postrikovace-nesene', 'postrikovace-tazene', 'postrikovace-samojizdne'] as StrojKategorie[],
  },
  'sklizen-picnin': {
    name: 'Sklizeň pícnin a slámy',
    description: 'Žací stroje, obraceče, shrnovače, lisy, řezačky, samosběrací vozy',
    categories: ['zaci-stroje', 'obracece', 'shrnovace', 'lisy-valcove', 'lisy-hranolove', 'obalovace', 'rezacky-samojizdne', 'samosberaci-vozy'] as StrojKategorie[],
  },
  'sklizen-okopanin': {
    name: 'Sklizeň okopanin',
    description: 'Sklízeče brambor, řepy, vyorávače',
    categories: ['sklizece-brambor', 'sklizece-repy', 'vyoravace'] as StrojKategorie[],
  },
  'manipulace': {
    name: 'Manipulace a nakládání',
    description: 'Teleskopy, čelní/kolové/kloubové/smykové nakladače',
    categories: ['celni-nakladace', 'teleskopy', 'kolove-nakladace', 'kloubove-nakladace', 'smykove-nakladace'] as StrojKategorie[],
  },
  'doprava': {
    name: 'Doprava',
    description: 'Návěsy sklápěcí, valníkové, s posuvným dnem, cisterny na vodu, přepravníky zrna',
    categories: ['navesy-sklapeci', 'navesy-valnik', 'navesy-posuvne-dno', 'cisterny-voda', 'prepravniky-zrna'] as StrojKategorie[],
  },
  'staj-chov': {
    name: 'Stáj a chov',
    description: 'Krmné vozy, dojicí roboti, podestýlací stroje',
    categories: ['krmne-vozy', 'dojici-roboti', 'podestylace'] as StrojKategorie[],
  },
  'komunal-les': {
    name: 'Komunál a les',
    description: 'Mulčovače, štěpkovače, lesní vyvážečky',
    categories: ['mulcovace', 'stepkovace', 'lesni-vyvazecky'] as StrojKategorie[],
  },
} as const;

export type FunctionalGroupSlug = keyof typeof FUNCTIONAL_GROUPS;

export function getFunctionalGroupForCategory(cat: StrojKategorie): FunctionalGroupSlug | null {
  for (const [slug, group] of Object.entries(FUNCTIONAL_GROUPS)) {
    if ((group.categories as readonly string[]).includes(cat)) return slug as FunctionalGroupSlug;
  }
  return null;
}

/** Top-level klíče kategorií v YAML značek, které nejsou slugem žádné
 *  subkategorie (John Deere je má z doby před funkčními skupinami). */
export const LEGACY_CATEGORY_ALIASES: Readonly<Record<string, StrojKategorie>> = {
  rezacky: 'rezacky-samojizdne',
  postrikovace: 'postrikovace-samojizdne',
};

/**
 * Výpis „všechny značky" pro top-level klíč kategorie značky (cs cesta, bez
 * locale prefixu). Klíč bývá traktory/kombajny, funkční skupina (seti),
 * subkategorie (lisy-valcove) nebo legacy alias (rezacky). Dřív to každá
 * stránka skládala sama a subkategorie končily na /stroje/zemedelske-stroje/
 * <subkategorie>/ = 404 (skupina se jmenuje jinak).
 */
export function categoryListingPath(key: string): string {
  if (key === 'traktory' || key === 'kombajny') return `/stroje/${key}/`;
  if (key in FUNCTIONAL_GROUPS) return `/stroje/zemedelske-stroje/${key}/`;
  const sub = LEGACY_CATEGORY_ALIASES[key] ?? key;
  if (getFunctionalGroupForCategory(sub as StrojKategorie)) return `/stroje/${sub}/`;
  return '/stroje/zemedelske-stroje/';
}
