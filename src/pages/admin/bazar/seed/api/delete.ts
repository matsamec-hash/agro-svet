import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../../lib/supabase';

export const prerender = false;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

type DelResult = { id: string; ok: boolean; skipped?: string };

// Smaže jeden prospekt + jeho draft (fotky → listings → prospekt, recept z claim
// delete v bazar/prevzit/api/delete.ts). Jediná pojistka: napojený AKTIVNÍ listing
// (živý inzerát na webu, public bazar filtruje status='active') se nemaže. Confirmed
// prospekt bez aktivního listingu (typicky „Draft nenalezen") je jen balast → smažeme.
async function deleteProspect(supabase: ReturnType<typeof createServerClient>, prospectId: string): Promise<DelResult> {
  const { data: prospect } = await supabase
    .from('bazar_seed_prospects')
    .select('id, status')
    .eq('id', prospectId)
    .single();
  if (!prospect) return { id: prospectId, ok: false, skipped: 'nenalezen' };

  const { data: listings } = await supabase
    .from('bazar_listings')
    .select('id, status, bazar_images(storage_path)')
    .eq('seed_prospect_id', prospectId);

  if ((listings ?? []).some((l: any) => l.status === 'active')) return { id: prospectId, ok: false, skipped: 'aktivní' };

  const paths = (listings ?? []).flatMap((l: any) =>
    (l.bazar_images ?? []).map((img: { storage_path: string }) => img.storage_path),
  );
  if (paths.length) await supabase.storage.from('bazar-images').remove(paths);

  await supabase.from('bazar_listings').delete().eq('seed_prospect_id', prospectId);
  await supabase.from('bazar_seed_prospects').delete().eq('id', prospectId);
  return { id: prospectId, ok: true };
}

// Admin cleanup — přijímá jeden `prospectId` nebo pole `prospectIds` (hromadně).
export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) return json({ error: 'unauthenticated' }, 401);

  const supabase = createServerClient();

  // Defense in depth — middleware /admin/* už checkuje is_admin (locals.user
  // nemá is_admin, ten žije v bazar_users; viz send.ts).
  const { data: profile } = await supabase
    .from('bazar_users')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();
  if (!(profile as { is_admin?: boolean } | null)?.is_admin) return json({ error: 'forbidden' }, 403);

  const body = await request.json().catch(() => null);
  const ids: string[] = Array.isArray(body?.prospectIds)
    ? body.prospectIds.filter((x: unknown): x is string => typeof x === 'string')
    : typeof body?.prospectId === 'string'
      ? [body.prospectId]
      : [];
  if (!ids.length) return json({ error: 'Chybí prospectId' }, 400);

  const capped = ids.slice(0, 200); // strop proti omylu/abuse
  const results: DelResult[] = [];
  for (const id of capped) results.push(await deleteProspect(supabase, id));

  // Jeden záznam → zachovej původní tvar odpovědi (kvůli single-delete tlačítku).
  if (ids.length === 1) {
    const r = results[0];
    return r.ok ? json({ ok: true }) : json({ error: `Nelze smazat (${r.skipped})` }, 409);
  }

  const deleted = results.filter((r) => r.ok).map((r) => r.id);
  const skipped = results.filter((r) => !r.ok);
  return json({ ok: true, deleted, deletedCount: deleted.length, skippedCount: skipped.length, skipped });
};
