# Bazar atributy — Fáze 1: Základ (slovník + migrace + extrakce + ukládání) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Zavést strukturované per-kategorie atributy (JSONB `attributes`) — datový sloupec, slovník v kódu jako jediný zdroj pravdy, AI extrakci s deterministickým fallbackem, a uložení atributů přes importní pipeline.

**Architecture:** Jeden `jsonb` sloupec `bazar_listings.attributes` (+ GIN index). Slovník `src/lib/bazar-attributes.ts` definuje per-kategorii atributy (bool/enum/number) a poskytuje `attributesForCategory` / `validateAttributes`. `structureListing` dostane atributy dané kategorie, AI je vyplní (přísně, jen z povolených klíčů/hodnot), fallback dělá regexy. Import (`bazar-seed.ts`, admin API, CLI skript) atributy uloží.

**Tech Stack:** Astro + TypeScript, Supabase (Postgres/JSONB), Vitest, OpenAI (gpt-4o-mini).

**Spec:** `docs/superpowers/specs/2026-07-24-bazar-atributy-vybava-design.md`

**Rozsah fáze 1:** slovník + migrace + extrakce + uložení přes IMPORT. Ruční formulář `/novy`, filtr UI, SEO landingy a MCP jsou pozdější fáze (vlastní plány). Backfill je Fáze 2.

---

## Soubory

- Create: `supabase/migrations/022_bazar_attributes.sql` — sloupec + GIN index
- Create: `src/lib/bazar-attributes.ts` — slovník + helpery
- Create: `src/lib/bazar-attributes.test.ts` — testy slovníku/validace
- Modify: `src/lib/bazar-import-structure.ts` — `structureListing` vrací `attributes`, prompt, fallback
- Modify: `src/lib/bazar-import-structure.test.ts` — testy extrakce atributů
- Modify: `src/lib/bazar-seed.ts` — `DraftListingInput.attributes`, zápis do insertu
- Modify: `src/pages/admin/bazar/seed/api/import.ts` — předání atributů do draftu
- Modify: `scripts/import-bazos-seller.ts` — předání atributů do draftu

---

## Task 1: Migrace — sloupec `attributes` + GIN index

**Files:**
- Create: `supabase/migrations/022_bazar_attributes.sql`

- [ ] **Step 1: Napsat migraci**

```sql
-- 022: Strukturované atributy inzerátů (per-kategorie výbava) — JSONB bag.
-- Klíč = slug atributu ze slovníku bazar-attributes.ts, hodnota = true|string|number.
ALTER TABLE bazar_listings
  ADD COLUMN IF NOT EXISTS attributes jsonb NOT NULL DEFAULT '{}';

-- GIN index pro filtrování podle atributů (attributes->>'klimatizace' = 'true', apod.)
CREATE INDEX IF NOT EXISTS idx_bazar_listings_attributes
  ON bazar_listings USING gin (attributes);
```

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/022_bazar_attributes.sql
git commit -m "feat(bazar): migrace 022 — sloupec attributes jsonb + GIN index"
```

> Poznámka k nasazení (NEspouštět v rámci implementace — dělá user při deployi): migrace se aplikuje na self-host prod `supabase.samecdigital.com`, stejně jako 021.

---

## Task 2: Slovník atributů — typy + prázdný skeleton + helpery (TDD)

**Files:**
- Create: `src/lib/bazar-attributes.ts`
- Test: `src/lib/bazar-attributes.test.ts`

- [ ] **Step 1: Napsat failing testy helperů**

```ts
// src/lib/bazar-attributes.test.ts
import { describe, it, expect } from 'vitest';
import { ATTRIBUTES, attributesForCategory, attrDef, validateAttributes } from './bazar-attributes';

