import { describe, it, expect } from 'vitest';
import { calculateCapSk, formatEur, SAZBY_SK, VCS_SEKTORY_SK } from '../../src/lib/sk-cap-dotace';

const base = { totalHa: 0, chvuHa: 0, mladyPolnohospodar: false, vcsHa: {} as Record<string, number> };

describe('calculateCapSk', () => {
  it('prázdný výsledek pro totalHa <= 0', () => {
    const r = calculateCapSk({ ...base, totalHa: 0 });
    expect(r.items).toEqual([]);
    expect(r.total).toBe(0);
    expect(r.perHa).toBe(0);
  });

  it('BISS + CRISS tier1 + eko mimo CHVÚ pro 50 ha', () => {
    const r = calculateCapSk({ ...base, totalHa: 50 });
    // biss 50*103.80=5190; criss 50*79=3950; eko 50*60.36=3018
    expect(r.total).toBeCloseTo(12158, 2);
    expect(r.perHa).toBeCloseTo(243.16, 2);
  });

  it('CRISS dvoustupňová nad 100,99 ha (120 ha)', () => {
    const r = calculateCapSk({ ...base, totalHa: 120 });
    const criss = r.items.find((i) => i.key === 'criss')!;
    // tier1 100.99*79=7978.21 ; tier2 (120-100.99)*40=760.40 ; součet 8738.61
    expect(criss.amount).toBeCloseTo(8738.61, 2);
  });

  it('CRISS strop 150 ha (200 ha → tier2 jen do 150)', () => {
    const r = calculateCapSk({ ...base, totalHa: 200 });
    const criss = r.items.find((i) => i.key === 'criss')!;
    // tier1 100.99*79=7978.21 ; tier2 (150-100.99)*40=1960.40 ; součet 9938.61
    expect(criss.amount).toBeCloseTo(9938.61, 2);
  });

  it('ekoschéma: plocha v CHVÚ vyšší sazbou, zbytek nižší', () => {
    const r = calculateCapSk({ ...base, totalHa: 10, chvuHa: 4 });
    const eko = r.items.find((i) => i.key === 'eko')!;
    // 4*110.45 + 6*60.36 = 441.80 + 362.16 = 803.96
    expect(eko.amount).toBeCloseTo(803.96, 2);
  });

  it('chvuHa se ořízne na totalHa', () => {
    const r = calculateCapSk({ ...base, totalHa: 5, chvuHa: 20 });
    const eko = r.items.find((i) => i.key === 'eko')!;
    expect(eko.amount).toBeCloseTo(5 * SAZBY_SK.ekoChvu, 2);
  });

  it('mladý poľnohospodár max 28 ha', () => {
    const r = calculateCapSk({ ...base, totalHa: 40, mladyPolnohospodar: true });
    const m = r.items.find((i) => i.key === 'mlady')!;
    expect(m.ha).toBe(28);
    expect(m.amount).toBeCloseTo(28 * SAZBY_SK.mlady, 2);
  });

  it('VCS sektor se počítá a ořízne na totalHa', () => {
    const r = calculateCapSk({ ...base, totalHa: 5, vcsHa: { 'cukrova-repa': 5 } });
    const v = r.items.find((i) => i.key === 'vcs-cukrova-repa')!;
    const sektor = VCS_SEKTORY_SK.find((s) => s.slug === 'cukrova-repa')!;
    expect(v.amount).toBeCloseTo(5 * sektor.sazba, 2);
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
