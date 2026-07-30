# Rozšíření detailů strojů — vlna 1 (Zetor) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Přidat na modelové stránky strojů strukturovaná pole (overview, spolehlivost + časté závady, pro/proti, orientační cena ojetin, pro koho) a naplnit je pro nejhledanější Zetor modely z GSC.

**Architecture:** Nová volitelná pole v `StrojModel` (YAML) → render jako podmíněné sekce na `[model]/index.astro` (stejný vzor jako stávající `useCase`/`competitors`/`faqItems`) → napojení do `faq-generator.ts` a FAQ JSON-LD. Data plněná v cs YAML (`src/data/stroje/zetor.yaml`); sekce se u modelů bez dat prostě nezobrazí.

**Tech Stack:** Astro 6 SSR, TypeScript, js-yaml, Vitest, i18n slovníky cs/sk/uk/pl.

**Spec:** [docs/superpowers/specs/2026-07-30-agro-svet-stroje-znacky-detail-enrich-design.md](../specs/2026-07-30-agro-svet-stroje-znacky-detail-enrich-design.md)

**Pozor (prostředí):**
- Node 22 nutný pro build: `export NVM_DIR="$HOME/.nvm" && \. "$NVM_DIR/nvm.sh" && nvm use 22` v jednom Bash volání.
- Testy běží na dev shellu (Node 20 OK): `npx vitest run <path>`.
- Před prací `git status` — v repu bývá necommitnutý WIP z paralelních oken; commituj vždy jen explicitně vyjmenované soubory.
- Obsah pro agro-svet piš dle repo skillu `czech-ag-article-style` (kategorie technika).

---

## File Structure

- `src/lib/stroje.ts` — rozšíření `interface StrojModel` + nové typy `CommonFault`, `UsedPrice`.
- `src/lib/faq-generator.ts` — nová Q&A z `common_faults` / `used_price` / `for_whom`.
- `tests/lib/faq-generator.test.ts` — testy nových Q&A.
- `src/i18n/ui/{cs,sk,uk,pl}.ts` — nové `cat.s.d.*` klíče pro nadpisy sekcí.
- `tests/i18n/stroje-detail.test.ts` — parita klíčů (existující test, musí zůstat zelený).
- `src/pages/stroje/[brand]/[series]/[model]/index.astro` — render nových sekcí.
- `src/data/stroje/zetor.yaml` — naplnění dat pro Zetor modely.

---

## Task 1: Rozšířit typ `StrojModel` o nová pole

**Files:**
- Modify: `src/lib/stroje.ts` (interface `StrojModel`, kolem ř. 32–56)
- Test: `tests/lib/stroje.test.ts`

- [ ] **Step 1: Napsat failing test**

Přidej do `tests/lib/stroje.test.ts` (na konec souboru, před poslední `});` uzávěr describe pokud existuje — jinak nový describe blok):

```ts
import { getModelBySlug } from '../../src/lib/stroje';

describe('StrojModel — nová editorial pole', () => {
  it('model bez nových polí se načte a pole jsou undefined (žádný crash)', () => {
    const found = getModelBySlug('zetor-7745');
    expect(found).not.toBeNull();
    // Nová pole jsou volitelná — u nenaplněného modelu undefined:
    expect(found!.model.common_faults ?? undefined).toBeUndefined();
    expect(found!.model.used_price ?? undefined).toBeUndefined();
  });
});
```

Pozn.: `getModelBySlug` vrací `{ brand, series, model }` — ověř skutečný tvar v `src/lib/stroje.ts` a případně uprav destrukturování (`found!.model`).

- [ ] **Step 2: Spustit test — musí selhat**

Run: `npx vitest run tests/lib/stroje.test.ts`
Expected: FAIL — TypeScript chyba „Property 'common_faults' does not exist on type 'StrojModel'".

- [ ] **Step 3: Přidat pole do typu**

V `src/lib/stroje.ts` přidej nad `export interface StrojModel` dva pomocné typy:

```ts
export interface CommonFault {
  issue: string;
  note?: string;
}

export interface UsedPrice {
  min: number;        // CZK
  max: number;        // CZK
  note?: string;
}
```

A do `interface StrojModel` na konec (za `typ_zavesu`) přidej:

