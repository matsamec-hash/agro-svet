---
plan: 2026-04-25-stroje-katalog
status: Phase 6 + 3 gaps closed, čekající rozhodnutí o CatalogPicker, deploy a scraperech
last_updated: 2026-04-25T16:45:00+0200
last_commit: c44e100
total_commits_made: 19 (foundation 9 + Phase 6 7 + handoff 1 + Phase 6 follow-up 2)
---

# Continue here — Stroje katalog implementace

## Current state

Pauzováno po dokončení **foundation** (schema + navigation + scaffolds + sitemap). Web má funkční Stroje sekci s 22 značkami, 10 funkčními skupinami, 44 sub-kategorie stránkami — ale modelová data (series + models) v 12 nových značkách jsou prázdná (`categories: {}`). Hub zobrazí brand karty s "0 modelů".

User aktivně paralelně pracuje na: photos pipeline (audit/credit/wikimedia metadata skripty), MF brand import, statistiky redesign (separate spec), site gate (passcode lock — již commitnut). To NENÍ součást stroje plánu — paralelní work.

## Completed work (9 commits since plan c409453)

| Commit | Task | Co dělá |
|---|---|---|
| `bae99e7` | Task 0.4 | `scripts/wikidata-brands.{mjs,json}` — 22 značek metadata (founded, country, website) |
| `690d009` | Task 1.1a | `src/lib/stroje.ts` rozšířen: StrojKategorie enum (46 sub-kategorií), FUNCTIONAL_GROUPS, helpers |
| `d255b49` | Task 1.1 fix | Add `sazecky-brambor` do seti FUNCTIONAL_GROUP (subagent dropnul, oprava) |
| `cb80eeb` | Tasks 1.2+1.3 | `src/lib/stroje-filters.ts` (SUBCATEGORY_FILTERS, 13 subcategories) + `src/lib/spec-labels.ts` (SPEC_LABELS, formatSpecValue) — 12 testů |
| `23481b9` | Tasks 5.1+3.2 | Header "Stroje" záložka v Technika dropdownu + `src/pages/stroje/zemedelske-stroje/index.astro` (461 řádků hub stránka) |
| `1655a1e` | Tasks 3.3+3.4 | Group page `/stroje/zemedelske-stroje/[group]/` (10 pages) + cross-brand subcategory `/stroje/[subcategory]/` (44 pages) |
| `21aa5ff` | Tasks 6.1+6.2+6.3 | `src/lib/bazar-constants.ts` (CATEGORIES 19, BRANDS 22, BAZAR_TO_CATALOG_SUBCATEGORIES) + `supabase/migrations/005_bazar_stroje_categories.sql` (rename) + `006_bazar_stroje_fields.sql` (subcategory/nosnost_kg/objem_nadrze_l) |
| `f2dd597` | Phase 2 scaffolds | 12 nových YAML v `src/data/stroje/` (lemken, pottinger, kuhn, amazone, krone, horsch, vaderstad, bednar, manitou, jcb, joskin, kverneland) — brand metadata + `categories: {}` placeholder |
| `05529ba` | Phase 7 sitemap | `src/pages/sitemap.xml.ts` — přidat hub URL + 10 group + 44 subcategory URL (55 nových URL) |

**Tests:** 65/65 PASS. **Build:** clean s Node 22 (`source ~/.nvm/nvm.sh && nvm use 22`).

## Phase 6 completed (2026-04-25 afternoon)

7 commits (`f134125` → `fbfcbfb`) + 1 user refinement (`e2e647d`) implementující bazar integraci:

| Commit | Task | Co dělá |
|---|---|---|
| `7b92344` | 6.4 | `bazar-catalog.ts` getModelOptions(category?, subcategory?) + 7 nových testů |
| `f134125` | 6.5 | `CatalogPicker.astro` — 2-úrovňový filter (subcategoryOptions prop, secondary filter) |
| `e5f87d2` + user `e2e647d` | 6.6 | `BazarFilters.astro` — conditional řady (záběr/nosnost/objem). User refinement: `_from/_to` konvence místo plánovaného `_od/_do`, permissive `!category ||` logika |
| `4ce6a88` | 6.7 | `BazarListingRow.astro` — render nosnost/objem/záběr chips |
| `8e08314` | 6.8 | `bazar/novy.astro` + `moje/[id].astro` — conditional form fields, JS toggle, POST handler s subcategory derivation |
| `2d5b643` | 6.9 | `bazar/[id].astro` — spec strip + catalog link rozšířen na všechny stroje kategorie |
| `fbfcbfb` | 6.10 | `bazar/index.astro` — URL params + dbQuery filtry pro nové fields |

**Tests**: 72/72 PASS (z 65 baseline + 7 nových testů pro getModelOptions filtering).

## Phase 6 follow-up commits (2026-04-25 16:30-16:45)

| Commit | Co dělá |
|---|---|
| `c1fd73a` | **Gap A FIX**: `BazarSidebar.astro` rozšířen o conditional rows (zaber/nosnost/objem) + 6 props + 3 active chips + bazar/index.astro předává props. Round-trip filter preservation opraven. |
| `c44e100` | **Gap B+C FIX**: `STROJE_CATEGORIES` derived z `Object.keys(BAZAR_TO_CATALOG_SUBCATEGORIES)`, `BRANDS_SET` derived z `BRANDS` constanty (22 značek místo původních 10). Hodnoty client-side přes `define:vars`. **Note**: tento commit obsahuje 15 deletions hardcoded arrays — pokud je user nechce, lze revert přes `git revert c44e100`. |

72/72 testů PASS po obou commitech.

## Remaining work

### Priority MEDIUM — CatalogPicker.astro decision needed

`src/components/bazar/CatalogPicker.astro` (Task 6.5 práce, 2-level filter implementace) je orphan — forms používají `CascadingPicker.astro`. Ne wired nikde.

**Volby**:
1. **Delete** — Task 6.5 práce zahozena, jednodušší codebase
2. **Wireup do BazarSidebar** — přidat 2-level filter (kategorie → sub-kategorie) do sidebaru, využít `subcategory` URL param. Hodnota navíc: user může drillovat na konkrétní sub-kategorii (např. "pluhy" v rámci "zpracovani-pudy")
3. **Wireup do forms místo CascadingPicker** — větší refactor, riskantní (CascadingPicker je 358 řádků a integruje se s plemena módem)

**`BazarFilters.astro` je také orphan** — Task 6.6 práce. `bazar/index.astro` používá `BazarSidebar`. Volby:
1. Delete BazarFilters (BazarSidebar má teď stejné rozšíření, redundance)
2. Migrate `bazar/index.astro:91` na BazarFilters, delete BazarSidebar (riziko: rozdílné mobile drawer chování)

### Priority MEDIUM — `subcategory` neviditelný

Persisted v DB (kolona z migrace 006), filterable via `?subcategory=X` URL param, ale není zobrazený nikde:
- BazarListingRow chip
- bazar/[id].astro spec strip nebo breadcrumb
- BazarSidebar dropdown

Pokud user chce surface, přidat — jinak nechat jak je.

### Priority HIGH — Per-brand scrapery (Phase 0.5+)
12 značek po vzoru existujícího `scripts/fendt-api-scrape.mjs`. Lemken/Pöttinger/Kuhn/Amazone/Krone/Horsch/Vaderstad/Bednar/Manitou/JCB/Joskin/Kverneland nemají Fendt-like undocumented API — potřebují sitemap+JSON-LD scraping nebo per-výrobce HTML scraping. Output: `scripts/<brand>-api-data.json` + apply skript do YAML. Time: 2-4h per značka.

### Priority MEDIUM — Phase 8 deploy

