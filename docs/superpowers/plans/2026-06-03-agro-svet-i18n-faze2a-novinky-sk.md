# Fáze 2a — SK novinky (article translations) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve native-Slovak versions of the 23 published `novinky` articles under `/sk/novinky/…` (article body + listing + category + tag pages + cards), reading translations from a new Supabase `article_translations` table, with the Czech output byte-identical and the `/sk/novinky` search-index launch gated behind a one-line flip.

**Architecture:** Translations live in a new Supabase table `article_translations` (PK `(article_id, locale)`), populated by a new `do_novinky()` subcommand in `scripts/i18n-translate.py` (reuses the existing 2-phase sonnet-draft→opus-editor pipeline). The novinky Astro pages already read `articles` from Supabase via `createAnonClient()`; we add a small pure overlay layer (`src/lib/articles-i18n.ts`) that, **only when `Astro.locals.locale !== 'cs'`**, fetches the matching translations and overlays them field-by-field (cs fallback per field). All hardcoded Czech chrome strings, category labels, date locales and internal `/novinky/…` links are routed through the existing i18n helpers (`t`/`tf`/`localizePath`) with cs values kept verbatim → cs HTML unchanged. A `LangSwitcher` component is added to the header (this is an intentional, user-requested cs change — the only accepted cs diff).

**Tech Stack:** Astro 6 (`output:'server'`, CF Worker), `@supabase/supabase-js` (anon read / service write), Python 3 + Vercel AI Gateway (translation), Vitest (unit tests), Node 22 build.

**Hard rules (carried from Fáze 1):**
- CZ output byte-identical EXCEPT the header `LangSwitcher` (intentional, user-requested) — verify via build-diff of `dist/` novinky pages where they are prerendered, and `astro dev` for SSR pages.
- agro-svet Supabase (`obhypfuzmknvmknskdwh`) is OUT of MCP/CLI reach → the table migration MUST be applied by the user in Studio SQL editor. The script + pages can be written and type-checked without it, but `do_novinky` end-to-end and live SK content require the table to exist.
- `/sk/novinky` stays `noindex` (NOT added to `SK_LAUNCHED_PREFIXES`) until the backfill is done and the user approves the launch flip (final task, left unchecked).
- Foreign WIP `public/og/howto-*.png` must stay UNCOMMITTED. Exactly one commit per task; `git show --stat HEAD` after each.

---

## File Structure

- **Create** `scripts/sql/article_translations.sql` — the DDL + RLS (record-of-truth; user pastes into Studio).
- **Modify** `scripts/i18n-translate.py` — add `do_novinky()` + Supabase REST read/upsert helpers + `novinky` subcommand.
- **Create** `src/lib/articles-i18n.ts` — pure overlay helpers (`overlayArticle`, `buildTranslationMap`) + a fetch helper (`fetchArticleTranslations`).
- **Create** `tests/lib/articles-i18n.test.ts` — unit tests for the pure helpers.
- **Modify** `src/i18n/ui/cs.ts` + `src/i18n/ui/sk.ts` — add `nov.*` keys (cs verbatim current strings, sk native).
- **Create** `src/components/LangSwitcher.astro` — CZ/SK header switcher.
- **Modify** `src/components/Header.astro` — mount `LangSwitcher`.
- **Modify** `src/components/ArticleCard.astro` — locale-aware href + date + category label.
- **Modify** `src/pages/novinky/[slug].astro` — locale-aware fetch+overlay+links+date+category+canonical+inLanguage.
- **Modify** `src/pages/novinky/index.astro` — locale-aware overlay + chrome.
- **Modify** `src/pages/novinky/kategorie/[kat]/index.astro` — convert to SSR (`prerender=false`) + locale-aware.
- **Modify** `src/pages/novinky/tema/[tag]/index.astro` — locale-aware.
- **Modify (FINAL, gated)** `src/i18n/utils.ts` — add `/novinky` to `SK_LAUNCHED_PREFIXES` (launch flip; left unchecked).

---

## Task 1: Supabase `article_translations` table (DDL record + Studio apply)

**Files:**
- Create: `scripts/sql/article_translations.sql`

- [ ] **Step 1: Write the DDL file**

```sql
-- scripts/sql/article_translations.sql
-- Per-locale translations of public.articles. PK (article_id, locale).
-- Slug REUSES the cs slug (URL is /sk/novinky/<cs-slug>/) — column kept for
-- a future localized-slug option. Written by scripts/i18n-translate.py with the
-- service-role key (bypasses RLS); read by the site with the anon key.
create table if not exists public.article_translations (
  article_id       uuid not null references public.articles(id) on delete cascade,
  locale           text not null check (locale in ('sk','uk')),
  title            text,
  perex            text,
  content          text,
  seo_title        text,
  seo_description  text,
  slug             text,
  status           text not null default 'published',
  translated_at    timestamptz not null default now(),
  primary key (article_id, locale)
);

create index if not exists idx_article_translations_locale
  on public.article_translations (locale, status);

alter table public.article_translations enable row level security;

-- Anonymous read of published translations (mirrors the articles anon-read policy).
drop policy if exists "anon read published article_translations" on public.article_translations;
create policy "anon read published article_translations"
  on public.article_translations for select
  using (status = 'published');
```

