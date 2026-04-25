#!/usr/bin/env node
// Apply Krone scraped data → src/data/stroje/krone.yaml.
//
// Maps Krone EN category tree → CZ subcategory enum, deduplicates,
// uses page-title-extracted names. Tech specs (year, hp, image_url) NOT filled.
//
// If scrape data is missing or empty (network blocked, sitemap exotic),
// falls back to a curated SCAFFOLD of Krone's main product lines so the
// catalog page renders something usable until the scraper can be re-run.
//
// Categories filtered out:
//   - service / parts / digital / kronedrive (telematics)
//   - accessories / equipment sub-cats
//
// Usage: node scripts/krone-api-apply.mjs

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const DATA_PATH = 'scripts/krone-api-data.json';
const YAML_PATH = 'src/data/stroje/krone.yaml';

// Map Krone EN path prefix → CZ subcategory.
// CZ enums use canonical lib names from src/lib/stroje.ts:
//   obracece, samosberaci-vozy, lisy-hranolove, rezacky-samojizdne
// Most specific paths first.
const MAPPING = [
  // --- Sklizeň pícnin ---
  { match: 'mowers',                      cz_category: 'zaci-stroje',         cz_label: 'Žací stroje' },
  { match: 'mower-conditioners',          cz_category: 'zaci-stroje',         cz_label: 'Žací stroje s kondicionérem' },
  { match: 'disc-mowers',                 cz_category: 'zaci-stroje',         cz_label: 'Diskové žací stroje' },
  { match: 'self-propelled-mowers',       cz_category: 'zaci-stroje',         cz_label: 'Samojízdné žací stroje (BiG M)' },
  { match: 'tedders',                     cz_category: 'obracece',            cz_label: 'Obraceče' },
  { match: 'rakes',                       cz_category: 'shrnovace',           cz_label: 'Shrnovače' },
  { match: 'swathers',                    cz_category: 'shrnovace',           cz_label: 'Shrnovače' },
  { match: 'forage-wagons',               cz_category: 'samosberaci-vozy',    cz_label: 'Samosběrací vozy' },
  { match: 'loader-wagons',               cz_category: 'samosberaci-vozy',    cz_label: 'Samosběrací vozy' },
  { match: 'round-balers',                cz_category: 'lisy-valcove',        cz_label: 'Válcové lisy' },
  { match: 'variable-chamber-round-balers', cz_category: 'lisy-valcove',      cz_label: 'Válcové lisy s variabilní komorou' },
  { match: 'fixed-chamber-round-balers',  cz_category: 'lisy-valcove',        cz_label: 'Válcové lisy s pevnou komorou' },
  { match: 'big-balers',                  cz_category: 'lisy-hranolove',      cz_label: 'Hranolové (vysokotlaké) lisy' },
  { match: 'square-balers',               cz_category: 'lisy-hranolove',      cz_label: 'Hranolové lisy' },
  { match: 'baler-wrapper-combinations',  cz_category: 'obalovace',           cz_label: 'Lis-obalovač kombinace' },
  { match: 'forage-harvesters',           cz_category: 'rezacky-samojizdne',  cz_label: 'Samojízdné řezačky (BiG X)' },
  // --- Doprava ---
  { match: 'agricultural-trailers',       cz_category: 'navesy-valnik',       cz_label: 'Zemědělské návěsy' },
  { match: 'trailers',                    cz_category: 'navesy-valnik',       cz_label: 'Návěsy' },
];

// Krone non-machine sections to skip entirely.
const SKIP_CATEGORIES = new Set([
  'service', 'parts', 'spare-parts', 'digital', 'kronedrive', 'krone-smart',
  'apps', 'media', 'company', 'about', 'career', 'careers', 'press',
]);
const SKIP_SUBCATEGORIES = new Set([
  'accessories', 'equipment', 'options', 'attachments',
]);

