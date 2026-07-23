-- 021: /prodejce vstup přes krátký kód + IP rate-limit

-- 1) Alfanumerický kód na prospektovi (druhý vstup vedle claim_token).
ALTER TABLE bazar_seed_prospects ADD COLUMN claim_code text UNIQUE;
CREATE INDEX idx_bazar_seed_prospects_code ON bazar_seed_prospects(claim_code);

-- 2) Per-IP pokusy o zadání kódu (defense-in-depth vedle Turnstile).
CREATE TABLE bazar_code_attempts (
  id bigserial PRIMARY KEY,
  ip text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_bazar_code_attempts_ip_time ON bazar_code_attempts(ip, created_at);

-- Jen service role (žádná policy → default deny pro anon/authenticated).
ALTER TABLE bazar_code_attempts ENABLE ROW LEVEL SECURITY;
