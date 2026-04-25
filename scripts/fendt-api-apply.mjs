#!/usr/bin/env node
// Apply scraped Fendt API data to src/data/stroje/fendt.yaml.
//
// Reads:  scripts/fendt-api-data.json (output of fendt-api-scrape.mjs)
//         src/data/stroje/fendt.yaml
// Writes: src/data/stroje/fendt.yaml (updated)
//         src/data/stroje/fendt.yaml.bak (backup of previous version)
//
// Behavior:
//   - For each API series, locate matching YAML series by yaml_slug
//     - Replace .models with API data (precise hp/kW)
//     - Preserve description, image_url, family, family_label, year_to
//   - If YAML series doesn't exist, append a new one
//   - Existing legacy series (year_to set) are left untouched
//   - Comments in source YAML are LOST (js-yaml limitation) — see git diff

import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import yaml from 'js-yaml';

const API_PATH = 'scripts/fendt-api-data.json';
const YAML_PATH = 'src/data/stroje/fendt.yaml';
const BACKUP_PATH = `${YAML_PATH}.bak`;

const apiData = JSON.parse(readFileSync(API_PATH, 'utf-8'));
const fendt = yaml.load(readFileSync(YAML_PATH, 'utf-8'));

if (!fendt.categories?.traktory || !fendt.categories?.kombajny) {
  console.error('YAML structure unexpected — missing categories.traktory or .kombajny');
  process.exit(1);
}

copyFileSync(YAML_PATH, BACKUP_PATH);
console.log(`Backup → ${BACKUP_PATH}`);

// Build per-category lookup maps
const catData = {
  traktory: { container: fendt.categories.traktory, bySlug: new Map() },
  kombajny: { container: fendt.categories.kombajny, bySlug: new Map() },
};
for (const cat of Object.keys(catData)) {
  for (const s of catData[cat].container.series) catData[cat].bySlug.set(s.slug, s);
}

const summary = { updated: [], added: [], unchanged: [] };

for (const api of apiData) {
  const apiModels = api.models.map((m) => ({
    slug: m.slug,
    name: m.name,
    year_from: api.year_from,
    year_to: null,
    power_hp: m.power_hp,
    power_kw: m.power_kw,
  }));

  const cat = api.category || 'traktory';
  const target = catData[cat];
  if (!target) {
    console.warn(`Unknown category "${cat}" for ${api.yaml_slug} — skipping`);
    continue;
  }
  const existing = target.bySlug.get(api.yaml_slug);
  if (existing) {
    existing.models = apiModels;
    if (api.family) existing.family = api.family;
    if (api.family_label) existing.family_label = api.family_label;
    summary.updated.push(`[${cat}] ${api.yaml_slug} (${apiModels.length} models, ${minMaxHp(apiModels)})`);
  } else {
    const newSeries = {
      slug: api.yaml_slug,
      name: `${api.name} (${api.year_from}–dosud)`,
      family: api.family,
      family_label: api.family_label,
      year_from: api.year_from,
      year_to: null,
      description: `Aktuální Fendt ${api.name} — data synchronizována z api.fendt.com.`,
      models: apiModels,
    };
    target.container.series.push(newSeries);
    summary.added.push(`[${cat}] ${api.yaml_slug} (${apiModels.length} models, ${minMaxHp(apiModels)})`);
  }
}

function minMaxHp(models) {
  const hps = models.map((m) => m.power_hp).filter((x) => x !== null);
  if (!hps.length) return 'no hp';
  return `${Math.min(...hps)}-${Math.max(...hps)} hp`;
}

// Dump
const dumped = yaml.dump(fendt, {
  lineWidth: -1,
  noRefs: true,
  sortKeys: false,
  quotingType: '"',
});
writeFileSync(YAML_PATH, dumped);

console.log(`\n✓ Updated ${summary.updated.length} series:`);
for (const x of summary.updated) console.log(`  • ${x}`);
console.log(`\n✓ Added ${summary.added.length} new series:`);
for (const x of summary.added) console.log(`  • ${x}`);
console.log('\nNext: git diff src/data/stroje/fendt.yaml  to review.');
