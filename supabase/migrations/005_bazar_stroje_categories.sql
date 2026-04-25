-- 005_bazar_stroje_categories.sql
-- Rename existing bazar categories to align with stroje katalog functional groups.
--
-- Mapping:
--   seci-stroje    → seti           (širší: zahrnuje setí + sázečky)
--   postrikovace   → ochrana-rostlin (širší termín, zahrnuje všechny typy postřikovačů)
--   privezy        → doprava        (širší: zahrnuje cisterny, valníky, sklápěcí)
--
-- Idempotent: po prvním běhu UPDATE už neodpovídají žádné řádky → bezpečné spustit znovu.

UPDATE bazar_listings SET category = 'seti' WHERE category = 'seci-stroje';
UPDATE bazar_listings SET category = 'ochrana-rostlin' WHERE category = 'postrikovace';
UPDATE bazar_listings SET category = 'doprava' WHERE category = 'privezy';
