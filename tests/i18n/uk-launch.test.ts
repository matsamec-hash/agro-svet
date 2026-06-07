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
  it('jurisdikční data NEjsou launchnuté pro uk', () => {
    for (const p of ['/dotace', '/statistiky', '/puda']) {
      expect(isLaunchedPath('uk', p)).toBe(false);
    }
  });
  it('launchnuté nejsou locked', () => {
    for (const p of launched) expect(isLockedSectionPath(p)).toBe(false);
  });
});
