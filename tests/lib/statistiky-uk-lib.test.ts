import { describe, it, expect } from 'vitest';
import { cropGrowthPct, type StatUkSeries } from '../../src/lib/statistiky-uk';

function mkSeries(values: number[]): StatUkSeries {
  return {
    unit: 'млн т', asOf: '2024', source: 'USDA PSD', url: 'https://apps.fas.usda.gov/psdonline/',
    max: 100, ticks: [0, 50, 100],
    series: values.map((v, i) => ({ year: 2015 + i, value: v })),
  };
}

describe('statistiky-uk cropGrowthPct', () => {
  it('spočítá růst v % z prvního na poslední bod', () => {
    expect(cropGrowthPct(mkSeries([20, 25, 30]))).toBe(50);
  });
  it('vrátí null pro <2 body', () => {
    expect(cropGrowthPct(mkSeries([20]))).toBeNull();
  });
  it('vrátí null když první hodnota je 0 (dělení nulou)', () => {
    expect(cropGrowthPct(mkSeries([0, 30]))).toBeNull();
  });
});