describe('ATTRIBUTES integrita', () => {
  it('má unikátní kombinace key (globálně unikátní klíče)', () => {
    const keys = ATTRIBUTES.map((a) => a.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
  it('enum atributy mají neprázdné options', () => {
    for (const a of ATTRIBUTES.filter((x) => x.type === 'enum')) {
      expect(a.options && a.options.length > 0).toBe(true);
    }
  });
});

describe('attributesForCategory', () => {
  it('vrací sdílené (*) i kategorie-specifické', () => {
    const list = attributesForCategory('traktory');
    const keys = list.map((a) => a.key);
    expect(keys).toContain('klimatizace'); // sdílené
    expect(keys).toContain('prevodovka'); // traktory
  });
  it('nevrací atributy cizí kategorie', () => {
    const keys = attributesForCategory('traktory').map((a) => a.key);
    expect(keys).not.toContain('plemeno'); // zvirata-only
  });
});

describe('validateAttributes', () => {
  it('zahodí neznámý klíč', () => {
    expect(validateAttributes('traktory', { neznamy: true })).toEqual({});
  });
  it('zahodí enum hodnotu mimo options', () => {
    expect(validateAttributes('traktory', { pohon: 'raketa' })).toEqual({});
  });
  it('nechá validní bool/enum/number', () => {
    const out = validateAttributes('traktory', { klimatizace: true, pohon: '4x4', pocet_valcu: 4 });
    expect(out).toEqual({ klimatizace: true, pohon: '4x4', pocet_valcu: 4 });
  });
  it('coercuje number ze stringu a bool z "true"', () => {
    const out = validateAttributes('traktory', { pocet_valcu: '6', klimatizace: 'true' });
    expect(out).toEqual({ pocet_valcu: 6, klimatizace: true });
  });
  it('zahodí atribut kategorie, do které nepatří', () => {
    expect(validateAttributes('zvirata', { prevodovka: 'manual' })).toEqual({});
  });
});
```

- [ ] **Step 2: Spustit test — musí selhat**

Run: `npx vitest run src/lib/bazar-attributes.test.ts`
Expected: FAIL — „Cannot find module './bazar-attributes'".

- [ ] **Step 3: Napsat typy, helpery a MINIMÁLNÍ slovník (jen sdílené + traktory + zvirata pro průchod testů)**

```ts
// src/lib/bazar-attributes.ts
export type AttrType = 'bool' | 'enum' | 'number';

export interface AttrDef {
  key: string;
  label: string;
  type: AttrType;
  options?: string[];
  optionLabels?: Record<string, string>;
  unit?: string;
  categories: string[]; // konkrétní kategorie nebo ['*'] = sdílené
  filter?: boolean; // default true
  seoLanding?: boolean; // default false
}

// Plný slovník se dooplní v Tasku 3; zde minimum pro helpery + testy.
export const ATTRIBUTES: AttrDef[] = [
  { key: 'stav', label: 'Stav', type: 'enum', options: ['nove', 'pouzite', 'repasovane'], optionLabels: { nove: 'Nové', pouzite: 'Použité', repasovane: 'Repasované' }, categories: ['*'] },
  { key: 'klimatizace', label: 'Klimatizace', type: 'bool', categories: ['*'], seoLanding: true },
  { key: 'pohon', label: 'Pohon', type: 'enum', options: ['2x4', '4x4'], optionLabels: { '2x4': '2×4', '4x4': '4×4' }, categories: ['*'], seoLanding: true },
  { key: 'prevodovka', label: 'Převodovka', type: 'enum', options: ['manual', 'powershift', 'cvt'], optionLabels: { manual: 'Manuální', powershift: 'Powershift', cvt: 'CVT / plynulá' }, categories: ['traktory'] },
  { key: 'pocet_valcu', label: 'Počet válců', type: 'number', unit: 'ks', categories: ['traktory'] },
  { key: 'plemeno', label: 'Plemeno', type: 'enum', options: ['jine'], categories: ['zvirata'] },
];

export function attributesForCategory(category: string): AttrDef[] {
  return ATTRIBUTES.filter((a) => a.categories.includes('*') || a.categories.includes(category));
}

export function attrDef(key: string): AttrDef | undefined {
  return ATTRIBUTES.find((a) => a.key === key);
}

/** Ponechá jen atributy platné pro kategorii a hodnoty odpovídající typu. Neznámé/nevalidní zahodí. */
export function validateAttributes(category: string, raw: Record<string, unknown>): Record<string, unknown> {
  const allowed = new Map(attributesForCategory(category).map((a) => [a.key, a]));
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw ?? {})) {
    const def = allowed.get(key);
    if (!def) continue;
    if (def.type === 'bool') {
      if (value === true || value === 'true') out[key] = true;
      else if (value === false || value === 'false') continue; // false = neuvádět
    } else if (def.type === 'enum') {
      const v = String(value);
      if (def.options?.includes(v)) out[key] = v;
    } else if (def.type === 'number') {
      const n = typeof value === 'number' ? value : parseInt(String(value).replace(/[^\d-]/g, ''), 10);
      if (Number.isFinite(n)) out[key] = n;
    }
  }
  return out;
}
```

- [ ] **Step 4: Spustit test — musí projít**

Run: `npx vitest run src/lib/bazar-attributes.test.ts`
Expected: PASS (všech 9 testů).

- [ ] **Step 5: Commit**

```bash
git add src/lib/bazar-attributes.ts src/lib/bazar-attributes.test.ts
git commit -m "feat(bazar): slovník atributů + validace (bool/enum/number, per-kategorie)"
```

---

## Task 3: Doplnit plný slovník pro všech 19 kategorií

**Files:**
- Modify: `src/lib/bazar-attributes.ts`
- Test: `src/lib/bazar-attributes.test.ts`

- [ ] **Step 1: Přidat test na pokrytí kategorií**

Přidej do `bazar-attributes.test.ts` nový `describe`:

```ts
import { CATEGORIES } from './bazar-constants';

describe('pokrytí kategorií', () => {
  // Kategorie, které mají mít vlastní (nesdílené) atributy.
  const RICH = ['traktory','kombajny','zpracovani-pudy','seti','hnojeni','ochrana-rostlin',
    'sklizen-picnin','sklizen-okopanin','manipulace','doprava','komunal-les','staj-chov',
    'nahradni-dily','prislusenstvi','osiva-hnojiva','pozemky','zvirata','sluzby'];
  it('každá RICH kategorie má alespoň jeden vlastní atribut', () => {
    for (const cat of RICH) {
      const own = ATTRIBUTES.filter((a) => a.categories.includes(cat));
      expect(own.length, `kategorie ${cat}`).toBeGreaterThan(0);
    }
  });
  it('všechny categories ve slovníku existují v CATEGORIES nebo jsou *', () => {
    const valid = new Set(CATEGORIES.map((c) => c.value));
    for (const a of ATTRIBUTES) {
      for (const c of a.categories) {
        if (c === '*') continue;
        expect(valid.has(c), `${a.key} → ${c}`).toBe(true);
      }
    }
  });
});
```

- [ ] **Step 2: Spustit — musí selhat**

Run: `npx vitest run src/lib/bazar-attributes.test.ts`
Expected: FAIL — chybí atributy pro kombajny, doprava, pozemky, … (zatím jen traktory/zvirata).

- [ ] **Step 3: Nahradit `ATTRIBUTES` plným slovníkem**

Nahraď pole `ATTRIBUTES` v `src/lib/bazar-attributes.ts` tímto:

```ts
export const ATTRIBUTES: AttrDef[] = [
  // Sdílené (stroje i obecně)
  { key: 'stav', label: 'Stav', type: 'enum', options: ['nove','pouzite','repasovane'], optionLabels: { nove:'Nové', pouzite:'Použité', repasovane:'Repasované' }, categories: ['*'] },
  { key: 'klimatizace', label: 'Klimatizace', type: 'bool', categories: ['*'], seoLanding: true },
  { key: 'pohon', label: 'Pohon', type: 'enum', options: ['2x4','4x4'], optionLabels: { '2x4':'2×4', '4x4':'4×4' }, categories: ['*'], seoLanding: true },
  { key: 'tp_spz', label: 'TP a SPZ', type: 'bool', categories: ['*'], seoLanding: true },
  { key: 'celni_nakladac', label: 'Čelní nakladač', type: 'bool', categories: ['traktory','manipulace'], seoLanding: true },
  // traktory
  { key: 'prevodovka', label: 'Převodovka', type: 'enum', options: ['manual','powershift','cvt'], optionLabels: { manual:'Manuální', powershift:'Powershift', cvt:'CVT / plynulá' }, categories: ['traktory'] },
  { key: 'pocet_valcu', label: 'Počet válců', type: 'number', unit: 'ks', categories: ['traktory'] },
  { key: 'palivo', label: 'Palivo', type: 'enum', options: ['nafta','benzin','elektro'], optionLabels: { nafta:'Nafta', benzin:'Benzin', elektro:'Elektro' }, categories: ['traktory'] },
  { key: 'odpruzena_naprava', label: 'Odpružená náprava', type: 'bool', categories: ['traktory'] },
  { key: 'odpruzena_kabina', label: 'Odpružená kabina', type: 'bool', categories: ['traktory'] },
  { key: 'tribodovy_zaves', label: 'Tříbodový závěs', type: 'bool', categories: ['traktory'] },
  { key: 'vyvodovka_pto', label: 'Vývodovka (PTO)', type: 'bool', categories: ['traktory'] },
  // kombajny
  { key: 'sirka_listy_m', label: 'Šířka lišty', type: 'number', unit: 'm', categories: ['kombajny'] },
  { key: 'drtic_slamy', label: 'Drtič slámy', type: 'bool', categories: ['kombajny'] },
  { key: 'gps_navadeni', label: 'GPS navádění', type: 'bool', categories: ['kombajny'] },
  { key: 'pocet_klasu', label: 'Počet klasů', type: 'number', unit: 'ks', categories: ['kombajny'] },
  // zpracovani-pudy
  { key: 'zavesnost', label: 'Zavěšení', type: 'enum', options: ['nesene','tazene','navesne','samojizdne'], optionLabels: { nesene:'Nesené', tazene:'Tažené', navesne:'Návěsné', samojizdne:'Samojízdné' }, categories: ['zpracovani-pudy','seti','hnojeni','ochrana-rostlin'] },
  { key: 'typ_naradi', label: 'Typ nářadí', type: 'enum', options: ['pluh','podmitac','kompaktor','brany','hloubkovy_kypric'], optionLabels: { pluh:'Pluh', podmitac:'Podmítač', kompaktor:'Kompaktor', brany:'Brány', hloubkovy_kypric:'Hloubkový kypřič' }, categories: ['zpracovani-pudy'] },
  // seti
  { key: 'typ_secky', label: 'Typ secího stroje', type: 'enum', options: ['mechanicka','pneumaticka'], optionLabels: { mechanicka:'Mechanická', pneumaticka:'Pneumatická' }, categories: ['seti'] },
  { key: 'pocet_radku', label: 'Počet řádků', type: 'number', unit: 'ks', categories: ['seti','sklizen-okopanin'] },
  // hnojeni
  { key: 'typ_hnojeni', label: 'Typ', type: 'enum', options: ['rozmetadlo','aplikator_kejdy','aplikator_hnoje'], optionLabels: { rozmetadlo:'Rozmetadlo', aplikator_kejdy:'Aplikátor kejdy', aplikator_hnoje:'Aplikátor hnoje' }, categories: ['hnojeni'] },
  // sklizen-picnin
  { key: 'typ_picnin', label: 'Typ stroje', type: 'enum', options: ['zaci_secka','obracec','shrnovac','lis','rezacka'], optionLabels: { zaci_secka:'Žací sečka', obracec:'Obraceč', shrnovac:'Shrnovač', lis:'Lis', rezacka:'Řezačka' }, categories: ['sklizen-picnin'] },
  // sklizen-okopanin
  { key: 'typ_okopanin', label: 'Typ stroje', type: 'enum', options: ['vyoravac','sklizec','nakladac'], optionLabels: { vyoravac:'Vyorávač', sklizec:'Sklízeč', nakladac:'Nakladač' }, categories: ['sklizen-okopanin'] },
  // manipulace
  { key: 'typ_manipulace', label: 'Typ manipulátoru', type: 'enum', options: ['celni_nakladac','teleskop','vzv','kloubovy_nakladac'], optionLabels: { celni_nakladac:'Čelní nakladač', teleskop:'Teleskopický', vzv:'VZV', kloubovy_nakladac:'Kloubový nakladač' }, categories: ['manipulace'] },
  { key: 'vyska_zdvihu_m', label: 'Výška zdvihu', type: 'number', unit: 'm', categories: ['manipulace'] },
  // doprava
  { key: 'typ_dopravy', label: 'Typ', type: 'enum', options: ['naves','prives','cisterna','valnik','sklapec'], optionLabels: { naves:'Návěs', prives:'Přívěs', cisterna:'Cisterna', valnik:'Valník', sklapec:'Sklápěč' }, categories: ['doprava'] },
  { key: 'pocet_naprav', label: 'Počet náprav', type: 'number', unit: 'ks', categories: ['doprava'] },
  // komunal-les
  { key: 'typ_komunal', label: 'Typ', type: 'enum', options: ['mulcovac','stepkovac','freza','radlice'], optionLabels: { mulcovac:'Mulčovač', stepkovac:'Štěpkovač', freza:'Fréza', radlice:'Radlice' }, categories: ['komunal-les'] },
  // staj-chov
  { key: 'typ_staj', label: 'Typ', type: 'enum', options: ['krmny_voz','dojeni','ustajeni','napajeni','ventilace'], optionLabels: { krmny_voz:'Krmný vůz', dojeni:'Dojení', ustajeni:'Ustájení', napajeni:'Napájení', ventilace:'Ventilace' }, categories: ['staj-chov'] },
  // nahradni-dily
  { key: 'urceno_pro', label: 'Určeno pro', type: 'enum', options: ['traktor','kombajn','naradi','naves','ostatni'], optionLabels: { traktor:'Traktor', kombajn:'Kombajn', naradi:'Nářadí', naves:'Návěs', ostatni:'Ostatní' }, categories: ['nahradni-dily','prislusenstvi'] },
  // osiva-hnojiva
  { key: 'druh_osiva', label: 'Druh', type: 'enum', options: ['osivo','hnojivo','postrik'], optionLabels: { osivo:'Osivo', hnojivo:'Hnojivo', postrik:'Postřik' }, categories: ['osiva-hnojiva'] },
  // pozemky
  { key: 'vymera_ha', label: 'Výměra', type: 'number', unit: 'ha', categories: ['pozemky'] },
  { key: 'druh_pozemku', label: 'Druh pozemku', type: 'enum', options: ['orna','louka','pastvina','les','sad','zahrada'], optionLabels: { orna:'Orná půda', louka:'Louka', pastvina:'Pastvina', les:'Les', sad:'Sad', zahrada:'Zahrada' }, categories: ['pozemky'] },
  // zvirata
  { key: 'druh_zvirete', label: 'Druh', type: 'enum', options: ['skot','prasata','ovce','kozy','kone','drubez','ostatni'], optionLabels: { skot:'Skot', prasata:'Prasata', ovce:'Ovce', kozy:'Kozy', kone:'Koně', drubez:'Drůbež', ostatni:'Ostatní' }, categories: ['zvirata'] },
  { key: 'plemeno', label: 'Plemeno', type: 'enum', options: ['jine'], optionLabels: { jine:'Jiné / neuvedeno' }, categories: ['zvirata'] },
  { key: 'pohlavi', label: 'Pohlaví', type: 'enum', options: ['samec','samice'], optionLabels: { samec:'Samec', samice:'Samice' }, categories: ['zvirata'] },
  { key: 'stari_mesice', label: 'Stáří', type: 'number', unit: 'měs.', categories: ['zvirata'] },
  { key: 'brezost', label: 'Březost', type: 'bool', categories: ['zvirata'] },
  // sluzby
  { key: 'typ_sluzby', label: 'Typ služby', type: 'enum', options: ['servis','doprava','prace_strojem','poradenstvi','ostatni'], optionLabels: { servis:'Servis', doprava:'Doprava', prace_strojem:'Práce strojem', poradenstvi:'Poradenství', ostatni:'Ostatní' }, categories: ['sluzby'] },
];
```

- [ ] **Step 4: Spustit — musí projít**

Run: `npx vitest run src/lib/bazar-attributes.test.ts`
Expected: PASS (vč. nových testů pokrytí).

- [ ] **Step 5: Commit**

```bash
git add src/lib/bazar-attributes.ts src/lib/bazar-attributes.test.ts
git commit -m "feat(bazar): plný slovník atributů pro všech 19 kategorií"
```

---

## Task 4: `structureListing` vrací `attributes` (prompt + AI + fallback) (TDD)

**Files:**
- Modify: `src/lib/bazar-import-structure.ts`
- Test: `src/lib/bazar-import-structure.test.ts`

Kontext existujícího kódu: `structureListing(opts)` má `opts: { title, description, apiKey, fallback, llm? }` a vrací `StructuredListing`. `buildStructurePrompt(title, description)` staví prompt. LLM klient je injektovatelný přes `opts.llm` (v testech se posílá fake vracející JSON string).

- [ ] **Step 1: Napsat failing testy**

Přidej do `src/lib/bazar-import-structure.test.ts`:

```ts
import { attributesForCategory } from './bazar-attributes';
import { extractAttributesFallback } from './bazar-import-structure';

describe('atributy — AI', () => {
  it('structureListing vrátí validní attributes z LLM a zahodí smetí', async () => {
    const llm = async () => JSON.stringify({
      title: 'Zetor 5245', description: 'popis', brand: 'zetor', category: 'traktory',
      type: null, year: null, hours: null, powerHp: null, features: [],
      attributes: { klimatizace: true, pohon: '4x4', neznamy: 'x' },
    });
    const r = await structureListing({
      title: 'Zetor 5245', description: 'popis', apiKey: 'x',
      fallback: { brand: 'zetor', category: 'traktory', hours: null },
      categoryAttributes: attributesForCategory('traktory'), llm,
    });
    expect(r.attributes).toEqual({ klimatizace: true, pohon: '4x4' });
  });
});

describe('extractAttributesFallback (regexy)', () => {
  it('najde klimatizaci, 4x4, TP+SPZ, čelní nakladač', () => {
    const out = extractAttributesFallback('traktory',
      'Traktor s klimatizací, pohon 4x4, čelní nakladač, prodám s TP a SPZ');
    expect(out).toEqual({ klimatizace: true, pohon: '4x4', celni_nakladac: true, tp_spz: true });
  });
  it('nenajde nic v prázdném textu', () => {
    expect(extractAttributesFallback('traktory', '')).toEqual({});
  });
});

describe('structureListing bez apiKey použije fallback atributy', () => {
  it('vytáhne atributy regexem', async () => {
    const r = await structureListing({
      title: 'Zetor s klimatizací 4x4', description: 'čelní nakladač',
      apiKey: '', fallback: { brand: 'zetor', category: 'traktory', hours: null },
      categoryAttributes: attributesForCategory('traktory'),
    });
    expect(r.attributes).toEqual({ klimatizace: true, pohon: '4x4', celni_nakladac: true });
  });
});
```

- [ ] **Step 2: Spustit — musí selhat**

Run: `npx vitest run src/lib/bazar-import-structure.test.ts`
Expected: FAIL — `extractAttributesFallback` neexistuje, `attributes` chybí na výsledku, `categoryAttributes` není v typu.

- [ ] **Step 3: Implementovat**

V `src/lib/bazar-import-structure.ts`:

1) Import slovníku nahoře:
```ts
import { validateAttributes, type AttrDef } from './bazar-attributes';
```

2) Přidej `attributes` do interface `StructuredListing`:
```ts
export interface StructuredListing {
  title: string;
  description: string;
  brand: string | null;
  category: string;
  type: string | null;
  year: number | null;
  hours: number | null;
  powerHp: number | null;
  features: string[];
  attributes: Record<string, unknown>;
}
```

3) Přidej deterministický fallback (nad `structureListing`):
```ts
/** Deterministická extrakce nejjasnějších atributů z textu (bez AI). */
export function extractAttributesFallback(category: string, text: string): Record<string, unknown> {
  const raw: Record<string, unknown> = {};
  if (/klimatizac/i.test(text)) raw.klimatizace = true;
  if (/\b4\s?x\s?4\b|4wd|pohon\s+všech|náhon.{0,10}4/i.test(text)) raw.pohon = '4x4';
  if (/čelní\s+naklada/i.test(text)) raw.celni_nakladac = true;
  if (/\bTP\b/.test(text) && /\bSPZ\b/.test(text)) raw.tp_spz = true;
  return validateAttributes(category, raw);
}
```

4) Rozšiř `buildStructurePrompt` o parametr atributů a přidej instrukci:
```ts
export function buildStructurePrompt(title: string, description: string, attrs: AttrDef[] = []): string {
  const lines = [
    // ... zachovej stávající obsah promptu až po řádek s "features" ...
  ];
  if (attrs.length) {
    const spec = attrs.map((a) => {
      if (a.type === 'bool') return `  "${a.key}": true (jen když ANO; jinak vynech) — ${a.label}`;
      if (a.type === 'enum') return `  "${a.key}": jeden z [${a.options?.join(', ')}] — ${a.label}`;
      return `  "${a.key}": číslo${a.unit ? ' v ' + a.unit : ''} — ${a.label}`;
    }).join('\n');
    lines.push(
      '',
      'Dále vyplň objekt "attributes" — POUZE tyto klíče, jen co lze z textu jednoznačně určit,',
      'co nelze určit VYNECH (klíč neuváděj). Nehádej. Povolené klíče/hodnoty:',
      spec,
    );
  }
  return lines.join('\n');
}
```
(Pozn.: uprav stávající tělo `buildStructurePrompt` tak, že jeho řádky vlož do `lines` místo přímého `.join`, ať jde přidat blok atributů. Formát JSON věty rozšiř o `,"attributes"`.)

5) V `structureListing` uprav `opts` typ + logiku:
```ts
export async function structureListing(opts: {
  title: string;
  description: string;
  apiKey: string;
  fallback: { brand: string | null; category: string; hours: number | null };
  categoryAttributes?: AttrDef[];
  llm?: LlmClient;
}): Promise<StructuredListing> {
  const attrs = opts.categoryAttributes ?? [];
  const fallbackAttributes = extractAttributesFallback(opts.fallback.category, `${opts.title} ${opts.description}`);
  const base: StructuredListing = {
    title: opts.title,
    description: opts.description,
    brand: opts.fallback.brand,
    category: opts.fallback.category,
    type: null,
    year: null,
    hours: opts.fallback.hours,
    powerHp: null,
    features: [],
    attributes: fallbackAttributes,
  };
  if (!opts.apiKey) return base;
  const llm = opts.llm ?? ((p: string) => openaiClient(opts.apiKey, p));
  try {
    const o = parseStructureResponse(await llm(buildStructurePrompt(opts.title, opts.description, attrs)));
    if (!o) return base;
    // ... zachovej stávající mapování brand/category/title/description/type/year/hours/powerHp/features ...
    const aiAttributes = validateAttributes(
      typeof o.category === 'string' ? o.category : base.category,
      (o.attributes && typeof o.attributes === 'object' ? o.attributes : {}) as Record<string, unknown>,
    );
    return {
      // ... stávající pole ...
      attributes: Object.keys(aiAttributes).length ? aiAttributes : fallbackAttributes,
    };
  } catch {
    return base;
  }
}
```

- [ ] **Step 4: Spustit — musí projít**

Run: `npx vitest run src/lib/bazar-import-structure.test.ts`
Expected: PASS (stávající i nové testy).

- [ ] **Step 5: Commit**

```bash
git add src/lib/bazar-import-structure.ts src/lib/bazar-import-structure.test.ts
git commit -m "feat(bazar): structureListing vrací strukturované attributes (AI + fallback)"
```

---

## Task 5: Uložení atributů přes import (`bazar-seed.ts`)

**Files:**
- Modify: `src/lib/bazar-seed.ts`
- Test: `src/lib/bazar-seed.test.ts` (existuje)

Kontext: `DraftListingInput` je interface předávaný do `addDraftListing` a `createProspectWithDraft`. `addDraftListing` volá `supabase.from('bazar_listings').insert({...})`.

- [ ] **Step 1: Napsat failing test**

Přidej do `src/lib/bazar-seed.test.ts` (použij stávající styl mocku supabase v tom souboru; níže je vzor s fake klientem, přizpůsob existujícímu):

```ts
import { describe, it, expect } from 'vitest';
import { addDraftListing } from './bazar-seed';

function fakeSupabase(capture: { row?: any }) {
  return {
    from() {
      return {
        insert(row: any) {
          capture.row = row;
          return { select() { return { single: async () => ({ data: { id: 'l1' }, error: null }) }; } };
        },
      };
    },
  } as any;
}

describe('addDraftListing — attributes', () => {
  it('zapíše attributes do insertu', async () => {
    const cap: { row?: any } = {};
    await addDraftListing(fakeSupabase(cap), 'p1', {
      title: 'T', description: 'D', price: null, category: 'traktory', brand: 'zetor',
      location: '', phone: '', email: '', attributes: { klimatizace: true },
    } as any, []);
    expect(cap.row.attributes).toEqual({ klimatizace: true });
  });
  it('když attributes chybí, zapíše prázdný objekt', async () => {
    const cap: { row?: any } = {};
    await addDraftListing(fakeSupabase(cap), 'p1', {
      title: 'T', description: 'D', price: null, category: 'traktory',
      location: '', phone: '', email: '',
    } as any, []);
    expect(cap.row.attributes).toEqual({});
  });
});
```

- [ ] **Step 2: Spustit — musí selhat**

Run: `npx vitest run src/lib/bazar-seed.test.ts`
Expected: FAIL — `attributes` není v insertu.

- [ ] **Step 3: Implementovat**

1) Do `DraftListingInput` přidej pole:
```ts
  attributes?: Record<string, unknown>;
```

2) V `addDraftListing` do `.insert({...})` přidej:
```ts
      attributes: listing.attributes ?? {},
```

- [ ] **Step 4: Spustit — musí projít**

Run: `npx vitest run src/lib/bazar-seed.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/bazar-seed.ts src/lib/bazar-seed.test.ts
git commit -m "feat(bazar): addDraftListing ukládá attributes"
```

---

## Task 6: Propojit import — admin API + CLI skript předají atributy

**Files:**
- Modify: `src/pages/admin/bazar/seed/api/import.ts`
- Modify: `scripts/import-bazos-seller.ts`

Kontext: obě místa volají `structureListing(...)` a pak `addDraftListing`/`createProspectWithDraft`. Musí (a) předat `categoryAttributes` do `structureListing`, (b) předat `structured.attributes` do draftu.

- [ ] **Step 1: Upravit admin API `import.ts`**

Nahoře přidej import:
```ts
import { attributesForCategory } from '../../../../../lib/bazar-attributes';
```
V `importOne`, ve volání `structureListing({...})` přidej klíč:
```ts
      categoryAttributes: attributesForCategory(suggestCategory(parsed.title, parsed.description ?? '')),
```
V OBOU větvích zápisu (`addDraftListing(...)` i `createProspectWithDraft(... listing: {...})`) přidej do objektu listingu:
```ts
        attributes: structured.attributes,
```

- [ ] **Step 2: Upravit CLI `scripts/import-bazos-seller.ts`**

Nahoře přidej:
```ts
import { attributesForCategory } from '../src/lib/bazar-attributes';
```
Ve volání `structureListing({...})` přidej:
```ts
        categoryAttributes: attributesForCategory(suggestCategory(parsed.title, parsed.description ?? '')),
```
Ve volání `addDraftListing(supabase, prospectId, {...}, imagePaths)` přidej do objektu:
```ts
        attributes: structured.attributes,
```

- [ ] **Step 3: Ověřit typecheck + celý test suite**

Run: `npx tsc --noEmit && npx vitest run src/lib/bazar-attributes.test.ts src/lib/bazar-import-structure.test.ts src/lib/bazar-seed.test.ts`
Expected: bez TS chyb; testy PASS.

- [ ] **Step 4: Commit**

```bash
git add src/pages/admin/bazar/seed/api/import.ts scripts/import-bazos-seller.ts
git commit -m "feat(bazar): import (admin API + CLI) plní attributes ze structureListing"
```

---

## Task 7: Smoke — re-import jednoho inzerátu a ověření atributů (manuální)

**Files:** žádné (ověření)

- [ ] **Step 1: Ověřit, že extrakce dává rozumné atributy**

Spusť cílený re-extrakční sanity check přes existující CLI proti JEDNOMU URL do dočasného prospektu (env jako u předchozího importu — self-host prod), nebo jednodušeji lokálně přes malý ad-hoc `npx tsx` skript, který zavolá `parseBazosListing` + `structureListing` nad jedním staženým HTML a vypíše `structured.attributes`. Očekávané: u „Zetor s TP a SPZ" se objeví `tp_spz: true`, případně `klimatizace`/`pohon` dle textu.

Run (příklad): `npx tsx -e "import('./src/lib/bazar-import-parse.ts')" ` — *(worker: sestav krátký ověřovací skript podle vzoru importOne; needs OPENAI_API_KEY z .env)*.
Expected: vytištěný objekt `attributes` s očekávanými klíči; žádné klíče mimo slovník.

- [ ] **Step 2 (volitelně): zapsat poznatky do specu „Otevřené drobnosti"** pokud AI vrací něco neočekávaného (např. špatné enum hodnoty), a doladit prompt/fallback.

---

## Self-Review (proti specu, sekce „Extrakce" + „Datový model")

- ✅ Datový model: Task 1 (sloupec + GIN).
- ✅ Slovník + validace: Task 2–3 (typy, helpery, plný vocab, validace zahazuje neznámé/nevalidní).
- ✅ Extrakce AI + fallback: Task 4.
- ✅ Uložení přes import: Task 5–6.
- ✅ Přemostěné číselné sloupce (`pracovni_zaber_m` atd.) NEjsou ve slovníku duplikovány jako number do `attributes` — slovník je záměrně neobsahuje (jen nové výbavové atributy) → žádná duplicita dat.
- ⏭️ Mimo fázi 1 (vlastní plány): backfill (F2), ruční formulář + filtr UI (F3), SEO landingy + JSON-LD (F4), MCP (F5).
