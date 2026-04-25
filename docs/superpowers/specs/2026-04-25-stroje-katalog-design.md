# Stroje — rozšíření katalogu o ostatní zemědělskou techniku

**Datum**: 2026-04-25
**Autor**: Matěj Samec + Claude
**Status**: design ready for plan
**Souvisí**: [agro-bazar-design](2026-04-20-agro-bazar-design.md) (bazar integrace)

---

## 1. Problém a cíl

### Problém
Sekce **Technika** na agro-svet.cz aktuálně obsahuje katalog **Traktory** a **Kombajny** (1190 modelů, 196 sérií, 10 značek). Chybí veškerá ostatní zemědělská technika — **pluhy, podmítače, lisy, diskery, postřikovače, valníky, krmné vozy, teleskopy, řezačky** a další. Uživatel hledající např. Lemken Juwel nebo Krone BiG X ho na webu nenajde.

### Cíl
Přidat **třetí pilíř** katalogu: **"Stroje"** (zemědělské stroje mimo traktory a kombajny). Pokrýt veškerou další zemědělskou techniku organizovanou podle značek + funkčních skupin. Implementovat tak, aby výsledek byl **přehledný** (clean information architecture), **rozšiřitelný** (snadné přidávání dalších značek) a **integrovaný** s bazarem.

### Měřitelné výstupy MVP
- 10 funkčních skupin s ~45 sub-kategoriemi pokrývající 95 % CZ trhu
- 12 nových značek (must-have pro CZ trh) + rozšíření 6 stávajících traktorových značek
- ~110 modelových řad / ~300-400 modelů v katalogu
- ~250+ nových URL prerendrovaných v sitemapě
- Bazar rozšířen o 7 nových kategorií, 12 nových brand filtrů, model picker pokrývá všechny kategorie

---

## 2. Information Architecture

### Hybrid navigace (cat-first + brand-first)
Hub stránka nabízí **dvě cesty** k cíli:
- **Podle účelu** — grid 9-10 funkčních skupin (Zpracování půdy / Setí / Hnojení / Ochrana rostlin / Sklizeň pícnin / Sklizeň okopanin / Manipulace / Doprava / Stáj a chov / Komunální a lesní)
- **Podle značky** — grid značek (Lemken / Pöttinger / Kuhn / Amazone / ...)

### URL struktura

| URL pattern | Účel | Příklad |
|---|---|---|
| `/stroje/` | Stávající: kompletní katalog (filtry + grid značek) | (zachovat) |
| `/stroje/traktory/` | Stávající | (zachovat) |
| `/stroje/kombajny/` | Stávající | (zachovat) |
| `/stroje/zemedelske-stroje/` | **NEW** — hub pro stroje (10 skupin + grid značek) | hub |
| `/stroje/zemedelske-stroje/<group>/` | Funkční skupina (cross-brand) | `/zemedelske-stroje/zpracovani-pudy/` |
| `/stroje/<subcategory>/` | Sub-kategorie cross-brand (paralela `/stroje/traktory/`) | `/stroje/pluhy/`, `/stroje/teleskopy/` |
| `/stroje/<brand>/` | Stávající brand page | `/stroje/lemken/` |
| `/stroje/<brand>/<subcategory>/` | Brand × sub-kategorie | `/stroje/lemken/pluhy/` |
| `/stroje/<brand>/<series>/` | Stávající série | `/stroje/lemken/juwel/` |
| `/stroje/<brand>/<series>/<model>/` | Stávající model | `/stroje/lemken/juwel/juwel-8/` |

### Header navigace
Stávající `Technika` dropdown rozšířit o položku **Stroje**:
```
Technika ▾
  Všechna technika (/stroje/)
  Traktory (/stroje/traktory/)
  Kombajny (/stroje/kombajny/)
  Stroje (/stroje/zemedelske-stroje/)        ← NEW
  Značky (/stroje/#znacky)
```

---

## 3. Taxonomie — 10 skupin × ~45 sub-kategorií

| # | Funkční skupina | Slug skupiny | Sub-kategorie (CZ název → slug) |
|---|---|---|---|
| 1 | **Zpracování půdy** | `zpracovani-pudy` | Pluhy → `pluhy`<br>Podmítače diskové → `podmitace-diskove`<br>Podmítače radličkové → `podmitace-radlickove`<br>Kypřiče (hloubkové, dlátové) → `kyprice`<br>Rotační brány → `rotacni-brany`<br>Kompaktomaty → `kompaktomaty`<br>Válce → `valce` |
| 2 | **Setí a sázení** | `seti` | Secí stroje mechanické → `seci-stroje-mechanicke`<br>Secí stroje pneumatické → `seci-stroje-pneumaticke`<br>Přesné secí stroje (planter) → `seci-stroje-presne`<br>Secí kombinace → `seci-kombinace`<br>Sázečky brambor → `sazecky-brambor` |
| 3 | **Hnojení** | `hnojeni` | Rozmetadla minerálních hnojiv → `rozmetadla-mineralni`<br>Rozmetadla statkových hnojiv → `rozmetadla-statkova`<br>Cisterny na kejdu → `cisterny-kejda`<br>Aplikátory kejdy → `aplikatory-kejda` |
| 4 | **Ochrana rostlin** | `ochrana-rostlin` | Postřikovače nesené → `postrikovace-nesene`<br>Postřikovače tažené → `postrikovace-tazene`<br>Postřikovače samojízdné → `postrikovace-samojizdne` |
| 5 | **Sklizeň pícnin a slámy** | `sklizen-picnin` | Žací stroje → `zaci-stroje`<br>Obraceče → `obracece`<br>Shrnovače → `shrnovace`<br>Lisy na válcové balíky → `lisy-valcove`<br>Lisy na hranolové balíky → `lisy-hranolove`<br>Obalovače balíků → `obalovace`<br>Sklízecí řezačky (samojízdné) → `rezacky-samojizdne`<br>Samosběrací vozy → `samosberaci-vozy` |
| 6 | **Sklizeň okopanin** | `sklizen-okopanin` | Sklízeče brambor → `sklizece-brambor`<br>Sklízeče cukrové řepy → `sklizece-repy`<br>Vyorávače → `vyoravace` |
| 7 | **Manipulace a nakládání** | `manipulace` | Čelní nakladače (na traktor) → `celni-nakladace`<br>Teleskopické manipulátory → `teleskopy`<br>Kolové nakladače → `kolove-nakladace`<br>Kloubové nakladače → `kloubove-nakladace`<br>Smykem řízené nakladače → `smykove-nakladace` |
| 8 | **Doprava** | `doprava` | Návěsy sklápěcí → `navesy-sklapeci`<br>Návěsy valníkové → `navesy-valnik`<br>Návěsy s posuvným dnem → `navesy-posuvne-dno`<br>Cisterny na vodu → `cisterny-voda`<br>Přepravníky zrna (overloader) → `prepravniky-zrna` |
| 9 | **Stáj a živočišná výroba** | `staj-chov` | Krmné (míchací) vozy → `krmne-vozy`<br>Dojicí roboti → `dojici-roboti`<br>Podestýlací stroje → `podestylace` |
| 10 | **Komunální a lesní** | `komunal-les` | Mulčovače → `mulcovace`<br>Štěpkovače → `stepkovace`<br>Lesní vyvážečky → `lesni-vyvazecky` |

