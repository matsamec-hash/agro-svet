import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../lib/supabase';
import { confirmProspect, getProspectByToken, type EnsureUser } from '../../../../lib/bazar-seed';
import { SITE_URL } from '../../../../lib/config';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
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

  // Passwordless přihlášení: vygeneruj magic link a přesměruj přes callback na /bazar/moje?welcome=1.
  const nextPath = encodeURIComponent('/bazar/moje?welcome=1');
  const { data: link } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: { redirectTo: `${SITE_URL}/bazar/auth/callback/?next=${nextPath}` },
  });
  const actionLink = link?.properties?.action_link ?? `${SITE_URL}/bazar/moje/?welcome=1`;
  return new Response(null, { status: 303, headers: { Location: actionLink } });
};
