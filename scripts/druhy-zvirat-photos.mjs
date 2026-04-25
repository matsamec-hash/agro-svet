#!/usr/bin/env node
// Stáhne fotky pro 3 druhy zvířat (hovězí, ovce, koně) z Wikimedia Commons.
// Resize 400×400 cover (square pro circular crop v UI), webp q82.
// Uloží do public/images/druhy/{slug}.webp

import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

// Square 400x400 — pro circular crop (legacy, malé tile vedle textu)
const PHOTOS_SQUARE = {
  hovezi: { url: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Cow_horned_portrait.jpg' },
  ovce:   { url: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Sheep_portrait_-_Flickr_-_stanzebla.jpg' },
  kone:   { url: 'https://upload.wikimedia.org/wikipedia/commons/3/37/Quarter_Horse_Belle_face.jpg' },
  prasata:{ url: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Iowa_Pig_%287341687640%29.jpg' },
};

// Wide 800x600 — pro full-bleed kartu s overlay textem (4:3 poměr)
const PHOTOS_WIDE = {
  hovezi: { url: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Cow_horned_portrait.jpg' },
  ovce:   { url: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Sheep_portrait_-_Flickr_-_stanzebla.jpg' },
  kone:   { url: 'https://upload.wikimedia.org/wikipedia/commons/3/37/Quarter_Horse_Belle_face.jpg' },
  prasata:{ url: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Iowa_Pig_%287341687640%29.jpg' },
};

const PHOTOS = PHOTOS_SQUARE; // backwards-compat: vyrobí square (legacy plemena/index.astro)
const OUT_DIR = 'public/images/druhy';
const SIZE = 400;
const QUALITY = 82;
const UA = 'agro-svet-bot/1.0 (https://agro-svet.cz; matejsamec@seznam.cz)';

mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(`${OUT_DIR}/wide`, { recursive: true });

// Square (400x400) pro circular crops
for (const [slug, meta] of Object.entries(PHOTOS_SQUARE)) {
  const out = `${OUT_DIR}/${slug}.webp`;
  console.log(`→ ${slug} (square): ${meta.url}`);
  try {
    const res = await fetch(meta.url, { headers: { 'User-Agent': UA, Accept: 'image/*' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf).resize(SIZE, SIZE, { fit: 'cover', position: 'center' }).webp({ quality: QUALITY }).toFile(out);
    const m = await sharp(out).metadata();
    console.log(`  ✓ saved ${out} → ${m.width}×${m.height}\n`);
  } catch (e) {
    console.error(`  ✗ ${slug} failed: ${e.message}\n`);
  }
}

// Wide (800x600) pro full-bleed kartu — 4:3
for (const [slug, meta] of Object.entries(PHOTOS_WIDE)) {
  const out = `${OUT_DIR}/wide/${slug}.webp`;
  console.log(`→ ${slug} (wide): ${meta.url}`);
  try {
    const res = await fetch(meta.url, { headers: { 'User-Agent': UA, Accept: 'image/*' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf).resize(800, 600, { fit: 'cover', position: 'center' }).webp({ quality: QUALITY }).toFile(out);
    const m = await sharp(out).metadata();
    console.log(`  ✓ saved ${out} → ${m.width}×${m.height}\n`);
  } catch (e) {
    console.error(`  ✗ ${slug} failed: ${e.message}\n`);
  }
}
