# agro-svet.cz — UK (ukrajinská) lokalizace, Fáze 2 (obsah): stroje / srovnání / značky / encyklopedie — DESIGN

**Datum:** 2026-06-07
**Repo:** `~/agro-svet` (Astro 6 SSR + Cloudflare + Supabase)
**Navazuje na:** Fáze 1 Foundation (`e43d81f`, chrome `uk.ts` hotový) + zadání `2026-06-07-agro-svet-i18n-uk-faze2-4-zadani.md`
**Precedent:** SK lokalizace (mirror) — `2026-06-0[34]-agro-svet-i18n-*-sk-design.md`

---

## 0. Cíl a rozhodnutí

Zlokalizovat do ukrajinštiny obsahová **těla** čtyř ne-jurisdikčních sekcí a zapnout jejich indexaci pod `/uk`:
`/stroje`, `/srovnani`, `/znacky`, `/encyklopedie`.

**Rozhodnutí (uživatel, 2026-06-07):**
- **Zdroj překladu:** AI překlad (subagent A) **+ AI review pass** (subagent B) pro každý prózový artefakt.
- **Sekvence:** všechny 4 sekce v jednom incrementu, launch hromadně.
- **Vzor:** zrcadlit SK — žádný nový lokalizační mechanismus.

**Tvrdá pravidla (NEMĚNIT):**
- **CZ výstup se obsahově ani indexačně NESMÍ změnit.** Ověřit buildem + živým smoke.
- `uk` = ukrajinština, publikum = Ukrajina (domácí trh). Tyto 4 sekce jsou jurisdikčně neutrální → **čistý překlad** (jurisdikční data = fáze 4, mimo tento spec).
- Slug se nepřekládá (URL = cs slug). Chybějící uk obsah = 404, nikdy tichý cs fallback (zamezí indexaci míchaného jazyka).

**Zamítnutá alternativa:** overlay-everything (značky/encyklopedie jako YAML overlay) — rozbíjí shodu se SK a MD tělo se overlayem čistě dělat nedá. Držíme paralelní MD kolekce jako SK.

---

## 1. Kódová prerekvizita — zobecnit launched-prefix machinery

Dnes je gating SK-specifický a `Layout.astro` má `locale !== 'cs' → noindex` natvrdo. Zobecnit na per-locale; SK chování i CZ výstup musí zůstat beze změny.

### 1.1 `src/i18n/utils.ts`
- Zavést `LAUNCHED_PREFIXES: Record<Locale, string[]>`:
  ```ts
  export const LAUNCHED_PREFIXES: Record<Locale, string[]> = {
    cs: [],            // cs je default bez prefixu, gating se neaplikuje
    sk: [/* stávající SK_LAUNCHED_PREFIXES beze změny */],
    uk: [],            // naplní se v §6 launch kroku
  };
  export function isLaunchedPath(locale: Locale, csRootPath: string): boolean {
    return (LAUNCHED_PREFIXES[locale] ?? []).some(
      (p) => csRootPath === p || csRootPath.startsWith(`${p}/`),
    );
  }
  ```
- `SK_LAUNCHED_PREFIXES` + `isSkLaunchedPath()` zachovat jako tenké aliasy (`isSkLaunchedPath(p) = isLaunchedPath('sk', p)`) → minimalizovat dotčená místa a riziko SK regrese. Volitelně refaktorovat volající na `isLaunchedPath`.
- `navHref(locale, href)` a `langSwitchHref(...)`: nahradit `isSkLaunchedPath` → `isLaunchedPath(locale, root)`. Pro non-launched cesty stejné chování jako dnes (zůstat na cs / lokalizovaný hub místo 404).
- `getAlternates(...)`: emitovat uk alternate jen pro `isLaunchedPath('uk', path)` (a sk jen pro launchnuté sk — beze změny).

### 1.2 `src/layouts/Layout.astro` (cca ř. 66–73)
```ts
const launched = isLaunchedPath(locale, csRootPath) && !isLockedSectionPath(csRootPath);
const effectiveNoindex = noindex || (locale === 'cs' ? false : !launched);
```
- Pro `cs`: `effectiveNoindex = noindex` (žádné gating-noindex) — **CZ beze změny**.
- Pro `sk`: identické s dnešním chováním (stejné prefixy přes alias).
- Pro `uk`: noindex dokud sekce není v `LAUNCHED_PREFIXES.uk`.
- Hreflang/canonical: per-locale — emitovat uk variantu jen pro launchnuté cesty.

