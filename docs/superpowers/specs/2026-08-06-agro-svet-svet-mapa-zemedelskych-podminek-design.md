# Mapa zemědělských podmínek Evropy — design

**Datum:** 2026-08-06
**Projekt:** agro-svet.cz
**Status:** návrh k odsouhlasení

## Cíl

Interaktivní choropleth mapa Evropy, kde uživatel přepíná metriky (dotace/ceny/struktura),
najetím vidí tooltip, kliknutím zoom + panel s pořadím a srovnáním s EU průměrem, a proklikem
se dostane na detail země. Mapa je vizuální vstupní vrstva nad **existující sekcí `/svet`**
(32 zemí, datový engine Eurostat/World Bank) — ne greenfield.

Vizuální/interakční laťka je odsouhlasena na mockupu `map-geo-v3.html`
(`.superpowers/brainstorm/`): reálná geografická mapa, přepínač 6 metrik, zoom na zemi,
tooltip u kurzoru, auto-insight věta, sparkline trend, značky na legendě (EU Ø + vybraná země),
skupiny metrik, **přepínač měny CZK/EUR (default CZK)**.

## Non-goals (fáze 1)

- ŽÁDNÁ prozaická legislativa / „výhody" / dotační programy per země (YMYL → fáze 2, human-verified).
- ŽÁDNÝ MapLibre / mapové dlaždice (inline SVG stačí, žádné CSP/tiles).
- ŽÁDNÝ svět mimo Evropu (fáze 3).
- i18n sk/uk/pl až fáze 2 (F1 = cs; hodnoty jsou číselné, přeloží se jen labely).

## Architektura

### Komponenta `AgriMap` (Svelte island)
- Inline SVG choropleth, client-side. Vstup: `europe.json` (geometrie) + `map-metrics.json` (data).
- Přepínač metrik (skupiny Podpory / Ekonomika / Struktura), **přepínač měny CZK/EUR**,
  zoom na kliknutou zemi (transform na `<g>`), tooltip, panel (pořadí, srovnání s EU Ø, sparkline).
- Barvy choropletu = sekvenční zelená škála přes min–max aktivní metriky. Chybějící data = šedá.
- Klik na zemi → zoom na zemi + panel; proklik CTA → `/svet/<slug>`.

