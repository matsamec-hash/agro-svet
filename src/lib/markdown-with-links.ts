// Render markdown content collection entry → HTML s aplikovaným auto-linkerem.
// Použito v encyklopedie/[slug], dotace/[slug], jak-na-to/[slug] místo <Content />,
// aby výsledné HTML obsahovalo auto-injected interní odkazy na slovník,
// žebříčky, encyklopedii.
//
// Astro <Content /> nemá hook pro post-process HTML — proto renderujeme
// raw entry.body přes vlastní remark/rehype pipeline a aplikujeme
// injectLinks na výstup.
//
// POZN. Dřív se používal `createMarkdownProcessor` z @astrojs/markdown-remark.
// Ten ale staticky importuje shiki `bundledLanguages` (~200 jazykových
// gramatik). Protože dotace/[slug] běží SSR (prerender=false kvůli SK i18n
// rewrite), zatáhlo to ~1.5 MB gzip gramatik do Worker bundlu a přetlačilo
// ho přes 3 MiB limit free plánu Cloudflare Workers. Žádný markdown v
// kolekcích neobsahuje code block, takže shiki je čistý balast — nahrazeno
// lehkou remark→rehype pipeline (stejný engine jako Astro, jen bez shiki).
// Heading-ID slugy replikují Astro `rehypeHeadingIds` (github-slugger), aby
// kotvy/deep-linky zůstaly byte-identické s předchozím výstupem.

import { unified, type Plugin } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkSmartypants from 'remark-smartypants';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import Slugger from 'github-slugger';
import { injectLinks, createLinkContext } from './auto-linker';
import { defaultLocale, type Locale } from '../i18n/config';

// Replika @astrojs/markdown-remark `rehypeHeadingIds` pro non-MDX vstup:
// text nadpisu = konkatenace text uzlů (s `{` → `${`), poté github-slugger.
const rehypeHeadingIds: Plugin<[], any> = () => (tree: any) => {
  const slugger = new Slugger();
  visit(tree, (node: any) => {
    if (node.type !== 'element' || typeof node.tagName !== 'string') return;
    if (node.tagName[0] !== 'h') return;
    const m = /^h([1-6])$/.exec(node.tagName);
    if (!m) return;
    let text = '';
    visit(node, (child: any, _i, parent: any) => {
      if (child.type === 'element' || parent == null) return;
      if (child.type === 'text' || child.type === 'raw') {
        text += String(child.value).replace(/\{/g, '${');
      }
    });
    node.properties = node.properties || {};
    if (typeof node.properties.id !== 'string') {
      node.properties.id = slugger.slug(text);
    }
  });
};

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkSmartypants)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeHeadingIds)
  .use(rehypeStringify, { allowDangerousHtml: true });

/**
 * Render markdown body to HTML with internal links auto-injected.
 * @param markdown — raw markdown string (entry.body).
 * @param excludeUrl — current page URL path (no auto-link to self).
 * @param locale — current page locale; links are localized to /sk or /uk prefix (default: 'cs').
 */
export async function renderMarkdownWithLinks(markdown: string, excludeUrl?: string, locale: Locale = defaultLocale): Promise<string> {
  const file = await processor.process(markdown);
  const html = String(file);
  const linkCtx = createLinkContext(excludeUrl);
  return injectLinks(html, linkCtx, locale);
}

/** Nadpis sekce zdrojů v návodech (cs, sk, pl, de, uk). */
const SOURCES_HEADING = /^## (Zdroje|Źródła|Quellen|Джерела)\s*$/m;

/**
 * Oddělí od těla návodu sekci zdrojů (od jejího nadpisu do konce), aby ji
 * šablona mohla vypsat až za kroky a FAQ. Bez sekce vrací `sources: null`.
 */
export function splitSources(markdown: string): { body: string; sources: string | null } {
  const m = SOURCES_HEADING.exec(markdown);
  if (!m) return { body: markdown, sources: null };
  return { body: markdown.slice(0, m.index).trimEnd(), sources: markdown.slice(m.index) };
}

/** Render markdown bez auto-linkeru — pro seznam zdrojů, kde vložené odkazy rušily. */
export async function renderMarkdown(markdown: string): Promise<string> {
  return String(await processor.process(markdown));
}
