-- ============================================================================
-- Fotosoutěž — nasazení na self-host Supabase (supabase.samecdigital.com)
-- ----------------------------------------------------------------------------
-- Idempotentní bundle: schéma (contest_*), rozšíření bazar_users, storage
-- bucket `contest-photos` + RLS a upsert prázdninového kola `leto-2026`
-- na okno 1. 8. – 31. 8. 2026.
--
-- Bezpečné spustit opakovaně (IF NOT EXISTS / DROP POLICY IF EXISTS / ON CONFLICT).
-- PŘEDPOKLAD: tabulka `bazar_users` už na cílové DB existuje (auth bazaru).
-- Pokud NE, nejdřív aplikuj 001_bazar_schema.sql.
--
-- Spuštění: Supabase Studio SQL editor cílového projektu, NEBO psql přes
-- service-role. ⚠️ Ověř, že jde o TU DB, ze které web reálně čte (viz runbook).
-- ============================================================================

-- ========== 004: rozšíření bazar_users (admin role + contest pole) ==========
ALTER TABLE bazar_users
  ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS contest_display_name text,
  ADD COLUMN IF NOT EXISTS contest_opt_in_newsletter boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_bazar_users_is_admin
  ON bazar_users(id) WHERE is_admin = true;

-- ========== 003: contest schéma ==========
CREATE TABLE IF NOT EXISTS contest_rounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  theme text NOT NULL,
  description text NOT NULL DEFAULT '',
  hero_image text,
  year integer NOT NULL,
  month integer,
  is_final boolean NOT NULL DEFAULT false,
  upload_starts_at timestamptz NOT NULL,
  upload_ends_at timestamptz NOT NULL,
  voting_starts_at timestamptz NOT NULL,
  voting_ends_at timestamptz NOT NULL,
  announcement_at timestamptz NOT NULL,
  prize_first text NOT NULL DEFAULT '',
  prize_second text,
  prize_third text,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','published','upload_open','voting_open','closed','announced')),
  winner_entry_id uuid,
  runner_up_entry_id uuid,
  third_place_entry_id uuid,
  required_fields jsonb NOT NULL DEFAULT '[]'::jsonb,
  optional_fields jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_contest_rounds_status ON contest_rounds(status);
CREATE INDEX IF NOT EXISTS idx_contest_rounds_year ON contest_rounds(year DESC);

