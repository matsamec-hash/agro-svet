# agro-svet.cz — UK (ukrajinská) lokalizace: ZADÁNÍ pro fáze 2 + 3 + 4

**Datum:** 2026-06-07
**Pro:** další kontextové okno (handoff)
**Repo:** `~/agro-svet` (Astro 6 SSR + Cloudflare + Supabase)
**Stav:** Foundation (fáze 1) HOTOVÁ + mergnutá do `master` (`e43d81f`, **nepushnuto na GitHub**).

---

## 0. Kontext a strategické rozhodnutí (NEMĚNIT bez uživatele)

Site má 3 lokále: `cs` (default, bez prefixu), `sk`, `uk`. **`uk` = Українська (ukrajinština)**, NE angličtina — uživatel říká „UK verze" a myslí ukrajinskou.

**Publikum /uk = Ukrajina (domácí trh)** (rozhodnuto 2026-06-07). Důsledek pro „přeložit vs vytvořit nové":
- **Jazyk / próza / UI** → přeložit do ukrajinštiny.
- **Jurisdikčně vázaná DATA** (dotace, statistiky, ceny půdy, legislativa) → **NEPŘEKLÁDAT česká data, ale VYTVOŘIT ukrajinská** (UAH, ukrajinské úřady/právo). To je velký research (fáze 4).

**Tvrdé i18n pravidlo:** CZ výstup se NESMÍ obsahově změnit. Ověřovat buildem/živě.

**Precedent = SK lokalizace** (rozsáhle hotová, vzor). Specy v `docs/superpowers/specs/2026-06-0[34]-agro-svet-i18n-*-sk-design.md`. SK postupovala fázovaně 2a novinky → 2b kalkulačky/dotace/půda/statistiky → 2c legal, každá vlastní branch `feat/i18n-sk-*`.

---

## 1. Co je HOTOVÉ (fáze 1 — Foundation)

Commit `e43d81f` na `master`:
- **`src/i18n/ui/uk.ts`** — plná parita s `cs.ts` (~770 klíčů ukrajinsky). Nav, footer, 404, cookie, katalog, srovnání, encyklopedie chrome, návody chrome, detail strojů chrome, statistiky/půda chrome. Zachovány `{tokeny}`, HTML entity, URL, brand `agro-svět.cz`.
- **`src/i18n/utils.ts` `plural()`** — východoslovanská pravidla pro `uk` (one = n%10==1 & n%100≠11; few = n%10∈2..4 & n%100∉12..14; many = zbytek). cs/sk beze změny.
- **Testy** (359 zelené): `tests/i18n/plural.test.ts` (7 uk case), `tests/i18n/ui.test.ts` (fallback mechanismus simulací cs-only klíče), `tests/i18n/ui-full.test.ts` (uk parita klíčů + token parita + Cyrilice).

**DŮLEŽITÉ:** `uk.ts` přeložilo jen **UI chrome**. **Těla stránek** (popisy plodin/plemen, encyklopedie, články, návody) jdou z dat/DB a jsou **STÁLE ČESKY**. Proto všechny `/uk` stránky zůstávají **noindex** — viz §2.

---

## 2. Klíčová architektura (orientace)

### 2.1 i18n slovníky a překlad
- `src/i18n/config.ts` — `locales = ['cs','sk','uk']`, `defaultLocale='cs'`.
- `src/i18n/ui/{cs,sk,uk}.ts` + `index.ts`. `t(locale,key)` fallback locale→cs→key. `tf()` interpolace. `plural()`.
- `src/i18n/nav.ts`:
  - `HIDDEN_SECTIONS['uk'] = ['data','bazar','photo']` — celá sekce Data (dotace/statistiky/půda/kalkulačky) je pro /uk skrytá v nav.
  - `HIDDEN_NEWS_CATEGORIES['uk'] = ['dotace','legislativa']` — skryté novinkové kategorie.
  - `LOCKED_SECTION_PREFIXES = []` (prázdné — SK vše odemklo). `getNav()`/`getFooterColumns()` filtrují.

