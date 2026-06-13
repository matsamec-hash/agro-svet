# Design: Srovnání + žebříčky — rozšíření na nářadí (Track #4)

**Datum:** 2026-06-13
**Track:** #4 z `2026-06-13-agro-svet-organic-traffic-zadani.md`
**Cíl:** Rozšířit srovnávací (`/srovnani/[combo]/`) a žebříčkovou (`/zebricky/`) SEO plochu z traktorů/kombajnů na kategorie **nářadí se záběrem** — ~633 modelů ve ~19 kategoriích → tisíce nových párových stránek + nové žebříčky. Plus oprava stale sitemap bugu.

---

## Kontext a grounded stav (ověřeno 2026-06-13)

- **Framework:** Astro 6.4.4, SSR (`output: 'server'`), `trailingSlash: 'always'`. Node 22. Deploy push `master` → Coolify.
- **Data:** `src/data/stroje/*.yaml` (per značka), parsováno compile-time přes `@modyfi/vite-plugin-yaml` v `src/lib/stroje.ts`. **2092 modelů, 41 kategorií.** `StrojFlatModel` má: `power_hp/kw`, `weight_kg`, `cutting_width_m`, `grain_tank_l`, a pro nářadí `pracovni_zaber_m`, `prikon_traktor_hp_min/max`, `typ_zavesu` (`neseny|tazeny|poloneseny|samojizdny|navesny`), `specs` (volný dict).
- **Srovnávací engine (mature, jen traktory/kombajny):**
  - `src/lib/comparator.ts`: `topComparisonPairs()` / `expandedComparisonPairs(5000)` — **filtr `category==='traktory'||'kombajny'` && `power_hp!==null`**. `buildComparisonRows(category)` — base řádky (výkon, kW, roky, motor, převodovka, hmotnost) + kombajn (žací stůl, zásobník). `findModelBySlug`, `pairCombo`, `parsePairCombo`, `relatedComparisonsFor`, `modelDisplayName`.
  - `src/lib/competitor-finder.ts`: `findCompetitors()` — same-category, **±tolerance `power_hp`** (implementy s `power_hp=null` se vyřadí). `useCaseDescription()` — vrací prózu jen pro traktory/kombajny, jinak `null`.
  - `src/lib/comparison-insights.ts` (414 ř.): `comparisonInsights(a,b,locale)` → `{tldr, shortDescription, decisionA, decisionB, faqs[5], lastUpdatedIso}`. **Natvrdo hp/velikost-farmy/značka-traktoru.** cs/sk/uk templováno inline (cs byte-identické s pre-i18n výstupem).
  - `src/pages/srovnani/[combo]/index.astro` (SSR, `prerender:false`): `getStaticPaths` z `expandedComparisonPairs(5000)`. **SSR fallback už přijímá LIBOVOLNÝ same-category, different-brand pár** → infrastruktura sdílená, jen verdikt/use-case/pair-generace jsou hp-centrické. `categoryFallback` image jen traktor/kombajn.
- **Žebříčky (mature, generické jádro):** `src/lib/tier-lists.ts`: `TierListDef {slug,title,description,methodology,callToAction,category,filter,score,limit}` + `TIER_LISTS` (9 def, traktory+kombajny) + `rankForTierList(def)` — **plně generický** (category match + filter + score desc + dedup po sérii). Stránky `src/pages/zebricky/index.astro` + `[slug].astro` (prerender, generické). V nav (`nav.tech.toplists`) i sitemapě.
- **i18n:** `/srovnani` launched **cs + sk + uk** (`src/i18n/utils.ts` `LAUNCHED_PREFIXES`). `/zebricky` — ověřit launch stav (pravděpodobně cs; sk/uk dle utils).
- **Sitemap:** `expandedComparisonPairs(5000)` páry + `/zebricky/` + `/zebricky/{slug}/`. **BUG: řádky ~351–353 inzerují mrtvé `/srovnani/top/` a `/srovnani/top/{slug}/`** (sekce přejmenovaná na `/zebricky/`, staré entries zůstaly → 404 v sitemapě).

### Datová bohatost (modely / z toho s klíčovým spec)
traktory 1236, kombajny 223 (POKRYTO). Nepokryté se záběrem: seci-stroje-pneumaticke 43, rezacky-samojizdne 37, podmitace-diskove 34, pluhy 33/0záběr, podmitace-radlickove 32, zaci-stroje 31, rezacky 29, seci-stroje-presne 27, cisterny-kejda 27/0, seci-kombinace 25, lisy-valcove 24/0, rozmetadla-mineralni 23, kyprice 19, postrikovace-tazene 18, rotacni-brany 18, shrnovace 18, samosberaci 15/0, rozmetadla-statkova 14/0, valce 13, aplikatory-kejda 13/0, obracece 12, postrikovace-samojizdne 10, … (teleskopy/nakladače = lift osa, ne záběr).

---

## Co stavíme

