# Svět — zobrazení (Plán 2/2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Vykreslit sekci `/svet/` (rozcestník zemí, profily zemí, srovnávač) nad daty z Plánu 1 — česky, hybrid Dashboard + „vs ČR" proužky + krátký příběhový úvod; profil i srovnávač předrenderované.

**Architecture:** Čisté testovatelné render-helpery v `src/lib/svet/render.ts` (seskupení indikátorů, „vs ČR" delta, formátování, SVG sparkline path) — Astro stránky je jen volají. Data se importují přímo z `src/data/svet/*.json` (NE Astro kolekce). Sekce je **cs-only** (není v `LAUNCHED_PREFIXES` pro sk/uk/pl → pod /sk|/uk|/pl je noindex, ale primárně se zobrazuje cs). Styl: znovupoužít `.sp-*` třídy a strukturu z `src/pages/puda/index.astro` + `src/pages/statistiky/index.astro`.

**Tech Stack:** Astro (`@astrojs/node`, SSR `prerender=false` u dynamických, prerender u statických), vitest, inline SVG (data jsou zapečená → server-render, žádný client fetch), progresivní JS jen u srovnávače.

**Závisí na Plánu 1:** `src/data/svet/{cesko,nemecko,francie,velka-britanie,index}.json` + `src/lib/svet/types.ts`.

## Reálný tvar dat (z Plánu 1 — NEhádej)

`src/data/svet/<slug>.json`:
```json
{
  "slug": "nemecko", "geo": "DE", "nameCs": "Německo", "flag": "🇩🇪", "generated": "2026-06-19",
  "indicators": {
    "wheat_yield": {
      "key": "wheat_yield", "label": "Výnos pšenice", "pkg": "produkce", "unit": "t/ha",
      "latest": { "value": 7.83, "unit": "t/ha", "referencePeriod": "2025", "source": "Eurostat", "sourceUrl": "https://...", "fetchedAt": "2026-06-19" },
      "series": [ { "period": "2024", "value": 7.33 }, { "period": "2025", "value": 7.83 } ]
    }
    // … 15 indikátorů
  }
}
```
`src/data/svet/index.json`: `{ "generated": "...", "countries": [ { "slug","nameCs","flag","indicatorKeys":[...], "reference"?:true } ] }`.

**15 klíčů + balíčky (`pkg`):** produkce = `wheat_yield, maize_yield, barley_yield, rapeseed_yield, cereal_yield, cattle_count, pigs_count`; puda = `ag_land, arable_land, farm_count, organic_share`; ekonomika = `ag_value_added_gdp, ag_employment, ag_output_value`; obchod = `fert_use`. Reference země = `cesko` (slug, `reference:true` v indexu).

**Pozn. UK:** část Eurostat ukazatelů má `referencePeriod` 2019–2020 (brexit) → v UI u takových ukázat období jako „(nejnovější dostupné)".

---

## Soubory (mapa)

- Create: `src/lib/svet/render.ts` — čisté helpery (load, group, vsRef, fmt, sparkline). Test: `tests/lib/svet-render.test.ts`.
- Create: `src/components/svet/Sparkline.astro` — inline SVG mini-graf.
- Create: `src/components/svet/IndicatorRow.astro` — řádek ukazatele: hodnota + sparkline + „vs ČR" proužek + zdroj.
- Create: `src/pages/svet/index.astro` — rozcestník (mřížka zemí).
- Create: `src/pages/svet/[slug].astro` — profil země (getStaticPaths nad indexem).
- Create: `src/pages/svet/srovnani/index.astro` — srovnávač.
- Create: `src/components/svet/Comparator.astro` + `src/components/svet/comparator.client.ts` — interaktivní část srovnávače.
- Modify: `src/i18n/nav.ts` — přidat top-level „Svět".
- Modify: i18n ui soubor (kde jsou `nav.*` klíče) — `nav.svet*` labely.
- Modify: `src/pages/sitemap.xml.ts` — `/svet/`, `/svet/<slug>/`, `/svet/srovnani/`.
- Modify: `scripts/gen-content-dates.mjs` — datum pro `svet` (lastmod).
- Test: `tests/svet-pages.test.ts` — sitemap obsahuje svet URL + render helpery integračně.

---

## Task 1: Render helpery (`src/lib/svet/render.ts`)

**Files:** Create `src/lib/svet/render.ts`; Test `tests/lib/svet-render.test.ts`.

- [ ] **Step 1: Napiš padající test**

```ts
// tests/lib/svet-render.test.ts
import { describe, it, expect } from 'vitest';
import { groupByPackage, vsReference, fmtNum, sparklinePath, PACKAGE_ORDER, PACKAGE_LABELS } from '../../src/lib/svet/render';

const ind = (key: string, pkg: any, value: number) => ({
  key, label: key, pkg, unit: 't/ha',
  latest: { value, unit: 't/ha', referencePeriod: '2025', source: 'Eurostat', sourceUrl: 'x', fetchedAt: '2026-06-19' },
  series: [{ period: '2024', value: value - 0.5 }, { period: '2025', value }],
});

describe('groupByPackage', () => {
  it('seskupí indikátory do balíčků v pevném pořadí', () => {
    const profile = { slug: 'de', geo: 'DE', nameCs: 'Německo', flag: '🇩🇪', generated: '2026-06-19',
      indicators: { wheat_yield: ind('wheat_yield', 'produkce', 7.8), ag_land: ind('ag_land', 'puda', 16.6) } };
    const groups = groupByPackage(profile);
    expect(groups.map((g) => g.pkg)).toEqual(PACKAGE_ORDER.filter((p) => ['produkce', 'puda'].includes(p)));
    expect(groups[0].label).toBe(PACKAGE_LABELS.produkce);
    expect(groups[0].indicators[0].key).toBe('wheat_yield');
  });
});

describe('vsReference', () => {
  it('spočítá % rozdíl vůči ČR a směr', () => {
    expect(vsReference(7.8, 6.1)).toEqual({ pct: 28, dir: 'up' });
    expect(vsReference(6.1, 6.1)).toEqual({ pct: 0, dir: 'same' });
    expect(vsReference(5.0, 6.1)).toEqual({ pct: -18, dir: 'down' });
  });
  it('vrátí null když reference chybí nebo je 0', () => {
    expect(vsReference(7.8, 0)).toBeNull();
    expect(vsReference(7.8, undefined as any)).toBeNull();
  });
});

describe('fmtNum', () => {
  it('formátuje česky (mezera tisíců, desetinná čárka)', () => {
    expect(fmtNum(1234.5)).toBe('1 234,5');
    expect(fmtNum(7.83)).toBe('7,83');
    expect(fmtNum(255010)).toBe('255 010');
  });
});

describe('sparklinePath', () => {
  it('vrátí SVG path s počtem bodů == series', () => {
    const d = sparklinePath([{ period: '2023', value: 1 }, { period: '2024', value: 2 }, { period: '2025', value: 3 }], 100, 30);
    expect(d.startsWith('M')).toBe(true);
    expect((d.match(/L/g) || []).length).toBe(2); // 3 body → M + 2×L
  });
  it('zvládne prázdnou/jednobodovou řadu bez chyby', () => {
    expect(sparklinePath([], 100, 30)).toBe('');
    expect(sparklinePath([{ period: '2025', value: 5 }], 100, 30)).toMatch(/^M/);
  });
});
```

- [ ] **Step 2: Spusť → FAIL.** `npx vitest run tests/lib/svet-render.test.ts`

- [ ] **Step 3: Implementuj `src/lib/svet/render.ts`:**

```ts
import type { CountryProfile, Indicator, PackageKey, SeriesPoint } from './types';

export const PACKAGE_ORDER: PackageKey[] = ['produkce', 'puda', 'ekonomika', 'obchod'];
export const PACKAGE_LABELS: Record<PackageKey, string> = {
  produkce: 'Produkce', puda: 'Půda a struktura farem', ekonomika: 'Ekonomika a příjmy', obchod: 'Obchod a vstupy',
};
// Pevné pořadí indikátorů v rámci balíčku (co není uvedeno, jde na konec dle abecedy klíče).
const INDICATOR_ORDER: string[] = [
  'wheat_yield', 'maize_yield', 'barley_yield', 'rapeseed_yield', 'cereal_yield', 'cattle_count', 'pigs_count',
  'ag_land', 'arable_land', 'farm_count', 'organic_share',
  'ag_output_value', 'ag_value_added_gdp', 'ag_employment', 'fert_use',
];

export interface PackageGroup { pkg: PackageKey; label: string; indicators: Indicator[]; }

export function groupByPackage(profile: CountryProfile): PackageGroup[] {
  const inds = Object.values(profile.indicators);
  const ord = (k: string) => { const i = INDICATOR_ORDER.indexOf(k); return i === -1 ? 999 : i; };
  return PACKAGE_ORDER
    .map((pkg) => ({
      pkg, label: PACKAGE_LABELS[pkg],
      indicators: inds.filter((i) => i.pkg === pkg).sort((a, b) => ord(a.key) - ord(b.key) || a.key.localeCompare(b.key)),
    }))
    .filter((g) => g.indicators.length > 0);
}

export function vsReference(value: number, refValue: number): { pct: number; dir: 'up' | 'down' | 'same' } | null {
  if (!refValue || !Number.isFinite(refValue)) return null;
  const pct = Math.round((value / refValue - 1) * 100);
  return { pct, dir: pct > 0 ? 'up' : pct < 0 ? 'down' : 'same' };
}

const NF = new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 2 });
export function fmtNum(value: number): string {
  return NF.format(value).replace(/ /g, ' '); // sjednotit na běžnou mezeru
}

export function sparklinePath(series: SeriesPoint[], w: number, h: number, pad = 2): string {
  if (!series.length) return '';
  if (series.length === 1) return `M0 ${h / 2}`;
  const vals = series.map((p) => p.value);
  const min = Math.min(...vals), max = Math.max(...vals);
  const span = max - min || 1;
  const stepX = (w - pad * 2) / (series.length - 1);
  const pts = series.map((p, i) => {
    const x = pad + i * stepX;
    const y = pad + (h - pad * 2) * (1 - (p.value - min) / span);
    return `${Math.round(x * 100) / 100} ${Math.round(y * 100) / 100}`;
  });
  return `M${pts[0]}` + pts.slice(1).map((p) => `L${p}`).join('');
}
```

- [ ] **Step 4: Spusť → PASS.** `npx vitest run tests/lib/svet-render.test.ts`

- [ ] **Step 5: Commit** `feat(svet): render helpery (group/vsReference/fmt/sparkline)`.

---

## Task 2: Komponenty Sparkline + IndicatorRow

**Files:** Create `src/components/svet/Sparkline.astro`, `src/components/svet/IndicatorRow.astro`.

> Bez nového testu (Astro komponenty, render helpery už otestované v Task 1). Drž vizuální soulad s `.sp-*` třídami z `src/pages/puda/index.astro`.

- [ ] **Step 1: `src/components/svet/Sparkline.astro`:**

```astro
---
import { sparklinePath } from '../../lib/svet/render';
import type { SeriesPoint } from '../../lib/svet/types';
interface Props { series: SeriesPoint[]; w?: number; h?: number; }
const { series, w = 120, h = 34 } = Astro.props;
const d = sparklinePath(series, w, h);
const last = series[series.length - 1];
---
{d && (
  <svg class="svet-spark" width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-hidden="true">
    <path d={d} fill="none" stroke="#2f6b2f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    {last && <circle cx={w - 2} cy={(() => { const v = series.map((p) => p.value); const mn = Math.min(...v), mx = Math.max(...v); const sp = mx - mn || 1; return 2 + (h - 4) * (1 - (last.value - mn) / sp); })()} r="2.5" fill="#2f6b2f" />}
  </svg>
)}
```

- [ ] **Step 2: `src/components/svet/IndicatorRow.astro`** (hodnota + sparkline + „vs ČR" proužek + zdroj):

```astro
---
import Sparkline from './Sparkline.astro';
import { fmtNum, vsReference } from '../../lib/svet/render';
import type { Indicator } from '../../lib/svet/types';
interface Props { indicator: Indicator; refValue?: number; refName?: string; }
const { indicator: ind, refValue, refName = 'ČR' } = Astro.props;
const cmp = refValue != null ? vsReference(ind.latest.value, refValue) : null;
const stale = Number(ind.latest.referencePeriod) > 0 && Number(ind.latest.referencePeriod) <= 2020;
const dirSign = cmp ? (cmp.dir === 'up' ? '+' : '') : '';
---
<div class="svet-row">
  <div class="svet-row-main">
    <span class="svet-row-label">{ind.label}</span>
    <span class="svet-row-value">{fmtNum(ind.latest.value)} <span class="svet-row-unit">{ind.unit}</span></span>
  </div>
  <Sparkline series={ind.series} />
  <div class="svet-row-meta">
    {cmp && (
      <span class={`svet-vs svet-vs-${cmp.dir}`}>{dirSign}{fmtNum(cmp.pct)} % vs {refName}</span>
    )}
    <a class="sp-src" href={ind.latest.sourceUrl} target="_blank" rel="noopener noreferrer">
      {ind.latest.source} · {ind.latest.referencePeriod}{stale ? ' (nejnovější dostupné)' : ''}
    </a>
  </div>
</div>
```

- [ ] **Step 3: Build sanity** `npx astro check 2>/dev/null || true` a `npm run build` později v Task 8. Pro teď ověř TS importy: `npx tsc --noEmit -p tsconfig.json 2>&1 | grep svet || echo "no svet TS errors"`.

- [ ] **Step 4: Commit** `feat(svet): komponenty Sparkline + IndicatorRow`.

---

## Task 3: Profil země `/svet/[slug].astro`

**Files:** Create `src/pages/svet/[slug].astro`.

- [ ] **Step 1: Implementuj stránku** (getStaticPaths nad `index.json`, data import per slug, hero KPI + sekce po balíčcích):

```astro
---
import Layout from '../../layouts/Layout.astro';
import IndicatorRow from '../../components/svet/IndicatorRow.astro';
import { groupByPackage, fmtNum } from '../../lib/svet/render';
import { assertCountryProfile } from '../../lib/svet/types';
import index from '../../data/svet/index.json';

export async function getStaticPaths() {
  const mods = import.meta.glob('../../data/svet/*.json', { eager: true });
  return index.countries
    .filter((c) => !c.reference) // ČR je reference, ne samostatná stránka
    .map((c) => {
      const profile = (mods[`../../data/svet/${c.slug}.json`] as any).default;
      return { params: { slug: c.slug }, props: { profile } };
    });
}

const { profile } = Astro.props as { profile: any };
assertCountryProfile(profile);

// Reference (ČR) pro „vs ČR" proužky
const refMods = import.meta.glob('../../data/svet/cesko.json', { eager: true });
const ref = (Object.values(refMods)[0] as any).default;
const refVal = (key: string) => ref.indicators[key]?.latest?.value;

const groups = groupByPackage(profile);
// Hero KPI: 4 headline ukazatele (pokud existují)
const heroKeys = ['ag_land', 'ag_output_value', 'farm_count', 'cattle_count'];
const heroKpis = heroKeys.map((k) => profile.indicators[k]).filter(Boolean);

const title = `Zemědělství v ${profile.nameCs === 'Německo' ? 'Německu' : profile.nameCs}`;
const description = `Aktuální zemědělská data: ${profile.nameCs} — produkce, půda, ekonomika a srovnání s ČR. Zdroje Eurostat a World Bank.`;
---
<Layout title={title} description={description}>
  <main class="sp-page svet-profile">
    <header class="sp-hero svet-hero">
      <div class="svet-hero-inner">
        <span class="svet-flag">{profile.flag}</span>
        <h1>{title}</h1>
        <p class="svet-lede">{description}</p>
      </div>
      <div class="svet-kpis">
        {heroKpis.map((k: any) => (
          <div class="svet-kpi">
            <div class="svet-kpi-val">{fmtNum(k.latest.value)} <span>{k.unit}</span></div>
            <div class="svet-kpi-lbl">{k.label}</div>
          </div>
        ))}
      </div>
    </header>

    {groups.map((g) => (
      <section class="sp-section svet-section">
        <header class="sp-section-head"><h2>{g.label}</h2></header>
        <div class="svet-rows">
          {g.indicators.map((ind: any) => (
            <IndicatorRow indicator={ind} refValue={refVal(ind.key)} refName="ČR" />
          ))}
        </div>
      </section>
    ))}

    <section class="sp-section svet-section">
      <header class="sp-section-head"><h2>Zdroje a metodika</h2></header>
      <p class="svet-method">Data se stahují automaticky z oficiálních otevřených zdrojů (Eurostat, World Bank) a u každého ukazatele je uvedeno období a odkaz na zdroj. Hodnoty jsou srovnatelné mezi zeměmi; „vs ČR" porovnává poslední dostupnou hodnotu s Českem. Aktualizováno {profile.generated}.</p>
      <p class="svet-method"><a href="/svet/srovnani/">Porovnat země vedle sebe →</a></p>
    </section>
  </main>

  <style>
    .svet-hero{display:grid;gap:1rem}
    .svet-flag{font-size:2.4rem}
    .svet-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:.6rem}
    .svet-kpi{background:rgba(255,255,255,.08);border-radius:10px;padding:.7rem .9rem}
    .svet-kpi-val{font-size:1.5rem;font-weight:700}
    .svet-kpi-val span{font-size:.8rem;font-weight:500;opacity:.8}
    .svet-kpi-lbl{font-size:.78rem;opacity:.85;text-transform:uppercase;letter-spacing:.03em}
    .svet-rows{display:grid;gap:.4rem}
    .svet-row{display:grid;grid-template-columns:1fr auto auto;align-items:center;gap:1rem;padding:.6rem .2rem;border-bottom:1px solid #eef1ec}
    .svet-row-main{display:grid}
    .svet-row-label{font-weight:600}
    .svet-row-value{font-size:1.1rem}
    .svet-row-unit{font-size:.8rem;color:#789}
    .svet-row-meta{display:grid;justify-items:end;gap:.15rem;min-width:150px}
    .svet-vs{font-size:.8rem;font-weight:600;border-radius:10px;padding:.05rem .5rem}
    .svet-vs-up{background:#e8f1e2;color:#2f6b2f}
    .svet-vs-down{background:#fbe9e7;color:#b4452f}
    .svet-vs-same{background:#eef1ec;color:#567}
    .svet-row-meta .sp-src{font-size:.72rem;color:#9aa}
    @media(max-width:680px){.svet-row{grid-template-columns:1fr auto}.svet-row .svet-spark{display:none}}
  </style>
</Layout>
```

> POZN.: pokud `import.meta.glob` cesty nesedí na build, ověř relativní cestu z `src/pages/svet/` (mělo by být `../../data/svet/*.json`). Skloňování názvu země v `title` zjednoduš na `Zemědělství v zemi {nameCs}` pokud by deklinace dělala problém — ale preferuj hezký tvar pro DE/FR/GB (Německu/Francii/Velké Británii) přes malou mapu.

- [ ] **Step 2: Skloňovací mapa** — nahraď inline ternární `profile.nameCs === 'Německo' ? …` malou mapou lokativu v `render.ts`:
```ts
export const COUNTRY_LOCATIVE: Record<string, string> = { nemecko: 'Německu', francie: 'Francii', 'velka-britanie': 'Velké Británii', usa: 'USA' };
```
a v stránce `const loc = COUNTRY_LOCATIVE[profile.slug] ?? profile.nameCs; const title = \`Zemědělství v ${loc}\`;`. Přidej test do `tests/lib/svet-render.test.ts` že mapa obsahuje fázi-1 slugy.

- [ ] **Step 3: Build ověření** proběhne v Task 8. Zatím `npx tsc --noEmit 2>&1 | grep "svet/\[slug\]" || echo ok`.

- [ ] **Step 4: Commit** `feat(svet): profil země /svet/[slug] (hero KPI + sekce + vs ČR)`.

---

## Task 4: Rozcestník `/svet/index.astro`

**Files:** Create `src/pages/svet/index.astro`.

- [ ] **Step 1: Implementuj** (mřížka karet zemí z `index.json`, odkaz na srovnávač):

```astro
---
import Layout from '../../layouts/Layout.astro';
import index from '../../data/svet/index.json';
const countries = index.countries.filter((c) => !c.reference);
const title = 'Zemědělství ve světě — data zemí';
const description = 'Zemědělská data evropských zemí i světa: produkce, půda, ekonomika. Profily zemí a srovnání s Českem. Zdroje Eurostat a World Bank.';
---
<Layout title={title} description={description}>
  <main class="sp-page svet-hub">
    <header class="sp-hero"><div><h1>{title}</h1><p>{description}</p></div></header>
    <section class="sp-section">
      <div class="svet-grid">
        {countries.map((c) => (
          <a class="svet-card" href={`/svet/${c.slug}/`}>
            <span class="svet-card-flag">{c.flag}</span>
            <span class="svet-card-name">{c.nameCs}</span>
            <span class="svet-card-cta">Zobrazit data →</span>
          </a>
        ))}
      </div>
      <p style="margin-top:1rem"><a href="/svet/srovnani/">Porovnat země vedle sebe →</a></p>
    </section>
    <style>
      .svet-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:.8rem}
      .svet-card{display:grid;gap:.3rem;padding:1rem;border:1px solid #dde7d6;border-radius:12px;background:#fff;text-decoration:none;color:inherit;transition:box-shadow .15s}
      .svet-card:hover{box-shadow:0 4px 14px rgba(0,0,0,.08)}
      .svet-card-flag{font-size:2rem}
      .svet-card-name{font-weight:700;font-size:1.1rem}
      .svet-card-cta{font-size:.8rem;color:#2f6b2f}
    </style>
  </main>
</Layout>
```

- [ ] **Step 2: Commit** `feat(svet): rozcestník /svet/ (mřížka zemí)`.

---

## Task 5: Srovnávač `/svet/srovnani/` + interaktivita

**Files:** Create `src/pages/svet/srovnani/index.astro`, `src/components/svet/Comparator.astro`, `src/components/svet/comparator.client.ts`.

> Strategie: server-render výchozí pohled (všechny fáze-1 země + ČR, výchozí ukazatel `wheat_yield`, žebříček). Do stránky vlož `<script type="application/json">` se VŠEMI daty (latest hodnoty všech ukazatelů všech zemí — malé). Klientský skript přepíná ukazatel/země a překresluje tabulku + jednoduchý bar žebříček. Bez JS zůstává výchozí pohled funkční (předrenderovaný).

- [ ] **Step 1: Helper pro srovnávací dataset** — do `src/lib/svet/render.ts` přidej:
```ts
export interface CompareCell { slug: string; nameCs: string; flag: string; value: number | null; period: string | null; }
export function compareMatrix(profiles: CountryProfile[], indicatorKey: string): CompareCell[] {
  return profiles.map((p) => {
    const ind = p.indicators[indicatorKey];
    return { slug: p.slug, nameCs: p.nameCs, flag: p.flag, value: ind?.latest.value ?? null, period: ind?.latest.referencePeriod ?? null };
  });
}
```
Přidej test do `tests/lib/svet-render.test.ts`: `compareMatrix` vrátí buňku per profil, null když ukazatel chybí.

- [ ] **Step 2: `src/pages/svet/srovnani/index.astro`** — načti všechny profily (glob), sestav výběr ukazatelů (unie `INDICATOR_ORDER` přítomných), embedni JSON, vyrenderuj výchozí žebříček server-side, mountni klientský skript:

```astro
---
import Layout from '../../../layouts/Layout.astro';
import { compareMatrix, fmtNum, vsReference } from '../../../lib/svet/render';
const mods = import.meta.glob('../../../data/svet/*.json', { eager: true });
const profiles = Object.values(mods).map((m: any) => m.default);
// pořadí: ČR první (reference), pak ostatní abecedně dle nameCs
profiles.sort((a: any, b: any) => (a.slug === 'cesko' ? -1 : b.slug === 'cesko' ? 1 : a.nameCs.localeCompare(b.nameCs)));
// seznam ukazatelů (klíč + label + unit) z prvního profilu, sjednocený
const indicatorMeta: Record<string, { label: string; unit: string }> = {};
for (const p of profiles) for (const k of Object.keys(p.indicators)) indicatorMeta[k] ??= { label: p.indicators[k].label, unit: p.indicators[k].unit };
const defaultKey = 'wheat_yield';
const rows = compareMatrix(profiles as any, defaultKey).filter((c) => c.value != null).sort((a, b) => (b.value! - a.value!));
const refVal = (profiles.find((p: any) => p.slug === 'cesko') as any)?.indicators[defaultKey]?.latest.value;
const payload = profiles.map((p: any) => ({ slug: p.slug, nameCs: p.nameCs, flag: p.flag, indicators: Object.fromEntries(Object.entries(p.indicators).map(([k, v]: any) => [k, { value: v.latest.value, period: v.latest.referencePeriod }])) }));
const title = 'Srovnání zemědělství zemí';
const description = 'Porovnejte zemědělské ukazatele zemí vedle sebe — výnosy, plochy, produkce, ekonomika — vždy se srovnáním s ČR. Zdroje Eurostat a World Bank.';
---
<Layout title={title} description={description}>
  <main class="sp-page svet-cmp">
    <header class="sp-hero"><div><h1>{title}</h1><p>{description}</p></div></header>
    <section class="sp-section">
      <label class="svet-cmp-pick">Ukazatel:
        <select id="svet-indicator">
          {Object.entries(indicatorMeta).map(([k, m]) => (
            <option value={k} selected={k === defaultKey}>{m.label} ({m.unit})</option>
          ))}
        </select>
      </label>
      <table class="svet-cmp-table" id="svet-cmp-table">
        <thead><tr><th>#</th><th>Země</th><th>Hodnota</th><th>vs ČR</th></tr></thead>
        <tbody>
          {rows.map((c, i) => {
            const cmp = refVal != null ? vsReference(c.value!, refVal) : null;
            return (<tr><td>{i + 1}</td><td>{c.flag} {c.nameCs}</td><td>{fmtNum(c.value!)}</td><td>{cmp ? `${cmp.dir === 'up' ? '+' : ''}${fmtNum(cmp.pct)} %` : '—'}</td></tr>);
          })}
        </tbody>
      </table>
      <p class="sp-src" id="svet-cmp-src">Zdroj: Eurostat / World Bank · poslední dostupná data</p>
    </section>
    <script type="application/json" id="svet-data" set:html={JSON.stringify(payload)}></script>
    <script src="/src/components/svet/comparator.client.ts"></script>
  </main>
  <style>
    .svet-cmp-table{width:100%;border-collapse:collapse;margin-top:.8rem}
    .svet-cmp-table th,.svet-cmp-table td{padding:.45rem .6rem;border-bottom:1px solid #eef1ec;text-align:left}
    .svet-cmp-pick select{padding:.35rem .6rem;border:1px solid #cdd;border-radius:8px}
  </style>
</Layout>
```

> POZN. k mountu skriptu: v Astro použij `import` přes `<script>` bez `src` cesty do /src — správně je vložit klientský kód přímo do `<script>` bloku v `.astro` (Astro ho zbundluje), NEBO importovat. Implementer zvolí idiomatický způsob: nejjednodušší je napsat klientskou logiku přímo do `<script>` (ne `is:inline`) v této stránce a soubor `comparator.client.ts` vynechat, pokud to zjednoduší. Cíl: změna `#svet-indicator` přepočítá tabulku z `#svet-data` JSON (seřadí sestupně, spočítá vs ČR z hodnoty `cesko`).

- [ ] **Step 3: Klientská logika** (buď v `<script>` bloku stránky, nebo `comparator.client.ts`): načti JSON z `#svet-data`, na `change` selectu přerenderuj `<tbody>` (seřaď podle hodnoty zvoleného ukazatele sestupně, vynech null, spočítej `vs ČR` proti `cesko`). Použij `Intl.NumberFormat('cs-CZ')`. Žádný `Math.random`/`Date.now`.

- [ ] **Step 4: Commit** `feat(svet): srovnávač /svet/srovnani (server-render + JS přepínač ukazatele)`.

> ⚠️ **VĚDOMÉ OSEKÁNÍ rozsahu:** schválený mockup srovnávače měl přepínač **Trend v čase / Žebříček**. Tento plán dodává JEN **Žebříček** (+ přepínač ukazatele a srovnání vs ČR). **Trendový (multi-line) pohled** napříč zeměmi v čase je **follow-up** (data pro něj existují — `series` u každého ukazatele — takže půjde přidat bez změny enginu). Není to tichý cut — je to záměrná fáze 1 zobrazení.

---

## Task 6: Navigace + i18n labely

**Files:** Modify `src/i18n/nav.ts`; Modify i18n ui soubor s `nav.*` klíči (najdi grepem `'nav.data'`).

- [ ] **Step 1:** Najdi definici nav klíčů: `grep -rn "nav.data" src/i18n/`. Do téhož místa přidej cs labely `nav.svet = 'Svět'`, `nav.svet.profiles = 'Profily zemí'`, `nav.svet.compare = 'Srovnání zemí'`.

- [ ] **Step 2:** V `src/i18n/nav.ts` přidej do `NAV` top-level položku za `data`:
```ts
{ section: 'svet', labelKey: 'nav.svet', href: '/svet/', children: [
  { labelKey: 'nav.svet.profiles', href: '/svet/' },
  { labelKey: 'nav.svet.compare', href: '/svet/srovnani/' },
] },
```

- [ ] **Step 3:** Sekce je cs-only → přidej `'svet'` do `HIDDEN_SECTIONS` pro `sk`, `uk`, `pl` (aby se v jejich nav nezobrazovala). Ověř, že stávající testy nav (`tests/i18n/nav.test.ts`) buď projdou, nebo uprav očekávání jen pokud test počítá top-level položky cs (přidání „Svět" do cs zvýší cs top-level count → uprav ten konkrétní assert; NEměň sk/uk/pl očekávání). Pozn.: 3 baseline faily kolem bazar/footer jsou pre-existing — nepleť si je s tímto.

- [ ] **Step 4:** Spusť `npx vitest run tests/i18n/nav.test.ts` a srovnej s baseline (před změnou). Commit `feat(svet): nav „Svět" (cs-only) + i18n labely`.

---

## Task 7: Sitemap + lastmod

**Files:** Modify `src/pages/sitemap.xml.ts`; Modify `scripts/gen-content-dates.mjs`.

- [ ] **Step 1:** V `scripts/gen-content-dates.mjs` přidej datum pro klíč `svet` (datum poslední změny `src/data/svet/` nebo `index.json.generated`). Sleduj stávající vzor (jak vznikají D_PUDA apod.).

- [ ] **Step 2:** V `src/pages/sitemap.xml.ts`:
  - přidej `const D_SVET = dsDate('svet');` (dle stávajícího vzoru `dsDate`).
  - do `staticPaths` přidej `['/svet/', 'weekly', '0.85', D_SVET]` a `['/svet/srovnani/', 'monthly', '0.6', D_SVET]`.
  - přidej smyčku nad country profily:
```ts
import svetIndex from '../data/svet/index.json';
for (const c of svetIndex.countries.filter((c) => !c.reference)) {
  urls.push({ loc: `${SITE_URL}/svet/${c.slug}/`, changefreq: 'monthly', priority: '0.7', lastmod: D_SVET });
}
```
  - sekce je cs-only → NEpřidávej locale mirrors pro /svet (jako u nelaunchnutých).

- [ ] **Step 3:** Commit `feat(svet): sitemap /svet/ + profily + srovnání (lastmod z gen-content-dates)`.

---

## Task 8: Build, sitemap test, vizuální ověření

**Files:** Create `tests/svet-pages.test.ts`.

- [ ] **Step 1: Test sitemapy + dat** `tests/svet-pages.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import index from '../src/data/svet/index.json';

describe('svet data index', () => {
  it('obsahuje fázi 1 a referenční ČR', () => {
    const slugs = index.countries.map((c) => c.slug);
    for (const s of ['cesko', 'nemecko', 'francie', 'velka-britanie']) expect(slugs).toContain(s);
    expect(index.countries.find((c) => c.slug === 'cesko')?.reference).toBe(true);
  });
});

describe('sitemap obsahuje svet URL', () => {
  it('má /svet/, profily i srovnání', async () => {
    const mod = await import('../src/pages/sitemap.xml.ts');
    const res = await mod.GET({ site: new URL('https://agro-svet.cz') } as any);
    const xml = await res.text();
    expect(xml).toContain('/svet/');
    expect(xml).toContain('/svet/nemecko/');
    expect(xml).toContain('/svet/srovnani/');
  });
});
```
Pozn.: pokud `GET` vyžaduje jiný kontext (viz stávající sitemap testy, jsou-li), zkopíruj jejich způsob volání.

- [ ] **Step 2:** `npx vitest run tests/svet-pages.test.ts tests/lib/svet-render.test.ts` → PASS.

- [ ] **Step 3: Full build** `npm run build` → musí projít bez chyb u `/svet/*`. (Build spustí gen-content-dates → NEcommituj přegenerovaný `content-dates.json` pokud se mění jen časově; commituj jen pokud přibyl klíč `svet`.)

- [ ] **Step 4: Vizuální ověření** přes `/run` nebo dev server: `npm run dev`, otevři `/svet/`, `/svet/nemecko/`, `/svet/srovnani/`; zkontroluj hero KPI, „vs ČR" proužky (DE pšenice +28 % vs ČR), sparkliny, přepínač ukazatele ve srovnávači. Oprav vizuální drobnosti.

- [ ] **Step 5:** Spusť celou sadu `npx vitest run` (čekej 3 pre-existing nav baseline faily + případně 1 upravený nav assert z Task 6; žádné svet faily). Commit `test(svet): sitemap + data index testy`.

---

## Hotovo, když

- `/svet/`, `/svet/<slug>/`, `/svet/srovnani/` se renderují (build projde), cs, s Layoutem, canonical, sitemap je obsahuje.
- Profil: hero KPI + sekce po balíčcích + „vs ČR" proužky + sparkliny + zdroj/období u každého ukazatele (UK stale = „(nejnovější dostupné)").
- Srovnávač: výchozí žebříček předrenderovaný + JS přepínač ukazatele, tabulka „vs ČR".
- Nav „Svět" v cs (skrytá v sk/uk/pl). Render helpery otestované.

→ **Další fáze (mimo tento plán):** zbytek Evropy + USA (přidat do `scripts/lib/svet/countries.mjs`, `npm run data:world`), pak flip do jazyků (sk/uk/pl → přidat `/svet` do `LAUNCHED_PREFIXES`, lokalizovat labely+úvody), volitelně zahraniční obchod (export/import) jako další indikátory.
