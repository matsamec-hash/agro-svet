# UK Fáze 4a — Slovník UK — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lokalizovat slovník (`/slovnik`, 308 hesel) do ukrajinštiny a zapnout indexaci pod `/uk`, bez jakékoli změny CS výstupu.

**Architecture:** Routa `slovnik/{index,[slug]}.astro` přechází `prerender=true` → `false` (SSR), konzistentně s ostatními UK sekcemi (encyklopedie/znacky/jak-na-to). Locale z `Astro.locals.locale`; data z `getSlovnik(locale)` (cs = `SLOVNIK` verbatim, uk = nový `SLOVNIK_UK`). Chrome stringy přes i18n translator (`useTranslations`/`tf`), CS hodnoty = bajt-identické s dnešními literály. Launch prefix se přidá až nakonec po review obsahu.

**Tech Stack:** Astro 6 (SSR `@astrojs/node`), TypeScript, Vitest, vlastní i18n (`src/i18n/utils.ts`, `useTranslations`, `tf`), node 22.

**⚠️ Prostředí (každý task):** worktree `~/agro-svet-uk-faze4a-slovnik`, větev `feat/i18n-uk-faze4a-slovnik`. Před každým testem/buildem: `export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 22`. Baseline vitest = **418 pass / 3 fail** (pre-existing bazar-nav, `tests/i18n/nav.test.ts`) — to není regrese. `pkill -f "astro dev" || true` před dev smoke.

---

## File Structure

| Soubor | Akce | Zodpovědnost |
|---|---|---|
| `src/lib/slovnik.uk.ts` | Create | `SLOVNIK_UK: SlovnikTerm[]` (308 hesel uk) + `KATEGORIE_LABELS_UK` |
| `src/lib/slovnik.ts` | Modify | locale-aware accessory (`getSlovnik`, `getSlovnikTerm(slug,locale)`, `getKategorieLabels`); CS pole beze změny |
| `src/i18n/ui/cs.ts` | Modify | `slovnik.*` chrome klíče = dnešní literály (bajt-parita) |
| `src/i18n/ui/uk.ts` | Modify | `slovnik.*` chrome klíče (ukrajinsky) |
| `src/i18n/ui/sk.ts` | Modify | `slovnik.*` chrome klíče (slovensky; nutné pro key-parita test) |
| `src/pages/slovnik/index.astro` | Modify | prerender→SSR, locale/base, chrome přes `t()` |
| `src/pages/slovnik/[slug].astro` | Modify | prerender→SSR, locale/base, chrome přes `t()`, uk link-kontext |
| `src/i18n/utils.ts` | Modify | `LAUNCHED_PREFIXES.uk` += `/slovnik` (poslední task) |
| `tests/lib/slovnik-uk.test.ts` | Create | locale accessory + key-parita 308 |
| `tests/i18n/uk-launch.test.ts` | Modify | `/slovnik` launched + sitemap mirror |

---

## Task 1: Locale-aware lib accessory (CS beze změny) + prázdný UK stub

**Files:**
- Create: `src/lib/slovnik.uk.ts`
- Modify: `src/lib/slovnik.ts` (přidat na konec exportů)
- Test: `tests/lib/slovnik-uk.test.ts`

- [ ] **Step 1: Napsat padající test**

```ts
// tests/lib/slovnik-uk.test.ts
import { describe, it, expect } from 'vitest';
import { SLOVNIK, getSlovnik, getSlovnikTerm, getKategorieLabels, KATEGORIE_LABELS } from '../../src/lib/slovnik';
import { SLOVNIK_UK, KATEGORIE_LABELS_UK } from '../../src/lib/slovnik.uk';

describe('slovnik locale-aware accessory', () => {
  it('getSlovnik("cs") vrací CS pole beze změny (identita)', () => {
    expect(getSlovnik('cs')).toBe(SLOVNIK);
  });
  it('getSlovnik() bez argumentu = cs (zpětná kompatibilita)', () => {
    expect(getSlovnik()).toBe(SLOVNIK);
  });
  it('getSlovnik("uk") vrací UK pole', () => {
    expect(getSlovnik('uk')).toBe(SLOVNIK_UK);
  });
  it('neznámý locale → fallback na CS', () => {
    expect(getSlovnik('xx')).toBe(SLOVNIK);
  });
  it('getSlovnikTerm(slug,"cs") = dnešní chování', () => {
    expect(getSlovnikTerm('adblue', 'cs')?.term).toBe('AdBlue');
  });
  it('getSlovnikTerm(slug) bez locale = cs', () => {
    expect(getSlovnikTerm('adblue')?.term).toBe('AdBlue');
  });
  it('getKategorieLabels("cs") = KATEGORIE_LABELS', () => {
    expect(getKategorieLabels('cs')).toBe(KATEGORIE_LABELS);
  });
  it('getKategorieLabels("uk") = KATEGORIE_LABELS_UK', () => {
    expect(getKategorieLabels('uk')).toBe(KATEGORIE_LABELS_UK);
  });
  it('KATEGORIE_LABELS_UK má všech 14 kategorií', () => {
    expect(Object.keys(KATEGORIE_LABELS_UK).sort()).toEqual(Object.keys(KATEGORIE_LABELS).sort());
  });
});
```

- [ ] **Step 2: Spustit test — musí padnout**

Run: `npx vitest run tests/lib/slovnik-uk.test.ts`
Expected: FAIL (`slovnik.uk` neexistuje / `getSlovnik` není export).

