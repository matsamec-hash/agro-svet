#!/usr/bin/env node
// John Deere traktor fotky (separate od kombajn pipeline)
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

const PHOTOS = {
  '5r': {
    maxHp: 125,
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/09/John_Deere_5125R_Agritechnica_2017_-_Left_side.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:John_Deere_5125R_Agritechnica_2017_-_Left_side.jpg',
    credit: 'MarcelX42',
    license: 'CC BY-SA 4.0',
  },
  '6m': {
    maxHp: 220,
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/John_Deere_6M_220_Agritechnica_2025_%28DSC09748%29.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:John_Deere_6M_220_Agritechnica_2025_(DSC09748).jpg',
    credit: 'MarcelX42',
    license: 'CC BY-SA 4.0',
  },
};

const OUT_DIR = 'public/images/stroje/john-deere';
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

  const filename = `john-deere-${slug}-${meta.maxHp}k.webp`;
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
