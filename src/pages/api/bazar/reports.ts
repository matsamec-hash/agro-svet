import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase';
import { getEnvVar } from '../../../lib/env';
import { SITE_URL } from '../../../lib/config';
import { edgeThrottle } from '../../../lib/edge-throttle';
import { validateReport, listingUrlFor } from '../../../lib/bazar-report';
import {
  sendBazarReportNotification,
  sendBazarReportConfirmation,
} from '../../../lib/bazar-report-email';

// Oznámení závadného inzerátu (DSA čl. 16). Náležitosti podle odst. 2 hlídá
// validateReport(); potvrzení o přijetí (odst. 4) jde oznamovateli e-mailem.
// ‼️ Počítá se sloupci z migrace 024_bazar_reports_dsa.sql (reporter_name,
// good_faith, confirmation_sent_at) — bez ní insert spadne.

export const prerender = false;

const THROTTLE_MAX = 3;
const THROTTLE_WINDOW_S = 15 * 60;

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

export const POST: APIRoute = async ({ request, locals, clientAddress }) => {
  const ip = (request.headers.get('cf-connecting-ip') ?? clientAddress ?? 'unknown').toString();

  const limit = await edgeThrottle({
    bucket: 'bazar-report',
    key: ip,
    max: THROTTLE_MAX,
    windowS: THROTTLE_WINDOW_S,
    ctx: (locals as any).cfContext,
  });
  if (!limit.ok) {
    return new Response(JSON.stringify({ error: 'rate_limited' }), {
      status: 429,
      headers: { 'content-type': 'application/json', 'retry-after': String(limit.retryAfterS) },
    });
  }

  const form = await request.formData();
  const listingIdRaw = (form.get('listing_id')?.toString() ?? '').trim();
  const honeypot = (form.get('website')?.toString() ?? '').trim();

  if (honeypot) {
    // Bot: pretend success.
    return Response.redirect(`${SITE_URL}/bazar/nahlasit/?ok=1`, 303);
  }

  const v = validateReport(form, SITE_URL);
  if (!v.ok) return redirectWithError(v.error, listingIdRaw);
  const { listingId, reason, description, reporterName, reporterEmail } = v.data;

  const supabase = createServerClient();

  // Inzerát musí existovat (FK by insert stejně odmítl, takhle dostane
  // oznamovatel srozumitelnou chybu místo „nepodařilo se uložit").
  const { data: listing, error: listingErr } = await supabase
    .from('bazar_listings')
    .select('id')
    .eq('id', listingId)
    .maybeSingle();
  if (listingErr) {
    console.error('[api/bazar/reports] listing lookup failed', listingErr);
    return redirectWithError('server', listingIdRaw);
  }
  if (!listing) return redirectWithError('listing-not-found', listingIdRaw);

  const listingUrl = listingUrlFor(listingId, SITE_URL);
  const ipHash = ip === 'unknown' ? null : await sha256Hex(`bazar-report:${ip}`);

  const { data: inserted, error: insertErr } = await supabase
    .from('bazar_reports')
    .insert({
      listing_id: listingId,
      listing_url: listingUrl,
      reason,
      description,
      reporter_name: reporterName,
      reporter_email: reporterEmail,
      reporter_ip_hash: ipHash,
      good_faith: true,
    })
    .select('id')
    .single();

  if (insertErr || !inserted) {
    console.error('[api/bazar/reports] insert failed', insertErr);
    return redirectWithError('server', listingIdRaw);
  }
  const reportId = inserted.id as string;

  const apiKey = getEnvVar('RESEND_API_KEY') ?? '';
  const ctx = (locals as any).cfContext;

  const notify = sendBazarReportNotification(apiKey, {
    reportId,
    listingId,
    listingUrl,
    reason,
    description,
    reporterName,
    reporterEmail,
    goodFaith: true,
  }).catch((e) => console.error('[api/bazar/reports] notify failed', e));

  // DSA čl. 16 odst. 4 — potvrzení o přijetí bez zbytečného odkladu. Úspěšné
  // odeslání si poznamenáme (confirmation_sent_at) jako doklad.
  const confirm = reporterEmail
    ? sendBazarReportConfirmation(apiKey, { to: reporterEmail, reportId, listingUrl })
        .then(async (sent) => {
          if (!sent) return;
          const { error } = await supabase
            .from('bazar_reports')
            .update({ confirmation_sent_at: new Date().toISOString() })
            .eq('id', reportId);
          if (error) console.error('[api/bazar/reports] confirmation_sent_at update failed', error);
        })
        .catch((e) => console.error('[api/bazar/reports] confirmation failed', e))
    : Promise.resolve();

  const background = Promise.all([notify, confirm]);
  if (ctx?.waitUntil) ctx.waitUntil(background);

  const okUrl = new URL(`${SITE_URL}/bazar/nahlasit/`);
  okUrl.searchParams.set('ok', '1');
  okUrl.searchParams.set('id', reportId);
  if (reporterEmail) okUrl.searchParams.set('potvrzeni', '1');
  return Response.redirect(okUrl.toString(), 303);
};

function redirectWithError(code: string, listingId?: string): Response {
  const url = new URL(`${SITE_URL}/bazar/nahlasit/`);
  url.searchParams.set('err', code);
  if (listingId) url.searchParams.set('listing', listingId.slice(0, 300));
  return Response.redirect(url.toString(), 303);
}
