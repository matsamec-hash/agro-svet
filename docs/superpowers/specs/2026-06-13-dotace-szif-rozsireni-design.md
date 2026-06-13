# Design: Dotace/SZIF — rozšíření obsahu + funnel (Track #2)

**Datum:** 2026-06-13
**Track:** #2 z `2026-06-13-agro-svet-organic-traffic-zadani.md` (TOP priorita)
**Cíl:** Zvýšit organický traffic na dotační obsah agro-svet.cz — pokrýt to, co čeští zemědělci reálně hledají, a propojit dotace → stroje → návody do rozhodovacího funnelu.
**Rozsah:** Obsah (rozšíření kolekce) + funnel (rozhodovací hub + prolinkování). **Čistě CS.**

---

## Kontext a grounded stav (ověřeno 2026-06-13)

- **Framework:** Astro 6.4.4, `output: 'server'`, `@astrojs/node`, `trailingSlash: 'always'`. Node 22.
- **Deploy:** push `master` → Coolify auto-deploy. Git push token-in-URL.
- **Kolekce `dotace`** (`src/content.config.ts`, `dotaceSchema()`): bohaté schéma (intervence, %, strop, žadatel, strojeMax49, FAQ → FAQPage JSON-LD).
  - CS: **4 tituly** (`src/content/dotace/`): 33.73 investice ZP, 37.73 technologie emise, mladí zemědělci, zahájení činnosti 49.75.
  - SK: **3 vlastní slovenské tituly** (`src/content/dotace-sk/`: 4.1, 73.7, 75.1) — **samostatná jurisdikce, NEzrcadlí se** s CS. UK = track #3 (nemá `dotace-uk`).
- **Stránky:** `src/pages/dotace/index.astro` (SSR, bilingvní přes `Astro.locals.locale`), `[slug].astro`, `kalendar-kol/index.astro`, `kalkulacka/dotace-cap/`.
- **Kalendář kol UŽ existuje:** `/dotace/kalendar-kol/`, data `src/data/dotace-kola.json` (+ `-sk`), teď 3 kola (33.73, 37.73, 34.73).
- **i18n:** `src/i18n/dotace.ts` (`content[locale]`), formátování `src/lib/dotace-format.ts` (`linkBase`, `fmtMoney`, `fmtDate`).
- **SEO infra:** `src/lib/structured-data.ts` (breadcrumbSchema, itemListSchema, faqSchema, howToSchema…), `Layout.astro` (canonical, hreflang dle launch, noindex), sitemapy.
- **Cross-CTA dnes:** `[slug].astro` má `cross-cta` natvrdo na `/stroje/traktory/` + `/srovnani/` + `/kalkulacka/leasing-traktoru/` — **identické pro každý titul** (generické).
- **Stroje kategorie:** `StrojKategorie` v `src/lib/stroje.ts` (~45 kategorií: traktory, kombajny, pluhy, postřikovače-*, rozmetadla-*, lisy-*, sklízeče-*, teleskopy, štěpkovače, lesní-vyvážečky…).

### Reálný katalog projektových intervencí SP SZP 2023–2027 (zdroj SZIF)
33.73 Investice do zem. podniků · 34.73 Investice do zpracování zem. produktů · 36.73 Lesnická infrastruktura · 37.73 Technologie snižující emise · 38.73 Obnova kalamitních ploch · 39.73 Ochrana melioračních dřevin · 40.73 Vodohospodářská opatření v lesích · 43.73 Neproduktivní investice v lesích · 45.73 Investice do nezemědělských činností · 51.77 Inovace při zpracování · 52.77 Spolupráce · 53.77 EIP · 54.78 Poradenství · 55.78 Vzdělávání. (+ intervence pro mladé zemědělce / zahájení činnosti.)

---

## Co stavíme

### 1. Rozšíření kolekce dotace (4 → ~10 titulů, CS only)