CREATE TABLE IF NOT EXISTS contest_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id uuid NOT NULL REFERENCES contest_rounds(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES bazar_users(id) ON DELETE CASCADE,
  photo_path text NOT NULL,
  photo_width integer NOT NULL,
  photo_height integer NOT NULL,
  title text NOT NULL,
  caption text,
  author_display_name text NOT NULL,
  author_location text,
  brand_slug text,
  model_slug text,
  series_slug text,
  location_kraj_slug text,
  location_okres_slug text,
  year_taken integer,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','approved','rejected','disqualified')),
  rejection_reason text,
  moderated_by uuid,
  moderated_at timestamptz,
  exif_has_metadata boolean NOT NULL DEFAULT false,
  phash text,
  upload_ip inet,
  upload_user_agent text,
  vote_count integer NOT NULL DEFAULT 0,
  last_vote_at timestamptz,
  license_merch_print boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_contest_entries_round ON contest_entries(round_id);
CREATE INDEX IF NOT EXISTS idx_contest_entries_user ON contest_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_contest_entries_status ON contest_entries(status);
CREATE INDEX IF NOT EXISTS idx_contest_entries_votes
  ON contest_entries(round_id, vote_count DESC) WHERE status = 'approved';
CREATE INDEX IF NOT EXISTS idx_contest_entries_brand
  ON contest_entries(brand_slug) WHERE brand_slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_contest_entries_kraj
  ON contest_entries(location_kraj_slug) WHERE location_kraj_slug IS NOT NULL;

CREATE TABLE IF NOT EXISTS contest_voters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id uuid NOT NULL REFERENCES contest_rounds(id) ON DELETE CASCADE,
  email text NOT NULL,
  email_verified boolean NOT NULL DEFAULT false,
  verification_token text,
  verification_sent_at timestamptz,
  verified_at timestamptz,
  cookie_id uuid NOT NULL DEFAULT gen_random_uuid(),
  first_ip inet,
  first_user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_contest_voters_round_email ON contest_voters(round_id, email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_contest_voters_cookie ON contest_voters(cookie_id);
CREATE INDEX IF NOT EXISTS idx_contest_voters_token
  ON contest_voters(verification_token) WHERE email_verified = false;

CREATE TABLE IF NOT EXISTS contest_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id uuid NOT NULL REFERENCES contest_entries(id) ON DELETE CASCADE,
  voter_id uuid NOT NULL REFERENCES contest_voters(id) ON DELETE CASCADE,
  voted_at timestamptz NOT NULL DEFAULT now(),
  ip inet NOT NULL,
  user_agent text,
  is_valid boolean NOT NULL DEFAULT true
);
CREATE INDEX IF NOT EXISTS idx_contest_votes_entry ON contest_votes(entry_id);
CREATE INDEX IF NOT EXISTS idx_contest_votes_voter ON contest_votes(voter_id, voted_at DESC);
CREATE INDEX IF NOT EXISTS idx_contest_votes_ip_date ON contest_votes(ip, voted_at DESC);

CREATE TABLE IF NOT EXISTS contest_finalists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year integer NOT NULL,
  source_round_id uuid NOT NULL REFERENCES contest_rounds(id),
  entry_id uuid NOT NULL REFERENCES contest_entries(id),
  placement integer NOT NULL CHECK (placement IN (1,2,3)),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_contest_finalists_entry ON contest_finalists(entry_id);
CREATE INDEX IF NOT EXISTS idx_contest_finalists_year ON contest_finalists(year);

CREATE TABLE IF NOT EXISTS contest_admin_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid NOT NULL,
  action text NOT NULL,
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_contest_admin_log_admin ON contest_admin_log(admin_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contest_admin_log_target ON contest_admin_log(target_type, target_id);

-- ========== Triggery (hlasy → vote_count) ==========
CREATE OR REPLACE FUNCTION contest_vote_increment() RETURNS trigger AS $$
BEGIN
  IF NEW.is_valid THEN
    UPDATE contest_entries
       SET vote_count = vote_count + 1, last_vote_at = NEW.voted_at
     WHERE id = NEW.entry_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS contest_vote_increment_trigger ON contest_votes;
CREATE TRIGGER contest_vote_increment_trigger
AFTER INSERT ON contest_votes
FOR EACH ROW EXECUTE FUNCTION contest_vote_increment();

CREATE OR REPLACE FUNCTION contest_vote_invalidate() RETURNS trigger AS $$
BEGIN
  IF OLD.is_valid = true AND NEW.is_valid = false THEN
    UPDATE contest_entries
       SET vote_count = GREATEST(0, vote_count - 1)
     WHERE id = NEW.entry_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS contest_vote_invalidate_trigger ON contest_votes;
CREATE TRIGGER contest_vote_invalidate_trigger
AFTER UPDATE ON contest_votes
FOR EACH ROW EXECUTE FUNCTION contest_vote_invalidate();

-- ========== RLS na contest_* ==========
ALTER TABLE contest_rounds    ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_entries   ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_voters    ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_votes     ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_finalists ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_admin_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "contest_rounds_select_public" ON contest_rounds;
CREATE POLICY "contest_rounds_select_public" ON contest_rounds FOR SELECT
  USING (status != 'draft'
    OR EXISTS (SELECT 1 FROM bazar_users WHERE id = auth.uid() AND is_admin = true));
DROP POLICY IF EXISTS "contest_rounds_write_admin" ON contest_rounds;
CREATE POLICY "contest_rounds_write_admin" ON contest_rounds FOR ALL
  USING (EXISTS (SELECT 1 FROM bazar_users WHERE id = auth.uid() AND is_admin = true));

DROP POLICY IF EXISTS "contest_entries_select" ON contest_entries;
CREATE POLICY "contest_entries_select" ON contest_entries FOR SELECT USING (
  status = 'approved' OR auth.uid() = user_id
  OR EXISTS (SELECT 1 FROM bazar_users WHERE id = auth.uid() AND is_admin = true));
DROP POLICY IF EXISTS "contest_entries_insert_owner" ON contest_entries;
CREATE POLICY "contest_entries_insert_owner" ON contest_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "contest_entries_update_owner_pending" ON contest_entries;
CREATE POLICY "contest_entries_update_owner_pending" ON contest_entries FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');
DROP POLICY IF EXISTS "contest_entries_update_admin" ON contest_entries;
CREATE POLICY "contest_entries_update_admin" ON contest_entries FOR UPDATE
  USING (EXISTS (SELECT 1 FROM bazar_users WHERE id = auth.uid() AND is_admin = true));
DROP POLICY IF EXISTS "contest_entries_delete_admin" ON contest_entries;
CREATE POLICY "contest_entries_delete_admin" ON contest_entries FOR DELETE
  USING (EXISTS (SELECT 1 FROM bazar_users WHERE id = auth.uid() AND is_admin = true));

DROP POLICY IF EXISTS "contest_voters_admin_select" ON contest_voters;
CREATE POLICY "contest_voters_admin_select" ON contest_voters FOR SELECT
  USING (EXISTS (SELECT 1 FROM bazar_users WHERE id = auth.uid() AND is_admin = true));
DROP POLICY IF EXISTS "contest_votes_admin_select" ON contest_votes;
CREATE POLICY "contest_votes_admin_select" ON contest_votes FOR SELECT
  USING (EXISTS (SELECT 1 FROM bazar_users WHERE id = auth.uid() AND is_admin = true));

DROP POLICY IF EXISTS "contest_finalists_select" ON contest_finalists;
CREATE POLICY "contest_finalists_select" ON contest_finalists FOR SELECT USING (true);
DROP POLICY IF EXISTS "contest_finalists_write_admin" ON contest_finalists;
CREATE POLICY "contest_finalists_write_admin" ON contest_finalists FOR ALL
  USING (EXISTS (SELECT 1 FROM bazar_users WHERE id = auth.uid() AND is_admin = true));

DROP POLICY IF EXISTS "contest_admin_log_admin" ON contest_admin_log;
CREATE POLICY "contest_admin_log_admin" ON contest_admin_log FOR ALL
  USING (EXISTS (SELECT 1 FROM bazar_users WHERE id = auth.uid() AND is_admin = true));

-- ========== Storage bucket `contest-photos` + RLS ==========
INSERT INTO storage.buckets (id, name, public)
VALUES ('contest-photos', 'contest-photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- INSERT: přihlášený uživatel smí nahrávat do bucketu (upload přes service key
-- v API to nepotřebuje, ale ponecháme pro symetrii s původním návrhem)
DROP POLICY IF EXISTS "contest_photos_insert_auth" ON storage.objects;
CREATE POLICY "contest_photos_insert_auth" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'contest-photos');
-- SELECT: veřejné čtení (bucket je public, ale explicitní policy pro jistotu)
DROP POLICY IF EXISTS "contest_photos_select_public" ON storage.objects;
CREATE POLICY "contest_photos_select_public" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'contest-photos');
-- DELETE: jen admin
DROP POLICY IF EXISTS "contest_photos_delete_admin" ON storage.objects;
CREATE POLICY "contest_photos_delete_admin" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'contest-photos'
    AND EXISTS (SELECT 1 FROM bazar_users WHERE id = auth.uid() AND is_admin = true));

