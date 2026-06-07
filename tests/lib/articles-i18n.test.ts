import { describe, it, expect } from 'vitest';
import { overlayArticle, buildTranslationMap, hasTranslatedTitle, fetchTranslatedArticleIds } from '../../src/lib/articles-i18n';

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

describe('hasTranslatedTitle', () => {
  it('true jen pro neprázdný titulek', () => {
    expect(hasTranslatedTitle({ title: 'SK titul' })).toBe(true);
    expect(hasTranslatedTitle({ title: '   ' })).toBe(false);
    expect(hasTranslatedTitle({ title: '' })).toBe(false);
    expect(hasTranslatedTitle({ title: null })).toBe(false);
    expect(hasTranslatedTitle({ perex: 'jen perex' })).toBe(false);
    expect(hasTranslatedTitle(null)).toBe(false);
    expect(hasTranslatedTitle(undefined)).toBe(false);
  });
});

describe('fetchTranslatedArticleIds', () => {
  const stub = (rows: any[]) => ({
    from: () => ({
      select: () => ({
        eq: () => Promise.resolve({ data: rows }),
      }),
    }),
  });

  it('cs → prázdná množina bez dotazu', async () => {
    const ids = await fetchTranslatedArticleIds(stub([{ article_id: 'a1', title: 'X' }]) as any, 'cs');
    expect(ids.size).toBe(0);
  });

  it('vrátí jen id s neprázdným titulkem', async () => {
    const ids = await fetchTranslatedArticleIds(
      stub([
        { article_id: 'a1', title: 'SK titul' },
        { article_id: 'a2', title: '   ' },
        { article_id: 'a3', title: null },
        { article_id: 'a4', title: 'SK 4' },
      ]) as any,
      'sk',
    );
    expect([...ids].sort()).toEqual(['a1', 'a4']);
  });

  it('prázdná data → prázdná množina', async () => {
    const ids = await fetchTranslatedArticleIds(stub([]) as any, 'sk');
    expect(ids.size).toBe(0);
  });
});
