#!/usr/bin/env node
// Scrape Fendt official techdata API and output structured JSON.
// Source: api.fendt.com/techdata/{LANG}/{lang}/{ID}/{Series-Slug}
// Each series page contains all models + spec rows in SSR HTML.
//
// Usage: node scripts/fendt-api-scrape.mjs > scripts/fendt-api-data.json

import { writeFileSync } from 'node:fs';

const SERIES = [
  // === Traktory ===
  { category: 'traktory', yaml_slug: '200-vario',           id: '1152980', name: '200 Vario',         family: '2',    family_label: '200 Vario',         year_from: 2008 },
  { category: 'traktory', yaml_slug: '300-vario-gen2',      id: '1519977', name: '300 Vario Gen5',    family: '3',    family_label: '300 Vario',         year_from: 2013 },
  { category: 'traktory', yaml_slug: '500-vario-s4',        id: '1520018', name: '500 Vario Gen4',    family: '5',    family_label: '500 Vario',         year_from: 2014 },
  { category: 'traktory', yaml_slug: '600-vario',           id: '1465241', name: '600 Vario',         family: '6',    family_label: '600 Vario',         year_from: 2024 },
  { category: 'traktory', yaml_slug: '700-vario-gen7',      id: '1551551', name: '700 Vario Gen7.1',  family: '7',    family_label: '700 Vario',         year_from: 2023 },
  { category: 'traktory', yaml_slug: '800-vario-s4',        id: '1519888', name: '800 Vario Gen5',    family: '8',    family_label: '800 Vario',         year_from: 2014 },
  { category: 'traktory', yaml_slug: '900-vario-gen3',      id: '1153774', name: '900 Vario',         family: '9',    family_label: '900 Vario',         year_from: 2020 },
  { category: 'traktory', yaml_slug: '900-vario-mt',        id: '1153811', name: '900 Vario MT',      family: '9',    family_label: '900 Vario',         year_from: 2018 },
  { category: 'traktory', yaml_slug: '1000-vario',          id: '1152748', name: '1000 Vario',        family: '1000', family_label: '1000 Vario',        year_from: 2015 },
  { category: 'traktory', yaml_slug: '1000-vario-gen4',     id: '1519937', name: '1000 Vario Gen4',   family: '1000', family_label: '1000 Vario',        year_from: 2023 },
  { category: 'traktory', yaml_slug: '1100-vario-mt',       id: '1152877', name: '1100 Vario MT',     family: '1100', family_label: '1100 Vario MT',     year_from: 2018 },
  // === Kombajny ===
  { category: 'kombajny', yaml_slug: 'corus-500',           id: '1151954', name: 'CORUS 500',         family: 'corus',  family_label: 'CORUS 500',       year_from: 2022 },
  { category: 'kombajny', yaml_slug: 'c-series',            id: '1154535', name: 'C-Series',          family: 'c',      family_label: 'C-Series',        year_from: 2012 },
  { category: 'kombajny', yaml_slug: 'l-series',            id: '1152067', name: 'L-Series',          family: 'l',      family_label: 'L-Series',        year_from: 2014 },
  { category: 'kombajny', yaml_slug: 'ideal',               id: '1152010', name: 'IDEAL',             family: 'ideal',  family_label: 'IDEAL',           year_from: 2017 },
];

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

