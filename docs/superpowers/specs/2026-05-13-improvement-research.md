# Agro-svět — Deep Research & Improvement Audit

**Datum:** 2026-05-13
**Typ:** Research artifact (3 parallel deep-research agentů)
**Status:** Findings → konsolidováno do [plan dokumentu](../plans/2026-05-13-improvement-plan.md)

---

## Kontext

User požádal o deep research "co můžeme vylepšit na agro-svet.cz". Spuštěny 3 paralelní research agenti:

1. **Live site audit** — WebFetch + WebSearch na produkční web, SERP positioning, performance, accessibility, structured data validation
2. **Codebase audit** — `/Users/matejsamec/agro-svet/` data completeness (2 564 modelů, 494 series, 78 plemen), missing features, schema.org gaps, build perf
3. **Konkurence & market research** — mechanizaceweb, agroportal24h, mascus, tractordata, lectura-specs, feature-gap matrix, monetizace, content opportunities

---

## 1. Kritické bugs (urgent fixes — ztrácí traffic každý den)

| # | Problém | URL příklad | Impact | Effort |
|---|---|---|---|---|
| 1 | `news-sitemap.xml` **prázdný** (248 B, jen XML header) | `https://agro-svet.cz/news-sitemap.xml` | Google News + Discover ignoruje 100 % článků | 30 min |
| 2 | Články **nejsou v hlavním `sitemap.xml`** (3 141 URL, jen 6× `/novinky/`) | `https://agro-svet.cz/sitemap.xml` | 0 % articles indexovatelných | 30 min |
| 3 | **Soft-404**: vrací HTTP 200 + duplicit 584 KB katalog | `https://agro-svet.cz/stroje/john-deere/rada-8/8r-410/` | stovky duplicate-content URLs → Google penalty | 1-2 h |
| 4 | **H1 chybí** na listing pages | `/stroje/traktory/`, `/stroje/kombajny/`, `/stroje/[brand]/` (všechny brandy) | SEO basics fail; Layout default přebíjí page H1 | 30 min |
| 5 | **0 author byline** na článcích | `/novinky/jak-cesti-zemedelci-bojuji-s-klimatem/`, `/encyklopedie/john-deere-8r-410/` | E-E-A-T fail (NewsArticle schema deklaruje author ale HTML ne) | 1-2 h |
| 6 | **JSON-LD artifact `@type: [Place]`** | `/stroje/john-deere/`, `/fendt/`, `/case-ih/` | Schema validation error, placeholder leak | 15 min |
| 7 | **AI bots blokované přes Cloudflare** (ClaudeBot, GPTBot, CCBot, Google-Extended, Applebot-Extended, …) | – | 0 citation v ChatGPT/Claude/Perplexity/Apple Intelligence | strategic decision |

---

## 2. Data completeness (čísla)

| Pole | Pokrytí z 2 564 modelů | Status |
|---|---|---|
| `name` | 100 % | ✓ |
| `year_from` | 69 % (1 770) | medium gap |
| `year_to` | 41 % skončené, 723 aktivní | OK |
| `power_hp` | **58 % (1 494)** | 1 070 modelů bez výkonu = no FAQ, no competitor matching |
| `power_kw` | částečné | **dopočet build-time z hp × 0.7457** |
| `weight_kg` | **0.2 % (6 modelů!)** | critical gap |
| `description` | 22 % | weak |
| `image_url` (model) | **0 %** | jen series mají fotky |
| **Series s `image_url`** | **20.4 % (101/494)** | top problem |

**12 značek má 0 fotek** (žádná series s `image_url`): Vaderstad, Pottinger, Manitou, Lemken, Kverneland, Kuhn, Krone, Joskin, JCB, Horsch, Bednar, Amazone.

**Brand foto coverage** (series_count s image_url): Fendt 16, JD 15, MF 13, Kubota 11, Claas 10, Deutz-Fahr 9, Case IH 9, NH 8, Valtra 7, Zetor 4.

**Plemena:** 78 v YAML, **0 má `image_url`** v poli (fallback na `public/images/druhy/`).

---

## 3. Missing features (z codebase + competitor research)

