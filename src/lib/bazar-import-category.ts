import { BRANDS } from './bazar-constants';

// Klíčová slova → kategorie (value z CATEGORIES v bazar-constants.ts).
// Pořadí = priorita (první shoda vyhrává). Bez diakritiky a lowercase se porovnává.
const RULES: Array<[string[], string]> = [
  [['traktor'], 'traktory'],
  [['kombajn', 'sklizec', 'mlaticka'], 'kombajny'],
  [['pluh', 'brany', 'podmitac', 'kypric', 'radlic'], 'zpracovani-pudy'],
  [['seci', 'secka', 'sazec', 'secí', 'sadzac'], 'seti'],
  [['rozmetadlo', 'hnojiv', 'cisternu na kejdu', 'kejda'], 'hnojeni'],
  [['postrikovac', 'postrik', 'ochrana rostlin'], 'ochrana-rostlin'],
  [['lis na seno', 'lis na slamu', 'obraceč', 'shrnovac', 'balikovac', 'senaz'], 'sklizen-picnin'],
  [['vyorava', 'sklizec brambor', 'skliznova repy'], 'sklizen-okopanin'],
  [['nakladac', 'manipulator', 'celni nakladac', 'paletovaci'], 'manipulace'],
  [['privesu', 'privesy', 'valnik', 'navesu', 'preprava'], 'doprava'],
  [['dojici', 'staj', 'napajecka', 'chov', 'krmny'], 'staj-chov'],
  [['stepkovac', 'mulcovac', 'komunal', 'lesni', 'stipac', 'motorova pila'], 'komunal-les'],
  [['nahradni dil', 'nd na', 'pneumatik'], 'nahradni-dily'],
  [['osivo', 'hnojivo', 'sadba'], 'osiva-hnojiva'],
  [['pozemek', 'pole', 'orna puda', 'louka'], 'pozemky'],
  [['jalovic', 'krava', 'bik', 'tele', 'prase', 'ovce', 'kuze', 'slepic', 'kral'], 'zvirata'],
];

function normalize(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/** Navrhne kategorii z názvu + popisu. Fallback 'ostatni'. */
export function suggestCategory(title: string, description: string): string {
  const hay = normalize(`${title} ${description}`);
  for (const [keywords, category] of RULES) {
    if (keywords.some((k) => hay.includes(normalize(k)))) return category;
  }
  return 'ostatni';
}

// Značky, které se v textu píší jinak než jejich slug (jinak se matchuje label i slug).
const BRAND_ALIASES: Record<string, string[]> = {
  'new-holland': ['new holland', 'newholland'],
  'case-ih': ['case ih', 'caseih', 'case'],
  'deutz-fahr': ['deutz-fahr', 'deutz fahr', 'deutz'],
  'massey-ferguson': ['massey ferguson', 'massey'],
  'john-deere': ['john deere', 'johndeere'],
};

/** Deterministicky určí značku ze seznamu BRANDS podle názvu/popisu. null když nejde. */
export function matchBrand(title: string, description: string): string | null {
  const hay = normalize(`${title} ${description}`);
  for (const b of BRANDS) {
    if (b.value === 'jina') continue;
    const needles = [b.value.replace(/-/g, ' '), normalize(b.label), ...(BRAND_ALIASES[b.value] ?? [])];
    if (needles.some((n) => n && hay.includes(normalize(n)))) return b.value;
  }
  return null;
}
