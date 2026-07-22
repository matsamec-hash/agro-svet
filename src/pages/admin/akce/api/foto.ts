// src/pages/admin/akce/api/foto.ts
// Admin: nahrání / nahrazení / odebrání fotky akce. Funguje pro libovolné id
// (čekající i zveřejněné), aby šlo doplnit fotku i ke kurátorským akcím.
import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../lib/supabase';
import { uploadAkceFoto, setAkceFoto, AKCE_FOTO_MAX_BYTES, AKCE_FOTO_TYPES } from '../../../../lib/akce-supabase';

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

  if (action === 'remove') {
    await setAkceFoto(id, null);
    return json({ ok: true, foto_path: null });
  }

  const file = form.get('foto');
  if (!(file instanceof File) || file.size === 0) return json({ error: 'no_file' }, 400);
  if (!AKCE_FOTO_TYPES[file.type]) return json({ error: 'bad_type' }, 415);
  if (file.size > AKCE_FOTO_MAX_BYTES) return json({ error: 'too_large' }, 413);

  const path = await uploadAkceFoto(await file.arrayBuffer(), file.type);
  await setAkceFoto(id, path);
  return json({ ok: true, foto_path: path });
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}
