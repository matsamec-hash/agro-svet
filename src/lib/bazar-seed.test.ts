import { describe, it, expect, vi } from 'vitest';
import { createProspectWithDraft, markProspectSent, confirmProspect } from './bazar-seed';

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

describe('confirmProspect', () => {
  const baseProspect = {
    id: 'P1', email: 'a@b.cz', name: 'Jan', phone: '777',
    claim_token: 'TOK', token_expires_at: '2099-01-01T00:00:00Z',
    status: 'opened', user_id: null,
  };

  it('expirovaný token → chyba', async () => {
    const sb = fakeSupabase({
      'bazar_seed_prospects.single': { data: { ...baseProspect, token_expires_at: '2000-01-01T00:00:00Z' }, error: null },
    });
    await expect(confirmProspect(sb, {
      token: 'TOK', ip: '1.2.3.4', termsVersion: 'v1',
      ensureUser: async () => 'U1', now: new Date('2026-01-01T00:00:00Z'),
    })).rejects.toThrow(/expir/i);
  });

  it('už potvrzený token → chyba', async () => {
    const sb = fakeSupabase({
      'bazar_seed_prospects.single': { data: { ...baseProspect, status: 'confirmed' }, error: null },
    });
    await expect(confirmProspect(sb, {
      token: 'TOK', ip: '1.2.3.4', termsVersion: 'v1', ensureUser: async () => 'U1',
    })).rejects.toThrow(/potvrz/i);
  });

  it('platný token → vytvoří usera, zveřejní, zapíše audit', async () => {
    const sb = fakeSupabase({ 'bazar_seed_prospects.single': { data: baseProspect, error: null } });
    const ensureUser = vi.fn(async () => 'U1');
    const r = await confirmProspect(sb, {
      token: 'TOK', ip: '1.2.3.4', termsVersion: 'v1', ensureUser,
      now: new Date('2026-01-01T00:00:00Z'),
    });
    expect(ensureUser).toHaveBeenCalledWith({ email: 'a@b.cz', name: 'Jan', phone: '777' });
    expect(r.userId).toBe('U1');
    const listingUpd = sb._calls.find((c: any) => c.table === 'bazar_listings' && c._op === 'update');
    expect(listingUpd._payload.status).toBe('active');
    expect(listingUpd._payload.user_id).toBe('U1');
    const prospectUpd = sb._calls.find((c: any) => c.table === 'bazar_seed_prospects' && c._op === 'update');
    expect(prospectUpd._payload.status).toBe('confirmed');
    expect(prospectUpd._payload.confirmed_ip).toBe('1.2.3.4');
    expect(prospectUpd._payload.terms_version).toBe('v1');
  });
});
