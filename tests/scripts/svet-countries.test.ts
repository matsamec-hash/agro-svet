import { describe, it, expect } from 'vitest';
import { COUNTRIES, bySlug } from '../../scripts/lib/svet/countries.mjs';

describe('COUNTRIES', () => {
  it('obsahuje fázi 1: nemecko, francie, velka-britanie', () => {
    const slugs = COUNTRIES.map((c) => c.slug);
    expect(slugs).toContain('nemecko');
    expect(slugs).toContain('francie');
    expect(slugs).toContain('velka-britanie');
  });
  it('každá země má geo, name, flag a unikátní slug', () => {
    const seen = new Set();
    for (const c of COUNTRIES) {
      expect(c.geo).toBeTruthy();
      expect(c.nameCs).toBeTruthy();
      expect(c.flag).toBeTruthy();
      expect(seen.has(c.slug)).toBe(false);
      seen.add(c.slug);
    }
  });
  it('bySlug vrací správnou zemi', () => {
    expect(bySlug('nemecko').geo).toBe('DE');
  });
});