### 2.2 Routing + indexovatelnost (TADY JE PRÁCE PRO „VYPNUTÍ NOINDEX")
- `src/i18n/utils.ts`:
  - `SK_LAUNCHED_PREFIXES` + `isSkLaunchedPath()` — **SK-specifické**, ale dnes je používá i `navHref()`/`langSwitchHref()` pro VŠECHNY non-cs locale (tj. i uk). ⚠️ **Potřeba zobecnit na per-locale** (`LAUNCHED_PREFIXES: Record<Locale, string[]>` + `isLaunchedPath(locale, path)`).
  - `navHref(locale, href)` — přidá `/uk` prefix jen u launchnutých cest.
  - `langSwitchHref()` — přepínač jazyka; nelaunchnuté cesty → lokalizovaný hub místo 404.
- `src/middleware.ts` — pro non-cs locale rewrite na cs routu (`next(strippedPath)`); `isLockedSectionPath` redirect (dnes no-op, prefixy prázdné).
- **`src/layouts/Layout.astro:72-73`** — JÁDRO noindexu:
  ```ts
  const skLaunched = isSkLaunchedPath(csRootPath) && !isLockedSectionPath(csRootPath);
  const effectiveNoindex = noindex || (locale === 'sk' ? !skLaunched : locale !== 'cs');
  ```
  → pro `uk` je `locale !== 'cs'` true → **vše noindex**. **Pro vypnutí noindexu u uk:** rozšířit na per-locale launched gating, např.:
  ```ts
  const launched = isLaunchedPath(locale, csRootPath) && !isLockedSectionPath(csRootPath);
  const effectiveNoindex = noindex || (locale === 'cs' ? false : !launched);
  ```
- **`src/pages/sitemap.xml.ts:412`** — taky používá `isSkLaunchedPath`; po zobecnění generovat /uk URL jen pro launchnuté+přeložené sekce.
- **hreflang** `getAlternates()` v utils.ts — emituje cs/sk/uk alternates; OK, ale indexovat jen launchnuté.

**PRAVIDLO indexace (mirror SK):** sekci `/uk/<x>` zapnout do `UK_LAUNCHED_PREFIXES` (= indexovatelná) **TEPRVE až je přeložené i TĚLO** (próza/data), ne jen chrome. Jinak Google indexuje míchaný CZ obsah pod /uk = SEO škoda.

### 2.3 Zdroje obsahu (co a jak přeložit ve fázi 2)
| Sekce | Cesta | Zdroj obsahu | Jak lokalizovat |
|---|---|---|---|
| Plodiny a odrůdy | `/plodiny/` | `src/data/plodiny/*.yaml` (18 plodin) + odrůdy z importu | Paralelní uk YAML NEBO i18n overlay vrstva. Próza `description`/`enrichment`. |
| Plemena | `/plemena/` | `src/data/plemena/*.yaml` | dtto |
| Včelařství | `/vcelarstvi/` | `src/data/vcelarstvi/*.yaml` | dtto |
| Chov hlemýžďů | `/chov-hlemyzdu/` | `src/data/hlemyzdi.json` (+ `src/lib/hlemyzdi.ts`) | dtto |
| Jak na to | `/jak-na-to/` | Astro content collection (MD/MDX) | uk varianta kolekce / přeložené MD. |
| Encyklopedie strojů | `/encyklopedie/` | data/kolekce | próza popisů, verdikt, FAQ. |
| Novinky (články) | `/novinky/` | Supabase `articles` + **`article_translations`** | naplnit uk řádky přes CMS (viz §2.4). |
| Stroje katalog/detail | `/stroje/`, `/srovnani/`, `/znacky/` | data (katalog) + chrome | Chrome HOTOVÝ. Detail má i prózu (lede/FAQ/useCase) z dat — přeložit. |

