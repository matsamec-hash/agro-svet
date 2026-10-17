import { Resend } from 'resend';
import { SITE_URL } from './config';

const FROM = 'Agro-svět bazar <bazar@mail.agro-svet.cz>';
const ADMIN = 'info@samecdigital.com';

const REASON_LABELS: Record<string, string> = {
  'padelek': 'Padělek / neoriginální díly',
  'podvod': 'Podvod / scam',
  'mlm-pujcky': 'MLM, půjčky, pyramida',
  'leciva-or': 'Léčiva / přípravky na ochranu rostlin bez oprávnění',
  'osiva-hnojiva': 'Osiva / hnojiva v rozporu s registrem',
  'zvirata-cites': 'Zvířata bez vet. osvědčení / chráněné druhy bez CITES',
  'zbrane': 'Zbraně / střelivo / výbušniny',
  'erotika-tabak': 'Erotika / tabák / alkohol / drogy',
  'autorska-prava': 'Porušení autorských / průmyslových / osobnostních práv',
  'spam-duplicita': 'Spam / duplicita / klamavý obsah',
  'zneuzivani-deti': 'Sexuální zneužívání dětí (směrnice 2011/93/EU)',
  'nezakonny-obsah': 'Nezákonný obsah',
  'jine': 'Jiné',
};

export function reasonLabel(code: string): string {
  return REASON_LABELS[code] ?? code;
}

export async function sendBazarReportNotification(
  apiKey: string,
  payload: {
    reportId: string;
    listingId: string | null;
    listingUrl: string;
    reason: string;
    description: string;
    reporterName: string | null;
    reporterEmail: string | null;
    goodFaith: boolean;
  },
): Promise<void> {
  if (!apiKey) {
    console.warn('[bazar-report-email] RESEND_API_KEY missing — skipping admin notification');
    return;
  }
  const resend = new Resend(apiKey);
  const reason = reasonLabel(payload.reason);
  const desc = payload.description.trim() || '(bez popisu)';
  const who = payload.reporterName ? escapeHtml(payload.reporterName) : '(jméno neuvedeno)';
  const replyHint = payload.reporterEmail
    ? `Oznamovatel: ${who} — <a href="mailto:${escapeHtml(payload.reporterEmail)}">${escapeHtml(payload.reporterEmail)}</a>. Výsledek posouzení mu sdělte (DSA čl. 16 odst. 5).`
    : `Oznamovatel: ${who}, e-mail neuvedl (dovoleno jen u oznámení podle směrnice 2011/93/EU).`;

  const { error } = await resend.emails.send({
    from: FROM,
    replyTo: payload.reporterEmail ?? ADMIN,
    to: ADMIN,
    subject: `[Bazar report] ${reason} — ${payload.listingId ?? 'unknown'}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#222">
        <h1 style="font-size:18px;margin:0 0 12px">Nové hlášení závadného inzerátu</h1>
        <p style="margin:0 0 6px"><strong>Report ID:</strong> ${escapeHtml(payload.reportId)}</p>
        <p style="margin:0 0 6px"><strong>Inzerát:</strong> <a href="${escapeHtml(payload.listingUrl)}">${escapeHtml(payload.listingUrl)}</a></p>
        <p style="margin:0 0 6px"><strong>Důvod:</strong> ${escapeHtml(reason)}</p>
        <p style="margin:0 0 6px"><strong>Prohlášení o dobré víře:</strong> ${payload.goodFaith ? 'ano' : 'ne'}</p>
        <p style="margin:12px 0 4px"><strong>Odůvodnění:</strong></p>
        <pre style="background:#fbfaf4;border:1px solid #e8e4d2;border-radius:8px;padding:12px;white-space:pre-wrap;word-break:break-word;font-family:inherit;font-size:13px;line-height:1.55;margin:0">${escapeHtml(desc)}</pre>
        <p style="margin:16px 0 6px;font-size:13px;color:#666">${replyHint}</p>
        <hr style="border:0;border-top:1px solid #eaeaec;margin:20px 0">
        <p style="font-size:12px;color:#999">
          Posuďte bez zbytečného odkladu (max 7 dnů). Přehled hlášení:
          <a href="${SITE_URL}/admin/bazar/reports/">${SITE_URL}/admin/bazar/reports/</a>
          (Supabase: tabulka <code>bazar_reports</code>, ID ${escapeHtml(payload.reportId)}).
        </p>
      </div>
    `,
  });
  if (error) {
    console.error('[bazar-report-email] Resend error', error);
  }
}

