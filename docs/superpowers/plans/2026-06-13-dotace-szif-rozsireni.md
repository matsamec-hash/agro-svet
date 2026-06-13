# Dotace/SZIF — rozšíření obsahu + funnel — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rozšířit dotační obsah agro-svet.cz (kolekce `dotace` 4 → ~10 CS titulů), přidat rozhodovací hub `/dotace/jak-vybrat/` a obohatit prolinkování dotace ↔ stroje ↔ howto do funnelu — pro vyšší organický traffic.

**Architecture:** Astro 6 SSR content-collections. Nové tituly = markdown v `src/content/dotace/` (stávající `[slug].astro` je vyrenderuje beze změny). Hub = nová statická Astro stránka napájená z typovaného data-modulu `src/lib/dotace-hub.ts`. Cross-linky = nové volitelné schema pole `relatedLinks` + pure helper `src/lib/dotace-crosslinks.ts` konzumovaný v `[slug].astro`. i18n přes `src/i18n/dotace.ts` (cs+sk). Vše CS-jurisdikční (SK `dotace-sk` je samostatná, nezrcadlí se; UK = jiný track).

**Tech Stack:** Astro 6.4.4, `@astrojs/node`, Zod content schema, vitest, TypeScript. Node 22. Obsah psán přes skill `czech-ag-article-style`, čísla grounded proti `szif.gov.cz`/`eagri.cz`.

---

## Spec

`docs/superpowers/specs/2026-06-13-dotace-szif-rozsireni-design.md`

## Prostředí (každá session)

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 22
cd /Users/matejsamec/agro-svet-dotace-szif
```
- Worktree: `/Users/matejsamec/agro-svet-dotace-szif`, větev `feat/dotace-szif-rozsireni`.
- Testy: `npx vitest run <soubor>`. Build: `node scripts/build-og-images.mjs && npx astro build`.
- **Baseline (pre-existing, NEopravovat):** 3 selhání v `tests/i18n/nav.test.ts` (schovaný bazar) — nesouvisí s tímto trackem. Vše ostatní zelené (391 passed).
- Git push (až po schválení): `git push "https://x-access-token:$(gh auth token)@github.com/matsamec-hash/agro-svet.git" feat/dotace-szif-rozsireni`

## Soubory (přehled)

| Soubor | Akce | Odpovědnost |
|---|---|---|
| `src/content.config.ts` | Modify | Přidat `relatedLinks` do `dotaceSchema()` |
| `src/lib/dotace-crosslinks.ts` | Create | Pure helper: per-titul cross-link tlačítka s fallbackem |
| `tests/lib/dotace-crosslinks.test.ts` | Create | Unit test helperu |
| `src/pages/dotace/[slug].astro` | Modify | Cross-cta používá helper |
| `src/content/dotace/*.md` (4 stávající) | Modify | Doplnit `relatedLinks` |
| `src/content/dotace/*.md` (~6 nových) | Create | Nové dotační tituly (grounded) |
| `src/lib/dotace-hub.ts` | Create | Typovaná data rozhodovací tabulky stroj→intervence + eligibility |
| `tests/lib/dotace-hub.test.ts` | Create | Referenční integrita hub dat |
| `src/i18n/dotace.ts` | Modify | `jakVybrat` copy blok (cs+sk) + interface |
| `src/pages/dotace/jak-vybrat/index.astro` | Create | Rozhodovací hub (cs+sk, JSON-LD) |
| `src/pages/dotace/index.astro` | Modify | Odkaz na hub |
| `src/pages/dotace/kalendar-kol/index.astro` | Modify | Odkaz na hub (info-box) |
| `src/content/howto/jak-naplanovat-dotaci-na-techniku.md` | Modify | Zpětný odkaz na hub |
| `src/data/dotace-kola.json` | Modify | Kola nových titulů |
| `src/pages/sitemap.xml.ts` | Modify | Hub do staticPaths + sk-mirror výjimka |

---

## Task 1: Schema — `relatedLinks` v dotaceSchema

**Files:**
- Modify: `src/content.config.ts` (funkce `dotaceSchema()`, za pole `faq`)

- [ ] **Step 1: Přidat volitelné pole do schématu**

V `src/content.config.ts`, uvnitř `dotaceSchema()`, hned za řádek `faq: z.array(...).optional(),` přidat:

```ts
    /** Per-titul cílené cross-linky (stroje/howto/srovnání). První = primární. */
    relatedLinks: z
      .array(z.object({ href: z.string(), label: z.string() }))
      .optional(),
```

- [ ] **Step 2: Ověřit, že stávající obsah stále parsuje**

Run:
```bash
npx astro sync
```
Expected: bez chyb (sync vygeneruje typy; stávající 4 tituly nemají `relatedLinks` → optional projde).

- [ ] **Step 3: Commit**

```bash
git add src/content.config.ts
git commit -m "feat(dotace): relatedLinks pole ve schématu pro cílené cross-linky"
```

---

## Task 2: Cross-link helper + napojení do detailu

Cílené cross-linky s bezpečným fallbackem na současná generická tlačítka (zpětná kompat se 4 stávajícími tituly bez `relatedLinks`).

**Files:**
- Create: `src/lib/dotace-crosslinks.ts`
- Create: `tests/lib/dotace-crosslinks.test.ts`
- Modify: `src/pages/dotace/[slug].astro` (sekce `cross-cta`, ř. 150–160)

- [ ] **Step 1: Napsat failing test**

`tests/lib/dotace-crosslinks.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { resolveCrossLinks } from '../../src/lib/dotace-crosslinks';

