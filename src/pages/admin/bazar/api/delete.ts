// POST /admin/bazar/api/delete
// Admin akce: natvrdo smazat jeden nebo víc inzerátů (single i hromadné).
// Nejdřív smaže soubory fotek ze storage (bucket bazar-images), pak hard-DELETE
// řádků bazar_listings. FK kaskáda dočistí bazar_images + bazar_featured_orders
// řádky; bazar_reports.listing_id se nastaví na NULL (ON DELETE SET NULL).
// Middleware gate-uje /admin/* přes is_admin; tady je druhá kontrola (defense in depth).
import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../lib/supabase';

export const prerender = false;

const MAX_BATCH = 200; // strop na jednu dávku (ochrana proti omylu/abuse)

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) return json({ error: 'unauthenticated' }, 401);

  const sb = createServerClient();

  // Defense in depth — middleware už checkuje, ale kdyby endpoint byl volán mimo
  // /admin/* gate, tohle je backup.
  const { data: profile } = await sb
    .from('bazar_users')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();
  if (!profile?.is_admin) return json({ error: 'forbidden' }, 403);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'bad_request', message: 'Invalid JSON' }, 400);
  }

  const rawIds = (body as { listingIds?: unknown })?.listingIds;
  if (!Array.isArray(rawIds) || rawIds.length === 0) {
    return json({ error: 'bad_request', message: 'Missing listingIds' }, 400);
  }
  // Jen neprázdné stringy, deduplikace, strop.
  const ids = [...new Set(rawIds.filter((x): x is string => typeof x === 'string' && x.length > 0))];
  if (ids.length === 0) return json({ error: 'bad_request', message: 'No valid ids' }, 400);
  if (ids.length > MAX_BATCH) {
    return json({ error: 'too_many', message: `Max ${MAX_BATCH} najednou` }, 400);
  }

  // 1) Fotky ze storage — načíst storage_path a smazat objekty z bucketu.
  //    Kaskáda pak smaže samotné bazar_images řádky spolu s inzerátem.
  let imageWarning: string | null = null;
  const { data: images, error: imgErr } = await sb
    .from('bazar_images')
    .select('storage_path')
    .in('listing_id', ids);
  if (imgErr) {
    imageWarning = `Nepodařilo se načíst fotky: ${imgErr.message}`;
  } else {
    const paths = (images ?? [])
      .map((r) => (r as { storage_path?: string }).storage_path)
      .filter((p): p is string => typeof p === 'string' && p.length > 0);
    if (paths.length > 0) {
      const { error: rmErr } = await sb.storage.from('bazar-images').remove(paths);
      if (rmErr) {
        // Osiřelé soubory ve storage jsou menší zlo než neodstranitelný inzerát —
        // pokračujeme k DB delete, jen upozorníme.
        imageWarning = `Fotky se nepodařilo smazat ze storage: ${rmErr.message}`;
      }
    }
  }

  // 2) Hard DELETE inzerátů (service role obchází RLS). `.select('id')` vrátí
  //    reálně smazané řádky → přesný počet.
  const { data: deleted, error: delErr } = await sb
    .from('bazar_listings')
    .delete()
    .in('id', ids)
    .select('id');
  if (delErr) {
    return json({ error: 'delete_failed', message: delErr.message }, 500);
  }

  return json({
    deleted: deleted?.length ?? 0,
    deletedIds: (deleted ?? []).map((r) => (r as { id: string }).id),
    imageWarning,
  });
};
