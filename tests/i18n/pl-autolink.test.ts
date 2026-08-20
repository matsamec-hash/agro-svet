import { describe, it, expect } from 'vitest';
import { localizeInternalHref } from '../../src/i18n/utils';
import { injectLinks } from '../../src/lib/auto-linker';

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

describe('auto-linker — prefix podle LAUNCHED_PREFIXES, ne podle statického flagu', () => {
  // Regrese: `GlossaryEntry.localizable` byl snapshot „co je launchnuté" a nastavený
  // jen u brand+model. Odkazy na slovník, plemena a žebříčky proto zůstávaly pod
  // /pl i /sk české, přestože ty sekce mezitím launchnuly. O prefixu teď rozhoduje
  // localizeInternalHref → isLaunchedPath, takže to nemůže zestárnout.
  it('slovník, plemena a žebříčky dostanou pod pl prefix', () => {
    const html = '<p>Traktor s AdBlue a ISOBUS.</p>';
    const out = injectLinks(html, undefined, 'pl');
    for (const href of out.match(/href="([^"]+)"/g) ?? []) {
      expect(href, `nelokalizovaný odkaz: ${href}`).not.toMatch(/^href="\/(slovnik|plemena|zebricky|stroje|znacky)\//);
    }
  });

  it('cs zůstává bez prefixu', () => {
    const out = injectLinks('<p>Traktor s AdBlue.</p>', undefined, 'cs');
    expect(out).not.toContain('/pl/');
  });

  it('nelaunchnutá sekce si pod pl drží cs href (žádný 302 ani česká stránka pod /pl)', () => {
    expect(localizeInternalHref('pl', '/kalkulacka/')).toBe('/kalkulacka/');
    expect(localizeInternalHref('pl', '/bazar/novy/')).toBe('/bazar/novy/');
    expect(localizeInternalHref('pl', '/pruvodce/')).toBe('/pruvodce/');
  });
});
