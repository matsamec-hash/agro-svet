# Agro Bazar — Design Spec

## Overview

Plnohodnotny marketplace pro zemedelskou techniku, pozemky, zvirata a sluzby na agro-svet.cz. Inspirovano Bazos.cz — jednoduchy, funkcni, kontakt primo na prodejce.

**Stack:** Astro 6 SSR (Cloudflare adapter) + Supabase (sdileny projekt s zena zije)

---

## 1. Databazovy model

Sdileny Supabase projekt, tabulky s prefixem `bazar_`.

### bazar_users

| Sloupec    | Typ                         | Popis                |
| ---------- | --------------------------- | -------------------- |
| id         | uuid (PK, = auth.users.id)  | Supabase auth ID     |
| name       | text                        | Jmeno / firma        |
| phone      | text                        | Telefon              |
| email      | text                        | Kontaktni email      |
| location   | text                        | Mesto / okres        |
| created_at | timestamptz                 | Registrace           |

### bazar_listings

| Sloupec     | Typ                          | Popis                                      |
| ----------- | ---------------------------- | ------------------------------------------ |
| id          | uuid (PK)                    |                                            |
| user_id     | uuid (FK -> bazar_users)     | Autor                                      |
| title       | text                         | Nazev inzeratu                             |
| description | text                         | Popis                                      |
| price       | integer (nullable)           | Cena v Kc (null = dohodou)                 |
| category    | text                         | Kategorie                                  |
| subcategory | text (nullable)              | Podkategorie                               |
| brand       | text (nullable)              | Znacka (nullable — u pozemku neni relevantni) |
| location    | text                         | Lokalita                                   |
| phone       | text                         | Kontaktni telefon                          |
| email       | text                         | Kontaktni email                            |
| status      | text                         | active / sold / expired                    |
| created_at  | timestamptz                  |                                            |
| updated_at  | timestamptz                  |                                            |
| expires_at  | timestamptz                  | Expirace (30 dni)                          |

### bazar_images

| Sloupec      | Typ                           | Popis                  |
| ------------ | ----------------------------- | ---------------------- |
| id           | uuid (PK)                     |                        |
| listing_id   | uuid (FK -> bazar_listings)   |                        |
| storage_path | text                          | Cesta v Supabase Storage |
| position     | integer                       | Poradi (1-5)           |
| created_at   | timestamptz                   |                        |

### Kategorie

- Traktory
- Kombajny
- Seci stroje
- Postrikovace
- Privezy
- Nahradni dily
- Prislusenstvi
- Osiva a hnojiva
- Pozemky
- Zvirata
- Sluzby
- Ostatni

### Znacky (filtr)

John Deere, CLAAS, Fendt, Zetor, New Holland, Kubota, Case IH, Massey Ferguson, Deutz-Fahr, jina

---

## 2. Stranky a routy

### Verejne (bez prihlaseni)

| Routa                 | Popis                                                                                         |
| --------------------- | --------------------------------------------------------------------------------------------- |
| `/bazar/`             | Vypis inzeratu — seznamovy layout (radky), vyhledavaci panel, filtry (kategorie, znacka, lokalita, cena), strankovani |
| `/bazar/[id]/`        | Detail inzeratu — galerie fotek, popis, cena, kontakt, lokalita, datum                        |
| `/bazar/registrace/`  | Registrace — email + heslo + jmeno + telefon + lokalita                                       |
| `/bazar/prihlaseni/`  | Prihlaseni — email + heslo                                                                    |

### Chranene (vyzaduji prihlaseni)

| Routa                 | Popis                                                                                         |
| --------------------- | --------------------------------------------------------------------------------------------- |
| `/bazar/novy/`        | Formular pro vlozeni inzeratu                                                                 |
| `/bazar/moje/`        | Dashboard — moje inzeraty, stav, akce (editovat, smazat, oznacit prodano)                     |
| `/bazar/moje/[id]/`   | Editace inzeratu                                                                              |
| `/bazar/profil/`      | Uprava profilu                                                                                |

### UX flow

1. Navstevnik prohlizi `/bazar/`, filtruje, klikne na inzerat
2. Na detailu vidi kontakt — zavola nebo napise email
3. Chce prodat -> registrace -> prihlaseni -> vlozi inzerat
4. Spravuje inzeraty v `/bazar/moje/`
5. Inzerat expiruje po 30 dnech, lze prodlouzit

