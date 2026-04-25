#!/usr/bin/env node
// Apply Bednar scraped data → src/data/stroje/bednar.yaml.
//
// Maps Bednar EN category tree → CZ subcategory enum.
// Adapted from lemken-api-apply.mjs (commit f90f88f).
//
// Bednar product families (rough mapping from product knowledge):
//   - ATLAS (AO/AN/HO) — diskové podmítače → podmitace-diskove
//   - SWIFTER (SE/SM/SN) — kompaktomaty → kompaktomaty
//   - TERRALAND (TN/TO/DO) — hluboké kypřiče → kyprice
//   - VERSATILL — univerzální kypřič → podmitace-radlickove / kyprice
//   - KOR (kor) — diskové brány → podmitace-diskove
//   - FENIX (FN/FO) — radličkové podmítače → podmitace-radlickove
//   - STRIP-MASTER, STRIPTILLER — strip-till → kyprice
//   - ROW-MASTER — meziřádkové plečky → ochrana-rostlin (no good fit; will skip)
//   - GALAXY — válce → valce
//   - PRESSPACK / PRESSOL — presy/válce → valce
//   - OMEGA (OO) — secí stroje pneumatické → seci-stroje-pneumaticke
//   - FERTI-BOX — zásobníky hnojiv (skip — no good fit)
//   - FENIX FN — radličkový kypřič → podmitace-radlickove
//
// Tech specs (year, hp, image_url) NOT filled.
//
// Usage: node scripts/bednar-api-apply.mjs

import { readFileSync, writeFileSync } from 'node:fs';

const DATA_PATH = 'scripts/bednar-api-data.json';
const YAML_PATH = 'src/data/stroje/bednar.yaml';

