import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../../lib/supabase';
import { createProspect } from '../../../../../lib/bazar-seed';

export const prerender = false;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) return json({ error: 'unauthenticated' }, 401);
  const supabase = createServerClient();
  const { data: profile } = await supabase.from('bazar_users').select('is_admin').eq('id', user.id).maybeSingle();
  if (!(profile as { is_admin?: boolean } | null)?.is_admin) return json({ error: 'forbidden' }, 403);

  const body = await request.json().catch(() => null);
  const name = (body?.name ?? '').toString().trim();
  const phone = (body?.phone ?? '').toString().trim();
  const email = (body?.email ?? '').toString().trim();

  if (!name && !phone && !email) return json({ error: 'Zadejte alespoň jméno, telefon nebo e-mail' }, 400);
  if (email && !/.+@.+\..+/.test(email)) return json({ error: 'Neplatný e-mail' }, 400);

  try {
    const r = await createProspect(supabase, { adminId: user.id, prospect: { name, phone, email } });
    return json({ ok: true, ...r });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
};
