// Agreguje reálné /svet/<slug>.json → src/data/svet/map-metrics.json pro /svet/mapa/.
// Bere jen indikátory, co engine reálně má (Eurostat/World Bank) — žádné YMYL.
// Spuštění: node scripts/build-svet-map-metrics.mjs  (výstup se commituje)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(__dirname, '../src/data/svet');
const OUT = path.resolve(DIR, 'map-metrics.json');

// code -> [slug, region]. Jméno+vlajka se čtou z <slug>.json (nameCs, flag).
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

// Vybrané reálné metriky do přepínače (key + skupina). Label/unit se berou z dat.
const METRIC_ORDER = [
  { key: 'wheat_yield', group: 'Produkce' },
  { key: 'cattle_count', group: 'Produkce' },
  { key: 'ag_land', group: 'Struktura' },
  { key: 'farm_count', group: 'Struktura' },
  { key: 'organic_share', group: 'Struktura' },
  { key: 'ag_employment', group: 'Ekonomika' },
];

function loadCountry(slug) {
  const p = path.join(DIR, `${slug}.json`);
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : null;
}

const metricsMeta = {}; // key -> {label, unit, source, sourceUrl}
const countries = {};
for (const [code, [slug, region]] of Object.entries(COUNTRIES)) {
  const c = loadCountry(slug);
  if (!c) { console.warn('chybí', slug); continue; }
  const values = {}, series = {};
  for (const { key } of METRIC_ORDER) {
    const ind = c.indicators?.[key];
    values[key] = ind?.latest?.value ?? null;
    series[key] = Array.isArray(ind?.series) ? ind.series.map((s) => s.value) : null;
    if (ind && !metricsMeta[key]) {
      metricsMeta[key] = { label: ind.label, unit: ind.unit || ind.latest?.unit || '', source: ind.latest?.source || '', sourceUrl: ind.latest?.sourceUrl || '' };
    }
  }
  countries[code] = { slug, name: c.nameCs || slug, flag: c.flag || '', region, values, series };
}

const metrics = METRIC_ORDER.map(({ key, group }) => ({
  key, group,
  label: metricsMeta[key]?.label || key,
  unit: metricsMeta[key]?.unit || '',
  source: metricsMeta[key]?.source || '',
  sourceUrl: metricsMeta[key]?.sourceUrl || '',
}));

fs.writeFileSync(OUT, JSON.stringify({ metrics, countries }) + '\n');
const withData = Object.values(countries).filter((c) => Object.values(c.values).some((v) => v != null)).length;
console.log('map-metrics.json:', Object.keys(countries).length, 'zemí (', withData, 'má data ) ·', metrics.length, 'metrik ·', metrics.map((m) => m.label).join(', '));
