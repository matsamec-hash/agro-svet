#!/usr/bin/env node
// Apply Lemken scraped data → src/data/stroje/lemken.yaml.
//
// Reads scripts/lemken-api-data.json (from lemken-api-scrape.mjs), maps
// Lemken's English category tree to agro-svet's Czech sub-category enum,
// and writes the YAML scaffold with families + models.
//
// Tech specs (year_from, power_hp, image_url, etc.) are NOT filled —
// Lemken pages have no structured data. Slugs and CZ names are populated
// so /stroje/lemken/{family} routes resolve and show family + model lists.
//
// Categories filtered out:
//   - iqblue (telematics/software, not a physical machine)
//   - equipment sub-cats (accessories/spare parts)
//   - cropcare (Lemken Sprayhub etc. — would map to ochrana-rostlin but
//     the catalog grouping doesn't fit cleanly; skip for now)
//
// Usage: node scripts/lemken-api-apply.mjs

import { readFileSync, writeFileSync } from 'node:fs';

const DATA_PATH = 'scripts/lemken-api-data.json';
const YAML_PATH = 'src/data/stroje/lemken.yaml';

// Map Lemken sitemap path (cat/sub OR cat/sub/family-prefix) → CZ subcategory.
// Order matters — more specific paths first.
const MAPPING = [
  // Soil cultivation
  { match: 'soil-cultivation/ploughing', cz_category: 'zpracovani-pudy', cz_subcategory: 'pluhy', cz_label: 'Pluhy' },
  { match: 'soil-cultivation/stubble-cultivation/compact-disc-harrows', cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-diskove', cz_label: 'Diskové podmítače' },
  { match: 'soil-cultivation/stubble-cultivation/cultivators', cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-radlickove', cz_label: 'Radličkové podmítače' },
  { match: 'soil-cultivation/stubble-cultivation/subsoiler', cz_category: 'zpracovani-pudy', cz_subcategory: 'kyprice', cz_label: 'Kypřiče (hlubinné)' },
  { match: 'soil-cultivation/stubble-cultivation/system-carrier', cz_category: 'zpracovani-pudy', cz_subcategory: 'kyprice', cz_label: 'Kypřiče (systémové)' },
  { match: 'soil-cultivation/seedbed-preparation/power-harrows', cz_category: 'zpracovani-pudy', cz_subcategory: 'rotacni-brany', cz_label: 'Rotační brány' },
  { match: 'soil-cultivation/seedbed-preparation/seedbed-combinations', cz_category: 'zpracovani-pudy', cz_subcategory: 'kompaktomaty', cz_label: 'Kompaktomaty' },
  { match: 'soil-cultivation/reconsolidation', cz_category: 'zpracovani-pudy', cz_subcategory: 'valce', cz_label: 'Válce a presy' },
  // Sowing
  { match: 'sowing/seed-drills/mechanical-seed-drills', cz_category: 'seti', cz_subcategory: 'seci-stroje-mechanicke', cz_label: 'Mechanické secí stroje' },
  { match: 'sowing/seed-drills/pneumatic-seed-drills', cz_category: 'seti', cz_subcategory: 'seci-stroje-pneumaticke', cz_label: 'Pneumatické secí stroje' },
  { match: 'sowing/seed-drills/seeding-combinations', cz_category: 'seti', cz_subcategory: 'seci-kombinace', cz_label: 'Secí kombinace' },
  { match: 'sowing/precision-seeding', cz_category: 'seti', cz_subcategory: 'seci-stroje-presne', cz_label: 'Přesné secí stroje' },
  { match: 'sowing/direct-drilling', cz_category: 'seti', cz_subcategory: 'seci-stroje-pneumaticke', cz_label: 'Stroje pro přímé setí' },
];

const SKIP_CATEGORIES = new Set(['iqblue']);
const SKIP_SUBCATEGORIES = new Set(['equipment', 'cropcare', 'apps', 'licenses', 'produkte', 'terminals-joysticks']);

function findMapping(catPath) {
  // catPath: e.g. "soil-cultivation/ploughing" or "soil-cultivation/stubble-cultivation/compact-disc-harrows"
  for (const m of MAPPING) {
    if (catPath === m.match || catPath.startsWith(m.match + '/')) return m;
  }
  return null;
}

function escapeYaml(s) {
  // Quote if contains special chars or starts with non-letter
  if (/[:#&*!|>'"%@`]/.test(s) || /^[\s-]/.test(s)) return `"${s.replace(/"/g, '\\"')}"`;
  return s;
}

function buildYaml(grouped, headerLines) {
  const out = [...headerLines, 'categories:'];
  for (const cz_cat of Object.keys(grouped).sort()) {
    out.push(`  ${cz_cat}:`);
    out.push(`    name: ${escapeYaml(grouped[cz_cat].name)}`);
    out.push(`    series:`);
    // Sort series alphabetically by family slug for deterministic output
    const sortedSeries = grouped[cz_cat].series.sort((a, b) => a.slug.localeCompare(b.slug));
    for (const series of sortedSeries) {
      out.push(`      - slug: ${series.slug}`);
      out.push(`        name: ${escapeYaml(series.name)}`);
      out.push(`        family: ${series.family}`);
      out.push(`        subcategory: ${series.subcategory}`);
      out.push(`        url: ${series.url}`);
      out.push(`        description: |`);
      out.push(`          ${series.description}`);
      if (series.models && series.models.length > 0) {
        out.push(`        models:`);
        for (const model of series.models) {
          out.push(`          - slug: ${model.slug}`);
          out.push(`            name: ${escapeYaml(model.name)}`);
          out.push(`            url: ${model.url}`);
        }
      }
    }
  }
  return out.join('\n') + '\n';
}

function main() {
  const data = JSON.parse(readFileSync(DATA_PATH, 'utf8'));

  // Group by CZ category → series
  // grouped = { 'zpracovani-pudy': { name: 'Zpracování půdy', series: [...] }, 'seti': {...} }
  const grouped = {};
  let mapped = 0, skipped = 0;

  for (const enCat of Object.keys(data)) {
    if (SKIP_CATEGORIES.has(enCat)) { skipped += countModels(data[enCat]); continue; }
    for (const enSub of Object.keys(data[enCat])) {
      if (SKIP_SUBCATEGORIES.has(enSub)) { skipped += countModels({ x: data[enCat][enSub] }); continue; }
      const subPath = enSub === '_root' ? enCat : `${enCat}/${enSub}`;

      for (const familySlug of Object.keys(data[enCat][enSub])) {
        const family = data[enCat][enSub][familySlug];
        const familyPath = `${subPath}/${familySlug.split('/')[0]}`; // strip nested deeper level

        const mapping = findMapping(familyPath) || findMapping(subPath);
        if (!mapping) { skipped += family.models.length; continue; }

        if (!grouped[mapping.cz_category]) {
          grouped[mapping.cz_category] = {
            name: cz_category_name(mapping.cz_category),
            series: [],
          };
        }

        // Treat each Lemken family as a "series" in the YAML.
        // The CZ subcategory is on the series, not the category (since one
        // CZ category may aggregate multiple sub-categories).
        const cleanFamilySlug = familySlug.split('/').pop();
        const seriesSlug = `${cleanFamilySlug}`;

        // Check if a series with this slug already exists (e.g. duplicate from nested paths)
        const existing = grouped[mapping.cz_category].series.find((s) => s.slug === seriesSlug);
        const target = existing || {
          slug: seriesSlug,
          name: family.name,
          family: cleanFamilySlug,
          subcategory: mapping.cz_subcategory,
          url: family.models[0]?.url ? new URL(family.models[0].url).origin + new URL(family.models[0].url).pathname.replace(/\/[^/]+$/, '') : '',
          description: `Řada Lemken ${family.name} v kategorii ${mapping.cz_label}.`,
          models: [],
        };

        for (const model of family.models) {
          if (!target.models.find((m) => m.slug === model.slug)) {
            target.models.push({
              slug: model.slug,
              name: model.name,
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
  console.error(`Skipped: ${skipped} models (iqblue/equipment/cropcare/unmapped)`);
  for (const cat of Object.keys(grouped)) {
    const series = grouped[cat].series;
    const totalModels = series.reduce((acc, s) => acc + s.models.length, 0);
    console.error(`  ${cat}: ${series.length} series, ${totalModels} models`);
  }

  // Preserve YAML header from existing file
  const existing = readFileSync(YAML_PATH, 'utf8').split('\n');
  const headerLines = [];
  for (const line of existing) {
    if (line.startsWith('categories:')) break;
    headerLines.push(line);
  }
  // Drop trailing empty lines from header
  while (headerLines.length > 0 && !headerLines[headerLines.length - 1].trim()) headerLines.pop();

  const yaml = buildYaml(grouped, headerLines);
  writeFileSync(YAML_PATH, yaml);
  console.error(`\nWrote ${YAML_PATH} (${yaml.split('\n').length} lines)`);
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

function countModels(obj) {
  if (!obj || typeof obj !== 'object') return 0;
  if (Array.isArray(obj.models)) return obj.models.length;
  let n = 0;
  for (const k of Object.keys(obj)) n += countModels(obj[k]);
  return n;
}

main();
