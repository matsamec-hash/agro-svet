# Fotosoutez Agro-svet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a photo contest on agro-svet.cz where registered users upload 3 photos per monthly round, public votes via magic-link (1× per hour), admin moderates, TOP 3 per round advance to December Grande Finale. Produces traffic, community engagement, and a shareable brand story for social channels.

**Architecture:** Astro 6 SSR (`@astrojs/cloudflare`) for public-facing pages and API endpoints. Supabase Postgres (shared project `obhypfuzmknvmknskdwh`) for all contest tables with prefix `contest_`, auth reuses existing `bazar_users`. Cloudflare Turnstile + hybrid email verification (1× per voter per round) + rate limits for anti-fraud. Resend free tier for transactional mail. Dynamic OG images via `satori` on Workers. Minimal admin moderation UI lives at `/admin/fotosoutez/` inside agro-svet repo for MVP; full admin in `content-network-cms` is a separate Phase 2 plan.

**Tech Stack:** Astro 6 SSR, @astrojs/cloudflare, @supabase/supabase-js, Sharp (via Cloudflare Images), satori + @resvg/resvg-js, Resend, Cloudflare Turnstile, Tailwind v4, TypeScript, Vitest (for pure-logic units), js-yaml (already present).

**Spec reference:** `docs/superpowers/specs/2026-04-22-fotosoutez-design.md`

**Scope:** MVP (Phase 1 of spec) — working end-to-end contest with 1st round runnable in May 2026. Phase 2 (author profiles, full admin in content-network-cms, AI moderation, pHash) and Phase 3 (Grande Finale page, calendar ordering) are separate plans.

---

## File Structure

```
src/
├── data/
│   └── lokality.yaml                        # NEW — 14 krajů + 85 okresů
├── lib/
│   ├── lokality.ts                          # NEW — loader + helpers (getKraje, getOkresyByKraj)
│   ├── contest-config.ts                    # NEW — contest constants (phase lengths, limits)
│   ├── contest-supabase.ts                  # NEW — typed DB helpers (entries, rounds, voters, votes)
│   ├── contest-voting.ts                    # NEW — voting logic + anti-fraud rules
│   ├── contest-email.ts                     # NEW — Resend wrapper + template IDs
│   ├── contest-og.ts                        # NEW — satori-based OG image renderer
│   ├── contest-images.ts                    # NEW — upload validation, WebP conversion
│   ├── supabase.ts                          # EXISTS — reuse createAnonClient + createServiceClient
│   └── stroje.ts                            # EXISTS — reuse brand/series/model loaders
├── middleware.ts                             # MODIFY — add /fotosoutez/nahrat, /fotosoutez/moje, /admin/fotosoutez guards
├── components/
│   └── contest/                             # NEW
│       ├── ContestRoundHeader.astro         # Header card for current round
│       ├── ContestEntryCard.astro           # Thumbnail card for gallery
│       ├── ContestEntryDetail.astro         # Hero + metadata for detail page
│       ├── ContestUploadForm.astro          # Upload form + validation
│       ├── ContestLiveLeaderboard.astro     # Right-rail TOP list with 30s refresh
│       ├── ContestVoteButton.astro          # Vote CTA + email modal
│       ├── ContestShareButtons.astro        # FB / Messenger / WhatsApp / X / copy
│       ├── ContestMyDashboard.astro         # User's entries overview
│       └── CascadingPicker.astro            # EXISTS in src/components/bazar — reuse, do not duplicate
├── pages/
│   ├── fotosoutez/
│   │   ├── index.astro                      # Hub + current round + archive teaser
│   │   ├── pravidla.astro                   # Game rules (Markdown include)
│   │   ├── gdpr.astro                       # GDPR policy
│   │   ├── nahrat.astro                     # Upload form page
│   │   ├── moje/
│   │   │   └── index.astro                  # User dashboard
│   │   ├── [mesic].astro                    # Round gallery, dynamic slug "2026-05"
│   │   ├── foto/
│   │   │   └── [id].astro                   # Entry detail + vote CTA
│   │   ├── archiv.astro                     # Historical rounds grid
│   │   └── api/
│   │       ├── upload.ts                    # POST — upload fotku
│   │       ├── request-verification.ts      # POST — send magic link
│   │       ├── verify-email.ts              # GET — magic link handler + optional first vote
│   │       ├── vote.ts                      # POST — cast vote
│   │       ├── leaderboard.ts               # GET — JSON top N for refresh
│   │       └── og/
│   │           └── [id].png.ts              # Dynamic OG image
│   └── admin/
│       └── fotosoutez/
│           ├── index.astro                  # Moderation dashboard
│           ├── moderace.astro               # Pending queue
│           ├── kolo/
│           │   └── [slug].astro             # Round detail + announce winner
│           └── api/
│               ├── moderate.ts              # POST — approve / reject
│               └── announce.ts              # POST — finalize winners
├── content/
│   └── fotosoutez/
│       ├── pravidla.md                      # NEW — full game rules Markdown
│       └── gdpr.md                          # NEW — full GDPR document
└── content.config.ts                        # MODIFY — register fotosoutez collection

supabase/
└── migrations/
    ├── 003_contest_schema.sql               # NEW — tables, RLS, indexes, triggers
    ├── 004_contest_bazar_users_extend.sql   # NEW — add is_admin, contest_display_name
    └── 005_contest_hourly_snapshot.sql      # NEW — rank-delta snapshot table + cron

tests/
├── lib/
│   ├── lokality.test.ts                     # NEW — kraj/okres loader
│   ├── contest-config.test.ts               # NEW — phase calculation
│   ├── contest-voting.test.ts               # NEW — rate limit + anti-fraud rules
│   └── contest-og.test.ts                   # NEW — snapshot test for OG layout
└── setup.ts                                  # NEW — Vitest setup

vitest.config.ts                             # NEW — Vitest config
wrangler.toml                                # MODIFY — add RESEND_API_KEY, TURNSTILE keys
package.json                                 # MODIFY — new deps
```

Shared Supabase project already contains `bazar_users`. Contest tables reference `bazar_users.id` so login reuses existing auth.

---

## Task 1: Dependencies + Vitest Setup

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`

- [ ] **Step 1: Install runtime dependencies**

```bash
cd /Users/matejsamec/agro-svet
npm install resend satori @resvg/resvg-js @cfworker/hcaptcha
```

Note: `@cfworker/hcaptcha` is a lightweight Turnstile/hCaptcha verifier that runs on Workers. Alternative: verify Turnstile via `fetch` call — see Task 13.

- [ ] **Step 2: Install dev dependencies**

```bash
npm install --save-dev vitest @vitest/ui happy-dom
```

- [ ] **Step 3: Create `vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts'],
  },
});
```

- [ ] **Step 4: Create `tests/setup.ts`**

```typescript
// Vitest global setup.
// Provide `import.meta.env` fallbacks so lib modules can run under test.
Object.assign(import.meta.env, {
  PUBLIC_SUPABASE_URL: 'http://localhost:54321',
  PUBLIC_SUPABASE_ANON_KEY: 'test-anon',
  SUPABASE_SERVICE_KEY: 'test-service',
});
```

- [ ] **Step 5: Add test scripts to `package.json`**

Modify the `scripts` block:

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "astro": "astro",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 6: Verify setup**

```bash
npm run test
```

Expected: `No test files found` — that is OK, the framework is wired.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.ts tests/setup.ts
git commit -m "chore(fotosoutez): add Vitest + contest runtime deps"
```

---

## Task 2: DB Schema Migration — contest_rounds, contest_entries

**Files:**
- Create: `supabase/migrations/003_contest_schema.sql`

- [ ] **Step 1: Create migration file with tables**

Write the full file. Content:

```sql
-- Fotosoutez Agro-svet — schema (shared Supabase project, prefix `contest_`)

-- ========== contest_rounds ==========
CREATE TABLE contest_rounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  theme text NOT NULL,
  description text NOT NULL DEFAULT '',
  hero_image text,
  year integer NOT NULL,
  month integer,
  is_final boolean NOT NULL DEFAULT false,
  upload_starts_at timestamptz NOT NULL,
  upload_ends_at timestamptz NOT NULL,
  voting_starts_at timestamptz NOT NULL,
  voting_ends_at timestamptz NOT NULL,
  announcement_at timestamptz NOT NULL,
  prize_first text NOT NULL DEFAULT '',
  prize_second text,
  prize_third text,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','published','upload_open','voting_open','closed','announced')),
  winner_entry_id uuid,
  runner_up_entry_id uuid,
  third_place_entry_id uuid,
  required_fields jsonb NOT NULL DEFAULT '[]'::jsonb,
  optional_fields jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_contest_rounds_status ON contest_rounds(status);
CREATE INDEX idx_contest_rounds_year ON contest_rounds(year DESC);

-- ========== contest_entries ==========
CREATE TABLE contest_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id uuid NOT NULL REFERENCES contest_rounds(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES bazar_users(id) ON DELETE CASCADE,
  photo_path text NOT NULL,
  photo_width integer NOT NULL,
  photo_height integer NOT NULL,
  title text NOT NULL,
  caption text,
  author_display_name text NOT NULL,
  author_location text,
  brand_slug text,
  model_slug text,
  series_slug text,
  location_kraj_slug text,
  location_okres_slug text,
  year_taken integer,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','approved','rejected','disqualified')),
  rejection_reason text,
  moderated_by uuid,
  moderated_at timestamptz,
  exif_has_metadata boolean NOT NULL DEFAULT false,
  phash text,
  upload_ip inet,
  upload_user_agent text,
  vote_count integer NOT NULL DEFAULT 0,
  last_vote_at timestamptz,
  license_merch_print boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_contest_entries_round ON contest_entries(round_id);
CREATE INDEX idx_contest_entries_user ON contest_entries(user_id);
CREATE INDEX idx_contest_entries_status ON contest_entries(status);
CREATE INDEX idx_contest_entries_votes
  ON contest_entries(round_id, vote_count DESC)
  WHERE status = 'approved';
CREATE INDEX idx_contest_entries_brand
  ON contest_entries(brand_slug)
  WHERE brand_slug IS NOT NULL;
CREATE INDEX idx_contest_entries_kraj
  ON contest_entries(location_kraj_slug)
  WHERE location_kraj_slug IS NOT NULL;
```

- [ ] **Step 2: Append voter + votes tables**

Append to the same file:

```sql

-- ========== contest_voters ==========
CREATE TABLE contest_voters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id uuid NOT NULL REFERENCES contest_rounds(id) ON DELETE CASCADE,
  email text NOT NULL,
  email_verified boolean NOT NULL DEFAULT false,
  verification_token text,
  verification_sent_at timestamptz,
  verified_at timestamptz,
  cookie_id uuid NOT NULL DEFAULT gen_random_uuid(),
  first_ip inet,
  first_user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_contest_voters_round_email ON contest_voters(round_id, email);
CREATE UNIQUE INDEX idx_contest_voters_cookie ON contest_voters(cookie_id);
CREATE INDEX idx_contest_voters_token
  ON contest_voters(verification_token)
  WHERE email_verified = false;

-- ========== contest_votes ==========
CREATE TABLE contest_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id uuid NOT NULL REFERENCES contest_entries(id) ON DELETE CASCADE,
  voter_id uuid NOT NULL REFERENCES contest_voters(id) ON DELETE CASCADE,
  voted_at timestamptz NOT NULL DEFAULT now(),
  ip inet NOT NULL,
  user_agent text,
  is_valid boolean NOT NULL DEFAULT true
);

CREATE INDEX idx_contest_votes_entry ON contest_votes(entry_id);
CREATE INDEX idx_contest_votes_voter ON contest_votes(voter_id, voted_at DESC);
CREATE INDEX idx_contest_votes_ip_date ON contest_votes(ip, voted_at DESC);

-- ========== contest_finalists ==========
CREATE TABLE contest_finalists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year integer NOT NULL,
  source_round_id uuid NOT NULL REFERENCES contest_rounds(id),
  entry_id uuid NOT NULL REFERENCES contest_entries(id),
  placement integer NOT NULL CHECK (placement IN (1,2,3)),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_contest_finalists_entry ON contest_finalists(entry_id);
CREATE INDEX idx_contest_finalists_year ON contest_finalists(year);

-- ========== contest_admin_log ==========
CREATE TABLE contest_admin_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid NOT NULL,
  action text NOT NULL,
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_contest_admin_log_admin ON contest_admin_log(admin_user_id, created_at DESC);
CREATE INDEX idx_contest_admin_log_target ON contest_admin_log(target_type, target_id);
```

- [ ] **Step 3: Append triggers + RLS**

Append to the same file:

```sql

-- ========== Triggers ==========
CREATE OR REPLACE FUNCTION contest_vote_increment() RETURNS trigger AS $$
BEGIN
  IF NEW.is_valid THEN
    UPDATE contest_entries
       SET vote_count = vote_count + 1,
           last_vote_at = NEW.voted_at
     WHERE id = NEW.entry_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contest_vote_increment_trigger
AFTER INSERT ON contest_votes
FOR EACH ROW EXECUTE FUNCTION contest_vote_increment();

CREATE OR REPLACE FUNCTION contest_vote_invalidate() RETURNS trigger AS $$
BEGIN
  IF OLD.is_valid = true AND NEW.is_valid = false THEN
    UPDATE contest_entries
       SET vote_count = GREATEST(0, vote_count - 1)
     WHERE id = NEW.entry_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contest_vote_invalidate_trigger
AFTER UPDATE ON contest_votes
FOR EACH ROW EXECUTE FUNCTION contest_vote_invalidate();

-- ========== RLS ==========
ALTER TABLE contest_rounds  ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_voters  ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_votes   ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_finalists ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_admin_log ENABLE ROW LEVEL SECURITY;

-- rounds: public reads non-draft, admin sees all; admin writes
CREATE POLICY "contest_rounds_select_public" ON contest_rounds FOR SELECT
  USING (status != 'draft'
    OR EXISTS (SELECT 1 FROM bazar_users WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "contest_rounds_write_admin" ON contest_rounds FOR ALL
  USING (EXISTS (SELECT 1 FROM bazar_users WHERE id = auth.uid() AND is_admin = true));

-- entries: public reads approved, user reads own, admin reads all
CREATE POLICY "contest_entries_select" ON contest_entries FOR SELECT USING (
  status = 'approved'
  OR auth.uid() = user_id
  OR EXISTS (SELECT 1 FROM bazar_users WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "contest_entries_insert_owner" ON contest_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "contest_entries_update_owner_pending" ON contest_entries FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');
CREATE POLICY "contest_entries_update_admin" ON contest_entries FOR UPDATE
  USING (EXISTS (SELECT 1 FROM bazar_users WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "contest_entries_delete_admin" ON contest_entries FOR DELETE
  USING (EXISTS (SELECT 1 FROM bazar_users WHERE id = auth.uid() AND is_admin = true));

-- voters + votes: only service role writes (all via API endpoints).
-- Disable all client policies by creating no SELECT policy for anon.
CREATE POLICY "contest_voters_admin_select" ON contest_voters FOR SELECT
  USING (EXISTS (SELECT 1 FROM bazar_users WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "contest_votes_admin_select" ON contest_votes FOR SELECT
  USING (EXISTS (SELECT 1 FROM bazar_users WHERE id = auth.uid() AND is_admin = true));

-- finalists: public reads all, admin writes
CREATE POLICY "contest_finalists_select" ON contest_finalists FOR SELECT USING (true);
CREATE POLICY "contest_finalists_write_admin" ON contest_finalists FOR ALL
  USING (EXISTS (SELECT 1 FROM bazar_users WHERE id = auth.uid() AND is_admin = true));

-- admin_log: admin-only
CREATE POLICY "contest_admin_log_admin" ON contest_admin_log FOR ALL
  USING (EXISTS (SELECT 1 FROM bazar_users WHERE id = auth.uid() AND is_admin = true));
```

- [ ] **Step 2 (alt): Verify file**

Ensure file is saved at `supabase/migrations/003_contest_schema.sql`. Line count should be ~220 lines.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/003_contest_schema.sql
git commit -m "feat(fotosoutez): add contest schema migration"
```

Note: migration is applied via Supabase dashboard in Task 4 (after `bazar_users` is extended) because `bazar_users.is_admin` is referenced.

---

## Task 3: Extend bazar_users — is_admin + contest_display_name

**Files:**
- Create: `supabase/migrations/004_contest_bazar_users_extend.sql`

- [ ] **Step 1: Create migration file**

```sql
-- Extend bazar_users for fotosoutez: admin role + contest-specific display name

ALTER TABLE bazar_users
  ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS contest_display_name text,
  ADD COLUMN IF NOT EXISTS contest_opt_in_newsletter boolean NOT NULL DEFAULT false;

-- Admin lookup helper for RLS
CREATE INDEX IF NOT EXISTS idx_bazar_users_is_admin
  ON bazar_users(id) WHERE is_admin = true;
```

- [ ] **Step 2: Apply migrations in Supabase dashboard**

Open https://supabase.com/dashboard/project/obhypfuzmknvmknskdwh/sql → New query.
Paste and run:
1. `004_contest_bazar_users_extend.sql` first (adds `is_admin` column referenced by 003 policies)
2. `003_contest_schema.sql` second

Verify in Table Editor that `contest_rounds`, `contest_entries`, `contest_voters`, `contest_votes`, `contest_finalists`, `contest_admin_log` all exist, and `bazar_users` has new columns.

- [ ] **Step 3: Set yourself as admin**

In Supabase SQL editor:
```sql
UPDATE bazar_users
   SET is_admin = true,
       contest_display_name = 'Matěj Samec'
 WHERE email = 'matsamec@gmail.com';