**Layout & interakce (dle schváleného mockupu `map-geo-v6.html` v `.superpowers/brainstorm/`):**
- **Dashboard na jednu obrazovku** (bez scrollu stránky): kompaktní hlavička → řada „měna + metriky" → insight → `stage` (mapa | panel 320px) vyplní zbytek výšky. Skoro plná šířka (max ~1760px, boční gutter ~48px).
- **Zoom/pan mapy**: kolečko (zoom k kurzoru), tažení = pan, tlačítka ＋/− a ⤢ reset; klik na zemi = plynulý zoom na ni (tažení neotevře detail).
- **Přepínač měny** CZK/EUR (default CZK) mění jen zobrazená čísla+jednotky (barvy/pořadí beze změny).
- **Panel**: vlajka, region, pořadí („14. z 27"), u každé metriky hodnota + %vs EU Ø + poziční proužek + sparkline; CTA na detail.
- **Legenda**: gradient min–max + značky EU Ø a vybrané země. **Auto-insight věta** nad mapou (kdo vede, poměr, pozice ČR).
- Reálná geometrie z `army-svet/public/borders/ad2010.json` (Mercator), popisky hodnot na velkých zemích.

### Geometrie `src/data/svet/geo/europe.json`
- Jednorázově vygenerovaná z `army-svet/public/borders/ad2010.json` (moderní hranice, `properties.n` = EN název).
- Skript `scripts/build-svet-geo.mjs`: filtr ~31 evropských zemí, Mercator projekce do viewBoxu,
  simplifikace (drop malých ostrovů, redukce bodů), centroidy pro popisky. Commitnuto (statické).
- Mapování EN název → `{code, slug}` (slug = existující `/svet/<slug>`).

### Umístění
- Nová stránka **`/svet/mapa/`** (hub s komponentou + metodika/zdroje). Prolink z `/svet/` a `/data/`.

## Data

### Nové metriky (rozšíření `scripts/lib/svet/indicators.mjs`)
| Metrika | Zdroj | Poznámka |
|---|---|---|
| Cena zeměd. půdy €/ha | Eurostat `apri_ap_aland` | auto |
| Pachtovné €/ha·rok | Eurostat `apri_ap_arent` | auto |
| Průměrná velikost farmy (ha UAA/holding) | Eurostat Farm Structure (`ef_*`) | auto |
| Podíl farmářů <35 let (%) | Eurostat `ef_m_farmang` | auto |
| Průměrná zeměd. mzda | Eurostat/WB (přesný dataset ověřit při implementaci) | auto\* |
| **CAP přímé platby €/ha** | kurátorská `src/data/svet/cap-payments.json` (DG AGRI) | **ruční, human-verified** |

\* Přesné dataset kódy a jednotky se ověří proti Eurostat API v implementaci; engine už umí Eurostat + World Bank fetch.

### Build pipeline
- Rozšířený build enginu vygeneruje pro každou zemi hodnoty + 10letou řadu (pro sparkline)
  a zapíše je do stávajících `src/data/svet/<slug>.json`.
- Nový agregační krok vytvoří kompaktní **`src/data/svet/map-metrics.json`**:
  `{ [code]: { slug, name, region, centroid, metrics: { cap:{latest, series[]}, ... } } }`.
  Komponenta načítá jen tento soubor (ne 32 velkých JSONů).

### Měna (currency)
- Metriky mají flag `currency: true` (cap, land, rent, wage) vs `false` (size, age).
- Hodnoty se ukládají v **EUR** (kanonicky). Převod na CZK je **prezentační**, na klientu:
  `czk = round(eur * RATE)`. `RATE` v configu (F1 statická ~25,3; pozdější napojení na kurz ČNB).
- Přepínač CZK/EUR, **default CZK**. Přepnutí měny mění jen zobrazená čísla + jednotky
  (`€/ha`→`Kč/ha`, `€/měs`→`Kč/měs`); barvy/pozice/pořadí beze změny (převod je lineární).

## Napojení na detail `/svet/<země>`
- Nová sekce **„Podmínky a podpory"** v `src/pages/svet/[slug].astro` — renderuje nové metriky
  přes existující `IndicatorRow` (srovnání s ČR/EU Ø) + blok zdrojů/metodiky.
- Stejný přepínač měny (nebo respektuje volbu z mapy přes URL/localStorage — F1: lokální na stránce).

## Fázování
- **F1 (tento spec):** `/svet/mapa/` + `AgriMap` + 🟢 auto metriky + CAP kurátorská + integrace do `/svet/<země>` + CZK/EUR. cs. Jen čísla.
- **F2:** legislativní podmínky / výhody / dotační programy per země (próza, human-verified) + i18n sk/uk/pl.
- **F3:** rozšíření na svět (World Bank, širší geometrie).

## Testy
- Unit: build geometrie (projekce lon/lat→SVG, drop malých polygonů), join hodnot (kód↔slug), chybějící data → šedá.
- Snapshot: klíče `map-metrics.json` (struktura, přítomnost 6 metrik).
- Render: komponenta zobrazí N zemí, přepínač metrik přebarví, přepínač měny změní jednotky, klik → správný `/svet/<slug>` odkaz.

## Rizika
- **YMYL:** CAP platby a (F2) legislativa musí být human-verified; AI jen kostra. Uvádět zdroj + datum revize (E-E-A-T).
- **Dostupnost dat:** ne všechny země mají všechny Eurostat metriky (UK/CH/NO/UA mimo EU) → chybějící = šedá, ne dopočítávat.
- **Kurz CZK:** F1 statická sazba → uvést „orientační přepočet, kurz k DD.MM.".

## Soubory (nové/změněné)
- `src/data/svet/geo/europe.json` (nový, geometrie)
- `src/data/svet/cap-payments.json` (nový, kurátorská CAP data)
- `src/data/svet/map-metrics.json` (nový, generovaný)
- `scripts/build-svet-geo.mjs` (nový)
- `scripts/lib/svet/indicators.mjs` (rozšíření o metriky)
- `src/components/AgriMap.svelte` (nový)
- `src/pages/svet/mapa/index.astro` (nový)
- `src/pages/svet/[slug].astro` (sekce „Podmínky a podpory")