**Celkem: 10 skupin × 45 sub-kategorií**

### Pravidla pojmenování
- **Slugy:** lowercase, kebab-case, bez diakritiky, plurál položky (`pluhy`, ne `pluh`)
- **CZ názvy v UI:** zaběhnuté CZ termíny (žačka, pluh, lisy válcové, kejda, podmítač) — nikoli anglické kalky
- **Subcategory specifika** v `series.specs` mapě, ne nové YAML-level pole

### Edge case rozhodnutí
| Edge case | Rozhodnutí |
|---|---|
| Manipulátor zemědělství vs stavebnictví | Manipulace; v `model.specs.sektor` lze tagovat `[zemedelstvi, stavebnictvi]` |
| Žací stroj na obilí (kombajn) | NE — jen pícninářská žačka v UI |
| Cisterna na kejdu | Hnojení (NE Doprava) |
| Cisterna na vodu | Doprava |
| Secí kombinace (s power harrow) | Setí (cíl = zasít) |
| Rozmetadla minerální vs statkové | Oddělené sub-kategorie (jiný stroj, jiné značky) |
| Strip-till stroje | Zpracování půdy + tag `specs.strip_till = true` |
| Lis "kulaté vs válcové" | "Válcové" — Krone CZ terminologie |

---

## 4. Schema (FLAT — sub-kategorie jako sourozenci traktory/kombajny)

### Datový model: rozšíření existujícího YAML

Stávající schéma `categories.traktory.series:[]` zůstává. Přidáním sub-kategorií jako prvním-třídních kategorií dosáhneme symetrie:

```yaml
# lemken.yaml
slug: lemken
name: Lemken
country: DE
founded: 1780
website: https://lemken.com
description: >
  Německý výrobce klasických nesených i polonesených pluhů (Juwel, Diamant) a komplexního
  portfolia podmítačů, kypřičů, rotačních bran a postřikovačů.
categories:
  pluhy:
    name: Pluhy
    series:
      - slug: juwel
        name: "Juwel"
        year_from: 2010
        year_to: null
        description: Universální nesené pluhy s hydraulickou regulací
        models:
          - slug: lemken-juwel-8
            name: "Juwel 8"
            year_from: 2014
            year_to: null
            weight_kg: 1500
            pracovni_zaber_m: 1.85
            prikon_traktor_hp_min: 140
            prikon_traktor_hp_max: 240
            typ_zavesu: neseny
            specs:
              pocet_radlic: 5
              otocny: true
              pracovni_hloubka_cm: 35
              typ_telesa: "univerzální"
  podmitace-diskove:
    name: Podmítače diskové
    series: [...]
  rotacni-brany: { ... }
  seci-stroje-pneumaticke: { ... }
  postrikovace-tazene: { ... }
```

### TypeScript interface (rozšíření v `lib/stroje.ts`)

```typescript
// PŘED
export type StrojKategorie = 'traktory' | 'kombajny';

// PO — pozn.: vsechny slugy jsou kebab-case (konzistentní s URL i existujícím bazar-constants.ts)
export type StrojKategorie =
  | 'traktory' | 'kombajny'
  | 'pluhy' | 'podmitace-diskove' | 'podmitace-radlickove'
  | 'kyprice' | 'rotacni-brany' | 'kompaktomaty' | 'valce'
  | 'seci-stroje-mechanicke' | 'seci-stroje-pneumaticke' | 'seci-stroje-presne'
  | 'seci-kombinace' | 'sazecky-brambor'
  | 'rozmetadla-mineralni' | 'rozmetadla-statkova' | 'cisterny-kejda' | 'aplikatory-kejda'
  | 'postrikovace-nesene' | 'postrikovace-tazene' | 'postrikovace-samojizdne'
  | 'zaci-stroje' | 'obracece' | 'shrnovace'
  | 'lisy-valcove' | 'lisy-hranolove' | 'obalovace'
  | 'rezacky-samojizdne' | 'samosberaci-vozy'
  | 'sklizece-brambor' | 'sklizece-repy' | 'vyoravace'
  | 'celni-nakladace' | 'teleskopy' | 'kolove-nakladace'
  | 'kloubove-nakladace' | 'smykove-nakladace'
  | 'navesy-sklapeci' | 'navesy-valnik' | 'navesy-posuvne-dno'
  | 'cisterny-voda' | 'prepravniky-zrna'
  | 'krmne-vozy' | 'dojici-roboti' | 'podestylace'
  | 'mulcovace' | 'stepkovace' | 'lesni-vyvazecky';

export interface StrojModel {
  // existing
  slug: string;
  name: string;
  year_from: number | null;
  year_to: number | null;
  power_hp: number | null;     // jen samojízdné
  power_kw: number | null;     // jen samojízdné
  engine?: string;
  transmission?: string;
  weight_kg?: number | null;
  cutting_width_m?: number | null;  // backwards-compat (kombajny)
  grain_tank_l?: number | null;
  description?: string;
  image_url?: string | null;
  specs?: Record<string, string | number | boolean | null>;

  // NEW
  pracovni_zaber_m?: number | null;
  prikon_traktor_hp_min?: number | null;
  prikon_traktor_hp_max?: number | null;
  typ_zavesu?: 'neseny' | 'tazeny' | 'poloneseny' | 'samojizdny' | 'navesny' | null;
}

// NEW: mapování funkčních skupin
export const FUNCTIONAL_GROUPS = {
  'zpracovani-pudy': {
    name: 'Zpracování půdy',
    description: 'Pluhy, podmítače, kypřiče, brány, kompaktomaty a válce',
    categories: ['pluhy', 'podmitace-diskove', 'podmitace-radlickove', 'kyprice', 'rotacni-brany', 'kompaktomaty', 'valce'] as StrojKategorie[],
  },
  'seti': { /* ... */ },
  'hnojeni': { /* ... */ },
  'ochrana-rostlin': { /* ... */ },
  'sklizen-picnin': { /* ... */ },
  'sklizen-okopanin': { /* ... */ },
  'manipulace': { /* ... */ },
  'doprava': { /* ... */ },
  'staj-chov': { /* ... */ },
  'komunal-les': { /* ... */ },
} as const;

export type FunctionalGroupSlug = keyof typeof FUNCTIONAL_GROUPS;

// Helper: pro pole zaber sjednocené napříč traktory/kombajny/stroje
export function getEffectiveZaber(model: StrojModel): number | null {
  return model.pracovni_zaber_m ?? model.cutting_width_m ?? null;
}
```

