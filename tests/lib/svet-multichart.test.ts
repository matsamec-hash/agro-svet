import { describe, it, expect } from 'vitest';
import { buildMultiSeriesModel, buildColorMap, CZ_COLOR, MULTI_OPTS } from '../../src/lib/svet/multichart';
import type { SeriesInput } from '../../src/lib/svet/multichart';

const mk = (slug: string, name: string, color: string, pts: [number, number][], isRef = false): SeriesInput => ({
  slug, name, color, isRef, points: pts.map(([year, value]) => ({ year, value })),
});

describe('buildColorMap', () => {
  it('cesko = zelená, ostatní stabilně z palety dle abecedy', () => {
    const m = buildColorMap(['nemecko', 'cesko', 'francie']);
    expect(m.cesko).toBe(CZ_COLOR);
    // 'francie' < 'nemecko' abecedně → francie dostane paletu[0]
    expect(m.francie).not.toBe(m.nemecko);
    // determinismus: stejný vstup → stejné barvy
    expect(buildColorMap(['francie', 'nemecko', 'cesko']).nemecko).toBe(m.nemecko);
  });
});

describe('buildMultiSeriesModel', () => {
  const ES = mk('spanelsko', 'Španělsko', '#c0523b', [[2015, 3.05], [2020, 4.25], [2025, 4.36]]);
  const CZ = mk('cesko', 'Česko', CZ_COLOR, [[2010, 4.99], [2015, 6.36], [2025, 6.67]], true);

  it('vytvoří čáru per zemi; ČR (ref) je poslední = navrch', () => {
    const m = buildMultiSeriesModel([ES, CZ], MULTI_OPTS);
    expect(m.lines).toHaveLength(2);
    expect(m.lines[m.lines.length - 1].isRef).toBe(true); // ref navrch
    expect(m.lines.every((l) => l.path.startsWith('M'))).toBe(true);
  });

  it('osa X = sjednocení roků, osa Y pokryje všechny hodnoty', () => {
    const m = buildMultiSeriesModel([ES, CZ], MULTI_OPTS);
    expect(m.xMin).toBe(2010); // ČR má 2010
    expect(m.xMax).toBe(2025);
    expect(m.lo).toBeLessThanOrEqual(3.05);
    expect(m.hi).toBeGreaterThanOrEqual(6.67);
  });

  it('body čáry rostou v X podle roku', () => {
    const m = buildMultiSeriesModel([CZ], MULTI_OPTS);
    const line = m.lines[0];
    // extrahuj x souřadnice z path
    const xs = line.path.slice(1).split('L').map((seg) => parseFloat(seg.split(' ')[0]));
    for (let i = 1; i < xs.length; i++) expect(xs[i]).toBeGreaterThan(xs[i - 1]);
  });

  it('vynechá NaN body; prázdný vstup → empty=true', () => {
    const bad = mk('x', 'X', '#000', [[2020, NaN as any]]);
    const m = buildMultiSeriesModel([bad], MULTI_OPTS);
    expect(m.empty).toBe(true);
    expect(m.lines).toHaveLength(0);
  });

  it('popisky X jsou v rozsahu a nepřekročí maxTicks', () => {
    const long = mk('ro', 'Rumunsko', '#000', Array.from({ length: 26 }, (_, i) => [2000 + i, i] as [number, number]));
    const m = buildMultiSeriesModel([long], MULTI_OPTS);
    expect(m.xLabels.length).toBeLessThanOrEqual(7);
    expect(m.xLabels[0].year).toBe(2000);
    expect(m.xLabels[m.xLabels.length - 1].year).toBe(2025);
  });
});