const fallback = [
  { href: '/stroje/traktory/', label: 'Katalog traktorů', primary: true },
  { href: '/srovnani/', label: 'Srovnání modelů', primary: false },
  { href: '/kalkulacka/leasing-traktoru/', label: 'Kalkulačka leasingu', primary: false },
];

describe('resolveCrossLinks', () => {
  it('vrací fallback, když titul nemá relatedLinks', () => {
    expect(resolveCrossLinks(undefined, '', fallback)).toEqual(fallback);
    expect(resolveCrossLinks([], '', fallback)).toEqual(fallback);
  });

  it('mapuje relatedLinks (první = primary) a prefixuje base', () => {
    const out = resolveCrossLinks(
      [
        { href: '/stroje/postrikovace-nesene/', label: 'Postřikovače' },
        { href: '/jak-na-to/jak-nastavit-seci-stroj/', label: 'Návod' },
      ],
      '/sk',
      fallback,
    );
    expect(out).toEqual([
      { href: '/sk/stroje/postrikovace-nesene/', label: 'Postřikovače', primary: true },
      { href: '/sk/jak-na-to/jak-nastavit-seci-stroj/', label: 'Návod', primary: false },
    ]);
  });

  it('base="" (cs) ponechá href beze změny', () => {
    const out = resolveCrossLinks([{ href: '/stroje/kombajny/', label: 'Kombajny' }], '', fallback);
    expect(out).toEqual([{ href: '/stroje/kombajny/', label: 'Kombajny', primary: true }]);
  });
});
```

- [ ] **Step 2: Spustit test — musí selhat**

Run: `npx vitest run tests/lib/dotace-crosslinks.test.ts`
Expected: FAIL — `Cannot find module '../../src/lib/dotace-crosslinks'`.

- [ ] **Step 3: Implementovat helper**

`src/lib/dotace-crosslinks.ts`:

```ts
export interface CrossLink {
  href: string;
  label: string;
  primary: boolean;
}

export interface RelatedLink {
  href: string;
  label: string;
}

/**
 * Per-titul cílené cross-linky. Když titul nemá relatedLinks, vrací fallback
 * (generická tlačítka). base = '' pro cs, '/sk' atd. — prefixuje interní href.
 */
export function resolveCrossLinks(
  related: RelatedLink[] | undefined,
  base: string,
  fallback: CrossLink[],
): CrossLink[] {
  if (!related || related.length === 0) return fallback;
  return related.map((l, i) => ({ href: `${base}${l.href}`, label: l.label, primary: i === 0 }));
}
```

- [ ] **Step 4: Spustit test — musí projít**

Run: `npx vitest run tests/lib/dotace-crosslinks.test.ts`
Expected: PASS (3 testy).

- [ ] **Step 5: Napojit do `[slug].astro`**

V `src/pages/dotace/[slug].astro`:

(a) Do importů (za řádek 11 `import { linkBase, fmtMoney } ...`) přidat:
```ts
import { resolveCrossLinks } from '../../lib/dotace-crosslinks';
```

(b) Do frontmatteru (za řádek 66 `const faqJsonLd = ...`) přidat:
```ts
const crossLinks = resolveCrossLinks(d.relatedLinks, base, [
  { href: `${base}/stroje/traktory/`, label: c.ctaTractors, primary: true },
  { href: `${base}/srovnani/`, label: c.ctaCompare, primary: false },
  { href: `${base}/kalkulacka/leasing-traktoru/`, label: c.ctaLeasing, primary: false },
]);
```

(c) Nahradit blok `<div class="cc-actions">…</div>` (ř. 154–158) za:
```astro
        <div class="cc-actions">
          {crossLinks.map((l) => (
            <a class={`cc-btn ${l.primary ? 'primary' : 'ghost'}`} href={l.href}>{l.label}</a>
          ))}
        </div>