---

## 5. Spec fields strategy

### Vrstva 1: Universal fields (top-level v interface)
Pole pro **cross-category filtry** napříč traktory/kombajny/stroji:
- `year_from` / `year_to` — roky výroby
- `weight_kg` — vlastní hmotnost stroje
- `prikon_traktor_hp_min` / `prikon_traktor_hp_max` — potřebný výkon traktoru
- `pracovni_zaber_m` — pracovní záběr (alias `cutting_width_m`)
- `power_hp` / `power_kw` — vlastní výkon (jen samojízdné stroje)
- `typ_zavesu` — `neseny` / `tazeny` / `poloneseny` / `samojizdny` / `navesny`

### Vrstva 2: Per-subcategory specs (free-form mapa s konvencí)

```yaml
# pluhy
specs:
  pocet_radlic: 5
  otocny: true
  pracovni_hloubka_cm: 35
  typ_telesa: "univerzální"

# postrikovace-*
specs:
  objem_nadrze_l: 4000
  zaber_ramen_m: 24
  typ_ramen: "ALU 24m"

# lisy-valcove
specs:
  typ_komory: "variabilní"
  prumer_baliku_cm: 125
  sirka_baliku_cm: 120
  balic_integrovany: true

# lisy-hranolove
specs:
  rozmer_baliku_cm: "120x90"
  ridlost: "high-density"

# seci-stroje-*
specs:
  pocet_radku: 24
  rozteč_radku_cm: 12.5
  typ_botky: "kotoučová"
  objem_zasobniku_l: 4000

# rozmetadla-mineralni
specs:
  nosnost_kose_kg: 3000
  zaber_aplikace_m: 36

# cisterny-kejda
specs:
  objem_l: 18000
  typ_aplikatoru: "diskový injektor"

# zaci-stroje
specs:
  typ_zacky: "disková"
  mackac: true
  poloha: "čelní"

# teleskopy + nakladace
specs:
  nosnost_kg: 4200
  vyska_zdvihu_m: 9
  dosah_m: 6.8

# navesy-*
specs:
  nosnost_t: 18
  objem_korby_m3: 22
  pocet_naprav: 2
  sklapeni: "tří-stranné"

# krmne-vozy
specs:
  objem_m3: 22
  pocet_sneku: 2
  samochodny: false

# mulcovace
specs:
  zaber_m: 2.8
  typ_noze: "kladívka"
```

### Vrstva 3: Filter engine

`src/lib/stroje-filters.ts` — mapa `subcategory → FilterSpec[]`. Generuje per-subcategory filtry v UI.

```typescript
export type FilterSpec = {
  key: string;                    // pole na model.specs nebo top-level
  label: string;                  // CZ label v UI
  type: 'number_range' | 'enum' | 'boolean';
  options?: { value: string; label: string }[];  // pro enum
  unit?: string;                  // 'kg', 'm', 'l', 'cm'
  source: 'top' | 'specs';        // top = top-level field, specs = nested
};

export const SUBCATEGORY_FILTERS: Partial<Record<StrojKategorie, FilterSpec[]>> = {
  pluhy: [
    { key: 'pocet_radlic', label: 'Počet radlic', type: 'number_range', source: 'specs' },
    { key: 'otocny', label: 'Otočný', type: 'boolean', source: 'specs' },
    { key: 'pracovni_zaber_m', label: 'Pracovní záběr (m)', type: 'number_range', unit: 'm', source: 'top' },
  ],
  'lisy-valcove': [
    { key: 'typ_komory', label: 'Typ komory', type: 'enum', options: [
      { value: 'variabilní', label: 'Variabilní' },
      { value: 'pevná', label: 'Pevná' },
    ], source: 'specs' },
    { key: 'balic_integrovany', label: 'Integrovaný balič', type: 'boolean', source: 'specs' },
  ],
  teleskopy: [
    { key: 'nosnost_kg', label: 'Nosnost (kg)', type: 'number_range', unit: 'kg', source: 'specs' },
    { key: 'vyska_zdvihu_m', label: 'Výška zdvihu (m)', type: 'number_range', unit: 'm', source: 'specs' },
    { key: 'dosah_m', label: 'Dosah (m)', type: 'number_range', unit: 'm', source: 'specs' },
  ],
  // ... atd. pro každou subcategory
};
```

### Vrstva 4: Detail page spec tabulka
- `src/lib/spec-labels.ts` — mapa `pocet_radlic` → "Počet radlic", `typ_komory` → "Typ komory" pro pretty-print
- Sekce na detail page:
  - "Klíčové parametry" — universal fields
  - "Specifikace" — všechny `specs` klíče v label/value tabulce

---

## 6. Brand seed (MVP scope = šíře-first)

### Část A: Rozšíření 6 stávajících traktorových značek

| Značka | Stávající | Rozšířit o |
|---|---|---|
| **John Deere** | traktory + kombajny | Lisy (8000R, 1424C), postřikovače (R4xxxi, M9xx), secí (1990CCS, 740/750), řezačky (9000), čelní nakladače (H-series) |
| **CLAAS** | traktory + kombajny | Forage divize: Disco (žačky), Liner (shrnovače), Volto (obraceče), Variant + Rollant (lisy válc.), Quadrant (hranolové), Jaguar (řezačky), Scorpion (teleskopy) |
| **New Holland** | traktory + kombajny | Lisy BigBaler + RollBar/RollBelt, řezačky FR Forage Cruiser, postřikovače Guardian |
| **Massey Ferguson** | traktory + kombajny | Lisy (RB, MF 2200/2900), žačky DM, manipulátory TH |
| **Fendt** | traktory + kombajny | Lisy Rotana + Squadra, řezačky Katana, Slicer/Twister/Former |
| **Case IH** | traktory + kombajny | Secí (Early Riser planters 2150/2160), postřikovače Patriot |
| Kubota, Valtra, Zetor, Deutz-Fahr | traktory (+ kombajny) | (skip nebo fáze 2) |

### Část B: 12 nových must-have značek pro MVP

