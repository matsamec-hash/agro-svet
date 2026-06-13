import { describe, it, expect } from 'vitest';
import { implementComparisonInsights } from '../../src/lib/implement-comparison-insights';
import type { StrojFlatModel } from '../../src/lib/stroje';

function mk(o: Partial<StrojFlatModel> & { name: string; brand_slug: string }): StrojFlatModel {
  return {
    slug: o.slug ?? o.name.toLowerCase().replace(/\s+/g, '-'),
    name: o.name,
    year_from: o.year_from ?? 2018,
    year_to: o.year_to ?? null,
    power_hp: null,
    power_kw: null,
    weight_kg: o.weight_kg ?? null,
    pracovni_zaber_m: o.pracovni_zaber_m ?? null,
    prikon_traktor_hp_min: o.prikon_traktor_hp_min ?? null,
    prikon_traktor_hp_max: o.prikon_traktor_hp_max ?? null,
    typ_zavesu: o.typ_zavesu ?? null,
    brand_slug: o.brand_slug,
    brand_name: o.brand_name ?? o.brand_slug,
    category: o.category ?? 'zpracovani-pudy',
    effective_category: o.effective_category ?? 'podmitace-diskove',
    series_slug: o.series_slug ?? 'series',
    series_name: o.series_name ?? 'Series',
  } as StrojFlatModel;
}

const A = mk({ name: 'Catros 6001', brand_slug: 'amazone', brand_name: 'Amazone', pracovni_zaber_m: 6, prikon_traktor_hp_min: 180, prikon_traktor_hp_max: 240, typ_zavesu: 'tazeny', weight_kg: 4200, year_from: 2020 });
const B = mk({ name: 'Swifterdisc 4000', brand_slug: 'bednar', brand_name: 'Bednar', pracovni_zaber_m: 4, prikon_traktor_hp_min: 120, prikon_traktor_hp_max: 160, typ_zavesu: 'neseny', weight_kg: 2600, year_from: 2017 });

describe('implementComparisonInsights', () => {
  it('cs: TL;DR zmiňuje širší záběr i příkon', () => {
    const r = implementComparisonInsights(A, B, 'cs');
    expect(r.tldr).toContain('širší záběr');
    expect(r.tldr.toLowerCase()).toMatch(/2\s*m|o 2/); // diff 6-4 = 2 m
  });

  it('FAQ obsahuje záběr, příkon i typ závěsu', () => {
    const r = implementComparisonInsights(A, B, 'cs');
    const qs = r.faqs.map((f) => f.q).join(' | ');
    expect(qs).toMatch(/záběr/i);
    expect(qs).toMatch(/traktor|příkon/i);
    expect(qs).toMatch(/nesené|tažen|závěs/i);
    expect(r.faqs.length).toBeGreaterThanOrEqual(3);
    expect(r.faqs.length).toBeLessThanOrEqual(5);
  });

  it('decision boxy zmiňují širší záběr (A) a nižší příkon (B)', () => {
    const r = implementComparisonInsights(A, B, 'cs');
    expect(r.decisionA).toContain('Catros 6001');
    expect(r.decisionB).toContain('Swifterdisc 4000');
    expect(r.decisionA.toLowerCase()).toMatch(/širší záběr|plošný výkon/);
  });

  it('degraduje bez záběru u obou na obecný verdikt', () => {
    const x = mk({ name: 'X', brand_slug: 'amazone', brand_name: 'Amazone', pracovni_zaber_m: null });
    const y = mk({ name: 'Y', brand_slug: 'bednar', brand_name: 'Bednar', pracovni_zaber_m: null });
    const r = implementComparisonInsights(x, y, 'cs');
    expect(r.tldr).toMatch(/srovnatelné třídy|srovnatelné/);
    expect(r.faqs.length).toBeGreaterThanOrEqual(0);
  });

  it('sk a uk varianty se liší od cs a needefaultují na cs', () => {
    const cs = implementComparisonInsights(A, B, 'cs');
    const sk = implementComparisonInsights(A, B, 'sk');
    const uk = implementComparisonInsights(A, B, 'uk');
    expect(sk.tldr).not.toBe(cs.tldr);
    expect(uk.tldr).not.toBe(cs.tldr);
    expect(uk.tldr).toMatch(/[а-яіїєґ]/i); // cyrilice
    expect(sk.faqs[0].q).not.toBe(cs.faqs[0].q);
  });

  it('shortDescription je ≤ 158 znaků', () => {
    expect(implementComparisonInsights(A, B, 'cs').shortDescription.length).toBeLessThanOrEqual(158);
  });
});
