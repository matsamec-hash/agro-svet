// Předpověď počasí z MET Norway — Locationforecast 2.0 (compact).
// https://api.met.no/weatherapi/locationforecast/2.0/documentation
//
// ‼️ Proč ne Open-Meteo: jeho free API je jen pro NEkomerční použití a
//    agro-svet.cz komerční je (úkol 09db5c97, 2026-10-17).
//
// Licence dat: NLOD 2.0 + CC BY 4.0 — komerční použití povolené, ale s
// uvedením zdroje, odkazem na licenci a poznámkou, že jsou data upravená
// (sčítáme je po dnech). Atribuce je pod widgetem v HomeWeather.astro.
//
// Podmínky (https://api.met.no/doc/TermsOfService), které tenhle modul drží:
//   - identifikační User-Agent s kontaktem (MET_USER_AGENT),
//   - volá se JEN ze serveru přes naše /api/weather/* — prohlížeč návštěvníka
//     MET nekontaktuje, takže MET nedostane jeho IP adresu,
//   - souřadnice max. 4 desetinná místa (5+ vrací u nových produktů 403),
//   - před časem z hlavičky Expires se nevolá znovu; obnova jde přes
//     If-Modified-Since = přesně poslední Last-Modified (→ 304 bez těla),
//   - celkem pod 20 req/s za celou aplikaci (strop MAX_REQ_PER_SEC),
//   - na 429/403 se ustoupí a servíruje se poslední známá data.

import { CZ_LOCATIONS_GEO } from './cz-locations-geo';

export const MET_ENDPOINT = 'https://api.met.no/weatherapi/locationforecast/2.0/compact';
export const MET_USER_AGENT = 'agro-svet.cz/1.0 (+https://agro-svet.cz; info@samecdigital.com)';
export const TIME_ZONE = 'Europe/Prague';

// ── Pevná místa ──────────────────────────────────────────────────────────

export const CZECH_CITIES: { name: string; slug: string; lat: number; lon: number }[] = [
  { name: 'Praha', slug: 'praha', lat: 50.08, lon: 14.43 },
  { name: 'Brno', slug: 'brno', lat: 49.20, lon: 16.61 },
  { name: 'Plzeň', slug: 'plzen', lat: 49.75, lon: 13.38 },
  { name: 'Č. Budějovice', slug: 'cb', lat: 48.97, lon: 14.47 },
  { name: 'Hr. Králové', slug: 'hk', lat: 50.21, lon: 15.83 },
  { name: 'Olomouc', slug: 'olomouc', lat: 49.59, lon: 17.25 },
];

// Jeden bod uprostřed Česka (pomezí Vysočiny a Polabí). Je to předpověď pro
// tenhle bod, NE průměr za republiku — tak to i popisujeme.
export const CZECH_CENTER = { name: 'Střed Česka (49,8° s. š., 15,5° v. d.)', lat: 49.8, lon: 15.5 };

// ── Typy odpovědi MET ───────────────────────────────────────────────────

interface MetPeriod {
  summary?: { symbol_code?: string };
  details?: { precipitation_amount?: number };
}

export interface MetTimestep {
  time: string;
  data: {
    instant: {
      details: {
        air_temperature?: number;
        relative_humidity?: number;
        wind_speed?: number; // m/s
        cloud_area_fraction?: number;
      };
    };
    next_1_hours?: MetPeriod;
    next_6_hours?: MetPeriod;
    next_12_hours?: MetPeriod;
  };
}

export interface MetCompact {
  properties: {
    meta?: { updated_at?: string };
    timeseries: MetTimestep[];
  };
}

// ── Symboly MET → naše kódy ikon ────────────────────────────────────────
//
// Widget má tabulku ikon a popisků podle WMO kódů (z dob Open-Meteo). Místo
// přepisování klienta převedeme symbol MET na nejbližší WMO kód. MET nerozliší
// krupobití (WMO 96), takže silné bouřky jdou na 99, ostatní na 95. Déšť se
// sněhem (sleet) nemá v tabulce Open-Meteo obdobu → WMO 4677 kódy 68/69.

