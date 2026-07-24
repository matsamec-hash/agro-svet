import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase';
import { getEnvVar } from '../../../lib/env';
import { verifyTurnstile } from '../../../lib/contest-turnstile';
import { isRateLimited, recordCodeAttempt } from '../../../lib/bazar-code-ratelimit';
import { getProspectByCode } from '../../../lib/bazar-seed';
import { isTokenExpired } from '../../../lib/bazar-seed-token';
import { SITE_URL } from '../../../lib/config';

export const prerender = false;

function redirectBack(msg: string): Response {
  return new Response(null, { status: 303, headers: { Location: `${SITE_URL}/prodejce/?error=${encodeURIComponent(msg)}` } });
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const supabase = createServerClient();
  const form = await request.formData();
  const code = form.get('code')?.toString() ?? '';
  const turnstileToken = form.get('cf-turnstile-response')?.toString() ?? '';
  const ip = request.headers.get('cf-connecting-ip') ?? clientAddress ?? 'unknown';

  if (await isRateLimited(supabase, ip)) {
    return redirectBack('Příliš mnoho pokusů. Zkuste to za pár minut.');
  }
  await recordCodeAttempt(supabase, ip);

  const okTurnstile = await verifyTurnstile(getEnvVar('TURNSTILE_SECRET_KEY') ?? '', turnstileToken, ip);
  if (!okTurnstile) return redirectBack('Ověření robota selhalo, zkuste to znovu.');

  const prospect = await getProspectByCode(supabase, code);
  if (!prospect) return redirectBack('Kód neplatí. Zkontrolujte ho prosím.');
  if (prospect.status === 'confirmed') {
    return new Response(null, { status: 303, headers: { Location: `${SITE_URL}/bazar/moje/` } });
  }
  if (isTokenExpired(prospect.token_expires_at)) return redirectBack('Platnost kódu vypršela.');

  return new Response(null, { status: 303, headers: { Location: `${SITE_URL}/bazar/prevzit/${prospect.claim_token}` } });
};
