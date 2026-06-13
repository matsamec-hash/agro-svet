# Zadání: UK (ukrajinská) jurisdikční data (Track #3 organic-traffic)

**Datum:** 2026-06-13
**Pro:** nové okno / fresh session
**Track:** #3 z `2026-06-13-agro-svet-organic-traffic-zadani.md`
**Cíl:** Rozšířit ukrajinskou (`uk`) lokalizaci agro-svet.cz o **jurisdikční sekce** (dotace / statistiky / půda / slovník), které u CS/SK existují, ale u UK chybí — protože nesou data specifická pro jurisdikci a musí se **VYTVOŘIT NOVĚ z ukrajinských zdrojů (UAH, ukrajinské instituce), NE přeložit z CZ**.

⚠️ **UK = ukrajinština (domácí ukrajinský trh), NE angličtina.** Publikum = zemědělci na Ukrajině → jurisdikční data jsou ukrajinská (UAH, ukrajinské dotační programy, ukrajinská statistika).
⚠️ **Tohle je vstup do brainstormu, ne hotová spec.** Velký kus → vlastní `superpowers:brainstorming` → spec → plán → exekuce. NElumpovat s quick-winy. Drž konvence (Node 22, deploy push `master`→Coolify, git push token-in-URL, worktree/větev, merge/PR po schválení).
⚠️ **Tohle je VYSOKÉ úsilí** a hlavní riziko NENÍ kód (infra je hotová a osvědčená), ale **sourcing + verifikace dat pro cizí jurisdikci**. Viz „Hlavní riziko" níže.

---

## Stav UK (grounded, ověřeno 2026-06-13)

- **Launched uk prefixy** (`src/i18n/utils.ts:35` `LAUNCHED_PREFIXES.uk`): `/stroje`, `/srovnani`, `/znacky`, `/encyklopedie`, `/jak-na-to` (fáze 2 + 3). Vše ostatní pod `/uk/` = `noindex` (řídí `Layout.astro` přes `isLaunchedPath`).
- **Chybí jurisdikční sekce** (jsou v cs i sk, NE v uk): `/dotace`, `/statistiky`, `/puda`, `/kalkulacka` (+ `/novinky`). V nav jsou pro uk skryté (`src/i18n/nav.ts` `HIDDEN_SECTIONS.uk` obsahuje `data`).
- **Slovník** (206 hesel, `src/lib/slovnik.ts`) — CS-only, prerender. Spec na uk variantu HOTOVÁ ale DESCOPNUTÁ: `docs/superpowers/specs/2026-06-08-agro-svet-i18n-uk-faze3-jaknato-slovnik-design.md`.

## Osvědčený overlay vzor (infra je HOTOVÁ — reuse, neznovuvymýšlet)

Fáze 2/3 zavedly per-locale overlay vzor (potvrzeno na encyklopedie/znacky/howto Uk):
1. **Kolekce:** nová `xxxUk` v `src/content.config.ts` (`defineCollection` s vlastním `glob` base `./src/content/xxx-uk`, **reuse cs schema funkce** `xxxSchema()`). Slug = cs slug.
2. **Route dispatch:** mapa `const COLL = { cs:'xxx', sk:'xxxSk', uk:'xxxUk' }`; `getCollection(COLL[locale])`; **chybějící slug = `Astro.rewrite('/404')`, ŽÁDNÝ cs fallback** (route čte `Astro.locals.locale`, ne URL).
3. **Data JSON** (statistiky/půda/kola) per-locale: `agro-stats-uk.json`, `agro-puda-uk.json`, `dotace-kola-uk.json`.
4. **i18n chrome:** `src/i18n/ui/uk.ts` (už má 1000+ klíčů přeložených, vč. `nav.data.*`). Key-parity test hlídá cs/sk/uk množinu klíčů.
5. **Launch gating:** přidat prefix do `LAUNCHED_PREFIXES.uk` **AŽ když je obsah 100% hotový a zreviovaný** (flipne noindex→index).
6. **Sitemap** (`src/pages/sitemap.xml.ts`): hub se zrcadlí přes `ukMirror` automaticky; **detail slugy nutno přidat explicitně** iterací `getCollection('xxxUk')` (vzor: SK dotace detaily, ř. 441–444). Pozor na `isDotaceDetailPath` filtr (detaily se nezrcadlí z cs, mají vlastní slugy).
7. **Nav:** odkrýt `data` sekci pro uk (`HIDDEN_SECTIONS.uk`) + href na první launched dítě (vzor SK).
8. **Byte-parita CS:** CS výstup musí zůstat HTML-identický (žádný automat, manuální sémantický diff CS stránek vs master před mergem). uk-launch testy: `tests/i18n/uk-launch.test.ts`, `uk-collections.test.ts`.

