// POST /api/bazar/saved-searches/create
// Body: { email, label, filter, frequency? }
// Vytvoří saved search ve stavu pending-confirmation, pošle confirmation e-mail.

import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../lib/supabase';
import { getEnvVar } from '../../../../lib/env';
import { edgeThrottle } from '../../../../lib/edge-throttle';
import { Resend } from 'resend';

export const prerender = false;

const SITE_ORIGIN = 'https://agro-svet.cz';
const FROM = 'Agro-svět bazar <bazar@mail.agro-svet.cz>';

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}

export const POST: APIRoute = async ({ request, locals, clientAddress }) => {
  const ip = (request.headers.get('cf-connecting-ip') ?? clientAddress ?? 'unknown').toString();
  const limit = await edgeThrottle({
    bucket: 'bazar-saved-search-create',
    key: ip,
    max: 5,
    windowS: 15 * 60,
    ctx: (locals as any).cfContext,
  });
  if (!limit.ok) return json({ error: 'rate_limited' }, 429);

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }

  const email = (body?.email ?? '').toString().trim().toLowerCase();
  const label = (body?.label ?? '').toString().trim().slice(0, 120);
  const filter = body?.filter && typeof body.filter === 'object' ? body.filter : {};
  const frequency = ['instant', 'daily', 'weekly'].includes(body?.frequency) ? body.frequency : 'daily';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'invalid_email' }, 400);
  }
  if (!label) {
    return json({ error: 'missing_label' }, 400);
  }

  const sb = createServerClient();
  const user = (locals as any).user;

  // Email-level max: 10 saved searches / e-mail (defense in depth).
  const { count } = await sb
    .from('bazar_saved_searches')
    .select('id', { count: 'exact', head: true })
    .eq('email', email)
    .neq('status', 'unsubscribed');
  if ((count ?? 0) >= 10) {
    return json({ error: 'too_many_for_email', message: 'Max 10 sledovaných filtrů na jeden e-mail.' }, 409);
  }

  const { data: row, error: insErr } = await sb
    .from('bazar_saved_searches')
    .insert({
      user_id: user?.id ?? null,
      email,
      label,
      filter,
      frequency,
      // Pokud je user přihlášený, předpokládáme že e-mail vlastní → auto-confirm.
      confirmed: !!user?.id,
    })
    .select('id, confirmation_token, unsubscribe_token, confirmed')
    .single();

  if (insErr || !row) {
    console.error('[saved-searches/create] insert failed', insErr);
    return json({ error: 'db_error', message: insErr?.message }, 500);
  }

  // Pokud není auto-confirmed, pošli confirmation e-mail.
  if (!row.confirmed) {
    try {
      const resendKey = getEnvVar('RESEND_API_KEY');
      if (resendKey) {
        const resend = new Resend(resendKey);
        const confirmUrl = `${SITE_ORIGIN}/api/bazar/saved-searches/confirm?token=${encodeURIComponent(row.confirmation_token)}`;
        const unsubUrl = `${SITE_ORIGIN}/api/bazar/saved-searches/unsubscribe?token=${encodeURIComponent(row.unsubscribe_token)}`;
        const html = `
<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#222">
  <h2 style="color:#0A0A0B;">Potvrďte sledování inzerátů</h2>
  <p>Někdo (možná vy) nastavil sledování filtru <strong>${escapeHtml(label)}</strong> na agro-svět.cz.</p>
  <p>Pokud to nebylo vy, tento e-mail ignorujte — bez potvrzení nic neposíláme.</p>
  <p style="margin:24px 0;">
    <a href="${confirmUrl}" style="display:inline-block;background:#FFEA00;color:#0A0A0B;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;">Potvrdit sledování →</a>
  </p>
  <hr style="border:0;border-top:1px solid #eaeaec;margin:24px 0">
  <p style="font-size:12px;color:#999;">
    Po potvrzení dostanete jednou denně e-mail s novými inzeráty, které odpovídají filtru.<br>
    Kdykoliv můžete <a href="${unsubUrl}" style="color:#999;">odhlásit</a>.
  </p>
</div>`;
        await resend.emails.send({
          from: FROM,
          to: email,
          subject: 'Potvrďte sledování inzerátů — agro-svět.cz',
          html,
        });
      }
    } catch (e) {
      console.error('[saved-searches/create] confirmation email failed', e);
    }
  }

  return json({
    ok: true,
    id: row.id,
    confirmed: row.confirmed,
    message: row.confirmed
      ? 'Sledování aktivováno. Dostanete e-mail s novými inzeráty každý den.'
      : 'Sledování čeká na potvrzení. Otevřete potvrzovací e-mail v doručené poště.',
  }, 202);
};

function escapeHtml(s: string): string {
  return s.replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c] as string));
}
