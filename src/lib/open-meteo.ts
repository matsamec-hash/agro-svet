// Open-Meteo wrapper — free, bez API klíče.
// https://open-meteo.com/en/docs

export interface CityWeather {
  name: string;
  slug: string;
  lat: number;
  lon: number;
  tempC: number;
  weatherCode: number;
  precipMm: number; // dnes
  precipProb: number; // dnes %
  windKmh: number;
}

export interface AgroWeather {
  city: { name: string; lat: number; lon: number };
  current: { tempC: number; weatherCode: number; windKmh: number };
  daily: {
    dates: string[];
    tempMax: number[];
    tempMin: number[];
    precipMm: number[];
    precipProb: number[];
    sunshineH: number[];
    weatherCode: number[];
  };
  soil: {
    moisture0_3cm: number; // m³/m³
    moisture3_9cm: number;
    temp0cm: number;
    temp6cm: number;
  };
  past7d: {
    precipSum: number;
    tempAvg: number;
  };
}

export const CZECH_CITIES: { name: string; slug: string; lat: number; lon: number }[] = [
  { name: 'Praha', slug: 'praha', lat: 50.08, lon: 14.43 },
  { name: 'Brno', slug: 'brno', lat: 49.20, lon: 16.61 },
  { name: 'Plzeň', slug: 'plzen', lat: 49.75, lon: 13.38 },
  { name: 'Č. Budějovice', slug: 'cb', lat: 48.97, lon: 14.47 },
  { name: 'Hr. Králové', slug: 'hk', lat: 50.21, lon: 15.83 },
  { name: 'Olomouc', slug: 'olomouc', lat: 49.59, lon: 17.25 },
];

// Czech "agricultural center" - Vysočina/Polabí border
export const CZECH_CENTER = { name: 'Česká kotlina (průměr)', lat: 49.8, lon: 15.5 };

const WMO_LABELS: Record<number, string> = {
  0: 'Jasno', 1: 'Polojasno', 2: 'Polojasno', 3: 'Zataženo',
  45: 'Mlha', 48: 'Mlha s námrazou',
  51: 'Mrholení', 53: 'Mrholení', 55: 'Silné mrholení',
  61: 'Slabý déšť', 63: 'Déšť', 65: 'Silný déšť',
  71: 'Slabé sněžení', 73: 'Sněžení', 75: 'Silné sněžení',
  80: 'Přeháňky', 81: 'Přeháňky', 82: 'Silné přeháňky',
  95: 'Bouřka', 96: 'Bouřka s krupobitím', 99: 'Silná bouřka',
};

const WMO_EMOJI: Record<number, string> = {
  0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
  45: '🌫️', 48: '🌫️',
  51: '🌦️', 53: '🌦️', 55: '🌧️',
  61: '🌧️', 63: '🌧️', 65: '🌧️',
  71: '🌨️', 73: '🌨️', 75: '❄️',
  80: '🌦️', 81: '🌧️', 82: '⛈️',
  95: '⛈️', 96: '⛈️', 99: '⛈️',
};

export function weatherLabel(code: number): string {
  return WMO_LABELS[code] ?? '—';
}
export function weatherEmoji(code: number): string {
  return WMO_EMOJI[code] ?? '🌡️';
}

const TIMEOUT_MS = 4500;

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

interface OMForecastResp {
  current?: {
    temperature_2m: number;
    weather_code: number;
    wind_speed_10m: number;
    precipitation: number;
  };
  daily?: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
    sunshine_duration?: number[];
    weather_code: number[];
  };
  hourly?: {
    soil_moisture_0_to_1cm?: number[];
    soil_moisture_3_to_9cm?: number[];
    soil_temperature_0cm?: number[];
    soil_temperature_6cm?: number[];
  };
}

