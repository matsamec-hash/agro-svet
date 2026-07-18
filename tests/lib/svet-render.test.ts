import { describe, it, expect } from 'vitest';
import { groupByPackage, vsReference, fmtNum, sparklinePath, compareMatrix, COUNTRY_LOCATIVE, PACKAGE_ORDER, PACKAGE_LABELS, normalizeValue, normApplies } from '../../src/lib/svet/render';

const ind = (key: string, pkg: any, value: number) => ({
  key, label: key, pkg, unit: 't/ha',
  latest: { value, unit: 't/ha', referencePeriod: '2025', source: 'Eurostat', sourceUrl: 'x', fetchedAt: '2026-06-19' },
  series: [{ period: '2024', value: value - 0.5 }, { period: '2025', value }],
});
const profile = (slug: string, inds: Record<string, any>) => ({ slug, geo: 'DE', nameCs: 'Německo', flag: '🇩🇪', generated: '2026-06-19', indicators: inds });

describe('groupByPackage', () => {
  it('seskupí indikátory do balíčků v pevném pořadí', () => {
    const p = profile('de', { wheat_yield: ind('wheat_yield', 'produkce', 7.8), ag_land: ind('ag_land', 'puda', 16.6) });
    const groups = groupByPackage(p as any);
    expect(groups.map((g) => g.pkg)).toEqual(['produkce', 'puda']);
    expect(groups[0].label).toBe(PACKAGE_LABELS.produkce);
    expect(groups[0].indicators[0].key).toBe('wheat_yield');
  });
  it('vynechá prázdné balíčky a respektuje PACKAGE_ORDER', () => {
    expect(PACKAGE_ORDER).toEqual(['produkce', 'puda', 'ekonomika', 'obchod']);
  });
});

describe('vsReference', () => {
  it('spočítá % rozdíl a směr', () => {
    expect(vsReference(7.8, 6.1)).toEqual({ pct: 28, dir: 'up' });
    expect(vsReference(6.1, 6.1)).toEqual({ pct: 0, dir: 'same' });
    expect(vsReference(5.0, 6.1)).toEqual({ pct: -18, dir: 'down' });
  });
  it('null když reference chybí/0', () => {
    expect(vsReference(7.8, 0)).toBeNull();
    expect(vsReference(7.8, undefined as any)).toBeNull();
  });
});

describe('fmtNum', () => {
  it('formátuje česky s mezerou tisíců a desetinnou čárkou', () => {
    expect(fmtNum(1234.5)).toBe('1 234,5');
    expect(fmtNum(7.83)).toBe('7,83');
    expect(fmtNum(255010)).toBe('255 010');
  });
});

describe('normalizeValue', () => {
  it('perCapita: přepočte na 1000 obyvatel se správnou jednotkou', () => {
    // 1000 (1000 ks) → 1 000 000 ks / 1 000 000 obyv × 1000 = 1000 ks/1000 obyv.
    expect(normalizeValue('cattle_count', 1000, 'perCapita', 1_000_000)).toEqual({ value: 1000, unit: 'ks / 1000 obyv.' });
  });
  it('perHa: dělí zemědělskou plochou (hustota)', () => {
    // 1000 (1000 ks) → 1 000 000 ks / (2 mil. ha) = 0,5 ks/ha
    expect(normalizeValue('cattle_count', 1000, 'perHa', 1_000_000, 2)).toEqual({ value: 0.5, unit: 'ks / ha' });
  });
  it('hodnota produkce perCapita používá měřítko mld €', () => {
    // 5 (mld €) → 5e9 € / 10e6 obyv × 1000 = 500 000 € / 1000 obyv.
    expect(normalizeValue('ag_output_value', 5, 'perCapita', 10_000_000)).toEqual({ value: 500000, unit: '€ / 1000 obyv.' });
  });
  it('null pro absolute, poměrové ukazatele a nepoužitelné kombinace', () => {
    expect(normalizeValue('cattle_count', 1000, 'absolute', 1_000_000)).toBeNull();
    expect(normalizeValue('wheat_yield', 7.8, 'perCapita', 1_000_000)).toBeNull();
    expect(normalizeValue('ag_land', 3.5, 'perHa', 1_000_000, 3.5)).toBeNull();
    expect(normalizeValue('cattle_count', 1000, 'perCapita', 0)).toBeNull();
    expect(normalizeValue('cattle_count', null, 'perCapita', 1_000_000)).toBeNull();
  });
});

describe('normApplies', () => {
  it('absolute vždy; perCapita u 6 absolutních; perHa jen u hustotních', () => {
    expect(normApplies('wheat_yield', 'absolute')).toBe(true);
    expect(normApplies('cattle_count', 'perCapita')).toBe(true);
    expect(normApplies('cattle_count', 'perHa')).toBe(true);
    expect(normApplies('ag_land', 'perHa')).toBe(false);
    expect(normApplies('farm_count', 'perHa')).toBe(false);
    expect(normApplies('farm_count', 'perCapita')).toBe(true);
    expect(normApplies('wheat_yield', 'perCapita')).toBe(false);
  });
});

describe('sparklinePath', () => {
  it('SVG path má M + (n-1)×L', () => {
    const d = sparklinePath([{ period: '2023', value: 1 }, { period: '2024', value: 2 }, { period: '2025', value: 3 }], 100, 30);
    expect(d.startsWith('M')).toBe(true);
    expect((d.match(/L/g) || []).length).toBe(2);
  });
  it('okrajové případy', () => {
    expect(sparklinePath([], 100, 30)).toBe('');
    expect(sparklinePath([{ period: '2025', value: 5 }], 100, 30)).toMatch(/^M/);
  });
});

describe('compareMatrix', () => {
  it('buňka per profil, null když ukazatel chybí', () => {
    const a = profile('cesko', { wheat_yield: ind('wheat_yield', 'produkce', 6.1) });
    const b = profile('nemecko', {});
    const m = compareMatrix([a, b] as any, 'wheat_yield');
    expect(m[0].value).toBe(6.1);
    expect(m[1].value).toBeNull();
    expect(m[0].slug).toBe('cesko');
  });
});

describe('COUNTRY_LOCATIVE', () => {
  it('obsahuje fázi 1 slugy (lokativ pro nadpis)', () => {
    for (const s of ['nemecko', 'francie', 'velka-britanie']) expect(COUNTRY_LOCATIVE[s]).toBeTruthy();
  });
});
