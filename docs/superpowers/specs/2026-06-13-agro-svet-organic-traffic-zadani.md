# Zadání: Organický traffic pro agro-svet.cz

**Datum:** 2026-06-13
**Pro:** nové okno / fresh session
**Cíl:** zvýšit organický (SEO) traffic agro-svet.cz napříč obsahovými typy.
**Rozsah:** níže uvedené tracky #1–#5 + průřezové technické SEO. **VYNECHÁNO ZÁMĚRNĚ:** bazar / marketplace SEO (řeší se samostatně, je navázaný na auth incident a custom SMTP).

---

## Jak na to (postup)

Tohle je **menu tracků k realizaci**, ne jeden monolit. Každý track ber jako samostatný cyklus:

1. Vyber track (doporučené pořadí níže = dopad ÷ úsilí).
2. Spusť na něj **brainstorming** (superpowers) → spec → plán → exekuce.
3. Tracky #2/#4/#5 jsou nezávislé a dají se dělat v libovolném pořadí. Track #3 (UK) je velký samostatný projekt.
4. Průřezové technické SEO (sekce na konci) můžeš dělat jako quick-win kdykoliv mezi tím.

⚠️ **Nezačínej kódit bez brainstormu + schválené spec.** Tohle zadání je vstup do brainstormu, ne hotová spec.

---

## Stav repa (ověřeno 2026-06-13, grounded)

- **Framework:** Astro **6.4.4**, `output: 'server'`, adapter `@astrojs/node` (standalone). `trailingSlash: 'always'`.
- **Node:** **22** (`.nvmrc` = 22, `engines.node >=22.12.0`) → vždy `nvm use 22` před prací.
- **Deploy:** push na `master` → **Coolify auto-deploy** (po VPS migraci 2026-06-08). ⚠️ `package.json` skript `deploy` (`wrangler deploy …`) je **legacy/Cloudflare** a po migraci se nepoužívá — neřídit se jím.
- **Git push gotcha:** přes gh-helper visí → použít token-in-URL:
  `git push "https://x-access-token:$(gh auth token)@github.com/matsamec-hash/agro-svet.git" <branch>`
- **Data:** statický katalog strojů/značek v `src/content/*` + `src/lib/stroje.ts`; dynamický obsah (novinky, bazar) ze Supabase v sitemapě.
- **Tests:** vitest (`vitest.config.ts`), ~390+ testů. Build: `node scripts/build-og-images.mjs && astro build`.

### i18n (důležité pro každý track)
- Lokály: `cs` (default, bez prefixu), `sk` (plně nasazená), `uk` (ukrajinština).
- `src/i18n/utils.ts` → `LAUNCHED_PREFIXES`, `isLaunchedPath()`. Layout řídí `effectiveNoindex` + hreflang.
- **uk nasazeno jen pro:** `/stroje`, `/srovnani`, `/znacky`, `/encyklopedie`, `/jak-na-to`.
- **sk nasazeno pro:** výše + `/novinky`, `/kalkulacka`, `/dotace`, `/statistiky`, `/puda`, legal.
- Nenasazené sekce v daném lokálu = `noindex` (správně). Lock přebíjí launch.

### SEO infrastruktura (už existuje — stavět na ní, neznovuvymýšlet)
- `src/lib/structured-data.ts` (~670 řádků): Organization+WebSite (sitewide), BreadcrumbList, FAQPage, HowTo, Product/Vehicle, ItemList, Article, ExpertReview, VideoObject, Brand, LocalBusiness.
- `src/layouts/Layout.astro`: canonical, hreflang (podmíněně dle launch), robots/noindex, og:*, twitter, RSS, verification tokeny (Google/Bing/Seznam), OG fallback obrázky.
- Sitemapy: `src/pages/sitemap.xml.ts` (hlavní) + `src/pages/news-sitemap.xml.ts` (Google News, 48h). Image sitemap pro encyklopedie + znacky.

---

## Tracky (doporučené pořadí = dopad ÷ úsilí)

### #2 — Dotace / SZIF obsah  ⭐ TOP PRIORITA (vysoký dopad, střední úsilí)
**Proč:** čeští zemědělci masivně hledají dotace; vysoký objem + vysoká komerční/akční intence + opakující se sezónně.

**Stav:** kolekce `dotace` má jen **4 záznamy** (`src/content/dotace/`): investice 33.73, technologie 37.73, mladí zemědělci, zahájení činnosti 49.75. Schema je bohaté (intervence, %, strop, FAQ → FAQPage JSON-LD). Existuje master howto `src/content/howto/jak-naplanovat-dotaci-na-techniku.md`.

