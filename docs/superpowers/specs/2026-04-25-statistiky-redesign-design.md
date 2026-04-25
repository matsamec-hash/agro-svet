# Statistiky redesign — Design spec

**Datum:** 2026-04-25
**Stránka:** `/statistiky/` ([src/pages/statistiky/index.astro](../../../src/pages/statistiky/index.astro))
**Status:** Approved structure & visual patterns; ready for implementation plan

---

## 1. Motivace

Současná stránka je generický Chart.js dashboard s problémy:

1. **Hierarchie informací převrácená** — interaktivní mapa krajů (drill-down dataset) je jako první sekce, vstupní náklady (hnojiva, nafta — kritické pro farmáře) jsou skryté za "Zobrazit další statistiky"
2. **Datový dump bez příběhu** — nula cross-data insightů (marže, cenové nůžky), žádný TLDR, žádné historické anotace v grafech, žádný 5letý průměr jako reference
3. **Nevyužitá data** — `getCommodityPrices()` ([src/lib/czso.ts](../../../src/lib/czso.ts)) vrací kompletní historickou řadu, ale stránka používá jen posledních 18 měsíců. Z 9 komodit má graf jen 4. Stavy zvířat jen jako kartičky bez trendu, přitom je v datech dramatický 35letý pokles.
4. **Vizuál bez identity** — zelená `#22a355` + plain Chart.js → vypadá jak intranet BI tool. Cream/žluto-černý design jazyk z [src/components/stroje/CategoryBrowse.astro](../../../src/components/stroje/CategoryBrowse.astro) (`--yellow:#FFEA00`, Chakra Petch, sticky pills, hero photo) je k dispozici, ale nepoužitý.
5. **Choropleth fail** — pro 14 krajů choropleth s absolutními tunami selhává: Vysočina vždy vizuálně dominuje, Praha mizí.

Cíl: přeměnit stránku z "data dump" na **focused, story-driven business intelligence stránku** ve stylu Our World in Data / FT visual journalism, s designovým jazykem `CategoryBrowse`.

---

## 2. Cílovka & use cases

- **Zemědělec / agro-podnikatel** — chce vidět ceny komodit (kolik dostanu za pšenici), vstupní náklady (kolik mě stojí hnojiva, nafta), vlastní region
- **Novinář** — potřebuje TLDR ("Co data dnes říkají") + kontext (vs. 5letý průměr, vs. válečný šok 2022) pro článek
- **Vědec / student** — chce historickou řadu, regionální data, exportovatelný zdroj
- **Casual visitor (SEO landing)** — wow vizuál, který zůstane v paměti a vede ke sdílení

---

## 3. Architektura — struktura stránky

```
1. HERO                          — tmavý + žluté akcenty + fotka, hero stats badge
2. STICKY TICKER (sparkline)     — 5 metrik s mini-sparkliny (12M)
3. CO DNES ŘÍKAJÍ DATA           — 3 auto-takeaway karty (TLDR pro novináře)
   ── sticky pills nav: Trh · Vstupy · Produkce · Regiony · Zvířata · Příběhy ──
4. TRH — Ceny komodit            — annotated long-term line chart (9 komodit, 4 historické anotace)
5. VSTUPY — PHM + hnojiva        — týdenní nafta + roční hnojiva + ⭐ cenové nůžky scatterplot
6. PRODUKCE — sklizeň + plochy   — small multiples per plodina + osevní plochy donut
7. REGIONY — hex mapa            — 14 hexů stejné velikosti + brushable timeline
8. ZVÍŘATA — slope chart         — historická řada (1990 nebo nejstarší dostupné), 2 anotace
9. PŘÍBĚHY — 3 explainer karty   — anchor odkazy na narativní subsekce
10. METODOLOGIE                  — zdroje, datum aktualizace, atribuce ČSÚ
11. CTA dole                     — "Sledujte také katalog techniky / bazar"
```

**Klíčové změny vs. aktuální stav:**
- ❌ Sekce "Zobrazit další statistiky" expand → odstraněno, vše scrollovatelné
- ⬇️ Mapa krajů: ze sekce 1 → sekce 7
- ⬆️ Vstupní náklady (hnojiva, nafta): z hidden → sekce 5 (vedle sebe + cenové nůžky)
- ➕ Hero, Sparkline ticker, Auto-takeaway, Cenové nůžky, Příběhy

---

## 4. Klíčové vizualizace (specifikace patternů)

### 4.1 Hero (sekce 1)

