import { describe, it, expect } from 'vitest';
import { parseBatchUrls, isBazosUrl, BATCH_MAX_URLS } from './bazar-batch-urls';

describe('isBazosUrl', () => {
  it('accepts bazos.cz and subdomains', () => {
    expect(isBazosUrl('https://www.bazos.cz/inzerat/123/x.php')).toBe(true);
    expect(isBazosUrl('https://zemedelska.bazos.cz/inzerat/9/y.php')).toBe(true);
    expect(isBazosUrl('http://bazos.cz/inzerat/1')).toBe(true);
  });
  it('rejects non-bazos and junk', () => {
    expect(isBazosUrl('https://sbazar.cz/x')).toBe(false);
    expect(isBazosUrl('https://evil-bazos.cz.attacker.com/x')).toBe(false);
    expect(isBazosUrl('not a url')).toBe(false);
    expect(isBazosUrl('')).toBe(false);
  });
});

describe('parseBatchUrls', () => {
  it('splits on newlines, spaces and commas', () => {
    const text = `https://a.bazos.cz/inzerat/1
      https://b.bazos.cz/inzerat/2, https://c.bazos.cz/inzerat/3`;
    expect(parseBatchUrls(text)).toEqual([
      'https://a.bazos.cz/inzerat/1',
      'https://b.bazos.cz/inzerat/2',
      'https://c.bazos.cz/inzerat/3',
    ]);
  });

  it('drops non-bazos tokens and empties', () => {
    const text = 'https://www.bazos.cz/inzerat/1\nhttps://google.com\n\nfoo';
    expect(parseBatchUrls(text)).toEqual(['https://www.bazos.cz/inzerat/1']);
  });

  it('de-duplicates preserving first-seen order', () => {
    const text = 'https://x.bazos.cz/inzerat/1 https://x.bazos.cz/inzerat/1 https://y.bazos.cz/inzerat/2';
    expect(parseBatchUrls(text)).toEqual([
      'https://x.bazos.cz/inzerat/1',
      'https://y.bazos.cz/inzerat/2',
    ]);
  });

  it('caps the number of URLs', () => {
    const many = Array.from({ length: 50 }, (_, i) => `https://x.bazos.cz/inzerat/${i}`).join('\n');
    expect(parseBatchUrls(many)).toHaveLength(BATCH_MAX_URLS);
    expect(parseBatchUrls(many, 5)).toHaveLength(5);
  });

  it('handles empty / nullish input', () => {
    expect(parseBatchUrls('')).toEqual([]);
    // @ts-expect-error runtime guard for undefined
    expect(parseBatchUrls(undefined)).toEqual([]);
  });
});
