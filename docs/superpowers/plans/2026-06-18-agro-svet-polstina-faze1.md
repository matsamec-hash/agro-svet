# Polská lokalizace agro-svet.cz — Fáze 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Přidat polský locale `pl` s živými indexovatelnými stránkami pro katalog (`/stroje`, `/znacky`, `/srovnani`) a slovník (`/slovnik`), bez českého leaku a při zachování cs/sk/uk byte-identických.

**Architecture:** Aditivní `pl` větve k existujícím cs/sk/uk vzorům. Nové soubory (`ui/pl.ts`, `slovnik.pl.ts`) + aditivní změny v registru locale, generátorech textu, nav filtru, sitemapě. cs no-op je garantováno `t()`/`localizePath` fallbackem a tím, že nové `pl` větve nezasahují do existujících. Polština má plurály identické s uk (one/few/many).

**Tech Stack:** Astro (SSR `@astrojs/node`), TypeScript, vitest. Build vyžaduje node≥22 (`nvm use 22`).

**Spec:** `docs/superpowers/specs/2026-06-18-agro-svet-polstina-faze1-design.md`

---

## Klíčové konvence (číst před prvním taskem)

- **cs byte-identické:** žádná změna nesmí měnit cs výstup. Nové `pl` větve se přidávají PŘED `cs` fallback (`... : locale === 'pl' ? pl : cs`), nikdy nemění existující sk/uk/cs větve.
- **Native fráze, NE strojový překlad:** generátorové `pl` varianty piš jako native polštinu (správné pády — akuzativ/genitiv), vzorem je struktura `uk` varianty ve stejném souboru, ne doslovný překlad cs.
- **Build artefakt:** `git add` jen explicitně jmenované soubory. NIKDY necommituj `src/generated/content-dates.json` (build ho přegeneruje).
- **Baseline STALE testy:** ~5 testů (cs nav „7 top-level/bazar", utils uk) failuje i na čistém master (cs skrývá bazar) → NE regrese, neopravovat.
- **Test runner:** `npx vitest run <path>` (jednorázově, ne watch).
- **Build:** `nvm use 22 && npm run build` (EXIT 0).

---

## Task 1: Registrace locale `pl` v config + plurály

**Files:**
- Modify: `src/i18n/config.ts`
- Modify: `src/i18n/utils.ts` (funkce `plural`, řádky ~124-140)
- Test: `tests/i18n/plural.test.ts` (přidat pl describe blok)

- [ ] **Step 1: Přidej `pl` plural test (failing)**

Do `tests/i18n/plural.test.ts` přidej na konec:

```typescript
describe('plural — pl (polská pravidla = stejná jako uk: one / few / many)', () => {
  const f = { one: 'model', few: 'modele', many: 'modeli' };
  it('one: n%10==1 & n%100!=11', () => {
    expect(plural('pl', 1, f)).toBe('model');
    expect(plural('pl', 21, f)).toBe('model');
  });
  it('few: n%10 in 2..4 & n%100 not in 12..14', () => {
    expect(plural('pl', 2, f)).toBe('modele');
    expect(plural('pl', 23, f)).toBe('modele');
  });
  it('many: zbytek vč. 0, 5, 11–14', () => {
    expect(plural('pl', 0, f)).toBe('modeli');
    expect(plural('pl', 5, f)).toBe('modeli');
    expect(plural('pl', 11, f)).toBe('modeli');
    expect(plural('pl', 12, f)).toBe('modeli');
    expect(plural('pl', 25, f)).toBe('modeli');
  });
});
```

- [ ] **Step 2: Spusť test — ověř FAIL**

Run: `npx vitest run tests/i18n/plural.test.ts`
Expected: FAIL (pl propadne do cs/sk větve → `plural('pl', 0)` vrátí `'modeli'`? — ne, cs větev: abs===1? ne; 2-4? ne; → many `'modeli'` OK, ale `plural('pl', 2)` → cs few `'modele'` OK… **pozn.:** cs/sk větev dá pro malá čísla NÁHODOU správně, ale `plural('pl', 12)` → cs many `'modeli'` OK, `plural('pl', 22)` → cs 22 → many `'modeli'` ŠPATNĚ (má být few `'modele'`)). Test `few: 22` (přidej) selže. Uprav step 1 test aby obsahoval `expect(plural('pl', 22, f)).toBe('modele')` — to v cs větvi selže.

- [ ] **Step 3: Přidej `pl` do uk plural větve**

V `src/i18n/utils.ts` funkce `plural`, změň podmínku:

```typescript
  if (locale === 'uk' || locale === 'pl') {
    const mod10 = abs % 10;
    const mod100 = abs % 100;
    if (mod10 === 1 && mod100 !== 11) return forms.one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms.few;
    return forms.many;
  }
```

- [ ] **Step 4: Registruj `pl` v config.ts**

V `src/i18n/config.ts`:
```typescript
export const locales = ['cs', 'sk', 'uk', 'pl'] as const;
```
a do `localeNames`:
```typescript
  pl: 'Polski',
```

- [ ] **Step 5: Spusť test — ověř PASS**

Run: `npx vitest run tests/i18n/plural.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/i18n/config.ts src/i18n/utils.ts tests/i18n/plural.test.ts
git commit -m "feat(pl): registr locale pl + polské plurály (= uk vzor)"
```

---

## Task 2: Chrome překlad `ui/pl.ts` (~806 klíčů)

**Files:**
- Create: `src/i18n/ui/pl.ts`
- Modify: `src/i18n/ui/index.ts`
- Test: `tests/i18n/ui-pl-parity.test.ts` (nový)

**Pozn.:** Toto je velký překladový task → ideální pro dedikovaný translator-subagent. Zdroj = `src/i18n/ui/cs.ts` (806 klíčů). Vzorem struktury je `src/i18n/ui/uk.ts`.

- [ ] **Step 1: Napiš key-parity test (failing)**

Create `tests/i18n/ui-pl-parity.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import cs from '../../src/i18n/ui/cs';
import pl from '../../src/i18n/ui/pl';

describe('ui/pl.ts key-parita s cs', () => {
  it('pl má přesně stejné klíče jako cs (žádné chybějící/přebývající)', () => {
    expect(Object.keys(pl).sort()).toEqual(Object.keys(cs).sort());
  });
  it('žádná pl hodnota není prázdná', () => {
    for (const [k, v] of Object.entries(pl)) expect(v, k).toBeTruthy();
  });
  it('lang.* přepínač má polské popisky', () => {
    expect(pl['lang.cs']).toBe('CZ');
    expect(pl['lang.sk']).toBe('SK');
    expect(pl['lang.uk']).toBe('UA');
    expect(pl['lang.pl']).toBe('PL');
  });
});
```

- [ ] **Step 2: Spusť — ověř FAIL (modul neexistuje)**

Run: `npx vitest run tests/i18n/ui-pl-parity.test.ts`
Expected: FAIL — `Cannot find module './pl'`

- [ ] **Step 3: Vytvoř `src/i18n/ui/pl.ts` překladem cs.ts**

Zkopíruj strukturu `src/i18n/ui/cs.ts` (`const pl: Record<string, string> = { ... }; export default pl;`), přelož KAŽDOU hodnotu do polštiny. Zachovej:
- všechny klíče identické s cs (parita)
- interpolační tokeny `{token}` beze změny
- `lang.cs`='CZ', `lang.sk`='SK', `lang.uk`='UA', přidej **nový klíč** `lang.pl`='PL'
- `lang.switch`='Język'
- markdown/HTML entity ponech

⚠️ Přidej `'lang.pl': 'PL'` i do `cs.ts`, `sk.ts`, `uk.ts` (jinak ostatní locale nemají popisek pro PL tlačítko v LangSwitcheru → fallback na klíč). V cs/sk/uk je hodnota taky `'PL'`.

- [ ] **Step 4: Zapoj do `ui/index.ts`**

```typescript
import type { Locale } from '../config';
import cs from './cs';
import sk from './sk';
import uk from './uk';
import pl from './pl';

export const ui: Record<Locale, Record<string, string>> = { cs, sk, uk, pl };
```

- [ ] **Step 5: Spusť — ověř PASS**

Run: `npx vitest run tests/i18n/ui-pl-parity.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/i18n/ui/pl.ts src/i18n/ui/index.ts src/i18n/ui/cs.ts src/i18n/ui/sk.ts src/i18n/ui/uk.ts tests/i18n/ui-pl-parity.test.ts
git commit -m "feat(pl): chrome překlad ui/pl.ts (806 klíčů) + lang.pl popisek"
```

---

## Task 3: LangSwitcher — přidej PL (CZ/SK/UA/PL)

**Files:**
- Modify: `src/components/LangSwitcher.astro`

- [ ] **Step 1: Přidej plHref + PL odkaz**

V `src/components/LangSwitcher.astro` přidej za `ukHref`:
```typescript
const plHref = langSwitchHref('pl', path, HIDDEN_NEWS_CATEGORIES.pl);
```
(`HIDDEN_NEWS_CATEGORIES.pl` přidá Task 4 — pokud Task 4 ještě neběžel, dočasně použij `[]` a vrať se; subagent-driven pořadí: Task 4 před 3, viz pořadí na konci.)

Do markupu přidej za uk blok:
```astro
  <span class="lang-sep" aria-hidden="true">/</span>
  <a href={plHref} class:list={["lang-opt", { active: locale === 'pl' }]} hreflang="pl"
     aria-current={locale === 'pl' ? 'true' : undefined}>{t(locale, 'lang.pl')}</a>
```

- [ ] **Step 2: Ověř build (typecheck projde)**

Run: `nvm use 22 && npx astro check 2>&1 | tail -5` (nebo `npm run build` později v Task 15)
Expected: žádná nová TS chyba z LangSwitcher.

- [ ] **Step 3: Commit**

```bash
git add src/components/LangSwitcher.astro
git commit -m "feat(pl): LangSwitcher CZ/SK/UA/PL"
```

---

## Task 4: nav.ts — HIDDEN_SECTIONS.pl, HIDDEN_NEWS_CATEGORIES.pl, generalizace tech-filtru

**Files:**
- Modify: `src/i18n/nav.ts`
- Test: `tests/i18n/pl-nav.test.ts` (nový)

- [ ] **Step 1: Napiš nav test (failing)**

Create `tests/i18n/pl-nav.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { getNav, getFooterColumns, HIDDEN_SECTIONS, HIDDEN_NEWS_CATEGORIES } from '../../src/i18n/nav';

describe('pl nav konfigurace', () => {
  it('HIDDEN_SECTIONS.pl skrývá bazar/photo/tema/animals/farms', () => {
    expect(HIDDEN_SECTIONS.pl).toEqual(['bazar', 'photo', 'tema', 'animals', 'farms']);
  });
  it('HIDDEN_NEWS_CATEGORIES.pl = dotace/legislativa', () => {
    expect(HIDDEN_NEWS_CATEGORIES.pl).toEqual(['dotace', 'legislativa']);
  });
  it('pl tech dropdown ukazuje JEN launchnuté děti (žádné cs dead-linky)', () => {
    const nav = getNav('pl');
    const tech = nav.find((i) => i.section === 'tech');
    const hrefs = (tech?.children ?? []).map((c) => c.href);
    // launchnuté: /stroje/*, /znacky/, /srovnani/, /slovnik/
    expect(hrefs).toContain('/znacky/');
    expect(hrefs).toContain('/srovnani/');
    expect(hrefs).toContain('/slovnik/');
    // NElaunchnuté nesmí být v pl tech dropdownu:
    expect(hrefs).not.toContain('/zebricky/');
    expect(hrefs).not.toContain('/kviz/');
    expect(hrefs).not.toContain('/prodejci/');
  });
});
```

- [ ] **Step 2: Spusť — ověř FAIL**

Run: `npx vitest run tests/i18n/pl-nav.test.ts`
Expected: FAIL (`HIDDEN_SECTIONS.pl` undefined → `.toEqual` selže; tech-filtr neaplikovaný na pl)

- [ ] **Step 3: Přidej pl klíče do HIDDEN_SECTIONS a HIDDEN_NEWS_CATEGORIES**

V `src/i18n/nav.ts`, do `HIDDEN_SECTIONS`:
```typescript
  // pl: stejně jako uk — jen sekce s reálným PL obsahem (tech: katalog+slovník).
  // data sekce zatím bez launchnutých dětí (statistiky/puda/dotace = pozdější fáze).
  pl: ['bazar', 'photo', 'tema', 'animals', 'farms'],
```
do `HIDDEN_NEWS_CATEGORIES`:
```typescript
  pl: ['dotace', 'legislativa'],
```

- [ ] **Step 4: Generalizuj tech launched-filtr na pl**

V `src/i18n/nav.ts` v `getNav`, řádek ~147, změň:
```typescript
          // uk+pl: launched-filtr na VŠECHNY viditelné sekce (tj. `tech`), ať
          // dropdown nedead-linkuje na cs. Scope-nuté na uk+pl → sk nav beze změny
          // (sk si cs-fallback děti záměrně ponechává).
          .filter((c) => (locale !== 'uk' && locale !== 'pl') || isLaunchedPath(locale, norm(c.href)))
```

- [ ] **Step 5: Spusť — ověř PASS** (Task 5 musí být hotový, aby `/slovnik` byl launchnutý — pokud běží před Task 5, dočasně očekávej jen /znacky//srovnani/; finální pořadí: Task 5 před 4. Viz pořadí na konci.)

Run: `npx vitest run tests/i18n/pl-nav.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/i18n/nav.ts tests/i18n/pl-nav.test.ts
git commit -m "feat(pl): HIDDEN_SECTIONS/NEWS_CATEGORIES.pl + tech launched-filtr na pl"
```

---

## Task 5: LAUNCHED_PREFIXES.pl + launch test

**Files:**
- Modify: `src/i18n/utils.ts` (LAUNCHED_PREFIXES, ~ř. 32-36)
- Test: `tests/i18n/pl-launch.test.ts` (nový)

- [ ] **Step 1: Napiš launch test (failing)**

Create `tests/i18n/pl-launch.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { LAUNCHED_PREFIXES, isLaunchedPath } from '../../src/i18n/utils';
import { isLockedSectionPath } from '../../src/i18n/nav';

describe('PL fáze 1 launch (stroje/znacky/srovnani/slovnik)', () => {
  const launched = ['/stroje', '/znacky', '/srovnani', '/slovnik'];
  it('4 sekce jsou launchnuté pro pl', () => {
    for (const p of launched) {
      expect(LAUNCHED_PREFIXES.pl).toContain(p);
      expect(isLaunchedPath('pl', p)).toBe(true);
      expect(isLaunchedPath('pl', `${p}/cokoli/`)).toBe(true);
    }
  });
  it('jurisdikční sekce NEjsou launchnuté pro pl', () => {
    for (const p of ['/statistiky', '/puda', '/dotace', '/novinky']) {
      expect(isLaunchedPath('pl', p)).toBe(false);
    }
  });
  it('cs nikdy nedostane gating-noindex', () => {
    expect(isLaunchedPath('cs', '/slovnik/adblue/')).toBe(false);
  });
  it('launchnuté nejsou locked', () => {
    for (const p of launched) expect(isLockedSectionPath(p)).toBe(false);
  });
});
```

- [ ] **Step 2: Spusť — ověř FAIL**

Run: `npx vitest run tests/i18n/pl-launch.test.ts`
Expected: FAIL (`LAUNCHED_PREFIXES.pl` undefined)

- [ ] **Step 3: Přidej LAUNCHED_PREFIXES.pl**

V `src/i18n/utils.ts` do `LAUNCHED_PREFIXES`:
```typescript
  pl: ['/stroje', '/znacky', '/srovnani', '/slovnik'],
```

- [ ] **Step 4: Spusť — ověř PASS**

Run: `npx vitest run tests/i18n/pl-launch.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/i18n/utils.ts tests/i18n/pl-launch.test.ts
git commit -m "feat(pl): LAUNCHED_PREFIXES.pl = stroje/znacky/srovnani/slovnik"
```

---

## Task 6: Generátor — `comparison-insights-shared.ts` (brandDescriptorAkuzativ pl)

**Files:**
- Modify: `src/lib/comparison-insights-shared.ts`

- [ ] **Step 1: Přidej `mapPl` a pl větev**

V `brandDescriptorAkuzativ` přidej za `mapUk` polskou mapu (native polština, akuzativ za „preferujesz"):
```typescript
  const mapPl: Record<string, string> = {
    fendt: 'niemiecką markę premium Fendt',
    'john-deere': 'amerykańskiego giganta John Deere',
    'case-ih': 'amerykańską markę Case IH (koncern CNH)',
    'new-holland': 'europejską markę New Holland (koncern CNH)',
    claas: 'niemieckiego lidera kombajnów Claas',
    'massey-ferguson': 'tradycyjną markę Massey Ferguson (koncern AGCO)',
    valtra: 'fińską markę Valtra (koncern AGCO)',
    'deutz-fahr': 'niemiecką markę Deutz-Fahr (koncern SDF)',
    kubota: 'japońską markę Kubota',
    zetor: 'czeską markę Zetor z Brna',
    bednar: 'czeską markę Bednar',
    amazone: 'niemiecką markę Amazone',
    krone: 'niemiecką markę Krone',
    vaderstad: 'szwedzką markę Väderstad',
    pottinger: 'austriacką markę Pöttinger',
    kverneland: 'norweską markę Kverneland',
    lemken: 'niemiecką markę Lemken',
    kuhn: 'francuską markę Kuhn',
  };
```
změň výběr mapy a fallback:
```typescript
  const map = locale === 'sk' ? mapSk : locale === 'uk' ? mapUk : locale === 'pl' ? mapPl : mapCs;
  return map[brand] ?? (locale === 'uk' ? `бренд ${brandName}` : locale === 'pl' ? `markę ${brandName}` : `značku ${brandName}`);
```

- [ ] **Step 2: Typecheck**

Run: `nvm use 22 && npx tsc --noEmit 2>&1 | grep comparison-insights-shared || echo "OK no errors"`
Expected: `OK no errors`

- [ ] **Step 3: Commit**

```bash
git add src/lib/comparison-insights-shared.ts
git commit -m "feat(pl): polské brand popisy v comparison-insights-shared"
```

---

## Task 7: Generátor — `comparison-insights.ts` (hp osa: farmSizeClause + main verdikt pl)

**Files:**
- Modify: `src/lib/comparison-insights.ts`

**Pozn.:** Soubor má 3 branch-sites (ř. ~29, ~79, ~81). Každý `locale === 'sk' ? sk : locale === 'uk' ? uk : cs` rozšiř na `... : locale === 'pl' ? pl : cs` a přidej native polskou frázovou proměnnou `pl` analogicky k `uk`. numLocale (ř. ~81) přidej `'pl-PL'`.

- [ ] **Step 1: Přidej pl varianty ke všem 3 branch-sites**

Pro každý blok, kde je definováno `const cs = ...; const sk = ...; const uk = ...;` přidej `const pl = ...;` (native polská fráze, vzorem uk varianta — správné polské pády/skladba). Pak změň ternár:
```typescript
    locale === 'sk' ? sk : locale === 'uk' ? uk : locale === 'pl' ? pl : cs;
```
Číselný formát (ř. ~81):
```typescript
    n.toLocaleString(locale === 'sk' ? 'sk-SK' : locale === 'uk' ? 'uk-UA' : locale === 'pl' ? 'pl-PL' : 'cs-CZ');
```

⚠️ Přečti CELÝ obsah `cs`/`uk` proměnných v každém bloku a napiš `pl` jako odpovídající native polský text (NE doslovný překlad cs). Zachovej interpolované `${...}` výrazy.

- [ ] **Step 2: Typecheck**

Run: `nvm use 22 && npx tsc --noEmit 2>&1 | grep comparison-insights.ts || echo "OK no errors"`
Expected: `OK no errors`

- [ ] **Step 3: Commit**

```bash
git add src/lib/comparison-insights.ts
git commit -m "feat(pl): polské srovnávací verdikty (hp osa traktory/kombajny)"
```

---

## Task 8: Generátor — `implement-comparison-insights.ts` (záběr osa nářadí: 4 sites + pl)

**Files:**
- Modify: `src/lib/implement-comparison-insights.ts`

**Pozn.:** 4 branch-sites: `zaberFarmClause` (ř. ~21), `zavesNoun` (ř. ~52), hlavní engine (ř. ~61), numLocale (ř. ~62). Plus akuzativ řádek ř. ~190-192 (už volá `brandDescriptorAkuzativ` z Task 6 — ten pl zvládne; jen ověř, že ternár u prefixu „preferuješ/орієнтуєшся" má pl variantu).

- [ ] **Step 1: Přidej pl varianty ke 4 branch-sites + akuzativ prefix**

V každém `const cs/sk/uk` bloku přidej `const pl` (native polština). Rozšiř ternáry o `: locale === 'pl' ? pl`. numLocale `'pl-PL'`. Na ř. ~190-192 (prefix fráze „preferuješ ${brandDescriptor...}") přidej pl variantu (polsky „preferujesz ${brandDescriptorAkuzativ(...)}").

- [ ] **Step 2: Typecheck**

Run: `nvm use 22 && npx tsc --noEmit 2>&1 | grep implement-comparison-insights || echo "OK no errors"`
Expected: `OK no errors`

- [ ] **Step 3: Commit**

```bash
git add src/lib/implement-comparison-insights.ts
git commit -m "feat(pl): polské srovnávací verdikty (záběr osa nářadí)"
```

---

## Task 9: Generátor — `faq-generator.ts` (L 4-arg helper + labelsPl + inflect pl)

**Files:**
- Modify: `src/lib/faq-generator.ts`

**Pozn.:** Nejtěžší generátor. `L(cs, sk, uk)` helper má 25 call-sites; rozšiř na `L(cs, sk, uk, pl)`. Plus `labelsPl` (typ závěsu), pl inflect (počet inzerátů — bazar se sice pro pl skryje, ale FAQ běží na strojových stránkách; pl plural je jako uk → reuse `ukPlural`-style helper přejmenuj/rozšiř), numLocale `'pl-PL'`.

- [ ] **Step 1: Rozšiř `L` helper na 4 argumenty**

```typescript
  const isPl = locale === 'pl';
  const L = (cs: string, sk: string, uk: string, pl: string): string => (isSk ? sk : isUk ? uk : isPl ? pl : cs);
```
numLocale (ř. ~38):
```typescript
    n.toLocaleString(isSk ? 'sk-SK' : isUk ? 'uk-UA' : isPl ? 'pl-PL' : 'cs-CZ');
```

- [ ] **Step 2: Doplň 4. argument (pl) do VŠECH 25 `L(...)` call-sites**

Každé volání `L(csText, skText, ukText)` → `L(csText, skText, ukText, plText)` s native polským textem. Projdi všechna volání (grep `L(` v souboru).

- [ ] **Step 3: Přidej `labelsPl` (typ závěsu) + pl inflect**

```typescript
    const labelsPl: Record<string, string> = {
      neseny: 'zawieszany (trzypunktowy układ zawieszenia)',
      tazeny: 'przyczepiany (za górny zaczep)',
      poloneseny: 'półzawieszany (kombinacja niesienia i ciągnięcia)',
      samojizdny: 'samojezdny (własny napęd)',
      navesny: 'półprzyczepiany',
    };
    const labels = isSk ? labelsSk : isUk ? labelsUk : isPl ? labelsPl : labelsCs;
```
Pro `inflect`/`what` bloky (ř. ~208-216) přidej `isPl` větev s polskou pluralizací (one/few/many jako uk):
```typescript
    const plPlural = (n: number): string => {
      const mod10 = n % 10, mod100 = n % 100;
      if (mod10 === 1 && mod100 !== 11) return 'ogłoszenie';
      if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'ogłoszenia';
      return 'ogłoszeń';
    };
    const inflect = isSk ? (/* sk beze změny */ bazarCount === 1 ? 'jeden inzerát' : bazarCount < 5 ? `${bazarCount} inzeráty` : `${bazarCount} inzerátov`)
      : isUk ? (bazarCount === 1 ? 'одне оголошення' : `${bazarCount} ${ukPlural(bazarCount)}`)
      : isPl ? (bazarCount === 1 ? 'jedno ogłoszenie' : `${bazarCount} ${plPlural(bazarCount)}`)
      : (bazarCount === 1 ? 'jeden inzerát' : bazarCount < 5 ? `${bazarCount} inzeráty` : `${bazarCount} inzerátů`);
```
a `what` blok obdobně s pl variantou (polsky „tego ciągnika / tego kombajnu / tej maszyny").

⚠️ Zachovej existující cs/sk/uk větve beze změny — jen přidej `isPl ?` před finální cs fallback.

- [ ] **Step 4: Typecheck**

Run: `nvm use 22 && npx tsc --noEmit 2>&1 | grep faq-generator || echo "OK no errors"`
Expected: `OK no errors`

- [ ] **Step 5: Commit**

```bash
git add src/lib/faq-generator.ts
git commit -m "feat(pl): polské FAQ generátor (L 4-arg + labelsPl + inflect)"
```

---

## Task 10: Generátor — `competitor-finder.ts` (pl varianta)

**Files:**
- Modify: `src/lib/competitor-finder.ts`

- [ ] **Step 1: Přidej pl variantu k branch-site (ř. ~136)**

V bloku `const cs/sk/uk` přidej `const pl` (native polština) a rozšiř ternár `: locale === 'pl' ? pl : cs`.

- [ ] **Step 2: Typecheck**

Run: `nvm use 22 && npx tsc --noEmit 2>&1 | grep competitor-finder || echo "OK no errors"`
Expected: `OK no errors`

- [ ] **Step 3: Commit**

```bash
git add src/lib/competitor-finder.ts
git commit -m "feat(pl): polská varianta v competitor-finder"
```

---

## Task 11: Slovník `slovnik.pl.ts` (306 hesel) + napojení + parity test

**Files:**
- Create: `src/lib/slovnik.pl.ts`
- Modify: `src/lib/slovnik.ts` (ř. ~38 import, ~9356-9359 maps)
- Test: `tests/lib/slovnik-pl.test.ts` (nový)

**Pozn.:** Velký překladový task → dedikovaný translator-subagent + PL review brána. Zdroj = CS pole `SLOVNIK` (~306 hesel) v `slovnik.ts` + extras. Vzor = `src/lib/slovnik.uk.ts`.

- [ ] **Step 1: Napiš parity test (failing) — mirror slovnik-uk.test.ts**

Create `tests/lib/slovnik-pl.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { SLOVNIK, getSlovnik, getKategorieLabels, KATEGORIE_LABELS } from '../../src/lib/slovnik';
import { SLOVNIK_PL, KATEGORIE_LABELS_PL } from '../../src/lib/slovnik.pl';

describe('slovnik pl accessor', () => {
  it('getSlovnik("pl") vrací PL pole', () => {
    expect(getSlovnik('pl')).toBe(SLOVNIK_PL);
  });
  it('getSlovnik("cs") beze změny', () => {
    expect(getSlovnik('cs')).toBe(SLOVNIK);
  });
  it('getKategorieLabels("pl") = KATEGORIE_LABELS_PL', () => {
    expect(getKategorieLabels('pl')).toBe(KATEGORIE_LABELS_PL);
  });
  it('KATEGORIE_LABELS_PL má všech 14 kategorií', () => {
    expect(Object.keys(KATEGORIE_LABELS_PL).sort()).toEqual(Object.keys(KATEGORIE_LABELS).sort());
  });
});

describe('slovnik PL key-parita', () => {
  it('PL má stejný počet hesel jako CS', () => {
    expect(SLOVNIK_PL.length).toBe(SLOVNIK.length);
  });
  it('PL slug množina = CS slug množina', () => {
    expect([...new Set(SLOVNIK_PL.map((t) => t.slug))].sort())
      .toEqual([...new Set(SLOVNIK.map((t) => t.slug))].sort());
  });
  it('PL slugy unikátní', () => {
    expect(new Set(SLOVNIK_PL.map((t) => t.slug)).size).toBe(SLOVNIK_PL.length);
  });
  it('PL related identické s CS (per slug)', () => {
    const csRel = new Map(SLOVNIK.map((t) => [t.slug, JSON.stringify(t.related ?? [])]));
    for (const t of SLOVNIK_PL) expect(JSON.stringify(t.related ?? [])).toBe(csRel.get(t.slug));
  });
  it('PL dangling related = CS dangling (žádné nové neexistující odkazy)', () => {
    const plSlugs = new Set(SLOVNIK_PL.map((t) => t.slug));
    const csSlugs = new Set(SLOVNIK.map((t) => t.slug));
    const dangling = (arr: { related?: string[] }[], slugs: Set<string>) =>
      new Set(arr.flatMap((t) => (t.related ?? []).filter((r) => !slugs.has(r))));
    expect([...dangling(SLOVNIK_PL, plSlugs)].sort()).toEqual([...dangling(SLOVNIK, csSlugs)].sort());
  });
  it('PL kategorie = CS kategorie (per slug)', () => {
    const csKat = new Map(SLOVNIK.map((t) => [t.slug, t.kategorie]));
    for (const t of SLOVNIK_PL) expect(t.kategorie).toBe(csKat.get(t.slug));
  });
});
```

- [ ] **Step 2: Spusť — ověř FAIL (modul neexistuje)**

Run: `npx vitest run tests/lib/slovnik-pl.test.ts`
Expected: FAIL — `Cannot find module './slovnik.pl'`

- [ ] **Step 3: Vytvoř `src/lib/slovnik.pl.ts`**

Vzor `src/lib/slovnik.uk.ts`:
```typescript
import type { SlovnikTerm, SlovnikKategorie } from './slovnik';

export const SLOVNIK_PL: SlovnikTerm[] = [
  { /* každé heslo: slug+kategorie+related+čísla IDENTICKÉ s CS; term/shortDef/longDef/alias/faq/zajimavosti přeložené do PL */ },
  // … 306 hesel
];

export const KATEGORIE_LABELS_PL: Record<SlovnikKategorie, string> = {
  // 14 kategorií, polské popisky
};
```
Pravidla:
- `slug`, `kategorie`, `related`, čísla = identické s CS (slugy se NEpřekládají)
- `term`, `shortDef`, `longDef`, `alias`, `faq`, `zajimavosti` = polský překlad
- `externalUrl` → `pl.wikipedia.org/wiki/...` kde polský článek existuje; kde ne, ponech cs/původní nebo vypusť (NE rozbitý odkaz)
- ⚠️ Pokud assembluješ TS skriptem: použij `str.replace` (literal), NE `re.sub` — regex interpretuje `\n` a rozbil by `\n\n` oddělovače odstavců v `longDef`

- [ ] **Step 4: Napoj do `slovnik.ts`**

Import (u ř. ~38):
```typescript
import { SLOVNIK_PL, KATEGORIE_LABELS_PL } from './slovnik.pl';
```
Maps (ř. ~9356-9359):
```typescript
const SLOVNIK_BY_LOCALE: Record<string, SlovnikTerm[]> = { cs: SLOVNIK, uk: SLOVNIK_UK, pl: SLOVNIK_PL };
const KATEGORIE_LABELS_BY_LOCALE: Record<string, Record<SlovnikKategorie, string>> = {
  cs: KATEGORIE_LABELS,
  uk: KATEGORIE_LABELS_UK,
  pl: KATEGORIE_LABELS_PL,
};
```

- [ ] **Step 5: Spusť — ověř PASS**

Run: `npx vitest run tests/lib/slovnik-pl.test.ts`
Expected: PASS

- [ ] **Step 6: PL review brána (subagent)**

Dispatch review subagent: zkontroluj kvalitu polského překladu (terminologie zem. techniky, gramatika, žádné zbylé čeština/ukrajinština, `pl.wikipedia.org` URL rozlišují). Oprav nálezy.

- [ ] **Step 7: Commit**

```bash
git add src/lib/slovnik.pl.ts src/lib/slovnik.ts tests/lib/slovnik-pl.test.ts
git commit -m "feat(pl): slovník slovnik.pl.ts (306 hesel) + napojení"
```

---

## Task 12: Sitemap — `plMirror` blok

**Files:**
- Modify: `src/pages/sitemap.xml.ts` (za ukMirror blok, ~ř. 466)

- [ ] **Step 1: Přidej plMirror blok**

Za `urls.push(...ukMirror);` (ř. ~466) přidej:
```typescript
  // PL launch (Fáze 1): zrcadli launchnuté sekce (stroje/znacky/srovnani/slovnik).
  // Žádné per-locale slug-divergence (na rozdíl od sk/uk dotace/howto) → prostý
  // filtr na launchnuté & nelocked, vyloučit už zrcadlené /sk/ a /uk/ URL.
  const plMirror: UrlEntry[] = urls
    .filter((u) => {
      const p = u.loc.slice(SITE_URL.length);
      if (p.startsWith('/sk/') || p.startsWith('/uk/')) return false;
      return isLaunchedPath('pl', p) && !isLockedSectionPath(p);
    })
    .map((u) => ({ ...u, loc: `${SITE_URL}/pl${u.loc.slice(SITE_URL.length)}` }));
  urls.push(...plMirror);
```

- [ ] **Step 2: Ověř lokálně (build potřebný; finální ověření v Task 15)**

Pozn.: sitemap se testuje až po buildu (Task 15). Typecheck:
Run: `nvm use 22 && npx tsc --noEmit 2>&1 | grep sitemap || echo "OK no errors"`
Expected: `OK no errors`

- [ ] **Step 3: Commit**

```bash
git add src/pages/sitemap.xml.ts
git commit -m "feat(pl): sitemap plMirror pro launchnuté PL sekce"
```

---

## Task 13: `/pl/` homepage noindex guard (isPl)

**Files:**
- Modify: `src/pages/index.astro`

**Pozn.:** `/pl/` homepage zatím nemá polský rozcestník (pozdější fáze) → musí být noindex a NEsmí renderovat cs supabase feed jako PL. Vzor = existující `isUk` guard.

- [ ] **Step 1: Najdi a rozšiř isUk guard**

Run: `grep -n "isUk\|locale === 'uk'\|noindex" src/pages/index.astro`
Pro každé místo, kde `isUk` přeskakuje cs feed / nastavuje noindex pro `/uk/` homepage, přidej obdobně `isPl` (`const isPl = locale === 'pl';`) se stejným chováním. `/pl/` homepage = noindex, bez cs supabase feedu.

- [ ] **Step 2: Typecheck**

Run: `nvm use 22 && npx tsc --noEmit 2>&1 | grep index.astro || echo "OK no errors"`
Expected: `OK no errors`

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(pl): /pl/ homepage noindex guard (jako uk před homepage fází)"
```

---

## Task 14: Auto-linker — ověření locale-aware chování pro pl

**Files:**
- (pravděpodobně žádná změna — `localizeInternalHref` je locale-generický)
- Test: `tests/i18n/pl-autolink.test.ts` (nový, ověřovací)

- [ ] **Step 1: Napiš ověřovací test**

Create `tests/i18n/pl-autolink.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { localizeInternalHref } from '../../src/i18n/utils';

describe('pl auto-linker / interní href lokalizace', () => {
  it('launchnutá sekce → /pl/ prefix', () => {
    expect(localizeInternalHref('pl', '/slovnik/adblue/')).toBe('/pl/slovnik/adblue/');
    expect(localizeInternalHref('pl', '/znacky/fendt/')).toBe('/pl/znacky/fendt/');
    expect(localizeInternalHref('pl', '/srovnani/')).toBe('/pl/srovnani/');
  });
  it('NElaunchnutá sekce → cs href beze změny (žádný 302/leak)', () => {
    expect(localizeInternalHref('pl', '/statistiky/')).toBe('/statistiky/');
    expect(localizeInternalHref('pl', '/novinky/')).toBe('/novinky/');
    expect(localizeInternalHref('pl', '/dotace/')).toBe('/dotace/');
  });
  it('cs no-op', () => {
    expect(localizeInternalHref('cs', '/slovnik/adblue/')).toBe('/slovnik/adblue/');
  });
});
```

- [ ] **Step 2: Spusť — ověř PASS (žádná impl. změna nutná)**

Run: `npx vitest run tests/i18n/pl-autolink.test.ts`
Expected: PASS. Pokud FAIL → `localizeInternalHref` má někde natvrdo cs/sk/uk; oprav na generické přes `isLaunchedPath(locale, ...)`.

- [ ] **Step 3: Commit**

```bash
git add tests/i18n/pl-autolink.test.ts
git commit -m "test(pl): auto-linker locale-aware chování pro pl"
```

---

## Task 15: Finální verifikační brána

**Files:** žádné nové; ověření.

- [ ] **Step 1: Plný test suite**

Run: `npx vitest run 2>&1 | tail -20`
Expected: vše zelené KROMĚ baseline STALE (~5: cs nav „7 top-level/bazar", utils uk). Nové pl testy zelené.

- [ ] **Step 2: Build**

Run: `nvm use 22 && npm run build 2>&1 | tail -20`
Expected: EXIT 0. ⚠️ `git checkout src/generated/content-dates.json` pokud build změnil (NEcommitovat).

- [ ] **Step 3: Spusť preview a ověř PL stránky**

Run:
```bash
set -a; . ./.env 2>/dev/null; set +a
nvm use 22 && npm run preview &
sleep 4
for u in /pl/stroje/ /pl/znacky/ /pl/srovnani/ /pl/slovnik/ /pl/slovnik/adblue/; do
  echo "=== $u ==="; curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:4321$u"
done
```
Expected: každá 200. `/pl/slovnik/adblue/` HTML obsahuje polský text (grep `curl -s http://localhost:4321/pl/slovnik/adblue/ | grep -i "AdBlue"`), `<html lang="pl"`, self-canonical `/pl/slovnik/adblue/`, hreflang cs/sk/uk/pl/x-default.

- [ ] **Step 4: Leak check — žádná čeština na launchnutých PL stránkách**

Run:
```bash
curl -s "http://localhost:4321/pl/srovnani/<reálné-combo>/" | grep -iE "preferuješ|značku|kombajn |traktoru" && echo "LEAK!" || echo "OK no cs leak"
```
(Reálné combo zjisti z `/srovnani/` listingu.) Expected: `OK no cs leak`. Verdikty/FAQ polsky.

- [ ] **Step 5: Negative gates**

Run:
```bash
curl -s -o /dev/null -w "stat %{http_code}\n" "http://localhost:4321/pl/statistiky/"   # → 307 redirect na /statistiky/
curl -s -o /dev/null -w "404 %{http_code}\n" "http://localhost:4321/pl/slovnik/neexistuje-heslo/"  # → 404
```
Expected: `/pl/statistiky/` 307; neexistující heslo 404.

- [ ] **Step 6: cs/sk/uk regrese smoke**

Run:
```bash
for u in /stroje/ /slovnik/adblue/ /sk/stroje/ /uk/slovnik/adblue/; do
  echo "=== $u ==="; curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:4321$u"
done
```
Expected: vše 200, cs/sk/uk obsah beze změny.

- [ ] **Step 7: Sitemap obsahuje /pl launchnuté URL**

Run: `curl -s http://localhost:4321/sitemap.xml | grep -c "/pl/slovnik/"`
Expected: > 0. `/pl/` homepage (noindex) NENÍ v sitemapě.

- [ ] **Step 8: Finální opus review (subagent)**

Dispatch finální review subagent přes spec — APPROVE/CHANGES. Oprav nálezy.

---

## Self-Review (autor plánu)

- **Spec coverage:** registr locale (T1) ✓; chrome pl.ts (T2) ✓; generátory 5 souborů (T6-T10) ✓; slovník (T11) ✓; launch+nav (T4,T5) ✓; LangSwitcher (T3) ✓; sitemap mirror (T12) ✓; auto-linker (T14) ✓; nav tech-filtr generalizace (T4) ✓; /pl/ homepage noindex (T13) ✓; verifikace (T15) ✓. Jurisdikční sekce „mimo rozsah" = žádný task (správně, dědí cs redirect přes existující middleware).
- **Pořadí pro subagent-driven:** T1 → T5 (LAUNCHED před nav/langswitch testy) → T2 → T4 → T3 → T6 → T7 → T8 → T9 → T10 → T11 → T12 → T13 → T14 → T15. (T5 před T4, protože pl-nav test očekává `/slovnik/` launchnutý; T4 pozn. krok 5.)
- **Type consistency:** `SLOVNIK_PL`/`KATEGORIE_LABELS_PL` (T11) konzistentní v testu i wiringu; `L(cs,sk,uk,pl)` 4-arg (T9) aplikováno na všech 25 call-sites; `mapPl` (T6) použité v T8 přes `brandDescriptorAkuzativ`. ✓
- **Placeholdery:** překladový obsah (806 chrome klíčů, 306 hesel, generátorové native fráze) je autorská práce translator-subagentů — plán dává přesnou strukturu, cesty, vzory (uk varianta), worked examples a parity/leak brány. To je repo-konvence (tak vznikly sk/uk), ne placeholder.
