# Značka-vs-značka srovnání — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Přidat brand-vs-brand srovnávací stránky (`/znacky/srovnani/[combo]/`) zachycující head dotazy „Zetor vs Fendt", které funnelují na existující model-srovnání a na bazar.

**Architecture:** Čistá lib `brand-comparator.ts` (jen statická data ze `stroje.ts`, žádná DB) generuje páry, staty a per-pár verdikt/FAQ deterministicky z dat. Astro stránka (prerender top párů + SSR fallback) je renderuje. Reuse existujícího `comparator.ts` pro přímé model-souboje.

**Tech Stack:** Astro SSR, TypeScript, Vitest. Ověřování `npx vitest run` + `npx tsc --noEmit` (NE `npm run build` — padá lokálně na Node 20 glob).

**Odchylka od specu:** „aktivní inzeráty v bazaru" odloženo z v1 (bazar count = runtime DB dotaz, split-brain riziko při prerenderu). CTA na bazar zůstává (statický odkaz).

---

## Task 1: brand-comparator — kanonické combo + parse

**Files:**
- Create: `src/lib/brand-comparator.ts`
- Test: `tests/lib/brand-comparator.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { brandCombo, parseBrandCombo } from '../../src/lib/brand-comparator';

describe('brandCombo / parseBrandCombo', () => {
  it('řadí slugy abecedně a je idempotentní', () => {
    expect(brandCombo('zetor', 'fendt')).toBe('fendt-vs-zetor');
    expect(brandCombo('fendt', 'zetor')).toBe('fendt-vs-zetor');
  });
  it('parseBrandCombo round-trip', () => {
    expect(parseBrandCombo('fendt-vs-zetor')).toEqual(['fendt', 'zetor']);
  });
  it('odmítne nevalidní combo', () => {
    expect(parseBrandCombo('fendt')).toBeNull();
    expect(parseBrandCombo('fendt-vs-fendt')).toBeNull();
    expect(parseBrandCombo('')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/lib/brand-comparator.test.ts`
Expected: FAIL — module/function not found.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/lib/brand-comparator.ts
import { getAllBrands, getAllModels, type StrojBrand, type StrojKategorie, type StrojFlatModel } from './stroje';

const DELIM = '-vs-';

export function brandCombo(a: string, b: string): string {
  const [x, y] = a < b ? [a, b] : [b, a];
  return `${x}${DELIM}${y}`;
}

