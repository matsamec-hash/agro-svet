import { describe, it, expect } from "vitest";
import {
  loadCommodities,
  loadCountries,
  loadVarieties,
  loadBrands,
} from "../data.js";
import { getCommodityPrices, listCommodityNames } from "./commodities.js";
import { compareCountries, listIndicators } from "./countries.js";
import {
  searchCropVarieties,
  listCropSlugs,
  MAX_LIMIT as VAR_MAX,
} from "./varieties.js";
import {
  searchMachinery,
  listMachineryFacets,
  MAX_LIMIT as MACH_MAX,
} from "./machinery.js";

describe("data loaders", () => {
  it("loads all four datasets with real records", () => {
    expect(loadCommodities().commodityFull.length).toBe(9);
    expect(loadCountries().length).toBeGreaterThanOrEqual(30);
    expect(loadVarieties().length).toBeGreaterThan(3000);
    expect(loadBrands().length).toBeGreaterThanOrEqual(20);
  });
});

describe("getCommodityPrices", () => {
  const file = loadCommodities();

  it("returns the wheat series with unit and 5y avg", () => {
    const r = getCommodityPrices(file, { commodity: "Pšenice" });
    expect(r.commodity).toBe("Pšenice");
    expect(r.unit).toBe("Kč/t");
    expect(r.data.length).toBeGreaterThan(100);
    expect(r.data[0].label).toBe("Led 2010");
    expect(r.fiveYearAvg).not.toBeNull();
    expect(r.fiveYearAvg!.length).toBeGreaterThan(0);
  });

  it("is case-insensitive and supports substring match", () => {
    const r = getCommodityPrices(file, { commodity: "pšenice" });
    expect(r.commodity).toBe("Pšenice");
  });

  it("filters to a year range inclusive", () => {
    const r = getCommodityPrices(file, {
      commodity: "Pšenice",
      from: "2015",
      to: "2016",
    });
    expect(r.data.length).toBe(24);
    expect(r.data.every((p) => /201[56]/.test(p.label))).toBe(true);
    expect(r.range.from).toContain("2015");
    expect(r.range.to).toContain("2016");
  });

  it("throws with a list of valid names when unknown", () => {
    expect(() => getCommodityPrices(file, { commodity: "banana" })).toThrow(
      /Valid commodities:.*Pšenice/,
    );
  });

  it("lists all commodity names", () => {
    expect(listCommodityNames(file)).toContain("Mléko");
  });
});

describe("compareCountries", () => {
  const countries = loadCountries();

  it("compares wheat yield across all countries sorted desc", () => {
    const r = compareCountries(countries, { indicator: "wheat_yield" });
    expect(r.indicator).toBe("wheat_yield");
    expect(r.unit).toBe("t/ha");
    expect(r.results.length).toBeGreaterThan(5);
    for (let i = 1; i < r.results.length; i++) {
      expect(r.results[i - 1].value).toBeGreaterThanOrEqual(r.results[i].value);
    }
    const cz = r.results.find((x) => x.slug === "cesko");
    expect(cz).toBeDefined();
    expect(cz!.source).toBeTruthy();
    expect(cz!.sourceUrl).toMatch(/^https?:\/\//);
  });

  it("filters to specific countries", () => {
    const r = compareCountries(countries, {
      indicator: "wheat_yield",
      countries: ["cesko", "nemecko"],
    });
    expect(r.results.length).toBe(2);
    expect(r.results.map((x) => x.slug).sort()).toEqual(["cesko", "nemecko"]);
  });

  it("throws with valid keys on unknown indicator", () => {
    expect(() =>
      compareCountries(countries, { indicator: "nonsense" }),
    ).toThrow(/Valid keys:.*wheat_yield/);
  });

  it("lists indicators with labels", () => {
    const keys = listIndicators(countries).map((i) => i.key);
    expect(keys).toContain("wheat_yield");
    expect(keys).toContain("organic_share");
  });
});

describe("searchCropVarieties", () => {
  const varieties = loadVarieties();

  it("filters by crop slug", () => {
    const r = searchCropVarieties(varieties, { crop: "brambory", limit: 5 });
    expect(r.total).toBeGreaterThan(0);
    expect(r.results.every((v) => v.plodina_slug === "brambory")).toBe(true);
    expect(r.count).toBe(5);
  });

  it("default limit 50 but total reflects all matches", () => {
    const r = searchCropVarieties(varieties, { crop: "brambory" });
    expect(r.limit).toBe(50);
    expect(r.results.length).toBeLessThanOrEqual(50);
    expect(r.total).toBeGreaterThanOrEqual(r.results.length);
  });

  it("caps limit at MAX_LIMIT", () => {
    const r = searchCropVarieties(varieties, { limit: 9999 });
    expect(r.limit).toBe(VAR_MAX);
  });

  it("substring query matches name or udrzovatel, case-insensitive", () => {
    const r = searchCropVarieties(varieties, {
      crop: "brambory",
      query: "accent",
    });
    expect(r.total).toBeGreaterThanOrEqual(1);
    expect(
      r.results.some((v) => v.name.toLowerCase().includes("accent")),
    ).toBe(true);
  });

  it("filters by registration year range", () => {
    const r = searchCropVarieties(varieties, {
      year_from: 2020,
      year_to: 2021,
      limit: 200,
    });
    expect(
      r.results.every(
        (v) =>
          v.rok_registrace != null &&
          v.rok_registrace >= 2020 &&
          v.rok_registrace <= 2021,
      ),
    ).toBe(true);
  });

  it("lists crop slugs", () => {
    expect(listCropSlugs(varieties)).toContain("brambory");
  });
});

describe("searchMachinery", () => {
  const brands = loadBrands();

  it("filters by brand", () => {
    const r = searchMachinery(brands, { brand: "fendt", limit: 5 });
    expect(r.total).toBeGreaterThan(0);
    expect(r.results.every((m) => m.brandSlug === "fendt")).toBe(true);
  });

  it("filters by horsepower range", () => {
    const r = searchMachinery(brands, {
      power_min: 200,
      power_max: 300,
      limit: 200,
    });
    expect(r.total).toBeGreaterThan(0);
    expect(
      r.results.every(
        (m) => m.power_hp != null && m.power_hp >= 200 && m.power_hp <= 300,
      ),
    ).toBe(true);
  });

  it("filters by production year", () => {
    const r = searchMachinery(brands, { brand: "john-deere", year: 1962 });
    expect(r.results.some((m) => m.model === "1010")).toBe(true);
  });

  it("caps limit at MAX_LIMIT", () => {
    const r = searchMachinery(brands, { limit: 9999 });
    expect(r.limit).toBe(MACH_MAX);
    expect(r.results.length).toBeLessThanOrEqual(MACH_MAX);
  });

  it("returns brand/series context per model", () => {
    const r = searchMachinery(brands, { brand: "fendt", limit: 1 });
    const h = r.results[0];
    expect(h.brandName).toBeTruthy();
    expect(h.series).toBeTruthy();
    expect(h.category).toBeTruthy();
  });

  it("lists facets", () => {
    const f = listMachineryFacets(brands);
    expect(f.brands.length).toBeGreaterThanOrEqual(20);
    expect(f.categories.length).toBeGreaterThan(0);
  });
});
