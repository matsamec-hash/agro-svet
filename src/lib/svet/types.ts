export type PackageKey = 'produkce' | 'puda' | 'ekonomika' | 'obchod';

export interface DataPoint {
  value: number;
  unit: string;
  referencePeriod: string; // období DAT, ne stažení: '2024' | 'MR 2024/25'
  source: string;          // 'Eurostat' | 'FAOSTAT' | 'USDA FAS PSD' | 'DEFRA'
  sourceUrl: string;
  fetchedAt: string;       // ISO datum stažení
}

export interface SeriesPoint {
  period: string;
  value: number;
}

export interface Indicator {
  key: string;
  label: string;
  pkg: PackageKey;
  unit: string;
  latest: DataPoint;
  series: SeriesPoint[]; // chronologicky vzestupně, ≥1 bod
}

export interface CountryProfile {
  slug: string;
  geo: string;
  nameCs: string;
  flag: string;
  generated: string;
  indicators: Record<string, Indicator>;
}

const POINT_FIELDS: (keyof DataPoint)[] = ['value', 'unit', 'referencePeriod', 'source', 'sourceUrl', 'fetchedAt'];

export function assertCountryProfile(p: any): asserts p is CountryProfile {
  for (const f of ['slug', 'geo', 'nameCs', 'flag', 'generated'] as const) {
    if (!p?.[f]) throw new Error(`CountryProfile: chybí pole "${f}"`);
  }
  if (!p.indicators || typeof p.indicators !== 'object') throw new Error('CountryProfile: chybí indicators');
  for (const [key, ind] of Object.entries<any>(p.indicators)) {
    for (const f of ['key', 'label', 'pkg', 'unit'] as const) {
      if (!ind?.[f]) throw new Error(`Indicator ${key}: chybí pole "${f}"`);
    }
    if (!Array.isArray(ind.series) || ind.series.length === 0) {
      throw new Error(`Indicator ${key}: prázdné nebo chybějící series`);
    }
    for (const f of POINT_FIELDS) {
      if (ind.latest?.[f] === undefined || ind.latest?.[f] === null || ind.latest?.[f] === '') {
        throw new Error(`Indicator ${key}: latest chybí "${f}"`);
      }
    }
  }
}