### 1. Generace párů nářadí (záběr osa)
Rozšířit výběr párů o nářadí párované dle `pracovni_zaber_m`:
- **`src/lib/competitor-finder.ts`:** přidat `findImplementCompetitors(source, opts)` — same-category, different-brand, `pracovni_zaber_m` v ±toleranci (default ±25 %), current production (`year_to===null`) preferováno, řazeno dle blízkosti záběru. (Stávající hp `findCompetitors` beze změny.)
- **`src/lib/comparator.ts`:** přidat `implementComparisonPairs(limit)` — iteruje modely v **záběrových kategoriích** (data-driven: kategorie, kde ≥`MIN_MODELS_WITH_ZABER` (=8) modelů má `pracovni_zaber_m`), generuje páry přes `findImplementCompetitors`, kanonické pořadí, dedup, řazeno dle součtu záběru. Export `IMPLEMENT_COMPARE_CATEGORIES` (odvozená množina kategorií). Stávající `topComparisonPairs`/`expandedComparisonPairs` (traktor/kombajn) **beze změny**.

### 2. Verdikt engine pro nářadí (nový paralelní modul)
**`src/lib/implement-comparison-insights.ts`** (vedle `comparison-insights.ts`, neměnit stávající → chrání cs byte-paritu hlídanou testy):
- Export `implementComparisonInsights(a, b, locale): ComparisonInsights` (stejný interface jako stávající: `tldr, shortDescription, decisionA, decisionB, faqs, lastUpdatedIso`).
- Dimenze verdiktu (z dat, templováno cs/sk/uk):
  - **Pracovní záběr** (`pracovni_zaber_m`): „X má širší záběr o N m (… vs …)". Širší = vyšší plošný výkon, ale vyšší příkon.
  - **Potřebný příkon traktoru** (`prikon_traktor_hp_min/max`): „X vyžaduje traktor od N k". Klíčové pro rozhodování (kompatibilita s parkem).
  - **Typ závěsu** (`typ_zavesu`): nesený vs tažený vs samojízdný — manévrovatelnost/přeprava.
  - **Rok** (`year_from`): novější = modernější.
  - Decision boxy „Vyber A když / Vyber B když" postavené na záběr/příkon/závěs + fallback na značku (reuse `brandDescriptorAkuzativ` — vyčlenit do sdíleného helperu, viz §5).
  - 5 FAQ: záběr, potřebný příkon, typ závěsu, vhodnost (velikost farmy dle záběru), rok.
- Pokud chybí záběr u obou → degraduje na obecný „srovnatelná třída" verdikt (jako stávající fallback).

### 3. Spec řádky pro nářadí
`src/lib/comparator.ts` `buildComparisonRows(category)`: přidat větve pro záběrové kategorie — řádky **Pracovní záběr** (`pracovni_zaber_m`, better higher, m), **Potřebný příkon traktoru** (`prikon_traktor_hp_min`–`max`, none), **Typ závěsu** (`typ_zavesu`, none), + vybrané `specs` klíče (např. `tank_capacity_l` pro rozmetadla). Base řádky (motor/převodovka/výkon) zůstanou — u nářadí typicky `null` → render je už podmíněný.

### 4. `[combo]` stránka — dispatch dle kategorie
`src/pages/srovnani/[combo]/index.astro`:
- `getStaticPaths`: přidat `implementComparisonPairs(N)` k stávajícím `expandedComparisonPairs(5000)` (sloučit, dedup dle `combo`).
- Insights dispatch: `const isImplement = !(a.category==='traktory'||a.category==='kombajny')` → `isImplement ? implementComparisonInsights(a,b,locale) : comparisonInsights(a,b,locale)`. **Traktor/kombajn větev beze změny.**
- `categoryFallback` image: doplnit obecný fallback pro nářadí (např. `/images/stroj.webp` nebo existující category placeholder — ověřit, co je k dispozici).
- Titulek/meta key: zobecnit (dnes jen `cat.sr.c.titleTraktory/Kombajny`) — přidat generický `cat.sr.c.titleImplement` nebo odvodit z názvu kategorie.

### 5. Sdílený helper (DRY)
`brandDescriptorAkuzativ` + `farmSizeClause` jsou v `comparison-insights.ts`. `brandDescriptorAkuzativ` reusovat i pro nářadí → vyčlenit do `src/lib/comparison-insights-shared.ts` (nebo export ze stávajícího), importovat v obou. Minimální refaktor, bez změny chování.

### 6. Žebříčky nářadí
`src/lib/tier-lists.ts`: přidat `TierListDef` entries (score = `pracovni_zaber_m`, filter = current production + má záběr), např.: „Nejširší diskové podmítače", „Nejširší radličkové podmítače", „Nejlepší secí kombinace", „Nejširší secí stroje (přesné)", „Samojízdné řezačky podle výkonu", „Nejširší žací stroje", „Nejširší rozmetadla minerálních hnojiv", „Nejširší tažené postřikovače". (~6–8 nových.) `/zebricky/` + `[slug]` + nav + sitemap to vyrenderují automaticky.

