import { describe, it, expect } from 'vitest';
import { buildLineChart, type ChartSeriesPoint } from '../../src/lib/chart-line';

describe('chart-line buildLineChart', () => {
  const series: ChartSeriesPoint[] = [
    { year: 2021, value: 1000 },
    { year: 2024, value: 2000 },
  ];

  it('mapuje první/poslední bod na extrémy plochy', () => {
    const c = buildLineChart(series, { max: 2000, ticks: [0, 1000, 2000] });
    expect(c.points).toHaveLength(2);
    expect(c.points[0].x).toBeCloseTo(50, 1);
    expect(c.points[1].x).toBeCloseTo(1180, 1);
    expect(c.points[1].y).toBeCloseTo(20, 1);
  });

  it('path začíná M a area končí Z', () => {
    const c = buildLineChart(series, { max: 2000, ticks: [0, 2000] });
    expect(c.path.startsWith('M')).toBe(true);
    expect(c.area.trim().endsWith('Z')).toBe(true);
  });
});
