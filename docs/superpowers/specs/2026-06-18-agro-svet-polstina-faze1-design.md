# Polská lokalizace agro-svet.cz — Fáze 1 (základ + katalog + slovník)

**Datum:** 2026-06-18
**Stav:** schváleno k implementaci
**Locale:** `pl` (5. jazyk vedle cs/sk/uk; West-Slavic, LTR, žádná RTL práce)

## Kontext

agro-svet.cz má lokalizaci postavenou na:
- `src/i18n/config.ts` — registr `locales` + `localeNames`
- `src/i18n/ui/<locale>.ts` — „chrome" překlady (~806 klíčů), spojené v `ui/index.ts`; `t(locale,key)` s fallbackem locale → cs → klíč
- `LAUNCHED_PREFIXES[locale]` (`src/i18n/utils.ts`) — sekce přeložené → indexovatelné; zbytek `/<locale>` servíruje cs tělo jako noindex
- `HIDDEN_SECTIONS` / `HIDDEN_NEWS_CATEGORIES` (`src/i18n/nav.ts`) — jurisdikčně skryté sekce / novinkové kategorie
- `src/middleware.ts` — generický `stripLocale` rewrite (nový jazyk routing „chytí" automaticky); `isLockedSectionPath` → cs redirect pro jurisdikční sekce
- `LangSwitcher.astro` — momentálně natvrdo CZ/SK/UA
- generátory textu (`comparison-insights*.ts`, `implement-comparison-insights.ts`, `faq-generator.ts`, `competitor-finder.ts`) — **NE** `t()`-based; mají natvrdo `locale==='sk' ? sk : locale==='uk' ? uk : cs` větve s native frázemi
- slovník: `src/lib/slovnik.ts` (CS jádro ~306 hesel) + `slovnik.uk.ts` (`SLOVNIK_UK`, parita slug/kategorie/related, přeložený text) napojený přes locale-switch

Polština cílí na polské publikum v Polsku → PL jurisdikce. Univerzální/přeshraniční obsah (katalog strojů, slovník) se lokalizuje; jurisdikčně vázaný (dotace, statistiky, půda, novinky) zůstává cs nebo se kuratuje v pozdějších fázích.

## Cíl fáze 1

Živé, indexovatelné polské stránky pro **datově řízený katalog** (`/stroje`, `/znacky`, `/srovnani`) a **slovník** (`/slovnik`), bez jediného českého leaku, při zachování cs/sk/uk byte-identických.

## Rozsah — co fáze 1 dodá

1. **Registrace locale**
   - `config.ts`: `pl` do `locales`, `localeNames.pl = 'Polski'`
   - plurály (`utils.ts` `plural()`): polština má one/few/many vzor **identický s uk** (one = n%10==1 & n%100!=11; few = n%10∈2..4 & n%100∉12..14; many = zbytek) → přidat `pl` do existující uk větve
   - `LangSwitcher.astro`: rozšířit na CZ/SK/UA/PL (`plHref` přes `langSwitchHref('pl', path, HIDDEN_NEWS_CATEGORIES.pl)`)
   - i18n klíče `lang.pl` (+ `lang.cs/sk/uk` už existují) do všech ui souborů

2. **Chrome překlad** — nový `src/i18n/ui/pl.ts` (~806 klíčů, parita klíčů s `cs.ts`), zapojený do `ui/index.ts` (`import pl from './pl'; ui = { cs, sk, uk, pl }`). Pokrývá veškerý UI text procházející `t()`.

3. **Native polské varianty generátorů** — do každého z 5 souborů přidat `pl` větev k existujícím sk/uk (native polské fráze, NE strojový překlad cs):
   - `src/lib/comparison-insights.ts` (3 místa)
   - `src/lib/implement-comparison-insights.ts` (4 místa)
   - `src/lib/comparison-insights-shared.ts` (2 místa — brand descriptor mapa + fallback)
   - `src/lib/faq-generator.ts` (1 místo — `L(cs,sk)` helper rozšířit / `isPl` větev)
   - `src/lib/competitor-finder.ts` (1 místo)
   - Číselné formátování: `pl-PL` locale.
   - Bez nich `/srovnani` pro `pl` propadne do cs větve → český leak ve verdiktech.

4. **Slovník** — `src/lib/slovnik.pl.ts` (`SLOVNIK_PL: SlovnikTerm[]`, 306 hesel; slug/kategorie/related/čísla identické s CS; přeložený `term`/`shortDef`/`longDef`/`alias`/`faq`/`zajimavosti`; `externalUrl` → `pl.wikipedia.org` kde existuje, jinak ponechat/vypustit). Plus `KATEGORIE_LABELS_PL`. Napojit v `slovnik.ts` přes locale-switch stejně jako `SLOVNIK_UK`.

5. **Launch**
   - `LAUNCHED_PREFIXES.pl = ['/stroje', '/znacky', '/srovnani', '/slovnik']`
   - sitemap mirror + reciproční hreflang (cs/sk/uk/pl/x-default) se generuje automaticky z `locales` + `getAlternates`
   - ověřit `getAlternates`/sitemap generátor iteruje přes `locales` (ne natvrdo cs/sk/uk)

6. **Auto-linker** — `renderMarkdownWithLinks(md,url,locale)` je už locale-aware (`localizeInternalHref`); ověřit, že pro `pl` linkuje interní odkazy jen na launchnuté sekce (jinak cs fallback, žádný 302). Brand/model auto-linky → `/pl/` slovník/katalog kde launchnuto.

7. **Nav launched-filtr na `tech` děti** — `getNav` (`utils.ts`/`nav.ts`) má filtr „ukaž jen launchnuté děti všech viditelných sekcí" scope-nutý natvrdo na `locale !== 'uk'` (`nav.ts:147`). Pro `pl` by se neaplikoval → polský `tech` dropdown by dead-linkoval na nelaunchnuté cs děti (`/zebricky`, `/kviz`, `/prodejci`). **Generalizovat** filtr na `pl` (tj. `locale !== 'uk' && locale !== 'pl'` → nebo čistěji množina launched-gated locales). ⚠️ LEKCE z uk fází: NEgeneralizovat na globální launch-filtr všech locales — sk si záměrně ponechává cs-fallback děti; scope JEN na uk+pl (locales, které gateují `tech` na launchnuté).

## Mimo rozsah (zůstává `cs` chování)

- `/statistiky`, `/puda`, `/dotace` — PL data = samostatné pozdější fáze (nejvyšší riziko verifikace); zatím `isLockedSectionPath` → cs redirect (307), jako uk před fázemi 4b-4d
- `/novinky`, `/plemena`, `/farmy` — české články; skryté přes `HIDDEN_SECTIONS.pl`
- `/bazar`, `/fotosoutez` — CZ provoz; skryté
- `/jak-na-to`, `/encyklopedie` — přeložené články (NE data-driven); launchnutí by leakovalo češtinu → pozdější fáze
- `/pl/` homepage hub — polský rozcestník až pozdější fáze; do té doby `/pl/` homepage noindex (jako uk před homepage-hub fází; `isPl` guard v `index.astro` přeskočí cs supabase feed po vzoru `isUk`)

### Konfigurace skrytí (fáze 1)

- `HIDDEN_SECTIONS.pl = ['bazar', 'photo', 'tema', 'animals', 'farms']` (jako uk — ukáže jen sekce s reálným PL obsahem: `tech` katalog+slovník; `data` zatím bez launchnutých dětí → header ukáže `tech`)
- `HIDDEN_NEWS_CATEGORIES.pl = ['dotace', 'legislativa']` (jako sk/uk)

## Architektura / izolace

- **cs no-op garance**: `localizePath`/`t`/generátorové cs větve zůstávají beze změny → cs stránky byte-identické. Stejně sk/uk (nové `pl` větve nezasahují do existujících).
- **Izolované jednotky**: `pl.ts` (chrome), `slovnik.pl.ts` (data) jsou nové soubory; generátorové změny = aditivní `pl` větve. Žádný refaktor existující logiky.
- Slovník page (`slovnik/index.astro`, `[slug].astro`) už locale-switchuje na `SLOVNIK_UK`; přidat `SLOVNIK_PL` do stejného switche.

## Verifikace (brána před mergem)

- `nvm use 22` build EXIT 0 (node≥22)
- `/pl/stroje/`, `/pl/znacky/`, `/pl/znacky/<brand>/`, `/pl/srovnani/<combo>/`, `/pl/slovnik/`, `/pl/slovnik/<heslo>/` → 200 `index,follow` + self-canonical + hreflang cs/sk/uk/pl/x-default
- **0 českých leaků** na launchnutých PL stránkách: srovnávací verdikty, FAQ, brand popisy, auto-linky polsky
- cs/sk/uk stránky **byte-identické** (smoke: `/`, `/stroje/`, `/srovnani/...`, `/slovnik/<heslo>/` v cs i `/sk/` i `/uk/`)
- jurisdikční sekce `/pl/statistiky`, `/pl/puda`, `/pl/dotace` → cs redirect (307)
- `/pl/slovnik/<neexistuje>` → 404
- slovník: parita hesel s CS (test po vzoru uk; pozn. CS má 3 pre-existing dangling related → test = parita s CS, ne 0 dangling)
- sitemap obsahuje `/pl/` launchnuté URL; `/pl/` homepage noindex (mimo sitemapu)
- LangSwitcher ukazuje PL a funguje (přepnutí nevede na 404 — `langSwitchHref` fallback na `/pl/`)

## Subagent-driven implementace

Jako každá uk fáze: paralelní subagent tasky s per-task review (implementer + spec/code-quality review) + finální opus review APPROVE + data verifikační brána.

- **Chrome (`pl.ts`)**: překlad ~806 klíčů, parita s cs.ts (žádné chybějící/přebývající klíče)
- **Slovník (`slovnik.pl.ts`)**: 306 hesel, polský překlad + PL review brána (kvalita, terminologie, `pl.wikipedia.org` URL ověřit že rozlišují); ⚠️ assemble TS skriptem `str.replace` NE `re.sub` (interpretuje `\n` → rozbil by `\n\n` v longDef)
- **Generátorové varianty**: native polské fráze (NE překlad cs souboru), gramaticky správné (akuzativ/genitiv pády)
- **Adversariální verifikace** polských dat: terminologie zemědělské techniky, externí URL

## Lekce z předchozích fází (aplikovat)

- ⚠️ build přegeneruje `content-dates.json` → NEcommitovat ten artefakt
- ⚠️ reconcile s `origin/master` PŘED mergem (track se vyvíjí)
- ⚠️ Coolify deploy ~75s; reálný adaptér `@astrojs/node`; „Workers Builds" CI fail = stale, ignorovat
- ⚠️ baseline ~5 testů (cs nav „7 top-level/bazar" + utils uk) failuje i na čistém master = STALE (cs skrývá bazar) → NE regrese, NEopravovat
- ⚠️ preview sitemap potřebuje `set -a; . ./.env; set +a`

## Pozdější fáze (mimo tenhle spec, stejný řetězec jako uk)

- Fáze 2: `/jak-na-to` + `/encyklopedie` (přeložené články) — pokud launchneme
- Fáze 3: PL `/puda` (kurátovaný hub, PL trh s půdou)
- Fáze 4: PL `/statistiky` (kurátovaný hub, USDA/Eurostat PL grounding)
- Fáze 5: PL `/dotace` (kurátovaný hub PL zemědělské podpory — ARiMR, PROW/WPR; nejvyšší jurisdikční riziko)
- Fáze 6: `/pl/` homepage rozcestník + header/footer trim na launchnuté sekce
