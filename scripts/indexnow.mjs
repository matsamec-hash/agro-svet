#!/usr/bin/env node
// IndexNow ping — okamžité oznámení změn Bingu, Seznamu a Yandexu.
//
// Google IndexNow neumí (ten se řídí sitemapou), ale Seznam.cz ANO — a to je
// pro český portál druhý nejdůležitější vyhledávač. Bez pingu čeká Seznam na
// vlastní crawl, což u novinek a bazaru znamená klidně týden.
//
// Endpoint api.indexnow.org je sdílený: přijme jeden request a rozešle ho
// všem partnerům (Bing, Seznam, Yandex, Naver). Klíč se ověřuje stažením
// https://agro-svet.cz/<KEY>.txt — ten soubor je v public/ a MUSÍ zůstat.
//
// Použití:
//   npm run indexnow                  # URL změněné dnes (lastmod ze sitemapy)
//   npm run indexnow -- --days 3      # URL změněné za poslední 3 dny
//   npm run indexnow -- --all         # celá sitemapa (jen po velké změně!)
//   npm run indexnow -- --url /novinky/muj-clanek/ --url /bazar/123/
//   npm run indexnow -- --dry         # jen vypíše, neodesílá

const KEY = '6b9c2c6caf418e89fdb4fc672a16e2e7';
const HOST = 'agro-svet.cz';
const SITE = `https://${HOST}`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';
// IndexNow spec: max 10 000 URL v jednom requestu.
const BATCH = 10000;

const argv = process.argv.slice(2);
const has = (flag) => argv.includes(flag);
const valuesOf = (flag) =>
  argv.reduce((acc, a, i) => (a === flag && argv[i + 1] ? [...acc, argv[i + 1]] : acc), []);

const dry = has('--dry');
const all = has('--all');
const days = Number(valuesOf('--days')[0] ?? 1);
const explicit = valuesOf('--url');

function absolute(u) {
  if (u.startsWith('http://') || u.startsWith('https://')) return u;
  return `${SITE}${u.startsWith('/') ? u : `/${u}`}`;
}

// Hranice "čerstvosti" v ISO datu. days=1 → dnešek, days=3 → dnešek a dva dny zpět.
function cutoffIso(nDays) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - (Math.max(1, nDays) - 1));
  return d.toISOString().slice(0, 10);
}

async function urlsFromSitemap() {
  // Bereme URL z ŽIVÉ sitemapy, ne z lokálního buildu — pingujeme jen to, co
  // na produkci opravdu existuje. Ping na 404 si IndexNow pamatuje jako chybu.
  const index = await fetch(`${SITE}/sitemap.xml`, { headers: { 'user-agent': 'agro-svet-indexnow' } });
  if (!index.ok) throw new Error(`sitemap.xml → HTTP ${index.status}`);
  const indexXml = await index.text();

  // Od rozdělení na sitemap index musíme projít i dílčí sitemapy.
  const childLocs = [...indexXml.matchAll(/<sitemap>[\s\S]*?<loc>([^<]+)<\/loc>[\s\S]*?<\/sitemap>/g)].map((m) => m[1]);
  const documents = [];
  if (childLocs.length > 0) {
    for (const loc of childLocs) {
      const res = await fetch(loc, { headers: { 'user-agent': 'agro-svet-indexnow' } });
      if (!res.ok) {
        console.warn(`  ! ${loc} → HTTP ${res.status}, přeskakuji`);
        continue;
      }
      documents.push(await res.text());
    }
  } else {
    documents.push(indexXml);
  }

  const cutoff = cutoffIso(days);
  const out = [];
  for (const xml of documents) {
    for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
      const block = m[1];
      const loc = /<loc>([^<]+)<\/loc>/.exec(block)?.[1];
      if (!loc) continue;
      if (all) {
        out.push(loc);
        continue;
      }
      const lastmod = /<lastmod>([^<]+)<\/lastmod>/.exec(block)?.[1]?.slice(0, 10);
      if (lastmod && lastmod >= cutoff) out.push(loc);
    }
  }
  return [...new Set(out)];
}

async function submit(urlList) {
  const body = { host: HOST, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList };
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });
  // 200 = přijato, 202 = přijato, klíč se teprve ověřuje. Obojí je úspěch.
  const ok = res.status === 200 || res.status === 202;
  const text = ok ? '' : ` — ${(await res.text()).slice(0, 300)}`;
  console.log(`  ${ok ? '✓' : '✗'} HTTP ${res.status} (${urlList.length} URL)${text}`);
  return ok;
}

const urls = explicit.length > 0 ? explicit.map(absolute) : await urlsFromSitemap();

if (urls.length === 0) {
  console.log('IndexNow: nic k odeslání (žádná URL se od kontrolního data nezměnila).');
  process.exit(0);
}

console.log(`IndexNow: ${urls.length} URL${dry ? ' (dry run, neodesílám)' : ''}`);
for (const u of urls.slice(0, 10)) console.log(`  · ${u}`);
if (urls.length > 10) console.log(`  … a dalších ${urls.length - 10}`);

if (dry) process.exit(0);

let allOk = true;
for (let i = 0; i < urls.length; i += BATCH) {
  allOk = (await submit(urls.slice(i, i + BATCH))) && allOk;
}
process.exit(allOk ? 0 : 1);
