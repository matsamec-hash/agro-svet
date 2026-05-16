// Diesel kalkulačka — porovnání spotřeby a ročních nákladů na naftu
// mezi dvěma traktory. Hlavní use case: kupní rozhodnutí, kdy nová
// efektivnější mašina zaplatí rozdíl v ceně.
//
// Spotřeba (l/h) je orientační podle výkonu a emisní normy. Reálná
// spotřeba závisí na: typu práce (tah / PTO / transport), zatížení,
// kvalitě údržby, typu nafty. Použijeme regresní průměry z OECD
// traktorových testů + DLG profi-testů (NCK, Profi DLG Test).

export type EmisniNorma = 'pre-tier2' | 'tier3' | 'stage3b' | 'stage4' | 'stage5';

export interface TractorProfile {
  powerHp: number;
  norma: EmisniNorma;
  /** Optional explicit l/h override; pokud zadáno, použije se místo regrese. */
  consumptionLh?: number;
}

// Hrubá regrese spotřeby (specifická spotřeba g/kWh) podle emisní normy.
// Vyšší g/kWh = vyšší spotřeba. Hodnoty z DLG profi-test průměrů 2010–2024.
const SPECIFIC_CONSUMPTION_G_PER_KWH: Record<EmisniNorma, number> = {
  'pre-tier2': 260, // staré dieselů z 90.let — nejvyšší spotřeba, žádné after-treatment
  'tier3':      240, // 2006–2011, EGR, bez DPF
  'stage3b':    230, // 2011–2014, DPF povinný
  'stage4':     215, // 2014–2019, SCR (AdBlue), nižší spotřeba
  'stage5':     210, // 2020+, optimalizovaná SCR + DPF, nejlepší účinnost
};

const NAFTA_DENSITY_G_PER_L = 832; // g/l, naftová standard

/** Spočítá orientační spotřebu v l/h pro daný profil. Reflectuje
 * průměrné využití (cca 50–70 % nominálního výkonu). */
export function estimateConsumption(profile: TractorProfile): number {
  if (profile.consumptionLh && profile.consumptionLh > 0) return profile.consumptionLh;
  const kw = profile.powerHp * 0.7355; // hp → kW
  const avgLoad = 0.6; // průměrné zatížení při směsi prací (tah + PTO + transport)
  const realKw = kw * avgLoad;
  const gPerH = realKw * SPECIFIC_CONSUMPTION_G_PER_KWH[profile.norma];
  const lPerH = gPerH / NAFTA_DENSITY_G_PER_L;
  return Math.round(lPerH * 10) / 10;
}

export interface DieselComparisonInput {
  tractorA: TractorProfile;
  tractorB: TractorProfile;
  /** Roční využití v motohodinách (typicky 600–1500 pro CZ farmu). */
  hoursPerYear: number;
  /** Cena nafty v Kč/l (s DPH a spotřební daní). */
  naftaPriceCzk: number;
  /** Volitelné: porovnání investice — kolik stojí nový traktor B navíc. */
  investmentDiffCzk?: number;
}

export interface ConsumptionLine {
  label: string;
  consumptionLh: number;
  yearlyL: number;
  yearlyCzk: number;
  /** Klesající (úsporný) | rostoucí (dražší). */
  perHourCzk: number;
}

export interface DieselComparisonResult {
  a: ConsumptionLine;
  b: ConsumptionLine;
  /** Roční úspora B oproti A (kladná = B levnější). */
  yearlySavingCzk: number;
  /** Úspora za 5 let. */
  fiveYearSavingCzk: number;
  /** Pokud zadán investiční rozdíl, kolik let návratnosti přes úsporu na naftě. */
  paybackYears?: number;
  /** Procento úspory (kladná = B úspornější). */
  savingPct: number;
}

export function compareDiesel(input: DieselComparisonInput): DieselComparisonResult {
  const consA = estimateConsumption(input.tractorA);
  const consB = estimateConsumption(input.tractorB);
  const yearlyLA = consA * input.hoursPerYear;
  const yearlyLB = consB * input.hoursPerYear;
  const yearlyCzkA = Math.round(yearlyLA * input.naftaPriceCzk);
  const yearlyCzkB = Math.round(yearlyLB * input.naftaPriceCzk);
  const yearlySaving = yearlyCzkA - yearlyCzkB;
  const fiveYearSaving = yearlySaving * 5;
  const savingPct = yearlyCzkA > 0 ? (yearlySaving / yearlyCzkA) * 100 : 0;

  let paybackYears: number | undefined;
  if (input.investmentDiffCzk && input.investmentDiffCzk > 0 && yearlySaving > 0) {
    paybackYears = input.investmentDiffCzk / yearlySaving;
  }

  return {
    a: {
      label: `${input.tractorA.powerHp} k · ${NORMA_LABELS[input.tractorA.norma]}`,
      consumptionLh: consA,
      yearlyL: Math.round(yearlyLA),
      yearlyCzk: yearlyCzkA,
      perHourCzk: Math.round(consA * input.naftaPriceCzk),
    },
    b: {
      label: `${input.tractorB.powerHp} k · ${NORMA_LABELS[input.tractorB.norma]}`,
      consumptionLh: consB,
      yearlyL: Math.round(yearlyLB),
      yearlyCzk: yearlyCzkB,
      perHourCzk: Math.round(consB * input.naftaPriceCzk),
    },
    yearlySavingCzk: yearlySaving,
    fiveYearSavingCzk: fiveYearSaving,
    paybackYears,
    savingPct,
  };
}

export const NORMA_LABELS: Record<EmisniNorma, string> = {
  'pre-tier2': 'Před 2006 (Tier 1/Stage I-II)',
  'tier3':      'Tier 3 (2006–2011, EGR)',
  'stage3b':    'Stage IIIB (2011–2014, DPF)',
  'stage4':     'Stage IV (2014–2019, SCR)',
  'stage5':     'Stage V (2020+, DPF + SCR)',
};

export const NORMA_OPTIONS: { value: EmisniNorma; label: string }[] = [
  { value: 'pre-tier2', label: NORMA_LABELS['pre-tier2'] },
  { value: 'tier3',     label: NORMA_LABELS['tier3'] },
  { value: 'stage3b',   label: NORMA_LABELS['stage3b'] },
  { value: 'stage4',    label: NORMA_LABELS['stage4'] },
  { value: 'stage5',    label: NORMA_LABELS['stage5'] },
];
