import { describe, it, expect } from 'vitest';
import { SUBCATEGORY_FILTERS, getFiltersFor, type FilterSpec } from '../../src/lib/stroje-filters';

describe('stroje-filters', () => {
  it('má filter pro pluhy s pocet_radlic', () => {
    const filters = getFiltersFor('pluhy');
    expect(filters.length).toBeGreaterThan(0);
    expect(filters.find((f) => f.key === 'pocet_radlic')).toBeDefined();
  });

  it('má filter pro lisy-valcove s typ_komory enum', () => {
    const filters = getFiltersFor('lisy-valcove');
    const typKomory = filters.find((f) => f.key === 'typ_komory');
    expect(typKomory).toBeDefined();
    expect(typKomory?.type).toBe('enum');
    expect(typKomory?.options?.length).toBeGreaterThan(0);
  });

  it('teleskopy mají nosnost_kg, vyska_zdvihu_m, dosah_m', () => {
    const keys = getFiltersFor('teleskopy').map((f) => f.key);
    expect(keys).toContain('nosnost_kg');
    expect(keys).toContain('vyska_zdvihu_m');
    expect(keys).toContain('dosah_m');
  });

  it('postrikovace-tazene mají objem_nadrze_l a zaber_ramen_m', () => {
    const keys = getFiltersFor('postrikovace-tazene').map((f) => f.key);
    expect(keys).toContain('objem_nadrze_l');
    expect(keys).toContain('zaber_ramen_m');
  });

  it('vrací prázdné pole pro neexistující subcategory', () => {
    expect(getFiltersFor('xxx-neexistuje' as any)).toEqual([]);
  });

  it('FilterSpec má source top nebo specs', () => {
    const allFilters = Object.values(SUBCATEGORY_FILTERS).flat();
    for (const f of allFilters) {
      expect(['top', 'specs']).toContain(f.source);
    }
  });
});