```

(Pozn.: fallback `href` už obsahuje `base`, proto v relatedLinks větvi helper prefixuje `base`, ale ve fallback větvi je `base` už zahrnut → v Step 3 helper na fallback nesahá, vrací ho beze změny. Konzistentní.)

- [ ] **Step 6: Build ověření**

Run: `npx astro build 2>&1 | tail -5`
Expected: `Complete!` / build bez chyby (stávající 4 tituly renderují fallback identicky).

- [ ] **Step 7: Commit**

```bash
git add src/lib/dotace-crosslinks.ts tests/lib/dotace-crosslinks.test.ts src/pages/dotace/[slug].astro
git commit -m "feat(dotace): cílené cross-linky na detailu titulu (helper + fallback)"
```

---

## Task 3: Cílené cross-linky pro 4 stávající tituly

Okamžitá funnel hodnota bez nového obsahu. Každému stávajícímu titulu doplnit `relatedLinks` (3 položky) mířící na relevantní techniku/srovnání/howto.

**Files:**
- Modify: `src/content/dotace/investice-do-zemedelskych-podniku-33-73.md`
- Modify: `src/content/dotace/technologie-snizujici-emise-37-73.md`
- Modify: `src/content/dotace/dotace-pro-mlade-zemedelce.md`
- Modify: `src/content/dotace/zahajeni-cinnosti-mladeho-zemedelce-49-75.md`

- [ ] **Step 1: Doplnit `relatedLinks` do frontmatteru každého souboru**

Vložit do YAML frontmatteru (před `---` uzávěr, na úroveň ostatních klíčů). Hodnoty `href` MUSÍ být reálné existující rutiny (ověř v `src/pages/`). Vzor pro 33.73 (investice do techniky → traktory + srovnání + howto plánování dotace):

```yaml
relatedLinks:
  - href: "/stroje/traktory/"
    label: "Katalog traktorů"
  - href: "/srovnani/"
    label: "Srovnání modelů"
  - href: "/jak-na-to/jak-naplanovat-dotaci-na-techniku/"
    label: "Jak naplánovat dotaci"
```

Pro ostatní tituly zvol relevantní cíle:
- **37.73 technologie emise** → `/stroje/cisterny-kejda/` nebo `/stroje/aplikatory-kejda/` (technologie snižující emise = aplikace kejdy), `/srovnani/`, `/jak-na-to/jak-naplanovat-dotaci-na-techniku/`. Ověř, že kategorie URL existuje (viz Task 2 pozn. k routingu — pokud podkategorie nemá přímou `/stroje/<kat>/` rutu, použij `/stroje/zemedelske-stroje/` rozcestník nebo traktory).
- **mladí zemědělci / 49.75** → `/jak-na-to/jak-vybrat-traktor-pro-malou-farmu/`, `/stroje/traktory/`, `/kalkulacka/leasing-traktoru/`.

⚠️ **Ověření existence každé href rutiny** před zápisem:
```bash
# příklad: existuje /stroje/cisterny-kejda/ ?
ls src/pages/stroje/cisterny-kejda 2>/dev/null || grep -rn "cisterny-kejda" src/pages/stroje/
```
Pokud přímá kategorie-ruta neexistuje (podkategorie jdou přes `[subcategory]`), ověř, že `[subcategory]` rutu pokrývá danou kategorii (zkus build + náhled), nebo zvol jistou rutu (`/stroje/traktory/`, `/stroje/kombajny/`, `/srovnani/`, `/jak-na-to/<slug>/`).

- [ ] **Step 2: Build ověření**

Run: `npx astro build 2>&1 | tail -5`
Expected: build zelený.

- [ ] **Step 3: Ověřit, že odkazy nejsou 404 (smoke)**

Run (dev server v pozadí + curl, nebo grep cílů proti existujícím rutám):
```bash
for u in /stroje/traktory/ /srovnani/ /jak-na-to/jak-naplanovat-dotaci-na-techniku/; do
  test -e "src/pages${u%/}.astro" -o -e "src/pages${u}index.astro" -o -d "src/pages${u}" && echo "OK $u" || echo "CHECK $u (možná dynamická ruta)"
