/**
 * Pure query logic for the registered crop varieties (odrudy) registry.
 */
import type { Variety } from "../data.js";

export const DEFAULT_LIMIT = 50;
export const MAX_LIMIT = 200;

export interface VarietySearchArgs {
  /** crop slug, e.g. "psenice-ozima", "brambory" */
  crop?: string;
  year_from?: number;
  year_to?: number;
  /** case-insensitive substring matched against name + udrzovatel */
  query?: string;
  limit?: number;
}

export interface VarietySearchResult {
  total: number;
  count: number;
  limit: number;
  results: Variety[];
}

export function listCropSlugs(varieties: Variety[]): string[] {
  return [...new Set(varieties.map((v) => v.plodina_slug))].sort();
}

export function searchCropVarieties(
  varieties: Variety[],
  args: VarietySearchArgs,
): VarietySearchResult {
  const crop = args.crop?.trim().toLowerCase();
  const q = args.query?.trim().toLowerCase();
  const limit = Math.min(Math.max(1, args.limit ?? DEFAULT_LIMIT), MAX_LIMIT);

  const matches = varieties.filter((v) => {
    if (crop && v.plodina_slug.toLowerCase() !== crop) return false;
    if (args.year_from != null) {
      if (v.rok_registrace == null || v.rok_registrace < args.year_from) return false;
    }
    if (args.year_to != null) {
      if (v.rok_registrace == null || v.rok_registrace > args.year_to) return false;
    }
    if (q) {
      const hay = `${v.name ?? ""} ${v.udrzovatel ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
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
