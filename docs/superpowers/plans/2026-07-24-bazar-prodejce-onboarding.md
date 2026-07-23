# Bazar — onboarding prodejců Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Umožnit adminovi předchystat víc inzerátů pod jeden účet prodejce a nechat ho je bezpečně zveřejnit (po jednom / hromadně) přes e-mailový odkaz nebo krátký kód na `/prodejce`.

**Architecture:** Rozšiřuje existující seed/claim flow (`bazar_seed_prospects` 1─N `bazar_listings`). Přidává (a) alfanumerický `claim_code` jako druhý vstup vedle `claim_token`, (b) selektivní publikaci ve `confirmProspect`, (c) admin UI po prodejcích s napojováním inzerátů na existující prospekty, (d) stránku `/prodejce` chráněnou Turnstile + IP rate-limitem. E-mail je hotový (předchozí commit).

**Tech Stack:** Astro (SSR, `prerender = false`), Supabase (service-role client, RLS), Vitest, Cloudflare Turnstile, Resend.

**Referenční spec:** [docs/superpowers/specs/2026-07-23-bazar-prodejce-onboarding-design.md](../specs/2026-07-23-bazar-prodejce-onboarding-design.md)

---

## File Structure

**Vytvořit:**
- `supabase/migrations/021_bazar_claim_code.sql` — `claim_code` + IP rate-limit tabulka
- `src/pages/prodejce/index.astro` — vstup kódem + claim pohled
- `src/pages/prodejce/api/verify-code.ts` — Turnstile + rate-limit → resolve prospekta
- `src/pages/admin/bazar/seed/api/remove-listing.ts` — smaž jeden draft
- `src/lib/bazar-code-ratelimit.ts` — per-IP throttle (DB-backed) + test

**Upravit:**
- `src/lib/bazar-seed-token.ts` — `generateClaimCode()`
- `src/lib/bazar-seed.ts` — `createProspectWithDraft` uloží `claim_code`; `confirmProspect` přijme `listingIds`; nové helpery `getProspectByCode`, `listOpenProspects`
- `src/pages/admin/bazar/seed/api/send.ts` — dopočítat a předat `listingCount`
- `src/pages/admin/bazar/seed/api/import.ts` — volitelný `prospectId` (napoj na existující prospekt)
- `src/pages/admin/bazar/seed/index.astro` — karty po prodejcích, výběr cíle importu, odebrat inzerát
- `src/pages/bazar/prevzit/[token].astro` — checkboxy per inzerát
- `src/pages/bazar/prevzit/api/confirm.ts` — předat `listingIds`
- `src/pages/bazar/moje/index.astro` — zobraz vlastní `pending_claim` drafty + akce „Zveřejnit"

**Testy:** `src/lib/bazar-seed-token.test.ts`, `src/lib/bazar-seed.test.ts`, `src/lib/bazar-code-ratelimit.test.ts`

---

## Phase 1 — Backend primitiva (pure, TDD)

### Task 1: Generátor kódu `generateClaimCode`

**Files:**
- Modify: `src/lib/bazar-seed-token.ts`
- Test: `src/lib/bazar-seed-token.test.ts`

- [ ] **Step 1: Přidej failing testy**

Do `src/lib/bazar-seed-token.test.ts` přidej na konec:

```typescript
import { generateClaimCode } from './bazar-seed-token';

describe('generateClaimCode', () => {
  it('má délku 6 a jen povolenou abecedu (bez 0 O 1 I L)', () => {
    for (let i = 0; i < 200; i++) {
      const c = generateClaimCode();
      expect(c).toHaveLength(6);
      expect(c).toMatch(/^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}$/);
    }
  });
  it('generuje různé kódy', () => {
    const set = new Set(Array.from({ length: 50 }, () => generateClaimCode()));
    expect(set.size).toBeGreaterThan(40);
  });
});
```

- [ ] **Step 2: Spusť test — musí selhat**

Run: `npx vitest run src/lib/bazar-seed-token.test.ts`
Expected: FAIL — `generateClaimCode is not a function`.

- [ ] **Step 3: Implementace**

Do `src/lib/bazar-seed-token.ts` přidej:

```typescript
// Abeceda bez matoucích znaků (0/O, 1/I/L) — kód se dá nadiktovat po telefonu.
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

/** 6znakový alfanumerický kód pro vstup na /prodejce. ~31^6 ≈ 0,9 mld kombinací. */
export function generateClaimCode(): string {
  const bytes = randomBytes(6);
  let out = '';
  for (let i = 0; i < 6; i++) {
    out += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }
  return out;
}
```

- [ ] **Step 4: Spusť test — projde**

Run: `npx vitest run src/lib/bazar-seed-token.test.ts`
Expected: PASS (všechny bloky).

