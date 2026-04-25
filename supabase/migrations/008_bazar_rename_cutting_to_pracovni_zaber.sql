-- Phase 6 paralelní session přejmenovala v queries `cutting_width_m` → `pracovni_zaber_m`,
-- ale chyběla DB migrace. Bazar / index padá silently:
--   ERROR 42703: column bazar_listings.pracovni_zaber_m does not exist
--
-- Tato migrace: bezpečné přejmenování + zajištění že nový sloupec existuje.
-- Idempotent: pokud už `pracovni_zaber_m` existuje, NIC se neděje. Pokud existuje
-- jen starý `cutting_width_m`, přejmenuje se. Pokud neexistuje žádný, vytvoří se.

DO $$
BEGIN
  -- Pokud nový sloupec ještě neexistuje a starý ano → rename (zachová data)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bazar_listings' AND column_name = 'pracovni_zaber_m'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bazar_listings' AND column_name = 'cutting_width_m'
  ) THEN
    ALTER TABLE bazar_listings RENAME COLUMN cutting_width_m TO pracovni_zaber_m;
  END IF;

  -- Pokud ani jeden neexistuje → vytvoř nový (čistá DB)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bazar_listings' AND column_name = 'pracovni_zaber_m'
  ) THEN
    ALTER TABLE bazar_listings ADD COLUMN pracovni_zaber_m numeric(4,2);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_bazar_listings_pracovni_zaber ON bazar_listings(pracovni_zaber_m);
