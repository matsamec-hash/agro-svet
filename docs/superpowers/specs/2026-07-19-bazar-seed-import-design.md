# Agro Bazar — Seeding & Import (design spec)

**Datum:** 2026-07-19
**Projekt:** agro-svet.cz (Astro 6 + Supabase, deploy Cloudflare Worker)
**Předpoklad:** proběhne plánovaná migrace DB (řeší se zvlášť, mimo tento spec).

## Cíl

Naplnit bazar předpřipravenými inzeráty od vytipovaných prodejců (typicky z Bazoše,
prodejci s více nabídkami v kategorii zemědělství). Inzerát je **neveřejný**, dokud ho
prodejce sám **nepotvrdí přes odkaz** — potvrzením uděluje souhlas se zveřejněním.
Součástí je poloautomatický **import z URL** s AI přepisem textu pro SEO.

Řeší cold-start marketplace: prázdný bazar nikdo nepoužije.

## Právní rámec (proč to takhle)

- Inzerát je do potvrzení **neveřejný** → před souhlasem nízké riziko.
- **Souhlas vlastníka** (klik na odkaz + odsouhlasení podmínek) je právní základ pro
  zveřejnění fotek i textu. Uchováváme doklad: čas, IP, verze podmínek.
- **AI přepis textu** = originální obsah (ne kopie) → řeší duplicate content i copyright textu.
- Fotky se do potvrzení používají jen v **neveřejném náhledu** pro daného prodejce.
- **GDPR data minimization:** kontakt a drafty neodpovídajících prodejců se po 30 dnech mažou.

## Klíčová rozhodnutí (z brainstormingu)

| Téma | Rozhodnutí |
|---|---|
| Ověření / převzetí | **Magic-link token** (klik = ověření). Bez SMS, bez OTP. |
| Heslo | **Passwordless-first**, heslo volitelné (jinak příště přihlašovací odkaz). |
| Kanál oslovení | E-mail přes **Resend** (už nakonfigurováno) + **WhatsApp odkaz vkládá admin ručně**. |
| Náklady | ~0 Kč (Resend free tier, AI přepis pár haléřů/inzerát, žádné SMS). |
| Tvorba draftu | **Import z URL** (parse + fotky + AI SEO přepis + auto-návrh kategorie) → admin doladí. |

## Stávající stav (co už v repu je)

- `bazar_users` (FK → `auth.users`), `bazar_listings`, `bazar_images` (Supabase Storage `bazar-images`).
- Supabase Auth e-mail magic-link už funguje (`/bazar/auth/callback`, `prihlaseni`, `registrace`).
- `bazar_users.is_admin` pro admin gating; admin sekce `/admin/bazar`.
- Resend: `RESEND_API_KEY`, odesílatel `bazar@mail.agro-svet.cz` (lib `bazar-report-email.ts`).
- `bazar_listings.status` CHECK aktuálně `('active','sold','expired')`.

## Datový model (změny)

### `bazar_listings` (úprava)
- `status` CHECK rozšířit o **`'pending_claim'`**.
- `user_id` → **nullable** (pre-claim draft nemá reálného uživatele).
- nový sloupec `seed_prospect_id uuid NULL REFERENCES bazar_seed_prospects(id) ON DELETE CASCADE`.

### `bazar_seed_prospects` (nová tabulka)
Jeden řádek = jeden oslovený prodejce (může mít víc draft inzerátů).

```
id              uuid PK
name            text
phone           text
email           text
source_url      text            -- profil / inzerát na Bazoši
claim_token     text UNIQUE     -- náhodný, jednorázový
token_expires_at timestamptz    -- default now()+30 dní
channel         text            -- 'email' | 'whatsapp' | null (zatím jen připraveno)
status          text            -- 'draft'|'sent'|'opened'|'confirmed'|'expired'  (default 'draft')
opened_at       timestamptz NULL
confirmed_at    timestamptz NULL
confirmed_ip    text NULL
terms_version   text NULL
user_id         uuid NULL REFERENCES bazar_users(id)  -- doplní se po potvrzení
created_by      uuid REFERENCES bazar_users(id)       -- admin
created_at      timestamptz DEFAULT now()
```

### RLS
- `bazar_listings` SELECT: `pending_claim` **skrýt z veřejnosti** — public policy povolí jen
  `status <> 'pending_claim'`; admin/service role vidí vše. (Veřejné výpisy stejně filtrují
  `status='active'`, ale RLS to zajistí i proti přímému dotazu anon klíčem.)
