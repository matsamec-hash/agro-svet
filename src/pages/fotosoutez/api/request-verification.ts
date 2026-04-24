// POST /fotosoutez/api/request-verification
// Hybrid email-verification: 1 magic link per voter per round.
// Voter pastes their email → we (re)generate a token, store it on the
// voter row, and dispatch a magic_link email via Resend.
import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase';
import { getActiveRound, getEntry } from '../../../lib/contest-supabase';
import { verifyTurnstile } from '../../../lib/contest-turnstile';
import { generateVerificationToken } from '../../../lib/contest-voting';
import { sendContestEmail } from '../../../lib/contest-email';
import { getEnvVar } from '../../../lib/env';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const form = await request.formData();
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const entryId = String(form.get('entry_id') ?? '');
  const turnstile = String(form.get('turnstile_token') ?? '');

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'invalid_email' }, 400);
  }
  if (!entryId) return json({ error: 'missing_entry' }, 400);
  if (!(await verifyTurnstile(getEnvVar('TURNSTILE_SECRET_KEY') ?? '', turnstile, clientAddress))) {
    return json({ error: 'captcha_failed' }, 400);
  }

  const round = await getActiveRound();
  if (!round || round.status !== 'voting_open') {
    return json({ error: 'voting_closed' }, 400);
  }

  const entry = await getEntry(entryId);
  if (!entry || entry.status !== 'approved' || entry.round_id !== round.id) {
    return json({ error: 'entry_not_found' }, 404);
  }

  const sb = createServerClient();

  const { data: existing } = await sb
    .from('contest_voters')
    .select('id, email_verified, cookie_id')
    .eq('round_id', round.id)
    .eq('email', email)
    .maybeSingle();

  const token = generateVerificationToken();

  let voterId: string;
  if (existing) {
    await sb.from('contest_voters')
      .update({
        verification_token: token,
        verification_sent_at: new Date().toISOString(),
      })
      .eq('id', existing.id);
    voterId = existing.id;
  } else {
    const { data: created, error } = await sb.from('contest_voters').insert({
      round_id: round.id,
      email,
      verification_token: token,
      verification_sent_at: new Date().toISOString(),
      first_ip: clientAddress,
      first_user_agent: request.headers.get('user-agent'),
    }).select('id').single();
    if (error || !created) return json({ error: 'db_failed', detail: error?.message }, 500);
    voterId = created.id;
  }

  const verifyUrl = `https://agro-svet.cz/fotosoutez/api/verify-email?token=${token}&entry=${entryId}`;

  await sendContestEmail(getEnvVar('RESEND_API_KEY') ?? '', {
    kind: 'magic_link',
    to: email,
    verification_url: verifyUrl,
    voting_ends_at: new Date(round.voting_ends_at).toLocaleString('cs-CZ'),
    entry_title: entry.title,
    entry_author: entry.author_display_name,
  });

  return json({ ok: true, voter_id: voterId });
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
