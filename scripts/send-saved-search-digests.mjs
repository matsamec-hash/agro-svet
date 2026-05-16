#!/usr/bin/env node
// Cron job: 1×/den (typicky 08:00 ráno) projde aktivní saved searches a
// pošle e-mail digest s novými inzeráty od last_notified_at.
//
// Usage:
//   node --env-file=.env scripts/send-saved-search-digests.mjs --dry-run
//   node --env-file=.env scripts/send-saved-search-digests.mjs
//
// Pipeline:
// 1. SELECT * FROM bazar_saved_searches WHERE status='active' AND confirmed=true
//    AND (last_notified_at IS NULL OR last_notified_at < now() - interval '20h')
// 2. Pro každý filter: SELECT z bazar_listings WHERE status='active' AND
//    created_at > coalesce(last_notified_at, now() - interval '7d') AND <filtr>
// 3. Pokud žádné nové → skip (žádný e-mail).
// 4. Pokud nové → render HTML digest a Resend send.
// 5. UPDATE last_notified_at = now(), notification_count = +1.

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SITE_ORIGIN = 'https://agro-svet.cz';
const FROM = 'Agro-svět bazar <bazar@mail.agro-svet.cz>';
const RATE_MS = 600;

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL/SUPABASE_SERVICE_KEY. Use --env-file=.env');
  process.exit(1);
}
if (!RESEND_API_KEY && !dryRun) {
  console.error('Missing RESEND_API_KEY. Use --env-file=.env (or --dry-run).');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function escapeHtml(s) {
  return String(s).replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c]));
}

function applyFilter(query, filter) {
  if (filter.query) query = query.or(`title.ilike.%${filter.query}%,description.ilike.%${filter.query}%`);
  if (filter.category) query = query.eq('category', filter.category);
  if (filter.brand) query = query.eq('brand', filter.brand);
  if (filter.priceFrom) query = query.gte('price', parseInt(filter.priceFrom));
  if (filter.priceTo) query = query.lte('price', parseInt(filter.priceTo));
  if (filter.yearFrom) query = query.gte('year_of_manufacture', parseInt(filter.yearFrom));
  if (filter.yearTo) query = query.lte('year_of_manufacture', parseInt(filter.yearTo));
  // Note: kraj filter would need a CZ_LOCATIONS_GEO bbox match on lat/lng.
  // Skip for V1; user reči "Středočeský kraj" → free-text location.ilike fallback.
  if (filter.kraj) {
    // Try matching location text against Czech regions (approximation).
    const krajLabels = {
      stredocesky: 'Středočeský',
      jihocesky: 'Jihočeský',
      jihomoravsky: 'Jihomoravský',
      moravskoslezsky: 'Moravskoslezský',
      olomoucky: 'Olomoucký',
      zlinsky: 'Zlínský',
      vysocina: 'Vysočina',
      pardubicky: 'Pardubický',
      kralovehradecky: 'Královéhradecký',
      liberecky: 'Liberecký',
      ustecky: 'Ústecký',
      karlovarsky: 'Karlovarský',
      plzensky: 'Plzeňský',
      praha: 'Praha',
    };
    const label = krajLabels[filter.kraj];
    if (label) query = query.ilike('location', `%${label}%`);
  }
  return query;
}

