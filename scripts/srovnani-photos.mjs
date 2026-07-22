#!/usr/bin/env node
// Stáhne 9 referenčních fotek pro vizuální srovnání plochy (AreaConverter).
// Landscape 16:10 cover, webp q80, responzivní varianty w400 + w800.
// Uloží do public/images/srovnani/{slug}__v-w{400,800}.webp
// Zdroj + licence + autor jsou vedeny v SROVNANI_CREDITS v komponentě.

import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

const PHOTOS = {
  'parkovaci-misto':   'https://upload.wikimedia.org/wikipedia/commons/6/6c/Aerial_view_of_an_empty_car_parking_lot.jpg',
  'tenisovy-kurt':     'https://upload.wikimedia.org/wikipedia/commons/a/a1/Empty_clay_tennis_court_in_Melbourne_Australia_looking_down_the_middle.jpg',
  'hokejove-kluziste': 'https://upload.wikimedia.org/wikipedia/commons/4/45/Ice_rink_in_Mann%2BHummel_Arena_T%C5%99eb%C3%AD%C4%8D%2C_T%C5%99eb%C3%AD%C4%8D_District.jpg',
  'fotbalove-hriste':  'https://upload.wikimedia.org/wikipedia/commons/2/29/Aerial_view_of_the_Chatham_Town_FC_football_pitch.jpg',
  'staromestske-nam':  'https://upload.wikimedia.org/wikipedia/commons/4/44/Prague_07-2016_View_from_Old_Town_Hall_Tower_img3.jpg',
  'vaclavske-nam':     'https://upload.wikimedia.org/wikipedia/commons/9/94/Wenceslas_Square%2C_Prague.jpg',
  'prazsky-hrad':      'https://upload.wikimedia.org/wikipedia/commons/3/35/Prag%2C_Prager_Burg%2C_Veitsdom_--_2019_--_6690.jpg',
};

const OUT_DIR = 'public/images/srovnani';
const WIDTHS = [400, 800];
const QUALITY = 80;
const UA = 'agro-svet-bot/1.0 (https://agro-svet.cz; matejsamec@seznam.cz)';

mkdirSync(OUT_DIR, { recursive: true });

for (const [slug, url] of Object.entries(PHOTOS)) {
  console.log(`→ ${slug}: ${url}`);
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'image/*' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    for (const w of WIDTHS) {
      const h = Math.round((w * 10) / 16); // 16:10
      const out = `${OUT_DIR}/${slug}__v-w${w}.webp`;
      await sharp(buf).resize(w, h, { fit: 'cover', position: 'centre' }).webp({ quality: QUALITY }).toFile(out);
    }
    console.log(`  ✓ ${slug} → w400 + w800`);
  } catch (e) {
    console.error(`  ✗ ${slug} failed: ${e.message}`);
  }
}
