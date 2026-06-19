// Tenký wrapper nad World Bank Open Data API (otevřené, bez klíče; globální/paritní
// harmonizovaná data vč. USA). FAOSTAT services API nahrazen — vyžaduje auth.
import { fetchJsonRetry } from './http.mjs';

const BASE = 'https://api.worldbank.org/v2';

/** Sestaví World Bank data URL. code = ISO2 (DE/FR/GB/US/CZ), indicator = např. AG.LND.AGRI.K2 */
export function buildWorldBankUrl(code, indicator) {
  return `${BASE}/country/${code}/indicator/${indicator}?format=json&date=1990:2024&per_page=20000`;
}

/** Čistá: World Bank [meta, rows] → [{period,value}] (chronologicky, jen číselné). */
export function parseWorldBank(json) {
  const rows = Array.isArray(json) ? (json[1] ?? []) : [];
  const out = [];
  for (const r of rows) {
    const period = String(r?.date ?? '');
    const value = r?.value;
    if (!period || value === null || value === undefined || Number.isNaN(Number(value))) continue;
    out.push({ period, value: Number(value) });
  }
  out.sort((a, b) => a.period.localeCompare(b.period));
  return out;
}

export async function fetchWorldBankSeries(code, indicator) {
  const url = buildWorldBankUrl(code, indicator);
  const json = await fetchJsonRetry(url);
  return { series: parseWorldBank(json), url };
}
