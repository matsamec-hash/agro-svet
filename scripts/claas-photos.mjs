#!/usr/bin/env node
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

const PHOTOS = {
  'elios': {
    maxHp: 110,
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Claas_Elios_210_agra_2024_%28DSC01414%29.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:Claas_Elios_210_agra_2024_(DSC01414).jpg',
    credit: 'MarcelX42',
    license: 'CC BY-SA 4.0',
  },
  'avero': {
    maxHp: 204,
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Claas_Avero_240_Agritechnica_2017_Front_and_left_side.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:Claas_Avero_240_Agritechnica_2017_Front_and_left_side.jpg',
    credit: 'MarcelX42',
    license: 'CC BY-SA 4.0',
  },
  'tucano': {
    maxHp: 394,
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Claas_Tucano_450_in_Godewaersvelde.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:Claas_Tucano_450_in_Godewaersvelde.jpg',
    credit: 'Pierre André Leclercq',
    license: 'CC BY-SA 4.0',
  },
  'lexion-5000-8000': {
    maxHp: 790,
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Claas_Lexion_8800_Terra_Trac_Agritechnica_2025_%28DSC09624%29.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:Claas_Lexion_8800_Terra_Trac_Agritechnica_2025_(DSC09624).jpg',
    credit: 'MarcelX42',
    license: 'CC BY-SA 4.0',
  },
  'trion': {
    maxHp: 435,
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Claas_Trion_730_Terra_Trac_Agritechnica_2023_%28DSC04578%29.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:Claas_Trion_730_Terra_Trac_Agritechnica_2023_(DSC04578).jpg',
    credit: 'MarcelX42',
    license: 'CC BY-SA 4.0',
  },
};

const OUT_DIR = 'public/images/stroje/claas';
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

  const filename = `claas-${slug}-${meta.maxHp}k.webp`;
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
