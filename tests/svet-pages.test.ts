import { describe, it, expect } from 'vitest';
import index from '../src/data/svet/index.json';

describe('svet data index', () => {
  it('obsahuje fázi 1 a referenční ČR', () => {
    const slugs = index.countries.map((c) => c.slug);
    for (const s of ['cesko', 'nemecko', 'francie', 'velka-britanie']) expect(slugs).toContain(s);
    expect(index.countries.find((c) => c.slug === 'cesko')?.reference).toBe(true);
  });
  it('nereferenční země mají neprázdné indicatorKeys', () => {
    for (const c of index.countries.filter((c) => !c.reference)) {
      expect(Array.isArray(c.indicatorKeys)).toBe(true);
      expect(c.indicatorKeys.length).toBeGreaterThan(0);
    }
  });
});
