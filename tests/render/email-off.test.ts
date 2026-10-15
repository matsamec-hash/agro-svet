import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';

// Komentář <!--email_off--> vypíná Cloudflare Email Obfuscation (kontakt na
// provozovatele má být čitelný i bez JS). 2026-10-15 ho Astro escapovalo
// (`set:html="…"` jako řetězcový atribut) a na KAŽDÉ stránce se nahoře a dole
// vypsal jako text „<!--email_off-->". Hlídá se proto vyrenderované HTML.
describe('Layout — email_off', () => {
  it('komentář je v HTML jako komentář, ne jako viditelný text', async () => {
    const page = await import('../../src/pages/podminky-pouziti.astro');
    const container = await AstroContainer.create();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const html = await container.renderToString(page.default as any, { locals: { locale: 'cs' } } as any);
    expect(html).toContain('<!--email_off-->');
    expect(html).toContain('<!--/email_off-->');
    expect(html).not.toContain('&lt;!--email_off');
    expect(html).not.toContain('&lt;!--/email_off');
  });
});
