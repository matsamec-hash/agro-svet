#!/usr/bin/env node
// Náhrada fotek stažených z webů výrobců (valtra.cz, deere.cz) za volně
// licencované snímky z Wikimedia Commons. Jednorázově, 10. 9. 2026.
import sharp from 'sharp';

const NAHRADY = {
  'public/images/stroje/valtra/valtra-n-gen3-201k.webp':
    'Valtra 4th generation N Series tractor.jpg',
  'public/images/stroje/valtra/valtra-g-series-145k.webp':
    'Valtra G135 Claas 3200F Disco-20260711-RM-154416.jpg',
  'public/images/stroje/valtra/valtra-q-series-305k.webp':
    'Valtra Q305.jpg',
  'public/images/stroje/john-deere/john-deere-x-series-690k.webp':
    'John Deere X9 1000 agra 2024 (DSC03838).jpg',
};

const UA = 'agro-svet-photo-replace/1.0 (info@samecdigital.com)';

for (const [out, title] of Object.entries(NAHRADY)) {
  const url = 'https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(title.replace(/ /g, '_'));
  const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (!res.ok) { console.error(`✗ ${title}: HTTP ${res.status}`); continue; }
  const buf = Buffer.from(await res.arrayBuffer());
  await sharp(buf).resize(1280, 720, { fit: 'cover', position: 'center' }).webp({ quality: 82 }).toFile(out);
  console.log(`✓ ${out} ← ${title}`);
}
