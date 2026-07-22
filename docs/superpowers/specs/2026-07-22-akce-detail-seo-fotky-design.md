# Akce: detail, long-tail SEO, fotky, homepage výpis — design

**Datum:** 2026-07-22
**Branch:** `feat/akce-detail-seo-fotky`
**Rozsah:** F1 + F2 + F3 (schváleno uživatelem)

## Kontext / motivace

Sekce `/akce/` má hotový datový model, hub s filtry + mini-kalendářem, formulář a admin
moderaci, plus ~30 kurátorských akcí v seedu. Chybí ale:

1. **Detail akce** — karty hubu nikam neodkazují, `slug` (unique) je nevyužitý.
2. **Long-tail SEO** — žádné landing pages (v `akce-constants.ts` je rezervovaná routa `/akce/typ/[typ]/`).
3. **Fotky** — ani bucket, ani pole ve formuláři (schéma má nevyužité `og_image`).
4. **Homepage výpis** — nadcházející akce nejsou nikde na homepage.
5. **Layout hubu** — `max-width: 860px` + jednosloupcový výpis → na širokém monitoru úzký proužek
   (zbytek webu jede 1280px).

## Cíle

- Každá akce má vlastní SEO stránku s `Event` JSON-LD (rich results).
- Long-tail landing pages podle typu a kraje (a kombinace) — s **pojistkami proti tenkému obsahu**.
- Možnost přidat fotku (odesílatel i admin), fotka slouží i jako OG image.
- Nadcházející akce na homepage + rozšířený layout hubu.

## Architektura — 3 fáze

### F1 — Detail + hub redesign + homepage + sitemap

**Datová vrstva (`akce-supabase.ts`):**
- `getBySlug(slug): Promise<Akce | null>` — jen `stav='zverejneno'`.
- `listRelated(a: Akce, limit=4): Promise<Akce[]>` — stejný kraj nebo typ, mimo sebe, nadcházející.

**`structured-data.ts`:**
- `eventSchema(a: Akce): object` — schema.org/Event: `name`, `startDate`/`endDate` (z termínu),
  `eventStatus`, `eventAttendanceMode`, `location` (Place + PostalAddress + geo z lat/lng),
  `organizer`, `image`, `url`, `description`, `isAccessibleForFree`. Opakované akce → `eventSchedule`
  nebo první výskyt jako `startDate` (fallback `pristi_vyskyt`).