| # | Značka | Země | YAML | Top řady |
|---|---|---|---|---|
| 1 | **Lemken** | DE | `lemken.yaml` | Juwel, Diamant, Rubin, Heliodor, Karat, Zirkon, Solitair, Saphir, Sirius, Albatros |
| 2 | **Pöttinger** | AT | `pottinger.yaml` | Servo, Terradisc, Lion, Vitasem, Aerosem, Terrasem, Novacat, Hit, Top, Impress, Jumbo, Boss |
| 3 | **Kuhn** | FR | `kuhn.yaml` | Master, Vari-Master, Optimer, Cultimer, HRB, Espro, Venta, Maxima, Aero, Lexis, Axis, FC, GMD, GA, GF, VB, FB, SB |
| 4 | **Amazone** | DE | `amazone.yaml` | D9, Cataya, Cirrus, Citan, Cayena, Precea, UF, UX, Pantera, ZA-V, ZA-TS, Catros, Cenius, KE, Cayros |
| 5 | **Krone** | DE | `krone.yaml` | EasyCut, Vendro, Swadro, Comprima, VariPack, Fortima, BiG Pack, BiG M, BiG X, ZX |
| 6 | **Horsch** | DE | `horsch.yaml` | Pronto, Express, Sprinter, Avatar, Maestro, Terrano, Joker, Tiger, Leeb |
| 7 | **Väderstad** | SE | `vaderstad.yaml` | Tempo, Rapid, Spirit, Inspire, Carrier, TopDown, Opus, Rexius, Rollex |
| 8 | **Bednar** | CZ | `bednar.yaml` | Terraland, Swifter, Atlas, Versatill, Strip-Master, Omega, Efecta, Corn Master, Galaxy, Presspack |
| 9 | **Manitou** | FR | `manitou.yaml` | MLT 420/625/630/635/730/737/738/741/742/840/850/961, MLA-T, smykové R/RT |
| 10 | **JCB** | UK | `jcb.yaml` | Loadall 525-60, 530-60, 532-60, 536-60, 538-60, 542-70, 550-80, 560-80, TM (compact) |
| 11 | **Joskin** | BE | `joskin.yaml` | Modulo 2, Quadra, Komfort 2, EuroLiner, Volumetra, Trans-Cap, Trans-Space, Trans-KTP, Tornado, Siroko |
| 12 | **Kverneland** | NO/NL | `kverneland.yaml` | 150-200 series (pluhy), Optima, iXdrive, iXter, DG/CL/CKL, GEOSPREAD |

### Část C: Fáze 2 backlog
Po MVP: **Farmet** (CZ symetrie s Bednar), **Grimme** (sklízeče brambor), **Holmer + Ropa** (cukrovka), **McHale** (lisy), **Annaburger / Krampe** (návěsy), **Lely / DeLaval** (dojení/krmení), **Stoll / Quicke / Ålö** (čelní nakladače), **Rauch / Bogballe / Sulky** (rozmetadla).

### MVP odhad
- **Stávající rozšířit:** 6 značek × ~5 řad = ~30 řad
- **Nové:** 12 značek × ~7 řad = ~85 řad
- **Total:** ~110 řad / ~300-400 modelů
- **Pokrytí:** 8/10 funkčních skupin solidní; sklizeň okopanin, doprava, stáj-chov, komunál-les "tenké" — fáze 2

---

## 7. Data ingest strategie (Hybrid free)

Místo čistě ručního seedu (~200 h) využijeme **legální tří-vrstvovou hybrid strategii**: strukturovaná open data + sitemap+JSON-LD scraping + PDF brochures + manual CZ finishing. Cíl: ~80 % automatizace technických polí, 100 % manuální pro CZ popisky.

**Zjištění:** Žádný z 18 výrobců nemá veřejné katalogové API. Existující "developer/partner APIs" (CNH FieldOps, JD Operations Center, CLAAS Telematics, AGCO Connect, Manitou portal) jsou pro **telemetry/fleet zákaznických strojů** — ne katalog modelů. Jejich ToS výslovně zakazují re-use pro public katalog. **Nepoužíváme** dealer/partner APIs.

### Vrstva 1 — Open structured data (zdarma, low-risk)

**A) Wikidata SPARQL** (`query.wikidata.org/sparql`)
- Použití: brand-level metadata (název, country, founded year, parent company, web)
- Pokrytí: 95 % brand metadata pro 18 značek, 5-15 % model-level
- Skript: 1× SPARQL query → JSON → generování brand frontmatter v YAML
- Licence: CC0 (open domain)

```sparql
SELECT ?brand ?brandLabel ?country ?countryLabel ?founded ?web WHERE {
  VALUES ?brand { wd:Q23316 wd:Q23410 wd:Q468085 wd:Q1791420 ... }  # 18 brands
  OPTIONAL { ?brand wdt:P17 ?country }
  OPTIONAL { ?brand wdt:P571 ?founded }
  OPTIONAL { ?brand wdt:P856 ?web }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "cs,en". }
}
```

**B) Fendt techdata endpoint** (`api.fendt.com/techdata/{REGION}/{LANG}/{ID}/{NAME}`)
- Status: undocumented public, ne v oficiálních docs — **může kdykoli zmizet**
- Confirmed model IDs: 1152593 (700 Vario Gen7), 1153083 (500), 1153774 (900), 1152748 (1000), 1152010 (IDEAL), 1152877 (1100 MT), 1153013 (300), 1153811 (900 MT), 1465241 (600), 1519937 (1000 Gen4), 1551551 (700 Gen7.1)
- Response: HTML s techdata tabulkou (parser: cheerio)
- Použití: 12-15 Fendt traktorových modelů automaticky
- Rate: 1 req/s, custom UA `agro-svet-bot/1.0 (+https://agro-svet.cz/)`

### Vrstva 2 — Sitemap + JSON-LD scraping (s respektem)

Pro každého z 12 nových výrobců + 6 stávajících:
1. `GET /robots.txt` — respektovat Disallow rules
2. `GET /sitemap.xml` (a sitemap-index variants) — extrahovat URL detail produktových stránek
3. Pro každou URL: hledat `<script type="application/ld+json">` s `Product` schema (řada agribrandů má JSON-LD pro SEO)
4. Fallback: parse HTML tabulek techdat (selektory dle webu, custom adapter per výrobce)

**Cílové weby s nejlepší strukturou:**
- `shop.lemken.com` — má `/sitemap` s URL vzorem, JSON-LD na detail stranách
- `horsch.com/us/products` — JSON-LD Product schema
- `pottinger.at/cs_cz/produkte/` — strukturovaný HTML
- `bednar.com/products/` — CZ web, ideální pro lokalizaci
- `kuhn.com/en/agricultural-machinery` — kompletní portfolio

**CZ velkodealeři** (preferovaný zdroj — kompletnější CZ-jazyčné katalogy):
- Strom Praha (`strom.cz`) — JD, Bednar
- AGROTEC (`agrotecgroup.cz`) — multi-brand
- Pekass (`pekass.eu`) — JD, JCB
- AGRALL Hlavečník — Väderstad, CLAAS
- Daňhel Agro — Lemken
- Mendel a.s. — multi-brand

**Pravidla scraping:**
- Rate **1 req/s** (1000ms throttle), nikdy paralelní requesty na stejný host
- User-Agent: `agro-svet-bot/1.0 (+https://agro-svet.cz/)` — identifikace pro výrobce
- Respect robots.txt Disallow rules **vždy**
- Jen public stránky bez login
- Cache responses lokálně (1 fetch = forever) — žádné re-fetch během dev

### Vrstva 3 — PDF brochures (factual extraction)

