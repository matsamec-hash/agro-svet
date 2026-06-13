# Databáze plodin a odrůd — implementační plán

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Long-tail SEO databáze plodin a registrovaných odrůd na agro-svet.cz — hub plodin, pillar stránky plodin s agronomií, indexovatelné detaily TOP odrůd a programatické facety, postavené na hybridních datech (faktická vrstva z ÚKZÚZ + kurátorovaná obohacující vrstva).

**Architecture:** Mirror zralého vzoru `plemena` (compile-time data + `import.meta.glob`, žádná nová DB). Dvě oddělené datové vrstvy: faktická JSON vrstva (generovaná skriptem z ÚKZÚZ, commitovaná) + obohacující YAML vrstva (kurátorovaná). Renderování je **oddělené** od importu — stránky čtou commitnutý JSON, takže celá UI/SEO vrstva se staví a testuje proti fixture, zatímco import skript zraje paralelně. Anti-thin guardrail: vlastní indexovaná URL odrůdy vznikne jen u obohacených odrůd, „holé" odrůdy žijí jako řádek v tabulce na stránce plodiny.

**Tech Stack:** Astro 6 SSR + Cloudflare, TypeScript, `@modyfi/vite-plugin-yaml` (YAML compile-time), vitest, recyklace `src/lib/structured-data.ts`. Deploy wranglerem z worktree (Node 22).

---

## Konvence repa (NUTNÉ dodržet)

- **Data YAML:** parsované compile-time přes `import.meta.glob('/src/data/.../*.yaml', { eager: true, import: 'default' })`. Data JSON stejně (`*.json`).
- **Stránky:** `export const prerender = true;`, `getStaticPaths()`, neexistující entita → `return Astro.rewrite('/404')`.
- **Layout props:** `title` (povinné), `description?`, `ogImage?`, `canonical?`, `noindex?`.
- **Schema helpers** v `src/lib/structured-data.ts`: `breadcrumbSchema(items: {name,url}[])`, `faqPageSchema(items: {q,a}[])`, `howToSchema({name,description,url,steps:{name,text}[],...})`, `itemListSchema(entries: {url,name}[], listName?)`.
- **Testy:** `tests/lib/<name>.test.ts`, runner `npm test` (= `vitest run --passWithNoTests`). Spuštění jednoho souboru: `npx vitest run tests/lib/plodiny.test.ts`.
- **Sitemap:** `src/pages/sitemap.xml.ts` — importuj lib helper, pushuj do `urls` jako `{ loc, changefreq, lastmod: STATIC_LASTMOD }`.
- **Git (agro-svet caveat):** NIKDY `git add -A` (vtáhne `.env.save` se secrets → push protection). Vždy `git add <konkrétní soubory>`. Push: `/usr/bin/git -c credential.helper='!gh auth git-credential' push`.
- **Build/deploy:** `nvm use 22 && npm run build` (gate); deploy `npm run deploy` (NEDĚLÁ build) z worktree s zkopírovaným `.env`.

---

## Struktura souborů

| Soubor | Odpovědnost | Status |
|--------|-------------|--------|
| `src/lib/plodiny.ts` | Typy, join faktické+obohacující vrstvy, helpery, guardrail | Create |
| `src/data/plodiny/oves.yaml` (+ další) | Obohacující vrstva plodiny (agronomie, enrichment odrůd) | Create |
| `src/data/plodiny/odrudy/oves.json` (+ další) | Faktická vrstva odrůd (z ÚKZÚZ) | Create (skript) |
| `src/pages/plodiny/index.astro` | Hub plodin + klientský filtr | Create |
| `src/pages/plodiny/[plodina]/index.astro` | Pillar plodiny + tabulka odrůd | Create |
| `src/pages/plodiny/[plodina]/[odruda].astro` | Detail odrůdy (indexovaná podmnožina) | Create |
| `src/pages/plodiny/skupina/[skupina].astro` | Facet: skupina plodin | Create |
| `src/pages/odrudy/udrzovatel/[slug].astro` | Facet: odrůdy udržovatele | Create |
| `src/lib/osiva-links.ts` | Síťová synergie (prodejci + farmakrty), per plodina | Create |
| `src/pages/sitemap.xml.ts` | Registrace nových URL | Modify |
| `src/i18n/nav.ts` (nebo zdroj menu) | Položka „Plodiny" do menu | Modify |
| `scripts/import-odrudy.ts` | Import + normalizace ÚKZÚZ → JSON | Create |
| `tests/lib/plodiny.test.ts` | Testy libu | Create |
| `tests/scripts/import-odrudy.test.ts` | Test normalizace importu | Create |

**Slug guard:** segment `skupina` je rezervovaný na úrovni `/plodiny/[segment]`. Žádná plodina nesmí mít slug `skupina` — ověřeno v libu (Task 1, Step validace).

---

## FÁZE A — Datová vrstva (fixture-driven, bez externí závislosti)

### Task 1: Typy + jádro libu + fixture plodiny

**Files:**
- Create: `src/lib/plodiny.ts`
- Create: `src/data/plodiny/oves.yaml`
- Create: `src/data/plodiny/odrudy/oves.json`
- Test: `tests/lib/plodiny.test.ts`

- [ ] **Step 1: Vytvoř fixture obohacující vrstvy** `src/data/plodiny/oves.yaml`

```yaml
slug: oves
name: Oves setý
name_plural: Oves
skupina: obiloviny
description: >-
  Oves setý (Avena sativa) je jarní obilnina pěstovaná pro zrno i pícninu.
  Snáší chladnější a vlhčí oblasti, má nízké nároky na předplodinu.
vysevek: 350–450 klíčivých zrn/m²
hnojeni: N 60–90 kg/ha dle předplodiny a stanoviště
vynos_t_ha: 4–6
sklizen: konec července až srpen
vyuziti: krmné zrno, ovesné vločky, pícnina, GPS
choroby:
  - padlí travní
  - rzi
  - prašná sněť ovesná
osevni_postup:
  - name: Volba pozemku
    text: Oves snáší horší předplodinu, vhodný po okopaninách i obilnině.
  - name: Příprava půdy
    text: Středně hluboká orba nebo minimalizační zpracování, urovnání seťového lůžka.
  - name: Setí
    text: Jarní výsev co nejdříve, hloubka 3–4 cm, výsevek 350–450 zrn/m².
  - name: Hnojení a ochrana
    text: Dusík dle stanoviště, ochrana proti padlí a rzím dle prahu škodlivosti.
  - name: Sklizeň
    text: Sklizeň při plné zralosti zrna, vlhkost pod 15 %.
wikipedia: https://cs.wikipedia.org/wiki/Oves_set%C3%BD
faq:
  - q: Jaký je výsevek ovsa?
    a: Doporučený výsevek ovsa je 350–450 klíčivých zrn na m², podle stanoviště a termínu setí.
  - q: Po jaké předplodině pěstovat oves?
    a: Oves má nízké nároky na předplodinu, dobře snáší pěstování po okopaninách i po jiné obilnině.
enrichment:
  zlatak:
    popis: Žlutozrnná odrůda ovsa s vyšší objemovou hmotností, vhodná pro potravinářské využití.
    vlastnosti:
      Barva zrna: žlutá
      Využití: potravinářské, vločky
    doporuceni: Vhodný do oblastí s dostatkem srážek.
    faq:
      - q: K čemu se hodí odrůda Zlaťák?
        a: Odrůda Zlaťák se hodí pro potravinářské zpracování, zejména na ovesné vločky.
```