**Layout:** grid 1.35fr / 1fr (jako traktory). Levá strana — kicker badge `LIVE DATA · ČESKÁ ZEMĚDĚLSKÁ DATA`, h1 "Co stojí české zemědělství" (slovo "zemědělství" jako `<em>` žlutě), lede paragraph, 3 hero-stats (`28 datasetů` / `14 let` / `14 krajů`). Pravá strana — fotka pole (preferenčně reuse existující agro fotky z `/public/images/`; ověřit dostupné soubory v implementační fázi a vybrat nejvhodnější — fallback `/images/traktor.webp` pokud nic vhodnějšího neexistuje) s overlay badge "Aktualizováno [datum]".

**Reuse:** `.kicker`, `.hero h1 em`, `.hero-stats`, `.hero-photo`, `.hero-photo-badge` z `CategoryBrowse.astro`.

### 4.2 Sticky sparkline ticker (sekce 2)

**Layout:** horizontální flex 5 karet, sticky pod hero (sticky position po scrollu). Karta:
```
┌────────────┐
│ Pšenice    │ ← name
│ 5 240      │ ← price (Chakra Petch 22px bold)
│ Kč/t       │ ← unit
│ ▲ +4.2%    │ ← delta vs. minulý měsíc (zelená/červená)
│ ╱╲╱╲╱╲╱╲╱╲ │ ← mini SVG sparkline (12 měsíců, žlutá linka)
└────────────┘
```

**Metriky:** Pšenice, Řepka, Mléko, Nafta, NPK 15-15-15.

**Sparkline:** custom inline SVG, 5px stroke žlutá, **bez axes/labels**. Šířka 100% karty, výška 24px.

**Klik na kartu** = anchor scroll na detail v sekci Trh / Vstupy.

**Reuse:** `.kicker`-like styling, `.split-bar` sticky pattern (backdrop-filter blur 14px) z `CategoryBrowse`.

### 4.3 Auto-takeaway karty (sekce 3)

**Layout:** 3 karty grid (1fr 1fr 1fr), každá:
```
┌──────────────────┐
│ 📈 TRH           │ ← kategorie
│ Pšenice +4.2%   │ ← hlavní zjištění
│ m/m, nejvíc      │
│ od března 2022.  │
│                  │
│ Detail →         │ ← anchor link
└──────────────────┘
```

**Logika generování (Astro frontmatter):**
1. **Trh card:** najít komoditu s největší meziměsíční změnou; pokud `|change| > 3%`, popsat jako "X +Y%, nejvíc/nejmíň od [datum z historických dat kdy bylo |change| větší]"
2. **Vstupy card:** porovnat současnou cenu nejdražšího hnojiva vs. cena 2019 (před-covid). Vzorec: `((latest / 2019) - 1) * 100`
3. **Zvířata card:** detekce milníku — pokud poslední hodnota stavu prolomila psychologickou hranici (např. < 1.3M skotu), popsat jako "Skot pod 1.3M poprvé od [rok]"

Pokud žádná card nesplňuje threshold, fallback na pevný text — např. "Pšenice: aktuální cena 5 240 Kč/t (kontextový text)".

**Karty mají kategoriální barevný akcent** (border-left): trh = žlutá, vstupy = červenavá `#C24414`, zvířata = zelená `#0B7A3B`.

### 4.4 Annotated long-term line chart (sekce 4 — Trh) ⭐

**Layout:** plnošířkový graf (Chart.js).

**Funkcionalita:**
- **Pills přepínač** komodit (9 možností): Pšenice / Ječmen / Řepka / Kukuřice / Mléko / Vepřové / Hovězí / Vejce / Mák (přesný seznam z `COMMODITY_MAP` v [src/lib/czso.ts](../../../src/lib/czso.ts))
- **Časový přepínač:** `1Y` / `5Y` / `Vše`
- **Anotace** na konkrétních datech (Chart.js plugin `chartjs-plugin-annotation` nebo manuální drawing v `afterDraw` hook). Hardcoded events array v [src/data/agro-events.ts](../../../src/data/agro-events.ts) (nový soubor):
  ```
  { date: '2014-08', label: 'Ruské embargo' }
  { date: '2020-03', label: 'COVID-19' }
  { date: '2022-02', label: 'Invaze na Ukrajinu' }
  { date: '2024-08', label: 'Sucho v jižní Moravě' }
  ```
