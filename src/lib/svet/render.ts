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
  nemecko: 'Německu', francie: 'Francii', 'velka-britanie': 'Velké Británii', usa: 'USA',
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
