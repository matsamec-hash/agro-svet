import { describe, it, expect } from 'vitest';
import { AKCIE } from '../../src/data/akcie-agro';
import { AKCIE_PL, akcieText } from '../../src/data/akcie-agro-pl';
import { content } from '../../src/i18n/akcie';
import { isLaunchedPath, isPrerenderedOnlyPath, localizeInternalHref } from '../../src/i18n/utils';

// /akcie je pro pl launchnuté, takže overlay MUSÍ pokrýt každou firmu. Bez téhle
// kontroly by nová firma v akcie-agro.ts tiše přidala českou kartu do /pl/akcie/
// — přesně ten druh úniku, co se v PL auditu hledal ručně.
describe('PL overlay akcií', () => {
  const CS_ONLY = /[ěščřžýáíéúůťďň]/i;

  it('pokrývá všechny firmy', () => {
    const chybi = AKCIE.filter((a) => !AKCIE_PL[a.ticker]).map((a) => a.ticker);
    expect(chybi).toEqual([]);
  });

  it('má u každé firmy vyplněná všechna textová pole, která má čeština', () => {
    for (const a of AKCIE) {
      const pl = akcieText(a, 'pl');
      expect(pl.profil, a.ticker).toBeTruthy();
      expect(pl.profil, a.ticker).not.toBe(a.profil);
      if (a.popis) expect(pl.popis, a.ticker).not.toBe(a.popis);
      if (a.sidlo) expect(pl.sidlo, a.ticker).toBeTruthy();
      if (a.obrat) expect(pl.obrat, a.ticker).toBeTruthy();
      if (a.uspechy) expect(pl.uspechy?.length, a.ticker).toBe(a.uspechy.length);
    }
  });

  it('neobsahuje znaky, které polština nemá (typický únik češtiny)', () => {
    for (const a of AKCIE) {
      const pl = akcieText(a, 'pl');
      const text = [pl.profil, pl.popis, pl.sidlo, pl.obrat, ...(pl.uspechy ?? [])].join(' ');
      expect(text.match(CS_ONLY)?.[0] ?? null, `${a.ticker}: ${text}`).toBeNull();
    }
  });

  it('cs zůstává beze změny (overlay nesmí přetéct do češtiny)', () => {
    for (const a of AKCIE) expect(akcieText(a, 'cs')).toBe(a);
  });
});

describe('UI copy /akcie', () => {
  it('má pro pl vyplněné všechny klíče a žádný nezůstal česky', () => {
    const cs = content.cs as unknown as Record<string, unknown>;
    const pl = content.pl as unknown as Record<string, unknown>;
    for (const key of Object.keys(cs)) {
      expect(pl[key], key).toBeTruthy();
      // Emoji-only / interpunkční klíče se shodovat můžou; textové ne.
      if (typeof cs[key] === 'string' && (cs[key] as string).length > 12) {
        expect(pl[key], key).not.toBe(cs[key]);
      }
    }
  });
});

describe('prerendered cs-only cesty', () => {
  it('/data/prodeje-techniky se nelokalizuje, ačkoli /data launchnuté je', () => {
    expect(isLaunchedPath('pl', '/data/prodeje-techniky')).toBe(true);
    expect(isPrerenderedOnlyPath('/data/prodeje-techniky')).toBe(true);
    expect(localizeInternalHref('pl', '/data/prodeje-techniky/')).toBe('/data/prodeje-techniky/');
    expect(localizeInternalHref('sk', '/data/prodeje-techniky/')).toBe('/data/prodeje-techniky/');
  });

  it('zbytek /data se lokalizuje dál', () => {
    expect(localizeInternalHref('pl', '/data/')).toBe('/pl/data/');
  });

  it('/akcie je launchnuté pro pl a lokalizuje se', () => {
    expect(isLaunchedPath('pl', '/akcie')).toBe(true);
    expect(localizeInternalHref('pl', '/akcie/DE/')).toBe('/pl/akcie/DE/');
  });
});
