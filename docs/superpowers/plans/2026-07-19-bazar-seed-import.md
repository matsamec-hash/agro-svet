# Agro Bazar — Seeding & Import Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Umožnit adminovi předchystat neveřejné inzeráty (import z URL + AI SEO přepis) a nechat prodejce je potvrdit/zveřejnit přes jednorázový magic-link odkaz.

**Architecture:** Nová tabulka `bazar_seed_prospects` drží kontakt + claim token + audit souhlasu; draft inzeráty žijí v `bazar_listings` ve stavu `pending_claim` s `user_id=NULL`. Admin sekce `/admin/bazar/seed` importuje z URL (best-effort parser + AI přepis) a rozesílá odkaz (Resend / ruční WhatsApp). Claim stránka `/bazar/prevzit/[token]` po souhlasu vytvoří passwordless účet přes service role a inzeráty zveřejní. Logika je izolovaná do čistých modulů v `src/lib/` (TDD ve vitest), Astro stránky/API jsou tenké slupky nad nimi.

**Tech Stack:** Astro 6 (SSR, `@astrojs/node`), Supabase (`@supabase/supabase-js`, service role), Resend, Anthropic Messages API (`fetch`, model `claude-haiku-4-5-20251001`), vitest + happy-dom.

---

## Předpoklady a konvence

- **Testy:** `npm test` = `vitest run --passWithNoTests`. Testy dávej vedle modulu jako `src/lib/<name>.test.ts`. V repu zatím žádné testy nejsou — tenhle plán je zavádí pro nové čisté moduly.
- **Supabase server klient:** `import { createServerClient } from '../lib/supabase'` → service role, **obchází RLS**. Používá se ve všech SSR stránkách a API (viz `src/pages/bazar/novy.astro`).
- **Env:** čte se přes `getEnvVar('NAME')` (`src/lib/env.ts`). Nové proměnné: `ANTHROPIC_API_KEY` (volitelná — bez ní se AI přepis přeskočí). `RESEND_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` už existují.
- **Migrace:** SQL soubory v `supabase/migrations/`, číslované. Poslední je `016_akce_schema.sql` → nová je **`017_`**. Aplikuje se ručně (viz reference projektu), tento plán je jen vytváří.
- **Admin gating:** `/admin/*` je chráněné middlewarem (`src/middleware.ts`, `ADMIN_PATHS`). Každá admin stránka/endpoint navíc ověří `locals.user?.is_admin` a jinak vrátí 403 / redirect.
- **Deploy:** Cloudflare Worker (`wrangler deploy`). Prod secrety (RESEND, ANTHROPIC) se přidají do CF secrets zvlášť — mimo tento plán.

## Mapa souborů

**Nové moduly (čistá logika, TDD):**
- `src/lib/bazar-seed-token.ts` — generování + validace claim tokenu.
- `src/lib/bazar-import-parse.ts` — parser Bazoš HTML → strukturovaná data.
- `src/lib/bazar-import-category.ts` — heuristický návrh kategorie z názvu/popisu.
- `src/lib/bazar-import-rewrite.ts` — AI SEO přepis (LLM za injektovatelným rozhraním).
- `src/lib/bazar-seed.ts` — datová vrstva prospektů (create/get/confirm) nad Supabase klientem.
- `src/lib/bazar-seed-email.ts` — Resend pozvánkový e-mail.

**Nové Astro stránky / API:**
- `src/pages/admin/bazar/seed/index.astro` — seznam prospektů + formulář importu.
- `src/pages/admin/bazar/seed/api/import.ts` — POST: stáhni URL → parse → rewrite → ulož draft.
- `src/pages/admin/bazar/seed/api/send.ts` — POST: pošli claim odkaz e-mailem (Resend).
- `src/pages/bazar/prevzit/[token].astro` — claim stránka (náhled + souhlas + volitelné heslo).
- `src/pages/bazar/prevzit/api/confirm.ts` — POST: potvrzení → účet + publikace + audit.

**Nová migrace:**
- `supabase/migrations/017_bazar_seed_prospects.sql`.

**Nový cron skript:**
- `scripts/bazar-seed-cleanup.mjs` — smaž nepotvrzené prospekty starší 30 dní.

**Úpravy:**
- `src/middleware.ts` — přidat `/bazar/prevzit` do `needsAuthContext` (API confirm potřebuje POST context; stránka je jinak veřejná).

---

## Task 1: Migrace DB — prospekti, stav pending_claim, RLS

**Files:**
- Create: `supabase/migrations/017_bazar_seed_prospects.sql`

- [ ] **Step 1: Napiš migraci**

```sql
-- 017: Seeding & import — neveřejné drafty + claim prospekti

-- 1) Rozšíření listings o pre-claim stav
ALTER TABLE bazar_listings DROP CONSTRAINT bazar_listings_status_check;
ALTER TABLE bazar_listings
  ADD CONSTRAINT bazar_listings_status_check
  CHECK (status IN ('active', 'sold', 'expired', 'pending_claim'));

-- pre-claim draft nemá reálného uživatele
ALTER TABLE bazar_listings ALTER COLUMN user_id DROP NOT NULL;

-- 2) Prospekti
CREATE TABLE bazar_seed_prospects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  source_url text NOT NULL DEFAULT '',
  claim_token text NOT NULL UNIQUE,
  token_expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  channel text CHECK (channel IN ('email', 'whatsapp')),
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'sent', 'opened', 'confirmed', 'expired')),
  opened_at timestamptz,
  confirmed_at timestamptz,
  confirmed_ip text,
  terms_version text,
  user_id uuid REFERENCES bazar_users(id) ON DELETE SET NULL,
  created_by uuid REFERENCES bazar_users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_bazar_seed_prospects_token ON bazar_seed_prospects(claim_token);
CREATE INDEX idx_bazar_seed_prospects_status ON bazar_seed_prospects(status);

-- listing → prospekt
ALTER TABLE bazar_listings
  ADD COLUMN seed_prospect_id uuid REFERENCES bazar_seed_prospects(id) ON DELETE CASCADE;
CREATE INDEX idx_bazar_listings_seed_prospect ON bazar_listings(seed_prospect_id);

-- 3) RLS: prospekti jen pro service role (admin čte přes service role klienta)
ALTER TABLE bazar_seed_prospects ENABLE ROW LEVEL SECURITY;
-- žádná policy pro anon/authenticated → default deny; service role RLS obchází

-- 4) RLS listings: skryj pending_claim z anon/authenticated výpisů
DROP POLICY "bazar_listings_select" ON bazar_listings;
CREATE POLICY "bazar_listings_select" ON bazar_listings
  FOR SELECT USING (status <> 'pending_claim');
```

- [ ] **Step 2: Ověř, že migrace je syntakticky validní (dry parse)**

Run: `grep -c "CREATE TABLE bazar_seed_prospects" supabase/migrations/017_bazar_seed_prospects.sql`
Expected: `1`

> Poznámka pro exekutora: migrace se na prod/QA aplikuje ručně mimo tento plán. Ověř jméno constraintu `bazar_listings_status_check` proti reálné DB; pokud se liší, uprav DROP CONSTRAINT.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/017_bazar_seed_prospects.sql
git commit -m "feat(bazar): migrace 017 — seed prospekti + stav pending_claim + RLS"
```

---

## Task 2: Claim token — generování a validace

**Files:**
- Create: `src/lib/bazar-seed-token.ts`
- Test: `src/lib/bazar-seed-token.test.ts`

- [ ] **Step 1: Napiš failing test**

```ts
import { describe, it, expect } from 'vitest';
import { generateClaimToken, isTokenExpired } from './bazar-seed-token';

