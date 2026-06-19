# PL /puda — agro-svet.cz polská lokalizace fáze 3 (trh s půdou)

**Datum:** 2026-06-19
**Stav:** schváleno k implementaci
**Navazuje na:** fáze 1+2 (PR #94, živé) — `pl` locale, katalog, slovník, homepage. Vzor: uk fáze 4b (PudaUk).

## Kontext

agro-svet.cz má `/puda` jako datový hub o zemědělské půdě, lokalizovaný per-locale:
- `src/components/puda/PudaUk.astro` — self-contained komponenta (vlastní Layout, UA stringy), delegace z `puda/index.astro` při `locale==='uk'`
- `src/data/agro-puda-uk.json` — kurátovaná data (source+url+asOf per údaj)
- `src/lib/puda-uk.ts` — typy `PudaUkData`, `PudaUkSeries`, `PudaUkBigNumber`, `PudaUkTimelineStep`, `PudaUkCrop`, `PudaUkThreat`, `PudaUkSourceLink` + `buildLineChart` (generic SVG helper) + `pudaUkPriceGrowthPct`
- content kolekce `pudaUk` (`content.config.ts`: glob z `src/content/puda-uk`, 3 články vyziva-pudy/ornice/eroze) → `/uk/puda/<slug>/`
- `puda/[slug].astro` SSR (`prerender=false`): `PUDA_COLLECTION = { cs:'puda', sk:'pudaSk', uk:'pudaUk' }`, chybějící slug → 404 (žádný cs leak)
- `LAUNCHED_PREFIXES.uk` obsahuje `/puda`

Polština cílí na polské publikum v Polsku → PL jurisdikce. Úhel: **trh, ceny & regulace** (nejblíž uk vzoru, nej-SEO „cena ziemi rolnej").

## Cíl fáze 3

Živý, indexovatelný `/pl/puda/` hub o polském trhu se zemědělskou půdou (ceny, nájem, KOWR regulace, struktura plodin, ohrožení) + 3 přeložené agronomické články, bez českého leaku, cs/sk/uk byte-identické.

## Rozsah — co fáze 3 dodá

1. **`src/data/agro-puda-pl.json`** — kurátovaná polská data, KAŽDÝ údaj `source`+`url`+`asOf`. Bloky (úhel trh/ceny/regulace):
   - **bigNumbers**: průměrná cena PLN/ha (GUS), celková zem. půda (~14,6 mil. ha), podíl/objem dzierżawy, růst cen %
   - **reformTimeline** → polská **timeline regulací trhu**: volný trh do 2016 → ustawa 2016 (KOWR předkupní právo, omezení nabyvatelů) → novely 2019 → současný stav
   - **cena**: GUS časová řada PLN/ha (graf přes `buildLineChart`)
   - **najem (dzierżawa)**: sazby/objem
   - **plodiny**: hlavní uprawy podle plochy
   - **threats**: eroze, zakwaszenie (zakyselení půd), fragmentace
   - **warCaveat**: VYNECHÁN (Polsko, žádná válka) nebo neutrální poznámka o zdrojích/aktuálnosti
2. **`src/lib/puda-pl.ts`** — typy `PudaPlData` (mirror uk struktury) + `pudaPlPriceGrowthPct` helper. **Reuse `buildLineChart`** importem z `puda-uk.ts` (generic, locale-agnostic) — NE duplikovat.
3. **`src/components/puda/PudaPl.astro`** — komponenta po vzoru PudaUk (vlastní Layout, polské stringy/hardcoded titulky, polské sekce: hero „Ziemia rolna", bigNumbers, PillsNav, topics=články, timeline, cena/nájem/plodiny grafy, threats). Optional bloky (vykreslí se jen pokud data jsou).
4. **Delegace `puda/index.astro`** (ř. ~100): `{locale === 'pl' ? <PudaPl /> : locale === 'uk' ? <PudaUk /> : (cs/sk Layout)}`. cs/sk větev beze změny.
5. **Content kolekce `pudaPl`** — `content.config.ts`: `defineCollection` glob z `src/content/puda-pl` (schema `pudaSchema()`, slug = reuse cs slug) + přidat do `collections` exportu. 3 přeložené články (vyziva-pudy/ornice/eroze) v `src/content/puda-pl/`.
6. **`puda/[slug].astro`**: `PUDA_COLLECTION += { pl: 'pudaPl' }` + rozšířit cast `locale as 'cs'|'sk'|'uk'|'pl'`. Chybějící pl slug → 404.
7. **`LAUNCHED_PREFIXES.pl += '/puda'`** + i18n klíče `puda.pl.*` (nadpisy sekcí: reforma/cena/najem/plodiny/ohrozeni) do `ui/pl.ts`.
8. **Sitemap**: `plMirror` (z fáze 1) automaticky zrcadlí `/pl/puda` hub + děti, JEN existující pl články (jako uk: chybějící slug = 404 → nezrcadlit). Ověřit, že plMirror filtr nezrcadlí cs puda slugy chybějící v puda-pl. (uk to řeší `isUkMissingHowto`-stylem; pro pl puda = 3 články shodné s cs slugy, takže prostý mirror stačí, ale ověřit živě.)
9. **HomePl rozcestník** (`src/components/home/HomePl.astro`): přidat 5. kartu **🌱 Ziemia rolna** → `/pl/puda/` (mezi launchnuté sekce). Mřížka zůstává 2 sloupce (5 karet = 3 řádky, poslední karta sama — OK, responzivní; nebo zvážit, ať grid snese lichý počet). Krátký polský popis (trh/ceny/regulace).

## Princip: honest > complete

Blok, pro který nejde sehnat čistou grounded řadu (zejm. `cena` GUS time series, `najem`), se **VYPUSTÍ** (komponenta má všechny bloky optional, jako uk). Lepší méně bloků než neověřená čísla.

## Data-verifikační brána (nejvyšší riziko fáze)

Subagent research polských dat (primární zdroje: **GUS** — ceny/výměra/struktura plodin; **KOWR** — státní půda, transakce, předkupní právo; **Eurostat**; **ARiMR**) → **adversariální verifikace** každého čísla (existuje zdroj? souhlasí hodnota? asOf datum?) → oprava/drop neověřitelných. Žádné odhady bez zdroje. PLN jednotky, polské formátování (`pl-PL`).

## Architektura / izolace

- **cs/sk/uk byte-identické**: PudaPl je nový soubor; delegace přidává jen `pl` větev; `puda-pl.ts`/`agro-puda-pl.json`/`pudaPl` kolekce jsou nové. `buildLineChart` se jen importuje (nemění se).
- Izolované jednotky: data (json), typy+helper (ts), prezentace (astro), obsah (kolekce) oddělené.

## Gating dětských rout (žádný cs leak)

`/pl/puda/` hub 200 + `/pl/puda/<článek>/` jen pro 3 přeložené (vyziva-pudy/ornice/eroze); jiný slug → 404 (ne cs fallback). Auto-linker (locale-aware z fáze 1) na /pl/puda lokalizuje interní odkazy jen na launchnuté pl sekce.

## Verifikace (brána před mergem)

- `nvm use 22` build EXIT 0
- `/pl/puda/` 200 `index,follow` + self-canonical `/pl/puda/` + hreflang cs/sk/uk/pl + polský obsah (ceny/timeline/plodiny)
- `/pl/puda/eroze/` (a vyziva-pudy, ornice) 200 polsky; `/pl/puda/neexistuje/` → 404
- cs `/puda/` + sk `/sk/puda/` + uk `/uk/puda/` **byte-identické** (smoke)
- sitemap zrcadlí `/pl/puda` hub + 3 články; chybějící slug nezrcadlen
- **0 českých leaků** na /pl/puda (data + UI + auto-linky polsky)
- data-verifikační brána APPROVE (zdroje+asOf u všech čísel)

## Subagent-driven implementace

Jako každá uk fáze: paralelní subagent tasky (data research+verifikace, typy, komponenta, články, wiring) + per-task review + finální opus review APPROVE + data-verifikační brána.

## Lekce z předchozích fází (aplikovat)

- ⚠️ build přegeneruje `content-dates.json` → NEcommitovat
- ⚠️ reconcile s `origin/master` PŘED mergem (track se vyvíjí — viz fáze 1+2, kde mezitím přišel PR #95)
- ⚠️ baseline ~3 STALE testy (cs nav bazar) failují i na master = NE regrese
- ⚠️ Coolify deploy ~75–285s (node-22 build); „Workers Builds" CI fail = stale, ignorovat
- ⚠️ ověř `git branch` před prací (strom se může přepnout na master mezi turny)
- ⚠️ články: assemble přes literal replace (ne regex `\n` interpretace); paritní kontrola odstavců jako u slovníku

## Pozdější fáze (mimo tenhle spec, řetězec jako uk)

Fáze 4: PL `/statistiky`; Fáze 5: PL `/dotace` (ARiMR/PROW/WPR, nejvyšší riziko). Homepage rozcestník (HomePl, fáze 2) pak rozšířit o nové karty (puda/statistiky/dotace), až budou launchnuté.