| Feature | Effort | Páka | Note |
|---|---|---|---|
| **`/srovnani/<a>-vs-<b>/`** comparator | M | **High** | `competitor-finder.ts` už dělá heavy lifting; top-200 párů prerendered, žádný CZ konkurent to nemá |
| **Filtry na listing pages** (power slider, year, transmission, hmotnost) | M | **High** | `/stroje/traktory/` má 528 modelů a 0 filtrů; Mascus/Agriaffaires/lectura-specs mají rich sidebar |
| **Kalkulačka leasingu** + **kalkulačka nákladů na hektar** | M | **High** | Nulová CZ konkurence; affiliate magnet (ČSOB Leasing, JD Financial, AGRI CS) |
| **Newsletter campaign sender** | S | Medium-High | Pipeline hotová (Resend double opt-in), chybí jen `scripts/send-newsletter.mjs` + `renderDigestHtml()`; blocker = GDPR placeholdery |
| **Dealer locator** `/prodejci/[okres]/` | M | Medium | Affiliate-ready surface; data scrape z brand webů + `LocalBusiness` schema |
| **Reviews infra** `/recenze/` | L | Medium | Supabase tabulka + moderation queue + GDPR |
| **Parts/díly affiliate** `/dily/[brand]/` | L | High | TecAlliance, Agromex affiliate |
| **Topic glossary** (`.continue-here.md` "H") | S | Medium | ~30 min, 44 % článků dnes 0 linků |
| **Schema `HowTo` články** ("Jak nastavit pluh", "Jak seřídit secí stroj") | M | High | Voice search + AI Overviews |
| **`/glosar/[term]/`** definice wiki | M | Medium | Kombajn, secí stroj, GPS, autosteer, … |

---

## 4. Schema.org gaps

| Page | Aktuální | Chybí |
|---|---|---|
| `/` | Organization + WebSite ✓ | SiteNavigationElement |
| `/novinky/[slug]/` | NewsArticle ✓ | `author` explicit, `mainEntityOfPage`, `publisher` |
| `/novinky/index` | – | ItemList aktuálních článků |
| `/encyklopedie/[slug]/` | breadcrumb + Thing+Product + FAQ ✓ | Article schema (encyklopedie = article) |
| `/plemena/[druh]/[plemeno]/` | breadcrumb + Thing | `image`, `additionalProperty` weight/height, `sameAs` Wikipedia |
| `/plemena/[druh]/` | – | ItemList plemen |
| `/plemena/index` | – | CollectionPage + 4 druhy as Thing |
| `/znacky/[slug]/` | Organization + ItemList ✓ | OK |
| `/stroje/[brand]/` | (no schema) | Brand + Organization s `sameAs` |
| `/stroje/[brand]/[series]/` | breadcrumb | ItemList modelů |
| `/hledat` | – | SearchAction na `/` |

---

## 5. Content backlog

1. **16 značek bez MD článku** v `src/content/znacky/` (z 22 total — chybí Amazone, Bednar, Case IH, Deutz-Fahr, Horsch, JCB, Joskin, Krone, Kubota, Kuhn, Kverneland, Lemken, Manitou, Pöttinger, Väderstad, Valtra)
2. **Encyklopedie pokrývá jen 5/723 modelů (0.7 %)** — backlog vlajkových z každé značky = 22 quick articles
3. **Novinky stagnuje** — poslední commit do `src/content/novinky/` byl 2026-03-12 (8 týdnů ticho), 7 článků total, 2 001 slov dohromady
4. **Plemena content collection neexistuje** — 78 v YAML, **0 v `src/content/plemena/`**
5. **Holstein page = 307 slov, 1 img bez alt** — thin content threshold
6. **Žádné "vs" / "srovnání" articles** v `/novinky/` — SERP query "srovnání kombajnů 2026" obsazené mechanizaceweb + tipcars

### High-opportunity article ideas (low competition, growing demand)

- "10 nejlepších kompaktních traktorů do 50 koní 2026" — nulová konkurence
- "Kalkulačka: kolik stojí provoz traktoru ročně (Kč/ha)" — nulová CZ
- "Fendt e100 Vario — první elektrický traktor v ČR" — rostoucí 2026 trend
- "Dotace SZIF Modernizace farem 2026: kompletní průvodce na stroje" — sezónní vysoký volume
- "Stage V emisní normy: jaký traktor je splní" — B2B
- "John Deere Operations Center pro české farmáře: jak začít" — žádná CZ
- "Co kontrolovat při koupi ojetého traktoru — 30-bodový checklist + PDF" — vysoký B2C volume
- "Zetor Forterra vs Belarus 1221 vs NH T5 — souboj 110 HP" — long-tail
- "Leasing traktoru 2026: ČSOB vs JD Financial vs AGRI CS"
- "Pluhy Kverneland vs Lemken vs Pöttinger — který pro jaké pole"
- "Plemena masných krav v ČR: Aberdeen Angus vs Hereford vs Charolais (ekonomika)"
- "Precision farming pro malé farmy do 100 ha: GPS autosteer levně"

