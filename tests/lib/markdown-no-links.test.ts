import { describe, it, expect } from 'vitest';
import { renderMarkdownWithLinks } from '../../src/lib/markdown-with-links';

describe('renderMarkdownWithLinks applyLinks=false', () => {
  it('nevkládá auto-linky když applyLinks=false', async () => {
    const md = 'Toto je text o pojmu hektar a další větě.';
    const withLinks = await renderMarkdownWithLinks(md, '/uk/puda/eroze/', true);
    const without = await renderMarkdownWithLinks(md, '/uk/puda/eroze/', false);
    expect(without).not.toContain('class="auto-link"');
    expect(without).toContain('<p>');
  });
});
