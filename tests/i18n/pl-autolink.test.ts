import { describe, it, expect } from 'vitest';
import { localizeInternalHref } from '../../src/i18n/utils';

describe('pl auto-linker / interní href lokalizace', () => {
  it('launchnutá sekce → /pl/ prefix', () => {
    expect(localizeInternalHref('pl', '/slovnik/adblue/')).toBe('/pl/slovnik/adblue/');
    expect(localizeInternalHref('pl', '/znacky/fendt/')).toBe('/pl/znacky/fendt/');
    expect(localizeInternalHref('pl', '/srovnani/')).toBe('/pl/srovnani/');
    expect(localizeInternalHref('pl', '/stroje/traktory/')).toBe('/pl/stroje/traktory/');
    expect(localizeInternalHref('pl', '/statistiky/')).toBe('/pl/statistiky/');
    expect(localizeInternalHref('pl', '/data/')).toBe('/pl/data/');
    expect(localizeInternalHref('pl', '/plemena/skot/')).toBe('/pl/plemena/skot/');
    expect(localizeInternalHref('pl', '/')).toBe('/pl/');
  });
  it('NElaunchnutá sekce → cs href beze změny (žádný 302/leak)', () => {
    expect(localizeInternalHref('pl', '/dotace/')).toBe('/dotace/');
    // /jak-na-to NElaunchnutá pro pl (jiná jurisdikce) → cs href beze změny
    expect(localizeInternalHref('pl', '/jak-na-to/vyber-traktoru/')).toBe('/jak-na-to/vyber-traktoru/');
  });
  it('launchnutá sekce dostane /pl prefix (/novinky feed, /vcelarstvi PL overlay)', () => {
    expect(localizeInternalHref('pl', '/novinky/')).toBe('/pl/novinky/');
    expect(localizeInternalHref('pl', '/vcelarstvi/vceli-produkty/')).toBe('/pl/vcelarstvi/vceli-produkty/');
  });
  it('cs no-op', () => {
    expect(localizeInternalHref('cs', '/slovnik/adblue/')).toBe('/slovnik/adblue/');
  });
  it('non-path vstup se nerozbije', () => {
    expect(localizeInternalHref('pl', '#sekce')).toBe('#sekce');
    expect(localizeInternalHref('pl', 'https://x.cz/stroje/')).toBe('https://x.cz/stroje/');
  });
});
