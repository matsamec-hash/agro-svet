# Bazar Topování (TOP inzeráty) — Design Spec

## Overview

Admin-řízená propagace inzerátů v Agro bazaru. V této fázi **bez platební brány** — topování aktivuje admin manuálně (po domluvě / převodu). Platební brána (GoPay / Stripe Checkout) přibude v další fázi a naplní stejné DB sloupce.

**Stack:** Astro 6 SSR (Cloudflare adapter) + Supabase (sdílený projekt `obhypfuzmknvmknskdwh`)

**Branch:** `bazar/topovani` (worktree `/Users/matejsamec/agro-svet-topovani/`), base `origin/master` (HEAD `3023815`)

**Cíl fáze:** DB schéma + admin UI pro toggle + veřejná prezentace featured inzerátů (Doporučené sekce + TOP badge + řazení). Bez platby, bez self-service checkoutu.

---

## 1. Datový model

### Migrace `supabase/migrations/005_bazar_topovani.sql`

```sql
ALTER TABLE bazar_listings
  ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS featured_until timestamptz,
  ADD COLUMN IF NOT EXISTS featured_plan text;

CREATE INDEX IF NOT EXISTS idx_bazar_listings_featured_active
  ON bazar_listings(featured_until DESC)
  WHERE featured = true;
```

Migrace je idempotentní (`IF NOT EXISTS`). Aplikuje se na sdílený Supabase projekt (pozor na ostatní weby — zenazije, content-network). Nemaže existující sloupce ani data.

### Sémantika

| Stav                                             | `featured` | `featured_until`   | Zobrazení                |
| ------------------------------------------------ | ---------- | ------------------ | ------------------------ |
| Nikdy netopován                                  | false      | null               | Normální inzerát         |
| Aktivní TOP                                      | true       | `> now()`          | Doporučené sekce + badge |
| Expirovalo (keep for audit / reaktivace)         | true       | `<= now()`         | Normální inzerát         |
| Admin zrušil                                     | false      | null               | Normální inzerát         |

`featured_plan` ∈ `{'7d', '30d', '60d', 'custom', NULL}` — descriptor plánu pro statistiky a budoucí integraci s platbou. Nezávislý na `featured_until` (jen popisek).

### Expirace = lazy check

Žádný cron, žádný Workers scheduled task. Všechny veřejné queries filtrují přes `featured_until > now()`. Expirované záznamy se automaticky "degradují" na normální inzeráty v řazení, data zůstávají.

**Řazení v `/bazar/`:**
```sql
ORDER BY (featured = true AND featured_until > now()) DESC, created_at DESC
```

**Prodloužení existujícího TOPu** (server-side logika):
```sql
featured_until = GREATEST(now(), COALESCE(featured_until, now())) + interval '<N> days'
```
Pokud ještě neexpirovalo → přičte se k existující době. Pokud expirovalo → počítá se od `now()`.

---

## 2. Veřejná prezentace `/bazar/`

### 2.1 Podmínky zobrazení sekce "Doporučené"

Sekce se vykreslí **JEN když**:
- `page = 1`
- Žádný aktivní filter (kategorie, značka, lokalita, cena, rok, výkon, fulltext)
- Existuje alespoň 1 aktivní featured inzerát

Jinak sekce zmizí a hlavní seznam zachová pořadí (`featured DESC, created_at DESC`).

### 2.2 Layout

```
┌─────────────────────────────────────────────────┐
│ BazarFilters (beze změn)                         │
├─────────────────────────────────────────────────┤
│ ⭐ Doporučené inzeráty                           │
│ ┌──────────┬──────────┐                         │
│ │ Card 1   │ Card 2   │   BazarFeaturedGrid     │
│ ├──────────┼──────────┤   2×2 (desktop)         │
│ │ Card 3   │ Card 4   │   1 sloupec (mobile)    │
│ └──────────┴──────────┘                         │
├─────────────────────────────────────────────────┤
│ Všechny inzeráty (267)                           │
│ ── BazarListingRow (bez featured)               │
│ ── BazarListingRow                              │
│ ...                                              │
│ BazarPagination                                 │
└─────────────────────────────────────────────────┘
```

### 2.3 Dvě queries na default view

1. **`getFeaturedListings()`**
   ```sql
   SELECT * FROM bazar_listings
   WHERE status = 'active'
     AND featured = true
     AND featured_until > now()
   ORDER BY featured_until DESC
   LIMIT 4;
   ```

