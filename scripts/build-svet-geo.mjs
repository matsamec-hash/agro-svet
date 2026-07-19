// Build hranic regionů zemí pro choropleth mapy /svet/[slug]/.
// Zdroj: Eurostat GISCO (oficiální NUTS geometrie), projekce EPSG:3035 (rovinná,
// rovnoploché) → přímý převod na SVG bez ruční projekce. Výstup: SVG paths se
// SDÍLENOU transformací (region + department overlay sedí na sebe).
//
// Spuštění: node scripts/build-svet-geo.mjs
// Přidání země = doplnit do COUNTRIES níže.
//
// Per-country config (úroveň „régionů" se mezi zeměmi liší):
//   regionLevel   … GISCO NUTS úroveň régionů (FR=1, DE=1 → spolkové země; PL=2 → vojvodství)
//   drillLevel    … NUTS úroveň drill overlay (o úroveň níž: FR NUTS-3, DE NUTS-2, PL NUTS-3)
//   regionCodeLen … délka kódu régionu (NUTS-1=3, NUTS-2=4) — parent drillu = code.slice(0, regionCodeLen)
//   drop          … kódy régionů k vynechání (FR zámoří 'FRY'; DE/PL nic)
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const GISCO = (res, lvl) =>
  `https://gisco-services.ec.europa.eu/distribution/v2/nuts/geojson/NUTS_RG_${res}_2021_3035_LEVL_${lvl}.geojson`;

const COUNTRIES = [
  { slug: 'francie', cntr: 'FR', res: '10M', regionLevel: 1, drillLevel: 3, regionCodeLen: 3, drop: ['FRY'] /* zámoří */ },
  { slug: 'nemecko', cntr: 'DE', res: '10M', regionLevel: 1, drillLevel: 2, regionCodeLen: 3, drop: [] /* 16 spolkových zemí = NUTS-1 */ },
  { slug: 'polsko', cntr: 'PL', res: '10M', regionLevel: 2, drillLevel: 3, regionCodeLen: 4, drop: [] /* 17 NUTS-2 = 16 vojvodství + rozdělené Mazovsko (PL91/PL92) */ },
  { slug: 'slovensko', cntr: 'SK', res: '10M', regionLevel: 2, drillLevel: 3, regionCodeLen: 4, drop: [] /* 4 NUTS-2 oblasti (Bratislavský/Západné/Stredné/Východné); FSS data jen NUTS-2 */ },
  // --- EU dávka (NUTS-2 régiony, drill NUTS-3) ---
  { slug: 'spanelsko', cntr: 'ES', res: '10M', regionLevel: 2, drillLevel: 3, regionCodeLen: 4, drop: ['ES70', 'ES63', 'ES64'] /* Kanárské ostrovy + Ceuta/Melilla (mimo pevninu) */ },
  { slug: 'italie', cntr: 'IT', res: '10M', regionLevel: 2, drillLevel: 3, regionCodeLen: 4, drop: [] /* 21 regionů */ },
  { slug: 'nizozemsko', cntr: 'NL', res: '10M', regionLevel: 2, drillLevel: 3, regionCodeLen: 4, drop: [] /* 12 provincií */ },
  { slug: 'rakousko', cntr: 'AT', res: '10M', regionLevel: 2, drillLevel: 3, regionCodeLen: 4, drop: [] /* 9 spolkových zemí */ },
  { slug: 'belgie', cntr: 'BE', res: '10M', regionLevel: 2, drillLevel: 3, regionCodeLen: 4, drop: [] /* 11 provincií */ },
  { slug: 'dansko', cntr: 'DK', res: '10M', regionLevel: 2, drillLevel: 3, regionCodeLen: 4, drop: [] /* 5 regionů */ },
  { slug: 'irsko', cntr: 'IE', res: '10M', regionLevel: 2, drillLevel: 3, regionCodeLen: 4, drop: [] /* 3 regiony */ },
  { slug: 'svedsko', cntr: 'SE', res: '10M', regionLevel: 2, drillLevel: 3, regionCodeLen: 4, drop: [] /* 8 regionů */ },
  { slug: 'finsko', cntr: 'FI', res: '10M', regionLevel: 2, drillLevel: 3, regionCodeLen: 4, drop: [] /* 5 regionů vč. Åland */ },
  { slug: 'portugalsko', cntr: 'PT', res: '10M', regionLevel: 2, drillLevel: 3, regionCodeLen: 4, drop: ['PT20', 'PT30'] /* Azory + Madeira (mimo pevninu) */ },
  { slug: 'recko', cntr: 'EL', res: '10M', regionLevel: 2, drillLevel: 3, regionCodeLen: 4, drop: [] /* 13 regionů; pozor: CNTR_CODE 'EL' */ },
  { slug: 'madarsko', cntr: 'HU', res: '10M', regionLevel: 2, drillLevel: 3, regionCodeLen: 4, drop: [] /* 8 regionů */ },
  { slug: 'rumunsko', cntr: 'RO', res: '10M', regionLevel: 2, drillLevel: 3, regionCodeLen: 4, drop: [] /* 8 regionů */ },
  { slug: 'bulharsko', cntr: 'BG', res: '10M', regionLevel: 2, drillLevel: 3, regionCodeLen: 4, drop: [] /* 6 regionů */ },
  { slug: 'slovinsko', cntr: 'SI', res: '10M', regionLevel: 2, drillLevel: 3, regionCodeLen: 4, drop: [] /* 2 kohezní regiony */ },
  { slug: 'chorvatsko', cntr: 'HR', res: '10M', regionLevel: 2, drillLevel: 3, regionCodeLen: 4, drop: [] /* 4 regiony (2021) */ },
  { slug: 'litva', cntr: 'LT', res: '10M', regionLevel: 2, drillLevel: 3, regionCodeLen: 4, drop: [] /* 2 regiony */ },
];

