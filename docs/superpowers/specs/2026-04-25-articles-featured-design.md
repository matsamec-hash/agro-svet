# Články — Featured na HP — Design Spec

## Overview

Admin-řízený "rising tide" pattern pro označení článků jako **featured** — bubbliují k vrcholu hero gridu na HP. Žádné badges, žádná expirace, žádné max-1 omezení. Layout sám se organizuje dle `ORDER BY featured DESC, published_at DESC`.

**Stack:** Astro 6 SSR + sdílený Supabase projekt `obhypfuzmknvmknskdwh` (`articles` tabulka).

**Branch:** `bazar/topovani` worktree (`/Users/matejsamec/agro-svet-topovani/`) — pokračuje na stejné branchi protože topování je série feature kterou user explicitně řetězí.

**Cíl fáze:** Pinned hero pattern pro články, samostatný admin UI `/admin/clanky/`. Featured neovlivňuje `/novinky/` listing (out of scope teď).

**Návaznost:** Tato fáze následuje [`2026-04-24-bazar-topovani-design.md`](2026-04-24-bazar-topovani-design.md). Sdílí pattern (admin-only, defense-in-depth API guard, /admin/ rozcestník), ale **nesdílí kód ani DB sloupce** — articles a bazar_listings jsou nezávislé domény.

---

## 1. Datový model

### Migrace `supabase/migrations/007_articles_featured.sql`

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

### Sémantika

| Stav            | `featured` | HP pozice                                                    |
| --------------- | ---------- | ------------------------------------------------------------ |
| Featured        | true       | Bubbluje k vrcholu (mezi sebou: `published_at DESC`)         |
| Non-featured    | false      | Stávající chronologie (`published_at DESC`)                  |

**Žádné `featured_until`** — articles featured je editorial flag, persistent dokud admin nezruší.

**Žádné `featured_plan`** — articles nemají placené topování (fáze platby = bazar only).

**Cross-site izolace:** Sloupec `featured` je per-row na sdílené tabulce. Filtr `site_id = '<agro-svet>'` v queries i admin UI zajistí, že agro-svet feature flag neovlivní zenazije ani content-network.

---

## 2. HP integrace (`src/pages/index.astro`)

### 2.1 Aktuální query (před změnou)

```ts
const { data: articles } = await supabase
  .from('articles')
  .select('id, title, slug, perex, featured_image_url, category, tags, published_at')
  .eq('site_id', SITE_ID)
  .eq('status', 'published')
  .order('published_at', { ascending: false })
  .limit(5);
```

### 2.2 Nová query

```ts
const { data: articles } = await supabase
  .from('articles')
  .select('id, title, slug, perex, featured_image_url, category, tags, published_at, featured')
  .eq('site_id', SITE_ID)
  .eq('status', 'published')
  .order('featured', { ascending: false })  // featured DESC first
  .order('published_at', { ascending: false })  // then chronological
  .limit(5);
```

### 2.3 Renderování

`sorted[0]` jako hero, `sorted.slice(1, 5)` jako 4 small cards. **Beze změny** — sort logika upstream už dodá správné pořadí.

### 2.4 Důsledky pro layout

| # featured | Hero (sorted[0])                  | Small cards (sorted[1..4])           |
| ---------- | --------------------------------- | ------------------------------------ |
| 0          | Nejnovější článek                 | 4 následující chronologicky          |
| 1          | Featured článek                   | 4 nejnovější non-featured            |
| 2          | Featured s novějším published_at  | Druhý featured + 3 non-featured chrono |
| 5+         | Nejnovější featured               | 4 následující featured chronologicky |

**Edge case "0 featured":** Identické s aktuálním chováním HP — žádná regrese pro stav před aplikací migrace.

---

## 3. Admin UI `/admin/clanky/`

### 3.1 Guard

Stávající middleware (`src/middleware.ts`) gate-uje `/admin/*` přes `is_admin`. Nezalogovaný / non-admin → 403 nebo redirect.

### 3.2 Layout

```
┌──────────────────────────────────────────────────────────┐
│ ← Admin přehled                                           │
│ Články — featured na HP                                   │
│                                                           │
│ Filter: [Vše ▼] [Jen featured] [Jen non-featured]        │
│ Hledat: [______________] (titulek)                       │
├──────────────────────────────────────────────────────────┤
│ Titulek                  │ Kategorie │ Datum     │ Featured
├──────────────────────────────────────────────────────────┤
│ Zetor Proxima nová...    │ Technika  │ 12.4.2026 │ [✓] ON
│ Dotace 2026 přehled      │ Dotace    │ 8.4.2026  │ [ ] OFF
│ EU CAP reform            │ Legislat. │ 1.4.2026  │ [✓] ON
│ ...                                                       │
└──────────────────────────────────────────────────────────┘
                         Pagination
```

