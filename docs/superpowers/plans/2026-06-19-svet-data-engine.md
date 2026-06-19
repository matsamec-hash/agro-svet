# Svět — datový engine (Plán 1/2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build-time pipeline, která z otevřených API (Eurostat/FAOSTAT/USDA) stáhne a ověří zemědělská data zemí a zapeče je do `src/data/svet/<slug>.json` se společným, ozdrojovaným schématem — pro Německo, Francii a Velkou Británii.

**Architecture:** Čisté (side-effect-free) parsovací helpery v `scripts/lib/svet/*.mjs` (testovatelné vitestem proti fixturám) + tenký orchestrační skript `scripts/build-svet.mjs`, který je volá, sestaví `CountryProfile` a zapíše JSON. Konfigurace zemí a indikátorů je data (ne kód). Verifikační brána validuje schéma a řády hodnot. Engine je čistě build-time → výstup statické JSON, žádné runtime API volání.

**Tech Stack:** Node ESM (`.mjs`), vitest, TypeScript typy pro app stranu, Eurostat JSON-stat API, FAOSTAT API, USDA (FAS PSD / NASS QuickStats). Znovupoužívá `scripts/lib/eurostat-sk.mjs` (`pickSeries`, `strides`, `yoyChange`).

**Tento plán NEřeší** zobrazení (profil/srovnávač/IA/nav/sitemap) — to je Plán 2, který konzumuje výstup tohoto plánu. Tento plán je hotový, když existují ověřené `src/data/svet/{nemecko,francie,velka-britanie}.json` + `src/data/svet/index.json`.

---

## Soubory (mapa)

- Create: `src/lib/svet/types.ts` — TS typy schématu (`DataPoint`, `SeriesPoint`, `Indicator`, `CountryProfile`) + runtime validátor `assertCountryProfile`.
- Test: `tests/lib/svet-types.test.ts`
- Create: `scripts/lib/svet/countries.mjs` — registr zemí (slug, geo, faostat, usda, název, vlajka).
- Test: `tests/scripts/svet-countries.test.ts`
- Create: `scripts/lib/svet/indicators.mjs` — registr indikátorů (key, label, balíček, zdrojová specifikace).
- Test: `tests/scripts/svet-indicators.test.ts`
- Create: `scripts/lib/svet/eurostat.mjs` — `buildEurostatUrl`, `fetchEurostatSeries` (přes `pickSeries`).
- Test: `tests/scripts/svet-eurostat.test.ts`
- Create: `scripts/lib/svet/faostat.mjs` — `buildFaostatUrl`, `parseFaostat`.
- Test: `tests/scripts/svet-faostat.test.ts`
- Create: `scripts/lib/svet/usda.mjs` — `buildUsdaPsdUrl`, `parseUsdaPsd`.
- Test: `tests/scripts/svet-usda.test.ts`
- Create: `scripts/lib/svet/verify.mjs` — `sanityCheck(profile)` (čistá funkce, řády/jednotky).
- Test: `tests/scripts/svet-verify.test.ts`
- Create: `scripts/build-svet.mjs` — orchestrace; zapisuje `src/data/svet/<slug>.json` + `index.json`.
- Modify: `package.json` — přidat skript `data:world`.
- Create (výstup): `src/data/svet/nemecko.json`, `francie.json`, `velka-britanie.json`, `index.json`.
- Create (fixtury): `tests/fixtures/svet/eurostat-apro_cpsh1.json`, `faostat-land.json`, `usda-psd-corn.json`.

---

## Task 1: Schéma typů + runtime validátor

**Files:**
- Create: `src/lib/svet/types.ts`
- Test: `tests/lib/svet-types.test.ts`

- [ ] **Step 1: Napiš padající test**

```ts
// tests/lib/svet-types.test.ts
import { describe, it, expect } from 'vitest';
import { assertCountryProfile } from '../../src/lib/svet/types';

const valid = {
  slug: 'nemecko', geo: 'DE', nameCs: 'Německo', flag: '🇩🇪',
  generated: '2026-06-19',
  indicators: {
    wheat_yield: {
      key: 'wheat_yield', label: 'Výnos pšenice', pkg: 'produkce', unit: 't/ha',
      latest: { value: 7.3, unit: 't/ha', referencePeriod: '2024', source: 'Eurostat', sourceUrl: 'https://ec.europa.eu/eurostat', fetchedAt: '2026-06-19' },
      series: [{ period: '2023', value: 7.1 }, { period: '2024', value: 7.3 }],
    },
  },
};

describe('assertCountryProfile', () => {
  it('projde validní profil', () => {
    expect(() => assertCountryProfile(valid)).not.toThrow();
  });
  it('selže když datapointu chybí source', () => {
    const bad = structuredClone(valid);
    delete bad.indicators.wheat_yield.latest.source;
    expect(() => assertCountryProfile(bad)).toThrow(/source/);
  });
  it('selže když indikátor nemá žádné body řady', () => {
    const bad = structuredClone(valid);
    bad.indicators.wheat_yield.series = [];
    expect(() => assertCountryProfile(bad)).toThrow(/series/);
  });
});
```

