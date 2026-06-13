import { describe, it, expect } from 'vitest';
import { pudaBigNumbers, pudaCenaInsight } from '../../src/lib/puda-derived';

const data = {
  generated: 'X',
  cena: { unit: 'EUR/ha', agriprod: 'ARAXIB', series: [{ year: 2017, value: 3244 }, { year: 2024, value: 5743 }] },
  najem: { unit: 'EUR/ha/rok', agriprod: 'ARA_J0000', series: [{ year: 2011, value: 37 }, { year: 2024, value: 69 }] },
  plodiny: [],
};

describe('pudaBigNumbers (sk)', () => {
  it('odvodí cenu 2024, růst za období a nájem 2024', () => {
    const bn = pudaBigNumbers(data, 'sk');
    expect(bn.cena).toBe(5743);
    expect(bn.cenaYear).toBe(2024);
    expect(bn.najem).toBe(69);
    expect(bn.najemYear).toBe(2024);
    expect(bn.rustPct).toBe(77);
    expect(bn.rustFrom).toBe(2017);
  });
});

describe('pudaCenaInsight', () => {
  it('sk insight obsahuje cenu a růst', () => {
    const txt = pudaCenaInsight(data, 'sk');
    expect(txt).toContain('5 743');
    expect(txt).toMatch(/77\s*%/);
    expect(txt).not.toMatch(/[řěů]/);
  });
});
