# John Deere — historie značky (vzorová stránka)

**Datum:** 2026-05-29
**Web:** agro-svet.cz
**Cíl:** Vytvořit první „super kvalitní" stránku historie značky (John Deere), encyklopedicky a fakticky přesně (úroveň Wikipedie). Slouží jako vzor pro postupné zpracování ostatních značek (od největších). Sekundárně: kandidát na citaci z cs.wiki článků *Deere & Company* a *John Deere* (osoba).

## Hlavní pravidlo obsahu

**Pouze ověřená fakta ze spolehlivých zdrojů.** Cokoliv nejisté se NEUVÁDÍ — žádné odhady, žádná vymyšlená čísla. Raději vynechat než uvést nepřesnost. Každý netriviální údaj má oporu v sekci Zdroje.

## Existující stav

- Obsah značky: `src/content/znacky/john-deere.md` (markdown body, ~35 řádků, tenké, překlep „historia", bez zdrojů).
- Render: `src/pages/znacky/[slug].astro` (SSR, `prerender = true`), body v `.prose`, pak sekce Modely / Encyklopedie / Žebříčky.
- Schema collection `znacky` v `src/content.config.ts` (name, slug, logo, zeme, zalozena, popis, website, kategorie, wikipedia, wikidata).
- Astro 6, output server (Cloudflare adapter). Sitemap `src/pages/sitemap.xml.ts`.
- Auto-linker `src/lib/auto-linker.ts` linkuje „John Deere" → `/stroje/john-deere/`.

## Struktura stránky (cílový stav)

1. **Úvod** — co je Deere & Company dnes (neutrální).
2. **Zakladatel: John Deere (1804–1886)** — pevná kotva `#zakladatel` (raw `<h2 id="zakladatel">`), citovatelné z osobního wiki článku.
3. **Historie** (próza) — 19. století → éra traktorů (Waterloo Boy, Model D, Two-Cylinder) → globální expanze (Lanz/Mannheim, New Generation 1960) → moderní éra (CVT, precision ag, autonomie).
4. **📅 Časová osa** — vizuální vertikální timeline ze strukturovaného pole `timeline` (rok + událost), NE bullet list. Znovupoužitelné pro další značky.
5. **📊 Společnost v číslech** — snapshot stat-karty (obrat, zaměstnanci, založeno, HQ) + tabulka globálních ukazatelů PODLE LET (obrat, čistý zisk, zaměstnanci, R&D) z výročních zpráv. ČR: tržní podíl jen pokud existuje důvěryhodný veřejný zdroj; jinak kvalitativní popis dealerské sítě. **Per-country zisk/tržby se NEUVÁDÍ** (není spolehlivě veřejné).
6. **John Deere v ČR a SR** — zastoupení, dealerská síť (kvalitativně).
7. **Zdroje** — seznam referencí (jako reference na Wikipedii).

## Datový model (frontmatter rozšíření `znacky`)

Přidat do schématu collection `znacky` (vše optional, aby ostatní značky nepadaly):

- `timeline?: { year: number; label: string; detail?: string }[]`
- `stats?: { revenueUsdBn?: number; netIncomeUsdBn?: number; employees?: number; rdUsdBn?: number; year: number }[]` (řady podle let)
- `snapshot?: { label: string; value: string }[]` (stat-karty)
- `founder?: { name: string; birth?: string; death?: string; note?: string }` (pro schema.org Person)
- `updated?: string` (datum aktualizace pro E-E-A-T)
- `sources?: { title: string; url: string }[]`

## Šablona `[slug].astro` — úpravy

- Styl odkazů v `.prose` (`a` rule chybí).
- Render `<TimelineSection>` z `timeline` pole (vizuální osa), podmíněně.
- Render `<StatsSection>` (snapshot karty + tabulka podle let), podmíněně.
- Render „Zdroje" sekce z `sources`, podmíněně.
- „Aktualizováno: {updated}" řádek.
- Schema.org JSON-LD: doplnit `founder` (Person s birthDate/deathDate) když je `founder` vyplněný.
- Vše podmíněné — značky bez nových polí se renderují beze změny.

## Integrace napříč webem

- `/stroje/john-deere/` (katalog) → callout/odkaz „📖 Historie značky" na `/znacky/john-deere/`.
- Stránky v `/encyklopedie/` filtrované na `znacka === 'john-deere'` → odkaz na historii značky.
- Sitemap: bump priority `/znacky/` stránek + reálný `lastmod`.

## Mimo rozsah (YAGNI)

- Žádná samostatná stránka `/znacky/john-deere/zakladatel` (zakladatel je sekce s kotvou).
- Žádné interaktivní JS grafy (tabulka/SVG stačí, build-time).
- Ostatní značky se řeší až po schválení vzoru.

## Verifikace

- Fakta ověřena web researchem (výroční zprávy Deere, Wikipedia EN/CS jako rozcestník ke zdrojům, registrace traktorů ČR).
- `npm run build` projde (nová pole optional → ostatní značky OK).
- Vizuální kontrola `/znacky/john-deere/` lokálně.
