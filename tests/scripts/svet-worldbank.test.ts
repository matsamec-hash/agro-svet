import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { buildWorldBankUrl, parseWorldBank } from '../../scripts/lib/svet/worldbank.mjs';

describe('buildWorldBankUrl', () => {
  it('sestaví URL country+indicator s json formátem', () => {
    const url = buildWorldBankUrl('DE', 'AG.LND.AGRI.K2');
    expect(url).toContain('/country/DE/indicator/AG.LND.AGRI.K2');
    expect(url).toContain('format=json');
  });
});

describe('parseWorldBank (reálná fixtura)', () => {
  const json = JSON.parse(readFileSync('tests/fixtures/svet/worldbank-agland-de.json', 'utf8'));
  it('vrátí chronologickou řadu {period,value}, vynechá null', () => {
    const s = parseWorldBank(json);
    expect(s.length).toBeGreaterThan(3);
    expect(s[0].period < s[s.length - 1].period).toBe(true);
    expect(typeof s[0].value).toBe('number');
    expect(s.every((p) => p.value != null)).toBe(true);
  });
});
