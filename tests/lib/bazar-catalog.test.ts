import { describe, it, expect } from 'vitest';
import { getModelOptions } from '../../src/lib/bazar-catalog';
import { BAZAR_TO_CATALOG_SUBCATEGORIES } from '../../src/lib/bazar-constants';

describe('bazar-catalog — getModelOptions filtrování', () => {
  it('bez argumentů vrací všechny modely (backward compat)', () => {
    const all = getModelOptions();
    expect(all.length).toBeGreaterThan(0);
    // ModelOption shape je zachován
    const first = all[0];
    expect(first).toHaveProperty('slug');
    expect(first).toHaveProperty('label');
    expect(first).toHaveProperty('name');
    expect(first).toHaveProperty('brand_slug');
    expect(first).toHaveProperty('brand_name');
    expect(first).toHaveProperty('category');
    expect(first).toHaveProperty('series_slug');
    expect(first).toHaveProperty('series_name');
    expect(first).toHaveProperty('power_hp');
    expect(first).toHaveProperty('year_from');
    expect(first).toHaveProperty('year_to');
  });

  it('bazarCategory=traktory vrací jen modely s category=traktory', () => {
    const traktory = getModelOptions('traktory');
    expect(traktory.length).toBeGreaterThan(0);
    expect(traktory.every((m) => m.category === 'traktory')).toBe(true);
  });

  it('bazarCategory=zpracovani-pudy vrací jen modely v allowed sub-kategoriích', () => {
    const allowed = BAZAR_TO_CATALOG_SUBCATEGORIES['zpracovani-pudy'];
    const filtered = getModelOptions('zpracovani-pudy');
    expect(filtered.every((m) => allowed.includes(m.category))).toBe(true);
  });

  it('bazarCategory mimo mapping (nahradni-dily) vrací prázdné pole', () => {
    expect(getModelOptions('nahradni-dily')).toEqual([]);
    expect(getModelOptions('jina')).toEqual([]);
    expect(getModelOptions('ostatni')).toEqual([]);
  });

  it('subcategory exaktně zužuje na danou sub-kategorii', () => {
    // Vezmeme libovolnou sub-kategorii ze zpracovani-pudy a zkusíme exaktní filter
    const all = getModelOptions();
    const someCategory = all.find((m) => m.category === 'traktory')?.category;
    if (someCategory) {
      const filtered = getModelOptions(undefined, someCategory);
      expect(filtered.every((m) => m.category === someCategory)).toBe(true);
    }
  });

  it('kombinace bazarCategory + subcategory: subcategory zužuje výsledek', () => {
    const filtered = getModelOptions('traktory', 'traktory');
    expect(filtered.every((m) => m.category === 'traktory')).toBe(true);
  });

  it('subcategory nesouhlasící s bazarCategory mappingem vrací prázdné pole', () => {
    // traktory map povoluje jen ['traktory'], pluhy patří do zpracovani-pudy
    const filtered = getModelOptions('traktory', 'pluhy');
    expect(filtered).toEqual([]);
  });
});
