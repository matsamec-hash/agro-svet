import { describe, it, expect } from 'vitest';
import { resolveCrossLinks } from '../../src/lib/dotace-crosslinks';

const fallback = [
  { href: '/stroje/traktory/', label: 'Katalog traktorů', primary: true },
  { href: '/srovnani/', label: 'Srovnání modelů', primary: false },
  { href: '/kalkulacka/leasing-traktoru/', label: 'Kalkulačka leasingu', primary: false },
];

describe('resolveCrossLinks', () => {
  it('vrací fallback, když titul nemá relatedLinks', () => {
    expect(resolveCrossLinks(undefined, '', fallback)).toEqual(fallback);
    expect(resolveCrossLinks([], '', fallback)).toEqual(fallback);
  });

  it('mapuje relatedLinks (první = primary) a prefixuje base', () => {
    const out = resolveCrossLinks(
      [
        { href: '/stroje/postrikovace-nesene/', label: 'Postřikovače' },
        { href: '/jak-na-to/jak-nastavit-seci-stroj/', label: 'Návod' },
      ],
      '/sk',
      fallback,
    );
    expect(out).toEqual([
      { href: '/sk/stroje/postrikovace-nesene/', label: 'Postřikovače', primary: true },
      { href: '/sk/jak-na-to/jak-nastavit-seci-stroj/', label: 'Návod', primary: false },
    ]);
  });

  it('base="" (cs) ponechá href beze změny', () => {
    const out = resolveCrossLinks([{ href: '/stroje/kombajny/', label: 'Kombajny' }], '', fallback);
    expect(out).toEqual([{ href: '/stroje/kombajny/', label: 'Kombajny', primary: true }]);
  });
});
