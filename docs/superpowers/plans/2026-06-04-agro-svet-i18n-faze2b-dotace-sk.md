# Fáze 2b balík A — Dotace PPA SR (SK) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Odemknout pro slovenskou jazykovou verzi sekce `/kalkulacka/dotace-cap` (interaktivní kalkulačka přímých plateb PPA SR v EUR) a `/dotace` (obsahová sekce investičních titulů PPA SR), s reálnými ověřenými daty, a zindexovat je.

**Architecture:** Projekt nemá fyzické `/sk/` stránky — middleware rewritne `/sk/foo` → `/foo` s `Astro.locals.locale='sk'`, lock = 307 redirect. Odemčení = (1) odebrat prefix z `LOCKED_SECTION_PREFIXES`, (2) udělat existující stránky `prerender=false` SSR + locale-aware (vzor `kalkulacka/naklady-na-hektar`). Kalkulačka: SK schéma se strukturně liší od CZ → každá jurisdikce ve vlastní `.astro` komponentě, sdílená tenká stránka. Obsah: overlay kolekce `dotaceSk` (vzor `znackySk`), slugy SK ≠ CZ → bez cs fallbacku.

**Tech Stack:** Astro 5 (SSR, content collections, i18n middleware), TypeScript, Vitest, Cloudflare Worker (deploy mimo tento plán — manuální `npm run deploy`).

**Spec:** [`docs/superpowers/specs/2026-06-04-agro-svet-i18n-faze2b-dotace-sk-design.md`](../specs/2026-06-04-agro-svet-i18n-faze2b-dotace-sk-design.md)

**Branch:** `feat/i18n-sk-dotace` (už vytvořena z `origin/master`). Cizí WIP (6 OG PNG v `public/og/`) zůstává untracked — **nikdy** `git add -A`, commituj jen jmenované soubory. Po každém tasku `git show --stat HEAD` ověř, že počet uncommitted souborů neklesl.

---

## File Structure

**A1 — Kalkulačka:**
- Create `src/lib/sk-cap-dotace.ts` — SK sazby, typy, `calculateCapSk`, `formatEur`.
- Create `tests/lib/sk-cap-dotace.test.ts` — unit testy enginu.
- Create `src/components/calc/DotaceCapCz.astro` — CZ formulář+script (verbatim přesun).
- Create `src/components/calc/DotaceCapSk.astro` — SK formulář+script.
- Create `src/i18n/kalkulacka/dotace-cap.ts` — `content[locale]` (title/meta/FAQ/copy).
- Modify `src/pages/kalkulacka/dotace-cap/index.astro` — `prerender=false`, locale branch.

**A2 — Obsah `/dotace`:**
- Modify `src/content.config.ts` — kolekce `dotaceSk` (sdílené schema).
- Create `src/content/dotace-sk/*.md` ×3 — SK investiční tituly PPA.
- Create `src/data/dotace-kola-sk.json` — kola PPA SR.
- Create `src/i18n/dotace.ts` — `content[locale]` copy sekce.
- Modify `src/pages/dotace/index.astro` — SSR locale-aware.
- Modify `src/pages/dotace/[slug].astro` — SSR locale-aware, bez getStaticPaths.
- Modify `src/pages/dotace/kalendar-kol/index.astro` — SSR locale-aware.

**Odemčení / indexace:**
- Modify `src/i18n/nav.ts` — odebrat 2 prefixy z `LOCKED_SECTION_PREFIXES`.
- Modify `src/i18n/utils.ts` — přidat `/dotace` do `SK_LAUNCHED_PREFIXES`.
- Modify `tests/i18n/nav.test.ts`, `tests/i18n/utils.test.ts` — lock/launch matice.
- Verify/Modify `src/pages/sitemap.xml.ts`, `src/pages/llms.txt.ts` — sk varianty.

---

## Task 0: Verifikace dat (GATE — žádný kód kalkulačky/obsahu před tímto)

**Účel:** Potvrdit/opravit sazby a investiční tituly proti oficiálnímu primárnímu zdroji.
Spec §7 obsahuje dual-sourced 2024 aktuály (pevné) a několik 2023-plánovaných (overiť).

**Files:** žádné kódové; výstup = potvrzená tabulka v `docs/superpowers/specs/...-dotace-sk-design.md` §7.

- [ ] **Step 1: Stáhnout oficiální sazby**

Otevřít https://www.apa.sk/sadzby → soubor „Sadzby priamych platieb pre rok 2024" (.xlsx).
Pokud .xlsx nečitelný nástroji, použít https://www.apa.sk/priame-podpory a Vestník MPRV SR.

- [ ] **Step 2: Potvrdit/opravit „overiť" řádky §7**

Pro chmeľ, ovocie, zelenina (prácna/vysoko prácna), mladý poľnohospodár (sazba €/ha + strop ha)
najít hodnoty 2024. Pokud se liší od specu, přepsat hodnoty v §7 **a** v `SAZBY_SK`/`VCS_SEKTORY_SK`
(Task 1) před implementací. Pevné 2024 řádky (BISS 103,80 / CRISS 79+40 / eko 60,36+110,45 /
cukrová repa 477,80 / bielkoviny 69,90) jen zkontrolovat.

- [ ] **Step 3: Ověřit 3 investiční tituly PPA pro A2**

Najít 3 reálné investiční intervence Strategického plánu SPP SR 2023–2027 relevantní pro
techniku/podniky (typicky: investície do poľnohospodárskych podnikov; investície do
spracovania; mladý poľnohospodár — začatie činnosti). Pro každý zaznamenat: oficiálny názov,
kód intervencie, % podpory, strop, oprávnený žiadateľ, URL primárneho zdroja (apa.sk/mpsr.sk).
Tyto fakty konzumuje Task 11 (psaní md). Zapsat je do §7 specu jako pod-sekci „A2 tituly".

- [ ] **Step 4: Commit aktualizace specu**

```bash
git add docs/superpowers/specs/2026-06-04-agro-svet-i18n-faze2b-dotace-sk-design.md
git commit -m "docs(i18n): Task 0 — verifikace sazeb a titulů PPA SR proti apa.sk"
```

> Pokud některá hodnota zůstane neověřitelná i z primáru, ponechat nejlepší dostupnou
> s komentářem `// NEOVĚŘENO 2024, zdroj 2023 plán` a `lastVerified` v UI. Nikdy nevymýšlet.

---

## Task 1: `sk-cap-dotace.ts` engine + unit testy (TDD)

**Files:**
- Create: `src/lib/sk-cap-dotace.ts`
- Test: `tests/lib/sk-cap-dotace.test.ts`

- [ ] **Step 1: Napsat failing testy**

