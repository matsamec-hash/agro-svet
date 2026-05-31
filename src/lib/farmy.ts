// YAML imports parsed at compile-time by @modyfi/vite-plugin-yaml — no runtime js-yaml.
// Mirror lib/stroje.ts loader pattern. Kraje znovupoužíváme z cap-dotace (DRY).
import type { CzKraj } from './cap-dotace';
import { KRAJE } from './cap-dotace';

/** Pevný číselník produktů ze dvora (rozšiřitelný — přidej klíč + label). */
export const FARM_PRODUCTS = {
  'brambory': 'Brambory',
  'zelenina': 'Zelenina',
  'ovoce': 'Ovoce',
  'mleko': 'Mléko',
  'mlecne-vyrobky': 'Mléčné výrobky',
  'maso': 'Maso',
  'vejce': 'Vejce',
  'med': 'Med',
  'obiloviny': 'Obiloviny a mouka',
  'bylinky': 'Bylinky',
  'kvety': 'Květiny',
  'vino': 'Víno',
} as const;
export type FarmProduct = keyof typeof FARM_PRODUCTS;

/** Typ provozu — volný číselník pro štítek. */
export const FARM_TYPES = {
  'rodinna': 'Rodinná farma',
  'eko': 'Ekofarma',
  'zahradnictvi': 'Zahradnictví',
  'ovocnarstvi': 'Ovocnářství',
  'vcelarstvi': 'Včelařství',
  'vinarstvi': 'Vinařství',
} as const;
export type FarmType = keyof typeof FARM_TYPES;

export interface FarmContact {
  web?: string | null;
  tel?: string | null;
  email?: string | null;
}

export interface Farm {
  slug: string;
  name: string;
  farm_type: FarmType;
  description: string;
  region: CzKraj;
  district?: string | null;
  address?: string | null;
  lat: number;
  lng: number;
  eco: boolean;
  eco_cert?: string | null;
  products: FarmProduct[];
  contact?: FarmContact;
  opening?: string | null;
  photos?: string[];
  featured?: boolean;
  featured_until?: string | null;
}

// Vite plugin parses YAML at compile-time → default export is already an object.
const farmModules = import.meta.glob('/src/data/farmy/*.yaml', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>;

let cachedFarms: Farm[] | null = null;

function coerceSlug(value: unknown): string {
  return typeof value === 'string' ? value : String(value);
}

export function getAllFarms(): Farm[] {
  if (cachedFarms) return cachedFarms;
  const farms: Farm[] = [];
  for (const [path, raw] of Object.entries(farmModules)) {
    const parsed = raw as Farm;
    if (!parsed?.slug) {
      console.warn(`[farmy] Missing farm slug in ${path}`);
      continue;
    }
    parsed.slug = coerceSlug(parsed.slug);
    parsed.products = parsed.products ?? [];
    parsed.photos = parsed.photos ?? [];
    parsed.eco = parsed.eco ?? false;
    farms.push(parsed);
  }
  farms.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false) || a.name.localeCompare(b.name, 'cs'));
  cachedFarms = farms;
  return farms;
}

export function getFarm(slug: string): Farm | undefined {
  return getAllFarms().find((f) => f.slug === slug);
}

export function getFarmsByRegion(region: CzKraj): Farm[] {
  return getAllFarms().filter((f) => f.region === region);
}

/** Název kraje z číselníku KRAJE (jeden zdroj pravdy). */
export function regionName(slug: CzKraj): string {
  return KRAJE.find((k) => k.slug === slug)?.name ?? slug;
}

/** Kraje s alespoň `min` farmami — jen ty dostanou krajský landing (thin-content guard). */
export function regionsWithEnoughFarms(min = 3): { slug: CzKraj; name: string; count: number }[] {
  const counts = new Map<CzKraj, number>();
  for (const f of getAllFarms()) counts.set(f.region, (counts.get(f.region) ?? 0) + 1);
  return [...counts.entries()]
    .filter(([, n]) => n >= min)
    .map(([slug, count]) => ({ slug, name: regionName(slug), count }))
    .sort((a, b) => a.name.localeCompare(b.name, 'cs'));
}

/** Počet farem nabízejících daný produkt — pro filtr UI. */
export function productCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const f of getAllFarms()) for (const p of f.products) counts[p] = (counts[p] ?? 0) + 1;
  return counts;
}

export interface FarmFilter {
  region?: CzKraj | '';
  product?: FarmProduct | '';
  eco?: boolean | null;
  q?: string;
}

/** Čistá filtrační funkce — sdílená logika pro server i dokumentace klientského filtru. */
export function filterFarms(farms: Farm[], filter: FarmFilter): Farm[] {
  const q = filter.q?.trim().toLowerCase() ?? '';
  return farms.filter((f) => {
    if (filter.region && f.region !== filter.region) return false;
    if (filter.product && !f.products.includes(filter.product)) return false;
    if (filter.eco === true && !f.eco) return false;
    if (filter.eco === false && f.eco) return false;
    if (q) {
      const hay = `${f.name} ${f.description} ${f.address ?? ''} ${f.district ?? ''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}
