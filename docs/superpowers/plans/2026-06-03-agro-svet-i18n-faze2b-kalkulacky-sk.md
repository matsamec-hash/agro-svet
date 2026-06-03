# Fáze 2b — SK kalkulačky — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Odemknout sekci `/kalkulacka` pro `/sk` — 5 kalkulaček lokalizovaných do slovenštiny, indexovatelných, s € a SK defaulty; `dotace-cap` zůstává jurisdikčně uzamčená.

**Architecture:** Per-kalkulačka co-located i18n modul (`src/i18n/kalkulacka/<slug>.ts`) drží `content: Record<Locale, …>` s `cs`+`sk` slovníky. Stránky se stanou locale-aware přes `Astro.locals.locale` + `content[locale] ?? content.cs`. Server-renderovaný text jde přímo z `c`; interaktivní JS dostane locale stringy/měnu/číselný locale buď přes `define:vars` (inline converter skripty) nebo přes `<script type="application/json">` config element (bundled skripty importující z `lib/`). Gating se prohloubí o úroveň: lock jen `/kalkulacka/dotace-cap`, launch celé `/kalkulacka`.

**Tech Stack:** Astro 6 (SSR middleware + `prerender = true` stránky), TypeScript, vitest, vanilla JS kalkulačky. Node 22 pro build/deploy.

---

## Klíčové soubory (mapa)

**Gating (Task 1):**
- `src/i18n/nav.ts` — `LOCKED_SECTION_PREFIXES` (ubrat `/kalkulacka`, přidat `/kalkulacka/dotace-cap`)
- `src/i18n/utils.ts` — `SK_LAUNCHED_PREFIXES` (přidat `/kalkulacka` — až v Tasku 11)
- `src/middleware.ts` — beze změny (už používá `isLockedSectionPath`); jen ověřit chování

**Sdílená i18n infrastruktura (Task 2):**
- `src/i18n/kalkulacka/types.ts` — sdílené interfaces (`CalcFaq`, `CalcMeta`)
- `src/i18n/kalkulacka/common.ts` — breadcrumb labely (`home`, `hub`) per locale
- `src/i18n/kalkulacka/index.ts` — registry `slug → content` (pro parity test)
- `tests/i18n/kalkulacka.test.ts` — parity klíčů sk↔cs napříč registry

**Komponenty (Task 3):**
- `src/components/AreaConverter.astro` — přidat volitelné locale props (default cs)
- `src/components/WeightConverter.astro` — totéž

**Per-kalkulačka moduly + stránky (Tasks 4–8):**
- `src/i18n/kalkulacka/prevody-jednotek.ts` + `src/pages/kalkulacka/prevody-jednotek/index.astro`
- `src/i18n/kalkulacka/prevody-hmotnost.ts` + `src/pages/kalkulacka/prevody-hmotnost/index.astro`
- `src/i18n/kalkulacka/leasing-traktoru.ts` + `src/pages/kalkulacka/leasing-traktoru/index.astro`
- `src/i18n/kalkulacka/uspora-nafty.ts` + `src/pages/kalkulacka/uspora-nafty/index.astro` + `src/lib/diesel-calc.ts` (přidat volitelný `normaLabels`/`hpUnit`)
- `src/i18n/kalkulacka/naklady-na-hektar.ts` + `src/pages/kalkulacka/naklady-na-hektar/index.astro`

**Hub (Task 9):**
- `src/i18n/kalkulacka/hub.ts` + `src/pages/kalkulacka/index.astro`

**Launch + deploy (Tasks 10–12):**
- `src/i18n/utils.ts` (flip), `tests/i18n/utils.test.ts`, build/smoke, deploy

---

## Glosář CZ→SK (závazný pro všechny SK překlady)

| CZ | SK |
|---|---|
| RPSN | **RPMN** (ročná percentuálna miera nákladov) |
| akontace | akontácia |
| splátka | splátka |
| zůstatková hodnota / balónová splátka | zostatková hodnota / balónová splátka |
| nafta | nafta (motorová nafta) |
| zelená nafta / vratka spotřební daně | zelená nafta / vrátenie spotrebnej dane |
| hektar | hektár |
| náklady na hektar | náklady na hektár |
| výkon plochy | výkon plochy |
| spotřeba | spotreba |
| údržba | údržba |
| obsluha | obsluha |
| orba | orba |
| podmítka / kypření | podmietka / kyprenie |
| setí | sejba |
| postřik | postrek |
| rozmetání hnojiv | rozmetanie hnojív |
| sklizeň obilí | zber obilia |
| sklizeň píce | zber krmovín |
| emisní norma | emisná norma |
| traktor | traktor |
| měsíční splátka | mesačná splátka |
| pořizovací cena | obstarávacia cena |
| měna | mena; **€** místo Kč; číselný locale `sk-SK` |
| koní (k) | koní (**k**) — ponechat symbol „k" |

**Pravidlo „nevymýšľaj":** žádné SK leasingové poskytovatele, žádná konkrétní SK čísla bez zdroje. Univerzální matematika (1 ha = 10 000 m²) je shodná. Ceny přepočítat do € na rozumné SK úrovně (orientačně 1 € ≈ 25 Kč), s tím, že jsou jen výchozí hodnoty, které uživatel přepíše.

---

## Mechanismus předání locale dat do JS (dva vzory)

**Vzor A — inline `define:vars` (converter komponenty):** Skripty `AreaConverter`/`WeightConverter` jsou `<script is:inline define:vars={{ UNITS, … }}>`. Server hodnoty se serializují přímo. Lokalizace = předat lokalizovaná pole/stringy do `define:vars`.

**Vzor B — JSON config element (bundled skripty):** `leasing`, `uspora-nafty`, `naklady` mají `<script>` (bundlovaný TS modul importující z `lib/`). Ten **NEumí** `define:vars` ani server proměnné. Předáme locale data přes:

```astro
<script type="application/json" id="calc-cfg" set:html={JSON.stringify(cfg)}></script>
```

a v bundled skriptu:

```ts
const cfg = JSON.parse(document.getElementById('calc-cfg')!.textContent || '{}');
```

`cfg` obsahuje `currency` (`'CZK'`/`'EUR'`), `numberLocale` (`'cs-CZ'`/`'sk-SK'`) a mapu krátkých JS stringů (`js`). Statické labely (form, výsledkové nadpisy, FAQ) se renderují server-side z `c`, ne přes `cfg`.

---

## Verifikace byte-identity cs (průběžná, Tasks 3–9)

cs výstup kalkulaček se NESMÍ změnit (regression invariant), dokud nepřijde launch (Task 11, kde cs HTML přibere jen `<link hreflang sk>`).

**Baseline (jednou, na čisté pracovní kopii před Taskem 3):**

```bash
cd ~/agro-svet-i18n-obsah
nvm use 22
cp ~/agro-svet/.env .
npm run build
rm -rf /tmp/kalk-cs-baseline && mkdir -p /tmp/kalk-cs-baseline
cp -r dist/kalkulacka /tmp/kalk-cs-baseline/kalkulacka
# converter je embedovaný i ve /slovnik → zachyť i pár slovník stránek
cp -r dist/slovnik /tmp/kalk-cs-baseline/slovnik
```

**Kontrola po každém refactor tasku (3–9):**

```bash
npm run build
diff -r /tmp/kalk-cs-baseline/kalkulacka dist/kalkulacka
diff -r /tmp/kalk-cs-baseline/slovnik dist/slovnik
# Expected: žádný výstup pro cs cesty (dist/kalkulacka/<slug>/index.html beze změny).
# /sk cesty jsou nové soubory (dist/sk/...) — ty diff -r mezi baseline a dist neukáže,
# protože baseline obsahuje jen cs strom. To je OK.
```

> Pozn.: `npm run build` generuje i `dist/sk/kalkulacka/...` jakmile gating pustí SK (Task 1+). Byte-identity se týká jen `dist/kalkulacka/**` (cs). Pokud `diff -r` nahlásí rozdíl v cs souboru, refactor rozbil cs — oprav než commitneš.

---

### Task 1: Gating — odemknout `/kalkulacka`, uzamknout jen `/kalkulacka/dotace-cap`

**Files:**
- Modify: `src/i18n/nav.ts:29` (`LOCKED_SECTION_PREFIXES`)
- Test: `tests/i18n/nav.test.ts`

- [ ] **Step 1: Napiš failing testy gatingu**

Do `tests/i18n/nav.test.ts` přidej nový `describe` blok (na konec souboru, před poslední `});` neřeš — přidej jako samostatný top-level blok):

```ts
import { getNav, getFooterColumns, HIDDEN_SECTIONS, isLockedSectionPath } from '../../src/i18n/nav';

describe('isLockedSectionPath — granularita kalkulaček (Fáze 2b)', () => {
  it('dotace-cap zůstává locked', () => {
    expect(isLockedSectionPath('/kalkulacka/dotace-cap')).toBe(true);
    expect(isLockedSectionPath('/kalkulacka/dotace-cap/')).toBe(true);
  });
  it('ostatní kalkulačky jsou odemčené', () => {
    expect(isLockedSectionPath('/kalkulacka')).toBe(false);
    expect(isLockedSectionPath('/kalkulacka/')).toBe(false);
    expect(isLockedSectionPath('/kalkulacka/prevody-jednotek')).toBe(false);
    expect(isLockedSectionPath('/kalkulacka/leasing-traktoru')).toBe(false);
  });
  it('ostatní jurisdikční sekce zůstávají locked', () => {
    expect(isLockedSectionPath('/dotace')).toBe(true);
    expect(isLockedSectionPath('/statistiky')).toBe(true);
    expect(isLockedSectionPath('/puda/ceny')).toBe(true);
  });
});
```

Uprav existující `import` řádek (`tests/i18n/nav.test.ts:3`) tak, aby zahrnoval `isLockedSectionPath` (pokud už ho neimportuje — momentálně neimportuje).

- [ ] **Step 2: Spusť test — musí selhat**

Run: `nvm use 22 && npx vitest run tests/i18n/nav.test.ts`
Expected: FAIL — `isLockedSectionPath('/kalkulacka/prevody-jednotek')` je momentálně `true` (čeká se `false`).

- [ ] **Step 3: Uprav `LOCKED_SECTION_PREFIXES`**

V `src/i18n/nav.ts` nahraď řádek 29:

```ts
export const LOCKED_SECTION_PREFIXES = ['/dotace', '/statistiky', '/kalkulacka', '/puda'];
```

za:

```ts
export const LOCKED_SECTION_PREFIXES = ['/dotace', '/statistiky', '/kalkulacka/dotace-cap', '/puda'];
```

A uprav komentář nad ním (řádky 26–28), aby odrážel granularitu:

```ts
/** cs-root prefixy CZ-jurisdikčních nástrojů/dat. Pod non-cs locale se NEservírují
 *  jako SK obsah — middleware je přesměruje na cs URL. Kalkulačky jsou převážně
 *  jurisdikčně neutrální (Fáze 2b je odemkla); locked zůstává jen /kalkulacka/dotace-cap
 *  (ryze CZ — SZIF/CAP přímé platby). */
```

- [ ] **Step 4: Spusť testy — musí projít**

Run: `npx vitest run tests/i18n/nav.test.ts`
Expected: PASS (všechny, včetně původních).

- [ ] **Step 5: Commit**

```bash
git add src/i18n/nav.ts tests/i18n/nav.test.ts
git commit -m "feat(i18n): unlock /kalkulacka for SK, lock only dotace-cap"
```

---

### Task 2: Sdílená i18n infrastruktura kalkulaček + parity test harness

**Files:**
- Create: `src/i18n/kalkulacka/types.ts`
- Create: `src/i18n/kalkulacka/common.ts`
- Create: `src/i18n/kalkulacka/index.ts`
- Create: `tests/i18n/kalkulacka.test.ts`

- [ ] **Step 1: Vytvoř `src/i18n/kalkulacka/types.ts`**

```ts
// Sdílené typy pro per-kalkulačka i18n moduly (Fáze 2b).
import type { Locale } from '../config';

export interface CalcFaq {
  q: string;
  a: string;
}

/** Společný základ každé kalkulačky: meta + breadcrumb + FAQ. Konkrétní
 *  kalkulačky rozšiřují o vlastní `labels`/`js`/`currency` pole. */
export interface CalcMeta {
  /** <title> v <Layout title>. */
  title: string;
  /** meta description. */
  metaDescription: string;
  /** H1 nad widgetem. */
  h1: string;
  /** Krátký label v breadcrumbu/heru ("Převody jednotek"). */
  crumb: string;
  /** Kicker nad H1. */
  kicker: string;
  /** Úvodní lede pod H1 (plain text). */
  lede: string;
  faq: CalcFaq[];
}

/** Měnové/číselné nastavení pro finanční kalkulačky. */
export interface CalcCurrency {
  /** ISO kód pro Intl.NumberFormat (style:'currency'). */
  currency: 'CZK' | 'EUR';
  /** BCP-47 locale pro formátování čísel. */
  numberLocale: 'cs-CZ' | 'sk-SK';
}

export type LocaleContent<T> = Record<Locale, T>;

/** Vrátí rekurzivní set "tečkových" cest klíčů objektu — pro parity test.
 *  Pole se porovnávají podle délky (index → klíč). */
export function keyPaths(obj: unknown, prefix = ''): string[] {
  if (Array.isArray(obj)) {
    return obj.flatMap((v, i) => keyPaths(v, `${prefix}[${i}]`));
  }
  if (obj && typeof obj === 'object') {
    return Object.keys(obj)
      .sort()
      .flatMap((k) => keyPaths((obj as Record<string, unknown>)[k], prefix ? `${prefix}.${k}` : k));
  }
  return [prefix];
}
```

- [ ] **Step 2: Vytvoř `src/i18n/kalkulacka/common.ts`**

```ts
// Sdílené breadcrumb labely kalkulaček (Domů / Kalkulačky) per locale.
import type { Locale } from '../config';

export interface CalcCrumbs {
  home: string;
  hub: string;
}

export const crumbs: Record<Locale, CalcCrumbs> = {
  cs: { home: 'Domů', hub: 'Kalkulačky' },
  sk: { home: 'Domov', hub: 'Kalkulačky' },
  uk: { home: 'Домів', hub: 'Калькулятори' },
};
```

- [ ] **Step 3: Vytvoř `src/i18n/kalkulacka/index.ts` (registry, zatím prázdné)**

```ts
// Registry per-kalkulačka i18n modulů. Každá kalkulačka se sem zaregistruje;
// parity test (tests/i18n/kalkulacka.test.ts) přes registry iteruje.
// Moduly se přidávají v Tasks 4–9.
import type { Locale } from '../config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const calcRegistry: Record<string, Record<Locale, unknown>> = {
  // 'prevody-jednotek': prevodyJednotek.content,  ← přidá Task 4
};
```

