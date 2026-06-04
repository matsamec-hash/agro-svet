# Fáze — SK lokalizace katalogu strojů (detail série + model + popisy modelů)

**Datum:** 2026-06-04
**Projekt:** agro-svet.cz i18n (navazuje na fáze 1c/2b — viz `project-agro-svet-i18n-localization`)
**Rozhodnutí uživatele:** varianta **B** — plně slovenské model-stránky **včetně popisů modelů** přes existující překladovou pipeline.

## Problém

`/stroje` je launchnutá SK sekce (indexovatelná, `SK_LAUNCHED_PREFIXES`). Hub, brand a kategorie už jsou SK (fáze 1c + #65). ALE:

1. **`stroje/[brand]/[series]/[model]/index.astro`** (prerender=false → **indexovatelné na /sk**) nemá VŮBEC locale — žádné `Astro.locals.locale`, `useTranslations`. Servíruje ~50 hardcoded českých řetězců (spec labely, nadpisy sekcí, CTA, breadcrumb, meta šablona) + český `generateModelFaq` + **`model.description` v češtině** (overlay pro modely neexistuje). Tisíce SK model-URL = český obsah označený `index,follow` + hreflang sk.
2. **`stroje/[brand]/[series]/index.astro`** (prerender=true) je rovněž plně český, navíc pod /sk **404** (prerendered, middleware-rewrite nepokrývá) → SK breadcrumb série + browse path brand→série→model je rozbitý.
3. **Overlay + pipeline se zastaví u série** — `localizeBrand()` overlayuje `country/description/categories/series.description`, ale ne `model.description`; `i18n-translate.py do_stroje` netranslatuje modely.

## Cíl

Plně slovenské, koherentní katalogové detailní stránky pod /sk: série i modely renderují SK chrome + SK prose (popis série i modelu), s validním breadcrumbem a browse pathem, CS výstup byte-identický, `index,follow` + reciproční hreflang.

## Rozsah (in / out)

**IN:**
- Datová vrstva: rozšířit overlay o per-model popisy (Option A — `models:` mapa v existujícím `src/data/stroje/sk/<brand>.yaml`).
- Pipeline: `i18n-translate.py do_stroje` navíc extrahuje + překládá `model.description` → `models:` blok.
- Lokalizace stránky **`[model]/index.astro`** (locale plumbing, ~50 SK klíčů, SK `model.description` přes overlay, lokalizovaný FAQ, breadcrumb/Product JSON-LD `inLanguage`, lokalizovaná `pageTitle`/`pageDesc` šablona).
- Lokalizace stránky **`[series]/index.astro`** (prerender=true → **false** SSR + edge cache, locale plumbing, SK klíče, SK `series.description` přes overlay).
- Lokalizace **`generateModelFaq`** (locale param + SK šablony).
- Backfill SK popisů modelů přes pipeline (22 značek).

**OUT (v této fázi — explicitní non-goals):**
- `engine` / `transmission` / hodnoty `specs` zůstávají CZ (technické/číselné, jazykově ~neutrální; překládají se jen **labely**). Volitelná fáze B2.
- UK lokalizace (Fáze 3).
- Nelaunchnuté sekce (plemena/vcelarstvi/…).

## Design

### 1. Datová vrstva (`src/lib/stroje.ts`)

Rozšířit `StrojOverlay` o `models`:
```ts
interface StrojOverlay {
  country?: string;
  description?: string;
  categories?: Record<string, string>;
  series?: Record<string, string>;
  models?: Record<string, string>;   // NEW: model.slug -> SK description
}
```
V `localizeBrand()` do série-loopu (po `s.description`) doplnit overlay modelů:
```ts
for (const m of s.models || []) {
  if (ov.models?.[m.slug]) m.description = ov.models[m.slug];
}
```
**Locale-aware přístup pro model/series stránky:** dnes stránky čtou `getSeries(brandSlug, seriesSlug)` / `getAllModels()` (locale-blind). Přidat locale param:
- `getSeries(brandSlug, seriesSlug, locale='cs')` → interně `getBrand(brandSlug, locale)` a najít sérii (dostane overlaid series.description i model.description). cs větev = beze změny (byte-identita).
- Model stránka: získat sérii+model přes locale-aware cestu (`getBrand(brand, locale)` → najít series → model), aby `model.description` byl SK.
- **POZOR cache:** `getAllBrands()` cachuje cs brandy; `localizeBrand` dělá `structuredClone` → SK nemutuje cache. OK.

### 2. Pipeline (`scripts/i18n-translate.py` `do_stroje`)

Do `payload` přidat modely (prefix `__model__` kvůli kolizi slug série×model):
```python
for s in (cat.get("series") or []):
    if s.get("description"):
        payload[str(s["slug"])] = s["description"].strip()
    for m in (s.get("models") or []):
        if m.get("description"):
            payload[f"__model__{m['slug']}"] = m["description"].strip()
```
Při sestavování YAML oddělit `__model__*` klíče do `models:` bloku (analogicky k `__cat__`). Glosář + GEO pravidla beze změny (drží ČR-trhová fakta). Blokový protokol `<<<F:key>>>` zachován.

### 3. Stránka `[model]/index.astro`

- `const locale = Astro.locals.locale ?? getLocaleFromUrl(Astro.url)` + `const t = useTranslations(locale)` (+ `tf`/`plural`).
- Nahradit hardcoded mapy/řetězce `t()` klíči (viz §5). `categoryLabels`/`categorySingular` → klíče.
- `model.description` čerpat z locale-aware loaderu (SK overlay, fallback CS když chybí — graceful, zůstává indexovatelné).
- `pageTitle`/`pageDesc` šablona lokalizovaná (`tf`).
- `breadcrumbJsonLd` + `machineProductSchema` → lokalizované names + `localizePath` URL + `inLanguage` (sk-SK na sk) — vzor z PR #68.
- `generateModelFaq({..., locale})`.
- Bazar widget plurály přes `plural(locale, n, {...})`.

### 4. Stránka `[series]/index.astro`

- `export const prerender = false` (z `true`) + edge `Cache-Control` (vzor model/statistiky/puda).
- Locale plumbing; SK `series.description` přes `getSeries(..., locale)`; SK chrome klíče (sdílené se §5 kde dává smysl).
- Breadcrumb/JSON-LD lokalizované.
- **Důsledek:** odstraní /sk 404 série → validní browse path + breadcrumb item.

### 5. SK i18n klíče (`src/i18n/ui/cs.ts` + `sk.ts`)

~50 nových klíčů, namespace `cat.s.d.*` (detail strojů). **CS hodnota MUSÍ být verbatim současný hardcode** (byte-identita CS). Kategorie:
- spec labely: `Výkon, Motor, Převodovka, Hmotnost, Záběr žacího stolu, Objem bunkru, Roky výroby` + 5 custom z `specLabels`.
- spec-group labely: `Výkon & provoz, Pohon & motor, Rozměry & kapacita, Vybavení`.
- nadpisy sekcí: `Technické parametry, Konkurence ve výkonové třídě, Časté otázky, Pro jakou farmu se {brand} {model} hodí, Další modely v řadě {series}`.
- CTA / odkazy: `Porovnat parametry →, Všechny modely →, Celá řada {series}, Přidat vlastní inzerát, Zobrazit {count} inzerát…`.
- meta/šablony: pageDesc fallback, `— parametry a cena`, `–dosud`, editorial bar.
- plurály (inzerát/parametr/model) přes `plural()`.
- parity test `tests/i18n/stroje-detail.test.ts` (cs verbatim, sk vyplněné, CS_ONLY filtr prázdný).

### 6. FAQ generátor (`src/lib/faq-generator.ts`)

- `generateModelFaq(input, locale='cs')`; cs větve = doslovné originály (byte-identita konstrukcí); SK paralelní šablony (glosář: výkon→výkon, hmotnosť, prevodovka, vyrábal sa…). Snapshot test (cs zachycený z HEAD + sk sanity).

## Gates / verifikace

- `astro build` zelený (**Node 22** — `nvm use 22`), `vitest` zelený.
- **CS byte-identita:** SSR stránky nejdou diffovat staticky → ověřit `astro dev` before/after na cs `/stroje/<brand>/<series>/<model>/` a `/stroje/<brand>/<series>/` (whitespace-collapsed identické). Pomoct může build-diff prerendered částí.
- **Dev smoke /sk:** `/sk/stroje/zetor/<series>/<model>/` = lang=sk, index/follow, self-canonical /sk/, SK labely + SK FAQ + SK popis; série /sk 200 (ne 404); breadcrumb SK + /sk URL; cs verze nezměněná + reciproční sk hreflang.
- **Worker bundle < 3 MiB** gzip (lekce #61 — žádné nové těžké závislosti; FAQ/markdown bez shiki).
- cizí 6 OG PNG + node_modules untracked → NIKDY `git add -A`.

## Rizika

- **Highest-traffic katalog** → CS regrese kritická. Mitigace: byte-identita gate, cs klíče verbatim, per-task `git show --stat` scope verify, subagent-driven + review.
- **`[series]` SSR flip** zvyšuje Worker invokace → edge cache (`Cache-Control s-maxage`) jako u modelů.
- **Backfill cost** (22 značek × N modelů přes sonnet→opus). Mitigace: opus jen editor na krátkých textech (popisy modelů jsou 1–2 věty), běžet po značkách, QA sweep ř/ě/ů v `models:` blocích.
- Modely bez SK overlaye → fallback na CS popis (graceful, stránka zůstává indexovatelná). Není blocker pro launch.

## Plán exekuce

Subagent-driven, 1 commit/task, dvoustupňové review, finální code-review. Pořadí:
1. Data vrstva (`StrojOverlay.models` + `localizeBrand` + `getSeries(...,locale)`) + testy.
2. Pipeline `do_stroje` modely + ruční ověření na 1 značce (zetor).
3. SK i18n klíče `cat.s.d.*` + parity test.
4. FAQ generátor locale + snapshot.
5. `[model]` stránka lokalizace.
6. `[series]` stránka SSR + lokalizace.
7. Backfill 22 značek + QA sweep.
8. Verifikace (build/test/byte-identita/dev smoke) + PR (squash do master; deploy user-gated).