```ts
  // Editorial obohacení (vlna 2026-07 — SEO). Vše volitelné; sekce se renderuje jen když pole existuje.
  overview?: string;
  reliability?: string;
  common_faults?: CommonFault[];
  pros?: string[];
  cons?: string[];
  used_price?: UsedPrice;
  for_whom?: string;
```

- [ ] **Step 4: Spustit test — musí projít**

Run: `npx vitest run tests/lib/stroje.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/stroje.ts tests/lib/stroje.test.ts
git commit -m "feat(stroje): editorial pole v StrojModel (overview/závady/pro-proti/cena ojetin)"
```

---

## Task 2: Nová FAQ Q&A z editorial polí

**Files:**
- Modify: `src/lib/faq-generator.ts`
- Test: `tests/lib/faq-generator.test.ts`

Kontext: `generateModelFaq` čte `model` (typ `StrojModel`), skládá `items: FaqItem[]` a na konci vrací `items.length >= 3 ? items : null`. Nová Q&A přidej **před** ten závěrečný `return`. Helper `L(cs, sk, uk, pl)` a `fullName` už v souboru existují.

- [ ] **Step 1: Napsat failing testy**

Přidej do `tests/lib/faq-generator.test.ts` nový describe blok:

```ts
describe('generateModelFaq — editorial pole', () => {
  const base: any = {
    slug: 'zetor-7745', name: '7745', power_hp: 68, power_kw: 50,
    year_from: 1986, year_to: 1992, engine: 'Zetor 7201', transmission: '10+2',
  };

  it('common_faults → otázka o závadách (cs)', () => {
    const model = { ...base, common_faults: [{ issue: 'Netěsnost hydraulického rozvaděče' }, { issue: 'Opotřebení spojky' }] };
    const faq = generateModelFaq({ brand: { name: 'Zetor' }, model, category: 'traktory', categorySingular: 'traktor' });
    const q = faq!.find((i) => i.q.includes('závady'));
    expect(q).toBeTruthy();
    expect(q!.a).toContain('Netěsnost hydraulického rozvaděče');
  });

  it('used_price → otázka o ceně ojetiny (cs)', () => {
    const model = { ...base, used_price: { min: 120000, max: 260000, note: 'Podle stavu a nájezdu.' } };
    const faq = generateModelFaq({ brand: { name: 'Zetor' }, model, category: 'traktory', categorySingular: 'traktor' });
    const q = faq!.find((i) => i.q.toLowerCase().includes('ojetý'));
    expect(q).toBeTruthy();
    expect(q!.a).toContain('120');
    expect(q!.a).toContain('260');
  });

  it('sk varianta neobsahuje cs diakritiku ř/ě/ů', () => {
    const model = { ...base, common_faults: [{ issue: 'Test' }], used_price: { min: 100000, max: 200000 } };
    const faq = generateModelFaq({ brand: { name: 'Zetor' }, model, category: 'traktory', categorySingular: 'traktor', locale: 'sk' });
    const blob = faq!.filter((i) => i.q.includes('poruch') || i.q.toLowerCase().includes('ojazd')).map((i) => i.q + ' ' + i.a).join(' ');
    expect(blob).not.toMatch(/[řěůĚŘŮ]/);
  });
});
```

- [ ] **Step 2: Spustit — musí selhat**

Run: `npx vitest run tests/lib/faq-generator.test.ts`
Expected: FAIL — nové otázky se nenajdou (`q` je undefined).

- [ ] **Step 3: Implementovat nová Q&A**

V `src/lib/faq-generator.ts` přidej **před** závěrečný `return items.length >= 3 ? items : null;`:

```ts
  // Časté závady (jen když jsou data).
  if (model.common_faults && model.common_faults.length) {
    const list = model.common_faults.map((f) => f.issue).slice(0, 5).join('; ');
    items.push({
      q: L(
        `Jaké má ${fullName} časté závady?`,
        `Aké má ${fullName} časté poruchy?`,
        `Які поширені несправності має ${fullName}?`,
        `Jakie są typowe usterki ${fullName}?`,
      ),
      a: L(
        `Mezi častěji zmiňované slabiny ${fullName} patří: ${list}. Konkrétní stav vždy závisí na údržbě a nájezdu daného kusu.`,
        `Medzi častejšie spomínané slabiny ${fullName} patria: ${list}. Konkrétny stav vždy závisí od údržby a najazdu daného kusu.`,
        `До частіше згадуваних слабких місць ${fullName} належать: ${list}. Конкретний стан завжди залежить від обслуговування та напрацювання екземпляра.`,
        `Do częściej wymienianych słabości ${fullName} należą: ${list}. Konkretny stan zawsze zależy od serwisowania i przebiegu danego egzemplarza.`,
      ),
    });
  }

  // Cena ojetiny (orientační trh, nezávisle na live bazaru).
  if (model.used_price) {
    const { min, max, note } = model.used_price;
    const range = min === max ? `${fmtNumber(min)} Kč` : `${fmtNumber(min)}–${fmtNumber(max)} Kč`;
    const notePart = note ? ` ${note}` : '';
    items.push({
      q: L(
        `Kolik stojí ojetý ${fullName}?`,
        `Koľko stojí ojazdený ${fullName}?`,
        `Скільки коштує вживаний ${fullName}?`,
        `Ile kosztuje używany ${fullName}?`,
      ),
      a: L(
        `Ojetý ${fullName} se na sekundárním trhu pohybuje orientačně v rozpětí ${range}.${notePart}`,
        `Ojazdený ${fullName} sa na sekundárnom trhu pohybuje orientačne v rozpätí ${range}.${notePart}`,
        `Вживаний ${fullName} на вторинному ринку коштує орієнтовно в діапазоні ${range}.${notePart}`,
        `Używany ${fullName} na rynku wtórnym kosztuje orientacyjnie w przedziale ${range}.${notePart}`,
      ),
    });
  }
```

- [ ] **Step 4: Spustit — musí projít**

Run: `npx vitest run tests/lib/faq-generator.test.ts`
Expected: PASS (všechny, včetně stávajících).

- [ ] **Step 5: Commit**

```bash
git add src/lib/faq-generator.ts tests/lib/faq-generator.test.ts
git commit -m "feat(faq): Q&A o častých závadách a ceně ojetiny z editorial polí modelu"
```

---

## Task 3: i18n klíče pro nové sekce

**Files:**
- Modify: `src/i18n/ui/cs.ts`, `src/i18n/ui/sk.ts`, `src/i18n/ui/uk.ts`, `src/i18n/ui/pl.ts`
- Test: `tests/i18n/stroje-detail.test.ts` (existující — musí zůstat zelený)

Kontext: klíče jsou ploché stringy. Test `stroje-detail.test.ts` vyžaduje shodnou množinu `cat.s.d.*` v cs a sk. Přidávej do všech 4 souborů.

- [ ] **Step 1: Přidat klíče do cs.ts**

V `src/i18n/ui/cs.ts` za řádek `'cat.s.d.priceLabel': 'Ceny v bazaru',` (ř. ~791) přidej:

```ts
  'cat.s.d.faultsTitle': 'Časté závady a spolehlivost',
  'cat.s.d.reliabilityLabel': 'Spolehlivost',
  'cat.s.d.faultsNoteLabel': 'Na co si dát pozor',
  'cat.s.d.prosconsTitle': 'Silné a slabé stránky',
  'cat.s.d.prosTitle': 'Silné stránky',
  'cat.s.d.consTitle': 'Slabé stránky',
  'cat.s.d.forWhomTitle': 'Pro koho se {model} hodí',
  'cat.s.d.usedPriceLabel': 'Obvyklá cena ojetiny',
```

- [ ] **Step 2: Přidat stejné klíče do sk.ts**

V `src/i18n/ui/sk.ts` na odpovídající místo (za `cat.s.d.priceLabel`):

```ts
  'cat.s.d.faultsTitle': 'Časté poruchy a spoľahlivosť',
  'cat.s.d.reliabilityLabel': 'Spoľahlivosť',
  'cat.s.d.faultsNoteLabel': 'Na čo si dať pozor',
  'cat.s.d.prosconsTitle': 'Silné a slabé stránky',
  'cat.s.d.prosTitle': 'Silné stránky',
  'cat.s.d.consTitle': 'Slabé stránky',
  'cat.s.d.forWhomTitle': 'Pre koho sa {model} hodí',
  'cat.s.d.usedPriceLabel': 'Obvyklá cena ojazdeného',
```

