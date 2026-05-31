import { describe, it, expect } from 'vitest';
import {
  getAllFarms, getFarm, getFarmsByRegion,
  regionsWithEnoughFarms, productCounts, filterFarms,
  FARM_PRODUCTS, FARM_TYPES,
} from '../../src/lib/farmy';

describe('farmy loader', () => {
  it('načte farmy a najde podle slugu', () => {
    const all = getAllFarms();
    expect(all.length).toBeGreaterThanOrEqual(1);
    expect(getFarm(all[0].slug)?.name).toBe(all[0].name);
  });

  it('farmy mají unikátní slugy', () => {
    const slugs = getAllFarms().map((f) => f.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('každá farma má validní region, GPS, popis, eco-flag a aspoň 1 produkt z číselníku', () => {
    for (const f of getAllFarms()) {
      expect(typeof f.lat, `${f.slug} lat`).toBe('number');
      expect(typeof f.lng, `${f.slug} lng`).toBe('number');
      expect(typeof f.eco, `${f.slug} eco`).toBe('boolean');
      expect(f.description.length, `${f.slug} description`).toBeGreaterThan(20);
      expect(f.products.length, `${f.slug} products`).toBeGreaterThan(0);
      for (const p of f.products) expect(FARM_PRODUCTS[p], `${f.slug} product ${p}`).toBeTruthy();
      expect(FARM_TYPES[f.farm_type], `${f.slug} type ${f.farm_type}`).toBeTruthy();
    }
  });

  it('regionsWithEnoughFarms vrací jen kraje s počtem ≥ min (a vyšší práh nevrací víc krajů)', () => {
    for (const r of regionsWithEnoughFarms(1)) {
      expect(r.count).toBeGreaterThanOrEqual(1);
      expect(getFarmsByRegion(r.slug).length).toBe(r.count);
    }
    expect(regionsWithEnoughFarms(99).length).toBeLessThanOrEqual(regionsWithEnoughFarms(1).length);
  });

  it('getFarmsByRegion vrací jen farmy daného kraje', () => {
    const region = getAllFarms()[0].region;
    for (const f of getFarmsByRegion(region)) expect(f.region).toBe(region);
  });

  it('filterFarms filtruje podle produktu, eko a fulltextu', () => {
    const farms = getAllFarms();
    const someProduct = farms[0].products[0];
    const byProduct = filterFarms(farms, { product: someProduct });
    expect(byProduct.length).toBeGreaterThan(0);
    for (const f of byProduct) expect(f.products).toContain(someProduct);
    for (const f of filterFarms(farms, { eco: true })) expect(f.eco).toBe(true);
    for (const f of filterFarms(farms, { eco: false })) expect(f.eco).toBe(false);
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