**Příležitost:**
- Rozšířit kolekci na **~8–12 titulů** (další SP SZP intervence — pokrýt to, co se reálně hledá).
- **Kalendář výzev / termínů** (kdy se podává, deadliny) — recurring evergreen, dává důvod k návratu + čerstvost.
- Eligibility / „kdo může žádat" + „jak vybrat dotaci podle typu stroje" rozcestníky.
- Prolinkování dotace ↔ stroje ↔ howto (rozhodovací funnel).
- ⚠️ Při psaní obsahu použít skill **`czech-ag-article-style`**.

---

### #4 — Srovnávací stránky „X vs Y" (střední–vysoký dopad, nízké–střední úsilí)
**Proč:** rozhodovací/komerční intence, nízká konkurence, **generovatelné z dat, co už máš**.

**Stav:** engine už běží. `src/pages/srovnani/[combo]/index.astro`, data z `src/lib/comparator.ts` (`topComparisonPairs(220)`, `expandedComparisonPairs(5000)`) + `src/lib/stroje.ts`. Emituje BreadcrumbList + ItemList + FAQPage. V sitemapě až 5000 párů.

**Příležitost (inkrementální, levné):**
- Rozšířit/zkvalitnit páry, které reálně mají hledanost (ne jen kombinatorika) — vybrat dle dat/intence.
- Obohatit verdikt/„TL;DR" + per-pár FAQ (krmí AI Overviews / featured snippets).
- Třídní srovnání („nejlepší traktor do 100 hp", „X vs Y ve třídě Z") jako mezikrok mezi hub a detailem.
- Cross-link do encyklopedie/značek.

---

### #5 — Sezónní obsahové huby (střední dopad, střední úsilí)
**Proč:** zemědělství je sezónní → opakované spiky (kdy sít, kdy sklízet, zimní příprava, jarní/podzimní práce). Existuje `kalendar-akci` infrastruktura (viz starší specs).

**Příležitost:** evergreen huby refreshované dle sezóny, navázané na howto (`src/content/howto/`, 12 záznamů) a novinky. Včelařský rok už jako vzor existuje (`vcelarsky-rok.md`).

---

### #3 — UK (ukrajinský) trh  (potenciálně obří dopad, VYSOKÉ úsilí — samostatný velký cyklus)
**Proč:** úplně nové publikum (domácí ukrajinský trh), bez tvojí konkurence.

**Stav:** UK foundation + fáze 2 (stroje/srovnání/značky/encyklopedie) + fáze 3 (jak-na-to) **nasazeny**. Chybí **jurisdikční data** (UAH dotace, ukrajinské statistiky, půda) — ta se musí VYTVOŘIT nově, nepřekládají se z CZ.

**Příležitost:** rozšířit launched prefixy o jurisdikční sekce s reálnými UA daty (dotace UA, statistiky UAH). **Pozor:** velký kus → vlastní brainstorm + spec, ne lumpovat s quick-winy. Slovník (206 hesel) je descopnutý z dřívějška — spec/plán už existují (`2026-06-08-…-jaknato-slovnik-design.md`).

---

## Průřezové technické SEO (quick-winy mezi tracky)

1. **SK/UK do hlavní sitemapy.** ⚠️ `sitemap.xml.ts` pokrývá **jen CS**. Nasazené SK/UK sekce nejsou v sitemapě → discovery gap. Doplnit `/sk/*` a `/uk/*` URL pro launched prefixy (respektovat `isLaunchedPath`).
2. **Answer-first leady** pro featured snippets / AI Overviews — zvážit u dotace/howto/srovnání (vzor: svetovestadiony má `buildAnswerFirstLead`).
3. **Core Web Vitals** ověřit na VPS Node origin (po migraci) — LCP/CLS, font preload už je.
4. **Hreflang/canonical audit** — ověřit reciprocitu a x-default po doplnění sitemapy.
5. **Rich snippets coverage** — projít, kde chybí FAQPage/HowTo/Breadcrumb a doplnit (infrastruktura v `structured-data.ts` existuje).

---

## Gotchas / lekce z prostředí

- `nvm use 22` vždy.
- Deploy = push `master` → Coolify; `wrangler` skript ignorovat.
- Git push přes token-in-URL (viz výše).
- Práce na větvi/worktree; merge/PR až po schválení (vzor předchozích cyklů).
- Obsah CZ/SK/UK: byte-parity testy hlídají, ať změna jednoho lokálu nerozbije ostatní — měnit cíleně.
- Psaní AG obsahu → skill `czech-ag-article-style`.

---

## Doporučený první krok pro nové okno

> „Začni trackem **#2 (Dotace/SZIF)** — spusť brainstorming, ulož spec do `docs/superpowers/specs/`, pak plán a exekuce. Drž se konvencí výše."