- [ ] **Step 2: Vytvoř fixture faktické vrstvy** `src/data/plodiny/odrudy/oves.json`

```json
[
  { "slug": "zlatak", "name": "Zlaťák", "plodina_slug": "oves", "rok_registrace": 2018, "udrzovatel": "Selgen, a.s.", "typ": "jarní", "ranost": "poloraná", "zdroj_url": "https://ido.ukzuz.cz/ido/" },
  { "slug": "korok", "name": "Korok", "plodina_slug": "oves", "rok_registrace": 2009, "udrzovatel": "Selgen, a.s.", "typ": "jarní", "ranost": "raná", "zdroj_url": "https://ido.ukzuz.cz/ido/" },
  { "slug": "atego", "name": "Atego", "plodina_slug": "oves", "rok_registrace": 2014, "udrzovatel": "Saatzucht Edelhof", "typ": "jarní", "ranost": "středně raná", "zdroj_url": "https://ido.ukzuz.cz/ido/" }
]
```

- [ ] **Step 3: Napiš padající test** `tests/lib/plodiny.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { listPlodiny, getPlodina, SKUPINA_LABELS } from '../../src/lib/plodiny';

describe('plodiny lib — jádro', () => {
  it('listPlodiny vrací plodiny seřazené dle name', () => {
    const all = listPlodiny();
    expect(all.length).toBeGreaterThan(0);
    expect(all.find((p) => p.slug === 'oves')).toBeTruthy();
  });

  it('getPlodina spojí obohacující vrstvu s faktickými odrůdami', () => {
    const oves = getPlodina('oves');
    expect(oves).toBeTruthy();
    expect(oves!.name).toBe('Oves setý');
    expect(oves!.skupina).toBe('obiloviny');
    expect(oves!.odrudy.length).toBe(3);
    expect(oves!.odrudy.map((o) => o.slug)).toContain('atego');
  });

  it('getPlodina vrací undefined pro neznámou plodinu', () => {
    expect(getPlodina('neexistuje')).toBeUndefined();
  });

  it('žádná plodina nemá rezervovaný slug "skupina"', () => {
    expect(listPlodiny().some((p) => p.slug === 'skupina')).toBe(false);
  });

  it('SKUPINA_LABELS pokrývá použité skupiny', () => {
    for (const p of listPlodiny()) {
      expect(SKUPINA_LABELS[p.skupina]).toBeTruthy();
    }
  });
});
```

- [ ] **Step 4: Spusť test — musí padnout**

Run: `npx vitest run tests/lib/plodiny.test.ts`
Expected: FAIL — `Cannot find module '../../src/lib/plodiny'`.

- [ ] **Step 5: Implementuj `src/lib/plodiny.ts`**

```typescript
// Compile-time data: YAML přes @modyfi/vite-plugin-yaml, JSON nativně. Žádná runtime DB.

export type Skupina =
  | 'obiloviny'
  | 'olejniny'
  | 'okopaniny'
  | 'luskoviny'
  | 'picniny';

export const SKUPINA_LABELS: Record<Skupina, string> = {
  obiloviny: 'Obiloviny',
  olejniny: 'Olejniny',
  okopaniny: 'Okopaniny',
  luskoviny: 'Luskoviny',
  picniny: 'Pícniny',
};

/** Faktická vrstva odrůdy — generovaná z ÚKZÚZ, commitovaná jako JSON. */
export interface OdrudaFakta {
  slug: string;
  name: string;
  plodina_slug: string;
  rok_registrace?: number | null;
  udrzovatel?: string | null;
  typ?: string | null;
  ranost?: string | null;
  zdroj_url?: string | null;
}

/** Obohacení odrůdy — kurátorovaná/AI vrstva, volitelné. */
export interface OdrudaEnrichment {
  popis?: string;
  vlastnosti?: Record<string, string | number>;
  odolnosti?: Record<string, string | number>;
  doporuceni?: string;
  body?: string;
  faq?: { q: string; a: string }[];
}

/** Spojená odrůda (fakta + případné obohacení). */
export interface Odruda extends OdrudaFakta {
  enrichment?: OdrudaEnrichment;
}

export interface HowToStepData { name: string; text: string }

/** Obohacující vrstva plodiny (YAML). */
export interface PlodinaYaml {
  slug: string;
  name: string;
  name_plural: string;
  skupina: Skupina;
  description: string;
  vysevek?: string;
  hnojeni?: string;
  vynos_t_ha?: string;
  sklizen?: string;
  vyuziti?: string;
  choroby?: string[];
  osevni_postup?: HowToStepData[];
  wikipedia?: string;
  wikidata?: string;
  body?: string;
  faq?: { q: string; a: string }[];
  enrichment?: Record<string, OdrudaEnrichment>;
}

/** Plodina spojená s odrůdami — to, co konzumují stránky. */
export interface Plodina extends PlodinaYaml {
  odrudy: Odruda[];
}

const yamlModules = import.meta.glob('/src/data/plodiny/*.yaml', {
  eager: true,
  import: 'default',
}) as Record<string, PlodinaYaml>;

const odrudyModules = import.meta.glob('/src/data/plodiny/odrudy/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, OdrudaFakta[]>;

let cached: Plodina[] | null = null;

function buildOdrudyIndex(): Record<string, OdrudaFakta[]> {
  const byPlodina: Record<string, OdrudaFakta[]> = {};
  for (const arr of Object.values(odrudyModules)) {
    for (const o of arr) {
      (byPlodina[o.plodina_slug] ??= []).push(o);
    }
  }
  return byPlodina;
}

function build(): Plodina[] {
  if (cached) return cached;
  const odrudyIndex = buildOdrudyIndex();
  const plodiny: Plodina[] = [];
  for (const yaml of Object.values(yamlModules)) {
    if (yaml.slug === 'skupina') {
      throw new Error('Plodina nesmí mít rezervovaný slug "skupina"');
    }
    const fakta = odrudyIndex[yaml.slug] ?? [];
    const odrudy: Odruda[] = fakta.map((f) => ({
      ...f,
      enrichment: yaml.enrichment?.[f.slug],
    }));
    odrudy.sort((a, b) => a.name.localeCompare(b.name, 'cs'));
    plodiny.push({ ...yaml, odrudy });
  }
  plodiny.sort((a, b) => a.name.localeCompare(b.name, 'cs'));
  cached = plodiny;
  return plodiny;
}

export function listPlodiny(): Plodina[] {
  return build();
}

export function getPlodina(slug: string): Plodina | undefined {
  return build().find((p) => p.slug === slug);
}
```

- [ ] **Step 6: Spusť test — musí projít**

Run: `npx vitest run tests/lib/plodiny.test.ts`
Expected: PASS (5 testů).

- [ ] **Step 7: Commit**

```bash
git add src/lib/plodiny.ts src/data/plodiny/oves.yaml src/data/plodiny/odrudy/oves.json tests/lib/plodiny.test.ts
git commit -m "feat(plodiny): datový lib + fixture (plodina+odrudy join)"
```

---

### Task 2: Guardrail indexovatelnosti odrůd

**Files:**
- Modify: `src/lib/plodiny.ts`
- Test: `tests/lib/plodiny.test.ts`

