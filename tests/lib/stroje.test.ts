import { describe, it, expect } from 'vitest';
import { getEffectiveZaber, getFunctionalGroupForCategory, FUNCTIONAL_GROUPS, applyStrojOverlay, type StrojKategorie } from '../../src/lib/stroje';

describe('stroje lib — SK overlay modelů (Fáze stroje-detail)', () => {
  const base = {
    slug: 'zetor', name: 'Zetor', country: 'Česká republika', founded: 1946,
    categories: {
      traktory: {
        name: 'Traktory',
        series: [
          { slug: 'z-25', name: 'Z 25', year_from: 1946, year_to: 1968, description: 'CS série popis',
            models: [
              { slug: 'zetor-25', name: 'Z 25', description: 'CS model popis', power_hp: 25 },
              { slug: 'zetor-25k', name: 'Z 25K', description: 'CS model bez SK', power_hp: 25 },
            ] },
        ],
      },
    },
  } as any;

  it('overlayuje model.description z ov.models, sérii z ov.series; chybějící model padá na cs', () => {
    const ov = { description: 'SK značka', series: { 'z-25': 'SK série' }, models: { 'zetor-25': 'SK model' } };
    const out: any = applyStrojOverlay(base, ov);
    const s = out.categories.traktory.series[0];
    expect(out.description).toBe('SK značka');
    expect(s.description).toBe('SK série');
    expect(s.models[0].description).toBe('SK model');
    expect(s.models[1].description).toBe('CS model bez SK');
  });

  it('nemutuje base (structuredClone)', () => {
    applyStrojOverlay(base, { models: { 'zetor-25': 'SK model' } });
    expect(base.categories.traktory.series[0].models[0].description).toBe('CS model popis');
  });

  it('bez overlaye vrací base beze změny (cs identita)', () => {
    expect(applyStrojOverlay(base, null)).toBe(base);
  });
});

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