Create `tests/lib/sk-cap-dotace.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { calculateCapSk, formatEur, SAZBY_SK, VCS_SEKTORY_SK } from '../../src/lib/sk-cap-dotace';

const base = { totalHa: 0, chvuHa: 0, mladyPolnohospodar: false, vcsHa: {} as Record<string, number> };

describe('calculateCapSk', () => {
  it('prázdný výsledek pro totalHa <= 0', () => {
    const r = calculateCapSk({ ...base, totalHa: 0 });
    expect(r.items).toEqual([]);
    expect(r.total).toBe(0);
    expect(r.perHa).toBe(0);
  });

  it('BISS + CRISS tier1 + eko mimo CHVÚ pro 50 ha', () => {
    const r = calculateCapSk({ ...base, totalHa: 50 });
    // biss 50*103.80=5190; criss 50*79=3950; eko 50*60.36=3018
    expect(r.total).toBeCloseTo(12158, 2);
    expect(r.perHa).toBeCloseTo(243.16, 2);
  });

  it('CRISS dvoustupňová nad 100,99 ha (120 ha)', () => {
    const r = calculateCapSk({ ...base, totalHa: 120 });
    const criss = r.items.find((i) => i.key === 'criss')!;
    // tier1 100.99*79=7978.21 ; tier2 (120-100.99)*40=760.40 ; součet 8738.61
    expect(criss.amount).toBeCloseTo(8738.61, 2);
  });

  it('CRISS strop 150 ha (200 ha → tier2 jen do 150)', () => {
    const r = calculateCapSk({ ...base, totalHa: 200 });
    const criss = r.items.find((i) => i.key === 'criss')!;
    // tier1 100.99*79=7978.21 ; tier2 (150-100.99)*40=1960.40 ; součet 9938.61
    expect(criss.amount).toBeCloseTo(9938.61, 2);
  });

  it('ekoschéma: plocha v CHVÚ vyšší sazbou, zbytek nižší', () => {
    const r = calculateCapSk({ ...base, totalHa: 10, chvuHa: 4 });
    const eko = r.items.find((i) => i.key === 'eko')!;
    // 4*110.45 + 6*60.36 = 441.80 + 362.16 = 803.96
    expect(eko.amount).toBeCloseTo(803.96, 2);
  });

  it('chvuHa se ořízne na totalHa', () => {
    const r = calculateCapSk({ ...base, totalHa: 5, chvuHa: 20 });
    const eko = r.items.find((i) => i.key === 'eko')!;
    expect(eko.amount).toBeCloseTo(5 * SAZBY_SK.ekoChvu, 2);
  });

  it('mladý poľnohospodár max 28 ha', () => {
    const r = calculateCapSk({ ...base, totalHa: 40, mladyPolnohospodar: true });
    const m = r.items.find((i) => i.key === 'mlady')!;
    expect(m.ha).toBe(28);
    expect(m.amount).toBeCloseTo(28 * SAZBY_SK.mlady, 2);
  });

  it('VCS sektor se počítá a ořízne na totalHa', () => {
    const r = calculateCapSk({ ...base, totalHa: 5, vcsHa: { 'cukrova-repa': 5 } });
    const v = r.items.find((i) => i.key === 'vcs-cukrova-repa')!;
    const sektor = VCS_SEKTORY_SK.find((s) => s.slug === 'cukrova-repa')!;
    expect(v.amount).toBeCloseTo(5 * sektor.sazba, 2);
  });

  it('neznámý VCS slug se ignoruje', () => {
    const r = calculateCapSk({ ...base, totalHa: 10, vcsHa: { neexistuje: 5 } });
    expect(r.items.some((i) => i.key.startsWith('vcs-'))).toBe(false);
  });
});

describe('formatEur', () => {
  it('formátuje s eurem a bez desetin', () => {
    expect(formatEur(1234)).toMatch(/€/);
    expect(formatEur(1234)).not.toMatch(/[.,]\d/);
  });
});
```

- [ ] **Step 2: Spustit testy — musí failovat**

Run: `cd ~/agro-svet-i18n-obsah && npx vitest run tests/lib/sk-cap-dotace.test.ts`
Expected: FAIL — `Cannot find module '../../src/lib/sk-cap-dotace'`.

- [ ] **Step 3: Implementovat `sk-cap-dotace.ts`**

Create `src/lib/sk-cap-dotace.ts`:

```ts
// Kalkulačka priamych platieb SPP 2023–2027 pre Slovensko (Strategický plán SR).
//
// Sadzby sú ORIENTAČNÉ. „Pevné" hodnoty = aktuály 2024 z Vestníka MPRV SR.
// „NEOVERENÉ 2024" = 2023 plánované, čakajú na potvrdenie z apa.sk (Task 0).
// Záväzné sú sadzby PPA — UI musí jasne označiť „orientačné" a smerovať na apa.sk.
//
// Čo kalkulačka NEPOKRÝVA (zámerne mimo V1):
// - ANC (oblasti s prírodnými obmedzeniami) — v SR samostatne v rámci rozvoja
//   vidieka, per-ha sadzba nedohľadateľná (len poznámka v UI).
// - Platby na zviera (dojnice ~270,95 €/ks, ovce/kozy ~24,15 €/ks 2024) — kalkulačka
//   je plošná (€/ha).
// - AEKO, welfare zvierat, investičné intervencie (tie sú v sekcii /dotace).

export interface VcsSektorSk {
  slug: string;
  name: string;
  /** Sadzba €/ha. */
  sazba: number;
  /** Popis do tooltipu. */
  description: string;
}

export const SAZBY_SK = {
  biss: 103.80,            // zdroj: polnoinfo.sk + Vestník MPRV SR, 2024
  crissTier1: 79,          // zdroj: polnoinfo.sk, 2024
  crissTier1MaxHa: 100.99, // zdroj: polnoinfo.sk, 2024
  crissTier2: 40,          // zdroj: polnoinfo.sk, 2024
  crissTier2MaxHa: 150,    // nad 150 ha = 0
  ekoMimoChvu: 60.36,      // ekoschéma mimo CHVÚ, zdroj: polnoinfo.sk, 2024
  ekoChvu: 110.45,         // ekoschéma v CHVÚ, zdroj: polnoinfo.sk, 2024
  mlady: 100,              // €/ha — NEOVERENÉ 2024 (2023 plán, agrobiznis); Task 0 potvrdí
  mladyMaxHa: 28,          // strop 2024, zdroj: search Vestník MPRV SR
} as const;

export const VCS_SEKTORY_SK: VcsSektorSk[] = [
  { slug: 'cukrova-repa', name: 'Cukrová repa', sazba: 477.80, description: 'Viazaná podpora na pestovanie cukrovej repy.' }, // 2024 pevné
  { slug: 'bielkoviny', name: 'Bielkovinové plodiny', sazba: 69.90, description: 'Sója, hrach, bôb, šošovica a ďalšie bielkovinové plodiny.' }, // 2024 pevné
  { slug: 'chmel', name: 'Chmeľ', sazba: 800, description: 'Plocha chmeľnice min. 0,3 ha.' }, // NEOVERENÉ 2024 (2023 plán)
  { slug: 'ovocie', name: 'Ovocie (vybrané druhy)', sazba: 558, description: 'Ovocné sady vybraných druhov s vysokou prácnosťou, min. 0,3 ha.' }, // NEOVERENÉ 2024
  { slug: 'zelenina-pracna', name: 'Zelenina (prácna)', sazba: 500, description: 'Vybrané druhy zeleniny s prácnosťou, min. 0,3 ha.' }, // NEOVERENÉ 2024
  { slug: 'zelenina-vysoko-pracna', name: 'Zelenina (vysoko prácna)', sazba: 745, description: 'Vybrané druhy zeleniny s vysokou prácnosťou, min. 0,3 ha.' }, // NEOVERENÉ 2024
];

export function getVcsSektorSk(slug: string): VcsSektorSk | undefined {
  return VCS_SEKTORY_SK.find((s) => s.slug === slug);
}

export interface CapInputSk {
  /** Celková výmera v ha. */
  totalHa: number;
  /** Plocha v chránenom vtáčom území (≤ totalHa). 0 = mimo CHVÚ. */
  chvuHa: number;
  /** Mladý poľnohospodár (do 40 rokov, prvý podnik). */
  mladyPolnohospodar: boolean;
  /** Plochy vo VCS sektoroch, kľúč = sektor slug. */
  vcsHa: Record<string, number>;
}

export interface CapBreakdownItemSk {
  key: string;
  label: string;
  ha: number;
  /** Sadzba €/ha (pre CRISS/eko zmiešané = priemer). */
  sazba: number;
  amount: number;
  note?: string;
}

export interface CapResultSk {
  items: CapBreakdownItemSk[];
  total: number;
  perHa: number;
}

export function calculateCapSk(input: CapInputSk): CapResultSk {
  const items: CapBreakdownItemSk[] = [];
  const ha = Math.max(0, input.totalHa);
  if (ha <= 0) return { items: [], total: 0, perHa: 0 };

  // 1. BISS — celá výmera
  items.push({
    key: 'biss',
    label: 'Základná podpora príjmu (BISS)',
    ha,
    sazba: SAZBY_SK.biss,
    amount: ha * SAZBY_SK.biss,
    note: 'Vypláca sa na všetku spôsobilú poľnohospodársku plochu.',
  });

  // 2. CRISS — dvojstupňová (tier1 do 100,99 ha; tier2 100,99–150 ha)
  const tier1Ha = Math.min(ha, SAZBY_SK.crissTier1MaxHa);
  const tier2Ha = Math.max(0, Math.min(ha, SAZBY_SK.crissTier2MaxHa) - SAZBY_SK.crissTier1MaxHa);
  const crissAmount = tier1Ha * SAZBY_SK.crissTier1 + tier2Ha * SAZBY_SK.crissTier2;
  const crissHa = tier1Ha + tier2Ha;
  items.push({
    key: 'criss',
    label: 'Redistributívna platba (CRISS)',
    ha: crissHa,
    sazba: crissHa > 0 ? crissAmount / crissHa : 0,
    amount: crissAmount,
    note: `${SAZBY_SK.crissTier1} €/ha do ${SAZBY_SK.crissTier1MaxHa} ha, ${SAZBY_SK.crissTier2} €/ha do ${SAZBY_SK.crissTier2MaxHa} ha; nad ${SAZBY_SK.crissTier2MaxHa} ha sa neposkytuje.`,
  });

  // 3. Ekoschéma — plocha v CHVÚ vyššou sadzbou, zvyšok nižšou
  const chvuHa = Math.max(0, Math.min(input.chvuHa, ha));
  const mimoHa = ha - chvuHa;
  const ekoAmount = chvuHa * SAZBY_SK.ekoChvu + mimoHa * SAZBY_SK.ekoMimoChvu;
  items.push({
    key: 'eko',
    label: 'Celofarmská ekoschéma',
    ha,
    sazba: ha > 0 ? ekoAmount / ha : 0,
    amount: ekoAmount,
    note: `${SAZBY_SK.ekoChvu} €/ha v CHVÚ, ${SAZBY_SK.ekoMimoChvu} €/ha mimo CHVÚ.`,
  });

  // 4. Mladý poľnohospodár — max 28 ha
  if (input.mladyPolnohospodar) {
    const mladyHa = Math.min(ha, SAZBY_SK.mladyMaxHa);
    items.push({
      key: 'mlady',
      label: 'Platba pre mladých poľnohospodárov',
      ha: mladyHa,
      sazba: SAZBY_SK.mlady,
      amount: mladyHa * SAZBY_SK.mlady,
      note: `Do 40 rokov, prvý podnik. Max ${SAZBY_SK.mladyMaxHa} ha.`,
    });
  }

  // 5. VCS — viazané platby na plochu
  for (const [slug, vcsHa] of Object.entries(input.vcsHa ?? {})) {
    if (!vcsHa || vcsHa <= 0) continue;
    const sektor = getVcsSektorSk(slug);
    if (!sektor) continue;
    const effectiveHa = Math.min(vcsHa, ha);
    items.push({
      key: `vcs-${slug}`,
      label: `VCS: ${sektor.name}`,
      ha: effectiveHa,
      sazba: sektor.sazba,
      amount: effectiveHa * sektor.sazba,
      note: sektor.description,
    });
  }

  const total = items.reduce((sum, it) => sum + it.amount, 0);
  const perHa = ha > 0 ? total / ha : 0;
  return { items, total, perHa };
}

export function formatEur(n: number): string {
  return n.toLocaleString('sk-SK', { maximumFractionDigits: 0 }) + ' €';
}
```

- [ ] **Step 4: Spustit testy — musí projít**

Run: `npx vitest run tests/lib/sk-cap-dotace.test.ts`
Expected: PASS (všechny).

- [ ] **Step 5: Commit**

```bash
git add src/lib/sk-cap-dotace.ts tests/lib/sk-cap-dotace.test.ts
git commit -m "feat(i18n): SK CAP engine sk-cap-dotace.ts + unit testy"
```

---

## Task 2: Extrahovat CZ kalkulačku do komponenty (verbatim, beze změny chování)

**Cíl:** Přesunout tělo CZ kalkulačky ze stránky do `DotaceCapCz.astro`, aby stránka mohla
locale-větvit. CZ výstup musí zůstat identický.

**Files:**
- Create: `src/components/calc/DotaceCapCz.astro`
- Modify: `src/pages/kalkulacka/dotace-cap/index.astro`

- [ ] **Step 1: Vytvořit komponentu z těla stránky**

Create `src/components/calc/DotaceCapCz.astro`. Do frontmatteru přesunout import dat:

```astro
---
import { KRAJE, CITLIVE_SEKTORY, SAZBY } from '../../lib/cap-dotace';
---
```

Do těla komponenty přesunout **verbatim** celý blok `<div class="calc-root">…</div>`
(breadcrumb, `<header class="calc-head">`, `<form>`, `#result`, `<section class="info">`),
celý `<style>…</style>` a klientský `<script>…</script>` (řádky cca 57–486 současné stránky —
vše uvnitř `<Layout>` KROMĚ dvou `<script type="application/ld+json">`). Nic neměnit.