- **5letý průměr jako reference** — light gray pásmo (band) na pozadí grafu (Chart.js dataset typu line s nižší opacitou + fill: 'between'). **Rolling** 5letý průměr: pro každý měsíc M v zobrazené řadě průměr 60 měsíců předcházejících M. Vypočteno z `getCommodityPrices()` (existující funkce, vrací plnou historii). Zobrazit jen tam, kde je k dispozici 60+ měsíců dat — jinak skrýt linku.

**Insight pod grafem (auto-generated text):**
- "Aktuálně **+3.2 %** vs. 5letý průměr"
- "Min. za posledních 5 let: 4 100 Kč/t (březen 2020)"

### 4.5 Cenové nůžky — connected scatterplot (sekce 5) ⭐⭐ HLAVNÍ WOW

**Pattern:** Chart.js scatter type s `showLine: true` (connected scatter).

**Data:**
- **X axis:** Index cen vstupů (váhový průměr nafty + NPK 15-15-15, base 100 = 2015)
- **Y axis:** Index cen výstupů (váhový průměr 4 hlavních komodit: pšenice, ječmen, řepka, kukuřice; base 100 = 2015)
- **Body:** roční hodnoty 2015 → současnost
- **Spojnice:** chronologická čára mezi body (žlutá `#FFEA00`)
- **Body anotované rokem** vedle bodu

**Diagonála:** šedá pomocná čára y=x ("rovnováha")

**Insight pod grafem:**
> "Když křivka uhne dolů-doprava, marže se zužuje. V 2022 vstupy +120 %, výstupy +95 % → marže -15 %."

(Vypočteno z dat, šablona)

**Datová pre-processing:** v Astro frontmatteru:
1. Vytáhnout roční průměry z `getCommodityPrices()` a `getFertilizerTimeSeries()` + roční průměry z `getFuelPrices()`
2. Spočítat indexy s base year 2015 (= 100)
3. Vytvořit array `{x, y, year}[]`

### 4.6 Hex mapa krajů (sekce 7)

**Layout:** custom SVG, 14 hexů s pevnou geometrií (souřadnice manuálně, geo-rough). Náhrada za choropleth.

**Hex pozice (přibližná geografie ČR):**
```
                  Liberecký   Královéhrad.
        Ústecký                         
                  Středočeský           Pardubický  
   Karlovarský               Praha
                                      Olomoucký   Moravskoslezský
        Plzeňský       Vysočina                    
                                  Jihomoravský    Zlínský
              Jihočeský
```

**Obsah hexu (uvnitř):**
```
┌────────────┐
│ Vysočina   │ ← název
│ 580 tis. t │ ← absolutní hodnota
│ 6.2 t/ha   │ ← výnos (efficiency)
│ ▬▬▬▬▬▬     │ ← mini bar (relativní pozice mezi kraji)
└────────────┘
```

**Barva:** výnos t/ha (žluto-zelená škála — světle žlutá až tmavě zelená `#0B7A3B`)

**Pills přepínač plodin** — stejně jako teď (Obiloviny / Pšenice / Ječmen / Řepka / Brambory / Cukrovka / Kukuřice).

**Brushable timeline pod mapou:**
- Tenký pruh s years (2010–2024)
- Drag handle pro výběr roku → mapa se animovaně překreslí
- Default: nejnovější rok

**Detail panel napravo** (jako teď): klik na hex → seznam všech plodin pro daný kraj v daném roce + mini bar chart trendu.

**Implementace hex SVG:** vlastní inline SVG (viewBox, paths jako hexagony), žádná externí knihovna.

### 4.7 Slope chart zvířat (sekce 8)

**Layout:** Chart.js line chart, **dva trace** (Skot, Prasata, případně Drůbež pokud data).

**Data:** historická řada od **nejstarší dostupné CZSO data** (zkusit od 1990, fallback na nejstarší). Pokud `getLivestockStats()` nemá historická data, **rozšířit `czso.ts`** o novou funkci `getLivestockHistorical()` (jiný CZSO dataset, např. WZEM02BT01 nebo podobný — research v implementační fázi).

**Anotace:**
- 2004 — vstup ČR do EU
- 2015 — konec mléčných kvót
- (případně další z research)

**Insight pod grafem:**
> "Stav skotu klesl o 65 % od 1990. Prasata: -75 %."

(Vypočteno z dat.)

### 4.8 Sticky pills nav (mezi sekcemi 3 a 4)

**Vzor:** `.split-bar` z `CategoryBrowse.astro`.

**Pills:** Trh / Vstupy / Produkce / Regiony / Zvířata / Příběhy

