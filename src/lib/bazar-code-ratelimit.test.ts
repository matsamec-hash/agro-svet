import { describe, it, expect } from 'vitest';
import { isRateLimited, MAX_ATTEMPTS_PER_WINDOW } from './bazar-code-ratelimit';

function fakeSupabase(count: number) {
  return {
    from() {
      const chain: any = {
        insert() { return chain; },
        select() { return chain; },
        eq() { return chain; },
        gte() { return Promise.resolve({ count, error: null }); },
      };
      return chain;
    },
  } as any;
}

describe('isRateLimited', () => {
  it('false když pod limitem', async () => {
    expect(await isRateLimited(fakeSupabase(MAX_ATTEMPTS_PER_WINDOW - 1), '1.2.3.4')).toBe(false);
  });
  it('true když na/nad limitem', async () => {
    expect(await isRateLimited(fakeSupabase(MAX_ATTEMPTS_PER_WINDOW), '1.2.3.4')).toBe(true);
  });
});