- [ ] **Step 1: Přidej padající testy** do `tests/lib/plodiny.test.ts`

```typescript
import { isOdrudaIndexable, listIndexableOdrudy, getOdruda } from '../../src/lib/plodiny';

describe('plodiny lib — guardrail odrůd', () => {
  it('obohacená odrůda je indexovatelná', () => {
    const zlatak = getOdruda('oves', 'zlatak');
    expect(zlatak).toBeTruthy();
    expect(isOdrudaIndexable(zlatak!)).toBe(true);
  });

  it('holá odrůda bez obohacení není indexovatelná', () => {
    const korok = getOdruda('oves', 'korok');
    expect(korok).toBeTruthy();
    expect(isOdrudaIndexable(korok!)).toBe(false);
  });

  it('listIndexableOdrudy vrací jen obohacené odrůdy s plodina_slug', () => {
    const idx = listIndexableOdrudy();
    expect(idx.every((e) => isOdrudaIndexable(e.odruda))).toBe(true);
    expect(idx.some((e) => e.odruda.slug === 'zlatak' && e.plodina_slug === 'oves')).toBe(true);
    expect(idx.some((e) => e.odruda.slug === 'korok')).toBe(false);
  });
});
```

- [ ] **Step 2: Spusť — musí padnout**

Run: `npx vitest run tests/lib/plodiny.test.ts`
Expected: FAIL — `isOdrudaIndexable is not a function`.

- [ ] **Step 3: Implementuj guardrail** v `src/lib/plodiny.ts` (přidej na konec)

```typescript
/**
 * Odrůda dostane vlastní indexovanou URL jen když má obohacení (popis / FAQ /
 * vlastnosti). Holé odrůdy z ÚKZÚZ žijí pouze jako řádek v tabulce na stránce
 * plodiny — žádné tenké duplikátní URL. Anti-thin guardrail.
 */
export function isOdrudaIndexable(o: Odruda): boolean {
  const e = o.enrichment;
  if (!e) return false;
  return Boolean(
    (e.popis && e.popis.trim().length > 0) ||
      (e.faq && e.faq.length > 0) ||
      (e.vlastnosti && Object.keys(e.vlastnosti).length > 0) ||
      (e.body && e.body.trim().length > 0),
  );
}

export function getOdruda(plodinaSlug: string, odrudaSlug: string): Odruda | undefined {
  return getPlodina(plodinaSlug)?.odrudy.find((o) => o.slug === odrudaSlug);
}

export interface IndexableOdrudaEntry {
  plodina_slug: string;
  plodina_name: string;
  odruda: Odruda;
}

export function listIndexableOdrudy(): IndexableOdrudaEntry[] {
  const out: IndexableOdrudaEntry[] = [];
  for (const p of build()) {
    for (const o of p.odrudy) {
      if (isOdrudaIndexable(o)) {
        out.push({ plodina_slug: p.slug, plodina_name: p.name, odruda: o });
      }
    }
  }
  return out;
}
```

- [ ] **Step 4: Spusť — musí projít**

Run: `npx vitest run tests/lib/plodiny.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/plodiny.ts tests/lib/plodiny.test.ts
git commit -m "feat(plodiny): anti-thin guardrail indexovatelnosti odrůd"
```

---

### Task 3: Facet helpery (skupina, udržovatel)

**Files:**
- Modify: `src/lib/plodiny.ts`
- Test: `tests/lib/plodiny.test.ts`

- [ ] **Step 1: Přidej padající testy**

```typescript
import { listSkupiny, listPlodinyBySkupina, listUdrzovatele, getUdrzovatel, udrzovatelSlug } from '../../src/lib/plodiny';

describe('plodiny lib — facety', () => {
  it('listSkupiny vrací použité skupiny s počty', () => {
    const sk = listSkupiny();
    expect(sk.find((s) => s.skupina === 'obiloviny')?.count).toBeGreaterThanOrEqual(1);
  });

  it('listPlodinyBySkupina filtruje dle skupiny', () => {
    const obi = listPlodinyBySkupina('obiloviny');
    expect(obi.every((p) => p.skupina === 'obiloviny')).toBe(true);
    expect(obi.some((p) => p.slug === 'oves')).toBe(true);
  });

  it('udrzovatelSlug je deterministický ASCII slug', () => {
    expect(udrzovatelSlug('Selgen, a.s.')).toBe('selgen-a-s');
  });

  it('listUdrzovatele agreguje odrůdy dle udržovatele', () => {
    const u = listUdrzovatele();
    const selgen = u.find((x) => x.slug === 'selgen-a-s');
    expect(selgen).toBeTruthy();
    expect(selgen!.odrudy.length).toBeGreaterThanOrEqual(2);
  });

  it('getUdrzovatel vrací odrůdy daného udržovatele', () => {
    const selgen = getUdrzovatel('selgen-a-s');
    expect(selgen?.name).toBe('Selgen, a.s.');
    expect(selgen!.odrudy.some((e) => e.odruda.slug === 'zlatak')).toBe(true);
  });
});
```

- [ ] **Step 2: Spusť — musí padnout**

Run: `npx vitest run tests/lib/plodiny.test.ts`
Expected: FAIL — `listSkupiny is not a function`.

- [ ] **Step 3: Implementuj facety** v `src/lib/plodiny.ts` (přidej na konec)

```typescript
export interface SkupinaEntry { skupina: Skupina; label: string; count: number }

export function listSkupiny(): SkupinaEntry[] {
  const counts = new Map<Skupina, number>();
  for (const p of build()) counts.set(p.skupina, (counts.get(p.skupina) ?? 0) + 1);
  return Array.from(counts.entries())
    .map(([skupina, count]) => ({ skupina, label: SKUPINA_LABELS[skupina], count }))
    .sort((a, b) => a.label.localeCompare(b.label, 'cs'));
}

export function listPlodinyBySkupina(skupina: Skupina): Plodina[] {
  return build().filter((p) => p.skupina === skupina);
}

/** Deterministický ASCII slug (bez diakritiky, jen [a-z0-9-]). */
export function udrzovatelSlug(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export interface UdrzovatelEntry {
  slug: string;
  name: string;
  odrudy: { plodina_slug: string; plodina_name: string; odruda: Odruda }[];
}

export function listUdrzovatele(): UdrzovatelEntry[] {
  const bySlug = new Map<string, UdrzovatelEntry>();
  for (const p of build()) {
    for (const o of p.odrudy) {
      const name = (o.udrzovatel ?? '').trim();
      if (!name) continue;
      const slug = udrzovatelSlug(name);
      if (!slug) continue;
      const entry = bySlug.get(slug) ?? { slug, name, odrudy: [] };
      entry.odrudy.push({ plodina_slug: p.slug, plodina_name: p.name, odruda: o });
      bySlug.set(slug, entry);
    }
  }
  return Array.from(bySlug.values()).sort((a, b) => a.name.localeCompare(b.name, 'cs'));
}

export function getUdrzovatel(slug: string): UdrzovatelEntry | undefined {
  return listUdrzovatele().find((u) => u.slug === slug);
}

/** Práh pro indexaci facetu udržovatele (anti-thin). */
export const UDRZOVATEL_INDEX_MIN = 2;

export function listIndexableUdrzovatele(): UdrzovatelEntry[] {
  return listUdrzovatele().filter((u) => u.odrudy.length >= UDRZOVATEL_INDEX_MIN);
}
```

