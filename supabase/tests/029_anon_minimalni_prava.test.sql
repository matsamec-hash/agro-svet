-- Test migrace 029_anon_minimalni_prava.sql. Spouští se přes scripts/migrace-nanecisto.mjs,
-- které ho pustí PŘED i PO migraci a nakonec vše vrátí ROLLBACKem.
-- Proměnná :faze je PRED / PO. Pomocné funkce pg_temp.expect / pg_temp.expect_val
-- vytváří skript. Nic se tu skutečně nezapisuje: zápisová práva se ověřují přes
-- has_*_privilege (TRUNCATE ani DELETE se na produkci nespouští ani v transakci).

-- ---------------------------------------------------------------- anon: smí číst veřejné věci
set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true) \g /dev/null

select pg_temp.expect(:'faze', 'anon', 'articles: veřejné sloupce (výpis webů)', $q$select id, site_id, title, slug, permalink, legacy_url, perex, content, seo_title, seo_description, featured_image_url, featured_image_credit, featured_image_alt, focal_point, category, tags, status, author_type, is_sponsored, published_at, created_at, featured, last_updated_at, tldr, faq_items, schema_type, evergreen, author_id, company_id, disable_ads from articles limit 1$q$, 'ok');
select pg_temp.expect(:'faze', 'anon', 'articles: filtr a řazení podle site_id/status/published_at', $q$select id from articles where site_id is not null and status = 'published' order by published_at desc limit 1$q$, 'ok');
select pg_temp.expect(:'faze', 'anon', 'articles + companies (embed jako CMS public API)', $q$select a.id, c.slug from articles a left join companies c on c.id = a.company_id limit 1$q$, 'ok');
select pg_temp.expect(:'faze', 'anon', 'article_translations (politika čte articles.id/status)', $q$select count(*) from article_translations$q$, 'ok');
select pg_temp.expect(:'faze', 'anon', 'images (kredity fotek)', $q$select url, provider, photographer_name, photographer_url, source_url, license, license_url from images limit 1$q$, 'ok');
select pg_temp.expect(:'faze', 'anon', 'redirects', $q$select from_url, to_url, code, source from redirects limit 1$q$, 'ok');
select pg_temp.expect(:'faze', 'anon', 'tag_metadata', $q$select count(*) from tag_metadata$q$, 'ok');
select pg_temp.expect(:'faze', 'anon', 'anketa_hlasy (výsledky anket)', $q$select option_id, votes from anketa_hlasy where poll_slug = 'x'$q$, 'ok');
select pg_temp.expect(:'faze', 'anon', 'companies', $q$select slug, name, summary, logo_url, website, links from companies limit 1$q$, 'ok');
select pg_temp.expect(:'faze', 'anon', 'people', $q$select slug, name, role, bio, photo_url, links from people limit 1$q$, 'ok');
select pg_temp.expect(:'faze', 'anon', 'interview_people', $q$select person_id from interview_people limit 1$q$, 'ok');
select pg_temp.expect(:'faze', 'anon', 'authors bez e-mailu', $q$select id, slug, name, bio, avatar_url from authors limit 1$q$, 'ok');
select pg_temp.expect(:'faze', 'anon', 'sites: veřejné sloupce', $q$select id, name, domain from sites limit 1$q$, 'ok');
select pg_temp.expect(:'faze', 'anon', 'akce: veřejné sloupce', $q$select id, nazev, slug from akce limit 1$q$, 'ok');
select pg_temp.expect(:'faze', 'anon', 'bazar_listings (výpis)', $q$select id, title, price, status from bazar_listings limit 1$q$, 'ok');
select pg_temp.expect(:'faze', 'anon', 'bazar_images (politika čte bazar_listings)', $q$select count(*) from bazar_images$q$, 'ok');

-- ---------------------------------------------------------------- anon: interní sloupce skryté
select pg_temp.expect(:'faze', 'anon', 'articles.ai_cost_usd skryté', $q$select ai_cost_usd from articles limit 1$q$, 'ERR 42501');
select pg_temp.expect(:'faze', 'anon', 'articles.ai_tokens_input skryté', $q$select ai_tokens_input from articles limit 1$q$, 'ERR 42501');
select pg_temp.expect(:'faze', 'anon', 'articles.ai_tokens_output skryté', $q$select ai_tokens_output from articles limit 1$q$, 'ERR 42501');
select pg_temp.expect(:'faze', 'anon', 'articles.sponsor_name skryté', $q$select sponsor_name from articles limit 1$q$, 'ERR 42501');
select pg_temp.expect(:'faze', 'anon', 'articles.affiliate_links skryté', $q$select affiliate_links from articles limit 1$q$, 'ERR 42501');
select pg_temp.expect(:'faze', 'anon', 'articles.auto_hold skryté', $q$select auto_hold from articles limit 1$q$, 'ERR 42501');
select pg_temp.expect(:'faze', 'anon', 'articles.scheduled_at skryté', $q$select scheduled_at from articles limit 1$q$, 'ERR 42501');
select pg_temp.expect(:'faze', 'anon', 'articles: select * už nejde', $q$select * from articles limit 1$q$, 'ERR 42501');
select pg_temp.expect(:'faze', 'anon', 'authors.email skryté', $q$select email from authors limit 1$q$, 'ERR 42501');
select pg_temp.expect(:'faze', 'anon', 'contest_entries.upload_ip skryté', $q$select upload_ip from contest_entries limit 1$q$, 'ERR 42501');
select pg_temp.expect(:'faze', 'anon', 'contest_entries.upload_user_agent skryté', $q$select upload_user_agent from contest_entries limit 1$q$, 'ERR 42501');
select pg_temp.expect(:'faze', 'anon', 'contest_entries.phash skryté', $q$select phash from contest_entries limit 1$q$, 'ERR 42501');
select pg_temp.expect(:'faze', 'anon', 'sites.deploy_hook_url skryté (už dřív)', $q$select deploy_hook_url from sites limit 1$q$, 'ERR 42501');
select pg_temp.expect(:'faze', 'anon', 'akce.email skryté (027)', $q$select email from akce limit 1$q$, 'ERR 42501');

