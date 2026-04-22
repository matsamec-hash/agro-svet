# Fotosoutez Agro-svet — Design Spec

**Datum:** 2026-04-22
**Projekt:** agro-svet.cz (Astro 6 SSR + Supabase + Cloudflare Workers)
**Admin:** admin.samecdigital.com (content-network-cms, Next.js)
**Cil:** Generovat trafic, budovat komunitu, vyuzit sdileny obsah uzivatelu, sirit pres socialni site.

---

## 1. Cile a metriky uspechu

### Business cile

1. **Trafic** — hlavni KPI. Cilova metrika: +30 % unikatnich navstev/mesic do 6 mesicu od spusteni.
2. **Komunita** — vytvorit stabilni bazi prispevatelu (cil: 50+ uploaderu / kolo po 3 mesicich).
3. **Brand awareness** — zviditelnit agro-svet.cz mezi zemedelci a fandy techniky pres socialni site.
4. **Datasety** — postupne budovat vizualni archiv (katalog "Zetor Crystal na Morave 2023", "Fendt 900 v CHKO" atd.) vyuzitelny pro SEO.

### Metriky per kolo

- **Upload conversion** — pomer navstevniku hub stranky k uploaderum
- **Email verifikace rate** — kolik voteru klikne na magic link (cil > 60 %)
- **Votes per entry** — prumer a median
- **Session depth** — kolik stranek voter navstivi (cil: 3+ = listuje galerii)
- **Social share count** — kolikrat se fotka sdilela
- **Return visits** — pomer voteru, kteri se vrati v druhem tydnu hlasovani

### Dlouhodobe metriky

- **TOP 3 postup do finale** — v prosinci 36 finalistu
- **Finale traffic spike** — cilova metrika +100 % trafficu v prosinci
- **Retention** — kolik uploaderu se vrati do dalsiho kola (cil: 40 %)

---

## 2. Format souteze

### Celorocni struktura

- **12 mesicnich kol** leden-prosinec 2026
- Kazde kolo ma vlastni **tema** (napr. "Vase traktory", "Zapad slunce nad polem", "Sklizen 2026")
- Kazde kolo ma **TOP 3 postupujici** do prosincoveho finale
- **Grande Finale** = prosincovy 36-clenny turnaj (3 × 12 kol) → 3 finalisté → 1 vitez

### Casova struktura mesice

```
Dny  1 - 10  Upload faze     (uploader nahrava, voter zatim nehlasuje)
Dny 11 - 28  Hlasovaci faze  (upload uzavreny, live zebricek)
Dny 29 - 30  Vyhlaseni       (admin potvrzuje TOP 3, clanek o viteci)
                              + TOP 3 postupuji do "contest_finalists" pro finale
```

### Ceny

**Mesicni kola (12×):**
- 1. misto: 1 000 Kc + tricko agro-svet + clanek-rozhovor
- 2. misto: 500 Kc + tricko
- 3. misto: 300 Kc + tricko
- Vsichni 3 postupuji do finale

**Grande Finale (prosinec):**
- 1. misto: **5 000 Kc + zaramovany A2 print vitezni fotky + merch balicek + voucher do agro-obchodu**
  - Titul: "Fotograf roku Agro-svet 2026"
  - Rozhovor, velky clanek, socialni kampan
- 2. misto: 2 000 Kc + print + merch
- 3. misto: 1 000 Kc + merch

### Pravni aspekt cen

- Hlavni cena 5 000 Kc = **osvobozeno od dane z prijmu** (§ 10 odst. 1 pism. h ZDP, limit 10 000 Kc).
- Vyhrce nemusi nic danit, poradatel nesrazi.
- U fyzickych cen (print, tricko) se DPH uplatnuje podle toho, zda je poradatel platcem DPH.

---

## 3. Architektura

### Vysokourovnovy prehled

```
┌─────────────────────────────┐      ┌────────────────────────┐
│  agro-svet.cz (Astro SSR)   │      │ admin.samecdigital.com │
│  - verejne stranky          │      │ (Next.js admin CMS)    │
│  - upload formular          │      │ - moderation queue     │
│  - hlasovaci endpoint       │      │ - editace kol          │
│  - live zebricek            │      │ - statistiky           │
│  - OG images (satori)       │      │ - vyhlaseni vyhrice    │
└──────────┬──────────────────┘      └──────────┬─────────────┘
           │                                     │
           │         ┌──────────────┐            │
           └────────►│   Supabase   │◄───────────┘
                     │ - DB tables  │
                     │ - Auth       │
                     │ - Storage    │
                     │ - Functions  │
                     └──────┬───────┘
                            │
                            │ (edge function triggers)
                            ▼
                     ┌──────────────┐
                     │    Resend    │
                     │ - magic link │
                     │ - notifikace │
                     └──────────────┘
```

### Tech stack

| Vrstva | Technologie | Pozn. |
|---|---|---|
| Frontend | Astro 6 SSR, @astrojs/cloudflare, TypeScript | existujici |
| DB | Supabase Postgres (projekt `obhypfuzmknvmknskdwh`) | sdileny s zenazije, bazar |
| Auth | Supabase Auth (email+heslo) | rozsirime o `is_admin`, role pro voting |
| Storage | Supabase Storage bucket `contest-photos` | novy, public read |
| Email | Resend free tier (3 000/mesic) | API klic do wrangler.toml |
| Anti-bot | Cloudflare Turnstile (zdarma) | u uploadu i hlasovani |
| OG images | satori + @vercel/og | runtime na Workers |
| Admin | Next.js v content-network-cms | rozsirit existujici sidebar |
| Data (statics) | YAML v `src/data/` + TypeScript loader | stroje.ts pattern |

### Domenove moduly

