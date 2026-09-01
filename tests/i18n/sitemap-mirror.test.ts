import { describe, it, expect } from 'vitest';
import {
  allowInMirror,
  MIRROR_LOCALES,
  type MirrorContext,
  type MirrorLocale,
} from '../../src/lib/sitemap-mirror';
import fs from 'node:fs';
import path from 'node:path';

// PROČ: mirrory sitemapy byly čtyři nezávislé filtry a `de` přibylo bez bran,
// které měly ostatní. Produkční sitemapa proto pro /de nabízela 2 710 detailů
// odrůd + 2 cs-only kvízy (302 na cs) a ~45 novinkových a howto URL se 404.
// Testy drží invariant: KAŽDÝ zrcadlený jazyk prochází touž bránou.

const ROOT = path.resolve(__dirname, '../..');

const ctx: MirrorContext = {
  articleMeta: new Map([
    ['fendt-1050-vario-rekordni-priplatek', { id: 'a-prelozeny', category: 'technika' }],
    ['8-kolo-program-rozvoje-venkova-podzim-2026', { id: 'a-dotace', category: 'dotace' }],
    ['reportaz-z-ceskych-poli', { id: 'a-neprelozeny', category: 'technika' }],
  ]),
  translatedIds: new Map(
    MIRROR_LOCALES.map((l) => [l, new Set(['a-prelozeny'])] as const),
  ),
  howtoSlugs: new Map(
    (['sk', 'uk', 'de'] as MirrorLocale[]).map(
      (l) => [l, new Set(l === 'sk' ? ['jak-zalozit-louku', 'registrace-vcelaru'] : ['jak-zalozit-louku'])] as const,
    ),
  ),
};

describe('brána locale mirroru sitemapy', () => {
  it('detail odrůdy nezrcadlí ŽÁDNÝ jazyk, ačkoli /plodiny mají launchnuté', () => {
    for (const locale of MIRROR_LOCALES) {
      expect(allowInMirror('/plodiny/brambory/albatros/', locale, ctx)).toBe(false);
    }
  });

  it('hub, pillar i faceta plodin se zrcadlí dál', () => {
    for (const locale of MIRROR_LOCALES) {
      expect(allowInMirror('/plodiny/', locale, ctx)).toBe(true);
      expect(allowInMirror('/plodiny/brambory/', locale, ctx)).toBe(true);
      expect(allowInMirror('/plodiny/skupina/obiloviny/', locale, ctx)).toBe(true);
    }
  });

  it('nelokalizované kvízy nezrcadlí žádný jazyk, hub a lokalizovaný ano', () => {
    for (const locale of MIRROR_LOCALES) {
      expect(allowInMirror('/kviz/jaky-traktor-potrebujete/', locale, ctx)).toBe(false);
      expect(allowInMirror('/kviz/jaka-vcela-pro-vas/', locale, ctx)).toBe(false);
      expect(allowInMirror('/kviz/', locale, ctx)).toBe(true);
      expect(allowInMirror('/kviz/historie-znacek/', locale, ctx)).toBe(true);
    }
  });

  it('nepřeložený článek a jurisdikčně skrytá kategorie se nezrcadlí nikam', () => {
    for (const locale of MIRROR_LOCALES) {
      expect(allowInMirror('/novinky/reportaz-z-ceskych-poli/', locale, ctx)).toBe(false);
      expect(allowInMirror('/novinky/8-kolo-program-rozvoje-venkova-podzim-2026/', locale, ctx)).toBe(false);
      expect(allowInMirror('/novinky/kategorie/dotace/', locale, ctx)).toBe(false);
      expect(allowInMirror('/novinky/kategorie/legislativa/', locale, ctx)).toBe(false);
    }
    for (const locale of ['sk', 'uk', 'pl', 'de'] as MirrorLocale[]) {
      expect(allowInMirror('/novinky/fendt-1050-vario-rekordni-priplatek/', locale, ctx)).toBe(true);
    }
  });

  it('chybějící overlay návodu se nezrcadlí — ani pro de', () => {
    expect(allowInMirror('/jak-na-to/jak-zalozit-louku/', 'de', ctx)).toBe(true);
    expect(allowInMirror('/jak-na-to/registrace-vcelaru/', 'de', ctx)).toBe(false);
    expect(allowInMirror('/jak-na-to/registrace-vcelaru/', 'uk', ctx)).toBe(false);
    // sk má plnou paritu → brána je pro něj no-op
    expect(allowInMirror('/jak-na-to/registrace-vcelaru/', 'sk', ctx)).toBe(true);
  });

  it('sk si ponechává /dotace/kalendar-kol/, uk ne (302 na hub)', () => {
    expect(allowInMirror('/dotace/kalendar-kol/', 'sk', ctx)).toBe(true);
    expect(allowInMirror('/dotace/kalendar-kol/', 'uk', ctx)).toBe(false);
    // detail dotace má sk vlastní slugy → z mirroru ven pro všechny
    expect(allowInMirror('/dotace/34-73-zpracovani/', 'sk', ctx)).toBe(false);
  });

  it('sitemap.xml.ts staví VŠECHNY mirrory přes sdílenou bránu, ne vlastními filtry', () => {
    const sm = fs.readFileSync(path.join(ROOT, 'src/pages/sitemap.xml.ts'), 'utf8');
    expect(sm).toContain('allowInMirror');
    // žádný per-locale filtr nesmí obcházet bránu vlastní kopií isLaunchedPath
    expect(sm).not.toMatch(/isLaunchedPath\('(sk|uk|pl|de)'/);
    expect(sm).not.toContain('isSkLaunchedPath');
  });
});
