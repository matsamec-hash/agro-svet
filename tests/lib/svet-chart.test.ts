import { describe, it, expect } from 'vitest';
import { buildChartModel, chartCaption } from '../../src/lib/svet/chart';
import type { SeriesPoint } from '../../src/lib/svet/types';

const ES: SeriesPoint[] = [
  { period: '2015', value: 3.05 }, { period: '2016', value: 3.63 }, { period: '2017', value: 2.44 },
  { period: '2018', value: 4.03 }, { period: '2019', value: 3.15 }, { period: '2020', value: 4.25 },
  { period: '2021', value: 4.02 }, { period: '2022', value: 3.0 }, { period: '2023', value: 2.07 },
  { period: '2024', value: 3.65 }, { period: '2025', value: 4.36 },
];
// ČR má delší rozsah (2010–2025) — musí se ořezat na roky země.
const CZ: SeriesPoint[] = [
  { period: '2010', value: 4.99 }, { period: '2013', value: 5.67 }, { period: '2015', value: 6.36 },
  { period: '2020', value: 6.14 }, { period: '2023', value: 6.44 }, { period: '2025', value: 6.67 },
];

const OPTS = { w: 320, h: 150, ml: 32, mr: 10, mt: 12, mb: 22 };

describe('buildChartModel', () => {
  it('umístí body země zleva doprava podle roku, uvnitř plochy grafu', () => {
    const m = buildChartModel(ES, null, OPTS);
    expect(m.points).toHaveLength(ES.length);
    // x roste monotónně
    for (let i = 1; i < m.points.length; i++) expect(m.points[i].x).toBeGreaterThan(m.points[i - 1].x);
    // první a poslední drží okraje
    expect(m.points[0].x).toBeCloseTo(OPTS.ml, 1);
    expect(m.points[m.points.length - 1].x).toBeCloseTo(OPTS.w - OPTS.mr, 1);
    // y v rámci kreslicí plochy
    for (const p of m.points) {
      expect(p.y).toBeGreaterThanOrEqual(OPTS.mt - 0.01);
      expect(p.y).toBeLessThanOrEqual(OPTS.h - OPTS.mb + 0.01);
    }
    // nejvyšší hodnota má nejmenší y (SVG y roste dolů)
    const maxPt = m.points.reduce((a, b) => (b.value > a.value ? b : a));
    const minY = Math.min(...m.points.map((p) => p.y));
    expect(maxPt.y).toBeCloseTo(minY, 1);
  });

  it('bez ČR série → hasRef=false, žádná refLine', () => {
    const m = buildChartModel(ES, null, OPTS);
    expect(m.hasRef).toBe(false);
    expect(m.refLine).toBe('');
    expect(m.hover.every((h) => h.refValue === null && h.diffPct === null)).toBe(true);
  });

  it('s ČR sérií zarovná ref hodnoty podle roku a spočítá % rozdíl', () => {
    const m = buildChartModel(ES, CZ, OPTS);
    expect(m.hasRef).toBe(true);
    expect(m.refLine).not.toBe('');
    // rok 2015: ES 3.05 vs ČR 6.36 → -52 %
    const h2015 = m.hover.find((h) => h.year === 2015)!;
    expect(h2015.refValue).toBe(6.36);
    expect(h2015.diffPct).toBe(Math.round((3.05 / 6.36 - 1) * 100));
    // rok bez ČR dat (2016) → refValue null
    const h2016 = m.hover.find((h) => h.year === 2016)!;
    expect(h2016.refValue).toBeNull();
    expect(h2016.diffPct).toBeNull();
  });

  it('osa Y pokrývá rozsah země i ČR (v rozsahu roků země)', () => {
    const m = buildChartModel(ES, CZ, OPTS);
    // ČR max 6.67 musí být uvnitř rozsahu → hi >= 6.67, lo <= 2.07
    expect(m.hi).toBeGreaterThanOrEqual(6.67);
    expect(m.lo).toBeLessThanOrEqual(2.07);
    expect(m.yTicks.length).toBeGreaterThanOrEqual(2);
  });

  it('jeden bod série → nespadne, vykreslí střed', () => {
    const m = buildChartModel([{ period: '2025', value: 5 }], null, OPTS);
    expect(m.points).toHaveLength(1);
    expect(Number.isFinite(m.points[0].x)).toBe(true);
    expect(Number.isFinite(m.points[0].y)).toBe(true);
  });
});

describe('chartCaption', () => {
  it('faktická věta: rozsah + roky + srovnání s ČR', () => {
    const c = chartCaption(ES, CZ, 't/ha', 'ČR');
    expect(c).toContain('2015');
    expect(c).toContain('2025');
    expect(c).toContain('t/ha');
    expect(c).toContain('ČR');
    // ES 4.36 < ČR 6.67 → "pod"
    expect(c.toLowerCase()).toContain('pod');
  });

  it('bez ČR → jen rozsah, žádné srovnání', () => {
    const c = chartCaption(ES, null, 't/ha', 'ČR');
    expect(c).toContain('t/ha');
    expect(c).not.toContain('ČR');
  });
});
