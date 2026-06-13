import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runtimeCache, __clearCacheForTesting } from '../../src/lib/runtime-cache';

beforeEach(() => __clearCacheForTesting());

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

  it('caps the store at MAX_ENTRIES', async () => {
    // Insert 5100 entries — 100 past the MAX_ENTRIES cap of 5000.
    // The eviction logic must have fired at least once, removing the oldest
    // entries by insertion order.
    for (let i = 0; i < 5100; i++) {
      await runtimeCache.put(
        new Request(`https://x/cap-${i}`),
        new Response(`body-${i}`, { headers: { 'cache-control': 'max-age=600' } }),
      );
    }
    // cap-0 was inserted first and must have been evicted to make room.
    expect(await runtimeCache.match(new Request('https://x/cap-0'))).toBeUndefined();
    // cap-5099 was inserted last and must still be present.
    expect(await runtimeCache.match(new Request('https://x/cap-5099'))).toBeDefined();
  });

  it('sweeps expired entries when full instead of evicting live ones', async () => {
    // Fill the store to the cap with short-lived entries (max-age=1).
    vi.useFakeTimers();
    for (let i = 0; i < 5000; i++) {
      await runtimeCache.put(
        new Request(`https://x/short-${i}`),
        new Response(`body-${i}`, { headers: { 'cache-control': 'max-age=1' } }),
      );
    }
    // Advance time so all 5000 entries are expired.
    vi.advanceTimersByTime(2_000);

    // Now put 10 fresh entries. The sweep in `put` should reclaim the 5000
    // expired slots, so all 10 fresh entries survive without being evicted.
    const freshUrls: string[] = [];
    for (let i = 0; i < 10; i++) {
      const url = `https://x/fresh-${i}`;
      freshUrls.push(url);
      await runtimeCache.put(
        new Request(url),
        new Response(`fresh-${i}`, { headers: { 'cache-control': 'max-age=600' } }),
      );
    }

    vi.useRealTimers();

    // All 10 fresh entries must still be retrievable — the sweep reclaimed the
    // expired slots rather than evicting the newly inserted live entries.
    for (const url of freshUrls) {
      expect(await runtimeCache.match(new Request(url))).toBeDefined();
    }
  });
});
