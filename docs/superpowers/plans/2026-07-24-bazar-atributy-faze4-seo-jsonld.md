# Bazar atributy — Fáze 4: SEO landingy + JSON-LD + „Výbava" na detailu — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or executing-plans. Steps use `- [ ]`.

**Goal:** Z atributů vytěžit SEO — crawlovatelné landing stránky `…/kategorie/<cat>/vybava/<atribut>/` (s guardrails proti tenkému obsahu), strojově čitelné atributy na detailu (JSON-LD `additionalProperty` + sekce „Výbava"), a jejich zařazení do sitemapy + interních odkazů.

**Architecture:** Slovník `seoLanding: true` atributy → helper `bazar-attribute-landing.ts` (slug ↔ atribut, tituly, seznam entries) řídí novou SSR routu, sitemapu i interní odkazy. Landing filtruje `.contains('attributes', …)`, indexuje jen při ≥ prahu inzerátů (jinak `noindex,follow`).

**Tech Stack:** Astro (SSR `prerender=false`), TypeScript, Supabase JS, Vitest.

**Spec:** `docs/superpowers/specs/2026-07-24-bazar-atributy-vybava-design.md` (sekce „SEO landing stránky", „Strukturovaná data").

**Konvence URL:** `…/bazar/kategorie/<cat>/vybava/<slug>/`. Slug: bool = `key` (`klimatizace`), enum = `key-value` (`pohon-4x4`). Segment `vybava/` odděluje od `…/kategorie/<cat>/<brand>/`.

**Práh indexace:** `INDEX_THRESHOLD = 3` (≥3 aktivních inzerátů → index; jinak `noindex,follow`).

---

## Soubory

- Create: `src/lib/bazar-attribute-landing.ts` — slug/parse/tituly/entries
- Create: `src/lib/bazar-attribute-landing.test.ts`
- Create: `src/pages/bazar/kategorie/[kat]/vybava/[atribut].astro` — landing routa
- Modify: `src/lib/structured-data.ts` — `additionalProperty` v `bazarListingProductSchema`
- Modify: `src/pages/bazar/[id].astro` — sekce „Výbava" + předání atributů do schématu
- Modify: `src/pages/sitemap.xml.ts` — indexovatelné atributové landingy
- Modify: `src/pages/bazar/kategorie/[kat]/index.astro` — odkazy na atributové landingy (interní prolinkování)

---

## Task 1: Helper `bazar-attribute-landing.ts` (TDD)

**Files:**
- Create: `src/lib/bazar-attribute-landing.ts`
- Test: `src/lib/bazar-attribute-landing.test.ts`

- [ ] **Step 1: Napsat failing testy**

```ts
// src/lib/bazar-attribute-landing.test.ts
import { describe, it, expect } from 'vitest';
import { landingEntriesForCategory, parseAttributeLandingSlug, attributeLandingTitle } from './bazar-attribute-landing';

describe('landingEntriesForCategory', () => {
  it('vrací jen seoLanding atributy platné pro kategorii, enum rozgeneruje po hodnotách', () => {
    const e = landingEntriesForCategory('traktory');
    const slugs = e.map((x) => x.slug);
    expect(slugs).toContain('klimatizace');       // bool
    expect(slugs).toContain('pohon-4x4');         // enum hodnota
    expect(slugs).toContain('pohon-2x4');
    expect(slugs).toContain('celni_nakladac');
    expect(slugs).toContain('tp_spz');
  });
  it('u nestrojní kategorie nevrací strojní landingy', () => {
    expect(landingEntriesForCategory('zvirata').map((x) => x.slug)).not.toContain('klimatizace');
  });
});

describe('parseAttributeLandingSlug', () => {
  it('bool slug → filtr { klimatizace: true }', () => {
    expect(parseAttributeLandingSlug('klimatizace', 'traktory')?.filter).toEqual({ klimatizace: true });
  });
  it('enum slug → filtr { pohon: "4x4" }', () => {
    expect(parseAttributeLandingSlug('pohon-4x4', 'traktory')?.filter).toEqual({ pohon: '4x4' });
  });
  it('neznámý/neseoLanding slug → null', () => {
    expect(parseAttributeLandingSlug('prevodovka-manual', 'traktory')).toBeNull(); // prevodovka nemá seoLanding
    expect(parseAttributeLandingSlug('nesmysl', 'traktory')).toBeNull();
  });
  it('atribut cizí kategorii → null', () => {
    expect(parseAttributeLandingSlug('klimatizace', 'zvirata')).toBeNull();
  });
});

describe('attributeLandingTitle', () => {
  it('složí čitelný titulek', () => {
    const t = attributeLandingTitle('traktory', parseAttributeLandingSlug('klimatizace', 'traktory')!);
    expect(t.toLowerCase()).toContain('traktory');
    expect(t.toLowerCase()).toContain('klimatiz');
  });
});
```

- [ ] **Step 2: Spustit — musí selhat**

Run: `npx vitest run src/lib/bazar-attribute-landing.test.ts`
Expected: FAIL — modul neexistuje.

- [ ] **Step 3: Implementovat**

```ts
// src/lib/bazar-attribute-landing.ts
import { attributesForCategory, type AttrDef } from './bazar-attributes';
import { findCategory } from './bazar-landing';

export interface LandingEntry {
  slug: string;                       // 'klimatizace' | 'pohon-4x4'
  def: AttrDef;
  value: true | string;               // bool → true, enum → hodnota
  label: string;                      // čitelný štítek (pro chip/H1)
  filter: Record<string, unknown>;    // pro .contains('attributes', filter)
}

/** SEO landing entries pro kategorii — jen atributy se `seoLanding: true`. */
export function landingEntriesForCategory(category: string): LandingEntry[] {
  const out: LandingEntry[] = [];
  for (const def of attributesForCategory(category)) {
    if (!def.seoLanding) continue;
    if (def.type === 'bool') {
      out.push({ slug: def.key, def, value: true, label: def.label, filter: { [def.key]: true } });
    } else if (def.type === 'enum') {
      for (const opt of def.options ?? []) {
        out.push({
          slug: `${def.key}-${opt}`,
          def,
          value: opt,
          label: `${def.label}: ${def.optionLabels?.[opt] ?? opt}`,
          filter: { [def.key]: opt },
        });
      }
    }
  }
  return out;
}

/** Slug → entry (nebo null, když neexistuje / není seoLanding / nepatří kategorii). */
export function parseAttributeLandingSlug(slug: string, category: string): LandingEntry | null {
  return landingEntriesForCategory(category).find((e) => e.slug === slug) ?? null;
}

/** SEO titulek landing stránky. */
export function attributeLandingTitle(category: string, entry: LandingEntry): string {
  const cat = findCategory(category);
  const catLabel = cat ? cat.label : category;
  return `${catLabel} — ${entry.label.toLowerCase()} | Agro bazar`;
}

/** Krátký úvodní text. */
export function attributeLandingIntro(category: string, entry: LandingEntry, count: number): string {
  const cat = findCategory(category);
  const catLabel = cat ? cat.label.toLowerCase() : category;
  return `Nabídka v kategorii ${catLabel} s parametrem „${entry.label.toLowerCase()}". Aktuálně ${count} ${count === 1 ? 'inzerát' : count >= 2 && count <= 4 ? 'inzeráty' : 'inzerátů'}.`;
}
```

- [ ] **Step 4: Spustit — musí projít**

Run: `npx vitest run src/lib/bazar-attribute-landing.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/bazar-attribute-landing.ts src/lib/bazar-attribute-landing.test.ts
git commit -m "feat(bazar): helper pro atributové SEO landingy (slug/parse/tituly/entries)"
```

---

## Task 2: Landing routa `…/kategorie/[kat]/vybava/[atribut].astro`

**Files:**
- Create: `src/pages/bazar/kategorie/[kat]/vybava/[atribut].astro`

Kontext: mirroruj `src/pages/bazar/kategorie/[kat]/index.astro` (přečti si ho — stejný Layout, breadcrumb, `BazarListingRow`, itemList/breadcrumb JSON-LD, Cache-Control). Rozdíly: filtruj i podle atributu (`.contains`), přidej guardrail noindex, jiný titulek/H1/canonical, breadcrumb o úroveň hlubší.

- [ ] **Step 1: Vytvořit routu**

```astro
---
// SEO landing: kategorie × atribut, např. /bazar/kategorie/traktory/vybava/klimatizace/.
// Indexuje se jen při ≥ INDEX_THRESHOLD inzerátů (jinak noindex,follow) — ochrana
// proti tenkému obsahu. Jednoatributové; kombinace zůstávají query filtr na /bazar/.
export const prerender = false;

