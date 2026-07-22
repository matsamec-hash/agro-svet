import { describe, it, expect } from 'vitest';
import { isValidVs, vsToString } from '../../src/lib/bazar-vs';

describe('bazar-vs', () => {
  it('VS je číselný, 1–10 číslic', () => {
    expect(isValidVs(10000000)).toBe(true);
    expect(isValidVs(1)).toBe(true);
    expect(isValidVs(0)).toBe(false);
    expect(isValidVs(-5)).toBe(false);
    expect(isValidVs(12345678901)).toBe(false);
  });
  it('vsToString bez mezer/písmen', () => {
    expect(vsToString(10000001)).toBe('10000001');
  });
});
