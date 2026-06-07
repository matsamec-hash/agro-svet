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

describe('plural — uk (východoslovanská pravidla: one / few / many s mod-100 výjimkami)', () => {
  const f = { one: 'модель', few: 'моделі', many: 'моделей' };
  it('one: n%10==1 & n%100!=11', () => {
    expect(plural('uk', 1, f)).toBe('модель');
    expect(plural('uk', 21, f)).toBe('модель');
    expect(plural('uk', 101, f)).toBe('модель');
  });
  it('few: n%10 in 2..4 & n%100 not in 12..14', () => {
    expect(plural('uk', 2, f)).toBe('моделі');
    expect(plural('uk', 3, f)).toBe('моделі');
    expect(plural('uk', 4, f)).toBe('моделі');
    expect(plural('uk', 22, f)).toBe('моделі');
    expect(plural('uk', 34, f)).toBe('моделі');
  });
  it('many: zbytek vč. 0, 5–20, 11–14, x5–x9', () => {
    expect(plural('uk', 0, f)).toBe('моделей');
    expect(plural('uk', 5, f)).toBe('моделей');
    expect(plural('uk', 11, f)).toBe('моделей'); // n%100==11 → many i když n%10==1
    expect(plural('uk', 12, f)).toBe('моделей');
    expect(plural('uk', 14, f)).toBe('моделей');
    expect(plural('uk', 25, f)).toBe('моделей');
    expect(plural('uk', 111, f)).toBe('моделей');
  });
});
