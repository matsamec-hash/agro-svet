// Značka-vs-značka srovnání. Čistá vrstva nad statickými daty ze `stroje.ts`
// (žádná DB) — generuje páry značek, agregované staty a per-pár verdikt/FAQ
// deterministicky z dat. Model-souboje reuse-ují model-comparator (`comparator.ts`).

import { getAllBrands, getAllModels, type StrojBrand, type StrojKategorie } from './stroje';
import { pairCombo, type ComparisonPair } from './comparator';

const DELIM = '-vs-';

export function brandCombo(a: string, b: string): string {
  const [x, y] = a < b ? [a, b] : [b, a];
  return `${x}${DELIM}${y}`;
}

export function parseBrandCombo(combo: string): [string, string] | null {
  const idx = combo.indexOf(DELIM);
  if (idx === -1) return null;
  const a = combo.slice(0, idx);
  const b = combo.slice(idx + DELIM.length);
  if (!a || !b || a === b) return null;
  return [a, b];
}

export interface BrandStats {
  brand: StrojBrand;
  modelCount: number;
  powerMin: number | null;
  powerMax: number | null;
  powerAvg: number | null;
  categories: StrojKategorie[];
  yearFrom: number | null;
  yearTo: number | null;
}

export function brandStats(brand: StrojBrand): BrandStats {
  const models = getAllModels().filter((m) => m.brand_slug === brand.slug);
  const powers = models.map((m) => m.power_hp).filter((x): x is number => typeof x === 'number');
  const years = models.map((m) => m.year_from).filter((x): x is number => typeof x === 'number');
  const yearTos = models.map((m) => m.year_to).filter((x): x is number => typeof x === 'number');
  const categories = [...new Set(models.map((m) => m.effective_category))];
  return {
    brand,
    modelCount: models.length,
    powerMin: powers.length ? Math.min(...powers) : null,
    powerMax: powers.length ? Math.max(...powers) : null,
    powerAvg: powers.length ? Math.round(powers.reduce((a, b) => a + b, 0) / powers.length) : null,
    categories,
    yearFrom: years.length ? Math.min(...years) : null,
    yearTo: yearTos.length ? Math.max(...yearTos) : null,
  };
}

export interface BrandPair {
  a: StrojBrand;
  b: StrojBrand;
  combo: string;
  sharedCategories: StrojKategorie[];
}

export const MIN_BRAND_MODELS = 4;

export function brandPairs(limit = 300): BrandPair[] {
  const brands = getAllBrands();
  const statsBySlug = new Map(brands.map((br) => [br.slug, brandStats(br)]));
  const eligible = brands.filter((br) => statsBySlug.get(br.slug)!.modelCount >= MIN_BRAND_MODELS);
  const sorted = [...eligible].sort((x, y) => x.slug.localeCompare(y.slug));

  const out: BrandPair[] = [];
  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      const a = sorted[i];
      const b = sorted[j];
      const sa = statsBySlug.get(a.slug)!;
      const sb = statsBySlug.get(b.slug)!;
      const shared = sa.categories.filter((c) => sb.categories.includes(c));
      if (shared.length === 0) continue;
      out.push({ a, b, combo: `${a.slug}-vs-${b.slug}`, sharedCategories: shared });
    }
  }
  // Priorita: víc společných modelů = zajímavější srovnání.
  out.sort((p, q) => {
    const score = (pp: BrandPair) => statsBySlug.get(pp.a.slug)!.modelCount + statsBySlug.get(pp.b.slug)!.modelCount;
    return score(q) - score(p);
  });
  return out.slice(0, limit);
}

export function findBrandModelPairs(a: StrojBrand, b: StrojBrand, limit = 6): ComparisonPair[] {
  const models = getAllModels();
  const aModels = models.filter((m) => m.brand_slug === a.slug);
  const bModels = models.filter((m) => m.brand_slug === b.slug);
  const seen = new Set<string>();
  const out: ComparisonPair[] = [];
  for (const am of aModels) {
    for (const bm of bModels) {
      if (am.effective_category !== bm.effective_category) continue;
      if (am.power_hp === null || bm.power_hp === null) continue;
      // jen podobný výkon (±25 %) — smysluplný souboj
      const ratio = am.power_hp / bm.power_hp;
      if (ratio < 0.75 || ratio > 1.333) continue;
      const [x, y] = am.slug < bm.slug ? [am, bm] : [bm, am];
      const combo = pairCombo(x, y);
      if (seen.has(combo)) continue;
      seen.add(combo);
      out.push({ a: x, b: y, combo });
    }
  }
  // Nejbližší výkonem první.
  out.sort((p, q) => Math.abs(p.a.power_hp! - p.b.power_hp!) - Math.abs(q.a.power_hp! - q.b.power_hp!));
  return out.slice(0, limit);
}

