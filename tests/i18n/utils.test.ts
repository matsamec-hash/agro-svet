import { describe, it, expect } from 'vitest';
import {
  getLocaleFromUrl, stripLocale, localizePath, getAlternates, isSkLaunchedPath, langSwitchHref,
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

describe('isSkLaunchedPath — kalkulačky (Fáze 2b launch)', () => {
  it('launchnuté kalkulačky jsou indexovatelné', () => {
    expect(isSkLaunchedPath('/kalkulacka')).toBe(true);
    expect(isSkLaunchedPath('/kalkulacka/')).toBe(true);
    expect(isSkLaunchedPath('/kalkulacka/prevody-jednotek')).toBe(true);
    expect(isSkLaunchedPath('/kalkulacka/leasing-traktoru')).toBe(true);
  });
  it('dříve launchnuté sekce zůstávají', () => {
    expect(isSkLaunchedPath('/stroje')).toBe(true);
    expect(isSkLaunchedPath('/novinky')).toBe(true);
  });
  it('nelaunchnuté sekce zůstávají false', () => {
    expect(isSkLaunchedPath('/slovnik')).toBe(false);
  });

  it('/dotace je SK-launched', () => {
    expect(isSkLaunchedPath('/dotace')).toBe(true);
    expect(isSkLaunchedPath('/dotace/investice')).toBe(true);
  });
});

describe('langSwitchHref', () => {
  const hidden = ['dotace', 'legislativa'];

  it('cs cíl vrací cestu beze změny', () => {
    expect(langSwitchHref('cs', '/novinky/kategorie/dotace/', hidden)).toBe('/novinky/kategorie/dotace/');
  });

  it('skrytá SK kategorie → SK novinky hub místo 404', () => {
    expect(langSwitchHref('sk', '/novinky/kategorie/dotace/', hidden)).toBe('/sk/novinky/');
    expect(langSwitchHref('sk', '/novinky/kategorie/legislativa/', hidden)).toBe('/sk/novinky/');
  });

  it('odemčená kategorie (trh) → normální /sk cesta', () => {
    expect(langSwitchHref('sk', '/novinky/kategorie/trh/', hidden)).toBe('/sk/novinky/kategorie/trh/');
  });

  it('launchnutá ne-novinková sekce → /sk cesta', () => {
    expect(langSwitchHref('sk', '/stroje/traktory/', hidden)).toBe('/sk/stroje/traktory/');
  });

  it('nelaunchnutá sekce (bazar) → SK home místo 404', () => {
    expect(langSwitchHref('sk', '/bazar/', hidden)).toBe('/sk/');
  });

  it('home → SK home', () => {
    expect(langSwitchHref('sk', '/', hidden)).toBe('/sk/');
  });
});
