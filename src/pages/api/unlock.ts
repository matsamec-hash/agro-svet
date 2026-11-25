import type { APIRoute } from 'astro';
import {
  getGatePasscode,
  GATE_COOKIE_NAME,
  GATE_COOKIE_MAX_AGE,
  expectedGateHash,
  gateActive,
} from '../../lib/site-gate';
import { clientIp } from '../../lib/client-ip';
import { edgeThrottle } from '../../lib/edge-throttle';

function safeNext(raw: string | null | undefined): string {
  if (!raw) return '/';
  // Same-site relative paths only (block //evil.com and absolute URLs)
  if (raw.startsWith('/') && !raw.startsWith('//')) return raw;
  return '/';
}

export const POST: APIRoute = async ({ request, cookies, redirect, clientAddress, locals }) => {
  // If the gate is disabled, the page should not exist — but be safe.
  if (!gateActive()) {
    return redirect('/');
  }

  // Hádání hesla brány: 10 pokusů za 15 minut na IP.
  const limit = await edgeThrottle({
    bucket: 'unlock-ip',
    key: clientIp(request.headers, clientAddress),
    max: 10,
    windowS: 900,
    ctx: (locals as any).cfContext,
  });
  if (!limit.ok) {
    return new Response('Too many attempts', { status: 429, headers: { 'retry-after': String(limit.retryAfterS) } });
  }

  const form = await request.formData();
  const passcode = (form.get('passcode') ?? '').toString();
  const next = safeNext((form.get('next') ?? '/').toString());

  if (passcode !== getGatePasscode()) {
    return redirect(`/unlock/?error=1&next=${encodeURIComponent(next)}`);
  }

  const hash = await expectedGateHash();
  cookies.set(GATE_COOKIE_NAME, hash, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    maxAge: GATE_COOKIE_MAX_AGE,
  });

  return redirect(next);
};

// GET on /api/unlock just bounces to the form
export const GET: APIRoute = ({ redirect }) => redirect('/unlock/');