- [ ] **Step 2: Spusť test — musí selhat**

Run: `npx vitest run tests/lib/svet-types.test.ts`
Expected: FAIL — `Cannot find module '../../src/lib/svet/types'`

- [ ] **Step 3: Implementuj typy + validátor**

```ts
// src/lib/svet/types.ts
export type PackageKey = 'produkce' | 'puda' | 'ekonomika' | 'obchod';

export interface DataPoint {
  value: number;
  unit: string;
  referencePeriod: string; // období DAT, ne stažení: '2024' | 'MR 2024/25'
  source: string;          // 'Eurostat' | 'FAOSTAT' | 'USDA FAS PSD' | 'DEFRA'
  sourceUrl: string;
  fetchedAt: string;       // ISO datum stažení
}

export interface SeriesPoint {
  period: string;
  value: number;
}

export interface Indicator {
  key: string;
  label: string;
  pkg: PackageKey;
  unit: string;
  latest: DataPoint;
  series: SeriesPoint[]; // chronologicky vzestupně, ≥1 bod
}

export interface CountryProfile {
  slug: string;
  geo: string;
  nameCs: string;
  flag: string;
  generated: string;
  indicators: Record<string, Indicator>;
}

const POINT_FIELDS: (keyof DataPoint)[] = ['value', 'unit', 'referencePeriod', 'source', 'sourceUrl', 'fetchedAt'];

export function assertCountryProfile(p: any): asserts p is CountryProfile {
  for (const f of ['slug', 'geo', 'nameCs', 'flag', 'generated'] as const) {
    if (!p?.[f]) throw new Error(`CountryProfile: chybí pole "${f}"`);
  }
  if (!p.indicators || typeof p.indicators !== 'object') throw new Error('CountryProfile: chybí indicators');
  for (const [key, ind] of Object.entries<any>(p.indicators)) {
    for (const f of ['key', 'label', 'pkg', 'unit'] as const) {
      if (!ind?.[f]) throw new Error(`Indicator ${key}: chybí pole "${f}"`);
    }
    if (!Array.isArray(ind.series) || ind.series.length === 0) {
      throw new Error(`Indicator ${key}: prázdné nebo chybějící series`);
    }
    for (const f of POINT_FIELDS) {
      if (ind.latest?.[f] === undefined || ind.latest?.[f] === null || ind.latest?.[f] === '') {
        throw new Error(`Indicator ${key}: latest chybí "${f}"`);
      }
    }
  }
}
```

- [ ] **Step 4: Spusť test — musí projít**

Run: `npx vitest run tests/lib/svet-types.test.ts`
Expected: PASS (3 testy)

- [ ] **Step 5: Commit**

```bash
git add src/lib/svet/types.ts tests/lib/svet-types.test.ts
git commit -m "feat(svet): schéma typů profilu země + runtime validátor"
```

---

## Task 2: Registr zemí

**Files:**
- Create: `scripts/lib/svet/countries.mjs`
- Test: `tests/scripts/svet-countries.test.ts`

- [ ] **Step 1: Napiš padající test**

```ts
// tests/scripts/svet-countries.test.ts
import { describe, it, expect } from 'vitest';
import { COUNTRIES, bySlug } from '../../scripts/lib/svet/countries.mjs';

describe('COUNTRIES', () => {
  it('obsahuje fázi 1: nemecko, francie, velka-britanie', () => {
    const slugs = COUNTRIES.map((c) => c.slug);
    expect(slugs).toContain('nemecko');
    expect(slugs).toContain('francie');
    expect(slugs).toContain('velka-britanie');
  });
  it('každá země má geo, name, flag a unikátní slug', () => {
    const seen = new Set();
    for (const c of COUNTRIES) {
      expect(c.geo).toBeTruthy();
      expect(c.nameCs).toBeTruthy();
      expect(c.flag).toBeTruthy();
      expect(seen.has(c.slug)).toBe(false);
      seen.add(c.slug);
    }
  });
  it('bySlug vrací správnou zemi', () => {
    expect(bySlug('nemecko').geo).toBe('DE');
  });
});
```

- [ ] **Step 2: Spusť test — musí selhat**

Run: `npx vitest run tests/scripts/svet-countries.test.ts`
Expected: FAIL — modul neexistuje

- [ ] **Step 3: Implementuj registr**

