import type { APIRoute } from 'astro';
import { fetchAgroWeather } from '../../../lib/open-meteo';

export const prerender = false;

const CACHE_TTL = 1800; // 30 minutes

async function tryCacheGet(request: Request): Promise<Response | null> {
  try {
    const cache = (globalThis as any).caches?.default;
    if (!cache) return null;
    const hit = await cache.match(request);
    return hit ?? null;
  } catch { return null; }
}

async function tryCachePut(request: Request, response: Response, ctx: any) {
  try {
    const cache = (globalThis as any).caches?.default;
    if (!cache) return;
    const put = cache.put(request, response.clone());
    if (ctx?.waitUntil) ctx.waitUntil(put);
    else await put;
  } catch { /* swallow */ }
}

export const GET: APIRoute = async ({ request, locals }) => {
  const cached = await tryCacheGet(request);
  if (cached) return cached;

  try {
    const agro = await fetchAgroWeather();
    if (!agro) {
      return new Response(JSON.stringify({ error: 'unavailable' }), {
        status: 503,
        headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
      });
    }
    const body = JSON.stringify({ agro });
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
