# Včelařská sekce — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Přidat na agro-svet.cz uceleou včelařskou sekci `/vcelarstvi/` (katalog druhů včel, vybavení, druhů medu) + ~50 slovníkových hesel + 6 průvodců + kvíz, plus navigace, sitemap a obrázky.

**Architecture:** Sekce recykluje existující patterny webu beze změny technického vzoru. Katalogy = YAML soubory načítané přes `import.meta.glob` (jako `plemena.ts`). Slovník = rozšíření pole `SLOVNIK`. Průvodci = MD v existující `howto` kolekci. Kvíz = samostatná recommender stránka (jako `jaky-traktor-potrebujete.astro`). Veškerý obsah je build-time statický (prerender), žádná DB.

**Tech Stack:** Astro (static + Cloudflare Workers), TypeScript, YAML (`@modyfi/vite-plugin-yaml` compile-time parse), Vitest, Zod (jen u MD kolekcí).

**Content authoring rule:** Strukturovaná data (latinské názvy, ceny, vlastnosti) kurátorovat ručně z ověřených zdrojů — NE AI free-form (riziko halucinací). Prózu (popisy, průvodce) psát ve stylu skill `czech-ag-article-style` (tón, délka, struktura). Vždy přirozená čeština, žádné anglicismy navíc.

---

## Soubory — co vznikne / co se mění

**Vznikne:**
- `src/lib/vcelarstvi.ts` — typy + loadery + label mapy pro 3 katalogy
- `src/data/vcelarstvi/vcely.yaml` — druhy včel
- `src/data/vcelarstvi/vybaveni.yaml` — vybavení
- `src/data/vcelarstvi/med.yaml` — druhy medu
- `src/pages/vcelarstvi/index.astro` — hub
- `src/pages/vcelarstvi/druhy/index.astro` + `src/pages/vcelarstvi/druhy/[slug].astro`
- `src/pages/vcelarstvi/vybaveni/index.astro` + `src/pages/vcelarstvi/vybaveni/[slug].astro`
- `src/pages/vcelarstvi/med/index.astro` + `src/pages/vcelarstvi/med/[slug].astro`
- `src/pages/kviz/jaka-vcela-pro-vas.astro` — recommender kvíz
- `src/content/howto/{jak-zacit-vcelarit,vcelarsky-rok,boj-s-varroazou,zpracovani-medu,zazimovani-vcelstev,registrace-vcelaru}.md`
- `tests/lib/vcelarstvi.test.ts` — data integrity
- `public/images/vcelarstvi/{druhy,vybaveni,med}/` — obrázky

**Mění se:**
- `src/lib/slovnik.ts` — nová kategorie `vcelarstvi` + label + ~50 hesel
- `tests/lib/` — test na unikátnost slovnik slugů (volitelně rozšířit existující, jinak nový)
- `src/components/Header.astro` — nová nav položka Včelařství
- `src/pages/kviz/index.astro` — přidat dlaždici nového kvízu
- `src/pages/sitemap.xml.ts` — vcelarstvi huby + kvíz + smyčky katalogů

---

## Task 1: Knihovna `vcelarstvi.ts` — typy a loadery

**Files:**
- Create: `src/lib/vcelarstvi.ts`
- Create: `src/data/vcelarstvi/vcely.yaml` (zatím 1 položka jako fixture pro test)
- Create: `src/data/vcelarstvi/vybaveni.yaml` (1 položka)
- Create: `src/data/vcelarstvi/med.yaml` (1 položka)
- Test: `tests/lib/vcelarstvi.test.ts`

Mirror `src/lib/plemena.ts` (compile-time `import.meta.glob` + cache).

- [ ] **Step 1: Napsat failing test**

`tests/lib/vcelarstvi.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import {
  getAllVcely, getVcela,
  getAllVybaveni, getVybaveni,
  getAllMed, getMed,
} from '../../src/lib/vcelarstvi';

describe('vcelarstvi loaders', () => {
  it('načte druhy včel a najde podle slugu', () => {
    const all = getAllVcely();
    expect(all.length).toBeGreaterThan(0);
    const first = all[0];
    expect(getVcela(first.slug)?.name).toBe(first.name);
  });

  it('druhy včel mají unikátní slugy', () => {
    const slugs = getAllVcely().map((v) => v.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('každý druh včely má latinský název a popis', () => {
    for (const v of getAllVcely()) {
      expect(v.latinsky, `${v.slug} latinsky`).toBeTruthy();
      expect(v.description.length, `${v.slug} description`).toBeGreaterThan(20);
    }
  });

  it('vybavení a med se načtou a mají unikátní slugy', () => {
    const vyb = getAllVybaveni().map((x) => x.slug);
    expect(new Set(vyb).size).toBe(vyb.length);
    expect(getAllVybaveni().length).toBeGreaterThan(0);
    const med = getAllMed().map((x) => x.slug);
    expect(new Set(med).size).toBe(med.length);
    expect(getMed(getAllMed()[0].slug)).toBeDefined();
    expect(getVybaveni(getAllVybaveni()[0].slug)).toBeDefined();
  });

  it('related slugy ve vybavení odkazují na existující položky', () => {
    const known = new Set(getAllVybaveni().map((x) => x.slug));
    for (const x of getAllVybaveni()) {
      for (const r of x.related ?? []) {
        expect(known.has(r), `${x.slug} → related ${r}`).toBe(true);
      }
    }
  });
});
```

- [ ] **Step 2: Spustit test — musí selhat**

Run: `npm test -- vcelarstvi`
Expected: FAIL — `Cannot find module '../../src/lib/vcelarstvi'`.

- [ ] **Step 3: Vytvořit minimální YAML fixtures**

`src/data/vcelarstvi/vcely.yaml`:
```yaml
- slug: kranska
  name: Včela kraňská
  latinsky: Apis mellifera carnica
  alternative_names: [kraňka, carnica]
  puvod: Slovinsko a alpský region
  temperament: mírná
  medny_vynos: vysoký
  rojivost: vyšší
  zimuvzdornost: výborná
  vhodnost_cr: V ČR jednoznačně nejrozšířenější včela.
  barva: hnědošedá s šedým ochlupením
  description: >
    Kraňka je v Česku dominantní včelou. Vyniká mírností, výborným
    využitím jarní snůšky a nízkou spotřebou zimních zásob. Její slabinou
    je vyšší sklon k rojení, který se řeší včasným rozšiřováním úlu.
  image_url: /images/vcelarstvi/druhy/kranska.webp
  wikipedia: https://cs.wikipedia.org/wiki/V%C4%8Dela_medonosn%C3%A1_kra%C5%88sk%C3%A1
```

