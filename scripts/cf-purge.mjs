#!/usr/bin/env node
// Cloudflare cache purge — runs after `wrangler deploy` to clear edge HTML cache
// (Workers Build keeps cf-cache-status: HIT for ~70 min otherwise.)
//
// Required env (load via `node --env-file=.env scripts/cf-purge.mjs`):
//   CF_PURGE_TOKEN  — API token with permission: Zone → Cache Purge → Purge
//                     scoped to agro-svet.cz only
//   CF_ZONE_ID      — agro-svet.cz zone ID (CF dashboard → overview → right sidebar)

const token = process.env.CF_PURGE_TOKEN;
const zoneId = process.env.CF_ZONE_ID;

if (!token || !zoneId) {
  console.warn('[cf-purge] skipped — missing CF_PURGE_TOKEN or CF_ZONE_ID in .env');
  console.warn('[cf-purge] deploy succeeded but edge cache will hold ~70 min');
  console.warn('[cf-purge] setup: see scripts/cf-purge.mjs header');
  process.exit(0);
}

const url = `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`;
const t0 = Date.now();

try {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ purge_everything: true }),
  });
  const json = await res.json();
  const ms = Date.now() - t0;

  if (!res.ok || !json.success) {
    console.error(`[cf-purge] FAILED (${res.status}, ${ms}ms)`);
    console.error(JSON.stringify(json, null, 2));
    process.exit(1);
  }

  console.log(`[cf-purge] ✓ purged agro-svet.cz edge cache (${ms}ms)`);
} catch (err) {
  console.error('[cf-purge] network error:', err.message);
  process.exit(1);
}
