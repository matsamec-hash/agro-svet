# Bazar — onboarding prodejců (karty, publikace po jednom, /prodejce kód)

**Datum:** 2026-07-23
**Větev:** `feat/bazar-prodejce-onboarding`
**Navazuje na:** [2026-07-19-bazar-seed-import-design.md](2026-07-19-bazar-seed-import-design.md) (seed/import flow, prospekti, claim link)

## Cíl

Umožnit adminovi (JÁ) předchystat inzeráty **většímu prodejci pod jeden účet** a nechat ho je
pohodlně a bezpečně zveřejnit — po jednom nebo hromadně. Prodejce se dostane ke svým inzerátům
buď přes odkaz z e-mailu, nebo přes **krátký kód**, který mu pošlu (e-mailem / z mobilu / po
telefonu). Účet se ověří a propojí přes e-mail. Placenou SMS bránu zatím neděláme.

Vztah **prospekt (= prodejce/účet-kontejner) 1─N inzerátů** už ve schématu existuje
(`bazar_listings.seed_prospect_id`); dnes ho admin UI nevyužívá — každý import založí nového
prospekta s jedním draftem. Tento návrh ten vztah zpřístupní a doplní bezpečný kód-vstup.

## Rozsah (v1)

1. **Admin: karty po prodejcích + přidat/odebrat inzeráty**
2. **Publikace po jednom** na claim/prodejce stránce
3. **E-mail** — hotovo a schváleno (on-brand, zvládá 1 i N inzerátů) ✅
4. **`/prodejce`** — vstup přes 6znakový alfanumerický kód (Turnstile + rate-limit), ověření e-mailem

**Mimo rozsah:** placená SMS brána (DB má `channel` připravený; doděláme jen když otevřenost
e-mailu + WhatsApp zklame).

---

## 1. Admin: karty po prodejcích

**Dnes:** `/admin/bazar/seed/` je plochá tabulka, jeden řádek = jeden prospekt, mapování
`draftByProspect` bere jen **první** draft prospekta. Každý import (jednotlivý i hromadný) vytvoří
nového prospekta.

**Nově:**
- Přehled překlopit na **karty po prodejcích** — jedna karta = prospekt, pod ním seznam všech jeho
  draftů (titul, cena, stav, náhled, odebrat).
- Import (jednotlivý i hromadný) dostane volbu **cíle**:
  - „Nový prodejce" (default, dnešní chování) — `createProspectWithDraft`.
  - „Přidat k prodejci …" (select z existujících prospektů se statusem `draft`/`sent`/`opened`) —
    použije existující `addDraftListing(supabase, prospectId, …)`. Kontakt se bere z prospekta,
    ne z importu.
- **Odebrat inzerát** (per-listing) — smaže jeden draft, prospekt i ostatní zůstanou. Aktivní
  (živé) inzeráty se odmítnou mazat (jako dnes v bulk delete).
- Prospekt-level akce beze změny: poslat e-mailem, kopírovat odkaz, WhatsApp, smazat celého.

**Dotčené soubory:** `src/pages/admin/bazar/seed/index.astro` (přehled + import formy),
`src/pages/admin/bazar/seed/api/import.ts` (přijmout volitelný `prospectId`),
nová `…/api/remove-listing.ts` (smaž jeden draft), případně drobnost v `src/lib/bazar-seed.ts`.

## 2. Publikace po jednom

**Dnes:** `confirmProspect` zveřejní **všechny** inzeráty prospekta najednou
(`.eq('seed_prospect_id', …)` → `status='active'`). Claim stránka má jedno tlačítko „Zveřejnit".

**Nově:**
- Na claim/prodejce stránce dostane každý inzerát **checkbox** (default zaškrtnuto) + „vybrat vše"
  a tlačítko **„Zveřejnit vybrané"**.
- Confirm API přijme seznam `listingIds` a zveřejní **jen vybrané** (`status='active'`).
- **Nevybrané zůstanou jako draft navěšený na jeho reálný účet** — po potvrzení dostanou
  `user_id`, ale zůstanou neveřejné (status `pending_claim`). V `/bazar/moje/` se zobrazí jako
  „připraveno k zveřejnění" s tlačítkem Zveřejnit; prodejce je dopublikuje kdykoli později, nebo
  je nechá a po 30 dnech se smažou.
- Účet + auto-login se založí při prvním potvrzení jako dnes (`ensureUser` + magic-link cookies).

