import { describe, it, expect } from 'vitest';
import { overlayArticle, buildTranslationMap } from '../../src/lib/articles-i18n';

describe('overlayArticle', () => {
  const cs = {
    id: 'a1', title: 'CZ titul', perex: 'CZ perex', content: '<p>CZ</p>',
    seo_title: 'CZ seo', seo_description: 'CZ seo d', slug: 'cz-slug',
  };

  it('returns the cs row unchanged when translation is null', () => {
    expect(overlayArticle(cs, null)).toEqual(cs);
  });

  it('overlays translated fields and falls back per-field on empty/missing', () => {
    const tr = { title: 'SK titul', perex: '', content: '<p>SK</p>', seo_title: null };
    const out = overlayArticle(cs, tr as any);
    expect(out.title).toBe('SK titul');        // translated wins
    expect(out.perex).toBe('CZ perex');         // empty string falls back
    expect(out.content).toBe('<p>SK</p>');      // translated wins
    expect(out.seo_title).toBe('CZ seo');       // null falls back
    expect(out.slug).toBe('cz-slug');           // slug always cs (not overlaid)
    expect(out.id).toBe('a1');                   // identity preserved
  });

  it('does not mutate the cs row', () => {
    const out = overlayArticle(cs, { title: 'SK titul' } as any);
    expect(cs.title).toBe('CZ titul');
    expect(out).not.toBe(cs);
  });
});

describe('buildTranslationMap', () => {
  it('keys rows by article_id', () => {
    const rows = [
      { article_id: 'a1', title: 'X' },
      { article_id: 'a2', title: 'Y' },
    ];
    const m = buildTranslationMap(rows as any);
    expect(m.get('a1')?.title).toBe('X');
    expect(m.get('a2')?.title).toBe('Y');
    expect(m.get('a3')).toBeUndefined();
  });

  it('returns an empty map for null/empty input', () => {
    expect(buildTranslationMap(null).size).toBe(0);
    expect(buildTranslationMap([]).size).toBe(0);
  });
});