```
src/
├── data/
│   └── lokality.yaml                    (NEW)  14 kraju + 85 okresu
├── lib/
│   ├── stroje.ts                         existujici (brand/series/model)
│   ├── lokality.ts                      (NEW)  loader lokalit
│   ├── contest-config.ts                (NEW)  konstanty, timings, limits
│   ├── contest-supabase.ts              (NEW)  DB helpers (entries, votes)
│   ├── contest-voting.ts                (NEW)  hlasovaci logika + anti-fraud
│   ├── contest-email.ts                 (NEW)  Resend wrapper
│   └── contest-og.ts                    (NEW)  dynamicka OG image generator
├── components/
│   └── contest/                         (NEW)
│       ├── ContestGallery.astro
│       ├── ContestEntryCard.astro
│       ├── ContestEntryDetail.astro
│       ├── ContestUploadForm.astro
│       ├── ContestLiveLeaderboard.astro
│       ├── ContestRoundHeader.astro
│       ├── ContestShareButtons.astro
│       ├── ContestVoteButton.astro
│       └── ContestMyDashboard.astro
└── pages/
    └── fotosoutez/
        ├── index.astro                  Hub + aktualni kolo
        ├── pravidla.astro               Herni rad
        ├── gdpr.astro                   Zpracovani os. udaju
        ├── souhlas.astro                Licence a uziti dila
        ├── nahrat.astro                 Upload (login req.)
        ├── moje/
        │   └── index.astro              Dashboard uzivatele
        ├── [mesic].astro                Galerie konkretniho kola
        ├── foto/
        │   └── [id].astro               Detail + hlasovani
        ├── autor/
        │   └── [slug].astro             Profil autora
        ├── archiv.astro                 Historie kol
        ├── finale/
        │   └── [year].astro             Grande Finale
        └── api/
            ├── upload.ts                POST upload fotky
            ├── vote.ts                  POST hlas
            ├── verify-email.ts          GET magic link potvrzeni
            ├── request-verification.ts  POST "zadat verifikacni email"
            ├── og/
            │   └── [id].png.ts          Dynamicka OG image
            └── leaderboard.ts           GET live zebricek (JSON)
```

---

## 4. Datovy model (Supabase)

Migrace: `003_contest_schema.sql`, prefix `contest_`.

### 4.1 contest_rounds

Kazde mesicni kolo + finale.

```sql
CREATE TABLE contest_rounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,          -- "2026-05", "2026-finale"
  title text NOT NULL,                -- "Vase traktory — kveten 2026"
  theme text NOT NULL,                -- "Vase traktory"
  description text NOT NULL,          -- dlouhy popis tématu, pravidla specif. pro kolo
  hero_image text,                    -- ilustracni obrazek
  year integer NOT NULL,
  month integer,                      -- 1-12, NULL pro finale
  is_final boolean NOT NULL DEFAULT false,
  upload_starts_at timestamptz NOT NULL,
  upload_ends_at timestamptz NOT NULL,
  voting_starts_at timestamptz NOT NULL,
  voting_ends_at timestamptz NOT NULL,
  announcement_at timestamptz NOT NULL,
  prize_first text NOT NULL,          -- "1 000 Kc + tricko"
  prize_second text,
  prize_third text,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'upload_open', 'voting_open', 'closed', 'announced')),
  winner_entry_id uuid,               -- vyplnime po vyhlaseni
  runner_up_entry_id uuid,
  third_place_entry_id uuid,
  required_fields jsonb NOT NULL DEFAULT '[]'::jsonb,
  -- napr. [{"name":"brand","required":false,"type":"stroje-picker"}, ...]
  optional_fields jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_contest_rounds_status ON contest_rounds(status);
CREATE INDEX idx_contest_rounds_year ON contest_rounds(year DESC);
```

**status prechody:**
- `draft` — admin pripravuje
- `published` — zobrazeno na webu, jeste nelze uploadovat (napr. anonsované pristi kolo)
- `upload_open` — bezi upload faze
- `voting_open` — bezi hlasovaci faze
- `closed` — hlasovani skonceno, cekame na admin announcement
- `announced` — vyherci oznameni, kolo zarchivovano

**Fields schema priklad (required_fields + optional_fields):**

```json
{
  "required_fields": [
    {"name": "title", "type": "text", "label": "Nazev fotky", "max_length": 80}
  ],
  "optional_fields": [
    {"name": "brand_slug", "type": "stroje-brand", "label": "Znacka"},
    {"name": "model_slug", "type": "stroje-model", "label": "Model"},
    {"name": "location_kraj", "type": "lokalita-kraj", "label": "Kraj"},
    {"name": "location_okres", "type": "lokalita-okres", "label": "Okres"},
    {"name": "year_taken", "type": "number", "label": "Rok porizeni"},
    {"name": "caption", "type": "textarea", "label": "Popisek", "max_length": 500}
  ]
}
```

### 4.2 contest_entries

Nahrane fotky.

```sql
CREATE TABLE contest_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id uuid NOT NULL REFERENCES contest_rounds(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES bazar_users(id) ON DELETE CASCADE,
  photo_path text NOT NULL,           -- storage path v contest-photos bucket
  photo_width integer NOT NULL,
  photo_height integer NOT NULL,
  title text NOT NULL,
  caption text,
  author_display_name text NOT NULL,  -- jmeno zobrazene u fotky
  author_location text,               -- "Kolin" atd. volitelne
  -- Strukturovana volitelna data (null-able, validovana dle round.required_fields):
  brand_slug text,                    -- reference na src/data/stroje/*.yaml
  model_slug text,
  series_slug text,
  location_kraj_slug text,
  location_okres_slug text,
  year_taken integer,
  metadata jsonb DEFAULT '{}'::jsonb, -- volne pole pro dalsi pole z round config
  -- Moderace:
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'disqualified')),
  rejection_reason text,
  moderated_by uuid,                  -- FK na admin v content-network-cms
  moderated_at timestamptz,
  -- Anti-fraud metadata:
  exif_has_metadata boolean NOT NULL DEFAULT false,
  phash text,                         -- perceptual hash (fáze 2 — zatim null)
  upload_ip inet,
  upload_user_agent text,
  -- Hlasy:
  vote_count integer NOT NULL DEFAULT 0, -- denormalizovano pro rychlost
  last_vote_at timestamptz,
  -- Licence:
  license_merch_print boolean NOT NULL DEFAULT false, -- opt-in pro kalendar/print
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_contest_entries_round ON contest_entries(round_id);
CREATE INDEX idx_contest_entries_user ON contest_entries(user_id);
CREATE INDEX idx_contest_entries_status ON contest_entries(status);
CREATE INDEX idx_contest_entries_votes ON contest_entries(round_id, vote_count DESC) WHERE status = 'approved';
CREATE INDEX idx_contest_entries_brand ON contest_entries(brand_slug) WHERE brand_slug IS NOT NULL;
CREATE INDEX idx_contest_entries_kraj ON contest_entries(location_kraj_slug) WHERE location_kraj_slug IS NOT NULL;
```

### 4.3 contest_voters

Uzivatele hlasovali (verifikovany email per kolo).

```sql
CREATE TABLE contest_voters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id uuid NOT NULL REFERENCES contest_rounds(id) ON DELETE CASCADE,
  email text NOT NULL,
  email_verified boolean NOT NULL DEFAULT false,
  verification_token text,            -- posilan v magic linku
  verification_sent_at timestamptz,
  verified_at timestamptz,
  cookie_id uuid NOT NULL,            -- uuid v cookie "voter_id"
  first_ip inet,
  first_user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_contest_voters_round_email ON contest_voters(round_id, email);
CREATE UNIQUE INDEX idx_contest_voters_cookie ON contest_voters(cookie_id);
CREATE INDEX idx_contest_voters_token ON contest_voters(verification_token) WHERE email_verified = false;
```

