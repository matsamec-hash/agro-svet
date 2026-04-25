# Articles Featured Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementovat `featured` flag pro články a "rising tide" sort na HP, plus admin UI `/admin/clanky/` pro toggle.

**Architecture:** Jediný `featured boolean` sloupec na `articles`. HP query přidá `ORDER BY featured DESC, published_at DESC` před existující limit-5. Admin UI inline-toggle bez full-page refresh, defense-in-depth `is_admin` guard, povinný `site_id` filtr (sdílená tabulka 3 webů).

**Tech Stack:** Astro 6 SSR (@astrojs/cloudflare), Supabase (`obhypfuzmknvmknskdwh`), TypeScript, vitest.

**Branch:** `bazar/topovani` (worktree `/Users/matejsamec/agro-svet-topovani/`) — pokračuje předchozí topování fáze.

**Spec:** [`docs/superpowers/specs/2026-04-25-articles-featured-design.md`](../specs/2026-04-25-articles-featured-design.md)

**Konstanta:** Agro-svět `site_id = 'cadc73fd-6bd9-4dc5-a0da-ea33725762e1'` (referencováno na 4+ místech, hardcoduje se opět tady — extract do shared lib bude over-engineering pro 1 stránku navíc).

---

## File Structure

**Create:**
- `supabase/migrations/007_articles_featured.sql` — DB schéma
- `tests/lib/articles-featured-sort.test.ts` — sort dokumentační test
- `src/pages/api/admin/clanky/toggle-featured.ts` — POST endpoint
- `src/pages/admin/clanky/index.astro` — admin UI

**Modify:**
- `src/pages/index.astro` — přidat `featured` do SELECT + 2-stage sort
- `src/pages/admin/index.astro` — přidat třetí dlaždici

**Existing patterns referenced:**
- Middleware admin gate: `src/middleware.ts` už gate-uje `/admin/*` přes `is_admin`
- Defense-in-depth API guard: `src/pages/admin/bazar/api/toggle-featured.ts` (pattern z bazar fáze)
- Admin UI styling: `src/pages/admin/bazar/index.astro` (table, filtery, search sanitize)
- Supabase client: `createServerClient()` z `src/lib/supabase` (service-key, bypass RLS)

---

### Task 1: Migrace 007 — DB schéma

**Files:**
- Create: `supabase/migrations/007_articles_featured.sql`

- [ ] **Step 1: Vytvořit migraci**

Write `supabase/migrations/007_articles_featured.sql`:

```sql
-- Articles featured flag — pin to HP hero grid via ORDER BY featured DESC.
-- Sdílený Supabase projekt: featured je per-row, takže neovlivní zenazije ani content-network.
-- Idempotentní (IF NOT EXISTS).

ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_articles_featured
  ON articles(site_id, featured, published_at DESC)
  WHERE featured = true;
```

- [ ] **Step 2: Commit migrace**

```bash
cd /Users/matejsamec/agro-svet-topovani
git add supabase/migrations/007_articles_featured.sql
git commit -m "feat(articles): migration 007 — featured flag"
```

- [ ] **Step 3: Aplikovat migraci na Supabase (RUČNÍ KROK USERA)**

User aplikuje přes Supabase dashboard SQL Editor (projekt `obhypfuzmknvmknskdwh`):
1. Otevřít obsah `supabase/migrations/007_articles_featured.sql`
2. Spustit v SQL Editoru (idempotentní, bezpečné znovu)
3. Verifikace:
   ```sql
   SELECT column_name, data_type, is_nullable, column_default
   FROM information_schema.columns
   WHERE table_name = 'articles' AND column_name = 'featured';
   ```
   Expected: 1 řádek (featured/boolean/NO/false).

**Implementer subagent:** Pouze vytvoř a commitni soubor. Aplikace na DB je úkol uživatele.

---

### Task 2: Unit test — sort dokumentace (TDD)

**Files:**
- Create: `tests/lib/articles-featured-sort.test.ts`

- [ ] **Step 1: Napsat failing test**

Write `tests/lib/articles-featured-sort.test.ts`:

