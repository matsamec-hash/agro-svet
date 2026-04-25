// Site-wide passcode gate. Active iff SITE_GATE_PASSCODE env var is non-empty.
// Used by middleware (entry guard) + /api/unlock (cookie issuer).

import { env } from 'cloudflare:workers';

export const GATE_COOKIE_NAME = 'as-unlock';
export const GATE_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function getGatePasscode(): string {
  return (env as { SITE_GATE_PASSCODE?: string }).SITE_GATE_PASSCODE || '';
}

export function gateActive(): boolean {
  return getGatePasscode().length > 0;
}

export async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

let _hashCache: { passcode: string; promise: Promise<string> } | null = null;
export function expectedGateHash(): Promise<string> {
  const passcode = getGatePasscode();
  if (!_hashCache || _hashCache.passcode !== passcode) {
    _hashCache = { passcode, promise: sha256(passcode + '|agro-svet-gate-v1') };
  }
  return _hashCache.promise;
}

const BYPASS_PREFIXES = [
  '/unlock',
  '/api/unlock',
  '/_image',
  '/_astro/',
  '/favicon',
  '/apple-touch-icon',
];
const BYPASS_EXACT = new Set(['/robots.txt']);

export function isGateBypassed(pathname: string): boolean {
  if (BYPASS_EXACT.has(pathname)) return true;
  return BYPASS_PREFIXES.some((p) => pathname.startsWith(p));
}
