import { describe, it, expect } from 'vitest';
import { SITEMAP_SECTIONS, sitemapSection, isSitemapSection } from '../../src/lib/sitemap-sections';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

describe('sitemapSection', () => {
  it('řadí české sekce podle prvního segmentu', () => {
    expect(sitemapSection('https://agro-svet.cz/stroje/zetor/proxima/proxima-120/')).toBe('stroje');
    expect(sitemapSection('https://agro-svet.cz/srovnani/a-vs-b/')).toBe('stroje');
    expect(sitemapSection('https://agro-svet.cz/plodiny/petrzel/')).toBe('plodiny');
    expect(sitemapSection('https://agro-svet.cz/odrudy/udrzovatel/betaseed-gmbh/')).toBe('plodiny');
    expect(sitemapSection('https://agro-svet.cz/plemena/kone/cesky-teplokrevnik/')).toBe('chov');
    expect(sitemapSection('https://agro-svet.cz/bazar/123/')).toBe('bazar');
    expect(sitemapSection('https://agro-svet.cz/novinky/neco/')).toBe('novinky');
  });

  it('dává každé jazykové mutaci vlastní sekci', () => {
    expect(sitemapSection('https://agro-svet.cz/sk/stroje/')).toBe('sk');
    expect(sitemapSection('https://agro-svet.cz/uk/plodiny/pshenytsia/')).toBe('uk');
    expect(sitemapSection('https://agro-svet.cz/pl/plemena/')).toBe('pl');
    expect(sitemapSection('https://agro-svet.cz/de/stroje/fendt/')).toBe('de');
  });

  it('homepage a neznámé sekce padají do ostatni', () => {
    expect(sitemapSection('https://agro-svet.cz/')).toBe('ostatni');
    expect(sitemapSection('https://agro-svet.cz/kalkulacka/leasing-traktoru/')).toBe('ostatni');
    expect(sitemapSection('https://agro-svet.cz/uplne-nova-sekce/x/')).toBe('ostatni');
  });

  it('zvládne i relativní cestu', () => {
    expect(sitemapSection('/stroje/')).toBe('stroje');
  });

  it('každá vrácená sekce je v seznamu (jinak by index odkazoval na 404)', () => {
    const samples = ['/', '/stroje/', '/sk/x/', '/de/y/', '/bazar/1/', '/nic/'];
    for (const s of samples) {
      expect(isSitemapSection(sitemapSection(s))).toBe(true);
      expect(SITEMAP_SECTIONS).toContain(sitemapSection(s));
    }
  });

  it('isSitemapSection odmítne neznámé', () => {
    expect(isSitemapSection('stroje')).toBe(true);
    expect(isSitemapSection('neexistuje')).toBe(false);
    expect(isSitemapSection(undefined)).toBe(false);
  });
});

describe('routy dílčích sitemap', () => {
  it('pro každou sekci existuje soubor v src/pages/sitemap/ a naopak', () => {
    const dir = join(process.cwd(), 'src/pages/sitemap');
    const files = readdirSync(dir)
      .filter((f) => f.endsWith('.xml.ts'))
      .map((f) => f.replace('.xml.ts', ''))
      .sort();
    // Sitemap index odkazuje na /sitemap/<sekce>.xml — chybějící soubor = 404
    // v indexu, přebývající = sitemapa, na kterou nikdo neodkáže.
    expect(files).toEqual([...SITEMAP_SECTIONS].sort());
  });

  it('routy jsou statické, ne dynamické — s trailingSlash:"always" by /sitemap/x.xml 404-ovalo', () => {
    const dir = join(process.cwd(), 'src/pages/sitemap');
    expect(readdirSync(dir).filter((f) => f.includes('['))).toEqual([]);
  });
});
