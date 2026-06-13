import { describe, it, expect } from 'vitest';
import { SK_LAUNCHED_PREFIXES, isSkLaunchedPath } from '../../src/i18n/utils';
import { LOCKED_SECTION_PREFIXES, isLockedSectionPath } from '../../src/i18n/nav';

describe('/statistiky SK launch (balík B)', () => {
  it('/statistiky je launchnutá SK sekce', () => {
    expect(SK_LAUNCHED_PREFIXES).toContain('/statistiky');
    expect(isSkLaunchedPath('/statistiky')).toBe(true);
  });
  it('/statistiky NENÍ locked', () => {
    expect(LOCKED_SECTION_PREFIXES).not.toContain('/statistiky');
    expect(isLockedSectionPath('/statistiky')).toBe(false);
  });
  it('/puda je nyní odemčena (balík C)', () => {
    expect(isLockedSectionPath('/puda')).toBe(false);
    expect(LOCKED_SECTION_PREFIXES).toEqual([]);
  });
});
