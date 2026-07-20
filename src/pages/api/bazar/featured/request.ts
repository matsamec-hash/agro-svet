// POST /api/bazar/featured/request
// User-facing endpoint: vytvoří bazar_featured_orders row se statusem 'pending'.
// Zatím (pre-Stripe období) admin manuálně schválí v /admin/bazar/ po obdržení
// platby převodem — flipne status → 'free' a tím se aktivuje featured.
import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../lib/supabase';
import { getPlanInfo } from '../../../../lib/bazar-featured-pricing';
import type { FeaturedPlan } from '../../../../lib/bazar-featured';
import { edgeThrottle } from '../../../../lib/edge-throttle';
import { getEnvVar } from '../../../../lib/env';
import { BAZAR_TOPOVANI_ENABLED } from '../../../../lib/config';
import { Resend } from 'resend';

const ADMIN_EMAIL = 'info@samecdigital.com';
const FROM = 'Agro-svět bazar <bazar@mail.agro-svet.cz>';

export const prerender = false;

const VALID_PLANS: FeaturedPlan[] = ['7d', '30d', '60d'];

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}

export const POST: APIRoute = async ({ request, locals, clientAddress }) => {
  // Topování dočasně vypnuté (čeká na online platbu) — nepřijímej žádosti.
  if (!BAZAR_TOPOVANI_ENABLED) return json({ error: 'topovani_disabled' }, 403);

  const user = (locals as any).user;
  if (!user) return json({ error: 'unauthenticated' }, 401);

  const ip = (request.headers.get('cf-connecting-ip') ?? clientAddress ?? 'unknown').toString();
  const limit = await edgeThrottle({
    bucket: 'featured-request',
    key: ip,
    max: 10,
    windowS: 600,
    ctx: (locals as any).cfContext,
  });
  if (!limit.ok) return json({ error: 'rate_limited' }, 429);

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }

  const listingId = typeof body?.listingId === 'string' ? body.listingId : '';
  const plan = body?.plan as FeaturedPlan;
  if (!listingId) return json({ error: 'missing_listing' }, 400);
  if (!VALID_PLANS.includes(plan)) return json({ error: 'invalid_plan' }, 400);

  const sb = createServerClient();

  // Verify listing exists + belongs to user.
  const { data: listing, error: listingErr } = await sb
    .from('bazar_listings')
    .select('id, user_id, title, status')
    .eq('id', listingId)
    .maybeSingle();
  if (listingErr) {
    console.error('[featured/request] listing lookup failed', listingErr);
    return json({ error: 'db_error' }, 500);
  }
  if (!listing) return json({ error: 'listing_not_found' }, 404);
  if (listing.user_id !== user.id) return json({ error: 'forbidden' }, 403);
  if (listing.status !== 'active') {
    return json({ error: 'listing_not_active', message: 'Topovat lze jen aktivní inzeráty.' }, 409);
  }

  const plenInfo = getPlanInfo(plan);

  // Reject duplicate-pending: pokud user už má pending request pro tento listing,
  // nevytvářet další. (Necháme admin to vyřídit, ne zaplavit ho 10× tím samým.)
  const { data: existingPending } = await sb
    .from('bazar_featured_orders')
    .select('id')
    .eq('listing_id', listingId)
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .limit(1)
    .maybeSingle();
  if (existingPending) {
    return json({
      error: 'already_pending',
      message: 'Máte čekající žádost o topování tohoto inzerátu. Vyčkejte na schválení nebo nás kontaktujte.',
      orderId: existingPending.id,
    }, 409);
  }

  const { data: order, error: insertErr } = await sb
    .from('bazar_featured_orders')
    .insert({
      listing_id: listingId,
      user_id: user.id,
      plan,
      days: plenInfo.days,
      price_czk: plenInfo.priceCzk,
      status: 'pending',
    })
    .select('id, created_at')
    .single();

  if (insertErr || !order) {
    console.error('[featured/request] insert failed', insertErr);
    return json({ error: 'db_error', message: insertErr?.message }, 500);
  }

  // Admin notification — best-effort; failure doesn't block user flow.
  try {
    const resendKey = getEnvVar('RESEND_API_KEY');
    if (resendKey) {
      const resend = new Resend(resendKey);
      const adminUrl = `https://agro-svet.cz/admin/bazar/?topovat=${order.id}`;
      const userEmail = (user as any).email ?? '(unknown)';
      const lines = [
        'Nová žádost o topování inzerátu.',
        '',
        `Inzerát:   ${listing.title}`,
        `Plán:      ${plenInfo.label} (${plenInfo.days} dní)`,
        `Cena:      ${plenInfo.priceCzk} Kč`,
        `Uživatel:  ${userEmail}`,
        `Order ID:  ${order.id}`,
        '',
        `Schválit (admin): ${adminUrl}`,
      ].join('\n');
      await resend.emails.send({
        from: FROM,
        to: ADMIN_EMAIL,
        replyTo: userEmail,
        subject: `[agro-svět] Žádost o topování: ${listing.title}`,
        text: lines,
      });
    }
  } catch (e) {
    console.error('[featured/request] admin email failed', e);
  }

  return json({
    ok: true,
    orderId: order.id,
    plan,
    priceCzk: plenInfo.priceCzk,
    days: plenInfo.days,
    message: 'Žádost přijata. Topování aktivujeme po manuálním ověření platby (Stripe brzy).',
  }, 202);
};
