import { describe, it, expect, vi } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

/**
 * Rohatka atribuce — tentokrát na VYRENDEROVANÉM HTML.
 *
 * `tests/lib/photo-credit.test.ts` hlídá registr: ke každému souboru existuje
 * autor, licence a odkaz. To je nutná podmínka, ne dostatečná — kvíz
 * `/kviz/poznas-znacku/` a polská i slovenská homepage prošly zelené, přestože
 * na stránce nebylo vidět vůbec nic:
 *
 *  - `TractorQuiz.astro` sestavoval bank otázek a autora s licencí při tom
 *    zahodil; `<figure>` neměl `<figcaption>`,
 *  - `HomePl.astro` / `HomeSk.astro` si `PhotoCredits.astro` vůbec neimportovaly,
 *  - dlaždice v `CategoryBrowse.astro` měly kredit s `opacity: 0` — vynořil se
 *    jen při najetí myší, takže na mobilu nikdy.
 *
 * Registr o žádné z těch tří vad nic nevěděl. Proto se tady stránky opravdu
 * vykreslí (Astro Container) a v HTML se kontroluje, že kredit tam je, že nese
 * jméno autora a proklik na licenci a že ho stylopis neschovává.
 *
 * Spouští se pod `vitest.render.config.ts` (potřebuje astro vite plugin, jinak
 * se `.astro` soubory nedají importovat) — `npm test` pouští oba projekty.
 */

const CC = /https:\/\/creativecommons\.org\/licenses\//;

async function render(mod: unknown, opts: Record<string, unknown> = {}): Promise<string> {
  const container = await AstroContainer.create();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return container.renderToString(mod as any, opts as any);
}

/** Kus HTML jednoho bloku „Fotografie" (souhrnná atribuce na konci stránky). */
function photoCreditsBlock(html: string): string | null {
  const i = html.indexOf('class="photo-credits"');
  if (i < 0) return null;
  const end = html.indexOf('</section>', i);
  return html.slice(i, end < 0 ? undefined : end);
}

/** Blok musí mít aspoň jedno jméno autora a aspoň jeden odkaz na licenci. */
function expectUsableCreditBlock(html: string, where: string) {
  const block = photoCreditsBlock(html);
  expect(block, `${where} — na stránce chybí blok „Fotografie"`).toBeTruthy();
  const authors = [...block!.matchAll(/class="pc-author"[^>]*>([^<]+)</g)].map((m) => m[1]!.trim());
  expect(authors.filter(Boolean).length, `${where} — blok je bez jmen autorů`).toBeGreaterThan(0);
  expect(block, `${where} — v bloku chybí odkaz na text licence`).toMatch(CC);
}


describe('atribuce ve vyrenderovaném HTML', () => {
  it('/stroje/traktory/ — dlaždice nesou viditelný kredit s odkazem na licenci', async () => {
    const CategoryBrowse = (await import('../../src/components/stroje/CategoryBrowse.astro')).default;
    const html = await render(CategoryBrowse, {
      props: { category: 'traktory' },
      locals: { locale: 'cs' },
      request: new Request('https://agro-svet.cz/stroje/traktory/'),
    });

    const credits = [...html.matchAll(/class="ft-credit"[^>]*>([\s\S]*?)<\/span>/g)].map((m) => m[1]!);
    expect(credits.length, 'žádná dlaždice nemá plaketku s kreditem').toBeGreaterThan(10);
    for (const c of credits) {
      expect(c, 'plaketka bez jména autora').toMatch(/©\s*\S/);
      expect(c, 'plaketka bez odkazu na licenci').toMatch(CC);
    }
    // Smyšlený původ: dlaždice hlásila „Foto: deere.cz" i u fotek z Commons.
    expect(html).not.toMatch(/deere\.cz|fendt\.com\/cz|zetor\.com\/cs/);
  });

  it('/kviz/poznas-znacku/ — každá karta nese autora a licenci, ne jen fotku', async () => {
    const TractorQuiz = (await import('../../src/components/TractorQuiz.astro')).default;
    const html = await render(TractorQuiz, {
      locals: { locale: 'cs' },
      request: new Request('https://agro-svet.cz/kviz/poznas-znacku/'),
    });

    expect(html, 'kvíz nemá pod fotkou popisek na kredit').toContain('class="tq-credit"');

    // Bank otázek jde do stránky jako inline JSON — atribuce musí být v datech,
    // ne až v hlavě autora skriptu.
    const pool = JSON.parse(/const POOL = (\[[\s\S]*?\]);/.exec(html)![1]!);
    const licenses = JSON.parse(/const LICENSES = (\[[\s\S]*?\]);/.exec(html)![1]!);
    expect(pool.length, 'prázdný bank otázek → test by prošel naprázdno').toBeGreaterThan(50);
    const { requiresAuthor } = await import('../../src/lib/photo-credit');
    for (const item of pool) {
      const lic = licenses[item.lc];
      expect(lic?.n, `karta ${item.i} bez názvu licence`).toBeTruthy();
      // Volné dílo autora ani odkaz na text licence nemá — a mít nemusí.
      if (!requiresAuthor(lic.n)) continue;
      expect(item.a, `karta ${item.i} bez autora`).toBeTruthy();
      expect(lic.u, `karta ${item.i} bez odkazu na licenci`).toBeTruthy();
    }
  });

  it('/plemena/<druh>/ — mřížka má souhrnný blok a AI snímky plaketku „ilustrace"', async () => {
    const page = (await import('../../src/pages/plemena/[druh]/index.astro')).default;
    const html = await render(page, {
      params: { druh: 'hovezi' },
      locals: { locale: 'cs' },
      request: new Request('https://agro-svet.cz/plemena/hovezi/'),
    });

    expectUsableCreditBlock(html, '/plemena/hovezi/');
    // Belgické modrobílé, Brown Swiss a Gasconne jsou generované modelem —
    // bez plaketky je čtenář čte jako fotografii konkrétního zvířete.
    expect(html, 'AI snímky nejsou označené jako ilustrace').toContain('AI ilustrace');
  });

  it('/srovnani/<combo>/ — obě fotky jedou jako pozadí, atribuci nese blok', async () => {
    const { topComparisonPairs } = await import('../../src/lib/comparator');
    const combo = topComparisonPairs(5)[0]!.combo;
    const page = (await import('../../src/pages/srovnani/[combo]/index.astro')).default;
    const html = await render(page, {
      params: { combo },
      locals: { locale: 'cs' },
      request: new Request(`https://agro-svet.cz/srovnani/${combo}/`),
    });
    expectUsableCreditBlock(html, `/srovnani/${combo}/`);
  });

  it('/vcelarstvi/* — výpisy miniatur mají blok „Fotografie"', async () => {
    for (const sekce of ['druhy', 'med', 'vybaveni']) {
      const page = (await import(`../../src/pages/vcelarstvi/${sekce}/index.astro`)).default;
      const html = await render(page, {
        locals: { locale: 'cs' },
        request: new Request(`https://agro-svet.cz/vcelarstvi/${sekce}/`),
      });
      expectUsableCreditBlock(html, `/vcelarstvi/${sekce}/`);
    }
  });
});

