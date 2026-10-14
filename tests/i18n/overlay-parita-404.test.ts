import { describe, it, expect } from 'vitest';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { isLaunchedPath } from '../../src/i18n/utils';
import type { Locale } from '../../src/i18n/config';

// PROČ: /znacky/<slug>/ a /puda/<slug>/ pod jazykovým prefixem už nepadají na
// český text — chybějící překlad = 404. Sitemapa (allowInMirror) i hreflang
// v Layoutu se ale ptají jen na launch SEKCE, ne na existenci položky. Dokud
// mají overlaye plnou paritu, je to v pořádku; jakmile v launchnuté locale
// jedna značka/článek chybí, sitemapa i hreflang začnou mířit na 404.
// Tenhle test hlídá právě tu paritu.

const ROOT = process.cwd();
const slugs = (dir: string) =>
  readdirSync(join(ROOT, dir))
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
    .sort();

const SECTIONS: { section: string; cs: string; overlays: Partial<Record<Locale, string>> }[] = [
  {
    section: '/znacky',
    cs: 'src/content/znacky',
    overlays: { sk: 'src/content/znacky-sk', uk: 'src/content/znacky-uk', pl: 'src/content/znacky-pl', de: 'src/content/znacky-de' },
  },
  {
    section: '/puda',
    cs: 'src/content/puda',
    overlays: { sk: 'src/content/puda-sk', uk: 'src/content/puda-uk', pl: 'src/content/puda-pl' },
  },
];

describe('overlay kolekce bez cs fallbacku mají plnou paritu v launchnutých jazycích', () => {
  for (const { section, cs, overlays } of SECTIONS) {
    for (const [locale, dir] of Object.entries(overlays) as [Locale, string][]) {
      if (!isLaunchedPath(locale, section)) continue;
      it(`${section} pod /${locale}/ má každou českou položku`, () => {
        const missing = slugs(cs).filter((s) => !slugs(dir).includes(s));
        expect(missing, `/${locale}${section}/<slug>/ by vracelo 404, ale sitemapa a hreflang na něj míří`).toEqual([]);
      });
    }
  }
});