### 7. Sitemap
`src/pages/sitemap.xml.ts`:
- **Opravit bug:** smazat mrtvé `/srovnani/top/` + `/srovnani/top/{t.slug}/` entries (řádky ~351–353).
- Přidat `implementComparisonPairs(N)` páry (stejný vzor jako stávající `expandedComparisonPairs`).
- Nové tier-listy se přidají automaticky (sitemap už iteruje `TIER_LISTS`).
- sk/uk mirror: páry/žebříčky respektují launched prefixy (stávající mechanismus).

### 8. Cross-linky (lehčí polish)
Kde dává smysl: z `[combo]` stránky nářadí odkaz na encyklopedické heslo kategorie + na značky obou modelů; z encyklopedie/značek na relevantní srovnání. (Reuse `relatedComparisonsFor`-styl, ale pro nářadí.) Pokud rozsahově narůstá, odložit jako follow-up.

---

## Komponenty / soubory

| Soubor | Akce | Odpovědnost |
|---|---|---|
| `src/lib/competitor-finder.ts` | Modify | +`findImplementCompetitors` (záběr osa) |
| `src/lib/comparator.ts` | Modify | +`implementComparisonPairs` +`IMPLEMENT_COMPARE_CATEGORIES`; `buildComparisonRows` nářadí větve |
| `src/lib/comparison-insights-shared.ts` | Create | Vyčleněný `brandDescriptorAkuzativ` (+ sdílené typy) |
| `src/lib/comparison-insights.ts` | Modify | Import sdíleného helperu (jinak beze změny chování) |
| `src/lib/implement-comparison-insights.ts` | Create | Verdikt engine nářadí (cs/sk/uk) |
| `src/lib/tier-lists.ts` | Modify | +~6–8 `TierListDef` nářadí |
| `src/pages/srovnani/[combo]/index.astro` | Modify | getStaticPaths + insights dispatch + image/title fallback |
| `src/pages/sitemap.xml.ts` | Modify | fix `/srovnani/top/` bug; +implement páry |
| `src/i18n/ui/*.ts` | Modify | nové label klíče (title nářadí, spec řádky) cs/sk/uk |
| `tests/lib/*.test.ts` | Create/Modify | unit testy nových libů |

---

## Testování
- **Byte-parita stávajícího:** ověřit, že traktor/kombajn `comparisonInsights` cs výstup je beze změny (po vyčlenění helperu) — pokud existuje parity test, musí zůstat zelený; jinak doplnit snapshot pro pár vzorových párů.
- **`findImplementCompetitors`:** vrací same-category different-brand v ±toleranci záběru; prázdné pro model bez záběru.
- **`implementComparisonPairs`:** generuje páry jen pro záběrové kategorie nad prahem; kanonické pořadí; dedup.
- **`implementComparisonInsights`:** TL;DR/decision/FAQ obsahují záběr+příkon+závěs; degraduje bez záběru; cs/sk/uk varianty se liší a needefaultují na cs náhodně.
- **`buildComparisonRows`:** nářadí kategorie mají záběr/příkon/závěs řádky.
- **Tier-lists:** nové def projdou `rankForTierList` (vrací ≥1 model, score sestupně).
- **Build:** `node scripts/build-og-images.mjs && astro build` zelený (node 22). Smoke: pár stránek nářadí 200 (cs i sk), žebříček nářadí 200, sitemap obsahuje implement páry + NEobsahuje `/srovnani/top/`.

---

## Hranice rozsahu (YAGNI)
- **Nesahat** na stávající hp tractor/kombajn engine (`comparisonInsights`, `topComparisonPairs`, `findCompetitors`) kromě importu sdíleného helperu — chránit byte-paritu.
- **Vyloučit** lift/transport osy: teleskopy, čelní/kolové/smykové/kloubové nakladače, lisy (válcové/hranolové), samosběrací vozy, návěsy, cisterny/aplikátory kejdy (0 záběr), pluhy (0 záběr), rozmetadla statková (0 záběr). → příští cyklus s jinou osou.
- Cross-linky (§8) — pokud narůstají, odložit jako follow-up.
- Žádné nové AI/generované prózy mimo templovaný engine (jako stávající).

## Akceptační kritéria
1. Páry nářadí (záběrové kategorie nad prahem) jsou prerendered/SSR na `/srovnani/[combo]/` s relevantním verdikt+FAQ (záběr/příkon/závěs), cs/sk/uk.
2. Stávající traktor/kombajn srovnání i jejich cs výstup beze změny (byte-parita).
3. `buildComparisonRows` zobrazuje pro nářadí záběr/příkon/závěs.
4. ~6–8 nových žebříčků nářadí živě na `/zebricky/` (+ `[slug]`, nav, sitemap).
5. Sitemap: `/srovnani/top/` 404 entries odstraněny; implement páry + implement žebříčky přidány.
6. vitest zelený (vč. nových testů + případné byte-parity), build zelený (node 22).

## Proces
- Větev `feat/srovnani-narani` z `master` (worktree). Merge/PR po schválení. Git push token-in-URL. `nvm use 22`.
