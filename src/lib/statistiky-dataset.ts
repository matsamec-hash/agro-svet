// schema.org/Dataset pro sekci /statistiky/. Cenové řady komodit jsou nejvíc
// „datová sada" z celého webu (měsíční data od 2010 z ČSÚ / Eurostatu / GUS),
// ale doteď se ven hlásily jen jako stránka s grafem — tedy neviditelné pro
// Google Dataset Search a bez formálního důvodu k citaci pro AI.
//
// Klíčové jsou tři pole: `distribution` (stažitelné CSV/JSON), `license`
// (CC BY 4.0 → citace s odkazem je podmínka užití) a `creator` (autorita dat).
import { datasetSchema, type DatasetDistribution, type DatasetSource } from './structured-data';

export type StatsLocale = 'cs' | 'sk' | 'uk' | 'pl';

export interface CommodityDatasetSeries {
  name: string;
  unit: string;
  data: Array<{ label: string }>;
}

const LANG: Record<StatsLocale, string> = { cs: 'cs-CZ', sk: 'sk-SK', uk: 'uk-UA', pl: 'pl-PL' };

// uk je ukrajinská mutace ČESKÝCH dat — spatialCoverage je pořád Česko.
const COUNTRY: Record<StatsLocale, string> = { cs: 'Česko', sk: 'Slovensko', uk: 'Česko', pl: 'Polsko' };

const SOURCES: Record<StatsLocale, DatasetSource[]> = {
  cs: [{ name: 'Český statistický úřad', url: 'https://csu.gov.cz/' }],
  uk: [{ name: 'Český statistický úřad', url: 'https://csu.gov.cz/' }],
  sk: [
    { name: 'Eurostat', url: 'https://ec.europa.eu/eurostat' },
    { name: 'Štatistický úrad SR', url: 'https://slovak.statistics.sk/' },
  ],
  pl: [{ name: 'Główny Urząd Statystyczny', url: 'https://stat.gov.pl/' }],
};

// JSON endpointy existují per locale; CSV zatím jen pro česká data.
const JSON_FEED: Record<StatsLocale, string> = {
  cs: '/statistiky/commodity-data.json',
  uk: '/statistiky/commodity-data.json',
  sk: '/statistiky/commodity-data-sk.json',
  pl: '/statistiky/commodity-data-pl.json',
};

/** Rok = poslední token labelu. Zvládne měsíční („Led 2014") i roční („2015"). */
function yearOf(label: unknown): number | null {
  const token = String(label ?? '').trim().split(/\s+/).pop() ?? '';
  const n = Number(token);
  return Number.isInteger(n) && n > 1900 ? n : null;
}

/** ISO 8601 interval pro Dataset.temporalCoverage, např. '2010/2026'. */
export function temporalCoverageOf(series: CommodityDatasetSeries[]): string | undefined {
  const years = series.flatMap((s) => s.data.map((d) => yearOf(d.label))).filter((y): y is number => y !== null);
  if (years.length === 0) return undefined;
  return `${Math.min(...years)}/${Math.max(...years)}`;
}

function distributionFor(locale: StatsLocale, csvPath?: string): DatasetDistribution[] {
  const out: DatasetDistribution[] = [];
  // CSV dřív než JSON — Dataset Search bere první distribuci jako primární
  // a tabulkové CSV je pro člověka i pro stroj čitelnější než náš chart JSON.
  if (csvPath && (locale === 'cs' || locale === 'uk')) {
    out.push({ url: csvPath, encodingFormat: 'text/csv', name: 'CSV (středník, UTF-8)' });
  }
  out.push({ url: JSON_FEED[locale], encodingFormat: 'application/json', name: 'JSON' });
  return out;
}

export interface CommodityDatasetInput {
  locale: StatsLocale;
  /** Titulek stránky — už lokalizovaný (i18n klíč), nevymýšlíme vlastní. */
  name: string;
  description: string;
  /** Cesta ke stránce včetně locale prefixu, např. /sk/statistiky/. */
  url: string;
  series: CommodityDatasetSeries[];
  /** `generated` z agro-stats.json — kdy byla data naposledy obnovena. */
  dateModified?: string;
  /** Cesta k CSV; bez ní se vydá jen JSON distribuce. */
  csvPath?: string;
  extraKeywords?: string[];
}

export function commodityDataset(input: CommodityDatasetInput) {
  const { locale, series } = input;
  return datasetSchema({
    name: input.name,
    description: input.description,
    url: input.url,
    lang: LANG[locale],
    countryName: COUNTRY[locale],
    keywords: [
      ...series.map((s) => s.name),
      ...(input.extraKeywords ?? []),
    ],
    temporalCoverage: temporalCoverageOf(series),
    dateModified: input.dateModified?.slice(0, 10),
    variables: series.map((s) => ({ name: s.name, unitText: s.unit })),
    sources: SOURCES[locale],
    distribution: distributionFor(locale, input.csvPath),
  });
}
