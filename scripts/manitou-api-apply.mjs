#!/usr/bin/env node
// Apply Manitou scraped data → src/data/stroje/manitou.yaml.
//
// Maps Manitou EN agricultural product tree → CZ subcategory enum.
// Manitou is heavily skewed to manipulators; the scraper already filters
// to AG products only (MLT, MT-X, MAC, NewAg). This script maps each
// family to one of two CZ subcategories:
//
//   manipulatory-teleskopicke (telescopic loaders) — MLT, MT-X, NewAg
//   celni-nakladace (compact / front loaders)      — MAC, MLA-T (articulated)
//
// Tech specs (year, hp, image_url) NOT filled.
//
// Usage: node scripts/manitou-api-apply.mjs

import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const DATA_PATH = 'scripts/manitou-api-data.json';
const YAML_PATH = 'src/data/stroje/manitou.yaml';

// Slug-token mapping (most specific first).
// Pattern: family slug or model slug regex → CZ category + subcategory.
const SLUG_RULES = [
  { match: /^mla-?t/i, cz_category: 'manipulace', cz_subcategory: 'kloubove-nakladace', cz_label: 'Kloubové nakladače' },
  { match: /^mac/i,    cz_category: 'manipulace', cz_subcategory: 'celni-nakladace',     cz_label: 'Čelní nakladače' },
  // MLT, MT-X, NewAg → telescopic
  { match: /^mlt/i,    cz_category: 'manipulace', cz_subcategory: 'teleskopy',           cz_label: 'Teleskopické manipulátory' },
  { match: /^mt-x/i,   cz_category: 'manipulace', cz_subcategory: 'teleskopy',           cz_label: 'Teleskopické manipulátory' },
  { match: /newag/i,   cz_category: 'manipulace', cz_subcategory: 'teleskopy',           cz_label: 'Teleskopické manipulátory' },
];

// Catch-all: any unmatched AG family defaults to teleskopy (since Manitou's
// AG portfolio is dominated by telescopic loaders).
const DEFAULT_RULE = {
  cz_category: 'manipulace',
  cz_subcategory: 'teleskopy',
  cz_label: 'Teleskopické manipulátory',
};

function findRule(slug) {
  for (const r of SLUG_RULES) {
    if (r.match.test(slug)) return r;
  }
  return DEFAULT_RULE;
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
    'manipulace': 'Manipulace a nakládání',
  };
  return NAMES[slug] || slug;
}

function familyKeyFromSlug(modelSlug) {
  // Group MLT 625-75 H, MLT 625 LE → "mlt-625" series; MLT 961 NewAg → "mlt-961".
  // Strategy: take first two slug tokens if second is numeric, else first.
  const parts = modelSlug.split('-');
  if (parts.length >= 2 && /^\d/.test(parts[1])) return `${parts[0]}-${parts[1]}`;
  return parts[0];
}

function familyDisplayName(familyKey) {
  // "mlt-625" → "MLT 625"; "mt-x-420" → "MT-X 420"; "mac-50" → "MAC 50"
  return familyKey
    .replace(/^mt-x-/i, 'MT-X ')
    .replace(/^mlt-/i, 'MLT ')
    .replace(/^mac-/i, 'MAC ')
    .replace(/^mla-?t-?/i, 'MLA-T ')
    .trim();
}

function main() {
  if (!existsSync(DATA_PATH)) {
    console.error(`No data file at ${DATA_PATH} — run manitou-api-scrape.mjs first.`);
    process.exit(1);
  }
  const data = JSON.parse(readFileSync(DATA_PATH, 'utf8'));

  const grouped = {};
  let mapped = 0;

  // Walk the tree and re-group by (mapping, family-from-slug).
  for (const enCat of Object.keys(data)) {
    for (const enSub of Object.keys(data[enCat])) {
      for (const familySlug of Object.keys(data[enCat][enSub])) {
        const family = data[enCat][enSub][familySlug];
        for (const model of family.models) {
          const rule = findRule(model.slug) || findRule(familySlug);
          if (!rule) continue;

          if (!grouped[rule.cz_category]) {
            grouped[rule.cz_category] = {
              name: cz_category_name(rule.cz_category),
              series: [],
            };
          }

          const familyKey = familyKeyFromSlug(model.slug);
          const seriesName = familyDisplayName(familyKey);

          let target = grouped[rule.cz_category].series.find((s) => s.slug === familyKey);
          if (!target) {
            target = {
              slug: familyKey,
              name: seriesName,
              family: familyKey,
              subcategory: rule.cz_subcategory,
              url: '',
              description: `${seriesName} — ${rule.cz_label.toLowerCase()} značky Manitou.`,
              models: [],
            };
            grouped[rule.cz_category].series.push(target);
          }

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
      }
    }
  }

  console.error(`Mapped: ${mapped} models`);
  for (const cat of Object.keys(grouped)) {
    const series = grouped[cat].series;
    const totalModels = series.reduce((acc, s) => acc + s.models.length, 0);
    console.error(`  ${cat}: ${series.length} series, ${totalModels} models`);
  }

  // Preserve YAML header.
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
