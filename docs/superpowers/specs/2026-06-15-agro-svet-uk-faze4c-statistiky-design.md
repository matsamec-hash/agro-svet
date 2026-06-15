# agro-svet.cz UK fáze 4c — `/uk/statistiky` (ukrajinská lokalizace)

**Datum:** 2026-06-15
**Větev:** `feat/i18n-uk-faze4c-statistiky` (worktree `~/agro-svet/.worktrees/uk-faze4c-statistiky`, z `master` `61e4703`)
**Track:** UK (ukrajinská) lokalizace #3, fáze 4c. Navazuje na 4a (slovník) a 4b (/puda).

## Cíl

Lokalizovat sekci `/statistiky` do ukrajinštiny s **věcně ukrajinským obsahem** (UA agro-statistiky)
a zapnout indexaci pod `/uk`, **BEZ jakékoli změny CS/SK výstupu** (byte-identický).
Publikum = Ukrajinci v UA → ukrajinská data, UA narativ. Hlavní riziko = **verifikace UA dat**.

## Proč je 4c jiná než 4b

CS `/statistiky` je strukturálně nejtěžší sekce webu: `src/data/agro-stats.json` má ~15 749 řádků
(11 datových bloků: komodity, ceny vstupů/palivo/hnojiva, dobytek, plodiny, plochy, krajský hexmap,
cenové nůžky). SK používá `agro-stats-sk.json` (parita tvaru). Route `src/pages/statistiky/index.astro`
je SSR (`prerender=false`), single hub bez `[slug]`, locale-aware přes ternár `isSk` + helpery
`src/lib/agro-derived.ts` (`statTakeaways`/`scissorsInsightText`/`livestockInsightText`).

**Plnou paritu NEděláme.** UA data jsou válkou zkreslená (časové řady) a parita je datově riziková.

## Rozhodnutí (z brainstormingu)

### Tvar obsahu — kurátovaný narativní hub (vzor PudaUk 4b)
UK hub NEbude parita-klon CS bloků. Vypráví příběh **Ukrajina jako globální agro-exportní velmoc**
přes 4 schválené bloky:

| Blok | Obsah | Grounding | Riziko |
|---|---|---|---|
| **Big numbers** | #1 export slunečnicového oleje, podíl na sv. exportu pšenice/kukuřice, orná půda, černozem | USDA FAS, FAO, World Bank | nízké (evergreen) |
| **Produkce + export plodin** | Pšenice, kukuřice, slunečnice, ječmen, soja — roční produkce + exportní objemy | USDA FAS PSD | střední (ročenky stabilní) |
| **Časová osa válečného dopadu** | 2021→dnes: propad, černomořský koridor, EU solidarity lanes, zaminovaná/okupovaná půda | UN/OCHA, KSE, World Bank | nízké (kvalitativní) |
| **Ceny / vstupy** | FOB černomořská cena obilí NEBO vstupy (palivo/hnojiva) | jen pokud autoritativní zdroj | **vysoké → CONDITIONAL** |

**⚠️ Blok "Ceny/vstupy" má tvrdou bránu:** přežije jen pokud ho data-verifikační brána ugroundi
≥1 autoritativním zdrojem se `source`+`asOf`. Pokud ne → **DROP** (hub zůstane se 3 bloky,
žádné vymyšlené ani odhadnuté číslo).

**CZ krajský hexmap = VYNECHÁN** (česká geometrie, do UA nepatří; nenahrazuje se UA geometrií).

### Architektura — izolace (chrání byte-identitu CS/SK)

Stejný osvědčený vzor jako 4b:

- **Komponenta:** nová `src/components/statistiky/StatistikyUk.astro` (vzor `src/components/puda/PudaUk.astro`,
  371 řádků) — self-contained UK template, čte **jen** UA data, **žádný fallback na CS**. Používá
  `useTranslations('uk')` a `Intl.NumberFormat('uk-UA')`.
