# Farmy V1 (seznam + mapa + detail + filtry) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Postavit sekci `/farmy/` na agro-svet.cz — kurovaný adresář vybraných farem prodávajících ze dvora: hub se seznamem + Leaflet mapou + filtry, prerendered detail s schema.org LocalBusiness, a krajské SEO landingy. Data = YAML v `src/data/farmy/`, read-only, plně prerenderované.

**Architecture:** Mirror existujícího `/stroje/` patternu (YAML + `@modyfi/vite-plugin-yaml` glob loader v `lib/`), `/bazar/mapa/` patternu (inline Leaflet+MarkerCluster z unpkg CDN, CSS přes `<link slot="head">`, data z prerendered JSON route), a `lib/structured-data.ts` helperů pro JSON-LD. Filtry na hubu jsou client-side přes URL params (deep-linkovatelné, SEO-friendly). Kraje znovupoužíváme z `lib/cap-dotace.ts` (`KRAJE`, `CzKraj`) — žádná duplikace seznamu krajů.

**Tech Stack:** Astro 6 (SSR Cloudflare adapter, selektivní `prerender`), TypeScript (strict), Tailwind 4 + scoped `<style>`, `@modyfi/vite-plugin-yaml` (compile-time YAML), Leaflet 1.9.4 + markercluster 1.5.3 (unpkg CDN), Vitest (`tests/lib/*.test.ts`).

**Klíčová routing rozhodnutí (odchylky od specu):**
- Krajský landing = `/farmy/kraj/[kraj]/`, NE `/farmy/[kraj]/`. Důvod: `/farmy/[slug]/` (detail) a `/farmy/[kraj]/` jsou ve stejné hloubce stejný dynamický pattern → v Astru kolidují. `/farmy/kraj/[kraj]/` navíc kopíruje existující `/bazar/kraj/[slug]/`.
- Krajský landing se generuje JEN pro kraje s **≥ 3 farmami** (thin-content guard). Ostatní kraje route nemají (404).

**SITE_URL** = `https://agro-svet.cz` (z `src/lib/config.ts`).

---

### Task 1: Datový model + YAML loader + 6 seed farem (TDD)

Foundation. Definuje TS typy, číselníky produktů/typů farem, glob loader (vzor `lib/stroje.ts:179-219`), filtr a krajské helpery. Testy běží proti reálným seed datům (vzor `tests/lib/vcelarstvi.test.ts`).

**Files:**
- Create: `src/lib/farmy.ts`
- Create: `src/data/farmy/statek-na-brehu.yaml` (+ 5 dalších, viz Step 3)
- Test: `tests/lib/farmy.test.ts`

- [ ] **Step 1: Napiš `src/lib/farmy.ts` (typy + číselníky + loader + helpery)**

