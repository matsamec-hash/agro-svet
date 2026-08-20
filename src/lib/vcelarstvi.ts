// YAML parsováno compile-time přes @modyfi/vite-plugin-yaml (jako plemena.ts).
// Locale-aware: cs čte z /src/data/vcelarstvi/*.yaml, sk z /src/data/vcelarstvi/sk/*.yaml
// (přeložená próza, enum/slug/image/číselné hodnoty zachované → CSS třídy + JSON-LD
// klíče stabilní). cs cesta beze změny (byte-identita).
import type { Locale } from '../i18n/config';

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
  image_credit?: string;
  image_source_url?: string;
  image_license?: string;
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
  image_credit?: string;
  image_source_url?: string;
  image_license?: string;
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
  image_credit?: string;
  image_source_url?: string;
  image_license?: string;
}

const vcelyModules = import.meta.glob('/src/data/vcelarstvi/vcely*.yaml', { eager: true, import: 'default' }) as Record<string, unknown>;
const vybaveniModules = import.meta.glob('/src/data/vcelarstvi/vybaveni*.yaml', { eager: true, import: 'default' }) as Record<string, unknown>;
const medModules = import.meta.glob('/src/data/vcelarstvi/med*.yaml', { eager: true, import: 'default' }) as Record<string, unknown>;
const vcelySkModules = import.meta.glob('/src/data/vcelarstvi/sk/vcely*.yaml', { eager: true, import: 'default' }) as Record<string, unknown>;
const vybaveniSkModules = import.meta.glob('/src/data/vcelarstvi/sk/vybaveni*.yaml', { eager: true, import: 'default' }) as Record<string, unknown>;
const medSkModules = import.meta.glob('/src/data/vcelarstvi/sk/med*.yaml', { eager: true, import: 'default' }) as Record<string, unknown>;
const vcelyPlModules = import.meta.glob('/src/data/vcelarstvi/pl/vcely*.yaml', { eager: true, import: 'default' }) as Record<string, unknown>;
const vybaveniPlModules = import.meta.glob('/src/data/vcelarstvi/pl/vybaveni*.yaml', { eager: true, import: 'default' }) as Record<string, unknown>;
const medPlModules = import.meta.glob('/src/data/vcelarstvi/pl/med*.yaml', { eager: true, import: 'default' }) as Record<string, unknown>;

function collectArrays<T>(modules: Record<string, unknown>): T[] {
  const out: T[] = [];
  for (const [path, raw] of Object.entries(modules)) {
    if (Array.isArray(raw)) out.push(...(raw as T[]));
    else console.warn(`[vcelarstvi] Expected array in ${path}, got ${typeof raw}`);
  }
  return out;
}

function build<T extends { slug: unknown; name: string }>(modules: Record<string, unknown>, locale: Locale): T[] {
  const out = collectArrays<T>(modules).map((v) => ({ ...v, slug: String(v.slug) }));
  out.sort((a, b) => a.name.localeCompare(b.name, locale));
  return out;
}

let cVcely: Vcela[] | null = null;
let cVcelySk: Vcela[] | null = null;
let cVcelyPl: Vcela[] | null = null;
let cVybaveni: Vybaveni[] | null = null;
let cVybaveniSk: Vybaveni[] | null = null;
let cVybaveniPl: Vybaveni[] | null = null;
let cMed: Med[] | null = null;
let cMedSk: Med[] | null = null;
let cMedPl: Med[] | null = null;

export function getAllVcely(locale: Locale = 'cs'): Vcela[] {
  if (locale === 'sk') return (cVcelySk ??= build<Vcela>(vcelySkModules, 'sk'));
  if (locale === 'pl') return (cVcelyPl ??= build<Vcela>(vcelyPlModules, 'pl'));
  return (cVcely ??= build<Vcela>(vcelyModules, 'cs'));
}
export function getVcela(slug: string, locale: Locale = 'cs'): Vcela | undefined {
  return getAllVcely(locale).find((v) => v.slug === slug);
}

export function getAllVybaveni(locale: Locale = 'cs'): Vybaveni[] {
  if (locale === 'sk') return (cVybaveniSk ??= build<Vybaveni>(vybaveniSkModules, 'sk'));
  if (locale === 'pl') return (cVybaveniPl ??= build<Vybaveni>(vybaveniPlModules, 'pl'));
  return (cVybaveni ??= build<Vybaveni>(vybaveniModules, 'cs'));
}
export function getVybaveni(slug: string, locale: Locale = 'cs'): Vybaveni | undefined {
  return getAllVybaveni(locale).find((v) => v.slug === slug);
}

export function getAllMed(locale: Locale = 'cs'): Med[] {
  if (locale === 'sk') return (cMedSk ??= build<Med>(medSkModules, 'sk'));
  if (locale === 'pl') return (cMedPl ??= build<Med>(medPlModules, 'pl'));
  return (cMed ??= build<Med>(medModules, 'cs'));
}
export function getMed(slug: string, locale: Locale = 'cs'): Med | undefined {
  return getAllMed(locale).find((v) => v.slug === slug);
}

