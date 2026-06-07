import { describe, it, expect } from 'vitest';
import { generateModelFaq } from '../../src/lib/faq-generator';

const model: any = {
  slug: 'zetor-6011', name: '6011', power_hp: 60, power_kw: 44, weight_kg: 2900,
  year_from: 1968, year_to: 1980, engine: 'Zetor 4-válec diesel', transmission: 'mechanická 10+2',
};

describe('generateModelFaq — locale', () => {
  it('cs (default) = doslovné originály (byte-identita)', () => {
    const faq = generateModelFaq({ brand: { name: 'Zetor' }, model, category: 'traktory', categorySingular: 'traktor' });
    expect(faq).not.toBeNull();
    expect(faq![0]).toEqual({
      q: 'Jaký výkon má Zetor 6011?',
      a: 'Zetor 6011 má jmenovitý výkon 60 koní (44 kW). Pohání ho Zetor 4-válec diesel.',
    });
    expect(faq!.some((i) => i.a.includes('Provozní hmotnost'))).toBe(true);
    expect(faq!.some((i) => i.q === 'V jakých letech se Zetor 6011 vyráběl?')).toBe(true);
  });

  it('sk = slovenská próza, žádné CZ ř/ě/ů zbytky', () => {
    const faq = generateModelFaq({ brand: { name: 'Zetor' }, model, category: 'traktory', categorySingular: 'traktor', locale: 'sk' });
    expect(faq).not.toBeNull();
    expect(faq![0].q).toBe('Aký výkon má Zetor 6011?');
    expect(faq![0].a).toContain('menovitý výkon');
    expect(faq![0].a).toContain('Poháňa ho');
    const blob = faq!.map((i) => i.q + ' ' + i.a).join(' ');
    expect(blob).not.toMatch(/[řěůĚŘŮ]/);
    expect(blob).toContain('Prevádzková hmotnosť');
  });

  it('uk = ukrajinská próza (cyrilice), žádné latinkové cs/sk zbytky v otázkách', () => {
    const ukModel = { name: '6R 250', slug: 'jd-6r-250', power_hp: 250, power_kw: 186, engine: 'PowerTech PSS', weight_kg: 11500, year_from: 2017, transmission: 'AutoPowr ' } as any;
    const faq = generateModelFaq({ brand: { name: 'John Deere' }, model: ukModel, category: 'traktory', categorySingular: 'трактор', locale: 'uk' });
    expect(faq).not.toBeNull();
    expect(faq![0].q).toMatch(/[Ѐ-ӿ]/); // obsahuje cyrilici
  });

  it('quality gate: <3 položky → null', () => {
    const thin: any = { slug: 'x', name: 'X', power_hp: 50 };
    expect(generateModelFaq({ brand: { name: 'B' }, model: thin, category: 'traktory', categorySingular: 'traktor' })).toBeNull();
  });
});
