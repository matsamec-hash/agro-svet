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
    reporterEmail: string | null;
  },
): Promise<void> {
  if (!apiKey) {
    console.warn('[bazar-report-email] RESEND_API_KEY missing — skipping admin notification');
    return;
  }
  const resend = new Resend(apiKey);
  const reviewUrl = `${SITE_URL}/admin/bazar/reports`;
  const reason = reasonLabel(payload.reason);
  const desc = payload.description.trim() || '(bez popisu)';
  const replyHint = payload.reporterEmail
    ? `Odpovědět oznamovateli: <a href="mailto:${payload.reporterEmail}">${payload.reporterEmail}</a>`
    : 'Oznamovatel kontakt neuvedl.';

  const { error } = await resend.emails.send({
    from: FROM,
    replyTo: payload.reporterEmail ?? ADMIN,
    to: ADMIN,
    subject: `[Bazar report] ${reason} — ${payload.listingId ?? 'unknown'}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#222">
        <h1 style="font-size:18px;margin:0 0 12px">Nové hlášení závadného inzerátu</h1>
        <p style="margin:0 0 6px"><strong>Report ID:</strong> ${payload.reportId}</p>
        <p style="margin:0 0 6px"><strong>Inzerát:</strong> <a href="${payload.listingUrl}">${payload.listingUrl}</a></p>
        <p style="margin:0 0 6px"><strong>Důvod:</strong> ${reason}</p>
        <p style="margin:12px 0 4px"><strong>Popis:</strong></p>
        <pre style="background:#fbfaf4;border:1px solid #e8e4d2;border-radius:8px;padding:12px;white-space:pre-wrap;word-break:break-word;font-family:inherit;font-size:13px;line-height:1.55;margin:0">${escapeHtml(desc)}</pre>
        <p style="margin:16px 0 6px;font-size:13px;color:#666">${replyHint}</p>
        <hr style="border:0;border-top:1px solid #eaeaec;margin:20px 0">
        <p style="font-size:12px;color:#999">
          Posouďte bez zbytečného odkladu (max 7 dnů). Záznam najdete v Supabase: tabulka <code>bazar_reports</code>, ID ${payload.reportId}.
        </p>
      </div>
    `,
  });
  if (error) {
    console.error('[bazar-report-email] Resend error', error);
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
