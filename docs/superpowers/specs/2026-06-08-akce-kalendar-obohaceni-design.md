# Obohacení kalendáře akcí — detailní stránky, redakční obsah, fotky, cs/sk/uk

**Datum:** 2026-06-08
**Web:** agro-svet.cz — sekce `/akce/` (Kalendář zemědělských akcí)
**Stav:** návrh schválen (přístup A), čeká review specu → writing-plans

## Cíl

Výrazně vylepšit sekci kalendáře akcí: dát každé akci vlastní **detailní stránku** s plnou
informací, vytvořit **strukturovaný redakční obsah** pro největší známé akce, doplnit **hero
fotky** (kde to jde) a celé to nabídnout v **cs/sk/uk**. Dnes je každá akce jen holý řádek
(odznak typu + název + datum + místo); bohatá data v DB (popis, pořadatel, web, adresa, GPS)
se nikde nezobrazují a detail neexistuje.

## Výchozí stav (ověřeno)

- `/akce/` je **SSR** (`prerender = false`), čte z Supabase DB přes `listUpcoming()`
  (`src/lib/akce-supabase.ts`), zobrazuje jen `stav='zverejneno'`. Jednotný zdroj pro kalendář.
- **31 kurátorovaných akcí** seedováno (`supabase/seeds/akce_kurator_2026.sql`) se známými slugy
  (`zeme-zivitelka-2026`, `agrishow-brno-2026`, `narodni-vystava-hospodarskych-zvirat-2026`, …);
  živě běží velké známé akce (Země živitelka, AGRISHOW, Národní výstava hosp. zvířat, Floria,
  Natura Viva, Zahrada Čech, Náš chov…).
- **Detail `/akce/[slug]` NEEXISTUJE.** Karty se neproklikávají.
- i18n: overlay-kolekce (`encyklopedie`/`encyklopedie-sk`/`encyklopedie-uk` = stejný slug),
  sekce se pouští do sk/uk přes `LAUNCHED_PREFIXES` (`src/i18n/utils.ts`). **Akce tam nejsou.**
- DB = cloud `obhypfuzmknvmknskdwh` (env `SUPABASE_URL`/`SUPABASE_SERVICE_KEY`); zápis do ní
  blokuje auto-mode pojistka + DB se brzy migruje → **vyhýbáme se změnám DB schématu**.

## Architektura — přístup A: obohacovací overlay v repu + fakta z DB

DB zůstává zdrojem **faktů** (datum, místo, pořadatel, web, GPS) → pohání kalendář beze změny.
Nová repo content-kolekce nese **redakční obsah + media + extra praktická fakta**. Detail
spojí oboje po `slug`.

**Zamítnuté alternativy:** B (rozšířit DB schéma — vyžaduje migrace cloudu blokované auto-mode +
hůř reviewovatelné 3 jazyky v DB); C (přesun akcí do repo-kolekce + merge v kalendáři —
duplikace plánovací logiky, větší refaktor hubu).

## 1) Datový model — kolekce `akce` (+ `akce-sk`, `akce-uk`)

V `src/content.config.ts` přidat kolekce `akce`, `akceSk`, `akceUk` (markdown soubor na akci,
pojmenovaný slugem, např. `src/content/akce/zeme-zivitelka-2026.md`). Frontmatter = struktura,
tělo markdownu = hlavní popis. **Fakta (datum/místo/web/GPS) se needuplikují** — berou se z DB.

```yaml
---
slug: "zeme-zivitelka-2026"          # join klíč na akce.slug v DB (required)
perex: "..."                          # 1–2 věty → <meta description> + karta
proKoho: ["zemědělci", "chovatelé", "veřejnost"]
program:
  - "Expozice zemědělské techniky na 21 ha"
  - "Přehlídky hospodářských zvířat"
prakticke:                            # jen veřejně známé info
  vstupne: "150 Kč / děti zdarma"
  doprava: "..."
  parkovani: "..."
historie: "52. ročník, poprvé 1973…"  # volitelný odstavec
faq:
  - q: "Kdy se koná Země živitelka 2026?"
    a: "20.–25. srpna 2026 na výstavišti v Českých Budějovicích."
hero:                                 # volitelné
  src: "/img/akce/zeme-zivitelka-2026.webp"
  alt: "..."
  attribution: "Autor / licence CC BY-SA 4.0"
  zdroj: "https://commons.wikimedia.org/..."
zdrojeObsahu: ["https://www.vystavavb.cz/…"]   # audit/grounding
---
Hlavní redakční text (2–4 odstavce, markdown).
```

Všechna pole kromě `slug` jsou **nepovinná** → základní detail funguje i bez overlaye.
SK/UK overlay = stejný slug, stejná struktura, přeložený obsah.

## 2) Routa a render — `/akce/[slug].astro` (SSR, `prerender = false`)

1. Nový helper `getPublishedBySlug(slug)` v `akce-supabase.ts` (jen `stav='zverejneno'`, jinak 404).
2. `getEntry('akce'|'akceSk'|'akceUk', slug)` dle locale, fallback na cs overlay.
3. Render:
   - **Hlavička:** název, odznak typu, termín (`formatTermin`), místo + odkaz na mapu (lat/lng),
     tlačítka „Web pořadatele", „Přidat do kalendáře" (`.ics` download).
   - **Hero** (overlay) s atribucí, jinak **per-typ ilustrace** (7 typů).
   - **Tělo:** perex → redakční text → Pro koho → Program → Praktické info → Historie → FAQ.
     Chybějící sekce se vynechá.
   - **Fakta sidebar:** pořadatel, web, telefon, e-mail, adresa, GPS — z DB.
   - **Související:** 3–4 nejbližší akce stejného typu/kraje.
   - **JSON-LD `Event`** (name, startDate/endDate, location PostalAddress+geo, organizer, image,
     description, offers pokud známé vstupné) → Google Events rich results.