- [ ] **Step 2: Zeštíhlit stránku na CZ-only přes komponentu**

Modify `src/pages/kalkulacka/dotace-cap/index.astro` — frontmatter ponechat (import `SAZBY`
pro FAQ + JSON-LD), tělo `<Layout>` nahradit:

```astro
  <script type="application/ld+json" is:inline set:html={JSON.stringify(breadcrumbJsonLd)} />
  <script type="application/ld+json" is:inline set:html={JSON.stringify(faqJsonLd)} />
  <DotaceCapCz />
```

a přidat import `import DotaceCapCz from '../../../components/calc/DotaceCapCz.astro';`.

- [ ] **Step 3: Build + ověřit CZ identický**

Run: `cd ~/agro-svet-i18n-obsah && npx astro build 2>&1 | tail -5`
Expected: build OK. Spustit dev (`npm run dev`) a načíst `/kalkulacka/dotace-cap/` — formulář,
výpočet (zadat 75 ha → spočítat), styly a result tabulka fungují jako dřív.

- [ ] **Step 4: Commit**

```bash
git add src/components/calc/DotaceCapCz.astro src/pages/kalkulacka/dotace-cap/index.astro
git commit -m "refactor(calc): extrahovat CZ dotace-cap do DotaceCapCz komponenty (no behavior change)"
```

---

## Task 3: i18n content modul kalkulačky `dotace-cap.ts` (cs byte-ekvivalent + sk)

**Files:**
- Create: `src/i18n/kalkulacka/dotace-cap.ts`
- Reference vzor: `src/i18n/kalkulacka/naklady-na-hektar.ts`

- [ ] **Step 1: Vytvořit content modul**

Create `src/i18n/kalkulacka/dotace-cap.ts`. `content.cs` musí reprodukovat **současné** texty
stránky (title, description, kicker „Kalkulačka · CAP 2024", h1 „Kolik dostanete na dotacích",
lede, FAQ items — zkopírovat z aktuální stránky). `content.sk` = slovenské ekvivalenty.

```ts
import type { Locale } from '../config';

export interface DotaceCapFaq { q: string; a: string }
export interface DotaceCapContent {
  title: string;
  metaDescription: string;
  kicker: string;
  h1: string;
  lede: string;
  crumbHome: string;
  crumbHub: string;
  crumbSelf: string;
  faq: DotaceCapFaq[];
}

export const content: Record<Locale, DotaceCapContent> = {
  cs: {
    title: 'Kalkulačka dotací CAP 2024 — BISS, CISS, EKO, ANC, VCS',
    metaDescription: 'Spočítejte, jaké přímé platby vám připadnou ze Společné zemědělské politiky 2023–2027. Zahrnuje BISS, CISS, EKO, ANC i VCS pro citlivé sektory.',
    kicker: 'Kalkulačka · CAP 2024',
    h1: 'Kolik dostanete na dotacích',
    lede: 'Orientační kalkulátor přímých plateb Společné zemědělské politiky 2023–2027 — sečte BISS, CISS, EKO, ANC a VCS pro citlivé sektory. Sazby vychází z veřejných materiálů SZIF/MZe.',
    crumbHome: 'Domů',
    crumbHub: 'Kalkulačky',
    crumbSelf: 'Dotace CAP',
    faq: [
      // ZKOPÍROVAT všech 7 FAQ z aktuální stránky dotace-cap/index.astro (CZ).
    ],
  },
  sk: {
    title: 'Kalkulačka priamych platieb SPP 2024 — BISS, CRISS, ekoschéma, VCS',
    metaDescription: 'Vypočítajte si, aké priame platby vám pripadnú zo Spoločnej poľnohospodárskej politiky 2023–2027 na Slovensku. BISS, redistributívna platba, ekoschéma a viazané platby v EUR.',
    kicker: 'Kalkulačka · SPP 2024',
    h1: 'Koľko dostanete na priamych platbách',
    lede: 'Orientačný kalkulátor priamych platieb Spoločnej poľnohospodárskej politiky 2023–2027 na Slovensku — spočíta BISS, redistributívnu platbu (CRISS), ekoschému a viazané platby (VCS). Sadzby vychádzajú z Vestníka MPRV SR / PPA.',
    crumbHome: 'Domov',
    crumbHub: 'Kalkulačky',
    crumbSelf: 'Priame platby SPP',
    faq: [
      { q: 'Aké platby kalkulačka počíta?', a: 'Sčíta hlavné priame platby SPP 2023–2027: základnú podporu príjmu (BISS), redistributívnu platbu (CRISS), celofarmskú ekoschému a viazané platby (VCS) na vybrané plodiny. Investičné dotácie, AEKO, welfare zvierat a platby na zviera nepočíta.' },
      { q: 'Sú sadzby aktuálne?', a: 'Vychádzajú z Vestníka MPRV SR pre rok 2024 (BISS 103,80 €/ha, CRISS 79 €/ha do 100,99 ha a 40 €/ha do 150 ha, ekoschéma 60,36 €/ha mimo CHVÚ a 110,45 €/ha v CHVÚ). Záväzné sadzby zverejňuje PPA — výsledok je orientačný (±5–10 %).' },
      { q: 'Čo je CRISS a prečo dva stupne?', a: 'Redistributívna platba podporuje malé a stredné podniky. Vypláca sa 79 €/ha na prvých 100,99 ha a 40 €/ha na plochu 100,99–150 ha; nad 150 ha sa neposkytuje.' },
      { q: 'Ako funguje ekoschéma a čo je CHVÚ?', a: 'Celofarmská ekoschéma sa vypláca dvoma sadzbami podľa toho, či plocha leží v chránenom vtáčom území (CHVÚ): 110,45 €/ha v CHVÚ a 60,36 €/ha mimo. Zadajte, koľko ha vašej výmery je v CHVÚ.' },
      { q: 'Počíta kalkulačka ANC?', a: 'Nie. Podpora pre oblasti s prírodnými obmedzeniami (ANC) sa v SR poskytuje samostatne v rámci rozvoja vidieka, nie ako priama platba — pozrite apa.sk.' },
      { q: 'Je výpočet záväzný?', a: 'Nie. Slúži na orientáciu pri plánovaní. Záväzné sumy stanovuje Pôdohospodárska platobná agentúra (PPA) po uzávierke kampane a po kontrole.' },
    ],
  },
  uk: {
    // uk sa nepoužije (sekcia ostáva pre uk locked) — fallback na cs cez page ?? cs.
    title: '', metaDescription: '', kicker: '', h1: '', lede: '',
    crumbHome: '', crumbHub: '', crumbSelf: '', faq: [],
  },
};
```

> Pozn.: `uk` musí existovat (typ `Record<Locale, …>`), ale stránka pro uk zůstává locked
> (servíruje cs přes `content[locale] ?? content.cs`, kde uk se nikdy nedostane na render
> této sekce — middleware ji 307 redirectne). Bezpečnější: `uk: content.cs` reference není
> možná před definicí → nech prázdné a stránka použije `?? content.cs`.

