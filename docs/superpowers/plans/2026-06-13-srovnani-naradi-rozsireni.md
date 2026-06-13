# Srovnání + žebříčky — rozšíření na nářadí (Track #4) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rozšířit srovnávací (`/srovnani/[combo]/`) a žebříčkovou (`/zebricky/`) SEO plochu z traktorů/kombajnů na kategorie **zemědělského nářadí se záběrem** (párování dle `pracovni_zaber_m`), přidat ~8 nových žebříčků a opravit stale `/srovnani/top/` 404 bug v sitemapě.

**Architecture:** Nový **paralelní** verdikt engine (`implement-comparison-insights.ts`) vedle stávajícího hp-centrického (chrání cs byte-paritu hlídanou snapshot testem). Pár-generace, spec řádky, žebříčky a sitemap se rozšíří o nářadí. Klíčové: nářadí je v datech organizováno přes `series.subcategory` → veškeré seskupování/párování/filtrování nářadí běží na **`effective_category`**, NE na top-level `category` (která je u nářadí funkční skupina jako `zpracovani-pudy`). Traktor/kombajn větve mají `effective_category === category`, takže zůstávají beze změny.

**Tech Stack:** Astro 6.4.4 (SSR, `output: 'server'`, `trailingSlash: 'always'`), TypeScript, vitest, `@modyfi/vite-plugin-yaml`, Node 22.

---

## Grounded zjištění z reconu (ověřeno proti datům 2026-06-13)

**Datová struktura nářadí (KRITICKÉ):**
- Nářadí používá top-level `category` = funkční skupina (`zpracovani-pudy`, `hnojeni`, `seti`, `ochrana-rostlin`, `sklizen-picnin`) a `series.subcategory` = reálná kategorie (`podmitace-diskove`, …). `getAllModels()` mapuje `effective_category = series.subcategory ?? category`.
- **Důsledek:** `findCompetitors`/`topComparisonPairs`/`rankForTierList` filtrují na `m.category` — to je správné JEN pro traktory/kombajny (kde `category === effective_category`). Veškerý nový nářaďový kód MUSÍ filtrovat/seskupovat na `m.effective_category`, jinak by se míchaly diskové podmítače s kypřiči (obojí `category==='zpracovani-pudy'`).

**Počty modelů s `pracovni_zaber_m` per effective_category (total / s_záběrem / current / značek_se_záběrem):**

| effective_category | s_záběrem | current | značek |
|---|---|---|---|
| seci-stroje-pneumaticke | 25 | 25 | 5 |
| podmitace-diskove | 25 | 25 | 5 |
| seci-kombinace | 22 | 22 | 5 |
| zaci-stroje | 22 | 20 | 2 |
| podmitace-radlickove | 21 | 21 | 5 |
| seci-stroje-presne | 19 | 19 | 4 |
| kyprice | 16 | 16 | 5 |
| shrnovace | 14 | 14 | 2 |
| rozmetadla-mineralni | 13 | 13 | **1** |
| rotacni-brany | 10 | 10 | 2 |
| obracece | 10 | 10 | 2 |
| postrikovace-tazene | 9 | 9 | 2 |
| postrikovace-samojizdne | 8 | 8 | 2 |

- Práh `MIN_MODELS_WITH_ZABER = 8` → 13 kategorií projde. **`rozmetadla-mineralni` má záběr jen u 1 značky (Amazone)** → `findImplementCompetitors` (vyžaduje different-brand) pro ni vrátí 0 párů; pár-generace to ustojí přirozeně (žádný cross-brand konkurent). Proto se NEpřidává jako žebříček (vypadal by jako katalog jedné značky).
- Brandy s nářaďovým záběrem: `bednar, amazone, horsch, krone, vaderstad, pottinger` (+ `claas` u řezaček).
- `rezacky-samojizdne`: 37 modelů s `power_hp` (18 current), 2 značky (claas, krone) — žebříček scored dle výkonu (NE záběru, jsou samojízdné).

**Stávající kód (signatury, neměnit chování traktor/kombajn):**
- `src/lib/comparator.ts`: `pairCombo`, `parsePairCombo`, `canonicalOrder` (private), `findModelBySlug`, `topComparisonPairs`, `expandedComparisonPairs(5000)`, `relatedComparisonsFor`, `modelDisplayName`, `ComparisonPair {a,b,combo}`, `ComparisonRow {label,better?,unit?,format?,get}`, `buildComparisonRows(category)`.
- `src/lib/competitor-finder.ts`: `findCompetitors(source,opts)` (hp osa), `useCaseDescription(category,hp,locale)`.
- `src/lib/comparison-insights.ts`: `comparisonInsights(a,b,locale)` → `ComparisonInsights {tldr,shortDescription,decisionA,decisionB,faqs,lastUpdatedIso}`; private `farmSizeClause`, `pct`, `brandDescriptorAkuzativ`; interfaces `ComparisonFaq`, `ComparisonInsights`.
- `src/lib/tier-lists.ts`: `TierListDef`, `TIER_LISTS` (9 def), `getTierList`, `rankForTierList(def)` (filtruje `m.category === def.category` → **bude změněno na `effective_category`**), `RankedModel`.
- `src/pages/srovnani/[combo]/index.astro`: `getStaticPaths` z `expandedComparisonPairs(5000)`; SSR fallback validuje `a.category === b.category && a.brand_slug !== b.brand_slug`; volá `buildComparisonRows(a.category)`, `comparisonInsights(a,b,locale)`; `categoryFallback = a.category === 'traktory' ? traktor.webp : kombajn.webp`; title key `cat.sr.c.titleTraktory|Kombajny`, kicker `cat.sr.c.kicTraktory|Kombajny`.
- `src/pages/sitemap.xml.ts`: ř. 346–348 implement-ready smyčka přes `expandedComparisonPairs(5000)`; **ř. 351–353 mrtvé `/srovnani/top/` + `/srovnani/top/{slug}/`** (stránka neexistuje → 404; `/zebricky/` + `/zebricky/{slug}/` jsou už v sitemapě ř. 136 + 191). sk/uk mirror (ř. 404–438) filtruje dle `isSkLaunchedPath`/`isLaunchedPath('uk',...)` — `/srovnani` je launched pro sk i uk → implement páry se zrcadlí automaticky.

**i18n stav:**
- `LAUNCHED_PREFIXES`: `/srovnani` launched cs+sk+uk; **`/zebricky` NENÍ v sk/uk** → žebříčky jsou cs-only (nové nářaďové žebříčky proto bez i18n, konzistentní se stávajícími).
- Implement srovnání (`/srovnani/...`) se zrcadlí do sk+uk → `implementComparisonInsights` MUSÍ mít cs/sk/uk varianty.
- i18n title/kicker keys v `src/i18n/ui/{cs,sk,uk}.ts`. **Pozn.:** `buildComparisonRows` labels jsou hardcoded cs i na sk/uk stránkách (stávající akceptovaná limitace) → nářaďové labels + hodnota `typ_zavesu` budou taky cs. Žádný i18n pro spec řádky.
- Existuje snapshot parity test `tests/lib/comparison-insights.test.ts` pro cs výstup `comparisonInsights` → po vyčlenění helperu MUSÍ zůstat zelený (byte-parita).

**Fallback image:** `public/images/stroje.webp` existuje → fallback pro nářadí.

---

## Hranice rozsahu (YAGNI)
- Nesahat na hp engine (`comparisonInsights`, `topComparisonPairs`, `findCompetitors`, existující `TIER_LISTS` defs) kromě (a) importu vyčleněného helperu, (b) změny `rankForTierList` filtru na `effective_category` (zpětně kompatibilní). Chránit byte-paritu.
- Vyloučit lift/transport osy: teleskopy, nakladače, lisy, samosběrací vozy, návěsy, cisterny/aplikátory kejdy (0 záběr), pluhy (0 záběr), rozmetadla statková (0 záběr). → příští cyklus.
- Cross-linky (spec §8) — odloženo jako follow-up (není v akceptačních kritériích).
- Žádné AI/generované prózy mimo templovaný engine.

## Odchylky od spec (rozhodnuto při plánování, k odsouhlasení)
1. **Spec §3 ("base řádky výkon/motor/převodovka zůstanou, render je už podmíněný"):** Render NENÍ podmíněný — každý řádek se vyrenderuje, prázdná hodnota = „—". U nářadí by power_hp/power_kw/engine/transmission daly 4 řádky „—" (šum). Proto `buildComparisonRows` pro nářadí vrací **vlastní sadu** relevantních řádků (Pracovní záběr, Potřebný příkon traktoru, Typ závěsu, Roky výroby, V prodeji, Hmotnost) místo hp řádků. Zachovává intent spec (relevantní srovnání), ne literu.
2. **`IMPLEMENT_COMPARE_CATEGORIES` (spec §1):** implementováno jako memoizovaná funkce `implementCompareCategories()` (data-driven, lazy) místo eager const — čistší pro lazy YAML data + testovatelné.
3. **Žebříčky:** finální seznam 8 (viz Task 8) — `rozmetadla-mineralni` vypuštěno (single-brand → katalog jedné značky), `postrikovace-tazene` vypuštěno (jen 2 značky, 9 modelů, slabé). Vybrány multi-brand kategorie + 1 power-scored (samojízdné řezačky).
4. Větev `feat/srovnani-naradi` (spec měl překlep `feat/srovnani-narani`).

---

## File Structure

| Soubor | Akce | Odpovědnost |
|---|---|---|
| `src/lib/comparison-insights-shared.ts` | Create | `ComparisonFaq`/`ComparisonInsights` interfaces, `pct`, `brandDescriptorAkuzativ` (+ nářaďové značky) |
| `src/lib/comparison-insights.ts` | Modify | Import sdíleného helperu/typů (jinak beze změny chování → byte-parita) |
| `src/lib/competitor-finder.ts` | Modify | +`findImplementCompetitors` (záběr osa, effective_category) |
| `src/lib/comparator.ts` | Modify | +`MIN_MODELS_WITH_ZABER`, `implementCompareCategories()`, `implementComparisonPairs()`; `buildComparisonRows` nářaďová větev |
| `src/lib/implement-comparison-insights.ts` | Create | Verdikt engine nářadí cs/sk/uk (`implementComparisonInsights`) |
| `src/lib/tier-lists.ts` | Modify | +8 `TierListDef` nářadí; `rankForTierList` filtr → `effective_category` |
| `src/pages/srovnani/[combo]/index.astro` | Modify | getStaticPaths merge; insights/rows dispatch; SSR fallback effective_category; image/title/kicker fallback |
| `src/pages/sitemap.xml.ts` | Modify | smazat `/srovnani/top/` bug; +implement páry |
| `src/i18n/ui/{cs,sk,uk}.ts` | Modify | +`cat.sr.c.titleImplement`, `cat.sr.c.kicImplement` |
| `tests/lib/competitor-finder.test.ts` | Modify | +`findImplementCompetitors` testy |
| `tests/lib/comparator.test.ts` | Create | `implementCompareCategories`/`implementComparisonPairs`/`buildComparisonRows` testy |
| `tests/lib/implement-comparison-insights.test.ts` | Create | verdikt engine testy |
| `tests/lib/tier-lists.test.ts` | Create | nové defs + effective_category fix |