4. Uživatelské akce (bez overlaye) → tatáž routa, základní detail z DB + JSON-LD z faktů.
   Každá akce má vlastní indexovatelnou URL.

## 3) Hero fotky

- Sourcing volně licencovaných fotek (Wikimedia Commons — areály/výstaviště/minulé ročníky;
  jen CC s atribucí) → konvert webp ~1600px/q82 → self-host `public/img/akce/` (žádné hotlinky).
  Atribuce + zdroj do frontmatteru.
- **Fallback per-typ:** akce bez volné fotky (polní dny, malé trhy) dostanou jednotný ilustrační
  vizuál/ikonu dle typu → karta ani detail nejsou nikdy prázdné.
- **Vizuální kontrola povinná** (lekce ze stadionů: auto-sourcing občas vrátí špatný obrázek) →
  u nejistých radši fallback.

## 4) Lokalizace cs/sk/uk

- Přidat `/akce` do `LAUNCHED_PREFIXES.sk` i `.uk` (`src/i18n/utils.ts`) → `/sk/akce`,
  `/uk/akce` indexovatelné.
- Hub i detail čtou locale, UI labely z i18n slovníku.
- Redakční obsah: `akceSk`/`akceUk` overlaye (stejný slug). Chybí-li overlay → fallback na cs
  prózu, UI/labely zůstanou v jazyce (jako u článků `articles-i18n`).
- Sitemap: `/akce/` + všechny detaily do cs/sk/uk mirrorů + hreflang.
- Pozn.: UK publikum = primárně ukrajinský trh; ČR akce tam dávají menší smysl, ale konzistence
  webu (vše ve 3 jaz.) převažuje a fallback to ošetří. UK próza pro všech 31 akcí dle zadání.

## 5) Vylepšení seznamu `/akce/`

- Karta: perex (1 řádek) pod název, čas + kraj k místu, celá karta klikací → detail.
- **Zvýraznění hlavních akcí** (s overlayem): štítek „Hlavní akce" / jemný rámeček, příp. řazení
  nahoru v rámci měsíce.
- Filtry ponechat; přidat rychlý filtr „jen velké akce".
- Hub: krátký SEO úvod (1 odstavec) + JSON-LD `ItemList`.

## 6) Generování obsahu (těžiště práce)

- ~31 akcí × {perex, próza, proKoho, program, prakticke, historie, faq} × 3 jazyky.
- Subagenti **groundovaní na oficiálních zdrojích** (web pořadatele, Wikipedie) — žádné
  halucinace dat/termínů; fakta křížově proti DB seedu. Tón dle skillu **czech-ag-article-style**.
- cs nejdřív kompletní → pak sk/uk overlaye (překlad + lokalizace, parity klíčů jako encyklopedie).
- Každá akce uvádí `zdrojeObsahu` pro auditovatelnost.
- Anti-thin guardrail: min. délka prózy, jinak se sekce nepustí.

## 7) Fázování

- **Fáze 1 — Plumbing:** kolekce `akce`(+sk/uk) v `content.config.ts`, routa `/akce/[slug]`,
  `getPublishedBySlug`, JSON-LD `Event`, hero render + per-typ fallback, `.ics`, prokliky +
  zvýraznění v hubu, i18n launch (`LAUNCHED_PREFIXES`), sitemap/hreflang. Ověřit na **2 ukázkových
  akcích** (Země živitelka + 1 polní den) end-to-end. Testy.
- **Fáze 2 — Obsah cs:** obohatit všech 31 akcí česky + hero fotky (self-host + atribuce, vizuální
  kontrola).
- **Fáze 3 — sk/uk overlaye:** překlady 31 akcí, parity, fallback ověřen.
- **Fáze 4 (volitelná) — audit velkých akcí:** projít, zda nechybí žádná známá akce, doplnit
  (seed SQL + overlay).

Každá fáze samostatně nasaditelná (worktree).

## Klíčové soubory

| Účel | Cesta |
|------|-------|
| Content kolekce | `src/content.config.ts`, `src/content/akce{,-sk,-uk}/<slug>.md` |
| Detail routa | `src/pages/akce/[slug].astro` (nová) |
| DB helper | `src/lib/akce-supabase.ts` → `getPublishedBySlug` (nový) |
| Termín/format | `src/lib/akce-recurrence.ts` (`formatTermin`) |
| Hub | `src/pages/akce/index.astro` (úprava karet + zvýraznění) |
| i18n launch | `src/i18n/utils.ts` (`LAUNCHED_PREFIXES`) |
| Hero fotky | `public/img/akce/<slug>.webp` |
| Seed (audit/doplnění) | `supabase/seeds/akce_kurator_2026.sql` |

## Rizika / poznámky

- **Synchronizace slugů** repo↔DB: overlay se napojí jen při shodě `slug`. Validace v testu
  (každý overlay slug musí mít DB akci; sirotci = warning).
- **DB write blok:** nové/aktualizované akce (Fáze 4) = SQL seed aplikuje uživatel, jako dosud.
- **Migrace DB** (cloud→VPS) běží paralelně; tento návrh je na ní nezávislý (jen čte přes
  stávající env), schéma nemění.
- **Build:** agro-svet build vyžaduje **node 22** (astro 6.4.x); práce ve worktree, push
  token-in-URL (viz projektová paměť).
