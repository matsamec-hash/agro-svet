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

describe('historie — pokrytí dat', () => {
  it('má aspoň 5 milníků a 6 strojů', () => {
    expect(milestones.length).toBeGreaterThanOrEqual(5);
    expect(machines.length).toBeGreaterThanOrEqual(6);
  });
  it('E-512 je v katalogu', () => {
    expect(machines.some((m) => m.slug === 'kombajn-e-512')).toBe(true);
  });
  it('každý stroj má ≥3 specs a příběh ≥200 znaků', () => {
    for (const m of machines) {
      expect(Object.keys(m.specs).length).toBeGreaterThanOrEqual(3);
      expect(m.story.length).toBeGreaterThanOrEqual(200);
    }
  });
  it('slugy strojů jsou unikátní', () => {
    const slugs = machines.map((m) => m.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
  it('povinné dlouhodobé série existují a mají ≥6 bodů se vzestupnými roky', () => {
    for (const key of ['dojivost', 'skot', 'prasata', 'osevni-plocha', 'pracovnici']) {
      const s = longRange.find((x) => x.key === key);
      expect(s, `chybí série ${key}`).toBeDefined();
      expect(s!.points.length).toBeGreaterThanOrEqual(6);
      for (let i = 1; i < s!.points.length; i++) {
        expect(s!.points[i].year).toBeGreaterThan(s!.points[i - 1].year);
      }
      expect(s!.source.length).toBeGreaterThan(0);
    }
  });
  it('má ≥6 výstřižků a ≥8 zajímavostí', () => {
    expect(press.length).toBeGreaterThanOrEqual(6);
    expect(trivia.length).toBeGreaterThanOrEqual(8);
  });
});
