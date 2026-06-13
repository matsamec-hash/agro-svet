// Cross-brand model comparator. Generates canonical pair slugs and pulls
// matching models for /srovnani/[combo]/.
//
// Pair slug format: `{a.slug}-vs-{b.slug}` where a.slug < b.slug alphabetically.
// Canonical ordering means /a-vs-b and /b-vs-a both resolve to the same page —
// the route uses a 301 from non-canonical permutations.

import { getAllModels, type StrojFlatModel, type StrojKategorie } from './stroje';
import { findCompetitors, findImplementCompetitors } from './competitor-finder';

const PAIR_DELIMITER = '-vs-';

export interface ComparisonPair {
  a: StrojFlatModel;
  b: StrojFlatModel;
  /** Canonical combo slug `{a.slug}-vs-{b.slug}` with a.slug < b.slug. */
  combo: string;
}

function canonicalOrder(a: StrojFlatModel, b: StrojFlatModel): [StrojFlatModel, StrojFlatModel] {
  return a.slug < b.slug ? [a, b] : [b, a];
}

export function pairCombo(a: StrojFlatModel, b: StrojFlatModel): string;
export function pairCombo(aSlug: string, bSlug: string): string;
export function pairCombo(a: StrojFlatModel | string, b: StrojFlatModel | string): string {
  const aSlug = typeof a === 'string' ? a : a.slug;
  const bSlug = typeof b === 'string' ? b : b.slug;
  const [first, second] = aSlug < bSlug ? [aSlug, bSlug] : [bSlug, aSlug];
  return `${first}${PAIR_DELIMITER}${second}`;
}

export function parsePairCombo(combo: string): [string, string] | null {
  const idx = combo.indexOf(PAIR_DELIMITER);
  if (idx === -1) return null;
  const a = combo.slice(0, idx);
  const b = combo.slice(idx + PAIR_DELIMITER.length);
  if (!a || !b || a === b) return null;
  return [a, b];
}

/** Look up a flat model by its full slug (e.g. `john-deere-8r-410`). */
export function findModelBySlug(slug: string): StrojFlatModel | null {
  return getAllModels().find((m) => m.slug === slug) ?? null;
}

/**
 * Build top N comparison pairs prerendered at build time.
 *
 * Strategy: iterate every currently-produced model (year_to=null), pull its top
 * cross-brand competitors via findCompetitors(), then dedupe pairs by canonical
 * combo and sort by combined popularity score (currently sum of power_hp as
 * proxy for "buyer interest").
 *
 * Returns ~150–250 deterministic pairs covering high-power tractors and
 * combines from every brand we hold data for.
 */
export function topComparisonPairs(limit = 200, opts?: { tolerancePct?: number; perSourceLimit?: number }): ComparisonPair[] {
  const all = getAllModels();
  const activeModels = all.filter(
    (m) => m.year_to === null && m.power_hp !== null && (m.category === 'traktory' || m.category === 'kombajny'),
  );

  const tolerancePct = opts?.tolerancePct ?? 18;
  const perSourceLimit = opts?.perSourceLimit ?? 4;

  const seen = new Map<string, ComparisonPair>();
  for (const source of activeModels) {
    const competitors = findCompetitors(
      {
        slug: source.slug,
        brand_slug: source.brand_slug,
        category: source.category,
        power_hp: source.power_hp,
        year_to: source.year_to,
      },
      { tolerancePct, limit: perSourceLimit },
    );
    for (const competitor of competitors) {
      const combo = pairCombo(source, competitor);
      if (seen.has(combo)) continue;
      const [a, b] = canonicalOrder(source, competitor);
      seen.set(combo, { a, b, combo });
    }
  }

  const pairs = [...seen.values()];
  pairs.sort((x, y) => {
    const scoreX = (x.a.power_hp ?? 0) + (x.b.power_hp ?? 0);
    const scoreY = (y.a.power_hp ?? 0) + (y.b.power_hp ?? 0);
    if (scoreX !== scoreY) return scoreY - scoreX;
    return x.combo.localeCompare(y.combo);
  });
  return pairs.slice(0, limit);
}

