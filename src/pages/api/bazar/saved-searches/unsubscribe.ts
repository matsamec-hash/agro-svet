// GET /api/bazar/saved-searches/unsubscribe?token=...
// One-click unsubscribe (RFC 8058 friendly).

import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../lib/supabase';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const token = url.searchParams.get('token') ?? '';
  if (!token) return new Response('Missing token', { status: 400 });

  const sb = createServerClient();
  const { data: row } = await sb
    .from('bazar_saved_searches')
    .select('id, status')
    .eq('unsubscribe_token', token)
    .maybeSingle();

  if (!row) return Response.redirect('https://agro-svet.cz/bazar/sledovani/?error=invalid_token', 302);

  if (row.status !== 'unsubscribed') {
    await sb
      .from('bazar_saved_searches')
      .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
      .eq('id', row.id);
  }

  return Response.redirect('https://agro-svet.cz/bazar/sledovani/?unsubscribed=1', 302);
};

// List-Unsubscribe-Post one-click handling
export const POST: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  return GET({ request, url } as any);
};