`src/data/vcelarstvi/vybaveni.yaml`:
```yaml
- slug: nastavkovy-ul
  name: Nástavkový úl
  kategorie: ul
  popis_kratky: Modulární úl složený ze samostatných nástavků, dnešní standard.
  description: >
    Nástavkový úl se skládá z oddělitelných nástavků stavěných na sebe.
    Umožňuje pracovat s celými nástavky, snadné rozšiřování i odebírání medníku.
  pro_zacatecniky: true
  orientacni_cena: 2 500–6 000 Kč za nástavek
  image_url: /images/vcelarstvi/vybaveni/nastavkovy-ul.webp
  related: []
```

`src/data/vcelarstvi/med.yaml`:
```yaml
- slug: akatovy
  name: Akátový med
  typ: kvetovy
  zdroj_snusky: akát (Robinia pseudoacacia)
  barva: světle žlutá až téměř čirá
  chut: jemná, sladká, bez výrazné kyselosti
  krystalizace: velmi pomalá
  popis_kratky: Světlý květový med s velmi pomalou krystalizací.
  description: >
    Akátový med patří k nejsvětlejším a nejjemnějším medům. Díky vysokému
    podílu fruktózy krystalizuje velmi pomalu a zůstává dlouho tekutý.
  image_url: /images/vcelarstvi/med/akatovy.webp
```

- [ ] **Step 4: Implementovat `src/lib/vcelarstvi.ts`**

```typescript
// YAML parsováno compile-time přes @modyfi/vite-plugin-yaml (jako plemena.ts).

export type VcelaTemperament = 'mírná' | 'střední' | 'obranná';
export type VcelaVynos = 'nízký' | 'střední' | 'vysoký' | 'velmi vysoký';
export type VcelaRojivost = 'nízká' | 'střední' | 'vyšší';

export interface Vcela {
  slug: string;
  name: string;
  latinsky: string;
  alternative_names?: string[];
  puvod: string;
  temperament: VcelaTemperament;
  medny_vynos: VcelaVynos;
  rojivost: VcelaRojivost;
  zimuvzdornost: string;
  vhodnost_cr: string;
  barva?: string;
  description: string;
  image_url?: string | null;
  wikipedia?: string;
  wikidata?: string;
  faq?: { q: string; a: string }[];
}

export type VybaveniKategorie = 'ul' | 'ochrana' | 'naradi' | 'zpracovani' | 'krmeni';

export interface Vybaveni {
  slug: string;
  name: string;
  kategorie: VybaveniKategorie;
  popis_kratky: string;
  description: string;
  pro_zacatecniky?: boolean;
  orientacni_cena?: string;
  image_url?: string | null;
  related?: string[];
}

export type MedTyp = 'kvetovy' | 'medovicovy' | 'smiseny';
export type MedKrystalizace = 'velmi pomalá' | 'pomalá' | 'střední' | 'rychlá';

export interface Med {
  slug: string;
  name: string;
  typ: MedTyp;
  zdroj_snusky: string;
  barva: string;
  chut: string;
  krystalizace: MedKrystalizace;
  popis_kratky: string;
  description: string;
  image_url?: string | null;
}

const vcelyModules = import.meta.glob('/src/data/vcelarstvi/vcely.yaml', { eager: true, import: 'default' }) as Record<string, unknown>;
const vybaveniModules = import.meta.glob('/src/data/vcelarstvi/vybaveni.yaml', { eager: true, import: 'default' }) as Record<string, unknown>;
const medModules = import.meta.glob('/src/data/vcelarstvi/med.yaml', { eager: true, import: 'default' }) as Record<string, unknown>;

function firstArray<T>(modules: Record<string, unknown>): T[] {
  for (const raw of Object.values(modules)) {
    if (Array.isArray(raw)) return raw as T[];
  }
  return [];
}

let cVcely: Vcela[] | null = null;
let cVybaveni: Vybaveni[] | null = null;
let cMed: Med[] | null = null;

export function getAllVcely(): Vcela[] {
  if (cVcely) return cVcely;
  cVcely = firstArray<Vcela>(vcelyModules).map((v) => ({ ...v, slug: String(v.slug) }));
  cVcely.sort((a, b) => a.name.localeCompare(b.name, 'cs'));
  return cVcely;
}
export function getVcela(slug: string): Vcela | undefined {
  return getAllVcely().find((v) => v.slug === slug);
}

export function getAllVybaveni(): Vybaveni[] {
  if (cVybaveni) return cVybaveni;
  cVybaveni = firstArray<Vybaveni>(vybaveniModules).map((v) => ({ ...v, slug: String(v.slug) }));
  cVybaveni.sort((a, b) => a.name.localeCompare(b.name, 'cs'));
  return cVybaveni;
}
export function getVybaveni(slug: string): Vybaveni | undefined {
  return getAllVybaveni().find((v) => v.slug === slug);
}

export function getAllMed(): Med[] {
  if (cMed) return cMed;
  cMed = firstArray<Med>(medModules).map((v) => ({ ...v, slug: String(v.slug) }));
  cMed.sort((a, b) => a.name.localeCompare(b.name, 'cs'));
  return cMed;
}
export function getMed(slug: string): Med | undefined {
  return getAllMed().find((v) => v.slug === slug);
}

export const VYBAVENI_KATEGORIE_LABELS: Record<VybaveniKategorie, string> = {
  ul: 'Úly',
  ochrana: 'Ochranné pomůcky',
  naradi: 'Nářadí',
  zpracovani: 'Zpracování medu',
  krmeni: 'Krmení a zazimování',
};

export const MED_TYP_LABELS: Record<MedTyp, string> = {
  kvetovy: 'Květový',
  medovicovy: 'Medovicový',
  smiseny: 'Smíšený',
};
```

- [ ] **Step 5: Spustit test — musí projít**

Run: `npm test -- vcelarstvi`
Expected: PASS (5 testů).

- [ ] **Step 6: Commit**

```bash
git add src/lib/vcelarstvi.ts src/data/vcelarstvi/ tests/lib/vcelarstvi.test.ts
git commit -m "feat(vcelarstvi): lib loadery + datová schémata pro katalogy"
```

---

## Task 2: Naplnit katalog druhů včel

**Files:**
- Modify: `src/data/vcelarstvi/vcely.yaml`

- [ ] **Step 1: Doplnit zbývajících 5 druhů**

Přidat do `vcely.yaml` (kraňka už je z Tasku 1) položky se stejnou strukturou. Ověřená fakta níže, prózu `description` (3–5 vět) psát v `czech-ag-article-style`:

