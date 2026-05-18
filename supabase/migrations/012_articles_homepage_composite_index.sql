-- Articles: composite index for the homepage + /novinky/ feed query.
--
-- Hot query (agro-svet homepage, runs per cache miss):
--   SELECT ... FROM articles
--   WHERE site_id = $1 AND status = 'published'
--   ORDER BY featured DESC, published_at DESC
--   LIMIT 20;
--
-- Existing indexes:
--   - articles_site_id ON (site_id)
--   - articles_status ON (status)
--   - idx_articles_featured ON (site_id, featured, published_at DESC) WHERE featured=true
--
-- Existing indexes force the planner to either filter and sort (Bitmap scan +
-- Sort) or fall back to the partial featured index (covers only featured=true
-- rows). With a multi-site DB, a full composite index keyed for the WHERE +
-- ORDER BY of the hot path enables an index-only scan with no sort step.
--
-- DESC matches the ORDER BY direction so the planner can scan the index
-- forward and stop after LIMIT — no in-memory sort, no extra heap fetches
-- past the result window.
--
-- Sdílená DB: index je per-(site_id, status), takže nevytváří přetížení pro
-- ostatní sites v content-network.

CREATE INDEX IF NOT EXISTS idx_articles_site_status_featured_published
  ON articles (site_id, status, featured DESC, published_at DESC);