```

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/004_contest_bazar_users_extend.sql
git commit -m "feat(fotosoutez): extend bazar_users with admin role"
```

---

## Task 4: Supabase Storage Bucket `contest-photos`

**Files:** (DB-side only — no repo files)

- [ ] **Step 1: Create bucket**

Supabase dashboard → Storage → New bucket:
- Name: `contest-photos`
- Public bucket: **Yes**
- Allowed MIME types: `image/jpeg,image/png,image/webp,image/heic,image/heif`
- File size limit: 15 MB

- [ ] **Step 2: Add storage policies**

Supabase dashboard → Storage → Policies → `contest-photos` → New policy:

**Policy 1 — Authenticated uploads:**
- Allowed operation: INSERT
- Target roles: `authenticated`
- USING: (leave empty)
- WITH CHECK:
```sql
bucket_id = 'contest-photos'
```

**Policy 2 — Public reads:**
- Allowed operation: SELECT
- Target roles: `anon, authenticated`
- USING:
```sql
bucket_id = 'contest-photos'
```

**Policy 3 — Owner/admin delete:**
- Allowed operation: DELETE
- Target roles: `authenticated`
- USING:
```sql
bucket_id = 'contest-photos' AND (
  auth.uid()::text = (storage.foldername(name))[1]
  OR EXISTS (SELECT 1 FROM bazar_users WHERE id = auth.uid() AND is_admin = true)
)
```

- [ ] **Step 3: Smoke test upload**

Optional: upload a file via dashboard to `test/hello.jpg`, verify public URL opens, then delete it.

- [ ] **Step 4: Document (commit a short note)**

Create `supabase/STORAGE.md` if not present, and append:

```markdown
## contest-photos bucket (fotosoutez)

- Public bucket
- Path: `{user_id}/{round_slug}/{entry_id}.webp`
- Max size: 15 MB input (converted to WebP at upload)
- Policies set per Task 4 of fotosoutez plan
```

```bash
git add supabase/STORAGE.md
git commit -m "docs(fotosoutez): document contest-photos storage bucket"
```

---

## Task 5: Lokality Data — YAML + Loader + Tests

**Files:**
- Create: `src/data/lokality.yaml`
- Create: `src/lib/lokality.ts`
- Create: `tests/lib/lokality.test.ts`

- [ ] **Step 1: Create `src/data/lokality.yaml`**

14 regions + 85 districts (okresy). Structure:

```yaml
kraje:
  - slug: praha
    name: "Hlavní město Praha"
    okresy:
      - slug: praha
        name: "Praha"

  - slug: stredocesky
    name: "Středočeský kraj"
    okresy:
      - { slug: benesov, name: "Benešov" }
      - { slug: beroun, name: "Beroun" }
      - { slug: kladno, name: "Kladno" }
      - { slug: kolin, name: "Kolín" }
      - { slug: kutna-hora, name: "Kutná Hora" }
      - { slug: melnik, name: "Mělník" }
      - { slug: mlada-boleslav, name: "Mladá Boleslav" }
      - { slug: nymburk, name: "Nymburk" }
      - { slug: praha-vychod, name: "Praha-východ" }
      - { slug: praha-zapad, name: "Praha-západ" }
      - { slug: pribram, name: "Příbram" }
      - { slug: rakovnik, name: "Rakovník" }

  - slug: jihocesky
    name: "Jihočeský kraj"
    okresy:
      - { slug: ceske-budejovice, name: "České Budějovice" }
      - { slug: cesky-krumlov, name: "Český Krumlov" }
      - { slug: jindrichuv-hradec, name: "Jindřichův Hradec" }
      - { slug: pisek, name: "Písek" }
      - { slug: prachatice, name: "Prachatice" }
      - { slug: strakonice, name: "Strakonice" }
      - { slug: tabor, name: "Tábor" }

  - slug: plzensky
    name: "Plzeňský kraj"
    okresy:
      - { slug: domazlice, name: "Domažlice" }
      - { slug: klatovy, name: "Klatovy" }
      - { slug: plzen-mesto, name: "Plzeň-město" }
      - { slug: plzen-jih, name: "Plzeň-jih" }
      - { slug: plzen-sever, name: "Plzeň-sever" }
      - { slug: rokycany, name: "Rokycany" }
      - { slug: tachov, name: "Tachov" }

  - slug: karlovarsky
    name: "Karlovarský kraj"
    okresy:
      - { slug: cheb, name: "Cheb" }
      - { slug: karlovy-vary, name: "Karlovy Vary" }
      - { slug: sokolov, name: "Sokolov" }

  - slug: ustecky
    name: "Ústecký kraj"
    okresy:
      - { slug: decin, name: "Děčín" }
      - { slug: chomutov, name: "Chomutov" }
      - { slug: litomerice, name: "Litoměřice" }
      - { slug: louny, name: "Louny" }
      - { slug: most, name: "Most" }
      - { slug: teplice, name: "Teplice" }
      - { slug: usti-nad-labem, name: "Ústí nad Labem" }

  - slug: liberecky
    name: "Liberecký kraj"
    okresy:
      - { slug: ceska-lipa, name: "Česká Lípa" }
      - { slug: jablonec-nad-nisou, name: "Jablonec nad Nisou" }
      - { slug: liberec, name: "Liberec" }
      - { slug: semily, name: "Semily" }

  - slug: kralovehradecky
    name: "Královéhradecký kraj"
    okresy:
      - { slug: hradec-kralove, name: "Hradec Králové" }
      - { slug: jicin, name: "Jičín" }
      - { slug: nachod, name: "Náchod" }
      - { slug: rychnov-nad-kneznou, name: "Rychnov nad Kněžnou" }
      - { slug: trutnov, name: "Trutnov" }

  - slug: pardubicky
    name: "Pardubický kraj"
    okresy:
      - { slug: chrudim, name: "Chrudim" }
      - { slug: pardubice, name: "Pardubice" }
      - { slug: svitavy, name: "Svitavy" }
      - { slug: usti-nad-orlici, name: "Ústí nad Orlicí" }

  - slug: vysocina
    name: "Kraj Vysočina"
    okresy:
      - { slug: havlickuv-brod, name: "Havlíčkův Brod" }
      - { slug: jihlava, name: "Jihlava" }
      - { slug: pelhrimov, name: "Pelhřimov" }
      - { slug: trebic, name: "Třebíč" }
      - { slug: zdar-nad-sazavou, name: "Žďár nad Sázavou" }

  - slug: jihomoravsky
    name: "Jihomoravský kraj"
    okresy:
      - { slug: blansko, name: "Blansko" }
      - { slug: brno-mesto, name: "Brno-město" }
      - { slug: brno-venkov, name: "Brno-venkov" }
      - { slug: breclav, name: "Břeclav" }
      - { slug: hodonin, name: "Hodonín" }
      - { slug: vyskov, name: "Vyškov" }
      - { slug: znojmo, name: "Znojmo" }

  - slug: olomoucky
    name: "Olomoucký kraj"
    okresy:
      - { slug: jesenik, name: "Jeseník" }
      - { slug: olomouc, name: "Olomouc" }
      - { slug: prerov, name: "Přerov" }
      - { slug: prostejov, name: "Prostějov" }
      - { slug: sumperk, name: "Šumperk" }

  - slug: zlinsky
    name: "Zlínský kraj"
    okresy:
      - { slug: kromeriz, name: "Kroměříž" }
      - { slug: uherske-hradiste, name: "Uherské Hradiště" }
      - { slug: vsetin, name: "Vsetín" }
      - { slug: zlin, name: "Zlín" }

  - slug: moravskoslezsky
    name: "Moravskoslezský kraj"
    okresy:
      - { slug: bruntal, name: "Bruntál" }
      - { slug: frydek-mistek, name: "Frýdek-Místek" }
      - { slug: karvina, name: "Karviná" }
      - { slug: nova-jicin, name: "Nový Jičín" }
      - { slug: opava, name: "Opava" }
      - { slug: ostrava-mesto, name: "Ostrava-město" }
```

- [ ] **Step 2: Create loader `src/lib/lokality.ts`**

```typescript
import jsyaml from 'js-yaml';

export interface Okres {
  slug: string;
  name: string;
}

export interface Kraj {
  slug: string;
  name: string;
  okresy: Okres[];
}

interface LokalityYaml {
  kraje: Kraj[];
}

const raw = import.meta.glob('/src/data/lokality.yaml', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

let cachedKraje: Kraj[] | null = null;

function load(): Kraj[] {
  if (cachedKraje) return cachedKraje;
  const firstRaw = Object.values(raw)[0];
  if (!firstRaw) {
    throw new Error('[lokality] Missing src/data/lokality.yaml');
  }
  const parsed = jsyaml.load(firstRaw) as LokalityYaml;
  cachedKraje = parsed.kraje.map(k => ({
    slug: String(k.slug),
    name: k.name,
    okresy: k.okresy.map(o => ({ slug: String(o.slug), name: o.name })),
  }));
  cachedKraje.sort((a, b) => a.name.localeCompare(b.name, 'cs'));
  return cachedKraje;
}

export function getKraje(): Kraj[] {
  return load();
}

export function getKraj(slug: string): Kraj | undefined {
  return load().find(k => k.slug === slug);
}

export function getOkresy(krajSlug: string): Okres[] {
  return getKraj(krajSlug)?.okresy ?? [];
}

export function getOkres(krajSlug: string, okresSlug: string): Okres | undefined {
  return getOkresy(krajSlug).find(o => o.slug === okresSlug);
}

export function formatLokalita(krajSlug?: string | null, okresSlug?: string | null): string {
  if (!krajSlug) return '';
  const kraj = getKraj(krajSlug);
  if (!kraj) return '';
  if (!okresSlug) return kraj.name;
  const okres = getOkres(krajSlug, okresSlug);
  return okres ? `${okres.name}, ${kraj.name}` : kraj.name;
}
```

- [ ] **Step 3: Write failing tests**

Create `tests/lib/lokality.test.ts`:

```typescript
import { describe, expect, it } from 'vitest';
import {
  getKraje,
  getKraj,
  getOkresy,
  getOkres,
  formatLokalita,
} from '../../src/lib/lokality';

describe('lokality loader', () => {
  it('returns 14 kraje', () => {
    expect(getKraje()).toHaveLength(14);
  });

  it('finds Středočeský kraj by slug', () => {
    const kraj = getKraj('stredocesky');
    expect(kraj?.name).toBe('Středočeský kraj');
  });

  it('returns okresy for a kraj', () => {
    const okresy = getOkresy('stredocesky');
    expect(okresy.length).toBeGreaterThan(10);
    expect(okresy.map(o => o.slug)).toContain('kolin');
  });

  it('getOkres returns named okres', () => {
    const okres = getOkres('stredocesky', 'kolin');
    expect(okres?.name).toBe('Kolín');
  });

  it('formatLokalita full form', () => {
    expect(formatLokalita('stredocesky', 'kolin')).toBe('Kolín, Středočeský kraj');
  });

  it('formatLokalita kraj only', () => {
    expect(formatLokalita('stredocesky')).toBe('Středočeský kraj');
  });

  it('formatLokalita empty on missing', () => {
    expect(formatLokalita()).toBe('');
    expect(formatLokalita('neexistuje')).toBe('');
  });
});
```

- [ ] **Step 4: Run tests**

```bash
npm run test
```

Expected: all 7 `lokality loader` tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/data/lokality.yaml src/lib/lokality.ts tests/lib/lokality.test.ts
git commit -m "feat(fotosoutez): lokality dataset (14 krajů + 85 okresů) with loader"
```

---

## Task 6: Contest Config + Phase Calculation

**Files:**
- Create: `src/lib/contest-config.ts`
- Create: `tests/lib/contest-config.test.ts`

- [ ] **Step 1: Create `src/lib/contest-config.ts`**

```typescript
// Contest-wide constants. Edit here to tune timings/limits.

export const CONTEST_CONFIG = {
  /** Max entries per user per round */
  MAX_ENTRIES_PER_ROUND: 3,

  /** Max photo file size (bytes) — 15 MB input */
  MAX_UPLOAD_BYTES: 15 * 1024 * 1024,

  /** Accepted MIME types */
  ACCEPTED_MIME: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'],

  /** Output WebP long-edge in pixels after server conversion */
  OUTPUT_LONG_EDGE: 1920,

  /** Voting rate limit: 1 vote per hour per voter */
  VOTE_COOLDOWN_MS: 60 * 60 * 1000,

  /** Voting rate limit: max votes per IP per rolling 24h */
  IP_VOTES_PER_DAY: 20,

  /** Leaderboard refresh interval (ms) */
  LEADERBOARD_REFRESH_MS: 30_000,

  /** Token length for magic link */
  VERIFICATION_TOKEN_LENGTH: 32,

  /** Voter cookie name */
  VOTER_COOKIE: 'contest_voter_id',

  /** Min age (years) from rules */
  MIN_AGE: 18,
} as const;

/** Round phase derived from `now` and round timestamps. */
export type RoundPhase =
  | 'upcoming'    // before upload_starts_at
  | 'upload_open' // in upload window
  | 'between'    // upload closed, voting not yet open
  | 'voting_open'// in voting window
  | 'closed'     // voting ended, no announcement yet
  | 'announced'; // winners announced

export interface RoundTimings {
  upload_starts_at: string | Date;
  upload_ends_at:   string | Date;
  voting_starts_at: string | Date;
  voting_ends_at:   string | Date;
  announcement_at:  string | Date;
  status?: string;
}

function toDate(v: string | Date): Date {
  return v instanceof Date ? v : new Date(v);
}

export function computeRoundPhase(round: RoundTimings, now: Date = new Date()): RoundPhase {
  if (round.status === 'announced') return 'announced';
  const t = now.getTime();
  if (t < toDate(round.upload_starts_at).getTime()) return 'upcoming';
  if (t < toDate(round.upload_ends_at).getTime())   return 'upload_open';
  if (t < toDate(round.voting_starts_at).getTime()) return 'between';
  if (t < toDate(round.voting_ends_at).getTime())   return 'voting_open';
  return 'closed';
}

export function msUntil(target: string | Date, now: Date = new Date()): number {
  return Math.max(0, toDate(target).getTime() - now.getTime());
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return '0 h';
  const hours = Math.floor(ms / 3_600_000);
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  if (days > 0) return `${days} d ${remainingHours} h`;
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  return `${hours} h ${minutes} min`;
}
```

- [ ] **Step 2: Write tests `tests/lib/contest-config.test.ts`**

```typescript
import { describe, expect, it } from 'vitest';
import { computeRoundPhase, msUntil, formatCountdown } from '../../src/lib/contest-config';

const ROUND = {
  upload_starts_at: '2026-05-01T00:00:00Z',
  upload_ends_at:   '2026-05-10T22:00:00Z',
  voting_starts_at: '2026-05-11T00:00:00Z',
  voting_ends_at:   '2026-05-28T22:00:00Z',
  announcement_at:  '2026-05-30T12:00:00Z',
  status: 'voting_open',
};

describe('computeRoundPhase', () => {
  it('upcoming before upload start', () => {
    expect(computeRoundPhase(ROUND, new Date('2026-04-25T12:00:00Z'))).toBe('upcoming');
  });
  it('upload_open during upload window', () => {
    expect(computeRoundPhase(ROUND, new Date('2026-05-05T12:00:00Z'))).toBe('upload_open');
  });
  it('between after upload before voting', () => {
    expect(computeRoundPhase(ROUND, new Date('2026-05-10T23:00:00Z'))).toBe('between');
  });
  it('voting_open during voting window', () => {
    expect(computeRoundPhase(ROUND, new Date('2026-05-15T12:00:00Z'))).toBe('voting_open');
  });
  it('closed after voting ends', () => {
    expect(computeRoundPhase(ROUND, new Date('2026-05-29T00:00:00Z'))).toBe('closed');
  });
  it('announced when status=announced regardless of time', () => {
    expect(computeRoundPhase({ ...ROUND, status: 'announced' }, new Date('2026-05-05T12:00:00Z')))
      .toBe('announced');
  });
});

describe('msUntil', () => {
  it('returns positive when future', () => {
    const ms = msUntil('2026-05-15T00:00:00Z', new Date('2026-05-10T00:00:00Z'));
    expect(ms).toBe(5 * 24 * 3_600_000);
  });
  it('returns 0 when past', () => {
    expect(msUntil('2026-01-01T00:00:00Z', new Date('2026-05-10T00:00:00Z'))).toBe(0);
  });
});

describe('formatCountdown', () => {
  it('hours+minutes under a day', () => {
    expect(formatCountdown(3_600_000 * 2 + 60_000 * 30)).toBe('2 h 30 min');
  });
  it('days+hours over a day', () => {
    expect(formatCountdown(86_400_000 * 3 + 3_600_000 * 5)).toBe('3 d 5 h');
  });
  it('zero', () => {
    expect(formatCountdown(0)).toBe('0 h');
  });
});
```

- [ ] **Step 3: Run tests**

```bash
npm run test
```

Expected: 12 tests pass (7 from Task 5 + 5 phase + 2 msUntil + 3 countdown).

- [ ] **Step 4: Commit**

```bash
git add src/lib/contest-config.ts tests/lib/contest-config.test.ts
git commit -m "feat(fotosoutez): config constants + phase calculation"
```

---

## Task 7: Voting Logic + Anti-Fraud Rules

**Files:**
- Create: `src/lib/contest-voting.ts`
- Create: `tests/lib/contest-voting.test.ts`

- [ ] **Step 1: Create `src/lib/contest-voting.ts`**

```typescript
import { CONTEST_CONFIG } from './contest-config';

