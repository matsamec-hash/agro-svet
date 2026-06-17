# agro-svet.cz UK fáze 4d — `/uk/dotace` (kurátovaný hub ukrajinské zemědělské podpory)

**Datum:** 2026-06-17
**Větev:** `feat/i18n-uk-faze4d-dotace` (worktree `~/agro-svet/.worktrees/uk-faze4d-dotace`, z `master` `502803d`)
**Track:** UK (ukrajinská) lokalizace #3, fáze 4d (poslední velký kus). Navazuje na 4a/4b/4c.

## Cíl

Lokalizovat `/dotace` do ukrajinštiny jako **kurátovaný hub reálné ukrajinské zemědělské podpory**
a zapnout indexaci pod `/uk`, **BEZ jakékoli změny CS/SK výstupu** (byte-identický).
Publikum = Ukrajinci v UA → ukrajinské programy podpory. **Nejvyšší riziko track #3 = verifikace
volatilních dotačních dat** (částky/sazby/termíny — válkou zkreslené, často se mění).

## Klíčové rozhodnutí (z brainstormingu)

CS `/dotace` = 100% **česká jurisdikce** (SZIF / SP SZP intervenční kódy „33.73" apod.). SK verze to
přeložila na slovenskou PPA. Pro Ukrajince v UA jsou české dotace **věcně irelevantní** → NEpřekládáme
českou kolekci. Místo toho **izolovaný kurátovaný hub** o reálné UA podpoře (vzor 4b/4c).

### Tvar obsahu — 4 schválené bloky

| Blok | Obsah | Grounding | Riziko |
|---|---|---|---|
| **Jak podpora funguje** | Державний аграрний реєстр (ДАР) jako kanál + žádosti přes Diia; kdo má nárok, registrace | minagro.gov.ua, diia.gov.ua | nízké (evergreen) |
| **Válečné granty** | Mikrogranty (~do 250 tis. UAH), zahradnictví/skleníky, dobytek, zpracování (єРобота / st. rozpočet) | minagro / KMU / diia | **vysoké** (částky volatilní) |
| **Úvěry 5-7-9 %** | „Доступні кредити 5-7-9" — částečná kompenzace úroků pro agro | program 5-7-9 / BDF | střední |
| **EU + donoři** | Ukraine Facility (EU), FAO, World Bank, USAID AGRO, EBRD | donor weby | nízké-střední |

**⚠️ Tvrdá brána:** každá volatilní hodnota (částka grantu, úroková sazba, strop) jen se `source`+`url`+`asOf`;
co nelze ugroundit → **DROP** (popíšeme kvalitativně, nevymýšlíme číslo). `warCaveat` nahoře.

## Architektura — izolace + gating dětských rout (4d je složitější než 4b/4c)

Na rozdíl od puda/statistiky (single hub) má `/dotace` víc rout. Plán:

- **Hub:** nová `src/components/dotace/DotaceUk.astro` (vzor `PudaUk.astro`/`StatistikyUk.astro`) —
  self-contained, čte jen UA data, `useTranslations('uk')`, `Intl.NumberFormat('uk-UA')`. Bez grafů
  (žádný buildLineChart) — jen hero + warCaveat + timeline + karty programů + donoři + zdroje + PillsNav.
- **Route delegace:** `src/pages/dotace/index.astro` (Layout je ř. 37–123) → na začátku těla
  `{locale === 'uk' ? <DotaceUk /> : ( …stávající CS/SK Layout… )}`. CS/SK větev **byte-identická**.
- **`/uk/dotace/[slug]/`** → **404** pro uk. ⚠️ Dnes `[slug].astro` (ř. ~17–21) pro uk čte
  `getEntry('dotace', slug)` (CS kolekce) → **leak CS obsahu na /uk URL**. Přidat uk-větev: pro
  `locale === 'uk'` ponechat `titul = undefined` → existující `if (!titul) return 404`. NE fallback na CS.
- **`/uk/dotace/kalendar-kol/`** → **302→`/uk/dotace/`**. Dnes pro uk čte `kolaCs` (český SZIF kalendář).
  Přidat na začátek frontmatteru gate: `if (locale === 'uk') return Astro.redirect(\`${linkBase('uk')}/dotace/\`, 302)`.
- **`/uk/dotace/jak-vybrat/`** → už dnes `if (locale !== 'cs') return Astro.redirect(\`${base}/dotace/\`, 302)`.
  **Beze změny.**
- **Data:** nový `src/data/agro-dotace-uk.json` (kurátovaný tvar, každé volatilní pole source+url+asOf).
- **Lib:** nový `src/lib/dotace-uk.ts` = **jen typy** `DotaceUkData` (žádné grafy/derivace).
  **`src/i18n/dotace.ts` (copy) ani SZIF kolekce `dotace`/`dotaceSk` NEdotčeny.**
- **i18n:** `dotace.uk.*` klíče v `src/i18n/ui/uk.ts`.
- **Sitemap:** zrcadlit jen `/uk/dotace/` (hub). `isDotaceDetailPath` už vylučuje `[slug]` i `jak-vybrat`
  (vše pod `/dotace/` kromě `/dotace/` a `/dotace/kalendar-kol/`). **Přidat do uk filtru explicitní
  vyloučení `/dotace/kalendar-kol/`** (jinak by se zrcadlilo, ale pro uk 302uje).
- **Launch:** `LAUNCHED_PREFIXES.uk += '/dotace'` = POSLEDNÍ task. Hreflang se zrcadlí auto.

### `agro-dotace-uk.json` — navržené schema

```jsonc
{
  "generated": "2026-06-17",
  "warCaveat": "<UA: programy a částky se za války mění; ověřte aktuální podmínky na oficiálních kanálech>",
  "howItWorks": [
    { "title": "<Державний аграрний реєстр>", "text": "<jak funguje>", "source": "Мінагрополітики", "url": "https://minagro.gov.ua/..." }
    // 3–5 evergreen kroků (ДАР + Diia)
  ],
  "programs": [
    { "name": "<грант на садівництво>", "type": "Грант", "summary": "<...>",
      "amount": "<до 250 тис. грн>", "amountNote": "<podmínka>", "eligibility": "<kdo>",
      "source": "Мінагрополітики / Дія", "url": "https://...", "asOf": "<2025>" }
    // válečné granty + 5-7-9 úvěry; volatilní amount jen se source+asOf, jinak vynechat amount
  ],
  "donors": [
    { "name": "Ukraine Facility (EU)", "what": "<co financuje>", "url": "https://..." }
    // EU, FAO, World Bank, USAID AGRO, EBRD
  ],
  "sources": [ { "label": "Мінагрополітики", "url": "https://minagro.gov.ua/" } ]
}
```

Hodnoty jsou **ilustrativní placeholdery tvaru** — reálné plní grounded task, ověřuje verifikační brána.

### `dotace-uk.ts` — navržené API (jen typy)

```ts
export interface DotaceUkStep { title: string; text: string; source: string; url: string; }
export interface DotaceUkProgram {
  name: string; type: string; summary: string;
  amount?: string; amountNote?: string; eligibility: string;
  source: string; url: string; asOf: string;
}
export interface DotaceUkDonor { name: string; what: string; url: string; }
export interface DotaceUkSourceLink { label: string; url: string; }
export interface DotaceUkData {
  generated: string; warCaveat: string;
  howItWorks: DotaceUkStep[]; programs: DotaceUkProgram[];
  donors: DotaceUkDonor[]; sources: DotaceUkSourceLink[];
}
```

## Metoda

`writing-plans` → `subagent-driven-development` (každý task: implementer → spec review → code-quality
review). Plus:
- **DATA verifikační brána** (nezávislý opus + web, adversariální) — UA dotační čísla = nejvyšší riziko
  track #3; ověř každou částku/sazbu ≥1 autoritativní zdroj (minagro / KMU / diia / EU / donor weby);
  co nelze → **DROP**.
- **Finální opus review** celého diffu.
- **⚠️ Reconcile s `origin/master` PŘED mergem** (track se vyvíjí).
- **finishing-a-development-branch** (PR → merge → Coolify → živý smoke → úklid).

## Pořadí tasků (návrh pro writing-plans)

1. Lib + typy `src/lib/dotace-uk.ts`.
2. Data scaffold `src/data/agro-dotace-uk.json` + strukturální/atribuční test.
3. Grounded data fill (subagent web) — reálné UA programy/částky.
4. **DATA verifikační brána** (adversariální opus+web) — ověř/DROP.
5. i18n `dotace.uk.*` klíče + keys test.
6. Komponenta `src/components/dotace/DotaceUk.astro`.
7. Route delegace `dotace/index.astro` + ověření CS/SK byte-identity.
8. Gating dětských rout: `[slug].astro` uk→404, `kalendar-kol` uk→302 (+ test že uk nevidí CS obsah).
9. Sitemap: vyloučit `/dotace/kalendar-kol/` z uk mirroru.
10. Launch `LAUNCHED_PREFIXES.uk += '/dotace'` + aktualizace `uk-launch.test.ts` + smoke.
11. Finální opus review → reconcile → PR → merge.

## Prostředí

- Worktree `~/agro-svet/.worktrees/uk-faze4d-dotace`, větev `feat/i18n-uk-faze4d-dotace`.
- `cp .env` do worktree. Live sitemap v preview: `set -a; . ./.env; set +a` před `npm run preview`.
- Node 22: `export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 22`.
- Baseline: 3 pre-existing fails `tests/i18n/nav.test.ts` (bazar-nav) = **NE regrese**.
- Coolify auto-deploy na master push (~75s). CI „Workers Builds" fail = **ignorovat** (stale).

## Přenositelné lekce (4a–4c)

- CS/SK výstup MUSÍ zůstat byte-identický; launch prefix až jako POSLEDNÍ task.
- Izolace uk do vlastní komponenty chrání byte-identitu.
- ⚠️ **4d navíc:** dětské routy (`[slug]`, `kalendar-kol`) by jinak servírovaly CS obsah na /uk URL →
  explicitní uk gating (404 / 302), NE fallback na CS.
- Build přegeneruje `src/generated/content-dates.json` (`_fallback`→dnešek) — build artefakt,
  NEcommitovat (revertnout před PR).
- Assemble velkých dat skriptem `str.replace`, NIKDY Python `re.sub`.
- Data nevymýšlet: plán definuje STRUKTURU, hodnoty plní grounded task + verifikační brána.

## Mimo rozsah (YAGNI)

- Překlad českých SZIF titulů / kolekce `dotace`/`dotaceSk`.
- UK `dotace-uk` markdown kolekce + `[slug]` detail stránky (uk = jen hub; detaily 404).
- UK kalendář kol (kalendar-kol pro uk 302uje).
- Lokalizace `/dotace/jak-vybrat/` (zůstává 302 pro non-cs).
- Změny `dotace.ts` copy / CS / SK výstupu.
- Volatilní částky bez autoritativního zdroje (DROP, ne odhad).
```
