import { describe, it, expect } from 'vitest';
import data from '../../src/data/agro-stats-uk.json';
import type { StatistikyUkData } from '../../src/lib/statistiky-uk-types';

const d = data as unknown as StatistikyUkData;

describe('agro-stats-uk.json', () => {
  it('má všechny povinné top-level klíče', () => {
    for (const k of ['generated', 'warCaveat', 'bigNumbers', 'cropProduction', 'warTimeline', 'sources']) {
      expect(d).toHaveProperty(k);
    }
  });

  it('bigNumbers: každé číslo má zdroj (url http)', () => {
    expect(d.bigNumbers.length).toBeGreaterThanOrEqual(3);
    for (const b of d.bigNumbers) {
      expect(b.source.length).toBeGreaterThan(0);
      expect(b.url.startsWith('http')).toBe(true);
    }
  });

  it('cropProduction: každá plodina má atribuci (source/url/asOf) a neprázdnou produkční řadu', () => {
    expect(d.cropProduction.length).toBeGreaterThanOrEqual(3);
    for (const c of d.cropProduction) {
      expect(c.production.length).toBeGreaterThan(0);
      expect(c.asOf.length).toBeGreaterThan(0);
      expect(c.source.length).toBeGreaterThan(0);
      expect(c.url.startsWith('http')).toBe(true);
    }
  });

  it('warTimeline: ≥3 kroky se zdrojem', () => {
    expect(d.warTimeline.length).toBeGreaterThanOrEqual(3);
    for (const s of d.warTimeline) {
      expect(s.url.startsWith('http')).toBe(true);
    }
  });

  it('prices (pokud existuje) má atribuci a neprázdnou řadu', () => {
    if (!d.prices) return; // CONDITIONAL — smí chybět
    expect(d.prices.asOf.length).toBeGreaterThan(0);
    expect(d.prices.source.length).toBeGreaterThan(0);
    expect(d.prices.url.startsWith('http')).toBe(true);
    expect(d.prices.series.length).toBeGreaterThan(0);
  });

  it('sources: ≥2 odkazy', () => {
    expect(d.sources.length).toBeGreaterThanOrEqual(2);
  });
});
