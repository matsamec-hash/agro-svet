#!/usr/bin/env node
// Build-time fetcher for /statistiky/ static page.
// Reads existing src/data/commodities.json (commodityFull + fiveYearAvgs) and
// additionally fetches livestock, fuel, fertilizer, crop, regional + Eurostat
// historical livestock. Precomputes commodityStats, latestFuels, fuelSeries,
// fertSeries, scissorsPoints — page becomes pure render.
//
// Outputs src/data/agro-stats.json. Refresh: `npm run stats:refresh`.
// Mirrors logic in src/lib/czso.ts + src/lib/eurostat.ts + src/lib/agro-derived.ts.
//
// Run AFTER `npm run commodities:refresh` (depends on commodities.json for
// commodityFull/fiveYearAvgs — single source of truth).

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const COMMODITIES_IN = fileURLToPath(new URL('../src/data/commodities.json', import.meta.url));
const STATS_OUT = fileURLToPath(new URL('../src/data/agro-stats.json', import.meta.url));
const CZSO_BASE = 'https://data.csu.gov.cz/api/dotaz/v1/data/vybery';
const EUROSTAT_BASE = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data';

const COMMODITY_MAP = {
  'Pšenice potravinářská [t]': 'Pšenice',
  'Ječmen sladovnický [t]': 'Ječmen',
  'Semeno řepky olejné [t]': 'Řepka',
  'Kukuřice krmná [t]': 'Kukuřice',
  'Mléko kravské Q. tř. j. [tis. l.]': 'Mléko',
  'Prasata jatečná v živém [t]': 'Vepřové',
  'Býci jateční v živém [t]': 'Hovězí',
  'Vejce slepičí konzumní tříděná [tis. ks]': 'Vejce',
  'Semeno máku [t]': 'Mák',
};
const ALL_COMMODITY_NAMES = ['Pšenice','Ječmen','Řepka','Kukuřice','Mléko','Vepřové','Hovězí','Vejce','Mák'];
const MONTH_LABELS = ['leden','únor','březen','duben','květen','červen','červenec','srpen','září','říjen','listopad','prosinec'];

const FERT_MAP = {
  'Průmyslová hnojiva - ledek amonný s vápencem 27% [t]': 'Ledek amonný 27%',
  'Průmyslová hnojiva - močovina [t]': 'Močovina',
  'Průmyslová hnojiva - DAM 390 [t]': 'DAM 390',
  'Průmyslová hnojiva - NPK(15:15:15) [t]': 'NPK 15-15-15',
  'Průmyslová hnojiva - amofos [t]': 'Amofos',
  'Průmyslová hnojiva - síran amonný 21% [t]': 'Síran amonný 21%',
};
const REGION_NAMES = [
  'Hlavní město Praha','Středočeský kraj','Jihočeský kraj','Plzeňský kraj',
  'Karlovarský kraj','Ústecký kraj','Liberecký kraj','Královéhradecký kraj',
  'Pardubický kraj','Kraj Vysočina','Jihomoravský kraj','Olomoucký kraj',
  'Zlínský kraj','Moravskoslezský kraj',
];
const REGIONAL_CROPS = ['Obiloviny na zrno','Pšenice','Ječmen','Řepka','Brambory','Řepa cukrová','Kukuřice na zeleno'];
const PRODUCTION_CROPS = ['Pšenice','Ječmen','Řepka','Kukuřice na zeleno','Řepa cukrová','Brambory'];
const AREA_CROP_MAP = {
  'Osevní plocha celkem': 'Celkem',
  '- Obiloviny celkem': 'Obiloviny',
  '- Pšenice': 'Pšenice',
  '- Ječmen': 'Ječmen',
  '- Řepka': 'Řepka',
  '- Kukuřice na zrno': 'Kukuřice',
};
const SCISSORS_OUTPUT_COMMODITIES = ['Pšenice','Ječmen','Řepka','Kukuřice'];
const SCISSORS_BASE_YEAR = 2017;

function parseCSV(csv) {
  const lines = csv.trim().split('\n');
  return lines.map(line => {
    const cols = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQuotes = !inQuotes; continue; }
      if (ch === ',' && !inQuotes) { cols.push(current.trim()); current = ''; continue; }
      current += ch;
    }
    cols.push(current.trim());
    return cols;
  });
}

async function fetchSelection(code) {
  console.log(`→ CZSO ${code}`);
  const res = await fetch(`${CZSO_BASE}/${code}?format=CSV`);
  if (!res.ok) throw new Error(`CZSO ${code}: ${res.status}`);
  return parseCSV(await res.text()).slice(1);
}

