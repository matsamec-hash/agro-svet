// Wikiodkazy ve výkladu hesla slovníku: `[[slug]]` nebo `[[slug|text]]`.
//
// Slug je společný pro všechny jazyky — klíčem je český slug (`hektar`,
// `osevni-postup`), ne přeložený výraz. Strojový překlad sk slovníku slugy
// přeložil (`[[hektár]]`, `[[osevný-postup]]`) a renderer je nechával doslova
// i se závorkami — na /sk/slovnik/ viselo 173 „[[…]]", v cs/pl/uk po 9
// (odkazy na hesla, která neexistují v žádném jazyce). Proto:
//  - neznámý slug se vykreslí jako prostý text, nikdy jako surové `[[…]]`,
//  - tests/lib/slovnik-wikilinks.test.ts hlídá, že každý odkaz v každém
//    jazyce míří na existující heslo.

/** Jeden wikiodkaz; vnitřek bez hranatých závorek, líně do nejbližšího `]]`. */
export const WIKILINK_RE = /\[\[([^\[\]]+?)\]\]/g;

export interface Wikilink {
  slug: string;
  /** Vlastní text odkazu z `[[slug|text]]` (gramatický tvar ve větě). */
  label?: string;
}

export function parseWikilink(inner: string): Wikilink {
  const i = inner.indexOf('|');
  if (i === -1) return { slug: inner.trim() };
  const label = inner.slice(i + 1).trim();
  return { slug: inner.slice(0, i).trim(), ...(label ? { label } : {}) };
}

/** Všechny wikiodkazy v textu (pro testy a audit). */
export function extractWikilinks(text: string): Wikilink[] {
  return [...text.matchAll(WIKILINK_RE)].map((m) => parseWikilink(m[1]));
}

/**
 * Nahradí wikiodkazy odkazem na heslo (`termsBySlug`: slug → název hesla
 * v jazyce stránky). Neznámý slug → prostý text (vlastní text, jinak slug
 * bez pomlček). Osiřelé `[[` / `]]` se zahodí — do HTML se nikdy nedostanou.
 */
export function renderWikilinks(text: string, termsBySlug: ReadonlyMap<string, string>, base: string): string {
  return text
    .replace(WIKILINK_RE, (_m, inner: string) => {
      const { slug, label } = parseWikilink(inner);
      const name = termsBySlug.get(slug);
      if (name) return `<a href="${base}/slovnik/${slug}/">${label ?? name}</a>`;
      return label ?? slug.replace(/-/g, ' ');
    })
    .replace(/\[\[|\]\]/g, '');
}