2. **`getListings(excludeIds)`**
   ```sql
   SELECT * FROM bazar_listings
   WHERE status = 'active'
     AND id NOT IN (<featured IDs>)
   ORDER BY created_at DESC
   LIMIT 20 OFFSET 0;
   ```

**Count "Všechny inzeráty (267)"** — celkový count active inzerátů (featured + non-featured), tj. stávající chování.

### 2.4 Filtrované / stránkované view

Když user filtruje nebo je na page ≥ 2:
- Doporučené sekce **nerenderuje**
- Hlavní seznam: `ORDER BY (featured = true AND featured_until > now()) DESC, created_at DESC`
- Featured se v seznamu zobrazí s **TOP badge** v pravém horním rohu karty (stejný styl jako v Doporučené gridu)

### 2.5 Komponenty

#### `src/components/bazar/BazarFeaturedGrid.astro` (nová)

Props: `listings: BazarListing[]` (max 4, typicky 1–4)

CSS:
- Sekce wrapper: border 2px `#FFFF00`, border-radius 18px, padding 20px, background `#fffef8`
- Grid: `grid-template-columns: 1fr 1fr` desktop (>768px), `1fr` mobile
- Gap: 14px
- Heading "⭐ Doporučené inzeráty" — Chakra Petch 22px weight 600

Karta:
- Obrázek 16:9 z `bazar_images[0]` (fallback placeholder když žádný obrázek)
- TOP badge absolutně umístěný vpravo nahoře
- Titulek: Chakra Petch 18px weight 600, 2 řádky s ellipsis
- Cena: Roboto Condensed 16px weight 600
- Lokalita: Roboto Condensed 13px weight 400, color `#666`
- Link `<a>` na `/bazar/[id]`

#### TOP Badge (inline v kartě i v `BazarListingRow`)

```html
<span class="bazar-top-badge">TOP</span>
```

```css
.bazar-top-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #FFFF00;
  color: #1a1a1a;
  font-family: 'Chakra Petch', sans-serif;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 4px;
  z-index: 2;
}
```

#### `BazarListingRow` (úprava existující)

Přidat TOP badge do pravého horního rohu karty **když** `listing.featured && new Date(listing.featured_until) > new Date()`. Badge je absolutně pozicovaný, řádek musí mít `position: relative`.

---

## 3. Admin UI `/admin/bazar/`

### 3.1 Guard

Stránka čte session z cookies, fetchne `bazar_users` pro daný `user_id`, kontroluje `is_admin = true`.

Nezalogovaný / non-admin → redirect na `/bazar/prihlaseni/?redirect=/admin/bazar/`.

### 3.2 Layout

```
┌──────────────────────────────────────────────────────────┐
│ Admin — Topování bazaru                                   │
│                                                           │
│ Filter: [Vše ▼] [Jen aktivní TOP] [Expirované] [Non-TOP] │
│ Hledat: [______________] (titulek / autor email)         │
├──────────────────────────────────────────────────────────┤
│ Titulek            │ Autor     │ Cena  │ TOP stav        │ Akce
├──────────────────────────────────────────────────────────┤
│ John Deere 8R 410  │ pepa@…    │ 3.2M  │ 🟢 Aktivní TOP │ [+7d][+30d][+60d]
│                    │           │       │ do 24.5.2026    │ [Custom...][Zrušit]
├──────────────────────────────────────────────────────────┤
│ Zetor Proxima 120  │ novak@…   │ 890k  │ ⚫ Nepropagován │ [+7d][+30d][+60d]
│                    │           │       │                 │ [Custom...]
├──────────────────────────────────────────────────────────┤
│ Fendt 724          │ franta@…  │ 2.1M  │ 🔴 Expirovalo  │ [+7d][+30d][+60d]
│                    │           │       │ 19.4.2026       │ [Custom...]
└──────────────────────────────────────────────────────────┘
                         BazarPagination
```

**Default sort:** aktivní TOP nejvýš (`featured = true AND featured_until > now() DESC`, pak `featured_until ASC` aby brzo-vypršelé byly nahoře), pak `created_at DESC`.

**Stránkování:** 30 položek/stránka.

**Filter chips:** `Vše` | `Jen aktivní TOP` | `Expirované TOP` | `Non-featured` | Search input (titulek / autor email) s debounce 300ms.

### 3.3 Akce — POST endpoint

**`src/pages/api/admin/bazar/toggle-featured.ts`** (POST)

