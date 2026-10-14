import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';

/**
 * /unlock (site gate) si písma hostuje sám, stejně jako zbytek webu (Layout →
 * @fontsource v global.css). Dřív jako jediná stránka tahala Chakra Petch
 * a Roboto Condensed z Google Fonts — návštěvník tak před zadáním kódu
 * posílal IP na fonts.googleapis.com / fonts.gstatic.com.
 */
describe('/unlock — písma', () => {
  it('HTML neodkazuje na Google Fonts a přednačítá self-hostovanou Chakra Petch', async () => {
    const page = (await import('../../src/pages/unlock.astro')).default;
    const container = await AstroContainer.create();
    const html = await container.renderToString(page, {
      request: new Request('https://agro-svet.cz/unlock/?next=/'),
    });
    expect(html).not.toMatch(/fonts\.googleapis\.com|fonts\.gstatic\.com/);
    expect(html).toMatch(/<link rel="preload" as="font" type="font\/woff2" href="[^"]*chakra-petch-latin-400-normal[^"]*\.woff2"/);
    expect(html).toMatch(/<link rel="preload" as="font" type="font\/woff2" href="[^"]*chakra-petch-latin-700-normal[^"]*\.woff2"/);
  });
});
