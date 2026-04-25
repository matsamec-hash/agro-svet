import { describe, it, expect } from 'vitest';
import { getSpecLabel, formatSpecValue } from '../../src/lib/spec-labels';

describe('spec-labels', () => {
  it('vrací CZ label pro známý klíč', () => {
    expect(getSpecLabel('pocet_radlic')).toBe('Počet radlic');
    expect(getSpecLabel('typ_komory')).toBe('Typ komory');
  });

  it('vrací prettified slug pro neznámý klíč', () => {
    expect(getSpecLabel('xyz_unknown_field')).toBe('Xyz unknown field');
  });

  it('formátuje boolean jako Ano/Ne', () => {
    expect(formatSpecValue(true)).toBe('Ano');
    expect(formatSpecValue(false)).toBe('Ne');
  });

  it('formátuje number — čárka místo tečky', () => {
    expect(formatSpecValue(125)).toBe('125');
    expect(formatSpecValue(2.5)).toBe('2,5');
  });

  it('formátuje string bez změny', () => {
    expect(formatSpecValue('variabilní')).toBe('variabilní');
  });

  it('null/undefined → pomlčka', () => {
    expect(formatSpecValue(null)).toBe('—');
    expect(formatSpecValue(undefined)).toBe('—');
  });
});
