import { describe, it, expect } from 'vitest';
import {
  implementCompareCategories,
  implementComparisonPairs,
  MIN_MODELS_WITH_ZABER,
  parsePairCombo,
  buildComparisonRows,
} from '../../src/lib/comparator';
import { getAllModels } from '../../src/lib/stroje';
import type { StrojFlatModel } from '../../src/lib/stroje';

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

describe('buildComparisonRows — nářadí', () => {
  const labels = (cat: any) => buildComparisonRows(cat).map((r) => r.label);

  it('traktory mají původní řádky (beze změny)', () => {
    expect(labels('traktory')).toEqual(['Výkon', 'Výkon (kW)', 'Roky výroby', 'V prodeji', 'Motor', 'Převodovka', 'Hmotnost']);
  });

  it('kombajny mají původní řádky + žací stůl/zásobník', () => {
    expect(labels('kombajny')).toContain('Záběr žacího stolu');
    expect(labels('kombajny')).toContain('Zásobník zrna');
  });

  it('nářadí (podmitace-diskove) má záběr/příkon/závěs místo motoru', () => {
    const ls = labels('podmitace-diskove');
    expect(ls).toContain('Pracovní záběr');
    expect(ls).toContain('Potřebný příkon traktoru');
    expect(ls).toContain('Typ závěsu');
    expect(ls).toContain('Hmotnost');
    expect(ls).not.toContain('Motor');
    expect(ls).not.toContain('Výkon');
  });

  it('řádek záběru čte pracovni_zaber_m, příkon formátuje rozsah, závěs lokalizuje', () => {
    const rows = buildComparisonRows('podmitace-diskove' as any);
    const m = { pracovni_zaber_m: 6, prikon_traktor_hp_min: 180, prikon_traktor_hp_max: 240, typ_zavesu: 'tazeny', weight_kg: 4200 } as Partial<StrojFlatModel> as StrojFlatModel;
    const zaber = rows.find((r) => r.label === 'Pracovní záběr')!;
    const prikon = rows.find((r) => r.label === 'Potřebný příkon traktoru')!;
    const zaves = rows.find((r) => r.label === 'Typ závěsu')!;
    expect(zaber.get(m)).toBe(6);
    expect(prikon.get(m)).toBe('180–240 k');
    expect(zaves.get(m)).toBe('tažený');
  });
});