```js
// scripts/lib/svet/countries.mjs
// Registr zemí pro datovou sekci /svet/. geo = Eurostat kód, faostat = FAOSTAT area code,
// usda = příznak že primární zdroj je USDA (USA). Fáze 1 = DE/FR/UK; další se přidávají sem.
export const COUNTRIES = [
  { slug: 'nemecko',        geo: 'DE', faostat: 79,  usda: false, nameCs: 'Německo',        flag: '🇩🇪' },
  { slug: 'francie',        geo: 'FR', faostat: 68,  usda: false, nameCs: 'Francie',        flag: '🇫🇷' },
  { slug: 'velka-britanie', geo: 'UK', faostat: 229, usda: false, nameCs: 'Velká Británie', flag: '🇬🇧' },
];

// Referenční země (ČR) — vždy přítomná pro srovnání, sestavuje se taky.
export const REFERENCE = { slug: 'cesko', geo: 'CZ', faostat: 167, usda: false, nameCs: 'Česko', flag: '🇨🇿' };

export function bySlug(slug) {
  return [REFERENCE, ...COUNTRIES].find((c) => c.slug === slug);
}
```

- [ ] **Step 4: Spusť test — musí projít**

Run: `npx vitest run tests/scripts/svet-countries.test.ts`
Expected: PASS (3 testy)

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/svet/countries.mjs tests/scripts/svet-countries.test.ts
git commit -m "feat(svet): registr zemí (DE/FR/UK + ČR reference)"
```

---

## Task 3: Generický Eurostat fetcher

**Files:**
- Create: `scripts/lib/svet/eurostat.mjs`
- Test: `tests/scripts/svet-eurostat.test.ts`
- Create (fixtura): `tests/fixtures/svet/eurostat-apro_cpsh1.json`

> Znovupoužívá `pickSeries` z `scripts/lib/eurostat-sk.mjs` (už otestováno). Tady přidáváme jen sestavení URL a tenký wrapper.

- [ ] **Step 1: Ulož reálnou fixturu (discovery)**

Run:
```bash
mkdir -p tests/fixtures/svet
curl -s 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/apro_cpsh1?format=JSON&geo=DE&crops=C1100&strucpro=YI_HU_EU' \
  -o tests/fixtures/svet/eurostat-apro_cpsh1.json
node -e "const d=require('./tests/fixtures/svet/eurostat-apro_cpsh1.json'); console.log('id',d.id); console.log('crops',Object.keys(d.dimension.crops.category.index)); console.log('strucpro',Object.keys(d.dimension.strucpro.category.index)); console.log('unit',Object.keys(d.dimension.unit.category.label).map(k=>d.dimension.unit.category.label[k]));"
```
Expected: vypíše `id` (pole dimenzí vč. `time`), potvrdí kódy `crops=C1100`, `strucpro=YI_HU_EU` a jednotku (typicky `100 kg/ha` nebo `t/ha`). **Zapiš si reálnou jednotku** — použije se v indikátoru (Task 5). Pokud kód neexistuje, oprav ho dle výstupu před pokračováním.

- [ ] **Step 2: Napiš padající test**

```ts
// tests/scripts/svet-eurostat.test.ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { buildEurostatUrl, seriesFromJsonStat } from '../../scripts/lib/svet/eurostat.mjs';

describe('buildEurostatUrl', () => {
  it('sestaví URL s geo a filtry', () => {
    const url = buildEurostatUrl('apro_cpsh1', { geo: 'DE', crops: 'C1100', strucpro: 'YI_HU_EU' });
    expect(url).toContain('/apro_cpsh1?');
    expect(url).toContain('format=JSON');
    expect(url).toContain('geo=DE');
    expect(url).toContain('crops=C1100');
    expect(url).toContain('strucpro=YI_HU_EU');
  });
});

describe('seriesFromJsonStat (reálná fixtura)', () => {
  const json = JSON.parse(readFileSync('tests/fixtures/svet/eurostat-apro_cpsh1.json', 'utf8'));
  it('vytáhne chronologickou řadu pro DE/C1100/YI_HU_EU', () => {
    const s = seriesFromJsonStat(json, { geo: 'DE', crops: 'C1100', strucpro: 'YI_HU_EU' });
    expect(s.length).toBeGreaterThan(3);
    expect(s[0].period < s[s.length - 1].period).toBe(true);
    expect(typeof s[0].value).toBe('number');
  });
});
```

- [ ] **Step 3: Spusť test — musí selhat**

Run: `npx vitest run tests/scripts/svet-eurostat.test.ts`
Expected: FAIL — modul neexistuje

- [ ] **Step 4: Implementuj**

```js
// scripts/lib/svet/eurostat.mjs
// Tenký wrapper nad Eurostat dissemination API + generickým JSON-stat extraktorem.
import { pickSeries } from '../eurostat-sk.mjs';

const BASE = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data';

/** Sestaví Eurostat data URL. params = { geo, ...dimFilters }. */
export function buildEurostatUrl(dataset, params) {
  const qs = new URLSearchParams({ format: 'JSON', ...params });
  return `${BASE}/${dataset}?${qs.toString()}`;
}

/** Čistá: JSON-stat → [{period,value}] pro dané fixní souřadnice (vč. geo). */
export function seriesFromJsonStat(json, fixed) {
  return pickSeries(json, fixed).map((p) => ({ period: p.time, value: p.value }));
}

