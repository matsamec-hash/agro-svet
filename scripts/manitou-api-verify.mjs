#!/usr/bin/env node
// Quick structural validation for manitou.yaml.
// Usage: node scripts/manitou-api-verify.mjs

import jsyaml from 'js-yaml';
import { readFileSync } from 'node:fs';

const d = jsyaml.load(readFileSync('src/data/stroje/manitou.yaml', 'utf8'));
const cats = Object.keys(d.categories || {});
let series = 0, models = 0;
const subs = new Set();
for (const c of cats) {
  for (const s of d.categories[c].series) {
    series++;
    subs.add(s.subcategory);
    models += (s.models || []).length;
  }
}
console.log('slug:', d.slug);
console.log('name:', d.name);
console.log('Categories:', cats.length, '→', cats.join(', '));
console.log('Series:', series);
console.log('Models:', models);
console.log('Subcategories used:', [...subs].join(', '));
