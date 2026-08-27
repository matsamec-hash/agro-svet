import { describe, it, expect } from 'vitest';
import { pageTitle, absoluteUrl } from '../../src/lib/head-meta';

describe('pageTitle', () => {
  it('doplní brand, když si ho stránka nedala', () => {
    expect(pageTitle('Kombajny — katalog')).toBe('Kombajny — katalog | agro-svět.cz');
  });

  // GSC/SERP: Layout přidával brand i k titulkům, které končily „| agro-svět"
  // (bez .cz) → „… | agro-svět | agro-svět.cz". 16 titulků v src/i18n.
  it('nezdvojí brand, když titulek končí „| agro-svět" bez .cz', () => {
    expect(pageTitle('Ankety — hlasujte o zemědělské technice | agro-svět')).toBe(
      'Ankety — hlasujte o zemědělské technice | agro-svět.cz',
    );
  });

  it('nezdvojí brand ani při oddělení pomlčkou', () => {
    expect(pageTitle('Přehledy a roční bilance — agro-svět')).toBe(
      'Přehledy a roční bilance | agro-svět.cz',
    );
  });

  it('nezdvojí brand, když titulek končí plným „| agro-svět.cz"', () => {
    expect(pageTitle('Technika — agro-svět.cz')).toBe('Technika | agro-svět.cz');
  });

  it('sjednotí i trojnásobné zopakování brandu', () => {
    expect(pageTitle('Poradniki | agro-svět.cz | agro-svět.cz')).toBe('Poradniki | agro-svět.cz');
  });

  it('nechá titulek beze změny, když je brand součástí věty (homepage, redakce)', () => {
    expect(pageTitle('agro-svět.cz — zemědělská technika, bazar a novinky')).toBe(
      'agro-svět.cz — zemědělská technika, bazar a novinky',
    );
    expect(pageTitle('Redakce agro-svět.cz')).toBe('Redakce agro-svět.cz');
  });

  it('ošetří prázdný titulek', () => {
    expect(pageTitle('')).toBe('agro-svět.cz');
    expect(pageTitle('   ')).toBe('agro-svět.cz');
  });
});

describe('absoluteUrl', () => {
  // Stránky /historie/* předávaly canonical relativně → do <link rel=canonical>
  // i og:url šlo „/historie/" místo absolutní URL (og:url MUSÍ být absolutní).
  it('převede relativní cestu na absolutní', () => {
    expect(absoluteUrl('/historie/')).toBe('https://agro-svet.cz/historie/');
  });

  it('nechá absolutní URL beze změny', () => {
    expect(absoluteUrl('https://agro-svet.cz/historie/technika/')).toBe(
      'https://agro-svet.cz/historie/technika/',
    );
  });

  it('doplní koncové lomítko u cesty bez přípony', () => {
    expect(absoluteUrl('/historie/data')).toBe('https://agro-svet.cz/historie/data/');
  });

  it('nepřidá lomítko k souboru s příponou', () => {
    expect(absoluteUrl('/rss.xml')).toBe('https://agro-svet.cz/rss.xml');
  });
});