done
```
Expected: každý cíl buď OK, nebo doložitelně pokrytý dynamickou rutou ([slug]/[subcategory]).

- [ ] **Step 4: Commit**

```bash
git add src/content/dotace/*.md
git commit -m "feat(dotace): cílené cross-linky pro 4 stávající tituly"
```

---

## Task 4: Nový titul 34.73 (oprava díry v kalendáři)

Kalendář kol odkazuje na 34.73, ale detail neexistuje → vytvořit. Content grounded proti SZIF.

**Files:**
- Create: `src/content/dotace/investice-do-zpracovani-zemedelskych-produktu-34-73.md`

- [ ] **Step 1: Grounding — načíst reálná data ze SZIF**

Web-fetch primární zdroj a vypsat: sazby (%), strop, min. výdaje, žadatel, pravidlo 49 % (ano/ne), termíny kol:
```
WebFetch https://szif.gov.cz/cs/szp23-investice-zzp
```
Zapsat si ověřené hodnoty. `primarniZdroj` = tato URL. Žádná čísla nevymýšlet — co není doloženo, vynechat (pole jsou optional).

- [ ] **Step 2: Vytvořit markdown dle schématu**

Použít skill `czech-ag-article-style`. Filename == slug. Frontmatter dle `dotaceSchema()` (vzor viz `investice-do-zemedelskych-podniku-33-73.md`): `name, slug, intervence, popis, procentoRostlinna?, procentoZivocisna?, stropDotace?, minVydaje?, zadatel, strojeMax49, primarniZdroj, aktualizovano (2026-06-13), highlights[], faq[]` + nové `relatedLinks[]` (→ `/stroje/...` relevantní pro zpracování, `/srovnani/`, `/jak-na-to/jak-naplanovat-dotaci-na-techniku/`).

Tělo: H2 sekce (Kolik dotace získáte / Co lze financovat / Kdo může žádat / Termíny) + informativní disclaimer blockquote (vzor z 33.73). FAQ 3–5 otázek krmících featured snippets. Min. 4–5 highlights.

- [ ] **Step 3: Build + ověřit, že kalendář teď odkazuje do existující stránky**

Run: `npx astro build 2>&1 | tail -5`
Expected: zelený. Kalendář `/dotace/kalendar-kol/` zobrazuje 34.73 (data už v `dotace-kola.json`); detail `/dotace/investice-do-zpracovani-zemedelskych-produktu-34-73/` nyní existuje.

- [ ] **Step 4: Commit**

```bash
git add src/content/dotace/investice-do-zpracovani-zemedelskych-produktu-34-73.md
git commit -m "feat(dotace): nový titul 34.73 Investice do zpracování (oprava díry v kalendáři)"
```

---

## Task 5: Zbývající nové tituly (do ~10 celkem)

Cíl: kolekce `dotace` (CS) má ~10 titulů. Po Task 4 je jich 5 (4 stávající + 34.73). Přidat ~5 dalších grounded titulů. **Vysoká priorita** (jistá existence + relevance k technice):

1. `investice-do-nezemedelskych-cinnosti-45-73` (45.73) — zdroj `https://szif.gov.cz/cs/szp23-investice-nezemedelske`
2. `inovace-pri-zpracovani-zemedelskych-produktu-51-77` (51.77) — zdroj `https://szif.gov.cz/cs/szp23-inovace`
3. `investice-do-lesnicke-infrastruktury-36-73` (36.73) — lesní technika
4. `investice-do-obnovy-kalamitnich-ploch-38-73` (38.73) — lesní
5. **+1 dle hledanosti** — ověřit v katalogu SZIF intervenci pro **závlahy / vodní hospodářství** (vysoká hledanost kvůli suchu); pokud existuje samostatná projektová intervence dostupná zemědělcům, přidat ji; jinak nahradit `39.73 Investice do ochrany melioračních a zpevňujících dřevin` (zdroj `https://szif.gov.cz/cs/szp23-investice-omzd`).

> **Pozn.:** Přesný finální výběr a počet (cíl ~10) potvrdit proti živému katalogu SZIF `https://szif.gov.cz/cs/szp23-proj` — některé intervence mohou být lesnické/okrajové; preferovat ty relevantní publiku „technika". Precizní zemědělství NEdělat jako titul (není projektová intervence — jde přes Jednotnou žádost).

**Files:**
- Create: `src/content/dotace/<slug>.md` pro každý vybraný titul.

- [ ] **Step 1: Pro každý titul — grounding**

WebFetch jeho `primarniZdroj` (URL výše), vypsat ověřené hodnoty (sazby, strop, min., žadatel, 49 % pravidlo, termíny). Nevymýšlet.

- [ ] **Step 2: Pro každý titul — napsat markdown**

Stejný postup a struktura jako Task 4 Step 2 (skill `czech-ag-article-style`, filename==slug, `aktualizovano: 2026-06-13`, `relatedLinks` na relevantní techniku/howto). U lesnických titulů cílit `relatedLinks` na lesní kategorie (`/stroje/lesni-vyvazecky/`, `/stroje/stepkovace/` — ověřit rutu) nebo na `/stroje/` rozcestník.

- [ ] **Step 3: Build po každém titulu (nebo dávkově)**

Run: `npx astro build 2>&1 | tail -5`
Expected: zelený; každý nový slug má detail stránku.

- [ ] **Step 4: Ověřit počet titulů**

Run: `ls src/content/dotace/*.md | wc -l`
Expected: ~10.

- [ ] **Step 5: Commit (po každém titulu nebo logické dávce)**

```bash
git add src/content/dotace/<slug>.md
git commit -m "feat(dotace): nový titul <intervence> <název>"
```

---

## Task 6: Hub data modul `dotace-hub.ts` + test

Typovaná rozhodovací tabulka (typ stroje → vhodná intervence → omezení) a eligibility skupiny. Pure data → testovatelná referenční integrita (žádné mrtvé odkazy na tituly).

**Files:**
- Create: `src/lib/dotace-hub.ts`
- Create: `tests/lib/dotace-hub.test.ts`

- [ ] **Step 1: Napsat failing test**

`tests/lib/dotace-hub.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { DECISION_ROWS, ELIGIBILITY } from '../../src/lib/dotace-hub';
import { readdirSync } from 'node:fs';

const dotaceSlugs = new Set(
  readdirSync('src/content/dotace').filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, '')),
);

describe('dotace-hub data', () => {
  it('má aspoň 6 řádků rozhodovací tabulky', () => {
    expect(DECISION_ROWS.length).toBeGreaterThanOrEqual(6);
  });

  it('každý řádek míří na existující dotační titul', () => {
    for (const row of DECISION_ROWS) {
      expect(dotaceSlugs.has(row.titulSlug), `chybí titul ${row.titulSlug}`).toBe(true);
    }
  });

  it('každý řádek má neprázdný strojeHref začínající /stroje/', () => {
    for (const row of DECISION_ROWS) {
      expect(row.strojeHref.startsWith('/stroje/')).toBe(true);
    }
  });

  it('eligibility skupiny mají label i popis', () => {
    expect(ELIGIBILITY.length).toBeGreaterThanOrEqual(3);
    for (const e of ELIGIBILITY) {
      expect(e.label.length).toBeGreaterThan(0);
      expect(e.popis.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Spustit test — musí selhat**

Run: `npx vitest run tests/lib/dotace-hub.test.ts`
Expected: FAIL — modul neexistuje.

- [ ] **Step 3: Implementovat data modul**

`src/lib/dotace-hub.ts` — vyplnit `titulSlug` reálnými slugy vytvořenými v Task 4/5 a `strojeHref` ověřenými rutami. Vzor (slugy/labely dotáhnout dle skutečných titulů):

```ts
export interface DecisionRow {
  /** Typ techniky/investice, jak ji hledá zemědělec. */
  strojTyp: string;
  /** Slug existujícího dotačního titulu (== filename v src/content/dotace). */
  titulSlug: string;
  /** Intervence kód (zobrazení). */
  intervence: string;
  /** Odkaz na relevantní kategorii strojů (existující ruta /stroje/...). */
  strojeHref: string;
  /** Klíčové omezení (1 věta). */
  omezeni: string;
}

