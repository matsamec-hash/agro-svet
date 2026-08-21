import { describe, it, expect } from 'vitest';
import index from '../src/data/svet/index.json';
import mapMetrics from '../src/data/svet/map-metrics.json';
import { pageSlugs } from '../src/lib/svet/map';

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

describe('pageSlugs — které země mají proklik z mapy', () => {
  it('zahrnuje referenční ČR (profil má, jen bez sebe-porovnání)', () => {
    expect(pageSlugs(index).has('cesko')).toBe(true);
  });
  it('pokrývá všechny země na mapě, ať v tabulce nezůstane neklikatelný řádek', () => {
    const slugs = pageSlugs(index);
    const onMap = Object.values(mapMetrics.countries as Record<string, { slug: string }>).map((c) => c.slug);
    expect(onMap.filter((s) => !slugs.has(s))).toEqual([]);
  });
});
