// GET /admin-oauth/auth — Decap CMS OAuth flow start.
// Decap otevře tento URL v popupu s ?provider=github&site_id=...&scope=repo.
// Vygenerujeme state (CSRF), uložíme do httpOnly cookie, redirekt na GitHub.
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

export const GET: APIRoute = async ({ request, redirect, cookies }) => {
  const url = new URL(request.url);
  const provider = url.searchParams.get('provider');
  if (provider !== 'github') {
    return new Response('Unsupported provider', { status: 400 });
  }

  const clientId = (env as any).GITHUB_OAUTH_CLIENT_ID as string;
  if (!clientId) return new Response('Missing GITHUB_OAUTH_CLIENT_ID', { status: 500 });

  // CSRF state — random 32 bytes hex
  const stateBytes = new Uint8Array(32);
  crypto.getRandomValues(stateBytes);
  const state = Array.from(stateBytes, (b) => b.toString(16).padStart(2, '0')).join('');

  cookies.set('decap_oauth_state', state, {
    path: '/admin-oauth',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    maxAge: 600,
  });

  const callback = `${url.origin}/admin-oauth/callback`;
  const ghUrl = new URL('https://github.com/login/oauth/authorize');
  ghUrl.searchParams.set('client_id', clientId);
  ghUrl.searchParams.set('redirect_uri', callback);
  ghUrl.searchParams.set('scope', 'repo,user');
  ghUrl.searchParams.set('state', state);

  return redirect(ghUrl.toString(), 302);
};
