#!/usr/bin/env node
// Audit fotek v `src/data/stroje/*.yaml` — u každé série ověří, že u fotky stojí
// doložený zdroj (odkaz na soubor), a vypíše, co na disku leží navíc.
//
// ‼️ Do 9/2026 tu byla tabulka `BRAND_OFFICIAL`, která fotce bez zdroje dosadila
// web výrobce a licenci „Editorial / press use". Taková licence neexistuje —
// byla to domněnka, ne doklad, a audit díky ní hlásil zelenou u fotek, ke kterým
// jsme neměli nic. Fotka bez `image_credit_url` je od teď nález, ne „brand
// fallback".
//
// Usage: node scripts/photos-audit.mjs

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';

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
      if (!s.image_credit_url) {
        issues.missing_source.push(`[${brandSlug}/${cat}] ${s.slug} → ${s.image_url} (bez odkazu na zdroj)`);
      } else {
        const src = new URL(s.image_credit_url).hostname.replace(/^www\./, '');
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
console.log(`✓ ${ok.length} fotek s doloženým zdrojem`);
console.log(`⚠ ${issues.missing_source.length} fotek bez odkazu na zdroj — nemají doložený původ`);
console.log(`✗ ${issues.no_image.length} current series without image (will use brand-color gradient)`);
console.log(`⊘ ${issues.orphaned_files.length} files on disk not referenced in YAML`);

if (issues.missing_source.length > 0) {
  console.log('\n== Bez odkazu na zdroj ==');
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
