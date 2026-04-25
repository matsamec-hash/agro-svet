import jsyaml from 'js-yaml';

export type StrojKategorie =
  | 'traktory' | 'kombajny'
  // zpracování půdy (7)
  | 'pluhy' | 'podmitace-diskove' | 'podmitace-radlickove'
  | 'kyprice' | 'rotacni-brany' | 'kompaktomaty' | 'valce'
  // setí (5)
  | 'seci-stroje-mechanicke' | 'seci-stroje-pneumaticke' | 'seci-stroje-presne'
  | 'seci-kombinace' | 'sazecky-brambor'
  // hnojení (4)
  | 'rozmetadla-mineralni' | 'rozmetadla-statkova' | 'cisterny-kejda' | 'aplikatory-kejda'
  // ochrana rostlin (3)
  | 'postrikovace-nesene' | 'postrikovace-tazene' | 'postrikovace-samojizdne'
  // sklizeň pícnin (8)
  | 'zaci-stroje' | 'obracece' | 'shrnovace'
  | 'lisy-valcove' | 'lisy-hranolove' | 'obalovace'
  | 'rezacky-samojizdne' | 'samosberaci-vozy'
  // sklizeň okopanin (3)
  | 'sklizece-brambor' | 'sklizece-repy' | 'vyoravace'
  // manipulace (5)
  | 'celni-nakladace' | 'teleskopy' | 'kolove-nakladace'
  | 'kloubove-nakladace' | 'smykove-nakladace'
  // doprava (5)
  | 'navesy-sklapeci' | 'navesy-valnik' | 'navesy-posuvne-dno'
  | 'cisterny-voda' | 'prepravniky-zrna'
  // stáj-chov (3)
  | 'krmne-vozy' | 'dojici-roboti' | 'podestylace'
  // komunál-les (3)
  | 'mulcovace' | 'stepkovace' | 'lesni-vyvazecky';

export interface StrojModel {
  slug: string;
  name: string;
  year_from: number | null;
  year_to: number | null;
  power_hp: number | null;
  power_kw: number | null;
  engine?: string;
  transmission?: string;
  weight_kg?: number | null;
  cutting_width_m?: number | null;
  grain_tank_l?: number | null;
  description?: string;
  image_url?: string | null;
  specs?: Record<string, string | number | boolean | null>;
  // NEW optional fields
  pracovni_zaber_m?: number | null;
  prikon_traktor_hp_min?: number | null;
  prikon_traktor_hp_max?: number | null;
  typ_zavesu?: 'neseny' | 'tazeny' | 'poloneseny' | 'samojizdny' | 'navesny' | null;
}

export interface StrojSeries {
  slug: string;
  name: string;
  year_from: number | null;
  year_to: number | null;
  description?: string;
  image_url?: string | null;
  models: StrojModel[];
}

export interface StrojBrand {
  slug: string;
  name: string;
  country: string;
  founded: number;
  website?: string;
  logo?: string;
  description?: string;
  categories: Partial<Record<StrojKategorie, { name: string; series: StrojSeries[] }>>;
}

export interface StrojFlatModel extends StrojModel {
  brand_slug: string;
  brand_name: string;
  category: StrojKategorie;
  series_slug: string;
  series_name: string;
}

