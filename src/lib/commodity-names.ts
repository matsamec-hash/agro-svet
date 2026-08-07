// Stable list of commodity names rendered as buttons in CommodityChart.
//
// Single source of truth for the chart's button row. Mirrors the keys produced
// by scripts/fetch-commodities.mjs (the build-time CZSO fetcher) and the
// names served by /statistiky/commodity-data-recent.json.
//
// Lives in its own tiny module so the homepage can render the chart buttons
// without bundling the 256 KB commodities.json into the Worker.

export const COMMODITY_NAMES = [
  'Pšenice',
  'Ječmen',
  'Řepka',
  'Kukuřice',
  'Mléko',
  'Vepřové',
  'Hovězí',
  'Vejce',
  'Mák',
] as const;

export type CommodityName = typeof COMMODITY_NAMES[number];

// Polské názvy komodit pro homepage graf (locale='pl', dataBase='-pl'). Pořadí
// i názvy MUSÍ odpovídat klíčům v /statistiky/commodity-data-recent-pl.json
// (zdroj: agro-stats-pl.json → commodityFull) — jinak graf sérii nenajde.
// Malý modul, ať homepage worker nebundluje celý agro-stats-pl.json.
export const COMMODITY_NAMES_PL = [
  'Pszenica',
  'Jęczmień',
  'Kukurydza',
  'Rzepak',
  'Żywiec wieprzowy',
  'Żywiec wołowy',
  'Mleko',
] as const;

// SK názvy komodit (homepage graf, dataBase='-sk'). Pořadí+názvy MUSÍ odpovídat
// klíčům v /statistiky/commodity-data-recent-sk.json (agro-stats-sk.json → commodityFull).
export const COMMODITY_NAMES_SK = [
  'Pšenica',
  'Jačmeň',
  'Kukurica',
  'Repka',
  'Hovädzie',
  'Bravčové',
] as const;