export const VYBAVENI_KATEGORIE_LABELS: Record<VybaveniKategorie, string> = {
  ul: 'Úly',
  ochrana: 'Ochranné pomůcky',
  naradi: 'Nářadí',
  zpracovani: 'Zpracování medu',
  krmeni: 'Krmení a zazimování',
};
const VYBAVENI_KATEGORIE_LABELS_SK: Record<VybaveniKategorie, string> = {
  ul: 'Úle',
  ochrana: 'Ochranné pomôcky',
  naradi: 'Náradie',
  zpracovani: 'Spracovanie medu',
  krmeni: 'Kŕmenie a zazimovanie',
};
const VYBAVENI_KATEGORIE_LABELS_PL: Record<VybaveniKategorie, string> = {
  ul: 'Ule',
  ochrana: 'Odzież ochronna',
  naradi: 'Narzędzia',
  zpracovani: 'Przetwarzanie miodu',
  krmeni: 'Karmienie i zazimowanie',
};
export function vybaveniKategorieLabel(k: VybaveniKategorie, locale: Locale = 'cs'): string {
  if (locale === 'sk') return VYBAVENI_KATEGORIE_LABELS_SK[k];
  if (locale === 'pl') return VYBAVENI_KATEGORIE_LABELS_PL[k];
  return VYBAVENI_KATEGORIE_LABELS[k];
}

export const MED_TYP_LABELS: Record<MedTyp, string> = {
  kvetovy: 'Květový',
  medovicovy: 'Medovicový',
  smiseny: 'Smíšený',
};
const MED_TYP_LABELS_SK: Record<MedTyp, string> = {
  kvetovy: 'Kvetový',
  medovicovy: 'Medovicový',
  smiseny: 'Zmiešaný',
};
const MED_TYP_LABELS_PL: Record<MedTyp, string> = {
  kvetovy: 'Nektarowy',
  medovicovy: 'Spadziowy',
  smiseny: 'Mieszany',
};
export function medTypLabel(typ: MedTyp, locale: Locale = 'cs'): string {
  if (locale === 'sk') return MED_TYP_LABELS_SK[typ];
  if (locale === 'pl') return MED_TYP_LABELS_PL[typ];
  return MED_TYP_LABELS[typ];
}

// Enum hodnoty zobrazované „naživo" (temperament/výnos/rojivost/krystalizace) jsou
// v datech kanonicky česky (klíč pro CSS třídy + JSON-LD). cs label = identita
// (byte-identita), sk overlay překládá jen zobrazovaný text.
const VCELA_TEMPERAMENT_SK: Record<string, string> = { 'mírná': 'mierna', 'střední': 'stredná', 'obranná': 'obranná' };
const VCELA_VYNOS_SK: Record<string, string> = { 'nízký': 'nízky', 'střední': 'stredný', 'vysoký': 'vysoký', 'velmi vysoký': 'veľmi vysoký' };
const VCELA_ROJIVOST_SK: Record<string, string> = { 'nízká': 'nízka', 'střední': 'stredná', 'vyšší': 'vyššia' };
const MED_KRYSTALIZACE_SK: Record<string, string> = { 'velmi pomalá': 'veľmi pomalá', 'pomalá': 'pomalá', 'střední': 'stredná', 'rychlá': 'rýchla' };
// PL: „Temperament" je mužský rod, „Wydajność miodowa" / „Rojliwość" / „Krystalizacja" ženský.
const VCELA_TEMPERAMENT_PL: Record<string, string> = { 'mírná': 'łagodny', 'střední': 'średni', 'obranná': 'obronny' };
const VCELA_VYNOS_PL: Record<string, string> = { 'nízký': 'niska', 'střední': 'średnia', 'vysoký': 'wysoka', 'velmi vysoký': 'bardzo wysoka' };
const VCELA_ROJIVOST_PL: Record<string, string> = { 'nízká': 'niska', 'střední': 'średnia', 'vyšší': 'wyższa' };
const MED_KRYSTALIZACE_PL: Record<string, string> = { 'velmi pomalá': 'bardzo powolna', 'pomalá': 'powolna', 'střední': 'średnia', 'rychlá': 'szybka' };

export function vcelaTemperamentLabel(v: string, locale: Locale = 'cs'): string {
  if (locale === 'sk') return VCELA_TEMPERAMENT_SK[v] ?? v;
  if (locale === 'pl') return VCELA_TEMPERAMENT_PL[v] ?? v;
  return v;
}
export function vcelaVynosLabel(v: string, locale: Locale = 'cs'): string {
  if (locale === 'sk') return VCELA_VYNOS_SK[v] ?? v;
  if (locale === 'pl') return VCELA_VYNOS_PL[v] ?? v;
  return v;
}
export function vcelaRojivostLabel(v: string, locale: Locale = 'cs'): string {
  if (locale === 'sk') return VCELA_ROJIVOST_SK[v] ?? v;
  if (locale === 'pl') return VCELA_ROJIVOST_PL[v] ?? v;
  return v;
}
export function medKrystalizaceLabel(v: string, locale: Locale = 'cs'): string {
  if (locale === 'sk') return MED_KRYSTALIZACE_SK[v] ?? v;
  if (locale === 'pl') return MED_KRYSTALIZACE_PL[v] ?? v;
  return v;
}
