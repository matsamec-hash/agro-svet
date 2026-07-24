import { describe, it, expect } from 'vitest';
import { ATTRIBUTES, attributesForCategory, attrDef, validateAttributes } from './bazar-attributes';

describe('ATTRIBUTES integrita', () => {
  it('má unikátní kombinace key (globálně unikátní klíče)', () => {
    const keys = ATTRIBUTES.map((a) => a.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
  it('enum atributy mají neprázdné options', () => {
    for (const a of ATTRIBUTES.filter((x) => x.type === 'enum')) {
      expect(a.options && a.options.length > 0).toBe(true);
    }
  });
});

describe('attributesForCategory', () => {
  it('vrací sdílené (*) i kategorie-specifické', () => {
    const list = attributesForCategory('traktory');
    const keys = list.map((a) => a.key);
    expect(keys).toContain('klimatizace'); // sdílené
    expect(keys).toContain('prevodovka'); // traktory
  });
  it('nevrací atributy cizí kategorie', () => {
    const keys = attributesForCategory('traktory').map((a) => a.key);
    expect(keys).not.toContain('plemeno'); // zvirata-only
  });
});

describe('validateAttributes', () => {
  it('zahodí neznámý klíč', () => {
    expect(validateAttributes('traktory', { neznamy: true })).toEqual({});
  });
  it('zahodí enum hodnotu mimo options', () => {
    expect(validateAttributes('traktory', { pohon: 'raketa' })).toEqual({});
  });
  it('nechá validní bool/enum/number', () => {
    const out = validateAttributes('traktory', { klimatizace: true, pohon: '4x4', pocet_valcu: 4 });
    expect(out).toEqual({ klimatizace: true, pohon: '4x4', pocet_valcu: 4 });
  });
  it('coercuje number ze stringu a bool z "true"', () => {
    const out = validateAttributes('traktory', { pocet_valcu: '6', klimatizace: 'true' });
    expect(out).toEqual({ pocet_valcu: 6, klimatizace: true });
  });
  it('zahodí atribut kategorie, do které nepatří', () => {
    expect(validateAttributes('zvirata', { prevodovka: 'manual' })).toEqual({});
  });
});
