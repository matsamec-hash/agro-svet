#!/usr/bin/env node
// For each YAML series whose image_credit_url points to Wikimedia Commons,
// fetch author + license metadata via Commons API and add image_credit + image_license fields.
//
// Usage: node scripts/photos-wikimedia-meta.mjs

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';

const STROJE_DIR = 'src/data/stroje';

function stripHtml(s) {
  if (!s) return '';
  return s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

async function fetchCommonsMeta(fileTitle) {
  // fileTitle like "File:Fendt_700_Vario_Gen7.jpg"
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=extmetadata&titles=${encodeURIComponent(fileTitle)}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'agro-svet-bot/1.0 (matejsamec@example.com)' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const pages = data?.query?.pages || {};
  const page = Object.values(pages)[0];
  const meta = page?.imageinfo?.[0]?.extmetadata || {};
  const artist = stripHtml(meta.Artist?.value || '');
  const license = stripHtml(meta.LicenseShortName?.value || '');
  const credit = stripHtml(meta.Credit?.value || '');
  return { artist, license, credit };
}

function parseFileTitleFromUrl(url) {
  // https://commons.wikimedia.org/wiki/File:Foo.jpg → "File:Foo.jpg"
  const m = url.match(/\/wiki\/(File:[^?#]+)$/);
  if (!m) return null;
  return decodeURIComponent(m[1]);
}

const yamlFiles = readdirSync(STROJE_DIR).filter((f) => f.endsWith('.yaml') && !f.endsWith('.bak'));

let updated = 0;
let failed = 0;

for (const file of yamlFiles) {
  const path = join(STROJE_DIR, file);
  const data = yaml.load(readFileSync(path, 'utf-8'));
  let dirty = false;
  for (const cat of ['traktory', 'kombajny']) {
    for (const s of data?.categories?.[cat]?.series || []) {
      if (!s.image_credit_url || !s.image_credit_url.includes('commons.wikimedia.org')) continue;
      const fileTitle = parseFileTitleFromUrl(s.image_credit_url);
      if (!fileTitle) continue;
      try {
        const meta = await fetchCommonsMeta(fileTitle);
        const author = meta.artist || meta.credit || 'Unknown';
        const license = meta.license || 'See source';
        if (s.image_credit === author && s.image_license === license) continue;
        s.image_credit = author;
        s.image_license = license;
        console.log(`✓ ${file}/${s.slug}: ${author.slice(0, 40)} (${license})`);
        updated++;
        dirty = true;
        // Be polite to Commons API
        await new Promise((r) => setTimeout(r, 300));
      } catch (e) {
        console.error(`✗ ${file}/${s.slug}: ${e.message}`);
        failed++;
      }
    }
  }
  if (dirty) {
    writeFileSync(path, yaml.dump(data, { lineWidth: -1, noRefs: true, sortKeys: false, quotingType: '"' }));
  }
}

console.log(`\n→ Updated ${updated} series with Wikipedia author/license`);
if (failed) console.log(`✗ Failed: ${failed}`);
