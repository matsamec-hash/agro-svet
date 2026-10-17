// @vitest-environment node
// (node: skutečné undici Response/Headers jako v produkci)
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  metSymbolToWmo,
  summarizeForecast,
  getLocationforecast,
  fetchCityStrip,
  fetchAgroWeather,
  fetchPointForecast,
  nearestPlace,
  roundCoord,
  CZECH_CITIES,
  MET_ENDPOINT,
  __resetMetForTesting,
  type MetCompact,
  type MetTimestep,
} from '../../src/lib/met-norway';

// Úkol 09db5c97: Open-Meteo (free = jen nekomerčně) → MET Norway.
// Žádná síť: fetch je vždy mock.

const HOUR = 3_600_000;

interface StepOpts {
  temp: number;
  wind?: number;
  rh?: number;
  p1?: number;
  s1?: string;
  p6?: number;
  s6?: string;
}

function step(ms: number, o: StepOpts): MetTimestep {
  const data: MetTimestep['data'] = {
    instant: { details: { air_temperature: o.temp, wind_speed: o.wind ?? 3, relative_humidity: o.rh ?? 70 } },
  };
  if (o.p1 !== undefined) data.next_1_hours = { summary: { symbol_code: o.s1 ?? 'cloudy' }, details: { precipitation_amount: o.p1 } };
  if (o.p6 !== undefined) data.next_6_hours = { summary: { symbol_code: o.s6 ?? 'fair_day' }, details: { precipitation_amount: o.p6 } };
  return { time: new Date(ms).toISOString().replace('.000', ''), data };
}

/** Místní hodina v Praze v červenci (UTC+2). */
const localHour = (ms: number) => (new Date(ms).getUTCHours() + 2) % 24;

/**
 * Tvar jako skutečná odpověď MET: hodinové kroky (20Z 1. 7. → 11Z 4. 7.),
 * pak šestihodinové (12Z 4. 7. → 18Z 9. 7.) a poslední krok jen s instant.
 * Teplota = 10 + místní hodina / 2. Hodinové srážky 0,1 mm, šestihodinové
 * 1,2 mm. Hodinové kroky mají i next_6_hours s „jedovatými" 9,9 mm — kdyby
 * se sčítaly dvakrát, součty ujedou.
 */
function buildSeries(): MetCompact {
  const ts: MetTimestep[] = [];
  const start = Date.parse('2026-07-01T20:00:00Z');
  const hourlyEnd = Date.parse('2026-07-04T11:00:00Z');
  const symbol6 = (ms: number): string => {
    const iso = new Date(ms).toISOString();
    if (iso.startsWith('2026-07-03T12')) return 'heavyrainshowersandthunder_day';
    if (iso.startsWith('2026-07-05T06')) return 'snow';
    if (iso.startsWith('2026-07-05T12')) return 'cloudy';
    return 'fair_day';
  };
  for (let t = start; t <= hourlyEnd; t += HOUR) {
    ts.push(step(t, {
      temp: 10 + localHour(t) / 2,
      wind: t === start ? 2.5 : 3,
      rh: t === start ? 81.6 : 70,
      p1: 0.1,
      s1: t === start ? 'lightrain' : 'clearsky_night',
      p6: 9.9,
      s6: symbol6(t),
    }));
  }
  const sixEnd = Date.parse('2026-07-09T18:00:00Z');
  for (let t = hourlyEnd + HOUR; t <= sixEnd; t += 6 * HOUR) {
    ts.push(step(t, { temp: 10 + localHour(t) / 2, p6: 1.2, s6: symbol6(t) }));
  }
  ts.push(step(sixEnd + 6 * HOUR, { temp: 12 }));
  return { properties: { meta: { updated_at: '2026-07-01T19:30:00Z' }, timeseries: ts } };
}

function metResponse(body: unknown, init: { status?: number; lastModified?: string; expires?: number } = {}): Response {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (init.lastModified) headers['last-modified'] = init.lastModified;
  if (init.expires) headers.expires = new Date(init.expires).toUTCString();
  const status = init.status ?? 200;
  return new Response(status === 304 ? null : JSON.stringify(body), { status, headers });
}

describe('symboly MET → kódy ikon widgetu', () => {
  it.each([
    ['clearsky_day', 0], ['clearsky_night', 0], ['fair_polartwilight', 1], ['partlycloudy_day', 2],
    ['cloudy', 3], ['fog', 45],
    ['lightrain', 61], ['rain', 63], ['heavyrain', 65],
    ['lightrainshowers_day', 80], ['rainshowers_night', 81], ['heavyrainshowers_day', 82],
    ['lightsleet', 68], ['sleetshowers_day', 68], ['heavysleet', 69],
    ['lightsnow', 71], ['snowshowers_day', 73], ['heavysnow', 75],
    ['rainandthunder', 95], ['lightssleetshowersandthunder_day', 95], ['heavyrainshowersandthunder_night', 99],
  ])('%s → %i', (sym, code) => {
    expect(metSymbolToWmo(sym)).toBe(code);
  });

  it('neznámý nebo chybějící symbol → -1 (widget ukáže 🌡️ —)', () => {
    expect(metSymbolToWmo('neco_noveho')).toBe(-1);
    expect(metSymbolToWmo(undefined)).toBe(-1);
  });
});

