import { describe, it, expect } from 'vitest';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import cs from '../../src/i18n/ui/cs';
import sk from '../../src/i18n/ui/sk';
import uk from '../../src/i18n/ui/uk';

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

  it('každý howto.* klíč v cs má protějšek v uk (fáze 3)', () => {
    for (const k of howtoKeys(cs)) expect(uk[k], `chybí uk ${k}`).toBeTruthy();
  });
});

// Fáze 3: UK overlay kolekce howto-uk. 2 jurisdikční návody (registrace-vcelaru,
// jak-naplanovat-dotaci-na-techniku) jsou ZÁMĚRNĚ vyřazené (UK jurisdikční fáze).
const EXCLUDED_UK = ['registrace-vcelaru', 'jak-naplanovat-dotaci-na-techniku'];
const slugs = (dir: string) =>
  readdirSync(join(process.cwd(), 'src/content', dir))
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
    .sort();

describe('howto-uk content parita (fáze 3)', () => {
  it('howto-uk = howto mínus 2 jurisdikční návody', () => {
    const csSlugs = slugs('howto');
    const ukSlugs = slugs('howto-uk');
    const expected = csSlugs.filter((s) => !EXCLUDED_UK.includes(s)).sort();
    expect(ukSlugs).toEqual(expected);
  });

  it('vyřazené jurisdikční návody NEjsou v howto-uk', () => {
    const ukSlugs = slugs('howto-uk');
    for (const ex of EXCLUDED_UK) expect(ukSlugs).not.toContain(ex);
  });

  it('všech 10 uk slugů má protějšek v cs (žádný osiřelý)', () => {
    const csSlugs = new Set(slugs('howto'));
    for (const s of slugs('howto-uk')) expect(csSlugs.has(s)).toBe(true);
  });
});
