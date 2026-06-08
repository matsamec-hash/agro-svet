# agro-svet.cz — UK lokalizace, Fáze 3: jak-na-to (návody) + slovník — DESIGN

**Datum:** 2026-06-08
**Repo / worktree:** `~/agro-svet-uk-faze3` (větev `feat/i18n-uk-faze3-jaknato-slovnik`, off `master`)
**Navazuje na:** Fáze 2 (`master` `1cbf5c0`, živé `/uk/{stroje,srovnani,znacky,encyklopedie}`)
**Precedent:** Fáze 2 content design (`2026-06-07-agro-svet-i18n-uk-faze2-stroje-content-design.md`) — stejná pipeline, pravidla, gating.

---

## 0. Cíl a rozhodnutí

Uživatel (2026-06-08) pověřil: *„vyber sekce, co mají velký potenciál a rozšiř o ně web, pak zkvalitni obsah… máš moji důvěru"* — autonomní exekuce do hotového, ready stavu.

Rozšířit ukrajinskou verzi o **dvě obsahově silné, jurisdikčně neutrální, samostatné sekce** a zapnout jejich indexaci pod `/uk`:

1. **`/jak-na-to`** — praktické how-to návody (12 článků). Vysoký high-intent SEO. SK overlay vzor už existuje → nízké riziko (mirror).
2. **`/slovnik`** — slovník zemědělských/technických pojmů (206 hesel). Nejvyšší long-tail SEO potenciál (AI Overviews, „co je / jak funguje X"). Samostatný (hesla se prolinkují navzájem + do encyklopedie, která UK už má) → bez dangling odkazů do nelokalizovaných sekcí.

**Proč právě tyto dvě:** obě jsou *jurisdikčně neutrální* (na rozdíl od dotace/statistiky/půda/odrudy, které jsou vázané na ČR/ÚKZÚZ a patří do samostatné jurisdikční fáze) a *samostatné* (neprolinkují masivně do nelokalizovaných datových sekcí plodiny/choroby/plemena). To umožní čistou indexaci bez míchání jazyků a bez rozbitých odkazů.

**Zamítnuté alternativy pro tuto fázi:**
- *plodiny / choroby / plemena* — vysoký potenciál, ale prerenderované + CS-only (žádný SK precedent) a navzájem prolinkované; lokalizace = větší infra + riziko dangling odkazů. Odloženo na pozdější fázi (vlastní spec).
- *dotace / statistiky / půda* — jurisdikčně vázané na ČR; pro UK se mají tvořit nově (UAH/UA registry), ne překládat. Mimo scope (samostatná jurisdikční fáze).

**Tvrdá pravidla (NEMĚNIT, převzato z fáze 2):**
- **CZ výstup se obsahově ani indexačně NESMÍ změnit.** Ověřit buildem + sémantickým diffem CS renderu + živým smoke.
- **SK výstup beze změny.**
- `uk` = ukrajinština, publikum = Ukrajina (domácí trh). Obě sekce jurisdikčně neutrální → **čistý odborný překlad**.
- Slug se nepřekládá (URL = cs slug). Chybějící uk obsah = **404, nikdy tichý cs fallback** (zamezí indexaci míchaného jazyka).
- Interpolační tokeny, čísla, enumy, slugy, externí URL = zachovat dle §4.

---

## 1. Sekce A — `jak-na-to` (mirror SK, nízké riziko)

Sekce je **SSR** (`prerender=false`) a už má SK overlay kolekci (`howtoSk`). Mechanismus je locale-generický — stačí přidat uk kolekci a per-locale dispatch.

### 1.1 Obsah — kolekce `howto-uk`
- `src/content/howto-uk/<slug>.md` — 12 souborů, slugy identické s `howto`/`howto-sk`.
- Přeložit: frontmatter (`title`, `description`, `tools[]`, `supplies[]`, `steps[].name` + `steps[].text`, `faq[].q` + `faq[].a`, ostatní prózová pole) + celé MD tělo.
- Zachovat: `slug` (= cs), `heroImage`, čísla (`totalTime`, `estimatedCost`…), strukturu frontmatteru.

### 1.2 Kód
- `src/content.config.ts`: přidat kolekci `howtoUk` (loader glob `./src/content/howto-uk`, schéma `howToSchema()` stejné jako `howto`/`howtoSk`), exportovat v `collections`.
- `src/pages/jak-na-to/[slug].astro` a `index.astro`: nahradit `isSk ? 'howtoSk' : 'howto'` per-locale mapou:
  ```ts
  const HOWTO_COLLECTION = { cs: 'howto', sk: 'howtoSk', uk: 'howtoUk' } as const;
  const items = await getCollection(HOWTO_COLLECTION[locale]);
  ```
  Chybějící uk slug → `Astro.rewrite('/404')` (žádný cs fallback). `base` odvodit per-locale (`/uk` pro uk).
- JSON-LD (howTo/faq/breadcrumb), OG (`/og/howto-<slug>.png` — sdílené, jazykově neutrální obrázky), hreflang: musí emitovat uk variantu po launchi (řeší §3 gating).

---

## 2. Sekce B — `slovnik` (nový lokalizační mechanismus dle vzoru encyklopedie)

Sekce je dnes **prerenderovaná** (`prerender=true`, `getStaticPaths` z pole `SLOVNIK`) a **CS-only** (hardcoded TS, žádný SK). Lokalizujeme do uk přechodem na **SSR + per-locale data**, konzistentně s encyklopedie/znacky/jak-na-to (všechny `prerender=false`).

### 2.1 Data — `SLOVNIK_UK`
- Nový soubor `src/lib/slovnik.uk.ts`: `export const SLOVNIK_UK: SlovnikTerm[]` — 206 hesel přeložených z `SLOVNIK` (master).
- `src/lib/slovnik.ts` (CS) zůstává **bajt verbatim** (jen typ `SlovnikTerm` se reexportuje; CS pole se nemění).
- Přeložit: `term`, `alias[]`, `shortDef`, `longDef` (3–5 odstavců), `externalLabel`. Zachovat: `slug`, `kategorie` (enum), `related[]` (slugy), `externalUrl`.
- Terminologie: odborná ukrajinská zemědělská/strojní (NPK, ISOBUS, AdBlue, CVT…). Historické české plošné/hmotnostní jednotky (korec, strych, jitro, morgen, q) ponechat jako heslo s ukrajinským výkladem (encyklopedická hodnota). EU/CAP a dotační pojmy přeložit jako encyklopedický výklad (Ukrajina = kandidát EU; relevantní), bez tvrzení o ČR-specifické administrativě jako by platila pro UA.

### 2.2 Lib accessory — locale-aware
- `src/lib/slovnik.ts`: rozšířit přístupové funkce na locale-parametr **bez změny CS chování**:
  ```ts
  import { SLOVNIK_UK } from './slovnik.uk';
  const BY_LOCALE: Record<string, SlovnikTerm[]> = { cs: SLOVNIK, uk: SLOVNIK_UK };
  export function getSlovnik(locale: string = 'cs'): SlovnikTerm[] { return BY_LOCALE[locale] ?? SLOVNIK; }
  export function getSlovnikTerm(slug: string, locale: string = 'cs') { return getSlovnik(locale).find(t => t.slug === slug); }
  ```
  Defaultní `locale='cs'` → stávající volání (a CS render) beze změny.
- `KATEGORIE_LABELS`: přidat uk varianty labelů kategorií (per-locale mapa nebo `KATEGORIE_LABELS_UK`).

### 2.3 Routy — `src/pages/slovnik/index.astro` + `[slug].astro`
- `prerender = true` → `false` (SSR). Cache hlavičky jako jak-na-to (`public, max-age=600, s-maxage=3600, swr`).
- Odvodit `locale = Astro.locals.locale ?? getLocaleFromUrl(Astro.url)`; `base = '/uk'` pro uk.
- `getStaticPaths` odstranit (SSR); `[slug]`: `getSlovnikTerm(slug, locale)`, chybí → `Astro.rewrite('/404')`.
- **CS render musí zůstat HTML-identický** (jen render-timing prerender→SSR; výstupní HTML stejné). Ověřit sémantickým diffem (extract text/odkazy/JSON-LD), ne bajtově (per-build šum povolen jen u hashů).
- Interaktivní widgety (`AreaConverter`/`WeightConverter`) a `auto-linker` (`injectLinks`): pro uk použít uk link-kontext (nebo bezpečně vypnout auto-link injection do uk textů, aby se neinjektovaly CS odkazy). Detailně v plánu; výchozí bezpečné = uk dataset + link kontext z uk URL prefixu.
- Související hesla (`related`): mapovat přes `getSlovnikTerm(s, locale)` → uk hesla; odkaz `/uk/slovnik/<slug>/`.

---

## 3. Kódová prerekvizita — gating, nav, sitemap (per-locale, vzor fáze 2)

Mašinérie `LAUNCHED_PREFIXES`/`isLaunchedPath` už je per-locale (fáze 2). Stačí přidat prefixy a ověřit nav/sitemap.

### 3.1 `src/i18n/utils.ts`
- Launch krok (§6): `LAUNCHED_PREFIXES.uk` → přidat `'/jak-na-to'`, `'/slovnik'` (k existujícím 4). Do dokončení obsahu nepřidávat (sekce zůstanou noindex).
- `getAlternates`/`navHref`/`langSwitchHref` — generické, beze změny.

### 3.2 `src/i18n/nav.ts`
- `HIDDEN_SECTIONS.uk = ['data','bazar','photo']`. Ověřit, do které nav skupiny patří `jak-na-to` a `slovnik`: pokud spadají pod skupinu `data` (skrytou pro uk), je nutné je z `data` vyjmout/zviditelnit pro uk (jinak nebudou v navigaci, i když launchnuté). **Řešení:** přesunout `jak-na-to`/`slovnik` mimo skrytou `data` skupinu pro uk, nebo zúžit `HIDDEN_SECTIONS.uk` tak, aby tyto dvě položky zůstaly viditelné. CS/SK nav beze změny.

### 3.3 `src/layouts/Layout.astro` + `src/pages/sitemap.xml.ts`
- Gating (`effectiveNoindex`) i uk sitemap mirror jsou per-locale generické (fáze 2). Po launchi se `/uk/jak-na-to/*` a `/uk/slovnik/*` automaticky objeví v sitemap (indexovatelné cs URL × `isLaunchedPath('uk', …)`). Jen ověřit, že slovnik/jak-na-to URL projdou existujícími sitemap filtry.

---

## 4. Pravidla překladu (mirror fáze 2 §4)

**Překládá se** (human-readable próza): `title`/`description`/`term`/`alias[]`/`shortDef`/`longDef`/`steps[].name|text`/`faq[].q|a`/`tools[]`/`supplies[]`/`externalLabel`/`KATEGORIE_LABELS`.

**Zůstává identické:** `slug`, `kategorie` (enum), `related[]` (slugy), `heroImage`, `externalUrl`, `website`, čísla (`totalTime`, `estimatedCost`, jednotkové hodnoty), datumy.

---

## 5. Translation pipeline (AI překlad + AI review, mirror fáze 2 §5)

Pro každý prózový artefakt:
1. **Subagent A (překlad):** CZ→UK; zachovat strukturu, frontmatter klíče, markdown, tokeny, čísla, slugy, enumy.
2. **Subagent B (review):** odborná terminologie, přirozenost, SEO formulace, **nulová CZ kontaminace** (žádná latinka v prózových polích kromě vlastních jmen/značek/jednotek), neporušená struktura.
3. Paralelizace přes `dispatching-parallel-agents` po dávkách. Slovník (206) dávkovat (např. po ~20 heslech), aby šly review a parita kontrolovat průběžně. **Žádný částečný launch** — `/slovnik` se přidá do `LAUNCHED_PREFIXES.uk` až když je všech 206 hesel přeloženo a zreviováno (jinak 404 na chybějících = OK, ale launchujeme kompletní).

---

## 6. Launch + verifikace

Po dokončení obsahu:
```ts
LAUNCHED_PREFIXES.uk = ['/stroje', '/srovnani', '/znacky', '/encyklopedie', '/jak-na-to', '/slovnik'];
```
Ověřit (autoritativní = build Node 22 + sémantický CS diff + živý smoke):
- `nvm use 22 && npm run build` projde (Node 22.22.2; astro 6.4.4 vyžaduje node 22).
- `npx vitest run` zelené (baseline + nové testy §7).
- **CZ regrese:** sémantický diff CS renderu `/slovnik/*` a `/jak-na-to/*` (text + odkazy + JSON-LD) = 0 obsahových rozdílů vs. master build. CS `effectiveNoindex` nezměněn. SK beze změny.
- **Deploy = merge do `master` → Coolify auto-deploy** (VPS Node origin, app `n132yjaw951x4x3sy665rnvz`). ⚠️ NE wrangler (migrace CF→VPS hotová 2026-06-08).
- Živý smoke (`curl --resolve agro-svet.cz:443:187.124.12.96`): `/uk/jak-na-to/<slug>/`, `/uk/jak-na-to/` (index), `/uk/slovnik/<slug>/`, `/uk/slovnik/` (index) → HTTP 200, **ukrajinský** obsah, `<meta robots>`=`index,follow`, reciproční hreflang cs/sk/uk, položky v nav, URL v sitemap. CS/SK ekvivalenty beze změny.

---

## 7. Testy (TDD)

- `getSlovnik('cs')` === `SLOVNIK` (identita); `getSlovnik('uk')` === `SLOVNIK_UK`; `getSlovnik('xx')` fallback cs. `getSlovnikTerm(slug,'uk')` vrací uk heslo, neexistující → undefined.
- Parita: `SLOVNIK_UK` má stejnou množinu `slug` a `kategorie` jako `SLOVNIK` (žádné chybějící/přebývající heslo, enumy zachovány); `related[]` slugy ukazují na existující hesla.
- Sanity uk vzorku: přítomnost cyrilice v `term`/`shortDef`/`longDef`, žádná CZ kontaminace (heuristika: žádná typicky-česká diakritika `ř/ě/ů` mimo whitelist).
- `content.config`: kolekce `howtoUk` existuje; per-locale výběr vrací uk entry; chybějící slug → 404.
- `isLaunchedPath('uk', '/jak-na-to/...')` a `('uk','/slovnik/...')` → true po launchi; cs nikdy nedostane gating-noindex; sk beze změny.
- howto parita: `howto-uk` má stejnou množinu slugů jako `howto`.

---

## 8. Provozní lekce (KRITICKÉ — aktualizováno po migraci)

- **Deploy:** merge `feat/i18n-uk-faze3-jaknato-slovnik` → `master` → **Coolify auto-deploy** (Nixpacks Node 22). NE `npm run deploy`/wrangler.
- **Build lokálně:** `source ~/.nvm/nvm.sh && nvm use 22` (v22.22.2) → `npm run build`. Astro 6.4.4 nejede na node 20.
- **Git:** NIKDY `git add -A` (vtáhne `.env*`). Přidávat explicitně. Push: `/usr/bin/git -c credential.helper='!gh auth git-credential' push` nebo token-in-URL `git push "https://x-access-token:$(gh auth token)@github.com/matsamec-hash/agro-svet.git" <branch>`.
- **Feature práce ve worktree** `~/agro-svet-uk-faze3` (hotovo). Před mergem `git fetch && merge origin/master` (ochrana proti tichému vrácení cizí práce).
- **Sandbox neresolvuje .cz** → smoke přes `curl --resolve agro-svet.cz:443:187.124.12.96`.
- **Žádná DB práce** v této fázi (jak-na-to i slovnik jsou compile-time/SSR z repo dat).

---

## 9. Definition of done

- Sekce A: 12 `howto-uk` MD přeloženo+zreviováno; `howtoUk` kolekce + per-locale dispatch; chybějící slug → 404.
- Sekce B: 206 `SLOVNIK_UK` hesel přeloženo+zreviováno; routy SSR + locale-aware; CS slovnik.ts verbatim; CS render sémanticky identický.
- Gating: `LAUNCHED_PREFIXES.uk` rozšířen o `/jak-na-to`+`/slovnik`; nav položky viditelné pro uk; sitemap+hreflang per-locale.
- Kvalitní pass: review-pass všech překladů (nulová CZ kontaminace, anti-thin), interní prolinkování nových sekcí (related hesla, návody), ověřená SEO výbava (JSON-LD, OG, meta).
- Build + testy zelené (baseline + nové); sémantický CS diff = 0; živý smoke obou sekcí pod `/uk` (200, ukrajinština, index,follow, hreflang, nav, sitemap); CS/SK beze změny.
