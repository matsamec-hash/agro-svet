// Recommender pro "Jaký traktor potřebujete?" — pure scoring lib.
// Decision tree: 6 otázek → výkonová třída + kategorie + cenový rámec
// → seřazený seznam modelů z katalogu (`getAllModels`).

import { getAllModels, type StrojFlatModel } from './stroje';

export type FarmSize = 'mini' | 'small' | 'medium' | 'large' | 'huge';
export type FarmType = 'mixed' | 'arable' | 'pasture' | 'orchard' | 'forest';
export type Budget = 'tight' | 'mid' | 'premium' | 'flagship';
export type DriverPref = 'comfort' | 'value' | 'tech' | 'simple';
export type Usage = 'general' | 'tow-heavy' | 'pto-heavy' | 'transport';
export type ServicePref = 'local' | 'any';

export interface QuizAnswers {
  farmSize: FarmSize;
  farmType: FarmType;
  budget: Budget;
  driverPref: DriverPref;
  usage: Usage;
  servicePref: ServicePref;
}

interface PowerRange { min: number; max: number; ideal: number; }

const FARM_SIZE_POWER: Record<FarmSize, PowerRange> = {
  mini:   { min: 25,  max: 75,  ideal: 50 },
  small:  { min: 70,  max: 130, ideal: 100 },
  medium: { min: 110, max: 180, ideal: 140 },
  large:  { min: 160, max: 280, ideal: 220 },
  huge:   { min: 250, max: 700, ideal: 350 },
};

// Sazba "lokální značky" v ČR — Zetor + dealeři dostupní širší
// dealerská síť (JD, NH, Case, Fendt, MF, Claas). Bonus přidává score.
const LOCAL_BRAND_BONUS: Record<string, number> = {
  zetor: 10,
  'john-deere': 8,
  'new-holland': 7,
  'case-ih': 7,
  fendt: 6,
  'massey-ferguson': 6,
  claas: 5,
  'deutz-fahr': 4,
  kubota: 4,
  valtra: 3,
};

// Premium značky (vyšší cena + tech) — bonus pokud user chce comfort/tech.
const PREMIUM_BRANDS = new Set(['fendt', 'john-deere', 'claas', 'new-holland', 'case-ih']);

// Brand value — Zetor + Kubota = best value-for-money v CZ kontextu.
const VALUE_BRANDS = new Set(['zetor', 'kubota', 'deutz-fahr', 'valtra']);

export interface RecommendedModel {
  model: StrojFlatModel;
  score: number;
  reasons: string[];
}