export interface EligibilityGroup {
  label: string;
  popis: string;
}

export const DECISION_ROWS: DecisionRow[] = [
  {
    strojTyp: 'Traktor, secí stroj, postřikovač',
    titulSlug: 'investice-do-zemedelskych-podniku-33-73',
    intervence: '33.73',
    strojeHref: '/stroje/traktory/',
    omezeni: 'Mobilní stroje max. 49 % způsobilých výdajů projektu.',
  },
  {
    strojTyp: 'Technologie aplikace kejdy, snížení emisí',
    titulSlug: 'technologie-snizujici-emise-37-73',
    intervence: '37.73',
    strojeHref: '/stroje/aplikatory-kejda/',
    omezeni: 'Cíleno na technologie snižující emise GHG a NH3.',
  },
  {
    strojTyp: 'Zpracovatelská linka, technologie zpracování',
    titulSlug: 'investice-do-zpracovani-zemedelskych-produktu-34-73',
    intervence: '34.73',
    strojeHref: '/stroje/',
    omezeni: 'Investice do zpracování produktů, ne primární výroba.',
  },
  // … doplnit řádky pro 45.73, 51.77, lesní tituly (36.73/38.73) podle vytvořených titulů.
];

export const ELIGIBILITY: EligibilityGroup[] = [
  {
    label: 'Zemědělský podnikatel',
    popis: 'Fyzická i právnická osoba evidovaná podle zákona č. 252/1997 Sb. provozující zemědělskou výrobu.',
  },
  {
    label: 'Mladý začínající zemědělec',
    popis: 'Do 40 let, poprvé v čele podniku — bonifikace +10 % u investičních titulů a samostatné tituly na zahájení činnosti.',
  },
  {
    label: 'Malé hospodářství do 150 ha',
    popis: 'Výjimka z pravidla 49 % na mobilní stroje — traktor lze dotovat ve vyšším podílu.',
  },
];
```

⚠️ Každý `strojeHref` ověřit (existující ruta — viz Task 3 Step 1 postup). `strojeHref: '/stroje/'` je vždy bezpečný rozcestník.

- [ ] **Step 4: Spustit test — musí projít**

Run: `npx vitest run tests/lib/dotace-hub.test.ts`
Expected: PASS (4 testy).

- [ ] **Step 5: Commit**

```bash
git add src/lib/dotace-hub.ts tests/lib/dotace-hub.test.ts
git commit -m "feat(dotace): hub data modul (rozhodovací tabulka + eligibility) s testem integrity"
```

---

## Task 7: i18n — `jakVybrat` copy blok (cs+sk)

**Files:**
- Modify: `src/i18n/dotace.ts` (interface `DotaceCopy` + objekty `cs`, `sk`)

- [ ] **Step 1: Rozšířit interface `DotaceCopy`**

V `src/i18n/dotace.ts`, do interface `DotaceCopy` (za pole `detail: DotaceDetailCopy;`) přidat:

```ts
  /** Rozhodovací hub /dotace/jak-vybrat/. */
  jakVybrat: DotaceJakVybratCopy;
