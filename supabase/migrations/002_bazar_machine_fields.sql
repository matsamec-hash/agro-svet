-- Extend bazar_listings with machine-specific fields linked to catalog (by slug, not FK — catalog is YAML)
-- Idempotent: safe to re-run after partial application.

ALTER TABLE bazar_listings ADD COLUMN IF NOT EXISTS model_slug text;
ALTER TABLE bazar_listings ADD COLUMN IF NOT EXISTS year_of_manufacture integer;
ALTER TABLE bazar_listings ADD COLUMN IF NOT EXISTS power_hp integer;
ALTER TABLE bazar_listings ADD COLUMN IF NOT EXISTS hours_operated integer;
ALTER TABLE bazar_listings ADD COLUMN IF NOT EXISTS cutting_width_m numeric(4,2);

CREATE INDEX IF NOT EXISTS idx_bazar_listings_model_slug ON bazar_listings(model_slug);
CREATE INDEX IF NOT EXISTS idx_bazar_listings_year ON bazar_listings(year_of_manufacture);
CREATE INDEX IF NOT EXISTS idx_bazar_listings_power ON bazar_listings(power_hp);
