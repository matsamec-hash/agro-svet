import { describe, it, expect } from 'vitest';
import data from '../../src/data/agro-dotace-uk.json';
import type { DotaceUkData } from '../../src/lib/dotace-uk';

const d = data as unknown as DotaceUkData;

describe('agro-dotace-uk.json', () => {
  it('má všechny povinné top-level klíče', () => {
    for (const k of ['generated', 'warCaveat', 'howItWorks', 'programs', 'donors', 'sources']) {
      expect(d).toHaveProperty(k);
    }
  });

  it('howItWorks: ≥3 kroky se zdrojem (url http)', () => {
    expect(d.howItWorks.length).toBeGreaterThanOrEqual(3);
    for (const s of d.howItWorks) {
      expect(s.title.length).toBeGreaterThan(0);
      expect(s.url.startsWith('http')).toBe(true);
    }
  });

  it('programs: ≥3, každý má typ, eligibility, atribuci (source/url/asOf)', () => {
    expect(d.programs.length).toBeGreaterThanOrEqual(3);
    for (const p of d.programs) {
      expect(p.type.length).toBeGreaterThan(0);
      expect(p.eligibility.length).toBeGreaterThan(0);
      expect(p.asOf.length).toBeGreaterThan(0);
      expect(p.source.length).toBeGreaterThan(0);
      expect(p.url.startsWith('http')).toBe(true);
    }
  });

  it('donors: ≥3 s url http', () => {
    expect(d.donors.length).toBeGreaterThanOrEqual(3);
    for (const dn of d.donors) {
      expect(dn.name.length).toBeGreaterThan(0);
      expect(dn.url.startsWith('http')).toBe(true);
    }
  });

  it('sources: ≥2 odkazy', () => {
    expect(d.sources.length).toBeGreaterThanOrEqual(2);
  });
});
