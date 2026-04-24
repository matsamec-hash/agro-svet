-- Fotosoutěž Agro-svět — first round seed (May 2026, téma: Traktory)
-- Apply via Supabase SQL editor. Idempotent via slug UNIQUE constraint.

INSERT INTO contest_rounds (
  slug, title, theme, description, year, month,
  upload_starts_at, upload_ends_at,
  voting_starts_at, voting_ends_at, announcement_at,
  prize_first, prize_second, prize_third,
  status,
  optional_fields
) VALUES (
  '2026-05',
  'Vaše traktory — květen 2026',
  'Traktory v akci',
  'Nahrajte svou nejlepší fotografii traktoru — v práci, při zapadlém slunci, v blátě. Ukažte čím žijete.',
  2026, 5,
  '2026-05-01T00:00:00+02'::timestamptz,
  '2026-05-10T22:00:00+02'::timestamptz,
  '2026-05-11T00:00:00+02'::timestamptz,
  '2026-05-28T22:00:00+02'::timestamptz,
  '2026-05-30T12:00:00+02'::timestamptz,
  '1 000 Kč + triko Agro-svět + rozhovor',
  '500 Kč + triko',
  '300 Kč + triko',
  'upload_open',
  '[
    {"name":"brand_slug","type":"stroje-brand","label":"Značka"},
    {"name":"model_slug","type":"stroje-model","label":"Model"},
    {"name":"location_kraj_slug","type":"lokalita-kraj","label":"Kraj"},
    {"name":"location_okres_slug","type":"lokalita-okres","label":"Okres"},
    {"name":"year_taken","type":"number","label":"Rok pořízení"}
  ]'::jsonb
);
