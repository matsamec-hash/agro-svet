# Agro-svet i18n — Fáze 2b, balík A: Dotace PPA SR (SK)

**Datum:** 2026-06-04
**Branch:** `feat/i18n-sk-dotace` (z `origin/master` @ `0c8dba5`)
**Worktree:** `~/agro-svet-i18n-obsah`
**Status:** návrh ke schválení

---

## 1. Cíl a kontext

Fáze 2b „reálná SK data" odemyká pro slovenskou jazykovou verzi sekce, které jsou
dnes zamčené (noindex, servírují české tělo), protože jsou CZ-jurisdikčně specifické.
Zamčené prefixy ([`src/i18n/nav.ts:30`](../../../src/i18n/nav.ts)):

```
LOCKED_SECTION_PREFIXES = ['/dotace', '/statistiky', '/kalkulacka/dotace-cap', '/puda']
```

Tyto 4 prefixy = **3 nezávislé pracovní balíky**, každý vlastní spec:

| Balík | CZ sekce | SK zdroj dat | Měna |
|---|---|---|---|
| **A. Dotace** (tento spec) | `/dotace` + `/kalkulacka/dotace-cap` | PPA SR / MPRV SR | EUR |
| B. Statistiky | `/statistiky` | ŠÚSR / Eurostat | — |
| C. Ceny pôdy | `/puda` | SK zdroje | EUR |

**Tento spec pokrývá balík A celý** — A1 (interaktivní kalkulačka) + A2 (obsahová sekce `/dotace`).
B a C se řeší samostatnými specy později.

### Klíčové zjištění z rešerše

Slovenské schéma přímých plateb (Strategický plán SPP 2023–2027) se **strukturně liší**
od českého — není to čistá výměna konstant:

- **BISS** (základná podpora príjmu) ~96–122 €/ha — reziduální mechanismus s min/max.
- **Redistributívna platba (CRISS)** dvoustupňová: ~80 €/ha prvních ~101 ha, pak ~40 €/ha
  do 150 ha, nad 150 ha nic. (CZ má jednu sazbu na prvních 150 ha.)