import Layout from '../../../../../layouts/Layout.astro';
import { createServerClient } from '../../../../../lib/supabase';
import { findCategory } from '../../../../../lib/bazar-landing';
import { parseAttributeLandingSlug, attributeLandingTitle, attributeLandingIntro, landingEntriesForCategory } from '../../../../../lib/bazar-attribute-landing';
import { breadcrumbSchema, itemListSchema } from '../../../../../lib/structured-data';
import { SITE_URL } from '../../../../../lib/config';
import BazarListingRow from '../../../../../components/bazar/BazarListingRow.astro';

const INDEX_THRESHOLD = 3;

const { kat, atribut } = Astro.params;
const category = findCategory(kat);
if (!category) return Astro.rewrite('/404');
const entry = parseAttributeLandingSlug(atribut ?? '', category.value);
if (!entry) return Astro.rewrite('/404');

const canonical = `${SITE_URL}/bazar/kategorie/${category.value}/vybava/${entry.slug}/`;
const supabase = createServerClient();

const { data: listings } = await supabase
  .from('bazar_listings')
  .select('id, title, price, category, subcategory, brand, location, created_at, views, featured, pracovni_zaber_m, nosnost_kg, objem_nadrze_l, bazar_images(storage_path, position)')
  .eq('status', 'active')
  .eq('category', category.value)
  .contains('attributes', entry.filter)
  .order('featured', { ascending: false })
  .order('created_at', { ascending: false })
  .limit(60);

