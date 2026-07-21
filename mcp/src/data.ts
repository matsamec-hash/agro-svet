/**
 * Data layer: loads & caches agro-svet's public structured datasets from
 * the parent repo's `src/data/` directory.
 *
 * Paths are resolved relative to THIS module (not process.cwd()), so the
 * server works no matter where it is launched from.
 *
 * Layout (this file lives at <repo>/mcp/src/data.ts):
 *   <repo>/src/data/commodities.json
 *   <repo>/src/data/svet/*.json
 *   <repo>/src/data/plodiny/odrudy/*.json
 *   <repo>/src/data/stroje/*.yaml      (top-level cs files only)
 */
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parse as parseYaml } from "yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
// mcp/src -> mcp -> <repo>
const REPO_ROOT = join(__dirname, "..", "..");
const DATA_DIR = join(REPO_ROOT, "src", "data");

// ---------- Types (mirror the real data shapes) ----------

export interface CommodityPoint {
  label: string; // Czech month label e.g. "Led 2010"
  value: number;
  sortKey: number; // monotonically increasing time key
}
export interface Commodity {
  name: string;
  unit: string;
  data: CommodityPoint[];
}
export interface CommoditiesFile {
  generated: string;
  commodityFull: Commodity[];
  /** keyed by commodity name -> [{ label, avg }] */
  fiveYearAvgs: Record<string, { label: string; avg: number }[]>;
}

export interface IndicatorLatest {
  value: number;
  unit: string;
  referencePeriod: string;
  source: string;
  sourceUrl: string;
  fetchedAt: string;
}
export interface Indicator {
  key: string;
  label: string;
  pkg: string;
  unit: string;
  latest: IndicatorLatest;
  series: { period: string; value: number }[];
}
export interface CountryProfile {
  slug: string;
  geo: string;
  nameCs: string;
  flag: string;
  generated: string;
  indicators: Record<string, Indicator>;
}

export interface Variety {
  slug: string;
  name: string;
  plodina_slug: string;
  rok_registrace: number | null;
  udrzovatel: string | null;
  typ: string | null;
  ranost: string | null;
  popis: string | null;
  zdroj_url: string | null;
}

export interface MachineryModel {
  slug: string;
  name: string;
  year_from?: number | null;
  year_to?: number | null;
  power_hp?: number | null;
  power_kw?: number | null;
  engine?: string | null;
}
export interface MachinerySeries {
  slug: string;
  name: string;
  year_from?: number | null;
  year_to?: number | null;
  description?: string;
  models: MachineryModel[];
}
export interface MachineryCategory {
  name: string;
  series: MachinerySeries[];
}
export interface MachineryBrand {
  slug: string;
  name: string;
  country?: string;
  founded?: number | string;
  website?: string;
  categories: Record<string, MachineryCategory>;
}

// ---------- Cached loaders ----------

let _commodities: CommoditiesFile | undefined;
let _countries: CountryProfile[] | undefined;
let _varieties: Variety[] | undefined;
let _brands: MachineryBrand[] | undefined;

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

export function loadCommodities(): CommoditiesFile {
  if (!_commodities) {
    _commodities = readJson<CommoditiesFile>(join(DATA_DIR, "commodities.json"));
  }
  return _commodities;
}

export function loadCountries(): CountryProfile[] {
  if (!_countries) {
    const dir = join(DATA_DIR, "svet");
    const files = readdirSync(dir).filter(
      (f) => f.endsWith(".json") && f !== "index.json",
    );
    // `svet/` also holds non-country JSON (population.json, …). Keep only real
    // country profiles (those with a `nameCs`), else the sort throws.
    _countries = files
      .map((f) => readJson<CountryProfile>(join(dir, f)))
      .filter((c) => c && typeof c.nameCs === "string");
    _countries.sort((a, b) => a.nameCs.localeCompare(b.nameCs, "cs"));
  }
  return _countries;
}

export function loadVarieties(): Variety[] {
  if (!_varieties) {
    const dir = join(DATA_DIR, "plodiny", "odrudy");
    const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
    const all: Variety[] = [];
    for (const f of files) {
      const arr = readJson<Variety[]>(join(dir, f));
      if (Array.isArray(arr)) all.push(...arr);
    }
    _varieties = all;
  }
  return _varieties;
}

export function loadBrands(): MachineryBrand[] {
  if (!_brands) {
    const dir = join(DATA_DIR, "stroje");
    // Only top-level cs *.yaml files (skip sk/ and uk/ subdirs).
    const files = readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isFile() && d.name.endsWith(".yaml"))
      .map((d) => d.name);
    _brands = files.map(
      (f) => parseYaml(readFileSync(join(dir, f), "utf8")) as MachineryBrand,
    );
    _brands.sort((a, b) => a.name.localeCompare(b.name, "cs"));
  }
  return _brands;
}

/** Test helper: clear caches (not used by the server). */
export function _resetCaches(): void {
  _commodities = undefined;
  _countries = undefined;
  _varieties = undefined;
  _brands = undefined;
}