**Klíčové soubory:** `src/i18n/{utils.ts,nav.ts,ui/uk.ts}`, `src/layouts/Layout.astro`, `src/middleware.ts`, `src/content.config.ts`, `src/pages/{dotace,statistiky,puda,slovnik}/`, `src/data/agro-stats*.json`, `src/data/dotace-kola*.json`, `src/pages/sitemap.xml.ts`.

## Co která sekce obnáší (data, co se VYTVOŘÍ nově)

| Sekce | CS zdroj | SK zdroj | UK = nově vytvořit z | Úsilí |
|---|---|---|---|---|
| **slovník** | `slovnik.ts` 206 hesel | — (CS-only) | **překlad 206 hesel do uk** (spec hotová) | **NÍZKÉ** (překlad, ne data) |
| **statistiky** | ČSÚ, CZK (`agro-stats.json`) | Eurostat, EUR | Держстат/Укрстат, **UAH** (`agro-stats-uk.json`: komodity/živočišná/plodiny/hnojiva/palivo) | STŘEDNÍ |
| **dotace** | SZIF intervence (`content/dotace/`) | PPA SR (`dotace-sk/`) | **ukrajinské dotační programy** (Min. agrární politiky), UAH, vlastní slugy (`content/dotace-uk/` + `dotace-kola-uk.json`) | VYSOKÉ |
| **půda** | FARMY.CZ/VÚMOP/ČÚZK (`content/puda/`) | Eurostat (`puda-sk/`) | ukrajinský trh s půdou (UAH/ha; trh otevřen 2021; post-2022 kontext), `content/puda-uk/` + `agro-puda-uk.json` | VYSOKÉ + citlivé |

## Hlavní riziko (proč to není quick-win)
**Sourcing a verifikace dat pro cizí jurisdikci.** Nemáme přímou znalost ukrajinských institucí/programů/cen jako u ČR/SK. Špatná dotační čísla / zastaralé programy = reputační + SEO riziko (Google E-E-A-T). **Brainstorm MUSÍ vyřešit:**
- Kdo/jak ověří správnost UA dat? (oficiální zdroje, dohledatelné URL do `primarniZdroj`, datum `aktualizovano`.)
- Jak řešit aktuálnost (UA programy/ceny se mění; válečný kontext).
- Realistický rozsah dat na start (ne všechno najednou).

## Doporučené fázování (k potvrzení v brainstormu)
- **Fáze 4a — Slovník UK (NÍZKÉ úsilí, čistě překlad):** ideální první UK increment. Spec hotová (`2026-06-08-…-jaknato-slovnik-design.md`): nový `src/lib/slovnik.uk.ts` (206 hesel uk) + locale-aware `getSlovnik(locale)` + route cs prerender→SSR (CS HTML-identický!) + `/slovnik` do `LAUNCHED_PREFIXES.uk`. **Žádné sourcing riziko** (jen překlad existujících hesel). Dobré rozehřátí + samostatně mergnutelné.
- **Fáze 4b — statistiky UA (STŘEDNÍ):** jeden JSON soubor, jasný formát. Vyžaduje UA statistická data (UAH).
- **Fáze 4c — dotace UA (VYSOKÉ):** vyžaduje rešerši ukrajinských dotačních programů. Nejvyšší dopad i riziko.
- **Fáze 4d — půda UA (VYSOKÉ + citlivé):** nejnáročnější (válečný kontext, jiná legislativa). Zvážit, zda vůbec.

## Hranice / YAGNI
- **Nepřekládat** jurisdikční CS/SK obsah — vytvořit nově z UA zdrojů.
- CS výstup nesmí změnit (byte-parita).
- Launch prefix přidat až po review obsahu, ne dřív.
- Začít NEJMENŠÍM rizikem (slovník), ne největším (dotace/půda).

## Doporučený první krok
> Spusť `superpowers:brainstorming` na tento track. Rozhodni fázování (doporučeno: nejdřív **slovník UK** = nízké riziko, spec už existuje — to může jít skoro rovnou do plánu) a hlavně **strategii sourcingu/verifikace UA dat** pro statistiky/dotace/půdu, než se do nich pustíš. Pak per-fáze spec → plán → exekuce na worktree.
