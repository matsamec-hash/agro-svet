# Topování přes QR platbu — provozní zprovoznění

Kód je nasazený, ale **feature-flag `BAZAR_TOPOVANI_ENABLED` je VYPNUTÝ** (`src/lib/config.ts`).
Dokud je vypnutý, celý flow je zablokovaný (žádost vrací 403, stránky redirectují) — nic
se neaktivuje. Zapni ho **až jako poslední krok**, po dokončení všeho níže.

## Kroky na produkci (dělá uživatel)

1. **Migrace DB** — nasadit `supabase/migrations/019_bazar_topovani_payments.sql` na
   **self-hosted** `supabase.samecdigital.com` (Coolify psql), NE na cloud. Přidá VS
   sekvenci, sloupce (`vs`, `fio_transaction_id`, `invoice_number`, `invoice_pdf_path`,
   `buyer_*`), tabulku `bazar_invoice_counters` + RPC `bazar_next_vs()` a
   `bazar_next_invoice_number()`.

2. **Storage bucket `invoices`** — vytvořit **privátní** bucket (ne public) na stejné
   self-hosted Supabase. Faktury jsou citlivé (jméno/IČO kupujícího).

3. **Fio účet + token** — založit nový bezplatný Fio účet jen pro topování, v internetbankingu
   vygenerovat **API token pro čtení** (read-only stačí — čteme jen výpis transakcí).

4. **Env proměnné** na Node originu (Coolify → agro-svet service → Environment):
   - `FIO_API_TOKEN` — token z kroku 3
   - `CRON_SECRET` — libovolný silný náhodný řetězec (pro autorizaci cron endpointu)
   - `TOPOVANI_IBAN` — IBAN toho Fio účtu (formát `CZ…`, bez mezer)
   - `RESEND_API_KEY` — už existuje (posílání e-mailů)
   ⚠️ Secrety nikdy do gitu ani chatu.

5. **Externí cron à 3 min** (cron-job.org / UptimeRobot) — stejný vzor jako
   `saved-search-digest`:
   ```
   GET https://agro-svet.cz/api/cron/bazar-reconcile
   Header: Authorization: Bearer <CRON_SECRET>
   Interval: každé 3 minuty
   ```
   Endpoint bez správného Bearer vrací 401. Fio rate limit je 1 req / 30 s → 3 min bezpečné.

6. **Zapnout flag** — v `src/lib/config.ts` nastavit `BAZAR_TOPOVANI_ENABLED = true`,
   commit + push master → CF build → `npm run purge`.

7. **Test reálnou platbou** — na vlastním inzerátu koupit 7denní plán (99 Kč), zaplatit
   z jiného účtu podle QR/VS, počkat ≤3 min → ověřit: inzerát je TOP, přišel e-mail s
   PDF fakturou (diakritika OK), v `bazar_featured_orders` je `status='paid'`,
   `invoice_number`, `fio_transaction_id`.

## Jak to funguje (shrnutí)
- Uživatel: `/bazar/moje/<id>/topovat` → vybere plán → `POST /api/bazar/featured/request`
  založí pending order s číselným VS → redirect na `…/topovat/platba?order=<id>` s QR/IBAN/VS.
- Platební stránka pollne `GET /api/bazar/featured/status` à 10 s.
- Cron `GET /api/cron/bazar-reconcile` à 3 min: přečte Fio transakce za 2 dny, napáruje
  pending podle `vs` **a** přesné částky → aktivuje TOP (RPC), přidělí číslo faktury,
  vygeneruje PDF (bucket `invoices`), pošle e-mail kupujícímu (BCC účetní).
- Přeplatek/nedoplatek → order zůstane pending + `admin_note` (ruční řešení).
- Pending bez platby > 14 dní → cron tiše nastaví `failed`.

## Zabezpečení
- Cron endpoint chráněn `Bearer CRON_SECRET`.
- Idempotence párování přes `fio_transaction_id UNIQUE` (jedna Fio transakce spáruje max 1 order).
- Admin schválení (`/admin/bazar/`) zůstává jako záloha pro sporné platby a refundace.
