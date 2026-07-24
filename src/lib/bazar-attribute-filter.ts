import { attributesForCategory } from './bazar-attributes';

/**
 * Z query paramů (`a_<key>`) sestaví objekt pro Supabase `.contains('attributes', obj)`
 * (Postgres `@>`, GIN-indexovaný). Bere jen bool + enum atributy platné pro danou
 * kategorii; číselné a neznámé/nevalidní ignoruje. Bez kategorie jen sdílené (['*']).
 */
export function parseAttributeFilters(params: URLSearchParams, category: string): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const def of attributesForCategory(category)) {
    const raw = params.get(`a_${def.key}`);
    if (raw == null || raw === '') continue;
    if (def.type === 'bool') {
      if (raw === '1' || raw === 'true') out[def.key] = true;
    } else if (def.type === 'enum') {
      if (def.options?.includes(raw)) out[def.key] = raw;
    }
    // number: ve filtru zatím vynecháno
  }
  return out;
}
