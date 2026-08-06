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

/** min/max/avg přes ne-null hodnoty metriky. */
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

/** Sekvenční zelená škála, t ∈ <0,1>. */
export function colorScale(t: number): string {
  const s = [
    [240, 249, 236],
    [173, 221, 142],
    [65, 171, 93],
    [0, 68, 27],
  ];
  const g = Math.min(2, Math.floor(t * 3));
  const lt = t * 3 - g;
  const a = s[g];
  const b = s[g + 1];
  const c = (i: number) => Math.round(a[i] + (b[i] - a[i]) * lt);
  return `rgb(${c(0)},${c(1)},${c(2)})`;
}
