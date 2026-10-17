// Geometrie evropských zemí pro /svet/mapa/ (country-level choropleth) a náhled na homepage.
// Formát kompatibilní s patternem RegionMap: { viewBox, regions:[{code, path, cx, cy, r}] }.
//
// ZDROJ: Natural Earth 1:10m Admin 0 – Countries (public domain,
// https://www.naturalearthdata.com/about/terms-of-use/), verze v5.1.2, varianta
// „point of view" Německa (ne_10m_admin_0_countries_deu).
// ‼️ Dřív army-svet ad2010.json z aourednik/historical-basemaps (GPL-3.0, nejasný původ
// dat) — audit licencí 2026-10-15, foto-audit/de/rizika/B-licence-dat.md.
// ‼️ Proč POV Německa a ne výchozí vrstva: výchozí Natural Earth kreslí hranice „de facto",
// takže Krym je v ní součástí Ruska a sever Kypru samostatný. Varianta členského státu EU
// odpovídá postoji EU (Krym = Ukrajina, Kypr celý) — pro /uk i ostatní mutace nutnost.
//
// Projekce a rám (FLON/FLAT, viewBox 0 0 1000 1165) jsou STEJNÉ jako dřív, ať se /svet/mapa/
// ani náhled nepohnou. Island a Kanárské ostrovy leží mimo viewBox (přetok) — viz INK_VIEWBOX
// v scripts/build-agrimap-preview.mjs; skript na konci vypíše skutečný rozsah cest.
// Vynechané: Špicberky, Jan Mayen, Bouvet (Norsko), zámoří Francie, Azory a Madeira (jako dřív).
//
// Spuštění: node scripts/build-svet-europe-geo.mjs  (výstup se commituje), pak
//           tsx scripts/build-agrimap-preview.mjs
//   NE_ADMIN0=/cesta/ne_10m_admin_0_countries_deu.geojson … místo stahování
import fs from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { polygonsOf, snapRing, simplifyShared, ringsToPath, signedArea, loadJson } from './lib/svet/geo.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '../src/data/svet/geo/europe.json');
const NE_VERSION = 'v5.1.2';
const NE_ADMIN0 = process.env.NE_ADMIN0
  || `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/${NE_VERSION}/geojson/ne_10m_admin_0_countries_deu.geojson`;

// ADM0_A3 (Natural Earth) → kód země v map-metrics.json (UK a GR, ne GB a EL)
const CODES = {
  ISL: 'IS', NOR: 'NO', SWE: 'SE', FIN: 'FI', ALD: 'FI' /* Åland */, EST: 'EE', LVA: 'LV', LTU: 'LT',
  IRL: 'IE', GBR: 'UK', DNK: 'DK', NLD: 'NL', DEU: 'DE', POL: 'PL', BEL: 'BE', LUX: 'LU', CZE: 'CZ',
  SVK: 'SK', UKR: 'UA', FRA: 'FR', CHE: 'CH', AUT: 'AT', HUN: 'HU', ROU: 'RO', PRT: 'PT', ESP: 'ES',
  ITA: 'IT', SVN: 'SI', HRV: 'HR', BGR: 'BG', GRC: 'GR', CYP: 'CY', MLT: 'MT',
};

const merc = (lon, lat) => [lon, (Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) * 180) / Math.PI];
const FLON = [-11, 41], FLAT = [35, 69.5];
const x0 = merc(FLON[0], 0)[0], x1 = merc(FLON[1], 0)[0], y0 = merc(0, FLAT[1])[1], y1 = merc(0, FLAT[0])[1];
const W = 1000, H = Math.round((W * (y0 - y1)) / (x1 - x0));
const px = (lon) => ((merc(lon, 0)[0] - x0) / (x1 - x0)) * W;
const py = (lat) => ((y0 - merc(0, lat)[1]) / (y0 - y1)) * H;

const EPS = 1.2; // px — tolerance Douglas–Peucker
const GRID = 0.001; // px — mřížka pro sdílené vrcholy
const MIN_ISLAND = 0.1; // stupně² — menší ostrovy vynechat (Malta a Kypr mají práh 0.002)

// které polygony země patří na mapu Evropy (podle středu bboxu vnějšího prstence)
function keep(code, ring) {
  let a = [180, 90, -180, -90];
  for (const [x, y] of ring) a = [Math.min(a[0], x), Math.min(a[1], y), Math.max(a[2], x), Math.max(a[3], y)];
  const lon = (a[0] + a[2]) / 2, lat = (a[1] + a[3]) / 2;
  if (lon < -25 || lon > 45 || lat < 27 || lat > 71.5) return false; // zámoří, Špicberky, Bouvet
  if (code === 'NO' && lon < 3) return false; // Jan Mayen
  if (code === 'PT' && lon < -10) return false; // Azory, Madeira
  return true;
}
// plocha prstence ve stupních² — stejný práh jako dřív (drobné ostrůvky pryč)
const degArea = (ring) => Math.abs(signedArea(ring));

