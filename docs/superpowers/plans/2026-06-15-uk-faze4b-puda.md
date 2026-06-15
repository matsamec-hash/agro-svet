# UK Fáze 4b — `/uk/puda` (ukrajinský trh s půdou) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lokalizovat `/puda` do ukrajinštiny s věcně ukrajinským obsahem (trh s půdou UA) a zapnout indexaci pod `/uk`, bez jakékoli změny CS/SK výstupu.

**Architecture:** UK hub je izolovaný do vlastní komponenty `src/components/puda/PudaUk.astro` (vlastní `<Layout>`), kterou `src/pages/puda/index.astro` jen deleguje při `locale==='uk'` — cs/sk podstrom zůstává netknutý (byte-identita). UK data žijí v `src/data/agro-puda-uk.json` (každé volatilní pole nese `source`+`asOf`); typy a derivace v `src/lib/puda-uk.ts`. Články `[slug]` jdou přes overlay kolekci `pudaUk` (stejné slugy jako cs), bez auto-linkeru (uk). Launch prefix se přidá jako poslední task → sitemap+hreflang se zrcadlí automaticky.

**Tech Stack:** Astro (SSR `prerender=false`), TypeScript, Vitest, `@astrojs/node`, i18n flat-key slovníky v `src/i18n/ui/{cs,sk,uk}.ts`.

**Zdrojová pravda obsahu:** [docs/superpowers/specs/2026-06-14-uk-faze4b-puda-design.md](../specs/2026-06-14-uk-faze4b-puda-design.md)

---

## Prostředí (PŘED prvním tasktem)

- [ ] **Setup: worktree + node + .env**

```bash
cd ~/agro-svet
git worktree add .worktrees/uk-faze4b-puda -b feat/i18n-uk-faze4b-puda master
cp .env .worktrees/uk-faze4b-puda/.env   # jinak sitemap.xml.ts hodí 500
cd .worktrees/uk-faze4b-puda
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 22
npm install
```

- [ ] **Setup: baseline test run (zachytit pre-existing fails)**

Run: `npx vitest run`
Expected: zelené KROMĚ 3 pre-existing fails v `tests/i18n/nav.test.ts` (bazar-nav). Tyto 3 NEJSOU regrese — neřešit. Jakýkoli JINÝ fail = problém prostředí, vyřešit před pokračováním.

**Pravidla pro celý plán:**
- CS i SK render musí zůstat **byte-identický**. Nikdy needituj cs/sk větve existujících souborů jinak než přidáním uk.
- Velké datové soubory assembluj přes `str.replace`, **NIKDY** Python `re.sub` (interpretuje `\n` → rozbije `\n\n`).
- `tf(locale, key, params)` — locale je PRVNÍ argument.
- Auto-linker (`injectLinks`) pro uk **nepouštět**.
- Slugy uk článků == cs slugy.

---

## Task 1: Typy + derivace + chart helper (`src/lib/puda-uk.ts`)

**Files:**
- Create: `src/lib/puda-uk.ts`
- Test: `tests/lib/puda-uk-lib.test.ts`

UK data mají jiný tvar než cs/sk (`puda-derived.ts`), proto samostatný lib. Obsahuje typy, big-number derivaci a čistou matematiku liniového grafu (přeneseno 1:1 z `src/pages/puda/index.astro:55-71`, aby graf vypadal stejně), aby šla unit-testovat.

- [ ] **Step 1: Write the failing test**

Create `tests/lib/puda-uk-lib.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { buildLineChart, type PudaUkSeriesPoint } from '../../src/lib/puda-uk';

describe('buildLineChart', () => {
  const series: PudaUkSeriesPoint[] = [
    { year: 2021, value: 1000 },
    { year: 2024, value: 2000 },
  ];

  it('maps first/last points to plot extremes', () => {
    const c = buildLineChart(series, { max: 2000, ticks: [0, 1000, 2000] });
    expect(c.points).toHaveLength(2);
    // první rok na levém okraji plotu (x = pad.l = 50)
    expect(c.points[0].x).toBeCloseTo(50, 1);
    // poslední rok na pravém okraji (W - pad.r = 1200 - 20 = 1180)
    expect(c.points[1].x).toBeCloseTo(1180, 1);
    // max hodnota = horní okraj plotu (y = pad.t = 20)
    expect(c.points[1].y).toBeCloseTo(20, 1);
  });

  it('produces an SVG path starting with M and an area path ending with Z', () => {
    const c = buildLineChart(series, { max: 2000, ticks: [0, 2000] });
    expect(c.path.startsWith('M')).toBe(true);
    expect(c.area.trim().endsWith('Z')).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/lib/puda-uk-lib.test.ts`
Expected: FAIL — `Cannot find module '../../src/lib/puda-uk'`.

- [ ] **Step 3: Write minimal implementation**

Create `src/lib/puda-uk.ts`:

```ts
// src/lib/puda-uk.ts
// Typy + derivace pro UK /puda hub. UK má vlastní (evergreen-first) datový tvar
// odlišný od cs/sk (puda-derived.ts). Každé volatilní pole nese source+asOf.

export interface PudaUkSeriesPoint { year: number; value: number; }

/** Volatilní blok řady (cena / nájem) s povinnou atribucí. */
export interface PudaUkSeries {
  unit: string;
  asOf: string;
  source: string;
  url: string;
  max: number;
  ticks: number[];
  series: PudaUkSeriesPoint[];
}

export interface PudaUkBigNumber {
  val: string; unit: string; lbl: string; trend: string;
  source: string; url: string;
}

export interface PudaUkTimelineStep {
  year: string; title: string; text: string; source: string; url: string;
}

export interface PudaUkFact {
  val: string; unit: string; lbl: string; note: string;
  source: string; url: string;
}

export interface PudaUkCrop {
  crop: string; hectares: number; source: string; url: string;
}

export interface PudaUkThreat { lbl: string; pct: number; detail: string; }

export interface PudaUkSourceLink { label: string; url: string; }

export interface PudaUkData {
  generated: string;
  warCaveat: string;
  bigNumbers: PudaUkBigNumber[];
  reformTimeline: PudaUkTimelineStep[];
  cena: PudaUkSeries;
  najem: PudaUkSeries;
  plodiny: PudaUkCrop[];
  facts: PudaUkFact[];
  threats: PudaUkThreat[];
  sources: PudaUkSourceLink[];
}

export interface LineChartPoint extends PudaUkSeriesPoint { x: number; y: number; }
export interface LineChart {
  points: LineChartPoint[];
  path: string;
  area: string;
  pad: { l: number; r: number; t: number; b: number };
  w: number; h: number; plotW: number; plotH: number;
}

/** Čistá matematika liniového grafu — portováno z puda/index.astro (cs/sk graf). */
export function buildLineChart(
  data: PudaUkSeriesPoint[],
  opts: { max: number; ticks: number[]; min?: number },
): LineChart {
  const min = opts.min ?? 0;
  const w = 1200, h = 360;
  const pad = { l: 50, r: 20, t: 20, b: 30 };
  const plotW = w - pad.l - pad.r;
  const plotH = h - pad.t - pad.b;
  const yearMin = data[0].year;
  const yearSpan = (data.at(-1)!.year - yearMin) || 1;
  const points: LineChartPoint[] = data.map((d) => {
    const x = pad.l + ((d.year - yearMin) / yearSpan) * plotW;
    const y = pad.t + plotH - ((d.value - min) / (opts.max - min)) * plotH;
    return { ...d, x, y };
  });
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const last = points[points.length - 1];
  const first = points[0];
  const area = `${path} L${last.x.toFixed(1)},${(pad.t + plotH).toFixed(1)} L${first.x.toFixed(1)},${(pad.t + plotH).toFixed(1)} Z`;
  return { points, path, area, pad, w, h, plotW, plotH };
}

export interface PudaUkBigNumbersDerived { priceRustPct: number | null; }

/** Pomocná derivace (růst ceny v %), pokud řada ceny obsahuje ≥2 body. */
export function pudaUkPriceGrowthPct(d: PudaUkData): number | null {
  const s = d.cena.series;
  if (s.length < 2 || s[0].value === 0) return null;
  return Math.round((s.at(-1)!.value / s[0].value - 1) * 100);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/lib/puda-uk-lib.test.ts`
Expected: PASS (2 testy).

- [ ] **Step 5: Commit**

```bash
git add src/lib/puda-uk.ts tests/lib/puda-uk-lib.test.ts
git commit -m "feat(uk-puda): typy + chart helper pro UK /puda (T1)"
```

---

## Task 2: UK datový soubor — STRUKTURA + evergreen seed (`src/data/agro-puda-uk.json`)

**Files:**
- Create: `src/data/agro-puda-uk.json`
- Test: `tests/lib/puda-uk-data.test.ts`

Vytvoř soubor s platnou strukturou dle `PudaUkData`. **Volatilní hodnoty (cena/nájem/plodiny série, čísla ve facts/bigNumbers) jsou v tomto tasku jen STRUKTURÁLNÍ KOSTRA — finální ověřené hodnoty doplní T6 (grounded) a schválí T7 (verifikační brána).** Nezadávej zde žádné číslo, kterému nevěříš jako přibližně správnému; cokoli nejisté nech jako prázdné pole `[]` — komponenta to ošetří.

Tento task zajišťuje: (a) build prochází, (b) test struktury/atribuce drží od začátku.

- [ ] **Step 1: Write the failing test**

Create `tests/lib/puda-uk-data.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import data from '../../src/data/agro-puda-uk.json';
import type { PudaUkData } from '../../src/lib/puda-uk';

const d = data as unknown as PudaUkData;

describe('agro-puda-uk.json', () => {
  it('má všechny top-level klíče PudaUkData', () => {
    for (const k of ['generated', 'warCaveat', 'bigNumbers', 'reformTimeline', 'cena', 'najem', 'plodiny', 'facts', 'threats', 'sources']) {
      expect(d).toHaveProperty(k);
    }
  });

  it('neprázdné volatilní řady mají povinnou atribuci (asOf/source/url)', () => {
    for (const blk of [d.cena, d.najem]) {
      expect(typeof blk.unit).toBe('string');
      if (blk.series.length === 0) continue; // naplní a ozdrojuje T6
      expect(blk.asOf.length).toBeGreaterThan(0);
      expect(blk.source.length).toBeGreaterThan(0);
      expect(blk.url.startsWith('http')).toBe(true);
    }
  });

  it('každý plodina-záznam má zdroj', () => {
    for (const c of d.plodiny) {
      expect(c.source.length).toBeGreaterThan(0);
      expect(c.url.startsWith('http')).toBe(true);
    }
  });

  it('reformTimeline kroky mají zdroj (strukturálně-právní fakta)', () => {
    expect(d.reformTimeline.length).toBeGreaterThanOrEqual(3);
    for (const s of d.reformTimeline) {
      expect(s.url.startsWith('http')).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/lib/puda-uk-data.test.ts`
Expected: FAIL — `Cannot find module '../../src/data/agro-puda-uk.json'`.

- [ ] **Step 3: Write minimal implementation**

Create `src/data/agro-puda-uk.json`. Tvar (vyplň `reformTimeline` ověřenými strukturálně-právními fakty o reformě trhu — ta jsou stabilní; ostatní volatilní pole nech prázdná/minimální pro T6):