- **Ekoschéma** dvě sazby podle toho, zda je pozemek v chránenom vtáčom území (CHVÚ):
  ~92 €/ha v CHVÚ vs ~59 €/ha mimo. (CZ má „basic vs premium podle počtu praktik".)
- **VCS (viazaná podpora príjmu)**: cukrová repa ~477,80 €/ha, bielkovinové plodiny
  ~69,90 €/ha, dále chmeľ, zelenina, ovocie. (Jiné sektory/sazby než CZ.)
- **ANC** je v SR formálně intervence rozvoja vidieka (ne přímá platba); její per-ha sazba
  navíc není veřejně dohledatelná → **z V1 kalkulačky vypuštěna**, nahrazena jen poznámkou
  (viz §7 rozhodnutí).

> ⚠️ Sazby výše jsou **orientační z rešerše a musí být znovu ověřeny** v dedikované
> rešeršní fázi (viz §6) před zápisem do kódu. Přesnost dat je na nás.

---

## 2. Rozsah (scope)

### V rozsahu
- **A1** — SK varianta kalkulačky přímých plateb (`/sk/kalkulacka/dotace-cap`).
- **A2** — SK obsahová sekce dotací (`/sk/dotace`, `/sk/dotace/[slug]`, `/sk/dotace/kalendar-kol`)
  s 3–4 klíčovými investičními tituly PPA SR.
- Odemčení obou sekcí z locku + sitemap/hreflang/llms.txt/indexace.
- Dedikovaná rešerše + cross-verifikace všech SK čísel.

### Mimo rozsah (YAGNI / pozdější iterace)
- Vyčerpávající seznam všech investičních titulů PPA (jen 3–4 klíčové ve V1).
- Balíky B (statistiky) a C (ceny pôdy) — vlastní specy.
- AEKO, welfare zvířat, investiční výzvy nad rámec uvedených titulů.
- Generalizace `cap-dotace.ts` do jurisdikčně-konfigurovatelného enginu (zamítnuto, viz §3).

---

## 3. Architektura a rozhodnutí

### A1 — Kalkulačka: separátní `sk-cap-dotace.ts` (NE generalizace)

**Rozhodnutí:** nový samostatný modul `src/lib/sk-cap-dotace.ts`, vedle stávajícího
`src/lib/cap-dotace.ts`. **Negeneralizovat** existující engine do jurisdikčně-parametrizovaného.

**Proč:** SK a CZ schémata se strukturně liší (ekoschéma podle CHVÚ vs počtu praktik,
dvoustupňová vs jednostupňová redistributívna, jiné sektory/regiony). Generalizace dvou
strukturně odlišných jurisdikcí = umělá abstrakce (YAGNI). Izolace = **nulové riziko**
pro živou CZ kalkulačku a snadná testovatelnost.

**Modul `sk-cap-dotace.ts` exportuje:**
- `SAZBY_SK` — konstanty s komentářem `// zdroj: <URL>, rok` u každé položky.
- `KRAJE_SK` — 8 krajov SR (pre-fill ANC UX), analog `KrajInfo`.
- `CITLIVE_SEKTORY_SK` — VCS sektory SR (slug, name SK, sazba €/ha, description SK).
- `AncCategorySk`, `CapInputSk`, `CapBreakdownItemSk`, `CapResultSk` — typy.
- `calculateCapSk(input): CapResultSk` — logika: BISS, dvoustupňová CRISS (79/40 €/ha
  s hranicemi 100,99/150 ha), ekoschéma (CHVÚ on/off, plocha v CHVÚ ≤ totalHa),
  mladý poľnohospodár (strop 28 ha), VCS. (ANC mimo výpočet — viz §7.)
- `formatEur(n): string` — `n.toLocaleString('sk-SK', …) + ' €'`.

**Routing (oprava):** projekt NEMÁ fyzické `/sk/` stránky. Middleware
([`src/middleware.ts`](../../../src/middleware.ts)) stripuje prefix a rewritne
`/sk/foo` → interní `/foo` s `Astro.locals.locale='sk'`; lock = 307 redirect.
Launchnuté SK kalkulačky (Fáze 2b vzor, [`naklady-na-hektar/index.astro`](../../../src/pages/kalkulacka/naklady-na-hektar/index.astro))
používají **`prerender = false` (SSR)** + i18n content modul + `Astro.locals.locale`.

**Stránka (skutečný vzor):** modifikovat **existující** `src/pages/kalkulacka/dotace-cap/index.astro`:
- `prerender = false`; číst `const locale = Astro.locals.locale ?? 'cs'`.
- Formuláře CZ a SK se strukturně liší (SK: CHVÚ plocha, bez ANC fieldsetu; CZ: ANC + eko-premium)
  → každou jurisdikci extrahovat do komponenty:
  - `src/components/calc/DotaceCapCz.astro` — CZ formulář + klientský `<script>` (verbatim přesun
    ze současné stránky, importuje `calculateCap` z `cap-dotace.ts`) → **CZ logika netknutá**.
  - `src/components/calc/DotaceCapSk.astro` — SK formulář + `<script>` importující `calculateCapSk`
    z `sk-cap-dotace.ts`.
- Stránka: `{locale === 'sk' ? <DotaceCapSk/> : <DotaceCapCz/>}`, Layout title/description/canonical
  a FAQ JSON-LD z content modulu podle locale.
- `src/i18n/kalkulacka/dotace-cap.ts` — `content[locale]` (title, metaDescription, kicker, h1, lede,
  FAQ, breadcrumb, disclaimer). cs reprodukuje současné texty byte-ekvivalentně.

### A2 — Obsah: overlay kolekce `dotace-sk`

**Rozhodnutí:** overlay vzor podle existující `znacky-sk` kolekce
([`src/content.config.ts`](../../../src/content.config.ts)).

- Nová kolekce `dotaceSk` v `content.config.ts`: `glob({ base: './src/content/dotace-sk' })`,
  **stejné schéma** jako `dotace` (sdílet schema factory, viz `znackySchema()`).
- `src/content/dotace-sk/*.md` — 3 slovenské investiční tituly PPA SR (nový obsah z rešerše,
  ne překlad — SK nemá intervence „33.73", má vlastní intervence Strategického plánu SR).
  Slugy SK ≠ CZ → **žádný cs fallback obsahu** (na rozdíl od `znacky-sk`, kde slugy = překlady).
- `src/data/dotace-kola-sk.json` — kola PPA SR (slovenské intervence, odkazy `apa.sk`/`mpsr.sk`).
- Stránky (existující, prerender=true → **prerender=false** SSR, locale-aware):
  - `/dotace/index.astro`: `locale==='sk'` → `getCollection('dotaceSk')` + SK copy; jinak cs.
  - `/dotace/[slug].astro`: `getStaticPaths` zrušit; `locale==='sk'` → `getEntry('dotaceSk', slug)`
    (404 když chybí, **bez** cs fallbacku); cs → `getEntry('dotace', slug)` jako dřív.
  - `/dotace/kalendar-kol/index.astro`: `locale==='sk'` → `dotace-kola-sk.json` + SK copy; jinak cs.
  - cs-facing `getCollection('dotace')` v sitemap/llms zůstává **netknuté**.
- `src/i18n/dotace.ts` — `content[locale]` pro copy sekce (hero, disclaimer, statusLabel, breadcrumb).

### Odemčení a indexace
- Z `LOCKED_SECTION_PREFIXES` ([`nav.ts:30`](../../../src/i18n/nav.ts)) **odebrat**
  `/dotace` a `/kalkulacka/dotace-cap`. (`/statistiky`, `/puda` zůstávají — balíky B/C.)
- `/dotace` přidat do `SK_LAUNCHED_PREFIXES` ([`utils.ts:31`](../../../src/i18n/utils.ts));
  `/kalkulacka` už v seznamu je.
- Ověřit, že lock-guard v [`Layout.astro:72`](../../../src/layouts/Layout.astro)
  (`isSkLaunchedPath && !isLockedSectionPath`) i [`sitemap.xml.ts`](../../../src/pages/sitemap.xml.ts)
  a [`llms.txt.ts`](../../../src/pages/llms.txt.ts) nově odemčené cesty pustí do indexace + hreflang.

---

## 4. Datový tok

```
A1:  uživatel (SK form) → calculateCapSk(CapInputSk) → CapResultSk → render breakdown (EUR)
A2:  locale === 'sk' ? getCollection('dotaceSk') : getCollection('dotace')  → /dotace render
     locale === 'sk' ? getEntry('dotaceSk', slug) : getEntry('dotace', slug) → /dotace/[slug] (sk: 404 if missing)
     locale === 'sk' ? dotace-kola-sk.json       : dotace-kola.json          → /dotace/kalendar-kol
```

Lock/launch rozhodnutí (Layout, sitemap, llms): `isSkLaunchedPath(path) && !isLockedSectionPath(path)`.

---

## 5. Edge-cases a ošetření chyb
- `totalHa <= 0` → prázdný výsledek (analog CZ `calculateCap`).
- CRISS hranice: ha ≤ 100,99 → 79 €/ha; část 101–150 → 40 €/ha; nad 150 → 0.
- Ekoschéma: plocha v CHVÚ ≤ totalHa; zbytek výměry sazbou mimo CHVÚ (nebo dvě nezávislá pole — viz plán).
- VCS plocha sektoru > totalHa → ořezat na totalHa.
- Mladý poľnohospodár: počítá se max na 28 ha.
- Chybějící SK overlay soubor pro daný slug → 404 jako u cs (žádný tichý cs fallback obsahu
  na sk URL, aby se neindexoval mix jazyků).
- Disclaimer: „Orientačné, záväzné sú sadzby PPA" + odkaz `apa.sk` na každé stránce A1 i A2.

---

## 6. Rešerše & verifikace dat (přesnost je na nás)

Samostatná rešeršní fáze **před** zápisem čísel do kódu:
- Každá sazba (BISS, CRISS 2 stupně + hranice, ekoschéma 2 sazby + definice CHVÚ, ANC
  kategorie+sazby, VCS každý sektor, mladý poľnohospodár, stropy/proceta investičních titulů)
  cross-check **≥2 autoritativní zdroje**: MPRV SR (`mpsr.sk`), PPA (`apa.sk`), případně
  oficiální materiály / Agrobiznis / Poľnoinfo jako sekundární.
- Pro každé číslo zaznamenat do specu i do komentáře v kódu: **hodnota, zdroj (URL), rok**.
- Rok platnosti sazeb explicitně v UI („sadzby pre rok 2024/2025") + disclaimer o ±odchylce.
- Investiční tituly A2: ověřit reálné PPA SR intervence (kódy, % podpory, stropy, žadatel,
  odkaz na primárny zdroj) — ne vymýšlet analogii k CZ titulům.

Výstup rešerše = doplnění tabulky sazeb do tohoto specu (§7) před tvorbou plánu, nebo
jako první task plánu s gate „čísla ověřena" před kódem.

---

## 7. Tabulka sazeb (naplněno rešeršní fází 2026-06-04)

> **Stav ověření (Task 0 hotov 2026-06-04).** VŠECHNY řádky níže jsou nyní **CONFIRMED-2024
> z oficiálního PPA Excelu** „Sadzby priamych platieb pre rok 2024" (apa.sk/sadzby, .xlsx,
> publikováno 16.6.2025) — soubor byl stažen a strojově přečten (rozbalen XML), viz §7.1.
> Ne každé číslo z dřívější rešerše bylo správné: **mladý poľnohospodár, chmeľ, ovocie a obě
> zeleniny se opravily** (původní hodnoty byly 2023-plánované a neplatí pro 2024).
> Pro orientaci je v §7.2 i oficiální 2025 sazebník (rovněž stažen z apa.sk).

| Platba | Sazba 2024 (oficiální) | Hranice/podmínka | Rok | Stav | Zdroje |
|---|---|---|---|---|---|
| BISS | 103,80 €/ha | celá způsobilá výměra | 2024 | **CONFIRMED-2024** | PPA Excel⁰ |
| CRISS stupeň 1 | 79,00 €/ha | do 100,99 ha | 2024 | **CONFIRMED-2024** | PPA Excel⁰ |
| CRISS stupeň 2 | 40,00 €/ha | 101–150 ha; nad 150 = 0 | 2024 | **CONFIRMED-2024** | PPA Excel⁰ |
| Ekoschéma (mimo CHVÚ) | 60,36 €/ha | celá výměra | 2024 | **CONFIRMED-2024** | PPA Excel⁰ |
| Ekoschéma (v CHVÚ) | 110,45 €/ha | plocha v CHVÚ | 2024 | **CONFIRMED-2024** | PPA Excel⁰ |
| VCS — cukrová repa | 477,80 €/ha | min. plocha dle pravidel | 2024 | **CONFIRMED-2024** | PPA Excel⁰ |
| VCS — bielkoviny | 69,90 €/ha | | 2024 | **CONFIRMED-2024** | PPA Excel⁰ |
| VCS — chmeľ | **880,00 €/ha** (oprava z 800) | min. 0,3 ha chmeľnice | 2024 | **CONFIRMED-2024** | PPA Excel⁰ |
| VCS — ovocie (vybrané) | **554,35 €/ha** (oprava z 558) | min. 0,3 ha sadov | 2024 | **CONFIRMED-2024** | PPA Excel⁰ |
| VCS — zelenina (prácna) | **455,00 €/ha** (oprava z 500) | min. 0,3 ha | 2024 | **CONFIRMED-2024** | PPA Excel⁰ |
| VCS — zelenina (vysoko prácna) | **685,00 €/ha** (oprava z 745) | min. 0,3 ha | 2024 | **CONFIRMED-2024** | PPA Excel⁰ |
| Mladý poľnohospodár (CRISS-YF) | **88,15 €/ha** (oprava z 100) | max **28 ha** (2024), do 40 let, první podnik | 2024 | **CONFIRMED-2024** (sazba), strop 28 ha overiť | PPA Excel⁰ (sazba) + search² (28 ha) |
| **ANC** | — | **vypuštěno z V1** | — | — | per-ha sazba nedohledatelná; formálně rozvoj vidieka |

> **Pozn. „mladý poľnohospodár":** v PPA Excelu jde o „Komplementárna podpora príjmu pre
> mladého poľnohospodára" = **88,15 €/ha** (2024). Strop 28 ha nebyl v Excelu (Excel obsahuje
> jen sazby), zůstává single-source 2024 — overiť proti pravidlám PPA před UI.

**Per-head/per-DJ platby mimo plošnou kalkulačku** (uvést jen textem, nepočítat — kalkulačka
je na ha), oficiální 2024 z PPA Excelu⁰:
- VCS dojnice (kravy v systému s trhovou produkcí mléka): **270,95 €/ks**
- VCS ovce a kozy: **24,15 €/ks**
- Welfare zvířat (pastevní chov) — dojnice: 295,90 €/DJ; jalovice: 65,00 €/DJ; ovce/kozy samičí ≥12 měs.: 119,24 €/DJ

**Zdroje:**
- 0. **PRIMÁRNÍ (Task 0):** PPA, „Sadzby priamych platieb pre rok 2024" (.xlsx, publ. 16.6.2025),
  listing na https://www.apa.sk/sadzby — soubor stažen + strojově přečten 2026-06-04.
  (Analogický oficiální 2025 sazebník viz §7.2, listing https://apa.sk/priame-podpory/sadzby.)
2. WebSearch „strop mladý poľnohospodár 28 ha" → Vestník/pravidlá MPRV SR (strop ha, NE sazba).
3. ~~agrobiznis³ (2023 plánované)~~ — překonáno oficiálním 2024 Excelem; 2023 plán hodnoty byly chybné.

### Rozhodnutí: ANC vypuštěno z V1 kalkulačky
Per-ha sazba ANC pro SR není veřejně dohledatelná (jen oficiální PPA dokumenty) a ANC je
v SR formálně intervence rozvoja vidieka, ne přímá platba. Místo neověřeného čísla
zobrazí SK kalkulačka krátkou poznámku: *„ANC (oblasti s prírodnými obmedzeniami) sa
v SR poskytuje samostatne v rámci rozvoja vidieka — pozri apa.sk."* (Mění §1/§3 původního
návrhu „ANC zahrnout s poznámkou" → „ANC jen poznámka, bez výpočtu".)

### 7.1 Oficiální PPA sazebník 2024 — kompletní strojový výpis (zdroj⁰)
Stažen z apa.sk/sadzby a rozbalen (xlsx = zip XML), 2026-06-04. Verbatim řádky:

```
Rok 2024
Základná podpora príjmu v záujme udržateľnosti ............................ 103,80 EUR/ha
Komplementárna redistributívna podpora príjmu ... do 100,99 ha ............ 79,00 EUR/ha
Komplementárna redistributívna podpora príjmu ... od 101 ha do 150 ha ..... 40,00 EUR/ha
Komplementárna podpora príjmu pre mladého poľnohospodára .................. 88,15 EUR/ha
Podpora formou celofarmovej eko-schémy v chránenom území .................. 110,45 EUR/ha
Podpora formou celofarmovej eko-schémy mimo chráneného územia ............. 60,36 EUR/ha
Welfare zvierat – pastevný chov (ovce a kozy samičie ≥12 mes.) ........... 119,24 EUR/DJ
Welfare zvierat – pastevný chov (dojnice) ................................ 295,90 EUR/DJ
Welfare zvierat – pastevný chov (jalovice) ................................ 65,00 EUR/DJ
Viazaná podpora – vybrané druhy bielkovinových plodín ..................... 69,90 EUR/ha
Viazaná podpora – kravy chované v systéme s trhovou produkciou mlieka .... 270,95 EUR/ks
Viazaná podpora – ovce a kozy ............................................. 24,15 EUR/ks
Viazaná podpora – chmeľ .................................................. 880,00 EUR/ha
Viazaná podpora – cukrová repa .......................................... 477,80 EUR/ha
Viazaná podpora – vybrané druhy ovocia .................................. 554,35 EUR/ha
Viazaná podpora – vybrané druhy vysoko prácnej zeleniny .................. 685,00 EUR/ha
Viazaná podpora – vybrané druhy prácnej zeleniny ........................ 455,00 EUR/ha
```

### 7.2 Oficiální PPA sazebník 2025 (pro orientaci / případný upgrade UI na 2025)
Stažen z apa.sk (listing apa.sk/priame-podpory/sadzby), 2026-06-04. NEpoužívat ve V1 (UI cílí 2024),
jen reference — sazby 2025 se MĚNÍ a struktura je stejná:

```
Rok 2025
BISS .................................................. 105,05 EUR/ha
CRISS do 100,99 ha ................................... 79,70 EUR/ha
CRISS 101–150 ha ..................................... 38,00 EUR/ha
Mladý poľnohospodár ................................. 108,89 EUR/ha
Eko-schéma v chránenom území ........................ 93,15 EUR/ha
Eko-schéma mimo chráneného územia ................... 58,06 EUR/ha
VCS bielkovinové plodiny ............................ 75,77 EUR/ha
VCS chmeľ ........................................... 880,00 EUR/ha
VCS cukrová repa .................................... 565,00 EUR/ha
VCS ovocie .......................................... 531,92 EUR/ha
VCS vysoko prácna zelenina .......................... 688,00 EUR/ha
VCS prácna zelenina ................................. 490,00 EUR/ha
VCS kravy (trhová produkcia mlieka) ................. 276,02 EUR/ks
VCS ovce a kozy ..................................... 24,96 EUR/ks
```

> Pozor: 2025 hodnoty se od 2024 liší (BISS ↑, CRISS-2 ↓ na 38, eko ↓, cukrová repa ↑ na 565,
> ovocie ↓). **V1 kalkulačka = sazby 2024**; UI musí explicitně psát „sadzby pre rok 2024".

### A2 tituly (verifikované)

3 reálné investiční tituly relevantní pro stroje/agropodniky. Tituly 1–2 jsou **publikované
výzvy SP SPP 2023–2027** (kampaň 2026, kódy `X/SP/2026`); titul 3 je **investiční výzva
na poľnohospodárske podniky** (4.1, přechodové financování PRV→SP SPP, otevřená na apa.sk).
Všechny dohledány proti apa.sk; čísla, která nebyla v primárním zdroji čitelná, jsou označena.

**Titul 1 — Získavanie a udržanie mladých poľnohospodárov**
- **Intervence/kód:** 75.1 (typ INSTAL(75)); výzva **5/SP/2026 – 75.1**
- **Forma a výše podpory:** paušál (lump sum) **100 000 €** na žadatele, ve 2 splátkách
  — **75 000 €** po podpisu zmluvy + **25 000 €** po splnění podnikatelského plánu.
- **Strop/cap:** 100 000 € / žadatel (paušál, ne % výdajů).
- **Oprávněný žadatel:** fyzická/právnická osoba v poľnohospodárské prvovýrobě splňující
  definici mladého poľnohospodára; do **40 let** (FO nesmí v roce podání dovršit 41 let);
  podnikatelský plán + odborná způsobilost. Účel: traktory, stroje, RV/ŽV investice.
- **Alokace:** **57 000 000 €** (kapacita ~570 žadatelů). **Termín:** 29.05.2026,
  aktualizací č. 1 prodloužen na **12.06.2026** (včetně).
- **Primární zdroj:** https://www.apa.sk/vyzvy/vyzva-vyzva-5sp2026-751-mladi-polnohospodari
  (sekundární korroborace: agrall.sk⁵)

**Titul 2 — Investície do rozšírenia kapacít v spracovateľských podnikoch**
- **Intervence/kód:** 73.7 (typ INVEST(73-74)); výzva **6/SP/2026 – 73.7** (uzavretá)
- **Intenzita pomoci / max. výše:** dle schém **DM-19/2025** (de minimis) a **SA.121709**
  (štátna pomoc) — konkrétní % a min/max částky jsou v přílohách 11 a 12 výzvy
  (**nepřečteno z webu**, nutno otevřít přílohy PDF).
- **Oprávněný žadatel:** podniky všech velikostních kategorií, které **už vykonávají
  spracovateľskú činnost** (mäso, mlieko, pekárenství aj.).
- **Alokace:** **35 000 000 €** (uváděno sekundárně⁶). **Termín příjmu:** 24.03.2026 –
  **30.04.2026** (aktualizace č. 2).
- **Primární zdroj:** https://www.apa.sk/vyzvy/vyzva-vyzva-6sp2026-737-spracovatelia

**Titul 3 — Podpora na investície do poľnohospodárskych podnikov (stroje a technologie)**
- **Opatření/kód:** podopatrenie **4.1**; výzva **74/PRV/2024** (přechodové financování do
  programového období SP SPP 2023–2027; otevřená na apa.sk).
- **Intenzita pomoci:** **50 %** z celkových oprávněných výdajů (+ možné bonusy/navýšení dle
  pravidel — bonusy nepotvrzeny z primáru).
- **Strop/cap:** oprávněné výdaje **min. 10 000 € / max. 1 800 000 €** na projekt.
- **Oprávněný žadatel:** fyzické a právnické osoby podnikající v **poľnohospodárské
  prvovýrobě** (RV/ŽV).
- **Účel (stroje):** investice výhradně z Katalogu cen poľnohospodárskej techniky (príloha 7)
  — mj. **traktory do 400 kW**, sklízecí technika na pícniny, oplocení pro ŽV, technika pro
  vinohrad/zahradnictví.
- **Primární zdroj:** https://www.apa.sk/74-prv-2024 (na apa.sk archivováno → vrací 404;
  parametry dohledány u zprostředkujícího org. RRA Ister⁷, který cituje text výzvy PPA).

