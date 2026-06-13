// Sezónní agregační vrstva. Čistá, bez astro:content/async — testovatelná.
// Data: plodiny (listPlodiny) + statická kurátorská mapa howto→sezóna.

export type SeasonSlug = 'jaro' | 'leto' | 'podzim' | 'zima';

export interface Season {
  slug: SeasonSlug;
  name: string;
  /** Měsíce sezóny (1–12). */
  months: number[];
}

export const SEASONS: Season[] = [
  { slug: 'jaro', name: 'Jaro', months: [3, 4, 5] },
  { slug: 'leto', name: 'Léto', months: [6, 7, 8] },
  { slug: 'podzim', name: 'Podzim', months: [9, 10, 11] },
  { slug: 'zima', name: 'Zima', months: [12, 1, 2] },
];

export const MONTH_NAMES_CS = [
  'leden', 'únor', 'březen', 'duben', 'květen', 'červen',
  'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec',
];

export function getSeason(slug: string): Season | undefined {
  return SEASONS.find((s) => s.slug === slug);
}

export function seasonOfMonth(month: number): SeasonSlug {
  return SEASONS.find((s) => s.months.includes(month))!.slug;
}
