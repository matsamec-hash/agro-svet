-- 029_anon_minimalni_prava.sql
-- Externí audit samecdigital.com z 26. 11. 2026 (úkol 3cd90b1f). Veřejný anon klíč je
-- v kódu každého webu a self-hosted Supabase (supabase.samecdigital.com) ho nechala
-- číst a zapisovat skoro všude: jediná pojistka byla RLS. Ověřeno na produkci 26. 11. 2026:
--
-- 1) ~25 tabulek (ai_usage_log, audit_log, site_analytics_credentials, projects, ...) mělo
--    pro anon všechna práva, ač ji nepotřebuje žádný kód ani politika. Anon z nich dostával
--    jen prázdnou odpověď, protože RLS neměla pro jeho roli politiku.
-- 2) Čtecí tabulky (articles, images, redirects, ...) dávaly anonovi i INSERT / UPDATE /
--    DELETE / TRUNCATE. Zápis zastavovala jen RLS. TRUNCATE RLS nehlídá vůbec.
-- 3) articles vystavovala anonovi interní sloupce: ai_cost_usd, ai_tokens_*, sponsor_name,
--    affiliate_links, auto_hold, ... Stejně authors.email a contest_entries.upload_ip /
--    upload_user_agent / phash (tabulky jsou zatím prázdné, tak ať to tak i zůstane).
-- 4) anketa_vote() a increment_listing_views() šly volat anonymně přímo přes
--    /rest/v1/rpc/..., čímž se obešla cookie, bot filtr i throttle v API. Šlo nafukovat
--    hlasy a počítadlo zhlédnutí a plnit anketa_hlasy libovolnými řádky (funkce nehlídala
--    délku ani tvar slugu). Volá je jen server (src/pages/api/...), takže smí jen service_role.
-- 5) I role authenticated je prakticky veřejná (registrace bazaru je otevřená a sdílí
--    auth s CMS), takže jí patří stejná zásada: nic navíc. Tabulky, které čte a píše jen
--    server (service_role granty i RLS obchází), authenticated nepotřebuje.
--
-- ‼️ POŘADÍ NASAZENÍ: NEJDŘÍV kód (agro-svet: API anketa a bazar/views volají RPC přes
-- service_role klíč), POTOM tuto migraci. Obráceně by hlasování v anketě a počítadlo
-- zhlédnutí na produkci přestaly fungovat (42501), dokud se kód nenasadí.
--
-- Co se NEMĚNÍ (vědomě):
--  * authenticated si nechává SELECT na articles včetně interních sloupců: dashboard CMS
--    čte články pod JWT přihlášeného admina (`select *`). Sloupce se authenticated odebrat
--    nedají, dokud CMS nepřejde na service_role / RPC. Zbytkové riziko: kdokoli se
--    zaregistrovaným účtem v bazaru přečte u publikovaných článků ai_cost_usd, sponsor_name
--    a affiliate_links. Je to obchodní, ne osobní údaj.
--  * bazar_listings: anon čte phone a email u všech viditelných inzerátů (politika
--    `status <> 'pending_claim'`). Dnes 0 viditelných řádků (13 inzerátů, všechny skryté),
--    ale s prvním aktivním inzerátem půjdou kontakty stáhnout hromadně. Řeší samostatný úkol.
--  * Výchozí oprávnění nových tabulek (default privileges) zůstávají: nová tabulka vytvořená
--    v Studiu je dál pro anon plně otevřená, dokud ji migrace nezamkne.
--
-- Návrat jednotlivých kroků: `grant select on public.articles to anon;` (apod.), nebo
-- `grant execute on function ... to anon, authenticated;`.
--
-- Tabulky vlastní postgres i supabase_admin → spouštět jako supabase_admin.
-- POZOR (split-brain): aplikovat na self-hosted prod (supabase.samecdigital.com).
-- Test: scripts/migrace-nanecisto.mjs + supabase/tests/029_anon_minimalni_prava.test.sql
-- (zapíše se do transakce a vše vrátí ROLLBACKem).

begin;

-- 1) Tabulky, které anon nepotřebuje vůbec ---------------------------------------
revoke all on public.ai_insights                from anon;
revoke all on public.ai_task_queue              from anon;
revoke all on public.ai_usage_log               from anon;
revoke all on public.akce_images                from anon;
revoke all on public.article_versions           from anon;
revoke all on public.audit_log                  from anon;
revoke all on public.bazar_code_attempts        from anon;
revoke all on public.bazar_featured_orders      from anon;
revoke all on public.bazar_invoice_counters     from anon;
revoke all on public.bazar_reports              from anon;
revoke all on public.bazar_seed_prospects       from anon;
revoke all on public.contest_admin_log          from anon;
revoke all on public.contest_voters             from anon;
revoke all on public.contest_votes              from anon;
revoke all on public.pr_revenues                from anon;
revoke all on public.project_tasks              from anon;
revoke all on public.projects                   from anon;
revoke all on public.site_alerts                from anon;
revoke all on public.site_analytics_credentials from anon;
revoke all on public.site_cwv_daily             from anon;
revoke all on public.site_gsc_daily             from anon;
revoke all on public.site_metrics_daily         from anon;
revoke all on public.vps_heartbeat              from anon;