/** "rainshowers_day" → "rainshowers" */
export function metSymbolBase(symbol: string): string {
  return symbol.replace(/_(day|night|polartwilight)$/, '');
}

/** Symbol MET (např. "lightrainshowers_day") → WMO kód pro ikonu/popisek; -1 = neznámý. */
export function metSymbolToWmo(symbol: string | null | undefined): number {
  if (!symbol) return -1;
  const b = metSymbolBase(symbol);
  const heavy = b.startsWith('heavy');
  const light = b.startsWith('light'); // i MET překlepy "lightssleet…", "lightssnow…"
  if (b.includes('thunder')) return heavy ? 99 : 95;
  switch (b) {
    case 'clearsky': return 0;
    case 'fair': return 1;
    case 'partlycloudy': return 2;
    case 'cloudy': return 3;
    case 'fog': return 45;
  }
  if (b.includes('sleet')) return heavy ? 69 : 68;
  if (b.includes('snow')) return heavy ? 75 : light ? 71 : 73;
  if (b.includes('rain')) {
    if (b.includes('showers')) return heavy ? 82 : light ? 80 : 81;
    return heavy ? 65 : light ? 61 : 63;
  }
  return -1;
}

/** Čím vyšší, tím horší počasí — pro výběr jednoho symbolu za den. */
function symbolSeverity(symbol: string): number {
  const b = metSymbolBase(symbol);
  const intensity = b.startsWith('heavy') ? 2 : b.startsWith('light') ? 0 : 1;
  if (b.includes('thunder')) return 40 + intensity;
  if (/rain|sleet|snow/.test(b)) {
    return 10 + intensity * 3 + (b.includes('showers') ? 0 : 1) + (/sleet|snow/.test(b) ? 1 : 0);
  }
  return ({ clearsky: 0, fair: 1, partlycloudy: 2, cloudy: 3, fog: 4 } as Record<string, number>)[b] ?? 0;
}

function mostSevere(symbols: string[]): string | null {
  let best: string | null = null;
  for (const s of symbols) if (best === null || symbolSeverity(s) > symbolSeverity(best)) best = s;
  return best;
}

// ── Souhrn předpovědi ───────────────────────────────────────────────────

export interface ForecastSummary {
  /** Kdy MET předpověď spočítal (meta.updated_at). */
  updatedAt: string | null;
  /** Dnešní datum v Europe/Prague (YYYY-MM-DD) — klient podle něj píše „Dnes". */
  today: string;
  current: { tempC: number; weatherCode: number; windKmh: number; humidity: number | null };
  /** Srážky v příštích 24 h (mm). */
  next24hPrecipMm: number;
  daily: {
    dates: string[];
    tempMax: number[];
    tempMin: number[];
    precipMm: number[];
    weatherCode: number[];
  };
}

const HOUR_MS = 3_600_000;

function localDateFn(timeZone: string): (ms: number) => string {
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' });
  return (ms) => {
    const parts = fmt.formatToParts(new Date(ms));
    const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
    return `${get('year')}-${get('month')}-${get('day')}`;
  };
}

const round1 = (v: number) => Math.round(v * 10) / 10;

/**
 * Z časové řady MET udělá aktuální stav + denní souhrny (místní čas).
 *
 * MET dává jen budoucnost: hodinové kroky zhruba na 2,5 dne, dál po 6 h.
 * Srážky se sčítají bez překryvů (hodinové bloky, potom šestihodinové).
 * Den, který má méně než `minHoursPerDay` hodin dat (dnešek pozdě večer,
 * poslední neúplný den řady), se vynechá — jinak by „dnešní maximum" ve
 * 23:00 bylo jen teplota v tu hodinu.
 */