describe('generateClaimToken', () => {
  it('vrací URL-safe token délky ≥ 32 znaků', () => {
    const t = generateClaimToken();
    expect(t).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(t.length).toBeGreaterThanOrEqual(32);
  });

  it('generuje pokaždé jiný token', () => {
    expect(generateClaimToken()).not.toBe(generateClaimToken());
  });
});

describe('isTokenExpired', () => {
  it('true když expirace je v minulosti', () => {
    expect(isTokenExpired('2000-01-01T00:00:00Z', new Date('2026-01-01T00:00:00Z'))).toBe(true);
  });
  it('false když expirace je v budoucnosti', () => {
    expect(isTokenExpired('2099-01-01T00:00:00Z', new Date('2026-01-01T00:00:00Z'))).toBe(false);
  });
});
```

- [ ] **Step 2: Spusť test — musí selhat**

Run: `npx vitest run src/lib/bazar-seed-token.test.ts`
Expected: FAIL — "Cannot find module './bazar-seed-token'"

- [ ] **Step 3: Napiš implementaci**

```ts
import { randomBytes } from 'node:crypto';

/** URL-safe náhodný token (32 bytes → ~43 znaků base64url). Jednorázový claim link. */
export function generateClaimToken(): string {
  return randomBytes(32).toString('base64url');
}

/** Vrací true, pokud expirace (ISO string) je před `now`. */
export function isTokenExpired(expiresAtIso: string, now: Date = new Date()): boolean {
  return new Date(expiresAtIso).getTime() <= now.getTime();
}
```

- [ ] **Step 4: Spusť test — musí projít**

Run: `npx vitest run src/lib/bazar-seed-token.test.ts`
Expected: PASS (4 testy)

- [ ] **Step 5: Commit**

```bash
git add src/lib/bazar-seed-token.ts src/lib/bazar-seed-token.test.ts
git commit -m "feat(bazar): claim token generování + validace expirace"
```

---

## Task 3: Parser Bazoš inzerátu z HTML

Best-effort parser. Extrahuje název, cenu, popis, lokalitu, telefon a URL obrázků z HTML stránky Bazoše. Když pole nenajde, vrátí `null`/`[]` (admin doplní ručně).

**Files:**
- Create: `src/lib/bazar-import-parse.ts`
- Test: `src/lib/bazar-import-parse.test.ts`

- [ ] **Step 1: Napiš failing test**

```ts
import { describe, it, expect } from 'vitest';
import { parseBazosListing } from './bazar-import-parse';

const SAMPLE = `
<html><head><title>Prodám secí stroj Amazone | Bazoš.cz</title>
<meta property="og:image" content="https://www.bazos.cz/img/1/100/foo.jpg">
</head><body>
<h1 class="nadpisdetail">Prodám secí stroj Amazone D9</h1>
<table><tr><td>Cena:</td><td>85 000 Kč</td></tr>
<tr><td>Lokalita:</td><td>Havlíčkův Brod 58001</td></tr></table>
<div class="popisdetail">Secí stroj Amazone D9, záběr 3 m, málo použitý. Volejte 777123456.</div>
<img class="carousel-cell-image" src="https://www.bazos.cz/img/1/300/one.jpg">
<img class="carousel-cell-image" src="https://www.bazos.cz/img/1/300/two.jpg">
</body></html>`;

describe('parseBazosListing', () => {
  it('vytáhne název, cenu, popis, lokalitu a fotky', () => {
    const r = parseBazosListing(SAMPLE);
    expect(r.title).toBe('Prodám secí stroj Amazone D9');
    expect(r.price).toBe(85000);
    expect(r.location).toContain('Havlíčkův Brod');
    expect(r.description).toContain('Amazone D9');
    expect(r.imageUrls).toEqual([
      'https://www.bazos.cz/img/1/300/one.jpg',
      'https://www.bazos.cz/img/1/300/two.jpg',
    ]);
  });

  it('chybějící cena → null, prázdné pole fotek', () => {
    const r = parseBazosListing('<html><body><h1 class="nadpisdetail">Bez ceny</h1></body></html>');
    expect(r.title).toBe('Bez ceny');
    expect(r.price).toBeNull();
    expect(r.imageUrls).toEqual([]);
  });
});
```

- [ ] **Step 2: Spusť test — musí selhat**

Run: `npx vitest run src/lib/bazar-import-parse.test.ts`
Expected: FAIL — "Cannot find module './bazar-import-parse'"

- [ ] **Step 3: Napiš implementaci**

Parsuje se regexy nad HTML (žádná DOM závislost — běží i v edge runtime). Selektory odpovídají struktuře Bazoše; drž je na jednom místě, ať se dají snadno upravit, když Bazoš změní markup.

```ts
export interface ParsedListing {
  title: string | null;
  price: number | null;
  description: string | null;
  location: string | null;
  phone: string | null;
  imageUrls: string[];
}

function firstMatch(html: string, re: RegExp): string | null {
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Best-effort parser Bazoš detailu inzerátu z HTML. Nenalezené pole = null/[]. */
export function parseBazosListing(html: string): ParsedListing {
  const rawTitle = firstMatch(html, /<h1[^>]*class="nadpisdetail"[^>]*>([\s\S]*?)<\/h1>/i);
  const title = rawTitle ? stripTags(rawTitle) : null;

  const priceRaw = firstMatch(html, /Cena:\s*<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/i);
  const price = priceRaw ? parsePrice(priceRaw) : null;

  const location = firstMatch(html, /Lokalita:\s*<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/i);

  const descRaw = firstMatch(html, /<div[^>]*class="popisdetail"[^>]*>([\s\S]*?)<\/div>/i);
  const description = descRaw ? stripTags(descRaw) : null;

  const phone = description ? (description.match(/\b(\d{3}\s?\d{3}\s?\d{3})\b/)?.[1] ?? null) : null;

  const imageUrls = Array.from(
    html.matchAll(/<img[^>]*class="carousel-cell-image"[^>]*src="([^"]+)"/gi),
    (m) => m[1],
  );

  return {
    title,
    price,
    description,
    location: location ? stripTags(location) : null,
    phone: phone ? phone.replace(/\s/g, '') : null,
    imageUrls,
  };
}

function parsePrice(raw: string): number | null {
  const digits = stripTags(raw).replace(/[^\d]/g, '');
  return digits ? parseInt(digits, 10) : null;
}
```

- [ ] **Step 4: Spusť test — musí projít**

Run: `npx vitest run src/lib/bazar-import-parse.test.ts`
Expected: PASS (2 testy)

- [ ] **Step 5: Commit**

```bash
git add src/lib/bazar-import-parse.ts src/lib/bazar-import-parse.test.ts
git commit -m "feat(bazar): best-effort parser Bazoš inzerátu z HTML"
```

---

## Task 4: Heuristický návrh kategorie

Z názvu + popisu navrhne jednu z `CATEGORIES` (z `bazar-constants.ts`). Klíčová slova → kategorie; fallback `ostatni`. Admin návrh potvrdí/změní.

**Files:**
- Create: `src/lib/bazar-import-category.ts`
- Test: `src/lib/bazar-import-category.test.ts`

- [ ] **Step 1: Napiš failing test**

```ts
import { describe, it, expect } from 'vitest';
import { suggestCategory } from './bazar-import-category';
import { CATEGORIES } from './bazar-constants';