export function parseBrandCombo(combo: string): [string, string] | null {
  const idx = combo.indexOf(DELIM);
  if (idx === -1) return null;
  const a = combo.slice(0, idx);
  const b = combo.slice(idx + DELIM.length);
  if (!a || !b || a === b) return null;
  return [a, b];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/lib/brand-comparator.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/brand-comparator.ts tests/lib/brand-comparator.test.ts
git commit -m "feat(znacky-srovnani): brandCombo + parseBrandCombo"
```

---

## Task 2: brandStats — statická agregace

**Files:**
- Modify: `src/lib/brand-comparator.ts`
- Test: `tests/lib/brand-comparator.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { brandStats } from '../../src/lib/brand-comparator';
import { getBrand } from '../../src/lib/stroje';

describe('brandStats', () => {
  it('agreguje modely značky', () => {
    const zetor = getBrand('zetor');
    expect(zetor).toBeDefined();
    const s = brandStats(zetor!);
    expect(s.modelCount).toBeGreaterThan(0);
    expect(s.categories.length).toBeGreaterThan(0);
    // unikátní kategorie
    expect(new Set(s.categories).size).toBe(s.categories.length);
    if (s.powerMin !== null && s.powerMax !== null) {
      expect(s.powerMin).toBeLessThanOrEqual(s.powerMax);
      expect(s.powerAvg).toBeGreaterThanOrEqual(s.powerMin);
      expect(s.powerAvg).toBeLessThanOrEqual(s.powerMax);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/lib/brand-comparator.test.ts`
Expected: FAIL — `brandStats` not exported.

- [ ] **Step 3: Write minimal implementation**

```ts
export interface BrandStats {
  brand: StrojBrand;
  modelCount: number;
  powerMin: number | null;
  powerMax: number | null;
  powerAvg: number | null;
  categories: StrojKategorie[];
  yearFrom: number | null;
  yearTo: number | null;
}

export function brandStats(brand: StrojBrand): BrandStats {
  const models = getAllModels().filter((m) => m.brand_slug === brand.slug);
  const powers = models.map((m) => m.power_hp).filter((x): x is number => typeof x === 'number');
  const years = models.map((m) => m.year_from).filter((x): x is number => typeof x === 'number');
  const yearTos = models.map((m) => m.year_to).filter((x): x is number => typeof x === 'number');
  const categories = [...new Set(models.map((m) => m.effective_category))];
  return {
    brand,
    modelCount: models.length,
    powerMin: powers.length ? Math.min(...powers) : null,
    powerMax: powers.length ? Math.max(...powers) : null,
    powerAvg: powers.length ? Math.round(powers.reduce((a, b) => a + b, 0) / powers.length) : null,
    categories,
    yearFrom: years.length ? Math.min(...years) : null,
    yearTo: yearTos.length ? Math.max(...yearTos) : null,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/lib/brand-comparator.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/brand-comparator.ts tests/lib/brand-comparator.test.ts
git commit -m "feat(znacky-srovnani): brandStats agregace"
```

---

## Task 3: brandPairs — výběr párů (dedup, overlap, práh, limit)

**Files:**
- Modify: `src/lib/brand-comparator.ts`
- Test: `tests/lib/brand-comparator.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { brandPairs } from '../../src/lib/brand-comparator';

describe('brandPairs', () => {
  const pairs = brandPairs();
  it('vrací kanonické, deduplikované páry se sdílenou kategorií', () => {
    expect(pairs.length).toBeGreaterThan(0);
    const combos = pairs.map((p) => p.combo);
    expect(new Set(combos).size).toBe(combos.length); // dedup
    for (const p of pairs) {
      expect(p.a.slug < p.b.slug).toBe(true);          // kanonické pořadí
      expect(p.combo).toBe(`${p.a.slug}-vs-${p.b.slug}`);
      expect(p.sharedCategories.length).toBeGreaterThan(0);
    }
  });
  it('respektuje limit', () => {
    expect(brandPairs(5).length).toBeLessThanOrEqual(5);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/lib/brand-comparator.test.ts`
Expected: FAIL — `brandPairs` not exported.

- [ ] **Step 3: Write minimal implementation**

```ts
export interface BrandPair {
  a: StrojBrand;
  b: StrojBrand;
  combo: string;
  sharedCategories: StrojKategorie[];
}

export const MIN_BRAND_MODELS = 4;

export function brandPairs(limit = 300): BrandPair[] {
  const brands = getAllBrands();
  const statsBySlug = new Map(brands.map((br) => [br.slug, brandStats(br)]));
  const eligible = brands.filter((br) => (statsBySlug.get(br.slug)!.modelCount) >= MIN_BRAND_MODELS);
  const sorted = [...eligible].sort((x, y) => x.slug.localeCompare(y.slug));

  const out: BrandPair[] = [];
  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      const a = sorted[i], b = sorted[j];
      const sa = statsBySlug.get(a.slug)!, sb = statsBySlug.get(b.slug)!;
      const shared = sa.categories.filter((c) => sb.categories.includes(c));
      if (shared.length === 0) continue;
      out.push({ a, b, combo: `${a.slug}-vs-${b.slug}`, sharedCategories: shared });
    }
  }
  // Priorita: víc společných modelů = zajímavější srovnání.
  out.sort((p, q) => {
    const score = (pp: BrandPair) => statsBySlug.get(pp.a.slug)!.modelCount + statsBySlug.get(pp.b.slug)!.modelCount;
    return score(q) - score(p);
  });
  return out.slice(0, limit);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/lib/brand-comparator.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/brand-comparator.ts tests/lib/brand-comparator.test.ts
git commit -m "feat(znacky-srovnani): brandPairs výběr + filtr"
```

---

## Task 4: findBrandModelPairs — reuse model-comparatoru

**Files:**
- Modify: `src/lib/brand-comparator.ts`
- Test: `tests/lib/brand-comparator.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { findBrandModelPairs } from '../../src/lib/brand-comparator';
import { getBrand } from '../../src/lib/stroje';

describe('findBrandModelPairs', () => {
  it('vrací jen model-páry mezi dvěma značkami, kanonické, ≤ limit', () => {
    const a = getBrand('zetor')!, b = getBrand('fendt')!;
    const pairs = findBrandModelPairs(a, b, 5);
    expect(pairs.length).toBeLessThanOrEqual(5);
    for (const p of pairs) {
      const brands = new Set([p.a.brand_slug, p.b.brand_slug]);
      expect(brands.has('zetor') && brands.has('fendt')).toBe(true);
      expect(p.a.slug < p.b.slug).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/lib/brand-comparator.test.ts`
Expected: FAIL — `findBrandModelPairs` not exported.

- [ ] **Step 3: Write minimal implementation**

```ts
import { pairCombo, type ComparisonPair } from './comparator';

export function findBrandModelPairs(a: StrojBrand, b: StrojBrand, limit = 6): ComparisonPair[] {
  const models = getAllModels();
  const aModels = models.filter((m) => m.brand_slug === a.slug);
  const bModels = models.filter((m) => m.brand_slug === b.slug);
  const seen = new Set<string>();
  const out: ComparisonPair[] = [];
  for (const am of aModels) {
    for (const bm of bModels) {
      if (am.effective_category !== bm.effective_category) continue;
      if (am.power_hp === null || bm.power_hp === null) continue;
      // jen podobný výkon (±25 %) — smysluplný souboj
      const ratio = am.power_hp / bm.power_hp;
      if (ratio < 0.75 || ratio > 1.333) continue;
      const [x, y] = am.slug < bm.slug ? [am, bm] : [bm, am];
      const combo = pairCombo(x, y);
      if (seen.has(combo)) continue;
      seen.add(combo);
      out.push({ a: x, b: y, combo });
    }
  }
  // Nejbližší výkonem první.
  out.sort((p, q) => Math.abs((p.a.power_hp! - p.b.power_hp!)) - Math.abs((q.a.power_hp! - q.b.power_hp!)));
  return out.slice(0, limit);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/lib/brand-comparator.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/brand-comparator.ts tests/lib/brand-comparator.test.ts
git commit -m "feat(znacky-srovnani): findBrandModelPairs (reuse comparator)"
```

---

## Task 5: brandComparisonInsights — generovaný verdikt + FAQ

**Files:**
- Modify: `src/lib/brand-comparator.ts`
- Test: `tests/lib/brand-comparator.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { brandComparisonInsights, brandStats } from '../../src/lib/brand-comparator';
import { getBrand } from '../../src/lib/stroje';

describe('brandComparisonInsights', () => {
  it('vrací diferencované texty a 4 FAQ', () => {
    const a = getBrand('fendt')!, b = getBrand('zetor')!;
    const ins = brandComparisonInsights(a, brandStats(a), b, brandStats(b));
    expect(ins.tldr.length).toBeGreaterThan(20);
    expect(ins.verdictA).not.toBe(ins.verdictB);
    expect(ins.verdictA.length).toBeGreaterThan(10);
    expect(ins.verdictB.length).toBeGreaterThan(10);
    expect(ins.faqs).toHaveLength(4);
    for (const f of ins.faqs) {
      expect(f.q.length).toBeGreaterThan(5);
      expect(f.a.length).toBeGreaterThan(5);
    }
    expect(ins.shortDescription.length).toBeGreaterThan(30);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/lib/brand-comparator.test.ts`
Expected: FAIL — `brandComparisonInsights` not exported.

- [ ] **Step 3: Write minimal implementation**

```ts
export interface BrandInsights {
  tldr: string;
  verdictA: string;
  verdictB: string;
  faqs: { q: string; a: string }[];
  shortDescription: string;
}

const CZ_COUNTRIES = new Set(['Česko', 'Česká republika', 'Czechia']);

function edges(brand: StrojBrand, s: BrandStats, other: BrandStats): string[] {
  const e: string[] = [];
  if (s.powerAvg !== null && other.powerAvg !== null && s.powerAvg > other.powerAvg)
    e.push('vyšší průměrný výkon — sedí na velké provozy a náročné nasazení');
  if (s.powerAvg !== null && other.powerAvg !== null && s.powerAvg < other.powerAvg)
    e.push('nižší výkonová třída a dostupnost pro malé a střední farmy');
  if (CZ_COUNTRIES.has(brand.country))
    e.push('český původ — snazší servis a dostupnost dílů v ČR');
  if (s.categories.length > other.categories.length)
    e.push('širší záběr kategorií strojů');
  if (brand.founded < (other.brand.founded))
    e.push(`delší tradice (od roku ${brand.founded})`);
  if (e.length === 0) e.push(`${s.modelCount} modelů v naší databázi`);
  return e;
}

function powerRange(s: BrandStats): string {
  if (s.powerMin === null || s.powerMax === null) return 'neuvedeno';
  return s.powerMin === s.powerMax ? `${s.powerMin} k` : `${s.powerMin}–${s.powerMax} k`;
}

export function brandComparisonInsights(a: StrojBrand, sa: BrandStats, b: StrojBrand, sb: BrandStats): BrandInsights {
  const ea = edges(a, sa, sb);
  const eb = edges(b, sb, sa);
  const verdictA = `${a.name} zvolte, když chcete ${ea.slice(0, 2).join(' a ')}.`;
  const verdictB = `${b.name} zvolte, když chcete ${eb.slice(0, 2).join(' a ')}.`;
  const tldr = `${a.name} (${a.country}, ${sa.modelCount} modelů, ${powerRange(sa)}) vs ${b.name} (${b.country}, ${sb.modelCount} modelů, ${powerRange(sb)}). ${ea[0][0].toUpperCase()}${ea[0].slice(1)} u ${a.name}; ${eb[0]} u ${b.name}.`;
  const higherPower =
    sa.powerMax !== null && sb.powerMax !== null
      ? (sa.powerMax > sb.powerMax ? a.name : sb.powerMax > sa.powerMax ? b.name : null)
      : null;
  const faqs = [
    { q: `Je ${a.name}, nebo ${b.name} lepší?`, a: `Záleží na využití. ${verdictA} ${verdictB}` },
    { q: `Odkud pochází ${a.name} a ${b.name}?`, a: `${a.name} pochází z ${a.country} (značka od roku ${a.founded}), ${b.name} z ${b.country} (od roku ${b.founded}).` },
    { q: `Kolik modelů ${a.name} a ${b.name} najdu na agro-svet.cz?`, a: `${a.name}: ${sa.modelCount} modelů (${powerRange(sa)}), ${b.name}: ${sb.modelCount} modelů (${powerRange(sb)}).` },
    { q: `Která značka má vyšší výkon?`, a: higherPower ? `Nejvýkonnější model má ${higherPower}.` : `Obě značky nabízejí srovnatelný výkonový rozsah.` },
  ];
  const shortDescription = `Srovnání značek ${a.name} a ${b.name}: výkon, počet modelů, pokryté kategorie a přímé souboje konkrétních modelů. Nezávislé porovnání na agro-svet.cz.`;
  return { tldr, verdictA, verdictB, faqs, shortDescription };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/lib/brand-comparator.test.ts`
Expected: PASS (all brand-comparator tests green).

- [ ] **Step 5: Commit**

```bash
git add src/lib/brand-comparator.ts tests/lib/brand-comparator.test.ts
git commit -m "feat(znacky-srovnani): brandComparisonInsights generátor"
```

---

## Task 6: Detail stránka `/znacky/srovnani/[combo]/`

**Files:**
- Create: `src/pages/znacky/srovnani/[combo]/index.astro`

- [ ] **Step 1: Napiš stránku** (prerender top párů + SSR fallback + render)

Struktura (vzor převzat z `src/pages/srovnani/[combo]/index.astro` — stejný vizuál: `.cmp-page` třídy, Chakra Petch, žlutá):

```astro
---
export const prerender = false;
import Layout from '../../../../layouts/Layout.astro';
import { getBrand, formatPowerRange, categoryLabel } from '../../../../lib/stroje';
import {
  parseBrandCombo, brandCombo, brandPairs, brandStats,
  findBrandModelPairs, brandComparisonInsights,
} from '../../../../lib/brand-comparator';
import { modelDisplayName } from '../../../../lib/comparator';
import { breadcrumbSchema, faqPageSchema } from '../../../../lib/structured-data';

export async function getStaticPaths() {
  return brandPairs(300).map((p) => ({ params: { combo: p.combo }, props: { pairA: p.a.slug, pairB: p.b.slug } }));
}

const { combo } = Astro.params;
const parsed = parseBrandCombo(combo!);
if (!parsed) return Astro.rewrite('/404');
const a = getBrand(parsed[0]);
const b = getBrand(parsed[1]);
if (!a || !b) return Astro.rewrite('/404');
// Kanonické pořadí (jinak duplicitní obsah).
if (brandCombo(a.slug, b.slug) !== combo) return Astro.rewrite('/404');
const sa = brandStats(a);
const sb = brandStats(b);
// Musí mít sdílenou kategorii + oba dost modelů (jinak slabá stránka → 404).
const shared = sa.categories.filter((c) => sb.categories.includes(c));
if (shared.length === 0 || sa.modelCount < 4 || sb.modelCount < 4) return Astro.rewrite('/404');

Astro.response.headers.set('Cache-Control', 'public, max-age=600, s-maxage=86400, stale-while-revalidate=604800');

const insights = brandComparisonInsights(a, sa, b, sb);
const modelDuels = findBrandModelPairs(a, b, 6);
const canonical = `https://agro-svet.cz/znacky/srovnani/${combo}/`;
const title = `${a.name} vs ${b.name} — srovnání značek zemědělské techniky`;

const rows = [
  { label: 'Počet modelů', a: String(sa.modelCount), b: String(sb.modelCount), aWin: sa.modelCount > sb.modelCount, bWin: sb.modelCount > sa.modelCount },
  { label: 'Rozsah výkonu', a: sa.powerMin!=null?`${sa.powerMin}–${sa.powerMax} k`:'—', b: sb.powerMin!=null?`${sb.powerMin}–${sb.powerMax} k`:'—', aWin: (sa.powerMax??0) > (sb.powerMax??0), bWin: (sb.powerMax??0) > (sa.powerMax??0) },
  { label: 'Kategorie strojů', a: String(sa.categories.length), b: String(sb.categories.length), aWin: sa.categories.length > sb.categories.length, bWin: sb.categories.length > sa.categories.length },
  { label: 'Země / založení', a: `${a.country} · ${a.founded}`, b: `${b.country} · ${b.founded}`, aWin: false, bWin: false },
];

const breadcrumbJsonLd = breadcrumbSchema([
  { name: 'Značky', url: '/znacky/' },
  { name: 'Srovnání značek', url: '/znacky/srovnani/' },
  { name: `${a.name} vs ${b.name}`, url: `/znacky/srovnani/${combo}/` },
]);
const faqJsonLd = faqPageSchema(insights.faqs);
function modelUrl(m){ const short = m.slug.startsWith(m.brand_slug+'-')?m.slug.slice(m.brand_slug.length+1):m.slug; return `/stroje/${m.brand_slug}/${m.series_slug}/${short}/`; }
---
<Layout title={title} description={insights.shortDescription} canonical={canonical}>
  <script type="application/ld+json" is:inline set:html={JSON.stringify(breadcrumbJsonLd)} />
  <script type="application/ld+json" is:inline set:html={JSON.stringify(faqJsonLd)} />
  <div class="cmp-page">
    <nav class="breadcrumb"><a href="/znacky/">Značky</a> › <a href="/znacky/srovnani/">Srovnání značek</a> › <span>{a.name} vs {b.name}</span></nav>
    <header class="hero"><h1>{a.name} <em>vs</em> {b.name}</h1><p class="hero-lede">{insights.tldr}</p></header>

    <section class="duo">
      <article class="duo-card"><div class="duo-body"><span class="duo-brand">{a.country} · {a.founded}</span><h2 class="duo-name"><a href={`/znacky/${a.slug}/`}>{a.name}</a></h2><div class="duo-stats"><span class="ds-hp">{sa.modelCount} modelů</span>{sa.powerMax!=null && <span class="ds-year">{sa.powerMin}–{sa.powerMax} k</span>}</div></div></article>
      <div class="duo-vs">VS</div>
      <article class="duo-card"><div class="duo-body"><span class="duo-brand">{b.country} · {b.founded}</span><h2 class="duo-name"><a href={`/znacky/${b.slug}/`}>{b.name}</a></h2><div class="duo-stats"><span class="ds-hp">{sb.modelCount} modelů</span>{sb.powerMax!=null && <span class="ds-year">{sb.powerMin}–{sb.powerMax} k</span>}</div></div></article>
    </section>

    <section class="spec-table-wrap"><h2>Značka vs značka</h2><div class="spec-table">
      <div class="st-header"><div class="st-th">Parametr</div><div class="st-th st-th-a">{a.name}</div><div class="st-th st-th-b">{b.name}</div></div>
      {rows.map((r)=>(<div class="st-row"><div class="st-label">{r.label}</div><div class:list={['st-cell', r.aWin && 'is-winner']}>{r.a}</div><div class:list={['st-cell', r.bWin && 'is-winner']}>{r.b}</div></div>))}
    </div></section>

    {modelDuels.length > 0 && (<section class="related-cmp"><h2>Přímé souboje modelů</h2><ul class="related-list">
      {modelDuels.map((p)=>(<li><a href={`/srovnani/${p.combo}/`}><span class="rl-pair">{modelDisplayName(p.a)} <em>vs</em> {modelDisplayName(p.b)}</span><span class="rl-cta">Otevřít</span></a></li>))}
    </ul></section>)}

    <section class="decision"><h2>Kdy {a.name}, kdy {b.name}</h2><div class="decision-grid">
      <article class="dc-card dc-a"><h3 class="dc-name">{a.name}</h3><p class="dc-text">{insights.verdictA}</p><a class="dc-link" href={`/znacky/${a.slug}/`}>Modely {a.name}</a></article>
      <article class="dc-card dc-b"><h3 class="dc-name">{b.name}</h3><p class="dc-text">{insights.verdictB}</p><a class="dc-link" href={`/znacky/${b.slug}/`}>Modely {b.name}</a></article>
    </div></section>

    <section class="cmp-faq"><h2>Časté otázky</h2><div class="faq-list">
      {insights.faqs.map((f)=>(<details class="faq-item"><summary>{f.q}</summary><div class="faq-answer">{f.a}</div></details>))}
    </div></section>

    <section class="big-cta"><h2>Prohlédnout {a.name} i {b.name} v bazaru</h2><div class="bc-actions">
      <a class="bc-btn primary" href={`/bazar/?brand=${a.slug}`}>{a.name} v bazaru</a>
      <a class="bc-btn ghost" href={`/bazar/?brand=${b.slug}`}>{b.name} v bazaru</a>
    </div></section>
  </div>
</Layout>
```

Styl: zkopíruj `<style>` blok z `src/pages/srovnani/[combo]/index.astro` (třídy `.cmp-page .breadcrumb .hero .duo .duo-card .duo-vs .spec-table .st-* .related-cmp .related-list .decision .dc-* .cmp-faq .faq-* .big-cta .bc-*`), vlož beze změn.

- [ ] **Step 2: Ověř typy**

Run: `npx tsc --noEmit`
Expected: 0 chyb v novém souboru.

- [ ] **Step 3: Ověř render přes dev**

Run (background): `npm run dev` → `curl -s http://localhost:4321/znacky/srovnani/fendt-vs-zetor/ | grep -c "vs"`
Expected: stránka se vyrenderuje (>0), obsahuje H1 „Fendt vs Zetor", tabulku, přímé souboje. Nekanonické `zetor-vs-fendt` → 404/rewrite.

- [ ] **Step 4: Commit**

```bash
git add src/pages/znacky/srovnani/'[combo]'/index.astro
git commit -m "feat(znacky-srovnani): detail stránka [combo]"
```

---

## Task 7: Hub `/znacky/srovnani/`

**Files:**
- Create: `src/pages/znacky/srovnani/index.astro`

- [ ] **Step 1: Napiš hub** — grid top ~40 párů z `brandPairs(40)`.

```astro
---
import Layout from '../../../layouts/Layout.astro';
import { brandPairs } from '../../../lib/brand-comparator';
const pairs = brandPairs(40);
const title = 'Srovnání značek zemědělské techniky';
const description = 'Porovnejte značky traktorů a strojů vedle sebe — výkon, modely, kategorie a přímé souboje konkrétních strojů.';
---
<Layout title={title} description={description} canonical="https://agro-svet.cz/znacky/srovnani/">
  <div class="cmp-page">
    <nav class="breadcrumb"><a href="/znacky/">Značky</a> › <span>Srovnání značek</span></nav>
    <header class="hero"><h1>Srovnání značek</h1><p class="hero-lede">{description}</p></header>
    <section class="related-cmp"><ul class="related-list">
      {pairs.map((p)=>(<li><a href={`/znacky/srovnani/${p.combo}/`}><span class="rl-pair">{p.a.name} <em>vs</em> {p.b.name}</span><span class="rl-cta">Porovnat</span></a></li>))}
    </ul></section>
  </div>
</Layout>
<style>/* zkopíruj .cmp-page .breadcrumb .hero .related-cmp .related-list z detailu */</style>
```

- [ ] **Step 2: Ověř** `npx tsc --noEmit` + curl `/znacky/srovnani/` (>0 odkazů).

- [ ] **Step 3: Commit**

```bash
git add src/pages/znacky/srovnani/index.astro
git commit -m "feat(znacky-srovnani): hub /znacky/srovnani/"
```

---

## Task 8: Napojení — sitemap, interní odkazy, llms.txt

**Files:**
- Modify: `src/pages/sitemap.xml.ts`
- Modify: `src/pages/znacky/[slug].astro`
- Modify: `src/pages/srovnani/index.astro`
- Modify: `src/pages/llms.txt.ts`

- [ ] **Step 1: Sitemap** — přidej cs URL pro `brandPairs(300)` + hub. Najdi v `sitemap.xml.ts` blok, kde se generují cs URL (kolem existujícího `/srovnani/`), a přidej:

```ts
import { brandPairs } from '../lib/brand-comparator';
// ... v cs URL sekci:
'/znacky/srovnani/',
...brandPairs(300).map((p) => `/znacky/srovnani/${p.combo}/`),
```
(Přesný tvar dle toho, jak soubor skládá URL — pole stringů vs objektů. Drž existující pattern.)

- [ ] **Step 2: Odkaz z brand stránky** — v `src/pages/znacky/[slug].astro` přidej sekci „Porovnat s jinou značkou" s top páry dané značky:

```astro
---
import { brandPairs } from '../../lib/brand-comparator';
const brandCompares = brandPairs(300).filter((p)=>p.a.slug===brand.slug||p.b.slug===brand.slug).slice(0,6);
---
{brandCompares.length>0 && (<section><h2>Porovnat {brand.name} s jinou značkou</h2><ul>
  {brandCompares.map((p)=>{ const other = p.a.slug===brand.slug?p.b:p.a; return (<li><a href={`/znacky/srovnani/${p.combo}/`}>{brand.name} vs {other.name}</a></li>); })}
</ul></section>)}
```
(Umísti do existující struktury stránky; `brand` je už v scope.)

- [ ] **Step 3: Odkaz z `/srovnani/index.astro`** — přidej odkaz na `/znacky/srovnani/` („Srovnat celé značky").

- [ ] **Step 4: llms.txt** — v `src/pages/llms.txt.ts` přidej řádek na `/znacky/srovnani/` do sekce srovnání.

- [ ] **Step 5: Ověř + commit**

```bash
npx tsc --noEmit
git add src/pages/sitemap.xml.ts src/pages/znacky/'[slug]'.astro src/pages/srovnani/index.astro src/pages/llms.txt.ts
git commit -m "feat(znacky-srovnani): sitemap + interní odkazy + llms.txt"
```

---

## Task 9: Finální ověření

- [ ] **Step 1: Celý lib test + typecheck**

Run: `npx vitest run tests/lib/brand-comparator.test.ts && npx tsc --noEmit`
Expected: vše zelené, 0 TS chyb.

- [ ] **Step 2: Regrese** — comparator/stroje testy pořád zelené:

Run: `npx vitest run tests/lib/comparator.test.ts tests/lib/stroje.test.ts`
Expected: PASS (žádná regrese).

- [ ] **Step 3: Vizuální smoke** přes `npm run dev` + curl na: `/znacky/srovnani/`, `/znacky/srovnani/fendt-vs-zetor/`, jeden implement pár, a nekanonické combo (→ 404).

- [ ] **Step 4: Report** — shrň hotové, připomeň userovi merge `feat/znacky-srovnani` → master + `git push` (koordinace s pl oknem) + `npm run purge`.

---

## Self-review poznámky
- Spec „aktivní inzeráty" vědomě vynecháno (DB/split-brain) — CTA na bazar zůstává statická. Ostatní sekce specu pokryté (hero, brand karty, tabulka, model duels, verdikt, FAQ, schema, hub, napojení).
- Typy konzistentní: `BrandStats`, `BrandPair`, `BrandInsights` definované v Tasku 2/3/5, používané v 6/7/8.
- cs-only: žádný zásah do `src/i18n/ui/*.ts` → žádný konflikt s pl oknem.
