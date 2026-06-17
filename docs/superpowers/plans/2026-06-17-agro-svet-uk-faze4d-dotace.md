# UK fáze 4d — `/uk/dotace` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lokalizovat `/dotace` do ukrajinštiny jako kurátovaný hub reálné UA zemědělské podpory (NE překlad českých SZIF titulů), zapnout indexaci pod `/uk`, bez jakékoli změny CS/SK výstupu, s explicitním gatingem dětských rout.

**Architecture:** Izolovaná komponenta `DotaceUk.astro` (vzor PudaUk/StatistikyUk) + vlastní data `agro-dotace-uk.json` (každé volatilní pole source+url+asOf) + lib `dotace-uk.ts` (jen typy, žádné grafy). Route `dotace/index.astro` deleguje `{locale==='uk' ? <DotaceUk/> : (…CS/SK…)}`. Dětské routy gated: `[slug]` uk→404, `kalendar-kol` uk→302, `jak-vybrat` už 302 (beze změny). `LAUNCHED_PREFIXES.uk += '/dotace'` poslední. `dotace.ts` copy ani SZIF kolekce netknuté.

**Tech Stack:** Astro (SSR, @astrojs/node), TypeScript, Vitest, JSON import, Intl.NumberFormat('uk-UA'). Node 22.

**Obsah hubu (3 renderované sekce ze 4 obsahových bloků):** howItWorks (ДАР+Diia), programs (válečné granty + úvěry 5-7-9, sloučené s polem `type`), donors (EU/FAO/WB/USAID/EBRD). Volatilní částky jen se source+asOf, jinak DROP.

**Prostředí (každý task):**
```bash
cd /Users/matejsamec/agro-svet/.worktrees/uk-faze4d-dotace
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 22
```
Baseline: 3 pre-existing fails `tests/i18n/nav.test.ts` (bazar-nav) = NE regrese. Spouštět cílené testy.

---

## File Structure

| Soubor | Odpovědnost | Akce |
|---|---|---|
| `src/lib/dotace-uk.ts` | Typy `DotaceUkData` (jen typy) | Create |
| `src/data/agro-dotace-uk.json` | Kurátovaná UA data, source+url+asOf | Create |
| `src/i18n/ui/uk.ts` | `dotace.uk.*` klíče | Modify |
| `src/components/dotace/DotaceUk.astro` | Self-contained UK hub render | Create |
| `src/pages/dotace/index.astro` | Delegace `locale==='uk'` (Layout ř. 37–123) | Modify |
| `src/pages/dotace/[slug].astro` | uk → 404 (NE CS fallback) | Modify |
| `src/pages/dotace/kalendar-kol/index.astro` | uk → 302 `/uk/dotace/` | Modify |
| `src/pages/sitemap.xml.ts` | vyloučit `/dotace/kalendar-kol/` z uk mirroru | Modify |
| `src/i18n/utils.ts` | `LAUNCHED_PREFIXES.uk += '/dotace'` (poslední) | Modify |
| `tests/lib/dotace-uk-data.test.ts` | Strukturální + atribuční test dat | Create |
| `tests/i18n/dotace-uk-keys.test.ts` | Test existence i18n klíčů | Create |
| `tests/i18n/uk-launch.test.ts` | Aktualizovat: `/dotace` → launchnuté (4d blok) | Modify |

---

## Task 1: Lib `dotace-uk.ts` (jen typy)

**Files:** Create `src/lib/dotace-uk.ts`

Typy nemají runtime chování → žádný samostatný unit test; typy konzumuje (a tím kompiluje) datový test v Tasku 2 a komponenta v Tasku 6.

- [ ] **Step 1: Vytvořit `src/lib/dotace-uk.ts`**

```ts
// src/lib/dotace-uk.ts
// Typy pro UK /dotace hub. Kurátovaný UA tvar (NE české SZIF). Každé volatilní pole
// (částka/sazba) nese source+url+asOf; bez derivací/grafů.

export interface DotaceUkStep {
  title: string; text: string; source: string; url: string;
}

export interface DotaceUkProgram {
  name: string;
  type: string;          // např. "Грант" | "Кредит"
  summary: string;
  amount?: string;       // volatilní — jen se source+asOf, jinak vynechat
  amountNote?: string;
  eligibility: string;
  source: string; url: string; asOf: string;
}

export interface DotaceUkDonor { name: string; what: string; url: string; }
export interface DotaceUkSourceLink { label: string; url: string; }

export interface DotaceUkData {
  generated: string;
  warCaveat: string;
  howItWorks: DotaceUkStep[];
  programs: DotaceUkProgram[];
  donors: DotaceUkDonor[];
  sources: DotaceUkSourceLink[];
}
```

