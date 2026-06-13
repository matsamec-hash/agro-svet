import { describe, it, expect } from 'vitest';
import { SEASONS, seasonOfMonth, getSeason } from '../../src/lib/sezona';

describe('sezona — definice a seasonOfMonth', () => {
  it('má 4 sezóny se správnými slugy a měsíci', () => {
    expect(SEASONS.map((s) => s.slug)).toEqual(['jaro', 'leto', 'podzim', 'zima']);
    expect(getSeason('jaro')!.months).toEqual([3, 4, 5]);
    expect(getSeason('leto')!.months).toEqual([6, 7, 8]);
    expect(getSeason('podzim')!.months).toEqual([9, 10, 11]);
    expect(getSeason('zima')!.months).toEqual([12, 1, 2]);
  });

  it('seasonOfMonth správně mapuje hranice', () => {
    expect(seasonOfMonth(2)).toBe('zima');
    expect(seasonOfMonth(3)).toBe('jaro');
    expect(seasonOfMonth(5)).toBe('jaro');
    expect(seasonOfMonth(6)).toBe('leto');
    expect(seasonOfMonth(8)).toBe('leto');
    expect(seasonOfMonth(9)).toBe('podzim');
    expect(seasonOfMonth(11)).toBe('podzim');
    expect(seasonOfMonth(12)).toBe('zima');
    expect(seasonOfMonth(1)).toBe('zima');
  });

  it('getSeason vrací undefined pro neznámý slug', () => {
    expect(getSeason('foo')).toBeUndefined();
  });
});