| slug | name | latinsky | puvod | temperament | medny_vynos | rojivost | klíč pro popis |
|------|------|----------|-------|-------------|-------------|----------|----------------|
| `tmava-vcela` | Včela tmavá (evropská) | Apis mellifera mellifera | severní a západní Evropa | obranná | střední | nízká | původní evropská včela, dnes vzácná, chráněné populace, tmavé zbarvení, odolná drsnému klimatu |
| `italka` | Včela vlašská (italka) | Apis mellifera ligustica | Itálie | mírná | velmi vysoký | střední | žluté zbarvení, plodná matka, silná letní snůška, vyšší spotřeba zimních zásob, citlivá na chladné zimy |
| `buckfast` | Buckfast | (šlechtěný kříženec) | Anglie (bratr Adam, opatství Buckfast) | mírná | velmi vysoký | nízká | šlechtěná linie, mírnost + výnos + nízká rojivost, nelze čistě dochovávat z vlastních matek |
| `kavkazska` | Včela kavkazská | Apis mellifera caucasica | Kavkaz | mírná | vysoký | nízká | extrémně dlouhý sosák (dosah na jetel), hodně propolisuje, hůře zimuje ve vlhku |
| `kribra` | Včela kraňská — linie Singer/Sklenar/Troiseck | Apis mellifera carnica (linie) | středoevropské chovy | mírná | vysoký | střední | volitelné: pokud chceš zdůraznit chovné linie kraňky — JINAK vynech a nech 5 druhů |

Pozn.: cílem je ≥6 druhů; pokud `kribra` působí příliš odborně, ponech 5 + přidej `vlasska` jako samostatné synonymum není potřeba (italka = vlašská). Minimum splněno i bez poslední řádky → finálně ≥5 reálných taxonů, doplň 6. položku jako `buckfast` linii nebo italku — cíl ≥6.

Každá položka MUSÍ mít `latinsky`, `description` (>20 znaků), `image_url`, ideálně `wikipedia` + 1–2 `faq`.

- [ ] **Step 2: Spustit test**

Run: `npm test -- vcelarstvi`
Expected: PASS — `getAllVcely().length >= 6`, latinské názvy neprázdné.

- [ ] **Step 3: Commit**

```bash
git add src/data/vcelarstvi/vcely.yaml
git commit -m "feat(vcelarstvi): katalog druhů včel (6 taxonů/linií)"
```

---

## Task 3: Naplnit katalog vybavení

**Files:**
- Modify: `src/data/vcelarstvi/vybaveni.yaml`

- [ ] **Step 1: Doplnit ~9 dalších položek** (nástavkový úl už je)

Struktura jako fixture. `related` smí odkazovat jen na slugy v tomto souboru.

| slug | name | kategorie | klíč pro popis |
|------|------|-----------|----------------|
| `langstroth` | Úl Langstroth | ul | nejrozšířenější rámková míra na světě, kompatibilní příslušenství |
| `optimal` | Úl Optimal (39×24) | ul | tradiční česká míra, hojně rozšířená v ČR |
| `mezistena` | Mezistěna | zpracovani | voskový základ s otištěnými buňkami, urychluje stavbu díla |
| `ramek` | Rámek | naradi | dřevěný rámeček nesoucí dílo, drátkování, vkládání mezistěny |
| `medomet` | Medomet | zpracovani | odstředivka medu, ruční vs. elektrický, počet rámků |
| `kurak` | Dýmák (kuřák) | ochrana | kouř zklidňuje včely, palivo, bezpečné používání |
| `vcelarsky-oblek` | Včelařský oblek a kukla | ochrana | ochrana proti žihadlům, prodyšnost, doporučení pro začátečníky |
| `rozperka` | Rozpěrka | naradi | páčidlo na oddělování nástavků a rámků, základní nářadí |
| `krmitko` | Krmítko | krmeni | podávání cukerného roztoku při zazimování / nouzovém krmení |

Pokrýt všech 5 kategorií (`ul`, `ochrana`, `naradi`, `zpracovani`, `krmeni`). Vyplnit `pro_zacatecniky`, `orientacni_cena`, `image_url`, `related`.

- [ ] **Step 2: Spustit test**

Run: `npm test -- vcelarstvi`
Expected: PASS — ≥10 položek, related slugy se resolvují.

- [ ] **Step 3: Commit**

```bash
git add src/data/vcelarstvi/vybaveni.yaml
git commit -m "feat(vcelarstvi): katalog včelařského vybavení"
```

---

## Task 4: Naplnit katalog druhů medu

**Files:**
- Modify: `src/data/vcelarstvi/med.yaml`

- [ ] **Step 1: Doplnit 6 dalších druhů** (akátový už je)

| slug | name | typ | zdroj_snusky | krystalizace | klíč pro popis |
|------|------|-----|--------------|--------------|----------------|
| `kvetovy` | Květový med | kvetovy | nektar různých rostlin | střední | nejběžnější jarní med, světlý, univerzální |
| `medovicovy` | Medovicový (lesní) med | medovicovy | medovice jehličnanů/listnáčů | pomalá | tmavý, výrazný, vyšší obsah minerálů, sbírán v létě |
| `lipovy` | Lipový med | kvetovy | květ lípy | střední | aromatický, tradičně spojován s nachlazením |
| `repkovy` | Řepkový med | kvetovy | květ řepky | rychlá | krystalizuje velmi rychle (do týdnů), nutno včas vytočit, jemně se pastuje |
| `pohankovy` | Pohankový med | kvetovy | květ pohanky | střední | tmavý, výrazná chuť, vysoký obsah antioxidantů |
| `pastovany` | Pastovaný med | smiseny | (úprava medu) | — (řízená) | NE druh snůšky ale úprava: řízené míchání během krystalizace → krémová konzistence; popsat jako technologii |

Pozn.: `pastovany` má `typ: smiseny`, `krystalizace: střední` (je to úprava, ne typ snůšky — v `description` vysvětlit, že jde o zpracování).

- [ ] **Step 2: Spustit test + commit**

Run: `npm test -- vcelarstvi`
Expected: PASS — ≥7 druhů.
```bash
git add src/data/vcelarstvi/med.yaml
git commit -m "feat(vcelarstvi): katalog druhů medu"
```

---

## Task 5: Detailní + listing stránky — druhy včel

**Files:**
- Create: `src/pages/vcelarstvi/druhy/index.astro`
- Create: `src/pages/vcelarstvi/druhy/[slug].astro`

Mirror `src/pages/plemena/[druh]/[plemeno]/index.astro` (layout, spec rows, related, FAQ JSON-LD) a `src/pages/plemena/index.astro` (listing s kartami).

- [ ] **Step 1: Listing `druhy/index.astro`**

```astro
---
export const prerender = true;
import Layout from '../../../layouts/Layout.astro';
import { getAllVcely } from '../../../lib/vcelarstvi';
const vcely = getAllVcely();
const title = 'Druhy včel — přehled chovaných včel medonosných';
const description = 'Kraňka, italka, buckfast a další včely chované v Česku. Temperament, medný výnos, rojivost a vhodnost pro začátečníky.';
---
<Layout title={title} description={description}>
  <main class="container">
    <h1>Druhy včel</h1>
    <p class="lead">{description}</p>
    <div class="card-grid">
      {vcely.map((v) => (
        <a href={`/vcelarstvi/druhy/${v.slug}/`} class="card">
          {v.image_url && <img src={v.image_url} alt={v.name} loading="lazy" width="400" height="260" />}
          <h2>{v.name}</h2>
          <p class="latin">{v.latinsky}</p>
          <p>{v.vhodnost_cr}</p>
        </a>
      ))}
    </div>
  </main>
</Layout>
```
Pozn.: třídy `container`/`card-grid`/`card`/`lead` — zkontrolovat reálné názvy v `plemena/index.astro` a použít stejné, aby styl seděl.

