#!/usr/bin/env node
// Stáhne, resizne a uloží Valtra traktor fotky z Wikimedia Commons / oficiálních URL.
// Vypíše YAML snippet pro vložení do src/data/stroje/valtra.yaml.
//
// Standard: 1280×720 WebP quality 82, named valtra-{slug}-{maxHp}k.webp
//
// Usage: node scripts/valtra-photos.mjs [slug,...]

import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

const PHOTOS = {
  'n-gen2': {
    maxHp: 185,
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Valtra_4th_generation_N_Series_tractor.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:Valtra_4th_generation_N_Series_tractor.jpg',
    credit: 'Valtra Oy Ab',
    license: 'CC0',
  },
  'n-gen3': {
    maxHp: 201,
    url: 'https://www.valtra.cz/content/dam/Brands/Valtra/en/Products/NSeries/5th-gen-2021/valtra-n-series-tractor-5th-gen-hero-field-1600-900.jpg',
    credit_url: 'https://www.valtra.cz/produkty/nserie.html',
    credit: 'Valtra Oy Ab',
    license: 'Editorial / press use',
  },
  'a-series': {
    maxHp: 135,
    url: 'https://www.valtra.cz/content/dam/Brands/Valtra/en/Products/ASeries/2025/valtra-a-series-tractors-75-10-115-hp-1600x900.jpg',
    credit_url: 'https://www.valtra.cz/produkty/aserie.html',
    credit: 'Valtra Oy Ab',
    license: 'Editorial / press use',
  },
  'g-series': {
    maxHp: 145,
    url: 'https://www.valtra.cz/content/dam/Brands/Valtra/en/Products/gseries/2025/valtra-g-series-hero-2025_1600x900_1.jpg',
    credit_url: 'https://www.valtra.cz/produkty/gserie.html',
    credit: 'Valtra Oy Ab',
    license: 'Editorial / press use',
  },
  'q-series': {
    maxHp: 305,
    url: 'https://www.valtra.cz/content/dam/Brands/Valtra/en/Products/QSeries/Valtra-Q-Series-high-horsepower-tractor-Hero-1600x900.jpg',
    credit_url: 'https://www.valtra.cz/produkty/qserie.html',
    credit: 'Valtra Oy Ab',
    license: 'Editorial / press use',
  },
};

const OUT_DIR = 'public/images/stroje/valtra';
const TARGET_W = 1280;
const TARGET_H = 720;
const QUALITY = 82;

const argv = process.argv.slice(2);
const onlySlugs = argv.length ? argv.flatMap((a) => a.split(',')) : Object.keys(PHOTOS);

mkdirSync(OUT_DIR, { recursive: true });

const yamlSnippets = [];
let downloaded = 0;
let skipped = 0;
let failed = 0;

for (const slug of onlySlugs) {
  const meta = PHOTOS[slug];
  if (!meta) {
    console.error(`✗ Neznámý slug: ${slug} (chybí v PHOTOS mapě)`);
    failed++;
    continue;
  }
  if (!meta.url) {
    console.log(`⊘ ${slug}: URL chybí, přeskakuji`);
    skipped++;
    continue;
  }

  const filename = `valtra-${slug}-${meta.maxHp}k.webp`;
  const outPath = `${OUT_DIR}/${filename}`;

  try {
    console.log(`→ ${slug}: stahuji ${meta.url.replace(/^https?:\/\/[^/]+/, '')}`);
    const res = await fetch(meta.url, {
      headers: {
        'User-Agent': 'agro-svet-bot/1.0 (https://agro-svet.cz; matejsamec@seznam.cz) sharp/webp',
        'Accept': 'image/webp,image/avif,image/jpeg,image/*,*/*;q=0.8',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const buf = Buffer.from(await res.arrayBuffer());

    const meta_ = await sharp(buf).metadata();
    console.log(`  ↳ source ${meta_.width}×${meta_.height} ${meta_.format} ${(buf.length/1024).toFixed(0)}KB`);

    await sharp(buf)
      .resize(TARGET_W, TARGET_H, { fit: 'cover', position: 'center' })
      .webp({ quality: QUALITY })
      .toFile(outPath);

    const out = await sharp(outPath).metadata();
    console.log(`  ✓ saved ${outPath} → ${out.width}×${out.height} webp\n`);
    downloaded++;

    yamlSnippets.push({
      slug,
      yaml: `      image_url: /images/stroje/valtra/${filename}
      image_credit_url: ${meta.credit_url || meta.url}
      image_credit: "${meta.credit}"
      image_license: "${meta.license}"`,
    });
  } catch (e) {
    console.error(`  ✗ ${slug} failed: ${e.message}\n`);
    failed++;
  }
}

console.log('================================================================');
console.log(`✓ Downloaded: ${downloaded}   ⊘ Skipped: ${skipped}   ✗ Failed: ${failed}`);
console.log('================================================================\n');

if (yamlSnippets.length) {
  console.log('YAML SNIPPETY pro src/data/stroje/valtra.yaml:\n');
  for (const s of yamlSnippets) {
    console.log(`# → série "${s.slug}":`);
    console.log(s.yaml);
    console.log('');
  }
}
