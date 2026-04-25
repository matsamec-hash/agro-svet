// OG image: GET /fotosoutez/api/og/{entry-id}.png
//
// Vrátí 302 redirect přímo na původní fotku z Supabase Storage.
// Dříve generováno přes satori + resvg-wasm (2.4 MB WASM v bundle),
// teď redirect — FB/Twitter/LinkedIn scrapery následují, fotka je
// použitá jako og:image. Žádný overlay, ale 35 % menší worker bundle.
import type { APIRoute } from 'astro';
import { getEntry, getPublicPhotoUrl } from '../../../../lib/contest-supabase';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) return new Response('Missing id', { status: 400 });

  const entry = await getEntry(id);
  if (!entry || entry.status !== 'approved') {
    return new Response('Not found', { status: 404 });
  }

  const photoUrl = await getPublicPhotoUrl(entry.photo_path);

  return new Response(null, {
    status: 302,
    headers: {
      Location: photoUrl,
      'Cache-Control': 'public, max-age=600, s-maxage=3600',
    },
  });
};