```typescript
import { describe, expect, it } from 'vitest';

type Article = { id: string; featured: boolean; published_at: string };

// Reference implementation of the sort applied in src/pages/index.astro:
// .order('featured', { ascending: false }).order('published_at', { ascending: false })
// This pure function exists for tests to assert ordering rules without hitting Supabase.
function sortArticles(articles: Article[]): Article[] {
  return [...articles].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.published_at.localeCompare(a.published_at);
  });
}

describe('articles sort: featured DESC, published_at DESC', () => {
  it('0 featured: pure chronological order', () => {
    const articles: Article[] = [
      { id: '1', featured: false, published_at: '2026-01-01' },
      { id: '2', featured: false, published_at: '2026-03-01' },
      { id: '3', featured: false, published_at: '2026-02-01' },
    ];
    expect(sortArticles(articles).map(a => a.id)).toEqual(['2', '3', '1']);
  });

  it('1 featured: featured first regardless of date', () => {
    const articles: Article[] = [
      { id: '1', featured: false, published_at: '2026-03-01' },
      { id: '2', featured: true,  published_at: '2026-01-01' },
      { id: '3', featured: false, published_at: '2026-02-01' },
    ];
    expect(sortArticles(articles).map(a => a.id)).toEqual(['2', '1', '3']);
  });

  it('2 featured: newer-published featured wins hero', () => {
    const articles: Article[] = [
      { id: '1', featured: true,  published_at: '2026-01-01' },
      { id: '2', featured: false, published_at: '2026-03-01' },
      { id: '3', featured: true,  published_at: '2026-02-01' },
    ];
    expect(sortArticles(articles).map(a => a.id)).toEqual(['3', '1', '2']);
  });

  it('all featured: pure chrono among featured', () => {
    const articles: Article[] = [
      { id: '1', featured: true, published_at: '2026-01-01' },
      { id: '2', featured: true, published_at: '2026-03-01' },
      { id: '3', featured: true, published_at: '2026-02-01' },
    ];
    expect(sortArticles(articles).map(a => a.id)).toEqual(['2', '3', '1']);
  });

  it('empty array stays empty', () => {
    expect(sortArticles([])).toEqual([]);
  });
});
```

- [ ] **Step 2: Spustit test, ověřit že běží zelený**

Run:
```bash
source ~/.nvm/nvm.sh && nvm use 22 && cd /Users/matejsamec/agro-svet-topovani && npm run test -- articles-featured-sort
```

Expected: 5/5 PASS. Tato `sortArticles` funkce je samostatná pure function (žádný external dep), takže projde rovnou — netvoří TDD red→green cyklus, jen dokumentuje očekávané chování.

- [ ] **Step 3: Commit**

```bash
git add tests/lib/articles-featured-sort.test.ts
git commit -m "test(articles): document featured DESC, published_at DESC sort rules"
```

---

### Task 3: HP `/` integrace — featured DESC sort

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Rozšířit SELECT a přidat řazení**

V [src/pages/index.astro](../../src/pages/index.astro) najít blok (přibližně řádky 11–17):

```ts
const { data: articles } = await supabase
  .from('articles')
  .select('id, title, slug, perex, featured_image_url, category, tags, published_at')
  .eq('site_id', SITE_ID)
  .eq('status', 'published')
  .order('published_at', { ascending: false })
  .limit(20);
```

Nahradit:

```ts
const { data: articles } = await supabase
  .from('articles')
  .select('id, title, slug, perex, featured_image_url, category, tags, published_at, featured')
  .eq('site_id', SITE_ID)
  .eq('status', 'published')
  .order('featured', { ascending: false })
  .order('published_at', { ascending: false })
  .limit(20);
```

**Změny:** přidán `featured` do SELECT, přidán `.order('featured', { ascending: false })` PŘED stávající `.order('published_at', ...)`.

**Renderování (`featured = sorted[0]`, `heroRight = sorted.slice(1, 5)`, `latest = sorted.slice(0, 6)`) zůstává beze změny** — sort logika upstream už dodá pinned articles na začátek pole.

- [ ] **Step 2: Ověřit build**

Run:
```bash
source ~/.nvm/nvm.sh && nvm use 22 && cd /Users/matejsamec/agro-svet-topovani && npm run build 2>&1 | tail -10
```