export interface Vote {
  voter_id: string;
  voted_at: string | Date;
  ip: string;
  is_valid: boolean;
}

export interface VoteAttemptInput {
  now?: Date;
  /** Votes by this voter in the current round (any time). */
  voter_history: Vote[];
  /** Votes from this IP in the past 24h. */
  ip_history_last_24h: Vote[];
  /** Entry's owner user id. Null if anonymous lookup failed. */
  entry_owner_id: string | null;
  /** Voter's linked bazar_users.id if logged in, else null. */
  voter_user_id: string | null;
}

export type VoteRejection =
  | 'cooldown'
  | 'ip_limit'
  | 'own_entry'
  | 'email_unverified';

export interface VoteDecision {
  ok: true;
}

export interface VoteRejected {
  ok: false;
  reason: VoteRejection;
  retry_after_ms?: number;
}

export type VoteCheckResult = VoteDecision | VoteRejected;

export interface VoterState {
  email_verified: boolean;
}

/**
 * Pure rule check. Does NOT touch DB.
 * Call before INSERT contest_votes; on ok===true, write the row.
 */
export function canVote(input: VoteAttemptInput & { voter: VoterState }): VoteCheckResult {
  const now = input.now ?? new Date();

  if (!input.voter.email_verified) {
    return { ok: false, reason: 'email_unverified' };
  }

  if (input.voter_user_id && input.voter_user_id === input.entry_owner_id) {
    return { ok: false, reason: 'own_entry' };
  }

  const validVoterVotes = input.voter_history.filter(v => v.is_valid);
  if (validVoterVotes.length > 0) {
    const last = validVoterVotes
      .map(v => (v.voted_at instanceof Date ? v.voted_at : new Date(v.voted_at)))
      .sort((a, b) => b.getTime() - a.getTime())[0];
    const elapsed = now.getTime() - last.getTime();
    if (elapsed < CONTEST_CONFIG.VOTE_COOLDOWN_MS) {
      return {
        ok: false,
        reason: 'cooldown',
        retry_after_ms: CONTEST_CONFIG.VOTE_COOLDOWN_MS - elapsed,
      };
    }
  }

  const validIpVotes = input.ip_history_last_24h.filter(v => v.is_valid);
  if (validIpVotes.length >= CONTEST_CONFIG.IP_VOTES_PER_DAY) {
    return { ok: false, reason: 'ip_limit' };
  }

  return { ok: true };
}

/** Generate opaque verification token (hex). */
export function generateVerificationToken(): string {
  const bytes = new Uint8Array(CONTEST_CONFIG.VERIFICATION_TOKEN_LENGTH);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}
```

- [ ] **Step 2: Write tests `tests/lib/contest-voting.test.ts`**

```typescript
import { describe, expect, it } from 'vitest';
import { canVote, generateVerificationToken, type Vote } from '../../src/lib/contest-voting';

const now = new Date('2026-05-15T12:00:00Z');
const voter = { email_verified: true };

function validVote(offsetMs: number, ip = '1.2.3.4'): Vote {
  return {
    voter_id: 'v1',
    voted_at: new Date(now.getTime() - offsetMs),
    ip,
    is_valid: true,
  };
}

