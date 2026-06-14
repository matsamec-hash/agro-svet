import { describe, it, expect } from 'vitest';
import { SLOVNIK, getSlovnik, getSlovnikTerm, getKategorieLabels, KATEGORIE_LABELS } from '../../src/lib/slovnik';
import { SLOVNIK_UK, KATEGORIE_LABELS_UK } from '../../src/lib/slovnik.uk';

describe('slovnik locale-aware accessory', () => {
  it('getSlovnik("cs") vrací CS pole beze změny (identita)', () => {
    expect(getSlovnik('cs')).toBe(SLOVNIK);
  });
  it('getSlovnik() bez argumentu = cs (zpětná kompatibilita)', () => {
    expect(getSlovnik()).toBe(SLOVNIK);
  });
  it('getSlovnik("uk") vrací UK pole', () => {
    expect(getSlovnik('uk')).toBe(SLOVNIK_UK);
  });
  it('neznámý locale → fallback na CS', () => {
    expect(getSlovnik('xx')).toBe(SLOVNIK);
  });
  it('getSlovnikTerm(slug,"cs") = dnešní chování', () => {
    expect(getSlovnikTerm('adblue', 'cs')?.term).toBe('AdBlue');
  });
  it('getSlovnikTerm(slug) bez locale = cs', () => {
    expect(getSlovnikTerm('adblue')?.term).toBe('AdBlue');
  });
  it('getKategorieLabels("cs") = KATEGORIE_LABELS', () => {
    expect(getKategorieLabels('cs')).toBe(KATEGORIE_LABELS);
  });
  it('getKategorieLabels("uk") = KATEGORIE_LABELS_UK', () => {
    expect(getKategorieLabels('uk')).toBe(KATEGORIE_LABELS_UK);
  });
  it('KATEGORIE_LABELS_UK má všech 14 kategorií', () => {
    expect(Object.keys(KATEGORIE_LABELS_UK).sort()).toEqual(Object.keys(KATEGORIE_LABELS).sort());
  });
});

describe('slovnik UK key-parita', () => {
  it('UK má stejný počet hesel jako CS', () => {
    expect(SLOVNIK_UK.length).toBe(SLOVNIK.length);
  });
  it('UK slug množina = CS slug množina', () => {
    const cs = new Set(SLOVNIK.map((t) => t.slug));
    const uk = new Set(SLOVNIK_UK.map((t) => t.slug));
    expect([...uk].sort()).toEqual([...cs].sort());
  });
  it('UK slugy jsou unikátní (žádné duplicity)', () => {
    expect(new Set(SLOVNIK_UK.map((t) => t.slug)).size).toBe(SLOVNIK_UK.length);
  });
  it('UK related je identické s CS (per slug) — slugy se nepřekládají', () => {
    const csRel = new Map(SLOVNIK.map((t) => [t.slug, JSON.stringify(t.related ?? [])]));
    for (const t of SLOVNIK_UK) expect(JSON.stringify(t.related ?? [])).toBe(csRel.get(t.slug));
  });
  it('UK related nezavádí nové neexistující odkazy oproti CS (pre-existing 3 dangling tolerováno)', () => {
    const ukSlugs = new Set(SLOVNIK_UK.map((t) => t.slug));
    const csSlugs = new Set(SLOVNIK.map((t) => t.slug));
    const dangling = (arr: { related?: string[] }[], slugs: Set<string>) =>
      new Set(arr.flatMap((t) => (t.related ?? []).filter((r) => !slugs.has(r))));
    expect([...dangling(SLOVNIK_UK, ukSlugs)].sort()).toEqual([...dangling(SLOVNIK, csSlugs)].sort());
  });
  it('UK kategorie = CS kategorie (per slug)', () => {
    const csKat = new Map(SLOVNIK.map((t) => [t.slug, t.kategorie]));
    for (const t of SLOVNIK_UK) expect(t.kategorie).toBe(csKat.get(t.slug));
  });
  it('UK kategorie patří do KATEGORIE_LABELS_UK', () => {
    const cats = new Set(Object.keys(KATEGORIE_LABELS_UK));
    for (const t of SLOVNIK_UK) expect(cats.has(t.kategorie)).toBe(true);
  });
});
