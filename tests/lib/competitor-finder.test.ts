import { describe, it, expect } from 'vitest';
import { useCaseDescription, findImplementCompetitors } from '../../src/lib/competitor-finder';
import { getAllModels } from '../../src/lib/stroje';

describe('useCaseDescription locale', () => {
  it('cs (default) beze změny', () => {
    expect(useCaseDescription('traktory', 40, 'cs')).toContain('Kompaktní traktor');
  });
  it('uk = cyrilice', () => {
    expect(useCaseDescription('traktory', 40, 'uk')).toMatch(/[Ѐ-ӿ]/);
  });
  it('null kategorie/power → null', () => {
    expect(useCaseDescription('pluhy' as any, 100, 'uk')).toBeNull();
  });
});

describe('findImplementCompetitors', () => {
  it('vrací same-effective-category different-brand modely v ±toleranci záběru', () => {
    const all = getAllModels();
    const source = all.find((m) => m.effective_category === 'podmitace-diskove' && m.pracovni_zaber_m != null && m.year_to == null);
    expect(source).toBeTruthy();
    const res = findImplementCompetitors(
      { slug: source!.slug, brand_slug: source!.brand_slug, effective_category: source!.effective_category, pracovni_zaber_m: source!.pracovni_zaber_m, year_to: source!.year_to },
      { tolerancePct: 30, limit: 6 },
    );
    expect(res.length).toBeGreaterThan(0);
    for (const c of res) {
      expect(c.effective_category).toBe('podmitace-diskove');
      expect(c.brand_slug).not.toBe(source!.brand_slug);
      expect(c.pracovni_zaber_m).not.toBeNull();
    }
    const brands = res.map((c) => c.brand_slug);
    expect(new Set(brands).size).toBe(brands.length);
  });

  it('vrací prázdné pole pro zdroj bez záběru', () => {
    const res = findImplementCompetitors(
      { slug: 'x', brand_slug: 'amazone', effective_category: 'podmitace-diskove', pracovni_zaber_m: null, year_to: null },
      {},
    );
    expect(res).toEqual([]);
  });
});