```

A nad `const cs:` přidat nový interface:

```ts
export interface DotaceJakVybratCopy {
  metaTitle: string;
  metaDescription: string;
  crumb: string;
  kicker: string;
  h1: string;
  lede: string;
  /** Nadpis rozhodovací tabulky. */
  tableTitle: string;
  thStroj: string;
  thIntervence: string;
  thOmezeni: string;
  /** Text odkazu „Detail" v řádku tabulky. */
  rowDetailLink: string;
  /** Text odkazu na kategorii strojů v řádku. */
  rowStrojeLink: string;
  /** Nadpis sekce eligibility. */
  eligibilityTitle: string;
  /** Nadpis „jak postupovat" rozcestníku. */
  stepsTitle: string;
  /** HTML odstavec s odkazem na master howto + kalendář. */
  stepsBodyHtml: string;
  /** Název ItemListu pro JSON-LD. */
  itemListName: string;
}
```

- [ ] **Step 2: Doplnit `jakVybrat` do `cs` i `sk` objektů**

Do `cs` objektu (za blok `detail: { … },`) přidat plně vyplněný `jakVybrat` (čeština). Do `sk` analogicky (slovenština, SK varianta mapuje 3 SK tituly). Vzor cs:

```ts
    jakVybrat: {
      metaTitle: 'Jak vybrat dotaci na zemědělskou techniku — rozcestník SZIF',
      metaDescription:
        'Rozhodovací přehled: který dotační titul SP SZP 2023–2027 se hodí na váš typ techniky. Traktory, postřikovače, zpracování — sazby, omezení, kdo může žádat.',
      crumb: 'Jak vybrat dotaci',
      kicker: 'SZIF · rozhodovací rozcestník',
      h1: 'Jak vybrat dotaci na techniku',
      lede: 'Podle typu investice se liší vhodný dotační titul i podmínky. Tabulka níže propojuje typ techniky s odpovídající intervencí SP SZP 2023–2027 a jejím klíčovým omezením.',
      tableTitle: 'Typ techniky → vhodná intervence',
      thStroj: 'Co pořizujete',
      thIntervence: 'Intervence',
      thOmezeni: 'Klíčové omezení',
      rowDetailLink: 'Detail dotace →',
      rowStrojeLink: 'Katalog strojů →',
      eligibilityTitle: 'Kdo může žádat',
      stepsTitle: 'Jak postupovat',
      stepsBodyHtml:
        'Po výběru titulu si projděte <a href="/jak-na-to/jak-naplanovat-dotaci-na-techniku/">návod jak naplánovat dotaci na techniku</a> a sledujte termíny v <a href="/dotace/kalendar-kol/">kalendáři kol</a>. Závazné jsou výhradně Pravidla SZIF daného kola.',
      itemListName: 'Dotační tituly podle typu techniky',
    },
```

(SK varianta: přeložit + `stepsBodyHtml` odkazy s `/sk` prefixem; eligibility/omezení v tabulce vykresluje hub z `dotace-hub.ts` — pro sk lze v Task 8 použít stejná data nebo zjednodušený SK přehled; viz Task 8 Step 2.)

- [ ] **Step 3: Ověřit typovou konzistenci**

Run: `npx astro sync && npx tsc --noEmit 2>&1 | grep -i "dotace.ts" | head` (nebo `npx vitest run tests/i18n/` pro jistotu, že i18n testy stále zelené).
Expected: žádné typové chyby v `dotace.ts`; i18n testy beze změny (kromě případného snapshotu — pokud test iteruje klíče, aktualizovat).

- [ ] **Step 4: Commit**

```bash
git add src/i18n/dotace.ts
git commit -m "feat(dotace): i18n copy pro rozhodovací hub (cs+sk)"
```

---

## Task 8: Hub stránka `/dotace/jak-vybrat/`

**Files:**
- Create: `src/pages/dotace/jak-vybrat/index.astro`

- [ ] **Step 1: Vytvořit stránku**

Vzor struktury podle `src/pages/dotace/kalendar-kol/index.astro` (SSR, bilingvní přes `locals.locale`, breadcrumb, disclaimer, JSON-LD). Hub vykresluje:
- BreadcrumbList + ItemList (z `DECISION_ROWS.map` → odkazy na tituly) + FAQPage (volitelně z eligibility).
- Rozhodovací `<table>`: sloupce `thStroj / thIntervence / thOmezeni` + odkazy `rowDetailLink` (→ `${base}/dotace/${row.titulSlug}/`) a `rowStrojeLink` (→ `${base}${row.strojeHref}`).
- Sekce „Kdo může žádat" z `ELIGIBILITY`.
- Sekce „Jak postupovat" z `stepsBodyHtml`.

Frontmatter kostra:
```astro
---
export const prerender = false;
import Layout from '../../../layouts/Layout.astro';
import { breadcrumbSchema, itemListSchema } from '../../../lib/structured-data';
import { SITE_URL } from '../../../lib/config';
import { content } from '../../../i18n/dotace';
import { linkBase } from '../../../lib/dotace-format';
import { DECISION_ROWS, ELIGIBILITY } from '../../../lib/dotace-hub';

const locale = Astro.locals.locale ?? 'cs';
const c = content[locale] ?? content.cs;
const jv = c.jakVybrat;
const base = linkBase(locale);
const canonical = `${SITE_URL}${base}/dotace/jak-vybrat/`;