### 4.4 contest_votes

Jednotlive hlasy.

```sql
CREATE TABLE contest_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id uuid NOT NULL REFERENCES contest_entries(id) ON DELETE CASCADE,
  voter_id uuid NOT NULL REFERENCES contest_voters(id) ON DELETE CASCADE,
  voted_at timestamptz NOT NULL DEFAULT now(),
  ip inet NOT NULL,
  user_agent text,
  is_valid boolean NOT NULL DEFAULT true  -- admin muze flagnout podvodny hlas
);

CREATE INDEX idx_contest_votes_entry ON contest_votes(entry_id);
CREATE INDEX idx_contest_votes_voter ON contest_votes(voter_id, voted_at DESC);
CREATE INDEX idx_contest_votes_ip_date ON contest_votes(ip, voted_at DESC);

-- Rate limiting constraint:
-- jeden voter smi hlasovat max 1x za hodinu (kontrola v API layer)
```

### 4.5 contest_finalists

Postupujici do prosincoveho finale.

```sql
CREATE TABLE contest_finalists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year integer NOT NULL,
  source_round_id uuid NOT NULL REFERENCES contest_rounds(id),
  entry_id uuid NOT NULL REFERENCES contest_entries(id),
  placement integer NOT NULL CHECK (placement IN (1, 2, 3)),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_contest_finalists_entry ON contest_finalists(entry_id);
CREATE INDEX idx_contest_finalists_year ON contest_finalists(year);
```

### 4.6 contest_admin_log

Audit log akci administratora (moderace, diskvalifikace, editace).

```sql
CREATE TABLE contest_admin_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid NOT NULL,
  action text NOT NULL,               -- 'approve', 'reject', 'disqualify', 'announce_winner', ...
  target_type text NOT NULL,          -- 'entry', 'round', 'vote'
  target_id uuid NOT NULL,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_contest_admin_log_admin ON contest_admin_log(admin_user_id, created_at DESC);
CREATE INDEX idx_contest_admin_log_target ON contest_admin_log(target_type, target_id);
```

### 4.7 Rozsireni bazar_users

```sql
ALTER TABLE bazar_users ADD COLUMN is_admin boolean NOT NULL DEFAULT false;
ALTER TABLE bazar_users ADD COLUMN contest_opt_in_newsletter boolean NOT NULL DEFAULT false;
ALTER TABLE bazar_users ADD COLUMN contest_display_name text;  -- povinne pri uploadu
```

### 4.8 Storage bucket

```sql
-- v Supabase dashboard:
INSERT INTO storage.buckets (id, name, public) VALUES ('contest-photos', 'contest-photos', true);

-- Policies:
CREATE POLICY "contest_storage_upload" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'contest-photos' AND auth.role() = 'authenticated');
CREATE POLICY "contest_storage_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'contest-photos');
CREATE POLICY "contest_storage_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'contest-photos' AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR EXISTS (SELECT 1 FROM bazar_users WHERE id = auth.uid() AND is_admin = true)
  ));
```

Folder struktura v bucketu: `{user_id}/{round_slug}/{entry_id}.webp`

### 4.9 RLS policies (prehled)

```sql
-- contest_rounds: kdokoli cte publikovana, admin CUD
CREATE POLICY "contest_rounds_select" ON contest_rounds FOR SELECT
  USING (status != 'draft' OR EXISTS (SELECT 1 FROM bazar_users WHERE id = auth.uid() AND is_admin = true));

-- contest_entries: kdokoli cte approved, autor cte sve, admin vse
CREATE POLICY "contest_entries_select" ON contest_entries FOR SELECT USING (
  status = 'approved'
  OR auth.uid() = user_id
  OR EXISTS (SELECT 1 FROM bazar_users WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "contest_entries_insert" ON contest_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "contest_entries_update_owner" ON contest_entries FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');
CREATE POLICY "contest_entries_update_admin" ON contest_entries FOR UPDATE
  USING (EXISTS (SELECT 1 FROM bazar_users WHERE id = auth.uid() AND is_admin = true));

-- contest_voters, contest_votes: zapisuje jen service role (API endpoint s server key)
-- cteni jen vlastnich hlasu voterem pres cookie_id + server verifikace
```

### 4.10 DB triggers

```sql
-- Automaticky zvysit vote_count po vlozeni validniho hlasu
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

-- Pri invalidaci hlasu (admin flagnul) snizit count
CREATE OR REPLACE FUNCTION contest_vote_invalidate() RETURNS trigger AS $$
BEGIN
  IF OLD.is_valid = true AND NEW.is_valid = false THEN
    UPDATE contest_entries SET vote_count = GREATEST(0, vote_count - 1)
     WHERE id = NEW.entry_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contest_vote_invalidate_trigger
AFTER UPDATE ON contest_votes
FOR EACH ROW EXECUTE FUNCTION contest_vote_invalidate();
```

---

## 5. Uzivatelske toky

### 5.1 Upload flow (uploader)

```
1. Uzivatel klika "Nahrat fotku" na /fotosoutez/
2. Pokud neprihlasen -> redirect na /bazar/prihlaseni/?redirect=/fotosoutez/nahrat
3. Po prihlaseni -> /fotosoutez/nahrat
4. Zobrazi se formular s:
   - Upload fotky (drag&drop, max 10 MB, JPG/PNG/HEIC)
   - Nazev (required, max 80)
   - Popisek (optional, max 500)
   - CascadingPicker: Znacka → Serie → Model (vse optional)
   - Lokalita: Kraj -> Okres (optional, druhy filter podle prvniho)
   - Rok porizeni (optional)
   - Display name (prvni nabidne jmeno z bazar_users.name, user muze menit)
   - Checkbox (povinne): "Fotku jsem poridil(a) osobne, neni AI generovana"
   - Checkbox (povinne): "Souhlasim s pravidly souteze a zpracovanim os. udaju"
   - Checkbox (volitelny): "Souhlasim s pouzitim fotky v kalendari 2027, prinu a merchi"
   - Turnstile captcha
6. Submit -> POST /fotosoutez/api/upload
   Backend:
   a) Validuje form (Zod)
   b) Overi ze uzivatel nema 3 entries v aktualnim kole (status != rejected)
   c) Overi Turnstile
   d) Stahne EXIF metadata, ulozi flag exif_has_metadata
   e) Konvertuje na WebP (Sharp/Cloudflare Images)
   f) Uklada do Supabase Storage
   g) INSERT do contest_entries se status = pending
   h) Posle email "Potvrzeni uploadu + ceka na schvaleni"
7. Redirect -> /fotosoutez/moje/ s toast "Fotka ceka na schvaleni"
8. Admin schvali v admin.samecdigital.com -> status = approved
9. Trigger posle emaily "Tva fotka je schvalena!" + share link
```

