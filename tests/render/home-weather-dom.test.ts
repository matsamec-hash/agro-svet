import { describe, it, expect, vi, afterEach } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { Window } from 'happy-dom';
import {
  fetchAgroWeather,
  fetchCityStrip,
  fetchPointForecast,
  __resetMetForTesting,
} from '../../src/lib/met-norway';

// Inline skript HomeWeather nad skutečným tvarem odpovědí /api/weather/*
// (vyrobených z lib/met-norway nad falešnou odpovědí MET). Hlídá, že klient
// po přechodu z Open-Meteo čte nová pole a volá jen náš server.

vi.setConfig({ testTimeout: 20_000 });

function metBody() {
  const start = Date.now() - 30 * 60_000;
  const first = start - (start % 3_600_000);
  const timeseries = Array.from({ length: 200 }, (_, i) => ({
    time: new Date(first + i * 3_600_000).toISOString().replace('.000', ''),
    data: {
      instant: { details: { air_temperature: i % 24 < 12 ? -1.4 : 8.6, wind_speed: 4, relative_humidity: 77.4 } },
      next_1_hours: { summary: { symbol_code: i % 7 ? 'partlycloudy_day' : 'lightrain' }, details: { precipitation_amount: i % 7 ? 0 : 0.4 } },
      next_6_hours: { summary: { symbol_code: 'cloudy' }, details: { precipitation_amount: 1 } },
    },
  }));
  return { properties: { meta: { updated_at: new Date(first).toISOString() }, timeseries } };
}

async function renderMode(mode: 'strip' | 'puda' | 'commodity'): Promise<string> {
  const comp = await import('../../src/components/HomeWeather.astro');
  const container = await AstroContainer.create();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return container.renderToString(comp.default as any, {
    props: { mode },
    locals: { locale: 'cs' },
    request: new Request('https://agro-svet.cz/'),
  } as any);
}

afterEach(() => vi.unstubAllGlobals());

describe('HomeWeather — klientský skript nad MET daty', () => {
  it('pás měst, karty Půda a Plodiny i „Moje pole" se vyplní; volá se jen /api/weather/*', async () => {
    __resetMetForTesting();
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(metBody()), { status: 200 })));
    const payloads: Record<string, unknown> = {
      '/api/weather/strip/': { cities: await fetchCityStrip() },
      '/api/weather/agro/': { agro: await fetchAgroWeather() },
      '/api/weather/forecast/': { forecast: await fetchPointForecast(50.08, 14.43) },
    };
    vi.unstubAllGlobals();

    const html = (await renderMode('puda')) + (await renderMode('commodity')) + (await renderMode('strip'));
    const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
    expect(script, 'chybí inline skript').toBeTruthy();

    const win = new Window({ url: 'https://agro-svet.cz/' });
    const doc = win.document;
    doc.body.innerHTML = html.replace(/<script>[\s\S]*?<\/script>/g, '');
    win.localStorage.setItem('aw-user-loc-v1', JSON.stringify({ lat: 50.081234, lon: 14.427654, name: null, ts: Date.now() }));

    const urls: string[] = [];
    const fakeFetch = async (url: string) => {
      urls.push(url);
      const key = url.split('?')[0];
      const body = payloads[key];
      return { ok: !!body, json: async () => body };
    };
    // Skript čeká na load + idle; tady ho pustíme rovnou.
    const run = new Function('window', 'document', 'fetch', 'localStorage', 'navigator', script!);
    const fakeWindow = { addEventListener: (_: string, cb: () => void) => cb() } as Record<string, unknown>;
    Object.defineProperty(doc, 'readyState', { value: 'loading', configurable: true });
    run(fakeWindow, doc, fakeFetch, win.localStorage, win.navigator);
    await new Promise((r) => setTimeout(r, 50));

    expect(urls.length).toBeGreaterThanOrEqual(3);
    for (const u of urls) expect(u).toMatch(/^\/api\/weather\/(strip|agro|forecast)\//);
    // poloha jde i k nám jen zaokrouhlená na ~1 km
    expect(urls).toContain('/api/weather/forecast/?lat=50.08&lon=14.43');

    const puda = doc.querySelector('[data-aw-puda-card]')!;
    expect(puda.hasAttribute('hidden')).toBe(false);
    const pudaText = puda.textContent ?? '';
    expect(puda.querySelectorAll('.aw-metric')).toHaveLength(6);
    expect(pudaText).toContain('Srážky · příštích 24 h');
    expect(pudaText).toContain('Střed Česka');
    expect(pudaText).not.toMatch(/NaN|undefined|Infinity|vlhkost 0–3 cm|7 dní zpět/);

    const crops = doc.querySelector('[data-aw-commodity-card]')!;
    expect(crops.hasAttribute('hidden')).toBe(false);
    expect(crops.querySelectorAll('.aw-sum-cell')).toHaveLength(4);
    expect(crops.querySelectorAll('.aw-day')).toHaveLength(7);
    expect(crops.textContent ?? '').toContain('dnů s deštěm');
    expect(crops.textContent ?? '').not.toMatch(/NaN|undefined|Infinity|h slunce/);

    const strip = doc.querySelector('[data-aw-strip-lazy]')!;
    expect(strip.hasAttribute('hidden')).toBe(false);
    expect(strip.querySelectorAll('.aw-city')).toHaveLength(6);
    // uložená poloha → rovnou 5denní předpověď „Moje pole"
    expect(strip.querySelectorAll('.aw-day5')).toHaveLength(5);
    expect(strip.querySelector('[data-aw-title]')!.textContent).toBe('Vaše pole · Praha');
    expect(strip.textContent ?? '').not.toMatch(/NaN|undefined/);
    await win.happyDOM.close();
  });
});
