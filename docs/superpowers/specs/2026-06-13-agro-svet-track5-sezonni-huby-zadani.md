# Zadání: Sezónní obsahové huby (Track #5 organic-traffic)

**Datum:** 2026-06-13
**Pro:** nové okno / fresh session
**Track:** #5 z `2026-06-13-agro-svet-organic-traffic-zadani.md`
**Cíl:** Zachytit sezónní (opakované) vyhledávací spiky v zemědělství evergreen obsahovými huby, které agregují obsah, co už v repu existuje (howto + plodiny + akce), do rozcestníků refreshovaných dle sezóny.

⚠️ **Tohle je vstup do brainstormu, ne hotová spec.** Nezačínej kódit bez `superpowers:brainstorming` → schválená spec → plán → exekuce. Drž konvence z hlavního organic-traffic zadání (Node 22 `nvm use 22`, deploy = push `master` → Coolify, git push token-in-URL, práce na worktree/větvi, merge/PR až po schválení, byte-parity testy hlídají cs/sk/uk).

---

## Proč (příležitost)

Zemědělství je sezónní → uživatelé opakovaně hledají „kdy sít X", „jarní práce na poli", „podzimní příprava půdy", „co dělat na zahradě v dubnu". Tyhle dotazy mají **recurring spiky** (každý rok znovu) a **rozhodovací intenci**. Web má rozdrobený obsah, který tyhle dotazy uspokojí, ale **chybí agregační/rozcestníková vrstva**, která by ho spojila do sezónního příběhu a dala důvod k návratu + čerstvost (recrawl signál).

## Co už v repu je (grounded, ověřeno 2026-06-13)

- **`vcelarsky-rok.md` = funkční proof-of-concept** sezónního huba. `src/content/howto/vcelarsky-rok.md` — jedna dlouhá HowTo stránka se 7 kroky měsíc-po-měsíci (zimní klid → předjaří → jarní/letní snůška → letní ošetření → podzimní krmení → zimní klid) + 7 FAQ + `relatedUrl: /vcelarstvi/`. Cross-linkuje na jednotlivé task-howto (`boj-s-varroazou`, `zazimovani-vcelstev`). **Toto je vzor, na kterém stavět.**
- **howto kolekce (12 záznamů)**, schema `src/content.config.ts:204–246` (`title, slug, description, datePublished, lastVerified, totalTime ISO8601, obtiznost, tools[], supplies[], steps[{name,text}], faq[{q,a}], relatedUrl?, relatedLabel?`). Routes `src/pages/jak-na-to/{index,[slug]}.astro`. **Launched cs + sk + uk** (kolekce `howto`/`howtoSk`/`howtoUk`). Relevantní strojové howto: `jak-nastavit-seci-stroj`, `jak-seridit-pluh`, `jak-vybrat-traktor-pro-malou-farmu`.
- **plodiny: 18 plodin s reálnými sezónními daty.** `src/data/plodiny/*.yaml` — pole `vysevek` (termín+dávka výsevu), `sklizen` (sklizňové okno), `hnojeni` (N/P/K plán), `osevni_postup` (5–6 kroků s časováním), `vynos_t_ha`, `choroby`, `faq`. Hub `src/pages/plodiny/index.astro` (grupováno dle čeledi). + odrůdy z ÚKZÚZ registru (`src/data/plodiny/odrudy/*.json`). **NENÍ launched v sk/uk** (CZ-jurisdikční ÚKZÚZ data). → Tato data jsou **těžitelný crop-calendar** (kdy sít/sklízet co).
- **akce (kalendář akcí):** Supabase tabulka `akce`, route `src/pages/akce/index.astro` (SSR), `src/lib/akce-hub.ts` má `groupByMonth()`/`buildMonthGrid()`/`upcomingMonths()` (znovupoužitelná měsíční logika). **NENÍ launched sk/uk.** User-submitted eventy (tržnice/polní dny), žádná pre-agregace dle plodiny.
- **Hub vzor (card grid):** `src/pages/vcelarstvi/index.astro` — hero + grid hub-karet linkujících na podsekce + `BreadcrumbList` + `CollectionPage`/`ItemList` JSON-LD. Reusable layout.
- **SEO building blocks:** `src/lib/structured-data.ts` — `breadcrumbSchema`, `itemListSchema`, `howToSchema`, `faqPageSchema`. Sitemap `src/pages/sitemap.xml.ts` (nové stránky přidat ručně do staticPaths nebo iterací; sk/uk mirror řeší `skMirror`/`ukMirror` dle launched prefixů).

