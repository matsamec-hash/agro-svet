// Compile-time data: YAML přes @modyfi/vite-plugin-yaml, JSON nativně. Žádná runtime DB.

export type Skupina =
  | 'obiloviny'
  | 'olejniny'
  | 'okopaniny'
  | 'luskoviny'
  | 'picniny';

export const SKUPINA_LABELS: Record<Skupina, string> = {
  obiloviny: 'Obiloviny',
  olejniny: 'Olejniny',
  okopaniny: 'Okopaniny',
  luskoviny: 'Luskoviny',
  picniny: 'Pícniny',
};

/** Faktická vrstva odrůdy — generovaná z ÚKZÚZ, commitovaná jako JSON. */
export interface OdrudaFakta {
  slug: string;
  name: string;
  plodina_slug: string;
  rok_registrace?: number | null;
  udrzovatel?: string | null;
  typ?: string | null;
  ranost?: string | null;
  zdroj_url?: string | null;
}

/** Obohacení odrůdy — kurátorovaná/AI vrstva, volitelné. */
export interface OdrudaEnrichment {
  popis?: string;
  vlastnosti?: Record<string, string | number>;
  odolnosti?: Record<string, string | number>;
  doporuceni?: string;
  body?: string;
  faq?: { q: string; a: string }[];
}

/** Spojená odrůda (fakta + případné obohacení). */
export interface Odruda extends OdrudaFakta {
  enrichment?: OdrudaEnrichment;
}

export interface HowToStepData { name: string; text: string }

/** Obohacující vrstva plodiny (YAML). */
export interface PlodinaYaml {
  slug: string;
  name: string;
  name_plural: string;
  skupina: Skupina;
  description: string;
  vysevek?: string;
  hnojeni?: string;
  vynos_t_ha?: string;
  sklizen?: string;
  vyuziti?: string;
  choroby?: string[];
  osevni_postup?: HowToStepData[];
  wikipedia?: string;
  wikidata?: string;
  body?: string;
  faq?: { q: string; a: string }[];
  enrichment?: Record<string, OdrudaEnrichment>;
}

/** Plodina spojená s odrůdami — to, co konzumují stránky. */
export interface Plodina extends PlodinaYaml {
  odrudy: Odruda[];
}

const yamlModules = import.meta.glob('/src/data/plodiny/*.yaml', {
  eager: true,
  import: 'default',
}) as Record<string, PlodinaYaml>;

const odrudyModules = import.meta.glob('/src/data/plodiny/odrudy/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, OdrudaFakta[]>;

let cached: Plodina[] | null = null;

function buildOdrudyIndex(): Record<string, OdrudaFakta[]> {
  const byPlodina: Record<string, OdrudaFakta[]> = {};
  for (const arr of Object.values(odrudyModules)) {
    for (const o of arr) {
      (byPlodina[o.plodina_slug] ??= []).push(o);
    }
  }
  return byPlodina;
}

function build(): Plodina[] {
  if (cached) return cached;
  const odrudyIndex = buildOdrudyIndex();
  const plodiny: Plodina[] = [];
  for (const yaml of Object.values(yamlModules)) {
    if (yaml.slug === 'skupina') {
      throw new Error('Plodina nesmí mít rezervovaný slug "skupina"');
    }
    const fakta = odrudyIndex[yaml.slug] ?? [];
    const odrudy: Odruda[] = fakta.map((f) => ({
      ...f,
      enrichment: yaml.enrichment?.[f.slug],
    }));
    odrudy.sort((a, b) => a.name.localeCompare(b.name, 'cs'));
    plodiny.push({ ...yaml, odrudy });
  }
  plodiny.sort((a, b) => a.name.localeCompare(b.name, 'cs'));
  cached = plodiny;
  return plodiny;
}

export function listPlodiny(): Plodina[] {
  return build();
}

export function getPlodina(slug: string): Plodina | undefined {
  return build().find((p) => p.slug === slug);
}

/**
 * Odrůda dostane vlastní indexovanou URL jen když má obohacení (popis / FAQ /
 * vlastnosti). Holé odrůdy z ÚKZÚZ žijí pouze jako řádek v tabulce na stránce
 * plodiny — žádné tenké duplikátní URL. Anti-thin guardrail.
 */
export function isOdrudaIndexable(o: Odruda): boolean {
  const e = o.enrichment;
  if (!e) return false;
  return Boolean(
    (e.popis && e.popis.trim().length > 0) ||
      (e.faq && e.faq.length > 0) ||
      (e.vlastnosti && Object.keys(e.vlastnosti).length > 0) ||
      (e.body && e.body.trim().length > 0),
  );
}

export function getOdruda(plodinaSlug: string, odrudaSlug: string): Odruda | undefined {
  return getPlodina(plodinaSlug)?.odrudy.find((o) => o.slug === odrudaSlug);
}

export interface IndexableOdrudaEntry {
  plodina_slug: string;
  plodina_name: string;
  odruda: Odruda;
}

export function listIndexableOdrudy(): IndexableOdrudaEntry[] {
  const out: IndexableOdrudaEntry[] = [];
  for (const p of build()) {
    for (const o of p.odrudy) {
      if (isOdrudaIndexable(o)) {
        out.push({ plodina_slug: p.slug, plodina_name: p.name, odruda: o });
      }
    }
  }
  return out;
}