- [ ] **Step 2: Ověřit, že soubor type-checkuje**

Run: `npx astro check --minimumSeverity error 2>&1 | grep -i 'dotace-uk' || echo "no errors in dotace-uk"`
Expected: `no errors in dotace-uk`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/dotace-uk.ts
git commit -m "feat(uk-4d): dotace-uk lib — typy DotaceUkData (jen typy)"
```

---

## Task 2: Data scaffold `agro-dotace-uk.json` + strukturální test

Validní tvar s `__TODO__` placeholdery (reálné hodnoty plní Task 3, ověřuje Task 4). URL reálné autoritativní domény už zde.

**Files:** Create `src/data/agro-dotace-uk.json`, Test `tests/lib/dotace-uk-data.test.ts`

- [ ] **Step 1: Write the failing test** `tests/lib/dotace-uk-data.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import data from '../../src/data/agro-dotace-uk.json';
import type { DotaceUkData } from '../../src/lib/dotace-uk';

const d = data as unknown as DotaceUkData;

describe('agro-dotace-uk.json', () => {
  it('má všechny povinné top-level klíče', () => {
    for (const k of ['generated', 'warCaveat', 'howItWorks', 'programs', 'donors', 'sources']) {
      expect(d).toHaveProperty(k);
    }
  });

  it('howItWorks: ≥3 kroky se zdrojem (url http)', () => {
    expect(d.howItWorks.length).toBeGreaterThanOrEqual(3);
    for (const s of d.howItWorks) {
      expect(s.title.length).toBeGreaterThan(0);
      expect(s.url.startsWith('http')).toBe(true);
    }
  });

  it('programs: ≥3, každý má typ, eligibility, atribuci (source/url/asOf)', () => {
    expect(d.programs.length).toBeGreaterThanOrEqual(3);
    for (const p of d.programs) {
      expect(p.type.length).toBeGreaterThan(0);
      expect(p.eligibility.length).toBeGreaterThan(0);
      expect(p.asOf.length).toBeGreaterThan(0);
      expect(p.source.length).toBeGreaterThan(0);
      expect(p.url.startsWith('http')).toBe(true);
    }
  });

  it('donors: ≥3 s url http', () => {
    expect(d.donors.length).toBeGreaterThanOrEqual(3);
    for (const dn of d.donors) {
      expect(dn.name.length).toBeGreaterThan(0);
      expect(dn.url.startsWith('http')).toBe(true);
    }
  });

  it('sources: ≥2 odkazy', () => {
    expect(d.sources.length).toBeGreaterThanOrEqual(2);
  });
});
```

- [ ] **Step 2: Run, expect FAIL** (json not found):

Run: `npx vitest run tests/lib/dotace-uk-data.test.ts`

- [ ] **Step 3: Write scaffold `src/data/agro-dotace-uk.json`**

```json
{
  "generated": "2026-06-17",
  "warCaveat": "Програми та суми державної підтримки під час війни змінюються. Перевіряйте актуальні умови на офіційних каналах (Мінагрополітики, Дія).",
  "howItWorks": [
    { "title": "__TODO__", "text": "__TODO__", "source": "Мінагрополітики", "url": "https://minagro.gov.ua/" },
    { "title": "__TODO__", "text": "__TODO__", "source": "Дія", "url": "https://diia.gov.ua/" },
    { "title": "__TODO__", "text": "__TODO__", "source": "Мінагрополітики", "url": "https://minagro.gov.ua/" }
  ],
  "programs": [
    { "name": "__TODO__", "type": "Грант", "summary": "__TODO__", "amountNote": "__TODO__", "eligibility": "__TODO__", "source": "Мінагрополітики / Дія", "url": "https://minagro.gov.ua/", "asOf": "__TODO__" },
    { "name": "__TODO__", "type": "Грант", "summary": "__TODO__", "amountNote": "__TODO__", "eligibility": "__TODO__", "source": "Мінагрополітики / Дія", "url": "https://diia.gov.ua/", "asOf": "__TODO__" },
    { "name": "Доступні кредити 5-7-9", "type": "Кредит", "summary": "__TODO__", "amountNote": "__TODO__", "eligibility": "__TODO__", "source": "Фонд розвитку підприємництва", "url": "https://bdf.gov.ua/", "asOf": "__TODO__" }
  ],
  "donors": [
    { "name": "Ukraine Facility (EU)", "what": "__TODO__", "url": "https://commission.europa.eu/" },
    { "name": "FAO", "what": "__TODO__", "url": "https://www.fao.org/ukraine/" },
    { "name": "USAID AGRO", "what": "__TODO__", "url": "https://www.usaid.gov/ukraine" }
  ],
  "sources": [
    { "label": "Мінагрополітики", "url": "https://minagro.gov.ua/" },
    { "label": "Дія — державні послуги", "url": "https://diia.gov.ua/" }
  ]
}
```

- [ ] **Step 4: Run, expect PASS** (5 testů):

Run: `npx vitest run tests/lib/dotace-uk-data.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/data/agro-dotace-uk.json tests/lib/dotace-uk-data.test.ts
git commit -m "feat(uk-4d): agro-dotace-uk.json scaffold + strukturální/atribuční test"
```

---

## Task 3: Grounded data fill (subagent web research)

**Výzkumný task.** Dispatchni grounded research subagenta (web). Strukturální test z T2 je gate.

**Files:** Modify `src/data/agro-dotace-uk.json`

- [ ] **Step 1: Dispatch grounded research subagent**

Zadání:
> Naplň `src/data/agro-dotace-uk.json` reálnou ukrajinskou zemědělskou podporou. Pravidla:
> - **Každá volatilní hodnota (částka grantu, úroková sazba, strop) musí mít konkrétní autoritativní zdroj + URL + asOf (rok).** Pokud nelze ugroundit → vynech pole `amount` (ponech kvalitativní `summary`/`amountNote`).
> - **howItWorks (3–5 kroků, evergreen):** Як працює державна підтримка — Державний аграрний реєстр (ДАР) jako kanál, žádosti přes Diia, kdo má nárok, registrace. Zdroje: minagro.gov.ua, diia.gov.ua.
> - **programs (≥4): válečné granty + úvěry 5-7-9.** Příklady (ověř aktuální): mikrogranty pro malé farmáře, гранти на садівництво/теплиці, добуток, переробка (єРобота / st. rozpočet); „Доступні кредити 5-7-9". Každý: name, type ("Грант"/"Кредит"), summary, amount (volatilní string, jen se zdrojem), amountNote, eligibility, source, url, asOf.
> - **donors (≥3): EU + mezinárodní.** Ukraine Facility (EU), FAO, World Bank, USAID AGRO, EBRD — name, what (co financuje v agro), url.
> - Texty ukrajinsky (MSA). Čísla nevymýšlej.
> - Vrať kompletní validní JSON.

- [ ] **Step 2: Ověřit 0 placeholderů**

Run: `grep -c '__TODO__' src/data/agro-dotace-uk.json`
Expected: `0`

- [ ] **Step 3: Strukturální test prochází**

Run: `npx vitest run tests/lib/dotace-uk-data.test.ts`
Expected: PASS (5 testů).

- [ ] **Step 4: Commit**

```bash
git add src/data/agro-dotace-uk.json
git commit -m "feat(uk-4d): grounded UA data — howItWorks, programs (granty/5-7-9), donoři"
```

---

## Task 4: DATA verifikační brána (adversariální opus + web)

**Independent verifikace.** NOVÝ subagent (čistý kontext, opus, web). Nesmí být tentýž co plnil.

**Files:** Modify `src/data/agro-dotace-uk.json`

- [ ] **Step 1: Dispatch adversarial verification subagent**

Zadání:
> Jsi nezávislý fact-checker. `src/data/agro-dotace-uk.json` obsahuje UA dotační data s tvrzenými zdroji. Pro KAŽDÉ číselné/programové tvrzení (program amount/amountNote/eligibility, úrokové sazby, howItWorks fakta):
> 1. Ověř ho proti uvedenému zdroji (otevři URL) A nezávisle ≥1 dalším autoritativním zdrojem (minagro.gov.ua, kmu.gov.ua, diia.gov.ua, bdf.gov.ua, EU/FAO/WB/USAID).
> 2. Sedí → OK. Wrong ale najdeš správné → OPRAV (vč. url/asOf). Nelze ověřit → **DROP** (u částky smaž pole `amount`; u celého programu/donora smaž záznam pokud nelze ověřit ani existenci).
> 3. Default při pochybnosti = DROP/odebrat částku, ne ponechat.
> Hlídej minima testu: howItWorks ≥3, programs ≥3, donors ≥3, sources ≥2 — pokud DROP shodí pod minimum, dohledej ozdrojovanou náhradu.
> Vrať: opravený JSON + tabulku verdiktů (tvrzení → zdroj → OK/OPRAVENO/DROP).

- [ ] **Step 2: Aplikovat verdikt, ověřit minima + 0 placeholderů**

Run: `npx vitest run tests/lib/dotace-uk-data.test.ts && grep -c '__TODO__' src/data/agro-dotace-uk.json`
Expected: PASS (5 testů) + `0`.

- [ ] **Step 3: Commit**

```bash
git add src/data/agro-dotace-uk.json
git commit -m "feat(uk-4d): data verifikační brána — ověřeno/opraveno/DROP (UA dotace)"
```

---

## Task 5: i18n `dotace.uk.*` klíče

**Files:** Modify `src/i18n/ui/uk.ts`, Test `tests/i18n/dotace-uk-keys.test.ts`

- [ ] **Step 1: Write the failing test** `tests/i18n/dotace-uk-keys.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { ui } from '../../src/i18n/ui';

