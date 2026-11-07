// tests/lib/rss-seznam-routes.test.ts
// Routy /rss-seznam.xml a /rss-seznam/<slug>.jpg. Databáze a síť jsou tu falešné,
// převod obrázku je opravdový sharp: právě kvůli němu feed existuje.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const db = vi.hoisted(() => ({ result: { data: null as unknown, error: null as unknown } }));

vi.mock('../../src/lib/supabase', () => ({
  createAnonClient: () => {
    const chain: Record<string, unknown> = {};
    for (const m of ['from', 'select', 'eq', 'order', 'limit']) chain[m] = () => chain;
    chain.maybeSingle = async () => db.result;
    chain.then = (ok: (v: unknown) => unknown) => Promise.resolve(db.result).then(ok);
    return chain;
  },
}));

const { GET: feedGET } = await import('../../src/pages/rss-seznam.xml.ts');
const { GET: imageGET } = await import('../../src/pages/rss-seznam/[slug].jpg.ts');

const ctx = (locale: string, path = '/rss-seznam.xml') =>
  ({ locals: { locale }, params: {}, url: new URL(`https://agro-svet.cz${path}`) }) as never;

// ‼️ params: {} je schválně. Middleware na routu přepisuje přes next() a Astro pak
// endpointu předá params ještě z původní cesty, která žádné neměla. Ověřeno na buildu.
const IMAGE_PATH = '/rss-seznam/clanek.jpg';

const row = {
  slug: 'clanek',
  title: 'Titulek článku',
  seo_title: null,
  perex: 'Perex je celá věta.',
  seo_description: null,
  published_at: '2026-10-27T11:10:24Z',
  category: 'technika',
  featured_image_url: 'https://cdn.samecdigital.com/a__v-w1600.webp',
  featured_image_credit: null,
};

beforeEach(() => {
  db.result = { data: null, error: null };
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('/rss-seznam.xml', () => {
  it('vrací RSS s položkami', async () => {
    db.result = { data: [row], error: null };
    const res = await feedGET(ctx('cs'));
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toContain('application/rss+xml');
    expect(await res.text()).toContain('<title>Titulek článku</title>');
  });

  it('je jen česky, /sk/rss-seznam.xml je 404', async () => {
    db.result = { data: [row], error: null };
    expect((await feedGET(ctx('sk', '/sk/rss-seznam.xml'))).status).toBe(404);
  });

  it('chyba databáze není prázdný feed, ale 503 bez cache', async () => {
    db.result = { data: null, error: { message: 'down' } };
    const res = await feedGET(ctx('cs'));
    expect(res.status).toBe(503);
    expect(res.headers.get('Cache-Control')).toBe('no-store');
  });
});

describe('/rss-seznam/<slug>.jpg', () => {
  it('z webp 16:10 udělá JPG 800×450', async () => {
    const webp = await sharp({ create: { width: 1600, height: 1000, channels: 3, background: '#3a7' } }).webp().toBuffer();
    const fetchMock = vi.fn(async (_url: string) => new Response(new Uint8Array(webp), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    db.result = { data: { featured_image_url: row.featured_image_url, focal_point: null }, error: null };

    const res = await imageGET(ctx('cs', IMAGE_PATH));

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('image/jpeg');
    expect(res.headers.get('Cache-Control')).toContain('public');
    const meta = await sharp(Buffer.from(await res.arrayBuffer())).metadata();
    expect(meta).toMatchObject({ format: 'jpeg', width: 800, height: 450 });
    expect(fetchMock.mock.calls[0][0]).toBe(row.featured_image_url);
  });

  it('průhledné pozadí PNG nezčerná', async () => {
    const png = await sharp({ create: { width: 800, height: 450, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).png().toBuffer();
    vi.stubGlobal('fetch', vi.fn(async () => new Response(new Uint8Array(png), { status: 200 })));
    db.result = { data: { featured_image_url: row.featured_image_url, focal_point: null }, error: null };

    const res = await imageGET(ctx('cs', IMAGE_PATH));
    const { data } = await sharp(Buffer.from(await res.arrayBuffer())).raw().toBuffer({ resolveWithObject: true });
    expect(data[0]).toBeGreaterThan(240);
  });

  it('neznámý nebo nezveřejněný článek je 404', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    expect((await imageGET(ctx('cs', '/rss-seznam/neni.jpg'))).status).toBe(404);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('obrázek z cizí adresy nestáhne', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    db.result = { data: { featured_image_url: 'http://169.254.169.254/x', focal_point: null }, error: null };
    expect((await imageGET(ctx('cs', IMAGE_PATH))).status).toBe(404);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('zástupný obrázek s logem nevydá', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    db.result = { data: { featured_image_url: 'https://agro-svet.cz/images/novinky/dotace-49-75.jpg', focal_point: null }, error: null };
    expect((await imageGET(ctx('cs', IMAGE_PATH))).status).toBe(404);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('výpadek zdroje je 502 bez cache, ne rozbitý obrázek', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('x', { status: 500 })));
    db.result = { data: { featured_image_url: row.featured_image_url, focal_point: null }, error: null };
    const res = await imageGET(ctx('cs', IMAGE_PATH));
    expect(res.status).toBe(502);
    expect(res.headers.get('Cache-Control')).toBe('no-store');
  });

  it('jiný jazyk je 404', async () => {
    db.result = { data: { featured_image_url: row.featured_image_url, focal_point: null }, error: null };
    expect((await imageGET(ctx('sk', '/sk/rss-seznam/clanek.jpg'))).status).toBe(404);
  });

  it('adresa s lomítkem na konci vrátí totéž', async () => {
    const webp = await sharp({ create: { width: 800, height: 450, channels: 3, background: '#3a7' } }).webp().toBuffer();
    vi.stubGlobal('fetch', vi.fn(async () => new Response(new Uint8Array(webp), { status: 200 })));
    db.result = { data: { featured_image_url: row.featured_image_url, focal_point: null }, error: null };
    expect((await imageGET(ctx('cs', `${IMAGE_PATH}/`))).status).toBe(200);
  });
});

describe('adresa obrázku končí .jpg, ne .jpg/', () => {
  // Dynamická routa se s `trailingSlash: 'always'` otevře jen s lomítkem na konci
  // (viz sectionSitemapRoute). Ověřeno na buildu: bez přepisu v middleware je to 404.
  const middleware = fs.readFileSync(path.join(process.cwd(), 'src/middleware.ts'), 'utf8');

  it('middleware přepisuje /rss-seznam/<slug>.jpg na routu s lomítkem', () => {
    const rule = middleware.match(/SEZNAM_IMAGE_PATH = (\/.*\/);/)?.[1];
    expect(rule, 'chybí pravidlo SEZNAM_IMAGE_PATH').toBeTruthy();
    const re = new RegExp(rule!.slice(1, -1));
    expect(re.test('/rss-seznam/clanek-1.jpg')).toBe(true);
    expect(re.test('/rss-seznam/clanek-1.jpg/')).toBe(false);
    expect(re.test('/sk/rss-seznam/clanek-1.jpg')).toBe(false);
    expect(re.test('/rss-seznam/a/b.jpg')).toBe(false);
    expect(middleware).toContain('if (SEZNAM_IMAGE_PATH.test(url.pathname)) return next(`${url.pathname}/`);');
  });
});
