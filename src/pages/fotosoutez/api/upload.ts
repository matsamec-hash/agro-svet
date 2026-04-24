// POST /fotosoutez/api/upload — submit a contest entry.
//
// Sequence:
//   1. authn (locals.user from middleware)
//   2. Turnstile gate (anti-bot)
//   3. round must be in upload_open phase
//   4. user has not exceeded MAX_ENTRIES_PER_ROUND
//   5. validate uploaded image (size/mime/dims/EXIF)
//   6. validate text fields + required consents
//   7. insert pending entry → upload to storage → patch path
//   8. fire-and-forget upload_pending email
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { createServerClient } from '../../../lib/supabase';
import { getActiveRound, countUserEntriesInRound } from '../../../lib/contest-supabase';
import { validateUpload, buildStoragePath } from '../../../lib/contest-images';
import { verifyTurnstile } from '../../../lib/contest-turnstile';
import { sendContestEmail } from '../../../lib/contest-email';
import { CONTEST_CONFIG } from '../../../lib/contest-config';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals, clientAddress }) => {
  const user = locals.user;
  if (!user) return json({ error: 'unauthenticated' }, 401);

  const form = await request.formData();
  const file = form.get('photo');
  if (!(file instanceof File)) return json({ error: 'missing_photo' }, 400);

  const turnstileToken = String(form.get('turnstile_token') ?? '');
  const okTurnstile = await verifyTurnstile(
    (env as any).TURNSTILE_SECRET_KEY,
    turnstileToken,
    clientAddress,
  );
  if (!okTurnstile) return json({ error: 'captcha_failed' }, 400);

  const round = await getActiveRound();
  if (!round || round.status !== 'upload_open') {
    return json({ error: 'upload_closed' }, 400);
  }

  const existingCount = await countUserEntriesInRound(user.id, round.id);
  if (existingCount >= CONTEST_CONFIG.MAX_ENTRIES_PER_ROUND) {
    return json({ error: 'entry_limit' }, 400);
  }

  const imageCheck = await validateUpload(file);
  if (!imageCheck.ok) {
    return json({ error: 'invalid_image', reason: imageCheck.reason }, 400);
  }

  const title = String(form.get('title') ?? '').trim().slice(0, 80);
  if (!title) return json({ error: 'missing_title' }, 400);

  const caption = String(form.get('caption') ?? '').trim().slice(0, 500) || null;
  const displayName = String(form.get('author_display_name') ?? '').trim().slice(0, 80);
  if (!displayName) return json({ error: 'missing_display_name' }, 400);

  const confirmSelf = form.get('confirm_self_author') === 'on';
  const confirmRules = form.get('confirm_rules') === 'on';
  if (!confirmSelf || !confirmRules) {
    return json({ error: 'missing_consent' }, 400);
  }

  const sb = createServerClient();

  // Insert pending row first so we can use its id in the storage path.
  const { data: inserted, error: insertErr } = await sb
    .from('contest_entries')
    .insert({
      round_id: round.id,
      user_id: user.id,
      photo_path: 'pending',
      photo_width: imageCheck.width,
      photo_height: imageCheck.height,
      title,
      caption,
      author_display_name: displayName,
      author_location: String(form.get('author_location') ?? '').trim() || null,
      brand_slug: String(form.get('brand_slug') ?? '').trim() || null,
      model_slug: String(form.get('model_slug') ?? '').trim() || null,
      series_slug: String(form.get('series_slug') ?? '').trim() || null,
      location_kraj_slug: String(form.get('location_kraj_slug') ?? '').trim() || null,
      location_okres_slug: String(form.get('location_okres_slug') ?? '').trim() || null,
      year_taken: Number(form.get('year_taken')) || null,
      exif_has_metadata: imageCheck.has_exif,
      upload_ip: clientAddress,
      upload_user_agent: request.headers.get('user-agent'),
      license_merch_print: form.get('license_merch_print') === 'on',
      status: 'pending',
    })
    .select('id')
    .single();

  if (insertErr || !inserted) {
    return json({ error: 'db_insert_failed', detail: insertErr?.message }, 500);
  }

  const storagePath = buildStoragePath(user.id, round.slug, inserted.id, imageCheck.mime);
  const arrayBuffer = await file.arrayBuffer();
  const { error: storageErr } = await sb.storage
    .from('contest-photos')
    .upload(storagePath, arrayBuffer, {
      contentType: imageCheck.mime,
      upsert: false,
    });

  if (storageErr) {
    // Roll back the entry row so the user can retry without hitting the limit.
    await sb.from('contest_entries').delete().eq('id', inserted.id);
    return json({ error: 'storage_upload_failed', detail: storageErr.message }, 500);
  }

  await sb
    .from('contest_entries')
    .update({ photo_path: storagePath })
    .eq('id', inserted.id);

  // Fire-and-forget — failing to email must not fail the upload.
  if (user.email) {
    sendContestEmail((env as any).RESEND_API_KEY, {
      kind: 'upload_pending',
      to: user.email,
      display_name: displayName,
      entry_title: title,
    }).catch(err => console.error('[upload] email failed', err));
  }

  return json({ ok: true, entry_id: inserted.id });
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
