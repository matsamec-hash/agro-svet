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
  {
    slug: 'kombajny-do-300-koni',
    title: 'Nejlepší kombajny do 300 koní',
    description: 'Sklízecí mlátičky pro menší a střední farmy 50–500 ha. Třídy III–VI s výkonem do 300 koní — nižší pořizovací cena, dostatečná kapacita pro standardní žně.',
    methodology: 'Modely seřazené podle výkonu motoru sestupně. Hlavně Claas Avero / Tucano / Trion, JD T-Series 500/600, Case Axial-Flow 4000/5000, NH TC/CX.',
    callToAction: 'Pro velkofarmy nad 500 ha viz žebříček nejvýkonnějších kombajnů.',
    category: 'kombajny',
    filter: (m) => typeof m.power_hp === 'number' && m.power_hp > 0 && m.power_hp <= 300,
    score: (m) => m.power_hp ?? 0,
    limit: 12,
  },
  {
    slug: 'kombajny-nad-500-koni',
    title: 'Flagship kombajny nad 500 koní',
    description: 'Špička trhu — kombajny s výkonem nad 500 koní pro velkofarmy a sklizňové podnikatele. Třída X+ s největšími žacími stoly (až 18 m) a zásobníky (14+ tisíc litrů).',
    methodology: 'Sklízecí mlátičky seřazené podle výkonu motoru sestupně. Flagshipy Claas Lexion 8000/8900, JD X9, Case Axial-Flow 9250, NH CR10.90, Fendt IDEAL 9/10T.',
    callToAction: 'Pro typickou českou farmu jsou tyto stroje předimenzované — viz nižší žebříčky.',
    category: 'kombajny',
    filter: (m) => typeof m.power_hp === 'number' && m.power_hp > 500,
    score: (m) => m.power_hp ?? 0,
    limit: 10,
  },

  // ── SPECIÁLNÍ ───────────────────────────────────────────────────────
  {
    slug: 'traktory-klasiky-pre-2000',
    title: 'Klasické traktory před rokem 2000',
    description: 'Žebříček historických traktorů uvedených před rokem 2000 — sběratelské a stále provozované klasiky. Často s mechanickými převodovkami a robustní konstrukcí, která vydrží.',
    methodology: 'Modely s rokem uvedení do roku 1999, seřazené podle výkonu sestupně. De-dup per série pro přehled napříč značkami.',
    callToAction: 'Hledáte aktuálně vyráběný stroj? Viz žebříčky podle výkonu.',
    category: 'traktory',
    filter: (m) => typeof m.year_from === 'number' && m.year_from < 2000 && typeof m.power_hp === 'number',
    score: (m) => (m.power_hp ?? 0) + ((m.year_to ?? 1990) - 1970), // bonus za delší výrobu = popularita
    limit: 15,
  },
  {
    slug: 'traktory-male-kompaktni',
    title: 'Nejlepší malé / kompaktní traktory (do 60 koní)',
    description: 'Kompaktní traktory pro sady, vinohrady, komunální použití a hobby farmy. Výkon do 60 koní, kratší vůle, lepší manévrovatelnost.',
    methodology: 'Modely s výkonem do 60 koní seřazené sestupně. Hlavně Kubota L-Series, JD 3R, Massey Ferguson 1700E, Iseki, Zetor Major.',
    callToAction: 'Pro středně velké farmy viz žebříček traktorů do 100 koní.',
    category: 'traktory',
    filter: (m) => typeof m.power_hp === 'number' && m.power_hp > 0 && m.power_hp <= 60,
    score: (m) => m.power_hp ?? 0,
    limit: 12,
  },

  // ── NÁŘADÍ (záběr / výkon) ──────────────────────────────────────────
  {
    slug: 'nejsirsi-diskove-podmitace',
    title: 'Nejširší diskové podmítače',
    description: 'Žebříček diskových podmítačů podle pracovního záběru. Širší záběr = vyšší plošný výkon, ale vyšší nárok na výkon traktoru. Vhodné pro mělké zpracování strniště.',
    methodology: 'Modely seřazené podle pracovního záběru sestupně. Z každé série jen nejširší varianta. Napříč značkami Amazone, Bednar, Horsch, Väderstad, Pöttinger.',
    callToAction: 'Hledáte hlubší zpracování? Viz žebříček radličkových podmítačů a kypřičů.',
    category: 'podmitace-diskove',
    filter: (m) => typeof m.pracovni_zaber_m === 'number' && m.pracovni_zaber_m > 0,
    score: (m) => m.pracovni_zaber_m ?? 0,
    limit: 12,
  },
  {
    slug: 'nejsirsi-radlickove-podmitace',
    title: 'Nejširší radličkové podmítače',
    description: 'Žebříček radličkových (dlátových) podmítačů podle pracovního záběru. Radličky pracují hlouběji než disky — vhodné pro prokypření a narušení utužených vrstev.',
    methodology: 'Modely seřazené podle pracovního záběru sestupně, de-dup per série. Napříč značkami Amazone, Bednar, Horsch, Väderstad, Pöttinger.',
    callToAction: 'Pro mělké zpracování strniště viz žebříček diskových podmítačů.',
    category: 'podmitace-radlickove',
    filter: (m) => typeof m.pracovni_zaber_m === 'number' && m.pracovni_zaber_m > 0,
    score: (m) => m.pracovni_zaber_m ?? 0,
    limit: 12,
  },
  {
    slug: 'nejlepsi-seci-kombinace',
    title: 'Nejširší secí kombinace',
    description: 'Žebříček secích kombinací (příprava půdy + setí v jednom přejezdu) podle pracovního záběru. Úspora přejezdů a času při zakládání porostů.',
    methodology: 'Modely seřazené podle pracovního záběru sestupně, de-dup per série. Napříč značkami Amazone, Horsch, Väderstad, Pöttinger, Bednar.',
    callToAction: 'Pro samostatné secí stroje viz žebříček pneumatických a přesných secích strojů.',
    category: 'seci-kombinace',
    filter: (m) => typeof m.pracovni_zaber_m === 'number' && m.pracovni_zaber_m > 0,
    score: (m) => m.pracovni_zaber_m ?? 0,
    limit: 12,
  },
  {
    slug: 'nejsirsi-pneumaticke-seci-stroje',
    title: 'Nejširší pneumatické secí stroje',
    description: 'Žebříček pneumatických (výsevních) secích strojů podle pracovního záběru. Pneumatická distribuce osiva umožňuje větší záběr a přesnější dávkování.',
    methodology: 'Modely seřazené podle pracovního záběru sestupně, de-dup per série. Napříč pěti hlavními značkami na českém trhu.',
    callToAction: 'Pro přesný výsev (kukuřice, řepa, slunečnice) viz žebříček přesných secích strojů.',
    category: 'seci-stroje-pneumaticke',
    filter: (m) => typeof m.pracovni_zaber_m === 'number' && m.pracovni_zaber_m > 0,
    score: (m) => m.pracovni_zaber_m ?? 0,
    limit: 12,
  },
  {
    slug: 'nejlepsi-presne-seci-stroje',
    title: 'Nejširší přesné secí stroje',
    description: 'Žebříček přesných (jednozrnných) secích strojů podle pracovního záběru. Pro kukuřici, řepu a slunečnici — přesné rozmístění jednotlivých zrn.',
    methodology: 'Modely seřazené podle pracovního záběru sestupně, de-dup per série. Záběr u přesných secích strojů obvykle odpovídá počtu řádků × meziřádková vzdálenost.',
    callToAction: 'Pro hustě seté plodiny (obilniny) viz žebříček pneumatických secích strojů.',
    category: 'seci-stroje-presne',
    filter: (m) => typeof m.pracovni_zaber_m === 'number' && m.pracovni_zaber_m > 0,
    score: (m) => m.pracovni_zaber_m ?? 0,
    limit: 12,
  },
  {
    slug: 'nejlepsi-kyprice',
    title: 'Nejširší kypřiče',
    description: 'Žebříček kypřičů podle pracovního záběru. Kypřiče zpracovávají půdu do střední a větší hloubky bez obracení — základ minimalizačních technologií.',
    methodology: 'Modely seřazené podle pracovního záběru sestupně, de-dup per série. Napříč značkami Amazone, Bednar, Horsch, Väderstad, Pöttinger.',
    callToAction: 'Pro mělké strniště viz diskové podmítače, pro setí viz secí kombinace.',
    category: 'kyprice',
    filter: (m) => typeof m.pracovni_zaber_m === 'number' && m.pracovni_zaber_m > 0,
    score: (m) => m.pracovni_zaber_m ?? 0,
    limit: 12,
  },
  {
    slug: 'nejsirsi-zaci-stroje',
    title: 'Nejširší žací stroje',
    description: 'Žebříček žacích strojů (na pícniny) podle pracovního záběru. Větší záběr zkracuje dobu seče a využívá počasí — klíčové při sklizni objemných krmiv.',
    methodology: 'Modely seřazené podle pracovního záběru sestupně, de-dup per série. Hlavně žací kombinace Krone a Pöttinger.',
    callToAction: 'Pro shrnování a obracení píce viz příslušné kategorie strojů na sklizeň pícnin.',
    category: 'zaci-stroje',
    filter: (m) => typeof m.pracovni_zaber_m === 'number' && m.pracovni_zaber_m > 0,
    score: (m) => m.pracovni_zaber_m ?? 0,
    limit: 12,
  },
  {
    slug: 'nejvykonnejsi-samojizdne-rezacky',
    title: 'Nejvýkonnější samojízdné řezačky',
    description: 'Žebříček samojízdných sklízecích řezaček podle výkonu motoru. Pro sklizeň kukuřice na siláž a travních porostů — nejvýkonnější stroje na poli.',
    methodology: 'Modely seřazené podle výkonu motoru sestupně, de-dup per série. Flagshipy Claas Jaguar a Krone BiG X.',
    callToAction: 'Pro lisování a sběr píce viz ostatní stroje na sklizeň pícnin.',
    category: 'rezacky-samojizdne',
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
  const filtered = all.filter((m) => m.effective_category === def.category && def.filter(m));
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
