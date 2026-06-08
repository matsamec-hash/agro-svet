# UK lokalizace Fáze 2 — stroje/srovnání/značky/encyklopedie — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Zlokalizovat do ukrajinštiny obsahová těla sekcí `/stroje`, `/srovnani`, `/znacky`, `/encyklopedie` a zapnout jejich indexaci pod `/uk`, beze změny CZ a SK výstupu.

**Architecture:** Zrcadlí hotový SK vzor. Próza strojů = locale-generické YAML overlaye (`src/data/stroje/uk/`); značky/encyklopedie = paralelní Astro content kolekce (`znacky-uk`, `encyklopedie-uk`); srovnání = uk větve v generátorech. Indexace řízena zobecněním SK-specifického `isSkLaunchedPath` na per-locale `isLaunchedPath(locale, path)` + `LAUNCHED_PREFIXES`. Próza vzniká AI překladem + AI review pass přes paralelní subagenty.

**Tech Stack:** Astro 6 SSR, Cloudflare Workers (wrangler), Vitest, YAML + Markdown content collections, Node 22.

**Spec:** `docs/superpowers/specs/2026-06-07-agro-svet-i18n-uk-faze2-stroje-content-design.md`
**Branch:** `feat/i18n-uk-faze2-stroje` (již založena). Exekuce ideálně ve worktree (viz provozní lekce).

---

## Tvrdá pravidla (platí pro KAŽDÝ task)

1. **CZ výstup se nesmí změnit** — cs větve generátorů zůstávají byte-identické (chrání je `tests/lib/comparison-insights.test.ts` a `tests/lib/faq-generator.test.ts`). Po každém zásahu do generátorů spustit tyto testy.
2. **SK výstup se nesmí změnit** — `isSkLaunchedPath` zachovat jako funkční alias; SK launch testy (`tests/i18n/statistiky-launch.test.ts`) musí zůstat zelené.
3. **Slug se nepřekládá** (URL = cs slug). Strukturální pole (čísla, URL, datumy, `slug`, `znacka`, `wikidata`, `heroImage`, `youtubeId`) zůstávají identické.
4. **Žádné `git add -A`** — přidávat soubory explicitně (repo má `.env.save` chráněný push-protection).
5. Test runner: `npx vitest run <cesta>`. Build: `nvm use 22 && npm run build`.

---

## File Structure

**Modifikované (kód):**
- `src/i18n/utils.ts` — přidat `LAUNCHED_PREFIXES`, `isLaunchedPath`; přepojit `navHref`/`langSwitchHref` na per-locale. `isSkLaunchedPath` zůstává jako alias.
- `src/layouts/Layout.astro` (ř. 66–122) — per-locale `effectiveNoindex` + hreflang cs/sk/uk dle nezávislých launched flagů.
- `src/pages/sitemap.xml.ts` (ř. 386–415) — uk mirror analogicky k sk.
- `src/content.config.ts` — kolekce `znackyUk`, `encyklopedieUk`.
- `src/pages/znacky/[slug].astro` (ř. 20–22) — per-locale výběr kolekce.
- `src/pages/encyklopedie/[slug].astro` (ř. 13–22) — per-locale výběr kolekce.
- `src/lib/faq-generator.ts` — `L(cs, sk)` → locale-keyed; uk větve.
- `src/lib/competitor-finder.ts` — `useCaseDescription` uk větve.
- `src/lib/comparison-insights.ts` — uk větve (`farmSizeClause` + ostatní).

**Vytvořené (obsah, produkce subagenty):**
- `src/data/stroje/uk/*.yaml` — 24 overlay souborů.
- `src/content/znacky-uk/*.md` — ~24 profilů značek.
- `src/content/encyklopedie-uk/*.md` — ~44 detailů strojů.

**Modifikované (testy):**
- `tests/i18n/utils.test.ts`, nový `tests/i18n/uk-launch.test.ts`
- `tests/lib/stroje.test.ts`, `tests/lib/faq-generator.test.ts`, `tests/lib/comparison-insights.test.ts`
- nový `tests/i18n/uk-collections.test.ts`

---

# GROUP A — Kódová prerekvizita: per-locale launched machinery

## Task A1: `isLaunchedPath` + `LAUNCHED_PREFIXES` v utils.ts

**Files:**
- Modify: `src/i18n/utils.ts:29-36`
- Test: `tests/i18n/utils.test.ts`

- [ ] **Step 1: Napsat padající test**

Přidat do `tests/i18n/utils.test.ts` (import rozšířit o `isLaunchedPath, LAUNCHED_PREFIXES`):

```ts
import {
  getLocaleFromUrl, stripLocale, localizePath, getAlternates, isSkLaunchedPath, langSwitchHref,
  isLaunchedPath, LAUNCHED_PREFIXES,
} from '../../src/i18n/utils';

describe('isLaunchedPath (per-locale)', () => {
  it('cs nemá nic launchnuto (default bez prefixu)', () => {
    expect(LAUNCHED_PREFIXES.cs).toEqual([]);
    expect(isLaunchedPath('cs', '/stroje/')).toBe(false);
  });
  it('sk = zachované chování isSkLaunchedPath', () => {
    expect(isLaunchedPath('sk', '/stroje/')).toBe(isSkLaunchedPath('/stroje/'));
    expect(isLaunchedPath('sk', '/stroje/john-deere/')).toBe(true);
    expect(isLaunchedPath('sk', '/bazar/')).toBe(false);
  });
  it('isSkLaunchedPath je tenký alias na isLaunchedPath("sk", …)', () => {
    expect(isSkLaunchedPath('/znacky/')).toBe(isLaunchedPath('sk', '/znacky/'));
  });
});
```

