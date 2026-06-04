# agro-svet i18n — Fáze 2b balík B: SK `/statistiky` (ŠÚSR/Eurostat)

**Datum:** 2026-06-04
**Fáze:** 2b „reálná SK data" — balík B (z 3: A=Dotace HOTOVÝ, **B=Statistiky**, C=Ceny pôdy)
**Branch:** `feat/i18n-sk-statistiky` (z `origin/master` `ebc55bb`, worktree `~/agro-svet-i18n-statistiky`)
**Spec předchůdce:** `2026-06-04-agro-svet-i18n-faze2b-dotace-sk-design.md` (balík A — vzor lokalizace)

## Cíl

Odemknout SK `/statistiky` reálnými agrárními statistikami pro slovenský trh. Dnes je `/statistiky` v `LOCKED_SECTION_PREFIXES` → pro /sk se servíruje 307 redirect na cs URL. Po balíku B bude `/sk/statistiky` indexovatelná SK stránka se SK daty (Eurostat `geo=SK`, doplňkově ŠÚSR DATAcube), `index,follow`, self-canonical, reciproční hreflang.

**Tvrdé pravidlo i18n (napříč fázemi):** CZ výstup se nesmí obsahově změnit. `/statistiky` je dnes `prerender=true` (statický asset); převod na SSR (nutný kvůli middleware-rewrite vzoru) znamená, že CZ výstup nejde byte-diffovat staticky → **ověřuje se živě** (HTTP 200, `lang=cs`, identické datové bloky, žádný SK leak).

## Rozhodnutí z brainstormingu

1. **Rozsah dat = Eurostat-first + ŠÚSR co půjde.** Garantované jádro z Eurostatu (`geo=SK`, ověřeno živě), ŠÚSR jen kde data reálně dohledáme. Bloky bez SK dat se na /sk **vynechají** (ne mirror CZ, ne výmysl).
2. **Regionální hex-mapa (8 SK krajů) ODLOŽENA** — mimo tento launch (nový SVG layout + nejistá regionální ŠÚSR query). Blok se na /sk vynechá.
3. **HomeWeather (počasí CZ měst) na /sk skryto** — widget, ne statistika; lokalizace měst = separátní concern.

## Aktuální stav `/statistiky` (co lokalizujeme)

Stránka `src/pages/statistiky/index.astro`, `prerender=true`, čte precomputed `src/data/agro-stats.json` (build-time fetch ČSÚ `data.csu.gov.cz` + Eurostat přes `npm run stats:refresh` = `fetch-commodities.mjs` + `fetch-stats.mjs`). **Žádný runtime fetch** — page je čistý render importovaného JSONu.

`agro-stats.json` klíče: `generated, scissorsBaseYear, commodityStats[9], commodityFull[9], fiveYearAvgs, latestFuels[3], fuelSeries[52], livestock[4], livestockHistorical[78], crops[6], areas[120], fertilizers[90], fertSeries[6], regional[97], scissorsPoints[10]`.

Datové bloky v šabloně (komponenty `src/components/statistiky/*`):

| Blok | Komponenta | Zdroj dat (CZ) |
|---|---|---|
| Hero + souhrn | `Hero`, `SparklineTicker`, `AutoTakeaways` | derived z agro-stats |
| Počasí | `HomeWeather mode=commodity` | widget (CZ města) |
| Ceny komodit | `CommodityChart` | ČSÚ měsíční výrobní ceny |
| Vstupy (PHM+hnojiva) | `InputsBlock` | ČSÚ |
| Cenové nůžky | `PriceScissors` | derived index vstupů/výstupů |
| Produkce + plochy | `ProductionBlock` | ČSÚ sklizeň + osevní plochy |
| Regionální produkce | `HexMap` | ČSÚ po 14 krajích |
| Stavy zvířat | `LivestockSlope` | Eurostat `geo=CZ` |
| Příběhy/metodika/CTA | `StoryCards`, `MethodologyFooter`, `BottomCTA` | obsah |

Dva klientské JSON endpointy: `commodity-data.json.ts`, `commodity-data-recent.json.ts` (čte `CommodityChart` klientsky, lazy).

## Ověřená dostupnost dat (Eurostat `geo=SK`, živě 2026-06-04)

