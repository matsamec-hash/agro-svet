import { describe, it, expect } from 'vitest';
import raw from '../../src/data/agro-puda-pl.json';
import type { PudaPlData } from '../../src/lib/puda-pl';

const d = raw as unknown as PudaPlData;

describe('agro-puda-pl.json struktura + groundedness', () => {
  it('má povinná top-level pole', () => {
    for (const k of ['generated', 'bigNumbers', 'reformTimeline', 'cena', 'najem', 'plodiny', 'threats', 'sources']) {
      expect(d, k).toHaveProperty(k);
    }
  });
  it('každý bigNumber má source+url', () => {
    expect(d.bigNumbers.length).toBeGreaterThan(0);
    for (const b of d.bigNumbers) {
      expect(b.source, b.lbl).toBeTruthy();
      expect(b.url, b.lbl).toMatch(/^https?:\/\//);
    }
  });
  it('každý reformTimeline krok má source+url', () => {
    expect(d.reformTimeline.length).toBeGreaterThan(0);
    for (const s of d.reformTimeline) {
      expect(s.source, s.title).toBeTruthy();
      expect(s.url, s.title).toMatch(/^https?:\/\//);
    }
  });
  it('cena: pokud má řadu, je validní (≥2 body, vzestupné roky, max>0)', () => {
    if (d.cena.series.length > 0) {
      expect(d.cena.series.length).toBeGreaterThanOrEqual(2);
      expect(d.cena.max).toBeGreaterThan(0);
      expect(d.cena.source).toBeTruthy();
      expect(d.cena.url).toMatch(/^https?:\/\//);
      const years = d.cena.series.map((p) => p.year);
      expect([...years].sort((a, b) => a - b)).toEqual(years);
      for (const p of d.cena.series) expect(p.value).toBeLessThanOrEqual(d.cena.max);
    }
  });
  it('plodiny mají crop+hectares+url', () => {
    for (const c of d.plodiny) {
      expect(c.crop).toBeTruthy();
      expect(c.hectares).toBeGreaterThan(0);
      expect(c.url).toMatch(/^https?:\/\//);
    }
  });
  it('všechny URL jsou http(s) (PL/EU zdroje, žádné cs/uk wiki)', () => {
    const allUrls = [
      ...d.bigNumbers.map((b) => b.url), ...d.reformTimeline.map((s) => s.url),
      ...d.plodiny.map((c) => c.url), ...d.sources.map((s) => s.url),
    ];
    for (const u of allUrls) {
      expect(u).toMatch(/^https?:\/\//);
      expect(u).not.toMatch(/cs\.wikipedia|uk\.wikipedia/);
    }
  });
});
