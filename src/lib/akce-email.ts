// src/lib/akce-email.ts
import { Resend } from 'resend';
import { SITE_URL } from './config';

const FROM = 'Agro-svět akce <akce@mail.agro-svet.cz>'; // sjednoceno s bazar-report-email.ts (verified domain mail.agro-svet.cz)
const MODERATOR_TO = 'info@samecdigital.com';

export async function sendSubmissionConfirmation(apiKey: string, to: string, nazev: string): Promise<void> {
  if (!apiKey || !to) return;
  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Děkujeme — vaše akce čeká na schválení',
    html: `<p>Děkujeme za přidání akce <strong>${escapeHtml(nazev)}</strong>.</p>
      <p>Akci zkontrolujeme a po schválení se objeví v kalendáři na agro-svet.cz.</p>`,
  });
}

export async function notifyModerator(apiKey: string, nazev: string, obec: string): Promise<void> {
  if (!apiKey) return;
  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: FROM,
    to: MODERATOR_TO,
    subject: `Nová akce ke schválení: ${nazev}`,
    html: `<p>Čeká nová akce: <strong>${escapeHtml(nazev)}</strong> (${escapeHtml(obec)}).</p>
      <p><a href="${SITE_URL}/admin/akce/">Otevřít moderaci</a></p>`,
  });
}

export async function sendApproved(apiKey: string, to: string, nazev: string, slug: string): Promise<void> {
  if (!apiKey || !to) return;
  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Vaše akce byla schválena',
    html: `<p>Akce <strong>${escapeHtml(nazev)}</strong> je zveřejněná:</p>
      <p><a href="${SITE_URL}/akce/${slug}/">${SITE_URL}/akce/${slug}/</a></p>`,
  });
}

export async function sendRejected(apiKey: string, to: string, nazev: string, reason: string): Promise<void> {
  if (!apiKey || !to) return;
  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Vaše akce nebyla schválena',
    html: `<p>Akci <strong>${escapeHtml(nazev)}</strong> jsme bohužel nezveřejnili.</p>
      ${reason ? `<p>Důvod: ${escapeHtml(reason)}</p>` : ''}`,
  });
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}
