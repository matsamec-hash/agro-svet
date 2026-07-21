import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../lib/supabase';
import { getProspectByToken } from '../../../../lib/bazar-seed';
import { SITE_URL } from '../../../../lib/config';

export const prerender = false;

// Smazání předchystaného draftu z claim stránky. Ověřujeme claim_token (přístup
// k e-mailu/odkazu = oprávnění), ne přihlášení — prodejce nemusí mít heslo.
// Už zveřejněný (confirmed) inzerát se přes tuhle cestu nemaže; ten patří jeho
// účtu a řeší se v „Moje inzeráty".
export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const token = form.get('token')?.toString() ?? '';
  if (!token) return new Response('Chybí token', { status: 400 });

  const supabase = createServerClient();
  const prospect = await getProspectByToken(supabase, token);
  if (!prospect) return new Response('Neplatný odkaz', { status: 404 });
  if (prospect.status === 'confirmed') {
    // Už zveřejněno — sem nepatří, pošli do Moje inzeráty.
    return new Response(null, { status: 303, headers: { Location: `${SITE_URL}/bazar/moje/` } });
  }

  // Nejdřív fotky z listingů (storage), pak listingy, pak prospekt.
  const { data: listings } = await supabase
    .from('bazar_listings')
    .select('id, bazar_images(storage_path)')
    .eq('seed_prospect_id', prospect.id);

  const paths = (listings ?? []).flatMap((l: any) =>
    (l.bazar_images ?? []).map((img: { storage_path: string }) => img.storage_path),
  );
  if (paths.length) await supabase.storage.from('bazar-images').remove(paths);

  await supabase.from('bazar_listings').delete().eq('seed_prospect_id', prospect.id);
  await supabase.from('bazar_seed_prospects').delete().eq('id', prospect.id);

  // Zpět na claim URL s deleted=1 — token už neexistuje, stránka podle flagu
  // ukáže potvrzení „smazáno" místo „neplatný odkaz".
  return new Response(null, {
    status: 303,
    headers: { Location: `${SITE_URL}/bazar/prevzit/${token}/?deleted=1` },
  });
};