- [ ] **Step 5: Commit**

```bash
git add src/lib/bazar-seed-token.ts src/lib/bazar-seed-token.test.ts
git commit -m "bazar: generátor 6znakového claim kódu (bez matoucích znaků)"
```

---

### Task 2: `createProspectWithDraft` ukládá `claim_code`

**Files:**
- Modify: `src/lib/bazar-seed.ts:29-51` (funkce `createProspectWithDraft`)
- Test: `src/lib/bazar-seed.test.ts`

- [ ] **Step 1: Rozšiř test**

V `src/lib/bazar-seed.test.ts`, v testu „vloží prospekta…", přidej za existující asserty:

```typescript
    const prospectInsert = sb._calls.find((c: any) => c.table === 'bazar_seed_prospects' && c._op === 'insert');
    expect(prospectInsert._payload.claim_code).toMatch(/^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}$/);
```

- [ ] **Step 2: Spusť test — selže**

Run: `npx vitest run src/lib/bazar-seed.test.ts`
Expected: FAIL — `claim_code` je `undefined`.

- [ ] **Step 3: Implementace**

V `src/lib/bazar-seed.ts`:
- rozšiř import: `import { generateClaimToken, generateClaimCode, isTokenExpired } from './bazar-seed-token';`
- v `createProspectWithDraft` za `const claimToken = generateClaimToken();` přidej `const claimCode = generateClaimCode();`
- do `.insert({...})` prospekta přidej pole `claim_code: claimCode,`

- [ ] **Step 4: Spusť test — projde**

Run: `npx vitest run src/lib/bazar-seed.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/bazar-seed.ts src/lib/bazar-seed.test.ts
git commit -m "bazar: prospekt dostává claim_code při vytvoření"
```

---

### Task 3: `confirmProspect` — selektivní publikace přes `listingIds`

**Files:**
- Modify: `src/lib/bazar-seed.ts` (funkce `confirmProspect`, ~řádek 140-171)
- Test: `src/lib/bazar-seed.test.ts`

- [ ] **Step 1: Přidej testy**

Do bloku `describe('confirmProspect', …)` v `src/lib/bazar-seed.test.ts` přidej:

```typescript
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
```

- [ ] **Step 2: Spusť test — selže**

Run: `npx vitest run src/lib/bazar-seed.test.ts`
Expected: FAIL — `confirmProspect` neumí `listingIds`, dělá jen jeden listings update.

- [ ] **Step 3: Implementace**

V `src/lib/bazar-seed.ts` uprav signaturu a tělo `confirmProspect`. Přidej `listingIds?: string[]` do args a nahraď blok „publikace inzerátů":

```typescript
export async function confirmProspect(
  supabase: SupabaseClient,
  args: { token: string; ip: string; termsVersion: string; ensureUser: EnsureUser; listingIds?: string[]; now?: Date },
): Promise<{ userId: string; prospectId: string }> {
  const now = args.now ?? new Date();
  const prospect = await getProspectByToken(supabase, args.token);
  if (!prospect) throw new Error('Neplatný odkaz.');
  if (prospect.status === 'confirmed') throw new Error('Tento inzerát už byl potvrzen.');
  if (isTokenExpired(prospect.token_expires_at, now)) throw new Error('Platnost odkazu vypršela (expiroval).');

  const userId = await args.ensureUser({ email: prospect.email, name: prospect.name, phone: prospect.phone });

  // Vlastníka nastavíme VŠEM inzerátům prospekta (i těm, co teď prodejce nevybral —
  // zůstanou jako jeho neveřejný draft v /bazar/moje/, nezmizí).
  const { error: ownErr } = await supabase
    .from('bazar_listings')
    .update({ user_id: userId })
    .eq('seed_prospect_id', prospect.id);
  if (ownErr) throw new Error(`assign owner: ${ownErr.message}`);

  // Zveřejníme jen vybrané. Když listingIds nezadané → zveřejni všechny (zpětná kompatibilita).
  const publish = supabase.from('bazar_listings').update({ status: 'active' }).eq('seed_prospect_id', prospect.id);
  const { error: lErr } = await (args.listingIds && args.listingIds.length
    ? publish.in('id', args.listingIds)
    : publish);
  if (lErr) throw new Error(`publish listings: ${lErr.message}`);

  const { error: pErr } = await supabase
    .from('bazar_seed_prospects')
    .update({
      status: 'confirmed',
      confirmed_at: now.toISOString(),
      confirmed_ip: args.ip,
      terms_version: args.termsVersion,
      user_id: userId,
    })
    .eq('id', prospect.id);
  if (pErr) throw new Error(`confirm prospect: ${pErr.message}`);

  return { userId, prospectId: prospect.id };
}
```

- [ ] **Step 4: Spusť testy — projdou (i staré)**

