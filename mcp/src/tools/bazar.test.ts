import { describe, it, expect } from "vitest";
import {
  searchBazar,
  BAZAR_PUBLIC_COLUMNS,
  DEFAULT_LIMIT,
  MAX_LIMIT,
  type BazarListingRow,
} from "./bazar.js";

const rows: BazarListingRow[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    title: "Zetor Proxima 90",
    description: "Pěkný traktor,  málo motohodin.",
    price: 450000,
    category: "traktory",
    subcategory: "kolove-traktory",
    brand: "Zetor",
    location: "Jihomoravský kraj",
    year_of_manufacture: 2015,
    power_hp: 90,
    hours_operated: 3200,
    featured: true,
    created_at: "2026-07-01T10:00:00Z",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    title: "Pluh Lemken 4-radličný",
    description: "Zachovalý pluh.",
    price: 85000,
    category: "orebni-technika",
    subcategory: "pluhy",
    brand: "Lemken",
    location: "Olomoucký kraj",
    year_of_manufacture: 2010,
    power_hp: null,
    featured: false,
    created_at: "2026-07-15T10:00:00Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    title: "John Deere 6155R",
    description: null,
    price: 1290000,
    category: "traktory",
    subcategory: "kolove-traktory",
    brand: "John Deere",
    location: "Jihomoravský kraj",
    year_of_manufacture: 2019,
    power_hp: 155,
    featured: false,
    created_at: "2026-07-20T10:00:00Z",
  },
];

describe("searchBazar", () => {
  it("returns all rows featured-first then newest-first with no filters", () => {
    const r = searchBazar(rows, {});
    expect(r.total).toBe(3);
    // featured Zetor first, then newest (John Deere 07-20) before Lemken (07-15)
    expect(r.results.map((x) => x.brand)).toEqual([
      "Zetor",
      "John Deere",
      "Lemken",
    ]);
  });

  it("filters by free-text query across title/description/brand", () => {
    expect(searchBazar(rows, { query: "lemken" }).total).toBe(1);
    expect(searchBazar(rows, { query: "traktor" }).total).toBe(1); // description of Zetor
    expect(searchBazar(rows, { query: "nonexistent" }).total).toBe(0);
  });

  it("filters by category and brand substrings (case-insensitive)", () => {
    expect(searchBazar(rows, { category: "TRAKTORY" }).total).toBe(2);
    expect(searchBazar(rows, { brand: "deere" }).total).toBe(1);
  });

  it("filters by price range, excluding null prices when a bound is set", () => {
    const r = searchBazar(rows, { price_max: 100000 });
    expect(r.results.map((x) => x.brand)).toEqual(["Lemken"]);
  });

  it("filters by power range, excluding rows with null power", () => {
    const r = searchBazar(rows, { power_min: 100 });
    expect(r.results.map((x) => x.brand)).toEqual(["John Deere"]);
    // Lemken (null power) must be excluded even though no upper bound
    expect(r.total).toBe(1);
  });

  it("filters by year_from and region", () => {
    expect(searchBazar(rows, { year_from: 2016 }).total).toBe(1); // JD 2019
    expect(searchBazar(rows, { region: "jihomoravský" }).total).toBe(2);
  });

  it("caps and defaults the limit", () => {
    expect(searchBazar(rows, { limit: 1 }).results).toHaveLength(1);
    expect(searchBazar(rows, { limit: 999 }).limit).toBe(MAX_LIMIT);
    expect(searchBazar(rows, { limit: 0 }).limit).toBe(1);
    expect(searchBazar(rows, {}).limit).toBe(DEFAULT_LIMIT);
    // total still reflects all matches, not the page size
    expect(searchBazar(rows, { limit: 1 }).total).toBe(3);
  });

  it("maps to the safe public shape with URL, currency and excerpt", () => {
    const hit = searchBazar(rows, { brand: "zetor" }).results[0];
    expect(hit.url).toBe(
      "https://agro-svet.cz/bazar/11111111-1111-1111-1111-111111111111",
    );
    expect(hit.currency).toBe("CZK");
    expect(hit.excerpt).toBe("Pěkný traktor, málo motohodin."); // whitespace collapsed
    // no PII keys leak through the mapper
    expect(Object.keys(hit)).not.toContain("phone");
    expect(Object.keys(hit)).not.toContain("email");
    expect(Object.keys(hit)).not.toContain("user_id");
  });

  it("reports null currency when price is missing", () => {
    const noPrice = searchBazar([{ ...rows[0], price: null }], {}).results[0];
    expect(noPrice.price).toBeNull();
    expect(noPrice.currency).toBeNull();
  });

  it("keeps the public column whitelist free of PII", () => {
    for (const forbidden of ["phone", "email", "user_id", "status"]) {
      expect(BAZAR_PUBLIC_COLUMNS as readonly string[]).not.toContain(forbidden);
    }
  });
});