function parseMonthStr(m) {
  const parts = m.trim().split(' ');
  if (parts.length < 2) return null;
  const idx = MONTH_LABELS.indexOf(parts[0].toLowerCase());
  const year = parseInt(parts[1]);
  if (idx === -1 || isNaN(year)) return null;
  return { month: idx, year };
}
function parseWeekYear(w) {
  const m = w.match(/\d+\.\s*týden\s+(\d+)/);
  return m ? parseInt(m[1]) : null;
}
function weekSort(w) {
  const m = w.match(/(\d+)\.\s*týden\s+(\d+)/);
  if (!m) return 0;
  return parseInt(m[2]) * 100 + parseInt(m[1]);
}

async function fetchCommodityPrices() {
  const rows = await fetchSelection('CEN0203BT02');
  const items = [];
  for (const row of rows) {
    if (row[1] !== 'Česko' || row[2] !== '') continue;
    const repr = row[3];
    const name = COMMODITY_MAP[repr];
    if (!name) continue;
    const val = parseFloat(row[5]);
    if (isNaN(val)) continue;
    const unit = repr.includes('[tis. l.]') ? 'Kč/tis. l' : 'Kč/t';
    items.push({ name, unit, month: row[4], price: val });
  }
  return items;
}

function buildCommodityStats(prices) {
  const byName = new Map();
  for (const p of prices) {
    if (!byName.has(p.name)) byName.set(p.name, []);
    byName.get(p.name).push(p);
  }
  const results = [];
  for (const name of ALL_COMMODITY_NAMES) {
    const list = byName.get(name);
    if (!list || list.length === 0) continue;
    const sorted = [...list].sort((a, b) => {
      const pa = parseMonthStr(a.month);
      const pb = parseMonthStr(b.month);
      if (!pa || !pb) return 0;
      return pb.year * 12 + pb.month - (pa.year * 12 + pa.month);
    });
    const latest = sorted[0];
    const latestDate = parseMonthStr(latest.month);
    let prevYearPrice = null;
    if (latestDate) {
      const prev = sorted.find(p => {
        const d = parseMonthStr(p.month);
        return d && d.month === latestDate.month && d.year === latestDate.year - 1;
      });
      if (prev) prevYearPrice = prev.price;
    }
    results.push({
      name, unit: latest.unit, price: latest.price, month: latest.month,
      prevYearPrice,
      change: prevYearPrice ? Math.round((latest.price / prevYearPrice - 1) * 1000) / 10 : null,
    });
  }
  return results;
}

async function fetchFuelPrices() {
  const rows = await fetchSelection('CENPHMTT01');
  const items = [];
  for (const row of rows) {
    if (row[0] !== 'Průměrná cena pohonných hmot (Kč/litr)') continue;
    const val = parseFloat(row[4]);
    if (isNaN(val)) continue;
    let fuel = row[3];
    if (fuel.includes('Natural 95')) fuel = 'Natural 95';
    else if (fuel.includes('nafta')) fuel = 'Nafta';
    else if (fuel === 'LPG') fuel = 'LPG';
    else continue;
    items.push({ fuel, week: row[2].trim(), price: val });
  }
  return items;
}
function buildLatestFuels(fuelPrices) {
  const sorted = [...fuelPrices].sort((a, b) => weekSort(b.week) - weekSort(a.week));
  const seen = new Set();
  const out = [];
  for (const f of sorted) {
    if (seen.has(f.fuel)) continue;
    seen.add(f.fuel);
    out.push({ fuel: f.fuel, price: f.price, week: f.week });
  }
  return out;
}
function buildFuelSeries(fuelPrices, weeks = 52) {
  return fuelPrices
    .filter(f => f.fuel === 'Nafta')
    .map(f => ({ label: f.week.replace(/\s*týden\s*/, '/'), value: f.price, sortKey: weekSort(f.week) }))
    .sort((a, b) => a.sortKey - b.sortKey)
    .slice(-weeks);
}

async function fetchLivestockHistoricalCzso() {
  const rows = await fetchSelection('WZEM02AT01');
  const items = [];
  for (const row of rows) {
    if (row[1] !== 'Česko') continue;
    const val = parseFloat(row[3]);
    if (isNaN(val)) continue;
    let animal = '';
    if (row[0].includes('turů')) animal = 'Skot';
    else if (row[0].includes('prasat')) animal = 'Prasata';
    else continue;
    items.push({ animal, count: Math.round(val), date: row[2] });
  }
  return items;
}
function buildLivestockLatest(historical) {
  const out = [];
  for (const a of ['Skot', 'Prasata']) {
    out.push(...historical.filter(i => i.animal === a).slice(-2));
  }
  return out;
}