const REQUIRED = [
  'dotace.uk.h.howItWorks', 'dotace.uk.h.programs', 'dotace.uk.h.donors',
  'dotace.uk.sources.h', 'dotace.uk.pills.start',
  'dotace.uk.card.eligibility', 'dotace.uk.card.amount',
];

describe('uk dotace i18n keys', () => {
  it('všechny požadované dotace.uk.* klíče existují', () => {
    for (const k of REQUIRED) {
      expect(ui.uk[k], `chybí uk klíč ${k}`).toBeTruthy();
    }
  });
});
```

- [ ] **Step 2: Run, expect FAIL**

Run: `npx vitest run tests/i18n/dotace-uk-keys.test.ts`

- [ ] **Step 3: Přidat klíče do `src/i18n/ui/uk.ts`** (Edit tool, NE Python re.sub). Vlož blok za poslední `stat.uk.*` klíč (kolem ř. 486):

```ts
  // — dotace UK kurátovaný hub (dotace.uk.*) —
  'dotace.uk.h.howItWorks': 'Як працює державна підтримка',
  'dotace.uk.h.programs': 'Програми підтримки',
  'dotace.uk.h.donors': 'Підтримка ЄС та міжнародних донорів',
  'dotace.uk.sources.h': 'Джерела даних',
  'dotace.uk.pills.start': 'Огляд',
  'dotace.uk.card.eligibility': 'Хто може отримати',
  'dotace.uk.card.amount': 'Сума',