- [ ] **Step 4: Napiš parity test**

Vytvoř `tests/i18n/kalkulacka.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { calcRegistry } from '../../src/i18n/kalkulacka';
import { keyPaths } from '../../src/i18n/kalkulacka/types';

describe('kalkulačka i18n — parity klíčů sk ↔ cs', () => {
  const slugs = Object.keys(calcRegistry);

  it('registry obsahuje očekávané kalkulačky', () => {
    // Aktualizuje se s každým přidaným modulem; finální stav = 6 (5 calc + hub).
    expect(slugs.length).toBeGreaterThan(0);
  });

  for (const slug of slugs) {
    it(`${slug}: sk má přesně stejné klíče jako cs`, () => {
      const csKeys = keyPaths(calcRegistry[slug].cs);
      const skKeys = keyPaths(calcRegistry[slug].sk);
      expect(skKeys).toEqual(csKeys);
    });
  }
});
```

> Pozn.: `keyPaths` porovnává i délku polí (FAQ musí mít stejný počet položek v cs i sk). To je záměr — chybějící SK FAQ položka = fail.

- [ ] **Step 5: Spusť test**

Run: `nvm use 22 && npx vitest run tests/i18n/kalkulacka.test.ts`
Expected: PASS — `slugs.length` je 0, takže `toBeGreaterThan(0)` selže? Ne — selže. Proto dočasně:

V tomto kroku test selže na prázdném registry. To je OK signál; aby commit prošel CI logiku plánu, **dočasně** v `index.ts` nech registry prázdné a v testu změň `expect(slugs.length).toBeGreaterThan(0)` na `expect(slugs.length).toBeGreaterThanOrEqual(0)`. Po Tasku 4 se vrátí na `> 0`. (Reálně: tento task commitneme až je harness hotový; první modul přijde hned v Tasku 4, takže lze i tasky 2+4 spojit do jednoho commitu. Pro čistotu je necháme oddělené s `>= 0`.)

Uprav řádek v testu:

```ts
    expect(slugs.length).toBeGreaterThanOrEqual(0);
```

Run znovu: `npx vitest run tests/i18n/kalkulacka.test.ts`
Expected: PASS (0 slugů, žádné parity testy, jen sanity check projde).

- [ ] **Step 6: Commit**

```bash
git add src/i18n/kalkulacka/ tests/i18n/kalkulacka.test.ts
git commit -m "feat(i18n): scaffold per-calculator i18n registry + parity test harness"
```

---

### Task 3: Converter komponenty — locale-aware props (default cs, byte-identické)

Cíl: `AreaConverter`/`WeightConverter` přijmou volitelné lokalizační props. Bez nich = dnešní cs chování (důležité — embedované ve `/slovnik`). Calc stránky (Tasks 4–5) jim předají SK stringy.

**Files:**
- Modify: `src/components/AreaConverter.astro`
- Modify: `src/components/WeightConverter.astro`

