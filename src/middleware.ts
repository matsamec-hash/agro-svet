import { defineMiddleware } from 'astro:middleware';
import { createAnonClient } from './lib/supabase';

const PROTECTED_PATHS = ['/bazar/novy', '/bazar/moje', '/bazar/profil'];

export const onRequest = defineMiddleware(async (context, next) => {
  const { cookies, url, locals, redirect } = context;

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

      // Refresh tokens if they changed
      if (data.session.access_token !== accessToken) {
        cookies.set('sb-access-token', data.session.access_token, {
          path: '/',
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
        });
        cookies.set('sb-refresh-token', data.session.refresh_token!, {
          path: '/',
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
        });
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
    return redirect('/bazar/prihlaseni/');
  }

  return next();
});
