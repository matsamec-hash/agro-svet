#!/usr/bin/env node
// Build-time fetcher pre SK /statistiky/. Zdroj = Eurostat geo=SK (primárny),
// ŠÚSR DATAcube (PHM týždenné ceny). Výstup src/data/agro-stats-sk.json
// (rovnaký tvar ako agro-stats.json; prázdne polia = blok sa na /sk vynechá).
// Refresh: `npm run stats:refresh:sk`.
//
// ŠÚSR DATAcube (data.statistics.sk/api/v2):
//   PHM: sp0207ts (týždenné, EUR/l) — NÁJDENÉ, fetchujeme. Dimenzie: sp0207ts_tyz (YYYYWW), sp0207ts_ukaz.
//        UKAZ01=Benzín 95, UKAZ03=LPG, UKAZ04=Nafta.
//   Priemyselné hnojivá (EUR/t): katalóg 668 datasetov prehľadaný — žiadna tabuľka cien
//        priemyselných hnojív nenájdená. pl2022rs = spotreba pesticídov (nie ceny).
//        sp2034ms = priemerné ceny agro produktov (plodiny/živočíchy, nie vstupy).
//        fertilizers/fertSeries zostávajú prázdne → InputsBlock bez hnojív na /sk.

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

// — Produkcia plodin (tis. t) + plochy (tis. ha) z apro_cpshr —
const PROD_CROPS = [
  { crop: 'Pšenica', code: 'C1100' },
  { crop: 'Jačmeň', code: 'C1300' },
  { crop: 'Kukurica', code: 'C1500' },
  { crop: 'Repka', code: 'I1110' },
  { crop: 'Obilniny', code: 'C1000' },
  { crop: 'Zemiaky', code: 'R1000' },
];

async function fetchProduction() {
  const json = await esFetch('apro_cpshr', {});
  if (!json) return { crops: [], areas: [] };
  const crops = [], areas = [];
  for (const c of PROD_CROPS) {
    const prod = pickSeries(json, { freq: 'A', crops: c.code, strucpro: 'HPRD_HUMD_EU_THS_T', geo: 'SK' });
    for (const p of prod) crops.push({ crop: c.crop, year: p.time, tonnes: Math.round(p.value * 1000) });
    const area = pickSeries(json, { freq: 'A', crops: c.code, strucpro: 'AR_THS_HA', geo: 'SK' });
    for (const p of area) areas.push({ crop: c.crop, year: p.time, hectares: Math.round(p.value * 1000) });
  }
  return { crops, areas };
}

// — Ceny komodit (roční, EUR/100kg → přepočet na EUR/t pre konzistenciu jednotky) —
const CROP_PRICES = [
  { name: 'Pšenica', code: '01110000' },
  { name: 'Jačmeň', code: '01300000' },
  { name: 'Kukurica', code: '01500000' },
  { name: 'Repka', code: '02110000' },
];
const ANIMAL_PRICES = [
  { name: 'Hovädzie', code: '11114000' },
  { name: 'Bravčové', code: '11220000' },
  { name: 'Mlieko', code: '12111000' },
];

function buildCommodity(name, series) {
  // series: [{ time:'2020', value: EUR/100kg }]; prepočet ×10 = EUR/t
  const data = series.map((p) => ({ label: p.time, value: Math.round(p.value * 10), sortKey: parseInt(p.time) * 12 }));
  return { name, unit: 'EUR/t', data };
}

async function fetchCommodities() {
  const full = [];
  const cropJson = await esFetch('apri_ap_crpouta', { currency: 'EUR' });
  if (cropJson) {
    for (const c of CROP_PRICES) {
      const s = pickSeries(cropJson, { freq: 'A', currency: 'EUR', prod_veg: c.code, geo: 'SK' });
      if (s.length) full.push(buildCommodity(c.name, s));
    }
  }
  const aniJson = await esFetch('apri_ap_anouta', { currency: 'EUR' });
  if (aniJson) {
    for (const a of ANIMAL_PRICES) {
      const s = pickSeries(aniJson, { freq: 'A', currency: 'EUR', prod_ani: a.code, geo: 'SK' });
      if (s.length) full.push(buildCommodity(a.name, s));
    }
  }
  return full;
}

