# Data hub — rozcestníková stránka `/data/`

**Datum:** 2026-07-21 · **Branch:** `feat/data-hub`

## Cíl
Sekce „Data" dnes v top-menu míří rovnou na `/statistiky/` (hustá komoditní
stránka), 7 plochých položek dropdownu bez hierarchie, „Kalkulačka CAP" je
duplicita dítěte `/kalkulacka/`. Vytvořit **samostatný rozcestník `/data/`**,
který logicky člení celou datovou sekci a zároveň „ohromí a zabaví" (živá data,
interaktivní hero graf, fotodlaždice).

## IA / routing
- **Nová routa** `src/pages/data/index.astro`. `/statistiky/` se NEHÝBE (drží SEO).
- `src/i18n/nav.ts`: `data` sekce href `/statistiky/` → `/data/`.
- 3 logické clustery:
  - **01 Živá data — Česko:** Trhy a komodity `/statistiky/` · Zemědělská půda `/puda/`
  - **02 Svět:** Profily zemí `/svet/` · Srovnání zemí `/svet/srovnani/`
  - **03 Nástroje & dotace:** Kalkulačky & CAP `/kalkulacka/` (featured) · Dotace `/dotace/`
  - (CAP sloučen do „Kalkulačky" — je to jeho dítě; ticker/chip na CAP zůstává jako rychlý vstup.)

## Layout (schválený design v12)
1. **Tmavý hero** (ink bg, žlutý highlight): eyebrow „Datová sekce · živě", H1
   „Data o českém **zemědělství**", lede, 3 staty (datasetů / zemí / let historie)
   + **interaktivní graf komodit** vpravo.
   - Graf: ◀ ▶ přepínač komodit + tečky; **hover = crosshair + tooltip s cenou
     ke konkrétnímu datu**. Data z `commodityFull` (posledních ~24 měsíců).
     Vanilla SVG + JS (lehké; ne Chart.js, ať hero nezávisí na CDN).
2. **Žlutý běžící ticker** (marquee) — `commodityStats` + Nafta z `latestFuels`;
   položky klikací → detail komodity (v1: kotva na `/statistiky/#trh`).
3. **Sticky světlé chipy „Skočit na"** — 7 rychlých odkazů, jeden řádek
   (na úzkém okně horizontální scroll).
4. **Světlý obsah** — 3 clustery, **velké fotodlaždice** (min-height ~320):
   full-bleed webp foto + gradientový překryv (čitelnost), skleněná ikona + šipka,
   nadpis, popis „co tam najdou", 1 živý statpill. Featured CAP = plná žlutá bez fota.
   - Efekty: zoom fota při hoveru, zvednutí+stín, žlutá šipka. `prefers-reduced-motion` respektováno.

## Data (bez nové infry — `src/data/agro-stats.json`)
- Hero staty: `datasetCount` (počet neprázdných bloků), roky z `commodityFull`, zemí = konst. (svet).
- Hero graf: `commodityFull` (9 komodit, řady `{label,value}`).
- Ticker + statpilly: `commodityStats` (`name,unit,price,change`) + `latestFuels` (Nafta).
- Půda tile: neuvádět fake Kč/m² (v agro-stats není) → ghost „regionální data".

## Fotky
`public/images/data-hub/*__v-w{800,1200}.webp` (5 ks, Unsplash license, převedeno cwebp).
Trhy→pšenice · Půda→pole shora · Profily→horská krajina · Srovnání→dvě pole · Dotace→sazenice.

## i18n / locale gating
- cs/sk plné (obě mají agro-stats). Stringy přes `useTranslations` + nové `data.hub.*` klíče (cs/sk povinné).
- Non-cs: clustery/dlaždice, jejichž cíl není launchnutý pro locale (`isLaunchedPath`), skrýt — stejný princip jako homepage-hub.

## Mimo rozsah (follow-up)
- Dedikovaný detail komodity `/statistiky/komodita/[slug]` (v1 = kotva na graf).
- uk/pl plný překlad hub obsahu.

## Ověření
`npm run build` musí projít. Vizuál = mockup `.superpowers/brainstorm/.../data-hub-v12.html`.