- [ ] **Step 2: Doplnit cs FAQ verbatim**

Zkopírovat všech 7 `faqItems` z aktuální `src/pages/kalkulacka/dotace-cap/index.astro`
(řádky cca 9–52) do `content.cs.faq`. Sazby v textech jsou tam interpolované z `SAZBY` —
nahradit konkrétními čísly (BISS 2150, CISS 1450/150 ha, EKO 1300/2400 atd.) podle aktuálního
renderu, aby cs zůstalo byte-ekvivalentní.

- [ ] **Step 3: tsc check**

Run: `npx tsc --noEmit`
Expected: 0 chyb.

- [ ] **Step 4: Commit**

```bash
git add src/i18n/kalkulacka/dotace-cap.ts
git commit -m "feat(i18n): content modul kalkulacka/dotace-cap (cs+sk)"
```

---

## Task 4: SK komponenta kalkulačky + locale-aware stránka (prerender=false)

**Files:**
- Create: `src/components/calc/DotaceCapSk.astro`
- Modify: `src/pages/kalkulacka/dotace-cap/index.astro`

- [ ] **Step 1: Vytvořit `DotaceCapSk.astro`**

Create `src/components/calc/DotaceCapSk.astro` — analog `DotaceCapCz.astro`, ale:
- import `import { VCS_SEKTORY_SK, SAZBY_SK } from '../../lib/sk-cap-dotace';`
- Formulář: pole **Celková výmera (ha)**, pole **Plocha v CHVÚ (ha)** (místo ANC fieldsetu),
  checkbox **Mladý poľnohospodár** (max 28 ha), VCS grid z `VCS_SEKTORY_SK` (sazby `… €/ha`).
  **Žádný** ANC fieldset, **žádný** eko-premium checkbox, **žádný** výběr kraje.
- Pod VCS grid přidat poznámku: `<p class="fs-hint">ANC (oblasti s prírodnými obmedzeniami) sa v SR poskytuje samostatne v rámci rozvoja vidieka — pozrite <a href="https://www.apa.sk" rel="external nofollow">apa.sk</a>.</p>`
- result/disclaimer texty slovensky, disclaimer odkaz na `https://www.apa.sk`.
- CTA odkazy: `/dotace/` a `/dotace/kalendar-kol/` (middleware je pod sk prefixne automaticky? NE —
  odkazy v SK komponentě musí být absolutní cs-root; middleware needělá rewrite odchozích linků.
  Použít locale-prefixed: `/sk/dotace/` a `/sk/dotace/kalendar-kol/`).
- Reuse `<style>` z CZ komponenty: aby se styly neduplikovaly, **nech `<style>` jen v CZ
  komponentě a SK komponentě dej `is:global` NENÍ vhodné**; jednodušší: zkopíruj `<style>` blok
  i do SK komponenty (Astro scoped styles jsou per-komponenta). Duplicitní CSS je přijatelné;
  YAGNI extrakce do sdíleného souboru ve V1.

Klientský `<script>` (analog CZ, ale SK engine):

```astro
<script>
  import { calculateCapSk, formatEur, VCS_SEKTORY_SK } from '../../lib/sk-cap-dotace';

  const form = document.getElementById('cap-form-sk') as HTMLFormElement | null;
  if (form) {
    const resultCard = document.getElementById('result-sk')!;
    const resultTotal = document.getElementById('result-total-sk')!;
    const resultPerHa = document.getElementById('result-perha-sk')!;
    const resultTbody = document.getElementById('result-tbody-sk')!;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const num = (k: string) => parseFloat(String(fd.get(k) ?? '')) || 0;
      const vcsHa: Record<string, number> = {};
      for (const s of VCS_SEKTORY_SK) vcsHa[s.slug] = num(`vcs-${s.slug}`);

      const res = calculateCapSk({
        totalHa: num('totalHa'),
        chvuHa: num('chvuHa'),
        mladyPolnohospodar: fd.get('mlady') === 'on',
        vcsHa,
      });

      resultTotal.textContent = `${formatEur(res.total)} / rok`;
      resultPerHa.textContent = `${formatEur(Math.round(res.perHa))} / ha priemerne`;
      resultTbody.innerHTML = res.items.map((it) => `
        <tr>
          <td class="strong">${it.label}${it.note ? `<div class="row-note">${it.note}</div>` : ''}</td>
          <td class="num">${it.ha.toLocaleString('sk-SK', { maximumFractionDigits: 2 })} ha</td>
          <td class="num">${formatEur(Math.round(it.sazba))}/ha</td>
          <td class="num strong">${formatEur(it.amount)}</td>
        </tr>`).join('');
      resultCard.hidden = false;
      resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }
</script>
```

(IDs v SK formuláři musí mít suffix `-sk`: `cap-form-sk`, `result-sk`, `result-total-sk`,
`result-perha-sk`, `result-tbody-sk`, ať nekolidují, kdyby se obě komponenty někdy renderovaly.)

- [ ] **Step 2: Locale-aware stránka**

Modify `src/pages/kalkulacka/dotace-cap/index.astro`:

```astro
---
export const prerender = false;
import Layout from '../../../layouts/Layout.astro';
import { breadcrumbSchema, faqPageSchema } from '../../../lib/structured-data';
import { SITE_URL } from '../../../lib/config';
import { content } from '../../../i18n/kalkulacka/dotace-cap';
import DotaceCapCz from '../../../components/calc/DotaceCapCz.astro';
import DotaceCapSk from '../../../components/calc/DotaceCapSk.astro';

const locale = Astro.locals.locale ?? 'cs';
const c = content[locale] ?? content.cs;
const canonical = `${SITE_URL}/kalkulacka/dotace-cap/`;
const homeHref = locale === 'cs' ? '/' : `/${locale}/`;
const hubHref = locale === 'cs' ? '/kalkulacka/' : `/${locale}/kalkulacka/`;

const breadcrumbJsonLd = breadcrumbSchema([
  { name: c.crumbHome, url: homeHref },
  { name: c.crumbHub, url: hubHref },
  { name: c.crumbSelf, url: canonical },
]);
const faqJsonLd = faqPageSchema(c.faq);
---

<Layout
  title={c.title}
  description={c.metaDescription}
  canonical={locale === 'cs' ? canonical : undefined}
>
  <script type="application/ld+json" is:inline set:html={JSON.stringify(breadcrumbJsonLd)} />
  <script type="application/ld+json" is:inline set:html={JSON.stringify(faqJsonLd)} />
  {locale === 'sk' ? <DotaceCapSk /> : <DotaceCapCz />}
</Layout>
```

> Pozn.: `DotaceCapCz` má vlastní breadcrumb/header/lede markup. Aby se nedvojily s i18n
> headerem, ponech header/breadcrumb **uvnitř komponent** (CZ verbatim, SK slovensky) a ze
> stránky NErenderuj druhý header. Tj. h1/lede/kicker zůstávají v komponentách. Content modul
> `c` se na této stránce použije jen pro `<Layout title/description>` a FAQ/breadcrumb JSON-LD.
> (Komponenty si drží vlastní viditelný breadcrumb a header — viz Task 2/4 markup.)

