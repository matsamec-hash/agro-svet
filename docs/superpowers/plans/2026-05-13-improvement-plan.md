# Agro-svět — Improvement Plan (2026-05-13)

**Zdroj:** [Research artifact 2026-05-13](../specs/2026-05-13-improvement-research.md) (3 paralel deep-research agentů: live site audit + codebase audit + market/competitor research)

**Strategická pozice:** *"Wikipedie + kalkulačky pro české zemědělce"* — hyperfocus na encyklopedický hub + interaktivní nástroje. Nesoutěží s newsroom (mechanizaceweb), nesoutěží s bazarem (mascus).

---

## Sprint 1 — Critical bugs (1-2 dny, urgent)

Ztrácí traffic každý den. **Fix priority order:**

- [ ] **B1** Naplnit `news-sitemap.xml` o article URLs z Supabase `articles WHERE status='published'`, přidat `<news:publication_date>` + `<news:title>` — soubor `src/pages/news-sitemap.xml.ts`
- [ ] **B2** Přidat article URLs do hlavního `sitemap.xml.ts` (aktuálně jen 6 `/novinky/...` z 3 141 URL)
- [ ] **B3** Fix soft-404 na `/stroje/[brand]/[unknown-series]/[unknown-model]/` — `getStaticPaths()` v `src/pages/stroje/[brand]/[series]/[model]/index.astro` nesmí padat do `/stroje/` fallback. Audit normalize logic pro series slugs (`rada-8` vs `8r-series` vs `new-generation-10-series`)
- [ ] **B4** H1 fix:
  - `src/pages/stroje/traktory/index.astro` — Layout default `<h1>agro-svět.cz</h1>` přebíjí page-specific H1; explicit override
  - `src/pages/stroje/kombajny/index.astro` — H1 chybí úplně
  - `src/pages/stroje/[brand]/index.astro` — `<h1>{brand.name} — traktory a kombajny</h1>`
- [ ] **B5** Author byline:
  - Novinky: `<address class="author">Zpracováno redakcí agro-svět.cz <time datetime>...</time></address>` + `author` v JSON-LD jako `Organization`
  - Encyklopedie: stejně, plus `dateModified` z YAML `lastVerified`
- [ ] **B6** Remove `@type: [Place]` artifact z brand pages — leak placeholder dealer locator v `src/pages/stroje/[brand]/index.astro`
- [ ] **B7** **AI bots policy** — v Cloudflare dashboardu otevřít **PerplexityBot** + **Applebot-Extended** (citation traffic), nechat zablokované GPTBot/ClaudeBot/CCBot/Bytespider (training). Update `public/robots.txt` content-signals z `ai-train=no` na `search=yes,ai-train=no` (search=yes je signal pro AI citation crawl)

**Verify checklist po deployi:**
- `https://agro-svet.cz/news-sitemap.xml` ukazuje articles ✓
- Google Search Console → Sitemaps → submit oboje, počkat 7 dní na indexaci
- `curl -I https://agro-svet.cz/stroje/john-deere/rada-8/8r-410/` vrací 404
- Rich Results Test na `/novinky/[slug]/` + `/encyklopedie/[slug]/` + brand page → 0 errors

---

## Sprint 2 — Top 5 strategic wins (2 týdny)

### W1: Comparator `/srovnani/[a]-vs-[b]/` — **highest páka**
- Wrap existující `src/lib/competitor-finder.ts` do nové route
- Tabulka specs: power_hp / power_kw / year / engine / transmission / weight / cutting_width / typ_zavesu
- Generate **top 200 párů prerendered** z aktivních modelů (year_to=null), prioritize cross-brand same-power-class pairs
- `ItemList` schema + canonical ordering (alphabetical) → 301 reverse
- Effort: M (2-3 dny)

### W2: Filter UI na listing pages
- Komponenta `<ListingFilters>` s: power range slider (0-700 hp), year range (1990-2026), transmission select (CVT/manual/powershift), weight range
- Klient-side filter na Astro (data jsou v `cachedFlat` z `stroje.ts`)
- Aplikovat na: `/stroje/traktory/`, `/stroje/kombajny/`, `/stroje/[brand]/`
- Aktuální `BazarFilters` v `/bazar/` jako reference pattern
- Effort: M (3-4 dny)

### W3: Newsletter campaign sender
- **Blocker:** vyplnit GDPR placeholdery v `src/pages/zpracovani-osobnich-udaju.astro`:
  - `{{JMÉNO/NÁZEV}}` → Samec Digital s.r.o.
  - `{{IČ}}` → 29547539
  - `{{ADRESA}}` → Na Břehu 378, 387 11 Katovice
  - `{{DATUM}}` → 2026-05-13
- Create `scripts/send-newsletter.mjs`:
  - Query `newsletter_subscribers WHERE confirmed=true AND unsubscribed_at IS NULL AND site_id=<agro-svet>`
  - Resend rate-limit 2/sec free
  - Per-recipient `buildUnsubscribeUrl(token)` ✓ existuje
