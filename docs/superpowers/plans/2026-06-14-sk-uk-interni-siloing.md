# SK/UK interní siloing — implementační plán

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aby každá SK/UK launchnutá stránka odkazovala na lokalizované (`/sk`,`/uk`) verze launchnutých sekcí místo cs, čímž se zasilují dnes osiřelé SK/UK detaily.

**Architecture:** Jeden sdílený gating helper `localizeInternalHref(locale, href)` (extrahovaný z dnešního `navHref`), uniformně aplikovaný na (a) hardcoded interní hrefy v launchnutých SSR šablonách a (b) interní entries auto-linkeru. Lokalizuje jen launchnuté sekce reálně renderované pod locale; pro cs no-op → cs výstup byte-identický; žádné 302.

**Tech Stack:** Astro 6 (`output: 'server'`), TypeScript, Vitest, i18n přes `src/i18n/utils.ts`.

**Worktree:** `~/agro-svet/.worktrees/i18n-internal-siloing`, větev `feat/i18n-internal-siloing` (z `master` `1f45c58`). Spec: `docs/superpowers/specs/2026-06-14-sk-uk-interni-siloing-design.md`.

**Klíčová fakta z auditu (ověřeno):**
- `localizeInternalHref(cs, x) === x` (no-op) → cs render se nemění.
- Cíle všech hub-odkazů jsou SSR-launchnuté (renderují pod `/sk`): `/stroje/`, `/stroje/traktory/`, `/stroje/kombajny/`, `/stroje/{brand}/`, `/novinky/`, `/puda/`, `/statistiky/`, `/znacky/`, `/dotace/*`, `/kalkulacka/*`, `/srovnani/`, `/encyklopedie/`. Žádný z nich není prerendered → žádné 302.
- Prerendered (302 pod `/sk`, mimo scope): `stroje/[subcategory]`, `stroje/zemedelske-stroje/[group]`, `stroje/[brand]/rada/.../[family]`. Sweep na ně neodkazuje.
- Auto-linker jediný 302-risk = `FUNCTIONAL_GROUPS` → `/stroje/zemedelske-stroje/{group}/` (prerendered). Proto auto-linker lokalizuje **jen brand + model entries** (flag `localizable`), které jsou SSR; vše ostatní zůstává cs.

---

### Task 1: Extrahovat `localizeInternalHref`, `navHref` jako alias

**Files:**
- Modify: `src/i18n/utils.ts:54-64`
- Test: `tests/i18n/utils.test.ts`

- [ ] **Step 1: Napsat failing test**

Přidej na konec `tests/i18n/utils.test.ts`:

```ts
import { localizeInternalHref } from '../../src/i18n/utils';

describe('localizeInternalHref', () => {
  it('cs = no-op (byte-identické)', () => {
    expect(localizeInternalHref('cs', '/stroje/fendt/')).toBe('/stroje/fendt/');
    expect(localizeInternalHref('cs', '/')).toBe('/');
  });
  it('sk: launchnutá sekce → /sk prefix', () => {
    expect(localizeInternalHref('sk', '/stroje/traktory/')).toBe('/sk/stroje/traktory/');
    expect(localizeInternalHref('sk', '/dotace/')).toBe('/sk/dotace/');
    expect(localizeInternalHref('sk', '/')).toBe('/sk/');
  });
  it('sk: NElaunchnutá sekce → cs beze změny (žádné 302)', () => {
    expect(localizeInternalHref('sk', '/plemena/skot/')).toBe('/plemena/skot/');
    expect(localizeInternalHref('sk', '/zebricky/nej-traktory/')).toBe('/zebricky/nej-traktory/');
  });
  it('uk: launchnutá → /uk; nelaunchnutá (novinky není uk) → cs', () => {
    expect(localizeInternalHref('uk', '/stroje/')).toBe('/uk/stroje/');
    expect(localizeInternalHref('uk', '/novinky/')).toBe('/novinky/');
  });
  it('non-path vstup se nerozbije', () => {
    expect(localizeInternalHref('sk', '#sekce')).toBe('#sekce');
    expect(localizeInternalHref('sk', 'https://x.cz/stroje/')).toBe('https://x.cz/stroje/');
  });
  it('navHref je identický alias', () => {
    expect(navHref('sk', '/stroje/')).toBe(localizeInternalHref('sk', '/stroje/'));
    expect(navHref('uk', '/novinky/')).toBe(localizeInternalHref('uk', '/novinky/'));
  });
});
```