describe('suggestCategory', () => {
  it('traktor → traktory', () => {
    expect(suggestCategory('Prodám traktor Zetor 7211', '')).toBe('traktory');
  });
  it('secí stroj → seti', () => {
    expect(suggestCategory('Secí stroj Amazone', 'záběr 3m')).toBe('seti');
  });
  it('kráva/jalovice → zvirata', () => {
    expect(suggestCategory('Prodám jalovice', '')).toBe('zvirata');
  });
  it('neznámé → ostatni', () => {
    expect(suggestCategory('Xyz qwerty', '')).toBe('ostatni');
  });
  it('vždy vrací platnou hodnotu z CATEGORIES', () => {
    const valid = new Set(CATEGORIES.map((c) => c.value));
    expect(valid.has(suggestCategory('Traktor', ''))).toBe(true);
  });
});
```

- [ ] **Step 2: Spusť test — musí selhat**

Run: `npx vitest run src/lib/bazar-import-category.test.ts`
Expected: FAIL — "Cannot find module './bazar-import-category'"

- [ ] **Step 3: Napiš implementaci**

```ts
// Klíčová slova → kategorie (value z CATEGORIES v bazar-constants.ts).
// Pořadí = priorita (první shoda vyhrává). Bez diakritiky a lowercase se porovnává.
const RULES: Array<[string[], string]> = [
  [['traktor'], 'traktory'],
  [['kombajn', 'sklizec', 'mlaticka'], 'kombajny'],
  [['plu', 'brany', 'podmitac', 'kypric', 'radlic'], 'zpracovani-pudy'],
  [['seci', 'secka', 'sazec', 'secí', 'sadzac'], 'seti'],
  [['rozmetadlo', 'hnojiv', 'cisternu na kejdu', 'kejda'], 'hnojeni'],
  [['postrikovac', 'postrik', 'ochrana rostlin'], 'ochrana-rostlin'],
  [['lis na seno', 'lis na slamu', 'obraceč', 'shrnovac', 'balikovac', 'senaz'], 'sklizen-picnin'],
  [['vyorava', 'sklizec brambor', 'skliznova repy'], 'sklizen-okopanin'],
  [['nakladac', 'manipulator', 'celni nakladac', 'paletovaci'], 'manipulace'],
  [['privesu', 'privesy', 'valnik', 'navesu', 'preprava'], 'doprava'],
  [['dojici', 'staj', 'napajecka', 'chov', 'krmny'], 'staj-chov'],
  [['stepkovac', 'mulcovac', 'komunal', 'les'], 'komunal-les'],
  [['nahradni dil', 'nd na', 'pneumatik'], 'nahradni-dily'],
  [['osivo', 'hnojivo', 'sadba'], 'osiva-hnojiva'],
  [['pozemek', 'pole', 'orna puda', 'louka'], 'pozemky'],
  [['jalovic', 'krava', 'bik', 'tele', 'prase', 'ovce', 'kuze', 'slepic', 'kral'], 'zvirata'],
];

function normalize(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/** Navrhne kategorii z názvu + popisu. Fallback 'ostatni'. */
export function suggestCategory(title: string, description: string): string {
  const hay = normalize(`${title} ${description}`);
  for (const [keywords, category] of RULES) {
    if (keywords.some((k) => hay.includes(normalize(k)))) return category;
  }
  return 'ostatni';
}
```

- [ ] **Step 4: Spusť test — musí projít**

Run: `npx vitest run src/lib/bazar-import-category.test.ts`
Expected: PASS (5 testů)

- [ ] **Step 5: Commit**

```bash
git add src/lib/bazar-import-category.ts src/lib/bazar-import-category.test.ts
git commit -m "feat(bazar): heuristický návrh kategorie z názvu/popisu"
```

---

## Task 5: AI SEO přepis textu

Přepíše popis (a navrhne SEO titulek) přes Anthropic Messages API. LLM volání je za injektovatelným rozhraním, takže logika (stavba promptu, parsování odpovědi, fallback) je testovatelná bez sítě. Bez `ANTHROPIC_API_KEY` se přepis přeskočí a vrátí originál.

**Files:**
- Create: `src/lib/bazar-import-rewrite.ts`
- Test: `src/lib/bazar-import-rewrite.test.ts`

- [ ] **Step 1: Napiš failing test**

```ts
import { describe, it, expect } from 'vitest';
import { buildRewritePrompt, parseRewriteResponse, rewriteListing } from './bazar-import-rewrite';

describe('buildRewritePrompt', () => {
  it('obsahuje originální název i popis', () => {
    const p = buildRewritePrompt('Traktor Zetor', 'Starší traktor, 1990.');
    expect(p).toContain('Traktor Zetor');
    expect(p).toContain('Starší traktor, 1990.');
  });
});

describe('parseRewriteResponse', () => {
  it('rozparsuje JSON blok z odpovědi', () => {
    const r = parseRewriteResponse('{"title":"Zetor 7211 na prodej","description":"Spolehlivý traktor."}');
    expect(r).toEqual({ title: 'Zetor 7211 na prodej', description: 'Spolehlivý traktor.' });
  });
  it('nevalidní JSON → null', () => {
    expect(parseRewriteResponse('to není json')).toBeNull();
  });
});

describe('rewriteListing', () => {
  it('bez apiKey vrací originál (fallback)', async () => {
    const r = await rewriteListing({ title: 'A', description: 'B', apiKey: '' });
    expect(r).toEqual({ title: 'A', description: 'B' });
  });

  it('s LLM klientem vrací přepsaný text', async () => {
    const fakeLlm = async () => '{"title":"Nový A","description":"Nový B"}';
    const r = await rewriteListing({ title: 'A', description: 'B', apiKey: 'x', llm: fakeLlm });
    expect(r).toEqual({ title: 'Nový A', description: 'Nový B' });
  });

  it('když LLM vrátí nesmysl, fallback na originál', async () => {
    const fakeLlm = async () => 'rozbité';
    const r = await rewriteListing({ title: 'A', description: 'B', apiKey: 'x', llm: fakeLlm });
    expect(r).toEqual({ title: 'A', description: 'B' });
  });
});
```

- [ ] **Step 2: Spusť test — musí selhat**

Run: `npx vitest run src/lib/bazar-import-rewrite.test.ts`
Expected: FAIL — "Cannot find module './bazar-import-rewrite'"

- [ ] **Step 3: Napiš implementaci**

```ts
export interface RewriteResult {
  title: string;
  description: string;
}

/** Funkce, která pošle prompt do LLM a vrátí textovou odpověď. Injektovatelné kvůli testům. */
export type LlmClient = (prompt: string) => Promise<string>;

const MODEL = 'claude-haiku-4-5-20251001';

export function buildRewritePrompt(title: string, description: string): string {
  return [
    'Jsi copywriter pro český zemědělský inzertní portál. Přepiš inzerát tak, aby byl',
    'originální (ne kopie), čtivý a SEO-laděný. Zachovej VŠECHNA fakta beze změny',
    '(cena, značka, model, rok, motohodiny, rozměry, kontakt). Nevymýšlej údaje.',
    'Vrať POUZE JSON: {"title": "...", "description": "..."} bez dalšího textu.',
    '',
    `Původní název: ${title}`,
    `Původní popis: ${description}`,
  ].join('\n');
}

export function parseRewriteResponse(raw: string): RewriteResult | null {
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const obj = JSON.parse(match[0]);
    if (typeof obj.title === 'string' && typeof obj.description === 'string') {
      return { title: obj.title.trim(), description: obj.description.trim() };
    }
    return null;
  } catch {
    return null;
  }
}