- [ ] **Step 3: Vytvořit `src/lib/slovnik.uk.ts` se stubem**

```ts
// Ukrajinská (uk) varianta slovníku — překlad CS hesel (slug = cs slug).
// Naplní se v Tasku 5 (subagent-driven překlad). Zatím prázdné → uk routy 404
// (sekce není launchnutá, noindex).
import type { SlovnikTerm, SlovnikKategorie } from './slovnik';

export const SLOVNIK_UK: SlovnikTerm[] = [];

export const KATEGORIE_LABELS_UK: Record<SlovnikKategorie, string> = {
  technologie: 'Технології',
  pohon: 'Привід і двигун',
  hnojivo: 'Добрива',
  dotace: 'Субсидії та виплати',
  agrotechnika: 'Агротехніка',
  regulace: 'Регулювання та норми',
  'precise-farming': 'Точне землеробство',
  jednotky: 'Одиниці виміру',
  historie: 'Історія',
  chov: 'Тваринництво',
  slang: 'Сленг',
  ochrana: 'Захист рослин',
  plodiny: 'Культури',
  vcelarstvi: 'Бджільництво',
};
```

- [ ] **Step 4: Rozšířit `src/lib/slovnik.ts` o locale accessory**

Na konec souboru (za stávající exporty, CS pole `SLOVNIK`/`SLOVNIK_CORE`/`KATEGORIE_LABELS` NEMĚNIT) přidat:

```ts
import { SLOVNIK_UK, KATEGORIE_LABELS_UK } from './slovnik.uk';

const SLOVNIK_BY_LOCALE: Record<string, SlovnikTerm[]> = { cs: SLOVNIK, uk: SLOVNIK_UK };
const KATEGORIE_LABELS_BY_LOCALE: Record<string, Record<SlovnikKategorie, string>> = {
  cs: KATEGORIE_LABELS,
  uk: KATEGORIE_LABELS_UK,
};

/** Vrátí slovník pro daný locale; neznámý locale → cs. CS chování beze změny. */
export function getSlovnik(locale: string = 'cs'): SlovnikTerm[] {
  return SLOVNIK_BY_LOCALE[locale] ?? SLOVNIK;
}

/** Lokalizovaná category-label mapa; neznámý locale → cs. */
export function getKategorieLabels(locale: string = 'cs'): Record<SlovnikKategorie, string> {
  return KATEGORIE_LABELS_BY_LOCALE[locale] ?? KATEGORIE_LABELS;
}
```

A **upravit** stávající `getSlovnikTerm` na locale-parametr (najdi dnešní definici `export function getSlovnikTerm(slug...`):

```ts
export function getSlovnikTerm(slug: string, locale: string = 'cs'): SlovnikTerm | undefined {
  return getSlovnik(locale).find((t) => t.slug === slug);
}
```

> Pozn.: `import` na začátek souboru NEpřesouvej kvůli minimal-diffu není nutné — TS hoistuje; ale drž import u ostatních importů nahoře, pokud tam jsou. Pokud `getSlovnikTerm` dnes nebere locale, je to čistě aditivní (default `'cs'`).

- [ ] **Step 5: Spustit test — musí projít**

Run: `npx vitest run tests/lib/slovnik-uk.test.ts`
Expected: PASS (9 testů).

- [ ] **Step 6: Commit**

```bash
git add src/lib/slovnik.uk.ts src/lib/slovnik.ts tests/lib/slovnik-uk.test.ts
git commit -m "feat(slovnik): locale-aware accessory + UK stub (KATEGORIE_LABELS_UK)"
```

---

## Task 2: i18n chrome klíče `slovnik.*` (cs bajt-identické, uk, sk)

**Files:**
- Modify: `src/i18n/ui/cs.ts`, `src/i18n/ui/uk.ts`, `src/i18n/ui/sk.ts`
- Test: existující key-parita test (najdi `tests/i18n/*paritа*` nebo `ui*.test.ts`)

**Kontext:** Routa dnes používá hardcoded české stringy. SSR konverze je povede přes `t()`. CS hodnoty MUSÍ být bajt-identické s dnešními literály (parita). Interpolace přes `tf(locale, key, params)` — ⚠️ **`tf` bere `locale` jako PRVNÍ argument** (`tf(locale, 'slovnik.index.kicker', { n })`), placeholdery ve tvaru `{name}`. Key-parita test = `tests/i18n/ui.test.ts` + `tests/i18n/ui-full.test.ts`.

- [ ] **Step 1: Ověřit jméno key-parity testu a tvar `tf`**

Run: `grep -rln "toEqual" tests/i18n/ | head; grep -n "export function tf" src/i18n/utils.ts`
Expected: najde key-parita test (porovnává `Object.keys` cs/sk/uk) + signaturu `tf` (typicky `tf(key, vars)` s `{n}`/`{x}` placeholdery). Přizpůsob placeholdery skutečné `tf` konvenci (níže předpokládá `{n}`).

- [ ] **Step 2: Přidat `slovnik.*` klíče do `src/i18n/ui/cs.ts`** (hodnoty = dnešní literály VERBATIM)

Najdi objekt cs překladů a přidej (dodrž styl tečkových klíčů v souboru):