const breadcrumbJsonLd = breadcrumbSchema([
  { name: c.crumbHome, url: `${base}/` },
  { name: c.crumbSelf, url: `${base}/dotace/` },
  { name: jv.crumb, url: canonical },
]);
const itemListJsonLd = itemListSchema(
  DECISION_ROWS.map((r) => ({ url: `${SITE_URL}${base}/dotace/${r.titulSlug}/`, name: `${r.intervence} — ${r.strojTyp}` })),
  jv.itemListName,
);
---
```

Tělo: `<Layout title={jv.metaTitle} description={jv.metaDescription} canonical={locale === 'cs' ? canonical : undefined}>` + 2× JSON-LD script + breadcrumb nav + hero (kicker/h1/lede) + tabulka + eligibility + steps. Styl převzít z `kalendar-kol/index.astro` (stejné CSS proměnné/vzhled — DRY zkopírovat relevantní `<style>` bloky).

⚠️ **SK pozn.:** `DECISION_ROWS`/`ELIGIBILITY` jsou CS-centrické (slugy CS titulů). Pro sk locale tabulka odkazuje na CS tituly, které pod `/sk/dotace/<cs-slug>/` **404-ují** (sk má vlastní slugy). Řešení (zvolit při exekuci, jednodušší první):
  - **(A) Hub renderovat plně jen pro cs; pro sk vykreslit zjednodušenou verzi** odkazující na `/sk/dotace/` (přehled) + `/sk/dotace/kalendar-kol/` bez tabulky CS slugů. Tím se vyhneme 404 odkazům.
  - (B) Přidat do `dotace-hub.ts` paralelní `DECISION_ROWS_SK` se slugy 3 SK titulů a v hubu vybrat dle locale.

  **Default = (A)** (nižší riziko, SK dotace má jen 3 tituly → tabulka by byla tenká). Pro sk vykreslit hero + eligibility + steps + odkaz na `/sk/dotace/`, tabulku skrýt. `itemListJsonLd` pro sk sestavit z `getCollection('dotaceSk')` nebo vynechat.

- [ ] **Step 2: Build ověření (cs i sk)**

Run: `npx astro build 2>&1 | tail -5`
Expected: zelený. Ověřit, že `/dotace/jak-vybrat/` nekoliduje s `[slug].astro` (statická ruta má přednost — stejně jako `kalendar-kol`).

- [ ] **Step 3: Smoke render (dev)**

Run (dev server v pozadí):
```bash
npx astro dev &
sleep 4
curl -s localhost:4321/dotace/jak-vybrat/ | grep -o '<h1>[^<]*</h1>' | head -1
curl -s localhost:4321/dotace/jak-vybrat/ | grep -c 'application/ld+json'
# sk varianta (middleware servíruje přes locale — ověřit, že nepadá 500)
curl -s -o /dev/null -w "%{http_code}\n" localhost:4321/sk/dotace/jak-vybrat/
kill %1
```
Expected: h1 = „Jak vybrat dotaci na techniku", ≥2 JSON-LD bloky, sk vrací 200.

- [ ] **Step 4: Commit**

```bash
git add src/pages/dotace/jak-vybrat/index.astro
git commit -m "feat(dotace): rozhodovací hub /dotace/jak-vybrat/ (cs+sk, JSON-LD)"
```

---

## Task 9: Odkazy na hub (index, kalendář, master howto)

**Files:**
- Modify: `src/pages/dotace/index.astro`
- Modify: `src/pages/dotace/kalendar-kol/index.astro`
- Modify: `src/content/howto/jak-naplanovat-dotaci-na-techniku.md`

- [ ] **Step 1: Odkaz z dotace index**

V `src/pages/dotace/index.astro` přidat viditelný odkaz na hub (např. do hero sekce nebo nad seznam titulů): `<a href={`${linkBase(locale)}/dotace/jak-vybrat/`}>{c.jakVybrat.h1} →</a>`. Umístit konzistentně s existujícím layoutem (za `hero-lede` nebo do `titul-section` jako úvodní rozcestník).

- [ ] **Step 2: Odkaz z kalendáře**

V `src/pages/dotace/kalendar-kol/index.astro` do `info-box` `ib-actions` (vedle `btnPrehled`/`btnLeasing`) přidat tlačítko na hub:
```astro
        <a class="ib-btn ghost" href={`${linkBase(locale)}/dotace/jak-vybrat/`}>{c.jakVybrat.h1}</a>
```
(`c` = `content[locale]`; ověřit, že je v scope — je, jako `c`.)

- [ ] **Step 3: Zpětný odkaz z master howto**

V `src/content/howto/jak-naplanovat-dotaci-na-techniku.md` přidat do textu (vhodná sekce, např. úvod nebo „kde hledat") interní odkaz: `[jak vybrat dotaci podle typu techniky](/dotace/jak-vybrat/)` a odkaz na přehled `[přehled dotačních titulů](/dotace/)`.

- [ ] **Step 4: Build + commit**

Run: `npx astro build 2>&1 | tail -5`
Expected: zelený.
```bash
git add src/pages/dotace/index.astro src/pages/dotace/kalendar-kol/index.astro src/content/howto/jak-naplanovat-dotaci-na-techniku.md
git commit -m "feat(dotace): prolinkování hub ↔ index ↔ kalendář ↔ master howto"
```

---

## Task 10: Kalendář kol — kola nových titulů

**Files:**
- Modify: `src/data/dotace-kola.json`

- [ ] **Step 1: Doplnit kola**

Do pole `kola` přidat záznamy pro nové tituly, kde má smysl (zejména ty, co mají podzimní/jarní kolo 2026). Struktura existujícího záznamu (intervence, nazev, kolo, prijemOd/Do ISO, status `ocekavane|otevrene|uzavrene`, pravidlaUrl). Termíny grounded z harmonogramu MZe/SZIF (`https://szif.gov.cz/cs/szp23-proj` nebo CMSZP harmonogram). Aktualizovat `aktualizovano` na `2026-06-13`. Pokud termín neznámý, kolo nepřidávat (lepší než vymyslet).

