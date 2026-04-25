-- Atomic extend of bazar listing TOP/featured. Removes read-then-write race
-- when admin clicks "+30d" twice quickly: GREATEST(now(), featured_until)
-- happens inside the UPDATE so concurrent calls compound correctly.
-- Idempotent: CREATE OR REPLACE always installs the latest body.

CREATE OR REPLACE FUNCTION bazar_extend_featured(
  p_listing_id uuid,
  p_days integer,
  p_plan text
)
RETURNS TABLE (
  id uuid,
  featured boolean,
  featured_until timestamptz,
  featured_plan text
)
LANGUAGE sql
AS $$
  UPDATE bazar_listings
  SET
    featured = true,
    featured_plan = p_plan,
    featured_until = GREATEST(NOW(), COALESCE(featured_until, NOW())) + (p_days * interval '1 day')
  WHERE id = p_listing_id
  RETURNING id, featured, featured_until, featured_plan;
$$;