describe('canVote', () => {
  it('allows when no prior votes', () => {
    const result = canVote({
      voter,
      voter_history: [],
      ip_history_last_24h: [],
      entry_owner_id: 'author1',
      voter_user_id: null,
      now,
    });
    expect(result).toEqual({ ok: true });
  });

  it('rejects if email unverified', () => {
    const result = canVote({
      voter: { email_verified: false },
      voter_history: [],
      ip_history_last_24h: [],
      entry_owner_id: 'author1',
      voter_user_id: null,
      now,
    });
    expect(result).toMatchObject({ ok: false, reason: 'email_unverified' });
  });

  it('rejects if voted <1h ago', () => {
    const result = canVote({
      voter,
      voter_history: [validVote(30 * 60 * 1000)], // 30 minutes ago
      ip_history_last_24h: [validVote(30 * 60 * 1000)],
      entry_owner_id: 'author1',
      voter_user_id: null,
      now,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe('cooldown');
      expect(result.retry_after_ms).toBeGreaterThan(0);
      expect(result.retry_after_ms).toBeLessThan(60 * 60 * 1000);
    }
  });

  it('allows if last vote >1h ago', () => {
    const result = canVote({
      voter,
      voter_history: [validVote(61 * 60 * 1000)],
      ip_history_last_24h: [validVote(61 * 60 * 1000)],
      entry_owner_id: 'author1',
      voter_user_id: null,
      now,
    });
    expect(result).toEqual({ ok: true });
  });

  it('ignores invalid votes in cooldown', () => {
    const invalidated: Vote = { ...validVote(10 * 60 * 1000), is_valid: false };
    const result = canVote({
      voter,
      voter_history: [invalidated],
      ip_history_last_24h: [invalidated],
      entry_owner_id: 'author1',
      voter_user_id: null,
      now,
    });
    expect(result).toEqual({ ok: true });
  });

  it('rejects self-vote when voter_user_id equals entry_owner_id', () => {
    const result = canVote({
      voter,
      voter_history: [],
      ip_history_last_24h: [],
      entry_owner_id: 'author1',
      voter_user_id: 'author1',
      now,
    });
    expect(result).toMatchObject({ ok: false, reason: 'own_entry' });
  });

  it('rejects when IP used 20 valid votes in 24h', () => {
    const ipHistory: Vote[] = Array.from({ length: 20 }, (_, i) =>
      validVote((i + 2) * 60 * 60 * 1000),
    );
    const result = canVote({
      voter,
      voter_history: [], // this specific voter hasn't voted
      ip_history_last_24h: ipHistory,
      entry_owner_id: 'author1',
      voter_user_id: null,
      now,
    });
    expect(result).toMatchObject({ ok: false, reason: 'ip_limit' });
  });

  it('allows when IP used 19 valid votes in 24h', () => {
    const ipHistory: Vote[] = Array.from({ length: 19 }, (_, i) =>
      validVote((i + 2) * 60 * 60 * 1000),
    );
    const result = canVote({
      voter,
      voter_history: [],
      ip_history_last_24h: ipHistory,
      entry_owner_id: 'author1',
      voter_user_id: null,
      now,
    });
    expect(result).toEqual({ ok: true });
  });
});

describe('generateVerificationToken', () => {
  it('produces 64-char hex (32 bytes)', () => {
    const token = generateVerificationToken();
    expect(token).toMatch(/^[0-9a-f]{64}$/);
  });
  it('produces distinct values', () => {
    const a = generateVerificationToken();
    const b = generateVerificationToken();
    expect(a).not.toBe(b);
  });
});
```

- [ ] **Step 3: Run tests**

```bash
npm run test
```

Expected: all voting tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/lib/contest-voting.ts tests/lib/contest-voting.test.ts
git commit -m "feat(fotosoutez): voting rule engine with anti-fraud checks"
```

---

## Task 8: Supabase DB Helpers (contest-supabase.ts)

**Files:**
- Create: `src/lib/contest-supabase.ts`

- [ ] **Step 1: Create file**

```typescript
import { createServiceClient } from './supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

export interface ContestRound {
  id: string;
  slug: string;
  title: string;
  theme: string;
  description: string;
  hero_image: string | null;
  year: number;
  month: number | null;
  is_final: boolean;
  upload_starts_at: string;
  upload_ends_at: string;
  voting_starts_at: string;
  voting_ends_at: string;
  announcement_at: string;
  prize_first: string;
  prize_second: string | null;
  prize_third: string | null;
  status: 'draft' | 'published' | 'upload_open' | 'voting_open' | 'closed' | 'announced';
  winner_entry_id: string | null;
  runner_up_entry_id: string | null;
  third_place_entry_id: string | null;
  required_fields: unknown[];
  optional_fields: unknown[];
}

export interface ContestEntry {
  id: string;
  round_id: string;
  user_id: string;
  photo_path: string;
  photo_width: number;
  photo_height: number;
  title: string;
  caption: string | null;
  author_display_name: string;
  author_location: string | null;
  brand_slug: string | null;
  model_slug: string | null;
  series_slug: string | null;
  location_kraj_slug: string | null;
  location_okres_slug: string | null;
  year_taken: number | null;
  metadata: Record<string, unknown>;
  status: 'pending' | 'approved' | 'rejected' | 'disqualified';
  rejection_reason: string | null;
  vote_count: number;
  last_vote_at: string | null;
  license_merch_print: boolean;
  created_at: string;
}

export async function getActiveRound(client?: SupabaseClient): Promise<ContestRound | null> {
  const sb = client ?? createServiceClient();
  const { data } = await sb
    .from('contest_rounds')
    .select('*')
    .in('status', ['upload_open', 'voting_open', 'closed'])
    .order('voting_starts_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return data as ContestRound | null;
}

export async function getRoundBySlug(slug: string, client?: SupabaseClient): Promise<ContestRound | null> {
  const sb = client ?? createServiceClient();
  const { data } = await sb
    .from('contest_rounds')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  return data as ContestRound | null;
}

export async function getApprovedEntries(
  roundId: string,
  opts: { limit?: number; offset?: number } = {},
  client?: SupabaseClient,
): Promise<ContestEntry[]> {
  const sb = client ?? createServiceClient();
  const { data } = await sb
    .from('contest_entries')
    .select('*')
    .eq('round_id', roundId)
    .eq('status', 'approved')
    .order('vote_count', { ascending: false })
    .order('created_at', { ascending: true })
    .range(opts.offset ?? 0, (opts.offset ?? 0) + (opts.limit ?? 48) - 1);
  return (data ?? []) as ContestEntry[];
}

export async function getEntry(id: string, client?: SupabaseClient): Promise<ContestEntry | null> {
  const sb = client ?? createServiceClient();
  const { data } = await sb
    .from('contest_entries')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  return data as ContestEntry | null;
}

export async function countUserEntriesInRound(
  userId: string,
  roundId: string,
  client?: SupabaseClient,
): Promise<number> {
  const sb = client ?? createServiceClient();
  const { count } = await sb
    .from('contest_entries')
    .select('id', { count: 'exact', head: true })
    .eq('round_id', roundId)
    .eq('user_id', userId)
    .neq('status', 'rejected');
  return count ?? 0;
}

export async function getMyEntries(userId: string, client?: SupabaseClient): Promise<ContestEntry[]> {
  const sb = client ?? createServiceClient();
  const { data } = await sb
    .from('contest_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return (data ?? []) as ContestEntry[];
}

export async function getPendingEntries(limit = 48, client?: SupabaseClient): Promise<ContestEntry[]> {
  const sb = client ?? createServiceClient();
  const { data } = await sb
    .from('contest_entries')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(limit);
  return (data ?? []) as ContestEntry[];
}

export async function getPublicPhotoUrl(path: string): Promise<string> {
  const sb = createServiceClient();
  const { data } = sb.storage.from('contest-photos').getPublicUrl(path);
  return data.publicUrl;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx astro check
```

Expected: no errors in `src/lib/contest-supabase.ts`. If `SupabaseClient` import fails, check that `@supabase/supabase-js` types are installed.

- [ ] **Step 3: Commit**

```bash
git add src/lib/contest-supabase.ts
git commit -m "feat(fotosoutez): typed Supabase helpers for contest data"
```

---

## Task 9: Middleware Guards for Contest Routes

**Files:**
- Modify: `src/middleware.ts`

- [ ] **Step 1: Read current middleware**

Open `src/middleware.ts`. Current `PROTECTED_PATHS` is `['/bazar/novy', '/bazar/moje', '/bazar/profil']`.

- [ ] **Step 2: Add contest routes**

Change `PROTECTED_PATHS` to:

```typescript
const PROTECTED_PATHS = [
  '/bazar/novy',
  '/bazar/moje',
  '/bazar/profil',
  '/fotosoutez/nahrat',
  '/fotosoutez/moje',
];

const ADMIN_PATHS = ['/admin/'];
```

- [ ] **Step 3: Add admin guard after existing protected check**

Replace the "Protect routes" block:

```typescript
  const isProtected = PROTECTED_PATHS.some(p => url.pathname.startsWith(p));
  if (isProtected && !locals.user) {
    const redirectTarget = url.pathname.startsWith('/fotosoutez')
      ? `/bazar/prihlaseni/?redirect=${encodeURIComponent(url.pathname)}`
      : '/bazar/prihlaseni/';
    return redirect(redirectTarget);
  }

  const isAdmin = ADMIN_PATHS.some(p => url.pathname.startsWith(p));
  if (isAdmin) {
    if (!locals.user) {
      return redirect('/bazar/prihlaseni/?redirect=' + encodeURIComponent(url.pathname));
    }
    const sb = createAnonClient();
    const { data } = await sb
      .from('bazar_users')
      .select('is_admin')
      .eq('id', locals.user.id)
      .maybeSingle();
    if (!data?.is_admin) {
      return new Response('Forbidden', { status: 403 });
    }
  }

  return next();
});
```

- [ ] **Step 4: Verify build still works**

```bash
npm run build
```

Expected: build succeeds. If it fails because of `data?.is_admin` typing, cast: `(data as any)?.is_admin`.

- [ ] **Step 5: Commit**

```bash
git add src/middleware.ts
git commit -m "feat(fotosoutez): protect contest upload and /admin routes"
```

---

## Task 10: Resend Email Helper + Templates

**Files:**
- Create: `src/lib/contest-email.ts`
- Modify: `wrangler.toml`

- [ ] **Step 1: Add Resend secret to wrangler**

Open `wrangler.toml`. Under `[vars]` ensure only non-secret values. Run this in terminal to add the secret:

```bash
npx wrangler secret put RESEND_API_KEY
# Paste the Resend API key when prompted
```

Verify by listing:
```bash
npx wrangler secret list
```

- [ ] **Step 2: Create email helper file**

```typescript
// Resend wrapper with named template IDs. All emails go through sendContestEmail().
import { Resend } from 'resend';

const FROM = 'Fotosoutěž Agro-svět <fotosoutez@mail.agro-svet.cz>';
const BASE_URL = 'https://agro-svet.cz';

export type ContestEmailKind =
  | 'upload_pending'
  | 'upload_approved'
  | 'upload_rejected'
  | 'voting_started'
  | 'voting_ending'
  | 'winner_result'
  | 'finalist_notify'
  | 'magic_link';

interface BaseVars {
  to: string;
  display_name?: string;
}

interface MagicLinkVars extends BaseVars {
  verification_url: string;
  voting_ends_at: string;
  entry_title?: string;
  entry_author?: string;
}

interface UploadApprovedVars extends BaseVars {
  entry_title: string;
  share_url: string;
  round_title: string;
}

interface UploadRejectedVars extends BaseVars {
  entry_title: string;
  reason: string;
  round_title: string;
}

export type ContestEmailVars =
  | ({ kind: 'magic_link' } & MagicLinkVars)
  | ({ kind: 'upload_approved' } & UploadApprovedVars)
  | ({ kind: 'upload_rejected' } & UploadRejectedVars)
  | ({ kind: 'upload_pending' } & BaseVars & { entry_title: string })
  | ({ kind: 'voting_started' } & BaseVars & { round_title: string; entry_title: string; share_url: string })
  | ({ kind: 'voting_ending' } & BaseVars & { round_title: string; share_url: string })
  | ({ kind: 'winner_result' } & BaseVars & { round_title: string; placement: 1 | 2 | 3 | null; prize?: string })
  | ({ kind: 'finalist_notify' } & BaseVars & { round_title: string; placement: 1 | 2 | 3 });

interface Rendered {
  subject: string;
  html: string;
}

function render(vars: ContestEmailVars): Rendered {
  switch (vars.kind) {
    case 'magic_link':
      return {
        subject: 'Potvrďte svůj hlas ve Fotosoutěži Agro-svět',
        html: `
          <h1>Potvrzení hlasu</h1>
          <p>Ahoj${vars.display_name ? ' ' + vars.display_name : ''},</p>
          <p>kliknutím na tlačítko níže potvrdíte svůj hlas${vars.entry_title ? ` pro fotografii <strong>${vars.entry_title}</strong>` : ''}${vars.entry_author ? ` od ${vars.entry_author}` : ''}.</p>
          <p>Po ověření budete moci hlasovat <strong>1× za hodinu</strong> po celý zbytek kola (do ${vars.voting_ends_at}).</p>
          <p><a href="${vars.verification_url}" style="display:inline-block;background:#FFFF00;color:#000;padding:16px 32px;font-weight:bold;border-radius:10px;text-decoration:none">Potvrdit hlas</a></p>
          <p>Pokud jste o hlasování nežádali, email ignorujte.</p>
          <hr>
          <p style="font-size:12px;color:#666">Agro-svět, ${BASE_URL}</p>
        `,
      };
    case 'upload_pending':
      return {
        subject: 'Děkujeme za fotku — čeká na schválení',
        html: `<p>Ahoj ${vars.display_name ?? ''},</p>
          <p>děkujeme za nahrání fotky <strong>${vars.entry_title}</strong>. Náš admin ji zkontroluje a obvykle schválí do 24 hodin.</p>
          <p>Pošleme e-mail, jakmile bude fotka v galerii.</p>`,
      };
    case 'upload_approved':
      return {
        subject: `Vaše fotka "${vars.entry_title}" je schválena!`,
        html: `<p>Hurá! Vaše fotka je v galerii.</p>
          <p><a href="${vars.share_url}">${vars.share_url}</a></p>
          <p>Teď je čas sdílet s přáteli a získat co nejvíce hlasů 💪</p>`,
      };
    case 'upload_rejected':
      return {
        subject: 'Vaše fotka nebyla přijata',
        html: `<p>Omlouváme se, vaše fotka <strong>${vars.entry_title}</strong> nebyla přijata do ${vars.round_title}.</p>
          <p>Důvod: ${vars.reason}</p>
          <p>Můžete nahrát jinou fotku.</p>`,
      };
    case 'voting_started':
      return {
        subject: `Hlasování začalo — ${vars.round_title}`,
        html: `<p>Hlasovací fáze je otevřená. Sdílejte svůj odkaz pro získání hlasů:</p>
          <p><a href="${vars.share_url}">${vars.share_url}</a></p>`,
      };
    case 'voting_ending':
      return {
        subject: `Zbývá 24 hodin — ${vars.round_title}`,
        html: `<p>Hlasování končí za 24 h. Posledních pár hlasů dokáže zázraky — sdílejte:</p>
          <p><a href="${vars.share_url}">${vars.share_url}</a></p>`,
      };
    case 'winner_result': {
      const headline = vars.placement
        ? `Vyhráli jste ${vars.placement}. místo!`
        : 'Děkujeme za účast v soutěži';
      return {
        subject: `${vars.round_title} — výsledky`,
        html: `<h1>${headline}</h1>${vars.prize ? `<p>Výhra: ${vars.prize}</p>` : ''}`,
      };
    }
    case 'finalist_notify':
      return {
        subject: 'Postupujete do Grande Finále!',
        html: `<p>Gratulujeme — vaše fotka z ${vars.round_title} postoupila jako ${vars.placement}. místo do prosincového finále.</p>`,
      };
  }
}

export async function sendContestEmail(apiKey: string, vars: ContestEmailVars): Promise<void> {
  if (!apiKey) {
    console.warn('[contest-email] RESEND_API_KEY missing — skipping send', vars.kind, vars.to);
    return;
  }
  const resend = new Resend(apiKey);
  const { subject, html } = render(vars);
  const { error } = await resend.emails.send({
    from: FROM,
    to: vars.to,
    subject,
    html,
  });
  if (error) {
    console.error('[contest-email] send failed', vars.kind, vars.to, error);
    throw error;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/contest-email.ts
git commit -m "feat(fotosoutez): Resend-based email helper with 8 templates"
```

---

## Task 11: Image Processing + Turnstile Verifier

**Files:**
- Create: `src/lib/contest-images.ts`
- Create: `src/lib/contest-turnstile.ts`

- [ ] **Step 1: Create `src/lib/contest-images.ts`**

Image conversion on Cloudflare Workers uses Cloudflare Images API (bound automatically) or a lightweight resize/convert via `wasm-vips`. For MVP we use a pragmatic path: accept original JPEG/PNG, do NOT resize server-side (client already uploads reasonable sizes), but extract minimal EXIF presence using `@uploadthing/exif` or a tiny manual reader. We skip resize in MVP and add it in Phase 2.

```typescript
import { CONTEST_CONFIG } from './contest-config';

export interface UploadedImageMeta {
  ok: true;
  width: number;
  height: number;
  bytes: number;
  mime: string;
  has_exif: boolean;
}

export interface UploadRejection {
  ok: false;
  reason: 'too_big' | 'wrong_mime' | 'corrupt';
}

export type UploadValidation = UploadedImageMeta | UploadRejection;

/**
 * Minimal validator for an uploaded image File/Blob.
 * Reads first bytes to sniff size + EXIF presence.
 */
export async function validateUpload(file: File): Promise<UploadValidation> {
  if (file.size > CONTEST_CONFIG.MAX_UPLOAD_BYTES) {
    return { ok: false, reason: 'too_big' };
  }
  if (!CONTEST_CONFIG.ACCEPTED_MIME.includes(file.type)) {
    return { ok: false, reason: 'wrong_mime' };
  }

  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const dims = extractDimensions(bytes, file.type);
  if (!dims) {
    return { ok: false, reason: 'corrupt' };
  }

  return {
    ok: true,
    width: dims.width,
    height: dims.height,
    bytes: file.size,
    mime: file.type,
    has_exif: hasExifMarker(bytes, file.type),
  };
}

function extractDimensions(bytes: Uint8Array, mime: string): { width: number; height: number } | null {
  // PNG: IHDR @ offset 16 (8-byte signature + 4 chunk length + 4 chunk type)
  if (mime === 'image/png') {
    if (bytes.length < 24) return null;
    const width = (bytes[16] << 24) | (bytes[17] << 16) | (bytes[18] << 8) | bytes[19];
    const height = (bytes[20] << 24) | (bytes[21] << 16) | (bytes[22] << 8) | bytes[23];
    return { width, height };
  }
  // JPEG: walk segments until SOF0 (0xFFC0)
  if (mime === 'image/jpeg') {
    let i = 2;
    while (i < bytes.length) {
      if (bytes[i] !== 0xff) return null;
      const marker = bytes[i + 1];
      if (marker >= 0xc0 && marker <= 0xc3) {
        const height = (bytes[i + 5] << 8) | bytes[i + 6];
        const width = (bytes[i + 7] << 8) | bytes[i + 8];
        return { width, height };
      }
      const segLen = (bytes[i + 2] << 8) | bytes[i + 3];
      i += 2 + segLen;
    }
    return null;
  }
  // HEIC / WebP: skip detection for MVP
  return { width: 0, height: 0 };
}

function hasExifMarker(bytes: Uint8Array, mime: string): boolean {
  if (mime !== 'image/jpeg') return false;
  // Look for APP1 segment with "Exif\0" signature
  for (let i = 2; i < Math.min(bytes.length - 6, 2048); i++) {
    if (
      bytes[i] === 0xff && bytes[i + 1] === 0xe1 &&
      bytes[i + 4] === 0x45 && bytes[i + 5] === 0x78 && bytes[i + 6] === 0x69
    ) {
      return true;
    }
  }
  return false;
}

/** Build a storage path following the agreed pattern. */
export function buildStoragePath(userId: string, roundSlug: string, entryId: string, mime: string): string {
  const ext = mime === 'image/png' ? 'png' : mime === 'image/webp' ? 'webp' : 'jpg';
  return `${userId}/${roundSlug}/${entryId}.${ext}`;
}
```

- [ ] **Step 2: Create `src/lib/contest-turnstile.ts`**

```typescript
/**
 * Verify a Cloudflare Turnstile response token against Cloudflare's siteverify endpoint.
 * Returns true when the token is valid and comes from the expected action.
 */
const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstile(
  secret: string,
  token: string,
  ip?: string,
): Promise<boolean> {
  if (!secret || !token) return false;

  const body = new URLSearchParams({
    secret,
    response: token,
  });
  if (ip) body.set('remoteip', ip);

  try {
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    const json = (await res.json()) as { success?: boolean };
    return !!json.success;
  } catch (err) {
    console.warn('[turnstile] verify failed', err);
    return false;
  }
}
```

- [ ] **Step 3: Add Turnstile keys to wrangler**

```bash
npx wrangler secret put TURNSTILE_SECRET_KEY
```

Paste the Cloudflare Turnstile site secret (from Cloudflare Dashboard → Turnstile). The site key (public) goes to `wrangler.toml` under `[vars]`:

```toml
[vars]
PUBLIC_TURNSTILE_SITE_KEY = "0x4AA..." # visible in client; safe to publish
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/contest-images.ts src/lib/contest-turnstile.ts wrangler.toml
git commit -m "feat(fotosoutez): image validation + Turnstile verifier"
```

---

## Task 12: OG Image Generator

**Files:**
- Create: `src/lib/contest-og.ts`
- Create: `src/pages/fotosoutez/api/og/[id].png.ts`

- [ ] **Step 1: Create `src/lib/contest-og.ts`**

```typescript
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import type { ContestEntry } from './contest-supabase';

const ACCENT = '#FFFF00';
const WIDTH = 1200;
const HEIGHT = 630;

export interface OgInput {
  photo_url: string;
  title: string;
  author: string;
  vote_count: number;
}

/**
 * Renders a 1200×630 PNG suitable for og:image.
 * Caller is responsible for passing an absolute photo_url reachable by the Worker.
 */
export async function renderContestOg(input: OgInput, fontData: ArrayBuffer): Promise<Uint8Array> {
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: WIDTH,
          height: HEIGHT,
          position: 'relative',
          backgroundColor: '#000',
        },
        children: [
          {
            type: 'img',
            props: {
              src: input.photo_url,
              style: { width: '100%', height: '100%', objectFit: 'cover' },
            },
          },
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,.85) 0%, transparent 55%)',
              },
            },
          },
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: 40,
                left: 40,
                right: 40,
                display: 'flex',
                flexDirection: 'column',
                color: 'white',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { fontSize: 56, fontWeight: 900, lineHeight: 1.1 },
                    children: input.title,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: { fontSize: 28, marginTop: 8, opacity: 0.85 },
                    children: `Foto: ${input.author}`,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: { fontSize: 40, color: ACCENT, marginTop: 24, fontWeight: 700 },
                    children: `🏆 Fotosoutěž Agro-svět — ${input.vote_count} hlasů — HLASUJ!`,
                  },
                },
              ],
            },
          },
        ],
      },
    } as any,
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        { name: 'Chakra Petch', data: fontData, weight: 700, style: 'normal' },
      ],
    },
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } });
  return resvg.render().asPng();
}

export function entryToOgInput(entry: ContestEntry, photoUrl: string): OgInput {
  return {
    photo_url: photoUrl,
    title: entry.title,
    author: entry.author_display_name,
    vote_count: entry.vote_count,
  };
}
```

- [ ] **Step 2: Create API route `src/pages/fotosoutez/api/og/[id].png.ts`**

```typescript
import type { APIRoute } from 'astro';
import { getEntry, getPublicPhotoUrl } from '../../../../lib/contest-supabase';
import { renderContestOg, entryToOgInput } from '../../../../lib/contest-og';

// Load Chakra Petch font at build time from public dir
// Place the font file at public/fonts/ChakraPetch-Bold.ttf before running.
import fontBytesUrl from '../../../../../public/fonts/ChakraPetch-Bold.ttf?url';

export const prerender = false;

let cachedFont: ArrayBuffer | null = null;
async function loadFont(): Promise<ArrayBuffer> {
  if (cachedFont) return cachedFont;
  const res = await fetch(fontBytesUrl);
  cachedFont = await res.arrayBuffer();
  return cachedFont;
}

export const GET: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) return new Response('Missing id', { status: 400 });

  const entry = await getEntry(id);
  if (!entry || entry.status !== 'approved') {
    return new Response('Not found', { status: 404 });
  }

  const photoUrl = await getPublicPhotoUrl(entry.photo_path);
  const font = await loadFont();
  const png = await renderContestOg(entryToOgInput(entry, photoUrl), font);

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=300, s-maxage=600',
    },
  });
};
```

- [ ] **Step 3: Download Chakra Petch font**

```bash
mkdir -p public/fonts
curl -L -o public/fonts/ChakraPetch-Bold.ttf \
  "https://github.com/google/fonts/raw/main/ofl/chakrapetch/ChakraPetch-Bold.ttf"
ls -la public/fonts/ChakraPetch-Bold.ttf
```

Expected: file exists, ~80 KB.

- [ ] **Step 4: Build verify**

```bash
npm run build
```

Expected: build succeeds. If Resvg fails on Workers runtime ("require() is not defined" or similar), fall back to satori-only output (SVG). In that case, change the route to return `image/svg+xml` instead. Phase 2 can introduce Cloudflare Images.

- [ ] **Step 5: Commit**

```bash
git add public/fonts/ChakraPetch-Bold.ttf src/lib/contest-og.ts src/pages/fotosoutez/api/og/[id].png.ts
git commit -m "feat(fotosoutez): dynamic OG image generator with satori"
```

---

## Task 13: Upload API Endpoint

**Files:**
- Create: `src/pages/fotosoutez/api/upload.ts`

- [ ] **Step 1: Create file**

```typescript
import type { APIRoute } from 'astro';
import { createServiceClient, createAnonClient } from '../../../lib/supabase';
import { getActiveRound, countUserEntriesInRound } from '../../../lib/contest-supabase';
import { validateUpload, buildStoragePath } from '../../../lib/contest-images';
import { verifyTurnstile } from '../../../lib/contest-turnstile';
import { sendContestEmail } from '../../../lib/contest-email';
import { CONTEST_CONFIG } from '../../../lib/contest-config';
import { env } from 'cloudflare:workers';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals, clientAddress }) => {
  const user = locals.user;
  if (!user) {
    return json({ error: 'unauthenticated' }, 401);
  }

  const form = await request.formData();
  const file = form.get('photo');
  if (!(file instanceof File)) {
    return json({ error: 'missing_photo' }, 400);
  }

  const turnstileToken = String(form.get('turnstile_token') ?? '');
  const okTurnstile = await verifyTurnstile((env as any).TURNSTILE_SECRET_KEY, turnstileToken, clientAddress);
  if (!okTurnstile) {
    return json({ error: 'captcha_failed' }, 400);
  }

  const round = await getActiveRound();
  if (!round || round.status !== 'upload_open') {
    return json({ error: 'upload_closed' }, 400);
  }

  const existingCount = await countUserEntriesInRound(user.id, round.id);
  if (existingCount >= CONTEST_CONFIG.MAX_ENTRIES_PER_ROUND) {
    return json({ error: 'entry_limit' }, 400);
  }

  const imageCheck = await validateUpload(file);
  if (!imageCheck.ok) {
    return json({ error: 'invalid_image', reason: imageCheck.reason }, 400);
  }

  const title = String(form.get('title') ?? '').trim().slice(0, 80);
  if (!title) return json({ error: 'missing_title' }, 400);

  const caption = String(form.get('caption') ?? '').trim().slice(0, 500) || null;
  const displayName = String(form.get('author_display_name') ?? '').trim().slice(0, 80);
  if (!displayName) return json({ error: 'missing_display_name' }, 400);

  const confirmSelf = form.get('confirm_self_author') === 'on';
  const confirmRules = form.get('confirm_rules') === 'on';
  if (!confirmSelf || !confirmRules) {
    return json({ error: 'missing_consent' }, 400);
  }

  const sbService = createServiceClient();

  // Insert entry row first so we can use its id in the storage path
  const { data: inserted, error: insertErr } = await sbService
    .from('contest_entries')
    .insert({
      round_id: round.id,
      user_id: user.id,
      photo_path: 'pending', // updated after upload succeeds
      photo_width: imageCheck.width,
      photo_height: imageCheck.height,
      title,
      caption,
      author_display_name: displayName,
      author_location: String(form.get('author_location') ?? '').trim() || null,
      brand_slug: String(form.get('brand_slug') ?? '').trim() || null,
      model_slug: String(form.get('model_slug') ?? '').trim() || null,
      series_slug: String(form.get('series_slug') ?? '').trim() || null,
      location_kraj_slug: String(form.get('location_kraj_slug') ?? '').trim() || null,
      location_okres_slug: String(form.get('location_okres_slug') ?? '').trim() || null,
      year_taken: Number(form.get('year_taken')) || null,
      exif_has_metadata: imageCheck.has_exif,
      upload_ip: clientAddress,
      upload_user_agent: request.headers.get('user-agent'),
      license_merch_print: form.get('license_merch_print') === 'on',
      status: 'pending',
    })
    .select('id')
    .single();

  if (insertErr || !inserted) {
    return json({ error: 'db_insert_failed', detail: insertErr?.message }, 500);
  }

  const storagePath = buildStoragePath(user.id, round.slug, inserted.id, imageCheck.mime);
  const arrayBuffer = await file.arrayBuffer();
  const { error: storageErr } = await sbService.storage
    .from('contest-photos')
    .upload(storagePath, arrayBuffer, {
      contentType: imageCheck.mime,
      upsert: false,
    });

  if (storageErr) {
    // rollback entry
    await sbService.from('contest_entries').delete().eq('id', inserted.id);
    return json({ error: 'storage_upload_failed', detail: storageErr.message }, 500);
  }

  await sbService
    .from('contest_entries')
    .update({ photo_path: storagePath })
    .eq('id', inserted.id);

  // Fire-and-forget email notification
  const userEmail = user.email;
  if (userEmail) {
    sendContestEmail((env as any).RESEND_API_KEY, {
      kind: 'upload_pending',
      to: userEmail,
      display_name: displayName,
      entry_title: title,
    }).catch(err => console.error('[upload] email failed', err));
  }

  return json({ ok: true, entry_id: inserted.id });
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/fotosoutez/api/upload.ts
git commit -m "feat(fotosoutez): upload API with moderation queue + storage"
```

---

## Task 14: Voting API — request-verification + verify-email + vote

**Files:**
- Create: `src/pages/fotosoutez/api/request-verification.ts`
- Create: `src/pages/fotosoutez/api/verify-email.ts`
- Create: `src/pages/fotosoutez/api/vote.ts`

- [ ] **Step 1: Create `request-verification.ts`**

```typescript
import type { APIRoute } from 'astro';
import { createServiceClient } from '../../../lib/supabase';
import { getActiveRound, getEntry } from '../../../lib/contest-supabase';
import { verifyTurnstile } from '../../../lib/contest-turnstile';
import { generateVerificationToken } from '../../../lib/contest-voting';
import { sendContestEmail } from '../../../lib/contest-email';
import { env } from 'cloudflare:workers';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const form = await request.formData();
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const entryId = String(form.get('entry_id') ?? '');
  const turnstile = String(form.get('turnstile_token') ?? '');

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'invalid_email' }, 400);
  }
  if (!entryId) return json({ error: 'missing_entry' }, 400);
  if (!(await verifyTurnstile((env as any).TURNSTILE_SECRET_KEY, turnstile, clientAddress))) {
    return json({ error: 'captcha_failed' }, 400);
  }

  const round = await getActiveRound();
  if (!round || round.status !== 'voting_open') {
    return json({ error: 'voting_closed' }, 400);
  }

  const entry = await getEntry(entryId);
  if (!entry || entry.status !== 'approved' || entry.round_id !== round.id) {
    return json({ error: 'entry_not_found' }, 404);
  }

  const sb = createServiceClient();

  // Reuse existing voter for this round+email or create new
  const { data: existing } = await sb
    .from('contest_voters')
    .select('id, email_verified, cookie_id')
    .eq('round_id', round.id)
    .eq('email', email)
    .maybeSingle();

  const token = generateVerificationToken();

  let voterId: string;
  if (existing) {
    await sb.from('contest_voters')
      .update({
        verification_token: token,
        verification_sent_at: new Date().toISOString(),
      })
      .eq('id', existing.id);
    voterId = existing.id;
  } else {
    const { data: created, error } = await sb.from('contest_voters').insert({
      round_id: round.id,
      email,
      verification_token: token,
      verification_sent_at: new Date().toISOString(),
      first_ip: clientAddress,
      first_user_agent: request.headers.get('user-agent'),
    }).select('id').single();
    if (error || !created) return json({ error: 'db_failed' }, 500);
    voterId = created.id;
  }

  const verifyUrl = `https://agro-svet.cz/fotosoutez/api/verify-email?token=${token}&entry=${entryId}`;

  await sendContestEmail((env as any).RESEND_API_KEY, {
    kind: 'magic_link',
    to: email,
    verification_url: verifyUrl,
    voting_ends_at: new Date(round.voting_ends_at).toLocaleString('cs-CZ'),
    entry_title: entry.title,
    entry_author: entry.author_display_name,
  });

  return json({ ok: true, voter_id: voterId });
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}
```

- [ ] **Step 2: Create `verify-email.ts`**

```typescript
import type { APIRoute } from 'astro';
import { createServiceClient } from '../../../lib/supabase';
import { getEntry } from '../../../lib/contest-supabase';
import { CONTEST_CONFIG } from '../../../lib/contest-config';
import { canVote } from '../../../lib/contest-voting';

