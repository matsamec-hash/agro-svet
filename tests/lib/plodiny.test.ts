import { describe, it, expect } from 'vitest';
import { listPlodiny, getPlodina, SKUPINA_LABELS } from '../../src/lib/plodiny';

describe('plodiny lib — jádro', () => {
  it('listPlodiny vrací plodiny seřazené dle name', () => {
    const all = listPlodiny();
    expect(all.length).toBeGreaterThan(0);
    expect(all.find((p) => p.slug === 'oves')).toBeTruthy();
  });

  it('getPlodina spojí obohacující vrstvu s faktickými odrůdami', () => {
    const oves = getPlodina('oves');
    expect(oves).toBeTruthy();
    expect(oves!.name).toBe('Oves setý');
    expect(oves!.skupina).toBe('obiloviny');
    expect(oves!.odrudy.length).toBe(3);
    expect(oves!.odrudy.map((o) => o.slug)).toContain('atego');
  });

  it('getPlodina vrací undefined pro neznámou plodinu', () => {
    expect(getPlodina('neexistuje')).toBeUndefined();
  });

  it('žádná plodina nemá rezervovaný slug "skupina"', () => {
    expect(listPlodiny().some((p) => p.slug === 'skupina')).toBe(false);
  });

  it('SKUPINA_LABELS pokrývá použité skupiny', () => {
    for (const p of listPlodiny()) {
      expect(SKUPINA_LABELS[p.skupina]).toBeTruthy();
    }
  });
});