/** Stáhne a vrátí časovou řadu. filters = dimenze KROMĚ time (vč. geo). */
export async function fetchEurostatSeries(dataset, filters) {
  const url = buildEurostatUrl(dataset, filters);
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`Eurostat ${dataset} ${res.status} (${url})`);
  const json = await res.json();
  return { series: seriesFromJsonStat(json, filters), url };
}
```

- [ ] **Step 5: Spusť test — musí projít**

Run: `npx vitest run tests/scripts/svet-eurostat.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add scripts/lib/svet/eurostat.mjs tests/scripts/svet-eurostat.test.ts tests/fixtures/svet/eurostat-apro_cpsh1.json
git commit -m "feat(svet): generický Eurostat fetcher (znovupoužívá pickSeries)"
```

---

## Task 4: FAOSTAT fetcher (parita GB/USA + globál)

**Files:**
- Create: `scripts/lib/svet/faostat.mjs`
- Test: `tests/scripts/svet-faostat.test.ts`
- Create (fixtura): `tests/fixtures/svet/faostat-land.json`

- [ ] **Step 1: Ulož reálnou fixturu (discovery)**

Run:
```bash
curl -s 'https://faostatservices.fao.org/api/v1/en/data/RL?area=79&element=5110&item=6620&year=2018,2019,2020,2021,2022&output_type=objects' \
  -o tests/fixtures/svet/faostat-land.json
node -e "const d=require('./tests/fixtures/svet/faostat-land.json'); console.log('rows', (d.data||[]).length); console.log(JSON.stringify((d.data||[])[0],null,1));"
```
Expected: `d.data` je pole objektů s poli `Year`, `Value`, `Unit`, `Item`, `Element`. (RL = Land Use, element 5110 = Area, item 6620 = Agricultural land.) Pokud se schéma liší, uprav parser dle reálných klíčů.

- [ ] **Step 2: Napiš padající test**

```ts
// tests/scripts/svet-faostat.test.ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { buildFaostatUrl, parseFaostat } from '../../scripts/lib/svet/faostat.mjs';

describe('buildFaostatUrl', () => {
  it('sestaví URL domény+area+element+item', () => {
    const url = buildFaostatUrl('RL', { area: 79, element: 5110, item: 6620 });
    expect(url).toContain('/data/RL?');
    expect(url).toContain('area=79');
    expect(url).toContain('element=5110');
    expect(url).toContain('item=6620');
  });
});

describe('parseFaostat (reálná fixtura)', () => {
  const json = JSON.parse(readFileSync('tests/fixtures/svet/faostat-land.json', 'utf8'));
  it('vrátí chronologickou řadu {period,value}', () => {
    const s = parseFaostat(json);
    expect(s.length).toBeGreaterThan(2);
    expect(s[0].period < s[s.length - 1].period).toBe(true);
    expect(typeof s[0].value).toBe('number');
  });
});
```

- [ ] **Step 3: Spusť test — musí selhat**

Run: `npx vitest run tests/scripts/svet-faostat.test.ts`
Expected: FAIL — modul neexistuje

- [ ] **Step 4: Implementuj**

```js
// scripts/lib/svet/faostat.mjs
const BASE = 'https://faostatservices.fao.org/api/v1/en/data';

/** Sestaví FAOSTAT data URL. domain = 'RL'|'QCL'|... params = { area, element, item, year? } */
export function buildFaostatUrl(domain, params) {
  const qs = new URLSearchParams({ output_type: 'objects', ...Object.fromEntries(
    Object.entries(params).map(([k, v]) => [k, String(v)]),
  ) });
  return `${BASE}/${domain}?${qs.toString()}`;
}

/** Čistá: FAOSTAT objects odpověď → [{period,value}] (chronologicky, jen číselné). */
export function parseFaostat(json) {
  const rows = json?.data ?? [];
  const out = [];
  for (const r of rows) {
    const year = String(r.Year ?? r.year ?? '');
    const value = Number(r.Value ?? r.value);
    if (!year || Number.isNaN(value)) continue;
    out.push({ period: year, value });
  }
  out.sort((a, b) => a.period.localeCompare(b.period));
  return out;
}

export async function fetchFaostatSeries(domain, params) {
  const url = buildFaostatUrl(domain, params);
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`FAOSTAT ${domain} ${res.status} (${url})`);
  const json = await res.json();
  return { series: parseFaostat(json), url };
}
```

- [ ] **Step 5: Spusť test — musí projít**

Run: `npx vitest run tests/scripts/svet-faostat.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add scripts/lib/svet/faostat.mjs tests/scripts/svet-faostat.test.ts tests/fixtures/svet/faostat-land.json
git commit -m "feat(svet): FAOSTAT fetcher (parita + globál)"
```

---

## Task 5: Registr indikátorů (spine: 1 na zdroj) + recept na rozšíření

**Files:**
- Create: `scripts/lib/svet/indicators.mjs`
- Test: `tests/scripts/svet-indicators.test.ts`

> **Spine teď:** 3 reálné indikátory (Eurostat výnos pšenice, FAOSTAT zem. plocha, později USDA v Task 6). Plný set 4 balíčků se doplní podle receptu níže (Task 8) — každý je jen další položka v poli + fixtura.

- [ ] **Step 1: Napiš padající test**

```ts
// tests/scripts/svet-indicators.test.ts
import { describe, it, expect } from 'vitest';
import { INDICATORS } from '../../scripts/lib/svet/indicators.mjs';