```ts
  'slovnik.crumb.home': 'Domů',
  'slovnik.crumb.glossary': 'Slovník',
  'slovnik.index.title': 'Slovník zemědělských pojmů',
  'slovnik.index.desc': 'Definice {n}+ pojmů z oblasti zemědělství, techniky, dotací a precision farming. Co je AdBlue, CVT, ISOBUS, RTK GPS, EKO-platba, BISS a další.',
  'slovnik.index.kicker': 'Slovník · {n} pojmů',
  'slovnik.index.h1': 'Slovník zemědělských pojmů',
  'slovnik.index.lede': 'Definice technických termínů — od AdBlue přes ISOBUS po BISS a EKO-platbu. Cíleno na zemědělce, dealery, agronomy i začátečníky.',
  'slovnik.index.collName': 'Slovník zemědělských pojmů',
  'slovnik.detail.titleSuffix': ' — co to je? Vysvětlení',
  'slovnik.detail.also': 'Také:',
  'slovnik.detail.areaHeading': 'Převodník — {term} na další jednotky plochy',
  'slovnik.detail.areaCaption': 'Zadej hodnotu a vyber jednotku. Převody se přepočítají okamžitě. Pro starší jednotky (jitro, korec, strych) jsou použité standardizované hodnoty z roku 1764.',
  'slovnik.detail.weightHeading': 'Převodník — {term} na další jednotky hmotnosti',
  'slovnik.detail.weightCaption': 'Bušl má různou hmotnost podle komodity — vyber konkrétní plodinu z dropdownu. Hodnoty bušlu odpovídají USDA standardu.',
  'slovnik.detail.zajimavosti': 'Zajímavosti',
  'slovnik.detail.faq': 'Časté dotazy',
  'slovnik.detail.external': 'Externí zdroj:',
  'slovnik.detail.related': 'Související pojmy',
  'slovnik.detail.back': '← Zpět na slovník',
  'slovnik.detail.definedTermSet': 'Slovník zemědělských pojmů',
```

> ⚠️ Bajt-parita: hodnoty musí přesně odpovídat dnešním literálům v `index.astro`/`[slug].astro` (Task 3/4 je nahradí `t()`/`tf()`). Žádné změny interpunkce, mezer, em-dashů.

- [ ] **Step 3: Přidat stejné klíče do `src/i18n/ui/uk.ts`** (ukrajinsky)

```ts
  'slovnik.crumb.home': 'Головна',
  'slovnik.crumb.glossary': 'Словник',
  'slovnik.index.title': 'Словник сільськогосподарських термінів',
  'slovnik.index.desc': 'Визначення {n}+ термінів із галузі сільського господарства, техніки, субсидій та точного землеробства. Що таке AdBlue, CVT, ISOBUS, RTK GPS та інші.',
  'slovnik.index.kicker': 'Словник · {n} термінів',
  'slovnik.index.h1': 'Словник сільськогосподарських термінів',
  'slovnik.index.lede': 'Визначення технічних термінів — від AdBlue через ISOBUS до точного землеробства. Для аграріїв, дилерів, агрономів і початківців.',
  'slovnik.index.collName': 'Словник сільськогосподарських термінів',
  'slovnik.detail.titleSuffix': ' — що це таке? Пояснення',
  'slovnik.detail.also': 'Також:',
  'slovnik.detail.areaHeading': 'Конвертер — {term} в інші одиниці площі',
  'slovnik.detail.areaCaption': 'Введіть значення та виберіть одиницю. Перерахунок відбувається миттєво. Для історичних одиниць використано стандартизовані значення.',
  'slovnik.detail.weightHeading': 'Конвертер — {term} в інші одиниці маси',
  'slovnik.detail.weightCaption': 'Бушель має різну масу залежно від культури — виберіть культуру зі списку. Значення бушеля відповідають стандарту USDA.',
  'slovnik.detail.zajimavosti': 'Цікаві факти',
  'slovnik.detail.faq': 'Часті запитання',
  'slovnik.detail.external': 'Зовнішнє джерело:',
  'slovnik.detail.related': "Пов'язані терміни",
  'slovnik.detail.back': '← Назад до словника',
  'slovnik.detail.definedTermSet': 'Словник сільськогосподарських термінів',
```

- [ ] **Step 4: Přidat stejné klíče do `src/i18n/ui/sk.ts`** (slovensky — pro key-parita; sk slovník se nelaunchuje, ale klíče musí existovat)

```ts
  'slovnik.crumb.home': 'Domov',
  'slovnik.crumb.glossary': 'Slovník',
  'slovnik.index.title': 'Slovník poľnohospodárskych pojmov',
  'slovnik.index.desc': 'Definície {n}+ pojmov z oblasti poľnohospodárstva, techniky, dotácií a precision farming. Čo je AdBlue, CVT, ISOBUS, RTK GPS a ďalšie.',
  'slovnik.index.kicker': 'Slovník · {n} pojmov',
  'slovnik.index.h1': 'Slovník poľnohospodárskych pojmov',
  'slovnik.index.lede': 'Definície technických termínov — od AdBlue cez ISOBUS po precision farming. Cielené na poľnohospodárov, dealerov, agronómov aj začiatočníkov.',
  'slovnik.index.collName': 'Slovník poľnohospodárskych pojmov',
  'slovnik.detail.titleSuffix': ' — čo to je? Vysvetlenie',
  'slovnik.detail.also': 'Tiež:',
  'slovnik.detail.areaHeading': 'Prevodník — {term} na ďalšie jednotky plochy',
  'slovnik.detail.areaCaption': 'Zadaj hodnotu a vyber jednotku. Prevody sa prepočítajú okamžite.',
  'slovnik.detail.weightHeading': 'Prevodník — {term} na ďalšie jednotky hmotnosti',
  'slovnik.detail.weightCaption': 'Bušel má rôznu hmotnosť podľa komodity — vyber plodinu zo zoznamu. Hodnoty zodpovedajú štandardu USDA.',
  'slovnik.detail.zajimavosti': 'Zaujímavosti',
  'slovnik.detail.faq': 'Časté otázky',
  'slovnik.detail.external': 'Externý zdroj:',
  'slovnik.detail.related': 'Súvisiace pojmy',
  'slovnik.detail.back': '← Späť na slovník',
  'slovnik.detail.definedTermSet': 'Slovník poľnohospodárskych pojmov',
```

