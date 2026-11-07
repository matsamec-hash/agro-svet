import { describe, it, expect } from 'vitest';
import { content as jednotek } from '../../src/i18n/kalkulacka/prevody-jednotek';
import { content as hmotnost } from '../../src/i18n/kalkulacka/prevody-hmotnost';
import { TITLE_MAX } from '../../src/lib/head-meta';
import { locales } from '../../src/i18n/config';

// Převodníky mají v GSC desítky tisíc zobrazení a jednotky prokliků. Titulek
// musí být celý vidět (brand se lepí jen když se vejde) a popisek nesmí být
// oříznutý v půli věty — Layout krátí nad 165 znaků.
const BROKEN = /undefined|null|NaN|\{\w+\}|\(\s*\)|:\s*$|,\s*$|—\s*$|\s{2}/;
const DESC_MAX = 165;

const CONVERTERS = { 'prevody-jednotek': jednotek, 'prevody-hmotnost': hmotnost } as const;

describe('převodníky — titulek a popisek ve výsledcích hledání', () => {
  for (const [slug, content] of Object.entries(CONVERTERS)) {
    for (const locale of locales) {
      const c = content[locale];
      if (!c) continue;
      it(`${slug} / ${locale}: titulek se vejde do ${TITLE_MAX} znaků bez brandu`, () => {
        expect(c.title.length).toBeLessThanOrEqual(TITLE_MAX);
        expect(c.title).not.toMatch(BROKEN);
      });
      it(`${slug} / ${locale}: popisek má délku, kterou Google nezkrátí`, () => {
        expect(c.metaDescription.length).toBeGreaterThan(100);
        expect(c.metaDescription.length).toBeLessThanOrEqual(DESC_MAX);
        expect(c.metaDescription).not.toMatch(BROKEN);
      });
    }
  }

  it('popisek plochy slibuje 1 ha = 10 000 m² a 2,471 akru ve všech jazycích', () => {
    for (const locale of locales) {
      const d = jednotek[locale]?.metaDescription;
      if (!d) continue;
      expect(d).toMatch(/10[ .]?000/);
      expect(d).toContain('2,471');
    }
  });

  it('popisek hmotnosti slibuje 1 t = 10 q a 27,2 kg na bušl pšenice', () => {
    for (const locale of locales) {
      const d = hmotnost[locale]?.metaDescription;
      if (!d) continue;
      expect(d).toMatch(/1 [tт] = 10 /);
      expect(d).toContain('27,2');
    }
  });
});
