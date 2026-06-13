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
      popis: null,
      zdroj_url: 'https://ido.ukzuz.cz/ido/',
    });
  });

  it('normalizeOdruda vezme popis z ÚKZÚZ pole description', () => {
    const out = normalizeOdruda(
      { currentName: 'Absolut', speciesName: 'Pšenice setá ozimá', regDecisionDate: '2023-01-01', description: '  Pekařská středně raná odrůda.  ' },
      'psenice-ozima',
    );
    expect(out.popis).toBe('Pekařská středně raná odrůda.');
  });

  it('normalizeOdruda mapuje skutečná pole ÚKZÚZ API (currentName/regDecisionDate/subjects)', () => {
    const raw = {
      currentName: 'Selgen Zlaťák',
      proposedName: 'mělo-by-se-ignorovat',
      speciesName: 'Oves setý',
      regDecisionDate: '2018-03-15',
      subjects: [
        { relationType: 1, relationName: 'Příjemce', name: 'Distributor s.r.o.' },
        { relationType: 0, relationName: 'Udržovatel', name: 'Selgen, a.s.' },
      ],
    };
    const out = normalizeOdruda(raw, 'oves');
    expect(out.name).toBe('Selgen Zlaťák');
    expect(out.rok_registrace).toBe(2018);
    expect(out.udrzovatel).toBe('Selgen, a.s.');
    expect(out.slug).toBe('selgen-zlatak');
  });

  it('normalizeOdruda použije proposedName, je-li currentName prázdný řetězec', () => {
    const raw = { currentName: '', proposedName: 'KWS Aréna', regDecisionDate: '2020-01-01', subjects: [] };
    const out = normalizeOdruda(raw, 'psenice');
    expect(out.name).toBe('KWS Aréna');
  });
});
