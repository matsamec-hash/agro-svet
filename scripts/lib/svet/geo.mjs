// Sdílené nástroje pro build hranic /svet (scripts/build-svet-geo.mjs, build-svet-europe-geo.mjs).
//
// Proč vlastní kód a ne mapshaper/topojson-server: v repu je jen topojson-client
// a kvůli třem operacím (projekce, sloučení jednotek, zjednodušení) nemá smysl
// přidávat závislost. Všechno níž je deterministické → stejný vstup = stejný výstup.
//
//  - laea3035()        … projekce EPSG:3035 (Lambert azimuthal equal-area, ETRS89).
//                         Rovnoplochá → rozloha régionu se počítá rovnou z rovinných souřadnic.
//  - dissolve()        … sloučení sousedních polygonů do jednoho (správní jednotky → région).
//                         Funguje na tom, že sousední polygony Natural Earth sdílejí vrcholy:
//                         společná hrana se vyskytne dvakrát v opačném směru a vyruší se.
//  - simplifyShared()  … Douglas–Peucker, ale po „obloucích" mezi uzly — společnou hranici
//                         dvou régionů zjednoduší JEDNOU, takže mezi nimi nevznikne mezera
//                         ani překryv (původní build zjednodušoval každý prstenec zvlášť).

// ── Projekce EPSG:3035 (EPSG Guidance Note 7-2, metoda 9820, elipsoid GRS80) ────────────
const A = 6378137;
const E2 = 0.00669438002290;
const E = Math.sqrt(E2);
const PHI0 = (52 * Math.PI) / 180, LAM0 = (10 * Math.PI) / 180;
const FE = 4321000, FN = 3210000;
const q = (phi) => {
  const s = Math.sin(phi);
  return (1 - E2) * (s / (1 - E2 * s * s) - (1 / (2 * E)) * Math.log((1 - E * s) / (1 + E * s)));
};
const QP = q(Math.PI / 2);
const BETA0 = Math.asin(q(PHI0) / QP);
const RQ = A * Math.sqrt(QP / 2);
const D = (A * (Math.cos(PHI0) / Math.sqrt(1 - E2 * Math.sin(PHI0) ** 2))) / (RQ * Math.cos(BETA0));

/** [lon, lat] ve stupních → [E, N] v metrech (EPSG:3035). */
export function laea3035(lon, lat) {
  const phi = (lat * Math.PI) / 180, lam = (lon * Math.PI) / 180;
  const beta = Math.asin(Math.max(-1, Math.min(1, q(phi) / QP)));
  const dl = lam - LAM0;
  const B = RQ * Math.sqrt(2 / (1 + Math.sin(BETA0) * Math.sin(beta) + Math.cos(BETA0) * Math.cos(beta) * Math.cos(dl)));
  return [
    FE + B * D * Math.cos(beta) * Math.sin(dl),
    FN + (B / D) * (Math.cos(BETA0) * Math.sin(beta) - Math.sin(BETA0) * Math.cos(beta) * Math.cos(dl)),
  ];
}

// ── Geometrie ─────────────────────────────────────────────────────────────────────────
/** Polygony (pole prstenců) z GeoJSON Polygon/MultiPolygon. */
export function polygonsOf(geom) {
  if (!geom) return [];
  if (geom.type === 'Polygon') return [geom.coordinates];
  if (geom.type === 'MultiPolygon') return geom.coordinates;
  return [];
}

/** Znaménková plocha uzavřeného prstence (shoelace). Kladná = proti směru hodin (y nahoru). */
export function signedArea(ring) {
  let s = 0;
  for (let i = 0, n = ring.length; i < n - 1; i++) s += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
  return s / 2;
}

const keyOf = (p) => `${p[0]},${p[1]}`;

/** Zaokrouhlí souřadnice na mřížku `grid` a vyhodí po sobě jdoucí duplicity. Vrací uzavřený prstenec. */
export function snapRing(ring, grid) {
  const out = [];
  for (const [x, y] of ring) {
    const p = [Math.round(x / grid) * grid, Math.round(y / grid) * grid];
    const last = out[out.length - 1];
    if (!last || last[0] !== p[0] || last[1] !== p[1]) out.push(p);
  }
  if (out.length && (out[0][0] !== out[out.length - 1][0] || out[0][1] !== out[out.length - 1][1])) out.push(out[0]);
  return out;
}

/**
 * Sloučí polygony (už promítnuté a zaokrouhlené na stejnou mřížku) do jedné plochy.
 * Vnější prstence se otočí proti směru hodin, díry po směru; společné hrany se vyruší
 * a ze zbytku se složí uzavřené prstence. Orientace se zachová, takže díry (Berlín
 * v Braniborsku, Vídeň v Dolních Rakousích…) se s pravidlem `nonzero` vykreslí správně.
 */
