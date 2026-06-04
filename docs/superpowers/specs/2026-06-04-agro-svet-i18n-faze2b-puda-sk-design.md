# agro-svet i18n — Fáze 2b balík C: SK `/puda` (ceny pôdy, Eurostat-first)

**Datum:** 2026-06-04
**Fáze:** 2b „reálná SK data" — balík C (z 3: A=Dotace HOTOVÝ, B=Statistiky HOTOVÝ, **C=Ceny pôdy**)
**Branch:** `feat/i18n-sk-puda` (z `origin/master` `26f37d4`, worktree `~/agro-svet-i18n-statistiky`)
**Spec předchůdce / vzor:** `2026-06-04-agro-svet-i18n-faze2b-statistiky-sk-design.md` (balík B — stejná architektura, `eurostat-sk.mjs` `pickSeries` už existuje)

## Cíl

Odemknout SK `/puda` reálnými daty o zemědělské půdě pro slovenský trh. Dnes je `/puda` jediný zbývající prefix v `LOCKED_SECTION_PREFIXES` → pod /sk se servíruje 307 redirect na cs URL. Po balíku C bude `/sk/puda` indexovatelná SK stránka (cena/nájem půdy z Eurostatu `geo=SK`, struktura plodin, 3 vzdělávací články přeložené), `index,follow`, self-canonical, reciproční hreflang. **`/puda` je POSLEDNÍ locked sekce** → po balíku C je `LOCKED_SECTION_PREFIXES` prázdné.

**Tvrdé pravidlo i18n (napříč fázemi):** CZ výstup se nesmí obsahově změnit. `/puda` je dnes `prerender=true` (statický asset); převod na SSR (nutný kvůli middleware-rewrite vzoru) znamená, že CZ výstup nejde byte-diffovat staticky → **ověřuje se živě** (HTTP 200, `lang=cs`, identické datové bloky, žádný SK leak).

## Rozhodnutí z brainstormingu (SCHVÁLENO uživatelem)

1. **Rozsah = „Eurostat-first + přeložit články".** Garantované jádro z Eurostatu (`geo=SK`, ověřeno živě 2026-06-04). Bloky bez SK dat se na /sk **vynechají** (ne mirror CZ, ne výmysl) — stejný princip jako balík B (HexMap vynechán).
2. **Naplněné bloky /sk:** Cena půdy (graf) + Nájem půdy + Plodiny + Témata (3 přeložené články).
3. **VYNECHANÉ bloky /sk (CZ-jurisdikčně specifické):**
   - **Ohrožení erozí** (60 % vodní eroze, VÚMOP — český monitoring, žádný ekvivalentní SK zdroj).
   - **Vlastnictví / pacht fakta** (`facts-grid`: 3,2 mil. vlastníků ČÚZK, úbytek ha/den, KPÚ/NKÚ, JZD koncentrace, DZES bloky — vše CZ instituce/legislativa).
   - **Struktura ZPF donut** (orná/TTP/sady % z ČSÚ) — **VYNECHÁNO** v tomto launchi: Eurostat nedává čistou kategorii využití půdy orná/TTP/sady jako jeden snadný řez; pokus o derivaci z `apro_cpshr` je nespolehlivý. (Pokud research v plánu najde čistý zdroj → lze přidat; jinak vynechat, není blokující.)
   - **HomeWeather** (`mode=puda`, počasí CZ měst) — skryto pro sk (vzor balík B, widget ne statistika).
4. **Témata = 3 vzdělávací články** (`eroze`, `ornice`, `vyziva-pudy`) jsou jurisdikčně neutrální (pedologie/agronomie) → **přeložitelné** přes overlay kolekci `pudaSk` (vzor `dotaceSk`).

## Aktuální stav `/puda` (co lokalizujeme)