- [ ] **Step 5: Spustit key-parita test — musí projít**

Run: `npx vitest run tests/i18n/` (nebo konkrétní key-parita soubor z Step 1)
Expected: PASS (cs/sk/uk mají identickou množinu klíčů).

- [ ] **Step 6: Commit**

```bash
git add src/i18n/ui/cs.ts src/i18n/ui/uk.ts src/i18n/ui/sk.ts
git commit -m "feat(i18n): slovnik.* chrome klíče (cs verbatim, uk, sk)"
```

---

## Task 3: `slovnik/index.astro` → SSR + lokalizované chrome

**Files:**
- Modify: `src/pages/slovnik/index.astro`

- [ ] **Step 1: Přepsat frontmatter na SSR + locale**

Nahraď řádky 1–28 (od `export const prerender` po konec JSON-LD bloku) takto (vzor: `encyklopedie/index.astro`):

```ts
export const prerender = false;
import Layout from '../../layouts/Layout.astro';
import { getSlovnik, getKategorieLabels, type SlovnikKategorie } from '../../lib/slovnik';
import { breadcrumbSchema, itemListSchema } from '../../lib/structured-data';
import { SITE_URL } from '../../lib/config';
import { useTranslations, getLocaleFromUrl, tf } from '../../i18n/utils';

const locale = Astro.locals.locale ?? getLocaleFromUrl(Astro.url);
const t = useTranslations(locale);
const base = locale === 'uk' ? '/uk' : locale === 'sk' ? '/sk' : '';
Astro.response.headers.set('Cache-Control', 'public, max-age=600, s-maxage=3600, stale-while-revalidate=86400');

const SLOVNIK = getSlovnik(locale);
const KATEGORIE_LABELS = getKategorieLabels(locale);
const canonical = `${SITE_URL}${base}/slovnik/`;

const byCategory = SLOVNIK.reduce((acc, t2) => {
  if (!acc[t2.kategorie]) acc[t2.kategorie] = [];
  acc[t2.kategorie].push(t2);
  return acc;
}, {} as Record<SlovnikKategorie, typeof SLOVNIK>);

for (const cat in byCategory) {
  byCategory[cat as SlovnikKategorie].sort((a, b) => a.term.localeCompare(b.term, locale));
}

const breadcrumbJsonLd = breadcrumbSchema([
  { name: t('slovnik.crumb.home'), url: `${base}/` },
  { name: t('slovnik.crumb.glossary'), url: canonical },
]);

const itemListJsonLd = itemListSchema(
  SLOVNIK.map((term) => ({ url: `${SITE_URL}${base}/slovnik/${term.slug}/`, name: term.term })),
  t('slovnik.index.collName'),
);
```

- [ ] **Step 2: Lokalizovat JSX chrome (řádky ~31–68)**

Nahraď literály:
- `<Layout title="Slovník zemědělských pojmů" description={...} canonical={canonical}>` → `title={t('slovnik.index.title')}` a `description={tf(locale, 'slovnik.index.desc', { n: SLOVNIK.length })}`.
- breadcrumb: `<a href="/">Domů</a>` → `<a href={`${base}/`}>{t('slovnik.crumb.home')}</a>`; `<span class="current">Slovník</span>` → `{t('slovnik.crumb.glossary')}`.
- kicker: `Slovník · {SLOVNIK.length} pojmů` → `{tf(locale, 'slovnik.index.kicker', { n: SLOVNIK.length })}`.
- `<h1>Slovník zemědělských pojmů</h1>` → `<h1>{t('slovnik.index.h1')}</h1>`.
- lede `<p class="lede">…</p>` → `{t('slovnik.index.lede')}`.
- karta odkaz: `href={`/slovnik/${t.slug}/`}` → `href={`${base}/slovnik/${term.slug}/`}` (pozor: přejmenuj iterační proměnnou z `t` na `term`, koliduje s translatorem `t`).

> ⚠️ Iterační proměnná v `.map((t) => …)` koliduje s `const t = useTranslations`. Přejmenuj na `term` ve všech `.map` v JSX.

- [ ] **Step 3: Build ověří kompilaci**

Run: `npm run build 2>&1 | tail -5`
Expected: `Complete!` bez TS chyb.

- [ ] **Step 4: CS sémantická parita (dev smoke)**

```bash
pkill -f "astro dev" || true
npm run dev > /tmp/slovnik-dev.log 2>&1 &
sleep 6
curl -s http://localhost:4321/slovnik/ | grep -oE "<title>[^<]*</title>|Slovník · [0-9]+ pojmů|<h1>[^<]*</h1>" | head
pkill -f "astro dev" || true
```
Expected: `<title>Slovník zemědělských pojmů…`, `Slovník · 308 pojmů`, `<h1>Slovník zemědělských pojmů</h1>` — identické s masterem.