- [ ] **Step 2: Commit the DDL file**

```bash
git add scripts/sql/article_translations.sql
git commit -m "feat(i18n): article_translations DDL for SK novinky"
```

- [ ] **Step 3: Hand the SQL to the user to apply in Studio**

This is a manual, out-of-band action (agro-svet Supabase is out of MCP/CLI reach). Surface the SQL and the Studio URL `https://supabase.com/dashboard/project/obhypfuzmknvmknskdwh/sql/new` to the user. Do NOT block subsequent code tasks on it, but flag that `do_novinky` (Task 3) and live SK content cannot be verified until it is applied.

---

## Task 2: Pure overlay helpers + tests (`src/lib/articles-i18n.ts`)

**Files:**
- Create: `src/lib/articles-i18n.ts`
- Test: `tests/lib/articles-i18n.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/lib/articles-i18n.test.ts
import { describe, it, expect } from 'vitest';
import { overlayArticle, buildTranslationMap } from '../../src/lib/articles-i18n';

describe('overlayArticle', () => {
  const cs = {
    id: 'a1', title: 'CZ titul', perex: 'CZ perex', content: '<p>CZ</p>',
    seo_title: 'CZ seo', seo_description: 'CZ seo d', slug: 'cz-slug',
  };

  it('returns the cs row unchanged when translation is null', () => {
    expect(overlayArticle(cs, null)).toEqual(cs);
  });

  it('overlays translated fields and falls back per-field on empty/missing', () => {
    const tr = { title: 'SK titul', perex: '', content: '<p>SK</p>', seo_title: null };
    const out = overlayArticle(cs, tr as any);
    expect(out.title).toBe('SK titul');        // translated wins
    expect(out.perex).toBe('CZ perex');         // empty string falls back
    expect(out.content).toBe('<p>SK</p>');      // translated wins
    expect(out.seo_title).toBe('CZ seo');       // null falls back
    expect(out.slug).toBe('cz-slug');           // slug always cs (not overlaid)
    expect(out.id).toBe('a1');                   // identity preserved
  });
});

describe('buildTranslationMap', () => {
  it('keys rows by article_id', () => {
    const rows = [
      { article_id: 'a1', title: 'X' },
      { article_id: 'a2', title: 'Y' },
    ];
    const m = buildTranslationMap(rows as any);
    expect(m.get('a1')?.title).toBe('X');
    expect(m.get('a2')?.title).toBe('Y');
    expect(m.get('a3')).toBeUndefined();
  });

  it('returns an empty map for null/empty input', () => {
    expect(buildTranslationMap(null).size).toBe(0);
    expect(buildTranslationMap([]).size).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/lib/articles-i18n.test.ts`
Expected: FAIL ("Cannot find module '../../src/lib/articles-i18n'").

- [ ] **Step 3: Write the implementation**

```ts
// src/lib/articles-i18n.ts
// Per-locale overlay of Supabase `articles` rows with `article_translations`.
// PURE helpers (no I/O) are unit-tested; the fetch helper wraps a Supabase call.

/** Translatable display fields overlaid onto a cs article. slug/id/structural
 *  fields are NEVER overlaid — the URL reuses the cs slug. */
export interface ArticleTranslation {
  article_id?: string;
  title?: string | null;
  perex?: string | null;
  content?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
}

const OVERLAY_FIELDS = ['title', 'perex', 'content', 'seo_title', 'seo_description'] as const;

/** Merge a translation onto a cs row. Per-field fallback: a translated value
 *  wins only when it is a non-empty string; otherwise the cs value is kept.
 *  Returns a NEW object; the cs row is never mutated. Null translation → cs row
 *  returned unchanged (same reference is fine — callers treat it read-only). */
export function overlayArticle<T extends Record<string, any>>(
  cs: T,
  tr: ArticleTranslation | null | undefined,
): T {
  if (!tr) return cs;
  const out: Record<string, any> = { ...cs };
  for (const f of OVERLAY_FIELDS) {
    const v = (tr as any)[f];
    if (typeof v === 'string' && v.trim() !== '') out[f] = v;
  }
  return out as T;
}

/** Index translation rows by article_id for O(1) listing overlays. */
export function buildTranslationMap(
  rows: Array<ArticleTranslation & { article_id: string }> | null | undefined,
): Map<string, ArticleTranslation> {
  const m = new Map<string, ArticleTranslation>();
  for (const r of rows ?? []) if (r?.article_id) m.set(r.article_id, r);
  return m;
}

/** Fetch published translations for the given article ids + locale.
 *  `supabase` is a createAnonClient() instance. Returns [] on cs or empty ids. */
export async function fetchArticleTranslations(
  supabase: { from: (t: string) => any },
  ids: string[],
  locale: string,
): Promise<Array<ArticleTranslation & { article_id: string }>> {
  if (locale === 'cs' || ids.length === 0) return [];
  const { data } = await supabase
    .from('article_translations')
    .select('article_id, title, perex, content, seo_title, seo_description')
    .eq('locale', locale)
    .eq('status', 'published')
    .in('article_id', ids);
  return data ?? [];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/lib/articles-i18n.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/articles-i18n.ts tests/lib/articles-i18n.test.ts
git commit -m "feat(i18n): pure article translation overlay helpers + tests"
```