export function summarizeForecast(
  data: MetCompact,
  opts: { days: number; now?: number; timeZone?: string; minHoursPerDay?: number },
): ForecastSummary | null {
  const ts = data?.properties?.timeseries;
  if (!Array.isArray(ts) || ts.length === 0) return null;
  const localDate = localDateFn(opts.timeZone ?? TIME_ZONE);
  const minHours = opts.minHoursPerDay ?? 6;

  const first = ts[0];
  const t0 = Date.parse(first.time);
  const inst0: MetTimestep['data']['instant']['details'] = first.data?.instant?.details ?? {};
  if (typeof inst0.air_temperature !== 'number') return null;
  const sym0 = first.data.next_1_hours?.summary?.symbol_code
    ?? first.data.next_6_hours?.summary?.symbol_code
    ?? first.data.next_12_hours?.summary?.symbol_code;

  interface Day { temps: number[]; precip: number; hours: number; daytime: string[]; all: string[] }
  const days = new Map<string, Day>();
  let coveredUntil = -Infinity;
  let next24 = 0;

  for (const step of ts) {
    const t = Date.parse(step.time);
    if (!Number.isFinite(t)) continue;
    const date = localDate(t);
    let day = days.get(date);
    if (!day) { day = { temps: [], precip: 0, hours: 0, daytime: [], all: [] }; days.set(date, day); }

    const temp = step.data?.instant?.details?.air_temperature;
    if (typeof temp === 'number') day.temps.push(temp);

    const h1 = step.data?.next_1_hours;
    const h6 = step.data?.next_6_hours;
    if (t >= coveredUntil) {
      const p1 = h1?.details?.precipitation_amount;
      const p6 = h6?.details?.precipitation_amount;
      let amount: number | null = null;
      if (typeof p1 === 'number') { amount = p1; coveredUntil = t + HOUR_MS; day.hours += 1; }
      else if (typeof p6 === 'number') { amount = p6; coveredUntil = t + 6 * HOUR_MS; day.hours += 6; }
      if (amount !== null) {
        day.precip += amount;
        if (t < t0 + 24 * HOUR_MS) next24 += amount;
      }
      const s = h1?.summary?.symbol_code ?? h6?.summary?.symbol_code;
      if (s) day.all.push(s);
    }
    // Denní symbol: nejhorší ze šestihodinových bloků 06–12 a 12–18 UTC (den).
    const utcHour = new Date(t).getUTCHours();
    const s6 = h6?.summary?.symbol_code;
    if (s6 && (utcHour === 6 || utcHour === 12)) day.daytime.push(s6);
  }

  const daily: ForecastSummary['daily'] = { dates: [], tempMax: [], tempMin: [], precipMm: [], weatherCode: [] };
  for (const [date, d] of days) {
    if (daily.dates.length >= opts.days) break;
    if (d.hours < minHours || d.temps.length === 0) continue;
    daily.dates.push(date);
    daily.tempMax.push(Math.round(Math.max(...d.temps)));
    daily.tempMin.push(Math.round(Math.min(...d.temps)));
    daily.precipMm.push(round1(d.precip));
    daily.weatherCode.push(metSymbolToWmo(mostSevere(d.daytime.length ? d.daytime : d.all)));
  }

  return {
    updatedAt: data.properties.meta?.updated_at ?? null,
    today: localDate(opts.now ?? Date.now()),
    current: {
      tempC: Math.round(inst0.air_temperature),
      weatherCode: metSymbolToWmo(sym0),
      windKmh: Math.round((inst0.wind_speed ?? 0) * 3.6),
      humidity: typeof inst0.relative_humidity === 'number' ? Math.round(inst0.relative_humidity) : null,
    },
    next24hPrecipMm: round1(next24),
    daily,
  };
}

// ── Stahování s cache a stropem ─────────────────────────────────────────

/** MET chce max. 4 desetinná místa. */
export function roundCoord(v: number, decimals = 4): number {
  const f = 10 ** decimals;
  return Math.round(v * f) / f;
}

interface UpstreamEntry {
  data: MetCompact;
  lastModified: string | null;
  expiresAt: number;
  fetchedAt: number;
}

