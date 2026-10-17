import { describe, it, expect } from 'vitest';
import { injectLinks, createLinkContext, isGenericAlias } from '../../src/lib/auto-linker';
import { getAllBrands } from '../../src/lib/stroje';

const brand = getAllBrands().find((b) => b.slug === 'fendt')
  ?? getAllBrands().find((b) => b.name.length >= 5)!;
const html = `<p>Traktor ${brand.name} je oblíbený.</p>`;

describe('auto-linker locale', () => {
  it('sk: brand entry → /sk/stroje/<slug>/', () => {
    const out = injectLinks(html, undefined, 'sk');
    expect(out).toContain(`href="/sk/stroje/${brand.slug}/"`);
    expect(out).toContain('class="auto-link"');
  });

  it('cs default je byte-identické s explicitním cs', () => {
    expect(injectLinks(html, undefined, 'cs')).toBe(injectLinks(html, undefined));
    expect(injectLinks(html, undefined)).toContain(`href="/stroje/${brand.slug}/"`);
  });

  it('createLinkContext normalizuje locale-prefixovaný excludeUrl → self-exclusion funguje pod sk', () => {
    const out = injectLinks(html, `/sk/stroje/${brand.slug}/`, 'sk');
    expect(out).not.toContain('class="auto-link"');
  });

  it('createLinkContext normalizuje plný URL excludeUrl', () => {
    const out = injectLinks(html, `https://agro-svet.cz/stroje/${brand.slug}/`, 'cs');
    expect(out).not.toContain('class="auto-link"');
  });
});

describe('auto-linker: obecné aliasy slovníku se neodkazují', () => {
  it('cs: „plod“ u plodin neodkazuje na včelí plod', () => {
    const out = injectLinks('<p>Plod pšenice je obilka, plod hrachu je lusk.</p>', undefined, 'cs');
    expect(out).not.toContain('/slovnik/vceli-plod/');
  });

  it('cs: celý název „Včelí plod“ se odkazuje dál', () => {
    const out = injectLinks('<p>Včelí plod se vyvíjí v zavíčkovaných buňkách.</p>', undefined, 'cs');
    expect(out).toContain('href="/slovnik/vceli-plod/"');
  });

  it('sk: „plod“ neodkazuje, „Včelí plod“ ano', () => {
    expect(injectLinks('<p>Plod slnečnice je nažka.</p>', undefined, 'sk')).not.toContain('/slovnik/vceli-plod/');
    expect(injectLinks('<p>Včelí plod potrebuje teplo.</p>', undefined, 'sk')).toContain('/sk/slovnik/vceli-plod/');
  });

  it('de: „im Rahmen der GAP“ neodkazuje na včelařský rámek', () => {
    const out = injectLinks('<p>Im Rahmen der GAP gibt es Direktzahlungen.</p>', undefined, 'de');
    expect(out).not.toContain('/slovnik/vcelarsky-ramek/');
  });

  it('isGenericAlias porovnává bez ohledu na velikost písmen a jen v daném jazyce', () => {
    expect(isGenericAlias('Plod', 'cs')).toBe(true);
    expect(isGenericAlias('Rahmen', 'de')).toBe(true);
    expect(isGenericAlias('Rahmen', 'cs')).toBe(false);
    expect(isGenericAlias('varroa', 'cs')).toBe(false);
  });
});
