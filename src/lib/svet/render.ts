import type { CountryProfile, Indicator, PackageKey, SeriesPoint } from './types';

export const PACKAGE_ORDER: PackageKey[] = ['produkce', 'puda', 'ekonomika', 'obchod'];
export const PACKAGE_LABELS: Record<PackageKey, string> = {
  produkce: 'Produkce', puda: 'Půda a struktura farem', ekonomika: 'Ekonomika a příjmy', obchod: 'Obchod a vstupy',
};
const INDICATOR_ORDER: string[] = [
  'wheat_yield', 'maize_yield', 'barley_yield', 'rapeseed_yield', 'cereal_yield', 'cattle_count', 'pigs_count',
  'ag_land', 'arable_land', 'farm_count', 'organic_share',
  'ag_output_value', 'ag_value_added_gdp', 'ag_employment', 'fert_use',
];
export const COUNTRY_LOCATIVE: Record<string, string> = {
  nemecko: 'Německu', francie: 'Francii', 'velka-britanie': 'Velké Británii', usa: 'USA', polsko: 'Polsku',
};

export interface PackageGroup { pkg: PackageKey; label: string; indicators: Indicator[]; }

export function groupByPackage(profile: CountryProfile): PackageGroup[] {
  const inds = Object.values(profile.indicators);
  const ord = (k: string) => { const i = INDICATOR_ORDER.indexOf(k); return i === -1 ? 999 : i; };
  return PACKAGE_ORDER
    .map((pkg) => ({
      pkg, label: PACKAGE_LABELS[pkg],
      indicators: inds.filter((i) => i.pkg === pkg).sort((a, b) => ord(a.key) - ord(b.key) || a.key.localeCompare(b.key)),
    }))
    .filter((g) => g.indicators.length > 0);
}

export function vsReference(value: number, refValue: number): { pct: number; dir: 'up' | 'down' | 'same' } | null {
  if (!refValue || !Number.isFinite(refValue)) return null;
  const pct = Math.round((value / refValue - 1) * 100);
  return { pct, dir: pct > 0 ? 'up' : pct < 0 ? 'down' : 'same' };
}

const NF = new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 2 });
export function fmtNum(value: number): string {
  // Intl používá úzkou/pevnou mezeru (U+202F / U+00A0) jako oddělovač tisíců → normalizuj na běžnou mezeru.
  return NF.format(value).replace(/[  \s]/g, ' ');
}

export function sparklinePath(series: SeriesPoint[], w: number, h: number, pad = 2): string {
  if (!series.length) return '';
  if (series.length === 1) return `M0 ${h / 2}`;
  const vals = series.map((p) => p.value);
  const min = Math.min(...vals), max = Math.max(...vals);
  const span = max - min || 1;
  const stepX = (w - pad * 2) / (series.length - 1);
  const pts = series.map((p, i) => {
    const x = pad + i * stepX;
    const y = pad + (h - pad * 2) * (1 - (p.value - min) / span);
    return `${Math.round(x * 100) / 100} ${Math.round(y * 100) / 100}`;
  });
  return `M${pts[0]}` + pts.slice(1).map((p) => `L${p}`).join('');
}

export interface CompareCell { slug: string; nameCs: string; flag: string; value: number | null; period: string | null; }
export function compareMatrix(profiles: CountryProfile[], indicatorKey: string): CompareCell[] {
  return profiles.map((p) => {
    const ind = p.indicators[indicatorKey];
    return { slug: p.slug, nameCs: p.nameCs, flag: p.flag, value: ind?.latest.value ?? null, period: ind?.latest.referencePeriod ?? null };
  });
}

/* ---------- Normalizace srovnání (absolutní / na 1000 obyv. / na ha ZP) ----------
   Přepočet dává smysl jen u absolutních ukazatelů (počty, plochy, hodnota produkce).
   Poměrové ukazatele (výnosy t/ha, podíly %, kg/ha) přepočet nemají — chybí ve specu.
   baseScale = kolikrát vynásobit surovou hodnotu, aby vznikla základní jednotka
   (ks, ha, €, farem). perCapita používá populaci, perHa dělí zemědělskou plochou. */
export type NormMode = 'absolute' | 'perCapita' | 'perHa';

export interface NormSpec { baseScale: number; baseUnit: string; perCapita: boolean; perHa: boolean; }

export const NORM_SPECS: Record<string, NormSpec> = {
  cattle_count:    { baseScale: 1e3, baseUnit: 'ks',    perCapita: true, perHa: true },
  pigs_count:      { baseScale: 1e3, baseUnit: 'ks',    perCapita: true, perHa: true },
  ag_output_value: { baseScale: 1e9, baseUnit: '€',     perCapita: true, perHa: true },
  farm_count:      { baseScale: 1e3, baseUnit: 'farem', perCapita: true, perHa: false },
  ag_land:         { baseScale: 1e6, baseUnit: 'ha',    perCapita: true, perHa: false },
  arable_land:     { baseScale: 1e6, baseUnit: 'ha',    perCapita: true, perHa: false },
};

/** Je daný režim pro daný ukazatel použitelný? (absolute vždy; ostatní dle specu) */
export function normApplies(indicatorKey: string, mode: NormMode): boolean {
  if (mode === 'absolute') return true;
  const s = NORM_SPECS[indicatorKey];
  if (!s) return false;
  return mode === 'perCapita' ? s.perCapita : s.perHa;
}

export interface NormResult { value: number; unit: string; }

/**
 * Přepočte surovou hodnotu ukazatele dle režimu.
 * @param rawValue surová hodnota z profilu (v jednotce ukazatele)
 * @param population počet obyvatel země (pro perCapita)
 * @param agLandRaw hodnota ag_land země v mil. ha (pro perHa)
 * @returns {value, unit} nebo null, když režim = absolute / nelze přepočíst / chybí vstup
 */
export function normalizeValue(
  indicatorKey: string,
  rawValue: number | null | undefined,
  mode: NormMode,
  population?: number | null,
  agLandRaw?: number | null,
): NormResult | null {
  if (rawValue == null || mode === 'absolute') return null;
  const s = NORM_SPECS[indicatorKey];
  if (!s) return null;
  const base = rawValue * s.baseScale;
  if (mode === 'perCapita') {
    if (!s.perCapita || !population) return null;
    return { value: (base / population) * 1000, unit: `${s.baseUnit} / 1000 obyv.` };
  }
  if (mode === 'perHa') {
    if (!s.perHa || !agLandRaw) return null;
    return { value: base / (agLandRaw * 1e6), unit: `${s.baseUnit} / ha` };
  }
  return null;
}
