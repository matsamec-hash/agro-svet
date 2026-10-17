// Trvalé (301) přesměrování stránek modelů, které zmizely z katalogu strojů
// (src/data/stroje/*.yaml). Volá je legacyRedirectTarget s cs cestou, takže
// platí pro všechny jazykové mutace najednou.
//
// Kdy sem model patří: výrobce ho nikdy nevyráběl, šlo o duplikát jiného
// záznamu, nebo se model jmenuje jinak (přejmenovaný slug či jiná řada).
// Stejně tak řada, která u výrobce neexistovala (/stroje/<značka>/<řada>).
// Ověření a zdroj každé položky je v ~/agro-svet/foto-audit/de/rizika/
// katalog-opravy.md. Cíl je stránka řady, nebo model, který zůstal.
// ‼️ Zdroj nesmí být živá stránka a cíl musí existovat — hlídá
// tests/lib/katalog-redirects.test.ts.

/** cs cesta smazaného nebo přejmenovaného modelu či řady (bez koncového lomítka) → cs cíl. */
export const REMOVED_MODEL_PAGES: Record<string, string> = {
  // 2026-10-17 CLAAS Lexion 8900: duplikát ve staré řadě 400–700 a záznam
  // „Lexion 8900 (new)“ sloučené do jednoho modelu v řadě 5000–8000.
  '/stroje/claas/lexion-400-500-600-700/lexion-8900': '/stroje/claas/lexion-5000-8000/lexion-8900/',
  '/stroje/claas/lexion-5000-8000/lexion-8900-new': '/stroje/claas/lexion-5000-8000/lexion-8900/',
  // 2026-10-17 Kubota M8: M8-191/M8-211 byla jen označení z představení 2019,
  // vyrábí se M8-181 a M8-201 (testy OECD 2217/2218 z roku 2020, prospekt Kubota 2021).
  '/stroje/kubota/m8/m8-191': '/stroje/kubota/m8/m8-181/',
  '/stroje/kubota/m8/m8-211': '/stroje/kubota/m8/m8-201/',
  // 2026-10-17 nářadí: označení podle aktuálních prospektů Amazone (P0023, P0219, P0032, P0228, P0053, P0057, P0284, P0300, P0045, P0293); Horsch Tiger LT už v nabídce není
  '/stroje/amazone/za-m/za-m-1001': '/stroje/amazone/za-m/za-m-1002-special/',
  '/stroje/amazone/za-m/za-m-1501': '/stroje/amazone/za-m/za-m-1502/',
  '/stroje/amazone/zg-ts/zg-ts-7500': '/stroje/amazone/zg-ts/zg-ts-7501/',
  '/stroje/amazone/cirrus/cirrus-6004-2c': '/stroje/amazone/cirrus/cirrus-6003-2c/',
  '/stroje/amazone/catros/catros-6003-2tx': '/stroje/amazone/catros/catros-6003-2ts/',
  '/stroje/amazone/catros/catros-7503-2tx': '/stroje/amazone/catros/catros-7003-2tx/',
  '/stroje/amazone/catros/catros-12003-2ts': '/stroje/amazone/catros/catros-12003-2tx/',
  '/stroje/amazone/catros-xl/catros-xl-4003-2': '/stroje/amazone/catros-xl/catros-xl-4003/',
  '/stroje/amazone/catros-xl/catros-xl-6003-2tx': '/stroje/amazone/catros-xl/catros-xl-6003-2ts/',
  '/stroje/amazone/catros-xl/catros-xl-9003-2tx': '/stroje/amazone/catros-xl/catros-xl-8003-2tx/',
  '/stroje/amazone/cenius/cenius-4003-2': '/stroje/amazone/cenius/cenius-4003-super/',
  '/stroje/amazone/cenio/cenio-4000-super': '/stroje/amazone/cenio/cenio-4000-2-super/',
  '/stroje/amazone/cobra/cobra-3000': '/stroje/amazone/cobra/cobra-6000-2tx/',
  '/stroje/amazone/kg/kg-4001-2': '/stroje/amazone/kg/kg-4002-2/',
  '/stroje/amazone/kg/kg-6001-2': '/stroje/amazone/kg/kg-6002-2/',
  '/stroje/amazone/ke/ke-3001-special': '/stroje/amazone/ke/ke-3002-150/',
  '/stroje/amazone/ke/ke-3002-190-super': '/stroje/amazone/ke/ke-3002-190/',
  '/stroje/amazone/ke/ke-4002-190-super': '/stroje/amazone/ke/ke-4002-190/',
  '/stroje/amazone/zg-ts/zg-ts-5500': '/stroje/amazone/zg-ts/',
  '/stroje/amazone/pantera/pantera-4503': '/stroje/amazone/pantera/',
  '/stroje/amazone/centaya/centaya-6000-2-super': '/stroje/amazone/centaya/',
  '/stroje/amazone/cirrus/cirrus-3503-compact': '/stroje/amazone/cirrus/',
  '/stroje/amazone/cenius/cenius-8003-2tx': '/stroje/amazone/cenius/',
  '/stroje/horsch/tiger/tiger-lt': '/stroje/horsch/tiger/',
  // 2026-10-17 Case IH: Magnum 435 neexistuje, 435 k je max. výkon Magnum 400 (prospekt Case IH 12/2021)
  '/stroje/case-ih/magnum/magnum-435': '/stroje/case-ih/magnum/magnum-400/',
  // 2026-10-17 Deutz-Fahr: 5100.4 G / 5110.4 G neexistují, výrobce vede 5100 G a 5110 G (prospekt 5G Tier 3)
  '/stroje/deutz-fahr/5g/5100-4g': '/stroje/deutz-fahr/5g/5100-g/',
  '/stroje/deutz-fahr/5g/5110-4g': '/stroje/deutz-fahr/5g/5110-g/',
  // 2026-10-17 Massey Ferguson: řada 8000 (1986–2000) neexistovala, 8110–8160 jsou řada 8100 (1995–1999); 4275 v evropské řadě 4200 nebyl
  '/stroje/massey-ferguson/4200/4275': '/stroje/massey-ferguson/4200/',
  '/stroje/massey-ferguson/8000/8120': '/stroje/massey-ferguson/8100/8120-8100/',
  '/stroje/massey-ferguson/8000/8130': '/stroje/massey-ferguson/8100/8130-8100/',
  '/stroje/massey-ferguson/8000/8140': '/stroje/massey-ferguson/8100/8140-8100/',
  '/stroje/massey-ferguson/8000/8150': '/stroje/massey-ferguson/8100/8150-8100/',
  '/stroje/massey-ferguson/8000/8160': '/stroje/massey-ferguson/8100/8160-8100/',
  '/stroje/massey-ferguson/8000/8110': '/stroje/massey-ferguson/8100/8110/',
  '/stroje/massey-ferguson/8000': '/stroje/massey-ferguson/8100/',
};

