// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { GET as forecastGET } from '../../src/pages/api/weather/forecast';
import { GET as stripGET } from '../../src/pages/api/weather/strip';
import { __resetMetForTesting } from '../../src/lib/met-norway';
import { __clearCacheForTesting } from '../../src/lib/runtime-cache';

// Úkol 09db5c97: počasí jde jen přes náš server k MET Norway. Prohlížeč
// nevolá žádnou třetí službu a Open-Meteo (free = jen nekomerčně) v kódu není.

function metBody() {
  const start = Date.parse('2026-07-01T04:00:00Z');
  const timeseries = Array.from({ length: 60 }, (_, i) => ({
    time: new Date(start + i * 3_600_000).toISOString().replace('.000', ''),
    data: {
      instant: { details: { air_temperature: 15, wind_speed: 2, relative_humidity: 60 } },
      next_1_hours: { summary: { symbol_code: 'fair_day' }, details: { precipitation_amount: 0 } },
      next_6_hours: { summary: { symbol_code: 'fair_day' }, details: { precipitation_amount: 0 } },
    },
  }));
  return { properties: { meta: { updated_at: '2026-07-01T03:00:00Z' }, timeseries } };
}

const ctx = (url: string, ip = '203.0.113.7') =>
  ({ request: new Request(url), url: new URL(url), locals: {}, clientAddress: ip }) as any;

describe('/api/weather/forecast/', () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    __resetMetForTesting();
    __clearCacheForTesting();
    fetchMock = vi.fn(async () => new Response(JSON.stringify(metBody()), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
  });
  afterEach(() => vi.unstubAllGlobals());

  it.each([
    '', '?lat=50', '?lat=&lon=14', '?lat=abc&lon=14', '?lat=91&lon=14', '?lat=50&lon=181',
  ])('špatné souřadnice %s → 400 bez volání MET', async (q) => {
    const res = await forecastGET(ctx(`https://agro-svet.cz/api/weather/forecast/${q}`));
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('k MET jdou souřadnice zaokrouhlené na ~1 km; soused trefí cache', async () => {
    const res = await forecastGET(ctx('https://agro-svet.cz/api/weather/forecast/?lat=50.123456&lon=14.987654'));
    expect(res.status).toBe(200);
    expect(res.headers.get('cache-control')).toContain('s-maxage=1800');
    const j = await res.json();
    expect(j.forecast.daily.dates.length).toBeGreaterThan(0);
    expect(j.forecast).toHaveProperty('place');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0][0])).toMatch(/[?&]lat=50\.12&lon=14\.99$/);

    const again = await forecastGET(ctx('https://agro-svet.cz/api/weather/forecast/?lat=50.1249&lon=14.9851'));
    expect(again.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('MET nedostupné → 503 a nic se necacheuje', async () => {
    fetchMock.mockImplementation(async () => new Response('{}', { status: 500 }));
    const res = await forecastGET(ctx('https://agro-svet.cz/api/weather/forecast/?lat=48&lon=17'));
    expect(res.status).toBe(503);
    expect(res.headers.get('cache-control')).toBe('no-store');
  });

  it('jedna IP smí mimo cache jen 20 dotazů za 10 min', async () => {
    let last: Response | undefined;
    for (let i = 0; i < 21; i++) {
      last = await forecastGET(ctx(`https://agro-svet.cz/api/weather/forecast/?lat=${40 + i}&lon=10`, '198.51.100.9'));
    }
    expect(last!.status).toBe(429);
  });
});

describe('/api/weather/strip/', () => {
  beforeEach(() => {
    __resetMetForTesting();
    __clearCacheForTesting();
  });
  afterEach(() => vi.unstubAllGlobals());

  it('MET nedostupné → 503 no-store (ne prázdný seznam na 30 min)', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 503 })));
    const res = await stripGET(ctx('https://agro-svet.cz/api/weather/strip/'));
    expect(res.status).toBe(503);
    expect(res.headers.get('cache-control')).toBe('no-store');
  });
});

describe('žádné Open-Meteo, prohlížeč nevolá cizí počasí', () => {
  const root = join(__dirname, '../..');
  const walk = (dir: string): string[] =>
    readdirSync(dir).flatMap((f) => {
      const p = join(dir, f);
      return statSync(p).isDirectory() ? walk(p) : [p];
    });

  it('src/ a scripts/ neobsahují domény Open-Meteo', () => {
    const hits = [...walk(join(root, 'src')), ...walk(join(root, 'scripts'))]
      .filter((p) => /\.(astro|ts|tsx|js|mjs|json)$/.test(p))
      .filter((p) => /open-meteo\.com/.test(readFileSync(p, 'utf8')));
    expect(hits).toEqual([]);
  });

  it('widget fetchuje jen vlastní /api/weather/* a nikdy api.met.no', () => {
    const w = readFileSync(join(root, 'src/components/HomeWeather.astro'), 'utf8');
    const fetches = [...w.matchAll(/fetch\(\s*'([^']*)'/g)].map((m) => m[1]);
    expect(fetches.length).toBeGreaterThanOrEqual(3);
    for (const u of fetches) expect(u).toMatch(/^\/api\/weather\//);
    expect(w).not.toMatch(/fetch\([^)]*api\.met\.no/);
  });

  it('zásady: Open-Meteo pryč, MET Norway ve všech 5 jazycích jako služba volaná serverem', () => {
    const z = readFileSync(join(root, 'src/pages/zpracovani-osobnich-udaju.astro'), 'utf8');
    expect(z).not.toMatch(/Open-Meteo/);
    expect(z.match(/<strong>MET Norway<\/strong>/g)?.length).toBe(5);
    // MET dostane jen zaokrouhlené souřadnice, ne IP návštěvníka
    expect(z.match(/1 (km|км)/g)?.length).toBe(5);
  });
});
