import { describe, it, expect } from 'vitest';
import { LAUNCHED_PREFIXES, isLaunchedPath } from '../../src/i18n/utils';
import { isLockedSectionPath } from '../../src/i18n/nav';

describe('PL fáze 1 launch (stroje/znacky/srovnani/slovnik)', () => {
  const launched = ['/stroje', '/znacky', '/srovnani', '/slovnik'];
  it('4 sekce jsou launchnuté pro pl', () => {
    for (const p of launched) {
      expect(LAUNCHED_PREFIXES.pl).toContain(p);
      expect(isLaunchedPath('pl', p)).toBe(true);
      expect(isLaunchedPath('pl', `${p}/cokoli/`)).toBe(true);
    }
  });
  it('jurisdikční sekce NEjsou launchnuté pro pl', () => {
    for (const p of ['/statistiky', '/puda', '/dotace', '/novinky']) {
      expect(isLaunchedPath('pl', p)).toBe(false);
    }
  });
  it('cs nikdy nedostane gating-noindex', () => {
    expect(isLaunchedPath('cs', '/slovnik/adblue/')).toBe(false);
  });
  it('launchnuté nejsou locked', () => {
    for (const p of launched) expect(isLockedSectionPath(p)).toBe(false);
  });
});