---

## 6. Competitive landscape

### CZ Editorial / content
- **mechanizaceweb.cz** (Profi Press) — autorita v editorialu, vlastní redakce, TV embedy, předplatné. Nemá: specs DB, comparator, calculators
- **agroportal24h.cz** — print + web + sociální, foto/video
- **agromanual.cz** — agronomický fokus (postřiky)
- **zemedelec.cz** — Profi Press sister site
- **agroweb.cz** — Profi Press

### CZ Marketplace
- **agroseznam.cz**, **mascus.cz** (36.9K návštěv vs agroseznam 11.7K), **agriaffaires.cz** (Price Observatory!), **truck1.cz**, **bazos.cz/stroje**
- Dealer marketplaces: **traktorbazar.cz** (AGROTEC), **strom.cz/pouzite** (STROM Praha)

### CZ Community
- **nasetraktory.eu** — jediné aktivní forum

### EN benchmarks
- **tractordata.com** — referenční DB, 18 256 traktorů, value guides, owner manuals, forum, /compare/
- **lectura-specs.com** — global comparator, datasheety s rozměrovými skicami
- **agriaffaires.com** — 15K denně nových inzerátů, **Price Observatory** unique
- **farm-equipment.com** — magazín + 2000 videí + podcasts
- **mascus.com** — comparator s favorites, alerts, mobile app

### Feature-gap matrix

| Feature | agro-svet | mechanizaceweb | agroportal24h | tractordata | lectura-specs |
|---|---|---|---|---|---|
| Specs database | částečné | – | – | **plné** | **plné** |
| Comparison tool | **❌** | – | – | ✓ | ✓ |
| Marketplace / bazar | malý (`/bazar/`) | – | – | value guide | – |
| User reviews | – | – | – | forum | – |
| Video embeds | – | **✓ TV** | ✓ | – | – |
| Photo gallery per model | částečné | ✓ | ✓ | **✓** | ✓ |
| Newsletter | **✓** | ✓ | ✓ | ✓ | ✓ |
| Encyklopedie značek | **✓ (22)** | částečné | – | ✓ | ✓ |
| **Plemena / živočišná** | **✓ (78)** unikátní | – | – | – | – |
| **CZSO/Eurostat statistika** | **✓** unikátní | – | – | – | – |
| Mobile app | – | částečné | – | – | – |
| Calculators | – | – | – | value guide | – |
| News / magazine | částečné | **✓** | **✓** | – | – |
| Dealer locator | – | – | – | ✓ | – |
| Community / forum | – | – | – | **✓** | – |
| AI features | – | – | – | – | – |

---

## 7. AI / SGE positioning

**Současný stav:** Cloudflare blokuje **všechny** AI crawlery (ClaudeBot, GPTBot, CCBot, Amazonbot, Applebot-Extended, Bytespider, Google-Extended, meta-externalagent) + `content-signals: ai-train=no`.

**Důsledek:**
- 0 citation v ChatGPT, Claude, Perplexity, Gemini, Apple Intelligence
- Strukturálně mimo AI search ecosystem (-61 % CTR Google AI Overviews podle Dataslayer studie 2025)

**Strategický kompromis (doporučení):**
- ✅ Otevřít **PerplexityBot** (~30 % citation rate pro CS queries)
- ✅ Otevřít **Applebot-Extended** (Apple Intelligence + Siri Smart Search, ~25 % iOS user base v ČR)
- ❌ GPTBot/ClaudeBot zatím blocked (training, no immediate citation value)
- ⚠️ V CF dashboardu: "Block AI Search" by mělo být **OFF**, zatímco "Block AI Training" může zůstat ON

---

## 8. Performance findings

- `/novinky/[slug].astro` SSR pokaždé, **cache header chybí** (na index je 60s SWR) — doporučení: 5 min `s-maxage`
- `/stroje/[brand]/index.astro` je `prerender = false` — content se mění jen při YAML editu, switch na `prerender = true` ušetří ~22 Worker invocations/min při peak
- **Image srcset chybí** — `<img>` v listing pages bez `srcset/sizes`; CF Images / Astro `<Image>` by ušetřila 30-50 % bytes na mobile
- **Homepage: 141 KB inline scripts** (10 inline `<script>`) — move do external `.js` s `defer`
- **Hero image:** `fetchpriority="high"` ✓, ale `<link rel="preload" as="image">` chybí v `<head>` → LCP win 200-400 ms
- **0 font preload** — Chakra Petch self-hosted ale není preloaded → CLS win
- **Sitemap lastmod = uniform 2026-05-02** pro všech 3 000 URL → signal "static dataset"; přepočítat lastmod jen pro affected URLs při edit
- **Build 21 s** rozumný (14.84s = CF adapter postprocess, nezměnitelné)

