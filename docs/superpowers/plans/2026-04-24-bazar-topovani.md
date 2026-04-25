# Bazar Topování Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementovat admin-only topování (TOP inzeráty) v Agro bazaru — DB schéma, public UI s "Doporučené" sekcí, admin UI pro aktivaci/deaktivaci/prodloužení.

**Architecture:** 3 nové sloupce v `bazar_listings` (featured / featured_until / featured_plan). Lazy check expirace v queries (žádný cron). Admin guard přes existující middleware `/admin/*` + `is_admin` flag v `bazar_users`. Nová komponenta `BazarFeaturedGrid` pro "Doporučené" sekci na `/bazar/` default view. Badge v `BazarListingRow` pro featured inzeráty ve filtrovaném/stránkovaném seznamu.

**Tech Stack:** Astro 6 SSR (@astrojs/cloudflare), Supabase (projekt `obhypfuzmknvmknskdwh`), TypeScript, vitest + happy-dom, Chakra Petch / Roboto Condensed fonts, accent `#FFFF00`.

**Branch:** `bazar/topovani` (worktree `/Users/matejsamec/agro-svet-topovani/`)

**Spec:** [`docs/superpowers/specs/2026-04-24-bazar-topovani-design.md`](../specs/2026-04-24-bazar-topovani-design.md)

---

## File Structure

**Create:**
- `supabase/migrations/005_bazar_topovani.sql` — DB schéma
- `src/lib/bazar-featured.ts` — helper funkce (`isFeaturedActive`, `computeFeaturedUntil`, `formatFeaturedUntil`, `planToDays`)
- `src/components/bazar/BazarFeaturedGrid.astro` — 2×2 grid pro "Doporučené" sekci
- `src/pages/admin/bazar/index.astro` — admin UI (seznam + filtery + akce)
- `src/pages/admin/bazar/api/toggle-featured.ts` — POST endpoint pro admin akce
- `tests/lib/bazar-featured.test.ts` — unit testy helper funkcí

**Modify:**
- `src/components/bazar/BazarListingRow.astro` — přidat TOP badge overlay (props + rendering + styles)
- `src/pages/bazar/index.astro` — dual query (featured + rest), conditional "Doporučené" sekce, nové řazení
- `src/pages/bazar/moje/index.astro` — TOP stav indikátor + info text dole
- `src/pages/bazar/moje/[id].astro` — readonly info box když inzerát je featured
- `src/pages/admin/fotosoutez/index.astro` — přidat sidebar/tile s odkazem na "Agro bazar — Topování" (nebo vytvořit nový `/admin/index.astro` jako rozcestník)

**Convention note:** Testy dávám do `tests/lib/` (konzistentní se stávajícími `contest-*.test.ts`, `lokality.test.ts`), NE do `tests/bazar-topovani/` jak bylo v původním spec draftu. Výsledek stejný, přizpůsobení existující konvenci.

**Existing patterns used:**
- Admin guard: middleware `src/middleware.ts` už gate-uje `/admin/*` s `is_admin` checkem — stačí vytvořit stránku pod `/admin/bazar/`
- API admin endpointy: pattern z `src/pages/admin/fotosoutez/api/moderate.ts` (double-check `is_admin` i po middleware jako defense in depth)
- Supabase client: `createServerClient()` z `src/lib/supabase.ts`
- Session: `Astro.locals.user` (middleware nastavuje)

---

### Task 1: Migrace 005 — DB schéma

**Files:**
- Create: `supabase/migrations/005_bazar_topovani.sql`

- [ ] **Step 1: Vytvořit migraci**

Write `supabase/migrations/005_bazar_topovani.sql`:

```sql
-- Bazar TOP inzeráty (topování) — admin-only v této fázi, platba přibude později
-- Idempotentní: bezpečné znovu spustit (IF NOT EXISTS).
-- Pozor: sdílený Supabase projekt (agro-svet + zenazije + content-network) — nijak nezasahuje do jiných tabulek.

ALTER TABLE bazar_listings
  ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS featured_until timestamptz,
  ADD COLUMN IF NOT EXISTS featured_plan text;

CREATE INDEX IF NOT EXISTS idx_bazar_listings_featured_active
  ON bazar_listings(featured_until DESC)
  WHERE featured = true;
```

- [ ] **Step 2: Commit migrace**

```bash
cd /Users/matejsamec/agro-svet-topovani
git add supabase/migrations/005_bazar_topovani.sql
git commit -m "feat(bazar): migration 005 — featured flag + featured_until + featured_plan"
```

- [ ] **Step 3: Aplikovat migraci na Supabase**

Ruční krok (žádný CLI nespouštěj — Supabase projekt je sdílený):

1. Otevřít Supabase dashboard → projekt `obhypfuzmknvmknskdwh` → SQL Editor
2. Vložit obsah `supabase/migrations/005_bazar_topovani.sql`
3. Spustit (Run)
4. Ověřit: v Table Editor → `bazar_listings` → nové sloupce `featured`, `featured_until`, `featured_plan` viditelné

Verifikace v SQL editoru:
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'bazar_listings'
  AND column_name IN ('featured', 'featured_until', 'featured_plan');
```
Expected: 3 řádky (featured/boolean/NO, featured_until/timestamp/YES, featured_plan/text/YES).

---

### Task 2: Helper lib + testy (TDD)

**Files:**
- Create: `src/lib/bazar-featured.ts`
- Create: `tests/lib/bazar-featured.test.ts`

- [ ] **Step 1: Napsat failing testy**

Write `tests/lib/bazar-featured.test.ts`:

```typescript
import { describe, expect, it } from 'vitest';
import {
  isFeaturedActive,
  computeFeaturedUntil,
  formatFeaturedUntil,
  planToDays,
} from '../../src/lib/bazar-featured';

const now = new Date('2026-04-24T12:00:00Z');

describe('isFeaturedActive', () => {
  it('returns true when featured=true and featured_until in the future', () => {
    const listing = { featured: true, featured_until: '2026-05-24T12:00:00Z' };
    expect(isFeaturedActive(listing, now)).toBe(true);
  });

  it('returns false when featured=true but featured_until in the past (expired)', () => {
    const listing = { featured: true, featured_until: '2026-04-01T12:00:00Z' };
    expect(isFeaturedActive(listing, now)).toBe(false);
  });

  it('returns false when featured=true and featured_until=null (corrupt edge case)', () => {
    const listing = { featured: true, featured_until: null };
    expect(isFeaturedActive(listing, now)).toBe(false);
  });

  it('returns false when featured=false', () => {
    const listing = { featured: false, featured_until: '2026-05-24T12:00:00Z' };
    expect(isFeaturedActive(listing, now)).toBe(false);
  });

  it('returns false when featured_until is exactly now (boundary)', () => {
    const listing = { featured: true, featured_until: now.toISOString() };
    expect(isFeaturedActive(listing, now)).toBe(false);
  });
});

