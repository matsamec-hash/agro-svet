# UK fáze 4c — `/uk/statistiky` (ukrajinská obilnice) — Design

> **Track #3 (UK jurisdikční/datová lokalizace), fáze 4c.** Po 4a (Slovník, živě) a 4b (/puda, živě). `/dotace` (4d) = samostatná, poslední fáze.

## Cíl

Spustit `/uk/statistiky` jako **kurátovanou podmnožinu** statistik cílenou na ukrajinské publikum (Ukrajinci v UA): příběh **UA jako světové obilnice** — produkce, osevní plochy a podíl na světovém exportu čtyř hlavních exportních plodin. Evergreen jádro s autoritativním groundingem; volatilní čísla jen se zdrojem a datem (`source` + `asOf` + `url`).

**NENÍ to plná parita s cs/sk.** cs/sk verze (ceny komodit, PHM, hnojiva, cenové nůžky, stavy zvířat, krajský hexmap) se nereplikují — jsou trh-specifické pro ČR/SR a pro UA buď nerelevantní, nebo nelze spolehlivě ozdrojovat (a válka je dál komplikuje).

## Rozhodnutí (z brainstormingu)

- **Scope:** „obilnice" jádro = produkce + plochy + export. Žádné ceny/PHM/hnojiva/cenové nůžky.
- **Plodiny:** velká čtyřka — **pšenice, kukuřice, slunečnice, ječmen** (slunečnice = signature, UA světová jednička ve slunečnicovém oleji).
- **Architektura:** přístup A — plná izolace jako 4b /puda (chrání byte-identitu cs/sk, lekce z 4a/4b).
- **Časové okno:** ~10 let ročních dat (cca 2015–2024 / poslední dostupné).
- **Jednotky:** produkce mil. t, plocha mil. ha, export mil. t + % světového trhu. Žádná měna/ceny.

## Architektura (mirror /puda, ověřeno proti kódu)

Cílová cs route je `src/pages/statistiky/index.astro` (652 ř., **SSR `prerender=false`** — middleware přepisuje non-cs locale na cs cestu; locale z `Astro.locals.locale`, NE z URL). Datové vstupy: `src/data/agro-stats.json` (cs, ~15 749 ř.) a `agro-stats-sk.json` (sk). Helpery v `src/lib/agro-derived.ts`.

**Vzor 4b /puda k zrcadlení:**
- Route gate v `index.astro`: `{locale === 'uk' ? <PudaUk /> : (…cs/sk inline…)}` (u /puda ř. ~100).
- Izolovaná `src/components/puda/PudaUk.astro` (hardcoded `useTranslations('uk')`, žádné větvení, data jen z typovaného JSON).
- `src/lib/puda-uk.ts` — typy + čistá SVG chart-math (`buildLineChart`, `pudaUkPriceGrowthPct`).
- `src/data/agro-puda-uk.json` — každá volatilní série nese `source` + `asOf` + `url`.

**Co postavíme pro 4c:**

| Jednotka | Soubor | Odpovědnost | Závisí na |
|---|---|---|---|
| Route gate | `src/pages/statistiky/index.astro` (edit) | Přidat větev `locale === 'uk' ? <StatistikyUk /> : (…cs/sk beze změny…)` | `Astro.locals.locale` |
| UK komponenta | `src/components/statistiky/StatistikyUk.astro` (nový) | Render uk sekcí; `useTranslations('uk')`; žádné větvení | `statistiky-uk.ts`, `agro-stats-uk.json` |
| UK helper | `src/lib/statistiky-uk.ts` (nový) | Typy (`StatistikyUkData` ad.) + čistá chart-math (`buildLineChart`, growth %) | — (čistý, sync, unit-testovatelný) |
| UK data | `src/data/agro-stats-uk.json` (nový) | Grounded data velké čtyřky + bigNumbers + export podíl + warCaveat + sources | — |
| i18n | `src/i18n/ui/uk.ts` (edit) | Klíče `stat.uk.*` (chrome stránky) | — |
| Launch | `src/i18n/utils.ts` (edit) | Přidat `/statistiky` do `LAUNCHED_PREFIXES.uk` — **POSLEDNÍ task** | — |

**Nepoužité cs komponenty:** `HexMap.astro` (hardcoded CZ geometrie, 13 hexů + CZ kraje), `CommodityChart`, `PriceScissors`, `InputsBlock`, `LivestockSlope` — kódují cs-trh specifika. `agro-derived.ts` se **nedotýká**.

## Datový model — `src/data/agro-stats-uk.json`

Každá volatilní série povinně nese `source` + `asOf` + `url`.

```jsonc
{
  "generated": "2026-06-17",
  "warCaveat": "<UA text: data zahrnují/nezahrnují okupovaná území; válka od 2022 ovlivnila sklizeň i export>",
  "bigNumbers": [
    // hero KPI = signature světová pozice UA; každý se zdrojem
    { "label": "<UA>", "value": "<…>", "unit": "<…>", "sub": "<UA kontext>",
      "source": "<USDA FAS PSD | FAO | World Bank>", "asOf": "<rok/období>", "url": "<plné URL>" }
  ],
  "crops": [
    // přesně velká čtyřka: psenice, kukurice, slunecnice, jecmen
    {
      "slug": "psenice",
      "name": "<UA: Пшениця>",
      "production": { "unit": "млн т", "asOf": "<…>", "source": "<…>", "url": "<…>",
                      "max": 0, "ticks": [0], "series": [{ "year": 2015, "value": 0 }] },
      "area":       { "unit": "млн га", "asOf": "<…>", "source": "<…>", "url": "<…>",
                      "max": 0, "ticks": [0], "series": [{ "year": 2015, "value": 0 }] },
      "note": "<UA: krátká grounded próza k plodině, 1–2 věty>"
    }
    // … kukurice, slunecnice, jecmen
  ],
  "exportShare": {
    // podíl UA na světovém exportu — jádro „obilnice" příběhu
    "unit": "% світового експорту",
    "asOf": "<…>", "source": "<USDA FAS PSD>", "url": "<…>",
    "items": [ { "crop": "slunecnice", "label": "<UA>", "pct": 0 } /* … big four */ ]
  },
  "facts": [ { "text": "<UA>", "source": "<…>", "asOf": "<…>", "url": "<…>" } ],
  "sources": [ { "label": "USDA FAS PSD Online", "url": "https://apps.fas.usda.gov/psdonline/" } ]
}
```