- [ ] **Step 3: Přidat do uk.ts**

V `src/i18n/ui/uk.ts`:

```ts
  'cat.s.d.faultsTitle': 'Поширені несправності та надійність',
  'cat.s.d.reliabilityLabel': 'Надійність',
  'cat.s.d.faultsNoteLabel': 'На що звернути увагу',
  'cat.s.d.prosconsTitle': 'Сильні та слабкі сторони',
  'cat.s.d.prosTitle': 'Сильні сторони',
  'cat.s.d.consTitle': 'Слабкі сторони',
  'cat.s.d.forWhomTitle': 'Для кого підходить {model}',
  'cat.s.d.usedPriceLabel': 'Звичайна ціна вживаного',
```

- [ ] **Step 4: Přidat do pl.ts**

V `src/i18n/ui/pl.ts`:

```ts
  'cat.s.d.faultsTitle': 'Typowe usterki i niezawodność',
  'cat.s.d.reliabilityLabel': 'Niezawodność',
  'cat.s.d.faultsNoteLabel': 'Na co zwrócić uwagę',
  'cat.s.d.prosconsTitle': 'Mocne i słabe strony',
  'cat.s.d.prosTitle': 'Mocne strony',
  'cat.s.d.consTitle': 'Słabe strony',
  'cat.s.d.forWhomTitle': 'Dla kogo {model} się nadaje',
  'cat.s.d.usedPriceLabel': 'Typowa cena używanego',
```

- [ ] **Step 5: Spustit paritní testy — musí projít**

Run: `npx vitest run tests/i18n/stroje-detail.test.ts tests/i18n/ui-full.test.ts tests/i18n/ui-pl-parity.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/i18n/ui/cs.ts src/i18n/ui/sk.ts src/i18n/ui/uk.ts src/i18n/ui/pl.ts
git commit -m "i18n(stroje): klíče pro sekce závady/pro-proti/cena ojetin (cs/sk/uk/pl)"
```

---

## Task 4: Render nových sekcí na modelové stránce

**Files:**
- Modify: `src/pages/stroje/[brand]/[series]/[model]/index.astro`

Kontext: sekce se vkládají do `.content-main` (uvnitř `<div class="content-grid">`). Vzorem je stávající `usecase-card` / `competitor-card` / `faq-card`. Helpery `tr()` (překlad klíče v aktuálním locale) a `tf(locale, key, params)` (s parametry) už jsou v souboru. Nová `used_price` část jde do `aside` vedle `priceStats`.

- [ ] **Step 1: Overview — rozšířit hero lede**

Najdi (ř. ~321): `{model.description && <p class="hero-lede">{model.description}</p>}`
Nahraď za:

```astro
        {(model.overview || model.description) && <p class="hero-lede">{model.overview || model.description}</p>}
```

- [ ] **Step 2: Sekce „Časté závady a spolehlivost"**

Vlož **za** blok `usecase-card` (za jeho uzavírací `)}`, kolem ř. 424) a **před** `competitor-card`:

```astro
        {(model.reliability || (model.common_faults && model.common_faults.length > 0)) && (
          <section class="faults-card">
            <div class="card-head">
              <h2>{tr('cat.s.d.faultsTitle')}</h2>
            </div>
            {model.reliability && <p class="faults-lede">{model.reliability}</p>}
            {model.common_faults && model.common_faults.length > 0 && (
              <ul class="faults-list">
                {model.common_faults.map((f) => (
                  <li class="fault-item">
                    <span class="fault-issue">{f.issue}</span>
                    {f.note && <span class="fault-note">{f.note}</span>}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {((model.pros && model.pros.length > 0) || (model.cons && model.cons.length > 0)) && (
          <section class="proscons-card">
            <div class="card-head">
              <h2>{tr('cat.s.d.prosconsTitle')}</h2>
            </div>
            <div class="pc-grid">
              {model.pros && model.pros.length > 0 && (
                <div class="pc-col pc-pros">
                  <h3>{tr('cat.s.d.prosTitle')}</h3>
                  <ul>{model.pros.map((p) => <li>{p}</li>)}</ul>
                </div>
              )}
              {model.cons && model.cons.length > 0 && (
                <div class="pc-col pc-cons">
                  <h3>{tr('cat.s.d.consTitle')}</h3>
                  <ul>{model.cons.map((c) => <li>{c}</li>)}</ul>
                </div>
              )}
            </div>
          </section>
        )}

        {model.for_whom && (
          <section class="forwhom-card">
            <div class="card-head">
              <h2>{tf(locale, 'cat.s.d.forWhomTitle', { model: model.name })}</h2>
            </div>
            <p class="forwhom-text">{model.for_whom}</p>
          </section>
        )}
```