Run: `npx vitest run src/lib/bazar-seed.test.ts`
Expected: PASS — starý test „platný token → zveřejní" pořád projde (bez listingIds = publish všech), nový projde.

- [ ] **Step 5: Commit**

```bash
git add src/lib/bazar-seed.ts src/lib/bazar-seed.test.ts
git commit -m "bazar: confirmProspect umí selektivní publikaci (listingIds); nevybrané zůstanou jako draft usera"
```

---

## Phase 2 — Migrace + rate-limit

### Task 4: Migrace 021 — `claim_code` + IP rate-limit tabulka

**Files:**
- Create: `supabase/migrations/021_bazar_claim_code.sql`

- [ ] **Step 1: Napiš migraci**

```sql
-- 021: /prodejce vstup přes krátký kód + IP rate-limit

-- 1) Alfanumerický kód na prospektovi (druhý vstup vedle claim_token).
ALTER TABLE bazar_seed_prospects ADD COLUMN claim_code text UNIQUE;
CREATE INDEX idx_bazar_seed_prospects_code ON bazar_seed_prospects(claim_code);

-- 2) Per-IP pokusy o zadání kódu (defense-in-depth vedle Turnstile).
CREATE TABLE bazar_code_attempts (
  id bigserial PRIMARY KEY,
  ip text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_bazar_code_attempts_ip_time ON bazar_code_attempts(ip, created_at);

-- Jen service role (žádná policy → default deny pro anon/authenticated).
ALTER TABLE bazar_code_attempts ENABLE ROW LEVEL SECURITY;
```

- [ ] **Step 2: Aplikuj na self-hosted DB**

Migrace se na produkci pouští ručně (viz `reference-svetovestadiony-migrations` konvence projektu — self-hosted Supabase). Lokálně/na prod přes `psql`:
Run: `psql "$SUPABASE_DB_URL" -f supabase/migrations/021_bazar_claim_code.sql`
Expected: `ALTER TABLE` / `CREATE INDEX` / `CREATE TABLE` bez chyby.
> Pozn.: prod = self-hosted `supabase.samecdigital.com`. Pokud nemáš přímý přístup, aplikaci migrace potvrď s uživatelem (JÁ) — nasazuje ručně.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/021_bazar_claim_code.sql
git commit -m "bazar: migrace 021 — claim_code + IP rate-limit tabulka"
```

---

### Task 5: Per-IP rate-limit helper

**Files:**
- Create: `src/lib/bazar-code-ratelimit.ts`
- Test: `src/lib/bazar-code-ratelimit.test.ts`

- [ ] **Step 1: Napiš failing test**

`src/lib/bazar-code-ratelimit.test.ts`:

```typescript
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
```

- [ ] **Step 2: Spusť test — selže**

Run: `npx vitest run src/lib/bazar-code-ratelimit.test.ts`
Expected: FAIL — modul neexistuje.

- [ ] **Step 3: Implementace**

`src/lib/bazar-code-ratelimit.ts`:

```typescript
import type { SupabaseClient } from '@supabase/supabase-js';

export const MAX_ATTEMPTS_PER_WINDOW = 10;
export const WINDOW_MINUTES = 10;

/** Zaznamená pokus o zadání kódu z dané IP (pro rate-limit okno). */
export async function recordCodeAttempt(supabase: SupabaseClient, ip: string): Promise<void> {
  await supabase.from('bazar_code_attempts').insert({ ip });
}

/** True když IP v posledních WINDOW_MINUTES překročila MAX_ATTEMPTS_PER_WINDOW pokusů. */
export async function isRateLimited(supabase: SupabaseClient, ip: string): Promise<boolean> {
  const since = new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString();
  const { count } = await supabase
    .from('bazar_code_attempts')
    .select('id', { count: 'exact', head: true })
    .eq('ip', ip)
    .gte('created_at', since);
  return (count ?? 0) >= MAX_ATTEMPTS_PER_WINDOW;
}
```

- [ ] **Step 4: Spusť test — projde**

Run: `npx vitest run src/lib/bazar-code-ratelimit.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/bazar-code-ratelimit.ts src/lib/bazar-code-ratelimit.test.ts
git commit -m "bazar: per-IP rate-limit helper pro /prodejce kód"
```

---

## Phase 3 — Backend helpery pro prospekt (lookup by code, seznam otevřených)

### Task 6: `getProspectByCode` + `listOpenProspects` v bazar-seed.ts

**Files:**
- Modify: `src/lib/bazar-seed.ts`
- Test: `src/lib/bazar-seed.test.ts`

- [ ] **Step 1: Přidej test**

```typescript
import { getProspectByCode } from './bazar-seed';

