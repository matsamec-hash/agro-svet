# Svět: data zemědělství cizích zemí — design

**Datum:** 2026-06-19
**Větev:** `feat/svet-data-zemi`
**Stav:** schváleno k plánování

## Cíl

Přidat na agro-svet.cz novou datovou sekci, kde český čtenář vidí **zemědělská data
cizích zemí** (nejdřív Německo, Francie, Velká Británie → zbytek Evropy → USA), v češtině,
s pozdějším překlopením do dalších jazyků (sk/uk/pl). Dva pohledy: **bohaté profily zemí**
a **srovnávač napříč zeměmi**. Maximální důraz na (1) získání dat a (2) jejich zobrazení.

Tohle je vědomá náprava slabé UK verze (`agro-stats-uk.json` apod.), která byla tenká,
ručně psaná, nesrovnatelná a obsahovala chyby. Tady jdeme přes **pipeline z oficiálních
API** s verifikací.

## Klíčová rozhodnutí (z brainstormingu)

| Rozhodnutí | Volba |
|---|---|
| Rámec | Profily zemí **i** srovnávač |
| Datový engine | **Pipeline z oficiálních API** (ne ruční kurátorství) |
| Datový rozsah | Všechny 4 balíčky (produkce, půda/struktura, ekonomika+SZP, obchod+ceny+udržitelnost) |
| Zobrazení profilu | Hybrid: kostra **Dashboard (A)** + u každého ukazatele proužek **vs ČR (C)** + krátký příběhový úvod **(B)** |
| URL základ | `/svet/` |
| Srovnatelnost GB/USA | Primárně **FAOSTAT** (harmonizace); národní zdroj (DEFRA/USDA) pro bohatší headline čísla, vždy uveden zdroj |
| Jazyk | Čeština první, i18n-ready; flip do dalších jazyků později |

## Informační architektura

- `/svet/` — rozcestník: mřížka/mapa zemí + vstup do srovnávače.
- `/svet/<slug>/` — profil země. Slugy česky: `nemecko`, `francie`, `velka-britanie`, `usa`, `polsko`, …
- `/svet/srovnani/` — srovnávač napříč zeměmi.
- Nová položka v hlavičce: **„Svět"**.
- Sitemap + hreflang + canonical dle zavedeného vzoru sekcí.
- Sekce je oddělená od českých `/statistiky` (ty zůstávají beze změny).

## Datový engine

Build-time pipeline (`npm run data:world`, příp. dílčí kroky), která **stáhne data
z otevřených API a zapeče je do JSON**. Žádné ruční opisování hodnot.

Zdroje:
- **Eurostat** (JSON-stat, bez klíče; rozšíření stávajícího `src/lib/eurostat.ts`) =
  harmonizovaná páteř pro celou Evropu → data jsou mezi zeměmi **srovnatelná**.
  Datové sady mj.: `apro_cpsh*` (plodiny: plocha/výnos/produkce), `apro_mt_*`
  (zvířata, mléko, maso), `ef_*` (struktura farem), `aact_eaa*` (ekonomické účty),
  `apri_*` (ceny), organic/udržitelnost.
- **FAOSTAT** = globální parita + kam Eurostat nedosáhne (GB po brexitu, USA, soběstačnost).
- **USDA** (NASS / FAS PSD) = USA + světový obchod.
- **DEFRA** = doplněk pro GB headline čísla.

Reference period: u každé hodnoty se ukládá **období dat** (rok/MR), ne datum stažení.

### Schéma hodnoty (každý datový bod)

```
{
  value: number,
  unit: string,            // "t/ha", "mil. ha", "mld €", "1000 ks", ...
  referencePeriod: string, // "2024", "MR 2024/25"
  source: string,          // "Eurostat", "FAOSTAT", "USDA FAS PSD", "DEFRA"
  sourceUrl: string,
  fetchedAt: string        // ISO datum stažení
}
```

### Verifikační brána