```ts
// YAML imports parsed at compile-time by @modyfi/vite-plugin-yaml — no runtime js-yaml.
// Mirror lib/stroje.ts loader pattern. Kraje znovupoužíváme z cap-dotace (DRY).
import type { CzKraj } from './cap-dotace';
import { KRAJE } from './cap-dotace';

/** Pevný číselník produktů ze dvora (rozšiřitelný — přidej klíč + label). */
export const FARM_PRODUCTS = {
  'brambory': 'Brambory',
  'zelenina': 'Zelenina',
  'ovoce': 'Ovoce',
  'mleko': 'Mléko',
  'mlecne-vyrobky': 'Mléčné výrobky',
  'maso': 'Maso',
  'vejce': 'Vejce',
  'med': 'Med',
  'obiloviny': 'Obiloviny a mouka',
  'bylinky': 'Bylinky',
  'kvety': 'Květiny',
  'vino': 'Víno',
} as const;
export type FarmProduct = keyof typeof FARM_PRODUCTS;

/** Typ provozu — volný číselník pro štítek. */
export const FARM_TYPES = {
  'rodinna': 'Rodinná farma',
  'eko': 'Ekofarma',
  'zahradnictvi': 'Zahradnictví',
  'ovocnarstvi': 'Ovocnářství',
  'vcelarstvi': 'Včelařství',
  'vinarstvi': 'Vinařství',
} as const;
export type FarmType = keyof typeof FARM_TYPES;

export interface FarmContact {
  web?: string | null;
  tel?: string | null;
  email?: string | null;
}

export interface Farm {
  slug: string;
  name: string;
  farm_type: FarmType;
  description: string;
  region: CzKraj;
  district?: string | null;
  address?: string | null;
  lat: number;
  lng: number;
  eco: boolean;
  eco_cert?: string | null;
  products: FarmProduct[];
  contact?: FarmContact;
  opening?: string | null;
  photos?: string[];
  featured?: boolean;
  featured_until?: string | null;
}

// Vite plugin parses YAML at compile-time → default export is already an object.
const farmModules = import.meta.glob('/src/data/farmy/*.yaml', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>;

let cachedFarms: Farm[] | null = null;

function coerceSlug(value: unknown): string {
  return typeof value === 'string' ? value : String(value);
}

export function getAllFarms(): Farm[] {
  if (cachedFarms) return cachedFarms;
  const farms: Farm[] = [];
  for (const [path, raw] of Object.entries(farmModules)) {
    const parsed = raw as Farm;
    if (!parsed?.slug) {
      console.warn(`[farmy] Missing farm slug in ${path}`);
      continue;
    }
    parsed.slug = coerceSlug(parsed.slug);
    parsed.products = parsed.products ?? [];
    parsed.photos = parsed.photos ?? [];
    parsed.eco = parsed.eco ?? false;
    farms.push(parsed);
  }
  farms.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false) || a.name.localeCompare(b.name, 'cs'));
  cachedFarms = farms;
  return farms;
}

export function getFarm(slug: string): Farm | undefined {
  return getAllFarms().find((f) => f.slug === slug);
}

export function getFarmsByRegion(region: CzKraj): Farm[] {
  return getAllFarms().filter((f) => f.region === region);
}

/** Název kraje z číselníku KRAJE (jeden zdroj pravdy). */
export function regionName(slug: CzKraj): string {
  return KRAJE.find((k) => k.slug === slug)?.name ?? slug;
}

/** Kraje s alespoň `min` farmami — jen ty dostanou krajský landing (thin-content guard). */
export function regionsWithEnoughFarms(min = 3): { slug: CzKraj; name: string; count: number }[] {
  const counts = new Map<CzKraj, number>();
  for (const f of getAllFarms()) counts.set(f.region, (counts.get(f.region) ?? 0) + 1);
  return [...counts.entries()]
    .filter(([, n]) => n >= min)
    .map(([slug, count]) => ({ slug, name: regionName(slug), count }))
    .sort((a, b) => a.name.localeCompare(b.name, 'cs'));
}

/** Počet farem nabízejících daný produkt — pro filtr UI. */
export function productCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const f of getAllFarms()) for (const p of f.products) counts[p] = (counts[p] ?? 0) + 1;
  return counts;
}

export interface FarmFilter {
  region?: CzKraj | '';
  product?: FarmProduct | '';
  eco?: boolean | null;
  q?: string;
}

/** Čistá filtrační funkce — sdílená logika pro server i dokumentace klientského filtru. */
export function filterFarms(farms: Farm[], filter: FarmFilter): Farm[] {
  const q = filter.q?.trim().toLowerCase() ?? '';
  return farms.filter((f) => {
    if (filter.region && f.region !== filter.region) return false;
    if (filter.product && !f.products.includes(filter.product)) return false;
    if (filter.eco === true && !f.eco) return false;
    if (filter.eco === false && f.eco) return false;
    if (q) {
      const hay = `${f.name} ${f.description} ${f.address ?? ''} ${f.district ?? ''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}
```

- [ ] **Step 2: Napiš `tests/lib/farmy.test.ts` (failing — modul i data ještě nejsou kompletní)**

```ts
import { describe, it, expect } from 'vitest';
import {
  getAllFarms, getFarm, getFarmsByRegion,
  regionsWithEnoughFarms, productCounts, filterFarms,
  FARM_PRODUCTS, FARM_TYPES,
} from '../../src/lib/farmy';

