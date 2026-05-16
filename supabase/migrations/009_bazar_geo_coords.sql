-- Add lat/lng + PSČ to bazar_listings for map view (/bazar/mapa/).
-- Geocoding happens at insert time (form does a fetch to /api/geocode)
-- and via the backfill script (scripts/bazar-geocode-backfill.mjs) for
-- legacy rows.
--
-- - latitude / longitude: WGS84 decimal degrees. NULL when geocoding
--   failed or the user typed an unrecognised free-text location.
-- - postal_code: optional Czech PSČ string ("123 45" or "12345"). When
--   present, geocoding prefers this over the city name (PSČ ranges are
--   unambiguous, city names can collide).
--
-- Idempotent: re-running ADD COLUMN IF NOT EXISTS is a no-op.

ALTER TABLE bazar_listings ADD COLUMN IF NOT EXISTS latitude double precision;
ALTER TABLE bazar_listings ADD COLUMN IF NOT EXISTS longitude double precision;
ALTER TABLE bazar_listings ADD COLUMN IF NOT EXISTS postal_code text;

-- Index supports the /bazar/mapa/ bbox query pattern:
--   WHERE latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ?
-- BRIN is cheap to maintain on insert-heavy tables and good enough for
-- the 100s–10Ks of listings we expect; switch to GIST(point) only if
-- bbox queries become a hot path.
CREATE INDEX IF NOT EXISTS idx_bazar_listings_latlng
  ON bazar_listings USING brin (latitude, longitude);

COMMENT ON COLUMN bazar_listings.latitude IS
  'WGS84 latitude; populated by geocoding pipeline. NULL = ungeocoded.';
COMMENT ON COLUMN bazar_listings.longitude IS
  'WGS84 longitude; populated by geocoding pipeline. NULL = ungeocoded.';
COMMENT ON COLUMN bazar_listings.postal_code IS
  'Optional Czech PSČ. Preferred geocoding input over free-text location.';
