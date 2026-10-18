import { describe, it, expect, vi } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';

/**
 * aria-label SVG regionální mapy (/svet/<země>/) musí být v jazyce stránky.
 * Dřív byl v RegionMap.astro natvrdo `Mapa ${země} — ${metrika}` — čtečka
 * obrazovky pod /de četla „Mapa Deutschland — Viehdichte". Hlídá se SSR HTML
 * i šablona, kterou klient použije při přepnutí metriky.
 */

vi.setConfig({ testTimeout: 60_000 });

const decode = (html: string) => html.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');

const EXPECTED = {
  cs: { aria: 'Regionální mapa: Německo — Hustota skotu', tpl: 'Regionální mapa: Německo — {metric}' },
  sk: { aria: 'Regionálna mapa: Nemecko — Hustota dobytka', tpl: 'Regionálna mapa: Nemecko — {metric}' },
  pl: { aria: 'Mapa regionalna: Niemcy — Gęstość bydła', tpl: 'Mapa regionalna: Niemcy — {metric}' },
  de: { aria: 'Regionalkarte: Deutschland — Viehdichte', tpl: 'Regionalkarte: Deutschland — {metric}' },
  uk: { aria: 'Регіональна карта: Німеччина — Щільність поголів’я', tpl: 'Регіональна карта: Німеччина — {metric}' },
} as const;

async function render(locale: string): Promise<string> {
  const page = (await import('../../src/pages/svet/[slug].astro')).default;
  const container = await AstroContainer.create();
  const prefix = locale === 'cs' ? '' : `/${locale}`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await container.renderToResponse(page as any, {
    params: { slug: 'nemecko' },
    locals: { locale, localizedPathname: `${prefix}/svet/nemecko/` },
    request: new Request(`https://agro-svet.cz${prefix}/svet/nemecko/`),
  } as any);
  expect(res.status).toBe(200);
  return decode(await res.text());
}

describe('/svet/<země>/ — aria-label regionální mapy v jazyce stránky', () => {
  for (const [locale, exp] of Object.entries(EXPECTED)) {
    it(`${locale}: ${exp.aria}`, async () => {
      const html = await render(locale);
      const svg = html.match(/<svg[^>]*id="svet-map-svg"[^>]*>/)?.[0] ?? '';
      expect(svg, 'SVG mapy se vykreslilo').not.toBe('');
      expect(svg).toContain(`aria-label="${exp.aria}"`);
      // Starý tvar „Mapa <země> — …" (česky) se nesmí vrátit v žádném jazyce.
      expect(svg).not.toMatch(/aria-label="Mapa (Německo|Nemecko|Niemcy|Deutschland|Німеччина) /);
      // Klientský přepínač metrik skládá popisek z téže šablony.
      expect(html).toContain(`"ariaTpl":"${exp.tpl}"`);
    });
  }
});