- [ ] **Step 2: Spustit test → FAIL**

Run: `npx vitest run tests/i18n/utils.test.ts`
Expected: FAIL — `isLaunchedPath`/`LAUNCHED_PREFIXES` is not exported.

- [ ] **Step 3: Implementovat**

Nahradit v `src/i18n/utils.ts` blok ř. 29–36:

```ts
import { locales, defaultLocale, isLocale, type Locale } from './config';
```
(import už existuje — `Locale` typ je k dispozici.)

```ts
/** Per-locale launchnuté (přeložené → indexovatelné) prefixy. cs je default bez
 *  prefixu, gating se na něj neaplikuje. Zbytek dané /<locale> sekce zůstává
 *  noindex (servíruje cs tělo) dokud není lokalizován. */
export const LAUNCHED_PREFIXES: Record<Locale, string[]> = {
  cs: [],
  sk: ['/stroje', '/znacky', '/srovnani', '/novinky', '/kalkulacka', '/dotace', '/statistiky', '/puda', '/encyklopedie', '/jak-na-to', '/podminky-pouziti', '/zpracovani-osobnich-udaju', '/dsa-kontakt', '/redakce'],
  uk: [],
};

/** True, pokud cs-root cesta patří do launchnuté sekce daného locale. */
export function isLaunchedPath(locale: Locale, csRootPath: string): boolean {
  return (LAUNCHED_PREFIXES[locale] ?? []).some((p) => csRootPath === p || csRootPath.startsWith(`${p}/`));
}

/** Zpětně kompatibilní SK alias (volá ho Layout/sitemap; ponecháno kvůli minimal-diff). */
export const SK_LAUNCHED_PREFIXES = LAUNCHED_PREFIXES.sk;
export function isSkLaunchedPath(csRootPath: string): boolean {
  return isLaunchedPath('sk', csRootPath);
}
```

- [ ] **Step 4: Spustit test → PASS**

Run: `npx vitest run tests/i18n/utils.test.ts`
Expected: PASS. Pak `npx vitest run tests/i18n/statistiky-launch.test.ts` → PASS (SK alias nezměněn).

- [ ] **Step 5: Commit**

```bash
git add src/i18n/utils.ts tests/i18n/utils.test.ts
git commit -m "feat(i18n): per-locale isLaunchedPath + LAUNCHED_PREFIXES (SK alias zachován)"
```

---

## Task A2: navHref/langSwitchHref per-locale

**Files:**
- Modify: `src/i18n/utils.ts:47-69`
- Test: `tests/i18n/utils.test.ts`

- [ ] **Step 1: Napsat padající test**

```ts
describe('navHref/langSwitchHref per-locale (uk před launchem)', () => {
  it('uk: nelaunchnutá sekce zůstává na cs href (žádný /uk prefix)', () => {
    // LAUNCHED_PREFIXES.uk je zatím [] → /stroje není pro uk launchnuté
    expect(navHref('uk', '/stroje/')).toBe('/stroje/');
  });
  it('sk: launchnutá sekce dostane /sk prefix (beze změny)', () => {
    expect(navHref('sk', '/stroje/')).toBe('/sk/stroje/');
  });
  it('langSwitchHref uk: nelaunchnutá sekce → uk hub', () => {
    expect(langSwitchHref('uk', '/stroje/', [])).toBe('/uk/');
  });
});
```
(import `navHref` doplnit do hlavičky testu.)

- [ ] **Step 2: Spustit → FAIL**

Run: `npx vitest run tests/i18n/utils.test.ts`
Expected: FAIL — `navHref('uk','/stroje/')` dnes vrací `/uk/stroje/` (používá SK prefixy pro všechny non-cs).

- [ ] **Step 3: Implementovat**

V `src/i18n/utils.ts` nahradit `navHref` (ř. 47–53):

```ts
export function navHref(locale: Locale, href: string): string {
  if (locale === defaultLocale) return href;
  const root = href.replace(/\/+$/, '') || '/';
  if (root === '/') return localizePath(locale, href);
  if (isLaunchedPath(locale, root) && !SK_PRERENDERED_NAV_PATHS.includes(root)) return localizePath(locale, href);
  return href;
}
```

A `langSwitchHref` (ř. 60–69), změnit jen podmínku launchnutosti na per-target:

```ts
export function langSwitchHref(target: Locale, path: string, hiddenNewsCats: string[]): string {
  if (target === defaultLocale) return localizePath(target, path);
  const catMatch = path.match(/^\/novinky\/kategorie\/([^/]+)\/?$/);
  if (catMatch && hiddenNewsCats.includes(catMatch[1])) return localizePath(target, '/novinky/');
  const root = path.replace(/\/+$/, '') || '/';
  if (root !== '/' && (!isLaunchedPath(target, root) || SK_PRERENDERED_NAV_PATHS.includes(root))) {
    return localizePath(target, '/');
  }
  return localizePath(target, path);
}
```

- [ ] **Step 4: Spustit → PASS**

Run: `npx vitest run tests/i18n/utils.test.ts`
Expected: PASS. SK testy beze změny (sk launched prefixy stejné).

- [ ] **Step 5: Commit**

```bash
git add src/i18n/utils.ts tests/i18n/utils.test.ts
git commit -m "feat(i18n): navHref/langSwitchHref používají per-locale isLaunchedPath"
```

---

## Task A3: Layout.astro — per-locale noindex + hreflang cs/sk/uk

