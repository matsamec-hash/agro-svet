import { describe, it, expect } from 'vitest';
import {
  getAllFarms, getFarm, getFarmsByRegion,
  regionsWithEnoughFarms, productCounts, filterFarms,
  FARM_PRODUCTS, FARM_TYPES,
} from '../../src/lib/farmy';

describe('farmy loader', () => {
  it('načte farmy a najde podle slugu', () => {
    const all = getAllFarms();
    expect(all.length).toBeGreaterThanOrEqual(6);
    expect(getFarm(all[0].slug)?.name).toBe(all[0].name);
  });

  it('farmy mají unikátní slugy', () => {
    const slugs = getAllFarms().map((f) => f.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('každá farma má validní region, GPS, popis a aspoň 1 produkt z číselníku', () => {
    for (const f of getAllFarms()) {
      expect(typeof f.lat, `${f.slug} lat`).toBe('number');
      expect(typeof f.lng, `${f.slug} lng`).toBe('number');
      expect(f.description.length, `${f.slug} description`).toBeGreaterThan(20);
      expect(f.products.length, `${f.slug} products`).toBeGreaterThan(0);
      for (const p of f.products) expect(FARM_PRODUCTS[p], `${f.slug} product ${p}`).toBeTruthy();
      expect(FARM_TYPES[f.farm_type], `${f.slug} type ${f.farm_type}`).toBeTruthy();
    }
  });

  it('eco farmy mají eco=true a aspoň jedna farma je eko, jedna neeko', () => {
    const farms = getAllFarms();
    expect(farms.some((f) => f.eco)).toBe(true);
    expect(farms.some((f) => !f.eco)).toBe(true);
  });

  it('aspoň jeden kraj má ≥3 farmy (pro krajský landing)', () => {
    expect(regionsWithEnoughFarms(3).length).toBeGreaterThanOrEqual(1);
  });

  it('getFarmsByRegion vrací jen farmy daného kraje', () => {
    const region = getAllFarms()[0].region;
    for (const f of getFarmsByRegion(region)) expect(f.region).toBe(region);
  });

  it('filterFarms filtruje podle produktu, eko a fulltextu', () => {
    const farms = getAllFarms();
    const withMed = filterFarms(farms, { product: 'med' });
    for (const f of withMed) expect(f.products).toContain('med');
    const ecoOnly = filterFarms(farms, { eco: true });
    for (const f of ecoOnly) expect(f.eco).toBe(true);
    const byName = filterFarms(farms, { q: farms[0].name.slice(0, 4) });
    expect(byName.length).toBeGreaterThan(0);
  });

  it('productCounts sčítá výskyty produktů', () => {
    const counts = productCounts();
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    const expected = getAllFarms().reduce((a, f) => a + f.products.length, 0);
    expect(total).toBe(expected);
  });
});