1. Aplikovat migraci 005 (`supabase/migrations/005_bazar_stroje_categories.sql`) v Supabase SQL editoru
2. Aplikovat migraci 006 (`supabase/migrations/006_bazar_stroje_fields.sql`)
3. `npx wrangler deploy` (Cloudflare Pages)
4. Smoke test produkce: `/bazar/?category=zpracovani-pudy` načte se? Inzerování stroj s nosností funguje?

### Priority LOW
- **Phase 8 deploy**: aplikace migrace 005 + 006 v Supabase SQL editoru, `npx wrangler deploy`, smoke test produkce.

### Nepotřebné / SKIP
- **Phase 4 CategoryBrowse extend**: User už redesignoval CategoryBrowse s vlastním pattern (commit `1fae9d9`). Můj původní plán Phase 4 je obsoletní. CategoryBrowse zatím hardcoded jen pro traktory/kombajny — pokud bude potřeba pro stroje (např. pro `/stroje/<subcategory>/` cross-brand stránky), je to user's redesign rozhodnutí.

## Decisions made

- **Subagent-driven execution** — fresh agent per task, two-stage pattern. Zlevňuje token usage, izoluje contexts.
- **Per-brand scraper pattern** preferred over generic sitemap framework — protože user už zavedl pattern s Fendt/MF (`scripts/<brand>-api-{scrape,apply}.mjs` + `<brand>-api-data.json`). Konzistentní.
- **NEDOTÝKAT se** user WIP: `CategoryBrowse.astro`, `fendt.yaml`, `massey-ferguson.yaml`, photos, mf-api scripts, photos pipeline scripts, statistiky-* docs, middleware.ts, index.astro, [brand]/index.astro.
- **Kebab-case slugy** napříč: `podmitace-diskove`, `lisy-valcove` (NE snake_case).
- **46 sub-kategorií** (ne 45 jak bylo v původním specu) — sazecky-brambor patří do seti.
- **Migrace přečíslovány** na 005+006 (původně plán měl 004+005, ale 004 byl už taken contest extend).
- **Common brand names** ve YAML místo Wikidata "official" — Amazone (ne Amazonen-Werke), Bednar (ne BEDNAR FMT), JCB (ne J. C. Bamford), Kverneland (ne Kverneland Group).

## Blockers

- **None aktivní**. Site gate je on (middleware passcode), takže prerendered HTMLs jsou redirecty — ale to je user's WIP feature, nesouvisí s naším plánem. Builds projdou clean.
- **Node 22 must be active** pro `npm run build` a `npm test` — vždy `source ~/.nvm/nvm.sh && nvm use 22` první.

## Mental context

Foundation je hotová: schema + filters + spec-labels + Hub + Group + Subcat pages + Header nav + Bazar constants + Bazar migrations (SQL files, neaplikované) + 12 brand scaffolds + Sitemap. Web má **kompletní strukturu pro Stroje sekci** — chybí jen modelová data v 12 nových YAML značkách (`categories: {}` zatím prázdné).

Další etapa = naplnění daty:
- Per-brand scrapery generují JSON
- Apply skripty vloží do YAML
- Hub se sám rozsvítí (tile counts auto-update)

Bazar UI integration je separately:
- bazar-constants už hotový (mapování na nové kategorie)
- Page edits zbývají (CatalogPicker reaguje na nové subcategories, forms s conditional fields)

## Next action when resuming

**Volba:**

1. **CatalogPicker + BazarFilters cleanup**: rozhodnout o orphan komponentech (delete vs wireup). Lehká volba: delete oba (BazarSidebar má funkčnost). Pokud chce 2-level filter, wireup CatalogPicker do sidebar.

2. **Per-brand scrapery** (HIGH value): start s `scripts/lemken-api-scrape.mjs` po vzoru `scripts/fendt-api-scrape.mjs` (171 řádků). Lemken nemá undocumented API — použij sitemap (`https://lemken.com/sitemap.xml`) + JSON-LD scraping pro product detail pages. Rate 1 req/s, custom UA. Output `scripts/lemken-api-data.json`. Pak apply skript do `src/data/stroje/lemken.yaml`.