---

## Task 3: `do_novinky()` translation subcommand

**Files:**
- Modify: `scripts/i18n-translate.py` (add Supabase REST helpers + `do_novinky`, extend `__main__`)

- [ ] **Step 1: Add a Supabase config loader near `load_key()` (after line 29)**

```python
def load_supabase():
    """(url, service_key) from env or ~/agro-svet/.env."""
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_KEY")
    if url and key:
        return url, key
    envp = os.path.expanduser("~/agro-svet/.env")
    if os.path.exists(envp):
        for line in open(envp):
            if line.startswith("SUPABASE_URL=") and not url:
                url = line.split("=", 1)[1].strip()
            elif line.startswith("SUPABASE_SERVICE_KEY=") and not key:
                key = line.split("=", 1)[1].strip()
    if not (url and key):
        sys.exit("SUPABASE_URL / SUPABASE_SERVICE_KEY not found")
    return url, key

AGRO_SVET_SITE_ID = "cadc73fd-6bd9-4dc5-a0da-ea33725762e1"

def _supa(method, path, key, body=None, extra_headers=None):
    url, _ = (path if path.startswith("http") else None), None
    raise RuntimeError("placeholder")  # replaced in Step 2
```

(The `_supa` stub is replaced in Step 2 — written separately to keep the diff reviewable.)

- [ ] **Step 2: Replace the `_supa` stub with the real REST helper + `do_novinky`**

```python
def _supa_request(base, key, method, rel, body=None, extra_headers=None):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(base.rstrip("/") + rel, data=data, method=method,
        headers={"apikey": key, "Authorization": f"Bearer {key}",
                 "Content-Type": "application/json", **(extra_headers or {})})
    with urllib.request.urlopen(req, timeout=120) as r:
        raw = r.read()
        return json.loads(raw) if raw else None

# ---------- novinky ----------
def do_novinky(arg):
    """arg: a slug, or 'all'. Translates articles -> upserts article_translations (locale=sk)."""
    base, key = load_supabase()
    sel = ("/rest/v1/articles?select=id,slug,title,perex,content,seo_title,seo_description"
           f"&site_id=eq.{AGRO_SVET_SITE_ID}&status=eq.published")
    if arg != "all":
        sel += f"&slug=eq.{arg}"
    sel += "&order=published_at.desc"
    rows = _supa_request(base, key, "GET", sel) or []
    if not rows:
        sys.exit(f"no published article(s) for {arg!r}")
    for i, a in enumerate(rows, 1):
        print(f"[{i}/{len(rows)}] {a['slug']}")
        kv = {}
        for f in ("title", "perex", "seo_title", "seo_description"):
            if a.get(f):
                kv[f] = a[f].strip()
        sk_kv = translate_kv(f"polia článku '{a.get('title')}'", kv)
        sk_content = translate_body(a["content"]) if a.get("content") else None
        payload = {
            "article_id": a["id"], "locale": "sk", "slug": a["slug"],
            "status": "published",
            "title": sk_kv.get("title"), "perex": sk_kv.get("perex"),
            "seo_title": sk_kv.get("seo_title"), "seo_description": sk_kv.get("seo_description"),
            "content": sk_content,
        }
        _supa_request(base, key, "POST", "/rest/v1/article_translations",
                      body=payload,
                      extra_headers={"Prefer": "resolution=merge-duplicates,return=minimal"})
        print(f"  upserted sk translation for {a['slug']}")
    print(f"DONE — {len(rows)} article(s)")
```

Delete the `_supa` placeholder stub from Step 1 (keep `load_supabase` + `AGRO_SVET_SITE_ID`).

- [ ] **Step 3: Extend the `__main__` dispatch (end of file)**

```python
    elif cmd == "novinky":
        do_novinky(sys.argv[2])
    else:
        sys.exit("usage: i18n-translate.py {stroje|znacky|novinky} <slug|all>")
```

(Replace the existing final `else:` line accordingly; keep `stroje`/`znacky` branches.)

- [ ] **Step 4: Syntax-check the script**

Run: `python3 -c "import ast; ast.parse(open('scripts/i18n-translate.py').read()); print('OK')"`
Expected: `OK`

- [ ] **Step 5: Commit**

```bash
git add scripts/i18n-translate.py
git commit -m "feat(i18n): do_novinky() — translate articles into article_translations"
```