```json
{
  "generated": "2026-06-15",
  "warCaveat": "Дані відображають доступну офіційну статистику. Частина сільгоспугідь тимчасово окупована або замінована — агреговані показники можуть бути неповними.",
  "bigNumbers": [],
  "reformTimeline": [
    {
      "year": "до 2001",
      "title": "Паювання землі",
      "text": "Роздержавлення колгоспної землі — близько 7 млн громадян отримали земельні паї.",
      "source": "Держгеокадастр",
      "url": "https://land.gov.ua/"
    },
    {
      "year": "2001–2021",
      "title": "Мораторій на продаж",
      "text": "Заборона на продаж земель сільськогосподарського призначення; обіг лише через оренду.",
      "source": "Верховна Рада України",
      "url": "https://zakon.rada.gov.ua/"
    },
    {
      "year": "01.07.2021",
      "title": "Відкриття ринку (етап 1)",
      "text": "Купувати можуть лише фізичні особи — громадяни України, до 100 га в одні руки.",
      "source": "Закон №552-IX",
      "url": "https://zakon.rada.gov.ua/laws/show/552-20"
    },
    {
      "year": "01.01.2024",
      "title": "Етап 2",
      "text": "Доступ юридичних осіб (з українськими бенефіціарами), ліміт до 10 000 га. Іноземці — лише після референдуму.",
      "source": "Закон №552-IX",
      "url": "https://zakon.rada.gov.ua/laws/show/552-20"
    }
  ],
  "cena": {
    "unit": "USD/га",
    "asOf": "",
    "source": "",
    "url": "https://land.gov.ua/",
    "max": 0,
    "ticks": [],
    "series": []
  },
  "najem": {
    "unit": "грн/га/рік",
    "asOf": "",
    "source": "",
    "url": "https://land.gov.ua/",
    "max": 0,
    "ticks": [],
    "series": []
  },
  "plodiny": [],
  "facts": [],
  "threats": [],
  "sources": [
    { "label": "Держгеокадастр — Державна служба з питань геодезії, картографії та кадастру", "url": "https://land.gov.ua/" },
    { "label": "Держстат — Державна служба статистики України", "url": "https://www.ukrstat.gov.ua/" },
    { "label": "Мінагрополітики України", "url": "https://minagro.gov.ua/" }
  ]
}
```

⚠️ `cena`/`najem` mají prázdné `series` → test je toleruje (atribuci kontroluje jen u neprázdných řad, viz Step 1). Prázdné `asOf`/`source` u cena/najem jsou tedy v tomto tasku OK; vyplní je T6. `cena.url`/`najem.url` musí být `http(s)` (splněno obecným odkazem).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/lib/puda-uk-data.test.ts`
Expected: PASS (4 testy).

- [ ] **Step 5: Commit**

```bash
git add src/data/agro-puda-uk.json tests/lib/puda-uk-data.test.ts
git commit -m "feat(uk-puda): datová kostra agro-puda-uk.json + evergreen timeline (T2)"
```

---

## Task 3: i18n uk klíče pro `/puda` chrome

**Files:**
- Modify: `src/i18n/ui/uk.ts` (přidat `puda.*` klíče)
- Test: `tests/i18n/puda-uk-keys.test.ts`

UK hub má vlastní (jiné než cs/sk) sekce → potřebuje vlastní sadu klíčů. `[slug]` článek potřebuje `puda.back` + breadcrumb labely. Klíče přidej do uk slovníku; cs/sk se NEMĚNÍ (jejich `puda.*` zůstávají).

Nejdřív zjisti existující strukturu uk slovníku:

Run: `grep -n "puda\." src/i18n/ui/uk.ts | head` — pokud `puda.back` už existuje (sk paritní klíč), needuplikuj; jinak přidej.

- [ ] **Step 1: Write the failing test**

Create `tests/i18n/puda-uk-keys.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { ui } from '../../src/i18n/ui';

const REQUIRED = [
  'puda.uk.crumbHome', 'puda.uk.crumbSelf', 'puda.back',
  'puda.uk.h.reforma', 'puda.uk.h.cena', 'puda.uk.h.najem',
  'puda.uk.h.plodiny', 'puda.uk.h.ohrozeni', 'puda.uk.sources.h',
];