---

## Setup (před Task 1)

Worktree `~/agro-svet-srovnani-naradi` (větev `feat/srovnani-naradi`) je už vytvořen z `master`, `.env` zkopírován. Před jakýmkoli buildem/testem **`nvm use 22`** (root repo má node 20).

```bash
cd ~/agro-svet-srovnani-naradi && nvm use 22 && node -v   # → v22.x
npx vitest run tests/lib/comparison-insights.test.ts        # baseline: zelený
```

---

### Task 1: Vyčlenit sdílený helper (chrání byte-parity)

**Files:**
- Create: `src/lib/comparison-insights-shared.ts`
- Modify: `src/lib/comparison-insights.ts`
- Test: `tests/lib/comparison-insights.test.ts` (existující — musí zůstat zelený)

- [ ] **Step 1: Vytvořit shared modul**

Create `src/lib/comparison-insights-shared.ts`:

```ts
// Sdílené typy a helpery pro oba srovnávací verdikt enginy
// (comparison-insights.ts = hp osa traktor/kombajn; implement-comparison-insights.ts = záběr osa nářadí).
// Vyčleněno, aby implement engine mohl reusovat brandDescriptorAkuzativ + typy,
// aniž by se měnil cs výstup hp enginu (chráněno snapshot testem).

import type { Locale } from './../i18n/config';

export interface ComparisonFaq {
  q: string;
  a: string;
}

export interface ComparisonInsights {
  /** 2–3 sentence verdict-style TL;DR. */
  tldr: string;
  /** ~155 char SERP meta description. */
  shortDescription: string;
  /** "Vyber A když…". */
  decisionA: string;
  /** "Vyber B když…". */
  decisionB: string;
  /** 5 FAQ entries pro FAQPage schema. */
  faqs: ComparisonFaq[];
  /** ISO date pro "aktualizováno" badge + dateModified. */
  lastUpdatedIso: string;
}

/** Procentní rozdíl a vs b zaokrouhlený na celé %. */
export function pct(a: number, b: number): number {
  if (b === 0) return 0;
  return Math.round(((a - b) / b) * 100);
}

/**
 * Popis značky v akuzativu — pasuje gramaticky za "preferuješ".
 * Příklad: "preferuješ německou prémiovou značku Fendt".
 * Obsahuje traktorové i nářaďové značky; neznámá → fallback "značku {brandName}".
 */
export function brandDescriptorAkuzativ(brand: string, brandName: string, locale: Locale): string {
  const mapCs: Record<string, string> = {
    fendt: 'německou prémiovou značku Fendt',
    'john-deere': 'amerického giganta John Deere',
    'case-ih': 'americkou značku Case IH (koncern CNH)',
    'new-holland': 'evropskou značku New Holland (koncern CNH)',
    claas: 'německého lídra v kombajnech Claas',
    'massey-ferguson': 'tradiční značku Massey Ferguson (koncern AGCO)',
    valtra: 'finskou značku Valtra (koncern AGCO)',
    'deutz-fahr': 'německou značku Deutz-Fahr (koncern SDF)',
    kubota: 'japonskou značku Kubota',
    zetor: 'českou značku Zetor z Brna',
    // nářaďové značky
    bednar: 'českou značku Bednar',
    amazone: 'německou značku Amazone',
    horsch: 'německou značku Horsch',
    krone: 'německou značku Krone',
    vaderstad: 'švédskou značku Väderstad',
    pottinger: 'rakouskou značku Pöttinger',
    kverneland: 'norskou značku Kverneland',
    lemken: 'německou značku Lemken',
    kuhn: 'francouzskou značku Kuhn',
  };
  const mapSk: Record<string, string> = {
    fendt: 'nemeckú prémiovú značku Fendt',
    'john-deere': 'amerického giganta John Deere',
    'case-ih': 'americkú značku Case IH (koncern CNH)',
    'new-holland': 'európsku značku New Holland (koncern CNH)',
    claas: 'nemeckého lídra v kombajnoch Claas',
    'massey-ferguson': 'tradičnú značku Massey Ferguson (koncern AGCO)',
    valtra: 'fínsku značku Valtra (koncern AGCO)',
    'deutz-fahr': 'nemeckú značku Deutz-Fahr (koncern SDF)',
    kubota: 'japonskú značku Kubota',
    zetor: 'českú značku Zetor z Brna',
    bednar: 'českú značku Bednar',
    amazone: 'nemeckú značku Amazone',
    horsch: 'nemeckú značku Horsch',
    krone: 'nemeckú značku Krone',
    vaderstad: 'švédsku značku Väderstad',
    pottinger: 'rakúsku značku Pöttinger',
    kverneland: 'nórsku značku Kverneland',
    lemken: 'nemeckú značku Lemken',
    kuhn: 'francúzsku značku Kuhn',
  };
  const mapUk: Record<string, string> = {
    fendt: 'німецький преміальний бренд Fendt',
    'john-deere': 'американського гіганта John Deere',
    'case-ih': 'американський бренд Case IH (концерн CNH)',
    'new-holland': 'європейський бренд New Holland (концерн CNH)',
    claas: 'німецького лідера у комбайнах Claas',
    'massey-ferguson': 'традиційний бренд Massey Ferguson (концерн AGCO)',
    valtra: 'фінський бренд Valtra (концерн AGCO)',
    'deutz-fahr': 'німецький бренд Deutz-Fahr (концерн SDF)',
    kubota: 'японський бренд Kubota',
    zetor: 'чеський бренд Zetor із Брно',
    bednar: 'чеський бренд Bednar',
    amazone: 'німецький бренд Amazone',
    horsch: 'німецький бренд Horsch',
    krone: 'німецький бренд Krone',
    vaderstad: 'шведський бренд Väderstad',
    pottinger: 'австрійський бренд Pöttinger',
    kverneland: 'норвезький бренд Kverneland',
    lemken: 'німецький бренд Lemken',
    kuhn: 'французький бренд Kuhn',
  };
  const map = locale === 'sk' ? mapSk : locale === 'uk' ? mapUk : mapCs;
  return map[brand] ?? (locale === 'uk' ? `бренд ${brandName}` : `značku ${brandName}`);
}
```

- [ ] **Step 2: V `comparison-insights.ts` nahradit lokální definice importem**

V `src/lib/comparison-insights.ts`:

1. Po existujících importech (po ř. 17 `import { useCaseDescription }...`) přidat:
```ts
import { pct, brandDescriptorAkuzativ } from './comparison-insights-shared';
export type { ComparisonFaq, ComparisonInsights } from './comparison-insights-shared';
```

2. Smazat lokální `export interface ComparisonFaq {...}` (ř. 71–74) a `export interface ComparisonInsights {...}` (ř. 76–89).

3. Smazat lokální `function pct(...)` (ř. 91–94).

4. Smazat lokální `function brandDescriptorAkuzativ(...)` (ř. 96–139).

(Funkce `farmSizeClause` ZŮSTÁVÁ v souboru — je traktor/kombajn specifická, nereusuje se.)

- [ ] **Step 3: Spustit byte-parity test (musí zůstat zelený)**

Run: `nvm use 22 && npx vitest run tests/lib/comparison-insights.test.ts`
Expected: PASS (cs snapshot beze změny — refaktor nemění chování).

- [ ] **Step 4: Commit**

```bash
git add src/lib/comparison-insights-shared.ts src/lib/comparison-insights.ts
git commit -m "refactor(srovnani): vyčlenit sdílený helper comparison-insights-shared (byte-parita zachována)"
```

---

### Task 2: `findImplementCompetitors` (záběr osa)

**Files:**
- Modify: `src/lib/competitor-finder.ts`
- Test: `tests/lib/competitor-finder.test.ts`

- [ ] **Step 1: Napsat failing testy**

V `tests/lib/competitor-finder.test.ts` přidat na konec (před případný uzavírací `});` souboru — pokud je soubor flat, přidat nový `describe`). Nejdřív zkontrolovat existující `mk`/helper v souboru; pokud chybí, použít tento lokální:

```ts
import { findImplementCompetitors } from '../../src/lib/competitor-finder';

describe('findImplementCompetitors', () => {
  it('vrací same-effective-category different-brand modely v ±toleranci záběru', () => {
    // catros (amazone, podmitace-diskove) má reálné konkurenty u bednar/horsch/vaderstad/pottinger
    const all = (require('../../src/lib/stroje') as typeof import('../../src/lib/stroje')).getAllModels();
    const source = all.find((m) => m.effective_category === 'podmitace-diskove' && m.pracovni_zaber_m != null && m.year_to === null);
    expect(source).toBeTruthy();
    const res = findImplementCompetitors(
      { slug: source!.slug, brand_slug: source!.brand_slug, effective_category: source!.effective_category, pracovni_zaber_m: source!.pracovni_zaber_m, year_to: source!.year_to },
      { tolerancePct: 30, limit: 6 },
    );
    expect(res.length).toBeGreaterThan(0);
    for (const c of res) {
      expect(c.effective_category).toBe('podmitace-diskove');
      expect(c.brand_slug).not.toBe(source!.brand_slug);
      expect(c.pracovni_zaber_m).not.toBeNull();
    }
    // max 1 model na značku
    const brands = res.map((c) => c.brand_slug);
    expect(new Set(brands).size).toBe(brands.length);
  });

  it('vrací prázdné pole pro zdroj bez záběru', () => {
    const res = findImplementCompetitors(
      { slug: 'x', brand_slug: 'amazone', effective_category: 'podmitace-diskove', pracovni_zaber_m: null, year_to: null },
      {},
    );
    expect(res).toEqual([]);
  });
});
```

- [ ] **Step 2: Ověřit, že test selže**

Run: `nvm use 22 && npx vitest run tests/lib/competitor-finder.test.ts`
Expected: FAIL — `findImplementCompetitors is not a function`.

- [ ] **Step 3: Implementovat `findImplementCompetitors`**

V `src/lib/competitor-finder.ts` přidat na konec (před případný EOF, za `useCaseDescription`):