-- ---------------------------------------------------------------- anon: tabulky bez přístupu
select pg_temp.expect(:'faze', 'anon', 'site_analytics_credentials zavřené', $q$select count(*) from site_analytics_credentials$q$, 'ERR 42501');
select pg_temp.expect(:'faze', 'anon', 'ai_usage_log zavřené', $q$select count(*) from ai_usage_log$q$, 'ERR 42501');
select pg_temp.expect(:'faze', 'anon', 'audit_log zavřené', $q$select count(*) from audit_log$q$, 'ERR 42501');
select pg_temp.expect(:'faze', 'anon', 'ai_insights zavřené', $q$select count(*) from ai_insights$q$, 'ERR 42501');
select pg_temp.expect(:'faze', 'anon', 'article_versions zavřené', $q$select count(*) from article_versions$q$, 'ERR 42501');
select pg_temp.expect(:'faze', 'anon', 'projects zavřené', $q$select count(*) from projects$q$, 'ERR 42501');
select pg_temp.expect(:'faze', 'anon', 'project_tasks zavřené', $q$select count(*) from project_tasks$q$, 'ERR 42501');
select pg_temp.expect(:'faze', 'anon', 'vps_heartbeat zavřené', $q$select count(*) from vps_heartbeat$q$, 'ERR 42501');
select pg_temp.expect(:'faze', 'anon', 'site_gsc_daily zavřené', $q$select count(*) from site_gsc_daily$q$, 'ERR 42501');
select pg_temp.expect(:'faze', 'anon', 'bazar_featured_orders zavřené', $q$select count(*) from bazar_featured_orders$q$, 'ERR 42501');
select pg_temp.expect(:'faze', 'anon', 'bazar_reports zavřené', $q$select count(*) from bazar_reports$q$, 'ERR 42501');
select pg_temp.expect(:'faze', 'anon', 'contest_votes zavřené', $q$select count(*) from contest_votes$q$, 'ERR 42501');
reset role;

-- ---------------------------------------------------------------- authenticated: dashboard CMS dál funguje
set local role authenticated;
select set_config('request.jwt.claims', '{"role":"authenticated"}', true) \g /dev/null
select pg_temp.expect(:'faze', 'authenticated', 'articles: select * (dashboard CMS pod JWT)', $q$select * from articles limit 1$q$, 'ok');
select pg_temp.expect(:'faze', 'authenticated', 'articles.ai_cost_usd (vědomě zůstává, viz hlavička migrace)', $q$select ai_cost_usd from articles limit 1$q$, 'ok');
select pg_temp.expect(:'faze', 'authenticated', 'site_gsc_daily (staff politika)', $q$select count(*) from site_gsc_daily$q$, 'ok');
select pg_temp.expect(:'faze', 'authenticated', 'newsletter_subscribers (staff politika)', $q$select count(*) from newsletter_subscribers$q$, 'ok');
select pg_temp.expect(:'faze', 'authenticated', 'bazar_listings', $q$select count(*) from bazar_listings$q$, 'ok');
select pg_temp.expect(:'faze', 'authenticated', 'projects zavřené', $q$select count(*) from projects$q$, 'ERR 42501');
select pg_temp.expect(:'faze', 'authenticated', 'akce_images zavřené', $q$select count(*) from akce_images$q$, 'ERR 42501');
select pg_temp.expect(:'faze', 'authenticated', 'bazar_reports zavřené', $q$select count(*) from bazar_reports$q$, 'ERR 42501');
select pg_temp.expect(:'faze', 'authenticated', 'bazar_code_attempts zavřené', $q$select count(*) from bazar_code_attempts$q$, 'ERR 42501');
reset role;

