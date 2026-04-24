// POST /admin/fotosoutez/api/moderate
// Approve or reject a pending entry. Records the decision in
// contest_admin_log and fires the corresponding email to the author.
//
// Auth: locals.user (set by middleware) + bazar_users.is_admin = true.
// Middleware already gates /admin/* routes; this is the second line of
// defence against a bug elsewhere stripping the gate.
import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../lib/supabase';
import { getEntry } from '../../../../lib/contest-supabase';
import { sendContestEmail } from '../../../../lib/contest-email';
import { getEnvVar } from '../../../../lib/env';

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
  const entryId = String(form.get('entry_id') ?? '');
  const action = String(form.get('action') ?? '');
  const reason = String(form.get('reason') ?? '');
  if (!entryId || !['approve', 'reject'].includes(action)) {
    return json({ error: 'bad_request' }, 400);
  }

  const entry = await getEntry(entryId);
  if (!entry) return json({ error: 'not_found' }, 404);

  const newStatus = action === 'approve' ? 'approved' : 'rejected';
  await sb.from('contest_entries').update({
    status: newStatus,
    rejection_reason: action === 'reject' ? reason : null,
    moderated_by: user.id,
    moderated_at: new Date().toISOString(),
  }).eq('id', entryId);

  await sb.from('contest_admin_log').insert({
    admin_user_id: user.id,
    action: action === 'approve' ? 'approve_entry' : 'reject_entry',
    target_type: 'entry',
    target_id: entryId,
    details: action === 'reject' ? { reason } : null,
  });

  // Notify the author. Failure must not block the moderation decision.
  const { data: owner } = await sb
    .from('bazar_users')
    .select('email, contest_display_name, name')
    .eq('id', entry.user_id)
    .maybeSingle();
  const { data: round } = await sb
    .from('contest_rounds')
    .select('title')
    .eq('id', entry.round_id)
    .single();

  if (owner?.email) {
    const displayName = owner.contest_display_name ?? owner.name ?? undefined;
    const roundTitle = round?.title ?? '';
    const apiKey = getEnvVar('RESEND_API_KEY') ?? '';
    if (action === 'approve') {
      sendContestEmail(apiKey, {
        kind: 'upload_approved',
        to: owner.email,
        display_name: displayName,
        entry_title: entry.title,
        round_title: roundTitle,
        share_url: `https://agro-svet.cz/fotosoutez/foto/${entry.id}/`,
      }).catch((e) => console.error('[moderate] email failed', e));
    } else {
      sendContestEmail(apiKey, {
        kind: 'upload_rejected',
        to: owner.email,
        display_name: displayName,
        entry_title: entry.title,
        round_title: roundTitle,
        reason,
      }).catch((e) => console.error('[moderate] email failed', e));
    }
  }

  return json({ ok: true });
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
