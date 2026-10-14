import { describe, it, expect, vi, afterEach } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { listIndexableUdrzovatele, isOdrudaIndexable, udrzovatelSlug } from '../../src/lib/plodiny';

/**
 * Nefunkční interní odkazy z crawlu 2026-10 (GSC hlásil 1 671× 404) — hlídá se,
 * co je opravdu v HTML, ne jen pomocná funkce:
 * - detail odrůdy odkazoval na stránku udržovatele i pod indexovým prahem (~40× 404)
 * - drobečková navigace řady nářadí → /stroje/zemedelske-stroje/<subkategorie>/ (404)
 * - stránka značky → /stroje/rezacky/ a /stroje/postrikovace/ (404, navíc bez jazyka)
 * - přepínač jazyka a hreflang mířily na skrytou kategorii novinek a cs-only stránky
 */
vi.setConfig({ testTimeout: 30_000 });

function fakeClient() {
  const result = { data: [], count: 0, error: null };
  const chain: Record<string, unknown> = {
    then: (resolve: (v: unknown) => unknown) => Promise.resolve(result).then(resolve),
    single: () => Promise.resolve({ data: null, error: null }),
    maybeSingle: () => Promise.resolve({ data: null, error: null }),
  };
  for (const m of ['select', 'eq', 'in', 'order', 'limit', 'not', 'is', 'neq', 'gte', 'lte', 'gt', 'lt', 'filter', 'or', 'range', 'ilike', 'contains', 'overlaps']) {
    chain[m] = () => chain;
  }
  return { from: () => chain };
}

async function render(pageModule: string, locale: string, path: string, params: Record<string, string>) {
  vi.resetModules();
  vi.doMock('../../src/lib/supabase', () => ({
    createAnonClient: () => fakeClient(),
    createServerClient: () => fakeClient(),
    getPublicSupabaseConfig: () => ({ url: 'http://localhost', anonKey: 'test' }),
  }));
  vi.doMock('astro:content', () => ({ getCollection: async () => [], getEntry: async () => undefined }));
  const page = (await import(/* @vite-ignore */ pageModule)).default;
  const notFound = (await import('../../src/pages/404.astro')).default;
  const container = await AstroContainer.create();
  container.insertPageRoute('/404', notFound);
  const prefix = locale === 'cs' ? '' : `/${locale}`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await container.renderToResponse(page as any, {
    params,
    locals: { locale, localizedPathname: `${prefix}${path}` },
    request: new Request(`https://agro-svet.cz${prefix}${path}`),
  } as any);
  return { status: res.status, html: await res.text() };
}

afterEach(() => {
  vi.doUnmock('../../src/lib/supabase');
  vi.doUnmock('astro:content');
});

const ODRUDA_PAGE = '../../src/pages/plodiny/[plodina]/[odruda].astro';

describe('detail odrůdy — odkaz na udržovatele', () => {
  it('udržovatel s jedinou odrůdou (bez vlastní stránky) je prostý text, ne odkaz do 404', async () => {
    const { status, html } = await render(ODRUDA_PAGE, 'cs', '/plodiny/kukurice/codimust/', { plodina: 'kukurice', odruda: 'codimust' });
    expect(status).toBe(200);
    expect(html).toContain('CODISEM');
    expect(html).not.toContain('/odrudy/udrzovatel/codisem/');
    // Detail odrůdy je cs-only → žádný hreflang na /sk|uk|pl (tam 302).
    expect(html).not.toMatch(/<link rel="alternate" hreflang="(sk|uk|pl)"/);
  });

  it('udržovatel nad prahem odkaz dál má', async () => {
    const u = listIndexableUdrzovatele().find((x) => x.odrudy.some((e) => isOdrudaIndexable(e.odruda)))!;
    const e = u.odrudy.find((x) => isOdrudaIndexable(x.odruda))!;
    const { status, html } = await render(ODRUDA_PAGE, 'cs', `/plodiny/${e.plodina_slug}/${e.odruda.slug}/`, { plodina: e.plodina_slug, odruda: e.odruda.slug });
    expect(status).toBe(200);
    expect(html).toContain(`href="/odrudy/udrzovatel/${udrzovatelSlug(u.name)}/"`);
  });
});

