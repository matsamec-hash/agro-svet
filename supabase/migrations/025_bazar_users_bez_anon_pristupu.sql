-- 025: bazar_users jen přes service_role (bezpečnostní audit 22. 10. 2026)
--
-- Politika bazar_users_select je USING (true) a anon i authenticated měly
-- na tabulce všechna práva → kdokoli s veřejným anon klíčem četl e-maily
-- a telefony a přihlášený uživatel si mohl sám nastavit is_admin = true
-- (bazar_users_update nehlídá sloupce).
--
-- Web čte i zapisuje bazar_users výhradně na serveru přes service_role
-- (createServerClient), který granty i RLS obchází. Anon/authenticated
-- přístup nepotřebuje nikdo. Nasazeno na produkci (supabase.samecdigital.com)
-- ručně 22. 10. 2026, ověřeno: anon dostane 42501.
--
-- bazar_invoice_counters už RLS má a bazar_next_invoice_number / bazar_next_vs
-- smí volat jen service_role — beze změny.

revoke all on public.bazar_users from anon;
revoke all on public.bazar_users from authenticated;
