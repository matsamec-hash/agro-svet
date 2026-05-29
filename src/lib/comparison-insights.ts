// Dynamic comparison insights for /srovnani/[combo]/ pages.
//
// Generates a per-pair TL;DR verdict, dual decision box ("Kdy A vs Kdy B"),
// short SERP-grade meta description, and 5 FAQPage entries — everything
// derived from StrojFlatModel data so we avoid generic boilerplate that
// LLMs and Google deprioritize.

import type { StrojFlatModel, StrojKategorie } from './stroje';
import { modelDisplayName } from './comparator';
import { useCaseDescription } from './competitor-finder';

/**
 * Short dependent-clause describing the farm size implied by a power level.
 * Designed to fit grammatically after "když" — returns a fragment without
 * the leading capital letter or trailing period.
 */
function farmSizeClause(category: StrojKategorie, powerHp: number | null): string | null {
  if (powerHp === null) return null;
  if (category === 'traktory') {
    if (powerHp < 50) return 'máš malé hospodářství do cca 30 hektarů (sady, vinice, komunální využití)';
    if (powerHp < 90) return 'hospodaříš na 30–100 hektarech a hledáš univerzál pro polní práci a sklizeň trávy';
    if (powerHp < 160) return 'máš střední farmu 100–300 hektarů pro orbu, secí kombinace a postřik';
    if (powerHp < 250) return 'máš velkou farmu 300–600 hektarů a chceš tahat široké secí kombinace nebo samochodné postřikovače';
    return 'jsi velkovýroba nad 500 hektarů a chceš maximum z denní produktivity';
  }
  if (category === 'kombajny') {
    if (powerHp < 250) return 'máš obilninou plochu do 200 ha a vystačíš si se záběrem 5–6 m';
    if (powerHp < 400) return 'sklízíš 200–500 ha obilnin a hodí se ti záběr 6–9 m';
    if (powerHp < 600) return 'sklízíš přes 500 ha obilnin a chceš záběr 9–12 m';
    return 'jsi velkovýroba a chceš nejširší záběr (12 m+) a největší zásobník (14 000+ l)';
  }
  return null;
}

export interface ComparisonFaq {
  q: string;
  a: string;
}

export interface ComparisonInsights {
  /** 2–3 sentence verdict-style TL;DR for above-the-fold + LLM citation. */
  tldr: string;
  /** ~155 char SERP meta description with concrete diff numbers. */
  shortDescription: string;
  /** "Vyber A když…" — 2–3 sentences. */
  decisionA: string;
  /** "Vyber B když…" — 2–3 sentences. */
  decisionB: string;
  /** 5 FAQ entries for FAQPage schema + rendered list. */
  faqs: ComparisonFaq[];
  /** ISO date for visible "aktualizováno" badge + JSON-LD dateModified. */
  lastUpdatedIso: string;
}

function pct(a: number, b: number): number {
  if (b === 0) return 0;
  return Math.round(((a - b) / b) * 100);
}

function cs(n: number): string {
  return n.toLocaleString('cs-CZ');
}

/**
 * Brand description in Czech akuzativ — fits grammatically after "preferuješ".
 * Example: "preferuješ německou prémiovou značku" (not "německá prémiová značka").
 */
function brandDescriptorAkuzativ(brand: string, brandName: string): string {
  const map: Record<string, string> = {
    fendt: 'německou prémiovou značku Fendt',
    'john-deere': 'amerického giganta John Deere',
    'case-ih': 'americkou značku Case IH (koncern CNH)',
    'new-holland': 'evropskou značku New Holland (koncern CNH)',
    claas: 'německého lídra v kombajnech Claas',
    'massey-ferguson': 'tradiční značku Massey Ferguson (koncern AGCO)',
    valtra: 'finskou značku Valtra (koncern AGCO)',
    'deutz-fahr': 'německou značku Deutz-Fahr (koncern SDF)',
    kubota: 'japonskou značku Kubota',
    zetor: 'českou značku Zetor z Brna',
  };
  return map[brand] ?? `značku ${brandName}`;
}

