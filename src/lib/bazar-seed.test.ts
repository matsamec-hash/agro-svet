import { describe, it, expect, vi } from 'vitest';
import { createProspectWithDraft, createProspect, markProspectSent, confirmProspect, getProspectByCode, addDraftListing } from './bazar-seed';

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
    const prospectInsert = sb._calls.find((c: any) => c.table === 'bazar_seed_prospects' && c._op === 'insert');
    expect(prospectInsert._payload.claim_code).toMatch(/^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}$/);
  });
});

describe('createProspect', () => {
  it('vloží prázdného prospekta (bez inzerátu) s kódem a tokenem', async () => {
    const sb = fakeSupabase({ 'bazar_seed_prospects.single': { data: { id: 'P9' }, error: null } });
    const r = await createProspect(sb, { adminId: 'A1', prospect: { name: 'Petr', phone: '777', email: '' } });
    expect(r.prospectId).toBe('P9');
    expect(r.claimCode).toMatch(/^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}$/);
    expect(r.claimToken).toBeTruthy();
    const ins = sb._calls.find((c: any) => c.table === 'bazar_seed_prospects' && c._op === 'insert');
    expect(ins._payload.name).toBe('Petr');
    expect(ins._payload.status).toBe('draft');
    expect(ins._payload.source_url).toBe('');
    expect(ins._payload.claim_code).toMatch(/^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}$/);
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
    const ownerUpd = sb._calls.find((c: any) => c.table === 'bazar_listings' && c._op === 'update' && c._payload.user_id === 'U1');
    expect(ownerUpd).toBeTruthy();
    const publishUpd = sb._calls.find((c: any) => c.table === 'bazar_listings' && c._op === 'update' && c._payload.status === 'active');
    expect(publishUpd).toBeTruthy();
    const prospectUpd = sb._calls.find((c: any) => c.table === 'bazar_seed_prospects' && c._op === 'update');
    expect(prospectUpd._payload.status).toBe('confirmed');
    expect(prospectUpd._payload.confirmed_ip).toBe('1.2.3.4');
    expect(prospectUpd._payload.terms_version).toBe('v1');
  });

  it('s listingIds zveřejní jen vybrané a všem nastaví user_id', async () => {
    const sb = fakeSupabase({ 'bazar_seed_prospects.single': { data: baseProspect, error: null } });
    await confirmProspect(sb, {
      token: 'TOK', ip: '1.2.3.4', termsVersion: 'v1', ensureUser: async () => 'U1',
      listingIds: ['L1', 'L2'], now: new Date('2026-01-01T00:00:00Z'),
    });
    const ownerUpd = sb._calls.find((c: any) => c.table === 'bazar_listings' && c._op === 'update'
      && c._payload.user_id === 'U1' && c._payload.status === undefined);
    expect(ownerUpd).toBeTruthy();
    expect(ownerUpd._filters).toContainEqual(['seed_prospect_id', 'P1']);
    const publishUpd = sb._calls.find((c: any) => c.table === 'bazar_listings' && c._op === 'update'
      && c._payload.status === 'active');
    expect(publishUpd._filters).toContainEqual(['id', ['L1', 'L2']]);
  });

  it('prázdný e-mail prospekta + args.email → použije zadaný e-mail a uloží ho', async () => {
    const sb = fakeSupabase({ 'bazar_seed_prospects.single': { data: { ...baseProspect, email: '' }, error: null } });
    const ensureUser = vi.fn(async () => 'U1');
    await confirmProspect(sb, {
      token: 'TOK', ip: '1.2.3.4', termsVersion: 'v1', ensureUser,
      listingIds: ['L1'], email: '  Seller@X.cz  ', now: new Date('2026-01-01T00:00:00Z'),
    });
    expect(ensureUser).toHaveBeenCalledWith({ email: 'Seller@X.cz', name: 'Jan', phone: '777' });
    const prospectUpd = sb._calls.find((c: any) => c.table === 'bazar_seed_prospects' && c._op === 'update');
    expect(prospectUpd._payload.email).toBe('Seller@X.cz');
  });

  it('prázdný e-mail prospekta + žádný args.email → chyba', async () => {
    const sb = fakeSupabase({ 'bazar_seed_prospects.single': { data: { ...baseProspect, email: '' }, error: null } });
    await expect(confirmProspect(sb, {
      token: 'TOK', ip: '1.2.3.4', termsVersion: 'v1', ensureUser: async () => 'U1', listingIds: ['L1'],
    })).rejects.toThrow(/e-mail/i);
  });
});

describe('addDraftListing — attributes', () => {
  it('zapíše attributes do insertu', async () => {
    const sb = fakeSupabase({ 'bazar_listings.single': { data: { id: 'L1' }, error: null } });
    await addDraftListing(sb, 'P1', {
      title: 'T', description: 'D', price: null, category: 'traktory', brand: 'zetor',
      location: '', phone: '', email: '', attributes: { klimatizace: true },
    }, []);
    const ins = sb._calls.find((c: any) => c.table === 'bazar_listings' && c._op === 'insert');
    expect(ins._payload.attributes).toEqual({ klimatizace: true });
  });
  it('když attributes chybí, zapíše prázdný objekt', async () => {
    const sb = fakeSupabase({ 'bazar_listings.single': { data: { id: 'L1' }, error: null } });
    await addDraftListing(sb, 'P1', {
      title: 'T', description: 'D', price: null, category: 'traktory',
      location: '', phone: '', email: '',
    }, []);
    const ins = sb._calls.find((c: any) => c.table === 'bazar_listings' && c._op === 'insert');
    expect(ins._payload.attributes).toEqual({});
  });
});

describe('getProspectByCode', () => {
  it('normalizuje kód na velká písmena a hledá podle claim_code', async () => {
    const sb = fakeSupabase({ 'bazar_seed_prospects.single': { data: { id: 'P1', claim_token: 'TOK' }, error: null } });
    const p = await getProspectByCode(sb, ' ab2c3d ');
    expect(p?.id).toBe('P1');
    const q = sb._calls.find((c: any) => c.table === 'bazar_seed_prospects');
    expect(q._filters).toContainEqual(['claim_code', 'AB2C3D']);
  });
});