---

## 9. Strategická pozice — kde má agro-svět obhájené území

**2 unikátní equity** které nikdo jiný v CZ nemá:
1. **Encyklopedie značek 22 + plemena 78** (mechanizaceweb je redakce, ne katalog)
2. **CZSO/Eurostat statistika** (žádný konkurent)

**Doporučená pozice:** *"Wikipedie + kalkulačky pro české zemědělce"*

Nesoutěží s newsroomem (mechanizaceweb), nesoutěží s bazarem (mascus). Páka: existující 528 modelů + 78 plemen + statistika.

---

## 10. Monetization ideas (z research)

1. **Dealer affiliate / lead-gen formulář** — "Mám zájem o tento model" na detailu, přepošle STROM Praha, AGRI CS, AGROTEC, TOPAGRI. Provize 1-3 % nebo flat 1 500-5 000 Kč/lead
2. **Sponsored brand hubs** — Zetor/AGCO/CNH placený "expanded profile" (Profi Press model: 30-80 tis. Kč/rok/značka)
3. **Newsletter sponsoring** — 1 paid slot/issue (Mascus, AGROTEC, ČSOB Leasing): 5-15 tis. Kč/issue
4. **Premium "AgriPro" subscription** — comparator CSV export, dotační kalendář s push, price drop alerts na partnerských bazarech: 199 Kč/měs
5. **White-label specs API** — dealer weby pullují specs proti měsíčnímu fee (lectura-specs model)
6. **Display ads (Sklik/Adsense)** — baseline, CPM 30-80 Kč v CZ agri
7. **Affiliate Heureka / arecenze** — zahradní traktory (Cub Cadet, Alpina) long-tail
8. **Sponsored comparison advertorial** — "Test 5 traktorů třídy 200 HP" partnerem

---

## 11. Risks / threats

1. **Profi Press buduje vlastní specs DB / comparator** — mají redakci, kapitál, časopis
2. **Mascus / Agriaffaires lokalizace v ČR** — Agriaffaires Price Observatory plně lokalizovaný ukradne research-intent
3. **Google AI Overviews killing CTR** (-61 %) — bez snippet position organic traffic padá
4. **Výrobce content hubs** (deere.cz, fendt.com) — výrobci poskytují canonical specs zdroj
5. **EU CAP změny 2026** — pokud dotační kalkulačka špatně, brand damage
6. **nasetraktory.eu má organickou komunitní důvěru** — community feature na agro-svet bude bojovat o pozornost

---

## 12. Wikipedia citation candidates (outreach)

- `cs.wikipedia.org/wiki/Deere_&_Company` — chudé na modely
- `cs.wikipedia.org/wiki/Zetor` — robust, ale tabulka modelů out-of-date po Forterra HD novinkách
- `cs.wikipedia.org/wiki/Zemědělství_v_Česku` — ekonomika a stroje sekce slabá
- Plemena (Aberdeen-Angus, Hereford, Charolais) — limitované zdroje

**Watch:** Wikipedia revertuje "promotional" linky; preferuj citation jako reference v textu (faktická data: výroba, model years), ne externí link section.

---

## 13. Czech agri YouTube/TikTok pro embed (no own production needed)

- **TV Zemědělec** (Profi Press) — YouTube + tvzemedelec.cz, weekly TV reports
- **TRAKTOR TV** (Karel Ferda) — YouTube long-runner
- **Farma Česko** (TV Nova reality) — pop culture
- **Mascus International** — per-model demos
- **Farmárska Revue Official** (SK) — jazyk OK pro CZ čtenáře

CZ TikTok agri scéna je tenká → **TikTok play je oportunita pro originální obsah** (short formats "1 minute model review")

---

## Reference

- Project memory: `~/.claude/projects/-Users-matejsamec-Downloads/memory/project_agro_svet.md`
- Continue-here: `/Users/matejsamec/agro-svet/.continue-here.md`
- Sprint plán: [docs/superpowers/plans/2026-05-13-improvement-plan.md](../plans/2026-05-13-improvement-plan.md)
