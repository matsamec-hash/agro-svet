// tests/middleware-image-endpoint.test.ts
// Vestavěný image endpoint Astro (`/_image`) nikdo na webu nepoužívá (žádné astro:assets)
// a pouští sharp na libovolné w/h/f/q, takže ho middleware zavírá. Na produkci žil i s lomítkem
// (`/_image/` → 200), jak ukázal průzkum 2026-11-20. Skutečné chování se ověřuje na buildu
// (`/_image/?href=…` → 404), tady se jen hlídá, že pravidlo ze zdroje nezmizí.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf8');

describe('/_image je zavřený', () => {
  const middleware = read('src/middleware.ts');

  it('middleware vrací 404 pro /_image i /_image/…', () => {
    expect(middleware).toContain("url.pathname === '/_image'");
    expect(middleware).toContain("url.pathname.startsWith('/_image/')");
    expect(middleware).toMatch(/\/_image[\s\S]{0,300}new Response\('Not Found', \{ status: 404/);
  });

  it('zavření je před čímkoli, co by mohlo request pustit dál (CSRF, locale, next)', () => {
    const guard = middleware.indexOf("url.pathname === '/_image'");
    const csrf = middleware.indexOf('CSRF:');
    expect(guard).toBeGreaterThan(-1);
    expect(csrf).toBeGreaterThan(guard);
  });
});

describe('sharp v rss-seznam nesmí otevřít rizikové dekodéry', () => {
  const route = read('src/pages/rss-seznam/[slug].jpg.ts');

  it('sharp.block vypíná HEIF, SVG, GIF, TIFF a VIPS', () => {
    for (const op of ['VipsForeignLoadHeif', 'VipsForeignLoadSvg', 'VipsForeignLoadNsgif', 'VipsForeignLoadTiff', 'VipsForeignLoadVips']) {
      expect(route, op).toContain(`'${op}'`);
    }
    expect(route).toContain('sharp.block(');
  });
});
