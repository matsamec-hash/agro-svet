// Registr indikátorů. spec.source určuje fetcher.
//  - eurostat: spec.dataset + spec.filters (BEZ geo — doplní orchestrátor podle země.geo).
//              POZOR: apro_* datasety mají povinnou dimenzi freq → freq:'A'.
//  - worldbank: spec.indicator (BEZ country — doplní orchestrátor podle země.wb).
// spec.scale = násobitel hodnot na cílovou jednotku. sourceLabel/pageUrl = lidský zdroj.
export const INDICATORS = [
  {
    key: 'wheat_yield', label: 'Výnos pšenice', pkg: 'produkce', unit: 't/ha',
    spec: {
      source: 'eurostat', dataset: 'apro_cpsh1',
      filters: { freq: 'A', crops: 'C1100', strucpro: 'YLD_HUMD_EU_T_HA' },
      sourceLabel: 'Eurostat',
      pageUrl: 'https://ec.europa.eu/eurostat/databrowser/view/apro_cpsh1/default/table',
      scale: 1,
    },
  },
  {
    key: 'maize_yield', label: 'Výnos kukuřice', pkg: 'produkce', unit: 't/ha',
    spec: {
      source: 'eurostat', dataset: 'apro_cpsh1',
      filters: { freq: 'A', crops: 'C1500', strucpro: 'YLD_HUMD_EU_T_HA' },
      sourceLabel: 'Eurostat',
      pageUrl: 'https://ec.europa.eu/eurostat/databrowser/view/apro_cpsh1/default/table',
      scale: 1,
    },
  },
  {
    key: 'barley_yield', label: 'Výnos ječmene', pkg: 'produkce', unit: 't/ha',
    spec: {
      source: 'eurostat', dataset: 'apro_cpsh1',
      filters: { freq: 'A', crops: 'C1300', strucpro: 'YLD_HUMD_EU_T_HA' },
      sourceLabel: 'Eurostat',
      pageUrl: 'https://ec.europa.eu/eurostat/databrowser/view/apro_cpsh1/default/table',
      scale: 1,
    },
  },
  {
    key: 'rapeseed_yield', label: 'Výnos řepky', pkg: 'produkce', unit: 't/ha',
    spec: {
      source: 'eurostat', dataset: 'apro_cpsh1',
      filters: { freq: 'A', crops: 'I1110', strucpro: 'YLD_HUMD_EU_T_HA' },
      sourceLabel: 'Eurostat',
      pageUrl: 'https://ec.europa.eu/eurostat/databrowser/view/apro_cpsh1/default/table',
      scale: 1,
    },
  },
  {
    key: 'cereal_yield', label: 'Výnos obilovin', pkg: 'produkce', unit: 't/ha',
    spec: {
      source: 'worldbank', indicator: 'AG.YLD.CREL.KG',
      sourceLabel: 'World Bank',
      pageUrl: 'https://data.worldbank.org/indicator/AG.YLD.CREL.KG',
      scale: 0.001, // kg/ha → t/ha
    },
  },
  {
    key: 'ag_land', label: 'Zemědělská plocha', pkg: 'puda', unit: 'mil. ha',
    spec: {
      source: 'worldbank', indicator: 'AG.LND.AGRI.K2',
      sourceLabel: 'World Bank',
      pageUrl: 'https://data.worldbank.org/indicator/AG.LND.AGRI.K2',
      scale: 0.0001, // km² → mil. ha
    },
  },
];
