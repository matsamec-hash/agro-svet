// Dynamic comparison insights for /srovnani/[combo]/ pages.
//
// Generates a per-pair TL;DR verdict, dual decision box ("Kdy A vs Kdy B"),
// short SERP-grade meta description, and 5 FAQPage entries — everything
// derived from StrojFlatModel data so we avoid generic boilerplate that
// LLMs and Google deprioritize.
//
// Locale-aware: the function emits cs (default) byte-identically to the
// original and a native Slovak variant for locale 'sk'. Phrases are NOT a
// translation of this file — they are locale-keyed templates built inline so
// the cs branch stays diff-proof against the pre-i18n output.

import type { StrojFlatModel, StrojKategorie } from './stroje';
import type { Locale } from './../i18n/config';
import { modelDisplayName } from './comparator';
import { useCaseDescription } from './competitor-finder';

/**
 * Short dependent-clause describing the farm size implied by a power level.
 * Designed to fit grammatically after "když"/"ak" — returns a fragment without
 * the leading capital letter or trailing period.
 */
function farmSizeClause(category: StrojKategorie, powerHp: number | null, sk: boolean): string | null {
  if (powerHp === null) return null;
  if (category === 'traktory') {
    if (powerHp < 50) return sk
      ? 'máš malé hospodárstvo do cca 30 hektárov (sady, vinice, komunálne využitie)'
      : 'máš malé hospodářství do cca 30 hektarů (sady, vinice, komunální využití)';
    if (powerHp < 90) return sk
      ? 'hospodáriš na 30–100 hektároch a hľadáš univerzál na poľnú prácu a zber trávy'
      : 'hospodaříš na 30–100 hektarech a hledáš univerzál pro polní práci a sklizeň trávy';
    if (powerHp < 160) return sk
      ? 'máš strednú farmu 100–300 hektárov na orbu, sejacie kombinácie a postrek'
      : 'máš střední farmu 100–300 hektarů pro orbu, secí kombinace a postřik';
    if (powerHp < 250) return sk
      ? 'máš veľkú farmu 300–600 hektárov a chceš ťahať široké sejacie kombinácie alebo samohybné postrekovače'
      : 'máš velkou farmu 300–600 hektarů a chceš tahat široké secí kombinace nebo samochodné postřikovače';
    return sk
      ? 'si veľkovýroba nad 500 hektárov a chceš maximum z dennej produktivity'
      : 'jsi velkovýroba nad 500 hektarů a chceš maximum z denní produktivity';
  }
  if (category === 'kombajny') {
    if (powerHp < 250) return sk
      ? 'máš obilninovú plochu do 200 ha a vystačíš si so záberom 5–6 m'
      : 'máš obilninou plochu do 200 ha a vystačíš si se záběrem 5–6 m';
    if (powerHp < 400) return sk
      ? 'zbieraš 200–500 ha obilnín a hodí sa ti záber 6–9 m'
      : 'sklízíš 200–500 ha obilnin a hodí se ti záběr 6–9 m';
    if (powerHp < 600) return sk
      ? 'zbieraš cez 500 ha obilnín a chceš záber 9–12 m'
      : 'sklízíš přes 500 ha obilnin a chceš záběr 9–12 m';
    return sk
      ? 'si veľkovýroba a chceš najširší záber (12 m+) a najväčší zásobník (14 000+ l)'
      : 'jsi velkovýroba a chceš nejširší záběr (12 m+) a největší zásobník (14 000+ l)';
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

/**
 * Brand description in accusative — fits grammatically after "preferuješ".
 * Example: "preferuješ německou prémiovou značku" (not "německá prémiová značka").
 */
function brandDescriptorAkuzativ(brand: string, brandName: string, sk: boolean): string {
  const mapCs: Record<string, string> = {
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
  const mapSk: Record<string, string> = {
    fendt: 'nemeckú prémiovú značku Fendt',
    'john-deere': 'amerického giganta John Deere',
    'case-ih': 'americkú značku Case IH (koncern CNH)',
    'new-holland': 'európsku značku New Holland (koncern CNH)',
    claas: 'nemeckého lídra v kombajnoch Claas',
    'massey-ferguson': 'tradičnú značku Massey Ferguson (koncern AGCO)',
    valtra: 'fínsku značku Valtra (koncern AGCO)',
    'deutz-fahr': 'nemeckú značku Deutz-Fahr (koncern SDF)',
    kubota: 'japonskú značku Kubota',
    zetor: 'českú značku Zetor z Brna',
  };
  const map = sk ? mapSk : mapCs;
  return map[brand] ?? `značku ${brandName}`;
}

export function comparisonInsights(
  a: StrojFlatModel,
  b: StrojFlatModel,
  locale: Locale = 'cs',
): ComparisonInsights {
  const sk = locale === 'sk';
  const num = (n: number): string => n.toLocaleString(sk ? 'sk-SK' : 'cs-CZ');
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
      `${strongerName} má vyšší výkon o ${absHp} k (${num(strongerHp!)} vs ${num(weakerHp!)} k, +${absPct} %).`,
    );
  } else if (aHp !== null && bHp !== null && hpDiff === 0) {
    tldrParts.push(sk
      ? `Oba ${categoryWord}y majú rovnaký výkon ${num(aHp)} k.`
      : `Oba ${categoryWord}y mají stejný výkon ${num(aHp)} k.`);
  }

  if (lighter && kgDiff !== null) {
    const lighterName = modelDisplayName(lighter);
    tldrParts.push(sk
      ? `${lighterName} je ľahší o ${num(Math.abs(kgDiff))} kg.`
      : `${lighterName} je lehčí o ${num(Math.abs(kgDiff))} kg.`);
  }

  if (newer && yearDiff !== null && Math.abs(yearDiff) >= 2) {
    const newerName = modelDisplayName(newer);
    const newerYear = newer === a ? aYear : bYear;
    tldrParts.push(sk
      ? `${newerName} je novší (uvedený ${newerYear}).`
      : `${newerName} je novější (uveden ${newerYear}).`);
  }

  if (tldrParts.length === 0) {
    tldrParts.push(sk
      ? `${aName} a ${bName} sú ${categoryWord}y porovnateľnej triedy.`
      : `${aName} a ${bName} jsou ${categoryWord}y srovnatelné třídy.`);
  }

  const tldr = tldrParts.join(' ');

  // ---- Meta description (~155 chars) ----
  let shortDescription: string;
  if (stronger && hpDiff !== null) {
    const strongerName = modelDisplayName(stronger);
    shortDescription = sk
      ? `Porovnanie: ${aName} vs ${bName}. ${strongerName} má +${Math.abs(hpDiff)} k. Motor, prevodovka, hmotnosť, ` +
        `roky výroby a FAQ vedľa seba.`
      : `Srovnání: ${aName} vs ${bName}. ${strongerName} má +${Math.abs(hpDiff)} k. Motor, převodovka, hmotnost, ` +
        `roky výroby a FAQ vedle sebe.`;
  } else {
    shortDescription = sk
      ? `Porovnanie ${aName} a ${bName}: výkon, motor, prevodovka, hmotnosť, FAQ a vhodné použitie.`
      : `Srovnání ${aName} a ${bName}: výkon, motor, převodovka, hmotnost, FAQ a vhodné použití.`;
  }
  // Hard cap to 158 chars to avoid SERP truncation.
  if (shortDescription.length > 158) shortDescription = shortDescription.slice(0, 155) + '…';

  // ---- Decision boxes ----
  const aUseCase = useCaseDescription(a.category, a.power_hp, locale);
  const bUseCase = useCaseDescription(b.category, b.power_hp, locale);

  function buildDecision(self: StrojFlatModel, other: StrojFlatModel): string {
    const parts: string[] = [];
    const selfName = modelDisplayName(self);
    const isStronger = stronger === self;
    const isLighter = lighter === self;
    const isNewer = newer === self;
    if (isStronger && hpDiff !== null) {
      parts.push(sk
        ? `potrebuješ vyšší výkon (${num(self.power_hp!)} k), než ponúka ${other.brand_name}`
        : `potřebuješ vyšší výkon (${num(self.power_hp!)} k) než nabízí ${other.brand_name}`);
    }
    if (isLighter && kgDiff !== null && Math.abs(kgDiff) >= 200) {
      parts.push(sk
        ? `hrá pre teba rolu nižšia hmotnosť (menšie utláčanie pôdy, lepšia manévrovateľnosť)`
        : `hraje pro tebe roli nižší hmotnost (méně utužování půdy, lepší manévrovatelnost)`);
    }
    if (isNewer && yearDiff !== null && Math.abs(yearDiff) >= 2) {
      parts.push(sk
        ? `chceš novšiu konštrukciu (uvedenie ${self.year_from}) — typicky modernejšia elektronika, ISOBUS, emisný stupeň Stage V`
        : `chceš novější konstrukci (uvedení ${self.year_from}) — typicky modernější elektronika, ISOBUS, emisní stupeň Stage V`);
    }
    // If self has no winning attribute, frame positively via farm-size fit + brand preference.
    if (parts.length === 0) {
      const sizeClause = farmSizeClause(self.category, self.power_hp, sk);
      if (sizeClause) parts.push(sizeClause);
      // "preferuješ" is identical in cs and sk.
      parts.push(`preferuješ ${brandDescriptorAkuzativ(self.brand_slug, self.brand_name, sk)}`);
    }
    return sk
      ? `Vyber ${selfName}, ak ${parts.join(', a zároveň ')}.`
      : `Vyber ${selfName} pokud ${parts.join(', a zároveň ')}.`;
  }

  const decisionA = buildDecision(a, b);
  const decisionB = buildDecision(b, a);

  // ---- FAQs (5 entries) ----
  const faqs: ComparisonFaq[] = [];

  // Q1: Power
  if (aHp !== null && bHp !== null) {
    if (hpDiff === 0) {
      const kw = a.power_kw ?? Math.round(aHp * 0.7457);
      faqs.push({
        q: sk ? `Aký výkon majú ${aName} a ${bName}?` : `Jaký výkon mají ${aName} a ${bName}?`,
        a: sk
          ? `Oba ${categoryWord}y majú zhodný výkon ${num(aHp)} k (${kw} kW). Rozhodujúci rozdiel je teda v ďalších parametroch — motore, prevodovke a hmotnosti.`
          : `Oba ${categoryWord}y mají shodný výkon ${num(aHp)} k (${kw} kW). Rozhodující rozdíl je tedy v dalších parametrech — motoru, převodovce a hmotnosti.`,
      });
    } else {
      const strongerName = modelDisplayName(stronger!);
      const weakerName = stronger === a ? bName : aName;
      const strongerHp = stronger === a ? aHp : bHp;
      const weakerHp = stronger === a ? bHp : aHp;
      faqs.push({
        q: sk
          ? `Čo je výkonnejšie — ${aName} alebo ${bName}?`
          : `Co je výkonnější — ${aName} nebo ${bName}?`,
        a: sk
          ? `Výkonnejší je ${strongerName} s ${num(strongerHp!)} k oproti ${num(weakerHp!)} k u ${weakerName}, rozdiel teda predstavuje ${Math.abs(hpDiff!)} k (približne ${Math.abs(hpPct!)} %).`
          : `Výkonnější je ${strongerName} s ${num(strongerHp!)} k oproti ${num(weakerHp!)} k u ${weakerName}, rozdíl tedy činí ${Math.abs(hpDiff!)} k (přibližně ${Math.abs(hpPct!)} %).`,
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
    if (aEng) parts.push(sk ? `${aName} poháňa motor ${aEng}` : `${aName} pohání motor ${aEng}`);
    if (bEng) parts.push(`${bName} motor ${bEng}`);
    if (aTr && bTr && aTr !== bTr) parts.push(sk
      ? `Prevodovka: ${aName} — ${aTr}, ${bName} — ${bTr}`
      : `Převodovka: ${aName} — ${aTr}, ${bName} — ${bTr}`);
    else if (aTr) parts.push(sk ? `Prevodovka: ${aTr}` : `Převodovka: ${aTr}`);
    else if (bTr) parts.push(sk ? `Prevodovka: ${bTr}` : `Převodovka: ${bTr}`);
    faqs.push({
      q: sk ? `Aký majú motor a prevodovku?` : `Jaký mají motor a převodovku?`,
      a: parts.join('. ') + '.',
    });
  }

  // Q3: Weight / hmotnost
  if (aKg !== null && bKg !== null && kgDiff !== null && kgDiff !== 0) {
    const lighterName = modelDisplayName(lighter!);
    const lighterKg = lighter === a ? aKg : bKg;
    const heavierKg = lighter === a ? bKg : aKg;
    faqs.push({
      q: sk ? `Ktorý ${categoryWord} je ľahší?` : `Který ${categoryWord} je lehčí?`,
      a: sk
        ? `Ľahší je ${lighterName} s hmotnosťou ${num(lighterKg)} kg oproti ${num(heavierKg)} kg, rozdiel ${num(Math.abs(kgDiff))} kg. Nižšia hmotnosť znamená menšie utláčanie pôdy a lepšiu manévrovateľnosť, ale typicky aj nižšiu ťažnú silu.`
        : `Lehčí je ${lighterName} s hmotností ${num(lighterKg)} kg oproti ${num(heavierKg)} kg, rozdíl ${num(Math.abs(kgDiff))} kg. Nižší hmotnost znamená menší utužování půdy a lepší manévrovatelnost, ale typicky i nižší tažnou sílu.`,
    });
  }

  // Q4: For which farm size
  if (aUseCase || bUseCase) {
    const parts: string[] = [];
    if (aUseCase) parts.push(`${aName}: ${aUseCase}`);
    if (bUseCase) parts.push(`${bName}: ${bUseCase}`);
    faqs.push({
      q: sk
        ? `Pre akú veľkosť farmy sa ${aName} a ${bName} hodia?`
        : `Pro jakou velikost farmy se ${aName} a ${bName} hodí?`,
      a: parts.join(' '),
    });
  }

  // Q5: Year / novelty
  if (aYear !== null && bYear !== null) {
    if (yearDiff === 0) {
      faqs.push({
        q: sk
          ? `Kedy boli ${aName} a ${bName} uvedené na trh?`
          : `Kdy byly ${aName} a ${bName} uvedeny na trh?`,
        a: sk
          ? `Oba modely boli uvedené v roku ${aYear}, ide teda o súčasníkov rovnakej generácie techniky.`
          : `Oba modely byly uvedeny v roce ${aYear}, jde tedy o současníky stejné generace techniky.`,
      });
    } else {
      const newerName = modelDisplayName(newer!);
      const newerYear = newer === a ? aYear : bYear;
      const olderYear = newer === a ? bYear : aYear;
      const ay = Math.abs(yearDiff!);
      const yearWord = sk
        ? (ay === 1 ? 'rok' : ay < 5 ? 'roky' : 'rokov')
        : (ay === 1 ? 'rok' : ay < 5 ? 'roky' : 'let');
      faqs.push({
        q: sk ? `Ktorý model je novší?` : `Který model je novější?`,
        a: sk
          ? `Novší je ${newerName} uvedený v roku ${newerYear} (oproti ${olderYear}). Rozdiel ${ay} ${yearWord} typicky znamená modernejší emisný stupeň, lepšiu elektroniku a aktuálnejšiu ISOBUS implementáciu.`
          : `Novější je ${newerName} uvedený v roce ${newerYear} (oproti ${olderYear}). Rozdíl ${ay} ${yearWord} typicky znamená modernější emisní stupeň, lepší elektroniku a aktuálnější ISOBUS implementaci.`,
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