/**
 * Expanded pairs generator — wider tolerance + more competitors per source.
 * Used by /srovnani/[combo]/ getStaticPaths() to maximize prerendered SEO surface.
 * Aim 1000+ unique pairs. Caller still gets best-power-sorted output.
 */
export function expandedComparisonPairs(limit = 1500): ComparisonPair[] {
  return topComparisonPairs(limit, { tolerancePct: 30, perSourceLimit: 10 });
}

/** Práh: kolik modelů se záběrem musí kategorie mít, aby se generovaly nářaďové páry. */
export const MIN_MODELS_WITH_ZABER = 8;

let _implementCats: StrojKategorie[] | null = null;
/**
 * Data-driven množina nářaďových kategorií vhodných pro srovnání — effective_category,
 * kde ≥ MIN_MODELS_WITH_ZABER modelů má pracovni_zaber_m. Memoizováno (data statická).
 */
export function implementCompareCategories(): StrojKategorie[] {
  if (_implementCats) return _implementCats;
  const counts = new Map<StrojKategorie, number>();
  for (const m of getAllModels()) {
    if (m.pracovni_zaber_m != null) {
      counts.set(m.effective_category, (counts.get(m.effective_category) ?? 0) + 1);
    }
  }
  _implementCats = [...counts.entries()]
    .filter(([, n]) => n >= MIN_MODELS_WITH_ZABER)
    .map(([c]) => c)
    .sort();
  return _implementCats;
}

/**
 * Páry nářadí párované dle pracovního záběru. Anchor = current-production modely
 * v kvalifikovaných kategoriích; konkurenti přes findImplementCompetitors (může vrátit
 * i historické). Kanonické pořadí, dedup dle combo, řazeno dle součtu záběru desc.
 * Disjunktní vůči topComparisonPairs (ty jsou jen traktory/kombajny).
 */
export function implementComparisonPairs(limit = 4000): ComparisonPair[] {
  const cats = new Set(implementCompareCategories());
  const sources = getAllModels().filter(
    (m) => cats.has(m.effective_category) && m.pracovni_zaber_m != null && m.year_to === null,
  );

  const seen = new Map<string, ComparisonPair>();
  for (const source of sources) {
    const competitors = findImplementCompetitors(
      {
        slug: source.slug,
        brand_slug: source.brand_slug,
        effective_category: source.effective_category,
        pracovni_zaber_m: source.pracovni_zaber_m,
        year_to: source.year_to,
      },
      { tolerancePct: 30, limit: 8 },
    );
    for (const competitor of competitors) {
      const combo = pairCombo(source, competitor);
      if (seen.has(combo)) continue;
      const [a, b] = canonicalOrder(source, competitor);
      seen.set(combo, { a, b, combo });
    }
  }

  const pairs = [...seen.values()];
  pairs.sort((x, y) => {
    const scoreX = (x.a.pracovni_zaber_m ?? 0) + (x.b.pracovni_zaber_m ?? 0);
    const scoreY = (y.a.pracovni_zaber_m ?? 0) + (y.b.pracovni_zaber_m ?? 0);
    if (scoreX !== scoreY) return scoreY - scoreX;
    return x.combo.localeCompare(y.combo);
  });
  return pairs.slice(0, limit);
}

/** Find competitor pairs that include the given model — used for "Related comparisons" cross-link. */
export function relatedComparisonsFor(model: StrojFlatModel, limit = 6): ComparisonPair[] {
  const pairs = topComparisonPairs(500);
  return pairs.filter((p) => p.a.slug === model.slug || p.b.slug === model.slug).slice(0, limit);
}

/** Pretty display name for a model in pair UI ("John Deere 8R 410"). */
export function modelDisplayName(m: StrojFlatModel): string {
  if (m.name.toLowerCase().startsWith(m.brand_slug)) return m.name;
  return `${m.brand_name} ${m.name}`;
}