Stránka `src/pages/puda/index.astro`, `prerender=true`, **veškerá data jsou inline literály** v frontmatteru (NE z JSON souboru — na rozdíl od `/statistiky`):
- `cenaPudy[]` (10 bodů 2000–2025, FARMY.CZ index, tis. Kč) → SVG line chart (`cenaPath`/`cenaArea`/`cenaPoints`).
- `struktura[]` (3 segmenty ZPF) → SVG donut.
- `big-numbers` (4 karty, inline v `.map()`): cena 372 550 Kč/ha, +517 %, úbytek 10,8 ha/den, >50 % eroze.
- threats (`#ohrozeni`, 4 bary inline), facts-grid (`#vlastnictvi`, 8 karet inline), crops (`#plodiny`, 5 barů inline).
- `pudaItems = await getCollection('puda')` → Témata grid (3 články).
- Klientský `<script is:inline>`: IntersectionObserver reveal animace + tooltipy (line/donut/threats/crops), formátování `toLocaleString('cs-CZ')`, jednotky `Kč/ha`.

`src/pages/puda/[slug].astro`, `prerender=true`, `getStaticPaths()` z `getCollection('puda')`, render md article + Article/BreadcrumbList JSON-LD, `inLanguage: 'cs-CZ'`.

`PUDA_PILLS` (6 kotev): Témata, Cena, Struktura, Ohrožení, Vlastnictví, Plodiny.

`DataSegmentNav` (`src/components/DataSegmentNav.astro`): dnes `active="puda"` na /puda. Na sk dnes **filtruje puda tab pryč** (ř. 27: `locale==='sk' ? filter(it=>it.key!=='puda')`). Po launchi se tato podmínka odebere → sk dostane oba taby.

## Ověřená dostupnost dat (Eurostat `geo=SK`, živě 2026-06-04)

| Dataset | Účel | Stav / volba |
|---|---|---|
| `apri_lprc` | cena zem. půdy (EUR/ha) | ✅ 2011–2024; **agriprod=`ARAXIB`** (Non-irrigable arable land) = NEJČISTŠÍ řada **2017→2024**: `3244,3437,3599,3849,3891,4854,5188,5743` EUR/ha (monotónní, +77 %). |
| `apri_lrnt` | nájem půdy (EUR/ha/rok) | ✅ 2011–2024; **agriprod=`ARA_J0000`** (orná + TTP): `37,37,39,44,44,50,48,54,52,57,62,57,67,69` EUR/ha/rok (čistá řada). |
| `apro_cpshr` | plochy plodin (tis. ha) | ✅ už fetchováno do `agro-stats-sk.json` (`areas[]`: Pšenica/Jačmeň/Kukurica/Repka/Obilniny/Zemiaky). Pro `/puda` plodiny REUSE nebo refetch. |

**⚠️ KRITICKÝ GROUNDING — metodický zlom v `apri_lprc`:** agriprod `ARA` (Arable land) má **nereálné předzlomové hodnoty** (2015: 24175, 2016: 28217 EUR/ha → 2017: 3009) = změna metodiky/reportingu. **Proto headline = `ARAXIB`**, který má data jen od 2017 (přirozeně bez zlomu) a je věrohodný (~5743 EUR/ha 2024). NIKDY nepoužívat plnou `ARA` řadu 2011–2024 v grafu (vypadala by jako krach z 28k na 3k). Fetcher fixuje `agriprod:'ARAXIB'` a filtruje jen roky s hodnotou (2017+).

**Eurostat NEMÁ** SK ekvivalent eroze/vlastnictví/KPÚ → tyto bloky se na /sk vynechají (viz výše).

## Architektura

### Page: převod na SSR + edge cache

`src/pages/puda/index.astro` i `src/pages/puda/[slug].astro` → **`prerender = false`** (SSR; vzor launchnutých dotace/statistiky — middleware-rewrite prerendered routy nepokrývá).

- **Žádný runtime fetch:** SK data se čtou z importovaného JSON na úrovni modulu (`agro-puda-sk.json`); cs data zůstávají inline literály. SSR = jen render.
- **Edge cache:** `Cache-Control: public, s-maxage=86400, stale-while-revalidate=...` přes `Astro.response.headers` (zachová CZ výkon flagship stránky, mitigace ztráty statického assetu) — stejně jako balík B.
- Locale z `Astro.locals.locale` (NE `getLocaleFromUrl(Astro.url)` — po rewrite je `Astro.url` cs cesta).

