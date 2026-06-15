# UK fáze 4c — `/uk/statistiky` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lokalizovat `/statistiky` do ukrajinštiny jako kurátovaný narativní hub s grounded UA agro-daty, zapnout indexaci pod `/uk`, bez jakékoli změny CS/SK výstupu.

**Architecture:** Izolovaná komponenta `StatistikyUk.astro` (vzor `PudaUk.astro`) + vlastní data `agro-stats-uk.json` (každé volatilní pole nese source+asOf) + vlastní lib `statistiky-uk.ts` (typy + reuse `buildLineChart`). Route `statistiky/index.astro` deleguje `{locale==='uk' ? <StatistikyUk/> : (…CS/SK…)}`. CS/SK větev netknutá → byte-identická. Launch prefix `/statistiky` do `LAUNCHED_PREFIXES.uk` jako úplně poslední krok. `agro-derived.ts` ani jeho `Locale` typ se NEdotýkáme.

**Tech Stack:** Astro (SSR, `@astrojs/node`), TypeScript, Vitest, JSON data importy, Intl.NumberFormat('uk-UA'). Node 22.

**Obsah hubu (4 bloky):** (1) Big numbers — role UA ve světě; (2) Produkce + export plodin (pšenice/kukuřice/slunečnice/ječmen/soja); (3) Časová osa válečného dopadu; (4) Ceny/vstupy — **CONDITIONAL** (přežije jen pokud ho data-verifikační brána ugroundi autoritativním zdrojem; jinak DROP). CZ krajský hexmap = vynechán.

**Prostředí (každý task běží v worktree):**
```bash
cd /Users/matejsamec/agro-svet/.worktrees/uk-faze4c-statistiky
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 22
```
Baseline: 3 pre-existing fails v `tests/i18n/nav.test.ts` (bazar-nav) = NE regrese. Spouštět cílené testy, ne celý suite, kvůli baseline šumu.

---

## File Structure

| Soubor | Odpovědnost | Akce |
|---|---|---|
| `src/lib/statistiky-uk.ts` | Typy `StatistikyUkData` + derivace; re-export `buildLineChart` | Create |
| `src/data/agro-stats-uk.json` | Kurátovaná UA data, source+asOf na volatilních polích | Create |
| `src/i18n/ui/uk.ts` | Nové `stat.uk.*` klíče (chrome, pill-nav, nadpisy bloků) | Modify |
| `src/components/statistiky/StatistikyUk.astro` | Self-contained UK render (4 bloky) | Create |
| `src/pages/statistiky/index.astro` | Delegace `locale==='uk'` na začátku `<Layout>` těla | Modify |
| `src/i18n/utils.ts` | `LAUNCHED_PREFIXES.uk += '/statistiky'` (poslední) | Modify |
| `src/components/LangSwitcher.astro` | (Volitelné) přidat uk přepínač | Modify |
| `tests/lib/statistiky-uk-lib.test.ts` | Test derivací libu | Create |
| `tests/lib/statistiky-uk-data.test.ts` | Strukturální + atribuční test dat | Create |
| `tests/i18n/statistiky-uk-keys.test.ts` | Test existence i18n klíčů | Create |
| `tests/i18n/uk-launch.test.ts` | Aktualizovat: `/statistiky` přesunout z „nelaunchnuté" do 4c bloku | Modify |

---

## Task 1: Lib `statistiky-uk.ts` — typy + reuse buildLineChart

**Files:**
- Create: `src/lib/statistiky-uk.ts`
- Test: `tests/lib/statistiky-uk-lib.test.ts`

Pozn.: `buildLineChart` je čistá generická funkce v `src/lib/puda-uk.ts`. Znovupoužijeme ji re-exportem, aby komponenta importovala vše sekčně-lokálně ze `statistiky-uk`.

- [ ] **Step 1: Write the failing test**

`tests/lib/statistiky-uk-lib.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { buildLineChart, cropDropPct, type StatistikyUkSeriesPoint } from '../../src/lib/statistiky-uk';

describe('statistiky-uk buildLineChart (reuse)', () => {
  const series: StatistikyUkSeriesPoint[] = [
    { year: 2021, value: 33 },
    { year: 2024, value: 22 },
  ];
  it('maps first/last points to plot extremes', () => {
    const c = buildLineChart(series, { max: 40, ticks: [0, 20, 40] });
    expect(c.points).toHaveLength(2);
    expect(c.points[0].x).toBeCloseTo(50, 1);
    expect(c.points[1].x).toBeCloseTo(1180, 1);
    expect(c.path.startsWith('M')).toBe(true);
    expect(c.area.trim().endsWith('Z')).toBe(true);
  });
});

describe('cropDropPct', () => {
  it('vrací procentní změnu prvního→posledního bodu', () => {
    expect(cropDropPct([{ year: 2021, value: 100 }, { year: 2024, value: 75 }])).toBe(-25);
  });
  it('vrací null pro <2 body nebo nulový základ', () => {
    expect(cropDropPct([{ year: 2021, value: 100 }])).toBeNull();
    expect(cropDropPct([{ year: 2021, value: 0 }, { year: 2024, value: 50 }])).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/lib/statistiky-uk-lib.test.ts`