**Free zdroje:**
- **Kverneland Group Download Centre** (`download.kvernelandgroup.com`) — free reg., bulk PDF/fotky pro Kverneland, Vicon, ROC
- **AgriExpo PDF library** (`pdf.agriexpo.online`) — 20 000+ free brochures vč. Bednar, Amazone, Krone
- Výrobcův web — `<brand>.com/.../brochure.pdf` linky

**Pipeline:**
1. Stáhnout PDF (lokální cache)
2. Extract text + tabulek (`pdf-parse` Node.js, `pdfplumber` Python)
3. LLM-based extraction (Claude API) pro normalizaci → unified YAML schema
4. Manual review s confidence score per pole

**Pravidla:**
- Stahování PDF brochures **JE OK** (volně published)
- Hostování PDF na našem serveru **NENÍ OK** — místo toho **linkovat na výrobcův URL**
- Extrahovaná fakta (HP, weight, dimensions) **lze použít** — fakta nelze copyrightovat

### Vrstva 4 — Manual CZ finishing

100 % manuální:
- CZ marketingový popisek (~150 slov per model) — vlastní text, ne překlad výrobce
- Lokální dostupnost a CZ dealer (Strom/AGROTEC/Pekass kontakty)
- Aktuální cenové orientace (přes CZ poptávku u dealera, pokud lze)
- Kontextové tagy (vhodné pro malou farmu / velkostatek / vinici)

### Pravidla legality (ZÁVAZNÁ pro implementaci)

**CO SMÍME:**
- ✓ Faktická data (HP, weight, year, dimensions) — fakta nejsou autorská dle EU/US zákonů
- ✓ Public webpage HTML fetch s respektem robots.txt + 1 req/s + custom UA
- ✓ JSON-LD Product schema extraction (web designed for crawl)
- ✓ Sitemap.xml fetch (specificky published pro crawlers)
- ✓ Wikidata SPARQL (CC0 open data)
- ✓ Stahování PDF brochures z výrobce webu pro fakta
- ✓ Linkování (NE rehosting) výrobcových PDF
- ✓ Reformulace popisek (transformative — vlastní CZ text)

**CO NESMÍME:**
- ✗ Hostovat fotky výrobců bez licence (copyright na fotky platí)
- ✗ Copy-paste popisek 1:1 (autorské texty)
- ✗ Bulk scraping bez rate limitu
- ✗ Použít dealer/partner APIs (CNH FieldOps, JD Operations Center, CLAAS Telematics, AGCO Connect, Manitou portal) — ToS-violation
- ✗ Scrapovat lectura-specs.com bez licence (jejich byznys = data, agresivní ToS)
- ✗ Login-protected scraping (i s dev účtem ToS zakazuje re-use)
- ✗ Rehost PDF brochures na našem serveru

**Fotky** — strategie:
- Foto z **Pexels/Unsplash** (CC0) jako placeholder grid
- Vlastní foto pokud uživatel nahraje (např. v bazaru)
- **Žádné** fotky scrapnuté z výrobce webu na detail stránce — místo toho linkovat na výrobcův produktový web ("Foto na lemken.com →")
- Výjimka: **Kverneland Download Centre** — free reg. dává license na použití pro KvG značky (Kverneland, Vicon, ROC)

### Odhad pokrytí Hybrid free strategie

| Pole | Coverage | Zdroj |
|---|---|---|
| Brand metadata (název, země, founded) | 95 % | Wikidata |
| Model name + family | 80 % | Sitemap |
| Výkon (HP/kW) | 60 % | Fendt API + JSON-LD + PDF |
| Záběr (m) | 50 % | JSON-LD + PDF |
| Hmotnost | 55 % | PDF brochures (LLM extraction) |
| Rok výroby (od/do) | 30 % | PDF brochures |
| Foto | 0-70 % | 0% scraped, Pexels/Unsplash placeholder, KvG Download Centre 100% pro Kverneland |
| Ceny | <5 % | CZ dealer manual |
| **CZ popisky** | **0 %** | Vždy ručně |

### Časový odhad Hybrid free vs alternative

| Cesta | Setup | Manual labor | Cena | Risk |
|---|---|---|---|---|
| Pure manual seed | 0 h | ~200 h | 0 | žádné |
| **Hybrid free (doporučeno)** | 30-50 h | 50-80 h | 0 | nízké (dodržet pravidla výše) |
| LECTURA API (komerční) | 80 h | minimal | €3-15k/rok | žádné |

**Volíme Hybrid free** — kompromis čas vs. cena, plně legální při dodržení pravidel.

---

## 8. Bazar integrace

### Část A: Kategorie (12 → 19)

**Současné** (12 v `bazar-constants.ts`): traktory, kombajny, seci-stroje, postrikovace, privezy, nahradni-dily, prislusenstvi, osiva-hnojiva, pozemky, zvirata, sluzby, ostatni.

**Nové** (19): zachovat 12, ale 3 přejmenovat (`seci-stroje` → `seti`, `postrikovace` → `ochrana-rostlin`, `privezy` → `doprava`) a přidat 7 nových:

```ts
export const CATEGORIES = [
  { value: 'traktory', label: 'Traktory' },
  { value: 'kombajny', label: 'Kombajny' },
  // NEW funkční skupiny (= mapování na katalog)
  { value: 'zpracovani-pudy', label: 'Zpracování půdy' },
  { value: 'seti', label: 'Setí a sázení' },              // přejmenovaný `seci-stroje`
  { value: 'hnojeni', label: 'Hnojení' },
  { value: 'ochrana-rostlin', label: 'Ochrana rostlin' }, // přejmenovaný `postrikovace`
  { value: 'sklizen-picnin', label: 'Sklizeň pícnin a slámy' },
  { value: 'sklizen-okopanin', label: 'Sklizeň okopanin' },
  { value: 'manipulace', label: 'Manipulace a nakládání' },
  { value: 'doprava', label: 'Doprava' },                 // přejmenovaný `privezy`
  { value: 'staj-chov', label: 'Stáj a chov' },
  { value: 'komunal-les', label: 'Komunál a les' },
  // existující ne-strojové
  { value: 'nahradni-dily', label: 'Náhradní díly' },
  { value: 'prislusenstvi', label: 'Příslušenství' },
  { value: 'osiva-hnojiva', label: 'Osiva a hnojiva' },
  { value: 'pozemky', label: 'Pozemky' },
  { value: 'zvirata', label: 'Zvířata' },
  { value: 'sluzby', label: 'Služby' },
  { value: 'ostatni', label: 'Ostatní' },
] as const;
```

### Část B: Brand filter (10 → 22)

