#!/usr/bin/env node
// Phase A — Pro každé plemeno z src/data/plemena/*.yaml dotáhne fotku přes Wikidata P18.
// Resize 800×600 cover webp q82 → public/images/plemena/{druh}/{slug}.webp.
// Patchne YAML: image_url (relativní path), image_credit, image_license, image_source_url.
// Loguje chybějící P18 → /tmp/plemena-missing-photos.json pro Phase B (OpenAI).
//
// Usage: node scripts/plemena-photos-wikidata.mjs [--dry-run] [--only=hovezi,kone]

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'yaml';
import sharp from 'sharp';

const DATA_DIR = 'src/data/plemena';
const OUT_DIR_REL = 'images/plemena';
const OUT_DIR_ABS = `public/${OUT_DIR_REL}`;
const UA = 'agro-svet-bot/1.0 (https://agro-svet.cz; matejsamec@seznam.cz)';
const SIZE_W = 800;
const SIZE_H = 600;
const QUALITY = 82;
const DRY_RUN = process.argv.includes('--dry-run');
const ONLY_ARG = process.argv.find((a) => a.startsWith('--only='));
const ONLY = ONLY_ARG ? ONLY_ARG.slice(7).split(',') : null;

function stripHtml(s) {
  if (!s) return '';
  return String(s)
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseQid(url) {
  if (!url) return null;
  const m = String(url).match(/Q\d+/);
  return m ? m[0] : null;
}

async function fetchWikidataEntity(qid) {
  const url = `https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`Wikidata HTTP ${res.status}`);
  const data = await res.json();
  return data.entities?.[qid] ?? null;
}

const IMAGE_EXTS = /\.(jpe?g|png|webp|tiff?|gif)$/i;

function p18FromEntity(entity) {
  const claims = entity?.claims?.P18;
  if (!Array.isArray(claims) || claims.length === 0) return null;
  // Filter to actual photo files (skip .pdf/.svg/.djvu historical scans)
  const photoOnly = claims.filter((c) => IMAGE_EXTS.test(c?.mainsnak?.datavalue?.value || ''));
  if (photoOnly.length === 0) return null;
  const preferred = photoOnly.find((c) => c.rank === 'preferred');
  const chosen = preferred ?? photoOnly[0];
  return chosen?.mainsnak?.datavalue?.value ?? null;
}

async function fetchCommonsMeta(fileTitle) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1600&titles=${encodeURIComponent('File:' + fileTitle)}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`Commons HTTP ${res.status}`);
  const data = await res.json();
  const pages = data?.query?.pages || {};
  const page = Object.values(pages)[0];
  const info = page?.imageinfo?.[0];
  if (!info) return null;
  const meta = info.extmetadata || {};
  return {
    url: info.url,
    thumb: info.thumburl,
    descriptionUrl: info.descriptionurl,
    artist: stripHtml(meta.Artist?.value || meta.Credit?.value || 'Unknown'),
    license: stripHtml(meta.LicenseShortName?.value || 'See source'),
  };
}

async function downloadAndResize(srcUrl, outPath) {
  const res = await fetch(srcUrl, { headers: { 'User-Agent': UA, Accept: 'image/*' } });
  if (!res.ok) throw new Error(`download HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await sharp(buf)
    .resize(SIZE_W, SIZE_H, { fit: 'cover', position: 'center' })
    .webp({ quality: QUALITY })
    .toFile(outPath);
  const m = await sharp(outPath).metadata();
  return { width: m.width, height: m.height, bytes: m.size };
}

const druhFiles = ['hovezi.yaml', 'kone.yaml', 'prasata.yaml', 'ovce.yaml'];
const missing = [];
let totalOk = 0;
let totalFail = 0;
let totalSkipped = 0;

for (const file of druhFiles) {
  const path = join(DATA_DIR, file);
  const raw = readFileSync(path, 'utf-8');
  const doc = yaml.parseDocument(raw);
  const data = doc.toJS();
  const druhSlug = data.slug;
  if (ONLY && !ONLY.includes(druhSlug)) {
    console.log(`⏭  skip druh ${druhSlug} (--only filter)`);
    continue;
  }
  const outDir = join(OUT_DIR_ABS, druhSlug);
  if (!DRY_RUN) mkdirSync(outDir, { recursive: true });

  console.log(`\n=== ${druhSlug} (${data.plemena?.length ?? 0} plemen) ===`);

  for (let i = 0; i < (data.plemena?.length || 0); i++) {
    const p = data.plemena[i];
    const outRel = `/${OUT_DIR_REL}/${druhSlug}/${p.slug}.webp`;
    const outAbs = `public${outRel}`;

    if (existsSync(outAbs) && p.image_url === outRel) {
      console.log(`✓ ${p.slug}: already exists, skip`);
      totalSkipped++;
      continue;
    }

    const qid = parseQid(p.wikidata);
    if (!qid) {
      console.log(`⚠ ${p.slug}: no wikidata Q-id`);
      missing.push({ druh: druhSlug, slug: p.slug, name: p.name, reason: 'no-wikidata' });
      totalFail++;
      continue;
    }

    try {
      const entity = await fetchWikidataEntity(qid);
      const filename = p18FromEntity(entity);
      if (!filename) {
        console.log(`⚠ ${p.slug} (${qid}): no P18 image`);
        missing.push({ druh: druhSlug, slug: p.slug, name: p.name, qid, reason: 'no-p18' });
        totalFail++;
        await new Promise((r) => setTimeout(r, 200));
        continue;
      }
      const meta = await fetchCommonsMeta(filename);
      if (!meta) {
        console.log(`⚠ ${p.slug}: commons meta empty for ${filename}`);
        missing.push({ druh: druhSlug, slug: p.slug, name: p.name, qid, filename, reason: 'no-commons-meta' });
        totalFail++;
        await new Promise((r) => setTimeout(r, 200));
        continue;
      }
      const srcUrl = meta.thumb || meta.url;
      if (!DRY_RUN) {
        const dl = await downloadAndResize(srcUrl, outAbs);
        console.log(`✓ ${p.slug}: ${filename} (${meta.license}) → ${dl.width}×${dl.height}`);
      } else {
        console.log(`✓ ${p.slug} [dry]: ${filename} (${meta.license})`);
      }
      // Patch YAML node via Document API for safe inline edit
      const plemenoNode = doc.get('plemena').get(i);
      plemenoNode.set('image_url', outRel);
      plemenoNode.set('image_credit', meta.artist);
      plemenoNode.set('image_license', meta.license);
      plemenoNode.set('image_source_url', meta.descriptionUrl);
      totalOk++;
      await new Promise((r) => setTimeout(r, 250));
    } catch (e) {
      console.error(`✗ ${p.slug}: ${e.message}`);
      missing.push({ druh: druhSlug, slug: p.slug, name: p.name, qid, reason: 'error', error: e.message });
      totalFail++;
    }
  }

  if (!DRY_RUN) {
    writeFileSync(path, String(doc));
    console.log(`💾 ${file} saved`);
  }
}

if (!DRY_RUN) {
  writeFileSync('/tmp/plemena-missing-photos.json', JSON.stringify(missing, null, 2));
}

console.log(`\n──────────────────────────────────`);
console.log(`✓ OK:      ${totalOk}`);
console.log(`⏭ Skipped: ${totalSkipped}`);
console.log(`✗ Missing: ${totalFail}`);
console.log(`📝 Missing list → /tmp/plemena-missing-photos.json`);