- [ ] **Step 2: Spustit test → FAIL**

Run: `cd ~/agro-svet/.worktrees/i18n-internal-siloing && npx vitest run tests/i18n/utils.test.ts`
Expected: FAIL — `localizeInternalHref` is not exported.

- [ ] **Step 3: Implementovat**

V `src/i18n/utils.ts` nahraď stávající `navHref` (ř. 54-64) tímto (jméno `localizeInternalHref` + alias):

```ts
/** Lokalizuje interní href pro daný locale POUZE u launchnutých (reálně
 *  renderovaných) sekcí; jinak vrací cs href beze změny. Pro cs no-op.
 *  Sdílené: nav/footer + huby/listingy + auto-linker. */
export function localizeInternalHref(locale: Locale, href: string): string {
  if (locale === defaultLocale) return href;
  const root = href.replace(/\/+$/, '') || '/';
  if (root === '/') return localizePath(locale, href);
  if (isLaunchedPath(locale, root) && !SK_PRERENDERED_NAV_PATHS.includes(root)) return localizePath(locale, href);
  return href;
}

/** Zpětně kompatibilní alias (volá ho Layout/nav/footer). */
export const navHref = localizeInternalHref;
```

- [ ] **Step 4: Spustit test → PASS**

Run: `npx vitest run tests/i18n/utils.test.ts tests/i18n/nav.test.ts`
Expected: PASS (vč. existujících navHref testů — chování beze změny).

- [ ] **Step 5: Commit**

```bash
git add src/i18n/utils.ts tests/i18n/utils.test.ts
git commit -m "feat(i18n): extract localizeInternalHref, navHref alias"
```

---

### Task 2: Auto-linker locale-aware (localizable flag + normalizace excludeUrl)

**Files:**
- Modify: `src/lib/auto-linker.ts`
- Test: `tests/lib/auto-linker.test.ts` (create)

- [ ] **Step 1: Napsat failing test**

Create `tests/lib/auto-linker.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { injectLinks, createLinkContext } from '../../src/lib/auto-linker';
import { getAllBrands } from '../../src/lib/stroje';

const brand = getAllBrands().find((b) => b.slug === 'fendt') ?? getAllBrands()[0];
const html = `<p>Traktor ${brand.name} je oblíbený.</p>`;

describe('auto-linker locale', () => {
  it('sk: brand entry → /sk/stroje/<slug>/', () => {
    const out = injectLinks(html, undefined, 'sk');
    expect(out).toContain(`href="/sk/stroje/${brand.slug}/"`);
    expect(out).toContain('class="auto-link"');
  });

  it('cs default je byte-identické s explicitním cs', () => {
    expect(injectLinks(html, undefined, 'cs')).toBe(injectLinks(html, undefined));
    expect(injectLinks(html, undefined)).toContain(`href="/stroje/${brand.slug}/"`);
  });

  it('createLinkContext normalizuje locale-prefixovaný excludeUrl → self-exclusion funguje pod sk', () => {
    const out = injectLinks(html, `/sk/stroje/${brand.slug}/`, 'sk');
    expect(out).not.toContain('class="auto-link"');
  });

  it('createLinkContext normalizuje plný URL excludeUrl', () => {
    const out = injectLinks(html, `https://agro-svet.cz/stroje/${brand.slug}/`, 'cs');
    expect(out).not.toContain('class="auto-link"');
  });
});
```

- [ ] **Step 2: Spustit test → FAIL**

Run: `npx vitest run tests/lib/auto-linker.test.ts`
Expected: FAIL — `injectLinks` ignoruje 3. argument / self-exclusion nenormalizuje.

- [ ] **Step 3: Implementovat — import + typy**

V `src/lib/auto-linker.ts` přidej k importům (za ř. 11):

```ts
import { localizeInternalHref, stripLocale } from '../i18n/utils';
import { defaultLocale, type Locale } from '../i18n/config';
```

Do interface `GlossaryEntry` (za `external?` ř. 23) přidej:

```ts
  /** Interní odkaz lokalizovatelný do /sk|/uk (jen brand+model — SSR launchnuté). */
  localizable?: boolean;
