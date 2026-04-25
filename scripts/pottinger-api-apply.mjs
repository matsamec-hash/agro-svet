#!/usr/bin/env node
// Apply Pöttinger scraped data → src/data/stroje/pottinger.yaml.
//
// Maps Pöttinger CZ category tree → CZ subcategory enum, deduplicates,
// uses page-title-extracted names (e.g. "NOVACAT 302" instead of slug-derived
// "novacat-302"). Tech specs (year, hp, image_url) NOT filled.
//
// Pöttinger CZ taxonomy (under /cs_cz/produkty/):
//   - obdelavani-pudy        → zpracování půdy (pluhy SERVO, podmítače TERRADISC,
//                              kypřiče SYNKRO, kompaktomaty FOX/LION, brány)
//   - vysevni-technika       → setí (AEROSEM pneumatické, VITASEM mechanické,
//                              TERRASEM secí kombinace)
//   - sklizen-picnin         → sklizeň pícnin (NOVACAT/NOVADISC/EUROCAT žací,
//                              HIT obraceče, TOP shrnovače, IMPRESS/JUMBO lisy
//                              & samosběry, MEX řezačky)
//   - dopravni-technika      → návěsy / přepravní technika
//
// Usage: node scripts/pottinger-api-apply.mjs

import { readFileSync, writeFileSync } from 'node:fs';

const DATA_PATH = 'scripts/pottinger-api-data.json';
const YAML_PATH = 'src/data/stroje/pottinger.yaml';

// Map Pöttinger CZ path prefix → CZ subcategory enum.
// Most specific paths first.
const MAPPING = [
  // === Zpracování půdy ===
  { match: 'obdelavani-pudy/pluhy', cz_category: 'zpracovani-pudy', cz_subcategory: 'pluhy', cz_label: 'Pluhy' },
  { match: 'obdelavani-pudy/diskove-podmitace', cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-diskove', cz_label: 'Diskové podmítače' },
  { match: 'obdelavani-pudy/talirove-podmitace', cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-diskove', cz_label: 'Talířové podmítače' },
  { match: 'obdelavani-pudy/radlickove-kyprice', cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-radlickove', cz_label: 'Radličkové kypřiče' },
  { match: 'obdelavani-pudy/kyprice', cz_category: 'zpracovani-pudy', cz_subcategory: 'kyprice', cz_label: 'Kypřiče' },
  { match: 'obdelavani-pudy/rotacni-brany', cz_category: 'zpracovani-pudy', cz_subcategory: 'rotacni-brany', cz_label: 'Rotační brány' },
  { match: 'obdelavani-pudy/kompaktomaty', cz_category: 'zpracovani-pudy', cz_subcategory: 'kompaktomaty', cz_label: 'Kompaktomaty' },
  { match: 'obdelavani-pudy/valce', cz_category: 'zpracovani-pudy', cz_subcategory: 'valce', cz_label: 'Válce' },
  // === Setí ===
  { match: 'vysevni-technika/mechanicke-seci-stroje', cz_category: 'seti', cz_subcategory: 'seci-stroje-mechanicke', cz_label: 'Mechanické secí stroje' },
  { match: 'vysevni-technika/pneumaticke-seci-stroje', cz_category: 'seti', cz_subcategory: 'seci-stroje-pneumaticke', cz_label: 'Pneumatické secí stroje' },
  { match: 'vysevni-technika/seci-kombinace', cz_category: 'seti', cz_subcategory: 'seci-kombinace', cz_label: 'Secí kombinace' },
  { match: 'vysevni-technika/presne-secky', cz_category: 'seti', cz_subcategory: 'seci-stroje-presne', cz_label: 'Přesné secí stroje' },
  { match: 'vysevni-technika', cz_category: 'seti', cz_subcategory: 'seci-stroje-pneumaticke', cz_label: 'Secí stroje' },
  // === Sklizeň pícnin ===
  { match: 'sklizen-picnin/diskove-zaci-stroje', cz_category: 'sklizen-picnin', cz_subcategory: 'zaci-stroje', cz_label: 'Diskové žací stroje' },
  { match: 'sklizen-picnin/zaci-stroje', cz_category: 'sklizen-picnin', cz_subcategory: 'zaci-stroje', cz_label: 'Žací stroje' },
  { match: 'sklizen-picnin/obracece', cz_category: 'sklizen-picnin', cz_subcategory: 'obracece', cz_label: 'Obraceče' },
  { match: 'sklizen-picnin/shrnovace', cz_category: 'sklizen-picnin', cz_subcategory: 'shrnovace', cz_label: 'Shrnovače' },
  { match: 'sklizen-picnin/samosberaci-vozy', cz_category: 'sklizen-picnin', cz_subcategory: 'samosberaci-vozy', cz_label: 'Samosběrací vozy' },
  { match: 'sklizen-picnin/lisy-na-kulate-baliky', cz_category: 'sklizen-picnin', cz_subcategory: 'lisy-valcove', cz_label: 'Lisy na kulaté balíky' },
  { match: 'sklizen-picnin/lisy', cz_category: 'sklizen-picnin', cz_subcategory: 'lisy-valcove', cz_label: 'Lisy' },
  { match: 'sklizen-picnin/rezacky', cz_category: 'sklizen-picnin', cz_subcategory: 'rezacky-samojizdne', cz_label: 'Řezačky' },
  // === Doprava ===
  { match: 'dopravni-technika', cz_category: 'doprava', cz_subcategory: 'navesy-valnik', cz_label: 'Návěsy' },
];

const SKIP_CATEGORIES = new Set([
  'digitalni-reseni',
  'digital',
  'tigital-solutions',
  'sluzby',
  'service',
  'nahradni-dily',
]);
const SKIP_SUBCATEGORIES = new Set([
  'prislusenstvi',
  'doplnky',
  'accessories',
]);

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
    'sklizen-picnin': 'Sklizeň pícnin a slámy',
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
          description: `${seriesName} — ${mapping.cz_label.toLowerCase()} značky Pöttinger.`,
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
