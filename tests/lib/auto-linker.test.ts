import { describe, it, expect } from 'vitest';
import { injectLinks, createLinkContext } from '../../src/lib/auto-linker';
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
