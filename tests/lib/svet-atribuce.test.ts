// tests/lib/svet-atribuce.test.ts
// Atribuce zdrojů /svet (audit licencí 2026-10-15): World Bank v povinném tvaru WDI,
// prohlášení o neodpovědnosti Eurostatu a kredit hranic ve všech jazycích.
// Vykreslené stránky hlídá tests/render/svet-atribuce.test.ts.
import { describe, it, expect } from 'vitest';
import { sourceCitation, wdiCode, ATTRIBUTION } from '../../src/i18n/svet';
import { locales } from '../../src/i18n/config';

describe('atribuce zdrojů', () => {
  it('World Bank se cituje v povinném tvaru WDI i s původním zdrojem', () => {
    const url = 'https://api.worldbank.org/v2/country/DE/indicator/AG.LND.AGRI.K2?format=json';
    expect(wdiCode(url)).toBe('AG.LND.AGRI.K2');
    expect(sourceCitation('World Bank', url)).toBe('The World Bank: World Development Indicators: FAO');
    expect(sourceCitation('World Bank', 'https://api.worldbank.org/v2/country/DE/indicator/SL.AGR.EMPL.ZS')).toMatch(/: ILO$/);
    expect(sourceCitation('Eurostat', 'x')).toBe('Eurostat');
  });

  it('každý jazyk má prohlášení o neodpovědnosti Eurostatu a kredit hranic', () => {
    for (const l of locales) {
      const a = ATTRIBUTION[l];
      expect(a.eurostat, l).toMatch(/Eurostat/);
      expect(a.eurostat.length, l).toBeGreaterThan(120);
      for (const k of ['mapEurostat', 'mapEurostatEu', 'mapNe', 'mapUs', 'neCountries', 'neRegions', 'usCensus'] as const) {
        expect(a[k], `${l} ${k}`).toBeTruthy();
      }
      expect(a.mapNe, l).toMatch(/Natural Earth/);
      expect(a.usCensus, l).toMatch(/U\.S\. Census Bureau.*us-atlas.*Mike Bostock.*ISC/);
    }
  });
});
