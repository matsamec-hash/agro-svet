// Geocoding helper used by /api/geocode + the backfill script.
//
// Strategy (cheapest-first):
//   1. Local pre-baked dataset (lookupCzLocation) — instant, free, covers
//      14 krajů + ~230 cities. ~95% hit rate for typical user inputs.
//   2. Nominatim OSM API — fallback for edge cases (PSČ-only, smaller
//      villages). Rate-limited to 1 req/s per Nominatim TOS, so the
//      server-side endpoint should throttle callers too.
//
// Returned coords are always WGS84 decimal degrees.

import { lookupCzLocation } from './cz-locations-geo';

export interface GeocodeResult {
  lat: number;
  lng: number;
  /** Where the answer came from. */
  source: 'local' | 'nominatim';
  /** Free-text label the geocoder resolved (may differ from input). */
  displayName?: string;
}

export interface GeocodeInput {
  /** Free-text place name (city, region, address). */
  location?: string;
  /** Optional Czech PSČ. Preferred over location when present. */
  postalCode?: string;
}

const NOMINATIM_UA = 'agro-svet bazar map (info@samecdigital.com)';
const NOMINATIM_ENDPOINT = 'https://nominatim.openstreetmap.org/search';

export async function geocode(input: GeocodeInput): Promise<GeocodeResult | null> {
  const location = (input.location ?? '').trim();
  const postalCode = (input.postalCode ?? '').replace(/\s+/g, '').trim();

  // Local lookup first — free, instant.
  if (location) {
    const hit = lookupCzLocation(location);
    if (hit) return { lat: hit.lat, lng: hit.lng, source: 'local' };
  }

  // Fallback: Nominatim. Prefer PSČ when present (unambiguous in CZ).
  const params = new URLSearchParams({
    format: 'json',
    limit: '1',
    countrycodes: 'cz',
    'accept-language': 'cs',
  });
  if (postalCode) {
    params.set('postalcode', postalCode);
    if (location) params.set('city', location);
  } else if (location) {
    params.set('q', location);
  } else {
    return null;
  }
  const url = `${NOMINATIM_ENDPOINT}?${params}`;
  try {
    const r = await fetch(url, { headers: { 'User-Agent': NOMINATIM_UA } });
    if (!r.ok) return null;
    const arr = (await r.json()) as Array<{ lat: string; lon: string; display_name?: string }>;
    if (!Array.isArray(arr) || arr.length === 0) return null;
    const lat = parseFloat(arr[0].lat);
    const lng = parseFloat(arr[0].lon);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
    return { lat, lng, source: 'nominatim', displayName: arr[0].display_name };
  } catch {
    return null;
  }
}

/** Quick sanity: is this a plausible Czech coordinate pair? */
export function isPlausibleCzCoord(lat: number, lng: number): boolean {
  return lat >= 48.5 && lat <= 51.1 && lng >= 12.0 && lng <= 18.9;
}
