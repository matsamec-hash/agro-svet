import { describe, it, expect } from 'vitest';
import { buildSpayd } from '../../src/lib/spayd';

describe('buildSpayd', () => {
  it('skládá validní SPD 1.0 string', () => {
    const s = buildSpayd({ iban: 'CZ6508000000192000145399', amountCzk: 249, vs: 10000001, message: 'Topovani inzeratu' });
    expect(s.startsWith('SPD*1.0*')).toBe(true);
    expect(s).toContain('ACC:CZ6508000000192000145399');
    expect(s).toContain('AM:249.00');
    expect(s).toContain('CC:CZK');
    expect(s).toContain('X-VS:10000001');
    expect(s).toContain('MSG:Topovani inzeratu');
  });
  it('odstraní diakritiku a hvězdičky z MSG (SPAYD delimiter)', () => {
    const s = buildSpayd({ iban: 'CZ65', amountCzk: 99, vs: 1, message: 'Topování*test' });
    expect(s).toContain('MSG:Topovani test');
    // Valid SPAYD emits 7 '*'-separated fields (SPD,1.0,ACC,AM,CC,X-VS,MSG);
    // the important property is the '*' inside MSG was collapsed (else it'd be 8).
    expect(s.split('*').length).toBe(7);
  });
});
