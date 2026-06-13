# Spec: Sezónní obsahové huby (Track #5 organic-traffic) — schválený design

**Datum:** 2026-06-13
**Track:** #5 z `2026-06-13-agro-svet-organic-traffic-zadani.md`
**Status:** Schváleno v brainstormu (granularita = 4 sezóny + kalendář; URL cluster `/sezona/*`; prerender + klientský highlight; akce = fáze 2).
**Větev:** `feat/sezonni-huby`, worktree `~/agro-svet-sezonni-huby` (z `origin/master` `e0f6250`).

## Cíl

Zachytit recurring sezónní vyhledávací spiky („kdy sít X", „jarní práce na poli", „podzimní příprava půdy", „co se sklízí v září") evergreen **agregačními** huby. Spojit existující obsah (howto/pruvodce + plodiny crop-calendar) do sezónního příběhu s rozhodovací intencí. **Agregovat, ne duplikovat.**

## Scope (MVP)

CS-first, **CS-only** (plodiny data jsou CZ-jurisdikční — české klima, ÚKZÚZ termíny; pod `/sk/`+`/uk/` se stránky díky locale-prerender fixu z PR #79 čistě 302-ují na cs, nejsou v `LAUNCHED_PREFIXES`). Vše **prerender** (žádné SSR).

### Stránky (URL cluster `/sezona/`)

| URL | Co |
|---|---|
| `/sezona/` | Rozcestník: 4 sezónní karty (s „právě teď" zvýrazněním) + karta na kalendář. Vzor `src/pages/vcelarstvi/index.astro`. |
| `/sezona/jaro/` | Sezónní stránka jaro (měsíce 3–5). |
| `/sezona/leto/` | Léto (6–8). |
| `/sezona/podzim/` | Podzim (9–11). |
| `/sezona/zima/` | Zima (12, 1, 2). |
| `/sezona/kalendar/` | **Páteř.** Tabulka setí/sklizně 18 plodin × 12 měsíců. H1 „Kalendář setí a sklizně". |

### Obsah sezónní stránky (žádná duplikace — jen odkazy + krátký lead)

1. **Answer-first lead** (krátký, czech-ag-article-style, grounded z dat) — např. „Na jaře se na poli seje jarní ječmen, cukrovka, mák a slunečnice; hlavní práce jsou příprava seťového lůžka, jarní hnojení a setí jařin." Cíl = featured snippet.
2. **Polní práce v sezóně** — odkazy na relevantní `howto`/`pruvodce` (z kurátorské mapy, viz níže).
3. **Co se teď seje / sklízí** — odkazy na `/plodiny/{slug}/` + vytažený termín (setí/sklizeň) z dat.
4. **FAQ** (3–5 otázek) → `FAQPage` JSON-LD.

### Kalendář (`/sezona/kalendar/`)

Tabulka plodina × 12 měsíců, buňky značí setí (S) a sklizeň (☑) — odvozeno z `seti_mesice`/`sklizen_mesice`. Krátký lead + FAQ + `ItemList` JSON-LD (18 plodin). Klientský highlight aktuálního měsíce (sloupec).

## Datová vrstva

### Sezónní metadata (minimální, explicitní)

Do každého z 18 `src/data/plodiny/*.yaml` přidat **2 nová pole**:

```yaml
seti_mesice: [2, 3]      # čísla měsíců setí, vytažená z prózy osevni_postup "Setí"/slugu
sklizen_mesice: [7, 8]   # čísla měsíců sklizně, vytažená z pole `sklizen`
```

- **Grounded:** hodnoty se odvodí z **existující prózy** (`osevni_postup` krok „Setí", pole `sklizen`) + selského rozumu (slug `*-jarni`/`*-ozima`). Žádné křehké runtime parsování češtiny.
- Stávající prozaická pole (`sklizen: "srpen–říjen"`, „Setí: únor–březen") zůstávají beze změny — slouží pro **lidsky čitelné** zobrazení; nová číselná pole jen pro **filtrování/řazení**.
- Plodiny **nejsou** content collection — načítají se přes `import.meta.glob('/src/data/plodiny/*.yaml')` v `src/lib/plodiny.ts`. Rozšířit interface `PlodinaYaml` (řádek ~54) o obě pole jako **optional** `number[]` (zpětně kompatibilní; plodina bez nich se v kalendáři zobrazí prázdná, ne chyba).

### `src/lib/sezona.ts` (nová agregační logika)

Čistá, testovatelná. Závisí jen na `plodiny.ts` + statické mapě.

- `SEASONS` def: `{ slug, name, months: number[] }` pro jaro/léto/podzim/zima.
- `seasonOfMonth(m): SeasonSlug`, `currentSeasonSlug(now)`, `currentMonth(now)` (čisté, `now` jako parametr kvůli testovatelnosti).
- `cropsSownInMonth(m)`, `cropsHarvestedInMonth(m)`, `cropsSownInSeason(s)`, `cropsHarvestedInSeason(s)` — čte plodiny, filtruje dle nových polí.
- `HOWTO_BY_SEASON: Record<SeasonSlug, string[]>` — **kurátorská** mapa slugů howto/pruvodce na sezónu (jen polní práce; např. podzim→`jak-seridit-pluh`, jaro→`jak-nastavit-seci-stroj`). Vyhne se refactoru howto schématu. Doplnit `howtoForSeason(s)` který resolvne slugy na existující howto/pruvodce záznamy (a tiše vynechá neexistující).

## „Aktuálnost" bez SSR

Vše prerender. Drobný **inline klientský skript** zvýrazní aktuální sezónu (karta na `/sezona/`) a aktuální měsíc (sloupec v kalendáři) + „právě teď" badge. Server HTML je měsíc-neutrální (evergreen); freshness/recrawl signál = obsahový rebuild + `lastmod` v sitemapě. Žádná SSR/locale komplexita.

## SEO & napojení

- **JSON-LD** (reuse `src/lib/structured-data.ts`): `breadcrumbSchema` na všech; `itemListSchema` (plodiny/howto) na kalendáři + sezónních; `faqPageSchema` kde je FAQ.
- **Sitemap** (`src/pages/sitemap.xml.ts`): přidat 6 statických URL (`/sezona/`, 4 sezóny, `/sezona/kalendar/`). **CS-only — žádný sk/uk mirror** (nejsou launched). Priorita ~0.7, changefreq `monthly`.
- **Nav** (`src/i18n/nav.ts`): nová položka pod sekcí `tema` (vedle `/plodiny/`, `/akce/`), `labelKey: 'nav.tema.sezona'`, href `/sezona/`. i18n label do `cs.ts` (+ sk/uk chrome překlad pro konzistenci nav, byť cíl 302-uje na cs — stejně jako `/plodiny/`).
- **Cross-linky:** `/plodiny/index.astro` → odkaz na `/sezona/kalendar/`; sezónní stránky ↔ kalendář ↔ relevantní plodiny/howto.

## Hranice (YAGNI)

- **Akce (Supabase/SSR) = fáze 2.** MVP je čistě prerender (howto + plodiny). Akce se přidá později jako sezónní filtr.
- Žádné dynamické alerty/e-maily, realtime akce↔plodiny sync, regionální/fenologická přesnost.
- Žádné nové dlouhé AI texty — jen krátké sezónní leady (drž `czech-ag-article-style`).
- Needuplikovat howto/plodiny obsah — agregace = odkazy + vytažené termíny.

## Testy (vzor `tests/lib/*`)

- `tests/lib/sezona.test.ts`: `seasonOfMonth` hranice (2↔3, 5↔6, 8↔9, 11↔12), `currentSeasonSlug` s fixním `now`, `cropsSownInMonth`/`cropsHarvestedInSeason` proti známým plodinám (jecmen-jarni setí únor–březen, brambory sklizeň srpen–říjen), `howtoForSeason` vynechá neexistující slug.
- Test (rozšířit existující sitemap/relevantní): sitemap obsahuje 6 nových URL.
- Žádné byte-parity cs/sk/uk testy (CS-only feature).

## Verifikace (před PR)

Node 22 (`nvm use 22`). `npx vitest run` (zelené + nové testy; pozor 3 pre-existing bazar-nav fail jsou baseline). `npm run build` zelený. Lokální prod server smoke: `/sezona/`, 4 sezóny, `/sezona/kalendar/` = 200 cs; pod `/sk/sezona/` = 302 na cs (díky PR #79). Po schválení merge/PR → Coolify.

## Soubory (odhad)

**Nové:** `src/pages/sezona/index.astro`, `src/pages/sezona/[season].astro` (dynamická, `getStaticPaths` přes 4 sezóny → `/sezona/jaro/` atd.), `src/pages/sezona/kalendar/index.astro`, `src/lib/sezona.ts`, `tests/lib/sezona.test.ts`.
**Editované:** 18× `src/data/plodiny/*.yaml` (+2 pole), plodiny schema/loader, `src/pages/sitemap.xml.ts`, `src/i18n/nav.ts`, `src/i18n/ui/cs.ts` (+sk/uk chrome label), `src/pages/plodiny/index.astro` (cross-link).