describe('uk puda i18n keys', () => {
  it('všechny požadované klíče existují v uk slovníku', () => {
    for (const k of REQUIRED) {
      expect(ui.uk[k], `chybí uk klíč ${k}`).toBeTruthy();
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/i18n/puda-uk-keys.test.ts`
Expected: FAIL — chybí klíče.

- [ ] **Step 3: Write minimal implementation**

Do `src/i18n/ui/uk.ts` přidej (do existujícího uk objektu, ke `puda.*` sekci; pokud `puda.back` chybí, přidej i ten):

```ts
  'puda.back': '← Назад до землі',
  'puda.uk.crumbHome': 'Головна',
  'puda.uk.crumbSelf': 'Сільськогосподарська земля',
  'puda.uk.h.reforma': 'Реформа ринку землі',
  'puda.uk.h.cena': 'Ціна сільськогосподарської землі',
  'puda.uk.h.najem': 'Оренда землі',
  'puda.uk.h.plodiny': 'Основні культури',
  'puda.uk.h.ohrozeni': 'Загрози для ґрунтів',
  'puda.uk.sources.h': 'Джерела даних',
```

> Pokud `grep` ukázal, že `puda.back` v uk už existuje, vynech jeho řádek (jinak duplicitní klíč).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/i18n/puda-uk-keys.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/i18n/ui/uk.ts tests/i18n/puda-uk-keys.test.ts
git commit -m "feat(uk-puda): i18n uk klíče pro /puda chrome (T3)"
```

---

## Task 4: UK hub komponenta + delegace z `index.astro`

**Files:**
- Create: `src/components/puda/PudaUk.astro`
- Modify: `src/pages/puda/index.astro` (přidat uk delegaci — cs/sk subtree netknutý)

UK hub je samostatná komponenta s vlastním `<Layout>`. `index.astro` při `locale==='uk'` vrátí jen `<PudaUk />`.

- [ ] **Step 1: Vytvoř komponentu `src/components/puda/PudaUk.astro`**

Frontmatter + markup (data-agnostické — čte z JSON; prázdné sekce se nevykreslí):

```astro
---
import Layout from '../../layouts/Layout.astro';
import DataSegmentNav from '../../components/DataSegmentNav.astro';
import PillsNav from '../../components/statistiky/PillsNav.astro';
import { useTranslations } from '../../i18n/utils';
import { buildLineChart, pudaUkPriceGrowthPct, type PudaUkData } from '../../lib/puda-uk';
import raw from '../../data/agro-puda-uk.json';

const d = raw as unknown as PudaUkData;
const t = useTranslations('uk');
Astro.response.headers.set('Cache-Control', 'public, max-age=600, s-maxage=86400, stale-while-revalidate=604800');

const NF = new Intl.NumberFormat('uk-UA');
const cena = d.cena.series.length >= 2
  ? buildLineChart(d.cena.series, { max: d.cena.max, ticks: d.cena.ticks })
  : null;
const najemMax = d.najem.series.length ? Math.max(...d.najem.series.map((s) => s.value)) : 0;
const plodinyMax = d.plodiny.length ? Math.max(...d.plodiny.map((p) => p.hectares)) : 0;
const growthPct = pudaUkPriceGrowthPct(d);

const PILLS = [
  { label: t('puda.uk.h.reforma'), href: '#reforma' },
  ...(cena ? [{ label: t('puda.uk.h.cena'), href: '#cena' }] : []),
  ...(d.najem.series.length ? [{ label: t('puda.uk.h.najem'), href: '#najem' }] : []),
  ...(d.plodiny.length ? [{ label: t('puda.uk.h.plodiny'), href: '#plodiny' }] : []),
  ...(d.threats.length ? [{ label: t('puda.uk.h.ohrozeni'), href: '#ohrozeni' }] : []),
];
---

<Layout
  title="Ринок землі в Україні — ціни, оренда, реформа"
  description="Дані про сільськогосподарську землю в Україні: відкриття ринку, ціни та оренда, структура культур, чорнозем і загрози для ґрунтів."
>
  <div class="puda-root">
    <DataSegmentNav active="puda" />

    <section class="sp-hero">
      <div class="sp-hero-left">
        <span class="sp-kicker"><span class="dot"></span>ЗЕМЛЯ · ДАТА-ОГЛЯД</span>
        <h1>Сільськогосподарська <em>земля</em></h1>
        <p class="sp-hero-lede">Земля — найцінніший аграрний ресурс України. Тут — відкриття ринку землі, ціни та оренда, структура культур і стан ґрунтів.</p>
      </div>
      <div class="sp-hero-right">
        <div class="sp-hero-photo" style="background-image:url('/images/kombajn.webp')"></div>
      </div>
    </section>

    {d.warCaveat && <p class="war-caveat">⚠️ {d.warCaveat}</p>}

    {d.bigNumbers.length > 0 && (
      <section class="big-numbers">
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

    <!-- Реформа ринку землі (evergreen jádro) -->
    <section class="reforma-section" id="reforma">
      <h2>{t('puda.uk.h.reforma')}</h2>
      <ol class="timeline">
        {d.reformTimeline.map((s) => (
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

    {cena && (
      <section class="chart-section" id="cena">
        <header>
          <h2>{t('puda.uk.h.cena')}</h2>
          <span class="sub">{d.cena.unit} · {d.cena.asOf}</span>
          <a class="src-link" href={d.cena.url} target="_blank" rel="noopener noreferrer">{d.cena.source}</a>
        </header>
        <div class="chart-wrap">
          <svg viewBox={`0 0 ${cena.w} ${cena.h}`} class="chart-svg" role="img" aria-label="Ціна землі">
            {d.cena.ticks.map((v) => {
              const y = cena.pad.t + cena.plotH - (v / d.cena.max) * cena.plotH;
              return (<>
                <line x1={cena.pad.l} y1={y} x2={cena.w - cena.pad.r} y2={y} stroke="#eee" stroke-width="1"/>
                <text x={cena.pad.l - 8} y={y + 5} text-anchor="end" font-size="13" fill="#888">{NF.format(v)}</text>
              </>);
            })}
            <path d={cena.area} fill="rgba(255, 215, 0, .25)"/>
            <path d={cena.path} stroke="#1a1a1a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            {cena.points.map((p) => (<>
              <circle cx={p.x} cy={p.y} r="5" fill="#FFFF00" stroke="#1a1a1a" stroke-width="2"/>
              <text x={p.x} y={p.y - 14} text-anchor="middle" font-size="13" font-weight="700" fill="#1a1a1a">{NF.format(p.value)}</text>
              <text x={p.x} y={cena.pad.t + cena.plotH + 22} text-anchor="middle" font-size="13" fill="#666">{p.year}</text>
            </>))}
          </svg>
          {growthPct !== null && (
            <div class="chart-insight">Зростання ціни на <strong>{growthPct} %</strong> за період {d.cena.series[0].year}–{d.cena.series.at(-1).year}.</div>
          )}
        </div>
      </section>
    )}

    {d.najem.series.length > 0 && (
      <section class="chart-section" id="najem">
        <header>
          <h2>{t('puda.uk.h.najem')}</h2>
          <span class="sub">{d.najem.unit} · {d.najem.asOf}</span>
          <a class="src-link" href={d.najem.url} target="_blank" rel="noopener noreferrer">{d.najem.source}</a>
        </header>
        <div class="crops-bars">
          {d.najem.series.slice(-10).map((p) => (
            <div class="crop-row">
              <span class="crop-name">{p.year}</span>
              <div class="crop-bar-wrap">
                <div class="crop-bar" style={`width:${(p.value / najemMax) * 100}%; background:#7CB342`}></div>
                <span class="crop-val">{NF.format(p.value)} {d.najem.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    )}

    {d.plodiny.length > 0 && (
      <section class="crops-section" id="plodiny">
        <header><h2>{t('puda.uk.h.plodiny')}</h2></header>
        <div class="crops-bars">
          {d.plodiny.map((c, i) => (
            <div class="crop-row">
              <span class="crop-name">{c.crop}</span>
              <div class="crop-bar-wrap">
                <div class="crop-bar" style={`width:${(c.hectares / plodinyMax) * 100}%; background:${['#FFD700','#FFB300','#7CB342','#FB8C00','#9E9E9E'][i % 5]}`}></div>
                <span class="crop-val">{NF.format(Math.round(c.hectares / 1000))} тис. га</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    )}

    {d.facts.length > 0 && (
      <section class="facts-grid">
        {d.facts.map((f) => (
          <div class="fact">
            <span class="fact-val">{f.val}{f.unit && <span class="fact-unit">{f.unit}</span>}</span>
            <span class="fact-lbl">{f.lbl}</span>
            <span class="fact-note">{f.note}</span>
            <a class="fact-source" href={f.url} target="_blank" rel="noopener noreferrer"><span class="fact-source-prefix">Джерело:</span> {f.source}</a>
          </div>
        ))}
      </section>
    )}

    {d.threats.length > 0 && (
      <section class="card-chart" id="ohrozeni">
        <h3>{t('puda.uk.h.ohrozeni')}</h3>
        <div class="threats">
          {d.threats.map((th, i) => (
            <div class="threat">
              <div class="threat-bar" style={`width:${th.pct}%; --c:${['#E53935','#FB8C00','#FFB300','#FFC107'][i % 4]}`}><span>{th.pct} %</span></div>
              <span class="threat-lbl">{th.lbl}</span>
            </div>
          ))}
        </div>
      </section>
    )}

    <section class="sources-section">
      <h3>{t('puda.uk.sources.h')}</h3>
      <ul>
        {d.sources.map((s) => (<li><a href={s.url} target="_blank" rel="noopener">{s.label}</a></li>))}
      </ul>
    </section>
  </div>
</Layout>

<!-- STYLY: zkopíruj CELÝ <style> blok z src/pages/puda/index.astro (řádky 464–705) VERBATIM
     a přidej navíc tyto třídy: -->
<style>
  .war-caveat { font-size:13px; color:#8a6d00; background:#FFF6A8; border:1px solid #FFEA00; border-radius:10px; padding:12px 16px; margin:0 0 24px; line-height:1.5; }
  .reforma-section { margin:32px 0 36px; scroll-margin-top:200px; }
  .reforma-section h2 { font:700 24px 'Chakra Petch',sans-serif; letter-spacing:-.02em; margin:0 0 18px; color:#0A0A0B; }
  .timeline { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:14px; }
  .tl-item { display:grid; grid-template-columns:130px 1fr; gap:18px; background:#fff; border:1px solid #EAEAEC; border-radius:18px; padding:20px 24px; box-shadow:0 1px 2px rgba(10,10,12,.04); }
  .tl-year { font:700 16px 'Chakra Petch',sans-serif; color:#0A0A0B; }
  .tl-body h3 { font:700 17px 'Chakra Petch',sans-serif; margin:0 0 6px; color:#0A0A0B; }
  .tl-body p { font-size:14px; color:#1E1E22; line-height:1.55; margin:0 0 8px; }
  @media (max-width:768px){ .tl-item{ grid-template-columns:1fr; gap:6px; } }
</style>
```

> **Poznámka k bodnutí stylů:** `index.astro` má `<style>` (scoped) na ř. 464–705. UK komponenta potřebuje stejné base třídy (`.sp-hero`, `.big-numbers`, `.bn`, `.chart-section`, `.crops-bars`, `.crop-row`, `.crop-bar`, `.facts-grid`, `.fact`, `.threats`, `.threat`, `.card-chart`, `.sources-section`, `.src-link`, `.puda-root` atd.). Zkopíruj ten blok 1:1 do komponenty (scoped styly se neaplikují cross-file). Vynech JS interaktivitu (`<script>` z index.astro) — UK hub ji v MVP nepotřebuje (grafy se vykreslí staticky; statické grafy = OK).

- [ ] **Step 2: Přidej delegaci do `src/pages/puda/index.astro`**

Na začátek frontmatteru (za stávající importy, ř. ~14) přidej import a uk flag; cs/sk logiku nech beze změny:

```astro
import PudaUk from '../../components/puda/PudaUk.astro';
```

Změň kořen template tak, aby uk delegoval. Stávající `<Layout ...>` obal NEMĚŇ — jen ho zabal do ternárního výrazu. Najdi řádek `---` (konec frontmatteru, ř. 97) a hned za ním (ř. 99 `<Layout ...>`):

Z:
```astro
<Layout title={isSk ? '...' : '...'} description={...}>
  <div class="puda-root">
```
udělej:
```astro
{locale === 'uk' ? <PudaUk /> : (
<Layout title={isSk ? 'Cena poľnohospodárskej pôdy na Slovensku — Eurostat dáta' : 'Zemědělská půda v ČR — fakta, ceny, eroze'} description={isSk ? 'Aktuálne ceny a nájmy poľnohospodárskej pôdy na Slovensku (Eurostat) a štruktúra plodín.' : 'Aktuální data o zemědělské půdě v ČR: cena 372 550 Kč/ha, úbytek 10,8 ha denně, 60 % polí ohroženo vodní erozí. Ornice, eroze, výživa a ochrana půdního fondu.'}>
  <div class="puda-root">
```
a na úplný konec, za uzavírací `</Layout>` (ř. 462), přidej `)}`:
```astro
</Layout>
)}
```

> Tím se cs/sk render nezmění (renderuje se identický subtree), uk dostane vlastní komponentu. `locale` je už definováno na ř. 16.

- [ ] **Step 3: Ověř build + dev render**

Run: `npm run build`
Expected: build projde (žádná TS chyba). Pak dev smoke:

```bash
npm run dev &  # nebo npm run preview po buildu
```
Otevři `http://localhost:4321/uk/puda/` → vidíš UK hero + timeline reformy + sekci zdrojů (cena/nájem/plodiny zatím prázdné → sekce se nevykreslí, OK). Otevři `http://localhost:4321/puda/` → cs verze beze změny. `http://localhost:4321/sk/puda/` → sk beze změny.

- [ ] **Step 4: Commit**

```bash
git add src/components/puda/PudaUk.astro src/pages/puda/index.astro
git commit -m "feat(uk-puda): UK hub komponenta + delegace z index.astro (T4)"
```

---

## Task 5: `[slug]` uk větev + `pudaUk` kolekce + auto-linker guard

**Files:**
- Modify: `src/content.config.ts` (přidat `pudaUk` kolekci + export)
- Modify: `src/lib/markdown-with-links.ts` (přidat `applyLinks` param)
- Modify: `src/pages/puda/[slug].astro` (uk větev, bez auto-linkeru)
- Test: `tests/lib/markdown-no-links.test.ts`

- [ ] **Step 1: Registruj `pudaUk` kolekci v `src/content.config.ts`**

Za blok `pudaSk` (ř. 160) přidej:

```ts
// UK-localized článková kolekce o pôde (overlay). Slug = REUSE cs slug.
// Chybějící uk slug pod /uk = 404 (žádný cs leak).
const pudaUk = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/puda-uk' }),
  schema: pudaSchema(),
});
```

A do `export const collections = { ... }` (ř. 252) přidej `pudaUk`:

```ts
export const collections = { novinky, encyklopedie, encyklopedieSk, encyklopedieUk, znacky, znackySk, znackyUk, puda, pudaSk, pudaUk, dotace, dotaceSk, howto, howtoSk, howtoUk };
```

> Aby kolekce nebyla prázdná (glob loader spadne na prázdném adresáři), vytvoř už teď placeholder soubor — nahradí ho T6:
```bash
mkdir -p src/content/puda-uk
printf -- '---\ntitle: "Ерозія ґрунту"\npopis: "Тимчасовий заповнювач — буде перекладено в T6."\n---\n\nЗаповнювач.\n' > src/content/puda-uk/eroze.md
```

- [ ] **Step 2: Write the failing test (auto-linker guard)**

Create `tests/lib/markdown-no-links.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { renderMarkdownWithLinks } from '../../src/lib/markdown-with-links';

describe('renderMarkdownWithLinks applyLinks=false', () => {
  it('nevkládá auto-linky když applyLinks=false', async () => {
    const md = 'Toto je text o pojmu hektar a další větě.';
    const withLinks = await renderMarkdownWithLinks(md, '/uk/puda/eroze/', true);
    const without = await renderMarkdownWithLinks(md, '/uk/puda/eroze/', false);
    expect(without).not.toContain('class="auto-link"');
    // s linky se může (ale nemusí) lišit; klíčové je že bez linků žádný auto-link není
    expect(without).toContain('<p>');
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run tests/lib/markdown-no-links.test.ts`
Expected: FAIL — `renderMarkdownWithLinks` bere jen 2 argumenty / `applyLinks` ignorováno.

- [ ] **Step 4: Přidej `applyLinks` param do `src/lib/markdown-with-links.ts`**

Změň signaturu funkce (ř. 68-73) — cs/sk default zůstává `true` (byte-identita):

```ts
export async function renderMarkdownWithLinks(markdown: string, excludeUrl?: string, applyLinks: boolean = true): Promise<string> {
  const file = await processor.process(markdown);
  const html = String(file);
  if (!applyLinks) return html;
  const linkCtx = createLinkContext(excludeUrl);
  return injectLinks(html, linkCtx);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run tests/lib/markdown-no-links.test.ts`
Expected: PASS.

- [ ] **Step 6: Generalizuj `src/pages/puda/[slug].astro` na uk (bez auto-linkeru)**

Nahraď frontmatter ř. 12-21 (cs/sk chování zachovej, přidej uk):

```astro
const locale = Astro.locals.locale ?? 'cs';
const isSk = locale === 'sk';
const t = useTranslations(locale);
const base = locale === 'cs' ? '' : `/${locale}`;
const { slug } = Astro.params;

const PUDA_COLLECTION = { cs: 'puda', sk: 'pudaSk', uk: 'pudaUk' } as const;
const item = slug ? await getEntry(PUDA_COLLECTION[locale], slug) : undefined;
if (!item) return new Response(null, { status: 404 });

// Auto-linker JEN pro cs/sk (uk: cs-rooted odkazy by vedly do cs sekcí → vypnuto).
const contentHtml = await renderMarkdownWithLinks(item.body ?? '', `${base}/puda/${slug}/`, locale !== 'uk');
```

A breadcrumb/labely zobecni z `isSk ? 'sk' : 'cs'` na 3-way. Nahraď ř. 24-35 (`breadcrumbJsonLd` + `inLanguage`) a v markupu breadcrumb labely. Použij i18n klíče tam, kde uk potřebuje vlastní text:

```astro
const bcp47 = ({ cs: 'cs-CZ', sk: 'sk-SK', uk: 'uk-UA' } as const)[locale];
const homeLabel = locale === 'uk' ? t('puda.uk.crumbHome') : (isSk ? 'Domov' : 'Domů');
const pudaLabel = locale === 'uk' ? t('puda.uk.crumbSelf') : (isSk ? 'Poľnohospodárska pôda' : 'Zemědělská půda');
const breadcrumbJsonLd = breadcrumbSchema([
  { name: homeLabel, url: `${base}/` },
  { name: pudaLabel, url: `${base}/puda/` },
  { name: item.data.title, url: pageUrl },
]);
```
a v `articleJsonLd` změň `inLanguage: isSk ? 'sk-SK' : 'cs-CZ'` → `inLanguage: bcp47`.

V markupu (ř. 50) breadcrumb link text `{isSk ? 'Pôda' : 'Půda'}` → `{locale === 'uk' ? t('puda.uk.crumbSelf') : (isSk ? 'Pôda' : 'Půda')}`, a back tlačítko (ř. 62) `{isSk ? t('puda.back') : '← Zpět na půdu'}` → `{locale === 'cs' ? '← Zpět na půdu' : t('puda.back')}` (sk i uk mají `puda.back` klíč).

> Pozn.: `canonical={isSk ? undefined : pageUrl}` (ř. 44) změň na `canonical={locale === 'cs' ? pageUrl : undefined}` — uk i sk dostanou self-canonical přes hreflang logiku Layoutu (stejné jako sk dnes: undefined → Layout dosadí).

- [ ] **Step 7: Ověř build + dev**

Run: `npm run build` → projde.
Dev: `http://localhost:4321/uk/puda/eroze/` → 200, placeholder článek, žádné `auto-link` třídy. `http://localhost:4321/uk/puda/neexistuje/` → 404. cs `http://localhost:4321/puda/eroze/` beze změny (auto-linky stále aktivní).

- [ ] **Step 8: Commit**

```bash
git add src/content.config.ts src/lib/markdown-with-links.ts src/pages/puda/[slug].astro src/content/puda-uk/ tests/lib/markdown-no-links.test.ts
git commit -m "feat(uk-puda): [slug] uk větev + pudaUk kolekce + auto-linker guard (T5)"
```

---

## Task 6: Populace UA dat (grounded, subagent-driven) ⚠️ rizikové

**Files:**
- Modify: `src/data/agro-puda-uk.json` (vyplnit `bigNumbers`, `cena`, `najem`, `plodiny`, `facts`, `threats`)
- Modify/Create: `src/content/puda-uk/{eroze,ornice,vyziva-pudy}.md` (přeložené články, stejné slugy jako cs)

Toto je obsahový task — NE čistý kód. Proveď přes subagenty s GROUNDINGEM na autoritativní zdroje. Každé volatilní číslo musí mít `source` + `asOf`.

- [ ] **Step 1: Zjisti cs slugy článků (parita)**

Run: `ls src/content/puda/`
Expected: `eroze.md ornice.md vyziva-pudy.md`. UK overlay musí mít PŘESNĚ tyto 3 slugy.

- [ ] **Step 2: Naplň volatilní data v `agro-puda-uk.json`**

Dispatchuj grounded subagenty (web research) na tyto bloky. Pravidla:
- **Preferované zdroje:** land.gov.ua (Держгеокадастр), ukrstat.gov.ua (Держстат), minagro.gov.ua (Мінагрополітики), data.worldbank.org, fao.org, USDA FAS, opendatabot.ua.
- Ke **každému** číslu ulož `source` (název) + `url` (přímý odkaz) + `asOf` (rok/datum).
- **Co nelze ověřit ≥1 autoritativním zdrojem → nech prázdné/vynech, NEodhaduj.**
- `cena.series` a `najem.series` = řady (rok, hodnota); dopočítej `max` (zaokrouhli nahoru) a `ticks` (4-5 hodnot 0…max).
- `bigNumbers` (3-4): např. průměrná tržní cena (po otevření trhu), růst ceny, velikost zem. fondu, počet vlastníků паїв.
- `facts` (4-8): podíl černozemu, celková orná půda, podíl pronajaté půdy, podíl orné na území atd. — evergreen, ozdrojované.
- `threats` (2-4): válečné (okupace, miny) + strukturální (eroze černozemu, degradace); `pct` jen kde existuje doložené číslo, jinak vynech threat.

Assembluj soubor přes `str.replace` (NE `re.sub`).

- [ ] **Step 3: Přelož 3 články (encyklopedický překlad → uk)**

Pro každý cs článek (`src/content/puda/{eroze,ornice,vyziva-pudy}.md`) vytvoř uk variantu `src/content/puda-uk/<stejný-slug>.md`. Půdní věda = univerzální, překládej věrně (terminologie, MSA-úroveň ukrajinštiny). Zachovej strukturu frontmatteru (`title`, `popis`) a markdown těla. Nahraď placeholder `eroze.md` z T5.

- [ ] **Step 4: Ověř build + dev smoke**

Run: `npm run build` → projde.
Dev: `/uk/puda/` nyní ukazuje cenu/nájem/plodiny/facts/threats; `/uk/puda/eroze/` reálný přeložený článek. cs/sk beze změny.

- [ ] **Step 5: Commit**

```bash
git add src/data/agro-puda-uk.json src/content/puda-uk/
git commit -m "feat(uk-puda): grounded UA data + překlad 3 článků (T6)"
```

---

## Task 7: Verifikační / jurisdikční brána

**Files:**
- Modify (dle nálezů): `src/data/agro-puda-uk.json`, `src/content/puda-uk/*.md`

Nezávislá kontrola dat z T6. Dispatchuj 2-3 review subagenty (každý jiný blok), každý křížově ověří proti ≥1 (ideálně 2) autoritativním zdrojům.

- [ ] **Step 1: Verifikace čísel**

Pro každé číslo v `agro-puda-uk.json`: ověř, že `source`/`url`/`asOf` skutečně podkládá hodnotu a zdroj je autoritativní. Flagni: nesoulady, předválečná čísla vydávaná za aktuální, agregáty z okupovaných území bez caveatu, blogové/neprimární zdroje. **Co neprojde → oprav nebo DROP (vynech), nikdy nehádej.**

- [ ] **Step 2: Jurisdikční/jazyková review článků**

Pro 3 uk články: ověř MSA ukrajinštinu (žádné russianismy), věcnou správnost půdní vědy, žádné CZ-specifické reálie omylem ponechané.

- [ ] **Step 3: Aplikuj opravy + re-run testů**

Run: `npx vitest run tests/lib/puda-uk-data.test.ts`
Expected: PASS (atribuce drží i po opravách).

- [ ] **Step 4: Commit**

```bash
git add src/data/agro-puda-uk.json src/content/puda-uk/
git commit -m "fix(uk-puda): opravy z verifikační/jurisdikční brány (T7)"
```

---

## Task 8: Testy parity + integrity

**Files:**
- Create: `tests/lib/puda-uk-parity.test.ts`

- [ ] **Step 1: Write the test**

Create `tests/lib/puda-uk-parity.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const csDir = join(process.cwd(), 'src/content/puda');
const ukDir = join(process.cwd(), 'src/content/puda-uk');
const slugs = (dir: string) => readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, '')).sort();

describe('puda-uk článková parita', () => {
  it('uk slug-set == cs slug-set (stejné slugy, žádný leak/miss)', () => {
    expect(slugs(ukDir)).toEqual(slugs(csDir));
  });
});
```

- [ ] **Step 2: Run test**

Run: `npx vitest run tests/lib/puda-uk-parity.test.ts`
Expected: PASS (po T6 jsou všechny 3 uk články na místě).

- [ ] **Step 3: Commit**

```bash
git add tests/lib/puda-uk-parity.test.ts
git commit -m "test(uk-puda): parita slugů cs↔uk (T8)"
```

---

## Task 9: Launch prefix + finální review + smoke

**Files:**
- Modify: `src/i18n/utils.ts:35` (`LAUNCHED_PREFIXES.uk += '/puda'`)
- Modify (pokud existuje uk-launch test): `tests/i18n/uk-launch.test.ts`

- [ ] **Step 1: Zjisti, zda existuje uk-launch test**

Run: `ls tests/i18n/uk-launch.test.ts 2>/dev/null && grep -n "puda\|stroje" tests/i18n/uk-launch.test.ts`

- [ ] **Step 2: Přidej `/puda` do uk launchnutých prefixů**

V `src/i18n/utils.ts` ř. 35 změň:
```ts
  uk: ['/stroje', '/srovnani', '/znacky', '/encyklopedie', '/jak-na-to'],
```
na:
```ts
  uk: ['/stroje', '/srovnani', '/znacky', '/encyklopedie', '/jak-na-to', '/puda'],
```

- [ ] **Step 3: Aktualizuj/přidej launch test**

Pokud `tests/i18n/uk-launch.test.ts` existuje, přidej assertci `isLaunchedPath('uk', '/puda') === true`. Jinak vytvoř:

```ts
import { describe, it, expect } from 'vitest';
import { isLaunchedPath } from '../../src/i18n/utils';

describe('uk launch /puda', () => {
  it('/puda je launchnuté pro uk', () => {
    expect(isLaunchedPath('uk', '/puda')).toBe(true);
    expect(isLaunchedPath('uk', '/puda/eroze')).toBe(true);
  });
});
```

- [ ] **Step 4: Plný test run**

Run: `npx vitest run`
Expected: zelené KROMĚ 3 pre-existing bazar-nav fails. Žádná nová červená.

- [ ] **Step 5: Build + produkční smoke (dev/preview)**

Run: `npm run build && npm run preview`
Ověř na `http://localhost:4321`:
- `/puda/` → 200, cs beze změny (porovnej vizuálně se starou verzí).
- `/sk/puda/` → 200, sk beze změny.
- `/uk/puda/` → 200, UA obsah, `<meta name="robots" content="index, follow">` (NE noindex), self-canonical `https://agro-svet.cz/uk/puda/`, hreflang cs↔sk↔uk.
- `/uk/puda/eroze/` → 200, přeložený článek, žádné `auto-link` třídy.
- `/uk/puda/neexistuje/` → 404.
- `curl -s http://localhost:4321/sitemap.xml | grep '/uk/puda/'` → obsahuje `/uk/puda/` + 3 články.

```bash
# robots/canonical check
curl -s http://localhost:4321/uk/puda/ | grep -i 'robots\|canonical\|hreflang'
```

- [ ] **Step 6: Finální code review**

Spusť `superpowers:requesting-code-review` (nebo `/code-review high`) nad celým diffem proti `master`. Zaměř na: byte-identitu cs/sk, atribuci dat, žádný cs leak v uk.

- [ ] **Step 7: Commit**

```bash
git add src/i18n/utils.ts tests/i18n/uk-launch.test.ts
git commit -m "feat(uk-puda): launch /puda pro uk (sitemap+hreflang auto) (T9)"
```

---

## Dokončení větve

Po T9 a zeleném review použij `superpowers:finishing-a-development-branch` (merge/PR → Coolify auto-deploy). CI „Workers Builds" fail = ignorovat (stale; reálný deploy = Coolify + `@astrojs/node`). Po živém ověření smaž worktree + větev (local+remote).

## Mimo rozsah (YAGNI)

- JS interaktivita UK grafů (tooltips/hover) — statické grafy stačí pro MVP.
- `/statistiky` (4c), `/dotace` (4d) — samostatné fáze.
- Nový UA článek o reformě trhu mimo paritu 3 cs slugů.