- [ ] **Step 5: Commit**

```bash
git add src/pages/slovnik/index.astro
git commit -m "feat(slovnik): index.astro SSR + lokalizované chrome (CS parita)"
```

---

## Task 4: `slovnik/[slug].astro` → SSR + lokalizované chrome + uk link-kontext

**Files:**
- Modify: `src/pages/slovnik/[slug].astro`

- [ ] **Step 1: Přepsat frontmatter na SSR + locale, odstranit getStaticPaths**

Nahraď řádky 1–22:

```ts
export const prerender = false;
import Layout from '../../layouts/Layout.astro';
import { getSlovnik, getSlovnikTerm, getKategorieLabels } from '../../lib/slovnik';
import { breadcrumbSchema, faqPageSchema } from '../../lib/structured-data';
import { SITE_URL } from '../../lib/config';
import AreaConverter from '../../components/AreaConverter.astro';
import WeightConverter from '../../components/WeightConverter.astro';
import { injectLinks, createLinkContext } from '../../lib/auto-linker';
import { useTranslations, getLocaleFromUrl, tf } from '../../i18n/utils';

const locale = Astro.locals.locale ?? getLocaleFromUrl(Astro.url);
const t = useTranslations(locale);
const base = locale === 'uk' ? '/uk' : locale === 'sk' ? '/sk' : '';
Astro.response.headers.set('Cache-Control', 'public, max-age=600, s-maxage=3600, stale-while-revalidate=86400');

const { slug } = Astro.params;
const term = getSlovnikTerm(slug!, locale);
if (!term) return Astro.rewrite('/404');

const SLOVNIK = getSlovnik(locale);
const KATEGORIE_LABELS = getKategorieLabels(locale);
const pageUrl = `${SITE_URL}${base}/slovnik/${term.slug}/`;
const relatedTerms = (term.related ?? [])
  .map((s) => getSlovnikTerm(s, locale))
  .filter((rt): rt is NonNullable<typeof rt> => !!rt);
```

> `AREA_UNIT_BY_SLUG`/`WEIGHT_UNIT_BY_SLUG` (řádky 24–48) ponech beze změny — klíčují na slug, jazykově neutrální.

- [ ] **Step 2: Lokalizovat JSON-LD bloky (řádky ~50–73)**

- breadcrumb: `{ name: 'Domů', url: '/' }` → `{ name: t('slovnik.crumb.home'), url: `${base}/` }`; `{ name: 'Slovník', url: '/slovnik/' }` → `{ name: t('slovnik.crumb.glossary'), url: `${base}/slovnik/` }`; třetí položka `url: pageUrl` zůstává.
- `definedTermJsonLd.inDefinedTermSet.name`: `'Slovník zemědělských pojmů'` → `t('slovnik.detail.definedTermSet')`; `url: `${SITE_URL}/slovnik/`` → `${SITE_URL}${base}/slovnik/`.

- [ ] **Step 3: uk link-kontext (řádky ~76–96) — zabránit injekci CS odkazů do UK**

`SLOVNIK_BY_SLUG` a `createLinkContext` nech, ale wikilink href + auto-linker omez na cs:

```ts
const SLOVNIK_BY_SLUG = new Map(SLOVNIK.map((tt) => [tt.slug, tt.term]));
const linkCtx = createLinkContext(pageUrl);

const renderedParagraphs = term.longDef.split('\n\n').map((para) => {
  const withWikilinks = para.replace(/\[\[([a-z0-9-]+)\]\]/gi, (m, s) => {
    const name = SLOVNIK_BY_SLUG.get(s);
    if (!name) return m;
    return `<a href="${base}/slovnik/${s}/">${name}</a>`;
  });
  const withBold = withWikilinks.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // auto-linker injektuje CS značky/modely/hesla — pro uk vypnout (zabrání CS odkazům v UK textu).
  return locale === 'cs' ? injectLinks(withBold, linkCtx) : withBold;
});
```

> ⚠️ `injectLinks` jen pro `cs` → CS render BAJT-IDENTICKÝ; uk/sk dostanou jen wikilinks+bold (bezpečné, žádné CS odkazy).

- [ ] **Step 4: Lokalizovat JSX chrome (řádky ~99–196)**

- `title={`${term.term} — co to je? Vysvětlení`}` → `title={`${term.term}${t('slovnik.detail.titleSuffix')}`}`.
- breadcrumb `Domů`/`Slovník` href: `<a href="/">` → `<a href={`${base}/`}>{t('slovnik.crumb.home')}</a>`; `<a href="/slovnik/">Slovník</a>` → `<a href={`${base}/slovnik/`}>{t('slovnik.crumb.glossary')}</a>`.
- `Také:` → `{t('slovnik.detail.also')}`.
- AreaConverter `heading={`Převodník — ${term.term} na další jednotky plochy`}` → `heading={tf(locale, 'slovnik.detail.areaHeading', { term: term.term })}`; `caption="…"` → `caption={t('slovnik.detail.areaCaption')}`.
- WeightConverter heading → `tf(locale, 'slovnik.detail.weightHeading', { term: term.term })`; caption → `t('slovnik.detail.weightCaption')`.
- `<h2>Zajímavosti</h2>` → `{t('slovnik.detail.zajimavosti')}`; `<h2>Časté dotazy</h2>` → `{t('slovnik.detail.faq')}`; `Externí zdroj:` → `{t('slovnik.detail.external')}`; `<h2>Související pojmy</h2>` → `{t('slovnik.detail.related')}`; `← Zpět na slovník` → `{t('slovnik.detail.back')}`.
- related karta href `href={`/slovnik/${rt.slug}/`}` → `href={`${base}/slovnik/${rt.slug}/`}`.
- `KATEGORIE_LABELS[term.kategorie]` (kicker) — funguje, lokalizovaná mapa už je v scope.

