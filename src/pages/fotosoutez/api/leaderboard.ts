// GET /fotosoutez/api/leaderboard?round={slug}&limit=10
// Powers the live leaderboard widget on the round galleries. Returns the
// top N approved entries by vote_count plus how many votes each entry
// gathered in the last hour (helps surface "hot" entries climbing fast).
//
// Cached at the edge for 30 s with stale-while-revalidate=60 — keeps the
// leaderboard feeling live without hammering Supabase from the JS poll.
import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase';

const PHOTO_BASE_URL =
  'https://obhypfuzmknvmknskdwh.supabase.co/storage/v1/object/public/contest-photos/';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const roundSlug = url.searchParams.get('round');
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get('limit') ?? 10)));
  if (!roundSlug) return json({ error: 'missing_round' }, 400);

  const sb = createServerClient();
  const { data: round } = await sb
    .from('contest_rounds')
    .select('id, slug, voting_ends_at, status')
    .eq('slug', roundSlug)
    .maybeSingle();
  if (!round) return json({ error: 'round_not_found' }, 404);

  const { data: entries } = await sb
    .from('contest_entries')
    .select('id, title, author_display_name, photo_path, vote_count, last_vote_at')
    .eq('round_id', round.id)
    .eq('status', 'approved')
    .order('vote_count', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(limit);

  const since = new Date(Date.now() - 3_600_000).toISOString();

  const hourlyCounts = new Map<string, number>();
  if (entries && entries.length > 0) {
    const ids = entries.map(e => e.id);
    const { data: recentVotes } = await sb
      .from('contest_votes')
      .select('entry_id')
      .in('entry_id', ids)
      .gte('voted_at', since)
      .eq('is_valid', true);
    for (const v of recentVotes ?? []) {
      hourlyCounts.set(v.entry_id, (hourlyCounts.get(v.entry_id) ?? 0) + 1);
    }
  }

  const body = {
    round: { slug: round.slug, voting_ends_at: round.voting_ends_at, status: round.status },
    entries: (entries ?? []).map((e, i) => ({
      id: e.id,
      rank: i + 1,
      title: e.title,
      author: e.author_display_name,
      vote_count: e.vote_count,
      last_hour_votes: hourlyCounts.get(e.id) ?? 0,
      photo_url: `${PHOTO_BASE_URL}${e.photo_path}`,
    })),
  };

  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
    },
  });
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