```

- [ ] **Step 4: Implementovat — makeEntry + brand/model flag**

Nahraď `makeEntry` (ř. 44-53):

```ts
function makeEntry(term: string, url: string, priority: number, external = false, localizable = false): GlossaryEntry {
  return {
    term,
    termLower: term.toLowerCase(),
    pattern: new RegExp(`(?<![\\p{L}\\p{N}_])(${escapeRegex(term)})(?![\\p{L}\\p{N}_])`, 'iu'),
    url,
    priority,
    external,
    localizable,
  };
}
```

Brand entry (ř. 59) → přidej `true`:

```ts
    entries.push(makeEntry(b.name, `/stroje/${b.slug}/`, 10, false, true));
```

Model entry (ř. 67) → přidej `true`:

```ts
    entries.push(makeEntry(m.name, `/stroje/${m.brand_slug}/${m.series_slug}/${m.slug}/`, 12, false, true));
```

(Druhy, plemena, FUNCTIONAL_GROUPS, slovník, tier-lists, remote zůstávají bez flag = `localizable` undefined/false.)

- [ ] **Step 5: Implementovat — normalizace excludeUrl**

Nahraď `createLinkContext` (ř. 244-248):

```ts
/** Normalizuje URL (plný i lokalizovaný) na cs-root path, aby self-exclusion
 *  klíč odpovídal cs-root glossary URL bez ohledu na to, co caller předá. */
function normalizeToCsRoot(url: string): string {
  let path = url;
  const scheme = path.indexOf('://');
  if (scheme !== -1) {
    const slash = path.indexOf('/', scheme + 3);
    path = slash === -1 ? '/' : path.slice(slash);
  }
  return stripLocale(path).path;
}

