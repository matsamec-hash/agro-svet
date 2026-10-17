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
  /** Attribution the data sources require when the values are shown or passed on. */
  attribution: string[];
}

// ---- Licence obligations of the sources (licence audit 2026-10-15) ----------
// Same wording as /svet and /data/licence on the site (src/i18n/svet.ts):
//  - Eurostat: acknowledge the source; modified data must say so and carry a
//    disclaimer that Eurostat is not responsible for the modifications.
//  - World Bank WDI: CC BY 4.0, attribution "The World Bank: Dataset name: Data
//    source", and the same attribution requirement must travel with the data
//    (met by linking the World Bank terms of use for datasets).
const WDI_PROVIDERS: Record<string, string> = {
  "AG.YLD.CREL.KG": "FAO",
  "AG.LND.AGRI.K2": "FAO",
  "AG.LND.ARBL.HA": "FAO",
  "AG.CON.FERT.ZS": "FAO",
  "NV.AGR.TOTL.ZS": "national statistical offices, OECD, World Bank staff estimates",
  "SL.AGR.EMPL.ZS": "ILO",
};
const EUROSTAT_ATTRIBUTION =
  "Source: Eurostat (© European Union). Data processed by agro-svet.cz (latest " +
  "available year selected, units converted); Eurostat has no responsibility " +
  "for these modifications. Terms: https://ec.europa.eu/eurostat/help/copyright-notice";
const WORLD_BANK_ATTRIBUTION =
  "The World Bank: World Development Indicators, licensed under CC BY 4.0 " +
  "(https://creativecommons.org/licenses/by/4.0/). Redistribution must keep " +
  "this attribution and the World Bank terms of use for datasets: " +
  "https://www.worldbank.org/ext/en/legal/terms-conditions/datasets";

/** Citation of an indicator source; World Bank in the mandatory WDI form. */
export function sourceCitation(source: string, url: string): string {
  if (source !== "World Bank") return source;
  const code = /\/indicator\/([A-Z0-9.]+)/.exec(url)?.[1] ?? "";
  const provider = WDI_PROVIDERS[code];
  return `The World Bank: World Development Indicators${provider ? `: ${provider}` : ""}`;
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
      source: sourceCitation(ind.latest.source, ind.latest.sourceUrl),
      sourceUrl: ind.latest.sourceUrl,
    });
  }
  results.sort((a, b) => b.value - a.value);
  const attribution: string[] = [];
  if (results.some((r) => r.source === "Eurostat")) attribution.push(EUROSTAT_ATTRIBUTION);
  if (results.some((r) => r.source.startsWith("The World Bank"))) attribution.push(WORLD_BANK_ATTRIBUTION);

  return {
    indicator: known.key,
    label: known.label,
    unit: known.unit,
    results,
    attribution,
  };
}
