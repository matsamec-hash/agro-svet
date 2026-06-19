import { describe, it, expect } from 'vitest';
import { SLOVNIK, getSlovnik, getKategorieLabels, KATEGORIE_LABELS } from '../../src/lib/slovnik';
import { SLOVNIK_PL, KATEGORIE_LABELS_PL } from '../../src/lib/slovnik.pl';

describe('slovnik pl accessor', () => {
  it('getSlovnik("pl") vrací PL pole', () => {
    expect(getSlovnik('pl')).toBe(SLOVNIK_PL);
  });
  it('getSlovnik("cs") beze změny', () => {
    expect(getSlovnik('cs')).toBe(SLOVNIK);
  });
  it('getKategorieLabels("pl") = KATEGORIE_LABELS_PL', () => {
    expect(getKategorieLabels('pl')).toBe(KATEGORIE_LABELS_PL);
  });
  it('KATEGORIE_LABELS_PL má všech 14 kategorií', () => {
    expect(Object.keys(KATEGORIE_LABELS_PL).sort()).toEqual(Object.keys(KATEGORIE_LABELS).sort());
  });
});

describe('slovnik PL key-parita', () => {
  it('PL má stejný počet hesel jako CS', () => {
    expect(SLOVNIK_PL.length).toBe(SLOVNIK.length);
  });
  it('PL slug množina = CS slug množina', () => {
    expect([...new Set(SLOVNIK_PL.map((t) => t.slug))].sort())
      .toEqual([...new Set(SLOVNIK.map((t) => t.slug))].sort());
  });
  it('PL slugy unikátní', () => {
    expect(new Set(SLOVNIK_PL.map((t) => t.slug)).size).toBe(SLOVNIK_PL.length);
  });
  it('PL related identické s CS (per slug)', () => {
    const csRel = new Map(SLOVNIK.map((t) => [t.slug, JSON.stringify(t.related ?? [])]));
    for (const t of SLOVNIK_PL) expect(JSON.stringify(t.related ?? [])).toBe(csRel.get(t.slug));
  });
  it('PL dangling related = CS dangling (žádné nové neexistující odkazy)', () => {
    const plSlugs = new Set(SLOVNIK_PL.map((t) => t.slug));
    const csSlugs = new Set(SLOVNIK.map((t) => t.slug));
    const dangling = (arr: { related?: string[] }[], slugs: Set<string>) =>
      new Set(arr.flatMap((t) => (t.related ?? []).filter((r) => !slugs.has(r))));
    expect([...dangling(SLOVNIK_PL, plSlugs)].sort()).toEqual([...dangling(SLOVNIK, csSlugs)].sort());
  });
  it('PL kategorie = CS kategorie (per slug)', () => {
    const csKat = new Map(SLOVNIK.map((t) => [t.slug, t.kategorie]));
    for (const t of SLOVNIK_PL) expect(t.kategorie).toBe(csKat.get(t.slug));
  });
  it('PL kategorie patří do KATEGORIE_LABELS_PL', () => {
    const cats = new Set(Object.keys(KATEGORIE_LABELS_PL));
    for (const t of SLOVNIK_PL) expect(cats.has(t.kategorie)).toBe(true);
  });
  it('žádné PL heslo nemá prázdný term/shortDef/longDef', () => {
    for (const t of SLOVNIK_PL) {
      expect(t.term, t.slug).toBeTruthy();
      expect(t.shortDef, t.slug).toBeTruthy();
      expect(t.longDef, t.slug).toBeTruthy();
    }
  });
});
