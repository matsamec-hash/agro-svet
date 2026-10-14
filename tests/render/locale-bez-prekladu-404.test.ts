import { describe, it, expect, vi, afterEach } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';

/**
 * Nepřeložený obsah pod jazykovým prefixem = 404, ne český text.
 *
 * `/sk|uk|pl/novinky/<slug>/` bez řádku v `article_translations` vracelo
 * HTTP 200 s ČESKÝM tělem pod cizím `lang` — zachraňoval to jen `noindex`.
 * `/jak-na-to` a `/encyklopedie` v tom případě vrací 404; teď stejně i novinky,
 * profily značek, půda, dotační tituly a cs-only články (historie, průvodce
 * pod uk/pl, akce). Výpisy a přehledy pod prefixem se NEmění — 404 jen tam,
 * kde by se servíroval celý český text. Databáze i kolekce se podstrčí tak, aby
 * česká verze EXISTOVALA — jinak by test prošel i bez opravy, protože 404 by
 * přišlo z prázdného výsledku, ne z rozhodnutí stránky.
 */

async function renderPage(
  page: unknown,
  locale: string,
  path: string,
  params: Record<string, string>,
): Promise<Response> {
  const notFound = (await import('../../src/pages/404.astro')).default;
  const container = await AstroContainer.create();
  // Astro.rewrite('/404') potřebuje v kontejneru routu, jinak hodí výjimku.
  container.insertPageRoute('/404', notFound);
  const prefix = locale === 'cs' ? '' : `/${locale}`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return container.renderToResponse(page as any, {
    params,
    locals: { locale, localizedPathname: `${prefix}${path}` },
    request: new Request(`https://agro-svet.cz${prefix}${path}`),
  } as any);
}

// Každý test znovu importuje stránku po vi.resetModules() → studený překlad
// .astro. Na vytíženém stroji (load 30+) to přeleze výchozích 5 s, i když
// stránka sama je v pořádku.
vi.setConfig({ testTimeout: 20_000 });

afterEach(() => {
  vi.doUnmock('../../src/lib/supabase');
  vi.doUnmock('astro:content');
});

// ---------------------------------------------------------------------------
// /novinky/<slug>/ — články z CMS, překlady v `article_translations`
// ---------------------------------------------------------------------------

const ARTICLE = {
  id: 'a1',
  title: 'Pěstování lanýžů',
  slug: 'pestovani-lanyzu',
  perex: 'Český perex článku.',
  content: '<p>Český text článku.</p>',
  featured_image_url: null,
  featured_image_credit: null,
  focal_point: null,
  category: 'novinky',
  tags: [],
  published_at: '2026-09-01T00:00:00Z',
  seo_title: null,
  seo_description: null,
};

type Row = Record<string, unknown>;

function fakeClient(translations: Row[]) {
  const builder = (table: string) => {
    const result = table === 'article_translations' ? { data: translations } : { data: [ARTICLE] };
    const chain: Record<string, unknown> = {
      then: (resolve: (v: unknown) => unknown) => Promise.resolve(result).then(resolve),
      single: () => Promise.resolve({ data: ARTICLE }),
    };
    for (const m of ['select', 'eq', 'in', 'order', 'limit', 'not', 'is', 'neq', 'gte', 'lte', 'filter']) {
      chain[m] = () => chain;
    }
    return chain;
  };
  return { from: builder };
}

async function renderArticle(locale: string, translations: Row[]): Promise<Response> {
  vi.resetModules();
  vi.doMock('../../src/lib/supabase', () => ({
    createAnonClient: () => fakeClient(translations),
    createServerClient: () => fakeClient(translations),
    getPublicSupabaseConfig: () => ({ url: 'http://localhost', anonKey: 'test' }),
  }));
  const page = (await import('../../src/pages/novinky/[slug].astro')).default;
  return renderPage(page, locale, `/novinky/${ARTICLE.slug}/`, { slug: ARTICLE.slug });
}