- [ ] **Step 5: Build ověří kompilaci**

Run: `npm run build 2>&1 | tail -5`
Expected: `Complete!`.

- [ ] **Step 6: CS sémantická parita (vzorek hesel napříč kategoriemi)**

```bash
pkill -f "astro dev" || true; npm run dev > /tmp/slv.log 2>&1 & sleep 6
for s in adblue hektar dzes saps; do
  echo "== $s =="; curl -s http://localhost:4321/slovnik/$s/ | grep -oE "<title>[^<]*</title>|class=\"auto-link" | head -3
done
pkill -f "astro dev" || true
```
Expected: title `… — co to je? Vysvětlení` + `auto-link` třídy přítomné (CS auto-linker stále běží). Identické s masterem.

- [ ] **Step 7: Commit**

```bash
git add src/pages/slovnik/[slug].astro
git commit -m "feat(slovnik): [slug].astro SSR + chrome + uk link-kontext (CS parita)"
```

---

## Task 5: Překlad 308 hesel do `SLOVNIK_UK` (subagent-driven, dávky)

**Files:**
- Modify: `src/lib/slovnik.uk.ts` (naplnit `SLOVNIK_UK`)

**Metoda:** Subagent-driven. Rozděl 308 CS hesel (`SLOVNIK` = `SLOVNIK_CORE` 206 + `SLOVNIK_EXTRA` 102) do **9 dávek po ~34 heslech** podle pořadí v poli. Každá dávka = jeden subagent (`Agent` tool, `subagent_type: general-purpose`), který přeloží svůj slice do `SlovnikTerm[]` a vrátí jako TS literál do mezisouboru `/tmp/slovnik-uk/batch-NN.ts`. Hlavní session pak slije do `SLOVNIK_UK`.

**Překladový kontrakt (každý subagent dostane doslovně):**
- Vstup: pole CS `SlovnikTerm` objektů (z konkrétního slice). Výstup: stejné objekty s přeloženými poli.
- **Přelož:** `term`, `alias[]`, `shortDef`, `longDef` (zachovej `\n\n` strukturu odstavců, `[[slug]]` wikilinky a `**bold**` markery NEMĚŇ), `faq[].q`, `faq[].a`, `zajimavosti[]`.
- **NEMĚŇ:** `slug`, `kategorie`, `related[]` (zůstávají cs slugy), čísla, jednotky, značky (NPK, ISOBUS, AdBlue, CVT, DPF, RTK…), chemické vzorce.
- **Jurisdikce:** CZ/EU-CAP a dotační pojmy (SAPS, ANC, ekoschémata, PRV, greening, redistributivní platba…) a tržní pojmy (MATIF, forward, basis) → **encyklopedický výklad** (co to je obecně / v rámci EU). **NEtvrdit, že UA používá SZIF / ČR-administrativu.** Kde CS text říká „v ČR podáváte přes SZIF…", přeformuluj na neutrální popis mechanismu (UA = kandidát EU, kontext relevantní).
- Historické ČR jednotky (korec, strych, jitro, morgen, q) → ponech jako heslo s ukrajinským výkladem.
- `externalUrl`: pokud `cs.wikipedia.org`, změň na `uk.wikipedia.org` se stejným article path (subagent nesmí ověřovat existenci — to dělá UK review v Tasku 6); `externalLabel` přelož.
- Terminologie: odborná ukrajinská zemědělská/strojní. Spisovná ukrajinština, žádná ruština.

- [ ] **Step 1: Vygenerovat slice manifest**

```bash
mkdir -p /tmp/slovnik-uk
node -e "
const { SLOVNIK } = require('./dist/...');" 2>/dev/null || \
npx tsx -e "
import { SLOVNIK } from './src/lib/slovnik';
import { writeFileSync } from 'fs';
const SIZE = 34;
for (let i=0, b=1; i<SLOVNIK.length; i+=SIZE, b++) {
  writeFileSync('/tmp/slovnik-uk/cs-batch-'+String(b).padStart(2,'0')+'.json', JSON.stringify(SLOVNIK.slice(i, i+SIZE), null, 2));
}
console.log('batches:', Math.ceil(SLOVNIK.length/SIZE));
"
```
Expected: `batches: 9`, soubory `/tmp/slovnik-uk/cs-batch-01.json` … `cs-batch-09.json`.

- [ ] **Step 2: Dispatch 9 subagentů (paralelně po ~3) s překladovým kontraktem**

Pro každou dávku `NN` spusť `Agent` (general-purpose) s promptem: kontrakt výše + obsah `cs-batch-NN.json` + instrukce „vrať validní TS pole `SlovnikTerm[]` jako `export const BATCH_NN: SlovnikTerm[] = [...]` do `/tmp/slovnik-uk/uk-batch-NN.ts` (import typu z relativní cesty není nutný — vrať čistý objektový literál bez `import`)". Subagent vrací JSON cestu + počet hesel.

- [ ] **Step 3: Slít dávky do `SLOVNIK_UK` a ověřit počet**