**Rozhodnutí (schváleno):** nevybrané inzeráty se **nemažou hned** — zůstanou prodejci jako
draft v „Moje inzeráty".

**Dotčené soubory:** `src/lib/bazar-seed.ts` (`confirmProspect` přijme `listingIds`, publikuje
jen vybrané, ostatním nastaví `user_id` a nechá `pending_claim`),
`src/pages/bazar/prevzit/[token].astro` a `…/prevzit/api/confirm.ts` (checkboxy + předání ID),
`src/pages/bazar/moje/…` (zobrazit vlastní `pending_claim` drafty + tlačítko Zveřejnit).

## 3. E-mail — HOTOVO ✅

`src/lib/bazar-seed-email.ts` přepsán: identita webu (černá + žlutý akcent, Chakra Petch),
podpora 1 i N inzerátů (`listingCount`), správné skloňování (`pluralInzerat`), preheader, blok
„jak mazat / po 30 dnech se smaže", patička „Kdo jsme". Test `bazar-seed-email.test.ts` prochází.
Zbývá: v `…/seed/api/send.ts` dopočítat a předat `listingCount` (počet draftů prospekta).

## 4. `/prodejce` — vstup přes kód

Alternativní vstup ke claim odkazu, vhodný hlavně když kód posílám z mobilu / diktuju po telefonu.
Kód i odkaz míří na **téhož prospekta** a sdílejí stejný backend (publikace po jednom, ověření).

**Kód:** 6 znaků, **alfanumericky bez matoucích znaků** (vynechat `0 O 1 I L`), uložený na
prospektovi vedle stávajícího `claim_token`. Keyspace ~31⁶ ≈ 0,9 mld → brute-force nereálný.
Expirace shodná s inzerátem (30 dní).

**Stránka `/prodejce`:**
1. Pole na kód + **Turnstile** (`src/lib/contest-turnstile.ts` už na webu je).
2. Po ověření kódu → stejný pohled jako `/bazar/prevzit` (seznam inzerátů, checkboxy, náhledy).
3. Prodejce vybere, co zveřejnit, a zadá **e-mail**; pošleme mu **magic-link**, kterým se přihlásí
   a inzeráty jsou jeho (napojení na existující magic-link login v bazaru).

**Bezpečnost (nutné):**
- **Turnstile** na formuláři s kódem.
- **Rate-limit**: pár pokusů na IP za 10 min; po X globálně špatných pokusech kód dočasně zamknout.
- Kód expiruje (30 dní).

**Dotčené soubory:** migrace (sloupec `claim_code` + index na `bazar_seed_prospects`),
`src/lib/bazar-seed-token.ts` (generátor kódu bez matoucích znaků),
nová stránka `src/pages/prodejce/index.astro` + `…/api/verify-code.ts` (Turnstile + rate-limit →
resolve prospekta → session/redirect na claim pohled), admin UI zobrazí/kopíruje kód u prospekta.

---

## Datový model (beze změny schématu kromě kódu)

- `bazar_seed_prospects`: **+ `claim_code` (text, unique, nullable)**, `+ code_locked_at`/pokusy dle
  zvolené rate-limit strategie. Zbytek beze změny (name/phone/email/claim_token/token_expires_at/
  status `draft→sent→opened→confirmed`/channel/user_id).
- `bazar_listings`: beze změny. `seed_prospect_id` váže inzerát na prospekta; `status`
  `pending_claim → active`; `user_id` null → nastaví se při potvrzení (i u nevybraných draftů).

## Rizika / okrajové případy

- **Brute-force kódu** → Turnstile + rate-limit + expirace (viz výše).
- **Částečná publikace**: nevybrané drafty musí být jasně odlišené v `/moje` (neveřejné), ať je
  prodejce nepovažuje za živé.
- **Kolize kódu** při generování → unique index + retry generátoru.
- **Idempotence**: opětovné potvrzení již `confirmed` prospekta musí bezpečně skončit (dnes hlídá
  `confirmProspect`).

## Testy

- `pluralInzerat` + `buildClaimEmail` (✅ hotové).
- Generátor kódu: délka 6, jen povolená abeceda, bez matoucích znaků.
- `confirmProspect` s `listingIds`: publikuje jen vybrané, ostatním nastaví `user_id` a nechá
  `pending_claim`; prázdný výběr = chyba.
- verify-code: špatný kód, expirovaný kód, zamčený kód, správný kód → prospekt.