- [ ] **Step 4: Spusť — musí projít**

Run: `npx vitest run tests/lib/plodiny.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/plodiny.ts tests/lib/plodiny.test.ts
git commit -m "feat(plodiny): facet helpery (skupina, udržovatel) + index práh"
```

---

## FÁZE B — Stránky

### Task 4: Hub plodin `/plodiny/` + položka v menu

**Files:**
- Create: `src/pages/plodiny/index.astro`
- Modify: zdroj navigace (najdi `Témata` v `src/i18n/nav.ts` nebo v `src/components/`/`Layout`)

- [ ] **Step 1: Najdi zdroj navigace**

Run: `grep -rln "Témata\|chov-hlemyzdu\|/akce/" src/i18n src/components src/layouts 2>/dev/null`
Najdi soubor, kde je definovaná položka menu „Témata" s podpoložkami (vzor `chov-hlemyzdu`, `akce`). Tam přidáš odkaz na `/plodiny/`.

- [ ] **Step 2: Vytvoř hub** `src/pages/plodiny/index.astro`

```astro
---
export const prerender = true;
import Layout from '../../layouts/Layout.astro';
import { listPlodiny, listSkupiny, SKUPINA_LABELS } from '../../lib/plodiny';
import { breadcrumbSchema, itemListSchema } from '../../lib/structured-data';

const plodiny = listPlodiny();
const skupiny = listSkupiny();
const totalOdrudy = plodiny.reduce((n, p) => n + p.odrudy.length, 0);

const breadcrumb = breadcrumbSchema([
  { name: 'Domů', url: '/' },
  { name: 'Plodiny', url: '/plodiny/' },
]);
const list = itemListSchema(
  plodiny.map((p) => ({ url: `/plodiny/${p.slug}/`, name: p.name })),
  'Plodiny',
);
---

<Layout
  title="Plodiny a odrůdy — databáze polních plodin"
  description={`Databáze ${plodiny.length} polních plodin a ${totalOdrudy} registrovaných odrůd: agronomie, výsevek, hnojení, choroby, výnos a doporučení.`}
>
  <script type="application/ld+json" set:html={JSON.stringify(breadcrumb)} />
  <script type="application/ld+json" set:html={JSON.stringify(list)} />

  <main class="container">
    <h1>Plodiny a odrůdy</h1>
    <p>Encyklopedie {plodiny.length} polních plodin a databáze {totalOdrudy} registrovaných odrůd.</p>

    {skupiny.map((s) => (
      <section>
        <h2><a href={`/plodiny/skupina/${s.skupina}/`}>{s.label}</a> ({s.count})</h2>
        <ul>
          {plodiny.filter((p) => p.skupina === s.skupina).map((p) => (
            <li>
              <a href={`/plodiny/${p.slug}/`}>{p.name}</a>
              {p.odrudy.length > 0 && <span> — {p.odrudy.length} odrůd</span>}
            </li>
          ))}
        </ul>
      </section>
    ))}
  </main>
</Layout>
```

- [ ] **Step 3: Přidej odkaz do menu** v souboru z Step 1

Mirror existující položky `chov-hlemyzdu`/`akce` pod „Témata": přidej `{ label: 'Plodiny', href: '/plodiny/' }` (přesný tvar podle struktury daného souboru).

- [ ] **Step 4: Ověř build**

Run: `nvm use 22 && npm run build 2>&1 | tail -15`
Expected: build projde, v outputu je `/plodiny/index.html`.

- [ ] **Step 5: Commit**

```bash
git add src/pages/plodiny/index.astro <soubor-navigace>
git commit -m "feat(plodiny): hub /plodiny/ + položka v menu Témata"
```

---

### Task 5: Pillar stránka plodiny `/plodiny/[plodina]/`

**Files:**
- Create: `src/pages/plodiny/[plodina]/index.astro`

- [ ] **Step 1: Vytvoř stránku**

```astro
---
export const prerender = true;
import Layout from '../../../layouts/Layout.astro';
import { listPlodiny, getPlodina, isOdrudaIndexable, SKUPINA_LABELS } from '../../../lib/plodiny';
import { breadcrumbSchema, howToSchema, faqPageSchema, itemListSchema } from '../../../lib/structured-data';
import OsivaLinks from '../../../components/OsivaLinks.astro';

export async function getStaticPaths() {
  return listPlodiny().map((p) => ({ params: { plodina: p.slug } }));
}

const { plodina: slug } = Astro.params;
const plodina = getPlodina(slug!);
if (!plodina) return Astro.rewrite('/404');

const base = `/plodiny/${plodina.slug}/`;
const breadcrumb = breadcrumbSchema([
  { name: 'Domů', url: '/' },
  { name: 'Plodiny', url: '/plodiny/' },
  { name: SKUPINA_LABELS[plodina.skupina], url: `/plodiny/skupina/${plodina.skupina}/` },
  { name: plodina.name, url: base },
]);

const howTo = plodina.osevni_postup && plodina.osevni_postup.length > 0
  ? howToSchema({
      name: `Osevní postup — ${plodina.name}`,
      description: `Jak pěstovat plodinu ${plodina.name.toLowerCase()}.`,
      url: base,
      steps: plodina.osevni_postup,
    })
  : null;
const faq = plodina.faq && plodina.faq.length > 0 ? faqPageSchema(plodina.faq) : null;
const list = plodina.odrudy.length > 0
  ? itemListSchema(
      plodina.odrudy.map((o) => ({
        url: isOdrudaIndexable(o) ? `${base}${o.slug}/` : base,
        name: o.name,
      })),
      `Odrůdy — ${plodina.name}`,
    )
  : null;
---

<Layout
  title={`${plodina.name} — pěstování, odrůdy, agronomie`}
  description={`${plodina.name}: výsevek, hnojení, choroby, výnos a přehled ${plodina.odrudy.length} registrovaných odrůd.`}
>
  <script type="application/ld+json" set:html={JSON.stringify(breadcrumb)} />
  {howTo && <script type="application/ld+json" set:html={JSON.stringify(howTo)} />}
  {faq && <script type="application/ld+json" set:html={JSON.stringify(faq)} />}
  {list && <script type="application/ld+json" set:html={JSON.stringify(list)} />}

  <main class="container">
    <nav aria-label="Drobečková navigace">
      <a href="/plodiny/">Plodiny</a> ›
      <a href={`/plodiny/skupina/${plodina.skupina}/`}>{SKUPINA_LABELS[plodina.skupina]}</a> › {plodina.name}
    </nav>

    <h1>{plodina.name}</h1>
    <p>{plodina.description}</p>

    <section class="agro-facts">
      <h2>Agronomie</h2>
      <dl>
        {plodina.vysevek && (<><dt>Výsevek</dt><dd>{plodina.vysevek}</dd></>)}
        {plodina.hnojeni && (<><dt>Hnojení</dt><dd>{plodina.hnojeni}</dd></>)}
        {plodina.vynos_t_ha && (<><dt>Výnos</dt><dd>{plodina.vynos_t_ha} t/ha</dd></>)}
        {plodina.sklizen && (<><dt>Sklizeň</dt><dd>{plodina.sklizen}</dd></>)}
        {plodina.vyuziti && (<><dt>Využití</dt><dd>{plodina.vyuziti}</dd></>)}
      </dl>
    </section>

    {plodina.osevni_postup && plodina.osevni_postup.length > 0 && (
      <section>
        <h2>Osevní postup</h2>
        <ol>
          {plodina.osevni_postup.map((s, i) => (
            <li id={`krok-${i + 1}`}><strong>{s.name}.</strong> {s.text}</li>
          ))}
        </ol>
      </section>
    )}

    {plodina.choroby && plodina.choroby.length > 0 && (
      <section>
        <h2>Choroby a škůdci</h2>
        <ul>{plodina.choroby.map((c) => (<li>{c}</li>))}</ul>
      </section>
    )}

    {plodina.body && <section class="prose" set:html={plodina.body} />}

    {plodina.odrudy.length > 0 && (
      <section>
        <h2>Odrůdy ({plodina.odrudy.length})</h2>
        <table>
          <thead><tr><th>Odrůda</th><th>Typ</th><th>Ranost</th><th>Registrace</th><th>Udržovatel</th></tr></thead>
          <tbody>
            {plodina.odrudy.map((o) => (
              <tr>
                <td>{isOdrudaIndexable(o) ? <a href={`${base}${o.slug}/`}>{o.name}</a> : o.name}</td>
                <td>{o.typ ?? '—'}</td>
                <td>{o.ranost ?? '—'}</td>
                <td>{o.rok_registrace ?? '—'}</td>
                <td>{o.udrzovatel ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    )}

    {plodina.faq && plodina.faq.length > 0 && (
      <section>
        <h2>Časté dotazy</h2>
        {plodina.faq.map((f) => (<div><h3>{f.q}</h3><p>{f.a}</p></div>))}
      </section>
    )}

    <OsivaLinks plodina={plodina.name} skupina={plodina.skupina} />
  </main>
</Layout>
```