- [ ] **Step 3: Cena ojetiny do aside**

V bloku `aside-card primary-cta-card` najdi `{priceStats && ( ... )}` (ř. ~521) a **za** ním přidej:

```astro
          {model.used_price && (
            <div class="aside-price aside-used-price">
              <span class="ap-label">{tr('cat.s.d.usedPriceLabel')}</span>
              <span class="ap-value">{model.used_price.min === model.used_price.max ? `${priceFmt(model.used_price.min)} Kč` : `${priceFmt(model.used_price.min)} – ${priceFmt(model.used_price.max)} Kč`}</span>
              {model.used_price.note && <span class="ap-note">{model.used_price.note}</span>}
            </div>
          )}
```

- [ ] **Step 4: Styly nových sekcí**

Do `<style>` bloku (za styly `.faq-card` / `.related-card`, kolem ř. 702) přidej:

```css
  .model-page .faults-card, .model-page .proscons-card, .model-page .forwhom-card{
    background:var(--card,#fff);border:1px solid var(--line,#e5e5e5);border-radius:var(--r-lg,18px);padding:24px;margin-top:20px;
  }
  .model-page .faults-lede, .model-page .forwhom-text{margin:0 0 12px;line-height:1.6}
  .model-page .faults-list{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:10px}
  .model-page .fault-item{display:flex;flex-direction:column;gap:2px;padding-left:16px;border-left:3px solid var(--yellow,#FFEA00)}
  .model-page .fault-issue{font-weight:600}
  .model-page .fault-note{font-size:.92em;color:#666}
  .model-page .pc-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
  .model-page .pc-col h3{margin:0 0 8px;font-size:1rem}
  .model-page .pc-col ul{margin:0;padding-left:18px;line-height:1.6}
  .model-page .pc-pros h3{color:var(--green,#0B7A3B)}
  .model-page .pc-cons h3{color:#b02a1a}
  .model-page .aside-used-price{margin-top:8px}
  .model-page .aside-used-price .ap-note{display:block;font-size:.85em;color:#666;margin-top:2px}
  @media (max-width:560px){ .model-page .pc-grid{grid-template-columns:1fr} }
```

- [ ] **Step 5: Render smoke test (build-free, dev server)**

Spusť dev server a ověř render. Nejprve dočasně naplň jeden model daty (nebo pokračuj až po Tasku 5 a ověř na Zetor 7745). Rychlá varianta bez dat:

Run:
```bash
export NVM_DIR="$HOME/.nvm" && \. "$NVM_DIR/nvm.sh" && nvm use 22 && npm run dev &
sleep 6
curl -s http://localhost:4321/stroje/zetor/ur-i/7745/ | grep -c "faults-card\|hero-lede"
```
Expected: stránka vrací HTTP obsah (200), `hero-lede` přítomen; `faults-card` zatím 0 (data ještě nejsou) — to je OK, sekce je podmíněná. Po Tasku 5 bude `faults-card` = 1.
Ukonči dev server (`kill %1`).

- [ ] **Step 6: Commit**

```bash
git add "src/pages/stroje/[brand]/[series]/[model]/index.astro"
git commit -m "feat(stroje): render sekcí závady/pro-proti/pro-koho + cena ojetin v aside"
```

---

## Task 5: Naplnit data pro Zetor modely (vlna 1)

**Files:**
- Modify: `src/data/stroje/zetor.yaml`

**Modely (dle GSC priority):** `zetor-7745`, `zetor-7745-turbo`, `zetor-7711`, `zetor-6211`, `zetor-8211`, `zetor-12145`, + Major 60 (najdi přesný slug: `grep -n "major" src/data/stroje/zetor.yaml`). Volitelně doplnit populární kusy z rodin Forterra / Proxima / Crystal.

