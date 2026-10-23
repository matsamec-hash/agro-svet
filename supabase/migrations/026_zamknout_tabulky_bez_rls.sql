-- 026_zamknout_tabulky_bez_rls.sql
-- Tři díry, které šly otevřít veřejným (anon) klíčem — ten je v kódu každého webu:
--
-- 1) bazar_users: politika SELECT `true` vydávala e-maily a telefony všech
--    uživatelů bazaru komukoli. Veškerý kód agro-světa čte bazar_users přes
--    service-role klíč (RLS obchází), takže stačí vlastní řádek — přesně jak
--    to už tvrdí komentář v src/middleware.ts.
-- 2) akce_images a bazar_invoice_counters neměly RLS vůbec, anon mohl zapisovat
--    i mazat. Obě čte a píše jen server přes service-role klíč.
-- 3) bazar_next_invoice_number() a bazar_next_vs() šly volat anonymně a pálit
--    čísla faktur (řada má být bez děr). Volá je jen server (service role).
--
-- Aplikováno na prod 22. 10. 2026 večer, PŘED migrací 025 (jiná relace,
-- 23:04), která bazar_users vzala anon i authenticated úplně (`revoke all`).
-- Politika z bodu 1 je od té doby jen druhá pojistka.
--
-- Tabulky akce_images, bazar_invoice_counters a obě funkce vlastní
-- supabase_admin → spouštět jako supabase_admin.
-- POZOR (split-brain): aplikovat na self-hosted prod (supabase.samecdigital.com).

drop policy if exists bazar_users_select on bazar_users;
create policy bazar_users_select on bazar_users
  for select using ((select auth.uid()) = id);

alter table akce_images enable row level security;
alter table bazar_invoice_counters enable row level security;

revoke execute on function bazar_next_invoice_number() from public, anon, authenticated;
revoke execute on function bazar_next_vs() from public, anon, authenticated;