3. **Phase 8 deploy**: migrace 005 + 006 v Supabase SQL editoru, `npx wrangler deploy`, smoke test produkce. Phase 6 už je shippable po `c1fd73a` + `c44e100` (round-trip filter preservation funguje).

4. **Pause longer**: user pracuje na photos pipeline + statistiky redesign. Až dokončí + commitne, pak pokračovat.

## Resume instructions

Opening prompt:
```
Pokračuj ve stroje katalog implementaci. Načti
docs/superpowers/plans/2026-04-25-stroje-katalog-CONTINUE-HERE.md
pro stav. Use subagent-driven-development skill. Začni od "Next action when resuming"
sekce.
```

Klíčové soubory pro orientaci:
- Spec: `docs/superpowers/specs/2026-04-25-stroje-katalog-design.md`
- Plán: `docs/superpowers/plans/2026-04-25-stroje-katalog.md`
- Tento handoff: `docs/superpowers/plans/2026-04-25-stroje-katalog-CONTINUE-HERE.md`

Před dispatch jakéhokoli subagenta — vždy nejdřív `git status --short` a check user WIP. Per-task TodoWrite.

## Session-end snapshot (2026-04-25 odpoledne, druhá fáze)

**Co se v této session stalo (od resume):**
- Resume z pause snapshot — pokračování dle Option 1 (Address Phase 6 gaps)
- Gap A FIX: BazarSidebar.astro extension + bazar/index.astro props wiring → `c1fd73a`
- Gap B+C FIX: STROJE_CATEGORIES + BRANDS_SET dedup (derive z konstant, define:vars do client JS) → `c44e100`
- 72/72 testů PASS po obou commitech
- User vyjádřil concern o deletions v c44e100 — vysvětleno: 15 deletions = duplicate hardcoded arrays nahrazené dynamic derive, funkčně equivalent + bonus (BRANDS_SET 22 značek místo 10). Lze revert pokud user nechce.

**Klíčové učení pro fresh session:**
- `bazar/index.astro:91` používá `BazarSidebar` (NE BazarFilters). Live filter komponent je teď extended.
- Forms používají `CascadingPicker` (ne CatalogPicker). CatalogPicker.astro zůstává orphan — pending decision.
- User preferuje `_from/_to` URL convention (consistency s `price_from/year_from/power_from`).
- User permissive logiku (`!category ||`) preferuje pro UX (filtry viditelné na default `/bazar/` view).
- Migrace 005 + 006 NEJSOU aplikované na Supabase — kód columns používá ale v produkci by selhalo. Apply před deploy.
- User je opatrný k mazání kódu — preferuje vidět diff a vědět, proč. Při refactoru explicitně vysvětlit "co maže a proč to nevadí".

**Aktivní paralel user WIP** (NEDOTÝKAT, viz `feedback-parallel-sessions.md`):
- 9 starých brand YAMLs (case-ih, claas, deutz-fahr, fendt, john-deere, kubota, massey-ferguson, new-holland, valtra, zetor) — photos pipeline
- `CategoryBrowse.astro`, `middleware.ts`, `index.astro`, `[brand]/index.astro`, `wrangler.toml`
- nové scripts: `mf-api-*`, `photos-*`
- ~20 různých `src/pages/*.astro` souborů — obsahují unrelated user changes
- IDE měl otevřený `massey-ferguson.yaml` (pravděpodobně active edit)

**Stav Phase 6:** SHIPPABLE. Round-trip filter preservation funguje. Forms persistují nové fields. Detail page renderuje spec strip. Index filtruje. Zbývající práce je optional cleanup nebo větší kroky (scrapery, deploy).

**Doporučený další krok:** Per-brand scrapery (Lemken jako pilot) NEBO Phase 8 deploy.
