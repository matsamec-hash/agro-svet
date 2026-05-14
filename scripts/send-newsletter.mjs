// Newsletter digest sender — pulls confirmed subscribers + recent articles,
// renders a per-recipient digest, and sends via Resend at the free-tier rate.
//
// Usage:
//   node --env-file=.env scripts/send-newsletter.mjs --dry-run
//   node --env-file=.env scripts/send-newsletter.mjs --period="Květen 2026"
//   node --env-file=.env scripts/send-newsletter.mjs --articles=5 --limit=50
//
// Flags:
//   --dry-run         List recipients + chosen articles, send nothing.
//   --period="..."    Period label shown in the email header. Default: current
//                     month + year in Czech (e.g. "květen 2026").
//   --articles=N      Number of recent articles to include. Default 4.
//   --limit=N         Cap recipients (testing). Default: no cap.
//   --test=email      Send only to this address, ignoring the subscriber list.
//
// Required env (load via --env-file=.env):
//   SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY
//
// The HTML template is duplicated from src/lib/newsletter-email.ts on purpose —
// this is standalone campaign tooling that must run outside the Astro build.
// Keep renderDigestHtml() here in sync with that file when the template changes.

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const SITE_URL = 'https://agro-svet.cz';
const AGRO_SVET_SITE_ID = 'cadc73fd-6bd9-4dc5-a0da-ea33725762e1';
const FROM = 'Agro-svět <newsletter@mail.agro-svet.cz>';
const REPLY_TO = 'info@samecdigital.com';
const RESEND_RATE_MS = 600; // ~1.6 req/s — under the free-tier 2 req/s cap.

const CATEGORY_LABELS = {
  technika: 'Technika', dotace: 'Dotace', trh: 'Trh',
  legislativa: 'Legislativa', znacky: 'Značky', novinky: 'Novinky',
};

// ── args ────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const hasFlag = (name) => args.includes(`--${name}`);
const getFlag = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};

const dryRun = hasFlag('dry-run');
const articleCount = Math.max(1, parseInt(getFlag('articles', '4'), 10) || 4);
const limit = getFlag('limit', null) ? parseInt(getFlag('limit'), 10) : null;
const testEmail = getFlag('test', null);
const periodLabel = getFlag('period', null) ??
  new Intl.DateTimeFormat('cs-CZ', { month: 'long', year: 'numeric' }).format(new Date());

// ── env ─────────────────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY. Run with --env-file=.env');
  process.exit(1);
}
if (!RESEND_API_KEY && !dryRun) {
  console.error('Missing RESEND_API_KEY. Run with --env-file=.env (or use --dry-run).');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ── helpers ─────────────────────────────────────────────────────────────────
function escapeHtml(s) {
  return String(s).replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c] ?? c));
}

function buildUnsubscribeUrl(token) {
  return `${SITE_URL}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
}

function renderDigestHtml({ articles, periodLabel, unsubscribeUrl }) {
  const articleBlocks = articles.map((a) => {
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
  }).join('');

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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── main ────────────────────────────────────────────────────────────────────
async function main() {
  // 1. Recent published articles
  const { data: articles, error: artErr } = await supabase
    .from('articles')
    .select('title, slug, perex, featured_image_url, category, published_at')
    .eq('site_id', AGRO_SVET_SITE_ID)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(articleCount);

  if (artErr) {
    console.error('Article query failed:', artErr.message);
    process.exit(1);
  }
  if (!articles || articles.length === 0) {
    console.error('No published articles found — nothing to send.');
    process.exit(1);
  }

  const subject = `Agro-svět: ${articles[0].title}${articles.length > 1 ? ' a další novinky' : ''}`;

  console.log(`\n📰 Digest — ${periodLabel}`);
  console.log(`   Subject: ${subject}`);
  console.log(`   Articles (${articles.length}):`);
  for (const a of articles) console.log(`     • ${a.title}`);

  // 2. Recipients
  let recipients;
  if (testEmail) {
    recipients = [{ email: testEmail, unsubscribe_token: 'TEST-TOKEN-NOT-REAL' }];
    console.log(`\n👤 TEST MODE — single recipient: ${testEmail}`);
  } else {
    const { data: subs, error: subErr } = await supabase
      .from('newsletter_subscribers')
      .select('email, unsubscribe_token')
      .eq('site_id', AGRO_SVET_SITE_ID)
      .eq('confirmed', true)
      .is('unsubscribed_at', null);

    if (subErr) {
      console.error('Subscriber query failed:', subErr.message);
      process.exit(1);
    }
    recipients = subs ?? [];
    if (limit) recipients = recipients.slice(0, limit);
  }

  console.log(`\n📬 Recipients: ${recipients.length}${limit ? ` (capped at ${limit})` : ''}`);

  if (recipients.length === 0) {
    console.log('   No confirmed active subscribers — done.');
    return;
  }

  if (dryRun) {
    console.log('\n🟡 DRY RUN — no emails sent. Recipients:');
    for (const r of recipients) console.log(`     ${r.email}`);
    console.log(`\n   Re-run without --dry-run to send to ${recipients.length} recipient(s).\n`);
    return;
  }

  // 3. Send loop, rate-limited
  const resend = new Resend(RESEND_API_KEY);
  let sent = 0;
  let failed = 0;
  console.log('');
  for (const r of recipients) {
    const unsubscribeUrl = buildUnsubscribeUrl(r.unsubscribe_token);
    const html = renderDigestHtml({ articles, periodLabel, unsubscribeUrl });
    try {
      const { error } = await resend.emails.send({
        from: FROM,
        replyTo: REPLY_TO,
        to: r.email,
        subject,
        headers: {
          'List-Unsubscribe': `<${unsubscribeUrl}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
        html,
      });
      if (error) throw error;
      sent += 1;
      process.stdout.write(`   ✓ ${r.email}\n`);
    } catch (err) {
      failed += 1;
      process.stdout.write(`   ✗ ${r.email} — ${err?.message ?? err}\n`);
    }
    await sleep(RESEND_RATE_MS);
  }

  console.log(`\n✅ Done — sent ${sent}, failed ${failed}, total ${recipients.length}\n`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