const count = listings?.length ?? 0;
const noindex = count < INDEX_THRESHOLD;

function getImageUrl(listing: any): string | null {
  const img = (listing.bazar_images ?? []).sort((a: any, b: any) => a.position - b.position)[0];
  if (!img) return null;
  return supabase.storage.from('bazar-images').getPublicUrl(img.storage_path).data.publicUrl;
}

const breadcrumbJsonLd = breadcrumbSchema([
  { name: 'Domů', url: '/' },
  { name: 'Bazar', url: '/bazar/' },
  { name: category.label, url: `${SITE_URL}/bazar/kategorie/${category.value}/` },
  { name: entry.label, url: canonical },
]);
const itemListJsonLd = itemListSchema(
  (listings ?? []).slice(0, 20).map((l) => ({ url: `/bazar/${l.id}/`, name: l.title })),
  `${category.label} — ${entry.label}`,
);

// Sourozenecké atributové landingy v téže kategorii (interní prolinkování).
const siblings = landingEntriesForCategory(category.value).filter((e) => e.slug !== entry.slug);

Astro.response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=600, stale-while-revalidate=3600');
---

<Layout
  title={attributeLandingTitle(category.value, entry)}
  description={attributeLandingIntro(category.value, entry, count)}
  canonical={canonical}
  noindex={noindex}
>
  <script type="application/ld+json" is:inline set:html={JSON.stringify(breadcrumbJsonLd)} />
  <script type="application/ld+json" is:inline set:html={JSON.stringify(itemListJsonLd)} />

  <div class="cat-root">
    <nav class="breadcrumb" aria-label="Cesta">
      <a href="/">Domů</a><span aria-hidden="true">›</span>
      <a href="/bazar/">Bazar</a><span aria-hidden="true">›</span>
      <a href={`/bazar/kategorie/${category.value}/`}>{category.label}</a><span aria-hidden="true">›</span>
      <span class="current">{entry.label}</span>
    </nav>

    <header class="cat-head">
      <span class="kicker">Bazar techniky</span>
      <h1>{category.label} — {entry.label.toLowerCase()}</h1>
      <p class="lede">{attributeLandingIntro(category.value, entry, count)}</p>
      <div class="cat-stats"><div class="cs"><strong>{count}</strong> aktivních inzerátů</div></div>
    </header>

    <div class="cat-cta">
      <a href={`/bazar/kategorie/${category.value}/`} class="btn-ghost">← {category.label}</a>
      <a href="/bazar/" class="btn-ghost">Celý bazar</a>
      <a href="/bazar/novy/" class="btn-yellow">+ Přidat inzerát</a>
    </div>

    {siblings.length > 0 && (
      <section class="cat-brands" aria-label="Další výbava">
        <h2>Další výbava</h2>
        <div class="brand-chips">
          {siblings.map((s) => (
            <a href={`/bazar/kategorie/${category.value}/vybava/${s.slug}/`} class="brand-chip">{s.label}</a>
          ))}
        </div>
      </section>
    )}

    {listings && listings.length > 0 ? (
      <div class="cat-listings">
        {listings.map((listing) => (
          <BazarListingRow
            id={listing.id} title={listing.title} price={listing.price} location={listing.location}
            category={listing.category} brand={listing.brand} createdAt={listing.created_at}
            views={listing.views} featured={listing.featured}
            pracovniZaberM={listing.pracovni_zaber_m} nosnostKg={listing.nosnost_kg}
            objemNadrzeL={listing.objem_nadrze_l} imageUrl={getImageUrl(listing)}
          />
        ))}
      </div>
    ) : (
      <div class="cat-empty">
        <p>Pro tento parametr momentálně nejsou aktivní inzeráty.</p>
        <p>Zkuste <a href={`/bazar/kategorie/${category.value}/`}>celou kategorii {category.label.toLowerCase()}</a>.</p>
      </div>
    )}
  </div>
