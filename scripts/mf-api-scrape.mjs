#!/usr/bin/env node
// Scrape Massey Ferguson product data from masseyferguson.com.
// MF doesn't have a JSON API like Fendt — uses HTML pages + brochure PDFs.
//
// Strategy:
//   1. Fetch product page HTML for each series.
//   2. Extract model variants (e.g. "MF 9S.285" → 285 hp from suffix).
//   3. Parse hp range banner from page header for series-level summary.
//   4. (TODO) Fall back to brochure PDF parsing for series without hp-in-name.
//
// Usage: node scripts/mf-api-scrape.mjs > scripts/mf-api-data.json

import { writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';

const BASE = 'https://www.masseyferguson.com/en';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0.0.0';

// Manually curated list of CURRENT MF series with metadata.
// Power_in_name: true if model variants encode hp (e.g. "5S.145").
const SERIES = [
  // === Traktory — S Series (current premium, hp encoded in name) ===
  { category: 'traktory', yaml_slug: '5s',          slug: 'mf-5s',        family: '5s', family_label: 'MF 5S', year_from: 2019, power_in_name: true,  prefix: 'MF 5S\\.' },
  { category: 'traktory', yaml_slug: '6s',          slug: 'mf-6s',        family: '6s', family_label: 'MF 6S', year_from: 2020, power_in_name: true,  prefix: 'MF 6S\\.' },
  { category: 'traktory', yaml_slug: '7s',          slug: 'mf-7s',        family: '7s', family_label: 'MF 7S', year_from: 2022, power_in_name: true,  prefix: 'MF 7S\\.' },
  { category: 'traktory', yaml_slug: '8s',          slug: 'mf-8s',        family: '8s', family_label: 'MF 8S', year_from: 2019, power_in_name: true,  prefix: 'MF 8S\\.' },
  { category: 'traktory', yaml_slug: '9s',          slug: 'mf-9s',        family: '9s', family_label: 'MF 9S', year_from: 2024, power_in_name: true,  prefix: 'MF 9S\\.' },
  { category: 'traktory', yaml_slug: '5m',          slug: 'mf-5m',        family: '5m', family_label: 'MF 5M', year_from: 2022, power_in_name: true,  prefix: 'MF 5M\\.' },
  // === M Series (current value range, classic numeric naming, hp NOT in name) ===
  { category: 'traktory', yaml_slug: '3700',        slug: 'mf-3700',      family: '3700', family_label: 'MF 3700', year_from: 2018, power_in_name: false },
  { category: 'traktory', yaml_slug: '4700',        slug: 'mf-4700-m',    family: '4700', family_label: 'MF 4700 M', year_from: 2018, power_in_name: false },
  { category: 'traktory', yaml_slug: '5700',        slug: 'mf-5700-m',    family: '5700', family_label: 'MF 5700 M', year_from: 2018, power_in_name: false },
  { category: 'traktory', yaml_slug: '6700',        slug: 'mf-6700-s',    family: '6700', family_label: 'MF 6700 S', year_from: 2018, power_in_name: false },
  { category: 'traktory', yaml_slug: '7700',        slug: 'mf-7700-s',    family: '7700', family_label: 'MF 7700 S', year_from: 2018, power_in_name: false },
  { category: 'traktory', yaml_slug: '8700',        slug: 'mf-8700-s',    family: '8700', family_label: 'MF 8700 S', year_from: 2018, power_in_name: false },
  // === Kombajny ===
  { category: 'kombajny', yaml_slug: 'activa',      slug: 'mf-activa',    family: 'activa', family_label: 'MF Activa',   year_from: 2020, power_in_name: false },
  { category: 'kombajny', yaml_slug: 'activa-s',    slug: 'mf-activa-s',  family: 'activa-s', family_label: 'MF Activa S', year_from: 2020, power_in_name: false },
  { category: 'kombajny', yaml_slug: 'beta',        slug: 'mf-beta',      family: 'beta', family_label: 'MF Beta', year_from: 2020, power_in_name: false },
  { category: 'kombajny', yaml_slug: 'beta-al4',    slug: 'mf-beta-al4',  family: 'beta-al4', family_label: 'MF Beta AL4', year_from: 2022, power_in_name: false },
  { category: 'kombajny', yaml_slug: 'ideal-mf',    slug: 'mf-ideal',     family: 'ideal-mf', family_label: 'MF IDEAL', year_from: 2018, power_in_name: false },
];

async function fetchPage(slug, kind) {
  const url = kind === 'tractor'
    ? `${BASE}/product/tractors/${slug}.html`
    : `${BASE}/product/combine-harvesters/${slug}.html`;
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'text/html' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.text();
}

function extractModelsByPrefix(html, prefixRegex) {
  // For S-series: model names like "MF 9S.285" — suffix is hp
  const re = new RegExp(`(${prefixRegex})(\\d+)`, 'g');
  const seen = new Set();
  const models = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    const name = `${m[1].replace(/\\\./g, '.')}${m[2]}`;
    if (seen.has(name)) continue;
    seen.add(name);
    const hp = parseInt(m[2], 10);
    models.push({
      name,
      slug: name.toLowerCase().replace(/\s/g, '-').replace(/\./g, '-'),
      power_hp: hp,
      power_kw: Math.round(hp * 0.7355),
    });
  }
  return models;
}

