import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../../lib/supabase';
import { getEnvVar } from '../../../../../lib/env';
import { sendClaimEmail } from '../../../../../lib/bazar-seed-email';
import { markProspectSent } from '../../../../../lib/bazar-seed';

export const prerender = false;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) return json({ error: 'unauthenticated' }, 401);

  const supabase = createServerClient();

  // Defense in depth — middleware /admin/* už checkuje is_admin (locals.user
  // nemá is_admin, ten žije v bazar_users; viz ostatní admin API routy).
  const { data: profile } = await supabase
    .from('bazar_users')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();
  if (!(profile as { is_admin?: boolean } | null)?.is_admin) return json({ error: 'forbidden' }, 403);

  const body = await request.json().catch(() => null);
  const prospectId = typeof body?.prospectId === 'string' ? body.prospectId : '';
  if (!prospectId) return json({ error: 'Chybí prospectId' }, 400);

  const { data: prospect } = await supabase
    .from('bazar_seed_prospects')
    .select('id, name, email, claim_token')
    .eq('id', prospectId)
    .single();
  if (!prospect?.email) return json({ error: 'Prospekt nemá e-mail' }, 422);

  const { data: listing } = await supabase
    .from('bazar_listings')
    .select('title')
    .eq('seed_prospect_id', prospectId)
    .limit(1)
    .single();

  const ok = await sendClaimEmail(getEnvVar('RESEND_API_KEY') ?? '', prospect.email as string, {
    name: (prospect.name as string) ?? '',
    token: prospect.claim_token as string,
    listingTitle: (listing?.title as string) ?? 'Váš inzerát',
  });
  if (!ok) return json({ error: 'E-mail se nepodařilo odeslat' }, 502);

  await markProspectSent(supabase, prospectId, 'email');
  return json({ ok: true });
};