Expected: FAIL — `Cannot find module '../../src/lib/statistiky-uk'`.

- [ ] **Step 3: Write minimal implementation**

`src/lib/statistiky-uk.ts`:
```ts
// src/lib/statistiky-uk.ts
// Typy + derivace pro UK /statistiky hub. Kurátovaný (evergreen-first) tvar,
// odlišný od cs/sk (agro-derived.ts). Každé volatilní pole nese source+asOf.
// buildLineChart je generická čistá funkce — re-export z puda-uk, ať komponenta
// importuje vše sekčně-lokálně.
export { buildLineChart } from './puda-uk';
export type { StatistikyUkSeriesPoint } from './statistiky-uk-types';

import type { StatistikyUkSeriesPoint as SP } from './statistiky-uk-types';

/** Procentní změna prvního→posledního bodu řady (např. propad produkce). null pokud <2 body / nulový základ. */
export function cropDropPct(series: SP[]): number | null {
  if (series.length < 2 || series[0].value === 0) return null;
  return Math.round((series.at(-1)!.value / series[0].value - 1) * 100);
}
```

A typový soubor `src/lib/statistiky-uk-types.ts`:
```ts
// src/lib/statistiky-uk-types.ts
export interface StatistikyUkSeriesPoint { year: number; value: number; }

export interface StatistikyUkBigNumber {
  val: string; unit: string; lbl: string; trend: string;
  source: string; url: string;
}

export interface StatistikyUkCrop {
  crop: string; unit: string;
  production: StatistikyUkSeriesPoint[];
  export: StatistikyUkSeriesPoint[];
  source: string; url: string; asOf: string;
}

export interface StatistikyUkTimelineStep {
  year: string; title: string; text: string; source: string; url: string;
}

/** CONDITIONAL blok — pokud neugroundovaný, v JSONu se neuvede (volitelný). */
export interface StatistikyUkPrices {
  unit: string; asOf: string; source: string; url: string;
  max: number; ticks: number[]; series: StatistikyUkSeriesPoint[];
}

export interface StatistikyUkSourceLink { label: string; url: string; }

export interface StatistikyUkData {
  generated: string;
  warCaveat: string;
  bigNumbers: StatistikyUkBigNumber[];
  cropProduction: StatistikyUkCrop[];
  warTimeline: StatistikyUkTimelineStep[];
  prices?: StatistikyUkPrices;   // CONDITIONAL
  sources: StatistikyUkSourceLink[];
}
```

Pozn.: `StatistikyUkSeriesPoint` je strukturálně shodný s `PudaUkSeriesPoint`, ale držíme vlastní typ kvůli izolaci sekcí (žádná sémantická závislost na puda datech, jen reuse čisté chart funkce).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/lib/statistiky-uk-lib.test.ts`
Expected: PASS (5 assertions / 3 testy).

- [ ] **Step 5: Commit**

```bash
git add src/lib/statistiky-uk.ts src/lib/statistiky-uk-types.ts tests/lib/statistiky-uk-lib.test.ts
git commit -m "feat(uk-4c): statistiky-uk lib — typy + cropDropPct + reuse buildLineChart"
```

---

## Task 2: Data scaffold `agro-stats-uk.json` (struktura + tvarové placeholdery) + strukturální test

Cílem tasku je VALIDNÍ TVAR a strukturální test. Reálné hodnoty plní Task 3, ověřuje Task 4. Placeholdery jsou zjevně označené `__TODO__`, aby je verifikační brána i case-grep snadno našly.

**Files:**
- Create: `src/data/agro-stats-uk.json`
- Test: `tests/lib/statistiky-uk-data.test.ts`

- [ ] **Step 1: Write the failing test**

`tests/lib/statistiky-uk-data.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import data from '../../src/data/agro-stats-uk.json';
import type { StatistikyUkData } from '../../src/lib/statistiky-uk-types';

const d = data as unknown as StatistikyUkData;