Body:
```typescript
type Body =
  | { listingId: string; action: 'extend'; plan: '7d' | '30d' | '60d' }
  | { listingId: string; action: 'custom'; until: string /* ISO */ }
  | { listingId: string; action: 'clear' };
```

Validace:
1. Session cookie → `user_id`
2. `bazar_users.is_admin = true` → jinak 403
3. `listingId` existuje → jinak 404
4. Pro `custom`: `until` je validní ISO datum > now()

Server-side logika:

**`extend`** (preset):
```sql
UPDATE bazar_listings SET
  featured = true,
  featured_plan = $plan,
  featured_until = GREATEST(now(), COALESCE(featured_until, now())) + ($days * interval '1 day')
WHERE id = $listingId;
```

**`custom`**:
```sql
UPDATE bazar_listings SET
  featured = true,
  featured_plan = 'custom',
  featured_until = $until
WHERE id = $listingId;
```

**`clear`**:
```sql
UPDATE bazar_listings SET
  featured = false,
  featured_plan = null,
  featured_until = null
WHERE id = $listingId;
```

Response: `200 { ok: true, listing: { id, featured, featured_until, featured_plan } }` nebo `403 / 404 / 400`.

### 3.4 Client-side (admin stránka)

Po kliknutí na akci:
1. Disable button (loading)
2. `fetch('/api/admin/bazar/toggle-featured', { method: 'POST', body: JSON.stringify(...) })`
3. Aktualizovat řádek inline z response (bez refresh stránky)

`Custom...` otevře modal s `<input type="datetime-local">` + Submit / Cancel.

### 3.5 Odkaz v admin menu

Na `/admin/` rozcestníku přidat kartu "Agro bazar — Topování" vedle "Fotosoutěž". Při implementaci zkontroluj existující layout `/admin/index.astro` (pokud neexistuje, stačí pridat do `/admin/fotosoutez/` layoutu navigační odkaz).

---

## 4. User-facing — `/bazar/moje/` + edit + detail

### 4.1 `/bazar/moje/` (dashboard "Moje inzeráty")

Každá karta v seznamu dostane vizuální indikátor stavu:

| Stav           | Indikátor                                                      |
| -------------- | -------------------------------------------------------------- |
| Aktivní TOP    | Žlutý `#FFFF00` levý border 4px + badge `⭐ TOP do 24. 5. 2026` |
| Expirovalo     | Šedý badge `TOP expirovalo 19. 4. 2026`                        |
| Normální       | Beze změny                                                     |

Dole na stránce (stateless info): **"Topování inzerátů nabízíme po domluvě — kontaktujte nás na info@agro-svet.cz"** (diskrétní, jeden řádek).

### 4.2 `/bazar/moje/[id]` (edit form)

Readonly info box nad editačním formem — **jen pokud** `listing.featured = true`:

```
┌──────────────────────────────────────────────┐
│ ⭐ Tento inzerát je propagován jako TOP       │
│    Aktivní do: 24. 5. 2026                   │
│    (nebo: Expirovalo: 19. 4. 2026)           │
└──────────────────────────────────────────────┘
```

User neovládá, jen vidí stav. Formulář (title, description, atd.) zůstává beze změny.

### 4.3 `/bazar/[id]` (veřejný detail)

**Beze změny.** TOP signál platí jen pro seznam (fungující lákadlo). V detailu už user rozhodl kliknout, druhý TOP signál je redundantní. Hero zůstává čistý.

---

## 5. Helper funkce

### `src/lib/bazar-featured.ts` (nový soubor)

```typescript
export function isFeaturedActive(
  listing: { featured: boolean; featured_until: string | null },
  now: Date = new Date()
): boolean;

export function computeFeaturedUntil(
  currentUntil: Date | null,
  days: number,
  now: Date = new Date()
): Date;

export function formatFeaturedUntil(
  timestamp: string | Date | null | undefined,
  locale?: 'cs'
): string; // "24. 5. 2026" nebo ""

export function planToDays(plan: '7d' | '30d' | '60d'): number;
```

---

## 6. Testy

### Vitest unit testy v `tests/bazar-topovani/`

**`tests/bazar-topovani/featured-status.test.ts`** — `isFeaturedActive`:
- `featured=true, featured_until > now` → `true`
- `featured=true, featured_until <= now` → `false` (expirované)
- `featured=false` → `false`
- `featured=true, featured_until=null` → `false` (edge case)

