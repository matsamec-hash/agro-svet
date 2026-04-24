// Dynamic OG image: GET /fotosoutez/api/og/{entry-id}.png
//
// Renders the entry photo + title + author + vote count as a 1200×630 PNG
// using satori (HTML→SVG) and resvg-wasm (SVG→PNG). Cached at the edge for
// 10 minutes to amortize the WASM render cost.
//
// WASM module + font are loaded once per isolate (cold start ~600 ms,
// warm hits ~50 ms).
import type { APIRoute } from 'astro';
import RESVG_WASM from '@resvg/resvg-wasm/index_bg.wasm';
import { getEntry, getPublicPhotoUrl } from '../../../../lib/contest-supabase';
import { ensureResvgWasm, renderContestOg, entryToOgInput } from '../../../../lib/contest-og';

export const prerender = false;

let cachedFont: ArrayBuffer | null = null;
async function loadFont(origin: string): Promise<ArrayBuffer> {
  if (cachedFont) return cachedFont;
  const res = await fetch(`${origin}/fonts/ChakraPetch-Bold.ttf`);
  if (!res.ok) throw new Error(`Failed to fetch font: ${res.status}`);
  cachedFont = await res.arrayBuffer();
  return cachedFont;
}

export const GET: APIRoute = async ({ params, request }) => {
  const id = params.id;
  if (!id) return new Response('Missing id', { status: 400 });

  const entry = await getEntry(id);
  if (!entry || entry.status !== 'approved') {
    return new Response('Not found', { status: 404 });
  }

  await ensureResvgWasm(RESVG_WASM as WebAssembly.Module);

  const origin = new URL(request.url).origin;
  const [photoUrl, font] = await Promise.all([
    getPublicPhotoUrl(entry.photo_path),
    loadFont(origin),
  ]);

  const png = await renderContestOg(entryToOgInput(entry, photoUrl), font);

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=300, s-maxage=600',
    },
  });
};
