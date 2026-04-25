-- Articles featured flag — pin to HP hero grid via ORDER BY featured DESC.
-- Sdílený Supabase projekt: featured je per-row, takže neovlivní zenazije ani content-network.
-- Idempotentní (IF NOT EXISTS).

ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_articles_featured
  ON articles(site_id, featured, published_at DESC)
  WHERE featured = true;
