// GET /api/bazar/featured/status?order=<id> — vlastník orderu pollne stav.
import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../lib/supabase';

export const prerender = false;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}

export const GET: APIRoute = async ({ url, locals }) => {
  const user = (locals as any).user;
  if (!user) return json({ error: 'unauthenticated' }, 401);
  const orderId = url.searchParams.get('order') ?? '';
  if (!orderId) return json({ error: 'missing_order' }, 400);

  const sb = createServerClient();
  const { data: order } = await sb
    .from('bazar_featured_orders')
    .select('id, user_id, status, featured_until_after')
    .eq('id', orderId)
    .maybeSingle();
  if (!order) return json({ error: 'not_found' }, 404);
  if (order.user_id !== user.id) return json({ error: 'forbidden' }, 403);

  return json({ status: order.status, featuredUntil: order.featured_until_after ?? null });
};
