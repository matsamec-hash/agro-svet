/**
 * Pure query logic for the agro-svet **bazar** (used agricultural machinery &
 * equipment marketplace).
 *
 * Unlike the other tools, the bazar dataset is NOT static: it is live Supabase
 * data. The transport wires a `BazarFetcher` that returns the raw, already
 * PUBLIC-whitelisted + status='active' rows; this module holds the pure
 * filter/format logic so it is unit-testable without a database.
 *
 * PRIVACY: only public marketing fields are ever surfaced. The fetcher MUST NOT
 * select `phone`, `email`, `user_id` or any other PII — see BAZAR_PUBLIC_COLUMNS.
 */

export const DEFAULT_LIMIT = 30;
export const MAX_LIMIT = 100;

export const SITE_ORIGIN = "https://agro-svet.cz";

/**
 * The exact column list the fetcher may select from `bazar_listings`. Kept here
 * (next to the tool) as the single source of truth for what is public, so the
 * privacy line is reviewable in one place. No `phone`, `email`, `user_id`.
 */
export const BAZAR_PUBLIC_COLUMNS = [
  "id",
  "title",
  "description",
  "price",
  "category",
  "subcategory",
  "brand",
  "location",
  "model_slug",
  "year_of_manufacture",
  "power_hp",
  "hours_operated",
  "pracovni_zaber_m",
  "nosnost_kg",
  "objem_nadrze_l",
  "featured",
  "created_at",
] as const;

/** A raw public listing row as returned by the fetcher (see columns above). */
export interface BazarListingRow {
  id: string;
  title: string;
  description?: string | null;
  price?: number | null;
  category?: string | null;
  subcategory?: string | null;
  brand?: string | null;
  location?: string | null;
  model_slug?: string | null;
  year_of_manufacture?: number | null;
  power_hp?: number | null;
  hours_operated?: number | null;
  pracovni_zaber_m?: number | null;
  nosnost_kg?: number | null;
  objem_nadrze_l?: number | null;
  featured?: boolean | null;
  created_at?: string | null;
}

export interface BazarSearchArgs {
  /** Free-text substring matched against title + description + brand. */
  query?: string;
  /** Category, case-insensitive substring (e.g. "traktory"). */
  category?: string;
  /** Subcategory, case-insensitive substring. */
  subcategory?: string;
  /** Brand, case-insensitive substring (e.g. "zetor"). */
  brand?: string;
  price_min?: number;
  price_max?: number;
  power_min?: number; // horsepower (hp)
  power_max?: number; // horsepower (hp)
  /** Minimum year of manufacture. */
  year_from?: number;
  /** Location / region, case-insensitive substring (e.g. "Jihomoravský"). */
  region?: string;
  limit?: number;
}

export interface BazarHit {
  id: string;
  title: string;
  price: number | null;
  currency: "CZK" | null;
  category: string | null;
  subcategory: string | null;
  brand: string | null;
  location: string | null;
  year_of_manufacture: number | null;
  power_hp: number | null;
  hours_operated: number | null;
  pracovni_zaber_m: number | null;
  nosnost_kg: number | null;
  objem_nadrze_l: number | null;
  /** Short plain-text excerpt of the description (max 240 chars). */
  excerpt: string | null;
  /** Canonical public URL of the listing detail page. */
  url: string;
  created_at: string | null;
}

export interface BazarSearchResult {
  total: number;
  count: number;
  limit: number;
  results: BazarHit[];
}

/** A function that returns the raw public, active listing rows to search over. */
export type BazarFetcher = (
  args: BazarSearchArgs,
) => Promise<BazarListingRow[]>;

function excerpt(text: string | null | undefined): string | null {
  if (!text) return null;
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return null;
  return clean.length > 240 ? clean.slice(0, 239).trimEnd() + "…" : clean;
}

function toHit(row: BazarListingRow): BazarHit {
  const price = row.price ?? null;
  return {
    id: row.id,
    title: row.title,
    price,
    currency: price != null ? "CZK" : null,
    category: row.category ?? null,
    subcategory: row.subcategory ?? null,
    brand: row.brand ?? null,
    location: row.location ?? null,
    year_of_manufacture: row.year_of_manufacture ?? null,
    power_hp: row.power_hp ?? null,
    hours_operated: row.hours_operated ?? null,
    pracovni_zaber_m: row.pracovni_zaber_m ?? null,
    nosnost_kg: row.nosnost_kg ?? null,
    objem_nadrze_l: row.objem_nadrze_l ?? null,
    excerpt: excerpt(row.description),
    url: `${SITE_ORIGIN}/bazar/${row.id}`,
    created_at: row.created_at ?? null,
  };
}

/**
 * Pure search over already-fetched public listing rows. Applies every filter
 * (so it is the single source of truth, even when the DB pre-narrows), sorts
 * featured-first then newest-first, and maps to the safe public shape.
 */
export function searchBazar(
  rows: BazarListingRow[],
  args: BazarSearchArgs,
): BazarSearchResult {
  const limit = Math.min(Math.max(1, args.limit ?? DEFAULT_LIMIT), MAX_LIMIT);
  const query = args.query?.trim().toLowerCase();
  const category = args.category?.trim().toLowerCase();
  const subcategory = args.subcategory?.trim().toLowerCase();
  const brand = args.brand?.trim().toLowerCase();
  const region = args.region?.trim().toLowerCase();

  const matches = rows.filter((r) => {
    if (query) {
      const hay = `${r.title ?? ""} ${r.description ?? ""} ${r.brand ?? ""}`
        .toLowerCase();
      if (!hay.includes(query)) return false;
    }
    if (category && !(r.category ?? "").toLowerCase().includes(category)) {
      return false;
    }
    if (
      subcategory &&
      !(r.subcategory ?? "").toLowerCase().includes(subcategory)
    ) {
      return false;
    }
    if (brand && !(r.brand ?? "").toLowerCase().includes(brand)) return false;
    if (region && !(r.location ?? "").toLowerCase().includes(region)) {
      return false;
    }
    if (args.price_min != null) {
      if (r.price == null || r.price < args.price_min) return false;
    }
    if (args.price_max != null) {
      if (r.price == null || r.price > args.price_max) return false;
    }
    if (args.power_min != null) {
      if (r.power_hp == null || r.power_hp < args.power_min) return false;
    }
    if (args.power_max != null) {
      if (r.power_hp == null || r.power_hp > args.power_max) return false;
    }
    if (args.year_from != null) {
      if (
        r.year_of_manufacture == null ||
        r.year_of_manufacture < args.year_from
      ) {
        return false;
      }
    }
    return true;
  });

  matches.sort((a, b) => {
    const fa = a.featured ? 1 : 0;
    const fb = b.featured ? 1 : 0;
    if (fa !== fb) return fb - fa;
    return (b.created_at ?? "").localeCompare(a.created_at ?? "");
  });

  return {
    total: matches.length,
    count: Math.min(matches.length, limit),
    limit,
    results: matches.slice(0, limit).map(toHit),
  };
}
