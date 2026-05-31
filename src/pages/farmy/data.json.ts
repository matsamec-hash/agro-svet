import type { APIRoute } from 'astro';
import { getAllFarms } from '../../lib/farmy';

export const prerender = true;

export const GET: APIRoute = () => {
  // Kompaktní klíče — payload je menší a stačí pro mapu + karty.
  const compact = getAllFarms().map((f) => ({
    s: f.slug,
    n: f.name,
    t: f.farm_type,
    r: f.region,
    d: f.district ?? null,
    lat: f.lat,
    lng: f.lng,
    e: f.eco,
    p: f.products,
    ph: f.photos?.[0] ?? null,
    desc: f.description,
    addr: f.address ?? null,
  }));
  return new Response(JSON.stringify(compact), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
};
