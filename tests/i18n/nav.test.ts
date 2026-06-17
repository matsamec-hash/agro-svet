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
    // top-level header sekce `data` nyní ukazuje na /statistiky/ (odemčeno Fáze 2b B)
    expect(nav.some((i) => i.href === '/statistiky/')).toBe(true);
    expect(nav.some((i) => i.href === '/bazar/')).toBe(false);
    expect(nav.some((i) => i.href === '/fotosoutez/')).toBe(false);
  });

  it('sk nav: data sekce je viditelná a obsahuje dotace + capCalc + statistiky + puda', () => {
    // UPDATED Fáze 2b C: /puda odemčena → LOCKED_SECTION_PREFIXES prázdné,
    // getNav už nefiltruje žádné `data` dítě (i sk vidí celou sekci).
    const nav = getNav('sk');
    const data = nav.find((s) => s.section === 'data');
    expect(data).toBeTruthy();
    const hrefs = (data!.children ?? []).map((c) => c.href);
    expect(hrefs).toContain('/dotace/');
    expect(hrefs).toContain('/kalkulacka/dotace-cap/');
    expect(hrefs).toContain('/statistiky/');
    expect(hrefs).toContain('/puda/');
    // section header ukazuje na /statistiky/ (odemčeno, je to první/hlavní dítě)
    expect(data!.href).toBe('/statistiky/');
  });

  it('cs nav: data sekce beze změny (všech 5 dětí, header /statistiky/)', () => {
    const nav = getNav('cs');
    const data = nav.find((s) => s.section === 'data')!;
    expect(data.href).toBe('/statistiky/');
    const hrefs = (data.children ?? []).map((c) => c.href);
    expect(hrefs).toEqual(['/statistiky/', '/puda/', '/kalkulacka/', '/kalkulacka/dotace-cap/', '/dotace/']);
  });

  it('uk nav: data sekce viditelná, jen launchnuté děti (statistiky/puda/dotace; kalkulačky vynechané)', () => {
    const data = getNav('uk').find((s) => s.section === 'data');
    expect(data).toBeTruthy();
    const hrefs = (data!.children ?? []).map((c) => c.href);
    expect(hrefs).toEqual(['/statistiky/', '/puda/', '/dotace/']);
    expect(hrefs).not.toContain('/kalkulacka/');
    expect(hrefs).not.toContain('/kalkulacka/dotace-cap/');
    // header sekce ukazuje na první launchnuté dítě (/statistiky/ je launchnuté pro uk)
    expect(data!.href).toBe('/statistiky/');
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
    // UPDATED: uk už `data` neskrývá (statistiky/puda/dotace launchnuté → header je zobrazí).
    expect(HIDDEN_SECTIONS.uk).toEqual(expect.arrayContaining(['bazar', 'photo']));
    expect(HIDDEN_SECTIONS.uk).not.toContain('data');
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

  it('sk footer zobrazuje odemčené /statistiky i /puda (Fáze 2b B+C)', () => {
    // UPDATED Fáze 2b C: /puda odemčena → přítomná i v sk footeru
    const cols = getFooterColumns('sk');
    const allHrefs = cols.flatMap((c) => c.links.map((l) => l.href));
    expect(allHrefs).toContain('/puda/');
    expect(allHrefs).toContain('/statistiky/');
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
  it('všechny `data` jurisdikční sekce jsou odemčené (Fáze 2b C)', () => {
    // UPDATED Fáze 2b C: /puda odemčena → žádná `data` sekce už není locked
    expect(isLockedSectionPath('/dotace')).toBe(false);
    expect(isLockedSectionPath('/statistiky')).toBe(false);
    expect(isLockedSectionPath('/puda/ceny')).toBe(false);
  });

  it('Fáze 2b A: /dotace a /kalkulacka/dotace-cap NEJSOU locked', () => {
    expect(isLockedSectionPath('/dotace')).toBe(false);
    expect(isLockedSectionPath('/dotace/investice')).toBe(false);
    expect(isLockedSectionPath('/kalkulacka/dotace-cap')).toBe(false);
  });

  it('/statistiky (balík B) i /puda (balík C) jsou odemčené', () => {
    // UPDATED Fáze 2b C: /puda je nyní odemčena
    expect(isLockedSectionPath('/statistiky')).toBe(false);
    expect(isLockedSectionPath('/puda')).toBe(false);
  });
});
