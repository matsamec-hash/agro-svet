import { describe, expect, it } from 'vitest';
import {
  isFeaturedActive,
  computeFeaturedUntil,
  formatFeaturedUntil,
  planToDays,
} from '../../src/lib/bazar-featured';

const now = new Date('2026-04-24T12:00:00Z');

describe('isFeaturedActive', () => {
  it('returns true when featured=true and featured_until in the future', () => {
    const listing = { featured: true, featured_until: '2026-05-24T12:00:00Z' };
    expect(isFeaturedActive(listing, now)).toBe(true);
  });

  it('returns false when featured=true but featured_until in the past (expired)', () => {
    const listing = { featured: true, featured_until: '2026-04-01T12:00:00Z' };
    expect(isFeaturedActive(listing, now)).toBe(false);
  });

  it('returns false when featured=true and featured_until=null (corrupt edge case)', () => {
    const listing = { featured: true, featured_until: null };
    expect(isFeaturedActive(listing, now)).toBe(false);
  });

  it('returns false when featured=false', () => {
    const listing = { featured: false, featured_until: '2026-05-24T12:00:00Z' };
    expect(isFeaturedActive(listing, now)).toBe(false);
  });

  it('returns false when featured_until is exactly now (boundary)', () => {
    const listing = { featured: true, featured_until: now.toISOString() };
    expect(isFeaturedActive(listing, now)).toBe(false);
  });
});

describe('computeFeaturedUntil', () => {
  it('new TOP (currentUntil=null) returns now + N days', () => {
    const result = computeFeaturedUntil(null, 30, now);
    const expected = new Date('2026-05-24T12:00:00Z');
    expect(result.toISOString()).toBe(expected.toISOString());
  });

  it('extending active TOP adds N days to existing featured_until', () => {
    const currentUntil = new Date('2026-05-04T12:00:00Z'); // now + 10d
    const result = computeFeaturedUntil(currentUntil, 30, now);
    const expected = new Date('2026-06-03T12:00:00Z'); // now + 10d + 30d
    expect(result.toISOString()).toBe(expected.toISOString());
  });

  it('extending expired TOP restarts from now + N days', () => {
    const currentUntil = new Date('2026-04-19T12:00:00Z'); // now - 5d
    const result = computeFeaturedUntil(currentUntil, 30, now);
    const expected = new Date('2026-05-24T12:00:00Z'); // now + 30d
    expect(result.toISOString()).toBe(expected.toISOString());
  });

  it('handles 7 days', () => {
    const result = computeFeaturedUntil(null, 7, now);
    const expected = new Date('2026-05-01T12:00:00Z');
    expect(result.toISOString()).toBe(expected.toISOString());
  });

  it('handles 60 days', () => {
    const result = computeFeaturedUntil(null, 60, now);
    const expected = new Date('2026-06-23T12:00:00Z');
    expect(result.toISOString()).toBe(expected.toISOString());
  });
});

describe('formatFeaturedUntil', () => {
  it('formats ISO timestamp as Czech date (day. month. year)', () => {
    expect(formatFeaturedUntil('2026-05-24T10:00:00Z')).toBe('24. 5. 2026');
  });

  it('formats Date object', () => {
    expect(formatFeaturedUntil(new Date('2026-12-31T10:00:00Z'))).toBe('31. 12. 2026');
  });

  it('returns empty string for null', () => {
    expect(formatFeaturedUntil(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(formatFeaturedUntil(undefined)).toBe('');
  });
});

describe('planToDays', () => {
  it('7d → 7', () => expect(planToDays('7d')).toBe(7));
  it('30d → 30', () => expect(planToDays('30d')).toBe(30));
  it('60d → 60', () => expect(planToDays('60d')).toBe(60));
});