```ts
export const BRANDS = [
  // existující traktorové (10 + Valtra fix)
  { value: 'john-deere', label: 'John Deere' },
  { value: 'claas', label: 'CLAAS' },
  { value: 'fendt', label: 'Fendt' },
  { value: 'zetor', label: 'Zetor' },
  { value: 'new-holland', label: 'New Holland' },
  { value: 'kubota', label: 'Kubota' },
  { value: 'case-ih', label: 'Case IH' },
  { value: 'massey-ferguson', label: 'Massey Ferguson' },
  { value: 'deutz-fahr', label: 'Deutz-Fahr' },
  { value: 'valtra', label: 'Valtra' },                   // FIX
  // NEW must-have stroje značky
  { value: 'lemken', label: 'Lemken' },
  { value: 'pottinger', label: 'Pöttinger' },
  { value: 'kuhn', label: 'Kuhn' },
  { value: 'amazone', label: 'Amazone' },
  { value: 'krone', label: 'Krone' },
  { value: 'horsch', label: 'Horsch' },
  { value: 'vaderstad', label: 'Väderstad' },
  { value: 'bednar', label: 'Bednar' },
  { value: 'manitou', label: 'Manitou' },
  { value: 'jcb', label: 'JCB' },
  { value: 'joskin', label: 'Joskin' },
  { value: 'kverneland', label: 'Kverneland' },
  // fallback
  { value: 'jina', label: 'Jiná' },
] as const;
```

### Část C: Bazar → katalog mapping

```ts
// src/lib/bazar-constants.ts
export const BAZAR_TO_CATALOG_SUBCATEGORIES: Record<string, string[]> = {
  traktory: ['traktory'],
  kombajny: ['kombajny'],
  'zpracovani-pudy': ['pluhy', 'podmitace-diskove', 'podmitace-radlickove', 'kyprice', 'rotacni-brany', 'kompaktomaty', 'valce'],
  'seti': ['seci-stroje-mechanicke', 'seci-stroje-pneumaticke', 'seci-stroje-presne', 'seci-kombinace', 'sazecky-brambor'],
  'hnojeni': ['rozmetadla-mineralni', 'rozmetadla-statkova', 'cisterny-kejda', 'aplikatory-kejda'],
  'ochrana-rostlin': ['postrikovace-nesene', 'postrikovace-tazene', 'postrikovace-samojizdne'],
  'sklizen-picnin': ['zaci-stroje', 'obracece', 'shrnovace', 'lisy-valcove', 'lisy-hranolove', 'obalovace', 'rezacky-samojizdne', 'samosberaci-vozy'],
  'sklizen-okopanin': ['sklizece-brambor', 'sklizece-repy', 'vyoravace'],
  'manipulace': ['celni-nakladace', 'teleskopy', 'kolove-nakladace', 'kloubove-nakladace', 'smykove-nakladace'],
  'doprava': ['navesy-sklapeci', 'navesy-valnik', 'navesy-posuvne-dno', 'cisterny-voda', 'prepravniky-zrna'],
  'staj-chov': ['krmne-vozy', 'dojici-roboti', 'podestylace'],
  'komunal-les': ['mulcovace', 'stepkovace', 'lesni-vyvazecky'],
};
```

### Část D: DB migrace

**Migrace 004** (`supabase/migrations/004_bazar_stroje_categories.sql`):
```sql
UPDATE bazar_listings SET category = 'seti' WHERE category = 'seci-stroje';
UPDATE bazar_listings SET category = 'ochrana-rostlin' WHERE category = 'postrikovace';
UPDATE bazar_listings SET category = 'doprava' WHERE category = 'privezy';
```

**Migrace 005** (`supabase/migrations/005_bazar_stroje_fields.sql`):
```sql
ALTER TABLE bazar_listings
  ADD COLUMN IF NOT EXISTS subcategory TEXT,
  ADD COLUMN IF NOT EXISTS nosnost_kg INTEGER,
  ADD COLUMN IF NOT EXISTS objem_nadrze_l INTEGER;

CREATE INDEX IF NOT EXISTS idx_bazar_listings_subcategory ON bazar_listings(subcategory);
CREATE INDEX IF NOT EXISTS idx_bazar_listings_nosnost_kg ON bazar_listings(nosnost_kg);
```

`cutting_width_m` zůstává jako sloupec — UI label se mění dle kategorie ("Pracovní záběr" vs "Šířka záběru kombajnu").

### Část E: Conditional form pole per kategorie

| Kategorie | Pole |
|---|---|
| traktory | model picker, rok, výkon (hp), motohodiny |
| kombajny | model picker, rok, výkon, motohodiny, šířka záběru |
| zpracovani-pudy | model picker, rok, **pracovní záběr (m)**, **počet radlic** (jen pluhy), **příkon traktoru (hp)**, hmotnost |
| seti | model picker, rok, pracovní záběr, **počet řádků**, příkon |
| hnojeni | model picker, rok, **objem nádrže/koše (l)**, příkon |
| ochrana-rostlin | model picker, rok, **objem nádrže (l)**, **záber ramen (m)**, motohodiny (samojízd.) |
| sklizen-picnin | model picker, rok, pracovní záběr, motohodiny (samojízd.), velikost balíku (lisy) |
| manipulace | model picker, rok, **nosnost (kg)**, **výška zdvihu (m)**, motohodiny, výkon (samojízd.) |
| doprava | model picker, rok, **nosnost (t)**, počet náprav |
| staj-chov | model picker, rok, **objem (m³)** |

JS layer toggle viditelnost při změně kategorie. Existující implementace traktorů/kombajnů rozšíří mapou.

---

## 9. Page templates

### Hub `/stroje/zemedelske-stroje/`
```
┌────────────────────────────────────────────────┐
│ Section label: ZEMĚDĚLSKÁ TECHNIKA              │
│ H1: Stroje pro zemědělství                      │
│ Stats: X modelů / Y značek / Z kategorií        │
├────────────────────────────────────────────────┤
│ "Hledáte podle účelu?" — grid 10 funkčních     │
│  ┌─────┐ ┌─────┐ ┌─────┐                        │
│  │Půda │ │Setí │ │Hnoj.│ ...                    │
│  └─────┘ └─────┘ └─────┘                        │
│  ┌─────┐ ┌─────┐ ┌─────┐                        │
│  │Postr│ │Pícn.│ │Okop.│ ...                    │
│  └─────┘ └─────┘ └─────┘                        │
├────────────────────────────────────────────────┤
│ "Nebo podle značky?" — grid 22 značek           │
│  Lemken / Pöttinger / Kuhn / Amazone / Krone /  │
│  Horsch / Väderstad / Bednar / Manitou / JCB /  │
│  Joskin / Kverneland + 6 traktorových...         │
└────────────────────────────────────────────────┘
+ BreadcrumbList JSON-LD
```

### Funkční skupina `/stroje/zemedelske-stroje/<group>/`
- Hero: název skupiny + popis + stats
- Grid 5-8 sub-kategorií (s ikonami a počty modelů)
- Grid značek které tuto skupinu vyrábí
- BreadcrumbList JSON-LD

### Sub-kategorie cross-brand `/stroje/<subcategory>/`
- Hero: název + popis + stats
- Filter panel (značka + per-subcategory filtry z `SUBCATEGORY_FILTERS`)
- Grid značek nahoře + grid modelů dole (filtrované)
- Layout analog stávající `/stroje/traktory/` (CategoryBrowse)

