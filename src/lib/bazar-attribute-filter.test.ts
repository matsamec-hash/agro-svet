import { describe, it, expect } from 'vitest';
import { parseAttributeFilters } from './bazar-attribute-filter';

const p = (obj: Record<string, string>) => new URLSearchParams(obj);

describe('parseAttributeFilters', () => {
  it('bool a_klimatizace=1 → { klimatizace: true }', () => {
    expect(parseAttributeFilters(p({ a_klimatizace: '1' }), 'traktory')).toEqual({ klimatizace: true });
  });
  it('enum a_pohon=4x4 → { pohon: "4x4" }', () => {
    expect(parseAttributeFilters(p({ a_pohon: '4x4' }), 'traktory')).toEqual({ pohon: '4x4' });
  });
  it('kombinuje víc atributů (AND objekt)', () => {
    expect(parseAttributeFilters(p({ a_klimatizace: '1', a_pohon: '4x4' }), 'traktory'))
      .toEqual({ klimatizace: true, pohon: '4x4' });
  });
  it('ignoruje enum hodnotu mimo options', () => {
    expect(parseAttributeFilters(p({ a_pohon: 'raketa' }), 'traktory')).toEqual({});
  });
  it('ignoruje atribut nepatřící kategorii', () => {
    expect(parseAttributeFilters(p({ a_prevodovka: 'manual' }), 'zvirata')).toEqual({});
  });
  it('ignoruje číselné atributy (ve filtru zatím nefiltrujeme)', () => {
    expect(parseAttributeFilters(p({ a_pocet_valcu: '4' }), 'traktory')).toEqual({});
  });
  it('bez kategorie bere jen sdílené atributy (stav)', () => {
    expect(parseAttributeFilters(p({ a_stav: 'pouzite', a_prevodovka: 'manual' }), ''))
      .toEqual({ stav: 'pouzite' });
  });
  it('bool s hodnotou 0/false se ignoruje', () => {
    expect(parseAttributeFilters(p({ a_klimatizace: '0' }), 'traktory')).toEqual({});
  });
});
