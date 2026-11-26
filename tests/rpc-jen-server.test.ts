import { describe, it, expect, vi, beforeEach } from 'vitest';

// Migrace 029: anketa_vote() a increment_listing_views() smí volat jen service_role.
// API endpointy je proto musí volat přes server klient (service_role klíč), nikdy přes
// anon klient. Kdyby některý zůstal na anon klientu, na produkci by po migraci spadl
// na 42501 (hlasování v anketě a počítadlo zhlédnutí by tiše přestaly fungovat).

const h = vi.hoisted(() => ({
  serverRpc: [] as { fn: string; args: Record<string, unknown> }[],
  anonRpc: [] as { fn: string; args: Record<string, unknown> }[],
}));

vi.mock('../src/lib/supabase', () => ({
  createServerClient: () => ({
    rpc: async (fn: string, args: Record<string, unknown>) => {
      h.serverRpc.push({ fn, args });
      return { data: fn === 'anketa_vote' ? [{ option_id: 'a', votes: 1 }] : 7, error: null };
    },
  }),
  createAnonClient: () => ({
    rpc: async (fn: string, args: Record<string, unknown>) => {
      h.anonRpc.push({ fn, args });
      return { data: null, error: { code: '42501', message: 'permission denied for function' } };
    },
    from: () => ({
      select: () => ({ eq: async () => ({ data: [], error: null }) }),
    }),
  }),
}));

vi.mock('../src/lib/edge-throttle', () => ({
  edgeThrottle: async () => ({ ok: true, remaining: 5, retryAfterS: 0 }),
}));

vi.mock('../src/lib/client-ip', () => ({
  clientIp: () => '203.0.113.7',
}));

import { POST as anketaPost } from '../src/pages/api/anketa/[slug]';
import { POST as viewsPost } from '../src/pages/api/bazar/views/[id]';

const LISTING_ID = 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee';

const browserRequest = (url: string, body?: unknown) =>
  new Request(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0)' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

const cookies = () => ({ has: () => false, set: vi.fn() });

describe('RPC jen přes service_role (migrace 029)', () => {
  beforeEach(() => {
    h.serverRpc.length = 0;
    h.anonRpc.length = 0;
  });

  it('hlas v anketě volá anketa_vote přes server klient, ne přes anon', async () => {
    const res = await anketaPost({
      params: { slug: 'znacka-zetor' },
      request: browserRequest('https://agro-svet.cz/api/anketa/znacka-zetor', { option: 'urcite-ano' }),
      cookies: cookies(),
      clientAddress: '203.0.113.7',
      locals: {},
    } as never);
    const body = await res.json();

    expect(body.ok).toBe(true);
    expect(body.voted).toBe('urcite-ano');
    expect(h.serverRpc).toEqual([{ fn: 'anketa_vote', args: { p_slug: 'znacka-zetor', p_option: 'urcite-ano' } }]);
    expect(h.anonRpc).toEqual([]);
  });

  it('počítadlo zhlédnutí volá increment_listing_views přes server klient, ne přes anon', async () => {
    const res = await viewsPost({
      params: { id: LISTING_ID },
      request: browserRequest(`https://agro-svet.cz/api/bazar/views/${LISTING_ID}`),
      cookies: cookies(),
      clientAddress: '203.0.113.7',
      locals: {},
    } as never);
    const body = await res.json();

    expect(body.ok).toBe(true);
    expect(body.views).toBe(7);
    expect(h.serverRpc).toEqual([{ fn: 'increment_listing_views', args: { listing_id: LISTING_ID } }]);
    expect(h.anonRpc).toEqual([]);
  });

  it('neplatný slug ankety se odmítne dřív, než se sáhne na databázi', async () => {
    const res = await anketaPost({
      params: { slug: 'Spatny Slug!' },
      request: browserRequest('https://agro-svet.cz/api/anketa/x', { option: 'a' }),
      cookies: cookies(),
      clientAddress: '203.0.113.7',
      locals: {},
    } as never);

    expect(res.status).toBe(400);
    expect(h.serverRpc).toEqual([]);
    expect(h.anonRpc).toEqual([]);
  });
});
