// tests/i18n/nav.test.ts
import { describe, it, expect } from 'vitest';
import { getNav, getFooterColumns, HIDDEN_SECTIONS, isLockedSectionPath } from '../../src/i18n/nav';

describe('getNav', () => {
  it('cs top-level strom — Svět je nově podsekce Data (ne top-level), bazar skrytý', () => {
    const nav = getNav('cs');
    // 'Svět' už NENÍ top-level (přesunut pod Data 2026-06-21); 'bazar' je dočasně
    // skrytý i pro cs (vyčerpaný SMTP rate limit) → ve viditelném stromu chybí.
    expect(nav.map((i) => i.label)).toEqual([
      'Téma', 'Zvířata', 'Technika', 'Data', 'Farmy', 'Fotosoutěž',
    ]);
    expect(nav.some((i) => i.label === 'Svět')).toBe(false);
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

  it('cs nav: data sekce má 5 původních dětí + Svět (profily/srovnání) na konci', () => {
    const nav = getNav('cs');
    const data = nav.find((s) => s.section === 'data')!;
    expect(data.href).toBe('/statistiky/');
    const hrefs = (data.children ?? []).map((c) => c.href);
    expect(hrefs).toEqual([
      '/statistiky/', '/puda/', '/kalkulacka/', '/kalkulacka/dotace-cap/', '/dotace/',
      '/svet/', '/svet/srovnani/',
    ]);
  });

  it('non-cs nav: /svet děti (cs-only) se v data sekci NEzobrazí', () => {
    for (const loc of ['sk', 'uk', 'pl'] as const) {
      const data = getNav(loc).find((s) => s.section === 'data');
      const hrefs = (data?.children ?? []).map((c) => c.href);
      expect(hrefs).not.toContain('/svet/');
      expect(hrefs).not.toContain('/svet/srovnani/');
    }
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

  it('uk nav: jen sekce s UA obsahem — tech + data (tema/animals/farms skryté)', () => {
    const nav = getNav('uk');
    expect(nav.map((i) => i.section)).toEqual(['tech', 'data']);
    // top-level hrefs = launchnuté cs-root cesty (navHref je lokalizuje na /uk/)
    expect(nav.find((s) => s.section === 'tech')!.href).toBe('/stroje/');
    expect(nav.find((s) => s.section === 'data')!.href).toBe('/statistiky/');
  });

  it('uk nav: tech sekce jen launchnuté děti (žádné žebříčky/kvíz/prodejci do cs)', () => {
    const tech = getNav('uk').find((s) => s.section === 'tech')!;
    const hrefs = (tech.children ?? []).map((c) => c.href);
    // launchnuté pro uk
    expect(hrefs).toContain('/stroje/');
    expect(hrefs).toContain('/znacky/');
    expect(hrefs).toContain('/srovnani/');
    expect(hrefs).toContain('/slovnik/');
    // NElaunchnuté → vyfiltrované (vedly by do češtiny)
    expect(hrefs).not.toContain('/zebricky/');
    expect(hrefs).not.toContain('/kviz/');
    expect(hrefs).not.toContain('/prodejci/');
  });

  it('sk překládá zachované labely', () => {
    const nav = getNav('sk');
    expect(nav[1].label).toBe('Zvieratá');
    const tech = nav[2].children!;
    expect(tech.find((c) => c.href === '/srovnani/')!.label).toBe('Porovnanie modelov');
  });

  it('HIDDEN_SECTIONS: cs skrývá jen bazar (dočasně, rozbitá SMTP registrace)', () => {
    expect(HIDDEN_SECTIONS.cs).toEqual(['bazar']);
    // UPDATED Fáze 2b A: `data` už sk neskrývá (jen bazar+photo); uk skrývá vše.
    expect(HIDDEN_SECTIONS.sk).toEqual(expect.arrayContaining(['bazar', 'photo']));
    expect(HIDDEN_SECTIONS.sk).not.toContain('data');
    // UPDATED: uk už `data` neskrývá (statistiky/puda/dotace launchnuté → header je zobrazí).
    expect(HIDDEN_SECTIONS.uk).toEqual(expect.arrayContaining(['bazar', 'photo']));
    expect(HIDDEN_SECTIONS.uk).not.toContain('data');
  });
});

describe('getFooterColumns', () => {
  it('cs vrací 2 sloupce (content, photo) — bazar sloupec dočasně skrytý', () => {
    const cols = getFooterColumns('cs');
    expect(cols.map((c) => c.heading)).toEqual(['Obsah', 'Fotosoutěž']);
    expect(cols[0].links[0]).toEqual({ label: 'Novinky', href: '/novinky/' });
  });

  it('sk vrací jen sloupec Obsah (bazar+photo skryté), přeložený', () => {
    const cols = getFooterColumns('sk');
    expect(cols.map((c) => c.heading)).toEqual(['Obsah']);
    expect(cols[0].links.find((l) => l.href === '/stroje/')!.label).toBe('Katalóg techniky');
  });

  it('uk footer: sloupec Obsah jen launchnuté odkazy (bez /novinky/, /plemena/)', () => {
    const cols = getFooterColumns('uk');
    expect(cols.map((c) => c.section)).toEqual(['content']);
    const hrefs = cols[0].links.map((l) => l.href);
    expect(hrefs).toContain('/stroje/');
    expect(hrefs).toContain('/puda/');
    expect(hrefs).toContain('/statistiky/');
    expect(hrefs).not.toContain('/novinky/');
    expect(hrefs).not.toContain('/plemena/');
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