- [ ] **Step 2: Detail `druhy/[slug].astro`**

```astro
---
export const prerender = true;
import Layout from '../../../layouts/Layout.astro';
import { getAllVcely, getVcela } from '../../../lib/vcelarstvi';
import { faqPageSchema } from '../../../lib/structured-data';

export function getStaticPaths() {
  return getAllVcely().map((v) => ({ params: { slug: v.slug } }));
}

const { slug } = Astro.params;
const vcela = getVcela(slug!);
if (!vcela) return Astro.rewrite('/404');

const specs: { label: string; value: string }[] = [
  { label: 'Latinský název', value: vcela.latinsky },
  { label: 'Původ', value: vcela.puvod },
  { label: 'Temperament', value: vcela.temperament },
  { label: 'Medný výnos', value: vcela.medny_vynos },
  { label: 'Rojivost', value: vcela.rojivost },
  { label: 'Zimuvzdornost', value: vcela.zimuvzdornost },
];
if (vcela.barva) specs.push({ label: 'Zbarvení', value: vcela.barva });

const related = getAllVcely().filter((v) => v.slug !== vcela.slug).slice(0, 4);
const jsonld = vcela.faq && vcela.faq.length ? faqPageSchema(vcela.faq) : null;
---
<Layout title={`${vcela.name} (${vcela.latinsky})`} description={vcela.vhodnost_cr}>
  {jsonld && <script type="application/ld+json" set:html={JSON.stringify(jsonld)} slot="head" />}
  <main class="container">
    <nav class="breadcrumb"><a href="/vcelarstvi/">Včelařství</a> › <a href="/vcelarstvi/druhy/">Druhy včel</a> › {vcela.name}</nav>
    <h1>{vcela.name}</h1>
    <p class="latin">{vcela.latinsky}</p>
    {vcela.image_url && <img src={vcela.image_url} alt={vcela.name} width="800" height="500" />}
    <table class="spec-table">
      {specs.map((s) => <tr><th>{s.label}</th><td>{s.value}</td></tr>)}
    </table>
    <div class="prose" set:html={vcela.description.replace(/\n/g, '<br>')} />
    {vcela.wikipedia && <p><a href={vcela.wikipedia} rel="nofollow">Wikipedie: {vcela.name}</a></p>}
    {vcela.faq && vcela.faq.length > 0 && (
      <section><h2>Časté dotazy</h2>
        {vcela.faq.map((f) => <details><summary>{f.q}</summary><p>{f.a}</p></details>)}
      </section>
    )}
    {related.length > 0 && (
      <section><h2>Další druhy včel</h2>
        <ul>{related.map((r) => <li><a href={`/vcelarstvi/druhy/${r.slug}/`}>{r.name}</a></li>)}</ul>
      </section>
    )}
  </main>
</Layout>
```
Pozn.: ověřit přesný podpis `faqPageSchema` v `src/lib/structured-data.ts` a slot pattern pro `<head>` JSON-LD používaný v `plemena` detailu — použít identický (nepřidávat `slot="head"` pokud projekt vkládá JSON-LD jinak).

- [ ] **Step 3: Build ověření**

Run: `npm run build 2>&1 | tail -20`
Expected: build projde; v outputu jsou `vcelarstvi/druhy/<slug>/index.html` pro každý druh.

- [ ] **Step 4: Commit**

```bash
git add src/pages/vcelarstvi/druhy/
git commit -m "feat(vcelarstvi): listing + detail stránky druhů včel"
```

---

## Task 6: Detailní + listing stránky — vybavení

**Files:**
- Create: `src/pages/vcelarstvi/vybaveni/index.astro`
- Create: `src/pages/vcelarstvi/vybaveni/[slug].astro`

- [ ] **Step 1: Listing seskupený po kategoriích**

```astro
---
export const prerender = true;
import Layout from '../../../layouts/Layout.astro';
import { getAllVybaveni, VYBAVENI_KATEGORIE_LABELS, type VybaveniKategorie } from '../../../lib/vcelarstvi';
const all = getAllVybaveni();
const order: VybaveniKategorie[] = ['ul', 'ochrana', 'naradi', 'zpracovani', 'krmeni'];
const grouped = order.map((k) => ({ k, items: all.filter((x) => x.kategorie === k) })).filter((g) => g.items.length);
---
<Layout title="Včelařské vybavení — co potřebujete k včelaření" description="Úly, ochranné pomůcky, nářadí a vybavení pro zpracování medu. Co potřebuje začínající včelař a kolik to stojí.">
  <main class="container">
    <h1>Včelařské vybavení</h1>
    {grouped.map((g) => (
      <section>
        <h2>{VYBAVENI_KATEGORIE_LABELS[g.k]}</h2>
        <div class="card-grid">
          {g.items.map((x) => (
            <a href={`/vcelarstvi/vybaveni/${x.slug}/`} class="card">
              {x.image_url && <img src={x.image_url} alt={x.name} loading="lazy" width="400" height="260" />}
              <h3>{x.name}</h3>
              <p>{x.popis_kratky}</p>
              {x.orientacni_cena && <p class="price">{x.orientacni_cena}</p>}
            </a>
          ))}
        </div>
      </section>
    ))}
  </main>
</Layout>
```

- [ ] **Step 2: Detail `vybaveni/[slug].astro`**

```astro
---
export const prerender = true;
import Layout from '../../../layouts/Layout.astro';
import { getAllVybaveni, getVybaveni, VYBAVENI_KATEGORIE_LABELS } from '../../../lib/vcelarstvi';
export function getStaticPaths() {
  return getAllVybaveni().map((x) => ({ params: { slug: x.slug } }));
}
const { slug } = Astro.params;
const item = getVybaveni(slug!);
if (!item) return Astro.rewrite('/404');
const related = (item.related ?? []).map((r) => getVybaveni(r)).filter(Boolean);
---
<Layout title={item.name} description={item.popis_kratky}>
  <main class="container">
    <nav class="breadcrumb"><a href="/vcelarstvi/">Včelařství</a> › <a href="/vcelarstvi/vybaveni/">Vybavení</a> › {item.name}</nav>
    <h1>{item.name}</h1>
    <p class="kicker">{VYBAVENI_KATEGORIE_LABELS[item.kategorie]}</p>
    {item.image_url && <img src={item.image_url} alt={item.name} width="800" height="500" />}
    <div class="prose" set:html={item.description.replace(/\n/g, '<br>')} />
    {item.orientacni_cena && <p><strong>Orientační cena:</strong> {item.orientacni_cena}</p>}
    {item.pro_zacatecniky && <p>✅ Vhodné pro začátečníky</p>}
    {related.length > 0 && (
      <section><h2>Související vybavení</h2>
        <ul>{related.map((r) => <li><a href={`/vcelarstvi/vybaveni/${r!.slug}/`}>{r!.name}</a></li>)}</ul>
      </section>
    )}
  </main>
</Layout>
```