```

- [ ] **Step 4: Run, expect PASS** (+ ověř, že existující uk testy stále procházejí):

Run: `npx vitest run tests/i18n/dotace-uk-keys.test.ts tests/i18n/puda-uk-keys.test.ts tests/i18n/statistiky-uk-keys.test.ts`
Expected: vše PASS.

- [ ] **Step 5: Commit**

```bash
git add src/i18n/ui/uk.ts tests/i18n/dotace-uk-keys.test.ts
git commit -m "feat(uk-4d): dotace.uk.* i18n klíče"
```

---

## Task 6: Komponenta `DotaceUk.astro`

Self-contained UK render. Mirror vizuálu z `src/components/puda/PudaUk.astro` (sdílené třídy `puda-root`,
`sp-hero*`, `war-caveat`, `reforma-section`/`timeline`/`tl-*`, `facts-grid`/`fact*`, `src-link`,
`sources-section`). Bez DataSegmentNav (dotace není data-sekce), bez grafů.

**Files:** Create `src/components/dotace/DotaceUk.astro`

- [ ] **Step 1: Napsat komponentu** (CSS `<style>` blok zkopíruj 1:1 z `PudaUk.astro`, pak doplň 3 níže uvedené selektory):

```astro
---
import Layout from '../../layouts/Layout.astro';
import PillsNav from '../../components/statistiky/PillsNav.astro';
import { useTranslations } from '../../i18n/utils';
import type { DotaceUkData } from '../../lib/dotace-uk';
import raw from '../../data/agro-dotace-uk.json';

const d = raw as unknown as DotaceUkData;
const t = useTranslations('uk');
Astro.response.headers.set('Cache-Control', 'public, max-age=600, s-maxage=86400, stale-while-revalidate=604800');

const PILLS = [
  { label: t('dotace.uk.pills.start'), href: '#howitworks' },
  { label: t('dotace.uk.h.programs'), href: '#programs' },
  { label: t('dotace.uk.h.donors'), href: '#donors' },
];
---

<Layout
  title="Державна підтримка сільського господарства України — гранти, кредити, програми"
  description="Як отримати державну підтримку для аграріїв в Україні: Державний аграрний реєстр і Дія, воєнні гранти, доступні кредити 5-7-9 та підтримка ЄС і донорів."
