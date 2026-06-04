import { describe, it, expect } from 'vitest';
import cs from '../../src/i18n/ui/cs';
import sk from '../../src/i18n/ui/sk';

const howtoKeys = (d: Record<string, string>) =>
  Object.keys(d).filter((k) => k.startsWith('howto.'));

describe('howto.* i18n parity (jak na to)', () => {
  it('každý howto.* klíč v cs má protějšek v sk', () => {
    for (const k of howtoKeys(cs)) expect(sk[k], `chybí sk ${k}`).toBeTruthy();
  });

  it('každý howto.* klíč v sk má protějšek v cs', () => {
    for (const k of howtoKeys(sk)) expect(cs[k], `chybí cs ${k}`).toBeTruthy();
  });

  it('množiny klíčů cs a sk jsou shodné', () => {
    expect(howtoKeys(sk).sort()).toEqual(howtoKeys(cs).sort());
  });
});