- [ ] **Step 3: Build + commit**

Run: `npm run build 2>&1 | tail -20`
Expected: PASS, `vcelarstvi/vybaveni/<slug>/` vygenerováno.
```bash
git add src/pages/vcelarstvi/vybaveni/
git commit -m "feat(vcelarstvi): listing + detail stránky vybavení"
```

---

## Task 7: Detailní + listing stránky — druhy medu (se srovnávací tabulkou)

**Files:**
- Create: `src/pages/vcelarstvi/med/index.astro`
- Create: `src/pages/vcelarstvi/med/[slug].astro`

- [ ] **Step 1: Listing se srovnávací tabulkou**

```astro
---
export const prerender = true;
import Layout from '../../../layouts/Layout.astro';
import { getAllMed, MED_TYP_LABELS } from '../../../lib/vcelarstvi';
const med = getAllMed();
---
<Layout title="Druhy medu — přehled a srovnání" description="Květový, medovicový, akátový, lipový, řepkový a další medy. Barva, chuť, rychlost krystalizace a využití v přehledné tabulce.">
  <main class="container">
    <h1>Druhy medu</h1>
    <table class="spec-table">
      <thead><tr><th>Med</th><th>Typ</th><th>Barva</th><th>Krystalizace</th></tr></thead>
      <tbody>
        {med.map((m) => (
          <tr>
            <td><a href={`/vcelarstvi/med/${m.slug}/`}>{m.name}</a></td>
            <td>{MED_TYP_LABELS[m.typ]}</td>
            <td>{m.barva}</td>
            <td>{m.krystalizace}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <div class="card-grid">
      {med.map((m) => (
        <a href={`/vcelarstvi/med/${m.slug}/`} class="card">
          {m.image_url && <img src={m.image_url} alt={m.name} loading="lazy" width="400" height="260" />}
          <h2>{m.name}</h2>
          <p>{m.popis_kratky}</p>
        </a>
      ))}
    </div>
  </main>
</Layout>
```

- [ ] **Step 2: Detail `med/[slug].astro`**

```astro
---
export const prerender = true;
import Layout from '../../../layouts/Layout.astro';
import { getAllMed, getMed, MED_TYP_LABELS } from '../../../lib/vcelarstvi';
export function getStaticPaths() {
  return getAllMed().map((m) => ({ params: { slug: m.slug } }));
}
const { slug } = Astro.params;
const med = getMed(slug!);
if (!med) return Astro.rewrite('/404');
const specs = [
  { label: 'Typ', value: MED_TYP_LABELS[med.typ] },
  { label: 'Zdroj snůšky', value: med.zdroj_snusky },
  { label: 'Barva', value: med.barva },
  { label: 'Chuť', value: med.chut },
  { label: 'Krystalizace', value: med.krystalizace },
];
const related = getAllMed().filter((m) => m.slug !== med.slug).slice(0, 4);
---
<Layout title={med.name} description={med.popis_kratky}>
  <main class="container">
    <nav class="breadcrumb"><a href="/vcelarstvi/">Včelařství</a> › <a href="/vcelarstvi/med/">Druhy medu</a> › {med.name}</nav>
    <h1>{med.name}</h1>
    {med.image_url && <img src={med.image_url} alt={med.name} width="800" height="500" />}
    <table class="spec-table">{specs.map((s) => <tr><th>{s.label}</th><td>{s.value}</td></tr>)}</table>
    <div class="prose" set:html={med.description.replace(/\n/g, '<br>')} />
    {related.length > 0 && (
      <section><h2>Další druhy medu</h2>
        <ul>{related.map((r) => <li><a href={`/vcelarstvi/med/${r.slug}/`}>{r.name}</a></li>)}</ul>
      </section>
    )}
  </main>
</Layout>
```

- [ ] **Step 3: Build + commit**

Run: `npm run build 2>&1 | tail -20`
Expected: PASS.
```bash
git add src/pages/vcelarstvi/med/
git commit -m "feat(vcelarstvi): listing + detail stránky druhů medu"
```

---

## Task 8: Hub stránka `/vcelarstvi/`

**Files:**
- Create: `src/pages/vcelarstvi/index.astro`

- [ ] **Step 1: Rozcestník**

```astro
---
export const prerender = true;
import Layout from '../../layouts/Layout.astro';
import { getAllVcely, getAllVybaveni, getAllMed } from '../../lib/vcelarstvi';
const counts = { vcely: getAllVcely().length, vybaveni: getAllVybaveni().length, med: getAllMed().length };
const sekce = [
  { href: '/vcelarstvi/druhy/', title: 'Druhy včel', desc: `Kraňka, italka, buckfast a další (${counts.vcely})` },
  { href: '/vcelarstvi/vybaveni/', title: 'Vybavení', desc: `Úly, ochrana, nářadí, zpracování (${counts.vybaveni})` },
  { href: '/vcelarstvi/med/', title: 'Druhy medu', desc: `Květový, medovicový, akátový… (${counts.med})` },
  { href: '/jak-na-to/jak-zacit-vcelarit/', title: 'Jak začít včelařit', desc: 'Průvodce pro úplné začátečníky' },
  { href: '/jak-na-to/vcelarsky-rok/', title: 'Včelařský rok', desc: 'Kalendář prací po měsících' },
  { href: '/slovnik/', title: 'Včelařský slovník', desc: 'Pojmy od matky po varroázu' },
  { href: '/kviz/jaka-vcela-pro-vas/', title: 'Kvíz: jaká včela pro vás', desc: 'Najděte vhodnou včelu' },
];
---
<Layout title="Včelařství — druhy včel, vybavení, med a návody" description="Vše pro začínající i pokročilé včelaře: druhy včel, včelařské vybavení, druhy medu, slovník pojmů a praktické návody krok za krokem.">
  <main class="container">
    <h1>Včelařství</h1>
    <p class="lead">Druhy včel, vybavení, med a praktické návody — přehledně pro začátečníky i pokročilé.</p>
    <div class="card-grid">
      {sekce.map((s) => (
        <a href={s.href} class="card"><h2>{s.title}</h2><p>{s.desc}</p></a>
      ))}
    </div>
  </main>
</Layout>
```

