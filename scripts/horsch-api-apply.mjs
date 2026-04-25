#!/usr/bin/env node
// Apply Horsch scraped data → src/data/stroje/horsch.yaml.
//
// Maps Horsch EN category tree → CZ subcategory enum, deduplicates.
// Tech specs (year, hp, image_url) NOT filled.
//
// Categories filtered out:
//   - digital / smart-farming (SW, telematika)
//   - parts / accessories
//
// Usage: node scripts/horsch-api-apply.mjs

import { readFileSync, writeFileSync } from 'node:fs';

const DATA_PATH = 'scripts/horsch-api-data.json';
const YAML_PATH = 'src/data/stroje/horsch.yaml';

// Map Horsch EN path prefix → CZ subcategory.
// Horsch uses /en/products/<category>/<series>.
// Likely categories: seeding, soil-cultivation, crop-care (sprayers).
// Series: Pronto, Maestro, Avatar, Focus, Sprinter, Express, Tiger,
// Terrano, Cruiser, Joker, Finer, Leeb.
//
// Most specific prefixes first.
const MAPPING = [
  // === Soil cultivation ===
  // Tiger = deep tillage / hluboké kypřiče
  { match: 'soil-cultivation/tiger', cz_category: 'zpracovani-pudy', cz_subcategory: 'kyprice', cz_label: 'Hloubkové kypřiče' },
  // Terrano = stubble cultivator with tines (radličkové podmítače)
  { match: 'soil-cultivation/terrano', cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-radlickove', cz_label: 'Radličkové podmítače' },
  // Cruiser = light shallow tine cultivator
  { match: 'soil-cultivation/cruiser', cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-radlickove', cz_label: 'Radličkové podmítače' },
  // Joker = compact disc harrow / diskový podmítač
  { match: 'soil-cultivation/joker', cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-diskove', cz_label: 'Diskové podmítače' },
  // Finer = seedbed combination / kompaktomat
  { match: 'soil-cultivation/finer', cz_category: 'zpracovani-pudy', cz_subcategory: 'kompaktomaty', cz_label: 'Kompaktomaty' },

  // === Seeding ===
  // Maestro = precision drill (single-grain)
  { match: 'seeding/maestro', cz_category: 'seti', cz_subcategory: 'seci-stroje-presne', cz_label: 'Přesné secí stroje' },
  // Pronto = pneumatic universal drill (most common Horsch flagship)
  { match: 'seeding/pronto', cz_category: 'seti', cz_subcategory: 'seci-stroje-pneumaticke', cz_label: 'Pneumatické secí stroje' },
  // Avatar = direct seed drill (single-disc, no-till)
  { match: 'seeding/avatar', cz_category: 'seti', cz_subcategory: 'seci-stroje-pneumaticke', cz_label: 'Pneumatické secí stroje' },
  // Focus = strip-till + sowing (kombinace)
  { match: 'seeding/focus', cz_category: 'seti', cz_subcategory: 'seci-kombinace', cz_label: 'Secí kombinace' },
  // Sprinter = tine seed drill
  { match: 'seeding/sprinter', cz_category: 'seti', cz_subcategory: 'seci-stroje-pneumaticke', cz_label: 'Pneumatické secí stroje' },
  // Express = compact seed drill (mounted/rigid)
  { match: 'seeding/express', cz_category: 'seti', cz_subcategory: 'seci-kombinace', cz_label: 'Secí kombinace' },
  // Versa = electric drive seed drill (newer)
  { match: 'seeding/versa', cz_category: 'seti', cz_subcategory: 'seci-stroje-pneumaticke', cz_label: 'Pneumatické secí stroje' },
  // Serto = mounted compact tine drill
  { match: 'seeding/serto', cz_category: 'seti', cz_subcategory: 'seci-kombinace', cz_label: 'Secí kombinace' },
  // Generic seeding fallback
  { match: 'seeding', cz_category: 'seti', cz_subcategory: 'seci-stroje-pneumaticke', cz_label: 'Pneumatické secí stroje' },

  // === Crop care (sprayers) ===
  // Leeb LT / GS / VL / 4 / 6 / 8 = trailed sprayers
  { match: 'crop-care/leeb-lt', cz_category: 'ochrana-rostlin', cz_subcategory: 'postrikovace-tazene', cz_label: 'Tažené postřikovače' },
  { match: 'crop-care/leeb-gs', cz_category: 'ochrana-rostlin', cz_subcategory: 'postrikovace-tazene', cz_label: 'Tažené postřikovače' },
  { match: 'crop-care/leeb-4', cz_category: 'ochrana-rostlin', cz_subcategory: 'postrikovace-tazene', cz_label: 'Tažené postřikovače' },
  { match: 'crop-care/leeb-6', cz_category: 'ochrana-rostlin', cz_subcategory: 'postrikovace-tazene', cz_label: 'Tažené postřikovače' },
  { match: 'crop-care/leeb-8', cz_category: 'ochrana-rostlin', cz_subcategory: 'postrikovace-tazene', cz_label: 'Tažené postřikovače' },
  { match: 'crop-care/leeb-vl', cz_category: 'ochrana-rostlin', cz_subcategory: 'postrikovace-samojizdne', cz_label: 'Samojízdné postřikovače' },
  { match: 'crop-care/leeb-vn', cz_category: 'ochrana-rostlin', cz_subcategory: 'postrikovace-samojizdne', cz_label: 'Samojízdné postřikovače' },
  { match: 'crop-care/leeb-pt', cz_category: 'ochrana-rostlin', cz_subcategory: 'postrikovace-samojizdne', cz_label: 'Samojízdné postřikovače' },
  { match: 'crop-care/leeb-ax', cz_category: 'ochrana-rostlin', cz_subcategory: 'postrikovace-samojizdne', cz_label: 'Samojízdné postřikovače' },
  // Generic Leeb / crop-care fallback
  { match: 'crop-care/leeb', cz_category: 'ochrana-rostlin', cz_subcategory: 'postrikovace-tazene', cz_label: 'Tažené postřikovače' },
  { match: 'crop-care', cz_category: 'ochrana-rostlin', cz_subcategory: 'postrikovace-tazene', cz_label: 'Tažené postřikovače' },
];

const SKIP_CATEGORIES = new Set(['digital', 'smart-farming', 'parts', 'accessories', 'service', 'farming-of-the-future']);
const SKIP_SUBCATEGORIES = new Set(['equipment', 'apps', 'licenses']);

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
          description: `${seriesName} — ${mapping.cz_label.toLowerCase()} značky Horsch.`,
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
