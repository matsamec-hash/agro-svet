// Build-time / SSR auto-linker. Scans HTML article content, finds first
// occurrence of each glossary term (brand, plemeno, druh, kategorie strojů)
// and wraps it in <a>. One link per target URL per article. Skips inside
// headings (h1–h6), existing anchors, code/pre, script/style. Driven by
// YAML catalogs already loaded via @modyfi/vite-plugin-yaml.

import { getAllBrands, getAllModels, FUNCTIONAL_GROUPS, type FunctionalGroupSlug } from './stroje';
import { getAllDruhy, getAllPlemena } from './plemena';

interface GlossaryEntry {
  term: string;
  /** Lowercased term — used for cheap String.includes() prefilter in hot path. */
  termLower: string;
  /** Pre-compiled lookbehind/lookahead regex — built once at glossary load time. */
  pattern: RegExp;
  url: string;
  /** Higher wins when terms overlap; longer terms also matched first by length. */
  priority: number;
}

const PROTECTED_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'code', 'pre', 'script', 'style', 'figcaption']);
const SELF_CLOSING = new Set(['br', 'hr', 'img', 'input', 'meta', 'link', 'source']);
/** Hard cap per article — over-linking is a spam signal. */
const MAX_LINKS_PER_ARTICLE = 10;
/** Min term length — filters out ambiguous short tokens like "T4", "CX50", "7110". */
const MIN_TERM_LENGTH = 5;

let cachedGlossary: GlossaryEntry[] | null = null;

function makeEntry(term: string, url: string, priority: number): GlossaryEntry {
  return {
    term,
    termLower: term.toLowerCase(),
    pattern: new RegExp(`(?<![\\p{L}\\p{N}_])(${escapeRegex(term)})(?![\\p{L}\\p{N}_])`, 'iu'),
    url,
    priority,
  };
}

function buildGlossary(): GlossaryEntry[] {
  const entries: GlossaryEntry[] = [];

  for (const b of getAllBrands()) {
    entries.push(makeEntry(b.name, `/stroje/${b.slug}/`, 10));
  }

  // Models: only currently-in-production (year_to === null), name >= MIN_TERM_LENGTH
  // to avoid false positives on bare numbers like "7110" or short codes like "CX50".
  for (const m of getAllModels()) {
    if (!m.name || m.name.length < MIN_TERM_LENGTH) continue;
    if (m.year_to !== null) continue;
    entries.push(makeEntry(m.name, `/stroje/${m.brand_slug}/${m.series_slug}/${m.slug}/`, 12));
  }

  for (const d of getAllDruhy()) {
    entries.push(makeEntry(d.name_plural, `/plemena/${d.slug}/`, 7));
    if (d.name && d.name !== d.name_plural) {
      entries.push(makeEntry(d.name, `/plemena/${d.slug}/`, 6));
    }
  }

  for (const p of getAllPlemena()) {
    entries.push(makeEntry(p.name, `/plemena/${p.druh_slug}/${p.slug}/`, 9));
    if (p.alternative_names) {
      for (const alt of p.alternative_names) {
        // Alt names are weaker — only link if no canonical name match found first.
        entries.push(makeEntry(alt, `/plemena/${p.druh_slug}/${p.slug}/`, 5));
      }
    }
  }

  for (const [slug, group] of Object.entries(FUNCTIONAL_GROUPS) as Array<[FunctionalGroupSlug, typeof FUNCTIONAL_GROUPS[FunctionalGroupSlug]]>) {
    entries.push(makeEntry(group.name, `/stroje/zemedelske-stroje/${slug}/`, 4));
  }

  // Sort by term length DESC (so "John Deere" matches before "Deere"), priority DESC tie-break.
  entries.sort((a, b) => b.term.length - a.term.length || b.priority - a.priority);
  return entries;
}

function getGlossary(): GlossaryEntry[] {
  if (!cachedGlossary) cachedGlossary = buildGlossary();
  return cachedGlossary;
}

interface Token {
  type: 'tag' | 'text';
  value: string;
  tagName?: string;
  isClosing?: boolean;
  isSelfClosing?: boolean;
}