export interface BrandInsights {
  tldr: string;
  verdictA: string;
  verdictB: string;
  faqs: { q: string; a: string }[];
  shortDescription: string;
}

const CZ_COUNTRIES = new Set(['Česko', 'Česká republika', 'Czechia']);

function edges(brand: StrojBrand, s: BrandStats, other: BrandStats): string[] {
  const e: string[] = [];
  if (s.powerAvg !== null && other.powerAvg !== null && s.powerAvg > other.powerAvg)
    e.push('vyšší průměrný výkon — sedí na velké provozy a náročné nasazení');
  if (s.powerAvg !== null && other.powerAvg !== null && s.powerAvg < other.powerAvg)
    e.push('nižší výkonovou třídu a dostupnost pro malé a střední farmy');
  if (CZ_COUNTRIES.has(brand.country))
    e.push('český původ — snazší servis a dostupnost dílů v ČR');
  if (s.categories.length > other.categories.length)
    e.push('širší záběr kategorií strojů');
  if (brand.founded < other.brand.founded)
    e.push(`delší tradici (od roku ${brand.founded})`);
  if (e.length === 0) e.push(`${s.modelCount} modelů v naší databázi`);
  return e;
}

function powerRange(s: BrandStats): string {
  if (s.powerMin === null || s.powerMax === null) return 'neuvedeno';
  return s.powerMin === s.powerMax ? `${s.powerMin} k` : `${s.powerMin}–${s.powerMax} k`;
}

export function brandComparisonInsights(a: StrojBrand, sa: BrandStats, b: StrojBrand, sb: BrandStats): BrandInsights {
  const ea = edges(a, sa, sb);
  const eb = edges(b, sb, sa);
  const verdictA = `${a.name} zvolte, když chcete ${ea.slice(0, 2).join(' a ')}.`;
  const verdictB = `${b.name} zvolte, když chcete ${eb.slice(0, 2).join(' a ')}.`;
  const tldr = `${a.name} (${a.country}, ${sa.modelCount} modelů, ${powerRange(sa)}) vs ${b.name} (${b.country}, ${sb.modelCount} modelů, ${powerRange(sb)}). Přednost ${a.name}: ${ea[0]}; přednost ${b.name}: ${eb[0]}.`;
  const higherPower =
    sa.powerMax !== null && sb.powerMax !== null
      ? sa.powerMax > sb.powerMax
        ? a.name
        : sb.powerMax > sa.powerMax
          ? b.name
          : null
      : null;
  const faqs = [
    { q: `Je ${a.name}, nebo ${b.name} lepší?`, a: `Záleží na využití. ${verdictA} ${verdictB}` },
    {
      q: `Odkud pochází ${a.name} a ${b.name}?`,
      a: `${a.name} pochází z ${a.country} (značka od roku ${a.founded}), ${b.name} z ${b.country} (od roku ${b.founded}).`,
    },
    {
      q: `Kolik modelů ${a.name} a ${b.name} najdu na agro-svet.cz?`,
      a: `${a.name}: ${sa.modelCount} modelů (${powerRange(sa)}), ${b.name}: ${sb.modelCount} modelů (${powerRange(sb)}).`,
    },
    {
      q: `Která značka má vyšší výkon?`,
      a: higherPower ? `Nejvýkonnější model má ${higherPower}.` : `Obě značky nabízejí srovnatelný výkonový rozsah.`,
    },
  ];
  const shortDescription = `Srovnání značek ${a.name} a ${b.name}: výkon, počet modelů, pokryté kategorie a přímé souboje konkrétních modelů. Nezávislé porovnání na agro-svet.cz.`;
  return { tldr, verdictA, verdictB, faqs, shortDescription };
}
