import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Slovník a kvíz uváděly vymyšlené české sazby SZP jako fakt („BISS ~2150 Kč/ha",
 * „CISS ~1450 Kč/ha", „EKO-platba základní 1300 / premium 2400 Kč/ha", „1 ha
 * meziplodiny = 0,3 ha EFA"). Skutečné sazby za rok 2026 (MZe, tisková zpráva
 * 2. 10. 2026, kurz 24,44 CZK/EUR): BISS 1 631,69 Kč/ha, redistributivní platba
 * 3 426,29 Kč/ha, základní ekoplatba 1 547,14 Kč/ha. Tenhle test hlídá, aby se
 * vymyšlená čísla nevrátila — v žádném jazyce a ani v komentářích (soubor se čte
 * celý) — a aby slovník a kvíz nemíchaly sazby 2025 s rokem 2026.
 */

const LIB = path.resolve(__dirname, '../../src/lib');
const FILES = fs
  .readdirSync(LIB)
  .filter((f) => /^(slovnik|kviz)([.-][a-z]+)?\.ts$/.test(f) && f !== 'slovnik-wikilinks.ts')
  .sort();

const FORBIDDEN = ['2150 Kč', '1450 Kč', 'premium 2400', '1300 Kč/ha', '0,3 ha EFA'];
// Sazby za rok 2025 — po vyhlášení sazeb 2026 se už jako „aktuální“ nesmí objevit.
const STALE_2025 = [
  '1 759,91', '3 449,49', '1 578,37', '17 521,20', '2 378,75', '6 883,97', '14 936,09', '15 541,10',
  '6 936,20', '12 036,09', '1 449,39', '3 540,01', '38 261,21', '10 512,72', '175 991',
];
// Ekoplatba 2026 nemá varianty A/B neprodukčních ploch (NV 83/2023 § 23 ve znění NV 45/2026).
const STALE_RULES = [/varianty? [AB]\b/, /variantu [AB]\b/, /wariantu? [AB]\b/, /варіанта? [AB]\b/, /superprémi|superpremi|суперпреміальн/];

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

    it(`${file} nemíchá sazby 2025 s rokem 2026`, () => {
      const src = fs.readFileSync(path.join(LIB, file), 'utf8');
      expect(STALE_2025.filter((s) => src.includes(s))).toEqual([]);
      expect(STALE_RULES.filter((re) => re.test(src)).map(String)).toEqual([]);
    });
  }

  it('heslo cap-2024 a kvíz uvádějí sazby 2026', () => {
    const slovnik = fs.readFileSync(path.join(LIB, 'slovnik.ts'), 'utf8');
    for (const s of ['1 631,69', '3 426,29', '1 547,14', '18 263,22', '2 389,20', '6 873,79', '15 696,34', '14 729,01']) {
      expect(slovnik).toContain(s);
    }
    const kviz = fs.readFileSync(path.join(LIB, 'kviz.ts'), 'utf8');
    expect(kviz).toContain('Ovoce s velmi vysokou pracností (15 696,34 Kč/ha)');
    expect(kviz).toContain('v ČR 1 631,69 Kč/ha za rok 2026');
  });
});
