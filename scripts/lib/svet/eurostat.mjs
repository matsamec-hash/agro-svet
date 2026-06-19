// Tenký wrapper nad Eurostat dissemination API + generickým JSON-stat extraktorem.
import { pickSeries } from '../eurostat-sk.mjs';
import { fetchJsonRetry } from './http.mjs';

const BASE = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data';

/** Sestaví Eurostat data URL. params = { geo, ...dimFilters }. */
export function buildEurostatUrl(dataset, params) {
  const qs = new URLSearchParams({ format: 'JSON', ...params });
  return `${BASE}/${dataset}?${qs.toString()}`;
}

/** Čistá: JSON-stat → [{period,value}] pro dané fixní souřadnice (vč. geo). */
export function seriesFromJsonStat(json, fixed) {
  return pickSeries(json, fixed).map((p) => ({ period: p.time, value: p.value }));
}

/** Stáhne a vrátí časovou řadu. filters = dimenze KROMĚ time (vč. geo). */
export async function fetchEurostatSeries(dataset, filters) {
  const url = buildEurostatUrl(dataset, filters);
  const json = await fetchJsonRetry(url);
  return { series: seriesFromJsonStat(json, filters), url };
}
