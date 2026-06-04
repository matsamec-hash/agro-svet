import { describe, it, expect } from 'vitest';
import cs from '../../src/i18n/ui/cs';
import sk from '../../src/i18n/ui/sk';

const statKeys = (d: Record<string, string>) => Object.keys(d).filter(k => k.startsWith('stat.'));

describe('stat.* i18n parity', () => {
  it('každý stat.* klíč v cs má protějšek v sk', () => {
    for (const k of statKeys(cs)) expect(sk[k], `chybí sk ${k}`).toBeTruthy();
  });

  it('žádný sk stat.* string nemá CZ-only ř/ě/ů', () => {
    for (const k of statKeys(sk)) expect(sk[k], `CZ kontaminace ${k}: ${sk[k]}`).not.toMatch(/[řěů]/);
  });
});
