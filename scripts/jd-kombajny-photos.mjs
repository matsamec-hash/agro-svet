#!/usr/bin/env node
// Stáhne, resizne a uloží John Deere kombajn fotky z deere.cz oficiálních URL.
// Vypíše YAML snippet pro vložení do src/data/stroje/john-deere.yaml.
//
// Standard: 1280×720 WebP quality 82, named john-deere-{slug}-{maxHp}k.webp
// Atribuce: "Deere & Company" / "Editorial / press use" + zdrojová URL
//
// Usage: node scripts/jd-kombajny-photos.mjs [slug,...]
//   bez argumentů → zpracuje všechny slug s dostupnou URL v PHOTOS níže
//   s argumenty (čárkou oddělené) → jen ty zadané slug

import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import sharp from 'sharp';

// Mapa kombajn-řada → { sourceUrl, maxHp z john-deere.yaml, credit info }
const PHOTOS = {
  'x-series': {
    maxHp: 690,
    url: 'https://www.deere.cz/assets/images/region-2/products/combines/x-series/1_r2g017677_large_large_6ee4881be97478d689a9fa242240d445788a66e1.jpg',
    credit: 'Deere & Company',
    license: 'Editorial / press use',
  },
  's-series': {
    maxHp: 543,
    url: 'https://images.unsplash.com/photo-1635174815469-6efd052297d4?q=80&w=2012&auto=format&fit=crop',
    credit: 'Unsplash',
    license: 'Unsplash License',
  },
  't-series': {
    maxHp: 360,
    url: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/John_Deere_T670i_at_harvest%2C_Boston%2C_Lincolnshire%2C_2011_a.jpg',
    credit: 'Wikimedia Commons',
    license: 'CC BY-SA 3.0',
  },
  'w-series': {
    maxHp: 300,
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/db/Olimac_Sonnenblumenpfl%C3%BCcker_Drago_Gold_an_John_Deere_M%C3%A4hdrescher.jpg',
    credit: 'Wikimedia Commons',
    license: 'CC BY-SA 4.0',
  },
  '9000-sts': {
    maxHp: 475,
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/73/John_Deere_9870_STS_with_625D.JPG',
    credit: 'Wikimedia Commons',
    license: 'CC BY-SA 3.0',
  },
  'wts': {
    maxHp: 360,
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/db/John_Deere_9680_WTS.JPG',
    credit: 'Wikimedia Commons',
    license: 'CC BY-SA 3.0',
  },
  '9000-kombajn': {
    maxHp: 290,
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Johndeere9600.JPG',
    credit: 'Wikimedia Commons',
    license: 'CC BY-SA 3.0',
  },
  'cts': {
    maxHp: 290,
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Cosechadora_John_Deere_9780_CTS%2C._Lugar_Delta_del_Ebro_%28Espa%C3%B1a%29.jpg',
    credit: 'Wikimedia Commons',
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

const yamlSnippets = [];
let downloaded = 0;
let skipped = 0;
let failed = 0;

for (const slug of onlySlugs) {
  const meta = PHOTOS[slug];
  if (!meta) {
    console.error(`✗ Neznámý slug: ${slug} (chybí v PHOTOS mapě)`);
    failed++;
    continue;
  }
  if (!meta.url) {
    console.log(`⊘ ${slug}: URL chybí, přeskakuji`);
    skipped++;
    continue;
  }

  const filename = `john-deere-${slug}-${meta.maxHp}k.webp`;
  const outPath = `${OUT_DIR}/${filename}`;

  try {
    console.log(`→ ${slug}: stahuji ${meta.url.replace(/^https?:\/\/[^/]+/, '')}`);
    const res = await fetch(meta.url, {
      headers: {
        // Wikimedia má strict UA policy — vyžaduje Mozilla-style + kontakt URL
        'User-Agent': 'agro-svet-bot/1.0 (https://agro-svet.cz; matejsamec@seznam.cz) sharp/webp',
        'Accept': 'image/webp,image/avif,image/jpeg,image/*,*/*;q=0.8',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const buf = Buffer.from(await res.arrayBuffer());

    const meta_ = await sharp(buf).metadata();
    console.log(`  ↳ source ${meta_.width}×${meta_.height} ${meta_.format} ${(buf.length/1024).toFixed(0)}KB`);

    await sharp(buf)
      .resize(TARGET_W, TARGET_H, { fit: 'cover', position: 'center' })
      .webp({ quality: QUALITY })
      .toFile(outPath);

    const out = await sharp(outPath).metadata();
    console.log(`  ✓ saved ${outPath} → ${out.width}×${out.height} webp\n`);
    downloaded++;

    yamlSnippets.push({
      slug,
      yaml: `      # → série "${slug}" v categories.kombajny.series přidat:
      image_url: /images/stroje/john-deere/${filename}
      image_credit_url: ${meta.url}
      image_credit: "Deere & Company"
      image_license: "Editorial / press use"`,
    });
  } catch (e) {
    console.error(`  ✗ ${slug} failed: ${e.message}\n`);
    failed++;
  }
}

console.log('================================================================');
console.log(`✓ Downloaded: ${downloaded}   ⊘ Skipped: ${skipped}   ✗ Failed: ${failed}`);
console.log('================================================================\n');

if (yamlSnippets.length) {
  console.log('YAML SNIPPETY pro src/data/stroje/john-deere.yaml');
  console.log('(pod kategorií categories.kombajny.series, ke konkrétní sérii podle slug):\n');
  for (const s of yamlSnippets) {
    console.log(s.yaml);
    console.log('');
  }
}