// — Cenové nůžky: index výstupov (apri_pi20_outa) vs vstupov (apri_pi20_ina), báza 2020 —
// Dimenzia 'product': výstup = '040000' (Total output), vstup = '200000' (Total inputs).
// unit='I20' (index báza 2020=100), p_adj='NI' (nominálny).
async function fetchScissors() {
  const out = await esFetch('apri_pi20_outa', { unit: 'I20', p_adj: 'NI', product: '040000' });
  const inp = await esFetch('apri_pi20_ina', { unit: 'I20', p_adj: 'NI', product: '200000' });
  if (!out || !inp) return [];

  const outSeries = pickSeries(out, { freq: 'A', unit: 'I20', p_adj: 'NI', product: '040000', geo: 'SK' });
  const inSeries = pickSeries(inp, { freq: 'A', unit: 'I20', p_adj: 'NI', product: '200000', geo: 'SK' });

  const inByYear = new Map(inSeries.map((p) => [p.time, p.value]));
  const points = [];
  for (const o of outSeries) {
    const x = inByYear.get(o.time);
    if (x === undefined) continue;
    points.push({ year: parseInt(o.time), x: Math.round(x * 10) / 10, y: Math.round(o.value * 10) / 10 });
  }
  return points.sort((a, b) => a.year - b.year);
}

function buildCommodityStats(full) {
  // Posledný rok + medziročná zmena z ročnej rady.
  return full.map((s) => {
    const data = s.data;
    const last = data[data.length - 1];
    const prev = data[data.length - 2];
    return {
      name: s.name, unit: s.unit, price: last?.value ?? 0,
      month: last?.label ?? '',           // u SK = rok ("2024")
      prevYearPrice: prev?.value ?? null,
      change: prev && prev.value ? Math.round((last.value / prev.value - 1) * 1000) / 10 : null,
    };
  });
}

// — ŠÚSR DATAcube: týždenné ceny PHM (sp0207ts) —
// Vracia { latestFuels, fuelSeries }. fuelSeries = nafta posledných 52 týždňov.
// latestFuels = benzín 95 + nafta + LPG z posledného dostupného týždňa.
const SUSR_BASE = 'https://data.statistics.sk/api/v2';
const SUSR_FUEL_LABELS = { UKAZ01: 'Benzín 95', UKAZ03: 'LPG', UKAZ04: 'Nafta' };

async function susrFetch(path) {
  const url = `${SUSR_BASE}${path}`;
  console.log(`→ ŠÚSR ${path}`);
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) { console.warn(`  ŠÚSR ${res.status} — skip`); return null; }
  return res.json();
}

/** Vráti zoradený zoznam kódov týždňov (YYYYWW) z dimenzie sp0207ts_tyz, zostupne. */
async function susrWeekCodes() {
  const d = await susrFetch('/dimension/sp0207ts/sp0207ts_tyz?lang=en');
  if (!d) return [];
  const idx = d.category?.index ?? {};
  return Object.keys(idx).sort((a, b) => parseInt(b) - parseInt(a));
}

/**
 * Parsuje JSON-stat2 z ŠÚSR sp0207ts pre jeden týždeň a niekoľko indikátorov.
 * Vracia { weekCode, weekLabel, values: { UKAZ01: price, UKAZ04: price, ... } }
 */