- [ ] **Step 2: Ověřit validní JSON + build**

Run: `node -e "JSON.parse(require('fs').readFileSync('src/data/dotace-kola.json','utf8')); console.log('valid')" && npx astro build 2>&1 | tail -3`
Expected: `valid` + build zelený; kalendář zobrazuje nová kola.

- [ ] **Step 3: Commit**

```bash
git add src/data/dotace-kola.json
git commit -m "feat(dotace): kalendář kol — doplnit nové tituly + aktualizace data"
```

---

## Task 11: Sitemap — hub do staticPaths + sk-mirror výjimka

Nové CS tituly se přidávají automaticky (`getCollection('dotace')`, ř. 299) — žádná změna kvůli titulům. Pouze hub.

**Files:**
- Modify: `src/pages/sitemap.xml.ts` (staticPaths ~ř. 151 + `isDotaceDetailPath` ř. 395–396)

- [ ] **Step 1: Přidat hub do staticPaths**

Za řádek `['/dotace/kalendar-kol/', 'weekly', '0.75', STATIC_LASTMOD],` (ř. 150) přidat:
```ts
    ['/dotace/jak-vybrat/', 'monthly', '0.8', STATIC_LASTMOD],
```

- [ ] **Step 2: Povolit zrcadlení hubu do /sk**

`isDotaceDetailPath` (ř. 395–396) rozšířit o výjimku pro hub (aby `/sk/dotace/jak-vybrat/` byl v sitemapě — hub je bilingvní):
```ts
  const isDotaceDetailPath = (p: string) =>
    p.startsWith('/dotace/') &&
    p !== '/dotace/' &&
    p !== '/dotace/kalendar-kol/' &&
    p !== '/dotace/jak-vybrat/';
```
(Komentář nad tím případně doplnit, že hub sdílí cs/sk cestu jako kalendar-kol.)

⚠️ Pokud byl v Task 8 zvolen variant (A) — sk hub bez tabulky CS slugů — je `/sk/dotace/jak-vybrat/` validní 200 → zrcadlení správné. Pokud by sk hub neexistoval, výjimku NEpřidávat.

- [ ] **Step 3: Ověřit sitemap výstup**

Run (dev server):
```bash
npx astro dev &
sleep 4
curl -s localhost:4321/sitemap.xml | grep -c '/dotace/jak-vybrat/'        # očekávej 2 (cs + sk) při variantě A
curl -s localhost:4321/sitemap.xml | grep -o '/dotace/[a-z0-9-]*/' | sort -u   # nové tituly jsou tam
kill %1
```
Expected: hub cs (a sk) v sitemapě; všechny nové dotační tituly přítomny.

- [ ] **Step 4: Commit**

```bash
git add src/pages/sitemap.xml.ts
git commit -m "feat(dotace): sitemap — hub jak-vybrat do staticPaths + sk mirror"
```

---

## Task 12: Finální verifikace

**Files:** žádné (jen ověření).

- [ ] **Step 1: Plná testovací sada**

Run: `npx vitest run 2>&1 | tail -15`
Expected: nová `dotace-crosslinks.test.ts` (3) + `dotace-hub.test.ts` (4) zelené; **jediná pre-existing selhání = 3× `tests/i18n/nav.test.ts`** (bazar baseline). Žádná nová selhání.

- [ ] **Step 2: Plný build (vč. OG images)**

Run: `node scripts/build-og-images.mjs && npx astro build 2>&1 | tail -8`
Expected: `Complete!` bez chyby.

- [ ] **Step 3: Smoke produkčního preview**

Run:
```bash
npx astro preview &
sleep 4
for u in /dotace/ /dotace/jak-vybrat/ /dotace/kalendar-kol/ /dotace/investice-do-zpracovani-zemedelskych-produktu-34-73/; do
  echo "$u → $(curl -s -o /dev/null -w '%{http_code}' localhost:4321$u)"
done
kill %1
```
Expected: vše 200 (po případném 301 trailing-slash).

- [ ] **Step 4: Souhrn + handoff**

Vypsat: počet titulů (`ls src/content/dotace/*.md | wc -l`), nové stránky, stav testů/buildu. Pak přejít na `superpowers:finishing-a-development-branch` (merge/PR — `master` je base, push token-in-URL, viz prostředí výše).

---

## Akceptační kritéria (z spec)

1. ✅ Kolekce `dotace` (CS) ~10 titulů, grounded čísla, `primarniZdroj` na konkrétní SZIF Pravidla. (Task 4, 5)
2. ✅ 34.73 má detail page → kalendář neodkazuje do prázdna. (Task 4)
3. ✅ Hub `/dotace/jak-vybrat/` (cs+sk) s rozhodovací tabulkou + eligibility + JSON-LD. (Task 6, 7, 8)
4. ✅ Detail dotace per-titul cross-linky; staré 4 tituly fungují. (Task 1, 2, 3)
5. ✅ Master howto odkazuje na hub. (Task 9)
6. ✅ `dotace-kola.json` pokrývá nové tituly. (Task 10)
7. ✅ Nové tituly + hub v sitemapě. (Task 11)
8. ✅ vitest zelený (mimo bazar baseline), build zelený, stávající stránky beze změny. (Task 12)
