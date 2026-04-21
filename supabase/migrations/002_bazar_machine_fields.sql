-- Extend bazar_listings with machine-specific fields linked to catalog (by slug, not FK — catalog is YAML)

ALTER TABLE bazar_listings ADD COLUMN model_slug text;
ALTER TABLE bazar_listings ADD COLUMN year_of_manufacture integer;
ALTER TABLE bazar_listings ADD COLUMN power_hp integer;
ALTER TABLE bazar_listings ADD COLUMN hours_operated integer;
ALTER TABLE bazar_listings ADD COLUMN cutting_width_m numeric(4,2);

CREATE INDEX idx_bazar_listings_model_slug ON bazar_listings(model_slug);
CREATE INDEX idx_bazar_listings_year ON bazar_listings(year_of_manufacture);
CREATE INDEX idx_bazar_listings_power ON bazar_listings(power_hp);
