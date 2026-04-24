// GET /fotosoutez/api/verify-email?token=...&entry=...
// Magic-link landing: marks the voter as verified, sets the cookie that
// authorises subsequent /vote calls for this round, and (if entry= passed)
// casts the first vote inline so the click feels instant.
import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase';
import { getEntry } from '../../../lib/contest-supabase';
import { CONTEST_CONFIG } from '../../../lib/contest-config';
import { canVote } from '../../../lib/contest-voting';

export const prerender = false;

export const GET: APIRoute = async ({ url, cookies, clientAddress, request, redirect }) => {
  const token = url.searchParams.get('token');
  const entryId = url.searchParams.get('entry');
  if (!token) return new Response('Missing token', { status: 400 });

  const sb = createServerClient();

  const { data: voter } = await sb
    .from('contest_voters')
    .select('*')
    .eq('verification_token', token)
    .maybeSingle();

  if (!voter) return new Response('Invalid or expired link', { status: 400 });

  await sb.from('contest_voters').update({
    email_verified: true,
    verified_at: new Date().toISOString(),
    verification_token: null,
  }).eq('id', voter.id);

  const { data: round } = await sb
    .from('contest_rounds')
    .select('voting_ends_at, slug')
    .eq('id', voter.round_id)
    .single();

  cookies.set(CONTEST_CONFIG.VOTER_COOKIE, voter.cookie_id, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    expires: round ? new Date(round.voting_ends_at) : undefined,
  });

  let castedFirstVote = false;
  if (entryId) {
    const entry = await getEntry(entryId);
    if (entry && entry.status === 'approved' && entry.round_id === voter.round_id) {
      const { data: voterHistory } = await sb
        .from('contest_votes')
        .select('voter_id, voted_at, ip, is_valid')
        .eq('voter_id', voter.id);

      const since = new Date(Date.now() - 86_400_000).toISOString();
      const { data: ipHistory } = await sb
        .from('contest_votes')
        .select('voter_id, voted_at, ip, is_valid')
        .eq('ip', clientAddress)
        .gte('voted_at', since);

      const decision = canVote({
        voter: { email_verified: true },
        voter_history: voterHistory ?? [],
        ip_history_last_24h: ipHistory ?? [],
        entry_owner_id: entry.user_id,
        voter_user_id: null,
      });
      if (decision.ok) {
        await sb.from('contest_votes').insert({
          entry_id: entryId,
          voter_id: voter.id,
          ip: clientAddress,
          user_agent: request.headers.get('user-agent'),
        });
        castedFirstVote = true;
      }
    }
  }

  const roundSlug = round?.slug ?? '';
  const target = entryId
    ? `/fotosoutez/foto/${entryId}?verified=1${castedFirstVote ? '&voted=1' : ''}`
    : `/fotosoutez/${roundSlug}/?verified=1`;
  return redirect(target);
};
