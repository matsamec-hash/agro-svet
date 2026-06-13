# HANDOFF — UK lokalizace Fáze 2 (stroje/srovnání/značky/encyklopedie) — EXEKUCE

**Datum:** 2026-06-07
**Pro:** další kontextové okno
**Režim exekuce:** **Subagent-Driven** (`superpowers:subagent-driven-development`) — čerstvý subagent na každý task, two-stage review mezi tasky.

---

## 0. Stav teď (co je hotové)

Brainstorm + spec + plán **HOTOVÉ a commitnuté** na větvi `feat/i18n-uk-faze2-stroje` (repo `~/agro-svet`):
- `e43d81f` — fáze 1 foundation (chrome `uk.ts`, plurály) — z minulé session.
- `2cca6d9` — **design spec** (+ vtažené handoff zadání fází 2-4).
- `7514a13` — **implementační plán** (15 tasků, A–E).

**Žádný produkční kód ani obsah zatím nevznikl.** Začíná se Taskem A1.

Klíčové dokumenty (číst v tomto pořadí):
1. **Plán (hlavní):** `docs/superpowers/plans/2026-06-07-agro-svet-i18n-uk-faze2-stroje-content.md` — task-by-task, kompletní kód, TDD, bez placeholderů.
2. **Spec (proč/co):** `docs/superpowers/specs/2026-06-07-agro-svet-i18n-uk-faze2-stroje-content-design.md`
3. **Širší zadání fází 2-4:** `docs/superpowers/specs/2026-06-07-agro-svet-i18n-uk-faze2-4-zadani.md`

---

## 1. Co se staví (1 věta)

Ukrajinská lokalizace obsahových těl 4 sekcí (`/stroje`, `/srovnani`, `/znacky`, `/encyklopedie`) + zapnutí jejich indexace pod `/uk`, **beze změny CZ a SK výstupu**. Mirror hotového SK vzoru.

## 2. Rozhodnutí (NEMĚNIT bez uživatele)

- **Překlad:** AI překlad (subagent A) **+ AI review pass** (subagent B) na každý prózový artefakt. Launchne se automaticky (uživatel nechce ruční review-gate).
- **Rozsah:** všechny 4 sekce v jednom incrementu, launch hromadně (Task E1).
- **Wikipedia odkazy** = ponechat cs. **Catalog huby** = cs názvy (jako SK). **Slug** = cs (nepřekládá se).

## 3. PRVNÍ KROK dalšího okna

1. Načíst paměť + tento handoff + plán.
2. **Založit worktree** z `feat/i18n-uk-faze2-stroje` (provozní lekce: feature práce VŽDY ve worktree kvůli shared-stash hazardu). `.env` zkopírovat do worktree (build/deploy ho potřebuje).
3. Invoke `superpowers:subagent-driven-development` a jet plán od **Task A1**.

## 4. Pořadí tasků (z plánu)

- **A1–A4 (kód prerekvizita):** `isLaunchedPath`+`LAUNCHED_PREFIXES` (SK alias zachován) → navHref/langSwitchHref → Layout noindex+hreflang cs/sk/uk → sitemap uk mirror. *Před launchem jsou uk prefixy prázdné → A1–A4 jsou no-op pro výstup, jen připravují infra.*
- **B1–B3 (kolekce+routing):** `znackyUk`/`encyklopedieUk` kolekce → encyklopedie detail per-locale (bez cs leaku, 404) → znacky detail per-locale.
- **C1–C3 (generátory):** faq-generator → competitor-finder `useCaseDescription` → comparison-insights. `L(cs,sk)`→3 jazyky; **cs/sk argumenty MUSÍ zůstat byte-identické** (chrání je `tests/lib/comparison-insights.test.ts` pairs 0–8 + `tests/lib/faq-generator.test.ts`).
- **D1–D3 (OBSAH, masivně paralelní):** 24 `src/data/stroje/uk/*.yaml` → ~24 `src/content/znacky-uk/*.md` → ~44 `src/content/encyklopedie-uk/*.md`. Pro každý soubor: překlad subagent + review subagent. Přesné dispatch instrukce + pravidla „co se nepřekládá" jsou v plánu (Group D).
- **E1–E3 (launch+verifikace):** `LAUNCHED_PREFIXES.uk = ['/stroje','/srovnani','/znacky','/encyklopedie']` → `npx vitest run` + build + CZ/SK regrese → živý smoke (deploy je akce uživatele).

## 5. Tvrdá pravidla (každý task)

- **CZ ani SK výstup se nesmí změnit.** Po každém zásahu do generátorů spustit byte-identity testy.
- **Slug/čísla/URL/`heroImage`/`youtubeId`/datumy/`wikidata`/`znacka` se NEMĚNÍ.** Překládá se jen próza.
- Chybějící uk obsah u encyklopedie = 404 (žádný cs fallback). U znacky je cs fallback zachován jako u SK (před launchem noindex, launch až po plném pokrytí).

## 6. Provozní lekce (KRITICKÉ)

- **Deploy:** `nvm use 22` (v22.22.2) → `npm run build && npm run deploy` (deploy NEdělá build!). Cloudflare/wrangler.
- **Git:** NIKDY `git add -A` (vtáhne `.env.save` → push protection). Přidávat soubory explicitně. Push: `/usr/bin/git -c credential.helper='!gh auth git-credential' push`.
- **Working tree** může mít cizí necommitnuté změny (`.gitignore` security-hardening — NEcommitovat do téhle větve). Před deployem cíleně `git stash`.
- **Supabase MCP nemá přístup** k `obhypfuzmknvmknskdwh` — netýká se tohoto incrementu (žádná DB práce; články jsou pozdější fáze 2).
- Sandbox neresolvuje .cz → `curl --resolve agro-svet.cz:443:<IP>`.
- Test runner: `npx vitest run` (baseline 359 + nové). Autoritativní verifikace = build Node 22 + živý smoke.

## 7. Mimo scope tohoto incrementu

Jurisdikční data (`/dotace`, `/statistiky`, `/puda` v UAH) = fáze 4. Legal stránky = fáze 3. Články (`article_translations` Supabase) = pozdější fáze 2. SK/EN nic.