export function recommend(answers: QuizAnswers, topN = 5): RecommendedModel[] {
  const all = getAllModels();
  const targetRange = FARM_SIZE_POWER[answers.farmSize];

  // Filter cards: jen traktory s power_hp, aktuálně vyráběné (year_to === null).
  const candidates = all.filter((m) => {
    if (m.category !== 'traktory') return false;
    if (m.power_hp === null) return false;
    if (m.year_to !== null) return false;
    return m.power_hp >= targetRange.min * 0.85 && m.power_hp <= targetRange.max * 1.15;
  });

  const scored: RecommendedModel[] = candidates.map((m) => {
    let score = 100;
    const reasons: string[] = [];

    // Power proximity to ideal — closer to ideal = higher score.
    const powerDelta = Math.abs((m.power_hp ?? 0) - targetRange.ideal);
    const powerPenalty = (powerDelta / targetRange.ideal) * 40;
    score -= powerPenalty;

    if (powerDelta < targetRange.ideal * 0.1) {
      reasons.push(`Výkon ${m.power_hp} k přesně pasuje na vaši velikost farmy`);
    } else if (powerDelta < targetRange.ideal * 0.25) {
      reasons.push(`Vhodný výkon ${m.power_hp} k pro vaši farmu`);
    }

    // Brand bonuses
    const brandScore = LOCAL_BRAND_BONUS[m.brand_slug] ?? 0;
    score += brandScore;
    if (brandScore >= 7) {
      reasons.push(`Široká servisní síť ${m.brand_name} v ČR`);
    }

    if (answers.driverPref === 'comfort' || answers.driverPref === 'tech') {
      if (PREMIUM_BRANDS.has(m.brand_slug)) {
        score += 15;
        reasons.push(answers.driverPref === 'tech'
          ? `${m.brand_name} patří mezi technologické lídry (precision farming, telematika)`
          : `${m.brand_name} nabízí prémiový komfort obsluhy`);
      }
    }
    if (answers.driverPref === 'value' || answers.driverPref === 'simple') {
      if (VALUE_BRANDS.has(m.brand_slug)) {
        score += 15;
        reasons.push(answers.driverPref === 'value'
          ? `${m.brand_name} = nejlepší poměr cena / výkon`
          : `${m.brand_name} = robustní, jednoduchá konstrukce, snadný servis`);
      }
    }

    // Budget alignment
    if (answers.budget === 'tight' && VALUE_BRANDS.has(m.brand_slug)) score += 10;
    if (answers.budget === 'tight' && PREMIUM_BRANDS.has(m.brand_slug)) score -= 20;
    if (answers.budget === 'flagship' && PREMIUM_BRANDS.has(m.brand_slug)) score += 10;
    if (answers.budget === 'flagship' && (m.power_hp ?? 0) >= targetRange.max * 0.9) score += 5;

    // Usage tweaks
    if (answers.usage === 'tow-heavy' && (m.power_hp ?? 0) >= targetRange.ideal) score += 5;
    if (answers.usage === 'pto-heavy' && m.transmission?.toLowerCase().includes('powershift')) score += 5;
    if (answers.usage === 'transport' && m.transmission?.toLowerCase().includes('cvt')) score += 5;

    // Farm type tweaks
    if (answers.farmType === 'orchard' && m.brand_slug === 'kubota') score += 10;
    if (answers.farmType === 'forest' && (m.brand_slug === 'john-deere' || m.brand_slug === 'zetor')) score += 5;

    // Service preference — local + service preference → big Zetor bonus.
    if (answers.servicePref === 'local' && m.brand_slug === 'zetor') {
      score += 10;
      reasons.push('Český výrobce → nejlepší dostupnost ND a servisu v ČR');
    }

    return { model: m, score, reasons: reasons.slice(0, 3) };
  });

  scored.sort((a, b) => b.score - a.score);

  // De-duplicate: max 1 model per series (sourozenci by zaplavili Top N).
  const seenSeries = new Set<string>();
  const deduped: RecommendedModel[] = [];
  for (const r of scored) {
    const key = `${r.model.brand_slug}:${r.model.series_slug}`;
    if (seenSeries.has(key)) continue;
    seenSeries.add(key);
    deduped.push(r);
    if (deduped.length >= topN) break;
  }
  return deduped;
}

export const FARM_SIZE_LABELS: Record<FarmSize, string> = {
  mini: 'Hobby / sad (< 5 ha)',
  small: 'Malé hospodářství (5–50 ha)',
  medium: 'Střední farma (50–200 ha)',
  large: 'Velká farma (200–800 ha)',
  huge: 'Velkofarma / podnik (800+ ha)',
};
export const FARM_TYPE_LABELS: Record<FarmType, string> = {
  mixed: 'Smíšené (pole + zvířata)',
  arable: 'Orná půda (obiloviny, kukuřice)',
  pasture: 'Pastviny / TTP',
  orchard: 'Sady / vinohrady',
  forest: 'Les / komunální',
};
export const BUDGET_LABELS: Record<Budget, string> = {
  tight: 'Co nejmíň (do 1 mil. Kč)',
  mid: 'Střední (1–2,5 mil. Kč)',
  premium: 'Prémium (2,5–5 mil. Kč)',
  flagship: 'Flagship (5+ mil. Kč)',
};
export const DRIVER_PREF_LABELS: Record<DriverPref, string> = {
  comfort: 'Komfort obsluhy nadevše',
  value: 'Nejlepší poměr cena / výkon',
  tech: 'Nejmodernější technologie (precision)',
  simple: 'Jednoduchost a snadný servis',
};
export const USAGE_LABELS: Record<Usage, string> = {
  general: 'Univerzální (smíchané práce)',
  'tow-heavy': 'Hlavně tah (orba, hluboké zpracování)',
  'pto-heavy': 'Hlavně PTO (sečka, lis, postřikovač)',
  transport: 'Hlavně transport (doprava na cestě)',
};
export const SERVICE_PREF_LABELS: Record<ServicePref, string> = {
  local: 'Důležitý je lokální servis a dostupnost ND',
  any: 'Vyberu cokoli, servis vyřeším později',
};