export function dissolve(polygons) {
  const edges = new Map(); // "a|b" → počet (orientovaná hrana)
  const pts = new Map(); // key → [x, y]
  const add = (a, b) => {
    const rev = `${b}|${a}`;
    const c = edges.get(rev);
    if (c) { if (c === 1) edges.delete(rev); else edges.set(rev, c - 1); return; }
    const k = `${a}|${b}`;
    edges.set(k, (edges.get(k) ?? 0) + 1);
  };
  for (const poly of polygons) {
    poly.forEach((ring, i) => {
      if (ring.length < 4) return;
      const ccw = signedArea(ring) > 0;
      const r = (i === 0) === ccw ? ring : [...ring].reverse(); // vnější CCW, díry CW
      for (let j = 0; j < r.length - 1; j++) {
        const a = keyOf(r[j]), b = keyOf(r[j + 1]);
        if (a === b) continue;
        pts.set(a, r[j]); pts.set(b, r[j + 1]);
        add(a, b);
      }
    });
  }
  // složení prstenců: z každého vrcholu vedou zbylé hrany dál
  const out = new Map(); // a → [b, b, …]
  for (const [k, c] of edges) {
    const [a, b] = k.split('|');
    for (let i = 0; i < c; i++) { if (!out.has(a)) out.set(a, []); out.get(a).push(b); }
  }
  const rings = [];
  // deterministické pořadí startů
  const starts = [...out.keys()].sort();
  for (const s of starts) {
    while (out.get(s)?.length) {
      const ring = [pts.get(s)];
      let cur = s;
      for (let guard = 0; guard < 1e7; guard++) {
        const nexts = out.get(cur);
        if (!nexts || !nexts.length) break; // nemělo by nastat (každý vrchol má vstup = výstup)
        const nx = nexts.shift();
        ring.push(pts.get(nx));
        cur = nx;
        if (cur === s) break;
      }
      if (ring.length >= 4 && keyOf(ring[0]) === keyOf(ring[ring.length - 1])) rings.push(ring);
    }
  }
  return rings;
}

// ── Douglas–Peucker (iterativně, bez rekurze — oblouky pobřeží mají desítky tisíc bodů) ──
function perpDist(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(p[0] - a[0], p[1] - a[1]);
  const t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2;
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
}
/** Zjednoduší lomenou čáru, krajní body drží. */
export function douglasPeucker(points, eps) {
  const n = points.length;
  if (n < 3) return points.slice();
  const keep = new Uint8Array(n);
  keep[0] = keep[n - 1] = 1;
  const stack = [[0, n - 1]];
  while (stack.length) {
    const [s, e] = stack.pop();
    let maxD = 0, idx = -1;
    for (let i = s + 1; i < e; i++) {
      const d = perpDist(points[i], points[s], points[e]);
      if (d > maxD) { maxD = d; idx = i; }
    }
    if (idx > 0 && maxD > eps) { keep[idx] = 1; stack.push([s, idx], [idx, e]); }
  }
  return points.filter((_, i) => keep[i]);
}

/**
 * Zjednoduší prstence všech régionů tak, aby společné hranice zůstaly společné.
 * `byCode`: { code: [ring, …] } (uzavřené prstence, souřadnice na mřížce).
 * Vrací { code: [ring, …] } — prstence, které se zjednodušením zhroutily, vypadnou
 * (u sdíleného prstence, třeba enklávy a její díry, vypadnou na obou stranách zároveň).
 */
