import { describe, it, expect } from 'vitest';
import { parseBazosListing } from './bazar-import-parse';

// Vzorek odpovídá REÁLNÉ struktuře stroje.bazos.cz (ověřeno 2026-07-20):
// - h1/div mají class BEZ uvozovek
// - cena/lokalita jsou v textu (meta description), ne v tabulce
// - obrázky přes data-flickity-lazyload (lazy-loaded už nemají src)
const SAMPLE = `
<html><head><title>Prodám secí stroj Amazone | Bazoš.cz</title>
<meta name="description" content="Prodám secí stroj Amazone. Cena: 85 000 Kč, Lokalita: Havlíčkův Brod. Popis: záběr 3 m.">
</head><body>
<h1 class=nadpisdetail>Prodám secí stroj Amazone D9</h1>
<div class=popisdetail>Secí stroj Amazone D9, záběr 3 m, málo použitý. Volejte 777123456.</div>
<img class="carousel-cell-image" data-flickity-lazyload="https://www.bazos.cz/img/1/300/one.jpg" src="https://www.bazos.cz/img/1/300/one.jpg">
<img class="carousel-cell-image" data-flickity-lazyload="https://www.bazos.cz/img/1/300/two.jpg">
</body></html>`;

describe('parseBazosListing', () => {
  it('vytáhne název, cenu, popis, lokalitu a fotky (reálná Bazoš struktura)', () => {
    const r = parseBazosListing(SAMPLE);
    expect(r.title).toBe('Prodám secí stroj Amazone D9');
    expect(r.price).toBe(85000);
    expect(r.location).toContain('Havlíčkův Brod');
    expect(r.description).toContain('Amazone D9');
    expect(r.imageUrls).toEqual([
      'https://www.bazos.cz/img/1/300/one.jpg',
      'https://www.bazos.cz/img/1/300/two.jpg',
    ]);
  });

  it('funguje i s uvozovkami u class (Bazoš je nekonzistentní)', () => {
    const r = parseBazosListing('<h1 class="nadpisdetail">S uvozovkami</h1>');
    expect(r.title).toBe('S uvozovkami');
  });

  it('chybějící cena → null, prázdné pole fotek', () => {
    const r = parseBazosListing('<html><body><h1 class=nadpisdetail>Bez ceny</h1></body></html>');
    expect(r.title).toBe('Bez ceny');
    expect(r.price).toBeNull();
    expect(r.imageUrls).toEqual([]);
  });
});
