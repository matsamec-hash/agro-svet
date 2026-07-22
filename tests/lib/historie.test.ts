import { describe, it, expect } from 'vitest';
import { machines, longRange, milestones, press, trivia, machineBySlug, seriesByKey } from '../../src/lib/historie';

describe('historie — lib accessory', () => {
  it('machineBySlug najde E-512', () => {
    const m = machineBySlug('kombajn-e-512');
    expect(m).toBeDefined();
    expect(m!.maker).toMatch(/Fortschritt/);
  });
  it('seriesByKey vrátí sérii dojivosti se stoupajícím trendem', () => {
    const s = seriesByKey('dojivost');
    expect(s).toBeDefined();
    expect(s!.points[s!.points.length - 1].value).toBeGreaterThan(s!.points[0].value);
  });
  it('milestones jsou seřazené vzestupně podle roku', () => {
    for (let i = 1; i < milestones.length; i++) {
      expect(milestones[i].year).toBeGreaterThanOrEqual(milestones[i - 1].year);
    }
  });
  it('základní kolekce nejsou prázdné', () => {
    expect(machines.length).toBeGreaterThan(0);
    expect(longRange.length).toBeGreaterThan(0);
    expect(press.length).toBeGreaterThan(0);
    expect(trivia.length).toBeGreaterThan(0);
  });
});
