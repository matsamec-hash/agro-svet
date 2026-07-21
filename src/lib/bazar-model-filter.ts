/**
 * Pure helpers for the bazar multi-select model/series filter.
 *
 * The model filter lets a visitor pick several individual models and/or whole
 * series (a series = all its models). Selection is carried in the URL as
 * repeated `model=<slug>` params. This module turns the selected model slugs +
 * their catalog names into a PostgREST `.or()` expression so the query matches
 * either the structured `model_slug` OR the model name in the free-text title
 * (Bazoš-seeded listings have the model only in the title, model_slug = null).
 */

export interface ModelRef {
  slug: string;
  name?: string | null;
}

/** Names containing PostgREST `.or()` delimiters can't go into a title.ilike. */
function isSafeName(name: string): boolean {
  return name.length > 0 && !/[,().*]/.test(name);
}

/**
 * Build the PostgREST `.or()` expression for a set of selected models.
 * Returns '' when nothing is selected (caller then applies no model filter).
 *
 * Example: [{slug:'5090r',name:'5090R'}] →
 *   "model_slug.in.(5090r),title.ilike.*5090R*"
 */
export function buildModelFilterExpr(models: ModelRef[]): string {
  const slugs = [...new Set(models.map((m) => m.slug).filter(Boolean))];
  if (slugs.length === 0) return '';

  const clauses: string[] = [`model_slug.in.(${slugs.join(',')})`];
  const seenNames = new Set<string>();
  for (const m of models) {
    const name = (m.name ?? '').trim();
    if (isSafeName(name) && !seenNames.has(name)) {
      seenNames.add(name);
      clauses.push(`title.ilike.*${name}*`);
    }
  }
  return clauses.join(',');
}

/**
 * Normalise raw `model` query values into a clean, de-duplicated slug list.
 * Accepts the array from `URLSearchParams.getAll('model')`.
 */
export function parseSelectedModelSlugs(raw: string[]): string[] {
  return [...new Set(raw.map((s) => s.trim()).filter(Boolean))];
}