- Extend `src/lib/newsletter-email.ts`:
  - Add `renderDigestHtml({ articles, period })` helper (reuses style block, last 4 articles + perex + link)
- First digest: 4 nedávné článků + 2 nové encyklopedie + 1 promo (např. SZIF dotační průvodce)
- Effort: S (1 den po vyplnění GDPR)

### W4: Kalkulačka leasingu + Kalkulačka nákladů na hektar
- `/kalkulacka/leasing-traktor/` — vstupy: cena stroje, akontace %, doba (12-72 měs), úroková sazba % (preset za ČSOB Leasing, JD Financial, AGRI CS, AGROTEC); výstup: měsíční splátka + RPSN + total cost + comparison table
- `/kalkulacka/naklady-na-hektar/` — vstupy: typ stroje (z YAML), výkon HP, spotřeba l/hod, cena nafty Kč/l, plocha ha; výstup: Kč/ha provozní náklady
- Embeddable widget (iframe) pro affiliate partners
- Pillar article: "Leasing traktoru 2026: ČSOB vs JD Financial vs AGRI CS" (long-form, link na kalkulačku)
- Effort: M (2-3 dny)

### W5: 5 vlajkových encyklopedií modelů (rozjet content pipeline)
- Vybrat 1 model z top značek bez encyklopedie: Case IH (Magnum), Deutz-Fahr (9 Series), Kubota (M7-3), Valtra (T-Series), MF (8S)
- Template: 600-800 slov, FAQ ≥3, Article schema s author + dateModified, vlastní foto (ne reuse z Wikipedia)
- Effort: 5h per article (paralelizovatelné)

---

## Sprint 3 — Data & content infrastructure (měsíc 2)

### S3.1: Photo backfill pro 12 značek
- Bez fotek: Vaderstad, Pottinger, Manitou, Lemken, Kverneland, Kuhn, Krone, Joskin, JCB, Horsch, Bednar, Amazone
- Použít existující `scripts/<brand>-photos.mjs` pattern + `scripts/inject-photo-yaml.mjs`
- Zdroj: Wikimedia Commons (CC BY-SA 4.0, autor MarcelX42 / Agritechnica)
- Bez fotek brand pages nejedou do Google Discover ani AI Overviews
- Effort: M (1 týden, parallelizovatelné per brand)

### S3.2: Schema.org coverage doplnit
- `/stroje/[brand]/index.astro` — add Brand + Organization s `sameAs: [Wikipedia, oficiální brand site]`
- `/stroje/[brand]/[series]/index.astro` — add `ItemList` modelů
- `/plemena/[druh]/index.astro` — add `CollectionPage`
- `/plemena/index.astro` — add `CollectionPage` + 4 druhy as `Thing`
- `/plemena/[druh]/[plemeno]/` — add `image`, `additionalProperty` weight/height, `sameAs` Wikipedia
- `/novinky/index.astro` — add `ItemList` aktuálních článků
- Effort: S (2-3 dny)

### S3.3: 16 brand MD articles bulk
- Chybí: Amazone, Bednar, Case IH, Deutz-Fahr, Horsch, JCB, Joskin, Krone, Kubota, Kuhn, Kverneland, Lemken, Manitou, Pöttinger, Väderstad, Valtra
- Template: ~500 slov historie + nejvýznamnější modely + obrázek z S3.1
- Effort: M (8h per article, paralelizovatelné)

### S3.4: 17+ encyklopedie modelů
- Vlajkové z každé značky (po Sprint 2 W5 → cílit dalších 17)
- Effort: M (5h per article)

### S3.5: TypeScript hardening
- Přidat `image_url`, `image_credit_url`, `image_credit`, `image_license` do `StrojSeries` interface (`src/lib/stroje.ts:60`)
- Odebrat 8 výskytů `(s as any)` cast
- Zod-parse YAML při loadu pro fail-fast na špatných datech
- Effort: S (4h)

### S3.6: Performance pass
- `prerender = true` na `/stroje/[brand]/index.astro` (content se mění jen při YAML editu)
- `Cache-Control: s-maxage=300` na `/novinky/[slug].astro`
- `<link rel="preload" as="image">` pro homepage hero v `<head>`
- Font preload Chakra Petch 700 woff2
- Move 141 KB inline scripts z homepage do external `.js` s `defer`
- Sitemap `lastmod` per-URL (nikoli uniform)
- Image srcset/sizes na listing pages
- Effort: M (1-2 dny)

---

## Sprint 4 — Differentiators & monetization (měsíc 3)

### S4.1: Dealer locator `/prodejci/[okres]/`
- 22 brandů × ~14 krajů = matrix routes
- Data scrape z brand webů (deere.cz, agrotec.cz, strom.cz, topagri.cz)
- Schema `LocalBusiness` per dealer
- Lead-gen formulář "Mám zájem o tento model" → email + log do Supabase
- Affiliate-ready surface (provize 1-3 % nebo flat 1 500-5 000 Kč/lead)
- Effort: M (1 týden)

