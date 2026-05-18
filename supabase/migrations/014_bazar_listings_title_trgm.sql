-- pg_trgm GIN index for bazar full-text search.
--
-- Hot query (bazar/index.astro):
--   SELECT ... FROM bazar_listings
--   WHERE status = 'active' AND title ILIKE '%query%'
--   ORDER BY featured DESC, created_at DESC
--   LIMIT 20;
--
-- Without an index, ILIKE '%X%' triggers a sequential scan over every row.
-- That's fine today (few hundred listings) but at 50 k+ listings every search
-- query starts to time out (Cloudflare Worker has ~10ms CPU budget, Supabase
-- statement_timeout is usually 8s).
--
-- pg_trgm + GIN handles `ILIKE '%X%'` natively — no application code changes,
-- the planner picks the index automatically when the query is selective
-- enough. Extension is additive (no side effects for other tables / sites
-- sharing this DB).
--
-- Sdílená DB: extension je DB-wide, ale index sahá jen na bazar_listings.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_bazar_listings_title_trgm
  ON bazar_listings
  USING GIN (title gin_trgm_ops);

COMMENT ON INDEX idx_bazar_listings_title_trgm
  IS 'Substring ILIKE search on title — supports ILIKE ''%query%'' patterns from bazar search input.';