export function simplifyShared(byCode, eps, { minArea = 0 } = {}) {
  // vlastníci každé neorientované hrany
  const owners = new Map();
  const ek = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`);
  for (const [code, rings] of Object.entries(byCode)) {
    for (const ring of rings) {
      for (let i = 0; i < ring.length - 1; i++) {
        const k = ek(keyOf(ring[i]), keyOf(ring[i + 1]));
        const o = owners.get(k);
        if (!o) owners.set(k, code); else if (!o.split('+').includes(code)) owners.set(k, [...o.split('+'), code].sort().join('+'));
      }
    }
  }
  // uzly = vrcholy, kde se mění množina vlastníků sousedních hran
  const breaks = new Set();
  for (const rings of Object.values(byCode)) {
    for (const ring of rings) {
      const n = ring.length - 1; // poslední = první
      for (let i = 0; i < n; i++) {
        const prev = owners.get(ek(keyOf(ring[(i - 1 + n) % n]), keyOf(ring[i])));
        const next = owners.get(ek(keyOf(ring[i]), keyOf(ring[(i + 1) % n])));
        if (prev !== next) breaks.add(keyOf(ring[i]));
      }
    }
  }
  const cache = new Map(); // kanonický oblouk → zjednodušené body
  const simplifyArc = (arc) => {
    const fwd = arc.map(keyOf).join(';');
    const rev = arc.map(keyOf).reverse().join(';');
    const canonFwd = fwd <= rev;
    const id = canonFwd ? fwd : rev;
    let s = cache.get(id);
    if (!s) {
      const base = canonFwd ? arc : [...arc].reverse();
      s = douglasPeucker(base, eps);
      cache.set(id, s);
    }
    return canonFwd ? s : [...s].reverse();
  };
  const out = {};
  for (const [code, rings] of Object.entries(byCode)) {
    out[code] = [];
    for (const ring of rings) {
      const n = ring.length - 1;
      const pts = ring.slice(0, n);
      const bIdx = [];
      for (let i = 0; i < n; i++) if (breaks.has(keyOf(pts[i]))) bIdx.push(i);
      let res;
      if (!bIdx.length) {
        // uzavřený oblouk bez uzlů (ostrov, enkláva): kanonický start = nejmenší klíč,
        // směr podle souseda s menším klíčem; rozpůlit v nejvzdálenějším bodě
        let m = 0;
        for (let i = 1; i < n; i++) if (keyOf(pts[i]) < keyOf(pts[m])) m = i;
        let seq = [...pts.slice(m), ...pts.slice(0, m)];
        const flip = keyOf(seq[seq.length - 1]) < keyOf(seq[1]);
        if (flip) seq = [seq[0], ...seq.slice(1).reverse()];
        let far = 1, fd = -1;
        for (let i = 1; i < seq.length; i++) {
          const d = Math.hypot(seq[i][0] - seq[0][0], seq[i][1] - seq[0][1]);
          if (d > fd) { fd = d; far = i; }
        }
        const h1 = douglasPeucker(seq.slice(0, far + 1), eps);
        const h2 = douglasPeucker([...seq.slice(far), seq[0]], eps);
        res = [...h1, ...h2.slice(1)];
        if (flip) res = [res[0], ...res.slice(1, -1).reverse(), res[0]];
      } else {
        // rotace na první uzel, pak oblouky uzel → uzel
        const rot = [...pts.slice(bIdx[0]), ...pts.slice(0, bIdx[0])];
        const rb = bIdx.map((i) => i - bIdx[0]);
        res = [];
        for (let j = 0; j < rb.length; j++) {
          const s = rb[j], e = j + 1 < rb.length ? rb[j + 1] : n;
          const arc = e === n ? [...rot.slice(s, n), rot[0]] : rot.slice(s, e + 1);
          const sa = simplifyArc(arc);
          res.push(...(j === 0 ? sa : sa.slice(1)));
        }
      }
      if (res.length < 4) continue;
      if (minArea && Math.abs(signedArea(res)) < minArea) continue;
      out[code].push(res);
    }
  }
  return out;
}

/** SVG path z prstenců (už v pixelech). Souřadnice zaokrouhlené na `dp` desetinných míst. */
export function ringsToPath(rings, dp = 1) {
  const f = 10 ** dp;
  let d = '';
  for (const ring of rings) {
    const pts = [];
    for (let i = 0; i < ring.length - 1; i++) {
      const p = [Math.round(ring[i][0] * f) / f, Math.round(ring[i][1] * f) / f];
      const last = pts[pts.length - 1];
      if (!last || last[0] !== p[0] || last[1] !== p[1]) pts.push(p);
    }
    if (pts.length < 3) continue;
    d += 'M' + pts.map((p, i) => (i === 0 ? `${p[0]} ${p[1]}` : `L${p[0]} ${p[1]}`)).join('') + 'Z';
  }
  return d;
}

/** Stáhne soubor (s lokální cache), nebo přečte lokální cestu. */
export async function loadJson(urlOrPath, { cacheFile } = {}) {
  const fs = await import('node:fs');
  if (!/^https?:/.test(urlOrPath)) return JSON.parse(fs.readFileSync(urlOrPath, 'utf8'));
  if (cacheFile && fs.existsSync(cacheFile)) return JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
  const r = await fetch(urlOrPath);
  if (!r.ok) throw new Error(`${r.status} ${urlOrPath}`);
  const text = await r.text();
  if (cacheFile) fs.writeFileSync(cacheFile, text);
  return JSON.parse(text);
}
