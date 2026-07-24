# Bazar — strukturované atributy / výbava (rich per-kategorie) — návrh

Datum: 2026-07-24
Stav: schválený návrh (čeká na review před writing-plans)

## Problém

Inzeráty v bazaru mají dnes jen **číselné/rozsahové** strukturované atributy (rok, výkon, motohodiny, pracovní záběr, nosnost, objem nádrže, model, značka, cena). Chybí „výbavové" atributy jako **klimatizace, pohon 4×4, čelní nakladač, TP/SPZ, převodovka, palivo** apod.

AI (`structureListing`) už dnes `features[]` vrací, ale import je **jen slepí do textu popisu** (`Výbava: …`) — neukládají se strukturovaně, takže se podle nich **nedá filtrovat**, nepomáhají SEO ani MCP.

## Cíle

1. Bohatá, **per-kategorie** sada strukturovaných atributů pro **všechny** kategorie (stroje i zvířata/pozemky/služby).
2. Plnění z **AI extrakce** (nové importy) + **backfillu** stávajících + **ručního formuláře** `/bazar/novy`.
3. **Filtrování** podle atributů ve **schované (rozbalovací)** sekci „Rozšířené filtry".
4. **SEO**: vybrané `kategorie × atribut` landing stránky (s guardrails proti tenkému obsahu).
5. **Bot/LLM friendly**: JSON-LD `additionalProperty` na detailu + rozšíření MCP `search_bazar`.

## Non-goals

- Hluboké kombinatorické SEO landingy (klima+4×4+powershift) — jen jednoatributové landingy, zbytek query filtr s canonicalem.
- Změna stávajících číselných filtrů (rok/výkon/…) — ty zůstávají; nové atributy je **doplňují**.
- Překlady atributů do sk/uk/pl (zatím CZ; slovník připraven na i18n později).

## Architektura — Approach A: JSONB + slovník v kódu

Jeden zdroj pravdy (`src/lib/bazar-attributes.ts`) řídí **čtyři** věci: AI extrakci, filtr UI, SEO landingy a MCP.

### Datový model

Migrace `022_bazar_attributes.sql`:
```sql
ALTER TABLE bazar_listings ADD COLUMN attributes jsonb NOT NULL DEFAULT '{}';
CREATE INDEX idx_bazar_listings_attributes ON bazar_listings USING gin (attributes);
```
Klíč = slug atributu, hodnota = `true` | string (enum) | number. Příklad:
```json
{ "klimatizace": true, "pohon": "4x4", "prevodovka": "powershift", "pocet_valcu": 4, "tp_spz": true }
```

### Slovník atributů (`bazar-attributes.ts`)

```ts
type AttrType = 'bool' | 'enum' | 'number';
interface AttrDef {
  key: string;            // 'klimatizace'
  label: string;          // 'Klimatizace' (CZ popisek pro UI/JSON-LD)
  type: AttrType;
  options?: string[];     // enum hodnoty (slug), např. ['2x4','4x4']
  optionLabels?: Record<string,string>; // slug → popisek pro UI
  unit?: string;          // number jednotka: 'l','ks','ha','m'
  categories: string[];   // ['traktory','kombajny'] nebo ['*'] = sdílené
  filter?: boolean;       // zobrazit ve filtru (default true)
  seoLanding?: boolean;   // smí generovat SEO landing (default false; jen vybrané bool/enum)
}
export const ATTRIBUTES: AttrDef[] = [ /* … */ ];
// pomocné: attributesForCategory(cat), attrDef(key), validateAttributes(cat, obj)
```

Pravidla:
- `attributesForCategory(cat)` = atributy s `categories` obsahující `cat` nebo `'*'`.
- `validateAttributes` zahodí neznámé klíče a hodnoty mimo `options` → server nikdy neuloží smetí.
- Některé atributy **přemostí** na existující sloupce (nezdvojovat data): `pracovni_zaber_m`, `nosnost_kg`, `objem_nadrze_l`, `power_hp`, `year_of_manufacture` zůstávají sloupce; slovník je jen odkazuje pro UI/extrakci, do `attributes` se nekopírují.

### Slovník — kompletní návrh vocab

Sdílené (`*`, resp. skupina strojů):
- `stav` enum [nove, pouzite, repasovane]
- `klimatizace` bool · `pohon` enum [2x4, 4x4] · `tp_spz` bool · `celni_nakladac` bool

Per kategorie (výběr klíčových; finální slugy potvrdí implementace):

