#!/usr/bin/env node
// Inject image_* fields do stroje/*.yaml pro každý (brand, slug) v UPDATES.
// Kontext: 4 fields se vkládají mezi `year_to:` a `description: >` na series-level (6 spaces indent).
import { readFileSync, writeFileSync } from 'node:fs';

const UPDATES = [
  // Claas (5)
  { brand: 'claas', slug: 'elios', filename: 'claas-elios-110k.webp', credit_url: 'https://commons.wikimedia.org/wiki/File:Claas_Elios_210_agra_2024_(DSC01414).jpg', credit: 'MarcelX42', license: 'CC BY-SA 4.0' },
  { brand: 'claas', slug: 'avero', filename: 'claas-avero-204k.webp', credit_url: 'https://commons.wikimedia.org/wiki/File:Claas_Avero_240_Agritechnica_2017_Front_and_left_side.jpg', credit: 'MarcelX42', license: 'CC BY-SA 4.0' },
  { brand: 'claas', slug: 'tucano', filename: 'claas-tucano-394k.webp', credit_url: 'https://commons.wikimedia.org/wiki/File:Claas_Tucano_450_in_Godewaersvelde.jpg', credit: 'Pierre André Leclercq', license: 'CC BY-SA 4.0' },
  { brand: 'claas', slug: 'lexion-5000-8000', filename: 'claas-lexion-5000-8000-790k.webp', credit_url: 'https://commons.wikimedia.org/wiki/File:Claas_Lexion_8800_Terra_Trac_Agritechnica_2025_(DSC09624).jpg', credit: 'MarcelX42', license: 'CC BY-SA 4.0' },
  { brand: 'claas', slug: 'trion', filename: 'claas-trion-435k.webp', credit_url: 'https://commons.wikimedia.org/wiki/File:Claas_Trion_730_Terra_Trac_Agritechnica_2023_(DSC04578).jpg', credit: 'MarcelX42', license: 'CC BY-SA 4.0' },

  // Fendt (3)
  { brand: 'fendt', slug: '600-vario', filename: 'fendt-600-vario-224k.webp', credit_url: 'https://commons.wikimedia.org/wiki/File:Fendt_620_Vario_Profi%2B_Agritechnica_2025_(DSC06624).jpg', credit: 'MarcelX42', license: 'CC BY-SA 4.0' },
  { brand: 'fendt', slug: 'c-series', filename: 'fendt-c-series-305k.webp', credit_url: 'https://commons.wikimedia.org/wiki/File:Fendt_5275_C_SL_Agritechnica_2023_(DSC04067).jpg', credit: 'MarcelX42', license: 'CC BY-SA 4.0' },
  { brand: 'fendt', slug: 'ideal', filename: 'fendt-ideal-790k.webp', credit_url: 'https://commons.wikimedia.org/wiki/File:Fendt_Ideal_combine_harvester_1.jpg', credit: 'Homoatrox', license: 'CC BY-SA 3.0' },

  // John Deere (2)
  { brand: 'john-deere', slug: '5r', filename: 'john-deere-5r-125k.webp', credit_url: 'https://commons.wikimedia.org/wiki/File:John_Deere_5125R_Agritechnica_2017_-_Left_side.jpg', credit: 'MarcelX42', license: 'CC BY-SA 4.0' },
  { brand: 'john-deere', slug: '6m', filename: 'john-deere-6m-220k.webp', credit_url: 'https://commons.wikimedia.org/wiki/File:John_Deere_6M_220_Agritechnica_2025_(DSC09748).jpg', credit: 'MarcelX42', license: 'CC BY-SA 4.0' },

  // Massey Ferguson (4)
  { brand: 'massey-ferguson', slug: '3700', filename: 'massey-ferguson-3700-100k.webp', credit_url: 'https://commons.wikimedia.org/wiki/File:2018-11-09_(101)_Massey_Ferguson_3709_F_in_Wilhersdorf,_St._Margarethen_an_der_Sierning,_Austria.jpg', credit: 'GT1976', license: 'CC BY-SA 4.0' },
  { brand: 'massey-ferguson', slug: '4700', filename: 'massey-ferguson-4700-100k.webp', credit_url: 'https://commons.wikimedia.org/wiki/File:Massey_Ferguson_4709_M_Agritechnica_2025_(DSC09533).jpg', credit: 'MarcelX42', license: 'CC BY-SA 4.0' },
  { brand: 'massey-ferguson', slug: '5700', filename: 'massey-ferguson-5700-130k.webp', credit_url: 'https://commons.wikimedia.org/wiki/File:MF_5713_SL.jpg', credit: 'DynaVT', license: 'CC BY-SA 4.0' },
  { brand: 'massey-ferguson', slug: 'ideal-mf', filename: 'massey-ferguson-ideal-mf-626k.webp', credit_url: 'https://commons.wikimedia.org/wiki/File:Massey_Ferguson_Ideal_9T.jpg', credit: 'Bene Riobó', license: 'CC BY-SA 4.0' },

  // New Holland (6)
  { brand: 'new-holland', slug: 't4', filename: 'new-holland-t4-117k.webp', credit_url: 'https://commons.wikimedia.org/wiki/File:New_Holland_T4.115_Traktor.jpg', credit: 'JoachimKohler-HB', license: 'CC BY-SA 4.0' },
  { brand: 'new-holland', slug: 't5', filename: 'new-holland-t5-145k.webp', credit_url: 'https://commons.wikimedia.org/wiki/File:New_Holland_T5.120_Dual_Command_Agritechnica_2025_(DSC08332).jpg', credit: 'MarcelX42', license: 'CC BY-SA 4.0' },
  { brand: 'new-holland', slug: 't6', filename: 'new-holland-t6-180k.webp', credit_url: 'https://commons.wikimedia.org/wiki/File:New_Holland_T6.180.jpg', credit: 'Bene Riobó', license: 'CC BY-SA 4.0' },
  { brand: 'new-holland', slug: 't9', filename: 'new-holland-t9-700k.webp', credit_url: 'https://commons.wikimedia.org/wiki/File:Agritechnica_2013_by-RaBoe_167.jpg', credit: 'Ra Boe / Wikipedia', license: 'CC BY-SA 3.0 de' },
  { brand: 'new-holland', slug: 'cx', filename: 'new-holland-cx-490k.webp', credit_url: 'https://commons.wikimedia.org/wiki/File:New_Holland_CX8.90_Agritechnica_2025_(DSC08411).jpg', credit: 'MarcelX42', license: 'CC BY-SA 4.0' },
  { brand: 'new-holland', slug: 'cr', filename: 'new-holland-cr-775k.webp', credit_url: 'https://commons.wikimedia.org/wiki/File:New_Holland_CR9.90_agra_2024_(DSC03583).jpg', credit: 'MarcelX42', license: 'CC BY-SA 4.0' },

  // Deutz-Fahr (7)
  { brand: 'deutz-fahr', slug: 'agrofarm', filename: 'deutz-fahr-agrofarm-115k.webp', credit_url: 'https://commons.wikimedia.org/wiki/File:Deutz-Fahr_Agrofarm_5105_Agritechnica_2023_(DSC04942).jpg', credit: 'MarcelX42', license: 'CC BY-SA 4.0' },
  { brand: 'deutz-fahr', slug: '5g', filename: 'deutz-fahr-5g-126k.webp', credit_url: 'https://commons.wikimedia.org/wiki/File:Deutz-Fahr_5100_G_Traktor.jpg', credit: 'JoachimKohler-HB', license: 'CC BY-SA 4.0' },
  { brand: 'deutz-fahr', slug: '7', filename: 'deutz-fahr-7-263k.webp', credit_url: 'https://commons.wikimedia.org/wiki/File:Deutz-Fahr_7250_TTV_agra_2024_(DSC01050).jpg', credit: 'MarcelX42', license: 'CC BY-SA 4.0' },
  { brand: 'deutz-fahr', slug: '8', filename: 'deutz-fahr-8-310k.webp', credit_url: "https://commons.wikimedia.org/wiki/File:Deutz-Fahr_8280_TTV_-_Motori_sotto_l'albero_2025_-_Castegnato.jpg", credit: 'Ensahequ', license: 'CC BY-SA 4.0' },
  { brand: 'deutz-fahr', slug: '9', filename: 'deutz-fahr-9-336k.webp', credit_url: 'https://commons.wikimedia.org/wiki/File:Deutz_Fahr_Serie_9_110300.jpg', credit: 'Reinhold Möller', license: 'CC BY-SA 4.0' },
  { brand: 'deutz-fahr', slug: '6c', filename: 'deutz-fahr-6c-143k.webp', credit_url: 'https://commons.wikimedia.org/wiki/File:Deutz-Fahr_6115_C_Agritechnica_2025_(DSC03580).jpg', credit: 'MarcelX42', license: 'CC BY-SA 4.0' },
  { brand: 'deutz-fahr', slug: '5d', filename: 'deutz-fahr-5d-97k.webp', credit_url: 'https://commons.wikimedia.org/wiki/File:Deutz-Fahr_5080D_Keyline_Agritechnica_2025_(DSC08620).jpg', credit: 'MarcelX42', license: 'CC BY-SA 4.0' },

  // Case IH (1)
  { brand: 'case-ih', slug: 'axial-flow-150-250-series', filename: 'case-ih-axial-flow-150-250-series-634k.webp', credit_url: 'https://commons.wikimedia.org/wiki/File:Case_IH_Axial_Flow_8260_agra_2024_(DSC01569).jpg', credit: 'MarcelX42', license: 'CC BY-SA 4.0' },

  // Kubota (9)
  { brand: 'kubota', slug: 'b', filename: 'kubota-b-33k.webp', credit_url: 'https://commons.wikimedia.org/wiki/File:A_Kubota_tractor_in_Brandenburg_01.jpg', credit: 'Kritzolina', license: 'CC BY-SA 4.0' },
  { brand: 'kubota', slug: 'l', filename: 'kubota-l-62k.webp', credit_url: 'https://commons.wikimedia.org/wiki/File:Kubota_L4610_Tractor_(5940912717).jpg', credit: 'Edmund Garman', license: 'CC BY 2.0' },
  { brand: 'kubota', slug: 'm4002', filename: 'kubota-m4002-74k.webp', credit_url: 'https://commons.wikimedia.org/wiki/File:Kubota_M4-063_Hydraulic_Shuttle_Agritechnica_2025_(DSC06727).jpg', credit: 'MarcelX42', license: 'CC BY-SA 4.0' },
  { brand: 'kubota', slug: 'm6', filename: 'kubota-m6-175k.webp', credit_url: 'https://commons.wikimedia.org/wiki/File:Kubota_M6-141_Utility_Agritechnica_2023_(DSC06031).jpg', credit: 'MarcelX42', license: 'CC BY-SA 4.0' },
  { brand: 'kubota', slug: 'm5002', filename: 'kubota-m5002-115k.webp', credit_url: 'https://commons.wikimedia.org/wiki/File:Kubota_M5-092_Agritechnica_2025_(DSC04299).jpg', credit: 'MarcelX42', license: 'CC BY-SA 4.0' },
  { brand: 'kubota', slug: 'm6002', filename: 'kubota-m6002-143k.webp', credit_url: 'https://commons.wikimedia.org/wiki/File:Kubota_M6-142_Agritechnica_2023_(DSC05314).jpg', credit: 'MarcelX42', license: 'CC BY-SA 4.0' },
  { brand: 'kubota', slug: 'm8', filename: 'kubota-m8-210k.webp', credit_url: 'https://commons.wikimedia.org/wiki/File:Tracteur_Kubota_M8-201.jpg', credit: 'Svenaimelescarottes', license: 'CC BY 4.0' },
  { brand: 'kubota', slug: 'mk', filename: 'kubota-mk-105k.webp', credit_url: 'https://commons.wikimedia.org/wiki/File:Kubota_M5101_Narrow_Cab_-_Front_and_left_side.jpg', credit: 'MarcelX42', license: 'CC BY-SA 4.0' },
  { brand: 'kubota', slug: 'dc', filename: 'kubota-dc-105k.webp', credit_url: 'https://commons.wikimedia.org/wiki/File:Kubota_DC-60.jpg', credit: 'Love Krittaya', license: 'Public domain' },
];

