# Značka-vs-značka srovnání strojů — design

**Datum:** 2026-07-28
**Repo:** agro-svet.cz (`~/agro-svet/agro-svet`), větev `feat/znacky-srovnani`
**Stav:** návrh schválen, čeká na review specu

## Cíl

Zachytit head dotazy typu „Zetor vs Fendt", „John Deere nebo Claas" — srovnání
**dvou značek** (ne konkrétních modelů). Model-vs-model srovnání už existuje
(`/srovnani/[combo]`, ~2000 párů); tohle je vrstva nad ním: přehled celé značky
proti značce, který zároveň **funneluje na existující model-srovnání** (interní
prolinkování na to, co už rankuje) a na bazar.

## URL & routing

- Detail: `/znacky/srovnani/[combo]/` — `combo` = dva brand slugy kanonicky
  abecedně spojené `-vs-`, např. `fendt-vs-zetor`.
- Hub: `/znacky/srovnani/` — rozcestník top srovnání + custom picker (2 selecty).
- **Nekoliduje** s `/znacky/[slug].astro` (ten matchuje jen jeden segment za
  `/znacky/`; `/znacky/srovnani/…` je hlubší cesta). Hub `/znacky/srovnani/`
  vyhrává jako statická cesta nad `[slug]`.
- `prerender = false` + `getStaticPaths` prerenderuje top páry; ostatní validní
  páry běží jako SSR fallback (stejný pattern co `/srovnani/[combo]`). Edge cache
  `s-maxage=86400, stale-while-revalidate`.

## Datová vrstva — `src/lib/brand-comparator.ts` (nový)

Postaveno na `getAllBrands()`, `getAllModels()` (flat, `brand_slug`/`power_hp`/
`effective_category`/`modelBazarCount`/`year_from|to`), `formatPowerRange`,
`categoryLabel`, `getEffectiveZaber` z `stroje.ts`.

```ts
interface BrandStats {
  brand: StrojBrand;
  modelCount: number;
  powerMin: number | null; powerMax: number | null; powerAvg: number | null;
  categories: StrojKategorie[];          // efektivní kategorie, kde má modely
  yearFrom: number | null; yearTo: number | null;
  activeListings: number;                // suma modelBazarCount přes modely značky
}
interface BrandPair { a: StrojBrand; b: StrojBrand; combo: string; sharedCategories: StrojKategorie[]; }

brandCombo(a, b): string                 // kanonicky abecedně, `${x}-vs-${y}`
parseBrandCombo(combo): [string, string] | null
brandStats(brand): BrandStats
brandPairs(limit?): BrandPair[]          // dedup, jen páry se shared kategorií a oběma ≥ MIN_MODELS
findBrandModelPairs(a, b, limit): ComparisonPair[]  // reuse comparatoru: existující model-páry mezi A a B
brandComparisonInsights(a, b, locale): { tldr; verdictA; verdictB; faqs: {q;a}[]; shortDescription }
```

**Výběr párů (`brandPairs`):** kartézský součin značek → filtr `a.slug < b.slug`
(kanonické pořadí, dedup) → zahoď páry bez sdílené efektivní kategorie → obě
značky musí mít ≥ `MIN_BRAND_MODELS` (práh, návrh **4**) → seřaď dle
`combinedModelCount + activeListings` desc → `slice(limit)` (návrh top **300**
prerender, zbytek SSR fallback). Prahy jako konstanty pro snadné ladění.

**SSR fallback:** `parseBrandCombo` → `getBrand` obou → validace: obě existují,
mají sdílenou kategorii, `combo` je kanonické (jinak `Astro.rewrite('/404')`
kvůli duplicitám).

**Generované insighty (deterministicky z dat, žádný ruční text per pár):**
- vyšší `powerAvg` → „výkonnější, spíš pro velké provozy"; nižší → „dostupnější,
  pro malé a střední farmy".
- `country === 'Česko'` (příp. SK) → „servis a dostupnost dílů v ČR, nižší
  pořizovací cena".
- dřívější `founded` → „delší tradice"; víc kategorií → „univerzálnější nabídka".
- vyšší `activeListings` → „snazší sehnat ojeté na sekundárním trhu".
- FAQ (4): „Je {A} nebo {B} lepší?" (shrnutí verdiktu), „Který je dostupnější
  v bazaru?" (z `activeListings`), „Odkud pochází {A} a {B}?" (`country`+`founded`),
  „Kolik modelů {A}/{B} najdu na agro-svet.cz?" (`modelCount`).

## Obsah stránky (`/znacky/srovnani/[combo]/index.astro`)