| Eurostat dataset | Účel | Stav |
|---|---|---|
| `apro_mt_lscatl` (animals=A2000) | stavy skotu | ✅ řada do 2025 (57 hodnot) |
| `apro_mt_lspig` (animals=A3100) | stavy prasat | ✅ do 2025 (80 hodnot) |
| `apri_pi20_outa` | index výstupních cen (báze 2020) | ✅ 1649 hodnot do 2025 |
| `apri_pi20_ina` | index vstupních cen (báze 2020) | ✅ 1034 hodnot do 2025 |
| `apri_ap_crpouta` | absolutní výrobní ceny plodin | ✅ 2262 hodnot do 2024 (roční) |
| `apro_cpsh1` | produkce/plochy plodin | ✅ endpoint žije; dimension kódy doladit v plánu |

**Eurostat NEMÁ** agrárně-specifické ceny PHM ani absolutní ceny hnojiv → `InputsBlock` je ŠÚSR-závislý (best-effort).

## Architektura

### Page: převod na SSR + edge cache

`src/pages/statistiky/index.astro` → **`prerender = false`** (SSR; stejný vzor jako launchnuté dotace/kalkulačky — middleware-rewrite prerendered routy nepokrývá).

- **Žádný runtime fetch:** data se i nadále čtou z importovaného JSON na úrovni modulu (`agro-stats.json` pro cs, `agro-stats-sk.json` pro sk). SSR = jen render.
- **Edge cache:** stránka nastaví `Cache-Control: public, s-maxage=86400, stale-while-revalidate=...` (přes `Astro.response.headers`) → CF cachuje cs i sk odpověď na edge, Worker renderuje jen na cache-miss. Zachová CZ výkon flagship stránky (mitigace ztráty `prerender=true` statického assetu).
- Locale z `Astro.locals.locale` (NE `getLocaleFromUrl(Astro.url)` — po rewrite je `Astro.url` cs cesta).

### Data: `agro-stats-sk.json` + nový fetcher

- Nový `scripts/fetch-stats-sk.mjs` → `src/data/agro-stats-sk.json` (**stejný tvar** jako `agro-stats.json`; prázdná pole pro bloky bez SK dat).
- Nový npm skript `"stats:refresh:sk": "node scripts/fetch-stats-sk.mjs"`.
- Zdroje: Eurostat `geo=SK` (primární), ŠÚSR DATAcube best-effort (PHM/hnojiva). Fetcher je idempotentní, spustitelný měsíčně.
- Page načte podle locale: `const stats = locale === 'sk' ? statsSk : statsCs`.

### Bloky na /sk (podmíněné vynechání)

Stránka renderuje blok jen když má data (`if (stats.commodityFull.length)` apod.). Naplněné z Eurostatu:

- **LivestockSlope** — `livestockHistorical` z `apro_mt_lscatl`/`lspig` geo=SK.
- **PriceScissors** — `scissorsPoints` z indexů `apri_pi20_outa` (y) vs `apri_pi20_ina` (x), báze 2020. Metodika se liší od CZ derived (báze + zdroj) → **MethodologyFooter to poctivě uvede**.
- **CommodityChart** — `commodityFull`/`commodityStats` z `apri_ap_crpouta` (+ živočišné `apri_ap_anouta` pokud dostupné). **Roční granularita** (Eurostat nemá měsíční jako ČSÚ) → graf/labely roční; CommodityChart musí roční řadu unést.
- **ProductionBlock** — `crops`/`areas` z `apro_cpsh1` (dimension kódy v plánu).

Best-effort: **InputsBlock** (`fuelSeries`/`fertSeries`/`latestFuels`/`fertilizers`) z ŠÚSR DATAcube. **Když data nedohledáme → pole prázdná → blok se na /sk vynechá** (rozhodne se v plánu po ŠÚSR průzkumu; není blokující pro launch).

Vynecháno trvale v tomto launchi: **HexMap** (`regional` prázdné), **HomeWeather** (skryto pro sk).

Hero/SparklineTicker/AutoTakeaways/StoryCards = SK próza/derived, zdroje uvádějí **ŠÚSR/Eurostat**.

### i18n + lokalizace textů

