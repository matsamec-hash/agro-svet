// Build-time / SSR auto-linker. Scans HTML article content, finds first
// occurrence of each glossary term (brand, plemeno, druh, kategorie strojů)
// and wraps it in <a>. One link per target URL per article. Skips inside
// headings (h1–h6), existing anchors, code/pre, script/style. Driven by
// YAML catalogs already loaded via @modyfi/vite-plugin-yaml.

import { getAllBrands, getAllModels, FUNCTIONAL_GROUPS, type FunctionalGroupSlug } from './stroje';
import { getAllDruhy, getAllPlemena } from './plemena';

interface GlossaryEntry {
  term: string;
  url: string;
  /** Higher wins when terms overlap; longer terms also matched first by length. */
  priority: number;
}

const PROTECTED_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'code', 'pre', 'script', 'style', 'figcaption']);
const SELF_CLOSING = new Set(['br', 'hr', 'img', 'input', 'meta', 'link', 'source']);
/** Hard cap per article — over-linking is a spam signal. */
const MAX_LINKS_PER_ARTICLE = 12;

/**
 * Strip year/parenthetical suffix and produce match variants for a series name.
 * "T6 Series (2014–dosud)" → ["T6 Series", "T6"]
 * "Dieselross (1937–1958)" → ["Dieselross"]
 */
function seriesNameVariants(name: string): string[] {
  const stripped = name.replace(/\s*\([^)]*\)\s*$/, '').trim();
  if (!stripped) return [];
  const variants = [stripped];
  const m = stripped.match(/^(.+?)\s+(Series|řada)$/i);
  if (m) {
    const base = m[1].trim();
    if (base && base !== stripped) variants.push(base);
  }
  return variants;
}

let cachedGlossary: GlossaryEntry[] | null = null;

function buildGlossary(): GlossaryEntry[] {
  const entries: GlossaryEntry[] = [];

  for (const b of getAllBrands()) {
    entries.push({ term: b.name, url: `/stroje/${b.slug}/`, priority: 10 });
    for (const cat of Object.values(b.categories || {})) {
      for (const s of cat?.series ?? []) {
        const url = `/stroje/${b.slug}/${s.slug}/`;
        for (const variant of seriesNameVariants(s.name)) {
          // Higher priority for the longer/canonical variant.
          const isCanonical = variant.length === seriesNameVariants(s.name)[0].length;
          entries.push({ term: variant, url, priority: isCanonical ? 11 : 8 });
        }
      }
    }
  }

  for (const m of getAllModels()) {
    if (!m.name || m.name.length < 3) continue;
    entries.push({
      term: m.name,
      url: `/stroje/${m.brand_slug}/${m.series_slug}/${m.slug}/`,
      priority: 12,
    });
  }

  for (const d of getAllDruhy()) {
    entries.push({ term: d.name_plural, url: `/plemena/${d.slug}/`, priority: 7 });
    if (d.name && d.name !== d.name_plural) {
      entries.push({ term: d.name, url: `/plemena/${d.slug}/`, priority: 6 });
    }
  }

  for (const p of getAllPlemena()) {
    entries.push({ term: p.name, url: `/plemena/${p.druh_slug}/${p.slug}/`, priority: 9 });
    if (p.alternative_names) {
      for (const alt of p.alternative_names) {
        // Alt names are weaker — only link if no canonical name match found first.
        entries.push({ term: alt, url: `/plemena/${p.druh_slug}/${p.slug}/`, priority: 5 });
      }
    }
  }

  for (const [slug, group] of Object.entries(FUNCTIONAL_GROUPS) as Array<[FunctionalGroupSlug, typeof FUNCTIONAL_GROUPS[FunctionalGroupSlug]]>) {
    entries.push({ term: group.name, url: `/stroje/zemedelske-stroje/${slug}/`, priority: 4 });
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
  let s = text;
  for (const entry of glossary) {
    if (used.size >= MAX_LINKS_PER_ARTICLE) break;
    if (used.has(entry.url)) continue;
    // Word-boundary match using Unicode letter/number classes (covers Czech diacritics).
    // Lookbehind/ahead ensure we don't match mid-word. Case-insensitive.
    const pattern = new RegExp(`(?<![\\p{L}\\p{N}_])(${escapeRegex(entry.term)})(?![\\p{L}\\p{N}_])`, 'iu');
    const match = pattern.exec(s);
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
export function injectLinks(html: string, excludeUrl?: string): string {
  if (!html) return html;
  const glossary = getGlossary();
  const used = new Set<string>();
  if (excludeUrl) used.add(excludeUrl);

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
}