> Pozn.: `OsivaLinks` komponenta vznikne v Task 9. Při samostatném běhu tohoto tasku dočasně odeber import + použití a doplň v Task 9.

- [ ] **Step 2: Ověř build**

Run: `nvm use 22 && npm run build 2>&1 | tail -15`
Expected: build projde, existuje `/plodiny/oves/index.html`, v HTML je JSON-LD `HowTo` + tabulka odrůd.

- [ ] **Step 3: Commit**

```bash
git add src/pages/plodiny/[plodina]/index.astro
git commit -m "feat(plodiny): pillar stránka plodiny (agronomie + tabulka odrůd + schema)"
```

---

### Task 6: Detail odrůdy `/plodiny/[plodina]/[odruda].astro` (indexovaná podmnožina)

**Files:**
- Create: `src/pages/plodiny/[plodina]/[odruda].astro`

- [ ] **Step 1: Vytvoř stránku** — `getStaticPaths` generuje JEN indexovatelné odrůdy (guardrail; neobohacené se negenerují vůbec → žádný crawl leak)

```astro
---
export const prerender = true;
import Layout from '../../../layouts/Layout.astro';
import { listIndexableOdrudy, getPlodina, getOdruda, udrzovatelSlug, SKUPINA_LABELS } from '../../../lib/plodiny';
import { breadcrumbSchema, faqPageSchema } from '../../../lib/structured-data';
import OsivaLinks from '../../../components/OsivaLinks.astro';

export async function getStaticPaths() {
  return listIndexableOdrudy().map((e) => ({
    params: { plodina: e.plodina_slug, odruda: e.odruda.slug },
  }));
}

const { plodina: plodinaSlug, odruda: odrudaSlug } = Astro.params;
const plodina = getPlodina(plodinaSlug!);
const odruda = getOdruda(plodinaSlug!, odrudaSlug!);
if (!plodina || !odruda) return Astro.rewrite('/404');

const e = odruda.enrichment!;
const base = `/plodiny/${plodina.slug}/${odruda.slug}/`;
const breadcrumb = breadcrumbSchema([
  { name: 'Domů', url: '/' },
  { name: 'Plodiny', url: '/plodiny/' },
  { name: plodina.name, url: `/plodiny/${plodina.slug}/` },
  { name: odruda.name, url: base },
]);
const faq = e.faq && e.faq.length > 0 ? faqPageSchema(e.faq) : null;
---

<Layout
  title={`${odruda.name} — odrůda (${plodina.name})`}
  description={(e.popis ?? `Odrůda ${odruda.name} plodiny ${plodina.name.toLowerCase()}.`).slice(0, 155)}
>
  <script type="application/ld+json" set:html={JSON.stringify(breadcrumb)} />
  {faq && <script type="application/ld+json" set:html={JSON.stringify(faq)} />}

  <main class="container">
    <nav aria-label="Drobečková navigace">
      <a href="/plodiny/">Plodiny</a> ›
      <a href={`/plodiny/${plodina.slug}/`}>{plodina.name}</a> › {odruda.name}
    </nav>

    <h1>{odruda.name}</h1>
    <p>Odrůda plodiny <a href={`/plodiny/${plodina.slug}/`}>{plodina.name.toLowerCase()}</a>.</p>
    {e.popis && <p>{e.popis}</p>}

    <section class="agro-facts">
      <h2>Základní údaje</h2>
      <dl>
        {odruda.typ && (<><dt>Typ</dt><dd>{odruda.typ}</dd></>)}
        {odruda.ranost && (<><dt>Ranost</dt><dd>{odruda.ranost}</dd></>)}
        {odruda.rok_registrace && (<><dt>Rok registrace</dt><dd>{odruda.rok_registrace}</dd></>)}
        {odruda.udrzovatel && (
          <><dt>Udržovatel</dt>
          <dd><a href={`/odrudy/udrzovatel/${udrzovatelSlug(odruda.udrzovatel)}/`}>{odruda.udrzovatel}</a></dd></>
        )}
      </dl>
    </section>

    {e.vlastnosti && Object.keys(e.vlastnosti).length > 0 && (
      <section><h2>Vlastnosti</h2>
        <dl>{Object.entries(e.vlastnosti).map(([k, v]) => (<><dt>{k}</dt><dd>{v}</dd></>))}</dl>
      </section>
    )}

    {e.odolnosti && Object.keys(e.odolnosti).length > 0 && (
      <section><h2>Odolnosti</h2>
        <dl>{Object.entries(e.odolnosti).map(([k, v]) => (<><dt>{k}</dt><dd>{v}</dd></>))}</dl>
      </section>
    )}

    {e.doporuceni && (<section><h2>Doporučení k pěstování</h2><p>{e.doporuceni}</p></section>)}
    {e.body && <section class="prose" set:html={e.body} />}

    {e.faq && e.faq.length > 0 && (
      <section><h2>Časté dotazy</h2>
        {e.faq.map((f) => (<div><h3>{f.q}</h3><p>{f.a}</p></div>))}
      </section>
    )}

    <OsivaLinks plodina={plodina.name} skupina={plodina.skupina} odruda={odruda.name} />
  </main>
</Layout>
```

- [ ] **Step 2: Ověř build**

Run: `nvm use 22 && npm run build 2>&1 | tail -15`
Expected: existuje `/plodiny/oves/zlatak/index.html`; NEEXISTUJE `/plodiny/oves/korok/index.html` (neobohacená).

- [ ] **Step 3: Commit**

```bash
git add src/pages/plodiny/[plodina]/[odruda].astro
git commit -m "feat(plodiny): detail odrůdy (jen indexovatelné, guardrail)"
```