**Active state** určen `IntersectionObserver` (viz `CategoryBrowse.astro` script).

**Sticky position:** `top: 88px` (pod globálním headerem stránky).

### 4.9 Příběhy sekce (sekce 9)

3 explainer karty (mřížka 3 sloupce). Každá:
- Velký nadpis (otázka)
- 1 odstavec s teaserem
- Mini graf nebo ikona
- Anchor link na konkrétní subsekci v stránce

**Karty:**
1. **„Cenové nůžky 2022–2025"** → anchor na sekci 5 (vstupy + scatter)
2. **„Mizející kráva: 35 let úbytku"** → anchor na sekci 8 (zvířata)
3. **„Které kraje krmí Česko?"** → anchor na sekci 7 (mapa)

### 4.10 CTA dole (sekce 11)

Reuse `.big-cta` z `CategoryBrowse.astro` (žlutý gradient, photo right side).

**Text:** „Hledáte techniku? Katalog traktorů a kombajnů." → CTA button na `/stroje/`.

(Konsistence s traktory stránkou — recip-ročně se odkazují.)

---

## 5. Design jazyk

**Reuse z [src/components/stroje/CategoryBrowse.astro](../../../src/components/stroje/CategoryBrowse.astro):**

```css
--yellow:        #FFEA00   /* primary accent — KPI, CTA, hover, sparkline */
--yellow-soft:   #FFF6A8   /* highlight backgrounds */
--yellow-glow:   rgba(255,234,0,.35)
--ink:           #0A0A0B   /* hero bg, headlines */
--body:          #1E1E22   /* body text */
--muted:         #6B6B72   /* labels, captions */
--muted-2:       #9A9AA3
--line:          #EAEAEC   /* subtle dividers */
--bg-cream:      #FBFAF4   /* page background */
--card:          #FFFFFF   /* chart containers */
--green:         #0B7A3B   /* positive deltas, "current" status */
--green-soft:    #E3F3EA
--red-warm:      #C24414   /* negative deltas (warm, not harsh #d63031) */

--r-xl: 24px (sekce)
--r-lg: 18px (karty grafů)
--r-md: 12px

--sh-1, --sh-2, --sh-3 (jako CategoryBrowse)
```

**Typografie:**
- `Chakra Petch` — h1, h2, KPI čísla, sekce nadpisy, pills, ticker hodnoty
- `Roboto Condensed` — tělo textu, popisky grafů, tooltipy, lede paragraphs

**Mikrointerakce:**
- Hover na ticker karty → `transform: translateY(-1px)` + `border-color: var(--yellow)`
- Sticky pills active state: žlutý fill při scrollu na sekci (IntersectionObserver pattern z `CategoryBrowse.astro:728-754`)
- Sparkline poslední bod: žlutý dot s `box-shadow` glow
- Anotace v grafech: jemný fade-in při viewport entry (nebo statické, pokud `prefers-reduced-motion`)

---

## 6. Datová vrstva — co rozšířit

### 6.1 V SCOPE — využít existující data lépe

- `getCommodityPrices()` — používat **plnou historickou řadu** pro 5letý průměr a rolling baseline (existující funkce, jen se nyní nepoužívá)
- `getCommodityTimeSeries(months)` — rozšířit defaultně na **60 měsíců** (5 let), pro pills přepínač 1Y/5Y/Vše
- `getFertilizerTimeSeries()` — již vrací 2011–2024, použít celou řadu

### 6.2 V SCOPE — nové derivované metriky (pure compute, žádný nový API call)

**Nový soubor [src/lib/agro-derived.ts](../../../src/lib/agro-derived.ts):**

```ts
export function priceScissors(commodities, fertilizers, fuels): { x, y, year }[]
export function fiveYearAverage(prices, currentDate): number
export function biggestMomChange(commodities): { commodity, change, monthsSinceLargerChange }
export function inputCostInflation(fertilizers, baseYear=2019): number
export function livestockMilestones(livestock): { animal, milestone, year }[]
```

### 6.3 V SCOPE — nový hardcoded data file

**[src/data/agro-events.ts](../../../src/data/agro-events.ts):**
```ts
export const HISTORICAL_EVENTS: { date: string; label: string; relevance: 'commodity' | 'livestock' | 'all' }[]
```

4–6 events (embargo 2014, COVID 2020, invaze 2022, sucho 2024, EU vstup 2004, mléčné kvóty 2015).

