// One-shot deliverability check for Resend + DKIM/SPF setup.
//
// Usage:
//   RESEND_API_KEY=re_xxx node scripts/test-resend.mjs your-name@example.com
//
// Sends a sample magic_link email so you can verify in your inbox that:
//   - Resend accepts the From address (mail.agro-svet.cz)
//   - DKIM signs correctly (no "via amazonses.com" tag in Gmail)
//   - SPF passes (no "?" or red flag in headers)
//   - Email lands in Inbox, not Spam
//
// Inspect the raw headers in Gmail: "Show original" — look for
// dkim=pass and spf=pass.

import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
const recipient = process.argv[2];

if (!apiKey) {
  console.error('Missing RESEND_API_KEY env var.');
  process.exit(1);
}
if (!recipient || !recipient.includes('@')) {
  console.error('Usage: RESEND_API_KEY=re_xxx node scripts/test-resend.mjs your@email.com');
  process.exit(1);
}

const resend = new Resend(apiKey);

const html = `
  <h1>Fotosoutěž Agro-svět — test odeslání</h1>
  <p>Pokud tento e-mail vidíš ve své schránce (a ne ve spamu), DKIM/SPF setup funguje.</p>
  <p><a href="https://agro-svet.cz/fotosoutez/" style="display:inline-block;background:#FFFF00;color:#000;padding:14px 28px;font-weight:bold;border-radius:10px;text-decoration:none;font-family:Arial,sans-serif">Otevřít fotosoutěž</a></p>
  <hr>
  <p style="font-size:12px;color:#666">Odesláno přes Resend z mail.agro-svet.cz · ${new Date().toISOString()}</p>
`;

console.log(`→ Sending test email to ${recipient}...`);

const { data, error } = await resend.emails.send({
  from: 'Fotosoutěž Agro-svět <fotosoutez@mail.agro-svet.cz>',
  to: recipient,
  subject: 'Test: DKIM/SPF deliverability check',
  html,
});

if (error) {
  console.error('FAILED:', error);
  process.exit(1);
}

console.log('✓ Sent. Resend message id:', data.id);
console.log('Check your inbox (and spam folder). In Gmail: Show original → look for dkim=pass spf=pass.');