export interface ComparisonRow {
  label: string;
  /** Higher value wins (or 'lower' for fields like weight where less = better). */
  better?: 'higher' | 'lower' | 'none';
  unit?: string;
  format?: (v: number | string | null | undefined) => string;
  get: (m: StrojFlatModel) => number | string | null | undefined;
}

export function buildComparisonRows(category: StrojKategorie): ComparisonRow[] {
  // Nářaďová větev: záběrové kategorie nemají power_hp/motor/převodovku → vlastní sada
  // relevantních řádků (záběr, příkon traktoru, typ závěsu) + univerzální roky/hmotnost.
  if (category !== 'traktory' && category !== 'kombajny') {
    const zavesLabel = (v: string | null | undefined): string | null => {
      switch (v) {
        case 'neseny': return 'nesený';
        case 'tazeny': return 'tažený';
        case 'poloneseny': return 'polonesený';
        case 'samojizdny': return 'samojízdný';
        case 'navesny': return 'návěsný';
        default: return null;
      }
    };
    return [
      {
        label: 'Pracovní záběr',
        better: 'higher',
        unit: 'm',
        get: (m) => m.pracovni_zaber_m ?? null,
      },
      {
        label: 'Potřebný příkon traktoru',
        better: 'none',
        get: (m) => {
          const lo = m.prikon_traktor_hp_min ?? null;
          const hi = m.prikon_traktor_hp_max ?? null;
          if (lo === null && hi === null) return null;
          if (lo !== null && hi !== null) return lo === hi ? `${lo} k` : `${lo}–${hi} k`;
          return `${lo ?? hi} k`;
        },
      },
      {
        label: 'Typ závěsu',
        better: 'none',
        get: (m) => zavesLabel(m.typ_zavesu),
      },
      {
        label: 'Roky výroby',
        better: 'none',
        get: (m) => {
          if (m.year_from === null) return null;
          return m.year_to === null ? `${m.year_from}–dosud` : `${m.year_from}–${m.year_to}`;
        },
      },
      {
        label: 'V prodeji',
        better: 'none',
        get: (m) => (m.year_to === null ? 'Ano' : 'Ne'),
      },
      {
        label: 'Hmotnost',
        better: 'lower',
        unit: 'kg',
        get: (m) => m.weight_kg ?? null,
      },
    ];
  }

  const rows: ComparisonRow[] = [
    {
      label: 'Výkon',
      better: 'higher',
      unit: 'k',
      get: (m) => m.power_hp,
    },
    {
      label: 'Výkon (kW)',
      better: 'higher',
      unit: 'kW',
      get: (m) => m.power_kw ?? (m.power_hp ? Math.round(m.power_hp * 0.7457) : null),
    },
    {
      label: 'Roky výroby',
      better: 'none',
      get: (m) => {
        if (m.year_from === null) return null;
        return m.year_to === null ? `${m.year_from}–dosud` : `${m.year_from}–${m.year_to}`;
      },
    },
    {
      label: 'V prodeji',
      better: 'none',
      get: (m) => (m.year_to === null ? 'Ano' : 'Ne'),
    },
    {
      label: 'Motor',
      better: 'none',
      get: (m) => m.engine ?? null,
    },
    {
      label: 'Převodovka',
      better: 'none',
      get: (m) => m.transmission ?? null,
    },
    {
      label: 'Hmotnost',
      better: 'lower',
      unit: 'kg',
      get: (m) => m.weight_kg ?? null,
    },
  ];

  if (category === 'kombajny') {
    rows.push({
      label: 'Záběr žacího stolu',
      better: 'higher',
      unit: 'm',
      get: (m) => m.cutting_width_m ?? null,
    });
    rows.push({
      label: 'Zásobník zrna',
      better: 'higher',
      unit: 'l',
      get: (m) => m.grain_tank_l ?? null,
    });
  }

  return rows;
}
