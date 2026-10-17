import { describe, it, expect, vi } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import fs from 'node:fs';
import path from 'node:path';
import { ATTRIBUTION } from '../../src/i18n/svet';

/**
 * /svet ve VYRENDEROVANÉM HTML, ve všech jazycích: mapy se kreslí (každý région má
 * cestu) a u každé mapy, grafu i tabulky je atribuce, kterou chtějí licence zdrojů:
 *  - Eurostat: zdroj + upozornění na úpravy + že za ně neodpovídá,
 *  - World Bank: „The World Bank: World Development Indicators…", CC BY 4.0, podmínky,
 *  - hranice: Natural Earth (regionální mapy, mapa Evropy) a U.S. Census Bureau / us-atlas (USA).
 * Audit 2026-10-15 našel na /de jen holé „World Bank" a ani slovo o úpravách dat
 * Eurostatu; hranice GISCO a historical-basemaps se od 2026-10-17 nepoužívají vůbec.
 */

vi.setConfig({ testTimeout: 60_000 });

const LOCALES = ['cs', 'sk', 'pl', 'uk', 'de'] as const;
const ROOT = process.cwd();
const geo = (slug: string) => JSON.parse(fs.readFileSync(path.join(ROOT, `src/data/svet/regions/${slug}-geo.json`), 'utf8'));
const decode = (html: string) => html.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');

async function renderPage(page: unknown, locale: string, p: string, params: Record<string, string> = {}): Promise<{ status: number; html: string }> {
  const container = await AstroContainer.create();
  const prefix = locale === 'cs' ? '' : `/${locale}`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await container.renderToResponse(page as any, {
    params,
    locals: { locale, localizedPathname: `${prefix}${p}` },
    request: new Request(`https://agro-svet.cz${prefix}${p}`),
  } as any);
  return { status: res.status, html: decode(await res.text()) };
}

function expectNoOldSources(html: string, where: string) {
  expect(html, `${where}: starý zdroj hranic`).not.toMatch(/GISCO|EuroGeographics|historical-basemaps/i);
}

function expectWorldBank(html: string, where: string) {
  expect(html, `${where}: citace WDI`).toContain('The World Bank: <a href="https://datacatalog.worldbank.org/search/dataset/0037712/World-Development-Indicators"');
  expect(html, `${where}: licence CC BY 4.0`).toContain('href="https://creativecommons.org/licenses/by/4.0/"');
  expect(html, `${where}: podmínky World Bank`).toContain('href="https://www.worldbank.org/ext/en/legal/terms-conditions/datasets"');
}

describe('/svet/<země>/ — regionální mapa a atribuce', () => {
  for (const locale of LOCALES) {
    it(`${locale}: Německo — mapa 16 régionů, Natural Earth, Eurostat s prohlášením, World Bank WDI`, async () => {
      const page = (await import('../../src/pages/svet/[slug].astro')).default;
      const { status, html } = await renderPage(page, locale, '/svet/nemecko/', { slug: 'nemecko' });
      expect(status).toBe(200);
      const A = ATTRIBUTION[locale];
      const paths = html.match(/<path d="M[^"]+" data-code="DE[0-9A-G]"/g) ?? [];
      expect(paths.length, 'každý région má cestu').toBe(geo('nemecko').regions.length);
      expect(html).toContain(A.mapNe);
      expect(html).toContain(A.mapEurostat);
      expect(html).toContain(A.eurostat);
      expect(html).toContain(A.neRegions);
      expectWorldBank(html, `${locale} nemecko`);
      // řádky ukazatelů: World Bank v povinném tvaru citace, ne holé „World Bank · rok"
      expect(html).toMatch(/class="svet-src"[^>]*>The World Bank: World Development Indicators: FAO · \d{4}/);
      expect(html).not.toMatch(/class="svet-src"[^>]*>World Bank ·/);
      expectNoOldSources(html, `${locale} nemecko`);
    });
  }

  it('USA: hranice U.S. Census Bureau přes us-atlas, data USDA (bez prohlášení Eurostatu u mapy)', async () => {
    const page = (await import('../../src/pages/svet/[slug].astro')).default;
    for (const locale of LOCALES) {
      const { status, html } = await renderPage(page, locale, '/svet/usa/', { slug: 'usa' });
      expect(status).toBe(200);
      const A = ATTRIBUTION[locale];
      expect((html.match(/data-code="[A-Z]{2}"/g) ?? []).length, locale).toBe(geo('usa').regions.length);
      expect(html, locale).toContain(A.mapUs);
      expect(html, locale).toContain(A.usCensus);
      expect(html, locale).not.toContain(A.mapEurostat);
    }
  });

  it('Polsko: Mazowieckie jako jeden région PL9 s poznámkou v jazyce stránky', async () => {
    const page = (await import('../../src/pages/svet/[slug].astro')).default;
    for (const locale of LOCALES) {
      const { html } = await renderPage(page, locale, '/svet/polsko/', { slug: 'polsko' });
      expect(html, locale).toContain('data-code="PL9"');
      expect(html, locale).not.toContain('data-code="PL91"');
      expect(html, locale).toMatch(/PL91 (a|i|und|і) PL92/);
    }
  });

  it('Portugalsko: bez regionální mapy, ale s atribucí dat', async () => {
    const page = (await import('../../src/pages/svet/[slug].astro')).default;
    const { status, html } = await renderPage(page, 'cs', '/svet/portugalsko/', { slug: 'portugalsko' });
    expect(status).toBe(200);
    expect(html).not.toContain('id="svet-map-svg"');
    expect(html).toContain(ATTRIBUTION.cs.eurostat);
  });
});

