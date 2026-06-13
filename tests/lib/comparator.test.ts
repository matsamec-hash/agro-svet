import { describe, it, expect } from 'vitest';
import {
  implementCompareCategories,
  implementComparisonPairs,
  MIN_MODELS_WITH_ZABER,
  parsePairCombo,
} from '../../src/lib/comparator';
import { getAllModels } from '../../src/lib/stroje';

describe('implementCompareCategories', () => {
  it('vrací jen kategorie se ≥ MIN_MODELS_WITH_ZABER modely se záběrem (dle effective_category)', () => {
    const cats = implementCompareCategories();
    expect(cats).toContain('podmitace-diskove');
    expect(cats).toContain('seci-stroje-pneumaticke');
    expect(cats).toContain('kyprice');
    expect(cats).not.toContain('traktory');
    expect(cats).not.toContain('kombajny');
    const counts = new Map<string, number>();
    for (const m of getAllModels()) {
      if (m.pracovni_zaber_m != null) counts.set(m.effective_category, (counts.get(m.effective_category) ?? 0) + 1);
    }
    for (const c of cats) expect(counts.get(c)!).toBeGreaterThanOrEqual(MIN_MODELS_WITH_ZABER);
  });
});

describe('implementComparisonPairs', () => {
  const pairs = implementComparisonPairs(4000);

  it('generuje páry jen pro nářaďové kategorie nad prahem, same effective_category, different brand', () => {
    expect(pairs.length).toBeGreaterThan(0);
    const cats = new Set(implementCompareCategories());
    for (const p of pairs) {
      expect(p.a.effective_category).toBe(p.b.effective_category);
      expect(cats.has(p.a.effective_category)).toBe(true);
      expect(p.a.brand_slug).not.toBe(p.b.brand_slug);
    }
  });

  it('kanonické pořadí (a.slug < b.slug) a žádné duplicity combo', () => {
    const seen = new Set<string>();
    for (const p of pairs) {
      expect(p.a.slug < p.b.slug).toBe(true);
      expect(parsePairCombo(p.combo)).toEqual([p.a.slug, p.b.slug]);
      expect(seen.has(p.combo)).toBe(false);
      seen.add(p.combo);
    }
  });

  it('NEobsahuje traktorové/kombajnové páry (disjunktní vůči hp engine)', () => {
    for (const p of pairs) {
      expect(p.a.effective_category === 'traktory' || p.a.effective_category === 'kombajny').toBe(false);
    }
  });
});
