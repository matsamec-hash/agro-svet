// Build regionálních zemědělských dat pro choropleth mapy /svet/[slug]/.
// Zdroj: Eurostat Farm Structure Survey (NUTS-2, 2020) — ef_lsk_main (stavy zvířat),
// ef_lus_main (využití půdy). Data se agregují na NUTS-1 (régiony) prefixem kódu.
// Pozn.: výnosy plodin (t/ha) Eurostat na úrovni régionů FR nemá (jen národní),
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

/** Sečti NUTS-2 hodnoty do NUTS-1 (prefix 3 znaky), jen zadané régiony. */
function rollup(map, cntr, regionCodes) {
  const o = {};
  for (const [code, v] of Object.entries(map)) {
    if (!code.startsWith(cntr) || code.length !== 4) continue;
    const r = code.slice(0, 3);
    if (!regionCodes.has(r)) continue;
    o[r] = (o[r] || 0) + v;
  }
  return o;
}

const COUNTRIES = [
  { slug: 'francie', cntr: 'FR', year: '2020' },
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

  const C = rollup(cattle, c.cntr, regionCodes);
  const U = rollup(uaa, c.cntr, regionCodes);
  const A = rollup(ara, c.cntr, regionCodes);
  const G = rollup(grass, c.cntr, regionCodes);

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

  const out = {
    _comment: `Regionální zemědělská data ${c.slug} (NUTS-1 régiony). Zdroj: Eurostat FSS ${c.year}. Agregace NUTS-2→NUTS-1.`,
    slug: c.slug,
    level: 'NUTS1',
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
