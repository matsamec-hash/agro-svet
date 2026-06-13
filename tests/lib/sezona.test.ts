import { describe, it, expect } from 'vitest';
import { SEASONS, seasonOfMonth, getSeason } from '../../src/lib/sezona';
import { cropsSownInMonth, cropsHarvestedInMonth, cropsSownInSeason, cropsHarvestedInSeason } from '../../src/lib/sezona';

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

describe('sezona — crop filtry (reálná plodiny data)', () => {
  it('cropsSownInMonth(3) obsahuje jecmen-jarni', () => {
    expect(cropsSownInMonth(3).map((p) => p.slug)).toContain('jecmen-jarni');
  });

  it('cropsSownInMonth(9) obsahuje psenice-ozima, ne jecmen-jarni', () => {
    const slugs = cropsSownInMonth(9).map((p) => p.slug);
    expect(slugs).toContain('psenice-ozima');
    expect(slugs).not.toContain('jecmen-jarni');
  });

  it('cropsHarvestedInMonth(8) obsahuje brambory', () => {
    expect(cropsHarvestedInMonth(8).map((p) => p.slug)).toContain('brambory');
  });

  it('cropsSownInSeason(jaro) obsahuje jarní obiloviny', () => {
    const slugs = cropsSownInSeason('jaro').map((p) => p.slug);
    expect(slugs).toContain('jecmen-jarni');
    expect(slugs).toContain('psenice-jarni');
  });

  it('cropsHarvestedInSeason(podzim) obsahuje kukurice', () => {
    expect(cropsHarvestedInSeason('podzim').map((p) => p.slug)).toContain('kukurice');
  });

  it('filtry vrací plodiny seřazené dle name (cs)', () => {
    const arr = cropsSownInSeason('jaro');
    const names = arr.map((p) => p.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'cs')));
  });
});
