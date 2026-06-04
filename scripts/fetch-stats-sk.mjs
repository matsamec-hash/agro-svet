#!/usr/bin/env node
// Build-time fetcher pre SK /statistiky/. Zdroj = Eurostat geo=SK (primárny),
// ŠÚSR DATAcube best-effort (PHM/hnojivá). Výstup src/data/agro-stats-sk.json
// (rovnaký tvar ako agro-stats.json; prázdne polia = blok sa na /sk vynechá).
// Refresh: `npm run stats:refresh:sk`.

import { writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pickSeries, yoyChange } from './lib/eurostat-sk.mjs';

const OUT = fileURLToPath(new URL('../src/data/agro-stats-sk.json', import.meta.url));
const ES = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data';
const SCISSORS_BASE_YEAR = 2020;

async function esFetch(dataset, params) {
  const qs = new URLSearchParams({ format: 'JSON', geo: 'SK', ...params });
  const url = `${ES}/${dataset}?${qs}`;
  console.log(`→ Eurostat ${dataset} ${JSON.stringify(params)}`);
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) { console.warn(`  ${dataset} ${res.status} — skip`); return null; }
  return res.json();
}

// — Livestock (historická rada, ks) —
async function fetchLivestock() {
  const out = [];
  const specs = [
    { dataset: 'apro_mt_lscatl', animalCode: 'A2000', label: 'Skot' },
    { dataset: 'apro_mt_lspig', animalCode: 'A3100', label: 'Prasata' },
  ];
  for (const s of specs) {
    const json = await esFetch(s.dataset, { animals: s.animalCode });
    if (!json) continue;
    // mesiac M11_M12 (Nov/Dec sčítanie), fallback M05_M06
    const months = json.dimension?.month?.category?.index ?? {};
    const monthCode = months['M11_M12'] !== undefined ? 'M11_M12' : 'M05_M06';
    // pickSeries vyžaduje všetky non-time dimenzie; pre tieto datasety: freq, month, animals, unit, geo
    const series = pickSeries(json, {
      freq: 'A',
      month: monthCode,
      animals: s.animalCode,
      unit: 'THS_HD',
      geo: 'SK',
    });
    for (const p of series) out.push({ animal: s.label, count: Math.round(p.value * 1000), date: `${p.time}-12-31` });
  }
  out.sort((a, b) => a.date.localeCompare(b.date));
  return out;
}

async function main() {
  const livestockHistorical = await fetchLivestock();

  const payload = {
    generated: new Date().toISOString(),
    scissorsBaseYear: SCISSORS_BASE_YEAR,
    commodityStats: [],
    commodityFull: [],
    fiveYearAvgs: {},
    latestFuels: [],
    fuelSeries: [],
    livestock: livestockHistorical.slice(-4),
    livestockHistorical,
    crops: [],
    areas: [],
    fertilizers: [],
    fertSeries: [],
    regional: [],
    scissorsPoints: [],
  };

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(payload, null, 2) + '\n');
  console.log(`✓ wrote ${OUT}`);
  console.log(`  livestockHistorical: ${livestockHistorical.length}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
