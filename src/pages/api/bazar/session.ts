import type { APIRoute } from 'astro';
import { createAnonClient, createServerClient } from '../../../lib/supabase';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  let body: { access_token?: string; refresh_token?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const { access_token, refresh_token } = body;
  if (!access_token || !refresh_token) {
    return new Response(JSON.stringify({ error: 'Missing tokens' }), { status: 400 });
  }

  const supabase = createAnonClient();
  const { data, error } = await supabase.auth.setSession({ access_token, refresh_token });

  if (error || !data.session || !data.user) {
    return new Response(JSON.stringify({ error: 'Invalid session' }), { status: 401 });
  }

  const user = data.user;
  const server = createServerClient();
  const { data: existing } = await server.from('bazar_users').select('id').eq('id', user.id).maybeSingle();

  if (!existing) {
    const meta = (user.user_metadata ?? {}) as Record<string, string | undefined>;
    const name = meta.name || meta.full_name || user.email?.split('@')[0] || 'Uživatel';
    await server.from('bazar_users').insert({
      id: user.id,
      name,
      email: user.email ?? '',
      phone: meta.phone ?? '',
      location: meta.location ?? '',
    });
  }

  const cookieOpts = {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7,
  };

  cookies.set('sb-access-token', data.session.access_token, cookieOpts);
  cookies.set('sb-refresh-token', data.session.refresh_token!, cookieOpts);

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
