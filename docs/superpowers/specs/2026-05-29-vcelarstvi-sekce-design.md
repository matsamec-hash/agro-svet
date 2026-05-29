# Včelařství — nová obsahová sekce agro-svet.cz

**Datum:** 2026-05-29
**Stav:** Schváleno (brainstorming) → čeká na implementační plán

## Cíl

Přidat na agro-svet.cz uceleou včelařskou sekci `/vcelarstvi/` jako nový long-tail
SEO pilíř (mirror existujícího vzoru webu: katalog + slovník + průvodci + kvíz).
Cílová skupina: začínající i pokročilí včelaři, lidé hledající informace o medu,
včelách a vybavení. Sekce je zároveň přípravou pro chystaný mapový feature
(eko-farmy), kam přibude typ entity „včelař / včelí farma".

Nyní na webu **není žádný včelařský obsah** — čistá louka, minimální kanibalizace.

## Architektura — mapování na existující patterny

Sekce nezavádí nové technické vzory. Každý blok recykluje osvědčený pattern webu:

| Blok | Pattern (vzor) | Úložiště | Route |
|------|----------------|----------|-------|
| Hub | `index.astro` rozcestník | — | `/vcelarstvi/` |
| Druhy včel | `plemena/` YAML + `import.meta.glob` | `src/data/vcelarstvi/vcely.yaml` | `/vcelarstvi/druhy/[slug]/` |
| Slovník hesel | **rozšíření** stávajícího `SLOVNIK` | `src/lib/slovnik.ts` | `/slovnik/[slug]/` (sdílené) |
| Vybavení | YAML katalog (jako plemena) | `src/data/vcelarstvi/vybaveni.yaml` | `/vcelarstvi/vybaveni/[slug]/` |
| Druhy medu | YAML katalog + srovnávací tabulka | `src/data/vcelarstvi/med.yaml` | `/vcelarstvi/med/[slug]/` |
| Průvodci | stávající `howto` MD kolekce | `src/content/howto/*.md` | `/jak-na-to/[slug]/` |
| Kvíz | **rozšíření** stávajícího `kviz.ts` | `src/lib/kviz.ts` | `/kviz/[slug]` |
| Kalkulačky (stretch) | `kalkulacka/` astro | `src/pages/kalkulacka/*` | `/kalkulacka/[slug]/` |

### Společná knihovna `src/lib/vcelarstvi.ts`

Mirror `plemena.ts`: typované interface + `import.meta.glob` loadery s cache pro
`vcely.yaml`, `vybaveni.yaml`, `med.yaml`. Funkce: `getAllVcely()`, `getVcela(slug)`,
`getAllVybaveni()`, `getVybaveni(slug)`, `getAllMed()`, `getMed(slug)`. Label mapy
(kategorie vybavení, typ snůšky apod.) jako exportované konstanty.

## Datová schémata

### Druhy včel — `vcely.yaml`
Jeden soubor, pole položek (poddruhy *Apis mellifera* + šlechtěné linie):
```yaml
- slug: kranska
  name: Včela kraňská
  latinsky: Apis mellifera carnica
  alternative_names: [kraňka, carnica]
  puvod: Slovinsko / Alpy
  temperament: mírná          # mírná | střední | obranná
  medny_vynos: vysoký          # nízký | střední | vysoký | velmi vysoký
  rojivost: vyšší              # nízká | střední | vyšší
  zimuvzdornost: výborná
  vhodnost_cr: dominantní      # textový popis vhodnosti pro ČR
  barva: hnědošedá
  description: "…2–4 odstavce…"
  image_url: /images/vcelarstvi/druhy/kranska.webp
  wikipedia: https://cs.wikipedia.org/wiki/V%C4%8Dela_kra%C5%88sk%C3%A1
  wikidata: https://www.wikidata.org/wiki/Q…
  faq:
    - q: "Je kraňka vhodná pro začátečníka?"
      a: "…"
```
Položky: **kraňka, tmavá včela (mellifera mellifera), italka (ligustica),
buckfast, kavkazská (caucasica), vlašská** (~6).

### Vybavení — `vybaveni.yaml`
```yaml
- slug: nastavkovy-ul
  name: Nástavkový úl
  kategorie: ul               # ul | ochrana | naradi | zpracovani | krmeni
  popis_kratky: "…1 věta pro AI Overviews…"
  description: "…výklad…"
  pro_zacatecniky: true
  orientacni_cena: "2 500–6 000 Kč za nástavek"
  image_url: /images/vcelarstvi/vybaveni/nastavkovy-ul.webp
  related: [langstroth, mezistena]   # slugy v rámci katalogu
```
Položky (~8–10): typy úlů (nástavkový, Langstroth, Optimal, Tachovský),
ochrana (kukla/oblek, rukavice, kuřák), medomet, rozpěrka + smetáček, mezistěny,
krmítka, výtopka na vosk.

### Druhy medu — `med.yaml`
```yaml
- slug: akatovy
  name: Akátový med
  typ: kvetovy                # kvetovy | medovicovy | smiseny
  zdroj_snusky: akát (Robinia pseudoacacia)
  barva: světle žlutá až čirá
  chut: jemná, sladká
  krystalizace: velmi pomalá  # velmi pomalá | pomalá | střední | rychlá
  popis_kratky: "…1 věta…"
  description: "…výklad: vlastnosti, využití, doba sběru…"
  image_url: /images/vcelarstvi/med/akatovy.webp
```
Položky (~7): květový, medovicový (lesní), akátový, lipový, řepkový, pohankový,
pastovaný. Na hubu `/vcelarstvi/med/` srovnávací tabulka (barva/chuť/krystalizace).

