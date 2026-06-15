import { describe, it, expect } from 'vitest';
import data from '../../src/data/agro-puda-uk.json';
import type { PudaUkData } from '../../src/lib/puda-uk';

const d = data as unknown as PudaUkData;

describe('agro-puda-uk.json', () => {
  it('má všechny top-level klíče PudaUkData', () => {
    for (const k of ['generated', 'warCaveat', 'bigNumbers', 'reformTimeline', 'cena', 'najem', 'plodiny', 'facts', 'threats', 'sources']) {
      expect(d).toHaveProperty(k);
    }
  });

  it('neprázdné volatilní řady mají povinnou atribuci (asOf/source/url)', () => {
    for (const blk of [d.cena, d.najem]) {
      expect(typeof blk.unit).toBe('string');
      if (blk.series.length === 0) continue; // naplní a ozdrojuje T6
      expect(blk.asOf.length).toBeGreaterThan(0);
      expect(blk.source.length).toBeGreaterThan(0);
      expect(blk.url.startsWith('http')).toBe(true);
    }
  });

  it('každý plodina-záznam má zdroj', () => {
    for (const c of d.plodiny) {
      expect(c.source.length).toBeGreaterThan(0);
      expect(c.url.startsWith('http')).toBe(true);
    }
  });

  it('reformTimeline kroky mají zdroj (strukturálně-právní fakta)', () => {
    expect(d.reformTimeline.length).toBeGreaterThanOrEqual(3);
    for (const s of d.reformTimeline) {
      expect(s.url.startsWith('http')).toBe(true);
    }
  });
});