function parseSusrWeek(json) {
  if (!json) return null;
  const weekDim = json.dimension?.sp0207ts_tyz?.category ?? {};
  const ukazDim = json.dimension?.sp0207ts_ukaz?.category ?? {};
  const weekCodes = Object.keys(weekDim.index ?? {});
  const ukazCodes = Object.keys(ukazDim.index ?? {});
  if (!weekCodes.length || !ukazCodes.length) return null;
  const weekCode = weekCodes[0];
  const weekLabel = (weekDim.label ?? {})[weekCode] ?? weekCode;
  const values = {};
  for (let ui = 0; ui < ukazCodes.length; ui++) {
    // JSON-stat2: flat index = weekIdx * nUkaz + ukazIdx (sp0207ts_data dim last, size 1)
    const flat = ui; // single week → weekIdx always 0
    const raw = json.value?.[String(flat)] ?? json.value?.[flat];
    if (raw !== null && raw !== undefined) values[ukazCodes[ui]] = raw;
  }
  return { weekCode, weekLabel, values };
}

async function fetchSkUsrFuels(weekCount = 52) {
  const weeks = await susrWeekCodes();
  if (!weeks.length) return { latestFuels: [], fuelSeries: [] };

  // Fetch posledných weekCount týždňov (plus 4 navyše pre prípad null hodnôt)
  const toFetch = weeks.slice(0, weekCount + 4);

  const results = [];
  for (const wk of toFetch) {
    const json = await susrFetch(`/dataset/sp0207ts/${wk}/UKAZ01,UKAZ03,UKAZ04?lang=en`);
    const parsed = parseSusrWeek(json);
    if (parsed) results.push(parsed);
  }

  // latestFuels: z prvého týždňa kde máme hodnoty pre naftu
  const latestFuels = [];
  const latestResult = results.find(r => r.values.UKAZ04 !== undefined);
  if (latestResult) {
    for (const [code, label] of Object.entries(SUSR_FUEL_LABELS)) {
      const price = latestResult.values[code];
      if (price !== undefined) {
        // Štandardizuj week label: "21. week (18. 5. 2026 - 24. 5. 2026)" → "21. týždeň 2026"
        const m = latestResult.weekLabel.match(/^(\d+)\.\s*week.*?(\d{4})/);
        const weekLabel = m ? `${m[1]}. týždeň ${m[2]}` : latestResult.weekLabel;
        latestFuels.push({ fuel: label, price: Math.round(price * 1000) / 1000, week: weekLabel });
      }
    }
  }

  // fuelSeries: nafta (UKAZ04) za posledných 52 týždňov, vzostupne
  const fuelSeries = results
    .filter(r => r.values.UKAZ04 !== undefined)
    .slice(0, weekCount)
    .reverse() // najstaršie prvé
    .map(r => {
      const m = r.weekLabel.match(/^(\d+)\.\s*week.*?(\d{4})/);
      const label = m ? `${m[1]}/${m[2]}` : r.weekCode;
      const sortKey = parseInt(r.weekCode);
      return { label, value: Math.round(r.values.UKAZ04 * 1000) / 1000, sortKey };
    });

  return { latestFuels, fuelSeries };
}

async function main() {
  const livestockHistorical = await fetchLivestock();
  const commodityFull = await fetchCommodities();
  const commodityStats = buildCommodityStats(commodityFull);
  const { crops, areas } = await fetchProduction();

  const scissorsPoints = await fetchScissors();
  const { latestFuels, fuelSeries } = await fetchSkUsrFuels(52);

  const payload = {
    generated: new Date().toISOString(),
    scissorsBaseYear: SCISSORS_BASE_YEAR,
    commodityStats,
    commodityFull,
    fiveYearAvgs: {},
    latestFuels,
    fuelSeries,
    livestock: livestockHistorical.slice(-4),
    livestockHistorical,
    crops,
    areas,
    fertilizers: [],
    fertSeries: [],
    regional: [],
    scissorsPoints,
  };

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(payload, null, 2) + '\n');
  console.log(`✓ wrote ${OUT}`);
  console.log(`  livestockHistorical: ${livestockHistorical.length}`);
  console.log(`  crops: ${crops.length}, areas: ${areas.length}`);
  console.log(`  latestFuels: ${latestFuels.length}, fuelSeries: ${fuelSeries.length}w`);
}

main().catch((e) => { console.error(e); process.exit(1); });