/** Přejmenované slugy modelů → nový slug. Přesměruje i srovnání /srovnani/<a>-vs-<b>/. */
export const RENAMED_MODEL_SLUGS: Record<string, string> = {
  'claas-lexion-8900-new': 'claas-lexion-8900',
  'kubota-m8-191': 'kubota-m8-181',
  'kubota-m8-211': 'kubota-m8-201',
  // 2026-10-17 nářadí: označení podle aktuálních prospektů Amazone (P0023, P0219, P0032, P0228, P0053, P0057, P0284, P0300, P0045, P0293); Horsch Tiger LT už v nabídce není
  'za-m-1001': 'za-m-1002-special',
  'za-m-1501': 'za-m-1502',
  'zg-ts-7500': 'zg-ts-7501',
  'cirrus-6004-2c': 'cirrus-6003-2c',
  'catros-6003-2tx': 'catros-6003-2ts',
  'catros-7503-2tx': 'catros-7003-2tx',
  'catros-12003-2ts': 'catros-12003-2tx',
  'catros-xl-4003-2': 'catros-xl-4003',
  'catros-xl-6003-2tx': 'catros-xl-6003-2ts',
  'catros-xl-9003-2tx': 'catros-xl-8003-2tx',
  'cenius-4003-2': 'cenius-4003-super',
  'cenio-4000-super': 'cenio-4000-2-super',
  'cobra-3000': 'cobra-6000-2tx',
  'kg-4001-2': 'kg-4002-2',
  'kg-6001-2': 'kg-6002-2',
  'ke-3001-special': 'ke-3002-150',
  'ke-3002-190-super': 'ke-3002-190',
  'ke-4002-190-super': 'ke-4002-190',
  // 2026-10-17 Deutz-Fahr: 5100.4 G / 5110.4 G neexistují, výrobce vede 5100 G a 5110 G (prospekt 5G Tier 3)
  'deutz-fahr-5100-4g': 'deutz-fahr-5100-g',
  'deutz-fahr-5110-4g': 'deutz-fahr-5110-g',
  // 2026-10-17 Massey Ferguson: řada 8000 (1986–2000) neexistovala, 8110–8160 jsou řada 8100 (1995–1999); 4275 v evropské řadě 4200 nebyl
  'massey-ferguson-8120': 'massey-ferguson-8120-8100',
  'massey-ferguson-8130': 'massey-ferguson-8130-8100',
  'massey-ferguson-8140': 'massey-ferguson-8140-8100',
  'massey-ferguson-8150': 'massey-ferguson-8150-8100',
  'massey-ferguson-8160': 'massey-ferguson-8160-8100',
};

const PAIR_DELIMITER = '-vs-';

/** cs cíl pro stránku smazaného modelu nebo srovnání s přejmenovaným modelem, jinak null. */
export function catalogRedirectTarget(csPath: string): string | null {
  const model = csPath.match(/^(\/stroje\/[^/]+\/[^/]+(?:\/[^/]+)?)\/?$/);
  if (model && Object.hasOwn(REMOVED_MODEL_PAGES, model[1])) return REMOVED_MODEL_PAGES[model[1]];

  const cmp = csPath.match(/^\/srovnani\/([^/]+)\/?$/);
  if (cmp) {
    const combo = cmp[1];
    const idx = combo.indexOf(PAIR_DELIMITER);
    if (idx === -1) return null;
    const a = combo.slice(0, idx);
    const b = combo.slice(idx + PAIR_DELIMITER.length);
    if (!Object.hasOwn(RENAMED_MODEL_SLUGS, a) && !Object.hasOwn(RENAMED_MODEL_SLUGS, b)) return null;
    const na = RENAMED_MODEL_SLUGS[a] ?? a;
    const nb = RENAMED_MODEL_SLUGS[b] ?? b;
    if (na === nb) return null;
    // Stejné kanonické pořadí jako pairCombo() v lib/comparator.ts.
    const [first, second] = na < nb ? [na, nb] : [nb, na];
    return `/srovnani/${first}${PAIR_DELIMITER}${second}/`;
  }
  return null;
}
