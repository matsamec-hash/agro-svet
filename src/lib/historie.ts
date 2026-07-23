// src/lib/historie.ts
// Typovaná vrstva nad src/data/agro-historie.json (bez runtime fetch, stejný
// vzor jako ostatní datové sekce). cs-only obsah.
import raw from '../data/agro-historie.json';

export type Machine = {
  slug: string;
  name: string;
  category: string;
  maker: string;
  yearsFrom: number;
  yearsTo: number | null;
  specs: Record<string, string>;
  story: string;
  image: string | null;
  imageCredit?: string;
  imageLicense?: string;
  imageLicenseUrl?: string;
  imageSource?: string;
};
export type SeriesPoint = { year: number; value: number };
export type LongRange = {
  key: string;
  label: string;
  unit: string;
  source: string;
  points: SeriesPoint[];
};
export type PressClip = {
  year: number;
  date: string;
  source: string;
  edition?: string;
  rubrika: string;
  topic: string;
  featured?: boolean;
  headline: string;
  subhead: string;
  context: string;
  body: string[];
  figureCaption: string;
  pullQuote?: string;
};
export type Trivia = { title: string; body: string; then?: string; now?: string; era?: string };
export type Milestone = { year: number; title: string; note: string };

const data = raw as {
  generated: string;
  milestones: Milestone[];
  machines: Machine[];
  longRange: LongRange[];
  press: PressClip[];
  trivia: Trivia[];
};

export const generated = data.generated;
export const milestones: Milestone[] = [...data.milestones].sort((a, b) => a.year - b.year);
export const machines: Machine[] = data.machines;
export const longRange: LongRange[] = data.longRange;
export const press: PressClip[] = [...data.press].sort((a, b) => a.year - b.year);
export const trivia: Trivia[] = data.trivia;

export function machineBySlug(slug: string): Machine | undefined {
  return machines.find((m) => m.slug === slug);
}
export function seriesByKey(key: string): LongRange | undefined {
  return longRange.find((s) => s.key === key);
}
