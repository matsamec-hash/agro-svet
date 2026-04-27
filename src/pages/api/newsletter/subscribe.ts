import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase';
import { getEnvVar } from '../../../lib/env';
import { AGRO_SVET_SITE_ID } from '../../../lib/config';
import { sendNewsletterConfirmation } from '../../../lib/newsletter-email';

export const prerender = false;

function genToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export const POST: APIRoute = async ({ request }) => {
  let email = '';
  try {
    const body = await request.json();
    email = (body?.email ?? '').toString().trim().toLowerCase();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_body' }), { status: 400 });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: 'invalid_email' }), { status: 400 });
  }

  const supabase = createServerClient();

  const { data: existing } = await supabase
    .from('newsletter_subscribers')
    .select('id, confirmed, confirmation_token')
    .eq('site_id', AGRO_SVET_SITE_ID)
    .eq('email', email)
    .maybeSingle();

  if (existing?.confirmed) {
    return new Response(JSON.stringify({ status: 'already_confirmed' }), { status: 200 });
  }

  const token = genToken();
  const apiKey = getEnvVar('RESEND_API_KEY') ?? '';

  if (existing) {
    const { error: updErr } = await supabase
      .from('newsletter_subscribers')
      .update({ confirmation_token: token })
      .eq('id', existing.id);
    if (updErr) {
      console.error('[newsletter/subscribe] update token failed', updErr);
      return new Response(JSON.stringify({ error: 'db_error' }), { status: 500 });
    }
  } else {
    const { error: insErr } = await supabase
      .from('newsletter_subscribers')
      .insert({ site_id: AGRO_SVET_SITE_ID, email, confirmed: false, confirmation_token: token });
    if (insErr) {
      console.error('[newsletter/subscribe] insert failed', insErr);
      return new Response(JSON.stringify({ error: 'db_error' }), { status: 500 });
    }
  }

  try {
    await sendNewsletterConfirmation(apiKey, email, token);
  } catch (e) {
    console.error('[newsletter/subscribe] email send failed', e);
    return new Response(JSON.stringify({ error: 'email_send_failed' }), { status: 502 });
  }

  return new Response(JSON.stringify({ status: 'pending_confirmation' }), { status: 200 });
};