function extractHpRangeFromPage(html) {
  // Look for "X-Y hp" or "X hp" in page
  const m = html.match(/\b(\d{2,3})\s*[-–—]\s*(\d{2,3})\s*hp\b/);
  if (m) return { min: parseInt(m[1], 10), max: parseInt(m[2], 10) };
  return null;
}

function findBrochureUrl(html, slug) {
  const re = new RegExp(`/content/dam/[^"]*${slug}[^"]*\\.pdf`, 'i');
  const m = html.match(re);
  return m ? m[0] : null;
}

function findHeroImage(html, slug) {
  // Look for product hero/cutout image
  const re = new RegExp(`/content/dam/[^"]*${slug}[^"]*\\.(png|jpg|webp)`, 'i');
  const matches = [...html.matchAll(new RegExp(re, 'gi'))];
  // Prefer larger files / cutout-images
  const cutout = matches.find((m) => m[0].includes('cutout-images'));
  if (cutout) return cutout[0];
  return matches[0]?.[0] || null;
}

async function downloadPdf(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`PDF HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const fname = path.join(tmpdir(), `mf-brochure-${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`);
  await import('node:fs').then((fs) => fs.writeFileSync(fname, buf));
  return fname;
}

function pdfToText(pdfPath) {
  const r = spawnSync('/opt/homebrew/bin/pdftotext', ['-layout', pdfPath, '-'], { encoding: 'utf-8' });
  return r.stdout || '';
}

// Parse models + hp from MF brochure spec table.
// Looks for a line containing N "MF XXXX" model names, then a nearby "Maximum power" line.
function parseModelsFromBrochure(text) {
  const lines = text.split('\n');
  // Find header lines: contain ≥2 "MF ddd[d][ X]" patterns
  const headerRe = /\bMF\s+\d{4}[A-Z]?(?:\s+[A-Z])?/g;
  const powerRe = /\b(\d{2,4})\s*\(\d+\)/g;
  const candidates = [];
  for (let i = 0; i < lines.length; i++) {
    const matches = lines[i].match(headerRe) || [];
    if (matches.length >= 2) {
      candidates.push({ idx: i, models: [...new Set(matches.map((m) => m.replace(/\s+/g, ' ').trim()))] });
    }
  }
  if (candidates.length === 0) return [];

  // Pick first header candidate that has a "Maximum power" line within next 30 lines
  for (const c of candidates) {
    for (let j = c.idx; j < Math.min(c.idx + 30, lines.length); j++) {
      if (/Maximum (power|hp)/i.test(lines[j])) {
        // Extract hp values
        const hpMatches = [...lines[j].matchAll(powerRe)];
        if (hpMatches.length === c.models.length) {
          return c.models.map((name, k) => ({
            name,
            slug: name.toLowerCase().replace(/\s/g, '-'),
            power_hp: parseInt(hpMatches[k][1], 10),
            power_kw: Math.round(parseInt(hpMatches[k][1], 10) * 0.7355),
          }));
        }
        // Try alternative power patterns: "155 165 180 190"
        const altRe = /\b(\d{2,4})\b/g;
        const alt = [...lines[j].matchAll(altRe)].map((m) => parseInt(m[1], 10)).filter((v) => v >= 50 && v <= 700);
        if (alt.length === c.models.length) {
          return c.models.map((name, k) => ({
            name,
            slug: name.toLowerCase().replace(/\s/g, '-'),
            power_hp: alt[k],
            power_kw: Math.round(alt[k] * 0.7355),
          }));
        }
      }
    }
  }
  return [];
}

async function scrapeSeries(s) {
  console.error(`Fetching ${s.slug} (${s.category})...`);
  const kind = s.category === 'traktory' ? 'tractor' : 'combine';
  const html = await fetchPage(s.slug, kind);

  let models = [];
  if (s.power_in_name && s.prefix) {
    models = extractModelsByPrefix(html, s.prefix);
  }

  const hpRange = extractHpRangeFromPage(html);
  const brochureUrl = findBrochureUrl(html, s.slug.replace(/^mf-/, ''));
  const heroImage = findHeroImage(html, s.slug.replace(/^mf-/, ''));

  // If no models from HTML naming, try brochure PDF
  if (models.length === 0 && brochureUrl) {
    try {
      const fullPdfUrl = brochureUrl.startsWith('http') ? brochureUrl : `https://www.masseyferguson.com${brochureUrl}`;
      const pdfPath = await downloadPdf(fullPdfUrl);
      const text = pdfToText(pdfPath);
      models = parseModelsFromBrochure(text);
      console.error(`  PDF parsed: ${models.length} models`);
    } catch (e) {
      console.error(`  PDF failed: ${e.message}`);
    }
  }

  return {
    category: s.category,
    yaml_slug: s.yaml_slug,
    name: s.family_label,
    family: s.family,
    family_label: s.family_label,
    year_from: s.year_from,
    year_to: null,
    models,
    hpRange,
    brochureUrl: brochureUrl ? `https://www.masseyferguson.com${brochureUrl}` : null,
    heroImage: heroImage ? `https://www.masseyferguson.com${heroImage}` : null,
  };
}