### Slovník — rozšíření `slovnik.ts`
- Přidat do `SlovnikKategorie` union hodnotu `'vcelarstvi'`.
- Doplnit do `SLOVNIK` ~50 hesel (matka, dělnice, trubec, plástev, rámek,
  nástavek, plodiště, medník, mateří kašička, propolis, vosk, snůška, rojení,
  oddělek, varroáza, mor včelího plodu, medomet, mezistěna, rozpěrka,
  zavíčkování, plást, mateří mřížka, oddělené, dymák/kuřák, …).
- Ověřit, že stránky slovníku/kategorie label novou kategorii zobrazí (najít
  místo, kde se `SlovnikKategorie` mapuje na český název, a doplnit).

### Průvodci — `howto` MD (žádná změna schématu)
Nové soubory v `src/content/howto/`:
1. `jak-zacit-vcelarit.md` — start: úl, včelstvo, registrace, první sezóna.
2. `vcelarsky-rok.md` — kalendář prací po měsících (steps = měsíce/úkony).
3. `boj-s-varroazou.md` — monitoring + ošetření (kyselina šťavelová/mravenčí).
4. `zpracovani-medu.md` — vytáčení, cezení, pastování, skladování.
5. `zazimovani-vcelstev.md` — krmení, zateplení, kontrola zásob.
6. `registrace-vcelaru.md` — ČMSCH, hlášení stanovišť, legislativa.

### Kvíz — rozšíření `kviz.ts`
1–2 nové kvízy: „Jaká včela pro vás" a/nebo „Jaký úl pro začátečníka". Stejná
struktura jako existující kvízy (otázky → vážené výstupy odkazující na
`/vcelarstvi/druhy/` resp. `/vcelarstvi/vybaveni/`).

### Kalkulačky (stretch — volitelné v rámci shipu)
- `/kalkulacka/vynos-medu/` — odhad výnosu (počet včelstev × prům. výnos).
- `/kalkulacka/zazimovani-cukr/` — spotřeba cukru na zazimování (kg/včelstvo).

## Routing, sitemap, navigace

- Každá `[slug].astro` detail stránka: `export const prerender = true;` +
  `getStaticPaths()` z odpovídajícího loaderu.
- **Sitemap** (`src/pages/sitemap.xml.ts`): přidat statické huby (`/vcelarstvi/`,
  `/vcelarstvi/druhy/`, `/vcelarstvi/vybaveni/`, `/vcelarstvi/med/`) + dynamicky
  vygenerovat všechny detailní URL z loaderů. **Ověřit, že sitemap nemá vlastní
  limit, který by sekci ořízl** (lekce z minula — sitemap/prerender mismatch).
- **Navigace** (`src/components/Header.astro`): nová top-level položka
  `Včelařství` (`/vcelarstvi/`) se submenu: Úvod, Druhy včel, Vybavení, Druhy
  medu, Slovník (filtr), Průvodci. Umístit za „Zvířata".

## Obrázky

`public/images/vcelarstvi/{druhy,vybaveni,med}/`. Druhy včel → Wikidata P18
batch pattern (cs.wikipedia/Commons). Vybavení/med → kde chybí volný snímek,
fallback AI `gpt-image-1`. `image_url` jako absolutní path (`.startsWith('http')`
guard už ve schématech existuje).

## Obsah a kvalita

- **Strukturovaný katalog** (vcely/vybaveni/med, slovník) — ručně kurátorováno
  s ověřenými fakty, NE AI-generováno (riziko halucinací cen/latinských názvů).
- **Próza** (průvodci, longform popisy) — psána ve stylu `czech-ag-article-style`
  skill (tón, struktura, délka).
- Cross-linking: slovník ↔ druhy ↔ vybavení ↔ med ↔ průvodci (interní odkazy,
  `related` pole). Auto-linker (`auto-linker.ts`) může nová hesla zapojit napříč
  webem.
- JSON-LD: druhy/med/vybavení detail → vhodné schema (Article/FAQPage kde je
  FAQ); průvodci už mají HowTo JSON-LD z howto patternu.

## Mapa farem (mimo tento spec — pouze příprava)

Mapový eko-farmy feature dostane typ entity „včelař/včelí farma". Zde se nic
nestaví; spec jen deklaruje, že sekce `/vcelarstvi/` bude cílem prolinkování
z map. detailů a naopak.

## Mimo rozsah (YAGNI)

- Žádná DB tabulka (vše je build-time statický katalog jako plemena).
- Žádný uživatelský obsah / komentáře.
- Žádný e-shop ani ceník v reálném čase (ceny jen orientační v katalogu).
- Vlastní mapa včelařů (řeší samostatný feature).

## Akceptační kritéria

1. `/vcelarstvi/` hub odkazuje na všechny podsekce a renderuje se.
2. ≥6 druhů včel, ≥8 položek vybavení, ≥7 druhů medu — každý s detail stránkou.
3. ≥50 nových slovníkových hesel kategorie `vcelarstvi`, viditelných v `/slovnik/`.
4. ≥6 průvodců v `/jak-na-to/` s validním HowTo JSON-LD.
5. ≥1 nový kvíz.
6. Všechny nové URL v sitemapě, žádná není oříznuta limitem.
7. „Včelařství" v hlavní navigaci.
8. `npm run build` projde bez chyb; spot-check 5 URL = 200.
