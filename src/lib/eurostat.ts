// Eurostat API — open, no auth, JSON-stat format
// Docs: https://wikis.ec.europa.eu/display/EUROSTATHELP/API+Statistics
// Used as fallback when CZSO doesn't have historical data.

const BASE = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data';

export interface LivestockHistoricalPoint {
  animal: string; // 'Skot' | 'Prasata'
  count: number; // ks (kusů)
  date: string; // 'YYYY-MM-DD' nebo 'YYYY' formát
}

interface EurostatResponse {
  value: Record<string, number>;
  dimension: {
    time?: { category: { index: Record<string, number>; label: Record<string, string> } };
    animals?: { category: { index: Record<string, number>; label: Record<string, string> } };
  };
  size: number[];
  id: string[];
}

/** Stavy skotu v ČR (Eurostat apro_mt_lscatl) — historická řada. Vrací počty v ks (M11_M12 = November/December counts). */
export async function getCattleHistoricalEurostat(): Promise<LivestockHistoricalPoint[]> {
  // Eurostat apro_mt_lscatl má month: M05_M06 (May/June survey) a M11_M12 (Nov/Dec survey)
  // animals=A2000 = Live bovine animals, all (1000 head)
  const url = `${BASE}/apro_mt_lscatl?format=JSON&geo=CZ&animals=A2000`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) return [];
  const data: EurostatResponse = await res.json();
  return parseEurostatTimeSeries(data, 'Skot');
}

/** Stavy prasat v ČR (Eurostat apro_mt_lspig) — historická řada. Vrací počty v ks. */
export async function getPigsHistoricalEurostat(): Promise<LivestockHistoricalPoint[]> {
  // animals=A3100 = Live pigs (1000 head)
  const url = `${BASE}/apro_mt_lspig?format=JSON&geo=CZ&animals=A3100`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) return [];
  const data: EurostatResponse = await res.json();
  return parseEurostatTimeSeries(data, 'Prasata');
}

function parseEurostatTimeSeries(data: EurostatResponse, animalLabel: string): LivestockHistoricalPoint[] {
  // Eurostat JSON-stat: value keys jsou flat indexes do n-dim array.
  // size = [freq=1, month=2, animals=1, unit=1, geo=1, time=N]
  // Index = month * timeN + time (pokud se ostatní = 0)
  // Pro M11_M12 (idx 1): keys jsou timeN..2*timeN-1
  const timeIndex = data.dimension.time?.category.index ?? {};
  const months = (data as any).dimension?.month?.category?.index ?? {};
  const timeKeys = Object.keys(timeIndex).sort();
  const timeN = timeKeys.length;
  // Preferuj M11_M12 (rok-end), fallback M05_M06
  const monthIdx = months['M11_M12'] !== undefined ? months['M11_M12'] : (months['M05_M06'] ?? 0);

  const points: LivestockHistoricalPoint[] = [];
  for (const year of timeKeys) {
    const tIdx = timeIndex[year];
    const flatIdx = monthIdx * timeN + tIdx;
    const v = data.value[String(flatIdx)];
    if (v === undefined || v === null) continue;
    points.push({
      animal: animalLabel,
      count: Math.round(v * 1000),
      date: `${year}-12-31`,
    });
  }
  points.sort((a, b) => a.date.localeCompare(b.date));
  return points;
}

/** Kombinovaná funkce: vrátí historická data o skotu a prasatech v ČR od 1990. */
export async function getLivestockHistoricalCombined(): Promise<LivestockHistoricalPoint[]> {
  const [cattle, pigs] = await Promise.all([
    getCattleHistoricalEurostat(),
    getPigsHistoricalEurostat(),
  ]);
  return [...cattle, ...pigs];
}
