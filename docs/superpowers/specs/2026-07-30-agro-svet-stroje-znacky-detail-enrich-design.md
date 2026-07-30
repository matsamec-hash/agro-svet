# Rozšíření detailů strojů a značek (SEO / organika)

**Datum:** 2026-07-30
**Projekt:** agro-svet.cz
**Cíl:** Obohatit modelové a značkové stránky o obsah, který reálně přitahuje organickou návštěvnost u zemědělské techniky — se zaměřením na modely, které už mají imprese v GSC.

## Kontext a motivace

### Datový podklad (GSC)
Agregace z `site_gsc_daily` (Supabase cloud `obhypfuzmknvmknskdwh`, site_id `cadc73fd-6bd9-4dc5-a0da-ea33725762e1`, 26 dní s daty, duben–květen 2026). Nejsilnější strojové dotazy:

| Značka | Modely | Prům. pozice | Poznámka |
|---|---|---|---|
| **Zetor** | 7745 / 7745 Turbo (4 varianty dotazu), 7711, 6211, 8211, 12145, Major 60 | 7–12 | největší objem + nejlepší pozice = nejrychlejší výhry |
| **Deutz-Fahr** | DX 7.10 / 3.70, AgroPlus 75/100/100S, Agrotron M420, 5100.4, 5206, 10006 | 35–50 | velký dlouhý ocas, špatné pozice |
| ostatní | MF 6235/5608, Fendt 1052 / Corus, Case CVX 1145 / CX 70, Valtra/Valmet 6000/6200, NH TG 210 | 35–50 | roztroušené starší modely |

**Klíčový insight:** hledané modely jsou skoro výhradně **starší / ojeté stroje** → cílovka jsou kupci ojetin. Modifikátory dotazů: „technické údaje" (už pokryto), „cena", „turbo výkon". Chybí přesně obsah pro kupce ojetin: **závady, ceny ojetin, spolehlivost, pro/proti**.

### Architektonický princip (nutno dodržet)
Web generuje obsah **ze strukturovaných dat, ne ručně psaný per model** (v `[model]/index.astro`: „Use-case description from data (no hand-written content per model)"; ve `faq-generator.ts`: „Only emits a question when the underlying datum exists — no template padding"). Rozšíření proto přidává **strukturovaná pole**, ne volné odstavce.

## Rozsah

### V rozsahu
1. Nová volitelná pole ve schématu modelu (YAML) + jejich render jako podmíněné sekce na modelové stránce.
2. Napojení nových polí do `faq-generator.ts` a FAQ JSON-LD.
3. Naplnění dat pro prioritizovanou sadu modelů (vlna 1 = Zetor).
4. Lehčí obohacení top značek (`/stroje/[brand]/` a `/znacky/[slug]`).
5. Příprava schématu tak, aby šlo později doplnit uživatelské recenze (fáze 2) bez refaktoru.

### Mimo rozsah (fáze 2, samostatný projekt)
- **Uživatelské recenze + `Review`/`AggregateRating` schema (hvězdičky v SERPu).** Důvody odkladu: cold-start (modelové stránky mají imprese, ale skoro nulové kliky → prázdná sekce recenzí = thin content); riziko manual action za self-authored ratingy; UGC vyžaduje formulář + Supabase tabulku + moderaci + antispam = vlastní feature. Spustit až modelové stránky získají reálnou návštěvnost, která recenze zaseje.
- i18n překlady nového obsahu do sk/uk/pl (nejdřív cs; strukturu ale připravit locale-aware jako zbytek `faq-generator`).

## Datový model — nová pole modelu (YAML)

Všechna pole **volitelná**; sekce se renderuje jen když pole existuje (stejný vzor jako dnešní `useCase` / `competitors` / `faqItems`).

```yaml
- slug: zetor-7745
  name: "7745"
  # ... stávající pole (power_hp, engine, description, ...) ...

  # NOVÁ pole (všechna volitelná):
  overview: >
    Plný odstavec rozvíjející dnešní jednovětný `description`. 2–4 věty:
    zařazení, k čemu se hodil, čím je typický, postavení na trhu ojetin.
  reliability: >
    1–2 věty o celkové spolehlivosti / životnosti na sekundárním trhu.
  common_faults:
    - issue: "Netěsnost hydraulického rozvaděče"
      note: "Typické u kusů s vyšším nájezdem; oprava běžně dostupná."
    - issue: "Opotřebení spojky"
      note: "..."
  pros:
    - "Jednoduchá, opravitelná konstrukce"
    - "Levné a dostupné náhradní díly"
  cons:
    - "Hlučnější kabina oproti konkurenci"
  used_price:
    min: 120000        # CZK, orientační trh ojetin (NEZÁVISLE na live bazaru)
    max: 260000
    note: "Podle stavu, nájezdu a výbavy."
  for_whom: >
    Pro koho se hodí / krátký verdikt (1–2 věty).
```

