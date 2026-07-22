# Historie českého zemědělství — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Postavit sekci `/historie/` (rozcestník + 4 podstránky) mapující historický vývoj českého zemědělství — stroje, dlouhodobá data, dobový tisk, zajímavosti.

**Architecture:** Precomputed JSON (`src/data/agro-historie.json`) → typovaná lib vrstva (`src/lib/historie.ts`) → SSR Astro stránky (`prerender=false`, locale rewrite jako zbytek webu). Grafy přes Chart.js z CDN (stejný inline vzor jako `/statistiky/komodita/[slug]`). Launch cs-only, struktura i18n-ready.

**Tech Stack:** Astro 6, TypeScript, Vitest 4, Chart.js 4 (CDN), Cloudflare Workers deploy.

---

## Konvence z codebase (pro workera)

- Stránky pod `src/pages/`, `export const prerender = false;` nahoře, `const locale = Astro.locals.locale ?? 'cs';`.
- Layout: `import Layout from '../../layouts/Layout.astro'`; props `title`, `description`, `canonical`, `ogType`, `noindex`, `noHreflang`. Historie je cs-only → non-cs varianty dostanou `noindex` + `noHreflang`.
- Data se importují přímo z JSON (`import data from '../data/...json'`) — vzor viz `tests/svet-pages.test.ts`.
- Cache hlavička na stránkách: `Astro.response.headers.set('Cache-Control', 'public, max-age=600, s-maxage=86400, stale-while-revalidate=604800');`
- Slug helper už existuje: `udrzovatelSlug` v `src/lib/plodiny` (diakritika → kebab). Použij ho pro stroje.
- Testy: `npm run test` (vitest run). Testy v `tests/`, importují ze `../src/...`.
- Build: `npm run build`. Deploy: push master → CF build → `npm run purge` (Node ≥22).

## File Structure

- Create: `src/data/agro-historie.json` — veškerá data sekce (milestones, machines, longRange, press, trivia).
- Create: `src/lib/historie.ts` — typy + typované accessory nad JSON.
- Create: `tests/lib/historie.test.ts` — shape + coverage testy dat.
- Create: `src/components/HistorieLineChart.astro` — jeden graf (canvas + JSON data tag), init řeší stránka.
- Create: `src/pages/historie/index.astro` — hub.
- Create: `src/pages/historie/technika/index.astro` — přehled strojů.
- Create: `src/pages/historie/technika/[slug].astro` — detail stroje.
- Create: `src/pages/historie/data/index.astro` — grafy.
- Create: `src/pages/historie/dobovy-tisk/index.astro` — výstřižky.
- Create: `src/pages/historie/zajimavosti/index.astro` — zajímavosti.
- Modify: `src/i18n/nav.ts` — přidat dítě `nav.data.historie` pod sekci `data`.
- Modify: `src/i18n/ui/cs.ts` (+ `sk.ts`, `uk.ts`, `pl.ts`) — klíč `nav.data.historie`.

---

### Task 1: Typy + lib vrstva nad prázdným datasetem

**Files:**
- Create: `src/data/agro-historie.json`
- Create: `src/lib/historie.ts`
- Test: `tests/lib/historie.test.ts`

- [ ] **Step 1: Napsat minimální dataset (kostra, reálný obsah přijde v Tasku 2)**

`src/data/agro-historie.json`:
```json
{
  "generated": "2026-07-22",
  "milestones": [
    { "year": 1949, "title": "Zákon o JZD", "note": "Start kolektivizace zemědělství." }
  ],
  "machines": [
    {
      "slug": "kombajn-e-512",
      "name": "Kombajn E-512",
      "category": "kombajn",
      "maker": "Fortschritt (NDR)",
      "yearsFrom": 1970,
      "yearsTo": 1985,
      "specs": { "Záběr žací lišty": "5–6 m", "Motor": "vznětový, ~100 kW", "Zásobník zrna": "3 600 l" },
      "story": "Východoněmecký kombajn E-512 se stal symbolem žní v JZD. Robustní, jednoduchý na údržbu, po ČSSR jich jezdily tisíce.",
      "image": null
    }
  ],
  "longRange": [
    { "key": "dojivost", "label": "Dojivost krav", "unit": "l/ks/rok", "source": "ČSÚ", "points": [ { "year": 1960, "value": 1900 }, { "year": 2020, "value": 8500 } ] }
  ],
  "press": [
    { "year": 1974, "source": "Zemědělské noviny", "headline": "Nové kombajny E-512 zvyšují výkon žní", "context": "Dobová reportáž o nasazení nové techniky v JZD." }
  ],
  "trivia": [
    { "title": "Dojivost se za 60 let zečtyřnásobila", "body": "Z necelých 2 000 litrů na krávu ročně na přes 8 000.", "then": "1 900 l (1960)", "now": "8 500 l (2020)" }
  ]
}
```

