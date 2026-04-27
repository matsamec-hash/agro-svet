#!/usr/bin/env node
// Build-time CZSO commodity data fetcher.
// Generates src/data/commodities.json with precomputed time series + 5y rolling averages.
// Avoids per-request CZSO calls + O(n²) compute on homepage SSR (Cloudflare Worker CPU budget).
// Refresh: `npm run commodities:refresh`. Mirror the logic in src/lib/czso.ts when changing.

import { writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUTPUT = fileURLToPath(new URL('../src/data/commodities.json', import.meta.url));
const BASE = 'https://data.csu.gov.cz/api/dotaz/v1/data/vybery';

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

const ALL_NAMES = ['Pšenice','Ječmen','Řepka','Kukuřice','Mléko','Vepřové','Hovězí','Vejce','Mák'];
const MONTH_LABELS = ['leden','únor','březen','duben','květen','červen','červenec','srpen','září','říjen','listopad','prosinec'];
const MONTH_SHORT = ['Led','Úno','Bře','Dub','Kvě','Čvn','Čvc','Srp','Zář','Říj','Lis','Pro'];

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

function parseMonthStr(m) {
  const parts = m.trim().split(' ');
  if (parts.length < 2) return null;
  const idx = MONTH_LABELS.indexOf(parts[0].toLowerCase());
  const year = parseInt(parts[1]);
  if (idx === -1 || isNaN(year)) return null;
  return { month: idx, year };
}

async function fetchCommodityPrices() {
  const url = `${BASE}/CEN0203BT02?format=CSV`;
  console.log(`→ fetching ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CZSO CEN0203BT02: ${res.status}`);
  const csv = await res.text();
  const rows = parseCSV(csv).slice(1);

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
  console.log(`  ${items.length} price points across ${new Set(items.map(i => i.name)).size} commodities`);
  return items;
}

function buildFullSeries(prices) {
  const byName = new Map();
  for (const p of prices) {
    if (!byName.has(p.name)) byName.set(p.name, []);
    byName.get(p.name).push(p);
  }

  const results = [];
  for (const name of ALL_NAMES) {
    const list = byName.get(name);
    if (!list || list.length === 0) continue;
    const sorted = list
      .map(p => {
        const d = parseMonthStr(p.month);
        if (!d) return null;
        return { label: `${MONTH_SHORT[d.month]} ${d.year}`, value: p.price, sortKey: d.year * 12 + d.month };
      })
      .filter(Boolean);
    sorted.sort((a, b) => a.sortKey - b.sortKey);
    results.push({ name, unit: list[0].unit, data: sorted });
  }
  return results;
}

// Klouzavý 60-měsíční průměr cen komodity končící NA měsíci `endMonth` (exclusive of endMonth).
function fiveYearAverage(prices, endMonth) {
  const target = parseMonthStr(endMonth);
  if (!target) return null;
  const targetKey = target.year * 12 + target.month;
  const window = [];
  for (const p of prices) {
    const d = parseMonthStr(p.month);
    if (!d) continue;
    const key = d.year * 12 + d.month;
    if (key < targetKey && key >= targetKey - 60) window.push(p.price);
  }
  if (window.length < 60) return null;
  return window.reduce((a, b) => a + b, 0) / window.length;
}

const SHORT2LONG = {
  'Led':'leden','Úno':'únor','Bře':'březen','Dub':'duben','Kvě':'květen','Čvn':'červen',
  'Čvc':'červenec','Srp':'srpen','Zář':'září','Říj':'říjen','Lis':'listopad','Pro':'prosinec'
};

function buildFiveYearAvgs(commodityFull, prices) {
  // Per-commodity index for O(1) lookup (avoids the O(n²) loop on homepage)
  const pricesByName = new Map();
  for (const p of prices) {
    if (!pricesByName.has(p.name)) pricesByName.set(p.name, []);
    pricesByName.get(p.name).push(p);
  }

  const result = {};
  for (const s of commodityFull) {
    const points = [];
    const list = pricesByName.get(s.name) ?? [];
    const monthIndex = new Map();
    for (const p of list) {
      const d = parseMonthStr(p.month);
      if (!d) continue;
      monthIndex.set(`${MONTH_SHORT[d.month]} ${d.year}`, p.month);
    }
    for (const d of s.data) {
      const originalMonth = monthIndex.get(d.label);
      if (!originalMonth) continue;
      const avg = fiveYearAverage(list, originalMonth);
      if (avg !== null) points.push({ label: d.label, avg });
    }
    result[s.name] = points.length > 0 ? points : null;
  }
  return result;
}

async function main() {
  const prices = await fetchCommodityPrices();
  const commodityFull = buildFullSeries(prices);
  const fiveYearAvgs = buildFiveYearAvgs(commodityFull, prices);

  const payload = {
    generated: new Date().toISOString(),
    commodityFull,
    fiveYearAvgs,
  };

  await mkdir(dirname(OUTPUT), { recursive: true });
  await writeFile(OUTPUT, JSON.stringify(payload, null, 2) + '\n');
  console.log(`✓ wrote ${OUTPUT}`);
  console.log(`  ${commodityFull.length} series, ${commodityFull.reduce((a, s) => a + s.data.length, 0)} data points`);
}

main().catch(err => { console.error(err); process.exit(1); });
