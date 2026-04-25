#!/usr/bin/env node
// Audit all photo image_url fields across stroje/*.yaml — list photo files and confirm
// each has a known/legal source. Output: report of OK / MISSING source / on-disk-but-not-in-YAML.
//
// Usage: node scripts/photos-audit.mjs

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';

const BRAND_OFFICIAL = {
  'john-deere':       { source: 'deere.cz',       license: 'Editorial / press use', url: 'https://www.deere.cz/cs/traktory/' },
  fendt:              { source: 'fendt.com',      license: 'Editorial / press use', url: 'https://www.fendt.com/cz/traktory' },
  claas:              { source: 'claas.com',      license: 'Editorial / press use', url: 'https://www.claas.com/cs-cz/zemedelske-stroje/traktory' },
  zetor:              { source: 'zetor.com',      license: 'Editorial / press use', url: 'https://www.zetor.com/cs/zetor-products' },
  'massey-ferguson':  { source: 'masseyferguson.com', license: 'Editorial / press use', url: 'https://www.masseyferguson.com/en.html' },
  'new-holland':      { source: 'newhollandag.com', license: 'Editorial / press use', url: null },
  'case-ih':          { source: 'caseih.com',     license: 'Editorial / press use', url: null },
  'deutz-fahr':       { source: 'deutz-fahr.com', license: 'Editorial / press use', url: null },
  valtra:             { source: 'valtra.com',     license: 'Editorial / press use', url: null },
  kubota:             { source: 'kubota.com',     license: 'Editorial / press use', url: null },
};

const STROJE_DIR = 'src/data/stroje';
const PHOTO_DIR = 'public/images/stroje';

const issues = { missing_source: [], orphaned_files: [], no_image: [] };
const ok = [];

const yamlFiles = readdirSync(STROJE_DIR).filter((f) => f.endsWith('.yaml') && !f.endsWith('.bak'));
const photosInYaml = new Set();

for (const file of yamlFiles) {
  const brandSlug = file.replace('.yaml', '');
  const brand = yaml.load(readFileSync(join(STROJE_DIR, file), 'utf-8'));
  const cats = ['traktory', 'kombajny'];
  for (const cat of cats) {
    const series = brand?.categories?.[cat]?.series || [];
    for (const s of series) {
      if (!s.image_url) {
        if (s.year_to === null) issues.no_image.push(`[${brandSlug}/${cat}] ${s.slug} (current, no photo)`);
        continue;
      }
      photosInYaml.add(s.image_url);
      const credit = s.image_credit_url || BRAND_OFFICIAL[brandSlug]?.url;
      if (!credit) {
        issues.missing_source.push(`[${brandSlug}/${cat}] ${s.slug} → ${s.image_url} (no credit URL)`);
      } else {
        const src = s.image_credit_url ? new URL(s.image_credit_url).hostname.replace(/^www\./, '') : BRAND_OFFICIAL[brandSlug].source;
        ok.push(`[${brandSlug}] ${s.slug}: ${s.image_url.split('/').pop()} ← ${src}`);
      }
    }
  }
}

// Find files on disk not referenced in YAML
const brandDirs = readdirSync(PHOTO_DIR).filter((d) => existsSync(join(PHOTO_DIR, d)) && !d.endsWith('.webp'));
for (const brandDir of brandDirs) {
  if (brandDir === 'brands') continue;
  const files = readdirSync(join(PHOTO_DIR, brandDir)).filter((f) => f.endsWith('.webp'));
  for (const f of files) {
    const path = `/images/stroje/${brandDir}/${f}`;
    if (!photosInYaml.has(path)) {
      issues.orphaned_files.push(path);
    }
  }
}

console.log('==== Photos audit ====\n');
console.log(`✓ ${ok.length} photos with proper attribution`);
console.log(`⚠ ${issues.missing_source.length} photos missing source URL (using brand fallback)`);
console.log(`✗ ${issues.no_image.length} current series without image (will use brand-color gradient)`);
console.log(`⊘ ${issues.orphaned_files.length} files on disk not referenced in YAML`);

if (issues.missing_source.length > 0) {
  console.log('\n== Missing source URL ==');
  for (const x of issues.missing_source.slice(0, 20)) console.log(`  ${x}`);
}
if (issues.no_image.length > 0) {
  console.log('\n== Current series without image (top 30) ==');
  for (const x of issues.no_image.slice(0, 30)) console.log(`  ${x}`);
}
if (issues.orphaned_files.length > 0) {
  console.log('\n== Orphaned files (on disk, not in YAML) ==');
  for (const x of issues.orphaned_files.slice(0, 30)) console.log(`  ${x}`);
}
console.log('\n== Sample OK ==');
for (const x of ok.slice(0, 15)) console.log(`  ${x}`);