---

### Task 7: Facet skupiny `/plodiny/skupina/[skupina]/`

**Files:**
- Create: `src/pages/plodiny/skupina/[skupina].astro`

- [ ] **Step 1: Vytvoř stránku**

```astro
---
export const prerender = true;
import Layout from '../../../layouts/Layout.astro';
import { listSkupiny, listPlodinyBySkupina, SKUPINA_LABELS, type Skupina } from '../../../lib/plodiny';
import { breadcrumbSchema, itemListSchema } from '../../../lib/structured-data';

export async function getStaticPaths() {
  return listSkupiny().map((s) => ({ params: { skupina: s.skupina } }));
}

const { skupina } = Astro.params;
const sk = skupina as Skupina;
const label = SKUPINA_LABELS[sk];
if (!label) return Astro.rewrite('/404');
const plodiny = listPlodinyBySkupina(sk);

const base = `/plodiny/skupina/${sk}/`;
const breadcrumb = breadcrumbSchema([
  { name: 'Domů', url: '/' },
  { name: 'Plodiny', url: '/plodiny/' },
  { name: label, url: base },
]);
const list = itemListSchema(plodiny.map((p) => ({ url: `/plodiny/${p.slug}/`, name: p.name })), label);
---

<Layout title={`${label} — plodiny a odrůdy`} description={`Přehled plodin skupiny ${label.toLowerCase()}: agronomie a registrované odrůdy.`}>
  <script type="application/ld+json" set:html={JSON.stringify(breadcrumb)} />
  <script type="application/ld+json" set:html={JSON.stringify(list)} />
  <main class="container">
    <nav aria-label="Drobečková navigace"><a href="/plodiny/">Plodiny</a> › {label}</nav>
    <h1>{label}</h1>
    <ul>
      {plodiny.map((p) => (
        <li><a href={`/plodiny/${p.slug}/`}>{p.name}</a> — {p.odrudy.length} odrůd</li>
      ))}
    </ul>
  </main>
</Layout>
```

- [ ] **Step 2: Ověř build**

Run: `nvm use 22 && npm run build 2>&1 | tail -10`
Expected: existuje `/plodiny/skupina/obiloviny/index.html`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/plodiny/skupina/[skupina].astro
git commit -m "feat(plodiny): facet skupiny plodin"
```

---

### Task 8: Facet udržovatele `/odrudy/udrzovatel/[slug]/`

**Files:**
- Create: `src/pages/odrudy/udrzovatel/[slug].astro`

- [ ] **Step 1: Vytvoř stránku** — `getStaticPaths` generuje jen facety nad prahem (anti-thin)

```astro
---
export const prerender = true;
import Layout from '../../../layouts/Layout.astro';
import { listIndexableUdrzovatele, getUdrzovatel, isOdrudaIndexable } from '../../../lib/plodiny';
import { breadcrumbSchema, itemListSchema } from '../../../lib/structured-data';

export async function getStaticPaths() {
  return listIndexableUdrzovatele().map((u) => ({ params: { slug: u.slug } }));
}

const { slug } = Astro.params;
const u = getUdrzovatel(slug!);
if (!u) return Astro.rewrite('/404');

const base = `/odrudy/udrzovatel/${u.slug}/`;
const breadcrumb = breadcrumbSchema([
  { name: 'Domů', url: '/' },
  { name: 'Plodiny', url: '/plodiny/' },
  { name: u.name, url: base },
]);
const list = itemListSchema(
  u.odrudy.map((e) => ({
    url: isOdrudaIndexable(e.odruda) ? `/plodiny/${e.plodina_slug}/${e.odruda.slug}/` : `/plodiny/${e.plodina_slug}/`,
    name: `${e.odruda.name} (${e.plodina_name})`,
  })),
  `Odrůdy — ${u.name}`,
);
---

