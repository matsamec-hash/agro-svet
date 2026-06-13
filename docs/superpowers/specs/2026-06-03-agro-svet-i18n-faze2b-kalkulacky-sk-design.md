# Fáze 2b — SK kalkulačky (design spec)

**Datum:** 2026-06-03
**Projekt:** agro-svet.cz i18n (SK lokalizace), navazuje na Fázi 1 (katalog) + Fázi 2a (novinky)
**Rozsah:** odemčení sekce `/kalkulacka` pro `/sk` — 5 kalkulaček, krom `dotace-cap`

---

## 1. Cíl a kontext

Sekce `/kalkulacka` je dnes pro `/sk` jurisdikčně uzamčená (`LOCKED_SECTION_PREFIXES` v `src/i18n/nav.ts` → middleware 307 → cs). Důvod locku byl plošný (skupina s dotace/statistiky/puda). Kalkulačky jsou ale z velké části **jurisdikčně neutrální** — hektar je hektar i v SK, převody jednotek/hmotnosti nezávisí na zemi. Tato fáze je odemyká pro SK přeložením obsahu a launchnutím (indexovatelné).

**Co se NEodemyká:** `/kalkulacka/dotace-cap` (ryze CZ — SZIF/CAP přímé platby) zůstává locked → 307 na cs. Ostatní 2b subsystémy (dotace, statistiky, půda) jsou mimo rozsah této fáze (vlastní spec později).

### Kalkulačky v rozsahu (5)
| slug | povaha | měna | poznámka |
|---|---|---|---|
| `prevody-jednotek` | univerzální převodník plochy | — | komponenta `AreaConverter.astro` |
| `prevody-hmotnost` | univerzální převodník hmotnosti | — | komponenta `WeightConverter.astro` |
| `leasing-traktoru` | finanční (RPSN/splátka) | Kč → € | **SK zgenerizovat** (viz §5) |
| `uspora-nafty` | finanční (návratnost paliva) | Kč → € | inline JS ve stránce |
| `naklady-na-hektar` | finanční (provozní náklady) | Kč → € | inline JS ve stránce |
| ~~`dotace-cap`~~ | CZ dotace | — | **zůstává locked** |

---

## 2. Architektura překladu — per-kalkulačka i18n modul

Každá kalkulačka dostane co-located typovaný slovník v `src/i18n/kalkulacka/<slug>.ts`:

```ts
// src/i18n/kalkulacka/prevody-jednotek.ts
import type { Locale } from '../config';

export interface CalcContent {
  title: string;            // <title> + H1
  metaDescription: string;  // meta description
  intro?: string;           // úvodní próza (HTML povolené)
  faq: { q: string; a: string }[];
  labels: Record<string, string>;  // form/UI labely renderované server-side
  js: Record<string, string>;      // stringy předané do inline <script> přes define:vars
  currency?: string;        // jen finanční calc; '€' pro sk, 'Kč' pro cs
}

export const content: Record<Locale, CalcContent> = {
  cs: { /* stávající české stringy přesunuté z .astro */ },
  sk: { /* AI-přeložené, revidované */ },
  uk: { /* ve Fázi 3; zatím fallback na cs */ },
};
```

**Proč per-calc modul a ne globální `ui.ts` klíče:** kalkulačky mají stovky specifických stringů (bohaté FAQ, metodika). Naházet je do `ui/cs.ts`/`ui/sk.ts` by ten soubor neúnosně nafouklo. Co-located modul drží cs+sk vedle sebe → snadná synchronizace a review.

**Stránka se stane locale-aware** (vzor z Fáze 2a):
```astro
const locale = getLocaleFromUrl(Astro.url);
const c = content[locale] ?? content.cs;   // per-field fallback na cs
// server render z `c`; inline script: <script is:inline define:vars={{ JS: c.js, currency: c.currency }}>
```

`uk` zatím není launchnuté → fallback na cs (žádný uk překlad v této fázi).

### Překladová plocha
- **5 page souborů** (`src/pages/kalkulacka/<slug>/index.astro`) — meta, breadcrumb, FAQ, próza, labely, inline JS stringy
- **2 sdílené komponenty** (`AreaConverter.astro`, `WeightConverter.astro`) — výsledkové labely; symboly jednotek (ha, m², t, kg) zůstávají univerzální, překládají se jen popisné texty
- **hub** `src/pages/kalkulacka/index.astro` — `name`/`short`/`description` karet locale-aware

### SK překlad obsahu
Bulkovou prózu (FAQ, intro, metodika) přeložit jednou přes stávající pipeline `scripts/i18n-translate.py` (sonnet draft + opus editor, glosář CZ→SK). Krátké labely lze přeložit přímo. **Ceny/jednotky v textech** drž dle glosáru — obecné výroky poslovenštit, ale univerzální matematika (1 ha = 10 000 m²) je shodná. Výstup ulož do `cs`/`sk` v per-calc modulu, revize před launchem.