### 1.3 `src/pages/sitemap.xml.ts` (cca ř. 404–414)
- Přidat uk mirror analogicky k sk: pro každou indexovatelnou cs URL přidat `/uk/...`, ale jen když `isLaunchedPath('uk', p) && !isLockedSectionPath(p)` a current sk filtry (skrýt dotace-detail, skryté kategorie).

### 1.4 `src/i18n/nav.ts`
- Beze změny pro tento increment. `HIDDEN_SECTIONS['uk'] = ['data','bazar','photo']` a `HIDDEN_NEWS_CATEGORIES['uk']` zůstávají (stroje/srovnani/znacky/encyklopedie nejsou v `data`). Ověřit, že nav položky těchto 4 sekcí se pro uk po launchi správně prefixují (přes `navHref` → `isLaunchedPath`).

---

## 2. Per-section content mechanism (mirror SK)

### 2.1 stroje — `src/data/stroje/uk/*.yaml` (24 souborů)
- Loader (`src/lib/stroje.ts` `getOverlay(slug, locale)` → `/src/data/stroje/${locale}/${slug}.yaml`) je **plně locale-generický** → **žádná změna kódu**, jen soubory.
- Overlay pole (mirror sk): `country?`, `description?`, `categories?: {key: uk název}`, `series?: {slug: uk popis}`, `models?: {slug: uk popis}`.
- Catalog huby (`/stroje/index`, `[brand]/index` listing) používají cs base — stejně jako SK; detail (`getBrand/getSeries(…, locale)`) aplikuje overlay. Akceptováno.

### 2.2 značky — kolekce `znacky-uk` (~24 MD)
- `src/content.config.ts`: přidat kolekci `znackyUk` (stejné schéma jako `znacky`/`znackySk`).
- `src/content/znacky-uk/<slug>.md` — celé tělo + frontmatter přeložené (viz §4).
- `src/pages/znacky/[slug].astro`: zobecnit větvení na per-locale — `znacky-${locale}` resp. `getEntry('znacky' + Locale, slug)`; chybí → 404 (žádný cs fallback). Ověřit i `getStaticPaths`/SSR `prerender=false` chování pro uk.

### 2.3 encyklopedie — kolekce `encyklopedie-uk` (~44 MD)
- `src/content.config.ts`: přidat `encyklopedieUk`.
- `src/content/encyklopedie-uk/<slug>.md` — tělo + frontmatter (`popis`, `highlights[]`, `faq[].q/a`, `recenze.verdikt/plusy/minusy`).
- `src/pages/encyklopedie/[slug].astro`: rozšířit dnešní `isSk` na per-locale výběr kolekce; `renderMarkdownWithLinks` zůstává; chybí → 404.

### 2.4 srovnání — generovaná próza (žádné soubory)
- Próza vzniká za běhu z generátorů; lokalizace = uk větve v §3. Žádné datové soubory.

---

## 3. Generátory — uk větve

Tři liby mají inline `L(cs, sk)` makra / cs+sk ternáře s napevno psanou šablonovou prózou. Rozšířit signaturu na `L(cs, sk, uk)` (nebo locale-mapu) a dopsat ukrajinské šablony:
- `src/lib/faq-generator.ts` — `generateModelFaq({…, locale})`, makro `L` (cca ř. 35).
- `src/lib/competitor-finder.ts` — `useCaseDescription(category, powerHp, locale)` (ř. 72–124), prózový template ve `findCompetitors`.
- `src/lib/comparison-insights.ts` — `comparisonInsights(a, b, locale)`: `tldr`, `shortDescription`, `decisionA/B`, `faqs[]` (ř. 18+).

Ukrajinské šablony projdou stejným AI-review jako obsah (§5). Bounded kódová práce.

---

## 4. Pravidla překladu frontmatteru / dat

**Překládá se** (human-readable próza):
- `description` / `popis` / `perex`, celé MD tělo
- `highlights[]`, `faq[].q` + `faq[].a`, `recenze.verdikt` + `recenze.plusy[]` + `recenze.minusy[]`
- stroje overlay: `series` popisy, `models` popisy, `categories` názvy
- `country` / `zeme` jen pokud existuje zavedený ukrajinský exonym; jinak ponechat