<Layout title={`${u.name} — registrované odrůdy`} description={`Přehled registrovaných odrůd udržovatele ${u.name}.`}>
  <script type="application/ld+json" set:html={JSON.stringify(breadcrumb)} />
  <script type="application/ld+json" set:html={JSON.stringify(list)} />
  <main class="container">
    <nav aria-label="Drobečková navigace"><a href="/plodiny/">Plodiny</a> › {u.name}</nav>
    <h1>Odrůdy udržovatele {u.name}</h1>
    <table>
      <thead><tr><th>Odrůda</th><th>Plodina</th><th>Registrace</th></tr></thead>
      <tbody>
        {u.odrudy.map((e) => (
          <tr>
            <td>{isOdrudaIndexable(e.odruda)
              ? <a href={`/plodiny/${e.plodina_slug}/${e.odruda.slug}/`}>{e.odruda.name}</a>
              : e.odruda.name}</td>
            <td><a href={`/plodiny/${e.plodina_slug}/`}>{e.plodina_name}</a></td>
            <td>{e.odruda.rok_registrace ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </main>
</Layout>
```

- [ ] **Step 2: Ověř build**

Run: `nvm use 22 && npm run build 2>&1 | tail -10`
Expected: existuje `/odrudy/udrzovatel/selgen-a-s/index.html` (Selgen má 2 odrůdy ≥ práh).

- [ ] **Step 3: Commit**

```bash
git add src/pages/odrudy/udrzovatel/[slug].astro
git commit -m "feat(plodiny): facet udržovatele odrůd (nad indexovým prahem)"
```

---

## FÁZE C — Síťová synergie + SEO integrace

### Task 9: Blok síťové synergie osiv

**Files:**
- Create: `src/lib/osiva-links.ts`
- Create: `src/components/OsivaLinks.astro`

- [ ] **Step 1: Napiš padající test** `tests/lib/plodiny.test.ts` (přidej blok)

```typescript
import { osivaLinksFor } from '../../src/lib/osiva-links';

describe('osiva-links — síťová synergie', () => {
  it('vrací odkaz na adresář prodejců a na farmakrty (followed)', () => {
    const links = osivaLinksFor('obiloviny');
    expect(links.some((l) => l.href.includes('/prodejci'))).toBe(true);
    const fk = links.find((l) => l.href.includes('farmakrty.cz'));
    expect(fk).toBeTruthy();
    expect(fk!.rel).toBeUndefined(); // vlastní síť = followed, žádné nofollow
  });
});
```

- [ ] **Step 2: Spusť — musí padnout**

Run: `npx vitest run tests/lib/plodiny.test.ts`
Expected: FAIL — `Cannot find module '../../src/lib/osiva-links'`.

- [ ] **Step 3: Implementuj `src/lib/osiva-links.ts`**

```typescript
import type { Skupina } from './plodiny';

export interface OsivaLink {
  href: string;
  label: string;
  /** rel atribut; undefined = followed (vlastní síť dle Kontraktu sítě). */
  rel?: string;
  external?: boolean;
}

/**
 * Síťová synergie místo e-shopu: odkaz na vlastní adresář prodejců + na
 * farmakrty.cz (precizní zemědělství / farma Samec, vlastní síť → followed).
 * Žádné ceny, žádný sitewide spam — blok jen na stránkách plodin/odrůd.
 */
export function osivaLinksFor(_skupina: Skupina): OsivaLink[] {
  return [
    { href: '/prodejci/', label: 'Adresář prodejců osiv a agro vstupů' },
    { href: 'https://farmakrty.cz/', label: 'Farma Samec — precizní zemědělství', external: true },
  ];
}
```

- [ ] **Step 4: Spusť — musí projít**

Run: `npx vitest run tests/lib/plodiny.test.ts`
Expected: PASS.

- [ ] **Step 5: Vytvoř komponentu `src/components/OsivaLinks.astro`**

```astro
---
import { osivaLinksFor } from '../lib/osiva-links';
import type { Skupina } from '../lib/plodiny';

interface Props { plodina: string; skupina: Skupina; odruda?: string }
const { plodina, skupina } = Astro.props;
const links = osivaLinksFor(skupina);
---
<section class="osiva-synergie">
  <h2>Kde řešit osivo a poradenství</h2>
  <p>Pro pořízení osiva plodiny {plodina.toLowerCase()} a odborné poradenství:</p>
  <ul>
    {links.map((l) => (
      <li>
        <a href={l.href} rel={l.rel} {...(l.external ? { target: '_blank' } : {})}>{l.label}</a>
      </li>
    ))}
  </ul>
</section>
```

- [ ] **Step 6: Ověř, že stránky plodiny/odrůdy komponentu používají** (z Task 5/6). Pokud byl import dočasně odebrán, vrať `import OsivaLinks` + `<OsivaLinks ... />`.

- [ ] **Step 7: Ověř build**

Run: `nvm use 22 && npm run build 2>&1 | tail -10`
Expected: build projde; v `/plodiny/oves/index.html` je sekce „Kde řešit osivo".

- [ ] **Step 8: Commit**

```bash
git add src/lib/osiva-links.ts src/components/OsivaLinks.astro tests/lib/plodiny.test.ts src/pages/plodiny/
git commit -m "feat(plodiny): blok síťové synergie osiv (prodejci + farmakrty, followed)"
```

---

### Task 10: Sitemap + OG integrace

**Files:**
- Modify: `src/pages/sitemap.xml.ts`

- [ ] **Step 1: Přidej importy** nahoru v `src/pages/sitemap.xml.ts`

```typescript
import { listPlodiny, listIndexableOdrudy, listSkupiny, listIndexableUdrzovatele } from '../lib/plodiny';
```

- [ ] **Step 2: Přidej URL** do bloku, kde se pushuje do `urls` (vzor `getAllDruhy()` smyčky, viz `src/pages/sitemap.xml.ts:302`)

```typescript
// Plodiny + indexovatelné odrůdy + facety
urls.push({ loc: `${SITE_URL}/plodiny/`, changefreq: 'weekly', lastmod: STATIC_LASTMOD });
for (const p of listPlodiny()) {
  urls.push({ loc: `${SITE_URL}/plodiny/${p.slug}/`, changefreq: 'monthly', lastmod: STATIC_LASTMOD });
}
for (const e of listIndexableOdrudy()) {
  urls.push({ loc: `${SITE_URL}/plodiny/${e.plodina_slug}/${e.odruda.slug}/`, changefreq: 'monthly', lastmod: STATIC_LASTMOD });
}
for (const s of listSkupiny()) {
  urls.push({ loc: `${SITE_URL}/plodiny/skupina/${s.skupina}/`, changefreq: 'monthly', lastmod: STATIC_LASTMOD });
}
for (const u of listIndexableUdrzovatele()) {
  urls.push({ loc: `${SITE_URL}/odrudy/udrzovatel/${u.slug}/`, changefreq: 'monthly', lastmod: STATIC_LASTMOD });
}
```

- [ ] **Step 3: Ověř build a sitemap**

Run: `nvm use 22 && npm run build 2>&1 | tail -8 && grep -c "/plodiny/" dist/sitemap.xml`
Expected: build projde; grep vrátí ≥ počet plodin+odrůd+facetů; v sitemapě NENÍ `/plodiny/oves/korok/` (neindexovaná).

- [ ] **Step 4: Commit**

```bash
git add src/pages/sitemap.xml.ts
git commit -m "feat(plodiny): registrace plodin/odrůd/facetů do sitemap"
```

> OG karty: agro-svet generuje default OG dle pathname (`resolveDefaultOg` v Layout). Per-page OG pro plodiny řeš až ve fázi 2 (mimo tento plán) — MVP používá default OG, není blokující.

---

## FÁZE D — Reálná data z ÚKZÚZ

### Task 11: Import skript `scripts/import-odrudy.ts`

**Files:**
- Create: `scripts/import-odrudy.ts`
- Test: `tests/scripts/import-odrudy.test.ts`

**Pozn. ke zdroji:** `ido.ukzuz.cz/ido/` je ExtJS 7 SPA s JSON backendem (store proxy). Jádro skriptu (čistá funkce `normalizeOdruda` mapující ÚKZÚZ záznam → `OdrudaFakta`) je unit-testovatelné. I/O část (objevení store endpointu) je dokumentovaná s fallbackem na roční PDF.

- [ ] **Step 1: Discovery store endpointu (ruční spike, zaznamenej výsledek)**

```bash
# ExtJS store volá JSON endpoint přes XHR. Najdi ho v devtools Network (filtr XHR)
# na https://ido.ukzuz.cz/ido/ při výběru plodiny, NEBO prohledej bundle:
curl -s "https://ido.ukzuz.cz/ido/js/extjs7-applications/varieties/varieties/app.js" | grep -oE '"[^"]*(api|store|grid|list|data)[^"]*"'
```
Zaznamenej do komentáře skriptu nalezenou URL + tvar JSON (klíče polí). Pokud endpoint vyžaduje `jsessionid`/POST filtr, dokumentuj parametry. Fallback (pokud endpoint nedostupný): PDF „Seznam odrůd" z `ukzuz.gov.cz/.../seznam-odrud` → parsovat přes `pdf-parse` (přidej devDependency jen pokud potřeba).

- [ ] **Step 2: Napiš padající test normalizace** `tests/scripts/import-odrudy.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { normalizeOdruda, slugifyOdruda } from '../../scripts/import-odrudy';

describe('import-odrudy — normalizace', () => {
  it('slugifyOdruda dělá ASCII slug', () => {
    expect(slugifyOdruda('Zlaťák')).toBe('zlatak');
    expect(slugifyOdruda('KWS Aréna')).toBe('kws-arena');
  });

  it('normalizeOdruda mapuje ÚKZÚZ záznam na OdrudaFakta', () => {
    const raw = {
      nazev: 'Zlaťák',
      druhPlodiny: 'oves setý',
      rokRegistrace: '2018',
      udrzovatel: 'Selgen, a.s.',
      typ: 'jarní',
      ranost: 'poloraná',
    };
    const out = normalizeOdruda(raw, 'oves');
    expect(out).toEqual({
      slug: 'zlatak',
      name: 'Zlaťák',
      plodina_slug: 'oves',
      rok_registrace: 2018,
      udrzovatel: 'Selgen, a.s.',
      typ: 'jarní',
      ranost: 'poloraná',
      zdroj_url: 'https://ido.ukzuz.cz/ido/',
    });
  });
});
```

- [ ] **Step 3: Spusť — musí padnout**

Run: `npx vitest run tests/scripts/import-odrudy.test.ts`
Expected: FAIL — modul/funkce neexistuje.

- [ ] **Step 4: Implementuj `scripts/import-odrudy.ts`**

```typescript
/**
 * Import registrovaných odrůd z ÚKZÚZ → src/data/plodiny/odrudy/<plodina>.json
 *
 * Zdroj: ido.ukzuz.cz (ExtJS store JSON endpoint — viz Step 1 discovery).
 * Fallback: roční PDF „Seznam odrůd" z ukzuz.gov.cz.
 *
 * Spuštění: npx tsx scripts/import-odrudy.ts <plodina_slug> <ukzuz_druh>
 * Generovaný JSON se COMMITUJE (data v repu = build bez síťové závislosti).
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

export interface OdrudaFaktaOut {
  slug: string;
  name: string;
  plodina_slug: string;
  rok_registrace: number | null;
  udrzovatel: string | null;
  typ: string | null;
  ranost: string | null;
  zdroj_url: string;
}

export function slugifyOdruda(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Čistá mapovací funkce — testovatelná bez sítě. Klíče `raw` uprav dle Step 1. */
export function normalizeOdruda(raw: Record<string, unknown>, plodinaSlug: string): OdrudaFaktaOut {
  const name = String(raw.nazev ?? raw.name ?? '').trim();
  const rok = raw.rokRegistrace ?? raw.rok_registrace;
  return {
    slug: slugifyOdruda(name),
    name,
    plodina_slug: plodinaSlug,
    rok_registrace: rok ? Number(String(rok).replace(/\D/g, '')) || null : null,
    udrzovatel: raw.udrzovatel ? String(raw.udrzovatel).trim() : null,
    typ: raw.typ ? String(raw.typ).trim() : null,
    ranost: raw.ranost ? String(raw.ranost).trim() : null,
    zdroj_url: 'https://ido.ukzuz.cz/ido/',
  };
}

/** Stáhne raw záznamy z ÚKZÚZ store endpointu (URL z discovery Step 1). */
async function fetchRaw(ukzuzDruh: string): Promise<Record<string, unknown>[]> {
  // NAHRAĎ za skutečný endpoint z discovery (Step 1). Příklad tvaru:
  const endpoint = `https://ido.ukzuz.cz/ido/api/varieties?druh=${encodeURIComponent(ukzuzDruh)}`;
  const res = await fetch(endpoint, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`ÚKZÚZ ${res.status} — zkontroluj endpoint/fallback PDF`);
  const json = (await res.json()) as { data?: Record<string, unknown>[] } | Record<string, unknown>[];
  return Array.isArray(json) ? json : (json.data ?? []);
}

async function main() {
  const [plodinaSlug, ukzuzDruh] = process.argv.slice(2);
  if (!plodinaSlug || !ukzuzDruh) {
    console.error('Použití: npx tsx scripts/import-odrudy.ts <plodina_slug> <ukzuz_druh>');
    process.exit(1);
  }
  const raw = await fetchRaw(ukzuzDruh);
  const odrudy = raw
    .map((r) => normalizeOdruda(r, plodinaSlug))
    .filter((o) => o.name && o.slug)
    .sort((a, b) => a.name.localeCompare(b.name, 'cs'));
  const out = resolve(`src/data/plodiny/odrudy/${plodinaSlug}.json`);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(odrudy, null, 2) + '\n');
  console.log(`✓ ${odrudy.length} odrůd → ${out}`);
}

// Spustit jen když je skript volán přímo (ne při importu v testu).
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
```

- [ ] **Step 5: Spusť test — musí projít**

Run: `npx vitest run tests/scripts/import-odrudy.test.ts`
Expected: PASS (2 testy).

- [ ] **Step 6: Commit**

```bash
git add scripts/import-odrudy.ts tests/scripts/import-odrudy.test.ts
git commit -m "feat(plodiny): import skript ÚKZÚZ → JSON (normalizace + fetch + fallback)"
```

---

### Task 12: Naplnění reálnými daty + enrichment pillar plodin

**Files:**
- Create/Modify: `src/data/plodiny/odrudy/*.json` (generováno skriptem)
- Create: `src/data/plodiny/<plodina>.yaml` pro MVP plodiny

- [ ] **Step 1: Spusť import pro MVP plodiny** (po dokončení discovery v Task 11)

```bash
# Pro každou MVP plodinu (mapování plodina_slug → ÚKZÚZ druh dle číselníku z discovery):
npx tsx scripts/import-odrudy.ts psenice-ozima "pšenice setá ozimá"
npx tsx scripts/import-odrudy.ts oves "oves setý"
# … ječmen-jarni, ječmen-ozimy, zito, tritikale, repka-ozima, kukurice, brambory, cukrovka, hrach, soja, …
```
Pokud endpoint nedostupný → použij PDF fallback (Task 11 Step 1). Pokud ani to ne, ručně dohraj alespoň TOP odrůdy do JSON dle struktury fixture.

- [ ] **Step 2: Napiš obohacující YAML** pro každou MVP plodinu (`src/data/plodiny/<plodina>.yaml`) dle struktury `oves.yaml` z Task 1: agronomie + 2–4 FAQ + `enrichment` pro 3–8 nejhledanějších odrůd každé plodiny. Fakticky ověřené hodnoty (výsevek, hnojení, ranost) — žádné halucinace (poučení z i18n QA).

- [ ] **Step 3: Ověř integritu** (každá enrichment odrůda existuje ve faktické vrstvě)

```bash
npx vitest run tests/lib/plodiny.test.ts && nvm use 22 && npm run build 2>&1 | tail -8
```
Expected: testy projdou; build projde; počet indexovaných odrůd odpovídá součtu enrichmentů.

- [ ] **Step 4: Commit**

```bash
git add src/data/plodiny/
git commit -m "feat(plodiny): reálná data odrůd (ÚKZÚZ) + enrichment MVP plodin"
```

---

## Závěrečné ověření (před PR / deployem)

- [ ] `npx vitest run` — všechny testy zelené
- [ ] `nvm use 22 && npm run build` — build projde
- [ ] Smoke (lokální `dist/` nebo po deployi):
  - `/plodiny/` → 200, výpis plodin po skupinách
  - `/plodiny/oves/` → 200, JSON-LD HowTo + tabulka odrůd
  - `/plodiny/oves/<obohacená>/` → 200; `/plodiny/oves/<holá>/` → 404 (negeneruje se)
  - `/plodiny/skupina/obiloviny/` → 200
  - `/odrudy/udrzovatel/<slug>/` → 200
  - `dist/sitemap.xml` obsahuje plodiny + indexované odrůdy, NE holé odrůdy
- [ ] Deploy z worktree: `nvm use 22 && npm run build && npm run deploy` (`.env` zkopírovaný do worktree)
- [ ] Git push: `/usr/bin/git -c credential.helper='!gh auth git-credential' push` (NIKDY `git add -A`)

---

## Mapování spec → tasky (coverage)

| Spec sekce | Task(y) |
|------------|---------|
| §2 URL architektura (hub/plodina/odrůda/facety) | 4, 5, 6, 7, 8 |
| §3a faktická vrstva + import | 1 (fixture), 11, 12 |
| §3b obohacující vrstva | 1, 12 |
| §3c anti-thin guardrail | 2, 6, 8, 10 |
| §3d lib helpery | 1, 2, 3 |
| §4 SEO výbava (schema, sitemap, meta) | 5, 6, 7, 8, 10 |
| §5 síťová synergie osiv | 9 |
| §6 rozsah MVP (širší) | 12 |
| §7 stack/provoz/git | konvence + závěrečné ověření |
