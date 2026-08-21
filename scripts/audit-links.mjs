#!/usr/bin/env node
// Audit INTERNÍCH ODKAZŮ na lokalizovaných stránkách. Stránka může být celá
// polsky a přesto posílat návštěvníka zpátky do češtiny — text a odkazy jsou
// dvě nezávislé vrstvy a tenhle skript hlídá tu druhou.
//
// Hlásí dva opačné druhy chyb:
//   BEZ-PREFIXU /x/  → odkaz na sekci, která JE pro daný locale launchnutá,
//                      ale chybí prefix (návštěvník skončí v češtině).
//   /<locale>/x/     → prefix na sekci, která launchnutá NENÍ (česká stránka
//                      pod cizí adresou — horší než poctivý odkaz do cs).
//
// ‼️ V šablonách používej `localizeInternalHref`, ne `localizePath`:
//    localizePath prefixuje NASLEPO, localizeInternalHref kontroluje
//    isLaunchedPath a nelaunchnutou sekci nechá bez prefixu.
//
// Použití: node scripts/audit-links.mjs pl /pl/ /pl/slovnik/ …
//          LINK_BASE=http://127.0.0.1:4331 node scripts/audit-links.mjs pl …

import { readFileSync } from 'node:fs';

const BASE = process.env.LINK_BASE || 'https://www.agro-svet.cz';

const UTILS_SRC = readFileSync(new URL('../src/i18n/utils.ts', import.meta.url), 'utf8');

/** Čte LAUNCHED_PREFIXES přímo ze zdroje, ať se seznam nemůže rozejít. */
function launchedPrefixes(locale) {
  const block = UTILS_SRC.match(/export const LAUNCHED_PREFIXES[\s\S]*?\n};/)[0];
  const line = block.match(new RegExp(`\\n\\s{2}${locale}:\\s*\\[([\\s\\S]*?)\\],`));
  if (!line) throw new Error(`LAUNCHED_PREFIXES.${locale} nenalezeno`);
  return [...line[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
}

/** Cesty, které jsou uvnitř launchnuté sekce, ale prerendered cs-only → SPRÁVNĚ
 *  nemají prefix. Bez tohohle je hlásí jako „BEZ-PREFIXU" napořád. */
function prerenderedOnlyPaths() {
  const block = UTILS_SRC.match(/export const PRERENDERED_ONLY_PATHS[^;]*;/);
  return block ? [...block[0].matchAll(/'([^']+)'/g)].map((m) => m[1]) : [];
}

const [locale, ...urls] = process.argv.slice(2);
if (!locale || !urls.length) {
  console.error('použití: node scripts/audit-links.mjs <sk|pl|uk> <url…>');
  process.exit(1);
}
const LAUNCHED = launchedPrefixes(locale);
const PRERENDERED_ONLY = prerenderedOnlyPaths();
const isPrerenderedOnly = (p) => PRERENDERED_ONLY.some((l) => p === l || p === `${l}/` || p.startsWith(`${l}/`));
const isLaunched = (p) => !isPrerenderedOnly(p) && (p === '/' || LAUNCHED.some((l) => l !== '/' && (p === l || p.startsWith(`${l}/`))));

const bad = new Map();
const add = (key, src) => {
  if (!bad.has(key)) bad.set(key, new Set());
  bad.get(key).add(src);
};

for (const u of urls) {
  let html;
  try {
    const r = await fetch(BASE + u);
    if (r.status !== 200) continue;
    html = await r.text();
  } catch { continue; }

  // cs dvojče TÉTO stránky = přepínač jazyka, ne chyba
  const selfCs = u.slice(locale.length + 1) || '/';

  for (const m of html.matchAll(new RegExp(`href="(/${locale}/[^"#?]*)"`, 'g'))) {
    const path = m[1].slice(locale.length + 1) || '/';
    if (!isLaunched(path)) add(`/${locale}${path}`, u);   // prefix na nelaunchnutou sekci
  }
  for (const m of html.matchAll(/href="(\/(?!(?:cs|sk|pl|uk)\/)[a-z0-9][^"#?]*)"/g)) {
    const href = m[1];
    if (href === selfCs) continue;
    if (/\.(xml|svg|ico|png|jpe?g|webp|json|txt|css|js)$/.test(href)) continue;
    if (!isLaunched(href.replace(/\/+$/, '') || '/')) continue;  // cs-only sekce → správně
    add(`BEZ-PREFIXU ${href}`, u);
  }
}

const rows = [...bad.entries()].sort((a, b) => b[1].size - a[1].size);
for (const [target, srcs] of rows) {
  console.log(`${String(srcs.size).padStart(3)}×  ${target}`);
  if (srcs.size <= 3) console.log(`        z: ${[...srcs].join(', ')}`);
}
console.log(`\n== ${urls.length} URL | ${rows.length} problematických cílů ==`);
if (rows.length) process.exitCode = 1;
