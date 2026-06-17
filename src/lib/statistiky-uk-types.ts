// src/lib/statistiky-uk-types.ts
export interface StatistikyUkSeriesPoint { year: number; value: number; }

export interface StatistikyUkBigNumber {
  val: string; unit: string; lbl: string; trend: string;
  source: string; url: string;
}

export interface StatistikyUkCrop {
  crop: string; unit: string;
  production: StatistikyUkSeriesPoint[];
  export: StatistikyUkSeriesPoint[];
  source: string; url: string; asOf: string;
}

export interface StatistikyUkTimelineStep {
  year: string; title: string; text: string; source: string; url: string;
}

/** CONDITIONAL blok — pokud neugroundovaný, v JSONu se neuvede (volitelný). */
export interface StatistikyUkPrices {
  unit: string; asOf: string; source: string; url: string;
  max: number; ticks: number[]; series: StatistikyUkSeriesPoint[];
}

export interface StatistikyUkSourceLink { label: string; url: string; }

export interface StatistikyUkData {
  generated: string;
  warCaveat: string;
  bigNumbers: StatistikyUkBigNumber[];
  cropProduction: StatistikyUkCrop[];
  warTimeline: StatistikyUkTimelineStep[];
  prices?: StatistikyUkPrices;   // CONDITIONAL
  sources: StatistikyUkSourceLink[];
}
