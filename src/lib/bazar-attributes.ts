export type AttrType = 'bool' | 'enum' | 'number';

export interface AttrDef {
  key: string;
  label: string;
  type: AttrType;
  options?: string[];
  optionLabels?: Record<string, string>;
  unit?: string;
  categories: string[]; // konkrétní kategorie nebo ['*'] = sdílené
  filter?: boolean; // default true
  seoLanding?: boolean; // default false
}

// Plný slovník se dooplní v Tasku 3; zde minimum pro helpery + testy.
export const ATTRIBUTES: AttrDef[] = [
  { key: 'stav', label: 'Stav', type: 'enum', options: ['nove', 'pouzite', 'repasovane'], optionLabels: { nove: 'Nové', pouzite: 'Použité', repasovane: 'Repasované' }, categories: ['*'] },
  { key: 'klimatizace', label: 'Klimatizace', type: 'bool', categories: ['*'], seoLanding: true },
  { key: 'pohon', label: 'Pohon', type: 'enum', options: ['2x4', '4x4'], optionLabels: { '2x4': '2×4', '4x4': '4×4' }, categories: ['*'], seoLanding: true },
  { key: 'prevodovka', label: 'Převodovka', type: 'enum', options: ['manual', 'powershift', 'cvt'], optionLabels: { manual: 'Manuální', powershift: 'Powershift', cvt: 'CVT / plynulá' }, categories: ['traktory'] },
  { key: 'pocet_valcu', label: 'Počet válců', type: 'number', unit: 'ks', categories: ['traktory'] },
  { key: 'plemeno', label: 'Plemeno', type: 'enum', options: ['jine'], categories: ['zvirata'] },
];

export function attributesForCategory(category: string): AttrDef[] {
  return ATTRIBUTES.filter((a) => a.categories.includes('*') || a.categories.includes(category));
}

export function attrDef(key: string): AttrDef | undefined {
  return ATTRIBUTES.find((a) => a.key === key);
}

/** Ponechá jen atributy platné pro kategorii a hodnoty odpovídající typu. Neznámé/nevalidní zahodí. */
export function validateAttributes(category: string, raw: Record<string, unknown>): Record<string, unknown> {
  const allowed = new Map(attributesForCategory(category).map((a) => [a.key, a]));
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw ?? {})) {
    const def = allowed.get(key);
    if (!def) continue;
    if (def.type === 'bool') {
      if (value === true || value === 'true') out[key] = true;
      else if (value === false || value === 'false') continue; // false = neuvádět
    } else if (def.type === 'enum') {
      const v = String(value);
      if (def.options?.includes(v)) out[key] = v;
    } else if (def.type === 'number') {
      const n = typeof value === 'number' ? value : parseInt(String(value).replace(/[^\d-]/g, ''), 10);
      if (Number.isFinite(n)) out[key] = n;
    }
  }
  return out;
}