### 2.4 Články (Supabase overlay) — infra HOTOVÁ
- `src/lib/articles-i18n.ts`: `overlayArticle(cs, tr)`, `hasTranslatedTitle()`, `fetchArticleTranslations(supabase, ids, locale)`. Tabulka **`article_translations`** (content-network CMS migration 040), sdílená Supabase `obhypfuzmknvmknskdwh` (self-host `supabase.samecdigital.com`). Overlay pole: title/perex/content/seo_title/seo_description. Slug se NEpřekládá (URL = cs slug).
- Listing/related/sitemap zobrazují jen články s `hasTranslatedTitle` v daném locale (skrytí nepřeložených).
- **Práce:** vytvořit uk překlady článků v CMS (`article_translations` rows, `locale='uk'`). MCP NEMÁ přístup k `obhypfuzmknvmknskdwh` → přes CMS UI nebo SQL editor.

### 2.5 Měna / formátování (fáze 4)
- Dnes ceny v Kč (statistiky/půda). Pro UA data = **UAH (₴)**. Přidat locale-aware formátování měny (uk → UAH). Plural už hotov.

---

## 3. FÁZE 2 — Obsah (pure překlad, bez jurisdikce)

**Cíl:** přeložit do ukrajinštiny obsahová těla netýkající se jurisdikce; per-sekci zapnout indexaci.

