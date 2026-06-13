# Databáze plodin a odrůd na agro-svet.cz — design

**Datum:** 2026-06-07
**Web:** agro-svet.cz (Astro 6 SSR + Cloudflare + Supabase + Resend)
**Cíl:** Long-tail SEO přes databázi plodin a registrovaných odrůd (inspirace: soufflet-agro.cz/cs/osiva/oves, ale informační autorita místo prodejního katalogu).

---

## 1. Záměr a kontext

Agro-svet.cz je obsahová autorita pro zemědělství. Soufflet má prodejní katalog konkrétních
odrůd osiv; my postavíme **informační** ekvivalent: encyklopedii plodin + databázi
registrovaných odrůd z veřejných dat ÚKZÚZ. Každá odrůda i plodina = rankující URL na
long-tail dotazy typu „oves odrůdy", „ozimá pšenice ranost", „[název odrůdy] vlastnosti".

Komerční vrstva osiv = **síťová synergie** (odkazy do adresáře prodejců agro-svetu +
farmakrty.cz dle Kontraktu sítě), NIKDY ceny ani e-shop.

Návrh mirroruje zralý vzor `plemena` (dvouúrovňová hierarchie druh→plemeno, YAML data
parsovaná compile-time přes `@modyfi/vite-plugin-yaml`, pole `body` HTML + `faq` +
`wikipedia/wikidata` sameAs, recyklace `src/lib/structured-data.ts`). **Žádná nová DB** —
data jsou compile-time soubory v repu.

---

## 2. URL architektura a typy stránek

Tři úrovně obsahu + programatické facety:

```
/plodiny/                          → hub všech plodin (mini-katalog, klientský filtr dle skupiny)
/plodiny/oves/                     → stránka plodiny: agronomie (pillar) + tabulka odrůd
/plodiny/oves/atego/               → detail odrůdy (long-tail jádro)
/plodiny/skupina/obiloviny/        → facet: skupina plodin
/odrudy/udrzovatel/[slug]/         → facet: odrůdy daného udržovatele
```

- **Plodina** (~30–60 URL): pillar stránka — osevní postup, výsevek, hnojení, choroby,
  výnos, sklizeň, využití + tabulka odrůd.
- **Odrůda** (stovky–tisíce v datech, indexovaná podmnožina — viz §3 guardrail):
  faktická pole z ÚKZÚZ + obohacující vrstva u top odrůd.
- **Facety** (skupina plodin, udržovatel) generované programaticky pro long-tail.

**Rozhodnutí:** jádro je `/plodiny/` (sémanticky správné pro informační web), `/odrudy/`
slouží jen pro facetové řezy. Routing bez kolize: `skupina` je rezervovaný segment na
úrovni `/plodiny/[segment]` (kontrola, že žádná plodina nemá slug `skupina`).

---

## 3. Datová vrstva (hybrid, dvě oddělené vrstvy)

Mirror `plemena.ts` (typy + `import.meta.glob` eager + normalize + cache), ale data
rozdělená na dvě vrstvy se samostatným životním cyklem:

### 3a. Faktická vrstva (strojová, z ÚKZÚZ)
- Umístění: `src/data/plodiny/odrudy/[plodina].json`
- Import: jednorázový/periodický skript `scripts/import-odrudy.ts` (Node 22) z veřejných
  zdrojů ÚKZÚZ:
  - online Databáze odrůd `https://ido.ukzuz.cz/ido/` (denně aktualizovaná),
  - fallback PDF „Seznam odrůd" (roční, ~4 MB) z
    `ukzuz.gov.cz/.../odrudy-registrovane-v-cr/seznam-odrud`.
- Pole na odrůdu: `slug`, `name`, `plodina_slug`, `rok_registrace`, `udrzovatel`,
  `typ` (ozimá/jarní), `ranost`, případně `zdroj_url`.
- Skript je idempotentní (re-run přepíše JSON), commitují se vygenerované JSON soubory
  (data v repu = build bez síťové závislosti).

### 3b. Obohacující vrstva (kurátorovaná / AI)
- Umístění: `src/data/plodiny/[plodina].yaml`
- Obsah plodiny: `name`, `name_plural`, `skupina`, `description`, agronomie
  (osevní postup, výsevek, hnojení, choroby, výnos, sklizeň, využití), `body` HTML,
  `faq`, `wikipedia`, `wikidata`.
- Per-odrůda enrichment (volitelný, jen TOP odrůdy): `enrichment` mapa
  `odruda_slug → { popis, vlastnosti, odolnosti, doporuceni, body?, faq? }`.

### 3c. Anti-thin guardrail (poučení z mucin / kam-tecou-dane)
Samostatná **indexovatelná URL odrůdy** vznikne **jen** když má odrůda obohacení
(próza/FAQ/vlastnosti v §3b). „Holé" odrůdy z ÚKZÚZ existují pouze jako **řádek v tabulce
odrůd** na stránce plodiny → žádné tenké duplikátní URL v sitemapě.
- Stránka `/plodiny/[p]/[odruda]/` se vygeneruje pro každou odrůdu, ale neobohacené
  dostanou `noindex` + nejsou v sitemapě (nebo se negenerují vůbec — preferováno
  negenerovat, ať nevzniká crawl budget leak).
- Škálovatelnost: doplníš enrichment → odrůda se „odemkne" do vlastní indexované URL.

### 3d. Knihovna
`src/lib/plodiny.ts` — typy `Plodina`, `Odruda`, `PlodinaSkupina`; spojení faktické +
obohacující vrstvy (join přes `plodina_slug` + `slug`); helpery `listPlodiny()`,
`getPlodina(slug)`, `getOdruda(plodina, slug)`, `listOdrudyForPlodina()`,
`listIndexableOdrudy()`, `listUdrzovatele()`, `listSkupiny()`. Čisté testovatelné funkce.

