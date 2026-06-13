// Per-dataset content modification dates, baked at build time from git history by
// scripts/gen-content-dates.mjs. The sitemap reads these so a URL's <lastmod>
// reflects when its CONTENT last changed — not the build/request date. Emitting a
// fresh "today" for every URL on every deploy makes Google distrust lastmod and
// ignore it; stable, accurate per-dataset dates restore it as a recrawl signal.
import contentDates from '../generated/content-dates.json';

/** Last-resort date if the generated map lacks both the key and `_fallback`. */
export const FALLBACK_LASTMOD = '2026-06-13';

export type ContentDateMap = Record<string, string | undefined>;

/** Pure resolver: dataset date → map `_fallback` → hardcoded FALLBACK_LASTMOD. */
export function resolveDatasetDate(map: ContentDateMap, key: string): string {
  return map[key] ?? map._fallback ?? FALLBACK_LASTMOD;
}

/** Resolve a dataset's lastmod from the build-generated content-dates map. */
export function dsDate(key: string): string {
  return resolveDatasetDate(contentDates as ContentDateMap, key);
}