- **Route:** `src/pages/statistiky/index.astro` dostane na začátku těla delegaci
  `{locale === 'uk' ? <StatistikyUk /> : ( …stávající CS/SK Layout… )}`. CS/SK větev **netknutá → byte-identická**
  (vzor: `puda/index.astro` řádek ~99). Importy `StatistikyUk` přidat do frontmatteru.
- **Data:** nový `src/data/agro-stats-uk.json` — kurátovaný tvar po vzoru `agro-puda-uk.json`.
  **Každé volatilní pole nese `source` + `url` + `asOf`/`year`.** Schema viz níže.
- **Lib:** nový `src/lib/statistiky-uk.ts` — typy `StatistikyUkData` + čisté derivace/SVG math.
  Znovupoužití vzoru `buildLineChart` z `src/lib/puda-uk.ts` (sdílet importem, nebo replikovat
  pokud sdílení zavádí coupling — preferovat import existující `buildLineChart`). Žádné prose ternáry.
  **NE bolt-on do `agro-derived.ts`** — jeho `Locale` typ zůstává `'cs' | 'sk'`, uk se ho nedotkne
  (klíčová izolace: žádná třetí větev ve velkém sdíleném souboru).
- **i18n:** `stat.uk.*` klíče do `src/i18n/ui/uk.ts` (hub chrome, pill-nav, nadpisy 4 bloků, popisky
  zdrojů, war caveat label). Hub **nemá markdown body** → locale-aware auto-linker
  (`renderMarkdownWithLinks`) se netýká.

### `agro-stats-uk.json` — navržené schema

```jsonc
{
  "generated": "2026-06-15",
  "warCaveat": "<UA: data ovlivněna válkou, časové řady mohou být neúplné>",
  "bigNumbers": [
    { "val": "≈1", "unit": "", "lbl": "<světový exportér slunečnicového oleje>",
      "trend": "<kontext>", "source": "USDA FAS", "url": "https://..." }
    // 4 hero čísla
  ],
  "cropProduction": [
    { "crop": "<Пшениця>", "unit": "млн т",
      "production": [ { "year": 2021, "value": 33.0 }, { "year": 2024, "value": 22.0 } ],
      "export":     [ { "year": 2021, "value": 20.0 } ],
      "source": "USDA FAS PSD", "url": "https://...", "asOf": "<marketing year 2024/25>" }
    // pšenice, kukuřice, slunečnice, ječmen, soja
  ],
  "warTimeline": [
    { "year": "2022", "title": "<...>", "text": "<...>", "source": "...", "url": "https://..." }
  ],
  "prices": {            // CONDITIONAL — celý blok smazat pokud verifikační brána nenajde zdroj
    "unit": "<USD/t FOB>", "asOf": "<...>", "source": "...", "url": "https://...",
    "max": 0, "ticks": [], "series": [ { "year": 2021, "value": 0 } ]
  },
  "sources": [ { "label": "USDA FAS PSD", "url": "https://..." } ]
}
```

Hodnoty v tomto specu jsou **ilustrativní placeholdery tvaru** — reálná čísla plní grounded
implementační task a ověřuje data-verifikační brána. Plán definuje STRUKTURU, ne hodnoty.

### `statistiky-uk.ts` — navržené API

```ts
export interface StatistikyUkSeriesPoint { year: number; value: number }
export interface CropProduction { crop: string; unit: string;
  production: StatistikyUkSeriesPoint[]; export: StatistikyUkSeriesPoint[];
  source: string; url: string; asOf: string }
export interface StatistikyUkData { /* viz JSON schema výše */ }
// derivace (čistá math, žádný locale prose):
//  - reuse buildLineChart() z puda-uk.ts pro grafy produkce/cen
//  - případně cropProductionDropPct(d): number | null  (propad produkce vs. předválečný rok)
```

## Launch, sitemap, hreflang

- `LAUNCHED_PREFIXES.uk += '/statistiky'` v `src/i18n/utils.ts` = **POSLEDNÍ implementační task**
  (do té doby `/uk/statistiky` neindexované → noindex/404 dle gate; chrání nedohotovený obsah).