```ts
interface ImplementSourceModel {
  slug: string;
  brand_slug: string;
  /** Reálná kategorie (subcategory) — NE top-level funkční skupina. */
  effective_category: StrojKategorie;
  pracovni_zaber_m: number | null;
  year_to: number | null;
}

/**
 * Cross-brand konkurenti pro nářadí — párováno dle pracovního záběru (m).
 * Mirror findCompetitors, ale osa = pracovni_zaber_m a match na effective_category
 * (nářadí je v datech pod funkční skupinou category, reálná kategorie je effective_category).
 * Preference: current production když zdroj current, pak blízkost záběru, tiebreak značka.
 * Dedup: 1 model na konkurenční značku.
 */
export function findImplementCompetitors(
  source: ImplementSourceModel,
  options: CompetitorOptions = {},
): StrojFlatModel[] {
  if (source.pracovni_zaber_m === null) return [];
  const { tolerancePct = 25, limit = 6 } = options;

  const minZ = source.pracovni_zaber_m * (1 - tolerancePct / 100);
  const maxZ = source.pracovni_zaber_m * (1 + tolerancePct / 100);
  const sourceIsCurrent = source.year_to === null;

  const candidates = getAllModels().filter(
    (m) =>
      m.effective_category === source.effective_category &&
      m.brand_slug !== source.brand_slug &&
      m.pracovni_zaber_m !== null &&
      (m.pracovni_zaber_m as number) >= minZ &&
      (m.pracovni_zaber_m as number) <= maxZ,
  );

  candidates.sort((a, b) => {
    const aCurrent = a.year_to === null;
    const bCurrent = b.year_to === null;
    if (aCurrent !== bCurrent) {
      if (sourceIsCurrent) return aCurrent ? -1 : 1;
      return aCurrent ? 1 : -1;
    }
    const aDiff = Math.abs((a.pracovni_zaber_m ?? 0) - (source.pracovni_zaber_m ?? 0));
    const bDiff = Math.abs((b.pracovni_zaber_m ?? 0) - (source.pracovni_zaber_m ?? 0));
    if (aDiff !== bDiff) return aDiff - bDiff;
    return a.brand_slug.localeCompare(b.brand_slug);
  });

  const byBrand = new Map<string, StrojFlatModel>();
  for (const c of candidates) {
    if (!byBrand.has(c.brand_slug)) byBrand.set(c.brand_slug, c);
    if (byBrand.size >= limit) break;
  }
  return [...byBrand.values()];
}
```

(`CompetitorOptions` a `getAllModels`/`StrojFlatModel`/`StrojKategorie` jsou už importované v souboru.)

- [ ] **Step 4: Ověřit, že testy projdou**

Run: `nvm use 22 && npx vitest run tests/lib/competitor-finder.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/competitor-finder.ts tests/lib/competitor-finder.test.ts
git commit -m "feat(srovnani): findImplementCompetitors — cross-brand párování nářadí dle záběru"
```

---

### Task 3: `implementCompareCategories` + `implementComparisonPairs`

**Files:**
- Modify: `src/lib/comparator.ts`
- Test: `tests/lib/comparator.test.ts` (create)

- [ ] **Step 1: Napsat failing testy**

Create `tests/lib/comparator.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import {
  implementCompareCategories,
  implementComparisonPairs,
  MIN_MODELS_WITH_ZABER,
  parsePairCombo,
} from '../../src/lib/comparator';
import { getAllModels } from '../../src/lib/stroje';

describe('implementCompareCategories', () => {
  it('vrací jen kategorie se ≥ MIN_MODELS_WITH_ZABER modely se záběrem (dle effective_category)', () => {
    const cats = implementCompareCategories();
    expect(cats).toContain('podmitace-diskove');
    expect(cats).toContain('seci-stroje-pneumaticke');
    expect(cats).toContain('kyprice');
    // traktory/kombajny nejsou nářadí se záběrem
    expect(cats).not.toContain('traktory');
    expect(cats).not.toContain('kombajny');
    // ověřit práh proti datům
    const counts = new Map<string, number>();
    for (const m of getAllModels()) {
      if (m.pracovni_zaber_m != null) counts.set(m.effective_category, (counts.get(m.effective_category) ?? 0) + 1);
    }
    for (const c of cats) expect(counts.get(c)!).toBeGreaterThanOrEqual(MIN_MODELS_WITH_ZABER);
  });
});

describe('implementComparisonPairs', () => {
  const pairs = implementComparisonPairs(4000);

  it('generuje páry jen pro nářaďové kategorie nad prahem, same effective_category, different brand', () => {
    expect(pairs.length).toBeGreaterThan(0);
    const cats = new Set(implementCompareCategories());
    for (const p of pairs) {
      expect(p.a.effective_category).toBe(p.b.effective_category);
      expect(cats.has(p.a.effective_category)).toBe(true);
      expect(p.a.brand_slug).not.toBe(p.b.brand_slug);
    }
  });

  it('kanonické pořadí (a.slug < b.slug) a žádné duplicity combo', () => {
    const seen = new Set<string>();
    for (const p of pairs) {
      expect(p.a.slug < p.b.slug).toBe(true);
      expect(parsePairCombo(p.combo)).toEqual([p.a.slug, p.b.slug]);
      expect(seen.has(p.combo)).toBe(false);
      seen.add(p.combo);
    }
  });

  it('NEobsahuje traktorové/kombajnové páry (disjunktní vůči hp engine)', () => {
    for (const p of pairs) {
      expect(p.a.effective_category === 'traktory' || p.a.effective_category === 'kombajny').toBe(false);
    }
  });
});
```

- [ ] **Step 2: Ověřit selhání**

Run: `nvm use 22 && npx vitest run tests/lib/comparator.test.ts`
Expected: FAIL — exporty neexistují.

- [ ] **Step 3: Implementovat v `comparator.ts`**

V `src/lib/comparator.ts` upravit import (ř. 9) a přidat nové exporty za `expandedComparisonPairs` (cca ř. 104):

1. Rozšířit import konkurenta:
```ts
import { findCompetitors, findImplementCompetitors } from './competitor-finder';
```

2. Přidat za `expandedComparisonPairs`:
```ts
/** Práh: kolik modelů se záběrem musí kategorie mít, aby se generovaly nářaďové páry. */
export const MIN_MODELS_WITH_ZABER = 8;

let _implementCats: StrojKategorie[] | null = null;
/**
 * Data-driven množina nářaďových kategorií vhodných pro srovnání — effective_category,
 * kde ≥ MIN_MODELS_WITH_ZABER modelů má pracovni_zaber_m. Memoizováno (data statická).
 */
export function implementCompareCategories(): StrojKategorie[] {
  if (_implementCats) return _implementCats;
  const counts = new Map<StrojKategorie, number>();
  for (const m of getAllModels()) {
    if (m.pracovni_zaber_m != null) {
      counts.set(m.effective_category, (counts.get(m.effective_category) ?? 0) + 1);
    }
  }
  _implementCats = [...counts.entries()]
    .filter(([, n]) => n >= MIN_MODELS_WITH_ZABER)
    .map(([c]) => c)
    .sort();
  return _implementCats;
}

/**
 * Páry nářadí párované dle pracovního záběru. Anchor = current-production modely
 * v kvalifikovaných kategoriích; konkurenti přes findImplementCompetitors (může vrátit
 * i historické). Kanonické pořadí, dedup dle combo, řazeno dle součtu záběru desc.
 * Disjunktní vůči topComparisonPairs (ty jsou jen traktory/kombajny).
 */
export function implementComparisonPairs(limit = 4000): ComparisonPair[] {
  const cats = new Set(implementCompareCategories());
  const sources = getAllModels().filter(
    (m) => cats.has(m.effective_category) && m.pracovni_zaber_m != null && m.year_to === null,
  );

  const seen = new Map<string, ComparisonPair>();
  for (const source of sources) {
    const competitors = findImplementCompetitors(
      {
        slug: source.slug,
        brand_slug: source.brand_slug,
        effective_category: source.effective_category,
        pracovni_zaber_m: source.pracovni_zaber_m,
        year_to: source.year_to,
      },
      { tolerancePct: 30, limit: 8 },
    );
    for (const competitor of competitors) {
      const combo = pairCombo(source, competitor);
      if (seen.has(combo)) continue;
      const [a, b] = canonicalOrder(source, competitor);
      seen.set(combo, { a, b, combo });
    }
  }

  const pairs = [...seen.values()];
  pairs.sort((x, y) => {
    const scoreX = (x.a.pracovni_zaber_m ?? 0) + (x.b.pracovni_zaber_m ?? 0);
    const scoreY = (y.a.pracovni_zaber_m ?? 0) + (y.b.pracovni_zaber_m ?? 0);
    if (scoreX !== scoreY) return scoreY - scoreX;
    return x.combo.localeCompare(y.combo);
  });
  return pairs.slice(0, limit);
}
```

- [ ] **Step 4: Ověřit, že testy projdou**

Run: `nvm use 22 && npx vitest run tests/lib/comparator.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/comparator.ts tests/lib/comparator.test.ts
git commit -m "feat(srovnani): implementComparisonPairs + implementCompareCategories (data-driven, effective_category)"
```

---

### Task 4: `buildComparisonRows` — nářaďová větev

**Files:**
- Modify: `src/lib/comparator.ts`
- Test: `tests/lib/comparator.test.ts` (rozšířit)

- [ ] **Step 1: Napsat failing testy**

Do `tests/lib/comparator.test.ts` přidat:

```ts
import { buildComparisonRows } from '../../src/lib/comparator';
import type { StrojFlatModel } from '../../src/lib/stroje';

describe('buildComparisonRows — nářadí', () => {
  const labels = (cat: any) => buildComparisonRows(cat).map((r) => r.label);

  it('traktory mají původní řádky (beze změny)', () => {
    expect(labels('traktory')).toEqual(['Výkon', 'Výkon (kW)', 'Roky výroby', 'V prodeji', 'Motor', 'Převodovka', 'Hmotnost']);
  });

  it('kombajny mají původní řádky + žací stůl/zásobník', () => {
    expect(labels('kombajny')).toContain('Záběr žacího stolu');
    expect(labels('kombajny')).toContain('Zásobník zrna');
  });

  it('nářadí (podmitace-diskove) má záběr/příkon/závěs místo motoru', () => {
    const ls = labels('podmitace-diskove');
    expect(ls).toContain('Pracovní záběr');
    expect(ls).toContain('Potřebný příkon traktoru');
    expect(ls).toContain('Typ závěsu');
    expect(ls).toContain('Hmotnost');
    expect(ls).not.toContain('Motor');
    expect(ls).not.toContain('Výkon');
  });

  it('řádek záběru čte pracovni_zaber_m, příkon formátuje rozsah, závěs lokalizuje', () => {
    const rows = buildComparisonRows('podmitace-diskove' as any);
    const m = { pracovni_zaber_m: 6, prikon_traktor_hp_min: 180, prikon_traktor_hp_max: 240, typ_zavesu: 'tazeny', weight_kg: 4200 } as Partial<StrojFlatModel> as StrojFlatModel;
    const zaber = rows.find((r) => r.label === 'Pracovní záběr')!;
    const prikon = rows.find((r) => r.label === 'Potřebný příkon traktoru')!;
    const zaves = rows.find((r) => r.label === 'Typ závěsu')!;
    expect(zaber.get(m)).toBe(6);
    expect(prikon.get(m)).toBe('180–240 k');
    expect(zaves.get(m)).toBe('tažený');
  });
});
```