const MAX_ENTRIES = 2000;
const MIN_TTL_MS = 30 * 60_000; // „cache ~30–60 min"; nikdy dřív než Expires
const MAX_TTL_MS = 3 * HOUR_MS;
const STALE_MAX_MS = 6 * HOUR_MS; // při výpadku MET radši 6 h stará předpověď než nic
const TIMEOUT_MS = 4500;
const MAX_REQ_PER_SEC = 10; // MET: nad 20 req/s za celou aplikaci jen po dohodě
const SLOT_WAIT_MS = 3000;

const upstream = new Map<string, UpstreamEntry>();
const inflight = new Map<string, Promise<MetCompact | null>>();
let recentCalls: number[] = [];
let blockedUntil = 0;

/** Klouzavé okno 1 s, společné pro všechna volání z tohoto procesu. */
async function takeSlot(): Promise<boolean> {
  const deadline = Date.now() + SLOT_WAIT_MS;
  for (;;) {
    const now = Date.now();
    recentCalls = recentCalls.filter((t) => now - t < 1000);
    if (recentCalls.length < MAX_REQ_PER_SEC) {
      recentCalls.push(now);
      return true;
    }
    const wait = 1000 - (now - recentCalls[0]) + 1;
    if (now + wait > deadline) return false;
    await new Promise((r) => setTimeout(r, wait));
  }
}

function expiryFrom(headers: Headers, now: number): number {
  const exp = Date.parse(headers.get('expires') ?? '');
  const target = Number.isFinite(exp) ? exp : now + MIN_TTL_MS;
  return Math.min(Math.max(target, now + MIN_TTL_MS), now + MAX_TTL_MS);
}

function remember(key: string, entry: UpstreamEntry): void {
  upstream.delete(key); // přesun na konec = nejčerstvější
  if (upstream.size >= MAX_ENTRIES) {
    const oldest = upstream.keys().next().value;
    if (oldest !== undefined) upstream.delete(oldest);
  }
  upstream.set(key, entry);
}

const RETRY_AFTER_FAILURE_MS = 5 * 60_000;

/** Při chybě: starší kopie (do 6 h) a další pokus o tenhle bod až za 5 min. */
function stale(key: string, entry: UpstreamEntry | undefined, now: number): MetCompact | null {
  if (!entry) return null;
  if (now - entry.fetchedAt >= STALE_MAX_MS) {
    upstream.delete(key);
    return null;
  }
  entry.expiresAt = Math.max(entry.expiresAt, now + RETRY_AFTER_FAILURE_MS);
  return entry.data;
}

async function refresh(key: string, lat: number, lon: number, entry: UpstreamEntry | undefined): Promise<MetCompact | null> {
  if (Date.now() < blockedUntil) return stale(key, entry, Date.now());
  if (!(await takeSlot())) return stale(key, entry, Date.now());

  const headers: Record<string, string> = { 'User-Agent': MET_USER_AGENT, Accept: 'application/json' };
  if (entry?.lastModified) headers['If-Modified-Since'] = entry.lastModified;

  let res: Response;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      res = await fetch(`${MET_ENDPOINT}?lat=${lat}&lon=${lon}`, { headers, signal: ctrl.signal });
    } finally {
      clearTimeout(timer);
    }
  } catch {
    return stale(key, entry, Date.now());
  }

  const now = Date.now();
  if (res.status === 304 && entry) {
    remember(key, { ...entry, expiresAt: expiryFrom(res.headers, now), fetchedAt: now });
    return entry.data;
  }
  if (res.status === 429 || res.status === 403) {
    // 429 = škrtí nás, 403 = typicky špatná identifikace → hned ubrat.
    blockedUntil = now + (res.status === 429 ? 60_000 : 10 * 60_000);
    console.warn(`[met-norway] HTTP ${res.status} — pauza ${res.status === 429 ? '1 min' : '10 min'}`);
    return stale(key, entry, now);
  }
  if (!res.ok) return stale(key, entry, now);
  if (res.status === 203) console.warn('[met-norway] HTTP 203 — tahle verze Locationforecast je deprecated');

  let data: MetCompact;
  try {
    data = (await res.json()) as MetCompact;
  } catch {
    return stale(key, entry, now);
  }
  if (!Array.isArray(data?.properties?.timeseries) || data.properties.timeseries.length === 0) {
    return stale(key, entry, now);
  }
  remember(key, {
    data,
    lastModified: res.headers.get('last-modified'),
    expiresAt: expiryFrom(res.headers, now),
    fetchedAt: now,
  });
  return data;
}

