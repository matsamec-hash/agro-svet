// GET /api/bazar/saved-searches/confirm?token=...
// Flips confirmed → true; redirects na /bazar/sledovani/?confirmed=1

import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../lib/supabase';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const token = url.searchParams.get('token') ?? '';
  if (!token) return new Response('Missing token', { status: 400 });

  const sb = createServerClient();
  const { data: row } = await sb
    .from('bazar_saved_searches')
    .select('id, confirmed')
    .eq('confirmation_token', token)
    .maybeSingle();

  if (!row) return Response.redirect('https://agro-svet.cz/bazar/sledovani/?error=invalid_token', 302);

  if (!row.confirmed) {
    await sb
      .from('bazar_saved_searches')
      .update({ confirmed: true })
      .eq('id', row.id);
  }

  return Response.redirect('https://agro-svet.cz/bazar/sledovani/?confirmed=1', 302);
};