---

## 3. Routing / gating

Granularita locku se prohloubí o úroveň (dnes plošně `/kalkulacka`):

**`src/i18n/nav.ts` → `LOCKED_SECTION_PREFIXES`:**
- ubrat `/kalkulacka`
- přidat `/kalkulacka/dotace-cap`

→ `/sk/kalkulacka/dotace-cap` zůstane 307 → `/kalkulacka/dotace-cap` (cs); ostatní `/sk/kalkulacka/*` se servírují.

**`src/i18n/utils.ts` → `SK_LAUNCHED_PREFIXES`:**
- přidat `/kalkulacka` (SK kalkulačky indexovatelné, noindex zhasne)

**Priorita:** lock musí mít přednost před launch. Ověřit v middleware/page-head, že `isLockedSectionPath('/kalkulacka/dotace-cap')` se vyhodnotí PŘED `isSkLaunchedPath`, aby dotace-cap nezískala index. (Dnes lock = redirect v middleware, takže se k indexovatelnosti vůbec nedostane — ověřit.)

**Hub `/kalkulacka/index.astro`:** na `/sk` skrýt kartu `dotace-cap` (filtr přes `isLockedSectionPath` na `/kalkulacka/<slug>`, vzor z `getNav` skrývání locked).

---

## 4. Měna a defaulty (finanční kalkulačky)

`leasing-traktoru`, `uspora-nafty`, `naklady-na-hektar` v `sk` mapě:
- `currency: '€'` (cs: `'Kč'`) — předané do inline JS přes `define:vars`, použité ve formátování výsledků a v labelech
- SK default vstupní hodnoty (ceny nafty, splátky) přepočítané do € na rozumné SK úrovně
- formátování čísel: cs `cs-CZ`, sk `sk-SK` (oddělovače shodné, měnový symbol z `currency`)

---

## 5. Leasing — zgenerizování SK varianty

`leasing-traktoru` v cs jmenovitě porovnává **české leasingovky** (ČSOB Leasing, John Deere Financial, AGRI CS, AGROTEC). To pro SK nesedí (jiný trh). **Rozhodnutí: SK varianta poskytovatele vypustí** a nechá univerzální RPSN/měsíční splátka/celkové náklady matematiku (vstupy zadává uživatel). cs varianta zůstává beze změny. Žádné vymýšlení SK poskytovatelů (konzistentní s glosářovým pravidlem „nevymýšľaj").

---

## 6. Testy a ověření

**vitest (rozšířit):**
- **cs byte-identita:** vykreslené cs calc stránky se nezmění (regression) — klíčový invariant napříč i18n fázemi
- **parity klíčů:** `content.sk` má přesně stejné klíče jako `content.cs` pro každou kalkulačku (žádný chybějící string → žádný tichý cs fallback v launchnuté sekci)
- **gating:** `isLockedSectionPath('/kalkulacka/dotace-cap') === true`, `isLockedSectionPath('/kalkulacka/prevody-jednotek') === false`; `isSkLaunchedPath('/kalkulacka/prevody-jednotek') === true`
- **hub filtr:** dotace-cap karta není v `/sk` hub seznamu

**Build + smoke živě (po deployi):**
- `/sk/kalkulacka/` → 200, indexable, hub bez dotace-cap karty
- `/sk/kalkulacka/prevody-jednotek/` → 200, indexable, lang=sk, SK FAQ, funkční převodník
- `/sk/kalkulacka/leasing-traktoru/` → 200, € ve výsledcích, bez CZ poskytovatelů
- `/sk/kalkulacka/dotace-cap/` → 307 → `/kalkulacka/dotace-cap` — lock drží
- cs cesty `/kalkulacka/*` beze změny

---

## 7. Deploy

Vzor z Fáze 2a: Node 22, `cp ~/agro-svet/.env .`, `npm run deploy` (wrangler + cf-purge). Branch `feat/i18n-sk-obsah` (worktree `~/agro-svet-i18n-obsah`) → commit → push → PR → squash do master. Žádná DB migrace (kalkulačky jsou statický obsah, ne CMS).

---

## 8. Mimo rozsah (YAGNI)

- `dotace-cap` lokalizace (CZ dotace; nikdy)
- SK dotace (PPA), SK statistiky (Eurostat/ŠÚSR), SK ceny půdy — samostatné 2b subsystémy, vlastní specy
- `uk` překlad kalkulaček (Fáze 3)
- Reálné SK leasingové poskytovatele (jen zgenerizovaná matematika)