**Zdroje A2:**
5. https://www.agrall.sk/sk/dotacia-pre-mladych-farmarov-5-sp-2026-75-1 (korroborace 100 000 €, do 40 let, alokace 57 mil. €)
6. https://www.eurofondy.sk/nove-vyzvy-ppa/ + teraz.sk/ekonomika (alokace 35 mil. € pro 73.7)
7. https://www.rraister.sk/vyzva-c-74prv2024-41-podpora-na-investicie-do-polnohospodarskych-podnikov (parametry výzvy 74/PRV/2024 – 4.1)

> **Caveat A2:** Pro titul 2 (73.7) nebyly z webu čitelné přesné % intenzity ani min/max
> částky (jsou v přílohách PDF výzvy). Pro titul 3 (74/PRV/2024) je primární apa.sk stránka
> archivovaná (404) → intenzita 50 % a stropy 10 k–1,8 M € dohledány u akreditovaného
> zprostředkovatele, ne přímo z apa.sk. Před publikací obsahových článků doporučeno otevřít
> PDF přílohy výzev a doplnit chybějící % / částky.

---

## 8. Testy
- **Unit `tests/lib/sk-cap-dotace.test.ts`:** `calculateCapSk` — BISS na celou výměru;
  dvoustupňová CRISS na hranicích (100 / 100,99 / 101 / 150 / 200 ha); ekoschéma CHVÚ
  on vs off (sazba se mění + plocha v CHVÚ ≤ totalHa); VCS sektor (ořez na totalHa);
  mladý poľnohospodár (strop 28 ha); perHa; `totalHa <= 0` → prázdno.
  (ANC se nepočítá — viz §7 rozhodnutí.)
