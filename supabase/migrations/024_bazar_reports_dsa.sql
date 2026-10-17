-- Bazar reports — doplnění náležitostí oznámení podle DSA čl. 16 odst. 2 a 4.
--
-- čl. 16 odst. 2 písm. c): jméno a e-mail oznamovatele (kromě oznámení o trestných
--   činech podle čl. 3–7 směrnice 2011/93/EU → nový důvod 'zneuzivani-deti').
-- čl. 16 odst. 2 písm. d): prohlášení o dobré víře → good_faith.
-- čl. 16 odst. 4: potvrzení o přijetí oznámení → confirmation_sent_at (kdy odešlo).
--
-- Idempotentní: dá se spustit opakovaně. Starší řádky mají good_faith = false,
-- protože prohlášení tehdy formulář nesbíral.

ALTER TABLE bazar_reports
  ADD COLUMN IF NOT EXISTS reporter_name text,
  ADD COLUMN IF NOT EXISTS good_faith boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS confirmation_sent_at timestamptz;

-- Rozšíření povoleného výčtu důvodů o 'zneuzivani-deti'. Původní CHECK vznikl
-- inline v CREATE TABLE (015) a Postgres ho pojmenoval sám (obvykle
-- bazar_reports_reason_check). Na jméno nesázíme: zahodíme každý CHECK nad
-- sloupcem reason a založíme ho znovu pod pevným jménem.
DO $$
DECLARE c record;
BEGIN
  FOR c IN
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'bazar_reports'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%reason%'
  LOOP
    EXECUTE format('ALTER TABLE bazar_reports DROP CONSTRAINT %I', c.conname);
  END LOOP;
END $$;

ALTER TABLE bazar_reports ADD CONSTRAINT bazar_reports_reason_check CHECK (reason IN (
  'padelek',
  'podvod',
  'mlm-pujcky',
  'leciva-or',
  'osiva-hnojiva',
  'zvirata-cites',
  'zbrane',
  'erotika-tabak',
  'autorska-prava',
  'spam-duplicita',
  'zneuzivani-deti',   -- trestné činy podle čl. 3–7 směrnice 2011/93/EU (jméno a e-mail nepovinné)
  'nezakonny-obsah',
  'jine'
));

COMMENT ON COLUMN bazar_reports.reporter_name IS 'Jméno oznamovatele (DSA čl. 16 odst. 2 písm. c). NULL jen u důvodu zneuzivani-deti nebo u řádků před migrací 024.';
COMMENT ON COLUMN bazar_reports.reporter_email IS 'E-mail oznamovatele — potvrzení přijetí (čl. 16 odst. 4) a sdělení rozhodnutí (čl. 16 odst. 5).';
COMMENT ON COLUMN bazar_reports.good_faith IS 'Oznamovatel potvrdil prohlášení o dobré víře (DSA čl. 16 odst. 2 písm. d).';
COMMENT ON COLUMN bazar_reports.confirmation_sent_at IS 'Kdy odešlo potvrzení o přijetí oznámení (DSA čl. 16 odst. 4). NULL = neodešlo / bez e-mailu.';

-- PostgREST ať hned vidí nové sloupce (jinak insert hlásí 'column not found in schema cache').
NOTIFY pgrst, 'reload schema';
