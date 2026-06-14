# Design — UK lokalizace fáze 4b: `/uk/puda` (ukrajinský trh s půdou)

**Datum:** 2026-06-14
**Track:** #3 (UK lokalizace), jádro = jurisdikční data
**Předchozí fáze:** 4a Slovník (MERGNUTO + ŽIVĚ, PR #83 → master `355fe134`)
**Tato fáze:** 4b = první ze tří datových sekcí; `/statistiky` (4c) a `/dotace` (4d) následují samostatně.

## Rozhodnutí z brainstormingu

- **Publikum = Ukrajinci v Ukrajině** → data musí být **ukrajinská jurisdikce** (ne CZ přeložené). Hlavní riziko = verifikace UA dat.
- **Scope = `/puda` první** (fáze 4b). Nejmenší datová stopa = nejlevnější pilot pro ověření verifikační brány. Trh s půdou = evergreen, výrazně ukrajinské téma, dobře doložitelná data.
- **Přístup = A (strukturálně/evergreen-first).** Stránka stojí na stabilních, doložených a distinktivně ukrajinských faktech; volatilní čísla jen s explicitním „станом на {rok}" + zdrojem.

## Cíl

Lokalizovat `/puda` do ukrajinštiny s **věcně ukrajinským obsahem** (trh s půdou UA, ne CZ) a zapnout indexaci pod `/uk`, **bez jakékoli změny CS (a SK) výstupu**. CS výstup musí zůstat byte-identický.

## Sekce 1 — Obsahový model

Index hub `/uk/puda` evergreen-first, řazeno od nejstabilnějšího k nejvolatilnějšímu.

### Evergreen jádro (stabilní, snadno doložitelné — kotva stránky)
- **Reforma trhu s půdou (timeline)** — privatizace do паїв (90. léta) → moratorium 2001–2021 → otevření 1. 7. 2021 (jen fyzické osoby, ≤100 ha) → fáze 2 od 1. 1. 2024 (právnické osoby, ≤10 000 ha; cizinci jen přes referendum). **Jádro celé stránky — distinktivní ukrajinské téma.**
- **Černozem & úrodnost** — podíl UA na světovém černozemu; podíl černozemu na území.
- **Velikost zemědělského fondu** — orná půda / zemědělská půda (jeden z největších v Evropě).
- **Držba** — nájem (оренда) dominantní + vlastnictví (паї, počet vlastníků).

### Volatilní (VŽDY s `asOf` + zdroj)
- Průměrná tržní cena půdy po otevření trhu — НГО (нормативна грошова оцінка) vs. tržní.
- Nájemné za ha.
- Struktura plodin (pšenice / slunečnice / kukuřice / ječmen / sója) — výměry.

### Výzvy/ohrožení
- Válečné (okupace části půdy, miny/odminování) + strukturální (eroze černozemu, degradace, dehumifikace). **Válečná data vždy s caveatem.**

### Sekce „Zdroje"
Jako cs: Держгеокадастр, Держстат, Мінагрополітики, FAO, World Bank, opendatabot — s daty „k datu".

### Články `[slug]` (3, encyklopedický překlad — nízké riziko)
- `eroze` → ерозія, `ornice` → орний шар, `vyziva-pudy` → живлення ґрунту. Půdní věda = univerzální.
- **Slugy identické s cs** (lekce 4a: related/parita; `.filter()` tiše zahodí miss).

## Sekce 2 — Zdroje dat & verifikační brána (hlavní riziko)

1. **Každé číslo/fakt má zdroj.** V `agro-puda-uk.json` se ke každému volatilnímu údaji uloží `source` (URL) + `asOf` (datum). Nic se nevymýšlí.
2. **Klasifikace claimů:**
   - *strukturálně-právní* (data reformy, moratorium, systém паїв) = stabilní → ověřit ≥1 zdrojem;
   - *volatilní* (cena, výměry, nájem) = recentní zdroj + caveat + „станом на".
3. **Verifikační/jurisdikční review brána** (analogicky 6 review subagentům ve 4a): dedikovaní subagenti křížově ověří každý údaj proti ≥1 (ideálně 2) autoritativním zdrojům. **Co nelze ověřit → DROP, ne odhad.**
4. **Válečný caveat** explicitně na stránce: údaje odrážejí dostupná data, mohou být dotčena okupací; agregáty z okupovaných území nevydávat za aktuální bez poznámky.

**Preferované zdroje:** Держгеокадастр, Держстат, Мінагрополітики (gov.ua), FAO, World Bank, USDA FAS, opendatabot.
**Vyhýbat se:** blogům, agregátorům bez primárního zdroje, předválečným číslům vydávaným za aktuální.

## Sekce 3 — Architektura & soubory

CS i SK výstup beze změny. Vzor = encyklopedie/howto overlay kolekce + 4a slovník.

| Soubor | Změna |
|---|---|
| `src/data/agro-puda-uk.json` | **Nový.** UA data: evergreen bloky (timeline reformy, big numbers, černozem, ohrožení) + volatilní série (cena/nájem/plodiny) — každý volatilní s `source`+`asOf`. |
| `src/pages/puda/index.astro` | Větev `locale==='uk'` → čte `agro-puda-uk.json`; UA sekce; CZ-only sekce (donut ZPF, CZ ohrožení, CZ vlastnictví) nahrazeny UA ekvivalenty nebo skryty. cs/sk beze změny. |
| `src/pages/puda/[slug].astro` | Mapa kolekcí + `uk:'pudaUk'`. Chybějící uk slug → 404 (žádný cs leak). |
| `src/content/puda-uk/*.md` | **Nové.** 3 přeložené články (eroze, ornice, vyziva-pudy), stejné slugy. |
| `content.config.ts` | Definovat kolekci `pudaUk` (glob `puda-uk`, stejné schéma jako `puda`). |
| `src/lib/puda-derived.ts` | `uk` větev do prose-generátorů (`pudaBigNumbers`/`pudaCenaInsight` apod.). |
| i18n chrome | uk řetězce pro labely `/puda`. `tf(locale, key, params)` — locale PRVNÍ. |
| `src/i18n/utils.ts` | `LAUNCHED_PREFIXES.uk += '/puda'` — **POSLEDNÍ task** (sitemap+hreflang auto-zrcadlí). |

**Zásady (lekce 4a):** `injectLinks`/auto-linker **jen pro cs**; CS výstup byte-identický; assemble velkých dat **`str.replace`, NE `re.sub`** (Python `re.sub` interpretuje `\n` → rozbije `\n\n`); slugy uk == cs.

## Sekce 4 — Metoda & dekompozice tasků

`superpowers:subagent-driven-development`; každý task = implementer → spec review → code-quality review.

1. **T1** — `agro-puda-uk.json` schéma + locale-aware čtení (route větev nebo getter).
2. **T2** — i18n chrome klíče `puda.*` uk (cs verbatim).
3. **T3** — `index.astro` uk větev + lokalizace.
4. **T4** — `[slug].astro` uk + `pudaUk` kolekce v `content.config.ts`.
5. **T5** — populace UA dat do `agro-puda-uk.json` (subagent-driven, GROUNDED + sourced). ⚠️ rizikové.
6. **T6** — překlad 3 článků → `puda-uk/*.md`.
7. **T7** — verifikační/jurisdikční brána (subagenti křížově ověří každý údaj vs. zdroje; flag/drop).
8. **T8** — testy.
9. **T9** — launch prefix + finální opus review + produkční smoke.

## Sekce 5 — Testy & verifikace

- **Unit** `tests/lib/puda-uk.test.ts`: počet článků = cs (3); slug-set == cs; žádné nové dangling related vs. cs (parita); JSON má `source`+`asOf` u volatilních polí.
- **i18n** rozšířit `tests/i18n/uk-launch.test.ts`: `/puda` launched.
- **Baseline:** 3 pre-existing fails (`tests/i18n/nav.test.ts` bazar-nav) = NE regrese.
- **Smoke (prostředí):** nový worktree z `master`, node 22 (`export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 22`), `.env` do worktree (jinak sitemap 500). Dev: cs `/puda/` 200 beze změny · uk `/uk/puda/` 200 + `index,follow` + self-canonical + UA obsah · uk článek 200 · chybějící uk slug 404 · hreflang cs↔uk · sitemap obsahuje `/uk/puda/`.
- **Deploy:** Coolify auto na master push; CI „Workers Builds" fail = ignorovat (stale; reálný deploy = Coolify + `@astrojs/node`).

## Mimo rozsah (YAGNI)

- `/statistiky` (4c) a `/dotace` (4d) — samostatné fáze.
- Nový UA-specifický článek o reformě trhu s půdou (mimo paritu 3 cs slugů) — případně až po pilotu.
- Plná datová parita s cs (přístup B) — vědomě zamítnuto ve prospěch evergreen-first.