/** Default LLM klient — Anthropic Messages API přes fetch (žádná SDK závislost). */
async function anthropicClient(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic API ${res.status}`);
  const data = await res.json();
  return data?.content?.[0]?.text ?? '';
}

export async function rewriteListing(opts: {
  title: string;
  description: string;
  apiKey: string;
  llm?: LlmClient;
}): Promise<RewriteResult> {
  const original: RewriteResult = { title: opts.title, description: opts.description };
  if (!opts.apiKey) return original;
  const llm = opts.llm ?? ((p: string) => anthropicClient(opts.apiKey, p));
  try {
    const raw = await llm(buildRewritePrompt(opts.title, opts.description));
    return parseRewriteResponse(raw) ?? original;
  } catch {
    return original;
  }
}
```

- [ ] **Step 4: Spusť test — musí projít**

Run: `npx vitest run src/lib/bazar-import-rewrite.test.ts`
Expected: PASS (5 testů)

- [ ] **Step 5: Commit**

```bash
git add src/lib/bazar-import-rewrite.ts src/lib/bazar-import-rewrite.test.ts
git commit -m "feat(bazar): AI SEO přepis inzerátu (Anthropic, injektovatelný LLM)"
```

---

## Task 6: Datová vrstva prospektů

Čisté funkce nad Supabase klientem (klient se předává parametrem → testovatelné se stubem). Řeší: založ prospekta, přidej draft listing, najdi podle tokenu (s draft inzeráty), potvrď (audit + status).

**Files:**
- Create: `src/lib/bazar-seed.ts`
- Test: `src/lib/bazar-seed.test.ts`

- [ ] **Step 1: Napiš failing test**

Test používá minimální fake Supabase klienta zachytávající volání.

```ts
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
```

- [ ] **Step 2: Spusť test — musí selhat**

Run: `npx vitest run src/lib/bazar-seed.test.ts`
Expected: FAIL — "Cannot find module './bazar-seed'"

- [ ] **Step 3: Napiš implementaci**

```ts
import type { SupabaseClient } from '@supabase/supabase-js';
import { generateClaimToken } from './bazar-seed-token';

export interface ProspectInput {
  name: string;
  phone: string;
  email: string;
  sourceUrl: string;
}

export interface DraftListingInput {
  title: string;
  description: string;
  price: number | null;
  category: string;
  subcategory?: string | null;
  brand?: string | null;
  location: string;
  phone: string;
  email: string;
}

/** Založí prospekta + jeho první draft listing (pending_claim, bez user_id). */
export async function createProspectWithDraft(
  supabase: SupabaseClient,
  args: { adminId: string; prospect: ProspectInput; listing: DraftListingInput; imagePaths: string[] },
): Promise<{ prospectId: string; claimToken: string; listingId: string }> {
  const claimToken = generateClaimToken();
  const { data: prospect, error: pErr } = await supabase
    .from('bazar_seed_prospects')
    .insert({
      name: args.prospect.name,
      phone: args.prospect.phone,
      email: args.prospect.email,
      source_url: args.prospect.sourceUrl,
      claim_token: claimToken,
      created_by: args.adminId,
      status: 'draft',
    })
    .select('id, claim_token')
    .single();
  if (pErr || !prospect) throw new Error(`prospect insert: ${pErr?.message}`);

  const listingId = await addDraftListing(supabase, prospect.id as string, args.listing, args.imagePaths);
  return { prospectId: prospect.id as string, claimToken: prospect.claim_token as string, listingId };
}

/** Přidá další draft listing k existujícímu prospektovi. */
export async function addDraftListing(
  supabase: SupabaseClient,
  prospectId: string,
  listing: DraftListingInput,
  imagePaths: string[],
): Promise<string> {
  const { data, error } = await supabase
    .from('bazar_listings')
    .insert({
      user_id: null,
      seed_prospect_id: prospectId,
      status: 'pending_claim',
      title: listing.title,
      description: listing.description,
      price: listing.price,
      category: listing.category,
      subcategory: listing.subcategory ?? null,
      brand: listing.brand ?? null,
      location: listing.location,
      phone: listing.phone,
      email: listing.email,
    })
    .select('id')
    .single();
  if (error || !data) throw new Error(`listing insert: ${error?.message}`);

  if (imagePaths.length) {
    const rows = imagePaths.slice(0, 5).map((path, i) => ({
      listing_id: data.id,
      storage_path: path,
      position: i + 1,
    }));
    const { error: imgErr } = await supabase.from('bazar_images').insert(rows);
    if (imgErr) throw new Error(`images insert: ${imgErr.message}`);
  }
  return data.id as string;
}

export async function markProspectSent(
  supabase: SupabaseClient,
  prospectId: string,
  channel: 'email' | 'whatsapp',
): Promise<void> {
  const { error } = await supabase
    .from('bazar_seed_prospects')
    .update({ status: 'sent', channel })
    .eq('id', prospectId);
  if (error) throw new Error(`markProspectSent: ${error.message}`);
}
```

- [ ] **Step 4: Spusť test — musí projít**

Run: `npx vitest run src/lib/bazar-seed.test.ts`
Expected: PASS (2 testy)

- [ ] **Step 5: Commit**

```bash
git add src/lib/bazar-seed.ts src/lib/bazar-seed.test.ts
git commit -m "feat(bazar): datová vrstva seed prospektů (create/draft/sent)"
```

---

## Task 7: Confirm logika — potvrzení a publikace

Rozšíří `bazar-seed.ts` o `getProspectByToken` a `confirmProspect`. `confirmProspect` je čistá orchestrace: ověří token, vytvoří/dohledá uživatele (přes předanou callback funkci — testovatelné), zveřejní inzeráty, zapíše audit.

**Files:**
- Modify: `src/lib/bazar-seed.ts`
- Modify: `src/lib/bazar-seed.test.ts`

- [ ] **Step 1: Přidej failing testy**

```ts
import { confirmProspect } from './bazar-seed';

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
```

- [ ] **Step 2: Spusť test — musí selhat**

Run: `npx vitest run src/lib/bazar-seed.test.ts`
Expected: FAIL — "confirmProspect is not a function"

- [ ] **Step 3: Přidej implementaci do `bazar-seed.ts`**

```ts
import { isTokenExpired } from './bazar-seed-token';

export interface ProspectRow {
  id: string; email: string; name: string; phone: string;
  claim_token: string; token_expires_at: string; status: string; user_id: string | null;
}

/** Načte prospekta podle tokenu (service role obchází RLS). null když neexistuje. */
export async function getProspectByToken(
  supabase: SupabaseClient,
  token: string,
): Promise<ProspectRow | null> {
  const { data } = await supabase
    .from('bazar_seed_prospects')
    .select('id, email, name, phone, claim_token, token_expires_at, status, user_id')
    .eq('claim_token', token)
    .single();
  return (data as ProspectRow) ?? null;
}

/** Zaznamenej otevření claim odkazu (idempotentně jen z 'sent'/'draft'). */
export async function markProspectOpened(supabase: SupabaseClient, prospectId: string, nowIso: string): Promise<void> {
  await supabase
    .from('bazar_seed_prospects')
    .update({ status: 'opened', opened_at: nowIso })
    .eq('id', prospectId)
    .in('status', ['draft', 'sent']);
}

/** Callback: zajistí auth uživatele (vytvoř nebo dohledej) a vrať jeho id. */
export type EnsureUser = (args: { email: string; name: string; phone: string }) => Promise<string>;

/** Potvrdí prospekta: ověří token, zajistí usera, zveřejní inzeráty, zapíše audit. */
export async function confirmProspect(
  supabase: SupabaseClient,
  args: { token: string; ip: string; termsVersion: string; ensureUser: EnsureUser; now?: Date },
): Promise<{ userId: string; prospectId: string }> {
  const now = args.now ?? new Date();
  const prospect = await getProspectByToken(supabase, args.token);
  if (!prospect) throw new Error('Neplatný odkaz.');
  if (prospect.status === 'confirmed') throw new Error('Tento inzerát už byl potvrzen.');
  if (isTokenExpired(prospect.token_expires_at, now)) throw new Error('Platnost odkazu vypršela (expiroval).');

  const userId = await args.ensureUser({ email: prospect.email, name: prospect.name, phone: prospect.phone });

  const { error: lErr } = await supabase
    .from('bazar_listings')
    .update({ status: 'active', user_id: userId })
    .eq('seed_prospect_id', prospect.id);
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

- [ ] **Step 4: Spusť test — musí projít**

Run: `npx vitest run src/lib/bazar-seed.test.ts`
Expected: PASS (5 testů celkem)

- [ ] **Step 5: Commit**

```bash
git add src/lib/bazar-seed.ts src/lib/bazar-seed.test.ts
git commit -m "feat(bazar): confirm logika prospekta (token, publikace, audit)"
```

---

## Task 8: Resend pozvánkový e-mail

**Files:**
- Create: `src/lib/bazar-seed-email.ts`
- Test: `src/lib/bazar-seed-email.test.ts`

- [ ] **Step 1: Napiš failing test**

```ts
import { describe, it, expect } from 'vitest';
import { buildClaimEmail, claimUrl } from './bazar-seed-email';

describe('claimUrl', () => {
  it('sestaví absolutní odkaz s tokenem', () => {
    expect(claimUrl('ABC')).toBe('https://agro-svet.cz/bazar/prevzit/ABC');
  });
});

describe('buildClaimEmail', () => {
  it('obsahuje jméno, odkaz a je HTML', () => {
    const { subject, html } = buildClaimEmail({ name: 'Jan', token: 'ABC', listingTitle: 'Traktor Zetor' });
    expect(subject).toContain('Traktor Zetor');
    expect(html).toContain('Jan');
    expect(html).toContain('https://agro-svet.cz/bazar/prevzit/ABC');
  });
});
```

- [ ] **Step 2: Spusť test — musí selhat**

Run: `npx vitest run src/lib/bazar-seed-email.test.ts`
Expected: FAIL — "Cannot find module './bazar-seed-email'"

- [ ] **Step 3: Napiš implementaci**

```ts
import { Resend } from 'resend';
import { SITE_URL } from './config';

const FROM = 'Agro-svět bazar <bazar@mail.agro-svet.cz>';

export function claimUrl(token: string): string {
  return `${SITE_URL}/bazar/prevzit/${token}`;
}

export function buildClaimEmail(args: { name: string; token: string; listingTitle: string }): {
  subject: string;
  html: string;
} {
  const url = claimUrl(args.token);
  const greeting = args.name ? `Dobrý den, ${args.name},` : 'Dobrý den,';
  const subject = `Váš inzerát „${args.listingTitle}" je připravený ke zveřejnění`;
  const html = `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto">
      <p>${greeting}</p>
      <p>připravili jsme pro vás inzerát <strong>${args.listingTitle}</strong> na zemědělském
      bazaru Agro-svět. Podle vašeho inzerátu jsme jej předvyplnili — stačí jej zkontrolovat
      a jedním kliknutím zveřejnit zdarma.</p>
      <p style="text-align:center;margin:28px 0">
        <a href="${url}" style="background:#2f7d32;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none">
          Zkontrolovat a zveřejnit
        </a>
      </p>
      <p style="color:#666;font-size:13px">Pokud o zveřejnění nemáte zájem, e-mail ignorujte —
      inzerát zůstane neveřejný a po 30 dnech se smaže.</p>
    </div>`;
  return { subject, html };
}

/** Odešle claim e-mail přes Resend. Vrací true při úspěchu. */
export async function sendClaimEmail(
  apiKey: string,
  to: string,
  args: { name: string; token: string; listingTitle: string },
): Promise<boolean> {
  if (!apiKey) return false;
  const { subject, html } = buildClaimEmail(args);
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({ from: FROM, to, subject, html });
  return !error;
}
```

- [ ] **Step 4: Spusť test — musí projít**

Run: `npx vitest run src/lib/bazar-seed-email.test.ts`
Expected: PASS (2 testy)

- [ ] **Step 5: Commit**

```bash
git add src/lib/bazar-seed-email.ts src/lib/bazar-seed-email.test.ts
git commit -m "feat(bazar): Resend pozvánkový e-mail pro claim"
```

---

## Task 9: API — import z URL (admin)

Stáhne Bazoš stránku, parsuje, přepíše AI, stáhne fotky do Storage, uloží draft. Reuse: `parseBazosListing`, `rewriteListing`, `suggestCategory`, `createProspectWithDraft`.

**Files:**
- Create: `src/pages/admin/bazar/seed/api/import.ts`

- [ ] **Step 1: Napiš endpoint**

```ts
import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../../lib/supabase';
import { getEnvVar } from '../../../../../lib/env';
import { parseBazosListing } from '../../../../../lib/bazar-import-parse';
import { suggestCategory } from '../../../../../lib/bazar-import-category';
import { rewriteListing } from '../../../../../lib/bazar-import-rewrite';
import { createProspectWithDraft } from '../../../../../lib/bazar-seed';

export const prerender = false;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

async function downloadImages(supabase: ReturnType<typeof createServerClient>, urls: string[]): Promise<string[]> {
  const paths: string[] = [];
  for (const [i, url] of urls.slice(0, 5).entries()) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const buf = new Uint8Array(await res.arrayBuffer());
      const ext = (url.split('.').pop() || 'jpg').split('?')[0].slice(0, 4);
      const path = `seed/${crypto.randomUUID()}-${i}.${ext}`;
      const { error } = await supabase.storage.from('bazar-images').upload(path, buf, {
        contentType: res.headers.get('content-type') || 'image/jpeg',
      });
      if (!error) paths.push(path);
    } catch { /* přeskoč nevalidní obrázek */ }
  }
  return paths;
}

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user?.is_admin) return json({ error: 'Forbidden' }, 403);

  const body = await request.json().catch(() => null);
  const url = typeof body?.url === 'string' ? body.url.trim() : '';
  const contact = body?.contact ?? {};
  if (!/^https?:\/\/.*bazos\.cz/i.test(url)) return json({ error: 'Zadejte platný odkaz na bazos.cz' }, 400);

  const pageRes = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (agro-svet import)' } });
  if (!pageRes.ok) return json({ error: `Stránku se nepodařilo stáhnout (${pageRes.status})` }, 502);
  const html = await pageRes.text();

  const parsed = parseBazosListing(html);
  if (!parsed.title) return json({ error: 'Z inzerátu se nepodařilo přečíst název — zkuste zadat ručně.' }, 422);

  const rewritten = await rewriteListing({
    title: parsed.title,
    description: parsed.description ?? '',
    apiKey: getEnvVar('ANTHROPIC_API_KEY') ?? '',
  });
  const category = suggestCategory(rewritten.title, rewritten.description);

  const supabase = createServerClient();
  const imagePaths = await downloadImages(supabase, parsed.imageUrls);

  const result = await createProspectWithDraft(supabase, {
    adminId: locals.user.id,
    prospect: {
      name: contact.name ?? '',
      phone: contact.phone ?? parsed.phone ?? '',
      email: contact.email ?? '',
      sourceUrl: url,
    },
    listing: {
      title: rewritten.title,
      description: rewritten.description,
      price: parsed.price,
      category,
      location: parsed.location ?? '',
      phone: contact.phone ?? parsed.phone ?? '',
      email: contact.email ?? '',
    },
    imagePaths,
  });

  return json({ ok: true, ...result });
};
```

- [ ] **Step 2: Ověř build/typecheck**

Run: `npx astro check --minimumSeverity error 2>&1 | tail -5`
Expected: bez chyb v `import.ts` (varování jinde ignoruj)

- [ ] **Step 3: Commit**

```bash
git add src/pages/admin/bazar/seed/api/import.ts
git commit -m "feat(bazar): admin API import inzerátu z URL (parse+AI+fotky+draft)"
```

---

## Task 10: Admin stránka — seznam prospektů + import

Reuse admin gating + layout pattern z `src/pages/admin/bazar/index.astro`. Stránka: formulář (URL + kontakt) volající `/admin/bazar/seed/api/import` fetchem, a tabulka prospektů se stavem + tlačítky „Kopírovat odkaz" a „Poslat e-mailem".

**Files:**
- Create: `src/pages/admin/bazar/seed/index.astro`

- [ ] **Step 1: Napiš stránku**

```astro
---
export const prerender = false;
import Layout from '../../../../layouts/Layout.astro';
import { createServerClient } from '../../../../lib/supabase';
import { claimUrl } from '../../../../lib/bazar-seed-email';

