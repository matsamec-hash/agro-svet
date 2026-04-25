import { describe, expect, it } from 'vitest';

type Article = { id: string; featured: boolean; published_at: string };

// Reference implementation of the sort applied in src/pages/index.astro:
// .order('featured', { ascending: false }).order('published_at', { ascending: false })
// This pure function exists for tests to assert ordering rules without hitting Supabase.
function sortArticles(articles: Article[]): Article[] {
  return [...articles].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.published_at.localeCompare(a.published_at);
  });
}

describe('articles sort: featured DESC, published_at DESC', () => {
  it('0 featured: pure chronological order', () => {
    const articles: Article[] = [
      { id: '1', featured: false, published_at: '2026-01-01' },
      { id: '2', featured: false, published_at: '2026-03-01' },
      { id: '3', featured: false, published_at: '2026-02-01' },
    ];
    expect(sortArticles(articles).map(a => a.id)).toEqual(['2', '3', '1']);
  });

  it('1 featured: featured first regardless of date', () => {
    const articles: Article[] = [
      { id: '1', featured: false, published_at: '2026-03-01' },
      { id: '2', featured: true,  published_at: '2026-01-01' },
      { id: '3', featured: false, published_at: '2026-02-01' },
    ];
    expect(sortArticles(articles).map(a => a.id)).toEqual(['2', '1', '3']);
  });

  it('2 featured: newer-published featured wins hero', () => {
    const articles: Article[] = [
      { id: '1', featured: true,  published_at: '2026-01-01' },
      { id: '2', featured: false, published_at: '2026-03-01' },
      { id: '3', featured: true,  published_at: '2026-02-01' },
    ];
    expect(sortArticles(articles).map(a => a.id)).toEqual(['3', '1', '2']);
  });

  it('all featured: pure chrono among featured', () => {
    const articles: Article[] = [
      { id: '1', featured: true, published_at: '2026-01-01' },
      { id: '2', featured: true, published_at: '2026-03-01' },
      { id: '3', featured: true, published_at: '2026-02-01' },
    ];
    expect(sortArticles(articles).map(a => a.id)).toEqual(['2', '3', '1']);
  });

  it('empty array stays empty', () => {
    expect(sortArticles([])).toEqual([]);
  });
});