Expected: build complete, žádné errors. (Pozor: TypeScript může křičet pokud někde používáš `articles[0].featured` jako specifický typ — `as any` je v existujícím kódu už použité, takže bezpečné.)

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(articles): featured DESC sort on HP — featured articles bubble to top"
```

---

### Task 4: Admin API endpoint `toggle-featured.ts`

**Files:**
- Create: `src/pages/api/admin/clanky/toggle-featured.ts`

- [ ] **Step 1: Vytvořit endpoint**

Write `src/pages/api/admin/clanky/toggle-featured.ts`:

```typescript
// POST /api/admin/clanky/toggle-featured
// Admin akce: pin/unpin článku jako featured na HP hero gridu.
// Defense in depth — middleware už gate-uje /admin/*, tady druhá kontrola.
// Site filter v UPDATE chrání proti cross-site featured by mistake (sdílená tabulka).
import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../lib/supabase';

export const prerender = false;

const AGRO_SVET_SITE_ID = 'cadc73fd-6bd9-4dc5-a0da-ea33725762e1';

type Body = { articleId: string; featured: boolean };

export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) return json({ error: 'unauthenticated' }, 401);

  const sb = createServerClient();

  const { data: profile } = await sb
    .from('bazar_users')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();
  if (!profile?.is_admin) return json({ error: 'forbidden' }, 403);

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'bad_request', message: 'Invalid JSON' }, 400);
  }

  if (!body || typeof body !== 'object' || !('articleId' in body) || typeof body.articleId !== 'string') {
    return json({ error: 'bad_request', message: 'Missing articleId' }, 400);
  }
  if (typeof body.featured !== 'boolean') {
    return json({ error: 'bad_request', message: 'featured must be boolean' }, 400);
  }

  const { data: updated, error } = await sb
    .from('articles')
    .update({ featured: body.featured })
    .eq('id', body.articleId)
    .eq('site_id', AGRO_SVET_SITE_ID)
    .select('id, featured')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return json({ error: 'not_found' }, 404);
    }
    console.error('[clanky/toggle-featured] update failed', error);
    return json({ error: 'server_error' }, 500);
  }

  return json({ ok: true, article: updated });
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
```

**Pozn. ke 404:** `single()` na 0 řádků hodí Supabase PostgreSQL error kód `PGRST116`. To pokrývá oba případy: článek neexistuje, nebo existuje ale patří jinému `site_id`. Z bezpečnostního hlediska je správné vracet 404 v obou případech (neprozradit existenci článku z jiného webu).

- [ ] **Step 2: Ověřit build**

Run:
```bash
source ~/.nvm/nvm.sh && nvm use 22 && cd /Users/matejsamec/agro-svet-topovani && npm run build 2>&1 | tail -10
```

Expected: build complete.

- [ ] **Step 3: Commit**

```bash
git add src/pages/api/admin/clanky/toggle-featured.ts
git commit -m "feat(admin): POST /api/admin/clanky/toggle-featured endpoint"
```

---

### Task 5: Admin UI `/admin/clanky/`

**Files:**
- Create: `src/pages/admin/clanky/index.astro`

- [ ] **Step 1: Vytvořit stránku**

Write `src/pages/admin/clanky/index.astro`:

```astro
---
export const prerender = false;
import Layout from '../../../layouts/Layout.astro';
import { createServerClient } from '../../../lib/supabase';

const AGRO_SVET_SITE_ID = 'cadc73fd-6bd9-4dc5-a0da-ea33725762e1';

const url = Astro.url;
const filter = (url.searchParams.get('filter') ?? 'all') as 'all' | 'featured' | 'none';
const search = url.searchParams.get('q') ?? '';
const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1'));
const PER_PAGE = 30;

const supabase = createServerClient();

let dbQuery = supabase
  .from('articles')
  .select('id, title, slug, category, status, featured, published_at', { count: 'exact' })
  .eq('site_id', AGRO_SVET_SITE_ID)
  .eq('status', 'published')
  .order('featured', { ascending: false })
  .order('published_at', { ascending: false })
  .range((page - 1) * PER_PAGE, page * PER_PAGE - 1);

if (filter === 'featured') dbQuery = dbQuery.eq('featured', true);
else if (filter === 'none') dbQuery = dbQuery.eq('featured', false);

if (search) {
  // Sanitize: strip Supabase filter metacharacters (same as /admin/bazar/).
  const safeSearch = search.replace(/[,()*]/g, '');
  if (safeSearch) {
    dbQuery = dbQuery.ilike('title', `%${safeSearch}%`);
  }
}

