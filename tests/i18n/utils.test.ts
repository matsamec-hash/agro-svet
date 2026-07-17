import { describe, it, expect } from 'vitest';
import {
  getLocaleFromUrl, stripLocale, localizePath, getAlternates, isSkLaunchedPath, langSwitchHref,
  isLaunchedPath, LAUNCHED_PREFIXES, navHref, localizeInternalHref,
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
  it('vrátí cs/sk/uk/pl + x-default, symetricky z libovolného locale', () => {
    const fromCs = getAlternates('/stroje/');
    const fromSk = getAlternates('/sk/stroje/');
    expect(fromCs).toEqual(fromSk);
    expect(fromCs).toEqual([
      { hreflang: 'cs', href: 'https://agro-svet.cz/stroje/' },
      { hreflang: 'sk', href: 'https://agro-svet.cz/sk/stroje/' },
      { hreflang: 'uk', href: 'https://agro-svet.cz/uk/stroje/' },
      { hreflang: 'pl', href: 'https://agro-svet.cz/pl/stroje/' },
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

describe('isLaunchedPath (per-locale)', () => {
  it('cs nemá nic launchnuto (default bez prefixu)', () => {
    expect(LAUNCHED_PREFIXES.cs).toEqual([]);
    expect(isLaunchedPath('cs', '/stroje/')).toBe(false);
  });
  it('sk = zachované chování isSkLaunchedPath', () => {
    expect(isLaunchedPath('sk', '/stroje/')).toBe(isSkLaunchedPath('/stroje/'));
    expect(isLaunchedPath('sk', '/stroje/john-deere/')).toBe(true);
    expect(isLaunchedPath('sk', '/bazar/')).toBe(false);
  });
  it('isSkLaunchedPath je tenký alias na isLaunchedPath("sk", …)', () => {
    expect(isSkLaunchedPath('/znacky/')).toBe(isLaunchedPath('sk', '/znacky/'));
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

describe('navHref/langSwitchHref per-locale (uk po launchi fáze 2)', () => {
  it('uk: nelaunchnutá sekce zůstává na cs href (žádný /uk prefix)', () => {
    // /kalkulacka není pro uk launchnuté → drží se na cs.
    // (Pozn.: jurisdikční data /statistiky i /dotace už pro uk launchnuté JSOU,
    //  takže jako příklad nelaunchnuté uk sekce slouží /kalkulacka.)
    expect(navHref('uk', '/kalkulacka/')).toBe('/kalkulacka/');
  });
  it('uk: launchnutá sekce dostane /uk prefix', () => {
    expect(navHref('uk', '/stroje/')).toBe('/uk/stroje/');
  });
  it('sk: launchnutá sekce dostane /sk prefix (beze změny)', () => {
    expect(navHref('sk', '/stroje/')).toBe('/sk/stroje/');
  });
  it('langSwitchHref uk: nelaunchnutá sekce → uk hub', () => {
    expect(langSwitchHref('uk', '/kalkulacka/', [])).toBe('/uk/');
  });
  it('langSwitchHref uk: launchnutá sekce → /uk/<sekce>', () => {
    expect(langSwitchHref('uk', '/stroje/', [])).toBe('/uk/stroje/');
  });
});

describe('localizeInternalHref', () => {
  it('cs = no-op (byte-identické)', () => {
    expect(localizeInternalHref('cs', '/stroje/fendt/')).toBe('/stroje/fendt/');
    expect(localizeInternalHref('cs', '/')).toBe('/');
  });
  it('sk: launchnutá sekce → /sk prefix', () => {
    expect(localizeInternalHref('sk', '/stroje/traktory/')).toBe('/sk/stroje/traktory/');
    expect(localizeInternalHref('sk', '/dotace/')).toBe('/sk/dotace/');
    expect(localizeInternalHref('sk', '/plemena/skot/')).toBe('/sk/plemena/skot/');
    expect(localizeInternalHref('sk', '/')).toBe('/sk/');
  });
  it('sk: NElaunchnutá sekce → cs beze změny (žádné 302)', () => {
    expect(localizeInternalHref('sk', '/farmy/nazev/')).toBe('/farmy/nazev/');
    expect(localizeInternalHref('sk', '/zebricky/nej-traktory/')).toBe('/zebricky/nej-traktory/');
  });
  it('uk: launchnutá → /uk; nelaunchnutá (novinky není uk) → cs', () => {
    expect(localizeInternalHref('uk', '/stroje/')).toBe('/uk/stroje/');
    expect(localizeInternalHref('uk', '/novinky/')).toBe('/novinky/');
  });
  it('non-path vstup se nerozbije', () => {
    expect(localizeInternalHref('sk', '#sekce')).toBe('#sekce');
    expect(localizeInternalHref('sk', 'https://x.cz/stroje/')).toBe('https://x.cz/stroje/');
  });
  it('navHref je identický alias', () => {
    expect(navHref('sk', '/stroje/')).toBe(localizeInternalHref('sk', '/stroje/'));
    expect(navHref('uk', '/novinky/')).toBe(localizeInternalHref('uk', '/novinky/'));
  });
});