describe('getProspectByCode', () => {
  it('normalizuje kód na velká písmena a hledá podle claim_code', async () => {
    const sb = fakeSupabase({ 'bazar_seed_prospects.single': { data: { id: 'P1', claim_token: 'TOK' }, error: null } });
    const p = await getProspectByCode(sb, ' ab2c3d ');
    expect(p?.id).toBe('P1');
    const q = sb._calls.find((c: any) => c.table === 'bazar_seed_prospects');
    expect(q._filters).toContainEqual(['claim_code', 'AB2C3D']);
  });
});
```

- [ ] **Step 2: Spusť test — selže**

Run: `npx vitest run src/lib/bazar-seed.test.ts`
Expected: FAIL — `getProspectByCode` neexistuje.

- [ ] **Step 3: Implementace**

Do `src/lib/bazar-seed.ts` přidej (vedle `getProspectByToken`):

```typescript
/** Načte prospekta podle zadaného kódu (case-insensitive, trim). null když neexistuje. */
export async function getProspectByCode(supabase: SupabaseClient, code: string): Promise<ProspectRow | null> {
  const normalized = code.trim().toUpperCase();
  if (!/^[A-Z0-9]{6}$/.test(normalized)) return null;
  const { data } = await supabase
    .from('bazar_seed_prospects')
    .select('id, email, name, phone, claim_token, token_expires_at, status, user_id')
    .eq('claim_code', normalized)
    .single();
  return (data as ProspectRow) ?? null;
}

/** Prospekti, na které jde ještě věšet inzeráty (nezpotvrzené). Pro admin select „přidat k prodejci". */
export async function listOpenProspects(
  supabase: SupabaseClient,
): Promise<Array<{ id: string; name: string; email: string }>> {
  const { data } = await supabase
    .from('bazar_seed_prospects')
    .select('id, name, email')
    .in('status', ['draft', 'sent', 'opened'])
    .order('created_at', { ascending: false });
  return (data as Array<{ id: string; name: string; email: string }>) ?? [];
}
```

- [ ] **Step 4: Spusť test — projde**

Run: `npx vitest run src/lib/bazar-seed.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/bazar-seed.ts src/lib/bazar-seed.test.ts
git commit -m "bazar: getProspectByCode + listOpenProspects"
```

---

## Phase 4 — Napojení e-mailu a importu

### Task 7: `send.ts` předává `listingCount`

**Files:**
- Modify: `src/pages/admin/bazar/seed/api/send.ts:38-52`

- [ ] **Step 1: Uprav dotaz na počet draftů + předání**

V `send.ts` nahraď blok, který načítá jeden `listing.title`, tímto (načte titul prvního draftu + počet):

```typescript
  const { data: listings } = await supabase
    .from('bazar_listings')
    .select('title')
    .eq('seed_prospect_id', prospectId);
  const listingCount = listings?.length ?? 1;
  const firstTitle = (listings?.[0]?.title as string) ?? 'Váš inzerát';

  const ok = await sendClaimEmail(getEnvVar('RESEND_API_KEY') ?? '', prospect.email as string, {
    name: (prospect.name as string) ?? '',
    token: prospect.claim_token as string,
    listingTitle: firstTitle,
    listingCount,
  });
```

- [ ] **Step 2: Typecheck**

Run: `npx astro check 2>&1 | grep -A2 send.ts || echo "OK bez chyb v send.ts"`
Expected: žádná chyba v `send.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/admin/bazar/seed/api/send.ts
git commit -m "bazar: claim e-mail dostává počet inzerátů prospekta"
```

---

### Task 8: `import.ts` — volitelné napojení na existující prospekt

**Files:**
- Modify: `src/pages/admin/bazar/seed/api/import.ts`
- Modify: `src/lib/bazar-seed.ts` (`addDraftListing` už existuje — použije se)

- [ ] **Step 1: Přidej `attachDraftFromBazos` helper do bazar-seed.ts**

Aby import uměl „napoj na existující prospekt", vytáhneme z `importOne` sestavení draftu. Nejjednodušší bez velkého refaktoru: v `import.ts` do `importOne` přidej parametr `targetProspectId?: string` a na konci místo `createProspectWithDraft` větvi:

```typescript
    if (targetProspectId) {
      const listingId = await addDraftListing(supabase, targetProspectId, {
        title: structured.title,
        description,
        price: parsed.price,
        category: structured.category,
        brand: structured.brand,
        location: parsed.location ?? '',
        phone: contact.phone ?? parsed.phone ?? '',
        email: contact.email ?? '',
        yearOfManufacture: structured.year,
        powerHp: structured.powerHp,
        hoursOperated: structured.hours,
        latitude,
        longitude,
      }, imagePaths);
      return { ok: true, title: structured.title, imageCount: imagePaths.length, imageUrlsFound: parsed.imageUrls.length, imageDebug, prospectId: targetProspectId, listingId };
    }

    const result = await createProspectWithDraft(supabase, { /* … beze změny … */ });
