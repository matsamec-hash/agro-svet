import { describe, it, expect } from 'vitest';
import { generateClaimToken, isTokenExpired } from './bazar-seed-token';

describe('generateClaimToken', () => {
  it('vrací URL-safe token délky ≥ 32 znaků', () => {
    const t = generateClaimToken();
    expect(t).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(t.length).toBeGreaterThanOrEqual(32);
  });
  it('generuje pokaždé jiný token', () => {
    expect(generateClaimToken()).not.toBe(generateClaimToken());
  });
});
describe('isTokenExpired', () => {
  it('true když expirace je v minulosti', () => {
    expect(isTokenExpired('2000-01-01T00:00:00Z', new Date('2026-01-01T00:00:00Z'))).toBe(true);
  });
  it('false když expirace je v budoucnosti', () => {
    expect(isTokenExpired('2099-01-01T00:00:00Z', new Date('2026-01-01T00:00:00Z'))).toBe(false);
  });
});
