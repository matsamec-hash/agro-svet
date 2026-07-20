import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../lib/supabase';
import { getEnvVar } from '../../../../lib/env';
import { SITE_URL } from '../../../../lib/config';
import { edgeThrottle } from '../../../../lib/edge-throttle';
import { Resend } from 'resend';

export const prerender = false;

const FROM = 'Agro-svět bazar <bazar@mail.agro-svet.cz>';

// Passwordless obnova přihlášení: pošle na e-mail jednorázový přihlašovací odkaz.
// Odkaz vede na /bazar/auth/odkaz, kde server přes verifyOtp založí session (stejný
// pattern jako auto-login po claimu — spolehlivý, mimo rozbité PKCE). Odpověď je
// VŽDY generická (no user-enumeration): neprozradíme, jestli e-mail účet má.
export const POST: APIRoute = async ({ request, locals, clientAddress }) => {
  const generic = () =>
    new Response(null, { status: 303, headers: { Location: '/bazar/prihlaseni/?odkaz=1' } });

  const ip = (request.headers.get('cf-connecting-ip') ?? clientAddress ?? 'unknown').toString();
  const limit = await edgeThrottle({
    bucket: 'login-link',
    key: ip,
    max: 5,
    windowS: 600,
    ctx: (locals as any).cfContext,
  });
  if (!limit.ok) return generic();

  const form = await request.formData();
  const email = (form.get('email')?.toString() ?? '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return generic();

  const supabase = createServerClient();
  const { data: user } = await supabase
    .from('bazar_users')
    .select('id')
    .eq('email', email)
    .maybeSingle();
  if (!user) return generic();

  try {
    const { data: link } = await supabase.auth.admin.generateLink({ type: 'magiclink', email });
    const tokenHash = link?.properties?.hashed_token;
    const apiKey = getEnvVar('RESEND_API_KEY') ?? '';
    if (tokenHash && apiKey) {
      const url = `${SITE_URL}/bazar/auth/odkaz/?t=${encodeURIComponent(tokenHash)}`;
      const html = `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#1a1a1a;line-height:1.5">
          <p>Dobrý den,</p>
          <p>klikněte na tlačítko níže a přihlásíme vás do vašeho účtu na bazaru Agro-svět —
          bez hesla. Odkaz je platný krátce a jen pro jedno použití.</p>
          <p style="text-align:center;margin:28px 0">
            <a href="${url}" style="background:#2f7d32;color:#fff;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block">
              Přihlásit se
            </a>
          </p>
          <p style="color:#666;font-size:13px">Pokud jste o přihlášení nežádali, e-mail ignorujte —
          nic se nestane a odkaz nikdo bez vaší schránky nepoužije.</p>
        </div>`;
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: FROM,
        to: email,
        subject: 'Přihlašovací odkaz — Agro-svět bazar',
        html,
      });
    }
  } catch {
    // I při chybě odpovídáme genericky.
  }
  return generic();
};
