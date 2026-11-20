import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseBatchUrls, parseSingleUrl, isBazosUrl, BATCH_MAX_URLS } from './bazar-batch-urls';

// Hosty, které dřívější regex `^https?://.*bazos\.cz` v single režimu importu
// pouštěl (SSRF — server by si stáhl cizí adresu).
const SSRF_BYPASSES = [
  'http://evil.example/?bazos.cz',
  'http://evil.example/#bazos.cz',
  'http://169.254.169.254/latest/meta-data/?x=bazos.cz',
  'http://127.0.0.1:3000/admin/bazos.cz',
  'http://localhost/bazos.cz',
  'http://bazos.cz@evil.example/',
  'http://bazos.cz:80@evil.example/',
  'http://evil.example\\@bazos.cz/',
  'https://evil-bazos.cz/inzerat/1',
  'https://bazos.cz.evil.example/inzerat/1',
];

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
  it.each(SSRF_BYPASSES)('rejects SSRF bypass %s', (u) => {
    expect(isBazosUrl(u)).toBe(false);
  });
});

describe('parseSingleUrl', () => {
  it('returns the trimmed URL for a bazos.cz listing', () => {
    expect(parseSingleUrl('  https://www.bazos.cz/inzerat/1/x.php \n')).toBe('https://www.bazos.cz/inzerat/1/x.php');
    expect(parseSingleUrl('https://zemedelska.bazos.cz/inzerat/9/y.php')).toBe('https://zemedelska.bazos.cz/inzerat/9/y.php');
  });
  it.each(SSRF_BYPASSES)('returns null for SSRF bypass %s', (u) => {
    expect(parseSingleUrl(u)).toBeNull();
  });
  it('returns null for non-strings and empty input', () => {
    expect(parseSingleUrl(undefined)).toBeNull();
    expect(parseSingleUrl(null)).toBeNull();
    expect(parseSingleUrl(42)).toBeNull();
    expect(parseSingleUrl('')).toBeNull();
    expect(parseSingleUrl('   ')).toBeNull();
  });
});

describe('admin import endpoint', () => {
  // Single režim býval jediné místo s vlastním regexem na bazos.cz. Hlídka, ať se
  // tam znovu nevrátí — kontrola musí jít přes sdílený helper.
  const src = readFileSync(
    join(process.cwd(), 'src/pages/admin/bazar/seed/api/import.ts'),
    'utf8',
  );
  it('validates the single URL through parseSingleUrl, not an inline regex', () => {
    expect(src).toContain('parseSingleUrl(');
    expect(src).not.toMatch(/bazos\\\./i); // literální `bazos\.` = regex na doménu
    expect(src).not.toMatch(/\.test\(url\)/);
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
