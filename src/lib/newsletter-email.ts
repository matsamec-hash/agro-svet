import { Resend } from 'resend';
import { SITE_URL } from './config';

const FROM = 'Agro-svět <newsletter@mail.agro-svet.cz>';
const REPLY_TO = 'info@samecdigital.com';

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

export interface DigestArticle {
  title: string;
  slug: string;
  perex: string | null;
  featured_image_url: string | null;
  category: string | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  technika: 'Technika',
  dotace: 'Dotace',
  trh: 'Trh',
  legislativa: 'Legislativa',
  znacky: 'Značky',
  novinky: 'Novinky',
};

function escapeHtml(s: string): string {
  return s.replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c] ?? c));
}

/**
 * Render the HTML body of a newsletter digest. Pure function — no Resend
 * dependency — so it can be unit-tested and previewed. The unsubscribe URL is
 * passed in per-recipient by the caller.
 */
export function renderDigestHtml(opts: {
  articles: DigestArticle[];
  periodLabel: string;
  unsubscribeUrl: string;
}): string {
  const { articles, periodLabel, unsubscribeUrl } = opts;
  const articleBlocks = articles
    .map((a) => {
      const url = `${SITE_URL}/novinky/${a.slug}/`;
      const cat = a.category ? CATEGORY_LABELS[a.category] ?? a.category : '';
      const perex = a.perex ? escapeHtml(a.perex.length > 180 ? a.perex.slice(0, 178) + '…' : a.perex) : '';
      const img = a.featured_image_url
        ? `<a href="${url}"><img src="${a.featured_image_url}" alt="${escapeHtml(a.title)}" width="512" style="width:100%;max-width:512px;height:auto;border-radius:10px;display:block;margin-bottom:12px"></a>`
        : '';
      return `
        <div style="margin:0 0 28px;padding:0 0 28px;border-bottom:1px solid #eaeaec">
          ${img}
          ${cat ? `<span style="display:inline-block;background:#FFEA00;color:#0A0A0B;font-size:11px;font-weight:700;padding:3px 9px;border-radius:4px;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">${escapeHtml(cat)}</span>` : ''}
          <h2 style="font-size:19px;line-height:1.3;color:#0A0A0B;margin:6px 0 8px">
            <a href="${url}" style="color:#0A0A0B;text-decoration:none">${escapeHtml(a.title)}</a>
          </h2>
          ${perex ? `<p style="font-size:14px;color:#444;line-height:1.6;margin:0 0 12px">${perex}</p>` : ''}
          <a href="${url}" style="font-size:13px;font-weight:700;color:#0B7A3B;text-decoration:none">Číst celý článek →</a>
        </div>`;
    })
    .join('');

  return `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#222">
      <div style="text-align:center;margin-bottom:8px">
        <a href="${SITE_URL}" style="display:inline-block;background:#FFEA00;color:#0A0A0B;padding:8px 16px;border-radius:6px;text-decoration:none;font-weight:700;font-size:20px">agro-svět.cz</a>
      </div>
      <p style="text-align:center;font-size:13px;color:#888;margin:0 0 28px">Newsletter · ${escapeHtml(periodLabel)}</p>
      ${articleBlocks}
      <p style="margin:24px 0">
        <a href="${SITE_URL}/novinky/" style="display:inline-block;background:#0A0A0B;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px">Všechny novinky na webu</a>
      </p>
      <hr style="border:0;border-top:1px solid #eaeaec;margin:24px 0">
      <p style="font-size:12px;color:#999;line-height:1.6">
        Agro-svět · <a href="${SITE_URL}" style="color:#999">${SITE_URL}</a><br>
        Tento e-mail jste dostali, protože jste potvrdili odběr newsletteru. Více v <a href="${SITE_URL}/zpracovani-osobnich-udaju/" style="color:#999">zásadách zpracování osobních údajů</a>.<br>
        <a href="${unsubscribeUrl}" style="color:#999">Odhlásit odběr</a> · <a href="mailto:${REPLY_TO}" style="color:#999">${REPLY_TO}</a>
      </p>
    </div>`;
}

/**
 * Send one newsletter digest to a single recipient. Rate-limiting and the
 * subscriber loop live in the caller (scripts/send-newsletter.mjs).
 */
export async function sendNewsletterDigest(
  apiKey: string,
  to: string,
  subject: string,
  html: string,
  unsubscribeUrl: string,
): Promise<void> {
  if (!apiKey) {
    console.warn('[newsletter-email] RESEND_API_KEY missing — skipping digest', to);
    return;
  }
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: FROM,
    replyTo: REPLY_TO,
    to,
    subject,
    headers: {
      'List-Unsubscribe': `<${unsubscribeUrl}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
    html,
  });
  if (error) {
    console.error('[newsletter-email] digest send failed', to, error);
    throw error;
  }
}