### Data: `agro-puda-sk.json` + nový fetcher

- Nový `scripts/fetch-puda-sk.mjs` → `src/data/agro-puda-sk.json`. Sdílí `scripts/lib/eurostat-sk.mjs` (`pickSeries`, `yoyChange`). Idempotentní, spustitelný měsíčně.
- Nový npm skript `"puda:refresh:sk": "node scripts/fetch-puda-sk.mjs"`.
- **Tvar `agro-puda-sk.json`:**
  ```json
  {
    "generated": "ISO",
    "cena": { "unit": "EUR/ha", "agriprod": "ARAXIB",
              "series": [{ "year": 2017, "value": 3244 }, ...] },
    "najem": { "unit": "EUR/ha/rok", "agriprod": "ARA_J0000",
               "series": [{ "year": 2011, "value": 37 }, ...] },
    "plodiny": [{ "crop": "Pšenica", "hectares": 380000 }, ...]
  }
  ```
  Prázdné pole / chybějící blok = blok se na /sk vynechá. `plodiny` z `apro_cpshr` `AR_THS_HA` posledního dostupného roku (tis. ha → ha), seřazené sestupně.

### Bloky na /sk (locale-branched render)

Stránka renderuje cs literály beze změny; pro sk staví alternativní data z `agro-puda-sk.json` a CZ-only bloky vynechá. Vzor: `const cenaPudy = locale === 'sk' ? skCena : [<cs literály verbatim>]`.

| Blok | cs | sk |
|---|---|---|
| Hero (sp-hero) | text + badge `372 550 Kč/ha` | SK próza + badge `<cena 2024> €/ha` (z dat) |
| big-numbers | 4 CZ karty | 3 SK karty: cena 2024 (€/ha), růst za období (%), nájem 2024 (€/ha/rok) — derived z dat |
| Cena graf (`#cena`) | FARMY.CZ tis. Kč | Eurostat ARAXIB €/ha, 2017–2024, sk-SK formát |
| Nájem | (CZ má pacht ve facts-grid) | **nový SK blok** nájem `apri_lrnt` (line/bar €/ha/rok) |
| Struktura donut (`#struktura`) | ČSÚ ZPF | **VYNECHÁNO** (viz rozhodnutí 3) |
| Ohrožení (`#ohrozeni`) | VÚMOP | **VYNECHÁNO** |
| Vlastnictví (`#vlastnictvi`) | ČÚZK facts | **VYNECHÁNO** |
| Plodiny (`#plodiny`) | inline tis. ha | Eurostat `apro_cpshr` tis. ha SK |
| Témata (`#temata`) | `getCollection('puda')` | `getCollection('pudaSk')` overlay |
| HomeWeather | `mode=puda` | **skryto** |

**`PUDA_PILLS` locale-aware:** sk verze = jen kotvy existujících sk bloků (Témata, Cena, Nájem, Plodiny); cs beze změny (6 kotev).

### Témata: overlay kolekce `pudaSk`

- Nová kolekce `pudaSk` v `src/content.config.ts` (vzor `dotaceSk`/`znackySk`): `glob({ pattern:'**/*.md', base:'./src/content/puda-sk' })`, **stejné schéma jako `puda`** (`pudaSchema()` — vyextrahovat sdílenou funkci jako u `znackySchema`/`dotaceSchema`, NEBO reuse inline; cs `puda` zůstává nedotčená).
- 3 přeložené md soubory `src/content/puda-sk/{eroze,ornice,vyziva-pudy}.md` přes `i18n-translate.py` (engine sonnet→opus + glosář + GEO; články jsou jurisdikčně neutrální → GEO pravidlo drží případné ČR zmínky poctivě, nevymýšlí SK instituce). **SK slug = REUSE cs slug** (`eroze`/`ornice`/`vyziva-pudy`) → `/sk/puda/<slug>/`.
- `index.astro` sk → `getCollection('pudaSk')` pro Témata grid.
- `[slug].astro` sk → `getEntry('pudaSk', slug)`; **chybějící sk slug = 404 BEZ cs fallbacku** (vzor dotace `[slug].astro` ř. 18–23: `return new Response(null, { status: 404 })`). `inLanguage` locale-aware (`sk-SK`/`cs-CZ`), breadcrumb/canonical `base`-aware (`''` pro cs, `/sk` pro sk).

