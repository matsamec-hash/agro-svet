// POST /api/bazar/topovat/request
// User flow (pre-Stripe období):
//   1. Vytvoří order row se status='pending' v bazar_featured_orders.
//   2. Pošle e-mail adminovi (info@samecdigital.com) s odkazem na admin
//      page kde se klikem "Aktivovat zdarma" featured zapne (status flipne
//      na 'free').
//   3. Vrátí uživateli JSON s order id + UX hláška „čeká schválení".
//
// Až bude Stripe live, tento endpoint změní krok 2 za "vytvořit Stripe
// Checkout session a vrátit URL". Webhook pak flipne status na 'paid'
// a zavolá bazar_extend_featured() RPC.
//
// Throttle: 5 žádostí / 10 min / IP — bránit click-spam co generuje
// admin e-maily.

import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../lib/supabase';
import { getEnvVar } from '../../../../lib/env';
import { edgeThrottle } from '../../../../lib/edge-throttle';
import { FEATURED_PLANS, getPlanInfo } from '../../../../lib/bazar-featured-pricing';
import type { FeaturedPlan } from '../../../../lib/bazar-featured';
import { Resend } from 'resend';

export const prerender = false;

const ALLOWED_PLANS = new Set(FEATURED_PLANS.map((p) => p.plan));

const ADMIN_EMAIL = 'info@samecdigital.com';
const FROM = 'Agro-svět bazar <bazar@mail.agro-svet.cz>';

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request, locals, clientAddress }) => {
  const user = (locals as any).user;
  if (!user) return json({ error: 'unauthenticated' }, 401);

  const ip = (request.headers.get('cf-connecting-ip') ?? clientAddress ?? 'unknown').toString();
  const limit = await edgeThrottle({
    bucket: 'bazar-topovat-request',
    key: ip,
    max: 5,
    windowS: 10 * 60,
    ctx: (locals as any).cfContext,
  });
  if (!limit.ok) {
    return new Response(JSON.stringify({ error: 'rate_limited' }), {
      status: 429,
      headers: { 'content-type': 'application/json', 'retry-after': String(limit.retryAfterS) },
    });
  }

  let body: { listingId?: string; plan?: FeaturedPlan };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'bad_request' }, 400);
  }
  const listingId = body.listingId?.toString().trim();
  const plan = body.plan?.toString().trim();
  if (!listingId || !plan || !ALLOWED_PLANS.has(plan as FeaturedPlan)) {
    return json({ error: 'invalid_input' }, 400);
  }

  const info = getPlanInfo(plan as FeaturedPlan);
  const sb = createServerClient();

  // Ověř ownership inzerátu
  const { data: listing, error: listingErr } = await sb
    .from('bazar_listings')
    .select('id, user_id, title, status, featured, featured_until')
    .eq('id', listingId)
    .maybeSingle();
  if (listingErr || !listing) return json({ error: 'listing_not_found' }, 404);
  if (listing.user_id !== user.id) return json({ error: 'not_owner' }, 403);
  if (listing.status !== 'active') return json({ error: 'listing_not_active' }, 409);

  // Insert order
  const { data: order, error: insertErr } = await sb
    .from('bazar_featured_orders')
    .insert({
      listing_id: listingId,
      user_id: user.id,
      plan: info.plan,
      days: info.days,
      price_czk: info.priceCzk,
      status: 'pending',
    })
    .select('id')
    .single();

  if (insertErr || !order) {
    console.error('[topovat/request] insert failed', insertErr);
    return json({ error: 'db_error', message: insertErr?.message }, 500);
  }

  // Admin notification — best-effort. Failed mail neblokuje user flow.
  try {
    const resendKey = getEnvVar('RESEND_API_KEY');
    if (resendKey) {
      const resend = new Resend(resendKey);
      const adminUrl = `https://agro-svet.cz/admin/bazar/?topovat=${order.id}`;
      const userEmail = user.email ?? '(unknown)';
      const subject = `[agro-svět] Žádost o topování: ${listing.title}`;
      const text = [
        `Nová žádost o topování inzerátu.`,
        ``,
        `Inzerát:      ${listing.title}`,
        `ID inzerátu:  ${listing.id}`,
        `Plán:         ${info.label} (${info.days} dní)`,
        `Cena:         ${info.priceCzk} Kč`,
        `Uživatel:     ${userEmail}`,
        `User ID:      ${user.id}`,
        `Order ID:     ${order.id}`,
        ``,
        `Admin akce:`,
        `${adminUrl}`,
        ``,
        `— agro-svět.cz`,
      ].join('\n');
      await resend.emails.send({
        from: FROM,
        to: ADMIN_EMAIL,
        replyTo: userEmail,
        subject,
        text,
      });
    } else {
      console.warn('[topovat/request] RESEND_API_KEY missing — admin email skipped');
    }
  } catch (e) {
    console.error('[topovat/request] admin email failed', e);
    // proceed regardless
  }

  return json(
    {
      ok: true,
      order: { id: order.id, plan: info.plan, days: info.days, priceCzk: info.priceCzk },
      message: 'Vaše žádost byla přijata. Topování aktivujeme po manuálním ověření do 24 hodin (později nahradí automatická platební brána).',
    },
    202, // Accepted — operation queued, not yet completed
  );
};
