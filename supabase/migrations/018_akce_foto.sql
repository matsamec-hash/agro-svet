-- 018_akce_foto.sql
-- Fotka akce: sloupec s cestou do storage + veřejný bucket akce-images.
-- Uploady jdou přes service-role klíč (bypass RLS), pro čtení stačí public bucket.
--
-- POZOR (split-brain): produkce běží na self-hosted Supabase
-- (supabase.samecdigital.com) — tuto migraci je nutné aplikovat i tam ručně.

ALTER TABLE akce ADD COLUMN IF NOT EXISTS foto_path text;

-- Public bucket pro fotky akcí (idempotentně).
INSERT INTO storage.buckets (id, name, public)
VALUES ('akce-images', 'akce-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Veřejné čtení fotek (public bucket → getPublicUrl).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'akce_images_read'
  ) THEN
    CREATE POLICY "akce_images_read" ON storage.objects
      FOR SELECT USING (bucket_id = 'akce-images');
  END IF;
END$$;
