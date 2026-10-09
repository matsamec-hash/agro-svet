import { describe, it, expect, vi } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { creditFor, requiresAuthor } from '../../src/lib/photo-credit';
import { machines } from '../../src/lib/historie';

// Stránka značky se ptá kolekce `znacky`, jestli má redakční profil — pro
// atribuci fotek je to jedno, tak ji tu nahradíme prázdnou.
vi.mock('astro:content', async (orig) => ({ ...(await orig<Record<string, unknown>>()), getCollection: async () => [] }));

/**
 * Rohatka atribuce nad šablonami, které 23. 9. 2026 propadly.
 *
 * Kontrola všech 33 506 živých stránek (7. 10. 2026) našla 145 fotek bez
 * jediného kreditu — a všechny byly v šablonách, kde fotka není „hlavní":
 * dlaždice řad na stránce značky (fotka jen jako CSS pozadí), miniatury plodin
 * v kalendáři, náhledy souvisejících strojů v historii. Registr kreditů o nich
 * věděl, jen je nikdo nevykreslil. K tomu odznak u hero fotky strojů odkazoval
 * jen na Commons, ne na text licence — CC 2.0 a 3.0 ten odkaz chtějí výslovně.
 *
 * Test proto bere KAŽDÝ obrázek, který šablona vykreslí (`<img src>` i
 * `background-image`), a chce, aby u licencí s povinnou atribucí bylo
 * v HTML vidět jméno autora i odkaz na text licence.
 */

async function render(mod: unknown, opts: Record<string, unknown> = {}): Promise<string> {
  const container = await AstroContainer.create();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return container.renderToString(mod as any, opts as any);
}

/** Viditelný obsah: bez <style>, <script> a JSON-LD. */
function visible(html: string): string {
  return html.replace(/<style[\s\S]*?<\/style>/g, '').replace(/<script[\s\S]*?<\/script>/g, '');
}

function imagesOf(html: string): string[] {
  const body = visible(html);
  const out = new Set<string>();
  for (const m of body.matchAll(/<img[^>]+src="([^"]+)"/g)) out.add(m[1]!);
  for (const m of body.matchAll(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/g)) out.add(m[1]!);
  return [...out].filter((s) => !s.endsWith('.svg') && !s.startsWith('data:'));
}

const decode = (s: string) => s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');

/** Každá fotka s povinnou atribucí musí mít na stránce autora a odkaz na licenci. */
function expectEveryPhotoCredited(html: string, where: string) {
  const text = decode(visible(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
  const hrefs = new Set([...visible(html).matchAll(/href="([^"]+)"/g)].map((m) => decode(m[1]!)));
  const imgs = imagesOf(html);
  expect(imgs.length, `${where} — šablona nevykreslila žádnou fotku, test by nic nehlídal`).toBeGreaterThan(0);
  let checked = 0;
  for (const img of imgs) {
    const c = creditFor(img);
    expect(c, `${where} — ${img} nemá v registru kredit`).toBeTruthy();
    if (!requiresAuthor(c!.license)) continue;
    checked++;
    expect(text, `${where} — u ${img} chybí jméno autora „${c!.author}"`).toContain(c!.author);
    if (c!.licenseUrl) {
      expect(hrefs.has(c!.licenseUrl), `${where} — u ${img} chybí odkaz na text licence ${c!.licenseUrl}`).toBe(true);
    }
  }
  expect(checked, `${where} — žádná fotka s povinnou atribucí, test nic neověřil`).toBeGreaterThan(0);
}

const req = (path: string) => new Request(`https://agro-svet.cz${path}`);

describe('atribuce v šablonách s miniaturami', () => {
  it('/stroje/amazone/ — dlaždice řad a hero fotka', async () => {
    const Page = (await import('../../src/pages/stroje/[brand]/index.astro')).default;
    const html = await render(Page, { params: { brand: 'amazone' }, locals: { locale: 'cs' }, request: req('/stroje/amazone/') });
    expectEveryPhotoCredited(html, '/stroje/amazone/');
  }, 30_000);

  it('/pl/stroje/amazone/ — totéž v jazykové mutaci', async () => {
    const Page = (await import('../../src/pages/stroje/[brand]/index.astro')).default;
    const html = await render(Page, { params: { brand: 'amazone' }, locals: { locale: 'pl' }, request: req('/pl/stroje/amazone/') });
    expectEveryPhotoCredited(html, '/pl/stroje/amazone/');
  }, 30_000);

  it('/stroje/amazone/cataya/cataya-3000-super/ — odznak hero fotky odkazuje na licenci', async () => {
    const Page = (await import('../../src/pages/stroje/[brand]/[series]/[model]/index.astro')).default;
    const html = await render(Page, {
      params: { brand: 'amazone', series: 'cataya', model: 'cataya-3000-super' },
      locals: { locale: 'cs' },
      request: req('/stroje/amazone/cataya/cataya-3000-super/'),
    });
    const badge = html.match(/class="hero-photo-credit"[\s\S]*?<\/div>/)?.[0] ?? '';
    expect(badge, 'hero fotka bez odznaku s kreditem').toMatch(/©/);
    expect(badge, 'odznak bez odkazu na text licence').toMatch(/https:\/\/creativecommons\.org\/licenses\//);
  }, 30_000);

  it('/sezona/kalendar/ — miniatury plodin', async () => {
    const Page = (await import('../../src/pages/sezona/kalendar/index.astro')).default;
    const html = await render(Page, { locals: { locale: 'cs' }, request: req('/sezona/kalendar/') });
    expectEveryPhotoCredited(html, '/sezona/kalendar/');
  }, 30_000);

  it('/historie/technika/<stroj>/ — náhledy další techniky', async () => {
    const m = machines.find((x) => x.image)!;
    const Page = (await import('../../src/pages/historie/technika/[slug].astro')).default;
    const html = await render(Page, { params: { slug: m.slug }, locals: { locale: 'cs' }, request: req(`/historie/technika/${m.slug}/`) });
    expectEveryPhotoCredited(html, `/historie/technika/${m.slug}/`);
  }, 30_000);
});
