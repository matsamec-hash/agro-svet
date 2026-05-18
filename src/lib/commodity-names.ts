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