```

Uprav import v hlavičce souboru: `import { createProspectWithDraft, addDraftListing } from '../../../../../lib/bazar-seed';`

- [ ] **Step 2: Propaguj `targetProspectId` z POST handleru**

V `POST` za `const contact = body?.contact ?? {};` přidej:

```typescript
  const targetProspectId = typeof body?.prospectId === 'string' && body.prospectId ? body.prospectId : undefined;
```

A do všech volání `importOne(...)` přidej poslední argument `targetProspectId`:
- v batch smyčce: `await importOne(supabase, u, contact, user.id, targetProspectId)`
- v single: `await importOne(supabase, url, contact, user.id, targetProspectId)`

A uprav signaturu `importOne(...)` o `targetProspectId?: string`.

- [ ] **Step 3: Typecheck**

Run: `npx astro check 2>&1 | grep -A2 import.ts || echo "OK"`
Expected: bez chyb v `import.ts`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/admin/bazar/seed/api/import.ts src/lib/bazar-seed.ts
git commit -m "bazar: import umí napojit inzerát na existující prospekt (prospectId)"
```

---

### Task 9: Admin API — odebrat jeden draft

**Files:**
- Create: `src/pages/admin/bazar/seed/api/remove-listing.ts`

- [ ] **Step 1: Napiš route (vzor podle send.ts — admin gate)**

```typescript
import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../../lib/supabase';

export const prerender = false;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) return json({ error: 'unauthenticated' }, 401);
  const supabase = createServerClient();
  const { data: profile } = await supabase.from('bazar_users').select('is_admin').eq('id', user.id).maybeSingle();
  if (!(profile as { is_admin?: boolean } | null)?.is_admin) return json({ error: 'forbidden' }, 403);

  const body = await request.json().catch(() => null);
  const listingId = typeof body?.listingId === 'string' ? body.listingId : '';
  if (!listingId) return json({ error: 'Chybí listingId' }, 400);

  // Smaž jen NEVEŘEJNÝ draft (živé inzeráty se přes tohle mazat nesmí).
  const { data, error } = await supabase
    .from('bazar_listings')
    .delete()
    .eq('id', listingId)
    .eq('status', 'pending_claim')
    .select('id');
  if (error) return json({ error: error.message }, 500);
  if (!data?.length) return json({ error: 'Inzerát nenalezen nebo už je zveřejněný' }, 422);
  return json({ ok: true });
};
```

- [ ] **Step 2: Typecheck**

Run: `npx astro check 2>&1 | grep -A2 remove-listing || echo "OK"`
Expected: bez chyb.

- [ ] **Step 3: Commit**

```bash
git add src/pages/admin/bazar/seed/api/remove-listing.ts
git commit -m "bazar: admin API — odebrat jeden pending_claim draft"
```

---

## Phase 5 — Admin UI: karty po prodejcích

### Task 10: `/admin/bazar/seed/` — seskupení po prodejcích + cíl importu + odebrat

**Files:**
- Modify: `src/pages/admin/bazar/seed/index.astro`

- [ ] **Step 1: Načti VŠECHNY drafty a seznam otevřených prospektů**

V frontmatteru nahraď `draftByProspect` (bere jen 1. draft) mapou na **pole** draftů a přidej seznam pro select:

```typescript
import { listOpenProspects } from '../../../../lib/bazar-seed';
// …
type Draft = { id: string; title: string; price: number | null; status: string };
const draftsByProspect = new Map<string, Draft[]>();
if (prospectIds.length > 0) {
  const { data: drafts } = await supabase
    .from('bazar_listings')
    .select('id, seed_prospect_id, title, price, status')
    .in('seed_prospect_id', prospectIds);
  for (const d of drafts ?? []) {
    const row = d as { id: string; seed_prospect_id?: string; title?: string; price?: number | null; status?: string };
    if (!row.seed_prospect_id) continue;
    const arr = draftsByProspect.get(row.seed_prospect_id) ?? [];
    arr.push({ id: row.id, title: row.title ?? '', price: row.price ?? null, status: row.status ?? '' });
    draftsByProspect.set(row.seed_prospect_id, arr);
  }
}
const openProspects = await listOpenProspects(supabase);
```

- [ ] **Step 2: Přidej select „cíl importu" do obou import formulářů**

Do `#importForm` i `#batchForm` přidej jako první pole:

```html
<select name="prospectId" class="form-select sm:col-span-2">
  <option value="">➕ Nový prodejce</option>
  {openProspects.map((p) => (
    <option value={p.id}>{p.name || p.email || 'Prodejce'} ({p.email})</option>
  ))}
</select>
```

