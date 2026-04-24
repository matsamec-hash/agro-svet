// Contest-wide constants. Edit here to tune timings/limits.

export const CONTEST_CONFIG = {
  /** Max entries per user per round */
  MAX_ENTRIES_PER_ROUND: 3,

  /** Max photo file size (bytes) — 20 MB */
  MAX_UPLOAD_BYTES: 20 * 1024 * 1024,

  /** Accepted MIME types */
  ACCEPTED_MIME: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'],

  /** Output WebP long-edge in pixels after server conversion */
  OUTPUT_LONG_EDGE: 1920,

  /** Voting rate limit: 1 vote per hour per voter */
  VOTE_COOLDOWN_MS: 60 * 60 * 1000,

  /** Voting rate limit: max votes per IP per rolling 24h */
  IP_VOTES_PER_DAY: 20,

  /** Leaderboard refresh interval (ms) */
  LEADERBOARD_REFRESH_MS: 30_000,

  /** Token length for magic link */
  VERIFICATION_TOKEN_LENGTH: 32,

  /** Voter cookie name */
  VOTER_COOKIE: 'contest_voter_id',

  /** Min age (years) from rules */
  MIN_AGE: 18,
} as const;

/** Round phase derived from `now` and round timestamps. */
export type RoundPhase =
  | 'upcoming'
  | 'upload_open'
  | 'between'
  | 'voting_open'
  | 'closed'
  | 'announced';

export interface RoundTimings {
  upload_starts_at: string | Date;
  upload_ends_at:   string | Date;
  voting_starts_at: string | Date;
  voting_ends_at:   string | Date;
  announcement_at:  string | Date;
  status?: string;
}

function toDate(v: string | Date): Date {
  return v instanceof Date ? v : new Date(v);
}

export function computeRoundPhase(round: RoundTimings, now: Date = new Date()): RoundPhase {
  if (round.status === 'announced') return 'announced';
  const t = now.getTime();
  if (t < toDate(round.upload_starts_at).getTime()) return 'upcoming';
  if (t < toDate(round.upload_ends_at).getTime())   return 'upload_open';
  if (t < toDate(round.voting_starts_at).getTime()) return 'between';
  if (t < toDate(round.voting_ends_at).getTime())   return 'voting_open';
  return 'closed';
}

export function msUntil(target: string | Date, now: Date = new Date()): number {
  return Math.max(0, toDate(target).getTime() - now.getTime());
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return '0 h';
  const hours = Math.floor(ms / 3_600_000);
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  if (days > 0) return `${days} d ${remainingHours} h`;
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  return `${hours} h ${minutes} min`;
}