describe('agro-stats-uk.json', () => {
  it('má všechny povinné top-level klíče', () => {
    for (const k of ['generated', 'warCaveat', 'bigNumbers', 'cropProduction', 'warTimeline', 'sources']) {
      expect(d).toHaveProperty(k);
    }
  });

  it('bigNumbers: každé číslo má zdroj (url http)', () => {
    expect(d.bigNumbers.length).toBeGreaterThanOrEqual(3);
    for (const b of d.bigNumbers) {
      expect(b.source.length).toBeGreaterThan(0);
      expect(b.url.startsWith('http')).toBe(true);
    }
  });

  it('cropProduction: každá plodina má atribuci (source/url/asOf) a neprázdnou produkční řadu', () => {
    expect(d.cropProduction.length).toBeGreaterThanOrEqual(3);
    for (const c of d.cropProduction) {
      expect(c.production.length).toBeGreaterThan(0);
      expect(c.asOf.length).toBeGreaterThan(0);
      expect(c.source.length).toBeGreaterThan(0);
      expect(c.url.startsWith('http')).toBe(true);
    }
  });

  it('warTimeline: ≥3 kroky se zdrojem', () => {
    expect(d.warTimeline.length).toBeGreaterThanOrEqual(3);
    for (const s of d.warTimeline) {
      expect(s.url.startsWith('http')).toBe(true);
    }
  });

  it('prices (pokud existuje) má atribuci a neprázdnou řadu', () => {
    if (!d.prices) return; // CONDITIONAL — smí chybět (DROP brána T4)
    expect(d.prices.asOf.length).toBeGreaterThan(0);
    expect(d.prices.source.length).toBeGreaterThan(0);
    expect(d.prices.url.startsWith('http')).toBe(true);
    expect(d.prices.series.length).toBeGreaterThan(0);
  });

  it('sources: ≥2 odkazy', () => {
    expect(d.sources.length).toBeGreaterThanOrEqual(2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/lib/statistiky-uk-data.test.ts`
Expected: FAIL — `Cannot find module '../../src/data/agro-stats-uk.json'`.

- [ ] **Step 3: Write the scaffold JSON**

`src/data/agro-stats-uk.json` — validní tvar s tvarovými placeholdery (reálné hodnoty doplní T3). URL musí být reálné autoritativní domény už zde (aby `startsWith('http')` prošlo a T3/T4 jen upřesnily čísla):
```json
{
  "generated": "2026-06-15",
  "warCaveat": "Дані відображають доступну офіційну статистику. Частина сільгоспугідь тимчасово окупована або замінована — агреговані показники можуть бути неповними.",
  "bigNumbers": [
    { "val": "__TODO__", "unit": "", "lbl": "__TODO__", "trend": "__TODO__", "source": "USDA FAS", "url": "https://fas.usda.gov/" },
    { "val": "__TODO__", "unit": "", "lbl": "__TODO__", "trend": "__TODO__", "source": "FAO", "url": "https://www.fao.org/faostat/en/" },
    { "val": "__TODO__", "unit": "", "lbl": "__TODO__", "trend": "__TODO__", "source": "Світовий банк", "url": "https://data.worldbank.org/country/ukraine" }
  ],
  "cropProduction": [
    { "crop": "Пшениця", "unit": "млн т", "production": [{ "year": 2021, "value": 0 }], "export": [], "source": "USDA FAS PSD", "url": "https://apps.fas.usda.gov/psdonline/app/index.html", "asOf": "__TODO__" },
    { "crop": "Кукурудза", "unit": "млн т", "production": [{ "year": 2021, "value": 0 }], "export": [], "source": "USDA FAS PSD", "url": "https://apps.fas.usda.gov/psdonline/app/index.html", "asOf": "__TODO__" },
    { "crop": "Соняшник", "unit": "млн т", "production": [{ "year": 2021, "value": 0 }], "export": [], "source": "USDA FAS PSD", "url": "https://apps.fas.usda.gov/psdonline/app/index.html", "asOf": "__TODO__" }
  ],
  "warTimeline": [
    { "year": "2022", "title": "__TODO__", "text": "__TODO__", "source": "__TODO__", "url": "https://www.worldbank.org/" },
    { "year": "2023", "title": "__TODO__", "text": "__TODO__", "source": "__TODO__", "url": "https://www.worldbank.org/" },
    { "year": "2024", "title": "__TODO__", "text": "__TODO__", "source": "__TODO__", "url": "https://www.worldbank.org/" }
  ],
  "sources": [
    { "label": "USDA FAS PSD Online", "url": "https://apps.fas.usda.gov/psdonline/app/index.html" },
    { "label": "FAOSTAT", "url": "https://www.fao.org/faostat/en/" }
  ]
}
```
(Blok `prices` zde záměrně NEní — přidá ho T3 jen pokud najde autoritativní zdroj; T4 rozhoduje o ponechání.)

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/lib/statistiky-uk-data.test.ts`
Expected: PASS (6 testů). Strukturální gate hotová.

- [ ] **Step 5: Commit**

```bash
git add src/data/agro-stats-uk.json tests/lib/statistiky-uk-data.test.ts
git commit -m "feat(uk-4c): agro-stats-uk.json scaffold + strukturální/atribuční test"
```

---

## Task 3: Grounded data fill (subagent-driven research)

**Tohle je výzkumný task, ne TDD.** Dispatchni grounded research subagenta (web). Strukturální test z T2 je gate (musí dál procházet). Reálnou verifikaci dělá T4.

**Files:**
- Modify: `src/data/agro-stats-uk.json` (nahradit `__TODO__` reálnými grounded hodnotami)

- [ ] **Step 1: Dispatch grounded research subagent**

Zadání subagentovi (general-purpose, WebSearch/WebFetch):
> Naplň `src/data/agro-stats-uk.json` reálnými ukrajinskými agro-statistikami. Pravidla:
> - **Každé číslo musí mít konkrétní autoritativní zdroj + URL + asOf (rok/marketing year).** Preferované zdroje: USDA FAS PSD Online, FAOSTAT, World Bank Open Data, KSE Institute, Держстат (state statistics UA).
> - **bigNumbers (4):** role UA ve světě — např. #1 světový exportér slunečnicového oleje (podíl %), pořadí/podíl v exportu pšenice a kukuřice, rozloha orné půdy, podíl světového černozemu. Evergreen, robustní.
> - **cropProduction (5 plodin: Пшениця, Кукурудза, Соняшник, Ячмінь, Соя):** roční produkce (млн т) za období cca 2018–poslední dostupný marketing year + exportní objemy, kde jsou. Použij USDA FAS PSD jako primární (konzistentní marketing years).
> - **warTimeline (≥3 kroky, 2022→dnes):** kvalitativní milníky válečného dopadu se zdrojem — propad produkce/exportu, Black Sea Grain Initiative + její konec (čvc 2023), EU Solidarity Lanes, zaminovaná/okupovaná zem. Čísla jen pokud ozdrojovaná.
> - **prices (CONDITIONAL):** přidej blok `prices` POUZE pokud najdeš autoritativní časovou řadu (FOB Black Sea cena pšenice USD/t, nebo UA vstupní ceny). Pokud spolehlivý zdroj není → blok VŮBEC nepřidávej (necháme DROP).
> - Texty ukrajinsky (MSA). Čísla nevymýšlej ani neodhaduj — co nemá zdroj, vynech.
> - Vrať kompletní validní JSON souboru.

- [ ] **Step 2: Zapsat výstup a ověřit, že nezůstaly placeholdery**

Po zapsání JSON:
Run: `grep -c '__TODO__' src/data/agro-stats-uk.json`
Expected: `0`

- [ ] **Step 3: Strukturální test stále prochází**

Run: `npx vitest run tests/lib/statistiky-uk-data.test.ts`
Expected: PASS (6 testů).

- [ ] **Step 4: Commit**

```bash
git add src/data/agro-stats-uk.json
git commit -m "feat(uk-4c): grounded UA data — bigNumbers, cropProduction, warTimeline (+prices?)"
```

---

## Task 4: DATA verifikační brána (adversariální opus + web)

**Independent verifikace.** Dispatchni NOVÉHO subagenta (čistý kontext, opus, WebSearch/WebFetch) s adversariálním zadáním. Nesmí to být tentýž agent co data plnil.

**Files:**
- Modify: `src/data/agro-stats-uk.json` (oprava/DROP neověřitelných hodnot)

- [ ] **Step 1: Dispatch adversarial verification subagent**

Zadání:
> Jsi nezávislý fact-checker. Soubor `src/data/agro-stats-uk.json` obsahuje UA agro-statistiky s tvrzenými zdroji. Pro KAŽDÉ číselné tvrzení (bigNumbers val/trend, cropProduction production/export hodnoty, warTimeline čísla, prices series):
> 1. Ověř ho proti uvedenému zdroji (otevři URL) A nezávisle ≥1 dalším autoritativním zdrojem.
> 2. Pokud sedí (±rozumná tolerance / správný marketing year) → OK.
> 3. Pokud nesedí ale najdeš správnou ozdrojovanou hodnotu → OPRAV (vč. url/asOf).
> 4. Pokud nelze ověřit žádným autoritativním zdrojem → **DROP** (odeber daný záznam; u celého `prices` bloku smaž celý klíč).
> Vrať: (a) opravený JSON, (b) tabulku verdiktů „tvrzení → zdroj → OK/OPRAVENO/DROP". Buď skeptický: default při pochybnosti = DROP, ne ponechat.

- [ ] **Step 2: Aplikovat verdikt do JSON**

Zapiš opravený JSON. Pokud verifikace shodila `prices` → klíč v souboru chybí (T2 test to dovoluje). Pokud shodila plodinu/big number, ujisti se že stále platí minima testu (bigNumbers ≥3, cropProduction ≥3, warTimeline ≥3, sources ≥2). Pokud by DROP shodil pod minimum, dohledej náhradní ozdrojovaný záznam.

- [ ] **Step 3: Strukturální test + placeholder check**

Run: `npx vitest run tests/lib/statistiky-uk-data.test.ts && grep -c '__TODO__' src/data/agro-stats-uk.json`
Expected: PASS (6 testů) + `0` placeholderů.

- [ ] **Step 4: Commit**

```bash
git add src/data/agro-stats-uk.json
git commit -m "feat(uk-4c): data verifikační brána — ověřeno/opraveno/DROP (vč. osudu prices bloku)"
```

---

## Task 5: i18n `stat.uk.*` klíče

Pozn.: uk.ts už má dormant `stat.*` klíče (překlad CS stránky → „ЧЕСЬКІ дані"). Ty se po delegaci NErenderují. Přidáváme nový namespace `stat.uk.*` pro kurátovaný hub (analogicky `puda.uk.*`).

**Files:**
- Modify: `src/i18n/ui/uk.ts`
- Test: `tests/i18n/statistiky-uk-keys.test.ts`

- [ ] **Step 1: Write the failing test**

`tests/i18n/statistiky-uk-keys.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { ui } from '../../src/i18n/ui';

const REQUIRED = [
  'stat.uk.h.bigNumbers', 'stat.uk.h.produkce', 'stat.uk.h.valka',
  'stat.uk.h.ceny', 'stat.uk.sources.h', 'stat.uk.pills.temata',
  'stat.uk.prod.production', 'stat.uk.prod.export',
];

describe('uk statistiky i18n keys', () => {
  it('všechny požadované stat.uk.* klíče existují', () => {
    for (const k of REQUIRED) {
      expect(ui.uk[k], `chybí uk klíč ${k}`).toBeTruthy();
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/i18n/statistiky-uk-keys.test.ts`
Expected: FAIL — klíče chybí.

- [ ] **Step 3: Přidat klíče do `src/i18n/ui/uk.ts`**

Vlož blok hned za poslední `stat.inputs.*` klíč (kolem ř. 473) — drž `str.replace` / ruční edit, NIKDY ne Python `re.sub`:
```ts
  // — statistiky UK kurátovaný hub (stat.uk.*) —
  'stat.uk.h.bigNumbers': 'Україна у світовому виміру',
  'stat.uk.h.produkce': 'Виробництво та експорт культур',
  'stat.uk.h.valka': 'Вплив війни на виробництво',
  'stat.uk.h.ceny': 'Ціни',
  'stat.uk.sources.h': 'Джерела даних',
  'stat.uk.pills.temata': 'Огляд',
  'stat.uk.prod.production': 'Виробництво',
  'stat.uk.prod.export': 'Експорт',
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/i18n/statistiky-uk-keys.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/i18n/ui/uk.ts tests/i18n/statistiky-uk-keys.test.ts
git commit -m "feat(uk-4c): stat.uk.* i18n klíče pro kurátovaný hub"
```

---

## Task 6: Komponenta `StatistikyUk.astro`

Self-contained UK render. Mirror struktury i CSS z `PudaUk.astro` (sdílené třídy `sp-hero`, `big-numbers`, `bn`, `chart-section`, `crops-bars`, `timeline`, `sources-section`, `war-caveat`). DataSegmentNav `active="komodity"`. Žádný fallback na CS, žádné `getCollection` (statistiky nemá UK článkovou kolekci).

**Files:**
- Create: `src/components/statistiky/StatistikyUk.astro`

- [ ] **Step 1: Napsat komponentu**

`src/components/statistiky/StatistikyUk.astro` (frontmatter + render; CSS zkopíruj 1:1 ze `src/components/puda/PudaUk.astro` `<style>` bloku — třídy jsou sdílené, doplň jen případné nové selektory pro produkční dvojgraf):
```astro
---
import Layout from '../../layouts/Layout.astro';
import DataSegmentNav from '../../components/DataSegmentNav.astro';
import PillsNav from '../../components/statistiky/PillsNav.astro';
import { useTranslations } from '../../i18n/utils';
import { buildLineChart } from '../../lib/statistiky-uk';
import type { StatistikyUkData } from '../../lib/statistiky-uk-types';
import raw from '../../data/agro-stats-uk.json';

const d = raw as unknown as StatistikyUkData;
const t = useTranslations('uk');
Astro.response.headers.set('Cache-Control', 'public, max-age=600, s-maxage=86400, stale-while-revalidate=604800');

const NF = new Intl.NumberFormat('uk-UA');
const prices = d.prices && d.prices.series.length >= 2
  ? buildLineChart(d.prices.series, { max: d.prices.max, ticks: d.prices.ticks })
  : null;

const PILLS = [
  { label: t('stat.uk.pills.temata'), href: '#bignumbers' },
  { label: t('stat.uk.h.produkce'), href: '#produkce' },
  { label: t('stat.uk.h.valka'), href: '#valka' },
  ...(prices ? [{ label: t('stat.uk.h.ceny'), href: '#ceny' }] : []),
];
---

<Layout
  title="Статистика сільського господарства України — виробництво, експорт, ринки"
  description="Дані про українське сільське господарство: світова роль, виробництво та експорт пшениці, кукурудзи й соняшнику, вплив війни на врожаї."
>
  <main class="sp-page puda-root">
    <DataSegmentNav active="komodity" />

    <section class="sp-hero">
      <div class="sp-hero-left">
        <span class="sp-kicker"><span class="dot"></span>ДАНІ · АГРАРНИЙ СЕКТОР УКРАЇНИ</span>
        <h1>Статистика <em>сільського господарства</em></h1>
        <p class="sp-hero-lede">Україна — один зі світових лідерів експорту зерна та олії. Тут — світова роль, виробництво й експорт ключових культур та вплив війни на врожаї.</p>
      </div>
      <div class="sp-hero-right">
        <div class="sp-hero-photo" style="background-image:url('/images/kombajn.webp')"></div>
      </div>
    </section>

    {d.warCaveat && <p class="war-caveat">⚠️ {d.warCaveat}</p>}

    {d.bigNumbers.length > 0 && (
      <section class="big-numbers" id="bignumbers">
        {d.bigNumbers.map((b) => (
          <div class="bn">
            <span class="bn-val">{b.val}{b.unit && <span class="bn-unit">{b.unit}</span>}</span>
            <span class="bn-lbl">{b.lbl}</span>
            <span class="bn-trend">{b.trend}</span>
            <a class="bn-source" href={b.url} target="_blank" rel="noopener noreferrer"><span class="bn-source-prefix">Джерело:</span> {b.source}</a>
          </div>
        ))}
      </section>
    )}

    <PillsNav items={PILLS} />

    {d.cropProduction.length > 0 && (
      <section class="crops-section" id="produkce">
        <header><h2>{t('stat.uk.h.produkce')}</h2></header>
        {d.cropProduction.map((c) => {
          const prodMax = Math.max(...c.production.map((p) => p.value), ...c.export.map((p) => p.value), 1);
          return (
            <div class="crop-block">
              <h3 class="crop-title">{c.crop} <span class="sub">{c.unit} · {c.asOf}</span></h3>
              <div class="crops-bars">
                {c.production.map((p) => (
                  <div class="crop-row">
                    <span class="crop-name">{p.year} · {t('stat.uk.prod.production')}</span>
                    <div class="crop-bar-wrap">
                      <div class="crop-bar" style={`width:${(p.value / prodMax) * 100}%; background:#7CB342`}></div>
                      <span class="crop-val">{NF.format(p.value)} {c.unit}</span>
                    </div>
                  </div>
                ))}
                {c.export.map((p) => (
                  <div class="crop-row">
                    <span class="crop-name">{p.year} · {t('stat.uk.prod.export')}</span>
                    <div class="crop-bar-wrap">
                      <div class="crop-bar" style={`width:${(p.value / prodMax) * 100}%; background:#FFB300`}></div>
                      <span class="crop-val">{NF.format(p.value)} {c.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
              <a class="src-link" href={c.url} target="_blank" rel="noopener noreferrer">{c.source}</a>
            </div>
          );
        })}
      </section>
    )}

    {d.warTimeline.length > 0 && (
      <section class="reforma-section" id="valka">
        <h2>{t('stat.uk.h.valka')}</h2>
        <ol class="timeline">
          {d.warTimeline.map((s) => (
            <li class="tl-item">
              <span class="tl-year">{s.year}</span>
              <div class="tl-body">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <a class="src-link" href={s.url} target="_blank" rel="noopener noreferrer">{s.source}</a>
              </div>
            </li>
          ))}
        </ol>
      </section>
    )}

    {prices && d.prices && (
      <section class="chart-section" id="ceny">
        <header>
          <h2>{t('stat.uk.h.ceny')}</h2>
          <span class="sub">{d.prices.unit} · {d.prices.asOf}</span>
          <a class="src-link" href={d.prices.url} target="_blank" rel="noopener noreferrer">{d.prices.source}</a>
        </header>
        <div class="chart-wrap">
          <svg viewBox={`0 0 ${prices.w} ${prices.h}`} class="chart-svg" role="img" aria-label="Ціни">
            {d.prices.ticks.map((v) => {
              const y = prices.pad.t + prices.plotH - (v / d.prices!.max) * prices.plotH;
              return (<>
                <line x1={prices.pad.l} y1={y} x2={prices.w - prices.pad.r} y2={y} stroke="#eee" stroke-width="1"/>
                <text x={prices.pad.l - 8} y={y + 5} text-anchor="end" font-size="13" fill="#888">{NF.format(v)}</text>
              </>);
            })}
            <path d={prices.area} fill="rgba(255, 215, 0, .25)"/>
            <path d={prices.path} stroke="#1a1a1a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            {prices.points.map((p) => (<>
              <circle cx={p.x} cy={p.y} r="5" fill="#FFFF00" stroke="#1a1a1a" stroke-width="2"/>
              <text x={p.x} y={p.y - 14} text-anchor="middle" font-size="13" font-weight="700" fill="#1a1a1a">{NF.format(p.value)}</text>
              <text x={p.x} y={prices.pad.t + prices.plotH + 22} text-anchor="middle" font-size="13" fill="#666">{p.year}</text>
            </>))}
          </svg>
        </div>
      </section>
    )}

    <section class="sources-section">
      <h3>{t('stat.uk.sources.h')}</h3>
      <ul>
        {d.sources.map((s) => (<li><a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a></li>))}
      </ul>
    </section>
  </main>
