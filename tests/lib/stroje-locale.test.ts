import { describe, it, expect } from 'vitest';
import { formatYearRange, familyLabel } from '../../src/lib/stroje';

// Regrese: „dosud"/„N. řada" se dřív vracely česky i pro sk/pl/uk.
describe('stroje lib — locale-aware rozsahy a labely', () => {
  it('formatYearRange překládá otevřený konec dle locale', () => {
    expect(formatYearRange(2012, null)).toBe('2012–dosud');
    expect(formatYearRange(2012, null, 'cs')).toBe('2012–dosud');
    expect(formatYearRange(2012, null, 'pl')).toBe('2012–obecnie');
    expect(formatYearRange(2012, null, 'sk')).toBe('2012–súčasnosť');
    expect(formatYearRange(2012, null, 'uk')).toBe('2012–дотепер');
  });

  it('uzavřený rozsah a prázdný vstup jsou locale-nezávislé', () => {
    expect(formatYearRange(2012, 2021, 'pl')).toBe('2012–2021');
    expect(formatYearRange(null, 2021, 'pl')).toBe('');
  });

  it('neznámé locale padá na cs', () => {
    expect(formatYearRange(2012, null, 'de')).toBe('2012–dosud');
  });

  it('familyLabel číselné rodiny lokalizuje, nečíselné ne', () => {
    expect(familyLabel('6', 'cs')).toBe('6. řada');
    expect(familyLabel('6', 'pl')).toBe('Seria 6');
    expect(familyLabel('6', 'sk')).toBe('6. rad');
    expect(familyLabel('6', 'uk')).toBe('Серія 6');
    expect(familyLabel('steiger', 'pl')).toBe('Steiger');
  });
});
