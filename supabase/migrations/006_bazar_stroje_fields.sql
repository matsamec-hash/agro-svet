-- 006_bazar_stroje_fields.sql
-- Add new columns for stroje (non-tractor) listings:
--   subcategory      — konkrétní sub-kategorie z katalogu (např. 'pluhy', 'lisy-valcove')
--   nosnost_kg       — pro manipulátory, návěsy
--   objem_nadrze_l   — pro postřikovače, cisterny

ALTER TABLE bazar_listings
  ADD COLUMN IF NOT EXISTS subcategory TEXT,
  ADD COLUMN IF NOT EXISTS nosnost_kg INTEGER,
  ADD COLUMN IF NOT EXISTS objem_nadrze_l INTEGER;

CREATE INDEX IF NOT EXISTS idx_bazar_listings_subcategory ON bazar_listings(subcategory);
CREATE INDEX IF NOT EXISTS idx_bazar_listings_nosnost_kg ON bazar_listings(nosnost_kg);
CREATE INDEX IF NOT EXISTS idx_bazar_listings_objem_nadrze_l ON bazar_listings(objem_nadrze_l);