### 5.2 Moderation flow (admin)

V content-network-cms (Next.js), cesta `/fotosoutez/moderace`:

```
1. Admin se prihlasi do admin.samecdigital.com
2. V sidebaru vidi "Fotosoutez" s badge poctu pending (napr. "12")
3. Klika -> moderation queue
4. Kartickova lista s pending fotkami:
   - velky nahled
   - user info (jmeno, email, pocet predchozich prispevku)
   - flags (EXIF missing, predchozi diskvalifikace, nova registrace <24h)
   - akce: Schvalit | Odmitnout (s duvodem) | Flag k hlubsi kontrole
5. Dostupne duvody odmitnuti: "AI generated", "Spatna kvalita", "Mimo tema", "Neni zemedelska", "Nevlastni fotka", "Jine (volny text)"
6. Po akci:
   - INSERT do contest_admin_log
   - UPDATE contest_entries.status
   - Trigger email uzivateli (approved / rejected s duvodem)
7. Admin vidi stats: "Dnes schvaleno 15 / odmitnuto 3"
```

### 5.3 Voting flow (voter)

```
1. Voter listuje galerii /fotosoutez/2026-05/
2. Klika fotku -> /fotosoutez/foto/[id]
3. Na detailu klika "Hlasovat" button
4. 1. pripad: nema cookie voter_id
   a) Zobrazi se modal "Zadejte email pro hlasovani"
   b) Voter zadava email + Turnstile
   c) POST /fotosoutez/api/request-verification
   d) Backend: INSERT contest_voters s verification_token
   e) Posle email s magic linkem: https://agro-svet.cz/fotosoutez/api/verify-email?token=XXX&entry=YYY
   f) Zobrazi "Zkontroluj mail, klikni na link"
5. Voter otevre email, klika link
6. Backend: GET /fotosoutez/api/verify-email?token=XXX&entry=YYY
   a) Najde contest_voters podle tokenu
   b) Nastavi email_verified = true
   c) Nastavi cookie "voter_id" (uuid = contest_voters.cookie_id)
   d) Cookie: HttpOnly, Secure, SameSite=Lax, expires konec voting_ends_at
   e) Provede prvni hlas (pokud ?entry=YYY predan)
   f) Redirect na detail fotky s toast "Dekujeme za hlas!"
7. 2. pripad: ma cookie voter_id, jeste NEUBEHLA hodina od posledniho hlasu
   a) Button disabled, tooltip "Mozes hlasovat znovu za XX minut"
8. 3. pripad: ma cookie voter_id, hodina ubehla
   a) POST /fotosoutez/api/vote { entry_id }
   b) Backend overi:
      - voter_id existuje a email_verified
      - 1 hlas za hodinu (SELECT poslední hlas)
      - IP rate limit (max 20 hlasu / IP / den)
      - entry_id je approved
      - entry.user_id != voter.email (cross check aby nehlasoval za sebe)
      - Turnstile token (kazdy N-ty hlas)
   c) INSERT contest_votes
   d) Trigger aktualizuje contest_entries.vote_count
   e) Vraci { success: true, new_count: N, user_rank: N }
9. Frontend aktualizuje zebricek (refresh fetch)
10. Zobrazi popup "Hlasuj i dal — dalsi hlas za 1 h" + share tlacitka
```

### 5.4 Finale flow

```
1. Po skonceni listopadoveho kola admin v admin.samecdigital.com klika "Spustit finale 2026"
2. Backend:
   a) Pro kazde z 12 kol najde TOP 3 (vote_count DESC)
   b) INSERT 36 zaznamu do contest_finalists
   c) Vytvori contest_rounds se slug = "2026-finale", is_final = true
3. Finale ma vlastni fazy:
   - Upload faze: NONE (fotky uz jsou z kol)
   - Hlasovaci faze: 1.-20. prosince (20 dni kvuli vanocnim hybi)
   - Vyhlaseni: 21.-22. prosince
4. Voting flow stejny, ale s povinnym loginem (ne anonymni email) — snizeni fraud rizika u velke ceny
5. 21. prosince admin vyhlasi viteze, posle merch + print
```

---

## 6. Anti-fraud architektura

### Vrstvy

1. **Cloudflare Turnstile** (zdarma) — na uploadu i prvnim hlasu + kazdy N-ty (napr. kazdy 5.)
2. **Email verifikace per kolo** — voter jednou overi, cookie platne do konce kola
3. **Rate limiting per voter:**
   - 1 hlas / hodinu / voter_id (SQL overe na posledni vote_at)
4. **Rate limiting per IP:**
   - max 20 hlasu / IP / 24h (sdilene IP - rodina, firma - realisticke)
5. **Cookie + IP shoda** — pokud cookie-voter_id ma pri kazdem hlasu jinou IP, flag suspicious
6. **Turnstile na upload** — zabrani botum nahravat
7. **EXIF check** — chybi-li cele EXIF metadata, flag ("mozno zkopirovane z internetu")
8. **Vlastni fotka check** — nelze hlasovat pro svou fotku (voter.email nesmi byt roven entry.user.email)
9. **Admin prevence:**
   - Admin ma tlacitko "Diskvalifikovat prispevek"
   - Admin ma "Invalidovat N hlasu" (napr. 100 hlasu z podezrele IP bloku)
   - Vse logovano do contest_admin_log
10. **Finale: povinny login** — u 5 000 Kc ceny bariera vytezi traffic

### Faze 2 vrstvy (pridame pozdeji)

- **Perceptual hashing (pHash)** — detekce duplicit (kopirovana fotka z jineho kola, z internetu)
- **AI moderace** pres Cloudflare Workers AI:
  - NSFW detection
  - AI-generated detection (CLIP, deep-fake indikatory)
  - Auto-flag s confidence score
- **Velocity check** — rapidni skok hlasu v kratkem case (z 10 -> 500 za 10 minut) = alarm
- **Behavioral fingerprinting** — user agent, timezone, jazykova preference — detekce VPN

### Pravidla diskvalifikace

Podle §8 Herniho radu muze admin:
- Zneplatnit fotku (napriklad AI generated) -> status = disqualified
- Zneplatnit hlasy (100 hlasu ze stejne IP) -> UPDATE contest_votes SET is_valid = false
- Vsechny akce logovany v contest_admin_log
- Uzivatel muze podat namitku emailem (kontakt v pravidlech)

---

## 7. Live zebricek

### UI komponent

