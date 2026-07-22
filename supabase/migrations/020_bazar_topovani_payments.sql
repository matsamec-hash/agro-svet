-- Topování přes QR platbu: VS párování (Fio), čísla faktur, buyer snapshot.
-- Nasadit na self-hosted prod supabase.samecdigital.com (NE cloud).

-- 1) VS sekvence — číselný variabilní symbol (8-místný, nekoliduje).
CREATE SEQUENCE IF NOT EXISTS bazar_vs_seq START WITH 10000000;

-- 2) Rozšíření bazar_featured_orders (paid_at už existuje).
ALTER TABLE bazar_featured_orders
  ADD COLUMN IF NOT EXISTS vs bigint UNIQUE,
  ADD COLUMN IF NOT EXISTS fio_transaction_id bigint UNIQUE,
  ADD COLUMN IF NOT EXISTS invoice_number text UNIQUE,
  ADD COLUMN IF NOT EXISTS invoice_pdf_path text,
  ADD COLUMN IF NOT EXISTS buyer_name text,
  ADD COLUMN IF NOT EXISTS buyer_ico text,
  ADD COLUMN IF NOT EXISTS buyer_address text;

CREATE INDEX IF NOT EXISTS idx_bazar_featured_orders_vs ON bazar_featured_orders(vs);
CREATE INDEX IF NOT EXISTS idx_bazar_featured_orders_status ON bazar_featured_orders(status);

-- 3) Čísla faktur bez děr: counter per rok + atomický RPC.
CREATE TABLE IF NOT EXISTS bazar_invoice_counters (
  year int PRIMARY KEY,
  last_seq int NOT NULL DEFAULT 0
);

CREATE OR REPLACE FUNCTION bazar_next_invoice_number()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  y int := EXTRACT(YEAR FROM NOW())::int;
  seq int;
BEGIN
  INSERT INTO bazar_invoice_counters (year, last_seq)
  VALUES (y, 1)
  ON CONFLICT (year) DO UPDATE SET last_seq = bazar_invoice_counters.last_seq + 1
  RETURNING last_seq INTO seq;
  RETURN y::text || '-' || lpad(seq::text, 4, '0');
END;
$$;

-- 4) RPC pro přidělení VS (atomicky ze sekvence).
CREATE OR REPLACE FUNCTION bazar_next_vs()
RETURNS bigint
LANGUAGE sql
AS $$ SELECT nextval('bazar_vs_seq'); $$;
