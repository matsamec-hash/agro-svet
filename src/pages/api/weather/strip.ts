import type { APIRoute } from 'astro';
import { fetchCityStrip } from '../../../lib/met-norway';
import { runtimeCache } from '../../../lib/runtime-cache';

export const prerender = false;

// 30 min. MET (lib/met-norway) má pod tím vlastní cache s Expires/If-Modified-Since.
const CACHE_TTL = 1800;

async function tryCacheGet(request: Request): Promise<Response | null> {
  try {
    const hit = await runtimeCache.match(request);
    return hit ?? null;
  } catch { return null; }
}

async function tryCachePut(request: Request, response: Response, ctx: any) {
  try {
    const put = runtimeCache.put(request, response.clone());
    if (ctx?.waitUntil) ctx.waitUntil(put);
    else await put;
  } catch { /* swallow */ }
}

export const GET: APIRoute = async ({ request, locals }) => {
  const cached = await tryCacheGet(request);
  if (cached) return cached;

  try {
    const cities = await fetchCityStrip();
    // Prázdný seznam = MET nedostupné. Necacheovat, ať se za 30 min neukazuje nic.
    if (cities.length === 0) {
      return new Response(JSON.stringify({ error: 'unavailable' }), {
        status: 503,
        headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
      });
    }
    const body = JSON.stringify({ cities });
    const response = new Response(body, {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': `public, max-age=${CACHE_TTL}, s-maxage=${CACHE_TTL}`,
      },
    });
    await tryCachePut(request, response, (locals as any).cfContext);
    return response;
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'fetch_failed', message: String(err).slice(0, 200) }),
      { status: 502, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } },
    );
  }
};
