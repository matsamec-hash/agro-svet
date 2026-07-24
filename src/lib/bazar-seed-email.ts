import { Resend } from 'resend';
import { SITE_URL } from './config';

const FROM = 'Agro-svět bazar <bazar@mail.agro-svet.cz>';

// Značka e-mailu = identita webu: černá + žlutý akcent, hlavičkový font Chakra Petch.
// Jedno místo pro tokeny, ať se HTML čte a snadno ladí.
const C = {
  ink: '#1a1a1a',
  yellow: '#FFEA00',
  muted: '#767676',
  line: '#e6e6e6',
  field: '#f5f5f5',
  card: '#ffffff',
  bg: '#efefe9',
};
// Hlavičkový font (jako web). Apple Mail ho z Google Fonts načte; Gmail spadne na fallback.
const HEAD = "'Chakra Petch','Segoe UI Semibold',system-ui,-apple-system,Arial,sans-serif";
const BODY = "system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";

export function claimUrl(token: string): string {
  return `${SITE_URL}/bazar/prevzit/${token}`;
}

/** České skloňování slova „inzerát" podle počtu (1 / 2–4 / 5+). */
export function pluralInzerat(n: number): string {
  if (n === 1) return 'inzerát';
  if (n >= 2 && n <= 4) return 'inzeráty';
  return 'inzerátů';
}

export interface ClaimEmailArgs {
  name: string;
  token: string;
  listingTitle: string;
  /** Počet připravených inzerátů (default 1). Ovlivní předmět i text. */
  listingCount?: number;
}

