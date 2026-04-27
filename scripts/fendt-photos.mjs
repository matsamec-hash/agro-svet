#!/usr/bin/env node
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

const PHOTOS = {
  '600-vario': {
    maxHp: 224,
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Fendt_620_Vario_Profi%2B_Agritechnica_2025_%28DSC06624%29.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:Fendt_620_Vario_Profi%2B_Agritechnica_2025_(DSC06624).jpg',
    credit: 'MarcelX42',
    license: 'CC BY-SA 4.0',
  },
  'c-series': {
    maxHp: 305,
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Fendt_5275_C_SL_Agritechnica_2023_%28DSC04067%29.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:Fendt_5275_C_SL_Agritechnica_2023_(DSC04067).jpg',
    credit: 'MarcelX42',
    license: 'CC BY-SA 4.0',
  },
  'ideal': {
    maxHp: 790,
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Fendt_Ideal_combine_harvester_1.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:Fendt_Ideal_combine_harvester_1.jpg',
    credit: 'Homoatrox',
    license: 'CC BY-SA 3.0',
  },
};

const OUT_DIR = 'public/images/stroje/fendt';
const TARGET_W = 1280;
const TARGET_H = 720;
const QUALITY = 82;

const argv = process.argv.slice(2);
const onlySlugs = argv.length ? argv.flatMap((a) => a.split(',')) : Object.keys(PHOTOS);

mkdirSync(OUT_DIR, { recursive: true });
let downloaded = 0, skipped = 0, failed = 0;

for (const slug of onlySlugs) {
  const meta = PHOTOS[slug];
  if (!meta) { console.error(`✗ Neznámý slug: ${slug}`); failed++; continue; }
  if (!meta.url) { console.log(`⊘ ${slug}: URL chybí`); skipped++; continue; }

  const filename = `fendt-${slug}-${meta.maxHp}k.webp`;
  const outPath = `${OUT_DIR}/${filename}`;

  try {
    console.log(`→ ${slug}: ${meta.url.replace(/^https?:\/\/[^/]+/, '')}`);
    const res = await fetch(meta.url, {
      headers: {
        'User-Agent': 'agro-svet-bot/1.0 (https://agro-svet.cz; matejsamec@seznam.cz) sharp/webp',
        'Accept': 'image/webp,image/avif,image/jpeg,image/*,*/*;q=0.8',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const m = await sharp(buf).metadata();
    console.log(`  ↳ ${m.width}×${m.height} ${m.format} ${(buf.length/1024).toFixed(0)}KB`);
    await sharp(buf).resize(TARGET_W, TARGET_H, { fit: 'cover', position: 'center' }).webp({ quality: QUALITY }).toFile(outPath);
    const o = await sharp(outPath).metadata();
    console.log(`  ✓ ${outPath} ${o.width}×${o.height}\n`);
    downloaded++;
  } catch (e) {
    console.error(`  ✗ ${slug}: ${e.message}\n`);
    failed++;
  }
}
console.log(`✓ ${downloaded}  ⊘ ${skipped}  ✗ ${failed}`);