- [ ] **Step 2: Ověřit selhání**

Run: `nvm use 22 && npx vitest run tests/lib/comparator.test.ts`
Expected: FAIL — nářaďové řádky chybí, příp. 'Motor' přítomen.

- [ ] **Step 3: Implementovat nářaďovou větev v `buildComparisonRows`**

V `src/lib/comparator.ts` nahradit funkci `buildComparisonRows` (ř. 127–188) tak, že na začátek funkce přidáme nářaďovou větev (před definicí `rows` traktor/kombajn). Vložit hned za `export function buildComparisonRows(category: StrojKategorie): ComparisonRow[] {`:

```ts
  // Nářaďová větev: záběrové kategorie nemají power_hp/motor/převodovku → vlastní sada
  // relevantních řádků (záběr, příkon traktoru, typ závěsu) + univerzální roky/hmotnost.
  if (category !== 'traktory' && category !== 'kombajny') {
    const zavesLabel = (v: string | null | undefined): string | null => {
      switch (v) {
        case 'neseny': return 'nesený';
        case 'tazeny': return 'tažený';
        case 'poloneseny': return 'polonesený';
        case 'samojizdny': return 'samojízdný';
        case 'navesny': return 'návěsný';
        default: return null;
      }
    };
    return [
      {
        label: 'Pracovní záběr',
        better: 'higher',
        unit: 'm',
        get: (m) => m.pracovni_zaber_m ?? null,
      },
      {
        label: 'Potřebný příkon traktoru',
        better: 'none',
        get: (m) => {
          const lo = m.prikon_traktor_hp_min ?? null;
          const hi = m.prikon_traktor_hp_max ?? null;
          if (lo === null && hi === null) return null;
          if (lo !== null && hi !== null) return lo === hi ? `${lo} k` : `${lo}–${hi} k`;
          return `${lo ?? hi} k`;
        },
      },
      {
        label: 'Typ závěsu',
        better: 'none',
        get: (m) => zavesLabel(m.typ_zavesu),
      },
      {
        label: 'Roky výroby',
        better: 'none',
        get: (m) => {
          if (m.year_from === null) return null;
          return m.year_to === null ? `${m.year_from}–dosud` : `${m.year_from}–${m.year_to}`;
        },
      },
      {
        label: 'V prodeji',
        better: 'none',
        get: (m) => (m.year_to === null ? 'Ano' : 'Ne'),
      },
      {
        label: 'Hmotnost',
        better: 'lower',
        unit: 'kg',
        get: (m) => m.weight_kg ?? null,
      },
    ];
  }

```

(Zbytek funkce — traktor/kombajn `rows` + kombajn push — ZŮSTÁVÁ beze změny pod touto větví.)

- [ ] **Step 4: Ověřit, že testy projdou**

Run: `nvm use 22 && npx vitest run tests/lib/comparator.test.ts`
Expected: PASS (vč. traktor/kombajn beze změny).

- [ ] **Step 5: Commit**

```bash
git add src/lib/comparator.ts tests/lib/comparator.test.ts
git commit -m "feat(srovnani): buildComparisonRows nářaďová větev (záběr/příkon/závěs)"
```

---

### Task 5: `implement-comparison-insights.ts` — verdikt engine nářadí

**Files:**
- Create: `src/lib/implement-comparison-insights.ts`
- Test: `tests/lib/implement-comparison-insights.test.ts` (create)

- [ ] **Step 1: Napsat failing testy**

Create `tests/lib/implement-comparison-insights.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { implementComparisonInsights } from '../../src/lib/implement-comparison-insights';
import type { StrojFlatModel } from '../../src/lib/stroje';

function mk(o: Partial<StrojFlatModel> & { name: string; brand_slug: string }): StrojFlatModel {
  return {
    slug: o.slug ?? o.name.toLowerCase().replace(/\s+/g, '-'),
    name: o.name,
    year_from: o.year_from ?? 2018,
    year_to: o.year_to ?? null,
    power_hp: null,
    power_kw: null,
    weight_kg: o.weight_kg ?? null,
    pracovni_zaber_m: o.pracovni_zaber_m ?? null,
    prikon_traktor_hp_min: o.prikon_traktor_hp_min ?? null,
    prikon_traktor_hp_max: o.prikon_traktor_hp_max ?? null,
    typ_zavesu: o.typ_zavesu ?? null,
    brand_slug: o.brand_slug,
    brand_name: o.brand_name ?? o.brand_slug,
    category: o.category ?? 'zpracovani-pudy',
    effective_category: o.effective_category ?? 'podmitace-diskove',
    series_slug: o.series_slug ?? 'series',
    series_name: o.series_name ?? 'Series',
  } as StrojFlatModel;
}

const A = mk({ name: 'Catros 6001', brand_slug: 'amazone', brand_name: 'Amazone', pracovni_zaber_m: 6, prikon_traktor_hp_min: 180, prikon_traktor_hp_max: 240, typ_zavesu: 'tazeny', weight_kg: 4200, year_from: 2020 });
const B = mk({ name: 'Swifterdisc 4000', brand_slug: 'bednar', brand_name: 'Bednar', pracovni_zaber_m: 4, prikon_traktor_hp_min: 120, prikon_traktor_hp_max: 160, typ_zavesu: 'neseny', weight_kg: 2600, year_from: 2017 });

describe('implementComparisonInsights', () => {
  it('cs: TL;DR zmiňuje širší záběr i příkon', () => {
    const r = implementComparisonInsights(A, B, 'cs');
    expect(r.tldr).toContain('širší záběr');
    expect(r.tldr.toLowerCase()).toMatch(/2\s*m|o 2/); // diff 6-4 = 2 m
  });

  it('FAQ obsahuje záběr, příkon i typ závěsu', () => {
    const r = implementComparisonInsights(A, B, 'cs');
    const qs = r.faqs.map((f) => f.q).join(' | ');
    expect(qs).toMatch(/záběr/i);
    expect(qs).toMatch(/traktor|příkon/i);
    expect(qs).toMatch(/nesené|tažen|závěs/i);
    expect(r.faqs.length).toBeGreaterThanOrEqual(3);
    expect(r.faqs.length).toBeLessThanOrEqual(5);
  });

  it('decision boxy zmiňují širší záběr (A) a nižší příkon (B)', () => {
    const r = implementComparisonInsights(A, B, 'cs');
    expect(r.decisionA).toContain('Catros 6001');
    expect(r.decisionB).toContain('Swifterdisc 4000');
    expect(r.decisionA.toLowerCase()).toMatch(/širší záběr|plošný výkon/);
  });

  it('degraduje bez záběru u obou na obecný verdikt', () => {
    const x = mk({ name: 'X', brand_slug: 'amazone', brand_name: 'Amazone', pracovni_zaber_m: null });
    const y = mk({ name: 'Y', brand_slug: 'bednar', brand_name: 'Bednar', pracovni_zaber_m: null });
    const r = implementComparisonInsights(x, y, 'cs');
    expect(r.tldr).toMatch(/srovnatelné třídy|srovnatelné/);
    expect(r.faqs.length).toBeGreaterThanOrEqual(0);
  });

  it('sk a uk varianty se liší od cs a needefaultují na cs', () => {
    const cs = implementComparisonInsights(A, B, 'cs');
    const sk = implementComparisonInsights(A, B, 'sk');
    const uk = implementComparisonInsights(A, B, 'uk');
    expect(sk.tldr).not.toBe(cs.tldr);
    expect(uk.tldr).not.toBe(cs.tldr);
    expect(uk.tldr).toMatch(/[а-яіїєґ]/i); // cyrilice
    expect(sk.faqs[0].q).not.toBe(cs.faqs[0].q);
  });

  it('shortDescription je ≤ 158 znaků', () => {
    expect(implementComparisonInsights(A, B, 'cs').shortDescription.length).toBeLessThanOrEqual(158);
  });
});
```

- [ ] **Step 2: Ověřit selhání**

Run: `nvm use 22 && npx vitest run tests/lib/implement-comparison-insights.test.ts`
Expected: FAIL — modul neexistuje.

- [ ] **Step 3: Implementovat engine**

Create `src/lib/implement-comparison-insights.ts`:

```ts
// Verdikt engine pro srovnání NÁŘADÍ na /srovnani/[combo]/ — paralelní k
// comparison-insights.ts (hp osa traktor/kombajn). Osy: pracovní záběr (m),
// potřebný příkon traktoru (k), typ závěsu, rok uvedení. Vše odvozeno z dat,
// templováno cs (default) / sk / uk. Stejný interface jako hp engine.

import type { StrojFlatModel } from './stroje';
import type { Locale } from './../i18n/config';
import { modelDisplayName } from './comparator';
import {
  brandDescriptorAkuzativ,
  type ComparisonFaq,
  type ComparisonInsights,
} from './comparison-insights-shared';

export type { ComparisonFaq, ComparisonInsights };

/** Klauzule velikosti hospodářství dle záběru — fragment za "když"/"ak" bez velkého písmene/tečky. */
function zaberFarmClause(zaber: number | null, locale: Locale): string | null {
  if (zaber === null) return null;
  const pick = (cs: string, sk: string, uk: string): string =>
    locale === 'sk' ? sk : locale === 'uk' ? uk : cs;
  if (zaber < 3.5) return pick(
    'máš menší pozemky a chceš lehkou, snadno manévrovatelnou soupravu',
    'máš menšie pozemky a chceš ľahkú, ľahko manévrovateľnú súpravu',
    'у тебе невеликі ділянки і ти хочеш легкий, маневрений агрегат');
  if (zaber < 6) return pick(
    'hospodaříš na střední výměře a hledáš rovnováhu mezi záběrem a potřebným výkonem traktoru',
    'hospodáriš na strednej výmere a hľadáš rovnováhu medzi záberom a potrebným výkonom traktora',
    'ти господарюєш на середній площі і шукаєш баланс між шириною захвату та потрібною потужністю трактора');
  if (zaber < 9) return pick(
    'obděláváš větší výměru a chceš vyšší denní plošný výkon',
    'obrábaš väčšiu výmeru a chceš vyšší denný plošný výkon',
    'ти обробляєш більшу площу і хочеш вищу денну продуктивність');
  return pick(
    'jsi velkovýroba a chceš maximum hektarů za den s nejširším záběrem',
    'si veľkovýroba a chceš maximum hektárov za deň s najširším záberom',
    'ти великотоварне виробництво і хочеш максимум гектарів за день із найширшим захватом');
}

/** Lokalizovaný název typu závěsu (nominativ). */
function zavesNoun(typ: string | null | undefined, locale: Locale): string | null {
  if (!typ) return null;
  const t: Record<string, [string, string, string]> = {
    neseny: ['nesený', 'nesený', 'начіпний'],
    tazeny: ['tažený', 'ťahaný', 'причіпний'],
    poloneseny: ['polonesený', 'polonesený', 'напівначіпний'],
    samojizdny: ['samojízdný', 'samohybný', 'самохідний'],
    navesny: ['návěsný', 'návesný', 'причіпний (на přívěsu)'],
  };
  const row = t[typ];
  if (!row) return null;
  return locale === 'sk' ? row[1] : locale === 'uk' ? row[2] : row[0];
}

export function implementComparisonInsights(
  a: StrojFlatModel,
  b: StrojFlatModel,
  locale: Locale = 'cs',
): ComparisonInsights {
  const pick = (cs: string, sk: string, uk: string): string =>
    locale === 'sk' ? sk : locale === 'uk' ? uk : cs;
  const numLocale = locale === 'sk' ? 'sk-SK' : locale === 'uk' ? 'uk-UA' : 'cs-CZ';
  const num = (n: number): string => n.toLocaleString(numLocale);
  const aName = modelDisplayName(a);
  const bName = modelDisplayName(b);

  // ---- Záběr ----
  const aZ = a.pracovni_zaber_m ?? null;
  const bZ = b.pracovni_zaber_m ?? null;
  const zDiff = aZ !== null && bZ !== null ? aZ - bZ : null;
  const wider = zDiff !== null && zDiff !== 0 ? (zDiff > 0 ? a : b) : null;

  // ---- Příkon (min) ----
  const aP = a.prikon_traktor_hp_min ?? null;
  const bP = b.prikon_traktor_hp_min ?? null;
  const pDiff = aP !== null && bP !== null ? aP - bP : null;
  const lessPower = pDiff !== null && pDiff !== 0 ? (pDiff < 0 ? a : b) : null;

  // ---- Rok ----
  const aY = a.year_from;
  const bY = b.year_from;
  const yDiff = aY !== null && bY !== null ? aY - bY : null;
  const newer = yDiff !== null && yDiff !== 0 ? (yDiff > 0 ? a : b) : null;

  const fmtZ = (z: number): string => `${num(z)} m`;

  // ---- TL;DR ----
  const tldrParts: string[] = [];
  if (wider && zDiff !== null) {
    const widerName = modelDisplayName(wider);
    const widerZ = wider === a ? aZ! : bZ!;
    const narrowerZ = wider === a ? bZ! : aZ!;
    tldrParts.push(pick(
      `${widerName} má širší záběr o ${num(Math.abs(zDiff))} m (${fmtZ(widerZ)} vs ${fmtZ(narrowerZ)}) — vyšší plošný výkon, ale potřebuje silnější traktor.`,
      `${widerName} má širší záber o ${num(Math.abs(zDiff))} m (${fmtZ(widerZ)} vs ${fmtZ(narrowerZ)}) — vyšší plošný výkon, ale potrebuje silnejší traktor.`,
      `${widerName} має ширший захват на ${num(Math.abs(zDiff))} м (${fmtZ(widerZ)} проти ${fmtZ(narrowerZ)}) — вища продуктивність, але потрібен потужніший трактор.`));
  } else if (aZ !== null && bZ !== null && zDiff === 0) {
    tldrParts.push(pick(
      `${aName} i ${bName} mají stejný pracovní záběr ${fmtZ(aZ)}.`,
      `${aName} aj ${bName} majú rovnaký pracovný záber ${fmtZ(aZ)}.`,
      `${aName} і ${bName} мають однакову ширину захвату ${fmtZ(aZ)}.`));
  }

  if (lessPower && pDiff !== null) {
    const lpName = modelDisplayName(lessPower);
    const lpP = lessPower === a ? aP! : bP!;
    tldrParts.push(pick(
      `${lpName} vystačí s lehčím traktorem (od ${num(lpP)} k).`,
      `${lpName} vystačí s ľahším traktorom (od ${num(lpP)} k).`,
      `${lpName} обходиться легшим трактором (від ${num(lpP)} к.с.).`));
  }

  const aZav = zavesNoun(a.typ_zavesu, locale);
  const bZav = zavesNoun(b.typ_zavesu, locale);
  if (aZav && bZav && a.typ_zavesu !== b.typ_zavesu) {
    tldrParts.push(pick(
      `${aName} je ${aZav}, ${bName} je ${bZav}.`,
      `${aName} je ${aZav}, ${bName} je ${bZav}.`,
      `${aName} — ${aZav}, ${bName} — ${bZav}.`));
  }

  if (tldrParts.length === 0) {
    tldrParts.push(pick(
      `${aName} a ${bName} jsou stroje srovnatelné třídy.`,
      `${aName} a ${bName} sú stroje porovnateľnej triedy.`,
      `${aName} та ${bName} — машини порівнянного класу.`));
  }
  const tldr = tldrParts.join(' ');

  // ---- Meta description (≤158) ----
  let shortDescription: string;
  if (wider && zDiff !== null) {
    const widerName = modelDisplayName(wider);
    shortDescription = pick(
      `Srovnání: ${aName} vs ${bName}. ${widerName} má širší záběr (+${num(Math.abs(zDiff))} m). Příkon traktoru, typ závěsu, hmotnost a FAQ vedle sebe.`,
      `Porovnanie: ${aName} vs ${bName}. ${widerName} má širší záber (+${num(Math.abs(zDiff))} m). Príkon traktora, typ závesu, hmotnosť a FAQ vedľa seba.`,
      `Порівняння: ${aName} vs ${bName}. ${widerName} має ширший захват (+${num(Math.abs(zDiff))} м). Потужність трактора, тип зчіпки, маса та FAQ поряд.`);
  } else {
    shortDescription = pick(
      `Srovnání ${aName} a ${bName}: pracovní záběr, potřebný příkon traktoru, typ závěsu, hmotnost a FAQ.`,
      `Porovnanie ${aName} a ${bName}: pracovný záber, potrebný príkon traktora, typ závesu, hmotnosť a FAQ.`,
      `Порівняння ${aName} та ${bName}: ширина захвату, потрібна потужність трактора, тип зчіпки, маса та FAQ.`);
  }
  if (shortDescription.length > 158) shortDescription = shortDescription.slice(0, 155) + '…';

  // ---- Decision boxy ----
  function buildDecision(self: StrojFlatModel, other: StrojFlatModel): string {
    const parts: string[] = [];
    const selfName = modelDisplayName(self);
    const selfZ = self.pracovni_zaber_m ?? null;
    const isWider = wider === self;
    const isLessPower = lessPower === self;
    const isNewer = newer === self;
    if (isWider && selfZ !== null) {
      parts.push(pick(
        `potřebuješ vyšší plošný výkon — širší záběr ${fmtZ(selfZ)} zvládne víc hektarů za den`,
        `potrebuješ vyšší plošný výkon — širší záber ${fmtZ(selfZ)} zvládne viac hektárov za deň`,
        `тобі потрібна вища продуктивність — ширший захват ${fmtZ(selfZ)} обробить більше гектарів за день`));
    }
    if (isLessPower && self.prikon_traktor_hp_min !== null) {
      parts.push(pick(
        `máš k dispozici slabší traktor (stačí od ${num(self.prikon_traktor_hp_min)} k)`,
        `máš k dispozícii slabší traktor (stačí od ${num(self.prikon_traktor_hp_min)} k)`,
        `у тебе слабший трактор (достатньо від ${num(self.prikon_traktor_hp_min)} к.с.)`));
    }
    const selfZav = zavesNoun(self.typ_zavesu, locale);
    if (selfZav && other.typ_zavesu !== self.typ_zavesu) {
      if (self.typ_zavesu === 'neseny' || self.typ_zavesu === 'poloneseny') {
        parts.push(pick(
          `chceš ${selfZav} stroj (kratší souprava, lepší manévrovatelnost)`,
          `chceš ${selfZav} stroj (kratšia súprava, lepšia manévrovateľnosť)`,
          `ти хочеш ${selfZav} агрегат (коротший склад, краща маневреність)`));
      } else {
        parts.push(pick(
          `preferuješ ${selfZav} stroj (větší záběr bez zatížení zadní nápravy traktoru)`,
          `preferuješ ${selfZav} stroj (väčší záber bez zaťaženia zadnej nápravy traktora)`,
          `ти віддаєш перевагу ${selfZav} агрегату (більший захват без навантаження задньої осі трактора)`));
      }
    }
    if (isNewer && yDiff !== null && Math.abs(yDiff) >= 2) {
      parts.push(pick(
        `chceš novější konstrukci (uvedení ${self.year_from})`,
        `chceš novšiu konštrukciu (uvedenie ${self.year_from})`,
        `хочеш новішу конструкцію (представлення ${self.year_from})`));
    }
    if (parts.length === 0) {
      const sizeClause = zaberFarmClause(self.pracovni_zaber_m ?? null, locale);
      if (sizeClause) parts.push(sizeClause);
      parts.push(pick(
        `preferuješ ${brandDescriptorAkuzativ(self.brand_slug, self.brand_name, locale)}`,
        `preferuješ ${brandDescriptorAkuzativ(self.brand_slug, self.brand_name, locale)}`,
        `орієнтуєшся на ${brandDescriptorAkuzativ(self.brand_slug, self.brand_name, locale)}`));
    }
    return pick(
      `Vyber ${selfName} pokud ${parts.join(', a zároveň ')}.`,
      `Vyber ${selfName}, ak ${parts.join(', a zároveň ')}.`,
      `Обери ${selfName}, якщо ${parts.join(', а водночас ')}.`);
  }
  const decisionA = buildDecision(a, b);
  const decisionB = buildDecision(b, a);

  // ---- FAQs ----
  const faqs: ComparisonFaq[] = [];

  // Q1: záběr
  if (aZ !== null && bZ !== null) {
    if (zDiff === 0) {
      faqs.push({
        q: pick(`Jaký pracovní záběr mají ${aName} a ${bName}?`, `Aký pracovný záber majú ${aName} a ${bName}?`, `Яка ширина захвату в ${aName} та ${bName}?`),
        a: pick(
          `Oba stroje mají shodný pracovní záběr ${fmtZ(aZ)}. Rozhodující rozdíl je tedy v potřebném příkonu traktoru, typu závěsu a hmotnosti.`,
          `Oba stroje majú zhodný pracovný záber ${fmtZ(aZ)}. Rozhodujúci rozdiel je teda v potrebnom príkone traktora, type závesu a hmotnosti.`,
          `Обидві машини мають однакову ширину захвату ${fmtZ(aZ)}. Вирішальна різниця — у потрібній потужності трактора, типі зчіпки та масі.`),
      });
    } else {
      const widerName = modelDisplayName(wider!);
      const widerZ = wider === a ? aZ : bZ;
      const narrowerZ = wider === a ? bZ : aZ;
      const narrowerName = wider === a ? bName : aName;
      faqs.push({
        q: pick(`Co má širší záběr — ${aName}, nebo ${bName}?`, `Čo má širší záber — ${aName}, alebo ${bName}?`, `Що має ширший захват — ${aName} чи ${bName}?`),
        a: pick(
          `Širší záběr má ${widerName} (${fmtZ(widerZ)}) oproti ${fmtZ(narrowerZ)} u ${narrowerName}, rozdíl ${num(Math.abs(zDiff))} m. Širší záběr znamená vyšší plošný výkon, ale i vyšší nároky na výkon traktoru.`,
          `Širší záber má ${widerName} (${fmtZ(widerZ)}) oproti ${fmtZ(narrowerZ)} u ${narrowerName}, rozdiel ${num(Math.abs(zDiff))} m. Širší záber znamená vyšší plošný výkon, ale aj vyššie nároky na výkon traktora.`,
          `Ширший захват у ${widerName} (${fmtZ(widerZ)}) проти ${fmtZ(narrowerZ)} у ${narrowerName}, різниця ${num(Math.abs(zDiff))} м. Ширший захват означає вищу продуктивність, але й вищі вимоги до потужності трактора.`),
      });
    }
  }

  // Q2: příkon traktoru
  if (aP !== null || bP !== null) {
    const fmtPrikon = (m: StrojFlatModel): string => {
      const lo = m.prikon_traktor_hp_min ?? null;
      const hi = m.prikon_traktor_hp_max ?? null;
      if (lo === null && hi === null) return pick('neuvedeno', 'neuvedené', 'не вказано');
      if (lo !== null && hi !== null) return lo === hi ? `${num(lo)} k` : `${num(lo)}–${num(hi)} k`;
      return `${num((lo ?? hi)!)} k`;
    };
    faqs.push({
      q: pick(`Jaký traktor je potřeba pro ${aName} a ${bName}?`, `Aký traktor je potrebný pre ${aName} a ${bName}?`, `Який трактор потрібен для ${aName} та ${bName}?`),
      a: pick(
        `${aName} vyžaduje traktor ${fmtPrikon(a)}, ${bName} ${fmtPrikon(b)}. Zvol stroj podle výkonu traktoru, který máš v parku.`,
        `${aName} vyžaduje traktor ${fmtPrikon(a)}, ${bName} ${fmtPrikon(b)}. Zvoľ stroj podľa výkonu traktora, ktorý máš v parku.`,
        `${aName} потребує трактор ${fmtPrikon(a)}, ${bName} — ${fmtPrikon(b)}. Обирай машину за потужністю трактора, який є у твоєму парку.`),
    });
  }

  // Q3: typ závěsu
  if (aZav || bZav) {
    faqs.push({
      q: pick(`Jsou ${aName} a ${bName} nesené, nebo tažené?`, `Sú ${aName} a ${bName} nesené, alebo ťahané?`, `${aName} та ${bName} начіпні чи причіпні?`),
      a: pick(
        `${aName}: ${aZav ?? 'neuvedeno'}. ${bName}: ${bZav ?? 'neuvedeno'}. Nesené stroje jsou obratnější a kratší, tažené umožní větší záběr bez zatížení zadní nápravy traktoru.`,
        `${aName}: ${aZav ?? 'neuvedené'}. ${bName}: ${bZav ?? 'neuvedené'}. Nesené stroje sú obratnejšie a kratšie, ťahané umožnia väčší záber bez zaťaženia zadnej nápravy traktora.`,
        `${aName}: ${aZav ?? 'не вказано'}. ${bName}: ${bZav ?? 'не вказано'}. Начіпні машини маневреніші й коротші, причіпні дають більший захват без навантаження задньої осі трактора.`),
    });
  }

  // Q4: vhodnost dle záběru
  const aFarm = zaberFarmClause(aZ, locale);
  const bFarm = zaberFarmClause(bZ, locale);
  if (aFarm || bFarm) {
    const cap = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
    const parts: string[] = [];
    if (aFarm) parts.push(`${aName} — ${cap(aFarm)}.`);
    if (bFarm) parts.push(`${bName} — ${cap(bFarm)}.`);
    faqs.push({
      q: pick(`Pro jak velkou farmu se ${aName} a ${bName} hodí?`, `Pre akú veľkú farmu sa ${aName} a ${bName} hodia?`, `Для якої ферми підходять ${aName} та ${bName}?`),
      a: parts.join(' '),
    });
  }

  // Q5: rok / novost
  if (aY !== null && bY !== null) {
    if (yDiff === 0) {
      faqs.push({
        q: pick(`Kdy byly ${aName} a ${bName} uvedeny?`, `Kedy boli ${aName} a ${bName} uvedené?`, `Коли вийшли ${aName} та ${bName}?`),
        a: pick(
          `Oba stroje byly uvedeny v roce ${aY}, jde o současníky stejné generace.`,
          `Oba stroje boli uvedené v roku ${aY}, ide o súčasníkov rovnakej generácie.`,
          `Обидві машини вийшли у ${aY} році — це сучасники одного покоління.`),
      });
    } else {
      const newerName = modelDisplayName(newer!);
      const newerYear = newer === a ? aY : bY;
      const olderYear = newer === a ? bY : aY;
      faqs.push({
        q: pick(`Který stroj je novější?`, `Ktorý stroj je novší?`, `Яка машина новіша?`),
        a: pick(
          `Novější je ${newerName}, uvedený v roce ${newerYear} (oproti ${olderYear}). Novější konstrukce typicky znamená lepší kompatibilitu s ISOBUS a aktuálnější řešení uložení/seřízení.`,
          `Novší je ${newerName}, uvedený v roku ${newerYear} (oproti ${olderYear}). Novšia konštrukcia typicky znamená lepšiu kompatibilitu s ISOBUS a aktuálnejšie riešenie uloženia/nastavenia.`,
          `Новіша — ${newerName}, представлена у ${newerYear} році (проти ${olderYear}). Новіша конструкція зазвичай означає кращу сумісність з ISOBUS та сучасніші рішення.`),
      });
    }
  }

  faqs.splice(5);

  const lastUpdatedIso = new Date().toISOString().slice(0, 10);

  return { tldr, shortDescription, decisionA, decisionB, faqs, lastUpdatedIso };
}
```