function extractCropProduction(rows) {
  const items = [];
  for (const row of rows) {
    if (row[2] !== 'Česko' || row[3] !== '') continue;
    const crop = row[4].trim();
    if (!PRODUCTION_CROPS.includes(crop)) continue;
    const val = parseFloat(row[5]);
    if (isNaN(val)) continue;
    items.push({ crop, year: row[1], tonnes: Math.round(val) });
  }
  return items;
}
function extractRegionalCrops(rows) {
  const items = [];
  for (const row of rows) {
    if (row[2] !== 'Česko') continue;
    const region = row[3];
    if (!region || !REGION_NAMES.includes(region)) continue;
    const crop = row[4].trim();
    if (!REGIONAL_CROPS.includes(crop)) continue;
    const val = parseFloat(row[5]);
    if (isNaN(val)) continue;
    items.push({ region, crop, year: row[1], tonnes: Math.round(val) });
  }
  return items;
}
async function fetchCropAreas() {
  const rows = await fetchSelection('ZEM03CT01');
  const items = [];
  for (const row of rows) {
    if (row[1] !== 'Česko') continue;
    const rawCrop = row[2].trim();
    const crop = AREA_CROP_MAP[rawCrop];
    if (!crop) continue;
    const val = parseFloat(row[4]);
    if (isNaN(val)) continue;
    items.push({ crop, year: row[3], hectares: Math.round(val) });
  }
  return items;
}

async function fetchFertilizerPrices() {
  const rows = await fetchSelection('CEN0203ET03');
  const items = [];
  for (const row of rows) {
    if (row[1] !== 'Česko') continue;
    const name = FERT_MAP[row[2]];
    if (!name) continue;
    const val = parseFloat(row[4]);
    if (isNaN(val)) continue;
    items.push({ name, year: row[3], price: Math.round(val) });
  }
  return items;
}
function buildFertSeries(fertilizers) {
  const byName = new Map();
  for (const f of fertilizers) {
    if (!byName.has(f.name)) byName.set(f.name, []);
    byName.get(f.name).push({ year: f.year, price: f.price });
  }
  const out = [];
  for (const [name, data] of byName) {
    data.sort((a, b) => parseInt(a.year) - parseInt(b.year));
    out.push({ name, data });
  }
  return out;
}

