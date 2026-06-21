/**
 * Pure query logic for cross-country agriculture indicators.
 */
import type { CountryProfile } from "../data.js";

export interface CompareCountriesArgs {
  indicator: string;
  /** country slugs; default = all that have the indicator */
  countries?: string[];
}

export interface CountryIndicatorValue {
  slug: string;
  nameCs: string;
  flag: string;
  value: number;
  unit: string;
  referencePeriod: string;
  source: string;
  sourceUrl: string;
}

export interface CompareCountriesResult {
  indicator: string;
  label: string;
  unit: string;
  results: CountryIndicatorValue[];
}

/** All distinct indicator keys present across the dataset, with labels/units. */
export function listIndicators(
  countries: CountryProfile[],
): { key: string; label: string; unit: string }[] {
  const seen = new Map<string, { key: string; label: string; unit: string }>();
  for (const c of countries) {
    for (const ind of Object.values(c.indicators)) {
      if (!seen.has(ind.key)) {
        seen.set(ind.key, { key: ind.key, label: ind.label, unit: ind.unit });
      }
    }
  }
  return [...seen.values()].sort((a, b) => a.key.localeCompare(b.key));
}

/**
 * Compare the latest value of one indicator across countries.
 * Results are sorted by value descending.
 */
export function compareCountries(
  countries: CountryProfile[],
  args: CompareCountriesArgs,
): CompareCountriesResult {
  const key = args.indicator.trim();
  const known = listIndicators(countries).find((i) => i.key === key);
  if (!known) {
    const valid = listIndicators(countries)
      .map((i) => `${i.key} (${i.label})`)
      .join(", ");
    throw new Error(`Unknown indicator "${args.indicator}". Valid keys: ${valid}.`);
  }

  let pool = countries;
  if (args.countries && args.countries.length > 0) {
    const want = new Set(args.countries.map((s) => s.toLowerCase()));
    pool = countries.filter((c) => want.has(c.slug.toLowerCase()));
  }

  const results: CountryIndicatorValue[] = [];
  for (const c of pool) {
    const ind = c.indicators[key];
    if (!ind || !ind.latest) continue;
    results.push({
      slug: c.slug,
      nameCs: c.nameCs,
      flag: c.flag,
      value: ind.latest.value,
      unit: ind.latest.unit,
      referencePeriod: ind.latest.referencePeriod,
      source: ind.latest.source,
      sourceUrl: ind.latest.sourceUrl,
    });
  }
  results.sort((a, b) => b.value - a.value);

  return {
    indicator: known.key,
    label: known.label,
    unit: known.unit,
    results,
  };
}
