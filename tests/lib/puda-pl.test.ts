import { describe, it, expect } from 'vitest';
import { buildLineChart, pudaPlPriceGrowthPct } from '../../src/lib/puda-pl';
import type { PudaPlData } from '../../src/lib/puda-pl';

describe('puda-pl re-export', () => {
  it('buildLineChart funguje (≥2 body → path)', () => {
    const c = buildLineChart([{ year: 2020, value: 40000 }, { year: 2024, value: 65000 }], { max: 70000, ticks: [0, 35000, 70000] });
    expect(c.points.length).toBe(2);
    expect(c.path.startsWith('M')).toBe(true);
  });
  it('pudaPlPriceGrowthPct počítá růst', () => {
    const d = { cena: { series: [{ year: 2020, value: 40000 }, { year: 2024, value: 60000 }] } } as PudaPlData;
    expect(pudaPlPriceGrowthPct(d)).toBe(50);
  });
  it('<2 body → null', () => {
    const d = { cena: { series: [{ year: 2024, value: 60000 }] } } as PudaPlData;
    expect(pudaPlPriceGrowthPct(d)).toBe(null);
  });
});