- [ ] **Step 4: Ověřit, že testy projdou**

Run: `nvm use 22 && npx vitest run tests/lib/implement-comparison-insights.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/implement-comparison-insights.ts tests/lib/implement-comparison-insights.test.ts
git commit -m "feat(srovnani): implement-comparison-insights verdikt engine nářadí (cs/sk/uk)"
```

---

### Task 6: i18n keys (titleImplement, kicImplement)

**Files:**
- Modify: `src/i18n/ui/cs.ts`, `src/i18n/ui/sk.ts`, `src/i18n/ui/uk.ts`
- Test: ověřit `tests/i18n/ui.test.ts` (key parity)

- [ ] **Step 1: Přidat klíče do cs**

V `src/i18n/ui/cs.ts` za řádek `'cat.sr.c.titleKombajny': ...,` (ř. 332) přidat:
```ts
  'cat.sr.c.titleImplement': '{a} vs {b} — srovnání zemědělské techniky',
```
A za `'cat.sr.c.kicKombajny': 'Kombajny',` (ř. 338) přidat:
```ts
  'cat.sr.c.kicImplement': 'Technika',
```

- [ ] **Step 2: Přidat klíče do sk**

V `src/i18n/ui/sk.ts` za `'cat.sr.c.titleKombajny': ...,` přidat:
```ts
  'cat.sr.c.titleImplement': '{a} vs {b} — porovnanie poľnohospodárskej techniky',
```
A za `'cat.sr.c.kicKombajny': 'Kombajny',`:
```ts
  'cat.sr.c.kicImplement': 'Technika',
```

- [ ] **Step 3: Přidat klíče do uk**

V `src/i18n/ui/uk.ts` za `'cat.sr.c.titleKombajny': ...,` přidat:
```ts
  'cat.sr.c.titleImplement': '{a} vs {b} — порівняння сільгосптехніки',
```
A za `'cat.sr.c.kicKombajny': 'Комбайни',`:
```ts
  'cat.sr.c.kicImplement': 'Техніка',
```

- [ ] **Step 4: Ověřit key parity test**

Run: `nvm use 22 && npx vitest run tests/i18n/ui.test.ts`
Expected: PASS (všechny tři locale mají stejnou množinu klíčů).

- [ ] **Step 5: Commit**

```bash
git add src/i18n/ui/cs.ts src/i18n/ui/sk.ts src/i18n/ui/uk.ts
git commit -m "feat(srovnani): i18n klíče titleImplement+kicImplement (cs/sk/uk)"
```

---

### Task 7: `[combo]` stránka — dispatch dle kategorie

**Files:**
- Modify: `src/pages/srovnani/[combo]/index.astro`

- [ ] **Step 1: Rozšířit getStaticPaths o nářaďové páry**

V `src/pages/srovnani/[combo]/index.astro`:

1. Rozšířit import z comparatoru (ř. 11–21) o `implementComparisonPairs`:
```ts
import {
  topComparisonPairs,
  expandedComparisonPairs,
  implementComparisonPairs,
  parsePairCombo,
  findModelBySlug,
  pairCombo,
  modelDisplayName,
  buildComparisonRows,
  relatedComparisonsFor,
  type ComparisonPair,
} from '../../../lib/comparator';
```

2. Přidat import implement insights (za ř. 25 `import { comparisonInsights }...`):
```ts
import { implementComparisonInsights } from '../../../lib/implement-comparison-insights';
```

3. V `getStaticPaths` (ř. 38–42) sloučit páry s dedup dle combo:
```ts
  const tractorPairs = expandedComparisonPairs(5000);
  const implementPairs = implementComparisonPairs(4000);
  const byCombo = new Map<string, ComparisonPair>();
  for (const p of [...tractorPairs, ...implementPairs]) {
    if (!byCombo.has(p.combo)) byCombo.set(p.combo, p);
  }
  return [...byCombo.values()].map((p) => ({
    params: { combo: p.combo },
    props: { pair: p },
  }));
```

- [ ] **Step 2: SSR fallback — validovat na effective_category**

