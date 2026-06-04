// tests/akce.test.ts
import { describe, it, expect } from 'vitest';
import { slugifyAkce, validateAkceInput, type AkceInput } from '../src/lib/akce';

describe('slugifyAkce', () => {
  it('diakritika → ASCII, mezery → pomlčky', () => {
    expect(slugifyAkce('Prodej kachen', 'Teplýšovice')).toBe('prodej-kachen-teplysovice');
  });
  it('přidá krátký suffix pro unikátnost', () => {
    const s = slugifyAkce('Polní den', 'Žatec', 'a1b2');
    expect(s).toBe('polni-den-zatec-a1b2');
  });
  it('ořízne přebytečné pomlčky', () => {
    expect(slugifyAkce('  Trh  ', '—Brno—')).toBe('trh-brno');
  });
});

describe('validateAkceInput', () => {
  const base: AkceInput = {
    nazev: 'Farmářské trhy',
    typ: 'farmarske-trhy',
    druh: 'jednorazova',
    zacatek: '2026-08-01T09:00:00.000Z',
    obec: 'Benešov',
    kraj_slug: 'stredocesky',
    okres_slug: 'benesov',
    email: 'a@b.cz',
    popis: 'Pravidelné trhy na náměstí.',
  };
  it('validní jednorázová projde', () => {
    expect(validateAkceInput(base).ok).toBe(true);
  });
  it('chybí název → chyba', () => {
    expect(validateAkceInput({ ...base, nazev: '' }).ok).toBe(false);
  });
  it('neznámý typ → chyba', () => {
    expect(validateAkceInput({ ...base, typ: 'xxx' as AkceInput['typ'] }).ok).toBe(false);
  });
  it('špatný e-mail → chyba', () => {
    expect(validateAkceInput({ ...base, email: 'neni-email' }).ok).toBe(false);
  });
  it('opakovaná bez dnů v týdnu → chyba', () => {
    const r = validateAkceInput({
      ...base, druh: 'opakovana', zacatek: undefined,
      dny_v_tydnu: [], cas_od: '08:00', plati_od: '2026-01-01',
    });
    expect(r.ok).toBe(false);
  });
});
