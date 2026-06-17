import { describe, it, expect } from 'vitest';
import data from '../../src/data/agro-stats-uk.json';
import type { StatistikyUkData } from '../../src/lib/statistiky-uk';

const d = data as unknown as StatistikyUkData;
const CROP_SLUGS = ['psenice', 'kukurice', 'slunecnice', 'jecmen'];

function assertAttrib(s: { asOf: string; source: string; url: string }) {
  expect(s.asOf.length).toBeGreaterThan(0);
  expect(s.source.length).toBeGreaterThan(0);
  expect(s.url.startsWith('http')).toBe(true);
}

describe('agro-stats-uk.json', () => {
  it('má všechny top-level klíče StatistikyUkData', () => {
    for (const k of ['generated', 'warCaveat', 'bigNumbers', 'crops', 'exportShare', 'facts', 'sources']) {
      expect(d).toHaveProperty(k);
    }
  });

  it('obsahuje přesně velkou čtyřku (správné slugy)', () => {
    expect(d.crops.map((c) => c.slug).sort()).toEqual([...CROP_SLUGS].sort());
  });

  it('každá plodina má grounded produkci i plochu s ≥2 body, roky vzestupně', () => {
    for (const c of d.crops) {
      for (const blk of [c.production, c.area]) {
        expect(blk.series.length).toBeGreaterThanOrEqual(2);
        assertAttrib(blk);
        const years = blk.series.map((p) => p.year);
        expect(years).toEqual([...years].sort((a, b) => a - b));
        // Guard 1 — žádné duplicitní roky
        expect(new Set(years).size).toBe(years.length); // žádné duplicitní roky
        for (const p of blk.series) {
          // Guard 2 — každá hodnota je finite a kladná
          expect(Number.isFinite(p.value)).toBe(true);
          expect(p.value).toBeGreaterThan(0);
        }
      }
      expect(c.name.length).toBeGreaterThan(0);
    }
  });

  // Guard 3 — max/ticks jsou validní a nepřekrývají (anti-clipping)
  it('max/ticks jsou validní a chart-safe pro každou plodinu a sérii', () => {
    for (const c of d.crops) {
      for (const blk of [c.production, c.area]) {
        const seriesMax = Math.max(...blk.series.map((p) => p.value));
        expect(blk.max).toBeGreaterThanOrEqual(seriesMax);
        expect(blk.ticks.length).toBeGreaterThan(0);
        expect(blk.ticks[0]).toBe(0);
        expect(blk.ticks).toEqual([...blk.ticks].sort((a, b) => a - b));
        expect(blk.ticks.at(-1)).toBeLessThanOrEqual(blk.max);
      }
    }
  });

  it('bigNumbers a facts mají atribuci', () => {
    expect(d.bigNumbers.length).toBeGreaterThan(0);
    for (const b of d.bigNumbers) assertAttrib(b);
    for (const f of d.facts) assertAttrib(f);
  });

  it('exportShare má atribuci a neprázdné items s % v rozsahu 0–100', () => {
    assertAttrib(d.exportShare);
    expect(d.exportShare.items.length).toBeGreaterThan(0);
    for (const it of d.exportShare.items) {
      expect(it.pct).toBeGreaterThanOrEqual(0);
      expect(it.pct).toBeLessThanOrEqual(100);
    }
  });

  it('sources jsou neprázdné odkazy', () => {
    expect(d.sources.length).toBeGreaterThan(0);
    for (const s of d.sources) expect(s.url.startsWith('http')).toBe(true);
  });
});
