// Agreguje reálné /svet/<slug>.json + land-prices.json → src/data/svet/map-metrics.json.
// Reálné Eurostat/World Bank hodnoty — žádné YMYL. Spuštění: node scripts/build-svet-map-metrics.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(__dirname, '../src/data/svet');
const OUT = path.resolve(DIR, 'map-metrics.json');
const LAND = JSON.parse(fs.readFileSync(path.join(DIR, 'land-prices.json'), 'utf8'));

const COUNTRIES = {
  IS: ['island', 'Severní'], NO: ['norsko', 'Severní'], SE: ['svedsko', 'Severní'], FI: ['finsko', 'Severní'],
  EE: ['estonsko', 'Pobaltí'], LV: ['lotyssko', 'Pobaltí'], LT: ['litva', 'Pobaltí'], IE: ['irsko', 'Západní'],
  UK: ['velka-britanie', 'Západní'], DK: ['dansko', 'Severní'], NL: ['nizozemsko', 'Západní'], DE: ['nemecko', 'Střední'],
  PL: ['polsko', 'Střední'], BE: ['belgie', 'Západní'], LU: ['lucembursko', 'Západní'], CZ: ['cesko', 'Střední'],
  SK: ['slovensko', 'Střední'], UA: ['ukrajina', 'Východní'], FR: ['francie', 'Západní'], CH: ['svycarsko', 'Střední'],
  AT: ['rakousko', 'Střední'], HU: ['madarsko', 'Střední'], RO: ['rumunsko', 'Východní'], PT: ['portugalsko', 'Jižní'],
  ES: ['spanelsko', 'Jižní'], IT: ['italie', 'Jižní'], SI: ['slovinsko', 'Jižní'], HR: ['chorvatsko', 'Jižní'],
  BG: ['bulharsko', 'Východní'], GR: ['recko', 'Jižní'], CY: ['kypr', 'Jižní'], MT: ['malta', 'Jižní'],
};

// Metriky z land-prices.json (currency €/ha — přepočet CZK v komponentě).
const LAND_METRICS = [
  { key: 'land_price', group: 'Ceny', label: 'Cena zemědělské půdy', unit: '€/ha', source: 'Eurostat', sourceUrl: 'https://ec.europa.eu/eurostat/databrowser/view/apri_lprc/default/table' },
  { key: 'rent', group: 'Ceny', label: 'Pachtovné', unit: '€/ha·rok', source: 'Eurostat', sourceUrl: 'https://ec.europa.eu/eurostat/databrowser/view/apri_lrnt/default/table' },
];
// Metriky z /svet/<slug>.json (label/unit z dat).
const ENGINE_METRICS = [
  { key: 'wheat_yield', group: 'Produkce' },
  { key: 'maize_yield', group: 'Produkce' },
  { key: 'cattle_count', group: 'Produkce' },
  { key: 'pigs_count', group: 'Produkce' },
  { key: 'ag_land', group: 'Struktura' },
  { key: 'farm_count', group: 'Struktura' },
  { key: 'organic_share', group: 'Struktura' },
  { key: 'ag_value_added_gdp', group: 'Ekonomika' },
  { key: 'ag_employment', group: 'Ekonomika' },
];

function loadCountry(slug) {
  const p = path.join(DIR, `${slug}.json`);
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : null;
}

const engineMeta = {};
const countries = {};
for (const [code, [slug, region]] of Object.entries(COUNTRIES)) {
  const c = loadCountry(slug);
  const values = {}, series = {};
  for (const m of LAND_METRICS) {
    const d = LAND[code]?.[m.key];
    values[m.key] = d?.value ?? null;
    series[m.key] = d?.series ?? null;
  }
  for (const { key } of ENGINE_METRICS) {
    const ind = c?.indicators?.[key];
    values[key] = ind?.latest?.value ?? null;
    series[key] = Array.isArray(ind?.series) ? ind.series.map((s) => s.value) : null;
    if (ind && !engineMeta[key]) engineMeta[key] = { label: ind.label, unit: ind.unit || ind.latest?.unit || '', source: ind.latest?.source || '', sourceUrl: ind.latest?.sourceUrl || '' };
  }
  countries[code] = { slug, name: c?.nameCs || slug, flag: c?.flag || '', region, values, series };
}

const metrics = [
  ...LAND_METRICS.map((m) => ({ key: m.key, group: m.group, label: m.label, unit: m.unit, currency: true, source: m.source, sourceUrl: m.sourceUrl })),
  ...ENGINE_METRICS.map(({ key, group }) => ({ key, group, label: engineMeta[key]?.label || key, unit: engineMeta[key]?.unit || '', source: engineMeta[key]?.source || '', sourceUrl: engineMeta[key]?.sourceUrl || '' })),
];

fs.writeFileSync(OUT, JSON.stringify({ metrics, countries }) + '\n');
console.log('map-metrics.json:', Object.keys(countries).length, 'zemí ·', metrics.length, 'metrik ·', metrics.map((m) => m.label + (m.currency ? ' €' : '')).join(', '));
