-- Audit trail pro "Topovat inzerát" — každá žádost o featured placement
-- vytvoří 1 řádek. Stripe webhook později flipne status z 'pending' → 'paid'
-- a teprve potom se zavolá bazar_extend_featured() RPC.
--
-- Žádný unique constraint na (listing_id) — user může požádat o featured
-- víckrát (různé plány, nebo prodloužení).
--
-- Stripe pole jsou už tady, aby pozdější migrace nemusela rozšiřovat tabulku
-- a webhook měl kam zapsat session/payment intent / event id pro idempotenci.

CREATE TABLE IF NOT EXISTS bazar_featured_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES bazar_listings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES bazar_users(id) ON DELETE CASCADE,

  plan text NOT NULL CHECK (plan IN ('7d', '30d', '60d')),
  days integer NOT NULL CHECK (days > 0),
  price_czk integer NOT NULL CHECK (price_czk >= 0),

  -- 'pending' = vytvořeno, čeká platbu / admin schválení
  -- 'paid'    = potvrzeno (Stripe webhook nebo admin manual)
  -- 'free'    = pre-Stripe období, admin schválil bez platby
  -- 'failed'  = Stripe charge selhal
  -- 'refunded'= storno
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'free', 'failed', 'refunded')),

  -- Hodnota featured_until po aplikaci (audit — můžeme spočítat z plan + paid_at,
  -- ale snapshot je užitečný pokud později měníme business logic).
  featured_until_after timestamptz,

  -- Stripe artefakty (NULL dokud webhook nepřijde / pre-Stripe období)
  stripe_session_id text,
  stripe_payment_intent text,
  stripe_event_id text UNIQUE, -- defense in depth: webhook idempotence

  -- Optional comment from admin when manually approving / refunding
  admin_note text,

  created_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz,
  refunded_at timestamptz
);

-- Admin queue: "vše pending k schválení" + "vše dnes paid k vyúčtování".
CREATE INDEX IF NOT EXISTS idx_bazar_featured_orders_status_created
  ON bazar_featured_orders(status, created_at DESC);

-- User's own orders timeline ("moje žádosti o topování").
CREATE INDEX IF NOT EXISTS idx_bazar_featured_orders_user
  ON bazar_featured_orders(user_id, created_at DESC);

-- Listing-level reverse lookup (vidět všechny placements jednoho inzerátu).
CREATE INDEX IF NOT EXISTS idx_bazar_featured_orders_listing
  ON bazar_featured_orders(listing_id, created_at DESC);

COMMENT ON TABLE bazar_featured_orders IS
  'Audit trail pro Topovat inzerát. Status pending → paid/free aktivuje bazar_extend_featured.';
COMMENT ON COLUMN bazar_featured_orders.stripe_event_id IS
  'Unique pro webhook idempotenci. NULL během pre-Stripe období (status=free).';

-- RLS: user vidí jen své vlastní orders, admin vidí všechno.
ALTER TABLE bazar_featured_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS bazar_featured_orders_user_select ON bazar_featured_orders;
CREATE POLICY bazar_featured_orders_user_select ON bazar_featured_orders
  FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS bazar_featured_orders_user_insert ON bazar_featured_orders;
CREATE POLICY bazar_featured_orders_user_insert ON bazar_featured_orders
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM bazar_listings
      WHERE id = listing_id AND user_id = auth.uid()
    )
    AND status = 'pending'
  );

DROP POLICY IF EXISTS bazar_featured_orders_admin_all ON bazar_featured_orders;
CREATE POLICY bazar_featured_orders_admin_all ON bazar_featured_orders
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM bazar_users
      WHERE id = auth.uid() AND is_admin = true
    )
  );
