#!/usr/bin/env node
// Apply Joskin scraped data → src/data/stroje/joskin.yaml.
//
// Maps Joskin EN category tree → CZ subcategory enum.
// Tech specs (year, hp, image_url) NOT filled.
//
// Joskin focus: doprava (transport trailers) + hnojení (slurry tankers,
// slurry injectors, manure spreaders) + sazečky brambor.
//
// Categories filtered out:
//   - parts/accessories
//   - municipal / non-agricultural
//
// Usage: node scripts/joskin-api-apply.mjs

import { readFileSync, writeFileSync } from 'node:fs';

const DATA_PATH = 'scripts/joskin-api-data.json';
const YAML_PATH = 'src/data/stroje/joskin.yaml';

// Map Joskin EN path prefix → CZ subcategory.
// Most specific paths first.
// Note: agro-svet StrojKategorie does NOT have generic "valniky" or
// "cisterny-prepravni" — closest matches are navesy-valnik (valniky body),
// navesy-sklapeci (tipping), navesy-posuvne-dno (push-off / walking floor).
const MAPPING = [
  // --- Hnojení ---
  // Slurry tankers (cisterny na kejdu)
  { match: 'slurry-tanks', cz_category: 'hnojeni', cz_subcategory: 'cisterny-kejda', cz_label: 'Cisterny na kejdu' },
  { match: 'slurry-tankers', cz_category: 'hnojeni', cz_subcategory: 'cisterny-kejda', cz_label: 'Cisterny na kejdu' },
  { match: 'vacuum-tankers', cz_category: 'hnojeni', cz_subcategory: 'cisterny-kejda', cz_label: 'Cisterny na kejdu' },
  // Slurry injectors / applicators (aplikátory kejdy)
  { match: 'slurry-injectors', cz_category: 'hnojeni', cz_subcategory: 'aplikatory-kejda', cz_label: 'Aplikátory kejdy' },
  { match: 'slurry-injection', cz_category: 'hnojeni', cz_subcategory: 'aplikatory-kejda', cz_label: 'Aplikátory kejdy' },
  { match: 'application', cz_category: 'hnojeni', cz_subcategory: 'aplikatory-kejda', cz_label: 'Aplikátory kejdy' },
  // Manure spreaders (rozmetadla statkových hnojiv)
  { match: 'manure-spreaders', cz_category: 'hnojeni', cz_subcategory: 'rozmetadla-statkova', cz_label: 'Rozmetadla statkových hnojiv' },
  { match: 'spreaders', cz_category: 'hnojeni', cz_subcategory: 'rozmetadla-statkova', cz_label: 'Rozmetadla statkových hnojiv' },

  // --- Doprava ---
  // Tipping trailers (sklápěcí návěsy) — Trans-CAP, Trans-KTP
  { match: 'transport/tipping-trailers', cz_category: 'doprava', cz_subcategory: 'navesy-sklapeci', cz_label: 'Sklápěcí návěsy' },
  { match: 'tipping-trailers', cz_category: 'doprava', cz_subcategory: 'navesy-sklapeci', cz_label: 'Sklápěcí návěsy' },
  { match: 'transport/trans-cap', cz_category: 'doprava', cz_subcategory: 'navesy-sklapeci', cz_label: 'Sklápěcí návěsy' },
  { match: 'transport/trans-ktp', cz_category: 'doprava', cz_subcategory: 'navesy-sklapeci', cz_label: 'Sklápěcí návěsy' },
  // Push-off / walking-floor / silage trailers (návěsy s posuvným dnem)
  { match: 'transport/push-off-trailers', cz_category: 'doprava', cz_subcategory: 'navesy-posuvne-dno', cz_label: 'Návěsy s posuvným dnem' },
  { match: 'push-off-trailers', cz_category: 'doprava', cz_subcategory: 'navesy-posuvne-dno', cz_label: 'Návěsy s posuvným dnem' },
  { match: 'silage-trailers', cz_category: 'doprava', cz_subcategory: 'navesy-posuvne-dno', cz_label: 'Silážní návěsy' },
  { match: 'transport/silage', cz_category: 'doprava', cz_subcategory: 'navesy-posuvne-dno', cz_label: 'Silážní návěsy' },
  { match: 'transport/drakkar', cz_category: 'doprava', cz_subcategory: 'navesy-posuvne-dno', cz_label: 'Silážní návěsy' },
  { match: 'transport/trans-space', cz_category: 'doprava', cz_subcategory: 'navesy-posuvne-dno', cz_label: 'Velkoobjemové návěsy' },
  // Generic flatbeds → valnik
  { match: 'transport/flatbed', cz_category: 'doprava', cz_subcategory: 'navesy-valnik', cz_label: 'Valníkové návěsy' },
  { match: 'flatbed-trailers', cz_category: 'doprava', cz_subcategory: 'navesy-valnik', cz_label: 'Valníkové návěsy' },
  // Catch-all transport (best guess: tipping)
  { match: 'transport', cz_category: 'doprava', cz_subcategory: 'navesy-sklapeci', cz_label: 'Návěsy' },

  // --- Setí (sazečky brambor) ---
  { match: 'potato-planters', cz_category: 'seti', cz_subcategory: 'sazecky-brambor', cz_label: 'Sazečky brambor' },
  { match: 'potato', cz_category: 'seti', cz_subcategory: 'sazecky-brambor', cz_label: 'Sazečky brambor' },
];

const SKIP_CATEGORIES = new Set([
  'parts', 'accessories', 'spare-parts', 'options', 'electronics',
  'municipal', 'industrial',
]);
const SKIP_SUBCATEGORIES = new Set([
  'parts', 'accessories', 'options', 'spare-parts',
]);

function findMapping(catPath) {
  for (const m of MAPPING) {
    if (catPath === m.match || catPath.startsWith(m.match + '/') || catPath.endsWith('/' + m.match)) {
      return m;
    }
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
    'doprava': 'Doprava',
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
          findMapping(enCat);
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
          description: `${seriesName} — ${mapping.cz_label.toLowerCase()} značky Joskin.`,
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

main();