### i18n + lokalizace textů

- UI stringy: klíče `puda.*` v `src/i18n/ui/{cs,sk}.ts` (cs **verbatim** z dnešních hardcoded stringů, sk dle glosáře). Parity test `tests/i18n/puda.test.ts` (vzor `tests/i18n/statistiky.test.ts`) — každý `puda.*` klíč má cs i sk; filtr CZ-only klíčů, které se na sk nerenderují (Ohrožení/Vlastnictví/Struktura texty NEpřidávat do sk — zůstanou cs-only, nebo je z parity testu vyřadit přes `CS_ONLY_PREFIXES`).
- Derived SK próza (hero lede, big-numbers labely, insight věty pod grafy): pure helper modul `src/lib/puda-derived.ts` s `locale` param — **cs větve = doslovné originály** (byte-identita textu, snapshoty zachycené z HEAD) + sk mapy. Vzor `src/lib/agro-derived.ts` (balík B). Testy: cs snapshoty + sk sanity.
- **Klientský `<script>` lokalizace:** skript dnes formátuje `toLocaleString('cs-CZ')` + jednotky `Kč/ha`/`tis. Kč`. Předat locale + měnu + jednotky přes `<script type="application/json" id="puda-cfg">` island (vzor `#statI18n` v balíku B), skript parsuje → `numLocale`, `currency`, jednotkové labely. cs větev island = verbatim (cs-CZ, Kč). Tooltip detaily (threatDetails/cropDetails) jsou pro CZ-only bloky → na sk se ty bloky nerenderují, takže tooltip mapy zůstanou cs (irelevantní pro sk DOM).

### Odemčení + launch (gating)