>
  <main class="puda-root">
    <section class="sp-hero">
      <div class="sp-hero-left">
        <span class="sp-kicker"><span class="dot"></span>ПІДТРИМКА АГРАРІЇВ · УКРАЇНА</span>
        <h1>Державна <em>підтримка</em></h1>
        <p class="sp-hero-lede">Як аграрії в Україні можуть отримати державну підтримку — від реєстрації в Державному аграрному реєстрі до воєнних грантів, доступних кредитів і програм ЄС та міжнародних донорів.</p>
      </div>
      <div class="sp-hero-right">
        <div class="sp-hero-photo" style="background-image:url('/images/kombajn.webp')"></div>
      </div>
    </section>

    {d.warCaveat && <p class="war-caveat">⚠️ {d.warCaveat}</p>}

    <PillsNav items={PILLS} />

    {d.howItWorks.length > 0 && (
      <section class="reforma-section" id="howitworks">
        <h2>{t('dotace.uk.h.howItWorks')}</h2>
        <ol class="timeline">
          {d.howItWorks.map((s) => (
            <li class="tl-item">
              <span class="tl-year">{s.title}</span>
              <div class="tl-body">
                <p>{s.text}</p>
                <a class="src-link" href={s.url} target="_blank" rel="noopener noreferrer">{s.source}</a>
              </div>
            </li>
          ))}
        </ol>
      </section>
    )}

    {d.programs.length > 0 && (
      <section class="facts-grid" id="programs">
        {d.programs.map((p) => (
          <div class="fact prog-card">
            <span class="prog-type">{p.type}</span>
            <span class="fact-lbl">{p.name}</span>
            {p.amount && <span class="fact-val">{p.amount}</span>}
            {p.amountNote && <span class="fact-note">{p.amountNote}</span>}
            <span class="fact-note"><strong>{t('dotace.uk.card.eligibility')}:</strong> {p.eligibility}</span>
            <span class="fact-note">{p.summary}</span>
            <a class="fact-source" href={p.url} target="_blank" rel="noopener noreferrer"><span class="fact-source-prefix">Джерело:</span> {p.source} · {p.asOf}</a>
          </div>
        ))}
      </section>
    )}

    {d.donors.length > 0 && (
      <section class="reforma-section" id="donors">
        <h2>{t('dotace.uk.h.donors')}</h2>
        <div class="topics-grid">
          {d.donors.map((dn) => (
            <a href={dn.url} target="_blank" rel="noopener noreferrer" class="puda-card">
              <h3>{dn.name}</h3>
              <p>{dn.what}</p>
              <span class="card-cta">Детальніше →</span>
            </a>
          ))}
        </div>
      </section>
    )}

    <section class="sources-section">
      <h3>{t('dotace.uk.sources.h')}</h3>
      <ul>
        {d.sources.map((s) => (<li><a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a></li>))}
      </ul>
    </section>
  </main>
</Layout>

