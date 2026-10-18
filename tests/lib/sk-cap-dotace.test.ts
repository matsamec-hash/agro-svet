import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  calculateCapSk, formatEur, SAZBY_SK, VCS_SEKTORY_SK, ROK_SAZIEB_SK, ZDROJE_SK, SADZBY_SK_2026_CIASTOCNE,
} from '../../src/lib/sk-cap-dotace';

const base = { totalHa: 0, chvuHa: 0, mladyPolnohospodar: false, vcsHa: {} as Record<string, number> };

describe('sadzby SK — PPA, Sadzby priamych platieb pre rok 2025 (24. 2. 2026)', () => {
  it('rok a zdroj', () => {
    expect(ROK_SAZIEB_SK).toBe(2025);
    expect(ZDROJE_SK.sadzby.url).toBe('https://www.apa.sk/priame-podpory/sadzby');
  });

  it('plošné sadzby a limity podľa NV 436/2022', () => {
    expect(SAZBY_SK.biss).toBe(105.05);
    expect(SAZBY_SK.crissTier1).toBe(79.70);
    expect(SAZBY_SK.crissTier2).toBe(38.00);
    expect(SAZBY_SK.crissTier1MaxHa).toBe(100.99);
    expect(SAZBY_SK.crissTier2MaxHa).toBe(150.99);
    expect(SAZBY_SK.ekoChvu).toBe(93.15);
    expect(SAZBY_SK.ekoMimoChvu).toBe(58.06);
    expect(SAZBY_SK.mlady).toBe(108.89);
    expect(SAZBY_SK.mladyMaxHa).toBe(100);
  });

  it('viazané platby na plochu', () => {
    const map = Object.fromEntries(VCS_SEKTORY_SK.map((s) => [s.slug, s.sazba]));
    expect(map).toEqual({
      'cukrova-repa': 565.00,
      bielkoviny: 75.77,
      chmel: 880.00,
      ovocie: 531.92,
      'zelenina-pracna': 490.00,
      'zelenina-vysoko-pracna': 688.00,
    });
  });

  it('čiastočne zverejnené sadzby 2026', () => {
    expect(SADZBY_SK_2026_CIASTOCNE).toEqual({ biss: 117.31, crissTier1: 87.80, crissTier2: 43.50 });
  });

  it('staré sadzby 2024 a strop 28 ha sa nevracajú', () => {
    const src = fs.readFileSync(path.resolve(__dirname, '../../src/lib/sk-cap-dotace.ts'), 'utf8');
    for (const old of ['103.80', '110.45', '60.36', '88.15', '477.80', '69.90', '554.35', 'mladyMaxHa: 28']) {
      expect(src).not.toContain(old);
    }
    const comp = fs.readFileSync(path.resolve(__dirname, '../../src/components/calc/DotaceCapSk.astro'), 'utf8');
    expect(comp).not.toMatch(/Excel(u)? PPA pre rok 2024|SPP 2024/);
  });
});

describe('calculateCapSk', () => {
  it('prázdný výsledek pro totalHa <= 0', () => {
    const r = calculateCapSk({ ...base, totalHa: 0 });
    expect(r.items).toEqual([]);
    expect(r.total).toBe(0);
    expect(r.perHa).toBe(0);
  });

  it('pod 1 ha žádné platby', () => {
    const r = calculateCapSk({ ...base, totalHa: 0.5 });
    expect(r.items).toEqual([]);
    expect(r.warnings.join(' ')).toMatch(/1 ha/);
  });

  it('BISS + CRISS tier1 + eko mimo chráněného území pro 50 ha', () => {
    const r = calculateCapSk({ ...base, totalHa: 50 });
    // biss 50*105.05=5252.50; criss 50*79.70=3985; eko 50*58.06=2903
    expect(r.total).toBeCloseTo(12140.5, 2);
    expect(r.perHa).toBeCloseTo(242.81, 2);
  });

  it('CRISS dvoustupňová nad 100,99 ha (120 ha)', () => {
    const r = calculateCapSk({ ...base, totalHa: 120 });
    const criss = r.items.find((i) => i.key === 'criss')!;
    // tier1 100.99*79.70=8048.903 ; tier2 (120-100.99)*38=722.38
    expect(criss.amount).toBeCloseTo(8771.283, 3);
  });

  it('CRISS strop 150,99 ha (200 ha → tier2 jen do 150,99)', () => {
    const r = calculateCapSk({ ...base, totalHa: 200 });
    const criss = r.items.find((i) => i.key === 'criss')!;
    // tier1 8048.903 ; tier2 (150.99-100.99)*38=1900
    expect(criss.amount).toBeCloseTo(9948.903, 3);
    expect(criss.ha).toBeCloseTo(150.99, 6);
  });

  it('ekoschéma: orná půda v chráněném území vyšší sazbou, zbytek nižší', () => {
    const r = calculateCapSk({ ...base, totalHa: 10, chvuHa: 4 });
    const eko = r.items.find((i) => i.key === 'eko')!;
    // 4*93.15 + 6*58.06 = 372.60 + 348.36 = 720.96
    expect(eko.amount).toBeCloseTo(720.96, 2);
  });

  it('chvuHa se ořízne na totalHa', () => {
    const r = calculateCapSk({ ...base, totalHa: 5, chvuHa: 20 });
    const eko = r.items.find((i) => i.key === 'eko')!;
    expect(eko.amount).toBeCloseTo(5 * SAZBY_SK.ekoChvu, 2);
  });

  it('mladý poľnohospodár max 100 ha', () => {
    const r = calculateCapSk({ ...base, totalHa: 140, mladyPolnohospodar: true });
    const m = r.items.find((i) => i.key === 'mlady')!;
    expect(m.ha).toBe(100);
    expect(m.amount).toBeCloseTo(100 * 108.89, 2);
  });

  it('upozornění na snížení BISS nad 60 000 €', () => {
    expect(calculateCapSk({ ...base, totalHa: 500 }).warnings).toEqual([]);
    expect(calculateCapSk({ ...base, totalHa: 600 }).warnings.join(' ')).toMatch(/60 000/);
  });

  it('VCS sektor se počítá a ořízne na totalHa', () => {
    const r = calculateCapSk({ ...base, totalHa: 5, vcsHa: { 'cukrova-repa': 8 } });
    const v = r.items.find((i) => i.key === 'vcs-cukrova-repa')!;
    expect(v.amount).toBeCloseTo(5 * 565, 2);
  });

  it('neznámý VCS slug se ignoruje', () => {
    const r = calculateCapSk({ ...base, totalHa: 10, vcsHa: { neexistuje: 5 } });
    expect(r.items.some((i) => i.key.startsWith('vcs-'))).toBe(false);
  });
});

describe('formatEur', () => {
  it('formátuje s eurem a bez desetin', () => {
    expect(formatEur(1234)).toMatch(/€/);
    expect(formatEur(1234)).not.toMatch(/[.,]\d/);
  });
});
