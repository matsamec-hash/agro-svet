-- 028_akce_reports_a_cteni_user_profiles.sql
-- Zbytek děr z auditu 20. 11. 2026 (úkol 1de5534b, navazuje na 027; podklad
-- docs/VYSLEDKY-dovyzkoumani-2026-11-20.md bod 6). Veřejný anon klíč a každý
-- přihlášený uživatel (i prodejce z bazaru, který sdílí auth.users s CMS) šel:
--
-- 1) akce_reports: politika "akce_reports_insert_any" (INSERT, check true) pouštěla
--    anonymní zápisy přímo do tabulky a obcházela limit API. Tabulku nepoužívá
--    nikdo — ani agro-svet, ani CMS (grep 20. 11. 2026) — takže ji čte i píše
--    jen service_role, který granty i RLS obchází.
-- 2) user_profiles: politika "Authenticated read" (SELECT pro role() = 'authenticated')
--    pouštěla číst CELOU tabulku CMS týmu (e-maily, role, přiřazené weby)
--    každému přihlášenému. CMS čte pod JWT jen vlastní řádek (src/lib/auth.ts,
--    src/hooks/use-user-role.ts, RLS politiky jiných tabulek `... WHERE id = auth.uid()`)
--    a přehled všech uživatelů (src/app/(dashboard)/users/page.tsx) dělá jen
--    admin. Zápisy a dashboard uživatelů jdou přes service_role.
--    Nová politika: vlastní řádek, nebo admin (is_admin_user() z migrace 027 čte
--    tabulku mimo RLS, takže nevzniká rekurze). anon na user_profiles nepotřebuje
--    nic → revoke all.
--
-- Tabulky vlastní supabase_admin → spouštět jako supabase_admin.
-- POZOR (split-brain): aplikovat na self-hosted prod (supabase.samecdigital.com).
-- Politika user_profiles patří CMS (jeho migrace 008) — CMS repo se touto
-- migrací nemění, ale změna se týká i jeho DB.

begin;

-- 1) akce_reports ------------------------------------------------------------
drop policy if exists "akce_reports_insert_any" on public.akce_reports;
revoke all on public.akce_reports from anon;
revoke all on public.akce_reports from authenticated;

-- 2) user_profiles: čtení jen vlastního řádku, nebo admin ------------------------
drop policy if exists "Authenticated read" on public.user_profiles;
drop policy if exists "Read own or admin" on public.user_profiles;
create policy "Read own or admin" on public.user_profiles
  for select
  using (id = (select auth.uid()) or (select public.is_admin_user()));

revoke all on public.user_profiles from anon;

commit;
