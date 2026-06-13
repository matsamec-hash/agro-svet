# Kalendář akcí — hub: kalendář + časová osa + filtry + obsah (fáze 1a-dokončení)

**Datum:** 2026-06-05
**Stav:** schváleno (uživatel: „nechám na tobě")
**Navazuje na:** `2026-06-05-kalendar-akci-design.md` (fáze 1a základ), worktree `~/agro-svet-kalendar-akci` na větvi `feat/kalendar-akci`.

## Kontext a problém

Fáze 1a je živá (`/akce/`, `/akce/pridat/`, `/admin/akce/`), ale hub `/akce/` je jen plochý `<ul>` seznam nadcházejících akcí. Uživatelská zpětná vazba odhalila 4 nedostatky:

1. **Formulář `/akce/pridat/` — neviditelná políčka.** Inputy nemají rámeček ani pozadí → splývají s bílou stránkou; uživatel vidí jen popisky, ne pole.
2. **Hub nemá kalendář ani časovou osu** — chybí přehledné chronologické zobrazení.
3. **Hub nemá filtry** — nelze filtrovat podle kraje/okresu/města ani podle času.
4. **Málo obsahu** — 10 kurátorských akcí, několik už proběhlo; chybí klíčové akce 2026.

## Cíl

Z plochého seznamu udělat použitelný kalendářový hub: mini-kalendář + časová osa, klientské filtry, opravený formulář, ~30–50 ověřených akcí 2026. Dotáhnout poslední zbytek 1a (cron údržby). **Plné long-tail SEO (detail `/akce/[slug]/`, programatické okres/typ/měsíc stránky) zůstává na fázi 1b — tato fáze ho nezahrnuje.**

## Schválená rozhodnutí

- **Zobrazení hubu:** kombinace mini-kalendář (měsíční mřížka s tečkami) + časová osa (agenda seskupená po měsících).
- **Filtry:** klientské (instant, bez reloadu) — kraj→okres, typ, časové okno.
- **Obsah:** velké celostátní + výběr regionálních, ~30–50 akcí; termíny ověřené web researchem, nejisté označené.
- **Cron:** endpoint `/api/cron/akce-maintenance` chráněný `CRON_SECRET` + denní GitHub Action ping (vzor `saved-search-digest`). Service key zůstává jen v Cloudflare.
- **Mini-kalendář:** jen nadcházející měsíce (od aktuálního dál), žádná historie.

## Architektura & data flow

Hub `/akce/` zůstává **SSR** (Astro `output:'server'`, Cloudflare Worker). Princip = **progresivní vylepšení**:

1. **Server** (`index.astro`):
   - `listUpcoming()` načte všechny nadcházející zveřejněné akce (limit zvednut na 200).
   - Vyrenderuje **časovou osu jako reálné HTML** seskupené po měsících → funguje bez JS, čitelné pro Google (SEO).
   - Každá akce = `<article>` s `data-` atributy: `data-kraj`, `data-okres`, `data-typ`, `data-date` (ISO `pristi_vyskyt`), `data-mesic` (YYYY-MM).
   - Do stránky se vloží `<script type="application/json" id="akce-data">` (pole akcí pro kalendář) + `<script type="application/json" id="kraje-data">` (`getKraje()`, stejný vzor jako formulář).
2. **Klient** (`<script type="module">`, vanilla — žádný nový Svelte island):
   - Závislý dropdown kraj→okres (stejná logika jako `pridat.astro`).
   - Filtr: skrývá/zobrazuje `<article>` dle aktivních filtrů, schová prázdné měsíční sekce, aktualizuje počítadlo.
   - Mini-kalendář: vykreslí měsíční mřížku vybraného měsíce, tečky na dnech s akcí (respektují filtr), nav ◀ ▶, klik na den → skrol + zvýraznění v ose.

**Bez JS:** filtr-bar i mini-kalendář jsou skryté (`hidden`, JS je odkryje); časová osa funguje jako čistý seznam.

## Komponenty

### A. Oprava formuláře `/akce/pridat/` (bugfix)
Dokončit už rozpracovanou CSS úpravu v `pridat.astro`: text-inputy/select/textarea dostanou `border: 1px solid #c4c4c4`, `background:#fff`, `border-radius`, focus-stav (zelený rámeček + box-shadow), placeholder barvu. Radio/checkbox zůstávají inline (stávající `:not()` pravidla). Bez změny logiky.

### B. Hub `/akce/index.astro` — přestavba
Shora dolů:
1. **Hlavička** + „+ Přidat akci" (zůstává).
2. **Filtr-bar** (`hidden` dokud JS nenaběhne): select kraj → select okres (závislý), select typ (7 z `AKCE_TYPES`), select časové okno (Tento týden / Tento měsíc / Vše), počítadlo výsledků, „Zrušit filtry".
3. **Mini-kalendář** (`hidden` dokud JS): měsíční mřížka (Po–Ne), tečky na dnech s akcí, nav ◀/▶ mezi nadcházejícími měsíci, klik den→osa.
4. **Časová osa** (SSR, vždy): `<section data-mesic="YYYY-MM">` s nadpisem měsíce (`SRPEN 2026`) + karty akcí (typ badge, název, termín přes `formatTermin`, místo `obec`).
5. **Empty-state** když 0 akcí / 0 po filtru.

### C. Čistá logika (testovatelná, `src/lib/akce-hub.ts`)
- `groupByMonth(akce): { mesic: string; label: string; akce: Akce[] }[]` — seskupí + seřadí, český název měsíce + rok.
- `matchesFilter(akce, filter): boolean` — predikát pro kraj/okres/typ/časové okno (časové okno počítá z `pristi_vyskyt` vůči `now`).
- `buildMonthGrid(year, month): (Date|null)[]` — mřížka 6×7 s `null` pro prázdné buňky, týden začíná pondělím.
- `upcomingMonths(akce, now): string[]` — seznam YYYY-MM od aktuálního měsíce, které mají akci (pro nav kalendáře).

Vanilla DOM kód v `index.astro` tyto čisté funkce použije (logiku duplikovat min., grid/groupování přes inline port nebo přímý import do client scriptu — Astro client script importy z `src/lib` fungují přes bundler).

### D. Obsah — rozšíření seedu
`supabase/seeds/akce_kurator_2026.sql` rozšířit na ~30–50 akcí. Pro každou: web research ověří **reálný název + termín + místo (obec/okres/kraj slug z `lokality.yaml`)**. Pole: `zdroj='kurator'`, `stav='zverejneno'`, `druh='jednorazova'` (většina), dopočítaný `pristi_vyskyt` = `zacatek`, unikátní `slug`. **Nejisté termíny:** pokud datum 2026 není ověřitelné, NEVYMÝŠLET — buď akci vynechat, nebo uvést s poznámkou „termín bude upřesněn" v `popis` a `zacatek` = nejpravděpodobnější odhad zřetelně označený. Existující proběhlé akce ze seedu ponechat (cron je převede na `probehla`). Aplikace ručně přes Supabase SQL editor (`obhypfuzmknvmknskdwh`, MCP nemá přístup).

Kandidáti k ověření (ne vyčerpávající): Techagro, Země živitelka (ČB, srpen), Naše pole (Nabočany), Den zemědělce (Kámen), Flora Olomouc (jaro/podzim), Floria Kroměříž, Národní výstava hospodářských zvířat (Brno), Animal Tech/Náš chov, regionální polní dny (Selgen, osivářské), bramborářské/řepařské dny, vinařské akce, farmářské trhy (pravidelné — `druh='opakovana'`), chovatelské přehlídky.

### E. Cron údržby
- **Endpoint** `src/pages/api/cron/akce-maintenance.ts` (`prerender=false`, `APIRoute`): ověří `Authorization: Bearer ${CRON_SECRET}` (přes `getEnvVar`, jako `saved-search-digest`), načte zveřejněné akce, pro každou spočítá `computeNextOccurrence`; jednorázové po termínu → `stav='probehla'`, ostatní → update `pristi_vyskyt`. Vrátí JSON `{updated, expired}`. Logika = port `applyMaintenance`/`scripts/akce-maintenance.mjs` (už existuje v `src/lib`).
- **GitHub Action** `.github/workflows/cron-akce-maintenance.yml`: denně (např. `0 4 * * *`), `workflow_dispatch`, curl ping na `https://agro-svet.cz/api/cron/akce-maintenance/` s `Authorization: Bearer ${CRON_SECRET}`, fail na ≠200. Vzor = `cron-saved-search-digest.yml`.
- `scripts/akce-maintenance.mjs` + npm `akce:maintenance` ponechat pro lokální/manuální běh.

## Testování & brána

- **TDD** na čisté logice v `src/lib/akce-hub.ts` (groupByMonth, matchesFilter, buildMonthGrid, upcomingMonths) → vitest.
- Klientský DOM kód (filtr/kalendář) — bez unit testů, ověří se buildem + manuálním smoke.
- **Brána:** `npx vitest run` + `npm run build` na **Node 22** (`nvm use 22`). `astro build` netypechecká (pre-existing tsc šum) → tsc není brána.
- **Smoke po deployi:** `/akce/` 200, časová osa renderuje měsíce, filtr-bar+kalendář se objeví s JS, filtr funguje; `/akce/pridat/` políčka viditelná; endpoint `/api/cron/akce-maintenance` vrací 401 bez tokenu.

## Deploy

Ručně z worktree (hlavní repo je na `feat/kategorie-chov-hlemyzdu`):
```
cd ~/agro-svet-kalendar-akci && source ~/.nvm/nvm.sh && nvm use 22 && npm run build && npm run deploy
```
`npm run deploy` = `wrangler deploy && cf-purge` (NEdělá build → build napřed). `.env` ve worktree. Seed SQL aplikuje uživatel/asistent přes Supabase SQL editor. `CRON_SECRET` už existuje (sdílený se `saved-search-digest`); GitHub Action secret je nastaven.

## Mimo rozsah (fáze 1b)

Detail `/akce/[slug]/`, programatické long-tail stránky (okres/typ/měsíc/obec + kombinace), próza/FAQ, JSON-LD Event/ItemList/Breadcrumb, sitemap akcí, per-page OG, AdSense, husté prolinkování. Feedy + Workers AI = fáze 2.