- [ ] **Step 2: Build + commit**

Run: `npm run build 2>&1 | tail -5`
```bash
git add src/pages/vcelarstvi/index.astro
git commit -m "feat(vcelarstvi): hub rozcestník /vcelarstvi/"
```

---

## Task 9: Slovník — kategorie `vcelarstvi` + hesla

**Files:**
- Modify: `src/lib/slovnik.ts` (typ union ř.13–14, `KATEGORIE_LABELS` ř.8539, pole `SLOVNIK`)
- Test: `tests/lib/slovnik-vcelarstvi.test.ts`

- [ ] **Step 1: Napsat failing test**

`tests/lib/slovnik-vcelarstvi.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { SLOVNIK, KATEGORIE_LABELS } from '../../src/lib/slovnik';

describe('slovník — včelařství', () => {
  it('má label pro kategorii vcelarstvi', () => {
    expect(KATEGORIE_LABELS.vcelarstvi).toBeTruthy();
  });
  it('obsahuje alespoň 40 včelařských hesel', () => {
    const bee = SLOVNIK.filter((t) => t.kategorie === 'vcelarstvi');
    expect(bee.length).toBeGreaterThanOrEqual(40);
  });
  it('všechny slugy v SLOVNIKu jsou unikátní', () => {
    const slugs = SLOVNIK.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
  it('related odkazy včelařských hesel se resolvují', () => {
    const known = new Set(SLOVNIK.map((t) => t.slug));
    for (const t of SLOVNIK.filter((x) => x.kategorie === 'vcelarstvi')) {
      for (const r of t.related ?? []) expect(known.has(r), `${t.slug} → ${r}`).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Spustit — musí selhat**

Run: `npm test -- slovnik-vcelarstvi`
Expected: FAIL — `KATEGORIE_LABELS.vcelarstvi` undefined.

- [ ] **Step 3: Přidat kategorii do unionu a labelu**

`src/lib/slovnik.ts` ř.13–14 — přidat `| 'vcelarstvi'` na konec unionu `SlovnikKategorie`.
`KATEGORIE_LABELS` (ř.8539) — přidat řádek:
```typescript
  vcelarstvi: 'Včelařství',
```

- [ ] **Step 4: Doplnit ≥45 hesel kategorie `vcelarstvi`**

Vložit na konec pole `SLOVNIK` (před uzavírací `];`). Každé heslo dle interface `SlovnikTerm` (`slug`, `term`, `kategorie: 'vcelarstvi'`, `shortDef` 1 věta, `longDef` 3–5 odstavců, `related`). Prózu psát v `czech-ag-article-style`. Povinný seznam hesel (slug — term):

`matka` — Matka (královna) · `delnice` — Dělnice · `trubec` — Trubec ·
`vcelstvo` — Včelstvo · `plast` — Plást · `dilo` — Dílo · `ramek` — Rámek ·
`nastavek` — Nástavek · `plodiste` — Plodiště · `mednik` — Medník ·
`materi-mrizka` — Mateří mřížka · `materi-kasicka` — Mateří kašička ·
`propolis` — Propolis · `vcelivosk` — Včelí vosk · `pyl` — Pyl (rousky) ·
`snuska` — Snůška · `medovice` — Medovice · `nektar` — Nektar ·
`rojeni` — Rojení · `roj` — Roj · `oddelek` — Oddělek · `matecnik` — Matečník ·
`zavickovani` — Zavíčkování · `plod` — Plod · `zakladani-plodu` — Kladení matky ·
`varroaza` — Varroáza · `klestik` — Kleštík včelí (Varroa destructor) ·
`mor-vceliho-plodu` — Mor včelího plodu · `hniloba-plodu` — Hniloba včelího plodu ·
`nosema` — Nosematóza · `medomet` — Medomet · `mezistena` — Mezistěna ·
`rozperka` — Rozpěrka · `dymak` — Dýmák (kuřák) · `smetacek` — Smetáček ·
`uzlik` — Úl · `zazimovani` — Zazimování · `vyzimovani` — Vyzimování ·
`snubni-prolet` — Snubní prolet · `tanecek` — Včelí tanec ·
`medny-vynos` — Medný výnos · `pastovani` — Pastování medu ·
`vytacenie` — Vytáčení medu · `vcelin` — Včelín · `kocovani` — Kočování ·
`cmsch` — ČMSCH (registrace včelařů)

(≥45 hesel; `related` propojit logicky — např. `matka` ↔ `materi-mrizka`,
`materi-kasicka`, `delnice`, `trubec`; `varroaza` ↔ `klestik`, `medomet`).
Pozor na duplicitní slugy s existujícími hesly (`ramek` mohl existovat? zkontroluj `grep -n "slug: 'ramek'" src/lib/slovnik.ts` — pokud ano, použít `vcelarsky-ramek`).

- [ ] **Step 5: Spustit test — musí projít**

Run: `npm test -- slovnik-vcelarstvi`
Expected: PASS (4 testy).

- [ ] **Step 6: Commit**

```bash
git add src/lib/slovnik.ts tests/lib/slovnik-vcelarstvi.test.ts
git commit -m "feat(slovnik): kategorie Včelařství + 45 hesel"
```

---

## Task 10: Průvodci — 6 howto MD souborů

**Files:**
- Create: `src/content/howto/jak-zacit-vcelarit.md`
- Create: `src/content/howto/vcelarsky-rok.md`
- Create: `src/content/howto/boj-s-varroazou.md`
- Create: `src/content/howto/zpracovani-medu.md`
- Create: `src/content/howto/zazimovani-vcelstev.md`
- Create: `src/content/howto/registrace-vcelaru.md`

Schéma viz `howto` v `src/content.config.ts` (ř.152–175): povinné `title`, `slug`, `description`, `datePublished` (`YYYY-MM-DD`), `steps[]` (`{name, text}`); volitelné `lastVerified`, `totalTime`, `obtiznost`, `tools[]`, `supplies[]`, `faq[]`, `relatedUrl`, `relatedLabel`.

- [ ] **Step 1: Vzor frontmatteru (`jak-zacit-vcelarit.md`)**

```markdown
---
title: "Jak začít včelařit: kompletní průvodce pro začátečníky"
slug: "jak-zacit-vcelarit"
description: "Co potřebujete k prvnímu včelstvu, kolik to stojí, jakou včelu zvolit a jak postupovat v první sezóně."
datePublished: 2026-05-29
lastVerified: 2026-05-29
obtiznost: "Pro začátečníky"
tools: ["Nástavkový úl", "Včelařský oblek a kukla", "Dýmák", "Rozpěrka"]
supplies: ["Včelstvo nebo oddělek", "Cukr na zazimování", "Mezistěny"]
relatedUrl: "/vcelarstvi/vybaveni/"
relatedLabel: "Včelařské vybavení"
steps:
  - name: "Zjistěte si povinnosti a zaregistrujte se"
    text: "Včelaře a stanoviště je nutné nahlásit ČMSCH. Projděte si také obecní vyhlášky a vztahy se sousedy."
  - name: "Vyberte umístění stanoviště"
    text: "Klidné, slunné místo s ranním sluncem, závětří a dostatkem snůšky v okolí (do ~3 km)."
  - name: "Pořiďte úl a základní vybavení"
    text: "Pro start stačí jeden nástavkový úl, oblek s kuklou, dýmák a rozpěrka."
  - name: "Pořiďte si první včelstvo nebo oddělek"
    text: "Začátečníkům se doporučuje koupit oddělek od důvěryhodného včelaře na jaře."
  - name: "Naučte se základní úkony a sledujte včelstvo"
    text: "Pravidelná kontrola, prevence rojení, monitoring varroázy a včasné rozšiřování úlu."
