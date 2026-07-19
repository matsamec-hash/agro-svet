import { describe, it, expect } from 'vitest';
import { parseBazosListing } from './bazar-import-parse';

const SAMPLE = `
<html><head><title>Prodám secí stroj Amazone | Bazoš.cz</title>
<meta property="og:image" content="https://www.bazos.cz/img/1/100/foo.jpg">
</head><body>
<h1 class="nadpisdetail">Prodám secí stroj Amazone D9</h1>
<table><tr><td>Cena:</td><td>85 000 Kč</td></tr>
<tr><td>Lokalita:</td><td>Havlíčkův Brod 58001</td></tr></table>
<div class="popisdetail">Secí stroj Amazone D9, záběr 3 m, málo použitý. Volejte 777123456.</div>
<img class="carousel-cell-image" src="https://www.bazos.cz/img/1/300/one.jpg">
<img class="carousel-cell-image" src="https://www.bazos.cz/img/1/300/two.jpg">
</body></html>`;

describe('parseBazosListing', () => {
  it('vytáhne název, cenu, popis, lokalitu a fotky', () => {
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
  it('chybějící cena → null, prázdné pole fotek', () => {
    const r = parseBazosListing('<html><body><h1 class="nadpisdetail">Bez ceny</h1></body></html>');
    expect(r.title).toBe('Bez ceny');
    expect(r.price).toBeNull();
    expect(r.imageUrls).toEqual([]);
  });
});
