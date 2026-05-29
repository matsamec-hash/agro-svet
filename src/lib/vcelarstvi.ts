// YAML parsováno compile-time přes @modyfi/vite-plugin-yaml (jako plemena.ts).

export type VcelaTemperament = 'mírná' | 'střední' | 'obranná';
export type VcelaVynos = 'nízký' | 'střední' | 'vysoký' | 'velmi vysoký';
export type VcelaRojivost = 'nízká' | 'střední' | 'vyšší';

export interface Vcela {
  slug: string;
  name: string;
  latinsky: string;
  alternative_names?: string[];
  puvod: string;
  temperament: VcelaTemperament;
  medny_vynos: VcelaVynos;
  rojivost: VcelaRojivost;
  zimuvzdornost: string;
  vhodnost_cr: string;
  barva?: string;
  description: string;
  image_url?: string | null;
  wikipedia?: string;
  wikidata?: string;
  faq?: { q: string; a: string }[];
}

export type VybaveniKategorie = 'ul' | 'ochrana' | 'naradi' | 'zpracovani' | 'krmeni';

export interface Vybaveni {
  slug: string;
  name: string;
  kategorie: VybaveniKategorie;
  popis_kratky: string;
  description: string;
  pro_zacatecniky?: boolean;
  orientacni_cena?: string;
  image_url?: string | null;
  related?: string[];
}

export type MedTyp = 'kvetovy' | 'medovicovy' | 'smiseny';
export type MedKrystalizace = 'velmi pomalá' | 'pomalá' | 'střední' | 'rychlá';

export interface Med {
  slug: string;
  name: string;
  typ: MedTyp;
  zdroj_snusky: string;
  barva: string;
  chut: string;
  krystalizace: MedKrystalizace;
  popis_kratky: string;
  description: string;
  image_url?: string | null;
}

const vcelyModules = import.meta.glob('/src/data/vcelarstvi/vcely*.yaml', { eager: true, import: 'default' }) as Record<string, unknown>;
const vybaveniModules = import.meta.glob('/src/data/vcelarstvi/vybaveni*.yaml', { eager: true, import: 'default' }) as Record<string, unknown>;
const medModules = import.meta.glob('/src/data/vcelarstvi/med*.yaml', { eager: true, import: 'default' }) as Record<string, unknown>;

function collectArrays<T>(modules: Record<string, unknown>): T[] {
  const out: T[] = [];
  for (const [path, raw] of Object.entries(modules)) {
    if (Array.isArray(raw)) out.push(...(raw as T[]));
    else console.warn(`[vcelarstvi] Expected array in ${path}, got ${typeof raw}`);
  }
  return out;
}

let cVcely: Vcela[] | null = null;
let cVybaveni: Vybaveni[] | null = null;
let cMed: Med[] | null = null;

export function getAllVcely(): Vcela[] {
  if (cVcely) return cVcely;
  cVcely = collectArrays<Vcela>(vcelyModules).map((v) => ({ ...v, slug: String(v.slug) }));
  cVcely.sort((a, b) => a.name.localeCompare(b.name, 'cs'));
  return cVcely;
}
export function getVcela(slug: string): Vcela | undefined {
  return getAllVcely().find((v) => v.slug === slug);
}

export function getAllVybaveni(): Vybaveni[] {
  if (cVybaveni) return cVybaveni;
  cVybaveni = collectArrays<Vybaveni>(vybaveniModules).map((v) => ({ ...v, slug: String(v.slug) }));
  cVybaveni.sort((a, b) => a.name.localeCompare(b.name, 'cs'));
  return cVybaveni;
}
export function getVybaveni(slug: string): Vybaveni | undefined {
  return getAllVybaveni().find((v) => v.slug === slug);
}

export function getAllMed(): Med[] {
  if (cMed) return cMed;
  cMed = collectArrays<Med>(medModules).map((v) => ({ ...v, slug: String(v.slug) }));
  cMed.sort((a, b) => a.name.localeCompare(b.name, 'cs'));
  return cMed;
}
export function getMed(slug: string): Med | undefined {
  return getAllMed().find((v) => v.slug === slug);
}

export const VYBAVENI_KATEGORIE_LABELS: Record<VybaveniKategorie, string> = {
  ul: 'Úly',
  ochrana: 'Ochranné pomůcky',
  naradi: 'Nářadí',
  zpracovani: 'Zpracování medu',
  krmeni: 'Krmení a zazimování',
};

export const MED_TYP_LABELS: Record<MedTyp, string> = {
  kvetovy: 'Květový',
  medovicovy: 'Medovicový',
  smiseny: 'Smíšený',
};
