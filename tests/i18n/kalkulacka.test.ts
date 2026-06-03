import { describe, it, expect } from 'vitest';
import { calcRegistry } from '../../src/i18n/kalkulacka';
import { keyPaths } from '../../src/i18n/kalkulacka/types';

describe('kalkulačka i18n — parity klíčů sk ↔ cs', () => {
  const slugs = Object.keys(calcRegistry);

  it('registry obsahuje očekávané kalkulačky', () => {
    // Aktualizuje se s každým přidaným modulem; finální stav = 5 calc modulů.
    expect(slugs.length).toBeGreaterThan(0);
  });

  const CS_ONLY_PREFIXES = ['providers', 'providerSection'];
  const stripCsOnly = (paths: string[]) =>
    paths.filter((p) => !CS_ONLY_PREFIXES.some((pre) => p === pre || p.startsWith(`${pre}[`) || p.startsWith(`${pre}.`)));

  for (const slug of slugs) {
    it(`${slug}: sk má přesně stejné klíče jako cs (mimo cs-only strukturální pole)`, () => {
      const csKeys = stripCsOnly(keyPaths(calcRegistry[slug].cs));
      const skKeys = stripCsOnly(keyPaths(calcRegistry[slug].sk));
      expect(skKeys).toEqual(csKeys);
    });
  }
});
