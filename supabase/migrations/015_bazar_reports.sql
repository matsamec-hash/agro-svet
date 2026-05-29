-- Bazar reports — notice-and-action mechanism for flagging illegal/violating listings.
--
-- Required by:
--   - DSA Art. 16 (Notice and action mechanisms)
--   - Bazar pravidla §4 "Hlášení závadného inzerátu"
--
-- Flow:
--   1. Anyone (auth or anon) submits a report from /bazar/nahlasit/?listing={id}
--   2. Rate-limited per IP (edgeThrottle: 3 reports / 15min).
--   3. Row inserted with status='new'. Service role processes it (mail, manual review).
--   4. Operator sets status='reviewed' / 'actioned' / 'dismissed' from Supabase studio
--      and optionally fills reviewer_note.

CREATE TABLE bazar_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES bazar_listings(id) ON DELETE SET NULL,
  -- Snapshot in case the listing gets deleted: keep enough to investigate.
  listing_url text NOT NULL,
  reason text NOT NULL CHECK (reason IN (
    'padelek',           -- counterfeit / fake originals
    'podvod',            -- fraud / scam
    'mlm-pujcky',        -- MLM, loans, pyramid
    'leciva-or',         -- drugs, plant protection without authorization
    'osiva-hnojiva',     -- seeds/fertilizers violating registry
    'zvirata-cites',     -- animals without vet cert / protected species
    'zbrane',            -- weapons / explosives
    'erotika-tabak',     -- erotic, tobacco, alcohol, drugs
    'autorska-prava',    -- copyright / trademark / personality rights
    'spam-duplicita',    -- spam, duplicate, misleading
    'nezakonny-obsah',   -- otherwise illegal content
    'jine'               -- other (require description)
  )),
  description text NOT NULL DEFAULT '',
  reporter_email text,
  reporter_ip_hash text,  -- sha-256 of IP, kept 90 days for repeat-offender detection
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'actioned', 'dismissed')),
  reviewer_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz
);

CREATE INDEX idx_bazar_reports_listing ON bazar_reports(listing_id);
CREATE INDEX idx_bazar_reports_status_created ON bazar_reports(status, created_at DESC);
CREATE INDEX idx_bazar_reports_ip_recent ON bazar_reports(reporter_ip_hash, created_at DESC);

-- RLS: insert via service role only (endpoint uses createServerClient).
-- No client-side reads/writes — moderation happens in Supabase studio.
ALTER TABLE bazar_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bazar_reports_no_anon_select" ON bazar_reports FOR SELECT USING (false);
CREATE POLICY "bazar_reports_no_anon_insert" ON bazar_reports FOR INSERT WITH CHECK (false);

COMMENT ON TABLE bazar_reports IS 'DSA Art. 16 notice-and-action queue for bazar listings. Insert via service role from /api/bazar/reports.';
