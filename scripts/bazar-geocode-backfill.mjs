#!/usr/bin/env node
// One-shot backfill: pull every bazar_listings row that has a non-empty
// location but no latitude/longitude, run it through geocode(), and
// persist coords. Re-runnable — skips rows that are already geocoded.
//
// Usage:
//   node --env-file=.env scripts/bazar-geocode-backfill.mjs --dry-run
//   node --env-file=.env scripts/bazar-geocode-backfill.mjs
//   node --env-file=.env scripts/bazar-geocode-backfill.mjs --limit=20
//
// Strategy:
//   1. Local lookup first (lookupCzLocation, free, instant).
//   2. Nominatim fallback at 1 req/s.
// Listings whose location can't be matched stay NULL (excluded from the
// map but otherwise displayed normally).

import { createClient } from '@supabase/supabase-js';
import { CZ_LOCATIONS_GEO } from '../src/lib/cz-locations-geo.ts';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_KEY. Run with --env-file=.env');
  process.exit(1);
}

const NOMINATIM_UA = 'agro-svet bazar geocode backfill (info@samecdigital.com)';
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const limit = (() => {
  const flag = args.find((a) => a.startsWith('--limit='));
  return flag ? parseInt(flag.slice('--limit='.length), 10) : null;
})();

const localIndex = new Map(CZ_LOCATIONS_GEO.map((l) => [l.name.toLowerCase(), l]));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function nominatim(location, postalCode) {
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
  const r = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
    headers: { 'User-Agent': NOMINATIM_UA },
  });
  if (!r.ok) return null;
  const arr = await r.json();
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return { lat: parseFloat(arr[0].lat), lng: parseFloat(arr[0].lon) };
}

async function main() {
  const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  let q = sb
    .from('bazar_listings')
    .select('id, location, postal_code')
    .is('latitude', null)
    .not('location', 'is', null)
    .neq('location', '');
  if (limit) q = q.limit(limit);
  const { data, error } = await q;
  if (error) {
    console.error('Query failed:', error.message);
    process.exit(1);
  }

  console.log(`Found ${data.length} listings to backfill${limit ? ` (capped at ${limit})` : ''}.`);
  if (dryRun) console.log('DRY RUN — no writes.\n');

  let localHits = 0;
  let nominatimHits = 0;
  let misses = 0;
  for (const row of data) {
    const loc = (row.location ?? '').trim();
    const psc = (row.postal_code ?? '').replace(/\s+/g, '').trim();

    // 1. Local exact match
    let coord = null;
    if (loc) {
      const hit = localIndex.get(loc.toLowerCase());
      if (hit) { coord = { lat: hit.lat, lng: hit.lng, source: 'local' }; localHits++; }
    }

    // 2. Nominatim fallback
    if (!coord) {
      const n = await nominatim(loc, psc);
      if (n) { coord = { ...n, source: 'nominatim' }; nominatimHits++; }
      await sleep(1100); // TOS rate-limit
    }

    if (!coord) {
      misses++;
      process.stdout.write(`  ✗ ${row.id} "${loc}" — no match\n`);
      continue;
    }
    process.stdout.write(`  ✓ ${row.id} "${loc}" → ${coord.lat.toFixed(4)},${coord.lng.toFixed(4)} (${coord.source})\n`);
    if (!dryRun) {
      const { error: updErr } = await sb
        .from('bazar_listings')
        .update({ latitude: coord.lat, longitude: coord.lng })
        .eq('id', row.id);
      if (updErr) process.stdout.write(`    ✗ update failed: ${updErr.message}\n`);
    }
  }

  console.log(`\n✓ local: ${localHits}, nominatim: ${nominatimHits}, missed: ${misses}, total: ${data.length}`);
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
