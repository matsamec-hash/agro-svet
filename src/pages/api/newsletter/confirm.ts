import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase';
import { AGRO_SVET_SITE_ID } from '../../../lib/config';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const token = url.searchParams.get('token');
  if (!token) {
    return Response.redirect(new URL('/newsletter/potvrzeno?status=invalid', url), 303);
  }

  const supabase = createServerClient();
  const { data: row, error: selErr } = await supabase
    .from('newsletter_subscribers')
    .select('id, confirmed')
    .eq('site_id', AGRO_SVET_SITE_ID)
    .eq('confirmation_token', token)
    .maybeSingle();

  if (selErr) {
    console.error('[newsletter/confirm] select failed', selErr);
    return Response.redirect(new URL('/newsletter/potvrzeno?status=error', url), 303);
  }
  if (!row) {
    return Response.redirect(new URL('/newsletter/potvrzeno?status=invalid', url), 303);
  }
  if (row.confirmed) {
    return Response.redirect(new URL('/newsletter/potvrzeno?status=already', url), 303);
  }

  const { error: updErr } = await supabase
    .from('newsletter_subscribers')
    .update({ confirmed: true, confirmed_at: new Date().toISOString(), confirmation_token: null })
    .eq('id', row.id);

  if (updErr) {
    console.error('[newsletter/confirm] update failed', updErr);
    return Response.redirect(new URL('/newsletter/potvrzeno?status=error', url), 303);
  }

  return Response.redirect(new URL('/newsletter/potvrzeno?status=ok', url), 303);
};