describe('/svet/mapa/ — mapa Evropy', () => {
  for (const locale of LOCALES) {
    it(`${locale}: všechny země mají cestu, Natural Earth, Eurostat i World Bank`, async () => {
      const page = (await import('../../src/pages/svet/mapa/index.astro')).default;
      const { status, html } = await renderPage(page, locale, '/svet/mapa/');
      expect(status).toBe(200);
      const europe = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/svet/geo/europe.json'), 'utf8'));
      expect((html.match(/<path class="agrimap-c" data-c="[A-Z]{2}"/g) ?? []).length).toBe(europe.regions.length);
      const A = ATTRIBUTION[locale];
      expect(html).toContain(A.mapEurostatEu);
      expect(html).toContain(A.mapNe);
      expect(html).toContain(A.neCountries);
      expect(html).toContain(A.eurostat);
      expectWorldBank(html, `${locale} mapa`);
      // seznam zdrojů v metodice i data metrik pro klienta: WDI, ne holé „World Bank"
      expect(html).toMatch(/<strong[^>]*>The World Bank: World Development Indicators: FAO<\/strong>/);
      expect(html).not.toContain('"source":"World Bank"');
      expectNoOldSources(html, `${locale} mapa`);
    });
  }
});

describe('/svet/srovnani/ — graf a tabulka', () => {
  for (const locale of LOCALES) {
    it(`${locale}: Eurostat s prohlášením a World Bank WDI`, async () => {
      const page = (await import('../../src/pages/svet/srovnani/index.astro')).default;
      const { status, html } = await renderPage(page, locale, '/svet/srovnani/');
      expect(status).toBe(200);
      expect(html).toContain(ATTRIBUTION[locale].eurostat);
      expectWorldBank(html, `${locale} srovnani`);
    });
  }
});

describe('/data/licence/ (jen cs)', () => {
  it('jmenuje zdroje /svet a jejich podmínky, včetně licence us-atlas', async () => {
    const page = (await import('../../src/pages/data/licence/index.astro')).default;
    const { status, html } = await renderPage(page, 'cs', '/data/licence/');
    expect(status).toBe(200);
    expect(html).toContain('Eurostat za tyto úpravy nenese žádnou odpovědnost.');
    expect(html).toContain('href="https://ec.europa.eu/eurostat/help/copyright-notice"');
    expect(html).toContain('The World Bank: World Development Indicators: [původní zdroj]');
    expect(html).toContain('href="https://www.worldbank.org/ext/en/legal/terms-conditions/datasets"');
    expect(html).toContain('Natural Earth');
    expect(html).toContain('Copyright 2013-2019 Michael Bostock');
    expect(html).toContain('provided that the above copyright notice');
    expectNoOldSources(html, 'licence');
  });
});