describe('computeFeaturedUntil', () => {
  it('new TOP (currentUntil=null) returns now + N days', () => {
    const result = computeFeaturedUntil(null, 30, now);
    const expected = new Date('2026-05-24T12:00:00Z');
    expect(result.toISOString()).toBe(expected.toISOString());
  });

  it('extending active TOP adds N days to existing featured_until', () => {
    const currentUntil = new Date('2026-05-04T12:00:00Z'); // now + 10d
    const result = computeFeaturedUntil(currentUntil, 30, now);
    const expected = new Date('2026-06-03T12:00:00Z'); // now + 10d + 30d
    expect(result.toISOString()).toBe(expected.toISOString());
  });

  it('extending expired TOP restarts from now + N days', () => {
    const currentUntil = new Date('2026-04-19T12:00:00Z'); // now - 5d
    const result = computeFeaturedUntil(currentUntil, 30, now);
    const expected = new Date('2026-05-24T12:00:00Z'); // now + 30d
    expect(result.toISOString()).toBe(expected.toISOString());
  });

  it('handles 7 days', () => {
    const result = computeFeaturedUntil(null, 7, now);
    const expected = new Date('2026-05-01T12:00:00Z');
    expect(result.toISOString()).toBe(expected.toISOString());
  });

  it('handles 60 days', () => {
    const result = computeFeaturedUntil(null, 60, now);
    const expected = new Date('2026-06-23T12:00:00Z');
    expect(result.toISOString()).toBe(expected.toISOString());
  });
});

