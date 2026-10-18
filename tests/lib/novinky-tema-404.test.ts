import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

// Prázdné téma (zaniklý štítek, např. „Program rozvoje venkova“ po přejmenování, nebo
// libovolný text v URL) nesmí vracet 200 s prázdným výpisem — soft 404 pro Google.
describe('novinky/tema/[tag] — prázdné téma = 404', () => {
  const src = readFileSync('src/pages/novinky/tema/[tag]/index.astro', 'utf8');

  it('bez článků přesměruje na /404', () => {
    expect(src).toMatch(/if \(!queryFailed && items\.length === 0\) return Astro\.rewrite\('\/404'\);/);
  });

  it('při chybě dotazu stránku nevyřadí', () => {
    expect(src).toContain('queryFailed = !!res.error');
  });
});
