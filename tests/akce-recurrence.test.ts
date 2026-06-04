// tests/akce-recurrence.test.ts
import { describe, it, expect } from 'vitest';
import {
  computeNextOccurrence,
  formatTermin,
  type TerminInput,
} from '../src/lib/akce-recurrence';

const NOW = new Date('2026-06-05T10:00:00.000Z'); // pátek

describe('computeNextOccurrence — jednorázová', () => {
  it('vrací začátek, když je v budoucnu', () => {
    const t: TerminInput = { druh: 'jednorazova', zacatek: '2026-08-28T09:00:00.000Z' };
    expect(computeNextOccurrence(t, NOW)).toBe('2026-08-28T09:00:00.000Z');
  });
  it('vrací null, když už proběhla', () => {
    const t: TerminInput = { druh: 'jednorazova', zacatek: '2026-05-01T09:00:00.000Z' };
    expect(computeNextOccurrence(t, NOW)).toBeNull();
  });
  it('počítá vícedenní akci jako probíhající dokud neskončí', () => {
    const t: TerminInput = {
      druh: 'jednorazova',
      zacatek: '2026-06-03T09:00:00.000Z',
      konec: '2026-06-07T18:00:00.000Z',
    };
    expect(computeNextOccurrence(t, NOW)).toBe('2026-06-03T09:00:00.000Z');
  });
});

describe('computeNextOccurrence — opakovaná', () => {
  it('najde nejbližší sobotu pro „každou sobotu 8–12"', () => {
    const t: TerminInput = {
      druh: 'opakovana',
      dny_v_tydnu: [6],
      cas_od: '08:00',
      cas_do: '12:00',
      plati_od: '2026-01-01',
      plati_do: null,
    };
    expect(computeNextOccurrence(t, NOW)).toBe('2026-06-06T08:00:00.000+02:00');
  });
  it('respektuje plati_do (po konci platnosti vrací null)', () => {
    const t: TerminInput = {
      druh: 'opakovana',
      dny_v_tydnu: [2],
      cas_od: '09:00',
      cas_do: '11:00',
      plati_od: '2026-01-01',
      plati_do: '2026-05-31',
    };
    expect(computeNextOccurrence(t, NOW)).toBeNull();
  });
  it('vybírá nejbližší z více dnů v týdnu (úterý a pátek)', () => {
    const t: TerminInput = {
      druh: 'opakovana',
      dny_v_tydnu: [2, 5],
      cas_od: '15:00',
      cas_do: '18:00',
      plati_od: '2026-01-01',
      plati_do: null,
    };
    expect(computeNextOccurrence(t, NOW)).toBe('2026-06-05T15:00:00.000+02:00');
  });
});

describe('formatTermin', () => {
  it('jednorázová: čitelné datum', () => {
    const t: TerminInput = { druh: 'jednorazova', zacatek: '2026-08-28T09:00:00.000Z' };
    expect(formatTermin(t)).toContain('28.');
  });
  it('opakovaná: dny + čas', () => {
    const t: TerminInput = {
      druh: 'opakovana', dny_v_tydnu: [6], cas_od: '08:00', cas_do: '12:00',
      plati_od: '2026-01-01', plati_do: null,
    };
    expect(formatTermin(t)).toContain('sobot');
    expect(formatTermin(t)).toContain('8:00');
  });
});