if (!Astro.locals.user?.is_admin) return Astro.redirect('/bazar/prihlaseni');

const supabase = createServerClient();
const { data: prospects } = await supabase
  .from('bazar_seed_prospects')
  .select('id, name, email, phone, source_url, claim_token, status, created_at')
  .order('created_at', { ascending: false })
  .limit(100);
---
<Layout title="Bazar — Seeding">
  <main class="mx-auto max-w-4xl p-6">
    <h1 class="text-2xl font-bold mb-4">Předchystané inzeráty (seeding)</h1>

    <section class="mb-8 rounded border p-4">
      <h2 class="font-semibold mb-2">Import z URL (Bazoš)</h2>
      <form id="importForm" class="grid gap-2 sm:grid-cols-2">
        <input name="url" required placeholder="Odkaz na inzerát na bazos.cz" class="border p-2 sm:col-span-2" />
        <input name="name" placeholder="Jméno prodejce" class="border p-2" />
        <input name="phone" placeholder="Telefon" class="border p-2" />
        <input name="email" type="email" placeholder="E-mail prodejce" class="border p-2 sm:col-span-2" />
        <button class="bg-green-700 text-white p-2 rounded sm:col-span-2">Importovat a vytvořit draft</button>
      </form>
      <p id="importMsg" class="text-sm mt-2"></p>
    </section>

    <table class="w-full text-sm border-collapse">
      <thead><tr class="text-left border-b">
        <th class="p-2">Prodejce</th><th class="p-2">Stav</th><th class="p-2">Odkaz</th>
      </tr></thead>
      <tbody>
        {prospects?.map((p) => (
          <tr class="border-b">
            <td class="p-2">{p.name || '—'}<br /><span class="text-gray-500">{p.email || p.phone}</span></td>
            <td class="p-2">{p.status}</td>
            <td class="p-2">
              <button type="button" class="copyBtn underline" data-url={claimUrl(p.claim_token)}>Kopírovat odkaz</button>
              {p.email && (
                <button type="button" class="sendBtn underline ml-3" data-id={p.id}>Poslat e-mailem</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </main>

  <script>
    const form = document.getElementById('importForm') as HTMLFormElement;
    const msg = document.getElementById('importMsg')!;
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      msg.textContent = 'Importuji…';
      const fd = new FormData(form);
      const res = await fetch('/admin/bazar/seed/api/import', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          url: fd.get('url'),
          contact: { name: fd.get('name'), phone: fd.get('phone'), email: fd.get('email') },
        }),
      });
      const data = await res.json();
      msg.textContent = res.ok ? 'Hotovo — draft vytvořen.' : `Chyba: ${data.error}`;
      if (res.ok) setTimeout(() => location.reload(), 800);
    });

    document.querySelectorAll('.copyBtn').forEach((b) =>
      b.addEventListener('click', () => {
        navigator.clipboard.writeText((b as HTMLElement).dataset.url!);
        (b as HTMLElement).textContent = 'Zkopírováno ✓';
      }),
    );
    document.querySelectorAll('.sendBtn').forEach((b) =>
      b.addEventListener('click', async () => {
        (b as HTMLElement).textContent = 'Odesílám…';
        const res = await fetch('/admin/bazar/seed/api/send', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ prospectId: (b as HTMLElement).dataset.id }),
        });
        (b as HTMLElement).textContent = res.ok ? 'Odesláno ✓' : 'Chyba';
      }),
    );
  </script>
