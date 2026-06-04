// tests/lib/agro-derived-i18n.test.ts
import { describe, it, expect } from 'vitest';
import { scissorsInsightText, livestockInsightText, statTakeaways } from '../../src/lib/agro-derived';

// ── scissorsInsightText ──────────────────────────────────────────────────────

describe('scissorsInsightText', () => {
  it('cs verbatim — pozitivní marže (margin > 5)', () => {
    expect(scissorsInsightText([{ year: 2024, x: 140, y: 163 }], 'cs'))
      .toBe('V 2024 výstupy 163 vs. vstupy 140 → marže pozitivní (+23 bodů).');
  });

  it('cs verbatim — negativní marže (margin < -5)', () => {
    expect(scissorsInsightText([{ year: 2024, x: 160, y: 130 }], 'cs'))
      .toBe('V 2024 vstupy 160 > výstupy 130 → marže negativní (-30 bodů).');
  });

  it('cs verbatim — neutrální marže (|margin| <= 5)', () => {
    expect(scissorsInsightText([{ year: 2024, x: 100, y: 102 }], 'cs'))
      .toBe('V 2024 vstupy 100, výstupy 102 → marže neutrální.');
  });

  it('cs verbatim — nedostatek dat', () => {
    expect(scissorsInsightText([], 'cs'))
      .toBe('Nedostatek dat pro výpočet cenových nůžek.');
  });

  it('cs verbatim — uses last point when multiple', () => {
    expect(scissorsInsightText([
      { year: 2023, x: 100, y: 100 },
      { year: 2024, x: 140, y: 163 },
    ], 'cs'))
      .toBe('V 2024 výstupy 163 vs. vstupy 140 → marže pozitivní (+23 bodů).');
  });

  it('sk — žádné CZ ř/ě/ů, neprázdné, pozitivní marže', () => {
    const s = scissorsInsightText([{ year: 2024, x: 140, y: 163 }], 'sk');
    expect(s).not.toMatch(/[řěů]/);
    expect(s.length).toBeGreaterThan(10);
  });

  it('sk — žádné CZ ř/ě/ů, neprázdné, nedostatek dat', () => {
    const s = scissorsInsightText([], 'sk');
    expect(s).not.toMatch(/[řěů]/);
    expect(s.length).toBeGreaterThan(5);
  });
});

// ── livestockInsightText ─────────────────────────────────────────────────────

describe('livestockInsightText', () => {
  const historical = [
    { animal: 'Skot', count: 1500000, date: '2015-01-01' },
    { animal: 'Skot', count: 1200000, date: '2024-06-30' },
    { animal: 'Prasata', count: 2000000, date: '2015-01-01' },
  ];

  it('cs verbatim — Skot trend', () => {
    expect(livestockInsightText(historical, 'cs'))
      // drop = (1200000/1500000 - 1)*100 = -20
      .toBe('Stav skotu: 1 500 000 → 1 200 000 ks (-20 %).');
  });

  it('cs verbatim — méně než 2 záznamy', () => {
    expect(livestockInsightText([{ animal: 'Skot', count: 1400000, date: '2024-01-01' }], 'cs'))
      .toBe('Pololetní data ČSÚ — viz graf níže.');
  });

  it('cs verbatim — žádný Skot', () => {
    expect(livestockInsightText([], 'cs'))
      .toBe('Pololetní data ČSÚ — viz graf níže.');
  });

  it('sk — žádné CZ ř/ě/ů, neprázdné', () => {
    const s = livestockInsightText(historical, 'sk');
    expect(s).not.toMatch(/[řěů]/);
    expect(s.length).toBeGreaterThan(10);
  });

  it('sk — fallback bez dat neobsahuje ČSÚ', () => {
    const s = livestockInsightText([], 'sk');
    expect(s).not.toMatch(/ČSÚ/);
    expect(s.length).toBeGreaterThan(5);
  });
});

// ── statTakeaways ────────────────────────────────────────────────────────────