/**
 * Potvrzení o přijetí oznámení pro oznamovatele (DSA čl. 16 odst. 4).
 *
 * ‼️ Záměrně neobsahuje NIC, co napsal oznamovatel (ani jméno, ani odůvodnění):
 * formulář přijme libovolnou adresu, takže kdyby šel jeho text do e-mailu, dalo
 * by se přes nás rozesílat spam. Jen číslo oznámení a kanonická URL inzerátu
 * sestavená z ověřeného UUID na naší doméně.
 */
export function buildReportConfirmationEmail(payload: { reportId: string; listingUrl: string }): {
  subject: string;
  html: string;
  text: string;
} {
  const id = escapeHtml(payload.reportId);
  const url = escapeHtml(payload.listingUrl);
  const subject = `Potvrzení přijetí oznámení č. ${payload.reportId}`;
  const text = [
    'Dobrý den,',
    '',
    `potvrzujeme přijetí oznámení č. ${payload.reportId} k inzerátu ${payload.listingUrl}. Posoudíme ho bez zbytečného odkladu a o rozhodnutí vás budeme informovat.`,
    '',
    'Pokud chcete oznámení doplnit, odpovězte na tento e-mail a uveďte číslo oznámení.',
    '',
    'Agro-svět bazar — Samec Digital s.r.o., provozovatel agro-svet.cz',
    '',
    `Tento e-mail jsme poslali, protože adresa byla uvedena ve formuláři ${SITE_URL}/bazar/nahlasit/. Pokud jste oznámení nepodali, e-mail prosím ignorujte.`,
  ].join('\n');
  const html = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#222;line-height:1.55">
        <p style="margin:0 0 12px">Dobrý den,</p>
        <p style="margin:0 0 12px">
          potvrzujeme přijetí oznámení č. <strong>${id}</strong> k inzerátu
          <a href="${url}">${url}</a>. Posoudíme ho bez zbytečného odkladu a o rozhodnutí
          vás budeme informovat.
        </p>
        <p style="margin:0 0 12px">Pokud chcete oznámení doplnit, odpovězte na tento e-mail a uveďte číslo oznámení.</p>
        <p style="margin:0">Agro-svět bazar — Samec Digital s.r.o., provozovatel agro-svet.cz</p>
        <hr style="border:0;border-top:1px solid #eaeaec;margin:20px 0">
        <p style="font-size:12px;color:#999;margin:0">
          Tento e-mail jsme poslali, protože adresa byla uvedena ve formuláři
          ${SITE_URL}/bazar/nahlasit/. Pokud jste oznámení nepodali, e-mail prosím ignorujte.
        </p>
      </div>
    `;
  return { subject, html, text };
}

/** Pošle potvrzení o přijetí. Vrací true, jen když ho Resend přijal. */
export async function sendBazarReportConfirmation(
  apiKey: string,
  payload: { to: string; reportId: string; listingUrl: string },
): Promise<boolean> {
  if (!apiKey) {
    console.warn('[bazar-report-email] RESEND_API_KEY missing — skipping receipt confirmation');
    return false;
  }
  const resend = new Resend(apiKey);
  const { subject, html, text } = buildReportConfirmationEmail(payload);
  const { error } = await resend.emails.send({
    from: FROM,
    replyTo: ADMIN,
    to: payload.to,
    subject,
    html,
    text,
  });
  if (error) {
    console.error('[bazar-report-email] Resend error (confirmation)', error);
    return false;
  }
  return true;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
