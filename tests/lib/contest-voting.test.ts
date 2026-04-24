import { describe, expect, it } from 'vitest';
import { canVote, generateVerificationToken, type Vote } from '../../src/lib/contest-voting';

const now = new Date('2026-05-15T12:00:00Z');
const voter = { email_verified: true };

function validVote(offsetMs: number, ip = '1.2.3.4'): Vote {
  return {
    voter_id: 'v1',
    voted_at: new Date(now.getTime() - offsetMs),
    ip,
    is_valid: true,
  };
}

describe('canVote', () => {
  it('allows when no prior votes', () => {
    const result = canVote({
      voter,
      voter_history: [],
      ip_history_last_24h: [],
      entry_owner_id: 'author1',
      voter_user_id: null,
      now,
    });
    expect(result).toEqual({ ok: true });
  });

  it('rejects if email unverified', () => {
    const result = canVote({
      voter: { email_verified: false },
      voter_history: [],
      ip_history_last_24h: [],
      entry_owner_id: 'author1',
      voter_user_id: null,
      now,
    });
    expect(result).toMatchObject({ ok: false, reason: 'email_unverified' });
  });

  it('rejects if voted <1h ago', () => {
    const result = canVote({
      voter,
      voter_history: [validVote(30 * 60 * 1000)],
      ip_history_last_24h: [validVote(30 * 60 * 1000)],
      entry_owner_id: 'author1',
      voter_user_id: null,
      now,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe('cooldown');
      expect(result.retry_after_ms).toBeGreaterThan(0);
      expect(result.retry_after_ms).toBeLessThan(60 * 60 * 1000);
    }
  });

  it('allows if last vote >1h ago', () => {
    const result = canVote({
      voter,
      voter_history: [validVote(61 * 60 * 1000)],
      ip_history_last_24h: [validVote(61 * 60 * 1000)],
      entry_owner_id: 'author1',
      voter_user_id: null,
      now,
    });
    expect(result).toEqual({ ok: true });
  });

  it('ignores invalid votes in cooldown', () => {
    const invalidated: Vote = { ...validVote(10 * 60 * 1000), is_valid: false };
    const result = canVote({
      voter,
      voter_history: [invalidated],
      ip_history_last_24h: [invalidated],
      entry_owner_id: 'author1',
      voter_user_id: null,
      now,
    });
    expect(result).toEqual({ ok: true });
  });

  it('rejects self-vote when voter_user_id equals entry_owner_id', () => {
    const result = canVote({
      voter,
      voter_history: [],
      ip_history_last_24h: [],
      entry_owner_id: 'author1',
      voter_user_id: 'author1',
      now,
    });
    expect(result).toMatchObject({ ok: false, reason: 'own_entry' });
  });

  it('rejects when IP used 20 valid votes in 24h', () => {
    const ipHistory: Vote[] = Array.from({ length: 20 }, (_, i) =>
      validVote((i + 2) * 60 * 60 * 1000),
    );
    const result = canVote({
      voter,
      voter_history: [],
      ip_history_last_24h: ipHistory,
      entry_owner_id: 'author1',
      voter_user_id: null,
      now,
    });
    expect(result).toMatchObject({ ok: false, reason: 'ip_limit' });
  });

  it('allows when IP used 19 valid votes in 24h', () => {
    const ipHistory: Vote[] = Array.from({ length: 19 }, (_, i) =>
      validVote((i + 2) * 60 * 60 * 1000),
    );
    const result = canVote({
      voter,
      voter_history: [],
      ip_history_last_24h: ipHistory,
      entry_owner_id: 'author1',
      voter_user_id: null,
      now,
    });
    expect(result).toEqual({ ok: true });
  });
});

describe('generateVerificationToken', () => {
  it('produces 64-char hex (32 bytes)', () => {
    const token = generateVerificationToken();
    expect(token).toMatch(/^[0-9a-f]{64}$/);
  });
  it('produces distinct values', () => {
    const a = generateVerificationToken();
    const b = generateVerificationToken();
    expect(a).not.toBe(b);
  });
});