const { data: articles, count } = await dbQuery;
const totalPages = Math.ceil((count ?? 0) / PER_PAGE);

function fmtDate(timestamp: string): string {
  const d = new Date(timestamp);
  return `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`;
}
---

<Layout title="Admin — Články featured" description="Pin článků na HP">
  <main class="admin-clanky">
    <a href="/admin/" class="back-link">← Admin přehled</a>
    <h1>Články — featured na HP</h1>
    <p class="lead">Zaškrtnutý článek se objeví v hero gridu na <a href="/" target="_blank" rel="noopener">úvodní stránce</a>. Více featured = bubblují k vrcholu (newest first).</p>

    <form method="GET" class="filters">
      <div class="filter-chips">
        <a href="?filter=all" class={`chip ${filter === 'all' ? 'chip-active' : ''}`}>Vše</a>
        <a href="?filter=featured" class={`chip ${filter === 'featured' ? 'chip-active' : ''}`}>Jen featured</a>
        <a href="?filter=none" class={`chip ${filter === 'none' ? 'chip-active' : ''}`}>Jen non-featured</a>
      </div>
      <input type="search" name="q" value={search} placeholder="Hledat titulek…" class="search-input" />
      {filter !== 'all' && <input type="hidden" name="filter" value={filter} />}
      <button type="submit" class="btn-primary">Hledat</button>
    </form>

    {articles && articles.length > 0 ? (
      <div class="admin-table">
        <div class="table-head">
          <div class="col-title">Titulek</div>
          <div class="col-cat">Kategorie</div>
          <div class="col-date">Datum</div>
          <div class="col-feat">Featured</div>
        </div>
        {articles.map((article: any) => (
          <div class="table-row" data-article-id={article.id}>
            <div class="col-title">
              <a href={`/novinky/${article.slug}/`} target="_blank" rel="noopener">{article.title}</a>
            </div>
            <div class="col-cat">{article.category ?? '—'}</div>
            <div class="col-date">{fmtDate(article.published_at)}</div>
            <div class="col-feat">
              <label class="toggle">
                <input
                  type="checkbox"
                  data-toggle-featured
                  checked={article.featured}
                />
                <span class="toggle-label">{article.featured ? 'ON' : 'OFF'}</span>
              </label>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p class="empty">Žádné články nenalezeny.</p>
    )}

    <nav class="pagination">
      {page > 1 && <a href={`?filter=${filter}${search ? '&q=' + encodeURIComponent(search) : ''}&page=${page - 1}`}>← Předchozí</a>}
      <span>Strana {page} / {totalPages || 1}</span>
      {page < totalPages && <a href={`?filter=${filter}${search ? '&q=' + encodeURIComponent(search) : ''}&page=${page + 1}`}>Další →</a>}
    </nav>
  </main>

  <script>
    document.querySelectorAll<HTMLInputElement>('[data-toggle-featured]').forEach((checkbox) => {
      checkbox.addEventListener('change', async () => {
        const row = checkbox.closest<HTMLElement>('[data-article-id]')!;
        const articleId = row.dataset.articleId!;
        const newValue = checkbox.checked;
        const label = row.querySelector<HTMLElement>('.toggle-label')!;
        const previousLabel = label.textContent;

        checkbox.disabled = true;
        label.textContent = '…';

        try {
          const res = await fetch('/api/admin/clanky/toggle-featured', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ articleId, featured: newValue }),
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(data.message ?? data.error ?? 'Request failed');
          label.textContent = data.article.featured ? 'ON' : 'OFF';
        } catch (err: any) {
          // Revert on error
          checkbox.checked = !newValue;
          label.textContent = previousLabel;
          alert(`Chyba: ${err.message}`);
        } finally {
          checkbox.disabled = false;
        }
      });
    });
  </script>

  <style>
    .admin-clanky {
      max-width: 1100px;
      margin: 0 auto;
      padding: 40px 24px 80px;
    }
    .back-link { font-size: 13px; color: #666; text-decoration: none; }
    .back-link:hover { text-decoration: underline; }
    h1 {
      font-family: 'Chakra Petch', sans-serif;
      font-size: 2rem;
      margin: 12px 0 8px;
    }
    .lead {
      font-size: 14px;
      color: #666;
      margin: 0 0 24px;
      max-width: 640px;
    }
    .lead a { color: #1a1a1a; }

    .filters {
      display: flex;
      gap: 12px;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    .filter-chips { display: flex; gap: 6px; flex-wrap: wrap; }
    .chip {
      display: inline-block;
      padding: 6px 14px;
      font-size: 13px;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      background: #fff;
      text-decoration: none;
      color: #555;
    }
    .chip:hover { background: #f5f5f5; }
    .chip-active {
      background: #FFFF00;
      border-color: #FFFF00;
      color: #1a1a1a;
      font-weight: 600;
    }
    .search-input {
      padding: 8px 12px;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      font-size: 14px;
      min-width: 240px;
      flex: 1;
    }

    .admin-table {
      border: 1px solid #e8e8e8;
      border-radius: 14px;
      overflow: hidden;
      background: #fff;
    }
    .table-head, .table-row {
      display: grid;
      grid-template-columns: 4fr 1.5fr 1fr 1fr;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
    }
    .table-head {
      background: #fafafa;
      border-bottom: 1px solid #e8e8e8;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      color: #666;
      letter-spacing: 0.5px;
    }
    .table-row {
      border-bottom: 1px solid #f0f0f0;
      font-size: 14px;
    }
    .table-row:last-child { border-bottom: none; }
    .col-title a { color: #1a1a1a; text-decoration: none; }
    .col-title a:hover { text-decoration: underline; }
    .col-cat { color: #666; font-size: 13px; }
    .col-date { color: #666; font-size: 13px; }
    .col-feat { text-align: right; }

    .toggle {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      user-select: none;
    }
    .toggle input { width: 18px; height: 18px; cursor: pointer; }
    .toggle input:disabled { cursor: wait; }
    .toggle-label {
      font-family: 'Chakra Petch', sans-serif;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      min-width: 28px;
    }

    .pagination {
      margin-top: 24px;
      display: flex;
      gap: 16px;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }
    .pagination a { color: #1a1a1a; }

    .empty {
      text-align: center;
      padding: 64px 0;
      color: #666;
      background: #fafafa;
      border-radius: 14px;
    }

    @media (max-width: 800px) {
      .table-head { display: none; }
      .table-row {
        grid-template-columns: 1fr;
        gap: 6px;
      }
      .col-feat { text-align: left; }
    }
  </style>
</Layout>
```

- [ ] **Step 2: Ověřit build**

Run:
```bash
source ~/.nvm/nvm.sh && nvm use 22 && cd /Users/matejsamec/agro-svet-topovani && npm run build 2>&1 | tail -15
```

Expected: build complete.

- [ ] **Step 3: Commit**

```bash
git add src/pages/admin/clanky/index.astro
git commit -m "feat(admin): /admin/clanky/ UI — toggle featured for articles"
```

---

### Task 6: Update admin rozcestník — třetí dlaždice

**Files:**
- Modify: `src/pages/admin/index.astro`

- [ ] **Step 1: Přidat dlaždici "Články"**

V [src/pages/admin/index.astro](../../src/pages/admin/index.astro) najít existující `<div class="tiles">` blok se dvěma `<a class="tile">` (Fotosoutěž + Agro bazar). Přidat třetí tile na konci:

```diff
       <a href="/admin/bazar/" class="tile">
         <h2>Agro bazar — Topování</h2>
         <p>TOP inzeráty, aktivace, prodloužení</p>
       </a>
+      <a href="/admin/clanky/" class="tile">
+        <h2>Články — featured na HP</h2>
+        <p>Pin článků nahoru hero gridu</p>
+      </a>
     </div>
```

- [ ] **Step 2: Ověřit build**

Run:
```bash
source ~/.nvm/nvm.sh && nvm use 22 && cd /Users/matejsamec/agro-svet-topovani && npm run build 2>&1 | tail -10
```

Expected: build complete.

- [ ] **Step 3: Commit**

```bash
git add src/pages/admin/index.astro
git commit -m "feat(admin): add Články tile to admin rozcestník"
```

---

### Task 7: Final build + test + push

**Files:** (žádné modifikace — verifikace + push)

- [ ] **Step 1: Full build + tests**

```bash
source ~/.nvm/nvm.sh && nvm use 22 && cd /Users/matejsamec/agro-svet-topovani && npm run build 2>&1 | tail -10 && npm run test 2>&1 | tail -10
```

Expected:
- Build: `[build] Complete!`
- Tests: 67/67 passing (62 stávajících + 5 nových z `articles-featured-sort.test.ts`)

- [ ] **Step 2: Ruční smoke test ve `npm run dev` (volitelné, dělá user)**

Předpoklad: migrace 007 je aplikovaná na Supabase (Task 1 Step 3 hotový).

1. Admin přihlášen → `/admin/` → vidí 3 dlaždice (Fotosoutěž, Bazar, Články)
2. `/admin/clanky/` → seznam článků s checkboxy
3. Zaškrtne "Featured" na non-featured článek → checkbox zůstane zaškrtnutý, label se změní z "OFF" na "ON" bez refreshe
4. Otevře `/` → zaškrtnutý článek je v hero spotu (sorted[0])
5. Zaškrtne druhý článek (novější `published_at`) → HP refresh ukáže nový jako hero, předchozí v small cards
6. Odznačí oba → HP vrátí current behavior (nejnovější chronologicky je hero)
7. `/novinky/` → seznam beze změny (řazený striktně dle data)

- [ ] **Step 3: Push branch**

```bash
git push origin bazar/topovani
```

Expected: push success, branch už existuje na remote z předchozí fáze (bazar topování), tohle pushne nové commity nahoru.

- [ ] **Step 4: Reportovat hand-off**

Reportovat uživateli:
- Branch `bazar/topovani` má novou sérii commitů (spec + plan + 6 implementačních)
- **Migrace 007 NENÍ aplikovaná** — user ji musí spustit přes Supabase dashboard SQL Editor (postupně: 005 → 006 → 007 pokud ještě nebyly)
- Smoke test = manual po DB migration
- **NEDEPLOYOVÁNO** (dle zadání)
- PR + merge + deploy = oddělený krok pro usera

---

## Plan Self-Review

**Spec coverage:**
- [x] Sekce 1 (DB schéma) → Task 1 ✓
- [x] Sekce 2 (HP integrace) → Task 3 ✓
- [x] Sekce 3 (Admin UI) → Task 4 (API) + Task 5 (UI) + Task 6 (rozcestník) ✓
- [x] Sekce 4 (Visual: žádné badges) → není task — ArticleCard neměním, žádný featured signal v UI ✓
- [x] Sekce 5 (Testy) → Task 2 ✓
- [x] Sekce 6 (Deploy: nedeployovat) → Task 7 explicit ✓
- [x] Sekce 7 (Out of scope) → plán nepokrývá vyloučené věci ✓
- [x] Cross-site izolace → Task 4 endpoint má `eq('site_id', AGRO_SVET_SITE_ID)`, Task 5 admin UI také ✓

**Placeholder scan:** Žádné "TBD", "TODO", "implement later". Každý step má konkrétní kód nebo diff. Task 6 Step 1 je diff (3 řádky) — bezpečné protože soubor je krátký a target přesně lokalizován.

**Type consistency:**
- `Body` typ v Task 4 endpoint (`{ articleId: string; featured: boolean }`) ✓ matches client fetch v Task 5 (`JSON.stringify({ articleId, featured: newValue })`) ✓
- `AGRO_SVET_SITE_ID` konstanta hardcoded na 2 místech (Task 4 endpoint + Task 5 admin UI) — záměrně neexportované do shared lib (1 stránka navíc, nestojí za extract) ✓
- `sortArticles` funkce v Task 2 testu **není** importovaná do `index.astro` — je to pure-function dokumentace pro test, server-side query dělá stejné řazení přes `.order()` chain (komentář v testu to vysvětluje) ✓
- Filter typy `'all' | 'featured' | 'none'` v Task 5 — konzistentní jen v rámci Task 5 (žádný cross-task export) ✓

**Známé deviace zaznamenané:**
1. Migrace **007** (ne nový start sequence) — pokračuje 005/006 z bazar fáze
2. Pokračování branche `bazar/topovani` — topování série, jeden PR
3. `AGRO_SVET_SITE_ID` hardcoded — žádný shared lib extract teď (YAGNI, 2 místa)
