// src/pages/admin/akce/api/foto.ts
// Admin: galerie fotek akce (multi-upload / smazání jedné) + cena.
// Funguje pro libovolné id (čekající i zveřejněné akce).
import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../lib/supabase';
import {
  uploadAkceFoto, addAkceImages, removeAkceImage, setAkceFoto, setAkceCena,
  AKCE_FOTO_MAX_BYTES, AKCE_FOTO_TYPES,
} from '../../../../lib/akce-supabase';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) return json({ error: 'unauthenticated' }, 401);

  const sb = createServerClient();
  const { data: profile } = await sb.from('bazar_users').select('is_admin').eq('id', user.id).maybeSingle();
  if (!(profile as { is_admin?: boolean } | null)?.is_admin) return json({ error: 'forbidden' }, 403);

  const form = await request.formData();
  const id = String(form.get('akce_id') ?? '');
  const action = String(form.get('action') ?? 'upload');
  if (!id) return json({ error: 'bad_request' }, 400);

  // Uložení ceny.
  if (action === 'cena') {
    const cena = String(form.get('cena') ?? '').trim();
    await setAkceCena(id, cena === '' ? null : cena);
    return json({ ok: true });
  }

  // Smazání jedné fotky z galerie (dle image_id) nebo legacy jediné fotky.
  if (action === 'remove_image') {
    const imageId = String(form.get('image_id') ?? '');
    if (imageId) await removeAkceImage(imageId);
    return json({ ok: true });
  }
  if (action === 'remove') {
    await setAkceFoto(id, null);
    return json({ ok: true });
  }

  // Nahrání jedné či více fotek do galerie.
  const files = form.getAll('foto').filter((f): f is File => f instanceof File && f.size > 0).slice(0, 6);
  if (!files.length) return json({ error: 'no_file' }, 400);
  for (const f of files) {
    if (!AKCE_FOTO_TYPES[f.type]) return json({ error: 'bad_type' }, 415);
    if (f.size > AKCE_FOTO_MAX_BYTES) return json({ error: 'too_large' }, 413);
  }
  const paths: string[] = [];
  for (const f of files) paths.push(await uploadAkceFoto(await f.arrayBuffer(), f.type));
  await addAkceImages(id, paths);
  return json({ ok: true, added: paths.length });
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}