- **i18n `tests/i18n/*`:** `dotace-sk` overlay resolduje při sk; cs `getCollection('dotace')`
  netknuté; lock/launch matice — `/dotace` a `/kalkulacka/dotace-cap` nově **launched**
  pro sk (indexovatelné), `/statistiky` a `/puda` stále **locked**.
- **Regrese:** CZ kalkulačka i CZ `/dotace` beze změny (snapshot/sazby identické).
- **Gate:** `tsc` 0, plný `vitest` zelený, `next`/Astro build OK, smoke `/sk/kalkulacka/dotace-cap`
  a `/sk/dotace`.

---

## 9. Plán dodání (1 spec → 1 plán)
1. **Rešerše & verifikace** sazeb a titulů (§6) → naplnit §7. *(gate: čísla ověřena)*
2. `sk-cap-dotace.ts` + unit testy (TDD).
3. SK stránka kalkulačky `/sk/kalkulacka/dotace-cap`.
4. `dotace-sk` kolekce + 3–4 tituly + `dotace-kola-sk.json`.
5. Locale-aware `/dotace` index / `[slug]` / `kalendar-kol`.
6. Odemčení z locku + sitemap/hreflang/llms + i18n testy.
7. Build + smoke + plný vitest → PR.

**Pozn.:** cizí WIP (6 OG howto PNG) zůstává untracked. Atomické commity. PR z této branche
proti `origin/master`.