describe('stroje — odkaz na výpis kategorie', () => {
  const RADA = '../../src/pages/stroje/[brand]/rada/[category]/[family]/index.astro';

  for (const locale of ['cs', 'sk']) {
    it(`řada nářadí (Krone lisy) vede na /stroje/<subkategorie>/ — ${locale}`, async () => {
      const { status, html } = await render(RADA, locale, '/stroje/krone/rada/lisy-valcove/bellima/', { brand: 'krone', category: 'lisy-valcove', family: 'bellima' });
      const prefix = locale === 'cs' ? '' : `/${locale}`;
      expect(status).toBe(200);
      expect(html).toContain(`href="${prefix}/stroje/lisy-valcove/"`);
      expect(html).not.toContain('/stroje/zemedelske-stroje/lisy-valcove/');
    });
  }

  it('legacy kategorie John Deere (rezacky) vede na samojízdné řezačky', async () => {
    const { status, html } = await render(RADA, 'cs', '/stroje/john-deere/rada/rezacky/8/', { brand: 'john-deere', category: 'rezacky', family: '8' });
    expect(status).toBe(200);
    expect(html).toContain('href="/stroje/rezacky-samojizdne/"');
    expect(html).not.toContain('/stroje/zemedelske-stroje/rezacky/');
  });

  it('stránka značky: „všechny značky" míří na existující výpis, pod /pl s prefixem', async () => {
    const page = '../../src/pages/stroje/[brand]/index.astro';
    const cs = await render(page, 'cs', '/stroje/john-deere/', { brand: 'john-deere' });
    expect(cs.status).toBe(200);
    expect(cs.html).toContain('class="cat-cta" href="/stroje/rezacky-samojizdne/"');
    expect(cs.html).toContain('class="cat-cta" href="/stroje/postrikovace-samojizdne/"');
    expect(cs.html).not.toMatch(/href="\/stroje\/(rezacky|postrikovace)\/"/);
    const pl = await render(page, 'pl', '/stroje/john-deere/', { brand: 'john-deere' });
    expect(pl.html).toContain('class="cat-cta" href="/pl/stroje/rezacky-samojizdne/"');
  });
});

describe('přepínač jazyka a hreflang', () => {
  it('skrytá kategorie novinek: uk přepínač na hub, žádný hreflang na 404', async () => {
    const { status, html } = await render('../../src/pages/novinky/kategorie/[kat]/index.astro', 'cs', '/novinky/kategorie/dotace/', { kat: 'dotace' });
    expect(status).toBe(200);
    expect(html).not.toMatch(/href="\/(sk|uk|pl)\/novinky\/kategorie\/dotace\/"/);
    expect(html).toMatch(/href="\/uk\/novinky\/"[^>]*hreflang="uk"/);
    expect(html).not.toMatch(/<link rel="alternate" hreflang="(sk|uk|pl)"/);
  });

  it('cs-only plodina (zelenina) nemá hreflang na /sk|uk|pl (404)', async () => {
    const { status, html } = await render('../../src/pages/plodiny/[plodina]/index.astro', 'cs', '/plodiny/lilek/', { plodina: 'lilek' });
    expect(status).toBe(200);
    expect(html).not.toMatch(/<link rel="alternate" hreflang="(sk|uk|pl)"/);
  });

  it('přeložená plodina hreflang dál má', async () => {
    const { html } = await render('../../src/pages/plodiny/[plodina]/index.astro', 'cs', '/plodiny/psenice-ozima/', { plodina: 'psenice-ozima' });
    expect(html).toContain('hreflang="sk" href="https://agro-svet.cz/sk/plodiny/psenice-ozima/"');
  });

  it('PL-only landing: přepínač na češtinu míří na homepage, ne na /doplaty-bezposrednie/ (404)', async () => {
    const { status, html } = await render('../../src/pages/doplaty-bezposrednie/index.astro', 'pl', '/doplaty-bezposrednie/', {});
    expect(status).toBe(200);
    expect(html).not.toMatch(/href="\/doplaty-bezposrednie\/"/);
    expect(html).toMatch(/href="\/"[^>]*hreflang="cs"/);
  });
});
