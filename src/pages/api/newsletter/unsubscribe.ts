import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase';
import { AGRO_SVET_SITE_ID } from '../../../lib/config';

export const prerender = false;

async function unsubscribe(token: string | null, baseUrl: URL) {
  if (!token) {
    return Response.redirect(new URL('/newsletter/odhlaseno?status=invalid', baseUrl), 303);
  }

  const supabase = createServerClient();
  const { data: row, error: selErr } = await supabase
    .from('newsletter_subscribers')
    .select('id, unsubscribed_at')
    .eq('site_id', AGRO_SVET_SITE_ID)
    .eq('unsubscribe_token', token)
    .maybeSingle();

  if (selErr) {
    console.error('[newsletter/unsubscribe] select failed', selErr);
    return Response.redirect(new URL('/newsletter/odhlaseno?status=error', baseUrl), 303);
  }
  if (!row) {
    return Response.redirect(new URL('/newsletter/odhlaseno?status=invalid', baseUrl), 303);
  }
  if (row.unsubscribed_at) {
    return Response.redirect(new URL('/newsletter/odhlaseno?status=already', baseUrl), 303);
  }

  const { error: updErr } = await supabase
    .from('newsletter_subscribers')
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq('id', row.id);

  if (updErr) {
    console.error('[newsletter/unsubscribe] update failed', updErr);
    return Response.redirect(new URL('/newsletter/odhlaseno?status=error', baseUrl), 303);
  }

  return Response.redirect(new URL('/newsletter/odhlaseno?status=ok', baseUrl), 303);
}

// GET: human click from email footer.
export const GET: APIRoute = async ({ url }) => {
  return unsubscribe(url.searchParams.get('token'), url);
};

// POST: RFC 8058 one-click (Gmail/Yahoo bulk-sender requirement). Token in query OR body.
export const POST: APIRoute = async ({ url, request }) => {
  let token = url.searchParams.get('token');
  if (!token) {
    try {
      const body = await request.text();
      const params = new URLSearchParams(body);
      token = params.get('token');
    } catch { /* ignore */ }
  }
  return unsubscribe(token, url);
};