faq:
  - q: "Kolik stojí začít včelařit?"
    a: "Základní výbava (úl, oblek, nářadí) a oddělek vyjdou orientačně na 6 000–12 000 Kč."
  - q: "Kolik včelstev je dobré mít na začátku?"
    a: "Ideálně dvě — můžete je porovnávat a v případě problému jedno zachránit z druhého."
---

Úvodní odstavec a rozšiřující text v `czech-ag-article-style` (tón, délka). Odkazy interně na /vcelarstvi/druhy/, /vcelarstvi/vybaveni/, /slovnik/.
```

- [ ] **Step 2: Zbylých 5 průvodců** — stejné schéma, obsah dle tématu:

- `vcelarsky-rok.md` — „Včelařský rok: kalendář prací měsíc po měsíci". `steps` = klíčová období (jaro/rozvoj, snůška, vytáčení, letní ošetření, zazimování, zimní klid). `totalTime` vynech.
- `boj-s-varroazou.md` — „Boj s varroázou: monitoring a ošetření". `steps` = měření spadu, letní ošetření (kyselina mravenčí), podzimní/zimní ošetření (kyselina šťavelová), kontrola účinnosti. `relatedUrl: /slovnik/varroaza/`.
- `zpracovani-medu.md` — „Zpracování medu: od vytáčení po sklenici". `steps` = odvíčkování, vytáčení medometem, cezení, odstátí/sběr pěny, plnění, případné pastování. `relatedUrl: /vcelarstvi/med/`.
- `zazimovani-vcelstev.md` — „Zazimování včelstev krok za krokem". `steps` = kontrola zásob, krmení cukerným roztokem, zúžení česna, zateplení, ochrana před hlodavci, zimní kontrola. `relatedUrl: /jak-na-to/boj-s-varroazou/`.
- `registrace-vcelaru.md` — „Registrace včelaře a stanovišť (ČMSCH)". `steps` = registrace u ČMSCH, hlášení počtu včelstev a stanovišť, dotace 1.D, povinnosti při přemístění. `relatedUrl: /slovnik/cmsch/`.

Fakta o dotacích/legislativě ověřit (ČMSCH = Českomoravská společnost chovatelů, povinná evidence); pokud si konkrétní číslo nejsi jistý, formulovat obecně bez vymýšlení částek.

- [ ] **Step 3: Build ověření**

Run: `npm run build 2>&1 | tail -20`
Expected: PASS; `jak-na-to/<slug>/` vygenerováno pro 6 nových; HowTo JSON-LD na stránce (howto pattern už řeší).

- [ ] **Step 4: Commit**

```bash
git add src/content/howto/
git commit -m "feat(vcelarstvi): 6 průvodců (jak začít, včelařský rok, varroáza, med, zazimování, registrace)"
```

---

## Task 11: Recommender kvíz „Jaká včela pro vás"

**Files:**
- Create: `src/pages/kviz/jaka-vcela-pro-vas.astro`
- Modify: `src/pages/kviz/index.astro` (přidat dlaždici)

Mirror strukturu `src/pages/kviz/jaky-traktor-potrebujete.astro` (samostatná recommender stránka s vanilla-JS vyhodnocením; NE pole v `kviz.ts`). **Pozn.:** podle [[feedback-astro-is-global-js-elements]] — pokud kvíz vytváří DOM elementy přes JS, použít `<style is:global>` s namespace prefixem (např. `qv-*`), ne scoped `<style>`.

- [ ] **Step 1: Přečíst vzor**

Run: `sed -n '1,80p' src/pages/kviz/jaky-traktor-potrebujete.astro`
Pochopit, jak stránka renderuje otázky, počítá skóre a mapuje na výsledek.

- [ ] **Step 2: Vytvořit kvíz**

3–4 otázky (zkušenost, snášení žihadel/temperament, priorita výnos vs. mírnost, region/klima) → výsledek doporučí jednu z `/vcelarstvi/druhy/` (kraňka pro začátečníky-mírnost, italka pro výnos, buckfast pro mírnost+výnos, kavkazská pro klid+propolis). Každý výsledek odkazuje na příslušný detail druhu. Title: „Kvíz: jaká včela je pro vás vhodná". Description pro SEO.

- [ ] **Step 3: Přidat dlaždici do `kviz/index.astro`**

Najít pole/seznam kvízů v `src/pages/kviz/index.astro` (analogie k `jaky-traktor-potrebujete`) a přidat položku odkazující na `/kviz/jaka-vcela-pro-vas/`.

- [ ] **Step 4: Build + manuální kontrola**

Run: `npm run build 2>&1 | tail -10`
Expected: `kviz/jaka-vcela-pro-vas/index.html` vygenerováno.

- [ ] **Step 5: Commit**

```bash
git add src/pages/kviz/jaka-vcela-pro-vas.astro src/pages/kviz/index.astro
git commit -m "feat(vcelarstvi): recommender kvíz Jaká včela pro vás"
```

---

## Task 12: Navigace + sitemap

**Files:**
- Modify: `src/components/Header.astro` (ř.18 — za „Zvířata")
- Modify: `src/pages/sitemap.xml.ts` (staticPaths ř.100+ a nové smyčky)

- [ ] **Step 1: Nav položka**

V `src/components/Header.astro` do pole `nav` za `{ label: 'Zvířata', href: '/plemena/' },` (ř.18) vložit:
```typescript
  {
    label: 'Včelařství',
    href: '/vcelarstvi/',
    children: [
      { label: 'Úvod do včelaření', href: '/vcelarstvi/' },
      { label: 'Druhy včel', href: '/vcelarstvi/druhy/' },
      { label: 'Vybavení', href: '/vcelarstvi/vybaveni/' },
      { label: 'Druhy medu', href: '/vcelarstvi/med/' },
      { label: 'Jak začít včelařit', href: '/jak-na-to/jak-zacit-vcelarit/' },
      { label: 'Kvíz: jaká včela', href: '/kviz/jaka-vcela-pro-vas/' },
    ],
  },