describe('novinky pod jazykovým prefixem', () => {
  for (const locale of ['sk', 'uk', 'pl']) {
    it(`/${locale}/novinky/<slug>/ bez překladu → 404, žádný český text`, async () => {
      const res = await renderArticle(locale, []);
      const html = await res.text();
      expect(res.status).toBe(404);
      expect(html).not.toContain('Český text článku.');
    });
  }

  it('prázdný řádek překladu (bez titulku) se nepočítá jako překlad → 404', async () => {
    const res = await renderArticle('uk', [{ article_id: 'a1', locale: 'uk', title: '  ', perex: null, content: null }]);
    expect(res.status).toBe(404);
  });

  it('přeložený článek pod /uk/ → 200 s ukrajinským textem, indexovatelný', async () => {
    const res = await renderArticle('uk', [
      { article_id: 'a1', locale: 'uk', title: 'Вирощування трюфелів', perex: 'Перекладений перекс.', content: '<p>Перекладений текст.</p>' },
    ]);
    const html = await res.text();
    expect(res.status).toBe(200);
    expect(html).toContain('Вирощування трюфелів');
    expect(html).toContain('Перекладений текст.');
    expect(html).not.toContain('Český text článku.');
    expect(html).not.toMatch(/<meta name="robots" content="noindex/);
  });

  it('hreflang ani přepínač jazyka nemíří na jazyk bez překladu (404)', async () => {
    const res = await renderArticle('cs', [
      { article_id: 'a1', locale: 'sk', title: 'Pestovanie hľuzoviek', perex: null, content: null },
    ]);
    const html = await res.text();
    expect(res.status).toBe(200);
    expect(html).toContain('hreflang="sk" href="https://agro-svet.cz/sk/novinky/pestovani-lanyzu/"');
    expect(html).not.toMatch(/<link rel="alternate" hreflang="(uk|pl)"/);
    // Přepínač: sk na článek, uk/pl na hub novinek, nikdy na /uk|pl/novinky/<slug>/.
    expect(html).toContain('href="/sk/novinky/pestovani-lanyzu/"');
    expect(html).not.toMatch(/href="\/(uk|pl)\/novinky\/pestovani-lanyzu\/"/);
    expect(html).toMatch(/href="\/uk\/novinky\/"[^>]*hreflang="uk"/);
  });

  it('cs článek se nemění → 200', async () => {
    const res = await renderArticle('cs', []);
    const html = await res.text();
    expect(res.status).toBe(200);
    expect(html).toContain('Český text článku.');
  });
});

// ---------------------------------------------------------------------------
// Obsahové kolekce s jazykovými overlayi — česká položka existuje, překlad ne
// ---------------------------------------------------------------------------

/** `astro:content`, kde existují JEN české kolekce. Overlay kolekce jsou
 *  prázdné, takže stránka pod prefixem nesmí sáhnout po české položce. */
async function mockCsOnlyContent(csCollections: string[]): Promise<string[]> {
  const calls: string[] = [];
  vi.resetModules();
  vi.doMock('astro:content', async () => ({
    ...(await vi.importActual<Record<string, unknown>>('astro:content')),
    getEntry: async (collection: string, id: string) => {
      calls.push(collection);
      return csCollections.includes(collection)
        ? { id, collection, body: 'Český text položky.', data: {} }
        : undefined;
    },
    getCollection: async () => [],
    render: async () => ({ Content: () => '', headings: [] }),
  }));
  return calls;
}

describe('obsahové kolekce pod jazykovým prefixem', () => {
  const cases = [
    { route: 'znacky/[slug].astro', cs: 'znacky', path: '/znacky/fendt/', slug: 'fendt', locales: ['sk', 'uk', 'pl'] },
    { route: 'puda/[slug].astro', cs: 'puda', path: '/puda/eroze/', slug: 'eroze', locales: ['sk', 'uk', 'pl'] },
    // pl ani uk nemají dotační tituly (sk má vlastní PPA SR kolekci).
    { route: 'dotace/[slug].astro', cs: 'dotace', path: '/dotace/dotace-pro-mlade-zemedelce/', slug: 'dotace-pro-mlade-zemedelce', locales: ['sk', 'uk', 'pl'] },
  ];

  for (const c of cases) {
    for (const locale of c.locales) {
      it(`/${locale}${c.path} bez překladu → 404, česká kolekce se nečte`, async () => {
        const calls = await mockCsOnlyContent([c.cs]);
        const page = (await import(/* @vite-ignore */ `../../src/pages/${c.route}`)).default;
        const res = await renderPage(page, locale, c.path, { slug: c.slug });
        const html = await res.text();
        expect(res.status).toBe(404);
        expect(html).not.toContain('Český text položky.');
        expect(calls, `pod /${locale}/ se četla česká kolekce '${c.cs}'`).not.toContain(c.cs);
      });
    }
  }
});

// ---------------------------------------------------------------------------
// cs-only články bez jakéhokoli překladu — pod prefixem by šel celý český text
// ---------------------------------------------------------------------------

describe('cs-only články pod jazykovým prefixem', () => {
  it('/<locale>/historie/milnik/<slug>/ → 404, cs zůstává 200', async () => {
    const { milestones } = await import('../../src/lib/historie');
    const m = milestones.find((x) => x.slug)!;
    const page = (await import('../../src/pages/historie/milnik/[slug].astro')).default;
    for (const locale of ['sk', 'uk', 'pl']) {
      const res = await renderPage(page, locale, `/historie/milnik/${m.slug}/`, { slug: m.slug! });
      expect(res.status, `/${locale}/historie/milnik/${m.slug}/`).toBe(404);
      expect(await res.text()).not.toContain(m.title);
    }
    const cs = await renderPage(page, 'cs', `/historie/milnik/${m.slug}/`, { slug: m.slug! });
    expect(cs.status).toBe(200);
    expect(await cs.text()).toContain(m.title);
  });

  it('/<locale>/historie/technika/<slug>/ → 404, cs zůstává 200', async () => {
    const { machines } = await import('../../src/lib/historie');
    const m = machines[0]!;
    const page = (await import('../../src/pages/historie/technika/[slug].astro')).default;
    for (const locale of ['sk', 'uk', 'pl']) {
      const res = await renderPage(page, locale, `/historie/technika/${m.slug}/`, { slug: m.slug });
      expect(res.status, `/${locale}/historie/technika/${m.slug}/`).toBe(404);
      expect(await res.text()).not.toContain(m.story.slice(0, 60));
    }
    const cs = await renderPage(page, 'cs', `/historie/technika/${m.slug}/`, { slug: m.slug });
    expect(cs.status).toBe(200);
  });

  it('/<locale>/pruvodce/<článek>/ → 404 pod uk a pl, sk (přeložený) a cs zůstávají 200', async () => {
    const page = (await import('../../src/pages/pruvodce/jak-vybrat-postrikovac.astro')).default;
    const path = '/pruvodce/jak-vybrat-postrikovac/';
    for (const locale of ['uk', 'pl']) {
      const res = await renderPage(page, locale, path, {});
      expect(res.status, `/${locale}${path}`).toBe(404);
      expect(await res.text()).not.toContain('Jak vybrat postřikovač');
    }
    const sk = await renderPage(page, 'sk', path, {});
    expect(sk.status).toBe(200);
    expect(await sk.text()).toContain('Ako vybrať postrekovač');
    const cs = await renderPage(page, 'cs', path, {});
    expect(cs.status).toBe(200);
    expect(await cs.text()).toContain('Jak vybrat postřikovač');
  });

  it('/<locale>/akce/<slug>/ → 404 a databáze se vůbec nečte', async () => {
    const getBySlug = vi.fn(async () => null);
    vi.resetModules();
    vi.doMock('../../src/lib/akce-supabase', () => ({
      getBySlug,
      listRelated: async () => [],
      getAkceImages: async () => [],
    }));
    try {
      const page = (await import('../../src/pages/akce/[slug].astro')).default;
      for (const locale of ['sk', 'uk', 'pl']) {
        const res = await renderPage(page, locale, '/akce/den-zemedelce/', { slug: 'den-zemedelce' });
        expect(res.status, `/${locale}/akce/den-zemedelce/`).toBe(404);
      }
      expect(getBySlug).not.toHaveBeenCalled();
    } finally {
      vi.doUnmock('../../src/lib/akce-supabase');
    }
  });
});
