// Build regionálních zemědělských dat pro choropleth mapy /svet/[slug]/.
// Zdroj: Eurostat Farm Structure Survey (NUTS-2, 2020) — ef_lsk_main (stavy zvířat),
// ef_lus_main (využití půdy). Data jsou vždy na NUTS-2; „régiony" mají per zemi jinou úroveň:
//   FR/DE régiony = NUTS-1 (regionCodeLen 3) → agregace NUTS-2 prefixem code.slice(0,3)
//   PL   régiony = NUTS-2 (regionCodeLen 4) → bez agregace, code.slice(0,4) = celý kód
// Pozn.: výnosy plodin (t/ha) Eurostat na úrovni régionů nemá (jen národní),
// proto metriky vychází z FSS (plochy, stavy) — regionálně bohatě populované.
//
// Spuštění: node scripts/build-svet-regions.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const EU = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data';

async function euGeoMap(dataset, params) {
  const q = Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&');
  const r = await fetch(`${EU}/${dataset}?format=JSON&lang=EN&${q}`);
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
    const r = code.slice(0, regionCodeLen);
    if (!regionCodes.has(r)) continue;
    o[r] = (o[r] || 0) + v;
  }
  return o;
}

const COUNTRIES = [
  { slug: 'francie', cntr: 'FR', year: '2020', regionLevel: 1, regionCodeLen: 3 },
  { slug: 'nemecko', cntr: 'DE', year: '2020', regionLevel: 1, regionCodeLen: 3 },
  { slug: 'polsko', cntr: 'PL', year: '2020', regionLevel: 2, regionCodeLen: 4 },
  { slug: 'slovensko', cntr: 'SK', year: '2020', regionLevel: 2, regionCodeLen: 4 },
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
  const areaKm2 = Object.fromEntries(geo.regions.map((r) => [r.code, r.areaKm2]));

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
  const aggNote = c.regionLevel === 1 ? 'Agregace NUTS-2→NUTS-1.' : 'Přímo na NUTS-2 (bez agregace).';
  const out = {
    _comment: `Regionální zemědělská data ${c.slug} (${nutsLbl} régiony). Zdroj: Eurostat FSS ${c.year}. ${aggNote}`,
    slug: c.slug,
    level: nutsLbl,
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