- Sitemap `ukMirror` (v `src/pages/sitemap.xml.ts`) + reciproční hreflang se zrcadlí **AUTO**
  podle `isLaunchedPath('uk', …)` — žádný ruční zápis. Jen ověřit ve smoke testu po launchi.

## Metoda

`writing-plans` → `subagent-driven-development`. Každý implementační task:
**implementer → spec review → code-quality review**. Plus:

- **DATA verifikační brána** (nezávislý opus + web, adversariální): ověřit **každé číslo**
  ≥1 autoritativním zdrojem (USDA FAS PSD, FAO, Держстат, World Bank, KSE); co nelze ověřit → **DROP**.
  Tato brána rozhoduje o osudu bloku "Ceny/vstupy".
- **Finální opus review** celého diffu.
- **finishing-a-development-branch** (PR → merge → Coolify auto-deploy na master push).
- **⚠️ Reconcile s `origin/master` PŘED mergem** — track se rychle vyvíjí; čekat konflikty
  v `utils.ts` (LAUNCHED_PREFIXES), `ui/uk.ts`, případně sdílených helperech.

## Pořadí tasků (návrh pro writing-plans)

1. Lib + typy: `src/lib/statistiky-uk.ts` (typy + derivace, reuse `buildLineChart`).
2. Data scaffold: `src/data/agro-stats-uk.json` se strukturou + placeholdery tvaru.
3. Grounded data fill: reálná UA čísla pro big numbers + cropProduction + warTimeline + (prices).
4. **DATA verifikační brána** (adversariální opus+web) — ověř/DROP, fixni `agro-stats-uk.json`.
5. i18n: `stat.uk.*` klíče do `ui/uk.ts`.
6. Komponenta: `src/components/statistiky/StatistikyUk.astro` (render 3–4 bloků z dat + i18n).
7. Route delegace: `statistiky/index.astro` `{locale==='uk' ? <StatistikyUk/> : (…)}` — ověřit CS/SK byte-identitu.
8. Launch: `LAUNCHED_PREFIXES.uk += '/statistiky'` + smoke (sitemap/hreflang/200/noindex→index).
9. **(Volitelné)** LangSwitcher: přidat UK do `LangSwitcher.astro` (dnes jen CS/SK).
10. Finální opus review → reconcile s origin/master → PR → merge.

## Prostředí

- Worktree `~/agro-svet/.worktrees/uk-faze4c-statistiky`, větev `feat/i18n-uk-faze4c-statistiky`.
- `cp .env` do worktree (jinak sitemap 500 = env artefakt, NE bug). Live sitemap v preview:
  `set -a; . ./.env; set +a` před `npm run preview`.
- Node 22: `export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 22`.
- Baseline: 3 pre-existing fails `tests/i18n/nav.test.ts` (bazar-nav) = **NE regrese**.
- Coolify auto-deploy na master push. CI „Workers Builds" fail = **ignorovat** (stale;
  reálný deploy = Coolify + `@astrojs/node`, Cloudflare Pages check pass).

## Přenositelné lekce (4a + 4b)

- CS/SK výstup MUSÍ zůstat byte-identický; launch prefix až jako POSLEDNÍ task.
- Izolace uk do vlastní komponenty chrání byte-identitu (ne třetí větev ve velkém souboru).
- `tf(locale, key, params)` — `locale` je PRVNÍ argument.
- Assemble velkých dat skriptem `str.replace`, NIKDY Python `re.sub` (interpretuje `\n` → rozbije `\n\n`).
- Data nevymýšlet: plán definuje STRUKTURU, hodnoty plní grounded task + verifikační brána.

## Mimo rozsah (YAGNI)

- CZ krajský hexmap a jeho UA náhrada.
- Plná parita s 11 CS bloky.
- Změny `agro-derived.ts` / `Locale` typu / CS / SK výstupu.
- Volatilní cenové časové řady bez autoritativního zdroje (DROP, ne odhad).
```
