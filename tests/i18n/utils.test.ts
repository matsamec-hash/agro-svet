import { describe, it, expect } from 'vitest';
import {
  getLocaleFromUrl, stripLocale, localizePath, getAlternates,
} from '../../src/i18n/utils';

describe('getLocaleFromUrl', () => {
  it('root a cs cesty → cs', () => {
    expect(getLocaleFromUrl(new URL('https://agro-svet.cz/'))).toBe('cs');
    expect(getLocaleFromUrl(new URL('https://agro-svet.cz/stroje/'))).toBe('cs');
  });
  it('prefix /sk/ a /uk/ → sk/uk', () => {
    expect(getLocaleFromUrl(new URL('https://agro-svet.cz/sk/stroje/'))).toBe('sk');
    expect(getLocaleFromUrl(new URL('https://agro-svet.cz/uk/'))).toBe('uk');
  });
});

describe('stripLocale', () => {
  it('odstraní prefix a vrátí cs-root path', () => {
    expect(stripLocale('/sk/stroje/')).toEqual({ locale: 'sk', path: '/stroje/' });
    expect(stripLocale('/uk/')).toEqual({ locale: 'uk', path: '/' });
    expect(stripLocale('/stroje/')).toEqual({ locale: 'cs', path: '/stroje/' });
  });
});

describe('localizePath', () => {
  it('cs = bez prefixu (root beze změny)', () => {
    expect(localizePath('cs', '/stroje/')).toBe('/stroje/');
    expect(localizePath('cs', '/')).toBe('/');
  });
  it('sk/uk přidá prefix, zachová trailing slash', () => {
    expect(localizePath('sk', '/stroje/')).toBe('/sk/stroje/');
    expect(localizePath('uk', '/')).toBe('/uk/');
  });
});

describe('getAlternates (hreflang)', () => {
  it('vrátí cs/sk/uk + x-default, symetricky z libovolného locale', () => {
    const fromCs = getAlternates('/stroje/');
    const fromSk = getAlternates('/sk/stroje/');
    expect(fromCs).toEqual(fromSk);
    expect(fromCs).toEqual([
      { hreflang: 'cs', href: 'https://agro-svet.cz/stroje/' },
      { hreflang: 'sk', href: 'https://agro-svet.cz/sk/stroje/' },
      { hreflang: 'uk', href: 'https://agro-svet.cz/uk/stroje/' },
      { hreflang: 'x-default', href: 'https://agro-svet.cz/stroje/' },
    ]);
  });
});
