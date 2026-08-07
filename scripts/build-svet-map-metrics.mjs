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

// Metriky, které /svet json dodává v tisících (unit „1000 ks"/„1000 farem") →
// hodnotu i řadu vydělíme 1000 a jednotku přepíšeme na miliony. Zobrazení pak
// „1,81 mil. ks" místo ošklivého „1 813 1000 ks". Konzistentní s ag_land (mil. ha).
const MILLIONS = { cattle_count: 'mil. ks', pigs_count: 'mil. ks', farm_count: 'mil. farem' };

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
    let val = ind?.latest?.value ?? null;
    let ser = Array.isArray(ind?.series) ? ind.series.map((s) => s.value) : null;
    if (MILLIONS[key]) {
      if (val != null) val = val / 1000;
      if (ser) ser = ser.map((x) => (x == null ? x : x / 1000));
    }
    values[key] = val;
    series[key] = ser;
    if (ind && !engineMeta[key]) engineMeta[key] = { label: ind.label, unit: MILLIONS[key] || ind.unit || ind.latest?.unit || '', source: ind.latest?.source || '', sourceUrl: ind.latest?.sourceUrl || '' };
  }
  countries[code] = { slug, name: c?.nameCs || slug, flag: c?.flag || '', region, values, series };
}

// CAP přímé platby (orientační průměr €/ha) = roční národní obálka ÷ zeměd. plocha.
// Obálky: Annex V nařízení (EU) 2021/2115 [2023,2024,2025,2026,2027] EUR (current prices).
// Hodnota = 2027 (ustálený stav), sparkline = celá řada. Non-EU → null (bez CAP).
const CAP_ENV5 = {
  BE: [494925924, 494925924, 494925924, 494925924, 494925924], BG: [808442754, 817072343, 825701932, 834331520, 834331520],
  CZ: [854947297, 854947297, 854947297, 854947297, 854947297], DK: [862367277, 862367277, 862367277, 862367277, 862367277],
  DE: [4915695459, 4915695459, 4915695459, 4915695459, 4915695459], EE: [196436567, 199297294, 202158021, 205018748, 205018748],
  IE: [1186281996, 1186281996, 1186281996, 1186281996, 1186281996], GR: [2075656043, 2075656043, 2075656043, 2075656043, 2075656043],
  ES: [4874879750, 4882179366, 4889478982, 4896778599, 4896778599], FR: [7285000537, 7285000537, 7285000537, 7285000537, 7285000537],
  HR: [374770237, 374770237, 374770237, 374770237, 374770237], IT: [3628529155, 3628529155, 3628529155, 3628529155, 3628529155],
  CY: [47647540, 47647540, 47647540, 47647540, 47647540], LV: [349226285, 354312105, 359397925, 364483744, 364483744],
  LT: [587064372, 595613853, 604163335, 612712816, 612712816], LU: [32747827, 32747827, 32747827, 32747827, 32747827],
  HU: [1243185165, 1243185165, 1243185165, 1243185165, 1243185165], MT: [4594021, 4594021, 4594021, 4594021, 4594021],
  NL: [717382327, 717382327, 717382327, 717382327, 717382327], AT: [677581846, 677581846, 677581846, 677581846, 677581846],
  PL: [3092416671, 3123600494, 3154784317, 3185968140, 3185968140], PT: [613619128, 622403166, 631187204, 639971242, 639971242],
  RO: [1946921018, 1974479078, 2002037137, 2029595196, 2029595196], SI: [131530052, 131530052, 131530052, 131530052, 131530052],
  SK: [400894402, 405754516, 410614629, 415474743, 415474743], FI: [519350246, 521168786, 522987325, 524805865, 524805865],
  SE: [686131966, 686360116, 686588267, 686816417, 686816417],
};
for (const [code, ct] of Object.entries(countries)) {
  const env = CAP_ENV5[code], al = ct.values.ag_land;
  if (env && al != null) {
    const ser = env.map((e) => Math.round(e / (al * 1e6)));
    ct.values.cap_payments = ser[ser.length - 1];
    ct.series.cap_payments = ser;
  } else {
    ct.values.cap_payments = null;
    ct.series.cap_payments = null;
  }
}

// Krátké vysvětlení každé metriky (co hodnota znamená) — zobrazí se přes „i" u názvu.
const METRIC_NOTES = {
  land_price: 'Průměrná tržní cena orné půdy za hektar. U některých zemí jsou dostupná jen regionální data.',
  rent: 'Průměrné roční pachtovné (nájemné) za hektar zemědělské půdy.',
  wheat_yield: 'Průměrný výnos pšenice v tunách na hektar sklizené plochy.',
  maize_yield: 'Průměrný výnos kukuřice (na zrno) v tunách na hektar.',
  cattle_count: 'Celkové stavy skotu v zemi (v milionech kusů).',
  pigs_count: 'Celkové stavy prasat v zemi (v milionech kusů).',
  ag_land: 'Rozloha zemědělské půdy — orná půda, trvalé kultury a pastviny (v milionech hektarů).',
  farm_count: 'Počet zemědělských podniků v zemi (v milionech).',
  organic_share: 'Podíl plochy v ekologickém zemědělství na celkové zemědělské ploše (%).',
  ag_value_added_gdp: 'Podíl zemědělství (přidaná hodnota) na hrubém domácím produktu (%).',
  ag_employment: 'Podíl pracujících v zemědělství na celkové zaměstnanosti (%).',
};

const metrics = [
  { key: 'cap_payments', group: 'Podpory', label: 'Přímé platby CAP (Ø)', unit: '€/ha', currency: true,
    source: 'Přímé platby: Annex V nařízení (EU) 2021/2115 (rok 2027); zeměd. plocha: World Bank',
    sourceUrl: 'https://eur-lex.europa.eu/eli/reg/2021/2115/oj',
    note: 'Orientační průměr = roční národní obálka přímých plateb ÷ zemědělská plocha. Skutečná sazba na hektar se u jednotlivých plateb (BISS, eko-schémata, ANC…) liší; non-EU země bez plateb.' },
  ...LAND_METRICS.map((m) => ({ key: m.key, group: m.group, label: m.label, unit: m.unit, currency: true, source: m.source, sourceUrl: m.sourceUrl, note: METRIC_NOTES[m.key] })),
  ...ENGINE_METRICS.map(({ key, group }) => ({ key, group, label: engineMeta[key]?.label || key, unit: engineMeta[key]?.unit || '', source: engineMeta[key]?.source || '', sourceUrl: engineMeta[key]?.sourceUrl || '', note: METRIC_NOTES[key] })),
];

fs.writeFileSync(OUT, JSON.stringify({ metrics, countries }) + '\n');
console.log('map-metrics.json:', Object.keys(countries).length, 'zemí ·', metrics.length, 'metrik ·', metrics.map((m) => m.label + (m.currency ? ' €' : '')).join(', '));