Nové markdown soubory do `src/content/dotace/` dle stávajícího `dotaceSchema()`. Navržené přírůstky (seřazené dle relevance k publiku „technika/stroje" + hledanosti):

| Intervence | Titul | Odůvodnění |
|---|---|---|
| **34.73** | Investice do zpracování zemědělských produktů | Už v `kalendar-kol`, ale **chybí detail page** → rozbitá expectace; zpracovatelské technologie |
| **45.73** | Investice do nezemědělských činností | Diverzifikace/agroturistika — vysoká hledanost |
| **51.77** | Inovace při zpracování zemědělských produktů | Inovační technologie |
| **(závlahy/voda)** | kód ověřit na SZIF | Sucho → vysoká sezónní hledanost |
| **36.73** | Investice do lesnické infrastruktury | Lesní technika (web má vyvážečky/štěpkovače) |
| **38.73** | Investice do obnovy kalamitních ploch | Lesní, navazuje na 36.73 |

**Cílový stav: ~10 CS titulů.** Finální seznam + všechna čísla (%, stropy, pravidlo 49 %, žadatel, min. výdaje, termíny) se při exekuci **web-grounduje proti `szif.gov.cz` / `eagri.cz`** — žádné vymyšlené hodnoty. `primarniZdroj` musí mířit na konkrétní stránku Pravidel.

**Pozn. k preciznímu zemědělství:** není samostatná projektová intervence (jde přes Jednotnou žádost / platbu na hektar — viz existující FAQ u 33.73) → NEdělat jako titul, pokrýt v hubu.

Obsah psán přes skill **`czech-ag-article-style`**. Každý titul automaticky dostává FAQPage + BreadcrumbList přes stávající `[slug].astro` — žádná změna renderu kvůli novým titulům.

### 2. Rozhodovací hub (nová stránka)

`src/pages/dotace/jak-vybrat/index.astro` — **„Jak vybrat dotaci na techniku"**:
- **Rozhodovací tabulka:** typ stroje (traktor, postřikovač, secí stroj, sklízeč, zpracovatelská linka, lesní technika…) → vhodná intervence → klíčové omezení (pravidlo 49 % na mobilní stroje) → odkaz na titul + na kategorii strojů.
- Sekce **„Kdo může žádat"** — eligibility rozcestník (zemědělský podnikatel dle 252/1997 Sb., mladý zemědělec, malá farma do 150 ha…).
- Krátký „jak postupovat" rozcestník → odkaz na master howto `jak-naplanovat-dotaci-na-techniku.md` + na kalendář kol.
- **JSON-LD:** BreadcrumbList + ItemList (odkazy na tituly) + FAQPage.
- **Bilingvní (cs+sk)** jako zbytek `/dotace` (SSR přes `locals.locale`). SK varianta mapuje svoje 3 SK tituly — jinak by `/sk/dotace/jak-vybrat/` byl mrtvá ruta. i18n řetězce do `src/i18n/dotace.ts`.
- Statická stránka (žádný klientský JS) → plná SEO hodnota.

### 3. Obohacené prolinkování (funnel)

- **Per-titul relevantní cross-CTA.** Rozšířit `dotaceSchema()` o volitelná pole:
  - `relatedStroje?: string[]` — slugy kategorií strojů (validní `StrojKategorie`).
  - `relatedHowto?: string[]` — slugy howto.
  - `[slug].astro` `cross-cta` přepsat: pokud titul má `relatedStroje`/`relatedHowto`, vyrenderovat cílené odkazy; jinak fallback na současné generické (zpětná kompat se 4 stávajícími tituly).
- **Zpětné odkazy:** z master howto `jak-naplanovat-dotaci-na-techniku.md` na hub + relevantní tituly.
- Hub ↔ tituly ↔ kalendář vzájemně provázané.

### 4. Kalendář kol — čerstvost

Doplnit `src/data/dotace-kola.json` o kola nových titulů (grounded termíny ze SZIF harmonogramu). Ověřit, že status logika (`ocekavane`/`otevrene`/`uzavrene`) a `aktualizovano` sedí. SK data (`-sk`) beze změny (jiná jurisdikce).

### 5. Technické / SEO / testy

- **Sitemap:** ověřit, že `sitemap.xml.ts` iteruje kolekci `dotace` (nové tituly se přidají automaticky) a doplnit ruta hubu `/dotace/jak-vybrat/`.
- **i18n:** nové klíče do `src/i18n/dotace.ts` (cs+sk) pro hub. Hlídat, ať změna nerozbije existující dotace stránky.
- **Testy (vitest):** dle existujících vzorů — kolekce načte všechny tituly bez schema chyby; `relatedStroje` hodnoty jsou validní `StrojKategorie`; hub renderuje cs i sk; sitemap obsahuje nové tituly + hub. Build zelený (`node scripts/build-og-images.mjs && astro build`, node 22).

---

## Hranice rozsahu (YAGNI)

**Vědomě VYNECHÁNO:**
- Interaktivní kvíz/průvodce (zvolen statický rozcestník — SEO + nízké riziko).
- SK/UK tituly (jiná jurisdikce; UK = track #3).
- Přepracování kalendáře nad rámec doplnění dat (žádná nová živá status engine).
- Precizní zemědělství jako samostatný titul (není projektová intervence).

---

## Proces

- **Větev:** nový worktree + `feat/dotace-szif-rozsireni` **z `master`** (aktuální `feat/akce-kalendar-obohaceni` je nesouvisející — nestavět na ní).
- **Grounding:** každý titul ověřit proti SZIF/eAGRI před zápisem čísel. Obsah přes `czech-ag-article-style`.
- **Merge/PR:** až po schválení (vzor předchozích cyklů). Git push token-in-URL.

## Akceptační kritéria

1. Kolekce `dotace` (CS) má ~10 titulů, všechny s grounded čísly a `primarniZdroj` na konkrétní SZIF Pravidla.
2. 34.73 má detail page (dnes je jen v kalendáři) → kalendář už neodkazuje do prázdna.
3. Existuje hub `/dotace/jak-vybrat/` (cs+sk) s rozhodovací tabulkou + eligibility + JSON-LD (Breadcrumb+ItemList+FAQPage).
4. Detail dotace zobrazuje per-titul relevantní cross-linky na stroje/howto (ne generické traktory) tam, kde má titul `relatedStroje`/`relatedHowto`; staré 4 tituly fungují beze změny.
5. Master howto odkazuje na hub.
6. `dotace-kola.json` pokrývá nové tituly.
7. Nové tituly + hub jsou v `sitemap.xml.ts`.
8. vitest zelený, build zelený (node 22), existující dotace stránky beze změny chování.