function tokenize(html: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < html.length) {
    if (html[i] === '<') {
      const end = html.indexOf('>', i);
      if (end === -1) {
        tokens.push({ type: 'text', value: html.slice(i) });
        break;
      }
      const raw = html.slice(i, end + 1);
      const m = raw.match(/^<\s*(\/)?\s*([a-zA-Z][a-zA-Z0-9-]*)/);
      if (m) {
        const tagName = m[2].toLowerCase();
        tokens.push({
          type: 'tag',
          value: raw,
          tagName,
          isClosing: m[1] === '/',
          isSelfClosing: raw.endsWith('/>') || SELF_CLOSING.has(tagName),
        });
      } else {
        // <!-- comment --> or <!DOCTYPE> — preserve as raw text-like
        tokens.push({ type: 'tag', value: raw });
      }
      i = end + 1;
    } else {
      const next = html.indexOf('<', i);
      const text = html.slice(i, next === -1 ? undefined : next);
      tokens.push({ type: 'text', value: text });
      i = next === -1 ? html.length : next;
    }
  }
  return tokens;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function tryInject(text: string, glossary: GlossaryEntry[], used: Set<string>): string {
  if (used.size >= MAX_LINKS_PER_ARTICLE) return text;
  // Lowercase the haystack ONCE per text node, then String.includes() prefilter
  // skips ~90% of glossary entries for free. Without this, 640 entries × N text nodes
  // × lookbehind regex = CF Worker CPU spike → error 1102 (10ms free / 50ms paid limit).
  // Pattern is precompiled at glossary build, so the only hot-path cost is includes().
  const textLower = text.toLowerCase();
  let s = text;
  for (const entry of glossary) {
    if (used.size >= MAX_LINKS_PER_ARTICLE) break;
    if (used.has(entry.url)) continue;
    if (!textLower.includes(entry.termLower)) continue;
    const match = entry.pattern.exec(s);
    if (match) {
      const before = s.slice(0, match.index);
      const matched = match[0];
      const after = s.slice(match.index + matched.length);
      s = `${before}<a href="${entry.url}" class="auto-link">${matched}</a>${after}`;
      used.add(entry.url);
    }
  }
  return s;
}

/**
 * Inject internal links into article HTML.
 * @param html — article HTML (CMS-rendered, may contain <p>, <h2>, <a>, <img>, etc.)
 * @param excludeUrl — current page URL path (e.g. `/stroje/fendt/`); the linker won't link to this.
 */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Shared state used to dedupe links across multiple injectLinks() calls (e.g. perex + body). */
export function createLinkContext(excludeUrl?: string): Set<string> {
  const used = new Set<string>();
  if (excludeUrl) used.add(excludeUrl);
  return used;
}

/**
 * Inject internal links into plain text (e.g. perex / lead). HTML-escapes input first
 * so output is safe to use with `set:html`.
 *
 * Pass `used` from createLinkContext() to share dedup state with a subsequent injectLinks() call.
 */
export function injectLinksInText(text: string, excludeUrlOrUsed?: string | Set<string>): string {
  if (!text) return text;
  return injectLinks(escapeHtml(text), excludeUrlOrUsed);
}

export function injectLinks(html: string, excludeUrlOrUsed?: string | Set<string>): string {
  if (!html) return html;
  try {
    const glossary = getGlossary();
    const used = excludeUrlOrUsed instanceof Set
      ? excludeUrlOrUsed
      : createLinkContext(excludeUrlOrUsed);

    const tokens = tokenize(html);
    let protectedDepth = 0;
    const out: string[] = [];

    for (const tok of tokens) {
      if (tok.type === 'tag' && tok.tagName && PROTECTED_TAGS.has(tok.tagName)) {
        if (tok.isClosing) {
          protectedDepth = Math.max(0, protectedDepth - 1);
        } else if (!tok.isSelfClosing) {
          protectedDepth++;
        }
        out.push(tok.value);
      } else if (tok.type === 'text' && protectedDepth === 0) {
        out.push(tryInject(tok.value, glossary, used));
      } else {
        out.push(tok.value);
      }
    }
    return out.join('');
  } catch (e) {
    console.error('[auto-linker] injectLinks failed, returning original HTML', e);
    return html;
  }
}
