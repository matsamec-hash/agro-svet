-- Bazar TOP inzeráty (topování) — admin-only v této fázi, platba přibude později
-- Idempotentní: bezpečné znovu spustit (IF NOT EXISTS).
-- Pozor: sdílený Supabase projekt (agro-svet + zenazije + content-network) — nijak nezasahuje do jiných tabulek.

ALTER TABLE bazar_listings
  ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS featured_until timestamptz,
  ADD COLUMN IF NOT EXISTS featured_plan text;

CREATE INDEX IF NOT EXISTS idx_bazar_listings_featured_active
  ON bazar_listings(featured_until DESC)
  WHERE featured = true;