describe('INDICATORS', () => {
  it('má unikátní keys a povinná pole', () => {
    const seen = new Set();
    for (const i of INDICATORS) {
      expect(i.key).toBeTruthy();
      expect(i.label).toBeTruthy();
      expect(['produkce', 'puda', 'ekonomika', 'obchod']).toContain(i.pkg);
      expect(i.unit).toBeTruthy();
      expect(['eurostat', 'faostat', 'usda']).toContain(i.spec.source);
      expect(seen.has(i.key)).toBe(false);
      seen.add(i.key);
    }
  });
  it('eurostat indikátor má dataset a filtry bez geo (geo se doplní za běhu)', () => {
    const wy = INDICATORS.find((i) => i.key === 'wheat_yield');
    expect(wy.spec.source).toBe('eurostat');
    expect(wy.spec.dataset).toBe('apro_cpsh1');
    expect(wy.spec.filters.geo).toBeUndefined();
  });
});
```

- [ ] **Step 2: Spusť test — musí selhat**

Run: `npx vitest run tests/scripts/svet-indicators.test.ts`
Expected: FAIL — modul neexistuje

- [ ] **Step 3: Implementuj (jednotku `unit` u wheat_yield nastav dle výstupu Task 3 Step 1)**

```js
// scripts/lib/svet/indicators.mjs
// Registr indikátorů. spec.source určuje fetcher; spec.filters NEobsahuje geo
// (doplní orchestrátor podle země). sourceLabel/pageUrl = lidský zdroj k zobrazení.

export const INDICATORS = [
  {
    key: 'wheat_yield', label: 'Výnos pšenice', pkg: 'produkce', unit: 't/ha',
    spec: {
      source: 'eurostat', dataset: 'apro_cpsh1',
      // POZOR (ověřeno z reálné fixtury Task 3): správný kód výnosu je YLD_HUMD_EU_T_HA
      // (NE YI_HU_EU), jednotka je t/ha → scale: 1. Dataset má povinnou dimenzi freq → freq:'A'.
      filters: { freq: 'A', crops: 'C1100', strucpro: 'YLD_HUMD_EU_T_HA' },
      sourceLabel: 'Eurostat',
      pageUrl: 'https://ec.europa.eu/eurostat/databrowser/view/apro_cpsh1/default/table',
      scale: 1,
    },
  },
  {
    key: 'ag_land', label: 'Zemědělská plocha', pkg: 'puda', unit: 'mil. ha',
    spec: {
      source: 'faostat', domain: 'RL',
      params: { element: 5110, item: 6620 }, // area = doplní orchestrátor (faostat code)
      sourceLabel: 'FAOSTAT',
      pageUrl: 'https://www.fao.org/faostat/en/#data/RL',
      scale: 0.001, // 1000 ha → mil. ha
    },
  },
];
```

- [ ] **Step 4: Spusť test — musí projít**

Run: `npx vitest run tests/scripts/svet-indicators.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/svet/indicators.mjs tests/scripts/svet-indicators.test.ts
git commit -m "feat(svet): registr indikátorů (spine: výnos pšenice, zem. plocha)"
```

---

## Task 6: USDA fetcher (USA — pro pozdější fázi, spine teď)

**Files:**
- Create: `scripts/lib/svet/usda.mjs`
- Test: `tests/scripts/svet-usda.test.ts`
- Create (fixtura): `tests/fixtures/svet/usda-psd-corn.json`

> USA je až Fáze 3, ale parser stavíme teď, ať je engine kompletní a otestovaný. Pro Fázi 1 (DE/FR/UK) se nevolá.

- [ ] **Step 1: Ulož reálnou fixturu (discovery)**

Run:
```bash
# USDA FAS PSD Online — veřejné CSV/JSON přes apps.fas.usda.gov; pokud vyžaduje klíč,
# použij FAOSTAT pro USA (area=231) a tento task označ jako N/A v build skriptu.
curl -s 'https://faostatservices.fao.org/api/v1/en/data/QCL?area=231&element=5510&item=56&year=2020,2021,2022&output_type=objects' \
  -o tests/fixtures/svet/usda-psd-corn.json
node -e "const d=require('./tests/fixtures/svet/usda-psd-corn.json'); console.log('rows',(d.data||[]).length, (d.data||[])[0]?.Unit);"
```
Expected: řádky produkce kukuřice USA (QCL element 5510 = Production, item 56 = Maize). Tím je USA pokryta přes FAOSTAT (harmonizace s ostatními) — `usda.mjs` je tenký alias parseru FAOSTATu.

- [ ] **Step 2: Napiš padající test**

```ts
// tests/scripts/svet-usda.test.ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { parseUsa } from '../../scripts/lib/svet/usda.mjs';

