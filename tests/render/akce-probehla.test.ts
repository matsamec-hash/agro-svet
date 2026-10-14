import { describe, it, expect, vi, afterEach } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';

/**
 * Proběhlá akce = 200 s označením a odkazem na další ročník, ne 404.
 * Do 14. 10. 2026 detail četl jen stav 'zverejneno', takže po termínu
 * spadla na 404 i nejnavštěvovanější stránka webu (Den zemědělce Kámen).
 */
vi.setConfig({ testTimeout: 20_000 });

const BASE = {
  typ: 'vystava', druh: 'jednorazova', konec: null, dny_v_tydnu: null, cas_od: null, cas_do: null,
  plati_od: null, plati_do: null, misto_nazev: null, adresa: null, obec: 'Kámen', kraj_slug: 'vysocina',
  okres_slug: 'pelhrimov', poradatel: null, web: 'https://denzemedelce.cz/', telefon: null, email: 'x@example.cz',
  popis: 'Polní dny se strojovou expozicí.', cena: null, zdroj: 'kurator', lat: null, lng: null,
  pristi_vyskyt: null, foto_path: null, created_at: '2026-01-01T00:00:00Z', zverejneno_at: null,
};
const R2026 = { ...BASE, id: 'a', slug: 'den-zemedelce-kamen-2026', nazev: 'Den zemědělce 2026', stav: 'probehla', zacatek: '2026-09-13T07:00:00+00:00' };
const R2027 = { ...BASE, id: 'b', slug: 'den-zemedelce-kamen-2027', nazev: 'Den zemědělce 2027', stav: 'zverejneno', zacatek: '2027-09-12T07:00:00+00:00', pristi_vyskyt: '2027-09-12T07:00:00+00:00' };

async function render(rocniky: unknown[], opts: { chybi?: boolean; nahrada?: unknown } = {}) {
  vi.resetModules();
  vi.doMock('../../src/lib/akce-supabase', () => ({
    getBySlug: async () => (opts.chybi ? null : R2026),
    nahradniRocnik: async () => opts.nahrada ?? null,
    listRocniky: async () => rocniky,
    listRelated: async () => [],
    getAkceImages: async () => [],
  }));
  const page = (await import('../../src/pages/akce/[slug].astro')).default;
  const container = await AstroContainer.create();
  // Astro.rewrite('/404') potřebuje v kontejneru routu, jinak hodí výjimku.
  container.insertPageRoute('/404', (await import('../../src/pages/404.astro')).default);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return container.renderToResponse(page as any, {
    params: { slug: R2026.slug },
    locals: { locale: 'cs', localizedPathname: `/akce/${R2026.slug}/` },
    request: new Request(`https://agro-svet.cz/akce/${R2026.slug}/`),
  } as any);
}

afterEach(() => vi.doUnmock('../../src/lib/akce-supabase'));

describe('proběhlá akce', () => {
  it('vrací 200, říká že proběhla a vede na další ročník', async () => {
    const res = await render([R2026, R2027]);
    const html = await res.text();
    expect(res.status).toBe(200);
    expect(html).toContain('Tato akce už proběhla');
    expect(html).toContain('href="/akce/den-zemedelce-kamen-2027/"');
    expect(html).toContain('Další ročníky');
    expect(html).not.toContain('id="ad-countdown"');
    expect(html).not.toContain('id="ics-btn"');
  });

  it('bez dalšího ročníku odkáže na web pořadatele, nic si nevymýšlí', async () => {
    const html = await (await render([R2026])).text();
    expect(html).toContain('Termín dalšího ročníku pořadatel zatím nezveřejnil');
    expect(html).toContain('href="https://denzemedelce.cz/"');
    expect(html).not.toContain('Další ročníky');
  });

  it('ročník, který z webu zmizel, přesměruje 301 na jiný ročník téže akce', async () => {
    const res = await render([], { chybi: true, nahrada: R2027 });
    expect(res.status).toBe(301);
    expect(res.headers.get('location')).toBe('/akce/den-zemedelce-kamen-2027/');
  });

  it('bez náhradního ročníku zůstává 404', async () => {
    const res = await render([], { chybi: true });
    expect(res.status).toBe(404);
  });
});
