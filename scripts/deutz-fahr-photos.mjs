#!/usr/bin/env node
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

const PHOTOS = {
  'agrofarm': {
    maxHp: 115,
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Deutz-Fahr_Agrofarm_5105_Agritechnica_2023_%28DSC04942%29.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:Deutz-Fahr_Agrofarm_5105_Agritechnica_2023_(DSC04942).jpg',
    credit: 'MarcelX42',
    license: 'CC BY-SA 4.0',
  },
  '5g': {
    maxHp: 126,
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Deutz-Fahr_5100_G_Traktor.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:Deutz-Fahr_5100_G_Traktor.jpg',
    credit: 'JoachimKohler-HB',
    license: 'CC BY-SA 4.0',
  },
  '7': {
    maxHp: 263,
    url: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Deutz-Fahr_7250_TTV_agra_2024_%28DSC01050%29.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:Deutz-Fahr_7250_TTV_agra_2024_(DSC01050).jpg',
    credit: 'MarcelX42',
    license: 'CC BY-SA 4.0',
  },
  '8': {
    maxHp: 310,
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Deutz-Fahr_8280_TTV_-_Motori_sotto_l%27albero_2025_-_Castegnato.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:Deutz-Fahr_8280_TTV_-_Motori_sotto_l\'albero_2025_-_Castegnato.jpg',
    credit: 'Ensahequ',
    license: 'CC BY-SA 4.0',
  },
  '9': {
    maxHp: 336,
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Deutz_Fahr_Serie_9_110300.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:Deutz_Fahr_Serie_9_110300.jpg',
    credit: 'Reinhold Möller',
    license: 'CC BY-SA 4.0',
  },
  '6c': {
    maxHp: 143,
    url: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Deutz-Fahr_6115_C_Agritechnica_2025_%28DSC03580%29.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:Deutz-Fahr_6115_C_Agritechnica_2025_(DSC03580).jpg',
    credit: 'MarcelX42',
    license: 'CC BY-SA 4.0',
  },
  '5d': {
    maxHp: 97,
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Deutz-Fahr_5080D_Keyline_Agritechnica_2025_%28DSC08620%29.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:Deutz-Fahr_5080D_Keyline_Agritechnica_2025_(DSC08620).jpg',
    credit: 'MarcelX42',
    license: 'CC BY-SA 4.0',
  },
};

const OUT_DIR = 'public/images/stroje/deutz-fahr';
const TARGET_W = 1280, TARGET_H = 720, QUALITY = 82;
const argv = process.argv.slice(2);
const onlySlugs = argv.length ? argv.flatMap((a) => a.split(',')) : Object.keys(PHOTOS);
mkdirSync(OUT_DIR, { recursive: true });
let downloaded = 0, failed = 0;

for (const slug of onlySlugs) {
  const meta = PHOTOS[slug];
  if (!meta) { console.error(`✗ Neznámý: ${slug}`); failed++; continue; }
  const filename = `deutz-fahr-${slug}-${meta.maxHp}k.webp`;
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
