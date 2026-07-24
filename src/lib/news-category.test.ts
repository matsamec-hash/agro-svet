import { describe, it, expect } from 'vitest';
import { NEWS_CATEGORIES, newsCategorySlug } from './news-category';

describe('newsCategorySlug', () => {
  it('vrátí kanonický slug beze změny', () => {
    for (const c of NEWS_CATEGORIES) expect(newsCategorySlug(c)).toBe(c);
  });

  it('normalizuje velikost písmen a diakritiku na kanonický slug', () => {
    expect(newsCategorySlug('Technika')).toBe('technika');
    expect(newsCategorySlug('DOTACE')).toBe('dotace');
    expect(newsCategorySlug(' Trh ')).toBe('trh');
  });

  it('nekanonické kategorie skládá do „novinky"', () => {
    // Reálná špinavá data z produkce (agro-svet /novinky/).
    expect(newsCategorySlug('Zemědělství')).toBe('novinky');
    expect(newsCategorySlug('zemědělství')).toBe('novinky');
    expect(newsCategorySlug('Novinky')).toBe('novinky');
    expect(newsCategorySlug('Novinky a zprávy')).toBe('novinky');
    expect(newsCategorySlug('Pruvodce')).toBe('novinky');
    expect(newsCategorySlug('Průvodce')).toBe('novinky');
  });

  it('prázdné / null / neznámé → „novinky"', () => {
    expect(newsCategorySlug(null)).toBe('novinky');
    expect(newsCategorySlug(undefined)).toBe('novinky');
    expect(newsCategorySlug('')).toBe('novinky');
    expect(newsCategorySlug('cokoli jineho')).toBe('novinky');
  });
});