> NOTE: A live run (`python3 scripts/i18n-translate.py novinky <slug>`) is deferred to the backfill task (Task 11) — it requires Task 1's table to exist in Studio.

---

## Task 4: `nov.*` UI keys (cs verbatim + sk)

**Files:**
- Modify: `src/i18n/ui/cs.ts` (append before the closing `};`)
- Modify: `src/i18n/ui/sk.ts` (append at the matching place)

- [ ] **Step 1: Append the cs keys (verbatim current strings)**

```ts
  // — novinky —
  'nov.section': 'Novinky',
  'nov.title.default': 'Zemědělství v pohybu',
  'nov.lead': 'Sledujeme nové stroje, dotační programy, trhy i legislativní změny. Vše, co potřebujete vědět jako zemědělec.',
  'nov.desc.default': 'Aktuální zprávy ze světa zemědělské techniky — nové stroje, dotace, trh a legislativa.',
  'nov.back': '← Zpět na novinky',
  'nov.breadcrumb': 'Novinky',
  'nov.byline': 'Napsala',
  'nov.editorial': 'redakce agro-svět.cz',
  'nov.updated': 'Aktualizováno',
  'nov.tags': 'Tagy:',
  'nov.related': 'Další články k tématu',
  'nov.prev': '← Předchozí',
  'nov.next': 'Další →',
  'nov.filters': 'Rozšířené filtry',
  'nov.filters.active': 'aktivní',
  'nov.search.placeholder': 'Hledat v názvech a perexech…',
  'nov.search.submit': 'Hledat',
  'nov.from': 'Od',
  'nov.to': 'Do',
  'nov.reset': 'Vymazat vše',
  'nov.topics': 'Témata',
  'nov.all': 'Vše',
  'nov.empty': 'Žádné články neodpovídají filtrům.',
  'nov.emptyReset': 'Vymazat filtry',
  // category labels
  'nov.cat.technika': 'Technika',
  'nov.cat.dotace': 'Dotace',
  'nov.cat.trh': 'Trh',
  'nov.cat.legislativa': 'Legislativa',
  'nov.cat.znacky': 'Značky',
  'nov.cat.novinky': 'Novinky',
  // language switcher
  'lang.switch': 'Jazyk',
  'lang.cs': 'CZ',
  'lang.sk': 'SK',
```

- [ ] **Step 2: Append the matching sk keys**

```ts
  // — novinky —
  'nov.section': 'Novinky',
  'nov.title.default': 'Poľnohospodárstvo v pohybe',
  'nov.lead': 'Sledujeme nové stroje, dotačné programy, trhy aj legislatívne zmeny. Všetko, čo potrebujete vedieť ako poľnohospodár.',
  'nov.desc.default': 'Aktuálne správy zo sveta poľnohospodárskej techniky — nové stroje, dotácie, trh a legislatíva.',
  'nov.back': '← Späť na novinky',
  'nov.breadcrumb': 'Novinky',
  'nov.byline': 'Napísala',
  'nov.editorial': 'redakcia agro-svět.cz',
  'nov.updated': 'Aktualizované',
  'nov.tags': 'Štítky:',
  'nov.related': 'Ďalšie články k téme',
  'nov.prev': '← Predchádzajúci',
  'nov.next': 'Ďalší →',
  'nov.filters': 'Rozšírené filtre',
  'nov.filters.active': 'aktívne',
  'nov.search.placeholder': 'Hľadať v názvoch a perexoch…',
  'nov.search.submit': 'Hľadať',
  'nov.from': 'Od',
  'nov.to': 'Do',
  'nov.reset': 'Vymazať všetko',
  'nov.topics': 'Témy',
  'nov.all': 'Všetko',
  'nov.empty': 'Žiadne články nezodpovedajú filtrom.',
  'nov.emptyReset': 'Vymazať filtre',
  'nov.cat.technika': 'Technika',
  'nov.cat.dotace': 'Dotácie',
  'nov.cat.trh': 'Trh',
  'nov.cat.legislativa': 'Legislatíva',
  'nov.cat.znacky': 'Značky',
  'nov.cat.novinky': 'Novinky',
  'lang.switch': 'Jazyk',
  'lang.cs': 'CZ',
  'lang.sk': 'SK',
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/i18n/ui/cs.ts src/i18n/ui/sk.ts
git commit -m "feat(i18n): nov.* + lang.* UI keys (cs verbatim, sk native)"
```

---

## Task 5: `LangSwitcher` component + Header mount

**Files:**
- Create: `src/components/LangSwitcher.astro`
- Modify: `src/components/Header.astro`

- [ ] **Step 1: Write the switcher**