- `src/i18n/nav.ts`: `LOCKED_SECTION_PREFIXES` z `['/puda']` → **`[]`** (prázdné — `/puda` byla POSLEDNÍ locked sekce). Komentář aktualizovat (všechny `data` nástroje odemčeny). `isLockedSectionPath` pak vždy `false` → ověřit, že to nerozbije cs (cs filtr se neaplikuje, `filterLocked=locale!=='cs'`; pro prázdný seznam je `getNav`/`getFooterColumns` no-op navíc). `nav.ts` `data` sekce: header href `/statistiky/` zůstává, `/puda` dítě se už nefiltruje pryč pro sk → objeví se v sk menu.
- `src/i18n/utils.ts`: `SK_LAUNCHED_PREFIXES` += `'/puda'`.
- `Layout.astro`: lock-guard `skLaunched = isSkLaunchedPath(p) && !isLockedSectionPath(p)` zůstává (po odemčení `isLockedSectionPath('/puda')=false` → `/puda` dostane index+self-canonical+sk hreflang).
- `DataSegmentNav.astro`: odebrat sk-filtr puda tabu (ř. 26–27) → sk dostane oba taby `puda`+`komodity` s `navHref`-lokalizovanými odkazy (POZOR: tab `href` jsou holé `/puda/`,`/statistiky/` → po launchi obě launchnuté, ale komponenta staví `href={it.href}` bez `navHref`; pod /sk musí vést na `/sk/...`. Buď obalit `navHref(locale, it.href)`, nebo ponechat a ověřit middleware. **Volba: obalit `navHref`** — konzistentní s nav/footer fix #63).
- `sitemap.xml.ts`: SK-mirror `/puda` (single hub URL) + sk detaily z `pudaSk` slugů (vzor: cs `/puda/<slug>` se musí vyloučit z auto /sk-mirroru, pokud sitemap mirroruje cs slugy — jinak `/sk/puda/<cs-slug>` ukáže přeloženou verzi, což je OK protože slug je REUSE; ověřit v plánu jak sitemap generuje, vzor dotace/statistiky). Reciproční hreflang `sk` na cs `/puda` přes `SK_LAUNCHED_PREFIXES`.

## Riziko & verifikace

- **Gate:** `npx astro build` + `npx vitest run` (Node 22, `nvm use 22`). agro-svet **nemá** tsc/astro check.
- **Markdown rendering (lekce #61):** `[slug].astro` SSR md render MUSÍ jít přes **lehkou remark pipeline** `src/lib/markdown-with-links.ts` (`renderMarkdownWithLinks`, vzor dotace `[slug].astro` ř. 12+29), NE `@astrojs/markdown-remark` `createMarkdownProcessor` (zatáhne shiki ~1.9 MB → překročí 3 MiB Worker limit). cs `[slug].astro` dnes používá `render(item)` + `<Content />` (Astro built-in, jen pro prerendered). Po převodu na SSR: sk i cs větev přes `renderMarkdownWithLinks(item.body, ...)` — **ověřit byte-identitu cs renderu** vůči starému `<Content/>` (parity sweep stejně jako #61 dělal pro dotace; pokud se liší ID nadpisů/markup, použít stejný `rehypeHeadingIds` replika trik).
- **Worker-size:** import `agro-puda-sk.json` (malý, ~5–10 KB) do bundlu je zanedbatelný; rezerva po #65 ~700 KB. Ověřit reálným deployem (`wrangler deploy --dry-run` size NEZACHYTÍ; signál = červený „Workers Builds" check / reálný deploy). Žádný shiki na téhle routě.
- **CZ byte-identita:** SSR nejde diffovat staticky → **ověřit živě** po deployi:
  - cs `/puda` 200, `lang=cs`, identické bloky (cena graf FARMY.CZ, struktura, ohrožení, vlastnictví, plodiny, témata 3 články), reciproční sk hreflang.
  - cs `/puda/eroze` (+ ornice, vyziva-pudy) 200, `lang=cs`, identický obsah.
  - sk `/sk/puda` 200, `lang=sk`, index/follow, self-canonical, SK data (€/ha, Eurostat zdroje), žádné CZ jednotky/instituce/eroze/vlastnictví bloky.
  - sk `/sk/puda/eroze` 200, `lang=sk`, SK obsah; sk `/sk/puda/<neexistující>` = 404.
- **Souběžný deployer:** agro-svet nemá auto-deploy z merge; deploy manuální `npm run deploy` z worktree. Hlídat `wrangler deployments list` (souběžný deployer z `~/agro-svet` může přepsat — viz paměť [[feedback-concurrent-repo-use-worktree]]). **User chce potvrdit PŘED `npm run deploy`** (živá produkce).

## Glosář SK (půda)

- pôda (zem. půda = poľnohospodárska pôda), orná pôda, trvalé trávne porasty (TTP), cena pôdy, nájom/prenájom pôdy, nájomné, hektár, plodiny, pšenica/jačmeň/kukurica/repka/zemiaky, výmera, štruktúra.
- Zdroje: Eurostat (slovensky „Eurostat"), jednotky €/ha, €/ha/rok.

## Co je MIMO rozsah balíku C

- Struktura ZPF donut SK (vyžaduje čistý land-use zdroj — pokud research nenajde, vynecháno).
- Eroze / vlastnictví / KPÚ SK ekvivalenty (žádný zdroj).
- 2c legal SK (podmienky/GDPR), Fáze 3 UK.

## Subagent-driven exekuce

1 commit/task, per-task `git show --stat HEAD` scope verify. **Cizí WIP nikdy necommitovat** (`public/og/howto-*.png` (6 untracked), `Footer.astro`, atd. — žádný `git add -A`; node_modules NENÍ gitignored ve worktree). Branch z `origin/master`, NE z feature branche.