Slij `uk-batch-01..09` do `src/lib/slovnik.uk.ts` (`SLOVNIK_UK` = konkatenace v pořadí dávek). Pak:

```bash
npx tsx -e "import { SLOVNIK_UK } from './src/lib/slovnik.uk'; console.log('uk count:', SLOVNIK_UK.length)"
```
Expected: `uk count: 308`.

- [ ] **Step 4: Build + lint kompilace**

Run: `npm run build 2>&1 | tail -5`
Expected: `Complete!` (validní TS, žádné syntaktické chyby v UK literálech).

- [ ] **Step 5: Commit**

```bash
git add src/lib/slovnik.uk.ts
git commit -m "feat(slovnik): překlad 308 hesel do SLOVNIK_UK (subagent-driven)"
```

---

## Task 6: UK review brána (kvalita překladu)

**Files:**
- Modify: `src/lib/slovnik.uk.ts` (opravy z review)

- [ ] **Step 1: Dispatch UK review subagentů**

Rozděl 308 uk hesel do ~6 dávek; každý review subagent (general-purpose) dostane uk + odpovídající cs heslo a kontroluje: (a) spisovná ukrajinština, 0 ruštiny, 0 CS kontaminace; (b) odborná terminologie; (c) **žádné chybné jurisdikční tvrzení** (UA ≠ SZIF/ČR); (d) zachované slugy/čísla/wikilinky/related. Vrací seznam oprav `{slug, pole, návrh}`.

- [ ] **Step 2: Aplikovat opravy**

Zapracuj navržené opravy do `src/lib/slovnik.uk.ts`.

- [ ] **Step 3: Build**

Run: `npm run build 2>&1 | tail -3`
Expected: `Complete!`.

- [ ] **Step 4: Commit**

```bash
git add src/lib/slovnik.uk.ts
git commit -m "fix(slovnik): UK review opravy (terminologie, jurisdikce)"
```

---

## Task 7: Key-parita test 308 + uk-launch rozšíření

**Files:**
- Modify: `tests/lib/slovnik-uk.test.ts`
- Modify: `tests/i18n/uk-launch.test.ts` (najdi existující; pokud jiný název, použij ten)

- [ ] **Step 1: Přidat key-parita test do `tests/lib/slovnik-uk.test.ts`**

```ts
import { SLOVNIK_UK } from '../../src/lib/slovnik.uk';
import { SLOVNIK } from '../../src/lib/slovnik';

describe('slovnik UK key-parita', () => {
  it('UK má stejný počet hesel jako CS (308)', () => {
    expect(SLOVNIK_UK.length).toBe(SLOVNIK.length);
  });
  it('UK slug množina = CS slug množina', () => {
    const cs = new Set(SLOVNIK.map((t) => t.slug));
    const uk = new Set(SLOVNIK_UK.map((t) => t.slug));
    expect([...uk].sort()).toEqual([...cs].sort());
  });
  it('UK related slugy ukazují na existující hesla', () => {
    const slugs = new Set(SLOVNIK_UK.map((t) => t.slug));
    for (const t of SLOVNIK_UK) for (const r of t.related ?? []) expect(slugs.has(r)).toBe(true);
  });
  it('UK kategorie = CS kategorie (per slug)', () => {
    const csKat = new Map(SLOVNIK.map((t) => [t.slug, t.kategorie]));
    for (const t of SLOVNIK_UK) expect(t.kategorie).toBe(csKat.get(t.slug));
  });
});
```

- [ ] **Step 2: Spustit — musí projít**

Run: `npx vitest run tests/lib/slovnik-uk.test.ts`
Expected: PASS.

- [ ] **Step 3: Rozšířit uk-launch test o `/slovnik`**

Najdi vzor pro existující launched prefixy (`/encyklopedie`, `/jak-na-to`) v `tests/i18n/uk-launch.test.ts` a přidej analogické aserce pro `/slovnik` (isLaunchedPath('uk','/slovnik') === true). Pokud test čte `LAUNCHED_PREFIXES.uk`, aserce se aktivuje až po Tasku 8 — napiš ji tak, aby odpovídala stavu PO launchi.

- [ ] **Step 4: Commit**

```bash
git add tests/lib/slovnik-uk.test.ts tests/i18n/uk-launch.test.ts
git commit -m "test(slovnik): key-parita 308 + uk-launch /slovnik"
```

---

## Task 8: Launch gating — přidat `/slovnik` do `LAUNCHED_PREFIXES.uk` + ověřit nav/sitemap

**Files:**
- Modify: `src/i18n/utils.ts:34` (`LAUNCHED_PREFIXES.uk`)

- [ ] **Step 1: Přidat prefix**

V `src/i18n/utils.ts` uprav `uk` řádek:

```ts
  uk: ['/stroje', '/srovnani', '/znacky', '/encyklopedie', '/jak-na-to', '/slovnik'],
```

- [ ] **Step 2: Ověřit nav (žádná změna nutná — `/slovnik` je pod sekcí `tech`, ne `data`)**

```bash
npx tsx -e "
import { buildNav } from './src/i18n/nav';
const nav = buildNav('uk');
const tech = nav.find(s => s.section==='tech');
const g = tech?.children.find(c => c.href.includes('slovnik'));
console.log('uk glossary href:', g?.href);
"
```
Expected: `uk glossary href: /uk/slovnik/` (navHref zlokalizoval, protože `/slovnik` je teď launched a sekce `tech` není hidden pro uk). Pokud vrátí `/slovnik/`, ověř `HIDDEN_SECTIONS.uk` neobsahuje `tech` a `navHref` logiku.

