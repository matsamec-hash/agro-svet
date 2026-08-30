// Značka-vs-značka srovnání. Čistá vrstva nad statickými daty ze `stroje.ts`
// (žádná DB) — generuje páry značek, agregované staty a per-pár verdikt/FAQ
// deterministicky z dat. Model-souboje reuse-ují model-comparator (`comparator.ts`).

import { getAllBrands, getAllModels, type StrojBrand, type StrojKategorie } from './stroje';
import type { Locale } from '../i18n/config';
import { srovnaniStrings, fill, type ZnackySrovnaniStrings } from '../i18n/znacky-srovnani';
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

export function findBrandModelPairs(a: StrojBrand, b: StrojBrand, limit = 6, locale: string = 'cs'): ComparisonPair[] {
  // ‼️ Dvojice se na stránce rendrují jménem modelu → musí být z lokalizovaného
  // katalogu. Bez locale svítilo na /de/znacky/srovnani/ „Dieselross G25 (dřevoplynový)".
  const models = getAllModels(locale);
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

// Pozor: `brand.country` je lokalizovaná (overlay per locale), takže sada musí
// obsahovat i sk/pl/uk varianty — jinak by výhoda „český původ" u non-cs zmizela.
const CZ_COUNTRIES = new Set([
  'Česko', 'Česká republika', 'Czechia',
  'Čechy', 'Česko a Slovensko',
  'Czechy',
  'Чехія',
]);

function edges(brand: StrojBrand, s: BrandStats, other: BrandStats, t: ZnackySrovnaniStrings): string[] {
  const e: string[] = [];
  if (s.powerAvg !== null && other.powerAvg !== null && s.powerAvg > other.powerAvg)
    e.push(t.edgeHigherPower);
  if (s.powerAvg !== null && other.powerAvg !== null && s.powerAvg < other.powerAvg)
    e.push(t.edgeLowerPower);
  if (CZ_COUNTRIES.has(brand.country))
    e.push(t.edgeCzechOrigin);
  if (s.categories.length > other.categories.length)
    e.push(t.edgeWiderRange);
  if (brand.founded < other.brand.founded)
    e.push(fill(t.edgeTradition, { year: brand.founded }));
  if (e.length === 0) e.push(fill(t.edgeFallback, { count: s.modelCount }));
  return e;
}

function powerRange(s: BrandStats, t: ZnackySrovnaniStrings): string {
  if (s.powerMin === null || s.powerMax === null) return t.powerUnknown;
  return s.powerMin === s.powerMax ? `${s.powerMin} k` : `${s.powerMin}–${s.powerMax} k`;
}

export function brandComparisonInsights(
  a: StrojBrand,
  sa: BrandStats,
  b: StrojBrand,
  sb: BrandStats,
  locale: Locale = 'cs',
): BrandInsights {
  const t = srovnaniStrings(locale);
  const ea = edges(a, sa, sb, t);
  const eb = edges(b, sb, sa, t);
  const pa = powerRange(sa, t);
  const pb = powerRange(sb, t);
  const verdictA = fill(t.verdict, { a: a.name, edges: ea.slice(0, 2).join(t.and) });
  const verdictB = fill(t.verdict, { a: b.name, edges: eb.slice(0, 2).join(t.and) });
  const tldr = fill(t.tldr, {
    a: a.name, ca: a.country, ma: sa.modelCount, pa,
    b: b.name, cb: b.country, mb: sb.modelCount, pb,
    ea: ea[0], eb: eb[0],
  });
  const higherPower =
    sa.powerMax !== null && sb.powerMax !== null
      ? sa.powerMax > sb.powerMax
        ? a.name
        : sb.powerMax > sa.powerMax
          ? b.name
          : null
      : null;
  const faqs = [
    { q: fill(t.faq1q, { a: a.name, b: b.name }), a: fill(t.faq1a, { va: verdictA, vb: verdictB }) },
    {
      q: fill(t.faq2q, { a: a.name, b: b.name }),
      a: fill(t.faq2a, { a: a.name, ca: a.country, fa: a.founded, b: b.name, cb: b.country, fb: b.founded }),
    },
    {
      q: fill(t.faq3q, { a: a.name, b: b.name }),
      a: fill(t.faq3a, { a: a.name, ma: sa.modelCount, pa, b: b.name, mb: sb.modelCount, pb }),
    },
    {
      q: t.faq4q,
      a: higherPower ? fill(t.faq4aWinner, { winner: higherPower }) : t.faq4aTie,
    },
  ];
  const shortDescription = fill(t.shortDescription, { a: a.name, b: b.name });
  return { tldr, verdictA, verdictB, faqs, shortDescription };
}
