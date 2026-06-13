# Farmy — seznam + mapa vybraných farem (agro-svet.cz)

**Datum:** 2026-05-31
**Status:** Návrh schválen (brainstorming). Implementace zatím nezahájena.

## Cíl
Sekce `/farmy/` = adresář **vybraných farem prodávajících ze dvora** (přímo spotřebiteli):
seznam + mapa + detail + filtry. Cíle: **SEO/návštěvnost** a později **monetizace přes
placené topování** farem.

## Kontext z research (2026-05-31, ověřeno)
- Trh NENÍ prázdný — existují 4 etablované adresáře se seznamem+mapou+filtry:
  najdizemedelce.cz (Zeměděl. svaz, ~360 míst), asz.cz Katalog farem (~200+),
  adresarfarmaru.cz (Hnutí DUHA / Mapotic), kde.lovime.bio (jen BIO).
- **Feature parita nevyhraje.** Výhoda agro-svetu = (a) SEO long-tail landing
  produkt×lokalita, (b) síla domény.
- **Mezera k využití:** nikdo nedělá „všechny farmy + volitelný eko/BIO příznak"
  zároveň (institucionální nemají eko filtr; bio-adresář je jen BIO).
- **Zdroje dat:** veřejné registry dají jen kostru (ARES REST API dle NACE 01.x bez auth,
  ČSÚ RES open-data CSV, Registr ekopodnikatelů = eko příznak, OSM shop=farm). Produkty /
  otevírací dobu / GPS / foto žádný registr nedá → ruční kurace nebo onboarding farem.
- **Monetizace:** topování reálné, nízké stropy (~190 Kč/3 měs až 12–100 Kč/den à la
  Firmy.cz). Ochota farem platit research nepotvrdil → platební infra teď = předčasná (YAGNI).

## Klíčová rozhodnutí
1. **Zdroj dat:** ruční kurace na startu (~30–100 vybraných kvalitních farem), self-service
   až s reálnou poptávkou. Sedí na „vybrané/doporučené farmy", žádný cold-start.
2. **Úložiště V1 = YAML** (`src/data/farmy/`, vzor jako `/stroje/`): read-only, plně
   prerenderované (nejlepší SEO), verzované v gitu, kurace = editace souboru, nulová infra.
   *Escape hatch:* při požadavku na self-service hned → rovnou Supabase jako bazar.
3. **Rozsah V1:** seznam + mapa + detail + filtry. Carousel na HP a průvodce až potom.

## Datový model (1 YAML / farma v `src/data/farmy/`)
- `slug`, `name`, `farm_type` (rodinná / eko / …), `description`
- `region` (kraj), `district` (okres), `address`, `lat`, `lng` (geokóduje se jednorázově)
- `eco: true|false` + `eco_cert` (BIO certifikát / číslo z REP, pokud má)
- `products: [brambory, mléko, mléčné-výrobky, maso, zelenina, ovoce, vejce, med, …]`
  — pevný číselník (rozšiřitelný)
- `contact` (web, tel, e-mail), `opening` (otevírací doba / prodej ze dvora)
- `photos: []`
- `featured: false`, `featured_until` — připraveno na topování, zatím ruční flag

## Stránky V1
- `/farmy/` — hub: mapa (Leaflet + MarkerCluster, OSM dlaždice, vzor `/bazar/mapa/`) +
  seznam karet. Filtry client-side (kraj, produkt, eko/neeko, fulltext) přes URL params
  (SEO-friendly). Data z `/farmy/data.json` generovaného z YAML.
- `/farmy/[slug]/` — prerendered detail: foto, produkty, eko štítek, kontakt, malá mapa,
  **schema.org LocalBusiness / GroceryStore** (JSON-LD) pro Google rich results.
- `/farmy/[kraj]/` — krajský SEO landing; generovat jen pro kraje s **≥ N farmami**
  (jinak thin-content penalizace). Produkt×lokalita landing až s objemem (fáze 2).

## Navigace + sitemap
- Přidat „Farmy" do hlavního menu.
- Rozšířit `sitemap.xml.ts` o farmy + krajské stránky (pozor na limity sitemapy — viz memory).

## Fáze 2 (až bude V1 hotové)
- **HP carousel „Doporučené farmy"** (z `featured`).
- **Průvodce „co hledáš + odkud jsi → nejbližší / doporučené farmy"** — geo dotaz, řazení dle
  vzdálenosti, boost eko/featured.
- **Hodnocení farem (rating/recenze) od uživatelů.** ← požadavek uživatele
- **Nahrávání vlastních fotek farem uživateli** (s moderací). ← požadavek uživatele
- **Programmatic SEO landing produkt×lokalita** (až bude dost farem).
- **Self-service registrace farem + placené topování.**

> ⚠️ **Trigger migrace YAML → Supabase:** hodnocení + uživatelské fotky (a self-service)
> vyžadují účty, zápis za běhu, moderaci a storage → to je moment, kdy se z YAML přechází na
> Supabase (vzor `bazar_listings` + `bazar_images` + RLS). V1 YAML zůstává zdrojem
> kurovaných „vybraných" farem; user-generated vrstva se přidá nad DB.

## Diferenciace
Kompletní farmy *s* eko příznakem (nikdo nemá obojí) + síla domény agro-svet +
budoucí SEO landing produkt×lokalita.