describe('summarizeForecast', () => {
  const now = Date.parse('2026-07-01T20:30:00Z');
  const s = summarizeForecast(buildSeries(), { days: 7, now })!;

  it('aktuální stav z prvního kroku (m/s → km/h, vlhkost, symbol z next_1_hours)', () => {
    expect(s.current).toEqual({ tempC: 21, weatherCode: 61, windKmh: 9, humidity: 82 });
    expect(s.updatedAt).toBe('2026-07-01T19:30:00Z');
    expect(s.today).toBe('2026-07-01');
  });

  it('dnešek s méně než 6 h dat vypadne; dny jsou v místním čase', () => {
    expect(s.daily.dates).toEqual([
      '2026-07-02', '2026-07-03', '2026-07-04', '2026-07-05', '2026-07-06', '2026-07-07', '2026-07-08',
    ]);
  });

  it('srážky bez dvojího počítání (hodinové, pak šestihodinové bloky)', () => {
    expect(s.daily.precipMm).toEqual([2.4, 2.4, 3.8, 4.8, 4.8, 4.8, 4.8]);
    expect(s.next24hPrecipMm).toBe(2.4);
  });

  it('max/min z okamžitých teplot daného dne', () => {
    expect(s.daily.tempMax.slice(0, 4)).toEqual([22, 22, 20, 20]);
    expect(s.daily.tempMin.slice(0, 4)).toEqual([10, 10, 10, 11]);
  });

  it('symbol dne = nejhorší ze dvou denních šestihodinových bloků', () => {
    expect(s.daily.weatherCode.slice(0, 4)).toEqual([1, 99, 1, 73]);
  });

  it('počet dní se drží parametru; poslední neúplný den se nepočítá', () => {
    const all = summarizeForecast(buildSeries(), { days: 20, now })!;
    expect(all.daily.dates.at(-1)).toBe('2026-07-09');
    expect(summarizeForecast(buildSeries(), { days: 5, now })!.daily.dates).toHaveLength(5);
  });

  it('prázdná nebo rozbitá odpověď → null', () => {
    expect(summarizeForecast({ properties: { timeseries: [] } }, { days: 7 })).toBeNull();
    expect(summarizeForecast({} as MetCompact, { days: 7 })).toBeNull();
  });
});

