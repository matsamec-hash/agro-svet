#!/usr/bin/env node
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

const PHOTOS = {
  'b': {
    maxHp: 33,
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/A_Kubota_tractor_in_Brandenburg_01.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:A_Kubota_tractor_in_Brandenburg_01.jpg',
    credit: 'Kritzolina',
    license: 'CC BY-SA 4.0',
  },
  'l': {
    maxHp: 62,
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Kubota_L4610_Tractor_%285940912717%29.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:Kubota_L4610_Tractor_(5940912717).jpg',
    credit: 'Edmund Garman',
    license: 'CC BY 2.0',
  },
  'm4002': {
    maxHp: 74,
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Kubota_M4-063_Hydraulic_Shuttle_Agritechnica_2025_%28DSC06727%29.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:Kubota_M4-063_Hydraulic_Shuttle_Agritechnica_2025_(DSC06727).jpg',
    credit: 'MarcelX42',
    license: 'CC BY-SA 4.0',
  },
  'm6': {
    maxHp: 175,
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Kubota_M6-141_Utility_Agritechnica_2023_%28DSC06031%29.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:Kubota_M6-141_Utility_Agritechnica_2023_(DSC06031).jpg',
    credit: 'MarcelX42',
    license: 'CC BY-SA 4.0',
  },
  'm5002': {
    maxHp: 115,
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Kubota_M5-092_Agritechnica_2025_%28DSC04299%29.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:Kubota_M5-092_Agritechnica_2025_(DSC04299).jpg',
    credit: 'MarcelX42',
    license: 'CC BY-SA 4.0',
  },
  'm6002': {
    maxHp: 143,
    url: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Kubota_M6-142_Agritechnica_2023_%28DSC05314%29.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:Kubota_M6-142_Agritechnica_2023_(DSC05314).jpg',
    credit: 'MarcelX42',
    license: 'CC BY-SA 4.0',
  },
  'm8': {
    maxHp: 210,
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Tracteur_Kubota_M8-201.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:Tracteur_Kubota_M8-201.jpg',
    credit: 'Svenaimelescarottes',
    license: 'CC BY 4.0',
  },
  'mk': {
    maxHp: 105,
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Kubota_M5101_Narrow_Cab_-_Front_and_left_side.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:Kubota_M5101_Narrow_Cab_-_Front_and_left_side.jpg',
    credit: 'MarcelX42',
    license: 'CC BY-SA 4.0',
  },
  'dc': {
    maxHp: 105,
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Kubota_DC-60.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:Kubota_DC-60.jpg',
    credit: 'Love Krittaya',
    license: 'Public domain',
  },
};

const OUT_DIR = 'public/images/stroje/kubota';
const TARGET_W = 1280, TARGET_H = 720, QUALITY = 82;
const argv = process.argv.slice(2);
const onlySlugs = argv.length ? argv.flatMap((a) => a.split(',')) : Object.keys(PHOTOS);
mkdirSync(OUT_DIR, { recursive: true });
let downloaded = 0, failed = 0;

for (const slug of onlySlugs) {
  const meta = PHOTOS[slug];
  if (!meta) { console.error(`✗ Neznámý: ${slug}`); failed++; continue; }
  const filename = `kubota-${slug}-${meta.maxHp}k.webp`;
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
