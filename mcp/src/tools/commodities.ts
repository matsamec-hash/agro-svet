/**
 * Pure query logic for commodity price series.
 */
import type { CommoditiesFile, CommodityPoint } from "../data.js";

export interface CommodityQueryArgs {
  commodity: string;
  /** Inclusive lower bound, year "YYYY" or month label "Led 2020". */
  from?: string;
  /** Inclusive upper bound, year "YYYY" or month label "Bře 2026". */
  to?: string;
}

export interface CommodityResult {
  commodity: string;
  unit: string;
  pointCount: number;
  range: { from: string | null; to: string | null };
  data: CommodityPoint[];
  fiveYearAvg: { label: string; avg: number }[] | null;
}

/** Extract a 4-digit year from a label/bound, or null. */
function yearOf(s: string): number | null {
  const m = s.match(/(\d{4})/);
  return m ? Number(m[1]) : null;
}

/**
 * Filter a commodity's monthly series to an (optional) inclusive year range.
 * Bounds may be a bare year ("2020") or a full month label; only the year
 * component is used for filtering, which keeps the API forgiving.
 */
export function getCommodityPrices(
  file: CommoditiesFile,
  args: CommodityQueryArgs,
): CommodityResult {
  const target = args.commodity.trim().toLowerCase();
  const commodity =
    file.commodityFull.find((c) => c.name.toLowerCase() === target) ??
    file.commodityFull.find((c) => c.name.toLowerCase().includes(target));

  if (!commodity) {
    const valid = file.commodityFull.map((c) => c.name).join(", ");
    throw new Error(
      `Unknown commodity "${args.commodity}". Valid commodities: ${valid}.`,
    );
  }

  const fromYear = args.from ? yearOf(args.from) : null;
  const toYear = args.to ? yearOf(args.to) : null;

  const data = commodity.data.filter((p) => {
    const y = yearOf(p.label);
    if (y === null) return true;
    if (fromYear !== null && y < fromYear) return false;
    if (toYear !== null && y > toYear) return false;
    return true;
  });

  return {
    commodity: commodity.name,
    unit: commodity.unit,
    pointCount: data.length,
    range: {
      from: data.length ? data[0].label : null,
      to: data.length ? data[data.length - 1].label : null,
    },
    data,
    fiveYearAvg: file.fiveYearAvgs[commodity.name] ?? null,
  };
}

export function listCommodityNames(file: CommoditiesFile): string[] {
  return file.commodityFull.map((c) => c.name);
}
