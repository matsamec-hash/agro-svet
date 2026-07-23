#!/usr/bin/env node
// `npm run deploy` už NEDEPLOYUJE přes wrangler — agro-svět běží od migrace na
// @astrojs/node standalone adapteru a nasazuje se přes Coolify na VPS 187.124.12.96.
// Deploy = push do master (Coolify auto-build). Cloudflare je pořád před VPS,
// takže po doběhnutí buildu je potřeba pročistit edge cache: `npm run purge`.
// Tenhle skript jen ukáže postup a stav gitu — nic destruktivního nedělá.

import { execSync } from 'node:child_process';

const sh = (cmd) => {
  try { return execSync(cmd, { encoding: 'utf8' }).trim(); }
  catch { return ''; }
};

const dirty = sh('git status --porcelain');
const branch = sh('git rev-parse --abbrev-ref HEAD') || 'master';
sh('git fetch origin master -q');
const ahead = sh('git rev-list --count origin/master..HEAD') || '0';

console.log(`
┌─ agro-svět deploy ───────────────────────────────────────────
│ Nasazení běží přes Coolify (VPS 187.124.12.96), NE wrangler.
│
│ 1) Commitni + pushni do master:
│      git push origin master
│    → Coolify sám spustí build na VPS. Počkej na Running/healthy.
│
│ 2) Pročisti Cloudflare edge cache (CF je pořád před VPS):
│      npm run purge
│    (pusť AŽ po doběhnutí Coolify buildu, jinak CDN nacachuje staré)
├──────────────────────────────────────────────────────────────
│ Stav teď:
│   branch:        ${branch}
│   nepushnuto:    ${ahead} commit(ů) na HEAD vs origin/master
│   pracovní strom: ${dirty ? 'MÁ necommitnuté změny (nenasadí se)' : 'čistý'}
└──────────────────────────────────────────────────────────────`);

if (dirty) {
  console.log('\nNecommitnuté soubory (na produkci NEpůjdou):');
  console.log(dirty.split('\n').map((l) => '   ' + l).join('\n'));
}
