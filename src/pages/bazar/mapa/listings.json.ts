import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase';

export const prerender = false;

// Compact JSON feed of all geocoded active bazar listings for the map.
// One row per listing, only the fields the marker/popup needs. Cached at
// the edge for 5 min (mapa traffic is bursty around fresh listings, so a
// short TTL keeps the pin set reasonably fresh without hammering Supabase).

interface CompactListing {
  id: string;
  title: string;
  price: number | null;
  category: string;
  brand: string | null;
  location: string;
  lat: number;
  lng: number;
  img?: string;
  created_at: string;
}

export const GET: APIRoute = async ({ request, locals }) => {
  const cache = (globalThis as any).caches?.default;
  if (cache) {
    const hit = await cache.match(request);
    if (hit) return hit;
  }

  const sb = createServerClient();
  const { data, error } = await sb
    .from('bazar_listings')
    .select('id, title, price, category, brand, location, latitude, longitude, created_at, bazar_images(storage_path, position)')
    .eq('status', 'active')
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)
    .order('created_at', { ascending: false })
    .limit(2000);

  if (error) {
    console.error('[bazar/mapa/listings] query failed', error);
    return new Response(JSON.stringify({ error: 'db_error' }), { status: 500 });
  }

  const compact: CompactListing[] = (data ?? []).map((row: any) => {
    const images = (row.bazar_images ?? []) as Array<{ storage_path: string; position: number }>;
    const firstImage = images.sort((a, b) => a.position - b.position)[0];
    const img = firstImage
      ? sb.storage.from('bazar-images').getPublicUrl(firstImage.storage_path).data.publicUrl
      : undefined;
    return {
      id: row.id,
      title: row.title,
      price: row.price,
      category: row.category,
      brand: row.brand,
      location: row.location,
      lat: row.latitude,
      lng: row.longitude,
      img,
      created_at: row.created_at,
    };
  });

  const response = new Response(JSON.stringify(compact), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      // 5min edge cache + 30min SWR. Fresh listings show up quickly when
      // someone publishes; map doesn't need real-time accuracy.
      'cache-control': 'public, max-age=120, s-maxage=300, stale-while-revalidate=1800',
    },
  });
  if (cache) {
    const put = cache.put(request, response.clone());
    if ((locals as any).cfContext?.waitUntil) (locals as any).cfContext.waitUntil(put);
  }
  return response;
};
