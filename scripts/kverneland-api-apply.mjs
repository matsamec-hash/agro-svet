#!/usr/bin/env node
// Apply Kverneland scraped data → src/data/stroje/kverneland.yaml.
//
// Maps Kverneland EN category tree → CZ subcategory enum, deduplicates,
// uses page-title-extracted names. Tech specs (year, hp, image_url) NOT filled.
//
// Categories filtered out:
//   - precision-farming / iM Farming (telematics/SW)
//   - parts / accessories
//   - Vicon-branded entries (already filtered in scrape stage)
//
// Usage: node scripts/kverneland-api-apply.mjs

import { readFileSync, writeFileSync } from 'node:fs';

const DATA_PATH = 'scripts/kverneland-api-data.json';
const YAML_PATH = 'src/data/stroje/kverneland.yaml';

// Map Kverneland EN path prefix → CZ subcategory.
// Most specific paths first.
const MAPPING = [
  // Pluhy — klasická Kverneland doména
  { match: 'soil/ploughs/mounted-reversible', cz_category: 'zpracovani-pudy', cz_subcategory: 'pluhy', cz_label: 'Nesené otočné pluhy' },
  { match: 'soil/ploughs/semi-mounted-reversible', cz_category: 'zpracovani-pudy', cz_subcategory: 'pluhy', cz_label: 'Polonesené otočné pluhy' },
  { match: 'soil/ploughs/trailed-reversible', cz_category: 'zpracovani-pudy', cz_subcategory: 'pluhy', cz_label: 'Tažené otočné pluhy' },
  { match: 'soil/ploughs/conventional', cz_category: 'zpracovani-pudy', cz_subcategory: 'pluhy', cz_label: 'Klasické pluhy' },
  { match: 'soil/ploughs', cz_category: 'zpracovani-pudy', cz_subcategory: 'pluhy', cz_label: 'Pluhy' },
  { match: 'soil/disc-harrows/qualidisc', cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-diskove', cz_label: 'Diskové podmítače Qualidisc' },
  { match: 'soil/disc-harrows', cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-diskove', cz_label: 'Diskové podmítače' },
  { match: 'soil/cultivators/enduro', cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-radlickove', cz_label: 'Radličkové podmítače Enduro' },
  { match: 'soil/cultivators/ctc', cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-radlickove', cz_label: 'Radličkové podmítače CTC' },
  { match: 'soil/cultivators', cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-radlickove', cz_label: 'Radličkové podmítače' },
  { match: 'soil/power-harrows', cz_category: 'zpracovani-pudy', cz_subcategory: 'rotacni-brany', cz_label: 'Rotační brány' },
  { match: 'soil/seedbed-cultivators', cz_category: 'zpracovani-pudy', cz_subcategory: 'kompaktomaty', cz_label: 'Kompaktomaty' },
  { match: 'soil/rollers', cz_category: 'zpracovani-pudy', cz_subcategory: 'valce', cz_label: 'Válce' },
  { match: 'soil/subsoilers', cz_category: 'zpracovani-pudy', cz_subcategory: 'kyprice', cz_label: 'Hlubinné kypřiče' },
  { match: 'soil', cz_category: 'zpracovani-pudy', cz_subcategory: 'pluhy', cz_label: 'Zpracování půdy' },
  // Setí
  { match: 'seeding/precision-drills/optima', cz_category: 'seti', cz_subcategory: 'seci-stroje-presne', cz_label: 'Přesné secí stroje Optima' },
  { match: 'seeding/precision-drills', cz_category: 'seti', cz_subcategory: 'seci-stroje-presne', cz_label: 'Přesné secí stroje' },
  { match: 'seeding/seed-drills/e-drill', cz_category: 'seti', cz_subcategory: 'seci-stroje-pneumaticke', cz_label: 'Pneumatické secí stroje e-drill' },
  { match: 'seeding/seed-drills/u-drill', cz_category: 'seti', cz_subcategory: 'seci-stroje-pneumaticke', cz_label: 'Pneumatické secí stroje u-drill' },
  { match: 'seeding/seed-drills/accord', cz_category: 'seti', cz_subcategory: 'seci-stroje-pneumaticke', cz_label: 'Pneumatické secí stroje Accord' },
  { match: 'seeding/seed-drills/mechanical', cz_category: 'seti', cz_subcategory: 'seci-stroje-mechanicke', cz_label: 'Mechanické secí stroje' },
  { match: 'seeding/seed-drills', cz_category: 'seti', cz_subcategory: 'seci-stroje-pneumaticke', cz_label: 'Secí stroje' },
  { match: 'seeding/seeding-combinations', cz_category: 'seti', cz_subcategory: 'seci-kombinace', cz_label: 'Secí kombinace' },
  { match: 'seeding', cz_category: 'seti', cz_subcategory: 'seci-stroje-pneumaticke', cz_label: 'Setí' },
  // Hnojení
  { match: 'spreading/fertiliser-spreaders/exacta', cz_category: 'hnojeni', cz_subcategory: 'rozmetadla-mineralni', cz_label: 'Rozmetadla Exacta' },
  { match: 'spreading/fertiliser-spreaders', cz_category: 'hnojeni', cz_subcategory: 'rozmetadla-mineralni', cz_label: 'Rozmetadla minerálních hnojiv' },
  { match: 'spreading', cz_category: 'hnojeni', cz_subcategory: 'rozmetadla-mineralni', cz_label: 'Rozmetadla' },
  { match: 'fertilising', cz_category: 'hnojeni', cz_subcategory: 'rozmetadla-mineralni', cz_label: 'Rozmetadla minerálních hnojiv' },
  // Postřikovače
  { match: 'spraying/mounted-sprayers/ixter', cz_category: 'ochrana-rostlin', cz_subcategory: 'postrikovace-nesene', cz_label: 'Nesené postřikovače iXter' },
  { match: 'spraying/mounted-sprayers', cz_category: 'ochrana-rostlin', cz_subcategory: 'postrikovace-nesene', cz_label: 'Nesené postřikovače' },
  { match: 'spraying/trailed-sprayers/ixtrack', cz_category: 'ochrana-rostlin', cz_subcategory: 'postrikovace-tazene', cz_label: 'Tažené postřikovače iXtrack' },
  { match: 'spraying/trailed-sprayers', cz_category: 'ochrana-rostlin', cz_subcategory: 'postrikovace-tazene', cz_label: 'Tažené postřikovače' },
  { match: 'spraying/self-propelled-sprayers/ixdrive', cz_category: 'ochrana-rostlin', cz_subcategory: 'postrikovace-samojizdne', cz_label: 'Samojízdné postřikovače iXdrive' },
  { match: 'spraying/self-propelled-sprayers', cz_category: 'ochrana-rostlin', cz_subcategory: 'postrikovace-samojizdne', cz_label: 'Samojízdné postřikovače' },
  { match: 'spraying', cz_category: 'ochrana-rostlin', cz_subcategory: 'postrikovace-nesene', cz_label: 'Postřikovače' },
  // Sklizeň pícnin (Kverneland-branded; Vicon filtered separately)
  { match: 'forage/mowers', cz_category: 'sklizen-picnin', cz_subcategory: 'zaci-stroje', cz_label: 'Žací stroje' },
  { match: 'forage/tedders', cz_category: 'sklizen-picnin', cz_subcategory: 'obracece', cz_label: 'Obraceče' },
  { match: 'forage/rakes', cz_category: 'sklizen-picnin', cz_subcategory: 'shrnovace', cz_label: 'Shrnovače' },
  { match: 'forage/round-balers', cz_category: 'sklizen-picnin', cz_subcategory: 'lisy-valcove', cz_label: 'Válcové lisy' },
  { match: 'forage/wrappers', cz_category: 'sklizen-picnin', cz_subcategory: 'obalovace', cz_label: 'Balíkovače' },
  { match: 'forage', cz_category: 'sklizen-picnin', cz_subcategory: 'zaci-stroje', cz_label: 'Sklizeň pícnin' },
];

const SKIP_CATEGORIES = new Set([
  'precision-farming', 'im-farming', 'farm-management', 'isobus',
  'parts', 'service', 'accessories', 'spare-parts',
  'company', 'about', 'news', 'media', 'events',
]);
const SKIP_SUBCATEGORIES = new Set([
  'tellus', 'gps', 'isomatch', 'guidance',
  'monitors', 'terminals', 'options',
]);

function findMapping(catPath) {
  for (const m of MAPPING) {
    if (catPath === m.match || catPath.startsWith(m.match + '/')) return m;
  }
  return null;
}

function escapeYaml(s) {
  if (/[:#&*!|>'"%@`]/.test(s) || /^[\s-]/.test(s)) return `"${s.replace(/"/g, '\\"')}"`;
  return s;
}

function buildYaml(grouped, headerLines) {
  const out = [...headerLines, 'categories:'];
  for (const cz_cat of Object.keys(grouped).sort()) {
    out.push(`  ${cz_cat}:`);
    out.push(`    name: ${escapeYaml(grouped[cz_cat].name)}`);
    out.push(`    series:`);
    const sortedSeries = grouped[cz_cat].series.sort((a, b) => a.slug.localeCompare(b.slug));
    for (const series of sortedSeries) {
      out.push(`      - slug: ${series.slug}`);
      out.push(`        name: ${escapeYaml(series.name)}`);
      out.push(`        family: ${series.family}`);
      out.push(`        subcategory: ${series.subcategory}`);
      if (series.url) out.push(`        url: ${series.url}`);
      out.push(`        description: |`);
      out.push(`          ${series.description}`);
      if (series.models && series.models.length > 0) {
        out.push(`        models:`);
        for (const model of series.models) {
          out.push(`          - slug: ${model.slug}`);
          out.push(`            name: ${escapeYaml(model.name)}`);
          if (model.tagline) out.push(`            tagline: ${escapeYaml(model.tagline)}`);
          out.push(`            url: ${model.url}`);
        }
      }
    }
  }
  return out.join('\n') + '\n';
}

function cz_category_name(slug) {
  const NAMES = {
    'zpracovani-pudy': 'Zpracování půdy',
    'seti': 'Setí a sázení',
    'hnojeni': 'Hnojení',
    'ochrana-rostlin': 'Ochrana rostlin',
    'sklizen-picnin': 'Sklizeň pícnin a slámy',
  };
  return NAMES[slug] || slug;
}

function main() {
  const data = JSON.parse(readFileSync(DATA_PATH, 'utf8'));

  const grouped = {};
  let mapped = 0, skipped = 0;
  const skippedSamples = [];

  for (const enCat of Object.keys(data)) {
    if (SKIP_CATEGORIES.has(enCat)) {
      const n = countModels(data[enCat]);
      skipped += n;
      if (skippedSamples.length < 4) skippedSamples.push(`category ${enCat}: ${n}`);
      continue;
    }
    for (const enSub of Object.keys(data[enCat])) {
      if (SKIP_SUBCATEGORIES.has(enSub)) {
        const n = countModels({ x: data[enCat][enSub] });
        skipped += n;
        continue;
      }
      const subPath = enSub === '_root' ? enCat : `${enCat}/${enSub}`;

      for (const familySlug of Object.keys(data[enCat][enSub])) {
        const family = data[enCat][enSub][familySlug];
        const familyPath = `${subPath}/${familySlug.split('/')[0]}`;

        const mapping = findMapping(familyPath) || findMapping(subPath);
        if (!mapping) {
          skipped += family.models.length;
          if (skippedSamples.length < 6) skippedSamples.push(`unmapped: ${subPath}/${familySlug}`);
          continue;
        }

        if (!grouped[mapping.cz_category]) {
          grouped[mapping.cz_category] = {
            name: cz_category_name(mapping.cz_category),
            series: [],
          };
        }

        const cleanFamilySlug = familySlug.split('/').pop();
        let seriesName;
        if (family.models.length === 1) {
          seriesName = family.models[0].name;
        } else {
          const firstModelName = family.models[0]?.name || '';
          seriesName = firstModelName.split(/\s+/)[0] || cleanFamilySlug;
        }

        const existing = grouped[mapping.cz_category].series.find((s) => s.slug === cleanFamilySlug);
        const target = existing || {
          slug: cleanFamilySlug,
          name: seriesName,
          family: cleanFamilySlug,
          subcategory: mapping.cz_subcategory,
          url: '',
          description: `${seriesName} — ${mapping.cz_label.toLowerCase()} značky Kverneland.`,
          models: [],
        };

        for (const model of family.models) {
          if (!target.models.find((m) => m.slug === model.slug)) {
            target.models.push({
              slug: model.slug,
              name: model.name,
              tagline: model.tagline || '',
              url: model.url,
            });
            mapped++;
          }
        }

        if (!existing) grouped[mapping.cz_category].series.push(target);
      }
    }
  }

  console.error(`Mapped: ${mapped} models`);
  console.error(`Skipped: ${skipped} models`);
  if (skippedSamples.length) skippedSamples.forEach((s) => console.error(`  - ${s}`));
  console.error('');
  for (const cat of Object.keys(grouped)) {
    const series = grouped[cat].series;
    const totalModels = series.reduce((acc, s) => acc + s.models.length, 0);
    console.error(`  ${cat}: ${series.length} series, ${totalModels} models`);
  }

  // Preserve YAML header
  const existing = readFileSync(YAML_PATH, 'utf8').split('\n');
  const headerLines = [];
  for (const line of existing) {
    if (line.startsWith('categories:')) break;
    headerLines.push(line);
  }
  while (headerLines.length > 0 && !headerLines[headerLines.length - 1].trim()) headerLines.pop();

  const yaml = buildYaml(grouped, headerLines);
  writeFileSync(YAML_PATH, yaml);
  console.error(`\nWrote ${YAML_PATH}`);
}

function countModels(obj) {
  if (!obj || typeof obj !== 'object') return 0;
  if (Array.isArray(obj.models)) return obj.models.length;
  let n = 0;
  for (const k of Object.keys(obj)) n += countModels(obj[k]);
  return n;
}

main();