export const FUNCTIONAL_GROUPS = {
  'zpracovani-pudy': {
    name: 'Zpracování půdy',
    description: 'Pluhy, podmítače, kypřiče, brány, kompaktomaty a válce',
    categories: ['pluhy', 'podmitace-diskove', 'podmitace-radlickove', 'kyprice', 'rotacni-brany', 'kompaktomaty', 'valce'] as StrojKategorie[],
  },
  'seti': {
    name: 'Setí a sázení',
    description: 'Secí stroje (mechanické, pneumatické, přesné), sázečky',
    categories: ['seci-stroje-mechanicke', 'seci-stroje-pneumaticke', 'seci-stroje-presne', 'seci-kombinace'] as StrojKategorie[],
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

export function getEffectiveZaber(model: StrojModel): number | null {
  return model.pracovni_zaber_m ?? model.cutting_width_m ?? null;
}

export function getFunctionalGroupForCategory(cat: StrojKategorie): FunctionalGroupSlug | null {
  for (const [slug, group] of Object.entries(FUNCTIONAL_GROUPS)) {
    if ((group.categories as readonly string[]).includes(cat)) return slug as FunctionalGroupSlug;
  }
  return null;
}

const brandModules = import.meta.glob('/src/data/stroje/*.yaml', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

let cachedBrands: StrojBrand[] | null = null;
let cachedFlat: StrojFlatModel[] | null = null;

function coerceSlug(value: unknown): string {
  return typeof value === 'string' ? value : String(value);
}

function normalizeBrand(raw: any): StrojBrand {
  raw.slug = coerceSlug(raw.slug);
  for (const cat of Object.values(raw.categories || {}) as any[]) {
    for (const series of cat.series || []) {
      series.slug = coerceSlug(series.slug);
      for (const model of series.models || []) {
        model.slug = coerceSlug(model.slug);
      }
    }
  }
  return raw as StrojBrand;
}

export function getAllBrands(): StrojBrand[] {
  if (cachedBrands) return cachedBrands;
  const brands: StrojBrand[] = [];
  for (const [path, raw] of Object.entries(brandModules)) {
    const parsed = jsyaml.load(raw) as StrojBrand;
    if (!parsed?.slug) {
      console.warn(`[stroje] Missing brand slug in ${path}`);
      continue;
    }
    brands.push(normalizeBrand(parsed));
  }
  brands.sort((a, b) => a.name.localeCompare(b.name, 'cs'));
  cachedBrands = brands;
  return brands;
}

export function getBrand(slug: string): StrojBrand | undefined {
  return getAllBrands().find((b) => b.slug === slug);
}

export function getAllModels(): StrojFlatModel[] {
  if (cachedFlat) return cachedFlat;
  const flat: StrojFlatModel[] = [];
  for (const brand of getAllBrands()) {
    for (const [catKey, cat] of Object.entries(brand.categories || {})) {
      const category = catKey as StrojKategorie;
      for (const series of cat.series || []) {
        for (const model of series.models || []) {
          flat.push({
            ...model,
            brand_slug: brand.slug,
            brand_name: brand.name,
            category,
            series_slug: series.slug,
            series_name: series.name,
          });
        }
      }
    }
  }
  cachedFlat = flat;
  return flat;
}

export function getModelBySlug(slug: string): StrojFlatModel | undefined {
  return getAllModels().find((m) => m.slug === slug);
}

export function getSeries(brandSlug: string, seriesSlug: string): { brand: StrojBrand; category: StrojKategorie; series: StrojSeries } | undefined {
  const brand = getBrand(brandSlug);
  if (!brand) return undefined;
  for (const [catKey, cat] of Object.entries(brand.categories || {})) {
    const s = cat.series.find((x) => x.slug === seriesSlug);
    if (s) return { brand, category: catKey as StrojKategorie, series: s };
  }
  return undefined;
}

export function seriesFamily(slug: string): string {
  if (/^\d/.test(slug)) return slug[0];
  const m = slug.match(/^([a-z]+)/);
  return m ? m[1] : slug;
}

export function familyLabel(family: string): string {
  if (/^\d+$/.test(family)) return `${family}. řada`;
  if (family.length <= 4) return family.toUpperCase();
  return family[0].toUpperCase() + family.slice(1);
}

export function formatPowerRange(models: StrojModel[]): string {
  const hps = models.map((m) => m.power_hp).filter((x): x is number => typeof x === 'number');
  if (hps.length === 0) return '';
  const min = Math.min(...hps);
  const max = Math.max(...hps);
  return min === max ? `${min} k` : `${min}–${max} k`;
}

export function formatYearRange(yearFrom: number | null, yearTo: number | null): string {
  if (!yearFrom) return '';
  if (!yearTo) return `${yearFrom}–dosud`;
  return `${yearFrom}–${yearTo}`;
}
