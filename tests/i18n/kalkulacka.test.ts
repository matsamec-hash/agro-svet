import { describe, it, expect } from 'vitest';
import { calcRegistry } from '../../src/i18n/kalkulacka';
import { keyPaths } from '../../src/i18n/kalkulacka/types';

describe('kalkulačka i18n — parity klíčů sk ↔ cs', () => {
  const slugs = Object.keys(calcRegistry);

  it('registry obsahuje očekávané kalkulačky', () => {
    // Aktualizuje se s každým přidaným modulem; finální stav = 5 calc modulů.
    expect(slugs.length).toBeGreaterThan(0);
  });

  for (const slug of slugs) {
    it(`${slug}: sk má přesně stejné klíče jako cs`, () => {
      const csKeys = keyPaths(calcRegistry[slug].cs);
      const skKeys = keyPaths(calcRegistry[slug].sk);
      expect(skKeys).toEqual(csKeys);
    });
  }
});
