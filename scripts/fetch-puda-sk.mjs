#!/usr/bin/env node
// Build-time fetcher pre SK /puda/. Zdroj = Eurostat geo=SK.
// Cena pôdy: apri_lprc agriprod=ARAXIB (Non-irrigable arable land) — NAJČISTŠIA
//   rada (2017+, bez metodického zlomu; ARA má nereálne predzlomové 2015-16 hodnoty).
// Nájom: apri_lrnt agriprod=ARA_J0000 (orná + TTP), EUR_HA, 2011+.
// Plodiny: apro_cpshr AR_THS_HA (plochy, najnovší rok) — tis. ha → ha.
// Výstup: src/data/agro-puda-sk.json. Refresh: `npm run puda:refresh:sk`.

import { writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pickSeries } from './lib/eurostat-sk.mjs';
import { buildPudaPayload } from './lib/puda-sk.mjs';

const OUT = fileURLToPath(new URL('../src/data/agro-puda-sk.json', import.meta.url));
const ES = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data';

async function esFetch(dataset, params) {
  const qs = new URLSearchParams({ format: 'JSON', geo: 'SK', ...params });
  const url = `${ES}/${dataset}?${qs}`;
  console.log(`→ Eurostat ${dataset} ${JSON.stringify(params)}`);
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) { console.warn(`  ${dataset} ${res.status} — skip`); return null; }
  return res.json();
}

async function fetchCena() {
  const json = await esFetch('apri_lprc', { unit: 'EUR_HA', agriprod: 'ARAXIB' });
  if (!json) return [];
  return pickSeries(json, { freq: 'A', unit: 'EUR_HA', agriprod: 'ARAXIB', geo: 'SK' })
    .map((p) => ({ time: p.time, value: Math.round(p.value) }));
}

async function fetchNajem() {
  const json = await esFetch('apri_lrnt', { unit: 'EUR_HA', agriprod: 'ARA_J0000' });
  if (!json) return [];
  return pickSeries(json, { freq: 'A', unit: 'EUR_HA', agriprod: 'ARA_J0000', geo: 'SK' })
    .map((p) => ({ time: p.time, value: Math.round(p.value) }));
}

// Plodiny: plochy (AR_THS_HA) zo všetkých rokov; buildPudaPayload vyberie najnovší.
const PROD_CROPS = [
  { crop: 'Pšenica', code: 'C1100' },
  { crop: 'Jačmeň', code: 'C1300' },
  { crop: 'Kukurica', code: 'C1500' },
  { crop: 'Repka', code: 'I1110' },
  { crop: 'Zemiaky', code: 'R1000' },
];

async function fetchPlodiny() {
  const json = await esFetch('apro_cpshr', {});
  if (!json) return [];
  const out = [];
  for (const c of PROD_CROPS) {
    const area = pickSeries(json, { freq: 'A', crops: c.code, strucpro: 'AR_THS_HA', geo: 'SK' });
    for (const p of area) out.push({ crop: c.crop, year: p.time, hectares: Math.round(p.value * 1000) });
  }
  return out;
}

async function main() {
  const cena = await fetchCena();
  const najem = await fetchNajem();
  const plodiny = await fetchPlodiny();
  const payload = buildPudaPayload({ cena, najem, plodiny, generated: new Date().toISOString() });
  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(payload, null, 2) + '\n');
  console.log(`✓ wrote ${OUT}`);
  console.log(`  cena: ${payload.cena.series.length} bodov, najem: ${payload.najem.series.length} bodov, plodiny: ${payload.plodiny.length}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