</Layout>

<style>
  .cat-root { max-width: 1080px; margin: 0 auto; padding: 32px 24px 80px; }
  .breadcrumb { display: flex; gap: 8px; align-items: center; font-size: 13px; color: #666; margin-bottom: 20px; flex-wrap: wrap; }
  .breadcrumb a { color: #666; text-decoration: none; }
  .breadcrumb a:hover { color: #000; }
  .breadcrumb .current { color: #000; font-weight: 600; }
  .cat-head { margin-bottom: 24px; max-width: 760px; }
  .kicker { display: inline-block; background: #FFEA00; color: #0A0A0B; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px; }
  h1 { font-size: clamp(1.8rem, 4vw, 2.4rem); font-weight: 800; letter-spacing: -1px; line-height: 1.2; margin: 12px 0 8px; color: #1a1a1a; }
  .lede { font-size: 15px; color: #444; line-height: 1.6; margin: 0 0 14px; }
  .cat-stats { display: flex; gap: 16px; font-size: 14px; color: #6B6B72; }
  .cat-stats strong { color: #0B7A3B; font-size: 18px; font-weight: 800; font-family: 'Chakra Petch', sans-serif; }
  .cat-cta { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 28px; }
  .btn-ghost, .btn-yellow { display: inline-flex; align-items: center; gap: 6px; padding: 10px 16px; border-radius: 8px; font-size: 13px; font-weight: 700; text-decoration: none; }
  .btn-ghost { background: #fff; border: 1.5px solid #DFDFE3; color: #0A0A0B; }
  .btn-ghost:hover { border-color: #0A0A0B; }
  .btn-yellow { background: #FFEA00; color: #0A0A0B; border: 1.5px solid #FFEA00; }
  .cat-brands { margin-bottom: 28px; }
  .cat-brands h2 { font-size: 16px; font-weight: 700; color: #0A0A0B; margin: 0 0 12px; }
  .brand-chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .brand-chip { display: inline-block; padding: 7px 14px; background: #fafafa; border: 1px solid #eaeaec; border-radius: 999px; font-size: 13px; font-weight: 600; color: #0A0A0B; text-decoration: none; }
  .brand-chip:hover { border-color: #FFEA00; background: #fff; }
  .cat-listings { border: 1px solid #e8e8e8; border-radius: 14px; overflow: hidden; background: #fff; margin-bottom: 32px; }
  .cat-empty { padding: 32px; text-align: center; background: #fafafa; border-radius: 12px; margin-bottom: 32px; color: #555; line-height: 1.7; }
  .cat-empty a { color: #0B7A3B; text-decoration: underline; margin: 0 4px; }
</style>
```

- [ ] **Step 2: `noindex` prop je hotový — NEupravovat Layout**

`Layout.astro` už má prop `noindex?: boolean` (ověřeno) a při `true` renderuje `<meta name="robots" content="noindex, nofollow">`. To je pro tenké landingy akceptovatelné (jsou pod prahem, jejich odkazy jsou dostupné z indexované kategorie landingu). **Layout NEupravuj.** Jen předávej `noindex={noindex}` jako v routě výše.

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit 2>&1 | grep -E 'vybava|bazar-attribute-landing' || echo OK`
Expected: `OK`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/bazar/kategorie/[kat]/vybava/[atribut].astro
git commit -m "feat(bazar): SEO landing routa kategorie×atribut (guardrail noindex <3)"
```

---

## Task 3: `additionalProperty` v schématu + sekce „Výbava" na detailu

**Files:**
- Modify: `src/lib/structured-data.ts` (fn `bazarListingProductSchema`)
- Modify: `src/pages/bazar/[id].astro`

- [ ] **Step 1: Rozšířit `bazarListingProductSchema` o `additionalProperty`**

V `src/lib/structured-data.ts`:
1. Rozšiř typ `BazarListingForSchema` o volitelné pole:
```ts
  attributes?: Record<string, unknown> | null;
```
2. Přidej import slovníku nahoře v souboru:
```ts
import { attrDef } from './bazar-attributes';
```
3. V `bazarListingProductSchema`, PŘED `return schema;` (na konci), vlož:
```ts
  // Strukturovaná výbava → additionalProperty (bot/LLM čitelné).
  const attrs = listing.attributes && typeof listing.attributes === 'object' ? listing.attributes : {};
  const additionalProperty = Object.entries(attrs).map(([key, value]) => {
    const def = attrDef(key);
    const name = def?.label ?? key;
    let v: string;
    if (value === true) v = 'Ano';
    else if (def?.type === 'enum') v = def.optionLabels?.[String(value)] ?? String(value);
    else v = String(value);
    return { '@type': 'PropertyValue', name, value: v };
  });
  if (additionalProperty.length > 0) schema.additionalProperty = additionalProperty;
```

- [ ] **Step 2: Předat atributy do schématu + vykreslit „Výbava" na detailu**

V `src/pages/bazar/[id].astro`:
1. Zajisti, že se `attributes` načítá v dotazu na listing (najdi `.select('… ')` pro detail a přidej `attributes`, pokud chybí).
2. Do volání `bazarListingProductSchema(listing, …)` se `attributes` propíšou přes objekt `listing` (rozšířený select) — ověř, že se předává celý listing nebo doplň pole.
3. Přidej import nahoře:
```ts
import { attrDef } from '../../lib/bazar-attributes';
```
4. Sestav čitelnou výbavu (poblíž `specItems`):
```ts
const vybavaItems: { label: string; value: string }[] = [];
const attrObj = (listing.attributes && typeof listing.attributes === 'object') ? listing.attributes as Record<string, unknown> : {};
for (const [key, value] of Object.entries(attrObj)) {
  const def = attrDef(key);
  const label = def?.label ?? key;
  const val = value === true ? 'Ano'
    : def?.type === 'enum' ? (def.optionLabels?.[String(value)] ?? String(value))
    : `${value}${def?.unit ? ' ' + def.unit : ''}`;
  vybavaItems.push({ label, value: val });
}
```
5. V šabloně, hned za blok `{specItems.length > 0 && (…)}`, vlož obdobnou sekci pro výbavu:
```astro
{vybavaItems.length > 0 && (
  <div class="spec-block">
    <h2 class="spec-title">Výbava</h2>
    <dl class="spec-list">
      {vybavaItems.map((s) => (
        <div class="spec-row"><dt>{s.label}</dt><dd>{s.value}</dd></div>
      ))}
    </dl>
  </div>
)}
```
   (Použij stejné třídy, jaké má existující `specItems` sekce — přečti si její markup kolem ř. 176 a zrcadli ho, ať styly sedí.)

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit 2>&1 | grep -E 'structured-data|\[id\].astro' || echo OK`
Expected: `OK`.

- [ ] **Step 4: Commit**

```bash
git add src/lib/structured-data.ts src/pages/bazar/[id].astro
git commit -m "feat(bazar): additionalProperty ve schématu + sekce Výbava na detailu"
```

---

## Task 4: Sitemap — indexovatelné atributové landingy

**Files:**
- Modify: `src/pages/sitemap.xml.ts`

Kontext: kolem ř. 264–281 se přidávají `…/kategorie/<cat>/` a kombinace. Přidáme atributové landingy jen tam, kde je ≥ prahu (3) aktivních inzerátů — jinak by byly `noindex` a do sitemapy nepatří.

- [ ] **Step 1: Přidat generování**

Za blok, kde se pushují category landing URL (ř. ~272), vlož:
```ts
  // Atributové landingy (…/kategorie/<cat>/vybava/<slug>/) — jen indexovatelné (≥3 inzeráty).
  const { landingEntriesForCategory } = await import('../lib/bazar-attribute-landing');
  const ATTR_LANDING_THRESHOLD = 3;
  for (const c of BAZAR_CATEGORIES) {
    for (const entry of landingEntriesForCategory(c.value)) {
      const { count } = await supabase
        .from('bazar_listings')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'active')
        .eq('category', c.value)
        .contains('attributes', entry.filter);
      if ((count ?? 0) >= ATTR_LANDING_THRESHOLD) {
        urls.push({ loc: `${SITE_URL}/bazar/kategorie/${c.value}/vybava/${entry.slug}/`, changefreq: 'weekly', priority: '0.55', lastmod: latestListingLastmod ?? D_KRAJE });
      }
    }
  }
```
   (Ověř názvy proměnných `supabase`, `urls`, `latestListingLastmod`, `D_KRAJE`, `BAZAR_CATEGORIES`, `SITE_URL` proti skutečnému souboru a přizpůsob. Pokud `supabase` klient v tomto scope neexistuje pod tímto jménem, použij ten, kterým se dělají ostatní bazar dotazy v souboru.)

- [ ] **Step 2: Typecheck + rychlá sanity**

Run: `npx tsc --noEmit 2>&1 | grep -E 'sitemap.xml' || echo OK`
Expected: `OK`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/sitemap.xml.ts
git commit -m "feat(bazar): atributové landingy do sitemapy (jen ≥3 inzeráty)"
```

---

## Task 5: Interní odkazy z kategorie landingu

**Files:**
- Modify: `src/pages/bazar/kategorie/[kat]/index.astro`

Kontext: kategorie landing (Task 2 vzor) má sekci „Podle značky" (`cat-brands`). Přidáme obdobnou „Podle výbavy" s odkazy na atributové landingy — crawl cesta k nim.

- [ ] **Step 1: Přidat sekci**

1. Import do frontmatteru:
```ts
import { landingEntriesForCategory } from '../../../../lib/bazar-attribute-landing';
```
2. Ve frontmatteru:
```ts
const vybavaEntries = landingEntriesForCategory(category.value);
```
3. V šabloně za sekci `{brandsPresent.length > 0 && (…)}` vlož:
```astro
{vybavaEntries.length > 0 && (
  <section class="cat-brands" aria-label="Podle výbavy">
    <h2>Podle výbavy</h2>
    <div class="brand-chips">
      {vybavaEntries.map((e) => (
        <a href={`/bazar/kategorie/${category.value}/vybava/${e.slug}/`} class="brand-chip">{e.label}</a>
      ))}
    </div>
  </section>
)}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit 2>&1 | grep -E 'kategorie/\[kat\]/index' || echo OK`
Expected: `OK`.

- [ ] **Step 3: Commit**

```bash
git add 'src/pages/bazar/kategorie/[kat]/index.astro'
git commit -m "feat(bazar): odkazy Podle výbavy na kategorie landingu (interní prolinkování)"
```

---

## Self-Review (proti specu — „SEO landing" + „Strukturovaná data")

- ✅ URL `…/kategorie/<cat>/vybava/<slug>/`, segment `vybava/` odděluje od brandu: Task 1–2.
- ✅ Jen `seoLanding: true` atributy, enum rozgenerované po hodnotách: Task 1.
- ✅ Guardrail: index jen ≥3 inzeráty, jinak `noindex,follow`: Task 2.
- ✅ Jednoatributové (žádné kombinace); canonical na sebe; breadcrumb + ItemList JSON-LD: Task 2.
- ✅ Do sitemapy jen indexovatelné (≥3): Task 4.
- ✅ `additionalProperty` (PropertyValue) na detailu + sekce „Výbava": Task 3.
- ✅ Interní prolinkování (chips na kategorie landingu + sourozenci na landing): Task 2 + 5.
- ⚠️ Bez hreflangu — landingy jsou cs-only routy (žádné i18n varianty se negenerují), takže hreflang balast nevzniká.