**Default sort:** `featured DESC, published_at DESC` — featured nahoře pro rychlou orientaci.

**Stránkování:** 30 položek/stránka.

**Filter:**
- `Vše` (default) | `Jen featured` (`featured = true`) | `Jen non-featured` (`featured = false`)
- Search input: `title.ilike.%<sanitized>%` (sanitize stejně jako v bazar admin — strip `,()*`)

**Cross-site izolace:** Admin UI **vždy** filtruje `.eq('site_id', '<agro-svet-uuid>')`. Sloupec `featured` na článku patřícím jinému webu se nikdy nezobrazí ani neupraví.

### 3.3 Akce — POST endpoint

**`src/pages/api/admin/clanky/toggle-featured.ts`** (POST)

```typescript
type Body = { articleId: string; featured: boolean };

// 1. locals.user (middleware)
// 2. SELECT is_admin FROM bazar_users WHERE id = user.id (defense-in-depth)
// 3. UPDATE articles SET featured = $featured WHERE id = $articleId AND site_id = $agro_svet
// 4. Vrátí { ok: true, article: { id, featured } }
```

**Status kódy:** 401 (unauthenticated), 403 (not admin), 404 (article not found OR wrong site), 400 (bad request), 500 (server error).

**Site filter v UPDATE:** `eq('site_id', AGRO_SVET_SITE_ID)` zajistí, že admin nemůže omylem (např. díky URL manipulaci) změnit featured u článku z jiného webu.

### 3.4 Client-side

Inline checkbox toggle (žádný full page refresh):
1. Click → disable checkbox + ukázat spinner
2. `fetch('/api/admin/clanky/toggle-featured', { method: 'POST', body: JSON.stringify(...) })`
3. On success → update vizuálně (re-enable, zobrazit nový state)
4. On error → revert checkbox, alert

### 3.5 Odkaz v admin rozcestníku

Přidat třetí dlaždici do `src/pages/admin/index.astro`:

```astro
<a href="/admin/clanky/" class="tile">
  <h2>Články — featured na HP</h2>
  <p>Pin článků nahoru hero gridu</p>
</a>
```

---

## 4. Visual treatment

### 4.1 HP

**Žádné badges, žádné žluté ohraničení.** Hero spot ze své pozice zvýrazňuje featured článek. Přidávat tam "FEATURED" badge by bylo redundantní — pro čtenáře je to "nejnovější vybrané obsah", ne "reklamní slot".

### 4.2 `/novinky/` listing

**Beze změny** — featured neovlivňuje řazení článků na `/novinky/` (out of scope dle Otázky 2). Articles tam zůstávají striktně dle `published_at DESC`.

**Pokud by sis to později rozmyslel:** retrofit-friendly. `featured` flag v DB existuje, stačí přidat `.order('featured', { ascending: false })` před `published_at` v `/novinky/index.astro` a případně `<span class="article-top-badge">` v `ArticleCard.astro`. Bez changes spec.

### 4.3 Detail článku `/novinky/[slug]/`

**Beze změny.** Žádný featured signal — návštěvník už klikl, signal je redundantní (stejná logika jako bazar `/bazar/[id]/`).

---

## 5. Testy

### 5.1 Unit test (`tests/lib/articles-featured-sort.test.ts`)

Triviální, ale dokumentuje sort rules pro budoucího udržovatele:

```typescript
import { describe, expect, it } from 'vitest';

type Article = { id: string; featured: boolean; published_at: string };

function sortArticles(articles: Article[]): Article[] {
  return [...articles].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.published_at.localeCompare(a.published_at);
  });
}

describe('articles sort: featured DESC, published_at DESC', () => {
  it('0 featured: pure chronological order', () => {
    const articles = [
      { id: '1', featured: false, published_at: '2026-01-01' },
      { id: '2', featured: false, published_at: '2026-03-01' },
      { id: '3', featured: false, published_at: '2026-02-01' },
    ];
    expect(sortArticles(articles).map(a => a.id)).toEqual(['2', '3', '1']);
  });

  it('1 featured: featured first regardless of date', () => {
    const articles = [
      { id: '1', featured: false, published_at: '2026-03-01' },
      { id: '2', featured: true,  published_at: '2026-01-01' },
      { id: '3', featured: false, published_at: '2026-02-01' },
    ];
    expect(sortArticles(articles).map(a => a.id)).toEqual(['2', '1', '3']);
  });

  it('2 featured: newer-published featured wins hero', () => {
    const articles = [
      { id: '1', featured: true,  published_at: '2026-01-01' },
      { id: '2', featured: false, published_at: '2026-03-01' },
      { id: '3', featured: true,  published_at: '2026-02-01' },
    ];
    expect(sortArticles(articles).map(a => a.id)).toEqual(['3', '1', '2']);
  });

  it('all featured: pure chrono among featured', () => {
    const articles = [
      { id: '1', featured: true, published_at: '2026-01-01' },
      { id: '2', featured: true, published_at: '2026-03-01' },
      { id: '3', featured: true, published_at: '2026-02-01' },
    ];
    expect(sortArticles(articles).map(a => a.id)).toEqual(['2', '3', '1']);
  });
});
```

