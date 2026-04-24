import { describe, expect, it } from 'vitest';
import { computeRoundPhase, msUntil, formatCountdown } from '../../src/lib/contest-config';

const ROUND = {
  upload_starts_at: '2026-05-01T00:00:00Z',
  upload_ends_at:   '2026-05-10T22:00:00Z',
  voting_starts_at: '2026-05-11T00:00:00Z',
  voting_ends_at:   '2026-05-28T22:00:00Z',
  announcement_at:  '2026-05-30T12:00:00Z',
  status: 'voting_open',
};

describe('computeRoundPhase', () => {
  it('upcoming before upload start', () => {
    expect(computeRoundPhase(ROUND, new Date('2026-04-25T12:00:00Z'))).toBe('upcoming');
  });
  it('upload_open during upload window', () => {
    expect(computeRoundPhase(ROUND, new Date('2026-05-05T12:00:00Z'))).toBe('upload_open');
  });
  it('between after upload before voting', () => {
    expect(computeRoundPhase(ROUND, new Date('2026-05-10T23:00:00Z'))).toBe('between');
  });
  it('voting_open during voting window', () => {
    expect(computeRoundPhase(ROUND, new Date('2026-05-15T12:00:00Z'))).toBe('voting_open');
  });
  it('closed after voting ends', () => {
    expect(computeRoundPhase(ROUND, new Date('2026-05-29T00:00:00Z'))).toBe('closed');
  });
  it('announced when status=announced regardless of time', () => {
    expect(computeRoundPhase({ ...ROUND, status: 'announced' }, new Date('2026-05-05T12:00:00Z')))
      .toBe('announced');
  });
});

describe('msUntil', () => {
  it('returns positive when future', () => {
    const ms = msUntil('2026-05-15T00:00:00Z', new Date('2026-05-10T00:00:00Z'));
    expect(ms).toBe(5 * 24 * 3_600_000);
  });
  it('returns 0 when past', () => {
    expect(msUntil('2026-01-01T00:00:00Z', new Date('2026-05-10T00:00:00Z'))).toBe(0);
  });
});

describe('formatCountdown', () => {
  it('hours+minutes under a day', () => {
    expect(formatCountdown(3_600_000 * 2 + 60_000 * 30)).toBe('2 h 30 min');
  });
  it('days+hours over a day', () => {
    expect(formatCountdown(86_400_000 * 3 + 3_600_000 * 5)).toBe('3 d 5 h');
  });
  it('zero', () => {
    expect(formatCountdown(0)).toBe('0 h');
  });
});
