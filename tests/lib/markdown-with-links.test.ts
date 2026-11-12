import { describe, it, expect } from 'vitest';
import { renderMarkdownWithLinks, splitSources } from '../../src/lib/markdown-with-links';
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

describe('splitSources', () => {
  it('oddělí sekci zdrojů od těla', () => {
    const { body, sources } = splitSources('Úvod.\n\n## Bezpečnost\n\nPozor.\n\n## Zdroje\n\n1. Návod Zetor, s. 39.\n');
    expect(body).toBe('Úvod.\n\n## Bezpečnost\n\nPozor.');
    expect(sources).toBe('## Zdroje\n\n1. Návod Zetor, s. 39.\n');
  });
  it('pozná polský nadpis', () => {
    expect(splitSources('Tekst.\n\n## Źródła\n\n1. Instrukcja.').sources).toBe('## Źródła\n\n1. Instrukcja.');
  });
  it('bez sekce vrací celé tělo', () => {
    expect(splitSources('Jen úvod.')).toEqual({ body: 'Jen úvod.', sources: null });
  });
});
