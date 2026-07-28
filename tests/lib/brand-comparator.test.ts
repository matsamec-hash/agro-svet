import { describe, it, expect } from 'vitest';
import {
  brandCombo,
  parseBrandCombo,
  brandStats,
  brandPairs,
  findBrandModelPairs,
  brandComparisonInsights,
} from '../../src/lib/brand-comparator';
import { getBrand } from '../../src/lib/stroje';

describe('brandCombo / parseBrandCombo', () => {
  it('řadí slugy abecedně a je idempotentní', () => {
    expect(brandCombo('zetor', 'fendt')).toBe('fendt-vs-zetor');
    expect(brandCombo('fendt', 'zetor')).toBe('fendt-vs-zetor');
  });
  it('parseBrandCombo round-trip', () => {
    expect(parseBrandCombo('fendt-vs-zetor')).toEqual(['fendt', 'zetor']);
  });
  it('odmítne nevalidní combo', () => {
    expect(parseBrandCombo('fendt')).toBeNull();
    expect(parseBrandCombo('fendt-vs-fendt')).toBeNull();
    expect(parseBrandCombo('')).toBeNull();
  });
});

describe('brandStats', () => {
  it('agreguje modely značky', () => {
    const zetor = getBrand('zetor');
    expect(zetor).toBeDefined();
    const s = brandStats(zetor!);
    expect(s.modelCount).toBeGreaterThan(0);
    expect(s.categories.length).toBeGreaterThan(0);
    expect(new Set(s.categories).size).toBe(s.categories.length);
    if (s.powerMin !== null && s.powerMax !== null) {
      expect(s.powerMin).toBeLessThanOrEqual(s.powerMax);
      expect(s.powerAvg).toBeGreaterThanOrEqual(s.powerMin);
      expect(s.powerAvg).toBeLessThanOrEqual(s.powerMax);
    }
  });
});

describe('brandPairs', () => {
  const pairs = brandPairs();
  it('vrací kanonické, deduplikované páry se sdílenou kategorií', () => {
    expect(pairs.length).toBeGreaterThan(0);
    const combos = pairs.map((p) => p.combo);
    expect(new Set(combos).size).toBe(combos.length);
    for (const p of pairs) {
      expect(p.a.slug < p.b.slug).toBe(true);
      expect(p.combo).toBe(`${p.a.slug}-vs-${p.b.slug}`);
      expect(p.sharedCategories.length).toBeGreaterThan(0);
    }
  });
  it('respektuje limit', () => {
    expect(brandPairs(5).length).toBeLessThanOrEqual(5);
  });
});

describe('findBrandModelPairs', () => {
  it('vrací jen model-páry mezi dvěma značkami, kanonické, ≤ limit', () => {
    const a = getBrand('zetor')!;
    const b = getBrand('fendt')!;
    const pairs = findBrandModelPairs(a, b, 5);
    expect(pairs.length).toBeLessThanOrEqual(5);
    for (const p of pairs) {
      const brands = new Set([p.a.brand_slug, p.b.brand_slug]);
      expect(brands.has('zetor') && brands.has('fendt')).toBe(true);
      expect(p.a.slug < p.b.slug).toBe(true);
    }
  });
});

describe('brandComparisonInsights', () => {
  it('vrací diferencované texty a 4 FAQ', () => {
    const a = getBrand('fendt')!;
    const b = getBrand('zetor')!;
    const ins = brandComparisonInsights(a, brandStats(a), b, brandStats(b));
    expect(ins.tldr.length).toBeGreaterThan(20);
    expect(ins.verdictA).not.toBe(ins.verdictB);
    expect(ins.verdictA.length).toBeGreaterThan(10);
    expect(ins.verdictB.length).toBeGreaterThan(10);
    expect(ins.faqs).toHaveLength(4);
    for (const f of ins.faqs) {
      expect(f.q.length).toBeGreaterThan(5);
      expect(f.a.length).toBeGreaterThan(5);
    }
    expect(ins.shortDescription.length).toBeGreaterThan(30);
  });
});