**Files:**
- Modify: `src/layouts/Layout.astro:66-122`

- [ ] **Step 1: Implementovat noindex + hreflang**

Nahradit ř. 66–79 (import `isLaunchedPath` do skriptu Layoutu — Layout importuje z `../i18n/utils`, doplnit `isLaunchedPath`):

```ts
// Launch je path-scoped a per-locale: indexují se jen přeložené sekce daného
// locale. cs se nemění (effectiveNoindex == noindex). SK chování beze změny.
const csRootPath = stripLocale(localizedPathname).path;
const locked = isLockedSectionPath(csRootPath);
const launchedForLocale = isLaunchedPath(locale, csRootPath) && !locked;
const effectiveNoindex = noindex || (locale === 'cs' ? false : !launchedForLocale);
// Reciproční hreflang: nezávisle per-locale (sk/uk emitujeme jen kde je sekce
// pro daný locale launchnutá). cs je vždy. x-default = cs.
const skLaunchedPath = isLaunchedPath('sk', csRootPath) && !locked;
const ukLaunchedPath = isLaunchedPath('uk', csRootPath) && !locked;
const anyAlt = skLaunchedPath || ukLaunchedPath;
const csRootCanonical = csRootPath.endsWith('/') ? csRootPath : `${csRootPath}/`;
const hreflangCsUrl = new URL(csRootCanonical, SITE_ORIGIN).toString();
const hreflangSkUrl = new URL(`/sk${csRootCanonical}`, SITE_ORIGIN).toString();
const hreflangUkUrl = new URL(`/uk${csRootCanonical}`, SITE_ORIGIN).toString();
```

Nahradit hreflang blok ř. 111–122:

```astro
  {anyAlt ? (
    <>
      <link rel="alternate" hreflang="cs" href={hreflangCsUrl} />
      {skLaunchedPath && <link rel="alternate" hreflang="sk" href={hreflangSkUrl} />}
      {ukLaunchedPath && <link rel="alternate" hreflang="uk" href={hreflangUkUrl} />}
      <link rel="alternate" hreflang="x-default" href={hreflangCsUrl} />
    </>
  ) : (
    <>
      <link rel="alternate" hreflang="cs" href={canonicalUrl} />
      <link rel="alternate" hreflang="x-default" href={canonicalUrl} />
    </>
  )}
```

- [ ] **Step 2: Ověřit cs/sk regresi buildem**

Před launchem (uk prefixy prázdné) je `ukLaunchedPath` vždy false → `anyAlt === skLaunchedPath` → hreflang blok produkuje pro launchnuté sk cesty cs+sk+x-default (sk dříve emitoval cs+sk+x-default) — **shodné**. Pro non-sk-launched: cs-only — **shodné**. cs `effectiveNoindex = noindex` — **shodné**.

Run: `nvm use 22 && npm run build`
Expected: build projde.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat(i18n): Layout per-locale noindex + hreflang cs/sk/uk (cs/sk beze změny)"
```

---

## Task A4: sitemap.xml.ts — uk mirror

**Files:**
- Modify: `src/pages/sitemap.xml.ts:13,404-415`

- [ ] **Step 1: Implementovat**

Rozšířit import ř. 13:

```ts
import { isSkLaunchedPath, isLaunchedPath } from '../i18n/utils';
```

Za `urls.push(...skMirror);` (ř. 415) přidat analogický uk mirror:

```ts
  // UK launch (Fáze 2-obsah): pre přeložené sekce přidáme /uk zrkadlové URL.
  // Stejné filtry jako sk (skryté dotace-detaily/kategorie + lock). Před launchem
  // je LAUNCHED_PREFIXES.uk prázdné → ukMirror == [] (žádná změna sitemapy).
  const ukMirror: UrlEntry[] = urls
    .filter((u) => {
      if (!u.loc.startsWith(SITE_URL)) return false;
      const p = u.loc.slice(SITE_URL.length);
      if (p.startsWith('/sk/')) return false; // nezrcadlit už zrcadlené sk URL
      if (isDotaceDetailPath(p)) return false;
      if (isSkHiddenCategoryPath(p)) return false;
      return isLaunchedPath('uk', p) && !isLockedSectionPath(p);
    })
    .map((u) => ({ ...u, loc: `${SITE_URL}/uk${u.loc.slice(SITE_URL.length)}` }));
  urls.push(...ukMirror);
```

> Pozn.: `ukMirror` filtruje `urls` PŘED appendem sk dotace-detailů (ř. 418–421 běží po něm? — ne, běží před). Filtr `p.startsWith('/sk/')` zajistí, že se nezrcadlí sk URL. Umístit blok HNED za `urls.push(...skMirror)` a PŘED `dotaceSkEntries` smyčku není nutné — ale aby ukMirror nezahrnul sk dotace detaily, drž ho hned za skMirror (sk dotace detaily se přidávají až za ním).

- [ ] **Step 2: Ověřit build (uk prefixy prázdné → sitemap beze změny)**

Run: `nvm use 22 && npm run build`
Expected: build projde; `dist` sitemap bez `/uk/` URL (prefixy zatím prázdné).

- [ ] **Step 3: Commit**

```bash
git add src/pages/sitemap.xml.ts
git commit -m "feat(i18n): sitemap uk mirror (no-op dokud nejsou uk prefixy launchnuté)"
```

---

# GROUP B — Kolekce + per-locale větvení stránek

## Task B1: content.config.ts — kolekce znackyUk + encyklopedieUk

**Files:**
- Modify: `src/content.config.ts:60-70,120-130,228`
- Create: `src/content/znacky-uk/.gitkeep`, `src/content/encyklopedie-uk/.gitkeep`
- Test: `tests/i18n/uk-collections.test.ts`

- [ ] **Step 1: Napsat padající test**

Create `tests/i18n/uk-collections.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { collections } from '../../src/content.config';