- `bazar_seed_prospects`: čte/píše jen admin (a server přes service role). Claim endpoint čte
  konkrétní řádek podle tokenu přes **service role** (obchází RLS řízeně).

## Admin flow — příprava (`/admin/bazar/seed`)

1. **Import z URL** — pole na 1+ odkazů (hromadný import celého profilu prodejce).
   - Server stáhne stránku, vyparsuje: název, cena, popis, lokalita, značka, fotky.
   - Fotky stáhne do Storage jako draft `bazar_images`.
   - **AI přepíše popis** → unikátní, SEO-laděný text; vygeneruje SEO titulek. Fakta
     (cena/značka/rok/motohodiny) zůstávají beze změny.
   - **Auto-návrh kategorie/podkategorie** z názvu a popisu.
   - *Best-effort parser* — když se nepovede, admin doplní ručně (parser nikdy neukládá naslepo).
2. **Kontrola a doladění** — admin upraví text, kategorii, cenu; potvrdí prospekta (jméno/tel/mail/URL).
3. **Uložení** → inzerát(y) `status='pending_claim'`, `user_id=NULL`, navázané na prospekta.
4. **Rozeslání odkazu** — u prospekta dvě akce:
   - **„Kopírovat odkaz"** (admin vloží do WhatsApp).
   - **„Poslat e-mailem"** (Resend). Po akci `status='sent'`.
5. **Přehled prospektů** se stavem: draft → sent → opened → confirmed / expired.

## Prodejce flow — převzetí (`/bazar/prevzit/[token]`)

1. Otevře odkaz → server ověří token (existuje, neexpiroval, nepotvrzeno) → zapíše
   `opened_at`, `status='opened'`.
2. Zobrazí **náhled inzerátu** (fotky, cena, popis) + transparentní řádek
   *„Připravili jsme vám to podle vašeho inzerátu na Bazoši."*
3. Text souhlasu + CTA **„Zveřejnit můj inzerát"** (odsouhlasení podmínek — odkaz na `/bazar/pravidla`).
4. Klik → server (**service role**):
   - vytvoří / dohledá `auth.users` + `bazar_users` (passwordless),
   - přepne inzeráty prospekta na `status='active'`, doplní `user_id`,
   - zapíše audit: `confirmed_at`, `confirmed_ip`, `terms_version`, `status='confirmed'`.
5. Přihlásí prodejce a nabídne **volitelné nastavení hesla**; pak redirect na `/bazar/moje`.

**Edge — e-mail už má účet:** nevytvářet duplicitně; nabídnout přihlášení (magic-link) a po
přihlášení navázat drafty na existujícího uživatele.

## Bezpečnost

- `claim_token` dlouhý náhodný řetězec, **jednorázový + expirace** (30 dní).
- Vytváření účtu a čtení prospektů podle tokenu **jen server-side přes service role**.
- Odkaz vázaný na konkrétního prospekta; po potvrzení neplatný.

## Automatický úklid (GDPR)

- Naplánovaná úloha (cron / edge): prospekty ve stavu `sent/opened/draft` starší **30 dní**
  → smazat prospekta (CASCADE smaže i draft inzeráty a jejich draft fotky ze Storage).
- Neruší potvrzené inzeráty (ty už patří prodejci).

## Fáze 2 (mimo tento spec, vědomě odloženo)

- Automatické upomínkové e-maily neodpovídajícím.
- Lákadlo „první topování zdarma".
- WhatsApp Business API / SMS OTP (jen kdyby se objevilo zneužívání).

## Rozsah / co je hotové vs. nové

- **Znovupoužít:** formulářové komponenty inzerátu (CatalogPicker, ImageUpload, LocationInput…),
  Storage bucket, Resend lib, Auth callback, admin gating.
- **Nové:** migrace (status + nullable user_id + tabulka prospektů + RLS), admin `/admin/bazar/seed`
  (import z URL, AI přepis, seznam prospektů, odeslání), claim stránka `/bazar/prevzit/[token]`,
  claim API (service role), Resend šablona pozvánky, cron úklid.

## Otevřené body k potvrzení

- Doba expirace / úklidu: **30 dní** (návrh) — OK?
- AI přepis: použít Resend? Ne — přepis běží přes AI API (levný model) při importu; potvrdit,
  který (např. Claude Haiku / jiný nakonfigurovaný v projektu).
