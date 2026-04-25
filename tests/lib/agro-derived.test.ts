// tests/lib/agro-derived.test.ts
import { describe, it, expect } from 'vitest';
import { priceScissors } from '../../src/lib/agro-derived';

describe('priceScissors', () => {
  it('returns indexed series with base year = 100', () => {
    const commodities = [
      { name: 'Pšenice', month: 'leden 2015', price: 4000, unit: 'Kč/t' },
      { name: 'Pšenice', month: 'prosinec 2015', price: 4000, unit: 'Kč/t' },
      { name: 'Pšenice', month: 'leden 2016', price: 5000, unit: 'Kč/t' },
      { name: 'Pšenice', month: 'prosinec 2016', price: 5000, unit: 'Kč/t' },
    ];
    const fertilizers = [
      { name: 'NPK 15-15-15', year: '2015', price: 10000 },
      { name: 'NPK 15-15-15', year: '2016', price: 12000 },
    ];
    const fuels = [
      { fuel: 'Nafta', week: '1. týden 2015', price: 30 },
      { fuel: 'Nafta', week: '52. týden 2015', price: 30 },
      { fuel: 'Nafta', week: '1. týden 2016', price: 33 },
      { fuel: 'Nafta', week: '52. týden 2016', price: 33 },
    ];

    const result = priceScissors(commodities, fertilizers, fuels, 2015);
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ year: 2015, x: 100, y: 100 });
    // 2016: vstupy weighted avg (NPK +20%, nafta +10%) = +15%, výstupy (Pšenice +25%) = +25%
    expect(result[1].year).toBe(2016);
    expect(result[1].x).toBeCloseTo(115, 0);
    expect(result[1].y).toBe(125);
  });

  it('returns empty array if base year missing', () => {
    const result = priceScissors([], [], [], 2015);
    expect(result).toEqual([]);
  });
});
