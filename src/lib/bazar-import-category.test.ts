import { describe, it, expect } from 'vitest';
import { suggestCategory, matchBrand } from './bazar-import-category';
import { CATEGORIES } from './bazar-constants';

describe('matchBrand', () => {
  it('John Deere → john-deere', () => {
    expect(matchBrand('John Deere 6210R', '')).toBe('john-deere');
  });
  it('Zetor v popisu → zetor', () => {
    expect(matchBrand('Traktor', 'Prodám Zetor 7211')).toBe('zetor');
  });
  it('neznámá značka → null', () => {
    expect(matchBrand('Nějaký stroj', 'bez značky')).toBeNull();
  });
});

describe('suggestCategory', () => {
  it('traktor → traktory', () => {
    expect(suggestCategory('Prodám traktor Zetor 7211', '')).toBe('traktory');
  });
  it('secí stroj → seti', () => {
    expect(suggestCategory('Secí stroj Amazone', 'záběr 3m')).toBe('seti');
  });
  it('kráva/jalovice → zvirata', () => {
    expect(suggestCategory('Prodám jalovice', '')).toBe('zvirata');
  });
  it('neznámé → ostatni', () => {
    expect(suggestCategory('Xyz qwerty', '')).toBe('ostatni');
  });
  it('vždy vrací platnou hodnotu z CATEGORIES', () => {
    const valid = new Set<string>(CATEGORIES.map((c) => c.value));
    expect(valid.has(suggestCategory('Traktor', ''))).toBe(true);
  });
});