</Layout>
```

- [ ] **Step 2: Ověř, že stránka je dostupná (dev server)**

Run: `npm run dev` a v prohlížeči otevři `/admin/bazar/seed` jako admin.
Expected: formulář + (zatím prázdná) tabulka se zobrazí bez chyby.

- [ ] **Step 3: Commit**

```bash
git add src/pages/admin/bazar/seed/index.astro
git commit -m "feat(bazar): admin stránka seeding (import + seznam prospektů)"
```

---

## Task 11: API — odeslání claim e-mailu (admin)

**Files:**
- Create: `src/pages/admin/bazar/seed/api/send.ts`

- [ ] **Step 1: Napiš endpoint**

```ts
import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../../lib/supabase';
import { getEnvVar } from '../../../../../lib/env';
import { sendClaimEmail } from '../../../../../lib/bazar-seed-email';
import { markProspectSent } from '../../../../../lib/bazar-seed';

export const prerender = false;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user?.is_admin) return json({ error: 'Forbidden' }, 403);
  const body = await request.json().catch(() => null);
  const prospectId = typeof body?.prospectId === 'string' ? body.prospectId : '';
  if (!prospectId) return json({ error: 'Chybí prospectId' }, 400);

  const supabase = createServerClient();
  const { data: prospect } = await supabase
    .from('bazar_seed_prospects')
    .select('id, name, email, claim_token')
    .eq('id', prospectId)
    .single();
  if (!prospect?.email) return json({ error: 'Prospekt nemá e-mail' }, 422);

  const { data: listing } = await supabase
    .from('bazar_listings')
    .select('title')
    .eq('seed_prospect_id', prospectId)
    .limit(1)
    .single();

  const ok = await sendClaimEmail(getEnvVar('RESEND_API_KEY') ?? '', prospect.email as string, {
    name: (prospect.name as string) ?? '',
    token: prospect.claim_token as string,
    listingTitle: (listing?.title as string) ?? 'Váš inzerát',
  });
  if (!ok) return json({ error: 'E-mail se nepodařilo odeslat' }, 502);

  await markProspectSent(supabase, prospectId, 'email');
  return json({ ok: true });
};
```

- [ ] **Step 2: Ověř typecheck**

Run: `npx astro check --minimumSeverity error 2>&1 | tail -5`
Expected: bez chyb v `send.ts`

- [ ] **Step 3: Commit**

```bash
git add src/pages/admin/bazar/seed/api/send.ts
git commit -m "feat(bazar): admin API odeslání claim e-mailu (Resend)"
```

---

## Task 12: Claim stránka — náhled + souhlas

**Files:**
- Create: `src/pages/bazar/prevzit/[token].astro`
- Modify: `src/middleware.ts` (přidat `/bazar/prevzit` do `needsAuthContext`)

- [ ] **Step 1: Uprav middleware `needsAuthContext`**

V `src/middleware.ts`, ve funkci `needsAuthContext`, přidej k blokům `/bazar/...`:

```ts
  if (pathname.startsWith('/bazar/prevzit')) return true;