`ContestLiveLeaderboard.astro` — bocni panel na:
- `/fotosoutez/` (hub — TOP 5 aktualniho kola)
- `/fotosoutez/[mesic]/` (galerie kola — TOP 10)
- `/fotosoutez/foto/[id]/` (detail — mistni pozice + sousedi v zebricku)

### Implementace

```
SSR nacte prvni data ze Supabase (nejcerstvejsi pri request)
→ client-side se nastavi setInterval(30s) → fetch /api/leaderboard?round=2026-05
→ aktualizuje DOM plynule, animace pozicnich zmen (↑ 2 mista)
```

Endpoint `/fotosoutez/api/leaderboard`:

```typescript
// GET /fotosoutez/api/leaderboard?round=2026-05&limit=10
// Response:
{
  "round": { "slug": "2026-05", "voting_ends_at": "2026-05-28T22:00:00Z" },
  "entries": [
    {
      "id": "...",
      "rank": 1,
      "rank_delta": "+2",  // pozice se zmenila proti 1h back
      "title": "Muj Zetor Crystal na zapadu slunce",
      "author": "Jan N.",
      "vote_count": 247,
      "thumb": "https://...webp",
      "last_hour_votes": 18
    },
    ...
  ],
  "my_position": 5,  // pokud voter z cookie je autor
  "total_voters": 1234
}
```

Cachovaci strategie:
- Astro routa s `Cache-Control: s-maxage=30, stale-while-revalidate=60`
- Cloudflare cache na edge → snizuje DB zatez
- Client-side refresh jen kdyz tab je active (Page Visibility API)

### Rank delta vypocet

Pravidelny DB job (Supabase cron extension) kazdou hodinu:

```sql
-- snapshot TOP pro rank_delta porovnani
CREATE TABLE contest_entries_hourly_snapshot (
  snapshot_at timestamptz DEFAULT now(),
  entry_id uuid REFERENCES contest_entries(id),
  round_id uuid REFERENCES contest_rounds(id),
  vote_count integer,
  rank integer
);
-- cron: kazdou hodinu INSERT snapshot pro aktualní voting_open kola
```

---

## 8. Socialni sdileni + OG images

### Dynamicke OG images

Endpoint `/fotosoutez/api/og/[entry_id].png`:

```typescript
import { ImageResponse } from '@vercel/og';

export const GET: APIRoute = async ({ params }) => {
  const entry = await getEntry(params.entry_id);

  return new ImageResponse({
    type: 'div',
    props: {
      style: { display: 'flex', width: 1200, height: 630, position: 'relative' },
      children: [
        // Pozadi fotky
        { type: 'img', props: { src: entry.photo_url, style: { width: '100%', height: '100%', objectFit: 'cover' } } },
        // Overlay
        { type: 'div', props: {
            style: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.8) 0%, transparent 50%)' }
          }
        },
        // Textovy overlay dolu
        { type: 'div', props: {
            style: { position: 'absolute', bottom: 40, left: 40, right: 40, color: 'white' },
            children: [
              { type: 'div', props: { style: { fontSize: 56, fontWeight: 900, fontFamily: 'Chakra Petch' }, children: entry.title } },
              { type: 'div', props: { style: { fontSize: 32, marginTop: 8 }, children: `Foto: ${entry.author_display_name}` } },
              { type: 'div', props: { style: { fontSize: 40, color: '#FFFF00', marginTop: 20 }, children: '🏆 Fotosoutez Agro-svet — HLASUJ!' } }
            ]
          }
        }
      ]
    }
  }, { width: 1200, height: 630 });
};
```

Pouziti v `<meta>`:

```astro
<meta property="og:image" content={`${Astro.site}/fotosoutez/api/og/${entry.id}.png`} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

### Share tlacitka

`ContestShareButtons.astro`:
- Facebook (share URL)
- Messenger
- WhatsApp (`https://wa.me/?text=`)
- Telegram
- X (Twitter)
- Copy link (JS clipboard API)

Po hlasovani modal:
- "Dekujeme za hlas! Podelte se s pratelami aby take hlasovali 🌾"
- Prednastaveny text: "Zrovna jsem hlasoval(a) ve fotosoutezi Agro-svet! Podivejte se: {URL}"

### Autorska share zkusenost

Po schvaleni fotky admin:
- Email "Tva fotka je schvalena — zde je tvuj sdileci odkaz!"
- Odkaz na /fotosoutez/foto/[id] s UTM parametry `?utm_source=author&utm_campaign=contest-2026-05`
- Predgenerovany text pro Facebook/WhatsApp:
  - "Nahral jsem fotku do Fotosouteze Agro-svet! Pomuzete mi získat co nejvice hlasu? 📸🚜 {URL}"

### Merch po vyhlaseni

Vyhlasovaci clanek `/fotosoutez/[mesic]/vyhlaseni` generuje:
- Social card 1080×1080 s vitezní fotkou + overlay "Vyhral kveten 2026 🏆 Jan Novak"
- Video (future): timelapse hlasovani z dat v contest_entries_hourly_snapshot

---

## 9. Emailove notifikace (Resend)

### Seznam emailu

| Id | Situace | Prijemce | Template |
|---|---|---|---|
| upload_pending | Uzivatel nahral fotku | uploader | "Dekujeme, ceka na schvaleni" |
| upload_approved | Admin schvalil | uploader | "Fotka je v galerii! Zde sdileci odkaz" |
| upload_rejected | Admin odmitl | uploader | "Fotka nebyla prijata, duvod: X" |
| voting_started | Den 11 mesice | uploader | "Hlasovaci faze zacala! Share link" |
| voting_ending | 24h pred koncem | uploader | "Zbyva 24h, sdilej!" |
| winner_result | Vyhlaseni | vsichni uploader z kola | "1./2./3./uspech za ucast" |
| finalist_notify | Po skonceni kola | TOP 3 kola | "Postupujes do finale!" |
| magic_link | Voter chce hlasovat | voter | "Klikni pro potvrzeni hlasu" |
| finale_announce | Zacatek finale prosinec | vsichni finalisti | "Finale zacalo!" |

### Template priklad (magic_link)

```html
<!-- Pouzita knihovna react-email nebo vanilla HTML -->
<h1>Potvrzeni hlasu ve Fotosoutezi Agro-svet</h1>
<p>Ahoj,</p>
<p>kliknuti na tlacitko nize potvrdite svuj hlas pro fotku <strong>"{title}"</strong> od {author}.</p>
<p>Po overeni budete moci hlasovat 1× za hodinu po cely zbytek kola (do {voting_ends_at}).</p>
<a href="{verification_url}" style="display:inline-block;background:#FFFF00;color:#000;padding:16px 32px;font-weight:bold;border-radius:10px;text-decoration:none;">
  Potvrdit hlas
</a>
<p>Pokud jste o hlasovani nezadali, tento email ignorujte.</p>
<hr>
<p style="font-size:12px;color:#666">
Pokud si nechcete prat dostavat emaily z fotosouteze, <a href="{unsubscribe_url}">zrusit odber</a>.
</p>
```

