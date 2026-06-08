# UK Fáze 3 — jak-na-to + slovník — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Zlokalizovat do ukrajinštiny sekce `/jak-na-to` (12 návodů) a `/slovnik` (206 hesel) a zapnout jejich indexaci pod `/uk`, bez jakékoli změny CZ/SK výstupu.

**Architecture:** `jak-na-to` zrcadlí hotový SK overlay vzor (nová kolekce `howtoUk` + per-locale dispatch v SSR routě). `slovnik` dostane nový lokalizační mechanismus dle vzoru encyklopedie: nový datový soubor `SLOVNIK_UK`, locale-aware accessory v `slovnik.ts` (CS verbatim), a routy se převedou z prerender na SSR s per-locale dispatch. Gating/nav/sitemap jsou per-locale generické (z fáze 2) — jen se přidají prefixy a zviditelní nav. Launch (`LAUNCHED_PREFIXES.uk`) je poslední krok po dokončení obsahu.

**Tech Stack:** Astro 6.4.4 (SSR, `@astrojs/node`), TypeScript, Vitest, content collections (glob loader), Node 22 (build).

**Pracovní adresář:** `~/agro-svet-uk-faze3` (větev `feat/i18n-uk-faze3-jaknato-slovnik`).
**Build/test:** `source ~/.nvm/nvm.sh && nvm use 22` před `npm run build`. Testy: `npx vitest run`.
**Commity:** `/usr/bin/git` (NIKDY `git add -A`; přidávat explicitně vyjmenované soubory).

---

## FÁZE I — Kódová infrastruktura (TDD, bez obsahu)

### Task 1: Locale-aware accessory ve slovnik.ts (CS verbatim)

**Files:**
- Create: `src/lib/slovnik.uk.ts` (zatím stub — jen prázdné pole, naplní se ve Fázi III)
- Modify: `src/lib/slovnik.ts` (přidat locale-aware funkce; `SLOVNIK` a `KATEGORIE_LABELS` nechat beze změny)
- Test: `tests/lib/slovnik-locale.test.ts`

- [ ] **Step 1: Stub uk dat** — vytvořit `src/lib/slovnik.uk.ts`:

```ts
import type { SlovnikTerm } from './slovnik';

// Ukrajinská hesla slovníku. Plní se ve Fázi III (překlad z SLOVNIK).
// Parita slug+kategorie+related se SLOVNIK je vynucena testem.
export const SLOVNIK_UK: SlovnikTerm[] = [];
```

- [ ] **Step 2: Failing test** — `tests/lib/slovnik-locale.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { SLOVNIK, getSlovnik, getSlovnikTerm, KATEGORIE_LABELS, getKategorieLabels } from '../../src/lib/slovnik';

describe('slovnik locale accessors', () => {
  it('getSlovnik("cs") vrací stejnou referenci jako SLOVNIK', () => {
    expect(getSlovnik('cs')).toBe(SLOVNIK);
  });
  it('getSlovnik bez argumentu = cs', () => {
    expect(getSlovnik()).toBe(SLOVNIK);
  });
  it('neznámý locale fallbackuje na cs', () => {
    expect(getSlovnik('xx')).toBe(SLOVNIK);
  });
  it('getSlovnikTerm respektuje locale (cs heslo existuje)', () => {
    expect(getSlovnikTerm('adblue', 'cs')?.slug).toBe('adblue');
  });
  it('getKategorieLabels("cs") === KATEGORIE_LABELS', () => {
    expect(getKategorieLabels('cs')).toBe(KATEGORIE_LABELS);
  });
});
```

- [ ] **Step 3: Run, expect FAIL** — `npx vitest run tests/lib/slovnik-locale.test.ts` → FAIL (`getSlovnik` not exported).

- [ ] **Step 4: Implement** — na konec `src/lib/slovnik.ts` (za `KATEGORIE_LABELS`) přidat:

```ts
import { SLOVNIK_UK } from './slovnik.uk';

const SLOVNIK_BY_LOCALE: Record<string, SlovnikTerm[]> = { cs: SLOVNIK, uk: SLOVNIK_UK };
export function getSlovnik(locale: string = 'cs'): SlovnikTerm[] {
  return SLOVNIK_BY_LOCALE[locale] ?? SLOVNIK;
}
export function getSlovnikTermLocalized(slug: string, locale: string = 'cs'): SlovnikTerm | undefined {
  return getSlovnik(locale).find((t) => t.slug === slug);
}

// Ukrajinské labely kategorií (klíče = enum). CS verbatim výše.
export const KATEGORIE_LABELS_UK: Record<SlovnikKategorie, string> = {
  technologie: 'Технології',
  pohon: 'Привід і двигун',
  hnojivo: 'Добрива',
  dotace: 'Субсидії та програми',
  agrotechnika: 'Агротехніка',
  regulace: 'Регулювання та норми',
  'precise-farming': 'Точне землеробство',
  jednotky: 'Одиниці та вимірювання',
  historie: 'Історія та архаїчні поняття',
  chov: 'Тваринництво',
  slang: 'Розмовні вирази та сленг',
  ochrana: 'Захист рослин',
  plodiny: 'Культури та товари',
  vcelarstvi: 'Бджільництво',
};
const KATEGORIE_LABELS_BY_LOCALE: Record<string, Record<SlovnikKategorie, string>> = {
  cs: KATEGORIE_LABELS,
  uk: KATEGORIE_LABELS_UK,
};
export function getKategorieLabels(locale: string = 'cs'): Record<SlovnikKategorie, string> {
  return KATEGORIE_LABELS_BY_LOCALE[locale] ?? KATEGORIE_LABELS;
}
```

Pozn.: aby `getSlovnikTerm(slug, locale)` mělo i 2-arg variantu používanou v routách, **rozšířit existující** `getSlovnikTerm` na volitelný locale (zpětně kompatibilní):
```ts
// nahradit stávající getSlovnikTerm:
export function getSlovnikTerm(slug: string, locale: string = 'cs'): SlovnikTerm | undefined {
  return getSlovnik(locale).find((t) => t.slug === slug);
}
```
(Pak `getSlovnikTermLocalized` není potřeba — smazat ze step 4. Test ve step 2 volá `getSlovnikTerm('adblue','cs')`, což sedí.)

- [ ] **Step 5: Run, expect PASS** — `npx vitest run tests/lib/slovnik-locale.test.ts` → PASS. Také `npx vitest run tests/lib/` (žádná regrese existujících slovnik testů).

- [ ] **Step 6: Commit**

```bash
/usr/bin/git add src/lib/slovnik.uk.ts src/lib/slovnik.ts tests/lib/slovnik-locale.test.ts
/usr/bin/git commit -m "feat(slovnik): locale-aware accessory + uk labels (CS verbatim)"
```

---

### Task 2: Parita test SLOVNIK_UK vs SLOVNIK (vynutí kompletní/správný překlad)

**Files:**
- Test: `tests/lib/slovnik-uk-parita.test.ts`

- [ ] **Step 1: Test** (poběží červeně dokud Fáze III nenaplní data — proto skipnout v CI značkou, ale nechat jako gate před launchem):

```ts
import { describe, it, expect } from 'vitest';
import { SLOVNIK } from '../../src/lib/slovnik';
import { SLOVNIK_UK } from '../../src/lib/slovnik.uk';

// Tento test je LAUNCH GATE: musí být zelený PŘED přidáním /slovnik do LAUNCHED_PREFIXES.uk.
// Dokud SLOVNIK_UK není naplněn (Fáze III), je červený — to je očekávané.
describe('SLOVNIK_UK parita', () => {
  const csSlugs = new Set(SLOVNIK.map((t) => t.slug));
  const ukSlugs = new Set(SLOVNIK_UK.map((t) => t.slug));

  it('stejný počet hesel', () => {
    expect(SLOVNIK_UK.length).toBe(SLOVNIK.length);
  });
  it('stejná množina slugů', () => {
    for (const s of csSlugs) expect(ukSlugs.has(s)).toBe(true);
    for (const s of ukSlugs) expect(csSlugs.has(s)).toBe(true);
  });
  it('kategorie (enum) zachovány per slug', () => {
    const csBySlug = new Map(SLOVNIK.map((t) => [t.slug, t.kategorie]));
    for (const t of SLOVNIK_UK) expect(t.kategorie).toBe(csBySlug.get(t.slug));
  });
  it('related slugy ukazují na existující uk hesla', () => {
    for (const t of SLOVNIK_UK) for (const r of t.related ?? []) expect(ukSlugs.has(r)).toBe(true);
  });
  it('prózová pole obsahují cyrilici (sample)', () => {
    const cyr = /[Ѐ-ӿ]/;
    for (const t of SLOVNIK_UK) {
      expect(cyr.test(t.term) || cyr.test(t.shortDef)).toBe(true);
      expect(cyr.test(t.shortDef)).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Run** — `npx vitest run tests/lib/slovnik-uk-parita.test.ts` → FAIL (prázdné pole). To je očekávané; tento test je gate pro Fázi III.

- [ ] **Step 3: Commit**

```bash
/usr/bin/git add tests/lib/slovnik-uk-parita.test.ts
/usr/bin/git commit -m "test(slovnik): uk parity launch-gate (red until content done)"
```

---

### Task 3: Kolekce howtoUk v content.config.ts

**Files:**
- Modify: `src/content.config.ts:235-240`
- Test: `tests/lib/howto-uk-config.test.ts`

- [ ] **Step 1: Test** — `tests/lib/howto-uk-config.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { collections } from '../../src/content.config';