describe('uk overlay kolekce existují', () => {
  it('znackyUk a encyklopedieUk jsou registrované', () => {
    expect(collections).toHaveProperty('znackyUk');
    expect(collections).toHaveProperty('encyklopedieUk');
  });
});
```

- [ ] **Step 2: Spustit → FAIL**

Run: `npx vitest run tests/i18n/uk-collections.test.ts`
Expected: FAIL — `znackyUk`/`encyklopedieUk` neexistují.

- [ ] **Step 3: Implementovat**

V `src/content.config.ts` přidat za `encyklopedieSk` (ř. 70):

```ts
// UK-localizovaná overlay kolekce encyklopedie (slug = REUSE cs slug).
const encyklopedieUk = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/encyklopedie-uk' }),
  schema: encyklopedieSchema(),
});
```

Za `znackySk` (ř. 130):

```ts
// UK-localized brand profiles (overlay collection).
const znackyUk = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/znacky-uk' }),
  schema: znackySchema(),
});
```

Rozšířit export ř. 228:

```ts
export const collections = { novinky, encyklopedie, encyklopedieSk, encyklopedieUk, znacky, znackySk, znackyUk, puda, pudaSk, dotace, dotaceSk, howto, howtoSk };
```

Vytvořit prázdné adresáře:

```bash
mkdir -p src/content/znacky-uk src/content/encyklopedie-uk
touch src/content/znacky-uk/.gitkeep src/content/encyklopedie-uk/.gitkeep
```

- [ ] **Step 4: Spustit → PASS**

Run: `npx vitest run tests/i18n/uk-collections.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts src/content/znacky-uk/.gitkeep src/content/encyklopedie-uk/.gitkeep tests/i18n/uk-collections.test.ts
git commit -m "feat(i18n): registrovat uk overlay kolekce znackyUk + encyklopedieUk"
```

---

## Task B2: encyklopedie/[slug].astro — per-locale výběr kolekce

**Files:**
- Modify: `src/pages/encyklopedie/[slug].astro:12-29`

- [ ] **Step 1: Implementovat per-locale výběr (bez cs fallbacku)**

Nahradit ř. 12–22:

```ts
const locale = Astro.locals.locale ?? getLocaleFromUrl(Astro.url);
const t = useTranslations(locale);
const ENC_COLLECTION = { cs: 'encyklopedie', sk: 'encyklopedieSk', uk: 'encyklopedieUk' } as const;
const coll = ENC_COLLECTION[locale];
const base = locale === 'cs' ? '' : `/${locale}`;
Astro.response.headers.set('Cache-Control', 'public, max-age=600, s-maxage=3600, stale-while-revalidate=86400');

const { slug } = Astro.params;
const item = slug ? await getEntry(coll, slug) : undefined;
if (!item) return Astro.rewrite('/404'); // žádný cs fallback — chybějící uk/sk slug = 404
// Související čtou z lokalizované kolekce (overlay má stejné slug+znacka+kategorie).
const items = await getCollection(coll);
```

Zbytek souboru (ř. 23+) zůstává; `base` se už používá v `renderMarkdownWithLinks` (ř. 29). Ověřit, že žádné jiné místo nepoužívá `isSk` (pokud ano, nahradit `locale !== 'cs'`).

- [ ] **Step 2: Ověřit, že `isSk` se už nikde nepoužívá**

Run: `grep -n "isSk" src/pages/encyklopedie/[slug].astro`
Expected: žádný výskyt. Pokud nějaký, nahradit ekvivalentem (`locale !== 'cs'` nebo `base`).

- [ ] **Step 3: Build**

Run: `nvm use 22 && npm run build`
Expected: build projde (uk kolekce prázdná → uk detaily 404, ale build OK; cs/sk beze změny).

- [ ] **Step 4: Commit**

```bash
git add src/pages/encyklopedie/[slug].astro
git commit -m "feat(i18n): encyklopedie detail per-locale výběr kolekce (uk, no cs leak)"
```

---

## Task B3: znacky/[slug].astro — per-locale výběr kolekce

**Files:**
- Modify: `src/pages/znacky/[slug].astro:20-22`

- [ ] **Step 1: Implementovat per-locale výběr**

Nahradit ř. 20–22:

```ts
const { slug } = Astro.params;
// Overlay kolekce dle locale; cs fallback zachován jako u SK (před launchem je
// uk noindex, a launch nastane až po plné pokrytí všech ~24 značek).
const ZN_COLLECTION = { sk: 'znackySk', uk: 'znackyUk' } as const;
const localized = locale !== 'cs' ? await getEntry(ZN_COLLECTION[locale as 'sk' | 'uk'], slug!) : undefined;
const znacka = localized ?? await getEntry('znacky', slug!);
if (!znacka) return Astro.rewrite('/404');
```

Ověřit `aktualizovanoStr` (ř. 34): dnes `locale === 'sk' ? 'sk-SK' : 'cs-CZ'`. Rozšířit na uk:

```ts
const aktualizovanoStr = aktualizovano
  ? new Intl.DateTimeFormat(locale === 'sk' ? 'sk-SK' : locale === 'uk' ? 'uk-UA' : 'cs-CZ', { month: 'long', year: 'numeric' }).format(aktualizovano)
  : null;
