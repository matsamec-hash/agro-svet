import type { APIRoute } from 'astro';
import { createAnonClient, createServerClient } from '../../../../lib/supabase';
import { confirmProspect, getProspectByToken, type EnsureUser } from '../../../../lib/bazar-seed';
import { SITE_URL } from '../../../../lib/config';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress, cookies }) => {
  const form = await request.formData();
  const token = form.get('token')?.toString() ?? '';
  const termsVersion = form.get('terms_version')?.toString() ?? '';
  const agree = form.get('agree')?.toString() === 'on';
  if (!token || !agree) return new Response('Chybí souhlas nebo token', { status: 400 });

  const supabase = createServerClient();

  // Zajisti auth usera: dohledej podle e-mailu (bazar_users), jinak vytvoř passwordless.
  const ensureUser: EnsureUser = async ({ email, name, phone }) => {
    const { data: existing } = await supabase.from('bazar_users').select('id').eq('email', email).maybeSingle();
    if (existing?.id) return existing.id as string;

    const { data: created, error } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { name, phone },
    });
    if (error || !created.user) throw new Error(`createUser: ${error?.message}`);
    const uid = created.user.id;
    const { error: pErr } = await supabase.from('bazar_users').insert({
      id: uid, name: name || email, phone: phone || '', email, location: '',
    });
    if (pErr) throw new Error(`bazar_users insert: ${pErr.message}`);
    return uid;
  };

  // Vlastník e-mailu potřebný pro magic link níže — natáhni ho stejnou typovanou
  // funkcí, kterou používá i confirmProspect (žádná duplicitní sloupcová query).
  let email = '';
  // Host-based CSRF v middleware pouští POSTy bez Origin (server-to-server); IP pro
  // audit proto bereme z Cloudflare hlavičky (stejná konvence jako ostatní bazar API
  // za týmž proxy řetězcem CF→Traefik→Node) s fallbackem na clientAddress.
  const ip = request.headers.get('cf-connecting-ip') ?? clientAddress ?? 'unknown';
  try {
    const prospect = await getProspectByToken(supabase, token);
    email = prospect?.email ?? '';
    await confirmProspect(supabase, {
      token,
      ip,
      termsVersion,
      ensureUser,
    });
  } catch (e) {
    return new Response(`Chyba: ${(e as Error).message}`, { status: 400 });
  }

  // Passwordless přihlášení BEZ round-tripu přes prohlížeč: dřív jsme prodejce
  // přesměrovávali na Supabase magic-link → /bazar/auth/callback, jenže ten callback
  // je PKCE flow a čeká code_verifier v prohlížeči. Server-generovaný odkaz žádný
  // verifier nemá → getSession selhal → „Přihlášení přes Google selhalo". Místo toho
  // session založíme rovnou tady: generateLink dá hashed_token, verifyOtp ho na
  // anon klientovi vymění za session, a její tokeny uložíme do stejných cookies,
  // které čte middleware (sb-access-token / sb-refresh-token).
  try {
    const { data: link } = await supabase.auth.admin.generateLink({ type: 'magiclink', email });
    const tokenHash = link?.properties?.hashed_token;
    if (tokenHash) {
      const anon = createAnonClient();
      const { data: verified } = await anon.auth.verifyOtp({ token_hash: tokenHash, type: 'magiclink' });
      const session = verified?.session;
      if (session?.access_token && session.refresh_token) {
        const cookieOpts = {
          path: '/',
          httpOnly: true,
          secure: import.meta.env.PROD,
          sameSite: 'lax' as const,
          maxAge: 60 * 60 * 24 * 7,
        };
        cookies.set('sb-access-token', session.access_token, cookieOpts);
        cookies.set('sb-refresh-token', session.refresh_token, cookieOpts);
      }
    }
  } catch {
    // Když se auto-login nepovede, inzerát je i tak zveřejněný — prodejce se
    // dostane do „Moje inzeráty" přes běžné přihlášení. Nezhazujeme kvůli tomu redirect.
  }
  return new Response(null, {
    status: 303,
    headers: { Location: `${SITE_URL}/bazar/moje/?welcome=1` },
  });
};
