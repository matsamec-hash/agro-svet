// Cílený fetch reálných Eurostat cen zemědělské půdy (apri_lprc) a pachtovného
// (apri_lrnt) pro /svet/mapa/ F2. NEspouští celý engine — jen tyto 2 datasety.
// Výstup: src/data/svet/land-prices.json { [code]: { land_price:{value,year,series}, rent:{...} } }.
// Spuštění: node scripts/build-svet-land-prices.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '../src/data/svet/land-prices.json');
const BASE = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data';

// code -> Eurostat geo (většinou identita; Řecko=EL). Non-EU (UA) Eurostat nemá → —.
const GEO = {};
const CODES = ['AT','BE','BG','CY','CZ','DE','DK','EE','ES','FI','FR','GR','HR','HU','IE','IS','IT','LT','LU','LV','MT','NL','NO','PL','PT','RO','SE','SI','SK','UA','UK','CH'];
for (const c of CODES) GEO[c] = c === 'GR' ? 'EL' : c;

async function fetchSeries(ds, agri, geo) {
  const url = `${BASE}/${ds}?format=JSON&freq=A&unit=EUR_HA&agriprod=${agri}&geo=${geo}`;
  const r = await fetch(url);
  if (!r.ok) return null;
  const j = await r.json();
  const vals = j.value || {};
  const times = j.dimension?.time?.category?.index || {};
  const idxToYear = Object.fromEntries(Object.entries(times).map(([y, i]) => [i, y]));
  const pairs = Object.entries(vals).map(([i, v]) => [idxToYear[i], v]).filter(([y, v]) => y && v != null).sort((a, b) => a[0].localeCompare(b[0]));
  if (!pairs.length) return null;
  const last = pairs[pairs.length - 1];
  return { value: Math.round(last[1]), year: Number(last[0]), series: pairs.map((p) => Math.round(p[1])) };
}

const out = {};
for (const [code, geo] of Object.entries(GEO)) {
  const land_price = await fetchSeries('apri_lprc', 'ARA', geo);
  const rent = await fetchSeries('apri_lrnt', 'ARA_J0000', geo);
  out[code] = { land_price, rent };
  await new Promise((r) => setTimeout(r, 120));
}
fs.writeFileSync(OUT, JSON.stringify(out) + '\n');
const lp = Object.values(out).filter((c) => c.land_price).length;
const rt = Object.values(out).filter((c) => c.rent).length;
console.log(`land-prices.json: ${Object.keys(out).length} zemí · cena půdy ${lp} · pachtovné ${rt}`);