```

- [ ] **Step 2: Build**

Run: `nvm use 22 && npm run build`
Expected: build projde.

- [ ] **Step 3: Commit**

```bash
git add src/pages/znacky/[slug].astro
git commit -m "feat(i18n): znacky detail per-locale výběr kolekce (uk) + uk-UA datum"
```

---

# GROUP C — Generátory: uk podpora

## Task C1: faq-generator.ts — locale-keyed L + uk próza

**Files:**
- Modify: `src/lib/faq-generator.ts`
- Test: `tests/lib/faq-generator.test.ts`

- [ ] **Step 1: Napsat padající test (uk varianta)**

Přidat do `tests/lib/faq-generator.test.ts`:

```ts
it('uk = ukrajinská próza (cyrilice), žádné latinkové cs/sk zbytky v otázkách', () => {
  const model = { name: '6R 250', slug: 'jd-6r-250', power_hp: 250, power_kw: 186, engine: 'PowerTech PSS' } as any;
  const faq = generateModelFaq({ brand: { name: 'John Deere' }, model, category: 'traktory', categorySingular: 'трактор', locale: 'uk' });
  expect(faq).not.toBeNull();
  expect(faq![0].q).toMatch(/[Ѐ-ӿ]/); // obsahuje cyrilici
});
```

- [ ] **Step 2: Spustit → FAIL**

Run: `npx vitest run tests/lib/faq-generator.test.ts`
Expected: FAIL — uk dnes spadne na cs (`isSk=false`), otázka je latinkou, regex neprojde.

- [ ] **Step 3: Refaktor signatury L → 3 jazyky + uk próza**

V `src/lib/faq-generator.ts` nahradit ř. 34–36:

```ts
  const L = (cs: string, sk: string, uk: string): string => (locale === 'sk' ? sk : locale === 'uk' ? uk : cs);
  const fmtNumber = (n: number): string => n.toLocaleString(locale === 'sk' ? 'sk-SK' : locale === 'uk' ? 'uk-UA' : 'cs-CZ');
```

Pak KAŽDÉ volání `L(cs, sk)` rozšířit na `L(cs, sk, uk)` s ukrajinskou variantou. **Tuto prózu vyrobit překladovým subagentem** (viz dispatch níže), NE ručně. cs i sk argumenty zůstávají byte-identické (chrání je existující byte-identity test).

Dispatch (superpowers:dispatching-parallel-agents → 1 překlad + 1 review):
- **Překlad subagent:** „V souboru `src/lib/faq-generator.ts` má každý `L(cs, sk)` dva jazykové argumenty. Přidej třetí argument = ukrajinský překlad (zachovej interpolace `${...}`, čísla, strukturu). cs a sk argumenty NEMĚŇ ani o znak. Odborná zemědělská/strojní terminologie, přirozená ukrajinština. Vrať celý upravený soubor."
- **Review subagent:** „Zkontroluj uk argumenty v `faq-generator.ts`: správnost terminologie, přirozenost, zachované interpolace/čísla, neporušené cs/sk argumenty. Oprav a vrať celý soubor."

- [ ] **Step 4: Spustit testy → PASS**

Run: `npx vitest run tests/lib/faq-generator.test.ts`
Expected: PASS — cs byte-identita (existující test) i nový uk cyrilice test.

- [ ] **Step 5: Commit**

```bash
git add src/lib/faq-generator.ts tests/lib/faq-generator.test.ts
git commit -m "feat(i18n): faq-generator uk próza (cs/sk byte-identita zachována)"
```

---

## Task C2: competitor-finder.ts — useCaseDescription uk

**Files:**
- Modify: `src/lib/competitor-finder.ts:72-124`
- Test: `tests/lib/comparison-insights.test.ts` (nebo nový `tests/lib/competitor-finder.test.ts`)

- [ ] **Step 1: Napsat padající test**

Create `tests/lib/competitor-finder.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { useCaseDescription } from '../../src/lib/competitor-finder';

describe('useCaseDescription locale', () => {
  it('cs (default) beze změny', () => {
    expect(useCaseDescription('traktory', 40, 'cs')).toContain('Kompaktní traktor');
  });
  it('uk = cyrilice', () => {
    expect(useCaseDescription('traktory', 40, 'uk')).toMatch(/[Ѐ-ӿ]/);
  });
  it('null kategorie/power → null', () => {
    expect(useCaseDescription('pluhy' as any, 100, 'uk')).toBeNull();
  });
});
```

- [ ] **Step 2: Spustit → FAIL**

Run: `npx vitest run tests/lib/competitor-finder.test.ts`
Expected: FAIL — uk dnes spadne na cs (`sk=false`), regex cyrilice neprojde.

- [ ] **Step 3: Refaktor + uk próza**

Nahradit ř. 77 `const sk = locale === 'sk';` za locale-keyed helper a všechny `sk ? A : B` přepsat na 3-cestné. Vzor:

```ts
  const pick = (cs: string, sk: string, uk: string): string => (locale === 'sk' ? sk : locale === 'uk' ? uk : cs);
