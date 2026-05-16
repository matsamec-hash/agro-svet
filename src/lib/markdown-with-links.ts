// Render markdown content collection entry → HTML s aplikovaným auto-linkerem.
// Použito v encyklopedie/[slug], dotace/[slug], jak-na-to/[slug] místo <Content />,
// aby výsledné HTML obsahovalo auto-injected interní odkazy na slovník,
// žebříčky, encyklopedii.
//
// Astro <Content /> nemá hook pro post-process HTML — proto renderujeme
// raw entry.body přes @astrojs/markdown-remark processor a aplikujeme
// injectLinks na výstup.

import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { injectLinks, createLinkContext } from './auto-linker';

let processor: Awaited<ReturnType<typeof createMarkdownProcessor>> | null = null;

async function getProcessor() {
  if (!processor) {
    processor = await createMarkdownProcessor({
      // Match Astro defaults — gfm, smartypants, code highlighting via shiki.
      gfm: true,
      smartypants: true,
    });
  }
  return processor;
}

/**
 * Render markdown body to HTML with internal links auto-injected.
 * @param markdown — raw markdown string (entry.body).
 * @param excludeUrl — current page URL path (no auto-link to self).
 */
export async function renderMarkdownWithLinks(markdown: string, excludeUrl?: string): Promise<string> {
  const proc = await getProcessor();
  const result = await proc.render(markdown);
  const html = result.code;
  const linkCtx = createLinkContext(excludeUrl);
  return injectLinks(html, linkCtx);
}
