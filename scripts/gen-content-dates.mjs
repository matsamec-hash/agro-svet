#!/usr/bin/env node
// Generates src/generated/content-dates.json: for each content dataset, the date
// of the last git commit that touched its source data. The sitemap uses these as
// <lastmod> so a URL's lastmod only changes when its CONTENT actually changes —
// not on every deploy/request. Run before `astro build` (see package.json build).
//
// Resilient by design: if git history is unavailable (e.g. a shallow clone with
// no commit touching a path), that key is simply omitted and the sitemap helper
// falls back to `_fallback` (the HEAD commit date). Never throws the build.
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// dataset key -> source path(s). The git date is the most recent commit touching
// ANY of the listed paths (so multi-file datasets reflect their latest change).
const SOURCES = {
  stroje: ['src/data/stroje'],
  plemena: ['src/data/plemena'],
  plodiny: ['src/data/plodiny'],
  choroby: ['src/data/choroby'],
  vcelarstvi: ['src/data/vcelarstvi'],
  hlemyzdi: ['src/data/hlemyzdi.json'],
  farmy: ['src/data/farmy'],
  slovnik: ['src/lib/slovnik.ts', 'src/lib/slovnik-extra.ts'],
  'tier-lists': ['src/lib/tier-lists.ts'],
  kraje: ['src/lib/cap-dotace.ts'],
  encyklopedie: ['src/content/encyklopedie'],
  znacky: ['src/content/znacky'],
  dotace: ['src/content/dotace'],
  dotaceSk: ['src/content/dotace-sk'],
  puda: ['src/content/puda'],
  howto: ['src/content/howto'],
};

function gitDate(paths) {
  try {
    const out = execFileSync(
      'git',
      ['log', '-1', '--format=%cs', '--', ...paths],
      { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    ).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : null;
  } catch {
    return null;
  }
}

function headDate() {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs'], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : null;
  } catch {
    return null;
  }
}

const result = {};
const fallback = headDate() ?? new Date().toISOString().slice(0, 10);
result._fallback = fallback;

for (const [key, paths] of Object.entries(SOURCES)) {
  const d = gitDate(paths);
  if (d) result[key] = d;
}

const outDir = resolve(ROOT, 'src/generated');
mkdirSync(outDir, { recursive: true });
const outFile = resolve(outDir, 'content-dates.json');
writeFileSync(outFile, JSON.stringify(result, null, 2) + '\n');

const n = Object.keys(result).length - 1;
console.log(`gen-content-dates: wrote ${n} dataset dates (fallback ${fallback}) -> src/generated/content-dates.json`);