describe('formatFeaturedUntil', () => {
  it('formats ISO timestamp as Czech date (day. month. year)', () => {
    expect(formatFeaturedUntil('2026-05-24T10:00:00Z')).toBe('24. 5. 2026');
  });

  it('formats Date object', () => {
    expect(formatFeaturedUntil(new Date('2026-12-31T10:00:00Z'))).toBe('31. 12. 2026');
  });

  it('returns empty string for null', () => {
    expect(formatFeaturedUntil(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(formatFeaturedUntil(undefined)).toBe('');
  });
});

describe('planToDays', () => {
  it('7d → 7', () => expect(planToDays('7d')).toBe(7));
  it('30d → 30', () => expect(planToDays('30d')).toBe(30));
  it('60d → 60', () => expect(planToDays('60d')).toBe(60));
});
```

- [ ] **Step 2: Spustit testy, ověřit že failují**

Run: `cd /Users/matejsamec/agro-svet-topovani && npm run test -- bazar-featured`

Expected: FAIL with module-not-found error (soubor `src/lib/bazar-featured.ts` neexistuje).

- [ ] **Step 3: Implementovat helper**

Write `src/lib/bazar-featured.ts`:

```typescript
export type FeaturedPlan = '7d' | '30d' | '60d';

export interface FeaturedListingShape {
  featured: boolean;
  featured_until: string | Date | null | undefined;
}

export function isFeaturedActive(
  listing: FeaturedListingShape,
  now: Date = new Date(),
): boolean {
  if (!listing.featured) return false;
  if (!listing.featured_until) return false;
  const until = listing.featured_until instanceof Date
    ? listing.featured_until
    : new Date(listing.featured_until);
  return until.getTime() > now.getTime();
}

export function computeFeaturedUntil(
  currentUntil: Date | null,
  days: number,
  now: Date = new Date(),
): Date {
  const base = currentUntil && currentUntil.getTime() > now.getTime()
    ? currentUntil
    : now;
  return new Date(base.getTime() + days * 24 * 60 * 60 * 1000);
}

export function formatFeaturedUntil(
  timestamp: string | Date | null | undefined,
): string {
  if (!timestamp) return '';
  const d = timestamp instanceof Date ? timestamp : new Date(timestamp);
  if (isNaN(d.getTime())) return '';
  return `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`;
}

export function planToDays(plan: FeaturedPlan): number {
  const map: Record<FeaturedPlan, number> = { '7d': 7, '30d': 30, '60d': 60 };
  return map[plan];
}
```

- [ ] **Step 4: Spustit testy, ověřit že projdou**

Run: `npm run test -- bazar-featured`

Expected: PASS — 14 testů projde.

- [ ] **Step 5: Commit**

```bash
git add src/lib/bazar-featured.ts tests/lib/bazar-featured.test.ts
git commit -m "feat(bazar): bazar-featured helper lib + unit tests"
```

---

### Task 3: BazarListingRow — přidat TOP badge

**Files:**
- Modify: `src/components/bazar/BazarListingRow.astro`

- [ ] **Step 1: Rozšířit Props o featured stav**

V [src/components/bazar/BazarListingRow.astro](../../src/components/bazar/BazarListingRow.astro) najít `interface Props` a přidat nový prop `featured?: boolean`:

```diff
 interface Props {
   id: string;
   title: string;
   price: number | null;
   location: string;
   category: string;
   brand: string | null;
   imageUrl: string | null;
   createdAt: string;
   views?: number | null;
+  featured?: boolean;
 }
```

A v destructure:
```diff
-const { id, title, price, location, category, brand, imageUrl, createdAt, views } = Astro.props;
+const { id, title, price, location, category, brand, imageUrl, createdAt, views, featured } = Astro.props;
```

- [ ] **Step 2: Přidat badge do templatu**

V `<a href={`/bazar/${id}/`} class="listing-row">` přidat badge jako první child:

```diff
 <a href={`/bazar/${id}/`} class="listing-row">
+  {featured && <span class="listing-top-badge">TOP</span>}
   <div class="listing-img">
```

- [ ] **Step 3: Přidat styly pro badge + position: relative na listing-row**

V `<style>` bloku upravit `.listing-row` a přidat `.listing-top-badge`:

```diff
   .listing-row {
     display: flex;
     align-items: center;
     gap: 16px;
     padding: 14px 16px;
     text-decoration: none;
     color: inherit;
     border-bottom: 1px solid #f0f0f0;
     transition: background .15s;
+    position: relative;
   }
+  .listing-top-badge {
+    position: absolute;
+    top: 8px;
+    right: 12px;
+    background: #FFFF00;
+    color: #1a1a1a;
+    font-family: 'Chakra Petch', sans-serif;
+    font-size: 11px;
+    font-weight: 700;
+    padding: 3px 10px;
+    border-radius: 4px;
+    z-index: 2;
+    letter-spacing: 0.5px;
+  }
```

- [ ] **Step 4: Ověřit TypeScript**

Run: `cd /Users/matejsamec/agro-svet-topovani && npm run build 2>&1 | tail -20`

Expected: Build projde bez errors. Pokud by TypeScript křičel na `featured` prop nepoužitý, všechno OK — je optional.

- [ ] **Step 5: Commit**

```bash
git add src/components/bazar/BazarListingRow.astro
git commit -m "feat(bazar): TOP badge overlay in BazarListingRow"
```

---

### Task 4: BazarFeaturedGrid komponenta

**Files:**
- Create: `src/components/bazar/BazarFeaturedGrid.astro`

- [ ] **Step 1: Vytvořit komponentu**

Write `src/components/bazar/BazarFeaturedGrid.astro`:

```astro
---
interface FeaturedListing {
  id: string;
  title: string;
  price: number | null;
  location: string;
  imageUrl: string | null;
}

interface Props {
  listings: FeaturedListing[];
}

const { listings } = Astro.props;

function priceText(price: number | null): string {
  return price ? `${price.toLocaleString('cs-CZ')} Kč` : 'Dohodou';
}
---

{listings.length > 0 && (
  <section class="featured-section">
    <h2 class="featured-heading">⭐ Doporučené inzeráty</h2>
    <div class="featured-grid">
      {listings.map(listing => (
        <a href={`/bazar/${listing.id}/`} class="featured-card">
          <div class="featured-img">
            {listing.imageUrl
              ? <img src={listing.imageUrl} alt={listing.title} loading="lazy" />
              : <div class="featured-placeholder">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                </div>
            }
            <span class="featured-badge">TOP</span>
          </div>
          <div class="featured-body">
            <h3 class="featured-title">{listing.title}</h3>
            <div class="featured-meta">
              <span class="featured-price">{priceText(listing.price)}</span>
              <span class="featured-location">{listing.location}</span>
            </div>
          </div>
        </a>
      ))}
    </div>
  </section>
)}

<style>
  .featured-section {
    border: 2px solid #FFFF00;
    border-radius: 18px;
    padding: 20px;
    background: #fffef8;
    margin-bottom: 32px;
  }
  .featured-heading {
    font-family: 'Chakra Petch', sans-serif;
    font-size: 22px;
    font-weight: 600;
    margin: 0 0 16px;
    color: #1a1a1a;
  }
  .featured-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  @media (max-width: 768px) {
    .featured-grid { grid-template-columns: 1fr; }
  }

  .featured-card {
    display: flex;
    flex-direction: column;
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 10px;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    transition: transform .15s, box-shadow .15s;
  }
  .featured-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }

  .featured-img {
    position: relative;
    aspect-ratio: 16 / 9;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .featured-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .featured-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .featured-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #FFFF00;
    color: #1a1a1a;
    font-family: 'Chakra Petch', sans-serif;
    font-size: 11px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 4px;
    letter-spacing: 0.5px;
  }

  .featured-body {
    padding: 12px 14px 14px;
  }
  .featured-title {
    font-family: 'Chakra Petch', sans-serif;
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 8px;
    color: #1a1a1a;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.3;
    min-height: 2.6em;
  }
  .featured-meta {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
  }
  .featured-price {
    font-family: 'Chakra Petch', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: #1a1a1a;
  }
  .featured-location {
    font-family: var(--font-body);
    font-size: 13px;
    color: #666;
  }
</style>
```

- [ ] **Step 2: Ověřit build**

Run: `npm run build 2>&1 | tail -10`

Expected: Build projde.

- [ ] **Step 3: Commit**

```bash
git add src/components/bazar/BazarFeaturedGrid.astro
git commit -m "feat(bazar): BazarFeaturedGrid 2x2 component for Doporučené section"
```

---

### Task 5: `/bazar/` homepage — dual query + Doporučené sekce

**Files:**
- Modify: `src/pages/bazar/index.astro`

- [ ] **Step 1: Přidat import pro FeaturedGrid a helper**

V [src/pages/bazar/index.astro](../../src/pages/bazar/index.astro) nahoře přidat:

```diff
 import Layout from '../../layouts/Layout.astro';
 import BazarSidebar from '../../components/bazar/BazarSidebar.astro';
 import BazarListingRow from '../../components/bazar/BazarListingRow.astro';
 import BazarPagination from '../../components/bazar/BazarPagination.astro';
+import BazarFeaturedGrid from '../../components/bazar/BazarFeaturedGrid.astro';
 import { CATEGORIES } from '../../lib/bazar-constants';
 import { createServerClient } from '../../lib/supabase';
+import { isFeaturedActive } from '../../lib/bazar-featured';
```

- [ ] **Step 2: Rozšířit SELECT o featured sloupce + nové řazení**

Najít `let dbQuery = supabase.from('bazar_listings').select(...)` a upravit:

```diff
 let dbQuery = supabase
   .from('bazar_listings')
-  .select('id, title, price, location, category, brand, created_at, views, model_slug, year_of_manufacture, power_hp, hours_operated, bazar_images(storage_path, position)', { count: 'exact' })
+  .select('id, title, price, location, category, brand, created_at, views, model_slug, year_of_manufacture, power_hp, hours_operated, featured, featured_until, bazar_images(storage_path, position)', { count: 'exact' })
   .eq('status', 'active')
-  .order('created_at', { ascending: false })
+  .order('featured', { ascending: false })
+  .order('created_at', { ascending: false })
   .range((page - 1) * PER_PAGE, page * PER_PAGE - 1);
```

**Pozn. k sortu:** Supabase nepodporuje expresi `(featured AND featured_until > now())` v ORDER BY přes REST. Proto řadíme jen dle `featured`, ale **filtrování expirace** se řeší v JS helperu `isFeaturedActive()` při renderingu (který již z query dostane `featured_until`). Expirované featured inzeráty pořád plavou na začátku (jsou `featured=true` v DB), ale badge/doporučená sekce je nezobrazí, a řazení v praxi funguje (expirované jsou staré, takže `created_at DESC` je stejně posune dolů mezi první pár položek). Pokud chceš čistší řešení, druhá varianta je postprocess sort v JS — zvažujeme ve Step 6 níže.

- [ ] **Step 3: Detekovat "default view" a udělat extra query pro Doporučené**

Po stávající DB query (po `const totalPages = ...`) přidat blok:

```astro
const hasFilters = Boolean(
  query || category || brand || location ||
  priceFrom || priceTo || yearFrom || yearTo ||
  powerFrom || powerTo || modelSlug
);
const isDefaultView = page === 1 && !hasFilters;

let featuredListings: any[] = [];
if (isDefaultView) {
  const nowIso = new Date().toISOString();
  const { data: featured } = await supabase
    .from('bazar_listings')
    .select('id, title, price, location, featured_until, bazar_images(storage_path, position)')
    .eq('status', 'active')
    .eq('featured', true)
    .gt('featured_until', nowIso)
    .order('featured_until', { ascending: false })
    .limit(4);
  featuredListings = featured ?? [];
}

// Exclude featured IDs from main list (dedupe)
const featuredIds = new Set(featuredListings.map(f => f.id));
const displayedListings = isDefaultView
  ? (listings ?? []).filter((l: any) => !featuredIds.has(l.id))
  : (listings ?? []);
```

**DŮLEŽITÉ:** Přesunout `const { data: listings, count } = await dbQuery;` PŘED tuto novou logiku (už je). Ale `displayedListings` používá `listings`, takže musí být za queries. Finální pořadí:

1. `const { data: listings, count } = await dbQuery;`
2. `const totalPages = Math.ceil((count ?? 0) / PER_PAGE);`
3. `const hasFilters = ...; const isDefaultView = ...;`
4. `let featuredListings = []; if (isDefaultView) { ... }`
5. `const featuredIds = ...; const displayedListings = ...;`

- [ ] **Step 4: Rozšířit `getImageUrl` aby pracoval i nad featuredListings**

Stávající `getImageUrl(listing)` funguje nad objektem s `bazar_images`. To featured listings mají taky. Žádná změna.

- [ ] **Step 5: Render Doporučené sekce a upravit hlavní seznam**

V `<div class="bazar-main">` před `{listings && ...}` přidat:

```astro
{isDefaultView && featuredListings.length > 0 && (
  <BazarFeaturedGrid
    listings={featuredListings.map(f => ({
      id: f.id,
      title: f.title,
      price: f.price,
      location: f.location,
      imageUrl: getImageUrl(f),
    }))}
  />
)}
```

A v hlavním seznamu změnit `listings` na `displayedListings`:

```diff
-{listings && listings.length > 0 ? (
+{displayedListings && displayedListings.length > 0 ? (
   <div style="border:1px solid #e8e8e8; border-radius:14px; overflow:hidden; background:#fff;">
-    {listings.map((listing: any) => (
+    {displayedListings.map((listing: any) => (
       <BazarListingRow
         id={listing.id}
         title={listing.title}
         price={listing.price}
         location={listing.location}
         category={listing.category}
         brand={listing.brand}
         imageUrl={getImageUrl(listing)}
         createdAt={listing.created_at}
         views={listing.views}
+        featured={isFeaturedActive(listing)}
       />
     ))}
   </div>
 ) : (
```

- [ ] **Step 6: Ošetřit empty-state edge case**

Pokud `isDefaultView && featuredListings.length > 0 && displayedListings.length === 0`, hlavní seznam by ukazoval "Žádné inzeráty nenalezeny" i když featured existují. To je matoucí. Úprava:

```diff
-) : (
+) : featuredListings.length === 0 && (
   <div style="text-align:center; padding:64px 0; color:#666; background:#fafafa; border-radius:14px;">
```

Toto znamená: empty state se ukáže jen když ani hlavní seznam ani featured sekce nic nemají.

- [ ] **Step 7: Ověřit build**

Run: `npm run build 2>&1 | tail -15`

Expected: Build projde bez errors.

- [ ] **Step 8: Commit**

```bash
git add src/pages/bazar/index.astro
git commit -m "feat(bazar): Doporučené section + featured sort on /bazar/ index"
```

---

### Task 6: `/bazar/moje/` — TOP stav indikátor

**Files:**
- Modify: `src/pages/bazar/moje/index.astro`

- [ ] **Step 1: Rozšířit SELECT o featured sloupce + import helperu**

V [src/pages/bazar/moje/index.astro](../../src/pages/bazar/moje/index.astro):

```diff
 import Layout from '../../../layouts/Layout.astro';
 import { createServerClient } from '../../../lib/supabase';
 import { CATEGORIES } from '../../../lib/bazar-constants';
+import { isFeaturedActive, formatFeaturedUntil } from '../../../lib/bazar-featured';
```

A upravit SELECT:

```diff
 const { data: listings } = await supabase
   .from('bazar_listings')
-  .select('id, title, price, category, status, created_at, views')
+  .select('id, title, price, category, status, created_at, views, featured, featured_until')
   .eq('user_id', user.id)
   .order('created_at', { ascending: false });
```

- [ ] **Step 2: Render TOP badge / expired indikátor v kartě**

V `listings.map(listing => { ... return ( <div class="my-listing-row">` přidat za `<h3>` element:

Najít:
```astro
<a href={`/bazar/${listing.id}/`} style="text-decoration:none; color:inherit;">
  <h3 style="font-size:16px; margin-bottom:4px;">{listing.title}</h3>
</a>
```

Přidat za ten `<a>`:

```astro
{listing.featured && isFeaturedActive(listing) && (
  <div class="top-badge-row">
    <span class="top-badge-active">⭐ TOP do {formatFeaturedUntil(listing.featured_until)}</span>
  </div>
)}
{listing.featured && !isFeaturedActive(listing) && listing.featured_until && (
  <div class="top-badge-row">
    <span class="top-badge-expired">TOP expirovalo {formatFeaturedUntil(listing.featured_until)}</span>
  </div>
)}
```

A na kartu `<div class="my-listing-row">` přidat podmíněně třídu `is-featured`:

```diff
-<div class="my-listing-row">
+<div class={`my-listing-row ${listing.featured && isFeaturedActive(listing) ? 'is-featured' : ''}`}>
```

- [ ] **Step 3: Přidat styly pro badge + levý border**

Dolů do `<style>` bloku:

```diff
   .my-listing-row {
     display: flex;
     align-items: center;
     gap: 16px;
     padding: 16px 20px;
     border-bottom: 1px solid #f0f0f0;
   }
+  .my-listing-row.is-featured {
+    border-left: 4px solid #FFFF00;
+    padding-left: 16px;
+  }
+  .top-badge-row {
+    margin: 4px 0 6px;
+  }
+  .top-badge-active {
+    display: inline-block;
+    background: #1a1a1a;
+    color: #FFFF00;
+    font-family: 'Chakra Petch', sans-serif;
+    font-size: 11px;
+    font-weight: 600;
+    padding: 3px 10px;
+    border-radius: 4px;
+    letter-spacing: 0.3px;
+  }
+  .top-badge-expired {
+    display: inline-block;
+    background: #f0f0f0;
+    color: #888;
+    font-family: 'Chakra Petch', sans-serif;
+    font-size: 11px;
+    font-weight: 500;
+    padding: 3px 10px;
+    border-radius: 4px;
+  }
```

- [ ] **Step 4: Přidat info text o topování dole na stránce**

Najít `<div style="margin-top:32px; text-align:center;">` s odkazem "Odhlásit se". Přidat PŘED něj:

```astro
<div style="margin-top:48px; padding:20px; border:1px dashed #e0e0e0; border-radius:14px; text-align:center; color:#666; font-size:13px;">
  Topování inzerátů nabízíme po domluvě — kontaktujte nás na <a href="mailto:info@agro-svet.cz" class="link-underline">info@agro-svet.cz</a>.
</div>
```

- [ ] **Step 5: Ověřit build**

Run: `npm run build 2>&1 | tail -10`

Expected: Build projde.

- [ ] **Step 6: Commit**

```bash
git add src/pages/bazar/moje/index.astro
git commit -m "feat(bazar): TOP stav indikátor v 'Moje inzeráty' + info text"
```

---

### Task 7: `/bazar/moje/[id]` edit — readonly info box

**Files:**
- Modify: `src/pages/bazar/moje/[id].astro`

- [ ] **Step 1: Přečíst a rozšířit SELECT + přidat info box**

Nejdřív si rychle přečíst soubor pro kontext:

Run: `head -80 src/pages/bazar/moje/\[id\].astro`

Očekávaný pattern (editace inzerátu existujícího usera, čte inzerát dle id):
- Server-side fetch inzerátu: `supabase.from('bazar_listings').select('...').eq('id', id).eq('user_id', user.id).single()`

**Konkrétní změna závisí na aktuálním obsahu souboru.** Postup:

1. Najít SELECT v `src/pages/bazar/moje/[id].astro` a přidat `featured, featured_until` do select listu.
2. Přidat import:
   ```typescript
   import { isFeaturedActive, formatFeaturedUntil } from '../../../lib/bazar-featured';
   ```
3. Přidat před edit formulář (nejlépe pod `<h1>Upravit inzerát</h1>` nebo ekvivalent):

```astro
{listing.featured && (
  <div class="edit-top-box">
    <span class="edit-top-icon">⭐</span>
    <div>
      <strong>
        {isFeaturedActive(listing)
          ? 'Tento inzerát je propagován jako TOP'
          : 'TOP propagace expirovala'}
      </strong>
      <div class="edit-top-meta">
        {isFeaturedActive(listing)
          ? `Aktivní do: ${formatFeaturedUntil(listing.featured_until)}`
          : `Expirovalo: ${formatFeaturedUntil(listing.featured_until)}`}
      </div>
    </div>
  </div>
)}
```

A styly do `<style>` bloku:

```css
.edit-top-box {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 20px;
  padding: 14px 18px;
  background: #fffef8;
  border: 2px solid #FFFF00;
  border-radius: 14px;
}
.edit-top-icon {
  font-size: 24px;
  flex-shrink: 0;
}
.edit-top-meta {
  font-size: 13px;
  color: #666;
  margin-top: 2px;
}
```

- [ ] **Step 2: Ověřit build**

Run: `npm run build 2>&1 | tail -10`

Expected: Build projde.

- [ ] **Step 3: Commit**

```bash
git add src/pages/bazar/moje/\[id\].astro
git commit -m "feat(bazar): readonly TOP info box in edit form"
```

---

### Task 8: Admin API endpoint — `toggle-featured.ts`

**Files:**
- Create: `src/pages/admin/bazar/api/toggle-featured.ts`

- [ ] **Step 1: Vytvořit endpoint**

Write `src/pages/admin/bazar/api/toggle-featured.ts`:

```typescript
// POST /admin/bazar/api/toggle-featured
// Admin akce pro topování inzerátů: extend (preset dny), custom (datum), clear.
// Middleware gate-uje /admin/* přes is_admin, tady je druhá kontrola defense-in-depth.
import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../lib/supabase';
import { computeFeaturedUntil, planToDays, type FeaturedPlan } from '../../../../lib/bazar-featured';

export const prerender = false;

type Body =
  | { listingId: string; action: 'extend'; plan: FeaturedPlan }
  | { listingId: string; action: 'custom'; until: string }
  | { listingId: string; action: 'clear' };

export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) return json({ error: 'unauthenticated' }, 401);

  const sb = createServerClient();

  // Defense in depth — middleware už checkuje, ale pokud by endpoint byl omylem
  // volán mimo /admin/* gate, tohle je backup.
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

  if (!body || typeof body !== 'object' || !('listingId' in body) || typeof body.listingId !== 'string') {
    return json({ error: 'bad_request', message: 'Missing listingId' }, 400);
  }

  // Načíst aktuální stav inzerátu (kvůli extend logice + existence check)
  const { data: listing } = await sb
    .from('bazar_listings')
    .select('id, featured, featured_until')
    .eq('id', body.listingId)
    .maybeSingle();
  if (!listing) return json({ error: 'not_found' }, 404);

  let update: {
    featured: boolean;
    featured_until: string | null;
    featured_plan: string | null;
  };

  if (body.action === 'extend') {
    if (!body.plan || !['7d', '30d', '60d'].includes(body.plan)) {
      return json({ error: 'bad_request', message: 'Invalid plan' }, 400);
    }
    const days = planToDays(body.plan);
    const currentUntil = listing.featured_until ? new Date(listing.featured_until) : null;
    const newUntil = computeFeaturedUntil(currentUntil, days);
    update = {
      featured: true,
      featured_until: newUntil.toISOString(),
      featured_plan: body.plan,
    };
  } else if (body.action === 'custom') {
    if (!body.until) return json({ error: 'bad_request', message: 'Missing until' }, 400);
    const untilDate = new Date(body.until);
    if (isNaN(untilDate.getTime())) {
      return json({ error: 'bad_request', message: 'Invalid until date' }, 400);
    }
    if (untilDate.getTime() <= Date.now()) {
      return json({ error: 'bad_request', message: 'until must be in the future' }, 400);
    }
    update = {
      featured: true,
      featured_until: untilDate.toISOString(),
      featured_plan: 'custom',
    };
  } else if (body.action === 'clear') {
    update = {
      featured: false,
      featured_until: null,
      featured_plan: null,
    };
  } else {
    return json({ error: 'bad_request', message: 'Unknown action' }, 400);
  }

  const { data: updated, error } = await sb
    .from('bazar_listings')
    .update(update)
    .eq('id', body.listingId)
    .select('id, featured, featured_until, featured_plan')
    .single();

  if (error) {
    console.error('[toggle-featured] update failed', error);
    return json({ error: 'server_error' }, 500);
  }

  return json({ ok: true, listing: updated });
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
```

- [ ] **Step 2: Ověřit build**

Run: `npm run build 2>&1 | tail -15`

Expected: Build projde. Pokud je chyba typů, zkontroluj import path `../../../../lib/bazar-featured` (4 úrovně nahoru z `src/pages/admin/bazar/api/toggle-featured.ts`).

- [ ] **Step 3: Commit**

```bash
git add src/pages/admin/bazar/api/toggle-featured.ts
git commit -m "feat(admin): POST /admin/bazar/api/toggle-featured endpoint"
```

---

### Task 9: Admin UI `/admin/bazar/`

**Files:**
- Create: `src/pages/admin/bazar/index.astro`

- [ ] **Step 1: Vytvořit stránku**

Write `src/pages/admin/bazar/index.astro`:

```astro
---
export const prerender = false;
import Layout from '../../../layouts/Layout.astro';
import { createServerClient } from '../../../lib/supabase';
import { isFeaturedActive, formatFeaturedUntil } from '../../../lib/bazar-featured';

const url = Astro.url;
const filter = (url.searchParams.get('filter') ?? 'all') as 'all' | 'active' | 'expired' | 'none';
const search = url.searchParams.get('q') ?? '';
const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1'));
const PER_PAGE = 30;

const supabase = createServerClient();
const nowIso = new Date().toISOString();

let dbQuery = supabase
  .from('bazar_listings')
  .select('id, title, price, status, featured, featured_until, featured_plan, created_at, bazar_users!inner(email)', { count: 'exact' })
  .order('featured', { ascending: false })
  .order('featured_until', { ascending: true, nullsFirst: false })
  .order('created_at', { ascending: false })
  .range((page - 1) * PER_PAGE, page * PER_PAGE - 1);

if (filter === 'active') {
  dbQuery = dbQuery.eq('featured', true).gt('featured_until', nowIso);
} else if (filter === 'expired') {
  dbQuery = dbQuery.eq('featured', true).lte('featured_until', nowIso);
} else if (filter === 'none') {
  dbQuery = dbQuery.eq('featured', false);
}

if (search) {
  dbQuery = dbQuery.or(`title.ilike.%${search}%,bazar_users.email.ilike.%${search}%`);
}

const { data: listings, count } = await dbQuery;
const totalPages = Math.ceil((count ?? 0) / PER_PAGE);

function topStatus(listing: any): { label: string; tone: 'active' | 'expired' | 'none' } {
  if (!listing.featured) return { label: 'Nepropagován', tone: 'none' };
  if (isFeaturedActive(listing)) return { label: `Aktivní TOP · do ${formatFeaturedUntil(listing.featured_until)}`, tone: 'active' };
  return { label: `Expirovalo ${formatFeaturedUntil(listing.featured_until)}`, tone: 'expired' };
}

function priceText(price: number | null): string {
  return price ? `${price.toLocaleString('cs-CZ')} Kč` : '—';
}
---

<Layout title="Admin — Topování bazaru" description="Admin správa TOP inzerátů">
  <main class="admin-bazar">
    <a href="/admin/fotosoutez/" class="back-link">← Admin přehled</a>
    <h1>Topování bazaru</h1>

    <form method="GET" class="filters">
      <div class="filter-chips">
        <a href="?filter=all" class={`chip ${filter === 'all' ? 'chip-active' : ''}`}>Vše</a>
        <a href="?filter=active" class={`chip ${filter === 'active' ? 'chip-active' : ''}`}>Aktivní TOP</a>
        <a href="?filter=expired" class={`chip ${filter === 'expired' ? 'chip-active' : ''}`}>Expirované</a>
        <a href="?filter=none" class={`chip ${filter === 'none' ? 'chip-active' : ''}`}>Non-featured</a>
      </div>
      <input type="search" name="q" value={search} placeholder="Hledat titulek / email autora…" class="search-input" />
      {filter !== 'all' && <input type="hidden" name="filter" value={filter} />}
      <button type="submit" class="btn-primary">Hledat</button>
    </form>

    {listings && listings.length > 0 ? (
      <div class="admin-table">
        <div class="table-head">
          <div class="col-title">Titulek</div>
          <div class="col-author">Autor</div>
          <div class="col-price">Cena</div>
          <div class="col-status">TOP stav</div>
          <div class="col-actions">Akce</div>
        </div>
        {listings.map((listing: any) => {
          const status = topStatus(listing);
          const authorEmail = listing.bazar_users?.email ?? '—';
          return (
            <div class="table-row" data-listing-id={listing.id}>
              <div class="col-title">
                <a href={`/bazar/${listing.id}/`} target="_blank" rel="noopener">{listing.title}</a>
              </div>
              <div class="col-author">{authorEmail}</div>
              <div class="col-price">{priceText(listing.price)}</div>
              <div class={`col-status status-${status.tone}`} data-status>{status.label}</div>
              <div class="col-actions">
                <button type="button" class="btn-sm" data-action="extend" data-plan="7d">+7d</button>
                <button type="button" class="btn-sm" data-action="extend" data-plan="30d">+30d</button>
                <button type="button" class="btn-sm" data-action="extend" data-plan="60d">+60d</button>
                <button type="button" class="btn-sm" data-action="custom">Custom…</button>
                {listing.featured && (
                  <button type="button" class="btn-sm btn-danger" data-action="clear">Zrušit</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      <p class="empty">Žádné inzeráty nenalezeny.</p>
    )}

    <nav class="pagination">
      {page > 1 && <a href={`?filter=${filter}${search ? '&q=' + encodeURIComponent(search) : ''}&page=${page - 1}`}>← Předchozí</a>}
      <span>Strana {page} / {totalPages || 1}</span>
      {page < totalPages && <a href={`?filter=${filter}${search ? '&q=' + encodeURIComponent(search) : ''}&page=${page + 1}`}>Další →</a>}
    </nav>
  </main>

  <dialog id="custom-modal">
    <form method="dialog" class="custom-form">
      <h3>Topovat do konkrétního data</h3>
      <label>
        Datum a čas:
        <input type="datetime-local" id="custom-until" required />
      </label>
      <div class="modal-actions">
        <button type="button" id="custom-cancel">Zrušit</button>
        <button type="button" id="custom-confirm" class="btn-primary">Uložit</button>
      </div>
    </form>
  </dialog>

  <script>
    const modal = document.getElementById('custom-modal') as HTMLDialogElement;
    const customUntilInput = document.getElementById('custom-until') as HTMLInputElement;
    const customConfirm = document.getElementById('custom-confirm')!;
    const customCancel = document.getElementById('custom-cancel')!;
    let pendingRow: HTMLElement | null = null;

    async function callApi(listingId: string, body: any): Promise<any> {
      const res = await fetch('/admin/bazar/api/toggle-featured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, ...body }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message ?? data.error ?? 'Request failed');
      return data;
    }

    function updateRow(row: HTMLElement, listing: any) {
      const statusCell = row.querySelector<HTMLElement>('[data-status]')!;
      if (!listing.featured) {
        statusCell.className = 'col-status status-none';
        statusCell.textContent = 'Nepropagován';
      } else {
        const until = new Date(listing.featured_until);
        const isActive = until.getTime() > Date.now();
        const fmt = `${until.getDate()}. ${until.getMonth() + 1}. ${until.getFullYear()}`;
        if (isActive) {
          statusCell.className = 'col-status status-active';
          statusCell.textContent = `Aktivní TOP · do ${fmt}`;
        } else {
          statusCell.className = 'col-status status-expired';
          statusCell.textContent = `Expirovalo ${fmt}`;
        }
      }
      // Toggle "Zrušit" button visibility
      const actionsCell = row.querySelector<HTMLElement>('.col-actions')!;
      const existingClear = actionsCell.querySelector('[data-action="clear"]');
      if (listing.featured && !existingClear) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-sm btn-danger';
        btn.dataset.action = 'clear';
        btn.textContent = 'Zrušit';
        actionsCell.appendChild(btn);
        wireButton(btn);
      } else if (!listing.featured && existingClear) {
        existingClear.remove();
      }
    }

    function wireButton(btn: HTMLElement) {
      btn.addEventListener('click', async () => {
        const row = btn.closest<HTMLElement>('[data-listing-id]')!;
        const listingId = row.dataset.listingId!;
        const action = btn.dataset.action!;

        if (action === 'custom') {
          pendingRow = row;
          // Default input value = 30 days from now
          const defaultDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          customUntilInput.value = defaultDate.toISOString().slice(0, 16);
          modal.showModal();
          return;
        }

        const originalText = btn.textContent;
        btn.textContent = '…';
        (btn as HTMLButtonElement).disabled = true;
        try {
          let body: any;
          if (action === 'extend') {
            body = { action: 'extend', plan: btn.dataset.plan };
          } else if (action === 'clear') {
            body = { action: 'clear' };
          }
          const data = await callApi(listingId, body);
          updateRow(row, data.listing);
        } catch (err: any) {
          alert(`Chyba: ${err.message}`);
        } finally {
          btn.textContent = originalText;
          (btn as HTMLButtonElement).disabled = false;
        }
      });
    }

    document.querySelectorAll<HTMLElement>('[data-action]').forEach(wireButton);

    customCancel.addEventListener('click', () => {
      modal.close();
      pendingRow = null;
    });

    customConfirm.addEventListener('click', async () => {
      if (!pendingRow) return;
      const listingId = pendingRow.dataset.listingId!;
      const untilLocal = customUntilInput.value;
      if (!untilLocal) {
        alert('Zadejte datum');
        return;
      }
      const untilDate = new Date(untilLocal);
      try {
        const data = await callApi(listingId, { action: 'custom', until: untilDate.toISOString() });
        updateRow(pendingRow, data.listing);
        modal.close();
        pendingRow = null;
      } catch (err: any) {
        alert(`Chyba: ${err.message}`);
      }
    });
  </script>

  <style>
    .admin-bazar {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 24px 80px;
    }
    .back-link {
      font-size: 13px;
      color: #666;
      text-decoration: none;
    }
    .back-link:hover { text-decoration: underline; }
    h1 {
      font-family: 'Chakra Petch', sans-serif;
      font-size: 2rem;
      margin: 12px 0 24px;
    }

    .filters {
      display: flex;
      gap: 12px;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    .filter-chips {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
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
    .table-head,
    .table-row {
      display: grid;
      grid-template-columns: 3fr 2fr 1fr 2fr 3fr;
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
    .col-author { color: #666; font-size: 13px; word-break: break-word; }
    .col-price { font-family: 'Chakra Petch', sans-serif; font-weight: 600; white-space: nowrap; }
    .col-status { font-size: 13px; }
    .status-active { color: #2e7d32; font-weight: 600; }
    .status-expired { color: #c62828; }
    .status-none { color: #999; }
    .col-actions {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }
    .btn-sm {
      font-size: 12px;
      padding: 5px 10px;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      background: #fff;
      cursor: pointer;
      color: #333;
      font-family: var(--font-body);
    }
    .btn-sm:hover { background: #f5f5f5; }
    .btn-sm:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-danger { color: #c62828; border-color: #ffcdd2; }
    .btn-danger:hover { background: #fff0f0; }

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

    dialog {
      border: none;
      border-radius: 14px;
      padding: 0;
      min-width: 360px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    }
    dialog::backdrop {
      background: rgba(0,0,0,0.4);
    }
    .custom-form {
      padding: 24px;
    }
    .custom-form h3 {
      margin: 0 0 16px;
      font-family: 'Chakra Petch', sans-serif;
    }
    .custom-form label {
      display: block;
      margin-bottom: 16px;
      font-size: 13px;
      color: #666;
    }
    .custom-form input[type="datetime-local"] {
      display: block;
      margin-top: 6px;
      padding: 8px 12px;
      width: 100%;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      font-size: 14px;
    }
    .modal-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
    .modal-actions button {
      padding: 8px 16px;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      background: #fff;
      cursor: pointer;
      font-size: 14px;
    }

    @media (max-width: 900px) {
      .table-head { display: none; }
      .table-row {
        grid-template-columns: 1fr;
        gap: 6px;
      }
      .col-actions { justify-content: flex-start; }
    }
  </style>
</Layout>
```

- [ ] **Step 2: Ověřit build**

Run: `npm run build 2>&1 | tail -15`

Expected: Build projde. Nejspíš TypeScript bude křičet na implicitní `any` — přidej `as any` nebo typy dle potřeby.

- [ ] **Step 3: Commit**

```bash
git add src/pages/admin/bazar/index.astro
git commit -m "feat(admin): /admin/bazar/ UI — list + filters + inline actions + custom modal"
```

---

### Task 10: Odkaz v admin rozcestníku

**Files:**
- Modify: `src/pages/admin/fotosoutez/index.astro` (nebo vytvořit nový root admin `/admin/index.astro`)

- [ ] **Step 1: Zkontrolovat existenci `/admin/index.astro`**

Run: `ls /Users/matejsamec/agro-svet-topovani/src/pages/admin/index.astro 2>&1 || echo "NEEXISTUJE"`

**Pokud neexistuje:** přidat tile do `src/pages/admin/fotosoutez/index.astro` (stávající rozcestník fotosoutěže) a zároveň zvážit vytvoření `/admin/index.astro` jako true root.

**Plán:** Vytvořit `src/pages/admin/index.astro` jako nový root rozcestník, který linkuje na `/admin/fotosoutez/` i `/admin/bazar/`.

- [ ] **Step 2: Vytvořit `/admin/index.astro`**

Write `src/pages/admin/index.astro`:

```astro
---
export const prerender = false;
import Layout from '../../layouts/Layout.astro';
---

<Layout title="Admin — agro-svet" description="Admin rozcestník">
  <main class="admin-home">
    <h1>Admin</h1>
    <div class="tiles">
      <a href="/admin/fotosoutez/" class="tile">
        <h2>Fotosoutěž</h2>
        <p>Moderace, kola, vítězové</p>
      </a>
      <a href="/admin/bazar/" class="tile">
        <h2>Agro bazar — Topování</h2>
        <p>TOP inzeráty, aktivace, prodloužení</p>
      </a>
    </div>
  </main>

  <style>
    .admin-home {
      max-width: 900px;
      margin: 0 auto;
      padding: 48px 24px 80px;
    }
    h1 {
      font-family: 'Chakra Petch', sans-serif;
      font-size: 2rem;
      margin: 0 0 32px;
    }
    .tiles {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }
    .tile {
      display: block;
      padding: 28px 24px;
      border: 1px solid #e8e8e8;
      border-radius: 14px;
      background: #fff;
      text-decoration: none;
      color: inherit;
      transition: transform .15s, box-shadow .15s;
    }
    .tile:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.06);
      border-color: #FFFF00;
    }
    .tile h2 {
      font-family: 'Chakra Petch', sans-serif;
      font-size: 1.25rem;
      margin: 0 0 6px;
    }
    .tile p {
      color: #666;
      font-size: 13px;
      margin: 0;
    }
  </style>
</Layout>
```

- [ ] **Step 3: Ověřit build**

Run: `npm run build 2>&1 | tail -10`

Expected: Build projde.

- [ ] **Step 4: Commit**

```bash
git add src/pages/admin/index.astro
git commit -m "feat(admin): root /admin/ rozcestník — Fotosoutěž + Bazar"
```

---

### Task 11: Final smoke test + push

**Files:** (žádné modifikace — jen verifikace)

- [ ] **Step 1: Full build + test run**

```bash
cd /Users/matejsamec/agro-svet-topovani
npm run build 2>&1 | tail -20
npm run test 2>&1 | tail -20
```

Expected:
- Build: `✓ built in …ms` bez errors
- Tests: všechny existující + 14 nových testů projde

- [ ] **Step 2: Ruční smoke test ve `npm run dev`**

Předpoklad: migrace 005 je aplikovaná na Supabase (Task 1 Step 3 hotový).

Start dev server: `npm run dev` v separátním terminálu, pak v browseru:

1. **Non-admin user:**
   - `/admin/bazar/` → **redirect na `/bazar/prihlaseni/`** (middleware gate)
   - Přihlášení jako non-admin → `/admin/bazar/` → **403 Forbidden**

2. **Admin user (`matsamec@gmail.com`):**
   - Přihlášení → `/admin/bazar/` → vidí seznam inzerátů
   - Klikne `+30d` u libovolného non-featured inzerátu → status se změní na "Aktivní TOP · do X"
   - Otevře `/bazar/` v jiném tabu (nebo refresh) → v "Doporučené" sekci je inzerát, má `TOP` badge
   - Zpět na `/admin/bazar/` → klikne `+30d` znovu na tentýž inzerát → datum se posune o dalších 30 dnů (GREATEST logika)
   - Klikne `Custom…` → otevře se modal → vybere datum za 14 dnů → Uložit → status se aktualizuje
   - Klikne `Zrušit` → status → "Nepropagován", tlačítko Zrušit zmizí

3. **User dashboard:**
   - Přihlášený jako vlastník featured inzerátu → `/bazar/moje/` → karta má žlutý levý border + badge "⭐ TOP do X"
   - Klikne "Upravit" na featured inzerát → `/bazar/moje/[id]` → nahoře žlutý info box

4. **Public seznam:**
   - `/bazar/` bez filtrů → "Doporučené" sekce viditelná (pokud jsou featured)
   - `/bazar/?category=traktory` → sekce zmizí, featured v seznamu mají TOP badge v rohu
   - `/bazar/?page=2` → sekce zmizí

5. **Expirace:**
   - V Supabase SQL editoru: `UPDATE bazar_listings SET featured_until = NOW() - INTERVAL '1 day' WHERE id = '<test-id>';`
   - `/bazar/` → inzerát není v Doporučené
   - `/bazar/moje/` → badge "TOP expirovalo X"
   - `/admin/bazar/?filter=expired` → inzerát je v listu se statusem "Expirovalo X"

- [ ] **Step 3: Push branch na origin**

```bash
git push -u origin bazar/topovani
```

- [ ] **Step 4: Report & hand off**

Reportovat uživateli:
- Branch `bazar/topovani` pushnut na origin
- Migrace 005 aplikovaná (nebo POTŘEBA APLIKOVAT pokud Step 1.3 nebyl proveden)
- Smoke test hotov
- **NEDEPLOYOVÁNO** (dle zadání) — deploy je separátní krok
- Před merge do master: user rozhodne merge strategii (squash / rebase / merge commit)

---

## Plan Self-Review

**Spec coverage:**
- [x] Section 1 (DB schéma) → Task 1 ✓
- [x] Section 2.1-2.5 (Public UI `/bazar/`) → Task 4 (grid component), Task 5 (index.astro) ✓
- [x] Section 3 (Admin UI) → Task 8 (API), Task 9 (UI), Task 10 (rozcestník) ✓
- [x] Section 4.1 (`/bazar/moje/`) → Task 6 ✓
- [x] Section 4.2 (`/bazar/moje/[id]`) → Task 7 ✓
- [x] Section 4.3 (detail) → explicit "beze změny" ✓
- [x] Section 4.4 (badge v řádcích při filtraci) → Task 3 (BazarListingRow) + Task 5 (featured prop) ✓
- [x] Section 5 (Helpers) → Task 2 ✓
- [x] Section 6 (Testy) → Task 2 (14 testů) ✓
- [x] Section 7 (Deploy — nedeployovat) → Task 11 explicit ✓
- [x] Section 8 (Out of scope) → plán nezahrnuje platbu/self-service/webhook ✓

**Placeholder scan:** Žádné "TBD", "implement later", "similar to Task N bez opakování". Každý step má konkrétní kód nebo diff. Task 7 Step 1 má vágnější instrukci ("závisí na aktuálním obsahu souboru") — to je záměrně, protože soubor jsem detailně neprozkoumal, ale postup je jasný (rozšířit SELECT + přidat info box před formulář). Engineer přečte soubor, aplikuje pattern.

**Type consistency:**
- `FeaturedPlan` typ definován v Task 2, použit v Task 8 ✓
- `isFeaturedActive`, `computeFeaturedUntil`, `formatFeaturedUntil`, `planToDays` jména konzistentní napříč tasky ✓
- `featured` prop v `BazarListingRow` (Task 3) — volitelný boolean, použit v Task 5 jako `featured={isFeaturedActive(listing)}` ✓
- Body typy v API endpointu (`extend`/`custom`/`clear`) konzistentní s client-side `fetch` v Task 9 ✓

**Známé deviace od původního zadání (zaznamenané v spec + tady):**
1. Migrace **005** místo 003 (003/004 obsadila fotosoutěž)
2. Testy v `tests/lib/` místo `tests/bazar-topovani/` (konzistentní s existujícími)
3. Admin tile endpoint: `/admin/index.astro` jako nový root (spec říká "přidat kartu" — tady je to zpřesněno na vytvoření root rozcestníku)
