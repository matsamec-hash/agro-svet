// POST /fotosoutez/api/vote
// Cast a vote on an approved entry. Voter must already hold the cookie
// from /verify-email. The DB trigger contest_vote_increment_trigger
// updates the entry's vote_count automatically.
import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase';
import { getEntry, getActiveRound } from '../../../lib/contest-supabase';
import { canVote } from '../../../lib/contest-voting';
import { CONTEST_CONFIG } from '../../../lib/contest-config';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, clientAddress, locals }) => {
  const form = await request.formData();
  const entryId = String(form.get('entry_id') ?? '');
  if (!entryId) return json({ error: 'missing_entry' }, 400);

  const cookieId = cookies.get(CONTEST_CONFIG.VOTER_COOKIE)?.value;
  if (!cookieId) return json({ error: 'not_verified', action: 'request_verification' }, 401);

  const sb = createServerClient();

  const { data: voter } = await sb
    .from('contest_voters')
    .select('*')
    .eq('cookie_id', cookieId)
    .maybeSingle();
  if (!voter || !voter.email_verified) {
    return json({ error: 'not_verified', action: 'request_verification' }, 401);
  }

  const entry = await getEntry(entryId);
  if (!entry || entry.status !== 'approved' || entry.round_id !== voter.round_id) {
    return json({ error: 'entry_not_found' }, 404);
  }

  const round = await getActiveRound();
  if (!round || round.status !== 'voting_open' || round.id !== voter.round_id) {
    return json({ error: 'voting_closed' }, 400);
  }

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
    voter_user_id: locals.user?.id ?? null,
  });

  if (!decision.ok) {
    return json(
      {
        error: decision.reason,
        retry_after_ms: 'retry_after_ms' in decision ? decision.retry_after_ms : null,
      },
      429,
    );
  }

  const { error } = await sb.from('contest_votes').insert({
    entry_id: entryId,
    voter_id: voter.id,
    ip: clientAddress,
    user_agent: request.headers.get('user-agent'),
  });
  if (error) return json({ error: 'db_insert_failed', detail: error.message }, 500);

  // Re-read vote_count after the AFTER INSERT trigger has run.
  const { data: updated } = await sb
    .from('contest_entries')
    .select('vote_count')
    .eq('id', entryId)
    .maybeSingle();

  return json({ ok: true, vote_count: updated?.vote_count ?? entry.vote_count + 1 });
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
