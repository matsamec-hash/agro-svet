#!/usr/bin/env node
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

const PHOTOS = {
  '3700': {
    maxHp: 100,
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/2018-11-09_%28101%29_Massey_Ferguson_3709_F_in_Wilhersdorf%2C_St._Margarethen_an_der_Sierning%2C_Austria.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:2018-11-09_(101)_Massey_Ferguson_3709_F_in_Wilhersdorf,_St._Margarethen_an_der_Sierning,_Austria.jpg',
    credit: 'GT1976',
    license: 'CC BY-SA 4.0',
  },
  '4700': {
    maxHp: 100,
    url: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Massey_Ferguson_4709_M_Agritechnica_2025_%28DSC09533%29.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:Massey_Ferguson_4709_M_Agritechnica_2025_(DSC09533).jpg',
    credit: 'MarcelX42',
    license: 'CC BY-SA 4.0',
  },
  '5700': {
    maxHp: 130,
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/MF_5713_SL.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:MF_5713_SL.jpg',
    credit: 'DynaVT',
    license: 'CC BY-SA 4.0',
  },
  'ideal-mf': {
    maxHp: 626,
    url: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Massey_Ferguson_Ideal_9T.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:Massey_Ferguson_Ideal_9T.jpg',
    credit: 'Bene Riobó',
    license: 'CC BY-SA 4.0',
  },
};

const OUT_DIR = 'public/images/stroje/massey-ferguson';
const TARGET_W = 1280, TARGET_H = 720, QUALITY = 82;
const argv = process.argv.slice(2);
const onlySlugs = argv.length ? argv.flatMap((a) => a.split(',')) : Object.keys(PHOTOS);
mkdirSync(OUT_DIR, { recursive: true });
let downloaded = 0, failed = 0;

for (const slug of onlySlugs) {
  const meta = PHOTOS[slug];
  if (!meta) { console.error(`✗ Neznámý: ${slug}`); failed++; continue; }
  const filename = `massey-ferguson-${slug}-${meta.maxHp}k.webp`;
  const outPath = `${OUT_DIR}/${filename}`;
  try {
    console.log(`→ ${slug}`);
    const res = await fetch(meta.url, { headers: { 'User-Agent': 'agro-svet-bot/1.0 (https://agro-svet.cz; matejsamec@seznam.cz)', 'Accept': 'image/*' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf).resize(TARGET_W, TARGET_H, { fit: 'cover', position: 'center' }).webp({ quality: QUALITY }).toFile(outPath);
    console.log(`  ✓ ${outPath}\n`);
    downloaded++;
  } catch (e) { console.error(`  ✗ ${slug}: ${e.message}\n`); failed++; }
}
console.log(`✓ ${downloaded}  ✗ ${failed}`);
