import { describe, it, expect } from "vitest";
import {
  findCategory,
  findBrand,
  categoryIntro,
  categoryTitle,
  categoryBrandTitle,
  categoryDescription,
  categoryBrandDescription,
} from "./bazar-landing";
import { CATEGORIES, BRANDS } from "./bazar-constants";

describe("findCategory / findBrand", () => {
  it("resolves known slugs to their entry", () => {
    expect(findCategory("traktory")?.label).toBe("Traktory");
    expect(findBrand("zetor")?.label).toBe("Zetor");
  });

  it("returns undefined for unknown or empty slugs", () => {
    expect(findCategory("does-not-exist")).toBeUndefined();
    expect(findCategory(undefined)).toBeUndefined();
    expect(findBrand("")).toBeUndefined();
    expect(findBrand(undefined)).toBeUndefined();
  });
});

describe("categoryIntro", () => {
  it("returns bespoke copy for a high-value category", () => {
    const intro = categoryIntro(findCategory("traktory")!);
    expect(intro.toLowerCase()).toContain("traktor");
    expect(intro.length).toBeGreaterThan(80); // not thin
  });

  it("falls back to a non-thin templated intro for any category", () => {
    // 'sluzby' has no bespoke entry -> template path
    const intro = categoryIntro(findCategory("sluzby")!);
    expect(intro.toLowerCase()).toContain("služby");
    expect(intro.length).toBeGreaterThan(80);
  });

  it("has a non-empty intro for every configured category", () => {
    for (const c of CATEGORIES) {
      expect(categoryIntro(c).length).toBeGreaterThan(60);
    }
  });
});

describe("titles and descriptions", () => {
  it("builds a category title containing the label", () => {
    expect(categoryTitle(findCategory("kombajny")!)).toContain("Kombajny");
  });

  it("builds a natural category×brand title (brand + lowercased category)", () => {
    const t = categoryBrandTitle(findCategory("traktory")!, findBrand("zetor")!);
    expect(t).toContain("Zetor");
    expect(t).toContain("traktory");
  });

  it("count-aware category description reflects presence/absence of listings", () => {
    const cat = findCategory("traktory")!;
    expect(categoryDescription(cat, 12)).toContain("12 aktivních inzerátů");
    expect(categoryDescription(cat, 0)).toContain("Inzeráty a nabídky");
  });

  it("count-aware brand description names the brand", () => {
    const d = categoryBrandDescription(
      findCategory("traktory")!,
      findBrand("john-deere")!,
      5,
    );
    expect(d).toContain("John Deere");
    expect(d).toContain("5 inzerátů");
  });

  it("produces a title for every brand without throwing", () => {
    const cat = findCategory("traktory")!;
    for (const b of BRANDS) {
      expect(categoryBrandTitle(cat, b)).toContain(b.label);
    }
  });
});
