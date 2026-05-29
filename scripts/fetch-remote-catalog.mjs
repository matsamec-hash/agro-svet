#!/usr/bin/env node
// Fetches Samec Digital cross-site catalog from samecdigital.com and writes
// it to src/data/remote-catalog.json. Used by auto-linker for cross-site
// linking (e.g. mention of "Naše kořeny" → link to nasekoreny.cz).
//
// Run manually when sister sites change:
//   node scripts/fetch-remote-catalog.mjs
//
// Or as part of CI before build. Fallback: existing JSON is preserved if
// fetch fails (build never broken by remote outage).

import { writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = resolve(__dirname, '..', 'src', 'data', 'remote-catalog.json');
const REMOTE_URL = 'https://samecdigital.com/catalog.json';
const TIMEOUT_MS = 10_000;

async function main() {
  console.log(`[fetch-remote-catalog] Fetching ${REMOTE_URL} ...`);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(REMOTE_URL, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    if (!Array.isArray(data?.entries)) {
      throw new Error('Invalid schema: entries missing or not array');
    }
    await writeFile(OUT_PATH, JSON.stringify(data, null, 2) + '\n', 'utf-8');
    console.log(`[fetch-remote-catalog] OK — ${data.entries.length} entries written to ${OUT_PATH}`);
  } catch (err) {
    clearTimeout(timer);
    console.warn(`[fetch-remote-catalog] FETCH FAILED: ${err.message}`);
    if (existsSync(OUT_PATH)) {
      console.warn(`[fetch-remote-catalog] Preserving existing ${OUT_PATH}`);
      process.exit(0);
    } else {
      console.warn(`[fetch-remote-catalog] No fallback — writing empty catalog`);
      const empty = { version: 'fallback-empty', entries: [] };
      await writeFile(OUT_PATH, JSON.stringify(empty, null, 2) + '\n', 'utf-8');
      process.exit(0);
    }
  }
}

main();
