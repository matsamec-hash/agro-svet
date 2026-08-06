// Geometrie evropských zemí pro /svet/mapa/ (country-level choropleth).
// Formát kompatibilní s patternem RegionMap: { viewBox, regions:[{code, path, cx, cy, r}] }.
// Zdroj: army-svet ad2010.json (moderní hranice). Cesta přes env BORDERS_JSON.
// Spuštění: node scripts/build-svet-europe-geo.mjs  (výstup se commituje)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BORDERS = process.env.BORDERS_JSON
  || path.resolve(__dirname, '../../../army-svet/army-svet/public/borders/ad2010.json');
const OUT = path.resolve(__dirname, '../src/data/svet/geo/europe.json');

// EN název (properties.n) -> code (slug se dohledá z /svet/<slug>.json přes code v map-metrics)
const NAMES = {
  Iceland: 'IS', Norway: 'NO', Sweden: 'SE', Finland: 'FI', Estonia: 'EE', Latvia: 'LV', Lithuania: 'LT',
  Ireland: 'IE', 'United Kingdom': 'UK', Denmark: 'DK', Netherlands: 'NL', Germany: 'DE', Poland: 'PL',
  Belgium: 'BE', Luxembourg: 'LU', 'Czech Republic': 'CZ', Slovakia: 'SK', Ukraine: 'UA', France: 'FR',
  Switzerland: 'CH', Austria: 'AT', Hungary: 'HU', Romania: 'RO', Portugal: 'PT', Spain: 'ES', Italy: 'IT',
  Slovenia: 'SI', Croatia: 'HR', Bulgaria: 'BG', Greece: 'GR', Cyprus: 'CY', Malta: 'MT',
};

const merc = (lon, lat) => [lon, (Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) * 180) / Math.PI];
const FLON = [-11, 41], FLAT = [35, 69.5];
const x0 = merc(FLON[0], 0)[0], x1 = merc(FLON[1], 0)[0], y0 = merc(0, FLAT[1])[1], y1 = merc(0, FLAT[0])[1];
const W = 1000, H = Math.round((W * (y0 - y1)) / (x1 - x0));
const px = (lon) => ((merc(lon, 0)[0] - x0) / (x1 - x0)) * W;
const py = (lat) => ((y0 - merc(0, lat)[1]) / (y0 - y1)) * H;

function ringPath(ring) {
  let d = '', prev = null, n = 0;
  for (const [lo, la] of ring) {
    const X = +px(lo).toFixed(1), Y = +py(la).toFixed(1);
    if (prev && Math.abs(X - prev[0]) < 0.4 && Math.abs(Y - prev[1]) < 0.4) continue;
    d += (d ? 'L' : 'M') + X + ' ' + Y + ' '; prev = [X, Y]; n++;
  }
  return n > 3 ? d + 'Z' : '';
}
function area(ring) { let a = 0; for (let i = 0; i < ring.length - 1; i++) a += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1]; return Math.abs(a / 2); }

const geo = JSON.parse(fs.readFileSync(BORDERS, 'utf8'));
const regions = [];
for (const f of geo.features) {
  const code = NAMES[f.properties.n];
  if (!code) continue;
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  let d = '', best = 0, cx = 0, cy = 0, r = 0;
  for (const poly of polys) {
    const outer = poly[0]; const A = area(outer);
    if (A < (code === 'MT' || code === 'CY' ? 0.002 : 0.03)) continue;
    d += ringPath(outer);
    if (A > best) { best = A; let sx = 0, sy = 0; for (const [lo, la] of outer) { sx += px(lo); sy += py(la); } cx = +(sx / outer.length).toFixed(0); cy = +(sy / outer.length).toFixed(0); r = Math.round(Math.sqrt(A) * 180); }
  }
  if (d) regions.push({ code, path: d, cx, cy, r });
}
regions.sort((a, b) => a.code.localeCompare(b.code));
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ viewBox: `0 0 ${W} ${H}`, regions }) + '\n');
console.log('europe.json:', regions.length, 'zemí, viewBox 0 0', W, H, '| kB', Math.round(fs.statSync(OUT).size / 1024));