### Resend konfigurace

- Domena: `mail.agro-svet.cz` (DKIM, SPF, DMARC)
- API klic: `RESEND_API_KEY` v `wrangler.toml` jako Secret
- Sender: `fotosoutez@mail.agro-svet.cz`
- Unsubscribe link pre-generovany
- Bounces zachycuji se webhookem -> flag in contest_voters

### Fallback pri prekroceni limitu

Pokud Resend vratí 429 rate limit / mesic limit:
- Zapis do `contest_email_queue` tabulky
- Retry cron kazdou hodinu
- Pokud 3 dny bez uspechu, admin alert

---

## 10. Administrativa v admin.samecdigital.com

### Sidebar rozsireni

Do content-network-cms sidebar se prida:

```
📸 Fotosoutez
  ├─ Moderace (badge: X pending)
  ├─ Kola
  ├─ Galerie a vyhlaseni
  ├─ Statistiky
  └─ Fraud monitoring
```

Lucide ikona: `Camera` nebo `Trophy`.

### Stranky v Next.js

```
/app/(app)/fotosoutez/moderace/page.tsx       — queue pending
/app/(app)/fotosoutez/kola/page.tsx           — seznam kol
/app/(app)/fotosoutez/kola/new/page.tsx       — vytvoreni kola
/app/(app)/fotosoutez/kola/[id]/page.tsx      — edit kola + fields config
/app/(app)/fotosoutez/galerie/page.tsx        — prehled kol + vyhlaseni
/app/(app)/fotosoutez/galerie/[id]/page.tsx   — detail kola + akce vyhlaseni
/app/(app)/fotosoutez/stats/page.tsx          — growth, engagement, geo
/app/(app)/fotosoutez/fraud/page.tsx          — suspected patterns
/app/(app)/fotosoutez/export/page.tsx         — CSV export
```

### Moderace UI

