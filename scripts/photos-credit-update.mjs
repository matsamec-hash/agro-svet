#!/usr/bin/env node
// Add image_credit_url field to YAML series whose image came from non-brand source
// (Wikipedia Commons, agromex.cz, etc.)

import { readFileSync, writeFileSync } from 'node:fs';
import yaml from 'js-yaml';

// Map: image filename → source URL
const CREDITS = {
  // Fendt — Wikipedia Commons
  'fendt-200-130k.webp':       'https://commons.wikimedia.org/wiki/File:Fendt_200_VFP_2-crop.jpg',
  'fendt-300-165k.webp':       'https://commons.wikimedia.org/wiki/File:Fendt_300_Vario-crop.jpg',
  'fendt-500-210k.webp':       'https://commons.wikimedia.org/wiki/File:Fendt_Cutter%2BFendt_500_Vario.jpg',
  'fendt-700-310k.webp':       'https://commons.wikimedia.org/wiki/File:Fendt_700_Vario_Gen7.jpg',
  'fendt-900-415k.webp':       'https://commons.wikimedia.org/wiki/File:Fendt_900_Vario_Transport_2013.jpg',
  'fendt-1000-517k.webp':      'https://commons.wikimedia.org/wiki/File:Fendt_1000_Vario_2.jpg',
  'fendt-1100-mt-673k.webp':   'https://commons.wikimedia.org/wiki/File:Fendt_1100_MT-2-crop.jpg',
  'fendt-900-mt-431k.webp':    'https://commons.wikimedia.org/wiki/File:Fendt_900_Vario_MT.jpg',
  'fendt-1000-gen4-550k.webp': 'https://commons.wikimedia.org/wiki/File:Fendt_1050_Vario_Agritechnica_2023_(DSC05118).jpg',
  'fendt-xylon-140k.webp':     'https://commons.wikimedia.org/wiki/File:Xylon_520.JPG',
  'fendt-favorit-700-175k.webp': 'https://commons.wikimedia.org/wiki/File:Fendt_Favorit_712_Vario-20180815-RM-152622.jpg',
  'fendt-farmer-115k.webp':    'https://commons.wikimedia.org/wiki/File:Fendt_Farmer_307_LSA.jpg',
  // CLAAS Atos — user-provided URL was Axion (same image, used for Atos placeholder)
  // 'claas-atos-110k.webp': '',  // Note: photo is generic Axion, may need replacement
};

const STROJE_DIR = 'src/data/stroje';
const yamlFiles = ['fendt.yaml']; // extend as needed

let updated = 0;
for (const file of yamlFiles) {
  const path = `${STROJE_DIR}/${file}`;
  const data = yaml.load(readFileSync(path, 'utf-8'));
  for (const cat of ['traktory', 'kombajny']) {
    for (const s of data?.categories?.[cat]?.series || []) {
      if (!s.image_url) continue;
      const fname = s.image_url.split('/').pop();
      const credit = CREDITS[fname];
      if (credit && s.image_credit_url !== credit) {
        s.image_credit_url = credit;
        updated++;
        console.log(`✓ ${cat}/${s.slug} ← ${credit.replace(/^https?:\/\/(www\.)?/, '')}`);
      }
    }
  }
  writeFileSync(path, yaml.dump(data, { lineWidth: -1, noRefs: true, sortKeys: false, quotingType: '"' }));
}
console.log(`\nUpdated ${updated} series with image_credit_url`);
