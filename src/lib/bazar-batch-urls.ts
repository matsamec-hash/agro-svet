/**
 * Pure helper for the bazar batch import: turn a free-text blob of pasted
 * bazos.cz listing URLs (one per line, or space/comma separated) into a clean,
 * de-duplicated, capped list of valid bazos URLs.
 *
 * Keeps the admin batch endpoint's input handling testable without a network
 * or DB, and enforces a hard cap so one paste can't kick off hundreds of
 * scrapes against bazos.
 */

export const BATCH_MAX_URLS = 20;

const BAZOS_URL_RE = /^https?:\/\/([a-z0-9-]+\.)*bazos\.cz(\/|$)/i;

/** Is this a syntactically valid bazos.cz URL we are willing to import? */
export function isBazosUrl(url: string): boolean {
  return BAZOS_URL_RE.test(url.trim());
}

/**
 * Parse a pasted blob into a clean list of bazos URLs.
 * - splits on any whitespace or commas
 * - trims, drops empties and non-bazos tokens
 * - de-duplicates (preserving first-seen order)
 * - caps at `cap` (default BATCH_MAX_URLS)
 */
export function parseBatchUrls(text: string, cap = BATCH_MAX_URLS): string[] {
  const tokens = (text ?? '').split(/[\s,]+/);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of tokens) {
    const url = raw.trim();
    if (!url || !isBazosUrl(url) || seen.has(url)) continue;
    seen.add(url);
    out.push(url);
    if (out.length >= cap) break;
  }
  return out;
}
