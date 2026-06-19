// Sestaví CountryProfile pro každou zemi: pro každý indikátor zavolá správný fetcher,
// aplikuje scale, vytvoří latest + series, ověří sanity, zapíše src/data/svet/<slug>.json.
import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { COUNTRIES } from './lib/svet/countries.mjs';
import { INDICATORS } from './lib/svet/indicators.mjs';
import { fetchEurostatSeries } from './lib/svet/eurostat.mjs';
import { fetchWorldBankSeries } from './lib/svet/worldbank.mjs';
import { sanityCheck } from './lib/svet/verify.mjs';

const OUT_DIR = fileURLToPath(new URL('../src/data/svet/', import.meta.url));
const today = new Date().toISOString().slice(0, 10);
const scaled = (s, k) => s.map((p) => ({ period: p.period, value: Math.round(p.value * (k ?? 1) * 1000) / 1000 }));

async function fetchIndicator(def, country) {
  const { spec } = def;
  if (spec.source === 'eurostat') {
    const { series, url } = await fetchEurostatSeries(spec.dataset, { ...spec.filters, geo: country.geo });
    return { series: scaled(series, spec.scale), url, label: spec.sourceLabel };
  }
  if (spec.source === 'worldbank') {
    const { series, url } = await fetchWorldBankSeries(country.wb, spec.indicator);
    return { series: scaled(series, spec.scale), url, label: spec.sourceLabel };
  }
  throw new Error(`Neznámý zdroj: ${spec.source}`);
}

async function buildCountry(country) {
  const indicators = {};
  const problems = [];
  for (const def of INDICATORS) {
    try {
      const { series, url, label } = await fetchIndicator(def, country);
      if (!series.length) { problems.push(`${country.slug}/${def.key}: prázdná řada`); continue; }
      const last = series[series.length - 1];
      const ind = {
        key: def.key, label: def.label, pkg: def.pkg, unit: def.unit,
        latest: { value: last.value, unit: def.unit, referencePeriod: last.period, source: label, sourceUrl: url, fetchedAt: today },
        series,
      };
      problems.push(...sanityCheck(ind));
      indicators[def.key] = ind;
    } catch (e) {
      problems.push(`${country.slug}/${def.key}: ${e.message}`);
    }
  }
  return { profile: { slug: country.slug, geo: country.geo, nameCs: country.nameCs, flag: country.flag, generated: today, indicators }, problems };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const allProblems = [];
  const index = [];
  for (const c of COUNTRIES) {
    const { profile, problems } = await buildCountry(c);
    allProblems.push(...problems);
    await writeFile(`${OUT_DIR}${c.slug}.json`, JSON.stringify(profile, null, 2) + '\n');
    index.push({ slug: c.slug, nameCs: c.nameCs, flag: c.flag, indicatorKeys: Object.keys(profile.indicators) });
    console.log(`✓ ${c.slug}: ${Object.keys(profile.indicators).length} indikátorů`);
  }
  await writeFile(`${OUT_DIR}index.json`, JSON.stringify({ generated: today, countries: index }, null, 2) + '\n');
  if (allProblems.length) {
    console.error(`\n⚠ ${allProblems.length} problémů k ověření:`);
    for (const p of allProblems) console.error('  - ' + p);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
