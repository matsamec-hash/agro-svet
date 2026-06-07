import { describe, it, expect } from 'vitest';
import { normalizeOdruda, slugifyOdruda } from '../../scripts/import-odrudy';

describe('import-odrudy — normalizace', () => {
  it('slugifyOdruda dělá ASCII slug', () => {
    expect(slugifyOdruda('Zlaťák')).toBe('zlatak');
    expect(slugifyOdruda('KWS Aréna')).toBe('kws-arena');
  });

  it('normalizeOdruda mapuje ÚKZÚZ záznam na OdrudaFakta', () => {
    const raw = {
      nazev: 'Zlaťák',
      druhPlodiny: 'oves setý',
      rokRegistrace: '2018',
      udrzovatel: 'Selgen, a.s.',
      typ: 'jarní',
      ranost: 'poloraná',
    };
    const out = normalizeOdruda(raw, 'oves');
    expect(out).toEqual({
      slug: 'zlatak',
      name: 'Zlaťák',
      plodina_slug: 'oves',
      rok_registrace: 2018,
      udrzovatel: 'Selgen, a.s.',
      typ: 'jarní',
      ranost: 'poloraná',
      zdroj_url: 'https://ido.ukzuz.cz/ido/',
    });
  });
});