```astro
---
// src/components/LangSwitcher.astro
// CZ/SK header switcher. Builds the localized equivalent of the current
// cs-root path via stripLocale + localizePath. uk added in Fáze 3.
import { stripLocale, localizePath, t } from '../i18n/utils';
import { defaultLocale } from '../i18n/config';

const localizedPathname = Astro.locals.localizedPathname ?? Astro.url.pathname;
const { locale, path } = stripLocale(localizedPathname);
const csHref = localizePath('cs', path);
const skHref = localizePath('sk', path);
---
<div class="lang-switch" role="group" aria-label={t(locale, 'lang.switch')}>
  <a href={csHref} class:list={["lang-opt", { active: locale === 'cs' }]} hreflang="cs"
     aria-current={locale === 'cs' ? 'true' : undefined}>{t(locale, 'lang.cs')}</a>
  <span class="lang-sep" aria-hidden="true">/</span>
  <a href={skHref} class:list={["lang-opt", { active: locale === 'sk' }]} hreflang="sk"
     aria-current={locale === 'sk' ? 'true' : undefined}>{t(locale, 'lang.sk')}</a>
</div>
<style>
  .lang-switch { display: inline-flex; align-items: center; gap: 4px; font-family: 'Chakra Petch', sans-serif; font-size: 12px; }
  .lang-opt { color: #6B6B72; text-decoration: none; padding: 2px 5px; border-radius: 5px; transition: color .15s, background .15s; }
  .lang-opt:hover { color: #0A0A0B; background: #FFFF00; }
  .lang-opt.active { color: #0A0A0B; font-weight: 700; }
  .lang-sep { color: #c0c0c5; }
</style>
```

- [ ] **Step 2: Mount it in the header**

Open `src/components/Header.astro`, add the import at the top of the frontmatter:

```astro
import LangSwitcher from './LangSwitcher.astro';
```

Then place `<LangSwitcher />` in the header's top-right utility area (next to the existing nav actions / hamburger). Find the top-bar action cluster and add `<LangSwitcher />` as the first child so it renders on both desktop and mobile.

- [ ] **Step 3: Dev-verify both locales render the switcher**

Run: `npx astro dev` (background), then:
`curl -s localhost:4321/ | grep -c 'lang-switch'` → expect `1`
`curl -s localhost:4321/sk/stroje/ | grep -o 'aria-current="true">SK' | head -1` → expect the SK option active on /sk.
Stop dev.

- [ ] **Step 4: Commit**

```bash
git add src/components/LangSwitcher.astro src/components/Header.astro
git commit -m "feat(i18n): CZ/SK language switcher in header"
```

> NOTE: This intentionally changes the cs header on every page (user-requested). It is the single accepted cs byte diff for Fáze 2a.

---

## Task 6: `ArticleCard` — locale-aware href + date + category

**Files:**
- Modify: `src/components/ArticleCard.astro`

- [ ] **Step 1: Add a `locale` prop and route href/date/label through it**

Replace the frontmatter (lines 1–31) with:

```astro
---
import { categoryStyle } from '../lib/tag-color';
import { imgSrcset } from '../lib/image-variants';
import { localizePath, t } from '../i18n/utils';
import type { Locale } from '../i18n/config';

interface Props {
  title: string;
  description: string;
  slug: string;
  publishDate: Date;
  category: string;
  heroImage?: string;
  focalPoint?: { x: number; y: number } | null;
  locale?: Locale;
}

const { title, description, slug, publishDate, category, heroImage, focalPoint, locale = 'cs' } = Astro.props;
const focalCss = `${focalPoint?.x ?? 50}% ${focalPoint?.y ?? 50}%`;
const heroVariants = imgSrcset(heroImage, '(max-width: 600px) 100vw, 400px');

const dateLocale = locale === 'sk' ? 'sk-SK' : locale === 'uk' ? 'uk-UA' : 'cs-CZ';
const date = new Intl.DateTimeFormat(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' }).format(publishDate);
const catLabel = t(locale, `nov.cat.${category}`);
const articleHref = localizePath(locale, `/novinky/${slug}/`);
const categoryHref = localizePath(locale, `/novinky/kategorie/${category}/`);
---
```

- [ ] **Step 2: Update the markup to use the new vars**

In the markup body of `ArticleCard.astro`:
- `href={`/novinky/${slug}/`}` → `href={articleHref}`
- `href={`/novinky/kategorie/${category}/`}` → `href={categoryHref}`
- `title={`Všechny články v kategorii ${categoryLabels[category] ?? category}`}` → `title={catLabel}`
- both `{categoryLabels[category] ?? category}` occurrences → `{catLabel}`

(Delete the now-unused local `categoryLabels` object.)

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no new errors. (`locale` defaults to `'cs'` so all existing call sites stay valid and byte-identical.)

- [ ] **Step 4: Commit**

```bash
git add src/components/ArticleCard.astro
git commit -m "feat(i18n): ArticleCard locale-aware href/date/category (cs default unchanged)"
```

---

## Task 7: `novinky/[slug].astro` — translated article

**Files:**
- Modify: `src/pages/novinky/[slug].astro`

- [ ] **Step 1: Read locale, overlay the article + pool, localize derived strings**