**Detail `/akce/[slug].astro`** (`prerender = false`):
- Statické routy `typ/` a `kraj/` mají v Astro přednost před `[slug]`, takže nekolidují.
- Obsah: název, typ (badge), termín (`formatTermin`), místo (obec/okres/kraj, adresa, mapový odkaz
  z lat/lng), popis, pořadatel/web/telefon, fotka (nebo per-typ fallback), tlačítko **.ics** („přidat do kalendáře"),
  blok **souvisejících akcí** (`listRelated` → interní prolinkování), CTA „Přidat akci".
- `<Layout ogImage={foto ?? typFallback} ogType="article">` + inject `eventSchema` + `breadcrumbSchema`.
- Neexistující/nezveřejněný slug → `Astro.rewrite('/404')`.
- `.ics`: generováno klientsky (data-atributy) nebo přes `/api/akce/[slug].ics` — zvoleno klientské
  (žádný další endpoint, VEVENT sestaven z data-atributů).

**Hub redesign (`akce/index.astro`):**
- `max-width: 1280px`. 2sloupcový layout: **sticky levý sloupec** (filtry + mini-kalendář) +
  **hlavní výpis vpravo**; karty do grid (na širokém 2 sloupce). Pod ~900px → 1 sloupec (sidebar nahoře).
- `.akce-item` zůstává (filter JS beze změny), obsah obalen `<a href="/akce/{slug}/">`.
  → `akceData`/`groupByMonth` rozšířit o `slug`.

**Homepage (`index.astro`):**
- Nový island `components/UpcomingEvents.astro` (`server:defer`, jako `LatestArticles`) → `listUpcoming(6)`.
- Sekce „Nadcházející akce" pod novinky, styl stávajících karet, CTA „Celý kalendář →" → `/akce/`.
- Prázdný stav → island se nevykreslí (žádná prázdná sekce).

**Sitemap (`sitemap.xml.ts`):** přidat všechny zveřejněné `/akce/{slug}/` + landing (typ, kraj) URL.

### F2 — Long-tail SEO landing pages

Routy (`prerender = false`, SSR — obsah se mění moderací):
- `/akce/typ/[typ].astro` — 7 typů. H1 „Farmářské trhy v ČR" apod.
- `/akce/kraj/[kraj].astro` — 14 krajů. H1 „Zemědělské akce v Jihočeském kraji".
- `/akce/typ/[typ]/[kraj].astro` — kombinace (long-tail objem).

Data: `listByTyp`, `listByKraj`, `listByTypAndKraj` v `akce-supabase.ts`.

**Pojistky proti tenkému obsahu (poučení z worldstadiumsmap):**
- **Práh indexace:** stránka s `< 3` nadcházejícími akcemi → `noindex` (přes `Layout noindex`),
  ale zůstává přístupná (UX). Kombinace bez akcí → `noindex` vždy.
- **Evergreen copy:** ke každému typu (`akce-constants`) a kraji krátký statický úvod (2–3 věty),
  aby stránka měla samostatnou hodnotu i mimo sezónu.
- `CollectionPage` + `breadcrumbSchema` JSON-LD; validní neplatný typ/kraj → `rewrite('/404')`.
- Interní prolinkování: typ ↔ kraj ↔ kombinace + odkaz na hub.

### F3 — Fotky

**Schéma (migrace `017_akce_foto.sql`):**
- `ALTER TABLE akce ADD COLUMN foto_path text;` (cesta v bucketu, public URL se derivuje).
- Bucket `akce-images` (public read) + policies (idempotentně; nebo poznámka o ručním založení
  v self-hosted Supabase — viz split-brain).

**Upload — anonymní odesílatel:**
- Formulář `pridat.astro`: volitelný `<input type="file" name="foto" accept="image/*">` (1 fotka).
- `submit.ts` rozšířit: pokud přišel soubor → validace (typ jpeg/png/webp, max 5 MB),
  `edgeThrottle` (bucket `akce-foto`, klíč IP, max ~5/h), upload do `akce-images`,
  `foto_path` uložit do insertu. Publikuje se až po moderaci (gate existuje).
- Admin moderace: zobrazit náhled fotky, možnost **nahrát/nahradit/odebrat** fotku
  (`/admin/akce/api/foto` nebo rozšířit `moderate.ts`).

**Zobrazení:** detail (hero), hub karta (thumbnail), homepage island, OG image.
Bez fotky → per-typ fallback ilustrace (statická v `/public`).

## Rozhodnutí (k revizi)

- **1 fotka/akce** (ne galerie) — YAGNI, lze rozšířit.
- **Fotka od anonyma povolena**, jištěno moderací + rate-limit + typ/velikost.
- **Práh indexace landing = 3 akce**; nižší → `noindex` (ne blokace).
- **Akce cs-only** (české akce) — žádné `/sk`, `/uk` varianty.

## Mimo rozsah

- SK/UK verze akcí. Feed import (`zdroj='feed'` je v schématu připraveno). Galerie fotek.
- Generovaný OG obrázek (zatím fotka nebo statický per-typ fallback).

## Verifikace

- `astro check` + `npm run build` bez chyb.
- Detail: validní `Event` JSON-LD (Rich Results Test), .ics se stáhne a naimportuje.
- Landing: `noindex` u tenkých, breadcrumb + CollectionPage validní.
- Hub: 1280px, 2 sloupce, karty prokliknutelné, filtry/kalendář fungují beze změny.
- Homepage: island se odloží, prázdný stav se nevykreslí.
- Foto: upload z formuláře i adminu, zobrazení + OG.
