import { describe, it, expect } from "vitest";
import {
  buildModelFilterExpr,
  parseSelectedModelSlugs,
} from "./bazar-model-filter";

describe("buildModelFilterExpr", () => {
  it("returns empty string when nothing selected", () => {
    expect(buildModelFilterExpr([])).toBe("");
  });

  it("builds model_slug.in + title.ilike for a single model", () => {
    expect(buildModelFilterExpr([{ slug: "5090r", name: "5090R" }])).toBe(
      "model_slug.in.(5090r),title.ilike.*5090R*",
    );
  });

  it("groups multiple models into one in() and one title.ilike each", () => {
    const expr = buildModelFilterExpr([
      { slug: "5090r", name: "5090R" },
      { slug: "5100r", name: "5100R" },
      { slug: "5115r", name: "5115R" },
    ]);
    expect(expr).toBe(
      "model_slug.in.(5090r,5100r,5115r),title.ilike.*5090R*,title.ilike.*5100R*,title.ilike.*5115R*",
    );
  });

  it("skips names with .or() delimiters (still matches on model_slug)", () => {
    const expr = buildModelFilterExpr([
      { slug: "t7-270", name: "T7.270 (AutoCommand)" },
    ]);
    expect(expr).toBe("model_slug.in.(t7-270)"); // name unsafe → no title.ilike
  });

  it("dedupes repeated slugs and names", () => {
    const expr = buildModelFilterExpr([
      { slug: "5090r", name: "5090R" },
      { slug: "5090r", name: "5090R" },
    ]);
    expect(expr).toBe("model_slug.in.(5090r),title.ilike.*5090R*");
  });

  it("handles missing/null names by matching model_slug only", () => {
    expect(buildModelFilterExpr([{ slug: "abc", name: null }])).toBe(
      "model_slug.in.(abc)",
    );
    expect(buildModelFilterExpr([{ slug: "abc" }])).toBe("model_slug.in.(abc)");
  });
});

describe("parseSelectedModelSlugs", () => {
  it("trims, drops empties and dedupes", () => {
    expect(
      parseSelectedModelSlugs(["5090r", " 5100r ", "", "5090r"]),
    ).toEqual(["5090r", "5100r"]);
  });

  it("returns empty array for no values", () => {
    expect(parseSelectedModelSlugs([])).toEqual([]);
  });
});