**Pozn.:** přesný tvar `production`/`area` série (`max`/`ticks`/`series`) kopíruje `PudaUkSeries` z `puda-uk.ts`, aby `buildLineChart` math byla sdílitelná/identická. `slug` plodiny je stabilní (latinkový), `name` je UA řetězec.

## Sekce stránky — `StatistikyUk.astro`

1. **Hero** — titulek + lead (UA jako světová obilnice).
2. **Big numbers** — řada world-rank KPI (každý se `source`+`asOf`).
3. **War caveat** — banner z `warCaveat`.
4. **Bloky velké čtyřky** — pro každou plodinu: line chart produkce (mil. t) + line chart plochy (mil. ha), ~10 let, + krátká grounded próza (`note`).
5. **Export & světový podíl** — z `exportShare` (vizualizace podílu UA na světovém exportu).
6. **Zdroje & metodika** — všechny `sources` + viditelné `asOf` u sérií.
7. **Bottom CTA + cross-linky** — na `/uk/puda`, `/uk/slovnik` (přes `localizeInternalHref('uk', …)` / `localizePath`).

XSS/escaping: data jsou statický typovaný JSON renderovaný Astrem (auto-escape) — žádný `set:html` na uživatelských datech.

## Grounding & verifikační brána

Po sestavení `agro-stats-uk.json` **samostatná DATA verifikační brána** (jako 4b):
- Adversariální ověření (opus + web): **každé číslo** musí mít `source` + `asOf` + `url`.
- Cross-check primárních zdrojů: **USDA FAS PSD** vs **FAO/FAOSTAT** (a World Bank), neshody vyřešit nebo označit.
- Roky zasažené válkou (2022+) explicitně okomentované (warCaveat + per-série pozn. kde relevantní).
- Doplňkové zdroje: Держстат (UA stat. úřad), KSE Institute.
- Žádné odhady bez zdroje; pokud číslo nelze ozdrojovat → vynechat, ne hádat.

Primární jurisdikce/publikum = Ukrajinci v UA → UA jazyk (MSA/ukrajinština), UA kontext.

## Testy

- **`tests/lib/statistiky-uk-lib.test.ts`** — chart-math (`buildLineChart` body/path, growth %) — čisté unit testy à la `puda-uk-lib.test.ts`.
- **`tests/lib/statistiky-uk-data.test.ts`** — struktura `agro-stats-uk.json`: velká čtyřka přítomná (4 plodiny, správné slugy), **každá volatilní série (`production`, `area`, `exportShare`, `bigNumbers`, `facts`) má neprázdné `source`+`asOf`+`url`**, série neprázdné a roky vzestupně.
- **cs/sk byte-identita** — parita test (à la `puda-uk-parity.test.ts`), že cs/sk render `/statistiky` se nezměnil (uk větev je aditivní).

Baseline: `npx vitest run` má **3 pre-existing fail** (`tests/i18n/nav.test.ts` bazar) = NE regrese. Node 22.

## Prostředí

- Worktree `~/agro-svet-uk-faze4c-statistiky`, větev `feat/uk-faze4c-statistiky` (z `master` `61e4703`). `.env` zkopírován.
- Node 22 (`source ~/.nvm/nvm.sh && nvm use 22`) před každým build/test.
- Před smoke `pkill -f 'dist/server/entry'`; lokální server `PORT=… node --env-file=.env dist/server/entry.mjs`.
- Coolify deploy na push do master; CI „Workers Builds" fail = ignorovat (stale).
- ⚠️ Preview live sitemap: `set -a; . ./.env; set +a` před `npm run preview`.
- ⚠️ **RECONCILE PŘED MERGEM:** reconcile s `origin/master` (track se vyvíjí); čekej konflikty v `utils.ts` `LAUNCHED_PREFIXES`, `ui/uk.ts`, sdílených helperech.

## Přenositelné lekce (4a + 4b) — dodržet

- Assemble velkých dat TS skriptem `str.replace`, NE `re.sub`.
- `useTranslations`/`tf` locale jako PRVNÍ parametr.
- auto-linker NENÍ pro uk text (cs-rooted odkazy → leak); uk text stejně nematchuje cs trigger-termíny.
- CS výstup byte-identický; launch prefix POSLEDNÍ; sitemap + hreflang auto dle cs slugů.
- UK hub IZOLOVÁN do vlastní komponenty (ne N-tá větev v 652ř. `index.astro`) = chrání byte-identitu.

## Mimo scope (YAGNI)

- Žádné ceny komodit / PHM / hnojiva / cenové nůžky pro uk.
- Žádný krajský hexmap (CZ geometrie).
- Žádné `stats:refresh:uk` build skripty pro auto-fetch (data ručně sestavená + verifikovaná; evergreen → nízká frekvence aktualizace).
- LangSwitcher přepínač pro uk = samostatné, dosud nerozhodnuté (mimo tuto fázi).
