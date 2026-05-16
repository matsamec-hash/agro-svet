// GET /api/cron/saved-search-digest — denní pipeline pro notify-me.
//
// Autentizováno přes Authorization: Bearer ${CRON_SECRET} header. Bez tokenu 401.
// Cloudflare Cron Trigger může volat tento endpoint přes scheduled handler (níže),
// nebo external pinger (UptimeRobot, cron-job.org, lokální cron) přes plain HTTP.
//
// Logika: shodná s scripts/send-saved-search-digests.mjs — pull active+confirmed
// saved searches, najdi nové listings od last_notified_at, pošli digest přes Resend.

import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase';
import { getEnvVar } from '../../../lib/env';
import { Resend } from 'resend';

export const prerender = false;

const SITE_ORIGIN = 'https://agro-svet.cz';
const FROM = 'Agro-svět bazar <bazar@mail.agro-svet.cz>';
const RATE_MS = 600;

function escapeHtml(s: string): string {
  return String(s).replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c] as string));
}

const KRAJ_LABELS: Record<string, string> = {
  stredocesky: 'Středočeský', jihocesky: 'Jihočeský', jihomoravsky: 'Jihomoravský',
  moravskoslezsky: 'Moravskoslezský', olomoucky: 'Olomoucký', zlinsky: 'Zlínský',
  vysocina: 'Vysočina', pardubicky: 'Pardubický', kralovehradecky: 'Královéhradecký',
  liberecky: 'Liberecký', ustecky: 'Ústecký', karlovarsky: 'Karlovarský',
  plzensky: 'Plzeňský', praha: 'Praha',
};

function applyFilter(query: any, filter: any) {
  if (filter.query) query = query.or(`title.ilike.%${filter.query}%,description.ilike.%${filter.query}%`);
  if (filter.category) query = query.eq('category', filter.category);
  if (filter.brand) query = query.eq('brand', filter.brand);
  if (filter.priceFrom) query = query.gte('price', parseInt(filter.priceFrom));
  if (filter.priceTo) query = query.lte('price', parseInt(filter.priceTo));
  if (filter.yearFrom) query = query.gte('year_of_manufacture', parseInt(filter.yearFrom));
  if (filter.yearTo) query = query.lte('year_of_manufacture', parseInt(filter.yearTo));
  if (filter.kraj && KRAJ_LABELS[filter.kraj]) query = query.ilike('location', `%${KRAJ_LABELS[filter.kraj]}%`);
  return query;
}

function renderDigestHtml({ label, listings, unsubscribeUrl }: { label: string; listings: any[]; unsubscribeUrl: string }): string {
  const rows = listings.map((l) => {
    const url = `${SITE_ORIGIN}/bazar/${l.id}/`;
    const price = l.price === null ? 'Cena dohodou' : `${l.price.toLocaleString('cs-CZ')} Kč`;
    return `
      <div style="margin:0 0 20px;padding:0 0 20px;border-bottom:1px solid #eaeaec;">
        <h3 style="font-size:16px;margin:0 0 6px;">
          <a href="${url}" style="color:#0A0A0B;text-decoration:none;">${escapeHtml(l.title)}</a>
        </h3>
        <div style="font-size:14px;color:#0B7A3B;font-weight:700;margin-bottom:4px;">${price}</div>
        <div style="font-size:12px;color:#666;">${escapeHtml(l.location ?? '')}${l.brand ? ` · ${escapeHtml(l.brand)}` : ''}</div>
        <a href="${url}" style="font-size:12px;font-weight:700;color:#0B7A3B;text-decoration:none;">Detail →</a>
      </div>
    `;
  }).join('');
  return `
<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#222;">
  <div style="text-align:center;margin-bottom:8px;">
    <a href="${SITE_ORIGIN}" style="display:inline-block;background:#FFEA00;color:#0A0A0B;padding:6px 14px;border-radius:6px;text-decoration:none;font-weight:700;">agro-svět.cz</a>
  </div>
  <p style="text-align:center;font-size:13px;color:#888;margin:0 0 20px;">Nové inzeráty pro: <strong>${escapeHtml(label)}</strong></p>
  ${rows}
  <p style="margin:24px 0;text-align:center;">
    <a href="${SITE_ORIGIN}/bazar/" style="display:inline-block;background:#0A0A0B;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px;">Otevřít bazar</a>
  </p>
  <hr style="border:0;border-top:1px solid #eaeaec;margin:20px 0;">
  <p style="font-size:11px;color:#999;line-height:1.5;">
    Dostáváte tento e-mail, protože jste si nastavili sledování filtru na agro-svět.cz.
    <a href="${unsubscribeUrl}" style="color:#999;">Odhlásit sledování</a>.
  </p>
</div>`;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const GET: APIRoute = async ({ request }) => {
  // Auth — required Authorization: Bearer ${CRON_SECRET}
  const expected = getEnvVar('CRON_SECRET');
  if (!expected) {
    return new Response('CRON_SECRET env not set', { status: 503 });
  }
  const auth = request.headers.get('authorization') ?? '';
  if (auth !== `Bearer ${expected}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const resendKey = getEnvVar('RESEND_API_KEY');
  if (!resendKey) return new Response('RESEND_API_KEY missing', { status: 503 });

  const sb = createServerClient();
  const cutoff = new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString();
  const { data: searches, error } = await sb
    .from('bazar_saved_searches')
    .select('*')
    .eq('status', 'active')
    .eq('confirmed', true)
    .or(`last_notified_at.is.null,last_notified_at.lt.${cutoff}`);

  if (error) {
    return new Response(JSON.stringify({ error: 'db_error', message: error.message }), { status: 500 });
  }

  const resend = new Resend(resendKey);
  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const s of searches ?? []) {
    const since = s.last_notified_at ?? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    let q = sb
      .from('bazar_listings')
      .select('id, title, price, location, brand, created_at')
      .eq('status', 'active')
      .gt('created_at', since)
      .order('created_at', { ascending: false })
      .limit(20);
    q = applyFilter(q, s.filter ?? {});
    const { data: listings, error: lErr } = await q;
    if (lErr) { failed++; continue; }
    if (!listings || listings.length === 0) {
      skipped++;
      await sb.from('bazar_saved_searches').update({ last_notified_at: new Date().toISOString() }).eq('id', s.id);
      continue;
    }
    const unsubUrl = `${SITE_ORIGIN}/api/bazar/saved-searches/unsubscribe?token=${encodeURIComponent(s.unsubscribe_token)}`;
    const subject = `${listings.length} ${listings.length === 1 ? 'nový inzerát' : listings.length < 5 ? 'nové inzeráty' : 'nových inzerátů'}: ${s.label}`;
    const html = renderDigestHtml({ label: s.label, listings, unsubscribeUrl: unsubUrl });

    try {
      await resend.emails.send({
        from: FROM,
        to: s.email,
        subject,
        html,
        headers: {
          'List-Unsubscribe': `<${unsubUrl}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
      });
      await sb.from('bazar_saved_searches').update({
        last_notified_at: new Date().toISOString(),
        notification_count: (s.notification_count ?? 0) + 1,
      }).eq('id', s.id);
      sent++;
    } catch (e) {
      console.error('[cron/saved-search-digest] send failed', s.email, e);
      failed++;
    }
    await sleep(RATE_MS);
  }

  return new Response(JSON.stringify({
    ok: true,
    total: searches?.length ?? 0,
    sent, skipped, failed,
    timestamp: new Date().toISOString(),
  }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};
