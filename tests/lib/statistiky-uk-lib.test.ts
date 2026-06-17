import { describe, it, expect } from 'vitest';
import { buildLineChart, type StatistikyUkSeriesPoint } from '../../src/lib/statistiky-uk';

describe('statistiky-uk buildLineChart (reuse)', () => {
  const series: StatistikyUkSeriesPoint[] = [
    { year: 2021, value: 33 },
    { year: 2024, value: 22 },
  ];
  it('maps first/last points to plot extremes', () => {
    const c = buildLineChart(series, { max: 40, ticks: [0, 20, 40] });
    expect(c.points).toHaveLength(2);
    expect(c.points[0].x).toBeCloseTo(50, 1);
    expect(c.points[1].x).toBeCloseTo(1180, 1);
    expect(c.path.startsWith('M')).toBe(true);
    expect(c.area.trim().endsWith('Z')).toBe(true);
  });
});
