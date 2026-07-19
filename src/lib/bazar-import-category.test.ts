import { describe, it, expect } from 'vitest';
import { suggestCategory } from './bazar-import-category';
import { CATEGORIES } from './bazar-constants';

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
    const valid = new Set(CATEGORIES.map((c) => c.value));
    expect(valid.has(suggestCategory('Traktor', ''))).toBe(true);
  });
});
