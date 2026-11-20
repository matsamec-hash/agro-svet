-- 027_anon_zapisy_akce_email_user_profiles.sql
-- Bezpečnostní audit 20. 11. 2026 (úkol a9004638, podklad
-- docs/VYSLEDKY-dovyzkoumani-2026-11-20.md bod 6). Veřejný anon klíč je v kódu
-- každého webu a šel jím:
--
-- 1) newsletter_subscribers: politika "Anyone can subscribe" (INSERT, check true)
--    pouštěla i řádek s confirmed = true → potvrzený odběr pro CIZÍ e-mail bez
--    double opt-inu a bez limitu API; cron pak posílal e-maily z mail.agro-svet.cz.
-- 2) bazar_saved_searches: totéž (user_id IS NULL projde, confirmed = true,
--    status = 'active'). Přihlášený uživatel navíc mohl svůj řádek přes UPDATE
--    přepsat na cizí e-mail a potvrzení si udělit sám.
-- 3) akce.email: anon (i authenticated) četl soukromý e-mail pořadatele
--    u zveřejněných akcí; web ho nikde nezobrazuje.
-- 4) bazar_extend_featured(): šla volat anonymně (je SECURITY INVOKER, takže
--    zápis neprošel, ale volat ji smí jen server).
-- 5) user_profiles: politiky "Admin insert/update/delete" čtou user_profiles
--    uvnitř politiky té samé tabulky → Postgres 42P17 "infinite recursion"
--    na každý zápis (admin přes PostgREST nezapíše nic).
--
-- Web čte i zapisuje newsletter_subscribers, bazar_saved_searches i akce výhradně
-- na serveru přes service_role (createServerClient), který granty i RLS obchází;
-- createAnonClient se na těchto tabulkách nepoužívá nikde (ověřeno grepem
-- 20. 11. 2026) a supabase-browser.ts není nikde importován.
--
-- newsletter_subscribers: authenticated si nechává SELECT + UPDATE kvůli politikám
-- newsletter_subscribers_staff_select/_update (admin/editor z CMS).
-- akce: anon a authenticated smějí číst jen veřejné sloupce, tedy všechny kromě
-- email, zamitnuti_duvod, moderoval a moderovano_at. Seznam povolených sloupců
-- se skládá z tabulky v okamžiku spuštění; sloupec přidaný později je pro
-- anon/authenticated skrytý, dokud se mu nedá `grant select (sloupec)`.
-- `select *` z akce pod anon klíčem už nejde (42501), web ho tak nepoužívá.
--
-- Tabulky vlastní supabase_admin → spouštět jako supabase_admin.
-- POZOR (split-brain): aplikovat na self-hosted prod (supabase.samecdigital.com).

begin;

-- 1) newsletter_subscribers --------------------------------------------------
drop policy if exists "Anyone can subscribe" on public.newsletter_subscribers;
revoke all on public.newsletter_subscribers from anon;
revoke all on public.newsletter_subscribers from authenticated;
grant select, update on public.newsletter_subscribers to authenticated;

-- 2) bazar_saved_searches ----------------------------------------------------
revoke all on public.bazar_saved_searches from anon;
revoke all on public.bazar_saved_searches from authenticated;

-- 3) akce: bez e-mailu pořadatele a moderačních polí ---------------------------
revoke all on public.akce from anon;
revoke all on public.akce from authenticated;
do $$
declare
  cols text;
begin
  select string_agg(quote_ident(column_name), ', ' order by ordinal_position)
    into cols
    from information_schema.columns
   where table_schema = 'public'
     and table_name = 'akce'
     and column_name not in ('email', 'zamitnuti_duvod', 'moderoval', 'moderovano_at');
  execute format('grant select (%s) on public.akce to anon, authenticated', cols);
end
$$;

-- 4) bazar_extend_featured: jen server (service_role) -----------------------------
revoke execute on function public.bazar_extend_featured(uuid, integer, text)
  from public, anon, authenticated;

-- 5) user_profiles: politiky bez rekurze ---------------------------------------
-- SECURITY DEFINER funkce čte user_profiles mimo RLS, takže politika už
-- neodkazuje sama na sebe.
create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
      from public.user_profiles p
     where p.id = (select auth.uid())
       and p.role = 'admin'
  )
$$;

revoke execute on function public.is_admin_user() from public, anon;
grant execute on function public.is_admin_user() to authenticated;

drop policy if exists "Admin delete" on public.user_profiles;
drop policy if exists "Admin insert" on public.user_profiles;
drop policy if exists "Admin update" on public.user_profiles;

create policy "Admin delete" on public.user_profiles
  for delete using ((select public.is_admin_user()));
create policy "Admin insert" on public.user_profiles
  for insert with check ((select public.is_admin_user()));
create policy "Admin update" on public.user_profiles
  for update using ((select public.is_admin_user()));

commit;
