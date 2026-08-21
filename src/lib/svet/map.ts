// Čisté helpery pro mapu zemědělských podmínek (/svet/mapa). Bez DOM/Astro závislostí → testovatelné.

export type MetricKey = 'cap' | 'land' | 'rent' | 'wage' | 'size' | 'age';

export interface MetricDef {
  key: MetricKey;
  label: string;
  unit: string;
  group: string;
  /** currency metriky se přepočítávají €→Kč; ostatní (ha, %) ne. */
  currency?: boolean;
}

export const METRIC_DEFS: MetricDef[] = [
  { key: 'cap', label: 'CAP platby', unit: '€/ha', group: 'Podpory', currency: true },
  { key: 'land', label: 'Cena půdy', unit: '€/ha', group: 'Ekonomika', currency: true },
  { key: 'rent', label: 'Pachtovné', unit: '€/ha', group: 'Ekonomika', currency: true },
  { key: 'wage', label: 'Zeměd. mzda', unit: '€/měs', group: 'Ekonomika', currency: true },
  { key: 'size', label: 'Velikost farmy', unit: 'ha', group: 'Struktura' },
  { key: 'age', label: 'Mladí <35', unit: '%', group: 'Struktura' },
];

export type Row = { code: string } & Partial<Record<MetricKey, number | null>>;

// Barvy choropletu NEduplikuj — použij existující `mapcolor.ts`
// (`rampColor` / `extent` / `colorFor`). Zde jen metriky/pořadí/měna, co tam nejsou.

/** min/max/avg přes ne-null hodnoty metriky (avg navíc oproti mapcolor.extent — pro srovnání s EU Ø). */
export function metricStat(rows: Row[], k: MetricKey): { min: number; max: number; avg: number } {
  const vs = rows.map((r) => r[k]).filter((v): v is number => typeof v === 'number');
  const min = Math.min(...vs);
  const max = Math.max(...vs);
  return { min, max, avg: vs.reduce((a, b) => a + b, 0) / vs.length };
}

/** Pořadí země sestupně (1 = nejvyšší). null pokud země hodnotu nemá. */
export function rankOf(rows: Row[], k: MetricKey, code: string): [number, number] | null {
  const arr = rows
    .filter((r) => typeof r[k] === 'number')
    .sort((a, b) => (b[k] as number) - (a[k] as number));
  const i = arr.findIndex((r) => r.code === code);
  return i < 0 ? null : [i + 1, arr.length];
}

/** Prezentační převod EUR→CZK jen u currency metrik. */
export function convert(v: number, m: MetricDef, cur: 'czk' | 'eur', rate: number): number {
  return m.currency && cur === 'czk' ? Math.round(v * rate) : v;
}

/** Jednotka dle měny (€/ha → Kč/ha). */
export function unitOf(m: MetricDef, cur: 'czk' | 'eur'): string {
  return m.currency && cur === 'czk' ? m.unit.replace('€', 'Kč') : m.unit;
}


/**
 * Slugy zemí, které mají profilovou stránku /svet/<slug>/.
 *
 * Pozor na `reference: true` (Česko): ČR profil MÁ (cesko.json, stránka vrací
 * 200 a je v sitemapě), jen se na ní potlačí sebe-porovnání „vs ČR". Dřív ji
 * mapa i tabulka vyfiltrovaly jako „stránka neexistuje" a jediná země, kterou
 * Čech na české mapě hledá, nešla prokliknout.
 *
 * Zdroj pravdy je index.json — ten sestavuje build-svet.mjs právě z profilů,
 * které opravdu vznikly.
 */
export function pageSlugs(index: { countries: { slug: string }[] }): Set<string> {
  return new Set(index.countries.map((c) => c.slug));
}
