import { describe, it, expect } from 'vitest';
import { INDICATORS } from '../../scripts/lib/svet/indicators.mjs';

describe('INDICATORS', () => {
  it('má unikátní keys a povinná pole', () => {
    const seen = new Set();
    for (const i of INDICATORS) {
      expect(i.key).toBeTruthy();
      expect(i.label).toBeTruthy();
      expect(['produkce', 'puda', 'ekonomika', 'obchod']).toContain(i.pkg);
      expect(i.unit).toBeTruthy();
      expect(['eurostat', 'worldbank']).toContain(i.spec.source);
      expect(seen.has(i.key)).toBe(false);
      seen.add(i.key);
    }
  });
  it('eurostat indikátor má dataset a filtry bez geo (geo se doplní za běhu)', () => {
    const wy = INDICATORS.find((i) => i.key === 'wheat_yield');
    expect(wy.spec.source).toBe('eurostat');
    expect(wy.spec.dataset).toBe('apro_cpsh1');
    expect(wy.spec.filters.geo).toBeUndefined();
  });
  it('worldbank indikátor má indicator kód bez country', () => {
    const al = INDICATORS.find((i) => i.key === 'ag_land');
    expect(al.spec.source).toBe('worldbank');
    expect(al.spec.indicator).toBe('AG.LND.AGRI.K2');
  });
  it('balíček produkce obsahuje nové plodiny', () => {
    const keys = INDICATORS.map((i) => i.key);
    for (const k of ['maize_yield', 'barley_yield', 'rapeseed_yield', 'cereal_yield']) {
      expect(keys).toContain(k);
      expect(INDICATORS.find((i) => i.key === k).pkg).toBe('produkce');
    }
    expect(INDICATORS.find((i) => i.key === 'cereal_yield').spec.source).toBe('worldbank');
  });
  it('balíček World Bank ukazatelů', () => {
    const keys = INDICATORS.map((i) => i.key);
    for (const k of ['arable_land', 'ag_value_added_gdp', 'ag_employment', 'fert_use']) expect(keys).toContain(k);
  });
  it('ekonomika: hodnota zemědělské produkce (aact_eaa01)', () => {
    const ind = INDICATORS.find((i) => i.key === 'ag_output_value');
    expect(ind).toBeTruthy();
    expect(ind.pkg).toBe('ekonomika');
    expect(ind.unit).toBe('mld €');
    expect(ind.spec.source).toBe('eurostat');
    expect(ind.spec.dataset).toBe('aact_eaa01');
    for (const dim of ['freq', 'am_item', 'indic_agr', 'unit']) expect(ind.spec.filters[dim]).toBeTruthy();
    expect(ind.spec.filters.geo).toBeUndefined();
  });
  it('struktura farem: počet hospodářství (ef_m_farmleg)', () => {
    const ind = INDICATORS.find((i) => i.key === 'farm_count');
    expect(ind).toBeTruthy();
    expect(ind.pkg).toBe('puda');
    expect(ind.unit).toBe('1000 farem');
    expect(ind.spec.source).toBe('eurostat');
    expect(ind.spec.dataset).toBe('ef_m_farmleg');
    for (const dim of ['freq', 'statinfo', 'leg_form', 'farmtype', 'so_eur', 'uaarea', 'unit']) {
      expect(ind.spec.filters[dim]).toBeTruthy();
    }
    expect(ind.spec.filters.geo).toBeUndefined();
  });
  it('struktura farem: podíl eko plochy (sdg_02_40)', () => {
    const ind = INDICATORS.find((i) => i.key === 'organic_share');
    expect(ind).toBeTruthy();
    expect(ind.pkg).toBe('puda');
    expect(ind.unit).toBe('%');
    expect(ind.spec.source).toBe('eurostat');
    expect(ind.spec.dataset).toBe('sdg_02_40');
    for (const dim of ['freq', 'unit', 'crops', 'agprdmet']) expect(ind.spec.filters[dim]).toBeTruthy();
    expect(ind.spec.filters.geo).toBeUndefined();
  });
  it('živočišná výroba: skot a prasata v balíčku produkce', () => {
    for (const k of ['cattle_count', 'pigs_count']) {
      const ind = INDICATORS.find((i) => i.key === k);
      expect(ind).toBeTruthy();
      expect(ind.pkg).toBe('produkce');
      expect(ind.spec.source).toBe('eurostat');
      // všechny non-time dimenze musí být napevno (jinak pickSeries vrátí prázdno)
      for (const dim of ['freq', 'animals', 'month', 'unit']) expect(ind.spec.filters[dim]).toBeTruthy();
      expect(ind.spec.filters.geo).toBeUndefined();
    }
    expect(INDICATORS.find((i) => i.key === 'cattle_count').spec.dataset).toBe('apro_mt_lscatl');
    expect(INDICATORS.find((i) => i.key === 'pigs_count').spec.dataset).toBe('apro_mt_lspig');
  });
});
