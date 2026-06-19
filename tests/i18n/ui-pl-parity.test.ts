import { describe, it, expect } from 'vitest';
import cs from '../../src/i18n/ui/cs';
import pl from '../../src/i18n/ui/pl';

describe('ui/pl.ts key-parita s cs', () => {
  it('pl má přesně stejné klíče jako cs (žádné chybějící/přebývající)', () => {
    expect(Object.keys(pl).sort()).toEqual(Object.keys(cs).sort());
  });
  it('žádná pl hodnota není prázdná', () => {
    for (const [k, v] of Object.entries(pl)) expect(v, k).toBeTruthy();
  });
  it('lang.* přepínač má polské popisky', () => {
    expect(pl['lang.cs']).toBe('CZ');
    expect(pl['lang.sk']).toBe('SK');
    expect(pl['lang.uk']).toBe('UA');
    expect(pl['lang.pl']).toBe('PL');
  });
});
