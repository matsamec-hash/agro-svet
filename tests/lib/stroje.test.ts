import { describe, it, expect } from 'vitest';
import { getEffectiveZaber, getFunctionalGroupForCategory, FUNCTIONAL_GROUPS, type StrojKategorie } from '../../src/lib/stroje';

describe('stroje lib — schema rozšíření', () => {
  it('FUNCTIONAL_GROUPS má 10 skupin', () => {
    expect(Object.keys(FUNCTIONAL_GROUPS)).toHaveLength(10);
  });

  it('zpracovani-pudy obsahuje 7 sub-kategorií', () => {
    expect(FUNCTIONAL_GROUPS['zpracovani-pudy'].categories).toHaveLength(7);
  });

  it('sklizen-picnin obsahuje 8 sub-kategorií', () => {
    expect(FUNCTIONAL_GROUPS['sklizen-picnin'].categories).toHaveLength(8);
  });

  it('getEffectiveZaber preferuje pracovni_zaber_m před cutting_width_m', () => {
    expect(getEffectiveZaber({ pracovni_zaber_m: 2.5, cutting_width_m: 9 } as any)).toBe(2.5);
    expect(getEffectiveZaber({ cutting_width_m: 9 } as any)).toBe(9);
    expect(getEffectiveZaber({} as any)).toBe(null);
  });

  it('getFunctionalGroupForCategory najde skupinu pro sub-kategorii', () => {
    expect(getFunctionalGroupForCategory('pluhy')).toBe('zpracovani-pudy');
    expect(getFunctionalGroupForCategory('teleskopy')).toBe('manipulace');
    expect(getFunctionalGroupForCategory('lisy-valcove')).toBe('sklizen-picnin');
  });

  it('getFunctionalGroupForCategory pro traktory/kombajny vrací null (nejsou v žádné skupině)', () => {
    expect(getFunctionalGroupForCategory('traktory')).toBe(null);
    expect(getFunctionalGroupForCategory('kombajny')).toBe(null);
  });

  it('všechny FUNCTIONAL_GROUPS.categories obsahují validní StrojKategorie (46 unique)', () => {
    const allCats = Object.values(FUNCTIONAL_GROUPS).flatMap((g) => g.categories);
    expect(allCats.length).toBe(46);
    expect(new Set(allCats).size).toBe(46); // všechny unique
  });

  it('seti obsahuje 5 sub-kategorií včetně sazecky-brambor', () => {
    expect(FUNCTIONAL_GROUPS['seti'].categories).toHaveLength(5);
    expect(FUNCTIONAL_GROUPS['seti'].categories).toContain('sazecky-brambor');
  });
});
