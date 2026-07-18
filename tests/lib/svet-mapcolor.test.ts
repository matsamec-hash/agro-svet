import { describe, it, expect } from 'vitest';
import { rampColor, extent, colorFor } from '../../src/lib/svet/mapcolor';

describe('rampColor', () => {
  it('t=0 → světlá, t=1 → tmavá, ořezává mimo [0,1]', () => {
    expect(rampColor(0)).toBe('#f0f7ea');
    expect(rampColor(1)).toBe('#1f5c1f');
    expect(rampColor(-5)).toBe('#f0f7ea');
    expect(rampColor(9)).toBe('#1f5c1f');
    expect(rampColor(NaN)).toBe('#f0f7ea');
  });
});

describe('extent', () => {
  it('min/max ignoruje null/undefined; prázdné → 0..1', () => {
    expect(extent([3, null, 7, undefined, 1])).toEqual({ min: 1, max: 7 });
    expect(extent([null, undefined])).toEqual({ min: 0, max: 1 });
  });
});

describe('colorFor', () => {
  it('chybějící hodnota → neutrální šedá', () => {
    expect(colorFor(null, 0, 10)).toBe('#e7e9e1');
    expect(colorFor(undefined as any, 0, 10)).toBe('#e7e9e1');
  });
  it('krajní hodnoty mapuje na krajní barvy škály', () => {
    expect(colorFor(0, 0, 10)).toBe('#f0f7ea');
    expect(colorFor(10, 0, 10)).toBe('#1f5c1f');
  });
  it('min==max → střed škály (bez dělení nulou)', () => {
    expect(colorFor(5, 5, 5)).toBe(rampColor(0.5));
  });
});
