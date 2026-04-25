#!/usr/bin/env node
// Fetch brand metadata for 22 agricultural brands from Wikidata SPARQL.
// Outputs scripts/wikidata-brands.json
//
// Usage: node scripts/wikidata-brands.mjs

import { writeFileSync } from 'node:fs';

const BRAND_QIDS = {
  // tractor brands
  'john-deere':       'Q496302',   // Deere & Company
  'claas':            'Q704756',
  'fendt':            'Q666948',
  'zetor':            'Q196868',
  'new-holland':      'Q1423217',
  'kubota':           'Q1514221',
  'case-ih':          'Q1046997',
  'massey-ferguson':  'Q579509',
  'deutz-fahr':       'Q645697',
  'valtra':           'Q385867',
  // implement / equipment brands
  'lemken':           'Q1816878',
  'pottinger':        'Q2120863',  // Pöttinger Landtechnik
  'kuhn':             'Q1669214',  // Kuhn — French agricultural machinery manufacturer
  'amazone':          'Q456458',   // Amazonen-Werke
  'krone':            'Q1767448',  // Krone Agriculture
  'horsch':           'Q1628943',
  'vaderstad':        'Q2535939',  // Väderstad
  'bednar':           'Q36877873', // BEDNAR FMT
  'manitou':          'Q599791',   // Manitou Group
  'jcb':              'Q1542317',  // J.C. Bamford Excavators
  'joskin':           'Q1708740',
  'kverneland':       'Q1794840',  // Kverneland Group
};

const SPARQL_ENDPOINT = 'https://query.wikidata.org/sparql';
const UA = 'agro-svet-bot/1.0 (+https://agro-svet.cz/)';

function buildQuery(qid) {
  return `
SELECT ?brandLabel ?countryLabel ?founded ?website WHERE {
  VALUES ?brand { wd:${qid} }
  OPTIONAL { ?brand wdt:P17 ?country }
  OPTIONAL { ?brand wdt:P571 ?founded }
  OPTIONAL { ?brand wdt:P856 ?website }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "cs,en". }
} LIMIT 1
`.trim();
}

function parseYear(isoDate) {
  if (!isoDate) return null;
  const m = String(isoDate).match(/^([+-]?\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

async function fetchBrand(slug, qid) {
  const query = buildQuery(qid);
  const url = `${SPARQL_ENDPOINT}?query=${encodeURIComponent(query)}&format=json`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': UA,
      Accept: 'application/sparql-results+json',
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  const bindings = json?.results?.bindings;
  if (!bindings || bindings.length === 0) {
    return { slug, _note: 'no Wikidata entry' };
  }
  const row = bindings[0];
  const result = { slug };
  const name = row.brandLabel?.value;
  // Wikidata returns the raw Q-ID (e.g. "Q196868") when the entity has no label in the requested languages
  if (name && !/^Q\d+$/.test(name)) result.name = name;
  const country = row.countryLabel?.value;
  if (country && !/^Q\d+$/.test(country)) result.country = country;
  const founded = parseYear(row.founded?.value);
  if (founded !== null) result.founded = founded;
  const website = row.website?.value;
  if (website) result.website = website;
  return result;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const output = {};
  const slugs = Object.keys(BRAND_QIDS);

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    const qid = BRAND_QIDS[slug];

    if (qid === null) {
      output[slug] = { slug, _note: 'no Wikidata entry' };
      console.log(`[wikidata] ${slug} — skipped (no Wikidata)`);
      continue;
    }

    try {
      const data = await fetchBrand(slug, qid);
      output[slug] = data;
      if (data._note) {
        console.log(`[wikidata] ${slug} — skipped (${data._note})`);
      } else {
        const parts = [data.name || slug];
        const meta = [data.country, data.founded].filter(Boolean).join(', ');
        if (meta) parts.push(`(${meta})`);
        console.log(`[wikidata] ${slug} — ${parts.join(' ')}`);
      }
    } catch (err) {
      console.warn(`[wikidata] WARNING ${slug} — fetch failed: ${err.message}`);
      output[slug] = { slug, _error: err.message };
    }

    // Rate limit: 1 req/s (skip sleep after last item)
    if (i < slugs.length - 1) {
      await sleep(1000);
    }
  }

  const json = JSON.stringify(output, null, 2);
  writeFileSync('scripts/wikidata-brands.json', json);
  const count = Object.keys(output).length;
  console.log(`Wrote scripts/wikidata-brands.json (${count} brands)`);
}

main();