> Pozn.: přesné API (`buildNav`/`getNav`) ověř v `src/i18n/nav.ts`; jméno funkce přizpůsob.

- [ ] **Step 3: Ověřit sitemap auto-mirror (žádná změna kódu)**

```bash
pkill -f "astro dev" || true; npm run dev > /tmp/sm.log 2>&1 & sleep 6
curl -s http://localhost:4321/sitemap.xml | grep -c "/uk/slovnik/"
pkill -f "astro dev" || true
```
Expected: **309** (`/uk/slovnik/` hub + 308 detailů; ukMirror zrcadlí automaticky, slugy = cs). Pokud 0 → ověř `.env` zkopírováno (jinak sitemap 500).

- [ ] **Step 4: Commit**

```bash
git add src/i18n/utils.ts
git commit -m "feat(slovnik): launch /uk/slovnik (LAUNCHED_PREFIXES.uk)"
```

---

## Task 9: Finální verifikace (full suite + build + smoke + CS parita)

**Files:** žádné (jen verifikace)

- [ ] **Step 1: Plná test suite**

Run: `npx vitest run 2>&1 | tail -8`
Expected: `3 failed | … passed` — **3 fail = pre-existing bazar-nav baseline** (`tests/i18n/nav.test.ts`), VŠECHNY ostatní (vč. nových slovnik-uk + uk-launch) PASS. Žádný NOVÝ fail.

- [ ] **Step 2: Production build**

Run: `npm run build 2>&1 | tail -5`
Expected: `Complete!`.

- [ ] **Step 3: Dev smoke — uk render + cs nezměněn**

```bash
pkill -f "astro dev" || true; npm run dev > /tmp/final.log 2>&1 & sleep 6
echo "-- cs (beze změny) --"; curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/slovnik/adblue/
echo "-- uk render --"; curl -s http://localhost:4321/uk/slovnik/adblue/ | grep -oE "<title>[^<]*</title>|index,follow|noindex" | head -3
echo "-- uk index --"; curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/uk/slovnik/
echo "-- uk chybějící slug → 404 --"; curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/uk/slovnik/neexistujici-heslo-xyz/
echo "-- hreflang cs↔uk --"; curl -s http://localhost:4321/slovnik/adblue/ | grep -oE "hreflang=\"uk\"" | head -1
pkill -f "astro dev" || true
```
Expected: cs `200`; uk title v ukrajinštině + `index,follow`; uk index `200`; chybějící uk slug `404`; cs stránka emituje `hreflang="uk"`.

- [ ] **Step 4: CS sémantická parita vs master (vzorek)**

```bash
for s in adblue hektar dzes saps redistributivni-platba; do
  echo "== $s =="
  diff <(git show master:src/pages/slovnik/\[slug\].astro >/dev/null 2>&1; curl -s http://localhost:4321/slovnik/$s/ 2>/dev/null | grep -oE "<h1>.*</h1>|<title>.*</title>") /dev/null 2>/dev/null
done
```
> Pozn.: spolehlivá parita = porovnat extrahovaný text/JSON-LD CS stránky z masteru (build masteru) vs větve. Pokud čas, postav master do `/tmp/master-dist` a porovnej vyrenderované CS HTML (bez per-build hashů). Minimum: title/h1/breadcrumb/JSON-LD CS musí být identické.

- [ ] **Step 5: Hotovo — handoff na finishing-a-development-branch**

Po zelené verifikaci → `superpowers:finishing-a-development-branch` (merge/PR po schválení uživatele → push master → Coolify; live smoke `/uk/slovnik/<slug>/` napříč; pak úklid worktree+větve).

---

## Self-Review (proti specu)

- **Spec §1 (data/lib):** Task 1 ✓ (slovnik.uk.ts, getSlovnik/getSlovnikTerm/getKategorieLabels, CS verbatim).
- **Spec §2 (routa SSR + CS parita + widgety + auto-linker):** Task 3 (index) + Task 4 ([slug], widgety zachované, auto-linker jen cs) ✓.
- **Spec §3 (gating/nav/sitemap/hreflang):** Task 8 ✓ (prefix; nav auto-localizuje; sitemap auto-mirror — ověřeno, že slugy identické → bez explicitního kódu, na rozdíl od konzervativního §3.3).
- **Spec §4 (překlad + UK review + 308 encyklopedicky + jurisdikce):** Task 5 + Task 6 ✓.
- **Spec §5 (testy: key-parita, CS parita, vitest 3-fail baseline, build, smoke):** Task 7 + Task 9 ✓.
- **Spec §6 (hranice):** jen slovník, žádná SK varianta dat, CS nezměněn, launch poslední ✓.
- **i18n chrome:** Task 2 — nově oproti specu odhaleno (routa měla hardcoded CS); cs hodnoty bajt-identické kvůli paritě. Pokryto.
- **Placeholder scan:** žádné TBD/TODO; kód v každém kroku. Jediná dynamická místa (jméno key-parity testu, `tf` placeholder konvence, `buildNav` API) mají explicitní ověřovací grep krok.
- **Type consistency:** `getSlovnik`/`getSlovnikTerm(slug,locale)`/`getKategorieLabels` konzistentní napříč Task 1/3/4/7; `SLOVNIK_UK`/`KATEGORIE_LABELS_UK` konzistentní.
