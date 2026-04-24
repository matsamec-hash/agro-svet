// POST /admin/fotosoutez/api/announce
// Sets winner_entry_id / runner_up_entry_id / third_place_entry_id on a
// round and transitions status to 'announced'. Sends winner_result emails
// to all finalists. Idempotent-ish: re-announcing just overwrites the
// selection but will re-send emails, so the UI blocks re-announce via
// `round.status === 'announced'` guard.
//
// Auth: middleware gates /admin/* globally. The handler re-checks
// is_admin as a defence-in-depth measure.
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { createServerClient } from '../../../../lib/supabase';
import { sendContestEmail } from '../../../../lib/contest-email';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) return json({ error: 'unauthenticated' }, 401);

  const sb = createServerClient();
  const { data: profile } = await sb
    .from('bazar_users')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();
  if (!profile?.is_admin) return json({ error: 'forbidden' }, 403);

  const form = await request.formData();
  const roundId = String(form.get('round_id') ?? '');
  const winnerEntryId = String(form.get('winner_entry_id') ?? '');
  const runnerUpEntryId = String(form.get('runner_up_entry_id') ?? '') || null;
  const thirdPlaceEntryId = String(form.get('third_place_entry_id') ?? '') || null;

  if (!roundId || !winnerEntryId) return json({ error: 'bad_request' }, 400);

  const { data: round } = await sb
    .from('contest_rounds')
    .select('id, title, status, prize_first, prize_second, prize_third')
    .eq('id', roundId)
    .maybeSingle();
  if (!round) return json({ error: 'round_not_found' }, 404);

  // Validate selected entries belong to this round and are approved.
  const ids = [winnerEntryId, runnerUpEntryId, thirdPlaceEntryId].filter(Boolean) as string[];
  const { data: entries } = await sb
    .from('contest_entries')
    .select('id, user_id, title, round_id, status')
    .in('id', ids);
  const entriesById = new Map((entries ?? []).map((e) => [e.id, e]));
  for (const id of ids) {
    const e = entriesById.get(id);
    if (!e || e.round_id !== roundId || e.status !== 'approved') {
      return json({ error: 'invalid_entry', entry_id: id }, 400);
    }
  }

  const { error: updateErr } = await sb
    .from('contest_rounds')
    .update({
      status: 'announced',
      winner_entry_id: winnerEntryId,
      runner_up_entry_id: runnerUpEntryId,
      third_place_entry_id: thirdPlaceEntryId,
    })
    .eq('id', roundId);
  if (updateErr) return json({ error: 'update_failed', detail: updateErr.message }, 500);

  await sb.from('contest_admin_log').insert({
    admin_user_id: user.id,
    action: 'announce_winners',
    target_type: 'round',
    target_id: roundId,
    details: {
      winner_entry_id: winnerEntryId,
      runner_up_entry_id: runnerUpEntryId,
      third_place_entry_id: thirdPlaceEntryId,
    },
  });

  // Notify winners. Failures must not roll back the DB state.
  const placements: Array<{ id: string | null; place: 1 | 2 | 3; prize: string | null }> = [
    { id: winnerEntryId, place: 1, prize: round.prize_first ?? null },
    { id: runnerUpEntryId, place: 2, prize: round.prize_second ?? null },
    { id: thirdPlaceEntryId, place: 3, prize: round.prize_third ?? null },
  ];

  const apiKey = (env as any).RESEND_API_KEY;
  for (const p of placements) {
    if (!p.id) continue;
    const entry = entriesById.get(p.id);
    if (!entry) continue;
    const { data: owner } = await sb
      .from('bazar_users')
      .select('email, contest_display_name, name')
      .eq('id', entry.user_id)
      .maybeSingle();
    if (!owner?.email) continue;
    sendContestEmail(apiKey, {
      kind: 'winner_result',
      to: owner.email,
      display_name: owner.contest_display_name ?? owner.name ?? undefined,
      round_title: round.title,
      placement: p.place,
      prize: p.prize ?? undefined,
    }).catch((e) => console.error('[announce] winner email failed', p.place, e));
  }

  return json({ ok: true });
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