**`tests/bazar-topovani/featured-duration.test.ts`** — `computeFeaturedUntil`:
- Nový TOP (`currentUntil=null, days=30`) → `now + 30d`
- Prodloužení aktivního (`currentUntil=now+10d, days=30`) → `currentUntil + 30d` (ne `now+30d`)
- Prodloužení expirovaného (`currentUntil=now-5d, days=30`) → `now + 30d`

**`tests/bazar-topovani/format-until.test.ts`** — `formatFeaturedUntil`:
- `2026-05-24T10:00:00Z` → `"24. 5. 2026"`
- null/undefined → `""`

### Co netestujeme (YAGNI)

- Integration testy admin endpointu — overhead pro 1 admin usera, ruční smoke stačí
- E2E Playwright — odloženo (memory: fotosoutěž E2E také odložena)
- UI snapshot testy — styling může iterovat

### Ruční smoke test (před PR)

1. Přihlášený admin otevře `/admin/bazar/` → vidí seznam
2. Klikne `+30d` u non-featured → objeví se v `Doporučené` na `/bazar/`
3. Klikne `+30d` znovu → `featured_until` se prodlouží o dalších 30d, plan zůstane `30d`
4. Klikne `Custom...` → modal → vybere datum → uloží
5. Klikne `Zrušit` → zmizí z Doporučené, na `/bazar/moje/` zmizí badge
6. Manuální UPDATE v Supabase SQL editoru `SET featured_until = now() - interval '1 day'` → zmizí z Doporučené, propadne se v seznamu, na `/bazar/moje/` "Expirovalo"

---

## 7. Deploy

**NEDEPLOYOVAT v této fázi.** Po dokončení:
1. Commit na branchi `bazar/topovani`
2. Push branch: `git push -u origin bazar/topovani`
3. PR do master (nebo direct merge dle rozhodnutí usera)
4. Deploy je **oddělený krok** (user nebo Okno 3 provede `wrangler deploy` po merge)

**Migrace 005 musí být aplikována na Supabase ručně** přes dashboard SQL editor / psql před deployem kódu. Idempotentní (`IF NOT EXISTS`), takže bezpečné spustit.

---

## 8. Out of scope (odloženo na další fázi)

- **Platební brána** (GoPay / Stripe Checkout) — checkout flow naplní stejné sloupce (`featured`, `featured_until`, `featured_plan`), žádné DB změny nepotřeba
- **Self-service "Topovat"** tlačítko v `/bazar/moje/[id]/`
- **Webhook endpoint** `/api/bazar/topovani-webhook`
- **Statistiky topování** (kolik inzerátů, kolik Kč, nejúspěšnější plány) — až po platbě
- **Email notifikace** pro usera když jeho inzerát topován / topování vyprší
- **TOP badge v detailu `/bazar/[id]`** — rozhodnuto out of scope (viz 4.3)
- **Grande Finále layouty / výrazná promo sekce** — současný 2×2 grid stačí pro MVP

---

## 9. Rozhodnutí & důvody

| Rozhodnutí                                 | Důvod                                                                                                    |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Migrace **005** (ne 003)                   | 003 obsadila fotosoutěž, 004 rozšiřuje `bazar_users`. Přečíslování vůči původnímu zadání.                |
| Base branch **`origin/master`**            | Čistý izolovaný stav bez fotosoutěže. Merge s `fotosoutez/mvp` vyřeší user před deployem.                |
| **Admin-only** aktivace                    | Nejrychlejší, žádné nové public endpointy, využije existující `is_admin` flag. Platba přibude později.   |
| **Hybrid** Doporučené sekce (Otázka 3)     | Landing UX pro browsování + čistý search při filtraci. Featured pořád dostane boost přes sorting.        |
| **2×2 grid** 4 slotů (Otázka 6)            | Vizuální kontrast proti řádkům, 4 dostatečně viditelné, nepřetížené. Když je <4 aktivních, sekce menší.  |
| **Lazy check** expirace (ne cron)          | Zero infrastructure overhead. Cloudflare Workers cron by vyžadoval extra setup bez real benefitu.        |
| **Badge v detailu NE** (Otázka 2)          | V detailu user už kliknul, druhý signál redundantní. Čistý hero.                                          |
| **`featured_plan`** zachován               | Descriptor pro statistiky i budoucí checkout flow. Separátní od `featured_until` (jen popisek).          |
| **Prodloužení = GREATEST(now, until)+N**   | Fair UX — když user topuje před expirací, nepřichází o zbytek zaplacené doby.                            |
