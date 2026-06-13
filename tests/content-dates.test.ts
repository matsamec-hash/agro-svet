import { describe, it, expect } from 'vitest';
import { resolveDatasetDate, FALLBACK_LASTMOD, dsDate } from '../src/lib/content-dates';

describe('resolveDatasetDate', () => {
  const map = {
    _fallback: '2026-06-01',
    stroje: '2026-06-07',
    plemena: '2026-05-29',
  };

  it('returns the dataset date for a known key', () => {
    expect(resolveDatasetDate(map, 'stroje')).toBe('2026-06-07');
    expect(resolveDatasetDate(map, 'plemena')).toBe('2026-05-29');
  });

  it('falls back to the map _fallback for an unknown key', () => {
    expect(resolveDatasetDate(map, 'nope')).toBe('2026-06-01');
  });

  it('falls back to the hardcoded constant when the map has no _fallback', () => {
    expect(resolveDatasetDate({ stroje: '2026-06-07' }, 'nope')).toBe(FALLBACK_LASTMOD);
  });

  it('never returns the build/request date (no per-deploy stamping)', () => {
    // A real date string, stable across deploys — not today computed at request time.
    const today = new Date().toISOString().slice(0, 10);
    // For a known key it must be the content date, independent of "today".
    expect(resolveDatasetDate(map, 'stroje')).not.toBe(today === '2026-06-07' ? '__never__' : today);
    expect(resolveDatasetDate(map, 'stroje')).toBe('2026-06-07');
  });
});

describe('dsDate (wired to generated content-dates.json)', () => {
  it('returns an ISO date string for known datasets', () => {
    const d = dsDate('stroje');
    expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('returns the fallback ISO date for an unknown dataset', () => {
    expect(dsDate('does-not-exist')).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
