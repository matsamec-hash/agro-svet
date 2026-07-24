# Bazar atributy — Fáze 3: Filtr UI + ruční formulář — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or executing-plans. Steps use `- [ ]`.

**Goal:** Umožnit filtrovat inzeráty podle atributů (schovaná sekce „Rozšířené filtry") a zadat atributy při ručním vložení inzerátu (`/bazar/novy`).

**Architecture:** Čistý parser `parseAttributeFilters(params, category)` (bool/enum → objekt pro JSONB `@>` přes `.contains`, GIN-indexovaný). Query se aplikuje v `index.astro`. Nová komponenta `BazarAttributeControls.astro` vykreslí ovládací prvky ze slovníku a použije se ve filtru (jako `<details>`) i ve formuláři. POST handler v `novy.astro` atributy zvaliduje a uloží.

**Tech Stack:** Astro, TypeScript, Supabase JS (`.contains`), Vitest.

**Spec:** `docs/superpowers/specs/2026-07-24-bazar-atributy-vybava-design.md` (sekce „Filtr UI" + „Ruční formulář").

**Konvence query paramů:** `a_<key>` — bool: `a_klimatizace=1`; enum: `a_pohon=4x4`. (Prefix `a_` odděluje atributy od stávajících filtrů jako `price_from`.)

**Rozsah:** filtr (bool+enum) + formulář. Číselné atributy se ve formuláři zadávají, ale ve filtru je zatím NEfiltrujeme (jen bool/enum) — YAGNI, doplní se později. Zobrazení „Výbava" na detailu + JSON-LD je Fáze 4.

---

## Soubory

- Create: `src/lib/bazar-attribute-filter.ts` — parser query paramů → `.contains` objekt
- Create: `src/lib/bazar-attribute-filter.test.ts`
- Create: `src/components/bazar/BazarAttributeControls.astro` — ovládací prvky ze slovníku (sdílené filtrem i formulářem)
- Modify: `src/pages/bazar/index.astro` — aplikovat atributový filtr na dotaz
- Modify: `src/components/bazar/BazarSidebar.astro` — vložit `<details>` „Rozšířené filtry"
- Modify: `src/pages/bazar/novy.astro` — atributová pole ve formuláři + čtení/validace/uložení v POST

---

## Task 1: Parser atributových filtrů (TDD)

**Files:**
- Create: `src/lib/bazar-attribute-filter.ts`
- Test: `src/lib/bazar-attribute-filter.test.ts`

- [ ] **Step 1: Napsat failing testy**

```ts
// src/lib/bazar-attribute-filter.test.ts
import { describe, it, expect } from 'vitest';
import { parseAttributeFilters } from './bazar-attribute-filter';

const p = (obj: Record<string, string>) => new URLSearchParams(obj);

describe('parseAttributeFilters', () => {
  it('bool a_klimatizace=1 → { klimatizace: true }', () => {
    expect(parseAttributeFilters(p({ a_klimatizace: '1' }), 'traktory')).toEqual({ klimatizace: true });
  });
  it('enum a_pohon=4x4 → { pohon: "4x4" }', () => {
    expect(parseAttributeFilters(p({ a_pohon: '4x4' }), 'traktory')).toEqual({ pohon: '4x4' });
  });
  it('kombinuje víc atributů (AND objekt)', () => {
    expect(parseAttributeFilters(p({ a_klimatizace: '1', a_pohon: '4x4' }), 'traktory'))
      .toEqual({ klimatizace: true, pohon: '4x4' });
  });
  it('ignoruje enum hodnotu mimo options', () => {
    expect(parseAttributeFilters(p({ a_pohon: 'raketa' }), 'traktory')).toEqual({});
  });
  it('ignoruje atribut nepatřící kategorii', () => {
    expect(parseAttributeFilters(p({ a_prevodovka: 'manual' }), 'zvirata')).toEqual({});
  });
  it('ignoruje číselné atributy (ve filtru zatím nefiltrujeme)', () => {
    expect(parseAttributeFilters(p({ a_pocet_valcu: '4' }), 'traktory')).toEqual({});
  });
  it('bez kategorie bere jen sdílené atributy (stav)', () => {
    expect(parseAttributeFilters(p({ a_stav: 'pouzite', a_prevodovka: 'manual' }), ''))
      .toEqual({ stav: 'pouzite' });
  });
  it('bool s hodnotou 0/false se ignoruje', () => {
    expect(parseAttributeFilters(p({ a_klimatizace: '0' }), 'traktory')).toEqual({});
  });
});
```

- [ ] **Step 2: Spustit — musí selhat**

Run: `npx vitest run src/lib/bazar-attribute-filter.test.ts`
Expected: FAIL — modul neexistuje.

- [ ] **Step 3: Implementovat**

```ts
// src/lib/bazar-attribute-filter.ts
import { attributesForCategory } from './bazar-attributes';

/**
 * Z query paramů (`a_<key>`) sestaví objekt pro Supabase `.contains('attributes', obj)`
 * (Postgres `@>`, GIN-indexovaný). Bere jen bool + enum atributy platné pro danou
 * kategorii; číselné a neznámé/nevalidní ignoruje. Bez kategorie jen sdílené (['*']).
 */
export function parseAttributeFilters(params: URLSearchParams, category: string): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const def of attributesForCategory(category)) {
    const raw = params.get(`a_${def.key}`);
    if (raw == null || raw === '') continue;
    if (def.type === 'bool') {
      if (raw === '1' || raw === 'true') out[def.key] = true;
    } else if (def.type === 'enum') {
      if (def.options?.includes(raw)) out[def.key] = raw;
    }
    // number: ve filtru zatím vynecháno
  }
  return out;
}
```

- [ ] **Step 4: Spustit — musí projít**

Run: `npx vitest run src/lib/bazar-attribute-filter.test.ts`
Expected: PASS (8 testů).

- [ ] **Step 5: Commit**

```bash
git add src/lib/bazar-attribute-filter.ts src/lib/bazar-attribute-filter.test.ts
git commit -m "feat(bazar): parser atributových filtrů (query param → JSONB contains)"
```

---

## Task 2: Aplikovat atributový filtr v `index.astro`

**Files:**
- Modify: `src/pages/bazar/index.astro`

Kontext: kolem řádků 41–65 se staví `dbQuery = supabase.from('bazar_listings').select(...).eq('status','active')...` a pak sekvence `if (…) dbQuery = dbQuery.gte/lte/eq(...)`. Přidáme atributový filtr přes `.contains`.

- [ ] **Step 1: Přidat import**

Nahoře k ostatním importům z `../../lib/...`:
```ts
import { parseAttributeFilters } from '../../lib/bazar-attribute-filter';
```

- [ ] **Step 2: Aplikovat filtr**

Za poslední existující `if (...) dbQuery = dbQuery....(...)` blok (hned za `objemTo` filtrem) vlož:
```ts
// Atributové filtry (bool/enum) → JSONB @> (GIN index). Prázdný objekt = žádný filtr.
const attributeFilters = parseAttributeFilters(url.searchParams, category);
if (Object.keys(attributeFilters).length > 0) {
  dbQuery = dbQuery.contains('attributes', attributeFilters);
}
```

- [ ] **Step 3: Ověřit build/typecheck**

Run: `npx tsc --noEmit 2>&1 | grep -E 'index.astro|bazar-attribute-filter' || echo "OK"`
Expected: `OK`.
Run (build sanity): `npx astro check --minimal 2>/dev/null | tail -3 || echo "astro check nedostupný — přeskoč"`

- [ ] **Step 4: Commit**

```bash
git add src/pages/bazar/index.astro
git commit -m "feat(bazar): aplikovat atributové filtry na výpis (.contains JSONB)"
```

---

## Task 3: Komponenta ovládacích prvků + „Rozšířené filtry" v sidebaru

**Files:**
- Create: `src/components/bazar/BazarAttributeControls.astro`
- Modify: `src/components/bazar/BazarSidebar.astro`

- [ ] **Step 1: Vytvořit komponentu**

```astro
---
// src/components/bazar/BazarAttributeControls.astro
// Vykreslí ovládací prvky atributů pro danou kategorii ze slovníku.
// mode="filter": bool = checkbox (a_<key>=1), enum = select (a_<key>). Číselné se ve filtru vynechají.
// mode="form":   bool = checkbox, enum = select, number = number input. Prefix name = a_<key>.
import { attributesForCategory, type AttrDef } from '../../lib/bazar-attributes';

interface Props {
  category: string;
  mode: 'filter' | 'form';
  values?: Record<string, unknown>; // předvyplnění (filter: z query; form: edit)
}
const { category, mode, values = {} } = Astro.props as Props;
const defs: AttrDef[] = attributesForCategory(category).filter((a) => a.filter !== false);
const shown = mode === 'filter' ? defs.filter((a) => a.type !== 'number') : defs;
---
{shown.length > 0 && (
  <div class="attr-controls">
    {shown.map((a) => (
      <div class="attr-row">
        {a.type === 'bool' && (
          <label class="attr-check">
            <input type="checkbox" name={`a_${a.key}`} value="1" checked={values[a.key] === true} />
            <span>{a.label}</span>
          </label>
        )}
        {a.type === 'enum' && (
          <label class="attr-field">
            <span>{a.label}</span>
            <select name={`a_${a.key}`} class="form-input">
              <option value="">—</option>
              {a.options?.map((opt) => (
                <option value={opt} selected={values[a.key] === opt}>{a.optionLabels?.[opt] ?? opt}</option>
              ))}
            </select>
          </label>
        )}
        {a.type === 'number' && mode === 'form' && (
          <label class="attr-field">
            <span>{a.label}{a.unit ? ` (${a.unit})` : ''}</span>
            <input type="number" name={`a_${a.key}`} class="form-input" value={values[a.key] != null ? String(values[a.key]) : ''} min="0" />
          </label>
        )}
      </div>
    ))}
  </div>
)}

<style>
  .attr-controls { display: flex; flex-direction: column; gap: 8px; }
  .attr-row { display: flex; }
  .attr-check { display: flex; align-items: center; gap: 8px; cursor: pointer; }
  .attr-field { display: flex; flex-direction: column; gap: 4px; width: 100%; }
  .attr-field > span { font-size: 13px; color: var(--color-text-muted, #555); }
</style>
```

- [ ] **Step 2: Vložit „Rozšířené filtry" do sidebaru**

V `src/components/bazar/BazarSidebar.astro`:
1. Přidej import do frontmatter (k ostatním komponentám):
```ts
import BazarAttributeControls from './BazarAttributeControls.astro';
```
2. Sestav předvyplnění z aktuálních query hodnot (do frontmatteru, poblíž ostatních `activeFilters`):
```ts
// Předvyplnění atributových filtrů z URL (klíč bez prefixu → hodnota)
const attrValues: Record<string, unknown> = {};
for (const [k, v] of Astro.url.searchParams.entries()) {
  if (k.startsWith('a_') && v) attrValues[k.slice(2)] = v === '1' ? true : v;
}
const hasActiveAttrs = Object.keys(attrValues).length > 0;
```
3. V šabloně formuláře, HNED PŘED odesílací tlačítko (submit), vlož schovanou sekci:
```astro
<details class="sf-advanced" open={hasActiveAttrs}>
  <summary class="sf-advanced-summary">Rozšířené filtry (výbava)</summary>
  <div class="sf-advanced-body">
    <BazarAttributeControls category={category} mode="filter" values={attrValues} />
  </div>
</details>
```
4. Přidej styly do `<style>` bloku sidebaru:
```css
  .sf-advanced { margin: 12px 0; border-top: 1px solid var(--color-border, #e5e5e5); padding-top: 12px; }
  .sf-advanced-summary { cursor: pointer; font-weight: 600; font-size: 14px; }
  .sf-advanced-body { margin-top: 10px; }
```

Pozn.: sekce je server-rendered pro AKTUÁLNÍ kategorii (stejný přístup jako stávající `showMachineFilters`). Po změně kategorie a odeslání se atributy překreslí. Funguje bez JS (GET form).

- [ ] **Step 3: Ověřit typecheck**

Run: `npx tsc --noEmit 2>&1 | grep -E 'BazarAttributeControls|BazarSidebar' || echo "OK"`
Expected: `OK`.

- [ ] **Step 4: Commit**

```bash
git add src/components/bazar/BazarAttributeControls.astro src/components/bazar/BazarSidebar.astro
git commit -m "feat(bazar): schovaná sekce Rozšířené filtry (atributy) v sidebaru"
```

---

## Task 4: Atributová pole ve formuláři `/bazar/novy` + uložení

**Files:**
- Modify: `src/pages/bazar/novy.astro`

Kontext: `novy.astro` má POST handler (od ~ř. 21) s `const category = form.get('category')...` a `supabase.from('bazar_listings').insert({ ... category, subcategory, brand, price, description, ... })`. V šabloně je `<form method="POST">` s kategorií-podmíněnými poli, které přepíná klientské JS (od ~ř. 315, poslouchá změnu `#category`). Atributová pole přidáme stejným stylem: server vykreslí pole pro VŠECHNY kategorie, JS ukáže jen sadu vybrané kategorie.

- [ ] **Step 1: Číst + validovat + uložit atributy v POST handleru**

1. Import do frontmatteru:
```ts
import { attributesForCategory, validateAttributes } from '../../lib/bazar-attributes';
```
2. V POST bloku, po zjištění `category` a před `supabase...insert`, sestav atributy z form fieldů `a_<key>`:
```ts
// Atributy z formuláře: seber a_<key> pro danou kategorii, zvaliduj proti slovníku.
const rawAttrs: Record<string, unknown> = {};
for (const def of attributesForCategory(category)) {
  const val = form.get(`a_${def.key}`);
  if (val == null || val === '') continue;
  rawAttrs[def.key] = def.type === 'bool' ? (val === 'on' || val === '1' || val === 'true') : val.toString();
}
const attributes = validateAttributes(category, rawAttrs);
```
3. Do objektu v `.insert({...})` přidej:
```ts
        attributes,
```

- [ ] **Step 2: Vykreslit atributová pole ve formuláři (pro všechny kategorie, JS toggluje)**

1. Import komponenty do frontmatteru:
```ts
import BazarAttributeControls from '../../components/bazar/BazarAttributeControls.astro';
import { CATEGORIES } from '../../lib/bazar-constants';
```
2. V šabloně, za blok kategorie-specifických číselných polí (poblíž `plemeno_slug`, PŘED polem `brand`), vlož obal, který pro každou kategorii vyrenderuje její atributy skryté a označené `data-cat`:
```astro
<div class="form-group" id="attr-fields-wrap">
  <label>Výbava a parametry</label>
  {CATEGORIES.map((c) => (
    <div class="attr-cat" data-cat={c.value} hidden>
      <BazarAttributeControls category={c.value} mode="form" />
    </div>
  ))}
</div>
```
   (Pozn.: `attributesForCategory` vrací i sdílené `['*']`, takže každá kategorie má aspoň `stav` — obal se zobrazí vždy po výběru kategorie.)
3. Rozšiř existující klientský JS listener na změnu `#category` (ten, co už přepíná ostatní pole) o zobrazení správného `.attr-cat`:
```js
    // uvnitř existující funkce reagující na změnu kategorie (val = vybraná kategorie):
    document.querySelectorAll('#attr-fields-wrap .attr-cat').forEach((el) => {
      el.hidden = el.getAttribute('data-cat') !== val;
    });
```
   Pokud taková funkce/hook existuje (dispatch `detail: { attr: 'category', val }`), přidej tam tento blok; jinak přidej `#category` change listener, který to udělá. Zajisti, že se spustí i při prvním načtení (pro předvybranou kategorii).

- [ ] **Step 3: Ověřit typecheck + build**

Run: `npx tsc --noEmit 2>&1 | grep -E 'novy.astro' || echo "OK"`
Expected: `OK`.

- [ ] **Step 4: Ruční ověření (dev server)**

Run: `npm run dev` (na pozadí), otevři `/bazar/novy`, vyber kategorii „Traktory" → objeví se zaškrtávátka (klimatizace, čelní nakladač…) a selecty (pohon, převodovka). Přepni na „Zvířata" → objeví se druh/pohlaví/březost, strojní zmizí. (Nezakládej reálný inzerát, jen vizuální kontrola. Pokud dev server nejde spustit v tomto prostředí, přeskoč a nech na uživatele.)

- [ ] **Step 5: Commit**

```bash
git add src/pages/bazar/novy.astro
git commit -m "feat(bazar): atributová pole ve formuláři /bazar/novy + uložení do attributes"
```

---

## Self-Review (proti specu — „Filtr UI" + „Ruční formulář")

- ✅ Schovaná sekce „Rozšířené filtry" (`<details>`, default sbalená; otevřená když aktivní): Task 3.
- ✅ Atributy dle vybrané kategorie (bez kategorie jen sdílené): Task 1 + komponenta.
- ✅ Query param → JSONB filtr přes GIN (`.contains`): Task 1–2.
- ✅ Server-side validace proti slovníku (allowlist): Task 1 (filtr) + Task 4 (formulář `validateAttributes`).
- ✅ Dynamický formulář dle kategorie (bool checkbox / enum select / number input): Task 4 + komponenta.
- ✅ Funguje bez JS ve filtru (GET form, server-render dle aktuální kategorie): Task 3.
- ⏭️ Zobrazení „Výbava" na detailu + JSON-LD `additionalProperty` = Fáze 4.
- ⚠️ YAGNI: číselné atributy se ve filtru zatím nefiltrují (jen zadávají ve formuláři) — dokumentováno v hlavičce.
