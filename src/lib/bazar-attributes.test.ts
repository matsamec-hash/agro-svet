import { describe, it, expect } from 'vitest';
import { ATTRIBUTES, attributesForCategory, attrDef, validateAttributes } from './bazar-attributes';
import { CATEGORIES } from './bazar-constants';

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
  it('strojní atributy (klimatizace/pohon/TP-SPZ) nejsou u nestrojních kategorií', () => {
    for (const cat of ['zvirata', 'pozemky', 'sluzby', 'osiva-hnojiva']) {
      const keys = attributesForCategory(cat).map((a) => a.key);
      expect(keys, cat).not.toContain('klimatizace');
      expect(keys, cat).not.toContain('pohon');
      expect(keys, cat).not.toContain('tp_spz');
    }
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

describe('pokrytí kategorií', () => {
  // Kategorie, které mají mít vlastní (nesdílené) atributy.
  const RICH = ['traktory','kombajny','zpracovani-pudy','seti','hnojeni','ochrana-rostlin',
    'sklizen-picnin','sklizen-okopanin','manipulace','doprava','komunal-les','staj-chov',
    'nahradni-dily','prislusenstvi','osiva-hnojiva','pozemky','zvirata','sluzby'];
  it('každá RICH kategorie má alespoň jeden vlastní atribut', () => {
    for (const cat of RICH) {
      const own = ATTRIBUTES.filter((a) => a.categories.includes(cat));
      expect(own.length, `kategorie ${cat}`).toBeGreaterThan(0);
    }
  });
  it('všechny categories ve slovníku existují v CATEGORIES nebo jsou *', () => {
    const valid = new Set<string>(CATEGORIES.map((c) => c.value));
    for (const a of ATTRIBUTES) {
      for (const c of a.categories) {
        if (c === '*') continue;
        expect(valid.has(c), `${a.key} → ${c}`).toBe(true);
      }
    }
  });
});