**Pozn. `used_price` vs bazar:** dnešní `priceStats` ukazuje ceny z **aktuálních** inzerátů v bazaru (může být 0). `used_price` je editorem zadaný **orientační rozsah trhu** — nezávislý, vždy k dispozici. Na stránce se zobrazí obojí (bazar = „co je právě v prodeji", used_price = „obvyklá cena ojetiny").

## Render — modelová stránka

Nové podmíněné sekce v `src/pages/stroje/[brand]/[series]/[model]/index.astro`, zařazené logicky do stávajícího layoutu:

1. **`overview`** → nahradí/rozšíří hero lede, případně samostatný odstavec nad spec tabulkou.
2. **Sekce „Časté závady a spolehlivost"** (`reliability` + `common_faults[]`) — nová `.faults-card`. Nadpis h2. Renderuje se jen když `common_faults?.length` nebo `reliability`.
3. **Sekce „Silné a slabé stránky"** (`pros[]` / `cons[]`) — dvousloupcová `.proscons-card`. Jen když je aspoň jedno pole neprázdné.
4. **Ceny ojetin** — rozšířit stávající aside/CTA blok o `used_price` rozsah vedle bazarového `priceStats`.
5. **`for_whom`** → krátký blok „Pro koho se hodí" (může být součást pros/cons karty nebo overview).

Všechny nové sekce dostanou i18n klíče (`cat.s.d.*`) i pro cs (a připraví se sk/uk/pl varianty stejně jako u ostatních klíčů).

## Render — FAQ / JSON-LD

Rozšířit `src/lib/faq-generator.ts` o nová Q&A (emitovaná jen když datum existuje):
- „Jaké má {brand} {model} časté závady?" ← `common_faults` (výčet prvních N).
- „Kolik stojí ojetý {brand} {model}?" ← `used_price` (rozsah + note).
- Volitelně „Vyplatí se {brand} {model}?" ← `for_whom`.

Tyto Q&A se automaticky dostanou do `faqPageSchema` JSON-LD → přímý zásah na dotazy „cena" a „závady". Zachovat pravidlo min. 3 Q&A jinak `null`.

## Render — značky (lehčí obohacení)

Top značky (Zetor, Deutz-Fahr, dle GSC):
- Bohatší brand `description` v YAML (kde je stručný).
- Blok „Nejhledanější modely" na `/stroje/[brand]/` a/nebo `/znacky/[slug]` — derivovaný ze seznamu modelů (žádné nové ruční pole; volitelně `popular: true` flag na modelu pro ruční kurátorství, jinak řazení dle existující heuristiky).

Přesný rozsah brand-enrichmentu doladit v plánu — priorita je model-level obsah.

## Naplnění dat — po vlnách

- **Vlna 1 — Zetor:** 7745, 7745 Turbo, 7711, 6211, 8211, 12145, Major 60 + doplnit populární rodiny UR I / Forterra / Proxima / Crystal.
- **Vlna 2 — Deutz-Fahr:** DX, AgroPlus, Agrotron rodiny.
- **Vlna 3:** roztroušené MF / Fendt / Valtra / Case (dle GSC).

### Přesnost obsahu (kritické)
Obsah o závadách / cenách / spolehlivosti musí být **podložený**, ne vymyšlený — jinak hrozí poškození E-E-A-T a důvěry.
- Zdroje: značková fóra, diskuze, inzertní trh (ceny ojetin), známé problémy modelů.
- Draft může připravit AI **s ověřením proti zdrojům**; finální **review uživatelem před publikací**.
- Kde nejsou spolehlivé podklady, pole se nevyplní (sekce se nezobrazí — lepší než nepřesnost).

## Testy

- Loader/type test: nová pole se parsují z YAML a jsou volitelná (chybějící pole nerozbije stránku).
- `faq-generator` test: nová Q&A se emitují jen s daty; zachováno min-3 pravidlo; i18n parita.
- Render smoke: modelová stránka s plnou sadou nových polí (Zetor 7745) i bez nich (starý model) — obě 200, sekce se zobrazí/skryjí dle dat.
- Build zelený (Node 22), i18n parita klíčů cs/sk/uk/pl.

## Deploy

Standardní agro-svet postup (Coolify VPS, `git push` → Coolify build → `npm run purge`). Ověřit render Zetor 7745 na produkci + FAQ JSON-LD ve zdroji HTML.

## Otevřené body k doladění v plánu
- Přesné umístění a styl nových sekcí (pořadí karet na stránce).
- Rozsah brand-enrichmentu (jen description vs. i „nejhledanější modely" blok).
- Zda `popular` flag pro kurátorství, nebo čistě derivované řazení.
