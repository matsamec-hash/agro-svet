import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { buildEurostatUrl, seriesFromJsonStat } from '../../scripts/lib/svet/eurostat.mjs';

describe('buildEurostatUrl', () => {
  it('sestaví URL s geo a filtry', () => {
    const url = buildEurostatUrl('apro_cpsh1', { geo: 'DE', crops: 'C1100', strucpro: 'YLD_HUMD_EU_T_HA' });
    expect(url).toContain('/apro_cpsh1?');
    expect(url).toContain('format=JSON');
    expect(url).toContain('geo=DE');
    expect(url).toContain('crops=C1100');
    expect(url).toContain('strucpro=YLD_HUMD_EU_T_HA');
  });
});

describe('seriesFromJsonStat (reálná fixtura)', () => {
  const json = JSON.parse(readFileSync('tests/fixtures/svet/eurostat-apro_cpsh1.json', 'utf8'));
  it('vytáhne chronologickou řadu pro DE/C1100/YLD_HUMD_EU_T_HA', () => {
    const s = seriesFromJsonStat(json, { freq: 'A', geo: 'DE', crops: 'C1100', strucpro: 'YLD_HUMD_EU_T_HA' });
    expect(s.length).toBeGreaterThan(3);
    expect(s[0].period < s[s.length - 1].period).toBe(true);
    expect(typeof s[0].value).toBe('number');
  });
});