After the existing `const article = articleRes.data;` / 404 guard and the pool computation, insert the locale+overlay logic. Concretely:

1. Add imports at the top:
```astro
import { fetchArticleTranslations, overlayArticle, buildTranslationMap } from '../../lib/articles-i18n';
import { localizePath, t } from '../../i18n/utils';
```
2. Right after `const supabase = createAnonClient();` add:
```astro
const locale = Astro.locals.locale ?? 'cs';
```
3. After `const pool = (...).slice(0, 80);` add a single batched translation fetch covering the article + pool, then overlay:
```astro
let articleL = article;
let poolL = pool;
if (locale !== 'cs') {
  const ids = [article.id, ...pool.map((p) => p.id)];
  const trMap = buildTranslationMap(await fetchArticleTranslations(supabase, ids, locale));
  articleL = overlayArticle(article, trMap.get(article.id));
  poolL = pool.map((p) => overlayArticle(p, trMap.get(p.id)));
}
```
4. Replace EVERY later use of `article` with `articleL` and `pool`/`related`/`prevArticle`/`nextArticle`/`entityRelated` derivations to read from `poolL` (recompute `related`, `prevArticle`, `nextArticle`, `entityRelated` from `poolL` instead of `pool`; recompute `articleTags`, `articleText`, JSON-LD, `<Layout>` props, and template from `articleL`). Mechanically: change `const pool =` consumers to use `poolL`, and rename the template's `article.` reads to `articleL.`.

> Implementation note for the executor: the simplest non-invasive edit is to assign back — after computing `articleL`/`poolL`, do `const A = articleL; const P = poolL;` and use `A`/`P` from the related-computation downward, OR (cleaner) shadow by computing `related`/neighbors from `poolL` and referencing `articleL` in the template. Keep cs path identical: when `locale==='cs'`, `articleL===article` and `poolL===pool` (same refs), so output is byte-identical.

- [ ] **Step 2: Localize the hardcoded chrome + links + date locale + inLanguage**

- `date` formatter: `new Intl.DateTimeFormat(locale === 'sk' ? 'sk-SK' : 'cs-CZ', …)` (both the published + updated formatters).
- `categoryLabels[...]` reads → `t(locale, 'nov.cat.' + cat)`.
- Internal links: wrap with `localizePath(locale, …)`:
  - breadcrumb `/novinky/`, back link `/novinky/`, prev/next `/novinky/${slug}/`, tag links `/novinky/tema/${tag}/`, related `/novinky/${slug}/`, `topEntity.url` stays (it points to /stroje|/plemena — localize too: `localizePath(locale, topEntity.url)`).
- Visible strings: breadcrumb "Novinky" → `t(locale,'nov.breadcrumb')`; byline "Napsala/redakce…" → `t(locale,'nov.byline')` + `t(locale,'nov.editorial')`; "Aktualizováno" → `t(locale,'nov.updated')`; "Tagy:" → `t(locale,'nov.tags')`; "Další články k tématu" → `t(locale,'nov.related')`; prev/next labels → `t(locale,'nov.prev')`/`t(locale,'nov.next')`; "← Zpět na novinky" → `t(locale,'nov.back')`.
- `canonical`: `https://agro-svet.cz${localizePath(locale, '/novinky/' + articleL.slug + '/')}`.
- JSON-LD `inLanguage`: `locale === 'sk' ? 'sk-SK' : 'cs-CZ'`; breadcrumb item URLs + `mainEntityOfPage`/`url` use the localized canonical; breadcrumb "Novinky"/"Domů" names via `t`.

> cs guarantee: every `t('cs', …)` returns the verbatim Czech string from Task 4, `localizePath('cs', x) === x`, and the `sk-SK` ternary resolves to `cs-CZ` for cs → byte-identical.

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/novinky/[slug].astro
git commit -m "feat(i18n): localized novinky article page (cs byte-identical)"
```

---

## Task 8: `novinky/index.astro` — translated listing

**Files:**
- Modify: `src/pages/novinky/index.astro`

- [ ] **Step 1: Overlay the listed articles + localize chrome**

1. Imports:
```astro
import { fetchArticleTranslations, overlayArticle, buildTranslationMap } from '../../lib/articles-i18n';
import { localizePath, t, tf } from '../../i18n/utils';
```
2. After `const supabase = createAnonClient();` add `const locale = Astro.locals.locale ?? 'cs';`.
3. After `const sorted = articles ?? [];` overlay:
```astro
let sortedL = sorted;
if (locale !== 'cs' && sorted.length) {
  const trMap = buildTranslationMap(await fetchArticleTranslations(supabase, sorted.map((a) => a.id), locale));
  sortedL = sorted.map((a) => overlayArticle(a, trMap.get(a.id)));
}
```
   Use `sortedL` in the results `.map(...)` that renders `<ArticleCard>`, and pass `locale={locale}` to each `<ArticleCard>`.
4. `categoryLabels` object → `t(locale, 'nov.cat.' + slug)` (build `catPills` labels via `t`).
5. Form `action="/novinky/"` and category pill hrefs `/novinky/kategorie/${slug}/`, tag hrefs `/novinky/tema/${t}/`, "Vše" pill `/novinky/`, reset `/novinky/`, empty-state `/novinky/` → all `localizePath(locale, …)`.
6. Visible chrome via `t(locale, …)`: section label, H1 default (`nov.title.default`), lead (`nov.lead`), filters summary (`nov.filters` + `nov.filters.active`), search placeholder/submit, Od/Do labels, reset, "Témata", "Vše", empty + emptyReset.
7. The "Nalezeno {count} článků … stránka {page} z {totalPages}" line + `<Layout title=…>` default title/description: use the `nov.*` keys for cs verbatim; keep the dynamic count via plain interpolation (the cs string is reproduced verbatim in `nov.*`, so cs is identical). For the pluralized "článků" you may keep the existing literal for cs and add a `tf`/`plural` only on the sk branch if desired — simplest byte-safe route: keep the existing Czech expression when `locale==='cs'`, use a `tf` sk variant when `locale==='sk'`.

> Keep the cs render byte-identical: guard any restructured expression with `locale === 'cs' ? <existing literal> : <localized>`.

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/novinky/index.astro
git commit -m "feat(i18n): localized novinky listing (cs byte-identical)"
```