</Layout>

<style>
  /* === ZKOPÍRUJ 1:1 celý <style> blok z src/components/puda/PudaUk.astro === */
  /* Třídy puda-root, sp-hero*, big-numbers, bn*, chart-section, chart-*, src-link, */
  /* crops-section, crops-bars, crop-*, timeline, tl-*, sources-section, war-caveat */
  /* jsou sdílené. Doplň navíc jen: */
  .crop-block { margin-bottom: 28px; }
  .crop-title { font:700 17px 'Chakra Petch',sans-serif; color:#0A0A0B; margin:0 0 12px; }
  .crop-title .sub { font-weight:400; font-size:13px; color:#6B6B72; }
</style>
```

- [ ] **Step 2: Type-check + build komponenty (přes route v T7).** Zatím samostatně:

Run: `npx astro check --minimumSeverity error 2>&1 | tail -20`
Expected: žádné nové errory v `StatistikyUk.astro` (pozn.: pre-existing warningy ignoruj; sleduj jen errory v novém souboru).

- [ ] **Step 3: Commit**

```bash
git add src/components/statistiky/StatistikyUk.astro
git commit -m "feat(uk-4c): StatistikyUk.astro — kurátovaný hub (big numbers, produkce, válka, ceny?)"
```

---

## Task 7: Route delegace + ověření CS/SK byte-identity

**Files:**
- Modify: `src/pages/statistiky/index.astro`

- [ ] **Step 1: Zachytit baseline byte-hash CS/SK renderu PŘED změnou**

Nejdřív zachyť SHA stávajícího souboru těla (pro jistotu) a poznač si, že CS/SK render se nesmí změnit. Build běží v T8 smoke; zde stačí, že obalíme stávající tělo beze změny jeho obsahu.

Run: `git stash list; sed -n '135,200p' src/pages/statistiky/index.astro | shasum`
Poznač si hash (kontrola na konci kroku 4).

- [ ] **Step 2: Přidat import StatistikyUk do frontmatteru**

V `src/pages/statistiky/index.astro` za řádek `import BottomCTA from '../../components/statistiky/BottomCTA.astro';` (kolem ř. 30) přidej:
```astro
import StatistikyUk from '../../components/statistiky/StatistikyUk.astro';
```

- [ ] **Step 3: Obalit tělo `<Layout>` delegací**

Tělo začíná `<Layout` na ř. 135 a končí `</Layout>` na ř. 200. Obal CELÉ tělo ternárem tak, aby CS/SK větev zůstala znak-za-znak stejná. Přidej PŘED `<Layout` (ř. 135):
```astro
{locale === 'uk' ? <StatistikyUk /> : (
```
a ZA `</Layout>` (ř. 200):
```astro
)}
```
Mezi nimi se nesmí změnit ani znak. (Vzor: `src/pages/puda/index.astro` ř. ~99.)

- [ ] **Step 4: Ověřit, že CS/SK tělo je nezměněné**

Run: `sed -n '136,201p' src/pages/statistiky/index.astro | shasum`
Expected: stejný hash jako v kroku 1 (řádky se posunuly o 1 kvůli `{locale...` před `<Layout>`; porovnej obsah Layout bloku — musí být identický).
Vizuální kontrola: `git diff src/pages/statistiky/index.astro` ukazuje JEN přidaný import, přidaný `{locale === 'uk' ? <StatistikyUk /> : (` a uzavírací `)}` — žádnou změnu uvnitř Layoutu.

- [ ] **Step 5: Build a smoke uk vs cs**

Run:
```bash
npm run build 2>&1 | tail -5
```
Expected: build úspěšný (`@astrojs/node`).

- [ ] **Step 6: Commit**

```bash
git add src/pages/statistiky/index.astro
git commit -m "feat(uk-4c): route delegace locale==='uk' → StatistikyUk (CS/SK byte-identické)"
```

---

## Task 8: Launch `/statistiky` pro uk + aktualizace launch testu + smoke

**Toto je PŘEDPOSLEDNÍ task — zapne indexaci. Provádět až po T1–T7 a po finálním review (T10 part 1).**

**Files:**
- Modify: `src/i18n/utils.ts`
- Modify: `tests/i18n/uk-launch.test.ts`

- [ ] **Step 1: Aktualizovat launch test (TDD — nejdřív test)**

V `tests/i18n/uk-launch.test.ts`:
(a) V bloku „UK fáze 2 launch" změň test „jurisdikční data NEjsou launchnuté" — odeber `/statistiky` z pole (nech tam jen `/dotace`):
```ts
  it('jurisdikční data NEjsou launchnuté pro uk (kromě /puda — 4b, /statistiky — 4c)', () => {
    for (const p of ['/dotace']) {
      expect(isLaunchedPath('uk', p)).toBe(false);
    }
  });
```
(b) Přidej nový blok na konec:
```ts
describe('UK fáze 4c launch (statistiky)', () => {
  it('/statistiky je launchnuté pro uk', () => {
    expect(LAUNCHED_PREFIXES.uk).toContain('/statistiky');
    expect(isLaunchedPath('uk', '/statistiky')).toBe(true);
    expect(isLaunchedPath('uk', '/statistiky/')).toBe(true);
  });
  it('/statistiky není locked sekce', () => {
    expect(isLockedSectionPath('/statistiky')).toBe(false);
  });
  it('cs /statistiky nedostane gating-noindex', () => {
    expect(isLaunchedPath('cs', '/statistiky/')).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/i18n/uk-launch.test.ts`
Expected: FAIL — `/statistiky` ještě není v `LAUNCHED_PREFIXES.uk`.

- [ ] **Step 3: Přidat prefix**

V `src/i18n/utils.ts` v `LAUNCHED_PREFIXES.uk` přidej `'/statistiky'` (na konec uk pole, ř. ~35):
```ts
  uk: ['/stroje', '/srovnani', '/znacky', '/encyklopedie', '/jak-na-to', '/slovnik', '/puda', '/statistiky'],
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/i18n/uk-launch.test.ts`
Expected: PASS.

- [ ] **Step 5: Build + live smoke (sitemap, hreflang, 200, indexace)**

Run:
```bash
npm run build 2>&1 | tail -3
set -a; . ./.env; set +a
npm run preview &
sleep 4
echo "--- /uk/statistiky/ status ---"; curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/uk/statistiky/
echo "--- cs /statistiky/ status ---"; curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/statistiky/
echo "--- uk indexace (index,follow + self-canonical + hreflang) ---"; curl -s http://localhost:4321/uk/statistiky/ | grep -iE 'robots|canonical|hreflang' | head
echo "--- sitemap obsahuje /uk/statistiky ---"; curl -s http://localhost:4321/sitemap.xml | grep -c '/uk/statistiky'
kill %1 2>/dev/null
```
Expected: `/uk/statistiky/` → 200; cs `/statistiky/` → 200; uk hlavička `index,follow` + `canonical` na `/uk/statistiky/` + hreflang cs/sk/uk; sitemap count ≥1.

- [ ] **Step 6: Commit**

```bash
git add src/i18n/utils.ts tests/i18n/uk-launch.test.ts
git commit -m "feat(uk-4c): launch /statistiky pro uk (LAUNCHED_PREFIXES + test) — indexace ON"
```

---

## Task 9 (VOLITELNÉ): LangSwitcher uk přepínač

**Cross-cutting** — dotkne se přepínače na všech stránkách. Provádět jen pokud nerozbije nav testy. Pokud `langSwitchHref('uk', …)` fallback nebo nav testy dělají potíže → DEFER do samostatné fáze.

**Files:**
- Modify: `src/components/LangSwitcher.astro`

- [ ] **Step 1: Přidat uk možnost**

V `src/components/LangSwitcher.astro`: za výpočet `skHref` (ř. 13) přidej:
```astro
const ukHref = langSwitchHref('uk', path, []);
```
a do markupu za sk `<a>` (ř. 20) přidej:
```astro
  <span class="lang-sep" aria-hidden="true">/</span>
  <a href={ukHref} class:list={["lang-opt", { active: locale === 'uk' }]} hreflang="uk"
     aria-current={locale === 'uk' ? 'true' : undefined}>{t(locale, 'lang.uk')}</a>
```

- [ ] **Step 2: Ověřit klíč `lang.uk` existuje**

Run: `grep -rn "'lang.uk'" src/i18n/ui/`
Pokud chybí v některém slovníku (cs/sk/uk), doplň: cs `'lang.uk': 'UA'`, sk `'lang.uk': 'UA'`, uk `'lang.uk': 'UA'`.

- [ ] **Step 3: Targeted nav/i18n testy (regrese)**

Run: `npx vitest run tests/i18n/`
Expected: jen 3 baseline fails v `nav.test.ts` (bazar-nav), ŽÁDNÝ nový fail. Pokud přibyl fail kvůli switcheru → revert tohoto tasku, DEFER.

- [ ] **Step 4: Commit**

```bash
git add src/components/LangSwitcher.astro src/i18n/ui/
git commit -m "feat(uk-4c): LangSwitcher — uk přepínač v hlavičce (volitelné)"
```

---

## Task 10: Finální review → reconcile → PR → merge

**Files:** žádné nové (proces).

- [ ] **Step 1: Finální opus review celého diffu**

Spusť `superpowers:requesting-code-review` nebo `/code-review high` na `git diff master...HEAD`. Adresuj nálezy (zvlášť: byte-identita CS/SK, žádný leak puda↔statistiky coupling, žádné neozdrojované číslo).

- [ ] **Step 2: Cílený testový běh (celé relevantní suite)**

Run:
```bash
npx vitest run tests/lib/statistiky-uk-lib.test.ts tests/lib/statistiky-uk-data.test.ts tests/i18n/statistiky-uk-keys.test.ts tests/i18n/uk-launch.test.ts
```
Expected: vše PASS.

- [ ] **Step 3: Reconcile s origin/master**

```bash
git fetch origin
git rebase origin/master   # nebo merge; řeš konflikty v utils.ts (LAUNCHED_PREFIXES), ui/uk.ts
npm run build 2>&1 | tail -3
```
⚠️ Track se rychle vyvíjí — čekej konflikty v `LAUNCHED_PREFIXES.uk` (zachovej VŠECHNY prefixy obou stran + `/statistiky`), `ui/uk.ts` (zachovej oba bloky klíčů). Po reconcile znovu build + cílené testy.

- [ ] **Step 4: PR → merge (finishing-a-development-branch)**

Použij `superpowers:finishing-a-development-branch`: push větve, otevři PR proti master, po merge Coolify auto-deploy. Po deploji live smoke na agro-svet.cz (`/uk/statistiky/` 200 + index,follow; cs `/statistiky/` 200 beze změny; sitemap obsahuje `/uk/statistiky`).

- [ ] **Step 5: Úklid**

Po ověření smaž worktree + větev (local+remote).

---

## Self-Review (proti specu)

- **Spec coverage:** ✅ 4 bloky (bigNumbers=T2/3/6, cropProduction=T2/3/6, warTimeline=T2/3/6, prices CONDITIONAL=T3/4/6); izolace komponenta=T6, route delegace=T7, lib=T1, data+source/asOf=T2, i18n=T5, launch poslední=T8, verifikační brána=T4, hexmap vynechán (není v komponentě), LangSwitcher volitelný=T9, reconcile+PR=T10.
- **Placeholder scan:** Data placeholdery `__TODO__` jsou ZÁMĚRNÉ (T2 scaffold), explicitně mazané v T3/T4 s grep gate `=0`. Žádné placeholdery v kódu/krocích.
- **Type consistency:** `StatistikyUkData`, `StatistikyUkSeriesPoint`, `StatistikyUkCrop`, `cropDropPct`, `buildLineChart` — konzistentní napříč T1/T2/T6. `prices` všude jako optional (`?`), guard `d.prices && …` v T6.
- **Byte-identita:** T7 explicitní shasum gate na CS/SK Layout tělo.
```
