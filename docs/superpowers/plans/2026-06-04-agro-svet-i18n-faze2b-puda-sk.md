# SK `/puda` (Fáze 2b balík C) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Odemknout SK `/puda` reálnými daty o zemědělské půdě (Eurostat `geo=SK` ceny/nájmy + plodiny) a 3 přeloženými vzdělávacími články, jako poslední launchnutá `data` sekce.

**Architecture:** Stejná jako balík B (statistiky). `/puda/index.astro` + `[slug].astro` se převedou `prerender=true`→`false` (SSR + edge cache), locale z `Astro.locals.locale`. SK data z nového build-time fetcheru `scripts/fetch-puda-sk.mjs` → `src/data/agro-puda-sk.json` (sdílí `eurostat-sk.mjs` `pickSeries`). Články přes overlay kolekci `pudaSk`. CZ výstup zůstává obsahově nezměněný (cs literály verbatim, ověření živé).

**Tech Stack:** Astro 6 (`output:'server'`, CF Worker), Eurostat REST JSON-stat, vitest, Node 22.

**Spec:** `docs/superpowers/specs/2026-06-04-agro-svet-i18n-faze2b-puda-sk-design.md`

**Branch:** `feat/i18n-sk-puda` (z `origin/master` `26f37d4`, worktree `~/agro-svet-i18n-statistiky`).

**Gate (každý task před commitem, kde mění .ts/.astro/.mjs):** `nvm use 22 && npx vitest run` (a u page/config tasků navíc `npx astro build`). agro-svet NEMÁ tsc/astro check.

**⚠️ Cizí WIP NIKDY necommitovat:** `public/og/howto-*.png` (6 untracked), `Footer.astro` a podobné. Vždy `git add <konkrétní soubory>`, NIKDY `git add -A`. node_modules NENÍ gitignored ve worktree. Po každém commitu `git show --stat HEAD` ověřit scope.

---

## File Structure

**Vytvořit:**
- `scripts/fetch-puda-sk.mjs` — build-time Eurostat fetcher → `src/data/agro-puda-sk.json`.
- `scripts/lib/puda-sk.mjs` — pure transform helpery (testovatelné).
- `src/data/agro-puda-sk.json` — committed datový artefakt (output fetcheru).
- `src/lib/puda-derived.ts` — pure SK/cs próza + big-numbers + insights (locale param).
- `src/content/puda-sk/{eroze,ornice,vyziva-pudy}.md` — přeložené články (output `do_puda`).
- `tests/scripts/puda-sk.test.ts` — unit testy pure transform.
- `tests/i18n/puda.test.ts` — parity `puda.*` klíčů.
- `tests/lib/puda-derived.test.ts` — cs snapshoty + sk sanity.

**Modifikovat:**
- `scripts/i18n-translate.py` — přidat `do_puda(slug)` + dispatch.
- `src/content.config.ts` — extrahovat `pudaSchema()`, přidat `pudaSk` kolekci.
- `src/i18n/ui/cs.ts` + `src/i18n/ui/sk.ts` — klíče `puda.*`.
- `src/pages/puda/index.astro` — SSR + locale-branched render.
- `src/pages/puda/[slug].astro` — SSR + `pudaSk` + 404 + `renderMarkdownWithLinks`.
- `src/i18n/nav.ts` — `LOCKED_SECTION_PREFIXES` → `[]`.
- `src/i18n/utils.ts` — `SK_LAUNCHED_PREFIXES` += `/puda`.
- `src/components/DataSegmentNav.astro` — odebrat sk-filtr puda tabu + `navHref`.
- `src/pages/sitemap.xml.ts` — SK-mirror `/puda` (ověřit, většinou auto).
- `package.json` — `"puda:refresh:sk"`.

---

## Task 1: Pure transform helper + unit test

**Files:**
- Create: `scripts/lib/puda-sk.mjs`
- Test: `tests/scripts/puda-sk.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/scripts/puda-sk.test.ts
import { describe, it, expect } from 'vitest';
import { buildPudaPayload } from '../../scripts/lib/puda-sk.mjs';

describe('buildPudaPayload', () => {
  it('mapuje cena/najem řady na year/value a filtruje null', () => {
    const cena = [{ time: '2017', value: 3244 }, { time: '2024', value: 5743 }];
    const najem = [{ time: '2011', value: 37 }, { time: '2024', value: 69 }];
    const plodiny = [
      { crop: 'Pšenica', year: '2023', hectares: 380000 },
      { crop: 'Repka', year: '2023', hectares: 140000 },
      { crop: 'Pšenica', year: '2022', hectares: 360000 }, // starší rok ignorovat
    ];
    const out = buildPudaPayload({ cena, najem, plodiny, generated: 'X' });
    expect(out.cena.series).toEqual([{ year: 2017, value: 3244 }, { year: 2024, value: 5743 }]);
    expect(out.cena.unit).toBe('EUR/ha');
    expect(out.cena.agriprod).toBe('ARAXIB');
    expect(out.najem.series).toEqual([{ year: 2011, value: 37 }, { year: 2024, value: 69 }]);
    // plodiny: jen nejnovější rok (2023), seřazeno sestupně dle hectares
    expect(out.plodiny).toEqual([
      { crop: 'Pšenica', hectares: 380000 },
      { crop: 'Repka', hectares: 140000 },
    ]);
    expect(out.generated).toBe('X');
  });

  it('prázdné vstupy → prázdné série (blok se vynechá)', () => {
    const out = buildPudaPayload({ cena: [], najem: [], plodiny: [], generated: 'X' });
    expect(out.cena.series).toEqual([]);
    expect(out.najem.series).toEqual([]);
    expect(out.plodiny).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `nvm use 22 && npx vitest run tests/scripts/puda-sk.test.ts`
Expected: FAIL — `buildPudaPayload` not exported.

- [ ] **Step 3: Write minimal implementation**

```js
// scripts/lib/puda-sk.mjs
// Pure transform helpery pro SK /puda fetcher. Žádné side-effecty (testovatelné).

/** Z pickSeries výstupu [{time,value}] udělá [{year:Number,value}]. */
function toYearSeries(series) {
  return series.map((p) => ({ year: parseInt(p.time), value: p.value }));
}

/**
 * Sestaví payload pro agro-puda-sk.json.
 * @param cena   pickSeries výstup apri_lprc ARAXIB EUR_HA (2017+)
 * @param najem  pickSeries výstup apri_lrnt ARA_J0000 EUR_HA
 * @param plodiny [{crop, year, hectares}] (více let; vybere se nejnovější)
 * @param generated ISO timestamp
 */