export const prerender = false;

export const GET: APIRoute = async ({ url, cookies, clientAddress, request, redirect }) => {
  const token = url.searchParams.get('token');
  const entryId = url.searchParams.get('entry');
  if (!token) return new Response('Missing token', { status: 400 });

  const sb = createServiceClient();

  const { data: voter } = await sb
    .from('contest_voters')
    .select('*')
    .eq('verification_token', token)
    .maybeSingle();

  if (!voter) return new Response('Invalid or expired link', { status: 400 });

  await sb.from('contest_voters').update({
    email_verified: true,
    verified_at: new Date().toISOString(),
    verification_token: null,
  }).eq('id', voter.id);

  const { data: round } = await sb
    .from('contest_rounds')
    .select('voting_ends_at, slug')
    .eq('id', voter.round_id)
    .single();

  cookies.set(CONTEST_CONFIG.VOTER_COOKIE, voter.cookie_id, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    expires: round ? new Date(round.voting_ends_at) : undefined,
  });

  // If an entry was passed, cast the first vote inline
  let castedFirstVote = false;
  if (entryId) {
    const entry = await getEntry(entryId);
    if (entry && entry.status === 'approved' && entry.round_id === voter.round_id) {
      const { data: voterHistory } = await sb
        .from('contest_votes')
        .select('voter_id, voted_at, ip, is_valid')
        .eq('voter_id', voter.id);

      const since = new Date(Date.now() - 86_400_000).toISOString();
      const { data: ipHistory } = await sb
        .from('contest_votes')
        .select('voter_id, voted_at, ip, is_valid')
        .eq('ip', clientAddress)
        .gte('voted_at', since);

      const decision = canVote({
        voter: { email_verified: true },
        voter_history: voterHistory ?? [],
        ip_history_last_24h: ipHistory ?? [],
        entry_owner_id: entry.user_id,
        voter_user_id: null,
      });
      if (decision.ok) {
        await sb.from('contest_votes').insert({
          entry_id: entryId,
          voter_id: voter.id,
          ip: clientAddress,
          user_agent: request.headers.get('user-agent'),
        });
        castedFirstVote = true;
      }
    }
  }

  const roundSlug = round?.slug ?? '';
  const target = entryId
    ? `/fotosoutez/foto/${entryId}?verified=1${castedFirstVote ? '&voted=1' : ''}`
    : `/fotosoutez/${roundSlug}/?verified=1`;
  return redirect(target);
};
```

- [ ] **Step 3: Create `vote.ts`**

```typescript
import type { APIRoute } from 'astro';
import { createServiceClient } from '../../../lib/supabase';
import { getEntry, getActiveRound } from '../../../lib/contest-supabase';
import { canVote } from '../../../lib/contest-voting';
import { CONTEST_CONFIG } from '../../../lib/contest-config';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, clientAddress, locals }) => {
  const form = await request.formData();
  const entryId = String(form.get('entry_id') ?? '');
  if (!entryId) return json({ error: 'missing_entry' }, 400);

  const cookieId = cookies.get(CONTEST_CONFIG.VOTER_COOKIE)?.value;
  if (!cookieId) return json({ error: 'not_verified', action: 'request_verification' }, 401);

  const sb = createServiceClient();

  const { data: voter } = await sb
    .from('contest_voters')
    .select('*')
    .eq('cookie_id', cookieId)
    .maybeSingle();
  if (!voter || !voter.email_verified) {
    return json({ error: 'not_verified', action: 'request_verification' }, 401);
  }

  const entry = await getEntry(entryId);
  if (!entry || entry.status !== 'approved' || entry.round_id !== voter.round_id) {
    return json({ error: 'entry_not_found' }, 404);
  }

  const round = await getActiveRound();
  if (!round || round.status !== 'voting_open' || round.id !== voter.round_id) {
    return json({ error: 'voting_closed' }, 400);
  }

  const { data: voterHistory } = await sb
    .from('contest_votes')
    .select('voter_id, voted_at, ip, is_valid')
    .eq('voter_id', voter.id);

  const since = new Date(Date.now() - 86_400_000).toISOString();
  const { data: ipHistory } = await sb
    .from('contest_votes')
    .select('voter_id, voted_at, ip, is_valid')
    .eq('ip', clientAddress)
    .gte('voted_at', since);

  const decision = canVote({
    voter: { email_verified: true },
    voter_history: voterHistory ?? [],
    ip_history_last_24h: ipHistory ?? [],
    entry_owner_id: entry.user_id,
    voter_user_id: locals.user?.id ?? null,
  });

  if (!decision.ok) {
    return json({ error: decision.reason, retry_after_ms: 'retry_after_ms' in decision ? decision.retry_after_ms : null }, 429);
  }

  const { error } = await sb.from('contest_votes').insert({
    entry_id: entryId,
    voter_id: voter.id,
    ip: clientAddress,
    user_agent: request.headers.get('user-agent'),
  });
  if (error) return json({ error: 'db_insert_failed', detail: error.message }, 500);

  // Re-read vote_count after trigger
  const { data: updated } = await sb
    .from('contest_entries')
    .select('vote_count')
    .eq('id', entryId)
    .maybeSingle();

  return json({ ok: true, vote_count: updated?.vote_count ?? entry.vote_count + 1 });
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/fotosoutez/api/request-verification.ts src/pages/fotosoutez/api/verify-email.ts src/pages/fotosoutez/api/vote.ts
git commit -m "feat(fotosoutez): voting API — magic link + verify + cast"
```

---

## Task 15: Live Leaderboard API

**Files:**
- Create: `src/pages/fotosoutez/api/leaderboard.ts`

- [ ] **Step 1: Create endpoint**

```typescript
import type { APIRoute } from 'astro';
import { createServiceClient } from '../../../lib/supabase';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const roundSlug = url.searchParams.get('round');
  const limit = Math.min(50, Number(url.searchParams.get('limit') ?? 10));
  if (!roundSlug) return json({ error: 'missing_round' }, 400);

  const sb = createServiceClient();
  const { data: round } = await sb
    .from('contest_rounds')
    .select('id, slug, voting_ends_at, status')
    .eq('slug', roundSlug)
    .maybeSingle();
  if (!round) return json({ error: 'round_not_found' }, 404);

  const { data: entries } = await sb
    .from('contest_entries')
    .select('id, title, author_display_name, photo_path, vote_count, last_vote_at')
    .eq('round_id', round.id)
    .eq('status', 'approved')
    .order('vote_count', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(limit);

  const since = new Date(Date.now() - 3_600_000).toISOString();

  const hourlyCounts = new Map<string, number>();
  if (entries && entries.length > 0) {
    const ids = entries.map(e => e.id);
    const { data: recentVotes } = await sb
      .from('contest_votes')
      .select('entry_id')
      .in('entry_id', ids)
      .gte('voted_at', since)
      .eq('is_valid', true);
    for (const v of recentVotes ?? []) {
      hourlyCounts.set(v.entry_id, (hourlyCounts.get(v.entry_id) ?? 0) + 1);
    }
  }

  const body = {
    round: { slug: round.slug, voting_ends_at: round.voting_ends_at, status: round.status },
    entries: (entries ?? []).map((e, i) => ({
      id: e.id,
      rank: i + 1,
      title: e.title,
      author: e.author_display_name,
      vote_count: e.vote_count,
      last_hour_votes: hourlyCounts.get(e.id) ?? 0,
      photo_url: `https://obhypfuzmknvmknskdwh.supabase.co/storage/v1/object/public/contest-photos/${e.photo_path}`,
    })),
  };

  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
    },
  });
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/fotosoutez/api/leaderboard.ts
git commit -m "feat(fotosoutez): leaderboard API with per-hour vote counts"
```

---

## Task 16: Shared UI Components (cards, header, share, leaderboard)

**Files:**
- Create: `src/components/contest/ContestRoundHeader.astro`
- Create: `src/components/contest/ContestEntryCard.astro`
- Create: `src/components/contest/ContestShareButtons.astro`
- Create: `src/components/contest/ContestLiveLeaderboard.astro`

- [ ] **Step 1: Create `ContestRoundHeader.astro`**

```astro
---
import type { ContestRound } from '../../lib/contest-supabase';
import { computeRoundPhase, formatCountdown, msUntil } from '../../lib/contest-config';

interface Props { round: ContestRound }
const { round } = Astro.props;
const phase = computeRoundPhase(round);
const now = new Date();

const labels: Record<string, string> = {
  upcoming: 'Brzy',
  upload_open: 'Nahrávání otevřené',
  between: 'Upload uzavřen — brzy hlasování',
  voting_open: 'Hlasování otevřené',
  closed: 'Hlasování uzavřeno',
  announced: 'Výsledky vyhlášeny',
};

let countdownTarget: string | null = null;
let countdownLabel = '';
if (phase === 'upload_open') {
  countdownTarget = typeof round.upload_ends_at === 'string' ? round.upload_ends_at : String(round.upload_ends_at);
  countdownLabel = 'Upload končí za';
} else if (phase === 'voting_open') {
  countdownTarget = typeof round.voting_ends_at === 'string' ? round.voting_ends_at : String(round.voting_ends_at);
  countdownLabel = 'Hlasování končí za';
} else if (phase === 'upcoming') {
  countdownTarget = typeof round.upload_starts_at === 'string' ? round.upload_starts_at : String(round.upload_starts_at);
  countdownLabel = 'Začíná za';
}
const remaining = countdownTarget ? formatCountdown(msUntil(countdownTarget, now)) : '';
---
<section class="rounded-[22px] bg-neutral-900 text-white p-8 mb-8">
  {round.hero_image && <img src={round.hero_image} alt="" class="w-full h-64 object-cover rounded-[18px] mb-6" />}
  <div class="flex flex-wrap gap-2 items-center mb-4">
    <span class="bg-[#FFFF00] text-black text-sm font-bold px-3 py-1 rounded-[6px]">{labels[phase]}</span>
    <span class="text-neutral-400 text-sm">{round.theme}</span>
  </div>
  <h1 class="text-4xl font-black mb-4" style="font-family:'Chakra Petch'">{round.title}</h1>
  <p class="text-neutral-300 max-w-3xl">{round.description}</p>
  {countdownTarget && (
    <p class="mt-6 text-lg">{countdownLabel}: <strong class="text-[#FFFF00]">{remaining}</strong></p>
  )}
  {phase === 'upload_open' && (
    <a href="/fotosoutez/nahrat" class="inline-block mt-6 bg-[#FFFF00] text-black font-bold px-6 py-3 rounded-[10px]">Nahrát fotku</a>
  )}
</section>
```

- [ ] **Step 2: Create `ContestEntryCard.astro`**

```astro
---
import type { ContestEntry } from '../../lib/contest-supabase';
import { formatLokalita } from '../../lib/lokality';

interface Props { entry: ContestEntry; rank?: number }
const { entry, rank } = Astro.props;
const photoUrl = `https://obhypfuzmknvmknskdwh.supabase.co/storage/v1/object/public/contest-photos/${entry.photo_path}`;
const lokalita = formatLokalita(entry.location_kraj_slug, entry.location_okres_slug);
---
<a href={`/fotosoutez/foto/${entry.id}/`} class="block group rounded-[18px] overflow-hidden bg-neutral-900 text-white">
  <div class="aspect-[4/3] relative overflow-hidden">
    <img src={photoUrl} alt={entry.title} loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition" />
    {rank && rank <= 3 && (
      <span class="absolute top-3 left-3 bg-[#FFFF00] text-black font-black w-10 h-10 rounded-full grid place-items-center">
        {rank}
      </span>
    )}
    <span class="absolute bottom-3 right-3 bg-black/80 text-white text-sm font-bold px-3 py-1 rounded-[6px]">
      🗳️ {entry.vote_count}
    </span>
  </div>
  <div class="p-4">
    <h3 class="font-bold text-lg line-clamp-2" style="font-family:'Chakra Petch'">{entry.title}</h3>
    <p class="text-sm text-neutral-400 mt-1">Foto: {entry.author_display_name}{lokalita && ` • ${lokalita}`}</p>
  </div>
</a>
```

- [ ] **Step 3: Create `ContestShareButtons.astro`**

```astro
---
interface Props {
  url: string;
  title: string;
}
const { url, title } = Astro.props;
const encodedUrl = encodeURIComponent(url);
const encodedText = encodeURIComponent(`${title} — hlasujte ve Fotosoutěži Agro-svět!`);
---
<div class="flex flex-wrap gap-2 items-center">
  <span class="text-sm text-neutral-500 mr-2">Sdílet:</span>
  <a target="_blank" rel="noopener" href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} class="px-3 py-2 bg-[#1877F2] text-white rounded-[6px] text-sm">Facebook</a>
  <a target="_blank" rel="noopener" href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`} class="px-3 py-2 bg-[#25D366] text-white rounded-[6px] text-sm">WhatsApp</a>
  <a target="_blank" rel="noopener" href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`} class="px-3 py-2 bg-[#229ED9] text-white rounded-[6px] text-sm">Telegram</a>
  <a target="_blank" rel="noopener" href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`} class="px-3 py-2 bg-black text-white rounded-[6px] text-sm">X</a>
  <button type="button" data-share-copy={url} class="px-3 py-2 bg-neutral-800 text-white rounded-[6px] text-sm">Zkopírovat odkaz</button>
</div>

<script>
  document.querySelectorAll<HTMLButtonElement>('[data-share-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.dataset.shareCopy!;
      navigator.clipboard.writeText(url).then(() => {
        const old = btn.textContent;
        btn.textContent = 'Zkopírováno!';
        setTimeout(() => { btn.textContent = old; }, 1500);
      });
    });
  });
</script>
```

- [ ] **Step 4: Create `ContestLiveLeaderboard.astro`**

