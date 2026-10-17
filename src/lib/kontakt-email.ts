// Kontaktní formulář (/kontakt/) → e-mail provozovateli přes Resend.
//
// ‼️ E-mail jde VÝHRADNĚ na info@samecdigital.com. Návštěvníkovi neposíláme
// nic (žádné „kopie zprávy"): formulář, který posílá text na adresu zadanou
// cizím člověkem, je otevřená relay pro spam. Adresa odesílatele jde jen do
// Reply-To, aby se dalo odpovědět tlačítkem „Odpovědět".
// Nic se neukládá do databáze — zpráva existuje jen v doručené poště.
import { Resend } from 'resend';
import type { Locale } from '../i18n/config';
import {
  content as kontaktContent,
  isKontaktTopic,
  KONTAKT_LIMITS,
  type KontaktError,
  type KontaktTopic,
} from '../i18n/kontakt';

// Doména mail.agro-svet.cz je v Resendu ověřená (viz bazar-report-email.ts,
// akce-email.ts); jiný lokální part na ní nic dalšího nepotřebuje.
export const KONTAKT_FROM = 'Agro-svět kontakt <kontakt@mail.agro-svet.cz>';
export const KONTAKT_TO = 'info@samecdigital.com';

export interface KontaktFields {
  topic: KontaktTopic;
  name: string;
  email: string;
  pageUrl: string;
  message: string;
}

export type KontaktParseResult =
  | { ok: true; value: KontaktFields }
  | { ok: false; error: KontaktError };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(form: FormData, key: string): string {
  const v = form.get(key);
  return typeof v === 'string' ? v : '';
}

/** Jednořádkový text: bez řídicích znaků a zalomení (jméno jde i do předmětu). */
function singleLine(s: string): string {
  // eslint-disable-next-line no-control-regex
  return s.replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Volné URL → absolutní http(s) adresa, nebo '' když to URL není.
 *  Bez schématu doplní https:// (lidi kopírují i „agro-svet.cz/stroje/"). */
export function normalizePageUrl(raw: string): string {
  const s = raw.trim();
  if (!s || s.length > KONTAKT_LIMITS.urlMax || /\s/.test(s)) return '';
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(s) ? s : `https://${s}`;
  try {
    const u = new URL(withScheme);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return '';
    if (!u.hostname.includes('.')) return '';
    return u.toString();
  } catch {
    return '';
  }
}

/** Validace odeslaného formuláře. Honeypot sem nepatří — řeší ho API dřív. */
export function parseKontaktForm(form: FormData): KontaktParseResult {
  const topic = field(form, 'topic').trim();
  if (!isKontaktTopic(topic)) return { ok: false, error: 'topic' };

  const name = singleLine(field(form, 'name'));
  if (name.length > KONTAKT_LIMITS.nameMax) return { ok: false, error: 'name' };

  const email = field(form, 'email').trim();
  if (!email || email.length > KONTAKT_LIMITS.emailMax || !EMAIL_RE.test(email)) {
    return { ok: false, error: 'email' };
  }

  const urlRaw = field(form, 'url').trim();
  const pageUrl = urlRaw ? normalizePageUrl(urlRaw) : '';
  if (urlRaw && !pageUrl) return { ok: false, error: 'url' };

  // Prohlížeč posílá konce řádků textarey jako CRLF, ale `maxlength` počítá
  // LF — bez normalizace by zpráva s odstavci těsně pod limitem neprošla.
  const message = field(form, 'message').replace(/\r\n?/g, '\n').trim();
  if (message.length < KONTAKT_LIMITS.messageMin) return { ok: false, error: 'message-short' };
  if (message.length > KONTAKT_LIMITS.messageMax) return { ok: false, error: 'message-long' };

  return { ok: true, value: { topic, name, email, pageUrl, message } };
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Předmět: `[Kontakt <locale>] <téma česky> — <jméno nebo e-mail>`. */
export function kontaktSubject(locale: Locale, msg: KontaktFields): string {
  const who = msg.name || msg.email;
  return singleLine(`[Kontakt ${locale}] ${kontaktContent.cs.topics[msg.topic]} — ${who}`).slice(0, 250);
}

export function kontaktHtml(locale: Locale, msg: KontaktFields): string {
  const row = (label: string, value: string) =>
    `<p style="margin:0 0 6px"><strong>${label}:</strong> ${value}</p>`;
  const page = msg.pageUrl
    ? `<a href="${escapeHtml(msg.pageUrl)}">${escapeHtml(msg.pageUrl)}</a>`
    : '—';
  return `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#222">
      <h1 style="font-size:18px;margin:0 0 12px">Nová zpráva z kontaktního formuláře</h1>
      ${row('Jazyk stránky', escapeHtml(locale))}
      ${row('Téma', `${escapeHtml(kontaktContent.cs.topics[msg.topic])} (${escapeHtml(msg.topic)})`)}
      ${row('Jméno', msg.name ? escapeHtml(msg.name) : '—')}
      ${row('E-mail', `<a href="mailto:${escapeHtml(msg.email)}">${escapeHtml(msg.email)}</a>`)}
      ${row('Stránka', page)}
      <p style="margin:12px 0 4px"><strong>Zpráva:</strong></p>
      <pre style="background:#fbfaf4;border:1px solid #e8e4d2;border-radius:8px;padding:12px;white-space:pre-wrap;word-break:break-word;font-family:inherit;font-size:13px;line-height:1.55;margin:0">${escapeHtml(msg.message)}</pre>
      <hr style="border:0;border-top:1px solid #eaeaec;margin:20px 0">
      <p style="font-size:12px;color:#999">
        Odpověď: stačí odpovědět na tento e-mail (Reply-To je adresa odesílatele).
        Zpráva se nikde neukládá, existuje jen v téhle schránce.
      </p>
    </div>
  `;
}

export function kontaktText(locale: Locale, msg: KontaktFields): string {
  return [
    'Nová zpráva z kontaktního formuláře agro-svet.cz',
    '',
    `Jazyk stránky: ${locale}`,
    `Téma: ${kontaktContent.cs.topics[msg.topic]} (${msg.topic})`,
    `Jméno: ${msg.name || '—'}`,
    `E-mail: ${msg.email}`,
    `Stránka: ${msg.pageUrl || '—'}`,
    '',
    'Zpráva:',
    msg.message,
  ].join('\n');
}

export type KontaktSendResult = { ok: true } | { ok: false; reason: 'no-key' | 'resend' | 'exception' };

/** Pošle zprávu provozovateli. Nikdy nevyhazuje — selhání vrací jako výsledek,
 *  ať API může přesměrovat s `err=server` místo 500. */
export async function sendKontaktEmail(
  apiKey: string | undefined,
  locale: Locale,
  msg: KontaktFields,
): Promise<KontaktSendResult> {
  if (!apiKey) {
    console.error('[kontakt-email] RESEND_API_KEY missing — message NOT delivered');
    return { ok: false, reason: 'no-key' };
  }
  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: KONTAKT_FROM,
      to: KONTAKT_TO,
      replyTo: msg.email,
      subject: kontaktSubject(locale, msg),
      html: kontaktHtml(locale, msg),
      text: kontaktText(locale, msg),
    });
    if (error) {
      console.error('[kontakt-email] Resend error', error);
      return { ok: false, reason: 'resend' };
    }
    return { ok: true };
  } catch (e) {
    console.error('[kontakt-email] send failed', e);
    return { ok: false, reason: 'exception' };
  }
}