describe('howtoUk kolekce', () => {
  it('je registrovaná v collections', () => {
    expect(collections).toHaveProperty('howtoUk');
  });
});
```

- [ ] **Step 2: Run, expect FAIL** — `npx vitest run tests/lib/howto-uk-config.test.ts`.

- [ ] **Step 3: Implement** — v `src/content.config.ts` za `howtoSk` (ř. ~238) přidat:

```ts
// UK-localizovaná overlay kolekce howto (slug = REUSE cs slug). Chybějící uk slug = 404.
const howtoUk = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/howto-uk' }),
  schema: howtoSchema(),
});
```
A rozšířit export (ř. 240):
```ts
export const collections = { novinky, encyklopedie, encyklopedieSk, encyklopedieUk, znacky, znackySk, znackyUk, puda, pudaSk, dotace, dotaceSk, howto, howtoSk, howtoUk };
```

- [ ] **Step 4: Seed prázdné kolekce** — aby glob loader nespadl, vytvořit adresář s placeholderem, který se ve Fázi II nahradí. Prozatím:
```bash
mkdir -p src/content/howto-uk
```
(Reálné soubory přijdou v Task 9. Astro glob na prázdném adresáři je OK — vrací prázdnou kolekci.)

- [ ] **Step 5: Run, expect PASS** — `npx vitest run tests/lib/howto-uk-config.test.ts` → PASS.

- [ ] **Step 6: Commit**

```bash
/usr/bin/git add src/content.config.ts tests/lib/howto-uk-config.test.ts
/usr/bin/git commit -m "feat(howto): register howtoUk collection"
```

---

### Task 4: Per-locale dispatch v jak-na-to routách

**Files:**
- Modify: `src/pages/jak-na-to/index.astro:11-19`
- Modify: `src/pages/jak-na-to/[slug].astro:11-19`

- [ ] **Step 1: index.astro** — nahradit blok odvození locale/base/kolekce:

```ts
const locale = Astro.locals.locale ?? getLocaleFromUrl(Astro.url);
const t = useTranslations(locale);
const base = locale === 'cs' ? '' : `/${locale}`;
const bcp47 = ({ cs: 'cs-CZ', sk: 'sk-SK', uk: 'uk-UA' } as const)[locale];
Astro.response.headers.set('Cache-Control', 'public, max-age=600, s-maxage=3600, stale-while-revalidate=86400');

const HOWTO_COLLECTION = { cs: 'howto', sk: 'howtoSk', uk: 'howtoUk' } as const;
const items = await getCollection(HOWTO_COLLECTION[locale]);
```
A nahradit `inLanguage: isSk ? 'sk-SK' : 'cs-CZ'` → `inLanguage: bcp47`. Odstranit nepoužité `isSk`.

- [ ] **Step 2: [slug].astro** — nahradit blok (ř. 11-18):

```ts
const locale = Astro.locals.locale ?? getLocaleFromUrl(Astro.url);
const t = useTranslations(locale);
const base = locale === 'cs' ? '' : `/${locale}`;
Astro.response.headers.set('Cache-Control', 'public, max-age=600, s-maxage=3600, stale-while-revalidate=86400');

