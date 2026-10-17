// Build regionálních zemědělských dat pro choropleth mapy /svet/[slug]/.
// Zdroj: Eurostat Farm Structure Survey (NUTS-2, 2020) — ef_lsk_main (stavy zvířat),
// ef_lus_main (využití půdy). Data jsou vždy na NUTS-2; „régiony" mají per zemi jinou úroveň:
//   FR/DE régiony = NUTS-1 (regionCodeLen 3) → agregace NUTS-2 prefixem code.slice(0,3)
//   PL   régiony = NUTS-2 (regionCodeLen 4) → bez agregace, code.slice(0,4) = celý kód;
//        výjimka PL9 (Mazowieckie) = NUTS-1, součet PL91 + PL92 — geometrie Natural Earth
//        hranici mezi nimi nemá (viz scripts/build-svet-geo.mjs)
// Rozloha pro uaa_share je ÚŘEDNÍ rozloha régionu z Eurostatu (reg_area3, celková, km²),
// ne plocha polygonu — hranice z Natural Earth jsou zjednodušené (Åland v nich má třetinu
// skutečné rozlohy) a data nemají záviset na tom, jak je mapa nakreslená.
// Pozn.: výnosy plodin (t/ha) Eurostat na úrovni régionů nemá (jen národní),
// proto metriky vychází z FSS (plochy, stavy) — regionálně bohatě populované.
// Portugalsko tu není: regionální mapa pro něj není (NUTS-2 se ze správních jednotek
// Natural Earth složit nedají), takže by data neměla kde být.
//
// Spuštění: node scripts/build-svet-regions.mjs  (po scripts/build-svet-geo.mjs)
import { readFileSync, writeFileSync } from 'node:fs';

const EU = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data';

const _euCache = new Map(); // memo dle URL — datasety FSS vrací všechny geo najednou, sdílené napříč zeměmi
async function euGeoMap(dataset, params) {
  const q = Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&');
  const url = `${EU}/${dataset}?format=JSON&lang=EN&${q}`;
  if (_euCache.has(url)) return _euCache.get(url);
  const p = _euFetch(url, dataset);
  _euCache.set(url, p);
  return p;
}

