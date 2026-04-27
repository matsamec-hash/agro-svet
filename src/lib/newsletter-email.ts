import { Resend } from 'resend';
import { SITE_URL } from './config';

const FROM = 'Agro-svět <newsletter@mail.agro-svet.cz>';
const REPLY_TO = 'info@agro-svet.cz';

export function buildUnsubscribeUrl(unsubscribeToken: string): string {
  return `${SITE_URL}/api/newsletter/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`;
}

export async function sendNewsletterConfirmation(
  apiKey: string,
  to: string,
  confirmationToken: string,
  unsubscribeToken: string,
): Promise<void> {
  if (!apiKey) {
    console.warn('[newsletter-email] RESEND_API_KEY missing — skipping send', to);
    return;
  }
  const confirmUrl = `${SITE_URL}/api/newsletter/confirm?token=${encodeURIComponent(confirmationToken)}`;
  const unsubscribeUrl = buildUnsubscribeUrl(unsubscribeToken);
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: FROM,
    replyTo: REPLY_TO,
    to,
    subject: 'Potvrďte odběr newsletteru Agro-svět',
    headers: {
      'List-Unsubscribe': `<${unsubscribeUrl}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px">
        <h1 style="font-size:22px;color:#0A0A0B">Potvrďte odběr</h1>
        <p>Děkujeme za zájem o newsletter Agro-svět. Pro aktivaci odběru klikněte na tlačítko níže:</p>
        <p style="margin:28px 0">
          <a href="${confirmUrl}" style="display:inline-block;background:#FFEA00;color:#0A0A0B;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:700">Potvrdit odběr</a>
        </p>
        <p style="font-size:13px;color:#666">Pokud tlačítko nefunguje, zkopírujte odkaz: <br><a href="${confirmUrl}">${confirmUrl}</a></p>
        <p style="font-size:13px;color:#666">Pokud jste o odběr nežádali, e-mail ignorujte — bez kliknutí na potvrzovací odkaz vám nic posílat nebudeme.</p>
        <hr style="border:0;border-top:1px solid #eaeaec;margin:24px 0">
        <p style="font-size:12px;color:#999;line-height:1.6">
          Agro-svět · <a href="${SITE_URL}" style="color:#999">${SITE_URL}</a><br>
          Vaše osobní údaje (e-mail) zpracováváme pro zasílání newsletteru na základě vašeho souhlasu (čl. 6 odst. 1 písm. a GDPR). Více v <a href="${SITE_URL}/zpracovani-osobnich-udaju/" style="color:#999">zásadách zpracování osobních údajů</a>.<br>
          <a href="${unsubscribeUrl}" style="color:#999">Odhlásit odběr</a> · <a href="mailto:${REPLY_TO}" style="color:#999">${REPLY_TO}</a>
        </p>
      </div>
    `,
  });
  if (error) {
    console.error('[newsletter-email] send failed', to, error);
    throw error;
  }
}
