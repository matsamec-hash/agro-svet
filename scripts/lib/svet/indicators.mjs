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
    key: 'cattle_count', label: 'Stavy skotu', pkg: 'produkce', unit: '1000 ks',
    spec: {
      source: 'eurostat', dataset: 'apro_mt_lscatl',
      // všechny non-time dimenze napevno: freq + month (listopad–prosinec, roční sčítání) + animals + unit
      filters: { freq: 'A', month: 'M11_M12', animals: 'A2000', unit: 'THS_HD' },
      sourceLabel: 'Eurostat',
      pageUrl: 'https://ec.europa.eu/eurostat/databrowser/view/apro_mt_lscatl/default/table',
      scale: 1,
    },
  },
  {
    key: 'pigs_count', label: 'Stavy prasat', pkg: 'produkce', unit: '1000 ks',
    spec: {
      source: 'eurostat', dataset: 'apro_mt_lspig',
      filters: { freq: 'A', month: 'M11_M12', animals: 'A3100', unit: 'THS_HD' },
      sourceLabel: 'Eurostat',
      pageUrl: 'https://ec.europa.eu/eurostat/databrowser/view/apro_mt_lspig/default/table',
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
  {
    key: 'arable_land', label: 'Orná půda', pkg: 'puda', unit: 'mil. ha',
    spec: {
      source: 'worldbank', indicator: 'AG.LND.ARBL.HA',
      sourceLabel: 'World Bank',
      pageUrl: 'https://data.worldbank.org/indicator/AG.LND.ARBL.HA',
      scale: 0.000001, // ha → mil. ha
    },
  },
  {
    key: 'ag_value_added_gdp', label: 'Podíl zemědělství na HDP', pkg: 'ekonomika', unit: '%',
    spec: {
      source: 'worldbank', indicator: 'NV.AGR.TOTL.ZS',
      sourceLabel: 'World Bank',
      pageUrl: 'https://data.worldbank.org/indicator/NV.AGR.TOTL.ZS',
      scale: 1,
    },
  },
  {
    key: 'ag_employment', label: 'Zaměstnanost v zemědělství', pkg: 'ekonomika', unit: '%',
    spec: {
      source: 'worldbank', indicator: 'SL.AGR.EMPL.ZS',
      sourceLabel: 'World Bank',
      pageUrl: 'https://data.worldbank.org/indicator/SL.AGR.EMPL.ZS',
      scale: 1,
    },
  },
  {
    key: 'fert_use', label: 'Spotřeba hnojiv', pkg: 'obchod', unit: 'kg/ha',
    spec: {
      source: 'worldbank', indicator: 'AG.CON.FERT.ZS',
      sourceLabel: 'World Bank',
      pageUrl: 'https://data.worldbank.org/indicator/AG.CON.FERT.ZS',
      scale: 1,
    },
  },
];
