import { describe, it, expect } from 'vitest';
import { sanityCheck } from '../../scripts/lib/svet/verify.mjs';

const ind = (over = {}) => ({
  key: 'wheat_yield', label: 'Výnos pšenice', pkg: 'produkce', unit: 't/ha',
  latest: { value: 7.3, unit: 't/ha', referencePeriod: '2024', source: 'Eurostat', sourceUrl: 'x', fetchedAt: '2026-06-19' },
  series: [{ period: '2023', value: 7.1 }, { period: '2024', value: 7.3 }],
  ...over,
});

describe('sanityCheck', () => {
  it('nevrátí žádný problém pro rozumný výnos', () => {
    expect(sanityCheck(ind())).toEqual([]);
  });
  it('označí výnos mimo rozsah (např. 730 t/ha = chyba jednotky)', () => {
    const bad = ind({ latest: { ...ind().latest, value: 730 } });
    expect(sanityCheck(bad).length).toBeGreaterThan(0);
  });
  it('označí když poslední bod řady nesedí s latest.value', () => {
    const bad = ind({ series: [{ period: '2024', value: 1 }] });
    expect(sanityCheck(bad).some((m) => /latest/.test(m))).toBe(true);
  });
});
