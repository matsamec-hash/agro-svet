-- Fotosoutez Agro-svet — schema (shared Supabase project, prefix `contest_`)

-- ========== contest_rounds ==========
CREATE TABLE contest_rounds (
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

CREATE INDEX idx_contest_rounds_status ON contest_rounds(status);
CREATE INDEX idx_contest_rounds_year ON contest_rounds(year DESC);

-- ========== contest_entries ==========
CREATE TABLE contest_entries (
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

CREATE INDEX idx_contest_entries_round ON contest_entries(round_id);
CREATE INDEX idx_contest_entries_user ON contest_entries(user_id);
CREATE INDEX idx_contest_entries_status ON contest_entries(status);
CREATE INDEX idx_contest_entries_votes
  ON contest_entries(round_id, vote_count DESC)
  WHERE status = 'approved';
CREATE INDEX idx_contest_entries_brand
  ON contest_entries(brand_slug)
  WHERE brand_slug IS NOT NULL;
CREATE INDEX idx_contest_entries_kraj
  ON contest_entries(location_kraj_slug)
  WHERE location_kraj_slug IS NOT NULL;

-- ========== contest_voters ==========
CREATE TABLE contest_voters (
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

CREATE UNIQUE INDEX idx_contest_voters_round_email ON contest_voters(round_id, email);
CREATE UNIQUE INDEX idx_contest_voters_cookie ON contest_voters(cookie_id);
CREATE INDEX idx_contest_voters_token
  ON contest_voters(verification_token)
  WHERE email_verified = false;

-- ========== contest_votes ==========
CREATE TABLE contest_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id uuid NOT NULL REFERENCES contest_entries(id) ON DELETE CASCADE,
  voter_id uuid NOT NULL REFERENCES contest_voters(id) ON DELETE CASCADE,
  voted_at timestamptz NOT NULL DEFAULT now(),
  ip inet NOT NULL,
  user_agent text,
  is_valid boolean NOT NULL DEFAULT true
);

CREATE INDEX idx_contest_votes_entry ON contest_votes(entry_id);
CREATE INDEX idx_contest_votes_voter ON contest_votes(voter_id, voted_at DESC);
CREATE INDEX idx_contest_votes_ip_date ON contest_votes(ip, voted_at DESC);

-- ========== contest_finalists ==========
CREATE TABLE contest_finalists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year integer NOT NULL,
  source_round_id uuid NOT NULL REFERENCES contest_rounds(id),
  entry_id uuid NOT NULL REFERENCES contest_entries(id),
  placement integer NOT NULL CHECK (placement IN (1,2,3)),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_contest_finalists_entry ON contest_finalists(entry_id);
CREATE INDEX idx_contest_finalists_year ON contest_finalists(year);

-- ========== contest_admin_log ==========
CREATE TABLE contest_admin_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid NOT NULL,
  action text NOT NULL,
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_contest_admin_log_admin ON contest_admin_log(admin_user_id, created_at DESC);
CREATE INDEX idx_contest_admin_log_target ON contest_admin_log(target_type, target_id);

-- ========== Triggers ==========
CREATE OR REPLACE FUNCTION contest_vote_increment() RETURNS trigger AS $$
BEGIN
  IF NEW.is_valid THEN
    UPDATE contest_entries
       SET vote_count = vote_count + 1,
           last_vote_at = NEW.voted_at
     WHERE id = NEW.entry_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

CREATE TRIGGER contest_vote_invalidate_trigger
AFTER UPDATE ON contest_votes
FOR EACH ROW EXECUTE FUNCTION contest_vote_invalidate();

-- ========== RLS ==========
ALTER TABLE contest_rounds  ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_voters  ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_votes   ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_finalists ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_admin_log ENABLE ROW LEVEL SECURITY;

-- rounds: public reads non-draft, admin sees all; admin writes
CREATE POLICY "contest_rounds_select_public" ON contest_rounds FOR SELECT
  USING (status != 'draft'
    OR EXISTS (SELECT 1 FROM bazar_users WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "contest_rounds_write_admin" ON contest_rounds FOR ALL
  USING (EXISTS (SELECT 1 FROM bazar_users WHERE id = auth.uid() AND is_admin = true));

-- entries: public reads approved, user reads own, admin reads all
CREATE POLICY "contest_entries_select" ON contest_entries FOR SELECT USING (
  status = 'approved'
  OR auth.uid() = user_id
  OR EXISTS (SELECT 1 FROM bazar_users WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "contest_entries_insert_owner" ON contest_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "contest_entries_update_owner_pending" ON contest_entries FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');
CREATE POLICY "contest_entries_update_admin" ON contest_entries FOR UPDATE
  USING (EXISTS (SELECT 1 FROM bazar_users WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "contest_entries_delete_admin" ON contest_entries FOR DELETE
  USING (EXISTS (SELECT 1 FROM bazar_users WHERE id = auth.uid() AND is_admin = true));

-- voters + votes: service role writes via API
CREATE POLICY "contest_voters_admin_select" ON contest_voters FOR SELECT
  USING (EXISTS (SELECT 1 FROM bazar_users WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "contest_votes_admin_select" ON contest_votes FOR SELECT
  USING (EXISTS (SELECT 1 FROM bazar_users WHERE id = auth.uid() AND is_admin = true));

-- finalists: public reads all, admin writes
CREATE POLICY "contest_finalists_select" ON contest_finalists FOR SELECT USING (true);
CREATE POLICY "contest_finalists_write_admin" ON contest_finalists FOR ALL
  USING (EXISTS (SELECT 1 FROM bazar_users WHERE id = auth.uid() AND is_admin = true));

-- admin_log: admin-only
CREATE POLICY "contest_admin_log_admin" ON contest_admin_log FOR ALL
  USING (EXISTS (SELECT 1 FROM bazar_users WHERE id = auth.uid() AND is_admin = true));
