import { CONTEST_CONFIG } from './contest-config';

export interface Vote {
  voter_id: string;
  voted_at: string | Date;
  ip: string;
  is_valid: boolean;
}

export interface VoteAttemptInput {
  now?: Date;
  /** Votes by this voter in the current round (any time). */
  voter_history: Vote[];
  /** Votes from this IP in the past 24h. */
  ip_history_last_24h: Vote[];
  /** Entry's owner user id. Null if anonymous lookup failed. */
  entry_owner_id: string | null;
  /** Voter's linked bazar_users.id if logged in, else null. */
  voter_user_id: string | null;
}

export type VoteRejection =
  | 'cooldown'
  | 'ip_limit'
  | 'own_entry'
  | 'email_unverified';

export interface VoteDecision {
  ok: true;
}

export interface VoteRejected {
  ok: false;
  reason: VoteRejection;
  retry_after_ms?: number;
}

export type VoteCheckResult = VoteDecision | VoteRejected;

export interface VoterState {
  email_verified: boolean;
}

/**
 * Pure rule check. Does NOT touch DB.
 * Call before INSERT contest_votes; on ok===true, write the row.
 */
export function canVote(input: VoteAttemptInput & { voter: VoterState }): VoteCheckResult {
  const now = input.now ?? new Date();

  if (!input.voter.email_verified) {
    return { ok: false, reason: 'email_unverified' };
  }

  if (input.voter_user_id && input.voter_user_id === input.entry_owner_id) {
    return { ok: false, reason: 'own_entry' };
  }

  const validVoterVotes = input.voter_history.filter(v => v.is_valid);
  if (validVoterVotes.length > 0) {
    const last = validVoterVotes
      .map(v => (v.voted_at instanceof Date ? v.voted_at : new Date(v.voted_at)))
      .sort((a, b) => b.getTime() - a.getTime())[0];
    const elapsed = now.getTime() - last.getTime();
    if (elapsed < CONTEST_CONFIG.VOTE_COOLDOWN_MS) {
      return {
        ok: false,
        reason: 'cooldown',
        retry_after_ms: CONTEST_CONFIG.VOTE_COOLDOWN_MS - elapsed,
      };
    }
  }

  const validIpVotes = input.ip_history_last_24h.filter(v => v.is_valid);
  if (validIpVotes.length >= CONTEST_CONFIG.IP_VOTES_PER_DAY) {
    return { ok: false, reason: 'ip_limit' };
  }

  return { ok: true };
}

/** Generate opaque verification token (hex). */
export function generateVerificationToken(): string {
  const bytes = new Uint8Array(CONTEST_CONFIG.VERIFICATION_TOKEN_LENGTH);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}