```

- [ ] **Step 2: Napiš claim stránku**

```astro
---
export const prerender = false;
import Layout from '../../../layouts/Layout.astro';
import { createServerClient } from '../../../lib/supabase';
import { getProspectByToken, markProspectOpened } from '../../../lib/bazar-seed';
import { isTokenExpired } from '../../../lib/bazar-seed-token';

export const TERMS_VERSION = '2026-07-19';

const { token } = Astro.params;
const supabase = createServerClient();
const prospect = token ? await getProspectByToken(supabase, token) : null;

let state: 'ok' | 'invalid' | 'expired' | 'done' = 'ok';
if (!prospect) state = 'invalid';
else if (prospect.status === 'confirmed') state = 'done';
else if (isTokenExpired(prospect.token_expires_at)) state = 'expired';

let listings: any[] = [];
if (state === 'ok' && prospect) {
  await markProspectOpened(supabase, prospect.id, new Date().toISOString());
  const { data } = await supabase
    .from('bazar_listings')
    .select('id, title, price, description, bazar_images(storage_path)')
    .eq('seed_prospect_id', prospect.id);
  listings = data ?? [];
}
const bucketUrl = `${import.meta.env.PUBLIC_SUPABASE_URL}/storage/v1/object/public/bazar-images/`;
---
<Layout title="Zveřejnění inzerátu">
  <main class="mx-auto max-w-2xl p-6">
    {state === 'invalid' && <p class="text-red-700">Neplatný odkaz.</p>}
    {state === 'expired' && <p class="text-red-700">Platnost odkazu vypršela.</p>}
    {state === 'done' && <p class="text-green-700">Tento inzerát už byl zveřejněn. <a class="underline" href="/bazar/moje">Přejít do mých inzerátů</a></p>}

    {state === 'ok' && (
      <>
        <p class="mb-4 rounded bg-amber-50 p-3 text-sm">
          Připravili jsme vám tento inzerát podle vaší nabídky na Bazoši. Zkontrolujte jej a jedním
          kliknutím zdarma zveřejněte na Agro-svět bazaru.
        </p>
        {listings.map((l) => (
          <article class="mb-4 rounded border p-4">
            <h2 class="font-semibold">{l.title}</h2>
            {l.price && <p class="text-green-700 font-bold">{l.price.toLocaleString('cs-CZ')} Kč</p>}
            <p class="text-sm text-gray-700 whitespace-pre-line">{l.description}</p>
            <div class="mt-2 flex gap-2 flex-wrap">
              {l.bazar_images?.map((img: any) => (
                <img src={bucketUrl + img.storage_path} alt="" class="h-24 w-24 object-cover rounded" />
              ))}
            </div>
          </article>
        ))}

        <form method="POST" action="/bazar/prevzit/api/confirm" class="mt-6 rounded border p-4">
          <input type="hidden" name="token" value={token} />
          <input type="hidden" name="terms_version" value={TERMS_VERSION} />
          <label class="flex items-start gap-2 text-sm">
            <input type="checkbox" name="agree" required class="mt-1" />
            <span>Potvrzuji, že jsem vlastníkem inzerátu a fotek a mám právo je zveřejnit, a souhlasím
            s <a href="/bazar/pravidla" class="underline" target="_blank">podmínkami bazaru</a>.</span>
          </label>
          <button class="mt-4 w-full rounded bg-green-700 p-3 text-white font-semibold">
            Zveřejnit můj inzerát
          </button>
        </form>
      </>
    )}
  </main>
</Layout>
```

- [ ] **Step 3: Ověř v dev serveru**

Run: založ testovacího prospekta v DB, otevři `/bazar/prevzit/<token>`.
Expected: náhled inzerátu + zaškrtávátko + tlačítko; neplatný token → hláška.

- [ ] **Step 4: Commit**

```bash
git add src/pages/bazar/prevzit/\[token\].astro src/middleware.ts
git commit -m "feat(bazar): claim stránka s náhledem a souhlasem"
```

---

## Task 13: API — potvrzení claimu + passwordless login

Vytvoří/dohledá auth uživatele, zveřejní inzeráty (`confirmProspect`), a přihlásí prodejce přes admin-generovaný magic link (redirect na existující `/bazar/auth/callback`).

**Files:**
- Create: `src/pages/bazar/prevzit/api/confirm.ts`

- [ ] **Step 1: Napiš endpoint**

```ts
import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../lib/supabase';
import { confirmProspect, type EnsureUser } from '../../../../lib/bazar-seed';
import { SITE_URL } from '../../../../lib/config';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const form = await request.formData();
  const token = form.get('token')?.toString() ?? '';
  const termsVersion = form.get('terms_version')?.toString() ?? '';
  const agree = form.get('agree')?.toString() === 'on';
  if (!token || !agree) return new Response('Chybí souhlas nebo token', { status: 400 });

  const supabase = createServerClient();

  // Zajisti auth usera: dohledej podle e-mailu (bazar_users), jinak vytvoř passwordless.
  const ensureUser: EnsureUser = async ({ email, name, phone }) => {
    const { data: existing } = await supabase.from('bazar_users').select('id').eq('email', email).maybeSingle();
    if (existing?.id) return existing.id as string;

    const { data: created, error } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { name, phone },
    });
    if (error || !created.user) throw new Error(`createUser: ${error?.message}`);
    const uid = created.user.id;
    const { error: pErr } = await supabase.from('bazar_users').insert({
      id: uid, name: name || email, phone: phone || '', email, location: '',
    });
    if (pErr) throw new Error(`bazar_users insert: ${pErr.message}`);
    return uid;
  };

  let email = '';
  try {
    const { data: p } = await supabase.from('bazar_seed_prospects').select('email').eq('claim_token', token).single();
    email = (p?.email as string) ?? '';
    await confirmProspect(supabase, {
      token,
      ip: clientAddress ?? request.headers.get('x-forwarded-for') ?? '',
      termsVersion,
      ensureUser,
    });
  } catch (e) {
    return new Response(`Chyba: ${(e as Error).message}`, { status: 400 });
  }

  // Passwordless přihlášení: vygeneruj magic link a přesměruj přes callback na /bazar/moje.
  const { data: link } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: { redirectTo: `${SITE_URL}/bazar/auth/callback?next=/bazar/moje?welcome=1` },
  });
  const actionLink = link?.properties?.action_link ?? `${SITE_URL}/bazar/moje?welcome=1`;
  return new Response(null, { status: 303, headers: { Location: actionLink } });
};
```

> Pozn.: v API route se přesměrovává přes `new Response(null, { status: 303, headers: { Location } })`
> (ne `Astro.redirect`, ten je jen ve stránkách). `action_link` z `generateLink` po projití
> `/bazar/auth/callback` založí session a přesměruje na `next`.

- [ ] **Step 2: Ověř typecheck**

Run: `npx astro check --minimumSeverity error 2>&1 | tail -5`
Expected: bez chyb v `confirm.ts`

- [ ] **Step 3: Ruční E2E test (dev)**

Založ prospekta + draft, otevři claim odkaz, zaškrtni souhlas, odešli.
Expected: přesměruje přihlášeného na `/bazar/moje`; inzerát je `active`; v `bazar_seed_prospects` je `confirmed_at`, `confirmed_ip`, `terms_version`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/bazar/prevzit/api/confirm.ts
git commit -m "feat(bazar): confirm API — účet, publikace, passwordless login"
```

