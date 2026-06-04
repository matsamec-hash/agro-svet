// tests/i18n/nav.test.ts
import { describe, it, expect } from 'vitest';
import { getNav, getFooterColumns, HIDDEN_SECTIONS, isLockedSectionPath } from '../../src/i18n/nav';

describe('getNav', () => {
  it('cs vrací plný strom se 7 top-level položkami a původními labely', () => {
    const nav = getNav('cs');
    expect(nav.map((i) => i.label)).toEqual([
      'Téma', 'Zvířata', 'Technika', 'Data', 'Farmy', 'Agro bazar', 'Fotosoutěž',
    ]);
    // hrefs zachované
    expect(nav[0].href).toBe('/novinky/');
    expect(nav[2].href).toBe('/stroje/');
    // děti přeloženy a hrefs sedí
    const tech = nav[2].children!;
    expect(tech[0]).toEqual({ label: 'Všechna technika', href: '/stroje/' });
    expect(tech.find((c) => c.href === '/srovnani/')!.label).toBe('Srovnání modelů');
    // bezdětné položky nemají children
    expect(nav[4].children).toBeUndefined(); // Farmy
  });

  it('sk skryje jurisdikční/CZ-provozní sekce (data, bazar, photo)', () => {
    const nav = getNav('sk');
    expect(nav.map((i) => i.label)).toEqual([
      'Téma', 'Zvieratá', 'Technika', 'Farmy',
    ]);
    expect(nav.some((i) => i.href === '/statistiky/')).toBe(false);
    expect(nav.some((i) => i.href === '/bazar/')).toBe(false);
    expect(nav.some((i) => i.href === '/fotosoutez/')).toBe(false);
  });

  it('sk překládá zachované labely', () => {
    const nav = getNav('sk');
    expect(nav[1].label).toBe('Zvieratá');
    const tech = nav[2].children!;
    expect(tech.find((c) => c.href === '/srovnani/')!.label).toBe('Porovnanie modelov');
  });

  it('HIDDEN_SECTIONS: cs nic neskrývá', () => {
    expect(HIDDEN_SECTIONS.cs).toEqual([]);
    expect(HIDDEN_SECTIONS.sk).toEqual(expect.arrayContaining(['data', 'bazar', 'photo']));
  });
});

describe('getFooterColumns', () => {
  it('cs vrací 3 sloupce (content, bazar, photo) s původními labely', () => {
    const cols = getFooterColumns('cs');
    expect(cols.map((c) => c.heading)).toEqual(['Obsah', 'Bazar', 'Fotosoutěž']);
    expect(cols[0].links[0]).toEqual({ label: 'Novinky', href: '/novinky/' });
  });

  it('sk vrací jen sloupec Obsah (bazar+photo skryté), přeložený', () => {
    const cols = getFooterColumns('sk');
    expect(cols.map((c) => c.heading)).toEqual(['Obsah']);
    expect(cols[0].links.find((l) => l.href === '/stroje/')!.label).toBe('Katalóg techniky');
  });
});

describe('isLockedSectionPath — granularita kalkulaček (Fáze 2b)', () => {
  it('dotace-cap zůstává locked', () => {
    expect(isLockedSectionPath('/kalkulacka/dotace-cap')).toBe(true);
    expect(isLockedSectionPath('/kalkulacka/dotace-cap/')).toBe(true);
  });
  it('ostatní kalkulačky jsou odemčené', () => {
    expect(isLockedSectionPath('/kalkulacka')).toBe(false);
    expect(isLockedSectionPath('/kalkulacka/')).toBe(false);
    expect(isLockedSectionPath('/kalkulacka/prevody-jednotek')).toBe(false);
    expect(isLockedSectionPath('/kalkulacka/leasing-traktoru')).toBe(false);
  });
  it('ostatní jurisdikční sekce zůstávají locked', () => {
    expect(isLockedSectionPath('/dotace')).toBe(true);
    expect(isLockedSectionPath('/statistiky')).toBe(true);
    expect(isLockedSectionPath('/puda/ceny')).toBe(true);
  });
});