export function comparisonInsights(a: StrojFlatModel, b: StrojFlatModel): ComparisonInsights {
  const aName = modelDisplayName(a);
  const bName = modelDisplayName(b);
  const isTractor = a.category === 'traktory';
  const categoryWord = isTractor ? 'traktor' : 'kombajn';

  // ---- Numeric diffs ----
  const aHp = a.power_hp;
  const bHp = b.power_hp;
  const hpDiff = aHp !== null && bHp !== null ? aHp - bHp : null;
  const hpPct = aHp !== null && bHp !== null ? pct(aHp, bHp) : null;

  const aKg = a.weight_kg ?? null;
  const bKg = b.weight_kg ?? null;
  const kgDiff = aKg !== null && bKg !== null ? aKg - bKg : null;

  const aYear = a.year_from;
  const bYear = b.year_from;
  const yearDiff = aYear !== null && bYear !== null ? aYear - bYear : null;

  const stronger = hpDiff !== null && hpDiff !== 0 ? (hpDiff > 0 ? a : b) : null;
  const lighter = kgDiff !== null && kgDiff !== 0 ? (kgDiff < 0 ? a : b) : null;
  const newer = yearDiff !== null && yearDiff !== 0 ? (yearDiff > 0 ? a : b) : null;

  // ---- TL;DR (LLM-citable definitional answer) ----
  const tldrParts: string[] = [];
  if (stronger && hpDiff !== null && hpPct !== null) {
    const absHp = Math.abs(hpDiff);
    const absPct = Math.abs(hpPct);
    const strongerName = modelDisplayName(stronger);
    const weakerHp = stronger === a ? bHp : aHp;
    const strongerHp = stronger === a ? aHp : bHp;
    tldrParts.push(
      `${strongerName} má vyšší výkon o ${absHp} k (${cs(strongerHp!)} vs ${cs(weakerHp!)} k, +${absPct} %).`,
    );
  } else if (aHp !== null && bHp !== null && hpDiff === 0) {
    tldrParts.push(`Oba ${categoryWord}y mají stejný výkon ${cs(aHp)} k.`);
  }

  if (lighter && kgDiff !== null) {
    const lighterName = modelDisplayName(lighter);
    tldrParts.push(`${lighterName} je lehčí o ${cs(Math.abs(kgDiff))} kg.`);
  }

  if (newer && yearDiff !== null && Math.abs(yearDiff) >= 2) {
    const newerName = modelDisplayName(newer);
    const newerYear = newer === a ? aYear : bYear;
    tldrParts.push(`${newerName} je novější (uveden ${newerYear}).`);
  }

  if (tldrParts.length === 0) {
    tldrParts.push(`${aName} a ${bName} jsou ${categoryWord}y srovnatelné třídy.`);
  }

  const tldr = tldrParts.join(' ');

  // ---- Meta description (~155 chars) ----
  let shortDescription: string;
  if (stronger && hpDiff !== null) {
    const strongerName = modelDisplayName(stronger);
    shortDescription =
      `Srovnání: ${aName} vs ${bName}. ${strongerName} má +${Math.abs(hpDiff)} k. Motor, převodovka, hmotnost, ` +
      `roky výroby a FAQ vedle sebe.`;
  } else {
    shortDescription = `Srovnání ${aName} a ${bName}: výkon, motor, převodovka, hmotnost, FAQ a vhodné použití.`;
  }
  // Hard cap to 158 chars to avoid SERP truncation.
  if (shortDescription.length > 158) shortDescription = shortDescription.slice(0, 155) + '…';

  // ---- Decision boxes ----
  const aUseCase = useCaseDescription(a.category, a.power_hp);
  const bUseCase = useCaseDescription(b.category, b.power_hp);

  function buildDecision(self: StrojFlatModel, other: StrojFlatModel): string {
    const parts: string[] = [];
    const selfName = modelDisplayName(self);
    const isStronger = stronger === self;
    const isLighter = lighter === self;
    const isNewer = newer === self;
    if (isStronger && hpDiff !== null) {
      parts.push(`potřebuješ vyšší výkon (${cs(self.power_hp!)} k) než nabízí ${other.brand_name}`);
    }
    if (isLighter && kgDiff !== null && Math.abs(kgDiff) >= 200) {
      parts.push(`hraje pro tebe roli nižší hmotnost (méně utužování půdy, lepší manévrovatelnost)`);
    }
    if (isNewer && yearDiff !== null && Math.abs(yearDiff) >= 2) {
      parts.push(`chceš novější konstrukci (uvedení ${self.year_from}) — typicky modernější elektronika, ISOBUS, emisní stupeň Stage V`);
    }
    // If self has no winning attribute, frame positively via farm-size fit + brand preference.
    if (parts.length === 0) {
      const sizeClause = farmSizeClause(self.category, self.power_hp);
      if (sizeClause) parts.push(sizeClause);
      parts.push(`preferuješ ${brandDescriptorAkuzativ(self.brand_slug, self.brand_name)}`);
    }
    return `Vyber ${selfName} pokud ${parts.join(', a zároveň ')}.`;
  }

  const decisionA = buildDecision(a, b);
  const decisionB = buildDecision(b, a);

  // ---- FAQs (5 entries) ----
  const faqs: ComparisonFaq[] = [];

  // Q1: Power
  if (aHp !== null && bHp !== null) {
    if (hpDiff === 0) {
      faqs.push({
        q: `Jaký výkon mají ${aName} a ${bName}?`,
        a: `Oba ${categoryWord}y mají shodný výkon ${cs(aHp)} k (${a.power_kw ?? Math.round(aHp * 0.7457)} kW). Rozhodující rozdíl je tedy v dalších parametrech — motoru, převodovce a hmotnosti.`,
      });
    } else {
      const strongerName = modelDisplayName(stronger!);
      const weakerName = stronger === a ? bName : aName;
      const strongerHp = stronger === a ? aHp : bHp;
      const weakerHp = stronger === a ? bHp : aHp;
      faqs.push({
        q: `Co je výkonnější — ${aName} nebo ${bName}?`,
        a: `Výkonnější je ${strongerName} s ${cs(strongerHp!)} k oproti ${cs(weakerHp!)} k u ${weakerName}, rozdíl tedy činí ${Math.abs(hpDiff!)} k (přibližně ${Math.abs(hpPct!)} %).`,
      });
    }
  }

  // Q2: Engine + transmission
  const aEng = a.engine ?? null;
  const bEng = b.engine ?? null;
  const aTr = a.transmission ?? null;
  const bTr = b.transmission ?? null;
  if (aEng || bEng || aTr || bTr) {
    const parts: string[] = [];
    if (aEng) parts.push(`${aName} pohání motor ${aEng}`);
    if (bEng) parts.push(`${bName} motor ${bEng}`);
    if (aTr && bTr && aTr !== bTr) parts.push(`Převodovka: ${aName} — ${aTr}, ${bName} — ${bTr}`);
    else if (aTr) parts.push(`Převodovka: ${aTr}`);
    else if (bTr) parts.push(`Převodovka: ${bTr}`);
    faqs.push({
      q: `Jaký mají motor a převodovku?`,
      a: parts.join('. ') + '.',
    });
  }

  // Q3: Weight / hmotnost
  if (aKg !== null && bKg !== null && kgDiff !== null && kgDiff !== 0) {
    const lighterName = modelDisplayName(lighter!);
    const lighterKg = lighter === a ? aKg : bKg;
    const heavierKg = lighter === a ? bKg : aKg;
    faqs.push({
      q: `Který ${categoryWord} je lehčí?`,
      a: `Lehčí je ${lighterName} s hmotností ${cs(lighterKg)} kg oproti ${cs(heavierKg)} kg, rozdíl ${cs(Math.abs(kgDiff))} kg. Nižší hmotnost znamená menší utužování půdy a lepší manévrovatelnost, ale typicky i nižší tažnou sílu.`,
    });
  }

  // Q4: For which farm size
  if (aUseCase || bUseCase) {
    const parts: string[] = [];
    if (aUseCase) parts.push(`${aName}: ${aUseCase}`);
    if (bUseCase) parts.push(`${bName}: ${bUseCase}`);
    faqs.push({
      q: `Pro jakou velikost farmy se ${aName} a ${bName} hodí?`,
      a: parts.join(' '),
    });
  }

  // Q5: Year / novelty
  if (aYear !== null && bYear !== null) {
    if (yearDiff === 0) {
      faqs.push({
        q: `Kdy byly ${aName} a ${bName} uvedeny na trh?`,
        a: `Oba modely byly uvedeny v roce ${aYear}, jde tedy o současníky stejné generace techniky.`,
      });
    } else {
      const newerName = modelDisplayName(newer!);
      const newerYear = newer === a ? aYear : bYear;
      const olderYear = newer === a ? bYear : aYear;
      faqs.push({
        q: `Který model je novější?`,
        a: `Novější je ${newerName} uvedený v roce ${newerYear} (oproti ${olderYear}). Rozdíl ${Math.abs(yearDiff!)} ${Math.abs(yearDiff!) === 1 ? 'rok' : Math.abs(yearDiff!) < 5 ? 'roky' : 'let'} typicky znamená modernější emisní stupeň, lepší elektroniku a aktuálnější ISOBUS implementaci.`,
      });
    }
  }

  // Trim to 5 max.
  faqs.splice(5);

  // ---- Last updated ----
  // Use today's date so the page reads as fresh to crawlers and LLMs.
  // Data sources (StrojFlatModel) get rebuilt on every deploy, so this is
  // accurate for "page content last verified."
  const lastUpdatedIso = new Date().toISOString().slice(0, 10);

  return { tldr, shortDescription, decisionA, decisionB, faqs, lastUpdatedIso };
}
