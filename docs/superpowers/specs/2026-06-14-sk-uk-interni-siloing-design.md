# SK/UK interní siloing — oprava osiřelých detailů (design)

Datum: 2026-06-14
Větev (plán): `feat/i18n-internal-siloing`
Návaznost: sitemap `lastmod` fix (PR #81) — tohle je silnější páka pro „Objeveno – neindexováno“.

## Problém

SK detailní stránky (~6 607 URL v sitemapě) jsou **osiřelé**: vedou na ně jen sitemapa,
ne interní odkazy z jiných SK stránek. SK huby a těla článků odkazují na **cs** URL, čímž:

- odvádějí uživatele i crawlery mimo SK silo,
- snižují crawl-demand a interní PageRank pro SK obsah,
- nechávají SK detaily bez discovery z navigace.

Cíl: každá SK (a UK) stránka odkazuje na **lokalizované** verze launchnutých sekcí →
zasilování v rámci locale.

## Ověřené mezery (file:line)

- **Auto-linker je locale-slepý.** `src/lib/auto-linker.ts` — `buildGlossary()` zapéká cs URL
  natvrdo (ř. 59 brandy, 67 modely, 88 funkční skupiny, 71/78/82 plemena, 106/116 slovník,
  126 žebříčky). `injectLinks()` / `injectLinksInText()` nemají `locale` param. Glossary je
  **globálně cachovaný** (`cachedGlossary`, ř. 42/149–151) → locale NELZE zapéct do cache,
  musí se aplikovat až při renderu `<a href>`.
- **Huby/listingy mají natvrdo cs hrefy.** `src/components/stroje/CategoryBrowse.astro`,
  `src/pages/stroje/index.astro` (a další launchnuté šablony, viz Scope) → SK huby vedou na cs →
  stovky SK model/série/značka/encyklopedie detailů osiřelých od SK navigace.
- **`excludeUrl` je napříč call-sites nekonzistentní.** `puda/[slug]` a `encyklopedie/[slug]`
  předávají **locale-prefixovaný** path (`${base}/…`), `novinky/[slug]` **cs-root**,
  `slovnik/[slug]` **plný URL** (`SITE_URL/...`). Glossary klíče jsou cs-root → self-exclusion
  dnes funguje jen náhodou.

## Co je správně (NEMĚNIT, jen ověřit)

- `localizePath(locale, path)` (i18n/utils.ts:23) — pro cs **no-op** (vrací path beze změny).
- `isLaunchedPath(locale, csRootPath)` (ř. 39) — true, když cs-root cesta patří do launchnuté sekce.
- `navHref(locale, href)` (ř. 58) — už dnes lokalizuje nav/footer href **jen** když je sekce
  launchnutá (+ `SK_PRERENDERED_NAV_PATHS` exclude, dnes prázdný); jinak vrací cs. Živě ověřené.
- Related-komponenty (encyklopedie/novinky/stroje detail/dotace cross-linky), breadcrumby a
  stroje detail stránky lokalizují správně přes `localizePath`/`linkBase`.

## Princip řešení (potvrzeno v brainstormu)

**Jeden sdílený gating helper, uniformně aplikovaný.**

1. **`localizeInternalHref(locale, href)`** — extrahovaná kanonická funkce v `src/i18n/utils.ts`
   s přesně dnešní sémantikou `navHref`: lokalizuj na `/sk`|`/uk` **jen** když
   `isLaunchedPath(locale, root)` a cesta není v `SK_PRERENDERED_NAV_PATHS`; jinak vrať cs href
   beze změny. Pro `cs` **no-op**. `navHref` se stane tenkým aliasem (žádný drift v živé nav logice).
2. **Gate rozhoduje launched/ne-launched sám** → interní hrefy se obalují **uniformně**, bez
   ručního třídění. Důsledky:
   - `/stroje/…`, `/znacky/…`, `/srovnani/…`, `/encyklopedie/…`, `/jak-na-to/…` (+ pro sk navíc
     `/novinky`,`/kalkulacka`,`/dotace`,`/statistiky`,`/puda`) → dostanou `/sk`|`/uk` prefix.
   - `/plemena/…`, `/zebricky/…`, `/pruvodce/…`, `/bazar/…`, `/slovnik/…` (nelaunchnuté pod daným
     locale) → **zůstanou cs** (žádné 302 — jen sekce s reálnou lokalizovanou stránkou se prefixují).
3. **Žádné 302**, **cs výstup byte-identický** (helper je no-op pro cs).
4. **Platí pro SK i UK** současně — helper je locale-agnostický.

### Rozhodnutí z brainstormu

- Otázka #1 a #3 (linkovat na nelaunchnutý cíl / prefixovat všechny entity?) → **gate přes
  `isLaunchedPath`**, nikdy negenerovat odkaz, který 302-uje.
- Otázka #2 (UK zároveň?) → **ano, SK i UK**.

## Komponenta A — Hub/listing sweep

**Metoda:** v každé šabloně, která se reálně vykresluje pod `/sk`|`/uk`, obalit interní
`/`-prefixovaný `href` do `localizeInternalHref(locale, …)`. `locale` je už v scope (např.
`CategoryBrowse.astro:10`, `stroje/index.astro:9`) nebo se odvodí
`Astro.locals.locale ?? getLocaleFromUrl(Astro.url)`.

**NEOBALOVAT:** `src=`/asset/obrázkové URL, `#kotvy`, `mailto:`/`tel:`/externí `https://`.
(Helper je sice no-op pro cs a pro nelaunchnuté, ale plný `https://` URL nikdy nesmí projít
`localizePath` → sweep cílí výhradně na `href="/…"`.)

**Scope souborů (vykreslují se pod /sk|/uk — launchnuté sekce + home + jejich komponenty):**

- `src/pages/index.astro` (home; odkazy na launchnuté sekce)
- `src/pages/stroje/index.astro`, `stroje/[brand]/index.astro`, `stroje/[subcategory]/index.astro`,
  `stroje/zemedelske-stroje/index.astro`, `stroje/zemedelske-stroje/[group]/index.astro`,
  `stroje/[brand]/rada/[category]/[family]/index.astro`
- `src/pages/srovnani/index.astro`, `srovnani/[combo]/index.astro`
- `src/pages/encyklopedie/index.astro`
- `src/pages/dotace/index.astro`, `dotace/jak-vybrat/index.astro`, `dotace/kalendar-kol/index.astro`
- `src/pages/znacky/[slug].astro`
- `src/pages/kalkulacka/prevody-jednotek/index.astro`, `kalkulacka/prevody-hmotnost/index.astro`
- komponenty renderované uvnitř výše uvedených: `src/components/stroje/CategoryBrowse.astro`,
  `src/components/home/LatestArticles.astro`, `src/components/statistiky/BottomCTA.astro`,
  `src/components/calc/DotaceCapCz.astro`

**Mimo scope (cs-only prerendered, pod /sk se nevykreslí → `locale` vždy cs → obalení by bylo
no-op):** `pruvodce/*`, `prehled/*`, `kviz/*`, `prodejci/*`, `bazar/*`, `404.astro`,
`slovnik/[slug]` hub-hrefy (slovník není sk-launchnutý). Bazar CTA (`/bazar/novy/`,`/bazar/`) navíc
záměrně cs (bazar dočasně schovaný).

> Pozn.: i kdyby se některý „mimo scope“ soubor přesto někdy vykreslil pod locale, helper by ho
> nechal na cs (gate), takže nehrozí regrese — vyřazení je čistě kvůli fokusu diffu.

## Komponenta B — Auto-linker locale-aware

**Glossary beze změny:** zůstává cs-root URL a globálně cachovaný (locale-stabilní). Lokalizace
se aplikuje až při renderu `<a>`.

**API (zpětně kompatibilní, nový volitelný `locale` s defaultem `'cs'`):**

- `injectLinks(html, ctxOrExclude, locale = 'cs')`
- `injectLinksInText(text, ctxOrExclude, locale = 'cs')`
- `renderMarkdownWithLinks(markdown, excludeUrl, locale = 'cs')` (`src/lib/markdown-with-links.ts`)

**Render `<a href>`:**

- **interní** entry → `href = localizeInternalHref(locale, entry.url)`.
- **externí** entry (`entry.external`, remoteCatalog) → **nikdy** nelokalizovat (zůstává
  `target="_blank" rel="noopener"`).
- `class="auto-link"` zachovat beze změny.

**Dedup `used` set** zůstává klíčovaný **cs-root `entry.url`** (locale-stabilní; stejný term se
nelinkuje dvakrát napříč perex+body bez ohledu na locale).

**`createLinkContext(excludeUrl)`** normalizuje `excludeUrl` → **cs-root** (strip `SITE_ORIGIN`,
poté `stripLocale`), aby self-exclusion fungoval bez ohledu na to, co caller předá. Tím se
nemusí měnit tvar `excludeUrl` v call-sites.

**Call-sites předají `locale`:** `puda/[slug]`, `dotace/[slug]`, `jak-na-to/[slug]`,
`encyklopedie/[slug]` (přes `renderMarkdownWithLinks(..., locale)`), `novinky/[slug]`
(`injectLinks`/`injectLinksInText`), `slovnik/[slug]` (`injectLinks`; slovník zůstane cs entry,
ale locale param se předá pro konzistenci).

## Testovací strategie (TDD)

- **Unit `localizeInternalHref`:** cs → no-op; sk launchnutá sekce → `/sk/...`; sk nelaunchnutá
  (`/plemena/`,`/zebricky/`) → cs; uk launchnutá → `/uk/...`; root `/` → lokalizovaný; plný
  `https://` / `#kotva` se nesmí rozbít. `navHref` alias = identické chování (existující testy zelené).
- **Unit auto-linker:**
  - `injectLinks(html, ex, 'sk')` → interní launchnuté entries `/sk/stroje/...`; nelaunchnuté
    (`/plemena/...`) cs; **externí** netknuté.
  - dedup: stejný term v perex+body linkován jen jednou (cs-root klíč) i pod sk.
  - `createLinkContext` normalizace: locale-prefixovaný i full-URL excludeUrl → self-link vyloučen.
  - **cs byte-identické:** `injectLinks(html, ex, 'cs')` === `injectLinks(html, ex)` (bez locale).
- **Snapshot cs invariant:** vybraný hub render pod cs před/po = prázdný diff (akceptační podmínka).
- **Build + typecheck zelené;** baseline 3 bazar-nav fails OK.

## Akceptační kritéria

1. Žádná SK/UK-launchnutá stránka neobsahuje natvrdo cs interní odkaz na launchnutou sekci
   (vede vždy na `/sk/...` resp. `/uk/...`).
2. Auto-linker v těle SK/UK markdownu generuje `/sk/...` / `/uk/...` odkazy pro launchnuté sekce.
3. cs výstup **byte-identický** (snapshot diff prázdný).
4. Žádný interní odkaz nevede na cestu, která 302→cs (gate to zaručuje).
5. Build zelený, testy zelené (baseline bazar-nav fails OK).

## Workflow

Subagent-driven dle zavedeného postupu; worktree z aktuálního `master`
(`~/agro-svet/.worktrees/i18n-internal-siloing` nebo dle using-git-worktrees), `npm ci` na Node 22,
`.env` pro DB-dotčené stránky. Per-task review (spec + code-quality), finální opus review.

**Po merge ověřit živě:** 3–4 SK huby (`/sk/stroje/traktory/`, `/sk/stroje/`, `/sk/encyklopedie/`)
→ odkazy vedou na `/sk/...`; SK článek → auto-linky v těle `/sk/...`; spot-check `/uk/stroje/`.

## Mimo scope

- sitemap `lastmod` (hotovo, PR #81)
- tvorba nového obsahu / nových cross-link bloků (jen oprava hrefů existujících)
- objem / noindex strategie SK/UK zrcadel (samostatné rozhodnutí)
- bazar (dočasně schovaný)
