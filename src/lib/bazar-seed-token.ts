import { randomBytes } from 'node:crypto';

/** URL-safe náhodný token (32 bytes → ~43 znaků base64url). Jednorázový claim link. */
export function generateClaimToken(): string {
  return randomBytes(32).toString('base64url');
}

/** Vrací true, pokud expirace (ISO string) je před `now`. */
export function isTokenExpired(expiresAtIso: string, now: Date = new Date()): boolean {
  return new Date(expiresAtIso).getTime() <= now.getTime();
}