export function buildPudaPayload({ cena, najem, plodiny, generated }) {
  // plodiny: vybrat nejnovější rok, seřadit sestupně dle hectares
  let plodinyOut = [];
  if (plodiny.length) {
    const latestYear = plodiny.reduce((max, p) => (p.year > max ? p.year : max), plodiny[0].year);
    plodinyOut = plodiny
      .filter((p) => p.year === latestYear)
      .map((p) => ({ crop: p.crop, hectares: p.hectares }))
      .sort((a, b) => b.hectares - a.hectares);
  }
  return {
    generated,
    cena: { unit: 'EUR/ha', agriprod: 'ARAXIB', series: toYearSeries(cena) },
    najem: { unit: 'EUR/ha/rok', agriprod: 'ARA_J0000', series: toYearSeries(najem) },
    plodiny: plodinyOut,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `nvm use 22 && npx vitest run tests/scripts/puda-sk.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/puda-sk.mjs tests/scripts/puda-sk.test.ts
git commit -m "feat(puda-sk): pure transform helper buildPudaPayload + testy"
```

---

## Task 2: Eurostat fetcher + datový artefakt

**Files:**
- Create: `scripts/fetch-puda-sk.mjs`
- Create: `src/data/agro-puda-sk.json` (vygenerovaný)
- Modify: `package.json` (npm skript)

- [ ] **Step 1: Write the fetcher**

```js
// scripts/fetch-puda-sk.mjs
#!/usr/bin/env node
// Build-time fetcher pre SK /puda/. Zdroj = Eurostat geo=SK.
// Cena pôdy: apri_lprc agriprod=ARAXIB (Non-irrigable arable land) — NAJČISTŠIA
//   rada (2017+, bez metodického zlomu; ARA má nereálne predzlomové 2015-16 hodnoty).
// Nájom: apri_lrnt agriprod=ARA_J0000 (orná + TTP), EUR_HA, 2011+.
// Plodiny: apro_cpshr AR_THS_HA (plochy, najnovší rok) — tis. ha → ha.
// Výstup: src/data/agro-puda-sk.json. Refresh: `npm run puda:refresh:sk`.

import { writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pickSeries } from './lib/eurostat-sk.mjs';
import { buildPudaPayload } from './lib/puda-sk.mjs';

const OUT = fileURLToPath(new URL('../src/data/agro-puda-sk.json', import.meta.url));
const ES = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data';

async function esFetch(dataset, params) {
  const qs = new URLSearchParams({ format: 'JSON', geo: 'SK', ...params });
  const url = `${ES}/${dataset}?${qs}`;
  console.log(`→ Eurostat ${dataset} ${JSON.stringify(params)}`);
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) { console.warn(`  ${dataset} ${res.status} — skip`); return null; }
  return res.json();
}

async function fetchCena() {
  const json = await esFetch('apri_lprc', { unit: 'EUR_HA', agriprod: 'ARAXIB' });
  if (!json) return [];
  return pickSeries(json, { freq: 'A', unit: 'EUR_HA', agriprod: 'ARAXIB', geo: 'SK' })
    .map((p) => ({ time: p.time, value: Math.round(p.value) }));
}

async function fetchNajem() {
  const json = await esFetch('apri_lrnt', { unit: 'EUR_HA', agriprod: 'ARA_J0000' });
  if (!json) return [];
  return pickSeries(json, { freq: 'A', unit: 'EUR_HA', agriprod: 'ARA_J0000', geo: 'SK' })
    .map((p) => ({ time: p.time, value: Math.round(p.value) }));
}

// Plodiny: plochy (AR_THS_HA) zo všetkých rokov; buildPudaPayload vyberie najnovší.
const PROD_CROPS = [
  { crop: 'Pšenica', code: 'C1100' },
  { crop: 'Jačmeň', code: 'C1300' },
  { crop: 'Kukurica', code: 'C1500' },
  { crop: 'Repka', code: 'I1110' },
  { crop: 'Zemiaky', code: 'R1000' },
];

async function fetchPlodiny() {
  const json = await esFetch('apro_cpshr', {});
  if (!json) return [];
  const out = [];
  for (const c of PROD_CROPS) {
    const area = pickSeries(json, { freq: 'A', crops: c.code, strucpro: 'AR_THS_HA', geo: 'SK' });
    for (const p of area) out.push({ crop: c.crop, year: p.time, hectares: Math.round(p.value * 1000) });
  }
  return out;
}

async function main() {
  const cena = await fetchCena();
  const najem = await fetchNajem();
  const plodiny = await fetchPlodiny();
  const payload = buildPudaPayload({ cena, najem, plodiny, generated: new Date().toISOString() });
  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(payload, null, 2) + '\n');
  console.log(`✓ wrote ${OUT}`);
  console.log(`  cena: ${payload.cena.series.length} bodov, najem: ${payload.najem.series.length} bodov, plodiny: ${payload.plodiny.length}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 2: Add npm script**

V `package.json` do `"scripts"` přidej za `"stats:refresh:sk"` (pokud existuje, jinak za `"stats:refresh"`):

```json
    "puda:refresh:sk": "node scripts/fetch-puda-sk.mjs",
```

- [ ] **Step 3: Run the fetcher**

Run: `nvm use 22 && npm run puda:refresh:sk`
Expected: vypíše `✓ wrote .../agro-puda-sk.json`, `cena: 8 bodov` (2017–2024), `najem: 14 bodov` (2011–2024), `plodiny: 5`.

- [ ] **Step 4: Sanity-check vygenerovaný JSON**

Run: `node -e "const j=require('./src/data/agro-puda-sk.json'); console.log('cena 2024:', j.cena.series.at(-1)); console.log('najem 2024:', j.najem.series.at(-1)); console.log('plodiny:', j.plodiny.map(p=>p.crop+':'+p.hectares).join(', '))"`
Expected: `cena 2024: { year: 2024, value: 5743 }` (±), `najem 2024: { year: 2024, value: 69 }` (±), plodiny seřazené sestupně. **Pokud cena série obsahuje rok <2017 nebo hodnotu >10000 → STOP** (zatekl metodický zlom; ověř `agriprod=ARAXIB`).

- [ ] **Step 5: Commit**

```bash
git add scripts/fetch-puda-sk.mjs src/data/agro-puda-sk.json package.json
git commit -m "feat(puda-sk): Eurostat fetcher (cena ARAXIB + nájom + plodiny) + dáta"
```

---

## Task 3: `pudaSk` overlay kolekce

**Files:**
- Modify: `src/content.config.ts`

- [ ] **Step 1: Extrahovat `pudaSchema()` a přidat `pudaSk`**

V `src/content.config.ts` nahraď blok `puda` (dnes inline `z.object`):

```ts
const puda = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/puda' }),
  schema: z.object({
    title: z.string(),
    popis: z.string(),
  }),
});
```

za:

```ts
const pudaSchema = () =>
  z.object({
    title: z.string(),
    popis: z.string(),
  });

const puda = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/puda' }),
  schema: pudaSchema(),
});

// SK-localized článková kolekce o pôde (overlay). Držené zvlášť, aby cs-facing
// getCollection('puda') zůstalo nedotčené. Slug = REUSE cs slug.
const pudaSk = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/puda-sk' }),
  schema: pudaSchema(),
});
```

A v `export const collections = {...}` přidej `pudaSk`:

```ts
export const collections = { novinky, encyklopedie, znacky, znackySk, puda, pudaSk, dotace, dotaceSk, howto };
```

- [ ] **Step 2: Vytvořit prázdný adresář s placeholderem (aby glob nespadl při buildu před Task 4)**

Astro glob na prázdné/chybějící složce je OK (vrátí prázdnou kolekci), ale složka musí existovat až po Tasku 4. Pokud build běží teď, vytvoř dočasně:

```bash
mkdir -p src/content/puda-sk
```

(Adresář se naplní v Tasku 4; commit prázdné složky není možný — proto se kolekce reálně naplní až Tasku 4. Build s prázdnou kolekcí projde.)

- [ ] **Step 3: Build gate**

Run: `nvm use 22 && npx astro build`
Expected: build projde (cs `/puda` i nadále `getCollection('puda')`; `pudaSk` zatím prázdná).

- [ ] **Step 4: Commit**

```bash
git add src/content.config.ts
git commit -m "feat(puda-sk): pudaSchema() + pudaSk overlay kolekce"
```

---

## Task 4: Přeložit 3 články → `puda-sk/*.md`

**Files:**
- Modify: `scripts/i18n-translate.py` (přidat `do_puda`)
- Create: `src/content/puda-sk/{eroze,ornice,vyziva-pudy}.md` (output)

- [ ] **Step 1: Přidat `do_puda` do `scripts/i18n-translate.py`**

Za funkci `do_znacky` (před `# ---------- novinky ----------`) přidej:

```python
# ---------- puda ----------
def do_puda(slug):
    import yaml
    root = pathlib.Path(__file__).resolve().parent.parent
    src = root / f"src/content/puda/{slug}.md"
    raw = src.read_text()
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", raw, re.S)
    fm, body = yaml.safe_load(m.group(1)), m.group(2)

    payload = {}
    if isinstance(fm.get("title"), str): payload["title"] = fm["title"].strip()
    if isinstance(fm.get("popis"), str): payload["popis"] = fm["popis"].strip()

    sk = translate_kv(f"frontmatter článku o pôde '{fm.get('title')}'", payload)
    sk_body = translate_body(body)

    if "title" in payload: fm["title"] = sk.get("title") or payload["title"]
    if "popis" in payload: fm["popis"] = sk.get("popis") or payload["popis"]

    new_fm = yaml.safe_dump(fm, allow_unicode=True, sort_keys=False,
                            default_flow_style=False, width=4096).rstrip()
    dst = root / f"src/content/puda-sk/{slug}.md"
    dst.parent.mkdir(parents=True, exist_ok=True)
    dst.write_text(f"---\n{new_fm}\n---\n\n{sk_body}\n")
    print(f"WROTE {dst}")
    print("\n=== PREVIEW (first 2200 chars) ===")
    print(dst.read_text()[:2200])
```

A do dispatch bloku `if __name__ == "__main__":` přidej za `elif cmd == "znacky":` větev:

```python
    elif cmd == "puda":
        do_puda(sys.argv[2])
```

- [ ] **Step 2: Spustit překlad pro 3 slugy**

> AI Gateway klíč `AI_GATEWAY_API_KEY` je v `.env` worktree (ověř `grep AI_GATEWAY_API_KEY .env`). Pokud chybí, zkopíruj z parent: `cp ~/agro-svet/.env .env` (POZOR — `.env` je gitignored, necommituj).

Run:
```bash
nvm use 22 && cd ~/agro-svet-i18n-statistiky
for s in eroze ornice vyziva-pudy; do python3 scripts/i18n-translate.py puda "$s"; done
```
Expected: 3× `WROTE .../puda-sk/<slug>.md` + náhled SK textu.

- [ ] **Step 3: QA — žádná CZ kontaminace v přeložených tělech**

Run (case-insensitive, vč. velkých Ř/Ě/Ů a slov bez diakritiky dle lekce balíku B):
```bash
grep -rniE 'ř|ě|ů|aktuální|největší|důležit|řízení' src/content/puda-sk/ || echo "ČISTÉ"
```
Expected: `ČISTÉ`. Pokud výskyt v běžném textu (ne v proper noun jako „agro-svět.cz") → STOP, oprav ručně (UPDATE textu na SK). Pak znovu grep.

- [ ] **Step 4: Build gate**

Run: `nvm use 22 && npx astro build`
Expected: build projde, `pudaSk` má 3 entry.

- [ ] **Step 5: Commit**

```bash
git add scripts/i18n-translate.py src/content/puda-sk/eroze.md src/content/puda-sk/ornice.md src/content/puda-sk/vyziva-pudy.md
git commit -m "feat(puda-sk): do_puda překlad + 3 SK články (eroze/ornice/vyziva-pudy)"
```

---

## Task 5: i18n stringy `puda.*` + parity test

**Files:**
- Modify: `src/i18n/ui/cs.ts`, `src/i18n/ui/sk.ts`
- Create: `tests/i18n/puda.test.ts`

Klíče (cs = verbatim z dnešní stránky, sk dle glosáře). Přidej do obou slovníků:

| klíč | cs | sk |
|---|---|---|
| `puda.kicker` | `PŮDA · DATOVÁ POVER-MAPA` | `PÔDA · DÁTOVÁ MAPA` |
| `puda.h1a` | `Zemědělská` | `Poľnohospodárska` |
| `puda.h1em` | `půda` | `pôda` |
| `puda.heroLede` | `Půda je nejcennější zemědělský zdroj — sledujte aktuální ceny a nájmy půdy na Slovensku a strukturu plodin.` (cs: ponech původní cs lede VERBATIM — viz pozn.) | `Pôda je najcennejší poľnohospodársky zdroj — sledujte aktuálne ceny a nájmy pôdy na Slovensku a štruktúru plodín.` |
| `puda.pill.temata` | `Témata` | `Témy` |
| `puda.pill.cena` | `Cena` | `Cena` |
| `puda.pill.najem` | `Nájem` | `Nájom` |
| `puda.pill.plodiny` | `Plodiny` | `Plodiny` |
| `puda.cena.h` | `Cena zemědělské půdy 2000–2025` | `Cena poľnohospodárskej pôdy 2017–2024` |
| `puda.cena.sub` | `Průměrná tržní cena hektaru orné půdy v tis. Kč.` | `Priemerná cena hektára ornej pôdy (€/ha).` |
| `puda.cena.src` | `Zdroj: FARMY.CZ Index + studie Tomáš Valka (ČZU)` | `Zdroj: Eurostat — ceny poľnohospodárskej pôdy` |
| `puda.najem.h` | `Nájem zemědělské půdy` | `Nájom poľnohospodárskej pôdy` |
| `puda.najem.sub` | `Průměrné roční pachtovné (Kč/ha/rok).` | `Priemerné ročné nájomné (€/ha/rok).` |
| `puda.najem.src` | `Zdroj: ČSÚ + FARMY.CZ` | `Zdroj: Eurostat — nájmy poľnohospodárskej pôdy` |
| `puda.plodiny.h` | `Hlavní plodiny na orné půdě (2024)` | `Hlavné plodiny na ornej pôde` |
| `puda.plodiny.sub` | `Sklizeň 7 525 tis. tun obilovin, soběstačnost 164,6 %.` | `Plochy hlavných plodín (tis. ha).` |
| `puda.plodiny.src` | `` (cs nemá src u plodin) | `Zdroj: Eurostat — plochy plodín` |
| `puda.temata.h` | `Hloubkově k tématům` | `Hĺbkovo k témam` |
| `puda.card.cta` | `Číst dál →` | `Čítať ďalej →` |
| `puda.sources.h` | `Zdroje dat` | `Zdroje dát` |
| `puda.bn.cena.lbl` | (cs nepoužívá — viz pozn.) | `Priemerná cena ornej pôdy` |
| `puda.bn.rust.lbl` | — | `Rast ceny pôdy` |
| `puda.bn.najem.lbl` | — | `Priemerné nájomné` |
| `puda.back` | `← Zpět na půdu` | `← Späť na pôdu` |

> **POZNÁMKA k cs větvi:** cs stránka má dnes texty hardcoded inline. Aby zůstala **byte-identická**, cs render NESMÍ čerpat z `t()` tam, kde by se změnil výstup — ledaže cs hodnota klíče je doslova totožná s dnešním literálem. Proto: **cs klíče výše musí být PŘESNĚ dnešní literály**. Klíče, které jsou jen pro SK bloky (`puda.bn.*`, `puda.najem.*`, `puda.plodiny.src`) cs verzi mít MOHOU (pro fallback/parity), ale cs render je nepoužije (ty bloky cs renderuje inline). Aby parity test prošel, dej i cs hodnotu (klidně cs ekvivalent), nebo je vyřaď přes `CS_ONLY_PREFIXES` (viz test). **Bezpečná cesta: cs větev stránky NEMĚNIT na `t()` pro Hero/big-numbers/grafy — viz Task 6, kde se `t()` použije JEN ve sk větvi.** Klíče tedy slouží hlavně sk větvi; cs hodnoty přidej jako 1:1 cs ekvivalent kvůli fallbacku.

- [ ] **Step 1: Write the parity test**

```ts
// tests/i18n/puda.test.ts
import { describe, it, expect } from 'vitest';
import cs from '../../src/i18n/ui/cs';
import sk from '../../src/i18n/ui/sk';

const pudaKeys = (d: Record<string, string>) => Object.keys(d).filter(k => k.startsWith('puda.'));

describe('puda.* i18n parity', () => {
  it('každý puda.* klíč v cs má protějšek v sk', () => {
    for (const k of pudaKeys(cs)) expect(sk[k], `chybí sk ${k}`).toBeTruthy();
  });
  it('žádný sk puda.* string nemá CZ-only ř/ě/ů', () => {
    for (const k of pudaKeys(sk)) expect(sk[k], `CZ kontaminace ${k}: ${sk[k]}`).not.toMatch(/[řěů]/);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `nvm use 22 && npx vitest run tests/i18n/puda.test.ts`
Expected: FAIL (žádné `puda.*` klíče zatím / sk chybí).

- [ ] **Step 3: Přidat klíče do `cs.ts` a `sk.ts`**

Do `src/i18n/ui/cs.ts` přidej blok `puda.*` (cs hodnoty z tabulky). Do `src/i18n/ui/sk.ts` přidej blok `puda.*` (sk hodnoty z tabulky). Dodrž existující formát souboru (objekt `Record<string,string>`).

- [ ] **Step 4: Run to verify it passes**

Run: `nvm use 22 && npx vitest run tests/i18n/puda.test.ts`
Expected: PASS (2 tests). Pokud CZ-kontaminace test selže → oprav sk hodnotu.

- [ ] **Step 5: Commit**

```bash
git add src/i18n/ui/cs.ts src/i18n/ui/sk.ts tests/i18n/puda.test.ts
git commit -m "feat(puda-sk): puda.* i18n stringy + parity test"
```

---

## Task 6: `index.astro` — SSR + locale-branched render

**Files:**
- Modify: `src/pages/puda/index.astro`
- Create: `src/lib/puda-derived.ts`
- Test: `tests/lib/puda-derived.test.ts`

**Princip:** cs větev renderuje dnešní literály VERBATIM (byte-identita). Pro sk se data berou z `agro-puda-sk.json`, CZ-only bloky se vynechají, čísla/jednotky jdou přes sk-SK/€. SSR nejde byte-diffovat staticky → cs identita se ověří živě (Task 9/10).

### 6a: `puda-derived.ts` + test

- [ ] **Step 1: Write the failing test**

```ts
// tests/lib/puda-derived.test.ts
import { describe, it, expect } from 'vitest';
import { pudaBigNumbers, pudaCenaInsight } from '../../src/lib/puda-derived';

const data = {
  generated: 'X',
  cena: { unit: 'EUR/ha', agriprod: 'ARAXIB', series: [{ year: 2017, value: 3244 }, { year: 2024, value: 5743 }] },
  najem: { unit: 'EUR/ha/rok', agriprod: 'ARA_J0000', series: [{ year: 2011, value: 37 }, { year: 2024, value: 69 }] },
  plodiny: [],
};

describe('pudaBigNumbers (sk)', () => {
  it('odvodí cenu 2024, růst za období a nájem 2024', () => {
    const bn = pudaBigNumbers(data, 'sk');
    expect(bn.cena).toBe(5743);
    expect(bn.cenaYear).toBe(2024);
    expect(bn.najem).toBe(69);
    expect(bn.najemYear).toBe(2024);
    // růst 3244→5743 = +77 % (zaokrouhleno)
    expect(bn.rustPct).toBe(77);
    expect(bn.rustFrom).toBe(2017);
  });
});

describe('pudaCenaInsight', () => {
  it('sk insight obsahuje cenu a růst', () => {
    const txt = pudaCenaInsight(data, 'sk');
    expect(txt).toContain('5 743');     // sk-SK formát s mezerou
    expect(txt).toMatch(/77\s*%/);
    expect(txt).not.toMatch(/[řěů]/);   // žádná CZ kontaminace
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `nvm use 22 && npx vitest run tests/lib/puda-derived.test.ts`
Expected: FAIL — modul neexistuje.

- [ ] **Step 3: Implement `puda-derived.ts`**

```ts
// src/lib/puda-derived.ts
// Pure derived próza + čísla pro /puda. locale param: 'cs' | 'sk'.
// cs větve = doslovné originály (byte-identita); sk = lokalizováno.

export interface PudaSeriesPoint { year: number; value: number; }
export interface PudaData {
  generated: string;
  cena: { unit: string; agriprod: string; series: PudaSeriesPoint[] };
  najem: { unit: string; agriprod: string; series: PudaSeriesPoint[] };
  plodiny: { crop: string; hectares: number }[];
}

function num(n: number, locale: 'cs' | 'sk'): string {
  return new Intl.NumberFormat(locale === 'sk' ? 'sk-SK' : 'cs-CZ').format(n);
}

export interface PudaBigNumbers {
  cena: number; cenaYear: number;
  najem: number; najemYear: number;
  rustPct: number; rustFrom: number;
}

export function pudaBigNumbers(d: PudaData, _locale: 'cs' | 'sk'): PudaBigNumbers {
  const cs = d.cena.series, ns = d.najem.series;
  const cenaLast = cs.at(-1)!, cenaFirst = cs[0];
  const najemLast = ns.at(-1)!;
  const rustPct = Math.round((cenaLast.value / cenaFirst.value - 1) * 100);
  return {
    cena: cenaLast.value, cenaYear: cenaLast.year,
    najem: najemLast.value, najemYear: najemLast.year,
    rustPct, rustFrom: cenaFirst.year,
  };
}

export function pudaCenaInsight(d: PudaData, locale: 'cs' | 'sk'): string {
  const bn = pudaBigNumbers(d, locale);
  if (locale === 'sk') {
    return `Z ${num(d.cena.series[0].value, locale)} €/ha v roku ${bn.rustFrom} na `
      + `${num(bn.cena, locale)} €/ha v roku ${bn.cenaYear} — rast o ${bn.rustPct} % za sledované obdobie.`;
  }
  // cs větev (pro úplnost; cs stránka používá vlastní inline insight)
  return `Z ${num(d.cena.series[0].value, locale)} €/ha na ${num(bn.cena, locale)} €/ha — růst o ${bn.rustPct} %.`;
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `nvm use 22 && npx vitest run tests/lib/puda-derived.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/puda-derived.ts tests/lib/puda-derived.test.ts
git commit -m "feat(puda-sk): puda-derived big-numbers + insight helpery"
```

### 6b: Převést `index.astro` na SSR + sk větev

- [ ] **Step 6: Frontmatter — prerender, importy, locale, data, cache**

Nahraď začátek `src/pages/puda/index.astro` (ř. 1–18, od `export const prerender = true;` po `const pudaItems = await getCollection('puda');`):

```astro
---
// prerender=false (SSR): launchnuté SK sekce servíruje middleware rewrite, který
// prerendered routy nepokrývá → SSR. Locale JEN z Astro.locals.locale (po rewrite
// je Astro.url cs cesta). cs render = dnešní inline literály VERBATIM (byte-identita);
// sk render = data z agro-puda-sk.json + vynechané CZ-only bloky.
export const prerender = false;
import Layout from '../../layouts/Layout.astro';
import DataSegmentNav from '../../components/DataSegmentNav.astro';
import PillsNav from '../../components/statistiky/PillsNav.astro';
import HomeWeather from '../../components/HomeWeather.astro';
import { getCollection } from 'astro:content';
import { useTranslations } from '../../i18n/utils';
import { pudaBigNumbers, pudaCenaInsight } from '../../lib/puda-derived';
import pudaSkData from '../../data/agro-puda-sk.json';

const locale = Astro.locals.locale ?? 'cs';
const isSk = locale === 'sk';
const t = useTranslations(locale);
Astro.response.headers.set('Cache-Control', 'public, max-age=600, s-maxage=86400, stale-while-revalidate=604800');

const PUDA_PILLS = isSk
  ? [
      { label: t('puda.pill.temata'), href: '#temata' },
      { label: t('puda.pill.cena'), href: '#cena' },
      { label: t('puda.pill.najem'), href: '#najem' },
      { label: t('puda.pill.plodiny'), href: '#plodiny' },
    ]
  : [
      { label: 'Témata', href: '#temata' },
      { label: 'Cena', href: '#cena' },
      { label: 'Struktura', href: '#struktura' },
      { label: 'Ohrožení', href: '#ohrozeni' },
      { label: 'Vlastnictví', href: '#vlastnictvi' },
      { label: 'Plodiny', href: '#plodiny' },
    ];

const pudaItems = isSk ? await getCollection('pudaSk') : await getCollection('puda');
const skBn = isSk ? pudaBigNumbers(pudaSkData, 'sk') : null;
```

- [ ] **Step 7: Cena graf — locale-branched data**

Dnešní `cenaPudy` literál (ř. 20–32) nech beze změny pro cs, ale přepni zdroj dat a měřítko podle locale. Nahraď řádek `const cenaPudy = [ ... ];` (celý literál) za:

```astro
// cs = FARMY.CZ index (tis. Kč, 2000–2025) VERBATIM; sk = Eurostat ARAXIB (€/ha, 2017–2024)
const cenaPudy = isSk
  ? pudaSkData.cena.series.map((p) => ({ rok: p.year, cena: p.value }))
  : [
      { rok: 2000, cena: 60 },
      { rok: 2010, cena: 90 },
      { rok: 2014, cena: 150 },
      { rok: 2019, cena: 250 },
      { rok: 2020, cena: 265 },
      { rok: 2021, cena: 290 },
      { rok: 2022, cena: 340 },
      { rok: 2023, cena: 350 },
      { rok: 2024, cena: 360 },
      { rok: 2025, cena: 372.55 },
    ];
const cenaMin = 0;
const cenaMax = isSk ? 6000 : 400;
const cenaYearMin = cenaPudy[0].rok;
const cenaYearSpan = cenaPudy.at(-1).rok - cenaYearMin || 1;
```

A v `cenaPoints` (ř. 40–44) nahraď napevno zadané `2000` a `25` za `cenaYearMin`/`cenaYearSpan`:

```astro
const cenaPoints = cenaPudy.map((d) => {
  const x = cenaPad.l + ((d.rok - cenaYearMin) / cenaYearSpan) * cenaPlotW;
  const y = cenaPad.t + cenaPlotH - ((d.cena - cenaMin) / (cenaMax - cenaMin)) * cenaPlotH;
  return { ...d, x, y };
});
```

> Y-osové gridline hodnoty `[0,100,200,300,400]` v markupu (ř. 168) jsou cs-specifické (tis. Kč). Pro sk je nahraď locale-branchem: definuj v frontmatteru `const cenaTicks = isSk ? [0,1500,3000,4500,6000] : [0,100,200,300,400];` a v markupu mapuj `cenaTicks` místo literálu. cs hodnota `[0,100,200,300,400]` zůstává identická.

- [ ] **Step 8: Struktura donut — cs-only (vynechat na sk)**

Frontmatter `struktura`/`donutSegs` (ř. 48–71) nech beze změny (cs je počítá). V markupu obal celou sekci `<section class="two-col" id="struktura">` (ř. 210–261, donut + ohrožení) do `{!isSk && ( ... )}`. (Donut i Ohrožení jsou CZ-only → obě v této sekci vynechat na sk.)

- [ ] **Step 9: Markup — Hero, big-numbers, HomeWeather, sekce**

V markupu uvnitř `<Layout ...>` proveď locale-branche:

1. **`<Layout title=... description=...>`** (ř. 74): title/description přes ternární:
```astro
<Layout title={isSk ? 'Cena poľnohospodárskej pôdy na Slovensku — Eurostat dáta' : 'Zemědělská půda v ČR — fakta, ceny, eroze'} description={isSk ? 'Aktuálne ceny a nájmy poľnohospodárskej pôdy na Slovensku (Eurostat) a štruktúra plodín.' : 'Aktuální data o zemědělské půdě v ČR: cena 372 550 Kč/ha, úbytek 10,8 ha denně, 60 % polí ohroženo vodní erozí. Ornice, eroze, výživa a ochrana půdního fondu.'}>
```

2. **Hero** (ř. 80–94): kicker/h1/lede/badge přes ternární. cs = dnešní literály VERBATIM, sk = `t()`/derived:
```astro
<span class="sp-kicker"><span class="dot"></span>{isSk ? t('puda.kicker') : 'PŮDA · DATOVÁ POVER-MAPA'}</span>
<h1>{isSk ? t('puda.h1a') : 'Zemědělská'} <em>{isSk ? t('puda.h1em') : 'půda'}</em></h1>
<p class="sp-hero-lede">{isSk ? t('puda.heroLede') : 'Půda je nejcennější zemědělský zdroj — a v Česku jí ubývá rekordním tempem. Sledujte aktuální ceny, vývoj výměry, ohrožení erozí a strukturální fakta o českém zemědělském půdním fondu.'}</p>
```
A badge (ř. 91):
```astro
<div class="sp-hero-photo-badge">{isSk ? `${new Intl.NumberFormat('sk-SK').format(skBn.cena)} €/ha · ${skBn.cenaYear}` : '372 550 Kč/ha · 2025'}</div>
```

3. **big-numbers** (ř. 97–138): obal celý `.map()` blok do ternáře. cs = dnešní 4 karty VERBATIM; sk = 3 karty z `skBn`. Nahraď `<section class="big-numbers"> {[...4 cs karty...].map(...)} </section>` za:
```astro
<section class="big-numbers">
  {isSk ? [
    { val: new Intl.NumberFormat('sk-SK').format(skBn.cena), unit: ' €/ha', lbl: t('puda.bn.cena.lbl'), trend: `${skBn.cenaYear}`, source: 'Eurostat — apri_lprc', url: 'https://ec.europa.eu/eurostat/databrowser/view/apri_lprc/default/table' },
    { val: `+${skBn.rustPct} %`, unit: '', lbl: t('puda.bn.rust.lbl'), trend: `${skBn.rustFrom} → ${skBn.cenaYear}`, source: 'Eurostat — apri_lprc', url: 'https://ec.europa.eu/eurostat/databrowser/view/apri_lprc/default/table' },
    { val: new Intl.NumberFormat('sk-SK').format(skBn.najem), unit: ' €/ha/rok', lbl: t('puda.bn.najem.lbl'), trend: `${skBn.najemYear}`, source: 'Eurostat — apri_lrnt', url: 'https://ec.europa.eu/eurostat/databrowser/view/apri_lrnt/default/table' },
  ] : [
    /* ...dnešní 4 cs karty VERBATIM (ř. 99–126)... */
  ].map((b) => (
    /* ...dnešní .map() render beze změny (ř. 128–136)... */
  ))}
</section>
```
> Render uvnitř `.map()` je sdílený (cs i sk používají stejné `.bn`/`.bn-val`... třídy). Tooltipy `cenaKc` v scriptu jsou jen pro line chart, ne pro big-numbers.

4. **HomeWeather** (ř. 140): obal `{!isSk && <HomeWeather mode="puda" />}`.

5. **PillsNav** (ř. 142): beze změny (čte locale-aware `PUDA_PILLS`).

6. **Témata** (ř. 145–157): `<h2>` přes ternár (`{isSk ? t('puda.temata.h') : 'Hloubkově k tématům'}`), card CTA `{isSk ? t('puda.card.cta') : 'Číst dál →'}`, odkaz `href={`${isSk ? '/sk' : ''}/puda/${item.id}/`}`.

7. **Cena sekce header** (ř. 161–165): h2/sub/src-link přes ternár (cs literály VERBATIM vs `t('puda.cena.h')` atd.). chart-insight (ř. 202–205): `{isSk ? pudaCenaInsight(pudaSkData, 'sk') : <dnešní cs insight VERBATIM>}`.

8. **Nájem sekce (NOVÁ, jen sk)** — za cena sekci přidej:
```astro
{isSk && (
  <section class="chart-section reveal" data-reveal="bars" id="najem">
    <header>
      <h2>{t('puda.najem.h')}</h2>
      <span class="sub">{t('puda.najem.sub')}</span>
      <a class="src-link" href="https://ec.europa.eu/eurostat/databrowser/view/apri_lrnt/default/table" target="_blank" rel="noopener noreferrer">{t('puda.najem.src')}</a>
    </header>
    <div class="crops-bars">
      {pudaSkData.najem.series.slice(-10).map((p) => {
        const max = Math.max(...pudaSkData.najem.series.map((s) => s.value));
        return (
          <div class="crop-row">
            <span class="crop-name">{p.year}</span>
            <div class="crop-bar-wrap">
              <div class="crop-bar" style={`--w:${(p.value / max) * 100}%; background:#7CB342`}></div>
              <span class="crop-val">{new Intl.NumberFormat('sk-SK').format(p.value)} €/ha</span>
            </div>
          </div>
        );
      })}
    </div>
  </section>
)}
```

9. **two-col (struktura+ohrožení)** (ř. 210–261): obal `{!isSk && ( ... )}` (Step 8).

10. **facts-grid (vlastnictví)** (ř. 264–341): obal `{!isSk && ( ... )}`.

11. **Plodiny** (ř. 344–370): locale-branch dat. h2/sub přes ternár; bary z dat:
```astro
<div class="crops-bars">
  {(isSk
    ? pudaSkData.plodiny.map((c, i) => ({ name: c.crop, ha: Math.round(c.hectares / 1000), color: ['#FFD700','#FFB300','#7CB342','#FB8C00','#9E9E9E'][i % 5] }))
    : [ /* ...dnešní 5 cs barů VERBATIM (ř. 351–355)... */ ]
  ).map((c) => {
    const maxHa = Math.max(...(isSk ? pudaSkData.plodiny.map(p=>Math.round(p.hectares/1000)) : [800]));
    return (
      <div class="crop-row">
        <span class="crop-name">{c.name}</span>
        <div class="crop-bar-wrap">
          <div class="crop-bar" style={`--w:${(c.ha / maxHa) * 100}%; background:${c.color}`}></div>
          <span class="crop-val">{c.ha} tis. ha</span>
        </div>
      </div>
    );
  })}
</div>
```
section-note (ř. 366–369): `{!isSk && <p class="section-note">...cs...</p>}` (CZ-specifický text o řepce → vynechat na sk, nebo přidat sk variantu přes `t()`; volba: vynechat).

12. **Zdroje sekce** (ř. 373–385): h3 `{isSk ? t('puda.sources.h') : 'Zdroje dat'}`; `<ul>` odkazy přes ternár (sk = Eurostat odkazy, cs = dnešní 7 odkazů VERBATIM). updated (ř. 384): `{isSk ? '' : 'Datová pover-mapa naposledy aktualizována: duben 2026.'}` nebo sk text.

- [ ] **Step 10: Klientský script — locale config island**

Před `<script is:inline>` (ř. 633) přidej JSON island:
```astro
<script type="application/json" id="puda-cfg" set:html={JSON.stringify({ numLocale: isSk ? 'sk-SK' : 'cs-CZ', currency: isSk ? '€/ha' : 'Kč/ha', isSk })} />
```
A ve scriptu nahraď napevno `'cs-CZ'` a `Kč/ha` čtením z islandu. Na začátku IIFE:
```js
const CFG = JSON.parse(document.getElementById('puda-cfg')?.textContent || '{}');
const NUM = CFG.numLocale || 'cs-CZ';
```
V line tooltipu (ř. 674–683) nahraď `'cs-CZ'`→`NUM`. Pro sk je jednotka €/ha (ne tis. Kč): tooltip text udělej podmíněný přes `CFG.isSk` (sk: `${cena} €/ha`, bez „tis. Kč" řádku a bez `cenaKc`). Donut/threats/crops tooltipy se na sk nerenderují (bloky vynechané) → můžou zůstat cs.

- [ ] **Step 11: Build gate + lokální dev smoke**

Run: `nvm use 22 && npx astro build`
Expected: build projde.

Run dev smoke:
```bash
npx astro dev &  # nech naběhnout, pak:
curl -s localhost:4321/puda/ | grep -o 'lang="[a-z]*"' | head -1   # cs
curl -s localhost:4321/sk/puda/ | grep -oE '€/ha|lang="sk"' | head   # sk: € + lang=sk
```
Expected: cs `/puda/` `lang="cs"` + dnešní obsah (FARMY.CZ, eroze); sk `/sk/puda/` `lang="sk"` + €/ha, žádná sekce `#ohrozeni`/`#vlastnictvi`. Zastav dev server.

- [ ] **Step 12: Commit**

```bash
git add src/pages/puda/index.astro
git commit -m "feat(puda-sk): /puda SSR + SK locale-branched render (cena/nájom/plodiny/témy)"
```

---

## Task 7: `[slug].astro` — SSR + pudaSk + 404 + remark pipeline

**Files:**
- Modify: `src/pages/puda/[slug].astro`

> Lekce #61: SSR md render MUSÍ jít přes `renderMarkdownWithLinks` (lehká remark pipeline), NE `render()`+`<Content/>` se shiki. Ověř byte-identitu cs renderu.

- [ ] **Step 1: Přepsat `[slug].astro` na SSR**

Nahraď celý frontmatter (ř. 1–42) za:

```astro
---
// SSR (prerender:false): middleware servíruje /sk verzi přes locals.locale.
// sk čte z 'pudaSk' (přeložené články) BEZ cs fallbacku — chybějící sk slug = 404.
export const prerender = false;
import Layout from '../../layouts/Layout.astro';
import { getEntry } from 'astro:content';
import { SITE_URL } from '../../lib/config';
import { breadcrumbSchema } from '../../lib/structured-data';
import { renderMarkdownWithLinks } from '../../lib/markdown-with-links';
import { useTranslations } from '../../i18n/utils';

const locale = Astro.locals.locale ?? 'cs';
const isSk = locale === 'sk';
const t = useTranslations(locale);
const base = isSk ? '/sk' : '';
const { slug } = Astro.params;

const item = slug ? (isSk ? await getEntry('pudaSk', slug) : await getEntry('puda', slug)) : undefined;
if (!item) return new Response(null, { status: 404 });

const contentHtml = await renderMarkdownWithLinks(item.body ?? '', `${base}/puda/${slug}/`);

const pageUrl = `${SITE_URL}${base}/puda/${slug}/`;
const breadcrumbJsonLd = breadcrumbSchema([
  { name: isSk ? 'Domov' : 'Domů', url: `${base}/` },
  { name: isSk ? 'Poľnohospodárska pôda' : 'Zemědělská půda', url: `${base}/puda/` },
  { name: item.data.title, url: pageUrl },
]);
const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: item.data.title,
  description: item.data.popis,
  url: pageUrl,
  inLanguage: isSk ? 'sk-SK' : 'cs-CZ',
  publisher: { '@type': 'Organization', name: 'agro-svět.cz', url: SITE_URL + '/' },
};
---
```

- [ ] **Step 2: Upravit markup (canonical, breadcrumb, body, back link)**

V `<Layout ...>` (ř. 44) dej canonical jen pro cs (sk Layout doplní self-canonical):
```astro
<Layout title={item.data.title} description={item.data.popis} canonical={isSk ? undefined : pageUrl}>
```
Breadcrumb odkazy (ř. 50) `href="/puda/"` → `href={`${base}/puda/`}`, label `Půda` → `{isSk ? 'Pôda' : 'Půda'}`.
Nahraď `<div class="prose"><Content /></div>` (ř. 58) za:
```astro
<div class="prose"><div set:html={contentHtml} /></div>
```
Back link (ř. 60–63): `href="/puda/"` → `href={`${base}/puda/`}`, text `← Zpět na půdu` → `{isSk ? t('puda.back') : '← Zpět na půdu'}`.

- [ ] **Step 3: cs byte-identita renderu — parity check**

cs `[slug].astro` přechází z `<Content/>` (Astro markdown) na `renderMarkdownWithLinks`. Ověř, že cs HTML těla je rovnocenné (vzor #61). Run:
```bash
nvm use 22 && npx astro build
# porovnej cs render proti git HEAD verzi (před tímto taskem) — buď vizuálně dev smoke, nebo:
node -e "import('./src/lib/markdown-with-links.ts')" 2>/dev/null || echo "rendered via Astro build"
```
Dev smoke:
```bash
npx astro dev &
curl -s localhost:4321/puda/eroze/ | grep -c '<h2' # nadpisy se renderují
curl -s localhost:4321/sk/puda/eroze/ | grep -o 'lang="sk"'
curl -s -o /dev/null -w '%{http_code}\n' localhost:4321/sk/puda/neexistuje/ # 404
```
Expected: cs `/puda/eroze/` má `<h2`+heading ID, sk `/sk/puda/eroze/` `lang="sk"`, neexistující sk slug → 404. Zastav dev.

> Pokud se cs heading ID nebo markup liší od staré `<Content/>` verze → použij stejný trik jako #61 (inline `rehypeHeadingIds` replika je už v `markdown-with-links.ts`). Ověř, že `renderMarkdownWithLinks` produkuje stejné ID.

- [ ] **Step 4: Commit**

```bash
git add src/pages/puda/[slug].astro
git commit -m "feat(puda-sk): /puda/[slug] SSR + pudaSk + 404 guard + remark pipeline"
```

---

## Task 8: Odemčení + launch (gating)

**Files:**
- Modify: `src/i18n/nav.ts`, `src/i18n/utils.ts`, `src/components/DataSegmentNav.astro`, `src/pages/sitemap.xml.ts`

- [ ] **Step 1: `nav.ts` — `LOCKED_SECTION_PREFIXES` → `[]`**

V `src/i18n/nav.ts` nahraď (ř. 30–35):
```ts
/** cs-root prefixy CZ-jurisdikčních nástrojů/dat. Po Fázi 2b balíku C jsou
 *  VŠECHNY `data` nástroje odemčeny (A=dotace, B=statistiky, C=puda) → prázdné.
 *  Ponecháno pro budoucí použití + lock-guard v Layoutu. */
export const LOCKED_SECTION_PREFIXES: string[] = [];
```
A v komentáři `HIDDEN_SECTIONS` (ř. 11–18) aktualizuj zmínku „/puda" (už není locked).

- [ ] **Step 2: `utils.ts` — `SK_LAUNCHED_PREFIXES` += `/puda`**

V `src/i18n/utils.ts` (ř. 31) přidej `'/puda'`:
```ts
export const SK_LAUNCHED_PREFIXES = ['/stroje', '/znacky', '/srovnani', '/novinky', '/kalkulacka', '/dotace', '/statistiky', '/puda'];
```

- [ ] **Step 3: `DataSegmentNav.astro` — odemknout puda tab pro sk + navHref**

V `src/components/DataSegmentNav.astro`:
1. Importuj `navHref`: změň ř. 2 `import { useTranslations } from '../i18n/utils';` → `import { useTranslations, navHref } from '../i18n/utils';`
2. Odeber sk-filtr (ř. 26–27):
```ts
// PO launchi balíku C je /puda pro sk odemčená → oba taby pro všechny locale.
const items = allItems;
```
3. V markupu (ř. 34) obal href: `href={it.href}` → `href={navHref(locale, it.href)}`.

- [ ] **Step 4: `sitemap.xml.ts` — ověřit SK-mirror `/puda`**

Run: `grep -nE 'puda|LOCKED|skMirror|SK_LAUNCHED|isLockedSectionPath|isSkLaunchedPath' src/pages/sitemap.xml.ts`
- Pokud sitemap mirroruje `SK_LAUNCHED_PREFIXES` automaticky a vylučuje `isLockedSectionPath` → `/puda` se přidá samo (hub) po Step 1+2. **Žádná editace.**
- Pokud sitemap má per-sekci výjimky pro slug kolekce (jako dotace/statistiky), přidej `pudaSk` slugy obdobně: pro každý `getCollection('pudaSk')` slug `/sk/puda/<slug>/`, a cs `/puda/<slug>` ponech (cs slug = sk slug → mirror je validní). Postupuj podle vzoru, který v souboru najdeš pro `dotace`/`statistiky`.

Po úpravě (nebo ověření) build:

- [ ] **Step 5: Build gate + vitest**

Run: `nvm use 22 && npx vitest run && npx astro build`
Expected: všechny testy PASS, build projde. Ověř sitemap obsahuje `/sk/puda`:
```bash
grep -o '/sk/puda[^<]*' dist/client/sitemap*.xml | head
```
Expected: `/sk/puda/` + případně `/sk/puda/eroze/` atd.

- [ ] **Step 6: Commit**

```bash
git add src/i18n/nav.ts src/i18n/utils.ts src/components/DataSegmentNav.astro src/pages/sitemap.xml.ts
git commit -m "feat(puda-sk): odemčení /puda pro /sk (LOCKED→[], launch, DataSegmentNav, sitemap)"
```

---

## Task 9: QA sweep + plný gate

**Files:** žádné nové (verifikace).

- [ ] **Step 1: CZ-kontaminace v sk blocích — case-insensitive**

Run:
```bash
grep -rniE 'ř|ě|ů' src/lib/puda-derived.ts src/content/puda-sk/ src/i18n/ui/sk.ts | grep -viE 'agro-svět|cs-CZ|comment|//' || echo "ČISTÉ"
```
A v `index.astro`/`[slug].astro` ověř, že sk literály (uvnitř `isSk ?` větví a `t('puda.*')`) neobsahují CZ slova bez diakritiky („Aktuální"/„největší"). Pokud najdeš → oprav, recommit příslušný task soubor.

- [ ] **Step 2: Plný gate**

Run: `nvm use 22 && npx vitest run && npx astro build`
Expected: vitest vše PASS (vč. nových puda testů + existujících), build projde bez chyb.

- [ ] **Step 3: Worker bundle size (lekce #61 — dry-run NEZACHYTÍ, ale Total Upload ukáže)**

Run: `npx wrangler deploy --dry-run 2>&1 | grep -iE 'Total Upload|gzip' || true`
Expected: gzip pod 3072 KiB (rezerva ~700 KiB po #65). Pokud nad → STOP, prošetřit (žádný shiki na téhle routě).

- [ ] **Step 4: Commit (pokud QA vynutil opravy; jinak skip)**

```bash
git add -p   # jen relevantní soubory
git commit -m "fix(puda-sk): QA oprava CZ kontaminace"
```

---

## Task 10: Deploy (USER-GATED) + live smoke + PR

> **⚠️ Deploy na ŽIVOU produkci — vyžádej explicitní svolení uživatele PŘED `npm run deploy`.** agro-svet nemá auto-deploy z merge. Hlídat souběžný deployer.

- [ ] **Step 1: Vyžádat svolení k deployi** (uživatel potvrdí).

- [ ] **Step 2: Deploy**

```bash
nvm use 22 && cd ~/agro-svet-i18n-statistiky && npm run build && npm run deploy
```
> `.env` musí mít `CF_PURGE_TOKEN`/`CF_ZONE_ID` (z parent). wrangler globálně přihlášen.

- [ ] **Step 3: Ověřit aktivní deploy (souběžný deployer)**

Run: `npx wrangler deployments list 2>&1 | head -15`
Expected: nahoře MŮJ právě nasazený Version. Pokud někdo přepsal starým kódem → redeploy.

- [ ] **Step 4: Live smoke**

```bash
for u in /puda/ /puda/eroze/ /sk/puda/ /sk/puda/eroze/; do
  echo "== $u =="; curl -s -o /dev/null -w '%{http_code}\n' "https://agro-svet.cz$u"
done
echo "== sk lang + € =="; curl -s https://agro-svet.cz/sk/puda/ | grep -oE 'lang="sk"|€/ha|index,follow' | sort -u
echo "== sk 404 =="; curl -s -o /dev/null -w '%{http_code}\n' https://agro-svet.cz/sk/puda/neexistuje/
echo "== cs unchanged =="; curl -s https://agro-svet.cz/puda/ | grep -oE 'lang="cs"|FARMY.CZ|Vodní eroze' | sort -u
echo "== cs reciproční hreflang =="; curl -s https://agro-svet.cz/puda/ | grep -o 'hreflang="sk"'
echo "== sitemap =="; curl -s https://agro-svet.cz/sitemap.xml | grep -c '/sk/puda'
```
Expected: všechny 200; sk `/sk/puda/` má `lang="sk"`+`€/ha`+`index,follow`; sk neexistující slug 404; cs `/puda/` `lang="cs"`+FARMY.CZ+Vodní eroze (nezměněno)+`hreflang="sk"`; sitemap má `/sk/puda`.

- [ ] **Step 5: PR (squash do master)**

> agro-svet NEMÁ auto-deploy z merge → produkce už živá; PR jen zaznamená do master. Branch NEMAZAT.

```bash
git push -u origin feat/i18n-sk-puda
gh pr create --base master --title "feat(i18n): SK /puda — balík C (Eurostat ceny/nájmy pôdy + články)" --body "$(cat <<'EOF'
## Souhrn
Fáze 2b balík C — odemknutí SK `/puda` reálnými daty (poslední `data` sekce).

- Eurostat `geo=SK`: cena pôdy (`apri_lprc` ARAXIB, 2017–2024), nájom (`apri_lrnt` ARA_J0000), plochy plodín (`apro_cpshr`).
- 3 přeložené články (`pudaSk` overlay), SSR `/puda` + `/puda/[slug]` (lekce #61: lehká remark pipeline).
- `LOCKED_SECTION_PREFIXES` → `[]` (všechny `data` nástroje odemčeny), `/puda` v `SK_LAUNCHED_PREFIXES`.
- cs výstup obsahově nezměněn (ověřeno živě). Deploy: `npm run deploy` (živá produkce).

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 6: Code review** (volitelně `/code-review` na diff) + finální merge `gh pr merge <N> --squash --admin` po svolení.

---

## Self-Review (autor plánu)

- **Spec coverage:** fetcher+data (T1–2), pudaSk kolekce+články (T3–4), i18n (T5), index SSR (T6), [slug] SSR (T7), gating/launch (T8), QA (T9), deploy+PR (T10). ✅ Všechny spec bloky pokryté. Struktura donut = vědomě vynechána (spec rozhodnutí 3).
- **Grounding:** cena=ARAXIB (ne ARA — metodický zlom), nájem=ARA_J0000, plodiny=apro_cpshr — ověřeno živě 2026-06-04. ✅
- **Type consistency:** `buildPudaPayload` tvar (cena/najem/plodiny) konzistentní napříč T1/T2/T6; `PudaData`/`pudaBigNumbers`/`pudaCenaInsight` názvy konzistentní T6. ✅
- **cs byte-identita:** všechny cs větve = `isSk ? <sk> : <cs literál VERBATIM>` → cs render nezměněn; ověření živé (SSR nejde diffovat staticky). ✅
- **Lekce zabudované:** #61 remark pipeline (T7), souběžný deployer (T10), gate astro build+vitest Node22, cizí OG PNG necommitovat, branch z origin/master. ✅
