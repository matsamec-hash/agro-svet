#!/usr/bin/env node
// Apply Amazone scraped data → src/data/stroje/amazone.yaml.
// Adapted from scripts/lemken-api-apply.mjs.
//
// Maps Amazone EN/DE category tree → CZ subcategory enum, deduplicates,
// uses page-title-extracted names. Tech specs (year, hp, image_url) NOT filled.
//
// Usage: node scripts/amazone-api-apply.mjs

import { readFileSync, writeFileSync } from 'node:fs';

const DATA_PATH = 'scripts/amazone-api-data.json';
const YAML_PATH = 'src/data/stroje/amazone.yaml';

// Map Amazone EN/DE path prefix → CZ subcategory.
// Most specific paths first. Both DE (saemaschinen, bodenbearbeitung,…) and
// EN (sowing-technology, soil-tillage,…) variants accepted; the apply script
// matches on full familyPath / subPath after lowercasing.
const MAPPING = [
  // === Setí (DE) ===
  { match: 'saemaschinen/mechanische-saemaschinen', cz_category: 'seti', cz_subcategory: 'seci-stroje-mechanicke', cz_label: 'Mechanické secí stroje' },
  { match: 'saemaschinen/pneumatische-saemaschinen', cz_category: 'seti', cz_subcategory: 'seci-stroje-pneumaticke', cz_label: 'Pneumatické secí stroje' },
  { match: 'saemaschinen/saekombinationen', cz_category: 'seti', cz_subcategory: 'seci-kombinace', cz_label: 'Secí kombinace' },
  { match: 'saemaschinen/einzelkornsaemaschinen', cz_category: 'seti', cz_subcategory: 'seci-stroje-presne', cz_label: 'Přesné secí stroje' },
  { match: 'saemaschinen', cz_category: 'seti', cz_subcategory: 'seci-stroje-pneumaticke', cz_label: 'Secí stroje' },
  // === Setí (EN) ===
  { match: 'seed-drills/mechanical-seed-drills', cz_category: 'seti', cz_subcategory: 'seci-stroje-mechanicke', cz_label: 'Mechanické secí stroje' },
  { match: 'seed-drills/pneumatic-seed-drills', cz_category: 'seti', cz_subcategory: 'seci-stroje-pneumaticke', cz_label: 'Pneumatické secí stroje' },
  { match: 'seed-drills/seed-drill-combinations', cz_category: 'seti', cz_subcategory: 'seci-kombinace', cz_label: 'Secí kombinace' },
  { match: 'precision-air-seeders', cz_category: 'seti', cz_subcategory: 'seci-stroje-presne', cz_label: 'Přesné secí stroje' },
  { match: 'sowing-technology', cz_category: 'seti', cz_subcategory: 'seci-stroje-pneumaticke', cz_label: 'Secí stroje' },
  { match: 'seed-drills', cz_category: 'seti', cz_subcategory: 'seci-stroje-pneumaticke', cz_label: 'Secí stroje' },
  // === Hnojení (DE) ===
  { match: 'duengung/duengerstreuer/grossflaechenstreuer', cz_category: 'hnojeni', cz_subcategory: 'rozmetadla-mineralni', cz_label: 'Velkoplošná rozmetadla' },
  { match: 'duengung/duengerstreuer', cz_category: 'hnojeni', cz_subcategory: 'rozmetadla-mineralni', cz_label: 'Rozmetadla minerálních hnojiv' },
  { match: 'duengetechnik', cz_category: 'hnojeni', cz_subcategory: 'rozmetadla-mineralni', cz_label: 'Hnojicí technika' },
  // === Hnojení (EN) ===
  { match: 'fertiliser-spreaders/large-area-spreaders', cz_category: 'hnojeni', cz_subcategory: 'rozmetadla-mineralni', cz_label: 'Velkoplošná rozmetadla' },
  { match: 'fertiliser-spreaders', cz_category: 'hnojeni', cz_subcategory: 'rozmetadla-mineralni', cz_label: 'Rozmetadla minerálních hnojiv' },
  { match: 'fertiliser-spreading', cz_category: 'hnojeni', cz_subcategory: 'rozmetadla-mineralni', cz_label: 'Hnojicí technika' },
  { match: 'fertilising-technology', cz_category: 'hnojeni', cz_subcategory: 'rozmetadla-mineralni', cz_label: 'Hnojicí technika' },
  // === Postřikovače (DE) ===
  { match: 'pflanzenschutz/anbauspritzen', cz_category: 'ochrana-rostlin', cz_subcategory: 'postrikovace-nesene', cz_label: 'Nesené postřikovače' },
  { match: 'pflanzenschutz/anhaengespritzen', cz_category: 'ochrana-rostlin', cz_subcategory: 'postrikovace-tazene', cz_label: 'Tažené postřikovače' },
  { match: 'pflanzenschutz/selbstfahrende-spritzen', cz_category: 'ochrana-rostlin', cz_subcategory: 'postrikovace-samojizdne', cz_label: 'Samojízdné postřikovače' },
  { match: 'pflanzenschutz', cz_category: 'ochrana-rostlin', cz_subcategory: 'postrikovace-nesene', cz_label: 'Postřikovače' },
  // === Postřikovače (EN) ===
  { match: 'crop-protection/mounted-sprayers', cz_category: 'ochrana-rostlin', cz_subcategory: 'postrikovace-nesene', cz_label: 'Nesené postřikovače' },
  { match: 'crop-protection/trailed-sprayers', cz_category: 'ochrana-rostlin', cz_subcategory: 'postrikovace-tazene', cz_label: 'Tažené postřikovače' },
  { match: 'crop-protection/self-propelled-sprayers', cz_category: 'ochrana-rostlin', cz_subcategory: 'postrikovace-samojizdne', cz_label: 'Samojízdné postřikovače' },
  { match: 'crop-protection', cz_category: 'ochrana-rostlin', cz_subcategory: 'postrikovace-nesene', cz_label: 'Postřikovače' },
  // === Zpracování půdy (DE) ===
  { match: 'bodenbearbeitung/scheibeneggen', cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-diskove', cz_label: 'Diskové podmítače' },
  { match: 'bodenbearbeitung/grubber', cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-radlickove', cz_label: 'Radličkové podmítače' },
  { match: 'bodenbearbeitung/tiefenlockerer', cz_category: 'zpracovani-pudy', cz_subcategory: 'kyprice', cz_label: 'Hlubinné kypřiče' },
  { match: 'bodenbearbeitung/kreiseleggen', cz_category: 'zpracovani-pudy', cz_subcategory: 'rotacni-brany', cz_label: 'Rotační brány' },
  { match: 'bodenbearbeitung/saatbettkombinationen', cz_category: 'zpracovani-pudy', cz_subcategory: 'kompaktomaty', cz_label: 'Kompaktomaty' },
  { match: 'bodenbearbeitung/walzen', cz_category: 'zpracovani-pudy', cz_subcategory: 'valce', cz_label: 'Válce a presy' },
  { match: 'bodenbearbeitung', cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-diskove', cz_label: 'Zpracování půdy' },
  // === Zpracování půdy (EN) ===
  { match: 'soil-tillage/disc-harrows', cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-diskove', cz_label: 'Diskové podmítače' },
  { match: 'soil-tillage/cultivators', cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-radlickove', cz_label: 'Radličkové podmítače' },
  { match: 'soil-tillage/deep-loosener', cz_category: 'zpracovani-pudy', cz_subcategory: 'kyprice', cz_label: 'Hlubinné kypřiče' },
  { match: 'soil-tillage/rotary-cultivators', cz_category: 'zpracovani-pudy', cz_subcategory: 'rotacni-brany', cz_label: 'Rotační brány' },
  { match: 'soil-tillage/seedbed-combinations', cz_category: 'zpracovani-pudy', cz_subcategory: 'kompaktomaty', cz_label: 'Kompaktomaty' },
  { match: 'soil-tillage/rollers', cz_category: 'zpracovani-pudy', cz_subcategory: 'valce', cz_label: 'Válce a presy' },
  { match: 'soil-tillage', cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-diskove', cz_label: 'Zpracování půdy' },
];

// Categories filtered out (ICT/digital, parts, used machines, communal/garden lines).
const SKIP_CATEGORIES = new Set([
  'amatron', 'isobus', 'softwarelosungen', 'software-solutions',
  'digital-solutions', 'connected-services', 'smart-farming',
  'gebrauchtmaschinen', 'used-machines', 'ersatzteile', 'spare-parts',
  'kommunaltechnik', 'municipal-technology', 'park-equipment',
  'gartentechnik', 'garden-equipment', 'profihopper',
]);

const SKIP_SUBCATEGORIES = new Set([
  'amatron', 'isobus', 'gps', 'terminals', 'lenksysteme', 'steering-systems',
  'sensoren', 'sensors', 'apps', 'datenmanagement', 'data-management',
]);

function findMapping(catPath) {
  const lc = catPath.toLowerCase();
  for (const m of MAPPING) {
    if (lc === m.match || lc.startsWith(m.match + '/')) return m;
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
  };
  return NAMES[slug] || slug;
}

function main() {
  const data = JSON.parse(readFileSync(DATA_PATH, 'utf8'));

  const grouped = {};
  let mapped = 0, skipped = 0;
  const skippedSamples = [];

  for (const enCat of Object.keys(data)) {
    if (SKIP_CATEGORIES.has(enCat.toLowerCase())) {
      const n = countModels(data[enCat]);
      skipped += n;
      if (skippedSamples.length < 4) skippedSamples.push(`category ${enCat}: ${n}`);
      continue;
    }
    for (const enSub of Object.keys(data[enCat])) {
      if (SKIP_SUBCATEGORIES.has(enSub.toLowerCase())) {
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
          description: `${seriesName} — ${mapping.cz_label.toLowerCase()} značky Amazone.`,
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
