// src/pages/admin/akce/api/moderate.ts
import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../lib/supabase';
import { moderate, getById } from '../../../../lib/akce-supabase';
import { sendApproved, sendRejected } from '../../../../lib/akce-email';
import { getEnvVar } from '../../../../lib/env';
import type { AkceInput } from '../../../../lib/akce';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) return json({ error: 'unauthenticated' }, 401);

  const sb = createServerClient();
  const { data: profile } = await sb.from('bazar_users').select('is_admin').eq('id', user.id).maybeSingle();
  if (!(profile as { is_admin?: boolean } | null)?.is_admin) return json({ error: 'forbidden' }, 403);

  const form = await request.formData();
  const id = String(form.get('akce_id') ?? '');
  const action = String(form.get('action') ?? '');
  const reason = String(form.get('reason') ?? '');
  if (!id || !['approve', 'reject', 'approve_edit'].includes(action)) return json({ error: 'bad_request' }, 400);

  let patch: Partial<AkceInput> | undefined;
  if (action === 'approve_edit') {
    patch = {
      nazev: optional(form.get('nazev')),
      popis: optional(form.get('popis')),
      obec: optional(form.get('obec')),
    } as Partial<AkceInput>;
  }

  const before = await getById(id);
  if (!before) return json({ error: 'not_found' }, 404);

  const updated = await moderate({
    id,
    action: action === 'reject' ? 'reject' : 'approve',
    reason,
    moderatorId: user.id,
    patch,
  });

  const apiKey = getEnvVar('RESEND_API_KEY') ?? '';
  if (before.email) {
    if (action === 'reject') {
      sendRejected(apiKey, before.email, before.nazev, reason).catch((e) => console.error('[akce/moderate] mail', e));
    } else if (updated) {
      sendApproved(apiKey, before.email, updated.nazev, updated.slug).catch((e) => console.error('[akce/moderate] mail', e));
    }
  }
  return json({ ok: true });
};

function optional(v: FormDataEntryValue | null): string | undefined {
  const s = String(v ?? '').trim();
  return s === '' ? undefined : s;
}
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}
