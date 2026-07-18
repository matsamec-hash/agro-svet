# Fotosoutěž — spuštění 1. 8. 2026 na self-host Supabase (runbook)

Cíl: prázdninová fotosoutěž `leto-2026` běží **1. 8. – 31. 8. 2026** a celá
soutěž (data + auth + storage) je na **`supabase.samecdigital.com`**, ne na
cloudu `obhypfuzmknvmknskdwh`.

Kód je hotový. Storage URL fotek jsou nově odvozené z env (branch
`feat/fotosoutez-storage-env-fix`, commit `91bd9d6`). Zbytek jsou DB/infra
kroky níže — **prod zápisy dělá uživatel**.

⚠️ Past (z 29. 5.): pro DML používej service-role key té DB, ze které web
**reálně čte**. Studio SQL editor může sedět na jiném stejnojmenném projektu.
`getRoundBySlug` ignoruje `error` → tichý `null`, takže „prod nevidí kolo"
nevyhodí chybu, jen redirect.

---

## Krok 0 — zjistit, kterou DB web reálně čte  (KRITICKÉ)

Ověřeno 18. 7.: leaderboard API vrací cloudová data a `.env`/`wrangler.toml`
míří na cloud → **soutěž teď běží proti cloudu**. Ale články se 17. 7.
přepnuly na samecdigital. Zkontroluj běžící kontejner:

- Coolify → app `agro-svet` → Environment Variables → hodnota `SUPABASE_URL`
  a `PUBLIC_SUPABASE_URL`. Podle toho víš, jestli je web rozpolcený.

Rozhodnutí uživatele: **sjednotit vše na samecdigital.**

## Krok 1 — co už na samecdigital je (detekce)

Spusť na `supabase.samecdigital.com` (service-role SQL):

```sql
-- existují contest_* tabulky?
SELECT tablename FROM pg_tables WHERE tablename LIKE 'contest_%';
-- má bazar_users admin sloupec?
SELECT column_name FROM information_schema.columns
  WHERE table_name = 'bazar_users' AND column_name = 'is_admin';
-- existuje storage bucket?
SELECT id, public FROM storage.buckets WHERE id = 'contest-photos';
-- je tam kolo?
SELECT slug, status FROM contest_rounds WHERE slug = 'leto-2026';
```

## Krok 2 — aplikovat bundle

Spusť **`supabase/deploy/contest-on-samecdigital.sql`** (idempotentní — bezpečné
i když část už existuje). Vytvoří/doplní: contest_* schéma, rozšíření
`bazar_users`, bucket `contest-photos` + RLS, a upsertne kolo `leto-2026` na
okno 1. 8. – 31. 8. Na konci vypíše kontrolní řádek.

Předpoklad: `bazar_users` na cílové DB existuje (auth bazaru). Pokud ne, nejdřív
`supabase/migrations/001_bazar_schema.sql`.

## Krok 3 — repoint webu + nasazení opravy

1. Coolify app `agro-svet` → env `SUPABASE_URL`, `SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_KEY` + `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`
   → `https://supabase.samecdigital.com` a příslušné klíče samecdigital.
2. Sladit `wrangler.toml` + `.env` v repu (ať build míří stejně).
3. Nasadit branch `feat/fotosoutez-storage-env-fix` (merge do master + redeploy).
   Bez toho by fotky vedly na starý cloud.

## Krok 4 — nastavit admina (moderace)

Aby fungovalo `/admin/fotosoutez/moderace`, tvůj bazar účet musí být admin:

```sql
UPDATE bazar_users SET is_admin = true WHERE email = 'TVUJ@EMAIL';
```

## Krok 5 — E2E smoke test (na živé DB, před promem)

1. Registrace / login na `/bazar/prihlaseni`
2. `/fotosoutez/nahrat` → nahraj fotku (od 1. 8.; do té doby fáze `upcoming`)
3. `/admin/fotosoutez/moderace` → schválit
4. Fotka se zobrazí na `/fotosoutez/leto-2026/` (ověř, že URL míří na
   samecdigital storage, ne cloud)
5. Detail fotky → zadej email → dorazí **magic-link** (ověř Resend
   doručitelnost + `CONTEST_FROM_EMAIL`) → potvrď → hlasuj
6. Leaderboard `+1`

## Krok 6 — promo

Sociální posty k 1. 8. (celý smysl soutěže = traffic). Sdílecí odkazy +
OG images jsou v kódu.

---

## Rollback

Cloud `obhypfuzmknvmknskdwh` zůstává živý jako pojistka. Když něco selže,
vrať env zpět na cloud (soutěž tam běží beze změny).
