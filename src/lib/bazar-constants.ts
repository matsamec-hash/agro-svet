export const CATEGORIES = [
  { value: 'traktory', label: 'Traktory' },
  { value: 'kombajny', label: 'Kombajny' },
  // funkční skupiny (= mapování na katalog stroje)
  { value: 'zpracovani-pudy', label: 'Zpracování půdy' },
  { value: 'seti', label: 'Setí a sázení' },              // přejmenovaný `seci-stroje`
  { value: 'hnojeni', label: 'Hnojení' },
  { value: 'ochrana-rostlin', label: 'Ochrana rostlin' }, // přejmenovaný `postrikovace`
  { value: 'sklizen-picnin', label: 'Sklizeň pícnin a slámy' },
  { value: 'sklizen-okopanin', label: 'Sklizeň okopanin' },
  { value: 'manipulace', label: 'Manipulace a nakládání' },
  { value: 'doprava', label: 'Doprava' },                 // přejmenovaný `privezy`
  { value: 'staj-chov', label: 'Stáj a chov' },
  { value: 'komunal-les', label: 'Komunál a les' },
  // existující ne-strojové kategorie
  { value: 'nahradni-dily', label: 'Náhradní díly' },
  { value: 'prislusenstvi', label: 'Příslušenství' },
  { value: 'osiva-hnojiva', label: 'Osiva a hnojiva' },
  { value: 'pozemky', label: 'Pozemky' },
  { value: 'zvirata', label: 'Zvířata' },
  { value: 'sluzby', label: 'Služby' },
  { value: 'ostatni', label: 'Ostatní' },
] as const;

export const BRANDS = [
  // existující traktorové (10 + Valtra fix)
  { value: 'john-deere', label: 'John Deere' },
  { value: 'claas', label: 'CLAAS' },
  { value: 'fendt', label: 'Fendt' },
  { value: 'zetor', label: 'Zetor' },
  { value: 'new-holland', label: 'New Holland' },
  { value: 'kubota', label: 'Kubota' },
  { value: 'case-ih', label: 'Case IH' },
  { value: 'massey-ferguson', label: 'Massey Ferguson' },
  { value: 'deutz-fahr', label: 'Deutz-Fahr' },
  { value: 'valtra', label: 'Valtra' },
  // NEW must-have stroje značky
  { value: 'lemken', label: 'Lemken' },
  { value: 'pottinger', label: 'Pöttinger' },
  { value: 'kuhn', label: 'Kuhn' },
  { value: 'amazone', label: 'Amazone' },
  { value: 'krone', label: 'Krone' },
  { value: 'horsch', label: 'Horsch' },
  { value: 'vaderstad', label: 'Väderstad' },
  { value: 'bednar', label: 'Bednar' },
  { value: 'manitou', label: 'Manitou' },
  { value: 'jcb', label: 'JCB' },
  { value: 'joskin', label: 'Joskin' },
  { value: 'kverneland', label: 'Kverneland' },
  // fallback
  { value: 'jina', label: 'Jiná' },
] as const;

// Mapping bazar category → catalog sub-categories (StrojKategorie slugs)
// Pomáhá CatalogPickeru filtrovat stroje katalog dle vybrané bazar kategorie.
export const BAZAR_TO_CATALOG_SUBCATEGORIES: Record<string, string[]> = {
  traktory: ['traktory'],
  kombajny: ['kombajny'],
  'zpracovani-pudy': ['pluhy', 'podmitace-diskove', 'podmitace-radlickove', 'kyprice', 'rotacni-brany', 'kompaktomaty', 'valce'],
  seti: ['seci-stroje-mechanicke', 'seci-stroje-pneumaticke', 'seci-stroje-presne', 'seci-kombinace', 'sazecky-brambor'],
  hnojeni: ['rozmetadla-mineralni', 'rozmetadla-statkova', 'cisterny-kejda', 'aplikatory-kejda'],
  'ochrana-rostlin': ['postrikovace-nesene', 'postrikovace-tazene', 'postrikovace-samojizdne'],
  'sklizen-picnin': ['zaci-stroje', 'obracece', 'shrnovace', 'lisy-valcove', 'lisy-hranolove', 'obalovace', 'rezacky-samojizdne', 'samosberaci-vozy'],
  'sklizen-okopanin': ['sklizece-brambor', 'sklizece-repy', 'vyoravace'],
  manipulace: ['celni-nakladace', 'teleskopy', 'kolove-nakladace', 'kloubove-nakladace', 'smykove-nakladace'],
  doprava: ['navesy-sklapeci', 'navesy-valnik', 'navesy-posuvne-dno', 'cisterny-voda', 'prepravniky-zrna'],
  'staj-chov': ['krmne-vozy', 'dojici-roboti', 'podestylace'],
  'komunal-les': ['mulcovace', 'stepkovace', 'lesni-vyvazecky'],
};

export type Category = typeof CATEGORIES[number]['value'];
export type Brand = typeof BRANDS[number]['value'];
