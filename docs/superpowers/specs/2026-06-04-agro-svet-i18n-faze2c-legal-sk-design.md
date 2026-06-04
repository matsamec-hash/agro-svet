# agro-svet i18n — Fáze 2c: SK legal stránky

**Datum:** 2026-06-04
**Fáze:** 2c — lokalizace právních stránek pro SK (po 2b A+B+C HOTOVÝCH)
**Branch:** `feat/i18n-sk-legal` (z `origin/master` `138d233`, worktree `~/agro-svet-i18n-statistiky`)
**Spec vzor:** balíky 2b (stejná locale-branch + launch architektura)

## Cíl

Lokalizovat 4 právní stránky pro /sk tak, aby SK uživatel dostal slovenský právní text s českým provozovatelem jako právním základem + slovenským doplňkem (dozorový úřad). Stránky budou indexovatelné (`index,follow`, self-canonical, reciproční hreflang, sitemap). Footer/CookieConsent/Newsletter z /sk budou odkazovat na /sk legal verze.

**Tvrdé pravidlo i18n:** CZ výstup se nesmí obsahově změnit. Stránky jsou SSR (nebo se na SSR převedou) → cs identita se ověřuje **živě**.

## Rozsah (4 stránky, SCHVÁLENO)

`src/pages/podminky-pouziti.astro`, `src/pages/zpracovani-osobnich-udaju.astro`, `src/pages/dsa-kontakt.astro`, `src/pages/redakce.astro`.

**MIMO rozsah:** `src/pages/fotosoutez/gdpr.astro` — sekce `photo` je pro /sk skrytá (`HIDDEN_SECTIONS['sk']` obsahuje `photo`), takže její GDPR stránka není pro SK relevantní.

## Jurisdikční přístup (CZ provozovatel + SK doplněk, SCHVÁLENO)

**Provozovatel = Samec Digital s.r.o., IČO 29547539** (český subjekt — potvrzeno footer copyrightem). Dle GDPR „one-stop-shop" je pro českého správce vedoucím dozorovým úřadem **ÚOOÚ (CZ)** i pro SK uživatele.

- Próza → slovenština. **Právní základ zůstává CZ:** GDPR (2016/679) + zákon č. 110/2019 Sb., správce Samec Digital s.r.o., Cloudflare SCC doložky, sídlo — vše beze změny obsahu (jen přeloženo).
- **`zpracovani-osobnich-udaju` — KLÍČOVÁ adaptace:** dnešní cs text (ř. ~104–105) uvádí stížnost u „Úřadu pro ochranu osobních údajů, Pplk. Sochora 27, 170 00 Praha 7". V sk větvi **ÚOOÚ zachovat jako vedoucí úřad** + **doplnit větu**, že SK uživatelé mohou podat stížnost také u **Úradu na ochranu osobných údajov SR** (Hraničná 4826/12, 820 07 Bratislava 27, dataprotection.gov.sk). NEpřepisovat na SK právo, jen přidat SK kontaktní možnost — legálně bezpečné.
- `podminky-pouziti`: SK překlad; zmínka, že se vztah řídí českým právem provozovatele, zachována (přeložená). Odkaz `/fotosoutez/gdpr/` v sk větvi → ponechat na cs (photo skryté; navHref to nepřeprefixuje, viz launch).
- `dsa-kontakt`: DSA je EU-wide nařízení → překlad, kontakty/identifikátory beze změny.
- `redakce`: čistý překlad (redakční info, jurisdikčně neutrální).

## Aktuální stav stránek

- **Render mód** (`output: 'server'` → bez `prerender` flagu = SSR):
  - `podminky-pouziti`, `zpracovani-osobnich-udaju`, `dsa-kontakt` = **bez flagu → už SSR** (middleware-rewrite je pod /sk už pokrývá, dnes servírují cs tělo + noindex).
  - `redakce` = **`prerender = true`** → nutný flip na `false`.
- **Obsah:** natvrdo psaná česká próza v JSX (nadpisy `<h2>`, odstavce, seznamy, u `zpracovani` i `<table>`). NE markdown kolekce.
- **Odkazy na legal stránky** (dnes hardcoded cs hrefs):
  - `Footer.astro` bottom-bar (ř. ~42–50): `/redakce/`, `/podminky-pouziti/`, `/fotosoutez/gdpr/`, `/dsa-kontakt/` (+ `/hledat/`, mailto). Hlavní nav sloupce už `navHref` mají; bottom-bar NE.
  - `CookieConsent.astro` (ř. 11): `/zpracovani-osobnich-udaju/`.
  - `Newsletter.astro` (ř. 29): `/zpracovani-osobnich-udaju/` (komponenta nemá `locale`/`navHref` import).

## Architektura (Option A — locale-branched inline JSX, SCHVÁLENO)

