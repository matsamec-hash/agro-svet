-- 019_akce_cena_galerie.sql
-- Cena akce (volný text) + galerie více fotek (tabulka akce_images).
-- akce.foto_path zůstává jako denormalizovaná PRIMÁRNÍ fotka (thumbnaily ve
-- výpisech + OG image); akce_images drží celou galerii (position 0 = primární).
--
-- POZOR (split-brain): aplikovat i na self-hosted prod (supabase.samecdigital.com).

ALTER TABLE akce ADD COLUMN IF NOT EXISTS cena text;

CREATE TABLE IF NOT EXISTS akce_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  akce_id uuid NOT NULL REFERENCES akce(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  position int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_akce_images_akce ON akce_images(akce_id, position);

-- Přenes existující jednotlivé fotky (foto_path) do galerie jako position 0,
-- ať se zobrazí i v novém galerijním zobrazení. Idempotentní.
INSERT INTO akce_images (akce_id, storage_path, position)
SELECT a.id, a.foto_path, 0
FROM akce a
WHERE a.foto_path IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM akce_images i WHERE i.akce_id = a.id);