---

## 3. UI design

Konzistentni s HP agro-svet.cz (Chakra Petch headingy, Roboto Condensed body, #FFFF00 accent, border-radius 18px, shadow). Inspirace layoutem Bazos.cz.

### Vypis `/bazar/`

- **Vyhledavaci panel nahore** — pole: hledany vyraz, kategorie (select), znacka (select), lokalita, cena od-do, tlacitko "Hledat" (`.btn-primary`)
- **Podkategorie** — rada zlutych `.tag` pilulek pod vyhledavanim
- **Inzeraty jako radky** — miniatura fotky vlevo (120x90px, radius 10px), vpravo: titulek (Chakra Petch), cena zvyraznena (font-weight 700, zluty accent), lokalita + datum sede
- **Hover**: jemny background `#f9f9f9`
- **Strankovani** — 20 inzeratu na stranku, cislovane stranky dole (1, 2, 3... Dalsi)
- Max-width 1280px

### Detail `/bazar/[id]/`

- Galerie fotek nahore (hlavni foto + thumbnaily)
- Cena — velka, Chakra Petch, tucna
- Info box: lokalita, datum vlozeni, pocet zobrazeni
- Kontakt: telefon + email prodejce (viditelny primo)
- Popis v `.prose` stylu
- Breadcrumb: Bazar -> Kategorie -> Nazev

### Formulare

- Max-width 600px, centrovane
- Inputy s border-radius 10px, focus border zluta
- `.btn-primary` pro submit
- Drag & drop / klik pro upload fotek (max 5, max 5MB, JPEG/PNG/WebP)

### Dashboard `/bazar/moje/`

- Seznamovy/kartovy prehled vlastnich inzeratu
- Status badge: zelena (aktivni), seda (expirovano), oranzova (prodano)
- Akce: editovat, smazat, oznacit prodano, prodlouzit

---

## 4. Auth & bezpecnost

### Registrace

- Email + heslo + jmeno + telefon + lokalita
- Supabase Auth (email/password provider)
- Potvrzovaci email pro overeni uctu
- Po registraci redirect na `/bazar/prihlaseni/`

### Prihlaseni

- Email + heslo
- "Zapomenute heslo" -> Supabase password reset email
- Po prihlaseni redirect na `/bazar/moje/`

### Session management

- Supabase session token v httpOnly cookie (server-side)
- Astro middleware overuje cookie na chranenych routach
- Neprihlaseny -> redirect na `/bazar/prihlaseni/`

### Row-Level Security

- `bazar_listings`: SELECT pro vsechny, INSERT/UPDATE/DELETE jen vlastnik (`user_id = auth.uid()`)
- `bazar_images`: stejne pravidlo pres listing ownership
- `bazar_users`: SELECT pro vsechny, UPDATE jen vlastni profil
- Storage bucket `bazar-images`: upload jen prihlaseny, read verejny

### Validace

- Server-side validace vsech formularu (Astro SSR)
- Max 5 fotek, max 5MB/fotka, jen JPEG/PNG/WebP
- Sanitizace textovych vstupu proti XSS
- Rate limiting na vkladani inzeratu (max 10/den)

---

## 5. Supabase integrace

### Sdileni s zena zije

- Stejny Supabase projekt, tabulky s prefixem `bazar_`
- Oddeleny Storage bucket: `bazar-images`
- Auth sdileny, uzivatele se registruji nezavisle

### Env promenne (`.env`)

- `SUPABASE_URL` — URL projektu
- `SUPABASE_ANON_KEY` — verejny klic (klientsky upload fotek)
- `SUPABASE_SERVICE_KEY` — servisni klic (server-side only)

### Astro SSR setup

- `@astrojs/cloudflare` adapter
- `output: 'server'` v astro.config.mjs
- Existujici staticke stranky: `prerender: true` (zustanou staticke)
- Bazar stranky: SSR (dynamicke)

### Supabase klienti

- `src/lib/supabase.ts` — server-side klient (service key)
- `src/lib/supabase-browser.ts` — klientsky klient (anon key, jen pro upload fotek)
- `src/middleware.ts` — cte session cookie, nastavi `locals.user`
