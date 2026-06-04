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

  it('sk skryje bazar+photo, ale data sekce je nyní viditelná (Fáze 2b A)', () => {
    // UPDATED Fáze 2b A: sekce `data` už není v HIDDEN_SECTIONS['sk'] —
    // /dotace + /kalkulacka byly odemčeny, takže `data` se servíruje (filtrovaná).
    const nav = getNav('sk');
    expect(nav.map((i) => i.label)).toEqual([
      'Téma', 'Zvieratá', 'Technika', 'Dáta', 'Farmy',
    ]);
    // top-level header sekce `data` nesmí dead-linkovat na locked /statistiky/
    expect(nav.some((i) => i.href === '/statistiky/')).toBe(false);
    expect(nav.some((i) => i.href === '/bazar/')).toBe(false);
    expect(nav.some((i) => i.href === '/fotosoutez/')).toBe(false);
  });

  it('sk nav: data sekce je viditelná a obsahuje dotace + capCalc, ne statistiky/puda', () => {
    const nav = getNav('sk');
    const data = nav.find((s) => s.section === 'data');
    expect(data).toBeTruthy();
    const hrefs = (data!.children ?? []).map((c) => c.href);
    expect(hrefs).toContain('/dotace/');
    expect(hrefs).toContain('/kalkulacka/dotace-cap/');
    expect(hrefs).not.toContain('/statistiky/');
    expect(hrefs).not.toContain('/puda/');
    // section header nesmí dead-linkovat na locked /statistiky/
    expect(data!.href).not.toBe('/statistiky/');
  });

  it('cs nav: data sekce beze změny (všech 5 dětí, header /statistiky/)', () => {
    const nav = getNav('cs');
    const data = nav.find((s) => s.section === 'data')!;
    expect(data.href).toBe('/statistiky/');
    const hrefs = (data.children ?? []).map((c) => c.href);
    expect(hrefs).toEqual(['/statistiky/', '/puda/', '/kalkulacka/', '/kalkulacka/dotace-cap/', '/dotace/']);
  });

  it('uk nav: data sekce stále skrytá', () => {
    expect(getNav('uk').find((s) => s.section === 'data')).toBeUndefined();
  });

  it('sk překládá zachované labely', () => {
    const nav = getNav('sk');
    expect(nav[1].label).toBe('Zvieratá');
    const tech = nav[2].children!;
    expect(tech.find((c) => c.href === '/srovnani/')!.label).toBe('Porovnanie modelov');
  });

  it('HIDDEN_SECTIONS: cs nic neskrývá', () => {
    expect(HIDDEN_SECTIONS.cs).toEqual([]);
    // UPDATED Fáze 2b A: `data` už sk neskrývá (jen bazar+photo); uk skrývá vše.
    expect(HIDDEN_SECTIONS.sk).toEqual(expect.arrayContaining(['bazar', 'photo']));
    expect(HIDDEN_SECTIONS.sk).not.toContain('data');
    expect(HIDDEN_SECTIONS.uk).toEqual(expect.arrayContaining(['data', 'bazar', 'photo']));
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

  it('sk footer stále skrývá locked odkazy (/puda, /statistiky)', () => {
    const cols = getFooterColumns('sk');
    const allHrefs = cols.flatMap((c) => c.links.map((l) => l.href));
    expect(allHrefs).not.toContain('/puda/');
    expect(allHrefs).not.toContain('/statistiky/');
  });
});

describe('isLockedSectionPath — granularita kalkulaček (Fáze 2b)', () => {
  it('dotace-cap zůstává locked', () => {
    // UPDATED Fáze 2b A: dotace-cap je nyní odemčena (SK kalkulačka nasazena)
    expect(isLockedSectionPath('/kalkulacka/dotace-cap')).toBe(false);
    expect(isLockedSectionPath('/kalkulacka/dotace-cap/')).toBe(false);
  });
  it('ostatní kalkulačky jsou odemčené', () => {
    expect(isLockedSectionPath('/kalkulacka')).toBe(false);
    expect(isLockedSectionPath('/kalkulacka/')).toBe(false);
    expect(isLockedSectionPath('/kalkulacka/prevody-jednotek')).toBe(false);
    expect(isLockedSectionPath('/kalkulacka/leasing-traktoru')).toBe(false);
  });
  it('ostatní jurisdikční sekce zůstávají locked', () => {
    // UPDATED Fáze 2b A: /dotace je nyní odemčena; /statistiky a /puda zůstávají
    expect(isLockedSectionPath('/dotace')).toBe(false);
    expect(isLockedSectionPath('/statistiky')).toBe(true);
    expect(isLockedSectionPath('/puda/ceny')).toBe(true);
  });

  it('Fáze 2b A: /dotace a /kalkulacka/dotace-cap NEJSOU locked', () => {
    expect(isLockedSectionPath('/dotace')).toBe(false);
    expect(isLockedSectionPath('/dotace/investice')).toBe(false);
    expect(isLockedSectionPath('/kalkulacka/dotace-cap')).toBe(false);
  });

  it('/statistiky a /puda zůstávají locked (balíky B/C)', () => {
    expect(isLockedSectionPath('/statistiky')).toBe(true);
    expect(isLockedSectionPath('/puda')).toBe(true);
  });
});
