// Žebříčky (tier-lists / top-N) — SEO content vygenerovaný z existujících
// stroje YAML dat. Žádné nové YAML, žádné AI texty — jen smart filtrování
// a řazení podle objektivních kritérií (výkon, kategorie).
//
// Každý tier-list je statická stránka prerendered v build-time pod
// /zebricky/<slug>/. Z každé série jen 1 model (nejvýkonnější varianta).

import { getAllModels, type StrojFlatModel, type StrojKategorie } from './stroje';

export interface TierListDef {
  slug: string;
  /** Page H1 + listing nadpis. */
  title: string;
  /** Krátká description pro <meta> + intro paragraph. */
  description: string;
  /** Pro intro odstavec — jak žebříček vznikl. */
  methodology: string;
  /** Pro intro — co když user chce víc. */
  callToAction: string;
  category: StrojKategorie;
  /** Filter predicate run after category match. */
  filter: (m: StrojFlatModel) => boolean;
  /** Higher = better. Returned model array is sorted descending by score. */
  score: (m: StrojFlatModel) => number;
  /** Cap on rendered items. Default 10. */
  limit?: number;
}

export const TIER_LISTS: TierListDef[] = [
  // ── TRAKTORY ─────────────────────────────────────────────────────────
  {
    slug: 'traktory-do-100-koni',
    title: 'Nejlepší traktory do 100 koní',
    description: 'Žebříček nejvýkonnějších traktorů s výkonem do 100 koní (74 kW). Vhodné pro menší hospodářství, sady a komunální použití.',
    methodology: 'Modely seřazené podle výkonu sestupně. Z každé série zařazena jen nejvýkonnější varianta, aby žebříček nezahltili sourozenci.',
    callToAction: 'Hledáte něco silnějšího? Viz žebříček 100–150 koní nebo 150–250 koní.',
    category: 'traktory',
    filter: (m) => typeof m.power_hp === 'number' && m.power_hp > 0 && m.power_hp <= 100,
    score: (m) => m.power_hp ?? 0,
    limit: 12,
  },
  {
    slug: 'traktory-100-150-koni',
    title: 'Nejlepší traktory 100–150 koní',
    description: 'Žebříček středně velkých traktorů 100–150 koní. Standard pro běžné polní práce v ČR — orba, secí kombinace, středně velké zemědělské stroje.',
    methodology: 'Modely seřazené podle výkonu sestupně. Cílíme na evropské hlavní řady (JD 6M/6R, Fendt 500, NH T6, Case Maxxum, Zetor Forterra, MF 5S/6S).',
    callToAction: 'Pro větší farmy se podívejte na žebříček 150–250 koní.',
    category: 'traktory',
    filter: (m) => typeof m.power_hp === 'number' && m.power_hp > 100 && m.power_hp <= 150,
    score: (m) => m.power_hp ?? 0,
    limit: 12,
  },
  {
    slug: 'traktory-150-250-koni',
    title: 'Nejlepší traktory 150–250 koní',
    description: 'Velké traktory pro střední a větší farmy v ČR. 150–250 koní pokrývá většinu polních prací včetně hluboké orby a sklízecích závěsných linek.',
    methodology: 'Modely seřazené podle výkonu sestupně. Hlavně Fendt 700, JD 6R/7R, NH T7, Case Puma/Magnum, MF 7S/8S, Deutz 7-Series.',
    callToAction: 'Pro největší farmy nebo speciální úlohy viz žebříček nad 250 koní.',
    category: 'traktory',
    filter: (m) => typeof m.power_hp === 'number' && m.power_hp > 150 && m.power_hp <= 250,
    score: (m) => m.power_hp ?? 0,
    limit: 12,
  },
  {
    slug: 'traktory-nad-250-koni',
    title: 'Nejvýkonnější traktory nad 250 koní',
    description: 'Špičky trhu — traktory s výkonem nad 250 koní pro velkofarmy, lesní práce a speciální nasazení. Většinou flagshipy značek.',
    methodology: 'Modely seřazené podle výkonu sestupně. Zahrnuje JD 8R/9R/9RX, Fendt 900/1000, NH T8/T9, Case Magnum/Steiger/Quadtrac, Claas Xerion.',
    callToAction: 'Hledáte něco menšího? Žebříček 150–250 koní nabízí praktičtější volby pro průměrnou českou farmu.',
    category: 'traktory',
    filter: (m) => typeof m.power_hp === 'number' && m.power_hp > 250,
    score: (m) => m.power_hp ?? 0,
    limit: 15,
  },
  // ── KOMBAJNY ─────────────────────────────────────────────────────────
  {
    slug: 'kombajny-nejvykonnejsi',
    title: 'Nejvýkonnější kombajny',
    description: 'Žebříček nejvýkonnějších sklízecích mlátiček. Hodnoceno podle výkonu motoru — záběr žacího stolu i kapacita zásobníku jsou v textu detailu.',
    methodology: 'Sklízecí mlátičky seřazené podle výkonu motoru sestupně. Třídy IX a X (300+ koní), top modely Claas Lexion, JD S/T, Case Axial-Flow, NH CR/CX.',
    callToAction: 'Pro menší farmy zvažte kombajny s nižším výkonem — pořizovací cena je výrazně nižší a kapacita většinou stačí.',
    category: 'kombajny',
    filter: (m) => typeof m.power_hp === 'number' && m.power_hp > 0,
    score: (m) => m.power_hp ?? 0,
    limit: 12,
  },
];

export function getTierList(slug: string): TierListDef | undefined {
  return TIER_LISTS.find((t) => t.slug === slug);
}

export interface RankedModel {
  rank: number;
  model: StrojFlatModel;
}

/** Apply the tier list to current models and return ranked entries. */
export function rankForTierList(def: TierListDef): RankedModel[] {
  const all = getAllModels();
  const filtered = all.filter((m) => m.category === def.category && def.filter(m));
  filtered.sort((a, b) => def.score(b) - def.score(a));
  // De-duplicate: only one model per series — top-N would otherwise be dominated
  // by adjacent variants of the same Fendt 1000 / JD 9R, which adds no info.
  const seenSeries = new Set<string>();
  const deduped: StrojFlatModel[] = [];
  for (const m of filtered) {
    const key = `${m.brand_slug}:${m.series_slug}`;
    if (seenSeries.has(key)) continue;
    seenSeries.add(key);
    deduped.push(m);
    if (deduped.length >= (def.limit ?? 10)) break;
  }
  return deduped.map((m, i) => ({ rank: i + 1, model: m }));
}
