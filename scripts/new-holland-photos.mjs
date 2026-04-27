#!/usr/bin/env node
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

const PHOTOS = {
  't4': {
    maxHp: 117,
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/New_Holland_T4.115_Traktor.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:New_Holland_T4.115_Traktor.jpg',
    credit: 'JoachimKohler-HB',
    license: 'CC BY-SA 4.0',
  },
  't5': {
    maxHp: 145,
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/New_Holland_T5.120_Dual_Command_Agritechnica_2025_%28DSC08332%29.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:New_Holland_T5.120_Dual_Command_Agritechnica_2025_(DSC08332).jpg',
    credit: 'MarcelX42',
    license: 'CC BY-SA 4.0',
  },
  't6': {
    maxHp: 180,
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/80/New_Holland_T6.180.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:New_Holland_T6.180.jpg',
    credit: 'Bene Riobó',
    license: 'CC BY-SA 4.0',
  },
  't9': {
    maxHp: 700,
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Agritechnica_2013_by-RaBoe_167.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:Agritechnica_2013_by-RaBoe_167.jpg',
    credit: 'Ra Boe / Wikipedia',
    license: 'CC BY-SA 3.0 de',
  },
  'cx': {
    maxHp: 490,
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/New_Holland_CX8.90_Agritechnica_2025_%28DSC08411%29.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:New_Holland_CX8.90_Agritechnica_2025_(DSC08411).jpg',
    credit: 'MarcelX42',
    license: 'CC BY-SA 4.0',
  },
  'cr': {
    maxHp: 775,
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/New_Holland_CR9.90_agra_2024_%28DSC03583%29.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:New_Holland_CR9.90_agra_2024_(DSC03583).jpg',
    credit: 'MarcelX42',
    license: 'CC BY-SA 4.0',
  },
};

const OUT_DIR = 'public/images/stroje/new-holland';
const TARGET_W = 1280, TARGET_H = 720, QUALITY = 82;
const argv = process.argv.slice(2);
const onlySlugs = argv.length ? argv.flatMap((a) => a.split(',')) : Object.keys(PHOTOS);
mkdirSync(OUT_DIR, { recursive: true });
let downloaded = 0, failed = 0;

for (const slug of onlySlugs) {
  const meta = PHOTOS[slug];
  if (!meta) { console.error(`✗ Neznámý: ${slug}`); failed++; continue; }
  const filename = `new-holland-${slug}-${meta.maxHp}k.webp`;
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