Po stažení proběhne **adversariální kontrola** (subagent): ověří řády, jednotky a
hodnoty proti zdroji; označí podezřelé. Cílem je nepustit ven chybu jako u UK.
Žádná hodnota bez `source` + `sourceUrl` + `referencePeriod`.

## Datový model

Společné schéma pro všechny země. **Per-country soubory** (`src/data/svet/<slug>.json`,
např. `nemecko.json`) kvůli čistým git-diffům a inkrementálnímu refreshi; navrch
generovaný odlehčený `svet/index.json` (poslední hodnoty všech zemí) pro srovnávač.
Profil i srovnávač čtou stejné schéma. Indikátory ve 4 balíčcích:

1. **Produkce** — plodiny (pšenice, kukuřice, ječmen, řepka/slunečnice, brambory,
   cukrovka): plocha/výnos/produkce; zvířata (skot, prasata, drůbež, ovce), mléko, maso.
2. **Půda a struktura farem** — využívaná zem. plocha, orná/louky/trvalé kultury,
   počet a průměrná velikost farem, podíl eko zemědělství.
3. **Ekonomika, příjmy + dotace/SZP** — hodnota produkce, přidaná hodnota, zem. příjem,
   podíl na HDP, zaměstnanost; platby SZP / přímé platby na ha (USA: Farm Bill).
4. **Obchod, ceny + udržitelnost** — agrární export/import, soběstačnost; ceny produktů
   a vstupů; spotřeba hnojiv/pesticidů, emise, závlahy.

Každý indikátor nese **časovou řadu** (pro trendy) i poslední hodnotu.

## Profil země — zobrazení (hybrid A+C+B)

- **Hero:** vlajka, název, 1–2větný ozdrojovaný úvod, 3–4 headline KPI dlaždice
  (plocha, hodnota produkce, počet farem, pozice v EU).
- **Sekce po balíčcích (kostra Dashboard A):** KPI mřížka + grafy trendů.
- **U každého ukazatele malý proužek „vs ČR" (C):** okamžité srovnání s Českem.
- **Krátký příběhový úvod sekce (B):** generovaný z dat, kontrolovaný stylem
  `czech-ag-article-style`; žádná nepodložená tvrzení nad rámec dat.
- **Tabulky** plodin/zvířat s výnosy.
- **Blok zdrojů** dole: seznam zdrojů + reference period.

## Srovnávač (`/svet/srovnani/`)

- **Chipy zemí** (multi-výběr, ČR vždy referenční) + **výběr ukazatele**.
- Přepínač **Trend v čase** (multi-line) / **Žebříček** (bary za poslední rok).
- Tabulka s hodnotou + **odchylkou vs ČR**.
- Předrenderované (funguje bez JS), interaktivita jako progresivní obohacení.
- Zdroj u každé tabulky/grafu.

## Jazyky

Stavět **česky první**, ale i18n-ready: data jsou jazykově neutrální (čísla, kódy);
lokalizují se jen labely a próza. Flip do sk/uk/pl stejným vzorem jako stávající
lokalizace (`localizeInternalHref`, launched-prefixy, hreflang).

## Fáze

1. **Engine + verifikace + profily DE/FR/GB + srovnávač (cs).**
2. Zbytek Evropy (EU-27 + klíčové).
3. USA.
4. Překlopení do dalších jazyků.

## Testování

- Pipeline: testy parsování JSON-stat (Eurostat) + mapování indikátorů + jednotky.
- Schéma: každý datový bod má povinná pole (source/url/referencePeriod).
- Stránky: profil i srovnávač 200, canonical/hreflang/sitemap, žádný cs leak při flipu.
- Regrese: české `/statistiky` a ostatní sekce byte-identické.

## Mimo rozsah (YAGNI)

- Žádné živé API volání za běhu (jen build-time → statické JSON).
- Žádná uživatelská personalizace / ukládání srovnání.
- Žádné ruční narativy s fakty mimo data (próza jen interpretuje stažená data).