async function fetchEurostatAnimal(dataset, code, animalLabel) {
  console.log(`→ Eurostat ${dataset} (${animalLabel})`);
  const res = await fetch(`${EUROSTAT_BASE}/${dataset}?format=JSON&geo=CZ&animals=${code}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    console.warn(`  Eurostat ${dataset} ${res.status} — skipping`);
    return [];
  }
  const data = await res.json();
  const timeIndex = data.dimension?.time?.category?.index ?? {};
  const months = data.dimension?.month?.category?.index ?? {};
  const timeKeys = Object.keys(timeIndex).sort();
  const timeN = timeKeys.length;
  const monthIdx = months['M11_M12'] !== undefined ? months['M11_M12'] : (months['M05_M06'] ?? 0);
  const points = [];
  for (const year of timeKeys) {
    const tIdx = timeIndex[year];
    const flatIdx = monthIdx * timeN + tIdx;
    const v = data.value?.[String(flatIdx)];
    if (v === undefined || v === null) continue;
    points.push({ animal: animalLabel, count: Math.round(v * 1000), date: `${year}-12-31` });
  }
  points.sort((a, b) => a.date.localeCompare(b.date));
  return points;
}
async function fetchLivestockHistoricalCombined() {
  const [cattle, pigs] = await Promise.all([
    fetchEurostatAnimal('apro_mt_lscatl', 'A2000', 'Skot'),
    fetchEurostatAnimal('apro_mt_lspig', 'A3100', 'Prasata'),
  ]);
  return [...cattle, ...pigs];
}

function yearAverage(items, yearOf, valueOf) {
  const buckets = new Map();
  for (const it of items) {
    const y = yearOf(it);
    if (y === null) continue;
    const v = valueOf(it);
    if (!isFinite(v)) continue;
    const b = buckets.get(y) ?? { sum: 0, count: 0 };
    b.sum += v; b.count += 1;
    buckets.set(y, b);
  }
  const out = new Map();
  for (const [y, b] of buckets) out.set(y, b.sum / b.count);
  return out;
}
function buildScissors(commodityPrices, fertilizers, fuelPrices, baseYear) {
  const outputAvgs = new Map();
  for (const name of SCISSORS_OUTPUT_COMMODITIES) {
    outputAvgs.set(name, yearAverage(
      commodityPrices.filter(c => c.name === name),
      c => parseMonthStr(c.month)?.year ?? null,
      c => c.price,
    ));
  }
  const allYears = new Set();
  outputAvgs.forEach(m => m.forEach((_, y) => allYears.add(y)));

  const outputIndex = new Map();
  for (const year of allYears) {
    let sum = 0, count = 0;
    for (const name of SCISSORS_OUTPUT_COMMODITIES) {
      const avgs = outputAvgs.get(name);
      const base = avgs.get(baseYear);
      const cur = avgs.get(year);
      if (base && cur && base > 0) {
        sum += (cur / base) * 100;
        count += 1;
      }
    }
    if (count > 0) outputIndex.set(year, sum / count);
  }

  const fertAvgs = yearAverage(
    fertilizers.filter(f => f.name === 'NPK 15-15-15'),
    f => parseInt(f.year) || null,
    f => f.price,
  );
  const fuelAvgs = yearAverage(
    fuelPrices.filter(f => f.fuel === 'Nafta'),
    f => parseWeekYear(f.week),
    f => f.price,
  );

  const inputIndex = new Map();
  for (const year of allYears) {
    const fb = fertAvgs.get(baseYear);
    const fc = fertAvgs.get(year);
    const ub = fuelAvgs.get(baseYear);
    const uc = fuelAvgs.get(year);
    if (fb && fc && ub && uc) {
      inputIndex.set(year, 0.5 * (fc / fb) * 100 + 0.5 * (uc / ub) * 100);
    }
  }

  const points = [];
  for (const year of [...allYears].sort((a, b) => a - b)) {
    const x = inputIndex.get(year);
    const y = outputIndex.get(year);
    if (x !== undefined && y !== undefined) {
      points.push({ year, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
    }
  }
  return points;
}

async function main() {
  const commoditiesRaw = await readFile(COMMODITIES_IN, 'utf8');
  const { commodityFull, fiveYearAvgs } = JSON.parse(commoditiesRaw);

  const [
    commodityPrices,
    fuelPrices,
    livestockHistoricalCzso,
    cropRows,
    cropAreas,
    fertilizers,
    livestockHistoricalEurostat,
  ] = await Promise.all([
    fetchCommodityPrices(),
    fetchFuelPrices(),
    fetchLivestockHistoricalCzso(),
    fetchSelection('WZEM03AT01'),
    fetchCropAreas(),
    fetchFertilizerPrices(),
    fetchLivestockHistoricalCombined(),
  ]);

  const crops = extractCropProduction(cropRows);
  const regional = extractRegionalCrops(cropRows);
  const commodityStats = buildCommodityStats(commodityPrices);
  const latestFuels = buildLatestFuels(fuelPrices);
  const fuelSeries = buildFuelSeries(fuelPrices, 52);
  const livestock = buildLivestockLatest(livestockHistoricalCzso);
  const fertSeries = buildFertSeries(fertilizers);
  const scissorsPoints = buildScissors(commodityPrices, fertilizers, fuelPrices, SCISSORS_BASE_YEAR);

  const payload = {
    generated: new Date().toISOString(),
    scissorsBaseYear: SCISSORS_BASE_YEAR,
    commodityStats,
    commodityFull,
    fiveYearAvgs,
    latestFuels,
    fuelSeries,
    livestock,
    livestockHistorical: livestockHistoricalEurostat,
    crops,
    areas: cropAreas,
    fertilizers,
    fertSeries,
    regional,
    scissorsPoints,
  };

  await mkdir(dirname(STATS_OUT), { recursive: true });
  await writeFile(STATS_OUT, JSON.stringify(payload, null, 2) + '\n');
  console.log(`✓ wrote ${STATS_OUT}`);
  console.log(
    `  commodityStats: ${commodityStats.length}, latestFuels: ${latestFuels.length}, fuelSeries: ${fuelSeries.length}w\n` +
    `  livestock: ${livestock.length} latest, ${livestockHistoricalEurostat.length} Eurostat historical\n` +
    `  crops: ${crops.length}, areas: ${cropAreas.length}, regional: ${regional.length}\n` +
    `  fertilizers: ${fertilizers.length}, fertSeries: ${fertSeries.length}, scissors: ${scissorsPoints.length}`
  );
}

main().catch(err => { console.error(err); process.exit(1); });