// Build hranic států USA pro choropleth mapu /svet/usa/.
// USA je MIMO Eurostat → vlastní zdroj hranic: us-atlas `states-albers-10m.json`
// (TopoJSON, projekce d3 Albers USA vč. insetů Aljašky/Havaje). Souřadnice jsou
// PŘED-PROJEKTOVANÉ v rovině ~975×610 → přímý převod na SVG bez projekční matiky.
//
// Vstup:  /tmp/states-albers-10m.json  (curl z https://unpkg.com/us-atlas@3/states-albers-10m.json)
// Výstup: src/data/svet/regions/usa-geo.json  (formát jako francie-geo.json, departments: [])
// Spuštění: node scripts/build-svet-geo-usa.mjs
//
// Kód státu = 2-písmenná poštovní zkratka (CA, TX…) — konzistentní s usa.json (data).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { feature } from 'topojson-client';

const SRC = '/tmp/states-albers-10m.json';
const VIEW_W = 975, VIEW_H = 610;
const EPS = 0.6; // Douglas-Peucker tolerance v jednotkách albers plánu (~0.6 px)

// FIPS (2 číslice) → poštovní zkratka státu (+ DC)
const FIPS_ABBR = {
  '01': 'AL', '02': 'AK', '04': 'AZ', '05': 'AR', '06': 'CA', '08': 'CO', '09': 'CT',
  '10': 'DE', '11': 'DC', '12': 'FL', '13': 'GA', '15': 'HI', '16': 'ID', '17': 'IL',
  '18': 'IN', '19': 'IA', '20': 'KS', '21': 'KY', '22': 'LA', '23': 'ME', '24': 'MD',
  '25': 'MA', '26': 'MI', '27': 'MN', '28': 'MS', '29': 'MO', '30': 'MT', '31': 'NE',
  '32': 'NV', '33': 'NH', '34': 'NJ', '35': 'NM', '36': 'NY', '37': 'NC', '38': 'ND',
  '39': 'OH', '40': 'OK', '41': 'OR', '42': 'PA', '44': 'RI', '45': 'SC', '46': 'SD',
  '47': 'TN', '48': 'TX', '49': 'UT', '50': 'VT', '51': 'VA', '53': 'WA', '54': 'WV',
  '55': 'WI', '56': 'WY',
};

// perpendikulární vzdálenost bodu p od úsečky a–b
function perpDist(p, a, b) {
  const [px, py] = p, [ax, ay] = a, [bx, by] = b;
  const dx = bx - ax, dy = by - ay;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(px - ax, py - ay);
  const t = ((px - ax) * dx + (py - ay) * dy) / len2;
  const cx = ax + t * dx, cy = ay + t * dy;
  return Math.hypot(px - cx, py - cy);
}
// Douglas-Peucker zjednodušení jednoho prstence
function simplify(points, eps) {
  if (points.length < 3) return points;
  let maxD = 0, idx = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const d = perpDist(points[i], points[0], points[points.length - 1]);
    if (d > maxD) { maxD = d; idx = i; }
  }
  if (maxD > eps) {
    const left = simplify(points.slice(0, idx + 1), eps);
    const right = simplify(points.slice(idx), eps);
    return left.slice(0, -1).concat(right);
  }
  return [points[0], points[points.length - 1]];
}
function polygonsOf(geom) {
  if (geom.type === 'Polygon') return [geom.coordinates];
  if (geom.type === 'MultiPolygon') return geom.coordinates;
  return [];
}
// SVG path z feature — souřadnice jsou už v rovině (y roste dolů, jako SVG)
function buildPath(f) {
  let d = '';
  for (const poly of polygonsOf(f.geometry)) {
    for (const ring of poly) {
      const simp = simplify(ring, EPS).map(([x, y]) => [Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
      if (simp.length < 3) continue;
      d += 'M' + simp.map((p, i) => (i === 0 ? p.join(' ') : 'L' + p.join(' '))).join('') + 'Z';
    }
  }
  return d;
}

const topo = JSON.parse(readFileSync(SRC, 'utf8'));
const fc = feature(topo, topo.objects.states); // TopoJSON → GeoJSON FeatureCollection

const regions = fc.features
  .map((f) => {
    const fips = String(f.id).padStart(2, '0');
    const code = FIPS_ABBR[fips];
    return code ? { code, name: f.properties.name, path: buildPath(f) } : null;
  })
  .filter(Boolean)
  .sort((a, b) => a.name.localeCompare(b.name));

const out = {
  _comment:
    'Hranice států USA pro choropleth /svet/. Zdroj: us-atlas@3 states-albers-10m (TopoJSON, d3 Albers USA, ' +
    'předprojektované vč. insetů AK/HI). SVG paths, kód = poštovní zkratka státu. departments prázdné (bez drill).',
  slug: 'usa',
  viewBox: `0 0 ${VIEW_W} ${VIEW_H}`,
  regions,
  departments: [],
};

const outPath = 'src/data/svet/regions/usa-geo.json';
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(out) + '\n');
console.log(`usa: ${regions.length} států → ${outPath} (${(JSON.stringify(out).length / 1024).toFixed(0)} kB), viewBox ${out.viewBox}`);
