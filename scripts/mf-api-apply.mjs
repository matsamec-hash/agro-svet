#!/usr/bin/env node
// Apply scraped MF data to src/data/stroje/massey-ferguson.yaml.
//
// Reads:  scripts/mf-api-data.json
//         src/data/stroje/massey-ferguson.yaml
// Writes: src/data/stroje/massey-ferguson.yaml (updated)
//         src/data/stroje/massey-ferguson.yaml.bak
//
// Behavior:
//   - For each scraped series with models, find/create matching YAML series
//   - Update models[] with API data
//   - Skip series with 0 models (data extraction failed — keep YAML as-is)

import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import yaml from 'js-yaml';

const API_PATH = 'scripts/mf-api-data.json';
const YAML_PATH = 'src/data/stroje/massey-ferguson.yaml';
const BACKUP_PATH = `${YAML_PATH}.bak`;

const apiData = JSON.parse(readFileSync(API_PATH, 'utf-8'));
const mf = yaml.load(readFileSync(YAML_PATH, 'utf-8'));

if (!mf.categories?.traktory || !mf.categories?.kombajny) {
  console.error('YAML structure unexpected — missing categories');
  process.exit(1);
}

copyFileSync(YAML_PATH, BACKUP_PATH);
console.log(`Backup → ${BACKUP_PATH}`);

const catData = {
  traktory: { container: mf.categories.traktory, bySlug: new Map() },
  kombajny: { container: mf.categories.kombajny, bySlug: new Map() },
};
for (const cat of Object.keys(catData)) {
  for (const s of catData[cat].container.series) {
    const key = String(s.slug); // YAML may parse "6700" as int — coerce
    catData[cat].bySlug.set(key, s);
    s.slug = key; // also normalize stored value
  }
}

const summary = { updated: [], added: [], skipped: [] };

function minMaxHp(models) {
  const hps = models.map((m) => m.power_hp).filter((x) => x !== null && x !== undefined);
  if (!hps.length) return 'no hp';
  return `${Math.min(...hps)}-${Math.max(...hps)} hp`;
}

for (const api of apiData) {
  if (api.error) {
    summary.skipped.push(`[${api.category}] ${api.yaml_slug}: ${api.error}`);
    continue;
  }
  if (!api.models || api.models.length === 0) {
    summary.skipped.push(`[${api.category}] ${api.yaml_slug}: no models extracted`);
    continue;
  }
  const target = catData[api.category];
  if (!target) {
    summary.skipped.push(`[${api.category}] ${api.yaml_slug}: unknown category`);
    continue;
  }

  const apiModels = api.models.map((m) => ({
    slug: `massey-ferguson-${m.slug.replace(/^mf-/, '')}`,
    name: m.name,
    year_from: api.year_from,
    year_to: null,
    power_hp: m.power_hp,
    power_kw: m.power_kw,
  }));

  // Build local image_url path: massey-ferguson-{slug}-{maxHp}k.webp
  const hps = api.models.map((m) => m.power_hp).filter((x) => x !== null && x !== undefined);
  const maxHp = hps.length ? Math.max(...hps) : null;
  const imageFile = maxHp ? `massey-ferguson-${api.yaml_slug}-${maxHp}k.webp` : null;
  const imageUrl = imageFile ? `/images/stroje/massey-ferguson/${imageFile}` : null;

  const existing = target.bySlug.get(String(api.yaml_slug));
  if (existing) {
    existing.models = apiModels;
    if (api.family) existing.family = api.family;
    if (api.family_label) existing.family_label = api.family_label;
    if (imageUrl && !existing.image_url) existing.image_url = imageUrl;
    summary.updated.push(`[${api.category}] ${api.yaml_slug} (${apiModels.length} models, ${minMaxHp(apiModels)})${imageUrl ? ' +img' : ''}`);
  } else {
    const newSeries = {
      slug: api.yaml_slug,
      name: `${api.name} (${api.year_from}–dosud)`,
      family: api.family,
      family_label: api.family_label,
      ...(imageUrl ? { image_url: imageUrl } : {}),
      year_from: api.year_from,
      year_to: null,
      description: `Aktuální Massey Ferguson ${api.name} — data synchronizována z masseyferguson.com.`,
      models: apiModels,
    };
    target.container.series.push(newSeries);
    summary.added.push(`[${api.category}] ${api.yaml_slug} (${apiModels.length} models, ${minMaxHp(apiModels)})${imageUrl ? ' +img' : ''}`);
  }
}

const dumped = yaml.dump(mf, {
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
console.log(`\n⊘ Skipped ${summary.skipped.length} (no data extracted):`);
for (const x of summary.skipped) console.log(`  • ${x}`);
console.log('\nNext: git diff src/data/stroje/massey-ferguson.yaml  to review.');
