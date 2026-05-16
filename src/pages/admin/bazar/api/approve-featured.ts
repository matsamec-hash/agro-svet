// POST /admin/bazar/api/approve-featured
// Admin akce: flip pending → free/paid + zavolat bazar_extend_featured() RPC.
// Pre-Stripe období: 'free' (manual převod), Stripe webhook později použije 'paid'.
import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../lib/supabase';
import type { FeaturedPlan } from '../../../../lib/bazar-featured';

export const prerender = false;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}

type Body =
  | { orderId: string; action: 'approve'; newStatus?: 'free' | 'paid'; note?: string }
  | { orderId: string; action: 'reject'; note?: string };

export const POST: APIRoute = async ({ request, locals }) => {
  const user = (locals as any).user;
  if (!user) return json({ error: 'unauthenticated' }, 401);

  const sb = createServerClient();

  // Defense in depth — middleware /admin/* už checkuje is_admin.
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
    return json({ error: 'invalid_json' }, 400);
  }

  if (!body || typeof body.orderId !== 'string') {
    return json({ error: 'bad_request', message: 'Missing orderId' }, 400);
  }

  const { data: order, error: orderErr } = await sb
    .from('bazar_featured_orders')
    .select('id, listing_id, user_id, plan, days, status')
    .eq('id', body.orderId)
    .maybeSingle();
  if (orderErr) {
    console.error('[approve-featured] order lookup failed', orderErr);
    return json({ error: 'db_error' }, 500);
  }
  if (!order) return json({ error: 'order_not_found' }, 404);
  if (order.status !== 'pending') {
    return json({ error: 'invalid_state', message: `Order is already ${order.status}, cannot change.` }, 409);
  }

  if (body.action === 'reject') {
    const { error: updErr } = await sb
      .from('bazar_featured_orders')
      .update({ status: 'failed', admin_note: body.note ?? null })
      .eq('id', order.id);
    if (updErr) return json({ error: 'db_error', message: updErr.message }, 500);
    return json({ ok: true, status: 'failed' });
  }

  // action === 'approve': flip status + call RPC to extend featured.
  const newStatus = body.newStatus === 'paid' ? 'paid' : 'free';
  const { data: rpcRows, error: rpcErr } = await sb.rpc('bazar_extend_featured', {
    p_listing_id: order.listing_id,
    p_days: order.days,
    p_plan: order.plan as FeaturedPlan,
  });
  if (rpcErr || !rpcRows || rpcRows.length === 0) {
    console.error('[approve-featured] extend RPC failed', rpcErr);
    return json({ error: 'rpc_failed', message: rpcErr?.message }, 500);
  }
  const featuredUntil: string = rpcRows[0].featured_until;

  const { error: updErr } = await sb
    .from('bazar_featured_orders')
    .update({
      status: newStatus,
      paid_at: new Date().toISOString(),
      featured_until_after: featuredUntil,
      admin_note: body.note ?? null,
    })
    .eq('id', order.id);
  if (updErr) {
    console.error('[approve-featured] order update failed', updErr);
    return json({ error: 'db_error', message: updErr.message }, 500);
  }

  return json({ ok: true, status: newStatus, featuredUntil });
};
