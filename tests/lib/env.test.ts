import { describe, it, expect, afterEach } from 'vitest';
import { getEnvVar } from '../../src/lib/env';

describe('getEnvVar', () => {
  afterEach(() => {
    delete process.env.AGRO_TEST_KEY;
  });

  it('reads a value from process.env', () => {
    process.env.AGRO_TEST_KEY = 'hello';
    expect(getEnvVar('AGRO_TEST_KEY')).toBe('hello');
  });

  it('returns undefined for a missing key', () => {
    expect(getEnvVar('AGRO_DEFINITELY_MISSING_KEY')).toBeUndefined();
  });

  it('treats an empty string as missing', () => {
    process.env.AGRO_TEST_KEY = '';
    expect(getEnvVar('AGRO_TEST_KEY')).toBeUndefined();
  });
});
