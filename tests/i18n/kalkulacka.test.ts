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

import { content as hub } from '../../src/i18n/kalkulacka/hub';

describe('kalkulačka hub i18n', () => {
  it('sk hub vynechává dotace-cap kartu', () => {
    const skSlugs = hub.sk.cards.map((c) => c.slug);
    expect(skSlugs).not.toContain('dotace-cap');
  });
  it('cs hub obsahuje všech 6 karet včetně dotace-cap', () => {
    const csSlugs = hub.cs.cards.map((c) => c.slug);
    expect(csSlugs).toContain('dotace-cap');
    expect(csSlugs).toHaveLength(6);
  });
  it('sk hub má 5 karet', () => {
    expect(hub.sk.cards).toHaveLength(5);
  });
  it('každá sk karta má neprázdné name/short/description', () => {
    for (const card of hub.sk.cards) {
      expect(card.name).not.toBe('');
      expect(card.short).not.toBe('');
      expect(card.description).not.toBe('');
    }
  });
});
