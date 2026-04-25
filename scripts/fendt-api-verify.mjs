#!/usr/bin/env node
// Verify that Fendt API data and src/data/stroje/fendt.yaml agree on current series.
//
// Reads:  scripts/fendt-api-data.json  (run scrape first)
//         src/data/stroje/fendt.yaml
// Output: stdout report — discrepancies between YAML and API per series/model.
//
// Exit code: 0 if no discrepancies, 1 if any.

import { readFileSync } from 'node:fs';
import yaml from 'js-yaml';

const apiData = JSON.parse(readFileSync('scripts/fendt-api-data.json', 'utf-8'));
const fendt = yaml.load(readFileSync('src/data/stroje/fendt.yaml', 'utf-8'));
const yamlByCategory = {
  traktory: new Map(),
  kombajny: new Map(),
};
for (const cat of Object.keys(yamlByCategory)) {
  for (const s of fendt.categories[cat]?.series ?? []) yamlByCategory[cat].set(s.slug, s);
}
function findYamlSeries(api) {
  const cat = api.category || 'traktory';
  return yamlByCategory[cat]?.get(api.yaml_slug);
}

let issues = 0;
const log = (level, msg) => {
  const icon = { ok: '✓', warn: '⚠', err: '✗', info: '·' }[level] || '·';
  console.log(`${icon} ${msg}`);
  if (level === 'err' || level === 'warn') issues++;
};

console.log('==== Fendt API ↔ YAML verification ====\n');

for (const api of apiData) {
  const ys = findYamlSeries(api);
  if (!ys) {
    log('err', `Series MISSING in YAML [${api.category}]: ${api.yaml_slug} (API has ${api.models.length} models)`);
    continue;
  }
  console.log(`\n— [${api.category}] ${api.yaml_slug} (${api.name}) —`);
  // family / family_label
  if (ys.family !== api.family) log('warn', `  family mismatch: yaml="${ys.family}" api="${api.family}"`);
  if (ys.family_label !== api.family_label) log('warn', `  family_label mismatch: yaml="${ys.family_label}" api="${api.family_label}"`);
  // year_to should be null for current
  if (ys.year_to !== null) log('warn', `  year_to=${ys.year_to} (expected null for current series)`);

  // Models
  const yamlModelsBySlug = new Map();
  for (const m of ys.models || []) yamlModelsBySlug.set(m.slug, m);
  const apiModelsBySlug = new Map();
  for (const m of api.models) apiModelsBySlug.set(m.slug, m);

  // Models in API but missing from YAML
  for (const [slug, am] of apiModelsBySlug) {
    if (!yamlModelsBySlug.has(slug)) {
      log('err', `  MODEL MISSING from YAML: ${slug} (${am.name}, ${am.power_hp} hp)`);
    }
  }
  // Models in YAML but not in API
  for (const [slug, ym] of yamlModelsBySlug) {
    if (!apiModelsBySlug.has(slug)) {
      log('warn', `  YAML has extra model not in API: ${slug} (${ym.name}, ${ym.power_hp} hp)`);
    }
  }
  // Compare hp/kw for matching models
  for (const [slug, ym] of yamlModelsBySlug) {
    const am = apiModelsBySlug.get(slug);
    if (!am) continue;
    if (ym.power_hp !== am.power_hp) {
      log('err', `  hp mismatch ${slug}: yaml=${ym.power_hp} api=${am.power_hp}`);
    }
    if (ym.power_kw !== am.power_kw) {
      log('err', `  kw mismatch ${slug}: yaml=${ym.power_kw} api=${am.power_kw}`);
    }
    if (ym.name !== am.name) {
      log('warn', `  name diff ${slug}: yaml="${ym.name}" api="${am.name}"`);
    }
  }
  if (apiModelsBySlug.size === yamlModelsBySlug.size && [...apiModelsBySlug.keys()].every(k => yamlModelsBySlug.has(k))) {
    const allMatch = [...apiModelsBySlug.entries()].every(([s, am]) => {
      const ym = yamlModelsBySlug.get(s);
      return ym && ym.power_hp === am.power_hp && ym.power_kw === am.power_kw;
    });
    if (allMatch) log('ok', `  ${api.models.length} models, all hp/kW match`);
  }
}

console.log('\n==== Summary ====');
if (issues === 0) {
  console.log(`✓ All API series synchronized with YAML (${apiData.length} series checked).`);
  process.exit(0);
} else {
  console.log(`⚠ Found ${issues} discrepancies — see above.`);
  process.exit(1);
}
