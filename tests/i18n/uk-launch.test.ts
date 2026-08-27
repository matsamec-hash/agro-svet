import { describe, it, expect } from 'vitest';
import { LAUNCHED_PREFIXES, isLaunchedPath } from '../../src/i18n/utils';
import { isLockedSectionPath } from '../../src/i18n/nav';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('UK fáze 2 launch (stroje/srovnani/znacky/encyklopedie)', () => {
  const launched = ['/stroje', '/srovnani', '/znacky', '/encyklopedie'];
  it('4 sekce jsou launchnuté pro uk', () => {
    for (const p of launched) {
      expect(LAUNCHED_PREFIXES.uk).toContain(p);
      expect(isLaunchedPath('uk', p)).toBe(true);
      expect(isLaunchedPath('uk', `${p}/cokoli/`)).toBe(true);
    }
  });
  it('cs nikdy nedostane gating-noindex (LAUNCHED_PREFIXES.cs prázdné)', () => {
    expect(LAUNCHED_PREFIXES.cs).toEqual([]);
  });
  it('launchnuté nejsou locked', () => {
    for (const p of launched) expect(isLockedSectionPath(p)).toBe(false);
  });
});

describe('UK fáze 3 launch (jak-na-to)', () => {
  it('/jak-na-to je launchnuté pro uk', () => {
    expect(LAUNCHED_PREFIXES.uk).toContain('/jak-na-to');
    expect(isLaunchedPath('uk', '/jak-na-to/')).toBe(true);
    expect(isLaunchedPath('uk', '/jak-na-to/boj-s-varroazou/')).toBe(true);
  });
  it('cs nikdy nedostane gating-noindex (LAUNCHED_PREFIXES.cs prázdné)', () => {
    expect(LAUNCHED_PREFIXES.cs).toEqual([]);
    expect(isLaunchedPath('cs', '/jak-na-to/boj-s-varroazou/')).toBe(false);
  });
});

describe('UK fáze 4a launch (slovnik)', () => {
  it('/slovnik je launchnuté pro uk', () => {
    expect(LAUNCHED_PREFIXES.uk).toContain('/slovnik');
    expect(isLaunchedPath('uk', '/slovnik/')).toBe(true);
    expect(isLaunchedPath('uk', '/slovnik/adblue/')).toBe(true);
  });
  it('/slovnik není locked sekce', () => {
    expect(isLockedSectionPath('/slovnik')).toBe(false);
  });
  it('cs /slovnik nedostane gating-noindex', () => {
    expect(isLaunchedPath('cs', '/slovnik/adblue/')).toBe(false);
  });
});

describe('UK fáze 4b launch (puda)', () => {
  it('/puda je launchnuté pro uk', () => {
    expect(LAUNCHED_PREFIXES.uk).toContain('/puda');
    expect(isLaunchedPath('uk', '/puda')).toBe(true);
    expect(isLaunchedPath('uk', '/puda/eroze/')).toBe(true);
  });
});

describe('UK fáze 4c launch (statistiky)', () => {
  it('/statistiky je launchnuté pro uk', () => {
    expect(LAUNCHED_PREFIXES.uk).toContain('/statistiky');
    expect(isLaunchedPath('uk', '/statistiky')).toBe(true);
    expect(isLaunchedPath('uk', '/statistiky/')).toBe(true);
  });
  it('/statistiky není locked sekce', () => {
    expect(isLockedSectionPath('/statistiky')).toBe(false);
  });
  it('cs /statistiky nedostane gating-noindex', () => {
    expect(isLaunchedPath('cs', '/statistiky/')).toBe(false);
  });
});

describe('UK fáze 4d launch (dotace)', () => {
  it('/dotace je launchnuté pro uk', () => {
    expect(LAUNCHED_PREFIXES.uk).toContain('/dotace');
    expect(isLaunchedPath('uk', '/dotace')).toBe(true);
    expect(isLaunchedPath('uk', '/dotace/')).toBe(true);
  });
  it('/dotace není locked sekce', () => {
    expect(isLockedSectionPath('/dotace')).toBe(false);
  });
  it('cs /dotace nedostane gating-noindex', () => {
    expect(isLaunchedPath('cs', '/dotace/')).toBe(false);
  });
});

describe('UK homepage launch', () => {
  it('root je launchnutý pro uk (HomeUk.astro je plně ukrajinská)', () => {
    expect(LAUNCHED_PREFIXES.uk).toContain('/');
    expect(isLaunchedPath('uk', '/')).toBe(true);
  });

  it("root v prefixech nedělá wildcard — nelaunchnuté sekce zůstávají cs", () => {
    for (const p of ['/sezona', '/novinky', '/plemena', '/vcelarstvi']) {
      expect(isLaunchedPath('uk', p)).toBe(false);
    }
  });
});

describe('UK žebříčky (/zebricky)', () => {
  it('/zebricky je launchnuté pro uk', () => {
    expect(LAUNCHED_PREFIXES.uk).toContain('/zebricky');
    expect(isLaunchedPath('uk', '/zebricky/kombajny-nad-500-koni/')).toBe(true);
  });
});

// Právní a redakční stránky měly ukrajinské znění hotové (isUk větev v šabloně),
// jen nebyly v prefixech — takže se pod /uk servírovaly jako noindex. /redakce
// ukrajinskou variantu neměla vůbec a dopsala se.
describe('UK právní a redakční stránky', () => {
  const PAGES = ['/podminky-pouziti', '/zpracovani-osobnich-udaju', '/dsa-kontakt', '/redakce'];

  it('jsou launchnuté pro uk', () => {
    for (const p of PAGES) expect(LAUNCHED_PREFIXES.uk).toContain(p);
  });

  it('každá stránka má v šabloně ukrajinskou větev i azbuku', () => {
    const chybi: string[] = [];
    for (const p of PAGES) {
      const src = readFileSync(join(process.cwd(), 'src/pages', `${p.slice(1)}.astro`), 'utf8');
      if (!/isUk/.test(src)) chybi.push(`${p}: chybí isUk větev`);
      if (!/[Ѐ-ӿ]/.test(src)) chybi.push(`${p}: v souboru není azbuka`);
    }
    expect(chybi).toEqual([]);
  });
});