**⚠️ Přesnost je kritická (E-E-A-T).** Fakta o závadách, spolehlivosti a cenách ojetin musí být podložená — NE vymyšlená. Zdroje: značková/traktorová fóra (např. diskuze o Zetorech UR I), inzertní portály pro rozpětí cen ojetin (bazoš, TipTrucker, agroinzerce), veřejné materiály. Kde chybí spolehlivý podklad, pole vynech — sekce se nezobrazí, což je lepší než nepřesnost. Text piš dle skillu `czech-ag-article-style`.

- [ ] **Step 1: Rešerše + draft per model**

Pro každý model shromáždi z ověřených zdrojů: 2–4 věty `overview`, `reliability`, 2–5 `common_faults`, 3–5 `pros`, 1–4 `cons`, `used_price` (min/max/note), `for_whom`. Zapiš zdroje do poznámky pro review (Step 3).

- [ ] **Step 2: Zapsat do YAML**

Přidej pole k příslušnému modelu v `src/data/stroje/zetor.yaml`. **Struktura** (odsazení = model má pole na stejné úrovni jako `description`; víceřádkové stringy přes `>`):

```yaml
          - slug: zetor-7745
            name: "7745"
            year_from: 1986
            year_to: 1992
            power_hp: 68
            power_kw: 50
            engine: "Zetor 7201, 4-válec"
            description: "<stávající jednovětný popis — ponech>"
            overview: >
              <2–4 věty: zařazení v řadě UR I, k čemu se hodil, čím je typický na trhu ojetin>
            reliability: >
              <1–2 věty o spolehlivosti/životnosti>
            common_faults:
              - issue: "<závada 1>"
                note: "<na co pozor / jak řešit>"
              - issue: "<závada 2>"
            pros:
              - "<klad 1>"
              - "<klad 2>"
            cons:
              - "<zápor 1>"
            used_price:
              min: 120000
              max: 260000
              note: "Podle stavu, nájezdu a výbavy."
            for_whom: >
              <1–2 věty verdikt / pro koho>
```

Pozn.: YAML čistě numerické hodnoty (min/max) jsou čísla — bez uvozovek. Slugy jako `"7745"` v uvozovkách (viz existující konvence).

- [ ] **Step 3: REVIEW GATE — schválení uživatelem**

Předlož uživateli seznam naplněných modelů + použité zdroje faktů. Pokračuj až po schválení (přesnost závad/cen). Toto je bod, kde uživatel potvrdí, že obsah je věcně správný.

- [ ] **Step 4: Ověřit parsování YAML**

Run: `npx vitest run tests/lib/stroje.test.ts tests/lib/faq-generator.test.ts`
Expected: PASS (žádná YAML parse chyba, `getModelBySlug('zetor-7745')` vrací model s `common_faults`).