### Brand page `/stroje/<brand>/`
Rozšířená — přidá sekce per category (pluhy, podmítače, ...) **seskupené pod funkční skupinou** vizuálně:
- Sekce 1: Traktory (pokud existují)
- Sekce 2: Kombajny (pokud existují)
- Sekce 3: **Skupina** — podtitul "Zpracování půdy"
  - Sub-sekce: Pluhy → grid řad
  - Sub-sekce: Podmítače diskové → grid řad
  - ...
- Skip-nav linky nahoře pro rychlou navigaci

---

## 10. Implementační plán

### Fáze 0 — Data ingest pipeline (3-5 dní, NEW dle Hybrid free strategie)
**Cíl**: Maximální automatizace seedu — ušetřit ~120 h ručního zadávání. Viz Sekce 7 pro plnou strategii a pravidla legality.

| # | Soubor | Akce |
|---|---|---|
| 0.1 | `scripts/ingest/wikidata-brands.mjs` | NEW — SPARQL dotaz na Wikidata pro 18 značek (founded, country, parent, web). Output: `tmp/brands-wikidata.json`. |
| 0.2 | `scripts/ingest/fendt-techdata.mjs` | NEW — fetch `api.fendt.com/techdata` pro confirmed Fendt model IDs (12-15 modelů). Parser HTML → spec map. Cache v `tmp/cache/fendt/`. Rate 1 req/s + custom UA. |
| 0.3 | `scripts/ingest/sitemap-scraper.mjs` | NEW — generic sitemap-based scraper. Per-výrobce config v `scripts/ingest/sources/<brand>.mjs` (sitemap URL, JSON-LD selector, fallback HTML adapter). Respect robots.txt. Rate 1 req/s. UA `agro-svet-bot/1.0 (+https://agro-svet.cz/)`. Cache v `tmp/cache/<brand>/`. |
| 0.4 | `scripts/ingest/sources/lemken.mjs`, `horsch.mjs`, `pottinger.mjs`, `bednar.mjs`, `kuhn.mjs`, `amazone.mjs`, `krone.mjs`, `vaderstad.mjs`, `manitou.mjs`, `joskin.mjs`, `kverneland.mjs`, `jcb.mjs` | NEW — adapter per výrobce: sitemap URL, JSON-LD extraction strategy, HTML fallback selector. |
| 0.5 | `scripts/ingest/pdf-extract.mjs` | NEW — pipeline pro PDF brochures: stáhnout, `pdf-parse` text/tables, Claude API extraction → unified spec object. Confidence score per pole. |
| 0.6 | `scripts/ingest/cz-dealers.mjs` | NEW — scraper CZ velkodealerů (Strom, AGROTEC, Pekass, AGRALL, Daňhel) pro CZ-jazyčné popisky a lokální specs. |
| 0.7 | `scripts/ingest/build-yaml.mjs` | NEW — merger: kombinuje brand metadata (Wikidata) + model specs (Fendt API + sitemap + PDF) → výstup `tmp/seed-<brand>.yaml` pro ruční review. |
| 0.8 | `scripts/ingest/legality-checks.mjs` | NEW — pre-flight: ověří že robots.txt nemá Disallow na cílové cesty, rate-limit konfigurace přítomná, žádné login-protected URL. Hard-fail při porušení. |

**Pravidla legality** (závazná, viz Sekce 7):
- ✓ Rate 1 req/s vždy, custom UA `agro-svet-bot/1.0`, respect robots.txt
- ✓ Jen public stránky bez login
- ✓ Faktická data (HP, weight, dimensions) — fakta nejsou autorská
- ✓ Reformulace popisků (CZ vlastní text, ne copy-paste)
- ✓ PDF brochures: link na výrobce, NE rehost
- ✗ Žádné fotky scraping (Pexels/Unsplash placeholder, Kverneland Download Centre s licencí)
- ✗ Žádné dealer/partner APIs (CNH, JD, CLAAS, AGCO, Manitou portal)

**Output Fáze 0:** `tmp/seed-*.yaml` files s ~50-60 % pre-vyplněných specs. Manuální review + CZ popisky následují ve Fázi 2.

### Fáze 1 — Schema & loader (½ dne)
| Soubor | Akce |
|---|---|
| `src/lib/stroje.ts` | Rozšíření `StrojKategorie` enum o ~45 sub-kategorií. Přidat `FUNCTIONAL_GROUPS` mapu. Rozšířit `StrojModel` interface o nová universal pole. Přidat `getEffectiveZaber()` helper. Update `seriesFamily()`. |
| `src/lib/stroje-filters.ts` | NEW — `SUBCATEGORY_FILTERS` mapa (subcategory → FilterSpec[]). |
| `src/lib/spec-labels.ts` | NEW — pretty-print mapa specs klíčů na CZ labels. |

### Fáze 2 — YAML seed finishing (1-2 dny — REDUKOVÁNO díky Fázi 0)
Vstup: `tmp/seed-*.yaml` z Fáze 0 s pre-vyplněnými specs (~50-60 % polí). Manuální dokončení:
- Review automaticky vyplněných polí (confidence check, korekce chyb LLM extraction)
- Doplnění CZ popisků (~150 slov per model, vlastní text)
- Doplnění chybějících specs (rok výroby, hmotnost) z PDF nebo manuálu
- Lokální dostupnost / CZ dealer kontakt
- Přesunout finální YAML z `tmp/seed-*.yaml` do `src/data/stroje/<brand>.yaml`

### Fáze 3 — Hub a category stránky (1 den)
| Soubor | Akce |
|---|---|
| `src/pages/stroje/zemedelske-stroje/index.astro` | NEW — hub. |
| `src/pages/stroje/zemedelske-stroje/[group]/index.astro` | NEW — funkční skupina. |
| `src/pages/stroje/[subcategory]/index.astro` | NEW — sub-kategorie cross-brand. `getStaticPaths` ze všech subcategory slugů. |
| `src/components/stroje/CategoryBrowse.astro` | UPDATE — generic použití pro libovolnou category, ne jen traktory/kombajny. |
| `src/components/stroje/FunctionalGroupHub.astro` | NEW — komponenta pro hub stránky. |

### Fáze 4 — Brand a model stránky (½ dne)
| Soubor | Akce |
|---|---|
| `src/pages/stroje/[brand]/index.astro` | UPDATE — ordering kategorií, sub-headers per funkční skupina, skip-nav linky. |
| `src/pages/stroje/[brand]/rada/[category]/[family]/index.astro` | UPDATE — kontrola podpory nových subcategory slugů. |
| `src/pages/stroje/[brand]/[series]/[model]/index.astro` | UPDATE — spec table přes `SPEC_LABELS`, CTA na bazar s `subcategory` parametrem. |
| `src/pages/stroje/index.astro` | UPDATE — funkční skupiny do filter UI, stats refresh. |