- [ ] **Step 1: Zachyť byte-identity baseline** (pokud ještě neexistuje — viz sekce „Verifikace byte-identity cs")

```bash
cd ~/agro-svet-i18n-obsah && nvm use 22 && cp ~/agro-svet/.env .
npm run build
rm -rf /tmp/kalk-cs-baseline && mkdir -p /tmp/kalk-cs-baseline
cp -r dist/kalkulacka /tmp/kalk-cs-baseline/kalkulacka
cp -r dist/slovnik /tmp/kalk-cs-baseline/slovnik
```

- [ ] **Step 2: Rozšiř `AreaConverter.astro` Props + lokalizovatelné stringy**

V `src/components/AreaConverter.astro` nahraď `interface Props` + destrukturalizaci + `UNITS` definici (řádky 6–38) tímto. UI stringy a `name` jednotek se nově berou z props s cs defaulty:

```ts
export interface Props {
  defaultUnit?: string;
  defaultValue?: number;
  heading?: string;
  caption?: string;
  headingLevel?: 'h2' | 'h3';
  /** BCP-47 locale pro formátování čísel ve výsledcích. Default 'cs-CZ'. */
  numberLocale?: string;
  /** Lokalizované UI stringy (default = cs). */
  ui?: { inputLabel?: string; unitSelectLabel?: string };
  /** Lokalizované názvy jednotek (id → name). Chybějící klíč → cs default. */
  unitNames?: Record<string, string>;
}

const {
  defaultUnit = 'ha',
  defaultValue = 1,
  heading = 'Převodník jednotek plochy',
  caption,
  headingLevel = 'h2',
  numberLocale = 'cs-CZ',
  ui = {},
  unitNames = {},
} = Astro.props;

const uiText = {
  inputLabel: ui.inputLabel ?? 'Zadej hodnotu',
  unitSelectLabel: ui.unitSelectLabel ?? 'Vyber jednotku',
};

// All factors in m² (square meters). `name` se lokalizuje přes unitNames override.
const UNITS = [
  { id: 'm2', label: 'm²', name: unitNames.m2 ?? 'metr čtvereční', factor: 1, decimals: 2 },
  { id: 'a', label: 'a', name: unitNames.a ?? 'ar', factor: 100, decimals: 4 },
  { id: 'ha', label: 'ha', name: unitNames.ha ?? 'hektar', factor: 10_000, decimals: 6 },
  { id: 'km2', label: 'km²', name: unitNames.km2 ?? 'kilometr čtvereční', factor: 1_000_000, decimals: 8 },
  { id: 'acre', label: 'akr', name: unitNames.acre ?? 'akr (acre)', factor: 4046.8564224, decimals: 5 },
  { id: 'jitro', label: 'jitro', name: unitNames.jitro ?? 'rakouské/české jitro', factor: 5754.642, decimals: 5 },
  { id: 'korec', label: 'korec', name: unitNames.korec ?? 'český korec', factor: 2877.32, decimals: 5 },
  { id: 'strych', label: 'strych', name: unitNames.strych ?? 'český strych', factor: 2877.32, decimals: 5 },
  { id: 'morgen', label: 'morgen', name: unitNames.morgen ?? 'pruský morgen', factor: 2553.2, decimals: 5 },
];

const Heading = headingLevel;
```

Pak nahraď hardcoded UI stringy v markupu:
- řádek `<span class="ac-label">Zadej hodnotu</span>` → `<span class="ac-label">{uiText.inputLabel}</span>`
- `aria-label="Vyber jednotku"` (na `<select>`) → `aria-label={uiText.unitSelectLabel}`

A v inline `<script is:inline define:vars={{ UNITS }}>` (řádek 86) přidej `numberLocale`:

```astro
<script is:inline define:vars={{ UNITS, numberLocale }}>
```

a v `fmt` (řádek ~106) nahraď `.toLocaleString('cs-CZ', …)` za `.toLocaleString(numberLocale, …)`.

> `aria-label="Převodník jednotek plochy"` na `<section>` (ř. 47) a `aria-label` v `recalc` neřeš — zůstávají; pro cs jsou identické, pro sk je section aria nepodstatná (noindex by-pass). Pokud chceš čistotu, můžeš i `<section aria-label>` napojit na `heading`, ale NENÍ nutné a riskuje cs diff — nech být.

- [ ] **Step 3: Rozšiř `WeightConverter.astro` stejným vzorem**

V `src/components/WeightConverter.astro` nahraď `interface Props` + destrukturalizaci + `UNITS` + `COMMODITIES` (řádky 8–44):

```ts
export interface Props {
  defaultUnit?: string;
  defaultValue?: number;
  defaultCommodity?: string;
  heading?: string;
  caption?: string;
  headingLevel?: 'h2' | 'h3';
  numberLocale?: string;
  ui?: { inputLabel?: string; commodityLabel?: string; unitSelectLabel?: string; commoditySelectLabel?: string };
  unitNames?: Record<string, string>;
  commodityNames?: Record<string, string>;
}

const {
  defaultUnit = 't',
  defaultValue = 1,
  defaultCommodity = 'pšenice',
  heading = 'Převodník jednotek hmotnosti',
  caption,
  headingLevel = 'h2',
  numberLocale = 'cs-CZ',
  ui = {},
  unitNames = {},
  commodityNames = {},
} = Astro.props;

const uiText = {
  inputLabel: ui.inputLabel ?? 'Zadej hmotnost',
  commodityLabel: ui.commodityLabel ?? 'Komodita (pro bušl)',
  unitSelectLabel: ui.unitSelectLabel ?? 'Vyber jednotku',
  commoditySelectLabel: ui.commoditySelectLabel ?? 'Vyber komoditu pro bušl',
};

const UNITS = [
  { id: 'kg', label: 'kg', name: unitNames.kg ?? 'kilogram', factor: 1, decimals: 2, commodityDependent: false },
  { id: 'q', label: 'q', name: unitNames.q ?? 'metrický cent', factor: 100, decimals: 4, commodityDependent: false },
  { id: 't', label: 't', name: unitNames.t ?? 'tuna', factor: 1000, decimals: 5, commodityDependent: false },
  { id: 'lb', label: 'lb', name: unitNames.lb ?? 'libra (pound)', factor: 0.45359237, decimals: 3, commodityDependent: false },
  { id: 'bu', label: 'bu', name: unitNames.bu ?? 'bušl (bushel)', factor: 0, decimals: 4, commodityDependent: true },
];

const COMMODITIES = [
  { id: 'wheat', label: commodityNames.wheat ?? 'pšenice', buKg: 27.2155 },
  { id: 'corn', label: commodityNames.corn ?? 'kukuřice', buKg: 25.4012 },
  { id: 'soy', label: commodityNames.soy ?? 'sója', buKg: 27.2155 },
  { id: 'barley', label: commodityNames.barley ?? 'ječmen', buKg: 21.7724 },
  { id: 'oats', label: commodityNames.oats ?? 'oves', buKg: 14.5150 },
  { id: 'rye', label: commodityNames.rye ?? 'žito', buKg: 25.4012 },
  { id: 'canola', label: commodityNames.canola ?? 'řepka (canola)', buKg: 22.6796 },
];

const Heading = headingLevel;
```

> **Pozor — `defaultCommodity` matching:** markup vybírá selected option přes `c.label === defaultCommodity` (ř. 82). Protože `label` je teď lokalizovaný, musí volající (calc stránka) předat `defaultCommodity` ve STEJNÉM jazyce jako `commodityNames` (tj. SK „pšenica"). Pro cs default zůstává `'pšenice'` == cs label → byte-identické. Zdokumentuj to v SK calc stránce (Task 5).

Nahraď hardcoded UI stringy v markupu:
- `<span class="wc-label">Zadej hmotnost</span>` → `{uiText.inputLabel}`
- `<span class="wc-label">Komodita (pro bušl)</span>` → `{uiText.commodityLabel}`
- `aria-label="Vyber jednotku"` → `aria-label={uiText.unitSelectLabel}`
- `aria-label="Vyber komoditu pro bušl"` → `aria-label={uiText.commoditySelectLabel}`

A `<script is:inline define:vars={{ UNITS, COMMODITIES }}>` (ř. 101) → přidej `numberLocale`:

```astro
<script is:inline define:vars={{ UNITS, COMMODITIES, numberLocale }}>
```

a v `fmt` nahraď `'cs-CZ'` za `numberLocale`. Pozor: `c.buKg.toFixed(2).replace('.', ',')` v option (ř. 82) ponech — desetinná čárka je správná pro cs i sk.

- [ ] **Step 4: tsc + build + byte-identity**

```bash
npx tsc --noEmit
npx vitest run
npm run build
diff -r /tmp/kalk-cs-baseline/kalkulacka dist/kalkulacka
diff -r /tmp/kalk-cs-baseline/slovnik dist/slovnik
```
Expected: `tsc` 0 chyb, vitest zelené, **oba `diff -r` bez výstupu** (cs converter výstup beze změny, protože props defaulty == staré hardcoded hodnoty).

> Pokud diff ukáže rozdíl: nejčastější příčina = překlep v defaultu (`name`/UI string) oproti původní hodnotě. Sjednoť přesně se starým zněním.

- [ ] **Step 5: Commit**

```bash
git add src/components/AreaConverter.astro src/components/WeightConverter.astro
git commit -m "refactor(calc): make AreaConverter/WeightConverter locale-aware (cs defaults, byte-identical)"
```

---

### Task 4: `prevody-jednotek` — i18n modul + locale-aware stránka

**Files:**
- Create: `src/i18n/kalkulacka/prevody-jednotek.ts`
- Modify: `src/i18n/kalkulacka/index.ts` (register)
- Modify: `tests/i18n/kalkulacka.test.ts` (vrátit `> 0`)
- Modify: `src/pages/kalkulacka/prevody-jednotek/index.astro`

- [ ] **Step 1: Vytvoř i18n modul** `src/i18n/kalkulacka/prevody-jednotek.ts`

cs hodnoty = doslovná extrakce ze stávající stránky; sk = překlad dle glosáře. (Referenční tabulka + „K čemu jsou jednotky" karty jsou silně CZ-specifické — historické jednotky, slovník odkazy; pro SK je necháme jako lokalizovaný blok textů. Tabulky čísel jsou univerzální.)

```ts
import type { Locale } from '../config';
import type { CalcFaq, CalcMeta } from './types';

export interface PrevodyJednotekContent extends CalcMeta {
  /** Caption pod converterem. */
  converterHeading: string;
  converterCaption: string;
  ui: { inputLabel: string; unitSelectLabel: string };
  unitNames: Record<string, string>;
  numberLocale: 'cs-CZ' | 'sk-SK';
}

export const content: Record<Locale, PrevodyJednotekContent> = {
  cs: {
    title: 'Převody jednotek plochy — hektar, ar, m², akr, jitro, korec',
    metaDescription:
      'Online kalkulačka pro převody jednotek plochy: hektar ↔ ar ↔ m² ↔ km² ↔ akr ↔ jitro ↔ korec ↔ strych ↔ morgen. Okamžitý výpočet, vhodné pro zemědělce, geodety i katastr.',
    h1: 'Převody jednotek plochy',
    crumb: 'Převody jednotek',
    kicker: 'Kalkulačka · jednotky a měření',
    lede:
      'Zadej hodnotu v libovolné jednotce a okamžitě uvidíš převod do všech ostatních — hektary, ary, metry čtvereční, akry i historické české jednotky (jitro, korec, strych) a pruský morgen. Kalkulačka funguje bez registrace, čísla se počítají v prohlížeči.',
    converterHeading: 'Online převodník jednotek plochy',
    converterCaption:
      'Tip: klikni do pole s hodnotou a piš — všechny převody se aktualizují živě. Pro starší jednotky (jitro, korec, strych) jsou použité standardizované hodnoty z roku 1764, regionální varianty se mohly mírně lišit.',
    ui: { inputLabel: 'Zadej hodnotu', unitSelectLabel: 'Vyber jednotku' },
    unitNames: {
      m2: 'metr čtvereční', a: 'ar', ha: 'hektar', km2: 'kilometr čtvereční',
      acre: 'akr (acre)', jitro: 'rakouské/české jitro', korec: 'český korec',
      strych: 'český strych', morgen: 'pruský morgen',
    },
    numberLocale: 'cs-CZ',
    faq: [
      { q: 'Kolik je 1 hektar v m² a arech?', a: '1 hektar (ha) = 10 000 m² = 100 arů (a) = 0,01 km². Hektar je čtverec o straně 100 × 100 metrů. V zemědělství je hektar standardní jednotka pro výměru polí, dotace na hektar i výnosy plodin (t/ha).' },
      { q: 'Kolik m² je 1 ar?', a: '1 ar (a) = 100 m² = čtverec 10 × 10 m = 0,01 hektaru. 100 arů tvoří jeden hektar. Ar se v ČR používá hlavně pro výměru zahrad, malých parcel a v katastrálních zápisech.' },
      { q: 'Kolik je 1 akr v hektarech?', a: '1 akr (acre) = 4 046,86 m² = 0,4047 hektaru = přibližně 40,5 aru. Akr je anglosaská jednotka používaná v USA, UK, Kanadě a Austrálii. Pro převod akrů na hektary vynásob hodnotu číslem 0,4047.' },
      { q: 'Jak převést bušly na tuny z hektaru?', a: 'Záleží na komoditě. Pro pšenici a sóju: bu/ac × 0,0673 = t/ha. Pro kukuřici: bu/ac × 0,0628 = t/ha. Příklad: 175 bu/ac kukuřice ≈ 11 t/ha. CBOT publikuje US výnosy v bušlech na akr, EU v t/ha.' },
      { q: 'Co je jitro, korec a strych? Jak velké jsou?', a: 'Historické české jednotky plochy z doby před metrickou reformou (1919). Standardizované hodnoty z roku 1764: rakouské/české jitro = 0,5755 ha (5 754 m²), pražský korec = strych = 0,288 ha (2 877 m²). Stále se objevují v katastrálních zápisech a rodinné paměti.' },
      { q: 'Proč existuje hektolitrová váha obilí?', a: 'Hektolitrová váha (kg/hl) je kvalitativní parametr — hmotnost 100 litrů obilí. Vyšší hl váha = vyšší obsah škrobu/oleje, lepší mlynářská kvalita. Pšenice 78+ kg/hl = potravinářská třída, < 74 kg/hl = krmná. Rozdíl ceny může být 1500+ Kč/t.' },
    ],
  },
  sk: {
    title: 'Prevody jednotiek plochy — hektár, ár, m², aker, jitro, korec',
    metaDescription:
      'Online kalkulačka na prevody jednotiek plochy: hektár ↔ ár ↔ m² ↔ km² ↔ aker ↔ jitro ↔ korec ↔ strych ↔ morgen. Okamžitý výpočet, vhodné pre poľnohospodárov, geodetov aj kataster.',
    h1: 'Prevody jednotiek plochy',
    crumb: 'Prevody jednotiek',
    kicker: 'Kalkulačka · jednotky a meranie',
    lede:
      'Zadaj hodnotu v ľubovoľnej jednotke a okamžite uvidíš prevod do všetkých ostatných — hektáre, áre, metre štvorcové, akre aj historické jednotky (jitro, korec, strych) a pruský morgen. Kalkulačka funguje bez registrácie, čísla sa počítajú v prehliadači.',
    converterHeading: 'Online prevodník jednotiek plochy',
    converterCaption:
      'Tip: klikni do poľa s hodnotou a píš — všetky prevody sa aktualizujú naživo. Pre staršie jednotky (jitro, korec, strych) sú použité štandardizované hodnoty z roku 1764, regionálne varianty sa mohli mierne líšiť.',
    ui: { inputLabel: 'Zadaj hodnotu', unitSelectLabel: 'Vyber jednotku' },
    unitNames: {
      m2: 'meter štvorcový', a: 'ár', ha: 'hektár', km2: 'kilometer štvorcový',
      acre: 'aker (acre)', jitro: 'rakúsko-uhorské jitro', korec: 'korec',
      strych: 'strych', morgen: 'pruský morgen',
    },
    numberLocale: 'sk-SK',
    faq: [
      { q: 'Koľko je 1 hektár v m² aároch?', a: '1 hektár (ha) = 10 000 m² = 100 árov (a) = 0,01 km². Hektár je štvorec so stranou 100 × 100 metrov. V poľnohospodárstve je hektár štandardná jednotka na výmeru polí, dotácie na hektár aj výnosy plodín (t/ha).' },
      { q: 'Koľko m² je 1 ár?', a: '1 ár (a) = 100 m² = štvorec 10 × 10 m = 0,01 hektára. 100 árov tvorí jeden hektár. Ár sa používa najmä na výmeru záhrad, malých parciel a v katastrálnych zápisoch.' },
      { q: 'Koľko je 1 aker v hektároch?', a: '1 aker (acre) = 4 046,86 m² = 0,4047 hektára = približne 40,5 ára. Aker je anglosaská jednotka používaná v USA, UK, Kanade a Austrálii. Na prevod akrov na hektáre vynásob hodnotu číslom 0,4047.' },
      { q: 'Ako previesť bušly na tony z hektára?', a: 'Závisí od komodity. Pre pšenicu a sóju: bu/ac × 0,0673 = t/ha. Pre kukuricu: bu/ac × 0,0628 = t/ha. Príklad: 175 bu/ac kukurice ≈ 11 t/ha. CBOT publikuje US výnosy v bušloch na aker, EÚ v t/ha.' },
      { q: 'Čo je jitro, korec a strych? Aké sú veľké?', a: 'Historické jednotky plochy z čias pred metrickou reformou. Štandardizované hodnoty z roku 1764: rakúsko-uhorské jitro = 0,5755 ha (5 754 m²), korec = strych = 0,288 ha (2 877 m²). Stále sa objavujú v starších katastrálnych zápisoch a rodinnej pamäti.' },
      { q: 'Prečo existuje hektolitrová hmotnosť obilia?', a: 'Hektolitrová hmotnosť (kg/hl) je kvalitatívny parameter — hmotnosť 100 litrov obilia. Vyššia hl hmotnosť = vyšší obsah škrobu/oleja, lepšia mlynárska kvalita. Pšenica 78+ kg/hl = potravinárska trieda, < 74 kg/hl = kŕmna. Rozdiel ceny môže byť výrazný.' },
    ],
  },
  uk: {} as PrevodyJednotekContent, // Fáze 3 — zatím fallback na cs v stránce
};
```

> **uk:** ve Fázi 2b není uk launchnuté; stránka použije `content[locale] ?? content.cs`, takže `uk` se nikdy nepoužije jako index. Prázdný `{}` cast je OK pro typecheck; stránka má `?? content.cs` fallback. (Parity test porovnává jen sk↔cs, uk neřeší.)

- [ ] **Step 2: Zaregistruj v `src/i18n/kalkulacka/index.ts`**

```ts
import type { Locale } from '../config';
import { content as prevodyJednotek } from './prevody-jednotek';

export const calcRegistry: Record<string, Record<Locale, unknown>> = {
  'prevody-jednotek': prevodyJednotek,
};
```

A v `tests/i18n/kalkulacka.test.ts` vrať `expect(slugs.length).toBeGreaterThan(0);`.

- [ ] **Step 3: Spusť parity test — musí projít**

Run: `nvm use 22 && npx vitest run tests/i18n/kalkulacka.test.ts`
Expected: PASS — `prevody-jednotek: sk má přesně stejné klíče jako cs`. Pokud FAIL na parity, sk slovník má jiný počet FAQ nebo chybí klíč → srovnej.

- [ ] **Step 4: Udělej stránku locale-aware**

V `src/pages/kalkulacka/prevody-jednotek/index.astro` přepiš frontmatter (řádky 1–43) tak, aby četl `content[locale]`. Klíčová změna: import modulu + `common`, výběr `c`, breadcrumb/Layout/converter z `c`. Tabulky a context karty (řádky 80–187 v body) jsou CZ-specifické — pro SK je necháme renderovat z cs (jsou převážně univerzální čísla); aby zůstaly indexovatelně-konzistentní, **ponecháme je beze změny** (cs text). To je vědomý kompromis: hlavní lokalizovaný obsah = meta, H1, lede, converter, FAQ; referenční tabulky čísel jsou jazykově neutrální.

Nový frontmatter:

```astro
---
export const prerender = true;
import Layout from '../../../layouts/Layout.astro';
import { breadcrumbSchema, faqPageSchema } from '../../../lib/structured-data';
import { SITE_URL } from '../../../lib/config';
import AreaConverter from '../../../components/AreaConverter.astro';
import { content } from '../../../i18n/kalkulacka/prevody-jednotek';
import { crumbs } from '../../../i18n/kalkulacka/common';

const locale = Astro.locals.locale ?? 'cs';
const c = content[locale] ?? content.cs;
const cr = crumbs[locale] ?? crumbs.cs;

const canonical = `${SITE_URL}/kalkulacka/prevody-jednotek/`;

const faqItems = c.faq;

const breadcrumbJsonLd = breadcrumbSchema([
  { name: cr.home, url: '/' },
  { name: cr.hub, url: '/kalkulacka/' },
  { name: c.crumb, url: canonical },
]);
const faqJsonLd = faqPageSchema(faqItems);
---
```

> `canonical` necháváme cs-root URL (`/kalkulacka/...`) — `Layout` si lokalizovanou kanonickou cestu poskládá z `localizedPathname` (viz Layout.astro:60–64). Pozor: aktuálně stránka předává `canonical={canonical}` natvrdo, což přebije Layout logiku. Pro SK by to dalo cs canonical na /sk stránce — ŠPATNĚ. **Oprava: NEPŘEDÁVEJ `canonical` do Layoutu** — nech Layout odvodit kanonickou cestu z `localizedPathname` (správně dá `/sk/kalkulacka/...` pro sk). Tj. v `<Layout>` smaž atribut `canonical`. JSON-LD breadcrumb necháme na cs-root `canonical` proměnné (schema URL nemusí být locale-přesné, ale lepší je localizedPath — pro jednoduchost ponech cs-root, neindexuje se jako problém).

Uprav `<Layout>` otevírací tag (řádky 45–49):

```astro
<Layout
  title={c.title}
  description={c.metaDescription}
>
```

(odebrán `canonical={canonical}` — viz pozn. výše).

Uprav viditelný breadcrumb (řádky 53–60):

```astro
    <nav class="breadcrumb" aria-label="Cesta">
      <a href={locale === 'cs' ? '/' : `/${locale}/`}>{cr.home}</a>
      <span class="sep" aria-hidden="true">›</span>
      <a href={locale === 'cs' ? '/kalkulacka/' : `/${locale}/kalkulacka/`}>{cr.hub}</a>
      <span class="sep" aria-hidden="true">›</span>
      <span class="current">{c.crumb}</span>
    </nav>
```

Uprav hero (řádky 62–70):

```astro
    <header class="hero">
      <span class="kicker">{c.kicker}</span>
      <h1>{c.h1}</h1>
      <p class="hero-lede">{c.lede}</p>
    </header>
```

Uprav `<AreaConverter>` (řádky 72–78):

```astro
    <AreaConverter
      defaultUnit="ha"
      defaultValue={1}
      heading={c.converterHeading}
      caption={c.converterCaption}
      headingLevel="h2"
      numberLocale={c.numberLocale}
      ui={c.ui}
      unitNames={c.unitNames}
    />
```

FAQ sekce (řádky 189–197) už používá `faqItems` → automaticky lokalizovaná. Tabulky/context karty/related (řádky 80–208) ponech beze změny (cs text, univerzální).

> **Reference tabulky/karty zůstávají cs i na /sk** — vědomě (čísla jsou jazykově neutrální, lokalizace by jen nafoukla modul). Pokud bude později potřeba, lze je přidat do modulu. Pro tuto fázi mimo rozsah.

- [ ] **Step 5: tsc + build + byte-identity + smoke**

```bash
npx tsc --noEmit && npx vitest run
npm run build
diff -r /tmp/kalk-cs-baseline/kalkulacka/prevody-jednotek dist/kalkulacka/prevody-jednotek
ls dist/sk/kalkulacka/prevody-jednotek/index.html && echo "SK page exists"
grep -c 'Prevody jednotiek plochy' dist/sk/kalkulacka/prevody-jednotek/index.html
```
Expected: tsc 0, vitest zelené, `diff` cs **bez výstupu** (cs stránka se nezměnila — `canonical` odebrání nemění cs, protože Layout odvodí stejnou cs URL), SK stránka existuje a obsahuje SK H1.

> Pokud cs `diff` ukáže rozdíl kvůli odebrání `canonical`: zkontroluj, že Layout pro cs odvodí přesně `https://agro-svet.cz/kalkulacka/prevody-jednotek/` (mělo by — `localizedPathname` = `/kalkulacka/prevody-jednotek/`, `canonicalPath` přidá trailing slash). Pokud se liší jen v `canonical`/`og:url`, je to přijatelná cs změna POUZE pokud je identická — jinak vrať `canonical={canonical}` jen pro cs: `canonical={locale === 'cs' ? canonical : undefined}`.

- [ ] **Step 6: Commit**

```bash
git add src/i18n/kalkulacka/ tests/i18n/kalkulacka.test.ts src/pages/kalkulacka/prevody-jednotek/index.astro
git commit -m "feat(calc): localize prevody-jednotek for SK"
```

---

### Task 5: `prevody-hmotnost` — i18n modul + locale-aware stránka

**Files:**
- Create: `src/i18n/kalkulacka/prevody-hmotnost.ts`
- Modify: `src/i18n/kalkulacka/index.ts`
- Modify: `src/pages/kalkulacka/prevody-hmotnost/index.astro`

- [ ] **Step 1: Vytvoř modul** `src/i18n/kalkulacka/prevody-hmotnost.ts`

Nejdřív si přečti aktuální `src/pages/kalkulacka/prevody-hmotnost/index.astro` a extrahuj přesné cs FAQ + lede + converter caption (analogicky k Tasku 4 — soubor má FAQ pole, hero lede, `<WeightConverter heading caption>`). Pak:

```ts
import type { Locale } from '../config';
import type { CalcMeta } from './types';

export interface PrevodyHmotnostContent extends CalcMeta {
  converterHeading: string;
  converterCaption: string;
  defaultCommodity: string; // MUSÍ se shodovat s lokalizovaným commodityNames.wheat
  ui: { inputLabel: string; commodityLabel: string; unitSelectLabel: string; commoditySelectLabel: string };
  unitNames: Record<string, string>;
  commodityNames: Record<string, string>;
  numberLocale: 'cs-CZ' | 'sk-SK';
}

export const content: Record<Locale, PrevodyHmotnostContent> = {
  cs: {
    title: /* doslovně z <Layout title> stávající stránky */ '',
    metaDescription: /* z <Layout description> */ '',
    h1: /* z <h1> */ '',
    crumb: 'Převody hmotnosti',
    kicker: /* z .kicker */ '',
    lede: /* z .hero-lede */ '',
    converterHeading: /* z <WeightConverter heading> */ '',
    converterCaption: /* z <WeightConverter caption> */ '',
    defaultCommodity: 'pšenice',
    ui: {
      inputLabel: 'Zadej hmotnost', commodityLabel: 'Komodita (pro bušl)',
      unitSelectLabel: 'Vyber jednotku', commoditySelectLabel: 'Vyber komoditu pro bušl',
    },
    unitNames: { kg: 'kilogram', q: 'metrický cent', t: 'tuna', lb: 'libra (pound)', bu: 'bušl (bushel)' },
    commodityNames: { wheat: 'pšenice', corn: 'kukuřice', soy: 'sója', barley: 'ječmen', oats: 'oves', rye: 'žito', canola: 'řepka (canola)' },
    numberLocale: 'cs-CZ',
    faq: [ /* doslovná extrakce všech cs FAQ položek ze stránky */ ],
  },
  sk: {
    title: 'Prevody jednotiek hmotnosti — tona, cent, kilogram, libra, bušel',
    metaDescription:
      'Online kalkulačka na prevody jednotiek hmotnosti: tona, metrický cent, kilogram, libra a bušel (pšenica, kukurica, sója) — pre výkup, CBOT futures a porovnanie US/EÚ výnosov.',
    h1: 'Prevody jednotiek hmotnosti',
    crumb: 'Prevody hmotnosti',
    kicker: 'Kalkulačka · jednotky a meranie',
    lede: /* SK preklad cs lede dle glosáře */ '',
    converterHeading: 'Online prevodník jednotiek hmotnosti',
    converterCaption: /* SK preklad cs caption */ '',
    defaultCommodity: 'pšenica',
    ui: {
      inputLabel: 'Zadaj hmotnosť', commodityLabel: 'Komodita (pre bušel)',
      unitSelectLabel: 'Vyber jednotku', commoditySelectLabel: 'Vyber komoditu pre bušel',
    },
    unitNames: { kg: 'kilogram', q: 'metrický cent', t: 'tona', lb: 'libra (pound)', bu: 'bušel (bushel)' },
    commodityNames: { wheat: 'pšenica', corn: 'kukurica', soy: 'sója', barley: 'jačmeň', oats: 'ovos', rye: 'raž', canola: 'repka (canola)' },
    numberLocale: 'sk-SK',
    faq: [ /* SK preklad každé cs FAQ položky, STEJNÝ počet */ ],
  },
  uk: {} as PrevodyHmotnostContent,
};
```

> **DŮLEŽITÉ:** `defaultCommodity` (sk = `'pšenica'`) se musí shodovat s `commodityNames.wheat` (sk = `'pšenica'`), jinak se v `<select>` nevybere výchozí option (WeightConverter matchuje přes label). Pro cs `'pšenice' === commodityNames.wheat`. Ověř.
> SK FAQ a lede prózu napiš dle glosáře; bušel SK = „bušel". Zachovej STEJNÝ počet FAQ položek jako cs (parity test to vynutí).

- [ ] **Step 2: Registruj + parity test**

`src/i18n/kalkulacka/index.ts`:

```ts
import { content as prevodyHmotnost } from './prevody-hmotnost';
// …
export const calcRegistry: Record<string, Record<Locale, unknown>> = {
  'prevody-jednotek': prevodyJednotek,
  'prevody-hmotnost': prevodyHmotnost,
};
```

Run: `npx vitest run tests/i18n/kalkulacka.test.ts` → Expected: PASS (oba sluggy, parity OK).

- [ ] **Step 3: Locale-aware stránka** (vzor z Tasku 4)

V `src/pages/kalkulacka/prevody-hmotnost/index.astro`:
- frontmatter: importuj `content` z `prevody-hmotnost` + `crumbs`, vyber `locale`/`c`/`cr`, `faqItems = c.faq`, breadcrumb JSON-LD z `cr`/`c`.
- `<Layout title={c.title} description={c.metaDescription}>` (odeber natvrdo `canonical`, viz pozn. v Tasku 4 Step 4).
- breadcrumb + hero z `c`/`cr` (locale-aware hrefy jako v Tasku 4).
- `<WeightConverter heading={c.converterHeading} caption={c.converterCaption} defaultCommodity={c.defaultCommodity} numberLocale={c.numberLocale} ui={c.ui} unitNames={c.unitNames} commodityNames={c.commodityNames} … />`
- FAQ a ostatní univerzální tabulky/odkazy ponech (cs text mimo rozsah lokalizace).

- [ ] **Step 4: tsc + build + byte-identity + smoke**

```bash
npx tsc --noEmit && npx vitest run
npm run build
diff -r /tmp/kalk-cs-baseline/kalkulacka/prevody-hmotnost dist/kalkulacka/prevody-hmotnost
grep -c 'Prevody jednotiek hmotnosti' dist/sk/kalkulacka/prevody-hmotnost/index.html
```
Expected: cs diff bez výstupu; SK stránka obsahuje SK H1.

- [ ] **Step 5: Commit**

```bash
git add src/i18n/kalkulacka/ src/pages/kalkulacka/prevody-hmotnost/index.astro
git commit -m "feat(calc): localize prevody-hmotnost for SK"
```

---

### Task 6: `leasing-traktoru` — i18n modul + locale-aware stránka + SK bez poskytovatelů + € bridge

**Files:**
- Create: `src/i18n/kalkulacka/leasing-traktoru.ts`
- Modify: `src/i18n/kalkulacka/index.ts`
- Modify: `src/pages/kalkulacka/leasing-traktoru/index.astro`

Klíčové: SK varianta **vypustí celou sekci „Srovnání poskytovatelů"** (CZ leasingovky) a nechá jen univerzální anuitní kalkulačku. cs zůstává s poskytovateli. Currency `CZK`→`EUR`, číselný locale, default cena přepočítaná do €.

- [ ] **Step 1: Vytvoř modul** `src/i18n/kalkulacka/leasing-traktoru.ts`

```ts
import type { Locale } from '../config';
import type { CalcFaq, CalcMeta, CalcCurrency } from './types';

export interface LeasingProvider { id: string; name: string; apr: number; note: string }

export interface LeasingContent extends CalcMeta, CalcCurrency {
  /** Form labely. */
  form: {
    price: string; downpayment: string; months: string; residual: string;
    monthsUnit: string; // "měsíců" / "mesiacov"
  };
  /** Výsledkové labely (server-rendered). */
  result: {
    headline: string; financed: string; total: string; interest: string; usedRate: string;
  };
  /** JS stringy předané přes config element. */
  js: {
    downHintPrefix: string;   // "= "
    residualSuffix: string;   // " na konci" / " na konci"
    noResidual: string;       // "Bez balónové splátky"
    perAnnum: string;         // " % p.a."
    bestSuffix: string;       // " ★ nejnižší" (jen cs, sk prázdné — viz pozn.)
  };
  /** cross-CTA blok. */
  cta: { kicker: string; heading: string; catalog: string; compare: string; costs: string };
  /** Poskytovatelé — jen cs; sk = [] (sekce se nezobrazí). */
  providers: LeasingProvider[];
  /** Texty sekce poskytovatelů — jen cs relevantní. */
  providerSection: { heading: string; lede: string; thProvider: string; thRate: string; thMonthly: string; thTotal: string; disclaimer: string } | null;
}

export const content: Record<Locale, LeasingContent> = {
  cs: {
    title: 'Kalkulačka leasingu traktoru — měsíční splátka a srovnání 2026',
    metaDescription:
      'Spočítejte měsíční splátku, celkové přeplacení a RPSN leasingu traktoru. Srovnání ČSOB Leasing, John Deere Financial, AGRI CS a AGROTEC.',
    h1: 'Kalkulačka leasingu traktoru',
    crumb: 'Leasing traktoru',
    kicker: 'Kalkulačka · financování',
    lede:
      'Zadejte cenu stroje, akontaci a dobu splácení. Spočítáme měsíční splátku, celkové přeplacení a porovnáme orientační nabídky čtyř poskytovatelů. Výsledky jsou orientační — finální nabídku vždy ověřte přímo u leasingové společnosti.',
    currency: 'CZK',
    numberLocale: 'cs-CZ',
    form: { price: 'Pořizovací cena stroje', downpayment: 'Akontace', months: 'Doba splácení', residual: 'Zůstatková hodnota (balónová splátka)', monthsUnit: 'měsíců' },
    result: { headline: 'Měsíční splátka (orientačně)', financed: 'Financovaná částka', total: 'Celkem zaplaceno', interest: 'Přeplaceno na úrocích', usedRate: 'Použitá sazba' },
    js: { downHintPrefix: '= ', residualSuffix: ' na konci', noResidual: 'Bez balónové splátky', perAnnum: ' % p.a.', bestSuffix: ' ★ nejnižší' },
    cta: { kicker: 'Ještě nevíte, který stroj?', heading: 'Projděte katalog traktorů nebo si dva modely porovnejte', catalog: 'Katalog traktorů', compare: 'Srovnání modelů', costs: 'Náklady na hektar' },
    providers: [
      { id: 'csob', name: 'ČSOB Leasing', apr: 6.9, note: 'Univerzální poskytovatel, financuje všechny značky.' },
      { id: 'jd', name: 'John Deere Financial', apr: 5.9, note: 'Captive financování — akční sazby na nové John Deere stroje.' },
      { id: 'agri-cs', name: 'AGRI CS Finance', apr: 7.5, note: 'Dealer financování pro Case IH, Steyr.' },
      { id: 'agrotec', name: 'AGROTEC FS', apr: 7.2, note: 'Financování New Holland přes dealerskou síť.' },
    ],
    providerSection: {
      heading: 'Srovnání poskytovatelů',
      lede: 'Stejné parametry, různé orientační sazby. Captive financování výrobců (John Deere, AGROTEC) bývá levnější na nových strojích dané značky, univerzální poskytovatelé jsou flexibilnější u ojetých.',
      thProvider: 'Poskytovatel', thRate: 'Sazba p.a.', thMonthly: 'Měsíční splátka', thTotal: 'Celkem zaplaceno',
      disclaimer: 'Sazby jsou orientační odhady pro rok 2026 a slouží pouze ke srovnání. Skutečná nabídka závisí na bonitě, výši akontace, zůstatkové hodnotě a aktuálních akčních kampaních. Agro-svět.cz není zprostředkovatel financování.',
    },
    faq: [
      { q: 'Jak se počítá měsíční splátka leasingu?', a: 'Splátka se počítá anuitní metodou — z financované částky (cena stroje minus akontace) se rozpočítá jistina a úrok rovnoměrně na celou dobu splácení. Vyšší akontace i kratší doba snižují celkové přeplacení, ale zvyšují měsíční zatížení.' },
      { q: 'Jaká je obvyklá akontace u leasingu zemědělské techniky?', a: 'Obvyklá akontace se pohybuje mezi 10 a 30 % z pořizovací ceny. Vyšší akontace snižuje úrokové náklady i riziko pro poskytovatele, takže často znamená i nižší sazbu.' },
      { q: 'Co je RPSN a proč je důležité?', a: 'RPSN (roční procentní sazba nákladů) zahrnuje kromě úroku i poplatky za uzavření a vedení smlouvy. Je to nejlepší ukazatel pro srovnání nabídek různých poskytovatelů — nižší RPSN znamená levnější financování.' },
      { q: 'Vyplatí se captive financování od výrobce?', a: 'Captive financování (John Deere Financial, AGROTEC FS) často nabízí akční sazby na nové stroje dané značky, které bankovní leasing nedokáže nabídnout. U ojetých strojů nebo cross-brand nákupu bývá univerzální poskytovatel flexibilnější.' },
    ],
  },
  sk: {
    title: 'Kalkulačka leasingu traktora — mesačná splátka a RPMN',
    metaDescription:
      'Vypočítajte mesačnú splátku, celkové preplatenie a RPMN leasingu traktora. Anuitná metóda — zadajte cenu stroja, akontáciu a dobu splácania.',
    h1: 'Kalkulačka leasingu traktora',
    crumb: 'Leasing traktora',
    kicker: 'Kalkulačka · financovanie',
    lede:
      'Zadajte cenu stroja, akontáciu a dobu splácania. Vypočítame mesačnú splátku, celkové preplatenie a úroky anuitnou metódou. Výsledky sú orientačné — finálnu ponuku vždy overte priamo u leasingovej spoločnosti.',
    currency: 'EUR',
    numberLocale: 'sk-SK',
    form: { price: 'Obstarávacia cena stroja', downpayment: 'Akontácia', months: 'Doba splácania', residual: 'Zostatková hodnota (balónová splátka)', monthsUnit: 'mesiacov' },
    result: { headline: 'Mesačná splátka (orientačne)', financed: 'Financovaná suma', total: 'Spolu zaplatené', interest: 'Preplatené na úrokoch', usedRate: 'Použitá sadzba' },
    js: { downHintPrefix: '= ', residualSuffix: ' na konci', noResidual: 'Bez balónovej splátky', perAnnum: ' % p.a.', bestSuffix: '' },
    cta: { kicker: 'Ešte neviete, ktorý stroj?', heading: 'Prejdite katalóg traktorov alebo si dva modely porovnajte', catalog: 'Katalóg traktorov', compare: 'Porovnanie modelov', costs: 'Náklady na hektár' },
    providers: [],
    providerSection: null,
    faq: [
      { q: 'Ako sa počíta mesačná splátka leasingu?', a: 'Splátka sa počíta anuitnou metódou — z financovanej sumy (cena stroja mínus akontácia) sa rozpočíta istina a úrok rovnomerne na celú dobu splácania. Vyššia akontácia aj kratšia doba znižujú celkové preplatenie, ale zvyšujú mesačné zaťaženie.' },
      { q: 'Aká je obvyklá akontácia pri leasingu poľnohospodárskej techniky?', a: 'Obvyklá akontácia sa pohybuje medzi 10 a 30 % z obstarávacej ceny. Vyššia akontácia znižuje úrokové náklady aj riziko pre poskytovateľa, takže často znamená aj nižšiu sadzbu.' },
      { q: 'Čo je RPMN a prečo je dôležitá?', a: 'RPMN (ročná percentuálna miera nákladov) zahŕňa okrem úroku aj poplatky za uzatvorenie a vedenie zmluvy. Je to najlepší ukazovateľ na porovnanie ponúk rôznych poskytovateľov — nižšia RPMN znamená lacnejšie financovanie.' },
      { q: 'Ako znížiť celkové preplatenie leasingu?', a: 'Najväčší vplyv má výška akontácie a dĺžka splácania: vyššia akontácia a kratšia doba znižujú zaplatené úroky. Balónová (zostatková) splátka zníži mesačnú splátku, ale celkové preplatenie zvyčajne zvýši. Porovnávajte ponuky podľa RPMN, nie len podľa sadzby.' },
    ],
  },
  uk: {} as LeasingContent,
};
```

> **Pozn. `bestSuffix`:** cs CSS používá `::after { content:" ★ nejnižší" }` natvrdo (leasing-traktoru/index.astro:248) jen u srovnání poskytovatelů. Protože SK sekci poskytovatelů vypouští, `bestSuffix` se v SK nepoužije → `''`. CSS `::after` text ponecháme v cs `<style>` (sekce existuje jen pro cs). Žádná změna CSS není nutná (SK nerenderuje `.provider-table`).

- [ ] **Step 2: Registruj + parity**

`index.ts`: přidej `'leasing-traktoru': leasingTraktoru`. Run parity test → PASS.

> Parity test porovnává i `providers`/`providerSection`: cs má 4 providery + section objekt, sk má `[]` + `null`. `keyPaths([])` = `['']`? Ne — prázdné pole → `[].flatMap(...)` = `[]`. A `null` → `['']` (není pole/objekt). Takže cs `providers` dá klíče `providers[0].id…providers[3].note`, sk dá nic → **parity FAIL**. To je problém.

**Řešení:** `providers` a `providerSection` jsou strukturálně cs-only (záměrně různé). Vyjmi je z parity kontroly — parity test má kontrolovat jen lokalizační text, ne strukturální cs-only data. Uprav modul tak, že parity-relevantní část je oddělená, NEBO uprav parity test, aby ignoroval klíče `providers`/`providerSection`.

Nejčistší: v `tests/i18n/kalkulacka.test.ts` přidej do parity porovnání filtr, který zahodí cesty začínající na cs-only klíče. Uprav test:

```ts
const CS_ONLY_PREFIXES = ['providers', 'providerSection'];
const stripCsOnly = (paths: string[]) =>
  paths.filter((p) => !CS_ONLY_PREFIXES.some((pre) => p === pre || p.startsWith(`${pre}[`) || p.startsWith(`${pre}.`)));
// …
const csKeys = stripCsOnly(keyPaths(calcRegistry[slug].cs));
const skKeys = stripCsOnly(keyPaths(calcRegistry[slug].sk));
expect(skKeys).toEqual(csKeys);
```

To zachová parity pro veškerý lokalizovaný text a toleruje cs-only strukturální pole.

- [ ] **Step 3: Locale-aware stránka + config bridge + podmíněná sekce poskytovatelů**

V `src/pages/kalkulacka/leasing-traktoru/index.astro`:

Frontmatter:

```astro
---
export const prerender = true;
import Layout from '../../../layouts/Layout.astro';
import { breadcrumbSchema, faqPageSchema } from '../../../lib/structured-data';
import { SITE_URL } from '../../../lib/config';
import { content } from '../../../i18n/kalkulacka/leasing-traktoru';
import { crumbs } from '../../../i18n/kalkulacka/common';

const locale = Astro.locals.locale ?? 'cs';
const c = content[locale] ?? content.cs;
const cr = crumbs[locale] ?? crumbs.cs;

const canonical = `${SITE_URL}/kalkulacka/leasing-traktoru/`;
const faqItems = c.faq;
const providers = c.providers;

// Config pro bundled <script> (currency + numberLocale + JS stringy + providers).
const calcCfg = {
  currency: c.currency,
  numberLocale: c.numberLocale,
  js: c.js,
  providers: c.providers,
};

const breadcrumbJsonLd = breadcrumbSchema([
  { name: cr.home, url: '/' },
  { name: cr.hub, url: '/kalkulacka/' },
  { name: c.crumb, url: canonical },
]);
const faqJsonLd = faqPageSchema(faqItems);
---
```

> **Currency v `<input>` unit span:** form má `<span class="cf-unit">Kč</span>`. Nahraď za locale symbol: `<span class="cf-unit">{c.currency === 'EUR' ? '€' : 'Kč'}</span>`. (Jen u pole „cena"; pole „%" a „měsíců" jsou jinde.)

Uprav `<Layout>`: `title={c.title}` `description={c.metaDescription}` (odeber natvrdo `canonical`).

Uprav `.calc-page` data atribut: dnes `data-providers={JSON.stringify(providers)}`. Necháme + přidáme config element uvnitř (níž). `providers` je teď `c.providers` (sk = []).

Breadcrumb + hero z `c`/`cr` (locale-aware hrefy jako Task 4).

Form labely: nahraď hardcoded (`Pořizovací cena stroje`, `Akontace`, `Doba splácení`, `Zůstatková hodnota…`, `měsíců`) za `{c.form.price}` atd. Default `value=` na ceně udělej locale-aware:

```astro
<input type="number" id="price" min="100000" max="20000000" step="10000" value={c.currency === 'EUR' ? 100000 : 2500000} inputmode="numeric" />
```

Result labely (`Měsíční splátka (orientačně)`, `Financovaná částka`, `Celkem zaplaceno`, `Přeplaceno na úrocích`, `Použitá sazba`) → `{c.result.headline}` atd.

**Sekce poskytovatelů — podmíněná:** celou `<section class="provider-section">` (řádky 136–165) obal do `{c.providerSection && ( … )}`. Uvnitř nahraď nadpisy/lede/th/disclaimer za `c.providerSection.*`, a iteraci `{providers.map(...)}` (pro sk je `providers=[]`, ale sekce se stejně nezobrazí díky `c.providerSection && `).

FAQ sekce: `{faqItems.map(...)}` (už lokalizováno).

Cross-CTA: nahraď za `c.cta.*` + locale-aware hrefy:

```astro
    <section class="cross-cta">
      <div>
        <span class="cc-kicker">{c.cta.kicker}</span>
        <h2>{c.cta.heading}</h2>
        <div class="cc-actions">
          <a class="cc-btn primary" href={locale === 'cs' ? '/stroje/traktory/' : `/${locale}/stroje/traktory/`}>{c.cta.catalog}</a>
          <a class="cc-btn ghost" href={locale === 'cs' ? '/srovnani/' : `/${locale}/srovnani/`}>{c.cta.compare}</a>
          <a class="cc-btn ghost" href={locale === 'cs' ? '/kalkulacka/naklady-na-hektar/' : `/${locale}/kalkulacka/naklady-na-hektar/`}>{c.cta.costs}</a>
        </div>
      </div>
    </section>
```

**Config element** — přidej těsně před uzavírací `</div>` `.calc-page` (nebo hned za `data-providers` div otevírací tag, kdekoli v body):

```astro
    <script type="application/json" id="calc-cfg" set:html={JSON.stringify(calcCfg)}></script>
```

**Bundled `<script>` refactor** (řádky 288–364): čti config místo hardcoded cs. Nahraď začátek skriptu:

```ts
  const page = document.querySelector<HTMLElement>('.calc-page');
  const cfg = JSON.parse(document.getElementById('calc-cfg')?.textContent || '{}');
  const providers: { id: string; name: string; apr: number; note: string }[] = cfg.providers ?? [];
  const numberLocale: string = cfg.numberLocale ?? 'cs-CZ';
  const currency: string = cfg.currency ?? 'CZK';
  const js = cfg.js ?? {};

  const fmtMoney = (n: number) =>
    new Intl.NumberFormat(numberLocale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(Math.round(n));
```

Pak ve zbytku skriptu nahraď:
- všechny `fmtCZK(` → `fmtMoney(`
- `downHint.textContent = downAmount > 0 ? \`= ${fmtCZK(downAmount)}\` : '';` → `downHint.textContent = downAmount > 0 ? \`${js.downHintPrefix ?? '= '}${fmtMoney(downAmount)}\` : '';`
- `residualHint.textContent = residualAmount > 0 ? \`= ${fmtCZK(residualAmount)} na konci\` : 'Bez balónové splátky';` → `residualHint.textContent = residualAmount > 0 ? \`${js.downHintPrefix ?? '= '}${fmtMoney(residualAmount)}${js.residualSuffix ?? ''}\` : (js.noResidual ?? '');`
- `\`${headlineApr.toLocaleString('cs-CZ')} % p.a.\`` → `\`${headlineApr.toLocaleString(numberLocale)}${js.perAnnum ?? ' % p.a.'}\``

Provider tabulka (`for (const row of rows)`): nezmění se (sk providers=[] → smyčka prázdná). `provider-table` `.pt-apr` `{p.apr.toLocaleString('cs-CZ')} %` server-render → změň na `{p.apr.toLocaleString(c.numberLocale)} %` (cs beze změny; pro sk se nerenderuje).

- [ ] **Step 4: tsc + build + byte-identity + smoke**

```bash
npx tsc --noEmit && npx vitest run
npm run build
diff -r /tmp/kalk-cs-baseline/kalkulacka/leasing-traktoru dist/kalkulacka/leasing-traktoru
echo "--- SK musí NEobsahovat poskytovatele ---"
grep -c 'ČSOB Leasing\|John Deere Financial\|Srovnání poskytovatelů\|provider-section' dist/sk/kalkulacka/leasing-traktoru/index.html || echo "0 (správně — žádní CZ poskytovatelé)"
echo "--- SK musí obsahovat € a SK title ---"
grep -c 'leasingu traktora' dist/sk/kalkulacka/leasing-traktoru/index.html
grep -o 'EUR' dist/sk/kalkulacka/leasing-traktoru/index.html | head -1
```
Expected: cs diff **bez výstupu** (cs zachovává poskytovatele + Kč); SK stránka `grep -c` poskytovatelů = 0, obsahuje SK title a `EUR` v config elementu.

> cs byte-identity je tu citlivá: config element `<script type="application/json" id="calc-cfg">` je NOVÝ prvek i v cs → **změní cs HTML**! To poruší byte-identity. To je akceptovatelná, zamýšlená cs změna (přidání config elementu + refactor skriptu). **Aktualizuj baseline pro leasing po ověření, že cs FUNGUJE stejně** (ručně: otevři cs stránku, ověř že kalkulačka + tabulka poskytovatelů počítají identicky). Tj. tady `diff` ukáže rozdíl v `<script>` bloku a přidaný config element — to je OK. Zkontroluj, že rozdíl je JEN: (a) přidaný `<script type="application/json" id="calc-cfg">`, (b) přepsaný bundled `<script>` (fmtCZK→fmtMoney, cs-CZ→numberLocale — funkčně identické pro cs). Žádný rozdíl ve viditelném textu/labelech cs. Pak refreshni baseline: `cp -r dist/kalkulacka/leasing-traktoru /tmp/kalk-cs-baseline/kalkulacka/leasing-traktoru`.

- [ ] **Step 5: Commit**

```bash
git add src/i18n/kalkulacka/ tests/i18n/kalkulacka.test.ts src/pages/kalkulacka/leasing-traktoru/index.astro
git commit -m "feat(calc): localize leasing-traktoru for SK (EUR, no CZ providers)"
```

---

### Task 7: `uspora-nafty` — i18n modul + lib normaLabels + locale-aware stránka + € bridge

**Files:**
- Create: `src/i18n/kalkulacka/uspora-nafty.ts`
- Modify: `src/lib/diesel-calc.ts` (volitelný `normaLabels`/`hpUnit`)
- Modify: `src/i18n/kalkulacka/index.ts`
- Modify: `src/pages/kalkulacka/uspora-nafty/index.astro`

- [ ] **Step 1: Rozšiř `compareDiesel` o volitelné lokalizované labely (default = cs)**

V `src/lib/diesel-calc.ts` uprav `DieselComparisonInput` (přidej volitelná pole) a `compareDiesel` (použij je s cs defaultem). Nahraď interface (řádky 43–52) přidáním dvou polí:

```ts
export interface DieselComparisonInput {
  tractorA: TractorProfile;
  tractorB: TractorProfile;
  hoursPerYear: number;
  naftaPriceCzk: number;
  investmentDiffCzk?: number;
  /** Volitelné lokalizované labely emisních norem (default = cs NORMA_LABELS). */
  normaLabels?: Record<EmisniNorma, string>;
  /** Volitelná jednotka výkonu v labelu (default 'k'). */
  hpUnit?: string;
}
```

A v `compareDiesel` (řádky 76–112) nahraď stavbu `label`:

```ts
  const labels = input.normaLabels ?? NORMA_LABELS;
  const hp = input.hpUnit ?? 'k';
  // …
    a: {
      label: `${input.tractorA.powerHp} ${hp} · ${labels[input.tractorA.norma]}`,
      // …
    },
    b: {
      label: `${input.tractorB.powerHp} ${hp} · ${labels[input.tractorB.norma]}`,
      // …
    },
```

(Default = `NORMA_LABELS` + `'k'` → cs chování beze změny.)

- [ ] **Step 2: Vytvoř modul** `src/i18n/kalkulacka/uspora-nafty.ts`

Pozn.: emisní normy mají SK varianty převážně shodné (Stage V atd.), descriptivní text přelož.

```ts
import type { Locale } from '../config';
import type { CalcFaq, CalcMeta, CalcCurrency } from './types';
import type { EmisniNorma } from '../../lib/diesel-calc';

export interface UsporaNaftyContent extends CalcMeta, CalcCurrency {
  form: {
    tractorA: string; tractorB: string;
    power: string; norma: string; ownConsumption: string; ownConsumptionHint: string;
    contextLegend: string; hours: string; price: string; investDiff: string;
    submit: string;
  };
  result: {
    yearlyKicker: string;
    consumption: string; yearly: string; costs: string;
    fiveYear: string; payback: string;
    tractorACard: string; tractorBCard: string;
  };
  js: {
    perYear: string;        // " / rok" / " / rok"
    vsA: string;            // " proti A" / " proti A"
    unitL: string;          // "l"
    unitLh: string;         // "l/h"
    months: string;         // "měsíců" / "mesiacov"
    years: string;          // "let" / "rokov"
    alertFill: string;      // alert při nevyplnění
  };
  /** Lokalizované labely emisních norem (value → label). */
  normaLabels: Record<EmisniNorma, string>;
  hpUnit: string;
  disclaimer: string;
  howItWorks: { heading: string; intro: string; bullets: string[]; outro: string };
  cta: { heading: string; links: { href: string; label: string }[] };
  /** Default vstupní hodnoty. */
  defaults: { hours: number; price: number };
}

export const content: Record<Locale, UsporaNaftyContent> = {
  cs: { /* doslovná extrakce ze stávající stránky + NORMA_LABELS z lib */ },
  sk: { /* SK překlad dle glosáře, price default v € */ },
  uk: {} as UsporaNaftyContent,
};
```

cs hodnoty extrahuj doslovně ze stránky `uspora-nafty/index.astro` (FAQ řádky 10–31, hero/lede, form labely řádky 66–126, result labely, disclaimer ř. 176, „Jak funguje" ř. 181–190, cross odkazy ř. 203–209). `normaLabels` cs = `NORMA_LABELS` z `diesel-calc.ts`. `defaults` cs: `{ hours: 800, price: 32 }`.

SK: `currency:'EUR'`, `numberLocale:'sk-SK'`, `defaults:{ hours: 800, price: 1.3 }` (cena nafty ~1,30 €/l), `js.years:'rokov'`, `js.months:'mesiacov'`. `normaLabels` sk = přelož descriptivní text (`'pre-tier2': 'Pred 2006 (Tier 1/Stage I–II)'`, `'tier3': 'Tier 3 (2006–2011, EGR)'`, `'stage3b': 'Stage IIIB (2011–2014, DPF)'`, `'stage4': 'Stage IV (2014–2019, SCR)'`, `'stage5': 'Stage V (2020+, DPF + SCR)'`). `hpUnit:'k'`.

> SK title příklad: `'Kalkulačka úspory nafty medzi traktormi'`. SK H1: `'Koľko ušetríte výmenou traktora'`. Přelož kompletní FAQ (5 položek, stejný počet), „Jak funguje" sekci (specifická spotřeba g/kWh — univerzální), disclaimer.

- [ ] **Step 3: Registruj + parity**

`index.ts`: `'uspora-nafty': usporaNafty`. Run parity → PASS (žádné cs-only klíče zde; `normaLabels` je v obou).

- [ ] **Step 4: Locale-aware stránka + config bridge + bundled script refactor**

V `src/pages/kalkulacka/uspora-nafty/index.astro`:

Frontmatter: importuj `content` + `crumbs`; **nepoužívej** přímo `NORMA_OPTIONS` z lib (ty jsou cs) — postav lokalizované options z `c.normaLabels`:

```astro
---
export const prerender = true;
import Layout from '../../../layouts/Layout.astro';
import { breadcrumbSchema, faqPageSchema } from '../../../lib/structured-data';
import { SITE_URL } from '../../../lib/config';
import { content } from '../../../i18n/kalkulacka/uspora-nafty';
import { crumbs } from '../../../i18n/kalkulacka/common';
import type { EmisniNorma } from '../../../lib/diesel-calc';

const locale = Astro.locals.locale ?? 'cs';
const c = content[locale] ?? content.cs;
const cr = crumbs[locale] ?? crumbs.cs;

const NORMA_ORDER: EmisniNorma[] = ['pre-tier2', 'tier3', 'stage3b', 'stage4', 'stage5'];
const normaOptions = NORMA_ORDER.map((value) => ({ value, label: c.normaLabels[value] }));

const canonical = `${SITE_URL}/kalkulacka/uspora-nafty/`;
const faqItems = c.faq;

const calcCfg = {
  currency: c.currency,
  numberLocale: c.numberLocale,
  js: c.js,
  normaLabels: c.normaLabels,
  hpUnit: c.hpUnit,
  fillAlert: c.js.alertFill,
};

const breadcrumbJsonLd = breadcrumbSchema([
  { name: cr.home, url: '/' },
  { name: cr.hub, url: '/kalkulacka/' },
  { name: c.crumb, url: canonical },
]);
const faqJsonLd = faqPageSchema(faqItems);
---
```

Nahraď `{NORMA_OPTIONS.map(...)}` (2× v markupu) za `{normaOptions.map(...)}`.

Layout/breadcrumb/hero/form labely/result labely → z `c`/`cr` (locale-aware, vzor Task 6). Currency u `<span>Kč/l</span>` (cena nafty) → `{c.currency === 'EUR' ? '€/l' : 'Kč/l'}`. Default `value="32"` na ceně → `value={c.defaults.price}`, `value="800"` na hodinách → `value={c.defaults.hours}`. Result CZK labely (`— Kč/rok` apod.) jsou placeholdery přepsané JS → ponech `—`, ale statické sufixy `Kč/rok` v markupu (`<div class="dc-result-total" id="dc-result-yearly">— Kč/rok</div>`) přepiš na neutrální `—` (JS dosadí měnu).

Přidej config element před závěr `.dc-root`:

```astro
<script type="application/json" id="calc-cfg" set:html={JSON.stringify(calcCfg)}></script>
```

Bundled `<script>` (řádky 213–280): čte config. Klíčové úpravy:

```ts
    import { compareDiesel } from '../../../lib/diesel-calc';
    import type { EmisniNorma } from '../../../lib/diesel-calc';

    const cfg = JSON.parse(document.getElementById('calc-cfg')?.textContent || '{}');
    const numberLocale: string = cfg.numberLocale ?? 'cs-CZ';
    const currency: string = cfg.currency ?? 'CZK';
    const js = cfg.js ?? {};

    const fmtMoney = (n: number) =>
      new Intl.NumberFormat(numberLocale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(Math.abs(Math.round(n)));
    const fmtNum = (n: number) => n.toLocaleString(numberLocale);
```

Pak:
- `compareDiesel({...})` doplň `normaLabels: cfg.normaLabels, hpUnit: cfg.hpUnit` do argumentu.
- `if (...) { alert('Vyplňte výkon obou traktorů, roční využití a cenu nafty.'); }` → `alert(cfg.fillAlert ?? '...')`.
- `const fmtCzk = (n) => Math.abs(n).toLocaleString('cs-CZ') + ' Kč';` → smaž, používej `fmtMoney`.
- Všude kde se skládá `… + ' / rok'`, `' l'`, `' l/h'`, `' % proti A'`, `'měsíců'`, `'let'` → nahraď `js.perYear`, `js.unitL`, `js.unitLh`, `js.vsA`, `js.months`, `js.years`. Konkrétně:
  - `yearlyEl.textContent = (... ) + fmtCzk(...) + ' / rok';` → `... + fmtMoney(r.yearlySavingCzk) + (js.perYear ?? ' / rok');`
  - `pctEl.textContent = \`${...}${Math.abs(r.savingPct).toFixed(1)} % proti A\`;` → `\`...${Math.abs(r.savingPct).toFixed(1)} %${js.vsA ?? ' proti A'}\``
  - `$('dc-a-cons').textContent = \`${r.a.consumptionLh.toFixed(1)} l/h\`;` → `\`${r.a.consumptionLh.toFixed(1)} ${js.unitLh ?? 'l/h'}\``
  - `$('dc-a-yearly').textContent = \`${r.a.yearlyL.toLocaleString('cs-CZ')} l\`;` → `\`${fmtNum(r.a.yearlyL)} ${js.unitL ?? 'l'}\``
  - `$('dc-a-czk').textContent = fmtCzk(r.a.yearlyCzk) + ' / rok';` → `fmtMoney(r.a.yearlyCzk) + (js.perYear ?? ' / rok');`
  - totéž pro `b`.
  - payback: `\`${(r.paybackYears * 12).toFixed(0)} měsíců\`` → `\`${(r.paybackYears * 12).toFixed(0)} ${js.months ?? 'měsíců'}\``; `\`${r.paybackYears.toFixed(1)} let\`` → `\`${r.paybackYears.toFixed(1)} ${js.years ?? 'let'}\``.

> Pozn.: `r.yearlySavingCzk` název pole z lib zůstává „Czk" i pro €; je to jen interní číslo, měnu dává formátování. Neměň názvy polí v `diesel-calc.ts`.

- [ ] **Step 5: tsc + build + byte-identity (refresh) + smoke**

```bash
npx tsc --noEmit && npx vitest run
npm run build
diff -r /tmp/kalk-cs-baseline/kalkulacka/uspora-nafty dist/kalkulacka/uspora-nafty
```
Expected: cs diff ukáže JEN (a) přidaný config element, (b) refaktorovaný bundled `<script>` (funkčně identický pro cs), (c) případně `value` atributy (32/800 — stejné). Žádný rozdíl ve viditelných cs labelech. Ručně ověř cs kalkulačku (vyplň, spočítej — „Kč", „/ rok", „l/h" stejné). Pak refresh baseline:

```bash
cp -r dist/kalkulacka/uspora-nafty /tmp/kalk-cs-baseline/kalkulacka/uspora-nafty
grep -c 'výmenou traktora' dist/sk/kalkulacka/uspora-nafty/index.html
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/diesel-calc.ts src/i18n/kalkulacka/ src/pages/kalkulacka/uspora-nafty/index.astro
git commit -m "feat(calc): localize uspora-nafty for SK (EUR, localized emission-norm labels)"
```

---

### Task 8: `naklady-na-hektar` — i18n modul + locale-aware stránka + € bridge

**Files:**
- Create: `src/i18n/kalkulacka/naklady-na-hektar.ts`
- Modify: `src/i18n/kalkulacka/index.ts`
- Modify: `src/pages/kalkulacka/naklady-na-hektar/index.astro`

- [ ] **Step 1: Vytvoř modul** `src/i18n/kalkulacka/naklady-na-hektar.ts`

`operations` mají `name`+`note` (cs) — lokalizovat. Struktura operací (id/haPerHour/fuelPerHour) je univerzální; `name`/`note` přes locale.

```ts
import type { Locale } from '../config';
import type { CalcFaq, CalcMeta, CalcCurrency } from './types';

export interface Operation { id: string; name: string; haPerHour: number; fuelPerHour: number; note: string }

export interface NakladyContent extends CalcMeta, CalcCurrency {
  form: {
    operation: string; haPerHour: string; fuelPerHour: string;
    fuelPrice: string; laborCost: string; maintenance: string; maintenanceHint: string;
    area: string; areaHint: string;
  };
  result: {
    perHaKicker: string; fuel: string; labor: string; maint: string;
    totalCost: string; workTime: string;
  };
  js: { perHa: string; hoursH: string; hoursMin: string };
  cta: { kicker: string; heading: string; leasing: string; tractors: string; combines: string };
  operations: Operation[];
  /** Default ceny (locale-specific). */
  defaults: { fuelPrice: number; laborCost: number; maintenance: number; area: number };
}

export const content: Record<Locale, NakladyContent> = {
  cs: { /* doslovná extrakce: operations ř.12–20, FAQ ř.22–39, hero/lede, form labely, result labely, cross-CTA */ },
  sk: { /* SK překlad; operations name/note přeložené; € defaulty */ },
  uk: {} as NakladyContent,
};
```

cs `operations` = doslovně řádky 12–20. cs `defaults` = `{ fuelPrice: 32, laborCost: 280, maintenance: 150, area: 100 }`.

SK: `currency:'EUR'`, `numberLocale:'sk-SK'`, `defaults:{ fuelPrice: 1.3, laborCost: 11, maintenance: 6, area: 100 }`. SK `operations` přelož `name`/`note` (orba→orba, podmítka/kypření→podmietka/kyprenie, setí→sejba, postřik→postrek, rozmetání hnojiv→rozmetanie hnojív, sklizeň obilí→zber obilia, sklizeň píce→zber krmovín). `haPerHour`/`fuelPerHour` ponech identické (fyzikální).

SK title: `'Kalkulačka prevádzkových nákladov na hektár — palivo, práca, údržba'`. SK H1: `'Prevádzkové náklady na hektár'`. Přelož 4 FAQ (stejný počet), hero lede, form labely, cross-CTA, hinty.

> `operations[].name`/`note` jsou v parity testu cs-only-různé strukturou? Ne — pole `operations` existuje v cs i sk se stejným počtem (7) a stejnými klíči (`id/name/haPerHour/fuelPerHour/note`). Parity tedy PROJDE (klíče identické, jen hodnoty se liší). Žádné `CS_ONLY_PREFIXES` zde netřeba.

- [ ] **Step 2: Registruj + parity**

`index.ts`: `'naklady-na-hektar': naklady`. Run parity → PASS.

- [ ] **Step 3: Locale-aware stránka + config bridge + bundled script refactor**

Frontmatter (vzor): importuj modul + crumbs, `c`/`cr`, `operations = c.operations`, `calcCfg = { currency, numberLocale, js, operations }`, breadcrumb JSON-LD.

`data-operations={JSON.stringify(c.operations)}` (už tam je `data-operations`). Místo lib importu žádný — operations jsou z `c`.

Layout/breadcrumb/hero/form labely → z `c`/`cr`. Currency unity: `<span class="cf-unit">Kč/l</span>` → `{c.currency==='EUR'?'€/l':'Kč/l'}`; `Kč/h` (2×) → `{c.currency==='EUR'?'€/h':'Kč/h'}`. Default `value="32"/"280"/"150"/"100"` → z `c.defaults`. `<select>` operace: `{operations.map((op)=><option value={op.id}>{op.name}</option>)}` (už používá `operations` var; teď `c.operations`).

Hinty (`Paušál na opravy…`, `Pro výpočet celkových nákladů a času.`) → `c.form.maintenanceHint`, `c.form.areaHint`. Result labely → `c.result.*`. Cross-CTA → `c.cta.*` + locale-aware hrefy.

Config element před závěr `.calc-page`:

```astro
<script type="application/json" id="calc-cfg" set:html={JSON.stringify(calcCfg)}></script>
```

Bundled `<script>` (řádky 280–351):

```ts
  const page = document.querySelector<HTMLElement>('.calc-page');
  const cfg = JSON.parse(document.getElementById('calc-cfg')?.textContent || '{}');
  const operations: { id: string; name: string; haPerHour: number; fuelPerHour: number; note: string }[] =
    cfg.operations ?? JSON.parse(page?.dataset.operations ?? '[]');
  const numberLocale: string = cfg.numberLocale ?? 'cs-CZ';
  const currency: string = cfg.currency ?? 'CZK';
  const js = cfg.js ?? {};

  const fmtMoney = (n: number) =>
    new Intl.NumberFormat(numberLocale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(Math.round(n));
  const fmtMoney1 = (n: number) =>
    new Intl.NumberFormat(numberLocale, { style: 'currency', currency, maximumFractionDigits: 1 }).format(n);
```

Pak:
- `fmtCZK(` → `fmtMoney(`, `fmtCZK1(` → `fmtMoney1(`.
- `\`${fmtCZK1(totalPerHa)}/ha\`` → `\`${fmtMoney1(totalPerHa)}${js.perHa ?? '/ha'}\`` (a stejně u fuel/labor/maint per-ha řádků).
- `result-hours`: `\`${h} h ${m} min\`` → `\`${h} ${js.hoursH ?? 'h'} ${m} ${js.hoursMin ?? 'min'}\``.

SK `js`: `{ perHa: '/ha', hoursH: 'h', hoursMin: 'min' }` (jednotky stejné; `/ha` univerzální). cs `js` totéž.

- [ ] **Step 4: tsc + build + byte-identity (refresh) + smoke**

```bash
npx tsc --noEmit && npx vitest run
npm run build
diff -r /tmp/kalk-cs-baseline/kalkulacka/naklady-na-hektar dist/kalkulacka/naklady-na-hektar
```
Expected: cs diff jen config element + refaktorovaný skript (funkčně identický). Ručně ověř cs. Refresh baseline:

```bash
cp -r dist/kalkulacka/naklady-na-hektar /tmp/kalk-cs-baseline/kalkulacka/naklady-na-hektar
grep -c 'Prevádzkové náklady na hektár' dist/sk/kalkulacka/naklady-na-hektar/index.html
```

- [ ] **Step 5: Commit**

```bash
git add src/i18n/kalkulacka/ src/pages/kalkulacka/naklady-na-hektar/index.astro
git commit -m "feat(calc): localize naklady-na-hektar for SK (EUR)"
```

---

### Task 9: Hub `/kalkulacka/` — locale-aware + skrytí `dotace-cap` karty na /sk

**Files:**
- Create: `src/i18n/kalkulacka/hub.ts`
- Modify: `src/i18n/kalkulacka/index.ts` (register pro parity)
- Modify: `src/pages/kalkulacka/index.astro`

- [ ] **Step 1: Vytvoř modul** `src/i18n/kalkulacka/hub.ts`

```ts
import type { Locale } from '../config';

export interface HubCard { slug: string; name: string; short: string; description: string; icon: string }

export interface HubContent {
  title: string;
  metaDescription: string;
  kicker: string;
  h1: string;
  lede: string;
  ctaOpen: string;       // "Otevřít kalkulačku →"
  cards: HubCard[];
}

export const content: Record<Locale, HubContent> = {
  cs: {
    title: 'Kalkulačky pro zemědělce — převody jednotek, leasing, náklady',
    metaDescription: 'Interaktivní kalkulačky: převody jednotek plochy (ha, ar, m², akr, jitro), leasing traktoru, provozní náklady na hektar, dotace CAP a úspora nafty.',
    kicker: 'Nástroje · ekonomika farmy',
    h1: 'Kalkulačky pro zemědělce',
    lede: 'Otevřené, transparentní nástroje pro plánování investic a denního provozu. Spočítejte si splátky a náklady před tím, než zavoláte dealerovi — výsledky jsou jen pro orientaci, finální nabídku vždy ověřte u poskytovatele.',
    ctaOpen: 'Otevřít kalkulačku →',
    cards: [
      { slug: 'prevody-jednotek', name: 'Převody jednotek plochy', short: 'Převody jednotek', description: 'Hektar, ar, m², km², akr a historické jednotky (jitro, korec, strych, morgen) — okamžitý přepočet pro zemědělce, katastr i genealogii.', icon: '📐' },
      { slug: 'prevody-hmotnost', name: 'Převody jednotek hmotnosti', short: 'Převody hmotnosti', description: 'Tuna, metrický cent, kilogram, libra a bušl (pšenice, kukuřice, sója) — pro výkup, CBOT futures a porovnání US/EU výnosů.', icon: '⚖️' },
      { slug: 'leasing-traktoru', name: 'Kalkulačka leasingu traktoru', short: 'Leasing traktoru', description: 'Spočítejte měsíční splátku, celkové náklady a RPSN. Porovnání ČSOB Leasing, John Deere Financial, AGRI CS a AGROTEC.', icon: '💳' },
      { slug: 'naklady-na-hektar', name: 'Kalkulačka provozních nákladů na hektar', short: 'Náklady na hektar', description: 'Spotřeba nafty, výkon plochy a obsluha — celkové Kč/ha pro orbu, secí, postřik nebo sklizeň.', icon: '🌾' },
      { slug: 'dotace-cap', name: 'Kalkulačka dotací CAP 2024', short: 'Dotace CAP', description: 'Spočítejte přímé platby SZP 2023–2027: BISS, CISS, EKO, ANC i VCS pro citlivé sektory (chmel, ovoce, cukrová řepa…).', icon: '💶' },
      { slug: 'uspora-nafty', name: 'Kalkulačka úspory nafty', short: 'Úspora nafty', description: 'Porovnejte spotřebu dvou traktorů, roční náklady na naftu a dobu návratnosti investice. Podle emisní normy nebo vlastní měřené spotřeby.', icon: '⛽' },
    ],
  },
  sk: {
    title: 'Kalkulačky pre poľnohospodárov — prevody jednotiek, leasing, náklady',
    metaDescription: 'Interaktívne kalkulačky: prevody jednotiek plochy (ha, ár, m², aker), leasing traktora, prevádzkové náklady na hektár a úspora nafty.',
    kicker: 'Nástroje · ekonomika farmy',
    h1: 'Kalkulačky pre poľnohospodárov',
    lede: 'Otvorené, transparentné nástroje na plánovanie investícií a denného prevádzky. Vypočítajte si splátky a náklady skôr, než zavoláte predajcovi — výsledky sú len orientačné, finálnu ponuku vždy overte u poskytovateľa.',
    ctaOpen: 'Otvoriť kalkulačku →',
    cards: [
      { slug: 'prevody-jednotek', name: 'Prevody jednotiek plochy', short: 'Prevody jednotiek', description: 'Hektár, ár, m², km², aker a historické jednotky — okamžitý prepočet pre poľnohospodárov, kataster aj genealógiu.', icon: '📐' },
      { slug: 'prevody-hmotnost', name: 'Prevody jednotiek hmotnosti', short: 'Prevody hmotnosti', description: 'Tona, metrický cent, kilogram, libra a bušel (pšenica, kukurica, sója) — pre výkup, CBOT futures a porovnanie US/EÚ výnosov.', icon: '⚖️' },
      { slug: 'leasing-traktoru', name: 'Kalkulačka leasingu traktora', short: 'Leasing traktora', description: 'Vypočítajte mesačnú splátku, celkové náklady a RPMN anuitnou metódou.', icon: '💳' },
      { slug: 'naklady-na-hektar', name: 'Kalkulačka prevádzkových nákladov na hektár', short: 'Náklady na hektár', description: 'Spotreba nafty, výkon plochy a obsluha — celkové €/ha pre orbu, sejbu, postrek alebo zber.', icon: '🌾' },
      { slug: 'uspora-nafty', name: 'Kalkulačka úspory nafty', short: 'Úspora nafty', description: 'Porovnajte spotrebu dvoch traktorov, ročné náklady na naftu a dobu návratnosti investície. Podľa emisnej normy alebo vlastnej meranej spotreby.', icon: '⛽' },
    ],
  },
  uk: {} as HubContent,
};
```

> SK `cards` ZÁMĚRNĚ vynechává `dotace-cap` (locked). cs má 6 karet, sk 5. Tím je „skrytí karty na /sk" vyřešené přímo daty — není třeba runtime filtr. (Alternativně by šel filtr přes `isLockedSectionPath`; data-driven je jednodušší a deterministické.)

- [ ] **Step 2: Parity test pro hub — VYJMOUT z generického parity (různý počet karet)**

Hub má cs 6 / sk 5 karet → generický `keyPaths` parity FAIL. Hub proto **neregistruj** do `calcRegistry` (ten je pro kalkulačky se symetrickými klíči). Místo toho přidej cílený test do `tests/i18n/kalkulacka.test.ts`:

```ts
import { content as hub } from '../../src/i18n/kalkulacka/hub';

describe('kalkulačka hub i18n', () => {
  it('sk hub vynechává dotace-cap kartu', () => {
    const skSlugs = hub.sk.cards.map((c) => c.slug);
    expect(skSlugs).not.toContain('dotace-cap');
  });
  it('cs hub obsahuje všech 6 karet včetně dotace-cap', () => {
    const csSlugs = hub.cs.cards.map((c) => c.slug);
    expect(csSlugs).toContain('dotace-cap');
    expect(csSlugs).toHaveLength(6);
  });
  it('sk hub má 5 karet', () => {
    expect(hub.sk.cards).toHaveLength(5);
  });
  it('každá sk karta má neprázdné name/short/description', () => {
    for (const card of hub.sk.cards) {
      expect(card.name).not.toBe('');
      expect(card.short).not.toBe('');
      expect(card.description).not.toBe('');
    }
  });
});
```

Run: `npx vitest run tests/i18n/kalkulacka.test.ts` → PASS.

- [ ] **Step 3: Locale-aware hub stránka**

V `src/pages/kalkulacka/index.astro` přepiš frontmatter (řádky 1–62):

```astro
---
export const prerender = true;
import Layout from '../../layouts/Layout.astro';
import { breadcrumbSchema, itemListSchema } from '../../lib/structured-data';
import { SITE_URL } from '../../lib/config';
import { content } from '../../i18n/kalkulacka/hub';
import { crumbs } from '../../i18n/kalkulacka/common';

const locale = Astro.locals.locale ?? 'cs';
const c = content[locale] ?? content.cs;
const cr = crumbs[locale] ?? crumbs.cs;

const calculators = c.cards;
const canonical = `${SITE_URL}/kalkulacka/`;

const breadcrumbJsonLd = breadcrumbSchema([
  { name: cr.home, url: '/' },
  { name: cr.hub, url: '/kalkulacka/' },
]);

const itemListJsonLd = itemListSchema(
  calculators.map((card) => ({ url: `/kalkulacka/${card.slug}/`, name: card.name })),
  c.h1,
);
---
```

Layout (řádky 65–69):

```astro
<Layout title={c.title} description={c.metaDescription}>
```

(odeber natvrdo `canonical`).

Breadcrumb (řádky 74–78):

```astro
    <nav class="breadcrumb" aria-label="Cesta">
      <a href={locale === 'cs' ? '/' : `/${locale}/`}>{cr.home}</a>
      <span class="sep" aria-hidden="true">›</span>
      <span class="current">{cr.hub}</span>
    </nav>
```

Hero (řádky 80–87):

```astro
    <header class="hero">
      <span class="kicker">{c.kicker}</span>
      <h1>{c.h1}</h1>
      <p class="hero-lede">{c.lede}</p>
    </header>
```

Karty (řádky 89–100) — locale-aware href + CTA:

```astro
    <div class="card-grid">
      {calculators.map((card) => (
        <a href={locale === 'cs' ? `/kalkulacka/${card.slug}/` : `/${locale}/kalkulacka/${card.slug}/`} class="calc-card">
          <div class="cc-icon" aria-hidden="true">{card.icon}</div>
          <div class="cc-body">
            <h2>{card.short}</h2>
            <p>{card.description}</p>
            <span class="cc-cta">{c.ctaOpen}</span>
          </div>
        </a>
      ))}
    </div>
```

- [ ] **Step 4: tsc + build + byte-identity + smoke**

```bash
npx tsc --noEmit && npx vitest run
npm run build
diff -r /tmp/kalk-cs-baseline/kalkulacka/index.html dist/kalkulacka/index.html
echo "--- SK hub: 5 karet, žádná dotace-cap ---"
grep -c 'dotace-cap' dist/sk/kalkulacka/index.html || echo "0 (správně)"
grep -c 'calc-card' dist/sk/kalkulacka/index.html
```
Expected: cs hub `diff` **bez výstupu**; SK hub má `dotace-cap` count 0 a 5 `calc-card`.

- [ ] **Step 5: Commit**

```bash
git add src/i18n/kalkulacka/ tests/i18n/kalkulacka.test.ts src/pages/kalkulacka/index.astro
git commit -m "feat(calc): localize kalkulacka hub for SK, hide dotace-cap card"
```

---

### Task 10: SK překlad — review pass (glosář konzistence) + volitelně pipeline

**Files:**
- Modify (dle review): `src/i18n/kalkulacka/*.ts`

Cíl: zkontrolovat kvalitu SK próz (FAQ, lede) napříč všemi 5 moduly + hub, sjednotit terminologii dle glosáře. SK obsah byl autorsky napsán v Tasks 4–9; tady je QA průchod.

- [ ] **Step 1: Konzistence terminologie**

```bash
cd ~/agro-svet-i18n-obsah
echo "--- Nesmí být CZ 'RPSN' v SK slovnících (má být RPMN) ---"
grep -rn "RPSN" src/i18n/kalkulacka/ | grep -i "sk\|RPMN" || true
echo "--- Hledej zbytky CZ pravopisu v SK blocích (ř/ě/ů jsou CZ-only znaky) ---"
# Ruční kontrola: projdi každý sk: blok a hledej 'ř', 'ě', 'ů' — v SK se nevyskytují.
grep -rn "ř\|ě\|ů" src/i18n/kalkulacka/*.ts
```
Expected: výskyty `ř/ě/ů` jen v `cs:` blocích (a v sdílených unit `name` kde je to záměr, např. „metrický cent" je OK i v SK). Projdi výstup ručně; cokoli v `sk:` bloku s `ř/ě/ů` je překlepová CZ kontaminace → oprav.

> Pozn.: některé tokeny jsou legitimně shodné CZ/SK (např. „cent", „kilogram"). `ě/ř/ů` jsou ale spolehlivý CZ-marker — v SK se nevyskytují. Použij jako lakmus.

- [ ] **Step 2: (Volitelné) profesionální dočištění přes pipeline**

Pokud chceš vyšší kvalitu prózy, prožeň SK FAQ/lede přes `scripts/i18n-translate.py` (sonnet draft + opus editor, glosář). Vstup = cs FAQ, výstup nahraď do `sk:` bloků. Pro tuto fázi je ruční překlad dostačující; pipeline je upgrade, ne blocker.

- [ ] **Step 3: Build + commit (pokud byly opravy)**

```bash
npx tsc --noEmit && npx vitest run && npm run build
git add src/i18n/kalkulacka/
git commit -m "chore(i18n): SK kalkulačka glossary consistency pass" || echo "nic k commitu"
```

---

### Task 11: LAUNCH — flip `SK_LAUNCHED_PREFIXES` + testy + plný build/smoke

**Files:**
- Modify: `src/i18n/utils.ts:31`
- Modify: `tests/i18n/utils.test.ts`

- [ ] **Step 1: Napiš failing test pro launch**

Do `tests/i18n/utils.test.ts` přidej `describe`:

```ts
import { isSkLaunchedPath } from '../../src/i18n/utils';

describe('isSkLaunchedPath — kalkulačky (Fáze 2b launch)', () => {
  it('launchnuté kalkulačky jsou indexovatelné', () => {
    expect(isSkLaunchedPath('/kalkulacka')).toBe(true);
    expect(isSkLaunchedPath('/kalkulacka/')).toBe(true);
    expect(isSkLaunchedPath('/kalkulacka/prevody-jednotek')).toBe(true);
    expect(isSkLaunchedPath('/kalkulacka/leasing-traktoru')).toBe(true);
  });
  it('dříve launchnuté sekce zůstávají', () => {
    expect(isSkLaunchedPath('/stroje')).toBe(true);
    expect(isSkLaunchedPath('/novinky')).toBe(true);
  });
  it('nelaunchnuté sekce zůstávají false', () => {
    expect(isSkLaunchedPath('/slovnik')).toBe(false);
  });
});
```

Uprav `import` v `tests/i18n/utils.test.ts:2–4`, aby zahrnul `isSkLaunchedPath`.

- [ ] **Step 2: Spusť — fail**

Run: `npx vitest run tests/i18n/utils.test.ts`
Expected: FAIL — `/kalkulacka` zatím není v `SK_LAUNCHED_PREFIXES`.

- [ ] **Step 3: Flip prefix**

V `src/i18n/utils.ts:31` nahraď:

```ts
export const SK_LAUNCHED_PREFIXES = ['/stroje', '/znacky', '/srovnani', '/novinky'];
```

za:

```ts
export const SK_LAUNCHED_PREFIXES = ['/stroje', '/znacky', '/srovnani', '/novinky', '/kalkulacka'];
```

- [ ] **Step 4: Testy — pass**

Run: `npx vitest run`
Expected: PASS (vše).

> **Důsledek launche pro cs HTML:** Layout teď pro `/kalkulacka/**` emituje reciproční hreflang (`<link hreflang sk>` + `x-default`). Tj. cs kalkulačka stránky PŘIBEROU 1 hreflang řádek — to je ZAMÝŠLENÁ změna, ne regrese. Lock pro `/sk/kalkulacka/dotace-cap` má přednost (middleware 307 → cs), takže dotace-cap NEzíská index ani hreflang (k Layoutu se nedostane).

- [ ] **Step 5: Plný build + finální verifikace**

```bash
nvm use 22 && cp ~/agro-svet/.env . && npm run build
echo "=== SK kalkulačky indexable (robots index) ==="
for s in prevody-jednotek prevody-hmotnost leasing-traktoru uspora-nafty naklady-na-hektar; do
  echo -n "$s: "; grep -o 'name="robots" content="[^"]*"' dist/sk/kalkulacka/$s/index.html | head -1
done
echo "=== SK hub indexable ==="
grep -o 'name="robots" content="[^"]*"' dist/sk/kalkulacka/index.html | head -1
echo "=== dotace-cap NESMÍ mít /sk indexovatelnou stránku (lock) ==="
ls dist/sk/kalkulacka/dotace-cap/index.html 2>/dev/null && grep -o 'name="robots" content="[^"]*"' dist/sk/kalkulacka/dotace-cap/index.html | head -1 || echo "Pozn.: stránka se může vygenerovat staticky, ale middleware ji v runtime 307-ne na cs."
echo "=== cs kalkulačky: index + nově hreflang sk ==="
grep -c 'hreflang="sk"' dist/kalkulacka/prevody-jednotek/index.html
grep -o 'name="robots" content="[^"]*"' dist/kalkulacka/prevody-jednotek/index.html | head -1
```
Expected: všech 5 SK kalkulaček + hub `robots = index, follow…`; cs kalkulačky `index` + nově `hreflang="sk"` count ≥ 1.

> **dotace-cap pozor:** je `prerender=true`, takže `dist/sk/kalkulacka/dotace-cap/index.html` se může fyzicky vygenerovat (Astro generuje statické cesty pro všechny lokale, pokud existují). Indexovatelnost ale řeší (a) middleware 307 v runtime (lock), (b) Layout noindex — protože `isLockedSectionPath('/kalkulacka/dotace-cap')` je true a `effectiveNoindex` pro sk mimo launched-a-ne-locked… Ověř: pro `/sk/kalkulacka/dotace-cap` musí být `effectiveNoindex=true`. Layout počítá `skLaunched = isSkLaunchedPath('/kalkulacka/dotace-cap')` = **true** (protože `/kalkulacka` prefix matchuje) → to by dalo INDEX! **To je bug.** Lock se v Layoutu neuplatní, jen v middleware. Middleware ale dotace-cap 307-ne dřív, takže prerendered `/sk/.../dotace-cap` stránka se na produkci runtime nikdy neservíruje (redirect). Statický HTML v dist ale existuje a teoreticky by ho crawler našel přes přímou URL → dostane 307 na cs (middleware běží i pro prerendered? V Astro SSR adaptéru middleware běží pro všechny requesty včetně prerendered, pokud je `output` hybrid/server). **Ověř v Tasku 12 živě** (`curl /sk/kalkulacka/dotace-cap/` → musí být 307). Pokud by se servíroval 200 s index, přidej do Layoutu lock-guard (viz Step 6 níže).

- [ ] **Step 6: (Podmíněně) Layout lock-guard — jen pokud Step 5/live ukáže dotace-cap indexable**

Pokud `/sk/kalkulacka/dotace-cap` NEdostane 307 (tj. middleware ho nechytá pro prerendered) NEBO dostává `robots index`, přidej explicitní lock do noindex výpočtu. V `src/layouts/Layout.astro` uprav řádek 69–70:

```ts
import { isSkLaunchedPath } from '../i18n/utils';
import { isLockedSectionPath } from '../i18n/nav';
// …
const skLaunched = isSkLaunchedPath(csRootPath) && !isLockedSectionPath(csRootPath);
```

(Lock přebije launch → `/sk/kalkulacka/dotace-cap` zůstane noindex + bez reciproč. hreflang.) Přidej i test do `tests/i18n` ověřující, že kombinace launched+locked dá noindex (pokud extrahuješ logiku do funkce). Pak rebuild + ověř.

> Defaultně tento step PŘESKOČ — middleware 307 by měl stačit. Aplikuj jen na základě důkazu z live smoke (Task 12).

- [ ] **Step 7: Commit**

```bash
git add src/i18n/utils.ts tests/i18n/utils.test.ts
git commit -m "feat(i18n): launch SK kalkulačky (indexable) — Fáze 2b"
```

---

### Task 12: Deploy + live smoke + PR

**Files:** žádné kódové; deploy + ověření.

- [ ] **Step 1: Finální lokální gate**

```bash
cd ~/agro-svet-i18n-obsah && nvm use 22 && cp ~/agro-svet/.env .
npx tsc --noEmit && npx vitest run && npm run build
```
Expected: tsc 0, všechny testy zelené (vč. původních 180+ a nových kalkulačka/nav/utils), build OK.

- [ ] **Step 2: Deploy**

```bash
npm run deploy   # wrangler deploy (Worker agro-svet-web) + cf-purge
```
Expected: úspěšný wrangler deploy + purge.

- [ ] **Step 3: Live smoke**

```bash
echo "=== SK kalkulačky: 200 + indexable + lang=sk ==="
for s in prevody-jednotek prevody-hmotnost leasing-traktoru uspora-nafty naklady-na-hektar; do
  echo "--- /sk/kalkulacka/$s/ ---"
  curl -s -o /dev/null -w "%{http_code}\n" "https://agro-svet.cz/sk/kalkulacka/$s/"
  curl -s "https://agro-svet.cz/sk/kalkulacka/$s/" | grep -o '<html lang="[^"]*"\|name="robots" content="[^"]*"\|hreflang="cs"\|hreflang="sk"' | head -4
done
echo "=== SK hub ==="
curl -s -o /dev/null -w "%{http_code}\n" "https://agro-svet.cz/sk/kalkulacka/"
curl -s "https://agro-svet.cz/sk/kalkulacka/" | grep -c 'dotace-cap'
echo "=== dotace-cap lock: musí 307 → cs ==="
curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" "https://agro-svet.cz/sk/kalkulacka/dotace-cap/"
echo "=== leasing SK: € a žádní CZ poskytovatelé ==="
curl -s "https://agro-svet.cz/sk/kalkulacka/leasing-traktoru/" | grep -c 'ČSOB Leasing\|Srovnání poskytovatelů'
echo "=== cs beze změny (jen přibyl hreflang sk) ==="
curl -s -o /dev/null -w "%{http_code}\n" "https://agro-svet.cz/kalkulacka/prevody-jednotek/"
curl -s "https://agro-svet.cz/kalkulacka/prevody-jednotek/" | grep -o 'hreflang="sk"' | head -1
```
Expected:
- každá SK kalkulačka: `200`, `lang="sk"`, `robots index`, hreflang cs+sk.
- SK hub: `200`, `dotace-cap` count `0`.
- `/sk/kalkulacka/dotace-cap/`: `307 -> https://agro-svet.cz/kalkulacka/dotace-cap/`.
- leasing SK: poskytovatelé count `0`.
- cs: `200`, `hreflang="sk"` přítomný.

> Pokud dotace-cap NEdá 307 nebo SK kalkulačka dá noindex/500 → STOP, viz Task 11 Step 6 (lock-guard) nebo debug.

- [ ] **Step 4: Funkční ověření kalkulaček (ručně/headless)**

Ověř, že interaktivní JS běží na SK (config bridge funguje): otevři `https://agro-svet.cz/sk/kalkulacka/leasing-traktoru/`, zadej cenu → splátka se zobrazí v €. Totéž `uspora-nafty` (€/rok) a `naklady-na-hektar` (€/ha). A cs varianty (Kč) beze změny.

- [ ] **Step 5: Push + PR**

```bash
git push origin feat/i18n-sk-obsah
gh pr create --base master --head feat/i18n-sk-obsah \
  --title "Fáze 2b: SK kalkulačky (5 kalkulaček, € + RPMN, dotace-cap locked)" \
  --body "$(cat <<'EOF'
## Fáze 2b — SK kalkulačky

Odemyká `/kalkulacka` pro `/sk`: 5 lokalizovaných kalkulaček (prevody-jednotek, prevody-hmotnost, leasing-traktoru, uspora-nafty, naklady-na-hektar), indexovatelných. `dotace-cap` zůstává jurisdikčně uzamčená (307 → cs).

### Mechanismus
- Per-kalkulačka i18n moduly `src/i18n/kalkulacka/<slug>.ts` (cs+sk slovníky), parity test sk↔cs.
- Stránky locale-aware přes `Astro.locals.locale`; JS dostává locale data přes `define:vars` (convertery) / JSON config element (finanční kalkulačky).
- Gating prohlouben: lock jen `/kalkulacka/dotace-cap`, launch `/kalkulacka`.
- Finanční kalkulačky: € + SK defaulty; leasing v SK bez CZ poskytovatelů (jen univerzální anuita); RPSN→RPMN.

### Ověření
- cs byte-identita kalkulaček zachována (build-diff), cs pouze přibral reciproční hreflang sk po launchi.
- Live smoke: SK 200+index+lang=sk, dotace-cap 307, leasing SK bez poskytovatelů, € ve výsledcích.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 6: Merge (squash) po CI/review**

```bash
gh pr merge --squash --delete-branch=false   # branch ponechán pro další fáze (vzor 2a)
```

> Branch `feat/i18n-sk-obsah` se NEMAŽE (drží worktree pro pokračování i18n fází — viz memory). Po merge zkontroluj produkci ještě jednou (Step 3 smoke).

---

## Self-review (proti specu)

**Spec coverage:**
- §1 rozsah 5 kalkulaček + dotace-cap locked → Tasks 4–9 (kalkulačky), Task 1 (lock dotace-cap). ✓
- §2 per-calc i18n modul, locale-aware stránky, per-field cs fallback → Task 2 (infra), Tasks 4–9 (`content[locale] ?? content.cs`). ✓
- §2 convertery: jen popisné texty, symboly univerzální → Task 3. ✓
- §3 gating: ubrat /kalkulacka z LOCKED, přidat dotace-cap; SK_LAUNCHED +/kalkulacka; priorita lock>launch → Task 1 + Task 11 (+ Step 6 guard). ✓
- §3 hub skryje dotace-cap kartu na /sk → Task 9 (data-driven). ✓
- §4 měna €, SK defaulty, sk-SK formátování → Tasks 6/7/8 (currency/numberLocale/defaults). ✓
- §5 leasing zgenerizování (bez CZ poskytovatelů) → Task 6 (sk providers=[], providerSection=null). ✓
- §6 testy: cs byte-identita, parity klíčů, gating, hub filtr → byte-identity build-diff (Tasks 3–9), parity (Task 2+), gating (Tasks 1/11), hub filtr (Task 9). ✓
- §6 build+live smoke → Task 11/12. ✓
- §7 deploy Node 22 + cp .env + npm run deploy + PR squash → Task 12. ✓
- §8 mimo rozsah (dotace-cap lokalizace, SK dotace/statistiky/půda, uk překlad) → respektováno (uk fallback cs, dotace-cap nikdy). ✓

**Doplnění nad spec (opodstatněná):**
- Spec předpokládal `define:vars` pro vše; reálně finanční kalkulačky mají bundled `<script>` → zaveden JSON config element (Vzor B). Dokumentováno.
- `compareDiesel` rozšířen o `normaLabels`/`hpUnit` (lib byl cs-only). Default = cs → bez regrese.
- Parity test: leasing má cs-only `providers`/`providerSection` → filtr `CS_ONLY_PREFIXES`.
- Layout `canonical` prop: stránky ho předávaly natvrdo (cs URL) → odebráno, aby SK dostala správnou /sk kanonickou cestu.

**Type consistency:** `content[locale] ?? content.cs`, `CalcMeta`/`CalcCurrency` sdílené, `numberLocale`/`currency` jednotné názvy napříč moduly i config elementem (`calcCfg.numberLocale`/`.currency`). `fmtMoney`/`fmtMoney1` jednotně nahrazují `fmtCZK`/`fmtCZK1`. ✓

**Otevřené body k ověření při exekuci:**
1. `canonical` odebrání nesmí změnit cs canonical (Task 4 Step 5 fallback `canonical={locale==='cs'?canonical:undefined}` připraven).
2. dotace-cap noindex na /sk — middleware 307 vs. Layout launched=true; live ověření + podmíněný lock-guard (Task 11 Step 6).
3. WeightConverter `defaultCommodity` musí matchovat lokalizovaný `commodityNames.wheat`.
