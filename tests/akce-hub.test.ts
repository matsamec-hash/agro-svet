// tests/akce-hub.test.ts
import { describe, it, expect } from 'vitest';
import {
  groupByMonth, matchesFilter, buildMonthGrid, upcomingMonths,
  type AkceFilter,
} from '../src/lib/akce-hub';
import type { Akce } from '../src/lib/akce';

const NOW = new Date('2026-06-05T08:00:00.000Z'); // pátek

function mk(over: Partial<Akce>): Akce {
  return {
    id: over.id ?? 'x', slug: 'x', nazev: 'X', typ: 'polni-dny', druh: 'jednorazova',
    obec: 'Obec', kraj_slug: 'jihomoravsky', okres_slug: 'brno-venkov', email: '', popis: '',
    stav: 'zverejneno', zdroj: 'kurator', lat: null, lng: null,
    pristi_vyskyt: '2026-08-20T09:00:00+02:00', created_at: '', zverejneno_at: null,
    ...over,
  } as Akce;
}

describe('groupByMonth', () => {
  it('seskupí podle měsíce pristi_vyskyt a seřadí chronologicky', () => {
    const g = groupByMonth([
      mk({ id: 'a', pristi_vyskyt: '2026-09-13T09:00:00+02:00' }),
      mk({ id: 'b', pristi_vyskyt: '2026-08-20T09:00:00+02:00' }),
      mk({ id: 'c', pristi_vyskyt: '2026-08-07T09:00:00+02:00' }),
    ]);
    expect(g.map((x) => x.mesic)).toEqual(['2026-08', '2026-09']);
    expect(g[0].label).toBe('Srpen 2026');
    expect(g[0].akce.map((a) => a.id)).toEqual(['c', 'b']);
  });
  it('vynechá akce bez pristi_vyskyt', () => {
    expect(groupByMonth([mk({ pristi_vyskyt: null })])).toEqual([]);
  });
});

describe('matchesFilter', () => {
  const a = mk({ kraj_slug: 'jihocesky', okres_slug: 'ceske-budejovice', typ: 'vystavy-veletrhy', pristi_vyskyt: '2026-08-20T09:00:00+02:00' });
  it('prázdný filtr propustí vše', () => {
    expect(matchesFilter(a, {}, NOW)).toBe(true);
  });
  it('filtr kraje', () => {
    expect(matchesFilter(a, { kraj: 'jihocesky' }, NOW)).toBe(true);
    expect(matchesFilter(a, { kraj: 'praha' }, NOW)).toBe(false);
  });
  it('filtr okresu a typu', () => {
    expect(matchesFilter(a, { okres: 'ceske-budejovice', typ: 'vystavy-veletrhy' }, NOW)).toBe(true);
    expect(matchesFilter(a, { typ: 'polni-dny' }, NOW)).toBe(false);
  });
  it('období 7d zahrne jen příštích 7 dní', () => {
    const blizko = mk({ pristi_vyskyt: '2026-06-10T09:00:00+02:00' });
    expect(matchesFilter(blizko, { obdobi: '7d' }, NOW)).toBe(true);
    expect(matchesFilter(a, { obdobi: '7d' }, NOW)).toBe(false); // srpen
  });
  it('období 30d', () => {
    expect(matchesFilter(mk({ pristi_vyskyt: '2026-06-25T09:00:00+02:00' }), { obdobi: '30d' }, NOW)).toBe(true);
    expect(matchesFilter(a, { obdobi: '30d' }, NOW)).toBe(false);
  });
});

describe('buildMonthGrid', () => {
  it('červen 2026 začíná pondělím, 42 buněk, konec dopadá na null', () => {
    const grid = buildMonthGrid(2026, 6);
    expect(grid.length).toBe(42);
    expect(grid[0]?.getUTCDate()).toBe(1);
    expect(grid[0]?.getUTCMonth()).toBe(5); // červen = index 5
    expect(grid[29]?.getUTCDate()).toBe(30);
    expect(grid[30]).toBeNull();
  });
  it('únor 2026 má vedoucí null (1.2.2026 je neděle)', () => {
    const grid = buildMonthGrid(2026, 2);
    expect(grid.slice(0, 6).every((d) => d === null)).toBe(true);
    expect(grid[6]?.getUTCDate()).toBe(1);
  });
});

describe('upcomingMonths', () => {
  it('vrátí unikátní měsíce od aktuálního dál, seřazené', () => {
    const m = upcomingMonths([
      mk({ pristi_vyskyt: '2026-09-13T09:00:00+02:00' }),
      mk({ pristi_vyskyt: '2026-08-20T09:00:00+02:00' }),
      mk({ pristi_vyskyt: '2026-08-07T09:00:00+02:00' }),
    ], NOW);
    expect(m).toEqual(['2026-08', '2026-09']);
  });
});
