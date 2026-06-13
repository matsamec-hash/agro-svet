-- supabase/migrations/016_akce_schema.sql
-- Kalendář zemědělských akcí. Anonymní příspěvky s moderací před zveřejněním.

CREATE TABLE IF NOT EXISTS akce (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  nazev text NOT NULL,
  popis text NOT NULL DEFAULT '',
  typ text NOT NULL,

  -- termín
  druh text NOT NULL CHECK (druh IN ('jednorazova', 'opakovana')),
  zacatek timestamptz,
  konec timestamptz,
  dny_v_tydnu smallint[],            -- 1=po … 7=ne
  cas_od text,                       -- "HH:MM"
  cas_do text,
  plati_od date,
  plati_do date,
  pristi_vyskyt timestamptz,         -- přepočítáváno JS (moderace + cron)

  -- místo
  misto_nazev text,
  adresa text,
  obec text NOT NULL,
  okres_slug text NOT NULL,
  kraj_slug text NOT NULL,
  lat double precision,
  lng double precision,

  -- pořadatel / kontakt
  poradatel text,
  web text,
  telefon text,
  email text NOT NULL DEFAULT '',

  -- původ a stav
  zdroj text NOT NULL DEFAULT 'uzivatel' CHECK (zdroj IN ('uzivatel', 'kurator', 'feed')),
  feed_id text,
  feed_uid text,
  stav text NOT NULL DEFAULT 'ceka' CHECK (stav IN ('ceka', 'zverejneno', 'zamitnuto', 'probehla')),
  zamitnuti_duvod text,
  moderoval uuid REFERENCES bazar_users(id),
  moderovano_at timestamptz,

  -- monetizace (připraveno, zatím nevyužité)
  zvyrazneno boolean NOT NULL DEFAULT false,
  zvyrazneno_do timestamptz,

  og_image text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  zverejneno_at timestamptz
);

-- Nahlašování (vzor bazar_reports)
CREATE TABLE IF NOT EXISTS akce_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  akce_id uuid NOT NULL REFERENCES akce(id) ON DELETE CASCADE,
  duvod text NOT NULL,
  poznamka text,
  created_at timestamptz NOT NULL DEFAULT now(),
  vyrizeno boolean NOT NULL DEFAULT false
);

-- Indexy pro řazení/filtr veřejných stránek (plán 1b)
CREATE INDEX IF NOT EXISTS idx_akce_stav ON akce(stav);
CREATE INDEX IF NOT EXISTS idx_akce_pristi ON akce(pristi_vyskyt) WHERE stav = 'zverejneno';
CREATE INDEX IF NOT EXISTS idx_akce_typ ON akce(typ) WHERE stav = 'zverejneno';
CREATE INDEX IF NOT EXISTS idx_akce_okres ON akce(okres_slug) WHERE stav = 'zverejneno';
CREATE INDEX IF NOT EXISTS idx_akce_kraj ON akce(kraj_slug) WHERE stav = 'zverejneno';
CREATE UNIQUE INDEX IF NOT EXISTS idx_akce_feed_uid ON akce(feed_id, feed_uid) WHERE feed_uid IS NOT NULL;

-- RLS: obrana do hloubky. Server (service role) RLS obchází.
ALTER TABLE akce ENABLE ROW LEVEL SECURITY;
ALTER TABLE akce_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "akce_public_select_published" ON akce
  FOR SELECT USING (stav = 'zverejneno');
CREATE POLICY "akce_reports_insert_any" ON akce_reports
  FOR INSERT WITH CHECK (true);

COMMENT ON COLUMN akce.pristi_vyskyt IS
  'Příští výskyt (ISO). Počítá JS při moderaci a v scripts/akce-maintenance.mjs.';