describe('parseUsa', () => {
  const json = JSON.parse(readFileSync('tests/fixtures/svet/usda-psd-corn.json', 'utf8'));
  it('vrátí chronologickou řadu produkce kukuřice USA', () => {
    const s = parseUsa(json);
    expect(s.length).toBeGreaterThan(1);
    expect(typeof s[0].value).toBe('number');
  });
});
```

- [ ] **Step 3: Spusť test — musí selhat**

Run: `npx vitest run tests/scripts/svet-usda.test.ts`
Expected: FAIL — modul neexistuje

- [ ] **Step 4: Implementuj (USA přes FAOSTAT pro srovnatelnost)**

```js
// scripts/lib/svet/usda.mjs
// USA data čerpáme přes FAOSTAT (stejná harmonizace jako Evropa) — parseUsa je
// alias parseFaostat. Pokud později přejdeme na FAS PSD přímo, změní se jen tady.
import { parseFaostat, fetchFaostatSeries } from './faostat.mjs';

export function parseUsa(json) {
  return parseFaostat(json);
}

export async function fetchUsaSeries(domain, params) {
  return fetchFaostatSeries(domain, params);
}
```

- [ ] **Step 5: Spusť test — musí projít**

Run: `npx vitest run tests/scripts/svet-usda.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add scripts/lib/svet/usda.mjs tests/scripts/svet-usda.test.ts tests/fixtures/svet/usda-psd-corn.json
git commit -m "feat(svet): USA fetcher přes FAOSTAT (harmonizace)"
```

---

## Task 7: Verifikační brána (sanity check)

**Files:**
- Create: `scripts/lib/svet/verify.mjs`
- Test: `tests/scripts/svet-verify.test.ts`

- [ ] **Step 1: Napiš padající test**

```ts
// tests/scripts/svet-verify.test.ts
import { describe, it, expect } from 'vitest';
import { sanityCheck } from '../../scripts/lib/svet/verify.mjs';

const ind = (over = {}) => ({
  key: 'wheat_yield', label: 'Výnos pšenice', pkg: 'produkce', unit: 't/ha',
  latest: { value: 7.3, unit: 't/ha', referencePeriod: '2024', source: 'Eurostat', sourceUrl: 'x', fetchedAt: '2026-06-19' },
  series: [{ period: '2023', value: 7.1 }, { period: '2024', value: 7.3 }],
  ...over,
});

describe('sanityCheck', () => {
  it('nevrátí žádný problém pro rozumný výnos', () => {
    expect(sanityCheck(ind())).toEqual([]);
  });
  it('označí výnos mimo rozsah (např. 730 t/ha = chyba jednotky)', () => {
    const bad = ind({ latest: { ...ind().latest, value: 730 } });
    expect(sanityCheck(bad).length).toBeGreaterThan(0);
  });
  it('označí když poslední bod řady nesedí s latest.value', () => {
    const bad = ind({ series: [{ period: '2024', value: 1 }] });
    expect(sanityCheck(bad).some((m) => /latest/.test(m))).toBe(true);
  });
});
```

- [ ] **Step 2: Spusť test — musí selhat**

Run: `npx vitest run tests/scripts/svet-verify.test.ts`
Expected: FAIL — modul neexistuje

- [ ] **Step 3: Implementuj**

```js
// scripts/lib/svet/verify.mjs
// Rozumné rozsahy podle jednotky — odchytí chyby jednotek/řádů (UK problém).
const RANGES = {
  't/ha': [0.1, 20],
  'mil. ha': [0, 500],
  'mld €': [0, 2000],
  '1000 ks': [0, 5_000_000],
  '%': [0, 100],
};

/** Vrátí pole textových problémů (prázdné = OK). */
export function sanityCheck(indicator) {
  const problems = [];
  const { latest, series, unit, key } = indicator;
  const range = RANGES[unit];
  if (range && (latest.value < range[0] || latest.value > range[1])) {
    problems.push(`${key}: latest.value ${latest.value} ${unit} mimo rozumný rozsah ${range[0]}–${range[1]}`);
  }
  const lastInSeries = series[series.length - 1];
  if (lastInSeries && Math.abs(lastInSeries.value - latest.value) > Math.abs(latest.value) * 0.001 + 1e-9) {
    problems.push(`${key}: latest.value (${latest.value}) ≠ poslední bod series (${lastInSeries.value})`);
  }
  return problems;
}
```

- [ ] **Step 4: Spusť test — musí projít**

Run: `npx vitest run tests/scripts/svet-verify.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/svet/verify.mjs tests/scripts/svet-verify.test.ts
git commit -m "feat(svet): verifikační sanity brána (rozsahy + konzistence)"
```

---

## Task 8: Orchestrační build skript + npm skript

**Files:**
- Create: `scripts/build-svet.mjs`
- Modify: `package.json` (přidat `data:world`)

- [ ] **Step 1: Implementuj orchestrátor**

```js
// scripts/build-svet.mjs
// Sestaví CountryProfile pro každou zemi: pro každý indikátor zavolá správný fetcher,
// aplikuje scale, vytvoří latest + series, validuje, zapíše src/data/svet/<slug>.json.
import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { COUNTRIES } from './lib/svet/countries.mjs';
import { INDICATORS } from './lib/svet/indicators.mjs';
import { fetchEurostatSeries } from './lib/svet/eurostat.mjs';
import { fetchFaostatSeries } from './lib/svet/faostat.mjs';
import { fetchUsaSeries } from './lib/svet/usda.mjs';
import { sanityCheck } from './lib/svet/verify.mjs';

