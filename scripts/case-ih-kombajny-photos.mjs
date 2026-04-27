#!/usr/bin/env node
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

const PHOTOS = {
  'axial-flow-150-250-series': {
    maxHp: 634,
    url: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Case_IH_Axial_Flow_8260_agra_2024_%28DSC01569%29.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:Case_IH_Axial_Flow_8260_agra_2024_(DSC01569).jpg',
    credit: 'MarcelX42',
    license: 'CC BY-SA 4.0',
  },
};

const OUT_DIR = 'public/images/stroje/case-ih';
const TARGET_W = 1280, TARGET_H = 720, QUALITY = 82;
const argv = process.argv.slice(2);
const onlySlugs = argv.length ? argv.flatMap((a) => a.split(',')) : Object.keys(PHOTOS);
mkdirSync(OUT_DIR, { recursive: true });
let downloaded = 0, failed = 0;

for (const slug of onlySlugs) {
  const meta = PHOTOS[slug];
  if (!meta) { console.error(`✗ Neznámý: ${slug}`); failed++; continue; }
  const filename = `case-ih-${slug}-${meta.maxHp}k.webp`;
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