async function main() {
  const results = [];
  for (const s of SERIES) {
    try {
      const data = await scrapeSeries(s);
      results.push(data);
    } catch (e) {
      console.error(`ERROR ${s.slug}: ${e.message}`);
      results.push({ ...s, error: e.message });
    }
  }
  writeFileSync('scripts/mf-api-data.json', JSON.stringify(results, null, 2));
  console.error(`\n→ Wrote ${results.length} series to scripts/mf-api-data.json`);

  console.error('\nSummary:');
  for (const r of results) {
    if (r.error) {
      console.error(`  ✗ [${r.category}] ${r.yaml_slug}: ${r.error}`);
      continue;
    }
    const hps = r.models.map((m) => m.power_hp).filter((x) => x !== null);
    const range = hps.length
      ? `${Math.min(...hps)}-${Math.max(...hps)} hp`
      : (r.hpRange ? `~${r.hpRange.min}-${r.hpRange.max} hp (banner only, no models)` : 'no hp data');
    const flags = [r.brochureUrl ? 'PDF' : null, r.heroImage ? 'IMG' : null].filter(Boolean).join('+');
    console.error(`  ✓ [${r.category}] ${r.yaml_slug}: ${r.models.length} models, ${range} ${flags ? `(${flags})` : ''}`);
  }
}

main();
