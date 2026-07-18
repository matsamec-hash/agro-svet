// Build regionálních zemědělských dat států USA pro choropleth /svet/usa/.
// USA je MIMO Eurostat → zdroj = USDA NASS, Census of Agriculture 2022 (bulk dump
// QuickStats formátu `qs.census2022.txt.gz`, keyless).
//   curl -sL https://www.nass.usda.gov/datasets/qs.census2022.txt.gz -o /tmp/qs.census2022.txt.gz
//
// Vstup: rozbalený TSV proud z /tmp/qs.census2022.txt.gz (viz spuštění níže).
// Výstup: src/data/svet/regions/usa.json (formát jako francie.json, STEJNÉ klíče metrik).
//
// Spuštění:
//   gzip -dc /tmp/qs.census2022.txt.gz | node scripts/build-svet-usa-data.mjs
//
// Použité STATE-level záznamy (AGG_LEVEL_DESC=STATE, YEAR=2022, DOMAIN_DESC=TOTAL):
//   FARM OPERATIONS - ACRES OPERATED   … land in farms (akry)     → uaa
//   CATTLE, INCL CALVES - INVENTORY    … stavy skotu (head)       → cattle
//   AG LAND, CROPLAND - ACRES          … cropland (akry)          → arable_share
//   AG LAND, PASTURELAND - ACRES       … permanent pasture (akry) → grassland_share
import { writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';

const ACRE_TO_HA = 0.404686;

// Rozloha států (pevnina, km²) — U.S. Census Bureau (land area). Pro uaa_share.
const STATE_AREA_KM2 = {
  AL: 131171, AK: 1477953, AZ: 294207, AR: 134771, CA: 403466, CO: 268431, CT: 12542,
  DE: 5047, FL: 138887, GA: 148959, HI: 16635, ID: 214045, IL: 143793, IN: 92789,
  IA: 144669, KS: 211754, KY: 102269, LA: 111898, ME: 79883, MD: 25142, MA: 20202,
  MI: 146435, MN: 206232, MS: 121531, MO: 178040, MT: 376962, NE: 198974, NV: 284332,
  NH: 23187, NJ: 19047, NM: 314161, NY: 122057, NC: 125920, ND: 178711, OH: 105829,
  OK: 177660, OR: 248608, PA: 115883, RI: 2678, SC: 77857, SD: 196350, TN: 106798,
  TX: 676587, UT: 212818, VT: 23871, VA: 102279, WA: 172119, WV: 62259, WI: 140268,
  WY: 251470,
};

const WANT = {
  'FARM OPERATIONS - ACRES OPERATED': 'farmland_acres',
  'CATTLE, INCL CALVES - INVENTORY': 'cattle_head',
  'AG LAND, CROPLAND - ACRES': 'cropland_acres',
  'AG LAND, PASTURELAND - ACRES': 'pasture_acres',
};

const num = (s) => {
  const v = String(s).replace(/,/g, '').trim();
  return /^-?\d+(\.\d+)?$/.test(v) ? Number(v) : null;
};

// per-stát agregace surových hodnot
const raw = {}; // { AL: { farmland_acres, cattle_head, cropland_acres, pasture_acres } }

// Streamujeme řádek po řádku (rozbalený TSV má několik GB → nelze bufferovat celý).
const rl = createInterface({ input: process.stdin, crlfDelay: Infinity });
let iAgg, iYear, iDom, iShort, iAlpha, iVal, first = true;
for await (const line of rl) {
  if (first) {
    const header = line.split('\t');
    const col = (name) => header.indexOf(name);
    iAgg = col('AGG_LEVEL_DESC'); iYear = col('YEAR'); iDom = col('DOMAIN_DESC');
    iShort = col('SHORT_DESC'); iAlpha = col('STATE_ALPHA'); iVal = col('VALUE');
    first = false;
    continue;
  }
  if (!line) continue;
  const f = line.split('\t');
  if (f[iAgg] !== 'STATE' || f[iYear] !== '2022' || f[iDom] !== 'TOTAL') continue;
  const key = WANT[f[iShort]];
  if (!key) continue;
  const code = f[iAlpha];
  const v = num(f[iVal]);
  if (v == null) continue;
  (raw[code] ||= {})[key] = v;
}

const round = (n, d) => Math.round(n * 10 ** d) / 10 ** d;
const regions = {};
let full = 0;
for (const code of Object.keys(raw).sort()) {
  const r = raw[code];
  const rec = {};
  const farmHa = r.farmland_acres != null ? r.farmland_acres * ACRE_TO_HA : null;
  if (r.cattle_head != null) rec.cattle = round(r.cattle_head / 1000, 1);        // tis. ks
  if (farmHa != null) rec.uaa = round(farmHa / 1000, 1);                          // tis. ha
  if (farmHa != null && r.cattle_head != null) rec.cattle_density = round(r.cattle_head / farmHa, 2);
  if (r.cropland_acres != null && r.farmland_acres) rec.arable_share = round((r.cropland_acres / r.farmland_acres) * 100, 0);
  if (r.pasture_acres != null && r.farmland_acres) rec.grassland_share = round((r.pasture_acres / r.farmland_acres) * 100, 0);
  if (farmHa != null && STATE_AREA_KM2[code]) rec.uaa_share = round((farmHa / (STATE_AREA_KM2[code] * 100)) * 100, 0);
  regions[code] = rec;
  const keys = ['cattle', 'uaa', 'cattle_density', 'arable_share', 'grassland_share', 'uaa_share'];
  if (keys.every((k) => rec[k] != null)) full++;
}

const out = {
  _comment:
    'Regionální zemědělská data USA (státy). Zdroj: USDA NASS, Census of Agriculture 2022 ' +
    '(bulk qs.census2022.txt.gz, STATE-level DOMAIN=TOTAL). Metriky odvozené: land in farms→uaa, ' +
    'cattle inventory→cattle, cropland/pastureland→arable/grassland_share, uaa/rozloha státu→uaa_share.',
  slug: 'usa',
  level: 'STATE',
  year: 2022,
  source: 'USDA NASS — Census of Agriculture 2022',
  sourceUrl: 'https://www.nass.usda.gov/Publications/AgCensus/2022/',
  metrics: [
    { key: 'cattle_density', label: 'Hustota skotu', unit: 'ks/ha', desc: 'Kusy skotu na hektar zemědělské plochy' },
    { key: 'arable_share', label: 'Podíl orné půdy', unit: '%', desc: 'Orná půda (cropland) jako podíl zemědělské plochy (land in farms)' },
    { key: 'grassland_share', label: 'Podíl travních porostů', unit: '%', desc: 'Pastviny (pastureland) jako podíl zemědělské plochy' },
    { key: 'uaa_share', label: 'Podíl zemědělské půdy', unit: '%', desc: 'Zemědělská plocha (land in farms) jako podíl rozlohy státu' },
    { key: 'cattle', label: 'Stavy skotu', unit: 'tis. ks', desc: 'Počet kusů skotu (v tisících)' },
    { key: 'uaa', label: 'Zemědělská plocha', unit: 'tis. ha', desc: 'Zemědělská plocha (land in farms), v tisících hektarů' },
  ],
  regions,
};

writeFileSync('src/data/svet/regions/usa.json', JSON.stringify(out) + '\n');
console.log(`usa data: ${Object.keys(regions).length} států, ${full} s kompletní sadou 6 metrik → src/data/svet/regions/usa.json`);
