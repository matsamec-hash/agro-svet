# Spec: Akce v sezóně (Track #5 fáze 2) — schválený design

**Datum:** 2026-06-13
**Track:** #5 fáze 2 (navazuje na hotový `/sezona/` cluster, PR #80, živě)
**Status:** Schváleno v brainstormu (prerender + klientský fetch; sezónně filtrované akce + fallback; jen sezónní stránky).
**Větev:** `feat/akce-sezona`, worktree `~/agro-svet-akce-sezona` (z `origin/master` `eaa890b`).

## Cíl

Doplnit na sezónní stránky `/sezona/[season]/` sekci **„Akce v této sezóně"** — nadcházející akce (z existující Supabase tabulky `akce`), jejichž termín padá do měsíců dané sezóny. Přidává čerstvost a utilitu k evergreen sezónnímu obsahu. **Akce = sekundární prvek, ne SEO cíl.**

## Rozsah (MVP)

CS-only (akce systém je cs-only). Žádné nové akce typy/pole. **Jen sezónní stránky** (`/sezona/{jaro,leto,podzim,zima}/`), ne hub `/sezona/`. Stránky **zůstávají prerender** — akce se načítají klientsky (progressive enhancement), takže SEO obsah zůstává statický a rychlý.

## Architektura

### 1. SSR JSON endpoint
`src/pages/api/akce-sezona/[season].json.ts` — `export const prerender = false`.
- Čte `Astro.params.season`, validuje proti `SEASONS` (z `src/lib/sezona.ts`). Neznámá sezóna → `404`.
- Načte nadcházející akce: `listUpcoming(200)` z `src/lib/akce-supabase.ts` (stejný loader jako `/akce/index.astro`).
- Profiltruje přes čistou funkci `akceInSeason(akce, seasonSlug, now)` (viz níže).
- Vrátí `Response` s JSON polem (max 8 položek), `Content-Type: application/json`. Validní sezóna bez akcí → `[]` (HTTP 200).
- Položka JSON nese jen pole potřebná pro kartu: `{ slug, nazev, terminText, obec, kraj_slug, typ }` — `terminText` předformátovaný server-side (viz formátování níže), ať klient nepotřebuje termínovou logiku.
- Cache hlavička: `Cache-Control: public, max-age=600, s-maxage=1800` (akce se nemění po sekundách; krátká cache je OK).

### 2. Čistá filtrační funkce (testovatelná)
`akceInSeason(akce: Akce[], seasonSlug: SeasonSlug, now: Date): Akce[]` v `src/lib/sezona.ts`.
- `Akce.pristi_vyskyt` (string|null) je předpočítaný příští výskyt. **Ověřeno:** `listUpcoming` už dělá `.not('pristi_vyskyt','is',null).order('pristi_vyskyt', ascending)` → vrací jen akce s naplněným `pristi_vyskyt`, setříděné vzestupně. Filtr přesto zůstává defensivní (nezávislý na zárukách loaderu, aby byl samostatně testovatelný): vynech `pristi_vyskyt == null` i `pristi_vyskyt < now` (porovnání dat).
- Z `pristi_vyskyt` odvoď měsíc (1–12) a nech jen ty, jejichž měsíc ∈ `getSeason(seasonSlug)!.months`.
- Seřaď vzestupně dle `pristi_vyskyt`.
- Čistá: žádný Supabase/async; bere `akce` + `now` jako parametry → **unit-testovatelná** se syntetickými akcemi.

### 3. Sekce na sezónní stránce
`src/pages/sezona/[season].astro` (zůstává `prerender = true`) — přidat sekci „Akce v této sezóně":
- Server-render: nadpis `<h2>` + prázdný kontejner `<div id="akce-sezona" data-season={def.slug}>` + **noscript/fallback** odkaz „Zobrazit kalendář akcí →" na `/akce/`.
- Inline klientský `<script>`: `fetch('/api/akce-sezona/' + slug + '.json')` → vykreslí seznam karet (název = odkaz na `/akce/<slug>/`, `terminText`, místo `obec`). Při `[]` nebo chybě → zpráva „Pro tuto sezónu zatím nejsou naplánované žádné akce." + odkaz na `/akce/`.
- Progressive enhancement: bez JS uživatel vidí fallback odkaz na `/akce/`. SEO obsah stránky se nemění.

### Formátování termínu
Endpoint použije `formatTermin(t: TerminInput)` z `src/lib/akce-recurrence.ts` (stejně jako `/akce/index.astro`). `TerminInput` je discriminated union (`{ druh: 'jednorazova'; zacatek; konec? }` | `{ druh: 'opakovana'; … }`); endpoint ho sestaví z polí `Akce` (`druh`, `zacatek`, `konec`, `dny_v_tydnu`, `plati_od`, `plati_do`, …). V plánu převzít přesný mapping `Akce → TerminInput` z `/akce/index.astro` (kde už `formatTermin` na akce volá).

## Testy

- `tests/lib/sezona.test.ts` (rozšířit): `akceInSeason` se syntetickými `Akce` objekty —
  - akce s `pristi_vyskyt` v měsíci sezóny → zahrnuta;
  - akce mimo měsíce sezóny → vynechána;
  - akce s `pristi_vyskyt` v minulosti (< now) → vynechána;
  - akce s `pristi_vyskyt === null` → vynechána;
  - výsledek seřazený vzestupně dle data;
  - hranice měsíců (např. jaro = 3,4,5).
- Endpoint + stránka: build green + lokální smoke (`curl /api/akce-sezona/jaro.json` → 200 JSON pole; `curl /api/akce-sezona/nesmysl.json` → 404; sezónní stránka 200 a obsahuje `id="akce-sezona"`).

## Verifikace (před PR)

Node 22. `npx vitest run` (nové `akceInSeona` testy zelené; pozor 3 pre-existing bazar-nav fail = baseline). `npm run build` green. Lokální prod server smoke: endpoint 200/`[]`/404; `/sezona/jaro/` 200 s kontejnerem; `/sk/sezona/jaro/` 302 na cs. Po schválení merge/PR → Coolify.

## Soubory

**Nové:** `src/pages/api/akce-sezona/[season].json.ts`.
**Editované:** `src/lib/sezona.ts` (+`akceInSeason`, import typu `Akce`), `src/pages/sezona/[season].astro` (+ sekce + klientský script), `tests/lib/sezona.test.ts` (+ testy).

## Mimo scope (záměrně)

Akce na hubu `/sezona/`; akce v server HTML / SEO indexace akcí; nové akce typy nebo plodina↔akce vazba; sk/uk.
