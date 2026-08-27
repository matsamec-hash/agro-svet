import { describe, it, expect } from 'vitest';
import { AKCIE } from '../../src/data/akcie-agro';
import { akcieText } from '../../src/data/akcie-agro-pl';
import { content } from '../../src/i18n/akcie';
import { isLaunchedPath, localizeInternalHref } from '../../src/i18n/utils';

// Stejná logika jako u akcie-pl-overlay, ale psaná přes VŠECHNY launchnuté
// locale: přidat další jazyk pak znamená doplnit overlay, ne další kopii testu.
// Bez téhle kontroly by nová firma v akcie-agro.ts tiše přidala českou kartu.
const LOCALES = ['sk', 'pl', 'uk'] as const;
// Slovenština sdílí s češtinou skoro celou abecedu — na únik stačí ě/ř/ů
// plus slovník českých tvarů z téhle domény.
const CZ_MARKERS: Record<string, RegExp> = {
  sk: /[ěřůĚŘŮ]|zemědělsk|společnost|největší|výrobce|hnojiv[ay]\b|osiva\b/i,
  pl: /[ěščřžýáíéúůťďň]/i,
  // uk je azbukou — únik se pozná obráceně: text bez jediného cyrilického znaku.
  uk: /^[^\u0400-\u04FF]*$/,
};

// Slovenština a čeština píšou některé odborné termíny shodně — shoda tam není
// důkaz nepřeloženého klíče. Whitelist držíme malý a pojmenovaný, ať se pod něj
// nedá schovat skutečný únik.
const SAME_AS_CS: Record<string, Set<string>> = {
  // „Dividendový výnos" i „Profil značky →" se cs a sk píšou shodně.
  sk: new Set(['mDiv', 'brandsProfile']),
  uk: new Set(),
  pl: new Set(),
};

describe('overlay akcií pro launchnuté locale', () => {
  for (const locale of LOCALES) {
    it(`${locale}: /akcie je launchnuté a lokalizuje se`, () => {
      expect(isLaunchedPath(locale, '/akcie')).toBe(true);
      expect(localizeInternalHref(locale, '/akcie/')).toBe(`/${locale}/akcie/`);
    });

    it(`${locale}: overlay pokrývá všech ${AKCIE.length} firem a nic nezůstalo česky`, () => {
      for (const a of AKCIE) {
        const t = akcieText(a, locale);
        expect(t.profil, a.ticker).toBeTruthy();
        expect(t.profil, a.ticker).not.toBe(a.profil);
        if (a.popis) expect(t.popis, a.ticker).not.toBe(a.popis);
        if (a.sidlo) expect(t.sidlo, a.ticker).toBeTruthy();
        if (a.obrat) expect(t.obrat, a.ticker).toBeTruthy();
        if (a.uspechy) expect(t.uspechy?.length, a.ticker).toBe(a.uspechy.length);

        const text = [t.profil, t.popis, t.sidlo, t.obrat, ...(t.uspechy ?? [])].join(' ');
        expect(text.match(CZ_MARKERS[locale])?.[0] ?? null, `${a.ticker}: ${text}`).toBeNull();
      }
    });

    it(`${locale}: UI copy je kompletní a přeložené`, () => {
      const cs = content.cs as unknown as Record<string, unknown>;
      const loc = content[locale] as unknown as Record<string, unknown>;
      for (const key of Object.keys(cs)) {
        expect(loc[key], key).toBeTruthy();
        if (typeof cs[key] === 'string' && (cs[key] as string).length > 12
          && !SAME_AS_CS[locale].has(key)) {
          expect(loc[key], key).not.toBe(cs[key]);
        }
      }
    });
  }

  it('cs zůstává beze změny (overlay nesmí přetéct do češtiny)', () => {
    for (const a of AKCIE) expect(akcieText(a, 'cs')).toBe(a);
  });
});