- [ ] **Step 2: Napsat lib s typy a accessory**

`src/lib/historie.ts`:
```ts
// src/lib/historie.ts
// Typovaná vrstva nad src/data/agro-historie.json (bez runtime fetch, stejný
// vzor jako ostatní datové sekce). cs-only obsah.
import raw from '../data/agro-historie.json';

export type Machine = {
  slug: string;
  name: string;
  category: string;
  maker: string;
  yearsFrom: number;
  yearsTo: number | null;
  specs: Record<string, string>;
  story: string;
  image: string | null;
};
export type SeriesPoint = { year: number; value: number };
export type LongRange = {
  key: string;
  label: string;
  unit: string;
  source: string;
  points: SeriesPoint[];
};
export type PressClip = { year: number; source: string; headline: string; context: string };
export type Trivia = { title: string; body: string; then?: string; now?: string };
export type Milestone = { year: number; title: string; note: string };

const data = raw as {
  generated: string;
  milestones: Milestone[];
  machines: Machine[];
  longRange: LongRange[];
  press: PressClip[];
  trivia: Trivia[];
};

export const generated = data.generated;
export const milestones: Milestone[] = [...data.milestones].sort((a, b) => a.year - b.year);
export const machines: Machine[] = data.machines;
export const longRange: LongRange[] = data.longRange;
export const press: PressClip[] = [...data.press].sort((a, b) => a.year - b.year);
export const trivia: Trivia[] = data.trivia;

export function machineBySlug(slug: string): Machine | undefined {
  return machines.find((m) => m.slug === slug);
}
export function seriesByKey(key: string): LongRange | undefined {
  return longRange.find((s) => s.key === key);
}
```

- [ ] **Step 3: Napsat failing test**

`tests/lib/historie.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { machines, longRange, milestones, press, trivia, machineBySlug, seriesByKey } from '../../src/lib/historie';

describe('historie — lib accessory', () => {
  it('machineBySlug najde E-512', () => {
    const m = machineBySlug('kombajn-e-512');
    expect(m).toBeDefined();
    expect(m!.maker).toMatch(/Fortschritt/);
  });
  it('seriesByKey vrátí sérii dojivosti se stoupajícím trendem', () => {
    const s = seriesByKey('dojivost');
    expect(s).toBeDefined();
    expect(s!.points[s!.points.length - 1].value).toBeGreaterThan(s!.points[0].value);
  });
  it('milestones jsou seřazené vzestupně podle roku', () => {
    for (let i = 1; i < milestones.length; i++) {
      expect(milestones[i].year).toBeGreaterThanOrEqual(milestones[i - 1].year);
    }
  });
  it('základní kolekce nejsou prázdné', () => {
    expect(machines.length).toBeGreaterThan(0);
    expect(longRange.length).toBeGreaterThan(0);
    expect(press.length).toBeGreaterThan(0);
    expect(trivia.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 4: Spustit test — musí projít**

Run: `npm run test -- historie`
Expected: PASS (4 testy).

- [ ] **Step 5: Commit**

```bash
git add src/data/agro-historie.json src/lib/historie.ts tests/lib/historie.test.ts
git commit -m "feat(historie): datová vrstva + lib accessory (kostra)"
```

---

### Task 2: Naplnit dataset reálným obsahem (research)

Dohledej z veřejných zdrojů (ČSÚ historické statistické ročenky, Eurostat, MZe; specifikace strojů z veřejné dokumentace/wiki). Rozšiř `src/data/agro-historie.json`. **Akceptační kritéria níže vynucuje test — nejsou volitelná.**

**Files:**
- Modify: `src/data/agro-historie.json`
- Test: `tests/lib/historie.test.ts` (rozšířit o coverage)

- [ ] **Step 1: Rozšířit dataset na cílové pokrytí**

Cílové pokrytí (naplň reálnými čísly, u každé série uveď `source`):
- `milestones`: ≥5 bodů (např. 1949 JZD, 1960 vrchol kolektivizace, 1989 sametová revoluce, 1991–93 transformace/restituce, 2004 vstup do EU).
- `machines`: ≥6 strojů, každý reálné `specs` (≥3 klíče), `story` (≥200 znaků), `category` z {kombajn, traktor, ostatní}. E-512 povinně. Návrhy: E-512, Zetor 25 (1946), Zetor Crystal, kombajn SK-4 (SSSR), samojízdná řezačka E-281, Škoda 180. `yearsTo` může být `null` (dosud vyráběn/používán).
- `longRange`: minimálně série s klíči `dojivost`, `skot`, `prasata`, `osevni-plocha`, `pracovnici` a (pokud data dovolí) `cena-pudy`. Každá ≥6 bodů, roky vzestupně. `cena-pudy` smí mít kratší rozsah (≥2000) — to je OK.
- `press`: ≥6 výstřižků, `headline` + `context` (≥80 znaků), reálné dobové zdroje.
- `trivia`: ≥8 položek.

- [ ] **Step 2: Rozšířit test o coverage kontrolu**

Přidej do `tests/lib/historie.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { machines, longRange, milestones, press, trivia } from '../../src/lib/historie';

