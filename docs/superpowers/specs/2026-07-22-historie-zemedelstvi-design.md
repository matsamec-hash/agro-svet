# Historie českého zemědělství — návrh (`/historie/`)

**Datum:** 2026-07-22
**Projekt:** agro-svet.cz (Astro 6, SSR/prerender=false, i18n cs/sk/uk/pl, Chart.js, precomputed JSON)

## Cíl

Nová sekce mapující historický vývoj českého zemědělství — jak se měnily stroje,
klíčové ukazatele (osevní plochy, dojivost, stavy zvířat, počet lidí v zemědělství,
cena půdy) a dobový kontext. Obsah rozdělený do **tematických podstránek**, ne podle ér.

## Architektura

Rozcestník + samostatné crawlovatelné podstránky (kvůli SEO — stejný vzor jako
`/bazar`, `/stroje`, `/statistiky`). Vše SSR (`prerender=false`) kvůli locale rewrite.

| URL | Obsah |
|-----|-------|
| `/historie/` | Hub: tmavý hero, headline staty „kdysi vs. dnes", tenká časová osa milníků, 4 dlaždice do sekcí |
| `/historie/technika/` | Přehled historických strojů (mřížka karet) |
| `/historie/technika/[slug]/` | Detail stroje — specs, roky, příběh, foto (E512 jako vlajková loď) |
| `/historie/data/` | Dlouhodobé grafy strukturálních metrik |
| `/historie/dobovy-tisk/` | Stylizované výstřižky (přepsaný titulek + kontext) |
| `/historie/zajimavosti/` | „Věděli jste", rekordy, kdysi vs. dnes |

**Vypuštěno (vědomě):** samostatná sekce „Lidé" (počty pracovníků jsou datová metrika
→ patří do Data) a „Mapa/Regiony" (YAGNI pro 1. iteraci).

## Datová vrstva

Jeden precomputed soubor `src/data/agro-historie.json` (žádný runtime fetch, stejný
vzor jako `agro-stats.json`). Data dohledá Claude z veřejných zdrojů (ČSÚ historické
ročenky, Eurostat, MZe; specifikace strojů z veřejné dokumentace). Struktura:

```jsonc
{
  "generated": "ISO datum",
  "milestones": [ { "year": 1949, "title": "Kolektivizace / vznik JZD", "note": "…" } ],
  "machines": [
    {
      "slug": "kombajn-e-512", "name": "Kombajn E-512", "category": "kombajn",
      "maker": "Fortschritt (NDR)", "yearsFrom": 1970, "yearsTo": 1985,
      "specs": { "záběr": "5–6 m", "výkon": "…", "…": "…" },
      "story": "1–2 odstavce", "image": "cesta nebo null"
    }
  ],
  "longRange": {
    "dojivost":      [ { "year": 1960, "value": 1900, "unit": "l/ks/rok" } ],
    "skot":          [ { "year": 1960, "value": 4200000, "unit": "ks" } ],
    "prasata":       [ { "year": 1960, "value": 5500000, "unit": "ks" } ],
    "drubez":        [ { "year": 1960, "value": 0, "unit": "ks" } ],
    "osevniPlocha":  [ { "year": 1960, "value": 0, "unit": "ha" } ],
    "pracovnici":    [ { "year": 1960, "value": 0, "unit": "osob" } ],
    "cenaPudy":      [ { "year": 2000, "value": 0, "unit": "Kč/ha" } ]
  },
  "press":  [ { "year": 1974, "source": "Zemědělské noviny", "headline": "…", "context": "…" } ],
  "trivia": [ { "title": "…", "body": "…", "then": "…", "now": "…" } ]
}
```

Každá řada v `longRange` má u sebe **zdroj a rozsah** (uvedeno v UI pod grafem).
Ceny komodit se **neduplikují** — sekce Data prolinkuje na existující `/statistiky`.

### Realistický rozsah dat
- Dojivost, stavy zvířat, osevní plochy, pracovníci: spolehlivě ~od 50.–60. let (ČSÚ).
- Cena zemědělské půdy: souvislé řady spíš od ~2000; starší jen orientačně nebo vynechat.
- U každého grafu uveden zdroj a počáteční rok, žádná falešná přesnost.

## Komponenty

- **Recyklace:** existující klientský Chart.js graf (jako `/statistiky/komodita/[slug]`).
- **Nové (malé, jednoúčelové):** karta stroje, karta výstřižku (stylizace „starých novin"),
  stat-pill „kdysi vs. dnes", dlaždice hubu, časová osa milníků.

## Jazyky

Launch **cs-only** (obsah je hluboce český: ČSÚ, JZD, dobový tisk). Struktura i18n-ready;
sk/uk/pl se doplní později (do té doby fallback/noindex jako jinde na webu).

## Dobový tisk

Reálné skeny jsou autorsky chráněné a špatně dostupné → obsah pojat jako **přepsané
dobové titulky/citace s kontextem**, vizuálně stylizované jako výstřižek. Skutečné skeny,
pokud je uživatel dodá, se doplní.

## SEO

- Každá podstránka vlastní `title`/`meta`/OG, kanonická URL.
- Machine detail stránky cílí long-tail („kombajn e512 historie", „zetor 25").
- JSON-LD kde dává smysl (Article/ItemList).
- Interní prolinky: hub ↔ sekce, Data ↔ `/statistiky`, technika ↔ `/stroje` kde relevantní.

## Rozsah 1. iterace (MVP)

- Hub + všechny 4 sekce živé.
- **Data:** 3–4 klíčové grafy (dojivost, stavy zvířat, osevní plochy, pracovníci).
- **Technika:** ~6–8 strojů, E512 jako vlajková loď, každý s detail stránkou.
- **Dobový tisk:** ~6 výstřižků.
- **Zajímavosti:** ~8 položek.
- Fotky strojů: volně dostupné/placeholdery, uživatel později vymění.

## Testování / hotovo když

- `npm run build` projde bez chyb.
- Grafy se renderují, časová osa a dlaždice fungují.
- Všechny podstránky mají vlastní title/meta a jsou dostupné z hubu (crawlovatelné).
- Data mají u sebe uvedené zdroje.
- Deploy: push master → CF build → `npm run purge` (Node ≥22).

## Mimo rozsah (příště)

Sekce Mapa/Regiony; sk/uk/pl obsah; per-metrika detail stránky v Data; reálné skeny tisku;
uživatelsky nahrané fotky strojů.
