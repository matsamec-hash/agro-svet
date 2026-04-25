#!/usr/bin/env node
// Apply JCB scraped data → src/data/stroje/jcb.yaml.
//
// Maps JCB EN category tree → CZ subcategory enum, deduplicates,
// uses page-title-extracted names. Tech specs (year, hp, image_url) NOT filled.
//
// JCB ag focus:
//   - Loadall (telescopic handlers) → teleskopy
//   - Telescopic Handlers / Agricultural Loaders → teleskopy
//   - Fastrac (high-speed tractors) → traktory
//   - Compact Wheel Loaders (403/406 etc.) → kolove-nakladace
//
// Categories filtered out (handled by scrape AG filter, but listed for clarity):
//   - backhoe loaders, excavators, dumpsters, access platforms
//   - generators, military, industrial forklifts
//
// Usage: node scripts/jcb-api-apply.mjs

import { readFileSync, writeFileSync } from 'node:fs';

const DATA_PATH = 'scripts/jcb-api-data.json';
const YAML_PATH = 'src/data/stroje/jcb.yaml';

// Map JCB EN path token → CZ subcategory.
// Order matters — most specific first.
const MAPPING = [
  { match: 'fastrac',                cz_category: 'traktory',    cz_subcategory: 'traktory',          cz_label: 'Traktory Fastrac' },
  { match: 'loadall',                cz_category: 'manipulace',  cz_subcategory: 'teleskopy',         cz_label: 'Teleskopické manipulátory Loadall' },
  { match: 'telescopic-handler',     cz_category: 'manipulace',  cz_subcategory: 'teleskopy',         cz_label: 'Teleskopické manipulátory' },
  { match: 'telescopic-handlers',    cz_category: 'manipulace',  cz_subcategory: 'teleskopy',         cz_label: 'Teleskopické manipulátory' },
  { match: 'agricultural-loaders',   cz_category: 'manipulace',  cz_subcategory: 'teleskopy',         cz_label: 'Zemědělské nakladače' },
  { match: 'agricultural-loader',    cz_category: 'manipulace',  cz_subcategory: 'teleskopy',         cz_label: 'Zemědělský nakladač' },
  { match: 'compact-wheel-loader',   cz_category: 'manipulace',  cz_subcategory: 'kolove-nakladace',  cz_label: 'Kompaktní kolové nakladače' },
  { match: 'compact-wheel-loaders',  cz_category: 'manipulace',  cz_subcategory: 'kolove-nakladace',  cz_label: 'Kompaktní kolové nakladače' },
  // Generic agriculture/agri hub — fall through to teleskopy unless model name hints otherwise
  { match: 'agriculture',            cz_category: 'manipulace',  cz_subcategory: 'teleskopy',         cz_label: 'Zemědělská technika JCB' },
  { match: 'agri',                   cz_category: 'manipulace',  cz_subcategory: 'teleskopy',         cz_label: 'Zemědělská technika JCB' },
];

const SKIP_CATEGORIES = new Set([]);
const SKIP_SUBCATEGORIES = new Set([]);

function findMappingForPath(fullPath) {
  // fullPath is a slash-joined string of all path segments.
  // Most specific match first — token presence anywhere.
  const lp = fullPath.toLowerCase();
  // Special-case: if the path contains "fastrac" anywhere, route to traktory.
  if (/(^|\/)fastrac($|\/|-)/.test(lp)) return MAPPING.find((m) => m.match === 'fastrac');
  if (/compact-wheel-loader/.test(lp)) return MAPPING.find((m) => m.match === 'compact-wheel-loader');
  if (/(^|\/)loadall($|\/|-)/.test(lp)) return MAPPING.find((m) => m.match === 'loadall');
  for (const m of MAPPING) {
    if (lp.includes(m.match)) return m;
  }
  return null;
}

function findMappingForModelName(name) {
  const ln = (name || '').toLowerCase();
  if (ln.includes('fastrac')) return MAPPING.find((m) => m.match === 'fastrac');
  if (ln.includes('loadall')) return MAPPING.find((m) => m.match === 'loadall');
  if (ln.includes('compact wheel loader') || /\b40[36]\b/.test(ln)) return MAPPING.find((m) => m.match === 'compact-wheel-loader');
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
    'traktory': 'Traktory',
    'manipulace': 'Manipulace a nakládání',
  };
  return NAMES[slug] || slug;
}