/**
 * Jazykové homepage. Cover fotky jdou z databáze, takže se klient podstrčí —
 * jinak by se test díval na prázdný feed a prošel naprázdno přesně tam, kde
 * chyba byla.
 */
describe('atribuce na jazykových homepage', () => {
  const ROW = {
    id: 'a1',
    title: 'Test',
    slug: 'test',
    perex: 'Perex',
    featured_image_url: '/images/telata.webp',
    featured_image_credit: null,
    focal_point: null,
    category: 'novinky',
    tags: [],
    published_at: '2026-09-01T00:00:00Z',
    featured: true,
  };

  function fakeClient() {
    const builder = (table: string) => {
      const result =
        table === 'article_translations'
          ? { data: [{ article_id: 'a1', title: 'Test', perex: 'Perex', content: '<p>x</p>' }] }
          : { data: [ROW] };
      const chain: Record<string, unknown> = {
        then: (resolve: (v: unknown) => unknown) => Promise.resolve(result).then(resolve),
      };
      for (const m of ['select', 'eq', 'in', 'order', 'limit', 'not', 'is', 'neq', 'gte', 'lte', 'filter']) {
        chain[m] = () => chain;
      }
      return chain;
    };
    return { from: builder };
  }

  // Všech pět jazykových mutací — cs verze blok měla, ostatní čtyři si
  // `PhotoCredits.astro` vůbec neimportovaly.
  for (const [name, path] of [
    ['HomePl', '../../src/components/home/HomePl.astro'],
    ['HomeSk', '../../src/components/home/HomeSk.astro'],
    ['HomeUk', '../../src/components/home/HomeUk.astro'],
    ['HomeDe', '../../src/components/home/HomeDe.astro'],
  ] as const) {
    it(`${name} — hero mřížka má blok „Fotografie"`, async () => {
      vi.resetModules();
      vi.doMock('../../src/lib/supabase', () => ({
        createAnonClient: () => fakeClient(),
        createServerClient: () => fakeClient(),
        getPublicSupabaseConfig: () => ({ url: 'http://localhost', anonKey: 'test' }),
      }));
      const Home = (await import(/* @vite-ignore */ path)).default;
      const html = await render(Home, { request: new Request('https://agro-svet.cz/pl/') });
      expectUsableCreditBlock(html, name);
      vi.doUnmock('../../src/lib/supabase');
    });
  }
});

/**
 * Kredit schovaný stylopisem.
 *
 * Astro scoped CSS se do vyrenderovaného HTML nedostane (skončí v samostatném
 * balíku), takže tohle je jediné místo, kde na něj v testu vidíme — čte se
 * zdroják. Dlaždice v `CategoryBrowse.astro` měly kredit s `opacity: 0`
 * a `.family-tile:hover .ft-credit{opacity:1}`: atribuci viděl jen návštěvník
 * s myší, na dotykovém displeji nikdo.
 */
describe('kredit nesmí být schovaný stylopisem', () => {
  const HIDE = /(^|;)(opacity:0(?![.\d])|display:none|visibility:hidden)/;

  function astroFiles(dir: string, out: string[] = []): string[] {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) astroFiles(p, out);
      else if (e.name.endsWith('.astro')) out.push(p);
    }
    return out;
  }

  it('žádné pravidlo pro .*credit* nenastavuje opacity:0 / display:none', () => {
    const nalezy: string[] = [];
    for (const file of astroFiles(join(import.meta.dirname, '../../src'))) {
      const src = readFileSync(file, 'utf8');
      for (const style of src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
        for (const rule of style[1]!.matchAll(/([^{}]*credit[^{}]*)\{([^}]*)\}/gi)) {
          const selector = rule[1]!.trim();
          // Zvýrazněný / prázdný stav se schovat smí — skrytý je jen ten
          // výchozí, na který se návštěvník dívá bez interakce.
          if (/:hover|:focus|:empty|:not\(/.test(selector)) continue;
          if (HIDE.test(rule[2]!.replace(/\s+/g, ''))) {
            nalezy.push(`${relative(join(import.meta.dirname, '../..'), file)} → ${selector}`);
          }
        }
      }
    }
    expect(nalezy, nalezy.join('\n')).toHaveLength(0);
  });
});
