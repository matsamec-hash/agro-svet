import { describe, it, expect } from 'vitest';
import { LAUNCHED_PREFIXES, isLaunchedPath } from '../../src/i18n/utils';
import { isLockedSectionPath } from '../../src/i18n/nav';

describe('UK fáze 2 launch (stroje/srovnani/znacky/encyklopedie)', () => {
  const launched = ['/stroje', '/srovnani', '/znacky', '/encyklopedie'];
  it('4 sekce jsou launchnuté pro uk', () => {
    for (const p of launched) {
      expect(LAUNCHED_PREFIXES.uk).toContain(p);
      expect(isLaunchedPath('uk', p)).toBe(true);
      expect(isLaunchedPath('uk', `${p}/cokoli/`)).toBe(true);
    }
  });
  it('jurisdikční data NEjsou launchnuté pro uk (kromě /puda — fáze 4b)', () => {
    for (const p of ['/dotace', '/statistiky']) {
      expect(isLaunchedPath('uk', p)).toBe(false);
    }
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

describe('UK fáze 4b launch (puda)', () => {
  it('/puda je launchnuté pro uk', () => {
    expect(LAUNCHED_PREFIXES.uk).toContain('/puda');
    expect(isLaunchedPath('uk', '/puda')).toBe(true);
    expect(isLaunchedPath('uk', '/puda/eroze/')).toBe(true);
  });
});
