// POST /admin/bazar/api/toggle-featured
// Admin akce pro topování inzerátů: extend (preset dny), custom (datum), clear.
// Middleware gate-uje /admin/* přes is_admin, tady je druhá kontrola defense-in-depth.
import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../lib/supabase';
import { computeFeaturedUntil, planToDays, type FeaturedPlan } from '../../../../lib/bazar-featured';

export const prerender = false;

type Body =
  | { listingId: string; action: 'extend'; plan: FeaturedPlan }
  | { listingId: string; action: 'custom'; until: string }
  | { listingId: string; action: 'clear' };

export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) return json({ error: 'unauthenticated' }, 401);

  const sb = createServerClient();

  // Defense in depth — middleware už checkuje, ale pokud by endpoint byl omylem
  // volán mimo /admin/* gate, tohle je backup.
  const { data: profile } = await sb
    .from('bazar_users')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();
  if (!profile?.is_admin) return json({ error: 'forbidden' }, 403);

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'bad_request', message: 'Invalid JSON' }, 400);
  }

  if (!body || typeof body !== 'object' || !('listingId' in body) || typeof body.listingId !== 'string') {
    return json({ error: 'bad_request', message: 'Missing listingId' }, 400);
  }

  // Načíst aktuální stav inzerátu (kvůli extend logice + existence check)
  const { data: listing } = await sb
    .from('bazar_listings')
    .select('id, featured, featured_until')
    .eq('id', body.listingId)
    .maybeSingle();
  if (!listing) return json({ error: 'not_found' }, 404);

  let update: {
    featured: boolean;
    featured_until: string | null;
    featured_plan: string | null;
  };

  if (body.action === 'extend') {
    if (!body.plan || !['7d', '30d', '60d'].includes(body.plan)) {
      return json({ error: 'bad_request', message: 'Invalid plan' }, 400);
    }
    const days = planToDays(body.plan);
    const currentUntil = listing.featured_until ? new Date(listing.featured_until) : null;
    const newUntil = computeFeaturedUntil(currentUntil, days);
    update = {
      featured: true,
      featured_until: newUntil.toISOString(),
      featured_plan: body.plan,
    };
  } else if (body.action === 'custom') {
    if (!body.until) return json({ error: 'bad_request', message: 'Missing until' }, 400);
    const untilDate = new Date(body.until);
    if (isNaN(untilDate.getTime())) {
      return json({ error: 'bad_request', message: 'Invalid until date' }, 400);
    }
    if (untilDate.getTime() <= Date.now()) {
      return json({ error: 'bad_request', message: 'until must be in the future' }, 400);
    }
    update = {
      featured: true,
      featured_until: untilDate.toISOString(),
      featured_plan: 'custom',
    };
  } else if (body.action === 'clear') {
    update = {
      featured: false,
      featured_until: null,
      featured_plan: null,
    };
  } else {
    return json({ error: 'bad_request', message: 'Unknown action' }, 400);
  }

  const { data: updated, error } = await sb
    .from('bazar_listings')
    .update(update)
    .eq('id', body.listingId)
    .select('id, featured, featured_until, featured_plan')
    .single();

  if (error) {
    console.error('[toggle-featured] update failed', error);
    return json({ error: 'server_error' }, 500);
  }

  return json({ ok: true, listing: updated });
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