const OUT_DIR = fileURLToPath(new URL('../src/data/svet/', import.meta.url));
const today = new Date().toISOString().slice(0, 10);
const scaled = (s, k) => s.map((p) => ({ period: p.period, value: Math.round(p.value * (k ?? 1) * 1000) / 1000 }));

async function fetchIndicator(def, country) {
  const { spec } = def;
  if (spec.source === 'eurostat') {
    const { series, url } = await fetchEurostatSeries(spec.dataset, { ...spec.filters, geo: country.geo });
    return { series: scaled(series, spec.scale), url, label: spec.sourceLabel };
  }
  if (spec.source === 'faostat') {
    const { series, url } = await fetchFaostatSeries(spec.domain, { ...spec.params, area: country.faostat });
    return { series: scaled(series, spec.scale), url, label: spec.sourceLabel };
  }
  if (spec.source === 'usda') {
    const { series, url } = await fetchUsaSeries(spec.domain, { ...spec.params, area: country.faostat });
    return { series: scaled(series, spec.scale), url, label: spec.sourceLabel };
  }
  throw new Error(`Neznámý zdroj: ${spec.source}`);
}

async function buildCountry(country) {
  const indicators = {};
  const problems = [];
  for (const def of INDICATORS) {
    try {
      const { series, url, label } = await fetchIndicator(def, country);
      if (!series.length) { problems.push(`${country.slug}/${def.key}: prázdná řada`); continue; }
      const last = series[series.length - 1];
      const ind = {
        key: def.key, label: def.label, pkg: def.pkg, unit: def.unit,
        latest: { value: last.value, unit: def.unit, referencePeriod: last.period, source: label, sourceUrl: url, fetchedAt: today },
        series,
      };
      problems.push(...sanityCheck(ind));
      indicators[def.key] = ind;
    } catch (e) {
      problems.push(`${country.slug}/${def.key}: ${e.message}`);
    }
  }
  return { profile: { slug: country.slug, geo: country.geo, nameCs: country.nameCs, flag: country.flag, generated: today, indicators }, problems };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const allProblems = [];
  const index = [];
  for (const c of COUNTRIES) {
    const { profile, problems } = await buildCountry(c);
    allProblems.push(...problems);
    await writeFile(`${OUT_DIR}${c.slug}.json`, JSON.stringify(profile, null, 2) + '\n');
    index.push({ slug: c.slug, nameCs: c.nameCs, flag: c.flag, indicatorKeys: Object.keys(profile.indicators) });
    console.log(`✓ ${c.slug}: ${Object.keys(profile.indicators).length} indikátorů`);
  }
  await writeFile(`${OUT_DIR}index.json`, JSON.stringify({ generated: today, countries: index }, null, 2) + '\n');
  if (allProblems.length) {
    console.error(`\n⚠ ${allProblems.length} problémů k ověření:`);
    for (const p of allProblems) console.error('  - ' + p);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 2: Přidej npm skript**

V `package.json` do `scripts` přidej:
```json
"data:world": "node scripts/build-svet.mjs",
```

- [ ] **Step 3: Spusť pipeline (síť)**

Run: `npm run data:world`
Expected: vypíše `✓ nemecko: N indikátorů` pro DE/FR/UK; případné problémy se vypíšou na konec. Vznikne `src/data/svet/{nemecko,francie,velka-britanie,index}.json`.

- [ ] **Step 4: Ověř výstup validátorem**

Run:
```bash
npx tsx -e "import {assertCountryProfile} from './src/lib/svet/types.ts'; import {readFileSync} from 'node:fs'; for (const s of ['nemecko','francie','velka-britanie']) { assertCountryProfile(JSON.parse(readFileSync('src/data/svet/'+s+'.json','utf8'))); console.log('OK', s); }"
```
Expected: `OK nemecko` / `OK francie` / `OK velka-britanie` (jinak vyhodí konkrétní chybějící pole).

- [ ] **Step 5: Commit**

```bash
git add scripts/build-svet.mjs package.json src/data/svet/
git commit -m "feat(svet): orchestrátor build-svet + data DE/FR/UK (spine indikátory)"
```

---

## Task 9: Rozšíření na plný set 4 balíčků (recept × N)

**Files:**
- Modify: `scripts/lib/svet/indicators.mjs`
- Create (fixtury): `tests/fixtures/svet/*.json` (1 na nový Eurostat dataset)
- Modify: `tests/scripts/svet-indicators.test.ts`

> Pro **každý** indikátor z cílové tabulky níže zopakuj recept. Drž TDD: fixtura → test parse → přidej do `INDICATORS` → `npm run data:world` → vyřeš problémy z verifikace.

**Recept (1 indikátor):**

- [ ] a) Discovery: `curl` dataset s konkrétními kódy → ulož do `tests/fixtures/svet/<dataset>.json`, vypiš `dimension.<dim>.category.index` a jednotku (jako Task 3 Step 1).
- [ ] b) Přidej assertci do `tests/scripts/svet-indicators.test.ts`, že nový `key` existuje a má správný `pkg` → spusť, selže.
- [ ] c) Přidej položku do `INDICATORS` (dataset/filters/unit/scale/pageUrl) → test projde.
- [ ] d) `npm run data:world` → zkontroluj, že indikátor přibyl všem zemím a verifikace nehlásí problém (jinak oprav scale/unit/filtr).
- [ ] e) Commit: `feat(svet): indikátor <key>`.

