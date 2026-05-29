#!/usr/bin/env node
// Phase B — Pro plemena bez Wiki fotky (Phase A missing list) generuje fotorealistický
// portrét přes OpenAI gpt-image-1.
// Reads /tmp/plemena-missing-photos.json (output of plemena-photos-wikidata.mjs).
// Skip plemena se slugem "ostatni" / "masna-plavaci" (catch-all bez konkrétního vzhledu).
// Po generaci resize 800×600 webp → public/images/plemena/{druh}/{slug}.webp
// + patchne YAML: image_url, image_credit="AI-generated (gpt-image-1)", image_license="Synthetic — do not redistribute".
//
// Usage: node --env-file=.env scripts/plemena-photos-openai.mjs [--dry-run] [--quality=medium]

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'yaml';
import sharp from 'sharp';

const DATA_DIR = 'src/data/plemena';
const OUT_DIR_REL = 'images/plemena';
const OUT_DIR_ABS = `public/${OUT_DIR_REL}`;
const QUALITY_ARG = process.argv.find((a) => a.startsWith('--quality='));
const IMAGE_QUALITY = QUALITY_ARG ? QUALITY_ARG.slice(10) : 'medium'; // low|medium|high
const DRY_RUN = process.argv.includes('--dry-run');
const SKIP_SLUGS = new Set(['ostatni', 'masna-plavaci']);

if (!process.env.OPENAI_API_KEY) {
  console.error('✗ OPENAI_API_KEY missing in env. Run with: node --env-file=.env scripts/plemena-photos-openai.mjs');
  process.exit(1);
}

const missing = JSON.parse(readFileSync('/tmp/plemena-missing-photos.json', 'utf-8'));
const targets = missing.filter((m) => !SKIP_SLUGS.has(m.slug));
console.log(`→ ${targets.length} plemen for AI generation (skipped ${missing.length - targets.length} catch-all)`);

// Cache YAML docs per druh — load once, save once
const druhFiles = {
  hovezi: 'hovezi.yaml',
  kone: 'kone.yaml',
  prasata: 'prasata.yaml',
  ovce: 'ovce.yaml',
};
const docs = {};
for (const [druh, file] of Object.entries(druhFiles)) {
  const path = join(DATA_DIR, file);
  docs[druh] = { path, doc: yaml.parseDocument(readFileSync(path, 'utf-8')) };
}

function plemenoDescription(druh, slug) {
  const data = docs[druh].doc.toJS();
  const p = (data.plemena || []).find((x) => x.slug === slug);
  return p;
}

function buildPrompt(druh, plemeno) {
  const druhCs = { hovezi: 'kráva (skot)', kone: 'kůň', prasata: 'prase', ovce: 'ovce' }[druh];
  const colorLine = plemeno.color ? `Barva: ${plemeno.color}.` : '';
  const originLine = plemeno.origin_country ? `Plemeno pocházející z: ${plemeno.origin_country}.` : '';
  const altNames = plemeno.alternative_names?.length ? ` (také: ${plemeno.alternative_names.join(', ')})` : '';
  const desc = (plemeno.description || '').replace(/\s+/g, ' ').slice(0, 400);
  return [
    `Profesionální fotorealistický portrét hospodářského zvířete — ${druhCs} plemene "${plemeno.name}"${altNames}.`,
    originLine,
    colorLine,
    `Plemenné znaky: ${desc}`,
    `Styl: pastorální fotografie ze středoevropské farmy, denní světlo, čisté zelené pozadí (pastvina nebo dvůr), jediné zvíře v centru kompozice, ostře zaostřené, naturalistický vzhled (NE kreslené, NE umělecké, NE 3D render). Bez textu, bez vodoznaku.`,
    `Formát: krajinný (landscape), 4:3 poměr stran.`,
  ]
    .filter(Boolean)
    .join(' ');
}

async function generateImage(prompt) {
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt,
      size: '1536x1024', // landscape 3:2 → resize down to 800x600 4:3 cover
      quality: IMAGE_QUALITY,
      n: 1,
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI HTTP ${res.status}: ${errText.slice(0, 300)}`);
  }
  const data = await res.json();
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) throw new Error('OpenAI: no b64_json in response');
  return Buffer.from(b64, 'base64');
}

async function processOne(item) {
  const plemeno = plemenoDescription(item.druh, item.slug);
  if (!plemeno) throw new Error(`plemeno not found in YAML: ${item.druh}/${item.slug}`);
  const prompt = buildPrompt(item.druh, plemeno);
  console.log(`\n→ ${item.druh}/${item.slug} (${item.name})`);
  console.log(`  prompt: ${prompt.slice(0, 140)}…`);
  if (DRY_RUN) {
    console.log(`  [dry-run] skip generation`);
    return;
  }
  const buf = await generateImage(prompt);
  const outDir = join(OUT_DIR_ABS, item.druh);
  mkdirSync(outDir, { recursive: true });
  const outRel = `/${OUT_DIR_REL}/${item.druh}/${item.slug}.webp`;
  const outAbs = `public${outRel}`;
  await sharp(buf).resize(800, 600, { fit: 'cover', position: 'center' }).webp({ quality: 82 }).toFile(outAbs);
  const m = await sharp(outAbs).metadata();
  console.log(`  ✓ saved → ${m.width}×${m.height}, ${(buf.length / 1024).toFixed(0)}KB src`);

  // Patch YAML
  const data = docs[item.druh].doc.toJS();
  const idx = (data.plemena || []).findIndex((x) => x.slug === item.slug);
  if (idx < 0) throw new Error(`YAML index lost for ${item.slug}`);
  const node = docs[item.druh].doc.get('plemena').get(idx);
  node.set('image_url', outRel);
  node.set('image_credit', 'AI-generated (gpt-image-1)');
  node.set('image_license', 'Synthetic — illustrative only');
  // Intentionally no image_source_url for AI images
}

let ok = 0;
let fail = 0;
for (const item of targets) {
  try {
    await processOne(item);
    ok++;
  } catch (e) {
    console.error(`  ✗ ${item.slug}: ${e.message}`);
    fail++;
  }
  // Polite rate-limit
  await new Promise((r) => setTimeout(r, 1500));
}

if (!DRY_RUN) {
  for (const [, { path, doc }] of Object.entries(docs)) {
    writeFileSync(path, String(doc));
  }
  console.log(`\n💾 YAML files saved`);
}

console.log(`\n──────────────────────────────────`);
console.log(`✓ Generated: ${ok}`);
console.log(`✗ Failed:    ${fail}`);
