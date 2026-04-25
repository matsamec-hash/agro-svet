// src/data/agro-events.ts
export interface AgroEvent {
  date: string;          // ISO YYYY-MM (např. "2014-08")
  label: string;
  relevance: 'commodity' | 'livestock' | 'all';
}

// Historické události s dopadem na české zemědělství.
// Použito pro anotace v dlouhodobých grafech (CommodityChart, LivestockSlope).
export const AGRO_EVENTS: AgroEvent[] = [
  { date: '2004-05', label: 'ČR vstup do EU', relevance: 'all' },
  { date: '2014-08', label: 'Ruské embargo', relevance: 'commodity' },
  { date: '2015-04', label: 'Konec mléčných kvót', relevance: 'livestock' },
  { date: '2020-03', label: 'COVID-19', relevance: 'all' },
  { date: '2022-02', label: 'Invaze na Ukrajinu', relevance: 'commodity' },
  { date: '2024-08', label: 'Sucho v jižní Moravě', relevance: 'commodity' },
];

// Helper: vrací events relevantní pro daný typ grafu, filtruje podle časového okna grafu.
export function eventsInRange(
  events: AgroEvent[],
  fromDate: string,    // YYYY-MM
  toDate: string,      // YYYY-MM
  relevance: 'commodity' | 'livestock' | 'all'
): AgroEvent[] {
  return events.filter(e => {
    if (e.relevance !== 'all' && e.relevance !== relevance) return false;
    return e.date >= fromDate && e.date <= toDate;
  });
}
