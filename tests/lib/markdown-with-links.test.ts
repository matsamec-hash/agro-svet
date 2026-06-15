import { describe, it, expect } from 'vitest';
import { renderMarkdownWithLinks } from '../../src/lib/markdown-with-links';
import { getAllBrands } from '../../src/lib/stroje';

const brand = getAllBrands().find((b) => b.slug === 'fendt')
  ?? getAllBrands().find((b) => b.name.length >= 5)!;

describe('renderMarkdownWithLinks locale', () => {
  it('sk: brand odkaz → /sk/stroje/<slug>/', async () => {
    const out = await renderMarkdownWithLinks(`Traktor ${brand.name} je dobrý.`, undefined, 'sk');
    expect(out).toContain(`href="/sk/stroje/${brand.slug}/"`);
  });
  it('cs default → cs odkaz', async () => {
    const out = await renderMarkdownWithLinks(`Traktor ${brand.name} je dobrý.`);
    expect(out).toContain(`href="/stroje/${brand.slug}/"`);
  });
});