- UI stringy: klíče `stat.*` v `src/i18n/ui/{cs,sk}.ts` (cs verbatim z dnešních hardcoded stringů, sk dle glosáře). Čte přes `t()`/`tf()`.
- Derived narativ (`src/lib/agro-derived.ts`: `biggestYoyChange`, `inputCostInflation`, `livestockMilestone`, takeaways, insights) dostane `locale` param — **cs větve = doslovné originály** (byte-identita textu) + sk mapy. Vzor `src/lib/comparison-insights.ts` z balíku 2a. Testy: cs snapshoty zachycené z HEAD + sk sanity.
- `commodity-data*.json.ts` endpointy: locale param / sk varianta (čte je CommodityChart klientsky); cs větev verbatim.
- Číselné/datumové formáty: `sk-SK` vs `cs-CZ` (Intl), jednotky EUR kde relevantní.

### Odemčení + launch (gating)

- `src/i18n/nav.ts`: `LOCKED_SECTION_PREFIXES` z `['/statistiky','/puda']` → `['/puda']`. (`data` sekce už pro sk vystavena z balíku A; `getNav` filtruje locked děti, header href repoint na první viditelné dítě sekce `data` — ověřit že po odemčení `/statistiky` míří korektně.)
- `src/i18n/utils.ts`: `SK_LAUNCHED_PREFIXES` += `'/statistiky'`.
- `Layout.astro`: lock-guard `skLaunched = isSkLaunchedPath(p) && !isLockedSectionPath(p)` (už zaveden v balíku A) — zajistí, že odemčení `/statistiky` nedá špatný hreflang/index na zbytek.
- `sitemap.xml.ts`: SK-mirror `/statistiky` (jediná URL, žádné slugy → bez per-slug výjimek). Reciproční hreflang `sk` na cs `/statistiky` přes `SK_LAUNCHED_PREFIXES`.
- **Žádný cs-leak 404 guard** — `/statistiky` nemá slugy (single page); SK data zaručeně přicházejí z `agro-stats-sk.json`, ne z cs fallbacku.

## Riziko & verifikace

- **Gate:** `npx astro build` + `npx vitest run` (Node 22, `nvm use 22`). agro-svet **nemá** tsc/astro check.
- **Worker-size (lekce #61):** převod na SSR zabundluje `agro-stats.json` (~313 KB) + `agro-stats-sk.json` (~300 KB) do Worker bundlu (+~120–150 KB gzip). Rezerva po #61 ~750 KB → OK, ale **ověřit reálným deployem** (`wrangler deploy --dry-run` size NEZACHYTÍ; signál = červený „Workers Builds" check / reálný deploy). Pokud by hrozil přesah 3 MiB: fallback = servírovat stats JSON z prerendered `.json` endpointu místo importu (bez runtime fetche nelze → spíš lazy klientský fetch jako CommodityChart). Žádný shiki/těžký markdown na téhle routě.
- **CZ byte-identita:** SSR nejde diffovat staticky → **ověřit živě** po deployi (cs `/statistiky` 200, `lang=cs`, identické bloky, reciproční sk hreflang; sk `/statistiky` 200, `lang=sk`, index/follow, self-canonical, SK data, žádné CZ jednotky/zdroje).
- **Souběžný deployer:** agro-svet nemá auto-deploy z merge; deploy manuální `npm run deploy` z worktree. Hlídat `wrangler deployments list` (souběžný deployer z `~/agro-svet` může přepsat — viz paměť).

## Co je MIMO rozsah balíku B

- Regionální hex-mapa SK (8 krajů) — vlastní pozdější iterace.
- ŠÚSR měsíční ceny (pokud DATAcube nedá → InputsBlock vynechán; měsíční komodity necháváme roční z Eurostatu).
- HomeWeather lokalizace na SK města.
- Balík C (ceny pôdy `/puda`), 2c legal SK, Fáze 3 UK.

## Subagent-driven exekuce

1 commit/task, per-task `git show --stat HEAD` scope verify. **Cizí WIP nikdy necommitovat** (`public/og/howto-*.png`, `Footer.astro`, atd. — žádný `git add -A`; node_modules NENÍ gitignored ve worktree). Branch z `origin/master`, NE z `feat/i18n-sk-dotace`.
