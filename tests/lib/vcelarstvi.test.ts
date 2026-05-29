import { describe, it, expect } from 'vitest';
import {
  getAllVcely, getVcela,
  getAllVybaveni, getVybaveni,
  getAllMed, getMed,
} from '../../src/lib/vcelarstvi';

describe('vcelarstvi loaders', () => {
  it('načte druhy včel a najde podle slugu', () => {
    const all = getAllVcely();
    expect(all.length).toBeGreaterThan(0);
    const first = all[0];
    expect(getVcela(first.slug)?.name).toBe(first.name);
  });

  it('druhy včel mají unikátní slugy', () => {
    const slugs = getAllVcely().map((v) => v.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('každý druh včely má latinský název a popis', () => {
    for (const v of getAllVcely()) {
      expect(v.latinsky, `${v.slug} latinsky`).toBeTruthy();
      expect(v.description.length, `${v.slug} description`).toBeGreaterThan(20);
    }
  });

  it('vybavení a med se načtou a mají unikátní slugy', () => {
    const vyb = getAllVybaveni().map((x) => x.slug);
    expect(new Set(vyb).size).toBe(vyb.length);
    expect(getAllVybaveni().length).toBeGreaterThan(0);
    const med = getAllMed().map((x) => x.slug);
    expect(new Set(med).size).toBe(med.length);
    expect(getMed(getAllMed()[0].slug)).toBeDefined();
    expect(getVybaveni(getAllVybaveni()[0].slug)).toBeDefined();
  });

  it('related slugy ve vybavení odkazují na existující položky', () => {
    const known = new Set(getAllVybaveni().map((x) => x.slug));
    for (const x of getAllVybaveni()) {
      for (const r of x.related ?? []) {
        expect(known.has(r), `${x.slug} → related ${r}`).toBe(true);
      }
    }
  });
});
