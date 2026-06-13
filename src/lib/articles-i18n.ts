// src/lib/articles-i18n.ts
// Per-locale overlay of Supabase `articles` rows with `article_translations`.
// PURE helpers (no I/O) are unit-tested; the fetch helper wraps a Supabase call.

/** Translatable display fields overlaid onto a cs article. slug/id/structural
 *  fields are NEVER overlaid — the URL reuses the cs slug. */
export interface ArticleTranslation {
  article_id?: string;
  title?: string | null;
  perex?: string | null;
  content?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
}

const OVERLAY_FIELDS = ['title', 'perex', 'content', 'seo_title', 'seo_description'] as const;

/** Merge a translation onto a cs row. Per-field fallback: a translated value
 *  wins only when it is a non-empty string; otherwise the cs value is kept.
 *  Returns a NEW object when a translation is applied; the cs row is never
 *  mutated. Null/undefined translation → cs row returned unchanged (same
 *  reference — callers treat it read-only), which keeps the cs path identical. */
export function overlayArticle<T extends Record<string, any>>(
  cs: T,
  tr: ArticleTranslation | null | undefined,
): T {
  if (!tr) return cs;
  const out: Record<string, any> = { ...cs };
  for (const f of OVERLAY_FIELDS) {
    const v = (tr as any)[f];
    if (typeof v === 'string' && v.trim() !== '') out[f] = v;
  }
  return out as T;
}

/** True když překlad existuje a má neprázdný titulek — tj. článek je reálně
 *  přeložen do daného locale, ne jen prázdný/částečný řádek. */
export function hasTranslatedTitle(tr: ArticleTranslation | null | undefined): boolean {
  return !!tr && typeof tr.title === 'string' && tr.title.trim() !== '';
}

/** Index translation rows by article_id for O(1) listing overlays. */
export function buildTranslationMap(
  rows: Array<ArticleTranslation & { article_id: string }> | null | undefined,
): Map<string, ArticleTranslation> {
  const m = new Map<string, ArticleTranslation>();
  for (const r of rows ?? []) if (r?.article_id) m.set(r.article_id, r);
  return m;
}

/** Fetch translations for the given article ids + locale from the shared
 *  content-network `article_translations` table (CMS migration 040). The table
 *  has no own `status` column — anon-read RLS already restricts rows to those
 *  whose parent article is published, so no status filter here. Returns [] on
 *  cs or empty ids. */
export async function fetchArticleTranslations(
  supabase: { from: (t: string) => any },
  ids: string[],
  locale: string,
): Promise<Array<ArticleTranslation & { article_id: string }>> {
  if (locale === 'cs' || ids.length === 0) return [];
  const { data } = await supabase
    .from('article_translations')
    .select('article_id, title, perex, content, seo_title, seo_description')
    .eq('locale', locale)
    .in('article_id', ids);
  return data ?? [];
}

/** Množina article_id, které mají neprázdný titulek překladu pro daný locale.
 *  Slouží k omezení non-cs výpisů (hub, kategorie, téma, související) jen na
 *  reálně přeložené články — žádný český fallback neprosakuje do /sk ani /uk.
 *  cs → prázdná množina (volající ji ignoruje a cs cestu nechá beze změny). */
export async function fetchTranslatedArticleIds(
  supabase: { from: (t: string) => any },
  locale: string,
): Promise<Set<string>> {
  if (locale === 'cs') return new Set();
  const { data } = await supabase
    .from('article_translations')
    .select('article_id, title')
    .eq('locale', locale);
  const ids = new Set<string>();
  for (const r of (data ?? []) as Array<ArticleTranslation & { article_id: string }>) {
    if (r?.article_id && hasTranslatedTitle(r)) ids.add(r.article_id);
  }
  return ids;
}
