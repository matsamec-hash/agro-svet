import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../../lib/supabase';

export const prerender = false;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

// Admin cleanup — smaže naseedovaný prospekt + jeho draft inzerát (fotky → listings
// → prospekt, stejný recept jako claim delete v bazar/prevzit/api/delete.ts).
// Pojistky: gated is_admin; zveřejněný (confirmed) prospekt ani aktivní listing
// se nemažou — to jsou živé inzeráty na webu.
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
  const prospectId = typeof body?.prospectId === 'string' ? body.prospectId : '';
  if (!prospectId) return json({ error: 'Chybí prospectId' }, 400);

  const { data: prospect } = await supabase
    .from('bazar_seed_prospects')
    .select('id, status')
    .eq('id', prospectId)
    .single();
  if (!prospect) return json({ error: 'Prospekt nenalezen' }, 404);

  // Pojistka: publikovaný prospekt = živý inzerát na webu, sem nepatří.
  if (prospect.status === 'confirmed') {
    return json({ error: 'Zveřejněný inzerát nelze smazat odsud (je živý na webu).' }, 409);
  }

  // Fotky ze storage → listings → prospekt. Aktivní listing = živý na webu, blokujeme.
  const { data: listings } = await supabase
    .from('bazar_listings')
    .select('id, status, bazar_images(storage_path)')
    .eq('seed_prospect_id', prospectId);

  if ((listings ?? []).some((l: any) => l.status === 'active')) {
    return json({ error: 'Napojený inzerát je aktivní (živý na webu). Nelze smazat.' }, 409);
  }

  const paths = (listings ?? []).flatMap((l: any) =>
    (l.bazar_images ?? []).map((img: { storage_path: string }) => img.storage_path),
  );
  if (paths.length) await supabase.storage.from('bazar-images').remove(paths);

  await supabase.from('bazar_listings').delete().eq('seed_prospect_id', prospectId);
  await supabase.from('bazar_seed_prospects').delete().eq('id', prospectId);

  return json({ ok: true });
};