- [ ] **Step 3: tsc + build**

Run: `npx tsc --noEmit && npx astro build 2>&1 | tail -5`
Expected: 0 tsc chyb, build OK.

- [ ] **Step 4: Smoke obě locale**

`npm run dev`, načíst:
- `/kalkulacka/dotace-cap/` → CZ (Kč, ANC fieldset).
- `/sk/kalkulacka/dotace-cap/` → SK (EUR, CHVÚ pole, bez ANC). Zadat 120 ha → CRISS = 8 738,61 € řádek.

> ⚠️ Tento smoke projde až po Task 5 (odemčení) — do té doby `/sk/kalkulacka/dotace-cap`
> middleware 307-redirectne na `/kalkulacka/dotace-cap`. Pořadí: Task 5 odemkne, pak smoke.

- [ ] **Step 5: Commit**

```bash
git add src/components/calc/DotaceCapSk.astro src/pages/kalkulacka/dotace-cap/index.astro
git commit -m "feat(i18n): SK kalkulačka priamych platieb (DotaceCapSk) + locale-aware stránka"
```

---

## Task 5: Odemčení `/kalkulacka/dotace-cap` a `/dotace` z locku + testy

**Files:**
- Modify: `src/i18n/nav.ts`
- Modify: `src/i18n/utils.ts`
- Modify: `tests/i18n/nav.test.ts`, `tests/i18n/utils.test.ts`

- [ ] **Step 1: Napsat/upravit failing testy lock matice**

V `tests/i18n/nav.test.ts` přidat (a v `utils.test.ts` obdobně pro `isSkLaunchedPath`):

```ts
import { isLockedSectionPath } from '../../src/i18n/nav';

it('Fáze 2b A: /dotace a /kalkulacka/dotace-cap NEJSOU locked', () => {
  expect(isLockedSectionPath('/dotace')).toBe(false);
  expect(isLockedSectionPath('/dotace/investice')).toBe(false);
  expect(isLockedSectionPath('/kalkulacka/dotace-cap')).toBe(false);
});

it('/statistiky a /puda zůstávají locked (balíky B/C)', () => {
  expect(isLockedSectionPath('/statistiky')).toBe(true);
  expect(isLockedSectionPath('/puda')).toBe(true);
});
```

```ts
import { isSkLaunchedPath } from '../../src/i18n/utils';
it('/dotace je SK-launched', () => {
  expect(isSkLaunchedPath('/dotace')).toBe(true);
  expect(isSkLaunchedPath('/dotace/investice')).toBe(true);
});
```

- [ ] **Step 2: Spustit — failuje**

Run: `npx vitest run tests/i18n/nav.test.ts tests/i18n/utils.test.ts`
Expected: FAIL (nové asserty).

- [ ] **Step 3: Odebrat z `LOCKED_SECTION_PREFIXES`**

Modify `src/i18n/nav.ts:30`:

```ts
export const LOCKED_SECTION_PREFIXES = ['/statistiky', '/puda'];
```

(Odebrány `/dotace` a `/kalkulacka/dotace-cap`. Aktualizovat i komentář nad konstantou,
aby reflektoval, že balík A je odemčen.)

- [ ] **Step 4: Přidat `/dotace` do `SK_LAUNCHED_PREFIXES`**

Modify `src/i18n/utils.ts:31`:

```ts
export const SK_LAUNCHED_PREFIXES = ['/stroje', '/znacky', '/srovnani', '/novinky', '/kalkulacka', '/dotace'];
```

- [ ] **Step 5: Spustit — projde**

Run: `npx vitest run tests/i18n/nav.test.ts tests/i18n/utils.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/i18n/nav.ts src/i18n/utils.ts tests/i18n/nav.test.ts tests/i18n/utils.test.ts
git commit -m "feat(i18n): odemknout /dotace a /kalkulacka/dotace-cap pre SK (Fáze 2b A)"
```

- [ ] **Step 7: Provést smoke z Task 4 Step 4** (teď už `/sk/kalkulacka/dotace-cap` neredirectuje).

---

## Task 6: Kolekce `dotaceSk` (content.config) + 3 SK tituly + kola JSON

**Files:**
- Modify: `src/content.config.ts`
- Create: `src/content/dotace-sk/*.md` ×3
- Create: `src/data/dotace-kola-sk.json`

- [ ] **Step 1: Najít a sdílet schema kolekce `dotace`**

V `src/content.config.ts` je definice `dotace` kolekce. Vyextrahovat její `schema` do factory
(vzor `znackySchema()`), nebo přímo znovupoužít stejný `z.object({…})`. Přidat:

```ts
const dotaceSk = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/dotace-sk' }),
  schema: dotaceSchema(), // stejné schema jako `dotace`
});
```

a exportovat v `collections`. (Pokud `dotace` schema není faktorizované, vytvoř `dotaceSchema()`
factory a použij ji pro obě kolekce — DRY.)

- [ ] **Step 2: Napsat 3 SK tituly** (konzumuje Task 0 Step 3 fakty)

Create `src/content/dotace-sk/<slug>.md` ×3. Schema (stejné jako CZ titul) — frontmatter:
`name, slug, intervence, popis, procentoRostlinna?, procentoZivocisna?, stropDotace, minVydaje,
zadatel, primarniZdroj (apa.sk/mpsr.sk URL), aktualizovano, highlights[], faq[{q,a}]`.

Šablona (vyplnit reálnými fakty z Task 0, NE vymýšlet čísla):

```markdown
---
name: "<oficiálny názov intervencie> (<kód>)"
slug: "<kebab-slug>"
intervence: "<kód intervencie SP SPP SR>"
popis: "<1–2 vety, slovensky, čo titul podporuje>"
stropDotace: <číslo EUR>
minVydaje: <číslo EUR>
zadatel: "<oprávnený žiadateľ podľa SR legislatívy>"
primarniZdroj: "<https://www.apa.sk/... alebo mpsr.sk/...>"
aktualizovano: 2026-06-04
highlights:
  - "<bod 1>"
  - "<bod 2>"
  - "<bod 3>"
faq:
  - q: "<otázka>"
    a: "<odpoveď, slovensky, s odkazom na PPA pre záväzné podmienky>"
---

**<názov>** (intervencia <kód>) je <…>.

> **Informatívny charakter.** Prehľad vychádza z verejne dostupných dokumentov PPA a MPRV SR
> a neslúži ako dotačné poradenstvo. Záväzné sú výhradne podmienky zverejnené na
> [apa.sk](https://www.apa.sk). Aktualizované: 4. júna 2026.

## Na čo titul cieli
…
```

Navrhované 3 tituly (potvrdit/upravit dle Task 0): investície do poľnohospodárskych podnikov;
investície do spracovania poľnohospodárskych produktov; začatie činnosti mladého poľnohospodára.