const VIEW_W = 1000; // šířka viewBoxu; výška dopočtena dle poměru stran

const _jsonCache = new Map(); // memo dle URL — GISCO geojson jsou celoevropské, sdílené napříč zeměmi
async function getJson(url) {
  if (_jsonCache.has(url)) return _jsonCache.get(url);
  const p = (async () => {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`${r.status} ${url}`);
    return r.json();
  })();
  _jsonCache.set(url, p);
  return p;
}

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

// posbírá polygony (pole prstenců) z Polygon/MultiPolygon
function polygonsOf(geom) {
  if (geom.type === 'Polygon') return [geom.coordinates];
  if (geom.type === 'MultiPolygon') return geom.coordinates;
  return [];
}

// plocha prstence (shoelace) v m² — souřadnice EPSG:3035 (rovnoploché LAEA)
function ringArea(ring) {
  let s = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const [x1, y1] = ring[i], [x2, y2] = ring[i + 1];
    s += x1 * y2 - x2 * y1;
  }
  return Math.abs(s) / 2;
}
// rozloha feature v km² (vnější prstenec − díry). EPSG:3035 je rovnoploché → přesné.
function areaKm2(feature) {
  let a = 0;
  for (const poly of polygonsOf(feature.geometry))
    poly.forEach((ring, i) => { a += i === 0 ? ringArea(ring) : -ringArea(ring); });
  return Math.round(a / 1e6);
}

function bboxOfFeatures(features) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const f of features)
    for (const poly of polygonsOf(f.geometry))
      for (const ring of poly)
        for (const [x, y] of ring) {
          if (x < minX) minX = x; if (x > maxX) maxX = x;
          if (y < minY) minY = y; if (y > maxY) maxY = y;
        }
  return { minX, minY, maxX, maxY };
}

function makePathBuilder(bbox) {
  const scale = VIEW_W / (bbox.maxX - bbox.minX);
  const H = Math.round((bbox.maxY - bbox.minY) * scale);
  const tx = (x) => Math.round((x - bbox.minX) * scale * 10) / 10;
  const ty = (y) => Math.round((bbox.maxY - y) * scale * 10) / 10; // flip Y
  const epsM = 2500 / scale > 0 ? 2000 : 2000; // eps ~ 2 km v metrech
  return {
    height: H,
    build(feature) {
      let d = '';
      for (const poly of polygonsOf(feature.geometry)) {
        for (const ring of poly) {
          const simp = simplify(ring, 2000).map(([x, y]) => [tx(x), ty(y)]);
          if (simp.length < 3) continue;
          d += 'M' + simp.map((p, i) => (i === 0 ? p.join(' ') : 'L' + p.join(' '))).join('') + 'Z';
        }
      }
      return d;
    },
  };
}

for (const c of COUNTRIES) {
  const [regJson, drillJson] = await Promise.all([
    getJson(GISCO(c.res, c.regionLevel)),
    getJson(GISCO(c.res, c.drillLevel)),
  ]);
  const regions = regJson.features.filter(
    (f) => f.properties.CNTR_CODE === c.cntr && !c.drop.includes(f.properties.NUTS_ID),
  );
  const regionIds = new Set(regions.map((f) => f.properties.NUTS_ID));
  const departments = drillJson.features.filter(
    (f) => f.properties.CNTR_CODE === c.cntr && regionIds.has(f.properties.NUTS_ID.slice(0, c.regionCodeLen)),
  );

  const bbox = bboxOfFeatures(regions); // sdílená transformace dle régionů
  const pb = makePathBuilder(bbox);

  const out = {
    _comment: `Hranice ${c.slug} pro choropleth /svet/. Zdroj: Eurostat GISCO NUTS 2021 (EPSG:3035). SVG paths, sdílená transformace region+drill.`,
    slug: c.slug,
    viewBox: `0 0 ${VIEW_W} ${pb.height}`,
    regions: regions
      .map((f) => ({ code: f.properties.NUTS_ID, name: f.properties.NAME_LATN || f.properties.NUTS_NAME, areaKm2: areaKm2(f), path: pb.build(f) }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    departments: departments
      .map((f) => ({ code: f.properties.NUTS_ID, region: f.properties.NUTS_ID.slice(0, c.regionCodeLen), name: f.properties.NAME_LATN || f.properties.NUTS_NAME, path: pb.build(f) }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  };

  const outPath = `src/data/svet/regions/${c.slug}-geo.json`;
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(out) + '\n');
  const bytes = JSON.stringify(out).length;
  console.log(`${c.slug}: ${out.regions.length} régionů, ${out.departments.length} drill-jednotek → ${outPath} (${(bytes / 1024).toFixed(0)} kB), viewBox ${out.viewBox}`);
}
