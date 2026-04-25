#!/usr/bin/env node
// Apply Väderstad scraped data → src/data/stroje/vaderstad.yaml.
//
// Maps Väderstad EN (UK) category tree → CZ subcategory enum, deduplicates,
// uses page-title-extracted names. Tech specs (year, hp, image_url) NOT filled.
//
// Usage: node scripts/vaderstad-api-apply.mjs

import { readFileSync, writeFileSync } from 'node:fs';

const DATA_PATH = 'scripts/vaderstad-api-data.json';
const YAML_PATH = 'src/data/stroje/vaderstad.yaml';

// Map Väderstad EN path prefix → CZ subcategory.
// Most specific paths first.
// Väderstad UK structure (based on /uk/products/):
//   - seed-drills/ (Rapid, Spirit, Inspire, Proceed)
//   - planters/ (Tempo) — precision seeders
//   - cultivators/ (Cultus, Opus, NZ) — radličkové
//   - disc-cultivators/ (Carrier, CrossCutter) — diskové podmítače
//   - one-pass-tillage/ (TopDown, Swift) — kombinované kypřiče
//   - seedbed-cultivators/ (NZ) — kompaktomaty / brány
//   - rollers/ (Rollex, Rexius)
//   - planting/ (alternative)
const MAPPING = [
  // Seed drills (mounted/trailed mechanical/pneumatic)
  { match: 'planters', cz_category: 'seti', cz_subcategory: 'seci-stroje-presne', cz_label: 'Přesné secí stroje' },
  { match: 'precision-planters', cz_category: 'seti', cz_subcategory: 'seci-stroje-presne', cz_label: 'Přesné secí stroje' },
  { match: 'precision-drills', cz_category: 'seti', cz_subcategory: 'seci-stroje-presne', cz_label: 'Přesné secí stroje' },
  { match: 'tempo', cz_category: 'seti', cz_subcategory: 'seci-stroje-presne', cz_label: 'Přesné secí stroje' },
  { match: 'seed-drills/mounted', cz_category: 'seti', cz_subcategory: 'seci-stroje-pneumaticke', cz_label: 'Pneumatické secí stroje' },
  { match: 'seed-drills/trailed', cz_category: 'seti', cz_subcategory: 'seci-kombinace', cz_label: 'Secí kombinace' },
  { match: 'seed-drills/inspire', cz_category: 'seti', cz_subcategory: 'seci-stroje-pneumaticke', cz_label: 'Pneumatické secí stroje' },
  { match: 'seed-drills/spirit', cz_category: 'seti', cz_subcategory: 'seci-kombinace', cz_label: 'Secí kombinace' },
  { match: 'seed-drills/rapid', cz_category: 'seti', cz_subcategory: 'seci-kombinace', cz_label: 'Secí kombinace' },
  { match: 'seed-drills/proceed', cz_category: 'seti', cz_subcategory: 'seci-stroje-presne', cz_label: 'Přesné secí stroje' },
  { match: 'seed-drills', cz_category: 'seti', cz_subcategory: 'seci-stroje-pneumaticke', cz_label: 'Pneumatické secí stroje' },
  { match: 'drills', cz_category: 'seti', cz_subcategory: 'seci-stroje-pneumaticke', cz_label: 'Pneumatické secí stroje' },
  // Disc cultivators (Carrier — diskové podmítače)
  { match: 'disc-cultivators', cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-diskove', cz_label: 'Diskové podmítače' },
  { match: 'carrier', cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-diskove', cz_label: 'Diskové podmítače' },
  { match: 'crosscutter', cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-diskove', cz_label: 'Diskové podmítače' },
  // Tine cultivators (Cultus — radličkové podmítače / Opus — kypřič)
  { match: 'cultivators/cultus', cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-radlickove', cz_label: 'Radličkové podmítače' },
  { match: 'cultivators/opus', cz_category: 'zpracovani-pudy', cz_subcategory: 'kyprice', cz_label: 'Hlubinné kypřiče' },
  { match: 'cultivators/swift', cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-radlickove', cz_label: 'Radličkové podmítače' },
  { match: 'cultivators/nz', cz_category: 'zpracovani-pudy', cz_subcategory: 'kompaktomaty', cz_label: 'Kompaktomaty' },
  { match: 'cultivators', cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-radlickove', cz_label: 'Radličkové podmítače' },
  // One-pass tillage (TopDown — kombinovaný kypřič)
  { match: 'one-pass-tillage/topdown', cz_category: 'zpracovani-pudy', cz_subcategory: 'kyprice', cz_label: 'Hlubinné kypřiče' },
  { match: 'one-pass-tillage', cz_category: 'zpracovani-pudy', cz_subcategory: 'kyprice', cz_label: 'Hlubinné kypřiče' },
  // Seedbed cultivators (NZ Aggressive — kompaktomaty)
  { match: 'seedbed-cultivators', cz_category: 'zpracovani-pudy', cz_subcategory: 'kompaktomaty', cz_label: 'Kompaktomaty' },
  // Rollers
  { match: 'rollers', cz_category: 'zpracovani-pudy', cz_subcategory: 'valce', cz_label: 'Válce a presy' },
  { match: 'rexius', cz_category: 'zpracovani-pudy', cz_subcategory: 'valce', cz_label: 'Válce a presy' },
  { match: 'rollex', cz_category: 'zpracovani-pudy', cz_subcategory: 'valce', cz_label: 'Válce a presy' },
];

const SKIP_CATEGORIES = new Set(['e-services', 'services', 'parts', 'spare-parts', 'accessories', 'precision-farming']);
const SKIP_SUBCATEGORIES = new Set(['accessories', 'parts', 'support', 'spare-parts']);

function findMapping(catPath) {
  for (const m of MAPPING) {
    if (catPath === m.match || catPath.startsWith(m.match + '/') || catPath.endsWith('/' + m.match)) return m;
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

        const mapping =
          findMapping(familyPath) ||
          findMapping(subPath) ||
          findMapping(enCat) ||
          findMapping(familySlug.split('/').pop());
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
          description: `${seriesName} — ${mapping.cz_label.toLowerCase()} značky Väderstad.`,
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