**Zůstává identické** (strukturální / nepřekladatelné):
- `slug` (= cs slug; URL se nepřekládá), `znacka`, `kategorie` (enum)
- čísla: `powerHp`, `powerKw`, `weightKg`, `rok_uvedeni`, `founded`, financials
- URL (`website`, `sourceUrl`, `heroImage`, `youtubeId`), `wikidata`, datumy (`aktualizovano`/`lastVerified`)
- `wikipedia`: ponechat cs odkaz (uk Wikipedia mimo scope tohoto incrementu)

---

## 5. Translation production pipeline (AI překlad + AI review)

Pro každý prózový artefakt (24 YAML + ~24 + ~44 MD + 3 generátorové šablonové sady):
1. **Subagent A (překlad):** CZ→UK. Zachovat strukturu souboru, frontmatter klíče, markdown, interpolační tokeny (`{name}`…), HTML entity, čísla a strukturální pole dle §4. Výstup = kompletní uk soubor.
2. **Subagent B (review):** kontrola odborné zemědělské/strojní terminologie, přirozenosti, SEO formulací, **nulové CZ kontaminace**, neporušené struktury/tokenů; vrátí opravený finální soubor.
3. Paralelizace přes `dispatching-parallel-agents` (po dávkách dle sekce).

Generátorové šablony (§3) projdou stejným dvoukrokem.

---

## 6. Launch + verifikace

Po dokončení obsahu nastavit:
```ts
LAUNCHED_PREFIXES.uk = ['/stroje', '/srovnani', '/znacky', '/encyklopedie'];
```
Pak ověřit (autoritativní = build Node 22 + živý smoke):
- `nvm use 22 && npm run build` projde; bundle pod limitem Workeru.
- `npx vitest run` zelené (baseline 359 + nové testy §7).
- **CZ regrese:** cs stránky obsahově beze změny; `effectiveNoindex` pro cs nezměněn; SK indexace nezměněna.
- Živý smoke (`curl --resolve agro-svet.cz:443:<IP>`): `/uk/stroje/<brand>/<series>/<model>/`, `/uk/znacky/<slug>`, `/uk/encyklopedie/<slug>`, `/uk/srovnani/<combo>/` → HTTP 200, **ukrajinský** obsah (ne CZ), `<meta robots>` = `index,follow`, reciproční hreflang cs/sk/uk, sitemap obsahuje `/uk/...` URL.

---

## 7. Testy (TDD)

- `isLaunchedPath(locale, path)`: cs → vždy false (nic launchnuto), sk → beze změny vůči `SK_LAUNCHED_PREFIXES`, uk → true jen pro 4 launchnuté prefixy. Test, že cs nikdy nedostane gating-noindex.
- `applyStrojOverlay` s uk overlayem (rozšířit stávající sk test): překládá description/series/models, nemutuje base, cs identita při `ov=null`.
- `content.config`: kolekce `znackyUk`, `encyklopedieUk` existují; per-locale výběr vrací uk entry; chybějící slug → 404 (ne cs fallback).
- generátory: `generateModelFaq`/`useCaseDescription`/`comparisonInsights` vrací uk variantu pro `locale='uk'`, ne cs.
- sanity přeloženého vzorku: přítomnost cyrilice, parita frontmatter klíčů cs↔uk, zachované tokeny/čísla.

---

## 8. Provozní lekce (KRITICKÉ)

- **Deploy:** `nvm use 22` (v22.22.2) → `npm run build && npm run deploy` (deploy NEdělá build!). Cloudflare/wrangler.
- **Git:** NIKDY `git add -A` (vtáhne `.env.save` → push protection). Přidávat soubory explicitně. Push: `/usr/bin/git -c credential.helper='!gh auth git-credential' push`.
- **Working tree:** může mít necommitnuté cizí změny — před deployem cíleně `git stash`. Feature práce ve worktree.
- **Supabase MCP nemá přístup** k `obhypfuzmknvmknskdwh` (netýká se tohoto incrementu — žádná DB práce; articles jsou fáze 2 pozdější).
- Sandbox neresolvuje .cz → `curl --resolve`.

---

## 9. Definition of done

- Kódová prerekvizita hotová, SK + CZ chování beze změny (testy + smoke).
- 24 uk stroje overlayů + ~24 znacky-uk + ~44 encyklopedie-uk + 3 generátory přeložené a zreviované.
- `LAUNCHED_PREFIXES.uk` obsahuje 4 sekce; Layout/sitemap/nav per-locale.
- Build + 359+ testů zelené; živý smoke všech 4 sekcí pod `/uk` (200, ukrajinština, index,follow, hreflang, sitemap).