**Doporučené pořadí (od nejvíc „chrome-hotových"):**
1. **Stroje / srovnání / značky** — chrome hotový; doplnit přeložit prózu z dat (lede, FAQ, useCase, verdikt). Pak `UK_LAUNCHED_PREFIXES += ['/stroje','/srovnani','/znacky','/encyklopedie']`.
2. **Plodiny a odrůdy** (`/plodiny/`) + **Plemena** + **Včelařství** + **Chov hlemýžďů** — statická YAML/JSON data → uk varianty. Velký objem prózy (long-tail SEO). Pak launch.
3. **Jak na to** (`/jak-na-to/`) — content collection → uk MD.
4. **Novinky/články** — naplnit `article_translations` uk; listing se sám odemkne pro přeložené.

**Architektonické rozhodnutí k vyřešení na začátku fáze 2:** jak lokalizovat statická YAML data (`plodiny`/`plemena`/`vcelarstvi`) — (A) paralelní `src/data/<sekce>.uk/*.yaml` + locale-aware loader, nebo (B) inline `{ cs: ..., uk: ... }` v jednom souboru, nebo (C) overlay JSON. Zvážit vzor, jakým SK řešilo obsahové sekce. **Doporučení: prozkoumat, jak SK lokalizovalo `/puda`/`/statistiky` obsah** (spec `2026-06-04-...-puda-sk-design.md`) a držet stejný vzor.

**Definition of done (každá sekce):** uk tělo přeloženo → přidáno do `UK_LAUNCHED_PREFIXES` → `Layout` emituje `index,follow` jen pro launchnuté → sitemap obsahuje /uk URL → hreflang reciproční → build OK → živý smoke (200, ukrajinský obsah, ne CZ).

---

## 4. FÁZE 3 — Legal (4 stránky)

**Stránky:** `src/pages/{podminky-pouziti,zpracovani-osobnich-udaju,dsa-kontakt,redakce}.astro`. (Mimo: `fotosoutez/gdpr.astro` — `photo` je pro uk skryté.)

**Vzor:** SK legal spec `2026-06-04-agro-svet-i18n-faze2c-legal-sk-design.md` (Option A: locale-branched inline JSX, `prerender=false`, `{isUk ? <uk JSX> : <cs JSX VERBATIM>}`).

**Jurisdikční přístup (POZOR — uk je Ukrajina-domácí, jiné než SK):**
- **Provozovatel zůstává Samec Digital s.r.o., IČO 29547539 (CZ subjekt)** → GDPR (2016/679) + zák. 110/2019 Sb. jako právní základ, vedoucí úřad ÚOOÚ (CZ).
- **RESEARCH NUTNÝ:** Ukrajina není EU. Pro ukrajinské publikum zvážit doplněk dle **Закону України «Про захист персональних даних»** + zmínka úřadu (Уповноважений ВРУ з прав людини / майбутній profilní úřad). Ověřit, zda CZ provozovatel servírující obsah ukrajinskému publiku má povinnosti dle UA práva (extrateritorialita). **Nepřepisovat na UA právo — přeložit CZ základ + přidat UA kontaktní/informační doplněk** (legálně bezpečné, jako SK přidalo SK úřad).
- `dsa-kontakt`: DSA = EU nařízení → překlad, kontakty beze změny.
- `redakce`: čistý překlad.

**i18n stringy:** footer/CookieConsent/Newsletter legal odkazy zlokalizovat (`navHref`). QA na CZ-kontaminaci.

---

## 5. FÁZE 4 — Jurisdikční data = NOVÁ ukrajinská (největší research)

Dnes skryté: `HIDDEN_SECTIONS['uk']=['data',...]`, `HIDDEN_NEWS_CATEGORIES['uk']=['dotace','legislativa']`. Odemknout AŽ po vytvoření UA dat.

| Balík | CZ sekce | UA zdroj dat | Měna |
|---|---|---|---|
| **A. Dotace** | `/dotace` + `/kalkulacka/dotace-cap` | Мінагрополітики / Держагентство, **ПРРУ** (Держ. аграрний реєстр), per-ha підтримка; Ukrajina = kandidát EU → budoucí CAP alignment | UAH ₴ |
| **B. Statistiky** | `/statistiky` | **Держстат України** (ukrstat.gov.ua) — ціни, врожай, поголів’я | UAH / — |
| **C. Ціна землі** | `/puda` | Ринок землі (мораторій знятий 07/2021), ціни UAH/га, земельна реформа | UAH ₴ |

**Pozn.:** ukrajinské dotační/statistické schéma se STRUKTURNĚ liší od CZ — není to výměna konstant (jako SK ≠ CZ). Každý balík vlastní research + spec + plán (mirror SK 2b).

**Po vytvoření UA dat:** odebrat `data` z `HIDDEN_SECTIONS['uk']`; přidat sekce do `UK_LAUNCHED_PREFIXES`; přidat UAH formátování; zvážit odemčení novinkových kategorií `dotace`/`legislativa` pro uk (jen s UA obsahem).

---

## 6. Provozní lekce (agro-svet — KRITICKÉ)

- **Deploy:** `nvm use 22` (Node v22.22.2) → `npm run build && npm run deploy` (deploy NEdělá build!). Cloudflare Workers (wrangler).
- **Git:** NIKDY `git add -A` — vtáhne `.env.save` (secrets → GitHub push protection). Přidávat soubory explicitně. Push: `/usr/bin/git -c credential.helper='!gh auth git-credential' push`.
- **Working tree:** může mít necommitnuté cizí změny (i18n WIP, stashe) — `git status | head` ořezává! Před deployem cíleně `git stash`. Aktuálně necommitnutá `.gitignore` security-hardening (ne z i18n).
- **Supabase MCP NEMÁ přístup** k `obhypfuzmknvmknskdwh` → DDL/data ručně přes SQL editor nebo CMS.
- **Autoritativní verifikace = build (Node 22) + živý smoke.** Sandbox neresolvuje .cz → `curl --resolve agro-svet.cz:443:<IP>`.
- Testy: `npx vitest run` (359 baseline). i18n testy `tests/i18n/`.

---

## 7. První kroky dalšího okna

1. Načíst paměť `project-agro-svet-uk-ukrajinska-lokalizace.md` + tento zadání.
2. Rozhodnout vzor lokalizace statických YAML dat (§3) — prozkoumat SK obsahové sekce.
3. **Začít fází 2 sekcí „stroje/srovnání/značky"** (nejmenší zbytek po chrome) NEBO dle priority uživatele (long-tail SEO → plodiny).
4. Per-sekci: přeložit tělo → zobecnit `isLaunchedPath` per-locale → přidat do `UK_LAUNCHED_PREFIXES` → Layout/sitemap/nav → build → smoke.
5. Použít superpowers (brainstorming/writing-plans/TDD/subagent-driven) jako u SK.