```

- [ ] **Step 2: Sitemap — statické huby**

Do pole `staticPaths` v `src/pages/sitemap.xml.ts` (za řádek se `/plemena/`, ř.114) přidat:
```typescript
    ['/vcelarstvi/', 'weekly', '0.85', STATIC_LASTMOD],
    ['/vcelarstvi/druhy/', 'weekly', '0.8', STATIC_LASTMOD],
    ['/vcelarstvi/vybaveni/', 'weekly', '0.8', STATIC_LASTMOD],
    ['/vcelarstvi/med/', 'weekly', '0.8', STATIC_LASTMOD],
    ['/kviz/jaka-vcela-pro-vas/', 'monthly', '0.7', STATIC_LASTMOD],
```

- [ ] **Step 3: Sitemap — dynamické smyčky katalogů**

Na vhodné místo (např. za blok plemen, ř.279) přidat:
```typescript
  // Včelařství — katalogy druhů včel, vybavení a medu.
  const { getAllVcely, getAllVybaveni, getAllMed } = await import('../lib/vcelarstvi');
  for (const v of getAllVcely()) {
    urls.push({ loc: `${SITE_URL}/vcelarstvi/druhy/${v.slug}/`, changefreq: 'monthly', priority: '0.7', lastmod: STATIC_LASTMOD, images: v.image_url ? [v.image_url] : undefined });
  }
  for (const x of getAllVybaveni()) {
    urls.push({ loc: `${SITE_URL}/vcelarstvi/vybaveni/${x.slug}/`, changefreq: 'monthly', priority: '0.65', lastmod: STATIC_LASTMOD, images: x.image_url ? [x.image_url] : undefined });
  }
  for (const m of getAllMed()) {
    urls.push({ loc: `${SITE_URL}/vcelarstvi/med/${m.slug}/`, changefreq: 'monthly', priority: '0.65', lastmod: STATIC_LASTMOD, images: m.image_url ? [m.image_url] : undefined });
  }
```
(Slovník i howto jsou v sitemapě iterovány automaticky — nové hesla a průvodci se přidají sami.)

- [ ] **Step 4: Build + ověřit sitemap**

Run: `npm run build 2>&1 | tail -10`
Then: `npm run preview &` + `curl -s localhost:4321/sitemap.xml | grep -c vcelarstvi`
Expected: počet ≥ (4 huby + počet druhů + vybavení + med). Žádná vcelarstvi URL nechybí (lekce sitemap/prerender mismatch).

- [ ] **Step 5: Commit**

```bash
git add src/components/Header.astro src/pages/sitemap.xml.ts
git commit -m "feat(vcelarstvi): navigace + sitemap (huby, katalogy, kvíz)"
```

---

## Task 13: Obrázky

**Files:**
- Create: `public/images/vcelarstvi/{druhy,vybaveni,med}/*.webp`

- [ ] **Step 1: Druhy včel přes Wikidata P18**

Použít pattern [[reference-wikidata-p18-batch-photos]]: pro každý druh s `wikidata`/`wikipedia` dotáhnout P18 z Wikimedia Commons, filtrovat `\.(jpg|png|webp)$`, stáhnout, převést na `.webp`, uložit do `public/images/vcelarstvi/druhy/<slug>.webp`. Aktualizovat `image_url` v `vcely.yaml` jen pokud foto reálně existuje.

- [ ] **Step 2: Vybavení a med**

Volné fotky z Commons kde existují; kde ne, AI fallback `gpt-image-1` (čisté produktové/ilustrační záběry úlu, medometu, sklenic medu). Uložit jako `.webp`. Položky bez fotky nechat `image_url` prázdné — UI má guard (`{x.image_url && ...}`).

- [ ] **Step 3: Build + commit**

Run: `npm run build 2>&1 | tail -5`
```bash
git add public/images/vcelarstvi/ src/data/vcelarstvi/
git commit -m "feat(vcelarstvi): obrázky druhů včel (Wikidata P18) + vybavení/med"
```

---

## Task 14: Finální ověření celé sekce

- [ ] **Step 1: Plný test + build**

Run: `npm test && npm run build 2>&1 | tail -20`
Expected: všechny testy PASS; build bez chyb/varování o broken routes.

- [ ] **Step 2: Spot-check 5 URL přes preview**

Run: `npm run preview &` pak `curl -s -o /dev/null -w "%{http_code}\n" localhost:4321/<path>` pro:
`/vcelarstvi/`, `/vcelarstvi/druhy/kranska/`, `/vcelarstvi/vybaveni/medomet/`, `/vcelarstvi/med/akatovy/`, `/kviz/jaka-vcela-pro-vas/`.
Expected: 5× `200`.

- [ ] **Step 3: Manuální vizuální kontrola**

Otevřít `/vcelarstvi/` v prohlížeči: nav „Včelařství" funguje, dlaždice odkazují správně, fotky se zobrazují (kde jsou), srovnávací tabulka medu se renderuje, kvíz vyhodnotí výsledek.

- [ ] **Step 4: Push + PR (po souhlasu uživatele)**

```bash
git push -u origin feat/vcelarstvi-sekce
gh pr create --title "feat: včelařská sekce /vcelarstvi/ (druhy včel, vybavení, med, slovník, průvodci, kvíz)" --body "Nová obsahová sekce dle specu docs/superpowers/specs/2026-05-29-vcelarstvi-sekce-design.md"
```

---

## Self-review (proti specu)

- **Hub** → Task 8 ✓
- **Druhy včel (≥6, YAML)** → Task 2 + 5 ✓
- **Slovník (≥50 hesel)** → Task 9 (cíl ≥45 v testu; doplnit na 50 při psaní — viz akceptační kritérium 3) ✓
- **Vybavení (≥8)** → Task 3 + 6 ✓
- **Druhy medu (≥7) + srovnávací tabulka** → Task 4 + 7 ✓
- **Průvodci (≥6, howto)** → Task 10 ✓
- **Kvíz** → Task 11 ✓
- **Nav + sitemap (bez oříznutí)** → Task 12 ✓
- **Obrázky (Wikidata P18 + fallback)** → Task 13 ✓
- **Mapa farem** → mimo rozsah (spec to deklaruje); nic zde ✓
- **Kalkulačky (stretch)** → vědomě vynecháno z plánu (lze přidat samostatně) — pokud chce uživatel zařadit, doplní se jako Task 15/16 dle vzoru `kalkulacka/uspora-nafty/`.

Pozn. k akceptačnímu kritériu 3 (≥50 hesel): seznam v Tasku 9 má 46 položek; při psaní doplnit ≥4 další (např. `cesno`, `vcelstvo-oddelek`, `medocukrove-testo`, `oplodnacek`) na splnění ≥50. Test je nastaven na ≥40 jako bezpečnostní práh, ne strop.
```
