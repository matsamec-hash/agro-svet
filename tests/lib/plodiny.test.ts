import { describe, it, expect } from 'vitest';
import { listPlodiny, getPlodina, SKUPINA_LABELS } from '../../src/lib/plodiny';
import { isOdrudaIndexable, listIndexableOdrudy, getOdruda } from '../../src/lib/plodiny';
import { listSkupiny, listPlodinyBySkupina, listUdrzovatele, getUdrzovatel, udrzovatelSlug } from '../../src/lib/plodiny';

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

describe('plodiny lib — guardrail odrůd', () => {
  it('obohacená odrůda je indexovatelná', () => {
    const zlatak = getOdruda('oves', 'zlatak');
    expect(zlatak).toBeTruthy();
    expect(isOdrudaIndexable(zlatak!)).toBe(true);
  });

  it('holá odrůda bez obohacení není indexovatelná', () => {
    const korok = getOdruda('oves', 'korok');
    expect(korok).toBeTruthy();
    expect(isOdrudaIndexable(korok!)).toBe(false);
  });

  it('listIndexableOdrudy vrací jen obohacené odrůdy s plodina_slug', () => {
    const idx = listIndexableOdrudy();
    expect(idx.every((e) => isOdrudaIndexable(e.odruda))).toBe(true);
    expect(idx.some((e) => e.odruda.slug === 'zlatak' && e.plodina_slug === 'oves')).toBe(true);
    expect(idx.some((e) => e.odruda.slug === 'korok')).toBe(false);
  });
});

describe('plodiny lib — facety', () => {
  it('listSkupiny vrací použité skupiny s počty', () => {
    const sk = listSkupiny();
    expect(sk.find((s) => s.skupina === 'obiloviny')?.count).toBeGreaterThanOrEqual(1);
  });

  it('listPlodinyBySkupina filtruje dle skupiny', () => {
    const obi = listPlodinyBySkupina('obiloviny');
    expect(obi.every((p) => p.skupina === 'obiloviny')).toBe(true);
    expect(obi.some((p) => p.slug === 'oves')).toBe(true);
  });

  it('udrzovatelSlug je deterministický ASCII slug', () => {
    expect(udrzovatelSlug('Selgen, a.s.')).toBe('selgen-a-s');
  });

  it('listUdrzovatele agreguje odrůdy dle udržovatele', () => {
    const u = listUdrzovatele();
    const selgen = u.find((x) => x.slug === 'selgen-a-s');
    expect(selgen).toBeTruthy();
    expect(selgen!.odrudy.length).toBeGreaterThanOrEqual(2);
  });

  it('getUdrzovatel vrací odrůdy daného udržovatele', () => {
    const selgen = getUdrzovatel('selgen-a-s');
    expect(selgen?.name).toBe('Selgen, a.s.');
    expect(selgen!.odrudy.some((e) => e.odruda.slug === 'zlatak')).toBe(true);
  });
});
