// YAML imports parsed at compile-time by @modyfi/vite-plugin-yaml — no runtime js-yaml.

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
  image_credit_url?: string | null;
  image_credit?: string | null;
  image_license?: string | null;
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
  image_credit_url?: string | null;
  image_credit?: string | null;
  image_license?: string | null;
  /**
   * Family grouping for tile aggregation on brand page. When omitted,
   * seriesFamily(slug) computes a default from the slug.
   */
  family?: string;
  family_label?: string;
  /**
   * Sub-category override for brands organized by functional group (e.g. Kverneland uses
   * categories.zpracovani-pudy with series.subcategory: "pluhy"). When set, this is the
   * effective category for sitemap and listing-page routing.
   */
  subcategory?: StrojKategorie;
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
  /** Wikipedia article URL (cs preferred, fallback en). Used in JSON-LD sameAs. */
  wikipedia?: string;
  /** Wikidata entity URL (https://www.wikidata.org/wiki/Qxxxxx). Knowledge graph anchor. */
  wikidata?: string;
  /** Brand-level hero photo, decoupled from series tiles. Overrides the per-series cover pick. */
  hero_image?: string | null;
  hero_credit?: string | null;
  hero_credit_url?: string | null;
  hero_license?: string | null;
  categories: Partial<Record<StrojKategorie, { name: string; series: StrojSeries[] }>>;
}

export interface StrojFlatModel extends StrojModel {
  brand_slug: string;
  brand_name: string;
  /** Top-level category from YAML (e.g. "traktory" or "zpracovani-pudy"). */
  category: StrojKategorie;
  /** Effective sub-category for listing routing — series.subcategory if set, else category. */
  effective_category: StrojKategorie;
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

export function getEffectiveZaber(model: StrojModel): number | null {
  return model.pracovni_zaber_m ?? model.cutting_width_m ?? null;
}

export function getFunctionalGroupForCategory(cat: StrojKategorie): FunctionalGroupSlug | null {
  for (const [slug, group] of Object.entries(FUNCTIONAL_GROUPS)) {
    if ((group.categories as readonly string[]).includes(cat)) return slug as FunctionalGroupSlug;
  }
  return null;
}

// Vite plugin parses YAML at compile-time → default export is already an object.
const brandModules = import.meta.glob('/src/data/stroje/*.yaml', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>;

// Per-locale prose overlays: /src/data/stroje/<locale>/<slug>.yaml
// (country/description/category-names/series-descriptions). cs has no overlay.
const overlayModules = import.meta.glob('/src/data/stroje/*/*.yaml', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>;

interface StrojOverlay {
  country?: string;
  description?: string;
  categories?: Record<string, string>;
  series?: Record<string, string>;
  models?: Record<string, string>; // model.slug -> SK popis (Fáze stroje-detail)
}

function getOverlay(slug: string, locale: string): StrojOverlay | null {
  return (overlayModules[`/src/data/stroje/${locale}/${slug}.yaml`] as StrojOverlay) ?? null;
}

// Pure overlay merge: cs base + prose overlay → lokalizovaný brand. ov=null → base
// beze změny (cs identita). Nemutuje base (structuredClone). Exportováno kvůli testům.
// cs struktura zůstává single source of truth — mění se jen prose stringy.
export function applyStrojOverlay(base: StrojBrand, ov: StrojOverlay | null): StrojBrand {
  if (!ov) return base;
  const b = structuredClone(base) as any;
  if (ov.country) b.country = ov.country;
  if (ov.description) b.description = ov.description;
  for (const [ck, cat] of Object.entries(b.categories || {}) as [string, any][]) {
    if (ov.categories?.[ck]) cat.name = ov.categories[ck];
    for (const s of cat.series || []) {
      if (ov.series?.[s.slug]) s.description = ov.series[s.slug];
      for (const m of s.models || []) {
        if (ov.models?.[m.slug]) m.description = ov.models[m.slug];
      }
    }
  }
  return b as StrojBrand;
}

function localizeBrand(base: StrojBrand, locale: string): StrojBrand {
  return applyStrojOverlay(base, getOverlay(base.slug, locale));
}

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
    const parsed = raw as StrojBrand;
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

export function getBrand(slug: string, locale: string = 'cs'): StrojBrand | undefined {
  const base = getAllBrands().find((b) => b.slug === slug);
  if (!base || locale === 'cs') return base;
  return localizeBrand(base, locale);
}

export function getAllModels(): StrojFlatModel[] {
  if (cachedFlat) return cachedFlat;
  const flat: StrojFlatModel[] = [];
  for (const brand of getAllBrands()) {
    for (const [catKey, cat] of Object.entries(brand.categories || {})) {
      const category = catKey as StrojKategorie;
      for (const series of cat.series || []) {
        const effective_category = (series.subcategory as StrojKategorie | undefined) ?? category;
        for (const model of series.models || []) {
          flat.push({
            ...model,
            year_from: model.year_from ?? null,
            year_to: model.year_to ?? null,
            brand_slug: brand.slug,
            brand_name: brand.name,
            category,
            effective_category,
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

export function getSeries(brandSlug: string, seriesSlug: string, locale: string = 'cs'): { brand: StrojBrand; category: StrojKategorie; series: StrojSeries } | undefined {
  const brand = getBrand(brandSlug, locale);
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
