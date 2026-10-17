import { describe, it, expect, vi } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { content } from '../../src/i18n/kontakt';
import { locales } from '../../src/i18n/config';

// /kontakt/ vykreslená ve všech jazycích. Texty natvrdo v šabloně by pod
// /de prosákly česky (feedback-agro-svet-hardcoded-strings-bypass-i18n), a
// hlášky po odeslání (?ok=1, ?err=…) se jinak nikde neověří.

vi.setConfig({ testTimeout: 20_000 });

async function render(locale: string, search = ''): Promise<string> {
  const page = await import('../../src/pages/kontakt.astro');
  const container = await AstroContainer.create();
  const prefix = locale === 'cs' ? '' : `/${locale}`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return container.renderToString(page.default as any, {
    locals: { locale, localizedPathname: `${prefix}/kontakt/` },
    request: new Request(`https://agro-svet.cz${prefix}/kontakt/${search}`),
  } as any);
}

function mainOf(html: string): string {
  // Jediný <main> je v Layoutu; obsah stránky je <div class="legal-page"> uvnitř něj.
  const m = html.match(/<div class="legal-page"[^>]*>([\s\S]*?)<\/main>/);
  expect(m, 'chybí <div class="legal-page">').not.toBeNull();
  return m![1];
}

describe('/kontakt/ — vykreslení', () => {
  for (const l of locales) {
    it(`${l}: formulář, texty v jazyce stránky, odkazy`, async () => {
      const c = content[l];
      const html = await render(l);
      const main = mainOf(html);
      expect(main).toContain(c.h1);
      expect(main).toContain('action="/api/kontakt/"');
      expect(main).toContain(`name="locale" value="${l}"`);
      expect(main).toContain('mailto:info@samecdigital.com');
      expect(main).toContain('Na Břehu 378, 387 11 Katovice');
      const prefix = l === 'cs' ? '' : `/${l}`;
      expect(main).toContain(`href="${prefix}/dsa-kontakt/"`);
      expect(main).toContain(`href="${prefix}/zpracovani-osobnich-udaju/"`);
      // bazar je jen česky: bez prefixu, pod ne-cs s hreflang="cs"
      if (l === 'cs') expect(main).toMatch(/<a href="\/bazar\/nahlasit\/"(?! hreflang)[ >]/);
      else expect(main).toMatch(/<a href="\/bazar\/nahlasit\/" hreflang="cs"[ >]/);
      // indexovatelné (launchnuté), ne noindex
      expect(html).not.toMatch(/<meta name="robots" content="noindex/);
      expect(main).not.toContain(c.ok);
    });
  }

  it('de: žádná česká věta v obsahu a odkaz na Impressum', async () => {
    const main = mainOf(await render('de'));
    for (const cz of Object.values(content.cs.topics)) expect(main).not.toContain(cz);
    expect(main).not.toContain(content.cs.lead);
    expect(main).toContain('href="/de/impressum/"');
  });

  it('?ok=1 → poděkování místo formuláře', async () => {
    const main = mainOf(await render('pl', '?ok=1'));
    expect(main).toContain(content.pl.ok);
    expect(main).not.toContain('<form');
    expect(main).toContain('href="/pl/kontakt/"');
  });

  it('?err=<kód> → lokalizovaná hláška a formulář zůstává', async () => {
    const main = mainOf(await render('uk', '?err=email'));
    expect(main).toContain(content.uk.errors.email);
    expect(main).toContain('<form');
  });

  it('neznámý kód chyby → obecná hláška, ne surový kód', async () => {
    const main = mainOf(await render('sk', '?err=%3Cb%3Ex'));
    expect(main).toContain(content.sk.errors.server);
    expect(main).not.toContain('<b>x');
  });

  it('obsah stránky nenačítá nic z cizích domén', async () => {
    const main = mainOf(await render('de'));
    expect(main).not.toMatch(/<script/i);
    expect(main).not.toMatch(/<(img|iframe|link)\b/i);
    expect(main).not.toMatch(/\b(src|action)="https?:/i);
  });
});
