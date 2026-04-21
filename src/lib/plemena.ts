import jsyaml from 'js-yaml';

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

const druhModules = import.meta.glob('/src/data/plemena/*.yaml', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

let cachedDruhy: Druh[] | null = null;
let cachedFlat: PlemenoFlat[] | null = null;

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

export function getAllDruhy(): Druh[] {
  if (cachedDruhy) return cachedDruhy;
  const out: Druh[] = [];
  for (const [path, raw] of Object.entries(druhModules)) {
    const parsed = jsyaml.load(raw) as Druh;
    if (!parsed?.slug) {
      console.warn(`[plemena] Missing druh slug in ${path}`);
      continue;
    }
    out.push(normalize(parsed));
  }
  out.sort((a, b) => a.name.localeCompare(b.name, 'cs'));
  cachedDruhy = out;
  return out;
}

export function getDruh(slug: string): Druh | undefined {
  return getAllDruhy().find((d) => d.slug === slug);
}

export function getAllPlemena(): PlemenoFlat[] {
  if (cachedFlat) return cachedFlat;
  const flat: PlemenoFlat[] = [];
  for (const druh of getAllDruhy()) {
    for (const p of druh.plemena || []) {
      flat.push({ ...p, druh_slug: druh.slug, druh_name: druh.name });
    }
  }
  cachedFlat = flat;
  return flat;
}

export function getPlemeno(druhSlug: string, plemenoSlug: string): { druh: Druh; plemeno: Plemeno } | undefined {
  const druh = getDruh(druhSlug);
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