| Kategorie | Atributy (nad rámec sdílených + stávajících číselných) |
|---|---|
| traktory | `prevodovka` [manual, powershift, cvt], `pocet_valcu` (ks), `palivo` [nafta, benzin, elektro], `odpruzena_naprava` bool, `odpruzena_kabina` bool, `tribodovy_zaves` bool, `vyvodovka_pto` bool |
| kombajny | `sirka_listy_m` (m), `drtic_slamy` bool, `gps_navadeni` bool, `pocet_klasu` (ks) |
| zpracovani-pudy | `zavesnost` [nesene, tazene, navesne], `typ_naradi` [pluh, podmitac, kompaktor, brany, hloubkovy_kypric] |
| seti | `zavesnost`, `typ_secky` [mechanicka, pneumaticka], `pocet_radku` (ks) |
| hnojeni | `zavesnost`, `typ` [rozmetadlo, aplikator_kejdy, aplikator_hnoje] |
| ochrana-rostlin | `zavesnost` [nesene, tazene, samojizdne], `pracovni_zaber_m`* |
| sklizen-picnin | `typ` [zaci_secka, obracec, shrnovac, lis, rezacka], `pracovni_zaber_m`* |
| sklizen-okopanin | `typ` [vyoravac, sklizec, nakladac], `pocet_radku` (ks) |
| manipulace | `typ` [celni_nakladac, teleskop, vzv, kloubovy_nakladac], `vyska_zdvihu_m` (m), `nosnost_kg`* |
| doprava | `typ` [naves, prives, cisterna, valnik, sklapec], `pocet_naprav` (ks), `nosnost_kg`* |
| komunal-les | `typ` [mulcovac, stepkovac, freza, radlice], `pohon`* |
| staj-chov | `typ` [krmny_voz, dojeni, ustajeni, napajeni, ventilace] |
| nahradni-dily | `stav`* (nove/pouzite/repasovane), `urceno_pro` (volný text/slug) |
| prislusenstvi | `typ` (volný slug), `stav`* |
| osiva-hnojiva | `druh` [osivo, hnojivo, postrik], `plodina` (text) |
| pozemky | `vymera_ha` (ha), `druh_pozemku` [orna, louka, pastvina, les, sad, zahrada], `bonita` (number) |
| zvirata | `druh` [skot, prasata, ovce, kozy, kone, drubez, ostatni], `plemeno` (text), `pohlavi` [samec, samice], `stari_mesice` (number), `brezost` bool |
| sluzby | `typ` (volný slug) |
| ostatni | `stav`* |

`*` = přemostěno na existující sloupec / sdílený atribut.

## Extrakce (`bazar-import-structure.ts`)

- `structureListing` dostane navíc `categoryAttributes: AttrDef[]` a vrátí `attributes: Record<string,unknown>`.
- Prompt: doplní se sekce „Z tohoto inzerátu vyplň atributy. Vybírej POUZE z uvedených klíčů a povolených hodnot. Co nelze určit, vynech (neuvádět klíč). Nehádej." — stejná přísnost jako u brand/category dnes.
- Výstup se prožene `validateAttributes(category, obj)` (zahodí neznámé/nevalidní).
- **Deterministický fallback** bez `OPENAI_API_KEY`: regexy na nejjasnější z title+description — `klimatizace` (/klimatizac/i), `pohon` 4×4 (/4\s?x\s?4|4wd|náhon.*4/i → '4x4'), `tp_spz` (/\bTP\b/i && /\bSPZ\b/i), `celni_nakladac` (/čelní naklada/i).
- Uloží se přes `bazar-seed.ts` (`addDraftListing`/`createProspectWithDraft` dostanou `attributes`) i přes normální `/bazar/novy` API.

## Backfill (`scripts/backfill-attributes.ts`)

- Projede všechny inzeráty (dávkově, stránkovaně), pro každý spustí extrakci z title+description a **mergne** do `attributes` (nepřepisuje ručně zadané — merge, ne replace; příznak `--force` pro přepis).
- Idempotentní, znovu-spustitelné. Cílí self-host prod (env override jako u `import-bazos-seller.ts`).
- Loguje počty, žádné tiché ořezání.

## Ruční formulář (`/bazar/novy`)

- Po výběru kategorie se **dynamicky** vykreslí pole atributů z `attributesForCategory(cat)`:
  - `bool` → checkbox, `enum` → select (optionLabels), `number` → number input (+ unit).
