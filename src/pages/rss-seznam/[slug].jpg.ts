import type { APIRoute } from 'astro';
import sharp from 'sharp';
import { createAnonClient } from '../../lib/supabase';
import { AGRO_SVET_SITE_ID as SITE_ID } from '../../lib/config';
import { cropBox16x9, seznamImageSource, type FocalPoint } from '../../lib/seznam-feed';

// Náhled článku pro Seznam Newsfeed: JPG 800×450, jak chce specifikace.
// Cover fotky jsou na CDN jako webp a ta neumí převod za běhu. URL nese jen slug
// zveřejněného článku, takže to není otevřený proxy na cizí obrázky.
// Převádí se při prvním načtení, další požadavky bere cache Cloudflaru.
const WIDTH = 800;
const HEIGHT = 450;
const FETCH_TIMEOUT_MS = 10_000;
// ‼️ Slug z URL, ne z params: middleware sem přepisuje přes next() a Astro pak endpointu
// nechá params z původní cesty, tedy prázdné. Pod /sk/ tenhle vzor nesedne, takže 404.
const IMAGE_PATH = /^\/rss-seznam\/([^/]+)\.jpg\/?$/;

async function toJpeg(input: Buffer, focal: FocalPoint | null | undefined): Promise<Buffer> {
  const image = sharp(input, { autoOrient: true });
  const meta = await image.metadata();
  const box = cropBox16x9(meta.autoOrient?.width ?? meta.width, meta.autoOrient?.height ?? meta.height, focal);
  return image
    .extract(box)
    .resize(WIDTH, HEIGHT)
    .flatten({ background: '#ffffff' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
}

export const GET: APIRoute = async ({ url }) => {
  const slug = url.pathname.match(IMAGE_PATH)?.[1];
  if (!slug) return new Response('Not Found', { status: 404 });

  const { data, error } = await createAnonClient()
    .from('articles')
    .select('featured_image_url, focal_point')
    .eq('site_id', SITE_ID)
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  if (error) {
    console.error('rss-seznam image query error', error);
    return new Response('Service Unavailable', { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }

  const source = seznamImageSource(data?.featured_image_url);
  if (!source) return new Response('Not Found', { status: 404 });

  try {
    const res = await fetch(source, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
    if (!res.ok) throw new Error(`zdroj vrátil ${res.status}`);
    const jpeg = await toJpeg(Buffer.from(await res.arrayBuffer()), data?.focal_point as FocalPoint | null);
    return new Response(new Uint8Array(jpeg), {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=86400, s-maxage=604800',
      },
    });
  } catch (err) {
    console.error('rss-seznam image error', source, err);
    return new Response('Bad Gateway', { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
};
