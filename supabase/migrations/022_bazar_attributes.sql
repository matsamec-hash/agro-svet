-- 022: Strukturované atributy inzerátů (per-kategorie výbava) — JSONB bag.
-- Klíč = slug atributu ze slovníku bazar-attributes.ts, hodnota = true|string|number.
ALTER TABLE bazar_listings
  ADD COLUMN IF NOT EXISTS attributes jsonb NOT NULL DEFAULT '{}';

-- GIN index pro filtrování podle atributů (attributes->>'klimatizace' = 'true', apod.)
CREATE INDEX IF NOT EXISTS idx_bazar_listings_attributes
  ON bazar_listings USING gin (attributes);
