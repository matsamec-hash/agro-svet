import type { APIRoute } from 'astro';
import { fetchPointForecast, roundCoord } from '../../../lib/met-norway';
import { runtimeCache } from '../../../lib/runtime-cache';
import { edgeThrottle } from '../../../lib/edge-throttle';

// Předpověď pro „Moje pole" (HomeWeather). Prohlížeč posílá souřadnice SEM,
// ne k MET ani jinam — MET tak nedostane IP návštěvníka (podmínky MET i naše
// zásady zpracování osobních údajů). Souřadnice zaokrouhlujeme na 2 desetinná
// místa (~1 km): přesnější předpověď stejně neexistuje, poloha pole se nikam
// neposílá přesně a sousedé sdílejí cache.

export const prerender = false;

const CACHE_TTL = 1800; // 30 min
// Strop jen na dotazy mimo cache (ty jdou k MET). Člověk kliká párkrát;
// skript přeskakující souřadnice narazí rychle.
const THROTTLE_MAX = 20;
const THROTTLE_WINDOW_S = 600;

const json = (status: number, body: unknown, cacheControl = 'no-store') =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': cacheControl },
  });

function parseCoord(raw: string | null, limit: number): number | null {
  if (raw === null || raw.trim() === '') return null;
  const v = Number(raw);
  return Number.isFinite(v) && Math.abs(v) <= limit ? v : null;
}

export const GET: APIRoute = async ({ request, url, locals, clientAddress }) => {
  const lat = parseCoord(url.searchParams.get('lat'), 90);
  const lon = parseCoord(url.searchParams.get('lon'), 180);
  if (lat === null || lon === null) return json(400, { error: 'bad_coords' });

  const rlat = roundCoord(lat, 2);
  const rlon = roundCoord(lon, 2);
  // Klíč cache jen ze zaokrouhlených souřadnic (ne z celé URL s dalšími parametry).
  const cacheKey = new Request(`https://weather.internal/forecast/${rlat}/${rlon}`);

  try {
    const hit = await runtimeCache.match(cacheKey);
    if (hit) return hit;
  } catch { /* cache je best-effort */ }

  const ip = (request.headers.get('cf-connecting-ip') ?? clientAddress ?? 'unknown').toString();
  const limit = await edgeThrottle({
    bucket: 'weather-forecast',
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

  try {
    const forecast = await fetchPointForecast(rlat, rlon);
    if (!forecast) return json(503, { error: 'unavailable' });
    const response = json(200, { forecast }, `public, max-age=${CACHE_TTL}, s-maxage=${CACHE_TTL}`);
    try {
      const put = runtimeCache.put(cacheKey, response.clone());
      const ctx = (locals as any).cfContext;
      if (ctx?.waitUntil) ctx.waitUntil(put);
      else await put;
    } catch { /* swallow */ }
    return response;
  } catch (err) {
    return json(502, { error: 'fetch_failed', message: String(err).slice(0, 200) });
  }
};