-- 2) Zápisová a správcovská práva pryč na VŠECH tabulkách schématu public -----------------
-- anon smí nanejvýš číst (SELECT, výjimky níž), authenticated navíc nepotřebuje TRUNCATE,
-- REFERENCES, TRIGGER (a od PostgreSQL 17 MAINTAIN, tj. i LOCK TABLE). PostgREST je nepoužívá,
-- TRUNCATE navíc obchází RLS. SELECT drží RLS politiky `*_public_read` / `Public read ...`.
-- Smyčka přes celé schéma (ne výčet), aby nic neuniklo. Sloupcové SELECT granty se nemění.
do $$
declare
  t record;
  navic text := case when current_setting('server_version_num')::int >= 170000 then ', maintain' else '' end;
begin
  for t in
    select c.relname
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
     where n.nspname = 'public' and c.relkind in ('r', 'p')
  loop
    execute format('revoke insert, update, delete, truncate, references, trigger%s on public.%I from anon', navic, t.relname);
    execute format('revoke truncate, references, trigger%s on public.%I from authenticated', navic, t.relname);
  end loop;
end
$$;

-- 3) Sloupcová oprávnění: anon vidí všechno kromě interních sloupců --------------------
-- Seznam povolených sloupců se skládá z tabulky v okamžiku spuštění. Sloupec přidaný
-- později je pro anon skrytý, dokud se mu nedá `grant select (sloupec) on ... to anon`.
-- `select *` pod anon klíčem na těchto třech tabulkách už nejde (42501). Ověřeno 26. 11. 2026:
-- žádný web ani CMS ho pod anon klíčem nepoužívá (CMS public API i agro-svet mají explicitní
-- seznamy sloupců, `select *` dělá jen dashboard CMS pod JWT admina a cron pod service_role).
-- Filtry a řazení (site_id, status, ...) potřebují SELECT na sloupci, proto jsou povolené.
do $$
declare
  t record;
  cols text;
begin
  for t in
    select * from (values
      ('articles',        array['ai_tokens_input', 'ai_tokens_output', 'ai_cost_usd', 'sponsor_name',
                                'affiliate_links', 'auto_hold', 'hold_cancelled_at', 'scheduled_at',
                                'focus_keyword', 'suggested_links']),
      ('authors',         array['email']),
      ('contest_entries', array['upload_ip', 'upload_user_agent', 'phash', 'exif_has_metadata',
                                'moderated_by', 'moderated_at', 'rejection_reason', 'metadata'])
    ) as v(tabulka, skryte)
  loop
    execute format('revoke select on public.%I from anon', t.tabulka);
    select string_agg(quote_ident(column_name), ', ' order by ordinal_position)
      into cols
      from information_schema.columns
     where table_schema = 'public'
       and table_name = t.tabulka
       and column_name <> all (t.skryte);
    execute format('grant select (%s) on public.%I to anon', cols, t.tabulka);
  end loop;
end
$$;

-- 4) Funkce: jen server --------------------------------------------------------------
-- anketa_vote: totéž tělo jako v 023 + kontrola tvaru slugu a možnosti (stejný regex jako
-- SLUG_RE v src/pages/api/anketa/[slug].ts), aby nešlo plnit tabulku junk řádky.
-- CREATE OR REPLACE zachová vlastníka i granty, ty se přenastavují níž.
create or replace function public.anketa_vote(p_slug text, p_option text)
returns table (option_id text, votes integer)
language plpgsql
security definer
set search_path = public
as $$
#variable_conflict use_column
begin
  if p_slug is null or p_option is null
     or p_slug !~ '^[a-z0-9][a-z0-9-]{0,48}$'
     or p_option !~ '^[a-z0-9][a-z0-9-]{0,48}$' then
    raise exception 'neplatná anketa nebo možnost' using errcode = '22023';
  end if;

  insert into anketa_hlasy (poll_slug, option_id, votes)
  values (p_slug, p_option, 1)
  on conflict (poll_slug, option_id)
  do update set votes = anketa_hlasy.votes + 1, updated_at = now();

  return query
    select h.option_id, h.votes
    from anketa_hlasy h
    where h.poll_slug = p_slug
    order by h.option_id;
end;
$$;

revoke execute on function public.anketa_vote(text, text)         from public, anon, authenticated;
grant  execute on function public.anketa_vote(text, text)         to service_role;
revoke execute on function public.increment_listing_views(uuid)   from public, anon, authenticated;
grant  execute on function public.increment_listing_views(uuid)   to service_role;

-- 5) authenticated: tabulky jen pro server ----------------------------------------------
-- (TRUNCATE / REFERENCES / TRIGGER řeší smyčka v sekci 2.)
-- Tabulky bez jediné politiky pro authenticated (jen service_role): RLS je odmítá
-- a grant je zbytečný. Tyhle tabulky čte a píše výhradně server.
revoke all on public.akce_images            from authenticated;
revoke all on public.bazar_code_attempts    from authenticated;
revoke all on public.bazar_invoice_counters from authenticated;
revoke all on public.bazar_reports          from authenticated;
revoke all on public.bazar_seed_prospects   from authenticated;
revoke all on public.project_tasks          from authenticated;
revoke all on public.projects               from authenticated;
revoke all on public.vps_heartbeat          from authenticated;

commit;