- [ ] **Step 3: Překlop tabulku na karty po prodejcích**

Nahraď `<table>…</table>` výpisem karet. Pro každý prospekt vypiš hlavičku (jméno/e-mail/telefon/stav/kód + akce poslat/kopírovat/WhatsApp/smazat) a pod ní seznam jeho draftů z `draftsByProspect.get(p.id)`, u každého: titul, cena, `Náhled`, a tlačítko `Odebrat` (`data-id={draft.id}` třída `removeListingBtn`). Kód prospekta zobraz `data-code` na tlačítku „Kopírovat kód". Použij existující třídy (`section-label`, `btn-outline`, `link-underline`) pro konzistenci s webem.

Klíčové: náhled draftu je `/bazar/${draft.id}/?preview=${p.claim_token}`.

- [ ] **Step 4: JS — pošli `prospectId` v importu + odebrání draftu**

V klientském `<script>`:
- u `#importForm` a `#batchForm` přibal `prospectId: form.get('prospectId')` do JSON body (POST na `/admin/bazar/seed/api/import`).
- přidej handler pro `.removeListingBtn`:

```javascript
document.querySelectorAll('.removeListingBtn').forEach((btn) => {
  btn.addEventListener('click', async () => {
    if (!confirm('Odebrat tento připravený inzerát? Zůstane pouze tento inzerát smazán.')) return;
    const res = await fetch('/admin/bazar/seed/api/remove-listing/', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ listingId: btn.getAttribute('data-id') }),
    });
    if (res.ok) location.reload();
    else alert('Nepodařilo se odebrat: ' + (await res.json()).error);
  });
});
```

- [ ] **Step 5: Ověř v prohlížeči (dev server)**

Run: `npm run dev` a otevři `http://localhost:4321/admin/bazar/seed/` (přihlášený admin).
Expected: prospekti jako karty; import má select „Nový prodejce / …"; u draftu funguje Odebrat; po importu s vybraným prodejcem přibude druhý inzerát pod tou samou kartou.

- [ ] **Step 6: Commit**

```bash
git add src/pages/admin/bazar/seed/index.astro
git commit -m "bazar admin: karty po prodejcích, cíl importu, odebrat inzerát"
```

---

## Phase 6 — Publikace po jednom (claim + moje)

### Task 11: `/bazar/prevzit/[token]` — checkboxy per inzerát

**Files:**
- Modify: `src/pages/bazar/prevzit/[token].astro`
- Modify: `src/pages/bazar/prevzit/api/confirm.ts`

- [ ] **Step 1: Přidej checkbox do každé karty inzerátu**

V mapě `listings.map((l) => …)` přidej na začátek karty:

```html
<label class="flex items-center gap-2 mb-2 text-sm font-medium">
  <input type="checkbox" name="listing_ids" value={l.id} checked class="listingChk" />
  Zveřejnit tento inzerát
</label>
```

Přesun tuto `<label>` a `<article>` DOVNITŘ hlavního `<form>` (aby checkboxy odešly s POST). Pokud jsou dnes inzeráty mimo form, obal seznam i confirm form jedním `<form method="POST" action="/bazar/prevzit/api/confirm/">`.

- [ ] **Step 2: Uprav CTA text + „vybrat vše"**

Tlačítko změň na `Zveřejnit vybrané`. Nad seznam přidej:

```html
<label class="text-sm"><input type="checkbox" id="selectAllListings" checked /> Vybrat vše</label>
<script>
  const all = document.getElementById('selectAllListings');
  all?.addEventListener('change', () => {
    document.querySelectorAll('.listingChk').forEach((c) => { (c as HTMLInputElement).checked = (all as HTMLInputElement).checked; });
  });
</script>
```

- [ ] **Step 3: `confirm.ts` — čti `listing_ids` a předej do confirmProspect**

V `src/pages/bazar/prevzit/api/confirm.ts` za načtení `agree` přidej:

```typescript
  const listingIds = form.getAll('listing_ids').map((v) => v.toString()).filter(Boolean);
  if (!listingIds.length) return new Response('Vyberte alespoň jeden inzerát ke zveřejnění', { status: 400 });
```

A do volání `confirmProspect(supabase, { token, ip, termsVersion, ensureUser })` přidej `listingIds`.

- [ ] **Step 4: Ověř v prohlížeči**

Run: dev server, otevři platný `/bazar/prevzit/<token>` (seedni testovacího prospekta se 2 drafty).
Expected: odškrtnutí jednoho inzerátu → po „Zveřejnit vybrané" je živý jen vybraný; druhý zůstane a objeví se v `/bazar/moje/` jako neveřejný.

- [ ] **Step 5: Commit**