**Jasná intent:** Toto **není** replikace serverové logiky. Je to dokumentace co od query čekáme. Když někdo později změní `index.astro` query, test mu připomene specifikované chování.

### 5.2 Co netestujeme (YAGNI)

- Integration test admin endpointu (1 admin, ruční smoke stačí)
- E2E (cíl je MVP)
- UI snapshot (čisté layout, malá změna)

### 5.3 Ruční smoke test (před PR)

1. Admin přihlášen → `/admin/clanky/` → vidí seznam, žádný 403
2. Zaškrtne "Featured" u libovolného non-featured článku → response 200, checkbox zůstane zaškrtnutý
3. Otevře `/` (HP) → ten článek je v hero spotu (sorted[0])
4. Zaškrtne druhý článek (novější `published_at`) → HP refresh ukáže nový jako hero, předchozí je v small cards
5. Odznačí oba → HP vrátí current behavior (chronologicky nejnovější je hero)
6. Otevře `/novinky/` → seznam beze změny (řazený dle data, žádný featured článek nepředběhl)

---

## 6. Deploy

**NEDEPLOYOVAT v této fázi.** Po dokončení:
1. Commit na branchi `bazar/topovani` (pokračuje předchozí topování, držíme PR koherentní)
2. Push: `git push origin bazar/topovani`
3. Migrace 007 ručně přes Supabase dashboard SQL editor (postupně 005 → 006 → 007)
4. PR a deploy = oddělený krok pro usera

---

## 7. Out of scope (odloženo)

- **Badge na HP** — pozice je signal, badge redundant
- **Featured na `/novinky/` listing** — Otázka 2: jen HP
- **Time-limited featuring** (`featured_until`) — Otázka 3: persistent toggle
- **Cross-site featured propagace** (např. zenazije by automaticky featurovala když agro-svet featuruje) — out of scope, weby nezávislé
- **Statistiky featuringu** (CTR, dwell time) — analytic toolset out of scope
- **Notifikace autorům** — articles jsou editorial obsah od admin (1 user), nemusí dostat email
- **Bulk operations** v admin UI (zaškrtnout 10 najednou) — single-toggle stačí pro 1-admin scale

---

## 8. Rozhodnutí & důvody

| Rozhodnutí                                             | Důvod                                                                                        |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| **Rising tide** (žádný max-1, sort handluje)           | Méně serverové validace, admin nemusí "unfeature předchozího"; layout self-organizes        |
| Persistent toggle (žádné `featured_until`)             | Editorial highlight, ne paid promo. 1 admin = nízké riziko zapomenutí                       |
| Žádný badge                                            | Hero spot = signal. Badge redundant. Konzistentní s bazar detail pattern.                   |
| Jen HP (Otázka 2)                                      | Editorial highlighting. Listing browse zachovává čisté chronologie.                          |
| `/admin/clanky/` (samostatná stránka)                  | Konzistentní s `/admin/bazar/`, `/admin/fotosoutez/`. Není důvod sloučit.                    |
| Site filter v admin UI i UPDATE                        | Sdílená tabulka 3 webů — defense in depth proti cross-site featured by mistake.              |
| Migrace **007** (ne nový start)                        | 005/006 obsadila bazar topování + RPC. Pokračuje number sequence v same Supabase projektu.   |
| Pokračování na branchi `bazar/topovani`                | Topování je řetězená feature, jeden PR drží koherentní review surface.                       |

---

## 9. Známé deviace od původního zadání

- **"Rozprácování topování pro další sekce"** zúženo na novinky → HP (Otázka 1)
- Spec délka záměrně menší než bazar topování — jeden boolean flag, jeden HP touchpoint, jeden admin UI = méně rozhodnutí
- Sloučená sekce "testy" — minimal smoke + 1 unit test sort dokumentace, žádný integration overhead
