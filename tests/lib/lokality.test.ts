import { describe, expect, it } from 'vitest';
import {
  getKraje,
  getKraj,
  getOkresy,
  getOkres,
  formatLokalita,
} from '../../src/lib/lokality';

describe('lokality loader', () => {
  it('returns 14 kraje', () => {
    expect(getKraje()).toHaveLength(14);
  });

  it('finds Středočeský kraj by slug', () => {
    const kraj = getKraj('stredocesky');
    expect(kraj?.name).toBe('Středočeský kraj');
  });

  it('returns okresy for a kraj', () => {
    const okresy = getOkresy('stredocesky');
    expect(okresy.length).toBeGreaterThan(10);
    expect(okresy.map(o => o.slug)).toContain('kolin');
  });

  it('getOkres returns named okres', () => {
    const okres = getOkres('stredocesky', 'kolin');
    expect(okres?.name).toBe('Kolín');
  });

  it('formatLokalita full form', () => {
    expect(formatLokalita('stredocesky', 'kolin')).toBe('Kolín, Středočeský kraj');
  });

  it('formatLokalita kraj only', () => {
    expect(formatLokalita('stredocesky')).toBe('Středočeský kraj');
  });

  it('formatLokalita empty on missing', () => {
    expect(formatLokalita()).toBe('');
    expect(formatLokalita('neexistuje')).toBe('');
  });
});
