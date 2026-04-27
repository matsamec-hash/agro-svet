import type { APIRoute } from 'astro';
import { fetchAgroWeather } from '../../../lib/open-meteo';

export const prerender = false;

const CACHE_TTL = 1800; // 30 minutes

export const GET: APIRoute = async ({ request, locals }) => {
  const cache = (globalThis as any).caches?.default;
  if (cache) {
    const hit = await cache.match(request);
    if (hit) return hit;
  }

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

  if (cache) {
    const ctx = (locals as any).runtime?.ctx;
    const put = cache.put(request, response.clone());
    if (ctx?.waitUntil) ctx.waitUntil(put);
    else await put;
  }

  return response;
};
