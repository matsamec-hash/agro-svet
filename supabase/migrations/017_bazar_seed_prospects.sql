-- 017: Seeding & import — neveřejné drafty + claim prospekti

-- 1) Rozšíření listings o pre-claim stav
ALTER TABLE bazar_listings DROP CONSTRAINT bazar_listings_status_check;
ALTER TABLE bazar_listings
  ADD CONSTRAINT bazar_listings_status_check
  CHECK (status IN ('active', 'sold', 'expired', 'pending_claim'));

-- pre-claim draft nemá reálného uživatele
ALTER TABLE bazar_listings ALTER COLUMN user_id DROP NOT NULL;

-- 2) Prospekti
CREATE TABLE bazar_seed_prospects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  source_url text NOT NULL DEFAULT '',
  claim_token text NOT NULL UNIQUE,
  token_expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  channel text CHECK (channel IN ('email', 'whatsapp')),
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'sent', 'opened', 'confirmed', 'expired')),
  opened_at timestamptz,
  confirmed_at timestamptz,
  confirmed_ip text,
  terms_version text,
  user_id uuid REFERENCES bazar_users(id) ON DELETE SET NULL,
  created_by uuid REFERENCES bazar_users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_bazar_seed_prospects_token ON bazar_seed_prospects(claim_token);
CREATE INDEX idx_bazar_seed_prospects_status ON bazar_seed_prospects(status);

-- listing → prospekt
ALTER TABLE bazar_listings
  ADD COLUMN seed_prospect_id uuid REFERENCES bazar_seed_prospects(id) ON DELETE CASCADE;
CREATE INDEX idx_bazar_listings_seed_prospect ON bazar_listings(seed_prospect_id);

-- 3) RLS: prospekti jen pro service role (admin čte přes service role klienta)
ALTER TABLE bazar_seed_prospects ENABLE ROW LEVEL SECURITY;
-- žádná policy pro anon/authenticated → default deny; service role RLS obchází

-- 4) RLS listings: skryj pending_claim z anon/authenticated výpisů
DROP POLICY "bazar_listings_select" ON bazar_listings;
CREATE POLICY "bazar_listings_select" ON bazar_listings
  FOR SELECT USING (status <> 'pending_claim');
