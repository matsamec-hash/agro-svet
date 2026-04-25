// POST /api/admin/clanky/toggle-featured
// Admin akce: pin/unpin článku jako featured na HP hero gridu.
// Defense in depth — middleware už gate-uje /admin/*, tady druhá kontrola.
// Site filter v UPDATE chrání proti cross-site featured by mistake (sdílená tabulka).
import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../lib/supabase';

export const prerender = false;

const AGRO_SVET_SITE_ID = 'cadc73fd-6bd9-4dc5-a0da-ea33725762e1';

type Body = { articleId: string; featured: boolean };

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

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'bad_request', message: 'Invalid JSON' }, 400);
  }

  if (!body || typeof body !== 'object' || !('articleId' in body) || typeof body.articleId !== 'string') {
    return json({ error: 'bad_request', message: 'Missing articleId' }, 400);
  }
  if (typeof body.featured !== 'boolean') {
    return json({ error: 'bad_request', message: 'featured must be boolean' }, 400);
  }

  const { data: updated, error } = await sb
    .from('articles')
    .update({ featured: body.featured })
    .eq('id', body.articleId)
    .eq('site_id', AGRO_SVET_SITE_ID)
    .select('id, featured')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return json({ error: 'not_found' }, 404);
    }
    console.error('[clanky/toggle-featured] update failed', error);
    return json({ error: 'server_error' }, 500);
  }

  return json({ ok: true, article: updated });
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