function renderDigestHtml({ label, listings, unsubscribeUrl }) {
  const rows = listings.map((l) => {
    const url = `${SITE_ORIGIN}/bazar/${l.id}/`;
    const price = l.price === null ? 'Cena dohodou' : `${l.price.toLocaleString('cs-CZ')} Kč`;
    return `
      <div style="margin:0 0 20px;padding:0 0 20px;border-bottom:1px solid #eaeaec;">
        <h3 style="font-size:16px;margin:0 0 6px;">
          <a href="${url}" style="color:#0A0A0B;text-decoration:none;">${escapeHtml(l.title)}</a>
        </h3>
        <div style="font-size:14px;color:#0B7A3B;font-weight:700;margin-bottom:4px;">${price}</div>
        <div style="font-size:12px;color:#666;">${escapeHtml(l.location ?? '')}${l.brand ? ` · ${escapeHtml(l.brand)}` : ''}</div>
        <a href="${url}" style="font-size:12px;font-weight:700;color:#0B7A3B;text-decoration:none;">Detail →</a>
      </div>
    `;
  }).join('');
  return `
<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#222;">
  <div style="text-align:center;margin-bottom:8px;">
    <a href="${SITE_ORIGIN}" style="display:inline-block;background:#FFEA00;color:#0A0A0B;padding:6px 14px;border-radius:6px;text-decoration:none;font-weight:700;">agro-svět.cz</a>
  </div>
  <p style="text-align:center;font-size:13px;color:#888;margin:0 0 20px;">Nové inzeráty pro: <strong>${escapeHtml(label)}</strong></p>
  ${rows}
  <p style="margin:24px 0;text-align:center;">
    <a href="${SITE_ORIGIN}/bazar/" style="display:inline-block;background:#0A0A0B;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px;">Otevřít bazar</a>
  </p>
  <hr style="border:0;border-top:1px solid #eaeaec;margin:20px 0;">
  <p style="font-size:11px;color:#999;line-height:1.5;">
    Dostáváte tento e-mail, protože jste si nastavili sledování filtru na agro-svět.cz.
    <a href="${unsubscribeUrl}" style="color:#999;">Odhlásit sledování</a>.
  </p>
</div>`;
}

async function main() {
  const { data: searches, error } = await sb
    .from('bazar_saved_searches')
    .select('*')
    .eq('status', 'active')
    .eq('confirmed', true)
    .or('last_notified_at.is.null,last_notified_at.lt.' + new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString());

  if (error) {
    console.error('Search query failed:', error.message);
    process.exit(1);
  }
  console.log(`Found ${searches.length} active saved searches to check.`);
  if (dryRun) console.log('DRY RUN — no e-mails sent.\n');

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const s of searches) {
    const since = s.last_notified_at ?? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    let q = sb
      .from('bazar_listings')
      .select('id, title, price, location, brand, created_at')
      .eq('status', 'active')
      .gt('created_at', since)
      .order('created_at', { ascending: false })
      .limit(20);
    q = applyFilter(q, s.filter ?? {});
    const { data: listings, error: lErr } = await q;
    if (lErr) {
      console.warn(`  ✗ ${s.id} query failed: ${lErr.message}`);
      failed++;
      continue;
    }
    if (!listings || listings.length === 0) {
      console.log(`  ⊘ ${s.email} "${s.label}" — 0 nových`);
      skipped++;
      // Still bump last_notified to avoid re-querying tomorrow with same window.
      if (!dryRun) {
        await sb.from('bazar_saved_searches').update({ last_notified_at: new Date().toISOString() }).eq('id', s.id);
      }
      continue;
    }

    const unsubUrl = `${SITE_ORIGIN}/api/bazar/saved-searches/unsubscribe?token=${encodeURIComponent(s.unsubscribe_token)}`;
    const html = renderDigestHtml({ label: s.label, listings, unsubscribeUrl: unsubUrl });
    const subject = `${listings.length} ${listings.length === 1 ? 'nový inzerát' : listings.length < 5 ? 'nové inzeráty' : 'nových inzerátů'}: ${s.label}`;

    if (dryRun) {
      console.log(`  ✓ ${s.email} "${s.label}" — ${listings.length} nových (dry run)`);
      sent++;
    } else if (resend) {
      try {
        await resend.emails.send({
          from: FROM,
          to: s.email,
          subject,
          html,
          headers: {
            'List-Unsubscribe': `<${unsubUrl}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          },
        });
        await sb.from('bazar_saved_searches').update({
          last_notified_at: new Date().toISOString(),
          notification_count: (s.notification_count ?? 0) + 1,
        }).eq('id', s.id);
        console.log(`  ✓ ${s.email} "${s.label}" — ${listings.length} nových`);
        sent++;
      } catch (e) {
        console.warn(`  ✗ ${s.email} send failed: ${e?.message ?? e}`);
        failed++;
      }
      await sleep(RATE_MS);
    }
  }

  console.log(`\n✓ sent: ${sent}, skipped (0 nových): ${skipped}, failed: ${failed}, total: ${searches.length}`);
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