// Slug-token / family-name → CZ subcategory.
// Order matters (most specific first).
const FAMILY_MAPPING = [
  // Soil cultivation
  { tokens: ['atlas'],       cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-diskove',    cz_label: 'Diskové podmítače' },
  { tokens: ['swifter'],     cz_category: 'zpracovani-pudy', cz_subcategory: 'kompaktomaty',         cz_label: 'Kompaktomaty' },
  { tokens: ['terraland'],   cz_category: 'zpracovani-pudy', cz_subcategory: 'kyprice',              cz_label: 'Hloubkové kypřiče' },
  { tokens: ['versatill'],   cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-radlickove', cz_label: 'Univerzální kypřiče' },
  { tokens: ['fenix'],       cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-radlickove', cz_label: 'Radličkové podmítače' },
  { tokens: ['kor'],         cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-diskove',    cz_label: 'Krátké diskové brány' },
  { tokens: ['mulchfarmer'], cz_category: 'zpracovani-pudy', cz_subcategory: 'kyprice',              cz_label: 'Mulčovací kypřiče' },
  { tokens: ['strip-master','striptiller','strip'], cz_category: 'zpracovani-pudy', cz_subcategory: 'kyprice', cz_label: 'Strip-till kypřiče' },
  { tokens: ['galaxy'],      cz_category: 'zpracovani-pudy', cz_subcategory: 'valce',                cz_label: 'Válce' },
  { tokens: ['presspack','pressol','press-pack'], cz_category: 'zpracovani-pudy', cz_subcategory: 'valce', cz_label: 'Presovací válce' },
  { tokens: ['cutterpack'],  cz_category: 'zpracovani-pudy', cz_subcategory: 'valce',                cz_label: 'Cutterpack válce' },
  // Sowing
  { tokens: ['omega'],       cz_category: 'seti', cz_subcategory: 'seci-stroje-pneumaticke', cz_label: 'Pneumatické secí stroje' },
  { tokens: ['ferox'],       cz_category: 'seti', cz_subcategory: 'seci-stroje-pneumaticke', cz_label: 'Pneumatické secí stroje' },
  { tokens: ['corsa'],       cz_category: 'seti', cz_subcategory: 'seci-stroje-presne',      cz_label: 'Přesné secí stroje' },
  { tokens: ['alfa'],        cz_category: 'seti', cz_subcategory: 'seci-stroje-pneumaticke', cz_label: 'Pneumatické secí stroje' },
  { tokens: ['ferti-box','fertibox'], cz_category: 'seti', cz_subcategory: 'seci-kombinace', cz_label: 'Secí kombinace s zásobníkem' },
];

// EN path-prefix → CZ subcategory (fallback when family token doesn't match).
const PATH_MAPPING = [
  { match: 'soil-cultivation/disc-cultivators',     cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-diskove',    cz_label: 'Diskové podmítače' },
  { match: 'soil-cultivation/tine-cultivators',     cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-radlickove', cz_label: 'Radličkové podmítače' },
  { match: 'soil-cultivation/deep-cultivators',     cz_category: 'zpracovani-pudy', cz_subcategory: 'kyprice',              cz_label: 'Hloubkové kypřiče' },
  { match: 'soil-cultivation/seedbed-cultivators',  cz_category: 'zpracovani-pudy', cz_subcategory: 'kompaktomaty',         cz_label: 'Kompaktomaty' },
  { match: 'soil-cultivation/rollers',              cz_category: 'zpracovani-pudy', cz_subcategory: 'valce',                cz_label: 'Válce' },
  { match: 'sowing/seed-drills',                    cz_category: 'seti', cz_subcategory: 'seci-stroje-pneumaticke', cz_label: 'Pneumatické secí stroje' },
  { match: 'sowing/precision-seed-drills',          cz_category: 'seti', cz_subcategory: 'seci-stroje-presne',      cz_label: 'Přesné secí stroje' },
  { match: 'sowing',                                cz_category: 'seti', cz_subcategory: 'seci-stroje-pneumaticke', cz_label: 'Pneumatické secí stroje' },
  { match: 'soil-cultivation',                      cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-radlickove', cz_label: 'Stroje pro zpracování půdy' },
];

// Bednar sub-cats not represented in agro-svet enum — silently skip with warning.
const SKIP_FAMILIES = new Set(['row-master', 'rowmaster', 'fertibox-front', 'ferti-box-front']);

function findFamilyMapping(familySlug) {
  const lower = familySlug.toLowerCase();
  for (const m of FAMILY_MAPPING) {
    if (m.tokens.some((t) => lower.includes(t))) return m;
  }
  return null;
}

function findPathMapping(catPath) {
  for (const m of PATH_MAPPING) {
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
    for (const enSub of Object.keys(data[enCat])) {
      const subPath = enSub === '_root'
        ? (enCat === '_root' ? '' : enCat)
        : `${enCat}/${enSub}`;

      for (const familySlug of Object.keys(data[enCat][enSub])) {
        const family = data[enCat][enSub][familySlug];
        const cleanFamilySlug = familySlug.split('/').pop();

        if (SKIP_FAMILIES.has(cleanFamilySlug.toLowerCase())) {
          skipped += family.models.length;
          if (skippedSamples.length < 6) skippedSamples.push(`skip-family: ${cleanFamilySlug}`);
          continue;
        }

        const familyPath = subPath ? `${subPath}/${familySlug.split('/')[0]}` : familySlug;
        const mapping = findFamilyMapping(cleanFamilySlug)
          || findPathMapping(familyPath)
          || findPathMapping(subPath);

        if (!mapping) {
          skipped += family.models.length;
          if (skippedSamples.length < 6) skippedSamples.push(`unmapped: ${familyPath || familySlug}`);
          continue;
        }

        if (!grouped[mapping.cz_category]) {
          grouped[mapping.cz_category] = {
            name: cz_category_name(mapping.cz_category),
            series: [],
          };
        }

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
          description: `${seriesName} — ${mapping.cz_label.toLowerCase()} značky Bednar.`,
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