---

## Task 14: Volitelné nastavení hesla

Po přihlášení na `/bazar/moje` nabídni nastavení hesla. Reuse existující session (browser klient). Malý blok na stránce `moje/index.astro` zobrazený jen když uživatel přišel z claimu (`?welcome=1`).

**Files:**
- Modify: `src/pages/bazar/moje/index.astro`

- [ ] **Step 1: Ověř redirect z Tasku 13**

Confirm endpoint už přesměrovává na `/bazar/moje?welcome=1` (nastaveno v Tasku 13). Jen ověř,
že `redirectTo` i fallback v `confirm.ts` obsahují `?welcome=1`. Pokud ne, doplň.

- [ ] **Step 2: Přidej blok do `moje/index.astro`**

Do frontmatteru: `const welcome = Astro.url.searchParams.get('welcome') === '1';`
Do markupu nahoře:

```astro
{welcome && (
  <section class="mb-6 rounded border border-green-300 bg-green-50 p-4">
    <p class="font-semibold">Váš inzerát je zveřejněný! 🎉</p>
    <p class="text-sm mb-2">Chcete si nastavit heslo pro pozdější úpravy? (Nepovinné — příště vám
    pošleme přihlašovací odkaz e-mailem.)</p>
    <form id="pwForm" class="flex gap-2">
      <input type="password" name="password" minlength="8" placeholder="Nové heslo" class="border p-2 flex-1" />
      <button class="bg-green-700 text-white px-4 rounded">Uložit heslo</button>
    </form>
    <p id="pwMsg" class="text-sm mt-1"></p>
  </section>
  <script>
    import { getSupabaseBrowser } from '../../../lib/supabase-browser';
    const form = document.getElementById('pwForm') as HTMLFormElement;
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const pw = (new FormData(form).get('password') as string) || '';
      const { error } = await getSupabaseBrowser().auth.updateUser({ password: pw });
      document.getElementById('pwMsg')!.textContent = error ? `Chyba: ${error.message}` : 'Heslo uloženo ✓';
    });
  </script>
)}
```

- [ ] **Step 3: Ověř v dev serveru**

Run: projdi claim flow → na `/bazar/moje?welcome=1` se zobrazí blok; uložení hesla vrátí „Heslo uloženo ✓".

- [ ] **Step 4: Commit**

```bash
git add src/pages/bazar/moje/index.astro src/pages/bazar/prevzit/api/confirm.ts
git commit -m "feat(bazar): volitelné nastavení hesla po převzetí inzerátu"
```

---

## Task 15: Cron — úklid nepotvrzených prospektů (GDPR)

Smaže prospekty ve stavu draft/sent/opened starší 30 dní; CASCADE smaže draft inzeráty. Draft fotky ve Storage se smažou nejdřív (nemají CASCADE do bucketu).

**Files:**
- Create: `scripts/bazar-seed-cleanup.mjs`
- Modify: `package.json` (skript `bazar:cleanup`)

- [ ] **Step 1: Napiš skript**

```js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const cutoff = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();

const { data: stale, error } = await supabase
  .from('bazar_seed_prospects')
  .select('id')
  .in('status', ['draft', 'sent', 'opened'])
  .lt('created_at', cutoff);
if (error) { console.error(error); process.exit(1); }

for (const p of stale ?? []) {
  const { data: imgs } = await supabase
    .from('bazar_images')
    .select('storage_path, bazar_listings!inner(seed_prospect_id)')
    .eq('bazar_listings.seed_prospect_id', p.id);
  const paths = (imgs ?? []).map((i) => i.storage_path);
  if (paths.length) await supabase.storage.from('bazar-images').remove(paths);
  await supabase.from('bazar_seed_prospects').delete().eq('id', p.id); // CASCADE smaže listings
}
console.log(`Smazáno ${stale?.length ?? 0} nepotvrzených prospektů.`);
```

- [ ] **Step 2: Přidej npm skript do `package.json`**

Do `scripts`:
```json
"bazar:cleanup": "node --env-file=.env scripts/bazar-seed-cleanup.mjs"
```

- [ ] **Step 3: Ověř běh (bez dat je no-op)**

Run: `npm run bazar:cleanup`
Expected: `Smazáno 0 nepotvrzených prospektů.`

- [ ] **Step 4: Commit**

```bash
git add scripts/bazar-seed-cleanup.mjs package.json
git commit -m "feat(bazar): cron úklid nepotvrzených prospektů (GDPR, 30 dní)"
```

---

## Task 16: Finální kontrola

- [ ] **Step 1: Spusť všechny testy**

Run: `npm test`
Expected: PASS — všechny nové testy zelené (token, parse, category, rewrite, seed, email).

- [ ] **Step 2: Build**

Run: `npm run build 2>&1 | tail -15`
Expected: build projde bez chyb.

- [ ] **Step 3: Commit (pokud něco zbylo)**

```bash
git add -A && git commit -m "chore(bazar): finální kontrola seeding feature" || echo "nic k commitu"
```

---

## Self-review poznámky (pokrytí specu)

- Import z URL + fotky + AI přepis + auto-kategorie → Task 3,4,5,9.
- Neveřejný draft (`pending_claim`, RLS) → Task 1.
- Claim magic-link + souhlas + audit → Task 2,7,12,13.
- Passwordless-first, heslo volitelné → Task 13,14.
- Resend e-mail + ruční WhatsApp odkaz (kopírovat) → Task 8,10,11.
- Tracking otevření (`opened_at`) → Task 7,12.
- GDPR úklid 30 dní → Task 15.
- Fáze 2 (upomínky, lákadla, SMS) → mimo rozsah, dle specu.