let ok = 0, skipped = 0, failed = 0;
const fileCache = new Map();

for (const u of UPDATES) {
  const file = `src/data/stroje/${u.brand}.yaml`;
  let content = fileCache.get(file) || readFileSync(file, 'utf-8');

  // Skip pokud už image_url obsahuje filename
  if (content.includes(`/${u.filename}`)) {
    console.log(`⊘ ${u.brand}/${u.slug}: už nahozeno`);
    skipped++;
    fileCache.set(file, content);
    continue;
  }

  // Pattern: series-level "      - slug: {slug}" (6 spaces + dash + space) followed by name/year_from/year_to
  // Inject 4 image fields PŘED `description:` na 8-space indent
  const pattern = new RegExp(
    `(\\n      - slug: ${u.slug.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\n[\\s\\S]*?)(\\n        description: )`,
    'm'
  );

  if (!pattern.test(content)) {
    console.error(`✗ ${u.brand}/${u.slug}: pattern nenalezen v yaml`);
    failed++;
    fileCache.set(file, content);
    continue;
  }

  const inject =
    `\n        image_url: /images/stroje/${u.brand}/${u.filename}` +
    `\n        image_credit_url: ${u.credit_url}` +
    `\n        image_credit: ${u.credit}` +
    `\n        image_license: ${u.license}`;

  content = content.replace(pattern, `$1${inject}$2`);
  fileCache.set(file, content);
  console.log(`✓ ${u.brand}/${u.slug}`);
  ok++;
}

// Write all updated files
for (const [file, content] of fileCache) {
  writeFileSync(file, content);
}

console.log(`\n✓ Updated: ${ok}   ⊘ Skipped: ${skipped}   ✗ Failed: ${failed}`);
console.log(`Files written: ${fileCache.size}`);