describe('historie — pokrytí dat', () => {
  it('má aspoň 5 milníků a 6 strojů', () => {
    expect(milestones.length).toBeGreaterThanOrEqual(5);
    expect(machines.length).toBeGreaterThanOrEqual(6);
  });
  it('E-512 je v katalogu', () => {
    expect(machines.some((m) => m.slug === 'kombajn-e-512')).toBe(true);
  });
  it('každý stroj má ≥3 specs a příběh ≥200 znaků', () => {
    for (const m of machines) {
      expect(Object.keys(m.specs).length).toBeGreaterThanOrEqual(3);
      expect(m.story.length).toBeGreaterThanOrEqual(200);
    }
  });
  it('slugy strojů jsou unikátní', () => {
    const slugs = machines.map((m) => m.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
  it('povinné dlouhodobé série existují a mají ≥6 bodů se vzestupnými roky', () => {
    for (const key of ['dojivost', 'skot', 'prasata', 'osevni-plocha', 'pracovnici']) {
      const s = longRange.find((x) => x.key === key);
      expect(s, `chybí série ${key}`).toBeDefined();
      expect(s!.points.length).toBeGreaterThanOrEqual(6);
      for (let i = 1; i < s!.points.length; i++) {
        expect(s!.points[i].year).toBeGreaterThan(s!.points[i - 1].year);
      }
      expect(s!.source.length).toBeGreaterThan(0);
    }
  });
  it('má ≥6 výstřižků a ≥8 zajímavostí', () => {
    expect(press.length).toBeGreaterThanOrEqual(6);
    expect(trivia.length).toBeGreaterThanOrEqual(8);
  });
});
```

- [ ] **Step 3: Spustit test — musí projít**

Run: `npm run test -- historie`
Expected: PASS. Pokud selže „chybí série X" nebo „<6 bodů", doplň data (ne test).

- [ ] **Step 4: Commit**

```bash
git add src/data/agro-historie.json tests/lib/historie.test.ts
git commit -m "feat(historie): naplnění reálnými daty (stroje, série, tisk, zajímavosti)"
```

---

### Task 3: Komponenta grafu

**Files:**
- Create: `src/components/HistorieLineChart.astro`

Komponenta vykreslí `<canvas>` + `<script type="application/json">` s daty (třída `historie-chart-data`). Inicializaci (jeden Chart.js CDN + smyčka) volá stránka, aby se CDN nenačítal víckrát.

- [ ] **Step 1: Vytvořit komponentu**

`src/components/HistorieLineChart.astro`:
```astro
---
// Jeden spojnicový graf historické série. Data předána jako props; Chart.js
// inicializuje stránka (načte CDN jednou a projede všechny .historie-chart-data).
interface Props {
  id: string;
  label: string;
  unit: string;
  source: string;
  points: { year: number; value: number }[];
}
const { id, label, unit, source, points } = Astro.props;
const chart = {
  labels: points.map((p) => String(p.year)),
  datasets: [{ label: `${label} (${unit})`, data: points.map((p) => p.value) }],
};
---
<figure class="hlc">
  <figcaption class="hlc-cap">{label} <span class="hlc-unit">({unit})</span></figcaption>
  <div class="hlc-wrap"><canvas id={id} height="260"></canvas></div>
  <script type="application/json" class="historie-chart-data" data-target={id} set:html={JSON.stringify(chart)} />
  <p class="hlc-src">Zdroj: {source}</p>
</figure>

<style>
  .hlc { margin: 0 0 28px; }
  .hlc-cap { font-weight: 600; margin-bottom: 8px; }
  .hlc-unit { color: #789; font-weight: 400; }
  .hlc-wrap canvas { max-height: 300px; }
  .hlc-src { font-size: 12px; color: #789; margin-top: 6px; }
</style>
```

- [ ] **Step 2: Ověřit, že se komponenta zkompiluje (proběhne v Tasku 6 při build)**

Zatím žádný samostatný test — komponenta je čistě prezentační, ověří ji build stránky Data.

- [ ] **Step 3: Commit**

```bash
git add src/components/HistorieLineChart.astro
git commit -m "feat(historie): komponenta HistorieLineChart"
```

---

### Task 4: Hub stránka `/historie/`

**Files:**
- Create: `src/pages/historie/index.astro`

- [ ] **Step 1: Vytvořit hub**

`src/pages/historie/index.astro`:
```astro
---
export const prerender = false;
import Layout from '../../layouts/Layout.astro';
import { milestones, machines, trivia } from '../../lib/historie';

const locale = Astro.locals.locale ?? 'cs';
const csOnly = locale !== 'cs';
Astro.response.headers.set('Cache-Control', 'public, max-age=600, s-maxage=86400, stale-while-revalidate=604800');

const sections = [
  { href: '/historie/technika/', emoji: '🚜', title: 'Technika', desc: 'Historické stroje — od Zetoru 25 po kombajn E-512.' },
  { href: '/historie/data/', emoji: '📈', title: 'Data', desc: 'Dojivost, stavy zvířat, osevní plochy, lidé v zemědělství.' },
  { href: '/historie/dobovy-tisk/', emoji: '📰', title: 'Dobový tisk', desc: 'Titulky a reportáže z dobových novin.' },
  { href: '/historie/zajimavosti/', emoji: '💡', title: 'Zajímavosti', desc: 'Rekordy, kuriozity, kdysi vs. dnes.' },
];
---
<Layout
  title="Historie českého zemědělství — stroje, data a dobový kontext"
  description="Jak se měnilo české zemědělství: historické stroje (E-512, Zetor), dojivost, osevní plochy, stavy zvířat, počty lidí a dobový tisk."
  canonical="/historie/"
  noindex={csOnly}
  noHreflang={true}
>
  <main class="hh">
    <header class="hh-hero">
      <p class="hh-eyebrow">HISTORIE ČESKÉHO ZEMĚDĚLSTVÍ</p>
      <h1>Sto let na poli — v datech, strojích a příbězích</h1>
      <p class="hh-lede">Od kolektivizace přes velkovýrobu v JZD až po dnešek. Prohlédni si, jak se měnila technika, výnosy, stavy zvířat i lidé v oboru.</p>
    </header>

    <ol class="hh-timeline">
      {milestones.map((m) => (
        <li><span class="hh-year">{m.year}</span><span class="hh-mtitle">{m.title}</span></li>
      ))}
    </ol>

    <section class="hh-tiles">
      {sections.map((s) => (
        <a class="hh-tile" href={s.href}>
          <span class="hh-emoji">{s.emoji}</span>
          <span class="hh-ttitle">{s.title}</span>
          <span class="hh-tdesc">{s.desc}</span>
        </a>
      ))}
    </section>

    <p class="hh-stat">{machines.length} strojů · {milestones.length} milníků · {trivia.length} zajímavostí</p>
  </main>
</Layout>

<style>
  .hh { max-width: 1000px; margin: 0 auto; padding: 24px 16px 64px; }
  .hh-hero { background: #0f1c14; color: #dfe; border-radius: 16px; padding: 40px 28px; margin-bottom: 28px; }
  .hh-eyebrow { font-size: 12px; letter-spacing: 1px; color: #7a9; margin: 0 0 8px; }
  .hh-hero h1 { font-size: 30px; margin: 0 0 12px; }
  .hh-lede { color: #bcd; max-width: 60ch; }
  .hh-timeline { list-style: none; display: flex; gap: 16px; overflow-x: auto; padding: 0 0 8px; margin: 0 0 28px; }
  .hh-timeline li { flex: 0 0 auto; border-left: 2px solid #1c7c48; padding-left: 10px; }
  .hh-year { display: block; color: #1c7c48; font-weight: 700; }
  .hh-mtitle { font-size: 14px; }
  .hh-tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }
  .hh-tile { display: flex; flex-direction: column; gap: 6px; padding: 20px; border: 1px solid #dde5e0; border-radius: 12px; text-decoration: none; color: inherit; transition: border-color .15s; }
  .hh-tile:hover { border-color: #1c7c48; }
  .hh-emoji { font-size: 28px; }
  .hh-ttitle { font-weight: 700; font-size: 18px; }
  .hh-tdesc { color: #567; font-size: 14px; }
  .hh-stat { text-align: center; color: #789; margin-top: 28px; }
</style>
```

- [ ] **Step 2: Ověřit dev renderem**

Run: `npm run dev` a otevři `http://localhost:4321/historie/` (port dle výpisu).
Expected: hero, časová osa milníků, 4 dlaždice.

- [ ] **Step 3: Commit**

```bash
git add src/pages/historie/index.astro
git commit -m "feat(historie): hub stránka s časovou osou a dlaždicemi"
```

---

### Task 5: Technika — přehled `/historie/technika/`

**Files:**
- Create: `src/pages/historie/technika/index.astro`

- [ ] **Step 1: Vytvořit přehled strojů**

`src/pages/historie/technika/index.astro`:
```astro
---
export const prerender = false;
import Layout from '../../../layouts/Layout.astro';
import { machines } from '../../../lib/historie';

const locale = Astro.locals.locale ?? 'cs';
const csOnly = locale !== 'cs';
Astro.response.headers.set('Cache-Control', 'public, max-age=600, s-maxage=86400, stale-while-revalidate=604800');
const yr = (m: { yearsFrom: number; yearsTo: number | null }) => `${m.yearsFrom}–${m.yearsTo ?? 'dosud'}`;
---
<Layout
  title="Historické zemědělské stroje — E-512, Zetor a další"
  description="Legendární stroje československého zemědělství: kombajny, traktory a technika JZD. Specifikace, roky výroby a příběhy."
  canonical="/historie/technika/"
  noindex={csOnly}
  noHreflang={true}
>
  <main class="ht">
    <h1>Historická technika</h1>
    <p class="ht-lede">Stroje, které vozily úrodu z polí JZD i státních statků.</p>
    <section class="ht-grid">
      {machines.map((m) => (
        <a class="ht-card" href={`/historie/technika/${m.slug}/`}>
          <div class="ht-img">{m.image ? <img src={m.image} alt={m.name} loading="lazy" /> : <span>🚜</span>}</div>
          <div class="ht-body">
            <h2>{m.name}</h2>
            <p class="ht-meta">{m.maker} · {yr(m)}</p>
          </div>
        </a>
      ))}
    </section>
    <p class="ht-cross"><a href="/stroje/">Dnešní katalog strojů →</a></p>
  </main>
</Layout>

<style>
  .ht { max-width: 1000px; margin: 0 auto; padding: 24px 16px 64px; }
  .ht h1 { font-size: 28px; margin: 0 0 6px; }
  .ht-lede { color: #567; margin: 0 0 24px; }
  .ht-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
  .ht-card { border: 1px solid #dde5e0; border-radius: 12px; overflow: hidden; text-decoration: none; color: inherit; transition: border-color .15s; }
  .ht-card:hover { border-color: #1c7c48; }
  .ht-img { height: 140px; background: #0f1c14; display: flex; align-items: center; justify-content: center; font-size: 44px; }
  .ht-img img { width: 100%; height: 100%; object-fit: cover; }
  .ht-body { padding: 14px; }
  .ht-body h2 { font-size: 18px; margin: 0 0 4px; }
  .ht-meta { color: #789; font-size: 13px; margin: 0; }
  .ht-cross { margin-top: 28px; }
  .ht-cross a { color: #1c7c48; font-weight: 600; text-decoration: none; }
</style>
```

- [ ] **Step 2: Ověřit dev renderem**

Run: dev server, otevři `/historie/technika/`.
Expected: mřížka karet, každá vede na detail; odkaz na `/stroje/`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/historie/technika/index.astro
git commit -m "feat(historie): přehled historických strojů"
```

---

### Task 6: Technika — detail `/historie/technika/[slug]/`

**Files:**
- Create: `src/pages/historie/technika/[slug].astro`

Vzor: `prerender=false`, slug z `Astro.params`, neznámý → 302 na přehled (jako `komodita/[slug]`).

- [ ] **Step 1: Vytvořit detail stroje**

`src/pages/historie/technika/[slug].astro`:
```astro
---
export const prerender = false;
import Layout from '../../../layouts/Layout.astro';
import { machineBySlug, machines } from '../../../lib/historie';

const locale = Astro.locals.locale ?? 'cs';
const csOnly = locale !== 'cs';
const slug = Astro.params.slug!;
const m = machineBySlug(slug);
if (!m) return Astro.redirect('/historie/technika/', 302);
Astro.response.headers.set('Cache-Control', 'public, max-age=600, s-maxage=86400, stale-while-revalidate=604800');

const yr = `${m.yearsFrom}–${m.yearsTo ?? 'dosud'}`;
const others = machines.filter((x) => x.slug !== m.slug).slice(0, 4);
---
<Layout
  title={`${m.name} — historický ${m.category}, specifikace a příběh`}
  description={`${m.name} (${m.maker}, ${yr}). ${m.story.slice(0, 120)}`}
  canonical={`/historie/technika/${m.slug}/`}
  ogType="article"
  noindex={csOnly}
  noHreflang={true}
>
  <main class="hd">
    <nav class="hd-crumb"><a href="/historie/technika/">← Historická technika</a></nav>
    <h1>{m.name}</h1>
    <p class="hd-meta">{m.maker} · {yr} · {m.category}</p>
    <div class="hd-img">{m.image ? <img src={m.image} alt={m.name} /> : <span>🚜</span>}</div>
    <p class="hd-story">{m.story}</p>
    <h2>Technické údaje</h2>
    <table class="hd-specs">
      <tbody>
        {Object.entries(m.specs).map(([k, v]) => (<tr><th>{k}</th><td>{v}</td></tr>))}
      </tbody>
    </table>
    <h2>Další stroje</h2>
    <ul class="hd-others">
      {others.map((o) => (<li><a href={`/historie/technika/${o.slug}/`}>{o.name}</a></li>))}
    </ul>
  </main>
</Layout>

<style>
  .hd { max-width: 760px; margin: 0 auto; padding: 24px 16px 64px; }
  .hd-crumb a { color: #1c7c48; text-decoration: none; font-size: 14px; }
  .hd h1 { font-size: 30px; margin: 12px 0 4px; }
  .hd-meta { color: #789; margin: 0 0 20px; }
  .hd-img { height: 260px; background: #0f1c14; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 60px; margin-bottom: 20px; }
  .hd-img img { width: 100%; height: 100%; object-fit: cover; border-radius: 12px; }
  .hd-story { line-height: 1.7; margin-bottom: 28px; }
  .hd-specs { width: 100%; border-collapse: collapse; margin-bottom: 28px; }
  .hd-specs th, .hd-specs td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #e5ebe7; }
  .hd-specs th { color: #567; font-weight: 600; width: 45%; }
  .hd-others { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 12px; }
  .hd-others a { color: #1c7c48; text-decoration: none; }
</style>
```

- [ ] **Step 2: Ověřit dev renderem**

Run: dev server, otevři `/historie/technika/kombajn-e-512/` a náhodný neexistující slug.
Expected: detail se specs tabulkou; neexistující slug → redirect na přehled.

- [ ] **Step 3: Commit**

```bash
git add src/pages/historie/technika/[slug].astro
git commit -m "feat(historie): detail stroje s redirectem na neznámý slug"
```

---

### Task 7: Data `/historie/data/`

**Files:**
- Create: `src/pages/historie/data/index.astro`

Použij `HistorieLineChart` pro každou sérii + jeden inline init přes všechny `.historie-chart-data`.

- [ ] **Step 1: Vytvořit stránku Data**

`src/pages/historie/data/index.astro`:
```astro
---
export const prerender = false;
import Layout from '../../../layouts/Layout.astro';
import HistorieLineChart from '../../../components/HistorieLineChart.astro';
import { longRange } from '../../../lib/historie';

const locale = Astro.locals.locale ?? 'cs';
const csOnly = locale !== 'cs';
Astro.response.headers.set('Cache-Control', 'public, max-age=600, s-maxage=86400, stale-while-revalidate=604800');
---
<Layout
  title="Vývoj českého zemědělství v datech — dojivost, stavy zvířat, plochy"
  description="Dlouhodobé grafy: dojivost krav, stavy skotu a prasat, osevní plochy a počty lidí v zemědělství od 60. let po dnešek."
  canonical="/historie/data/"
  noindex={csOnly}
  noHreflang={true}
>
  <main class="hda">
    <h1>Zemědělství v datech</h1>
    <p class="hda-lede">Jak se měnily klíčové ukazatele českého zemědělství. Ceny komodit sleduj v sekci <a href="/statistiky/">Trhy a komodity</a>.</p>
    {longRange.map((s, i) => (
      <HistorieLineChart id={`hlc-${i}`} label={s.label} unit={s.unit} source={s.source} points={s.points} />
    ))}
  </main>
  <script is:inline src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js"></script>
  <script is:inline>
    (function () {
      if (typeof Chart === 'undefined') return;
      document.querySelectorAll('.historie-chart-data').forEach(function (el) {
        var id = el.getAttribute('data-target');
        var canvas = document.getElementById(id);
        if (!canvas) return;
        var cfg = JSON.parse(el.textContent);
        new Chart(canvas, {
          type: 'line',
          data: {
            labels: cfg.labels,
            datasets: cfg.datasets.map(function (d) {
              return Object.assign({ borderColor: '#1c7c48', backgroundColor: 'rgba(28,124,72,.12)', fill: true, tension: 0.25, pointRadius: 2 }, d);
            }),
          },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true } }, scales: { y: { beginAtZero: false } } },
        });
      });
    })();
  </script>
</Layout>

<style>
  .hda { max-width: 820px; margin: 0 auto; padding: 24px 16px 64px; }
  .hda h1 { font-size: 28px; margin: 0 0 6px; }
  .hda-lede { color: #567; margin: 0 0 28px; }
  .hda-lede a { color: #1c7c48; }
</style>
```

- [ ] **Step 2: Ověřit dev renderem**

Run: dev server, otevři `/historie/data/`.
Expected: jeden graf na sérii, pod grafem zdroj, prolink na `/statistiky/`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/historie/data/index.astro
git commit -m "feat(historie): datová sekce s grafy dlouhodobých sérií"
```

---

### Task 8: Dobový tisk `/historie/dobovy-tisk/`

**Files:**
- Create: `src/pages/historie/dobovy-tisk/index.astro`

- [ ] **Step 1: Vytvořit stránku**

`src/pages/historie/dobovy-tisk/index.astro`:
```astro
---
export const prerender = false;
import Layout from '../../../layouts/Layout.astro';
import { press } from '../../../lib/historie';

const locale = Astro.locals.locale ?? 'cs';
const csOnly = locale !== 'cs';
Astro.response.headers.set('Cache-Control', 'public, max-age=600, s-maxage=86400, stale-while-revalidate=604800');
---
<Layout
  title="Zemědělství v dobovém tisku — titulky z časů JZD"
  description="Přepsané titulky a reportáže o zemědělství z dobových novin — jak o poli, žních a technice psal tehdejší tisk."
  canonical="/historie/dobovy-tisk/"
  noindex={csOnly}
  noHreflang={true}
>
  <main class="hp">
    <h1>Dobový tisk</h1>
    <p class="hp-lede">Jak o zemědělství psaly dobové noviny. Titulky přepsané, s kontextem.</p>
    <section class="hp-grid">
      {press.map((c) => (
        <article class="hp-clip">
          <div class="hp-src">{c.source} · {c.year}</div>
          <h2 class="hp-head">{c.headline}</h2>
          <p class="hp-ctx">{c.context}</p>
        </article>
      ))}
    </section>
  </main>
</Layout>

<style>
  .hp { max-width: 1000px; margin: 0 auto; padding: 24px 16px 64px; }
  .hp h1 { font-size: 28px; margin: 0 0 6px; }
  .hp-lede { color: #567; margin: 0 0 24px; }
  .hp-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
  .hp-clip { background: #efe9d8; border-radius: 8px; padding: 18px; font-family: Georgia, 'Times New Roman', serif; color: #1a150c; }
  .hp-src { font-size: 11px; letter-spacing: .5px; border-bottom: 1px solid #c9bfa0; padding-bottom: 6px; margin-bottom: 8px; color: #5a5038; }
  .hp-head { font-size: 20px; line-height: 1.25; margin: 0 0 8px; }
  .hp-ctx { font-size: 14px; line-height: 1.5; color: #3a3222; margin: 0; }
</style>
```

- [ ] **Step 2: Ověřit dev renderem**

Run: dev server, otevři `/historie/dobovy-tisk/`.
Expected: mřížka „výstřižků" ve stylu starých novin.

- [ ] **Step 3: Commit**

```bash
git add src/pages/historie/dobovy-tisk/index.astro
git commit -m "feat(historie): sekce dobový tisk"
```

---

### Task 9: Zajímavosti `/historie/zajimavosti/`

**Files:**
- Create: `src/pages/historie/zajimavosti/index.astro`

- [ ] **Step 1: Vytvořit stránku**

`src/pages/historie/zajimavosti/index.astro`:
```astro
---
export const prerender = false;
import Layout from '../../../layouts/Layout.astro';
import { trivia } from '../../../lib/historie';

const locale = Astro.locals.locale ?? 'cs';
const csOnly = locale !== 'cs';
Astro.response.headers.set('Cache-Control', 'public, max-age=600, s-maxage=86400, stale-while-revalidate=604800');
---
<Layout
  title="Zajímavosti z historie českého zemědělství"
  description="Rekordy, kuriozity a srovnání kdysi vs. dnes z historie československého a českého zemědělství."
  canonical="/historie/zajimavosti/"
  noindex={csOnly}
  noHreflang={true}
>
  <main class="hz">
    <h1>Zajímavosti</h1>
    <section class="hz-grid">
      {trivia.map((t) => (
        <article class="hz-card">
          <h2>{t.title}</h2>
          <p>{t.body}</p>
          {t.then && t.now && (
            <div class="hz-vs"><span class="hz-then">{t.then}</span><span class="hz-arrow">→</span><span class="hz-now">{t.now}</span></div>
          )}
        </article>
      ))}
    </section>
  </main>
</Layout>

<style>
  .hz { max-width: 1000px; margin: 0 auto; padding: 24px 16px 64px; }
  .hz h1 { font-size: 28px; margin: 0 0 24px; }
  .hz-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
  .hz-card { border: 1px solid #dde5e0; border-radius: 12px; padding: 20px; }
  .hz-card h2 { font-size: 18px; margin: 0 0 8px; }
  .hz-card p { color: #445; margin: 0 0 12px; line-height: 1.5; }
  .hz-vs { display: flex; align-items: center; gap: 10px; font-weight: 600; }
  .hz-then { color: #789; }
  .hz-arrow { color: #1c7c48; }
  .hz-now { color: #1c7c48; }
</style>
```

- [ ] **Step 2: Ověřit dev renderem**

Run: dev server, otevři `/historie/zajimavosti/`.
Expected: karty zajímavostí, kde je then/now → „kdysi → dnes" řádek.

- [ ] **Step 3: Commit**

```bash
git add src/pages/historie/zajimavosti/index.astro
git commit -m "feat(historie): sekce zajímavosti"
```

---

### Task 10: Navigace + i18n klíč

**Files:**
- Modify: `src/i18n/nav.ts`
- Modify: `src/i18n/ui/cs.ts`, `src/i18n/ui/sk.ts`, `src/i18n/ui/uk.ts`, `src/i18n/ui/pl.ts`

- [ ] **Step 1: Přidat nav dítě pod sekci `data`**

V `src/i18n/nav.ts`, do `children` položky se `section: 'data'` (za `nav.data.markets`) přidej:
```ts
      { labelKey: 'nav.data.historie', href: '/historie/' },
```

- [ ] **Step 2: Přidat i18n klíč do všech čtyř ui souborů**

Do `src/i18n/ui/cs.ts` (poblíž `'nav.data.markets'`):
```ts
  'nav.data.historie': 'Historie zemědělství',
```
Do `src/i18n/ui/sk.ts`:
```ts
  'nav.data.historie': 'História poľnohospodárstva',
```
Do `src/i18n/ui/uk.ts`:
```ts
  'nav.data.historie': 'Історія сільського господарства',
```
Do `src/i18n/ui/pl.ts`:
```ts
  'nav.data.historie': 'Historia rolnictwa',
```
(Sekce je cs-only obsah, ale klíč musí existovat ve všech locale, aby `t()` nespadl. Non-cs stránky mají `noindex`.)

- [ ] **Step 3: Ověřit, že build/typecheck nehlásí chybějící klíč**

Run: `npm run test -- historie && npm run build`
Expected: build projde; v menu Data se objeví „Historie zemědělství".

- [ ] **Step 4: Commit**

```bash
git add src/i18n/nav.ts src/i18n/ui/cs.ts src/i18n/ui/sk.ts src/i18n/ui/uk.ts src/i18n/ui/pl.ts
git commit -m "feat(historie): odkaz v navigaci pod sekcí Data"
```

---

### Task 11: Finální build + sitemap ověření

**Files:** žádné nové (ověřovací task)

- [ ] **Step 1: Plný build**

Run: `npm run build`
Expected: PASS bez chyb. Zkontroluj, že se `/historie/` a podstránky vygenerovaly (SSR route, ne 404).

- [ ] **Step 2: Ověřit route smoke testem (dev)**

Run: dev server; projdi `/historie/`, `/historie/technika/`, `/historie/technika/kombajn-e-512/`, `/historie/data/`, `/historie/dobovy-tisk/`, `/historie/zajimavosti/`.
Expected: všechny 200, grafy se vykreslí, prolinky fungují, dlaždice z hubu vedou správně.

- [ ] **Step 3: Spustit celou test suite**

Run: `npm run test`
Expected: PASS (žádná regrese).

- [ ] **Step 4: Commit (pokud vznikly drobné fixy)**

```bash
git add -A && git commit -m "chore(historie): finální build fixy"
```

Deploy (mimo tento plán, dělá uživatel): push master → CF build (~3 min) → `npm run purge` (Node ≥22).

---

## Self-Review (vyplněno autorem plánu)

**Spec coverage:**
- Rozcestník + podstránky → Tasky 4–9. ✔
- Technika + detail strojů (E512) → Tasky 5, 6, data v Tasku 2. ✔
- Data (dojivost, stavy, plochy, lidé, cena půdy) → Task 2 (série) + Task 7 (grafy); cena-pudy volitelná/kratší rozsah dle specu. ✔
- Dobový tisk (přepis, ne skeny) → Task 8. ✔
- Zajímavosti → Task 9. ✔
- Časová osa milníků na hubu → Task 4. ✔
- Precomputed JSON, žádný runtime fetch → Task 1. ✔
- cs-only launch, i18n-ready, non-cs noindex → všechny stránky `noindex={csOnly}` + Task 10 klíče. ✔
- SEO: vlastní title/meta/canonical na každé stránce, machine detail long-tail, prolink na /statistiky a /stroje. ✔
- Ceny komodit neduplikovat → Task 7 prolink místo grafu. ✔

**Placeholder scan:** Task 2 je content-research task s vynucenými akceptačními kritérii (test), ne volný TODO. Ostatní tasky mají kompletní kód. ✔

**Type consistency:** `Machine.yearsTo: number | null` konzistentní (hub/list/detail používají `?? 'dosud'`). `LongRange.points` = `{year,value}` shodně v lib, komponentě i testu. `machineBySlug`/`seriesByKey` názvy shodné napříč tasky. Chart data tvar (`{labels, datasets}`) shodný v komponentě i init skriptu (`data-target` atribut páruje canvas). ✔
