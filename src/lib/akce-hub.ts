// src/lib/akce-hub.ts
// Čistá logika pro hub /akce/: seskupení po měsících, filtr-predikát,
// měsíční mřížka kalendáře, seznam nadcházejících měsíců.
import type { Akce } from './akce';

const MESICE = [
  'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
  'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec',
];

export interface MonthGroup {
  mesic: string; // "2026-08"
  label: string; // "Srpen 2026"
  akce: Akce[];
}

/** YYYY-MM z ISO řetězce (wall-clock dle uloženého offsetu). */
function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

function monthLabel(key: string): string {
  const idx = parseInt(key.slice(5, 7), 10) - 1;
  return `${MESICE[idx]} ${key.slice(0, 4)}`;
}

/** Seskupí akce podle měsíce pristi_vyskyt, chronologicky vzestupně. Akce bez pristi_vyskyt vynechá. */
export function groupByMonth(akce: Akce[]): MonthGroup[] {
  const map = new Map<string, Akce[]>();
  for (const a of akce) {
    if (!a.pristi_vyskyt) continue;
    const key = monthKey(a.pristi_vyskyt);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(a);
  }
  return [...map.keys()].sort().map((key) => ({
    mesic: key,
    label: monthLabel(key),
    akce: map.get(key)!.slice().sort((x, y) => (x.pristi_vyskyt! < y.pristi_vyskyt! ? -1 : 1)),
  }));
}

export interface AkceFilter {
  kraj?: string;
  okres?: string;
  typ?: string;
  obdobi?: '7d' | '30d' | 'vse';
}

const DEN = 86_400_000;

/** True, když akce vyhovuje filtru. now potřebné pro období. */
export function matchesFilter(a: Akce, filter: AkceFilter, now: Date): boolean {
  if (filter.kraj && a.kraj_slug !== filter.kraj) return false;
  if (filter.okres && a.okres_slug !== filter.okres) return false;
  if (filter.typ && a.typ !== filter.typ) return false;
  if (filter.obdobi && filter.obdobi !== 'vse') {
    if (!a.pristi_vyskyt) return false;
    const dny = filter.obdobi === '7d' ? 7 : 30;
    const t = new Date(a.pristi_vyskyt).getTime();
    if (t < now.getTime() || t > now.getTime() + dny * DEN) return false;
  }
  return true;
}

/** Mřížka 6×7 (42 buněk) pro daný měsíc (month 1-12). null = buňka mimo měsíc. Týden začíná pondělím. */
export function buildMonthGrid(year: number, month: number): (Date | null)[] {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const offset = (first.getUTCDay() + 6) % 7; // Po=0 … Ne=6
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < 42; i++) {
    const dayNum = i - offset + 1;
    cells.push(dayNum >= 1 && dayNum <= daysInMonth ? new Date(Date.UTC(year, month - 1, dayNum)) : null);
  }
  return cells;
}

/** Unikátní YYYY-MM od aktuálního měsíce dál, které mají alespoň 1 akci, seřazené. */
export function upcomingMonths(akce: Akce[], now: Date): string[] {
  const nowKey = now.toISOString().slice(0, 7);
  const set = new Set<string>();
  for (const a of akce) {
    if (!a.pristi_vyskyt) continue;
    const key = monthKey(a.pristi_vyskyt);
    if (key >= nowKey) set.add(key);
  }
  return [...set].sort();
}