- [ ] **Step 3: Vytvořit `dotace-kola-sk.json`**

Create `src/data/dotace-kola-sk.json` (vzor `dotace-kola.json`, ale PPA SR intervence + apa.sk URL):

```json
{
  "_comment": "Kalendár kôl príjmu žiadostí PPA SR. Ručná údržba. Zdroj: harmonogram PPA / MPRV SR.",
  "aktualizovano": "2026-06-04",
  "kola": [
    {
      "intervence": "<kód>",
      "nazev": "<názov intervencie>",
      "kolo": "<označenie kola>",
      "prijemOd": "<YYYY-MM-DD>",
      "prijemDo": "<YYYY-MM-DD>",
      "status": "ocekavane",
      "pravidlaUrl": "https://www.apa.sk/..."
    }
  ]
}
```

(Naplnit reálnými koly z Task 0; pokud termíny nejsou známé, `status: "ocekavane"` bez přesných
datumů a v UI zobrazit „termín bude upresnený".)

- [ ] **Step 4: tsc + build (kolekce se načte)**

Run: `npx tsc --noEmit && npx astro build 2>&1 | tail -5`
Expected: build OK, `dotaceSk` kolekce bez schema chyb.

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts src/content/dotace-sk src/data/dotace-kola-sk.json
git commit -m "feat(i18n): kolekcia dotaceSk + 3 SK investičné tituly PPA + kola JSON"
```

---

## Task 7: i18n copy sekce `/dotace` + locale-aware index

**Files:**
- Create: `src/i18n/dotace.ts`
- Modify: `src/pages/dotace/index.astro`

- [ ] **Step 1: Content modul `src/i18n/dotace.ts`**

`content.cs` = současné texty `/dotace/index.astro` (hero kicker/h1/lede, disclaimer, statusLabel,
breadcrumb). `content.sk` = slovenské. Struktura:

```ts
import type { Locale } from './config';
export interface DotaceCopy {
  metaTitle: string; metaDescription: string;
  kicker: string; h1: string; lede: string;
  disclaimerHtml: string; // s odkazom (cs: szif.gov.cz, sk: apa.sk)
  crumbHome: string; crumbSelf: string;
  statusLabel: Record<'ocekavane' | 'otevrene' | 'uzavrene', string>;
  kalendarTitle: string; titulyTitle: string;
}
export const content: Record<Locale, DotaceCopy> = {
  cs: { /* opsat ze současné stránky */ },
  sk: {
    metaTitle: 'Investičné dotácie pre poľnohospodárov 2026 — prehľad PPA',
    metaDescription: 'Prehľad investičných dotácií PPA SR zo Strategického plánu SPP 2023–2027 — investície do podnikov, spracovania a podpora mladých poľnohospodárov. Sadzby, stropy, podmienky.',
    kicker: 'PPA · SP SPP 2023–2027',
    h1: 'Investičné dotácie pre poľnohospodárov',
    lede: 'Prehľad hlavných investičných dotačných titulov PPA SR zo Strategického plánu Spoločnej poľnohospodárskej politiky. Pri každom nájdete sadzby, stropy, podmienky a odkaz na primárny zdroj PPA.',
    disclaimerHtml: '<strong>Informatívny charakter.</strong> Prehľad vychádza z verejne dostupných dokumentov PPA a MPRV SR a neslúži ako dotačné poradenstvo. Záväzné sú výhradne podmienky zverejnené na <a href="https://www.apa.sk" target="_blank" rel="noopener">apa.sk</a>.',
    crumbHome: 'Domov', crumbSelf: 'Dotácie',
    statusLabel: { ocekavane: 'Očakávané', otevrene: 'Otvorené', uzavrene: 'Uzavreté' },
    kalendarTitle: 'Kalendár kôl', titulyTitle: 'Dotačné tituly',
  },
  uk: { /* prázdné — sekce pro uk locked */ } as any,
};
```

- [ ] **Step 2: Locale-aware `/dotace/index.astro`**

Modify: `export const prerender = false;`. Frontmatter:

```astro
const locale = Astro.locals.locale ?? 'cs';
const c = content[locale] ?? content.cs;
const collectionName = locale === 'sk' ? 'dotaceSk' : 'dotace';
const tituly = (await getCollection(collectionName)).sort((a, b) => a.data.name.localeCompare(b.data.name, locale));
import kolaCs from '../../data/dotace-kola.json';
import kolaSk from '../../data/dotace-kola-sk.json';
const kola = (locale === 'sk' ? kolaSk : kolaCs).kola;
const linkBase = locale === 'cs' ? '' : `/${locale}`;
// odkazy na detail: `${linkBase}/dotace/${slug}/`
```

Nahradit hardcoded CZ texty `c.*`, `fmtCZK` → locale-aware měna (cs Kč, sk € přes
`Intl.NumberFormat(locale==='sk'?'sk-SK':'cs-CZ', {style:'currency', currency: locale==='sk'?'EUR':'CZK'})`
nebo jednoduché `formatEur`/`fmtCZK` dle locale). `statusLabel` z `c`. cs render musí zůstat
sémanticky identický.

- [ ] **Step 3: tsc + build + smoke**

Run: `npx tsc --noEmit && npx astro build 2>&1 | tail -5`
Smoke: `/dotace/` (cs, Kč, CZ tituly) a `/sk/dotace/` (sk, €, 3 SK tituly).

- [ ] **Step 4: Commit**

```bash
git add src/i18n/dotace.ts src/pages/dotace/index.astro
git commit -m "feat(i18n): locale-aware /dotace index + content modul (cs+sk)"
```

---

## Task 8: Locale-aware `/dotace/[slug]` (SSR, bez getStaticPaths)

**Files:**
- Modify: `src/pages/dotace/[slug].astro`

- [ ] **Step 1: Převést na SSR resolve**

Modify: `export const prerender = false;`. Odstranit `getStaticPaths`. Frontmatter:

```astro
import { getEntry } from 'astro:content';
const locale = Astro.locals.locale ?? 'cs';
const { slug } = Astro.params;
const collectionName = locale === 'sk' ? 'dotaceSk' : 'dotace';
const entry = slug ? await getEntry(collectionName, slug) : undefined;
if (!entry) return Astro.redirect('/404'); // bez cs fallbacku pre sk slugy
const { Content } = await entry.render();
```

Texty rámce (breadcrumb, disclaimer label, „Primárny zdroj", „FAQ") locale-aware z `src/i18n/dotace.ts`
(přidat potřebné klíče tam, pokud chybí). Odkazy breadcrumb `linkBase`-prefixed. cs větev se chová
jako dřív (stejné `getEntry('dotace', slug)` + render).

- [ ] **Step 2: tsc + build + smoke**

Run: `npx tsc --noEmit && npx astro build 2>&1 | tail -5`
Smoke: `/dotace/<cs-slug>/` funguje; `/sk/dotace/<sk-slug>/` zobrazí SK titul; `/sk/dotace/<cs-slug>/`
(neexistuje v dotaceSk) → 404/redirect, **ne** cs obsah na sk URL.

- [ ] **Step 3: Commit**

```bash
git add src/pages/dotace/[slug].astro
git commit -m "feat(i18n): locale-aware /dotace/[slug] SSR (sk z dotaceSk, bez cs fallbacku)"
```

---

## Task 9: Locale-aware `/dotace/kalendar-kol`

**Files:**
- Modify: `src/pages/dotace/kalendar-kol/index.astro`

- [ ] **Step 1: SSR locale-aware**

Modify: `export const prerender = false;`. Frontmatter analog Task 7 (kola z `dotace-kola-sk.json`
při sk), texty z `src/i18n/dotace.ts` (`kalendarTitle`, `statusLabel`, disclaimer). Datumy
formátovat `Intl.DateTimeFormat(locale==='sk'?'sk-SK':'cs-CZ', …)`. Breadcrumb `linkBase`-prefixed.

- [ ] **Step 2: tsc + build + smoke**

Run: `npx tsc --noEmit && npx astro build 2>&1 | tail -5`
Smoke: `/dotace/kalendar-kol/` (cs) a `/sk/dotace/kalendar-kol/` (sk kola, SK datumy).

- [ ] **Step 3: Commit**

```bash
git add src/pages/dotace/kalendar-kol/index.astro
git commit -m "feat(i18n): locale-aware /dotace/kalendar-kol (sk kola PPA)"
```

---

## Task 10: Sitemap / llms.txt / hreflang — zařadit SK varianty

**Files:**
- Modify (dle potřeby): `src/pages/sitemap.xml.ts`, `src/pages/llms.txt.ts`

- [ ] **Step 1: Zjistit, jak sitemap generuje SK URL launchnutých sekcí**

Run: `grep -n "isSkLaunched\|SK_LAUNCHED\|/sk/\|locales\|hreflang\|dotace\|kalkulacka" src/pages/sitemap.xml.ts`
Pochopit, jak se pro existující launchnuté sekce (`/stroje`, `/kalkulacka`) generují sk alternates.

- [ ] **Step 2: Zajistit, že `/dotace` a `/kalkulacka/dotace-cap` dostanou sk varianty**

Pokud sitemap staví sk URL z `isSkLaunchedPath` + lock-guardu, `/dotace` se přidá automaticky
(Task 5). Pro `/kalkulacka/dotace-cap` ověřit, že už není vyloučen jako locked (byl) — po Task 5
projde. Pokud sitemap drží explicitní seznam cest, doplnit `/dotace`, `/dotace/[slug]` (z `dotaceSk`),
`/dotace/kalendar-kol`, `/kalkulacka/dotace-cap` do sk větve. SK detaily titulů iterovat přes
`getCollection('dotaceSk')`.

- [ ] **Step 3: llms.txt analogicky** — pokud listuje sekce/kalkulačky, přidat SK `/dotace` + dotace-cap.

- [ ] **Step 4: Ověřit hreflang v `Layout.astro`**

`getAlternates` v `utils.ts` generuje hreflang pro všechny locales. Lock-guard
([`Layout.astro:72`](../../../src/layouts/Layout.astro)) teď pro sk `/dotace` a
`/kalkulacka/dotace-cap` vrátí `skLaunched=true` → `effectiveNoindex=false` → indexovatelné.
Ověřit v renderu (build → grep výstup) že sk stránky mají `index, follow` + reciproční hreflang.

- [ ] **Step 5: Build + grep ověření**

Run: `npx astro build 2>&1 | tail -5` a v `dist/` zkontrolovat meta robots + sitemap obsahuje
`/sk/dotace/` a `/sk/kalkulacka/dotace-cap/`.

```bash
grep -rl "sk/dotace" dist/ | head; grep -c "sk/kalkulacka/dotace-cap" dist/sitemap*.xml 2>/dev/null || true
```

- [ ] **Step 6: Commit**

```bash
git add src/pages/sitemap.xml.ts src/pages/llms.txt.ts
git commit -m "feat(i18n): sitemap/llms/hreflang — SK varianty /dotace + dotace-cap"
```

---

## Task 11: Finální gate — plný build, testy, smoke, PR

- [ ] **Step 1: tsc 0**

Run: `npx tsc --noEmit` → 0 chyb.

- [ ] **Step 2: Plný vitest zelený**

Run: `npx vitest run` → všechny testy PASS (původních ~413 + nové sk-cap + i18n matice).

- [ ] **Step 3: Build OK**

Run: `npx astro build 2>&1 | tail -8` → bez chyb.

- [ ] **Step 4: Smoke matice (dev)**

`npm run dev` a projít:
- `/kalkulacka/dotace-cap/` (CZ, Kč), `/sk/kalkulacka/dotace-cap/` (SK, €, CRISS 120 ha = 8 738,61 €).
- `/dotace/` + `/sk/dotace/`, `/dotace/<cs>/` + `/sk/dotace/<sk>/`, oba kalendáře.
- `/sk/statistiky/` a `/sk/puda/` **stále** 307 → cs (balíky B/C netknuté).

- [ ] **Step 5: Ověřit uncommitted invariant**

Run: `git status --short | grep -v node_modules`
Expected: jen 6 untracked `public/og/howto-*.png` (cizí WIP) — nic víc, nic commitnuto navíc.

- [ ] **Step 6: Push + PR proti origin/master**

```bash
git push -u origin feat/i18n-sk-dotace
gh pr create --base master --title "feat(i18n): Fáze 2b A — Dotace PPA SR (SK kalkulačka + /dotace)" \
  --body "Odemyká pro SK /kalkulacka/dotace-cap (EUR engine sk-cap-dotace.ts) a /dotace (kolekce dotaceSk, 3 tituly PPA). Statistiky a pôda zůstávají locked (balíky B/C). Data ověřena Task 0 proti apa.sk. Spec + plán v docs/superpowers/."
```

---

## Self-review (vyplněno autorem plánu)

**Spec coverage:** §3 A1 → Task 1–4; §3 A2 → Task 6–9; §3 odemčení → Task 5; §3 indexace → Task 10;
§6 rešerše/§7 data → Task 0; §8 testy → Task 1 (unit) + Task 5 (i18n matice) + Task 11 (gate). ✓
**ANC vypuštěno (§7):** žádný ANC ve `sk-cap-dotace.ts` ani v SK komponentě (jen poznámka). ✓
**Placeholdery:** SK editorial obsah (Task 6/7 tituly, kola) a „overiť" sazby jsou záměrně
gated Task 0 — šablony + zdrojové požadavky konkrétní, žádná čísla vymyšlená. ✓
**Type consistency:** `CapInputSk{totalHa,chvuHa,mladyPolnohospodar,vcsHa}`, `SAZBY_SK`,
`VCS_SEKTORY_SK`, `calculateCapSk`, `formatEur` konzistentní napříč Task 1/4/testy. Kolekce
`dotaceSk`, content moduly `content[locale]` konzistentní Task 3/7. ✓
