#!/usr/bin/env node
// Apply Kuhn scraped data → src/data/stroje/kuhn.yaml.
//
// Maps Kuhn EN category tree → CZ subcategory enum, deduplicates,
// uses page-title-extracted names. Tech specs (year, hp, image_url) NOT filled.
//
// If scripts/kuhn-api-data.json is missing OR empty, falls back to the
// SCAFFOLD constant below — a hand-curated map of Kuhn's main current series
// based on public marketing material. This guarantees the script produces a
// usable YAML even when the live scrape failed (network blocked, sitemap
// reorganised, etc.).
//
// Usage: node scripts/kuhn-api-apply.mjs

import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const DATA_PATH = 'scripts/kuhn-api-data.json';
const YAML_PATH = 'src/data/stroje/kuhn.yaml';

// Map Kuhn EN path prefix → CZ subcategory.
// Most specific paths first. Kuhn uses both kebab-case and verbose phrases
// like "soil-preparation", "harvesting-forage" — patterns cover both.
const MAPPING = [
  // === Soil cultivation ===
  { match: 'soil-preparation/ploughs', cz_category: 'zpracovani-pudy', cz_subcategory: 'pluhy', cz_label: 'Pluhy' },
  { match: 'soil-cultivation/ploughs', cz_category: 'zpracovani-pudy', cz_subcategory: 'pluhy', cz_label: 'Pluhy' },
  { match: 'ploughs', cz_category: 'zpracovani-pudy', cz_subcategory: 'pluhy', cz_label: 'Pluhy' },
  { match: 'soil-preparation/disc-harrows', cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-diskove', cz_label: 'Diskové podmítače' },
  { match: 'soil-cultivation/disc-harrows', cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-diskove', cz_label: 'Diskové podmítače' },
  { match: 'disc-harrows', cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-diskove', cz_label: 'Diskové podmítače' },
  { match: 'soil-preparation/stubble-cultivators', cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-radlickove', cz_label: 'Radličkové podmítače' },
  { match: 'stubble-cultivators', cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-radlickove', cz_label: 'Radličkové podmítače' },
  { match: 'soil-preparation/cultivators', cz_category: 'zpracovani-pudy', cz_subcategory: 'podmitace-radlickove', cz_label: 'Radličkové podmítače' },
  { match: 'soil-preparation/subsoilers', cz_category: 'zpracovani-pudy', cz_subcategory: 'kyprice', cz_label: 'Hlubinné kypřiče' },
  { match: 'subsoilers', cz_category: 'zpracovani-pudy', cz_subcategory: 'kyprice', cz_label: 'Hlubinné kypřiče' },
  { match: 'soil-preparation/power-harrows', cz_category: 'zpracovani-pudy', cz_subcategory: 'rotacni-brany', cz_label: 'Rotační brány' },
  { match: 'power-harrows', cz_category: 'zpracovani-pudy', cz_subcategory: 'rotacni-brany', cz_label: 'Rotační brány' },
  { match: 'soil-preparation/rotary-tillers', cz_category: 'zpracovani-pudy', cz_subcategory: 'rotacni-brany', cz_label: 'Rotavátory' },
  { match: 'soil-preparation/seedbed-cultivators', cz_category: 'zpracovani-pudy', cz_subcategory: 'kompaktomaty', cz_label: 'Kompaktomaty' },
  { match: 'seedbed-cultivators', cz_category: 'zpracovani-pudy', cz_subcategory: 'kompaktomaty', cz_label: 'Kompaktomaty' },
  { match: 'soil-preparation/rollers', cz_category: 'zpracovani-pudy', cz_subcategory: 'valce', cz_label: 'Válce' },
  { match: 'rollers', cz_category: 'zpracovani-pudy', cz_subcategory: 'valce', cz_label: 'Válce' },

  // === Sowing / planting ===
  { match: 'sowing/precision-planters', cz_category: 'seti', cz_subcategory: 'seci-stroje-presne', cz_label: 'Přesné secí stroje' },
  { match: 'precision-planters', cz_category: 'seti', cz_subcategory: 'seci-stroje-presne', cz_label: 'Přesné secí stroje' },
  { match: 'sowing/precision-seed-drills', cz_category: 'seti', cz_subcategory: 'seci-stroje-presne', cz_label: 'Přesné secí stroje' },
  { match: 'sowing/seed-drills/mechanical', cz_category: 'seti', cz_subcategory: 'seci-stroje-mechanicke', cz_label: 'Mechanické secí stroje' },
  { match: 'sowing/seed-drills/pneumatic', cz_category: 'seti', cz_subcategory: 'seci-stroje-pneumaticke', cz_label: 'Pneumatické secí stroje' },
  { match: 'sowing/seed-drills/integrated', cz_category: 'seti', cz_subcategory: 'seci-kombinace', cz_label: 'Secí kombinace' },
  { match: 'sowing/seed-drills/conventional', cz_category: 'seti', cz_subcategory: 'seci-stroje-mechanicke', cz_label: 'Mechanické secí stroje' },
  { match: 'sowing/seed-drills', cz_category: 'seti', cz_subcategory: 'seci-stroje-pneumaticke', cz_label: 'Secí stroje' },
  { match: 'seed-drills', cz_category: 'seti', cz_subcategory: 'seci-stroje-pneumaticke', cz_label: 'Secí stroje' },
  { match: 'sowing', cz_category: 'seti', cz_subcategory: 'seci-stroje-pneumaticke', cz_label: 'Secí stroje' },

  // === Fertilising / spreading ===
  { match: 'fertilisation/mineral-fertiliser-spreaders', cz_category: 'hnojeni', cz_subcategory: 'rozmetadla-mineralni', cz_label: 'Rozmetadla minerálních hnojiv' },
  { match: 'fertilisation/fertiliser-spreaders', cz_category: 'hnojeni', cz_subcategory: 'rozmetadla-mineralni', cz_label: 'Rozmetadla minerálních hnojiv' },
  { match: 'fertilizer-spreaders', cz_category: 'hnojeni', cz_subcategory: 'rozmetadla-mineralni', cz_label: 'Rozmetadla minerálních hnojiv' },
  { match: 'fertiliser-spreaders', cz_category: 'hnojeni', cz_subcategory: 'rozmetadla-mineralni', cz_label: 'Rozmetadla minerálních hnojiv' },
  { match: 'fertilisation/manure-spreaders', cz_category: 'hnojeni', cz_subcategory: 'rozmetadla-statkova', cz_label: 'Rozmetadla statkových hnojiv' },
  { match: 'manure-spreaders', cz_category: 'hnojeni', cz_subcategory: 'rozmetadla-statkova', cz_label: 'Rozmetadla statkových hnojiv' },
  { match: 'fertilisation/slurry-tankers', cz_category: 'hnojeni', cz_subcategory: 'cisterny-kejda', cz_label: 'Cisterny na kejdu' },
  { match: 'slurry-tankers', cz_category: 'hnojeni', cz_subcategory: 'cisterny-kejda', cz_label: 'Cisterny na kejdu' },

  // === Crop protection ===
  { match: 'crop-protection/mounted-sprayers', cz_category: 'ochrana-rostlin', cz_subcategory: 'postrikovace-nesene', cz_label: 'Nesené postřikovače' },
  { match: 'mounted-sprayers', cz_category: 'ochrana-rostlin', cz_subcategory: 'postrikovace-nesene', cz_label: 'Nesené postřikovače' },
  { match: 'crop-protection/trailed-sprayers', cz_category: 'ochrana-rostlin', cz_subcategory: 'postrikovace-tazene', cz_label: 'Tažené postřikovače' },
  { match: 'trailed-sprayers', cz_category: 'ochrana-rostlin', cz_subcategory: 'postrikovace-tazene', cz_label: 'Tažené postřikovače' },
  { match: 'crop-protection/self-propelled-sprayers', cz_category: 'ochrana-rostlin', cz_subcategory: 'postrikovace-samojizdne', cz_label: 'Samojízdné postřikovače' },
  { match: 'self-propelled-sprayers', cz_category: 'ochrana-rostlin', cz_subcategory: 'postrikovace-samojizdne', cz_label: 'Samojízdné postřikovače' },
  { match: 'crop-protection/sprayers', cz_category: 'ochrana-rostlin', cz_subcategory: 'postrikovace-tazene', cz_label: 'Postřikovače' },
  { match: 'sprayers', cz_category: 'ochrana-rostlin', cz_subcategory: 'postrikovace-tazene', cz_label: 'Postřikovače' },

  // === Forage harvesting (sklizeň pícnin) ===
  { match: 'harvesting-forage/disc-mowers', cz_category: 'sklizen-picnin', cz_subcategory: 'zaci-stroje', cz_label: 'Žací stroje' },
  { match: 'hay-and-forage/disc-mowers', cz_category: 'sklizen-picnin', cz_subcategory: 'zaci-stroje', cz_label: 'Žací stroje' },
  { match: 'mowers', cz_category: 'sklizen-picnin', cz_subcategory: 'zaci-stroje', cz_label: 'Žací stroje' },
  { match: 'mower-conditioners', cz_category: 'sklizen-picnin', cz_subcategory: 'zaci-stroje', cz_label: 'Žací stroje s kondicionérem' },
  { match: 'harvesting-forage/tedders', cz_category: 'sklizen-picnin', cz_subcategory: 'obracece', cz_label: 'Obraceče' },
  { match: 'tedders', cz_category: 'sklizen-picnin', cz_subcategory: 'obracece', cz_label: 'Obraceče' },
  { match: 'harvesting-forage/rakes', cz_category: 'sklizen-picnin', cz_subcategory: 'shrnovace', cz_label: 'Shrnovače' },
  { match: 'rakes', cz_category: 'sklizen-picnin', cz_subcategory: 'shrnovace', cz_label: 'Shrnovače' },
  { match: 'mergers', cz_category: 'sklizen-picnin', cz_subcategory: 'shrnovace', cz_label: 'Shrnovače pásové' },
  { match: 'harvesting-forage/round-balers', cz_category: 'sklizen-picnin', cz_subcategory: 'lisy-valcove', cz_label: 'Válcové lisy' },
  { match: 'round-balers', cz_category: 'sklizen-picnin', cz_subcategory: 'lisy-valcove', cz_label: 'Válcové lisy' },
  { match: 'harvesting-forage/square-balers', cz_category: 'sklizen-picnin', cz_subcategory: 'lisy-hranolove', cz_label: 'Hranolové lisy' },
  { match: 'square-balers', cz_category: 'sklizen-picnin', cz_subcategory: 'lisy-hranolove', cz_label: 'Hranolové lisy' },
  { match: 'balers', cz_category: 'sklizen-picnin', cz_subcategory: 'lisy-valcove', cz_label: 'Lisy' },
  { match: 'harvesting-forage/bale-wrappers', cz_category: 'sklizen-picnin', cz_subcategory: 'obalovace', cz_label: 'Obalovače balíků' },
  { match: 'bale-wrappers', cz_category: 'sklizen-picnin', cz_subcategory: 'obalovace', cz_label: 'Obalovače balíků' },
  { match: 'harvesting-forage/loader-wagons', cz_category: 'sklizen-picnin', cz_subcategory: 'samosberaci-vozy', cz_label: 'Samosběrací vozy' },
  { match: 'loader-wagons', cz_category: 'sklizen-picnin', cz_subcategory: 'samosberaci-vozy', cz_label: 'Samosběrací vozy' },

  // === Livestock / mixers ===
  { match: 'livestock/mixer-wagons', cz_category: 'staj-chov', cz_subcategory: 'krmne-vozy', cz_label: 'Mixérové krmné vozy' },
  { match: 'livestock-husbandry/mixer-wagons', cz_category: 'staj-chov', cz_subcategory: 'krmne-vozy', cz_label: 'Mixérové krmné vozy' },
  { match: 'mixer-wagons', cz_category: 'staj-chov', cz_subcategory: 'krmne-vozy', cz_label: 'Mixérové krmné vozy' },
  { match: 'feed-mixers', cz_category: 'staj-chov', cz_subcategory: 'krmne-vozy', cz_label: 'Mixérové krmné vozy' },
  { match: 'straw-blowers', cz_category: 'staj-chov', cz_subcategory: 'podestylace', cz_label: 'Podestýlací stroje' },

  // === Landscape maintenance ===
  { match: 'landscape-maintenance/shredders', cz_category: 'komunal-les', cz_subcategory: 'mulcovace', cz_label: 'Mulčovače' },
  { match: 'shredders', cz_category: 'komunal-les', cz_subcategory: 'mulcovace', cz_label: 'Mulčovače' },
  { match: 'mulchers', cz_category: 'komunal-les', cz_subcategory: 'mulcovace', cz_label: 'Mulčovače' },
];

const SKIP_CATEGORIES = new Set(['services', 'connectivity', 'parts', 'spare-parts', 'precision-farming', 'training']);
const SKIP_SUBCATEGORIES = new Set(['accessories', 'parts', 'options', 'apps', 'training']);

// Hand-curated scaffold of Kuhn's main current series. Used as fallback when
// the scrape data is empty/missing. Names taken from Kuhn marketing material
// as of 2024.
const SCAFFOLD = {
  'soil-preparation': {
    'ploughs': {
      'master': { slug: 'master', models: [
        { slug: 'master-103', name: 'Master 103', tagline: 'Mounted reversible plough', url: 'https://www.kuhn.com/en-int/products/soil-preparation/ploughs/master-103' },
        { slug: 'master-153', name: 'Master 153', tagline: 'Mounted reversible plough', url: 'https://www.kuhn.com/en-int/products/soil-preparation/ploughs/master-153' },
        { slug: 'vari-master-l', name: 'Vari-Master L', tagline: 'Variable-width semi-mounted plough', url: 'https://www.kuhn.com/en-int/products/soil-preparation/ploughs/vari-master-l' },
        { slug: 'challenger', name: 'Challenger', tagline: 'On-land semi-mounted plough', url: 'https://www.kuhn.com/en-int/products/soil-preparation/ploughs/challenger' },
      ]},
    },
    'disc-harrows': {
      'optimer': { slug: 'optimer', models: [
        { slug: 'optimer-l-7503', name: 'Optimer L 7503', tagline: 'Trailed compact disc harrow', url: 'https://www.kuhn.com/en-int/products/soil-preparation/disc-harrows/optimer-l-7503' },
        { slug: 'optimer-103', name: 'Optimer 103', tagline: 'Mounted compact disc harrow', url: 'https://www.kuhn.com/en-int/products/soil-preparation/disc-harrows/optimer-103' },
      ]},
      'discover-xm2': { slug: 'discover-xm2', models: [
        { slug: 'discover-xm2', name: 'Discover XM2', tagline: 'Mounted disc harrow', url: 'https://www.kuhn.com/en-int/products/soil-preparation/disc-harrows/discover-xm2' },
      ]},
    },
    'stubble-cultivators': {
      'cultimer': { slug: 'cultimer', models: [
        { slug: 'cultimer-l-300', name: 'Cultimer L 300', tagline: 'Mounted stubble cultivator', url: 'https://www.kuhn.com/en-int/products/soil-preparation/stubble-cultivators/cultimer-l-300' },
        { slug: 'cultimer-l-1000', name: 'Cultimer L 1000', tagline: 'Trailed stubble cultivator', url: 'https://www.kuhn.com/en-int/products/soil-preparation/stubble-cultivators/cultimer-l-1000' },
        { slug: 'performer', name: 'Performer', tagline: 'Trailed disc and tine cultivator', url: 'https://www.kuhn.com/en-int/products/soil-preparation/stubble-cultivators/performer' },
      ]},
    },
    'subsoilers': {
      'prolander': { slug: 'prolander', models: [
        { slug: 'prolander', name: 'Prolander', tagline: 'Tine cultivator for shallow tillage', url: 'https://www.kuhn.com/en-int/products/soil-preparation/subsoilers/prolander' },
      ]},
    },
    'power-harrows': {
      'hr': { slug: 'hr', models: [
        { slug: 'hr-1004', name: 'HR 1004', tagline: 'Mounted power harrow', url: 'https://www.kuhn.com/en-int/products/soil-preparation/power-harrows/hr-1004' },
        { slug: 'hr-4004', name: 'HR 4004', tagline: 'Folding power harrow', url: 'https://www.kuhn.com/en-int/products/soil-preparation/power-harrows/hr-4004' },
        { slug: 'hr-6004', name: 'HR 6004', tagline: 'Large folding power harrow', url: 'https://www.kuhn.com/en-int/products/soil-preparation/power-harrows/hr-6004' },
      ]},
    },
    'seedbed-cultivators': {
      'venta': { slug: 'venta', models: [
        { slug: 'venta-seedbed', name: 'Venta Seedbed', tagline: 'Integrated seedbed combination', url: 'https://www.kuhn.com/en-int/products/soil-preparation/seedbed-cultivators/venta' },
      ]},
    },
  },
  'sowing': {
    'precision-planters': {
      'maxima': { slug: 'maxima', models: [
        { slug: 'maxima-3', name: 'Maxima 3', tagline: 'Precision planter', url: 'https://www.kuhn.com/en-int/products/sowing/precision-planters/maxima-3' },
        { slug: 'planter-3', name: 'Planter 3', tagline: 'Precision row crop planter', url: 'https://www.kuhn.com/en-int/products/sowing/precision-planters/planter-3' },
      ]},
    },
    'seed-drills': {
      'espro': { slug: 'espro', models: [
        { slug: 'espro-3000', name: 'Espro 3000', tagline: 'Compact disc seed drill', url: 'https://www.kuhn.com/en-int/products/sowing/seed-drills/espro-3000' },
        { slug: 'espro-6000-r', name: 'Espro 6000 R', tagline: 'Trailed precision seed drill', url: 'https://www.kuhn.com/en-int/products/sowing/seed-drills/espro-6000-r' },
        { slug: 'espro-8000-rc', name: 'Espro 8000 RC', tagline: 'Wide trailed seed drill', url: 'https://www.kuhn.com/en-int/products/sowing/seed-drills/espro-8000-rc' },
      ]},
      'venta': { slug: 'venta', models: [
        { slug: 'venta-3030', name: 'Venta 3030', tagline: 'Pneumatic seed drill', url: 'https://www.kuhn.com/en-int/products/sowing/seed-drills/venta-3030' },
      ]},
      'sitera': { slug: 'sitera', models: [
        { slug: 'sitera-3000', name: 'Sitera 3000', tagline: 'Mechanical seed drill', url: 'https://www.kuhn.com/en-int/products/sowing/seed-drills/sitera-3000' },
      ]},
    },
  },
  'fertilisation': {
    'mineral-fertiliser-spreaders': {
      'axis': { slug: 'axis', models: [
        { slug: 'axis-h-emc-w', name: 'AXIS H EMC W', tagline: 'Mounted disc spreader with weighing', url: 'https://www.kuhn.com/en-int/products/fertilisation/mineral-fertiliser-spreaders/axis-h-emc-w' },
        { slug: 'axis-m-emc', name: 'AXIS M EMC', tagline: 'Mounted disc spreader with EMC control', url: 'https://www.kuhn.com/en-int/products/fertilisation/mineral-fertiliser-spreaders/axis-m-emc' },
        { slug: 'axent-100-1', name: 'AXENT 100.1', tagline: 'Trailed large-capacity spreader', url: 'https://www.kuhn.com/en-int/products/fertilisation/mineral-fertiliser-spreaders/axent-100-1' },
      ]},
      'aero': { slug: 'aero', models: [
        { slug: 'aero-32-2', name: 'Aero 32.2', tagline: 'Pneumatic fertiliser spreader', url: 'https://www.kuhn.com/en-int/products/fertilisation/mineral-fertiliser-spreaders/aero-32-2' },
      ]},
    },
    'manure-spreaders': {
      'profile': { slug: 'profile', models: [
        { slug: 'profile-15-2', name: 'Profile 15.2', tagline: 'Universal manure spreader', url: 'https://www.kuhn.com/en-int/products/fertilisation/manure-spreaders/profile-15-2' },
        { slug: 'pro-twin-slinger', name: 'Pro-Twin Slinger', tagline: 'Side-discharge manure spreader', url: 'https://www.kuhn.com/en-int/products/fertilisation/manure-spreaders/pro-twin-slinger' },
      ]},
    },
    'slurry-tankers': {
      'pul': { slug: 'pul', models: [
        { slug: 'pul-160', name: 'PUL 160', tagline: 'Single-axle slurry tanker', url: 'https://www.kuhn.com/en-int/products/fertilisation/slurry-tankers/pul-160' },
      ]},
    },
  },
  'crop-protection': {
    'mounted-sprayers': {
      'altis': { slug: 'altis', models: [
        { slug: 'altis-1302', name: 'Altis 1302', tagline: 'Mounted field sprayer', url: 'https://www.kuhn.com/en-int/products/crop-protection/mounted-sprayers/altis-1302' },
      ]},
      'deltis': { slug: 'deltis', models: [
        { slug: 'deltis-2', name: 'Deltis 2', tagline: 'Mounted sprayer with 18-28 m boom', url: 'https://www.kuhn.com/en-int/products/crop-protection/mounted-sprayers/deltis-2' },
      ]},
    },
    'trailed-sprayers': {
      'metris': { slug: 'metris', models: [
        { slug: 'metris-2', name: 'Metris 2', tagline: 'Trailed sprayer up to 4100 L', url: 'https://www.kuhn.com/en-int/products/crop-protection/trailed-sprayers/metris-2' },
      ]},
      'oceanis': { slug: 'oceanis', models: [
        { slug: 'oceanis-2', name: 'Oceanis 2', tagline: 'Trailed sprayer up to 7700 L', url: 'https://www.kuhn.com/en-int/products/crop-protection/trailed-sprayers/oceanis-2' },
      ]},
            'lexis': { slug: 'lexis', models: [
        { slug: 'lexis', name: 'Lexis', tagline: 'Compact trailed sprayer', url: 'https://www.kuhn.com/en-int/products/crop-protection/trailed-sprayers/lexis' },
      ]},
    },
  },
  'harvesting-forage': {
    'disc-mowers': {
      'gmd': { slug: 'gmd', models: [
        { slug: 'gmd-310', name: 'GMD 310', tagline: 'Mounted disc mower 3.1 m', url: 'https://www.kuhn.com/en-int/products/harvesting-forage/disc-mowers/gmd-310' },
        { slug: 'gmd-3525', name: 'GMD 3525', tagline: 'Trailed disc mower 3.5 m', url: 'https://www.kuhn.com/en-int/products/harvesting-forage/disc-mowers/gmd-3525' },
        { slug: 'gmd-9530', name: 'GMD 9530', tagline: 'Triple disc mower 9.5 m', url: 'https://www.kuhn.com/en-int/products/harvesting-forage/disc-mowers/gmd-9530' },
      ]},
      'fc': { slug: 'fc', models: [
        { slug: 'fc-3125-d', name: 'FC 3125 D', tagline: 'Mower-conditioner with steel rolls', url: 'https://www.kuhn.com/en-int/products/harvesting-forage/disc-mowers/fc-3125-d' },
        { slug: 'fc-13460-rgc', name: 'FC 13460 RGC', tagline: 'Triple mower-conditioner 13.4 m', url: 'https://www.kuhn.com/en-int/products/harvesting-forage/disc-mowers/fc-13460-rgc' },
      ]},
    },
    'tedders': {
      'gf': { slug: 'gf', models: [
        { slug: 'gf-7902', name: 'GF 7902', tagline: 'Trailed tedder 7.8 m', url: 'https://www.kuhn.com/en-int/products/harvesting-forage/tedders/gf-7902' },
        { slug: 'gf-13003', name: 'GF 13003', tagline: 'Wide working width tedder 13 m', url: 'https://www.kuhn.com/en-int/products/harvesting-forage/tedders/gf-13003' },
      ]},
    },
    'rakes': {
      'ga': { slug: 'ga', models: [
        { slug: 'ga-4231', name: 'GA 4231', tagline: 'Single-rotor rake', url: 'https://www.kuhn.com/en-int/products/harvesting-forage/rakes/ga-4231' },
        { slug: 'ga-9531', name: 'GA 9531', tagline: 'Twin-rotor centre delivery rake', url: 'https://www.kuhn.com/en-int/products/harvesting-forage/rakes/ga-9531' },
        { slug: 'ga-15131', name: 'GA 15131', tagline: 'Four-rotor rake 15 m', url: 'https://www.kuhn.com/en-int/products/harvesting-forage/rakes/ga-15131' },
      ]},
      'merge-maxx': { slug: 'merge-maxx', models: [
        { slug: 'merge-maxx-950', name: 'Merge Maxx 950', tagline: 'Pick-up belt merger', url: 'https://www.kuhn.com/en-int/products/harvesting-forage/rakes/merge-maxx-950' },
      ]},
    },
    'round-balers': {
      'vb': { slug: 'vb', models: [
        { slug: 'vb-3160', name: 'VB 3160', tagline: 'Variable chamber round baler', url: 'https://www.kuhn.com/en-int/products/harvesting-forage/round-balers/vb-3160' },
        { slug: 'vb-7190', name: 'VB 7190', tagline: 'Variable chamber baler 1.85 m bale', url: 'https://www.kuhn.com/en-int/products/harvesting-forage/round-balers/vb-7190' },
        { slug: 'vbp-3160', name: 'VBP 3160', tagline: 'Baler-wrapper combination', url: 'https://www.kuhn.com/en-int/products/harvesting-forage/round-balers/vbp-3160' },
        { slug: 'fb-3130', name: 'FB 3130', tagline: 'Fixed chamber round baler', url: 'https://www.kuhn.com/en-int/products/harvesting-forage/round-balers/fb-3130' },
      ]},
    },
    'square-balers': {
      'sb': { slug: 'sb', models: [
        { slug: 'sb-1290-id', name: 'SB 1290 iD', tagline: 'High-density large square baler', url: 'https://www.kuhn.com/en-int/products/harvesting-forage/square-balers/sb-1290-id' },
        { slug: 'sb-890', name: 'SB 890', tagline: 'Mid-size square baler', url: 'https://www.kuhn.com/en-int/products/harvesting-forage/square-balers/sb-890' },
      ]},
              'lsb': { slug: 'lsb', models: [
        { slug: 'lsb-870', name: 'LSB 870', tagline: 'Large square baler', url: 'https://www.kuhn.com/en-int/products/harvesting-forage/square-balers/lsb-870' },
      ]},
    },
    'bale-wrappers': {
      'rw': { slug: 'rw', models: [
        { slug: 'rw-1410', name: 'RW 1410', tagline: 'Trailed bale wrapper', url: 'https://www.kuhn.com/en-int/products/harvesting-forage/bale-wrappers/rw-1410' },
      ]},
    },
    'loader-wagons': {
      'profile-trailer': { slug: 'profile-trailer', models: [
        { slug: 'profile-fs', name: 'Profile FS', tagline: 'Self-loading forage wagon', url: 'https://www.kuhn.com/en-int/products/harvesting-forage/loader-wagons/profile-fs' },
      ]},
    },
  },
  'livestock': {
    'mixer-wagons': {
      'profile': { slug: 'profile-mixer', models: [
        { slug: 'profile-1880', name: 'Profile 1880', tagline: 'Twin-auger vertical mixer', url: 'https://www.kuhn.com/en-int/products/livestock/mixer-wagons/profile-1880' },
        { slug: 'profile-plus', name: 'Profile Plus', tagline: 'Premium vertical mixer wagon', url: 'https://www.kuhn.com/en-int/products/livestock/mixer-wagons/profile-plus' },
      ]},
      'euromix': { slug: 'euromix', models: [
        { slug: 'euromix-i', name: 'Euromix I', tagline: 'Horizontal-paddle mixer wagon', url: 'https://www.kuhn.com/en-int/products/livestock/mixer-wagons/euromix-i' },
      ]},
      'spv': { slug: 'spv', models: [
        { slug: 'spv-power', name: 'SPV Power', tagline: 'Self-propelled mixer wagon', url: 'https://www.kuhn.com/en-int/products/livestock/mixer-wagons/spv-power' },
      ]},
      'tks': { slug: 'tks', models: [
        { slug: 'tks-feedrobot', name: 'TKS FeedRobot K2', tagline: 'Automatic feeding robot', url: 'https://www.kuhn.com/en-int/products/livestock/mixer-wagons/tks-feedrobot' },
      ]},
    },
    'straw-blowers': {
      'primor': { slug: 'primor', models: [
        { slug: 'primor-3570-m', name: 'Primor 3570 M', tagline: 'Bale shredder / straw blower', url: 'https://www.kuhn.com/en-int/products/livestock/straw-blowers/primor-3570-m' },
      ]},
    },
  },
  'landscape-maintenance': {
    'shredders': {
      'bp': { slug: 'bp', models: [
        { slug: 'bp-280', name: 'BP 280', tagline: 'Front and rear mounted shredder', url: 'https://www.kuhn.com/en-int/products/landscape-maintenance/shredders/bp-280' },
        { slug: 'bpr-305', name: 'BPR 305', tagline: 'Reversible shredder', url: 'https://www.kuhn.com/en-int/products/landscape-maintenance/shredders/bpr-305' },
      ]},
      'tbe': { slug: 'tbe', models: [
        { slug: 'tbe-22', name: 'TBE 22', tagline: 'Reach arm hedge cutter', url: 'https://www.kuhn.com/en-int/products/landscape-maintenance/shredders/tbe-22' },
      ]},
    },
  },
};

function findMapping(catPath) {
  for (const m of MAPPING) {
    if (catPath === m.match || catPath.startsWith(m.match + '/') || catPath.endsWith('/' + m.match)) return m;
  }
  return null;
}

function escapeYaml(s) {
  if (/[:#&*!|>'"%@`]/.test(s) || /^[\s-]/.test(s)) return `"${s.replace(/"/g, '\\"')}"`;
  return s;
}

function buildYaml(grouped, headerLines) {
  const out = [...headerLines, 'categories:'];
  for (const cz_cat of Object.keys(grouped).sort()) {
    out.push(`  ${cz_cat}:`);
    out.push(`    name: ${escapeYaml(grouped[cz_cat].name)}`);
    out.push(`    series:`);
    const sortedSeries = grouped[cz_cat].series.sort((a, b) => a.slug.localeCompare(b.slug));
    for (const series of sortedSeries) {
      out.push(`      - slug: ${series.slug}`);
      out.push(`        name: ${escapeYaml(series.name)}`);
      out.push(`        family: ${series.family}`);
      out.push(`        subcategory: ${series.subcategory}`);
      if (series.url) out.push(`        url: ${series.url}`);
      out.push(`        description: |`);
      out.push(`          ${series.description}`);
      if (series.models && series.models.length > 0) {
        out.push(`        models:`);
        for (const model of series.models) {
          out.push(`          - slug: ${model.slug}`);
          out.push(`            name: ${escapeYaml(model.name)}`);
          if (model.tagline) out.push(`            tagline: ${escapeYaml(model.tagline)}`);
          out.push(`            url: ${model.url}`);
        }
      }
    }
  }
  return out.join('\n') + '\n';
}

function cz_category_name(slug) {
  const NAMES = {
    'zpracovani-pudy': 'Zpracování půdy',
    'seti': 'Setí a sázení',
    'hnojeni': 'Hnojení',
    'ochrana-rostlin': 'Ochrana rostlin',
    'sklizen-picnin': 'Sklizeň pícnin a slámy',
    'staj-chov': 'Stáj a chov',
    'komunal-les': 'Komunál a les',
  };
  return NAMES[slug] || slug;
}

function loadData() {
  if (!existsSync(DATA_PATH)) {
    console.error(`! ${DATA_PATH} not found — using SCAFFOLD fallback`);
    return SCAFFOLD;
  }
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(DATA_PATH, 'utf8'));
  } catch (e) {
    console.error(`! ${DATA_PATH} unreadable: ${e.message} — using SCAFFOLD fallback`);
    return SCAFFOLD;
  }
  if (!parsed || Object.keys(parsed).length === 0) {
    console.error(`! ${DATA_PATH} is empty — using SCAFFOLD fallback`);
    return SCAFFOLD;
  }
  return parsed;
}

function main() {
  const data = loadData();

  const grouped = {};
  let mapped = 0, skipped = 0;
  const skippedSamples = [];

  for (const enCat of Object.keys(data)) {
    if (enCat.startsWith('_')) continue;
    if (SKIP_CATEGORIES.has(enCat)) {
      const n = countModels(data[enCat]);
      skipped += n;
      if (skippedSamples.length < 4) skippedSamples.push(`category ${enCat}: ${n}`);
      continue;
    }
    for (const enSub of Object.keys(data[enCat])) {
      if (SKIP_SUBCATEGORIES.has(enSub)) {
        const n = countModels({ x: data[enCat][enSub] });
        skipped += n;
        continue;
      }
      const subPath = enSub === '_root' ? enCat : `${enCat}/${enSub}`;

      for (const familySlug of Object.keys(data[enCat][enSub])) {
        const family = data[enCat][enSub][familySlug];
        const familyPath = `${subPath}/${familySlug.split('/')[0]}`;

        const mapping = findMapping(familyPath) || findMapping(subPath);
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
          seriesName = firstModelName.split(/\s+/)[0] || cleanFamilySlug;
        }

        const existing = grouped[mapping.cz_category].series.find((s) => s.slug === cleanFamilySlug);
        const target = existing || {
          slug: cleanFamilySlug,
          name: seriesName,
          family: cleanFamilySlug,
          subcategory: mapping.cz_subcategory,
          url: '',
          description: `${seriesName} — ${mapping.cz_label.toLowerCase()} značky Kuhn.`,
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

  console.error(`Mapped: ${mapped} models`);
  console.error(`Skipped: ${skipped} models`);
  if (skippedSamples.length) skippedSamples.forEach((s) => console.error(`  - ${s}`));
  console.error('');
  for (const cat of Object.keys(grouped)) {
    const series = grouped[cat].series;
    const totalModels = series.reduce((acc, s) => acc + s.models.length, 0);
    console.error(`  ${cat}: ${series.length} series, ${totalModels} models`);
  }

  // Preserve YAML header
  const existing = readFileSync(YAML_PATH, 'utf8').split('\n');
  const headerLines = [];
  for (const line of existing) {
    if (line.startsWith('categories:')) break;
    headerLines.push(line);
  }
  while (headerLines.length > 0 && !headerLines[headerLines.length - 1].trim()) headerLines.pop();

  const yaml = buildYaml(grouped, headerLines);
  writeFileSync(YAML_PATH, yaml);
  console.error(`\nWrote ${YAML_PATH}`);
}

function countModels(obj) {
  if (!obj || typeof obj !== 'object') return 0;
  if (Array.isArray(obj.models)) return obj.models.length;
  let n = 0;
  for (const k of Object.keys(obj)) n += countModels(obj[k]);
  return n;
}

main();
