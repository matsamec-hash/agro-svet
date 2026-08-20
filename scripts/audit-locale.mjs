#!/usr/bin/env node
// Audit lokalizované mutace webu: (1) CELISTVOST HTML, (2) zbytková čeština.
//
// PROČ CELISTVOST: v Astro SSR neshodí nedeklarovaný identifikátor v šabloně
// build — spadne to až při renderu requestu a protože se odpověď streamuje,
// výjimka UTNE HTML uprostřed dokumentu. Stránka pak jde ven bez patičky
// a bez </html>, ale grep na očekávaný obsah ji prohlásí za v pořádku.
// Takhle nám ~den běžely obě homepage useknuté.
//
// PROČ MARKERY PÍSMEN: čeština má znaky, které cílový jazyk NEMÁ. Sada MUSÍ být
// per-jazyk — polština nemá ani á é í ú ý, kdežto slovenština je má (polská sada
// nad slovenštinou dá stovky falešných poplachů na „súčasnosť").
// ‼️ Slepá skvrna: čeština BEZ diakritiky ("dosud", "vice", "zpet") tímhle
// neprojde — na to je potřeba slovník tokenů, viz níže NO_DIACRITICS.
//
// Použití:
//   node scripts/audit-locale.mjs pl /pl/ /pl/stroje/ …
//   AUDIT_BASE=http://127.0.0.1:4331 node scripts/audit-locale.mjs pl $(cat urls.txt)
//   node scripts/audit-locale.mjs pl --sitemap        # vzorkuje podle tvaru URL

const BASE = process.env.AUDIT_BASE || 'https://www.agro-svet.cz';

const MARKERS = {
  sk: /[ěřůĚŘŮ]/,
  pl: /[ěřůčšžďťňáéíúýĚŘŮČŠŽĎŤŇÁÉÍÚÝ]/,
  uk: /[ěřůčšžďťňáéíúýĚŘŮČŠŽĎŤŇÁÉÍÚÝ]/,
};

/** Česká slova bez diakritiky — marker podle písmen je nevidí.
 *  ‼️ Jen tokeny, které NEJSOU zároveň platným polským ani slovenským slovem.
 *  Vyhozené kvůli falešným poplachům: `cena` a `jako` (v polštině existují
 *  se stejným tvarem), `domu` (pl genitiv od „dom"), `podle` (pl příslovce). */
const NO_DIACRITICS = /\b(dosud|nyni|dalsi|zpet|vsechny|zobrazit|celkem|nebo|prihlasit|odhlasit)\b/i;

/** Legitimní výskyty: značka, instituce, identifikátory. */
const ALLOW = [/agro-svět\.cz/, /IČO/, /ÚKZÚZ/, /ČSÚ/, /ČÚZK/, /VÚMOP/, /SZIF/, /ČOI/];

function visibleText(html) {
  const h = html
    .replace(/<head[\s\S]*?<\/head>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  const out = [];
  for (const m of h.matchAll(/>([^<]+)</g)) {
    const t = m[1]
      .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
    if (t.length >= 3) out.push(t);
  }
  // atributy viditelné pro čtečky obrazovky
  for (const m of h.matchAll(/(?:alt|title|aria-label|placeholder)="([^"]+)"/gi)) {
    const t = m[1].trim();
    if (t.length >= 3) out.push(t);
  }
  return out;
}

async function sitemapSample(locale) {
  const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].replace(/^https?:\/\/[^/]+/, ''))
    .filter((u) => u.startsWith(`/${locale}/`));
  // 1–2 URL na TVAR cesty (/pl/<sekce>/*), ať pokryjeme každou šablonu
  const byShape = new Map();
  for (const u of urls) {
    const seg = u.split('/').filter(Boolean);
    const shape = [seg[0], seg[1] ?? '', ...seg.slice(2).map(() => '*')].join('/');
    if (!byShape.has(shape)) byShape.set(shape, []);
    byShape.get(shape).push(u);
  }
  const sample = [];
  for (const list of byShape.values()) {
    sample.push(list[0]);
    if (list.length > 1) sample.push(list[Math.floor(list.length / 2)]);
  }
  console.log(`# sitemap: ${urls.length} URL → ${byShape.size} tvarů → ${sample.length} vzorků\n`);
  return sample;
}

const [locale, ...rest] = process.argv.slice(2);
if (!locale || !MARKERS[locale]) {
  console.error('použití: node scripts/audit-locale.mjs <sk|pl|uk> <url…|--sitemap>');
  process.exit(1);
}
const urls = rest[0] === '--sitemap' ? await sitemapSample(locale) : rest;
const CZ = MARKERS[locale];

let truncated = 0, leaky = 0, broken = 0;
for (const u of urls) {
  let res, html;
  try {
    res = await fetch(BASE + u, { redirect: 'manual' });
    html = await res.text();
  } catch (e) {
    console.log(`ERR      ${u}  ${e.message}`); broken++; continue;
  }
  if (res.status !== 200) {
    console.log(`HTTP${res.status}  ${u}`);
    if (res.status >= 500) broken++;
    continue;
  }
  // ‼️ NE /<\/html>\s*$/ — za </html> bývá HTML komentář a test by falešně křičel.
  if (!html.toLowerCase().includes('</html>')) {
    console.log(`TRUNC    ${u}  (SSR pád utnul stream, ${html.length} B)`);
    truncated++;
  }
  const hits = [...new Set(visibleText(html).filter(
    (t) => (CZ.test(t) || NO_DIACRITICS.test(t)) && !ALLOW.some((r) => r.test(t)),
  ))];
  if (hits.length) {
    leaky++;
    console.log(`CZ(${String(hits.length).padStart(2)})   ${u}`);
    for (const h of hits.slice(0, 12)) console.log(`           · ${h.slice(0, 120)}`);
  }
}
console.log(`\n== ${urls.length} URL | utnuté: ${truncated} | s češtinou: ${leaky} | chyby: ${broken} ==`);
if (truncated || broken) process.exitCode = 1;
