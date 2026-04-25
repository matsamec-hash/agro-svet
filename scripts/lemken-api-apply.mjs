#!/usr/bin/env node
// Apply Lemken scraped data → src/data/stroje/lemken.yaml.
//
// Maps Lemken EN category tree → CZ subcategory enum, deduplicates,
// uses page-title-extracted names (e.g. "Diamant 16" instead of slug-derived
// "Diamant-16"). Tech specs (year, hp, image_url) NOT filled.
//
// Categories filtered out:
//   - iqblue (telematics/SW)
//   - equipment sub-cats (accessories)
//   - cropcare (Lemken's chemical/mechanical weed control + sprayers don't
//     fit cleanly into agro-svet's `ochrana-rostlin` postřikovač categories)
//
// Usage: node scripts/lemken-api-apply.mjs

import { readFileSync, writeFileSync } from 'node:fs';

const DATA_PATH = 'scripts/lemken-api-data.json';
const YAML_PATH = 'src/data/stroje/lemken.yaml';

// Map Lemken EN path prefix → CZ subcategory.
// Most specific paths first.
const MAPPING = [
  { match: 'soil-cultivation/ploughing', cz_category: 'zpracovani-pudy', cz_subcategory: 'pluhy', cz_label: 'Pluhy' },
  { match: 'soil-cultivation/stubble-cultivation/compact-disc-harrows', cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-diskove', cz_label: 'Diskové podmítače' },
  { match: 'soil-cultivation/stubble-cultivation/cultivators', cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-radlickove', cz_label: 'Radličkové podmítače' },
  { match: 'soil-cultivation/stubble-cultivation/subsoiler', cz_category: 'zpracovani-pudy', cz_subcategory: 'kyprice', cz_label: 'Hlubinné kypřiče' },
  { match: 'soil-cultivation/stubble-cultivation/system-carrier', cz_category: 'zpracovani-pudy', cz_subcategory: 'kyprice', cz_label: 'Systémové kypřiče' },
  { match: 'soil-cultivation/seedbed-preparation/power-harrows', cz_category: 'zpracovani-pudy', cz_subcategory: 'rotacni-brany', cz_label: 'Rotační brány' },
  { match: 'soil-cultivation/seedbed-preparation/seedbed-combinations', cz_category: 'zpracovani-pudy', cz_subcategory: 'kompaktomaty', cz_label: 'Kompaktomaty' },
  { match: 'soil-cultivation/reconsolidation', cz_category: 'zpracovani-pudy', cz_subcategory: 'valce', cz_label: 'Válce a presy' },
  { match: 'sowing/seed-drills/mechanical-seed-drills', cz_category: 'seti', cz_subcategory: 'seci-stroje-mechanicke', cz_label: 'Mechanické secí stroje' },
  { match: 'sowing/seed-drills/pneumatic-seed-drills', cz_category: 'seti', cz_subcategory: 'seci-stroje-pneumaticke', cz_label: 'Pneumatické secí stroje' },
  { match: 'sowing/seed-drills/seeding-combinations', cz_category: 'seti', cz_subcategory: 'seci-kombinace', cz_label: 'Secí kombinace' },
  { match: 'sowing/precision-seeding', cz_category: 'seti', cz_subcategory: 'seci-stroje-presne', cz_label: 'Přesné secí stroje' },
  { match: 'sowing/direct-drilling', cz_category: 'seti', cz_subcategory: 'seci-stroje-pneumaticke', cz_label: 'Stroje pro přímé setí' },
  // Hnojení (cropcare obsahuje fertiliser spreaders Tauri/Spica/Polaris)
  { match: 'cropcare/fertiliser-spreaders', cz_category: 'hnojeni', cz_subcategory: 'rozmetadla-mineralni', cz_label: 'Rozmetadla minerálních hnojiv' },
];

const SKIP_CATEGORIES = new Set(['iqblue']);
const SKIP_SUBCATEGORIES = new Set(['equipment', 'apps', 'licenses', 'produkte', 'terminals-joysticks', 'assistance-systems-operating-systems', 'weed-control', 'application-technology-for-liquids']);

// Cropcare sub-cats — entire `cropcare` category is filtered above, but listed
// here for clarity / future re-enabling.
// 'application-technology-for-liquids' (sprayers — Sprayhub, Spraykit)
// 'fertiliser-spreaders' (Tauri, Spica, Polaris)
// 'weed-control' (mechanical/camera weed control)

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
        // Series name = capitalized family slug (e.g. "Diamant", "Zirkon")
        // — first model usually shares it; if family is single-model, use model name.
        let seriesName;
        if (family.models.length === 1) {
          seriesName = family.models[0].name;
        } else {
          // Use first word of model name as family name, e.g. "Diamant 16" → "Diamant"
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
          description: `${seriesName} — ${mapping.cz_label.toLowerCase()} značky Lemken.`,
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