---

## Task 9: `novinky/kategorie/[kat]` — SSR + localized

**Files:**
- Modify: `src/pages/novinky/kategorie/[kat]/index.astro`

- [ ] **Step 1: Convert to SSR and localize**

1. Replace `export const prerender = true;` + the `getStaticPaths()` block with `export const prerender = false;` and read the param at request time:
```astro
export const prerender = false;
const { kat } = Astro.params;
const VALID = ['technika', 'dotace', 'trh', 'legislativa', 'znacky', 'novinky'];
if (!kat || !VALID.includes(kat)) return Astro.rewrite('/404');
const locale = Astro.locals.locale ?? 'cs';
```
2. Imports: add `import { fetchArticleTranslations, overlayArticle, buildTranslationMap } from '../../../../lib/articles-i18n';` and `import { localizePath, t } from '../../../../i18n/utils';`.
3. `categoryLabels`/`categoryDescriptions` cs reads → `t(locale, 'nov.cat.' + kat)` for the label; keep cs descriptions verbatim (add sk variants to `nov.*` only if you want translated descriptions — optional, defer; cs keeps the literal object guarded by `locale==='cs'`).
4. Overlay `items`:
```astro
let itemsL = items;
if (locale !== 'cs' && items.length) {
  const trMap = buildTranslationMap(await fetchArticleTranslations(supabase, items.map((a) => a.id), locale));
  itemsL = items.map((a) => overlayArticle(a, trMap.get(a.id)));
}
```
   Render `itemsL` in the `<ArticleCard>` map and pass `locale={locale}`.
5. Links `/novinky/`, `/novinky/tema/${t}/` → `localizePath(locale, …)`. Breadcrumb/back/"Novinky" strings via `t`. `inLanguage` of CollectionPage JSON-LD → sk-SK on sk.

- [ ] **Step 2: Dev-verify cs + sk both render**

Run `npx astro dev`, then:
`curl -s -o /dev/null -w '%{http_code}\n' localhost:4321/novinky/kategorie/technika/` → `200`
`curl -s localhost:4321/sk/novinky/kategorie/technika/ | grep -o 'lang="sk"' | head -1` → `lang="sk"`
Stop dev.

- [ ] **Step 3: Type-check + commit**

Run: `npx tsc --noEmit` (expect no new errors)
```bash
git add src/pages/novinky/kategorie/[kat]/index.astro
git commit -m "feat(i18n): SSR + localized novinky category page"
```

---

## Task 10: `novinky/tema/[tag]` — localized

**Files:**
- Modify: `src/pages/novinky/tema/[tag]/index.astro`

- [ ] **Step 1: Overlay + localize (already SSR)**

1. Imports: `fetchArticleTranslations, overlayArticle, buildTranslationMap` from `../../../../lib/articles-i18n`; `localizePath, t` from `../../../../i18n/utils`.
2. `const locale = Astro.locals.locale ?? 'cs';` after `const supabase = …`.
3. Overlay `items` → `itemsL` (same pattern as Task 9 step 4); render `itemsL` with `locale={locale}` on `<ArticleCard>`.
4. `categoryLabels` reads → `t(locale, 'nov.cat.' + slug)`.
5. Links `/novinky/`, `/novinky/kategorie/${slug}/`, `/novinky/tema/${t}/` → `localizePath(locale, …)`.
6. Breadcrumb/"Novinky"/"Téma"/back strings via `t` (keep cs verbatim — add `nov.theme` key if needed, else guard cs literal). `inLanguage` → sk-SK on sk.

- [ ] **Step 2: Type-check + commit**