/** Surová předpověď MET pro bod; null když není a nemáme ani starší kopii. */
export async function getLocationforecast(lat: number, lon: number): Promise<MetCompact | null> {
  const rlat = roundCoord(lat);
  const rlon = roundCoord(lon);
  const key = `${rlat},${rlon}`;
  const entry = upstream.get(key);
  if (entry && Date.now() < entry.expiresAt) return entry.data;

  const running = inflight.get(key);
  if (running) return running;
  const p = refresh(key, rlat, rlon, entry).finally(() => inflight.delete(key));
  inflight.set(key, p);
  return p;
}

/** Jen pro testy. */
export function __resetMetForTesting(): void {
  upstream.clear();
  inflight.clear();
  recentCalls = [];
  blockedUntil = 0;
}

// ── Co servírují naše /api/weather/* ────────────────────────────────────

export interface CityWeather {
  name: string;
  slug: string;
  lat: number;
  lon: number;
  tempC: number;
  weatherCode: number;
  /** Srážky v příštích 24 h (mm). */
  precipMm: number;
  windKmh: number;
}

export async function fetchCityStrip(): Promise<CityWeather[]> {
  const rows = await Promise.all(
    CZECH_CITIES.map(async (c): Promise<CityWeather | null> => {
      const data = await getLocationforecast(c.lat, c.lon);
      const s = data && summarizeForecast(data, { days: 1 });
      if (!s) return null;
      return {
        name: c.name,
        slug: c.slug,
        lat: c.lat,
        lon: c.lon,
        tempC: s.current.tempC,
        weatherCode: s.current.weatherCode,
        precipMm: s.next24hPrecipMm,
        windKmh: s.current.windKmh,
      };
    }),
  );
  return rows.filter((r): r is CityWeather => r !== null);
}

export interface AgroWeather extends ForecastSummary {
  city: { name: string; lat: number; lon: number };
}

/** 7denní výhled pro pevný bod uprostřed Česka (karty Půda a Plodiny). */
export async function fetchAgroWeather(): Promise<AgroWeather | null> {
  const { name, lat, lon } = CZECH_CENTER;
  const data = await getLocationforecast(lat, lon);
  const s = data && summarizeForecast(data, { days: 7 });
  return s ? { city: { name, lat, lon }, ...s } : null;
}

export interface PointForecast extends ForecastSummary {
  /** Nejbližší obec z vlastního seznamu, nebo null (daleko od všech). */
  place: string | null;
}

/** 5denní předpověď pro „Moje pole". */
export async function fetchPointForecast(lat: number, lon: number): Promise<PointForecast | null> {
  const data = await getLocationforecast(lat, lon);
  const s = data && summarizeForecast(data, { days: 5 });
  return s ? { place: nearestPlace(lat, lon), ...s } : null;
}

// ── Název místa bez dalšího volání ven ──────────────────────────────────
//
// Dřív se jméno místa bralo z reverzního geokódování Open-Meteo přímo z
// prohlížeče. Teď nejbližší obec z našeho seznamu (cz-locations-geo, ~230
// měst); jedno jméno na dotaz je nepodstatná část databáze ve smyslu ODbL.

const PLACE_RADIUS_KM = 15;
const NOT_A_TOWN = /kraj$|^Vysočina$|^Hlavní město /;

function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(a));
}

export function nearestPlace(lat: number, lon: number): string | null {
  let best: string | null = null;
  let bestKm = Infinity;
  for (const p of CZ_LOCATIONS_GEO) {
    if (NOT_A_TOWN.test(p.name)) continue;
    const km = distanceKm(lat, lon, p.lat, p.lng);
    if (km < bestKm) { bestKm = km; best = p.name; }
  }
  return bestKm <= PLACE_RADIUS_KM ? best : null;
}
