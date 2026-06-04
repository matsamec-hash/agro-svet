import { describe, it, expect } from 'vitest';
import cs from '../../src/i18n/ui/cs';
import sk from '../../src/i18n/ui/sk';

const pudaKeys = (d: Record<string, string>) => Object.keys(d).filter(k => k.startsWith('puda.'));

describe('puda.* i18n parity', () => {
  it('každý puda.* klíč v cs má protějšek v sk', () => {
    for (const k of pudaKeys(cs)) expect(sk[k], `chybí sk ${k}`).toBeTruthy();
  });
  it('žádný sk puda.* string nemá CZ-only ř/ě/ů', () => {
    for (const k of pudaKeys(sk)) expect(sk[k], `CZ kontaminace ${k}: ${sk[k]}`).not.toMatch(/[řěů]/);
  });
});
