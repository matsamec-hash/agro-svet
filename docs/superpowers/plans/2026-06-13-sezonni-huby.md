# Sezónní obsahové huby (Track #5) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Postavit CS-only sezónní obsahový cluster `/sezona/` (rozcestník + 4 sezóny + kalendář setí/sklizně), který agreguje existující howto/pruvodce + plodiny crop-calendar do evergreen rozcestníků.

**Architecture:** Vše prerender (žádné SSR). Nová čistá agregační vrstva `src/lib/sezona.ts` čte plodiny (přes `listPlodiny()`) + statickou kurátorskou mapu howto→sezóna. 6 prerendered Astro stránek. „Aktuálnost" (zvýraznění aktuální sezóny/měsíce) řeší drobný inline klientský skript přes server-rendered `data-month`/`data-season` atributy. Pod `/sk/`+`/uk/` se stránky díky PR #79 čistě 302-ují na cs (nejsou v `LAUNCHED_PREFIXES`).

**Tech Stack:** Astro 6 (`output: 'server'`, `@astrojs/node` standalone), TypeScript, vitest. Node 22 (`nvm use 22`). YAML přes `@modyfi/vite-plugin-yaml` (`import.meta.glob`). JSON-LD helpery v `src/lib/structured-data.ts`.

**Prostředí:** Worktree `~/agro-svet-sezonni-huby`, větev `feat/sezonni-huby` (z `origin/master` `e0f6250`). Před každým buildem/testem `nvm use 22`. `.env` zkopírovaný (sitemap potřebuje Supabase). Před smoke `pkill -f 'dist/server/entry'`.

**⚠️ Baseline:** `npx vitest run` má **3 pre-existing fail** v `tests/i18n/nav.test.ts` (bazar dočasně schován). To NENÍ regrese — cíl je 3 fail + všechny ostatní pass.

---

## File Structure

**Nové soubory:**
- `src/lib/sezona.ts` — agregační logika: definice sezón, `seasonOfMonth`, crop filtry, kurátorská mapa howto→sezóna, sezónní leady. Žádný `astro:content`/async import (čistá, testovatelná).
- `tests/lib/sezona.test.ts` — unit testy `sezona.ts`.
- `src/pages/sezona/index.astro` — rozcestník (4 karty + kalendář).
- `src/pages/sezona/[season].astro` — dynamická, `getStaticPaths` přes 4 sezóny.
- `src/pages/sezona/kalendar/index.astro` — kalendář setí/sklizně.

**Editované soubory:**
- `src/lib/plodiny.ts` — interface `PlodinaYaml` +2 optional pole.
- `src/data/plodiny/*.yaml` (18×) — +`seti_mesice` +`sklizen_mesice`.
- `src/pages/sitemap.xml.ts` — +6 statických URL (CS-only).
- `src/i18n/nav.ts` — nová položka pod sekcí `tema`.
- `src/i18n/ui/cs.ts`, `sk.ts`, `uk.ts` — klíč `nav.tema.sezona` (ui parity).
- `src/pages/plodiny/index.astro` — cross-link na kalendář.

---

## Task 1: Sezónní metadata do plodiny YAML + interface

**Files:**
- Modify: `src/lib/plodiny.ts` (interface `PlodinaYaml`, ~ř. 54)
- Modify: `src/data/plodiny/*.yaml` (18 souborů)

