# Bazar topování přes QR platbu — návrh

**Datum:** 2026-07-22
**Projekt:** agro-svet.cz (`~/agro-svet/agro-svet`), Astro SSR na Cloudflare Workers, Supabase.
**Stav:** Design schválen uživatelem (brainstorming 2026-07-22). Tento dokument ho formalizuje před implementačním plánem.

## Cíl

Nahradit dnešní ruční flow topování (uživatel požádá → admin ručně schválí po převodu) **samoobslužnou QR platbou**:

uživatel koupí topování → dostane QR na Fio účet → Cloudflare cron do ~3 min napáruje platbu podle variabilního symbolu → automatická aktivace TOP + PDF faktura e-mailem.

Nula ručních kroků, nula transakčních poplatků. Admin schválení zůstává jako **záloha** pro sporné platby a refundace.

## Klíčová rozhodnutí (schválená)

1. **Platební rail = Fio banka** (ne Airbank). Fio má ZDARMA REST API na výpis transakcí → auto-párování podle VS. Airbank token-based feed zdarma nenabízí. Uživatel založí **nový bezplatný Fio účet jen pro topování**.
2. **Faktury = vlastní PDF** (ne Fakturoid/iDoklad). Prodejce **Samec Digital s.r.o., IČO 29547539, NEPLÁTCE DPH** → doklad jednoduchý, bez DPH. Zero dependency, zero fee.
3. **EET** zrušené od 2023 → žádná evidence tržeb.

## Co UŽ existuje (NESTAVĚT ZNOVU)

- **Ceník** `src/lib/bazar-featured-pricing.ts`: `FEATURED_PLANS` = 99 Kč/7 dní, 249 Kč/30 dní, 449 Kč/60 dní.
- **DB** `bazar_featured_orders` (migrace `010`): sloupce `id, listing_id, user_id, plan, days, price_czk, status(pending|paid|free|failed|refunded), featured_until_after, stripe_*(nepoužité), admin_note, created_at`. RLS hotové.
- **RPC** `bazar_extend_featured()` (migrace `006`); `featured/featured_until/featured_plan` na `bazar_listings` (migrace `005`).
- **Flow**: `src/pages/bazar/moje/[id]/topovat.astro` → `POST /api/bazar/featured/request.ts` (založí pending + e-mail adminovi) → `/admin/bazar/api/approve-featured.ts` (flip pending→free/paid + RPC).
- **Lib** `src/lib/bazar-featured.ts` (`isFeaturedActive`, `computeFeaturedUntil`, `planToDays`).
- **Feature-flag** `BAZAR_TOPOVANI_ENABLED` v `src/lib/config.ts` (teď VYPNUTO), použit v `topovat.astro`, `moje/[id].astro`, `request.ts`.
- ⚠️ **Vadná copy** na `src/pages/bazar/topovani/index.astro`: „VS = prvních 8 znaků UUID" — UUID má písmena, VS musí být číselný → opravit.

## Návrh (delta oproti scaffoldu)

### DB migrace `019_bazar_topovani_payments.sql`
Nasadit na **self-hosted prod `supabase.samecdigital.com`** (Coolify), NE cloud. (Číslo 019 — 018 zabralo `018_akce_foto.sql`.)

Rozšířit `bazar_featured_orders`:
- `vs bigint UNIQUE` — číselný variabilní symbol z nové sekvence `bazar_vs_seq` (start např. 10000000, ať je VS 8-místný a nekoliduje).
- `fio_transaction_id bigint UNIQUE` — idempotence párování (jedna Fio transakce spáruje max 1 order).
- `invoice_number text UNIQUE` + `invoice_pdf_path text` — přiřadí se při zaplacení.
- `buyer_name text, buyer_ico text, buyer_address text` — snapshot fakturačních údajů (volitelné, zadané kupujícím).
- `paid_at timestamptz` — kdy spárováno (pokud už není).

Stávající `stripe_*` sloupce **ponechat** (nullable, nepoužité) — dropovat je zbytečně destruktivní.

Nová counter tabulka + RPC pro čísla faktur bez děr/duplicit:
- `bazar_invoice_counters(year int PRIMARY KEY, last_seq int NOT NULL DEFAULT 0)`
- RPC `bazar_next_invoice_number()` → atomicky inkrementuje `last_seq` pro aktuální rok, vrací `2026-0001` (formát `YYYY-NNNN`).