<style>
  /* === ZKOPÍRUJ 1:1 celý <style> blok z src/components/puda/PudaUk.astro === */
  /* (puda-root, sp-hero*, war-caveat, reforma-section, timeline, tl-*, facts-grid, */
  /*  fact*, src-link, topics-grid, puda-card, card-cta, sources-section) */
  /* Pak doplň: */
  .prog-card { gap: 6px; }
  .prog-type { display:inline-block; align-self:flex-start; font:600 11px 'Chakra Petch',sans-serif; letter-spacing:.08em; text-transform:uppercase; color:#0A0A0B; background:#FFEA00; border-radius:6px; padding:3px 8px; margin-bottom:6px; }
  .prog-card .fact-val { font-size:22px; }
</style>
```

- [ ] **Step 2: Build (kompiluje jako nepoužitá komponenta — wiring v T7)**

Run: `npm run build 2>&1 | tail -6`
Expected: build úspěšný; žádné errory v `DotaceUk.astro`.

- [ ] **Step 3: Commit**

```bash
git add src/components/dotace/DotaceUk.astro
git commit -m "feat(uk-4d): DotaceUk.astro — kurátovaný hub (jak funguje, programy, donoři)"
```

---

## Task 7: Route delegace + ověření CS/SK byte-identity

**Files:** Modify `src/pages/dotace/index.astro`

- [ ] **Step 1: Zachytit baseline hash CS/SK Layout těla**

Run:
```bash
git show HEAD:src/pages/dotace/index.astro | sed -n '/<Layout/,/<\/Layout>/p' | shasum
```
Poznač si hash.

- [ ] **Step 2: Přidat import** do frontmatteru (za poslední import, kolem ř. 12):

```astro
import DotaceUk from '../../components/dotace/DotaceUk.astro';
```

- [ ] **Step 3: Obalit tělo delegací.** Tělo `<Layout>` je ř. 37–123. Přidej PŘED `<Layout` (ř. 37):

```astro
{locale === 'uk' ? <DotaceUk /> : (
```
a ZA `</Layout>` (ř. 123):
```astro
)}
```
Mezi `<Layout` a `</Layout>` se NESMÍ změnit ani znak.

- [ ] **Step 4: Ověřit byte-identitu**

Run:
```bash
git show HEAD:src/pages/dotace/index.astro | sed -n '/<Layout/,/<\/Layout>/p' > /tmp/d_before.txt
sed -n '/<Layout/,/<\/Layout>/p' src/pages/dotace/index.astro > /tmp/d_after.txt
diff /tmp/d_before.txt /tmp/d_after.txt && echo "BYTE IDENTICAL"
```
Expected: `BYTE IDENTICAL`. Také `git diff src/pages/dotace/index.astro` ukáže JEN +import, +`{locale === 'uk' ? <DotaceUk /> : (`, +`)}`.

- [ ] **Step 5: Build**

Run: `npm run build 2>&1 | tail -5`
Expected: úspěch.

- [ ] **Step 6: Commit**

```bash
git add src/pages/dotace/index.astro
git commit -m "feat(uk-4d): route delegace locale==='uk' → DotaceUk (CS/SK byte-identické)"
```

---

## Task 8: Gating dětských rout (`[slug]` uk→404, `kalendar-kol` uk→302)

**Files:** Modify `src/pages/dotace/[slug].astro`, `src/pages/dotace/kalendar-kol/index.astro`

Dnes pro uk: `[slug].astro` čte `getEntry('dotace')` (CS leak), `kalendar-kol` čte `kolaCs` (CS leak). Oprava:

- [ ] **Step 1: `[slug].astro` — uk → undefined → 404.** Najdi blok (ř. ~17–24):

```astro
const titul = slug
  ? locale === 'sk'
    ? await getEntry('dotaceSk', slug)
    : await getEntry('dotace', slug)
  : undefined;
if (!titul) return new Response(null, { status: 404 });
```
Nahraď podmínku `slug` za `slug && locale !== 'uk'` (uk → undefined → existující 404; žádný CS fallback):
```astro
const titul = slug && locale !== 'uk'
  ? locale === 'sk'
    ? await getEntry('dotaceSk', slug)
    : await getEntry('dotace', slug)
  : undefined;
if (!titul) return new Response(null, { status: 404 });
```

- [ ] **Step 2: `kalendar-kol/index.astro` — uk → 302.** Najdi (ř. ~11–13):

```astro
const locale = Astro.locals.locale ?? 'cs';
const c = content[locale] ?? content.cs;
```
Vlož gate hned za `const locale` řádek (`linkBase` je už importován v tomto souboru):
```astro
const locale = Astro.locals.locale ?? 'cs';
// UA: český SZIF / slovenský PPA kalendář je jurisdikčně irelevantní → 302 na uk hub.
if (locale === 'uk') return Astro.redirect(`${linkBase('uk')}/dotace/`, 302);
const c = content[locale] ?? content.cs;
```

- [ ] **Step 3: Build + ověřit gating ve smoke (preview)**

Run:
```bash
npm run build 2>&1 | tail -3
set -a; . ./.env; set +a
npm run preview & PID=$!; sleep 5
echo "--- /uk/dotace/[slug] → 404 (CS slug nesmí leaknout) ---"; curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/uk/dotace/dotace-pro-mlade-zemedelce/
echo "--- /uk/dotace/kalendar-kol/ → 302/200-redirect ---"; curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/uk/dotace/kalendar-kol/
echo "--- cs detail stále 200 ---"; curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/dotace/dotace-pro-mlade-zemedelce/
echo "--- sk detail stále funguje (404 pokud sk slug chybí — to je OK) ---"; curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/sk/dotace/kalendar-kol/
kill $PID 2>/dev/null
```
Expected: `/uk/dotace/<cs-slug>/` → 404; `/uk/dotace/kalendar-kol/` → 302 (curl bez -L ukáže 302); cs detail → 200; sk kalendar-kol → 200.

- [ ] **Step 4: Commit**

```bash
git add src/pages/dotace/[slug].astro src/pages/dotace/kalendar-kol/index.astro
git commit -m "feat(uk-4d): gating dětských rout — [slug] uk→404, kalendar-kol uk→302 (žádný CS leak)"
```

---

## Task 9: Sitemap — vyloučit `/dotace/kalendar-kol/` z uk mirroru

**Files:** Modify `src/pages/sitemap.xml.ts`

`isDotaceDetailPath` už vylučuje `[slug]` i `jak-vybrat` (vše pod `/dotace/` kromě `/dotace/` a `/dotace/kalendar-kol/`). Pro uk ale i `kalendar-kol` 302uje → vyloučit i to.

- [ ] **Step 1: Přidat vyloučení do uk filtru.** V ukMirror `.filter` (kolem ř. 459, hned za `if (isDotaceDetailPath(p)) return false;`) přidej:

```ts
      if (p === '/dotace/kalendar-kol/') return false; // uk: kalendar-kol 302→/uk/dotace/, nezrcadlit
```

- [ ] **Step 2: Build + ověřit sitemap obsahuje /uk/dotace/ ale ne /uk/dotace/kalendar-kol/**

Run:
```bash
npm run build 2>&1 | tail -3
set -a; . ./.env; set +a
npm run preview & PID=$!; sleep 5
echo "--- /uk/dotace/ v sitemap (≥1) ---"; curl -s http://localhost:4321/sitemap.xml | grep -c '<loc>https://agro-svet.cz/uk/dotace/</loc>'
echo "--- /uk/dotace/kalendar-kol/ NENÍ v sitemap (0) ---"; curl -s http://localhost:4321/sitemap.xml | grep -c '/uk/dotace/kalendar-kol/'
echo "--- /uk/dotace/jak-vybrat/ NENÍ v sitemap (0) ---"; curl -s http://localhost:4321/sitemap.xml | grep -c '/uk/dotace/jak-vybrat/'
kill $PID 2>/dev/null
```
Expected: hub `1`, kalendar-kol `0`, jak-vybrat `0`. (Pozn.: launch prefix přidává až T10 — pokud T9 běží před T10, `/uk/dotace/` ještě nebude v sitemap; pak ověř `/uk/dotace/` count po T10. kalendar-kol/jak-vybrat musí být `0` v každém případě.)

- [ ] **Step 3: Commit**

```bash
git add src/pages/sitemap.xml.ts
git commit -m "feat(uk-4d): sitemap — vyloučit /uk/dotace/kalendar-kol/ z uk mirroru"
```

---

## Task 10: Launch `/dotace` pro uk + aktualizace launch testu + smoke

**Files:** Modify `src/i18n/utils.ts`, `tests/i18n/uk-launch.test.ts`

- [ ] **Step 1: Aktualizovat launch test (TDD).** V `tests/i18n/uk-launch.test.ts`:
(a) Test „NEjsou launchnuté" (ř. ~14–15) — odeber `/dotace` z pole. Protože pak je pole prázdné, změň celý test na asserci, že `/dotace` UŽ JE launchnuté NENÍ správně tady — místo toho **smaž `/dotace` z not-launched testu** a uprav label. Pokud po odebrání zůstane prázdné pole, nahraď tělo testu kontrolou, že cs nikdy gated:
```ts
  it('cs nikdy nedostane gating-noindex (LAUNCHED_PREFIXES.cs prázdné)', () => {
    expect(LAUNCHED_PREFIXES.cs).toEqual([]);
  });
```
(b) Přidej nový blok na konec:
```ts
describe('UK fáze 4d launch (dotace)', () => {
  it('/dotace je launchnuté pro uk', () => {
    expect(LAUNCHED_PREFIXES.uk).toContain('/dotace');
    expect(isLaunchedPath('uk', '/dotace')).toBe(true);
    expect(isLaunchedPath('uk', '/dotace/')).toBe(true);
  });
  it('/dotace není locked sekce', () => {
    expect(isLockedSectionPath('/dotace')).toBe(false);
  });
  it('cs /dotace nedostane gating-noindex', () => {
    expect(isLaunchedPath('cs', '/dotace/')).toBe(false);
  });
});
```

- [ ] **Step 2: Run, expect FAIL** (`/dotace` not yet in prefixes):

Run: `npx vitest run tests/i18n/uk-launch.test.ts`

- [ ] **Step 3: Přidat prefix** v `src/i18n/utils.ts` (uk pole, ř. ~35) — přidej `'/dotace'` na konec:

```ts
  uk: ['/stroje', '/srovnani', '/znacky', '/encyklopedie', '/jak-na-to', '/slovnik', '/puda', '/statistiky', '/dotace'],
```

- [ ] **Step 4: Run, expect PASS**

Run: `npx vitest run tests/i18n/uk-launch.test.ts`

- [ ] **Step 5: Build + live smoke**

Run:
```bash
npm run build 2>&1 | tail -3
set -a; . ./.env; set +a
npm run preview & PID=$!; sleep 5
echo "--- statusy ---"
for u in "/uk/dotace/" "/dotace/" "/sk/dotace/" "/uk/dotace/dotace-pro-mlade-zemedelce/" "/uk/dotace/kalendar-kol/"; do printf "%-44s " "$u"; curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:4321$u"; done
echo "--- uk hub: robots/canonical/hreflang ---"; curl -s http://localhost:4321/uk/dotace/ | grep -ioE '<meta name="robots"[^>]*>|rel="canonical" href="[^"]*"|hreflang="(cs|sk|uk|x-default)"' | sort -u
echo "--- uk UA obsah ---"; curl -s http://localhost:4321/uk/dotace/ | grep -oE 'Державна|Програми підтримки|Підтримка ЄС' | sort -u
echo "--- cs hub bez UA obsahu (0) ---"; curl -s http://localhost:4321/dotace/ | grep -c 'Програми підтримки'
echo "--- sitemap /uk/dotace/ (1) + kalendar-kol (0) ---"; curl -s http://localhost:4321/sitemap.xml | grep -c '<loc>https://agro-svet.cz/uk/dotace/</loc>'; curl -s http://localhost:4321/sitemap.xml | grep -c '/uk/dotace/kalendar-kol/'
kill $PID 2>/dev/null
```
Expected: `/uk/dotace/` 200, `/dotace/` 200, `/sk/dotace/` 200, `/uk/dotace/<cs-slug>/` 404, `/uk/dotace/kalendar-kol/` 302; uk hub `index,follow` + self-canonical `/uk/dotace/` + hreflang cs/sk/uk/x-default; UA obsah ≥1; cs `0`; sitemap hub `1`, kalendar-kol `0`.

- [ ] **Step 6: Commit**

```bash
git add src/i18n/utils.ts tests/i18n/uk-launch.test.ts
git commit -m "feat(uk-4d): launch /dotace pro uk (LAUNCHED_PREFIXES + test) — indexace ON"
```

---

## Task 11: Finální review → reconcile → PR → merge

**Files:** žádné nové (proces).

- [ ] **Step 1: Finální opus review** celého diffu (`git diff master...HEAD`). Adresuj nálezy (byte-identita CS/SK, žádný CS leak na /uk dětských routách, žádné neozdrojované číslo, gating).

- [ ] **Step 2: Cílený testový běh**

Run:
```bash
npx vitest run tests/lib/dotace-uk-data.test.ts tests/i18n/dotace-uk-keys.test.ts tests/i18n/uk-launch.test.ts tests/i18n/puda-uk-keys.test.ts tests/i18n/statistiky-uk-keys.test.ts
```
Expected: vše PASS.

- [ ] **Step 3: Reconcile s origin/master**

```bash
git fetch origin
git rebase origin/master   # řeš konflikty v utils.ts (LAUNCHED_PREFIXES), ui/uk.ts, sitemap.xml.ts
npm run build 2>&1 | tail -3
```
Po reconcile znovu build + cílené testy.

- [ ] **Step 4: Revert build artefakt + PR → merge**

```bash
git checkout -- src/generated/content-dates.json 2>/dev/null || true
```
Pak `superpowers:finishing-a-development-branch`: push, PR proti master, po merge Coolify deploy. Živý smoke na agro-svet.cz (`/uk/dotace/` 200 index,follow; cs/sk 200; `/uk/dotace/<cs-slug>/` 404; sitemap hub).

- [ ] **Step 5: Úklid** — po ověření smaž worktree + větev (local+remote).

---

## Self-Review (proti specu)

- **Spec coverage:** ✅ 4 obsahové bloky (howItWorks=T2/3/6, programs=válečné granty+5-7-9 sloučené T2/3/6, donors=T2/3/6); izolace komponenta=T6, route delegace=T7, gating dětí ([slug]→404, kalendar-kol→302)=T8, jak-vybrat beze změny (už 302), sitemap kalendar-kol vyloučen=T9, lib types=T1, data+source/asOf=T2, verifikační brána=T4, i18n=T5, launch poslední=T10, reconcile+PR=T11.
- **Placeholder scan:** Data `__TODO__` ZÁMĚRNÉ (T2), mazané v T3/T4 s grep gate `=0`. Žádné placeholdery v kódu/krocích.
- **Type consistency:** `DotaceUkData`, `DotaceUkStep`, `DotaceUkProgram` (amount/amountNote optional), `DotaceUkDonor`, `DotaceUkSourceLink` — konzistentní T1/T2/T6. Komponenta čte přesně tato pole.
- **Byte-identita:** T7 diff gate. **CS leak:** T8 explicitně řeší [slug]/kalendar-kol (klíčové 4d riziko).
```
