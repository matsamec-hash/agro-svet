import { describe, it, expect } from 'vitest';
import { localizeInternalHref } from '../../src/i18n/utils';

describe('pl auto-linker / interní href lokalizace', () => {
  it('launchnutá sekce → /pl/ prefix', () => {
    expect(localizeInternalHref('pl', '/slovnik/adblue/')).toBe('/pl/slovnik/adblue/');
    expect(localizeInternalHref('pl', '/znacky/fendt/')).toBe('/pl/znacky/fendt/');
    expect(localizeInternalHref('pl', '/srovnani/')).toBe('/pl/srovnani/');
    expect(localizeInternalHref('pl', '/stroje/traktory/')).toBe('/pl/stroje/traktory/');
    expect(localizeInternalHref('pl', '/')).toBe('/pl/');
  });
  it('NElaunchnutá sekce → cs href beze změny (žádný 302/leak)', () => {
    expect(localizeInternalHref('pl', '/statistiky/')).toBe('/statistiky/');
    expect(localizeInternalHref('pl', '/novinky/')).toBe('/novinky/');
    expect(localizeInternalHref('pl', '/dotace/')).toBe('/dotace/');
    expect(localizeInternalHref('pl', '/plemena/skot/')).toBe('/plemena/skot/');
  });
  it('cs no-op', () => {
    expect(localizeInternalHref('cs', '/slovnik/adblue/')).toBe('/slovnik/adblue/');
  });
  it('non-path vstup se nerozbije', () => {
    expect(localizeInternalHref('pl', '#sekce')).toBe('#sekce');
    expect(localizeInternalHref('pl', 'https://x.cz/stroje/')).toBe('https://x.cz/stroje/');
  });
});