```
a každý `return sk ? '<sk>' : '<cs>'` → `return pick('<cs>', '<sk>', '<uk>')`. cs/sk texty zůstávají byte-identické. Ukrajinské texty vyrobit překladovým + review subagentem (stejné instrukce jako C1, soubor `competitor-finder.ts`, funkce `useCaseDescription`).

- [ ] **Step 4: Spustit → PASS**

Run: `npx vitest run tests/lib/competitor-finder.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/competitor-finder.ts tests/lib/competitor-finder.test.ts
git commit -m "feat(i18n): useCaseDescription uk próza"
```

---

## Task C3: comparison-insights.ts — uk próza

**Files:**
- Modify: `src/lib/comparison-insights.ts`
- Test: `tests/lib/comparison-insights.test.ts`

- [ ] **Step 1: Napsat padající test (uk varianta)**

Přidat do `tests/lib/comparison-insights.test.ts`:

```ts
describe('comparisonInsights — uk variant je ukrajinština', () => {
  it('uk tldr obsahuje cyrilici a zachovává názvy modelů', () => {
    const a = { brand_slug: 'fendt', brand_name: 'Fendt', name: '942', power_hp: 415, category: 'traktory' } as any;
    const b = { brand_slug: 'john-deere', brand_name: 'John Deere', name: '8R 410', power_hp: 410, category: 'traktory' } as any;
    const out = csNew(a, b, 'uk');
    expect(out.tldr).toMatch(/[Ѐ-ӿ]/);
    expect(out.tldr).toContain('Fendt');
  });
});
```

- [ ] **Step 2: Spustit → FAIL**

Run: `npx vitest run tests/lib/comparison-insights.test.ts`
Expected: FAIL — uk dnes spadne na cs, regex cyrilice neprojde.

- [ ] **Step 3: Refaktor + uk próza**

`comparison-insights.ts` používá `sk: boolean` v `farmSizeClause` a `const sk = locale === 'sk'` v hlavní funkci. Přepsat na locale-keyed `pick(cs, sk, uk)` (a `farmSizeClause(category, powerHp, locale)` místo `sk: boolean`). cs/sk texty zůstávají byte-identické (chrání pairs 0–8 byte-identity testy). uk texty + napojení `useCaseDescription(category, powerHp, locale)` (po C2 už uk umí). Prózu vyrobit překladovým + review subagentem (soubor `comparison-insights.ts`).

- [ ] **Step 4: Spustit → PASS**

Run: `npx vitest run tests/lib/comparison-insights.test.ts`
Expected: PASS — cs byte-identita (pairs 0–8), sk variant, nový uk test.

- [ ] **Step 5: Commit**

```bash
git add src/lib/comparison-insights.ts tests/lib/comparison-insights.test.ts
git commit -m "feat(i18n): comparison-insights uk próza (cs byte-identita pairs 0-8)"
```

---

# GROUP D — Produkce obsahu (AI překlad + AI review)

> Každý task = `superpowers:dispatching-parallel-agents`. Pro každý soubor: **subagent A přeloží**, **subagent B zreviduje**. Pravidla §4 spec: překládá se próza; `slug`, `znacka`, čísla, URL, `heroImage`, `youtubeId`, datumy, `wikidata` se NEMĚNÍ; `wikipedia` zůstává cs odkaz.

## Task D1: stroje uk YAML overlaye (24)

**Files:**
- Create: `src/data/stroje/uk/<slug>.yaml` (24× — zrcadlí `src/data/stroje/sk/*.yaml`)
- Test: `tests/lib/stroje.test.ts`

- [ ] **Step 1: Napsat padající test pro uk overlay**

Přidat do `tests/lib/stroje.test.ts`:

```ts
describe('stroje lib — UK overlay', () => {
  it('applyStrojOverlay aplikuje uk description/series/models, nemutuje base', () => {
    const base: any = { slug: 'zetor', country: 'Česko', description: 'cs', categories: { traktory: { name: 'Traktory', series: [{ slug: 'forterra', description: 'cs série', models: [{ slug: 'forterra-135', description: 'cs model' }] }] } } };
    const ov: any = { description: 'укр опис', series: { forterra: 'укр серія' }, models: { 'forterra-135': 'укр модель' } };
    const out: any = applyStrojOverlay(base, ov);
    expect(out.description).toBe('укр опис');
    expect(out.categories.traktory.series[0].description).toBe('укр серія');
    expect(out.categories.traktory.series[0].models[0].description).toBe('укр модель');
    expect(base.description).toBe('cs'); // base nezmutován
  });
});
```

- [ ] **Step 2: Spustit → PASS (mechanismus už existuje)**

Run: `npx vitest run tests/lib/stroje.test.ts`
Expected: PASS — `applyStrojOverlay` je locale-agnostický; test jen potvrzuje uk data.

- [ ] **Step 3: Vyrobit 24 uk overlay souborů**

Zjistit seznam: `ls src/data/stroje/sk/`. Pro každý `<slug>.yaml`:
- **Překlad subagent:** „Přelož `src/data/stroje/sk/<slug>.yaml` z češtiny (referencí je `src/data/stroje/<slug>.yaml` jako cs originál + sk jako vzor struktury) do ukrajinštiny do `src/data/stroje/uk/<slug>.yaml`. Zachovej PŘESNĚ strukturu YAML a klíče (`country`, `description`, `categories`, `series`, `models`). Klíče v `series`/`models`/`categories` (slugy) NEMĚŇ — překládají se jen HODNOTY (popisy). `country` přelož jen pokud má ukrajinský exonym, jinak ponech. Odborná strojní terminologie. Vrať obsah souboru."
- **Review subagent:** „Zkontroluj `src/data/stroje/uk/<slug>.yaml`: validní YAML, klíče/slugy identické se sk verzí, hodnoty přirozená ukrajinština, žádná čeština. Oprav a vrať."

Paralelizovat po dávkách (např. 6 značek najednou).

- [ ] **Step 4: Ověřit build + cyrilici**

Run: `nvm use 22 && npm run build`
Expected: build projde.
Run: `for f in src/data/stroje/uk/*.yaml; do grep -qL "[А-яІіЇїЄєҐґ]" "$f" || echo "BEZ CYRILICE: $f"; done; ls src/data/stroje/uk/*.yaml | wc -l`
Expected: 24 souborů, žádný „BEZ CYRILICE".

- [ ] **Step 5: Commit**

```bash
git add src/data/stroje/uk/ tests/lib/stroje.test.ts
git commit -m "feat(i18n): uk overlaye strojů (24 značek) + test"
```

---

## Task D2: znacky-uk profily (~24)

**Files:**
- Create: `src/content/znacky-uk/<slug>.md` (zrcadlí `src/content/znacky-sk/*.md`)

- [ ] **Step 1: Vyrobit profily**

Seznam: `ls src/content/znacky-sk/`. Pro každý:
- **Překlad subagent:** „Přelož `src/content/znacky-sk/<slug>.md` do ukrajinštiny do `src/content/znacky-uk/<slug>.md`. Frontmatter: přelož `name` (jen pokud má ukrajinský tvar, jinak ponech latinkou), `popis`, `zeme`, `founder.note`, `timeline[].label`/`detail`, `snapshot[].label`/`value` (textové), `financials[].note`, `sources[].title`. NEMĚŇ: `slug`, `zalozena`, `website`, `wikipedia` (ponech cs), `wikidata`, `kategorie`, čísla (`year`, `revenue`...), `logo`, `aktualizovano`. Celé MD tělo přelož. Vrať obsah souboru."
- **Review subagent:** „Zkontroluj `src/content/znacky-uk/<slug>.md`: validní frontmatter (klíče identické se sk schématem), nepřeložená strukturální pole, přirozená ukrajinština v tělě/popisech, žádná čeština. Oprav a vrať."

- [ ] **Step 2: Ověřit build**

Run: `nvm use 22 && npm run build`
Expected: build projde (schéma `znackySchema` validuje uk frontmatter).
Run: `ls src/content/znacky-uk/*.md | wc -l`
Expected: shodný počet s `znacky-sk`.

- [ ] **Step 3: Commit**

```bash
git add src/content/znacky-uk/
git commit -m "feat(i18n): uk profily značek (znacky-uk)"
```

---

## Task D3: encyklopedie-uk detaily (~44)

**Files:**
- Create: `src/content/encyklopedie-uk/<slug>.md` (zrcadlí `src/content/encyklopedie-sk/*.md`)

- [ ] **Step 1: Vyrobit detaily**

Seznam: `ls src/content/encyklopedie-sk/`. Pro každý:
- **Překlad subagent:** „Přelož `src/content/encyklopedie-sk/<slug>.md` do ukrajinštiny do `src/content/encyklopedie-uk/<slug>.md`. Frontmatter přelož: `name` (jen pokud má ukr. tvar), `popis`, `vykon`/`hmotnost` (jednotky lokalizovat textově, čísla NEMĚŇ), `highlights[]`, `faq[].q`/`a`, `recenze.verdikt`/`plusy[]`/`minusy[]`, `engine`/`transmission`/`seriesName` (textové popisy). NEMĚŇ: `slug`, `znacka`, `kategorie`, čísla (`rok_uvedeni`, `powerHp`, `powerKw`, `weightKg`, `yearTo`, `recenze.hodnoceni`), `heroImage`, `youtubeId`, `sourceUrl`, `lastVerified`. Celé MD tělo přelož. Vrať obsah."
- **Review subagent:** „Zkontroluj `src/content/encyklopedie-uk/<slug>.md`: validní frontmatter dle schématu, nepřeložená strukturální/číselná pole, přirozená ukrajinština, žádná čeština. Oprav a vrať."

Paralelizovat po dávkách (~8 najednou).

- [ ] **Step 2: Ověřit build**

Run: `nvm use 22 && npm run build`
Expected: build projde.
Run: `ls src/content/encyklopedie-uk/*.md | wc -l`
Expected: shodný počet s `encyklopedie-sk`.

- [ ] **Step 3: Commit**

```bash
git add src/content/encyklopedie-uk/
git commit -m "feat(i18n): uk detaily encyklopedie (encyklopedie-uk)"
```

---

# GROUP E — Launch + verifikace

## Task E1: Zapnout uk launched prefixy

**Files:**
- Modify: `src/i18n/utils.ts` (`LAUNCHED_PREFIXES.uk`)
- Test: `tests/i18n/uk-launch.test.ts`

- [ ] **Step 1: Napsat padající test**

Create `tests/i18n/uk-launch.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { LAUNCHED_PREFIXES, isLaunchedPath } from '../../src/i18n/utils';
import { isLockedSectionPath } from '../../src/i18n/nav';

describe('UK fáze 2 launch (stroje/srovnani/znacky/encyklopedie)', () => {
  const launched = ['/stroje', '/srovnani', '/znacky', '/encyklopedie'];
  it('4 sekce jsou launchnuté pro uk', () => {
    for (const p of launched) {
      expect(LAUNCHED_PREFIXES.uk).toContain(p);
      expect(isLaunchedPath('uk', p)).toBe(true);
      expect(isLaunchedPath('uk', `${p}/cokoli/`)).toBe(true);
    }
  });
  it('jurisdikční data NEjsou launchnuté pro uk', () => {
    for (const p of ['/dotace', '/statistiky', '/puda']) {
      expect(isLaunchedPath('uk', p)).toBe(false);
    }
  });
  it('launchnuté nejsou locked', () => {
    for (const p of launched) expect(isLockedSectionPath(p)).toBe(false);
  });
});
```

- [ ] **Step 2: Spustit → FAIL**

Run: `npx vitest run tests/i18n/uk-launch.test.ts`
Expected: FAIL — `LAUNCHED_PREFIXES.uk` je `[]`.

- [ ] **Step 3: Implementovat**

V `src/i18n/utils.ts` změnit `uk: []` na:

```ts
  uk: ['/stroje', '/srovnani', '/znacky', '/encyklopedie'],
```

- [ ] **Step 4: Spustit → PASS**

Run: `npx vitest run tests/i18n/uk-launch.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/i18n/utils.ts tests/i18n/uk-launch.test.ts
git commit -m "feat(i18n): launch uk sekcí stroje/srovnani/znacky/encyklopedie"
```

---

## Task E2: Plná verifikace — build + testy + CZ/SK regrese

**Files:** žádné (verifikační task)

- [ ] **Step 1: Plná sada testů**

Run: `npx vitest run`
Expected: PASS, počet ≥ 359 baseline + nové testy. Žádný fail.

- [ ] **Step 2: Build Node 22**

Run: `nvm use 22 && npm run build`
Expected: build projde; bundle pod limitem Workeru (build nehlásí size error).

- [ ] **Step 3: CZ/SK regrese (byte-identity generátorů)**

Run: `npx vitest run tests/lib/comparison-insights.test.ts tests/lib/faq-generator.test.ts tests/i18n/statistiky-launch.test.ts`
Expected: PASS — cs pairs 0–8 byte-identické, sk variant beze změny, SK launch nezměněn.

- [ ] **Step 4: Ověřit /uk URL v sitemapě (lokální dist)**

Run: `grep -c "/uk/stroje" dist/sitemap.xml || grep -rc "/uk/" dist/*.xml`
Expected: > 0 (uk URL se po launchi generují).

- [ ] **Step 5: Commit (pokud nějaké drobné fixy)**

```bash
git add -p
git commit -m "test(i18n): verifikace uk fáze 2 — build + testy zelené"
```

---

## Task E3: Živý smoke (po deployi — deploy je akce uživatele)

**Files:** žádné

> Deploy: `nvm use 22 && npm run build && npm run deploy` (deploy NEdělá build!). Před deployem `git stash` cizí necommitnuté změny. Spustit až po schválení uživatelem.

- [ ] **Step 1: Smoke všech 4 sekcí pod /uk**

Run (nahradit `<IP>` produkční IP z `dig +short agro-svet.cz`):

```bash
for u in /uk/stroje/ /uk/znacky/ /uk/encyklopedie/ /uk/srovnani/; do \
  echo "== $u =="; \
  curl -s --resolve agro-svet.cz:443:<IP> "https://agro-svet.cz$u" -o /tmp/uk.html -w "HTTP %{http_code}\n"; \
  grep -o '<meta name="robots"[^>]*>' /tmp/uk.html; \
  grep -oc '[А-яІіЇїЄєҐґ]' /tmp/uk.html | head -1; \
done
```
Expected: HTTP 200; konkrétní detail (`/uk/stroje/<brand>/<series>/<model>/`, `/uk/znacky/<slug>`, `/uk/encyklopedie/<slug>`) → `index, follow`; cyrilice přítomná; hub stránky dle nastavení.

- [ ] **Step 2: Ověřit reciproční hreflang na detailu**

Run: `curl -s --resolve agro-svet.cz:443:<IP> "https://agro-svet.cz/uk/encyklopedie/<slug>/" | grep 'hreflang'`
Expected: cs + sk + uk + x-default alternates.

- [ ] **Step 3: Ověřit, že CZ je beze změny**

Run: `curl -s --resolve agro-svet.cz:443:<IP> "https://agro-svet.cz/encyklopedie/<slug>/" | grep -E 'robots|hreflang'`
Expected: cs obsah, `index, follow`, hreflang nyní obsahuje i uk alternate (přidání alternatu není obsahová změna).

---

## Definition of Done

- [ ] GROUP A–C: kód mergnutelný, `npx vitest run` zelené, build OK, cs+sk byte-identita potvrzená.
- [ ] GROUP D: 24 uk stroje overlayů + ~24 znacky-uk + ~44 encyklopedie-uk, všechny s cyrilicí, build validuje schémata.
- [ ] GROUP E: `LAUNCHED_PREFIXES.uk` = 4 sekce, launch test zelený, sitemap obsahuje /uk URL, živý smoke 200 + ukrajinština + index,follow + hreflang.

---

## Self-Review (vyplněno autorem plánu)

- **Spec coverage:** §1 → A1–A4; §2.1 → D1; §2.2 → B1,B3,D2; §2.3 → B1,B2,D3; §2.4/§3 → C1–C3; §4 → dispatch instrukce D1–D3; §5 → D1–D3 + C1–C3 (subagent pipeline); §6 → E1–E3; §7 → testy v A1,A2,B1,C1–C3,D1,E1. Pokryto.
- **Placeholdery:** uk próza není „TODO" — je definovaná jako konkrétní subagent-dispatch s přesnými instrukcemi (= obsah, který engineer potřebuje). Jediný `<IP>`/`<slug>`/`<brand>` jsou runtime parametry smoke.
- **Type consistency:** `isLaunchedPath(locale, path)`, `LAUNCHED_PREFIXES`, `ENC_COLLECTION`, `ZN_COLLECTION`, `pick`/`L` konzistentní napříč tasky. `isSkLaunchedPath` zachován jako alias (volá ho Layout/sitemap přes import).