```astro
---
interface Props {
  roundSlug: string;
  initialEntries: Array<{ id: string; rank: number; title: string; author: string; vote_count: number; photo_url: string }>;
}
const { roundSlug, initialEntries } = Astro.props;
---
<aside class="rounded-[18px] bg-neutral-900 text-white p-4" data-leaderboard data-round-slug={roundSlug}>
  <h2 class="font-black text-xl mb-4" style="font-family:'Chakra Petch'">🏆 TOP {initialEntries.length}</h2>
  <ol class="space-y-3" data-leaderboard-list>
    {initialEntries.map(e => (
      <li class="flex gap-3 items-center" data-entry-id={e.id}>
        <span class="text-2xl font-black text-[#FFFF00] w-8" data-rank>{e.rank}</span>
        <img src={e.photo_url} alt="" class="w-14 h-14 object-cover rounded-[6px]" loading="lazy" />
        <div class="flex-1 min-w-0">
          <a href={`/fotosoutez/foto/${e.id}/`} class="font-bold text-sm line-clamp-1">{e.title}</a>
          <p class="text-xs text-neutral-400">{e.author} • <span data-votes>{e.vote_count}</span> hlasů</p>
        </div>
      </li>
    ))}
  </ol>
  <p class="text-xs text-neutral-500 mt-4">Aktualizuje se každých 30 s</p>
</aside>

<script>
  const board = document.querySelector<HTMLElement>('[data-leaderboard]');
  if (board) {
    const roundSlug = board.dataset.roundSlug!;
    async function refresh() {
      if (document.hidden) return;
      try {
        const res = await fetch(`/fotosoutez/api/leaderboard?round=${roundSlug}&limit=10`);
        const json = await res.json();
        const list = board.querySelector<HTMLElement>('[data-leaderboard-list]')!;
        json.entries.forEach((e: any) => {
          const li = list.querySelector<HTMLElement>(`[data-entry-id="${e.id}"]`);
          if (!li) return;
          li.querySelector<HTMLElement>('[data-rank]')!.textContent = String(e.rank);
          li.querySelector<HTMLElement>('[data-votes]')!.textContent = String(e.vote_count);
        });
      } catch (err) { console.warn('leaderboard refresh failed', err); }
    }
    setInterval(refresh, 30_000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
  }
</script>
```

- [ ] **Step 5: Commit**

```bash
git add src/components/contest/
git commit -m "feat(fotosoutez): shared UI — round header, card, share, leaderboard"
```

---

## Task 17: Hub Page `/fotosoutez/`

**Files:**
- Create: `src/pages/fotosoutez/index.astro`

- [ ] **Step 1: Create page**

```astro
---
export const prerender = false;

import Layout from '../../layouts/Layout.astro';
import ContestRoundHeader from '../../components/contest/ContestRoundHeader.astro';
import ContestEntryCard from '../../components/contest/ContestEntryCard.astro';
import ContestLiveLeaderboard from '../../components/contest/ContestLiveLeaderboard.astro';
import { getActiveRound, getApprovedEntries, getPublicPhotoUrl } from '../../lib/contest-supabase';
import { computeRoundPhase } from '../../lib/contest-config';

const round = await getActiveRound();
const entries = round ? await getApprovedEntries(round.id, { limit: 12 }) : [];
const phase = round ? computeRoundPhase(round) : null;

const leaderboard = await Promise.all(
  entries.slice(0, 10).map(async (e, i) => ({
    id: e.id,
    rank: i + 1,
    title: e.title,
    author: e.author_display_name,
    vote_count: e.vote_count,
    photo_url: await getPublicPhotoUrl(e.photo_path),
  }))
);
---
<Layout title="Fotosoutěž Agro-svět 2026" description="Měsíční fotosoutěž o zemědělské technice. Hlavní cena 5 000 Kč + zarámovaný print.">
  <main class="max-w-6xl mx-auto px-4 py-8">
    {!round && (
      <section class="text-center py-20">
        <h1 class="text-4xl font-black mb-4">Fotosoutěž brzy začne</h1>
        <p class="text-neutral-500">Sledujte nás na sociálních sítích.</p>
      </section>
    )}
    {round && (
      <>
        <ContestRoundHeader round={round} />
        <div class="grid md:grid-cols-[1fr_320px] gap-8">
          <section>
            <h2 class="text-2xl font-black mb-4" style="font-family:'Chakra Petch'">Galerie</h2>
            {entries.length === 0 && (
              <p class="text-neutral-500 py-8">Zatím žádné schválené fotky — buďte první!</p>
            )}
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {entries.map((e, i) => <ContestEntryCard entry={e} rank={phase === 'voting_open' ? i + 1 : undefined} />)}
            </div>
            {entries.length > 0 && (
              <a href={`/fotosoutez/${round.slug}/`} class="inline-block mt-6 text-neutral-400 hover:text-[#FFFF00]">
                Zobrazit všechny →
              </a>
            )}
          </section>
          {phase === 'voting_open' && leaderboard.length > 0 && (
            <ContestLiveLeaderboard roundSlug={round.slug} initialEntries={leaderboard} />
          )}
        </div>
        <section class="mt-12 grid sm:grid-cols-3 gap-4">
          <a href="/fotosoutez/pravidla/" class="block p-4 bg-neutral-900 text-white rounded-[18px] hover:border-[#FFFF00]">Pravidla soutěže</a>
          <a href="/fotosoutez/archiv/" class="block p-4 bg-neutral-900 text-white rounded-[18px] hover:border-[#FFFF00]">Archiv kol</a>
          <a href="/fotosoutez/moje/" class="block p-4 bg-neutral-900 text-white rounded-[18px] hover:border-[#FFFF00]">Moje fotky</a>
        </section>
      </>
    )}
  </main>
</Layout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/fotosoutez/index.astro
git commit -m "feat(fotosoutez): hub page with current round + gallery teaser"
```

---

## Task 18: Round Gallery `/fotosoutez/[mesic]/`

**Files:**
- Create: `src/pages/fotosoutez/[mesic].astro`

- [ ] **Step 1: Create page**

```astro
---
export const prerender = false;

import Layout from '../../layouts/Layout.astro';
import ContestRoundHeader from '../../components/contest/ContestRoundHeader.astro';
import ContestEntryCard from '../../components/contest/ContestEntryCard.astro';
import ContestLiveLeaderboard from '../../components/contest/ContestLiveLeaderboard.astro';
import { getRoundBySlug, getApprovedEntries, getPublicPhotoUrl } from '../../lib/contest-supabase';
import { computeRoundPhase } from '../../lib/contest-config';

const slug = Astro.params.mesic;
if (!slug) return Astro.redirect('/fotosoutez/');

const round = await getRoundBySlug(slug);
if (!round) return Astro.redirect('/fotosoutez/');

const entries = await getApprovedEntries(round.id, { limit: 120 });
const phase = computeRoundPhase(round);
const leaderboard = await Promise.all(
  entries.slice(0, 10).map(async (e, i) => ({
    id: e.id,
    rank: i + 1,
    title: e.title,
    author: e.author_display_name,
    vote_count: e.vote_count,
    photo_url: await getPublicPhotoUrl(e.photo_path),
  }))
);
---
<Layout title={`${round.title} — Fotosoutěž Agro-svět`} description={round.description}>
  <main class="max-w-6xl mx-auto px-4 py-8">
    <ContestRoundHeader round={round} />
    <div class="grid md:grid-cols-[1fr_320px] gap-8">
      <section>
        <h2 class="text-2xl font-black mb-4" style="font-family:'Chakra Petch'">Galerie ({entries.length})</h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map((e, i) => <ContestEntryCard entry={e} rank={phase === 'voting_open' ? i + 1 : undefined} />)}
        </div>
        {entries.length === 0 && <p class="text-neutral-500 py-8">Zatím žádné schválené fotky.</p>}
      </section>
      {phase === 'voting_open' && leaderboard.length > 0 && (
        <ContestLiveLeaderboard roundSlug={round.slug} initialEntries={leaderboard} />
      )}
    </div>
  </main>
</Layout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/fotosoutez/\[mesic\].astro
git commit -m "feat(fotosoutez): round gallery page"
```

---

## Task 19: Entry Detail `/fotosoutez/foto/[id]/` + Vote CTA

**Files:**
- Create: `src/pages/fotosoutez/foto/[id].astro`
- Create: `src/components/contest/ContestVoteButton.astro`

- [ ] **Step 1: Create `ContestVoteButton.astro`**

```astro
---
interface Props {
  entryId: string;
  voteCount: number;
  turnstileSiteKey: string;
}
const { entryId, voteCount, turnstileSiteKey } = Astro.props;
---
<div data-vote-widget data-entry-id={entryId}>
  <button
    type="button"
    data-vote-btn
    class="w-full py-4 bg-[#FFFF00] text-black font-black text-lg rounded-[10px] hover:bg-yellow-300 transition"
  >
    🗳️ Hlasovat (<span data-vote-count>{voteCount}</span> hlasů)
  </button>
  <p data-vote-message class="text-sm text-neutral-500 mt-3 hidden"></p>

  <dialog data-email-modal class="rounded-[18px] p-8 max-w-md w-full">
    <h3 class="text-xl font-black mb-4" style="font-family:'Chakra Petch'">Pro hlasování zadejte e-mail</h3>
    <p class="text-sm text-neutral-600 mb-4">Pošleme vám ověřovací odkaz. Po kliknutí se váš hlas započítá a budete moci hlasovat 1× za hodinu po zbytek kola.</p>
    <form data-email-form class="space-y-4">
      <input type="email" name="email" required placeholder="vas@email.cz" class="w-full px-4 py-2 border rounded-[10px]" />
      <div class="cf-turnstile" data-sitekey={turnstileSiteKey}></div>
      <div class="flex gap-2">
        <button type="submit" class="flex-1 bg-[#FFFF00] text-black font-bold py-2 rounded-[10px]">Poslat odkaz</button>
        <button type="button" data-close-modal class="px-4 py-2 border rounded-[10px]">Zrušit</button>
      </div>
      <p data-email-error class="text-sm text-red-600 hidden"></p>
    </form>
  </dialog>
</div>

<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>

<script>
  const widget = document.querySelector<HTMLElement>('[data-vote-widget]');
  if (widget) {
    const entryId = widget.dataset.entryId!;
    const btn = widget.querySelector<HTMLButtonElement>('[data-vote-btn]')!;
    const modal = widget.querySelector<HTMLDialogElement>('[data-email-modal]')!;
    const form = widget.querySelector<HTMLFormElement>('[data-email-form]')!;
    const errorEl = widget.querySelector<HTMLElement>('[data-email-error]')!;
    const messageEl = widget.querySelector<HTMLElement>('[data-vote-message]')!;
    const countEl = widget.querySelector<HTMLElement>('[data-vote-count]')!;
    const closeBtn = widget.querySelector<HTMLButtonElement>('[data-close-modal]')!;

    closeBtn.addEventListener('click', () => modal.close());

    async function castVote() {
      const fd = new FormData();
      fd.append('entry_id', entryId);
      const res = await fetch('/fotosoutez/api/vote', { method: 'POST', body: fd });
      const json = await res.json();
      if (res.ok) {
        countEl.textContent = String(json.vote_count);
        btn.disabled = true;
        messageEl.textContent = 'Hlas započítán! Další hlas za 1 h.';
        messageEl.classList.remove('hidden');
      } else if (json.action === 'request_verification') {
        modal.showModal();
      } else if (json.error === 'cooldown') {
        const mins = Math.ceil((json.retry_after_ms ?? 3_600_000) / 60_000);
        messageEl.textContent = `Hlasovat lze znovu za ${mins} min.`;
        messageEl.classList.remove('hidden');
      } else if (json.error === 'own_entry') {
        messageEl.textContent = 'Pro vlastní fotku nelze hlasovat.';
        messageEl.classList.remove('hidden');
      } else {
        messageEl.textContent = 'Hlasování selhalo.';
        messageEl.classList.remove('hidden');
      }
    }

    btn.addEventListener('click', () => castVote());

    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const fd = new FormData(form);
      fd.append('entry_id', entryId);
      fd.append('turnstile_token', (form.elements.namedItem('cf-turnstile-response') as HTMLInputElement)?.value ?? '');
      const res = await fetch('/fotosoutez/api/request-verification', { method: 'POST', body: fd });
      const json = await res.json();
      if (res.ok) {
        modal.close();
        messageEl.textContent = 'Zkontrolujte svůj e-mail a klikněte na ověřovací odkaz.';
        messageEl.classList.remove('hidden');
      } else {
        errorEl.textContent = `Chyba: ${json.error ?? 'neznámá'}`;
        errorEl.classList.remove('hidden');
      }
    });
  }
</script>
```

- [ ] **Step 2: Create `foto/[id].astro`**

```astro
---
export const prerender = false;

import Layout from '../../../layouts/Layout.astro';
import ContestVoteButton from '../../../components/contest/ContestVoteButton.astro';
import ContestShareButtons from '../../../components/contest/ContestShareButtons.astro';
import { getEntry, getRoundBySlug, getPublicPhotoUrl } from '../../../lib/contest-supabase';
import { createServiceClient } from '../../../lib/supabase';
import { formatLokalita } from '../../../lib/lokality';
import { computeRoundPhase } from '../../../lib/contest-config';
import { getModelBySlug, getBrand } from '../../../lib/stroje';

const id = Astro.params.id;
if (!id) return Astro.redirect('/fotosoutez/');

const entry = await getEntry(id);
if (!entry || entry.status !== 'approved') return Astro.redirect('/fotosoutez/');

const sb = createServiceClient();
const { data: round } = await sb
  .from('contest_rounds')
  .select('*')
  .eq('id', entry.round_id)
  .single();

const phase = round ? computeRoundPhase(round) : 'closed';
const canVote = phase === 'voting_open';
const photoUrl = await getPublicPhotoUrl(entry.photo_path);
const lokalita = formatLokalita(entry.location_kraj_slug, entry.location_okres_slug);
const brand = entry.brand_slug ? getBrand(entry.brand_slug) : null;
const model = entry.model_slug ? getModelBySlug(entry.model_slug) : null;

const siteUrl = `https://agro-svet.cz/fotosoutez/foto/${entry.id}`;
const ogUrl = `https://agro-svet.cz/fotosoutez/api/og/${entry.id}.png`;
const turnstileSiteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? '';
---
<Layout
  title={`${entry.title} — Fotosoutěž Agro-svět`}
  description={entry.caption ?? `Foto od ${entry.author_display_name}. Hlasujte!`}
  ogImage={ogUrl}
>
  <main class="max-w-4xl mx-auto px-4 py-8">
    <a href={round ? `/fotosoutez/${round.slug}/` : '/fotosoutez/'} class="text-sm text-neutral-500 hover:text-[#FFFF00]">← Zpět do galerie</a>

    <div class="mt-4 rounded-[22px] overflow-hidden bg-black">
      <img src={photoUrl} alt={entry.title} class="w-full max-h-[70vh] object-contain" />
    </div>

    <div class="mt-6 grid md:grid-cols-[1fr_280px] gap-6">
      <div>
        <h1 class="text-3xl font-black" style="font-family:'Chakra Petch'">{entry.title}</h1>
        <p class="text-neutral-500 mt-2">Foto: <strong>{entry.author_display_name}</strong>{lokalita && ` • ${lokalita}`}</p>
        {entry.caption && <p class="mt-4 text-neutral-700 whitespace-pre-wrap">{entry.caption}</p>}

        <dl class="mt-6 grid grid-cols-2 gap-y-2 text-sm">
          {brand && <><dt class="text-neutral-500">Značka</dt><dd>{brand.name}</dd></>}
          {model && <><dt class="text-neutral-500">Model</dt><dd>{model.name}</dd></>}
          {entry.year_taken && <><dt class="text-neutral-500">Rok fotky</dt><dd>{entry.year_taken}</dd></>}
        </dl>

        <div class="mt-6">
          <ContestShareButtons url={siteUrl} title={entry.title} />
        </div>
      </div>

      <aside>
        {canVote ? (
          <ContestVoteButton entryId={entry.id} voteCount={entry.vote_count} turnstileSiteKey={turnstileSiteKey} />
        ) : (
          <div class="p-4 bg-neutral-100 rounded-[10px] text-center">
            <p class="text-2xl font-black">{entry.vote_count}</p>
            <p class="text-sm text-neutral-500">hlasů</p>
            <p class="text-xs text-neutral-400 mt-2">{phase === 'announced' ? 'Výsledky vyhlášeny' : 'Hlasování zatím neběží'}</p>
          </div>
        )}
      </aside>
    </div>
  </main>
</Layout>
```

Note: `Layout.astro` must accept an `ogImage` prop. If it does not, open `src/layouts/Layout.astro` and add:
```astro
---
interface Props { title: string; description?: string; ogImage?: string; }
const { title, description, ogImage } = Astro.props;
---
```
and in the head section:
```astro
{ogImage && <meta property="og:image" content={ogImage} />}
{ogImage && <meta property="og:image:width" content="1200" />}
{ogImage && <meta property="og:image:height" content="630" />}
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/fotosoutez/foto/\[id\].astro src/components/contest/ContestVoteButton.astro src/layouts/Layout.astro
git commit -m "feat(fotosoutez): entry detail with vote CTA + email modal"
```

---

## Task 20: Upload Page `/fotosoutez/nahrat/`

**Files:**
- Create: `src/pages/fotosoutez/nahrat.astro`

- [ ] **Step 1: Create page**

```astro
---
export const prerender = false;

import Layout from '../../layouts/Layout.astro';
import { getActiveRound } from '../../lib/contest-supabase';
import { getAllBrands } from '../../lib/stroje';
import { getKraje } from '../../lib/lokality';
import { CONTEST_CONFIG } from '../../lib/contest-config';
import { computeRoundPhase } from '../../lib/contest-config';

const user = Astro.locals.user;
const round = await getActiveRound();
const phase = round ? computeRoundPhase(round) : null;
const canUpload = phase === 'upload_open';