Účel: dát crop-calendaru strojově filtrovatelná měsíční data. Hodnoty **groundované** z existující prózy každého YAML (pole `sklizen` + krok „Setí" v `osevni_postup`) + slugu (`*-jarni`/`*-ozima`). Měsíce = čísla 1–12.

- [ ] **Step 1: Rozšířit interface `PlodinaYaml`**

V `src/lib/plodiny.ts` přidat do `interface PlodinaYaml` (za pole `sklizen?: string;`) tato dvě pole:

```ts
  /** Měsíce setí (1–12), odvozené z osevni_postup "Setí". Pro crop-calendar. */
  seti_mesice?: number[];
  /** Měsíce sklizně (1–12), odvozené z pole `sklizen`. Pro crop-calendar. */
  sklizen_mesice?: number[];
```

- [ ] **Step 2: Doplnit obě pole do všech 18 YAML**

Pro každý soubor přidej oba klíče (na úroveň top-level, vedle `sklizen:`). **Před zápisem ověř hodnoty proti próze daného souboru** (`sklizen:` a krok „Setí" v `osevni_postup`); níže je referenční tabulka odvozená z prózy a agronomie ČR:

| soubor | seti_mesice | sklizen_mesice |
|---|---|---|
| brambory.yaml | `[4]` | `[8, 9, 10]` |
| cukrovka.yaml | `[3, 4]` | `[9, 10, 11]` |
| hrach.yaml | `[3, 4]` | `[7]` |
| jecmen-jarni.yaml | `[2, 3]` | `[7, 8]` |
| jecmen-ozimy.yaml | `[9, 10]` | `[6, 7]` |
| jetel.yaml | `[3, 4]` | `[6, 7, 8, 9]` |
| kukurice.yaml | `[4, 5]` | `[9, 10]` |
| mak.yaml | `[3, 4]` | `[8]` |
| oves.yaml | `[3, 4]` | `[7, 8]` |
| psenice-jarni.yaml | `[3, 4]` | `[8]` |
| psenice-ozima.yaml | `[9, 10]` | `[7, 8]` |
| repka-jarni.yaml | `[3, 4]` | `[8]` |
| repka-ozima.yaml | `[8, 9]` | `[7]` |
| slunecnice.yaml | `[4]` | `[9, 10]` |
| soja.yaml | `[4, 5]` | `[9, 10]` |
| tritikale.yaml | `[9, 10]` | `[7, 8]` |
| vojteska.yaml | `[4]` | `[6, 7, 8, 9]` |
| zito.yaml | `[9, 10]` | `[7, 8]` |

Příklad (jecmen-jarni.yaml — vedle `sklizen: červenec až začátek srpna`):
```yaml
seti_mesice: [2, 3]
sklizen_mesice: [7, 8]
```

- [ ] **Step 3: Ověřit, že se YAML načte bez chyby**

Run: `nvm use 22 && npx astro check 2>&1 | tail -20` (nebo `npx tsc --noEmit` pokud astro check není dostupný — stačí ověřit, že typy sedí).
Expected: žádná nová TS chyba k `PlodinaYaml`/`seti_mesice`/`sklizen_mesice`. (Existující warningy ignoruj.)

- [ ] **Step 4: Commit**

```bash
git add src/lib/plodiny.ts src/data/plodiny/*.yaml
git commit -m "feat(sezona): seti_mesice/sklizen_mesice do 18 plodiny YAML + PlodinaYaml"
```

---

## Task 2: `sezona.ts` — definice sezón + `seasonOfMonth` (čisté jádro, TDD)

**Files:**
- Create: `src/lib/sezona.ts`
- Test: `tests/lib/sezona.test.ts`

- [ ] **Step 1: Napsat failing test**

Vytvoř `tests/lib/sezona.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { SEASONS, seasonOfMonth, getSeason } from '../../src/lib/sezona';

describe('sezona — definice a seasonOfMonth', () => {
  it('má 4 sezóny se správnými slugy a měsíci', () => {
    expect(SEASONS.map((s) => s.slug)).toEqual(['jaro', 'leto', 'podzim', 'zima']);
    expect(getSeason('jaro')!.months).toEqual([3, 4, 5]);
    expect(getSeason('leto')!.months).toEqual([6, 7, 8]);
    expect(getSeason('podzim')!.months).toEqual([9, 10, 11]);
    expect(getSeason('zima')!.months).toEqual([12, 1, 2]);
  });

  it('seasonOfMonth správně mapuje hranice', () => {
    expect(seasonOfMonth(2)).toBe('zima');
    expect(seasonOfMonth(3)).toBe('jaro');
    expect(seasonOfMonth(5)).toBe('jaro');
    expect(seasonOfMonth(6)).toBe('leto');
    expect(seasonOfMonth(8)).toBe('leto');
    expect(seasonOfMonth(9)).toBe('podzim');
    expect(seasonOfMonth(11)).toBe('podzim');
    expect(seasonOfMonth(12)).toBe('zima');
    expect(seasonOfMonth(1)).toBe('zima');
  });

  it('getSeason vrací undefined pro neznámý slug', () => {
    expect(getSeason('foo')).toBeUndefined();
  });
});
```

- [ ] **Step 2: Spustit test → fail**

Run: `nvm use 22 && npx vitest run tests/lib/sezona.test.ts`
Expected: FAIL (`Cannot find module '../../src/lib/sezona'`).

- [ ] **Step 3: Vytvořit `src/lib/sezona.ts` (jádro)**

```ts
// Sezónní agregační vrstva. Čistá, bez astro:content/async — testovatelná.
// Data: plodiny (listPlodiny) + statická kurátorská mapa howto→sezóna.

export type SeasonSlug = 'jaro' | 'leto' | 'podzim' | 'zima';

export interface Season {
  slug: SeasonSlug;
  name: string;
  /** Měsíce sezóny (1–12). */
  months: number[];
}

export const SEASONS: Season[] = [
  { slug: 'jaro', name: 'Jaro', months: [3, 4, 5] },
  { slug: 'leto', name: 'Léto', months: [6, 7, 8] },
  { slug: 'podzim', name: 'Podzim', months: [9, 10, 11] },
  { slug: 'zima', name: 'Zima', months: [12, 1, 2] },
];

export const MONTH_NAMES_CS = [
  'leden', 'únor', 'březen', 'duben', 'květen', 'červen',
  'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec',
];

export function getSeason(slug: string): Season | undefined {
  return SEASONS.find((s) => s.slug === slug);
}

export function seasonOfMonth(month: number): SeasonSlug {
  return SEASONS.find((s) => s.months.includes(month))!.slug;
}
```

- [ ] **Step 4: Spustit test → pass**

Run: `nvm use 22 && npx vitest run tests/lib/sezona.test.ts`
Expected: PASS (3 testy).

- [ ] **Step 5: Commit**

```bash
git add src/lib/sezona.ts tests/lib/sezona.test.ts
git commit -m "feat(sezona): sezona.ts jádro (SEASONS, seasonOfMonth) + testy"
```

---

## Task 3: `sezona.ts` — crop filtry (TDD, proti reálným plodiny datům)

**Files:**
- Modify: `src/lib/sezona.ts`
- Test: `tests/lib/sezona.test.ts`

- [ ] **Step 1: Přidat failing testy**

Doplň do `tests/lib/sezona.test.ts`:

```ts
import { cropsSownInMonth, cropsHarvestedInMonth, cropsSownInSeason, cropsHarvestedInSeason } from '../../src/lib/sezona';

describe('sezona — crop filtry (reálná plodiny data)', () => {
  it('cropsSownInMonth(3) obsahuje jecmen-jarni', () => {
    expect(cropsSownInMonth(3).map((p) => p.slug)).toContain('jecmen-jarni');
  });

  it('cropsSownInMonth(9) obsahuje psenice-ozima, ne jecmen-jarni', () => {
    const slugs = cropsSownInMonth(9).map((p) => p.slug);
    expect(slugs).toContain('psenice-ozima');
    expect(slugs).not.toContain('jecmen-jarni');
  });

  it('cropsHarvestedInMonth(8) obsahuje brambory', () => {
    expect(cropsHarvestedInMonth(8).map((p) => p.slug)).toContain('brambory');
  });

  it('cropsSownInSeason(jaro) obsahuje jarní obiloviny', () => {
    const slugs = cropsSownInSeason('jaro').map((p) => p.slug);
    expect(slugs).toContain('jecmen-jarni');
    expect(slugs).toContain('psenice-jarni');
  });

  it('cropsHarvestedInSeason(podzim) obsahuje kukurice', () => {
    expect(cropsHarvestedInSeason('podzim').map((p) => p.slug)).toContain('kukurice');
  });

  it('filtry vrací plodiny seřazené dle name (cs)', () => {
    const arr = cropsSownInSeason('jaro');
    const names = arr.map((p) => p.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'cs')));
  });
});
```

- [ ] **Step 2: Spustit → fail**

Run: `nvm use 22 && npx vitest run tests/lib/sezona.test.ts`
Expected: FAIL (funkce neexistují).

- [ ] **Step 3: Implementovat crop filtry**

Doplň do `src/lib/sezona.ts` (nahoře přidej import):

```ts
import { listPlodiny, type Plodina } from './plodiny';
```

a na konec:

```ts
function sortCs(arr: Plodina[]): Plodina[] {
  return [...arr].sort((a, b) => a.name.localeCompare(b.name, 'cs'));
}

export function cropsSownInMonth(month: number): Plodina[] {
  return sortCs(listPlodiny().filter((p) => p.seti_mesice?.includes(month)));
}

export function cropsHarvestedInMonth(month: number): Plodina[] {
  return sortCs(listPlodiny().filter((p) => p.sklizen_mesice?.includes(month)));
}

export function cropsSownInSeason(slug: SeasonSlug): Plodina[] {
  const months = getSeason(slug)!.months;
  return sortCs(listPlodiny().filter((p) => p.seti_mesice?.some((m) => months.includes(m))));
}

export function cropsHarvestedInSeason(slug: SeasonSlug): Plodina[] {
  const months = getSeason(slug)!.months;
  return sortCs(listPlodiny().filter((p) => p.sklizen_mesice?.some((m) => months.includes(m))));
}
```

- [ ] **Step 4: Spustit → pass**

Run: `nvm use 22 && npx vitest run tests/lib/sezona.test.ts`
Expected: PASS (všechny testy z Task 2 + 3).

- [ ] **Step 5: Commit**

```bash
git add src/lib/sezona.ts tests/lib/sezona.test.ts
git commit -m "feat(sezona): crop filtry (cropsSownIn*/cropsHarvestedIn*) + testy"
```

---

## Task 4: `sezona.ts` — kurátorská mapa howto→sezóna + sezónní leady/FAQ

**Files:**
- Modify: `src/lib/sezona.ts`
- Test: `tests/lib/sezona.test.ts`

Účel: editorial linky na polní práce + krátký answer-first lead + FAQ pro každou sezónu. Linky jsou hardcoded `{href,label}` (howto + pruvodce; pruvodce nejsou kolekce → bez async lookupu).

- [ ] **Step 1: Přidat failing test**

Doplň do `tests/lib/sezona.test.ts`:

```ts
import { SEASON_CONTENT, seasonWorkLinks, seasonLead, seasonFaq } from '../../src/lib/sezona';

describe('sezona — editorial obsah', () => {
  it('každá sezóna má lead, ≥1 work link a ≥2 FAQ', () => {
    for (const s of SEASONS) {
      expect(seasonLead(s.slug).length).toBeGreaterThan(20);
      expect(seasonWorkLinks(s.slug).length).toBeGreaterThanOrEqual(1);
      expect(seasonFaq(s.slug).length).toBeGreaterThanOrEqual(2);
    }
  });

  it('work linky míří na existující sekce (/jak-na-to/ nebo /pruvodce/)', () => {
    for (const s of SEASONS) {
      for (const l of seasonWorkLinks(s.slug)) {
        expect(l.href).toMatch(/^\/(jak-na-to|pruvodce)\//);
        expect(l.label.length).toBeGreaterThan(3);
      }
    }
  });

  it('FAQ položky mají q i a', () => {
    for (const f of seasonFaq('jaro')) {
      expect(f.q.length).toBeGreaterThan(5);
      expect(f.a.length).toBeGreaterThan(10);
    }
  });
});
```

- [ ] **Step 2: Spustit → fail**

Run: `nvm use 22 && npx vitest run tests/lib/sezona.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implementovat editorial obsah**

Doplň do `src/lib/sezona.ts`:

```ts
export interface SeasonalLink {
  href: string;
  label: string;
}

export interface SeasonContent {
  lead: string;
  workLinks: SeasonalLink[];
  faq: { q: string; a: string }[];
}

// Kurátorský editorial obsah. Krátké leady (czech-ag-article-style), polní práce
// jako odkazy na existující howto/pruvodce, sezónní FAQ. Žádné dlouhé AI texty.
export const SEASON_CONTENT: Record<SeasonSlug, SeasonContent> = {
  jaro: {
    lead: 'Na jaře se na poli sejí jařiny — jarní ječmen, jarní pšenice, mák, slunečnice, cukrovka i kukuřice. Hlavní práce jsou příprava seťového lůžka, jarní hnojení dusíkem a včasné setí; pozdní výsev jařin snižuje výnos.',
    workLinks: [
      { href: '/jak-na-to/jak-nastavit-seci-stroj/', label: 'Jak nastavit secí stroj' },
      { href: '/pruvodce/jak-vybrat-postrikovac/', label: 'Jak vybrat postřikovač' },
      { href: '/pruvodce/jak-vybrat-rozmetadlo-hnojiv/', label: 'Jak vybrat rozmetadlo hnojiv' },
    ],
    faq: [
      { q: 'Co se na poli seje na jaře?', a: 'Na jaře (březen–květen) se sejí jařiny: jarní ječmen a pšenice (únor–březen), dále mák, cukrovka, slunečnice (březen–duben) a kukuřice se sójou (duben–květen).' },
      { q: 'Proč je u jařin důležitý raný výsev?', a: 'Raný výsev využívá jarní půdní vláhu a prodlužuje vegetaci. Každý týden zpoždění může u jarního ječmene snížit výnos o 0,2–0,3 t/ha a zhoršit jakost.' },
      { q: 'Jaké jsou hlavní jarní práce na poli?', a: 'Příprava seťového lůžka, smykování a vláčení, jarní přihnojení ozimů dusíkem, setí jařin a první ošetření porostů proti plevelům a chorobám.' },
    ],
  },
  leto: {
    lead: 'V létě vrcholí sklizeň: ozimý ječmen (červen), ozimá pšenice, žito, tritikale a hrách (červenec), poté řepka a jarní obiloviny (červenec–srpen). Souběžně probíhá seč pícnin a balíkování slámy a sena.',
    workLinks: [
      { href: '/pruvodce/jak-vybrat-kombajn-stredni-farma/', label: 'Jak vybrat kombajn pro střední farmu' },
      { href: '/pruvodce/jak-vybrat-seci-stroj/', label: 'Jak vybrat secí (žací) stroj' },
      { href: '/pruvodce/jak-vybrat-lis-na-baliky/', label: 'Jak vybrat lis na balíky' },
    ],
    faq: [
      { q: 'Co se sklízí v létě?', a: 'V červnu ozimý ječmen, v červenci ozimá pšenice, žito, tritikale, řepka a hrách, v srpnu jarní obiloviny, mák a řepka jarní.' },
      { q: 'Při jaké vlhkosti zrna sklízet obiloviny?', a: 'Obiloviny se sklízejí při vlhkosti zrna zhruba 13–15 %. Vyšší vlhkost vyžaduje dosoušení, nižší zvyšuje ztráty vydrolením.' },
      { q: 'Jaké letní práce kromě sklizně?', a: 'Seč a sklizeň pícnin (jetel, vojtěška), lisování slámy a sena, podmítka po sklizni a příprava na setí meziplodin či ozimé řepky.' },
    ],
  },
  podzim: {
    lead: 'Na podzim se zakládají ozimy — ozimá řepka (srpen–září), ozimá pšenice, ječmen, žito a tritikale (září–říjen). Dokončuje se sklizeň okopanin: brambory, cukrovka, kukuřice a slunečnice. Klíčová je podmítka a podzimní zpracování půdy.',
    workLinks: [
      { href: '/jak-na-to/jak-seridit-pluh/', label: 'Jak seřídit pluh' },
      { href: '/pruvodce/jak-vybrat-rozmetadlo-hnojiv/', label: 'Jak vybrat rozmetadlo hnojiv' },
      { href: '/pruvodce/jak-vybrat-kombajn-stredni-farma/', label: 'Jak vybrat kombajn pro střední farmu' },
    ],
    faq: [
      { q: 'Co se seje na podzim?', a: 'Ozimy: řepka ozimá (srpen–září), ozimá pšenice, ozimý ječmen, žito a tritikale (září–říjen). Termín setí ozimů je klíčový pro přezimování.' },
      { q: 'Co se sklízí na podzim?', a: 'Okopaniny a pozdní plodiny: brambory (srpen–říjen), cukrovka (září–listopad), kukuřice a slunečnice (září–říjen).' },
      { q: 'Proč je důležitá podmítka?', a: 'Podmítka po sklizni přerušuje kapilaritu, podporuje vzcházení výdrolu a plevelů k následné likvidaci a zapravuje posklizňové zbytky — základ přípravy půdy pro ozimy.' },
    ],
  },
  zima: {
    lead: 'V zimě polní práce odpočívají. Je čas na údržbu a seřízení techniky, plánování osevního postupu, nákup osiv a hnojiv a vyřízení dotací. Ozimy přezimují; sleduje se jejich stav a hrozba vyzimování.',
    workLinks: [
      { href: '/pruvodce/kontrola-ojeteho-traktoru/', label: 'Kontrola ojetého traktoru' },
      { href: '/pruvodce/prvni-traktor-mlady-zemedelec/', label: 'První traktor pro mladého zemědělce' },
    ],
    faq: [
      { q: 'Jaké práce dělat na poli v zimě?', a: 'Polní práce v zimě většinou stojí. Hospodaří se s časem na servis a seřízení strojů, plánování osevních postupů, nákup vstupů (osivo, hnojiva) a administrativu dotací.' },
      { q: 'Co se děje s ozimy v zimě?', a: 'Ozimy přezimují v klidovém stavu. Sleduje se sněhová pokrývka, riziko vyzimování při holomrazech a výskyt plísně sněžné; jarní regenerace začíná s oteplením.' },
    ],
  },
};

export function seasonLead(slug: SeasonSlug): string {
  return SEASON_CONTENT[slug].lead;
}
export function seasonWorkLinks(slug: SeasonSlug): SeasonalLink[] {
  return SEASON_CONTENT[slug].workLinks;
}
export function seasonFaq(slug: SeasonSlug): { q: string; a: string }[] {
  return SEASON_CONTENT[slug].faq;
}
```

- [ ] **Step 4: Spustit → pass**

Run: `nvm use 22 && npx vitest run tests/lib/sezona.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/sezona.ts tests/lib/sezona.test.ts
git commit -m "feat(sezona): kurátorský sezónní obsah (leady, work linky, FAQ) + testy"
```

---

## Task 5: Stránka kalendáře `/sezona/kalendar/`

**Files:**
- Create: `src/pages/sezona/kalendar/index.astro`

Tabulka plodina × 12 měsíců (S=setí, ☑=sklizeň) z `seti_mesice`/`sklizen_mesice`. Lead + FAQ + ItemList/FAQPage JSON-LD. Klientský highlight aktuálního měsíce.

- [ ] **Step 1: Vytvořit stránku**

```astro
---
export const prerender = true;
import Layout from '../../../layouts/Layout.astro';
import { listPlodiny } from '../../../lib/plodiny';
import { MONTH_NAMES_CS } from '../../../lib/sezona';
import { SITE_URL } from '../../../lib/config';
import { breadcrumbSchema, itemListSchema, faqPageSchema } from '../../../lib/structured-data';

const plodiny = listPlodiny()
  .filter((p) => (p.seti_mesice?.length ?? 0) > 0 || (p.sklizen_mesice?.length ?? 0) > 0)
  .sort((a, b) => a.name.localeCompare(b.name, 'cs'));

const pageUrl = `${SITE_URL}/sezona/kalendar/`;
const title = 'Kalendář setí a sklizně — kdy sít a sklízet polní plodiny';
const description = 'Přehledný kalendář setí a sklizně hlavních polních plodin v ČR: obiloviny, řepka, okopaniny, luskoviny a pícniny měsíc po měsíci.';

const faq = [
  { q: 'Kdy se sejí jařiny?', a: 'Jarní ječmen a pšenice únor–březen, mák, cukrovka a slunečnice březen–duben, kukuřice a sója duben–květen. Raný výsev jařin zvyšuje výnos.' },
  { q: 'Kdy se sejí ozimy?', a: 'Ozimá řepka srpen–září, ozimá pšenice, ječmen, žito a tritikale září–říjen. Termín setí ozimů je klíčový pro dobré přezimování.' },
  { q: 'Kdy vrcholí sklizeň obilovin?', a: 'V červenci a srpnu: nejdříve ozimý ječmen (červen–červenec), pak ozimá pšenice, žito a tritikale, nakonec jarní obiloviny.' },
];

const breadcrumbJsonLd = breadcrumbSchema([
  { name: 'Domů', url: '/' },
  { name: 'Sezóna', url: '/sezona/' },
  { name: 'Kalendář setí a sklizně', url: pageUrl },
]);
const itemListJsonLd = itemListSchema(
  plodiny.map((p) => ({ url: `${SITE_URL}/plodiny/${p.slug}/`, name: p.name })),
  'Kalendář setí a sklizně',
);
const faqJsonLd = faqPageSchema(faq);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
---

<Layout title={title} description={description} canonical={pageUrl}>
  <script type="application/ld+json" is:inline set:html={JSON.stringify(breadcrumbJsonLd)} />
  <script type="application/ld+json" is:inline set:html={JSON.stringify(itemListJsonLd)} />
  <script type="application/ld+json" is:inline set:html={JSON.stringify(faqJsonLd)} />

  <div class="sezona-root">
    <nav class="breadcrumb" aria-label="Cesta">
      <a href="/">Domů</a> <span aria-hidden="true">›</span>
      <a href="/sezona/">Sezóna</a> <span aria-hidden="true">›</span>
      <span class="current">Kalendář setí a sklizně</span>
    </nav>

    <h1>Kalendář setí a sklizně</h1>
    <p class="lead">{description}</p>

    <div class="table-wrap">
      <table class="cal" data-current-month="">
        <thead>
          <tr>
            <th scope="col">Plodina</th>
            {months.map((m) => <th scope="col" data-month={m} title={MONTH_NAMES_CS[m - 1]}>{MONTH_NAMES_CS[m - 1].slice(0, 3)}</th>)}
          </tr>
        </thead>
        <tbody>
          {plodiny.map((p) => (
            <tr>
              <th scope="row"><a href={`/plodiny/${p.slug}/`}>{p.name}</a></th>
              {months.map((m) => {
                const sow = p.seti_mesice?.includes(m);
                const harvest = p.sklizen_mesice?.includes(m);
                return (
                  <td data-month={m} class={`${sow ? 'sow' : ''} ${harvest ? 'harvest' : ''}`.trim()}>
                    {sow ? 'S' : ''}{harvest ? '☑' : ''}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p class="legenda"><span class="k sow">S</span> setí &nbsp; <span class="k harvest">☑</span> sklizeň</p>

    <section class="faq">
      <h2>Časté otázky</h2>
      {faq.map((f) => (<details><summary>{f.q}</summary><p>{f.a}</p></details>))}
    </section>

    <p class="cross"><a href="/sezona/">← Zpět na sezónní rozcestník</a> · <a href="/plodiny/">Všechny plodiny a odrůdy</a></p>
  </div>

  <script is:inline>
    // Zvýrazni aktuální měsíc (prerender → klientsky). 1–12.
    (function () {
      var m = new Date().getMonth() + 1;
      document.querySelectorAll('[data-month="' + m + '"]').forEach(function (el) {
        el.classList.add('is-current-month');
      });
    })();
  </script>

  <style>
    .sezona-root { max-width: 1100px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }
    .breadcrumb { font-size: .85rem; color: #6b7280; margin-bottom: 1rem; display: flex; gap: .4rem; flex-wrap: wrap; }
    .breadcrumb a { color: #15803d; text-decoration: none; }
    h1 { font-size: 1.9rem; margin: .2rem 0 .5rem; }
    .lead { color: #374151; max-width: 70ch; margin-bottom: 1.5rem; }
    .table-wrap { overflow-x: auto; border: 1px solid #e5e7eb; border-radius: 10px; }
    table.cal { border-collapse: collapse; width: 100%; min-width: 760px; font-size: .85rem; }
    .cal th, .cal td { border: 1px solid #eef2f5; padding: .35rem .4rem; text-align: center; }
    .cal thead th { background: #f9fafb; position: sticky; top: 0; }
    .cal tbody th[scope="row"] { text-align: left; white-space: nowrap; font-weight: 600; }
    .cal tbody th a { color: #15803d; text-decoration: none; }
    .cal td.sow { background: #dcfce7; }
    .cal td.harvest { background: #fef3c7; }
    .cal td.sow.harvest { background: linear-gradient(135deg, #dcfce7 50%, #fef3c7 50%); }
    .cal .is-current-month { outline: 2px solid #15803d; outline-offset: -2px; }
    .legenda { font-size: .8rem; color: #6b7280; margin: .6rem 0 2rem; }
    .legenda .k { display: inline-block; width: 1.4rem; text-align: center; border-radius: 4px; }
    .legenda .k.sow { background: #dcfce7; } .legenda .k.harvest { background: #fef3c7; }
    .faq h2 { font-size: 1.3rem; margin: 2rem 0 .8rem; }
    .faq details { border-bottom: 1px solid #e5e7eb; padding: .6rem 0; }
    .faq summary { cursor: pointer; font-weight: 600; }
    .faq p { color: #374151; margin: .5rem 0 0; }
    .cross { margin-top: 2rem; font-size: .9rem; }
    .cross a { color: #15803d; }
  </style>
</Layout>
```

- [ ] **Step 2: Ověřit build této stránky**

Run: `nvm use 22 && npm run build 2>&1 | grep -E "sezona/kalendar|error|Error" | head`
Expected: `/sezona/kalendar/index.html` se vygeneruje, žádná chyba.

- [ ] **Step 3: Commit**

```bash
git add src/pages/sezona/kalendar/index.astro
git commit -m "feat(sezona): stránka kalendáře setí a sklizně /sezona/kalendar/"
```

---

## Task 6: Sezónní stránky `/sezona/[season]/`

**Files:**
- Create: `src/pages/sezona/[season].astro`

Dynamická, `getStaticPaths` přes 4 sezóny. Lead → polní práce → co se seje/sklízí → FAQ.

- [ ] **Step 1: Vytvořit stránku**

```astro
---
export const prerender = true;
import Layout from '../../layouts/Layout.astro';
import { SEASONS, getSeason, seasonLead, seasonWorkLinks, seasonFaq, cropsSownInSeason, cropsHarvestedInSeason } from '../../lib/sezona';
import { SITE_URL } from '../../lib/config';
import { breadcrumbSchema, itemListSchema, faqPageSchema } from '../../lib/structured-data';

export function getStaticPaths() {
  return SEASONS.map((s) => ({ params: { season: s.slug } }));
}

const { season } = Astro.params;
const def = getSeason(season!);
if (!def) return Astro.rewrite('/404');

const sown = cropsSownInSeason(def.slug);
const harvested = cropsHarvestedInSeason(def.slug);
const workLinks = seasonWorkLinks(def.slug);
const faq = seasonFaq(def.slug);
const lead = seasonLead(def.slug);

const pageUrl = `${SITE_URL}/sezona/${def.slug}/`;
const title = `${def.name} na poli — práce, setí a sklizeň | Sezónní kalendář`;
const description = lead.slice(0, 155);

const breadcrumbJsonLd = breadcrumbSchema([
  { name: 'Domů', url: '/' },
  { name: 'Sezóna', url: '/sezona/' },
  { name: def.name, url: pageUrl },
]);
const itemListJsonLd = itemListSchema(
  [...sown, ...harvested].map((p) => ({ url: `${SITE_URL}/plodiny/${p.slug}/`, name: p.name })),
  `${def.name} — plodiny`,
);
const faqJsonLd = faqPageSchema(faq);
---

<Layout title={title} description={description} canonical={pageUrl}>
  <script type="application/ld+json" is:inline set:html={JSON.stringify(breadcrumbJsonLd)} />
  <script type="application/ld+json" is:inline set:html={JSON.stringify(itemListJsonLd)} />
  <script type="application/ld+json" is:inline set:html={JSON.stringify(faqJsonLd)} />

  <div class="sezona-root">
    <nav class="breadcrumb" aria-label="Cesta">
      <a href="/">Domů</a> <span aria-hidden="true">›</span>
      <a href="/sezona/">Sezóna</a> <span aria-hidden="true">›</span>
      <span class="current">{def.name}</span>
    </nav>

    <h1>{def.name} na poli</h1>
    <p class="lead">{lead}</p>

    {workLinks.length > 0 && (
      <section class="block">
        <h2>Polní práce v sezóně</h2>
        <ul class="links">
          {workLinks.map((l) => (<li><a href={l.href}>{l.label}</a></li>))}
        </ul>
      </section>
    )}

    {sown.length > 0 && (
      <section class="block">
        <h2>Co se {def.name.toLowerCase() === 'zima' ? 'plánuje sít' : 'teď seje'}</h2>
        <ul class="crops">
          {sown.map((p) => (
            <li><a href={`/plodiny/${p.slug}/`}>{p.name}</a>{p.vysevek ? <span class="meta"> — výsevek: {p.vysevek}</span> : null}</li>
          ))}
        </ul>
      </section>
    )}

    {harvested.length > 0 && (
      <section class="block">
        <h2>Co se teď sklízí</h2>
        <ul class="crops">
          {harvested.map((p) => (
            <li><a href={`/plodiny/${p.slug}/`}>{p.name}</a>{p.sklizen ? <span class="meta"> — sklizeň: {p.sklizen}</span> : null}</li>
          ))}
        </ul>
      </section>
    )}

    <section class="faq">
      <h2>Časté otázky</h2>
      {faq.map((f) => (<details><summary>{f.q}</summary><p>{f.a}</p></details>))}
    </section>

    <p class="cross"><a href="/sezona/">← Všechny sezóny</a> · <a href="/sezona/kalendar/">Kalendář setí a sklizně</a></p>
  </div>

  <style>
    .sezona-root { max-width: 820px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }
    .breadcrumb { font-size: .85rem; color: #6b7280; margin-bottom: 1rem; display: flex; gap: .4rem; flex-wrap: wrap; }
    .breadcrumb a { color: #15803d; text-decoration: none; }
    h1 { font-size: 2rem; margin: .2rem 0 .6rem; }
    .lead { color: #374151; font-size: 1.05rem; margin-bottom: 1.8rem; }
    .block { margin-bottom: 1.8rem; }
    .block h2 { font-size: 1.3rem; margin-bottom: .7rem; }
    .links, .crops { list-style: none; padding: 0; margin: 0; display: grid; gap: .4rem; }
    .crops .meta { color: #6b7280; font-size: .85rem; }
    .links a, .crops a { color: #15803d; text-decoration: none; font-weight: 600; }
    .faq h2 { font-size: 1.3rem; margin: 2rem 0 .8rem; }
    .faq details { border-bottom: 1px solid #e5e7eb; padding: .6rem 0; }
    .faq summary { cursor: pointer; font-weight: 600; }
    .faq p { color: #374151; margin: .5rem 0 0; }
    .cross { margin-top: 2rem; font-size: .9rem; }
    .cross a { color: #15803d; }
  </style>
</Layout>
```

- [ ] **Step 2: Ověřit build (4 sezónní stránky)**

Run: `nvm use 22 && npm run build 2>&1 | grep -E "sezona/(jaro|leto|podzim|zima)|error|Error" | head`
Expected: `/sezona/jaro/index.html`, `/sezona/leto/…`, `podzim`, `zima` se vygenerují; žádná chyba.

- [ ] **Step 3: Commit**

```bash
git add src/pages/sezona/[season].astro
git commit -m "feat(sezona): 4 sezónní stránky /sezona/[season]/"
```

---

## Task 7: Rozcestník `/sezona/`

**Files:**
- Create: `src/pages/sezona/index.astro`

4 sezónní karty (s data-season pro „právě teď" highlight) + karta na kalendář. Vzor `vcelarstvi/index.astro`.

- [ ] **Step 1: Vytvořit stránku**

```astro
---
export const prerender = true;
import Layout from '../../layouts/Layout.astro';
import { SEASONS } from '../../lib/sezona';
import { SITE_URL } from '../../lib/config';
import { breadcrumbSchema, itemListSchema } from '../../lib/structured-data';

const pageUrl = `${SITE_URL}/sezona/`;
const title = 'Zemědělský rok — sezónní práce, setí a sklizeň na poli';
const description = 'Co se na poli dělá v jednotlivých ročních obdobích: jarní setí, letní sklizeň, podzimní ozimy a zimní příprava. Kalendář setí a sklizně plodin.';

const emoji = { jaro: '🌱', leto: '🌾', podzim: '🍂', zima: '❄️' } as const;
const teaser = {
  jaro: 'Setí jařin, příprava půdy, jarní hnojení',
  leto: 'Sklizeň obilovin, seč pícnin, balíkování',
  podzim: 'Zakládání ozimů, sklizeň okopanin, podmítka',
  zima: 'Servis techniky, plánování, dotace',
} as const;

const cards = SEASONS.map((s) => ({ href: `/sezona/${s.slug}/`, name: s.name, slug: s.slug, emoji: emoji[s.slug], desc: teaser[s.slug] }));

const breadcrumbJsonLd = breadcrumbSchema([
  { name: 'Domů', url: '/' },
  { name: 'Sezóna', url: pageUrl },
]);
const itemListJsonLd = itemListSchema(
  [...cards.map((c) => ({ url: `${SITE_URL}${c.href}`, name: c.name })),
   { url: `${SITE_URL}/sezona/kalendar/`, name: 'Kalendář setí a sklizně' }],
  'Zemědělský rok',
);
---

<Layout title={title} description={description} canonical={pageUrl}>
  <script type="application/ld+json" is:inline set:html={JSON.stringify(breadcrumbJsonLd)} />
  <script type="application/ld+json" is:inline set:html={JSON.stringify(itemListJsonLd)} />

  <div class="sezona-root">
    <nav class="breadcrumb" aria-label="Cesta">
      <a href="/">Domů</a> <span aria-hidden="true">›</span>
      <span class="current">Zemědělský rok</span>
    </nav>

    <h1>Zemědělský rok</h1>
    <p class="lead">{description}</p>

    <div class="grid">
      {cards.map((c) => (
        <a class="card" href={c.href} data-season={c.slug}>
          <span class="emoji">{c.emoji}</span>
          <span class="name">{c.name}</span>
          <span class="desc">{c.desc}</span>
          <span class="now-badge">právě teď</span>
        </a>
      ))}
      <a class="card cal-card" href="/sezona/kalendar/">
        <span class="emoji">📅</span>
        <span class="name">Kalendář setí a sklizně</span>
        <span class="desc">Kdy sít a sklízet 18 polních plodin, měsíc po měsíci</span>
      </a>
    </div>
  </div>

  <script is:inline>
    (function () {
      var m = new Date().getMonth() + 1;
      var season = (m >= 3 && m <= 5) ? 'jaro' : (m >= 6 && m <= 8) ? 'leto' : (m >= 9 && m <= 11) ? 'podzim' : 'zima';
      var el = document.querySelector('.card[data-season="' + season + '"]');
      if (el) el.classList.add('is-now');
    })();
  </script>

  <style>
    .sezona-root { max-width: 900px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }
    .breadcrumb { font-size: .85rem; color: #6b7280; margin-bottom: 1rem; display: flex; gap: .4rem; flex-wrap: wrap; }
    .breadcrumb a { color: #15803d; text-decoration: none; }
    h1 { font-size: 2rem; margin: .2rem 0 .6rem; }
    .lead { color: #374151; max-width: 70ch; margin-bottom: 2rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }
    .card { position: relative; display: flex; flex-direction: column; gap: .35rem; padding: 1.3rem; border: 1px solid #e5e7eb; border-radius: 12px; text-decoration: none; color: inherit; transition: border-color .15s, box-shadow .15s; }
    .card:hover { border-color: #15803d; box-shadow: 0 4px 14px rgba(0,0,0,.06); }
    .card .emoji { font-size: 1.8rem; }
    .card .name { font-weight: 700; font-size: 1.15rem; }
    .card .desc { color: #6b7280; font-size: .9rem; }
    .card .now-badge { display: none; position: absolute; top: .8rem; right: .8rem; background: #15803d; color: #fff; font-size: .7rem; font-weight: 700; padding: .15rem .5rem; border-radius: 999px; }
    .card.is-now { border-color: #15803d; box-shadow: 0 0 0 2px #15803d33; }
    .card.is-now .now-badge { display: inline-block; }
    .cal-card { background: #f9fafb; }
  </style>
</Layout>
```

- [ ] **Step 2: Ověřit build**

Run: `nvm use 22 && npm run build 2>&1 | grep -E "sezona/index|error|Error" | head`
Expected: `/sezona/index.html` se vygeneruje; žádná chyba.

- [ ] **Step 3: Commit**

```bash
git add src/pages/sezona/index.astro
git commit -m "feat(sezona): rozcestník /sezona/ (4 karty + kalendář, now-highlight)"
```

---

## Task 8: Sitemap + nav + i18n label + cross-link

**Files:**
- Modify: `src/pages/sitemap.xml.ts`
- Modify: `src/i18n/nav.ts`
- Modify: `src/i18n/ui/cs.ts`, `src/i18n/ui/sk.ts`, `src/i18n/ui/uk.ts`
- Modify: `src/pages/plodiny/index.astro`

- [ ] **Step 1: Sitemap — přidat 6 URL (CS-only)**

V `src/pages/sitemap.xml.ts` do pole `staticPaths` (vedle `['/pruvodce/', …]`) přidej:

```ts
    ['/sezona/', 'monthly', '0.75', STATIC_LASTMOD],
    ['/sezona/jaro/', 'monthly', '0.7', STATIC_LASTMOD],
    ['/sezona/leto/', 'monthly', '0.7', STATIC_LASTMOD],
    ['/sezona/podzim/', 'monthly', '0.7', STATIC_LASTMOD],
    ['/sezona/zima/', 'monthly', '0.7', STATIC_LASTMOD],
    ['/sezona/kalendar/', 'monthly', '0.75', STATIC_LASTMOD],
```

(Loop přes `staticPaths` jen pushuje `${SITE_URL}${path}` — sk/uk mirror se na ně neaplikuje, protože `/sezona` není v `LAUNCHED_PREFIXES`. → správně CS-only.)

- [ ] **Step 2: Nav — položka pod sekcí `tema`**

V `src/i18n/nav.ts` do `children` sekce `tema` (za `{ labelKey: 'nav.tema.plodiny', href: '/plodiny/' }`) přidej:

```ts
      { labelKey: 'nav.tema.sezona', href: '/sezona/' },
```

- [ ] **Step 3: i18n label do cs/sk/uk (ui parity)**

`src/i18n/ui/cs.ts` (za `'nav.tema.plodiny': 'Plodiny a odrůdy',`):
```ts
  'nav.tema.sezona': 'Zemědělský rok',
```
`src/i18n/ui/sk.ts` (stejné místo):
```ts
  'nav.tema.sezona': 'Poľnohospodársky rok',
```
`src/i18n/ui/uk.ts` (stejné místo):
```ts
  'nav.tema.sezona': 'Сільськогосподарський рік',
```

- [ ] **Step 4: Cross-link z /plodiny/ na kalendář**

V `src/pages/plodiny/index.astro` najdi hero/lead sekci a přidej viditelný odkaz na kalendář (uprav formulaci dle okolního stylu; minimálně):
```astro
<p class="cal-link"><a href="/sezona/kalendar/">📅 Kalendář setí a sklizně →</a></p>
```
(Umísti za hlavní popis/lead stránky. Pokud `index.astro` používá scoped třídy, drž se jeho konvence; styl není kritický.)

- [ ] **Step 5: Spustit ui parity + build**

Run: `nvm use 22 && npx vitest run tests/i18n/ui-full.test.ts tests/i18n/ui.test.ts 2>&1 | tail -8`
Expected: PASS (klíč `nav.tema.sezona` je ve všech 3 locale → parity OK).

Run: `nvm use 22 && npm run build 2>&1 | tail -4`
Expected: `[build] Complete!`, žádná chyba.

- [ ] **Step 6: Commit**

```bash
git add src/pages/sitemap.xml.ts src/i18n/nav.ts src/i18n/ui/cs.ts src/i18n/ui/sk.ts src/i18n/ui/uk.ts src/pages/plodiny/index.astro
git commit -m "feat(sezona): sitemap (6 URL) + nav + i18n label + cross-link z plodiny"
```

---

## Task 9: Finální verifikace (build + testy + lokální smoke)

**Files:** žádné (jen ověření).

- [ ] **Step 1: Plné testy**

Run: `nvm use 22 && npx vitest run 2>&1 | tail -6`
Expected: nové `sezona.test.ts` PASS; celkem **3 fail** (pre-existing `nav.test.ts` bazar baseline) + zbytek pass. Pokud přibyl jiný fail → oprav.

- [ ] **Step 2: Build**

Run: `nvm use 22 && npm run build 2>&1 | tail -4`
Expected: `[build] Complete!`.

- [ ] **Step 3: Lokální prod server smoke**

```bash
pkill -f 'dist/server/entry' 2>/dev/null; sleep 1
PORT=4401 HOST=127.0.0.1 node --env-file=.env dist/server/entry.mjs > /tmp/sezona-smoke.log 2>&1 &
sleep 4
for p in /sezona/ /sezona/jaro/ /sezona/leto/ /sezona/podzim/ /sezona/zima/ /sezona/kalendar/; do
  echo "$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "http://127.0.0.1:4401$p")  $p"
done
echo "-- locale guard (má být 302 na cs díky PR #79) --"
curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" --max-time 15 "http://127.0.0.1:4401/sk/sezona/kalendar/"
echo "-- sitemap obsahuje /sezona/ --"
curl -s --max-time 20 "http://127.0.0.1:4401/sitemap.xml" | grep -c "/sezona/"
pkill -f 'dist/server/entry' 2>/dev/null
```
Expected: všech 6 cs URL = **200**; `/sk/sezona/kalendar/` = **302** na `…/sezona/kalendar/`; sitemap grep ≥ 6.

- [ ] **Step 4: (žádný commit — jen ověření)**

Pokud vše prošlo, feature je hotová a připravená k review/PR (finishing-a-development-branch).

---

## Self-Review (provedeno při psaní plánu)

- **Spec coverage:** `/sezona/` rozcestník (T7), 4 sezóny (T6), kalendář (T5), datová vrstva (T1), `sezona.ts` agregace (T2–T4), prerender + klientský highlight (T5/T7), JSON-LD (T5–T7), sitemap CS-only (T8), nav + i18n (T8), cross-link (T8), testy (T2–T4), akce = fáze 2 (mimo scope, OK). ✔ pokryto.
- **Placeholdery:** žádné — všechny kroky mají reálný kód/hodnoty/příkazy.
- **Type consistency:** `SeasonSlug`, `Season{slug,name,months}`, `SeasonalLink{href,label}`, `SEASON_CONTENT`, `seasonOfMonth`/`getSeason`/`cropsSownInSeason`/`seasonWorkLinks`/`seasonLead`/`seasonFaq` — konzistentní napříč T2–T7. Schema helpery (`breadcrumbSchema`/`itemListSchema`/`faqPageSchema`) sedí na ověřené signatury (`BreadcrumbItem{name,url}`, `ItemListEntry{url,name}`, `FaqItem{q,a}`).