describe('statTakeaways', () => {
  const fertilizers = [
    { name: 'NPK 15-15-15', year: '2019', price: 10000 },
    { name: 'NPK 15-15-15', year: '2024', price: 13500 },
  ];

  // inflPct = (13500/10000 - 1)*100 = 35 → "zužují"

  it('cs verbatim — big change trh insight', () => {
    const commodityStats = [
      { name: 'Vejce', price: 4.5, change: 12.0, unit: 'Kč/ks', month: 'duben 2026', prevYearPrice: 4 },
      { name: 'Pšenice', price: 5200, change: 0.5, unit: 'Kč/t', month: 'duben 2026', prevYearPrice: 5175 },
    ];
    const livestock = [{ animal: 'Skot', count: 1350000, date: '2024-06-30' }];
    const result = statTakeaways({ commodityStats, fertilizers, livestock }, 'cs');
    const trh = result.find(t => t.category === 'trh')!;
    expect(trh.title).toBe('Vejce');
    expect(trh.insight).toBe('+12.0 % r/r. Aktuální cena 4,5 Kč/ks.');
    expect(trh.anchor).toBe('#trh');
  });

  it('cs verbatim — Pšenice fallback (change < 1)', () => {
    const commodityStats = [
      { name: 'Pšenice', price: 5200, change: 0.5, unit: 'Kč/t', month: 'duben 2026', prevYearPrice: 5175 },
    ];
    const livestock = [{ animal: 'Skot', count: 1350000, date: '2024-06-30' }];
    const result = statTakeaways({ commodityStats, fertilizers, livestock }, 'cs');
    const trh = result.find(t => t.category === 'trh')!;
    expect(trh.title).toBe('Pšenice');
    expect(trh.insight).toBe('Aktuální cena 5 200 Kč/t (duben 2026).');
  });

  it('cs verbatim — vstupy insight (inflPct 35 > 30 → zužují)', () => {
    const commodityStats = [
      { name: 'Pšenice', price: 5200, change: 0.5, unit: 'Kč/t', month: 'duben 2026', prevYearPrice: 5175 },
    ];
    const livestock = [{ animal: 'Skot', count: 1350000, date: '2024-06-30' }];
    const result = statTakeaways({ commodityStats, fertilizers, livestock }, 'cs');
    const vstupy = result.find(t => t.category === 'vstupy')!;
    expect(vstupy.title).toBe('NPK 15-15-15');
    expect(vstupy.insight).toBe('Stále +35 % proti roku 2019. Cenové nůžky se zužují.');
    expect(vstupy.anchor).toBe('#vstupy');
  });

  it('cs verbatim — vstupy stabilizují (inflPct <= 30)', () => {
    const fertsLow = [
      { name: 'NPK 15-15-15', year: '2019', price: 10000 },
      { name: 'NPK 15-15-15', year: '2024', price: 12000 },
    ];
    // inflPct = 20
    const commodityStats = [
      { name: 'Pšenice', price: 5200, change: 0.5, unit: 'Kč/t', month: 'duben 2026', prevYearPrice: 5175 },
    ];
    const livestock = [{ animal: 'Skot', count: 1350000, date: '2024-06-30' }];
    const result = statTakeaways({ commodityStats, fertilizers: fertsLow, livestock }, 'cs');
    const vstupy = result.find(t => t.category === 'vstupy')!;
    expect(vstupy.insight).toBe('Stále +20 % proti roku 2019. Cenové nůžky se stabilizují.');
  });

  it('cs verbatim — vstupy fallback (no NPK data)', () => {
    const commodityStats = [
      { name: 'Pšenice', price: 5200, change: 0.5, unit: 'Kč/t', month: 'duben 2026', prevYearPrice: 5175 },
    ];
    const livestock = [{ animal: 'Skot', count: 1350000, date: '2024-06-30' }];
    const result = statTakeaways({ commodityStats, fertilizers: [], livestock }, 'cs');
    const vstupy = result.find(t => t.category === 'vstupy')!;
    expect(vstupy.title).toBe('Hnojiva');
    expect(vstupy.insight).toBe('Aktuální data v sekci Vstupy.');
  });

  it('cs verbatim — zvirata milestone breached', () => {
    const commodityStats = [
      { name: 'Pšenice', price: 5200, change: 0.5, unit: 'Kč/t', month: 'duben 2026', prevYearPrice: 5175 },
    ];
    const livestock = [
      { animal: 'Skot', count: 1500000, date: '2020-01-01' },
      { animal: 'Skot', count: 1280000, date: '2024-01-01' },
    ];
    const result = statTakeaways({ commodityStats, fertilizers: [], livestock }, 'cs');
    const zv = result.find(t => t.category === 'zvirata')!;
    expect(zv.title).toBe('Skot');
    expect(zv.insight).toBe('Stav pod 1.3 M kusů (aktuálně 1.28 M).');
    expect(zv.anchor).toBe('#zvirata');
  });

  it('cs verbatim — zvirata no milestone, skot exists', () => {
    const commodityStats = [
      { name: 'Pšenice', price: 5200, change: 0.5, unit: 'Kč/t', month: 'duben 2026', prevYearPrice: 5175 },
    ];
    const livestock = [{ animal: 'Skot', count: 1350000, date: '2024-06-30' }];
    const result = statTakeaways({ commodityStats, fertilizers: [], livestock }, 'cs');
    const zv = result.find(t => t.category === 'zvirata')!;
    expect(zv.title).toBe('Skot');
    expect(zv.insight).toBe('Aktuálně 1 350 000 ks (2024-06-30).');
  });

  it('cs verbatim — zvirata no skot at all', () => {
    const commodityStats = [
      { name: 'Pšenice', price: 5200, change: 0.5, unit: 'Kč/t', month: 'duben 2026', prevYearPrice: 5175 },
    ];
    const livestock: { animal: string; count: number; date: string }[] = [];
    const result = statTakeaways({ commodityStats, fertilizers: [], livestock }, 'cs');
    const zv = result.find(t => t.category === 'zvirata')!;
    expect(zv.insight).toBe('Pololetní data ČSÚ.');
  });

  it('result has exactly 3 items with correct categories', () => {
    const commodityStats = [
      { name: 'Pšenice', price: 5200, change: 0.5, unit: 'Kč/t', month: 'duben 2026', prevYearPrice: 5175 },
    ];
    const livestock = [{ animal: 'Skot', count: 1350000, date: '2024-06-30' }];
    const result = statTakeaways({ commodityStats, fertilizers: [], livestock }, 'cs');
    expect(result).toHaveLength(3);
    expect(result.map(t => t.category)).toEqual(['trh', 'vstupy', 'zvirata']);
  });

  it('sk — trh big-change insight uses Aktuálna NOT Aktuální', () => {
    const commodityStats = [
      { name: 'Pšenica', price: 270, change: 12.0, unit: 'EUR/t', month: 'apríl 2026', prevYearPrice: 240 },
    ];
    const livestock = [{ animal: 'Skot', count: 1350000, date: '2024-06-30' }];
    const result = statTakeaways({ commodityStats, fertilizers, livestock }, 'sk');
    const trh = result.find(t => t.category === 'trh')!;
    expect(trh.insight).not.toContain('Aktuální');
    expect(trh.insight).toContain('Aktuálna');
    expect(trh.insight).toBe('+12.0 % r/r. Aktuálna cena 270 EUR/t.');
  });

  // sk sanity checks
  it('sk — žádné CZ ř/ě/ů v celém výsledku', () => {
    const commodityStats = [
      { name: 'Pšenica', price: 270, change: 12.0, unit: 'EUR/t', month: 'apríl 2026', prevYearPrice: 240 },
    ];
    const livestock = [{ animal: 'Skot', count: 1350000, date: '2024-06-30' }];
    const result = statTakeaways({ commodityStats, fertilizers, livestock }, 'sk');
    for (const t of result) {
      expect(t.title + ' ' + t.insight).not.toMatch(/[řěů]/);
    }
  });

  it('sk — trh fallback uses Pšenica not Pšenice', () => {
    const commodityStats = [
      { name: 'Pšenica', price: 270, change: 0.5, unit: 'EUR/t', month: 'apríl 2026', prevYearPrice: 268 },
    ];
    const livestock = [{ animal: 'Skot', count: 1350000, date: '2024-06-30' }];
    const result = statTakeaways({ commodityStats, fertilizers: [], livestock }, 'sk');
    const trh = result.find(t => t.category === 'trh')!;
    expect(trh.title).toBe('Pšenica');
    // insight must not contain Czech-only chars
    expect(trh.insight).not.toMatch(/[řěů]/);
  });

  it('sk — zvirata title is Hovädzí dobytok for Skot', () => {
    const commodityStats = [
      { name: 'Pšenica', price: 270, change: 0.5, unit: 'EUR/t', month: 'apríl 2026', prevYearPrice: 268 },
    ];
    const livestock = [
      { animal: 'Skot', count: 1500000, date: '2020-01-01' },
      { animal: 'Skot', count: 1280000, date: '2024-01-01' },
    ];
    const result = statTakeaways({ commodityStats, fertilizers: [], livestock }, 'sk');
    const zv = result.find(t => t.category === 'zvirata')!;
    expect(zv.title).toBe('Hovädzí dobytok');
  });
});
