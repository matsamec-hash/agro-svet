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