### Fáze 5 — Header navigace (10 min)
| Soubor | Akce |
|---|---|
| `src/components/Header.astro` | Přidat **Stroje** položku do Technika dropdownu. |
| `src/components/ImageAccordion.astro` | (volitelné) Stroje panel link na `/stroje/zemedelske-stroje/`. |

### Fáze 6 — Bazar integrace (1 den)
| Soubor | Akce |
|---|---|
| `src/lib/bazar-constants.ts` | Rozšíření CATEGORIES (19), BRANDS (22), nová `BAZAR_TO_CATALOG_SUBCATEGORIES`. |
| `supabase/migrations/004_bazar_stroje_categories.sql` | NEW — UPDATE rename existujících kategorií. |
| `supabase/migrations/005_bazar_stroje_fields.sql` | NEW — ADD COLUMN subcategory, nosnost_kg, objem_nadrze_l + indexy. |
| `src/lib/bazar-catalog.ts` | UPDATE — `getModelOptions(category, subcategory?)`. |
| `src/components/bazar/CatalogPicker.astro` | UPDATE — 2 filter eventy. |
| `src/components/bazar/BazarFilters.astro` | UPDATE — conditional filtry per kategorie. |
| `src/components/bazar/BazarListingRow.astro` | UPDATE — render nových polí v meta řádce. |
| `src/pages/bazar/novy.astro` + `src/pages/bazar/moje/[id]/index.astro` | UPDATE — conditional pole per kategorie + JS toggle. |
| `src/pages/bazar/[id].astro` | UPDATE — spec strip + catalog-link box. |
| `src/pages/bazar/index.astro` | UPDATE — query rozšíří, filter URL sync. |

### Fáze 7 — SEO & polish (½ dne)
| Soubor | Akce |
|---|---|
| `src/pages/sitemap.xml.ts` | Přidat všechny nové URL (~250+). |
| BreadcrumbList JSON-LD | Na hub, group, subcategory, brand × subcategory × series × model. |
| Layout meta description per kategorie | Konkrétní popisy pro SEO. |

### Fáze 8 — Deploy a smoke test (½ dne)
| Akce |
|---|
| `npm run build` — overit prerendering (~500 nových stránek). |
| Lokální smoke: hub, group, subcategory, brand, brand×subcategory, model. |
| Supabase: aplikovat migrace 004 a 005 přes SQL editor. |
| `npx wrangler deploy` z master, smoke test produkce. |

### Souhrnný odhad
| Fáze | Odhad |
|---|---|
| 0. Data ingest pipeline (Hybrid free) | **3-5 dní** (setup) |
| 1. Schema & loader | 0,5 dne |
| 2. YAML seed finishing | **1-2 dny** (REDUKOVÁNO díky Fázi 0) |
| 3. Hub + category stránky | 1 den |
| 4. Brand/model update | 0,5 dne |
| 5. Header nav | 10 min |
| 6. Bazar integrace | 1 den |
| 7. SEO polish | 0,5 dne |
| 8. Deploy | 0,5 dne |
| **Total** | **8-11 dní** (cca 6-8 dní intenzivně) |

**Trade-off Hybrid free vs Pure manual:** +3-5 dní setup, −2-3 dny YAML seed → net +0-2 dny. Hodnota: ~120 h labor saved při budoucím rozšíření o další značky (pipeline znovu použitelný), plus konzistence dat (LLM extraction = stejný formát napříč značkami).

---

## 11. Risk register

| Riziko | Mitigace |
|---|---|
| Build time (Astro static prerendering) — současný 60s, +500 stránek může vést k 2-3 min | Akceptovatelné, monitorovat. Pokud přesáhne 5 min, lazy-load brand pages přes ISR. |
| YAML data quality (slug konflikty, missing fields) | Loader logsuje warning na missing slug. Před deployem `node scripts/validate-stroje-yaml.mjs` (NEW). |
| Bazar migrace 004 (rename kategorií) destruktivní | Pre-deploy backup tabulky `bazar_listings` (Supabase point-in-time recovery). Migrace idempotent (spuštěná podruhé nezpůsobí škodu — UPDATE už neodpovídá). |
| Existující inzeráty s `cutting_width_m` zůstanou používat sloupec — UI labelling musí být kontextový | Render label dle `category` v komponentě. |
| Některé funkční skupiny v MVP "tenké" (sklizeň okopanin = 0 značek) | Označit jako "Připravujeme" dlaždici v hub UI s linkem na fáze 2 backlog. |
| **Fendt undocumented API (`api.fendt.com/techdata`) může kdykoli zmizet** | Cache responses lokálně (1 fetch = forever pro dev). Po Fázi 0 už máme data. Pokud zmizí před Fází 0, fallback na sitemap+JSON-LD scraping pro Fendt. |
| **Sitemap scraping některých výrobců neúspěšný** (no JSON-LD, custom HTML) | Per-výrobce adapter v `scripts/ingest/sources/`. Pokud weby nemají strukturovaná data, fallback na PDF brochures + manual extrakce. Nikdy nelámat rate limit. |
| **LLM extraction z PDF nepřesné** (Claude API občas misinterpretuje tabulky) | Confidence score per pole + manuální review. Nedůvěřovat hodnotám pod 0.7. Vždy cross-check s druhým zdrojem. |
| **robots.txt update na výrobce webu mid-scraping** | Pre-flight `legality-checks.mjs` před každou ingest run. Hard-fail na nový Disallow. |
| **Spam/abuse z výrobce webu** (rate misjudged → IP blocked) | Custom UA umožňuje výrobci kontaktovat (mailto v UA). 1 req/s konzervativně. Cache lokálně, žádné re-fetch. Když incident, manuálně uvarovit výrobce přes dealer kontakt. |

---

## 12. Příští kroky

1. **User review tohoto spec dokumentu** — zda nechybí něco podstatného, jiné značky/kategorie, jiné edge case rozhodnutí.
2. **`writing-plans` skill** — vytvoří detailní implementační plán s task-level breakdown, dependency graph, atomic commits per task.
3. **Implementace** — fáze 1-8 dle odhadu výše.

---

## Reference

- [Mascus.cz - kategorie zemědělské techniky](https://www.mascus.cz/main-category/zemedelske-stroje)
- [Bazoš.cz - zemědělská technika](https://stroje.bazos.cz/zemedelska/)
- [Pöttinger CZ produkty](https://www.poettinger.at/cs_cz/produkte/)
- [Lemken portfolio](https://lemken.com/en/products/)
- [Kuhn agricultural machinery](https://www.kuhn.com/en/agricultural-machinery)
- [Krone produkty](https://www.krone-agriculture.com/cs/vyrobni-program/)
- [Bednar produkty](https://www.bednar.com/en/products/)
- [Existující agro-bazar design](2026-04-20-agro-bazar-design.md)
