-- Notify-me saved searches — user si uloží filtr, dostává e-mail digest
-- nově publikovaných bazar_listings, které matchnou.
--
-- Pipeline:
-- 1. User otevře /bazar/ s filtry → klikne "Sledovat tento filtr"
-- 2. POST /api/bazar/saved-searches/create → insert row se statusem 'active'
-- 3. Cron 1×/den (scripts/send-saved-search-digests.mjs) pulluje active rows,
--    pro každý filtr najde nové listings od last_notified_at, pošle e-mail
--    přes Resend a updatuje last_notified_at.
-- 4. V e-mailu unsubscribe link → endpoint flipne status='unsubscribed'.

CREATE TABLE IF NOT EXISTS bazar_saved_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User_id je optional — chceme i ne-registrované (jen e-mail).
  user_id uuid REFERENCES bazar_users(id) ON DELETE CASCADE,
  email text NOT NULL,

  -- Lidsky čitelný popis filtru — UI ho zobrazí v listingu i v e-mailu.
  -- Příklad: "Zetor Forterra do 500K v Jihočeském kraji".
  label text NOT NULL,

  -- Filtr jako JSONB. Free-form, ale UI obvykle zapisuje:
  -- { query, category, brand, location, priceFrom, priceTo, yearFrom, yearTo,
  --   powerFrom, powerTo, krajSlug, latBboxMin, latBboxMax, lngBboxMin, lngBboxMax }
  filter jsonb NOT NULL DEFAULT '{}'::jsonb,

  -- 'active' = posílá se digest; 'unsubscribed' = user opustil; 'paused' = admin
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'unsubscribed', 'paused')),

  -- Frekvence digestu — pro V1 podporujeme jen 'daily'. 'weekly' / 'instant'
  -- nechány na později.
  frequency text NOT NULL DEFAULT 'daily'
    CHECK (frequency IN ('instant', 'daily', 'weekly')),

  -- Token pro one-click unsubscribe v e-mailu.
  unsubscribe_token text NOT NULL DEFAULT encode(gen_random_bytes(24), 'hex'),

  -- Confirmation flow — bez confirmace nepošleme nic (anti-spam).
  confirmed boolean NOT NULL DEFAULT false,
  confirmation_token text NOT NULL DEFAULT encode(gen_random_bytes(24), 'hex'),

  -- Audit
  created_at timestamptz NOT NULL DEFAULT now(),
  last_notified_at timestamptz,
  unsubscribed_at timestamptz,
  notification_count integer NOT NULL DEFAULT 0
);

-- Cron query: vše active, confirmed, frekvence daily, ne poslán dnes.
CREATE INDEX IF NOT EXISTS idx_bazar_saved_searches_active
  ON bazar_saved_searches(status, frequency, last_notified_at)
  WHERE status = 'active' AND confirmed = true;

-- User si vidí své vlastní saved searches.
CREATE INDEX IF NOT EXISTS idx_bazar_saved_searches_user
  ON bazar_saved_searches(user_id, created_at DESC)
  WHERE user_id IS NOT NULL;

-- Unsubscribe lookup
CREATE UNIQUE INDEX IF NOT EXISTS idx_bazar_saved_searches_unsub_token
  ON bazar_saved_searches(unsubscribe_token);

-- Confirm lookup
CREATE UNIQUE INDEX IF NOT EXISTS idx_bazar_saved_searches_confirm_token
  ON bazar_saved_searches(confirmation_token);

-- Email-level rate limit (zamezit, aby jeden e-mail nasypal 100 filtrů).
CREATE INDEX IF NOT EXISTS idx_bazar_saved_searches_email
  ON bazar_saved_searches(email);

ALTER TABLE bazar_saved_searches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS bazar_saved_searches_user_select ON bazar_saved_searches;
CREATE POLICY bazar_saved_searches_user_select ON bazar_saved_searches
  FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS bazar_saved_searches_user_insert ON bazar_saved_searches;
CREATE POLICY bazar_saved_searches_user_insert ON bazar_saved_searches
  FOR INSERT
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

DROP POLICY IF EXISTS bazar_saved_searches_user_update ON bazar_saved_searches;
CREATE POLICY bazar_saved_searches_user_update ON bazar_saved_searches
  FOR UPDATE
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS bazar_saved_searches_user_delete ON bazar_saved_searches;
CREATE POLICY bazar_saved_searches_user_delete ON bazar_saved_searches
  FOR DELETE
  USING (user_id = auth.uid());

COMMENT ON TABLE bazar_saved_searches IS
  'Uložené filtry pro e-mailové notifikace nových bazar inzerátů. Cron 1×/den.';