-- ---------------------------------------------------------------- service_role: server dál funguje
set local role service_role;
select set_config('request.jwt.claims', '{"role":"service_role"}', true) \g /dev/null
select pg_temp.expect(:'faze', 'service_role', 'articles: select *', $q$select * from articles limit 1$q$, 'ok');
select pg_temp.expect(:'faze', 'service_role', 'ai_usage_log', $q$select count(*) from ai_usage_log$q$, 'ok');
select pg_temp.expect(:'faze', 'service_role', 'bazar_reports', $q$select count(*) from bazar_reports$q$, 'ok');
select pg_temp.expect(:'faze', 'service_role', 'increment_listing_views()', $q$select increment_listing_views('00000000-0000-4000-8000-000000000000'::uuid)$q$, 'ok');
select pg_temp.expect(:'faze', 'service_role', 'anketa_vote() s platným slugem', $q$select * from anketa_vote('probe-hlasovani', 'volba-a')$q$, 'ok');
select pg_temp.expect(:'faze', 'service_role', 'anketa_vote() odmítne neplatný slug (22023)', $q$select * from anketa_vote('Spatny Slug!', 'volba-a')$q$, 'ERR 22023');
select pg_temp.expect(:'faze', 'service_role', 'anketa_vote() odmítne příliš dlouhou možnost (22023)', format($f$select * from anketa_vote('probe-hlasovani', %L)$f$, repeat('a', 80)), 'ERR 22023');
reset role;

-- ---------------------------------------------------------------- oprávnění k funkcím
select pg_temp.expect_val(:'faze', 'anon nesmí volat anketa_vote', $q$select has_function_privilege('anon', 'public.anketa_vote(text,text)', 'execute')::text$q$, 'false');
select pg_temp.expect_val(:'faze', 'authenticated nesmí volat anketa_vote', $q$select has_function_privilege('authenticated', 'public.anketa_vote(text,text)', 'execute')::text$q$, 'false');
select pg_temp.expect_val(:'faze', 'service_role smí volat anketa_vote', $q$select has_function_privilege('service_role', 'public.anketa_vote(text,text)', 'execute')::text$q$, 'true');
select pg_temp.expect_val(:'faze', 'anon nesmí volat increment_listing_views', $q$select has_function_privilege('anon', 'public.increment_listing_views(uuid)', 'execute')::text$q$, 'false');
select pg_temp.expect_val(:'faze', 'authenticated nesmí volat increment_listing_views', $q$select has_function_privilege('authenticated', 'public.increment_listing_views(uuid)', 'execute')::text$q$, 'false');
select pg_temp.expect_val(:'faze', 'service_role smí volat increment_listing_views', $q$select has_function_privilege('service_role', 'public.increment_listing_views(uuid)', 'execute')::text$q$, 'true');

-- ---------------------------------------------------------------- invarianty (hlídají i budoucí odchylky)
select pg_temp.expect_val(:'faze', 'anon nemá na žádné tabulce jiné právo než SELECT', $q$select count(*)::text from pg_class c join pg_namespace n on n.oid = c.relnamespace cross join lateral aclexplode(c.relacl) a join pg_roles r on r.oid = a.grantee where n.nspname = 'public' and c.relkind in ('r', 'p') and r.rolname = 'anon' and a.privilege_type <> 'SELECT'$q$, '0');
select pg_temp.expect_val(:'faze', 'anon má SELECT na celé tabulce jen u veřejných tabulek', $q$select coalesce(string_agg(c.relname::text, ',' order by c.relname), '') from pg_class c join pg_namespace n on n.oid = c.relnamespace cross join lateral aclexplode(c.relacl) a join pg_roles r on r.oid = a.grantee where n.nspname = 'public' and c.relkind in ('r', 'p') and r.rolname = 'anon' and a.privilege_type = 'SELECT'$q$, 'anketa_hlasy,article_translations,bazar_images,bazar_listings,companies,contest_finalists,contest_rounds,images,interview_people,people,redirects,tag_metadata');
select pg_temp.expect_val(:'faze', 'authenticated nemá TRUNCATE/REFERENCES/TRIGGER/MAINTAIN nikde', $q$select count(*)::text from pg_class c join pg_namespace n on n.oid = c.relnamespace cross join lateral aclexplode(c.relacl) a join pg_roles r on r.oid = a.grantee where n.nspname = 'public' and c.relkind in ('r', 'p') and r.rolname = 'authenticated' and a.privilege_type in ('TRUNCATE', 'REFERENCES', 'TRIGGER', 'MAINTAIN')$q$, '0');
select pg_temp.expect_val(:'faze', 'authenticated nemá nic na tabulkách jen pro server', $q$select count(*)::text from pg_class c join pg_namespace n on n.oid = c.relnamespace cross join lateral aclexplode(c.relacl) a join pg_roles r on r.oid = a.grantee where n.nspname = 'public' and r.rolname = 'authenticated' and c.relname in ('akce_images', 'bazar_code_attempts', 'bazar_invoice_counters', 'bazar_reports', 'bazar_seed_prospects', 'project_tasks', 'projects', 'vps_heartbeat')$q$, '0');
select pg_temp.expect_val(:'faze', 'každá tabulka v public má zapnuté RLS', $q$select count(*)::text from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relkind in ('r', 'p') and not c.relrowsecurity$q$, '0');
