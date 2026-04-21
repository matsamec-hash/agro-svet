import jsyaml from 'js-yaml';

export type StrojKategorie = 'traktory' | 'kombajny';

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
  specs?: Record<string, string | number | null>;
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
  categories: Record<StrojKategorie, { name: string; series: StrojSeries[] }>;
}

export interface StrojFlatModel extends StrojModel {
  brand_slug: string;
  brand_name: string;
  category: StrojKategorie;
  series_slug: string;
  series_name: string;
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
