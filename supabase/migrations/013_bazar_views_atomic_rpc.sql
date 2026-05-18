-- Atomic, race-condition-free views increment for bazar listings.
--
-- Before: SSR did `SELECT views; UPDATE views = views + 1` per uncached request.
-- That's a read-modify-write race (two concurrent requests both read N, both
-- write N+1, count lost +1) plus a Supabase write on the SSR hot path.
--
-- After: client-side fire-and-forget POST → /api/bazar/views/[id] → this RPC.
-- The UPDATE is atomic at the row level (Postgres serializes writes per row),
-- so no count is lost even under burst traffic. Bot/cookie filtering happens
-- in the API endpoint, so views still represent unique-ish human visitors.
--
-- SECURITY DEFINER + revoke-then-grant pattern: anon role calls the function,
-- the function runs as owner (postgres) and updates a single row by id. No
-- RLS bypass risk because the function only touches one column and one row.
--
-- search_path pinned to public for security (prevent search-path hijack).

CREATE OR REPLACE FUNCTION public.increment_listing_views(listing_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count integer;
BEGIN
  UPDATE bazar_listings
  SET views = COALESCE(views, 0) + 1
  WHERE id = listing_id
    AND status = 'active'
  RETURNING views INTO new_count;

  RETURN COALESCE(new_count, 0);
END;
$$;

-- Lock down direct EXECUTE; only anon + authenticated can call (we'll proxy
-- through the API endpoint which adds bot/cookie throttling).
REVOKE ALL ON FUNCTION public.increment_listing_views(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.increment_listing_views(uuid) TO anon, authenticated;

COMMENT ON FUNCTION public.increment_listing_views(uuid)
  IS 'Atomic +1 on bazar_listings.views for active listings. Called from /api/bazar/views/[id] beacon. Returns new count (0 if listing missing/inactive).';
