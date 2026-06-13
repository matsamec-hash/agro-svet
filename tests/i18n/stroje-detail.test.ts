import { describe, it, expect } from 'vitest';
import cs from '../../src/i18n/ui/cs';
import sk from '../../src/i18n/ui/sk';

const detailKeys = (d: Record<string, string>) =>
  Object.keys(d).filter((k) => k.startsWith('cat.s.d.'));

describe('cat.s.d.* i18n parity (detail stroje)', () => {
  it('každý cat.s.d.* klíč v cs má protějšek v sk', () => {
    for (const k of detailKeys(cs)) expect(sk[k], `chybí sk ${k}`).toBeTruthy();
  });

  it('každý cat.s.d.* klíč v sk má protějšek v cs', () => {
    for (const k of detailKeys(sk)) expect(cs[k], `chybí cs ${k}`).toBeTruthy();
  });

  it('množiny klíčů cs a sk jsou shodné', () => {
    expect(detailKeys(sk).sort()).toEqual(detailKeys(cs).sort());
  });
});