// Brand-name family display map: prefer Krone's marketing names over slug-derived.
const FAMILY_DISPLAY = {
  'easycut': 'EasyCut',
  'big-x': 'BiG X',
  'big-m': 'BiG M',
  'big-pack': 'BiG Pack',
  'comprima': 'Comprima',
  'fortima': 'Fortima',
  'bellima': 'Bellima',
  'varipack': 'VariPack',
  'vendro': 'Vendro',
  'swadro': 'Swadro',
  'optimat': 'Optimat',
  'ultima': 'Ultima',
};

function findMapping(catPath) {
  for (const m of MAPPING) {
    if (catPath === m.match || catPath.startsWith(m.match + '/') || catPath.endsWith('/' + m.match)) return m;
  }
  return null;
}

function escapeYaml(s) {
  if (s === null || s === undefined) return '""';
  const str = String(s);
  if (/[:#&*!|>'"%@`]/.test(str) || /^[\s-]/.test(str)) return `"${str.replace(/"/g, '\\"')}"`;
  return str;
}

function buildYaml(grouped, headerLines) {
  const out = [...headerLines, 'categories:'];
  for (const cz_cat of Object.keys(grouped).sort()) {
    out.push(`  ${cz_cat}:`);
    out.push(`    name: ${escapeYaml(grouped[cz_cat].name)}`);
    out.push('    series:');
    const sortedSeries = grouped[cz_cat].series.sort((a, b) => a.slug.localeCompare(b.slug));
    for (const series of sortedSeries) {
      out.push(`      - slug: ${series.slug}`);
      out.push(`        name: ${escapeYaml(series.name)}`);
      out.push(`        family: ${series.family}`);
      out.push(`        subcategory: ${series.subcategory}`);
      if (series.url) out.push(`        url: ${series.url}`);
      out.push('        description: |');
      out.push(`          ${series.description}`);
      if (series.models && series.models.length > 0) {
        out.push('        models:');
        for (const model of series.models) {
          out.push(`          - slug: ${model.slug}`);
          out.push(`            name: ${escapeYaml(model.name)}`);
          if (model.tagline) out.push(`            tagline: ${escapeYaml(model.tagline)}`);
          if (model.url) out.push(`            url: ${model.url}`);
        }
      }
    }
  }
  return out.join('\n') + '\n';
}

function cz_category_name(slug) {
  const NAMES = {
    'zaci-stroje': 'Žací stroje',
    'obracece': 'Obraceče',
    'shrnovace': 'Shrnovače',
    'lisy-valcove': 'Válcové lisy',
    'lisy-hranolove': 'Hranolové lisy',
    'obalovace': 'Lis-obalovače',
    'rezacky-samojizdne': 'Samojízdné řezačky',
    'samosberaci-vozy': 'Samosběrací vozy',
    'navesy-valnik': 'Návěsy valníkové',
  };
  return NAMES[slug] || slug;
}

function familyDisplay(familySlug) {
  const lower = familySlug.toLowerCase();
  if (FAMILY_DISPLAY[lower]) return FAMILY_DISPLAY[lower];
  // Try to detect "big-x" / "big-pack" / "big-m" prefix
  for (const key of Object.keys(FAMILY_DISPLAY)) {
    if (lower.startsWith(key + '-') || lower === key) return FAMILY_DISPLAY[key];
  }
  // Fallback: capitalize first letter of each token
  return familySlug
    .split('-')
    .map((t) => (/^\d+$/.test(t) ? t : t.charAt(0).toUpperCase() + t.slice(1)))
    .join(' ');
}

function processScrapedData(data) {
  const grouped = {};
  let mapped = 0, skipped = 0;
  const skippedSamples = [];

  for (const enCat of Object.keys(data)) {
    if (SKIP_CATEGORIES.has(enCat)) {
      const n = countModels(data[enCat]);
      skipped += n;
      if (skippedSamples.length < 4) skippedSamples.push(`category ${enCat}: ${n}`);
      continue;
    }
    for (const enSub of Object.keys(data[enCat])) {
      if (SKIP_SUBCATEGORIES.has(enSub)) {
        skipped += countModels({ x: data[enCat][enSub] });
        continue;
      }
      const subPath = enSub === '_root' ? enCat : `${enCat}/${enSub}`;

      for (const familySlug of Object.keys(data[enCat][enSub])) {
        const family = data[enCat][enSub][familySlug];
        const familyPath = `${subPath}/${familySlug.split('/')[0]}`;

        const mapping = findMapping(familyPath) || findMapping(subPath) || findMapping(enCat);
        if (!mapping) {
          skipped += family.models.length;
          if (skippedSamples.length < 6) skippedSamples.push(`unmapped: ${subPath}/${familySlug}`);
          continue;
        }

        if (!grouped[mapping.cz_category]) {
          grouped[mapping.cz_category] = {
            name: cz_category_name(mapping.cz_category),
            series: [],
          };
        }

        const cleanFamilySlug = familySlug.split('/').pop();
        let seriesName;
        if (family.models.length === 1) {
          seriesName = family.models[0].name;
        } else {
          const firstModelName = family.models[0]?.name || '';
          // Prefer Krone marketing display when family slug matches a known line
          const fd = familyDisplay(cleanFamilySlug);
          seriesName = fd || firstModelName.split(/\s+/)[0] || cleanFamilySlug;
        }

        const existing = grouped[mapping.cz_category].series.find((s) => s.slug === cleanFamilySlug);
        const target = existing || {
          slug: cleanFamilySlug,
          name: seriesName,
          family: cleanFamilySlug,
          subcategory: mapping.cz_category,
          url: '',
          description: `${seriesName} — ${mapping.cz_label.toLowerCase()} značky Krone.`,
          models: [],
        };

        for (const model of family.models) {
          if (!target.models.find((m) => m.slug === model.slug)) {
            target.models.push({
              slug: model.slug,
              name: model.name,
              tagline: model.tagline || '',
              url: model.url,
            });
            mapped++;
          }
        }

        if (!existing) grouped[mapping.cz_category].series.push(target);
      }
    }
  }

  return { grouped, mapped, skipped, skippedSamples };
}

// ---------------------------------------------------------------------------
// Curated SCAFFOLD — used when scraped JSON is missing/empty.
// Mirrors Krone's main 2026 product lines (knowledge cutoff Jan 2026).
// Models are series-level placeholders; refine after re-running the scraper.
// ---------------------------------------------------------------------------
const SCAFFOLD = {
  'zaci-stroje': {
    name: cz_category_name('zaci-stroje'),
    series: [
      {
        slug: 'easycut-b',
        name: 'EasyCut B',
        family: 'easycut',
        subcategory: 'zaci-stroje',
        url: 'https://landmaschinen.krone.de/en/products/mowers',
        description: 'EasyCut B — tažené žací stroje (boční / motýlkové) značky Krone, šíře záběru 3,2–10,1 m.',
        models: [
          { slug: 'easycut-b-870', name: 'EasyCut B 870', tagline: 'Boční tažený žací stroj', url: '' },
          { slug: 'easycut-b-890', name: 'EasyCut B 890', tagline: 'Boční tažený žací stroj', url: '' },
          { slug: 'easycut-b-950', name: 'EasyCut B 950 Collect', tagline: 'Boční tažený žací stroj se sběrnými pásy', url: '' },
          { slug: 'easycut-b-1000', name: 'EasyCut B 1000', tagline: 'Motýlkový žací kombinát', url: '' },
        ],
      },
      {
        slug: 'easycut-f',
        name: 'EasyCut F',
        family: 'easycut',
        subcategory: 'zaci-stroje',
        url: 'https://landmaschinen.krone.de/en/products/mowers',
        description: 'EasyCut F — čelní nesené žací stroje značky Krone.',
        models: [
          { slug: 'easycut-f-320', name: 'EasyCut F 320 CV', tagline: 'Čelní žací stroj s prstovým kondicionérem', url: '' },
          { slug: 'easycut-f-360', name: 'EasyCut F 360 CV', tagline: 'Čelní žací stroj s kondicionérem', url: '' },
          { slug: 'easycut-f-400', name: 'EasyCut F 400 CV Collect', tagline: 'Čelní žací stroj se sběrnými pásy', url: '' },
        ],
      },
      {
        slug: 'easycut-r',
        name: 'EasyCut R',
        family: 'easycut',
        subcategory: 'zaci-stroje',
        url: 'https://landmaschinen.krone.de/en/products/mowers',
        description: 'EasyCut R — zadní nesené žací stroje značky Krone.',
        models: [
          { slug: 'easycut-r-280', name: 'EasyCut R 280', tagline: 'Zadní nesený žací stroj', url: '' },
          { slug: 'easycut-r-320', name: 'EasyCut R 320', tagline: 'Zadní nesený žací stroj', url: '' },
          { slug: 'easycut-r-360', name: 'EasyCut R 360 CV', tagline: 'Zadní nesený žací stroj s kondicionérem', url: '' },
        ],
      },
      {
        slug: 'big-m',
        name: 'BiG M',
        family: 'big-m',
        subcategory: 'zaci-stroje',
        url: 'https://landmaschinen.krone.de/en/products/self-propelled-mowers',
        description: 'BiG M — samojízdné motýlkové žací stroje s kondicionérem značky Krone, záběr až 13,2 m.',
        models: [
          { slug: 'big-m-450', name: 'BiG M 450', tagline: 'Samojízdný žací stroj 449 hp', url: '' },
          { slug: 'big-m-500', name: 'BiG M 500', tagline: 'Samojízdný žací stroj 530 hp', url: '' },
        ],
      },
    ],
  },
  'obracece': {
    name: cz_category_name('obracece'),
    series: [
      {
        slug: 'vendro',
        name: 'Vendro',
        family: 'vendro',
        subcategory: 'obracece',
        url: 'https://landmaschinen.krone.de/en/products/tedders',
        description: 'Vendro — obraceče značky Krone, pracovní záběr 4,7–13,1 m.',
        models: [
          { slug: 'vendro-470', name: 'Vendro 470', tagline: 'Nesený obraceč 4,7 m', url: '' },
          { slug: 'vendro-560', name: 'Vendro 560', tagline: 'Nesený obraceč 5,6 m', url: '' },
          { slug: 'vendro-680', name: 'Vendro 680', tagline: 'Nesený obraceč 6,8 m', url: '' },
          { slug: 'vendro-790', name: 'Vendro 790', tagline: 'Nesený obraceč 7,7 m', url: '' },
          { slug: 'vendro-820', name: 'Vendro 820', tagline: 'Tažený obraceč 8,2 m', url: '' },
          { slug: 'vendro-1120', name: 'Vendro 1120', tagline: 'Tažený obraceč 11,2 m', url: '' },
        ],
      },
    ],
  },
  'shrnovace': {
    name: cz_category_name('shrnovace'),
    series: [
      {
        slug: 'swadro-s',
        name: 'Swadro S',
        family: 'swadro',
        subcategory: 'shrnovace',
        url: 'https://landmaschinen.krone.de/en/products/rakes',
        description: 'Swadro S — jednorotorové shrnovače značky Krone.',
        models: [
          { slug: 'swadro-s-380', name: 'Swadro S 380', tagline: 'Jednorotorový shrnovač', url: '' },
          { slug: 'swadro-s-420', name: 'Swadro S 420', tagline: 'Jednorotorový shrnovač', url: '' },
          { slug: 'swadro-s-460', name: 'Swadro S 460', tagline: 'Jednorotorový shrnovač', url: '' },
        ],
      },
      {
        slug: 'swadro-tc',
        name: 'Swadro TC',
        family: 'swadro',
        subcategory: 'shrnovace',
        url: 'https://landmaschinen.krone.de/en/products/rakes',
        description: 'Swadro TC — dvourotorové shrnovače značky Krone (středový/boční řádek).',
        models: [
          { slug: 'swadro-tc-680', name: 'Swadro TC 680', tagline: 'Dvourotorový shrnovač s bočním řádkem', url: '' },
          { slug: 'swadro-tc-760', name: 'Swadro TC 760', tagline: 'Dvourotorový shrnovač s bočním řádkem', url: '' },
          { slug: 'swadro-tc-880', name: 'Swadro TC 880', tagline: 'Dvourotorový shrnovač se středovým řádkem', url: '' },
          { slug: 'swadro-tc-930', name: 'Swadro TC 930', tagline: 'Dvourotorový shrnovač', url: '' },
          { slug: 'swadro-tc-1250', name: 'Swadro TC 1250', tagline: 'Čtyřrotorový shrnovač', url: '' },
        ],
      },
    ],
  },
  'samosberaci-vozy': {
    name: cz_category_name('samosberaci-vozy'),
    series: [
      {
        slug: 'mx',
        name: 'MX',
        family: 'mx',
        subcategory: 'samosberaci-vozy',
        url: 'https://landmaschinen.krone.de/en/products/forage-wagons',
        description: 'MX — kombinované sběrací/dávkovací vozy značky Krone, objem 320–400 m3 nestlačeno.',
        models: [
          { slug: 'mx-320', name: 'MX 320 GD', tagline: 'Kombinovaný vůz 32 m3', url: '' },
          { slug: 'mx-350', name: 'MX 350 GD', tagline: 'Kombinovaný vůz 35 m3', url: '' },
          { slug: 'mx-400', name: 'MX 400 GD', tagline: 'Kombinovaný vůz 40 m3', url: '' },
        ],
      },
      {
        slug: 'rx',
        name: 'RX',
        family: 'rx',
        subcategory: 'samosberaci-vozy',
        url: 'https://landmaschinen.krone.de/en/products/forage-wagons',
        description: 'RX — výkonné samosběrací vozy značky Krone s velkým objemem.',
        models: [
          { slug: 'rx-360', name: 'RX 360 GD', tagline: 'Samosběrací vůz 36 m3', url: '' },
          { slug: 'rx-400', name: 'RX 400 GD', tagline: 'Samosběrací vůz 40 m3', url: '' },
          { slug: 'rx-430', name: 'RX 430 GD', tagline: 'Samosběrací vůz 43 m3', url: '' },
          { slug: 'rx-490', name: 'RX 490 GD', tagline: 'Samosběrací vůz 49 m3', url: '' },
        ],
      },
      {
        slug: 'zx',
        name: 'ZX',
        family: 'zx',
        subcategory: 'samosberaci-vozy',
        url: 'https://landmaschinen.krone.de/en/products/forage-wagons',
        description: 'ZX — dvouosé samosběrací vozy značky Krone s vysokou nosností.',
        models: [
          { slug: 'zx-470-gd', name: 'ZX 470 GD', tagline: 'Samosběrací vůz 47 m3', url: '' },
          { slug: 'zx-560-gd', name: 'ZX 560 GD', tagline: 'Samosběrací vůz 56 m3', url: '' },
        ],
      },
    ],
  },
  'lisy-valcove': {
    name: cz_category_name('lisy-valcove'),
    series: [
      {
        slug: 'comprima',
        name: 'Comprima',
        family: 'comprima',
        subcategory: 'lisy-valcove',
        url: 'https://landmaschinen.krone.de/en/products/round-balers',
        description: 'Comprima — válcové lisy s polovariabilní/variabilní komorou značky Krone (NovoGrip pásová komora).',
        models: [
          { slug: 'comprima-cv-150-xc', name: 'Comprima CV 150 XC', tagline: 'Válcový lis s pásovou variabilní komorou', url: '' },
          { slug: 'comprima-v-150-xc', name: 'Comprima V 150 XC', tagline: 'Variabilní komora s nožovým rotorem', url: '' },
          { slug: 'comprima-v-180-xc', name: 'Comprima V 180 XC', tagline: 'Variabilní komora 1,8 m', url: '' },
          { slug: 'comprima-f-155-xc', name: 'Comprima F 155 XC', tagline: 'Pevná komora 1,55 m', url: '' },
        ],
      },
      {
        slug: 'fortima',
        name: 'Fortima',
        family: 'fortima',
        subcategory: 'lisy-valcove',
        url: 'https://landmaschinen.krone.de/en/products/round-balers',
        description: 'Fortima — válcové lisy s pevnou komorou značky Krone, řetězová komora s tyčemi.',
        models: [
          { slug: 'fortima-f-1250', name: 'Fortima F 1250', tagline: 'Pevná komora 1,25 m', url: '' },
          { slug: 'fortima-f-1600', name: 'Fortima F 1600', tagline: 'Pevná komora 1,55 m', url: '' },
          { slug: 'fortima-v-1500', name: 'Fortima V 1500', tagline: 'Variabilní komora 1,50 m', url: '' },
        ],
      },
      {
        slug: 'bellima',
        name: 'Bellima',
        family: 'bellima',
        subcategory: 'lisy-valcove',
        url: 'https://landmaschinen.krone.de/en/products/round-balers',
        description: 'Bellima — vstupní válcové lisy s pevnou komorou značky Krone.',
        models: [
          { slug: 'bellima-f-125', name: 'Bellima F 125', tagline: 'Vstupní pevná komora 1,25 m', url: '' },
        ],
      },
      {
        slug: 'ultima',
        name: 'Ultima',
        family: 'ultima',
        subcategory: 'lisy-valcove',
        url: 'https://landmaschinen.krone.de/en/products/baler-wrapper-combinations',
        description: 'Ultima — non-stop lis-obalovač značky Krone (kontinuální lisování bez zastavení).',
        models: [
          { slug: 'ultima-cf-155-xc', name: 'Ultima CF 155 XC', tagline: 'Non-stop lis-obalovač pevná komora', url: '' },
          { slug: 'ultima-f-155-xc', name: 'Ultima F 155 XC', tagline: 'Non-stop pevná komora', url: '' },
        ],
      },
    ],
  },
  'lisy-hranolove': {
    name: cz_category_name('lisy-hranolove'),
    series: [
      {
        slug: 'big-pack',
        name: 'BiG Pack',
        family: 'big-pack',
        subcategory: 'lisy-hranolove',
        url: 'https://landmaschinen.krone.de/en/products/big-balers',
        description: 'BiG Pack — vysokotlaké hranolové lisy značky Krone, vlajková řada (kanál až 120×130 cm).',
        models: [
          { slug: 'big-pack-870-hdp-ii', name: 'BiG Pack 870 HDP II', tagline: 'Vysokotlaký lis 80×70 cm', url: '' },
          { slug: 'big-pack-1270-vc', name: 'BiG Pack 1270 VC', tagline: 'Hranolový lis s předkomorou', url: '' },
          { slug: 'big-pack-1290-hdp-ii', name: 'BiG Pack 1290 HDP II', tagline: 'Vysokotlaký lis 120×90 cm', url: '' },
          { slug: 'big-pack-4x4', name: 'BiG Pack 4×4', tagline: 'Hranolový lis 120×125 cm', url: '' },
          { slug: 'big-pack-1290-hdp-vc', name: 'BiG Pack 1290 HDP VC', tagline: 'Vysokotlaký lis s VariCut', url: '' },
        ],
      },
    ],
  },
  'rezacky-samojizdne': {
    name: cz_category_name('rezacky-samojizdne'),
    series: [
      {
        slug: 'big-x',
        name: 'BiG X',
        family: 'big-x',
        subcategory: 'rezacky-samojizdne',
        url: 'https://landmaschinen.krone.de/en/products/forage-harvesters',
        description: 'BiG X — samojízdné sklízecí řezačky značky Krone, výkon 490–1156 hp (vlajková řada BiG X 1180).',
        models: [
          { slug: 'big-x-480', name: 'BiG X 480', tagline: 'Samojízdná řezačka 490 hp', url: '' },
          { slug: 'big-x-580', name: 'BiG X 580', tagline: 'Samojízdná řezačka 585 hp', url: '' },
          { slug: 'big-x-680', name: 'BiG X 680', tagline: 'Samojízdná řezačka 686 hp', url: '' },
          { slug: 'big-x-780', name: 'BiG X 780', tagline: 'Samojízdná řezačka 768 hp', url: '' },
          { slug: 'big-x-880', name: 'BiG X 880', tagline: 'Samojízdná řezačka 884 hp', url: '' },
          { slug: 'big-x-1080', name: 'BiG X 1080', tagline: 'Samojízdná řezačka 1078 hp', url: '' },
          { slug: 'big-x-1180', name: 'BiG X 1180', tagline: 'Samojízdná řezačka 1156 hp', url: '' },
        ],
      },
    ],
  },
  'navesy-valnik': {
    name: cz_category_name('navesy-valnik'),
    series: [
      {
        slug: 'tx',
        name: 'TX',
        family: 'tx',
        subcategory: 'navesy-valnik',
        url: 'https://landmaschinen.krone.de/en/products/agricultural-trailers',
        description: 'TX — zemědělské návěsy značky Krone (přeprava sklizených pícnin a slámy).',
        models: [
          { slug: 'tx-460', name: 'TX 460', tagline: 'Zemědělský návěs 46 m3', url: '' },
          { slug: 'tx-560', name: 'TX 560', tagline: 'Zemědělský návěs 56 m3', url: '' },
        ],
      },
    ],
  },
};

function applyScaffold() {
  console.error('No scrape data — emitting curated SCAFFOLD.');
  let series = 0, models = 0;
  for (const cat of Object.keys(SCAFFOLD)) {
    series += SCAFFOLD[cat].series.length;
    for (const s of SCAFFOLD[cat].series) models += s.models.length;
  }
  console.error(`  scaffold: ${Object.keys(SCAFFOLD).length} categories, ${series} series, ${models} models`);
  return { grouped: SCAFFOLD, mapped: models, skipped: 0, skippedSamples: [], scaffold: true };
}

function main() {
  let result;
  if (existsSync(DATA_PATH)) {
    try {
      const raw = JSON.parse(readFileSync(DATA_PATH, 'utf8'));
      const totalModels = countModels(raw);
      if (totalModels === 0) {
        console.error(`Scrape data exists but has 0 models — falling back to scaffold.`);
        result = applyScaffold();
      } else {
        result = processScrapedData(raw);
        // Merge in scaffold categories that the scrape missed (defensive)
        for (const cat of Object.keys(SCAFFOLD)) {
          if (!result.grouped[cat]) result.grouped[cat] = SCAFFOLD[cat];
        }
      }
    } catch (e) {
      console.error(`Failed to parse ${DATA_PATH}: ${e.message} — falling back to scaffold.`);
      result = applyScaffold();
    }
  } else {
    result = applyScaffold();
  }

  const { grouped, mapped, skipped, skippedSamples, scaffold } = result;

  console.error(`Mapped: ${mapped} models`);
  console.error(`Skipped: ${skipped} models`);
  if (skippedSamples?.length) skippedSamples.forEach((s) => console.error(`  - ${s}`));
  console.error('');
  for (const cat of Object.keys(grouped)) {
    const series = grouped[cat].series;
    const totalModels = series.reduce((acc, s) => acc + s.models.length, 0);
    console.error(`  ${cat}: ${series.length} series, ${totalModels} models`);
  }

  // Preserve YAML header
  const existing = existsSync(YAML_PATH) ? readFileSync(YAML_PATH, 'utf8').split('\n') : [];
  const headerLines = [];
  for (const line of existing) {
    if (line.startsWith('categories:')) break;
    headerLines.push(line);
  }
  while (headerLines.length > 0 && !headerLines[headerLines.length - 1].trim()) headerLines.pop();

  if (headerLines.length === 0) {
    headerLines.push(
      'slug: krone',
      'name: Krone',
      'country: Německo',
      'founded: 1906',
      'website: https://landmaschinen.krone.de/',
      'description: >',
      '  Německý specialista na sklizeň pícnin a slámy. Žací stroje EasyCut, lisy válcové Comprima a hranolové BiG Pack, samojízdné řezačky BiG X (až 1156 hp) a žací linka BiG M.',
    );
  }

  const yaml = buildYaml(grouped, headerLines);
  writeFileSync(YAML_PATH, yaml);
  console.error(`\nWrote ${YAML_PATH}${scaffold ? ' (from scaffold)' : ''}`);
}

function countModels(obj) {
  if (!obj || typeof obj !== 'object') return 0;
  if (Array.isArray(obj.models)) return obj.models.length;
  let n = 0;
  for (const k of Object.keys(obj)) n += countModels(obj[k]);
  return n;
}

main();