describe('getLocationforecast — podmínky MET', () => {
  const body = buildSeries();
  let fetchMock: ReturnType<typeof vi.fn>;
  const T0 = Date.parse('2026-07-01T20:00:00Z');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(T0);
    __resetMetForTesting();
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('identifikační User-Agent, compact endpoint, souřadnice max. 4 desetinná místa', async () => {
    fetchMock.mockResolvedValueOnce(metResponse(body));
    await getLocationforecast(50.123456, 14.987654);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${MET_ENDPOINT}?lat=50.1235&lon=14.9877`);
    expect(MET_ENDPOINT).toBe('https://api.met.no/weatherapi/locationforecast/2.0/compact');
    const ua = (init.headers as Record<string, string>)['User-Agent'];
    expect(ua).toMatch(/^agro-svet\.cz\/1\.0 /);
    expect(ua).toContain('info@samecdigital.com');
    expect(roundCoord(49.123449)).toBe(49.1234);
  });

  it('před Expires (a aspoň 30 min) se nevolá znovu; pak If-Modified-Since = Last-Modified a 304', async () => {
    const lm = 'Wed, 01 Jul 2026 19:58:00 GMT';
    fetchMock.mockResolvedValueOnce(metResponse(body, { lastModified: lm, expires: T0 + 5 * 60_000 }));
    const first = await getLocationforecast(50, 14);

    vi.setSystemTime(T0 + 29 * 60_000); // Expires už prošel, 30 min ne
    expect(await getLocationforecast(50, 14)).toBe(first);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    vi.setSystemTime(T0 + 31 * 60_000);
    fetchMock.mockResolvedValueOnce(metResponse(null, { status: 304, expires: T0 + 80 * 60_000 }));
    expect(await getLocationforecast(50, 14)).toBe(first);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect((fetchMock.mock.calls[1][1].headers as Record<string, string>)['If-Modified-Since']).toBe(lm);

    // 304 posunul platnost na Expires z odpovědi (T0 + 80 min)
    vi.setSystemTime(T0 + 79 * 60_000);
    await getLocationforecast(50, 14);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('pozdější Expires se respektuje', async () => {
    fetchMock.mockResolvedValueOnce(metResponse(body, { expires: T0 + 50 * 60_000 }));
    await getLocationforecast(50, 14);
    vi.setSystemTime(T0 + 45 * 60_000);
    await getLocationforecast(50, 14);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    vi.setSystemTime(T0 + 51 * 60_000);
    fetchMock.mockResolvedValueOnce(metResponse(body, { expires: T0 + 90 * 60_000 }));
    await getLocationforecast(50, 14);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('souběžné dotazy na stejný bod = jedno volání', async () => {
    fetchMock.mockResolvedValue(metResponse(body));
    const [a, b] = await Promise.all([getLocationforecast(50, 14), getLocationforecast(50.00001, 14.00001)]);
    expect(a).toBe(b);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('výpadek MET → starší kopie (a ne další pokus hned), bez kopie null', async () => {
    fetchMock.mockResolvedValueOnce(metResponse(body));
    const first = await getLocationforecast(50, 14);
    vi.setSystemTime(T0 + 40 * 60_000);
    fetchMock.mockResolvedValueOnce(metResponse({}, { status: 500 }));
    expect(await getLocationforecast(50, 14)).toBe(first);
    await getLocationforecast(50, 14);
    expect(fetchMock).toHaveBeenCalledTimes(2);

    fetchMock.mockRejectedValueOnce(new Error('ECONNRESET'));
    expect(await getLocationforecast(49, 16)).toBeNull();
  });

  it('429 → minutu se k MET vůbec nevolá', async () => {
    fetchMock.mockResolvedValueOnce(metResponse({}, { status: 429 }));
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(await getLocationforecast(50, 14)).toBeNull();
    expect(await getLocationforecast(49, 16)).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    vi.setSystemTime(T0 + 61_000);
    fetchMock.mockResolvedValueOnce(metResponse(body));
    expect(await getLocationforecast(49, 16)).not.toBeNull();
    warn.mockRestore();
  });

  it('strop: nejvýš 10 požadavků za sekundu (MET: < 20 req/s za celou aplikaci)', async () => {
    fetchMock.mockImplementation(async () => metResponse(body));
    const all = Promise.all(Array.from({ length: 12 }, (_, i) => getLocationforecast(40 + i, 10)));
    await vi.advanceTimersByTimeAsync(0);
    expect(fetchMock).toHaveBeenCalledTimes(10);
    await vi.advanceTimersByTimeAsync(1001);
    await all;
    expect(fetchMock).toHaveBeenCalledTimes(12);
  });
});

describe('co servírují /api/weather/*', () => {
  beforeEach(() => {
    __resetMetForTesting();
    vi.stubGlobal('fetch', vi.fn(async () => metResponse(buildSeries())));
  });
  afterEach(() => vi.unstubAllGlobals());

  it('pás měst: všech 6 v původním pořadí, srážky = příštích 24 h', async () => {
    const cities = await fetchCityStrip();
    expect(cities.map((c) => c.slug)).toEqual(CZECH_CITIES.map((c) => c.slug));
    expect(cities[0]).toMatchObject({ name: 'Praha', tempC: 21, weatherCode: 61, precipMm: 2.4, windKmh: 9 });
  });

  it('pás měst: město bez dat vypadne, ostatní zůstanou', async () => {
    let n = 0;
    vi.stubGlobal('fetch', vi.fn(async () => (n++ === 1 ? metResponse({}, { status: 500 }) : metResponse(buildSeries()))));
    expect(await fetchCityStrip()).toHaveLength(5);
  });

  it('agro: 7 dní pro střed Česka, bez dat, která MET nemá (půda, minulost, slunce)', async () => {
    const agro = (await fetchAgroWeather())!;
    expect(agro.city).toMatchObject({ lat: 49.8, lon: 15.5 });
    expect(agro.city.name).not.toMatch(/průměr/);
    expect(agro.daily.dates).toHaveLength(7);
    expect(agro).not.toHaveProperty('soil');
    expect(agro).not.toHaveProperty('past7d');
    expect(agro.daily).not.toHaveProperty('sunshineH');
  });

  it('Moje pole: 5 dní + nejbližší obec z vlastního seznamu', async () => {
    const f = (await fetchPointForecast(50.08, 14.43))!;
    expect(f.daily.dates).toHaveLength(5);
    expect(f.place).toBe('Praha');
  });
});

describe('nearestPlace', () => {
  it('obec do 15 km, kraje ne; daleko od všeho null', () => {
    expect(nearestPlace(49.19, 16.6)).toBe('Brno');
    expect(nearestPlace(49.4, 15.57)).not.toBe('Vysočina');
    expect(nearestPlace(0, 0)).toBeNull();
  });
});
