// @vitest-environment node
// Ochrana POST /api/akce/submit: honeypot, limit na IP, na cílový e-mail a obejití podvrženou hlavičkou.
// Limit se počítá před validací, proto stačí neúplný formulář (nic se nikam nezapisuje).
import { describe, it, expect, vi, beforeEach } from 'vitest';

const insertSubmission = vi.hoisted(() => vi.fn(async () => ({ id: 'x' })));
vi.mock('../src/lib/akce-supabase', () => ({ insertSubmission }));
vi.mock('../src/lib/geocode', () => ({ geocode: vi.fn(async () => null) }));
vi.mock('../src/lib/akce-email', () => ({
  sendSubmissionConfirmation: vi.fn(async () => undefined),
  notifyModerator: vi.fn(async () => undefined),
}));

import { POST } from '../src/pages/api/akce/submit';

function call(fields: Record<string, string>, headers: Record<string, string> = {}) {
  const request = new Request('https://example.test/api/akce/submit', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', ...headers },
    body: new URLSearchParams(fields),
  });
  return POST({ request, locals: {}, clientAddress: '127.0.0.1' } as any) as Promise<Response>;
}

beforeEach(() => insertSubmission.mockClear());

describe('POST /api/akce/submit — ochrana', () => {
  it('honeypot: tváří se, že prošlo, a nic neuloží', async () => {
    const res = await call({ web_url: 'http://spam.example', email: 'a@b.cz' }, { 'x-forwarded-for': '203.0.113.50' });
    expect(res.status).toBe(200);
    expect(insertSubmission).not.toHaveBeenCalled();
  });

  it('po 5 odeslání za hodinu z jedné IP vrátí 429 s Retry-After', async () => {
    const h = { 'x-forwarded-for': '203.0.113.51' };
    for (let i = 0; i < 5; i++) {
      const ok = await call({ email: `n${i}@example.cz` }, h);
      expect(ok.status).toBe(400);
    }
    const res = await call({ email: 'n9@example.cz' }, h);
    expect(res.status).toBe(429);
    expect(Number(res.headers.get('retry-after'))).toBeGreaterThan(0);
  });

  it('limit nejde obejít podvrženým CF-Connecting-IP ani začátkem X-Forwarded-For', async () => {
    for (let i = 0; i < 5; i++) {
      await call(
        { email: `m${i}@example.cz` },
        { 'x-forwarded-for': `10.0.0.${i}, 203.0.113.52`, 'cf-connecting-ip': `192.0.2.${i}` },
      );
    }
    const res = await call(
      { email: 'm9@example.cz' },
      { 'x-forwarded-for': '10.9.9.9, 203.0.113.52', 'cf-connecting-ip': '192.0.2.99' },
    );
    expect(res.status).toBe(429);
  });

  it('jedna cílová adresa dostane nejvýš 3 odeslání za den, i z různých IP', async () => {
    for (let i = 0; i < 3; i++) {
      const ok = await call({ email: 'obet@example.cz' }, { 'x-forwarded-for': `198.51.100.${i}` });
      expect(ok.status).toBe(400);
    }
    const res = await call({ email: 'Obet@Example.cz' }, { 'x-forwarded-for': '198.51.100.77' });
    expect(res.status).toBe(429);
  });
});