const brands = getAllBrands();
const kraje = getKraje();
const turnstileSiteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? '';
---
<Layout title="Nahrát fotku — Fotosoutěž Agro-svět" description="Nahrajte svou fotografii">
  <main class="max-w-2xl mx-auto px-4 py-8">
    <a href="/fotosoutez/" class="text-sm text-neutral-500 hover:text-[#FFFF00]">← Zpět</a>
    <h1 class="text-3xl font-black mt-2 mb-2" style="font-family:'Chakra Petch'">Nahrát fotku</h1>

    {!canUpload && (
      <p class="p-4 bg-neutral-100 rounded-[10px]">
        Upload je aktuálně uzavřen. Přijďte zpět, až bude nové kolo otevřeno.
      </p>
    )}

    {canUpload && round && (
      <>
        <p class="text-neutral-500 mb-6">Kolo: <strong>{round.title}</strong></p>
        <form id="upload-form" enctype="multipart/form-data" class="space-y-4">
          <div>
            <label class="block font-bold mb-1">Fotografie *</label>
            <input type="file" name="photo" accept="image/jpeg,image/png,image/webp,image/heic" required class="w-full" />
            <p class="text-xs text-neutral-500 mt-1">Max 15 MB, JPG/PNG/WebP/HEIC</p>
          </div>

          <div>
            <label class="block font-bold mb-1">Název fotky *</label>
            <input type="text" name="title" required maxlength="80" class="w-full px-3 py-2 border rounded-[10px]" />
          </div>

          <div>
            <label class="block font-bold mb-1">Popisek (volitelné)</label>
            <textarea name="caption" maxlength="500" rows="3" class="w-full px-3 py-2 border rounded-[10px]"></textarea>
          </div>

          <div>
            <label class="block font-bold mb-1">Jméno pod fotkou *</label>
            <input type="text" name="author_display_name" required maxlength="80" value={user?.user_metadata?.name ?? ''} class="w-full px-3 py-2 border rounded-[10px]" />
          </div>

          <details class="border rounded-[10px] p-4">
            <summary class="font-bold cursor-pointer">Dodatečné údaje (pomohou vyhledat fotku v archivu)</summary>
            <div class="space-y-4 mt-4">
              <div>
                <label class="block text-sm mb-1">Značka</label>
                <select name="brand_slug" class="w-full px-3 py-2 border rounded-[10px]">
                  <option value="">— vyberte —</option>
                  {brands.map(b => <option value={b.slug}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label class="block text-sm mb-1">Kraj</label>
                <select name="location_kraj_slug" id="kraj-select" class="w-full px-3 py-2 border rounded-[10px]">
                  <option value="">— vyberte —</option>
                  {kraje.map(k => <option value={k.slug}>{k.name}</option>)}
                </select>
              </div>
              <div>
                <label class="block text-sm mb-1">Okres</label>
                <select name="location_okres_slug" id="okres-select" class="w-full px-3 py-2 border rounded-[10px]" disabled>
                  <option value="">— nejprve vyberte kraj —</option>
                </select>
              </div>
              <div>
                <label class="block text-sm mb-1">Rok pořízení</label>
                <input type="number" name="year_taken" min="1900" max="2030" class="w-full px-3 py-2 border rounded-[10px]" />
              </div>
            </div>
          </details>

          <div class="space-y-2">
            <label class="flex gap-2">
              <input type="checkbox" name="confirm_self_author" required />
              <span class="text-sm">Fotku jsem pořídil(a) sám/sama a není generovaná umělou inteligencí. *</span>
            </label>
            <label class="flex gap-2">
              <input type="checkbox" name="confirm_rules" required />
              <span class="text-sm">Souhlasím s <a href="/fotosoutez/pravidla/" class="underline">pravidly soutěže</a> a <a href="/fotosoutez/gdpr/" class="underline">zpracováním osobních údajů</a>. *</span>
            </label>
            <label class="flex gap-2">
              <input type="checkbox" name="license_merch_print" />
              <span class="text-sm">Dobrovolně souhlasím s případným použitím fotky v kalendáři Agro-svět 2027 a merchandise.</span>
            </label>
          </div>

          <div class="cf-turnstile" data-sitekey={turnstileSiteKey}></div>

          <button type="submit" class="w-full bg-[#FFFF00] text-black font-black py-3 rounded-[10px]">Nahrát fotku</button>
          <p id="upload-message" class="text-sm hidden"></p>
        </form>

        <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>

        <script is:inline define:vars={{ okresyData: kraje }}>
          // Populate okres select based on kraj
          const krajSelect = document.getElementById('kraj-select');
          const okresSelect = document.getElementById('okres-select');
          krajSelect?.addEventListener('change', () => {
            const k = okresyData.find(x => x.slug === krajSelect.value);
            okresSelect.innerHTML = '<option value="">— vyberte —</option>';
            if (k) {
              okresSelect.disabled = false;
              for (const o of k.okresy) {
                const opt = document.createElement('option');
                opt.value = o.slug;
                opt.textContent = o.name;
                okresSelect.appendChild(opt);
              }
            } else {
              okresSelect.disabled = true;
            }
          });
        </script>

        <script>
          const form = document.getElementById('upload-form') as HTMLFormElement;
          const msg = document.getElementById('upload-message') as HTMLElement;
          form?.addEventListener('submit', async (ev) => {
            ev.preventDefault();
            const fd = new FormData(form);
            const ts = (form.elements.namedItem('cf-turnstile-response') as HTMLInputElement)?.value;
            if (ts) fd.append('turnstile_token', ts);
            msg.textContent = 'Nahrávám…'; msg.classList.remove('hidden');
            const res = await fetch('/fotosoutez/api/upload', { method: 'POST', body: fd });
            const json = await res.json();
            if (res.ok) {
              msg.textContent = '✅ Fotka nahrána, čeká na schválení. Přesměrovávám...';
              setTimeout(() => location.href = '/fotosoutez/moje/', 1500);
            } else {
              msg.textContent = `❌ Chyba: ${json.error ?? 'neznámá'} ${json.reason ?? ''}`;
            }
          });
        </script>
      </>
    )}
  </main>
</Layout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/fotosoutez/nahrat.astro
git commit -m "feat(fotosoutez): upload page with form + validation + Turnstile"
```

---

## Task 21: My Entries Dashboard `/fotosoutez/moje/`

**Files:**
- Create: `src/pages/fotosoutez/moje/index.astro`

- [ ] **Step 1: Create page**

```astro
---
export const prerender = false;

import Layout from '../../../layouts/Layout.astro';
import { getMyEntries, getPublicPhotoUrl } from '../../../lib/contest-supabase';

const user = Astro.locals.user!;
const entries = await getMyEntries(user.id);

const statusLabels: Record<string, { text: string; cls: string }> = {
  pending:       { text: 'Čeká na schválení', cls: 'bg-yellow-100 text-yellow-900' },
  approved:      { text: 'V galerii',         cls: 'bg-green-100 text-green-900' },
  rejected:      { text: 'Zamítnuto',         cls: 'bg-red-100 text-red-900' },
  disqualified:  { text: 'Diskvalifikováno',  cls: 'bg-neutral-200 text-neutral-700' },
};

const withUrls = await Promise.all(entries.map(async e => ({ entry: e, url: await getPublicPhotoUrl(e.photo_path) })));
---
<Layout title="Moje fotky — Fotosoutěž Agro-svět" description="Vaše příspěvky">
  <main class="max-w-5xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-black mb-6" style="font-family:'Chakra Petch'">Moje fotky</h1>
    {entries.length === 0 && (
      <p class="text-neutral-500">Zatím jste nenahráli žádnou fotku. <a href="/fotosoutez/nahrat/" class="text-[#FFFF00] underline">Nahrát první</a>.</p>
    )}
    <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
      {withUrls.map(({ entry, url }) => {
        const label = statusLabels[entry.status] ?? statusLabels.pending;
        return (
          <div class="bg-neutral-900 text-white rounded-[18px] overflow-hidden">
            <img src={url} alt="" class="w-full aspect-[4/3] object-cover" />
            <div class="p-4">
              <span class={`inline-block text-xs font-bold px-2 py-1 rounded-[6px] ${label.cls}`}>{label.text}</span>
              <h3 class="font-bold mt-2 line-clamp-1">{entry.title}</h3>
              {entry.status === 'approved' && <p class="text-sm text-neutral-400 mt-1">🗳️ {entry.vote_count} hlasů</p>}
              {entry.rejection_reason && <p class="text-sm text-red-400 mt-1">Důvod: {entry.rejection_reason}</p>}
              {entry.status === 'approved' && (
                <a href={`/fotosoutez/foto/${entry.id}/`} class="block mt-2 text-xs text-[#FFFF00] underline">Zobrazit v galerii →</a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  </main>
</Layout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/fotosoutez/moje/index.astro
git commit -m "feat(fotosoutez): user dashboard with entry status"
```

---

## Task 22: Rules + GDPR Pages

**Files:**
- Create: `src/pages/fotosoutez/pravidla.astro`
- Create: `src/pages/fotosoutez/gdpr.astro`

- [ ] **Step 1: Create `pravidla.astro`**

```astro
---
import Layout from '../../layouts/Layout.astro';
---
<Layout title="Pravidla soutěže — Fotosoutěž Agro-svět 2026" description="Úplná pravidla fotosoutěže">
  <main class="max-w-3xl mx-auto px-4 py-8 prose prose-neutral">
    <h1>Pravidla soutěže „Fotograf roku Agro-svět 2026"</h1>
    <p><strong>Účinnost:</strong> 1. ledna 2026<br><strong>Verze:</strong> 1.0</p>

    <h2>1. Pořadatel</h2>
    <p>Pořadatelem soutěže je <strong>{`{{POŘADATEL_JMENO}}`}</strong>, IČ: {`{{IC}}`}, se sídlem {`{{ADRESA}}`}, e-mail: {`{{KONTAKT}}`}.</p>

    <h2>2. Termín konání</h2>
    <p>Soutěž probíhá od 1. ledna 2026 do 31. prosince 2026. Skládá se z 12 měsíčních kol a Grande Finále (1.–20. prosince).</p>

    <h2>3. Kdo se může zúčastnit</h2>
    <ul>
      <li>Fyzická osoba starší 18 let</li>
      <li>S trvalým bydlištěm v České republice nebo SR</li>
      <li>Ne zaměstnanci pořadatele ani osoby s nimi spojené</li>
    </ul>

    <h2>4. Mechanika</h2>
    <h3>4.1 Upload</h3>
    <p>Účastník se zaregistruje a v každém měsíčním kole může nahrát <strong>maximálně 3 fotografie</strong> odpovídající tématu kola. Fotografie musí být původní, účastníkem pořízená, nesmí být generovaná umělou inteligencí.</p>
    <h3>4.2 Fáze měsíce</h3>
    <ul>
      <li>Dny 1–10: nahrávání</li>
      <li>Dny 11–28: hlasování veřejnosti</li>
      <li>Dny 29–30: vyhlášení</li>
    </ul>
    <h3>4.3 Hlasování</h3>
    <p>Hlasovat může každý, kdo ověří svůj e-mail (1× za kolo) přes zaslaný odkaz. Po ověření lze hlasovat <strong>1× za hodinu</strong> pro libovolnou fotografii. Nelze hlasovat pro vlastní fotografii.</p>
    <h3>4.4 Vyhodnocení</h3>
    <p>V každém kole vítězí fotografie s nejvyšším počtem platných hlasů. TOP 3 z každého kola postupují do Grande Finále, kde se rozhoduje o ceně 5 000 Kč + fyzických cenách.</p>

    <h2>5. Ceny</h2>
    <h3>5.1 Měsíční</h3>
    <ul>
      <li>1. místo: 1 000 Kč + triko Agro-svět + rozhovor</li>
      <li>2. místo: 500 Kč + triko</li>
      <li>3. místo: 300 Kč + triko</li>
    </ul>
    <h3>5.2 Hlavní cena (Grande Finále)</h3>
    <ul>
      <li>1. místo: <strong>5 000 Kč + zarámovaný A2 tisk + merch balíček + voucher</strong></li>
      <li>2. místo: 2 000 Kč + tisk + merch</li>
      <li>3. místo: 1 000 Kč + merch</li>
    </ul>
    <h3>5.3 Daňové aspekty</h3>
    <p>Výhry z veřejných soutěží jsou osvobozeny od daně z příjmů fyzických osob dle § 10 odst. 1 písm. h) zákona č. 586/1992 Sb., pokud nepřesáhnou 10 000 Kč. Hlavní cena 5 000 Kč je tedy osvobozena a výherce ji nemusí danit.</p>
    <h3>5.4 Doručení ceny</h3>
    <p>Finanční cenu zasíláme převodem na účet, fyzické ceny poštou na adresu v ČR/SR. Výherce je povinen dodat údaje do 14 dnů od vyhlášení, jinak cena propadá.</p>

    <h2>6. Autorská práva a licence</h2>
    <p>Nahráním fotografie účastník prohlašuje, že fotografii pořídil sám, vlastní ji, není AI generovaná. Uděluje pořadateli <strong>nevýhradní bezplatnou licenci</strong> k použití na agro-svet.cz a sociálních sítích Agro-svět s atribucí autora do 31. 12. 2029. Volitelně lze udělit souhlas s použitím v kalendáři 2027 / merchandise.</p>

    <h2>7. Ochrana proti podvodům</h2>
    <p>Pořadatel si vyhrazuje právo diskvalifikovat fotografii nebo zrušit hlasy při podezření z manipulace, botů nebo porušení pravidel. Případný sousední v pořadí pak postupuje namísto diskvalifikovaného.</p>

    <h2>8. Ochrana osobních údajů</h2>
    <p>Podrobně v <a href="/fotosoutez/gdpr/">Zpracování osobních údajů</a>.</p>

    <h2>9. Reklamace</h2>
    <p>Stížnosti zasílejte na {`{{KONTAKT}}`}. Pořadatel vyřídí do 30 dnů. Mimosoudní řešení sporů: Česká obchodní inspekce (www.coi.cz).</p>

    <h2>10. Závěrečná ustanovení</h2>
    <p>Pořadatel si vyhrazuje právo měnit pravidla se zveřejněním na této stránce. Účast je dobrovolná a bezplatná.</p>

    <p><strong>Kontakt:</strong> {`{{KONTAKT}}`}<br><strong>Poslední změna:</strong> 2026-01-01</p>
  </main>
</Layout>
```

- [ ] **Step 2: Create `gdpr.astro`**

```astro
---
import Layout from '../../layouts/Layout.astro';
---
<Layout title="Zpracování osobních údajů — Fotosoutěž Agro-svět" description="GDPR dokument fotosoutěže">
  <main class="max-w-3xl mx-auto px-4 py-8 prose prose-neutral">
    <h1>Zpracování osobních údajů — Fotosoutěž Agro-svět 2026</h1>

    <h2>1. Správce</h2>
    <p>{`{{POŘADATEL}}`} (dále „Správce") — IČ {`{{IC}}`}, sídlo {`{{ADRESA}}`}, e-mail {`{{KONTAKT}}`}.</p>

    <h2>2. Zpracovávané údaje</h2>
    <h3>2.1 Od účastníků (uploaderů)</h3>
    <ul>
      <li>Jméno a příjmení (nebo přezdívka)</li>
      <li>E-mail, heslo (hashované)</li>
      <li>Telefon, adresa, číslo účtu — pouze při výhře</li>
      <li>Fotografie včetně EXIF metadat</li>
      <li>IP adresa, user agent (anti-fraud)</li>
    </ul>
    <h3>2.2 Od voterů</h3>
    <ul>
      <li>E-mail (pro ověření hlasu)</li>
      <li>IP adresa, user agent, cookie identifier</li>
    </ul>

    <h2>3. Právní základ</h2>
    <ul>
      <li>Plnění smlouvy — účast v soutěži</li>
      <li>Oprávněný zájem — anti-fraud</li>
      <li>Souhlas — marketing (opt-in)</li>
      <li>Právní povinnost — daňové povinnosti</li>
    </ul>

    <h2>4. Doba uchování</h2>
    <ul>
      <li>Účastnická data: po dobu soutěže + 3 roky</li>
      <li>Fotografie: po dobu soutěže + 3 roky (licence)</li>
      <li>Hlasovací data: 2 roky</li>
      <li>Marketing souhlas: do odvolání</li>
    </ul>

    <h2>5. Příjemci</h2>
    <ul>
      <li>Resend.com (email delivery) — USA, Standard Contractual Clauses</li>
      <li>Supabase (hosting dat) — EU/USA, SCC</li>
      <li>Cloudflare (CDN, hosting) — globální</li>
    </ul>

    <h2>6. Práva subjektu</h2>
    <ul>
      <li>Přístup (čl. 15), oprava (16), výmaz (17), omezení zpracování (18), přenositelnost (20), námitka (21)</li>
      <li>Odvolání souhlasu kdykoli</li>
    </ul>
    <p>Žádosti na {`{{KONTAKT}}`} — vyřízení do 30 dnů.</p>

    <h2>7. Stížnost</h2>
    <p>U Úřadu pro ochranu osobních údajů (www.uoou.cz).</p>

    <h2>8. Cookies</h2>
    <ul>
      <li><code>sb-access-token</code>, <code>sb-refresh-token</code> — auth (Supabase)</li>
      <li><code>contest_voter_id</code> — identifikace voltera v kole</li>
      <li><code>cf-turnstile</code> — anti-bot Cloudflare</li>
    </ul>

    <p><strong>Účinnost:</strong> 1. ledna 2026</p>
  </main>
</Layout>
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/fotosoutez/pravidla.astro src/pages/fotosoutez/gdpr.astro
git commit -m "feat(fotosoutez): rules and GDPR pages (draft with placeholders)"
```

---

## Task 23: Archive Page `/fotosoutez/archiv/`

**Files:**
- Create: `src/pages/fotosoutez/archiv.astro`

- [ ] **Step 1: Create page**

```astro
---
export const prerender = false;

import Layout from '../../layouts/Layout.astro';
import { createServiceClient } from '../../lib/supabase';

const sb = createServiceClient();
const { data: rounds } = await sb
  .from('contest_rounds')
  .select('id, slug, title, theme, year, month, status, hero_image, winner_entry_id')
  .in('status', ['announced', 'closed'])
  .order('year', { ascending: false })
  .order('month', { ascending: false });

let winners: Record<string, { photo_path: string; title: string; author_display_name: string }> = {};
const winnerIds = (rounds ?? []).map(r => r.winner_entry_id).filter(Boolean) as string[];
if (winnerIds.length > 0) {
  const { data: winnerEntries } = await sb
    .from('contest_entries')
    .select('id, photo_path, title, author_display_name')
    .in('id', winnerIds);
  for (const w of winnerEntries ?? []) {
    winners[w.id] = w;
  }
}
---
<Layout title="Archiv — Fotosoutěž Agro-svět" description="Všechna historická kola a výherci">
  <main class="max-w-5xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-black mb-8" style="font-family:'Chakra Petch'">Archiv kol</h1>
    {(!rounds || rounds.length === 0) && <p class="text-neutral-500">Archiv je zatím prázdný.</p>}
    <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
      {(rounds ?? []).map(r => {
        const w = r.winner_entry_id ? winners[r.winner_entry_id] : null;
        return (
          <a href={`/fotosoutez/${r.slug}/`} class="block rounded-[18px] overflow-hidden bg-neutral-900 text-white">
            {w && <img src={`https://obhypfuzmknvmknskdwh.supabase.co/storage/v1/object/public/contest-photos/${w.photo_path}`} alt="" class="w-full aspect-[4/3] object-cover" />}
            <div class="p-4">
              <h3 class="font-bold">{r.title}</h3>
              <p class="text-sm text-neutral-400">{r.theme}</p>
              {w && <p class="text-xs text-[#FFFF00] mt-2">🏆 {w.title} — {w.author_display_name}</p>}
            </div>
          </a>
        );
      })}
    </div>
  </main>
</Layout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/fotosoutez/archiv.astro
git commit -m "feat(fotosoutez): archive page with past winners"
```

---

## Task 24: Minimal Admin Moderation `/admin/fotosoutez/`

For MVP we implement the admin in agro-svet repo. Phase 2 migrates to content-network-cms.

**Files:**
- Create: `src/pages/admin/fotosoutez/index.astro`
- Create: `src/pages/admin/fotosoutez/moderace.astro`
- Create: `src/pages/admin/fotosoutez/api/moderate.ts`

- [ ] **Step 1: Create index `/admin/fotosoutez/index.astro`**

```astro
---
export const prerender = false;
import Layout from '../../../layouts/Layout.astro';
import { createServiceClient } from '../../../lib/supabase';

const sb = createServiceClient();
const { count: pendingCount } = await sb
  .from('contest_entries')
  .select('id', { count: 'exact', head: true })
  .eq('status', 'pending');
const { data: activeRound } = await sb
  .from('contest_rounds')
  .select('*')
  .in('status', ['upload_open', 'voting_open', 'closed'])
  .maybeSingle();
---
<Layout title="Admin — Fotosoutěž" description="Administrace">
  <main class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-black mb-8" style="font-family:'Chakra Petch'">Fotosoutěž — admin</h1>

    <div class="grid sm:grid-cols-3 gap-4 mb-8">
      <a href="/admin/fotosoutez/moderace/" class="block p-6 bg-neutral-900 text-white rounded-[18px] hover:border-[#FFFF00]">
        <h3 class="font-bold mb-2">Moderace</h3>
        <p class="text-3xl font-black text-[#FFFF00]">{pendingCount ?? 0}</p>
        <p class="text-sm text-neutral-400">čeká na schválení</p>
      </a>
      <div class="p-6 bg-neutral-900 text-white rounded-[18px]">
        <h3 class="font-bold mb-2">Aktivní kolo</h3>
        <p class="text-lg">{activeRound?.title ?? '—'}</p>
        <p class="text-sm text-neutral-400">{activeRound?.status ?? ''}</p>
      </div>
      <div class="p-6 bg-neutral-900 text-white rounded-[18px]">
        <h3 class="font-bold mb-2">Kola</h3>
        <p class="text-sm">Správa přes Supabase SQL editor (MVP)</p>
      </div>
    </div>
  </main>
</Layout>
```

- [ ] **Step 2: Create `/admin/fotosoutez/moderace.astro`**

```astro
---
export const prerender = false;
import Layout from '../../../layouts/Layout.astro';
import { getPendingEntries, getPublicPhotoUrl } from '../../../lib/contest-supabase';

const entries = await getPendingEntries(50);
const withUrls = await Promise.all(entries.map(async e => ({ entry: e, url: await getPublicPhotoUrl(e.photo_path) })));
---
<Layout title="Moderace — Fotosoutěž admin" description="">
  <main class="max-w-5xl mx-auto px-4 py-8">
    <a href="/admin/fotosoutez/" class="text-sm text-neutral-500">← Přehled</a>
    <h1 class="text-3xl font-black mt-2 mb-6" style="font-family:'Chakra Petch'">Moderace ({entries.length})</h1>

    {entries.length === 0 && <p class="text-neutral-500">Žádné čekající fotky.</p>}

    <div class="grid sm:grid-cols-2 gap-4">
      {withUrls.map(({ entry, url }) => (
        <div class="bg-neutral-900 text-white rounded-[18px] overflow-hidden" data-entry-card data-entry-id={entry.id}>
          <img src={url} alt="" class="w-full aspect-[4/3] object-cover" />
          <div class="p-4 space-y-2">
            <h3 class="font-bold">{entry.title}</h3>
            <p class="text-sm text-neutral-400">Autor: {entry.author_display_name}</p>
            {entry.caption && <p class="text-xs text-neutral-500 line-clamp-2">{entry.caption}</p>}
            {!entry.exif_has_metadata && <span class="inline-block text-xs px-2 py-1 bg-orange-600 rounded-[6px]">Chybí EXIF</span>}
            <div class="flex gap-2 pt-2">
              <button type="button" data-approve class="flex-1 bg-green-600 text-white py-2 rounded-[6px] font-bold">✓ Schválit</button>
              <button type="button" data-reject class="flex-1 bg-red-600 text-white py-2 rounded-[6px] font-bold">✗ Odmítnout</button>
            </div>
          </div>
        </div>
      ))}
    </div>

    <script>
      document.querySelectorAll<HTMLElement>('[data-entry-card]').forEach(card => {
        const id = card.dataset.entryId!;
        const approveBtn = card.querySelector<HTMLButtonElement>('[data-approve]')!;
        const rejectBtn = card.querySelector<HTMLButtonElement>('[data-reject]')!;

        async function moderate(action: 'approve' | 'reject') {
          const reason = action === 'reject' ? prompt('Důvod odmítnutí:') : null;
          if (action === 'reject' && !reason) return;
          const fd = new FormData();
          fd.append('entry_id', id);
          fd.append('action', action);
          if (reason) fd.append('reason', reason);
          const res = await fetch('/admin/fotosoutez/api/moderate', { method: 'POST', body: fd });
          if (res.ok) card.remove();
          else alert('Chyba moderace');
        }

        approveBtn.addEventListener('click', () => moderate('approve'));
        rejectBtn.addEventListener('click', () => moderate('reject'));
      });
    </script>
  </main>
</Layout>
```

- [ ] **Step 3: Create moderate API endpoint**

```typescript
// src/pages/admin/fotosoutez/api/moderate.ts
import type { APIRoute } from 'astro';
import { createServiceClient } from '../../../../lib/supabase';
import { getEntry } from '../../../../lib/contest-supabase';
import { sendContestEmail } from '../../../../lib/contest-email';
import { env } from 'cloudflare:workers';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) return json({ error: 'unauthenticated' }, 401);

  const sb = createServiceClient();
  const { data: profile } = await sb
    .from('bazar_users')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();
  if (!profile?.is_admin) return json({ error: 'forbidden' }, 403);

  const form = await request.formData();
  const entryId = String(form.get('entry_id') ?? '');
  const action = String(form.get('action') ?? '');
  const reason = String(form.get('reason') ?? '');
  if (!entryId || !['approve', 'reject'].includes(action)) return json({ error: 'bad_request' }, 400);

  const entry = await getEntry(entryId);
  if (!entry) return json({ error: 'not_found' }, 404);

  const newStatus = action === 'approve' ? 'approved' : 'rejected';
  await sb.from('contest_entries').update({
    status: newStatus,
    rejection_reason: action === 'reject' ? reason : null,
    moderated_by: user.id,
    moderated_at: new Date().toISOString(),
  }).eq('id', entryId);

  await sb.from('contest_admin_log').insert({
    admin_user_id: user.id,
    action: action === 'approve' ? 'approve_entry' : 'reject_entry',
    target_type: 'entry',
    target_id: entryId,
    details: action === 'reject' ? { reason } : null,
  });

  // Fire email
  const { data: owner } = await sb.from('bazar_users').select('email, contest_display_name, name').eq('id', entry.user_id).maybeSingle();
  const { data: round } = await sb.from('contest_rounds').select('title').eq('id', entry.round_id).single();
  if (owner?.email) {
    if (action === 'approve') {
      sendContestEmail((env as any).RESEND_API_KEY, {
        kind: 'upload_approved',
        to: owner.email,
        display_name: owner.contest_display_name ?? owner.name,
        entry_title: entry.title,
        round_title: round?.title ?? '',
        share_url: `https://agro-svet.cz/fotosoutez/foto/${entry.id}/`,
      }).catch(e => console.error('email failed', e));
    } else {
      sendContestEmail((env as any).RESEND_API_KEY, {
        kind: 'upload_rejected',
        to: owner.email,
        display_name: owner.contest_display_name ?? owner.name,
        entry_title: entry.title,
        round_title: round?.title ?? '',
        reason,
      }).catch(e => console.error('email failed', e));
    }
  }

  return json({ ok: true });
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/admin/fotosoutez/
git commit -m "feat(fotosoutez): minimal MVP admin (moderation queue + approve/reject API)"
```

---

## Task 25: Hub Navigation + Layout Integration

**Files:**
- Modify: `src/components/Header.astro` (existing)

- [ ] **Step 1: Inspect current header**

Open `src/components/Header.astro` and locate the nav links array (or JSX). Identify where `bazar` link is added.

- [ ] **Step 2: Add "Fotosoutěž" nav item**

Next to the bazar link, add an entry:

```astro
<a href="/fotosoutez/" class="nav-link">Fotosoutěž</a>
```

Follow the existing Header's styling pattern (class names match bazar link). Keep the pattern tight — if the nav uses an array of `{ href, label }` items, append `{ href: '/fotosoutez/', label: 'Fotosoutěž' }`.

- [ ] **Step 3: Build check**

```bash
npm run build
```

Expected: build succeeds. Spot-check `dist/fotosoutez/index.html` (if prerender was used) or try `npm run preview`.

- [ ] **Step 4: Commit**

```bash
git add src/components/Header.astro
git commit -m "feat(fotosoutez): add Fotosoutěž link to main nav"
```

---

## Task 26: Seed First Round (May 2026)

Administrative task — run in Supabase SQL editor.

- [ ] **Step 1: Build the seed SQL**

Copy this into Supabase SQL editor (update dates if starting later than May 2026):

```sql
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
```

- [ ] **Step 2: Verify round is visible**

Open `https://agro-svet-web.matsamec.workers.dev/fotosoutez/` (or `localhost:4321/fotosoutez/` after `npm run dev`). You should see the "Vaše traktory — květen 2026" header with "Upload otevřený" label.

- [ ] **Step 3: Document seed**

Create `supabase/seeds/contest_first_round.sql` with the INSERT above. Commit it.

```bash
git add supabase/seeds/contest_first_round.sql
git commit -m "chore(fotosoutez): seed first round (May 2026 — traktory)"
```

---

## Task 27: Deployment — wrangler + env vars

- [ ] **Step 1: Verify `wrangler.toml`**

Open `wrangler.toml` and ensure `[vars]` includes:

```toml
[vars]
PUBLIC_SUPABASE_URL = "https://obhypfuzmknvmknskdwh.supabase.co"
PUBLIC_SUPABASE_ANON_KEY = "eyJ..."
PUBLIC_TURNSTILE_SITE_KEY = "0x4AA..."
```

Secrets (set via `wrangler secret put`):
- `SUPABASE_SERVICE_KEY`
- `RESEND_API_KEY`
- `TURNSTILE_SECRET_KEY`

Verify:
```bash
npx wrangler secret list
```

Expected to see all three secrets listed.

- [ ] **Step 2: Deploy**

```bash
npm run build
npx wrangler deploy
```

Expected: deploy succeeds, URL printed.

- [ ] **Step 3: Smoke test production**

1. Visit `/fotosoutez/` — hub renders with active round
2. Click "Nahrát fotku" — redirects to login if not signed in
3. Log in, upload a test photo
4. Check Supabase `contest_entries` — row exists with `status=pending`
5. Visit `/admin/fotosoutez/moderace/` — see pending entry, click Schválit
6. Refresh `/fotosoutez/2026-05/` — photo appears in gallery
7. Open photo detail — click "Hlasovat", enter an email, receive magic link
8. Click magic link — vote count increments to 1
9. Try to vote again in same session — cooldown message shown

- [ ] **Step 4: Commit wrangler changes + notes**

```bash
git add wrangler.toml
git commit -m "chore(fotosoutez): wrangler vars for Turnstile + Supabase"
```

---

## Task 28: Plan Follow-Up (Phase 2 scope recording)

**Files:**
- Create: `docs/superpowers/specs/2026-04-22-fotosoutez-phase2-backlog.md`

- [ ] **Step 1: Capture Phase 2 backlog**

```markdown
# Fotosoutez Phase 2 backlog

Moved from Phase 1 plan — to be addressed after MVP is live and stable.

## Admin in content-network-cms (admin.samecdigital.com)

- Build new Next.js sidebar item "Fotosoutěž"
- Moderation queue (parallel to `/admin/fotosoutez/moderace/` in agro-svet)
- Round editor (replaces manual SQL in Task 26)
- Statistics dashboard (growth, engagement, geo heatmap)
- Fraud monitoring (IP clusters, velocity alerts)
- Winner announcement with social card generator
- CSV export per round/year

Once ready, remove `/admin/fotosoutez/` pages from agro-svet.

## Other Phase 2

- EXIF deeper parse + pHash duplicate detection
- AI moderation via Cloudflare Workers AI (NSFW + AI-generated)
- Author profile page `/fotosoutez/autor/[slug]/`
- Full archive with year filter
- Comments under entries
- Newsletter flow (opt-in digest)
- Hourly rank-delta snapshot table + cron (show ↑2 in leaderboard)
- Replace our `contest-og` with Cloudflare Images if Resvg is slow
- Image resize on upload (wasm-vips or Cloudflare Images)
```

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/specs/2026-04-22-fotosoutez-phase2-backlog.md
git commit -m "docs(fotosoutez): record Phase 2 backlog"
```

---

## Manual Test Checklist (run after Task 27)

Run each and mark pass/fail. Every item should pass before announcing MVP as complete.

- [ ] `/fotosoutez/` renders active round header + gallery
- [ ] `/fotosoutez/pravidla/` renders rules (placeholders visible — OK in MVP)
- [ ] `/fotosoutez/gdpr/` renders GDPR
- [ ] Visiting `/fotosoutez/nahrat/` without login redirects to `/bazar/prihlaseni/`
- [ ] Upload form validates (required fields, Turnstile)
- [ ] Upload creates `contest_entries` row with `status=pending`
- [ ] Email `upload_pending` arrives in inbox
- [ ] `/fotosoutez/moje/` shows new entry with "Čeká na schválení"
- [ ] Admin can approve at `/admin/fotosoutez/moderace/`
- [ ] Email `upload_approved` arrives after approval
- [ ] Approved photo appears in gallery on `/fotosoutez/2026-05/`
- [ ] Photo detail `/fotosoutez/foto/[id]/` shows vote button
- [ ] Clicking Hlasovat without cookie shows email modal
- [ ] Submitting email sends magic link (check mailbox)
- [ ] Magic link sets cookie and increments vote_count
- [ ] Voting again in <1h shows cooldown
- [ ] Voting again >1h later succeeds
- [ ] Owner cannot vote for their own photo (logged-in check)
- [ ] `/fotosoutez/api/leaderboard?round=2026-05` returns JSON with entries
- [ ] Live leaderboard refresh after 30s without reload
- [ ] `/fotosoutez/api/og/[id].png` returns PNG (check browser)
- [ ] Share buttons on detail page produce working FB/WA/TG URLs
- [ ] Admin rejection flow: `status=rejected`, email arrives with reason
- [ ] Non-admin hitting `/admin/fotosoutez/` gets 403

---

## Self-Review Notes

- Spec coverage: All 15 spec sections have corresponding tasks. §7e/f (moderation alerts, fraud dashboard detail, hourly snapshots) are explicitly deferred to Phase 2 (Task 28).
- Placeholders: Legal doc retains `{{POŘADATEL}}` etc. by design — user will fill when OSVČ/s.r.o. decided. No code TODOs.
- Type consistency: `canVote` signature identical in Task 7 (defined), Task 14 (vote.ts), Task 14 (verify-email.ts). Round `status` enum identical in migration (Task 2) and lib (Task 8). `ContestEntry` shape consistent across helpers and pages.
- Scope: Single agro-svet repo MVP. No content-network-cms changes here (separate plan).