```bash
git add src/pages/bazar/prevzit/[token].astro src/pages/bazar/prevzit/api/confirm.ts
git commit -m "bazar: publikace po jednom na claim stránce (checkboxy + listing_ids)"
```

---

### Task 12: `/bazar/moje` — zveřejnění zbylých draftů

**Files:**
- Modify: `src/pages/bazar/moje/index.astro`

- [ ] **Step 1: Přidej akci `publish` do POST handleru**

V bloku `if (Astro.request.method === 'POST')` přidej větev:

```typescript
    } else if (action === 'publish') {
      const newExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      await supabase.from('bazar_listings')
        .update({ status: 'active', expires_at: newExpiry, updated_at: new Date().toISOString() })
        .eq('id', listingId).eq('user_id', user.id).eq('status', 'pending_claim');
    }
```

- [ ] **Step 2: Ukaž `pending_claim` drafty jako „Připraveno" + tlačítko Zveřejnit**

Dotaz `listings` už bere `status`. V renderu inzerátu, kde je status, přidej: pro `status === 'pending_claim'` zobraz štítek „Připraveno ke zveřejnění" a formulář:

```html
<form method="POST" style="display:inline">
  <input type="hidden" name="action" value="publish" />
  <input type="hidden" name="listing_id" value={l.id} />
  <button class="btn-primary" type="submit">Zveřejnit</button>
</form>
```

- [ ] **Step 3: Ověř v prohlížeči**

Run: dev server, přihlaš prodejce s neveřejným draftem (z Task 11), otevři `/bazar/moje/`.
Expected: draft je vidět jako „Připraveno"; po „Zveřejnit" je `active` a viditelný v bazaru.

- [ ] **Step 4: Commit**

```bash
git add src/pages/bazar/moje/index.astro
git commit -m "bazar/moje: zveřejnění zbylých pending_claim draftů"
```

---

## Phase 7 — Stránka /prodejce (kód)

### Task 13: `/prodejce/api/verify-code` — Turnstile + rate-limit → session

**Files:**
- Create: `src/pages/prodejce/api/verify-code.ts`

- [ ] **Step 1: Napiš route**

Vzor kombinuje Turnstile (`verifyTurnstile`), rate-limit (`isRateLimited`/`recordCodeAttempt`), lookup (`getProspectByCode`) a stejné auto-login cookies jako `prevzit/api/confirm.ts`. Chová se jako „přihlas prodejce k jeho prospektovi a přesměruj na claim pohled".

```typescript
import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase';
import { getEnvVar } from '../../../lib/env';
import { verifyTurnstile } from '../../../lib/contest-turnstile';
import { isRateLimited, recordCodeAttempt } from '../../../lib/bazar-code-ratelimit';
import { getProspectByCode } from '../../../lib/bazar-seed';
import { isTokenExpired } from '../../../lib/bazar-seed-token';
import { SITE_URL } from '../../../lib/config';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const supabase = createServerClient();
  const form = await request.formData();
  const code = form.get('code')?.toString() ?? '';
  const turnstileToken = form.get('cf-turnstile-response')?.toString() ?? '';
  const ip = request.headers.get('cf-connecting-ip') ?? clientAddress ?? 'unknown';

  if (await isRateLimited(supabase, ip)) {
    return redirectBack('Příliš mnoho pokusů. Zkuste to za pár minut.');
  }
  await recordCodeAttempt(supabase, ip);

  const okTurnstile = await verifyTurnstile(getEnvVar('TURNSTILE_SECRET_KEY') ?? '', turnstileToken, ip);
  if (!okTurnstile) return redirectBack('Ověření robota selhalo, zkuste to znovu.');

  const prospect = await getProspectByCode(supabase, code);
  if (!prospect) return redirectBack('Kód neplatí. Zkontrolujte ho prosím.');
  if (prospect.status === 'confirmed') return Response.redirect(`${SITE_URL}/bazar/moje/`, 303);
  if (isTokenExpired(prospect.token_expires_at)) return redirectBack('Platnost kódu vypršela.');

  // Přesměruj na claim pohled tokenem prospekta (sdílí stránku a publikaci po jednom).
  return Response.redirect(`${SITE_URL}/bazar/prevzit/${prospect.claim_token}`, 303);
};

function redirectBack(msg: string): Response {
  return Response.redirect(`${SITE_URL}/prodejce/?error=${encodeURIComponent(msg)}`, 303);
}
```

> Pozn.: `TURNSTILE_SECRET_KEY` už na webu je (fotosoutěž). Sdílí se stejný klíč/pár.

- [ ] **Step 2: Typecheck**

Run: `npx astro check 2>&1 | grep -A2 verify-code || echo "OK"`
Expected: bez chyb.

- [ ] **Step 3: Commit**