describe('farmy loader', () => {
  it('načte farmy a najde podle slugu', () => {
    const all = getAllFarms();
    expect(all.length).toBeGreaterThanOrEqual(6);
    expect(getFarm(all[0].slug)?.name).toBe(all[0].name);
  });

  it('farmy mají unikátní slugy', () => {
    const slugs = getAllFarms().map((f) => f.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('každá farma má validní region, GPS, popis a aspoň 1 produkt z číselníku', () => {
    for (const f of getAllFarms()) {
      expect(typeof f.lat, `${f.slug} lat`).toBe('number');
      expect(typeof f.lng, `${f.slug} lng`).toBe('number');
      expect(f.description.length, `${f.slug} description`).toBeGreaterThan(20);
      expect(f.products.length, `${f.slug} products`).toBeGreaterThan(0);
      for (const p of f.products) expect(FARM_PRODUCTS[p], `${f.slug} product ${p}`).toBeTruthy();
      expect(FARM_TYPES[f.farm_type], `${f.slug} type ${f.farm_type}`).toBeTruthy();
    }
  });

  it('eco farmy mají eco=true a aspoň jedna farma je eko, jedna neeko', () => {
    const farms = getAllFarms();
    expect(farms.some((f) => f.eco)).toBe(true);
    expect(farms.some((f) => !f.eco)).toBe(true);
  });

  it('aspoň jeden kraj má ≥3 farmy (pro krajský landing)', () => {
    expect(regionsWithEnoughFarms(3).length).toBeGreaterThanOrEqual(1);
  });

  it('getFarmsByRegion vrací jen farmy daného kraje', () => {
    const region = getAllFarms()[0].region;
    for (const f of getFarmsByRegion(region)) expect(f.region).toBe(region);
  });

  it('filterFarms filtruje podle produktu, eko a fulltextu', () => {
    const farms = getAllFarms();
    const withMed = filterFarms(farms, { product: 'med' });
    for (const f of withMed) expect(f.products).toContain('med');
    const ecoOnly = filterFarms(farms, { eco: true });
    for (const f of ecoOnly) expect(f.eco).toBe(true);
    const byName = filterFarms(farms, { q: farms[0].name.slice(0, 4) });
    expect(byName.length).toBeGreaterThan(0);
  });

  it('productCounts sčítá výskyty produktů', () => {
    const counts = productCounts();
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    const expected = getAllFarms().reduce((a, f) => a + f.products.length, 0);
    expect(total).toBe(expected);
  });
});
```

- [ ] **Step 3: Vytvoř 6 seed YAML farem v `src/data/farmy/`**

Realistické farmy, GPS reálných obcí, rozprostřené po krajích. **Jihočeský kraj dostane 3 farmy** (aby `regionsWithEnoughFarms(3)` vrátil ≥1 a vznikl krajský landing). Mix `eco: true`/`false`. Každý soubor 1 farma. Příklad (`statek-na-brehu.yaml`):

```yaml
slug: statek-na-brehu
name: Statek Na Břehu
farm_type: rodinna
description: >
  Rodinný statek v podhůří Šumavy hospodařící na 80 hektarech. Prodej ze dvora:
  brambory, sezónní zelenina, čerstvá vejce a domácí mléčné výrobky z vlastního
  stáda. Otevřeno celoročně, v sezóně i samosběr.
region: jihocesky
district: Strakonice
address: Katovice 12, 387 11 Katovice
lat: 49.2667
lng: 13.8333
eco: false
products:
  - brambory
  - zelenina
  - vejce
  - mleko
  - mlecne-vyrobky
contact:
  web: https://example.cz
  tel: "+420 777 123 456"
  email: info@statek-nabrehu.cz
opening: "Po–Pá 8–17, So 8–12"
photos: []
featured: true
```

Zbylých 5 souborů (subagent zvolí věrohodné názvy/GPS, dodrží číselníky `FARM_PRODUCTS`/`FARM_TYPES` a typ `CzKraj` slugy z `cap-dotace.ts`):
- 2× další **jihocesky** (např. ekofarma s `eco: true` + `eco_cert`, a včelařství/ovocnářství) → celkem 3 v kraji.
- 1× **vysocina** (ekofarma, `eco: true`).
- 1× **jihomoravsky** (vinařství, `eco: false`).
- 1× **stredocesky** (zahradnictví/zelenina, `eco: false`).

- [ ] **Step 4: Spusť test — musí projít**

Run: `cd ~/agro-svet-farmy && npx vitest run tests/lib/farmy.test.ts`
Expected: PASS (8 testů zelených).

- [ ] **Step 5: Commit**

```bash
cd ~/agro-svet-farmy && git add src/lib/farmy.ts src/data/farmy/ tests/lib/farmy.test.ts && \
git commit -m "feat(farmy): datový model, YAML loader, filtr + 6 seed farem"
```

---

### Task 2: Prerendered `/farmy/data.json` route

Client-side filtry na hubu i mapa čtou kompaktní JSON (vzor `src/pages/stroje/data.json.ts`).

**Files:**
- Create: `src/pages/farmy/data.json.ts`

- [ ] **Step 1: Napiš route**

```ts
import type { APIRoute } from 'astro';
import { getAllFarms } from '../../lib/farmy';

export const prerender = true;

export const GET: APIRoute = () => {
  // Kompaktní klíče — payload je menší a stačí pro mapu + karty.
  const compact = getAllFarms().map((f) => ({
    s: f.slug,
    n: f.name,
    t: f.farm_type,
    r: f.region,
    d: f.district ?? null,
    lat: f.lat,
    lng: f.lng,
    e: f.eco,
    p: f.products,
    ph: f.photos?.[0] ?? null,
    desc: f.description,
    addr: f.address ?? null,
  }));
  return new Response(JSON.stringify(compact), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
};
```

- [ ] **Step 2: Ověř, že route je validní (build prověří později; teď jen typecheck)**

Run: `cd ~/agro-svet-farmy && npx astro check --minimumSeverity error 2>&1 | tail -5`
Expected: žádná chyba ve `farmy/data.json.ts` (preexistující warningy jinde ignoruj).

- [ ] **Step 3: Commit**

```bash
cd ~/agro-svet-farmy && git add src/pages/farmy/data.json.ts && \
git commit -m "feat(farmy): prerendered /farmy/data.json pro client filtry + mapu"
```

---

### Task 3: `farmLocalBusinessSchema` helper (TDD)

JSON-LD pro detail farmy. `GroceryStore` (subtyp LocalBusiness) — validní pro Google rich results bez Offer/rating požadavků.

**Files:**
- Modify: `src/lib/structured-data.ts` (přidat na konec, před/za poslední export)
- Test: `tests/lib/farmy-schema.test.ts`

- [ ] **Step 1: Napiš test (failing)**

```ts
import { describe, it, expect } from 'vitest';
import { farmLocalBusinessSchema } from '../../src/lib/structured-data';

describe('farmLocalBusinessSchema', () => {
  const base = {
    slug: 'statek-na-brehu',
    name: 'Statek Na Břehu',
    description: 'Rodinný statek.',
    region: 'Jihočeský kraj',
    address: 'Katovice 12, 387 11 Katovice',
    lat: 49.2667,
    lng: 13.8333,
    products: ['Brambory', 'Vejce'],
    eco: true,
    tel: '+420 777 123 456',
    web: 'https://example.cz',
  };

  it('vrací GroceryStore s adresou, geo a url', () => {
    const s = farmLocalBusinessSchema(base) as any;
    expect(s['@type']).toBe('GroceryStore');
    expect(s.url).toBe('https://agro-svet.cz/farmy/statek-na-brehu/');
    expect(s.address['@type']).toBe('PostalAddress');
    expect(s.geo).toMatchObject({ '@type': 'GeoCoordinates', latitude: 49.2667, longitude: 13.8333 });
    expect(s.name).toBe('Statek Na Břehu');
  });

  it('mapuje produkty do makesOffer a telefon/web když jsou', () => {
    const s = farmLocalBusinessSchema(base) as any;
    expect(Array.isArray(s.makesOffer)).toBe(true);
    expect(s.makesOffer.length).toBe(2);
    expect(s.telephone).toBe('+420 777 123 456');
    expect(s.sameAs).toContain('https://example.cz');
  });

  it('vynechá volitelná pole když chybí', () => {
    const s = farmLocalBusinessSchema({ ...base, tel: undefined, web: undefined, address: undefined }) as any;
    expect(s.telephone).toBeUndefined();
    expect(s.sameAs).toBeUndefined();
    expect(s.address).toBeUndefined();
  });
});
```

- [ ] **Step 2: Spusť — fail**

Run: `cd ~/agro-svet-farmy && npx vitest run tests/lib/farmy-schema.test.ts`
Expected: FAIL ("farmLocalBusinessSchema is not a function").

- [ ] **Step 3: Přidej helper do `src/lib/structured-data.ts`**

```ts
export interface FarmForSchema {
  slug: string;
  name: string;
  description: string;
  region: string;
  address?: string | null;
  lat: number;
  lng: number;
  products: string[]; // human labely
  eco: boolean;
  tel?: string | null;
  web?: string | null;
  email?: string | null;
  imageUrls?: string[];
}

// LocalBusiness/GroceryStore pro farmu prodávající ze dvora. Bez Offer cen
// (nemáme transakční data) — makesOffer drží sortiment jako Product nody,
// což je entity-rich a validní bez Product Snippet požadavků.
export function farmLocalBusinessSchema(f: FarmForSchema) {
  const url = `${SITE_URL}/farmy/${f.slug}/`;
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'GroceryStore',
    name: f.name,
    url,
    description: f.description,
    geo: { '@type': 'GeoCoordinates', latitude: f.lat, longitude: f.lng },
    areaServed: { '@type': 'AdministrativeArea', name: f.region },
  };
  if (f.address) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: f.address,
      addressRegion: f.region,
      addressCountry: 'CZ',
    };
  }
  if (f.tel) schema.telephone = f.tel;
  if (f.email) schema.email = f.email;
  const sameAs = [f.web].filter(Boolean) as string[];
  if (sameAs.length > 0) schema.sameAs = sameAs;
  if (f.imageUrls && f.imageUrls.length > 0) schema.image = f.imageUrls.map((u) => (u.startsWith('http') ? u : `${SITE_URL}${u}`));
  if (f.products.length > 0) {
    schema.makesOffer = f.products.map((p) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Product', name: p },
    }));
  }
  if (f.eco) {
    schema.additionalProperty = [{ '@type': 'PropertyValue', name: 'Ekologické zemědělství', value: 'Ano' }];
  }
  return schema;
}
```

- [ ] **Step 4: Spusť — pass**

Run: `cd ~/agro-svet-farmy && npx vitest run tests/lib/farmy-schema.test.ts`
Expected: PASS (3 testy).

- [ ] **Step 5: Commit**

```bash
cd ~/agro-svet-farmy && git add src/lib/structured-data.ts tests/lib/farmy-schema.test.ts && \
git commit -m "feat(farmy): farmLocalBusinessSchema JSON-LD helper (GroceryStore)"
```

---

### Task 4: Hub `/farmy/` — seznam + mapa + filtry

Hlavní stránka. Server vyrenderuje karty (SEO-crawlable HTML), klientský JS filtruje karty + plní Leaflet mapu z `/farmy/data.json`. Filtry držené v URL params. Vzor mapy: `src/pages/bazar/mapa/index.astro`.

**Files:**
- Create: `src/pages/farmy/index.astro`

- [ ] **Step 1: Napiš stránku**

Frontmatter (prerendered, načte data ze stejného loaderu):

```astro
---
export const prerender = true;
import Layout from '../../layouts/Layout.astro';
import { getAllFarms, regionsWithEnoughFarms, FARM_PRODUCTS, FARM_TYPES, productCounts, regionName } from '../../lib/farmy';
import { KRAJE } from '../../lib/cap-dotace';
import { breadcrumbSchema, itemListSchema } from '../../lib/structured-data';

