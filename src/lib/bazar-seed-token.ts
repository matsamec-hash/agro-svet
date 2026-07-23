import { randomBytes } from 'node:crypto';

/** URL-safe náhodný token (32 bytes → ~43 znaků base64url). Jednorázový claim link. */
export function generateClaimToken(): string {
  return randomBytes(32).toString('base64url');
}

/** Vrací true, pokud expirace (ISO string) je před `now`. */
export function isTokenExpired(expiresAtIso: string, now: Date = new Date()): boolean {
  return new Date(expiresAtIso).getTime() <= now.getTime();
}

// Abeceda bez matoucích znaků (0/O, 1/I/L) — kód se dá nadiktovat po telefonu.
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

/** 6znakový alfanumerický kód pro vstup na /prodejce. ~31^6 ≈ 0,9 mld kombinací. */
export function generateClaimCode(): string {
  const bytes = randomBytes(6);
  let out = '';
  for (let i = 0; i < 6; i++) {
    out += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }
  return out;
}
