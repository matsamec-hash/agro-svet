import { describe, it, expect } from 'vitest';
import { pickSeries } from '../../scripts/lib/eurostat-sk.mjs';

// Minimální JSON-stat: 1 dim "currency"(EUR,NAC) × 1 dim "prod"(A,B) × 1 dim "time"(2023,2024)
// id pořadí = [currency, prod, time]; size = [2,2,2]
// flat index = c*4 + p*2 + t
const FIXTURE = {
  id: ['currency', 'prod', 'time'],
  size: [2, 2, 2],
  dimension: {
    currency: { category: { index: { EUR: 0, NAC: 1 } } },
    prod: { category: { index: { A: 0, B: 1 } } },
    time: { category: { index: { '2023': 0, '2024': 1 }, label: { '2023': '2023', '2024': '2024' } } },
  },
  // EUR(0)/A(0): 2023=10 (idx0), 2024=11 (idx1); EUR(0)/B(1): 2023=20 (idx2), 2024=21 (idx3)
  value: { 0: 10, 1: 11, 2: 20, 3: 21, 4: 99, 5: 99, 6: 99, 7: 99 },
};

describe('pickSeries', () => {
  it('extrahuje časovou řadu pro dané fixní souřadnice', () => {
    const out = pickSeries(FIXTURE, { currency: 'EUR', prod: 'A' });
    expect(out).toEqual([
      { time: '2023', value: 10 },
      { time: '2024', value: 11 },
    ]);
  });
  it('vrátí prázdné pole když souřadnice nemá hodnoty', () => {
    const sparse = { ...FIXTURE, value: { 0: 10 } }; // jen EUR/A/2023
    const out = pickSeries(sparse, { currency: 'EUR', prod: 'B' });
    expect(out).toEqual([]);
  });
});