V SSR fallbacku (ř. 57) změnit podmínku `a.category === b.category` na `a.effective_category === b.effective_category` (zabrání míchání diskové podmítače × kypřiče pod stejnou funkční skupinou):
```ts
    if (a && b && a.effective_category === b.effective_category && a.brand_slug !== b.brand_slug) {
```

- [ ] **Step 3: Dispatch rows + insights + image + title/kicker**

1. Zavést `isImplement` a předat effective_category do `buildComparisonRows`. Nahradit ř. 73 (`const rows = buildComparisonRows(a.category);`):
```ts
const isImplement = a.effective_category !== 'traktory' && a.effective_category !== 'kombajny';
const rows = buildComparisonRows(a.effective_category);
```

2. Nahradit `categoryFallback` (ř. 78):
```ts
const categoryFallback = isImplement
  ? '/images/stroje.webp'
  : a.effective_category === 'traktory'
    ? '/images/traktor.webp'
    : '/images/kombajn.webp';
```

3. Nahradit `insights` (ř. 88):
```ts
const insights = isImplement
  ? implementComparisonInsights(a, b, locale)
  : comparisonInsights(a, b, locale);
```

4. Nahradit `title` blok (ř. 91–95):
```ts
const title = tf(
  locale,
  isImplement ? 'cat.sr.c.titleImplement' : a.effective_category === 'traktory' ? 'cat.sr.c.titleTraktory' : 'cat.sr.c.titleKombajny',
  { a: aDisplay, b: bDisplay },
);
```

5. V `<header class="hero">` kickeru (ř. 146) zobecnit:
```ts
      <span class="kicker">{tr('cat.sr.c.kicker')}{isImplement ? tr('cat.sr.c.kicImplement') : a.effective_category === 'traktory' ? tr('cat.sr.c.kicTraktory') : tr('cat.sr.c.kicKombajny')}</span>
```

**Pozn.:** `aUseCase`/`bUseCase` (ř. 82–83 přes `useCaseDescription`) vrací pro nářadí `null` → `{aUseCase && ...}` (ř. 170, 187) se prostě nevyrenderuje. Ponecháno beze změny (TL;DR nese verdikt). `duo-stats` `a.power_hp` (ř. 165) je u nářadí null → blok se nevyrenderuje, OK.

- [ ] **Step 4: Smoke build + render kontrola**

Run:
```bash
nvm use 22 && npm run build 2>&1 | tail -20
```
Expected: build zelený, žádná TS chyba.

Pokud build projde, ověřit pár nářaďových slugů existuje v prerendered výstupu:
```bash
node -e "import('./src/lib/comparator.ts')" 2>/dev/null || true
```
(Pozn.: spolehlivá smoke kontrola běží v Task 10 přes dev server.)

- [ ] **Step 5: Commit**

```bash
git add "src/pages/srovnani/[combo]/index.astro"
git commit -m "feat(srovnani): [combo] dispatch nářadí (getStaticPaths+insights+rows+image+title)"
```

---

### Task 8: Žebříčky nářadí + `rankForTierList` effective_category fix

**Files:**
- Modify: `src/lib/tier-lists.ts`
- Test: `tests/lib/tier-lists.test.ts` (create)

- [ ] **Step 1: Napsat failing testy**

Create `tests/lib/tier-lists.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { TIER_LISTS, getTierList, rankForTierList } from '../../src/lib/tier-lists';

const NEW_SLUGS = [
  'nejsirsi-diskove-podmitace',
  'nejsirsi-radlickove-podmitace',
  'nejlepsi-seci-kombinace',
  'nejsirsi-pneumaticke-seci-stroje',
  'nejlepsi-presne-seci-stroje',
  'nejlepsi-kyprice',
  'nejsirsi-zaci-stroje',
  'nejvykonnejsi-samojizdne-rezacky',
];

describe('tier-lists nářadí', () => {
  it('má 8 nových nářaďových žebříčků', () => {
    for (const s of NEW_SLUGS) expect(getTierList(s), s).toBeTruthy();
  });

  it('každý nový žebříček vrací ≥1 model, score sestupně', () => {
    for (const s of NEW_SLUGS) {
      const def = getTierList(s)!;
      const ranked = rankForTierList(def);
      expect(ranked.length, s).toBeGreaterThan(0);
      for (let i = 1; i < ranked.length; i++) {
        expect(def.score(ranked[i - 1].model)).toBeGreaterThanOrEqual(def.score(ranked[i].model));
      }
    }
  });

  it('záběrové žebříčky obsahují jen modely té effective_category se záběrem', () => {
    const def = getTierList('nejsirsi-diskove-podmitace')!;
    const ranked = rankForTierList(def);
    for (const r of ranked) {
      expect(r.model.effective_category).toBe('podmitace-diskove');
      expect(r.model.pracovni_zaber_m).not.toBeNull();
    }
  });

  it('stávající traktorové/kombajnové žebříčky stále fungují (effective_category fix je zpětně kompatibilní)', () => {
    const t = getTierList('traktory-nad-250-koni')!;
    const k = getTierList('kombajny-nejvykonnejsi')!;
    expect(rankForTierList(t).length).toBeGreaterThan(0);
    expect(rankForTierList(k).length).toBeGreaterThan(0);
    for (const r of rankForTierList(t)) expect(r.model.effective_category).toBe('traktory');
  });
});
```

- [ ] **Step 2: Ověřit selhání**

Run: `nvm use 22 && npx vitest run tests/lib/tier-lists.test.ts`
Expected: FAIL — nové slugy neexistují.

- [ ] **Step 3: Opravit `rankForTierList` filtr na effective_category**

V `src/lib/tier-lists.ts` v `rankForTierList` (ř. 147) změnit:
```ts
  const filtered = all.filter((m) => m.effective_category === def.category && def.filter(m));
```
(Pro traktory/kombajny je `effective_category === category`, takže existující defs beze změny chování.)

- [ ] **Step 4: Přidat 8 nářaďových `TierListDef` do `TIER_LISTS`**

V `src/lib/tier-lists.ts` přidat do pole `TIER_LISTS` před uzavírací `];` (po `traktory-male-kompaktni` entry, ř. 132) novou sekci:

```ts

  // ── NÁŘADÍ (záběr / výkon) ──────────────────────────────────────────
  {
    slug: 'nejsirsi-diskove-podmitace',
    title: 'Nejširší diskové podmítače',
    description: 'Žebříček diskových podmítačů podle pracovního záběru. Širší záběr = vyšší plošný výkon, ale vyšší nárok na výkon traktoru. Vhodné pro mělké zpracování strniště.',
    methodology: 'Modely seřazené podle pracovního záběru sestupně. Z každé série jen nejširší varianta. Napříč značkami Amazone, Bednar, Horsch, Väderstad, Pöttinger.',
    callToAction: 'Hledáte hlubší zpracování? Viz žebříček radličkových podmítačů a kypřičů.',
    category: 'podmitace-diskove',
    filter: (m) => typeof m.pracovni_zaber_m === 'number' && m.pracovni_zaber_m > 0,
    score: (m) => m.pracovni_zaber_m ?? 0,
    limit: 12,
  },
  {
    slug: 'nejsirsi-radlickove-podmitace',
    title: 'Nejširší radličkové podmítače',
    description: 'Žebříček radličkových (dlátových) podmítačů podle pracovního záběru. Radličky pracují hlouběji než disky — vhodné pro prokypření a narušení utužených vrstev.',
    methodology: 'Modely seřazené podle pracovního záběru sestupně, de-dup per série. Napříč značkami Amazone, Bednar, Horsch, Väderstad, Pöttinger.',
    callToAction: 'Pro mělké zpracování strniště viz žebříček diskových podmítačů.',
    category: 'podmitace-radlickove',
    filter: (m) => typeof m.pracovni_zaber_m === 'number' && m.pracovni_zaber_m > 0,
    score: (m) => m.pracovni_zaber_m ?? 0,
    limit: 12,
  },
  {
    slug: 'nejlepsi-seci-kombinace',
    title: 'Nejširší secí kombinace',
    description: 'Žebříček secích kombinací (příprava půdy + setí v jednom přejezdu) podle pracovního záběru. Úspora přejezdů a času při zakládání porostů.',
    methodology: 'Modely seřazené podle pracovního záběru sestupně, de-dup per série. Napříč značkami Amazone, Horsch, Väderstad, Pöttinger, Bednar.',
    callToAction: 'Pro samostatné secí stroje viz žebříček pneumatických a přesných secích strojů.',
    category: 'seci-kombinace',
    filter: (m) => typeof m.pracovni_zaber_m === 'number' && m.pracovni_zaber_m > 0,
    score: (m) => m.pracovni_zaber_m ?? 0,
    limit: 12,
  },
  {
    slug: 'nejsirsi-pneumaticke-seci-stroje',
    title: 'Nejširší pneumatické secí stroje',
    description: 'Žebříček pneumatických (výsevních) secích strojů podle pracovního záběru. Pneumatická distribuce osiva umožňuje větší záběr a přesnější dávkování.',
    methodology: 'Modely seřazené podle pracovního záběru sestupně, de-dup per série. Napříč pěti hlavními značkami na českém trhu.',
    callToAction: 'Pro přesný výsev (kukuřice, řepa, slunečnice) viz žebříček přesných secích strojů.',
    category: 'seci-stroje-pneumaticke',
    filter: (m) => typeof m.pracovni_zaber_m === 'number' && m.pracovni_zaber_m > 0,
    score: (m) => m.pracovni_zaber_m ?? 0,
    limit: 12,
  },
  {
    slug: 'nejlepsi-presne-seci-stroje',
    title: 'Nejširší přesné secí stroje',
    description: 'Žebříček přesných (jednozrnných) secích strojů podle pracovního záběru. Pro kukuřici, řepu a slunečnici — přesné rozmístění jednotlivých zrn.',
    methodology: 'Modely seřazené podle pracovního záběru sestupně, de-dup per série. Záběr u přesných secích strojů obvykle odpovídá počtu řádků × meziřádková vzdálenost.',
    callToAction: 'Pro hustě seté plodiny (obilniny) viz žebříček pneumatických secích strojů.',
    category: 'seci-stroje-presne',
    filter: (m) => typeof m.pracovni_zaber_m === 'number' && m.pracovni_zaber_m > 0,
    score: (m) => m.pracovni_zaber_m ?? 0,
    limit: 12,
  },
  {
    slug: 'nejlepsi-kyprice',
    title: 'Nejširší kypřiče',
    description: 'Žebříček kypřičů podle pracovního záběru. Kypřiče zpracovávají půdu do střední a větší hloubky bez obracení — základ minimalizačních technologií.',
    methodology: 'Modely seřazené podle pracovního záběru sestupně, de-dup per série. Napříč značkami Amazone, Bednar, Horsch, Väderstad, Pöttinger.',
    callToAction: 'Pro mělké strniště viz diskové podmítače, pro setí viz secí kombinace.',
    category: 'kyprice',
    filter: (m) => typeof m.pracovni_zaber_m === 'number' && m.pracovni_zaber_m > 0,
    score: (m) => m.pracovni_zaber_m ?? 0,
    limit: 12,
  },
  {
    slug: 'nejsirsi-zaci-stroje',
    title: 'Nejširší žací stroje',
    description: 'Žebříček žacích strojů (na pícniny) podle pracovního záběru. Větší záběr zkracuje dobu seče a využívá počasí — klíčové při sklizni objemných krmiv.',
    methodology: 'Modely seřazené podle pracovního záběru sestupně, de-dup per série. Hlavně žací kombinace Krone a Pöttinger.',
    callToAction: 'Pro shrnování a obracení píce viz příslušné kategorie strojů na sklizeň pícnin.',
    category: 'zaci-stroje',
    filter: (m) => typeof m.pracovni_zaber_m === 'number' && m.pracovni_zaber_m > 0,
    score: (m) => m.pracovni_zaber_m ?? 0,
    limit: 12,
  },
  {
    slug: 'nejvykonnejsi-samojizdne-rezacky',
    title: 'Nejvýkonnější samojízdné řezačky',
    description: 'Žebříček samojízdných sklízecích řezaček podle výkonu motoru. Pro sklizeň kukuřice na siláž a travních porostů — nejvýkonnější stroje na poli.',
    methodology: 'Modely seřazené podle výkonu motoru sestupně, de-dup per série. Flagshipy Claas Jaguar a Krone BiG X.',
    callToAction: 'Pro lisování a sběr píce viz ostatní stroje na sklizeň pícnin.',
    category: 'rezacky-samojizdne',
    filter: (m) => typeof m.power_hp === 'number' && m.power_hp > 0,
    score: (m) => m.power_hp ?? 0,
    limit: 12,
  },
```

