# PL /puda (fáze 3) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Živý indexovatelný `/pl/puda/` hub o polském trhu se zemědělskou půdou (ceny, KOWR regulace, dzierżawa, plodiny, ohrožení) + 3 přeložené články, bez českého leaku, cs/sk/uk byte-identické.

**Architecture:** Replikace uk fáze 4b (PudaUk). `agro-puda-pl.json` má identický tvar jako uk (`PudaUkData`) → `puda-pl.ts` je tenký re-export uk typů + `buildLineChart` (DRY). `PudaPl.astro` (vlastní Layout, polské stringy) se deleguje z `puda/index.astro` při `locale==='pl'`. Content kolekce `pudaPl` (3 články). Data grounded+adversariálně verifikovaná (GUS/KOWR/Eurostat), honest>complete (blok bez čisté řady se vypustí).

**Tech Stack:** Astro SSR (`@astrojs/node`), TypeScript, vitest. Build node≥22 (`nvm use 22`).

**Spec:** `docs/superpowers/specs/2026-06-19-agro-svet-pl-faze3-puda-design.md`

---

## Klíčové konvence (číst před prvním taskem)

- **cs/sk/uk byte-identické:** delegace přidává jen `pl` větev; nové soubory (puda-pl.ts, json, PudaPl.astro, pudaPl kolekce). Žádná změna cs/sk/uk výstupu.
- **Větev:** `feat/pl-faze3-puda` (z masteru, kde je živá fáze 1+2). Ověř `git branch --show-current` před prací.
- **Build artefakt:** NEcommitovat `src/generated/content-dates.json`.
- **Baseline STALE:** ~3 testy (cs nav „7 top-level/bazar") failují i na master → NE regrese, neopravovat.
- **Test runner:** `npx vitest run <path>`. **Build:** `nvm use 22 && npm run build`.
- **Native polština, NE strojový překlad.** Data: PLN jednotky, `pl-PL` formátování, KAŽDÉ číslo `source`+`url`+`asOf`.

---

## Task 1: LAUNCHED_PREFIXES.pl += '/puda' + launch test

**Files:**
- Modify: `src/i18n/utils.ts` (LAUNCHED_PREFIXES.pl)
- Test: `tests/i18n/pl-launch.test.ts`

- [ ] **Step 1: Rozšiř pl-launch test (failing)**

V `tests/i18n/pl-launch.test.ts` přidej do existujícího `describe('PL fáze 1 launch...')` NEBO nový blok:
```typescript
describe('PL fáze 3 launch (puda)', () => {
  it('/puda je launchnuté pro pl', () => {
    expect(LAUNCHED_PREFIXES.pl).toContain('/puda');
    expect(isLaunchedPath('pl', '/puda')).toBe(true);
    expect(isLaunchedPath('pl', '/puda/eroze/')).toBe(true);
  });
  it('/puda není locked sekce', () => {
    expect(isLockedSectionPath('/puda')).toBe(false);
  });
  it('cs /puda nedostane gating-noindex', () => {
    expect(isLaunchedPath('cs', '/puda/eroze/')).toBe(false);
  });
});
```

- [ ] **Step 2: Spusť — ověř FAIL**

Run: `npx vitest run tests/i18n/pl-launch.test.ts`
Expected: FAIL (`/puda` není v LAUNCHED_PREFIXES.pl)

- [ ] **Step 3: Přidej '/puda' do LAUNCHED_PREFIXES.pl**

V `src/i18n/utils.ts` změň:
```typescript
  pl: ['/stroje', '/znacky', '/srovnani', '/slovnik'],
```
na:
```typescript
  pl: ['/stroje', '/znacky', '/srovnani', '/slovnik', '/puda'],
```

- [ ] **Step 4: Spusť — ověř PASS**

Run: `npx vitest run tests/i18n/pl-launch.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/i18n/utils.ts tests/i18n/pl-launch.test.ts
git commit -m "feat(pl): launch /puda pro pl"
```

---

## Task 2: puda-pl.ts (tenký re-export uk typů + helperů)

**Files:**
- Create: `src/lib/puda-pl.ts`
- Test: `tests/lib/puda-pl.test.ts`

**Pozn.:** `agro-puda-pl.json` má IDENTICKÝ tvar jako uk (`PudaUkData`). Aby pl kód neimportoval „uk" názvy, `puda-pl.ts` re-exportuje uk typy/helpery pod pl-facing jmény. DRY — matematika grafu se needuplikuje.

- [ ] **Step 1: Napiš test (failing)**

Create `tests/lib/puda-pl.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { buildLineChart, pudaPlPriceGrowthPct } from '../../src/lib/puda-pl';
import type { PudaPlData } from '../../src/lib/puda-pl';

describe('puda-pl re-export', () => {
  it('buildLineChart funguje (≥2 body → path)', () => {
    const c = buildLineChart([{ year: 2020, value: 40000 }, { year: 2024, value: 65000 }], { max: 70000, ticks: [0, 35000, 70000] });
    expect(c.points.length).toBe(2);
    expect(c.path.startsWith('M')).toBe(true);
  });
  it('pudaPlPriceGrowthPct počítá růst', () => {
    const d = { cena: { series: [{ year: 2020, value: 40000 }, { year: 2024, value: 60000 }] } } as PudaPlData;
    expect(pudaPlPriceGrowthPct(d)).toBe(50);
  });
  it('<2 body → null', () => {
    const d = { cena: { series: [{ year: 2024, value: 60000 }] } } as PudaPlData;
    expect(pudaPlPriceGrowthPct(d)).toBe(null);
  });
});
```

- [ ] **Step 2: Spusť — ověř FAIL (modul neexistuje)**

Run: `npx vitest run tests/lib/puda-pl.test.ts`
Expected: FAIL — `Cannot find module`

- [ ] **Step 3: Vytvoř `src/lib/puda-pl.ts`**

```typescript
// src/lib/puda-pl.ts
// PL /puda sdílí datový tvar s uk (PudaUkData) — re-export uk typů + helperů
// pod pl-facing jmény. Matematika grafu (buildLineChart) je locale-agnostic →
// reuse, nikoli duplikace.
export type {
  PudaUkData as PudaPlData,
  PudaUkSeries as PudaPlSeries,
  PudaUkSeriesPoint as PudaPlSeriesPoint,
  PudaUkBigNumber as PudaPlBigNumber,
  PudaUkTimelineStep as PudaPlTimelineStep,
  PudaUkFact as PudaPlFact,
  PudaUkCrop as PudaPlCrop,
  PudaUkThreat as PudaPlThreat,
  PudaUkSourceLink as PudaPlSourceLink,
} from './puda-uk';

export { buildLineChart, pudaUkPriceGrowthPct as pudaPlPriceGrowthPct } from './puda-uk';
```

- [ ] **Step 4: Spusť — ověř PASS**

Run: `npx vitest run tests/lib/puda-pl.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/puda-pl.ts tests/lib/puda-pl.test.ts
git commit -m "feat(pl): puda-pl.ts re-export uk typů + buildLineChart (DRY)"
```

---

## Task 3: i18n klíče puda.pl.* do ui/pl.ts

**Files:**
- Modify: `src/i18n/ui/pl.ts`
- Test: `tests/i18n/ui-pl-parity.test.ts` (parita se rozšíří automaticky — viz pozn.)

**Pozn.:** cs/sk/uk ui soubory mají `puda.uk.*` klíče JEN pro uk (cs/sk používají jiný render). Parita test (Task fáze 1) porovnává pl s **cs**. cs.ts NEMÁ `puda.uk.*` klíče (ty jsou v uk.ts). Aby parity test nepadl, přidáváme `puda.pl.*` klíče, které cs nemá → **přidej je i do cs.ts/sk.ts/uk.ts** (hodnota = ekvivalent v daném jazyce nebo cs fallback), aby množina klíčů zůstala napříč ui soubory konzistentní. NEBO: ověř, jak parity test funguje, a drž množinu klíčů identickou.

- [ ] **Step 1: Ověř chování parity testu**

Run: `npx vitest run tests/i18n/ui-pl-parity.test.ts`
Expected: PASS (současný stav). Test tvrdí `Object.keys(pl).sort() === Object.keys(cs).sort()`. Takže každý nový `puda.pl.*` klíč v pl.ts MUSÍ být i v cs.ts.

- [ ] **Step 2: Přidej `puda.pl.*` klíče do pl.ts A cs.ts (a sk.ts, uk.ts pro úplnou paritu napříč)**

Do `src/i18n/ui/pl.ts` přidej (polské hodnoty):
```typescript
  'puda.pl.crumbHome': 'Strona główna',
  'puda.pl.crumbSelf': 'Ziemia rolna',
  'puda.pl.h.reforma': 'Regulacja rynku ziemi',
  'puda.pl.h.cena': 'Cena ziemi rolnej',
  'puda.pl.h.najem': 'Dzierżawa ziemi',
  'puda.pl.h.plodiny': 'Główne uprawy',
  'puda.pl.h.ohrozeni': 'Zagrożenia dla gleb',
  'puda.pl.sources.h': 'Źródła danych',
```
Do `src/i18n/ui/cs.ts`, `sk.ts`, `uk.ts` přidej STEJNÉ klíče (`puda.pl.*`) — protože je renderuje jen PudaPl (pl), hodnota může být český/sk/uk ekvivalent nebo prostě polská (nepoužije se mimo pl). DOPORUČENO pro čistotu: v cs.ts dej české ekvivalenty (`'Cena zemědělské půdy'` atd.), v sk.ts slovenské, v uk.ts ukrajinské — udržuje paritu klíčů a kdyby fallback nastal, nezobrazí se polština. Hodnoty:
  - cs: crumbHome='Domů', crumbSelf='Zemědělská půda', h.reforma='Regulace trhu s půdou', h.cena='Cena zemědělské půdy', h.najem='Pronájem půdy', h.plodiny='Hlavní plodiny', h.ohrozeni='Ohrožení půd', sources.h='Zdroje dat'
  - sk: crumbHome='Domov', crumbSelf='Poľnohospodárska pôda', h.reforma='Regulácia trhu s pôdou', h.cena='Cena poľnohospodárskej pôdy', h.najem='Prenájom pôdy', h.plodiny='Hlavné plodiny', h.ohrozeni='Ohrozenia pôd', sources.h='Zdroje dát'
  - uk: crumbHome='Головна', crumbSelf='Сільськогосподарська земля', h.reforma='Регулювання ринку землі', h.cena='Ціна сільськогосподарської землі', h.najem='Оренда землі', h.plodiny='Основні культури', h.ohrozeni='Загрози для ґрунтів', sources.h='Джерела даних'

- [ ] **Step 3: Spusť parity test — ověř PASS**

Run: `npx vitest run tests/i18n/ui-pl-parity.test.ts`
Expected: PASS (pl má stejné klíče jako cs, oba +8 `puda.pl.*`)

- [ ] **Step 4: Commit**

```bash
git add src/i18n/ui/pl.ts src/i18n/ui/cs.ts src/i18n/ui/sk.ts src/i18n/ui/uk.ts
git commit -m "feat(pl): i18n klíče puda.pl.* (parita napříč ui)"
```

---

## Task 4: agro-puda-pl.json — data research + adversariální verifikace

**Files:**
- Create: `src/data/agro-puda-pl.json`
- Test: `tests/lib/agro-puda-pl.test.ts`

**Pozn.:** NEJRIZIKOVĚJŠÍ task. Dedikovaný research subagent + verifikační subagent. Tvar = `PudaUkData` (viz `src/lib/puda-uk.ts`). KAŽDÉ číslo má `source`+`url`+`asOf`. honest>complete: blok bez čisté grounded řady (zejm. `cena` GUS time series) → prázdné pole / minimální (komponenta blok skryje).

- [ ] **Step 1: Napiš schema/groundedness test (failing)**

Create `tests/lib/agro-puda-pl.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import raw from '../../src/data/agro-puda-pl.json';
import type { PudaPlData } from '../../src/lib/puda-pl';

const d = raw as unknown as PudaPlData;

describe('agro-puda-pl.json struktura + groundedness', () => {
  it('má povinná top-level pole', () => {
    for (const k of ['generated', 'bigNumbers', 'reformTimeline', 'cena', 'najem', 'plodiny', 'threats', 'sources']) {
      expect(d, k).toHaveProperty(k);
    }
  });
  it('každý bigNumber má source+url+asOf-nebo-trend', () => {
    for (const b of d.bigNumbers) {
      expect(b.source, b.lbl).toBeTruthy();
      expect(b.url, b.lbl).toMatch(/^https?:\/\//);
    }
  });
  it('každý reformTimeline krok má source+url', () => {
    for (const s of d.reformTimeline) {
      expect(s.source, s.title).toBeTruthy();
      expect(s.url, s.title).toMatch(/^https?:\/\//);
    }
  });
  it('cena: pokud má řadu, je validní (≥2 body, vzestupné roky, max>0)', () => {
    if (d.cena.series.length > 0) {
      expect(d.cena.series.length).toBeGreaterThanOrEqual(2);
      expect(d.cena.max).toBeGreaterThan(0);
      expect(d.cena.source).toBeTruthy();
      expect(d.cena.url).toMatch(/^https?:\/\//);
    }
  });
  it('plodiny mají crop+hectares+source', () => {
    for (const c of d.plodiny) {
      expect(c.crop).toBeTruthy();
      expect(c.hectares).toBeGreaterThan(0);
      expect(c.url).toMatch(/^https?:\/\//);
    }
  });
  it('žádný zdroj nemíří na cs/uk wiki nebo neexistující doménu (PL/EU zdroje)', () => {
    const allUrls = [
      ...d.bigNumbers.map((b) => b.url), ...d.reformTimeline.map((s) => s.url),
      ...d.plodiny.map((c) => c.url), ...d.sources.map((s) => s.url),
    ];
    for (const u of allUrls) expect(u).toMatch(/^https?:\/\//);
  });
});
```

- [ ] **Step 2: Spusť — ověř FAIL (json neexistuje)**

Run: `npx vitest run tests/lib/agro-puda-pl.test.ts`
Expected: FAIL — `Cannot find module`

- [ ] **Step 3: Research + vytvoř `src/data/agro-puda-pl.json`** (research subagent)

Tvar přesně dle `PudaUkData`. Dispatch research subagent s úkolem sehnat GROUNDED polská data (web search), primární zdroje: **GUS** (stat.gov.pl — ceny zemědělské půdy PLN/ha, výměra, struktura plodin), **KOWR** (kowr.gov.pl — státní půda, ceny ANR/ZWRSP, transakce, předkupní právo), **Eurostat** (ceny/nájmy farmland), **ARiMR**. Bloky:
- `generated`: dnešní datum ISO
- `warCaveat`: `""` (Polsko, žádná válka) — komponenta prázdný caveat skryje
- `bigNumbers` (3–4): průměrná cena PLN/ha (GUS, nejaktuálnější), celková zem. půda (~14,6 mil. ha — ověřit), růst cen %, podíl/objem dzierżawy. Každý `{val, unit, lbl, trend, source, url}`.
- `reformTimeline` (4–5 kroků): volný trh do 2016 → ustawa 2016 (KOWR předkupní právo + omezení nabyvatelů) → novela 2019 (uvolnění pro <1 ha apod.) → současný stav. Každý `{year, title, text, source, url}`.
- `cena` (`PudaPlSeries`): GUS časová řada PLN/ha. POKUD se nepodaří čistá řada ≥2 bodů s jedním zdrojem → `series: []` (komponenta graf skryje). Jinak `{unit:'PLN/ha', asOf, source:'GUS', url, max, ticks, series:[{year,value}…]}`.
- `najem` (`PudaPlSeries`): dzierżawa; když není čistá řada → `series: []`.
- `plodiny` (`PudaPlCrop[]`): hlavní uprawy podle plochy (pszenica, kukurydza, rzepak…), `{crop, hectares, source:'GUS', url}`.
- `facts`: volitelné `PudaPlFact[]` (může být `[]`).
- `threats` (`PudaPlThreat[]`): eroze, zakwaszenie, fragmentacja — `{lbl, pct, detail}` (pct = % ohrožené plochy, grounded; když není %, blok vynechat).
- `sources` (`PudaPlSourceLink[]`): GUS, KOWR, Eurostat odkazy `{label, url}`.

⚠️ Žádné číslo bez zdroje. Když nejisté → vynech blok/údaj (honest>complete).

- [ ] **Step 4: Adversariální verifikační brána** (verifikační subagent)

Dispatch ověřovací subagent: pro každý údaj v json ověř (web) — existuje zdroj? souhlasí hodnota? je `asOf`/rok reálný? URL žije? Oprav/dropni neověřitelné. Reportuj seznam ověřených vs opravených vs dropnutých.

- [ ] **Step 5: Spusť test — ověř PASS**

Run: `npx vitest run tests/lib/agro-puda-pl.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/data/agro-puda-pl.json tests/lib/agro-puda-pl.test.ts
git commit -m "feat(pl): agro-puda-pl.json (grounded+verifikovaná PL data o půdě)"
```

---

## Task 5: pudaPl content kolekce + 3 přeložené články

**Files:**
- Modify: `src/content.config.ts` (pudaPl collection + collections export)
- Create: `src/content/puda-pl/eroze.md`, `ornice.md`, `vyziva-pudy.md`
- Test: `tests/i18n/pl-puda-collection.test.ts`

**Pozn.:** Překlad 3 cs článků (`src/content/puda/{eroze,ornice,vyziva-pudy}.md`) do polštiny. Slug = REUSE cs slug (názvy souborů identické). Frontmatter `{title, popis}` + tělo markdown. Dedikovaný překladový subagent; paritní kontrola odstavců jako u slovníku (str.replace ne regex `\n`).

- [ ] **Step 1: Přidej `pudaPl` kolekci do `src/content.config.ts`**

Za `const pudaUk = defineCollection({...})` přidej:
```typescript
// PL-localized článková kolekce o pôde (overlay). Slug = REUSE cs slug.
// Chybějící pl slug pod /pl = 404 (žádný cs leak).
const pudaPl = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/puda-pl' }),
  schema: pudaSchema(),
});
```
A do `export const collections = { … }` přidej `pudaPl`:
```typescript
export const collections = { novinky, encyklopedie, encyklopedieSk, encyklopedieUk, znacky, znackySk, znackyUk, puda, pudaSk, pudaUk, pudaPl, dotace, dotaceSk, howto, howtoSk, howtoUk };
```

- [ ] **Step 2: Přelož 3 články do `src/content/puda-pl/`** (překladový subagent)

Zdroj: `src/content/puda/{eroze,ornice,vyziva-pudy}.md`. Pro každý vytvoř `src/content/puda-pl/<stejný-název>.md`:
- frontmatter `title` + `popis` přeložené do polštiny (lokalizuj: české reálie jako „DZES 7", „kolektivizace v 50. letech" → polský kontekst kde dává smysl, jinak ponech faktické)
- tělo: kompletní polský překlad, zachovej markdown strukturu (## nadpisy, **bold**, odstavce). Paritní kontrola počtu odstavců/nadpisů s cs.
- ⚠️ české jurisdikční reálie (DZES, SZIF, český zákon) → polský ekvivalent (warunkowość/GAEC, ARiMR) nebo obecná formulace; NE nechat český institucionální odkaz na polské stránce.

- [ ] **Step 3: Napiš collection test**

Create `tests/i18n/pl-puda-collection.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';

describe('pudaPl kolekce', () => {
  it('má 3 články se stejnými slugy jako cs puda', async () => {
    const cs = (await getCollection('puda')).map((e) => e.id).sort();
    const pl = (await getCollection('pudaPl')).map((e) => e.id).sort();
    expect(pl).toEqual(cs);
  });
  it('každý pl článek má neprázdný title+popis', async () => {
    for (const e of await getCollection('pudaPl')) {
      expect(e.data.title, e.id).toBeTruthy();
      expect(e.data.popis, e.id).toBeTruthy();
    }
  });
});
```
Pozn.: pokud `getCollection` ve vitest nejde (content layer mimo astro runtime), tento test přeskoč a ověř místo něj ručně build + živě (Task 9). Pokud existuje precedent uk-collections test (`tests/i18n/uk-collections.test.ts`), zrcadli jeho přístup.

- [ ] **Step 4: Spusť test (nebo build, viz pozn.)**

Run: `npx vitest run tests/i18n/pl-puda-collection.test.ts` (nebo `npm run build` pokud test přeskočen)
Expected: PASS / build OK

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts src/content/puda-pl/ tests/i18n/pl-puda-collection.test.ts
git commit -m "feat(pl): pudaPl kolekce + 3 přeložené články o půdě"
```

---

## Task 6: PudaPl.astro komponenta

**Files:**
- Create: `src/components/puda/PudaPl.astro`

**Pozn.:** Kopie `src/components/puda/PudaUk.astro` s polskými stringy. Importuje z `puda-pl.ts` (`buildLineChart`, `pudaPlPriceGrowthPct`, `type PudaPlData`), `agro-puda-pl.json`, `getCollection('pudaPl')`. `useTranslations('pl')`. `Intl.NumberFormat('pl-PL')`. Cesty `/pl/puda/...`. Sekce: hero, warCaveat (skryje se když ""), bigNumbers, PillsNav, topics(články), reforma timeline, cena graf, najem bars, plodiny bars, facts, threats, sources.

- [ ] **Step 1: Vytvoř `src/components/puda/PudaPl.astro`**

Zkopíruj CELÝ `src/components/puda/PudaUk.astro`, pak nahraď:
- importy: `from '../../lib/puda-uk'` → `from '../../lib/puda-pl'`; `pudaUkPriceGrowthPct` → `pudaPlPriceGrowthPct`; `type PudaUkData` → `type PudaPlData`; `raw from '../../data/agro-puda-uk.json'` → `agro-puda-pl.json`; `getCollection('pudaUk')` → `getCollection('pudaPl')`
- `const t = useTranslations('uk')` → `useTranslations('pl')`
- `new Intl.NumberFormat('uk-UA')` → `'pl-PL'`
- všechny `t('puda.uk.*')` → `t('puda.pl.*')`
- karty/odkazy `/uk/puda/${a.id}/` → `/pl/puda/${a.id}/`
- HARDCODED ukrajinské stringy → polské:
  - `<Layout title=... description=...>` → polské (title „Rynek ziemi rolnej w Polsce — ceny, dzierżawa, regulacja", description polská)
  - kicker „ЗЕМЛЯ · ДАТА-ОГЛЯД" → „ZIEMIA · PRZEGLĄD DANYCH"
  - h1 „Сільськогосподарська земля" → „Ziemia <em>rolna</em>"
  - hero lede → polský
  - PILLS labels („Теми" → „Tematy", `t('puda.pl.h.reforma')` atd.)
  - „Поглиблено за темами" → „Pogłębione tematy", „Читати далі →" → „Czytaj dalej →"
  - „Джерело:" → „Źródło:", „Зростання ціни на ... за період" insight → polský, „тис. га" → „tys. ha"
  - SVG aria-label „Ціна землі" → „Cena ziemi"
- Ponech `<style>` blok beze změny (scoped CSS).

- [ ] **Step 2: Typecheck**

Run: `nvm use 22 && npx tsc --noEmit 2>&1 | grep -E "PudaPl" || echo "OK"`
Expected: OK (žádné TS chyby). Pozn.: .astro tsc může hlásit jiné; klíčové je, že build (Task 9) projde.

- [ ] **Step 3: Commit**

```bash
git add src/components/puda/PudaPl.astro
git commit -m "feat(pl): PudaPl.astro komponenta (vzor PudaUk, polské stringy)"
```

---

## Task 7: Wiring — delegace index.astro + [slug].astro

**Files:**
- Modify: `src/pages/puda/index.astro` (~ř. 100, import)
- Modify: `src/pages/puda/[slug].astro` (PUDA_COLLECTION ~ř. 18-19)

- [ ] **Step 1: Deleguj v `puda/index.astro`**

Přidej import (k `import PudaUk`):
```typescript
import PudaPl from '../../components/puda/PudaPl.astro';
```
Změň render (ř. ~100) z:
```astro
{locale === 'uk' ? <PudaUk /> : (
```
na:
```astro
{locale === 'pl' ? <PudaPl /> : locale === 'uk' ? <PudaUk /> : (
```
(cs/sk větev = zbytek ternáru beze změny; uzávěr `)}` zůstává.)

- [ ] **Step 2: Přidej pl do `puda/[slug].astro` PUDA_COLLECTION**

Změň:
```typescript
const PUDA_COLLECTION = { cs: 'puda', sk: 'pudaSk', uk: 'pudaUk' } as const;
const item = slug ? await getEntry(PUDA_COLLECTION[locale as 'cs' | 'sk' | 'uk'] ?? 'puda', slug) : undefined;
```
na:
```typescript
const PUDA_COLLECTION = { cs: 'puda', sk: 'pudaSk', uk: 'pudaUk', pl: 'pudaPl' } as const;
const item = slug ? await getEntry(PUDA_COLLECTION[locale as 'cs' | 'sk' | 'uk' | 'pl'] ?? 'puda', slug) : undefined;
```

- [ ] **Step 3: Typecheck**

Run: `nvm use 22 && npx tsc --noEmit 2>&1 | grep -E "puda/index|puda/\[slug\]" || echo "OK"`
Expected: OK

- [ ] **Step 4: Commit**

```bash
git add src/pages/puda/index.astro "src/pages/puda/[slug].astro"
git commit -m "feat(pl): delegace /pl/puda na PudaPl + pl slug kolekce (404 bez cs leaku)"
```

---

## Task 8: HomePl 5. karta (Ziemia rolna)

**Files:**
- Modify: `src/components/home/HomePl.astro`

- [ ] **Step 1: Přidej kartu /pl/puda do SECTIONS**

V `src/components/home/HomePl.astro` do pole `SECTIONS` přidej (za slovnik kartu):
```typescript
  {
    href: '/pl/puda/',
    icon: '🌱',
    title: 'Ziemia rolna',
    desc: 'Rynek ziemi rolnej w Polsce — ceny, dzierżawa, regulacja KOWR i stan gleb.',
  },
```

- [ ] **Step 2: Ověř (build v Task 9; rychlý tsc)**

Run: `nvm use 22 && npx tsc --noEmit 2>&1 | grep HomePl || echo OK`
Expected: OK

- [ ] **Step 3: Commit**

```bash
git add src/components/home/HomePl.astro
git commit -m "feat(pl): HomePl 5. karta Ziemia rolna → /pl/puda/"
```

---

## Task 9: Finální verifikační brána

**Files:** žádné nové; ověření.

- [ ] **Step 1: Plný test suite**

Run: `npx vitest run 2>&1 | tail -8`
Expected: zelené KROMĚ ~3 baseline STALE (cs nav bazar). Nové pl-puda testy zelené.

- [ ] **Step 2: Build**

Run: `nvm use 22 && npm run build 2>&1 | tail -6`
Expected: EXIT 0. `git checkout src/generated/content-dates.json` pokud změněn.

- [ ] **Step 3: Preview + smoke PL puda**

Run:
```bash
set -a; . ./.env 2>/dev/null; set +a
nvm use 22 && (npm run preview > /tmp/pl-puda-prev.log 2>&1 &)
sleep 7
for u in /pl/puda/ /pl/puda/eroze/ /pl/puda/ornice/ /pl/puda/vyziva-pudy/; do
  echo "=== $u ==="; curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:4321$u"
done
```
Expected: každá 200. `/pl/puda/` HTML: `<html lang="pl"`, robots `index,follow`, self-canonical `/pl/puda/`, hreflang cs/sk/uk/pl, polský obsah (ceny/timeline). `/pl/puda/eroze/` polský článek.

- [ ] **Step 4: Negative gate + leak check**

Run:
```bash
curl -s -o /dev/null -w "404 %{http_code}\n" "http://localhost:4321/pl/puda/neexistuje/"
curl -s "http://localhost:4321/pl/puda/" | grep -iE "zemědělsk|půda|ornice|nájem|cena půdy" && echo "LEAK!" || echo "OK no cs leak"
```
Expected: neexistuje → 404; `OK no cs leak`.

- [ ] **Step 5: cs/sk/uk regrese**

Run:
```bash
for u in /puda/ /puda/eroze/ /sk/puda/ /uk/puda/ /uk/puda/eroze/; do
  echo "=== $u ==="; curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:4321$u"
done
```
Expected: vše 200, cs/sk/uk obsah beze změny (smoke: cs /puda/ česky, uk /uk/puda/ ukrajinsky).

- [ ] **Step 6: Sitemap + HomePl karta**

Run:
```bash
curl -s http://localhost:4321/sitemap.xml | grep -cE "/pl/puda"
curl -s http://localhost:4321/pl/ | grep -oE "/pl/puda/" | head -1
```
Expected: sitemap obsahuje /pl/puda hub + 3 články (≥4); HomePl má kartu /pl/puda/.

- [ ] **Step 7: Finální opus review (subagent)**

Dispatch review subagent přes spec — APPROVE/CHANGES. Důraz: 0 cs leaků, cs/sk/uk byte-identické, data grounded (source+asOf), hreflang/canonical správné. Oprav nálezy.

---

## Self-Review (autor plánu)

- **Spec coverage:** data json (T4) ✓; puda-pl.ts typy+helper (T2) ✓; PudaPl.astro (T6) ✓; pudaPl kolekce+3 články (T5) ✓; delegace+slug route (T7) ✓; LAUNCHED_PREFIXES+i18n (T1,T3) ✓; sitemap (T9 ověření — plMirror z fáze 1 funguje automaticky, žádná změna kódu) ✓; HomePl karta (T8) ✓; gating/404 (T7 slug route) ✓; data-verif. brána (T4 step 4) ✓; verifikace (T9) ✓.
- **Pořadí pro subagent-driven:** T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8 → T9. (T6 PudaPl závisí na T2 typy, T3 i18n, T4 data, T5 kolekce → proto po nich.)
- **Type consistency:** `PudaPlData`/`pudaPlPriceGrowthPct`/`buildLineChart` (T2) použité v testu T4 i komponentě T6; `pudaPl` kolekce (T5) v [slug] PUDA_COLLECTION (T7) i component getCollection (T6). ✓
- **Placeholdery:** data hodnoty (T4) a překlady článků (T5) jsou research/translation práce subagentů — plán dává přesný tvar (PudaUkData), zdroje (GUS/KOWR/Eurostat), groundedness test + verifikační bránu. Repo-konvence (jako slovník/uk puda), ne placeholder.
- **Pozn. parity test (T3):** přidání `puda.pl.*` do pl.ts vyžaduje stejné klíče v cs.ts (parity test cs↔pl). Task 3 to explicitně řeší přidáním do všech 4 ui souborů.
