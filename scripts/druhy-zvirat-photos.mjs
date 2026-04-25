#!/usr/bin/env node
// Stáhne fotky pro 3 druhy zvířat (hovězí, ovce, koně) z Wikimedia Commons.
// Resize 400×400 cover (square pro circular crop v UI), webp q82.
// Uloží do public/images/druhy/{slug}.webp

import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

const PHOTOS = {
  hovezi: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Cow_horned_portrait.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:Cow_horned_portrait.jpg',
  },
  ovce: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Sheep_portrait_-_Flickr_-_stanzebla.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:Sheep_portrait_-_Flickr_-_stanzebla.jpg',
  },
  kone: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Lipizzaner_Horse.jpg',
    credit_url: 'https://commons.wikimedia.org/wiki/File:Lipizzaner_Horse.jpg',
  },
};

const OUT_DIR = 'public/images/druhy';
const SIZE = 400;
const QUALITY = 82;
const UA = 'agro-svet-bot/1.0 (https://agro-svet.cz; matejsamec@seznam.cz)';

mkdirSync(OUT_DIR, { recursive: true });

for (const [slug, meta] of Object.entries(PHOTOS)) {
  const out = `${OUT_DIR}/${slug}.webp`;
  console.log(`→ ${slug}: ${meta.url}`);
  try {
    const res = await fetch(meta.url, { headers: { 'User-Agent': UA, Accept: 'image/*' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf).resize(SIZE, SIZE, { fit: 'cover', position: 'center' }).webp({ quality: QUALITY }).toFile(out);
    const m = await sharp(out).metadata();
    console.log(`  ✓ saved ${out} → ${m.width}×${m.height} webp\n`);
  } catch (e) {
    console.error(`  ✗ ${slug} failed: ${e.message}\n`);
  }
}