---

## 4. SEO výbava (per page)

Recyklace `src/lib/structured-data.ts`:
- **Plodina:** `breadcrumbSchema` + `howToSchema` (osevní postup) + `faqPageSchema` +
  `itemListSchema` (seznam odrůd). Unikátní meta, datová próza, prolink na odrůdy + facety.
- **Odrůda:** `breadcrumbSchema` + `faqPageSchema` (má-li FAQ) + `sameAs`
  (Wikipedia/Wikidata kde existuje). Comparable-aware próza (rozlišuje, zda jsou data
  k srovnání s jinými odrůdami plodiny).
- **Facety:** `breadcrumbSchema` + `itemListSchema`, krátká próza, jen indexovat facety
  s dostatkem položek (anti-thin).
- **Sitemap:** jen indexovatelné URL (plodiny + odemčené odrůdy + dostatečné facety).
- **OG karty:** per-page (vzor existujících OG na agro-svetu).
- **Navigace:** položka „Plodiny" do menu pod „Témata" (vzor `chov-hlemyzdu` / `akce`).

---

## 5. Síťová synergie (vrstva osiv)

Bez cen a e-shopu. Na stránce plodiny i odrůdy blok „Kde řešit osivo a poradenství":
- odkazy do adresáře prodejců agro-svetu (existující `/prodejci`),
- odkaz na **farmakrty.cz** (precizní zemědělství / farma Samec) s `rel` dle Kontraktu
  sítě (vlastní síť = followed).
- Centrální mapování v `src/lib/plodiny.ts` (případně malý `osiva-links` helper), ať se
  blok dá zapínat/cílit per plodina. Žádná duplicita, žádný sitewide footer spam.

---

## 6. Rozsah (širší MVP — fáze 1 pokrývá všechny hlavní polní plodiny)

**Fáze 1 (MVP, širší):** plný stack (plodina pillar + odrůdy z ÚKZÚZ + facety + import
skript) pro hlavní polní plodiny:
- **Obiloviny:** pšenice ozimá, pšenice jarní, ječmen ozimý, ječmen jarní, oves, žito,
  tritikale.
- **Olejniny:** řepka ozimá, slunečnice, mák.
- **Okopaniny:** brambory, cukrová řepa.
- **Luskoviny:** hrách, sója, bob.
- **Pícniny:** kukuřice (na zrno i siláž), jetel, vojtěška.

Enrichment se zpočátku napíše pro nejhledanější plodiny/odrůdy; ostatní žijí jako
faktická tabulka (guardrail §3c).

**Fáze 2:** rozšíření enrichmentu → odemykání dalších odrůd do vlastních URL; další
facety (ranost, využití); případně zelenina/speciální plodiny.

**Fáze 3:** údržbový cron pro refresh faktické vrstvy z ÚKZÚZ (denní/sezónní),
lokalizace (CZ→SK→EN dle existující i18n infrastruktury).

---

## 7. Stack a provoz

- **Stack:** Astro 6 SSR + Cloudflare; data compile-time (`vite-plugin-yaml` pro YAML,
  `import.meta.glob` pro JSON) — žádná nová DB.
- **Deploy:** wranglerem z worktree, Node 22 (`nvm use 22 && npm run build && npm run deploy`;
  deploy NEDĚLÁ build). `.env` zkopírovat do worktree.
- **Git (agro-svet caveat):** NIKDY `git add -A` (vtáhne `.env.save` se secrets → push
  protection); přidávat konkrétní soubory. Push přes
  `/usr/bin/git -c credential.helper='!gh auth git-credential' push`.
- **Gate:** vitest (čisté funkce libu) + `npm run build` + smoke (hub 200, plodina 200,
  odemčená odrůda 200, neodemčená odrůda noindex/404, facet 200).

---

## 8. Komponenty (units, izolované)

| Unit | Co dělá | Závisí na |
|------|---------|-----------|
| `scripts/import-odrudy.ts` | Stáhne + naparsuje ÚKZÚZ data → JSON | síť (jen při běhu), ÚKZÚZ |
| `src/data/plodiny/odrudy/*.json` | Faktická vrstva odrůd | (generováno skriptem) |
| `src/data/plodiny/*.yaml` | Obohacující vrstva plodin + enrichment | — |
| `src/lib/plodiny.ts` | Typy + join + helpery + guardrail | data soubory |
| `src/pages/plodiny/index.astro` | Hub + filtr | `plodiny.ts` |
| `src/pages/plodiny/[plodina]/index.astro` | Pillar plodiny + tabulka odrůd | `plodiny.ts`, structured-data |
| `src/pages/plodiny/[plodina]/[odruda].astro` | Detail odrůdy (indexovatelná podmnožina) | `plodiny.ts`, structured-data |
| `src/pages/plodiny/skupina/[skupina].astro` | Facet skupiny | `plodiny.ts` |
| `src/pages/odrudy/udrzovatel/[slug].astro` | Facet udržovatele | `plodiny.ts` |
| sitemap/OG integrace | Indexovatelnost | `plodiny.ts` |

---

## 9. Otevřené body (k vyřešení při implementaci)

- Přesný formát ÚKZÚZ online DB (`ido.ukzuz.cz`) — zda jde queryovat/scrapovat
  strukturovaně, nebo parsovat PDF. Skript navrhnout tak, aby šel zdroj vyměnit.
- Mapování ÚKZÚZ „druh plodiny" → naše `plodina_slug` (číselník v importu).
- Práh „dostatečnosti" facetu pro indexaci (min. počet položek).
