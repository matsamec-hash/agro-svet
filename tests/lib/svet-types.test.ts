import { describe, it, expect } from 'vitest';
import { assertCountryProfile } from '../../src/lib/svet/types';

const valid = {
  slug: 'nemecko', geo: 'DE', nameCs: 'Německo', flag: '🇩🇪',
  generated: '2026-06-19',
  indicators: {
    wheat_yield: {
      key: 'wheat_yield', label: 'Výnos pšenice', pkg: 'produkce', unit: 't/ha',
      latest: { value: 7.3, unit: 't/ha', referencePeriod: '2024', source: 'Eurostat', sourceUrl: 'https://ec.europa.eu/eurostat', fetchedAt: '2026-06-19' },
      series: [{ period: '2023', value: 7.1 }, { period: '2024', value: 7.3 }],
    },
  },
};

describe('assertCountryProfile', () => {
  it('projde validní profil', () => {
    expect(() => assertCountryProfile(valid)).not.toThrow();
  });
  it('selže když datapointu chybí source', () => {
    const bad = structuredClone(valid);
    delete bad.indicators.wheat_yield.latest.source;
    expect(() => assertCountryProfile(bad)).toThrow(/source/);
  });
  it('selže když indikátor nemá žádné body řady', () => {
    const bad = structuredClone(valid);
    bad.indicators.wheat_yield.series = [];
    expect(() => assertCountryProfile(bad)).toThrow(/series/);
  });
});
