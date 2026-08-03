-- 023: Ankety (polls) — agregované hlasy per (anketa, možnost). Znovupoužitelné napříč webem.
-- Možnosti jsou definované v komponentě Anketa.astro; DB drží jen počty klíčované (poll_slug, option_id).
-- Řádek se vytvoří líně při prvním hlasu (žádný seed není potřeba).

CREATE TABLE IF NOT EXISTS anketa_hlasy (
  poll_slug  text NOT NULL,
  option_id  text NOT NULL,
  votes      integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (poll_slug, option_id)
);

-- Atomický increment: upsert +1 pro danou možnost, vrátí aktuální stav celé ankety.
CREATE OR REPLACE FUNCTION anketa_vote(p_slug text, p_option text)
RETURNS TABLE (option_id text, votes integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO anketa_hlasy (poll_slug, option_id, votes)
  VALUES (p_slug, p_option, 1)
  ON CONFLICT (poll_slug, option_id)
  DO UPDATE SET votes = anketa_hlasy.votes + 1, updated_at = now();

  RETURN QUERY
    SELECT h.option_id, h.votes
    FROM anketa_hlasy h
    WHERE h.poll_slug = p_slug
    ORDER BY h.option_id;
END;
$$;

-- RLS: číst může kdokoli (anon výsledky), zápis jen přes RPC (SECURITY DEFINER obchází RLS).
ALTER TABLE anketa_hlasy ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS anketa_read ON anketa_hlasy;
CREATE POLICY anketa_read ON anketa_hlasy FOR SELECT USING (true);

GRANT SELECT ON anketa_hlasy TO anon;
GRANT EXECUTE ON FUNCTION anketa_vote(text, text) TO anon;
