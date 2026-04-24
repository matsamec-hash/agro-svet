-- Extend bazar_users for fotosoutez: admin role + contest-specific display name

ALTER TABLE bazar_users
  ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS contest_display_name text,
  ADD COLUMN IF NOT EXISTS contest_opt_in_newsletter boolean NOT NULL DEFAULT false;

-- Admin lookup helper for RLS
CREATE INDEX IF NOT EXISTS idx_bazar_users_is_admin
  ON bazar_users(id) WHERE is_admin = true;