- Všechny 4 `.astro` → **`prerender = false`** (redakce flip; ostatní 3 explicitně doplnit `export const prerender = false;` pro jistotu/čitelnost, i když už SSR jsou).
- Locale z `Astro.locals.locale ?? 'cs'`; `const isSk = locale === 'sk'`.
- Tělo stránky obalit `{isSk ? (<sk JSX>) : (<cs JSX VERBATIM>)}`. **cs větev = dnešní markup bez jediné změny** (text, nadpisy, tabulky, třídy). sk větev = slovenský překlad téže struktury + jurisdikční doplněk.
- `<Layout>` `title`/`description` locale-branched (`isSk ? '<sk>' : '<cs verbatim>'`); `canonical` jen pro cs (`canonical={isSk ? undefined : <cs canonical>}`), sk self-canonical doplní Layout z `localizedPathname`.
- `<style>` bloky beze změny.
- SK próza psaná přímo do JSX (ručně + AI výpomoc přes `i18n-translate.py` `translate_body` na extrahovaný text jako pomůcka; finální tvar je JSX). QA na CZ-kontaminaci (case-insensitive ř/ě/ů + slova bez diakritiky „Aktuální").

## i18n stringy

- Krátké chrome klíče `legal.*` jen kde se sdílí napříč (typicky není mnoho — title/description jdou inline ternárem v každé stránce, breadcrumby legal stránky nemají). **Dlouhá próza zůstává inline v JSX** (Option A — ne i18n klíče).
- Pokud se přidají `legal.*` klíče: parity test `tests/i18n/legal.test.ts` (vzor `puda.test.ts`): každý cs klíč má sk + žádná sk ř/ě/ů. Pokud se žádné `legal.*` klíče nepřidají (vše inline), test vynechat.

## Gating / launch

- `src/i18n/utils.ts`: `SK_LAUNCHED_PREFIXES` += `'/podminky-pouziti'`, `'/zpracovani-osobnich-udaju'`, `'/dsa-kontakt'`, `'/redakce'`. → index,follow + self-canonical + reciproční hreflang na cs + sitemap auto-mirror.
- `src/components/Footer.astro` bottom-bar: obalit legal hrefs `navHref(locale, href)` (`/redakce/`, `/podminky-pouziti/`, `/dsa-kontakt/`; volitelně i `/hledat/`, `/fotosoutez/gdpr/` — navHref je nepřeprefixuje, protože nejsou launchnuté → bezpečné obalit uniformě). `navHref`+`locale` už importované.
- `src/components/CookieConsent.astro`: `/zpracovani-osobnich-udaju/` → `navHref(locale, '/zpracovani-osobnich-udaju/')`. Přidat import `navHref` (locale už je).
- `src/components/Newsletter.astro`: `/zpracovani-osobnich-udaju/` → `navHref(locale, ...)`. Přidat `import { useTranslations, navHref, getLocaleFromUrl } from '../i18n/utils'` (dle vzoru Footer) + `const locale = Astro.locals.locale ?? getLocaleFromUrl(Astro.url)`.
- `LOCKED_SECTION_PREFIXES` zůstává `[]` (legal nikdy locked).
- `src/pages/sitemap.xml.ts`: ověřit, že generický skMirror přidá 4 legal URL automaticky (mají se objevit `/sk/podminky-pouziti/` atd. po doplnění do SK_LAUNCHED_PREFIXES). Pokud sitemap legal stránky nezahrnuje do cs části (root pages), ověřit že jsou v `staticPaths`/zdroji, který skMirror iteruje — případně doplnit.

## Riziko & verifikace

- **Gate:** `npx astro build` + `npx vitest run` (Node 22, `nvm use 22`).
- **Worker-size:** legal = jen text, zanedbatelný přírůstek; rezerva ~674 KB po balíku C. Žádný shiki (žádný markdown render — inline JSX).
- **CZ byte-identita:** SSR nejde diffovat staticky → **živě** po deployi: cs `/podminky-pouziti/` (+3) 200, `lang=cs`, identický text, reciproční sk hreflang.
- **Live smoke:** sk `/sk/{podminky-pouziti,zpracovani-osobnich-udaju,dsa-kontakt,redakce}/` 200, `lang=sk`, `index,follow`, self-canonical `/sk/...`, SK próza; `/sk/zpracovani-osobnich-udaju/` obsahuje **SK DPA zmínku** (Úrad na ochranu osobných údajov SR) i ÚOOÚ; footer z /sk odkazuje na /sk legal; cs nezměněno; sitemap má 4 sk legal URL.
- **Souběžný deployer:** deploy manuální `npm run deploy`; hlídat `wrangler deployments list`. **User potvrdí PŘED deployem.**

## Glosář SK (legal)

- ochrana osobných údajov, dozorný úrad, prevádzkovateľ (správce), spracúvanie/spracovanie osobných údajov, podmienky používania, súhlas, práva dotknutej osoby, sťažnosť, GDPR (Nariadenie 2016/679), DSA (akt o digitálnych službách), redakcia.
- Doplněk: „Úrad na ochranu osobných údajov Slovenskej republiky, Hraničná 4826/12, 820 07 Bratislava 27, dataprotection.gov.sk".

## Co je MIMO rozsah

- `fotosoutez/gdpr` (photo skryté pro /sk).
- Přepis na SK právo / SK provozovatele (provozovatel je CZ).
- Fáze 3 UK.

## Subagent-driven exekuce

1 commit/task, per-task `git show --stat HEAD` scope verify. **Cizí WIP nikdy necommitovat** (`public/og/howto-*.png` 6 untracked; žádný `git add -A`). Branch z `origin/master`.