async function _euFetch(url, dataset) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${dataset}`);
  const j = await r.json();
  const gi = j.dimension.geo.category.index;
  const sizes = j.size, dims = j.id, val = j.value;
  const gpos = dims.indexOf('geo');
  let stride = 1;
  for (let i = gpos + 1; i < sizes.length; i++) stride *= sizes[i];
  const out = {};
  for (const [code, pos] of Object.entries(gi)) {
    const v = val[String(pos * stride)];
    if (v != null) out[code] = v;
  }
  return out;
}

/**
 * Sečti FSS hodnoty (vždy NUTS-2) na úroveň régionů, jen zadané régiony.
 * regionCodeLen 3 → agregace na NUTS-1 (prefix). regionCodeLen 4 → NUTS-2 = celý kód (bez agregace).
 * Deprecated NUTS-2013 kódy (DE41/DED1/PL11…) mají v FSS null → do map se vůbec nedostanou.
 */
function rollup(map, cntr, regionCodes, regionCodeLen) {
  const o = {};
  for (const [code, v] of Object.entries(map)) {
    if (!code.startsWith(cntr) || code.length !== 4) continue;
    // région je NUTS-2 (celý kód) nebo NUTS-1 (prefix) — PL9 v jinak NUTS-2 Polsku
    const r = [code.slice(0, regionCodeLen), code.slice(0, 4), code.slice(0, 3)].find((k) => regionCodes.has(k));
    if (!r) continue;
    o[r] = (o[r] || 0) + v;
  }
  return o;
}

/** Úřední rozloha régionů (km², reg_area3 TOTAL) — hodnota pro daný rok, jinak nejbližší dostupný. */
async function regionAreas(codes, year) {
  const q = codes.map((c) => `geo=${c}`).join('&');
  const r = await fetch(`${EU}/reg_area3?format=JSON&lang=EN&landuse=TOTAL&unit=KM2&${q}`);
  if (!r.ok) throw new Error(`${r.status} reg_area3`);
  const j = await r.json();
  const gi = j.dimension.geo.category.index, ti = j.dimension.time.category.index;
  const years = Object.keys(ti).map(Number).sort((a, b) => Math.abs(a - year) - Math.abs(b - year) || b - a);
  const nT = Object.keys(ti).length;
  const out = {};
  for (const [g, gp] of Object.entries(gi)) {
    for (const y of years) {
      const v = j.value[String(gp * nT + ti[String(y)])];
      if (v != null) { out[g] = v; break; }
    }
  }
  return out;
}

const COUNTRIES = [
  { slug: 'francie', cntr: 'FR', year: '2020', regionLevel: 1, regionCodeLen: 3 },
  { slug: 'nemecko', cntr: 'DE', year: '2020', regionLevel: 1, regionCodeLen: 3 },
  { slug: 'polsko', cntr: 'PL', year: '2020', regionLevel: 2, regionCodeLen: 4,
    regionNote: 'úroveň vojvodství (NUTS-2); Mazowieckie souhrnně za PL91 a PL92 (NUTS-1 PL9).' },
  { slug: 'slovensko', cntr: 'SK', year: '2020', regionLevel: 2, regionCodeLen: 4 },
  // --- EU dávka (NUTS-2 régiony, bez agregace) ---
  { slug: 'spanelsko', cntr: 'ES', year: '2020', regionLevel: 2, regionCodeLen: 4 },
  { slug: 'italie', cntr: 'IT', year: '2020', regionLevel: 2, regionCodeLen: 4 },
  { slug: 'nizozemsko', cntr: 'NL', year: '2020', regionLevel: 2, regionCodeLen: 4 },
  { slug: 'rakousko', cntr: 'AT', year: '2020', regionLevel: 2, regionCodeLen: 4 },
  { slug: 'belgie', cntr: 'BE', year: '2020', regionLevel: 2, regionCodeLen: 4 },
  { slug: 'dansko', cntr: 'DK', year: '2020', regionLevel: 2, regionCodeLen: 4 },
  { slug: 'irsko', cntr: 'IE', year: '2020', regionLevel: 2, regionCodeLen: 4 },
  { slug: 'svedsko', cntr: 'SE', year: '2020', regionLevel: 2, regionCodeLen: 4 },
  { slug: 'finsko', cntr: 'FI', year: '2020', regionLevel: 2, regionCodeLen: 4 },
  { slug: 'recko', cntr: 'EL', year: '2020', regionLevel: 2, regionCodeLen: 4 },
  { slug: 'madarsko', cntr: 'HU', year: '2020', regionLevel: 2, regionCodeLen: 4 },
  { slug: 'rumunsko', cntr: 'RO', year: '2020', regionLevel: 2, regionCodeLen: 4 },
  { slug: 'bulharsko', cntr: 'BG', year: '2020', regionLevel: 2, regionCodeLen: 4 },
  { slug: 'slovinsko', cntr: 'SI', year: '2020', regionLevel: 2, regionCodeLen: 4 },
  { slug: 'chorvatsko', cntr: 'HR', year: '2020', regionLevel: 2, regionCodeLen: 4 },
  { slug: 'litva', cntr: 'LT', year: '2020', regionLevel: 2, regionCodeLen: 4 },
  // --- Mimo EU: UK má poslední FSS 2016 (po Brexitu už nesubmituje) ---
  { slug: 'velka-britanie', cntr: 'UK', year: '2016', regionLevel: 1, regionCodeLen: 3 },
];

const FSS_TOTAL = { statinfo: 'TOTAL', farmtype: 'TOTAL', so_eur: 'TOTAL', uaarea: 'TOTAL' };

const METRICS = [
  { key: 'cattle_density', label: 'Hustota skotu', unit: 'ks/ha', desc: 'Kusy skotu na hektar zemědělské plochy' },
  { key: 'arable_share', label: 'Podíl orné půdy', unit: '%', desc: 'Orná půda jako podíl zemědělské plochy (UAA)' },
  { key: 'grassland_share', label: 'Podíl travních porostů', unit: '%', desc: 'Trvalé travní porosty jako podíl UAA' },
  { key: 'uaa_share', label: 'Podíl zemědělské půdy', unit: '%', desc: 'Zemědělská plocha (UAA) jako podíl rozlohy régionu' },
  { key: 'cattle', label: 'Stavy skotu', unit: 'tis. ks', desc: 'Počet kusů skotu (v tisících)' },
  { key: 'uaa', label: 'Zemědělská plocha', unit: 'tis. ha', desc: 'Využitá zemědělská plocha (UAA), v tisících hektarů' },
];

for (const c of COUNTRIES) {
  const geo = JSON.parse(readFileSync(`src/data/svet/regions/${c.slug}-geo.json`, 'utf8'));
  const regionCodes = new Set(geo.regions.map((r) => r.code));
  const geoArea = Object.fromEntries(geo.regions.map((r) => [r.code, r.areaKm2]));
  const officialArea = await regionAreas([...regionCodes], Number(c.year));
  const areaKm2 = {};
  for (const code of regionCodes) {
    areaKm2[code] = officialArea[code] ?? geoArea[code];
    if (officialArea[code] == null) console.warn(`  ${c.slug} ${code}: reg_area3 bez hodnoty → rozloha z geometrie (${geoArea[code]} km²)`);
  }

  const [cattle, uaa, ara, grass] = await Promise.all([
    euGeoMap('ef_lsk_main', { ...FSS_TOTAL, lsu: 'TOTAL', animals: 'A2000', unit: 'HD', time: c.year }),
    euGeoMap('ef_lus_main', { ...FSS_TOTAL, crops: 'UAA', unit: 'HA', time: c.year }),
    euGeoMap('ef_lus_main', { ...FSS_TOTAL, crops: 'ARA', unit: 'HA', time: c.year }),
    euGeoMap('ef_lus_main', { ...FSS_TOTAL, crops: 'J0000T', unit: 'HA', time: c.year }),
  ]);

  const C = rollup(cattle, c.cntr, regionCodes, c.regionCodeLen);
  const U = rollup(uaa, c.cntr, regionCodes, c.regionCodeLen);
  const A = rollup(ara, c.cntr, regionCodes, c.regionCodeLen);
  const G = rollup(grass, c.cntr, regionCodes, c.regionCodeLen);

  const r1 = (n) => Math.round(n * 10) / 10;
  const r2 = (n) => Math.round(n * 100) / 100;
  const regions = {};
  for (const code of regionCodes) {
    const uaaHa = U[code] || 0;
    if (!uaaHa) continue;
    regions[code] = {
      cattle: r1((C[code] || 0) / 1000),
      cattle_density: r2((C[code] || 0) / uaaHa),
      uaa: r1(uaaHa / 1000),
      uaa_share: Math.round((100 * uaaHa) / (areaKm2[code] * 100)),
      arable_share: Math.round((100 * (A[code] || 0)) / uaaHa),
      grassland_share: Math.round((100 * (G[code] || 0)) / uaaHa),
    };
  }

  const nutsLbl = c.regionLevel === 1 ? 'NUTS1' : 'NUTS2';
  const aggNote = c.regionLevel === 1 ? 'Agregace NUTS-2→NUTS-1.' : c.regionNote ? 'NUTS-2, PL9 = součet PL91 + PL92.' : 'Přímo na NUTS-2 (bez agregace).';
  const out = {
    _comment: `Regionální zemědělská data ${c.slug} (${nutsLbl} régiony). Zdroj: Eurostat FSS ${c.year}; uaa_share = UAA / úřední rozloha (reg_area3). ${aggNote}`,
    slug: c.slug,
    level: nutsLbl,
    ...(c.regionNote ? { regionNote: c.regionNote } : {}),
    year: Number(c.year),
    source: `Eurostat — Farm Structure Survey ${c.year} (ef_lsk_main, ef_lus_main)`,
    sourceUrl: 'https://ec.europa.eu/eurostat/databrowser/product/page/ef_lsk_main',
    metrics: METRICS,
    regions,
  };
  const outPath = `src/data/svet/regions/${c.slug}.json`;
  writeFileSync(outPath, JSON.stringify(out, null, 0) + '\n');
  console.log(`${c.slug}: ${Object.keys(regions).length} régionů × ${METRICS.length} metrik → ${outPath}`);
}
