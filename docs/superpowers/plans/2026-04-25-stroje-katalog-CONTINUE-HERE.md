---
plan: 2026-04-25-stroje-katalog
status: Phase 6 complete (with gaps in BazarSidebar UI), awaiting user resume
last_updated: 2026-04-25T16:05:00+0200
last_commit: fbfcbfb
total_commits_made: 16 (foundation 9 + Phase 6 7)
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

## Remaining work

### Priority HIGH — Phase 6 GAPS (must address before deploy)

Final integration review identified that 2 z plánovaných komponent jsou orphan (nikde neimportovány):

- **BazarSidebar.astro NENÍ rozšířen** — `bazar/index.astro:91` používá `BazarSidebar`, ne `BazarFilters` (na kterém Task 6.6 pracoval). Důsledek: nové URL filtry (zaber/nosnost/objem/subcategory) fungují přes direct URL ale nemají UI controls a NEPROPISUJÍ SE do active-filter chipů. Round-trip filter preservation je rozbitý — user otevře `/bazar/?nosnost_from=3000`, klikne na jiný filter → nosnost se ztratí (sidebar form to nedrží).

  **Fix options**:
  1. Rozšířit `BazarSidebar.astro` o stejné rozšíření jako Task 6.6 přidalo do BazarFilters (zaberFrom/zaberTo props, conditional rows, active chips)
  2. Nebo přepnout `bazar/index.astro:91` na `BazarFilters` a smazat BazarSidebar (riziko: rozdílné mobile drawer chování)

- **BazarFilters.astro je dead code** — nikde neimportován po Task 6.6. Buď wireup do bazar/index.astro nebo delete.
- **CatalogPicker.astro je dead code** — nikde neimportován. Forms používají `CascadingPicker`. Task 6.5 práce je orphan. Buď wireup (např. do BazarSidebar pro 2-level filter) nebo delete.

### Priority MEDIUM — small bugs from final review

- **`bazar/novy.astro:255` + `moje/[id].astro:266`** — `STROJE_CATEGORIES` duplikováno inline. Mělo by být odvozeno z `Object.keys(BAZAR_TO_CATALOG_SUBCATEGORIES)` v bazar-constants.ts.
- **`bazar/novy.astro:295` + `moje/[id].astro:304`** — `BRANDS_SET` hardcoded jen na 10 původních traktor značek. Nové stroje brands (lemken, pottinger, kuhn, atd.) nebudou triggerovat auto-fill brand behavior. Build z `BRANDS` constanty.
- **`subcategory` neviditelný** — persisted, filterable via URL, ale není zobrazený nikde (BazarListingRow chip, [id].astro spec strip, breadcrumb). Pokud user chce to surfaceovat, je třeba přidat.

### Priority HIGH — Per-brand scrapery (Phase 0.5+)
12 značek po vzoru existujícího `scripts/fendt-api-scrape.mjs`. Lemken/Pöttinger/Kuhn/Amazone/Krone/Horsch/Vaderstad/Bednar/Manitou/JCB/Joskin/Kverneland nemají Fendt-like undocumented API — potřebují sitemap+JSON-LD scraping nebo per-výrobce HTML scraping. Output: `scripts/<brand>-api-data.json` + apply skript do YAML. Time: 2-4h per značka.

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

1. **Address Phase 6 gaps** (HIGHEST priority — bazar je broken UX bez tohoto): rozšířit `BazarSidebar.astro` o nové conditional rows (zaber/nosnost/objem) + active chips, identicky jak Task 6.6 udělal v BazarFilters. Pak smazat orphan BazarFilters.astro (nebo přepnout index.astro). Plus quick fixes: BRANDS_SET z konstant, STROJE_CATEGORIES dedup. Estimate: 1h.

2. **Continue per-brand scrapery** (HIGH value): start s `scripts/lemken-api-scrape.mjs` po vzoru `scripts/fendt-api-scrape.mjs` (171 řádků). Lemken nemá undocumented API — použij sitemap (`https://lemken.com/sitemap.xml`) + JSON-LD scraping pro product detail pages. Rate 1 req/s, custom UA. Output `scripts/lemken-api-data.json`. Pak apply skript do `src/data/stroje/lemken.yaml`.

3. **Phase 8 deploy**: aplikace migrace 005 + 006 v Supabase SQL editoru, `npx wrangler deploy`, smoke test produkce. NETESTOVAT před addressed Phase 6 gaps — bazar by byl broken.

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
