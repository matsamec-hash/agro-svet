import { describe, it, expect, vi } from 'vitest';
import { createProspectWithDraft, markProspectSent } from './bazar-seed';

function fakeSupabase(returns: Record<string, any>) {
  const calls: any[] = [];
  const api: any = {
    from(table: string) {
      const ctx: any = { table, _op: null, _payload: null, _filters: [] };
      const chain: any = {
        insert(p: any) { ctx._op = 'insert'; ctx._payload = p; return chain; },
        update(p: any) { ctx._op = 'update'; ctx._payload = p; return chain; },
        eq(col: string, val: any) { ctx._filters.push([col, val]); return chain; },
        in(col: string, val: any) { ctx._filters.push([col, val]); return chain; },
        select() { return chain; },
        single() { calls.push(ctx); return Promise.resolve(returns[`${table}.single`] ?? { data: null, error: null }); },
        then(res: any) { calls.push(ctx); return Promise.resolve(returns[table] ?? { data: null, error: null }).then(res); },
      };
      return chain;
    },
    _calls: calls,
  };
  return api;
}

describe('createProspectWithDraft', () => {
  it('vloží prospekta a k němu draft listing s pending_claim', async () => {
    const sb = fakeSupabase({
      'bazar_seed_prospects.single': { data: { id: 'P1', claim_token: 'TOK' }, error: null },
      'bazar_listings.single': { data: { id: 'L1' }, error: null },
    });
    const r = await createProspectWithDraft(sb, {
      adminId: 'A1',
      prospect: { name: 'Jan', phone: '777', email: 'a@b.cz', sourceUrl: 'http://x' },
      listing: { title: 'Traktor', description: 'popis', price: 100, category: 'traktory', location: 'Brno', phone: '777', email: 'a@b.cz' },
      imagePaths: ['p/1.jpg'],
    });
    expect(r.prospectId).toBe('P1');
    expect(r.claimToken).toBe('TOK');
    const listingInsert = sb._calls.find((c: any) => c.table === 'bazar_listings' && c._op === 'insert');
    expect(listingInsert._payload.status).toBe('pending_claim');
    expect(listingInsert._payload.seed_prospect_id).toBe('P1');
    expect(listingInsert._payload.user_id).toBeNull();
  });
});

describe('markProspectSent', () => {
  it('nastaví status sent a channel', async () => {
    const sb = fakeSupabase({ bazar_seed_prospects: { data: null, error: null } });
    await markProspectSent(sb, 'P1', 'email');
    const upd = sb._calls.find((c: any) => c._op === 'update');
    expect(upd._payload.status).toBe('sent');
    expect(upd._payload.channel).toBe('email');
    expect(upd._filters).toContainEqual(['id', 'P1']);
  });
});