export function buildClaimEmail(args: ClaimEmailArgs): { subject: string; html: string } {
  const url = claimUrl(args.token);
  const count = Math.max(1, args.listingCount ?? 1);
  const many = count > 1;
  const firstName = args.name.trim().split(/\s+/)[0] ?? '';
  const greeting = firstName ? `Dobrý den, ${firstName},` : 'Dobrý den,';

  const subject = many
    ? `Připravili jsme vám ${count} ${pluralInzerat(count)} — zveřejněte je zdarma na Agro-svět`
    : `Váš inzerát „${args.listingTitle}" — zveřejněte ho zdarma na Agro-svět`;

  // Skrytý preheader (náhledový text ve schránce, v těle neviditelný).
  const preheader = many
    ? `${count} hotových ${pluralInzerat(count)} čeká — stačí zkontrolovat a jedním klikem zveřejnit. Zdarma a bez závazku.`
    : 'Hotový inzerát čeká — stačí zkontrolovat a jedním klikem zveřejnit. Zdarma a bez závazku.';

  const lead = many
    ? `všimli jsme si vašich nabídek zemědělské techniky a podle nich jsme vám na bazaru
       <strong>Agro-svět</strong> předchystali <strong>${count} hotových ${pluralInzerat(count)}</strong>.
       Nemusíte nic psát ani nahrávat — stačí je zkontrolovat a rozhodnout, které chcete zveřejnit.`
    : `všimli jsme si vaší nabídky a podle ní jsme vám na bazaru <strong>Agro-svět</strong>
       předchystali hotový inzerát <strong>„${args.listingTitle}"</strong>. Nemusíte nic psát ani
       nahrávat — stačí ho zkontrolovat a jedním klikem zveřejnit.`;

  const benefit = (title: string, body: string): string => `
    <tr>
      <td width="30" valign="top" style="padding:7px 0;">
        <span style="display:inline-block;width:22px;height:22px;line-height:22px;text-align:center;
          background:${C.yellow};color:${C.ink};font-weight:700;font-size:13px;border-radius:5px;font-family:${HEAD};">✓</span>
      </td>
      <td valign="top" style="padding:7px 0;color:${C.ink};font-size:15px;line-height:1.55;font-family:${BODY};">
        <strong style="font-family:${HEAD};">${title}</strong> — ${body}
      </td>
    </tr>`;

  const html = `<!doctype html>
<html lang="cs">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="x-apple-disable-message-reformatting">
<title>${subject}</title>
<link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:${C.bg};">
  <span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;
    mso-hide:all;font-size:1px;line-height:1px;color:${C.bg};">${preheader}</span>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};">
    <tr>
      <td align="center" style="padding:28px 12px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0"
          style="width:100%;max-width:560px;background:${C.card};border:1px solid ${C.ink};border-radius:14px;overflow:hidden;">

          <!-- Hlavička: černý pruh, žlutý akcent (jako sekční label webu) -->
          <tr>
            <td style="background:${C.ink};padding:20px 32px;border-bottom:4px solid ${C.yellow};">
              <span style="color:#ffffff;font-family:${HEAD};font-size:21px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Agro-svět</span>
              <span style="color:${C.yellow};font-family:${HEAD};font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-left:8px;">Bazar</span>
            </td>
          </tr>

          <!-- Tělo -->
          <tr>
            <td style="padding:30px 32px 8px;">
              <p style="margin:0 0 14px;color:${C.ink};font-size:16px;line-height:1.5;font-family:${BODY};">${greeting}</p>
              <p style="margin:0 0 20px;color:${C.ink};font-size:16px;line-height:1.6;font-family:${BODY};">${lead}</p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:6px 0 22px;">
                ${benefit('Úplně zdarma', 'zveřejnění i vedení inzerátu vás nestojí ani korunu, žádné poplatky.')}
                ${benefit('Víc kupců', 'Agro-svět čtou tisíce českých zemědělců, kteří techniku sami hledají.')}
                ${benefit('Bez práce', 'inzerát' + (many ? 'y jsou' : ' je') + ' hotový, fotky i popis už máte připravené.')}
                ${benefit('Rozhodujete vy', 'nic není závazné — zveřejníte, upravíte nebo smažete, kdykoli budete chtít.')}
              </table>

              <!-- CTA: černé tlačítko s bílým textem (jako .btn-primary) -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:6px 0 8px;">
                    <a href="${url}"
                      style="display:inline-block;background:${C.ink};color:#ffffff;text-decoration:none;
                      font-family:${HEAD};font-size:16px;font-weight:700;letter-spacing:.3px;padding:16px 34px;border-radius:10px;">
                      Zkontrolovat a zveřejnit zdarma
                    </a>
                    <div style="margin-top:12px;color:${C.muted};font-size:13px;font-family:${BODY};">
                      Nefunguje tlačítko? Otevřete:
                      <a href="${url}" style="color:${C.ink};text-decoration:underline;text-decoration-color:${C.yellow};text-decoration-thickness:2px;">${url}</a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Uklidnění / jak mazat -->
          <tr>
            <td style="padding:8px 32px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                style="background:${C.field};border-radius:10px;border-left:4px solid ${C.yellow};">
                <tr>
                  <td style="padding:16px 18px;color:#444;font-size:13.5px;line-height:1.6;font-family:${BODY};">
                    Přes odkaz v tomto e-mailu se k ${many ? 'inzerátům' : 'inzerátu'} kdykoli vrátíte —
                    můžete ${many ? 'je' : 'ho'} <strong style="color:${C.ink};">upravit i smazat</strong>. Pokud o zveřejnění
                    nemáte zájem, e-mail klidně ignorujte: ${many ? 'inzeráty zůstanou' : 'inzerát zůstane'} neveřejný
                    a <strong style="color:${C.ink};">po 30 dnech se sám smaže</strong> i s fotkami.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Kdo jsme / patička -->
          <tr>
            <td style="padding:20px 32px 26px;border-top:1px solid ${C.line};">
              <p style="margin:0 0 8px;color:${C.ink};font-family:${HEAD};font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">Kdo jsme</p>
              <p style="margin:0;color:#555;font-size:13.5px;line-height:1.6;font-family:${BODY};">
                Agro-svět je český web o zemědělství a technice — zprávy, encyklopedie strojů a bazar,
                kde si sedláci prodávají techniku mezi sebou. Bazar je pro prodejce zdarma; chceme jen,
                aby dobrá technika našla nového majitele.
              </p>
              <p style="margin:12px 0 0;color:${C.muted};font-size:12.5px;line-height:1.6;font-family:${BODY};">
                <a href="${SITE_URL}/bazar/" style="color:${C.ink};text-decoration:underline;text-decoration-color:${C.yellow};text-decoration-thickness:2px;">agro-svet.cz/bazar</a>
                &nbsp;·&nbsp; Napište nám na
                <a href="mailto:bazar@agro-svet.cz" style="color:${C.ink};text-decoration:underline;text-decoration-color:${C.yellow};text-decoration-thickness:2px;">bazar@agro-svet.cz</a>
              </p>
            </td>
          </tr>
        </table>

        <p style="margin:16px 0 0;color:#9a9a92;font-size:11.5px;font-family:${BODY};">
          Tento e-mail jsme vám poslali, protože jsme podle vaší veřejné inzerce připravili nabídku ke zveřejnění zdarma.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html };
}

/** Odešle claim e-mail přes Resend. Vrací true při úspěchu. */
export async function sendClaimEmail(apiKey: string, to: string, args: ClaimEmailArgs): Promise<boolean> {
  if (!apiKey) return false;
  const { subject, html } = buildClaimEmail(args);
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({ from: FROM, to, subject, html });
  return !error;
}