```bash
git add src/pages/prodejce/api/verify-code.ts
git commit -m "bazar: /prodejce verify-code API (Turnstile + rate-limit → claim pohled)"
```

---

### Task 14: `/prodejce` stránka — formulář s kódem + Turnstile widget

**Files:**
- Create: `src/pages/prodejce/index.astro`

- [ ] **Step 1: Napiš stránku**

Použij `Layout`, `section-label`, `btn-primary`, `form-input`. Turnstile widget vlož jako na fotosoutěži (najdi vzor: `grep -rl "cf-turnstile" src/pages src/components`) — stejný `data-sitekey` z `PUBLIC_TURNSTILE_SITE_KEY` a `<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer>`.

```astro
---
export const prerender = false;
import Layout from '../../layouts/Layout.astro';
import { getEnvVar } from '../../lib/env';
const siteKey = getEnvVar('PUBLIC_TURNSTILE_SITE_KEY') ?? '';
const error = Astro.url.searchParams.get('error');
---
<Layout title="Vaše připravené inzeráty — Agro-svět bazar">
  <main style="max-width:520px;margin:0 auto;padding:56px 24px 80px;">
    <span class="section-label">Agro bazar</span>
    <h1 style="font-size:clamp(1.8rem,4vw,2.5rem);">Zadejte svůj kód</h1>
    <p style="color:#555;margin:12px 0 24px;line-height:1.6;">
      Poslali jsme vám 6místný kód. Zadejte ho níže a uvidíte všechny inzeráty, které jsme vám
      připravili — zdarma je zveřejníte nebo smažete.
    </p>
    {error && <p style="color:#b00020;margin-bottom:16px;">{error}</p>}
    <form method="POST" action="/prodejce/api/verify-code/">
      <div class="form-group">
        <label for="code">Kód</label>
        <input id="code" name="code" class="form-input" required maxlength="6"
          autocomplete="one-time-code" autocapitalize="characters" spellcheck="false"
          style="text-transform:uppercase;letter-spacing:4px;font-size:20px;text-align:center;" placeholder="ABC234" />
      </div>
      <div class="cf-turnstile" data-sitekey={siteKey} style="margin:16px 0;"></div>
      <button type="submit" class="btn-primary" style="width:100%;justify-content:center;">Zobrazit moje inzeráty</button>
    </form>
    <p style="color:#888;font-size:13px;margin-top:20px;">
      Máte odkaz z e-mailu? Stačí na něj kliknout — kód pak nepotřebujete.
    </p>
  </main>
  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
</Layout>
```

- [ ] **Step 2: Ověř v prohlížeči**

Run: dev server, otevři `http://localhost:4321/prodejce/`.
Expected: formulář s velkým polem na kód + Turnstile. Zadání kódu seednutého prospekta (z admin karty „Kopírovat kód") přesměruje na jeho claim pohled se seznamem inzerátů. Špatný kód → chybová hláška. `?error=` se vypisuje.

- [ ] **Step 3: Commit**

```bash
git add src/pages/prodejce/index.astro
git commit -m "bazar: /prodejce stránka — vstup kódem + Turnstile"
```

---

## Phase 8 — Finální kontrola

### Task 15: Plný test + build

- [ ] **Step 1: Celá test suite**

Run: `npx vitest run src/lib/bazar-seed.test.ts src/lib/bazar-seed-token.test.ts src/lib/bazar-seed-email.test.ts src/lib/bazar-code-ratelimit.test.ts`
Expected: vše PASS.

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: build projde bez chyb (pozor na `/statistiky` build block — pokud spadne jinde než na naší práci, viz `reference-agro-svet-statistiky-build-block`).

- [ ] **Step 3: Commit (pokud build vynutil drobnost)**

```bash
git add -A && git commit -m "bazar: onboarding prodejců — finální kontrola" || echo "nic k commitu"
```

---

## Self-review — pokrytí spec

- ✅ Admin karty po prodejcích → Task 10
- ✅ Import napojí na existující prospekt → Task 8
- ✅ Odebrat inzerát → Task 9 + Task 10 (UI)
- ✅ Publikace po jednom → Task 3 (backend) + Task 11 (UI) + Task 12 (/moje zbytek)
- ✅ E-mail listingCount → Task 7 (e-mail sám hotový v předchozím commitu)
- ✅ 6znakový kód bez matoucích znaků → Task 1; uložení → Task 2; migrace → Task 4
- ✅ /prodejce + Turnstile + rate-limit → Task 5, 13, 14
- ✅ Ověření e-mailem = existující magic-link login (claim confirm zakládá+přihlašuje účet) → beze změny, využito v Task 11
- ✅ Testy generátoru, confirmProspect, rate-limit, kód lookup → Task 1, 3, 5, 6

**Mimo rozsah (dle spec):** placená SMS brána — neimplementuje se.