Run: `npx tsc --noEmit` (expect no new errors)
```bash
git add src/pages/novinky/tema/[tag]/index.astro
git commit -m "feat(i18n): localized novinky tag page"
```

---

## Task 11: Full test suite + cs byte-identity verification + backfill

**Files:** none modified (verification + data backfill)

- [ ] **Step 1: Run the unit suite**

Run: `npx vitest run`
Expected: all green (175 prior + new articles-i18n tests).

- [ ] **Step 2: Production build**

Run: `nvm use 22 && npm run build`
Expected: build succeeds (Turbopack/astro). If the worktree's symlinked `node_modules` breaks the build, use a hardlink copy per `[[feedback-turbopack-worktree-hardlink-nodemodules]]`.

- [ ] **Step 3: cs byte-identity check (prerendered novinky pages)**

Diff the new `dist/` against a pre-change build for the prerendered novinky outputs (kategorie pages are now SSR → not in dist; index/[slug]/tema were already SSR). The ONLY expected cs diffs anywhere are the header `LangSwitcher` markup (intentional, every page). Confirm no OTHER cs novinky diffs:
```bash
# build pre-change to /tmp/dist-before (git stash or a parent build), then:
diff -rq /tmp/dist-before dist | grep -i novinky || echo "no prerendered novinky diffs"
```
Expected: differences limited to the LangSwitcher block.

- [ ] **Step 4: Apply Task 1 migration in Studio (user) — gate**

Confirm with the user that `article_translations` exists. If not, STOP here — Steps 5–6 require it.

- [ ] **Step 5: Backfill SK translations (23 articles)**

Run: `python3 scripts/i18n-translate.py novinky all`
Expected: `DONE — 23 article(s)`. Spot-check 2–3 in Studio for native-SK quality + preserved HTML structure. Cost note: opus editor per article — 23 articles is modest but watch the run.

- [ ] **Step 6: Dev/preview SK content verification**

`npx astro dev`, pick a known slug:
`curl -s localhost:4321/sk/novinky/<slug>/ | grep -o 'lang="sk"'` → present
Confirm the body is Slovak (translated), category label is SK, date is `sk-SK`, internal links are `/sk/novinky/…`, and `<meta name="robots">` is still `noindex` (launch not yet flipped). Stop dev.

---

## Task 12 (GATED — do NOT check until user approves launch): index `/sk/novinky`

**Files:**
- Modify: `src/i18n/utils.ts:31`

- [ ] **Step 1: Add `/novinky` to the launched prefixes**

```ts
export const SK_LAUNCHED_PREFIXES = ['/stroje', '/znacky', '/srovnani', '/novinky'];
```

This single line flips `/sk/novinky/*` to `index, follow`, emits reciprocal `hreflang`, and appends `/sk/novinky/*` mirrors to the sitemap (existing machinery in `Layout.astro` + `sitemap.xml.ts`). Only do this AFTER the backfill (Task 11) is complete and the user has reviewed SK quality.

- [ ] **Step 2: Rebuild, re-verify cs byte-identity (catalog cs pages gain a `/sk/novinky` nothing; novinky cs pages gain reciprocal hreflang — an accepted, approved diff), and deploy per `[[reference-agro-svet-deploy-manual-wrangler]]`:**

```bash
cd ~/agro-svet-i18n-obsah && cp ~/agro-svet/.env . && nvm use 22 && npm run build && npm run deploy
```

- [ ] **Step 3: Live verify**

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://agro-svet.cz/sk/novinky/
curl -s https://agro-svet.cz/sk/novinky/<slug>/ | grep -o 'index, follow'
curl -s https://agro-svet.cz/sitemap.xml | grep -c '/sk/novinky/'
```

- [ ] **Step 4: Commit + update project memory**

```bash
git add src/i18n/utils.ts
git commit -m "feat(i18n): launch /sk/novinky (index + hreflang + sitemap)"
```
Update `project-agro-svet-i18n-localization.md`: Fáze 2a done + live.

---

## Self-Review notes

- **Spec coverage:** SK novinky translation (Tasks 1–3,7–10), data model (Task 1), pipeline (Task 3), UI chrome + switcher (Tasks 4–5), cards (Task 6), byte-identity + backfill (Task 11), gated launch (Task 12). The broader 2b (jurisdiction data) / 2c (legal) are OUT of scope by agreement and tracked in memory.
- **cs byte-identity:** preserved everywhere via `t('cs',…)` verbatim keys + `localizePath('cs',x)===x` + `locale!=='cs'` guards on all overlay fetches; the ONLY intentional cs change is the header `LangSwitcher` (user-requested).
- **Type consistency:** `overlayArticle`/`buildTranslationMap`/`fetchArticleTranslations` signatures are used identically across Tasks 7–10; `ArticleCard` gains an optional `locale` prop defaulting to `'cs'` so existing call sites are unaffected.
- **Blocker:** Task 1 Studio migration gates Tasks 11.5–12 only; all code tasks proceed without it.
</content>
</invoke>
