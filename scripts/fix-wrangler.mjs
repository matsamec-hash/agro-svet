import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

// Cloudflare Pages reserves the "ASSETS" binding name.
// The Astro cloudflare adapter generates wrangler.json files with assets.binding = "ASSETS".
// This script renames it to avoid the conflict since Pages serves static assets natively.

function fixFile(filePath) {
  try {
    const content = JSON.parse(readFileSync(filePath, 'utf8'));
    if (content.assets?.binding === 'ASSETS') {
      content.assets.binding = 'STATIC_CONTENT';
      writeFileSync(filePath, JSON.stringify(content));
      console.log(`Fixed ASSETS binding in ${filePath}`);
    }
  } catch {}
}

function walk(dir) {
  try {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      try {
        if (statSync(full).isDirectory()) walk(full);
        else if (entry === 'wrangler.json') fixFile(full);
      } catch {}
    }
  } catch {}
}

walk('dist/server');
