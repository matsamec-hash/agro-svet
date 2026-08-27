import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { LAUNCHED_PREFIXES, isLaunchedPath } from '../../src/i18n/utils';
import { isLockedSectionPath } from '../../src/i18n/nav';
import { TIER_LISTS } from '../../src/lib/tier-lists';
import { TIER_LIST_COPY } from '../../src/lib/tier-lists.i18n';

describe('SK homepage launch', () => {
  it('root je launchnutý pro sk (HomeSk.astro je plně slovenská)', () => {
    expect(LAUNCHED_PREFIXES.sk).toContain('/');
    expect(isLaunchedPath('sk', '/')).toBe(true);
  });

  it('root v prefixech nezpůsobí over-match nelaunchnutých sekcí', () => {
    // '/' se nesmí chovat jako wildcard — /kviz pro sk launchnuté není.
    expect(isLaunchedPath('sk', '/kviz')).toBe(false);
    expect(isLaunchedPath('sk', '/farmy/nazev-farmy/')).toBe(false);
  });

  it('root není locked', () => {
    expect(isLockedSectionPath('/')).toBe(false);
  });
});

// Regrese pro CELOU třídu, ne jen pro SK: každá locale, která má launchnutou
// homepage, musí mít launchnuté i všechny sekce, na které ta homepage odkazuje.
// Jinak homepage tlačí crawler na noindex stránky.
describe('homepage odkazuje jen na launchnuté sekce (všechny locale)', () => {
  const HOMES = { sk: 'HomeSk.astro', pl: 'HomePl.astro', uk: 'HomeUk.astro' } as const;

  for (const [locale, file] of Object.entries(HOMES) as [keyof typeof HOMES, string][]) {
    it(`${locale}: odkazy v ${file} míří jen do launchnutých prefixů`, () => {
      if (!isLaunchedPath(locale, '/')) return; // homepage není launchnutá → netestujeme
      const src = readFileSync(join(process.cwd(), 'src/components/home', file), 'utf8');

      // a) literálové hrefy typu '/sk/stroje/' (SECTIONS)
      const literal = [...src.matchAll(new RegExp(`['"\`]/${locale}(/[a-z0-9/-]*)['"\`]`, 'g'))]
        .map((m) => m[1]);
      // b) localizeInternalHref(LOCALE, '/statistiky/') → cs-root cesta
      const helper = [...src.matchAll(/localizeInternalHref\(\s*LOCALE\s*,\s*['"`](\/[a-z0-9/-]*)['"`]/g)]
        .map((m) => m[1]);

      const paths = [...new Set([...literal, ...helper])].filter((p) => p !== '/');
      expect(paths.length).toBeGreaterThan(0); // test musí něco najít, jinak je slepý

      const notLaunched = paths.filter((p) => !isLaunchedPath(locale, p));
      expect(notLaunched).toEqual([]);
    });
  }
});

describe('SK žebříčky (/zebricky)', () => {
  it('/zebricky je launchnuté pro sk', () => {
    expect(LAUNCHED_PREFIXES.sk).toContain('/zebricky');
    expect(isLaunchedPath('sk', '/zebricky')).toBe(true);
    expect(isLaunchedPath('sk', '/zebricky/traktory-do-100-koni/')).toBe(true);
  });
});

// Celá třída: každý locale, který má overlay textů žebříčků, musí pokrývat
// VŠECHNY cs žebříčky — částečný overlay by tiše servíroval české texty
// uprostřed jinak přeložené stránky (tierListCopy padá na cs).
describe('overlay textů žebříčků je kompletní pro každý locale', () => {
  const csSlugs = TIER_LISTS.map((d) => d.slug);

  for (const locale of Object.keys(TIER_LIST_COPY)) {
    it(`${locale}: pokrývá všech ${csSlugs.length} žebříčků a nic nenechává česky`, () => {
      const copy = TIER_LIST_COPY[locale];
      expect(Object.keys(copy).sort()).toEqual([...csSlugs].sort());

      for (const d of TIER_LISTS) {
        const c = copy[d.slug];
        for (const field of ['title', 'description', 'methodology', 'callToAction'] as const) {
          expect(c[field], `${locale}/${d.slug}.${field} je prázdné`).toBeTruthy();
          // Shodný text s cs = neproběhl překlad (u těchhle polí je vždy próza).
          expect(c[field], `${locale}/${d.slug}.${field} == cs (nepřeloženo)`).not.toBe(d[field]);
        }
      }
    });
  }
});