const { slug } = Astro.params;
const HOWTO_COLLECTION = { cs: 'howto', sk: 'howtoSk', uk: 'howtoUk' } as const;
const items = await getCollection(HOWTO_COLLECTION[locale]);
const item = items.find((i) => i.id === slug);
if (!item) return Astro.rewrite('/404');
```
Pokud `[slug].astro` používá `isSk` dále (např. `inLanguage`), nahradit per-locale `bcp47` mapou (přidat ji vedle `base`).

- [ ] **Step 3: Build smoke (CS verbatim)** — `source ~/.nvm/nvm.sh && nvm use 22 && npm run build` projde. (Render diff se dělá v ověřovací fázi; teď stačí build green.)

- [ ] **Step 4: Commit**

```bash
/usr/bin/git add src/pages/jak-na-to/index.astro 'src/pages/jak-na-to/[slug].astro'
/usr/bin/git commit -m "feat(howto): per-locale collection dispatch (cs/sk/uk)"
```

---

### Task 5: Slovnik routy → SSR + per-locale dispatch

**Files:**
- Modify: `src/pages/slovnik/index.astro`
- Modify: `src/pages/slovnik/[slug].astro`

- [ ] **Step 1: [slug].astro** — změnit `prerender` a getStaticPaths:
  - `export const prerender = true;` → `export const prerender = false;`
  - Smazat `export function getStaticPaths() {...}`.
  - Přidat odvození locale za importy:
    ```ts
    import { useTranslations, getLocaleFromUrl } from '../../i18n/utils';
    const locale = Astro.locals.locale ?? getLocaleFromUrl(Astro.url);
    const base = locale === 'cs' ? '' : `/${locale}`;
    const bcp47 = ({ cs: 'cs-CZ', sk: 'sk-SK', uk: 'uk-UA' } as const)[locale];
    Astro.response.headers.set('Cache-Control', 'public, max-age=600, s-maxage=3600, stale-while-revalidate=86400');
    ```
  - `getSlovnikTerm(slug!)` → `getSlovnikTerm(slug!, locale)`.
  - `getSlovnikTerm(s)` v related mapě → `getSlovnikTerm(s, locale)`.
  - `KATEGORIE_LABELS` použití → `getKategorieLabels(locale)` (přidat import).
  - `pageUrl` a všechny interní `/slovnik/...` odkazy → prefixovat `${base}`.
  - `injectLinks`/`createLinkContext`: předat locale/base do kontextu tak, aby se pro uk negenerovaly cs odkazy. **Bezpečný default:** pokud `createLinkContext` neumí locale, pro `locale !== 'cs'` auto-link injection vynechat (renderovat `term.longDef` bez `injectLinks`). Rozhodnout podle podpisu `createLinkContext` při implementaci; preferovat lokalizovaný kontext, fallback = vypnout injection pro non-cs.
- [ ] **Step 2: index.astro** — analogicky: `prerender=false`, locale/base/bcp47, `getSlovnik(locale)` místo `SLOVNIK`, `getKategorieLabels(locale)`, prefixovat odkazy `${base}`. Pokud index řadí/grupuje podle kategorií, použít `getSlovnik(locale)`.
- [ ] **Step 3: Build** — `nvm use 22 && npm run build` projde.
- [ ] **Step 4: CS render parita (sémantická)** — viz Task 11 (ověření). Teď jen build green + manuální čtení diffu.
- [ ] **Step 5: Commit**

```bash
/usr/bin/git add src/pages/slovnik/index.astro 'src/pages/slovnik/[slug].astro'
/usr/bin/git commit -m "refactor(slovnik): SSR + per-locale dispatch (CS render unchanged)"
```

---

### Task 6: Nav viditelnost jak-na-to + slovnik pro uk

**Files:**
- Modify: `src/i18n/nav.ts`
- Test: `tests/i18n/nav-uk-faze3.test.ts`

- [ ] **Step 1: Recon** — zjistit, do které nav skupiny patří `jak-na-to` a `slovnik` a jestli je skupina v `HIDDEN_SECTIONS.uk = ['data','bazar','photo']`. Příkaz: `grep -n "jak-na-to\|slovnik\|HIDDEN_SECTIONS\|data" src/i18n/nav.ts`.
- [ ] **Step 2: Test** — `tests/i18n/nav-uk-faze3.test.ts` (přizpůsobit dle skutečné nav struktury z reconu; cíl = po launchi jsou položky viditelné):

```ts
import { describe, it, expect } from 'vitest';
import { getNavSections } from '../../src/i18n/nav'; // upravit dle skutečného exportu
describe('uk nav fáze 3', () => {
  it('jak-na-to a slovnik jsou viditelné pro uk', () => {
    const labels = JSON.stringify(getNavSections('uk'));
    expect(labels).toMatch(/jak-na-to/);
    expect(labels).toMatch(/slovnik/);
  });
});
```
(Pokud nav API nemá `getNavSections`, test napsat proti skutečné funkci/struktuře zjištěné v reconu.)

- [ ] **Step 3: Run, expect FAIL.**
- [ ] **Step 4: Implement** — zviditelnit `jak-na-to`/`slovnik` pro uk: buď je vyjmout ze skryté skupiny `data` pro uk, nebo zúžit `HIDDEN_SECTIONS.uk`. CS/SK nav beze změny. (Konkrétní edit dle reconu — minimální zásah.)
- [ ] **Step 5: Run, expect PASS.** Plus `npx vitest run tests/i18n/` (žádná SK/CS regrese).
- [ ] **Step 6: Commit**

```bash
/usr/bin/git add src/i18n/nav.ts tests/i18n/nav-uk-faze3.test.ts
/usr/bin/git commit -m "feat(nav): expose jak-na-to + slovnik for uk"
```

---

## FÁZE II — Obsah: jak-na-to (12 návodů)

### Task 7: Přeložit 12 howto-uk MD (subagent pipeline)

**Files:**
- Create: `src/content/howto-uk/<slug>.md` × 12 (slugy = `ls src/content/howto/`)

- [ ] **Step 1: Seznam slugů + schéma** — `ls src/content/howto/`; přečíst `src/content/howto-sk/<jeden>.md` jako vzor frontmatteru (klíče, struktura).
- [ ] **Step 2: Dispatch překlad (subagent A) + review (subagent B)** přes `dispatching-parallel-agents`, jeden pár subagentů na soubor (12 párů). Každý subagent A dostane:
  - cs zdroj `src/content/howto/<slug>.md` + sk vzor `src/content/howto-sk/<slug>.md` (struktura).
  - Pravidla §4 spec: přeložit prózu (title/description/tools/supplies/steps.name|text/faq.q|a/tělo), zachovat slug/heroImage/čísla/strukturu frontmatteru. Výstup = kompletní uk MD.
  - Subagent B: review odborné terminologie, nulová CZ kontaminace, neporušená struktura → finální soubor zapsat do `src/content/howto-uk/<slug>.md`.
- [ ] **Step 3: Parita check** — `diff <(ls src/content/howto | sort) <(ls src/content/howto-uk | sort)` = prázdný (stejné slugy). Frontmatter klíče: pro každý soubor ověřit shodu klíčů s cs (skript nebo grep).
- [ ] **Step 4: Test howto parita** — `tests/lib/howto-uk-parita.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';
describe('howto-uk parita', () => {
  it('stejná množina slugů jako howto', async () => {
    const cs = (await getCollection('howto')).map((i) => i.id).sort();
    const uk = (await getCollection('howtoUk')).map((i) => i.id).sort();
    expect(uk).toEqual(cs);
  });
});
```
(Pokud `getCollection` v testech vyžaduje astro runtime stub, ověřit přes existující `tests/stubs/astro-content.ts` vzor; jinak parita přes `fs.readdirSync`.)

- [ ] **Step 5: Build** — `nvm use 22 && npm run build` projde (uk MD validní vůči schématu).
- [ ] **Step 6: Commit**

```bash
/usr/bin/git add src/content/howto-uk tests/lib/howto-uk-parita.test.ts
/usr/bin/git commit -m "feat(howto): 12 uk návodů (překlad + review)"
```

---

## FÁZE III — Obsah: slovník (206 hesel)

### Task 8: Přeložit 206 hesel do SLOVNIK_UK (dávkový subagent pipeline)

**Files:**
- Modify: `src/lib/slovnik.uk.ts` (naplnit `SLOVNIK_UK`)

- [ ] **Step 1: Extrakce CS hesel** — napsat dočasný skript `scripts/_dump-slovnik.mjs`, který importuje `SLOVNIK` a vypíše po dávkách (~20 hesel) JSON do `/tmp/slovnik-cs/batch-NN.json`. Každé heslo: `{slug, term, alias, kategorie, shortDef, longDef, related, externalUrl, externalLabel}`.
- [ ] **Step 2: Dispatch dávek** — ~11 dávek × (subagent A překlad + subagent B review) přes `dispatching-parallel-agents`. Každý subagent A:
  - Vstup = `/tmp/slovnik-cs/batch-NN.json`.
  - Přeložit `term`/`alias[]`/`shortDef`/`longDef`/`externalLabel` do ukrajinštiny (odborná zemědělská/strojní terminologie). Zachovat `slug`/`kategorie`/`related`/`externalUrl` IDENTICKY.
  - Historické české jednotky (korec/strych/jitro/morgen/q) = ukrajinský encyklopedický výklad. Dotační/EU pojmy = encyklopedický výklad bez tvrzení o ČR administrativě jako platné pro UA.
  - Výstup = `/tmp/slovnik-uk/batch-NN.json` (stejná struktura, přeložená pole).
  - Subagent B: kontrola terminologie, nulová CZ kontaminace (žádné `ř/ě/ů`, žádná česká slova v prózových polích), zachované slug/kategorie/related/tokeny.
- [ ] **Step 3: Sloučit do TS** — skript `scripts/_build-slovnik-uk.mjs` načte všechny `/tmp/slovnik-uk/batch-*.json`, seřadí dle pořadí v `SLOVNIK`, a vygeneruje `src/lib/slovnik.uk.ts` (`export const SLOVNIK_UK: SlovnikTerm[] = [...]`). Po vygenerování smazat dočasné skripty.
- [ ] **Step 4: Parita test (Task 2) zezelená** — `npx vitest run tests/lib/slovnik-uk-parita.test.ts` → PASS (počet, slugy, kategorie, related, cyrilice).
- [ ] **Step 5: Build** — `nvm use 22 && npm run build` projde.
- [ ] **Step 6: Commit**

```bash
/usr/bin/git add src/lib/slovnik.uk.ts
/usr/bin/git commit -m "feat(slovnik): 206 uk hesel (překlad + review, parita zelená)"
```

---

## FÁZE IV — Kvalitní pass + launch

### Task 9: Quality pass — prolinkování + SEO výbava

**Files:**
- Modify (dle potřeby): nové uk soubory, routy (JSON-LD/hreflang už řešeno per-locale)

- [ ] **Step 1: Review-pass agregace** — projít výstup review subagentů; vychytat zbylé anti-thin/kontaminace nálezy (cyrilice heuristika přes celý `slovnik.uk.ts` + `howto-uk/*`).
- [ ] **Step 2: Interní prolinkování** — ověřit, že uk slovnik `related` odkazy a uk návody odkazují na uk URL (`/uk/...`), ne cs. Kde encyklopedie/stroje (UK launchnuté) přirozeně souvisí, ponechat lokalizované odkazy.
- [ ] **Step 3: JSON-LD/OG/meta** — ověřit, že uk routy emitují `inLanguage: uk-UA`, breadcrumb/howTo/faq schema v uk, OG obrázky (jazykově neutrální `/og/howto-<slug>.png`; slovnik OG dle stávajícího vzoru). Žádná cs kontaminace v JSON-LD `name`/`description`.
- [ ] **Step 4: Commit** (jen pokud byly úpravy)

```bash
/usr/bin/git add <konkrétní soubory>
/usr/bin/git commit -m "chore(uk): quality pass — prolinkování + SEO výbava fáze 3"
```

---

### Task 10: Launch — LAUNCHED_PREFIXES.uk

**Files:**
- Modify: `src/i18n/utils.ts` (`LAUNCHED_PREFIXES.uk`)
- Test: `tests/i18n/launched-uk-faze3.test.ts`

- [ ] **Step 1: Test** — `tests/i18n/launched-uk-faze3.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { isLaunchedPath } from '../../src/i18n/utils';
describe('uk launch fáze 3', () => {
  it('/jak-na-to a /slovnik launchnuté pro uk', () => {
    expect(isLaunchedPath('uk', '/jak-na-to/boj-s-varroazou')).toBe(true);
    expect(isLaunchedPath('uk', '/slovnik/adblue')).toBe(true);
  });
  it('cs nikdy negatuje', () => {
    expect(isLaunchedPath('cs', '/slovnik/adblue')).toBe(false);
  });
});
```

- [ ] **Step 2: Run, expect FAIL.**
- [ ] **Step 3: Implement** — v `src/i18n/utils.ts` rozšířit:
```ts
uk: ['/stroje', '/srovnani', '/znacky', '/encyklopedie', '/jak-na-to', '/slovnik'],
```
- [ ] **Step 4: Run, expect PASS.** Plus celý `npx vitest run` zelený.
- [ ] **Step 5: Commit**

```bash
/usr/bin/git add src/i18n/utils.ts tests/i18n/launched-uk-faze3.test.ts
/usr/bin/git commit -m "feat(i18n): launch uk /jak-na-to + /slovnik"
```

---

### Task 11: Finální ověření (build + sémantický CS diff + testy)

- [ ] **Step 1: Plný build** — `source ~/.nvm/nvm.sh && nvm use 22 && npm run build` → success.
- [ ] **Step 2: Plné testy** — `npx vitest run` → vše zelené (baseline + nové).
- [ ] **Step 3: Sémantický CS diff** — porovnat CS render `/slovnik/`, `/slovnik/adblue/`, `/jak-na-to/`, `/jak-na-to/<slug>/` z tohoto buildu vs. master build (extract viditelný text + odkazy + JSON-LD; ignorovat per-build hash šum). Cíl = 0 obsahových rozdílů. Pokud rozdíl → opravit před launchem.
- [ ] **Step 4: Lokální SSR smoke** — `npm run preview` (nebo node adapter start), curl `/uk/slovnik/adblue/`, `/uk/jak-na-to/<slug>/` → 200, cyrilice, `<meta robots>` index,follow; `/slovnik/adblue/` (cs) → 200, čeština beze změny.
- [ ] **Step 5: Commit** (pokud opravy)

```bash
/usr/bin/git add <soubory>
/usr/bin/git commit -m "fix(uk): finální ověření fáze 3"
```

---

### Task 12: Merge + deploy + živý smoke

- [ ] **Step 1: Sync s master** — `cd ~/agro-svet-uk-faze3 && git fetch origin && git merge origin/master` (vyřešit případné konflikty; očekává se none).
- [ ] **Step 2: Push větve** — `git push "https://x-access-token:$(gh auth token)@github.com/matsamec-hash/agro-svet.git" feat/i18n-uk-faze3-jaknato-slovnik`.
- [ ] **Step 3: Merge do master** (deploy gate — viz pozn. níže) — fast-forward/merge `feat/i18n-uk-faze3-jaknato-slovnik` → `master`, push master → **Coolify auto-deploy** (VPS Node origin, app `n132yjaw951x4x3sy665rnvz`).
- [ ] **Step 4: Živý smoke** — po deployi: `curl -s --resolve agro-svet.cz:443:187.124.12.96 https://agro-svet.cz/uk/slovnik/adblue/ | grep -i robots` → index,follow + cyrilice; totéž `/uk/jak-na-to/<slug>/`, `/uk/slovnik/`, `/uk/jak-na-to/`. Ověřit sitemap obsahuje `/uk/slovnik/` + `/uk/jak-na-to/` URL. CS/SK ekvivalenty 200 beze změny.

> **Deploy gate (autonomní běh):** Krok 3 (merge do master = živý deploy) provést jen když: build green, `npx vitest run` celý zelený, a sémantický CS diff = 0 (Task 11). Změna je čistě aditivní (nové `/uk/` routy + nová data; CS/SK kód beze změny) a triviálně reverzibilní (`git revert` merge → Coolify redeploy). Pokud kterékoli ověření selže → NEpouštět živě, nechat na větvi a reportovat.

---

## Self-review (vyplněno autorem plánu)

- **Spec coverage:** §1 jak-na-to → Task 3,4,7. §2 slovnik → Task 1,2,5,8. §3 gating/nav/sitemap → Task 6,10. §4 pravidla překladu → Task 7,8. §5 pipeline → Task 7,8. §6 launch+verify → Task 10,11,12. §7 testy → Task 1,2,3,6,7,8,10. §9 DoD → Task 11,12. Pokryto.
- **Placeholder scan:** Task 5 (auto-linker) a Task 6 (nav) mají „dle reconu" rozhodnutí — záměrné, protože přesný edit závisí na skutečné struktuře; bezpečný default je vždy uveden (vypnout injection pro non-cs / minimální nav edit). Není to placeholder obsahu, ale podmíněná větev s definovaným fallbackem.
- **Type consistency:** `getSlovnik(locale)`, `getSlovnikTerm(slug, locale)`, `getKategorieLabels(locale)`, `SLOVNIK_UK`, `KATEGORIE_LABELS_UK`, `howtoUk`, `HOWTO_COLLECTION`, `LAUNCHED_PREFIXES.uk` — konzistentní napříč tasky.
