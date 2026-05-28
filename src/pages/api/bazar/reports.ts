import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase';
import { getEnvVar } from '../../../lib/env';
import { SITE_URL } from '../../../lib/config';
import { edgeThrottle } from '../../../lib/edge-throttle';
import { sendBazarReportNotification } from '../../../lib/bazar-report-email';

export const prerender = false;

const ALLOWED_REASONS = new Set([
  'padelek', 'podvod', 'mlm-pujcky', 'leciva-or', 'osiva-hnojiva',
  'zvirata-cites', 'zbrane', 'erotika-tabak', 'autorska-prava',
  'spam-duplicita', 'nezakonny-obsah', 'jine',
]);

const THROTTLE_MAX = 3;
const THROTTLE_WINDOW_S = 15 * 60;

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

function isUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
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
  const reason = (form.get('reason')?.toString() ?? '').trim();
  const description = (form.get('description')?.toString() ?? '').trim().slice(0, 4000);
  const reporterEmailRaw = (form.get('reporter_email')?.toString() ?? '').trim().toLowerCase();
  const honeypot = (form.get('website')?.toString() ?? '').trim();

  if (honeypot) {
    // Bot: pretend success.
    return Response.redirect(`${SITE_URL}/bazar/nahlasit/?ok=1`, 303);
  }

  if (!ALLOWED_REASONS.has(reason)) {
    return redirectWithError('reason');
  }
  if (reason === 'jine' && description.length < 10) {
    return redirectWithError('description', listingIdRaw);
  }
  if (description.length > 4000) {
    return redirectWithError('description-long', listingIdRaw);
  }
  const reporterEmail = reporterEmailRaw && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reporterEmailRaw)
    ? reporterEmailRaw
    : null;

  const listingId = listingIdRaw && isUuid(listingIdRaw) ? listingIdRaw : null;
  const listingUrl = listingId
    ? `${SITE_URL}/bazar/${listingId}/`
    : `${SITE_URL}/bazar/`;

  const ipHash = ip === 'unknown' ? null : await sha256Hex(`bazar-report:${ip}`);

  const supabase = createServerClient();
  const { data: inserted, error: insertErr } = await supabase
    .from('bazar_reports')
    .insert({
      listing_id: listingId,
      listing_url: listingUrl,
      reason,
      description,
      reporter_email: reporterEmail,
      reporter_ip_hash: ipHash,
    })
    .select('id')
    .single();

  if (insertErr || !inserted) {
    console.error('[api/bazar/reports] insert failed', insertErr);
    return redirectWithError('server', listingIdRaw);
  }

  const apiKey = getEnvVar('RESEND_API_KEY') ?? '';
  const ctx = (locals as any).cfContext;
  const notify = sendBazarReportNotification(apiKey, {
    reportId: inserted.id as string,
    listingId,
    listingUrl,
    reason,
    description,
    reporterEmail,
  }).catch((e) => console.error('[api/bazar/reports] notify failed', e));
  if (ctx?.waitUntil) ctx.waitUntil(notify);

  return Response.redirect(`${SITE_URL}/bazar/nahlasit/?ok=1`, 303);
};

function redirectWithError(code: string, listingId?: string): Response {
  const url = new URL(`${SITE_URL}/bazar/nahlasit/`);
  url.searchParams.set('err', code);
  if (listingId) url.searchParams.set('listing', listingId);
  return Response.redirect(url.toString(), 303);
}
