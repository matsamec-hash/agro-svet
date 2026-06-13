import { describe, it, expect } from 'vitest';
import { locales, defaultLocale, isLocale, localeNames } from '../../src/i18n/config';

describe('i18n config', () => {
  it('obsahuje cs, sk, uk a default je cs', () => {
    expect(locales).toEqual(['cs', 'sk', 'uk']);
    expect(defaultLocale).toBe('cs');
  });

  it('isLocale rozpozná platné a odmítne neplatné', () => {
    expect(isLocale('sk')).toBe(true);
    expect(isLocale('uk')).toBe(true);
    expect(isLocale('cs')).toBe(true);
    expect(isLocale('stroje')).toBe(false);
    expect(isLocale('en')).toBe(false);
  });

  it('má lidský název pro každý locale', () => {
    expect(localeNames.cs).toBe('Čeština');
    expect(localeNames.sk).toBe('Slovenčina');
    expect(localeNames.uk).toBe('Українська');
  });
});