/** Shared state used to dedupe links across multiple injectLinks() calls (e.g. perex + body). */
export function createLinkContext(excludeUrl?: string): Set<string> {
  const used = new Set<string>();
  if (excludeUrl) used.add(normalizeToCsRoot(excludeUrl));
  return used;
}
```

- [ ] **Step 6: Implementovat — locale param + render**

Nahraď `tryInject` signaturu a render-řádek. Hlavička (ř. 202):

```ts
function tryInject(text: string, glossary: GlossaryEntry[], used: Set<string>, locale: Locale): string {
```

Render uvnitř (ř. 219-223) nahraď:

```ts
      const href = entry.localizable ? localizeInternalHref(locale, entry.url) : entry.url;
      const attrs = entry.external
        ? ` class="auto-link auto-link-external" target="_blank" rel="noopener"`
        : ` class="auto-link"`;
      s = `${before}<a href="${href}"${attrs}>${matched}</a>${after}`;
      used.add(entry.url);
```

Nahraď `injectLinksInText` (ř. 256-259):

```ts
export function injectLinksInText(text: string, excludeUrlOrUsed?: string | Set<string>, locale: Locale = defaultLocale): string {
  if (!text) return text;
  return injectLinks(escapeHtml(text), excludeUrlOrUsed, locale);
}
```

Nahraď `injectLinks` hlavičku (ř. 261) a volání `tryInject` (ř. 282):

```ts
export function injectLinks(html: string, excludeUrlOrUsed?: string | Set<string>, locale: Locale = defaultLocale): string {
```

a uvnitř smyčky:

```ts
      } else if (tok.type === 'text' && protectedDepth === 0) {
        out.push(tryInject(tok.value, glossary, used, locale));
```

- [ ] **Step 7: Spustit test → PASS**

Run: `npx vitest run tests/lib/auto-linker.test.ts`
Expected: PASS (4 testy).

- [ ] **Step 8: Commit**

```bash
git add src/lib/auto-linker.ts tests/lib/auto-linker.test.ts
git commit -m "feat(auto-linker): locale-aware interní odkazy (brand+model), normalizace excludeUrl"
```

---

### Task 3: `renderMarkdownWithLinks` přijme locale

**Files:**
- Modify: `src/lib/markdown-with-links.ts:68-73`
- Test: `tests/lib/markdown-with-links.test.ts` (create)

- [ ] **Step 1: Napsat failing test**

Create `tests/lib/markdown-with-links.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { renderMarkdownWithLinks } from '../../src/lib/markdown-with-links';
import { getAllBrands } from '../../src/lib/stroje';

const brand = getAllBrands().find((b) => b.slug === 'fendt') ?? getAllBrands()[0];

describe('renderMarkdownWithLinks locale', () => {
  it('sk: brand odkaz → /sk/stroje/<slug>/', async () => {
    const out = await renderMarkdownWithLinks(`Traktor ${brand.name} je dobrý.`, undefined, 'sk');
    expect(out).toContain(`href="/sk/stroje/${brand.slug}/"`);
  });
  it('cs default → cs odkaz', async () => {
    const out = await renderMarkdownWithLinks(`Traktor ${brand.name} je dobrý.`);
    expect(out).toContain(`href="/stroje/${brand.slug}/"`);
  });
});
```

- [ ] **Step 2: Spustit test → FAIL**

Run: `npx vitest run tests/lib/markdown-with-links.test.ts`
Expected: FAIL — 3. argument ignorován (sk → cs odkaz).

- [ ] **Step 3: Implementovat**

V `src/lib/markdown-with-links.ts` přidej import (za ř. 29):

```ts
import { defaultLocale, type Locale } from '../i18n/config';
```

Nahraď `renderMarkdownWithLinks` (ř. 68-73):

```ts
export async function renderMarkdownWithLinks(markdown: string, excludeUrl?: string, locale: Locale = defaultLocale): Promise<string> {
  const file = await processor.process(markdown);
  const html = String(file);
  const linkCtx = createLinkContext(excludeUrl);
  return injectLinks(html, linkCtx, locale);
}
```

- [ ] **Step 4: Spustit test → PASS**

Run: `npx vitest run tests/lib/markdown-with-links.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/markdown-with-links.ts tests/lib/markdown-with-links.test.ts
git commit -m "feat(markdown-with-links): prosadit locale do auto-linkeru"
```

---

### Task 4: Call-sites auto-linkeru předají locale

**Files:**
- Modify: `src/pages/puda/[slug].astro:21`
- Modify: `src/pages/dotace/[slug].astro:30`
- Modify: `src/pages/jak-na-to/[slug].astro:25`
- Modify: `src/pages/encyklopedie/[slug].astro:32`
- Modify: `src/pages/novinky/[slug].astro:274,277`

(`slovnik/[slug].astro` je `prerender = true` → cs-only render → default cs je správně, NEMĚNIT.)

- [ ] **Step 1: puda/[slug] — předat locale**

`src/pages/puda/[slug].astro:21` — `locale` je v scope (ř. 12). Nahraď:

```astro
const contentHtml = await renderMarkdownWithLinks(item.body ?? '', `${base}/puda/${slug}/`, locale);
```

- [ ] **Step 2: dotace/[slug] — předat locale**

`src/pages/dotace/[slug].astro:30` — `locale` v scope (ř. 15). Nahraď:

```astro
const contentHtml = await renderMarkdownWithLinks(titul.body ?? '', `${base}/dotace/${d.slug}/`, locale);
```

- [ ] **Step 3: jak-na-to/[slug] — předat locale**

`src/pages/jak-na-to/[slug].astro:25` — `locale` v scope (ř. 12). Nahraď:

```astro
const contentHtml = await renderMarkdownWithLinks(item.body ?? '', `${base}/jak-na-to/${slug}/`, locale);
```

- [ ] **Step 4: encyklopedie/[slug] — předat locale**

`src/pages/encyklopedie/[slug].astro:32` — `locale` v scope (ř. 13). Nahraď:

```astro
const contentHtml = await renderMarkdownWithLinks(item.body ?? '', `${base}/encyklopedie/${slug}/`, locale);
```

- [ ] **Step 5: novinky/[slug] — předat locale do obou volání**

`src/pages/novinky/[slug].astro` — `locale` v scope (ř. 55). Nahraď ř. 274:

```astro
    <p id="article-lead" style="font-size:18px; color:#555; line-height:1.6; margin-bottom:40px; border-bottom:1px solid #ebebeb; padding-bottom:32px;" set:html={injectLinksInText(article.perex, linkCtx, locale)} />
```

a ř. 277:

```astro
    <div class="prose" set:html={injectLinks(article.content, linkCtx, locale)} />
```

- [ ] **Step 6: Ověřit typecheck**

Run: `npx astro check 2>&1 | tail -20`
Expected: žádná nová chyba v upravených souborech.

- [ ] **Step 7: Commit**

```bash
git add src/pages/puda/\[slug\].astro src/pages/dotace/\[slug\].astro src/pages/jak-na-to/\[slug\].astro src/pages/encyklopedie/\[slug\].astro src/pages/novinky/\[slug\].astro
git commit -m "feat(content): auto-linker call-sites předají locale (sk/uk odkazy v tělech)"
```

---

### Task 5: Hub sweep — stroje cluster

**Files:**
- Modify: `src/pages/stroje/index.astro` (import ř. 7; hrefy 131,134,144,147)
- Modify: `src/pages/stroje/[brand]/index.astro` (import ř. 8; href 306)
- Modify: `src/pages/stroje/zemedelske-stroje/index.astro` (import ř. 6; hrefy 94,208)
- Modify: `src/components/stroje/CategoryBrowse.astro` (import ř. 3; href 242)
- Modify: `src/components/statistiky/BottomCTA.astro` (import ř. 3; href 14)

Transform: `href="/X/"` → `href={localizeInternalHref(locale, '/X/')}`.

- [ ] **Step 1: stroje/index.astro**

Import (ř. 7) — přidej `localizeInternalHref`:

```astro
import { useTranslations, plural, tf, getLocaleFromUrl, localizePath, localizeInternalHref } from '../../i18n/utils';
```

Hrefy:
- ř. 131: `href="/stroje/traktory/"` → `href={localizeInternalHref(locale, '/stroje/traktory/')}`
- ř. 134: `href="/stroje/kombajny/"` → `href={localizeInternalHref(locale, '/stroje/kombajny/')}`
- ř. 144: `href="/stroje/traktory/"` → `href={localizeInternalHref(locale, '/stroje/traktory/')}`
- ř. 147: `href="/stroje/kombajny/"` → `href={localizeInternalHref(locale, '/stroje/kombajny/')}`

(`href="/bazar/novy/"` a `href="/bazar/"` na ř. 254/256 NEMĚNIT — bazar záměrně cs.)

- [ ] **Step 2: stroje/[brand]/index.astro**

Import (ř. 8) — přidej `localizeInternalHref`:

```astro
import { useTranslations, plural, tf, getLocaleFromUrl, localizePath, localizeInternalHref } from '../../../i18n/utils';
```

ř. 306: `<a href="/stroje/">` → `<a href={localizeInternalHref(locale, '/stroje/')}>`

- [ ] **Step 3: stroje/zemedelske-stroje/index.astro**

Import (ř. 6) — přidej `localizeInternalHref`:

```astro
import { useTranslations, localizeInternalHref } from '../../../i18n/utils';
```

ř. 94: `<a href="/stroje/">` → `<a href={localizeInternalHref(locale, '/stroje/')}>`
ř. 208: `<a href="/stroje/">` → `<a href={localizeInternalHref(locale, '/stroje/')}>`

- [ ] **Step 4: CategoryBrowse.astro**

Import (ř. 3) — přidej `localizeInternalHref`:

```astro
import { useTranslations, plural, tf, getLocaleFromUrl, localizeInternalHref } from '../../i18n/utils';
```

ř. 242: `<a href="/stroje/">` → `<a href={localizeInternalHref(locale, '/stroje/')}>`

- [ ] **Step 5: statistiky/BottomCTA.astro**

Import (ř. 3) — přidej `localizeInternalHref`:

```astro
import { useTranslations, localizeInternalHref } from '../../i18n/utils';
```

ř. 14: `<a class="cta-btn" href="/stroje/">` → `<a class="cta-btn" href={localizeInternalHref(locale, '/stroje/')}>`

- [ ] **Step 6: Ověřit typecheck + build**

Run: `npx astro check 2>&1 | tail -20`
Expected: žádná nová chyba.

- [ ] **Step 7: Commit**

```bash
git add src/pages/stroje/index.astro src/pages/stroje/\[brand\]/index.astro src/pages/stroje/zemedelske-stroje/index.astro src/components/stroje/CategoryBrowse.astro src/components/statistiky/BottomCTA.astro
git commit -m "feat(stroje): lokalizovat interní hub odkazy přes localizeInternalHref"
```

---

### Task 6: Hub sweep — dotace, kalkulačka, srovnání, encyklopedie, značky

**Files:**
- Modify: `src/pages/dotace/index.astro` (nový import; href 57)
- Modify: `src/pages/dotace/jak-vybrat/index.astro` (nový import; hrefy 39,95,96)
- Modify: `src/pages/dotace/kalendar-kol/index.astro` (nový import; href 75)
- Modify: `src/pages/kalkulacka/prevody-jednotek/index.astro` (nový import; hrefy 184,185)
- Modify: `src/pages/kalkulacka/prevody-hmotnost/index.astro` (nový import; hrefy 150,155)
- Modify: `src/pages/srovnani/[combo]/index.astro` (import ř. 28; href 154)
- Modify: `src/pages/encyklopedie/index.astro` (import ř. 11; href 72)
- Modify: `src/pages/znacky/[slug].astro` (import ř. 8; hrefy 146,318)

- [ ] **Step 1: dotace/index.astro**

`locale` v scope (ř. 14), ale chybí i18n import. Přidej za ř. 11 (`import { content } from '../../i18n/dotace';`):

```astro
import { localizeInternalHref } from '../../i18n/utils';
```

ř. 57: `<a href="/dotace/jak-vybrat/">` → `<a href={localizeInternalHref(locale, '/dotace/jak-vybrat/')}>`

- [ ] **Step 2: dotace/jak-vybrat/index.astro**

Přidej za ř. 6 (`import { content } from '../../../i18n/dotace';`):

```astro
import { localizeInternalHref } from '../../../i18n/utils';
```

- ř. 39: `<a href="/dotace/">` → `<a href={localizeInternalHref(locale, '/dotace/')}>`
- ř. 95: `<a class="ib-btn primary" href="/dotace/">` → `<a class="ib-btn primary" href={localizeInternalHref(locale, '/dotace/')}>`
- ř. 96: `<a class="ib-btn ghost" href="/dotace/kalendar-kol/">` → `<a class="ib-btn ghost" href={localizeInternalHref(locale, '/dotace/kalendar-kol/')}>`

- [ ] **Step 3: dotace/kalendar-kol/index.astro**

Přidej za ř. 8 (`import { content } from '../../../i18n/dotace';`):

```astro
import { localizeInternalHref } from '../../../i18n/utils';
```

ř. 75: `<a class="ib-btn primary" href="/dotace/jak-vybrat/">` → `<a class="ib-btn primary" href={localizeInternalHref(locale, '/dotace/jak-vybrat/')}>`

- [ ] **Step 4: kalkulacka/prevody-jednotek/index.astro**

Přidej za ř. 10 (`import { crumbs } from '../../../i18n/kalkulacka/common';`):

```astro
import { localizeInternalHref } from '../../../i18n/utils';
```

- ř. 184: `<a href="/kalkulacka/naklady-na-hektar/">` → `<a href={localizeInternalHref(locale, '/kalkulacka/naklady-na-hektar/')}>`
- ř. 185: `<a href="/kalkulacka/dotace-cap/">` → `<a href={localizeInternalHref(locale, '/kalkulacka/dotace-cap/')}>`

- [ ] **Step 5: kalkulacka/prevody-hmotnost/index.astro**

Přidej za ř. 10 (`import { crumbs } from '../../../i18n/kalkulacka/common';`):

```astro
import { localizeInternalHref } from '../../../i18n/utils';
```

- ř. 150: `<a href="/kalkulacka/prevody-jednotek/">` → `<a href={localizeInternalHref(locale, '/kalkulacka/prevody-jednotek/')}>`
- ř. 155: `<a href="/kalkulacka/naklady-na-hektar/">` → `<a href={localizeInternalHref(locale, '/kalkulacka/naklady-na-hektar/')}>`

- [ ] **Step 6: srovnani/[combo]/index.astro**

Import (ř. 28) — přidej `localizeInternalHref`:

```astro
import { useTranslations, tf, getLocaleFromUrl, localizePath, localizeInternalHref } from '../../../i18n/utils';
```

ř. 154: `<a href="/srovnani/">` → `<a href={localizeInternalHref(locale, '/srovnani/')}>`

- [ ] **Step 7: encyklopedie/index.astro**

Import (ř. 11) — přidej `localizeInternalHref`:

```astro
import { useTranslations, getLocaleFromUrl, localizePath, tf, localizeInternalHref } from '../../i18n/utils';
```

ř. 72 (odkaz uvnitř textu): `<a href="/stroje/" style="color:#2d7a3e; font-weight:600; text-decoration:none;">katalogu strojů</a>` → nahraď `href="/stroje/"` za `href={localizeInternalHref(locale, '/stroje/')}` (zbytek atributů beze změny).

- [ ] **Step 8: znacky/[slug].astro**

Import (ř. 8) — přidej `localizeInternalHref`:

```astro
import { useTranslations, tf, getLocaleFromUrl, localizePath, localizeInternalHref } from '../../i18n/utils';
```

- ř. 146: `<a href="/znacky/" style="color:#666; text-decoration:none;">` → `<a href={localizeInternalHref(locale, '/znacky/')} style="color:#666; text-decoration:none;">`
- ř. 318: `<a href="/znacky/" style="display:inline-flex; ...">` → nahraď `href="/znacky/"` za `href={localizeInternalHref(locale, '/znacky/')}` (zbytek atributů beze změny).

- [ ] **Step 9: Ověřit typecheck**

Run: `npx astro check 2>&1 | tail -20`
Expected: žádná nová chyba.

- [ ] **Step 10: Commit**

```bash
git add src/pages/dotace src/pages/kalkulacka/prevody-jednotek/index.astro src/pages/kalkulacka/prevody-hmotnost/index.astro src/pages/srovnani/\[combo\]/index.astro src/pages/encyklopedie/index.astro src/pages/znacky/\[slug\].astro
git commit -m "feat(huby): lokalizovat dotace/kalkulačka/srovnání/encyklopedie/značky odkazy"
```

---

### Task 7: Hub sweep — home + komponenty bez locale

**Files:**
- Modify: `src/pages/index.astro` (přidat locale; hrefy 96,166,177)
- Modify: `src/components/home/LatestArticles.astro` (přidat locale; href 24)
- Modify: `src/components/calc/DotaceCapCz.astro` (přidat locale; hrefy 15,115,116)

- [ ] **Step 1: index.astro — přidat locale + import**

Po importech ve frontmatteru (za ř. 8, např. před první `const`) přidej:

```astro
import { getLocaleFromUrl, localizeInternalHref } from '../i18n/utils';
const locale = Astro.locals.locale ?? getLocaleFromUrl(Astro.url);
```

Hrefy:
- ř. 96: `<a href="/novinky/" class="hero-tag">Novinky</a>` → `<a href={localizeInternalHref(locale, '/novinky/')} class="hero-tag">Novinky</a>`
- ř. 166: `<a href="/puda/" class="link-cta">Zobrazit celou sekci →</a>` → `<a href={localizeInternalHref(locale, '/puda/')} class="link-cta">Zobrazit celou sekci →</a>`
- ř. 177: `<a href="/statistiky/" class="link-cta">Zobrazit celou sekci →</a>` → `<a href={localizeInternalHref(locale, '/statistiky/')} class="link-cta">Zobrazit celou sekci →</a>`

- [ ] **Step 2: LatestArticles.astro — přidat locale + import**

Ve frontmatteru (za ř. 4) přidej:

```astro
import { getLocaleFromUrl, localizeInternalHref } from '../../i18n/utils';
const locale = Astro.locals.locale ?? getLocaleFromUrl(Astro.url);
```

ř. 24: `<a href="/novinky/" class="link-cta">Všechny novinky →</a>` → `<a href={localizeInternalHref(locale, '/novinky/')} class="link-cta">Všechny novinky →</a>`

- [ ] **Step 3: DotaceCapCz.astro — přidat locale + import**

Ve frontmatteru (za ř. 2) přidej:

```astro
import { getLocaleFromUrl, localizeInternalHref } from '../../i18n/utils';
const locale = Astro.locals.locale ?? getLocaleFromUrl(Astro.url);
```

Hrefy:
- ř. 15: `<a href="/kalkulacka/">Kalkulačky</a>` → `<a href={localizeInternalHref(locale, '/kalkulacka/')}>Kalkulačky</a>`
- ř. 115: `<a href="/dotace/" class="cta-link">Přehled dotací z PRV →</a>` → `<a href={localizeInternalHref(locale, '/dotace/')} class="cta-link">Přehled dotací z PRV →</a>`
- ř. 116: `<a href="/dotace/kalendar-kol/" class="cta-link">Kalendář kol →</a>` → `<a href={localizeInternalHref(locale, '/dotace/kalendar-kol/')} class="cta-link">Kalendář kol →</a>`

- [ ] **Step 4: Ověřit typecheck**

Run: `npx astro check 2>&1 | tail -20`
Expected: žádná nová chyba.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro src/components/home/LatestArticles.astro src/components/calc/DotaceCapCz.astro
git commit -m "feat(home): lokalizovat domovské + komponentové interní odkazy"
```

---

### Task 8: Finální verifikace

**Files:** žádné (jen kontroly)

- [ ] **Step 1: Acceptance grep — žádný hardcoded launched cs href v scope souborech**

Run:

```bash
cd ~/agro-svet/.worktrees/i18n-internal-siloing
grep -rnE 'href="/(stroje|znacky|srovnani|novinky|kalkulacka|dotace|statistiky|puda|encyklopedie|jak-na-to)' \
  src/pages/index.astro src/pages/stroje/index.astro 'src/pages/stroje/[brand]/index.astro' \
  src/pages/stroje/zemedelske-stroje/index.astro 'src/pages/srovnani/[combo]/index.astro' \
  src/pages/encyklopedie/index.astro src/pages/dotace/index.astro src/pages/dotace/jak-vybrat/index.astro \
  src/pages/dotace/kalendar-kol/index.astro 'src/pages/znacky/[slug].astro' \
  src/pages/kalkulacka/prevody-jednotek/index.astro src/pages/kalkulacka/prevody-hmotnost/index.astro \
  src/components/stroje/CategoryBrowse.astro src/components/home/LatestArticles.astro \
  src/components/statistiky/BottomCTA.astro src/components/calc/DotaceCapCz.astro
```

Expected: **prázdný výstup** (vše převedeno na `localizeInternalHref`). Pozn.: `href="/bazar/..."` v stroje/index je OK (mimo grep).

- [ ] **Step 2: Plný test suite**

Run: `npx vitest run`
Expected: PASS. Baseline 3 bazar-nav fails jsou OK (pre-existing).

- [ ] **Step 3: Typecheck**

Run: `npx astro check 2>&1 | tail -5`
Expected: 0 nových errorů.

- [ ] **Step 4: Build**

Run: `npm run build 2>&1 | tail -15`
Expected: build zelený (`Complete!` / 0 chyb).

- [ ] **Step 5: cs byte-identita (sanity)**

cs invariant je zaručen konstrukcí: `localizeInternalHref('cs', x) === x` (Task 1 test) a `injectLinks(html, ex, 'cs') === injectLinks(html, ex)` (Task 2 test). Potvrď, že oba testy prošly v kroku 2.

- [ ] **Step 6: Závěrečný commit (pokud něco zbylo) — jinak hotovo**

```bash
git status --short
```

Expected: čistý strom (vše commitnuté po taskách).

---

## Po dokončení (mimo plán, dělá orchestrátor/user)

- **Code review** (requesting-code-review) → **finishing-a-development-branch** (merge/PR do `master`).
- **Coolify auto-deploy** po merge.
- **Živý smoke:** `/sk/stroje/traktory/`, `/sk/stroje/`, `/sk/encyklopedie/` → odkazy vedou na `/sk/...`; SK článek (`/sk/novinky/<slug>/` nebo `/sk/encyklopedie/<slug>/`) → auto-linky v těle `/sk/...`; spot-check `/uk/stroje/`.

## Akceptační kritéria (z spec)

1. ✅ Žádná SK/UK-launchnutá stránka neobsahuje hardcoded cs odkaz na launchnutou sekci (Task 8 krok 1).
2. ✅ Auto-linker v SK/UK tělech generuje `/sk`/`/uk` odkazy pro brand+model (Task 2/3 testy + živý smoke).
3. ✅ cs výstup byte-identický (Task 1 + Task 2 testy).
4. ✅ Žádný odkaz nevede na 302→cs (cíle ověřeny SSR; auto-linker jen brand+model SSR; gate drží nelaunchnuté na cs).
5. ✅ Build + testy zelené (Task 8).