- Odeslání → server `validateAttributes` → uloží do `attributes`.
- Progressive enhancement: bez JS se vykreslí sdílené atributy; kategorie-specifické se doplní po výběru kategorie (malý island / native `<details>`).

## Filtr UI (`/bazar`, schované)

- Nová **rozbalovací sekce „Rozšířené filtry"** (`<details>`, default sbalená), pod stávající lištou.
- Obsah dle vybrané kategorie: `attributesForCategory(cat).filter(a => a.filter !== false)`. Bez kategorie jen sdílené.
- Ovládání → query param na atribut (`?a_klimatizace=1`, `?a_pohon=4x4`).
- Query builder `bazar-attributes-filter.ts`: param → JSONB predikát.
  - bool → `attributes->>'klimatizace' = 'true'`
  - enum → `attributes->>'pohon' = '4x4'`
  - number rozsah → `(attributes->>'x')::numeric >= …`
- Bezpečně: filtruje jen podle klíčů ze slovníku (allowlist), hodnoty escapované.

## SEO landing stránky

- URL schéma: `…/bazar/kategorie/<category>/vybava/<attr-value-slug>/`
  - segment `vybava/` odděluje od stávajícího `…/kategorie/<category>/<brand>/`, aby slug atributu nekolidoval se značkou.
  - `attr-value-slug`: pro bool = klíč (`klimatizace`), pro enum = `klic-hodnota` (`pohon-4x4`).
- Generují se jen z atributů s `seoLanding: true` (kurátorský výběr, ne vše).
- **Guardrails proti tenkému obsahu** (poučeno z /akce SEO + worldstadiumsmap propadu):
  - Index jen když **≥ 3 inzeráty**; jinak `<meta robots noindex,follow>`.
  - Jen **jednoatributové** landingy. Kombinace více atributů = query filtr s `<link rel=canonical>` na nejbližší single-atribut landing (nebo na kategorii).
  - `canonical` vždy na sebe; žádný hreflang.
  - Do `sitemap` jen indexovatelné (splňující práh).
- Obsah: `<title>`/H1 „Traktory s klimatizací — bazar", krátký úvodní text, výpis inzerátů (reuse `BazarListingRow`), `ItemList` + `BreadcrumbList` JSON-LD.

## Strukturovaná data (detail inzerátu)

- Do stávajícího `Product` JSON-LD přidat `additionalProperty: PropertyValue[]` z `attributes` (name = label ze slovníku, value = popisek hodnoty).
- Vizuální sekce „Výbava" na detailu: čitelné popisky ze slovníku (ne raw slug).

## MCP (`/api/mcp/`, `search_bazar`)

- Přidat volitelný parametr `attributes` (objekt klíč→hodnota) → propíše se do JSONB filtru (stejný builder jako web).
- Výsledky vrací `attributes` inzerátu.
- Popis toolu dynamicky doplní dostupné atributové klíče (ze slovníku) → model ví, podle čeho může filtrovat.

## Testy (TDD)

- `bazar-attributes.test.ts` — integrita slovníku (unikátní klíče, enum options neprázdné, kategorie existují v `CATEGORIES`), `attributesForCategory`, `validateAttributes` (zahazuje neznámé/nevalidní).
- `bazar-import-structure.test.ts` (rozšíření) — fixture title/description → očekávané `attributes`; fallback regexy.
- `bazar-attributes-filter.test.ts` — param → JSONB predikát; ignoruje klíče mimo slovník; escaping.
- SEO landing — práh N (noindex pod prahem), canonical, slug ↔ atribut round-trip.
- MCP — `attributes` param → filtr; výstup obsahuje `attributes`.

## Migrace & nasazení

- `022_bazar_attributes.sql` (sloupec + GIN index) → aplikovat na **self-host prod** (`supabase.samecdigital.com`), jako 021.
- Deploy: `git push` → Coolify → `npm run purge`.
- Pořadí rolloutu: (1) migrace + slovník + extrakce + uložení, (2) backfill, (3) filtr UI + formulář, (4) SEO landingy + JSON-LD, (5) MCP. Každý krok samostatně nasaditelný.

## Otevřené drobnosti (k potvrzení v plánu)

- Finální vyčíslení slugů/optionLabels pro všech 19 kategorií (výplňová práce).
- Které konkrétní atributy dostanou `seoLanding: true` (start: `klimatizace`, `pohon-4x4`, `celni_nakladac`, `tp_spz` u traktorů).
- Práh N pro index (návrh 3).
