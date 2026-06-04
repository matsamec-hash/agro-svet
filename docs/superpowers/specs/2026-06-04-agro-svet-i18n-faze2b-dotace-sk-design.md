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

**Stránka:** `src/pages/sk/kalkulacka/dotace-cap/index.astro` — lokalizovaná kopie
struktury CZ stránky (`prerender = true`), slovenské texty, EUR, FAQ v SK, disclaimer
směrující na PPA. CZ stránka `src/pages/kalkulacka/dotace-cap/index.astro` zůstává netknutá.

### A2 — Obsah: overlay kolekce `dotace-sk`

**Rozhodnutí:** overlay vzor podle existující `znacky-sk` kolekce
([`src/content.config.ts`](../../../src/content.config.ts)).

- Nová kolekce `dotaceSk` v `content.config.ts`: `glob({ base: './src/content/dotace-sk' })`,
  **stejné schéma** jako `dotace`.
- `src/content/dotace-sk/*.md` — 3–4 slovenské investiční tituly PPA SR (nový obsah
  z rešerše, ne překlad — SK nemá intervence „33.73", má vlastní kódy/tituly).
- `src/data/dotace-kola-sk.json` — kola PPA SR (slovenské intervence, odkazy `apa.sk`/`mpsr.sk`).
- Stránky `/dotace/index`, `/dotace/[slug]`, `/dotace/kalendar-kol` budou **locale-aware**:
  při `locale === 'sk'` čtou `dotace-sk` overlay + `dotace-kola-sk.json`; jinak cs zdroje.
  cs-facing `getCollection('dotace')` (listings/sitemap/llms) zůstává **netknuté**.

> Přesný mechanismus výběru overlay (helper vs inline větvení v page frontmatteru)
> dořeší implementační plán podle toho, jak to dělá `znacky-sk` — sledovat existující vzor.

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
A2:  locale === 'sk' ? getCollection('dotace-sk') : getCollection('dotace')  → /dotace render
     locale === 'sk' ? dotace-kola-sk.json        : dotace-kola.json          → /dotace/kalendar-kol
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

> **Stav ověření.** „Pevné" = dual-sourced 2024 aktuály (Vestník MPRV SR via Poľnoinfo
> + druhý nezávislý web). „Overiť" = jen 2023 plánované (single-source) — final hodnota
> 2024 jen v oficiálním PPA Excelu „Sadzby priamych platieb pre rok 2024" (apa.sk/sadzby,
> .xlsx — přes web nečitelný). **Plán Task 1 = stáhnout ten Excel a opravit/potvrdit
> všechny řádky před UI prací.** Žádné číslo bez řádku zde.

| Platba | Sazba | Hranice/podmínka | Rok | Stav | Zdroje |
|---|---|---|---|---|---|
| BISS | 103,80 €/ha | celá způsobilá výměra | 2024 | pevné | polnoinfo.sk¹, search Vestník MPRV² |
| CRISS stupeň 1 | 79 €/ha | do 100,99 ha | 2024 | pevné | polnoinfo.sk¹ (2023: agrobiznis³ 80) |
| CRISS stupeň 2 | 40 €/ha | 101–150 ha; nad 150 = 0 | 2024 | pevné | polnoinfo.sk¹ + agrobiznis³ |
| Ekoschéma (mimo CHVÚ) | 60,36 €/ha | celá výměra | 2024 | pevné | polnoinfo.sk¹ |
| Ekoschéma (v CHVÚ) | 110,45 €/ha | plocha v CHVÚ | 2024 | pevné | polnoinfo.sk¹ + search² |
| VCS — cukrová repa | 477,80 €/ha | min. plocha dle pravidel | 2024 | pevné | polnoinfo.sk¹ + search² |
| VCS — bielkoviny | 69,90 €/ha | | 2024 | pevné | polnoinfo.sk¹ + search² |
| VCS — chmeľ | 800 €/ha | min. 0,3 ha chmeľnice | 2023 plán | **overiť** | agrobiznis³ |
| VCS — ovocie (vybrané) | 558 €/ha | min. 0,3 ha sadov | 2023 plán | **overiť** | agrobiznis³ |
| VCS — zelenina (prácna) | 500 €/ha | min. 0,3 ha | 2023 plán | **overiť** | agrobiznis³ |
| VCS — zelenina (vysoko prácna) | 745 €/ha | min. 0,3 ha | 2023 plán | **overiť** | agrobiznis³ |
| Mladý poľnohospodár | 100 €/ha | max **28 ha** (2024), do 40 let, první podnik | sazba 2023 plán / strop 2024 | **overiť** | agrobiznis³ (sazba) + search² (28 ha) |
| **ANC** | — | **vypuštěno z V1** | — | — | per-ha sazba nedohledatelná; formálně rozvoj vidieka |

**Per-head platby mimo plošnou kalkulačku** (uvést jen textem, nepočítat — kalkulačka je
na ha): dojnice 270,95 €/ks (2024), ovce/kozy 24,15 €/ks (2024). Zdroj: polnoinfo.sk¹.

**Zdroje:**
1. https://polnoinfo.sk/polnohospodari-stratia-tisicky-eur-na-priamych-platbach/ (2024 aktuály z Vestníku MPRV SR, list. 2024)
2. WebSearch „sadzby priamych platieb 2024 Slovensko" → Vestník MPRV SR (2024)
3. https://www.agrobiznis.sk/agrarne-spravodajstvo/agrarna-politika-dotacie-eurofondy/7744-podpory-2023-premiera-novej-spp (2023 plánované)
4. Oficiální primár (Task 1 verifikace): https://www.apa.sk/sadzby → „Sadzby priamych platieb pre rok 2024" (.xlsx)

### Rozhodnutí: ANC vypuštěno z V1 kalkulačky
Per-ha sazba ANC pro SR není veřejně dohledatelná (jen oficiální PPA dokumenty) a ANC je
v SR formálně intervence rozvoja vidieka, ne přímá platba. Místo neověřeného čísla
zobrazí SK kalkulačka krátkou poznámku: *„ANC (oblasti s prírodnými obmedzeniami) sa
v SR poskytuje samostatne v rámci rozvoja vidieka — pozri apa.sk."* (Mění §1/§3 původního
návrhu „ANC zahrnout s poznámkou" → „ANC jen poznámka, bez výpočtu".)

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
