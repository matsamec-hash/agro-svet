// tests/lib/agro-derived.test.ts
import { describe, it, expect } from 'vitest';
import { priceScissors, fiveYearAverage, biggestYoyChange } from '../../src/lib/agro-derived';

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

const MONTHS = ['leden','únor','březen','duben','květen','červen','červenec','srpen','září','říjen','listopad','prosinec'];

describe('fiveYearAverage', () => {
  it('computes rolling average of 60 months ending at given month', () => {
    // 61 měsíců (prosinec 2017 → prosinec 2022) za 100, pak spike v leden 2023
    const prices: { name: string; month: string; price: number; unit: string }[] = [];
    for (let i = 0; i < 61; i++) {
      const monthIdx = (i + 11) % 12; // start at Dec (idx 11)
      const year = 2017 + Math.floor((i + 11) / 12);
      prices.push({ name: 'Pšenice', month: `${MONTHS[monthIdx]} ${year}`, price: 100, unit: 'Kč/t' });
    }
    prices.push({ name: 'Pšenice', month: 'leden 2023', price: 200, unit: 'Kč/t' });

    expect(fiveYearAverage(prices, 'leden 2023')).toBe(100);
    // pro prosinec 2022 (před skokem) = 100
    expect(fiveYearAverage(prices, 'prosinec 2022')).toBe(100);
  });

  it('returns null when fewer than 60 months available', () => {
    const prices = [{ name: 'Pšenice', month: 'leden 2023', price: 100, unit: 'Kč/t' }];
    expect(fiveYearAverage(prices, 'leden 2023')).toBeNull();
  });
});

describe('biggestYoyChange', () => {
  it('finds commodity with largest abs year-over-year change', () => {
    const stats = [
      { name: 'Pšenice', price: 5200, change: 4.2, prevYearPrice: 5000, month: 'duben 2026', unit: 'Kč/t' },
      { name: 'Mléko', price: 9.85, change: -1.5, prevYearPrice: 10, month: 'duben 2026', unit: 'Kč/l' },
      { name: 'Vejce', price: 4.5, change: 12.0, prevYearPrice: 4, month: 'duben 2026', unit: 'Kč/ks' },
    ];
    const result = biggestYoyChange(stats);
    expect(result?.name).toBe('Vejce');
    expect(result?.change).toBe(12.0);
  });

  it('returns null when no commodities have change', () => {
    expect(biggestYoyChange([])).toBeNull();
  });
});

import { inputCostInflation, livestockMilestone } from '../../src/lib/agro-derived';

describe('inputCostInflation', () => {
  it('returns percent change of latest year vs base year for given fertilizer', () => {
    const ferts = [
      { name: 'NPK 15-15-15', year: '2019', price: 10000 },
      { name: 'NPK 15-15-15', year: '2024', price: 13500 },
      { name: 'Močovina', year: '2019', price: 8000 },
    ];
    expect(inputCostInflation(ferts, 'NPK 15-15-15', 2019)).toBeCloseTo(35, 1);
  });

  it('returns null if base or latest year missing', () => {
    expect(inputCostInflation([], 'NPK 15-15-15', 2019)).toBeNull();
  });
});

describe('livestockMilestone', () => {
  it('detects when latest count is below threshold for first time in series', () => {
    const livestock = [
      { animal: 'Skot', count: 1500000, date: '1.1.2018' },
      { animal: 'Skot', count: 1400000, date: '1.1.2020' },
      { animal: 'Skot', count: 1280000, date: '1.1.2024' },
    ];
    const result = livestockMilestone(livestock, 'Skot', 1300000);
    expect(result).toMatchObject({ animal: 'Skot', breached: true });
  });

  it('returns null if threshold never breached', () => {
    const livestock = [{ animal: 'Skot', count: 1500000, date: '1.1.2024' }];
    expect(livestockMilestone(livestock, 'Skot', 1000000)).toBeNull();
  });
});