async function fetchSeries(s) {
  const slugified = s.name.replaceAll(' ', '-').replaceAll('.', '');
  const url = `https://api.fendt.com/techdata/EN/en/${s.id}/Fendt-${slugified}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'text/html' } });
  if (!res.ok) throw new Error(`${s.name}: HTTP ${res.status}`);
  return await res.text();
}

function stripTags(s) {
  return s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function parseModels(html) {
  const re = /data-id="(\d+)">([^<]+?)<\/button>/g;
  const out = [];
  const seen = new Set();
  let m;
  while ((m = re.exec(html)) !== null) {
    const id = m[1];
    const label = m[2].trim();
    if (seen.has(id)) continue;
    seen.add(id);
    out.push({ id, name: label });
  }
  return out;
}

function parseAttribute(html, attrTitle) {
  // Find the section starting with the attribute title and capture until next attribute-title
  const idx = html.indexOf(`<div class="attribute-title">${attrTitle}`);
  if (idx === -1) return null;
  const tail = html.slice(idx);
  const next = tail.indexOf('<div class="attribute-title"', 50);
  const section = next === -1 ? tail.slice(0, 8000) : tail.slice(0, next);
  // Simple: each col has plain text content (no nested tags for these fields)
  const colRe = /<div class="col"[^>]*data-id="(\d+)"[^>]*>\s*([^<]+?)\s*<\/div>/g;
  const out = {};
  let m;
  while ((m = colRe.exec(section)) !== null) {
    const id = m[1];
    const val = m[2].trim();
    if (val) out[id] = val;
  }
  return out;
}

// Power format "208/283" → kW=208, hp=283
function parsePowerKwHp(s) {
  if (!s) return { kw: null, hp: null };
  const m = s.match(/(\d+)\s*\/\s*(\d+)/);
  if (!m) return { kw: null, hp: null };
  return { kw: parseInt(m[1], 10), hp: parseInt(m[2], 10) };
}

async function scrapeSeries(s) {
  console.error(`Fetching ${s.name} (${s.id})...`);
  const html = await fetchSeries(s);
  const models = parseModels(html);

  // Collect all candidate power tables, then per-model use first non-empty in priority order.
  const powerCandidates = [
    'Maximum power with DP ECE R 120 (kW/hp)',
    'Maximum power ECE R 120 (kW/hp)',
    'Maximum power (kW/hp)',
    'Rated power with DP ECE R 120 (kW/hp)',
    'Rated power ECE R 120 (kW/hp)',
    'Rated power (kW/hp)',
  ];
  const powerTables = powerCandidates.map((t) => ({ title: t, data: parseAttribute(html, t) || {} }));
  function pickPowerForModel(modelId) {
    for (const tbl of powerTables) {
      const v = tbl.data[modelId];
      if (v && /\d/.test(v)) return { value: v, source: tbl.title };
    }
    return { value: null, source: null };
  }

  // Extra useful spec: cylinders, displacement, weight
  const cyl = parseAttribute(html, 'Number of cylinders') || {};
  const disp = parseAttribute(html, 'Displacement (cm³)') || parseAttribute(html, 'Displacement') || {};
  const wt = parseAttribute(html, 'Empty weight') || parseAttribute(html, 'Total weight') || {};

  const enrichedModels = models.map((m) => {
    const picked = pickPowerForModel(m.id);
    const pwr = parsePowerKwHp(picked.value);
    return {
      api_id: m.id,
      name: `${m.name}`,
      slug: `fendt-${m.name.toLowerCase().replaceAll(' ', '-').replaceAll('.', '-')}`,
      power_hp: pwr.hp,
      power_kw: pwr.kw,
      power_source: picked.source,
      cylinders: cyl[m.id] ? parseInt(cyl[m.id], 10) : null,
      displacement: disp[m.id] || null,
      weight: wt[m.id] || null,
    };
  });

  return {
    category: s.category,
    yaml_slug: s.yaml_slug,
    api_id: s.id,
    name: s.name,
    family: s.family,
    family_label: s.family_label,
    year_from: s.year_from,
    year_to: null,
    models: enrichedModels,
  };
}

async function main() {
  const results = [];
  for (const s of SERIES) {
    try {
      const data = await scrapeSeries(s);
      results.push(data);
    } catch (e) {
      console.error(`ERROR ${s.name}: ${e.message}`);
      results.push({ ...s, error: e.message });
    }
  }
  const json = JSON.stringify(results, null, 2);
  writeFileSync('scripts/fendt-api-data.json', json);
  console.error(`\n→ Wrote ${results.length} series to scripts/fendt-api-data.json`);

  // Brief summary
  console.error('\nSummary:');
  for (const r of results) {
    if (r.error) {
      console.error(`  ✗ ${r.name}: ${r.error}`);
      continue;
    }
    const hps = r.models.map((m) => m.power_hp).filter((x) => x !== null);
    const range = hps.length ? `${Math.min(...hps)}-${Math.max(...hps)} hp` : 'no hp data';
    console.error(`  ✓ ${r.name}: ${r.models.length} models, ${range}`);
  }
}

main();
