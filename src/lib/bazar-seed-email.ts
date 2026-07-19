import { Resend } from 'resend';
import { SITE_URL } from './config';

const FROM = 'Agro-svět bazar <bazar@mail.agro-svet.cz>';

export function claimUrl(token: string): string {
  return `${SITE_URL}/bazar/prevzit/${token}`;
}

export function buildClaimEmail(args: { name: string; token: string; listingTitle: string }): {
  subject: string;
  html: string;
} {
  const url = claimUrl(args.token);
  const greeting = args.name ? `Dobrý den, ${args.name},` : 'Dobrý den,';
  const subject = `Váš inzerát „${args.listingTitle}" je připravený ke zveřejnění`;
  const html = `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto">
      <p>${greeting}</p>
      <p>připravili jsme pro vás inzerát <strong>${args.listingTitle}</strong> na zemědělském
      bazaru Agro-svět. Podle vašeho inzerátu jsme jej předvyplnili — stačí jej zkontrolovat
      a jedním kliknutím zveřejnit zdarma.</p>
      <p style="text-align:center;margin:28px 0">
        <a href="${url}" style="background:#2f7d32;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none">
          Zkontrolovat a zveřejnit
        </a>
      </p>
      <p style="color:#666;font-size:13px">Pokud o zveřejnění nemáte zájem, e-mail ignorujte —
      inzerát zůstane neveřejný a po 30 dnech se smaže.</p>
    </div>`;
  return { subject, html };
}

/** Odešle claim e-mail přes Resend. Vrací true při úspěchu. */
export async function sendClaimEmail(
  apiKey: string,
  to: string,
  args: { name: string; token: string; listingTitle: string },
): Promise<boolean> {
  if (!apiKey) return false;
  const { subject, html } = buildClaimEmail(args);
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({ from: FROM, to, subject, html });
  return !error;
}