const farms = getAllFarms();
const counts = productCounts();
const regionLandings = regionsWithEnoughFarms(3);
const productOptions = (Object.keys(FARM_PRODUCTS) as (keyof typeof FARM_PRODUCTS)[])
  .filter((p) => counts[p])
  .map((p) => ({ value: p, label: FARM_PRODUCTS[p], count: counts[p] }));
const regionOptions = KRAJE.filter((k) => farms.some((f) => f.region === k.slug));

const breadcrumbJsonLd = breadcrumbSchema([
  { name: 'Domů', url: '/' },
  { name: 'Farmy', url: '/farmy/' },
]);
const listJsonLd = itemListSchema(
  farms.map((f) => ({ url: `/farmy/${f.slug}/`, name: f.name })),
  'Vybrané farmy prodávající ze dvora',
);
---
```

Šablona: `<Layout title="Farmy — prodej ze dvora | agro-svět.cz" description="Adresář vybraných farem prodávajících ze dvora — brambory, zelenina, mléko, maso, med a další. Filtrujte podle kraje, produktu a ekologického hospodaření." canonical="https://agro-svet.cz/farmy/">`. Uvnitř:
1. `<script type="application/ld+json" is:inline set:html={JSON.stringify(breadcrumbJsonLd)} />` a totéž pro `listJsonLd`.
2. Leaflet + MarkerCluster CSS `<link slot="head" …>` — **zkopíruj přesně 3 `<link>` tagy z `src/pages/bazar/mapa/index.astro:27-45`** (leaflet.css + MarkerCluster.css + MarkerCluster.Default.css, vč. integrity/crossorigin).
3. Header s H1 „Farmy — prodej ze dvora" + lede + breadcrumb.
4. Toolbar filtrů: `<select id="ff-region">` (Všechny + `regionOptions`), `<select id="ff-product">` (Všechny + `productOptions` s počty), `<select id="ff-eco">` (Vše / Jen ekologické / Konvenční), `<input type="search" id="ff-q" placeholder="Hledat farmu…">`, `<div id="ff-status" aria-live="polite">`.
5. `<div id="farmy-map" class="farmy-map">` (klon `.map-canvas` stylů).
6. Sekce karet: server vyrenderuje `farms.map(f => <article class="farm-card" data-slug data-region data-products data-eco data-name>…)` s odkazem na `/farmy/${f.slug}/`, štítkem typu (`FARM_TYPES[f.farm_type]`), eko-badge když `f.eco`, krajem (`regionName(f.region)`), prvními ~4 produkty.
7. Pokud `regionLandings.length`, sekce „Farmy podle kraje" s odkazy na `/farmy/kraj/${slug}/`.

Klientský `<script>` (mirror struktury `bazar/mapa` skriptu):
- `readParams()`/`writeParams()` přes `URLSearchParams` (`kraj`, `produkt`, `eko`, `q`) — inicializuj hodnoty filtrů z URL při loadu, `history.replaceState` při změně.
- `applyCardFilter()` — projde `.farm-card` elementy, toggle `hidden` podle `dataset` vs aktivní filtry (region exact, products includes, eco '1'/'0', name/desc contains q). Aktualizuj `#ff-status` „X z Y farem".
- Mapa: `loadScript()` (zkopíruj z `bazar/mapa:104-114`), lazy `init()` v `requestIdleCallback`. `L.map('farmy-map',{preferCanvas:true}).setView([49.8,15.5],7)`, OSM tileLayer, `L.markerClusterGroup({showCoverageOnHover:false,spiderfyOnMaxZoom:true,maxClusterRadius:60})`. Fetch `/farmy/data.json`, drž `allFarms`. `renderMarkers()` respektuje stejné filtry; popup HTML = název (odkaz `/farmy/${s}/`), kraj, eko štítek, produkty, „Detail farmy →" (zkopíruj `escapeHtml` z `bazar/mapa:155-157`).
- Filtry volají `applyCardFilter()` + `renderMarkers()` zároveň; q s ~200ms debounce (vzor `bazar/mapa:194-197`).
- Attribuce OSM `<p class="map-attribution">` (klon z bazar/mapa).

