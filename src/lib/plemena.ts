// YAML imports parsed at compile-time by @modyfi/vite-plugin-yaml — no runtime js-yaml.

export type PlemenoUzitkovost = 'maso' | 'mleko' | 'kombinovane' | 'tazne' | 'sportovni' | 'vlna' | 'jezdecke' | 'ostatni';

export interface Plemeno {
  slug: string;
  name: string;
  alternative_names?: string[];
  origin_country: string;
  year_registered?: number | null;
  uzitkovost: PlemenoUzitkovost[];
  description: string;
  color?: string;
  weight_male_kg?: number | null;
  weight_female_kg?: number | null;
  milk_yield_kg_year?: number | null;
  height_cm?: number | null;
  image_url?: string | null;
  specs?: Record<string, string | number | null>;
  /** Wikipedia URL (cs preferred). Feeds JSON-LD sameAs — Knowledge Graph signal. */
  wikipedia?: string;
  /** Wikidata Q-entity URL. Cross-language entity anchor for AI Overviews. */
  wikidata?: string;
  /**
   * Volitelný redakční long-form blok (HTML). Renderuje se na detailu plemene
   * pod charakteristikou. Smí obsahovat interní odkazy + keyword varianty —
   * prohlubuje rankující URL místo zakládání samostatného článku (kanibalizace).
   */
  body?: string;
  /** Volitelné Q&A → FAQPage JSON-LD + viditelná sekce (mirror detailu strojů). */
  faq?: { q: string; a: string }[];
}

export interface Druh {
  slug: string;
  name: string;
  name_plural: string;
  description: string;
  plemena: Plemeno[];
}

export interface PlemenoFlat extends Plemeno {
  druh_slug: string;
  druh_name: string;
}

/** Podporovaná locale pro katalog plemen. cs = zdrojová YAML, sk = přeložená overlay. */
export type PlemenaLocale = 'cs' | 'sk';

// Vite plugin parses YAML at compile-time → default export is already an object.
// cs = zdrojová data; sk = přeložená overlay se stejnými slugy (plemena-sk/*.yaml).
const druhModulesCs = import.meta.glob('/src/data/plemena/*.yaml', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>;
const druhModulesSk = import.meta.glob('/src/data/plemena-sk/*.yaml', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>;

// Per-locale cache (SSR: modul žije napříč requesty, cache je bezpečná – data jsou immutable).
const cachedDruhy: Record<PlemenaLocale, Druh[] | null> = { cs: null, sk: null };
const cachedFlat: Record<PlemenaLocale, PlemenoFlat[] | null> = { cs: null, sk: null };

function coerceSlug(v: unknown): string {
  return typeof v === 'string' ? v : String(v);
}

function normalize(raw: any): Druh {
  raw.slug = coerceSlug(raw.slug);
  for (const p of raw.plemena || []) {
    p.slug = coerceSlug(p.slug);
  }
  return raw as Druh;
}

function localeOf(locale?: string): PlemenaLocale {
  return locale === 'sk' ? 'sk' : 'cs';
}

export function getAllDruhy(locale?: string): Druh[] {
  const loc = localeOf(locale);
  const cached = cachedDruhy[loc];
  if (cached) return cached;
  const modules = loc === 'sk' ? druhModulesSk : druhModulesCs;
  const out: Druh[] = [];
  for (const [path, raw] of Object.entries(modules)) {
    const parsed = raw as Druh;
    if (!parsed?.slug) {
      console.warn(`[plemena] Missing druh slug in ${path}`);
      continue;
    }
    out.push(normalize(parsed));
  }
  out.sort((a, b) => a.name.localeCompare(b.name, loc));
  cachedDruhy[loc] = out;
  return out;
}

export function getDruh(slug: string, locale?: string): Druh | undefined {
  return getAllDruhy(locale).find((d) => d.slug === slug);
}

export function getAllPlemena(locale?: string): PlemenoFlat[] {
  const loc = localeOf(locale);
  const cached = cachedFlat[loc];
  if (cached) return cached;
  const flat: PlemenoFlat[] = [];
  for (const druh of getAllDruhy(loc)) {
    for (const p of druh.plemena || []) {
      flat.push({ ...p, druh_slug: druh.slug, druh_name: druh.name });
    }
  }
  cachedFlat[loc] = flat;
  return flat;
}

export function getPlemeno(druhSlug: string, plemenoSlug: string, locale?: string): { druh: Druh; plemeno: Plemeno } | undefined {
  const druh = getDruh(druhSlug, locale);
  if (!druh) return undefined;
  const plemeno = druh.plemena.find((p) => p.slug === plemenoSlug);
  if (!plemeno) return undefined;
  return { druh, plemeno };
}

export const UZITKOVOST_LABELS: Record<PlemenoUzitkovost, string> = {
  maso: 'Masné',
  mleko: 'Mléčné',
  kombinovane: 'Kombinované',
  tazne: 'Tažné',
  sportovni: 'Sportovní',
  vlna: 'Vlna',
  jezdecke: 'Jezdecké',
  ostatni: 'Ostatní',
};

const UZITKOVOST_LABELS_SK: Record<PlemenoUzitkovost, string> = {
  maso: 'Mäsové',
  mleko: 'Mliekové',
  kombinovane: 'Kombinované',
  tazne: 'Ťažné',
  sportovni: 'Športové',
  vlna: 'Vlna',
  jezdecke: 'Jazdecké',
  ostatni: 'Ostatné',
};

/** Lokalizované popisky užitkovosti. cs = výchozí, sk = přeložené. */
export function getUzitkovostLabels(locale?: string): Record<PlemenoUzitkovost, string> {
  return locale === 'sk' ? UZITKOVOST_LABELS_SK : UZITKOVOST_LABELS;
}
