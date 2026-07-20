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
  const subject = `Váš inzerát „${args.listingTitle}" — zveřejněte ho zdarma na Agro-svět`;
  const html = `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#1a1a1a;line-height:1.5">
      <p>${greeting}</p>
      <p>všimli jsme si vaší nabídky <strong>${args.listingTitle}</strong> a podle ní jsme vám
      připravili hotový inzerát na zemědělském bazaru <strong>Agro-svět</strong>. Stačí ho
      zkontrolovat a jedním kliknutím zveřejnit.</p>
      <p style="margin:0 0 6px"><strong>Proč to udělat:</strong></p>
      <ul style="margin:0 0 20px;padding-left:20px;color:#333">
        <li><strong>Zdarma</strong> — zveřejnění i inzerát vás nestojí ani korunu.</li>
        <li><strong>Víc kupců</strong> — Agro-svět čtou tisíce českých zemědělců, kteří techniku sami hledají.</li>
        <li><strong>Máte to pod kontrolou</strong> — inzerát je hotový, nic nemusíte psát.</li>
      </ul>
      <p style="text-align:center;margin:28px 0">
        <a href="${url}" style="background:#2f7d32;color:#fff;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block">
          Zkontrolovat a zveřejnit zdarma
        </a>
      </p>
      <p style="color:#666;font-size:13px">Rozhodujete jen vy. Přes odkaz v tomto e-mailu se
      k inzerátu kdykoli vrátíte a můžete ho <strong>upravit nebo smazat</strong>. Pokud o zveřejnění
      nemáte zájem, e-mail klidně ignorujte — inzerát zůstane neveřejný a po 30 dnech se sám smaže.</p>
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