Scoped `<style>` — vyjdi ze stylů `bazar/mapa` (`.map-canvas` → `.farmy-map`, toolbar, breadcrumb, btn) + přidej `.farm-card` grid (responsivní `grid-template-columns: repeat(auto-fill, minmax(280px,1fr))`), `.eco-badge` (zelený štítek), `.farm-type-tag`. Drž barvy webu (#FFEA00 / #0A0A0B / zelená #0B7A3B).

- [ ] **Step 2: Ověř typy**

Run: `cd ~/agro-svet-farmy && npx astro check --minimumSeverity error 2>&1 | grep -i farmy | head`
Expected: žádná chyba odkazující na `farmy/index.astro`.

- [ ] **Step 3: Commit**

```bash
cd ~/agro-svet-farmy && git add src/pages/farmy/index.astro && \
git commit -m "feat(farmy): hub /farmy/ — seznam, Leaflet mapa, client filtry přes URL params"
```

---

### Task 5: Detail `/farmy/[slug]/`

Prerendered detail farmy + JSON-LD (breadcrumb + farmLocalBusiness) + malá mapa.

**Files:**
- Create: `src/pages/farmy/[slug]/index.astro`

- [ ] **Step 1: Napiš stránku**

```astro
---
export const prerender = true;
import Layout from '../../../layouts/Layout.astro';
import { getAllFarms, getFarm, FARM_PRODUCTS, FARM_TYPES, regionName } from '../../../lib/farmy';
import { breadcrumbSchema, farmLocalBusinessSchema } from '../../../lib/structured-data';

export function getStaticPaths() {
  return getAllFarms().map((f) => ({ params: { slug: f.slug } }));
}

const { slug } = Astro.params;
const farm = getFarm(slug!);
if (!farm) return Astro.redirect('/farmy/', 302);

const regName = regionName(farm.region);
const breadcrumbJsonLd = breadcrumbSchema([
  { name: 'Domů', url: '/' },
  { name: 'Farmy', url: '/farmy/' },
  { name: regName, url: `/farmy/kraj/${farm.region}/` },
  { name: farm.name, url: `/farmy/${farm.slug}/` },
]);
const farmJsonLd = farmLocalBusinessSchema({
  slug: farm.slug, name: farm.name, description: farm.description,
  region: regName, address: farm.address, lat: farm.lat, lng: farm.lng,
  products: farm.products.map((p) => FARM_PRODUCTS[p]),
  eco: farm.eco, tel: farm.contact?.tel, web: farm.contact?.web, email: farm.contact?.email,
  imageUrls: farm.photos,
});
---
```

Šablona: `<Layout title={`${farm.name} — prodej ze dvora (${regName}) | agro-svět.cz`} description={farm.description.slice(0,155)} canonical={`https://agro-svet.cz/farmy/${farm.slug}/`}>`:
- Oba JSON-LD bloky přes `<script type="application/ld+json" is:inline set:html={…} />`.
- Pokud `farm.photos?.length` → malá galerie/hero, jinak placeholder.
- Leaflet CSS `<link slot="head">` (stejné 3 tagy) — malá mapa s jedním markerem (`L.map(...).setView([farm.lat,farm.lng],13)` + `L.marker`). Souřadnice předej do skriptu přes `data-lat`/`data-lng` atributy na `#farm-map` divu (NE inline interpolace do scoped `<script>`, ten nevidí frontmatter proměnné — čti z `document.getElementById('farm-map').dataset`). MarkerCluster zde netřeba (1 bod) — stačí čistý Leaflet, načti jen `leaflet.js`.
- Breadcrumb nav, H1 = `farm.name`, štítek `FARM_TYPES[farm.farm_type]`, eko-badge + `eco_cert` když je.
- Sekce: popis, seznam produktů (chips z `FARM_PRODUCTS`), kontakt (web/tel/email jako odkazy, opening), adresa + kraj (odkaz na `/farmy/kraj/${farm.region}/` pokud existuje landing — jinak prostý text).
- „← Zpět na seznam farem" odkaz na `/farmy/`.
- Scoped `<style>` v duchu webu.

- [ ] **Step 2: Ověř typy**

Run: `cd ~/agro-svet-farmy && npx astro check --minimumSeverity error 2>&1 | grep -i "farmy/\[slug\]" | head`
Expected: žádná chyba.

- [ ] **Step 3: Commit**

```bash
cd ~/agro-svet-farmy && git add "src/pages/farmy/[slug]/index.astro" && \
git commit -m "feat(farmy): detail /farmy/[slug]/ s JSON-LD GroceryStore + mapou"
```

---

### Task 6: Krajský landing `/farmy/kraj/[kraj]/`

SEO landing per kraj — JEN pro kraje s ≥3 farmami (`regionsWithEnoughFarms`).

**Files:**
- Create: `src/pages/farmy/kraj/[kraj]/index.astro`

- [ ] **Step 1: Napiš stránku**

```astro
---
export const prerender = true;
import Layout from '../../../../layouts/Layout.astro';
import { getFarmsByRegion, regionsWithEnoughFarms, regionName, FARM_TYPES } from '../../../../lib/farmy';
import type { CzKraj } from '../../../../lib/cap-dotace';
import { breadcrumbSchema, itemListSchema } from '../../../../lib/structured-data';

export function getStaticPaths() {
  // Jen kraje s ≥3 farmami — thin-content guard. Ostatní route nemají (404).
  return regionsWithEnoughFarms(3).map((r) => ({ params: { kraj: r.slug } }));
}

const { kraj } = Astro.params;
const region = kraj as CzKraj;
const farms = getFarmsByRegion(region);
const name = regionName(region);

const breadcrumbJsonLd = breadcrumbSchema([
  { name: 'Domů', url: '/' },
  { name: 'Farmy', url: '/farmy/' },
  { name, url: `/farmy/kraj/${region}/` },
]);
const listJsonLd = itemListSchema(
  farms.map((f) => ({ url: `/farmy/${f.slug}/`, name: f.name })),
  `Farmy — ${name}`,
);
---
```

Šablona: `<Layout title={`Farmy v kraji ${name} — prodej ze dvora | agro-svět.cz`} description={`Vybrané farmy prodávající ze dvora v kraji ${name}. ${farms.length} farem — brambory, zelenina, mléko, maso, med a další.`} canonical={`https://agro-svet.cz/farmy/kraj/${region}/`}>`:
- Oba JSON-LD bloky.
- Breadcrumb, H1 = `Farmy v kraji ${name}`, krátký intro odstavec.
- Grid karet farem (znovupoužij stejný `.farm-card` markup jako hub — zkopíruj strukturu, scoped style v této stránce).
- „← Všechny farmy" odkaz na `/farmy/`.
- (Bez mapy/filtrů — landing je úzce zacílený na kraj; mapa je na hubu.)

- [ ] **Step 2: Ověř typy**

Run: `cd ~/agro-svet-farmy && npx astro check --minimumSeverity error 2>&1 | grep -i "farmy/kraj" | head`
Expected: žádná chyba.

- [ ] **Step 3: Commit**

```bash
cd ~/agro-svet-farmy && git add "src/pages/farmy/kraj/[kraj]/index.astro" && \
git commit -m "feat(farmy): krajský landing /farmy/kraj/[kraj]/ (≥3 farmy, thin-content guard)"
```

---

### Task 7: Navigace + sitemap

Přidat „Farmy" do menu a farmy URL do sitemapy.

**Files:**
- Modify: `src/components/Header.astro:57` (nav array)
- Modify: `src/pages/sitemap.xml.ts`

- [ ] **Step 1: Přidej nav item do `Header.astro`**

V `nav: NavItem[]` před `{ label: 'Agro bazar', href: '/bazar/' }` (řádek 57) vlož:

```ts
  { label: 'Farmy', href: '/farmy/' },
```

(Top-level bez children — V1 nemá podsekce. `current.startsWith('/farmy/')` aktivní detekce funguje automaticky.)

- [ ] **Step 2: Rozšiř `sitemap.xml.ts`**

V `import` řádku přidej farmy loader. Za `import { getAllDruhy } from '../lib/plemena';` (řádek 4) přidej:

```ts
import { getAllFarms, regionsWithEnoughFarms } from '../lib/farmy';
```

Do `staticPaths` array (mezi bazar a stroje bloky, ~řádek 108) přidej:

```ts
    ['/farmy/', 'weekly', '0.8', STATIC_LASTMOD],
```

Před `const xml = …` (~řádek 327) přidej enumerace:

```ts
  // Farmy — hub má vlastní záznam výše; zde detaily + krajské landingy.
  for (const f of getAllFarms()) {
    urls.push({
      loc: `${SITE_URL}/farmy/${f.slug}/`,
      changefreq: 'monthly',
      priority: '0.7',
      lastmod: STATIC_LASTMOD,
      images: f.photos && f.photos.length > 0 ? [f.photos[0]] : undefined,
    });
  }
  for (const r of regionsWithEnoughFarms(3)) {
    urls.push({ loc: `${SITE_URL}/farmy/kraj/${r.slug}/`, changefreq: 'weekly', priority: '0.7', lastmod: STATIC_LASTMOD });
  }
```

(Limit: sitemapa je daleko pod 50k URL; 6 farem + ≤14 krajů je zanedbatelné. Žádný cap netřeba.)

- [ ] **Step 3: Ověř typy**

Run: `cd ~/agro-svet-farmy && npx astro check --minimumSeverity error 2>&1 | grep -iE "header|sitemap" | head`
Expected: žádná nová chyba.

- [ ] **Step 4: Commit**

```bash
cd ~/agro-svet-farmy && git add src/components/Header.astro src/pages/sitemap.xml.ts && \
git commit -m "feat(farmy): přidat Farmy do menu + farmy URL do sitemapy"
```

---

### Task 8: Plný build verify + PR

Ověřit, že celá sekce prerenderuje (hardlink node_modules), pak PR. **Deploy NE — čeká na schválení uživatele.**

- [ ] **Step 1: Spusť všechny testy**

Run: `cd ~/agro-svet-farmy && npm run test`
Expected: PASS (vč. nových `farmy.test.ts` + `farmy-schema.test.ts`, žádná regrese).

- [ ] **Step 2: Plný produkční build**

Run: `cd ~/agro-svet-farmy && npm run build 2>&1 | tail -30`
Expected: build OK; v outputu prerendered `/farmy/index.html`, `/farmy/data.json`, `/farmy/<slug>/index.html` (6×), `/farmy/kraj/<kraj>/index.html` (kraje s ≥3 farmami). Žádné `Symlink points out of the filesystem root` (hardlink node_modules to ošetřil), žádná chyba prerenderu.

- [ ] **Step 3: Ověř vygenerované stránky**

Run: `cd ~/agro-svet-farmy && find dist -path "*farmy*" -name "*.html" | sort && ls dist/farmy/data.json 2>/dev/null && echo OK`
Expected: hub + 6 detailů + krajské landingy + data.json existují.

- [ ] **Step 4: Push + PR**

```bash
cd ~/agro-svet-farmy && git push -u origin feat/farmy && \
gh pr create --title "feat: Farmy V1 — seznam, mapa, detail, filtry (/farmy/)" \
  --body "$(cat <<'EOF'
## Farmy V1

Kurovaný adresář vybraných farem prodávajících ze dvora dle schváleného specu (`docs/superpowers/plans/2026-05-31-farmy-seznam-mapa.md`).

### Co je hotové
- `src/data/farmy/*.yaml` — 6 seed farem (YAML, vzor /stroje/), read-only, prerendered.
- `lib/farmy.ts` — loader, filtr, krajské helpery (znovupoužívá KRAJE z cap-dotace). Vitest pokrytí.
- `/farmy/` — hub: seznam karet + Leaflet+MarkerCluster mapa + filtry (kraj/produkt/eko/fulltext) přes URL params.
- `/farmy/[slug]/` — prerendered detail + schema.org GroceryStore JSON-LD + mapa.
- `/farmy/kraj/[kraj]/` — krajský SEO landing jen pro kraje s ≥3 farmami (thin-content guard).
- „Farmy" v hlavním menu + farmy URL v sitemap.xml.

### Odchylky od specu
- Krajský landing je `/farmy/kraj/[kraj]/` (ne `/farmy/[kraj]/`) — jinak koliduje s `/farmy/[slug]/`; odpovídá konvenci `/bazar/kraj/`.

### Mimo rozsah (fáze 2)
HP carousel, průvodce, hodnocení, user fotky → trigger migrace YAML→Supabase.

### Deploy
Manuální `npm run deploy` (wrangler + cf-purge) až po schválení.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```
Expected: PR vytvořen, vrátí URL.

- [ ] **Step 5: Reportuj URL PR uživateli a počkej na schválení před deployem.**

---

## Self-Review

- **Spec coverage:** seznam+mapa+detail+filtry (Tasks 4–5) ✓; YAML úložiště jako /stroje/ (Task 1) ✓; ruční kurace ~6 farem (Task 1) ✓; Leaflet+cluster vzor /bazar/mapa (Task 4) ✓; schema.org LocalBusiness (Task 3+5) ✓; filtry kraj/produkt/eko/fulltext přes URL params (Task 4) ✓; krajský landing jen kde ≥N farem (Task 6) ✓; Farmy v menu + sitemap (Task 7) ✓; HP carousel/průvodce mimo V1 ✓. Eko příznak diferenciace (Task 1 `eco`/`eco_cert`) ✓.
- **Type consistency:** `Farm`, `FarmProduct`, `FarmType`, `CzKraj` konzistentní napříč Tasks 1–7. `farmLocalBusinessSchema` signatura (`FarmForSchema`) sedí s voláním v Task 5. `regionsWithEnoughFarms(3)` použito stejně v Tasks 4/6/7. `/farmy/data.json` kompaktní klíče (Task 2) konzumované klientem v Task 4.
- **Placeholder scan:** žádné TBD — kód je konkrétní; .astro šablony popsané krok-po-kroku s odkazy na přesné zdrojové řádky vzorů k zkopírování.