### S4.2: SZIF dotační kalendář
- `/dotace/szif-modernizace-farem-2026/` — pillar landing
- `/dotace/kalendar/` — interactive kalendář deadline výzev (data z szif.gov.cz)
- Sezónní traffic peak v jaro/podzim
- Affiliate: grantex.cz, ZD-Dotace.cz
- Effort: M (3-4 dny)

### S4.3: Video embeds pipeline
- Top 20 modelů: manuální curate YouTube reviews (TV Zemědělec, Mascus, Agriaffaires)
- `<iframe>` embed + `VideoObject` JSON-LD na encyklopedie detail
- Preconnect `https://www.youtube-nocookie.com`
- Effort: S (6h)

### S4.4: Topic glossary auto-link enhancement
- Add `.continue-here.md "H"` topic glossary entries do `auto-linker.ts`
- ~30 min implementation
- 44 % článků dnes 0 internal links
- Effort: XS (30 min)

### S4.5: Sponsored brand hubs (monetizace)
- Outreach Zetor/AGCO/CNH/Deere ČR — placený "expanded profile" 30-80 tis. Kč/rok
- Template: `/znacky/[slug]/?sponsored=true` s vlastním CTA, brožury, kontakt formulář
- Effort: M (3 dny + sales outreach time)

---

## Sprint 5+ — Long-term roadmap

- Reviews infra `/recenze/` (Supabase + moderation queue + GDPR review schema)
- Parts/díly affiliate `/dily/[brand]/` (TecAlliance, Agromex)
- Mobile app (PWA / Capacitor)
- White-label specs API (lectura-specs model)
- TikTok originální obsah (5 short videos/měs, "1 minute model review")
- Community / forum (kompletence s nasetraktory.eu — risk)
- Premium "AgriPro" subscription (CSV export, alerts, kalendář)
- EN varianta brand pages pro international audience (svetovestadiony Phase 11 EN pattern)

---

## High-opportunity articles (content backlog s odhadem SEO volume)

| Téma | Volume | Competition |
|---|---|---|
| "10 nejlepších kompaktních traktorů do 50 koní 2026 (recenze + ceny)" | vysoký | nízká (jen e-shopy) |
| "Kalkulačka: kolik stojí provoz traktoru ročně (Kč/ha)" | střední | **nulová CZ** |
| "Fendt e100 Vario — první elektrický traktor v ČR: review, dojezd, cena" | rostoucí | nízká |
| "Dotace SZIF Modernizace farem 2026: kompletní průvodce" | sezónní vysoký | jen SZIF PDF + grantex.cz |
| "Stage V: jaký traktor splní emisní normy 2026" | střední B2B | nízká |
| "John Deere Operations Center pro české farmáře: jak začít" | nízký volume | žádná v CZ |
| "Co kontrolovat při koupi ojetého traktoru — 30-bodový checklist + PDF" | vysoký | jediný thread na nasetraktory.eu |
| "Zetor Forterra vs Belarus 1221 vs NH T5 — souboj 110 HP" | nízký volume, vysoké conversions | nulová |
| "Leasing traktoru 2026: ČSOB vs JD Financial vs AGRI CS" | rostoucí | nízká |
| "Pluhy Kverneland vs Lemken vs Pöttinger — který pro jaké pole" | low-mid B2B | nulová |
| "Plemena masných krav v ČR: Aberdeen Angus vs Hereford vs Charolais (ekonomika)" | sezónní | částečně Wikipedia |
| "Precision farming pro malé farmy do 100 ha: GPS autosteer levně" | rostoucí | nulová v CZ |

---

## Doporučený start

**Tento týden:** Sprint 1 (kritické bugs B1-B7). Autonomní commit→push→deploy podle [autonomous push feedback](~/.claude/projects/-Users-matejsamec-Downloads/memory/feedback_autonomous_push.md).

**Příští 2 týdny:** Sprint 2 — Comparator (W1) + Filtry (W2) + Newsletter (W3 po GDPR) + Kalkulačky (W4) + 5 encyklopedií (W5).

**Měsíc 2:** Sprint 3 — Photo backfill + Schema gaps + 16 brand articles + perf pass.

**Měsíc 3:** Sprint 4 — Dealer locator + SZIF + Video + Sponsored.

---

## Sources / data points (z research)

- Live audit: agro-svet.cz home + 12 listing/detail pages, PageSpeed Insights, robots.txt + Cloudflare AI bot policy
- Codebase: `/Users/matejsamec/agro-svet/` Astro 6 + Cloudflare Workers, 22 brands × 2 564 modelů × 494 series × 78 plemen, build 21 s
- Competitors: mechanizaceweb.cz, agroportal24h.cz, mascus.cz, lectura-specs.com, tractordata.com, agriaffaires.com, mascus.com, farm-equipment.com, agroseznam.cz, traktorbazar.cz, strom.cz, nasetraktory.eu
- Trends: SZIF 2026, Stage V, Fendt e100 Vario, JD Operations Center, EU CAP post-2027
