import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Slovník a kvíz uváděly vymyšlené české sazby SZP jako fakt („BISS ~2150 Kč/ha",
 * „CISS ~1450 Kč/ha", „EKO-platba základní 1300 / premium 2400 Kč/ha", „1 ha
 * meziplodiny = 0,3 ha EFA"). Skutečné sazby za rok 2025 (SZIF, MZe 9. 10. 2025):
 * BISS 1 759,91 Kč/ha, redistributivní platba 3 449,49 Kč/ha, základní ekoplatba
 * 1 578,37 Kč/ha. Tenhle test hlídá, aby se vymyšlená čísla nevrátila — v žádném
 * jazyce a ani v komentářích (soubor se čte celý).
 */

const LIB = path.resolve(__dirname, '../../src/lib');
const FILES = fs
  .readdirSync(LIB)
  .filter((f) => /^(slovnik|kviz)([.-][a-z]+)?\.ts$/.test(f) && f !== 'slovnik-wikilinks.ts')
  .sort();

const FORBIDDEN = ['2150 Kč', '1450 Kč', 'premium 2400', '1300 Kč/ha', '0,3 ha EFA'];

describe('slovník a kvíz bez vymyšlených dotačních sazeb', () => {
  it('kontroluje všechny jazykové varianty slovníku i kvízu', () => {
    for (const f of [
      'slovnik.ts', 'slovnik-extra.ts', 'slovnik.sk.ts', 'slovnik.pl.ts', 'slovnik.uk.ts', 'slovnik.de.ts',
      'kviz.ts', 'kviz.sk.ts', 'kviz.pl.ts', 'kviz.uk.ts', 'kviz.de.ts',
    ]) {
      expect(FILES, f).toContain(f);
    }
  });

  for (const file of FILES) {
    it(`${file} neobsahuje vymyšlená čísla`, () => {
      const src = fs.readFileSync(path.join(LIB, file), 'utf8');
      const hits = FORBIDDEN.filter((s) => src.includes(s));
      expect(hits).toEqual([]);
    });
  }
});