- Kartickovy grid 3-column na 1280px, 2 na tabletu, 1 mobil
- Karta:
  - Fotka 400×300
  - Title, Caption
  - User info (jmeno, email, # prispevku, # predchozi moderovanych)
  - Metadata tabulka (znacka, model, lokalita, rok)
  - Badges: "No EXIF", "New user <24h", "3rd submission this round"
  - Tlacitka: Schvalit (zeleny), Odmitnout (s dropdown duvodu), Flag (oznacit pro review 2. moderatora)
  - Preview modal na fullscreen
- Hromadne akce: check multiple -> "Schvalit vse"
- Klavesove zkratky: A=approve, R=reject, J/K navigace

### Kola editor

Form s fields:
- Slug, Title, Theme, Description, Hero Image
- Vsechny data (upload_starts_at, ...)
- Prize fields
- required_fields + optional_fields JSON builder:
  - Vizualni builder: klika "+ Add field", vybere type (text/number/stroje-brand/stroje-model/lokalita-kraj/...)
  - Zaskrtne required/optional
- Ulozeni = UPDATE contest_rounds

### Vyhlaseni vyhrice

- Tlacitko "Spustit vyhlaseni" na kole se status=closed
- Modal:
  - Zobrazi TOP 3 fotky (serazene podle vote_count)
  - Admin muze editovat (napr. kdyz nekdo z TOP 3 byl diskvalifikovan)
  - Potvrzeni -> zapise winner_*_entry_id, status=announced
  - Trigger posle emaily + publikuje clanek
- Generator grafiky pro socialky:
  - Template 1080×1080 s fotkou + "Vyhral kveten 2026 — Jan Novak"
  - Downloadovatelne pro manualni post

### Statistiky

Chart.js / recharts dashboardy:
- Growth over time (uploaders, voters per month)
- Engagement funnel (visit → upload / vote)
- Geograficka heatmapa CR (votes per kraj)
- TOP znacky, TOP lokality
- Retention cohort (uploaders opakovane)

### Fraud dashboard

- IP s >10 hlasy za den (tabulka)
- Voters s rapidnim ramp-up patternem
- Entries s nerealistickym growth (z 5 na 500 za 2h)
- Tlacitko "Invalidovat hlasy z IP X" -> UPDATE contest_votes SET is_valid=false + log

### Auth v content-network-cms

- Existujici auth rozsirit: admin musi mit flag v `bazar_users.is_admin = true`
- Middleware v Next.js kontroluje Supabase session + is_admin flag

---

## 11. Pravni dokumenty

### 11.1 Herni rad (Pravidla souteze)

Ulozi se jako Astro stranka `/fotosoutez/pravidla/`. Draft:

```markdown
# Pravidla souteze "Fotograf roku Agro-svet 2026"

**Ucinnost:** 1. ledna 2026
**Verze:** 1.0

## 1. Poradatel

Poradatelem souteze je {{POŘADATEL_JMENO}}, IC: {{IC}}, se sidlem {{ADRESA}}, e-mail: {{KONTAKT}}.

## 2. Termin konani

Soutez probiha od 1. ledna 2026 do 31. prosince 2026.

Soutez se deli na:
- **12 mesicnich kol** (leden-prosinec)
- **Grande finale** (1.-20. prosince)

## 3. Kdo se muze zucastnit

- Fyzicka osoba starsi 18 let
- S trvalym bydlistem v Ceske republice nebo SR
- Ne zamestnanci poradatele, jejich rodinni prislusnici ani osoby s nimi spojene

## 4. Mechanika

### 4.1 Upload

- Uzivatel se zaregistruje na agro-svet.cz (email + heslo)
- V kazdem mesicnim kole muze nahrat maximalne **3 fotografie**
- Fotografie musi odpovidat tematu kola
- Fotografie musi byt puvodni, poridil ji sam ucastnik, neni generovana umelou inteligenci

### 4.2 Faze

Kazde mesicni kolo se deli na:
- Dny 1-10: **nahravani** fotografii
- Dny 11-28: **hlasovani** verejnosti
- Dny 29-30/31: **vyhlaseni** vyhrice

### 4.3 Hlasovani

- Hlasovat muze kazdy clovek, ktery overi svuj e-mail (1× za kolo) — magic link
- Po overeni muze hlasovat **1× za hodinu** pro libovolnou fotku
- Nelze hlasovat pro vlastni fotku

### 4.4 Vyhodnoceni

- V kazdem kole vitezi fotografie s nejvyssim poctem platnych hlasu
- TOP 3 z kazdeho kola postupuji do **Grande Finale**
- V Grande Finale rozhoduje taktez hlasovani verejnosti, ale s povinnou registraci

## 5. Ceny

### 5.1 Mesicni ceny

- 1. misto: 1 000 Kc + triko Agro-svet + rozhovor v redakcnim clanku
- 2. misto: 500 Kc + triko
- 3. misto: 300 Kc + triko

### 5.2 Hlavni cena (finale)

- 1. misto: **5 000 Kc + zaramovany A2 tisk vitezni fotografie + merch balicek + voucher**
- 2. misto: 2 000 Kc + tisk + merch
- 3. misto: 1 000 Kc + merch

### 5.3 Danove aspekty

Vyhry z verejnych soutezi jsou osvobozene od dane z prijmu fyzickych osob dle § 10 odst. 1 pism. h) zakona c. 586/1992 Sb., o danich z prijmu, v platnem zneni, pokud nepresahnou 10 000 Kc. Hlavni cena 5 000 Kc je tedy osvobozena a vyherce ji nemusi danit.

### 5.4 Doruceni ceny

- Financni cena: prevodem na ucet oznameny vyhercem do 30 dnu od vyhlaseni
- Fyzicke ceny: odeslani postou (Ceska posta / Zasilkovna) na adresu v CR nebo SR, poradatel hradí postovne
- Vyherce je povinen poskytnout udaje (jmeno, adresa, telefon, e-mail, cislo uctu) do 14 dnu od vyhlaseni, jinak cena propada

## 6. Autorska prava a souhlas s uzitim dila

### 6.1 Prohlaseni ucastnika

Nahranim fotografie ucastnik prohlasuje, ze:
- Fotografii poridil sam, nebo ji vlastni
- Fotografie neni generovana umelou inteligenci (DALL-E, Midjourney, Stable Diffusion apod.)
- Disponuje vsemi pravy k jejimu siseni a uziti
- Osoby na fotografii (pokud nejake jsou) vyjadrily souhlas se zverejnenim

### 6.2 Licence pro poradatele

Ucastnik poskytuje poradateli **nevyhradni, bezplatnou licenci** k uziti fotografie k temto ucelum:
- Zobrazeni v galerii souteze na agro-svet.cz
- Zobrazeni v clancich, newsletterech, socialnich sitich (Facebook, Instagram, TikTok, YouTube, X) agro-svet.cz
- Zobrazeni s atribuci autora (jmeno uvedene pri uploadu)

Licence je udelena do 31. 12. 2029 (3 roky po konci souteze).

### 6.3 Volitelny souhlas — merch a tisk

Ucastnik muze pri uploadu dobrovolne oznacit checkbox souhlasu s uzitim fotografie pro:
- Tisk a distribuci kalendare Agro-svet 2027
- Ruzne formy merchandise (trika, plakatky, printy)
- Zaslani autorovi jako dekovny darek

Bez tohoto souhlasu poradatel fotografii pro merch nepouzije.

### 6.4 Atribuce

U kazde fotografie bude uvedeno: "Foto: {display_name}" (zvolene jmeno pri uploadu). Ucastnik si muze zvolit i prezdivku.

## 7. Ochrana proti podvodnemu jednani

Poradatel si vyhrazuje pravo:
- Diskvalifikovat ucastnika nebo fotografii pri porušení pravidel
- Zneplatnit podezrele hlasy (botové, clony, manipulace)
- Změnit pravidla v pripade nutnosti (napr. zneuziti)

V pripade diskvalifikace je castka nezverejnena a muze byt udelena nahradnikovi z dalsich mist.

## 8. Zpracovani osobnich udaju

Poradatel zpracovava osobni udaje v souladu s narizenim GDPR. Podrobne informace jsou v dokumentu [Zpracovani osobnich udaju](/fotosoutez/gdpr/).

## 9. Reklamace a resi sporu

Pripadne stiznosti a reklamace se zasila na e-mail {{KONTAKT}}. Poradatel vyresi do 30 dnu.

V pripade sporu je pozustatek pred mimosoudnim resenim sporu: Ceska obchodni inspekce, www.coi.cz.

## 10. Zaverecna ustanoveni

- Poradatel si vyhrazuje pravo zmenit pravidla. Zmeny jsou ucinne jejich zverejnenim na /fotosoutez/pravidla/.
- Ucast v soutezi je dobrovolna a bezplatna.
- Tato pravidla jsou v ucinnosti od 1. ledna 2026.

**Kontakt:** {{KONTAKT}}
**Verze dokumentu:** 1.0
**Posledni zmena:** 2026-01-01
```

### 11.2 Zpracovani osobnich udaju (GDPR)

`/fotosoutez/gdpr/`:

```markdown
# Zpracovani osobnich udaju — Fotosoutez Agro-svet 2026

## 1. Spravce

{{POŘADATEL}} (dale jen "Spravce") — IC {{IC}}, sidlo {{ADRESA}}, e-mail {{KONTAKT}}.

## 2. Zpracovavane udaje

### 2.1 Od ucastniku (uploaderu)

- Jmeno a prijmeni (nebo prezdivka)
- E-mail
- Heslo (hashované)
- Telefon (pouze pokud vyhraje — pro doruceni ceny)
- Adresa (pouze pokud vyhraje fyzickou cenu)
- Cislo uctu (pouze pri vyhry financni ceny)
- Obsah fotografie vcetne EXIF metadat
- IP adresa, user agent (anti-fraud)

### 2.2 Od voteru

- E-mail (pro overeni hlasu)
- IP adresa, user agent
- Cookie identifier

## 3. Pravni zaklad

- **Plneni smlouvy** — ucast v soutezi (jmeno, email, fotografie)
- **Opravneny zajem** — anti-fraud (IP, UA, cookie)
- **Souhlas** — marketing emaily (volitelny opt-in pri registraci)
- **Pravni povinnost** — danove povinnosti pri vyhre

## 4. Doba uchovani

- Ucastnicka data: po dobu trvani souteze + 3 roky
- Fotografie: po dobu trvani souteze + 3 roky (licence)
- Hlasovaci data (pro statistiky): 2 roky
- Marketingove souhlasy: do odvolani

## 5. Prijemci

- Resend.com (email delivery) — USA, Standard Contractual Clauses
- Supabase (hosting dat) — EU / USA, SCC
- Cloudflare (CDN, hosting) — globalni

## 6. Prava subjektu udaju

- Pravo na pristup (GDPR cl. 15)
- Pravo na opravu (cl. 16)
- Pravo na vymaz — "pravo byt zapomenut" (cl. 17)
- Pravo na omezeni zpracovani (cl. 18)
- Pravo na prenositelnost (cl. 20)
- Pravo vznest namitku (cl. 21)
- Pravo odvolat souhlas (kdykoli)

Zadost zasilejte na {{KONTAKT}}. Vyrizeni do 30 dnu.

## 7. Stiznost

V pripade pochybeni muzete podat stiznost u Uradu pro ochranu osobnich udaju (www.uoou.cz).

## 8. Cookies

Pouzivame technicky nezbytne cookies:
- `sb-access-token`, `sb-refresh-token` — auth (Supabase)
- `voter_id` — identifikace voltera v ramci kola
- `turnstile_...` — Cloudflare anti-bot

Podrobne v [Zasady cookies](/cookies/).

**Ucinnost:** 1. ledna 2026
```

### 11.3 Kraktka pravidla (TL;DR) v uploadu

V upload formulari se zobrazi kraktka shrnute:

> **Souhlasim s pravidly souteze.** Fotografii jsem poridil sam, neni AI. Agro-svet ji muze zobrazit na webu a socialnich sitich s mou atribuci. [Cele zneni pravidel](/fotosoutez/pravidla/). [Zpracovani os. udaju](/fotosoutez/gdpr/).

## 12. Implementacni faze

### Faze 1 — MVP (4-6 tydnu)

**Cil:** spustitelna soutez v kvetnu 2026 (prvni kolo).

Tasky:
1. **DB schema** — migrace 003_contest_schema.sql + seed 14 kraju + 85 okresu
2. **Data + lib** — lokality.ts loader, contest-config.ts, contest-supabase.ts helpers
3. **Auth rozsireni** — is_admin flag, contest_display_name v bazar_users
4. **Storage setup** — bucket contest-photos + policies
5. **Resend setup** — domena, DKIM, API klic, base template
6. **Upload flow** — /fotosoutez/nahrat, Turnstile, Sharp conversion, INSERT entries
7. **Gallery + detail** — /fotosoutez/[mesic], /fotosoutez/foto/[id] + komponenty
8. **Voting flow** — API endpoints vote, request-verification, verify-email
9. **Live leaderboard** — endpoint + 30s refresh + rank delta (hourly snapshot cron)
10. **Emailove templaty** — 6 zakladnich (upload_pending, approved, rejected, voting_started, voting_ending, winner_result, magic_link)
11. **OG images** — satori endpoint
12. **Share buttons** — komponenta
13. **Right documents** — pravidla.astro, gdpr.astro stranky
14. **Admin v content-network-cms** — moderation queue + kola editor (jen zakladni funkce)
15. **Pending notifications badge** — v sidebar content-network-cms
16. **Hub stranka** — /fotosoutez/ s aktualnim kolem + historii
17. **Moje dashboard** — /fotosoutez/moje/ (uzivatelovo prispevky)
18. **Test — end-to-end** v prvnim kole s omezenim participantem (beta testeri)

**Deliverables:**
- Fungujici květne 2026 kolo s 10+ prispevky a 100+ hlasy
- Admin moderuje z admin.samecdigital.com
- Email flow testnuty

### Faze 2 — Rozsireni (mesic po spusteni)

1. **Profil autora** — /fotosoutez/autor/[slug], agregace napric kolech
2. **Archiv** — /fotosoutez/archiv/ (historicka kola)
3. **Komentare** — jednoducha thread pod fotkou (volitelna)
4. **Newsletter flow** — opt-in → mesicni digest
5. **Stats dashboard** — plna verze v admin CMS
6. **Fraud dashboard** — plna verze
7. **AI moderace** — Cloudflare Workers AI NSFW + AI-detect, auto-flag
8. **EXIF check + pHash** — duplicate detection
9. **Export CSV** — per kolo, per rok
10. **Video timelapse hlasovani** — z hourly_snapshot dat

### Faze 3 — Finale (listopad-prosinec 2026)

1. **Finale stranka** — /fotosoutez/finale/2026/ s bracket UI
2. **Povinny login** pro hlasovani finale
3. **Kalendar 2027 objednavka** — Printful integrace / manualni process
4. **Vyhlaseni PR** — timelapse video, PR clanek, social kampan
5. **Rocni prehled + statistics**

---

## 13. Riziká a ošetření

| Riziko | Pravdepodobnost | Dopad | Mitigace |
|---|---|---|---|
| Low upload count (<10 za kolo) | Vysoka v 1.-2. kole | Stredni | Socialni kampan, osvoboddit od 18+ limitu? Spolecne posty na FB/IG, reklamni rozpocet 1-2k Kc mesicne |
| Bot fraud | Stredni | Vysoky | Turnstile + magic link + rate limit + admin diskvalifikace |
| Resend free limit prekrocen | Nizka (s hybridem) | Stredni | Fallback queue + upgrade nebo prechod na Brevo/SES |
| Spor o autorska prava | Nizka | Vysoky | Jasna pravidla + checkbox + admin moderace |
| Vyherce odmitne cenu (nedodal udaje) | Nizka | Nizky | Pravidla: 14 dnu, jinak propada druhy v poradi |
| Kritika na socialkach (hejty) | Stredni | Nizky | Moderace komentaru, jasne FAQ |
| GDPR stiznost | Nizka | Stredni | Dodrzovat GDPR dokument, mit kontakt DPO (nebo jen admin) |
| Server collapse na finale (spike) | Nizka | Vysoky | Cloudflare edge cache + Supabase auto-scaling, lze pretezovou test |
| Vic nez 3 000 mesic emailu | Stredni | Stredni | Prechod na AWS SES (~$1/10k) pri nutnosti |

---

## 14. Otevrene otazky pro budoucnost

- **Kalendar 2027:** manualne v tiskarne vs. Printful API? (rozhodneme po zari 2026)
- **Mobilni appka:** postavit samostatnou vs. PWA? (pro Faze 2+)
- **Integrace s Bazarem:** kdyz nekdo nahraje traktor do foto souteze, nabizet "chces ho prodat?" CTA (Faze 2)
- **Platby:** kdyz chce nekdo "boost" hlasovani zaplatit (moralne problematicke, asi ne)
- **Veterany fotek:** co s obrovskymi souboryml (mobilni fotky jsou 4-8 MB, bude treba optimalizovat)
- **i18n:** zatim cesky only, v budoucnu SR?

---

## 15. Souhrn vazeb

Tento spec je **kompletni** a neobsahuje placeholdery krome:
- `{{POŘADATEL}}`, `{{IC}}`, `{{ADRESA}}`, `{{KONTAKT}}` — doplni uzivatel v contest_rounds nebo globalni CMS konfiguraci
- Resend `mail.agro-svet.cz` DKIM — nastavi uzivatel pri Resend onboardu

Pripraveno k reviewi uzivatelem a prechodu na implementacni plan (writing-plans skill).