-- ========== Kolo `leto-2026` — okno 1. 8. – 31. 8. 2026 ==========
-- Souběžný režim (upload + hlasování celý srpen). Status `voting_open` je
-- selektor pro getActiveRound; reálné povolení řídí časová okna (fáze `live`).
-- Dnešní datum < 1. 8. → fáze `upcoming` („brzy začne"), sama se otevře 1. 8.
INSERT INTO contest_rounds (
  slug, title, theme, description, year, month, is_final,
  upload_starts_at, upload_ends_at, voting_starts_at, voting_ends_at, announcement_at,
  prize_first, prize_second, prize_third, status, optional_fields, required_fields
) VALUES (
  'leto-2026',
  'Prázdninová fotosoutěž 2026',
  'Zemědělská technika o prázdninách',
  'Vyfoťte techniku v akci během léta. Celé prázdniny nahrávejte i hlasujte — jeden vítěz získá hlavní cenu 5 000 Kč.',
  2026, NULL, false,
  '2026-08-01T00:00:00+02'::timestamptz,
  '2026-08-31T23:59:59+02'::timestamptz,
  '2026-08-01T00:00:00+02'::timestamptz,
  '2026-08-31T23:59:59+02'::timestamptz,
  '2026-09-01T12:00:00+02'::timestamptz,
  '5 000 Kč', NULL, NULL, 'voting_open', '[]'::jsonb, '[]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  upload_starts_at = EXCLUDED.upload_starts_at,
  upload_ends_at   = EXCLUDED.upload_ends_at,
  voting_starts_at = EXCLUDED.voting_starts_at,
  voting_ends_at   = EXCLUDED.voting_ends_at,
  announcement_at  = EXCLUDED.announcement_at,
  prize_first      = EXCLUDED.prize_first,
  status           = EXCLUDED.status,
  updated_at       = now();

-- ========== Kontrolní výpis ==========
SELECT slug, status, upload_starts_at, voting_ends_at, prize_first FROM contest_rounds WHERE slug = 'leto-2026';
