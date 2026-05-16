import type { APIRoute } from 'astro';
import { geocode, isPlausibleCzCoord } from '../../lib/geocode';
import { edgeThrottle } from '../../lib/edge-throttle';

export const prerender = false;

// Throttle anonymous geocode calls: Nominatim TOS allows 1 req/s, but a
// shared agro-svet egress IP would easily exceed that. Local-dataset hits
// don't count against the upstream, but we throttle all calls uniformly
// to keep the picture simple.
const THROTTLE_MAX = 20;
const THROTTLE_WINDOW_S = 60;

export const GET: APIRoute = async ({ request, url, locals, clientAddress }) => {
  const ip = (request.headers.get('cf-connecting-ip') ?? clientAddress ?? 'unknown').toString();
  const limit = await edgeThrottle({
    bucket: 'geocode',
    key: ip,
    max: THROTTLE_MAX,
    windowS: THROTTLE_WINDOW_S,
    ctx: (locals as any).cfContext,
  });
  if (!limit.ok) {
    return new Response(JSON.stringify({ error: 'rate_limited' }), {
      status: 429,
      headers: { 'content-type': 'application/json', 'retry-after': String(limit.retryAfterS) },
    });
  }

  const location = url.searchParams.get('location') ?? '';
  const postalCode = url.searchParams.get('psc') ?? '';
  if (!location && !postalCode) {
    return new Response(JSON.stringify({ error: 'missing_query' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const result = await geocode({ location, postalCode });
  if (!result) {
    return new Response(JSON.stringify({ error: 'not_found' }), {
      status: 404,
      headers: {
        'content-type': 'application/json',
        // Cache misses briefly so we don't slam Nominatim on retries.
        'cache-control': 'public, max-age=120, s-maxage=300',
      },
    });
  }

  if (!isPlausibleCzCoord(result.lat, result.lng)) {
    return new Response(JSON.stringify({ error: 'outside_cz' }), {
      status: 422,
      headers: { 'content-type': 'application/json' },
    });
  }

  return new Response(
    JSON.stringify({
      lat: result.lat,
      lng: result.lng,
      source: result.source,
      displayName: result.displayName ?? null,
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
        // 1 day at the edge — geocodes are very stable.
        'cache-control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
      },
    },
  );
};
