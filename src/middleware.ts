import { defineMiddleware } from 'astro:middleware';
import { createAnonClient } from './lib/supabase';
import {
  gateActive,
  isGateBypassed,
  expectedGateHash,
  GATE_COOKIE_NAME,
} from './lib/site-gate';

const PROTECTED_PATHS = [
  '/bazar/novy',
  '/bazar/moje',
  '/bazar/profil',
  '/fotosoutez/nahrat',
  '/fotosoutez/moje',
];

const ADMIN_PATHS = ['/admin/'];

export const onRequest = defineMiddleware(async (context, next) => {
  const { cookies, url, locals, redirect } = context;

  // ---- Site gate: runs FIRST, above everything else -------------------------
  // To disable: unset SITE_GATE_PASSCODE env var and redeploy.
  const gateOn = gateActive();
  (locals as { siteGateActive?: boolean }).siteGateActive = gateOn;

  if (gateOn) {
    if (url.pathname === '/sitemap.xml') {
      return new Response('Not Found', { status: 404 });
    }
    if (!isGateBypassed(url.pathname)) {
      const cookieVal = cookies.get(GATE_COOKIE_NAME)?.value;
      const expected = await expectedGateHash();
      if (cookieVal !== expected) {
        const nextPath = url.pathname + url.search;
        return redirect(`/unlock/?next=${encodeURIComponent(nextPath)}`);
      }
    }
  }
  // ---------------------------------------------------------------------------

  const accessToken = cookies.get('sb-access-token')?.value;
  const refreshToken = cookies.get('sb-refresh-token')?.value;

  if (accessToken && refreshToken) {
    const supabase = createAnonClient();
    const { data } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (data.session) {
      locals.user = data.session.user;

      // Refresh tokens if they changed.
      // secure=true would be ignored on http://localhost in dev — gate it
      // on PROD so dev login cookies actually persist in the browser.
      if (data.session.access_token !== accessToken) {
        const cookieOpts = {
          path: '/',
          httpOnly: true,
          secure: import.meta.env.PROD,
          sameSite: 'lax' as const,
          maxAge: 60 * 60 * 24 * 7,
        };
        cookies.set('sb-access-token', data.session.access_token, cookieOpts);
        cookies.set('sb-refresh-token', data.session.refresh_token!, cookieOpts);
      }
    } else {
      locals.user = null;
    }
  } else {
    locals.user = null;
  }

  // Protect routes
  const isProtected = PROTECTED_PATHS.some(p => url.pathname.startsWith(p));
  if (isProtected && !locals.user) {
    const redirectTarget = url.pathname.startsWith('/fotosoutez')
      ? `/bazar/prihlaseni/?redirect=${encodeURIComponent(url.pathname)}`
      : '/bazar/prihlaseni/';
    return redirect(redirectTarget);
  }

  const isAdmin = ADMIN_PATHS.some(p => url.pathname.startsWith(p));
  if (isAdmin) {
    if (!locals.user) {
      return redirect('/bazar/prihlaseni/?redirect=' + encodeURIComponent(url.pathname));
    }
    const sb = createAnonClient();
    const { data } = await sb
      .from('bazar_users')
      .select('is_admin')
      .eq('id', locals.user.id)
      .maybeSingle();
    const isAdminUser = (data as { is_admin?: boolean } | null)?.is_admin === true;
    if (!isAdminUser) {
      return new Response('Forbidden', { status: 403 });
    }
  }

  const response = await next();

  if (gateOn) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    // CRITICAL: prevent Cloudflare/browser from caching gated responses.
    // Without this, CF caches a 200 (returned to a session with cookie) and
    // then serves it to everyone — gate leaks. It also caches the 302→/unlock/
    // for the cookieless first visit, so even after the user gets a cookie
    // their next navigation hits the cached redirect.
    response.headers.set('Cache-Control', 'private, no-store, no-cache, must-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Vary', 'Cookie');
  }

  return response;
});
