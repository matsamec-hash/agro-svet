/**
 * Pure query logic for agricultural machinery (brands -> categories -> series -> models).
 */
import type { MachineryBrand } from "../data.js";

export const DEFAULT_LIMIT = 50;
export const MAX_LIMIT = 200;

export interface MachinerySearchArgs {
  /** brand slug or name, case-insensitive substring, e.g. "fendt" */
  brand?: string;
  /** category key or label, case-insensitive substring, e.g. "traktory" */
  category?: string;
  power_min?: number; // horsepower (hp)
  power_max?: number; // horsepower (hp)
  /** model in production during this year (year_from <= year <= year_to) */
  year?: number;
  limit?: number;
}

export interface MachineryHit {
  brandSlug: string;
  brandName: string;
  category: string;
  categoryLabel: string;
  series: string;
  model: string;
  slug: string;
  year_from: number | null;
  year_to: number | null;
  power_hp: number | null;
  power_kw: number | null;
  engine: string | null;
}

export interface MachinerySearchResult {
  total: number;
  count: number;
  limit: number;
  results: MachineryHit[];
}

function flatten(brands: MachineryBrand[]): MachineryHit[] {
  const out: MachineryHit[] = [];
  for (const b of brands) {
    for (const [catKey, cat] of Object.entries(b.categories ?? {})) {
      for (const s of cat.series ?? []) {
        for (const m of s.models ?? []) {
          out.push({
            brandSlug: b.slug,
            brandName: b.name,
            category: catKey,
            categoryLabel: cat.name,
            series: s.name,
            model: m.name,
            slug: m.slug,
            year_from: m.year_from ?? null,
            year_to: m.year_to ?? null,
            power_hp: m.power_hp ?? null,
            power_kw: m.power_kw ?? null,
            engine: m.engine ?? null,
          });
        }
      }
    }
  }
  return out;
}

export function listMachineryFacets(brands: MachineryBrand[]): {
  brands: { slug: string; name: string }[];
  categories: { key: string; label: string }[];
} {
  const cats = new Map<string, string>();
  for (const b of brands) {
    for (const [k, c] of Object.entries(b.categories ?? {})) {
      if (!cats.has(k)) cats.set(k, c.name);
    }
  }
  return {
    brands: brands.map((b) => ({ slug: b.slug, name: b.name })),
    categories: [...cats.entries()]
      .map(([key, label]) => ({ key, label }))
      .sort((a, b) => a.key.localeCompare(b.key)),
  };
}

export function searchMachinery(
  brands: MachineryBrand[],
  args: MachinerySearchArgs,
): MachinerySearchResult {
  const brand = args.brand?.trim().toLowerCase();
  const category = args.category?.trim().toLowerCase();
  const limit = Math.min(Math.max(1, args.limit ?? DEFAULT_LIMIT), MAX_LIMIT);

  const matches = flatten(brands).filter((h) => {
    if (brand) {
      const hay = `${h.brandSlug} ${h.brandName}`.toLowerCase();
      if (!hay.includes(brand)) return false;
    }
    if (category) {
      const hay = `${h.category} ${h.categoryLabel}`.toLowerCase();
      if (!hay.includes(category)) return false;
    }
    if (args.power_min != null) {
      if (h.power_hp == null || h.power_hp < args.power_min) return false;
    }
    if (args.power_max != null) {
      if (h.power_hp == null || h.power_hp > args.power_max) return false;
    }
    if (args.year != null) {
      const from = h.year_from;
      const to = h.year_to ?? new Date().getFullYear();
      if (from == null) return false;
      if (args.year < from || args.year > to) return false;
    }
    return true;
  });

  return {
    total: matches.length,
    count: Math.min(matches.length, limit),
    limit,
    results: matches.slice(0, limit),
  };
}