### 6.4 V SCOPE — pokud ČSÚ poskytuje, jinak fallback

- `getLivestockHistorical()` — pokus rozšířit `czso.ts` o starší řady stavů zvířat. Pokud CZSO API nedává data před rokem X, fallback na **nejstarší dostupný rok** + transparentní poznámka v grafu ("Data od X").

### 6.5 OUT OF SCOPE (odloženo)

- ❌ **Sankey „cesta rohlíku"** — vyžaduje data o cenovém řetězci (mlýn, pekárna, obchod), nemáme
- ❌ **CSV export per graf** — jen jeden globální download link v sekci Metodologie linkem na CZSO
- ❌ **EUR ↔ CZK toggle** — nemáme směnný kurz datasource
- ❌ **Calendar heatmap nafty** — research signalizoval slabou sezónnost
- ❌ **Datepicker pro custom range** — over-engineering pro v1

---

## 7. Závislosti & nové soubory

**Nové soubory:**
- [src/components/statistiky/Hero.astro](../../../src/components/statistiky/Hero.astro)
- [src/components/statistiky/SparklineTicker.astro](../../../src/components/statistiky/SparklineTicker.astro)
- [src/components/statistiky/AutoTakeaways.astro](../../../src/components/statistiky/AutoTakeaways.astro)
- [src/components/statistiky/PillsNav.astro](../../../src/components/statistiky/PillsNav.astro) (sticky)
- [src/components/statistiky/CommodityChart.astro](../../../src/components/statistiky/CommodityChart.astro) (annotated long-term)
- [src/components/statistiky/InputsBlock.astro](../../../src/components/statistiky/InputsBlock.astro) (PHM + hnojiva)
- [src/components/statistiky/PriceScissors.astro](../../../src/components/statistiky/PriceScissors.astro) (connected scatter)
- [src/components/statistiky/ProductionBlock.astro](../../../src/components/statistiky/ProductionBlock.astro)
- [src/components/statistiky/HexMap.astro](../../../src/components/statistiky/HexMap.astro)
- [src/components/statistiky/LivestockSlope.astro](../../../src/components/statistiky/LivestockSlope.astro)
- [src/components/statistiky/StoryCards.astro](../../../src/components/statistiky/StoryCards.astro)
- [src/lib/agro-derived.ts](../../../src/lib/agro-derived.ts) (derived metrics)
- [src/data/agro-events.ts](../../../src/data/agro-events.ts) (annotation events)

**Modifikované:**
- [src/pages/statistiky/index.astro](../../../src/pages/statistiky/index.astro) — kompletní přepis (současných 1169 řádků → tenký orchestrátor s importy)
- [src/lib/czso.ts](../../../src/lib/czso.ts) — možná rozšíření o `getLivestockHistorical()` a `getCommodityTimeSeries(60)` default

**Externí knihovny:**
- Chart.js 4 — již použito, žádné přidání
- `chartjs-plugin-annotation` — **přidat** (pro historické anotace na long-term grafu)

---

## 8. Responsiveness

- **Desktop (≥1024px):** plný layout dle popisu výše
- **Tablet (768–1023px):**
  - Hero grid → single column (foto pod textem)
  - Sparkline ticker scrollable horizontálně (overflow-x: auto)
  - Auto-takeaways grid → 1 sloupec
  - Hex mapa: zachovat (14 hexů zůstávají)
  - Cenové nůžky: zachovat
  - Two-col (sklizeň + plochy) → single column
- **Mobile (<768px):**
  - Sticky pills → scrollable horizontálně
  - Long-term graf: zachovat, ale výška 200px
  - Hex mapa: smaller, viewBox scale
  - Brushable timeline: simplified (year pills místo brush)
  - Sparkline ticker: 2 karty viditelné, swipe pro další

---

## 9. Performance & accessibility

**Performance:**
- Chart.js loadovat z CDN (jako teď)
- `chartjs-plugin-annotation` z CDN
- Hero foto WebP, lazy load pod foldem
- **Eager** initialization grafů v sekci Trh, Vstupy (top of fold)
- **Lazy** init grafů sekce Produkce, Zvířata (IntersectionObserver, jako teď `_initMoreCharts`)
- SSR: všechna data fetchnutá v Astro frontmatteru (build-time s `prerender: true` jako teď). Žádný runtime fetch v browseru.

