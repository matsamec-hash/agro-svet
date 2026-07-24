import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../../lib/supabase';

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
  const listingId = typeof body?.listingId === 'string' ? body.listingId : '';
  if (!listingId) return json({ error: 'Chybí listingId' }, 400);

  // Smaž jen NEVEŘEJNÝ draft (živé inzeráty se přes tohle mazat nesmí).
  const { data, error } = await supabase
    .from('bazar_listings')
    .delete()
    .eq('id', listingId)
    .eq('status', 'pending_claim')
    .select('id');
  if (error) return json({ error: error.message }, 500);
  if (!data?.length) return json({ error: 'Inzerát nenalezen nebo už je zveřejněný' }, 422);
  return json({ ok: true });
};