- [ ] **Step 5: Ověřit, že testy projdou**

Run: `nvm use 22 && npx vitest run tests/lib/tier-lists.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/tier-lists.ts tests/lib/tier-lists.test.ts
git commit -m "feat(zebricky): 8 nářaďových žebříčků + rankForTierList effective_category fix"
```

---

### Task 9: Sitemap — fix `/srovnani/top/` bug + implement páry

**Files:**
- Modify: `src/pages/sitemap.xml.ts`

- [ ] **Step 1: Smazat mrtvé `/srovnani/top/` entries a přidat implement páry**

V `src/pages/sitemap.xml.ts`:

1. Rozšířit import comparatoru. Najít existující import z `'../lib/comparator'` (obsahuje `expandedComparisonPairs`) a přidat `implementComparisonPairs`. Pokud je import inline jako `(await import('...'))`, pak v sekci comparison pairs (ř. 342–348) přidat za stávající smyčku:
```ts
  // Implement (nářadí) páry — párované dle záběru, match limit z [combo]/getStaticPaths.
  for (const pair of implementComparisonPairs(4000)) {
    urls.push({ loc: `${SITE_URL}/srovnani/${pair.combo}/`, changefreq: 'monthly', priority: '0.6', lastmod: STATIC_LASTMOD });
  }
```
Pokud `expandedComparisonPairs` je staticky importované nahoře, přidat `implementComparisonPairs` do téhož import statementu.

2. Smazat mrtvé `/srovnani/top/` entries (ř. 350–354):
```ts
  // Tier-list pages (top-10 lists per segment).
  urls.push({ loc: `${SITE_URL}/srovnani/top/`, changefreq: 'weekly', priority: '0.8', lastmod: STATIC_LASTMOD });
  for (const t of (await import('../lib/tier-lists')).TIER_LISTS) {
    urls.push({ loc: `${SITE_URL}/srovnani/top/${t.slug}/`, changefreq: 'weekly', priority: '0.75', lastmod: STATIC_LASTMOD });
  }
```
→ smazat celý tento blok (stránka `/srovnani/top/` neexistuje → 404; `/zebricky/` + `/zebricky/{slug}/` jsou už v sitemapě na ř. 136 a 191, vč. nových nářaďových žebříčků, které se iterují automaticky přes `TIER_LISTS`).

**Pozn.:** implement páry se přidávají do `urls` PŘED sk/uk mirror blokem (ř. 404+), takže `/sk/srovnani/...` a `/uk/srovnani/...` se zrcadlí automaticky (`/srovnani` je launched v obou). Žádná další změna pro i18n sitemap.

- [ ] **Step 2: Ověřit, že se sitemap vygeneruje a obsahuje správné URL**

Run:
```bash
nvm use 22 && npm run build 2>&1 | tail -15
```
Expected: build zelený.

- [ ] **Step 3: Commit**

```bash
git add src/pages/sitemap.xml.ts
git commit -m "fix(sitemap): smazat mrtvé /srovnani/top/ (404) + přidat nářaďové srovnání páry"
```

---

### Task 10: Plná verifikace — vitest + build + smoke

**Files:** žádné (verifikační task)

- [ ] **Step 1: Plný vitest**

Run: `nvm use 22 && npm test 2>&1 | tail -30`
Expected: všechny testy PASS (vč. nových + byte-parity comparison-insights). Zaznamenat počet (baseline byl ~398; ⚠️ ~3 pre-existing fail = bazar nav baseline dle memory — ověřit, že nové faily nepřibyly).

- [ ] **Step 2: Plný build**

Run: `nvm use 22 && npm run build 2>&1 | tail -25`
Expected: `astro build` zelený, žádná TS/render chyba.

- [ ] **Step 3: Smoke — dev server, nářaďové páry + žebříčky + sitemap**

⚠️ `pkill -f "astro dev"` před startem (memory lekce). Worktree má `.env` (zkopírováno) → sitemap nespadne na 500.

```bash
pkill -f "astro dev" 2>/dev/null; sleep 1
nvm use 22 && npm run dev &
sleep 8
# Získat reálné nářaďové combo + žebříček slug pro test:
node --experimental-vm-modules -e "
import('./src/lib/comparator.ts').then(async (m) => {
  const p = m.implementComparisonPairs(5)[0];
  console.log('IMPLEMENT_COMBO=' + (p ? p.combo : 'NONE'));
});
" 2>/dev/null || echo "combo lookup přes URL níže"
```
Pak ověřit HTTP statusy (nahradit `<combo>` reálným nářaďovým combo z buildu, např. catros-vs-swifterdisc varianta):
```bash
BASE=http://localhost:4321
# nářaďový pár (cs) — vzít první combo ze sitemapy, které není traktor/kombajn
curl -s "$BASE/sitemap.xml" | grep -o '/srovnani/[^<]*-vs-[^<]*/' | head -40
# vybrat nářaďové combo, pak:
curl -s -o /dev/null -w "cs pár: %{http_code}\n" "$BASE/srovnani/<implement-combo>/"
curl -s -o /dev/null -w "sk pár: %{http_code}\n" "$BASE/sk/srovnani/<implement-combo>/"
curl -s -o /dev/null -w "žebříček: %{http_code}\n" "$BASE/zebricky/nejsirsi-diskove-podmitace/"
# sitemap: NEobsahuje /srovnani/top/, obsahuje /zebricky/nejsirsi-diskove-podmitace/
curl -s "$BASE/sitemap.xml" | grep -c '/srovnani/top/' || echo "top entries: 0 (správně)"
curl -s "$BASE/sitemap.xml" | grep -c '/zebricky/nejsirsi-diskove-podmitace/'
pkill -f "astro dev"
```
Expected:
- cs pár: 200, sk pár: 200
- žebříček: 200
- `/srovnani/top/` count: 0
- `/zebricky/nejsirsi-diskove-podmitace/` count: ≥1 (cs; +sk/uk se nezrcadlí, žebříčky jsou cs-only)
- Ověřit vizuálně (curl tělo) že nářaďová stránka má TL;DR se „záběr", spec tabulku s „Pracovní záběr"/„Typ závěsu" a FAQ.

- [ ] **Step 4: Ověřit obsah nářaďové stránky (verdikt + tabulka)**

```bash
nvm use 22 && npm run dev & sleep 8
curl -s "http://localhost:4321/srovnani/<implement-combo>/" | grep -oE "Pracovní záběr|Potřebný příkon traktoru|Typ závěsu|širší záběr" | sort -u
pkill -f "astro dev"
```
Expected: výskyt „Pracovní záběr", „Typ závěsu", a v TL;DR „širší záběr".

- [ ] **Step 5: Commit (pokud byly drobné fixy ze smoke)**

```bash
git add -A && git commit -m "test(srovnani): verifikace — build+smoke nářaďových párů/žebříčků/sitemap" || echo "nic ke commitu"
```

---

## Self-Review (proti spec)

**Spec coverage:**
- §1 Generace párů nářadí (findImplementCompetitors + implementComparisonPairs) → Task 2, 3 ✓
- §2 Verdikt engine nářadí (paralelní modul) → Task 5 ✓
- §3 Spec řádky nářadí (buildComparisonRows) → Task 4 ✓ (s dokumentovanou odchylkou: vlastní sada místo base+null řádků)
- §4 [combo] dispatch → Task 7 ✓
- §5 Sdílený helper (brandDescriptorAkuzativ) → Task 1 ✓
- §6 Žebříčky nářadí (~6–8) → Task 8 ✓ (8 defs + effective_category fix)
- §7 Sitemap (fix bug + implement páry) → Task 9 ✓
- §8 Cross-linky → vědomě odloženo (YAGNI, mimo akceptační kritéria)
- Testování → Task 1–8 inline TDD + Task 10 full verifikace ✓

**Akceptační kritéria:** 1 (Task 3+7) ✓, 2 byte-parita (Task 1) ✓, 3 (Task 4) ✓, 4 žebříčky (Task 8) ✓, 5 sitemap (Task 9) ✓, 6 vitest+build (Task 10) ✓.

**Type consistency:** `effective_category` použito konzistentně napříč findImplementCompetitors (Task 2), implementComparisonPairs/implementCompareCategories (Task 3), buildComparisonRows dispatch (Task 7), rankForTierList (Task 8), SSR fallback (Task 7). `ComparisonInsights`/`ComparisonFaq` z shared (Task 1) reusovány v Task 5. `MIN_MODELS_WITH_ZABER`, `implementCompareCategories`, `implementComparisonPairs` názvy konzistentní mezi Task 3 a testy/sitemap/page.

## Proces
- Větev `feat/srovnani-naradi` z `master` (worktree `~/agro-svet-srovnani-naradi`, `.env` zkopírován). Atomické commity per task. Po dokončení → finishing-a-development-branch (merge/PR), git push token-in-URL. **`nvm use 22` před každým build/test.**