Volitelně rychlá kontrola bad-indentation (viz historická gotcha „glued YAML lines"):
```bash
grep -nE "^( {8,})[a-z_]+: [^\n]+  +[a-z_]+:" src/data/stroje/zetor.yaml
```
Expected: žádný výstup.

- [ ] **Step 5: Commit**

```bash
git add src/data/stroje/zetor.yaml
git commit -m "content(stroje): editorial detaily pro top Zetor modely (7745/7711/6211/8211/12145/Major 60)"
```

---

## Task 6: Build, smoke test, deploy

**Files:** žádné (verifikace + deploy)

- [ ] **Step 1: Plný build (Node 22)**

Run:
```bash
export NVM_DIR="$HOME/.nvm" && \. "$NVM_DIR/nvm.sh" && nvm use 22 && npm run build
```
Expected: build zelený. (Pozn.: lokální build může padat na `node:fs/promises glob` na Node 20.20 — proto Node 22. Pokud padne `/statistiky` na CZSO timeout, spusť build znovu.)

- [ ] **Step 2: Kompletní test suite**

Run: `npx vitest run`
Expected: mé testy zelené; případné pre-existing červené (komodita/nav z jiných oken) nesouvisí — ověř, že selhání nejsou v `faq-generator`, `stroje`, `stroje-detail`, `ui-*`.

- [ ] **Step 3: Render smoke na dev serveru**

Run:
```bash
export NVM_DIR="$HOME/.nvm" && \. "$NVM_DIR/nvm.sh" && nvm use 22 && npm run dev &
sleep 6
curl -s http://localhost:4321/stroje/zetor/ur-i/7745/ | grep -oE "faults-card|proscons-card|forwhom-card|aside-used-price" | sort -u
curl -s http://localhost:4321/stroje/zetor/ur-i/7745/ | grep -c "application/ld+json"
kill %1
```
Expected: vypíše přítomné nové sekce; FAQ JSON-LD skript přítomen (≥1). Ověř i model BEZ dat (např. starý `zetor-25`) → 200, nové sekce se nezobrazí.

- [ ] **Step 4: Push + deploy (Coolify VPS)**

Deploy agro-svet je přes `git push` → Coolify build → purge. Ověř, že pushuješ jen relevantní commity (ne cizí WIP z disku):

```bash
git log --oneline origin/master..HEAD
git push origin master
```
Po doběhu Coolify buildu spusť purge cache dle zvyklostí projektu (`npm run purge` nebo ekvivalent — ověř v package.json).

- [ ] **Step 5: Smoke test produkce**

Run:
```bash
curl -sI https://agro-svet.cz/stroje/zetor/ur-i/7745/ | head -1
curl -s https://agro-svet.cz/stroje/zetor/ur-i/7745/ | grep -oE "faults-card|Časté závady|Obvyklá cena ojetiny" | sort -u
```
Expected: HTTP 200; nové sekce v produkčním HTML.

- [ ] **Step 6: Aktualizovat memory**

Zapiš do memory ([[project-agro-svet-stroje-model-seo-tuning]]) stav vlny 1 (naplněné modely, nasazeno) a odkaz na navazující vlny 2/3 + značky.

---

## Navazující plány (mimo tento plán)
- **Vlna 2 — Deutz-Fahr** (DX / AgroPlus / Agrotron rodiny) — stejná mašinérie, jen naplnění dat + review gate.
- **Vlna 3** — MF / Fendt / Valtra / Case (dle GSC).
- **Značky** — bohatší brand `description` + blok „Nejhledanější modely" na `/stroje/[brand]/` a `/znacky/[slug]`.
- **Fáze 2 — uživatelské recenze** + `Review`/`AggregateRating` JSON-LD (samostatný projekt, až porostou kliky).

---

## Self-Review

**Spec coverage:**
- Nová strukturovaná pole → Task 1. ✓
- Render podmíněných sekcí → Task 4. ✓
- FAQ + JSON-LD napojení → Task 2 (JSON-LD jede automaticky přes existující `faqPageSchema`). ✓
- Naplnění vlny 1 Zetor + přesnost/review → Task 5 (Step 3 review gate). ✓
- Cena ojetin vs bazar (obojí zobrazeno) → Task 4 Step 3. ✓
- i18n locale-aware struktura → Task 2 (L helper) + Task 3 (klíče cs/sk/uk/pl). ✓
- Značky (lehčí obohacení) → přesunuto do navazujícího plánu (spec to připouští: „přesný rozsah doladit v plánu"; model-level je priorita). ✓
- Recenze fáze 2 → explicitně mimo rozsah. ✓
- Testy (loader, faq, render smoke, build, i18n parita) → Tasky 1,2,3,6. ✓

**Placeholder scan:** Task 5 obsahuje `<...>` značky ZÁMĚRNĚ — jde o rešeršně získaný obsah, který nelze předepsat bez ověření zdrojů; struktura YAML i review gate jsou konkrétní. Engineering kroky (1–4, 6) jsou bez placeholderů, s reálným kódem.

**Type consistency:** `CommonFault {issue, note?}`, `UsedPrice {min,max,note?}` definované v Task 1 a použité shodně v Task 2 (faq), Task 4 (render), Task 5 (YAML). `model.common_faults`, `model.used_price`, `model.pros/cons`, `model.overview`, `model.reliability`, `model.for_whom` konzistentní napříč. i18n klíče `cat.s.d.faultsTitle/reliabilityLabel/faultsNoteLabel/prosconsTitle/prosTitle/consTitle/forWhomTitle/usedPriceLabel` shodné v Task 3 a Task 4. ✓