### Flow (uživatelská cesta)
1. **`/bazar/moje/[id]/topovat`** → výběr plánu + volitelné fakturační údaje (jméno/IČO/adresa) → `POST /api/bazar/featured/request` založí `pending` order s přiděleným `vs`, `price_czk`, buyer snapshotem; vrátí `{ orderId, iban, amount, vs, spayd }`.
2. **Platební stránka `…/topovat/platba?order=<id>`**: zobrazí QR kód (SPAYD / „QR Platba"), IBAN, částku, VS. Auto-refresh přes `GET /api/bazar/featured/status?order=<id>` (poll à ~10 s) → po spárování přesměruje na potvrzení.
3. **Cloudflare Cron Trigger à 3 min** → chráněný `GET /api/bazar/featured/reconcile` (secret header `RECONCILE_SECRET`):
   - `src/lib/fio.ts` čte Fio REST transakce za posledních ~2 dny (idempotentně přes `fio_transaction_id`, NE stateful `last` kurzor — bezstavové, opakovatelné).
   - Napáruje `pending` ordery: `vs` sedí **a** `částka == price_czk` → `paid`, zavolá `bazar_extend_featured()` RPC, přidělí číslo faktury, vygeneruje PDF, pošle e-mail.
   - Přeplatek/nedoplatek (částka nesedí) → nechá `pending` + e-mail adminovi (bezpečnější než hádat).
   - Pending order bez platby > 14 dní → cron tiše zruší (`status='failed'` nebo smaže).
   - Fio rate limit: 1 req / 30 s per token → 3 min interval je bezpečný.

### QR platba — `src/lib/spayd.ts`
- Builder SPAYD stringu (`SPD*1.0*ACC:<IBAN>*AM:<částka>*CC:CZK*X-VS:<vs>*MSG:...`).
- QR kód se vygeneruje z SPAYD stringu (knihovna generující QR jako SVG/data-URI, funkční na CF Workers; čistý JS).

### Faktury — `src/lib/invoice.ts`
- **pdf-lib** (čistý JS, funguje na CF Workers).
- ⚠️ Standardní fonty pdf-lib NEUMÍ českou diakritiku → **vložit Unicode TTF (Noto/DejaVu) přes `@pdf-lib/fontkit`** (font jako bundle asset přes `import.meta.glob`/binary import), jinak ř/č/ž rozbité.
- Náležitosti dokladu neplátce DPH: prodejce (Samec Digital s.r.o., IČO 29547539, zápis v OR), kupující (buyer snapshot), číslo faktury, datum vystavení + DUZP, popis „Topování inzerátu – <N> dní", částka, VS, text „Nejsme plátci DPH".
- PDF → privátní Storage bucket `invoices` (`invoice_pdf_path`) + příloha Resend e-mailu kupujícímu + BCC účetní.

### Secrety & config (NIKDY do chatu)
`FIO_API_TOKEN`, `RECONCILE_SECRET`, `TOPOVANI_IBAN` → Cloudflare env vars. Rozjezd = zapnout `BAZAR_TOPOVANI_ENABLED`.

## Komponenty (jednotky s jasnou hranicí)

| Soubor | Odpovědnost |
|--------|-------------|
| `supabase/migrations/019_bazar_topovani_payments.sql` | Schema delta + VS sekvence + invoice counter RPC |
| `src/lib/spayd.ts` | SPAYD string builder + QR generace (čistá fce) |
| `src/lib/fio.ts` | Fio REST client + parser transakcí (čistá fce nad JSON) |
| `src/lib/invoice.ts` | PDF faktura (pdf-lib + fontkit) |
| `src/lib/bazar-vs.ts` | Přidělení/validace VS (číselný) |
| `src/pages/api/bazar/featured/request.ts` | Rozšířit: přidělit VS, buyer snapshot, vrátit IBAN/amount/VS/SPAYD |
| `src/pages/api/bazar/featured/status.ts` | Nový: poll stavu orderu (paid?) |
| `src/pages/api/bazar/featured/reconcile.ts` | Nový: cron endpoint, párování Fio → aktivace + faktura + e-mail |
| `src/pages/bazar/moje/[id]/topovat/platba.astro` | Nová platební stránka (QR/IBAN/VS + auto-refresh) |
| `src/pages/bazar/topovani/index.astro` | Opravit vadnou VS copy |
| Cloudflare cron config (`wrangler.toml`) | Trigger à 3 min na `/api/bazar/featured/reconcile` |

## Testy (TDD — čisté funkce)
- SPAYD builder (formát, escaping).
- VS generace + validace (číselný, unikátní).
- Amount matching (přesná shoda, pod/přeplatek → nepárovat).
- Formát čísla faktury (`YYYY-NNNN`, bez děr).
- Parser Fio JSON (fixture reálné odpovědi → transakce).
- Smoke: PDF se vygeneruje a obsahuje diakritiku (font embedding funguje).

## Deploy
Master push → CF Workers build ~3 min → `npm run purge`. **Node ≥22** (`export PATH="$HOME/.nvm/versions/node/v22.22.2/bin:$PATH"`). Migrace 019 nasadit na self-hosted `supabase.samecdigital.com`. origin/master může být aktivní (paralelní session) → fetch+rebase, práce ve worktree + `git push HEAD:master`.

## Mimo rozsah (příště)
Refundace samoobslužně (zůstává ruční admin); opakované/roční předplatné; jiné platební raily; telefonní obnova/ověření přes SMS+WhatsApp (samostatná featura).