1. **Hero** „{A} vs {B} — srovnání značek" + generovaný TL;DR verdikt.
2. **Dvě brand karty:** logo/hero foto, země + rok založení, počet modelů,
   rozsah výkonu (hp), počet kategorií, aktivní inzeráty v bazaru → odkaz na
   `/znacky/[brand]/`.
3. **Head-to-head tabulka:** počet modelů · rozsah výkonu · pokryté kategorie ·
   rozpětí let · aktivní inzeráty · země/založení — s vyznačením „vítěze" tam,
   kde je metrika porovnatelná (vyšší počet/výkon/dostupnost).
4. **Přímé souboje modelů:** `findBrandModelPairs` → seznam existujících
   `/srovnani/[combo]` odkazů mezi značkami (klíčový funnel).
5. **Populární modely** obou značek (top N dle `modelBazarCount`, fallback výkon)
   → odkazy na model stránky.
6. **Verdikt „Kdy {A}, kdy {B}"** (2 decision boxy) + **FAQ** (generované).
7. **CTA na bazar** filtrovaný dle značky (`/bazar/?brand=…`).

**Schema:** `breadcrumbSchema`, `faqPageSchema` (z generovaných FAQ), a per značku
`sameAs` (wikipedia/wikidata z `StrojBrand`). Vizuál sjednocený s `/srovnani/[combo]`
(Chakra Petch + žlutá).

## Napojení

- **Sitemap** (`src/pages/sitemap.xml.ts`): přidat prerenderované brand-páry
  (cs; per-locale mirror jen pokud v LAUNCHED_PREFIXES — v1 cs-only, viz níže).
- **Odkazy:** z `/znacky/[slug]` sekce „Porovnat s jinou značkou" (top páry dané
  značky) a z hubu `/srovnani/` odkaz na brand-srovnání.
- **llms.txt:** hub `/znacky/srovnani/`.

## Rozsah v1 — vědomá rozhodnutí

- **cs-only.** Stringy inline ve feature (konstanta v `brand-comparator.ts` nebo
  page), **NE do sdílených `src/i18n/ui/*.ts`** — ty edituje souběžné pl okno,
  vyhýbám se merge konfliktu. `brandComparisonInsights` bere `locale` param kvůli
  budoucí i18n, ale v1 plní jen cs; non-cs se stejně negatuje přes
  `LAUNCHED_PREFIXES` (brand-srovnání tam nebude → noindex). i18n = follow-up.
- **Prerender top ~300 + SSR fallback** (žádné 404 na validní pár).
- **Verdikt/FAQ generované z dat** — žádný ruční text per pár (jinak neškáluje +
  Google demote za boilerplate).

## Testy (TDD)

`tests/lib/brand-comparator.test.ts`:
- `brandCombo` kanonické abecední pořadí + idempotence; `parseBrandCombo` round-trip
  a odmítnutí nevalidního.
- `brandPairs` dedup (žádný pár dvakrát ani A-A), filtr na sdílenou kategorii,
  práh `MIN_BRAND_MODELS`, respekt `limit`.
- `brandStats` agregace: powerMin/Max/Avg, modelCount, categories unikátní,
  activeListings suma.
- `findBrandModelPairs` vrací jen páry mezi A a B, kanonické, ≤ limit.
- `brandComparisonInsights` vrací neprázdné a **diferencované** texty (verdictA ≠
  verdictB), přesně 4 FAQ, čísla odpovídají statům.

Route smoke (pokud lze bez plného buildu): `getStaticPaths` vrací ≥1 pár a jen
kanonické combo; SSR fallback logika (nevalidní/nekanonický → 404) pokrytá unit
testem parse+validace.

Ověření: `npx vitest run` (zelené) + `npx tsc --noEmit`. **NE `npm run build`**
(padá lokálně na node glob, Node 20 — viz projektové gotchas). Vizuál přes
`npm run dev` + curl na pár URL.

## Mimo rozsah (v1)

- i18n (sk/uk/pl) brand-srovnání.
- Ruční editorial texty per pár.
- 3+ značky najednou.
- Cenová integrace nad rámec `modelBazarCount` (skutečné ceny řeší model page).

## Soubory

Nové: `src/lib/brand-comparator.ts`, `src/pages/znacky/srovnani/[combo]/index.astro`,
`src/pages/znacky/srovnani/index.astro`, `tests/lib/brand-comparator.test.ts`.
Úpravy: `src/pages/sitemap.xml.ts`, `src/pages/znacky/[slug].astro`,
`src/pages/srovnani/index.astro`, `src/pages/llms.txt.ts`.

## Izolace / deploy

Worktree `~/agro-svet/agro-svet-znacky-srovnani`, větev `feat/znacky-srovnani` nad
`origin/master`. Odevzdám hotovou větev; merge + `git push` master → Coolify dělá
user (koordinace s pl oknem).