## Co chybí (co by track stavěl)

1. **Agregační/rozcestníková vrstva** spojující existující obsah do sezónního příběhu. (vcelarsky-rok je jednorázová dlouhá stránka, ne hub linkující dál.)
2. **Sezónní metadata** — howto schema nemá `season`/`month`/`seasonal_tags`. Plodiny mají časování v próze (`vysevek: "konec března–polovina dubna"`), ne strojově filtrovatelně.
3. **Sezónní landing copy** + interní prolinkování (hub → relevantní howto → plodiny s termíny → stroje funnel).

## Nápady k probrání v brainstormu (NE rozhodnuto)

- **Sezónní rozcestníky** `co dělat na poli` — buď 4 sezóny (jaro/léto/podzim/zima) nebo 12 měsíců, každý agreguje: relevantní polní práce (link na howto), které plodiny se teď sejí/sklízejí (link na `/plodiny/{slug}/` + vytažený termín z YAML), nadcházející akce (z `akce` Supabase, měsíční filtr). Evergreen URL, obsah se „refreshuje" dle aktuálního měsíce → recrawl + návratnost.
- **Crop-calendar hub** „kdy sít a sklízet" — tabulka/timeline z `plodiny/*.yaml` (`vysevek`/`sklizen`), strukturovaná data → ItemList/FAQ JSON-LD. Vysoká informační hodnota, čistě z existujících dat.
- **Rozšířit vcelarsky-rok vzor** na další roční cykly (zemědělský rok, zahradní rok) jako dlouhé HowTo + cross-linky.
- **Answer-first lead** pro featured snippets (vzor svetovestadiony `buildAnswerFirstLead`) — „V dubnu se na poli seje jarní ječmen, cukrovka a…".

## i18n úvaha (důležité pro scoping)
- howto je launched cs/sk/uk → hub postavený **jen na howto** může jít vícejazyčně.
- plodiny + akce jsou **cs-only** → hub agregující crop-calendar/akce je **CS-first** (a to je v pořádku — sezónní kalendář je silně CZ-jurisdikční: české klima, ÚKZÚZ termíny). Doporučený scope: **začít CS**, sk/uk neřešit (konzistentní s tím, že plodiny nejsou launched).

## Hranice / YAGNI (k potvrzení v brainstormu)
- Nebudovat dynamické alerty/e-maily, akce↔plodiny realtime sync, regionální/fenologickou přesnost — to je overbuild. Cíl = statický evergreen hub z existujících dat.
- Needuplikovat howto obsah — **agregovat**, ne přepisovat.
- Žádné nové AI generované dlouhé texty mimo krátké sezónní leady (drž `czech-ag-article-style` skill při psaní jakéhokoliv obsahu).
- Sezónní metadata: zvážit minimální přístup (odvodit měsíc z prózy / lehký `season` tag) místo velkého schema refactoru.

## Otevřené otázky pro brainstorm
1. Granularita: 4 sezóny vs 12 měsíců vs „typ práce" (setí/sklizeň/zpracování půdy)?
2. Crop-calendar jako samostatný hub, nebo součást sezónních rozcestníků?
3. Routing: statická prerender stránka (`/sezona/jaro/`?) vs SSR (kvůli „aktuální měsíc" logice)?
4. Zapojit `akce` (Supabase, SSR) do hubu, nebo zatím jen howto+plodiny (prerender)?
5. URL struktura + jak se to napojí na stávající nav.

## Doporučený první krok
> Spusť `superpowers:brainstorming` na tento track. Rozhodni granularitu + scope (CS-first, howto+plodiny agregace jako MVP, akce jako fáze 2). Pak spec do `docs/superpowers/specs/`, plán, exekuce na worktree.
