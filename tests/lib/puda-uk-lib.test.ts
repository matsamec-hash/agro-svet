import { describe, it, expect } from 'vitest';
import { buildLineChart, type PudaUkSeriesPoint } from '../../src/lib/puda-uk';

describe('buildLineChart', () => {
  const series: PudaUkSeriesPoint[] = [
    { year: 2021, value: 1000 },
    { year: 2024, value: 2000 },
  ];

  it('maps first/last points to plot extremes', () => {
    const c = buildLineChart(series, { max: 2000, ticks: [0, 1000, 2000] });
    expect(c.points).toHaveLength(2);
    expect(c.points[0].x).toBeCloseTo(50, 1);
    expect(c.points[1].x).toBeCloseTo(1180, 1);
    expect(c.points[1].y).toBeCloseTo(20, 1);
  });

  it('produces an SVG path starting with M and an area path ending with Z', () => {
    const c = buildLineChart(series, { max: 2000, ticks: [0, 2000] });
    expect(c.path.startsWith('M')).toBe(true);
    expect(c.area.trim().endsWith('Z')).toBe(true);
  });
});