export async function fetchCityStrip(): Promise<CityWeather[]> {
  const results: CityWeather[] = [];
  await Promise.all(
    CZECH_CITIES.map(async (c) => {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}` +
        `&current=temperature_2m,weather_code,wind_speed_10m` +
        `&daily=precipitation_sum,precipitation_probability_max&forecast_days=1&timezone=Europe%2FPrague`;
      const data = await fetchJson<OMForecastResp>(url);
      if (!data?.current) return;
      results.push({
        name: c.name,
        slug: c.slug,
        lat: c.lat,
        lon: c.lon,
        tempC: Math.round(data.current.temperature_2m),
        weatherCode: data.current.weather_code,
        precipMm: data.daily?.precipitation_sum?.[0] ?? 0,
        precipProb: data.daily?.precipitation_probability_max?.[0] ?? 0,
        windKmh: Math.round(data.current.wind_speed_10m),
      });
    }),
  );
  // Preserve original order
  return CZECH_CITIES.map((c) => results.find((r) => r.slug === c.slug)).filter((r): r is CityWeather => !!r);
}

export async function fetchAgroWeather(lat = CZECH_CENTER.lat, lon = CZECH_CENTER.lon, name = CZECH_CENTER.name): Promise<AgroWeather | null> {
  const today = new Date();
  const past = new Date();
  past.setDate(today.getDate() - 7);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,weather_code,wind_speed_10m` +
    `&hourly=soil_moisture_0_to_1cm,soil_moisture_3_to_9cm,soil_temperature_0cm,soil_temperature_6cm` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,sunshine_duration,weather_code` +
    `&forecast_days=7&timezone=Europe%2FPrague`;

  const pastUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}` +
    `&start_date=${fmt(past)}&end_date=${fmt(today)}` +
    `&daily=temperature_2m_mean,precipitation_sum&timezone=Europe%2FPrague`;

  const [fc, pa] = await Promise.all([
    fetchJson<OMForecastResp>(forecastUrl),
    fetchJson<{ daily?: { temperature_2m_mean: number[]; precipitation_sum: number[] } }>(pastUrl),
  ]);
  if (!fc?.current || !fc?.daily) return null;

  // Average soil moisture/temp from the next 24h
  const sm0 = fc.hourly?.soil_moisture_0_to_1cm?.slice(0, 24) ?? [];
  const sm3 = fc.hourly?.soil_moisture_3_to_9cm?.slice(0, 24) ?? [];
  const st0 = fc.hourly?.soil_temperature_0cm?.slice(0, 24) ?? [];
  const st6 = fc.hourly?.soil_temperature_6cm?.slice(0, 24) ?? [];
  const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  return {
    city: { name, lat, lon },
    current: {
      tempC: Math.round(fc.current.temperature_2m),
      weatherCode: fc.current.weather_code,
      windKmh: Math.round(fc.current.wind_speed_10m),
    },
    daily: {
      dates: fc.daily.time,
      tempMax: fc.daily.temperature_2m_max.map((v) => Math.round(v)),
      tempMin: fc.daily.temperature_2m_min.map((v) => Math.round(v)),
      precipMm: fc.daily.precipitation_sum.map((v) => Math.round(v * 10) / 10),
      precipProb: fc.daily.precipitation_probability_max,
      sunshineH: (fc.daily.sunshine_duration ?? []).map((v) => Math.round((v / 3600) * 10) / 10),
      weatherCode: fc.daily.weather_code,
    },
    soil: {
      moisture0_3cm: Math.round(avg(sm0) * 1000) / 1000,
      moisture3_9cm: Math.round(avg(sm3) * 1000) / 1000,
      temp0cm: Math.round(avg(st0)),
      temp6cm: Math.round(avg(st6)),
    },
    past7d: {
      precipSum: pa?.daily?.precipitation_sum
        ? Math.round(pa.daily.precipitation_sum.reduce((a, b) => a + b, 0) * 10) / 10
        : 0,
      tempAvg: pa?.daily?.temperature_2m_mean
        ? Math.round((pa.daily.temperature_2m_mean.reduce((a, b) => a + b, 0) / pa.daily.temperature_2m_mean.length) * 10) / 10
        : 0,
    },
  };
}

export function dayLabelCs(iso: string): string {
  const d = new Date(iso + 'T12:00:00');
  const days = ['ne', 'po', 'út', 'st', 'čt', 'pá', 'so'];
  return days[d.getDay()];
}
