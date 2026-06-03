import { describe, it, expect } from 'vitest';
import { tf, plural } from '../../src/i18n/utils';

describe('tf (interpolace)', () => {
  it('nahradí {token} parametrem', () => {
    // klíč 'test.greet' musí existovat ve slovníku; pro test použijeme reálný přidaný klíč
    expect(tf('cs', 'cat.foundedIn', { country: 'Německo' })).toBe('založeno · Německo');
    expect(tf('sk', 'cat.foundedIn', { country: 'Nemecko' })).toBe('založené · Nemecko');
  });
  it('nezná-li klíč, vrátí klíč (po fallbacku)', () => {
    expect(tf('cs', 'nonexistent.key', {})).toBe('nonexistent.key');
  });
});

describe('plural (cs/sk 1 / 2-4 / 5+)', () => {
  it('cs vybírá správný tvar', () => {
    expect(plural('cs', 1, { one: 'model', few: 'modely', many: 'modelů' })).toBe('model');
    expect(plural('cs', 3, { one: 'model', few: 'modely', many: 'modelů' })).toBe('modely');
    expect(plural('cs', 5, { one: 'model', few: 'modely', many: 'modelů' })).toBe('modelů');
    expect(plural('cs', 0, { one: 'model', few: 'modely', many: 'modelů' })).toBe('modelů');
  });
  it('sk používá stejné schéma', () => {
    expect(plural('sk', 1, { one: 'model', few: 'modely', many: 'modelov' })).toBe('model');
    expect(plural('sk', 2, { one: 'model', few: 'modely', many: 'modelov' })).toBe('modely');
    expect(plural('sk', 8, { one: 'model', few: 'modely', many: 'modelov' })).toBe('modelov');
  });
});
