# agro-svet.cz — UK lokalizace, Fáze 4a: Slovník UK — DESIGN

**Datum:** 2026-06-13
**Track:** #3 (UK jurisdikční data), fáze 4a — viz zadání `2026-06-13-agro-svet-track3-uk-jurisdikcni-data-zadani.md`
**Navazuje na:** Fáze 2 (`/uk/{stroje,srovnani,znacky,encyklopedie}`) + Fáze 3 (`/uk/jak-na-to`), oboje živé.
**Nahrazuje:** slovníkovou část spec `2026-06-08-agro-svet-i18n-uk-faze3-jaknato-slovnik-design.md` (§2) — ta byla psaná na 206 hesel a descopnutá; jak-na-to z ní je už shipnuté.
**Repo/větev:** worktree `~/agro-svet-uk-faze4a-slovnik`, větev `feat/i18n-uk-faze4a-slovnik` z `master`.

---

## 0. Cíl a rozhodnutí

Lokalizovat slovník zemědělských/technických pojmů (`/slovnik`) do ukrajinštiny a zapnout jeho indexaci pod `/uk`. Slovník = nejvyšší long-tail SEO potenciál (AI Overviews, „co je / jak funguje X"), jurisdikčně **neutrální** a **samostatný** (hesla se prolinkují navzájem + do encyklopedie, kterou UK už má) → čistá indexace bez míchání jazyků a bez dangling odkazů.

**Klíčová fakta (grounded 2026-06-13):**
- CS slovník má **308 hesel**: 206 core (`src/lib/slovnik.ts` `SLOVNIK_CORE`) + 102 extra (`src/lib/slovnik-extra.ts` `SLOVNIK_EXTRA`, mergnuto PR #51 `e8e76d8`). `SLOVNIK = [...CORE, ...EXTRA]`.
- Routa `src/pages/slovnik/{index,[slug]}.astro` je dnes **`prerender=true`** (`getStaticPaths` z pole `SLOVNIK`) a **CS-only** (hardcoded TS, žádný SK).
- Ostatní UK sekce (encyklopedie/znacky/jak-na-to) jsou **SSR** (`prerender=false`) — locale řídí middleware přes `Astro.locals.locale`.

**Rozhodnutí z brainstormu:**
- **Rozsah cyklu:** jen fáze 4a slovník UK. Statistiky/dotace/půda (UA-data sourcing) = samostatný brainstorm příště.
- **Rozsah hesel:** **všech 308**, encyklopedicky.
- **Architektura routy:** **prerender → SSR** (volba A), konzistentně s ostatními UK sekcemi.

**Tvrdá pravidla (NEMĚNIT, převzato z fáze 2/3):**
- `uk` = ukrajinština, publikum = Ukrajina (domácí trh). Slovník jurisdikčně neutrální → **čistý odborný překlad**.
- Slug se nepřekládá (URL = cs slug). Chybějící uk obsah = **404, nikdy tichý cs fallback** (zamezí indexaci míchaného jazyka).
- **CS výstup musí zůstat HTML-identický** (byte-parita sémantická).
- Launch prefix přidat **až po review obsahu**, ne dřív.

---

## 1. Data & lib (locale-aware, CS beze změny)

### 1.1 `src/lib/slovnik.uk.ts` (nový)
- `export const SLOVNIK_UK: SlovnikTerm[]` — **308 hesel** přeložených z `SLOVNIK` (master). Reuse typu `SlovnikTerm` (import z `slovnik.ts`).
- Slug = **cs slug** (identické množiny). Slugy/čísla/jednotky se nemění.
- Přeložit: `term`, `alias`, `shortDef`, `longDef`, `faq` (q/a), `zajimavosti`. `related` zůstávají cs slugy (mapují se na uk hesla v routě), `externalUrl`/`externalLabel` viz §4.

### 1.2 `src/lib/slovnik.ts` — locale-aware accessory (CS chování beze změny)
- CS pole (`SLOVNIK_CORE` + import `SLOVNIK_EXTRA`, `SLOVNIK`) zůstává **bajt-verbatim**.
- Přidat:
  ```ts
  import { SLOVNIK_UK } from './slovnik.uk';
  const BY_LOCALE: Record<string, SlovnikTerm[]> = { cs: SLOVNIK, uk: SLOVNIK_UK };
  export function getSlovnik(locale: string = 'cs'): SlovnikTerm[] { return BY_LOCALE[locale] ?? SLOVNIK; }
  export function getSlovnikTerm(slug: string, locale: string = 'cs') { return getSlovnik(locale).find(t => t.slug === slug); }
  ```
- Stávající `getSlovnikTerm(slug)` volání (default `'cs'`) → CS chování beze změny.

### 1.3 `KATEGORIE_LABELS_UK`
- Ukrajinské labely 14 kategorií (`technologie | pohon | hnojivo | dotace | agrotechnika | regulace | precise-farming | jednotky | historie | chov | slang | ochrana | plodiny | vcelarstvi`). Per-locale mapa nebo `KATEGORIE_LABELS_UK` vedle `KATEGORIE_LABELS` (CS beze změny).

---

## 2. Routa (prerender → SSR, CS HTML-identický)

`src/pages/slovnik/index.astro` + `src/pages/slovnik/[slug].astro`:
- `prerender = true` → **`false`** (SSR). Cache hlavičky jako jak-na-to: `public, max-age=600, s-maxage=3600, stale-while-revalidate=86400`.
- Locale: `const locale = Astro.locals.locale ?? 'cs'`; `base = locale === 'uk' ? '/uk' : ''`.
- `getStaticPaths` **odstranit** (SSR).
- `[slug]`: `const term = getSlovnikTerm(slug, locale); if (!term) return Astro.rewrite('/404');` — **žádný cs fallback**.
- `index`: `getSlovnik(locale)` pro výpis, labely z lokalizované `KATEGORIE_LABELS`.
- `related` hesla: mapovat přes `getSlovnikTerm(s, locale)`; odkazy `${base}/slovnik/<slug>/`.
- **Widgety** `AreaConverter`/`WeightConverter` (`AREA_UNIT_BY_SLUG`/`WEIGHT_UNIT_BY_SLUG`): zachovat — jednotky jsou jazykově neutrální, widget funguje pro obě locale.
- **`auto-linker` `injectLinks`/`createLinkContext`**: pro uk vytvořit uk link-kontext (uk dataset + uk URL prefix), nebo injekci do uk textů bezpečně **vypnout**, aby se do UK nevkládaly CS odkazy. Default bezpečné = uk dataset; detail v plánu.
- **JSON-LD** (breadcrumb, FAQPage): generovat z lokalizovaných polí; `pageUrl` per-locale (`${SITE_URL}${base}/slovnik/<slug>/`).

**CS parita:** prerender→SSR mění jen timing renderu, ne výstup. Ověřit **sémantickým diffem** (extrahovaný text/odkazy/JSON-LD) CS stránek master vs větev — HTML-identický (per-build hashe povoleny).

---

## 3. Gating, nav, sitemap, hreflang (per-locale, vzor fáze 2/3)

### 3.1 `src/i18n/utils.ts`
- `LAUNCHED_PREFIXES.uk`: přidat `'/slovnik'` (k existujícím `/stroje,/srovnani,/znacky,/encyklopedie,/jak-na-to`). **Až po review obsahu** (do té doby sekce noindex via `isLaunchedPath`).

### 3.2 `src/i18n/nav.ts`
- `HIDDEN_SECTIONS.uk` obsahuje `data`. Ověřit, do které nav skupiny `slovnik` patří; pokud spadá pod skrytou `data`, **zviditelnit `slovnik` pro uk** (vyjmout z hidden / nav href na `/uk/slovnik`). CS/SK nav beze změny.

### 3.3 `src/pages/sitemap.xml.ts`
- Hub `/uk/slovnik/` se zrcadlí přes `ukMirror` (po launchi). **Detail slugy přidat explicitně** iterací `getSlovnik('uk')` (vzor SK dotace detaily ř. ~441–444), `loc = ${SITE_URL}/uk/slovnik/<slug>/`.

### 3.4 `src/layouts/Layout.astro`
- Po launchi emituje uk hreflang variantu slovník stránek (řídí `isLaunchedPath`); ověřit reciproční cs↔uk hreflang.

---

## 4. Exekuce překladu & kvalita (subagent-driven, vzor fáze 2/3)

- **Metoda:** subagent-driven překlad po dávkách (~30–40 hesel/dávka, ~8–10 dávek), dělení dle kategorií. Každý subagent přeloží pole `SlovnikTerm` (term/alias/shortDef/longDef/faq/zajimavosti).
- **Pravidla překladu:**
  - Odborná ukrajinská zemědělská/strojní terminologie; značky (NPK, ISOBUS, AdBlue, CVT, DPF…) zůstávají.
  - Historické ČR plošné/hmotnostní jednotky (korec, strych, jitro, morgen, q) — ponechat jako heslo s **ukrajinským výkladem** (encyklopedická hodnota).
  - **CZ/EU-CAP a dotační pojmy** (SAPS, ANC, ekoschémata, PRV, greening, redistributivní platba…) a tržní pojmy (MATIF, forward, basis, komoditní burza) → **encyklopedický výklad** (co to je obecně / v rámci EU). **Bez tvrzení, že UA používá SZIF / ČR-administrativu.** Kde CS text odkazuje na ČR-specifickou administrativu („podáváte přes SZIF…"), UK verze přeformuluje na neutrální popis mechanismu (UA = kandidát EU, kontext relevantní).
  - `externalUrl` (cs.wikipedia) → uk.wikipedia kde existuje; jinak ponechat smysluplný zdroj nebo vynechat.
  - **Key-parita:** UK pole má identickou `slug` množinu jako CS (308); `related` slugy zachovat.
- **Kvalitní brána:** po překladu **UK review subagent** (jako fáze 2/3) — jazyk, terminologie, 0 CS kontaminace, žádné chybné jurisdikční tvrzení.

---

## 5. Verifikace & testy

- **`tests/i18n/uk-launch.test.ts` / `uk-collections.test.ts`**: rozšířit o `/slovnik` (launched prefix; chybějící slug → 404; uk hesla dostupná).
- **Key-parita test:** CS vs UK slug množina identická (308). (Vzor: existující key-parita testy fáze 2.)
- **CS parita:** sémantický diff CS slovník stránek (vzorek hesel napříč kategoriemi + index) master vs větev — HTML-identický.
- **Plná suita (node 22):** `npx vitest run` (očekávat **3 pre-existing fail** = bazar nav baseline; zbytek green), `npm run build` green.
- **Dev smoke** (`pkill astro dev` před spuštěním): `/slovnik/<slug>/` cs 200 (beze změny obsahu) + `/uk/slovnik/<slug>/` 200 s cyrilicí; po launchi `index,follow` + hreflang; chybějící uk slug → 404.

---

## 6. Hranice / YAGNI

- **Jen slovník UK.** Statistiky/dotace/půda = samostatný brainstorm/spec příště.
- **Nezavádět SK variantu** slovníku (slovník je CS-only; SK nemá a nepřidává se).
- CS výstup nesmí změnit (HTML-parita).
- Launch prefix `/slovnik` přidat až po review obsahu.
- Žádné nové widgety/featury slovníku — jen lokalizace stávajícího.

## 7. Konvence / prostředí

- Worktree `~/agro-svet-uk-faze4a-slovnik` + větev `feat/i18n-uk-faze4a-slovnik` z `master`; zkopírovat `.env` z `~/agro-svet/.env` (dev sitemap jinak 500).
- Node 22 (`nvm use 22`).
- Merge/PR až po schválení → push `master` → Coolify auto-deploy.
- `git push` přes token-in-URL: `git push "https://x-access-token:$(gh auth token)@github.com/matsamec-hash/agro-svet.git" …`.
- `pkill astro dev` před smoke.