**Accessibility:**
- Hex mapa: každý hex `role="button"`, `tabindex="0"`, `aria-label`, keyboard handler (Enter/Space) — vzor z aktuální `czMap`
- Sparkline ticker: každá karta `role="link"`, popis "Pšenice, 5240 Kč za tunu, růst o 4.2 % za měsíc"
- Pills nav: `aria-current="page"` na active pill
- Grafy: `aria-label` s textovým popisem (např. "Graf cen pšenice za posledních 5 let, aktuální hodnota 5240 Kč/t")
- `prefers-reduced-motion`: vypnout hover lift, fade-in animace, brushable drag → fallback na pills

---

## 10. SEO & metadata

- `<title>`: „Zemědělské statistiky ČR — ceny, sklizeň, vstupní náklady | Agro-svět"
- `<meta description>`: stručný TLDR (~160 chars)
- JSON-LD: `WebPage` + `BreadcrumbList` (Domů → Statistiky)
- Headings: `h1` jednou (hero), `h2` per sekce, `h3` pro pod-prvky (např. "Vývoj cen obilovin (5 let)")
- OpenGraph: hero foto + popis

---

## 11. Open questions / risks

1. **Historická data zvířat před 2010** — neznáme, jestli ČSÚ poskytuje. Fallback strategie definovaná, ale wow faktor "35 let úbytku" se zmenší, pokud řada bude jen 15 let.
2. **`chartjs-plugin-annotation` velikost** — přidává cca 30 KB. Akceptovatelné pro tuto stránku.
3. **Hex mapa — geografie** — manuální coordinates pro 14 hexů, neexistuje knihovna. Custom SVG, design v implementační fázi (přibližná pozice musí být intuitivní).
4. **Auto-takeaway thresholds** — pokud žádná z metrik nesplňuje "wow" práh (např. všechny meziměsíční změny < 3 %), dostaneme fallback texty. Riziko nudné TLDR sekce — kompenzovat dobrými fallback texty.
5. **5letý průměr výpočet** — vyžaduje minimálně 60 měsíců dat. Některé komodity (vejce?) možná nemají tak dlouhou řadu. Fallback: zobrazit jen tam, kde jsou data.

---

## 12. Success criteria

- ✅ Hero + sparkline ticker plně funkční na desktop/mobile
- ✅ Annotated long-term graf zobrazuje 4+ historické anotace; pills přepínač pro 9 komodit funguje; 1Y/5Y/Vše časový přepínač funguje
- ✅ Cenové nůžky scatter chart vykresluje 10+ bodů (2015–2024 minimum), spojnice mezi roky, anotace let, insight text generovaný z dat
- ✅ Hex mapa: 14 hexů viditelných, klik na hex zobrazí detail, brushable timeline mění rok, choropleth odstraněn
- ✅ Slope chart zvířat: 2 trace (skot + prasata), 2+ historické anotace, insight % poklesu
- ✅ Sticky pills nav: 6 položek, IntersectionObserver active state, mobile scroll-x
- ✅ Auto-takeaway karty: 3 karty s daty generovanými z aktuálních datasetů, fallback texty fungují
- ✅ Vizuálně: sjednoceno s [src/components/stroje/CategoryBrowse.astro](../../../src/components/stroje/CategoryBrowse.astro) — stejné CSS variables, stejná typografie, stejné spacing
- ✅ Žádná regresní funkční ztráta: všechny současné datasety (komodity, paliva, sklizeň, plochy, zvířata, hnojiva, regionální) jsou viditelné (žádný expand)
- ✅ Lighthouse Performance ≥ 80 (mobile), Accessibility ≥ 95
- ✅ Build prochází (`npm run build`); existing tests, pokud nějaké pro statistiky, projdou nebo jsou aktualizované

---

## 13. Related references

- Inspirace stránky:
  - [Our World in Data — Food Prices](https://ourworldindata.org/food-prices)
  - [USDA ERS — Commodity Costs and Returns Interactive](https://www.ers.usda.gov/data-products/commodity-costs-and-returns/interactive-visualization-us-commodity-costs-and-returns-by-region-and-by-commodity)
  - [FT Visual Vocabulary](https://github.com/Financial-Times/chart-doctor/blob/main/visual-vocabulary/README.md)
- Internal:
  - [src/components/stroje/CategoryBrowse.astro](../../../src/components/stroje/CategoryBrowse.astro) — design jazyk reference
  - [src/lib/czso.ts](../../../src/lib/czso.ts) — datová vrstva
  - [src/pages/statistiky/index.astro](../../../src/pages/statistiky/index.astro) — current state (1169 řádků k přepsání)
