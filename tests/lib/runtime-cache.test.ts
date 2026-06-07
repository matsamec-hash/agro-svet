import { describe, it, expect, vi } from 'vitest';
import { runtimeCache } from '../../src/lib/runtime-cache';

describe('runtimeCache', () => {
  it('returns a cached response within its TTL', async () => {
    const req = new Request('https://x/a');
    await runtimeCache.put(
      req,
      new Response('hello', { headers: { 'cache-control': 'public, max-age=60' } }),
    );
    const hit = await runtimeCache.match(req);
    expect(hit).toBeDefined();
    expect(await hit!.text()).toBe('hello');
  });

  it('returns undefined for an unknown request', async () => {
    expect(await runtimeCache.match(new Request('https://x/never'))).toBeUndefined();
  });

  it('does not cache responses without a max-age', async () => {
    const req = new Request('https://x/b');
    await runtimeCache.put(req, new Response('x', { headers: { 'cache-control': 'no-store' } }));
    expect(await runtimeCache.match(req)).toBeUndefined();
  });

  it('prefers s-maxage over max-age for the TTL', async () => {
    const req = new Request('https://x/c');
    await runtimeCache.put(
      req,
      new Response('v', { headers: { 'cache-control': 'max-age=1, s-maxage=300' } }),
    );
    vi.useFakeTimers();
    vi.advanceTimersByTime(2_000); // past max-age, before s-maxage
    const hit = await runtimeCache.match(req);
    vi.useRealTimers();
    expect(hit).toBeDefined();
  });

  it('expires entries after the TTL', async () => {
    const req = new Request('https://x/d');
    await runtimeCache.put(req, new Response('v', { headers: { 'cache-control': 'max-age=10' } }));
    vi.useFakeTimers();
    vi.advanceTimersByTime(11_000);
    const hit = await runtimeCache.match(req);
    vi.useRealTimers();
    expect(hit).toBeUndefined();
  });

  it('serves a fresh body on each match (does not consume the stored body)', async () => {
    const req = new Request('https://x/e');
    await runtimeCache.put(req, new Response('once', { headers: { 'cache-control': 'max-age=60' } }));
    const a = await runtimeCache.match(req);
    const b = await runtimeCache.match(req);
    expect(await a!.text()).toBe('once');
    expect(await b!.text()).toBe('once');
  });
});