**Cílová tabulka indikátorů (Fáze 1 — Eurostat/FAOSTAT):**

| key | balíček | zdroj (dataset) | pozn. |
|---|---|---|---|
| wheat_yield ✅ | produkce | Eurostat apro_cpsh1 | hotovo v Task 5 |
| maize_yield | produkce | Eurostat apro_cpsh1 (crops=C1500) | |
| barley_yield | produkce | Eurostat apro_cpsh1 (crops=C1300) | |
| rapeseed_prod | produkce | Eurostat apro_cpsh1 (crops=R1000, strucpro=PR_HU_EU) | |
| cattle_count | produkce | Eurostat apro_mt_lscatl (animals=A2000) | 1000 ks |
| pigs_count | produkce | Eurostat apro_mt_lspig (animals=A3100) | 1000 ks |
| milk_prod | produkce | Eurostat apro_mk_farm (dairyprod=D1110D) | |
| ag_land ✅ | puda | FAOSTAT RL (5110/6620) | hotovo v Task 5 |
| arable_land | puda | FAOSTAT RL (5110/6621) | |
| farm_count | puda | Eurostat ef_m_farmleg | struktura farem |
| organic_share | puda | Eurostat sdg_02_40 / org_cropar | % UAA |
| ag_output_value | ekonomika | Eurostat aact_eaa01 | mld € |
| ag_gva | ekonomika | Eurostat aact_eaa01 | přidaná hodnota |
| ag_employment | ekonomika | Eurostat aact_ali01 / lfsa | |
| agri_exports | obchod | FAOSTAT TCL (exporty) | |
| agri_imports | obchod | FAOSTAT TCL (importy) | |
| fert_use | obchod | FAOSTAT RFN | hnojiva |

> **POZOR (ověřeno):** `apro_*` datasety mají povinnou dimenzi `freq` → každý eurostat `filters` musí obsahovat `freq: 'A'` (jinak `pickSeries` vrátí 0 bodů). Výnosové kódy jsou `YLD_HUMD_EU_T_HA` (t/ha, scale 1). Crops kódy ověř ve fixtuře (C1100=pšenice, C1500=kukuřice, C1300=ječmen, R1000=řepka).
> Pokud kód/dimenze v reálné fixtuře nesedí, oprav podle výstupu — fixtura je zdroj pravdy. Po doplnění všech zopakuj Task 8 Step 3–4 (full run + validace) a commitni aktualizovaná data.

---

## Task 10: Adversariální verifikace dat (subagent)

**Files:** žádné (kontrolní krok)

- [ ] **Step 1:** Spusť `npm run data:world` a zachyť seznam problémů z verifikace.
- [ ] **Step 2:** Dispatchni subagenta (Explore/general-purpose) s úkolem: pro každý indikátor každé země porovnat `latest.value` + `referencePeriod` proti `sourceUrl` (otevřít zdroj, ověřit řád a období). Vrátit seznam neshod.
- [ ] **Step 3:** Pro každou potvrzenou neshodu oprav `scale`/`filters`/`unit` v `indicators.mjs`, re-run `npm run data:world`, znovu ověř.
- [ ] **Step 4: Commit** případných oprav: `fix(svet): korekce dat dle adversariální verifikace`.

---

## Hotovo, když

- `npx vitest run` zelené (všechny `svet-*` testy).
- `src/data/svet/{nemecko,francie,velka-britanie}.json` + `index.json` existují, projdou `assertCountryProfile`.
- Verifikace (sanity + adversariální) bez nevyřešených problémů.
- `npm run data:world` je idempotentní (re-run přepíše stejná data).

→ Pokračuje **Plán 2 (zobrazení)**: profil země (hybrid Dashboard+vs ČR+úvod), srovnávač, IA `/svet/`, nav, sitemap/hreflang, testy stránek.