const geo = await loadJson(NE_ADMIN0, { cacheFile: process.env.NE_ADMIN0 ? undefined : path.join(tmpdir(), `ne_10m_admin_0_countries_deu_${NE_VERSION}.geojson`) });
const rings = {}; // code → [ring v px]
const label = {}; // code → největší polygon (pro cx/cy/r)
for (const f of geo.features) {
  const code = CODES[f.properties.ADM0_A3];
  if (!code) continue;
  for (const poly of polygonsOf(f.geometry)) {
    const outer = poly[0];
    if (!keep(code, outer)) continue;
    const A = degArea(outer);
    if (A < (code === 'MT' || code === 'CY' ? 0.002 : MIN_ISLAND)) continue;
    rings[code] ??= [];
    for (const ring of poly) rings[code].push(snapRing(ring.map(([lo, la]) => [px(lo), py(la)]), GRID));
    if (!label[code] || A > label[code].A) label[code] = { A, firstRing: rings[code].length - poly.length };
  }
}
const missing = [...new Set(Object.values(CODES))].filter((c) => !rings[c]);
if (missing.length) throw new Error(`Chybí geometrie pro: ${missing.join(', ')}`);

// Pozn.: y v px roste dolů → orientace prstenců je proti GeoJSON otočená, ale konzistentně
// (vnější i díry), takže `nonzero` v SVG vykreslí díry správně.
const simp = simplifyShared(rings, EPS, { minArea: 0.15 });

// Bod popisku: těžiště největšího polygonu; když leží mimo něj (Norsko, Chorvatsko —
// protáhlé tvary), střed nejširšího úseku vodorovné přímky skrz těžiště uvnitř polygonu.
function labelPoint(ring) {
  let a = 0, sx = 0, sy = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const [x1, y1] = ring[i], [x2, y2] = ring[i + 1];
    const c = x1 * y2 - x2 * y1;
    a += c; sx += (x1 + x2) * c; sy += (y1 + y2) * c;
  }
  const cx = sx / (3 * a), cy = sy / (3 * a);
  const xs = [];
  for (let i = 0; i < ring.length - 1; i++) {
    const [x1, y1] = ring[i], [x2, y2] = ring[i + 1];
    if ((y1 > cy) !== (y2 > cy)) xs.push(x1 + ((cy - y1) * (x2 - x1)) / (y2 - y1));
  }
  xs.sort((p, q) => p - q);
  let best = null;
  for (let i = 0; i + 1 < xs.length; i += 2) {
    if (cx >= xs[i] && cx <= xs[i + 1]) return [cx, cy];
    if (!best || xs[i + 1] - xs[i] > best[1] - best[0]) best = [xs[i], xs[i + 1]];
  }
  return best ? [(best[0] + best[1]) / 2, cy] : [cx, cy];
}

const regions = Object.keys(rings).sort().map((code) => {
  const [cx, cy] = labelPoint(rings[code][label[code].firstRing]);
  return { code, path: ringsToPath(simp[code]), cx: Math.round(cx), cy: Math.round(cy), r: Math.round(Math.sqrt(label[code].A) * 180) };
});

fs.mkdirSync(path.dirname(OUT), { recursive: true });
const out = {
  _comment: `Hranice evropských zemí pro /svet/mapa/. Zdroj: Natural Earth ${NE_VERSION} 1:10m Admin 0 (public domain), POV Německa. Mercator, rám lon ${FLON.join('…')}, lat ${FLAT.join('…')}. Build: scripts/build-svet-europe-geo.mjs.`,
  viewBox: `0 0 ${W} ${H}`,
  boundarySource: 'naturalearth',
  regions,
};
fs.writeFileSync(OUT, JSON.stringify(out) + '\n');

// skutečný rozsah cest (pro INK_VIEWBOX v build-agrimap-preview.mjs)
let ink = [Infinity, Infinity, -Infinity, -Infinity];
for (const r of regions) {
  const nums = r.path.match(/-?\d+(\.\d+)?/g).map(Number);
  for (let i = 0; i < nums.length; i += 2) ink = [Math.min(ink[0], nums[i]), Math.min(ink[1], nums[i + 1]), Math.max(ink[2], nums[i]), Math.max(ink[3], nums[i + 1])];
}
console.log('europe.json:', regions.length, 'zemí, viewBox 0 0', W, H, '| kB', Math.round(fs.statSync(OUT).size / 1024),
  `| rozsah cest x ${ink[0]}…${ink[2]}, y ${ink[1]}…${ink[3]}`);