// Derive a clean family slug for JCB. For Loadall numeric models like
// "525-60", "542-70", "550-80" — group by first three digits ("525", "542")
// or by series prefix ("loadall"). For Fastrac like "4220", "8330" — by
// first two digits ("42", "83") = generation series.
function deriveFamily(modelSlug, mapping) {
  const slug = modelSlug.toLowerCase();
  if (mapping?.match === 'fastrac') {
    const m = slug.match(/(\d{4})/);
    // Group by first digit → 4xxx → fastrac-4000, 8xxx → fastrac-8000.
    if (m) return `fastrac-${m[1][0]}000`;
    return 'fastrac';
  }
  if (mapping?.match === 'loadall') {
    // Group Agri Pro / Agri Super separately
    if (slug.includes('agri-pro')) return 'loadall-agri-pro';
    if (slug.includes('agri-super')) return 'loadall-agri-super';
    if (slug.includes('agri-plus')) return 'loadall-agri-plus';
    if (slug.includes('agri-xtra')) return 'loadall-agri-xtra';
    if (slug.startsWith('tm') || slug.includes('telemaster')) return 'loadall-tm';
    const m = slug.match(/^(\d{3})/);
    if (m) return `loadall-${m[1]}`;
    return 'loadall';
  }
  if (mapping?.match === 'compact-wheel-loader' || mapping?.match === 'compact-wheel-loaders') {
    return 'compact-wheel-loader';
  }
  // Default — slug prefix before first digit-block, else slug itself
  const m = slug.match(/^([a-z]+)/);
  return m ? m[1] : slug;
}

function deriveSeriesName(family, models, mapping) {
  if (family.startsWith('fastrac-')) {
    const gen = family.replace('fastrac-', '');
    return `Fastrac ${gen} series`;
  }
  if (family === 'fastrac') {
    return 'Fastrac';
  }
  if (family === 'loadall-agri-pro') return 'Loadall Agri Pro';
  if (family === 'loadall-agri-super') return 'Loadall Agri Super';
  if (family === 'loadall-agri-plus') return 'Loadall Agri Plus';
  if (family === 'loadall-agri-xtra') return 'Loadall Agri Xtra';
  if (family === 'loadall-tm') return 'Loadall TM (Telemaster)';
  if (family.startsWith('loadall-')) {
    const code = family.replace('loadall-', '');
    return `Loadall ${code} series`;
  }
  if (family === 'compact-wheel-loader') return 'Compact Wheel Loader';
  // Fallback — first word of first model
  const firstName = models[0]?.name || family;
  return firstName.split(/\s+/)[0] || family;
}

function main() {
  const data = JSON.parse(readFileSync(DATA_PATH, 'utf8'));

  const grouped = {};
  let mapped = 0, skipped = 0;
  const skippedSamples = [];

  function ensureCat(cz_cat) {
    if (!grouped[cz_cat]) {
      grouped[cz_cat] = { name: cz_category_name(cz_cat), series: [] };
    }
  }

  // Walk tree with maximal flexibility — JCB structure may be flatter than Lemken.
  for (const enCat of Object.keys(data)) {
    if (SKIP_CATEGORIES.has(enCat)) continue;
    for (const enSub of Object.keys(data[enCat])) {
      if (SKIP_SUBCATEGORIES.has(enSub)) continue;
      for (const familySlug of Object.keys(data[enCat][enSub])) {
        const family = data[enCat][enSub][familySlug];

        // Try mapping by full path first
        const fullPath = [enCat, enSub, familySlug].filter((s) => s !== '_root').join('/');

        for (const model of family.models) {
          // Per-model mapping — JCB lumps many handlers under /loadall/ etc.,
          // but model name (e.g. "Fastrac 4220") is most reliable signal.
          let mapping = findMappingForModelName(model.name) || findMappingForPath(fullPath);

          if (!mapping) {
            skipped++;
            if (skippedSamples.length < 6) skippedSamples.push(`unmapped: ${fullPath}/${model.slug} (${model.name})`);
            continue;
          }

          ensureCat(mapping.cz_category);
          const familyKey = deriveFamily(model.slug, mapping);

          let target = grouped[mapping.cz_category].series.find((s) => s.slug === familyKey);
          if (!target) {
            target = {
              slug: familyKey,
              name: deriveSeriesName(familyKey, family.models, mapping),
              family: familyKey,
              subcategory: mapping.cz_subcategory,
              url: '',
              description: `${deriveSeriesName(familyKey, family.models, mapping)} — ${mapping.cz_label.toLowerCase()} značky JCB.`,
              models: [],
            };
            grouped[mapping.cz_category].series.push(target);
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
  console.error(`Skipped: ${skipped} models`);
  if (skippedSamples.length) skippedSamples.forEach((s) => console.error(`  - ${s}`));
  console.error('');
  for (const cat of Object.keys(grouped)) {
    const series = grouped[cat].series;
    const totalModels = series.reduce((acc, s) => acc + s.models.length, 0);
    console.error(`  ${cat}: ${series.length} series, ${totalModels} models`);
  }

  // Preserve YAML header (everything before `categories:`)
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
